'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { RecruitmentMetrics } from '@/types/recruitment'
import { TrendingUp, TrendingDown, Users, Clock, DollarSign, Target, Award, BarChart3 } from 'lucide-react'

interface RecruitmentAnalyticsProps {
  metrics: RecruitmentMetrics
  period?: string
}

export default function RecruitmentAnalytics({ metrics, period = '過去30日' }: RecruitmentAnalyticsProps) {
  const getSourceEffectivenessColor = (quality: number) => {
    if (quality >= 4) return '#16a34a'
    if (quality >= 3) return '#2563eb'
    if (quality >= 2) return '#f59e0b'
    return '#dc2626'
  }

  const calculateConversionRate = (applicants: number, hires: number) => {
    if (applicants === 0) return 0
    return ((hires / applicants) * 100).toFixed(1)
  }

  const totalApplicants = metrics.sourceEffectiveness.reduce((sum, s) => sum + s.applicants, 0)
  const totalHires = metrics.sourceEffectiveness.reduce((sum, s) => sum + s.hires, 0)
  const overallConversionRate = calculateConversionRate(totalApplicants, totalHires)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              採用分析ダッシュボード
            </CardTitle>
            <Badge variant="outline">{period}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <h3 className="font-semibold text-blue-900 mb-2">採用パフォーマンス サマリー</h3>
            <p className="text-sm text-blue-800">
              採用効率は前期比で改善傾向。平均採用期間
              <span className="font-bold"> {metrics.timeToFill}日</span>、
              内定承諾率<span className="font-bold"> {metrics.offerAcceptanceRate}%</span>
              と良好な水準を維持。採用コスト最適化により
              <span className="font-bold"> 1人あたり{(metrics.costPerHire / 10000).toFixed(1)}万円</span>
              で優秀な人材を確保。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="h-8 w-8 text-blue-500" />
                  <TrendingDown className="h-4 w-4 text-green-500" />
                </div>
                <div className="text-2xl font-bold">{metrics.timeToFill}日</div>
                <div className="text-sm text-gray-600">平均採用期間</div>
                <div className="mt-2">
                  <Progress value={Math.min((30 / metrics.timeToFill) * 100, 100)} className="h-1" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="h-8 w-8 text-green-500" />
                  <TrendingDown className="h-4 w-4 text-green-500" />
                </div>
                <div className="text-2xl font-bold">¥{(metrics.costPerHire / 10000).toFixed(1)}万</div>
                <div className="text-sm text-gray-600">採用コスト/人</div>
                <div className="mt-2">
                  <Progress value={Math.min((500000 / metrics.costPerHire) * 100, 100)} className="h-1" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Target className="h-8 w-8 text-purple-500" />
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <div className="text-2xl font-bold">{metrics.offerAcceptanceRate}%</div>
                <div className="text-sm text-gray-600">内定承諾率</div>
                <div className="mt-2">
                  <Progress value={metrics.offerAcceptanceRate} className="h-1" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Users className="h-8 w-8 text-orange-500" />
                  <Badge variant="outline" className="text-xs">
                    {metrics.firstYearTurnoverRate < 10 ? '良好' : '要改善'}
                  </Badge>
                </div>
                <div className="text-2xl font-bold">{metrics.firstYearTurnoverRate}%</div>
                <div className="text-sm text-gray-600">初年度離職率</div>
                <div className="mt-2">
                  <Progress
                    value={100 - metrics.firstYearTurnoverRate}
                    className="h-1"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">採用チャネル効果分析</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics.sourceEffectiveness
                    .sort((a, b) => b.hires - a.hires)
                    .map((source, index) => {
                      const conversionRate = calculateConversionRate(source.applicants, source.hires)
                      const isTopPerformer = index === 0

                      return (
                        <div
                          key={source.source}
                          className={`p-3 rounded-lg border-l-4 ${
                            isTopPerformer ? 'bg-green-50' : 'bg-gray-50'
                          }`}
                          style={{ borderLeftColor: getSourceEffectivenessColor(source.quality) }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="font-medium">
                                {source.source}
                              </div>
                              {isTopPerformer && (
                                <Award className="h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-2 h-2 rounded-full ${
                                    i < source.quality ? 'bg-green-500' : 'bg-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div>
                              <div className="text-gray-600">応募者数</div>
                              <div className="font-semibold">{source.applicants}名</div>
                            </div>
                            <div>
                              <div className="text-gray-600">採用数</div>
                              <div className="font-semibold text-green-600">{source.hires}名</div>
                            </div>
                            <div>
                              <div className="text-gray-600">転換率</div>
                              <div className="font-semibold text-blue-600">{conversionRate}%</div>
                            </div>
                          </div>

                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                              <span>効率性</span>
                              <span>{conversionRate}%</span>
                            </div>
                            <Progress
                              value={parseFloat(conversionRate)}
                              className="h-1"
                            />
                          </div>
                        </div>
                      )
                    })}
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm font-medium text-blue-900 mb-1">改善提案</div>
                  <p className="text-xs text-blue-700">
                    最も効果的な採用チャネルは
                    <span className="font-bold">「{metrics.sourceEffectiveness[0].source}」</span>
                    です。このチャネルへの投資を増やすことで、採用効率の更なる向上が期待できます。
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">採用ファネル分析</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    {[
                      { label: '応募者総数', value: totalApplicants, color: '#e5e7eb' },
                      { label: '書類通過', value: Math.floor(totalApplicants * 0.4), color: '#ddd6fe' },
                      { label: '一次面接', value: Math.floor(totalApplicants * 0.25), color: '#bfdbfe' },
                      { label: '最終面接', value: Math.floor(totalApplicants * 0.1), color: '#bbf7d0' },
                      { label: '内定', value: totalHires, color: '#86efac' }
                    ].map((stage, index) => (
                      <div key={stage.label} className="mb-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{stage.label}</span>
                          <span className="text-sm font-bold">{stage.value}名</span>
                        </div>
                        <div
                          className="h-8 rounded-lg flex items-center px-3"
                          style={{
                            backgroundColor: stage.color,
                            width: `${(stage.value / totalApplicants) * 100}%`,
                            minWidth: '80px'
                          }}
                        >
                          <span className="text-xs font-medium">
                            {((stage.value / totalApplicants) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {overallConversionRate}%
                      </div>
                      <div className="text-xs text-gray-600">全体転換率</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {metrics.applicantsPerOpening}
                      </div>
                      <div className="text-xs text-gray-600">応募倍率</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                  <div className="text-sm font-medium text-orange-900 mb-1">最適化ポイント</div>
                  <p className="text-xs text-orange-700">
                    書類選考の通過率を改善することで、優秀な候補者の取りこぼしを防ぎ、
                    採用効率を<span className="font-bold">15%向上</span>させることができます。
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">月次採用トレンド</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-end justify-between gap-2">
                  {[
                    { month: '1月', applicants: 45, hires: 8 },
                    { month: '2月', applicants: 52, hires: 10 },
                    { month: '3月', applicants: 68, hires: 12 },
                    { month: '4月', applicants: 85, hires: 15 },
                    { month: '5月', applicants: 72, hires: 13 },
                    { month: '6月', applicants: 90, hires: 18 }
                  ].map((data) => (
                    <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex flex-col items-center gap-1">
                        <div className="text-xs font-medium">{data.hires}</div>
                        <div
                          className="w-full bg-green-500 rounded-t"
                          style={{ height: `${(data.hires / 20) * 100}px` }}
                        />
                        <div
                          className="w-full bg-blue-300 rounded-t"
                          style={{ height: `${(data.applicants / 100) * 100}px` }}
                        />
                      </div>
                      <div className="text-xs text-gray-600">{data.month}</div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-300 rounded" />
                    <span className="text-xs text-gray-600">応募者数</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded" />
                    <span className="text-xs text-gray-600">採用数</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}