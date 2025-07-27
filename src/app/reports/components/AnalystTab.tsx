'use client'

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Target, ChartBar, Users, Clock } from 'lucide-react'
import { StaffDetail } from '@/types/staff'
import { CorrelationAnalysis } from './analyst/CorrelationAnalysis'
import { RiskPrediction } from './analyst/RiskPrediction'
import { PredictiveModeling } from './analyst/PredictiveModeling'
import { ImprovementSuggestions } from './analyst/ImprovementSuggestions'

interface AnalystTabProps {
  staffData: StaffDetail[]
  facility: string
}

export function AnalystTab({ staffData, facility }: AnalystTabProps) {
  const [selectedAnalysis, setSelectedAnalysis] = useState('risk-prediction')

  // 統計サマリーの計算
  const statistics = useMemo(() => {
    const avgStress = staffData.reduce((sum, s) => sum + s.stressIndex, 0) / staffData.length
    const avgEngagement = staffData.reduce((sum, s) => sum + s.engagement, 0) / staffData.length
    const avgOvertime = staffData.reduce((sum, s) => sum + s.overtime, 0) / staffData.length
    const avgPaidLeaveRate = staffData.reduce((sum, s) => sum + s.paidLeaveRate, 0) / staffData.length

    // 高リスク職員の特定（ストレス指数70以上、エンゲージメント30以下）
    const highRiskStaff = staffData.filter(s => s.stressIndex >= 70 || s.engagement <= 30)

    return {
      avgStress: Math.round(avgStress),
      avgEngagement: Math.round(avgEngagement),
      avgOvertime: Math.round(avgOvertime),
      avgPaidLeaveRate: Math.round(avgPaidLeaveRate),
      highRiskCount: highRiskStaff.length,
      highRiskRate: Math.round((highRiskStaff.length / staffData.length) * 100)
    }
  }, [staffData])

  return (
    <div className="space-y-6">
      {/* 統計サマリー */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均ストレス指数</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.avgStress}</div>
            <p className="text-xs text-muted-foreground">
              全職員の平均値
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均エンゲージメント</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.avgEngagement}%</div>
            <p className="text-xs text-muted-foreground">
              組織への愛着度
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">高リスク職員</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.highRiskCount}名</div>
            <p className="text-xs text-muted-foreground">
              全体の{statistics.highRiskRate}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均残業時間</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.avgOvertime}時間</div>
            <p className="text-xs text-muted-foreground">
              月間平均
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 分析タイプ選択 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChartBar className="h-5 w-5" />
            離職要因分析
          </CardTitle>
          <CardDescription>
            AIと機械学習を活用した離職リスクの予測と要因分析
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedAnalysis} onValueChange={setSelectedAnalysis}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="risk-prediction">
                <AlertTriangle className="h-4 w-4 mr-2" />
                離職リスク予測
              </TabsTrigger>
              <TabsTrigger value="correlation">
                <TrendingUp className="h-4 w-4 mr-2" />
                相関分析
              </TabsTrigger>
              <TabsTrigger value="predictive">
                <Brain className="h-4 w-4 mr-2" />
                予測モデリング
              </TabsTrigger>
              <TabsTrigger value="suggestions">
                <Lightbulb className="h-4 w-4 mr-2" />
                改善提案
              </TabsTrigger>
            </TabsList>

            <TabsContent value="risk-prediction" className="mt-6">
              <RiskPrediction staffData={staffData} />
            </TabsContent>

            <TabsContent value="correlation" className="mt-6">
              <CorrelationAnalysis staffData={staffData} />
            </TabsContent>

            <TabsContent value="predictive" className="mt-6">
              <PredictiveModeling staffData={staffData} />
            </TabsContent>

            <TabsContent value="suggestions" className="mt-6">
              <ImprovementSuggestions staffData={staffData} statistics={statistics} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}