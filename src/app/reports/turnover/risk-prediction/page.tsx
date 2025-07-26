'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, AlertTriangle, TrendingUp, Users } from 'lucide-react'
import ScrollToTopButton from '@/components/ScrollToTopButton'
import DashboardButton from '@/components/DashboardButton'
import { BackToReportsButton } from '@/components/BackToReportsButton'
import { CategoryTopButton } from '@/components/CategoryTopButton'

// サンプルデータ
const riskData = [
  { id: 1, name: '山田太郎', department: '内科病棟', role: '看護師', riskScore: 4.2, factors: ['残業時間増加', '有給取得率低下'], trend: 'up' },
  { id: 2, name: '鈴木花子', department: 'ICU', role: '看護師', riskScore: 3.8, factors: ['ストレス指数上昇', '研修参加率低下'], trend: 'up' },
  { id: 3, name: '佐藤次郎', department: '外科病棟', role: '医師', riskScore: 3.5, factors: ['患者数増加', '勤務シフト不満'], trend: 'stable' },
  { id: 4, name: '田中美咲', department: 'リハビリ科', role: '理学療法士', riskScore: 2.1, factors: ['職場環境良好'], trend: 'down' },
]

export default function RiskPredictionPage() {
  const router = useRouter()

  const getRiskLevel = (score: number) => {
    if (score >= 4) return { label: '高', color: 'destructive' as const }
    if (score >= 3) return { label: '中', color: 'secondary' as const }
    return { label: '低', color: 'outline' as const }
  }

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return '↑'
    if (trend === 'down') return '↓'
    return '→'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/reports')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          レポートセンターに戻る
        </Button>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              離職リスク予測
            </h1>
            <p className="text-muted-foreground mt-2">
              AIモデルによる個別職員の離職リスクスコア算出と早期警告
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  高リスク職員数
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">15名</div>
                <p className="text-xs text-muted-foreground mt-1">前週比 +3名</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  平均リスクスコア
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.2</div>
                <Progress value={64} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  予測精度
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">89.5%</div>
                <p className="text-xs text-muted-foreground mt-1">過去3ヶ月実績</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>リスクスコア上位職員</span>
                <Badge variant="secondary">リアルタイム更新</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskData.map((person) => {
                  const risk = getRiskLevel(person.riskScore)
                  return (
                    <div key={person.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{person.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {person.department} - {person.role}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={risk.color}>
                            リスク{risk.label}
                          </Badge>
                          <div className="text-2xl font-bold">
                            {person.riskScore}
                            <span className="text-sm ml-1">{getTrendIcon(person.trend)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm font-medium mb-1">主な要因:</p>
                        <div className="flex gap-2 flex-wrap">
                          {person.factors.map((factor, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {factor}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>リスク要因分析</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">残業時間の増加</span>
                  <div className="flex items-center gap-2">
                    <Progress value={85} className="w-32" />
                    <span className="text-sm font-medium">85%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">有給取得率の低下</span>
                  <div className="flex items-center gap-2">
                    <Progress value={72} className="w-32" />
                    <span className="text-sm font-medium">72%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">ストレス指数の上昇</span>
                  <div className="flex items-center gap-2">
                    <Progress value={68} className="w-32" />
                    <span className="text-sm font-medium">68%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">研修参加率の低下</span>
                  <div className="flex items-center gap-2">
                    <Progress value={45} className="w-32" />
                    <span className="text-sm font-medium">45%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ScrollToTopButton />
      <CategoryTopButton categoryPath="/reports/turnover-risk" categoryName="離職要因分析" />
      <BackToReportsButton />
    </div>
  )
}