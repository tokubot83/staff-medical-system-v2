import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

/**
 * API 2: 面談完了統計API（Phase 2.5）
 *
 * VoiceDriveチームのSystemMonitorPageで使用される面談統計情報を提供
 *
 * GET /api/interviews/completion-stats
 *
 * クエリパラメータ:
 * - period: 集計期間（'24h', '7d', '30d'） デフォルト: '7d'
 * - facility: 施設でフィルタ（オプション）
 * - department: 部署でフィルタ（オプション）
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
    const period = searchParams.get('period') || '7d';
    const facilityFilter = searchParams.get('facility');
    const departmentFilter = searchParams.get('department');

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
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // フィルタ条件（Interviewテーブル用）
    const whereClause: any = {
      interviewDate: {
        gte: startDate
      }
    };

    // 施設・部署フィルタ（Employeeとのjoin必要）
    if (facilityFilter || departmentFilter) {
      whereClause.employee = {};
      if (facilityFilter) {
        whereClause.employee.facilityId = facilityFilter;
      }
      if (departmentFilter) {
        whereClause.employee.departmentId = departmentFilter;
      }
    }

    // 統計情報を集計
    const [
      totalScheduled,
      completedCount,
      cancelledCount,
      noShowCount,
      rescheduledCount
    ] = await Promise.all([
      prisma.interview.count({ where: whereClause }),
      prisma.interview.count({ where: { ...whereClause, interviewStatus: 'COMPLETED' } }),
      prisma.interview.count({ where: { ...whereClause, interviewStatus: 'CANCELLED' } }),
      prisma.interview.count({ where: { ...whereClause, interviewStatus: 'NO_SHOW' } }),
      prisma.interview.count({ where: { ...whereClause, interviewStatus: 'RESCHEDULED' } })
    ]);

    const scheduledCount = await prisma.interview.count({
      where: { ...whereClause, interviewStatus: 'SCHEDULED' }
    });

    // 完了率計算
    const completionRate = totalScheduled > 0
      ? Math.round((completedCount / totalScheduled) * 100 * 10) / 10
      : 0;

    // 無断欠席率計算
    const noShowRate = totalScheduled > 0
      ? Math.round((noShowCount / totalScheduled) * 100 * 10) / 10
      : 0;

    // 面談タイプ別統計
    const byTypeRaw = await prisma.interview.groupBy({
      by: ['interviewType', 'interviewStatus'],
      where: whereClause,
      _count: true
    });

    // 面談タイプ別に整形
    const byType: Record<string, any> = {};
    for (const row of byTypeRaw) {
      if (!byType[row.interviewType]) {
        byType[row.interviewType] = {
          total: 0,
          completed: 0,
          scheduled: 0,
          cancelled: 0,
          noShow: 0,
          rescheduled: 0,
          completionRate: 0
        };
      }

      byType[row.interviewType].total += row._count;

      switch (row.interviewStatus) {
        case 'COMPLETED':
          byType[row.interviewType].completed = row._count;
          break;
        case 'SCHEDULED':
          byType[row.interviewType].scheduled = row._count;
          break;
        case 'CANCELLED':
          byType[row.interviewType].cancelled = row._count;
          break;
        case 'NO_SHOW':
          byType[row.interviewType].noShow = row._count;
          break;
        case 'RESCHEDULED':
          byType[row.interviewType].rescheduled = row._count;
          break;
      }
    }

    // 完了率を計算
    for (const type of Object.keys(byType)) {
      const typeData = byType[type];
      typeData.completionRate = typeData.total > 0
        ? Math.round((typeData.completed / typeData.total) * 100 * 10) / 10
        : 0;
    }

    // 平均面談時間（完了した面談のみ）
    const avgDuration = await prisma.interview.aggregate({
      where: {
        ...whereClause,
        interviewStatus: 'COMPLETED',
        durationMinutes: { not: null }
      },
      _avg: {
        durationMinutes: true
      }
    });

    // VoiceDrive連携統計
    const voicedriveSyncedCount = await prisma.interview.count({
      where: {
        ...whereClause,
        voicedriveSyncId: { not: null }
      }
    });

    const voicedriveSyncRate = totalScheduled > 0
      ? Math.round((voicedriveSyncedCount / totalScheduled) * 100 * 10) / 10
      : 0;

    // 再予約統計
    const rescheduledInterviews = await prisma.interview.findMany({
      where: {
        ...whereClause,
        rescheduledFromId: { not: null }
      },
      select: {
        id: true,
        rescheduledFromId: true,
        interviewDate: true
      },
      take: 10 // 最新10件
    });

    // レスポンス
    const response = {
      success: true,
      data: {
        period,
        summary: {
          totalScheduled,
          completed: completedCount,
          scheduled: scheduledCount,
          cancelled: cancelledCount,
          noShow: noShowCount,
          rescheduled: rescheduledCount,
          completionRate,
          noShowRate,
          avgDurationMinutes: Math.round(avgDuration._avg.durationMinutes || 0)
        },
        byType,
        voicedrive: {
          syncedCount: voicedriveSyncedCount,
          syncRate: voicedriveSyncRate,
          unsyncedCount: totalScheduled - voicedriveSyncedCount
        },
        rescheduling: {
          total: rescheduledCount,
          recent: rescheduledInterviews.map(i => ({
            interviewId: i.id,
            originalId: i.rescheduledFromId,
            newDate: i.interviewDate.toISOString()
          }))
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
    console.error('[API] /api/interviews/completion-stats Error:', error);

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
