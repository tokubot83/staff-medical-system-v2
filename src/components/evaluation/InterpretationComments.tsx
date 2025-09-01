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
  className = ''
}) => {
  const [comments, setComments] = useState<InterpretationComment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set())
  const [isVisible, setIsVisible] = useState(true)

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
                評価履歴分析に基づく個別指導提案
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 bg-purple-200 text-purple-800 text-xs rounded-full font-medium">
              ローカルLLM対応予定
            </div>
            <button 
              className="px-3 py-1 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors"
              onClick={toggleAllComments}
            >
              {expandedComments.size === comments.length ? '全て閉じる' : '全て展開'}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle size={48} className="mx-auto mb-3 opacity-50" />
              <p>評価データが不足しているため、解釈コメントを生成できません。</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  isExpanded={expandedComments.has(comment.id)}
                  onToggle={() => toggleComment(comment.id)}
                />
              ))}
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <RefreshCw size={14} />
                  <span>
                    このAI解釈は評価データのパターン分析に基づいています。
                    将来的にはLLMによるより高度な解釈に対応予定です。
                  </span>
                </div>
              </div>

              {/* 拡張AI人事指導機能 */}
              <div className="mt-8 border-t border-gray-200 pt-6">
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-6 border border-emerald-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <span className="text-emerald-600 text-xl">📈</span>
                      </div>
                      <div>
                        <h5 className="font-bold text-lg text-gray-800">
                          時系列成長パターン分析
                        </h5>
                        <p className="text-sm text-gray-600">
                          評価履歴から読み取る成長軌道と指導戦略
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="px-2 py-1 bg-emerald-200 text-emerald-800 text-xs rounded-full font-medium">
                        ローカルLLM統合予定
                      </div>
                      <button className="px-3 py-1 bg-emerald-600 text-white text-sm rounded-md hover:bg-emerald-700 transition-colors">
                        詳細分析
                      </button>
                    </div>
                  </div>

                  {/* 成長軌道分析 */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* 左カラム：成長パターン */}
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 border border-blue-200">
                        <h6 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                          <span className="text-blue-600">📊</span>
                          成長軌道パターン
                        </h6>
                        <div className="space-y-3">
                          <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded">
                            <p className="font-medium text-green-800 mb-1">🚀 急成長フェーズ検出</p>
                            <p className="text-sm text-green-700">
                              2022年7月〜2023年3月の期間で<strong>42位→12位（30位上昇）</strong>の
                              顕著な成長を確認。この時期の成功要因の分析と再現が重要です。
                            </p>
                          </div>
                          <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                            <p className="font-medium text-blue-800 mb-1">📈 安定成長期</p>
                            <p className="text-sm text-blue-700">
                              2023年4月以降は<strong>上位10%</strong>を維持する安定期。
                              現在の水準を保持しつつ、さらなる高次目標設定が効果的です。
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 border border-orange-200">
                        <h6 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                          <span className="text-orange-600">🔍</span>
                          成長要因分析
                        </h6>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-start gap-2">
                            <span className="text-emerald-500 font-bold">✓</span>
                            <span><strong>技術スキル向上：</strong>専門研修受講後の評価向上が顕著</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-emerald-500 font-bold">✓</span>
                            <span><strong>チームワーク強化：</strong>協調性評価の継続的改善</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-emerald-500 font-bold">✓</span>
                            <span><strong>リーダーシップ発揮：</strong>後輩指導を通じた成長実感</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 右カラム：指導戦略 */}
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 border border-purple-200">
                        <h6 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                          <span className="text-purple-600">🎯</span>
                          個別指導戦略
                        </h6>
                        <div className="space-y-3">
                          <div className="p-3 bg-purple-50 border-l-4 border-purple-400 rounded">
                            <p className="font-medium text-purple-800 mb-1">🌟 強み最大化アプローチ</p>
                            <p className="text-sm text-purple-700">
                              現在の<strong>上位10%</strong>ポジションを活かし、施設内リーダー候補として
                              積極的に責任のある役割を任命することを推奨します。
                            </p>
                          </div>
                          <div className="p-3 bg-indigo-50 border-l-4 border-indigo-400 rounded">
                            <p className="font-medium text-indigo-800 mb-1">📚 継続成長サポート</p>
                            <p className="text-sm text-indigo-700">
                              成長停滞を防ぐため、<strong>法人横断プロジェクト</strong>や
                              <strong>外部研修</strong>への参加で新たな刺激と学習機会を提供。
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 border border-red-200">
                        <h6 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                          <span className="text-red-600">⚠️</span>
                          注意すべきリスク
                        </h6>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-start gap-2">
                            <span className="text-red-500 font-bold">!</span>
                            <span><strong>成長停滞リスク：</strong>現状維持による慢心・モチベーション低下</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-amber-500 font-bold">△</span>
                            <span><strong>バーンアウト予防：</strong>高い期待値によるプレッシャー管理</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-blue-500 font-bold">i</span>
                            <span><strong>定期面談必須：</strong>月1回の1on1での心理的サポート</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 具体的アクションプラン */}
                  <div className="mt-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-200">
                    <h6 className="font-semibold text-indigo-800 mb-4 flex items-center gap-2">
                      <span className="text-indigo-600">📋</span>
                      次四半期アクションプラン
                    </h6>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="bg-white p-3 rounded-lg border">
                        <p className="font-medium text-gray-800 mb-2">🎯 第1ヶ月目標</p>
                        <ul className="space-y-1 text-gray-700">
                          <li>• 新人指導メンター任命</li>
                          <li>• 部署改善提案の実施</li>
                          <li>• リーダーシップ研修受講</li>
                        </ul>
                      </div>
                      <div className="bg-white p-3 rounded-lg border">
                        <p className="font-medium text-gray-800 mb-2">📈 第2-3ヶ月目標</p>
                        <ul className="space-y-1 text-gray-700">
                          <li>• 法人内プロジェクト参加</li>
                          <li>• 他施設見学・研修</li>
                          <li>• 専門資格取得準備</li>
                        </ul>
                      </div>
                      <div className="bg-white p-3 rounded-lg border">
                        <p className="font-medium text-gray-800 mb-2">🚀 長期目標設定</p>
                        <ul className="space-y-1 text-gray-700">
                          <li>• 主任候補選抜</li>
                          <li>• 外部講師・事例発表</li>
                          <li>• 後継者育成プログラム</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* LLM統合予定機能説明 */}
                  <div className="mt-6 p-4 bg-gray-100 rounded-lg border">
                    <div className="flex items-start gap-3">
                      <span className="text-emerald-600 text-lg">⚡</span>
                      <div className="text-sm text-gray-600">
                        <p className="font-medium mb-2">ローカルLLM統合による機能拡張予定</p>
                        <ul className="space-y-1 text-xs">
                          <li>• <strong>個人特性分析：</strong>過去の面談記録・評価コメントを統合した性格・行動パターン分析</li>
                          <li>• <strong>カスタマイズド指導：</strong>職種・経験年数・学習スタイルに応じた最適化アドバイス</li>
                          <li>• <strong>予測分析：</strong>現在の成長軌道から将来のキャリアパス・リスクを予測</li>
                          <li>• <strong>比較分析：</strong>類似プロファイル職員の成功パターンとの比較・ベンチマーク</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
        </div>
      </div>
    </div>
  )
}

export default InterpretationComments