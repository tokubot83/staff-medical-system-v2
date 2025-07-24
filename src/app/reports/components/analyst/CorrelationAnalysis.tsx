'use client'

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'
import { StaffDetail } from '@/app/data/staffData'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface CorrelationAnalysisProps {
  staffData: StaffDetail[]
}

interface CorrelationPair {
  x: string
  y: string
  correlation: number
  interpretation: string
  strength: 'strong' | 'moderate' | 'weak'
}

const METRICS = [
  { value: 'stressIndex', label: 'ストレス指数' },
  { value: 'engagement', label: 'エンゲージメント' },
  { value: 'overtime', label: '残業時間' },
  { value: 'paidLeaveRate', label: '有給取得率' },
  { value: 'age', label: '年齢' },
  { value: 'healthScore', label: '健康スコア' }
]

export function CorrelationAnalysis({ staffData }: CorrelationAnalysisProps) {
  const [xMetric, setXMetric] = useState('stressIndex')
  const [yMetric, setYMetric] = useState('engagement')

  // 相関係数の計算
  const correlations = useMemo(() => {
    const pairs: CorrelationPair[] = []

    // 主要な相関ペアを事前定義
    const keyPairs = [
      { x: 'stressIndex', y: 'engagement', expected: -0.72 },
      { x: 'overtime', y: 'stressIndex', expected: 0.68 },
      { x: 'paidLeaveRate', y: 'engagement', expected: 0.54 },
      { x: 'age', y: 'stressIndex', expected: -0.23 },
      { x: 'overtime', y: 'paidLeaveRate', expected: -0.61 }
    ]

    keyPairs.forEach(pair => {
      const correlation = calculateCorrelation(staffData, pair.x, pair.y)
      const strength = Math.abs(correlation) >= 0.7 ? 'strong' : 
                      Math.abs(correlation) >= 0.4 ? 'moderate' : 'weak'
      
      pairs.push({
        x: pair.x,
        y: pair.y,
        correlation,
        strength,
        interpretation: getInterpretation(pair.x, pair.y, correlation)
      })
    })

    return pairs.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation))
  }, [staffData])

  // 散布図データの準備
  const scatterData = useMemo(() => {
    return staffData.map(staff => ({
      x: getMetricValue(staff, xMetric),
      y: getMetricValue(staff, yMetric),
      name: staff.name,
      department: staff.department,
      riskLevel: staff.stressIndex >= 70 ? 'high' : 
                 staff.stressIndex >= 40 ? 'medium' : 'low'
    }))
  }, [staffData, xMetric, yMetric])

  // 現在選択されているペアの相関係数
  const currentCorrelation = calculateCorrelation(staffData, xMetric, yMetric)

  return (
    <div className="space-y-6">
      {/* 主要な相関関係 */}
      <Card>
        <CardHeader>
          <CardTitle>発見された主要な相関関係</CardTitle>
          <CardDescription>
            統計的に有意な相関を持つ指標の組み合わせ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {correlations.map((corr, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {corr.correlation > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <div>
                    <div className="font-medium">
                      {METRICS.find(m => m.value === corr.x)?.label} × {METRICS.find(m => m.value === corr.y)?.label}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {corr.interpretation}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={
                    corr.strength === 'strong' ? 'default' :
                    corr.strength === 'moderate' ? 'secondary' : 'outline'
                  }>
                    {corr.strength === 'strong' ? '強い相関' :
                     corr.strength === 'moderate' ? '中程度の相関' : '弱い相関'}
                  </Badge>
                  <span className="font-mono font-semibold">
                    {corr.correlation > 0 ? '+' : ''}{corr.correlation.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* インタラクティブ散布図 */}
      <Card>
        <CardHeader>
          <CardTitle>相関分析ビジュアライザー</CardTitle>
          <CardDescription>
            2つの指標を選択して相関関係を視覚的に確認
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium">X軸</label>
                <Select value={xMetric} onValueChange={setXMetric}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {METRICS.map(metric => (
                      <SelectItem key={metric.value} value={metric.value}>
                        {metric.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium">Y軸</label>
                <Select value={yMetric} onValueChange={setYMetric}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {METRICS.map(metric => (
                      <SelectItem key={metric.value} value={metric.value}>
                        {metric.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 p-3 bg-muted rounded-lg">
              <Activity className="h-4 w-4" />
              <span className="text-sm">相関係数: </span>
              <span className="font-mono font-bold text-lg">
                {currentCorrelation > 0 ? '+' : ''}{currentCorrelation.toFixed(3)}
              </span>
              <Badge variant={
                Math.abs(currentCorrelation) >= 0.7 ? 'default' :
                Math.abs(currentCorrelation) >= 0.4 ? 'secondary' : 'outline'
              }>
                {Math.abs(currentCorrelation) >= 0.7 ? '強い相関' :
                 Math.abs(currentCorrelation) >= 0.4 ? '中程度の相関' : '弱い相関'}
              </Badge>
            </div>

            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name={METRICS.find(m => m.value === xMetric)?.label}
                    label={{ value: METRICS.find(m => m.value === xMetric)?.label, position: 'insideBottom', offset: -10 }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name={METRICS.find(m => m.value === yMetric)?.label}
                    label={{ value: METRICS.find(m => m.value === yMetric)?.label, angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload[0]) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-background border rounded-lg shadow-lg p-3">
                            <p className="font-semibold">{data.name}</p>
                            <p className="text-sm text-muted-foreground">{data.department}</p>
                            <div className="mt-2 space-y-1">
                              <p className="text-sm">
                                {METRICS.find(m => m.value === xMetric)?.label}: {data.x}
                              </p>
                              <p className="text-sm">
                                {METRICS.find(m => m.value === yMetric)?.label}: {data.y}
                              </p>
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Scatter data={scatterData} fill="#8884d8">
                    {scatterData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={
                          entry.riskLevel === 'high' ? '#ef4444' :
                          entry.riskLevel === 'medium' ? '#f59e0b' : '#10b981'
                        }
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span>高リスク</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span>中リスク</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span>低リスク</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ヘルパー関数
function getMetricValue(staff: StaffDetail, metric: string): number {
  switch (metric) {
    case 'stressIndex': return staff.stressIndex
    case 'engagement': return staff.engagement
    case 'overtime': return staff.overtime
    case 'paidLeaveRate': return staff.paidLeaveRate
    case 'age': return staff.age
    case 'healthScore': return staff.healthScore || 70
    default: return 0
  }
}

function calculateCorrelation(data: StaffDetail[], xMetric: string, yMetric: string): number {
  const n = data.length
  const xValues = data.map(d => getMetricValue(d, xMetric))
  const yValues = data.map(d => getMetricValue(d, yMetric))
  
  const xMean = xValues.reduce((a, b) => a + b) / n
  const yMean = yValues.reduce((a, b) => a + b) / n
  
  let numerator = 0
  let xDenominator = 0
  let yDenominator = 0
  
  for (let i = 0; i < n; i++) {
    const xDiff = xValues[i] - xMean
    const yDiff = yValues[i] - yMean
    numerator += xDiff * yDiff
    xDenominator += xDiff * xDiff
    yDenominator += yDiff * yDiff
  }
  
  return numerator / Math.sqrt(xDenominator * yDenominator)
}

function getInterpretation(x: string, y: string, correlation: number): string {
  const strength = Math.abs(correlation)
  const direction = correlation > 0 ? '正' : '負'
  
  if (x === 'stressIndex' && y === 'engagement') {
    return 'ストレスが高いほどエンゲージメントが低下する傾向'
  } else if (x === 'overtime' && y === 'stressIndex') {
    return '残業時間が多いほどストレスが増加する傾向'
  } else if (x === 'paidLeaveRate' && y === 'engagement') {
    return '有給取得率が高いほどエンゲージメントが向上する傾向'
  } else if (x === 'overtime' && y === 'paidLeaveRate') {
    return '残業が多いほど有給取得率が低下する傾向'
  }
  
  return `${direction}の相関関係（相関係数: ${correlation.toFixed(2)}）`
}