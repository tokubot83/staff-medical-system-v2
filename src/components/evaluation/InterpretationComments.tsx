'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  ChevronDown, 
  ChevronUp, 
  MessageCircle, 
  Target, 
  AlertTriangle, 
  Trophy,
  Lightbulb,
  RefreshCw
} from 'lucide-react'
import { 
  InterpretationComment, 
  EvaluationInterpretationData, 
  CommentType 
} from '@/types/evaluation-interpretation'
import { 
  CommentServiceFactory, 
  GrowthAnalyzer 
} from '@/services/evaluation-interpretation'

interface InterpretationCommentsProps {
  evaluationData: any[] // 評価履歴データ
  staffInfo: {
    id: string
    name: string
    position: string
    yearsOfService: number
  }
  className?: string
  // ローカルLLM統合用の設定
  llmConfig?: {
    enabled: boolean
    modelName: string
    apiEndpoint: string
  }
  onLLMGenerate?: (data: any) => Promise<any>
}

// コメントタイプ別のアイコンとスタイル
const getCommentStyle = (type: CommentType) => {
  const styles = {
    strength: {
      icon: Trophy,
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      iconColor: 'text-emerald-600'
    },
    achievement: {
      icon: Target,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600'
    },
    concern: {
      icon: AlertTriangle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-600'
    },
    guidance: {
      icon: MessageCircle,
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      iconColor: 'text-orange-600'
    },
    opportunity: {
      icon: Lightbulb,
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      iconColor: 'text-purple-600'
    }
  }
  return styles[type]
}

// 優先度別のバッジスタイル
const getPriorityBadge = (priority: string) => {
  const styles = {
    high: { className: 'bg-red-600 text-white', label: '重要' },
    medium: { className: 'bg-yellow-600 text-white', label: '注意' },
    low: { className: 'bg-gray-600 text-white', label: '参考' }
  }
  return styles[priority as keyof typeof styles] || styles.medium
}

