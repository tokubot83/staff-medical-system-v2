'use client'

/**
 * アクセス制御管理画面
 * Level 99システム管理者専用
 *
 * 機能：
 * - タブ・ページ・機能の権限設定を表示・編集
 * - 変更履歴の表示
 * - カテゴリ別フィルタ
 */

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import AccessControlEditModal from '@/components/admin/AccessControlEditModal'
import {
  Settings,
  Shield,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  RefreshCw,
  Lock,
  Unlock,
  Eye,
  EyeOff
} from 'lucide-react'

// ================================================================================
// 型定義
// ================================================================================

interface AccessControlConfig {
  id: number
  resourceType: 'tab' | 'page' | 'feature' | 'data'
  resourceId: string
  resourceName: string
  category: string | null
  minLevel: number
  specialAuthority: boolean
  requiresAssignment: boolean
  description: string | null
  isActive: boolean
  isSystemProtected: boolean
  displayOrder: number
  recommendedMinLevel: number | null
  recommendedReason: string | null
  updatedAt: string
  updatedBy: string | null
}

interface ChangeLog {
  id: number
  resourceId: string
  resourceName: string
  fieldName: string
  oldValue: string | null
  newValue: string | null
  changeReason: string
  isDeviationFromRecommended: boolean
  changedAt: string
  changedBy: string
  changedByName: string | null
  changedByLevel: number | null
}

// ================================================================================
// メインコンポーネント
// ================================================================================

