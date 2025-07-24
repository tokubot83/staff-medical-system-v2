'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, GitBranch } from 'lucide-react'

// サンプルデータ
const correlationData = [
  { factor1: '残業時間', factor2: '離職率', correlation: 0.82, strength: '強い正の相関' },
  { factor1: '有給取得率', factor2: '離職率', correlation: -0.75, strength: '強い負の相関' },
  { factor1: '給与満足度', factor2: '離職率', correlation: -0.68, strength: '中程度の負の相関' },
  { factor1: '研修参加率', factor2: '離職率', correlation: -0.45, strength: '弱い負の相関' },
  { factor1: '通勤時間', factor2: '離職率', correlation: 0.35, strength: '弱い正の相関' },
]

export default function CorrelationAnalysisPage() {
  const router = useRouter()

  const getCorrelationColor = (value: number) => {
    if (value > 0.7) return 'text-red-600'
    if (value > 0.3) return 'text-orange-600'
    if (value < -0.7) return 'text-green-600'
    if (value < -0.3) return 'text-blue-600'
    return 'text-gray-600'
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
              <GitBranch className="h-8 w-8 text-purple-500" />
              相関分析
            </h1>
            <p className="text-muted-foreground mt-2">
              離職要因の相関関係と影響度の可視化分析
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  分析対象要因数
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24項目</div>
                <p className="text-xs text-muted-foreground mt-1">前回分析から+3項目</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  強い相関項目
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">5項目</div>
                <p className="text-xs text-muted-foreground mt-1">相関係数 |r| > 0.7</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  データ品質スコア
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">94%</div>
                <p className="text-xs text-muted-foreground mt-1">欠損値率 < 6%</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>離職率との相関関係</span>
                <Badge variant="secondary">週次更新</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {correlationData.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{item.factor1} × 離職率</h3>
                        <p className="text-sm text-muted-foreground">{item.strength}</p>
                      </div>
                      <div className={`text-3xl font-bold ${getCorrelationColor(item.correlation)}`}>
                        {item.correlation > 0 ? '+' : ''}{item.correlation.toFixed(2)}
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            item.correlation > 0 ? 'bg-red-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.abs(item.correlation) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>相関マトリックス（抜粋）</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">要因</th>
                      <th className="text-center p-2">残業時間</th>
                      <th className="text-center p-2">有給取得率</th>
                      <th className="text-center p-2">給与満足度</th>
                      <th className="text-center p-2">研修参加率</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2 font-medium">残業時間</td>
                      <td className="text-center p-2">1.00</td>
                      <td className="text-center p-2 text-red-600">-0.65</td>
                      <td className="text-center p-2 text-orange-600">-0.42</td>
                      <td className="text-center p-2 text-orange-600">-0.38</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">有給取得率</td>
                      <td className="text-center p-2 text-red-600">-0.65</td>
                      <td className="text-center p-2">1.00</td>
                      <td className="text-center p-2 text-blue-600">0.55</td>
                      <td className="text-center p-2 text-blue-600">0.48</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">給与満足度</td>
                      <td className="text-center p-2 text-orange-600">-0.42</td>
                      <td className="text-center p-2 text-blue-600">0.55</td>
                      <td className="text-center p-2">1.00</td>
                      <td className="text-center p-2 text-gray-600">0.22</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">研修参加率</td>
                      <td className="text-center p-2 text-orange-600">-0.38</td>
                      <td className="text-center p-2 text-blue-600">0.48</td>
                      <td className="text-center p-2 text-gray-600">0.22</td>
                      <td className="text-center p-2">1.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}