// 個別コメントコンポーネント
const CommentCard: React.FC<{ 
  comment: InterpretationComment
  isExpanded: boolean
  onToggle: () => void
}> = ({ comment, isExpanded, onToggle }) => {
  const style = getCommentStyle(comment.type)
  const priorityStyle = getPriorityBadge(comment.priority)
  const IconComponent = style.icon

  return (
    <Card className={`${style.bgColor} ${style.borderColor} border-l-4 transition-all duration-200`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-white ${style.iconColor}`}>
              <IconComponent size={18} />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-gray-800">
                {comment.title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={priorityStyle.className}>
                  {priorityStyle.label}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {comment.category}
                </Badge>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          {comment.description}
        </p>
        
        {isExpanded && comment.recommendations && comment.recommendations.length > 0 && (
          <div className="mt-4 p-3 bg-white rounded-lg border">
            <h4 className="font-medium text-sm text-gray-800 mb-2 flex items-center gap-2">
              <Target size={14} />
              推奨アクション
            </h4>
            <ul className="space-y-1">
              {comment.recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {isExpanded && comment.metadata && (
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <span>
              信頼度: {comment.metadata.confidenceScore}%
            </span>
            <span>
              生成方式: {comment.metadata.generatedBy === 'rule_based' ? 'ルールベース' : 'AI生成'}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// メインコンポーネント
export const InterpretationComments: React.FC<InterpretationCommentsProps> = ({
  evaluationData,
  staffInfo,
  className = '',
  llmConfig,
  onLLMGenerate
}) => {
  const [comments, setComments] = useState<InterpretationComment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set())
  const [isVisible, setIsVisible] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)

  // コメント生成
  useEffect(() => {
    generateComments()
  }, [evaluationData, staffInfo])

  const generateComments = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!evaluationData || evaluationData.length === 0) {
        setComments([])
        return
      }

      // 評価データを解釈用フォーマットに変換
      const currentData = evaluationData[evaluationData.length - 1]
      const historicalData = evaluationData.slice(0, -1)
      
      const interpretationData: EvaluationInterpretationData = {
        staffId: staffInfo.id,
        staffName: staffInfo.name,
        position: staffInfo.position,
        yearsOfService: staffInfo.yearsOfService,
        currentData: {
          finalGrade: currentData.finalGrade,
          facilityRank: currentData.facilityRank,
          corporateRank: currentData.corporateRank
        },
        historicalData: historicalData.map(item => ({
          year: item.year,
          finalGrade: item.finalGrade,
          facilityRank: item.facilityRank,
          corporateRank: item.corporateRank
        })),
        growthMetrics: GrowthAnalyzer.calculateGrowthMetrics(historicalData, currentData)
      }

      // コメント生成サービスを使用
      const commentService = CommentServiceFactory.create('rule_based')
      const generatedComments = await commentService.generateComments(interpretationData)
      
      setComments(generatedComments)
      
      // 高優先度コメントは自動展開
      const highPriorityIds = generatedComments
        .filter(c => c.priority === 'high')
        .map(c => c.id)
      setExpandedComments(new Set(highPriorityIds))
      
    } catch (err) {
      console.error('コメント生成エラー:', err)
      setError('コメントの生成に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const toggleComment = (commentId: string) => {
    const newExpanded = new Set(expandedComments)
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId)
    } else {
      newExpanded.add(commentId)
    }
    setExpandedComments(newExpanded)
  }

  // ローカルLLM解釈生成
  const handleLLMGeneration = async () => {
    setIsGenerating(true)
    try {
      if (onLLMGenerate) {
        const llmData = await onLLMGenerate({
          evaluationData,
          staffInfo,
          context: 'evaluation-history'
        })
        console.log('ローカルLLM生成完了:', llmData)
        // 生成されたデータでUIを更新する処理を追加
      } else {
        console.log('ローカルLLM解釈生成開始 - 実装準備完了')
        // デモ用の待機処理
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    } catch (error) {
      console.error('LLM生成エラー:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const toggleAllComments = () => {
    if (expandedComments.size === comments.length) {
      setExpandedComments(new Set())
    } else {
      setExpandedComments(new Set(comments.map(c => c.id)))
    }
  }

  if (loading) {
    return (
      <div className={`mt-6 ${className}`}>
        <div className="border-l-4 border-purple-500 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6">
          <div className="flex items-center justify-center space-x-2">
            <RefreshCw className="animate-spin" size={20} />
            <span className="text-gray-600">AI解釈を生成中...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`mt-6 ${className}`}>
        <div className="rounded-xl border text-card-foreground shadow border-red-200 bg-red-50">
          <div className="p-6">
            <div className="flex items-center space-x-2 text-red-600">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="lucide lucide-triangle-alert" 
                aria-hidden="true"
              >
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path>
                <path d="M12 9v4"></path>
                <path d="M12 17h.01"></path>
              </svg>
              <span>コメントの生成に失敗しました</span>
              <button 
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-3 text-xs ml-auto"
                onClick={generateComments}
              >
                再試行
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`mt-6 ${className}`}>
      <div className="border-l-4 border-purple-500 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-purple-600 text-xl">🤖</span>
            </div>
            <div>
              <h5 className="font-bold text-lg text-gray-800">
                AI人事指導支援アドバイス
              </h5>
              <p className="text-sm text-gray-600">
                レーダーチャート分析に基づく個別指導提案
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 bg-purple-200 text-purple-800 text-xs rounded-full font-medium">
              ローカルLLM対応予定
            </div>
            <button 
              className={`px-3 py-1 text-white text-sm rounded-md transition-colors ${
                isGenerating 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
              onClick={handleLLMGeneration}
              disabled={isGenerating}
            >
              {isGenerating ? '生成中...' : '解釈生成'}
            </button>
          </div>
        </div>

        {/* AI解釈コメント表示エリア */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">💡</div>
              <p>解釈生成ボタンを押して、AI による分析コメントを表示します。</p>
              <p className="text-sm mt-1">職員の評価履歴データを元に個別指導アドバイスを生成します。</p>
            </div>
          ) : (
            <>
              {/* 技術評価解釈 */}
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-blue-600 text-base">🎉</span>
                  <h6 className="font-semibold text-blue-800 text-sm">技術評価（50点）解釈</h6>
                  <div className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium">
                    40.0点 (80.0%)
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-green-50 border-l-2 border-green-400 rounded">
                    <p className="font-medium text-green-800 mb-1">🌟 優秀な領域</p>
                    <p className="text-green-700">
                      対人関係・ケア能力が施設平均を大幅に上回る優秀な成果です。
                      患者・家族からの信頼が厚く、チーム内でも頼りにされる存在となっています。
                    </p>
                  </div>
                  <div className="p-2 bg-yellow-50 border-l-2 border-yellow-400 rounded">
                    <p className="font-medium text-yellow-800 mb-1">⚡ 重点改善領域</p>
                    <p className="text-yellow-700">
                      安全・品質管理の向上が優先課題です。インシデント予防研修の受講と
                      日常業務でのダブルチェック体制の徹底をお勧めします。
                    </p>
                  </div>
                </div>
              </div>

              {/* 組織貢献度解釈 */}
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-green-600 text-lg">🎯</span>
                  <h6 className="font-semibold text-green-800">組織貢献度（50点）解釈</h6>
                  <div className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">
                    41.3点 (82.6%)
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                    <p className="font-medium text-blue-800 mb-1">📈 成長パターン</p>
                    <p className="text-blue-700">
                      冬季の施設貢献が夏季を上回っており、経験を積むにつれて
                      貢献度が向上する良好な成長パターンを示しています。
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 border-l-4 border-purple-400 rounded">
                    <p className="font-medium text-purple-800 mb-1">🎯 次期目標</p>
                    <p className="text-purple-700">
                      法人横断プロジェクトへの参加や他施設での研修経験を通じて、
                      法人内での認知度向上と更なる貢献度アップを目指しましょう。
                    </p>
                  </div>
                </div>
              </div>

              {/* 統合指導アドバイス */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-indigo-600 text-lg">💡</span>
                  <h6 className="font-semibold text-indigo-800">統合指導アドバイス</h6>
                </div>
                <div className="grid grid-cols-1 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-800 mb-2">📋 短期アクション（1-3ヶ月）</p>
                    <ul className="space-y-1 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500">•</span>
                        <span>安全管理研修の優先受講</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500">•</span>
                        <span>インシデント予防チェックリスト活用</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500">•</span>
                        <span>月次1on1面談での進捗確認</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 mb-2">🚀 中長期目標（3-12ヶ月）</p>
                    <ul className="space-y-1 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500">•</span>
                        <span>新人指導メンター役の任命</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500">•</span>
                        <span>法人内事例発表会での講師役</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500">•</span>
                        <span>主任昇進への準備・育成プラン</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* LLM実装準備メッセージ */}
              <div className="mt-4 p-3 bg-gray-100 rounded-lg border">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-yellow-600">⚡</span>
                  <span>
                    <strong>開発予定:</strong> ローカルLLM (Ollama + Llama 3.2) 統合により、
                    より高度で個別最適化された指導アドバイスを自動生成します。
                    職員の経験年数・職種・過去の成長パターンを考慮したパーソナライズド解釈が可能になります。
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default InterpretationComments