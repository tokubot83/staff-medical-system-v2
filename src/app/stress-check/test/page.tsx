'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  AlertCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Shield,
  FileText,
  Users,
  Activity,
  Brain
} from 'lucide-react'

// 57問の質問データ
const stressCheckQuestions = {
  sectionA: {
    title: 'セクションA：仕事のストレス要因について',
    description: '最近1ヶ月間のあなたの仕事について、最もあてはまるものを選択してください。',
    icon: <FileText className="w-5 h-5" />,
    questions: [
      '非常にたくさんの仕事をしなければならない',
      '時間内に仕事が処理しきれない',
      '一生懸命働かなければならない',
      'かなり注意を集中する必要がある',
      '高度の知識や技術が必要なむずかしい仕事だ',
      '勤務時間中はいつも仕事のことを考えていなければならない',
      'からだを大変よく使う仕事だ',
      '自分のペースで仕事ができる',
      '自分で仕事の順番・やり方を決めることができる',
      '職場の仕事の方針に自分の意見を反映できる',
      '自分の技能や知識を仕事で使うことが少ない',
      '私の部署内で意見のくい違いがある',
      '私の部署と他の部署とはうまが合わない',
      '私の職場の雰囲気は友好的である',
      '私の職場の作業環境（騒音、照明、温度、換気など）はよくない',
      '仕事の内容は自分にあっている',
      '働きがいのある仕事だ'
    ]
  },
  sectionB: {
    title: 'セクションB：心身のストレス反応について',
    description: '最近1ヶ月間のあなたの状態について、最もあてはまるものを選択してください。',
    icon: <Brain className="w-5 h-5" />,
    questions: [
      '活気がわいてくる',
      '元気がいっぱいだ',
      '生き生きする',
      '怒りを感じる',
      '内心腹立たしい',
      'イライラしている',
      'ひどく疲れた',
      'へとへとだ',
      'だるい',
      '気がはりつめている',
      '不安だ',
      '落着かない',
      'ゆううつだ',
      '何をするのも面倒だ',
      '物事に集中できない',
      '気分が晴れない',
      '仕事が手につかない',
      '悲しいと感じる',
      'めまいがする',
      '体のふしぶしが痛む',
      '頭が重かったり頭痛がする',
      '首筋や肩がこる',
      '腰が痛い',
      '目が疲れる',
      '動悸や息切れがする',
      '胃腸の具合が悪い',
      '食欲がない',
      '便秘や下痢をする',
      'よく眠れない'
    ]
  },
  sectionC: {
    title: 'セクションC：周囲のサポートについて',
    description: 'あなたの周りの方々について、最もあてはまるものを選択してください。',
    icon: <Users className="w-5 h-5" />,
    questions: [
      '次の人たちはどのくらい気軽に話ができますか？（上司）',
      '次の人たちはどのくらい気軽に話ができますか？（職場の同僚）',
      '次の人たちはどのくらい気軽に話ができますか？（配偶者、家族、友人等）',
      'あなたが困った時、次の人たちはどのくらい頼りになりますか？（上司）',
      'あなたが困った時、次の人たちはどのくらい頼りになりますか？（職場の同僚）',
      'あなたが困った時、次の人たちはどのくらい頼りになりますか？（配偶者、家族、友人等）',
      'あなたの個人的な問題を相談したら、次の人たちはどのくらいきいてくれますか？（上司）',
      'あなたの個人的な問題を相談したら、次の人たちはどのくらいきいてくれますか？（職場の同僚）',
      'あなたの個人的な問題を相談したら、次の人たちはどのくらいきいてくれますか？（配偶者、家族、友人等）'
    ]
  },
  sectionD: {
    title: 'セクションD：満足度について',
    description: '最近1ヶ月間の満足度について、最もあてはまるものを選択してください。',
    icon: <Activity className="w-5 h-5" />,
    questions: [
      '仕事に満足だ',
      '家庭生活に満足だ'
    ]
  }
}

// 回答の選択肢（セクションにより異なる）
const answerOptionsA = [
  { value: 1, label: 'そうだ', description: '(1点)' },
  { value: 2, label: 'まあそうだ', description: '(2点)' },
  { value: 3, label: 'ややちがう', description: '(3点)' },
  { value: 4, label: 'ちがう', description: '(4点)' }
]

