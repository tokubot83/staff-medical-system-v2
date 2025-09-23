'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Calculator,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  AlertCircle,
  FileText,
  Download,
  RefreshCw,
} from 'lucide-react';
import { EvaluationMatrixService } from '@/services/evaluationMatrixService';

// サンプル従業員データ
const sampleEmployees = [
  {
    id: 'EMP001',
    name: '山田太郎',
    department: 'リハビリテーション科',
    facility: '小原病院',
    position: '理学療法士',
    facilityGrade: 'A',
    corporateGrade: 'B',
    currentSalary: 4500000,
    technicalScore: 45,
    contributionScore: 42
  },
  {
    id: 'EMP002',
    name: '佐藤花子',
    department: 'リハビリテーション科',
    facility: '小原病院',
    position: '作業療法士',
    facilityGrade: 'S',
    corporateGrade: 'A',
    currentSalary: 5200000,
    technicalScore: 48,
    contributionScore: 47
  },
  {
    id: 'EMP003',
    name: '鈴木一郎',
    department: '看護部',
    facility: '小原病院',
    position: '看護師',
    facilityGrade: 'B',
    corporateGrade: 'B',
    currentSalary: 4200000,
    technicalScore: 40,
    contributionScore: 38
  },
  {
    id: 'EMP004',
    name: '田中美咲',
    department: '看護部',
    facility: '小原病院',
    position: '主任看護師',
    facilityGrade: 'A',
    corporateGrade: 'A',
    currentSalary: 5500000,
    technicalScore: 46,
    contributionScore: 45
  },
  {
    id: 'EMP005',
    name: '高橋健太',
    department: 'リハビリテーション科',
    facility: '小原病院',
    position: '言語聴覚士',
    facilityGrade: 'C',
    corporateGrade: 'D',
    currentSalary: 3800000,
    technicalScore: 35,
    contributionScore: 32
  },
];

