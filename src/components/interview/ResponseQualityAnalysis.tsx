'use client'

import React, { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshCw, Brain, MessageSquare, TrendingUp } from 'lucide-react'

interface ResponseQualityAnalysisProps {
  staffId: string
  interviewData: any[]
  staffInfo: any
  category: 'regular' | 'special' | 'support'
}

interface ResponseQualityData {
  title: string
  qualityScore: number
  reflectionLevel: string
  detailImprovement: string
  emotionalWellness: string
  responseMaturity: string[]
  concernAreas: string[]
  guidanceRecommendations: string[]
  languageAnalysis: {
    vocabularyRichness: number
    emotionalTone: string
    clarityScore: number
  }
}

export default function ResponseQualityAnalysis({
  staffId,
  interviewData,
  staffInfo,
  category
}: ResponseQualityAnalysisProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisData, setAnalysisData] = useState<ResponseQualityData | null>(null)

  // 回答品質専用プロンプト生成
  const generateResponseAnalysisPrompt = (data: any[], staff: any) => {
    return `面談回答品質と自己省察力の詳細分析を実施してください。

【分析対象】
- 職員: ${staff.name || '未設定'}
- 面談種別: ${category}面談
- 回答データ: ${data.length}回分の面談記録

【分析要求】
面談回答パターンの質的変化に特化した分析:

1. 【回答品質進化分析】
   - 回答の詳細度・具体性の変化推移
   - 語彙の豊富さと表現力の向上
   - 論理構成力の発達度合い

2. 【自己省察力評価】
   - 自己分析の深度と客観性
   - 問題認識から解決策提案への思考発展
   - メタ認知能力の向上度

3. 【メンタルヘルス状態分析】
   - 回答から読み取れる心理状態変化
   - ストレス指標と回復力評価
   - 前向き表現と消極的表現の比率分析

回答品質向上のための個別指導方針を提案してください。`
  }

  // 回答品質AI分析実行
  const performResponseAnalysis = async () => {
    setIsAnalyzing(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3200))
      
      const mockAnalysisData: ResponseQualityData = {
        title: '回答品質・自己省察力分析',
        qualityScore: 88,
        reflectionLevel: '高度な自己分析レベル',
        detailImprovement: '回答の詳細度が初回面談時の平均25語から現在85語まで向上（+240%）。具体的な事例や数値を含む回答が増加し、抽象的表現から実践的な内容へと質的変化。',
        emotionalWellness: 'メンタルヘルス指標は安定推移。前向きな表現が83%を占め、ストレス関連の言及は15%減少。心理的安全性が確保され、自己開示レベルも向上。',
        responseMaturity: [
          '問題分析→解決策提案の思考パターンが定着',
          '他者視点を含む多角的な回答が可能',
          '失敗経験からの学習抽出力が向上',
          '将来志向の目標設定能力が発達'
        ],
        concernAreas: [
          '完璧主義傾向による過度な自己批判',
          '新しいチャレンジに対する慎重すぎる姿勢',
          'ネガティブフィードバックへの過敏反応'
        ],
        guidanceRecommendations: [
          'ポジティブフィードバックの重点実施',
          '小さな成功体験の積み重ね支援',
          'リスクテイキングを促進する環境整備',
          '自己受容力向上のためのマインドフルネス練習'
        ],
        languageAnalysis: {
          vocabularyRichness: 82,
          emotionalTone: '安定・前向き',
          clarityScore: 91
        }
      }
      
      setAnalysisData(mockAnalysisData)
    } catch (error) {
      console.error('Response analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  useEffect(() => {
    if (interviewData && interviewData.length > 0) {
      performResponseAnalysis()
    }
  }, [staffId, interviewData])

  if (!interviewData || interviewData.length === 0) {
    return null
  }

  return (
    <div className="border-l-4 border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <span className="text-green-600 text-xl">🤖</span>
          </div>
          <div>
            <h5 className="font-bold text-lg text-gray-800">AI回答品質分析</h5>
            <p className="text-sm text-gray-600">自己省察力向上と言語表現力発達評価</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded-full font-medium">
            ローカルLLM対応予定
          </div>
          <Button
            onClick={performResponseAnalysis}
            disabled={isAnalyzing}
            className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? '解析中' : '解釈生成'}
          </Button>
        </div>
      </div>

      {isAnalyzing ? (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3 text-green-700">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="font-medium">回答パターンを詳細分析中...</span>
          </div>
        </div>
      ) : analysisData ? (
        <div className="space-y-4">
          {/* メイン品質分析 */}
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="h-5 w-5 text-green-600" />
              <h6 className="font-semibold text-green-800">{analysisData.title}</h6>
              <div className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">
                品質スコア {analysisData.qualityScore}点
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-indigo-50 border-l-4 border-indigo-400 rounded">
                <p className="font-medium text-indigo-800 mb-1">🧠 自己省察レベル</p>
                <p className="text-indigo-700 mb-2">{analysisData.reflectionLevel}</p>
                <p className="text-indigo-600 text-xs">{analysisData.detailImprovement}</p>
              </div>
              <div className="p-3 bg-purple-50 border-l-4 border-purple-400 rounded">
                <p className="font-medium text-purple-800 mb-1">💝 メンタルヘルス状態</p>
                <p className="text-purple-700">{analysisData.emotionalWellness}</p>
              </div>
            </div>
          </div>

          {/* 言語分析指標 */}
          <div className="bg-white rounded-lg p-4 border border-cyan-200">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-cyan-600" />
              <h6 className="font-semibold text-cyan-800">言語分析指標</h6>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold mb-1 text-blue-600">
                  {analysisData.languageAnalysis.vocabularyRichness}点
                </div>
                <div className="text-xs text-blue-700">語彙豊富度</div>
              </div>
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <div className="text-lg font-bold mb-1 text-emerald-600">
                  {analysisData.languageAnalysis.emotionalTone}
                </div>
                <div className="text-xs text-emerald-700">感情トーン</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-xl font-bold mb-1 text-purple-600">
                  {analysisData.languageAnalysis.clarityScore}点
                </div>
                <div className="text-xs text-purple-700">明瞭性スコア</div>
              </div>
            </div>
          </div>

          {/* 成熟度と課題分析 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-blue-600 text-lg">🌟</span>
                <h6 className="font-semibold text-blue-800 text-sm">回答成熟度向上</h6>
              </div>
              <ul className="space-y-1">
                {analysisData.responseMaturity.map((maturity, index) => (
                  <li key={index} className="flex items-start gap-2 text-blue-700 text-xs">
                    <span className="text-blue-500">•</span>
                    <span>{maturity}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-orange-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-orange-600 text-lg">⚠️</span>
                <h6 className="font-semibold text-orange-800 text-sm">注意が必要な領域</h6>
              </div>
              <ul className="space-y-1">
                {analysisData.concernAreas.map((concern, index) => (
                  <li key={index} className="flex items-start gap-2 text-orange-700 text-xs">
                    <span className="text-orange-500">•</span>
                    <span>{concern}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 指導推奨事項 */}
          <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-lg p-4 border border-teal-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-teal-600 text-lg">💡</span>
              <h6 className="font-semibold text-teal-800">回答品質向上指導方針</h6>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {analysisData.guidanceRecommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-2 text-gray-700">
                  <span className="text-teal-500">•</span>
                  <span>{recommendation}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 bg-white/50 rounded border border-green-200">
              <div className="flex items-center gap-2 mb-1">
                <Brain className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800 text-sm">AI言語発達アドバイス</span>
                <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
                  Llama 3.2 分析
                </Badge>
              </div>
              <p className="text-sm text-green-700 leading-relaxed">
                {staffInfo.name}さんの回答品質は着実な向上を示し、自己省察力も高いレベルに到達。
                言語分析結果も良好で、今後は新たな挑戦への心理的障壁を下げる支援に重点を置くことで、
                さらなる成長が期待できます。
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-green-600">
          <Brain className="h-8 w-8 mx-auto mb-2" />
          <p>回答品質分析を実行してください</p>
        </div>
      )}
    </div>
  )
}