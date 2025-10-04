/**
 * 健康データアクセス監査ログ閲覧API
 *
 * システム管理者（レベル99）専用
 * 健康データへの全アクセスを監視・検索
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  searchHealthDataAuditLogs,
  getHealthDataAccessStatistics,
  detectSuspiciousHealthDataAccess,
  type HealthDataAuditQuery,
} from '@/lib/audit/health-data-audit';

export interface HealthAuditSearchRequest {
  startDate?: string;
  endDate?: string;
  userId?: string;
  targetStaffId?: string;
  dataType?: string;
  action?: string;
  accessGranted?: boolean;
}

export interface HealthAuditSearchResponse {
  success: boolean;
  message?: string;
  data?: {
    logs: any[];
    statistics?: any;
    suspiciousAccess?: any[];
  };
  error?: string;
}

/**
 * GET /api/admin/health-audit
 * 健康データアクセス監査ログを検索
 */
export async function GET(request: NextRequest): Promise<NextResponse<HealthAuditSearchResponse>> {
  try {
    // TODO: 認証チェック - システム管理者権限（レベル99）確認
    // const session = await getServerSession();
    // const userLevel = await getUserLevel(session?.user?.id);
    const userLevel = 99; // 仮のレベル

    if (userLevel !== 99) {
      return NextResponse.json(
        {
          success: false,
          message: 'アクセス権限がありません（システム管理者のみ）',
          error: 'INSUFFICIENT_PERMISSION',
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);

    // クエリパラメータの解析
    const query: HealthDataAuditQuery = {};

    if (searchParams.get('startDate')) {
      query.startDate = new Date(searchParams.get('startDate')!);
    }

    if (searchParams.get('endDate')) {
      query.endDate = new Date(searchParams.get('endDate')!);
    }

    if (searchParams.get('userId')) {
      query.userId = searchParams.get('userId')!;
    }

    if (searchParams.get('targetStaffId')) {
      query.targetStaffId = searchParams.get('targetStaffId')!;
    }

    if (searchParams.get('dataType')) {
      query.dataType = searchParams.get('dataType') as any;
    }

    if (searchParams.get('action')) {
      query.action = searchParams.get('action') as any;
    }

    if (searchParams.get('accessGranted')) {
      query.accessGranted = searchParams.get('accessGranted') === 'true';
    }

    // 監査ログ検索
    const logs = await searchHealthDataAuditLogs(query);

    // 統計情報を取得（日付範囲指定時のみ）
    let statistics = undefined;
    if (query.startDate && query.endDate) {
      statistics = await getHealthDataAccessStatistics(query.startDate, query.endDate);
    }

    // 不審なアクセスパターンの検出（特定ユーザー検索時のみ）
    let suspiciousAccess = undefined;
    if (query.userId) {
      const detection = await detectSuspiciousHealthDataAccess(query.userId);
      if (detection.suspicious) {
        suspiciousAccess = [detection];
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          logs,
          statistics,
          suspiciousAccess,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('健康データ監査ログ検索エラー:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'サーバーエラーが発生しました',
        error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/health-audit/detect-suspicious
 * 不審な健康データアクセスパターンを一括検出
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // TODO: 認証チェック - システム管理者権限（レベル99）確認
    const userLevel = 99; // 仮のレベル

    if (userLevel !== 99) {
      return NextResponse.json(
        {
          success: false,
          message: 'アクセス権限がありません（システム管理者のみ）',
          error: 'INSUFFICIENT_PERMISSION',
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { hoursToCheck = 24 } = body;

    // 過去24時間の健康データアクセスを取得
    const recentLogs = await searchHealthDataAuditLogs({
      startDate: new Date(Date.now() - hoursToCheck * 60 * 60 * 1000),
    });

    // ユーザーごとにグループ化
    const userAccessMap = new Map<string, any[]>();
    recentLogs.forEach((log) => {
      if (!userAccessMap.has(log.userId)) {
        userAccessMap.set(log.userId, []);
      }
      userAccessMap.get(log.userId)!.push(log);
    });

    // 各ユーザーの不審なアクセスパターンを検出
    const suspiciousUsers = [];
    for (const [userId, logs] of userAccessMap) {
      const detection = await detectSuspiciousHealthDataAccess(userId, hoursToCheck);
      if (detection.suspicious) {
        suspiciousUsers.push({
          userId,
          ...detection,
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          hoursChecked: hoursToCheck,
          totalUsersChecked: userAccessMap.size,
          suspiciousUsers,
          suspiciousCount: suspiciousUsers.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('不審アクセス検出エラー:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'サーバーエラーが発生しました',
        error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
      },
      { status: 500 }
    );
  }
}
