import { useState, useEffect, useCallback } from 'react';
import type {
  DecisionHistoryResponse,
  DecisionHistoryFilter,
  ExpiredEscalationDecision,
} from '@/services/voicedrive/types';

interface UseDecisionHistoryOptions {
  userLevel: number;
  userId: string;
  userFacilityId: string | null;
  initialFilter?: Partial<DecisionHistoryFilter>;
  autoFetch?: boolean;
}

interface UseDecisionHistoryReturn {
  decisions: ExpiredEscalationDecision[];
  summary: DecisionHistoryResponse['summary'] | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null;
  isLoading: boolean;
  error: Error | null;
  filter: DecisionHistoryFilter;
  setFilter: (filter: Partial<DecisionHistoryFilter>) => void;
  refetch: () => Promise<void>;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
}

/**
 * Phase 6: 判断履歴データ取得カスタムフック
 * VoiceDrive APIから期限到達判断履歴を取得
 */
export function useDecisionHistory(
  options: UseDecisionHistoryOptions
): UseDecisionHistoryReturn {
  const {
    userLevel,
    userId,
    userFacilityId,
    initialFilter = {},
    autoFetch = true,
  } = options;

  const [decisions, setDecisions] = useState<ExpiredEscalationDecision[]>([]);
  const [summary, setSummary] = useState<DecisionHistoryResponse['summary'] | null>(
    null
  );
  const [pagination, setPagination] = useState<UseDecisionHistoryReturn['pagination']>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [filter, setFilterState] = useState<DecisionHistoryFilter>({
    decisionType: 'all',
    agendaLevel: 'all',
    proposalType: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 50,
    ...initialFilter,
  });

  /**
   * データ取得関数
   */
  const fetchDecisionHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // クエリパラメータの構築
      const params = new URLSearchParams({
        userLevel: userLevel.toString(),
        userId,
        ...(userFacilityId && { userFacilityId }),
      });

      // フィルタ条件の追加
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== 'all') {
          params.append(key, value.toString());
        }
      });

      // API呼び出し
      const response = await fetch(
        `/api/voicedrive/decision-history?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data: DecisionHistoryResponse & {
        pagination: UseDecisionHistoryReturn['pagination'];
      } = await response.json();

      // 状態の更新
      setDecisions(data.decisions);
      setSummary(data.summary);
      setPagination(data.pagination);
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Unknown error');
      setError(errorObj);
      console.error('Error fetching decision history:', errorObj);
    } finally {
      setIsLoading(false);
    }
  }, [userLevel, userId, userFacilityId, filter]);

  /**
   * フィルタ更新関数
   */
  const setFilter = useCallback((newFilter: Partial<DecisionHistoryFilter>) => {
    setFilterState((prev) => ({
      ...prev,
      ...newFilter,
      // フィルタ変更時はページを1にリセット
      page: newFilter.page !== undefined ? newFilter.page : 1,
    }));
  }, []);

  /**
   * ページネーション関数
   */
  const goToPage = useCallback((page: number) => {
    setFilterState((prev) => ({ ...prev, page }));
  }, []);

  const nextPage = useCallback(() => {
    if (pagination?.hasNextPage) {
      goToPage(pagination.currentPage + 1);
    }
  }, [pagination, goToPage]);

  const previousPage = useCallback(() => {
    if (pagination?.hasPreviousPage) {
      goToPage(pagination.currentPage - 1);
    }
  }, [pagination, goToPage]);

  /**
   * 初回およびフィルタ変更時の自動取得
   */
  useEffect(() => {
    if (autoFetch) {
      fetchDecisionHistory();
    }
  }, [fetchDecisionHistory, autoFetch]);

  return {
    decisions,
    summary,
    pagination,
    isLoading,
    error,
    filter,
    setFilter,
    refetch: fetchDecisionHistory,
    goToPage,
    nextPage,
    previousPage,
  };
}

/**
 * 判断タイプの日本語表示名を取得
 */
export function getDecisionTypeLabel(
  decision: ExpiredEscalationDecision['decision']
): string {
  const labels: Record<ExpiredEscalationDecision['decision'], string> = {
    approve_at_current_level: '承認',
    downgrade: '格下げ',
    reject: '却下',
  };
  return labels[decision] || decision;
}

/**
 * アジェンダレベルの日本語表示名を取得
 */
export function getAgendaLevelLabel(
  level: ExpiredEscalationDecision['agendaLevel']
): string {
  const labels: Record<ExpiredEscalationDecision['agendaLevel'], string> = {
    escalated_to_dept: '部署レベル',
    escalated_to_facility: '施設レベル',
    escalated_to_corp: '法人レベル',
  };
  return labels[level] || level;
}

/**
 * 提案タイプの日本語表示名を取得
 */
export function getProposalTypeLabel(
  type: ExpiredEscalationDecision['proposalType']
): string {
  if (!type) return '未分類';

  const labels: Record<
    Exclude<ExpiredEscalationDecision['proposalType'], null>,
    string
  > = {
    kaizen: '改善提案',
    new_initiative: '新規施策',
    training: '研修',
    collaboration: '連携プログラム',
  };
  return labels[type] || type;
}

/**
 * 判断タイプの色を取得
 */
export function getDecisionTypeColor(
  decision: ExpiredEscalationDecision['decision']
): string {
  const colors: Record<ExpiredEscalationDecision['decision'], string> = {
    approve_at_current_level: 'green',
    downgrade: 'yellow',
    reject: 'red',
  };
  return colors[decision] || 'gray';
}
