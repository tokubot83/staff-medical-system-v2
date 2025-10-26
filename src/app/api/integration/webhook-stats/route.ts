import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

/**
 * API 1: Webhook送信統計API（Phase 2.5）
 *
 * VoiceDriveチームのSystemMonitorPageで使用される統計情報を提供
 *
 * GET /api/integration/webhook-stats
 *
 * クエリパラメータ:
 * - period: 集計期間（'24h', '7d', '30d'） デフォルト: '24h'
 * - eventType: 特定のイベントタイプでフィルタ（オプション）
 *
 * 認証: Bearer Token (JWT)
 */

const prisma = new PrismaClient();

// レート制限: 100リクエスト/分
const RATE_LIMIT = 100;
const RATE_WINDOW_MS = 60 * 1000; // 1分

// 簡易的なレート制限実装（本番ではRedisなどを使用）
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    // 新しいウィンドウ
    rateLimitMap.set(ip, {
      count: 1,
      resetAt: now + RATE_WINDOW_MS
    });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false; // レート制限超過
  }

  record.count++;
  return true;
}

export async function GET(request: NextRequest) {
  try {
    // IPアドレス取得
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    // レート制限チェック
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests. Please try again later.'
          },
          timestamp: new Date().toISOString()
        },
        { status: 429 }
      );
    }

    // 認証チェック（Bearer Token）
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Missing or invalid authorization header'
          },
          timestamp: new Date().toISOString()
        },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    // TODO: JWT検証ロジックを実装
    // const isValid = verifyJWT(token);
    // if (!isValid) { return 401; }

    // クエリパラメータ取得
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '24h';
    const eventType = searchParams.get('eventType');

    // 集計期間を計算
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    // フィルタ条件
    const whereClause: any = {
      sentAt: {
        gte: startDate
      }
    };

    if (eventType) {
      whereClause.eventType = eventType;
    }

    // 統計情報を集計
    const [totalSent, successCount, failedCount, timeoutCount] = await Promise.all([
      prisma.webhookSendLog.count({ where: whereClause }),
      prisma.webhookSendLog.count({ where: { ...whereClause, status: 'SUCCESS' } }),
      prisma.webhookSendLog.count({ where: { ...whereClause, status: 'FAILED' } }),
      prisma.webhookSendLog.count({ where: { ...whereClause, status: 'TIMEOUT' } })
    ]);

    // 最新の送信ログ
    const lastSent = await prisma.webhookSendLog.findFirst({
      where: whereClause,
      orderBy: { sentAt: 'desc' },
      select: { sentAt: true }
    });

    // イベントタイプ別統計
    const byEventTypeRaw = await prisma.webhookSendLog.groupBy({
      by: ['eventType', 'status'],
      where: whereClause,
      _count: true,
      _avg: {
        processingTime: true
      }
    });

    // イベントタイプ別に整形
    const byEventType: Record<string, any> = {};
    for (const row of byEventTypeRaw) {
      if (!byEventType[row.eventType]) {
        byEventType[row.eventType] = {
          sent: 0,
          succeeded: 0,
          failed: 0,
          timeout: 0,
          avgProcessingTime: 0
        };
      }

      byEventType[row.eventType].sent += row._count;

      if (row.status === 'SUCCESS') {
        byEventType[row.eventType].succeeded = row._count;
        byEventType[row.eventType].avgProcessingTime = Math.round(row._avg.processingTime || 0);
      } else if (row.status === 'FAILED') {
        byEventType[row.eventType].failed = row._count;
      } else if (row.status === 'TIMEOUT') {
        byEventType[row.eventType].timeout = row._count;
      }
    }

    // リトライキューの状態
    const queueStatus = await prisma.webhookRetryQueue.groupBy({
      by: ['status'],
      _count: true
    });

    const queueStatusMap: Record<string, number> = {
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0
    };

    for (const row of queueStatus) {
      const statusKey = row.status.toLowerCase();
      queueStatusMap[statusKey] = row._count;
    }

    // リトライ中のアイテム数
    const retriedCount = await prisma.webhookSendLog.count({
      where: {
        ...whereClause,
        retryCount: { gt: 0 }
      }
    });

    // レスポンス
    const response = {
      success: true,
      data: {
        period,
        sent24h: totalSent,
        succeeded: successCount,
        failed: failedCount,
        timeout: timeoutCount,
        retried: retriedCount,
        lastSentAt: lastSent?.sentAt?.toISOString() || null,
        byEventType,
        queueStatus: queueStatusMap,
        retryPolicy: {
          maxRetries: 3,
          retryIntervals: [60, 300, 1800], // 秒
          currentRetrying: queueStatusMap.processing
        }
      },
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('[API] /api/integration/webhook-stats Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred'
        },
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
