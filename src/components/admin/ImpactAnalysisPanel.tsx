'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
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
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Users,
  DollarSign,
  Building,
  AlertCircle,
  Shield,
  Play,
  Download,
  ChevronUp,
  ChevronDown,
  Minus,
} from 'lucide-react';
import { ImpactAnalysis, ImpactAnalysisResults, EmployeeImpact, DepartmentImpact } from '@/types/masterData';

export default function ImpactAnalysisPanel() {
  const [selectedBaseline, setSelectedBaseline] = useState('current');
  const [selectedTarget, setSelectedTarget] = useState('proposed');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ImpactAnalysis | null>(null);

  // デモ用のシステムバージョン
  const systemVersions = [
    { id: 'current', name: '現行制度（2024年度）' },
    { id: 'proposed', name: '提案制度（2025年度）' },
    { id: 'v2023', name: '旧制度（2023年度）' },
  ];

  // 分析実行
  const runAnalysis = async () => {
    setIsAnalyzing(true);

    // デモ：2秒後に結果を表示
    setTimeout(() => {
      setAnalysis({
        id: 'ANALYSIS_001',
        analysisName: '2025年度制度変更影響分析',
        targetSystemId: selectedTarget,
        baselineSystemId: selectedBaseline,
        createdAt: new Date().toISOString(),
        createdBy: 'システム管理者',
        status: 'completed',
        targetChanges: {
          scoreChanges: {
            technical: { from: 50, to: 45 },
            contribution: { from: 50, to: 55 }
          },
          thresholdChanges: [
            { grade: 'S', from: { min: 90, max: 100 }, to: { min: 95, max: 100 } },
            { grade: 'A', from: { min: 80, max: 89 }, to: { min: 85, max: 94 } },
          ]
        },
        results: generateMockResults()
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  // モック結果生成
  const generateMockResults = (): ImpactAnalysisResults => ({
    executedAt: new Date().toISOString(),
    individualImpacts: {
      totalEmployees: 500,
      impactedEmployees: 187,
      impactPercentage: 37.4,
      gradeChanges: {
        improved: 45,
        unchanged: 268,
        declined: 187
      },
      topPositiveImpacts: [
        {
          employeeId: 'EMP_001',
          name: '山田太郎',
          department: 'リハビリテーション科',
          position: 'PT主任',
          currentGrade: 'B',
          newGrade: 'A',
          currentScore: 82,
          newScore: 86,
          salaryImpact: 50000,
          bonusImpact: 100000,
        },
        {
          employeeId: 'EMP_002',
          name: '佐藤花子',
          department: '看護部',
          position: '看護師長',
          currentGrade: 'B',
          newGrade: 'A',
          currentScore: 81,
          newScore: 85,
          salaryImpact: 45000,
          bonusImpact: 90000,
        },
      ],
      topNegativeImpacts: [
        {
          employeeId: 'EMP_010',
          name: '鈴木一郎',
          department: '総務部',
          position: '係長',
          currentGrade: 'A',
          newGrade: 'B',
          currentScore: 84,
          newScore: 82,
          salaryImpact: -30000,
          bonusImpact: -60000,
          riskLevel: 'high',
        },
      ],
      highRiskEmployees: [
        {
          employeeId: 'EMP_020',
          name: '高橋次郎',
          department: '営業部',
          position: '部長',
          currentGrade: 'S',
          newGrade: 'A',
          currentScore: 92,
          newScore: 88,
          salaryImpact: -80000,
          bonusImpact: -160000,
          riskLevel: 'high',
        },
      ]
    },
    departmentImpacts: {
      byDepartment: [
        {
          departmentId: 'DEPT_001',
          departmentName: 'リハビリテーション科',
          facilityName: '小原病院',
          employeeCount: 45,
          averageScoreChange: 2.3,
          scoreChangePercentage: 2.8,
          gradeDistribution: {
            current: { S: 2, A: 8, B: 20, C: 12, D: 3 },
            new: { S: 3, A: 10, B: 18, C: 11, D: 3 }
          },
          totalCostChange: 450000,
          costChangePercentage: 3.2,
          riskLevel: 'low',
          riskFactors: []
        },
        {
          departmentId: 'DEPT_002',
          departmentName: '総務部',
          facilityName: '本社',
          employeeCount: 25,
          averageScoreChange: -1.5,
          scoreChangePercentage: -1.8,
          gradeDistribution: {
            current: { S: 1, A: 5, B: 12, C: 6, D: 1 },
            new: { S: 0, A: 4, B: 11, C: 9, D: 1 }
          },
          totalCostChange: -180000,
          costChangePercentage: -2.1,
          riskLevel: 'medium',
          riskFactors: ['平均グレード低下', '士気低下リスク']
        },
      ],
      mostImproved: [],
      mostDeclined: []
    },
    compensationImpacts: {
      totalCostChange: 1200000,
      averageSalaryChange: 2400,
      bonusPoolChange: 800000,
      byGrade: [
        {
          grade: 'S',
          currentAverage: 8000000,
          newAverage: 8200000,
          changeAmount: 200000,
          changePercentage: 2.5,
          employeeCount: 10
        },
        {
          grade: 'A',
          currentAverage: 6500000,
          newAverage: 6600000,
          changeAmount: 100000,
          changePercentage: 1.5,
          employeeCount: 50
        },
        {
          grade: 'B',
          currentAverage: 5500000,
          newAverage: 5450000,
          changeAmount: -50000,
          changePercentage: -0.9,
          employeeCount: 200
        },
      ],
      byDepartment: [
        {
          departmentId: 'DEPT_001',
          departmentName: 'リハビリテーション科',
          currentCost: 14000000,
          newCost: 14450000,
          changeAmount: 450000,
          changePercentage: 3.2
        },
        {
          departmentId: 'DEPT_002',
          departmentName: '総務部',
          currentCost: 8500000,
          newCost: 8320000,
          changeAmount: -180000,
          changePercentage: -2.1
        },
      ]
    },
    riskAlerts: {
      level: 'medium',
      alerts: [
        {
          type: 'retention',
          severity: 'high',
          title: '優秀人材の流出リスク',
          description: 'S評価からA評価に下降する管理職が3名存在します',
          affectedCount: 3,
          recommendation: '個別面談の実施と移行措置の検討'
        },
        {
          type: 'morale',
          severity: 'medium',
          title: '部署間格差の拡大',
          description: 'リハビリ科と総務部で評価結果の格差が拡大しています',
          recommendation: '部署別の調整措置を検討'
        },
        {
          type: 'cost',
          severity: 'low',
          title: '人件費増加',
          description: '総人件費が1.2%増加します',
          affectedCount: 500,
          recommendation: '予算計画の見直し'
        },
      ],
      mitigationSuggestions: [
        '移行期間を設けて段階的に新制度を適用',
        '大幅にグレードが下がる職員への個別フォロー',
        '部署別の説明会を実施して理解を促進',
        '初年度は給与への反映を緩和する措置を検討'
      ]
    }
  });

  const getImpactIcon = (change: number) => {
    if (change > 0) return <ChevronUp className="h-4 w-4 text-green-600" />;
    if (change < 0) return <ChevronDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* 分析設定 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            影響分析設定
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">基準制度</label>
              <Select value={selectedBaseline} onValueChange={setSelectedBaseline}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {systemVersions.map(version => (
                    <SelectItem key={version.id} value={version.id}>
                      {version.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">比較対象制度</label>
              <Select value={selectedTarget} onValueChange={setSelectedTarget}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {systemVersions.map(version => (
                    <SelectItem key={version.id} value={version.id}>
                      {version.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={runAnalysis}
                disabled={isAnalyzing || selectedBaseline === selectedTarget}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>分析中...</>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    影響分析を実行
                  </>
                )}
              </Button>
            </div>
          </div>

          {isAnalyzing && (
            <div className="mt-4">
              <Progress value={66} className="w-full" />
              <p className="text-sm text-gray-600 mt-2">制度変更の影響を分析しています...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 分析結果 */}
      {analysis?.results && (
        <>
          {/* リスクアラート */}
          {analysis.results.riskAlerts.alerts.length > 0 && (
            <Alert className={
              analysis.results.riskAlerts.level === 'critical' ? 'border-red-500' :
              analysis.results.riskAlerts.level === 'high' ? 'border-orange-500' :
              analysis.results.riskAlerts.level === 'medium' ? 'border-yellow-500' :
              'border-blue-500'
            }>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>リスクアラート（{analysis.results.riskAlerts.level === 'critical' ? '重大' :
                analysis.results.riskAlerts.level === 'high' ? '高' :
                analysis.results.riskAlerts.level === 'medium' ? '中' : '低'}）</AlertTitle>
              <AlertDescription>
                <div className="mt-2 space-y-2">
                  {analysis.results.riskAlerts.alerts.map((alert, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Badge variant={
                        alert.severity === 'critical' || alert.severity === 'high' ? 'destructive' :
                        alert.severity === 'medium' ? 'default' : 'secondary'
                      }>
                        {alert.type === 'retention' ? '人材流出' :
                         alert.type === 'morale' ? '士気' :
                         alert.type === 'cost' ? 'コスト' :
                         alert.type === 'fairness' ? '公平性' : '法的'}
                      </Badge>
                      <div className="flex-1">
                        <p className="font-medium">{alert.title}</p>
                        <p className="text-sm text-gray-600">{alert.description}</p>
                        {alert.recommendation && (
                          <p className="text-sm text-blue-600 mt-1">→ {alert.recommendation}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* 結果タブ */}
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">概要</TabsTrigger>
              <TabsTrigger value="individual">個人影響</TabsTrigger>
              <TabsTrigger value="department">部署影響</TabsTrigger>
              <TabsTrigger value="compensation">給与・賞与</TabsTrigger>
              <TabsTrigger value="mitigation">対策提案</TabsTrigger>
            </TabsList>

            {/* 概要タブ */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">影響を受ける職員</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {analysis.results.individualImpacts.impactedEmployees}名
                    </div>
                    <p className="text-sm text-gray-600">
                      全{analysis.results.individualImpacts.totalEmployees}名中
                      （{analysis.results.individualImpacts.impactPercentage}%）
                    </p>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600">↑ グレード上昇</span>
                        <span>{analysis.results.individualImpacts.gradeChanges.improved}名</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">→ 変化なし</span>
                        <span>{analysis.results.individualImpacts.gradeChanges.unchanged}名</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-red-600">↓ グレード下降</span>
                        <span>{analysis.results.individualImpacts.gradeChanges.declined}名</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">総人件費への影響</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(analysis.results.compensationImpacts.totalCostChange)}
                    </div>
                    <p className="text-sm text-gray-600">
                      年間増加額
                    </p>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>平均給与変動</span>
                        <span>{formatCurrency(analysis.results.compensationImpacts.averageSalaryChange)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>賞与原資変動</span>
                        <span>{formatCurrency(analysis.results.compensationImpacts.bonusPoolChange)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">リスクレベル</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <AlertCircle className={
                        analysis.results.riskAlerts.level === 'critical' ? 'text-red-500' :
                        analysis.results.riskAlerts.level === 'high' ? 'text-orange-500' :
                        analysis.results.riskAlerts.level === 'medium' ? 'text-yellow-500' :
                        'text-blue-500'
                      } />
                      <div className="text-2xl font-bold">
                        {analysis.results.riskAlerts.level === 'critical' ? '重大' :
                         analysis.results.riskAlerts.level === 'high' ? '高' :
                         analysis.results.riskAlerts.level === 'medium' ? '中' : '低'}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {analysis.results.riskAlerts.alerts.length}件のアラート
                    </p>
                    <div className="mt-2">
                      <div className="flex gap-2 flex-wrap">
                        {analysis.results.riskAlerts.alerts.slice(0, 3).map((alert, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {alert.title.substring(0, 10)}...
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* グレード分布グラフ */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-sm">グレード分布の変化</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={[
                      { grade: 'S', 現行: 10, 新制度: 8 },
                      { grade: 'A', 現行: 50, 新制度: 45 },
                      { grade: 'B', 現行: 200, 新制度: 187 },
                      { grade: 'C', 現行: 180, 新制度: 200 },
                      { grade: 'D', 現行: 60, 新制度: 60 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="grade" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="現行" fill="#8884d8" />
                      <Bar dataKey="新制度" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 個人影響タブ */}
            <TabsContent value="individual">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">高リスク職員（大幅グレード下降）</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>氏名</TableHead>
                          <TableHead>部署</TableHead>
                          <TableHead>現グレード</TableHead>
                          <TableHead>新グレード</TableHead>
                          <TableHead>給与影響</TableHead>
                          <TableHead>リスク</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {analysis.results.individualImpacts.highRiskEmployees.map(emp => (
                          <TableRow key={emp.employeeId}>
                            <TableCell>{emp.name}</TableCell>
                            <TableCell>{emp.department}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{emp.currentGrade}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="destructive">{emp.newGrade}</Badge>
                            </TableCell>
                            <TableCell className="text-red-600">
                              {formatCurrency(emp.salaryImpact)}
                            </TableCell>
                            <TableCell>
                              <Badge variant="destructive">高</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">ポジティブ影響トップ5</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {analysis.results.individualImpacts.topPositiveImpacts.map(emp => (
                          <div key={emp.employeeId} className="flex items-center justify-between p-2 bg-green-50 rounded">
                            <div>
                              <p className="font-medium">{emp.name}</p>
                              <p className="text-sm text-gray-600">{emp.department}</p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1">
                                <Badge variant="outline">{emp.currentGrade}</Badge>
                                <span>→</span>
                                <Badge className="bg-green-600">{emp.newGrade}</Badge>
                              </div>
                              <p className="text-sm text-green-600">
                                +{formatCurrency(emp.salaryImpact + emp.bonusImpact)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">ネガティブ影響トップ5</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {analysis.results.individualImpacts.topNegativeImpacts.map(emp => (
                          <div key={emp.employeeId} className="flex items-center justify-between p-2 bg-red-50 rounded">
                            <div>
                              <p className="font-medium">{emp.name}</p>
                              <p className="text-sm text-gray-600">{emp.department}</p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1">
                                <Badge variant="outline">{emp.currentGrade}</Badge>
                                <span>→</span>
                                <Badge variant="destructive">{emp.newGrade}</Badge>
                              </div>
                              <p className="text-sm text-red-600">
                                {formatCurrency(emp.salaryImpact + emp.bonusImpact)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* 部署影響タブ */}
            <TabsContent value="department">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">部署別影響分析</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>部署名</TableHead>
                        <TableHead>施設</TableHead>
                        <TableHead>人数</TableHead>
                        <TableHead>平均スコア変化</TableHead>
                        <TableHead>コスト影響</TableHead>
                        <TableHead>リスク</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {analysis.results.departmentImpacts.byDepartment.map(dept => (
                        <TableRow key={dept.departmentId}>
                          <TableCell>{dept.departmentName}</TableCell>
                          <TableCell>{dept.facilityName}</TableCell>
                          <TableCell>{dept.employeeCount}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {getImpactIcon(dept.averageScoreChange)}
                              <span className={dept.averageScoreChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                                {formatPercentage(dept.scoreChangePercentage)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={dept.totalCostChange >= 0 ? 'text-red-600' : 'text-green-600'}>
                              {formatCurrency(dept.totalCostChange)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              dept.riskLevel === 'high' ? 'destructive' :
                              dept.riskLevel === 'medium' ? 'default' : 'secondary'
                            }>
                              {dept.riskLevel === 'high' ? '高' :
                               dept.riskLevel === 'medium' ? '中' : '低'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* 部署別グレード分布変化 */}
                  <div className="mt-6">
                    <h4 className="font-medium mb-4">部署別グレード分布の変化</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analysis.results.departmentImpacts.byDepartment.map(dept => ({
                        name: dept.departmentName,
                        ...Object.entries(dept.gradeDistribution.new).reduce((acc, [grade, count]) => {
                          acc[`新_${grade}`] = count;
                          return acc;
                        }, {} as any),
                        ...Object.entries(dept.gradeDistribution.current).reduce((acc, [grade, count]) => {
                          acc[`現_${grade}`] = count;
                          return acc;
                        }, {} as any),
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="現_S" stackId="current" fill="#8b5cf6" />
                        <Bar dataKey="現_A" stackId="current" fill="#3b82f6" />
                        <Bar dataKey="現_B" stackId="current" fill="#10b981" />
                        <Bar dataKey="現_C" stackId="current" fill="#f59e0b" />
                        <Bar dataKey="現_D" stackId="current" fill="#ef4444" />
                        <Bar dataKey="新_S" stackId="new" fill="#a78bfa" />
                        <Bar dataKey="新_A" stackId="new" fill="#60a5fa" />
                        <Bar dataKey="新_B" stackId="new" fill="#34d399" />
                        <Bar dataKey="新_C" stackId="new" fill="#fbbf24" />
                        <Bar dataKey="新_D" stackId="new" fill="#f87171" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 給与・賞与タブ */}
            <TabsContent value="compensation">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        総人件費変動
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-600">
                        +{formatCurrency(analysis.results.compensationImpacts.totalCostChange)}
                      </div>
                      <p className="text-sm text-gray-600">年間増加額</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">平均給与変動</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        +{formatCurrency(analysis.results.compensationImpacts.averageSalaryChange)}
                      </div>
                      <p className="text-sm text-gray-600">一人あたり</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">賞与原資変動</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        +{formatCurrency(analysis.results.compensationImpacts.bonusPoolChange)}
                      </div>
                      <p className="text-sm text-gray-600">年間総額</p>
                    </CardContent>
                  </Card>
                </div>

                {/* グレード別給与影響 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">グレード別給与影響</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>グレード</TableHead>
                          <TableHead>人数</TableHead>
                          <TableHead>現行平均</TableHead>
                          <TableHead>新平均</TableHead>
                          <TableHead>変動額</TableHead>
                          <TableHead>変動率</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {analysis.results.compensationImpacts.byGrade.map(grade => (
                          <TableRow key={grade.grade}>
                            <TableCell>
                              <Badge>{grade.grade}</Badge>
                            </TableCell>
                            <TableCell>{grade.employeeCount}名</TableCell>
                            <TableCell>{formatCurrency(grade.currentAverage)}</TableCell>
                            <TableCell>{formatCurrency(grade.newAverage)}</TableCell>
                            <TableCell className={grade.changeAmount >= 0 ? 'text-red-600' : 'text-green-600'}>
                              {formatCurrency(grade.changeAmount)}
                            </TableCell>
                            <TableCell>
                              <span className={grade.changePercentage >= 0 ? 'text-red-600' : 'text-green-600'}>
                                {formatPercentage(grade.changePercentage)}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* 部署別コスト影響 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">部署別人件費影響</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analysis.results.compensationImpacts.byDepartment}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="departmentName" />
                        <YAxis />
                        <Tooltip formatter={(value: any) => formatCurrency(value)} />
                        <Legend />
                        <Bar dataKey="currentCost" name="現行" fill="#8884d8" />
                        <Bar dataKey="newCost" name="新制度" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* 対策提案タブ */}
            <TabsContent value="mitigation">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    リスク軽減のための対策提案
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.results.riskAlerts.mitigationSuggestions.map((suggestion, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="mt-1">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                            {idx + 1}
                          </div>
                        </div>
                        <div className="flex-1">
                          <p>{suggestion}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2">推奨アクションプラン</h4>
                    <ol className="list-decimal list-inside space-y-2 text-sm">
                      <li>影響の大きい部署から順に説明会を実施</li>
                      <li>グレード下降者への個別面談（特に高リスク3名）</li>
                      <li>初年度は給与減額の上限を設定（例：-5%まで）</li>
                      <li>3ヶ月の試行期間を設けて問題点を洗い出し</li>
                      <li>四半期ごとに影響をモニタリングして調整</li>
                    </ol>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button>
                      <Download className="h-4 w-4 mr-2" />
                      詳細レポートをダウンロード
                    </Button>
                    <Button variant="outline">
                      影響を受ける職員リストを出力
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}