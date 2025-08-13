'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart3, TrendingUp, TrendingDown, Users, Award, 
  AlertCircle, Target, Calendar, Download, RefreshCw 
} from 'lucide-react'
import { 
  departmentAnalysisService, 
  type DepartmentMetrics, 
  type DepartmentComparison 
} from '@/services/departmentAnalysisService'

export default function DepartmentAnalysisReport() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('dept-1')
  const [departmentMetrics, setDepartmentMetrics] = useState<DepartmentMetrics | null>(null)
  const [comparison, setComparison] = useState<DepartmentComparison | null>(null)
  const [improvementPlan, setImprovementPlan] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    loadData()
  }, [selectedDepartment])

  const loadData = async () => {
    setLoading(true)
    try {
      const [metrics, comp, plan] = await Promise.all([
        departmentAnalysisService.getDepartmentMetrics(selectedDepartment),
        departmentAnalysisService.getDepartmentComparison(),
        departmentAnalysisService.generateImprovementPlan(selectedDepartment)
      ])
      setDepartmentMetrics(metrics)
      setComparison(comp)
      setImprovementPlan(plan)
    } catch (error) {
      console.error('Failed to load department data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600'
    if (score >= 70) return 'text-blue-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getProgressColor = (value: number, isReverse: boolean = false) => {
    const score = isReverse ? 100 - value : value
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-blue-500'
    if (score >= 40) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">部門別分析レポート</h2>
          <p className="text-gray-600 mt-1">部署別パフォーマンス分析と改善提案</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {comparison?.metrics.map(dept => (
                <SelectItem key={dept.departmentId} value={dept.departmentId}>
                  {dept.departmentName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={loadData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            更新
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            レポート出力
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="comparison">部門間比較</TabsTrigger>
          <TabsTrigger value="indicators">詳細指標</TabsTrigger>
          <TabsTrigger value="improvement">改善計画</TabsTrigger>
        </TabsList>

        {/* 概要タブ */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-600">総合評価スコア</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${getScoreColor(departmentMetrics?.averageScore || 0)}`}>
                  {departmentMetrics?.averageScore.toFixed(1)}点
                </div>
                <p className="text-xs text-gray-500 mt-1">100点満点</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-600">職員数</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {departmentMetrics?.staffCount}名
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  <Users className="h-3 w-3 inline mr-1" />
                  配属職員
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-600">評価完了率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${getScoreColor(departmentMetrics?.evaluationCompletionRate || 0)}`}>
                  {departmentMetrics?.evaluationCompletionRate.toFixed(0)}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className={`h-2 rounded-full ${getProgressColor(departmentMetrics?.evaluationCompletionRate || 0)}`}
                    style={{ width: `${departmentMetrics?.evaluationCompletionRate}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-600">研修受講率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${getScoreColor(departmentMetrics?.trainingCompletionRate || 0)}`}>
                  {departmentMetrics?.trainingCompletionRate.toFixed(0)}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className={`h-2 rounded-full ${getProgressColor(departmentMetrics?.trainingCompletionRate || 0)}`}
                    style={{ width: `${departmentMetrics?.trainingCompletionRate}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 強みと弱み */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  強み
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {departmentMetrics?.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
                  改善ポイント
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {departmentMetrics?.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-orange-600 mr-2">!</span>
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* 推奨アクション */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">推奨アクション</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {departmentMetrics?.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start p-3 bg-blue-50 rounded-lg">
                    <Badge className="mr-2 mt-1">{index + 1}</Badge>
                    <span className="text-sm">{rec}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 部門間比較タブ */}
        <TabsContent value="comparison">
          <div className="space-y-6">
            {/* 平均値との比較 */}
            <Card>
              <CardHeader>
                <CardTitle>全部門平均との比較</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">総合評価</span>
                      <span className="text-sm font-medium">
                        {departmentMetrics?.averageScore.toFixed(1)} / 平均: {comparison?.averages.score.toFixed(1)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 relative">
                      <div 
                        className="absolute h-3 bg-gray-400 rounded-full opacity-50"
                        style={{ width: `${comparison?.averages.score}%` }}
                      />
                      <div 
                        className={`absolute h-3 rounded-full ${getProgressColor(departmentMetrics?.averageScore || 0)}`}
                        style={{ width: `${departmentMetrics?.averageScore}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">エンゲージメント</span>
                      <span className="text-sm font-medium">
                        {departmentMetrics?.engagementScore.toFixed(1)} / 平均: {comparison?.averages.engagementScore.toFixed(1)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 relative">
                      <div 
                        className="absolute h-3 bg-gray-400 rounded-full opacity-50"
                        style={{ width: `${comparison?.averages.engagementScore}%` }}
                      />
                      <div 
                        className={`absolute h-3 rounded-full ${getProgressColor(departmentMetrics?.engagementScore || 0)}`}
                        style={{ width: `${departmentMetrics?.engagementScore}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">離職率</span>
                      <span className="text-sm font-medium">
                        {departmentMetrics?.turnoverRate.toFixed(1)}% / 平均: {comparison?.averages.turnoverRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 relative">
                      <div 
                        className="absolute h-3 bg-gray-400 rounded-full opacity-50"
                        style={{ width: `${(comparison?.averages.turnoverRate || 0) * 5}%` }}
                      />
                      <div 
                        className={`absolute h-3 rounded-full ${getProgressColor(departmentMetrics?.turnoverRate || 0, true)}`}
                        style={{ width: `${(departmentMetrics?.turnoverRate || 0) * 5}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ランキング表示 */}
            <Card>
              <CardHeader>
                <CardTitle>部門ランキング</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {['総合評価', '評価完了率', '研修受講率', 'エンゲージメント'].map(category => {
                    const rankings = comparison?.rankings.filter(r => r.category === category) || []
                    const currentRank = rankings.find(r => r.departmentId === selectedDepartment)
                    
                    return (
                      <div key={category} className="border rounded-lg p-4">
                        <h4 className="font-medium text-sm mb-3">{category}</h4>
                        <div className="space-y-2">
                          {rankings.slice(0, 3).map(rank => (
                            <div 
                              key={rank.departmentId}
                              className={`flex justify-between text-sm ${
                                rank.departmentId === selectedDepartment ? 'font-bold text-blue-600' : ''
                              }`}
                            >
                              <span className="flex items-center">
                                {rank.rank === 1 && <Award className="h-4 w-4 text-yellow-500 mr-1" />}
                                {rank.rank}位: {rank.departmentName}
                              </span>
                              <span>{rank.score.toFixed(1)}</span>
                            </div>
                          ))}
                          {currentRank && currentRank.rank > 3 && (
                            <div className="border-t pt-2 mt-2">
                              <div className="flex justify-between text-sm font-bold text-blue-600">
                                <span>{currentRank.rank}位: {currentRank.departmentName}</span>
                                <span>{currentRank.score.toFixed(1)}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 詳細指標タブ */}
        <TabsContent value="indicators">
          <Card>
            <CardHeader>
              <CardTitle>パフォーマンス指標詳細</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(departmentMetrics?.performanceIndicators || {}).map(([key, value]) => {
                  const labels: Record<string, string> = {
                    productivity: '生産性',
                    quality: '品質',
                    innovation: '革新性',
                    teamwork: 'チームワーク',
                    leadership: 'リーダーシップ'
                  }
                  
                  return (
                    <div key={key}>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{labels[key]}</span>
                        <span className={`font-bold ${getScoreColor(value)}`}>
                          {value.toFixed(1)}点
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                          className={`h-4 rounded-full ${getProgressColor(value)}`}
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* トレンドグラフ（簡易版） */}
              <div className="mt-8">
                <h4 className="font-medium mb-4">12ヶ月トレンド</h4>
                <div className="flex items-end justify-between h-32 px-2">
                  {departmentMetrics?.trends.map((trend, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className={`w-full mx-0.5 ${getProgressColor(trend.score)} rounded-t`}
                        style={{ height: `${(trend.score / 100) * 128}px` }}
                      />
                      {index % 3 === 0 && (
                        <span className="text-xs mt-1">{trend.month.slice(5)}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 改善計画タブ */}
        <TabsContent value="improvement">
          <div className="space-y-6">
            {/* タイムライン */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="bg-red-50">
                  <CardTitle className="text-lg flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    短期目標（1-3ヶ月）
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-2">
                    {improvementPlan?.shortTerm.map((item: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-red-600 mr-2">•</span>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="bg-yellow-50">
                  <CardTitle className="text-lg flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    中期目標（3-6ヶ月）
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-2">
                    {improvementPlan?.midTerm.map((item: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-yellow-600 mr-2">•</span>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="bg-green-50">
                  <CardTitle className="text-lg flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    長期目標（6-12ヶ月）
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-2">
                    {improvementPlan?.longTerm.map((item: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* KPI目標 */}
            <Card>
              <CardHeader>
                <CardTitle>KPI目標設定</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {improvementPlan?.kpis.map((kpi: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-medium text-sm mb-2">{kpi.name}</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>現在</span>
                          <span className="font-bold">{kpi.current}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>目標</span>
                          <span className="font-bold text-green-600">{kpi.target}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2 relative">
                          <div 
                            className="absolute h-2 bg-green-200 rounded-full"
                            style={{ width: `${kpi.target}%` }}
                          />
                          <div 
                            className="absolute h-2 bg-blue-500 rounded-full"
                            style={{ width: `${kpi.current}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}