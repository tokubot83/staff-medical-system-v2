'use client'

import React, { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AlertTriangle, TrendingDown, Users, Target } from 'lucide-react'
import { StaffDetail } from '@/app/data/staffData'

interface RiskPredictionProps {
  staffData: StaffDetail[]
}

interface RiskFactor {
  factor: string
  weight: number
  impact: 'high' | 'medium' | 'low'
  description: string
}

interface StaffRisk {
  staff: StaffDetail
  riskScore: number
  riskLevel: 'high' | 'medium' | 'low'
  factors: RiskFactor[]
}

export function RiskPrediction({ staffData }: RiskPredictionProps) {
  // 重回帰分析のシミュレーション（実際の実装では機械学習ライブラリを使用）
  const riskAnalysis = useMemo(() => {
    // 重回帰分析の係数（仮の値）
    const coefficients = {
      stressIndex: 0.35,
      engagement: -0.30,
      overtime: 0.25,
      paidLeaveRate: -0.15,
      tenure: -0.10,
      age: -0.05
    }

    // 各職員のリスクスコアを計算
    const staffRisks: StaffRisk[] = staffData.map(staff => {
      // 勤続年数を数値に変換（例: "3年9ヶ月" -> 3.75）
      const tenureYears = parseTenure(staff.tenure)
      
      // リスクファクターの計算
      const factors: RiskFactor[] = []
      
      if (staff.stressIndex >= 70) {
        factors.push({
          factor: '高ストレス',
          weight: coefficients.stressIndex,
          impact: 'high',
          description: `ストレス指数: ${staff.stressIndex}`
        })
      }
      
      if (staff.engagement <= 30) {
        factors.push({
          factor: '低エンゲージメント',
          weight: Math.abs(coefficients.engagement),
          impact: 'high',
          description: `エンゲージメント: ${staff.engagement}%`
        })
      }
      
      if (staff.overtime >= 45) {
        factors.push({
          factor: '長時間残業',
          weight: coefficients.overtime,
          impact: 'medium',
          description: `月間残業: ${staff.overtime}時間`
        })
      }
      
      if (staff.paidLeaveRate <= 40) {
        factors.push({
          factor: '低有給取得率',
          weight: Math.abs(coefficients.paidLeaveRate),
          impact: 'medium',
          description: `有給取得率: ${staff.paidLeaveRate}%`
        })
      }

      // リスクスコアの計算（0-100）
      const riskScore = Math.min(100, Math.max(0,
        (staff.stressIndex * coefficients.stressIndex) +
        ((100 - staff.engagement) * Math.abs(coefficients.engagement)) +
        (staff.overtime * coefficients.overtime) +
        ((100 - staff.paidLeaveRate) * Math.abs(coefficients.paidLeaveRate)) +
        (tenureYears < 1 ? 20 : 0) // 入社1年未満はリスク加算
      ))

      const riskLevel = riskScore >= 70 ? 'high' : riskScore >= 40 ? 'medium' : 'low'

      return {
        staff,
        riskScore: Math.round(riskScore),
        riskLevel,
        factors
      }
    })

    // リスクレベル別に分類
    const highRiskStaff = staffRisks.filter(r => r.riskLevel === 'high')
    const mediumRiskStaff = staffRisks.filter(r => r.riskLevel === 'medium')
    const lowRiskStaff = staffRisks.filter(r => r.riskLevel === 'low')

    // 部署別リスク分析
    const departmentRisks = calculateDepartmentRisks(staffRisks)

    return {
      staffRisks: staffRisks.sort((a, b) => b.riskScore - a.riskScore),
      highRiskStaff,
      mediumRiskStaff,
      lowRiskStaff,
      departmentRisks
    }
  }, [staffData])

  return (
    <div className="space-y-6">
      {/* リスク分布 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              高リスク
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {riskAnalysis.highRiskStaff.length}名
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              早急な対応が必要
            </p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-yellow-500" />
              中リスク
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {riskAnalysis.mediumRiskStaff.length}名
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              継続的な観察が必要
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-green-500" />
              低リスク
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {riskAnalysis.lowRiskStaff.length}名
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              安定した状態
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 高リスク職員リスト */}
      <Card>
        <CardHeader>
          <CardTitle>高リスク職員の詳細分析</CardTitle>
          <CardDescription>
            離職リスクが70%以上の職員と主要な要因
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {riskAnalysis.highRiskStaff.slice(0, 5).map((risk, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{risk.staff.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {risk.staff.department} / {risk.staff.position}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-600">
                      {risk.riskScore}%
                    </div>
                    <Badge variant="destructive">高リスク</Badge>
                  </div>
                </div>
                
                <Progress value={risk.riskScore} className="h-2" />
                
                <div className="grid gap-2 md:grid-cols-2">
                  {risk.factors.map((factor, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Badge 
                        variant={factor.impact === 'high' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {factor.factor}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {factor.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 部署別リスク分析 */}
      <Card>
        <CardHeader>
          <CardTitle>部署別リスク分析</CardTitle>
          <CardDescription>
            各部署の平均リスクスコアと高リスク職員の割合
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {riskAnalysis.departmentRisks.map((dept, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{dept.department}</div>
                    <div className="text-sm text-muted-foreground">
                      {dept.totalStaff}名中 {dept.highRiskCount}名が高リスク
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">平均リスク</div>
                    <div className="font-semibold">{dept.avgRiskScore}%</div>
                  </div>
                  <Progress value={dept.avgRiskScore} className="w-24 h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ヘルパー関数
function parseTenure(tenure: string): number {
  const match = tenure.match(/(\d+)年(?:(\d+)ヶ月)?/)
  if (!match) return 0
  const years = parseInt(match[1]) || 0
  const months = parseInt(match[2]) || 0
  return years + months / 12
}

function calculateDepartmentRisks(staffRisks: StaffRisk[]) {
  const departmentMap = new Map<string, {
    totalStaff: number
    totalRisk: number
    highRiskCount: number
  }>()

  staffRisks.forEach(risk => {
    const dept = risk.staff.department
    if (!departmentMap.has(dept)) {
      departmentMap.set(dept, { totalStaff: 0, totalRisk: 0, highRiskCount: 0 })
    }
    const deptData = departmentMap.get(dept)!
    deptData.totalStaff++
    deptData.totalRisk += risk.riskScore
    if (risk.riskLevel === 'high') {
      deptData.highRiskCount++
    }
  })

  return Array.from(departmentMap.entries())
    .map(([department, data]) => ({
      department,
      totalStaff: data.totalStaff,
      avgRiskScore: Math.round(data.totalRisk / data.totalStaff),
      highRiskCount: data.highRiskCount
    }))
    .sort((a, b) => b.avgRiskScore - a.avgRiskScore)
}