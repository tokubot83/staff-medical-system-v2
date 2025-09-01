'use client'

import React, { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshCw, Brain, Users, Clock, Star } from 'lucide-react'

interface InterviewOverallAnalysisProps {
  staffId: string
  interviewData: any[]
  staffInfo: any
  category: 'regular' | 'special' | 'support'
}

interface OverallAnalysisData {
  processOptimization: {
    currentFrequency: string
    optimalFrequency: string
    timingRecommendation: string
    efficiencyScore: number
  }
  satisfactionMetrics: {
    overallSatisfaction: number
    trendDirection: 'up' | 'down' | 'stable'
    keyDrivers: string[]
    concernAreas: string[]
  }
  continuityAssessment: {
    retentionRate: number
    engagementLevel: string
    dropoutRisk: 'low' | 'medium' | 'high'
    sustainabilityFactors: string[]
  }
  systemRecommendations: string[]
}

export default function InterviewOverallAnalysis({
  staffId,
  interviewData,
  staffInfo,
  category
}: InterviewOverallAnalysisProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisData, setAnalysisData] = useState<OverallAnalysisData | null>(null)

  // 面談制度全体分析用プロンプト生成
  const generateOverallAnalysisPrompt = (data: any[], staff: any) => {
    return `医療職員面談制度の総合評価分析を実施してください。

【職員情報】
- 氏名: ${staff.name || '未設定'}
- 職種: ${staff.position || '未設定'}  
- 面談カテゴリ: ${category}面談

【分析要求】
面談制度そのものの最適化に焦点を当てて分析:

1. 【面談プロセス最適化】
   - 現在の面談頻度の適切性評価
   - 最適な面談間隔の提案
   - 面談タイミングの改善案

2. 【面談満足度分析】  
   - 総合満足度の推移分析
   - 満足度を左右する主要因子
   - 不満要因の特定と対策

3. 【継続性評価】
   - 面談参加の継続率
   - エンゲージメント維持要因
   - 離脱リスクの評価

面談制度改善のための具体的システム改善提案を含めてください。`
  }

  // 面談制度全体AI分析実行
  const performOverallAnalysis = async () => {
    setIsAnalyzing(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2500))
      
      const mockAnalysisData: OverallAnalysisData = {
        processOptimization: {
          currentFrequency: '月1回',
          optimalFrequency: '3週間間隔',
          timingRecommendation: '業務負荷が軽い月初第2週の午後が最適。集中しやすい環境確保により面談品質が向上。',
          efficiencyScore: 87
        },
        satisfactionMetrics: {
          overallSatisfaction: 4.6,
          trendDirection: 'up',
          keyDrivers: ['具体的アドバイス提供', '話しやすい雰囲気', '実用的なアクションプラン'],
          concernAreas: ['面談時間の短さ', '他部署との調整不足']
        },
        continuityAssessment: {
          retentionRate: 94,
          engagementLevel: '高レベル',
          dropoutRisk: 'low',
          sustainabilityFactors: ['明確な成長実感', '職場環境改善', '上司との信頼関係']
        },
        systemRecommendations: [
          '面談記録のデジタル化による継続性向上',
          '他部署連携強化のための横断的フォローアップ',
          '面談効果測定指標の定期レビュー実装',
          'AI支援による事前準備最適化'
        ]
      }
      
      setAnalysisData(mockAnalysisData)
    } catch (error) {
      console.error('Overall analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  useEffect(() => {
    if (interviewData && interviewData.length > 0) {
      performOverallAnalysis()
    }
  }, [staffId, interviewData])

  if (!interviewData || interviewData.length === 0) {
    return null
  }

  return (
    <div className="mt-4 border-l-4 border-indigo-500 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <span className="text-indigo-600 text-lg">🤖</span>
          </div>
          <div>
            <h6 className="font-bold text-base text-gray-800">AI面談制度最適化アドバイス</h6>
            <p className="text-xs text-gray-600">面談プロセス改善・満足度向上・継続性強化</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-2 py-1 bg-indigo-200 text-indigo-800 text-xs rounded-full font-medium">
            ローカルLLM対応予定
          </div>
          <Button
            onClick={performOverallAnalysis}
            disabled={isAnalyzing}
            className="px-2 py-1 bg-indigo-600 text-white text-xs rounded-md hover:bg-indigo-700 transition-colors gap-1"
            size="sm"
          >
            <RefreshCw className={`h-3 w-3 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? '解析中' : '分析'}
          </Button>
        </div>
      </div>

      {isAnalyzing ? (
        <div className="flex items-center justify-center py-6">
          <div className="flex items-center gap-2 text-indigo-700">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span className="text-sm">面談制度を総合分析中...</span>
          </div>
        </div>
      ) : analysisData ? (
        <div className="space-y-3">
          {/* プロセス最適化 */}
          <div className="bg-white rounded-lg p-3 border border-cyan-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-cyan-600" />
              <h7 className="font-semibold text-cyan-800 text-sm">面談プロセス最適化</h7>
              <div className="px-2 py-0.5 bg-cyan-100 text-cyan-700 text-xs rounded font-medium">
                効率スコア {analysisData.processOptimization.efficiencyScore}点
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-2 bg-blue-50 border-l-3 border-blue-400 rounded">
                <p className="font-medium text-blue-800 mb-1">⏰ 頻度最適化</p>
                <p className="text-blue-700">
                  現在: {analysisData.processOptimization.currentFrequency} → 
                  推奨: {analysisData.processOptimization.optimalFrequency}
                </p>
              </div>
              <div className="p-2 bg-green-50 border-l-3 border-green-400 rounded">
                <p className="font-medium text-green-800 mb-1">🎯 タイミング最適化</p>
                <p className="text-green-700">{analysisData.processOptimization.timingRecommendation}</p>
              </div>
            </div>
          </div>

          {/* 満足度分析 */}
          <div className="bg-white rounded-lg p-3 border border-emerald-200">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-4 w-4 text-emerald-600" />
              <h7 className="font-semibold text-emerald-800 text-sm">満足度分析</h7>
              <div className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded font-medium">
                {analysisData.satisfactionMetrics.overallSatisfaction}/5.0点 
                {analysisData.satisfactionMetrics.trendDirection === 'up' ? '↗' : 
                 analysisData.satisfactionMetrics.trendDirection === 'down' ? '↘' : '→'}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-green-50 rounded">
                <p className="font-medium text-green-800 mb-1">✨ 満足度要因</p>
                <ul className="space-y-0.5">
                  {analysisData.satisfactionMetrics.keyDrivers.map((driver, index) => (
                    <li key={index} className="flex items-start gap-1 text-green-700">
                      <span className="text-green-500">•</span>
                      <span>{driver}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-2 bg-orange-50 rounded">
                <p className="font-medium text-orange-800 mb-1">⚠️ 改善要因</p>
                <ul className="space-y-0.5">
                  {analysisData.satisfactionMetrics.concernAreas.map((concern, index) => (
                    <li key={index} className="flex items-start gap-1 text-orange-700">
                      <span className="text-orange-500">•</span>
                      <span>{concern}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 継続性評価 */}
          <div className="bg-white rounded-lg p-3 border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-purple-600" />
              <h7 className="font-semibold text-purple-800 text-sm">継続性評価</h7>
              <div className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded font-medium">
                継続率 {analysisData.continuityAssessment.retentionRate}%
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-2 bg-teal-50 border-l-3 border-teal-400 rounded">
                <p className="font-medium text-teal-800 mb-1">🎪 エンゲージメント</p>
                <p className="text-teal-700">
                  現在レベル: {analysisData.continuityAssessment.engagementLevel} | 
                  離脱リスク: {analysisData.continuityAssessment.dropoutRisk === 'low' ? '低' : 
                             analysisData.continuityAssessment.dropoutRisk === 'medium' ? '中' : '高'}
                </p>
              </div>
              <div className="p-2 bg-indigo-50 rounded">
                <p className="font-medium text-indigo-800 mb-1">🔄 持続要因</p>
                <div className="grid grid-cols-1 gap-0.5">
                  {analysisData.continuityAssessment.sustainabilityFactors.map((factor, index) => (
                    <div key={index} className="flex items-start gap-1 text-indigo-700">
                      <span className="text-indigo-500">•</span>
                      <span>{factor}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* システム改善提案 */}
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-3 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-4 w-4 text-gray-600" />
              <span className="font-medium text-gray-800 text-sm">システム改善提案</span>
              <Badge variant="outline" className="text-xs bg-gray-100 text-gray-700 border-gray-300">
                Llama 3.2 分析
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {analysisData.systemRecommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-1 text-gray-700">
                  <span className="text-gray-500">•</span>
                  <span>{recommendation}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-4 text-indigo-600">
          <Brain className="h-6 w-6 mx-auto mb-1" />
          <p className="text-sm">面談制度分析を実行してください</p>
        </div>
      )}
    </div>
  )
}