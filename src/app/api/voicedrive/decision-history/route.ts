import { NextRequest, NextResponse } from 'next/server';
import type {
  DecisionHistoryResponse,
  DecisionHistoryFilter,
  ExpiredEscalationDecision,
} from '@/services/voicedrive/types';

// 動的レンダリングを強制（ビルド時の静的生成をスキップ）
export const dynamic = 'force-dynamic'

/**
 * Phase 6: 期限到達判断履歴API
 * GET /api/voicedrive/decision-history
 *
 * VoiceDriveから受け取った期限到達提案の判断履歴を取得
 * 権限レベル別のフィルタリング機能を提供
 */

// Phase 6 統合: VoiceDrive APIからデータ取得
// フォールバック: VoiceDrive API障害時はテストデータを使用
import testData from '@/../mcp-shared/logs/phase6-test-data-20251020.json';

/**
 * VoiceDrive APIからデータを取得
 * リトライ機構付き
 */
async function fetchFromVoiceDriveAPI(
  params: {
    userId: string;
    userLevel: number;
    facilityId?: string;
    departmentId?: string;
    dateFrom?: string;
    dateTo?: string;
  },
  retryCount: number = 3
): Promise<{ success: boolean; data?: any; error?: string }> {
  const apiUrl = process.env.VOICEDRIVE_DECISION_HISTORY_API_URL || 'http://localhost:3003/api/agenda/expired-escalation-history';
  const timeout = parseInt(process.env.VOICEDRIVE_API_TIMEOUT || '10000', 10);
  const bearerToken = process.env.VOICEDRIVE_BEARER_TOKEN;

  for (let attempt = 1; attempt <= retryCount; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const queryParams = new URLSearchParams({
        userId: params.userId,
        permissionLevel: params.userLevel.toString(),
        ...(params.facilityId && { facilityId: params.facilityId }),
        ...(params.departmentId && { departmentId: params.departmentId }),
        ...(params.dateFrom && { dateFrom: params.dateFrom }),
        ...(params.dateTo && { dateTo: params.dateTo }),
      });

      const response = await fetch(`${apiUrl}?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`VoiceDrive API returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.warn(`VoiceDrive API attempt ${attempt}/${retryCount} failed:`, error);

      if (attempt === retryCount) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }

      // 次のリトライまで待機（エクスポネンシャルバックオフ）
      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 500));
    }
  }

  return { success: false, error: 'All retry attempts failed' };
}

/**
 * 権限レベル別フィルタリングロジック
 * VoiceDrive実装仕様に準拠
 */
function filterByPermissionLevel(
  decisions: ExpiredEscalationDecision[],
  userLevel: number,
  userId: string,
  userFacilityId: string | null
): ExpiredEscalationDecision[] {
  return decisions.filter((decision) => {
    // LEVEL_1-4: 自分の判断のみ
    if (userLevel >= 1 && userLevel <= 4) {
      return decision.deciderId === userId;
    }

    // LEVEL_5-6: 自部署の判断のみ
    if (userLevel >= 5 && userLevel <= 6) {
      return decision.deciderId === userId;
    }

    // LEVEL_7-8: 自施設の判断のみ（副看護部長・看護部長など）
    if (userLevel >= 7 && userLevel <= 8) {
      return decision.deciderFacilityId === userFacilityId;
    }

    // LEVEL_9-13: 自施設の全判断（施設長・副施設長・事務長など）
    if (userLevel >= 9 && userLevel <= 13) {
      return decision.deciderFacilityId === userFacilityId;
    }

    // LEVEL_14-18: 全施設の判断（法人本部）
    if (userLevel >= 14 && userLevel <= 18) {
      return true;
    }

    // LEVEL_99: システム管理者（全データアクセス）
    if (userLevel === 99) {
      return true;
    }

    // デフォルト: アクセス不可
    return false;
  });
}

/**
 * フィルタ条件の適用
 */
function applyFilters(
  decisions: ExpiredEscalationDecision[],
  filter: DecisionHistoryFilter
): ExpiredEscalationDecision[] {
  let filtered = [...decisions];

  // 判断タイプフィルタ
  if (filter.decisionType && filter.decisionType !== 'all') {
    filtered = filtered.filter((d) => d.decision === filter.decisionType);
  }

  // アジェンダレベルフィルタ
  if (filter.agendaLevel && filter.agendaLevel !== 'all') {
    filtered = filtered.filter((d) => d.agendaLevel === filter.agendaLevel);
  }

  // 提案タイプフィルタ
  if (filter.proposalType && filter.proposalType !== 'all') {
    filtered = filtered.filter((d) => d.proposalType === filter.proposalType);
  }

  // 部署フィルタ
  if (filter.department) {
    filtered = filtered.filter((d) => d.department === filter.department);
  }

  // 施設IDフィルタ
  if (filter.facilityId !== undefined) {
    if (filter.facilityId === null || filter.facilityId === 'null') {
      filtered = filtered.filter((d) => d.facilityId === null);
    } else {
      filtered = filtered.filter((d) => d.facilityId === filter.facilityId);
    }
  }

  // 日付フィルタ
  if (filter.dateFrom) {
    const fromDate = new Date(filter.dateFrom);
    filtered = filtered.filter((d) => new Date(d.createdAt) >= fromDate);
  }

  if (filter.dateTo) {
    const toDate = new Date(filter.dateTo);
    filtered = filtered.filter((d) => new Date(d.createdAt) <= toDate);
  }

  // 権限レベルフィルタ
  if (filter.deciderLevel !== undefined) {
    filtered = filtered.filter((d) => d.deciderLevel === filter.deciderLevel);
  }

  return filtered;
}