export const DynamicEvaluationCalculator: React.FC = () => {
  const [evaluationService, setEvaluationService] = useState<EvaluationMatrixService | null>(null);
  const [employees, setEmployees] = useState(sampleEmployees);
  const [evaluationResults, setEvaluationResults] = useState<any[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [totalCostImpact, setTotalCostImpact] = useState(0);
  const [distributionData, setDistributionData] = useState<Record<string, number>>({});
  const [isCalculating, setIsCalculating] = useState(false);

  // サービスの初期化
  useEffect(() => {
    setEvaluationService(EvaluationMatrixService.getInstance());
  }, []);

  // 評価を計算
  const calculateEvaluations = async () => {
    if (!evaluationService) return;

    setIsCalculating(true);
    const results: any[] = [];
    let totalImpact = 0;
    const distribution: Record<string, number> = {
      '7': 0, '6': 0, '5': 0, '4': 0, '3': 0, '2': 0, '1': 0
    };

    // フィルタリング
    const filteredEmployees = selectedDepartment === 'all'
      ? employees
      : employees.filter(emp => emp.department === selectedDepartment);

    // 各従業員の評価を計算
    for (const employee of filteredEmployees) {
      // 最終評価を計算
      const evaluation = evaluationService.calculateFinalEvaluation(
        employee.facilityGrade,
        employee.corporateGrade,
        employee.department,
        employee.facility
      );

      // 給与調整を計算
      const salaryAdjustment = evaluationService.calculateSalaryAdjustment(
        employee.currentSalary,
        evaluation.finalGrade
      );

      const result = {
        ...employee,
        finalGrade: evaluation.finalGrade,
        finalGradeLabel: evaluation.finalGradeLabel,
        isOverride: evaluation.isOverride,
        newSalary: salaryAdjustment.newSalary,
        salaryChange: salaryAdjustment.adjustmentAmount,
        salaryChangeRate: salaryAdjustment.adjustmentRate,
        bonusMultiplier: salaryAdjustment.bonusMultiplier,
        totalScore: employee.technicalScore + employee.contributionScore
      };

      results.push(result);
      totalImpact += salaryAdjustment.adjustmentAmount;
      distribution[evaluation.finalGrade]++;
    }

    setEvaluationResults(results);
    setTotalCostImpact(totalImpact);
    setDistributionData(distribution);
    setIsCalculating(false);
  };

  // 初回計算
  useEffect(() => {
    if (evaluationService) {
      calculateEvaluations();
    }
  }, [evaluationService, selectedDepartment]);

  // グレードの色を取得
  const getGradeColor = (grade: string): string => {
    const colors: Record<string, string> = {
      '7': '#e74c3c', '6': '#e67e22', '5': '#f39c12',
      '4': '#f1c40f', '3': '#2ecc71', '2': '#3498db', '1': '#9b59b6'
    };
    return colors[grade] || '#95a5a6';
  };

  // CSVエクスポート
  const exportToCSV = () => {
    const headers = ['ID', '氏名', '部署', '施設内評価', '法人内評価', '最終評価', '現在給与', '新給与', '変動額', '変動率'];
    const rows = evaluationResults.map(r => [
      r.id,
      r.name,
      r.department,
      r.facilityGrade,
      r.corporateGrade,
      `${r.finalGrade}(${r.finalGradeLabel})`,
      r.currentSalary,
      r.newSalary,
      r.salaryChange,
      `${r.salaryChangeRate.toFixed(1)}%`
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evaluation_results_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // 部署リストを取得
  const departments = [...new Set(employees.map(e => e.department))];

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Calculator className="h-6 w-6" />
            動的評価計算システム
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={calculateEvaluations}
              disabled={isCalculating}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isCalculating ? 'animate-spin' : ''}`} />
              再計算
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportToCSV}
              disabled={evaluationResults.length === 0}
            >
              <Download className="h-4 w-4 mr-1" />
              CSV出力
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="calculation" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calculation">評価計算</TabsTrigger>
            <TabsTrigger value="distribution">分布分析</TabsTrigger>
            <TabsTrigger value="impact">影響分析</TabsTrigger>
          </TabsList>

          <TabsContent value="calculation" className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="department-filter">部署フィルター</Label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger id="department-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部署</SelectItem>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" />
                <span>対象: {evaluationResults.length}名</span>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead>氏名</TableHead>
                    <TableHead>部署</TableHead>
                    <TableHead>施設内</TableHead>
                    <TableHead>法人内</TableHead>
                    <TableHead>最終評価</TableHead>
                    <TableHead className="text-right">現在給与</TableHead>
                    <TableHead className="text-right">新給与</TableHead>
                    <TableHead className="text-right">変動額</TableHead>
                    <TableHead className="text-center">賞与率</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {evaluationResults.map(result => (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium">{result.name}</TableCell>
                      <TableCell>{result.department}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{result.facilityGrade}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{result.corporateGrade}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge
                            style={{
                              backgroundColor: getGradeColor(result.finalGrade),
                              color: '#fff'
                            }}
                          >
                            {result.finalGrade} ({result.finalGradeLabel})
                          </Badge>
                          {result.isOverride && (
                            <Badge className="bg-blue-500 text-white text-xs">部署</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        ¥{result.currentSalary.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        ¥{result.newSalary.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {result.salaryChange > 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : result.salaryChange < 0 ? (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          ) : null}
                          <span className={
                            result.salaryChange > 0 ? 'text-green-600' :
                            result.salaryChange < 0 ? 'text-red-600' : ''
                          }>
                            ¥{Math.abs(result.salaryChange).toLocaleString()}
                            <span className="text-xs ml-1">
                              ({result.salaryChangeRate > 0 ? '+' : ''}{result.salaryChangeRate.toFixed(1)}%)
                            </span>
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">
                          {(result.bonusMultiplier * 100).toFixed(0)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="distribution" className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                現在のマトリックス定義による評価分布を表示しています。
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(distributionData).map(([grade, count]) => {
                const percentage = evaluationResults.length > 0
                  ? ((count / evaluationResults.length) * 100).toFixed(1)
                  : '0';
                const gradeLabels: Record<string, string> = {
                  '7': 'S+', '6': 'S', '5': 'A', '4': 'B+',
                  '3': 'B', '2': 'C', '1': 'D'
                };

                return (
                  <Card key={grade}>
                    <CardContent className="p-4 text-center">
                      <Badge
                        className="text-white font-bold mb-2"
                        style={{
                          backgroundColor: getGradeColor(grade)
                        }}
                      >
                        {grade} ({gradeLabels[grade]})
                      </Badge>
                      <div className="text-2xl font-bold">{count}名</div>
                      <div className="text-sm text-gray-500">{percentage}%</div>
                      <Progress value={parseFloat(percentage)} className="mt-2" />
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-semibold">分布サマリー</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">最高評価（6-7）:</span>
                  <span className="ml-2 font-medium">
                    {(distributionData['7'] || 0) + (distributionData['6'] || 0)}名
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">標準評価（3-5）:</span>
                  <span className="ml-2 font-medium">
                    {(distributionData['5'] || 0) + (distributionData['4'] || 0) + (distributionData['3'] || 0)}名
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">要改善（1-2）:</span>
                  <span className="ml-2 font-medium">
                    {(distributionData['2'] || 0) + (distributionData['1'] || 0)}名
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">平均グレード:</span>
                  <span className="ml-2 font-medium">
                    {evaluationResults.length > 0
                      ? (evaluationResults.reduce((sum, r) => sum + parseInt(r.finalGrade), 0) / evaluationResults.length).toFixed(1)
                      : '-'}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="impact" className="space-y-4">
            <Alert className={totalCostImpact >= 0 ? '' : 'border-red-500'}>
              <DollarSign className="h-4 w-4" />
              <AlertDescription>
                総人件費影響額:
                <span className={`ml-2 font-bold text-lg ${totalCostImpact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {totalCostImpact >= 0 ? '+' : ''}¥{totalCostImpact.toLocaleString()}
                </span>
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">昇給対象者</span>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {evaluationResults.filter(r => r.salaryChange > 0).length}名
                  </div>
                  <div className="text-sm text-gray-500">
                    総額: +¥{evaluationResults
                      .filter(r => r.salaryChange > 0)
                      .reduce((sum, r) => sum + r.salaryChange, 0)
                      .toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">現状維持</span>
                    <span className="h-4 w-4">－</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {evaluationResults.filter(r => r.salaryChange === 0).length}名
                  </div>
                  <div className="text-sm text-gray-500">
                    変動なし
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">減給対象者</span>
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  </div>
                  <div className="text-2xl font-bold text-red-600">
                    {evaluationResults.filter(r => r.salaryChange < 0).length}名
                  </div>
                  <div className="text-sm text-gray-500">
                    総額: ¥{Math.abs(evaluationResults
                      .filter(r => r.salaryChange < 0)
                      .reduce((sum, r) => sum + r.salaryChange, 0))
                      .toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-semibold">部署別影響</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>部署</TableHead>
                    <TableHead className="text-center">人数</TableHead>
                    <TableHead className="text-right">平均給与変動</TableHead>
                    <TableHead className="text-right">総影響額</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.map(dept => {
                    const deptResults = evaluationResults.filter(r => r.department === dept);
                    const deptTotal = deptResults.reduce((sum, r) => sum + r.salaryChange, 0);
                    const deptAverage = deptResults.length > 0 ? deptTotal / deptResults.length : 0;

                    return (
                      <TableRow key={dept}>
                        <TableCell>{dept}</TableCell>
                        <TableCell className="text-center">{deptResults.length}</TableCell>
                        <TableCell className="text-right">
                          <span className={deptAverage >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {deptAverage >= 0 ? '+' : ''}¥{Math.abs(Math.round(deptAverage)).toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={deptTotal >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {deptTotal >= 0 ? '+' : ''}¥{Math.abs(deptTotal).toLocaleString()}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};