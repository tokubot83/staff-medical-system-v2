'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  FlaskConical,
  Users,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  BarChart3,
  Target,
  Award,
  Plus,
} from 'lucide-react';
import { ABTestConfig, ABTestResults } from '@/types/masterData';

export default function ABTestPanel() {
  const [activeTests, setActiveTests] = useState<ABTestConfig[]>([]);
  const [selectedTest, setSelectedTest] = useState<ABTestConfig | null>(null);
  const [showNewTestDialog, setShowNewTestDialog] = useState(false);
  const [newTest, setNewTest] = useState({
    name: '',
    description: '',
    duration: 30,
    variantA: '',
    variantB: '',
    targetType: 'department',
    targetDepartments: [] as string[],
  });

  // デモ用のテストデータ
  const mockTests: ABTestConfig[] = [
    {
      id: 'TEST_001',
      testName: 'リハビリ科新評価制度テスト',
      description: 'リハビリテーション科で新しい評価配点をテスト',
      status: 'running',
      startDate: '2024-04-01',
      endDate: '2024-04-30',
      createdBy: '人事部長',
      createdAt: '2024-03-20',
      variants: [
        {
          variantId: 'A',
          variantName: 'A',
          systemId: 'SYS_2024',
          systemName: '現行制度（技術50:貢献50）',
          targetGroups: [
            { type: 'department', ids: ['DEPT_001A'] }
          ],
          employeeCount: 22,
        },
        {
          variantId: 'B',
          variantName: 'B',
          systemId: 'SYS_2024_TEST',
          systemName: '新制度案（技術45:貢献55）',
          targetGroups: [
            { type: 'department', ids: ['DEPT_001B'] }
          ],
          employeeCount: 23,
        },
      ],
      successMetrics: [
        {
          metricName: '平均スコア',
          description: '職員の平均評価スコア',
          targetValue: 75,
          unit: '点',
          measurementMethod: '月次評価の平均',
        },
        {
          metricName: '満足度',
          description: '制度への満足度',
          targetValue: 4.0,
          unit: '点',
          measurementMethod: 'アンケート調査',
        },
      ],
      results: {
        executedAt: '2024-04-30',
        duration: 30,
        variantResults: [
          {
            variantId: 'A',
            variantName: 'A',
            statistics: {
              participantCount: 22,
              averageScore: 72.3,
              standardDeviation: 8.5,
              medianScore: 71.5,
            },
            gradeDistribution: { S: 1, A: 4, B: 10, C: 6, D: 1 },
            metricResults: [
              { metricName: '平均スコア', value: 72.3, targetAchieved: false },
              { metricName: '満足度', value: 3.8, targetAchieved: false },
            ],
            satisfaction: {
              averageRating: 3.8,
              responseCount: 20,
            },
          },
          {
            variantId: 'B',
            variantName: 'B',
            statistics: {
              participantCount: 23,
              averageScore: 76.1,
              standardDeviation: 7.2,
              medianScore: 75.8,
            },
            gradeDistribution: { S: 2, A: 6, B: 11, C: 3, D: 1 },
            metricResults: [
              { metricName: '平均スコア', value: 76.1, targetAchieved: true },
              { metricName: '満足度', value: 4.2, targetAchieved: true },
            ],
            satisfaction: {
              averageRating: 4.2,
              responseCount: 21,
            },
          },
        ],
        statisticalAnalysis: {
          pValue: 0.023,
          confidenceLevel: 95,
          isSignificant: true,
          effectSize: 0.45,
          recommendation: 'B',
        },
        insights: {
          winningVariant: 'B',
          keyFindings: [
            '新制度（B）で平均スコアが3.8点向上',
            '満足度が4.2点に達し目標を達成',
            'S/A評価者が40%増加',
            '統計的に有意な改善（p=0.023）',
          ],
          recommendations: [
            '新制度を全リハビリ科に展開することを推奨',
            '他部署での追加テストを実施',
            '3ヶ月後に再評価を実施',
          ],
          risks: [
            '一部職員（15%）で満足度低下',
            'サンプルサイズが小さいため追加検証必要',
          ],
        },
      },
    },
    {
      id: 'TEST_002',
      testName: '営業部インセンティブ制度テスト',
      description: '営業部で成果連動型の新評価方式をテスト',
      status: 'completed',
      startDate: '2024-03-01',
      endDate: '2024-03-31',
      createdBy: '営業部長',
      createdAt: '2024-02-20',
      variants: [
        {
          variantId: 'A',
          variantName: 'A',
          systemId: 'SYS_2024',
          systemName: '標準評価',
          targetGroups: [{ type: 'random', percentage: 50 }],
          employeeCount: 15,
        },
        {
          variantId: 'B',
          variantName: 'B',
          systemId: 'SYS_2024_SALES',
          systemName: '成果連動型',
          targetGroups: [{ type: 'random', percentage: 50 }],
          employeeCount: 15,
        },
      ],
      successMetrics: [
        {
          metricName: '売上達成率',
          description: '月間売上目標の達成率',
          targetValue: 110,
          unit: '%',
          measurementMethod: '売上実績/目標',
        },
      ],
    },
  ];

  // 新規テスト作成
  const createNewTest = () => {
    const test: ABTestConfig = {
      id: `TEST_${Date.now()}`,
      testName: newTest.name,
      description: newTest.description,
      status: 'planning',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + newTest.duration * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdBy: 'システム管理者',
      createdAt: new Date().toISOString(),
      variants: [
        {
          variantId: 'A',
          variantName: 'A',
          systemId: newTest.variantA,
          systemName: 'コントロール群',
          targetGroups: [{ type: 'department' as const, ids: [] }],
          employeeCount: 0,
        },
        {
          variantId: 'B',
          variantName: 'B',
          systemId: newTest.variantB,
          systemName: 'テスト群',
          targetGroups: [{ type: 'department' as const, ids: [] }],
          employeeCount: 0,
        },
      ],
      successMetrics: [],
    };
    setActiveTests([...activeTests, test]);
    setShowNewTestDialog(false);
  };

  // テストステータスの取得
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'planning':
        return <Badge className="bg-blue-600">計画中</Badge>;
      case 'running':
        return <Badge className="bg-green-600">実施中</Badge>;
      case 'completed':
        return <Badge variant="secondary">完了</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">中止</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // 統計的有意性の表示
  const getSignificanceDisplay = (pValue: number, isSignificant: boolean) => {
    if (isSignificant) {
      return (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle className="h-4 w-4" />
          <span>統計的に有意（p={pValue.toFixed(3)}）</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2 text-gray-500">
          <AlertCircle className="h-4 w-4" />
          <span>有意差なし（p={pValue.toFixed(3)}）</span>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5" />
              A/Bテスト管理
            </div>
            <Button onClick={() => setShowNewTestDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              新規テスト作成
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>A/Bテストについて</AlertTitle>
            <AlertDescription>
              異なる評価制度を並行して運用し、効果を統計的に比較検証します。
              部署や施設単位でテストを実施し、最適な制度を科学的に選定できます。
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* テスト一覧 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">実施中のテスト</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>テスト名</TableHead>
                <TableHead>状態</TableHead>
                <TableHead>期間</TableHead>
                <TableHead>参加者数</TableHead>
                <TableHead>進捗</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTests.map(test => {
                const totalParticipants = test.variants.reduce((sum, v) => sum + v.employeeCount, 0);
                const progress = test.status === 'completed' ? 100 :
                  test.status === 'running' ? 65 : 0;

                return (
                  <TableRow key={test.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{test.testName}</p>
                        <p className="text-sm text-gray-600">{test.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(test.status)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{test.startDate}</p>
                        <p className="text-gray-600">〜 {test.endDate}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {totalParticipants}名
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-24">
                        <Progress value={progress} className="h-2" />
                        <p className="text-xs text-gray-600 mt-1">{progress}%</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedTest(test)}
                        >
                          詳細
                        </Button>
                        {test.status === 'running' && (
                          <Button size="sm" variant="outline">
                            <Pause className="h-4 w-4" />
                          </Button>
                        )}
                        {test.status === 'planning' && (
                          <Button size="sm">
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* テスト詳細 */}
      {selectedTest && selectedTest.results && (
        <Tabs defaultValue="results">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="results">結果概要</TabsTrigger>
            <TabsTrigger value="comparison">比較分析</TabsTrigger>
            <TabsTrigger value="statistics">統計解析</TabsTrigger>
            <TabsTrigger value="recommendations">推奨事項</TabsTrigger>
          </TabsList>

          {/* 結果概要タブ */}
          <TabsContent value="results">
            <div className="space-y-4">
              {/* 勝者表示 */}
              {selectedTest.results.insights.winningVariant && (
                <Alert className="border-green-500">
                  <Award className="h-4 w-4" />
                  <AlertTitle>テスト結果：バリアント{selectedTest.results.insights.winningVariant}の勝利</AlertTitle>
                  <AlertDescription>
                    統計的に有意な差が確認され、バリアント{selectedTest.results.insights.winningVariant}の採用を推奨します。
                  </AlertDescription>
                </Alert>
              )}

              {/* メトリクス達成状況 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedTest.results.variantResults.map(variant => (
                  <Card key={variant.variantId}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center justify-between">
                        バリアント{variant.variantName}
                        {selectedTest.results?.insights.winningVariant === variant.variantName && (
                          <Badge className="bg-green-600">優勝</Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">平均スコア</p>
                          <p className="text-2xl font-bold">{variant.statistics.averageScore.toFixed(1)}点</p>
                        </div>
                        <div className="space-y-2">
                          {variant.metricResults.map(metric => (
                            <div key={metric.metricName} className="flex items-center justify-between">
                              <span className="text-sm">{metric.metricName}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{metric.value}</span>
                                {metric.targetAchieved ? (
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-gray-400" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        {variant.satisfaction && (
                          <div className="pt-2 border-t">
                            <p className="text-sm text-gray-600">満足度</p>
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-medium">{variant.satisfaction.averageRating}/5</span>
                              <span className="text-sm text-gray-500">({variant.satisfaction.responseCount}件)</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* 主要な発見 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">主要な発見</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {selectedTest.results.insights.keyFindings.map((finding, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span className="text-sm">{finding}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 比較分析タブ */}
          <TabsContent value="comparison">
            <div className="space-y-4">
              {/* グレード分布比較 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">グレード分布比較</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={['S', 'A', 'B', 'C', 'D'].map(grade => ({
                      grade,
                      A: selectedTest.results?.variantResults[0].gradeDistribution[grade] || 0,
                      B: selectedTest.results?.variantResults[1].gradeDistribution[grade] || 0,
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="grade" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="A" name="バリアントA" fill="#8884d8" />
                      <Bar dataKey="B" name="バリアントB" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* スコア分布 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">スコア分布</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="x" name="バリアント" />
                      <YAxis dataKey="y" name="スコア" />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Legend />
                      <Scatter
                        name="バリアントA"
                        data={Array.from({ length: 20 }, () => ({
                          x: Math.random() * 10,
                          y: selectedTest.results!.variantResults[0].statistics.averageScore + (Math.random() - 0.5) * 20,
                        }))}
                        fill="#8884d8"
                      />
                      <Scatter
                        name="バリアントB"
                        data={Array.from({ length: 20 }, () => ({
                          x: Math.random() * 10 + 15,
                          y: selectedTest.results!.variantResults[1].statistics.averageScore + (Math.random() - 0.5) * 20,
                        }))}
                        fill="#82ca9d"
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 統計解析タブ */}
          <TabsContent value="statistics">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">統計的検定結果</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* 統計的有意性 */}
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">統計的有意性</p>
                      {getSignificanceDisplay(
                        selectedTest.results.statisticalAnalysis.pValue,
                        selectedTest.results.statisticalAnalysis.isSignificant
                      )}
                    </div>

                    {/* 詳細統計 */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-gray-600">p値</p>
                        <p className="text-xl font-bold">{selectedTest.results.statisticalAnalysis.pValue.toFixed(3)}</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-gray-600">信頼水準</p>
                        <p className="text-xl font-bold">{selectedTest.results.statisticalAnalysis.confidenceLevel}%</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-gray-600">効果量</p>
                        <p className="text-xl font-bold">{selectedTest.results.statisticalAnalysis.effectSize.toFixed(2)}</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-gray-600">推奨</p>
                        <p className="text-xl font-bold">バリアント{selectedTest.results.statisticalAnalysis.recommendation}</p>
                      </div>
                    </div>

                    {/* 統計表 */}
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>指標</TableHead>
                          <TableHead>バリアントA</TableHead>
                          <TableHead>バリアントB</TableHead>
                          <TableHead>差</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>参加者数</TableCell>
                          <TableCell>{selectedTest.results.variantResults[0].statistics.participantCount}</TableCell>
                          <TableCell>{selectedTest.results.variantResults[1].statistics.participantCount}</TableCell>
                          <TableCell>-</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>平均スコア</TableCell>
                          <TableCell>{selectedTest.results.variantResults[0].statistics.averageScore.toFixed(1)}</TableCell>
                          <TableCell>{selectedTest.results.variantResults[1].statistics.averageScore.toFixed(1)}</TableCell>
                          <TableCell className="font-medium">
                            +{(selectedTest.results.variantResults[1].statistics.averageScore -
                               selectedTest.results.variantResults[0].statistics.averageScore).toFixed(1)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>標準偏差</TableCell>
                          <TableCell>{selectedTest.results.variantResults[0].statistics.standardDeviation.toFixed(1)}</TableCell>
                          <TableCell>{selectedTest.results.variantResults[1].statistics.standardDeviation.toFixed(1)}</TableCell>
                          <TableCell>-</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>中央値</TableCell>
                          <TableCell>{selectedTest.results.variantResults[0].statistics.medianScore.toFixed(1)}</TableCell>
                          <TableCell>{selectedTest.results.variantResults[1].statistics.medianScore.toFixed(1)}</TableCell>
                          <TableCell>-</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 推奨事項タブ */}
          <TabsContent value="recommendations">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">推奨アクション</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedTest.results.insights.recommendations.map((rec, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="mt-1">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                            {idx + 1}
                          </div>
                        </div>
                        <p className="text-sm">{rec}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">リスクと注意事項</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedTest.results.insights.risks.map((risk, idx) => (
                      <Alert key={idx}>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{risk}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">次のステップ</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      バリアントBを本番環境に適用
                    </Button>
                    <Button variant="outline" className="w-full">
                      <FlaskConical className="h-4 w-4 mr-2" />
                      他部署で追加テストを実施
                    </Button>
                    <Button variant="outline" className="w-full">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      詳細レポートをダウンロード
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* 新規テスト作成ダイアログ */}
      <Dialog open={showNewTestDialog} onOpenChange={setShowNewTestDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>新規A/Bテスト作成</DialogTitle>
            <DialogDescription>
              2つの評価制度を並行して運用し、効果を比較します
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>テスト名</Label>
              <Input
                value={newTest.name}
                onChange={(e) => setNewTest({...newTest, name: e.target.value})}
                placeholder="例：営業部新評価制度テスト"
              />
            </div>
            <div>
              <Label>説明</Label>
              <Textarea
                value={newTest.description}
                onChange={(e) => setNewTest({...newTest, description: e.target.value})}
                placeholder="テストの目的と内容を記入"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>バリアントA（コントロール）</Label>
                <Select value={newTest.variantA} onValueChange={(v) => setNewTest({...newTest, variantA: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">現行制度</SelectItem>
                    <SelectItem value="v2023">2023年度制度</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>バリアントB（テスト）</Label>
                <Select value={newTest.variantB} onValueChange={(v) => setNewTest({...newTest, variantB: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">新制度案</SelectItem>
                    <SelectItem value="modified">修正案</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>テスト期間（日）</Label>
              <Input
                type="number"
                value={newTest.duration}
                onChange={(e) => setNewTest({...newTest, duration: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <Label>対象選定方法</Label>
              <Select value={newTest.targetType} onValueChange={(v) => setNewTest({...newTest, targetType: v})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="department">部署単位</SelectItem>
                  <SelectItem value="facility">施設単位</SelectItem>
                  <SelectItem value="random">ランダム割り当て</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewTestDialog(false)}>
              キャンセル
            </Button>
            <Button onClick={createNewTest}>
              <FlaskConical className="h-4 w-4 mr-2" />
              テストを作成
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}