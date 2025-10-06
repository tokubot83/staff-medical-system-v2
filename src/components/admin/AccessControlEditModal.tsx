'use client'

/**
 * アクセス制御編集モーダル
 * Level 99システム管理者専用
 */

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  X,
  AlertTriangle,
  Save,
  Lock,
  Info
} from 'lucide-react'

interface AccessControlConfig {
  id: number
  resourceType: string
  resourceId: string
  resourceName: string
  category: string | null
  minLevel: number
  specialAuthority: boolean
  requiresAssignment: boolean
  description: string | null
  isSystemProtected: boolean
  recommendedMinLevel: number | null
  recommendedReason: string | null
}

interface Props {
  config: AccessControlConfig
  onClose: () => void
  onSave: () => void
}

export default function AccessControlEditModal({ config, onClose, onSave }: Props) {
  const [minLevel, setMinLevel] = useState(config.minLevel)
  const [specialAuthority, setSpecialAuthority] = useState(config.specialAuthority)
  const [requiresAssignment, setRequiresAssignment] = useState(config.requiresAssignment)
  const [description, setDescription] = useState(config.description || '')
  const [changeReason, setChangeReason] = useState('')
  const [changedByName, setChangedByName] = useState('')

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 推奨設定からの逸脱チェック
  const isDeviation = config.recommendedMinLevel && minLevel < config.recommendedMinLevel
  const hasChanges = minLevel !== config.minLevel ||
                      specialAuthority !== config.specialAuthority ||
                      requiresAssignment !== config.requiresAssignment ||
                      description !== (config.description || '')

  async function handleSave() {
    // バリデーション
    if (changeReason.trim().length < 10) {
      setError('変更理由は10文字以上で入力してください')
      return
    }

    if (!hasChanges) {
      setError('変更する項目がありません')
      return
    }

    try {
      setSaving(true)
      setError(null)

      const response = await fetch(`/api/admin/access-control/${config.resourceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          minLevel,
          specialAuthority,
          requiresAssignment,
          description,
          changeReason,
          changedByName,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error)
      }

      onSave()
      onClose()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                {config.isSystemProtected && (
                  <Lock className="h-5 w-5 text-red-600" />
                )}
                {config.resourceName}
              </CardTitle>
              <CardDescription className="mt-1">
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                  {config.resourceId}
                </code>
                {config.category && (
                  <Badge variant="outline" className="ml-2">{config.category}</Badge>
                )}
              </CardDescription>
            </div>

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {config.isSystemProtected && (
            <div className="bg-red-50 border border-red-200 rounded p-3 mt-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-red-800">システム保護された設定</p>
                  <p className="text-red-700 mt-1">
                    この設定は法的要件（個人情報保護法・労働安全衛生法等）に関連しています。
                    変更する場合は、十分に影響を検討してください。
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-red-800">エラー</p>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* 最小レベル */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              最小アクセスレベル
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={minLevel}
              onChange={(e) => setMinLevel(parseFloat(e.target.value))}
            >
              <option value="14">Level 14 - 人事部門員</option>
              <option value="15">Level 15 - 人事各部門長</option>
              <option value="16">Level 16 - 戦略企画部門員</option>
              <option value="17">Level 17 - 戦略企画部門長</option>
              <option value="18">Level 18 - 理事長・法人事務局長</option>
              <option value="97">Level 97 - 健診担当者（特別権限）</option>
              <option value="98">Level 98 - 産業医（特別権限）</option>
              <option value="99">Level 99 - システム管理者</option>
            </select>

            {isDeviation && (
              <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded p-3">
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

            {config.recommendedMinLevel && !isDeviation && (
              <div className="mt-2 bg-blue-50 border border-blue-200 rounded p-2">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                  <p className="text-xs text-blue-700">
                    推奨レベル: Level {config.recommendedMinLevel}（現在の設定と一致）
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 特別権限 */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={specialAuthority}
                onChange={(e) => setSpecialAuthority(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                特別権限（健診担当者・産業医専用）
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-1 ml-6">
              有効にすると、Level 97（健診担当者）または Level 98（産業医）のみがアクセス可能になります
            </p>
          </div>

          {/* 担当者割り当て必須 */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={requiresAssignment}
                onChange={(e) => setRequiresAssignment(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                担当者割り当て必須
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-1 ml-6">
              有効にすると、面談担当者として割り当てられたユーザーのみがアクセス可能になります（Phase 2実装予定）
            </p>
          </div>

          {/* 説明 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              説明
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="この設定の用途や注意事項を入力..."
            />
          </div>

          {/* 変更理由（必須） */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              変更理由 <span className="text-red-600">*</span>
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
              value={changeReason}
              onChange={(e) => setChangeReason(e.target.value)}
              placeholder="変更理由を10文字以上で入力してください（監査ログに記録されます）"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {changeReason.length}/10文字以上
            </p>
          </div>

          {/* 変更者名（オプション） */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              変更者名（オプション）
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={changedByName}
              onChange={(e) => setChangedByName(e.target.value)}
              placeholder="例: 山田太郎"
            />
          </div>

          {/* アクション */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={saving}
            >
              キャンセル
            </Button>
            <Button
              className="flex-1"
              onClick={handleSave}
              disabled={saving || !hasChanges}
            >
              {saving ? (
                <>処理中...</>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  保存
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
