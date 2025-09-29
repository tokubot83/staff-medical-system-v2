'use client'

import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'

interface InterviewAIAnalysisDemoProps {
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

// デモ用のサンプルデータセット
const demoAnalysisResults = [
  {
    emotionTone: 'positive',
    keyTopics: ['チームワーク向上', 'スキル習得', '患者満足度向上', 'リーダーシップ', '新システム適応'],
    riskFlags: [],
    recommendedActions: [
      'リーダー育成プログラムへの参加を検討',
      '専門スキル研修の機会を提供',
      '次期プロジェクトリーダーとして推薦',
      '次回面談は1ヶ月後に設定'
    ],
    detailedAnalysis: {
      summary: '本日の面談では職員の前向きな姿勢と成長意欲が確認されました。',
      emotionAnalysis: '職員の状態は非常に良好で、高いモチベーションと職務への積極的な取り組みが確認されました。特にチーム内での協調性と患者様への配慮が高く評価されています。',
      topicAnalysis: '主要なトピック: チームワーク向上、スキル習得、患者満足度向上、リーダーシップ、新システム適応が確認されました。特に最近導入された電子カルテシステムへの適応が早く、他のスタッフへのサポートも行っています。',
      riskAnalysis: 'リスク要因は検出されませんでした。むしろ、組織への貢献度が高く、他職員への良い影響を与えています。',
      nextSteps: '推奨事項: リーダー育成プログラムへの参加を検討、専門スキル研修の機会を提供、次期プロジェクトリーダーとして推薦、次回面談は1ヶ月後に設定'
    }
  },
  {
    emotionTone: 'neutral',
    keyTopics: ['業務遂行', '標準的パフォーマンス', 'コミュニケーション', '時間管理', '研修参加'],
    riskFlags: [],
    recommendedActions: [
      '業務効率化のサポートを提供',
      'コミュニケーションスキル研修への参加',
      '定期的な1on1面談の継続',
      '次回面談は3週間後に設定'
    ],
    detailedAnalysis: {
      summary: '定期面談を実施し、現状の業務状況と今後の目標について確認しました。',
      emotionAnalysis: '職員の精神状態は安定しており、業務に対して標準的な取り組みが見られます。大きな問題はありませんが、さらなる成長の余地があります。',
      topicAnalysis: '主要なトピック: 業務遂行、標準的パフォーマンス、コミュニケーション、時間管理、研修参加が確認されました。日常業務は適切に遂行していますが、より積極的な改善提案が期待されます。',
      riskAnalysis: '現時点でリスク要因は検出されませんでした。安定した勤務状況を維持しています。',
      nextSteps: '推奨事項: 業務効率化のサポートを提供、コミュニケーションスキル研修への参加、定期的な1on1面談の継続、次回面談は3週間後に設定'
    }
  },
  {
    emotionTone: 'concerning',
    keyTopics: ['業務負荷', 'ストレス', '人間関係', '体調管理', 'ワークライフバランス'],
    riskFlags: ['メンタルヘルス要注意', 'パフォーマンス低下'],
    recommendedActions: [
      '産業医面談の早急な調整',
      '業務量の見直しと調整',
      '休暇取得の推奨',
      'ストレスマネジメント研修への参加',
      '上司との個別面談を週1回実施',
      '2週間以内にフォローアップ面談を実施'
    ],
    detailedAnalysis: {
      summary: '面談により、職員が高い業務ストレスを抱えていることが判明しました。早急な対応が必要です。',
      emotionAnalysis: '職員の精神状態に懸念が見られます。業務負荷によるストレスが高く、疲労の蓄積が確認されました。早急なサポートが必要な状況です。',
      topicAnalysis: '主要なトピック: 業務負荷、ストレス、人間関係、体調管理、ワークライフバランスが確認されました。特に最近の人員不足による業務過多が大きな要因となっています。',
      riskAnalysis: '要注意事項: メンタルヘルス要注意、パフォーマンス低下が検出されました。バーンアウトのリスクがあるため、早急な対応が必要です。',
      nextSteps: '推奨事項: 産業医面談の早急な調整、業務量の見直しと調整、休暇取得の推奨、ストレスマネジメント研修への参加、上司との個別面談を週1回実施、2週間以内にフォローアップ面談を実施'
    }
  }
]

export default function InterviewAIAnalysisDemo({
  interview,
  interviewType,
  staffName,
  isOpen,
  onClose
}: InterviewAIAnalysisDemoProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)
  const [demoIndex] = useState(() => Math.floor(Math.random() * demoAnalysisResults.length))