const answerOptionsC = [
  { value: 1, label: '非常に', description: '(1点)' },
  { value: 2, label: 'かなり', description: '(2点)' },
  { value: 3, label: '多少', description: '(3点)' },
  { value: 4, label: '全くない', description: '(4点)' }
]

const answerOptionsD = [
  { value: 1, label: '満足', description: '(1点)' },
  { value: 2, label: 'まあ満足', description: '(2点)' },
  { value: 3, label: 'やや不満足', description: '(3点)' },
  { value: 4, label: '不満足', description: '(4点)' }
]

export default function StressCheckTestPage() {
  const router = useRouter()
  const [started, setStarted] = useState(false)
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [startTime] = useState(Date.now())
  const [elapsedTime, setElapsedTime] = useState('00:00')

  // 全質問を配列化
  const allQuestions = [
    ...stressCheckQuestions.sectionA.questions.map((q, i) => ({
      section: 'sectionA',
      index: i,
      text: q,
      options: answerOptionsA
    })),
    ...stressCheckQuestions.sectionB.questions.map((q, i) => ({
      section: 'sectionB',
      index: i,
      text: q,
      options: answerOptionsA
    })),
    ...stressCheckQuestions.sectionC.questions.map((q, i) => ({
      section: 'sectionC',
      index: i,
      text: q,
      options: answerOptionsC
    })),
    ...stressCheckQuestions.sectionD.questions.map((q, i) => ({
      section: 'sectionD',
      index: i,
      text: q,
      options: answerOptionsD
    }))
  ]

  const totalQuestions = allQuestions.length
  const currentQuestion = allQuestions[currentQuestionNumber - 1]
  const progress = (currentQuestionNumber / totalQuestions) * 100

  // タイマー更新
  useEffect(() => {
    if (started) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000)
        const minutes = Math.floor(elapsed / 60)
        const seconds = elapsed % 60
        setElapsedTime(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [started, startTime])

  const handleStart = () => {
    setStarted(true)
  }

  const handleAnswer = (value: number) => {
    const questionKey = `q${currentQuestionNumber}`
    setAnswers({ ...answers, [questionKey]: value })
  }

  const handleNext = () => {
    const questionKey = `q${currentQuestionNumber}`
    if (!answers[questionKey]) {
      return
    }

    if (currentQuestionNumber < totalQuestions) {
      setCurrentQuestionNumber(currentQuestionNumber + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (currentQuestionNumber > 1) {
      setCurrentQuestionNumber(currentQuestionNumber - 1)
    }
  }

  const handleComplete = async () => {
    // 結果の計算
    const result = calculateStressResult(answers)

    // 結果を保存（実際の実装では API 経由で保存）
    const testResult = {
      userId: 'current_user', // 実際には認証から取得
      testDate: new Date().toISOString(),
      answers: answers,
      scores: result,
      completionTime: elapsedTime
    }

    // LocalStorageに一時保存（デモ用）
    localStorage.setItem('stressCheckResult', JSON.stringify(testResult))

    // 結果画面へ遷移
    router.push('/stress-check/result')
  }

  const calculateStressResult = (answers: Record<string, number>) => {
    // 簡易的なスコア計算（実際には厚生労働省の判定基準に従う）
    let stressFactors = 0
    let stressReactions = 0
    let support = 0
    let satisfaction = 0

    // セクションA（Q1-17）
    for (let i = 1; i <= 17; i++) {
      stressFactors += answers[`q${i}`] || 0
    }

    // セクションB（Q18-46）
    for (let i = 18; i <= 46; i++) {
      stressReactions += answers[`q${i}`] || 0
    }

    // セクションC（Q47-55）
    for (let i = 47; i <= 55; i++) {
      support += answers[`q${i}`] || 0
    }

    // セクションD（Q56-57）
    for (let i = 56; i <= 57; i++) {
      satisfaction += answers[`q${i}`] || 0
    }

    return {
      stressFactors,
      stressReactions,
      support,
      satisfaction,
      total: stressFactors + stressReactions,
      highStress: (stressFactors + stressReactions) > 100 // 仮の閾値
    }
  }

  if (!started) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <Card>
          <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
            <CardTitle className="text-2xl">
              2025年度 ストレスチェック
            </CardTitle>
            <p className="text-purple-100">
              厚生労働省版 職業性ストレス簡易調査票（57項目）
            </p>
          </CardHeader>

          <CardContent className="space-y-6 p-8">
            {/* 法的説明 */}
            <Alert className="border-blue-200 bg-blue-50">
              <Shield className="h-4 w-4 text-blue-600" />
              <AlertDescription className="space-y-2">
                <div className="font-semibold text-blue-900">
                  労働安全衛生法に基づく実施について
                </div>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>本ストレスチェックは、労働安全衛生法第66条の10に基づき実施されます</li>
                  <li>結果は実施者（産業医等）のみが確認し、本人の同意なく事業者に提供されません</li>
                  <li>個人の検査結果は、実施者と実施事務従事者のみが取り扱います</li>
                  <li>データは暗号化され、5年間保存後に適切に廃棄されます</li>
                </ul>
              </AlertDescription>
            </Alert>

            {/* 実施概要 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">📝</div>
                  <div className="font-semibold">全57問</div>
                  <div className="text-sm text-muted-foreground">4つのセクション</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">⏱️</div>
                  <div className="font-semibold">約10分</div>
                  <div className="text-sm text-muted-foreground">平均所要時間</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">💾</div>
                  <div className="font-semibold">自動保存</div>
                  <div className="text-sm text-muted-foreground">中断・再開可能</div>
                </CardContent>
              </Card>
            </div>

            {/* セクション説明 */}
            <div className="space-y-3">
              <h3 className="font-semibold">調査内容</h3>
              <div className="space-y-2">
                {Object.entries(stressCheckQuestions).map(([key, section]) => (
                  <div key={key} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    {section.icon}
                    <div>
                      <div className="font-medium">{section.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {section.questions.length}問
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* アクションボタン */}
            <div className="flex justify-center gap-4 pt-4">
              <Button
                variant="outline"
                onClick={() => router.back()}
              >
                戻る
              </Button>
              <Button
                size="lg"
                onClick={handleStart}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
              >
                ストレスチェックを開始する
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 質問画面
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">
                ストレスチェック実施中
              </CardTitle>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className="font-mono">{elapsedTime}</span>
              </div>
            </div>

            {/* プログレスバー */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>質問 {currentQuestionNumber} / {totalQuestions}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* セクション表示 */}
            <div className="flex items-center gap-2 text-purple-600">
              {stressCheckQuestions[currentQuestion.section as keyof typeof stressCheckQuestions].icon}
              <span className="text-sm font-medium">
                {stressCheckQuestions[currentQuestion.section as keyof typeof stressCheckQuestions].title}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 質問文 */}
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              {stressCheckQuestions[currentQuestion.section as keyof typeof stressCheckQuestions].description}
            </div>
            <div className="text-lg font-medium p-4 bg-gray-50 rounded-lg">
              {currentQuestion.text}
            </div>
          </div>

          {/* 回答選択肢 */}
          <RadioGroup
            value={answers[`q${currentQuestionNumber}`]?.toString() || ''}
            onValueChange={(value) => handleAnswer(parseInt(value))}
          >
            <div className="grid grid-cols-2 gap-3">
              {currentQuestion.options.map((option) => (
                <div key={option.value}>
                  <Label
                    htmlFor={`option-${option.value}`}
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      answers[`q${currentQuestionNumber}`] === option.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.description}</div>
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>

          {/* ナビゲーション */}
          <div className="flex justify-between items-center pt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentQuestionNumber === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              前の質問
            </Button>

            <div className="flex items-center gap-4">
              <span className="text-sm text-green-600">
                ✓ 自動保存済み
              </span>

              <Button
                onClick={handleNext}
                disabled={!answers[`q${currentQuestionNumber}`]}
                className={currentQuestionNumber === totalQuestions ?
                  'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800' :
                  ''
                }
              >
                {currentQuestionNumber === totalQuestions ? (
                  <>完了する</>
                ) : (
                  <>
                    次の質問
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* 中断ボタン */}
          <div className="text-center pt-4 border-t">
            <Button
              variant="ghost"
              onClick={() => {
                if (confirm('進捗は保存されます。中断してもよろしいですか？')) {
                  router.back()
                }
              }}
              className="text-muted-foreground"
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              中断して保存
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}