'use client'

import React, { useState } from 'react'

interface FeedbackSummaryDemoProps {
  isOpen: boolean
  onClose: () => void
  interview: any
  staffName?: string
}

// デモ用のサンプルフィードバックデータ
const sampleFeedbackData = [
  {
    summary: '本日の面談では、田中さんの最近の業務パフォーマンスと今後のキャリアパスについて詳細に話し合いました。特に新人教育への貢献度が高く評価されており、来期のリーダー職への昇進を視野に入れた育成プランを確認しました。',
    topics: '1. 新人教育プログラムでの優れた指導力について\n2. チーム内コミュニケーションの改善への貢献\n3. 患者満足度向上への取り組みと成果\n4. 来期のリーダー職昇進に向けた準備\n5. 専門スキル向上のための研修参加計画',
    agreements: '• 来期4月からチームリーダー候補として育成開始\n• 月1回の1on1面談を継続実施\n• リーダーシップ研修（2月開催）への参加決定\n• 新人教育マニュアルの改訂プロジェクトのリード担当\n• 3月末までに現在の業務引き継ぎ計画を作成',
    followup: '• 次回面談: 2月15日（金）14:00-15:00\n• リーダーシップ研修後の振り返り面談を実施\n• メンター制度を活用した継続的なサポート\n• 月次での進捗確認と必要に応じたサポート調整\n• 昇進審査に向けた準備状況の確認（3月）',
    message: '田中さんの日々の努力と成長を高く評価しています。新人教育での献身的な取り組みは、チーム全体に良い影響を与えており、多くのスタッフから信頼を得ています。来期のリーダー職への挑戦を全力でサポートしますので、自信を持って前進してください。何か困ったことがあれば、いつでも相談してください。'
  },
  {
    summary: '定期面談において、職員の現状確認と業務改善に向けた話し合いを実施しました。最近の業務負荷について懸念事項があり、適切なワークライフバランスの確保に向けた具体的な対策を検討しました。',
    topics: '1. 現在の業務負荷と時間外勤務の状況\n2. チーム内での役割分担の見直し\n3. ストレス管理とセルフケアの重要性\n4. 業務効率化のための改善提案\n5. 休暇取得の促進と計画的な休息',
    agreements: '• 業務量の調整と優先順位の明確化\n• 週2回のノー残業デーの設定\n• 業務効率化ツールの導入検討\n• 有給休暇の計画的取得（月1日以上）\n• ストレスチェックの実施と産業医相談の活用',
    followup: '• 2週間後に業務量の改善状況を確認\n• 産業医との面談を今月中に設定\n• チームミーティングで業務分担を再調整\n• 月末に改善効果を評価\n• 必要に応じて追加サポートを検討',
    message: '健康は何よりも大切です。無理をせず、適切なペースで業務に取り組んでください。チーム全体でサポートする体制を整えていきますので、一人で抱え込まないでください。あなたの健康と幸せが、良い仕事につながります。'
  },
  {
    summary: '半期評価面談を実施し、目標達成状況と今後の成長計画について建設的な議論を行いました。全体的に良好なパフォーマンスを維持しており、更なるスキルアップに向けた具体的な行動計画を策定しました。',
    topics: '1. 半期目標の達成状況レビュー（達成率85%）\n2. 強みとなるスキルの更なる向上策\n3. 改善が必要な領域の特定と対策\n4. 次期の目標設定と期待値の共有\n5. キャリア開発に向けた中長期計画',
    agreements: '• 下半期の重点目標を3つに絞り込み\n• 専門資格取得に向けた学習支援\n• メンタリング制度への参加承認\n• プロジェクトリーダーとしての機会提供\n• 360度フィードバックの実施（3月）',
    followup: '• 月次での進捗確認ミーティング\n• 資格試験対策の学習サポート\n• メンターとのマッチング（来月）\n• 四半期ごとの目標見直し\n• 年度末評価に向けた準備開始',
    message: '半期の成果を素晴らしいと思います。特に困難な状況でも前向きに取り組む姿勢は、周囲にも良い影響を与えています。下半期も一緒に目標達成に向けて頑張りましょう。あなたの成長を楽しみにしています。'
  }
]

