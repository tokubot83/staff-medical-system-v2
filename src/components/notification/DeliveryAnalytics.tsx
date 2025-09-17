'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  Users,
  Mail,
  MousePointer,
  Clock,
  Download,
  Filter,
  Calendar,
  BarChart3
} from 'lucide-react'

interface AnalyticsData {
  period: string
  sent: number
  opened: number
  clicked: number
  responded: number
}

interface CategoryAnalytics {
  category: string
  color: string
  sent: number
  openRate: number
  clickRate: number
  responseRate: number
}

interface DepartmentAnalytics {
  department: string
  staffCount: number
  openRate: number
  clickRate: number
  responseRate: number
  avgResponseTime: number
}

const mockTimeSeriesData: AnalyticsData[] = [
  { period: '1月1週', sent: 120, opened: 108, clicked: 85, responded: 62 },
  { period: '1月2週', sent: 95, opened: 89, clicked: 71, responded: 45 },
  { period: '1月3週', sent: 150, opened: 135, clicked: 110, responded: 88 },
  { period: '1月4週', sent: 78, opened: 72, clicked: 58, responded: 34 },
  { period: '2月1週', sent: 200, opened: 185, clicked: 142, responded: 95 },
  { period: '2月2週', sent: 85, opened: 80, clicked: 65, responded: 41 },
]

const mockCategoryData: CategoryAnalytics[] = [
  { category: '緊急', color: '#ef4444', sent: 45, openRate: 98, clickRate: 85, responseRate: 72 },
  { category: '面談', color: '#3b82f6', sent: 128, openRate: 87, clickRate: 65, responseRate: 89 },
  { category: '研修', color: '#8b5cf6', sent: 234, openRate: 92, clickRate: 78, responseRate: 45 },
  { category: 'アンケート', color: '#10b981', sent: 67, openRate: 76, clickRate: 58, responseRate: 67 },
  { category: '健康管理', color: '#f59e0b', sent: 89, openRate: 89, clickRate: 72, responseRate: 68 },
  { category: 'その他', color: '#6b7280', sent: 156, openRate: 65, clickRate: 42, responseRate: 23 }
]

const mockDepartmentData: DepartmentAnalytics[] = [
  { department: '看護部', staffCount: 350, openRate: 94, clickRate: 78, responseRate: 85, avgResponseTime: 2.3 },
  { department: '医師', staffCount: 85, openRate: 76, clickRate: 58, responseRate: 42, avgResponseTime: 4.7 },
  { department: '薬剤科', staffCount: 25, openRate: 88, clickRate: 72, responseRate: 68, avgResponseTime: 1.8 },
  { department: 'リハビリテーション科', staffCount: 45, openRate: 91, clickRate: 75, responseRate: 78, avgResponseTime: 2.1 },
  { department: '事務部', staffCount: 120, openRate: 82, clickRate: 65, responseRate: 55, avgResponseTime: 3.2 },
  { department: '検査科', staffCount: 18, openRate: 89, clickRate: 71, responseRate: 61, avgResponseTime: 2.5 },
]

const optimalTimingData = [
  { time: '8:00', rate: 65 },
  { time: '9:00', rate: 89 },
  { time: '10:00', rate: 94 },
  { time: '11:00', rate: 87 },
  { time: '12:00', rate: 45 },
  { time: '13:00', rate: 52 },
  { time: '14:00', rate: 78 },
  { time: '15:00', rate: 82 },
  { time: '16:00', rate: 76 },
  { time: '17:00', rate: 58 },
  { time: '18:00', rate: 34 },
]

