'use client'

import React from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
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
  Radar
} from 'recharts'
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  FileCheck,
  Clock,
  Users,
  Heart,
  Briefcase
} from 'lucide-react'

export default function ComplianceMetrics() {
  const overallCompliance = {
    score: 94.5,
    status: 'good',
    trend: 'improving'
  }

  const laborCompliance = [
    { category: '労働時間管理', compliance: 92, violations: 3 },
    { category: '休暇取得', compliance: 88, violations: 5 },
    { category: '残業時間', compliance: 85, violations: 8 },
    { category: '休憩時間', compliance: 95, violations: 2 },
    { category: '深夜勤務', compliance: 97, violations: 1 }
  ]

  const qualificationCompliance = [
    { department: '医局', required: 25, actual: 25, rate: 100 },
    { department: '看護部', required: 80, actual: 78, rate: 97.5 },
    { department: '薬剤部', required: 12, actual: 12, rate: 100 },
    { department: '検査部', required: 15, actual: 14, rate: 93.3 },
    { department: 'リハビリ', required: 20, actual: 20, rate: 100 }
  ]

  const safetyMetrics = {
    accidents: [
      { month: '1月', count: 2, rate: 0.013 },
      { month: '2月', count: 1, rate: 0.007 },
      { month: '3月', count: 3, rate: 0.020 },
      { month: '4月', count: 1, rate: 0.007 },
      { month: '5月', count: 2, rate: 0.013 }
    ],
    healthCheck: {
      eligible: 150,
      completed: 142,
      rate: 94.7,
      pending: 8
    }
  }

  const harassmentData = {
    reports: [
      { type: 'パワハラ', count: 3, resolved: 2, pending: 1 },
      { type: 'セクハラ', count: 1, resolved: 1, pending: 0 },
      { type: 'マタハラ', count: 0, resolved: 0, pending: 0 },
      { type: 'その他', count: 2, resolved: 1, pending: 1 }
    ],
    resolution: {
      average: 21, // days
      satisfaction: 85 // %
    }
  }

  const complianceRadar = [
    { area: '労働法規', score: 92 },
    { area: '安全衛生', score: 95 },
    { area: '資格管理', score: 97 },
    { area: 'ハラスメント', score: 88 },
    { area: '個人情報', score: 93 },
    { area: '医療法規', score: 96 }
  ]

  const recentViolations = [
    { date: '2024/05/15', type: '残業時間超過', department: '救急科', status: '改善中' },
    { date: '2024/05/10', type: '休憩時間不足', department: '看護部', status: '対応済' },
    { date: '2024/05/05', type: '資格更新遅延', department: '検査部', status: '対応中' }
  ]

  return (
    <div>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">コンプライアンス指標</h1>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-500" />
          <span className="text-sm text-gray-600">総合遵守率: {overallCompliance.score}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">労働法規遵守</CardTitle>
            <FileCheck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <Progress value={92} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">違反件数: 19件</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">資格充足率</CardTitle>
            <Briefcase className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">97.8%</div>
            <Badge variant="default">法定基準クリア</Badge>
            <p className="text-xs text-muted-foreground mt-1">不足: 3名</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">労災発生率</CardTitle>
            <Heart className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.013</div>
            <p className="text-xs text-muted-foreground">
              業界平均: 0.025
            </p>
            <Badge variant="default" className="mt-1">優良</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">健診受診率</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.7%</div>
            <Progress value={94.7} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">未受診: 8名</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="labor" className="w-full">
        <TabsList>
          <TabsTrigger value="labor">労働法規</TabsTrigger>
          <TabsTrigger value="qualification">資格要件</TabsTrigger>
          <TabsTrigger value="safety">安全衛生</TabsTrigger>
          <TabsTrigger value="harassment">ハラスメント</TabsTrigger>
        </TabsList>

        <TabsContent value="labor">
          <Card>
            <CardHeader>
              <CardTitle>労働法規遵守状況</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={laborCompliance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="compliance" fill="#10b981" name="遵守率(%)" />
                  <Bar yAxisId="right" dataKey="violations" fill="#ef4444" name="違反件数" />
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="font-semibold">主な違反事項</h3>
                  <div className="space-y-2">
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>残業時間超過:</strong> 月45時間超過者が8名
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>有給取得不足:</strong> 年5日未満取得者が5名
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold">改善施策</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>勤怠管理システムの自動アラート強化</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>管理職向けコンプライアンス研修実施</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>有給取得促進キャンペーン展開</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qualification">
          <Card>
            <CardHeader>
              <CardTitle>法定必要資格者配置状況</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={qualificationCompliance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="required" fill="#3b82f6" name="必要数" />
                  <Bar dataKey="actual" fill="#10b981" name="実際の配置数" />
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-6">
                <h3 className="font-semibold mb-3">資格別充足状況</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { name: '医師免許', required: 25, actual: 25, status: 'ok' },
                    { name: '看護師免許', required: 80, actual: 78, status: 'warning' },
                    { name: '薬剤師免許', required: 12, actual: 12, status: 'ok' },
                    { name: '臨床検査技師', required: 15, actual: 14, status: 'warning' },
                    { name: '理学療法士', required: 10, actual: 10, status: 'ok' },
                    { name: '作業療法士', required: 10, actual: 10, status: 'ok' }
                  ].map((qual, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">{qual.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{qual.actual}/{qual.required}</span>
                        <Badge variant={qual.status === 'ok' ? 'default' : 'secondary'}>
                          {qual.status === 'ok' ? '充足' : '不足'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="safety">
          <Card>
            <CardHeader>
              <CardTitle>安全衛生指標</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">労災発生状況</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={safetyMetrics.accidents}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="count" fill="#ef4444" name="発生件数" />
                      <Line yAxisId="right" type="monotone" dataKey="rate" stroke="#f59e0b" name="発生率" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">健康診断実施状況</h3>
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <ResponsiveContainer width={200} height={200}>
                        <PieChart>
                          <Pie
                            data={[
                              { name: '受診済', value: safetyMetrics.healthCheck.completed, fill: '#10b981' },
                              { name: '未受診', value: safetyMetrics.healthCheck.pending, fill: '#ef4444' }
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            dataKey="value"
                          >
                            {[0, 1].map((entry, index) => (
                              <Cell key={`cell-${index}`} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{safetyMetrics.healthCheck.rate}%</div>
                          <div className="text-sm text-gray-600">受診率</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>対象者数</span>
                      <span>{safetyMetrics.healthCheck.eligible}名</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>受診完了</span>
                      <span className="text-green-600">{safetyMetrics.healthCheck.completed}名</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>未受診</span>
                      <span className="text-red-600">{safetyMetrics.healthCheck.pending}名</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">労災防止対策</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <ul className="space-y-1">
                      <li>• 月次安全パトロール</li>
                      <li>• ヒヤリハット報告分析</li>
                      <li>• 安全教育研修</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">メンタルヘルス</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <ul className="space-y-1">
                      <li>• ストレスチェック実施</li>
                      <li>• 産業医面談: 月15件</li>
                      <li>• EAP相談窓口設置</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">職場環境</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <ul className="space-y-1">
                      <li>• 作業環境測定: 適正</li>
                      <li>• 感染対策: 実施中</li>
                      <li>• 休憩室整備: 完了</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="harassment">
          <Card>
            <CardHeader>
              <CardTitle>ハラスメント指標</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">相談・報告件数</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={harassmentData.reports}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#8b5cf6" name="報告件数" />
                      <Bar dataKey="resolved" fill="#10b981" name="解決済" />
                      <Bar dataKey="pending" fill="#f59e0b" name="対応中" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">対応状況</h3>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">平均解決日数</span>
                        <Badge>{harassmentData.resolution.average}日</Badge>
                      </div>
                      <Progress value={70} className="h-2" />
                      <p className="text-xs text-gray-600 mt-1">目標: 14日以内</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">相談者満足度</span>
                        <Badge variant="default">{harassmentData.resolution.satisfaction}%</Badge>
                      </div>
                      <Progress value={harassmentData.resolution.satisfaction} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-3">ハラスメント防止対策</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium mb-2">予防施策</h4>
                    <ul className="text-sm space-y-1">
                      <li>• 全職員向け研修（年2回）</li>
                      <li>• 管理職向け特別研修</li>
                      <li>• ポスター・リーフレット配布</li>
                      <li>• 相談窓口の周知徹底</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium mb-2">相談体制</h4>
                    <ul className="text-sm space-y-1">
                      <li>• 内部相談窓口（人事部）</li>
                      <li>• 外部相談窓口（弁護士）</li>
                      <li>• 匿名相談ホットライン</li>
                      <li>• オンライン相談システム</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>コンプライアンス総合評価</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={complianceRadar}>
              <PolarGrid />
              <PolarAngleAxis dataKey="area" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="遵守率" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>

          <div className="mt-6">
            <h3 className="font-semibold mb-3">最近の違反事例と対応状況</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">発生日</th>
                    <th className="text-left p-2">違反内容</th>
                    <th className="text-left p-2">部署</th>
                    <th className="text-left p-2">対応状況</th>
                  </tr>
                </thead>
                <tbody>
                  {recentViolations.map((violation, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{violation.date}</td>
                      <td className="p-2">{violation.type}</td>
                      <td className="p-2">{violation.department}</td>
                      <td className="p-2">
                        <Badge variant={violation.status === '対応済' ? 'default' : 'secondary'}>
                          {violation.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}