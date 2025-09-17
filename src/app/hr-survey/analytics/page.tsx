'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Download,
  TrendingUp,
  TrendingDown,
  Minus,
  Filter,
  FileText,
  Share2,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  AlertCircle
} from 'lucide-react'
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Treemap,
  Sankey
} from 'recharts'

// 総合満足度の経年変化
const satisfactionTrend = [
  { month: '2024年7月', score: 3.2, responses: 1050 },
  { month: '2024年8月', score: 3.3, responses: 1080 },
  { month: '2024年9月', score: 3.4, responses: 1120 },
  { month: '2024年10月', score: 3.5, responses: 1150 },
  { month: '2024年11月', score: 3.6, responses: 1180 },
  { month: '2024年12月', score: 3.7, responses: 1200 },
  { month: '2025年1月', score: 3.8, responses: 1230 }
]

// カテゴリ別満足度
const categoryScores = [
  { category: '職場環境', current: 3.8, previous: 3.5, change: 0.3 },
  { category: '人間関係', current: 4.2, previous: 4.1, change: 0.1 },
  { category: '業務量', current: 2.9, previous: 3.1, change: -0.2 },
  { category: '評価制度', current: 3.5, previous: 3.3, change: 0.2 },
  { category: '研修制度', current: 4.0, previous: 3.8, change: 0.2 },
  { category: '福利厚生', current: 3.7, previous: 3.7, change: 0 },
  { category: '給与待遇', current: 3.2, previous: 3.0, change: 0.2 },
  { category: '勤務時間', current: 3.1, previous: 3.2, change: -0.1 }
]

// 部署別×年代別クロス集計
const crossTabData = [
  { department: '内科', age20s: 3.5, age30s: 3.7, age40s: 3.9, age50s: 4.0 },
  { department: '外科', age20s: 3.3, age30s: 3.5, age40s: 3.7, age50s: 3.8 },
  { department: '看護部', age20s: 3.6, age30s: 3.8, age40s: 4.0, age50s: 4.1 },
  { department: '薬剤部', age20s: 3.8, age30s: 4.0, age40s: 4.1, age50s: 4.2 },
  { department: '事務部', age20s: 3.2, age30s: 3.4, age40s: 3.6, age50s: 3.7 }
]

// 自由記述のセンチメント分析
const sentimentAnalysis = [
  { category: 'ポジティブ', count: 245, percentage: 42 },
  { category: 'ニュートラル', count: 198, percentage: 34 },
  { category: 'ネガティブ', count: 140, percentage: 24 }
]

// よく出現するキーワード
const keywords = [
  { word: '残業', count: 89, sentiment: 'negative' },
  { word: '研修', count: 76, sentiment: 'positive' },
  { word: '人間関係', count: 65, sentiment: 'positive' },
  { word: '給与', count: 58, sentiment: 'negative' },
  { word: 'やりがい', count: 52, sentiment: 'positive' },
  { word: '休暇', count: 48, sentiment: 'neutral' },
  { word: '評価', count: 45, sentiment: 'neutral' },
  { word: 'サポート', count: 41, sentiment: 'positive' }
]

// 改善要望ランキング
const improvementRequests = [
  { item: '残業時間の削減', votes: 342, priority: 'high' },
  { item: '給与体系の見直し', votes: 298, priority: 'high' },
  { item: '休憩室の環境改善', votes: 234, priority: 'medium' },
  { item: '研修制度の充実', votes: 189, priority: 'medium' },
  { item: '人員配置の適正化', votes: 176, priority: 'high' },
  { item: '評価制度の透明化', votes: 165, priority: 'medium' },
  { item: '福利厚生の拡充', votes: 142, priority: 'low' },
  { item: 'ITシステムの改善', votes: 98, priority: 'low' }
]

const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444']

