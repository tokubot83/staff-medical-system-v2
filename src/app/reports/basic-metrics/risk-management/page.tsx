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
  AlertTriangle,
  TrendingUp,
  Shield,
  AlertCircle,
  CheckCircle,
  XCircle,
  Users,
  FileWarning,
  Activity
} from 'lucide-react'

export default function RiskManagement() {
  const turnoverRisk = [
    { name: '田中 太郎', department: '看護部', riskScore: 85, factors: '給与不満, 長時間労働', status: 'critical' },
    { name: '山田 花子', department: '医事課', riskScore: 72, factors: '成長機会不足', status: 'high' },
    { name: '佐藤 次郎', department: 'リハビリ', riskScore: 68, factors: '人間関係', status: 'high' },
    { name: '鈴木 美香', department: '薬剤部', riskScore: 55, factors: '通勤距離', status: 'medium' },
    { name: '高橋 健一', department: '内科', riskScore: 45, factors: '家族都合', status: 'low' }
  ]

  const complianceStatus = [
    { area: '労働時間管理', compliance: 92, issues: 3, trend: 'improving' },
    { area: '資格更新', compliance: 98, issues: 1, trend: 'stable' },
    { area: '安全衛生', compliance: 88, issues: 5, trend: 'declining' },
    { area: 'ハラスメント対策', compliance: 95, issues: 2, trend: 'improving' },
    { area: '個人情報保護', compliance: 99, issues: 0, trend: 'stable' }
  ]

  const watchList = [
    { id: 1, name: '山本 一郎', issue: '頻繁な遅刻', level: 'medium', duration: '2週間', action: '面談実施済' },
    { id: 2, name: '木村 洋子', issue: 'パフォーマンス低下', level: 'high', duration: '1ヶ月', action: '改善計画作成中' },
    { id: 3, name: '中村 太郎', issue: '同僚とのトラブル', level: 'high', duration: '3週間', action: 'メディエーション実施' },
    { id: 4, name: '渡辺 美希', issue: '長期病欠からの復帰', level: 'low', duration: '1週間', action: 'フォローアップ中' }
  ]

  const riskTrend = [
    { month: '1月', overall: 35, turnover: 40, compliance: 30, performance: 35 },
    { month: '2月', overall: 38, turnover: 42, compliance: 32, performance: 38 },
    { month: '3月', overall: 42, turnover: 45, compliance: 35, performance: 45 },
    { month: '4月', overall: 40, turnover: 43, compliance: 33, performance: 42 },
    { month: '5月', overall: 38, turnover: 41, compliance: 31, performance: 40 },
    { month: '6月', overall: 36, turnover: 39, compliance: 29, performance: 38 }
  ]

  const riskMatrix = [
    { impact: 5, probability: 5, risks: ['重大コンプライアンス違反'] },
    { impact: 5, probability: 4, risks: ['キーパーソン離職'] },
    { impact: 4, probability: 5, risks: ['労働災害'] },
    { impact: 4, probability: 4, risks: ['パワハラ訴訟'] },
    { impact: 3, probability: 4, risks: ['資格失効'] },
    { impact: 3, probability: 3, risks: ['一般職員離職'] },
    { impact: 2, probability: 3, risks: ['軽微な規則違反'] }
  ]

  const mitigationPlans = [
    { risk: 'キーパーソン離職', status: 'in_progress', completion: 65, owner: '人事部長' },
    { risk: '労働時間超過', status: 'in_progress', completion: 80, owner: '各部門長' },
    { risk: '安全衛生違反', status: 'planned', completion: 25, owner: '安全管理者' },
    { risk: 'ハラスメント', status: 'completed', completion: 100, owner: 'コンプライアンス委員会' }
  ]

  const COLORS = ['#ef4444', '#f59e0b', '#fbbf24', '#10b981', '#3b82f6']

  return (
    <div className="min-h-screen bg-gray-50">
      <BreadcrumbBar />

      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-orange-600" />
            リスク管理
          </h1>
          <p className="text-gray-600 mt-2">
            離職リスク、コンプライアンス、要注意職員の状況を総合的に管理します
          </p>
        </div>

        {/* リスクサマリー */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">総合リスクスコア</p>
                  <p className="text-2xl font-bold text-orange-600">36</p>
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 rotate-180" />
                    -2ポイント
                  </p>
                </div>
                <Shield className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">高リスク職員</p>
                  <p className="text-2xl font-bold">12名</p>
                  <p className="text-xs text-red-600 mt-1">要即時対応</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">コンプライアンス率</p>
                  <p className="text-2xl font-bold">94.2%</p>
                  <p className="text-xs text-gray-500 mt-1">11件の違反事項</p>
                </div>
                <FileWarning className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">監視対象者</p>
                  <p className="text-2xl font-bold">4名</p>
                  <p className="text-xs text-gray-500 mt-1">フォロー実施中</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="turnover" className="space-y-6">
          <TabsList>
            <TabsTrigger value="turnover">離職リスク</TabsTrigger>
            <TabsTrigger value="compliance">コンプライアンス</TabsTrigger>
            <TabsTrigger value="watch">要注意職員</TabsTrigger>
            <TabsTrigger value="matrix">リスクマトリックス</TabsTrigger>
          </TabsList>

          <TabsContent value="turnover" className="space-y-6">
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                現在12名の職員が高離職リスクと判定されています。早急な対応が必要です。
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>高リスク職員リスト</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {turnoverRisk.map((person, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="font-medium">{person.name}</span>
                            <span className="text-sm text-gray-600 ml-2">({person.department})</span>
                          </div>
                          <Badge variant={
                            person.status === 'critical' ? 'destructive' :
                            person.status === 'high' ? 'default' :
                            person.status === 'medium' ? 'secondary' : 'outline'
                          }>
                            リスク: {person.riskScore}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          要因: {person.factors}
                        </div>
                        <Progress
                          value={person.riskScore}
                          className="h-2 mt-2"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>離職リスク要因分析</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: '給与不満', value: 35 },
                          { name: '労働環境', value: 25 },
                          { name: '成長機会', value: 20 },
                          { name: '人間関係', value: 15 },
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
                      { name: '給与不満', value: 35, color: COLORS[0] },
                      { name: '労働環境', value: 25, color: COLORS[1] },
                      { name: '成長機会', value: 20, color: COLORS[2] },
                      { name: '人間関係', value: 15, color: COLORS[3] },
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

            <Card>
              <CardHeader>
                <CardTitle>リスクトレンド</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={riskTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="overall" stroke="#f59e0b" name="総合リスク" strokeWidth={2} />
                    <Line type="monotone" dataKey="turnover" stroke="#ef4444" name="離職リスク" />
                    <Line type="monotone" dataKey="compliance" stroke="#3b82f6" name="コンプライアンス" />
                    <Line type="monotone" dataKey="performance" stroke="#10b981" name="パフォーマンス" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>コンプライアンス状況</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {complianceStatus.map((area, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{area.area}</span>
                            {area.trend === 'improving' && <TrendingUp className="h-4 w-4 text-green-500" />}
                            {area.trend === 'declining' && <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={area.issues > 3 ? 'destructive' : area.issues > 0 ? 'secondary' : 'outline'}>
                              {area.issues}件
                            </Badge>
                            <span className="text-sm font-medium">{area.compliance}%</span>
                          </div>
                        </div>
                        <Progress value={area.compliance} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>違反事項詳細</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-900">労働時間超過</p>
                        <p className="text-sm text-red-700">看護部で月80時間超過が3件発生</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-900">安全衛生違反</p>
                        <p className="text-sm text-yellow-700">防護具未着用が5件報告</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900">資格更新遅延</p>
                        <p className="text-sm text-blue-700">1名の資格更新が期限切れ間近</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="watch" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>要注意職員リスト</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {watchList.map((person) => (
                    <div key={person.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{person.name}</h4>
                            <Badge variant={
                              person.level === 'high' ? 'destructive' :
                              person.level === 'medium' ? 'default' : 'secondary'
                            }>
                              {person.level === 'high' ? '高' : person.level === 'medium' ? '中' : '低'}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">問題:</span>
                              <span className="ml-2">{person.issue}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">継続期間:</span>
                              <span className="ml-2">{person.duration}</span>
                            </div>
                            <div className="col-span-2">
                              <span className="text-gray-600">対応状況:</span>
                              <span className="ml-2">{person.action}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>問題カテゴリ別分布</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={[
                      { category: '勤怠', count: 8 },
                      { category: 'パフォーマンス', count: 6 },
                      { category: '人間関係', count: 4 },
                      { category: '健康', count: 3 },
                      { category: 'その他', count: 2 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>フォローアップ状況</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>改善傾向</span>
                      </div>
                      <span className="font-bold text-green-700">5名</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-yellow-500" />
                        <span>観察継続</span>
                      </div>
                      <span className="font-bold text-yellow-700">12名</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        <span>悪化傾向</span>
                      </div>
                      <span className="font-bold text-red-700">3名</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="matrix" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>リスクマトリックス</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {[5, 4, 3, 2, 1].map((impact) => (
                    <React.Fragment key={impact}>
                      {[1, 2, 3, 4, 5].map((probability) => {
                        const risk = riskMatrix.find(r => r.impact === impact && r.probability === probability);
                        const riskLevel = impact * probability;
                        return (
                          <div
                            key={`${impact}-${probability}`}
                            className={`
                              p-2 border rounded text-center text-xs
                              ${riskLevel >= 20 ? 'bg-red-100 border-red-300' :
                                riskLevel >= 12 ? 'bg-orange-100 border-orange-300' :
                                riskLevel >= 6 ? 'bg-yellow-100 border-yellow-300' :
                                'bg-green-100 border-green-300'}
                            `}
                          >
                            {risk && risk.risks[0]}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
                <div className="mt-4 flex justify-between text-sm text-gray-600">
                  <span>← 発生確率: 低</span>
                  <span>発生確率: 高 →</span>
                </div>
                <div className="mt-2 flex items-center justify-center">
                  <span className="text-sm text-gray-600 -rotate-90 origin-center">影響度</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>リスク軽減計画</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mitigationPlans.map((plan, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-2">
                        <div>
                          <span className="font-medium">{plan.risk}</span>
                          <span className="text-sm text-gray-600 ml-2">({plan.owner})</span>
                        </div>
                        <Badge variant={
                          plan.status === 'completed' ? 'default' :
                          plan.status === 'in_progress' ? 'secondary' : 'outline'
                        }>
                          {plan.status === 'completed' ? '完了' :
                           plan.status === 'in_progress' ? '進行中' : '計画中'}
                        </Badge>
                      </div>
                      <Progress value={plan.completion} className="h-2" />
                      <span className="text-xs text-gray-600">{plan.completion}% 完了</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}