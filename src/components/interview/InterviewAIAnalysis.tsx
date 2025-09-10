'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'

interface InterviewAIAnalysisProps {
  interview: {
    date: string
    interviewer: string
    summary: string
    interviewId?: string
    reason?: string
    category?: string
  }
  interviewType: 'regular' | 'special' | 'support'
  staffName?: string
  isOpen: boolean
  onClose: () => void
}

// 感情トーン分析のためのキーワード
const emotionKeywords = {
  positive: ['成長', '順調', '積極的', '向上', '優秀', '達成', '意欲', '前向き', '改善', '習得'],
  negative: ['不安', '困難', '課題', '負担', '疲れ', 'ストレス', '悩み', '退職', '転職', '不満'],
  neutral: ['確認', '実施', '対応', '業務', '作業', '報告', '連絡', '相談', '予定', '計画']
}

// リスクフラグのキーワード
const riskKeywords = {
  turnover: ['退職', '転職', '辞め', '他の職場', 'やりがい', '将来性'],
  mental: ['疲れ', 'ストレス', '眠れない', 'プレッシャー', '不安', '心配'],
  performance: ['ミス', 'インシデント', '遅刻', '欠勤', '低下', '悪化'],
  relationship: ['人間関係', 'トラブル', '衝突', '孤立', 'いじめ', 'ハラスメント']
}

