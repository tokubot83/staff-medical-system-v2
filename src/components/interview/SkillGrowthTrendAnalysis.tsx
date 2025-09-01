'use client'

import React, { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshCw, Brain, BarChart3, TrendingUp } from 'lucide-react'

interface SkillGrowthTrendAnalysisProps {
  staffId: string
  interviewData: any[]
  staffInfo: any
  category: 'regular' | 'special' | 'support'
}

interface SkillGrowthTrendData {
  title: string
  currentScore: number
  previousScore: number
  trendAnalysis: string
  interventionTiming: string
  strongestAreas: string[]
  improvementAreas: string[]
  actionPlans: string[]
  predictionRange: {
    nextScore: string
    confidence: number
  }
}

export default function SkillGrowthTrendAnalysis({
  staffId,
  interviewData,
  staffInfo,
  category
}: SkillGrowthTrendAnalysisProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisData, setAnalysisData] = useState<SkillGrowthTrendData | null>(null)

  // スキル成長トレンド専用プロンプト生成
  const generateSkillGrowthAnalysisPrompt = (data: any[], staff: any) => {
    return `医療職員のスキル別成長トレンドの詳細分析を実施してください。

【分析対象】
- 職員: ${staff.name || '未設定'}
- 面談種別: ${category}面談
- データ期間: ${data.length}回分のスキル成長記録

【分析要求】
スキル別成長トレンドグラフの解釈に特化した分析:

1. 【スキル成長パターン解析】
   - 各スキル領域の成長推移と統計的特徴
   - 技術・コミュニケーション・リーダーシップの成長バランス
   - 成長期・停滞期・breakthrough期の要因分析

2. 【スキル向上支援最適化】
   - 成長鈍化の早期予兆検出とアラート
   - 各スキル領域に応じた効果的な研修タイミング
   - 個人の学習スタイルに合わせた予防的アプローチ

3. 【スキル成長予測】
   - 現在のトレンドに基づく次回スキルレベル予測
   - 成長予測の信頼度とリスク要因評価
   - 目標達成までの期間予測

スキル成長データに基づく具体的な能力開発指導方針を提案してください。`
  }

  // スキル成長トレンドAI分析実行
  const performSkillGrowthAnalysis = async () => {
    setIsAnalyzing(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2800))
      
      const mockAnalysisData: SkillGrowthTrendData = {
        title: 'スキル別成長トレンド分析',
        currentScore: 82,
        previousScore: 75,
        trendAnalysis: `${category}面談において過去${interviewData.length}回の継続実施により、スコアが75点から82点に向上（+9.3%）。特に直近3回の面談で着実な上昇傾向を示し、安定成長フェーズに移行。`,
        interventionTiming: 'スコア推移パターン分析により、現在は介入不要。ただし、82点到達後の停滞期を防ぐため、2週間後の定期チェックでモチベーション維持策を実施推奨。',
        strongestAreas: ['目標設定の明確化', '自己評価の客観性向上', '行動変容の継続性'],
        improvementAreas: ['ストレス管理スキル', '時間管理の最適化', '同僚との協調性'],
        actionPlans: [
          'ストレス管理研修への参加（1ヶ月以内）',
          '時間管理ツールの導入と習慣化（2週間）',
          '同僚とのペアワーク機会の増加（継続的）'
        ],
        predictionRange: {
          nextScore: '84-87点',
          confidence: 78
        }
      }
      
      setAnalysisData(mockAnalysisData)
    } catch (error) {
      console.error('Skill growth analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  useEffect(() => {
    if (interviewData && interviewData.length > 0) {
      performSkillGrowthAnalysis()
    }
  }, [staffId, interviewData])

  if (!interviewData || interviewData.length === 0) {
    return null
  }

  return (
    <div className="border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <span className="text-blue-600 text-xl">🤖</span>
          </div>
          <div>
            <h5 className="font-bold text-lg text-gray-800">AIスキル成長トレンド分析</h5>
            <p className="text-sm text-gray-600">スキル別成長パターンと能力開発予測</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded-full font-medium">
            ローカルLLM対応予定
          </div>
          <Button
            onClick={performSkillGrowthAnalysis}
            disabled={isAnalyzing}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? '解析中' : '解釈生成'}
          </Button>
        </div>
      </div>

      {isAnalyzing ? (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3 text-blue-700">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="font-medium">スキル成長パターンを分析中...</span>
          </div>
        </div>
      ) : analysisData ? (
        <div className="space-y-4">
          {/* メインスコア分析 */}
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <h6 className="font-semibold text-blue-800">{analysisData.title}</h6>
              <div className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium">
                {analysisData.currentScore}点 ({((analysisData.currentScore / analysisData.previousScore - 1) * 100).toFixed(1)}%↗)
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded">
                <p className="font-medium text-green-800 mb-1">📈 スキル成長パターン</p>
                <p className="text-green-700">{analysisData.trendAnalysis}</p>
              </div>
              <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                <p className="font-medium text-blue-800 mb-1">⏰ 介入タイミング最適化</p>
                <p className="text-blue-700">{analysisData.interventionTiming}</p>
              </div>
              <div className="p-3 bg-purple-50 border-l-4 border-purple-400 rounded">
                <p className="font-medium text-purple-800 mb-1">🔮 次回スキルレベル予測</p>
                <p className="text-purple-700">
                  予測範囲: {analysisData.predictionRange.nextScore} 
                  （信頼度: {analysisData.predictionRange.confidence}%）
                </p>
              </div>
            </div>
          </div>

          {/* 詳細分析エリア */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <h6 className="font-semibold text-green-800 text-sm">効果的な領域</h6>
              </div>
              <ul className="space-y-1">
                {analysisData.strongestAreas.map((area, index) => (
                  <li key={index} className="flex items-start gap-2 text-green-700 text-xs">
                    <span className="text-green-500">•</span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-yellow-200">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="h-4 w-4 text-yellow-600" />
                <h6 className="font-semibold text-yellow-800 text-sm">重点改善領域</h6>
              </div>
              <ul className="space-y-1">
                {analysisData.improvementAreas.map((area, index) => (
                  <li key={index} className="flex items-start gap-2 text-yellow-700 text-xs">
                    <span className="text-yellow-500">•</span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* アクションプラン */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-indigo-600 text-lg">💡</span>
              <h6 className="font-semibold text-indigo-800">スキル成長アクションプラン</h6>
            </div>
            <div className="space-y-1 text-sm">
              {analysisData.actionPlans.map((action, index) => (
                <div key={index} className="flex items-start gap-2 text-gray-700">
                  <span className="text-blue-500">•</span>
                  <span>{action}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 bg-white/50 rounded border border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <Brain className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800 text-sm">AIスキル成長アドバイス</span>
                <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700 border-blue-300">
                  Llama 3.2 分析
                </Badge>
              </div>
              <p className="text-sm text-blue-700 leading-relaxed">
                {staffInfo.name}さんのスキル成長トレンドは理想的なパターンを示しており、バランスの取れた能力向上が期待できます。
                現在の成長軌道を維持するため、各スキル領域に応じた個別研修と実践機会の提供を推奨します。
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-blue-600">
          <Brain className="h-8 w-8 mx-auto mb-2" />
          <p>スキル成長トレンド分析を実行してください</p>
        </div>
      )}
    </div>
  )
}