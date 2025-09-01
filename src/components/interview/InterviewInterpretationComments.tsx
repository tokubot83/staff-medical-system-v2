'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshCw, Brain, TrendingUp, BarChart3, MessageSquare, Target } from 'lucide-react'

interface InterviewInterpretationCommentsProps {
  staffId: string
  interviewData: any[]
  staffInfo: any
  category: 'regular' | 'special' | 'support'
}

// 面談特有の3軸分析データ構造
interface InterviewAnalysisData {
  scoreProgression: {
    title: string
    currentScore: number
    previousScore: number
    trendAnalysis: string
    interventionTiming: string
    strongestAreas: string[]
    improvementAreas: string[]
    actionPlans: string[]
  }
  responseQuality: {
    title: string
    qualityScore: number
    reflectionLevel: string
    detailImprovement: string
    emotionalWellness: string
    responseMaturity: string[]
    concernAreas: string[]
    guidanceRecommendations: string[]
  }
  mentorshipEffectiveness: {
    title: string
    effectivenessScore: number
    behaviorChange: string
    goalAlignment: string
    satisfactionLevel: string
    strengths: string[]
    improvementOpportunities: string[]
    optimizationSuggestions: string[]
  }
}

export default function InterviewInterpretationComments({
  staffId,
  interviewData, 
  staffInfo,
  category
}: InterviewInterpretationCommentsProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisData, setAnalysisData] = useState<InterviewAnalysisData | null>(null)

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

  // ローカルLLM分析用プロンプト生成（面談特化版）
  const generateInterviewAnalysisPrompt = (data: any[], staff: any) => {
    const stats = getBasicStats()
    if (!stats) return ''
    
    return `医療職員の面談効果分析を実施してください。

【職員情報】
- 氏名: ${staff.name || '未設定'}
- 職種: ${staff.position || '未設定'}
- 部門: ${staff.department || '未設定'}

【面談データ】
- 面談回数: ${stats.totalInterviews}回（${category}面談）
- スコア変化: ${stats.oldestScore} → ${stats.latestScore}
- 実施期間: ${stats.oldestDate} ～ ${stats.latestDate}

以下3つの観点で面談効果を分析してください:

1. 【面談スコア推移分析】
   - スコアの変化パターンと面談効果の相関
   - 介入が必要なタイミングの特定
   - 最も効果的だった面談内容の分析

2. 【回答品質・自己省察力】
   - 回答の詳細度と具体性の変化
   - 自己分析力の向上度
   - メンタルヘルス状態の変化

3. 【メンタリング効果測定】
   - 面談による行動変容の実現度
   - 目標設定と達成の整合性
   - 面談満足度と成長の相関

各分析で具体的な改善アクションプランを提案してください。`
  }

  // 面談効果AI分析実行（ローカルLLM統合準備済み）
  const performInterviewAnalysis = async () => {
    setIsAnalyzing(true)
    
    try {
      // 分析実行中の表示
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const stats = getBasicStats()
      const mockAnalysisData: InterviewAnalysisData = {
        scoreProgression: {
          title: '面談スコア推移分析',
          currentScore: 82,
          previousScore: 75,
          trendAnalysis: `${category}面談において${stats?.totalInterviews || 0}回の継続実施により、スコアが${75}点から${82}点に向上（+9.3%）。特に直近3回の面談で着実な上昇傾向を示しています。`,
          interventionTiming: 'スコア低下時の早期介入プロトコルが効果的に機能しており、今後も2週間以内のフォローアップを継続推奨。',
          strongestAreas: ['目標設定の明確化', '自己評価の客観性向上', '行動変容の継続性'],
          improvementAreas: ['ストレス管理スキル', '時間管理の最適化', '同僚との協調性'],
          actionPlans: [
            'ストレス管理研修への参加（1ヶ月以内）',
            '時間管理ツールの導入と習慣化（2週間）',
            '同僚とのペアワーク機会の増加（継続的）'
          ]
        },
        responseQuality: {
          title: '回答品質・自己省察力分析',
          qualityScore: 88,
          reflectionLevel: '高度な自己分析レベル',
          detailImprovement: '回答の詳細度が初回面談時の平均25語から現在85語まで向上（+240%）。具体的な事例や数値を含む回答が増加。',
          emotionalWellness: 'メンタルヘルス指標は安定推移。前向きな表現が80%以上を占め、心理的安全性が確保されている。',
          responseMaturity: [
            '問題分析→解決策提案の思考パターンが定着',
            '他者視点を含む多角的な回答が可能',
            '失敗経験からの学習抽出力が向上'
          ],
          concernAreas: [
            '完璧主義傾向による過度な自己批判',
            '新しいチャレンジに対する慎重すぎる姿勢'
          ],
          guidanceRecommendations: [
            'ポジティブフィードバックの重点実施',
            '小さな成功体験の積み重ね支援',
            'リスクテイキングを促進する環境整備'
          ]
        },
        mentorshipEffectiveness: {
          title: 'メンタリング効果測定',
          effectivenessScore: 91,
          behaviorChange: '面談後30日以内の行動変容実現率87%。設定した目標の78%が期限内に達成されている。',
          goalAlignment: '短期目標と中長期キャリアプランの整合性が高く、体系的な成長戦略が構築されている。',
          satisfactionLevel: '面談満足度4.6/5.0点。特に「話しやすさ」「具体的アドバイス」の評価が高い。',
          strengths: [
            '面談者との信頼関係構築力',
            'アクションプランの具体性と実現可能性',
            '継続的な成長マインドセット'
          ],
          improvementOpportunities: [
            '法人レベルでのキャリア展望',
            '他部門との連携機会創出',
            'メンター以外からのフィードバック取得'
          ],
          optimizationSuggestions: [
            '面談頻度を月1回→3週間間隔に最適化',
            '360度フィードバックの定期実施（6ヶ月毎）',
            '法人横断プロジェクト参画機会の提供',
            '外部研修・学会参加支援の拡充'
          ]
        }
      }
      
      setAnalysisData(mockAnalysisData)
    } catch (error) {
      console.error('Interview analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // 初回分析実行
  useEffect(() => {
    if (interviewData && interviewData.length > 0) {
      performInterviewAnalysis()
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
          <p className="text-center text-gray-500">面談データが不足しているため、面談効果分析を実行できません。</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="border-l-4 border-purple-500 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <span className="text-purple-600 text-xl">🤖</span>
          </div>
          <div>
            <h5 className="font-bold text-lg text-gray-800">AI面談効果分析アドバイス</h5>
            <p className="text-sm text-gray-600">3軸グラフ分析に基づく個別面談指導提案</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-2 py-1 bg-purple-200 text-purple-800 text-xs rounded-full font-medium">
            ローカルLLM対応予定
          </div>
          <Button
            onClick={performInterviewAnalysis}
            disabled={isAnalyzing}
            className="px-3 py-1 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? '解析中' : '解釈生成'}
          </Button>
        </div>
      </div>

      {isAnalyzing ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-purple-700">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="font-medium">面談データを多角的に分析中...</span>
          </div>
        </div>
      ) : analysisData ? (
        <div className="space-y-4">
          {/* 面談スコア推移分析 */}
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <h6 className="font-semibold text-blue-800">{analysisData.scoreProgression.title}</h6>
              <div className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium">
                {analysisData.scoreProgression.currentScore}点 ({((analysisData.scoreProgression.currentScore / analysisData.scoreProgression.previousScore - 1) * 100).toFixed(1)}%↗)
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded">
                <p className="font-medium text-green-800 mb-1">📈 スコア推移パターン</p>
                <p className="text-green-700">{analysisData.scoreProgression.trendAnalysis}</p>
              </div>
              <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                <p className="font-medium text-blue-800 mb-1">⏰ 介入タイミング最適化</p>
                <p className="text-blue-700">{analysisData.scoreProgression.interventionTiming}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-green-50 rounded">
                  <p className="font-medium text-green-800 mb-2">✨ 効果的な領域</p>
                  <ul className="space-y-1">
                    {analysisData.scoreProgression.strongestAreas.map((area, index) => (
                      <li key={index} className="flex items-start gap-2 text-green-700 text-xs">
                        <span className="text-green-500">•</span>
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 bg-yellow-50 rounded">
                  <p className="font-medium text-yellow-800 mb-2">🎯 重点改善領域</p>
                  <ul className="space-y-1">
                    {analysisData.scoreProgression.improvementAreas.map((area, index) => (
                      <li key={index} className="flex items-start gap-2 text-yellow-700 text-xs">
                        <span className="text-yellow-500">•</span>
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 回答品質・自己省察力分析 */}
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="h-5 w-5 text-green-600" />
              <h6 className="font-semibold text-green-800">{analysisData.responseQuality.title}</h6>
              <div className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">
                品質スコア {analysisData.responseQuality.qualityScore}点
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-indigo-50 border-l-4 border-indigo-400 rounded">
                <p className="font-medium text-indigo-800 mb-1">🧠 自己省察レベル</p>
                <p className="text-indigo-700 mb-2">{analysisData.responseQuality.reflectionLevel}</p>
                <p className="text-indigo-600 text-xs">{analysisData.responseQuality.detailImprovement}</p>
              </div>
              <div className="p-3 bg-purple-50 border-l-4 border-purple-400 rounded">
                <p className="font-medium text-purple-800 mb-1">💝 メンタルヘルス状態</p>
                <p className="text-purple-700">{analysisData.responseQuality.emotionalWellness}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 rounded">
                  <p className="font-medium text-blue-800 mb-2">🌟 回答成熟度向上</p>
                  <ul className="space-y-1">
                    {analysisData.responseQuality.responseMaturity.map((maturity, index) => (
                      <li key={index} className="flex items-start gap-2 text-blue-700 text-xs">
                        <span className="text-blue-500">•</span>
                        <span>{maturity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 bg-orange-50 rounded">
                  <p className="font-medium text-orange-800 mb-2">⚠️ 注意が必要な領域</p>
                  <ul className="space-y-1">
                    {analysisData.responseQuality.concernAreas.map((concern, index) => (
                      <li key={index} className="flex items-start gap-2 text-orange-700 text-xs">
                        <span className="text-orange-500">•</span>
                        <span>{concern}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* メンタリング効果測定 */}
          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-5 w-5 text-purple-600" />
              <h6 className="font-semibold text-purple-800">{analysisData.mentorshipEffectiveness.title}</h6>
              <div className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded font-medium">
                効果スコア {analysisData.mentorshipEffectiveness.effectivenessScore}点
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-cyan-50 border-l-4 border-cyan-400 rounded">
                <p className="font-medium text-cyan-800 mb-1">🎯 行動変容実現</p>
                <p className="text-cyan-700">{analysisData.mentorshipEffectiveness.behaviorChange}</p>
              </div>
              <div className="p-3 bg-teal-50 border-l-4 border-teal-400 rounded">
                <p className="font-medium text-teal-800 mb-1">🎪 目標整合性</p>
                <p className="text-teal-700 mb-2">{analysisData.mentorshipEffectiveness.goalAlignment}</p>
                <p className="text-teal-600 text-xs">{analysisData.mentorshipEffectiveness.satisfactionLevel}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-emerald-50 rounded">
                  <p className="font-medium text-emerald-800 mb-2">💪 メンタリング強み</p>
                  <ul className="space-y-1">
                    {analysisData.mentorshipEffectiveness.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2 text-emerald-700 text-xs">
                        <span className="text-emerald-500">•</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 bg-amber-50 rounded">
                  <p className="font-medium text-amber-800 mb-2">🚀 向上機会</p>
                  <ul className="space-y-1">
                    {analysisData.mentorshipEffectiveness.improvementOpportunities.map((opportunity, index) => (
                      <li key={index} className="flex items-start gap-2 text-amber-700 text-xs">
                        <span className="text-amber-500">•</span>
                        <span>{opportunity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 統合アクションプラン */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-indigo-600 text-lg">💡</span>
              <h6 className="font-semibold text-indigo-800">統合面談最適化アドバイス</h6>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-800 mb-2">📋 短期アクション（1-3ヶ月）</p>
                <ul className="space-y-1 text-gray-700">
                  {analysisData.scoreProgression.actionPlans.map((action, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-orange-500">•</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium text-gray-800 mb-2">🚀 中長期最適化（4-12ヶ月）</p>
                <ul className="space-y-1 text-gray-700">
                  {analysisData.mentorshipEffectiveness.optimizationSuggestions.slice(0, 3).map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-500">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-white/50 rounded border border-purple-200">
              <div className="flex items-center gap-2 mb-1">
                <Brain className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-purple-800 text-sm">AI総合アドバイス</span>
                <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700 border-purple-300">
                  Llama 3.2 分析
                </Badge>
              </div>
              <p className="text-sm text-purple-700 leading-relaxed">
                {staffInfo.name}さんの{category}面談は高い効果性を示しており、特にスコア推移と回答品質の両面で優秀な成果を達成。メンタリング満足度も高く、今後は面談頻度の最適化と法人レベルでの成長機会提供が推奨されます。
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-purple-600">
          <Brain className="h-8 w-8 mx-auto mb-2" />
          <p>面談効果分析を実行してください</p>
        </div>
      )}
    </div>
  )
}