export default function InterviewAIAnalysis({
  interview,
  interviewType,
  staffName,
  isOpen,
  onClose
}: InterviewAIAnalysisProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)

  // 簡易的な感情分析
  const analyzeEmotion = (text: string): 'positive' | 'neutral' | 'concerning' => {
    const lowerText = text.toLowerCase()
    let positiveScore = 0
    let negativeScore = 0

    emotionKeywords.positive.forEach(keyword => {
      if (lowerText.includes(keyword)) positiveScore++
    })

    emotionKeywords.negative.forEach(keyword => {
      if (lowerText.includes(keyword)) negativeScore++
    })

    if (negativeScore > positiveScore) return 'concerning'
    if (positiveScore > negativeScore) return 'positive'
    return 'neutral'
  }

  // キーワード抽出
  const extractKeyTopics = (text: string): string[] => {
    const topics: string[] = []
    const allKeywords = [
      ...emotionKeywords.positive,
      ...emotionKeywords.negative,
      ...Object.values(riskKeywords).flat()
    ]

    allKeywords.forEach(keyword => {
      if (text.includes(keyword) && !topics.includes(keyword)) {
        topics.push(keyword)
      }
    })

    return topics.slice(0, 5) // 最大5個まで
  }

  // リスクフラグ検出
  const detectRiskFlags = (text: string): string[] => {
    const flags: string[] = []
    const lowerText = text.toLowerCase()

    Object.entries(riskKeywords).forEach(([risk, keywords]) => {
      keywords.forEach(keyword => {
        if (lowerText.includes(keyword)) {
          const riskLabel = {
            turnover: '離職リスク',
            mental: 'メンタルヘルス要注意',
            performance: 'パフォーマンス低下',
            relationship: '人間関係の課題'
          }[risk]
          if (riskLabel && !flags.includes(riskLabel)) {
            flags.push(riskLabel)
          }
        }
      })
    })

    return flags
  }

  // 推奨アクション生成
  const generateRecommendedActions = (emotionTone: string, riskFlags: string[]): string[] => {
    const actions: string[] = []

    if (emotionTone === 'concerning') {
      actions.push('2週間以内にフォローアップ面談を実施')
    }

    if (riskFlags.includes('離職リスク')) {
      actions.push('キャリア相談の機会を設定')
      actions.push('上司との個別面談を調整')
    }

    if (riskFlags.includes('メンタルヘルス要注意')) {
      actions.push('産業医面談の検討')
      actions.push('業務負荷の見直し')
    }

    if (actions.length === 0) {
      if (emotionTone === 'positive') {
        actions.push('成長機会の提供を検討')
        actions.push('次回面談は1ヶ月後に設定')
      } else {
        actions.push('定期的な声かけを継続')
        actions.push('次回面談は3週間後に設定')
      }
    }

    return actions
  }

  // AI分析を実行
  const generateAIAnalysis = () => {
    setIsGenerating(true)

    // 2秒後に分析結果を生成（ローカルLLM呼び出しのシミュレーション）
    setTimeout(() => {
      const emotionTone = analyzeEmotion(interview.summary)
      const keyTopics = extractKeyTopics(interview.summary)
      const riskFlags = detectRiskFlags(interview.summary)
      const recommendedActions = generateRecommendedActions(emotionTone, riskFlags)

      setAiAnalysis({
        emotionTone,
        keyTopics,
        riskFlags,
        recommendedActions,
        detailedAnalysis: generateDetailedAnalysis(emotionTone, keyTopics, riskFlags, interview)
      })
      setIsGenerating(false)
    }, 2000)
  }

  // 詳細な分析コメント生成
  const generateDetailedAnalysis = (
    emotionTone: string,
    keyTopics: string[],
    riskFlags: string[],
    interviewData: any
  ) => {
    const typeLabel = {
      regular: '定期面談',
      special: '特別面談',
      support: 'サポート面談'
    }[interviewType]

    return {
      summary: `${interviewData.date}に実施された${typeLabel}の分析結果です。`,
      emotionAnalysis: getEmotionAnalysisText(emotionTone),
      topicAnalysis: keyTopics.length > 0 
        ? `主要なトピック: ${keyTopics.join('、')}が確認されました。`
        : '特定の重要トピックは検出されませんでした。',
      riskAnalysis: riskFlags.length > 0
        ? `要注意事項: ${riskFlags.join('、')}が検出されました。早急な対応が必要です。`
        : 'リスク要因は検出されませんでした。',
      nextSteps: recommendedActions.length > 0
        ? `推奨事項: ${recommendedActions.join('、')}`
        : '現状維持で問題ありません。'
    }
  }

  const getEmotionAnalysisText = (tone: string) => {
    switch (tone) {
      case 'positive':
        return '職員の状態は良好で、前向きな姿勢が確認されました。'
      case 'concerning':
        return '注意が必要な兆候が見られます。フォローアップを推奨します。'
      default:
        return '特に目立った感情的な変化は見られませんでした。'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          {/* ヘッダー */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <span className="text-purple-600 text-xl">🤖</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    AI面談分析
                  </h3>
                  <p className="text-sm text-gray-600">
                    {staffName ? `${staffName}さんの` : ''}面談内容をAIが分析
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-2 py-1 bg-purple-200 text-purple-800 text-xs rounded-full font-medium">
                  ローカルLLM対応予定
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          {/* コンテンツ */}
          <div className="px-6 py-4">
            {/* 面談情報 */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">面談日: {interview.date}</span>
                <span className="text-gray-600">面談者: {interview.interviewer}</span>
              </div>
              <div className="mt-2 text-sm text-gray-700">
                {interview.summary}
              </div>
            </div>

            {/* AI分析結果 */}
            {!aiAnalysis && !isGenerating && (
              <div className="text-center py-8">
                <button
                  onClick={generateAIAnalysis}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  AI分析を開始
                </button>
              </div>
            )}

            {isGenerating && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <p className="mt-4 text-gray-600">AI分析中...</p>
              </div>
            )}

            {aiAnalysis && (
              <div className="space-y-4">
                {/* 感情トーン */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">
                        {aiAnalysis.emotionTone === 'positive' ? '😊' : 
                         aiAnalysis.emotionTone === 'concerning' ? '😟' : '😐'}
                      </span>
                      <h4 className="font-semibold">感情状態分析</h4>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        aiAnalysis.emotionTone === 'positive' ? 'bg-green-100 text-green-700' :
                        aiAnalysis.emotionTone === 'concerning' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {aiAnalysis.emotionTone === 'positive' ? 'ポジティブ' :
                         aiAnalysis.emotionTone === 'concerning' ? '要注意' : 'ニュートラル'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">
                      {aiAnalysis.detailedAnalysis.emotionAnalysis}
                    </p>
                  </CardContent>
                </Card>

                {/* キーワード */}
                {aiAnalysis.keyTopics.length > 0 && (
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">🔍</span>
                        <h4 className="font-semibold">重要キーワード</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {aiAnalysis.keyTopics.map((topic: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* リスクフラグ */}
                {aiAnalysis.riskFlags.length > 0 && (
                  <Card className="border-orange-200 bg-orange-50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">⚠️</span>
                        <h4 className="font-semibold text-orange-800">要注意事項</h4>
                      </div>
                      <ul className="space-y-1">
                        {aiAnalysis.riskFlags.map((flag: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-orange-700">
                            <span>•</span>
                            <span>{flag}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* 推奨アクション */}
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">✅</span>
                      <h4 className="font-semibold text-green-800">推奨アクション</h4>
                    </div>
                    <ul className="space-y-2">
                      {aiAnalysis.recommendedActions.map((action: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-green-700">
                          <span className="text-green-500">→</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* 総合コメント */}
                <Card className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">💡</span>
                      <h4 className="font-semibold text-indigo-800">総合分析</h4>
                    </div>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>{aiAnalysis.detailedAnalysis.summary}</p>
                      <p>{aiAnalysis.detailedAnalysis.topicAnalysis}</p>
                      <p className={aiAnalysis.riskFlags.length > 0 ? 'text-orange-700 font-medium' : ''}>
                        {aiAnalysis.detailedAnalysis.riskAnalysis}
                      </p>
                      <p className="font-medium text-indigo-700">
                        {aiAnalysis.detailedAnalysis.nextSteps}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* フッター */}
          <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
            <p className="text-xs text-gray-500">
              ※ この分析は面談記録のテキストから自動生成されています
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}