export default function AccessControlPage() {
  const [configs, setConfigs] = useState<AccessControlConfig[]>([])
  const [changeLogs, setChangeLogs] = useState<ChangeLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'mock' | 'database'>('mock')

  // フィルタ
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showInactiveOnly, setShowInactiveOnly] = useState(false)

  // タブ
  const [activeTab, setActiveTab] = useState<'configs' | 'history'>('configs')

  // 編集モーダル
  const [editingConfig, setEditingConfig] = useState<AccessControlConfig | null>(null)

  // ================================================================================
  // データ取得
  // ================================================================================

  useEffect(() => {
    loadConfigs()
    loadChangeLogs()
  }, [])

  async function loadConfigs() {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/admin/access-control?type=tab')
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error)
      }

      setConfigs(data.data)
      setMode(data.mode)
    } catch (err: any) {
      setError(err.message)
      console.error('設定の取得エラー:', err)
    } finally {
      setLoading(false)
    }
  }

  async function loadChangeLogs() {
    try {
      const response = await fetch('/api/admin/access-control/change-log?limit=50')
      const data = await response.json()

      if (data.success) {
        setChangeLogs(data.data)
      }
    } catch (err) {
      console.error('変更履歴の取得エラー:', err)
    }
  }

  async function refreshCache() {
    try {
      await fetch('/api/admin/access-control', { method: 'DELETE' })
      await loadConfigs()
    } catch (err) {
      console.error('キャッシュクリアエラー:', err)
    }
  }

  // ================================================================================
  // フィルタ処理
  // ================================================================================

  const categories = Array.from(new Set(configs.map(c => c.category).filter(Boolean))) as string[]

  const filteredConfigs = configs.filter(config => {
    // カテゴリフィルタ
    if (selectedCategory && config.category !== selectedCategory) {
      return false
    }

    // 検索クエリフィルタ
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesName = config.resourceName.toLowerCase().includes(query)
      const matchesId = config.resourceId.toLowerCase().includes(query)
      const matchesDescription = config.description?.toLowerCase().includes(query)

      if (!matchesName && !matchesId && !matchesDescription) {
        return false
      }
    }

    // 非アクティブフィルタ
    if (showInactiveOnly && config.isActive) {
      return false
    }

    return true
  })

  // ================================================================================
  // レンダリング
  // ================================================================================

  if (loading && configs.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="animate-spin h-8 w-8 mx-auto mb-4 text-blue-500" />
            <p className="text-gray-600">読み込み中...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="h-8 w-8 text-blue-600" />
              アクセス制御管理
            </h1>
            <p className="text-gray-600 mt-1">
              タブ・ページ・機能の権限設定を管理（Level 99専用）
            </p>
          </div>

          <div className="flex gap-2">
            <Badge variant={mode === 'mock' ? 'destructive' : 'default'}>
              {mode === 'mock' ? '⚠️ モックモード' : '✅ 本番モード'}
            </Badge>
            <Button variant="outline" size="sm" onClick={refreshCache}>
              <RefreshCw className="h-4 w-4 mr-2" />
              キャッシュクリア
            </Button>
          </div>
        </div>

        {mode === 'mock' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-yellow-800">モックモードで動作中</p>
                <p className="text-yellow-700 mt-1">
                  変更は永続化されません。DB構築後は環境変数 <code className="bg-yellow-100 px-1 rounded">USE_MOCK_ACCESS_CONTROL=false</code> に設定してください。
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-red-800">エラー</p>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* タブナビゲーション */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'configs'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('configs')}
        >
          <Settings className="inline h-4 w-4 mr-2" />
          権限設定（{configs.length}件）
        </button>
        <button
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'history'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('history')}
        >
          <Clock className="inline h-4 w-4 mr-2" />
          変更履歴（{changeLogs.length}件）
        </button>
      </div>

      {/* 権限設定タブ */}
      {activeTab === 'configs' && (
        <>
          {/* フィルタ */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4">
                {/* 検索 */}
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="タブ名・IDで検索..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* カテゴリフィルタ */}
                <div className="flex gap-2 items-center">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={selectedCategory || ''}
                    onChange={(e) => setSelectedCategory(e.target.value || null)}
                  >
                    <option value="">全カテゴリ</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* 非アクティブフィルタ */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showInactiveOnly}
                    onChange={(e) => setShowInactiveOnly(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">非アクティブのみ</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* 設定一覧 */}
          <div className="grid gap-4">
            {filteredConfigs.map(config => (
              <ConfigCard
                key={config.id}
                config={config}
                onEdit={() => setEditingConfig(config)}
              />
            ))}

            {filteredConfigs.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center text-gray-500">
                  <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>条件に一致する設定が見つかりませんでした</p>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}

      {/* 変更履歴タブ */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {changeLogs.map(log => (
            <ChangeLogCard key={log.id} log={log} />
          ))}

          {changeLogs.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>変更履歴がありません</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* 編集モーダル */}
      {editingConfig && (
        <AccessControlEditModal
          config={editingConfig}
          onClose={() => setEditingConfig(null)}
          onSave={() => {
            loadConfigs()
            loadChangeLogs()
          }}
        />
      )}
    </div>
  )
}

// ================================================================================
// サブコンポーネント: 設定カード
// ================================================================================

function ConfigCard({ config, onEdit }: { config: AccessControlConfig; onEdit: () => void }) {
  const isDeviation = config.recommendedMinLevel && config.minLevel < config.recommendedMinLevel

  return (
    <Card className={!config.isActive ? 'opacity-60 border-gray-300' : ''}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg">{config.resourceName}</CardTitle>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                {config.resourceId}
              </code>
              {config.category && (
                <Badge variant="outline">{config.category}</Badge>
              )}
            </div>
            <CardDescription className="mt-1">
              {config.description || '説明なし'}
            </CardDescription>
          </div>

          <div className="flex gap-2">
            {config.isSystemProtected && (
              <Badge variant="destructive" className="text-xs">
                <Lock className="h-3 w-3 mr-1" />
                保護
              </Badge>
            )}
            {!config.isActive && (
              <Badge variant="secondary" className="text-xs">
                <EyeOff className="h-3 w-3 mr-1" />
                無効
              </Badge>
            )}
            <Button size="sm" variant="outline" onClick={onEdit}>
              編集
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-600 text-xs mb-1">最小レベル</p>
            <p className="font-semibold text-lg">Level {config.minLevel}</p>
          </div>

          <div>
            <p className="text-gray-600 text-xs mb-1">特別権限</p>
            <p className="font-medium">
              {config.specialAuthority ? (
                <Badge variant="default">健診・産業医専用</Badge>
              ) : (
                <span className="text-gray-400">なし</span>
              )}
            </p>
          </div>

          <div>
            <p className="text-gray-600 text-xs mb-1">担当者制限</p>
            <p className="font-medium">
              {config.requiresAssignment ? (
                <Badge variant="default">あり</Badge>
              ) : (
                <span className="text-gray-400">なし</span>
              )}
            </p>
          </div>

          <div>
            <p className="text-gray-600 text-xs mb-1">最終更新</p>
            <p className="text-gray-600 text-xs">
              {new Date(config.updatedAt).toLocaleDateString('ja-JP')}
            </p>
            {config.updatedBy && (
              <p className="text-gray-500 text-xs">{config.updatedBy}</p>
            )}
          </div>
        </div>

        {isDeviation && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="text-xs">
                <p className="font-semibold text-yellow-800">
                  推奨設定からの逸脱（推奨: Level {config.recommendedMinLevel}）
                </p>
                {config.recommendedReason && (
                  <p className="text-yellow-700 mt-1">{config.recommendedReason}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ================================================================================
// サブコンポーネント: 変更履歴カード
// ================================================================================

function ChangeLogCard({ log }: { log: ChangeLog }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-semibold">{log.resourceName}</p>
            <p className="text-xs text-gray-500">{log.resourceId}</p>
          </div>
          <div className="text-right text-xs text-gray-500">
            <p>{new Date(log.changedAt).toLocaleString('ja-JP')}</p>
            <p>{log.changedByName || log.changedBy}</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded p-3 mb-3">
          <p className="text-sm font-medium text-gray-700 mb-1">変更内容</p>
          <div className="flex items-center gap-2 text-sm">
            <code className="bg-red-100 text-red-800 px-2 py-1 rounded">
              {log.oldValue}
            </code>
            <span className="text-gray-400">→</span>
            <code className="bg-green-100 text-green-800 px-2 py-1 rounded">
              {log.newValue}
            </code>
          </div>
        </div>

        <div className="text-sm">
          <p className="text-gray-600 mb-1">変更理由:</p>
          <p className="text-gray-800">{log.changeReason}</p>
        </div>

        {log.isDeviationFromRecommended && (
          <Badge variant="destructive" className="mt-3">
            <AlertTriangle className="h-3 w-3 mr-1" />
            推奨設定からの逸脱
          </Badge>
        )}
      </CardContent>
    </Card>
  )
}
