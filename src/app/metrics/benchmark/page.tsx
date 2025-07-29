'use client'

import React from 'react'
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
  Cell
} from 'recharts'
import { 
  BarChart3,
  Target,
  TrendingUp,
  Award,
  Users,
  Building,
  Globe,
  Lightbulb
} from 'lucide-react'

export default function BenchmarkMetrics() {
  const industryComparison = [
    { metric: '離職率', ourValue: 8.5, industryAvg: 12.3, bestInClass: 6.2 },
    { metric: '人件費率', ourValue: 61.5, industryAvg: 63.8, bestInClass: 58.5 },
    { metric: '生産性指数', ourValue: 103, industryAvg: 100, bestInClass: 115 },
    { metric: '従業員満足度', ourValue: 80, industryAvg: 72, bestInClass: 88 },
    { metric: '研修投資率', ourValue: 2.8, industryAvg: 2.2, bestInClass: 3.5 }
  ]

  const regionalComparison = [
    { hospital: '当院', score: 82, rank: 3 },
    { hospital: 'A病院', score: 88, rank: 1 },
    { hospital: 'B病院', score: 85, rank: 2 },
    { hospital: 'C病院', score: 78, rank: 4 },
    { hospital: 'D病院', score: 75, rank: 5 },
    { hospital: 'E病院', score: 72, rank: 6 }
  ]

  const bestPractices = [
    { practice: '1on1ミーティング', adoption: 85, impact: 90, status: 'implemented' },
    { practice: 'フレックスタイム', adoption: 30, impact: 85, status: 'planning' },
    { practice: 'メンター制度', adoption: 70, impact: 88, status: 'implemented' },
    { practice: 'キャリアパス明確化', adoption: 60, impact: 92, status: 'partial' },
    { practice: '360度評価', adoption: 0, impact: 78, status: 'not_started' }
  ]

  const growthComparison = [
    { year: '2021', ourGrowth: 95, industryGrowth: 98 },
    { year: '2022', ourGrowth: 102, industryGrowth: 101 },
    { year: '2023', ourGrowth: 108, industryGrowth: 103 },
    { year: '2024', ourGrowth: 115, industryGrowth: 105 }
  ]

  const competitivePosition = [
    { dimension: '給与水準', score: 75 },
    { dimension: '福利厚生', score: 82 },
    { dimension: 'キャリア開発', score: 78 },
    { dimension: '職場環境', score: 85 },
    { dimension: 'ワークライフバランス', score: 72 },
    { dimension: '組織文化', score: 88 }
  ]

  const benchmarkGaps = [
    { area: '離職率', current: 8.5, benchmark: 6.2, gap: 2.3, priority: 'high' },
    { area: '生産性', current: 103, benchmark: 115, gap: -12, priority: 'high' },
    { area: '満足度', current: 80, benchmark: 88, gap: -8, priority: 'medium' },
    { area: '研修投資', current: 2.8, benchmark: 3.5, gap: -0.7, priority: 'medium' },
    { area: '人件費率', current: 61.5, benchmark: 58.5, gap: 3.0, priority: 'high' }
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">ベンチマーク指標</h1>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-500" />
          <span className="text-sm text-gray-600">総合ランク: 地域3位</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">業界順位</CardTitle>
            <Award className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">上位25%</div>
            <p className="text-xs text-muted-foreground">
              全国200施設中
            </p>
            <Badge variant="default" className="mt-1">優良</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">地域内順位</CardTitle>
            <Building className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3位/15施設</div>
            <Progress value={80} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">前年: 5位</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">成長率</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+15%</div>
            <p className="text-xs text-muted-foreground">
              業界平均: +5%
            </p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">業界トップクラス</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ベストプラクティス</CardTitle>
            <Lightbulb className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">60%</div>
            <p className="text-xs text-muted-foreground">
              導入率
            </p>
            <Progress value={60} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="industry" className="w-full">
        <TabsList>
          <TabsTrigger value="industry">業界比較</TabsTrigger>
          <TabsTrigger value="regional">地域比較</TabsTrigger>
          <TabsTrigger value="practices">ベストプラクティス</TabsTrigger>
          <TabsTrigger value="growth">成長率比較</TabsTrigger>
        </TabsList>

        <TabsContent value="industry">
          <Card>
            <CardHeader>
              <CardTitle>主要指標の業界比較</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={industryComparison}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="metric" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="ourValue" fill="#3b82f6" name="当院" />
                  <Bar dataKey="industryAvg" fill="#fbbf24" name="業界平均" />
                  <Bar dataKey="bestInClass" fill="#10b981" name="ベストインクラス" />
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold mb-2">強み（業界平均以上）</h3>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-center justify-between">
                      <span>離職率</span>
                      <Badge variant="default">8.5% (業界: 12.3%)</Badge>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>従業員満足度</span>
                      <Badge variant="default">80% (業界: 72%)</Badge>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>研修投資率</span>
                      <Badge variant="default">2.8% (業界: 2.2%)</Badge>
                    </li>
                  </ul>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h3 className="font-semibold mb-2">改善機会（ベストインクラスとの差）</h3>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-center justify-between">
                      <span>生産性指数</span>
                      <Badge variant="secondary">-12ポイント</Badge>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>従業員満足度</span>
                      <Badge variant="secondary">-8ポイント</Badge>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>人件費率</span>
                      <Badge variant="secondary">+3.0ポイント</Badge>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regional">
          <Card>
            <CardHeader>
              <CardTitle>地域内競合比較</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">総合スコアランキング</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={regionalComparison} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="hospital" type="category" />
                      <Tooltip />
                      <Bar dataKey="score" fill="#8884d8">
                        {regionalComparison.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.hospital === '当院' ? '#3b82f6' : '#e5e7eb'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">競争力分析</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={competitivePosition}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="dimension" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar name="競争力スコア" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-3">地域内でのポジショニング</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">強みエリア</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <ul className="space-y-1">
                        <li>• 組織文化（地域1位）</li>
                        <li>• 職場環境（地域2位）</li>
                        <li>• 福利厚生（地域3位）</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">平均的エリア</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <ul className="space-y-1">
                        <li>• キャリア開発（地域4位）</li>
                        <li>• 給与水準（地域5位）</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">課題エリア</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <ul className="space-y-1">
                        <li>• ワークライフバランス（地域7位）</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="practices">
          <Card>
            <CardHeader>
              <CardTitle>ベストプラクティス導入状況</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="adoption" name="導入率(%)" domain={[0, 100]} />
                  <YAxis dataKey="impact" name="効果" domain={[70, 100]} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="施策" data={bestPractices} fill="#8884d8">
                    {bestPractices.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={
                        entry.status === 'implemented' ? '#10b981' :
                        entry.status === 'partial' ? '#fbbf24' :
                        entry.status === 'planning' ? '#3b82f6' : '#ef4444'
                      } />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>

              <div className="mt-6">
                <h3 className="font-semibold mb-3">導入状況別分類</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-700 text-sm mb-2">導入済み</h4>
                    <ul className="text-xs space-y-1">
                      <li>• 1on1ミーティング</li>
                      <li>• メンター制度</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium text-yellow-700 text-sm mb-2">部分導入</h4>
                    <ul className="text-xs space-y-1">
                      <li>• キャリアパス明確化</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-700 text-sm mb-2">計画中</h4>
                    <ul className="text-xs space-y-1">
                      <li>• フレックスタイム</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <h4 className="font-medium text-red-700 text-sm mb-2">未着手</h4>
                    <ul className="text-xs space-y-1">
                      <li>• 360度評価</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Alert className="mt-6">
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>優先導入推奨:</strong> フレックスタイム制度は導入率30%ながら効果85%と高く、早期導入により競争優位性を獲得できます。
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="growth">
          <Card>
            <CardHeader>
              <CardTitle>成長率比較</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={growthComparison}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis domain={[90, 120]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="ourGrowth" stroke="#3b82f6" name="当院" strokeWidth={2} />
                  <Line type="monotone" dataKey="industryGrowth" stroke="#ef4444" name="業界平均" strokeWidth={2} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">成長要因分析</h3>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <Target className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <strong>人材投資の強化</strong>
                        <p className="text-gray-600">研修投資率2.8%（業界平均2.2%）</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <Users className="h-4 w-4 text-blue-500 mt-0.5" />
                      <div>
                        <strong>低離職率の維持</strong>
                        <p className="text-gray-600">8.5%（業界平均12.3%）</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <Globe className="h-4 w-4 text-purple-500 mt-0.5" />
                      <div>
                        <strong>多様性の推進</strong>
                        <p className="text-gray-600">女性管理職43%達成</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">今後の成長戦略</h3>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">1.</span>
                      <div>
                        <strong>生産性向上</strong>
                        <p className="text-gray-600">ベストインクラスとの12ポイント差を縮小</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">2.</span>
                      <div>
                        <strong>エンゲージメント強化</strong>
                        <p className="text-gray-600">従業員満足度88%を目標</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">3.</span>
                      <div>
                        <strong>イノベーション推進</strong>
                        <p className="text-gray-600">ベストプラクティス導入率80%へ</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>ベンチマークギャップ分析と改善計画</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {benchmarkGaps.map((gap, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{gap.area}</h4>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                    <span>現在: {gap.current}</span>
                    <span>ベンチマーク: {gap.benchmark}</span>
                    <span>差分: {gap.gap > 0 ? '+' : ''}{gap.gap}</span>
                  </div>
                </div>
                <Badge variant={
                  gap.priority === 'high' ? 'destructive' : 
                  gap.priority === 'medium' ? 'secondary' : 'default'
                }>
                  {gap.priority === 'high' ? '優先度: 高' : 
                   gap.priority === 'medium' ? '優先度: 中' : '優先度: 低'}
                </Badge>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2">ベンチマーク達成に向けたロードマップ</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-1">Phase 1 (0-6ヶ月)</h4>
                <ul className="space-y-1">
                  <li>• 生産性向上プロジェクト始動</li>
                  <li>• 離職防止策の強化</li>
                  <li>• コスト最適化の実施</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-1">Phase 2 (6-12ヶ月)</h4>
                <ul className="space-y-1">
                  <li>• ベストプラクティス導入加速</li>
                  <li>• エンゲージメント向上施策</li>
                  <li>• 研修投資の拡大</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-1">Phase 3 (12-18ヶ月)</h4>
                <ul className="space-y-1">
                  <li>• 地域トップポジション確立</li>
                  <li>• 全国上位10%入り</li>
                  <li>• 持続的成長基盤の確立</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}