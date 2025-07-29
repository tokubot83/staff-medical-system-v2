'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ComposedChart
} from 'recharts'
import { 
  TrendingUp, 
  DollarSign,
  Clock,
  Target,
  Zap,
  Award,
  Users,
  Lightbulb
} from 'lucide-react'

export default function ProductivityMetrics() {
  const revenuePerEmployee = [
    { department: '外科', revenue: 850, target: 800, efficiency: 106.3 },
    { department: '内科', revenue: 720, target: 700, efficiency: 102.9 },
    { department: '救急', revenue: 680, target: 750, efficiency: 90.7 },
    { department: 'リハビリ', revenue: 520, target: 500, efficiency: 104.0 },
    { department: '検査', revenue: 450, target: 450, efficiency: 100.0 }
  ]

  const taskEfficiency = [
    { task: '外来診察', avgTime: 15, benchmark: 20, quality: 95 },
    { task: '入院処理', avgTime: 30, benchmark: 35, quality: 92 },
    { task: '検査実施', avgTime: 25, benchmark: 25, quality: 98 },
    { task: '書類作成', avgTime: 45, benchmark: 40, quality: 88 },
    { task: '引継ぎ', avgTime: 20, benchmark: 15, quality: 90 }
  ]

  const innovationMetrics = {
    suggestions: [
      { month: '1月', count: 12, implemented: 8, savings: 150 },
      { month: '2月', count: 15, implemented: 10, savings: 200 },
      { month: '3月', count: 18, implemented: 14, savings: 320 },
      { month: '4月', count: 20, implemented: 15, savings: 280 },
      { month: '5月', count: 16, implemented: 12, savings: 250 }
    ],
    byDepartment: [
      { department: '看護部', suggestions: 45, implementation: 80 },
      { department: '医局', suggestions: 28, implementation: 75 },
      { department: '事務部', suggestions: 35, implementation: 85 },
      { department: 'その他', suggestions: 20, implementation: 70 }
    ]
  }

  const productivityTrend = [
    { month: '1月', index: 95, patients: 1200, staff: 142 },
    { month: '2月', index: 98, patients: 1250, staff: 143 },
    { month: '3月', index: 102, patients: 1320, staff: 145 },
    { month: '4月', index: 105, patients: 1380, staff: 145 },
    { month: '5月', index: 103, patients: 1350, staff: 146 }
  ]

  const valueAnalysis = [
    { activity: '診療', value: 'high', time: 40, impact: 95 },
    { activity: '記録・書類', value: 'medium', time: 25, impact: 60 },
    { activity: '会議・打合せ', value: 'low', time: 15, impact: 40 },
    { activity: '移動・準備', value: 'low', time: 10, impact: 20 },
    { activity: '研修・学習', value: 'medium', time: 10, impact: 70 }
  ]

  const departmentProductivity = [
    { name: '外科', productivity: 112, trend: 'up' },
    { name: '内科', productivity: 105, trend: 'up' },
    { name: '救急', productivity: 98, trend: 'stable' },
    { name: 'リハビリ', productivity: 103, trend: 'up' },
    { name: '看護部', productivity: 108, trend: 'up' }
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">生産性指標</h1>
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          <span className="text-sm text-gray-600">総合生産性指数: 103</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">一人当たり売上</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥680万</div>
            <p className="text-xs text-muted-foreground">
              前年比 +8.5%
            </p>
            <Progress value={85} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">業務効率指標</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <Badge variant="default" className="mt-1">良好</Badge>
            <p className="text-xs text-muted-foreground mt-1">
              ベンチマーク比 +5%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">改善提案実施率</CardTitle>
            <Lightbulb className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75%</div>
            <p className="text-xs text-muted-foreground">
              月平均15件実施
            </p>
            <Progress value={75} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">付加価値率</CardTitle>
            <Award className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">
              高付加価値業務の割合
            </p>
            <Badge variant="secondary" className="mt-1">改善中</Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="w-full">
        <TabsList>
          <TabsTrigger value="revenue">一人当たり売上</TabsTrigger>
          <TabsTrigger value="efficiency">業務効率</TabsTrigger>
          <TabsTrigger value="innovation">イノベーション</TabsTrigger>
          <TabsTrigger value="value">付加価値分析</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>部署別一人当たり売上高</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={revenuePerEmployee}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="revenue" fill="#3b82f6" name="売上高(万円)" />
                  <Bar yAxisId="left" dataKey="target" fill="#e5e7eb" name="目標(万円)" />
                  <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="#10b981" name="効率性(%)" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold mb-2">高生産性部署の特徴</h3>
                  <ul className="text-sm space-y-1">
                    <li>• 業務の標準化・効率化が進んでいる</li>
                    <li>• チーム連携が円滑</li>
                    <li>• ITツールの活用度が高い</li>
                    <li>• 継続的な改善活動の実施</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold mb-2">生産性向上施策</h3>
                  <ul className="text-sm space-y-1">
                    <li>• RPA導入による定型業務の自動化</li>
                    <li>• 電子カルテシステムの最適化</li>
                    <li>• 業務フロー見直しプロジェクト</li>
                    <li>• スキルマップに基づく適正配置</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="efficiency">
          <Card>
            <CardHeader>
              <CardTitle>タスク別業務効率</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={taskEfficiency} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="task" type="category" width={80} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="avgTime" fill="#8b5cf6" name="平均時間(分)" />
                  <Bar dataKey="benchmark" fill="#e5e7eb" name="ベンチマーク(分)" />
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-6">
                <h3 className="font-semibold mb-3">業務品質スコア</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                  {taskEfficiency.map((task, index) => (
                    <div key={index} className="text-center p-3 border rounded-lg">
                      <div className="text-sm font-medium mb-2">{task.task}</div>
                      <div className="text-2xl font-bold text-blue-600">{task.quality}%</div>
                      <Progress value={task.quality} className="mt-2" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                <h3 className="font-semibold mb-2">効率化の重点領域</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-1">改善が必要な業務</h4>
                    <ul className="space-y-1">
                      <li className="text-red-600">• 書類作成: ベンチマーク比 -12.5%</li>
                      <li className="text-orange-600">• 引継ぎ: ベンチマーク比 -33.3%</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">効率的な業務</h4>
                    <ul className="space-y-1">
                      <li className="text-green-600">• 外来診察: ベンチマーク比 +25%</li>
                      <li className="text-green-600">• 入院処理: ベンチマーク比 +14.3%</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="innovation">
          <Card>
            <CardHeader>
              <CardTitle>イノベーション指標</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">改善提案の推移</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={innovationMetrics.suggestions}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="count" stroke="#8b5cf6" name="提案数" strokeWidth={2} />
                      <Line yAxisId="left" type="monotone" dataKey="implemented" stroke="#10b981" name="実施数" strokeWidth={2} />
                      <Bar yAxisId="right" dataKey="savings" fill="#fbbf24" name="削減額(万円)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">部署別改善活動</h3>
                  <div className="space-y-3">
                    {innovationMetrics.byDepartment.map((dept, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{dept.department}</div>
                          <div className="text-sm text-gray-600">提案数: {dept.suggestions}件</div>
                        </div>
                        <div className="text-right">
                          <Badge variant={dept.implementation >= 80 ? 'default' : 'secondary'}>
                            実施率: {dept.implementation}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <h3 className="font-semibold mb-2">今月の優秀改善事例</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="p-3 bg-white rounded border">
                    <h4 className="font-medium">検査予約システムの改善</h4>
                    <p className="text-gray-600 mt-1">待ち時間を平均15分短縮、患者満足度10%向上</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <h4 className="font-medium">薬剤在庫管理の自動化</h4>
                    <p className="text-gray-600 mt-1">月間20時間の業務削減、在庫精度99%達成</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="value">
          <Card>
            <CardHeader>
              <CardTitle>付加価値分析</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">業務時間配分と価値創出</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" name="時間配分(%)" />
                      <YAxis dataKey="impact" name="価値インパクト" />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Scatter name="業務" data={valueAnalysis} fill="#8884d8">
                        {valueAnalysis.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={
                            entry.value === 'high' ? '#10b981' :
                            entry.value === 'medium' ? '#fbbf24' : '#ef4444'
                          } />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">価値創出の最適化</h3>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-green-600">高付加価値業務</span>
                        <Badge variant="default">40%</Badge>
                      </div>
                      <div className="text-sm text-gray-600">診療、専門的ケア、患者対応</div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-yellow-600">中付加価値業務</span>
                        <Badge variant="secondary">35%</Badge>
                      </div>
                      <div className="text-sm text-gray-600">記録作成、研修、チーム連携</div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-red-600">低付加価値業務</span>
                        <Badge variant="outline">25%</Badge>
                      </div>
                      <div className="text-sm text-gray-600">移動、待機、定型作業</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-2">付加価値向上のアクションプラン</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <h4 className="font-medium mb-1">業務の再配分</h4>
                    <p className="text-gray-600">専門職は高付加価値業務に集中</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">自動化推進</h4>
                    <p className="text-gray-600">定型業務の60%をRPA化</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">スキルアップ</h4>
                    <p className="text-gray-600">多能工化による柔軟な対応</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>生産性トレンドと予測</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={productivityTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="index" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" name="生産性指数" />
            </AreaChart>
          </ResponsiveContainer>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-3">
            {departmentProductivity.map((dept, index) => (
              <div key={index} className="text-center p-3 border rounded-lg">
                <div className="text-sm font-medium">{dept.name}</div>
                <div className="text-2xl font-bold mt-1">{dept.productivity}</div>
                <div className="flex justify-center mt-2">
                  {dept.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <div className="h-4 w-4 bg-gray-400 rounded-full" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}