'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Play,
  Settings,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Users,
  BarChart3,
  Building,
  Briefcase,
  Download,
  Loader2,
} from 'lucide-react';
import { EvaluationSimulation, SimulationResults } from '@/types/masterData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

export default function EvaluationSimulationPanel() {
  const [simulation, setSimulation] = useState<EvaluationSimulation>({
    id: 'SIM_001',
    simulationName: '',
    targetSystemId: 'SYSTEM_001',
    targetSystemName: '2024年度評価制度',
    createdAt: new Date().toISOString(),
    createdBy: 'ユーザー',
    status: 'draft',
    conditions: {
      scoreChanges: {
        technical: 50,
        contribution: 50,
      },
      thresholdChanges: [],
    },
    testData: {
      dataSource: '2024年度上期実績',
      employeeCount: 280,
      period: '2024-H1',
      departments: ['看護部', 'リハビリテーション科', '医事課'],
    },
  });

  const [isRunning, setIsRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<SimulationResults | null>(null);

  // 配点調整ハンドラー
  const handleScoreChange = (type: 'technical' | 'contribution', value: number[]) => {
    const newValue = value[0];
    const otherValue = 100 - newValue;

    setSimulation({
      ...simulation,
      conditions: {
        ...simulation.conditions,
        scoreChanges: {
          technical: type === 'technical' ? newValue : otherValue,
          contribution: type === 'contribution' ? newValue : otherValue,
        },
      },
    });
  };

  // S評価の閾値調整
  const handleThresholdChange = (grade: string, value: string) => {
    const thresholds = simulation.conditions.thresholdChanges || [];
    const existing = thresholds.find(t => t.grade === grade);

    if (existing) {
      existing.percentile = value;
    } else {
      thresholds.push({ grade, percentile: value });
    }

    setSimulation({
      ...simulation,
      conditions: {
        ...simulation.conditions,
        thresholdChanges: thresholds,
      },
    });
  };

  // シミュレーション実行
  const runSimulation = async () => {
    setIsRunning(true);

    // 2秒後にモック結果を表示
    setTimeout(() => {
      const mockResults: SimulationResults = {
        executedAt: new Date().toISOString(),
        executionTime: 1523,
        gradeDistribution: {
          before: { S: 28, A: 56, B: 112, C: 56, D: 28 },
          after: { S: 14, A: 42, B: 140, C: 56, D: 28 },
          changes: { S: -14, A: -14, B: 28, C: 0, D: 0 },
        },
        statistics: {
          averageScoreBefore: 75.5,
          averageScoreAfter: 78.2,
          scoreDifference: 2.7,
          standardDeviationBefore: 12.3,
          standardDeviationAfter: 10.8,
          medianBefore: 76,
          medianAfter: 78,
        },
        departmentImpacts: [
          {
            departmentId: 'DEPT_001',
            departmentName: 'リハビリテーション科',
            averageScoreBefore: 72.3,
            averageScoreAfter: 82.1,
            impact: 'positive',
            impactLevel: 85,
            affectedEmployees: 30,
          },
          {
            departmentId: 'DEPT_002',
            departmentName: 'ICU',
            averageScoreBefore: 78.5,
            averageScoreAfter: 75.2,
            impact: 'negative',
            impactLevel: -35,
            affectedEmployees: 15,
          },
          {
            departmentId: 'DEPT_003',
            departmentName: '外来看護部',
            averageScoreBefore: 76.0,
            averageScoreAfter: 77.5,
            impact: 'neutral',
            impactLevel: 15,
            affectedEmployees: 20,
          },
        ],
        jobCategoryImpacts: [
          {
            jobCategory: '看護師',
            averageScoreBefore: 75,
            averageScoreAfter: 73,
            impact: 'negative',
            impactLevel: -20,
          },
          {
            jobCategory: 'リハビリ職',
            averageScoreBefore: 72,
            averageScoreAfter: 81,
            impact: 'positive',
            impactLevel: 90,
          },
        ],
        topImpactedEmployees: {
          positive: [
            {
              employeeId: 'EMP_001',
              name: '山田太郎',
              department: 'リハビリテーション科',
              scoreBefore: 68,
              scoreAfter: 85,
              gradeBefore: 'C',
              gradeAfter: 'A',
            },
          ],
          negative: [
            {
              employeeId: 'EMP_002',
              name: '佐藤花子',
              department: 'ICU',
              scoreBefore: 82,
              scoreAfter: 72,
              gradeBefore: 'A',
              gradeAfter: 'B',
            },
          ],
        },
        riskAnalysis: {
          warnings: [
            'S評価者が50%減少します',
            'リハビリテーション科と他部署の評価格差が拡大',
            '技術評価重視により看護部門の評価が相対的に低下',
          ],
          recommendations: [
            '段階的な導入を検討してください',
            '看護部門向けの技術評価項目の見直しを推奨',
            'S評価の閾値を上位7%程度に調整することを検討',
          ],
        },
      };

      setResults(mockResults);
      setIsRunning(false);
      setShowResults(true);
    }, 2000);
  };

  // グラフ用データ
  const gradeDistributionData = results ? [
    { grade: 'S', 現行: results.gradeDistribution.before.S, 新制度: results.gradeDistribution.after.S },
    { grade: 'A', 現行: results.gradeDistribution.before.A, 新制度: results.gradeDistribution.after.A },
    { grade: 'B', 現行: results.gradeDistribution.before.B, 新制度: results.gradeDistribution.after.B },
    { grade: 'C', 現行: results.gradeDistribution.before.C, 新制度: results.gradeDistribution.after.C },
    { grade: 'D', 現行: results.gradeDistribution.before.D, 新制度: results.gradeDistribution.after.D },
  ] : [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      {/* シミュレーション設定 */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            評価シミュレーション設定
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* 基本情報 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>シミュレーション名</Label>
              <Input
                placeholder="例：技術重視配点案"
                value={simulation.simulationName}
                onChange={(e) => setSimulation({ ...simulation, simulationName: e.target.value })}
              />
            </div>
            <div>
              <Label>検証データ</Label>
              <Select defaultValue="2024-H1">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-H1">2024年度上期実績（280名）</SelectItem>
                  <SelectItem value="2023-FY">2023年度通年実績（275名）</SelectItem>
                  <SelectItem value="sample">サンプルデータ（100名）</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* What-if条件設定 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">What-if分析条件</h3>

            {/* 配点変更 */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <h4 className="font-medium">配点変更</h4>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>技術評価</Label>
                  <span className="font-semibold text-lg">
                    {simulation.conditions.scoreChanges?.technical}点
                  </span>
                </div>
                <Slider
                  value={[simulation.conditions.scoreChanges?.technical || 50]}
                  onValueChange={(value) => handleScoreChange('technical', value)}
                  min={0}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>組織貢献度</Label>
                  <span className="font-semibold text-lg">
                    {simulation.conditions.scoreChanges?.contribution}点
                  </span>
                </div>
                <Slider
                  value={[simulation.conditions.scoreChanges?.contribution || 50]}
                  onValueChange={(value) => handleScoreChange('contribution', value)}
                  min={0}
                  max={100}
                  step={5}
                  className="w-full"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">※自動調整</p>
              </div>
            </div>

            {/* 閾値変更 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-3">評価閾値変更</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>S評価基準</Label>
                  <Select
                    defaultValue="10"
                    onValueChange={(value) => handleThresholdChange('S', `上位${value}%`)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">上位5%</SelectItem>
                      <SelectItem value="10">上位10%（現行）</SelectItem>
                      <SelectItem value="15">上位15%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>A評価基準</Label>
                  <Select
                    defaultValue="30"
                    onValueChange={(value) => handleThresholdChange('A', `上位${value}%`)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="20">上位20%</SelectItem>
                      <SelectItem value="30">上位30%（現行）</SelectItem>
                      <SelectItem value="40">上位40%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* 実行ボタン */}
          <div className="flex justify-end">
            <Button
              onClick={runSimulation}
              disabled={isRunning}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  シミュレーション実行中...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  シミュレーション実行
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* シミュレーション結果 */}
      {showResults && results && (
        <Card>
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                シミュレーション結果
              </div>
              <Badge variant="outline">
                実行時間: {results.executionTime}ms
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">概要</TabsTrigger>
                <TabsTrigger value="distribution">評価分布</TabsTrigger>
                <TabsTrigger value="department">部署別影響</TabsTrigger>
                <TabsTrigger value="risk">リスク分析</TabsTrigger>
              </TabsList>

              {/* 概要タブ */}
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">平均スコア</p>
                          <p className="text-2xl font-bold">
                            {results.statistics.averageScoreBefore.toFixed(1)} → {results.statistics.averageScoreAfter.toFixed(1)}
                          </p>
                        </div>
                        {results.statistics.scoreDifference > 0 ? (
                          <TrendingUp className="h-8 w-8 text-green-500" />
                        ) : (
                          <TrendingDown className="h-8 w-8 text-red-500" />
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">S評価者数</p>
                          <p className="text-2xl font-bold">
                            {results.gradeDistribution.before.S} → {results.gradeDistribution.after.S}
                          </p>
                        </div>
                        <Badge variant={results.gradeDistribution.changes.S < 0 ? "destructive" : "default"}>
                          {results.gradeDistribution.changes.S > 0 ? '+' : ''}{results.gradeDistribution.changes.S}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div>
                        <p className="text-sm text-gray-600">標準偏差</p>
                        <p className="text-2xl font-bold">
                          {results.statistics.standardDeviationBefore.toFixed(1)} → {results.statistics.standardDeviationAfter.toFixed(1)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          ばらつきが{results.statistics.standardDeviationAfter < results.statistics.standardDeviationBefore ? '減少' : '増加'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>主要な影響</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                      <li>技術評価重視により、リハビリテーション科の評価が大幅に向上</li>
                      <li>S評価者が50%減少し、評価の希少性が向上</li>
                      <li>部署間の評価格差が拡大する傾向</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </TabsContent>

              {/* 評価分布タブ */}
              <TabsContent value="distribution" className="space-y-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={gradeDistributionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="grade" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="現行" fill="#8884d8" />
                      <Bar dataKey="新制度" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-5 gap-2 text-center">
                  {['S', 'A', 'B', 'C', 'D'].map(grade => {
                    const change = results.gradeDistribution.changes[grade as keyof typeof results.gradeDistribution.changes];
                    return (
                      <div key={grade} className="bg-gray-50 rounded p-3">
                        <p className="font-semibold">{grade}評価</p>
                        <p className={`text-lg ${change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                          {change > 0 ? '+' : ''}{change}人
                        </p>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>

              {/* 部署別影響タブ */}
              <TabsContent value="department" className="space-y-4">
                <div className="space-y-3">
                  {results.departmentImpacts.map(dept => (
                    <div key={dept.departmentId} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Building className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="font-medium">{dept.departmentName}</p>
                            <p className="text-sm text-gray-600">
                              影響人数: {dept.affectedEmployees}名
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-sm text-gray-600">平均スコア</p>
                            <p className="font-semibold">
                              {dept.averageScoreBefore.toFixed(1)} → {dept.averageScoreAfter.toFixed(1)}
                            </p>
                          </div>
                          <Badge variant={
                            dept.impact === 'positive' ? 'default' :
                            dept.impact === 'negative' ? 'destructive' :
                            'secondary'
                          }>
                            {dept.impact === 'positive' ? '↑' :
                             dept.impact === 'negative' ? '↓' : '→'}
                            {Math.abs(dept.impactLevel)}%
                          </Badge>
                        </div>
                      </div>
                      <Progress value={50 + dept.impactLevel / 2} className="mt-3" />
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* リスク分析タブ */}
              <TabsContent value="risk" className="space-y-4">
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertTitle className="text-yellow-800">警告事項</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1 mt-2 text-yellow-700">
                      {results.riskAnalysis.warnings.map((warning, i) => (
                        <li key={i}>{warning}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>

                <Alert className="border-blue-200 bg-blue-50">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-800">推奨事項</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1 mt-2 text-blue-700">
                      {results.riskAnalysis.recommendations.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>

                <div className="flex justify-end gap-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    レポート出力
                  </Button>
                  <Button>
                    シミュレーション保存
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}