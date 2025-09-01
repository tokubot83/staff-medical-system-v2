'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshCw, Brain, TrendingUp } from 'lucide-react'

interface InterviewInterpretationCommentsProps {
  staffId: string
  interviewData: any[]
  staffInfo: any
  category: 'regular' | 'special' | 'support'
}

interface FactorAnalysisData {
  skillDevelopment: {
    title: string
    content: string
    trend: 'up' | 'down' | 'stable'
    score: number
  }
  organizationalContribution: {
    title: string
    content: string
    trend: 'up' | 'down' | 'stable'  
    score: number
  }
  continuousGrowth: {
    title: string
    content: string
    trend: 'up' | 'down' | 'stable'
    score: number
  }
}

export default function InterviewInterpretationComments({
  staffId,
  interviewData, 
  staffInfo,
  category
}: InterviewInterpretationCommentsProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisData, setAnalysisData] = useState<FactorAnalysisData | null>(null)

  // 面談データから基本統計を計算
  const getBasicStats = () => {
    if (!interviewData || interviewData.length === 0) return null
    
    const totalInterviews = interviewData.length
    const latestInterview = interviewData[0] // 最新が先頭と仮定
    const oldestInterview = interviewData[interviewData.length - 1]
    
    return {
      totalInterviews,
      latestDate: latestInterview?.date || '',
      oldestDate: oldestInterview?.date || '',
      latestScore: latestInterview?.overallScore || 'N/A',
      oldestScore: oldestInterview?.overallScore || 'N/A'
    }
  }

  // ローカルLLM分析用プロンプト生成
  const generateFactorAnalysisPrompt = (data: any[], staff: any) => {
    const stats = getBasicStats()
    if (!stats) return ''
    
    return `医療職員の面談成長要因を分析してください。

【職員情報】
- 氏名: ${staff.name || '未設定'}
- 職種: ${staff.position || '未設定'}
- ID: ${staff.id}

【面談実績】
- 面談回数: ${stats.totalInterviews}回
- 評価変化: ${stats.oldestScore} → ${stats.latestScore}
- 期間: ${stats.oldestDate} ～ ${stats.latestDate}

以下3つの観点で要因分析してください:

1. 技術力向上要因（専門スキル、患者ケア能力の向上）
2. 組織貢献度向上（チームワーク、コミュニケーション向上）
3. 継続成長の秘訣（学習姿勢、目標設定能力の向上）

各観点で具体的な改善点と推奨アクションを提案してください。`
  }

  // AI分析実行（実装時にはローカルLLM APIを呼び出し）
  const performFactorAnalysis = async () => {
    setIsAnalyzing(true)
    
    try {
      // 現在はモックデータ、実装時にはLlama 3.2 APIコール
      await new Promise(resolve => setTimeout(resolve, 2000)) // 分析中表示のため
      
      const mockAnalysisData: FactorAnalysisData = {
        skillDevelopment: {
          title: '技術力向上要因',
          content: `面談記録から継続的なスキル向上が確認されました。特に患者対応スキルが${category === 'regular' ? '月次' : 'カテゴリ別'}面談を通じて着実に向上。専門知識の習得意欲が高く、新しい医療技術への適応力も優秀です。`,
          trend: 'up',
          score: 85
        },
        organizationalContribution: {
          title: '組織貢献度向上',
          content: `チーム内での協調性とリーダーシップが面談記録で一貫して高評価。後輩指導への積極性と、部門横断的なプロジェクトへの参画意欲が組織全体の成果向上に寄与しています。`,
          trend: 'up',
          score: 78
        },
        continuousGrowth: {
          title: '継続成長の秘訣',
          content: `自己省察力と目標設定スキルが面談を通じて向上。定期的な学習計画の立案と実行、フィードバックの積極的な活用が継続成長の基盤となっています。キャリア目標への意識も明確化されています。`,
          trend: 'up',
          score: 82
        }
      }
      
      setAnalysisData(mockAnalysisData)
    } catch (error) {
      console.error('Factor analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // 初回分析実行
  useEffect(() => {
    if (interviewData && interviewData.length > 0) {
      performFactorAnalysis()
    }
  }, [staffId, interviewData])

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
      default: return <TrendingUp className="h-4 w-4 text-gray-500 rotate-90" />
    }
  }

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'text-green-700'
      case 'down': return 'text-red-700'  
      default: return 'text-gray-700'
    }
  }

  if (!interviewData || interviewData.length === 0) {
    return (
      <Card className="mt-6">
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">面談データが不足しているため、要因分析を実行できません。</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            <span>AI面談成長要因分析</span>
            <Badge variant="outline" className="ml-2">
              {category === 'regular' ? '定期面談' : category === 'special' ? '特別面談' : 'サポート面談'}
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={performFactorAnalysis}
            disabled={isAnalyzing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? '分析中...' : '再分析'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isAnalyzing ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3 text-gray-600">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>面談データを詳細分析中...</span>
            </div>
          </div>
        ) : analysisData ? (
          <div className="space-y-6">
            {/* 技術力向上要因 */}
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <h4 className="font-semibold text-green-800">{analysisData.skillDevelopment.title}</h4>
                  {getTrendIcon(analysisData.skillDevelopment.trend)}
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  {analysisData.skillDevelopment.score}点
                </Badge>
              </div>
              <p className={`text-sm leading-relaxed ${getTrendColor(analysisData.skillDevelopment.trend)}`}>
                {analysisData.skillDevelopment.content}
              </p>
            </div>

            {/* 組織貢献度向上 */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <h4 className="font-semibold text-blue-800">{analysisData.organizationalContribution.title}</h4>
                  {getTrendIcon(analysisData.organizationalContribution.trend)}
                </div>
                <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                  {analysisData.organizationalContribution.score}点
                </Badge>
              </div>
              <p className={`text-sm leading-relaxed ${getTrendColor(analysisData.organizationalContribution.trend)}`}>
                {analysisData.organizationalContribution.content}
              </p>
            </div>

            {/* 継続成長の秘訣 */}
            <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <h4 className="font-semibold text-purple-800">{analysisData.continuousGrowth.title}</h4>
                  {getTrendIcon(analysisData.continuousGrowth.trend)}
                </div>
                <Badge className="bg-purple-100 text-purple-800 border-purple-300">
                  {analysisData.continuousGrowth.score}点
                </Badge>
              </div>
              <p className={`text-sm leading-relaxed ${getTrendColor(analysisData.continuousGrowth.trend)}`}>
                {analysisData.continuousGrowth.content}
              </p>
            </div>

            {/* 総合サマリー */}
            <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-gray-600" />
                <span className="font-medium text-gray-800">AI分析サマリー</span>
                <Badge variant="outline" className="text-xs">
                  Llama 3.2 分析
                </Badge>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {staffInfo.name}さんは{category === 'regular' ? '定期面談' : category === 'special' ? '特別面談' : 'サポート面談'}において
                総合的な成長を示しており、特に技術力と継続学習意欲の向上が顕著です。
                組織貢献度も着実に上昇しており、今後のリーダー候補として期待できます。
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            要因分析を実行してください
          </div>
        )}
      </CardContent>
    </Card>
  )
}