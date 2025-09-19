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
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Treemap
} from 'recharts'
import { 
  DollarSign,
  TrendingDown,
  TrendingUp,
  Calculator,
  AlertTriangle,
  PiggyBank,
  Users,
  Briefcase
} from 'lucide-react'

export default function CostAnalysis() {
  const laborCostRatio = [
    { month: '1月', ratio: 62.5, revenue: 12000, cost: 7500 },
    { month: '2月', ratio: 61.8, revenue: 12500, cost: 7725 },
    { month: '3月', ratio: 63.2, revenue: 11800, cost: 7458 },
    { month: '4月', ratio: 62.0, revenue: 13000, cost: 8060 },
    { month: '5月', ratio: 61.5, revenue: 13200, cost: 8118 }
  ]

  const costBreakdown = [
    { category: '基本給', amount: 5500, percentage: 67.7 },
    { category: '諸手当', amount: 1200, percentage: 14.8 },
    { category: '賞与', amount: 800, percentage: 9.8 },
    { category: '法定福利費', amount: 500, percentage: 6.2 },
    { category: 'その他', amount: 118, percentage: 1.5 }
  ]

  const recruitmentCost = [
    { source: '人材紹介', cost: 120, hires: 3, costPerHire: 40 },
    { source: '求人広告', cost: 45, hires: 5, costPerHire: 9 },
    { source: 'リファラル', cost: 10, hires: 4, costPerHire: 2.5 },
    { source: '直接応募', cost: 5, hires: 2, costPerHire: 2.5 },
    { source: '学校求人', cost: 20, hires: 6, costPerHire: 3.3 }
  ]

  const trainingInvestment = {
    budget: 500,
    spent: 380,
    byCategory: [
      { category: '新人研修', amount: 150, roi: 180 },
      { category: '専門スキル', amount: 120, roi: 250 },
      { category: 'リーダーシップ', amount: 80, roi: 150 },
      { category: '安全・コンプライアンス', amount: 30, roi: 100 }
    ]
  }

  const turnoverCost = [
    { position: '看護師', directCost: 80, indirectCost: 120, totalCost: 200 },
    { position: '医師', directCost: 200, indirectCost: 300, totalCost: 500 },
    { position: '技師', directCost: 60, indirectCost: 90, totalCost: 150 },
    { position: '事務職', directCost: 30, indirectCost: 45, totalCost: 75 }
  ]

  const costOptimization = [
    { area: '残業削減', current: 850, potential: 650, savings: 200 },
    { area: '離職率改善', current: 600, potential: 400, savings: 200 },
    { area: '採用効率化', current: 200, potential: 130, savings: 70 },
    { area: '研修最適化', current: 380, potential: 320, savings: 60 }
  ]

  const departmentCosts = [
    { name: '看護部', value: 4000, efficiency: 92 },
    { name: '医局', value: 2500, efficiency: 88 },
    { name: '事務部', value: 800, efficiency: 95 },
    { name: 'リハビリ', value: 600, efficiency: 90 },
    { name: 'その他', value: 218, efficiency: 85 }
  ]

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

  return (
    <div>
      <BreadcrumbBar />
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">コスト分析指標</h1>
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-500" />
          <span className="text-sm text-gray-600">人件費率: 61.5%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">月間人件費</CardTitle>
            <Calculator className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥8,118万</div>
            <p className="text-xs text-muted-foreground">
              前月比 +0.7%
            </p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-red-500" />
              <span className="text-xs text-red-600">要注意</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">採用コスト/人</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥10万</div>
            <p className="text-xs text-muted-foreground">
              業界平均: ¥15万
            </p>
            <Badge variant="default" className="mt-1">効率的</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">離職コスト</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥600万</div>
            <p className="text-xs text-muted-foreground">
              年間推定額
            </p>
            <Progress value={70} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">研修ROI</CardTitle>
            <Briefcase className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">168%</div>
            <p className="text-xs text-muted-foreground">
              投資対効果
            </p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">良好</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="ratio" className="w-full">
        <TabsList>
          <TabsTrigger value="ratio">人件費率</TabsTrigger>
          <TabsTrigger value="recruitment">採用コスト</TabsTrigger>
          <TabsTrigger value="training">教育投資</TabsTrigger>
          <TabsTrigger value="turnover">離職コスト</TabsTrigger>
        </TabsList>

        <TabsContent value="ratio">
          <Card>
            <CardHeader>
              <CardTitle>人件費率の推移と内訳</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">売上対人件費率</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={laborCostRatio}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="right" dataKey="revenue" fill="#10b981" name="売上(万円)" />
                      <Bar yAxisId="right" dataKey="cost" fill="#ef4444" name="人件費(万円)" />
                      <Line yAxisId="left" type="monotone" dataKey="ratio" stroke="#3b82f6" name="人件費率(%)" strokeWidth={2} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">人件費の内訳</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={costBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, percentage }) => `${category}: ${percentage}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="amount"
                      >
                        {costBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    人件費率が目標の60%を上回っています。業務効率化による削減が必要です。
                  </AlertDescription>
                </Alert>
                <Alert>
                  <PiggyBank className="h-4 w-4" />
                  <AlertDescription>
                    残業時間の削減により、月間200万円のコスト削減が可能です。
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recruitment">
          <Card>
            <CardHeader>
              <CardTitle>採用コスト分析</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={recruitmentCost}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="source" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="cost" fill="#3b82f6" name="総コスト(万円)" />
                  <Bar yAxisId="right" dataKey="costPerHire" fill="#10b981" name="一人当たり(万円)" />
                  <Line yAxisId="left" type="monotone" dataKey="hires" stroke="#ef4444" name="採用人数" strokeWidth={2} />
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-6">
                <h3 className="font-semibold mb-3">採用チャネル効率性</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-700">高効率</h4>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• リファラル採用: ¥2.5万/人</li>
                      <li>• 直接応募: ¥2.5万/人</li>
                      <li>• 学校求人: ¥3.3万/人</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium text-yellow-700">中効率</h4>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• 求人広告: ¥9万/人</li>
                      <li>• 転職フェア: ¥12万/人</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h4 className="font-medium text-red-700">低効率</h4>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• 人材紹介: ¥40万/人</li>
                      <li>• ヘッドハンティング: ¥50万/人</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">採用コスト削減提案</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>• リファラル採用の強化（紹介インセンティブ導入）</div>
                  <div>• 学校との連携強化（インターンシップ拡充）</div>
                  <div>• 採用ブランディングの向上（直接応募増加）</div>
                  <div>• 人材紹介の利用を特殊職種に限定</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training">
          <Card>
            <CardHeader>
              <CardTitle>教育投資とROI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">研修カテゴリ別投資額とROI</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={trainingInvestment.byCategory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="amount" fill="#8b5cf6" name="投資額(万円)" />
                      <Bar yAxisId="right" dataKey="roi" fill="#10b981" name="ROI(%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">研修投資の成果</h3>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">予算執行率</span>
                        <Badge>{(trainingInvestment.spent / trainingInvestment.budget * 100).toFixed(1)}%</Badge>
                      </div>
                      <Progress value={trainingInvestment.spent / trainingInvestment.budget * 100} />
                      <p className="text-sm text-gray-600 mt-1">
                        予算: ¥{trainingInvestment.budget}万 / 実績: ¥{trainingInvestment.spent}万
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">ROI上位プログラム</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between p-2 bg-green-50 rounded">
                          <span>専門スキル研修</span>
                          <span className="font-medium">ROI: 250%</span>
                        </div>
                        <div className="flex justify-between p-2 bg-green-50 rounded">
                          <span>新人研修</span>
                          <span className="font-medium">ROI: 180%</span>
                        </div>
                        <div className="flex justify-between p-2 bg-blue-50 rounded">
                          <span>リーダーシップ研修</span>
                          <span className="font-medium">ROI: 150%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold mb-2">教育投資の最適化方針</h3>
                <ul className="text-sm space-y-1">
                  <li>• 高ROIプログラムへの予算配分強化</li>
                  <li>• e-ラーニング導入による効率化（コスト30%削減見込み）</li>
                  <li>• 内部講師の活用拡大（外部講師費用50%削減）</li>
                  <li>• 効果測定の精緻化とPDCAサイクルの確立</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="turnover">
          <Card>
            <CardHeader>
              <CardTitle>離職コスト分析</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={turnoverCost}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="position" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="directCost" stackId="a" fill="#ef4444" name="直接コスト(万円)" />
                  <Bar dataKey="indirectCost" stackId="a" fill="#f59e0b" name="間接コスト(万円)" />
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">離職による損失内訳</h3>
                  <div className="space-y-2 text-sm">
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium mb-1">直接コスト</h4>
                      <ul className="space-y-1 text-gray-600">
                        <li>• 退職金・有給消化</li>
                        <li>• 採用コスト</li>
                        <li>• 研修コスト</li>
                      </ul>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium mb-1">間接コスト</h4>
                      <ul className="space-y-1 text-gray-600">
                        <li>• 生産性低下</li>
                        <li>• 業務引継ぎ</li>
                        <li>• チームの士気低下</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">年間離職コスト推計</h3>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <div className="text-3xl font-bold text-red-700">¥600万</div>
                    <p className="text-sm text-gray-600 mt-2">
                      年間離職者数: 12名<br/>
                      平均離職コスト: ¥50万/人
                    </p>
                  </div>
                  <Alert className="mt-3">
                    <TrendingDown className="h-4 w-4" />
                    <AlertDescription>
                      離職率を1%削減すると、年間¥150万のコスト削減が可能です。
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>コスト最適化の機会</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={costOptimization} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="area" type="category" width={80} />
              <Tooltip />
              <Legend />
              <Bar dataKey="current" fill="#ef4444" name="現在(万円)" />
              <Bar dataKey="potential" fill="#10b981" name="削減後(万円)" />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-6">
            <h3 className="font-semibold mb-3">部署別コスト構成</h3>
            <ResponsiveContainer width="100%" height={300}>
              <Treemap
                data={departmentCosts}
                dataKey="value"
                aspectRatio={4/3}
                stroke="#fff"
                fill="#8884d8"
              >
                <Tooltip />
              </Treemap>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2">総合コスト削減プラン</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-1">短期施策（削減見込み: ¥300万/年）</h4>
                <ul className="space-y-1">
                  <li>• 残業管理の徹底</li>
                  <li>• 採用チャネルの最適化</li>
                  <li>• 定型業務の効率化</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-1">中長期施策（削減見込み: ¥530万/年）</h4>
                <ul className="space-y-1">
                  <li>• 離職率の改善</li>
                  <li>• 業務プロセスの見直し</li>
                  <li>• IT化による自動化推進</li>
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