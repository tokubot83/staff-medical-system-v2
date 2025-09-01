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
    // 評価履歴データがある場合は直接表示、生成サービスは使わない
    if (evaluationData && evaluationData.length > 0) {
      setComments([]) // 動的コンテンツを使用するためコメントは空に
      setLoading(false)
      setError(null)
    } else {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        setError(null)
      }, 1000)
    }
  }, [evaluationData, staffInfo])

  const generateComments = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!evaluationData || evaluationData.length === 0) {
        setError('評価履歴データがありません')
        return
      }

      // 動的コンテンツ表示のため、実際のコメント生成は行わない
      // 代わりにデータ存在確認のみ実行
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setComments([])
      
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

  // ローカルLLM要因分析生成
  const handleLLMGeneration = async () => {
    setIsGenerating(true)
    try {
      if (onLLMGenerate) {
        // 評価データから要因分析プロンプトを生成
        const analysisPrompt = generateFactorAnalysisPrompt(evaluationData, staffInfo)
        const llmData = await onLLMGenerate({
          evaluationData,
          staffInfo,
          context: 'factor-analysis',
          prompt: analysisPrompt
        })
        console.log('ローカルLLM要因分析完了:', llmData)
        // 生成されたデータでUIを更新する処理を追加
      } else {
        console.log('ローカルLLM要因分析生成開始 - Llama 3.2統合準備完了')
        console.log('分析対象:', {
          期間: `${evaluationData.length}年間`,
          成長: `${evaluationData[0]?.finalGrade} → ${evaluationData[evaluationData.length - 1]?.finalGrade}`,
          施設内順位向上: `${evaluationData[0]?.facilityRank?.rank || 42}位 → ${evaluationData[evaluationData.length - 1]?.facilityRank?.rank || 12}位`,
          法人内順位向上: `${evaluationData[0]?.corporateRank?.rank || 456}位 → ${evaluationData[evaluationData.length - 1]?.corporateRank?.rank || 89}位`
        })
        // デモ用の待機処理
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    } catch (error) {
      console.error('LLM要因分析エラー:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  // 要因分析プロンプト生成
  const generateFactorAnalysisPrompt = (data: any[], staff: any) => {
    const startGrade = data[0]?.finalGrade || 'C'
    const endGrade = data[data.length - 1]?.finalGrade || 'A'
    const startFacilityRank = data[0]?.facilityRank?.rank || 42
    const endFacilityRank = data[data.length - 1]?.facilityRank?.rank || 12
    const startCorporateRank = data[0]?.corporateRank?.rank || 456
    const endCorporateRank = data[data.length - 1]?.corporateRank?.rank || 89
    
    return `医療職員の評価向上要因を分析してください。

【職員情報】
- 氏名: ${staff.name}
- 職種: ${staff.position}
- 勤続年数: ${staff.yearsOfService}年

【成長実績】
- 総合評価: ${startGrade}グレード → ${endGrade}グレード
- 施設内順位: ${startFacilityRank}位 → ${endFacilityRank}位 (${startFacilityRank - endFacilityRank}位向上)
- 法人内順位: ${startCorporateRank}位 → ${endCorporateRank}位 (${startCorporateRank - endCorporateRank}位向上)
- 分析期間: ${data.length}年間

以下3つの観点で要因分析してください:
1. 技術力向上要因（専門スキル、患者ケア能力）
2. 組織貢献度向上（チームワーク、コミュニケーション）
3. 継続成長の秘訣（学習姿勢、目標設定能力）

各要因は100文字程度で簡潔に分析してください。`
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
              {isGenerating ? '分析中...' : '要因分析'}
            </button>
          </div>
        </div>

        {/* AI解釈コメント表示エリア */}
        <div className="space-y-4">
          {evaluationData && evaluationData.length > 0 ? (
            <>
              {/* 成長要因分析 */}
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-blue-600 text-lg">🔍</span>
                  <h6 className="font-semibold text-blue-800">成長要因分析</h6>
                  <div className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium">
                    {evaluationData[0]?.finalGrade || 'C'}グレード → {evaluationData[evaluationData.length - 1]?.finalGrade || 'A'}グレード
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded">
                    <p className="font-medium text-green-800 mb-1">🎯 技術力向上要因</p>
                    <p className="text-green-700">
                      継続的な研修参加と実務経験の蓄積により、専門技術が着実に向上。
                      特に患者ケアの質と安全管理能力が大幅に改善され、
                      施設内での信頼度が高まりました。
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                    <p className="font-medium text-blue-800 mb-1">🤝 組織貢献度向上</p>
                    <p className="text-blue-700">
                      チームワークとコミュニケーション能力の向上により、
                      他職種との連携が円滑になり、組織全体の業務効率化に貢献。
                      後輩指導にも積極的に取り組んでいます。
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 border-l-4 border-purple-400 rounded">
                    <p className="font-medium text-purple-800 mb-1">📈 継続成長の秘訣</p>
                    <p className="text-purple-700">
                      自己学習意欲と目標設定能力が高く、
                      定期的な振り返りと改善サイクルを確立。
                      長期的視点での成長戦略が効果的に機能しています。
                    </p>
                  </div>
                </div>
              </div>

              {/* 順位推移分析 */}
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-green-600 text-lg">🎯</span>
                  <h6 className="font-semibold text-green-800">順位推移分析</h6>
                  <div className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">
                    施設内{evaluationData[evaluationData.length - 1]?.facilityRank?.rank || 12}位
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                    <p className="font-medium text-blue-800 mb-1">📈 施設内成長パターン</p>
                    <p className="text-blue-700">
                      施設内順位が{evaluationData[0]?.facilityRank?.rank || 42}位から{evaluationData[evaluationData.length - 1]?.facilityRank?.rank || 12}位へと
                      {(evaluationData[0]?.facilityRank?.rank || 42) - (evaluationData[evaluationData.length - 1]?.facilityRank?.rank || 12)}位の大幅な向上を示しており、
                      トップ層入りを果たしています。
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 border-l-4 border-purple-400 rounded">
                    <p className="font-medium text-purple-800 mb-1">🎯 法人内ポジション</p>
                    <p className="text-purple-700">
                      法人内でも{evaluationData[evaluationData.length - 1]?.corporateRank?.rank || 89}位という上位ポジションを確立。
                      さらなる成長により、法人全体のロールモデルとしての活躍が期待されます。
                    </p>
                  </div>
                </div>
              </div>

              {/* 長期成長指導アドバイス */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-indigo-600 text-lg">💡</span>
                  <h6 className="font-semibold text-indigo-800">長期成長指導アドバイス</h6>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-800 mb-2">📋 継続強化項目（短期）</p>
                    <ul className="space-y-1 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500">•</span>
                        <span>現在の高評価要因の維持・強化</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500">•</span>
                        <span>専門技術のさらなる向上</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500">•</span>
                        <span>定期的な成長モニタリング</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 mb-2">🚀 リーダーシップ開発（中長期）</p>
                    <ul className="space-y-1 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500">•</span>
                        <span>新人・若手職員の指導役任命</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500">•</span>
                        <span>プロジェクトリーダー経験の蓄積</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500">•</span>
                        <span>管理職候補としての育成プラン</span>
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
                    評価データから個人特性を解析し、成長要因を自動分析します。
                    医療業界特化のプロンプトエンジニアリングにより、
                    より精密で実用的な要因分析と育成提案を生成予定です。
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">💡</div>
              <p>評価履歴データを読み込み中...</p>
              <p className="text-sm mt-1">職員の評価履歴データを元に成長分析コメントを表示します。</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InterpretationComments