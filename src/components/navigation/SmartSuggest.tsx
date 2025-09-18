'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  CheckCircle,
  Clock,
  FileText,
  Users,
  Brain,
  Sparkles,
  TrendingUp,
  Calendar,
  ChevronDown,
  ChevronUp,
  X,
  AlertTriangle,
  Move
} from 'lucide-react'

interface SuggestedAction {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  priority: 'high' | 'medium' | 'low'
  category: 'next' | 'pending' | 'recommended'
  action: () => void
  confidence: number // AI信頼度スコア（0-100）
  estimatedTime?: string
}

interface SmartSuggestProps {
  staffId?: string
  currentContext?: {
    page: string
    tab?: string
    lastAction?: string
  }
  evaluationStatus?: any
  interviewData?: any
  onSuggestionClick?: (action: SuggestedAction) => void
}

export const SmartSuggest: React.FC<SmartSuggestProps> = React.memo(({
  staffId,
  currentContext = { page: '', tab: '', lastAction: '' },
  evaluationStatus,
  interviewData,
  onSuggestionClick
}) => {
  const router = useRouter()
  const [suggestions, setSuggestions] = useState<SuggestedAction[]>([])
  const [isExpanded, setIsExpanded] = useState(true)
  const [isVisible, setIsVisible] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'next' | 'pending' | 'recommended'>('all')

  // 位置管理をuseRefで行い、描画用のstateは最小限に
  const positionRef = useRef({ x: 0, y: 0 })
  const [renderPosition, setRenderPosition] = useState({ x: 0, y: 0 })
  const elementRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)

  // クライアントサイドで初期位置を設定
  useEffect(() => {
    const initialX = Math.floor(window.innerWidth - 340)
    const initialY = Math.floor(window.innerHeight - 400)
    positionRef.current = { x: initialX, y: initialY }
    setRenderPosition({ x: initialX, y: initialY })
  }, [])

  // ドラッグ処理を完全に書き直し
  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('button') || target.closest('a')) {
      return
    }

    e.preventDefault()
    e.stopPropagation()

    isDraggingRef.current = true
    const startX = e.clientX - positionRef.current.x
    const startY = e.clientY - positionRef.current.y

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return

      e.preventDefault()
      e.stopPropagation()

      const newX = Math.floor(e.clientX - startX)
      const newY = Math.floor(e.clientY - startY)

      // 画面内に制限
      const boundedX = Math.max(0, Math.min(newX, window.innerWidth - 320))
      const boundedY = Math.max(0, Math.min(newY, window.innerHeight - 100))

      positionRef.current = { x: boundedX, y: boundedY }

      // requestAnimationFrameで描画を最適化
      requestAnimationFrame(() => {
        setRenderPosition({ x: boundedX, y: boundedY })
      })
    }

    const handleMouseUp = () => {
      isDraggingRef.current = false
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  // AI予測ロジック（現在はシミュレーション実装）
  // 注意: 現在はローカルLLMへの実際の接続は行っていません
  // 将来的にOllama APIなどと連携する際に実装予定
  useEffect(() => {
    const generateSuggestions = async () => {
      setIsGenerating(true)

      // ローカルLLM呼び出しシミュレーション
      // TODO: 実際のOllama API接続実装（例: http://localhost:11434/api/generate）
      // 現在は静的なルールベースでサジェストを生成
      await new Promise(resolve => setTimeout(resolve, 500))

      const newSuggestions: SuggestedAction[] = []

      // ページごとの提案を生成
      if (currentContext.page === 'dashboard' || currentContext.page === '') {
        // ダッシュボード用の提案
        newSuggestions.push({
          id: 'd1',
          title: '本日の業務確認',
          description: '本日予定されているタスクを確認',
          icon: <Calendar className="w-4 h-4" />,
          priority: 'high',
          category: 'next',
          confidence: 95,
          estimatedTime: '5分',
          action: () => {
            router.push('/dashboard')
          }
        })

        newSuggestions.push({
          id: 'd2',
          title: '未処理の評価',
          description: '期限が近い評価タスクがあります',
          icon: <Clock className="w-4 h-4" />,
          priority: 'high',
          category: 'pending',
          confidence: 90,
          action: () => {
            router.push('/evaluation')
          }
        })
      }

      // 評価管理ページ
      if (currentContext.page === 'evaluation') {
        newSuggestions.push({
          id: 'e1',
          title: '一括評価実行',
          description: '未評価の職員を一括処理',
          icon: <Sparkles className="w-4 h-4" />,
          priority: 'high',
          category: 'next',
          confidence: 90,
          estimatedTime: '15分',
          action: () => {
            router.push('/evaluation/batch')
          }
        })

        newSuggestions.push({
          id: 'e2',
          title: '評価レポート生成',
          description: '今期の評価結果レポートを作成',
          icon: <FileText className="w-4 h-4" />,
          priority: 'medium',
          category: 'recommended',
          confidence: 85,
          estimatedTime: '5分',
          action: () => {
            router.push('/evaluation/report')
          }
        })
      }

      // 面談管理ページ
      if (currentContext.page === 'interviews') {
        newSuggestions.push({
          id: 'i1',
          title: '本日の面談予定',
          description: '3件の面談が予定されています',
          icon: <Calendar className="w-4 h-4" />,
          priority: 'high',
          category: 'next',
          confidence: 100,
          action: () => {
            router.push('/interviews/today')
          }
        })

        newSuggestions.push({
          id: 'i2',
          title: '面談記録の入力',
          description: '未入力の面談記録があります',
          icon: <FileText className="w-4 h-4" />,
          priority: 'high',
          category: 'pending',
          confidence: 95,
          estimatedTime: '10分',
          action: () => {
            router.push('/interviews/records')
          }
        })
      }

      // 健康管理ページ
      if (currentContext.page === 'health') {
        newSuggestions.push({
          id: 'h1',
          title: 'ストレスチェック実施',
          description: '今月のストレスチェック未実施者',
          icon: <AlertTriangle className="w-4 h-4" />,
          priority: 'high',
          category: 'pending',
          confidence: 88,
          action: () => {
            router.push('/stress-check')
          }
        })
      }

      // 採用管理ページ
      if (currentContext.page === 'recruitment') {
        newSuggestions.push({
          id: 'r1',
          title: '応募者レビュー',
          description: '新規応募者5名の書類確認',
          icon: <Users className="w-4 h-4" />,
          priority: 'high',
          category: 'next',
          confidence: 92,
          estimatedTime: '20分',
          action: () => {
            router.push('/recruitment/applicants')
          }
        })
      }

      // 職員カルテページ
      if (currentContext.page === 'staff-cards' && staffId) {
        // 評価タブでの提案
        if (currentContext.tab === 'evaluation') {
          newSuggestions.push({
            id: '1',
            title: '評価結果を確定',
            description: '現在の暫定評価を確定して保存します',
            icon: <CheckCircle className="w-4 h-4" />,
            priority: 'high',
            category: 'next',
            confidence: 95,
            estimatedTime: '2分',
            action: () => {
              console.log('評価確定処理')
              router.push(`/evaluation/confirm?staffId=${staffId}`)
            }
          })

          newSuggestions.push({
            id: '2',
            title: '面談記録を追加',
            description: '評価フィードバック面談の記録を入力',
            icon: <FileText className="w-4 h-4" />,
            priority: 'high',
            category: 'next',
            confidence: 88,
            estimatedTime: '10分',
            action: () => {
              router.push(`/interviews/new?staffId=${staffId}&type=feedback`)
            }
          })
        }

        // 面談タブでの提案
        if (currentContext.tab === 'interview') {
          newSuggestions.push({
            id: '3',
            title: 'AI面談サマリ生成',
            description: '面談内容から要約を自動生成',
            icon: <Brain className="w-4 h-4" />,
            priority: 'medium',
            category: 'recommended',
            confidence: 92,
            estimatedTime: '1分',
            action: () => {
              console.log('AI面談サマリ生成')
            }
          })
        }

        // 共通の提案
        newSuggestions.push({
          id: '4',
          title: '次の職員へ移動',
          description: '評価待ちの次の職員カルテを表示',
          icon: <Users className="w-4 h-4" />,
          priority: 'medium',
          category: 'next',
          confidence: 75,
          action: () => {
            console.log('次の職員へ')
          }
        })

        // 期限が近いタスク
        if (evaluationStatus?.deadline) {
          newSuggestions.push({
            id: '5',
            title: '評価期限が近づいています',
            description: `残り3日で評価期限です`,
            icon: <Clock className="w-4 h-4" />,
            priority: 'high',
            category: 'pending',
            confidence: 100,
            action: () => {
              router.push('/evaluation/pending')
            }
          })
        }

        // 成長分析の提案
        newSuggestions.push({
          id: '6',
          title: '成長トレンド分析',
          description: 'AI分析で成長パターンを可視化',
          icon: <TrendingUp className="w-4 h-4" />,
          priority: 'low',
          category: 'recommended',
          confidence: 82,
          estimatedTime: '3分',
          action: () => {
            router.push(`/staff-cards/${staffId}?tab=analytics`)
          }
        })
      }

      // 評価管理ページでの提案
      if (currentContext.page === 'evaluation') {
        newSuggestions.push({
          id: '7',
          title: '一括評価実行',
          description: '未評価の職員を一括処理',
          icon: <Sparkles className="w-4 h-4" />,
          priority: 'high',
          category: 'next',
          confidence: 90,
          estimatedTime: '15分',
          action: () => {
            router.push('/evaluation/batch')
          }
        })
      }

      setSuggestions(newSuggestions)
      setIsGenerating(false)
    }

    generateSuggestions()
  }, [currentContext, staffId, evaluationStatus, router])

  // カテゴリーでフィルタリング
  const filteredSuggestions = selectedCategory === 'all'
    ? suggestions
    : suggestions.filter(s => s.category === selectedCategory)

  // 優先度でソート
  const sortedSuggestions = [...filteredSuggestions].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  if (!isVisible) return null

  return (
    <div
      ref={elementRef}
      className="fixed w-80 z-50"
      style={{
        left: `${renderPosition.x}px`,
        top: `${renderPosition.y}px`,
        userSelect: 'none',
        WebkitUserSelect: 'none'
      }}
    >
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
        {/* ヘッダー */}
        <div
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-3"
          onMouseDown={handleMouseDown}
          style={{ cursor: isDragging ? 'grabbing' : 'move' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              <span className="font-medium">AI スマートサジェスト</span>
              <Move className="w-3 h-3 opacity-60" title="ドラッグして移動" />
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          {isExpanded && (
            <div className="text-xs mt-1 opacity-90">
              業務コンテキストに基づく提案
            </div>
          )}
        </div>

        {isExpanded && (
          <>
            {/* カテゴリータブ */}
            <div className="flex border-b border-gray-200 bg-gray-50">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                すべて
              </button>
              <button
                onClick={() => setSelectedCategory('next')}
                className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                  selectedCategory === 'next'
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                次の作業
              </button>
              <button
                onClick={() => setSelectedCategory('pending')}
                className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                  selectedCategory === 'pending'
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                要対応
              </button>
              <button
                onClick={() => setSelectedCategory('recommended')}
                className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                  selectedCategory === 'recommended'
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                推奨
              </button>
            </div>

            {/* サジェストリスト */}
            <div className="max-h-96 overflow-y-auto">
              {isGenerating ? (
                <div className="p-4 text-center text-gray-500">
                  <div className="animate-pulse">AI分析中...</div>
                </div>
              ) : sortedSuggestions.length > 0 ? (
                <div className="p-2 space-y-2">
                  {sortedSuggestions.map(suggestion => (
                    <button
                      key={suggestion.id}
                      onClick={() => {
                        suggestion.action()
                        onSuggestionClick?.(suggestion)
                      }}
                      className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          suggestion.priority === 'high'
                            ? 'bg-red-100 text-red-600'
                            : suggestion.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {suggestion.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-sm text-gray-900 group-hover:text-purple-600">
                              {suggestion.title}
                            </h4>
                            {suggestion.confidence >= 90 && (
                              <Sparkles className="w-3 h-3 text-purple-500" />
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            {suggestion.description}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            {suggestion.estimatedTime && (
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {suggestion.estimatedTime}
                              </span>
                            )}
                            <span className="text-xs text-gray-400">
                              信頼度: {suggestion.confidence}%
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  <p className="text-sm">提案がありません</p>
                </div>
              )}
            </div>

            {/* フッター */}
            <div className="border-t border-gray-200 p-2 bg-gray-50">
              <div className="text-xs text-center text-gray-500">
                AI予測シミュレーション (ローカルLLM未接続)
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// カスタムフック
export const useSmartSuggest = () => {
  const [context, setContext] = useState({
    page: '',
    tab: '',
    lastAction: ''
  })

  const updateContext = (newContext: Partial<typeof context>) => {
    setContext(prev => ({ ...prev, ...newContext }))
  }

  return { context, updateContext }
})