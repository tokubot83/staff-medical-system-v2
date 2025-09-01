'use client'

import React, { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshCw, Brain, Target, TrendingUp, Users } from 'lucide-react'

interface MentorshipEffectivenessAnalysisProps {
  staffId: string
  interviewData: any[]
  staffInfo: any
  category: 'regular' | 'special' | 'support'
}

interface MentorshipEffectivenessData {
  title: string
  effectivenessScore: number
  behaviorChange: string
  goalAlignment: string
  satisfactionLevel: string
  strengths: string[]
  improvementOpportunities: string[]
  optimizationSuggestions: string[]
  relationshipMetrics: {
    trustLevel: number
    communicationQuality: number
    supportPerception: number
  }
}

export default function MentorshipEffectivenessAnalysis({
  staffId,
  interviewData,
  staffInfo,
  category
}: MentorshipEffectivenessAnalysisProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisData, setAnalysisData] = useState<MentorshipEffectivenessData | null>(null)

  // メンタリング効果専用プロンプト生成
  const generateMentorshipAnalysisPrompt = (data: any[], staff: any) => {
    return `面談メンタリング効果の総合評価分析を実施してください。

【分析対象】
- 職員: ${staff.name || '未設定'}
- 面談種別: ${category}面談
- メンタリング期間: ${data.length}回分の面談実績

【分析要求】
メンタリング関係と効果測定に特化した分析:

1. 【行動変容効果測定】
   - 面談後の具体的行動変化の追跡
   - 目標達成率と実現期間の分析
   - 持続可能な変化の定着度評価

2. 【メンター・メンティー関係分析】
   - 信頼関係の構築度と発展過程
   - コミュニケーション品質の向上
   - 支援認識度と相互理解レベル

3. 【長期成長戦略評価】
   - 短期目標と中長期ビジョンの整合性
   - キャリア開発支援の有効性
   - 自立的成長への移行度合い

メンタリング関係の最適化と持続的成長支援策を提案してください。`
  }

  // メンタリング効果AI分析実行
  const performMentorshipAnalysis = async () => {
    setIsAnalyzing(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3500))
      
      const mockAnalysisData: MentorshipEffectivenessData = {
        title: 'メンタリング効果測定',
        effectivenessScore: 91,
        behaviorChange: '面談後30日以内の行動変容実現率87%。設定した目標の78%が期限内に達成され、特に技術スキル向上目標（92%達成）とコミュニケーション改善目標（84%達成）で顕著な成果。',
        goalAlignment: '短期目標と中長期キャリアプランの整合性が高く、体系的な成長戦略が構築されている。法人内昇進希望と現在のスキル開発方向が一致し、実現可能な成長パスが明確化。',
        satisfactionLevel: '面談満足度4.7/5.0点。「話しやすさ」「具体的アドバイス」「将来展望の明確化」の評価が特に高く、メンター・メンティー関係は理想的な状態を維持。',
        strengths: [
          'メンターとの信頼関係構築力',
          'アクションプランの具体性と実現可能性',
          '継続的な成長マインドセット',
          '自己改善への能動的取り組み姿勢'
        ],
        improvementOpportunities: [
          '法人レベルでのキャリア展望の拡大',
          '他部門との連携機会創出',
          'メンター以外からの多角的フィードバック取得',
          '業界全体での専門性位置づけ認識'
        ],
        optimizationSuggestions: [
          '面談頻度を月1回→3週間間隔に最適化',
          '360度フィードバックの定期実施（6ヶ月毎）',
          '法人横断プロジェクト参画機会の提供',
          '外部研修・学会参加支援の拡充',
          'ピアメンタリング制度の導入検討'
        ],
        relationshipMetrics: {
          trustLevel: 94,
          communicationQuality: 88,
          supportPerception: 91
        }
      }
      
      setAnalysisData(mockAnalysisData)
    } catch (error) {
      console.error('Mentorship analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  useEffect(() => {
    if (interviewData && interviewData.length > 0) {
      performMentorshipAnalysis()
    }
  }, [staffId, interviewData])

  if (!interviewData || interviewData.length === 0) {
    return null
  }

  return (
    <div className="border-l-4 border-purple-500 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <span className="text-purple-600 text-xl">🤖</span>
          </div>
          <div>
            <h5 className="font-bold text-lg text-gray-800">AIメンタリング効果分析</h5>
            <p className="text-sm text-gray-600">行動変容・関係性・長期成長戦略評価</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-2 py-1 bg-purple-200 text-purple-800 text-xs rounded-full font-medium">
            ローカルLLM対応予定
          </div>
          <Button
            onClick={performMentorshipAnalysis}
            disabled={isAnalyzing}
            className="px-3 py-1 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? '解析中' : '解釈生成'}
          </Button>
        </div>
      </div>

      {isAnalyzing ? (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3 text-purple-700">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="font-medium">メンタリング関係を包括分析中...</span>
          </div>
        </div>
      ) : analysisData ? (
        <div className="space-y-4">
          {/* メイン効果測定 */}
          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-5 w-5 text-purple-600" />
              <h6 className="font-semibold text-purple-800">{analysisData.title}</h6>
              <div className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded font-medium">
                効果スコア {analysisData.effectivenessScore}点
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-cyan-50 border-l-4 border-cyan-400 rounded">
                <p className="font-medium text-cyan-800 mb-1">🎯 行動変容実現</p>
                <p className="text-cyan-700">{analysisData.behaviorChange}</p>
              </div>
              <div className="p-3 bg-teal-50 border-l-4 border-teal-400 rounded">
                <p className="font-medium text-teal-800 mb-1">🎪 目標整合性</p>
                <p className="text-teal-700 mb-2">{analysisData.goalAlignment}</p>
                <p className="text-teal-600 text-xs">{analysisData.satisfactionLevel}</p>
              </div>
            </div>
          </div>

          {/* 関係性指標 */}
          <div className="bg-white rounded-lg p-4 border border-indigo-200">
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-5 w-5 text-indigo-600" />
              <h6 className="font-semibold text-indigo-800">メンター・メンティー関係指標</h6>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center p-3 bg-rose-50 rounded-lg">
                <div className="text-xl font-bold mb-1 text-rose-600">
                  {analysisData.relationshipMetrics.trustLevel}点
                </div>
                <div className="text-xs text-rose-700">信頼関係レベル</div>
              </div>
              <div className="text-center p-3 bg-sky-50 rounded-lg">
                <div className="text-xl font-bold mb-1 text-sky-600">
                  {analysisData.relationshipMetrics.communicationQuality}点
                </div>
                <div className="text-xs text-sky-700">コミュニケーション品質</div>
              </div>
              <div className="text-center p-3 bg-amber-50 rounded-lg">
                <div className="text-xl font-bold mb-1 text-amber-600">
                  {analysisData.relationshipMetrics.supportPerception}点
                </div>
                <div className="text-xs text-amber-700">支援認識度</div>
              </div>
            </div>
          </div>

          {/* 強みと向上機会 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-emerald-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-emerald-600 text-lg">💪</span>
                <h6 className="font-semibold text-emerald-800 text-sm">メンタリング強み</h6>
              </div>
              <ul className="space-y-1">
                {analysisData.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2 text-emerald-700 text-xs">
                    <span className="text-emerald-500">•</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-amber-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-amber-600 text-lg">🚀</span>
                <h6 className="font-semibold text-amber-800 text-sm">向上機会</h6>
              </div>
              <ul className="space-y-1">
                {analysisData.improvementOpportunities.map((opportunity, index) => (
                  <li key={index} className="flex items-start gap-2 text-amber-700 text-xs">
                    <span className="text-amber-500">•</span>
                    <span>{opportunity}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 最適化提案 */}
          <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg p-4 border border-violet-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-violet-600 text-lg">💡</span>
              <h6 className="font-semibold text-violet-800">メンタリング最適化戦略</h6>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="font-medium text-gray-800 mb-2">🔧 システム改善（1-3ヶ月）</p>
                <div className="space-y-1">
                  {analysisData.optimizationSuggestions.slice(0, 3).map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-2 text-gray-700">
                      <span className="text-violet-500">•</span>
                      <span>{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-medium text-gray-800 mb-2">🌟 拡張支援（4-12ヶ月）</p>
                <div className="space-y-1">
                  {analysisData.optimizationSuggestions.slice(3).map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-2 text-gray-700">
                      <span className="text-purple-500">•</span>
                      <span>{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-3 p-3 bg-white/50 rounded border border-purple-200">
              <div className="flex items-center gap-2 mb-1">
                <Brain className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-purple-800 text-sm">AI関係性アドバイス</span>
                <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700 border-purple-300">
                  Llama 3.2 分析
                </Badge>
              </div>
              <p className="text-sm text-purple-700 leading-relaxed">
                {staffInfo.name}さんとのメンタリング関係は理想的な状態を維持しており、
                高い行動変容率と満足度を達成。今後は法人レベルでの成長機会拡大と、
                他の職員への好事例共有を通じて、組織全体のメンタリング品質向上に貢献できます。
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-purple-600">
          <Brain className="h-8 w-8 mx-auto mb-2" />
          <p>メンタリング効果分析を実行してください</p>
        </div>
      )}
    </div>
  )
}