  // デモ用AI分析を実行
  const generateDemoAnalysis = () => {
    setIsGenerating(true)

    // 3秒後にランダムな分析結果を表示
    setTimeout(() => {
      setAiAnalysis(demoAnalysisResults[demoIndex])
      setIsGenerating(false)
    }, 3000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* ヘッダー */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <span className="text-purple-600 text-xl">🤖</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    AI面談分析（デモモード）
                  </h3>
                  <p className="text-sm text-gray-600">
                    {staffName ? `${staffName}さんの` : ''}面談内容をAIが分析
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded-full font-medium animate-pulse">
                  デモンストレーション
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
          <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
            {/* 面談情報 */}
            <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-700 font-medium">
                  📅 面談日: {interview.date}
                </span>
                <span className="text-gray-700 font-medium">
                  👤 面談者: {interview.interviewer}
                </span>
              </div>
              <div className="text-sm text-gray-700 leading-relaxed">
                {interview.summary}
              </div>
            </div>

            {/* AI分析結果 */}
            {!aiAnalysis && !isGenerating && (
              <div className="text-center py-12">
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-4">
                    <span className="text-4xl">🔬</span>
                  </div>
                  <p className="text-gray-600 mb-6">
                    AIが面談記録を詳細に分析し、<br/>
                    感情状態・リスク要因・推奨アクションを提案します
                  </p>
                </div>
                <button
                  onClick={generateDemoAnalysis}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105 font-medium text-lg shadow-lg"
                >
                  🚀 AI分析を開始
                </button>
              </div>
            )}

            {isGenerating && (
              <div className="text-center py-12">
                <div className="relative inline-block">
                  <div className="w-20 h-20 border-4 border-purple-200 rounded-full"></div>
                  <div className="w-20 h-20 border-4 border-purple-600 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
                </div>
                <p className="mt-6 text-gray-600 font-medium">AI分析中...</p>
                <div className="mt-4 flex justify-center gap-2">
                  <span className="inline-block w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="inline-block w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="inline-block w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}

            {aiAnalysis && (
              <div className="space-y-4 animate-fadeIn">
                {/* 感情トーン */}
                <Card className="border-2 hover:shadow-lg transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">
                        {aiAnalysis.emotionTone === 'positive' ? '😊' :
                         aiAnalysis.emotionTone === 'concerning' ? '😟' : '😐'}
                      </span>
                      <h4 className="font-bold text-lg">感情状態分析</h4>
                      <span className={`px-3 py-1 text-sm rounded-full font-bold ${
                        aiAnalysis.emotionTone === 'positive' ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700' :
                        aiAnalysis.emotionTone === 'concerning' ? 'bg-gradient-to-r from-red-100 to-orange-100 text-red-700' :
                        'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700'
                      }`}>
                        {aiAnalysis.emotionTone === 'positive' ? '✨ ポジティブ' :
                         aiAnalysis.emotionTone === 'concerning' ? '⚠️ 要注意' : '◯ ニュートラル'}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {aiAnalysis.detailedAnalysis.emotionAnalysis}
                    </p>
                  </CardContent>
                </Card>

                {/* キーワード */}
                {aiAnalysis.keyTopics.length > 0 && (
                  <Card className="border-2 hover:shadow-lg transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">🔍</span>
                        <h4 className="font-bold text-lg">重要キーワード分析</h4>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {aiAnalysis.keyTopics.map((topic: string, index: number) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-300 text-blue-700 rounded-full text-sm font-medium hover:from-blue-100 hover:to-indigo-100 transition-colors"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mt-3">
                        {aiAnalysis.detailedAnalysis.topicAnalysis}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* リスクフラグ */}
                {aiAnalysis.riskFlags.length > 0 && (
                  <Card className="border-2 border-orange-300 bg-gradient-to-r from-orange-50 to-red-50 hover:shadow-lg transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl animate-pulse">⚠️</span>
                        <h4 className="font-bold text-lg text-orange-800">要注意事項</h4>
                      </div>
                      <ul className="space-y-2 mb-3">
                        {aiAnalysis.riskFlags.map((flag: string, index: number) => (
                          <li key={index} className="flex items-center gap-3 text-orange-700 font-medium">
                            <span className="text-orange-500">⚡</span>
                            <span>{flag}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="text-sm text-orange-700 font-medium">
                        {aiAnalysis.detailedAnalysis.riskAnalysis}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* 推奨アクション */}
                <Card className="border-2 border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 hover:shadow-lg transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">✅</span>
                      <h4 className="font-bold text-lg text-green-800">推奨アクション</h4>
                    </div>
                    <ul className="space-y-3">
                      {aiAnalysis.recommendedActions.map((action: string, index: number) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="text-green-500 font-bold mt-0.5">→</span>
                          <span className="text-green-700">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* 総合コメント */}
                <Card className="border-2 bg-gradient-to-r from-indigo-50 to-purple-50 hover:shadow-lg transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">💡</span>
                      <h4 className="font-bold text-lg text-indigo-800">総合分析レポート</h4>
                    </div>
                    <div className="space-y-3 text-gray-700">
                      <p className="font-medium">📋 {aiAnalysis.detailedAnalysis.summary}</p>
                      <div className="pl-4 border-l-4 border-indigo-300">
                        <p className="mb-2">{aiAnalysis.detailedAnalysis.topicAnalysis}</p>
                        <p className={`mb-2 ${aiAnalysis.riskFlags.length > 0 ? 'text-orange-700 font-bold' : ''}`}>
                          {aiAnalysis.detailedAnalysis.riskAnalysis}
                        </p>
                        <p className="font-bold text-indigo-700">
                          {aiAnalysis.detailedAnalysis.nextSteps}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* フッター */}
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-6 py-4 border-t flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500">
                ※ このデモは実際のローカルLLM実装後の動作イメージです
              </p>
              <p className="text-xs text-green-600 font-medium">
                🔒 データは完全にローカル処理され、外部送信されません
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-md hover:from-gray-700 hover:to-gray-800 transition-all font-medium shadow"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}