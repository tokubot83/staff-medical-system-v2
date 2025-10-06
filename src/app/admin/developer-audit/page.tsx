'use client'

/**
 * 開発者監査ログ管理ページ
 * Level 99/100の開発操作を可視化・監視
 *
 * Phase 1（現在）: Level 99 = スーパーユーザー（運用権 + 開発権）
 * Phase 2（将来）: Level 100（開発権）、Level 99（運用権のみ）
 */

import { useState, useEffect } from 'react'
import { DeveloperAuditLog, OperationType, OperationCategory, RiskLevel, ExecutionStatus } from '@/lib/audit/developerAuditLog'

export default function DeveloperAuditPage() {
  const [logs, setLogs] = useState<DeveloperAuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // フィルター状態
  const [filterOperationType, setFilterOperationType] = useState<OperationType | ''>('')
  const [filterOperationCategory, setFilterOperationCategory] = useState<OperationCategory | ''>('')
  const [filterRiskLevel, setFilterRiskLevel] = useState<RiskLevel | ''>('')
  const [filterExecutionStatus, setFilterExecutionStatus] = useState<ExecutionStatus | ''>('')
  const [filterOperatorId, setFilterOperatorId] = useState('')
  const [showCriticalOnly, setShowCriticalOnly] = useState(false)

  // ページネーション
  const [limit, setLimit] = useState(50)
  const [offset, setOffset] = useState(0)

  // 統計情報
  const [summary, setSummary] = useState<any>(null)

  useEffect(() => {
    loadLogs()
    loadSummary()
  }, [filterOperationType, filterOperationCategory, filterRiskLevel, filterExecutionStatus, filterOperatorId, showCriticalOnly, limit, offset])

  async function loadLogs() {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (filterOperationType) params.append('operationType', filterOperationType)
      if (filterOperationCategory) params.append('operationCategory', filterOperationCategory)
      if (filterRiskLevel) params.append('riskLevel', filterRiskLevel)
      if (filterExecutionStatus) params.append('executionStatus', filterExecutionStatus)
      if (filterOperatorId) params.append('operatorId', filterOperatorId)
      if (showCriticalOnly) params.append('type', 'critical')
      params.append('limit', limit.toString())
      params.append('offset', offset.toString())

      const response = await fetch(`/api/admin/developer-audit?${params.toString()}`)

      if (!response.ok) {
        throw new Error('監査ログの取得に失敗しました')
      }

      const data = await response.json()
      setLogs(data.data || [])
    } catch (err: any) {
      setError(err.message || '予期しないエラーが発生しました')
      console.error('Error loading logs:', err)
    } finally {
      setLoading(false)
    }
  }

  async function loadSummary() {
    try {
      const params = new URLSearchParams({ type: 'summary' })
      if (filterOperatorId) params.append('operatorId', filterOperatorId)

      const response = await fetch(`/api/admin/developer-audit?${params.toString()}`)

      if (response.ok) {
        const data = await response.json()
        setSummary(data.data || [])
      }
    } catch (err) {
      console.error('Error loading summary:', err)
    }
  }

  function getRiskLevelBadge(level: RiskLevel) {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800',
    }
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${colors[level]}`}>
        {level.toUpperCase()}
      </span>
    )
  }

  function getExecutionStatusBadge(status: ExecutionStatus) {
    const colors = {
      success: 'bg-green-100 text-green-800',
      partial_success: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      rolled_back: 'bg-gray-100 text-gray-800',
    }
    const labels = {
      success: '成功',
      partial_success: '部分成功',
      failed: '失敗',
      rolled_back: 'ロールバック',
    }
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${colors[status]}`}>
        {labels[status]}
      </span>
    )
  }

  function getOperationTypeLabel(type: OperationType): string {
    const labels: Record<OperationType, string> = {
      code_deployment: 'コードデプロイメント',
      database_schema_change: 'DBスキーマ変更',
      git_commit: 'Gitコミット',
      git_push: 'Gitプッシュ',
      git_merge: 'Gitマージ',
      package_update: 'パッケージ更新',
      config_change: '設定ファイル変更',
      migration_execution: 'マイグレーション実行',
      api_key_generation: 'APIキー生成',
      permission_change: '権限変更',
      system_restart: 'システム再起動',
      backup_creation: 'バックアップ作成',
      rollback: 'ロールバック',
      other: 'その他',
    }
    return labels[type] || type
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            開発者監査ログ
          </h1>
          <p className="text-gray-600">
            Level 99/100の開発操作を完全記録・監視
          </p>
        </div>

        {/* Phase表示 */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-blue-800 font-semibold">📋 Phase 1（現在）</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">運用中</span>
          </div>
          <p className="text-blue-700 text-sm">
            Level 99 = スーパーユーザー（運用権 + 開発権）<br />
            全ての開発操作がこのログに記録されます。
          </p>
        </div>

        {/* 統計サマリー */}
        {summary && summary.length > 0 && (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-gray-600 text-sm mb-1">総操作数</div>
              <div className="text-2xl font-bold">
                {summary.reduce((sum: number, s: any) => sum + s.operationCount, 0)}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-gray-600 text-sm mb-1">成功率</div>
              <div className="text-2xl font-bold text-green-600">
                {summary.length > 0
                  ? Math.round(
                      (summary.reduce((sum: number, s: any) => sum + s.successCount, 0) /
                        summary.reduce((sum: number, s: any) => sum + s.operationCount, 0)) *
                        100
                    )
                  : 0}
                %
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-gray-600 text-sm mb-1">高リスク操作</div>
              <div className="text-2xl font-bold text-orange-600">
                {summary.reduce((sum: number, s: any) => sum + s.highRiskOperations, 0)}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-gray-600 text-sm mb-1">クリティカル操作</div>
              <div className="text-2xl font-bold text-red-600">
                {summary.reduce((sum: number, s: any) => sum + s.criticalOperations, 0)}
              </div>
            </div>
          </div>
        )}

        {/* フィルター */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">フィルター</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                操作タイプ
              </label>
              <select
                value={filterOperationType}
                onChange={(e) => setFilterOperationType(e.target.value as OperationType | '')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">すべて</option>
                <option value="git_commit">Gitコミット</option>
                <option value="git_push">Gitプッシュ</option>
                <option value="database_schema_change">DBスキーマ変更</option>
                <option value="permission_change">権限変更</option>
                <option value="migration_execution">マイグレーション実行</option>
                <option value="config_change">設定変更</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                リスクレベル
              </label>
              <select
                value={filterRiskLevel}
                onChange={(e) => setFilterRiskLevel(e.target.value as RiskLevel | '')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">すべて</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                実行ステータス
              </label>
              <select
                value={filterExecutionStatus}
                onChange={(e) => setFilterExecutionStatus(e.target.value as ExecutionStatus | '')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">すべて</option>
                <option value="success">成功</option>
                <option value="failed">失敗</option>
                <option value="partial_success">部分成功</option>
                <option value="rolled_back">ロールバック</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showCriticalOnly}
                onChange={(e) => setShowCriticalOnly(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">重要操作のみ表示</span>
            </label>
          </div>
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* ログテーブル */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    日時
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作者
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作タイプ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    概要
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    リスク
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ステータス
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      読み込み中...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      監査ログがありません
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(log.createdAt).toLocaleString('ja-JP')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {log.operatorName || log.operatorId}
                        </div>
                        <div className="text-xs text-gray-500">Level {log.operatorLevel}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getOperationTypeLabel(log.operationType)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-md truncate">
                        {log.operationSummary}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getRiskLevelBadge(log.riskLevel)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getExecutionStatusBadge(log.executionStatus)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ページネーション */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              {logs.length}件表示中
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setOffset(Math.max(0, offset - limit))}
                disabled={offset === 0}
                className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                前へ
              </button>
              <button
                onClick={() => setOffset(offset + limit)}
                disabled={logs.length < limit}
                className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                次へ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
