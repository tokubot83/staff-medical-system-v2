'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  RadialBarChart,
  RadialBar
} from 'recharts'
import { 
  Users, 
  UserPlus,
  Globe,
  Heart,
  Award,
  TrendingUp,
  Target,
  Briefcase
} from 'lucide-react'

export default function DiversityInclusion() {
  const genderData = [
    { category: '男性', value: 45, color: '#3b82f6' },
    { category: '女性', value: 52, color: '#ec4899' },
    { category: 'その他', value: 3, color: '#8b5cf6' }
  ]

  const genderByPosition = [
    { position: '経営層', male: 70, female: 30, other: 0 },
    { position: '管理職', male: 55, female: 43, other: 2 },
    { position: '主任・リーダー', male: 48, female: 50, other: 2 },
    { position: '一般職員', male: 42, female: 55, other: 3 }
  ]

  const ageDistribution = [
    { range: '20-29歳', count: 35, percentage: 23.3 },
    { range: '30-39歳', count: 45, percentage: 30.0 },
    { range: '40-49歳', count: 38, percentage: 25.3 },
    { range: '50-59歳', count: 25, percentage: 16.7 },
    { range: '60歳以上', count: 7, percentage: 4.7 }
  ]

  const nationalityData = [
    { country: '日本', count: 135, percentage: 90 },
    { country: 'フィリピン', count: 5, percentage: 3.3 },
    { country: '中国', count: 3, percentage: 2 },
    { country: 'ベトナム', count: 3, percentage: 2 },
    { country: 'その他', count: 4, percentage: 2.7 }
  ]

  const disabilityEmployment = {
    current: 2.3,
    legal: 2.3,
    target: 2.5,
    trend: [
      { year: '2021', rate: 1.8 },
      { year: '2022', rate: 2.0 },
      { year: '2023', rate: 2.2 },
      { year: '2024', rate: 2.3 }
    ]
  }

  const inclusionMetrics = [
    { metric: '女性管理職比率', current: 43, target: 50, status: 'improving' },
    { metric: '外国人雇用率', current: 10, target: 15, status: 'stable' },
    { metric: '障がい者雇用率', current: 2.3, target: 2.5, status: 'improving' },
    { metric: '世代多様性指数', current: 75, target: 80, status: 'good' }
  ]

  const departmentDiversity = [
    { department: '看護部', diversity_score: 85 },
    { department: '医局', diversity_score: 65 },
    { department: '事務部', diversity_score: 78 },
    { department: 'リハビリ', diversity_score: 82 },
    { department: '薬剤部', diversity_score: 70 }
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">ダイバーシティ＆インクルージョン指標</h1>
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          <span className="text-sm text-gray-600">多様性推進中</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">女性比率</CardTitle>
            <Users className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">52%</div>
            <Progress value={52} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">業界平均: 48%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">女性管理職</CardTitle>
            <Briefcase className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">43%</div>
            <Progress value={43} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">目標: 50%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">外国人雇用</CardTitle>
            <Globe className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10%</div>
            <Progress value={10} max={15} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">5ヶ国から採用</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">障がい者雇用率</CardTitle>
            <UserPlus className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{disabilityEmployment.current}%</div>
            <Badge variant={disabilityEmployment.current >= disabilityEmployment.legal ? 'default' : 'destructive'}>
              法定雇用率達成
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="gender" className="w-full">
        <TabsList>
          <TabsTrigger value="gender">性別バランス</TabsTrigger>
          <TabsTrigger value="age">年齢多様性</TabsTrigger>
          <TabsTrigger value="culture">国籍・文化</TabsTrigger>
          <TabsTrigger value="disability">障がい者雇用</TabsTrigger>
        </TabsList>

        <TabsContent value="gender">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>全体の性別構成</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, value }) => `${category}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>職位別性別比率</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={genderByPosition}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="position" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="male" fill="#3b82f6" name="男性" stackId="a" />
                    <Bar dataKey="female" fill="#ec4899" name="女性" stackId="a" />
                    <Bar dataKey="other" fill="#8b5cf6" name="その他" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>性別多様性の推進施策</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">女性活躍推進</h4>
                  <ul className="text-sm space-y-1">
                    <li>• メンター制度の導入</li>
                    <li>• 育児支援制度の充実</li>
                    <li>• キャリア開発プログラム</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">男性の育児参加</h4>
                  <ul className="text-sm space-y-1">
                    <li>• 育児休業取得率: 35%</li>
                    <li>• 短時間勤務制度利用</li>
                    <li>• 在宅勤務の推進</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">LGBTQ+支援</h4>
                  <ul className="text-sm space-y-1">
                    <li>• 同性パートナー制度</li>
                    <li>• 相談窓口の設置</li>
                    <li>• 研修プログラム実施</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="age">
          <Card>
            <CardHeader>
              <CardTitle>年齢構成分布</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={ageDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="count" fill="#8884d8" name="人数" />
                  <Line yAxisId="right" type="monotone" dataKey="percentage" stroke="#82ca9d" name="割合(%)" strokeWidth={2} />
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2">年齢多様性の強み</h4>
                  <ul className="text-sm space-y-1">
                    <li>• ベテランと若手のバランスが良好</li>
                    <li>• 知識・技術の世代間継承が活発</li>
                    <li>• 各世代の強みを活かした協働</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold mb-2">世代別施策</h4>
                  <ul className="text-sm space-y-1">
                    <li>• 若手: キャリア開発支援</li>
                    <li>• 中堅: リーダーシップ研修</li>
                    <li>• シニア: 知識継承プログラム</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="culture">
          <Card>
            <CardHeader>
              <CardTitle>国籍・文化的多様性</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">国籍別構成</h3>
                  <div className="space-y-3">
                    {nationalityData.map((country, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-gray-500" />
                          <span>{country.country}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={country.percentage} className="w-24" />
                          <span className="text-sm font-medium w-12 text-right">{country.count}名</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">多文化共生の取り組み</h3>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium text-sm mb-1">言語サポート</h4>
                      <p className="text-sm text-gray-600">英語・中国語・ベトナム語での資料提供</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium text-sm mb-1">文化理解研修</h4>
                      <p className="text-sm text-gray-600">年4回の異文化理解ワークショップ開催</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium text-sm mb-1">宗教的配慮</h4>
                      <p className="text-sm text-gray-600">礼拝スペース・食事制限への対応</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disability">
          <Card>
            <CardHeader>
              <CardTitle>障がい者雇用状況</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">雇用率推移</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={disabilityEmployment.trend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis domain={[0, 3]} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="rate" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        name="雇用率(%)"
                      />
                      <Line 
                        type="monotone" 
                        dataKey={() => disabilityEmployment.legal} 
                        stroke="#ef4444" 
                        strokeDasharray="5 5"
                        name="法定雇用率"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">職場環境整備</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span>バリアフリー対応</span>
                      <Badge variant="default">完備</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span>支援機器導入</span>
                      <Badge variant="default">実施中</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span>ジョブコーチ配置</span>
                      <Badge variant="default">3名</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span>定着支援プログラム</span>
                      <Badge variant="default">運用中</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>部署別ダイバーシティスコア</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" data={departmentDiversity}>
              <RadialBar dataKey="diversity_score" cornerRadius={10} fill="#8884d8" label={{ position: 'insideStart', fill: '#fff' }} />
              <Legend />
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="mt-4 text-center text-sm text-gray-600">
            ※ダイバーシティスコア: 性別・年齢・国籍の多様性を総合的に評価（100点満点）
          </div>
        </CardContent>
      </Card>
    </div>
  )
}