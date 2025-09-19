'use client'

import React from 'react'
import BreadcrumbBar from '@/components/navigation/BreadcrumbBar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
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
  TrendingUp, 
  Users, 
  Calendar,
  Brain,
  Target,
  AlertTriangle,
  Lightbulb
} from 'lucide-react'

export default function PredictiveAnalytics() {
  const demandForecast = [
    { month: '1月', actual: 145, predicted: 148, required: 150 },
    { month: '2月', actual: 143, predicted: 146, required: 148 },
    { month: '3月', actual: 150, predicted: 152, required: 155 },
    { month: '4月', actual: 155, predicted: 158, required: 160 },
    { month: '5月', actual: 152, predicted: 154, required: 157 },
    { month: '6月', predicted: 156, required: 158 },
    { month: '7月', predicted: 160, required: 162 },
    { month: '8月', predicted: 158, required: 161 },
    { month: '9月', predicted: 155, required: 158 },
    { month: '10月', predicted: 157, required: 159 },
    { month: '11月', predicted: 162, required: 165 },
    { month: '12月', predicted: 165, required: 168 }
  ]

  const absenteeismPrediction = [
    { day: '月', rate: 3.2, predicted: 3.5, risk: 'low' },
    { day: '火', rate: 2.8, predicted: 3.0, risk: 'low' },
    { day: '水', rate: 2.5, predicted: 2.7, risk: 'low' },
    { day: '木', rate: 3.0, predicted: 3.2, risk: 'low' },
    { day: '金', rate: 4.5, predicted: 4.8, risk: 'medium' },
    { day: '土', rate: 5.2, predicted: 5.5, risk: 'high' },
    { day: '日', rate: 5.0, predicted: 5.3, risk: 'high' }
  ]

  const skillDemandForecast = [
    { skill: '救急対応', current: 85, future3m: 90, future6m: 95, future12m: 100 },
    { skill: 'ICU管理', current: 70, future3m: 75, future6m: 80, future12m: 85 },
    { skill: '認知症ケア', current: 60, future3m: 65, future6m: 70, future12m: 80 },
    { skill: 'リハビリ', current: 75, future3m: 78, future6m: 82, future12m: 85 },
    { skill: '在宅医療', current: 50, future3m: 55, future6m: 65, future12m: 75 }
  ]

  const turnoverPrediction = {
    nextMonth: 3,
    next3Months: 8,
    next6Months: 15,
    highRiskStaff: [
      { name: '山田太郎', department: '内科', riskScore: 85, factors: ['労働時間超過', '昇進遅延'] },
      { name: '佐藤花子', department: '外科', riskScore: 78, factors: ['給与不満', 'キャリア停滞'] },
      { name: '鈴木一郎', department: '救急', riskScore: 72, factors: ['ワークライフバランス', 'チーム関係'] }
    ]
  }

  const recruitmentNeeds = {
    immediate: 5,
    threeMonths: 12,
    sixMonths: 20,
    byDepartment: [
      { department: '救急科', current: 20, optimal: 25, gap: 5 },
      { department: '内科', current: 35, optimal: 38, gap: 3 },
      { department: '外科', current: 28, optimal: 32, gap: 4 },
      { department: '看護部', current: 80, optimal: 88, gap: 8 }
    ]
  }

  const skillRadarData = [
    { skill: '臨床スキル', A: 80, B: 85 },
    { skill: 'IT活用', A: 60, B: 75 },
    { skill: 'コミュニケーション', A: 85, B: 88 },
    { skill: 'リーダーシップ', A: 70, B: 80 },
    { skill: '専門知識', A: 90, B: 92 },
    { skill: '適応力', A: 75, B: 85 }
  ]

  return (
    <div>
      <BreadcrumbBar />
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">予測的人員分析</h1>
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-500" />
          <span className="text-sm text-gray-600">AI予測モデル稼働中</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">来月の予測離職数</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{turnoverPrediction.nextMonth}名</div>
            <p className="text-xs text-muted-foreground">信頼度: 85%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">3ヶ月後必要人員</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{recruitmentNeeds.threeMonths}名</div>
            <p className="text-xs text-muted-foreground">現在の充足率: 92%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">週末欠勤予測</CardTitle>
            <Calendar className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5.4%</div>
            <p className="text-xs text-muted-foreground">通常比 +2.1%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">スキルギャップ</CardTitle>
            <Target className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15項目</div>
            <p className="text-xs text-muted-foreground">要強化スキル</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="demand" className="w-full">
        <TabsList>
          <TabsTrigger value="demand">需要予測</TabsTrigger>
          <TabsTrigger value="absence">欠勤予測</TabsTrigger>
          <TabsTrigger value="turnover">離職予測</TabsTrigger>
          <TabsTrigger value="skills">スキル需要</TabsTrigger>
        </TabsList>

        <TabsContent value="demand">
          <Card>
            <CardHeader>
              <CardTitle>人員需要予測（12ヶ月）</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={demandForecast}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="actual" stroke="#8884d8" name="実績" strokeWidth={2} />
                  <Line type="monotone" dataKey="predicted" stroke="#82ca9d" name="予測" strokeWidth={2} strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="required" stroke="#ff7300" name="必要人員" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Alert>
                  <TrendingUp className="h-4 w-4" />
                  <AlertDescription>
                    11月〜12月にかけて人員需要が増加する見込みです。早期の採用活動開始を推奨します。
                  </AlertDescription>
                </Alert>
                <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    季節性インフルエンザの流行期に向けて、医療スタッフの10%増員が必要と予測されます。
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="absence">
          <Card>
            <CardHeader>
              <CardTitle>曜日別欠勤率予測</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={absenteeismPrediction}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="rate" fill="#8884d8" name="実績欠勤率(%)" />
                  <Bar dataKey="predicted" fill="#82ca9d" name="予測欠勤率(%)" />
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-4 space-y-3">
                <h3 className="font-semibold">欠勤リスク要因分析</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm">高リスク日</h4>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>金曜日</span>
                        <Badge variant="secondary">4.8%</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>土曜日</span>
                        <Badge variant="destructive">5.5%</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>日曜日</span>
                        <Badge variant="destructive">5.3%</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm">主要因</h4>
                    <ul className="mt-2 text-sm space-y-1">
                      <li>• 週末の家族行事</li>
                      <li>• 疲労蓄積</li>
                      <li>• 夜勤明けの体調不良</li>
                    </ul>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm">対策提案</h4>
                    <ul className="mt-2 text-sm space-y-1">
                      <li>• フロート人員の増強</li>
                      <li>• インセンティブ導入</li>
                      <li>• シフト調整の柔軟化</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="turnover">
          <Card>
            <CardHeader>
              <CardTitle>離職リスク予測</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">1ヶ月以内</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-red-600">{turnoverPrediction.nextMonth}名</div>
                    <p className="text-sm text-gray-600">高リスク</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">3ヶ月以内</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-600">{turnoverPrediction.next3Months}名</div>
                    <p className="text-sm text-gray-600">中リスク含む</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">6ヶ月以内</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-yellow-600">{turnoverPrediction.next6Months}名</div>
                    <p className="text-sm text-gray-600">全リスク含む</p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">高リスクスタッフ</h3>
                {turnoverPrediction.highRiskStaff.map((staff, index) => (
                  <Alert key={index} variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex justify-between items-start">
                        <div>
                          <strong>{staff.name}</strong> ({staff.department})
                          <div className="text-sm mt-1">
                            リスク要因: {staff.factors.join('、')}
                          </div>
                        </div>
                        <Badge variant="destructive">リスクスコア: {staff.riskScore}</Badge>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle>スキル需要予測</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">スキル別必要人員推移</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={skillDemandForecast}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="skill" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="current" stackId="1" stroke="#8884d8" fill="#8884d8" name="現在" />
                      <Area type="monotone" dataKey="future3m" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="3ヶ月後" />
                      <Area type="monotone" dataKey="future6m" stackId="1" stroke="#ffc658" fill="#ffc658" name="6ヶ月後" />
                      <Area type="monotone" dataKey="future12m" stackId="1" stroke="#ff7c7c" fill="#ff7c7c" name="12ヶ月後" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">スキル充足度比較</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={skillRadarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="skill" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar name="現在のスキルレベル" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                      <Radar name="必要スキルレベル" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-2">重点強化スキル</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>• 認知症ケア: 今後12ヶ月で33%増の需要予測</div>
                  <div>• 在宅医療: 今後12ヶ月で50%増の需要予測</div>
                  <div>• IT活用能力: デジタル化推進により必須スキル化</div>
                  <div>• リーダーシップ: 管理職候補の育成が急務</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>採用必要数予測</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recruitmentNeeds.byDepartment.map((dept, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{dept.department}</h4>
                  <p className="text-sm text-gray-600">
                    現在: {dept.current}名 / 最適: {dept.optimal}名
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={dept.gap > 5 ? 'destructive' : 'secondary'}>
                    不足: {dept.gap}名
                  </Badge>
                  <div className="text-sm text-gray-600">
                    充足率: {((dept.current / dept.optimal) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}