export default function SurveyAnalyticsPage() {
  const [selectedSurvey, setSelectedSurvey] = useState('2025年度 職員満足度調査')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-500" />
    return <Minus className="w-4 h-4 text-gray-500" />
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-50'
      case 'negative': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'outline'
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* ヘッダー */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">アンケート分析</h1>
          <p className="text-muted-foreground">
            {selectedSurvey} - 詳細分析レポート
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">週次</SelectItem>
              <SelectItem value="month">月次</SelectItem>
              <SelectItem value="quarter">四半期</SelectItem>
              <SelectItem value="year">年次</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            フィルター
          </Button>
          <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            共有
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            レポート出力
          </Button>
        </div>
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">総合満足度</p>
                <p className="text-2xl font-bold">3.8</p>
                <p className="text-xs text-green-600">+0.1 前月比</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">回答数</p>
              <p className="text-2xl font-bold">1,230</p>
              <p className="text-xs text-muted-foreground">98.4% 回答率</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">最高評価</p>
              <p className="text-lg font-bold">人間関係</p>
              <p className="text-xs text-green-600">4.2 / 5.0</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">要改善</p>
              <p className="text-lg font-bold">業務量</p>
              <p className="text-xs text-red-600">2.9 / 5.0</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">NPS</p>
              <p className="text-2xl font-bold">+12</p>
              <p className="text-xs text-green-600">+5 前回比</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* メインコンテンツ */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">総合分析</TabsTrigger>
          <TabsTrigger value="category">カテゴリ別</TabsTrigger>
          <TabsTrigger value="crosstab">クロス集計</TabsTrigger>
          <TabsTrigger value="sentiment">自由記述分析</TabsTrigger>
          <TabsTrigger value="improvement">改善提案</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>満足度推移</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={satisfactionTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      name="満足度スコア"
                    />
                    <Bar dataKey="responses" fill="#e9d5ff" name="回答数" yAxisId="right" />
                    <YAxis yAxisId="right" orientation="right" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>カテゴリ別スコア</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={categoryScores}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" />
                    <PolarRadiusAxis angle={90} domain={[0, 5]} />
                    <Radar
                      name="現在"
                      dataKey="current"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.6}
                    />
                    <Radar
                      name="前回"
                      dataKey="previous"
                      stroke="#94a3b8"
                      fill="#94a3b8"
                      fillOpacity={0.3}
                    />
                    <Tooltip />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="category" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>カテゴリ別詳細分析</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryScores.map((item) => (
                  <div key={item.category} className="border-b pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{item.category}</h4>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold">{item.current}</span>
                          <span className="text-sm text-muted-foreground">/ 5.0</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {getChangeIcon(item.change)}
                          <span className={`text-sm font-medium ${
                            item.change > 0 ? 'text-green-600' :
                            item.change < 0 ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {item.change > 0 && '+'}{item.change}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full"
                        style={{ width: `${(item.current / 5) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        前回: {item.previous}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        目標: 4.0
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crosstab" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>部署別×年代別 満足度</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={crossTabData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="age20s" fill="#8b5cf6" name="20代" />
                  <Bar dataKey="age30s" fill="#ec4899" name="30代" />
                  <Bar dataKey="age40s" fill="#3b82f6" name="40代" />
                  <Bar dataKey="age50s" fill="#10b981" name="50代" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sentiment" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>感情分析</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sentimentAnalysis}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ percentage }) => `${percentage}%`}
                    >
                      {sentimentAnalysis.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>

                <div className="mt-4 space-y-2">
                  {sentimentAnalysis.map((item) => (
                    <div key={item.category} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {item.category === 'ポジティブ' && <ThumbsUp className="w-4 h-4 text-green-500" />}
                        {item.category === 'ネガティブ' && <ThumbsDown className="w-4 h-4 text-red-500" />}
                        {item.category === 'ニュートラル' && <Minus className="w-4 h-4 text-gray-500" />}
                        <span>{item.category}</span>
                      </div>
                      <span className="font-semibold">{item.count}件</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>頻出キーワード</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {keywords.map((keyword) => (
                    <div key={keyword.word} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge className={getSentimentColor(keyword.sentiment)}>
                          {keyword.word}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {keyword.count}回
                        </span>
                      </div>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            keyword.sentiment === 'positive' ? 'bg-green-500' :
                            keyword.sentiment === 'negative' ? 'bg-red-500' : 'bg-gray-400'
                          }`}
                          style={{ width: `${(keyword.count / 100) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">AIによる要約</h4>
                  <p className="text-sm text-blue-800">
                    「研修制度」と「人間関係」に関するポジティブな意見が多く見られる一方、
                    「残業」と「給与」に関する改善要望が目立ちます。
                    特に若手職員から業務量の適正化を求める声が多く寄せられています。
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>代表的な意見</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <ThumbsUp className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                      <Badge variant="outline" className="mb-2">ポジティブ</Badge>
                      <p className="text-sm">
                        「最近導入された研修制度がとても充実していて、スキルアップに役立っています。
                        上司や同僚のサポートも手厚く、働きやすい環境だと感じています。」
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">看護部・30代</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <ThumbsDown className="w-5 h-5 text-red-600 mt-1" />
                    <div>
                      <Badge variant="outline" className="mb-2">ネガティブ</Badge>
                      <p className="text-sm">
                        「慢性的な人手不足で残業が常態化しています。
                        ワークライフバランスを改善するため、人員配置の見直しを検討していただきたいです。」
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">内科・20代</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="improvement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>改善要望ランキング</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {improvementRequests.map((item, index) => (
                  <div key={item.item} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{item.item}</p>
                        <p className="text-sm text-muted-foreground">{item.votes}票</p>
                      </div>
                    </div>
                    <Badge variant={getPriorityColor(item.priority)}>
                      {item.priority === 'high' ? '優先度高' :
                       item.priority === 'medium' ? '優先度中' : '優先度低'}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-amber-900 mb-2">アクションプラン</h4>
                    <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                      <li>残業時間削減：業務効率化プロジェクトチームを発足</li>
                      <li>給与体系：人事部にて見直し検討を開始</li>
                      <li>休憩室改善：来月中に改修工事を実施予定</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}