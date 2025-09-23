'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  LineChart,
  Line,
  BarChart,
  Bar,
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
} from 'recharts';
import {
  History,
  GitCompare,
  TrendingUp,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  RotateCcw,
  Info,
} from 'lucide-react';
import { SystemVersionHistory, VersionComparison } from '@/types/masterData';

export default function HistoryComparisonPanel() {
  const [selectedVersion1, setSelectedVersion1] = useState('v2024');
  const [selectedVersion2, setSelectedVersion2] = useState('v2023');
  const [comparison, setComparison] = useState<VersionComparison | null>(null);

  // デモ用のバージョン履歴
  const versionHistory: SystemVersionHistory[] = [
    {
      id: 'v2024',
      versionName: '2024年度制度',
      systemId: 'SYS_2024',
      effectiveFrom: '2024-04-01',
      status: 'active',
      details: {
        totalScore: 100,
        technicalScore: 50,
        contributionScore: 50,
        gradeThresholds: {
          S: { min: 90, max: 100 },
          A: { min: 80, max: 89 },
          B: { min: 65, max: 79 },
          C: { min: 50, max: 64 },
          D: { min: 0, max: 49 },
        },
      },
      performance: {
        employeeCount: 500,
        averageScore: 72.3,
        gradeDistribution: { S: 10, A: 50, B: 200, C: 180, D: 60 },
        departmentScores: [
          { departmentName: 'リハビリテーション科', averageScore: 78.5, employeeCount: 45 },
          { departmentName: '看護部', averageScore: 75.2, employeeCount: 120 },
          { departmentName: '総務部', averageScore: 68.9, employeeCount: 25 },
        ],
      },
      changes: {
        changedFrom: 'v2023',
        changedBy: '人事部長',
        changedAt: '2024-03-15',
        changeLog: [
          {
            category: 'threshold',
            item: 'S評価基準',
            oldValue: 85,
            newValue: 90,
            reason: 'より高い基準での評価を促進',
            impact: '約20名がS評価からA評価へ',
          },
        ],
      },
    },
    {
      id: 'v2023',
      versionName: '2023年度制度',
      systemId: 'SYS_2023',
      effectiveFrom: '2023-04-01',
      effectiveTo: '2024-03-31',
      status: 'archived',
      details: {
        totalScore: 100,
        technicalScore: 55,
        contributionScore: 45,
        gradeThresholds: {
          S: { min: 85, max: 100 },
          A: { min: 75, max: 84 },
          B: { min: 60, max: 74 },
          C: { min: 45, max: 59 },
          D: { min: 0, max: 44 },
        },
      },
      performance: {
        employeeCount: 480,
        averageScore: 69.8,
        gradeDistribution: { S: 30, A: 70, B: 180, C: 150, D: 50 },
        departmentScores: [
          { departmentName: 'リハビリテーション科', averageScore: 76.2, employeeCount: 42 },
          { departmentName: '看護部', averageScore: 72.5, employeeCount: 115 },
          { departmentName: '総務部', averageScore: 66.3, employeeCount: 23 },
        ],
      },
    },
    {
      id: 'v2025',
      versionName: '2025年度制度（計画）',
      systemId: 'SYS_2025',
      effectiveFrom: '2025-04-01',
      status: 'planned',
      details: {
        totalScore: 100,
        technicalScore: 45,
        contributionScore: 55,
        gradeThresholds: {
          S: { min: 95, max: 100 },
          A: { min: 85, max: 94 },
          B: { min: 70, max: 84 },
          C: { min: 55, max: 69 },
          D: { min: 0, max: 54 },
        },
      },
    },
  ];

  // 比較実行
  const runComparison = () => {
    const v1 = versionHistory.find(v => v.id === selectedVersion1);
    const v2 = versionHistory.find(v => v.id === selectedVersion2);

    if (!v1 || !v2) return;

    setComparison({
      id: 'COMP_001',
      comparisonName: `${v1.versionName} vs ${v2.versionName}`,
      version1Id: v1.id,
      version2Id: v2.id,
      createdAt: new Date().toISOString(),
      createdBy: 'システム管理者',
      differences: {
        scoreChanges: {
          technical: {
            v1: v1.details.technicalScore,
            v2: v2.details.technicalScore,
            diff: v1.details.technicalScore - v2.details.technicalScore,
          },
          contribution: {
            v1: v1.details.contributionScore,
            v2: v2.details.contributionScore,
            diff: v1.details.contributionScore - v2.details.contributionScore,
          },
        },
        thresholdChanges: ['S', 'A', 'B', 'C', 'D'].map(grade => ({
          grade,
          v1: v1.details.gradeThresholds[grade as keyof typeof v1.details.gradeThresholds],
          v2: v2.details.gradeThresholds[grade as keyof typeof v2.details.gradeThresholds],
        })),
        performanceComparison: v1.performance && v2.performance ? {
          averageScore: {
            v1: v1.performance.averageScore,
            v2: v2.performance.averageScore,
            diff: v1.performance.averageScore - v2.performance.averageScore,
          },
          gradeDistribution: ['S', 'A', 'B', 'C', 'D'].map(grade => ({
            grade,
            v1: v1.performance.gradeDistribution[grade] || 0,
            v2: v2.performance.gradeDistribution[grade] || 0,
            diff: (v1.performance!.gradeDistribution[grade] || 0) - (v2.performance!.gradeDistribution[grade] || 0),
          })),
        } : undefined,
      },
      effectiveness: {
        goals: [
          {
            goalName: '平均スコア向上',
            target: 70,
            actual: 72.3,
            achieved: true,
          },
          {
            goalName: 'S評価者数',
            target: 15,
            actual: 10,
            achieved: false,
          },
          {
            goalName: 'D評価者削減',
            target: 40,
            actual: 60,
            achieved: false,
          },
        ],
        kpis: [
          {
            kpiName: '職員満足度',
            v1Value: 3.8,
            v2Value: 3.5,
            improvement: 8.6,
            unit: '点',
          },
          {
            kpiName: '評価公平性',
            v1Value: 4.2,
            v2Value: 3.9,
            improvement: 7.7,
            unit: '点',
          },
          {
            kpiName: '制度理解度',
            v1Value: 85,
            v2Value: 78,
            improvement: 9.0,
            unit: '%',
          },
        ],
      },
    });
  };

  // 時系列データの生成
  const generateTimelineData = () => {
    return [
      { year: '2021', score: 68.2, S: 25, A: 65, B: 175, C: 160, D: 55 },
      { year: '2022', score: 68.9, S: 28, A: 68, B: 178, C: 155, D: 51 },
      { year: '2023', score: 69.8, S: 30, A: 70, B: 180, C: 150, D: 50 },
      { year: '2024', score: 72.3, S: 10, A: 50, B: 200, C: 180, D: 60 },
    ];
  };

  // レーダーチャートデータの生成
  const generateRadarData = () => {
    if (!comparison) return [];

    return [
      {
        metric: '技術評価',
        v1: comparison.differences.scoreChanges.technical.v1,
        v2: comparison.differences.scoreChanges.technical.v2,
      },
      {
        metric: '組織貢献',
        v1: comparison.differences.scoreChanges.contribution.v1,
        v2: comparison.differences.scoreChanges.contribution.v2,
      },
      {
        metric: 'S基準',
        v1: 100 - comparison.differences.thresholdChanges[0].v1.min,
        v2: 100 - comparison.differences.thresholdChanges[0].v2.min,
      },
      {
        metric: '平均スコア',
        v1: comparison.differences.performanceComparison?.averageScore.v1 || 0,
        v2: comparison.differences.performanceComparison?.averageScore.v2 || 0,
      },
      {
        metric: '満足度',
        v1: comparison.effectiveness?.kpis[0].v1Value * 20 || 0,
        v2: comparison.effectiveness?.kpis[0].v2Value * 20 || 0,
      },
    ];
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-600">運用中</Badge>;
      case 'archived':
        return <Badge variant="secondary">アーカイブ</Badge>;
      case 'planned':
        return <Badge className="bg-blue-600">計画中</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* バージョン選択 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCompare className="h-5 w-5" />
            バージョン比較設定
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">比較元バージョン</label>
              <Select value={selectedVersion1} onValueChange={setSelectedVersion1}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {versionHistory.map(version => (
                    <SelectItem key={version.id} value={version.id}>
                      {version.versionName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">比較先バージョン</label>
              <Select value={selectedVersion2} onValueChange={setSelectedVersion2}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {versionHistory.map(version => (
                    <SelectItem key={version.id} value={version.id}>
                      {version.versionName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={runComparison}
                disabled={selectedVersion1 === selectedVersion2}
                className="w-full"
              >
                <GitCompare className="h-4 w-4 mr-2" />
                比較を実行
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* バージョン履歴一覧 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            バージョン履歴
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>バージョン</TableHead>
                <TableHead>有効期間</TableHead>
                <TableHead>状態</TableHead>
                <TableHead>技術/貢献</TableHead>
                <TableHead>平均スコア</TableHead>
                <TableHead>変更者</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {versionHistory.map(version => (
                <TableRow key={version.id}>
                  <TableCell className="font-medium">{version.versionName}</TableCell>
                  <TableCell>
                    {version.effectiveFrom}
                    {version.effectiveTo && ` 〜 ${version.effectiveTo}`}
                  </TableCell>
                  <TableCell>{getStatusBadge(version.status)}</TableCell>
                  <TableCell>
                    {version.details.technicalScore}/{version.details.contributionScore}
                  </TableCell>
                  <TableCell>
                    {version.performance?.averageScore?.toFixed(1) || '-'}
                  </TableCell>
                  <TableCell>
                    {version.changes?.changedBy || '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Info className="h-4 w-4" />
                      </Button>
                      {version.status === 'archived' && (
                        <Button size="sm" variant="outline">
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 比較結果 */}
      {comparison && (
        <Tabs defaultValue="differences">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="differences">変更点</TabsTrigger>
            <TabsTrigger value="performance">実績比較</TabsTrigger>
            <TabsTrigger value="timeline">時系列推移</TabsTrigger>
            <TabsTrigger value="effectiveness">効果測定</TabsTrigger>
          </TabsList>

          {/* 変更点タブ */}
          <TabsContent value="differences">
            <div className="space-y-4">
              {/* 配点変更 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">配点構成の変更</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">技術評価</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">
                          {comparison.differences.scoreChanges.technical.v1}点
                        </span>
                        <span className="text-gray-400">→</span>
                        <span className="text-2xl font-bold">
                          {comparison.differences.scoreChanges.technical.v2}点
                        </span>
                        {comparison.differences.scoreChanges.technical.diff !== 0 && (
                          <Badge variant={comparison.differences.scoreChanges.technical.diff > 0 ? "default" : "destructive"}>
                            {comparison.differences.scoreChanges.technical.diff > 0 ? '+' : ''}{comparison.differences.scoreChanges.technical.diff}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">組織貢献度</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">
                          {comparison.differences.scoreChanges.contribution.v1}点
                        </span>
                        <span className="text-gray-400">→</span>
                        <span className="text-2xl font-bold">
                          {comparison.differences.scoreChanges.contribution.v2}点
                        </span>
                        {comparison.differences.scoreChanges.contribution.diff !== 0 && (
                          <Badge variant={comparison.differences.scoreChanges.contribution.diff > 0 ? "default" : "destructive"}>
                            {comparison.differences.scoreChanges.contribution.diff > 0 ? '+' : ''}{comparison.differences.scoreChanges.contribution.diff}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 閾値変更 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">評価基準の変更</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>グレード</TableHead>
                        <TableHead>v1 範囲</TableHead>
                        <TableHead>v2 範囲</TableHead>
                        <TableHead>変更内容</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {comparison.differences.thresholdChanges.map(threshold => (
                        <TableRow key={threshold.grade}>
                          <TableCell>
                            <Badge>{threshold.grade}</Badge>
                          </TableCell>
                          <TableCell>
                            {threshold.v1.min} - {threshold.v1.max}
                          </TableCell>
                          <TableCell>
                            {threshold.v2.min} - {threshold.v2.max}
                          </TableCell>
                          <TableCell>
                            {threshold.v1.min !== threshold.v2.min && (
                              <Badge variant="outline" className="mr-1">
                                下限: {threshold.v2.min - threshold.v1.min > 0 ? '+' : ''}{threshold.v2.min - threshold.v1.min}
                              </Badge>
                            )}
                            {threshold.v1.max !== threshold.v2.max && (
                              <Badge variant="outline">
                                上限: {threshold.v2.max - threshold.v1.max > 0 ? '+' : ''}{threshold.v2.max - threshold.v1.max}
                              </Badge>
                            )}
                            {threshold.v1.min === threshold.v2.min && threshold.v1.max === threshold.v2.max && (
                              <span className="text-gray-500">変更なし</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* レーダーチャート比較 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">総合比較</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={generateRadarData()}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar name="v1" dataKey="v1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                      <Radar name="v2" dataKey="v2" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 実績比較タブ */}
          <TabsContent value="performance">
            {comparison.differences.performanceComparison ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">平均スコア</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {comparison.differences.performanceComparison.averageScore.v1.toFixed(1)}
                        <span className="text-gray-400 mx-2">→</span>
                        {comparison.differences.performanceComparison.averageScore.v2.toFixed(1)}
                      </div>
                      <p className="text-sm mt-1">
                        <span className={comparison.differences.performanceComparison.averageScore.diff > 0 ? 'text-green-600' : 'text-red-600'}>
                          {comparison.differences.performanceComparison.averageScore.diff > 0 ? '+' : ''}
                          {comparison.differences.performanceComparison.averageScore.diff.toFixed(1)}点
                        </span>
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">S評価者数</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {comparison.differences.performanceComparison.gradeDistribution[0].v1}名
                        <span className="text-gray-400 mx-2">→</span>
                        {comparison.differences.performanceComparison.gradeDistribution[0].v2}名
                      </div>
                      <p className="text-sm mt-1">
                        <span className={comparison.differences.performanceComparison.gradeDistribution[0].diff > 0 ? 'text-green-600' : 'text-red-600'}>
                          {comparison.differences.performanceComparison.gradeDistribution[0].diff > 0 ? '+' : ''}
                          {comparison.differences.performanceComparison.gradeDistribution[0].diff}名
                        </span>
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">D評価者数</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {comparison.differences.performanceComparison.gradeDistribution[4].v1}名
                        <span className="text-gray-400 mx-2">→</span>
                        {comparison.differences.performanceComparison.gradeDistribution[4].v2}名
                      </div>
                      <p className="text-sm mt-1">
                        <span className={comparison.differences.performanceComparison.gradeDistribution[4].diff < 0 ? 'text-green-600' : 'text-red-600'}>
                          {comparison.differences.performanceComparison.gradeDistribution[4].diff > 0 ? '+' : ''}
                          {comparison.differences.performanceComparison.gradeDistribution[4].diff}名
                        </span>
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* グレード分布比較 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">グレード分布比較</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={comparison.differences.performanceComparison.gradeDistribution}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="grade" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="v1" name="v1" fill="#8884d8" />
                        <Bar dataKey="v2" name="v2" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  比較対象バージョンの実績データがありません。
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          {/* 時系列推移タブ */}
          <TabsContent value="timeline">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">平均スコアの推移</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={generateTimelineData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis domain={[65, 75]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="score" stroke="#8884d8" name="平均スコア" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">グレード分布の推移</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={generateTimelineData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="S" stackId="a" fill="#8b5cf6" />
                      <Bar dataKey="A" stackId="a" fill="#3b82f6" />
                      <Bar dataKey="B" stackId="a" fill="#10b981" />
                      <Bar dataKey="C" stackId="a" fill="#f59e0b" />
                      <Bar dataKey="D" stackId="a" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 効果測定タブ */}
          <TabsContent value="effectiveness">
            <div className="space-y-4">
              {/* 目標達成状況 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">目標達成状況</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {comparison.effectiveness?.goals.map((goal, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {goal.achieved ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                          <div>
                            <p className="font-medium">{goal.goalName}</p>
                            <p className="text-sm text-gray-600">
                              目標: {goal.target} → 実績: {goal.actual}
                            </p>
                          </div>
                        </div>
                        <Badge variant={goal.achieved ? "default" : "destructive"}>
                          {goal.achieved ? '達成' : '未達成'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* KPI改善状況 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">KPI改善状況</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>KPI</TableHead>
                        <TableHead>v1</TableHead>
                        <TableHead>v2</TableHead>
                        <TableHead>改善率</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {comparison.effectiveness?.kpis.map((kpi, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{kpi.kpiName}</TableCell>
                          <TableCell>{kpi.v1Value}{kpi.unit}</TableCell>
                          <TableCell>{kpi.v2Value}{kpi.unit}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-green-600" />
                              <span className="text-green-600">+{kpi.improvement}%</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* ロールバック提案 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">ロールバック判定</CardTitle>
                </CardHeader>
                <CardContent>
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <p className="font-medium">分析結果：現行制度の継続を推奨</p>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>平均スコアが2.5点向上（目標達成）</li>
                          <li>職員満足度が8.6%改善</li>
                          <li>S評価者数は減少したが、全体の質向上に寄与</li>
                        </ul>
                      </div>
                    </AlertDescription>
                  </Alert>

                  <div className="mt-4 flex gap-2">
                    <Button variant="outline">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      前バージョンに戻す
                    </Button>
                    <Button>
                      <Download className="h-4 w-4 mr-2" />
                      比較レポートを出力
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}