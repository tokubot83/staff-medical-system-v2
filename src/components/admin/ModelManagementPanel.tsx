'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface LLMModel {
  id: string
  name: string
  provider: 'ollama' | 'openai' | 'anthropic' | 'custom'
  type: 'local' | 'cloud'
  size: string
  languages: string[]
  specialization: string[]
  status: 'active' | 'inactive' | 'downloading' | 'not_installed'
  performance: {
    speed: 'fast' | 'medium' | 'slow'
    accuracy: 'high' | 'medium' | 'basic'
  }
  usage?: {
    lastUsed: string
    totalRequests: number
    avgResponseTime: number
  }
}

// モックデータ
const availableModels: LLMModel[] = [
  {
    id: 'llama3-8b-jp',
    name: 'Llama 3 8B 日本語版',
    provider: 'ollama',
    type: 'local',
    size: '8B',
    languages: ['日本語', '英語'],
    specialization: ['汎用', '対話'],
    status: 'active',
    performance: { speed: 'fast', accuracy: 'high' },
    usage: {
      lastUsed: '2時間前',
      totalRequests: 1234,
      avgResponseTime: 850
    }
  },
  {
    id: 'elyza-13b',
    name: 'ELYZA Japanese Llama 2 13B',
    provider: 'ollama',
    type: 'local',
    size: '13B',
    languages: ['日本語'],
    specialization: ['汎用', '医療'],
    status: 'active',
    performance: { speed: 'medium', accuracy: 'high' },
    usage: {
      lastUsed: '1日前',
      totalRequests: 456,
      avgResponseTime: 1200
    }
  },
  {
    id: 'phi-3-mini',
    name: 'Phi-3 Mini',
    provider: 'ollama',
    type: 'local',
    size: '3.8B',
    languages: ['日本語', '英語'],
    specialization: ['高速応答', 'リアルタイム'],
    status: 'inactive',
    performance: { speed: 'fast', accuracy: 'basic' }
  },
  {
    id: 'medalapaca',
    name: 'MedAlpaca',
    provider: 'ollama',
    type: 'local',
    size: '7B',
    languages: ['英語', '日本語（部分的）'],
    specialization: ['医療', '診断支援'],
    status: 'not_installed',
    performance: { speed: 'medium', accuracy: 'high' }
  },
  {
    id: 'swallow-70b',
    name: 'Swallow 70B',
    provider: 'ollama',
    type: 'local',
    size: '70B',
    languages: ['日本語'],
    specialization: ['最高品質', '研究'],
    status: 'not_installed',
    performance: { speed: 'slow', accuracy: 'high' }
  }
]

