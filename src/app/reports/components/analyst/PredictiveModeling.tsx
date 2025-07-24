'use client'

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Brain, TrendingUp, TrendingDown, BarChart3, Calculator } from 'lucide-react'
import { StaffDetail } from '@/app/data/staffData'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface PredictiveModelingProps {
  staffData: StaffDetail[]
}

interface PredictionScenario {
  name: string
  description: string
  interventions: {
    overtime: number
    paidLeaveRate: number
    supportPrograms: boolean
    flexibleWork: boolean
  }
  predictions: {
    month: string
    current: number
    predicted: number
    improvement: number
  }[]
}

export function PredictiveModeling({ staffData }: PredictiveModelingProps) {
  const [timeframe, setTimeframe] = useState('3months')
  const [selectedScenario, setSelectedScenario] = useState('baseline')
  
  // シミュレーション用のパラメータ
  const [overtimeReduction, setOvertimeReduction] = useState([20])
  const [paidLeaveIncrease, setPaidLeaveIncrease] = useState([15])
  const [enableSupportPrograms, setEnableSupportPrograms] = useState(false)
  const [enableFlexibleWork, setEnableFlexibleWork] = useState(false)

  // 現在の組織の平均値を計算
  const currentMetrics = useMemo(() => {
    const avgStress = staffData.reduce((sum, s) => sum + s.stressIndex, 0) / staffData.length
    const avgEngagement = staffData.reduce((sum, s) => sum + s.engagement, 0) / staffData.length
    const highRiskCount = staffData.filter(s => s.stressIndex >= 70 || s.engagement <= 30).length
    const turnoverRisk = (highRiskCount / staffData.length) * 100

    return {
      avgStress: Math.round(avgStress),
      avgEngagement: Math.round(avgEngagement),
      turnoverRisk: Math.round(turnoverRisk)
    }
  }, [staffData])

  // 予測モデルの計算
  const predictions = useMemo(() => {
    const months = timeframe === '3months' ? 3 : timeframe === '6months' ? 6 : 12
    const baselineData = []
    const optimizedData = []
    const customData = []

    for (let i = 0; i <= months; i++) {
      const monthName = `${i}ヶ月後`
      
      // ベースライン予測（現状維持）
      const baselineStress = currentMetrics.avgStress + (i * 1.5) // 毎月1.5ポイント悪化
      const baselineEngagement = Math.max(0, currentMetrics.avgEngagement - (i * 1.2))
      const baselineTurnover = Math.min(100, currentMetrics.turnoverRisk + (i * 2))
      
      baselineData.push({
        month: monthName,
        stress: Math.round(baselineStress),
        engagement: Math.round(baselineEngagement),
        turnover: Math.round(baselineTurnover)
      })

      // 最適化シナリオ（推奨改善策）
      const stressReduction = 3 + (i * 0.5) // 改善効果は累積
      const engagementBoost = 2 + (i * 0.8)
      const optimizedStress = Math.max(0, currentMetrics.avgStress - stressReduction)
      const optimizedEngagement = Math.min(100, currentMetrics.avgEngagement + engagementBoost)
      const optimizedTurnover = Math.max(0, currentMetrics.turnoverRisk - (i * 1.5))
      
      optimizedData.push({
        month: monthName,
        stress: Math.round(optimizedStress),
        engagement: Math.round(optimizedEngagement),
        turnover: Math.round(optimizedTurnover)
      })

      // カスタムシナリオ
      const customStressReduction = (overtimeReduction[0] / 100 * 10) + 
                                   (paidLeaveIncrease[0] / 100 * 5) +
                                   (enableSupportPrograms ? 8 : 0) +
                                   (enableFlexibleWork ? 5 : 0)
      const customEngagementBoost = (overtimeReduction[0] / 100 * 8) + 
                                   (paidLeaveIncrease[0] / 100 * 10) +
                                   (enableSupportPrograms ? 5 : 0) +
                                   (enableFlexibleWork ? 7 : 0)
      
      const customStress = Math.max(0, currentMetrics.avgStress - (customStressReduction * (i + 1) / months))
      const customEngagement = Math.min(100, currentMetrics.avgEngagement + (customEngagementBoost * (i + 1) / months))
      const customTurnover = Math.max(0, currentMetrics.turnoverRisk - (customStressReduction * 0.8 * (i + 1) / months))
      
      customData.push({
        month: monthName,
        stress: Math.round(customStress),
        engagement: Math.round(customEngagement),
        turnover: Math.round(customTurnover)
      })
    }

    return {
      baseline: baselineData,
      optimized: optimizedData,
      custom: customData
    }
  }, [timeframe, currentMetrics, overtimeReduction, paidLeaveIncrease, enableSupportPrograms, enableFlexibleWork])

  // 改善効果の計算
  const improvements = useMemo(() => {
    const lastIndex = predictions.baseline.length - 1
    const baseline = predictions.baseline[lastIndex]
    const optimized = predictions.optimized[lastIndex]
    const custom = predictions.custom[lastIndex]

    return {
      optimized: {
        stressReduction: baseline.stress - optimized.stress,
        engagementIncrease: optimized.engagement - baseline.engagement,
        turnoverReduction: baseline.turnover - optimized.turnover
      },
      custom: {
        stressReduction: baseline.stress - custom.stress,
        engagementIncrease: custom.engagement - baseline.engagement,
        turnoverReduction: baseline.turnover - custom.turnover
      }
    }
  }, [predictions])

  return (
    <div className="space-y-6">
      {/* 予測期間選択 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            予測モデリング設定
          </CardTitle>
          <CardDescription>
            将来の組織状態を予測し、改善施策の効果をシミュレーション
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <label className="text-sm font-medium mb-2 block">予測期間</label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-50 bg-white">
                  <SelectItem value="3months">3ヶ月後</SelectItem>
                  <SelectItem value="6months">6ヶ月後</SelectItem>
                  <SelectItem value="12months">12ヶ月後</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ストレス指数予測 */}
      <Card>
        <CardHeader>
          <CardTitle>ストレス指数の予測</CardTitle>
          <CardDescription>
            現在の平均: {currentMetrics.avgStress}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line 
                  data={predictions.baseline} 
                  dataKey="stress" 
                  name="現状維持" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                />
                <Line 
                  data={predictions.optimized} 
                  dataKey="stress" 
                  name="推奨改善" 
                  stroke="#10b981" 
                  strokeWidth={2}
                />
                <Line 
                  data={predictions.custom} 
                  dataKey="stress" 
                  name="カスタム" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 離職リスク予測 */}
      <Card>
        <CardHeader>
          <CardTitle>離職リスクの予測</CardTitle>
          <CardDescription>
            現在のリスク: {currentMetrics.turnoverRisk}%
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Area 
                  data={predictions.baseline} 
                  dataKey="turnover" 
                  name="現状維持" 
                  stroke="#ef4444" 
                  fill="#ef4444"
                  fillOpacity={0.3}
                />
                <Area 
                  data={predictions.optimized} 
                  dataKey="turnover" 
                  name="推奨改善" 
                  stroke="#10b981" 
                  fill="#10b981"
                  fillOpacity={0.3}
                />
                <Area 
                  data={predictions.custom} 
                  dataKey="turnover" 
                  name="カスタム" 
                  stroke="#3b82f6" 
                  fill="#3b82f6"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* カスタムシミュレーション */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            改善施策シミュレーター
          </CardTitle>
          <CardDescription>
            各施策のパラメータを調整して効果を確認
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">残業時間削減</label>
                  <span className="text-sm text-muted-foreground">{overtimeReduction[0]}%</span>
                </div>
                <Slider
                  value={overtimeReduction}
                  onValueChange={setOvertimeReduction}
                  max={50}
                  step={5}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">有給取得率向上</label>
                  <span className="text-sm text-muted-foreground">+{paidLeaveIncrease[0]}%</span>
                </div>
                <Slider
                  value={paidLeaveIncrease}
                  onValueChange={setPaidLeaveIncrease}
                  max={40}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">追加施策</label>
                <div className="flex gap-4">
                  <Button
                    variant={enableSupportPrograms ? "default" : "outline"}
                    size="sm"
                    onClick={() => setEnableSupportPrograms(!enableSupportPrograms)}
                  >
                    メンタルサポートプログラム
                  </Button>
                  <Button
                    variant={enableFlexibleWork ? "default" : "outline"}
                    size="sm"
                    onClick={() => setEnableFlexibleWork(!enableFlexibleWork)}
                  >
                    フレキシブルワーク
                  </Button>
                </div>
              </div>
            </div>

            {/* 予測効果サマリー */}
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">予測される改善効果（{timeframe === '3months' ? '3ヶ月後' : timeframe === '6months' ? '6ヶ月後' : '12ヶ月後'}）</h4>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="text-sm text-muted-foreground">ストレス削減</div>
                    <div className="text-2xl font-bold text-green-600">
                      -{improvements.custom.stressReduction}
                    </div>
                  </div>
                  <TrendingDown className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="text-sm text-muted-foreground">エンゲージメント向上</div>
                    <div className="text-2xl font-bold text-blue-600">
                      +{improvements.custom.engagementIncrease}%
                    </div>
                  </div>
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="text-sm text-muted-foreground">離職リスク低減</div>
                    <div className="text-2xl font-bold text-purple-600">
                      -{improvements.custom.turnoverReduction}%
                    </div>
                  </div>
                  <BarChart3 className="h-5 w-5 text-purple-500" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}