export default function FeedbackSummaryDemo({
  isOpen,
  onClose,
  interview,
  staffName = '田中美咲'
}: FeedbackSummaryDemoProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedData, setGeneratedData] = useState<any>(null)
  const [editedData, setEditedData] = useState({
    summary: '',
    topics: '',
    agreements: '',
    followup: '',
    message: ''
  })

  const handleAIGenerate = () => {
    setIsGenerating(true)

    // 3秒後にランダムなサンプルデータを生成
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * sampleFeedbackData.length)
      const selectedData = sampleFeedbackData[randomIndex]
      setGeneratedData(selectedData)
      setEditedData(selectedData)
      setIsGenerating(false)
    }, 3000)
  }

  const handleFieldChange = (field: string, value: string) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = () => {
    alert('デモモード: フィードバックサマリが保存されました（実際には保存されません）')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center" style={{ zIndex: 999999 }}>
      <div className="bg-white rounded-xl shadow-2xl w-[900px] max-w-[95vw] max-h-[90vh] overflow-hidden">
        {/* ヘッダー */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                <span className="text-2xl">📄</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">面談フィードバックサマリ作成（デモモード）</h3>
                <p className="text-emerald-100 text-sm opacity-90">
                  職員: {staffName} | 面談日: {interview?.date || '2024/02/15'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* コンテンツ */}
        <div className="flex h-[70vh]">
          {/* 左側: 参考情報 */}
          <div className="w-1/3 bg-gray-50 border-r p-4 overflow-y-auto">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              📚 参考情報
            </h4>

            <div className="mb-4 p-3 bg-white rounded-lg border">
              <h5 className="font-medium text-gray-700 mb-2">🎙️ 音声解説 (NotebookLM)</h5>
              <p className="text-sm text-gray-600">
                面談の録音からAI生成された音声解説を確認してください。
              </p>
              <button className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200 transition-colors">
                音声解説を聞く
              </button>
            </div>

            <div className="mb-4 p-3 bg-white rounded-lg border">
              <h5 className="font-medium text-gray-700 mb-2">📋 面談シート</h5>
              <p className="text-sm text-gray-600">
                面談者: {interview?.interviewer || '高橋 部長'}<br />
                面談種別: {interview?.category || '定期面談'}
              </p>
              <button className="mt-2 px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded hover:bg-purple-200 transition-colors">
                シート詳細
              </button>
            </div>

            <div className="mb-4 p-3 bg-white rounded-lg border">
              <h5 className="font-medium text-gray-700 mb-2">🤖 AI分析</h5>
              <p className="text-sm text-gray-600">
                面談内容のAI分析結果を参考にサマリを作成できます。
              </p>
              <button className="mt-2 px-3 py-1 bg-indigo-100 text-indigo-700 text-xs rounded hover:bg-indigo-200 transition-colors">
                分析結果確認
              </button>
            </div>

            {generatedData && (
              <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-300">
                <h5 className="font-medium text-green-700 mb-2">✨ AI生成完了</h5>
                <p className="text-sm text-green-600">
                  フィードバックサマリが自動生成されました。必要に応じて編集してください。
                </p>
              </div>
            )}
          </div>

          {/* 右側: フィードバックサマリ編集 */}
          <div className="w-2/3 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                ✏️ フィードバックサマリ編集
              </h4>
              <div className="flex items-center gap-2">
                <div className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded-full font-medium animate-pulse">
                  デモモード
                </div>
                <button
                  onClick={handleAIGenerate}
                  disabled={isGenerating}
                  className={`px-3 py-1 text-white text-sm rounded-md transition-all ${
                    isGenerating
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 transform hover:scale-105'
                  }`}
                >
                  {isGenerating ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-white"></span>
                      生成中...
                    </span>
                  ) : (
                    '🤖 AI仮生成'
                  )}
                </button>
              </div>
            </div>

            {isGenerating && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-20 h-20 border-4 border-emerald-200 rounded-full"></div>
                    <div className="w-20 h-20 border-4 border-emerald-600 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
                  </div>
                  <p className="mt-6 text-gray-600 font-medium">AIがフィードバックを生成中...</p>
                  <div className="mt-4 flex justify-center gap-2">
                    <span className="inline-block w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="inline-block w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="inline-block w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}

            {!isGenerating && (
              <div className="space-y-4">
                <div className="bg-white border rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📋 面談概要
                  </label>
                  <textarea
                    value={editedData.summary}
                    onChange={(e) => handleFieldChange('summary', e.target.value)}
                    className="w-full h-20 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                    placeholder="面談の主要なポイント..."
                  />
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    💬 主な議題
                  </label>
                  <textarea
                    value={editedData.topics}
                    onChange={(e) => handleFieldChange('topics', e.target.value)}
                    className="w-full h-24 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                    placeholder="議論された具体的な内容..."
                  />
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ✅ 合意事項
                  </label>
                  <textarea
                    value={editedData.agreements}
                    onChange={(e) => handleFieldChange('agreements', e.target.value)}
                    className="w-full h-24 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                    placeholder="決定事項や今後の方針..."
                  />
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🔄 フォローアップ
                  </label>
                  <textarea
                    value={editedData.followup}
                    onChange={(e) => handleFieldChange('followup', e.target.value)}
                    className="w-full h-24 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                    placeholder="継続サポートや次回予定..."
                  />
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    💌 職員へのメッセージ
                  </label>
                  <textarea
                    value={editedData.message}
                    onChange={(e) => handleFieldChange('message', e.target.value)}
                    className="w-full h-24 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                    placeholder="励ましやアドバイス..."
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* フッター */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" defaultChecked />
                <span className="text-sm text-gray-700">VoiceDriveに通知して職員が閲覧できるようにする</span>
              </label>
              <span className="text-xs text-green-600 font-medium">
                ※ デモモードのため実際には送信されません
              </span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleSave}
                disabled={!generatedData}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下書き保存
              </button>
              <button
                onClick={handleSave}
                disabled={!generatedData}
                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                保存 & 職員通知
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}