/**
 * ソート処理
 */
function sortDecisions(
  decisions: ExpiredEscalationDecision[],
  sortBy: DecisionHistoryFilter['sortBy'] = 'createdAt',
  sortOrder: DecisionHistoryFilter['sortOrder'] = 'desc'
): ExpiredEscalationDecision[] {
  return decisions.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'achievementRate':
        comparison = a.achievementRate - b.achievementRate;
        break;
      case 'daysOverdue':
        comparison = a.daysOverdue - b.daysOverdue;
        break;
      case 'deciderLevel':
        comparison = a.deciderLevel - b.deciderLevel;
        break;
      default:
        comparison = 0;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });
}

/**
 * ページネーション処理
 */
function paginateDecisions(
  decisions: ExpiredEscalationDecision[],
  page: number = 1,
  limit: number = 50
): {
  data: ExpiredEscalationDecision[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
} {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = decisions.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(decisions.length / limit),
      totalItems: decisions.length,
      itemsPerPage: limit,
      hasNextPage: endIndex < decisions.length,
      hasPreviousPage: page > 1,
    },
  };
}

/**
 * GET /api/voicedrive/decision-history
 * 判断履歴の取得
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // ユーザー権限情報（将来的にはJWTトークンから取得）
    // 現在はクエリパラメータから取得（テスト用）
    const userLevel = parseInt(searchParams.get('userLevel') || '99', 10);
    const userId = searchParams.get('userId') || 'test-user';
    const userFacilityId = searchParams.get('userFacilityId') || null;

    // フィルタ条件の取得
    const filter: DecisionHistoryFilter = {
      decisionType: (searchParams.get('decisionType') as any) || 'all',
      agendaLevel: (searchParams.get('agendaLevel') as any) || 'all',
      proposalType: (searchParams.get('proposalType') as any) || 'all',
      department: searchParams.get('department') || undefined,
      facilityId: searchParams.get('facilityId') || undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
      deciderLevel: searchParams.get('deciderLevel')
        ? parseInt(searchParams.get('deciderLevel')!, 10)
        : undefined,
      sortBy: (searchParams.get('sortBy') as any) || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as any) || 'desc',
      page: parseInt(searchParams.get('page') || '1', 10),
      limit: parseInt(searchParams.get('limit') || '50', 10),
    };

    // VoiceDrive APIからデータ取得を試行
    const voiceDriveResult = await fetchFromVoiceDriveAPI({
      userId,
      userLevel,
      facilityId: userFacilityId || undefined,
      dateFrom: filter.dateFrom,
      dateTo: filter.dateTo,
    });

    let allDecisions: ExpiredEscalationDecision[];
    let dataSource: 'voicedrive' | 'fallback' = 'fallback';
    let apiError: string | undefined;

    if (voiceDriveResult.success && voiceDriveResult.data) {
      // VoiceDrive APIから取得成功
      console.log('[Phase 6] VoiceDrive API connected successfully');
      allDecisions = voiceDriveResult.data.data?.decisions || voiceDriveResult.data.decisions || [];
      dataSource = 'voicedrive';
    } else {
      // フォールバック: テストデータを使用
      console.warn('[Phase 6] VoiceDrive API failed, using test data:', voiceDriveResult.error);
      allDecisions = testData.decisions as ExpiredEscalationDecision[];
      apiError = voiceDriveResult.error;
    }

    // 権限レベル別フィルタリング
    let filteredDecisions = filterByPermissionLevel(
      allDecisions,
      userLevel,
      userId,
      userFacilityId
    );

    // 追加フィルタの適用
    filteredDecisions = applyFilters(filteredDecisions, filter);

    // ソート
    filteredDecisions = sortDecisions(
      filteredDecisions,
      filter.sortBy,
      filter.sortOrder
    );

    // ページネーション
    const result = paginateDecisions(
      filteredDecisions,
      filter.page,
      filter.limit
    );

    // サマリー統計の再計算
    const summary = {
      totalDecisions: result.pagination.totalItems,
      approvalCount: filteredDecisions.filter(
        (d) => d.decision === 'approve_at_current_level'
      ).length,
      downgradeCount: filteredDecisions.filter((d) => d.decision === 'downgrade')
        .length,
      rejectCount: filteredDecisions.filter((d) => d.decision === 'reject').length,
      averageAchievementRate:
        filteredDecisions.reduce((sum, d) => sum + d.achievementRate, 0) /
        (filteredDecisions.length || 1),
      averageDaysOverdue:
        filteredDecisions.reduce((sum, d) => sum + d.daysOverdue, 0) /
        (filteredDecisions.length || 1),
    };

    // レスポンスの構築
    const response: DecisionHistoryResponse & {
      pagination: typeof result.pagination;
      dataSource?: 'voicedrive' | 'fallback';
      apiError?: string;
    } = {
      metadata: {
        ...testData.metadata,
        totalCount: result.pagination.totalItems,
        dataSource,
        ...(apiError && { apiError }),
      },
      summary,
      decisions: result.data,
      pagination: result.pagination,
      dataSource,
      ...(apiError && { apiError }),
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Data-Source': dataSource,
      },
    });
  } catch (error) {
    console.error('Error fetching decision history:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch decision history',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
