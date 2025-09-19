'use client'

import React, { useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Scatter,
  ScatterChart
} from 'recharts'
import { 
  Activity,
  Brain,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Zap,
  BarChart3
} from 'lucide-react'

export default function IntegratedAssessment() {
  const [selectedPattern, setSelectedPattern] = useState('kpi-dashboard')

  const kpiData = {
    financial: [
      { kpi: '売上高成長率', target: 5, actual: 7.2, status: 'good' },
      { kpi: '人件費率', target: 60, actual: 61.5, status: 'warning' },
      { kpi: '一人当たり売上', target: 700, actual: 680, status: 'warning' }
    ],
    customer: [
      { kpi: '患者満足度', target: 90, actual: 92, status: 'good' },
      { kpi: '待ち時間短縮', target: 15, actual: 18, status: 'warning' },
      { kpi: 'リピート率', target: 85, actual: 88, status: 'good' }
    ],
    internal: [
      { kpi: '業務効率', target: 95, actual: 92, status: 'warning' },
      { kpi: '品質スコア', target: 98, actual: 97, status: 'warning' },
      { kpi: 'コンプライアンス', target: 100, actual: 94.5, status: 'alert' }
    ],
    learning: [
      { kpi: '研修参加率', target: 90, actual: 85, status: 'warning' },
      { kpi: 'スキル向上率', target: 80, actual: 82, status: 'good' },
      { kpi: '従業員満足度', target: 85, actual: 80, status: 'warning' }
    ]
  }

  const predictiveAlerts = [
    { type: '離職リスク', level: 'high', message: '来月3名の高リスク者を検出', action: '面談実施推奨' },
    { type: '人員不足', level: 'medium', message: '3ヶ月後に看護部で5名不足予測', action: '採用活動開始' },
    { type: 'コスト超過', level: 'high', message: '残業代が予算を15%超過の見込み', action: '業務効率化必要' },
    { type: 'スキル不足', level: 'medium', message: '認知症ケアスキルが不足傾向', action: '研修計画立案' }
  ]

  const balancedScorecard = [
    { perspective: '財務', score: 75, weight: 25 },
    { perspective: '顧客', score: 88, weight: 25 },
    { perspective: '内部プロセス', score: 82, weight: 25 },
    { perspective: '学習と成長', score: 78, weight: 25 }
  ]

  const correlationData = [
    { x: 80, y: 92, name: '満足度vs定着率' },
    { x: 75, y: 88, name: '満足度vs定着率' },
    { x: 85, y: 95, name: '満足度vs定着率' },
    { x: 70, y: 82, name: '満足度vs定着率' },
    { x: 90, y: 97, name: '満足度vs定着率' }
  ]

  const healthScore = {
    overall: 82,
    dimensions: [
      { dimension: '人材', score: 85 },
      { dimension: 'プロセス', score: 78 },
      { dimension: '文化', score: 88 },
      { dimension: '成果', score: 80 },
      { dimension: 'イノベーション', score: 75 },
      { dimension: '持続可能性', score: 86 }
    ]
  }

  const renderPattern = () => {
    switch (selectedPattern) {
      case 'kpi-dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(kpiData).map(([category, kpis]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="text-sm capitalize">{category}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {kpis.map((kpi, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="truncate">{kpi.kpi}</span>
                        <Badge variant={
                          kpi.status === 'good' ? 'default' :
                          kpi.status === 'warning' ? 'secondary' : 'destructive'
                        }>
                          {kpi.actual}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>KPI達成状況トレンド</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={[
                    { month: '1月', 達成率: 85 },
                    { month: '2月', 達成率: 87 },
                    { month: '3月', 達成率: 82 },
                    { month: '4月', 達成率: 88 },
                    { month: '5月', 達成率: 86 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="達成率" stroke="#8b5cf6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )

      case 'predictive-alert':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {predictiveAlerts.map((alert, index) => (
                <Alert key={index} variant={alert.level === 'high' ? 'destructive' : 'default'}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-semibold">{alert.type}</div>
                    <div className="text-sm mt-1">{alert.message}</div>
                    <Button size="sm" variant="outline" className="mt-2">
                      {alert.action}
                    </Button>
                  </AlertDescription>
                </Alert>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>異常検知トレンド</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={[
                    { date: '1日', normal: 95, anomaly: 5 },
                    { date: '5日', normal: 92, anomaly: 8 },
                    { date: '10日', normal: 88, anomaly: 12 },
                    { date: '15日', normal: 90, anomaly: 10 },
                    { date: '20日', normal: 93, anomaly: 7 },
                    { date: '25日', normal: 91, anomaly: 9 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="normal" stackId="1" stroke="#10b981" fill="#10b981" name="正常" />
                    <Area type="monotone" dataKey="anomaly" stackId="1" stroke="#ef4444" fill="#ef4444" name="異常" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )

      case 'balanced-scorecard':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>バランススコアカード</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart data={balancedScorecard}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="perspective" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} />
                        <Radar name="スコア" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold">総合スコア: 81/100</h3>
                    {balancedScorecard.map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">{item.perspective}</span>
                          <span className="text-sm font-medium">{item.score}点</span>
                        </div>
                        <Progress value={item.score} />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>戦略マップ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-700 mb-2">財務の視点</h4>
                    <ul className="text-sm space-y-1">
                      <li>• 収益性向上</li>
                      <li>• コスト最適化</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-700 mb-2">顧客の視点</h4>
                    <ul className="text-sm space-y-1">
                      <li>• 患者満足度向上</li>
                      <li>• サービス品質</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-700 mb-2">内部プロセス</h4>
                    <ul className="text-sm space-y-1">
                      <li>• 業務効率化</li>
                      <li>• 品質管理強化</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-700 mb-2">学習と成長</h4>
                    <ul className="text-sm space-y-1">
                      <li>• 人材育成</li>
                      <li>• 組織能力向上</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'correlation-analysis':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>指標間相関分析</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="x" name="従業員満足度" domain={[60, 100]} />
                    <YAxis dataKey="y" name="定着率" domain={[70, 100]} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="相関" data={correlationData} fill="#8b5cf6" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">強い正の相関</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2">
                    <li className="flex justify-between">
                      <span>満足度 × 定着率</span>
                      <Badge>0.85</Badge>
                    </li>
                    <li className="flex justify-between">
                      <span>研修投資 × 生産性</span>
                      <Badge>0.78</Badge>
                    </li>
                    <li className="flex justify-between">
                      <span>エンゲージメント × 品質</span>
                      <Badge>0.82</Badge>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">負の相関</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2">
                    <li className="flex justify-between">
                      <span>残業時間 × 満足度</span>
                      <Badge variant="destructive">-0.72</Badge>
                    </li>
                    <li className="flex justify-between">
                      <span>離職率 × 生産性</span>
                      <Badge variant="destructive">-0.68</Badge>
                    </li>
                    <li className="flex justify-between">
                      <span>ストレス × パフォーマンス</span>
                      <Badge variant="destructive">-0.75</Badge>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 'health-score':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  組織健康度スコア
                  <div className="text-3xl font-bold text-green-600">{healthScore.overall}</div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={healthScore.dimensions}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="dimension" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="スコア" dataKey="score" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-green-700">健康な領域</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-1">
                    <li>• 文化（88点）</li>
                    <li>• 持続可能性（86点）</li>
                    <li>• 人材（85点）</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-yellow-700">要注意領域</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-1">
                    <li>• 成果（80点）</li>
                    <li>• プロセス（78点）</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-red-700">改善必要領域</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-1">
                    <li>• イノベーション（75点）</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">統合的指標アセスメント</h1>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-purple-500" />
          <span className="text-sm text-gray-600">統合分析システム</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
        <Button
          variant={selectedPattern === 'kpi-dashboard' ? 'default' : 'outline'}
          onClick={() => setSelectedPattern('kpi-dashboard')}
          className="justify-start"
        >
          <Activity className="h-4 w-4 mr-2" />
          統合KPI
        </Button>
        <Button
          variant={selectedPattern === 'predictive-alert' ? 'default' : 'outline'}
          onClick={() => setSelectedPattern('predictive-alert')}
          className="justify-start"
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          予測アラート
        </Button>
        <Button
          variant={selectedPattern === 'balanced-scorecard' ? 'default' : 'outline'}
          onClick={() => setSelectedPattern('balanced-scorecard')}
          className="justify-start"
        >
          <Target className="h-4 w-4 mr-2" />
          BSC
        </Button>
        <Button
          variant={selectedPattern === 'correlation-analysis' ? 'default' : 'outline'}
          onClick={() => setSelectedPattern('correlation-analysis')}
          className="justify-start"
        >
          <Brain className="h-4 w-4 mr-2" />
          相関分析
        </Button>
        <Button
          variant={selectedPattern === 'health-score' ? 'default' : 'outline'}
          onClick={() => setSelectedPattern('health-score')}
          className="justify-start"
        >
          <Zap className="h-4 w-4 mr-2" />
          健康度スコア
        </Button>
      </div>

      {renderPattern()}

      <Card>
        <CardHeader>
          <CardTitle>統合改善アクションプラン</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2 text-red-600">緊急対応（1週間以内）</h3>
              <ul className="text-sm space-y-1">
                <li>• 高離職リスク者との面談</li>
                <li>• 残業超過部署の業務見直し</li>
                <li>• コンプライアンス違反の是正</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2 text-yellow-600">短期対応（1ヶ月以内）</h3>
              <ul className="text-sm space-y-1">
                <li>• 採用活動の強化</li>
                <li>• 研修プログラムの実施</li>
                <li>• 業務プロセスの改善</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2 text-blue-600">中長期対応（3-6ヶ月）</h3>
              <ul className="text-sm space-y-1">
                <li>• 組織文化の変革</li>
                <li>• システム導入・自動化</li>
                <li>• 戦略的人材育成</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}