export default function ModelManagementPanel() {
  const [selectedModel, setSelectedModel] = useState('llama3-8b-jp')
  const [taskSpecificModels, setTaskSpecificModels] = useState({
    'interview.analysis': 'elyza-13b',
    'smartsuggest': 'phi-3-mini',
    'report.generation': 'default'
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'downloading': return 'bg-blue-100 text-blue-800'
      case 'not_installed': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return '稼働中'
      case 'inactive': return '停止中'
      case 'downloading': return 'ダウンロード中'
      case 'not_installed': return '未インストール'
      default: return status
    }
  }

  return (
    <div className="space-y-6">
      {/* モデル選択セクション */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-2">
              🔄 モデル設定
            </h3>
            <Badge variant="secondary">
              5モデル利用可能
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* デフォルトモデル選択 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📌 デフォルトモデル（全機能共通）
            </label>
            <div className="relative">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none appearance-none bg-white"
              >
                {availableModels
                  .filter(m => m.status === 'active' || m.status === 'inactive')
                  .map(model => (
                    <option key={model.id} value={model.id}>
                      {model.name} ({model.size}) - {model.performance.speed === 'fast' ? '⚡高速' : model.performance.speed === 'medium' ? '⚖️バランス' : '🎯高精度'}
                    </option>
                  ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                ▼
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              すべての機能で使用される基本モデルです
            </p>
          </div>

          {/* 機能別カスタマイズ */}
          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-700 mb-4">
              🎯 機能別カスタマイズ（オプション）
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">面談分析</p>
                  <p className="text-xs text-gray-500">高精度な分析が必要</p>
                </div>
                <select className="px-3 py-1 text-sm border rounded-md">
                  <option value="default">デフォルト使用</option>
                  <option value="elyza-13b">ELYZA 13B（推奨）</option>
                  <option value="llama3-8b-jp">Llama 3 8B</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">スマートサジェスト</p>
                  <p className="text-xs text-gray-500">高速レスポンス優先</p>
                </div>
                <select className="px-3 py-1 text-sm border rounded-md">
                  <option value="default">デフォルト使用</option>
                  <option value="phi-3-mini">Phi-3 Mini（推奨）</option>
                  <option value="llama3-8b-jp">Llama 3 8B</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">レポート生成</p>
                  <p className="text-xs text-gray-500">品質重視</p>
                </div>
                <select className="px-3 py-1 text-sm border rounded-md">
                  <option value="default">デフォルト使用</option>
                  <option value="swallow-70b">Swallow 70B（最高品質）</option>
                  <option value="elyza-13b">ELYZA 13B</option>
                </select>
              </div>
            </div>
          </div>

          {/* 自動最適化 */}
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" defaultChecked />
              <div>
                <span className="font-medium text-green-800">
                  🤖 AI自動最適化を有効化
                </span>
                <p className="text-sm text-green-600 mt-1">
                  使用状況とパフォーマンスを分析し、タスクに最適なモデルを自動選択します
                </p>
              </div>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* モデル一覧 */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-bold">📚 利用可能なモデル</h3>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {availableModels.map(model => (
              <div key={model.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold">{model.name}</h4>
                      <Badge className={getStatusColor(model.status)}>
                        {getStatusLabel(model.status)}
                      </Badge>
                      <Badge variant="outline">{model.size}</Badge>
                      {model.provider === 'ollama' && (
                        <Badge variant="secondary">Ollama</Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">言語:</span> {model.languages.join(', ')}
                      </div>
                      <div>
                        <span className="font-medium">特化領域:</span> {model.specialization.join(', ')}
                      </div>
                      <div>
                        <span className="font-medium">速度:</span>{' '}
                        {model.performance.speed === 'fast' ? '⚡ 高速' :
                         model.performance.speed === 'medium' ? '⚖️ 標準' : '🐢 低速'}
                      </div>
                      <div>
                        <span className="font-medium">精度:</span>{' '}
                        {model.performance.accuracy === 'high' ? '🎯 高精度' :
                         model.performance.accuracy === 'medium' ? '📊 標準' : '📈 基本'}
                      </div>
                    </div>

                    {model.usage && (
                      <div className="mt-3 pt-3 border-t flex items-center gap-6 text-xs text-gray-500">
                        <span>最終使用: {model.usage.lastUsed}</span>
                        <span>総リクエスト: {model.usage.totalRequests.toLocaleString()}</span>
                        <span>平均応答: {model.usage.avgResponseTime}ms</span>
                      </div>
                    )}
                  </div>

                  <div className="ml-4">
                    {model.status === 'not_installed' ? (
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                        インストール
                      </button>
                    ) : model.status === 'inactive' ? (
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        有効化
                      </button>
                    ) : model.status === 'active' ? (
                      <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                        無効化
                      </button>
                    ) : (
                      <div className="px-4 py-2 text-blue-600">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* パフォーマンス比較 */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-bold">📊 モデル性能比較</h3>
        </CardHeader>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">モデル</th>
                  <th className="text-center py-2">速度</th>
                  <th className="text-center py-2">精度</th>
                  <th className="text-center py-2">リソース</th>
                  <th className="text-center py-2">コスト効率</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3">Llama 3 8B</td>
                  <td className="text-center">
                    <div className="flex justify-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="text-center">
                    <div className="flex justify-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="text-center">
                    <div className="flex justify-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="text-center">⭐⭐⭐⭐</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">ELYZA 13B</td>
                  <td className="text-center">
                    <div className="flex justify-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="text-center">
                    <div className="flex justify-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="text-center">
                    <div className="flex justify-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="text-center">⭐⭐⭐⭐⭐</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">Phi-3 Mini</td>
                  <td className="text-center">
                    <div className="flex justify-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="text-center">
                    <div className="flex justify-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="text-center">
                    <div className="flex justify-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="text-center">⭐⭐⭐</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}