'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Shield,
  Heart,
  Users,
  Activity,
  Calendar,
  Download,
  Printer,
  ChevronRight
} from 'lucide-react'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line
} from 'recharts'

interface StressResult {
  userId: string
  testDate: string
  answers: Record<string, number>
  scores: {
    stressFactors: number
    stressReactions: number
    support: number
    satisfaction: number
    total: number
    highStress: boolean
  }
  completionTime: string
}

export default function StressCheckResultPage() {
  const router = useRouter()
  const [result, setResult] = useState<StressResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // LocalStorageから結果を取得（実際にはAPIから取得）
    const storedResult = localStorage.getItem('stressCheckResult')
    if (storedResult) {
      setResult(JSON.parse(storedResult))
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <div className="text-lg">結果を集計中...</div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">結果が見つかりません</h2>
            <p className="text-muted-foreground mb-4">
              ストレスチェックを実施してください
            </p>
            <Button onClick={() => router.push('/stress-check/test')}>
              ストレスチェックを開始
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // レーダーチャート用データ
  const radarData = [
    {
      category: '仕事のストレス要因',
      score: Math.round((result.scores.stressFactors / 68) * 100),
      fullMark: 100
    },
    {
      category: '心身のストレス反応',
      score: Math.round((result.scores.stressReactions / 116) * 100),
      fullMark: 100
    },
    {
      category: '周囲のサポート',
      score: Math.round((36 - result.scores.support) / 36 * 100), // 逆転
      fullMark: 100
    },
    {
      category: '満足度',
      score: Math.round((8 - result.scores.satisfaction) / 8 * 100), // 逆転
      fullMark: 100
    }
  ]

  // 部門平均との比較データ（ダミー）
  const comparisonData = [
    { name: '仕事のストレス', あなた: result.scores.stressFactors, 部門平均: 45 },
    { name: 'ストレス反応', あなた: result.scores.stressReactions, 部門平均: 72 },
    { name: 'サポート', あなた: result.scores.support, 部門平均: 20 },
    { name: '満足度', あなた: result.scores.satisfaction, 部門平均: 5 }
  ]

  // 経年変化データ（ダミー）
  const trendData = [
    { month: '2024年10月', score: 75 },
    { month: '2025年1月', score: 68 },
    { month: '2025年4月', score: 72 },
    { month: '2025年7月', score: result.scores.total }
  ]

  const handleSaveToProfile = async () => {
    // 職員カルテに保存する処理（API呼び出し）
    console.log('職員カルテに保存:', result)
    alert('結果を職員カルテに保存しました')
  }

  const handleScheduleConsultation = () => {
    router.push('/consultation/schedule')
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* ヘッダー */}
      <Card className="mb-6">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl mb-2">
                ストレスチェック結果
              </CardTitle>
              <p className="text-purple-100">
                実施日: {new Date(result.testDate).toLocaleDateString('ja-JP')}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-purple-200">所要時間</div>
              <div className="text-xl font-mono">{result.completionTime}</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 判定結果 */}
      <Card className="mb-6">
        <CardContent className="p-6">
          {result.scores.highStress ? (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <AlertDescription className="space-y-3">
                <div className="font-semibold text-lg text-red-900">
                  高ストレス状態の可能性があります
                </div>
                <p className="text-red-800">
                  ストレスが高い状態にある可能性があります。
                  産業医面談のご利用をおすすめします。
                </p>
                <Button
                  onClick={handleScheduleConsultation}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  産業医面談を予約する
                </Button>
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <AlertDescription className="space-y-3">
                <div className="font-semibold text-lg text-green-900">
                  標準的なストレスレベルです
                </div>
                <p className="text-green-800">
                  現在のストレスレベルは標準範囲内です。
                  引き続き、セルフケアを心がけましょう。
                </p>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* 詳細結果タブ */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview">総合評価</TabsTrigger>
          <TabsTrigger value="details">詳細分析</TabsTrigger>
          <TabsTrigger value="comparison">比較</TabsTrigger>
          <TabsTrigger value="advice">アドバイス</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ストレスプロファイル</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name="スコア"
                    dataKey="score"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Activity className="w-8 h-8 text-purple-500" />
                  <div>
                    <div className="text-sm text-muted-foreground">仕事のストレス</div>
                    <div className="text-2xl font-bold">{result.scores.stressFactors}</div>
                    <div className="text-xs text-muted-foreground">/68点</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Heart className="w-8 h-8 text-red-500" />
                  <div>
                    <div className="text-sm text-muted-foreground">心身の反応</div>
                    <div className="text-2xl font-bold">{result.scores.stressReactions}</div>
                    <div className="text-xs text-muted-foreground">/116点</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-blue-500" />
                  <div>
                    <div className="text-sm text-muted-foreground">サポート</div>
                    <div className="text-2xl font-bold">{result.scores.support}</div>
                    <div className="text-xs text-muted-foreground">/36点</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-green-500" />
                  <div>
                    <div className="text-sm text-muted-foreground">満足度</div>
                    <div className="text-2xl font-bold">{result.scores.satisfaction}</div>
                    <div className="text-xs text-muted-foreground">/8点</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>セクション別詳細</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">A. 仕事のストレス要因</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>仕事の量的負担: 高い</div>
                    <div>仕事の質的負担: 中程度</div>
                    <div>身体的負担: 低い</div>
                    <div>職場環境: 良好</div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">B. 心身のストレス反応</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>活気: 中程度</div>
                    <div>イライラ感: 低い</div>
                    <div>疲労感: 中程度</div>
                    <div>不安感: 低い</div>
                    <div>抑うつ感: 低い</div>
                    <div>身体愁訴: 低い</div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">C. 周囲のサポート</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>上司のサポート: 良好</div>
                    <div>同僚のサポート: 良好</div>
                    <div>家族・友人のサポート: 良好</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>部門平均との比較</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="あなた" fill="#8b5cf6" />
                  <Bar dataKey="部門平均" fill="#cbd5e1" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>経年変化</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    name="ストレススコア"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advice" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>セルフケアのアドバイス</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">
                  仕事のストレス対処法
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                  <li>タスクの優先順位を明確にし、計画的に仕事を進めましょう</li>
                  <li>適度な休憩を取り、リフレッシュする時間を作りましょう</li>
                  <li>困ったときは早めに上司や同僚に相談しましょう</li>
                </ul>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">
                  心身のリラックス法
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-green-800">
                  <li>深呼吸や瞑想など、リラクゼーション技法を実践しましょう</li>
                  <li>十分な睡眠時間（7-8時間）を確保しましょう</li>
                  <li>適度な運動で心身をリフレッシュしましょう</li>
                </ul>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">
                  利用可能なサポート
                </h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    産業医面談の予約
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Heart className="w-4 h-4 mr-2" />
                    保健師相談の申込み
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="w-4 h-4 mr-2" />
                    EAP（従業員支援プログラム）の利用
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* アクションボタン */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => window.print()}>
                <Printer className="w-4 h-4 mr-2" />
                結果を印刷
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                PDFダウンロード
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => router.push('/health')}
              >
                健康管理ページへ
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
              <Button onClick={handleSaveToProfile}>
                職員カルテに保存
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}