'use client'

import React from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts'
import {
  Zap,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Activity,
  BarChart3
} from 'lucide-react'

export default function OrganizationalEfficiency() {
  const productivityData = [
    { department: '内科', productivity: 112, target: 100 },
    { department: '外科', productivity: 108, target: 100 },
    { department: '看護部', productivity: 95, target: 100 },
    { department: 'リハビリ', productivity: 103, target: 100 },
    { department: '事務部', productivity: 88, target: 100 },
    { department: '薬剤部', productivity: 105, target: 100 }
  ]

  const efficiencyTrend = [
    { month: '1月', efficiency: 92, productivity: 95, quality: 88 },
    { month: '2月', efficiency: 94, productivity: 96, quality: 90 },
    { month: '3月', efficiency: 96, productivity: 98, quality: 91 },
    { month: '4月', efficiency: 95, productivity: 97, quality: 93 },
    { month: '5月', efficiency: 98, productivity: 99, quality: 95 },
    { month: '6月', efficiency: 100, productivity: 102, quality: 96 }
  ]

  const workloadDistribution = [
    { task: '患者ケア', hours: 45, percentage: 56 },
    { task: '記録・文書', hours: 15, percentage: 19 },
    { task: '会議・ミーティング', hours: 8, percentage: 10 },
    { task: '研修・教育', hours: 5, percentage: 6 },
    { task: '管理業務', hours: 7, percentage: 9 }
  ]

  const urgentItems = [
    { id: 1, issue: '看護部の超過勤務増加', level: 'high', impact: '生産性低下', action: '人員配置見直し' },
    { id: 2, issue: '事務部の処理遅延', level: 'medium', impact: '業務停滞', action: 'プロセス改善' },
    { id: 3, issue: 'システムレスポンス低下', level: 'high', impact: '効率低下', action: 'システム更新' },
    { id: 4, issue: 'リハビリ予約の待機時間', level: 'medium', impact: '患者満足度', action: 'スケジュール最適化' }
  ]

  const processImprovements = [
    { process: '入院手続き', before: 45, after: 25, improvement: 44 },
    { process: '薬剤処方', before: 30, after: 15, improvement: 50 },
    { process: '検査予約', before: 20, after: 10, improvement: 50 },
    { process: '退院処理', before: 60, after: 35, improvement: 42 }
  ]

  const resourceUtilization = [
    { resource: '手術室', utilization: 78, optimal: 85 },
    { resource: '検査機器', utilization: 82, optimal: 80 },
    { resource: '会議室', utilization: 65, optimal: 70 },
    { resource: 'ベッド', utilization: 88, optimal: 85 }
  ]

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Zap className="h-8 w-8 text-blue-600" />
            組織効率分析
          </h1>
          <p className="text-gray-600 mt-2">
            労働生産性、業務効率、緊急対応事項を総合的に分析します
          </p>
        </div>

        {/* サマリーカード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">総合効率スコア</p>
                  <p className="text-2xl font-bold">96.5%</p>
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    +2.3%
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">労働生産性</p>
                  <p className="text-2xl font-bold">102.3</p>
                  <p className="text-xs text-gray-500 mt-1">指数 (基準:100)</p>
                </div>
                <Activity className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">緊急対応事項</p>
                  <p className="text-2xl font-bold">4件</p>
                  <p className="text-xs text-orange-600 mt-1">要対応</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">改善実施率</p>
                  <p className="text-2xl font-bold">87.5%</p>
                  <p className="text-xs text-gray-500 mt-1">月間目標達成</p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="productivity" className="space-y-6">
          <TabsList>
            <TabsTrigger value="productivity">労働生産性</TabsTrigger>
            <TabsTrigger value="efficiency">業務効率</TabsTrigger>
            <TabsTrigger value="urgent">緊急対応</TabsTrigger>
            <TabsTrigger value="improvement">改善状況</TabsTrigger>
          </TabsList>

          <TabsContent value="productivity" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    部門別生産性指数
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={productivityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="department" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="productivity" fill="#3b82f6" name="生産性" />
                      <Bar dataKey="target" fill="#e5e7eb" name="目標" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    効率性トレンド
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={efficiencyTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="efficiency" stroke="#3b82f6" name="効率性" />
                      <Line type="monotone" dataKey="productivity" stroke="#10b981" name="生産性" />
                      <Line type="monotone" dataKey="quality" stroke="#f59e0b" name="品質" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>業務時間配分</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workloadDistribution.map((task, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{task.task}</span>
                          <span className="text-sm text-gray-600">{task.hours}時間/週 ({task.percentage}%)</span>
                        </div>
                        <Progress value={task.percentage} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="efficiency" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>プロセス改善効果</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {processImprovements.map((process, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">{process.process}</span>
                          <Badge variant={process.improvement > 45 ? "default" : "secondary"}>
                            {process.improvement}%改善
                          </Badge>
                        </div>
                        <div className="flex gap-2 text-sm">
                          <div className="flex-1 bg-red-100 p-2 rounded">
                            <span className="text-red-700">改善前: {process.before}分</span>
                          </div>
                          <div className="flex-1 bg-green-100 p-2 rounded">
                            <span className="text-green-700">改善後: {process.after}分</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>リソース利用率</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={resourceUtilization}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="resource" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar name="現在" dataKey="utilization" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                      <Radar name="最適" dataKey="optimal" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="urgent" className="space-y-6">
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                現在4件の緊急対応事項があります。優先順位に従って対応してください。
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>緊急対応リスト</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {urgentItems.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{item.issue}</h4>
                            <Badge variant={item.level === 'high' ? 'destructive' : 'default'}>
                              {item.level === 'high' ? '高' : '中'}優先度
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">影響:</span>
                              <span className="ml-2">{item.impact}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">対応策:</span>
                              <span className="ml-2">{item.action}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="improvement" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>月別改善実施状況</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { month: '1月', planned: 12, completed: 10 },
                      { month: '2月', planned: 15, completed: 13 },
                      { month: '3月', planned: 18, completed: 16 },
                      { month: '4月', planned: 14, completed: 12 },
                      { month: '5月', planned: 16, completed: 14 },
                      { month: '6月', planned: 20, completed: 18 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="planned" fill="#e5e7eb" name="計画" />
                      <Bar dataKey="completed" fill="#3b82f6" name="実施" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>改善カテゴリ別実績</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'プロセス改善', value: 35 },
                          { name: 'システム改善', value: 25 },
                          { name: '人材配置', value: 20 },
                          { name: '設備更新', value: 15 },
                          { name: 'その他', value: 5 }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {COLORS.map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {[
                      { name: 'プロセス改善', value: 35, color: COLORS[0] },
                      { name: 'システム改善', value: 25, color: COLORS[1] },
                      { name: '人材配置', value: 20, color: COLORS[2] },
                      { name: '設備更新', value: 15, color: COLORS[3] },
                      { name: 'その他', value: 5, color: COLORS[4] }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                          <span>{item.name}</span>
                        </div>
                        <span className="font-medium">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}