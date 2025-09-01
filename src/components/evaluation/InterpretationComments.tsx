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
  Eye,
  EyeOff,
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
      <Card className={`${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <RefreshCw className="animate-spin" size={20} />
            <span className="text-gray-600">AI解釈を生成中...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={`border-red-200 bg-red-50 ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 text-red-600">
            <AlertTriangle size={20} />
            <span>{error}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={generateComments}
              className="ml-auto"
            >
              再試行
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageCircle className="text-blue-600" size={20} />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">
                🤖 人事指導支援AI解釈
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                評価データに基づく指導アドバイスと成長支援提案
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAllComments}
              className="text-xs"
            >
              {expandedComments.size === comments.length ? '全て閉じる' : '全て展開'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(!isVisible)}
            >
              {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {isVisible && (
        <CardContent>
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
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}

export default InterpretationComments