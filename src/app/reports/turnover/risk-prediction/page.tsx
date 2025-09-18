'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, AlertTriangle, TrendingUp, Users } from 'lucide-react'
import { CategoryTopButton } from '@/components/CategoryTopButton'
import { exportToPDF } from '@/utils/pdfExport'

// サンプルチE�Eタ
const riskData = [
  { id: 1, name: '山田太郁E, department: '冁E��病棁E, role: '看護師', riskScore: 4.2, factors: ['残業時間増加', '有給取得率低丁E], trend: 'up' },
  { id: 2, name: '鈴木花孁E, department: 'ICU', role: '看護師', riskScore: 3.8, factors: ['ストレス持E��上�E', '研修参加玁E��丁E], trend: 'up' },
  { id: 3, name: '佐藤次郁E, department: '外科病棁E, role: '医師', riskScore: 3.5, factors: ['患老E��増加', '勤務シフト不満'], trend: 'stable' },
  { id: 4, name: '田中美咲', department: 'リハビリ私E, role: '琁E��療法士', riskScore: 2.1, factors: ['職場環墁E��好'], trend: 'down' },
]

export default function RiskPredictionPage() {
  const router = useRouter()

  const getRiskLevel = (score: number) => {
    if (score >= 4) return { label: '髁E, color: 'destructive' as const }
    if (score >= 3) return { label: '中', color: 'secondary' as const }
    return { label: '佁E, color: 'outline' as const }
  }

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return 'ↁE
    if (trend === 'down') return 'ↁE
    return 'ↁE
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div id="report-content" className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/reports')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          レポ�Eトセンターに戻めE        </Button>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <AlertTriangle className="h-8 w-8 text-red-500" />
                離職リスク予測
              </h1>
              <p className="text-muted-foreground mt-2">
                AIモチE��による個別職員の離職リスクスコア算�Eと早期警呁E              </p>
            </div>
            <Button
              onClick={() => exportToPDF({
                title: '離職リスク予測レポ�EチE,
                reportType: 'turnover-risk-prediction',
                elementId: 'report-content',
                dateRange: new Date().toLocaleDateString('ja-JP')
              })}
              className="bg-blue-600 text-white hover:bg-blue-700 pdf-exclude"
            >
              PDFダウンローチE            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  高リスク職員数
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">15吁E/div>
                <p className="text-xs text-muted-foreground mt-1">前週毁E+3吁E/p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  平坁E��スクスコア
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
                <span>リスクスコア上位�E員</span>
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
              <CardTitle>リスク要因刁E��</CardTitle>
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
                  <span className="text-sm">有給取得率の低丁E/span>
                  <div className="flex items-center gap-2">
                    <Progress value={72} className="w-32" />
                    <span className="text-sm font-medium">72%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">ストレス持E��の上�E</span>
                  <div className="flex items-center gap-2">
                    <Progress value={68} className="w-32" />
                    <span className="text-sm font-medium">68%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">研修参加玁E�E低丁E/span>
                  <div className="flex items-center gap-2">
                    <Progress value={45} className="w-32" />
                    <span className="text-sm font-medium">45%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div><CategoryTopButton categoryPath="/reports?tab=turnover" categoryName="離職要因刁E��" /></div>
  )
}