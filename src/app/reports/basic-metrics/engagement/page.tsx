'use client'

import React from 'react'
import BreadcrumbBar from '@/components/navigation/BreadcrumbBar'
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
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'
import { 
  Heart,
  Smile,
  TrendingUp,
  Users,
  Target,
  Award,
  ThumbsUp,
  MessageCircle,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'

export default function EngagementMetrics() {
  const satisfactionTrend = [
    { month: '1月', satisfaction: 72, eNPS: 15 },
    { month: '2月', satisfaction: 74, eNPS: 18 },
    { month: '3月', satisfaction: 76, eNPS: 22 },
    { month: '4月', satisfaction: 78, eNPS: 25 },
    { month: '5月', satisfaction: 80, eNPS: 28 }
  ]

  const engagementDrivers = [
    { driver: '仕事のやりがい', score: 82, importance: 'high' },
    { driver: '成長機会', score: 75, importance: 'high' },
    { driver: '職場の人間関係', score: 85, importance: 'high' },
    { driver: '給与・待遇', score: 68, importance: 'medium' },
    { driver: 'ワークライフバランス', score: 70, importance: 'high' },
    { driver: '経営への信頼', score: 78, importance: 'medium' }
  ]

  const departmentEngagement = [
    { department: '看護部', engagement: 82, trend: 'up' },
    { department: '医局', engagement: 75, trend: 'stable' },
    { department: '事務部', engagement: 78, trend: 'up' },
    { department: 'リハビリ', engagement: 85, trend: 'up' },
    { department: '薬剤部', engagement: 80, trend: 'stable' }
  ]

  const eNPSBreakdown = [
    { category: 'プロモーター', value: 38, color: '#10b981' },
    { category: 'パッシブ', value: 42, color: '#fbbf24' },
    { category: 'デトラクター', value: 20, color: '#ef4444' }
  ]

  const retentionIntent = {
    strong: 45,
    moderate: 35,
    weak: 15,
    leaving: 5
  }

  const motivationFactors = [
    { factor: '患者への貢献', current: 88, ideal: 95 },
    { factor: 'チーム協力', current: 82, ideal: 90 },
    { factor: 'スキル向上', current: 75, ideal: 85 },
    { factor: '評価・承認', current: 70, ideal: 85 },
    { factor: '自律性', current: 72, ideal: 80 },
    { factor: '目標達成', current: 78, ideal: 85 }
  ]

  const engagementActions = [
    { action: '1on1ミーティング', participation: 85, satisfaction: 90 },
    { action: 'キャリア面談', participation: 70, satisfaction: 88 },
    { action: 'チームビルディング', participation: 92, satisfaction: 95 },
    { action: '表彰制度', participation: 60, satisfaction: 92 }
  ]

  return (
    <div>
      <BreadcrumbBar />
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">エンゲージメント指標</h1>
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          <span className="text-sm text-gray-600">総合スコア: 80/100</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">従業員満足度</CardTitle>
            <Smile className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">80%</div>
            <Progress value={80} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">前月比 +2%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">eNPS</CardTitle>
            <ThumbsUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+28</div>
            <Badge variant="default" className="mt-1">良好</Badge>
            <p className="text-xs text-muted-foreground mt-1">業界平均: +15</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">継続勤務意向</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">80%</div>
            <p className="text-xs text-muted-foreground">
              3年以上の継続意向
            </p>
            <Progress value={80} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">モチベーション</CardTitle>
            <Award className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">上昇傾向</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="satisfaction" className="w-full">
        <TabsList>
          <TabsTrigger value="satisfaction">満足度推移</TabsTrigger>
          <TabsTrigger value="drivers">エンゲージメント要因</TabsTrigger>
          <TabsTrigger value="retention">定着意向</TabsTrigger>
          <TabsTrigger value="motivation">モチベーション</TabsTrigger>
        </TabsList>

        <TabsContent value="satisfaction">
          <Card>
            <CardHeader>
              <CardTitle>従業員満足度とeNPSの推移</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={satisfactionTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="satisfaction" stroke="#10b981" name="満足度(%)" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="eNPS" stroke="#3b82f6" name="eNPS" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>

              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">eNPS内訳</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={eNPSBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, value }) => `${category}: ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {eNPSBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">部署別エンゲージメント</h3>
                  <div className="space-y-3">
                    {departmentEngagement.map((dept, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{dept.department}</span>
                          {dept.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={dept.engagement} className="w-24" />
                          <span className="text-sm font-medium w-10">{dept.engagement}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drivers">
          <Card>
            <CardHeader>
              <CardTitle>エンゲージメントドライバー分析</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={engagementDrivers} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="driver" type="category" width={120} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#8b5cf6">
                    {engagementDrivers.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={
                        entry.importance === 'high' ? '#8b5cf6' : '#d8b4fe'
                      } />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold mb-2">強み（高スコア項目）</h3>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      職場の人間関係（85点）
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      仕事のやりがい（82点）
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      経営への信頼（78点）
                    </li>
                  </ul>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h3 className="font-semibold mb-2">改善領域（要注意項目）</h3>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      給与・待遇（68点）- 重要度:中
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      ワークライフバランス（70点）- 重要度:高
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      成長機会（75点）- 重要度:高
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retention">
          <Card>
            <CardHeader>
              <CardTitle>定着意向分析</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">継続勤務意向の分布</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">強い意向（5年以上）</span>
                      <div className="flex items-center gap-2">
                        <Progress value={retentionIntent.strong} className="w-32" />
                        <span className="text-sm font-medium w-10">{retentionIntent.strong}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">中程度（3-5年）</span>
                      <div className="flex items-center gap-2">
                        <Progress value={retentionIntent.moderate} className="w-32" />
                        <span className="text-sm font-medium w-10">{retentionIntent.moderate}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">弱い（1-3年）</span>
                      <div className="flex items-center gap-2">
                        <Progress value={retentionIntent.weak} className="w-32" />
                        <span className="text-sm font-medium w-10">{retentionIntent.weak}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-red-600">退職検討中</span>
                      <div className="flex items-center gap-2">
                        <Progress value={retentionIntent.leaving} className="w-32" />
                        <span className="text-sm font-medium w-10">{retentionIntent.leaving}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">定着向上のための重点施策</h3>
                  <div className="space-y-3">
                    <Alert>
                      <MessageCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>キャリア開発支援:</strong> 個別のキャリアパス相談と研修機会の拡充
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <Heart className="h-4 w-4" />
                      <AlertDescription>
                        <strong>ワークライフバランス:</strong> 柔軟な勤務体系と有給取得促進
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <Award className="h-4 w-4" />
                      <AlertDescription>
                        <strong>評価・承認文化:</strong> 日常的な感謝の表明と成果の可視化
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-3">世代別定着意向</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={[
                    { generation: '20代', retention: 65 },
                    { generation: '30代', retention: 75 },
                    { generation: '40代', retention: 85 },
                    { generation: '50代', retention: 90 },
                    { generation: '60代', retention: 95 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="generation" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="retention" fill="#10b981" name="定着意向(%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="motivation">
          <Card>
            <CardHeader>
              <CardTitle>モチベーション指標</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">モチベーション要因の現状vs理想</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={motivationFactors}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="factor" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar name="現状" dataKey="current" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                      <Radar name="理想" dataKey="ideal" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">エンゲージメント向上施策の効果</h3>
                  <div className="space-y-3">
                    {engagementActions.map((action, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{action.action}</span>
                          <Badge variant={action.satisfaction >= 90 ? 'default' : 'secondary'}>
                            満足度: {action.satisfaction}%
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          参加率: {action.participation}%
                        </div>
                        <Progress value={action.participation} className="mt-1" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold mb-2">今月のエンゲージメント向上事例</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <h4 className="font-medium">看護部チームビルディング</h4>
                    <p className="text-gray-600">参加率95%、満足度98%を達成</p>
                  </div>
                  <div>
                    <h4 className="font-medium">新人メンター制度導入</h4>
                    <p className="text-gray-600">新人の定着率が20%向上</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>エンゲージメント改善アクションプラン</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2 text-green-600">短期施策（1-3ヶ月）</h3>
                <ul className="text-sm space-y-1">
                  <li>• 1on1ミーティングの定期実施</li>
                  <li>• 感謝カード制度の導入</li>
                  <li>• 休憩室の環境改善</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2 text-blue-600">中期施策（3-6ヶ月）</h3>
                <ul className="text-sm space-y-1">
                  <li>• キャリア開発プログラム構築</li>
                  <li>• 柔軟な勤務制度の導入</li>
                  <li>• 評価制度の見直し</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2 text-purple-600">長期施策（6-12ヶ月）</h3>
                <ul className="text-sm space-y-1">
                  <li>• 組織文化の変革プロジェクト</li>
                  <li>• 給与体系の競争力強化</li>
                  <li>• 次世代リーダー育成</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}