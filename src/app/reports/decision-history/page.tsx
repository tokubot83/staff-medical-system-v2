'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useDecisionHistory, getDecisionTypeLabel, getAgendaLevelLabel, getProposalTypeLabel, getDecisionTypeColor } from '@/hooks/useDecisionHistory';
import { ChartsContainer } from './components/ChartsContainer';
import { PDFExportButton } from './components/PDFExportButton';
import { ExcelExportButton } from './components/ExcelExportButton';
import type { ExpiredEscalationDecision } from '@/services/voicedrive/types';

/**
 * 判断履歴レポートページ
 *
 * Phase 6: VoiceDrive期限到達判断履歴機能
 * - 期限到達した提案の判断履歴を権限レベル別に表示
 * - LEVEL_5以上でアクセス可能
 *
 * 関連ドキュメント:
 * - mcp-shared/docs/Phase6_判断履歴機能_実装計画書_20251020.md
 */

export default function DecisionHistoryPage() {
  const router = useRouter();

  // 権限情報（将来的にはセッションから取得）
  // テスト用にLEVEL_99（全データアクセス）を設定
  const [userLevel] = useState(99);
  const [userId] = useState('test-user');
  const [userFacilityId] = useState<string | null>(null);

  // フィルタ表示状態
  const [showFilters, setShowFilters] = useState(false);

  // 判断履歴データ取得
  const {
    decisions,
    summary,
    pagination,
    isLoading,
    error,
    filter,
    setFilter,
    nextPage,
    previousPage,
  } = useDecisionHistory({
    userLevel,
    userId,
    userFacilityId,
    autoFetch: true,
  });

  // 選択された行
  const [selectedDecisionId, setSelectedDecisionId] = useState<string | null>(null);

  // 選択された判断の詳細
  const selectedDecision = useMemo(() => {
    return decisions.find((d) => d.id === selectedDecisionId) || null;
  }, [decisions, selectedDecisionId]);

  // CSVエクスポート機能
  const handleExportCSV = () => {
    if (decisions.length === 0) {
      alert('エクスポートするデータがありません');
      return;
    }

    // CSVヘッダー
    const headers = [
      '判断日時',
      '判断結果',
      '提案タイプ',
      'アジェンダレベル',
      '提案内容',
      '判断者名',
      '判断者部署',
      '判断者レベル',
      '判断理由',
      '到達率(%)',
      '期限超過日数',
      '施設ID',
    ];

    // CSVデータ
    const rows = decisions.map((d) => [
      new Date(d.createdAt).toLocaleString('ja-JP'),
      getDecisionTypeLabel(d.decision),
      getProposalTypeLabel(d.proposalType),
      getAgendaLevelLabel(d.agendaLevel),
      d.postContent,
      d.deciderName,
      d.deciderDepartment,
      d.deciderLevel.toString(),
      d.decisionReason,
      d.achievementRate.toFixed(1),
      d.daysOverdue.toString(),
      d.facilityId || 'なし',
    ]);

    // CSV文字列生成
    const csvContent =
      [headers.join(','), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(','))].join(
        '\n'
      );

    // BOM付きUTF-8でダウンロード
    const bom = '\uFEFF';
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `判断履歴_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg p-4 text-3xl">
                ⚖️
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">判断履歴</h1>
                <p className="text-gray-600 mt-1">
                  期限到達提案の判断履歴と統計を権限レベル別に表示
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push('/reports')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* サマリー統計 */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-sm text-gray-600 mb-1">総判断件数</div>
              <div className="text-2xl font-bold text-gray-900">
                {summary.totalDecisions}件
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-sm text-gray-600 mb-1">承認</div>
              <div className="text-2xl font-bold text-green-600">
                {summary.approvalCount}件
              </div>
              <div className="text-xs text-gray-500">
                {((summary.approvalCount / summary.totalDecisions) * 100).toFixed(1)}%
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-sm text-gray-600 mb-1">格下げ</div>
              <div className="text-2xl font-bold text-yellow-600">
                {summary.downgradeCount}件
              </div>
              <div className="text-xs text-gray-500">
                {((summary.downgradeCount / summary.totalDecisions) * 100).toFixed(1)}%
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-sm text-gray-600 mb-1">却下</div>
              <div className="text-2xl font-bold text-red-600">
                {summary.rejectCount}件
              </div>
              <div className="text-xs text-gray-500">
                {((summary.rejectCount / summary.totalDecisions) * 100).toFixed(1)}%
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-sm text-gray-600 mb-1">平均到達率</div>
              <div className="text-2xl font-bold text-blue-600">
                {summary.averageAchievementRate.toFixed(1)}%
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-sm text-gray-600 mb-1">平均超過日数</div>
              <div className="text-2xl font-bold text-purple-600">
                {summary.averageDaysOverdue.toFixed(1)}日
              </div>
            </div>
          </div>
        )}

        {/* グラフ表示セクション */}
        {!isLoading && !error && summary && decisions.length > 0 && (
          <div className="mb-6">
            <ChartsContainer decisions={decisions} summary={summary} />
          </div>
        )}

        {/* フィルタとアクション */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              <span className="font-medium">フィルタ</span>
              <span
                className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`}
              >
                ▼
              </span>
            </button>
            <div className="flex gap-3">
              <button
                onClick={handleExportCSV}
                disabled={decisions.length === 0}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                CSV
              </button>
              {summary && <ExcelExportButton decisions={decisions} summary={summary} />}
              {summary && <PDFExportButton decisions={decisions} summary={summary} />}
            </div>
          </div>

          {/* フィルタパネル */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  判断タイプ
                </label>
                <select
                  value={filter.decisionType}
                  onChange={(e) => setFilter({ decisionType: e.target.value as any })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="all">すべて</option>
                  <option value="approve_at_current_level">承認</option>
                  <option value="downgrade">格下げ</option>
                  <option value="reject">却下</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  アジェンダレベル
                </label>
                <select
                  value={filter.agendaLevel}
                  onChange={(e) => setFilter({ agendaLevel: e.target.value as any })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="all">すべて</option>
                  <option value="escalated_to_dept">部署レベル</option>
                  <option value="escalated_to_facility">施設レベル</option>
                  <option value="escalated_to_corp">法人レベル</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  提案タイプ
                </label>
                <select
                  value={filter.proposalType}
                  onChange={(e) => setFilter({ proposalType: e.target.value as any })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="all">すべて</option>
                  <option value="kaizen">改善提案</option>
                  <option value="new_initiative">新規施策</option>
                  <option value="training">研修</option>
                  <option value="collaboration">連携プログラム</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  並び順
                </label>
                <select
                  value={filter.sortBy}
                  onChange={(e) => setFilter({ sortBy: e.target.value as any })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="createdAt">判断日時</option>
                  <option value="achievementRate">到達率</option>
                  <option value="daysOverdue">期限超過日数</option>
                  <option value="deciderLevel">判断者レベル</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* ローディング */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            <p className="text-gray-600 mt-4">読み込み中...</p>
          </div>
        )}

        {/* エラー */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  データの取得に失敗しました: {error.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 判断履歴テーブル */}
        {!isLoading && !error && decisions.length > 0 && (
          <>
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        判断日時
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        判断結果
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        提案内容
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        判断者
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        到達率
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        超過日数
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {decisions.map((decision) => (
                      <tr
                        key={decision.id}
                        onClick={() => setSelectedDecisionId(decision.id)}
                        className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedDecisionId === decision.id ? 'bg-amber-50' : ''
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(decision.createdAt).toLocaleString('ja-JP')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              decision.decision === 'approve_at_current_level'
                                ? 'bg-green-100 text-green-800'
                                : decision.decision === 'downgrade'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {getDecisionTypeLabel(decision.decision)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-md truncate">
                          {decision.postContent}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>{decision.deciderName}</div>
                          <div className="text-xs text-gray-500">
                            {decision.deciderDepartment} (L{decision.deciderLevel})
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {decision.achievementRate.toFixed(1)}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {decision.daysOverdue}日
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ページネーション */}
            {pagination && pagination.totalPages > 1 && (
              <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  全{pagination.totalItems}件中 {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}
                  〜
                  {Math.min(
                    pagination.currentPage * pagination.itemsPerPage,
                    pagination.totalItems
                  )}
                  件を表示
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={previousPage}
                    disabled={!pagination.hasPreviousPage}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    前へ
                  </button>
                  <div className="px-4 py-2 text-sm text-gray-700">
                    {pagination.currentPage} / {pagination.totalPages}
                  </div>
                  <button
                    onClick={nextPage}
                    disabled={!pagination.hasNextPage}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    次へ
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* データなし */}
        {!isLoading && !error && decisions.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📭</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              判断履歴がありません
            </h3>
            <p className="text-gray-600">
              フィルタ条件を変更するか、判断が行われるまでお待ちください。
            </p>
          </div>
        )}

        {/* 詳細パネル */}
        {selectedDecision && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">判断詳細</h2>
                  <button
                    onClick={() => setSelectedDecisionId(null)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">提案内容</label>
                    <p className="text-gray-900 mt-1">{selectedDecision.postContent}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">判断結果</label>
                      <p className="text-gray-900 mt-1">
                        {getDecisionTypeLabel(selectedDecision.decision)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        アジェンダレベル
                      </label>
                      <p className="text-gray-900 mt-1">
                        {getAgendaLevelLabel(selectedDecision.agendaLevel)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">判断理由</label>
                    <p className="text-gray-900 mt-1 whitespace-pre-wrap">
                      {selectedDecision.decisionReason}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">判断者</label>
                      <p className="text-gray-900 mt-1">
                        {selectedDecision.deciderName}
                        <br />
                        <span className="text-sm text-gray-600">
                          {selectedDecision.deciderDepartment} (LEVEL{' '}
                          {selectedDecision.deciderLevel})
                        </span>
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">提案者</label>
                      <p className="text-gray-900 mt-1">
                        {selectedDecision.postAuthor.name}
                        <br />
                        <span className="text-sm text-gray-600">
                          {selectedDecision.postAuthor.department || '所属なし'}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">到達率</label>
                      <p className="text-2xl font-bold text-blue-600 mt-1">
                        {selectedDecision.achievementRate.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        期限超過日数
                      </label>
                      <p className="text-2xl font-bold text-purple-600 mt-1">
                        {selectedDecision.daysOverdue}日
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        提案タイプ
                      </label>
                      <p className="text-gray-900 mt-1">
                        {getProposalTypeLabel(selectedDecision.proposalType)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">判断日時</label>
                      <p className="text-gray-900 mt-1">
                        {new Date(selectedDecision.createdAt).toLocaleString('ja-JP')}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">施設ID</label>
                      <p className="text-gray-900 mt-1">
                        {selectedDecision.facilityId || 'なし'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
