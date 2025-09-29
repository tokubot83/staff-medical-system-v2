'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import ModelManagementPanel from '@/components/admin/ModelManagementPanel'

// モックアップ版 - 将来的に実装予定のAI制御センター
export default function AISettingsPage() {
  const [activeTab, setActiveTab] = useState('features')
  const [smartSuggestEnabled, setSmartSuggestEnabled] = useState(true)
  const [features, setFeatures] = useState({
    'interview.analysis': true,
    'interview.summary': true,
    'interview.suggestion': false,
    'evaluation.comment': true,
    'report.monthly': true,
    'smartsuggest.navigation': true,
    'smartsuggest.action': true,
    'voicedrive.notification': true
  })

  const toggleFeature = (featureId: string) => {
    setFeatures(prev => ({
      ...prev,
      [featureId]: !prev[featureId]
    }))
  }

  const toggleAllFeatures = (enabled: boolean) => {
    const newFeatures = {}
    Object.keys(features).forEach(key => {
      newFeatures[key] = enabled
    })
    setFeatures(newFeatures)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            🤖 AI制御センター
          </h1>
          <p className="mt-2 text-purple-100">
            システム全体のAI機能を統合管理
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* タブナビゲーション */}
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab('features')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'features'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🎛️ AI機能管理
          </button>
          <button
            onClick={() => setActiveTab('models')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'models'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🔄 モデル管理
          </button>
          <button
            onClick={() => setActiveTab('prompts')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'prompts'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            disabled
          >
            📝 プロンプト編集
            <Badge variant="secondary" className="ml-2 text-xs">準備中</Badge>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'analytics'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            disabled
          >
            📊 分析
            <Badge variant="secondary" className="ml-2 text-xs">準備中</Badge>
          </button>
        </div>

        {/* タブコンテンツ */}
        {activeTab === 'features' && (
          <>
        {/* ステータスカード */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">AI利用率</p>
                  <p className="text-3xl font-bold text-purple-600">85%</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <span className="text-2xl">📊</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">今月の処理件数</p>
                  <p className="text-3xl font-bold text-indigo-600">1,234</p>
                </div>
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <span className="text-2xl">⚡</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">節約時間</p>
                  <p className="text-3xl font-bold text-emerald-600">456h</p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <span className="text-2xl">⏱️</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* スマートサジェスト設定 */}
        <Card className="mb-8">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  💡 スマートサジェスト機能
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  ユーザーの操作を予測して次のアクションを提案
                </p>
              </div>
              <button
                onClick={() => setSmartSuggestEnabled(!smartSuggestEnabled)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  smartSuggestEnabled ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    smartSuggestEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </CardHeader>

          {smartSuggestEnabled && (
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">画面遷移の提案</span>
                  <input type="checkbox" defaultChecked className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">入力補完</span>
                  <input type="checkbox" defaultChecked className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">ショートカット提案</span>
                  <input type="checkbox" defaultChecked className="h-5 w-5 text-blue-600" />
                </div>

                <div className="mt-6">
                  <label className="text-sm font-medium text-gray-700">提案の積極度</label>
                  <div className="mt-2">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      defaultValue="3"
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>控えめ</span>
                      <span>標準</span>
                      <span>積極的</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* AI機能 ON/OFF設定 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">AI機能 ON/OFF設定</h2>
              <div className="space-x-2">
                <button
                  onClick={() => toggleAllFeatures(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  すべて有効化
                </button>
                <button
                  onClick={() => toggleAllFeatures(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  すべて無効化
                </button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* 面談・評価系 */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span className="text-lg">📋</span> 面談・評価系
              </h3>
              <div className="space-y-3">
                {[
                  { id: 'interview.analysis', name: '面談内容のAI分析', usage: 'high' },
                  { id: 'interview.summary', name: 'フィードバックサマリ生成', usage: 'high' },
                  { id: 'interview.suggestion', name: '次回面談の提案', usage: 'medium' },
                  { id: 'evaluation.comment', name: '評価コメント自動生成', usage: 'medium' }
                ].map(feature => (
                  <div
                    key={feature.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-2xl ${features[feature.id] ? '🟢' : '🔴'}`}></span>
                      <div>
                        <p className="font-medium">{feature.name}</p>
                        <p className="text-xs text-gray-500">機能ID: {feature.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={feature.usage === 'high' ? 'destructive' : feature.usage === 'medium' ? 'default' : 'secondary'}
                      >
                        {feature.usage === 'high' ? '高頻度' : feature.usage === 'medium' ? '中頻度' : '低頻度'}
                      </Badge>
                      <button
                        onClick={() => toggleFeature(feature.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          features[feature.id] ? 'bg-green-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            features[feature.id] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* レポート生成系 */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span className="text-lg">📊</span> レポート生成系
              </h3>
              <div className="space-y-3">
                {[
                  { id: 'report.monthly', name: '月次レポート作成', usage: 'medium' }
                ].map(feature => (
                  <div
                    key={feature.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-2xl ${features[feature.id] ? '🟢' : '🔴'}`}></span>
                      <div>
                        <p className="font-medium">{feature.name}</p>
                        <p className="text-xs text-gray-500">機能ID: {feature.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="default">中頻度</Badge>
                      <button
                        onClick={() => toggleFeature(feature.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          features[feature.id] ? 'bg-green-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            features[feature.id] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 外部連携系 */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span className="text-lg">🔗</span> 外部連携系
              </h3>
              <div className="space-y-3">
                {[
                  { id: 'voicedrive.notification', name: 'VoiceDrive通知文生成', usage: 'high' }
                ].map(feature => (
                  <div
                    key={feature.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-2xl ${features[feature.id] ? '🟢' : '🔴'}`}></span>
                      <div>
                        <p className="font-medium">{feature.name}</p>
                        <p className="text-xs text-gray-500">機能ID: {feature.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="destructive">高頻度</Badge>
                      <button
                        onClick={() => toggleFeature(feature.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          features[feature.id] ? 'bg-green-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            features[feature.id] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
          </>
        )}

        {/* モデル管理タブ */}
        {activeTab === 'models' && (
          <ModelManagementPanel />
        )}

        {/* フッター情報 */}
        <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h4 className="font-semibold text-yellow-800">開発中の機能</h4>
              <p className="text-sm text-yellow-700 mt-1">
                このページは将来実装予定のAI制御センターのモックアップです。
                実際の機能は共通DB構築後、段階的に実装される予定です。
              </p>
              <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
                <li>Phase 1: ローカルLLM接続と基本機能（DB構築後すぐ）</li>
                <li>Phase 2: 管理UI実装（1ヶ月後）</li>
                <li>Phase 3: カスタマイズ機能（2ヶ月後）</li>
                <li>Phase 4: 高度な最適化機能（3ヶ月後）</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}