export default function DeliveryAnalytics() {
  const [dateRange, setDateRange] = useState('last_30_days')
  const [selectedDepartment, setSelectedDepartment] = useState('all')

  const totalSent = mockTimeSeriesData.reduce((sum, item) => sum + item.sent, 0)
  const totalOpened = mockTimeSeriesData.reduce((sum, item) => sum + item.opened, 0)
  const totalClicked = mockTimeSeriesData.reduce((sum, item) => sum + item.clicked, 0)
  const totalResponded = mockTimeSeriesData.reduce((sum, item) => sum + item.responded, 0)

  const openRate = Math.round((totalOpened / totalSent) * 100)
  const clickRate = Math.round((totalClicked / totalSent) * 100)
  const responseRate = Math.round((totalResponded / totalSent) * 100)

  return (
    <div className="space-y-6">
      {/* ヘッダーエリア */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">配信分析</h2>
          <p className="text-gray-600">通知配信の効果を分析・改善に活用します</p>
        </div>

        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last_7_days">過去7日</SelectItem>
              <SelectItem value="last_30_days">過去30日</SelectItem>
              <SelectItem value="last_90_days">過去90日</SelectItem>
              <SelectItem value="this_month">今月</SelectItem>
              <SelectItem value="last_month">先月</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部署</SelectItem>
              <SelectItem value="nursing">看護部</SelectItem>
              <SelectItem value="doctor">医師</SelectItem>
              <SelectItem value="pharmacy">薬剤科</SelectItem>
              <SelectItem value="admin">事務部</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            レポート出力
          </Button>
        </div>
      </div>

      {/* KPI サマリー */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">総配信数</p>
                <p className="text-2xl font-bold text-gray-900">{totalSent.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">+12% 前月比</span>
                </div>
              </div>
              <Mail className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">開封率</p>
                <p className="text-2xl font-bold text-gray-900">{openRate}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">+5% 前月比</span>
                </div>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">クリック率</p>
                <p className="text-2xl font-bold text-gray-900">{clickRate}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-600">-2% 前月比</span>
                </div>
              </div>
              <MousePointer className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">回答率</p>
                <p className="text-2xl font-bold text-gray-900">{responseRate}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">+8% 前月比</span>
                </div>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* タブエリア */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">概要分析</TabsTrigger>
          <TabsTrigger value="category">カテゴリ別</TabsTrigger>
          <TabsTrigger value="department">部署別</TabsTrigger>
          <TabsTrigger value="timing">配信タイミング</TabsTrigger>
        </TabsList>

        {/* 概要分析タブ */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>配信実績推移</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={mockTimeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="sent" stackId="1" stroke="#3b82f6" fill="#3b82f6" name="配信数" />
                    <Area type="monotone" dataKey="opened" stackId="2" stroke="#10b981" fill="#10b981" name="開封数" />
                    <Area type="monotone" dataKey="clicked" stackId="3" stroke="#f59e0b" fill="#f59e0b" name="クリック数" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>効果指標推移</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockTimeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value: any, name: string) => [`${value}%`, name]} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey={(data: any) => Math.round((data.opened / data.sent) * 100)}
                      stroke="#10b981"
                      strokeWidth={2}
                      name="開封率"
                    />
                    <Line
                      type="monotone"
                      dataKey={(data: any) => Math.round((data.clicked / data.sent) * 100)}
                      stroke="#f59e0b"
                      strokeWidth={2}
                      name="クリック率"
                    />
                    <Line
                      type="monotone"
                      dataKey={(data: any) => Math.round((data.responded / data.sent) * 100)}
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      name="回答率"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* カテゴリ別分析タブ */}
        <TabsContent value="category" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>カテゴリ別配信数</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockCategoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, sent }) => `${category}: ${sent}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="sent"
                    >
                      {mockCategoryData.map((entry, index) => (
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
                <CardTitle>カテゴリ別効果率</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockCategoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value: any) => `${value}%`} />
                    <Legend />
                    <Bar dataKey="openRate" fill="#10b981" name="開封率" />
                    <Bar dataKey="clickRate" fill="#f59e0b" name="クリック率" />
                    <Bar dataKey="responseRate" fill="#8b5cf6" name="回答率" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>カテゴリ別詳細分析</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCategoryData.map((category) => (
                  <div key={category.category} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: category.color }}></div>
                      <span className="font-medium">{category.category}</span>
                      <Badge variant="outline">{category.sent}件配信</Badge>
                    </div>
                    <div className="flex gap-6 text-sm">
                      <div>
                        <span className="text-gray-600">開封率:</span>
                        <span className="font-medium ml-1">{category.openRate}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">クリック率:</span>
                        <span className="font-medium ml-1">{category.clickRate}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">回答率:</span>
                        <span className="font-medium ml-1">{category.responseRate}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 部署別分析タブ */}
        <TabsContent value="department" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>部署別パフォーマンス</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDepartmentData.map((dept) => (
                  <div key={dept.department} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{dept.department}</h4>
                        <Badge variant="outline">{dept.staffCount}名</Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        平均応答時間: {dept.avgResponseTime}時間
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>開封率</span>
                          <span>{dept.openRate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${dept.openRate}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>クリック率</span>
                          <span>{dept.clickRate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${dept.clickRate}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>回答率</span>
                          <span>{dept.responseRate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: `${dept.responseRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 配信タイミング分析タブ */}
        <TabsContent value="timing" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>時間別開封率</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={optimalTimingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value: any) => `${value}%`} />
                    <Bar dataKey="rate" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>推奨配信時間</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">最適配信時間</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>平日 午前:</span>
                      <span className="font-medium">9:00 - 11:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>平日 午後:</span>
                      <span className="font-medium">14:00 - 16:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>緊急通知:</span>
                      <span className="font-medium">即時配信推奨</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium text-yellow-800">避けるべき時間</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>昼休み:</span>
                      <span className="font-medium">12:00 - 13:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>業務終了後:</span>
                      <span className="font-medium">18:00以降</span>
                    </div>
                    <div className="flex justify-between">
                      <span>土日祝日:</span>
                      <span className="font-medium">開封率低下</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-800">配信頻度の推奨</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>緊急通知:</span>
                      <span className="font-medium">制限なし</span>
                    </div>
                    <div className="flex justify-between">
                      <span>一般通知:</span>
                      <span className="font-medium">週2-3回まで</span>
                    </div>
                    <div className="flex justify-between">
                      <span>アンケート:</span>
                      <span className="font-medium">月1-2回まで</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}