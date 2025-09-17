'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  Plus,
  Send,
  Eye,
  Download,
  Copy,
  MoreVertical,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  Activity,
  FileText,
  Calendar,
  Filter,
  Search
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
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

interface SurveyData {
  id: string
  title: string
  status: 'draft' | 'active' | 'closed' | 'scheduled'
  category: string
  createdDate: string
  startDate: string
  endDate: string
  responseCount: number
  targetCount: number
  responseRate: number
  lastActivity: string
  departments: string[]
  anonymous: boolean
}

// モックデータ
const mockSurveys: SurveyData[] = [
  {
    id: 'SV001',
    title: '2025年度 職員満足度調査',
    status: 'active',
    category: '満足度調査',
    createdDate: '2025-01-15',
    startDate: '2025-01-20',
    endDate: '2025-02-20',
    responseCount: 523,
    targetCount: 1250,
    responseRate: 41.8,
    lastActivity: '5分前',
    departments: ['内科', '外科', '看護部'],
    anonymous: true
  },
  {
    id: 'SV002',
    title: '健康経営に関する意識調査',
    status: 'active',
    category: '健康調査',
    createdDate: '2025-01-10',
    startDate: '2025-01-15',
    endDate: '2025-01-31',
    responseCount: 892,
    targetCount: 1250,
    responseRate: 71.4,
    lastActivity: '30分前',
    departments: ['全部署'],
    anonymous: false
  },
  {
    id: 'SV003',
    title: '新人研修効果測定アンケート',
    status: 'closed',
    category: '研修関連',
    createdDate: '2024-12-01',
    startDate: '2024-12-05',
    endDate: '2024-12-20',
    responseCount: 45,
    targetCount: 48,
    responseRate: 93.8,
    lastActivity: '1ヶ月前',
    departments: ['新人看護師'],
    anonymous: false
  },
  {
    id: 'SV004',
    title: '職場環境改善アンケート',
    status: 'scheduled',
    category: '職場環境',
    createdDate: '2025-01-18',
    startDate: '2025-02-01',
    endDate: '2025-02-28',
    responseCount: 0,
    targetCount: 850,
    responseRate: 0,
    lastActivity: '作成済み',
    departments: ['病棟部門'],
    anonymous: true
  }
]

// 回答推移データ
const responseTimeline = [
  { date: '1/15', responses: 45 },
  { date: '1/16', responses: 78 },
  { date: '1/17', responses: 120 },
  { date: '1/18', responses: 95 },
  { date: '1/19', responses: 110 },
  { date: '1/20', responses: 75 }
]

// 部署別回答率データ
const departmentResponse = [
  { department: '内科', rate: 78 },
  { department: '外科', rate: 65 },
  { department: '看護部', rate: 82 },
  { department: '薬剤部', rate: 91 },
  { department: '事務部', rate: 45 },
  { department: 'リハビリ', rate: 73 }
]

// 満足度データ（サンプル）
const satisfactionData = [
  { category: '職場環境', score: 3.8 },
  { category: '人間関係', score: 4.2 },
  { category: '業務量', score: 2.9 },
  { category: '評価制度', score: 3.5 },
  { category: '研修制度', score: 4.0 },
  { category: '福利厚生', score: 3.7 }
]

export default function SurveyDashboard() {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState('active')
  const [surveys, setSurveys] = useState<SurveyData[]>(mockSurveys)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return '実施中'
      case 'scheduled': return '予定'
      case 'closed': return '終了'
      case 'draft': return '下書き'
      default: return status
    }
  }

  const filteredSurveys = surveys.filter(survey => {
    if (selectedTab === 'all') return true
    return survey.status === selectedTab
  })

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">アンケート管理</h1>
          <p className="text-muted-foreground">
            職員向けアンケートの作成・配信・集計を管理します
          </p>
        </div>
        <Button onClick={() => router.push('/hr-survey/create')}>
          <Plus className="w-4 h-4 mr-2" />
          新規アンケート作成
        </Button>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">実施中</p>
                <p className="text-2xl font-bold">
                  {surveys.filter(s => s.status === 'active').length}
                </p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">今月の回答数</p>
                <p className="text-2xl font-bold">1,415</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">平均回答率</p>
                <p className="text-2xl font-bold">68.7%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">予定</p>
                <p className="text-2xl font-bold">
                  {surveys.filter(s => s.status === 'scheduled').length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* メインコンテンツ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* アンケート一覧 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>アンケート一覧</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Search className="w-4 h-4 mr-2" />
                    検索
                  </Button>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    フィルター
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="all">すべて</TabsTrigger>
                  <TabsTrigger value="active">実施中</TabsTrigger>
                  <TabsTrigger value="scheduled">予定</TabsTrigger>
                  <TabsTrigger value="closed">終了</TabsTrigger>
                  <TabsTrigger value="draft">下書き</TabsTrigger>
                </TabsList>

                <div className="space-y-3">
                  {filteredSurveys.map((survey) => (
                    <Card key={survey.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{survey.title}</h3>
                              {survey.anonymous && (
                                <Badge variant="secondary" className="text-xs">
                                  匿名
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {survey.startDate} - {survey.endDate}
                              </span>
                              <span className="flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                {survey.category}
                              </span>
                            </div>

                            {survey.status === 'active' && (
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>回答率</span>
                                  <span className="font-medium">
                                    {survey.responseCount} / {survey.targetCount} ({survey.responseRate}%)
                                  </span>
                                </div>
                                <Progress value={survey.responseRate} className="h-2" />
                              </div>
                            )}

                            <div className="flex items-center gap-2 mt-3">
                              <Badge className={getStatusColor(survey.status)}>
                                {getStatusLabel(survey.status)}
                              </Badge>
                              {survey.departments.slice(0, 2).map((dept) => (
                                <Badge key={dept} variant="outline" className="text-xs">
                                  {dept}
                                </Badge>
                              ))}
                              {survey.departments.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{survey.departments.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => router.push(`/hr-survey/${survey.id}`)}>
                                <Eye className="w-4 h-4 mr-2" />
                                詳細を見る
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <BarChart3 className="w-4 h-4 mr-2" />
                                集計結果
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="w-4 h-4 mr-2" />
                                複製
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Download className="w-4 h-4 mr-2" />
                                エクスポート
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {survey.status === 'active' && (
                          <div className="flex items-center justify-between mt-4 pt-4 border-t">
                            <span className="text-xs text-muted-foreground">
                              最終更新: {survey.lastActivity}
                            </span>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Send className="w-3 h-3 mr-1" />
                                リマインド送信
                              </Button>
                              <Button size="sm">
                                集計を見る
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* リアルタイム分析 */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">回答推移（直近7日間）</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={responseTimeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="responses"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">部署別回答率</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {departmentResponse.map((dept) => (
                  <div key={dept.department}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{dept.department}</span>
                      <span className="font-medium">{dept.rate}%</span>
                    </div>
                    <Progress value={dept.rate} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">満足度スコア（最新）</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={satisfactionData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" />
                  <PolarRadiusAxis angle={90} domain={[0, 5]} />
                  <Radar
                    name="スコア"
                    dataKey="score"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">クイックアクション</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                新規アンケート作成
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Send className="w-4 h-4 mr-2" />
                リマインダー一括送信
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                月次レポート生成
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                詳細分析画面へ
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}