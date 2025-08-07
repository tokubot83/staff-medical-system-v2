'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Calendar,
  Play,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Users,
  Building,
  Award,
  Calculator,
  FileText,
  Download,
  RefreshCw
} from 'lucide-react';
import { evaluationBatchService } from '@/services/evaluationBatchService';
import { 
  EVALUATION_MATRIX,
  getEvaluationGradeColor,
  getEvaluationGradeLabel 
} from '@/types/two-axis-evaluation';

interface StaffEvaluation {
  staffId: string;
  staffName: string;
  department: string;
  jobCategory: string;
  technicalScore: number;
  facilityContributionScore: number;
  corporateContributionScore: number;
  totalScore: number;
  facilityRank: number;
  facilityTotal: number;
  facilityGrade: string;
  corporateRank: number;
  corporateTotal: number;
  corporateGrade: string;
  finalGrade: string;
}

export default function FinalEvaluationPage() {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [evaluationResults, setEvaluationResults] = useState<StaffEvaluation[]>([]);
  const [processProgress, setProcessProgress] = useState(0);

  const steps = [
    { id: 1, name: '技術評価集計', icon: Award, status: 'pending' },
    { id: 2, name: '組織貢献度集計', icon: Users, status: 'pending' },
    { id: 3, name: '相対評価計算', icon: Calculator, status: 'pending' },
    { id: 4, name: '最終グレード決定', icon: CheckCircle2, status: 'pending' }
  ];

  // 統合評価実行
  const executeFinalEvaluation = async () => {
    setIsProcessing(true);
    setCurrentStep(0);
    setProcessProgress(0);

    try {
      // Step 1: 技術評価集計
      setCurrentStep(1);
      setProcessProgress(25);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Step 2: 組織貢献度集計
      setCurrentStep(2);
      setProcessProgress(50);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Step 3: 相対評価計算
      setCurrentStep(3);
      setProcessProgress(75);
      const batchResult = await evaluationBatchService.executeBatchCalculation(`${selectedYear}-final`);
      
      // Step 4: 最終グレード決定
      setCurrentStep(4);
      setProcessProgress(100);
      
      // モックデータ生成
      const mockResults: StaffEvaluation[] = [
        {
          staffId: 'N001',
          staffName: '山田 花子',
          department: '内科病棟',
          jobCategory: '看護職',
          technicalScore: 42.5,
          facilityContributionScore: 22.5,
          corporateContributionScore: 20.0,
          totalScore: 85.0,
          facilityRank: 3,
          facilityTotal: 25,
          facilityGrade: 'A',
          corporateRank: 15,
          corporateTotal: 120,
          corporateGrade: 'A',
          finalGrade: 'A+'
        },
        {
          staffId: 'N002',
          staffName: '佐藤 太郎',
          department: '外科病棟',
          jobCategory: '看護職',
          technicalScore: 38.0,
          facilityContributionScore: 17.5,
          corporateContributionScore: 15.0,
          totalScore: 70.5,
          facilityRank: 8,
          facilityTotal: 25,
          facilityGrade: 'B',
          corporateRank: 45,
          corporateTotal: 120,
          corporateGrade: 'B',
          finalGrade: 'B'
        },
        {
          staffId: 'C001',
          staffName: '鈴木 美咲',
          department: '介護課',
          jobCategory: '介護職',
          technicalScore: 45.0,
          facilityContributionScore: 25.0,
          corporateContributionScore: 22.5,
          totalScore: 92.5,
          facilityRank: 1,
          facilityTotal: 15,
          facilityGrade: 'S',
          corporateRank: 5,
          corporateTotal: 80,
          corporateGrade: 'S',
          finalGrade: 'S+'
        }
      ];
      
      setEvaluationResults(mockResults);
      alert('統合評価が完了しました');
      
    } catch (error) {
      console.error('Evaluation failed:', error);
      alert('評価処理に失敗しました');
    } finally {
      setIsProcessing(false);
    }
  };

  // グレード分布計算
  const getGradeDistribution = () => {
    const distribution = { 'S+': 0, 'S': 0, 'A+': 0, 'A': 0, 'B': 0, 'C': 0, 'D': 0 };
    evaluationResults.forEach(result => {
      const grade = result.finalGrade as keyof typeof distribution;
      if (grade in distribution) {
        distribution[grade]++;
      }
    });
    return distribution;
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">年間統合評価（3月末実施）</h1>
        <p className="text-gray-600">技術評価と組織貢献度を統合し、最終評価を決定</p>
      </div>

      {/* 実行パネル */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            統合評価実行
          </CardTitle>
          <CardDescription>
            全職員の年間評価を統合し、施設内・法人内評価を確定します
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <select 
                className="px-3 py-2 border rounded-md"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                disabled={isProcessing}
              >
                <option value={2024}>2024年度</option>
                <option value={2023}>2023年度</option>
              </select>
              
              <Button 
                onClick={executeFinalEvaluation}
                disabled={isProcessing}
                className="flex items-center gap-2"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    処理中...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    統合評価を実行
                  </>
                )}
              </Button>
            </div>

            {/* 処理ステップ表示 */}
            {isProcessing && (
              <div className="space-y-3">
                <Progress value={processProgress} className="h-2" />
                <div className="grid grid-cols-4 gap-2">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;
                    
                    return (
                      <div 
                        key={step.id}
                        className={`p-3 rounded-lg border text-center transition-all ${
                          isActive ? 'bg-blue-50 border-blue-500' :
                          isCompleted ? 'bg-green-50 border-green-500' :
                          'bg-gray-50 border-gray-300'
                        }`}
                      >
                        <Icon className={`h-6 w-6 mx-auto mb-2 ${
                          isActive ? 'text-blue-600' :
                          isCompleted ? 'text-green-600' :
                          'text-gray-400'
                        }`} />
                        <p className="text-xs font-medium">{step.name}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 評価結果 */}
      {evaluationResults.length > 0 && (
        <>
          {/* サマリーカード */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">評価対象者</p>
                    <p className="text-2xl font-bold">{evaluationResults.length}名</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">平均スコア</p>
                    <p className="text-2xl font-bold">
                      {(evaluationResults.reduce((sum, r) => sum + r.totalScore, 0) / evaluationResults.length).toFixed(1)}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">最高評価</p>
                    <Badge className="text-lg px-3 py-1" variant="destructive">
                      S+ ({getGradeDistribution()['S+']}名)
                    </Badge>
                  </div>
                  <Award className="h-8 w-8 text-red-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">処理完了</p>
                    <p className="text-lg font-bold text-green-600">
                      <CheckCircle2 className="inline h-5 w-5 mr-1" />
                      成功
                    </p>
                  </div>
                  <FileText className="h-8 w-8 text-purple-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 結果タブ */}
          <Card>
            <CardContent className="pt-6">
              <Tabs defaultValue="list" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="list">評価一覧</TabsTrigger>
                  <TabsTrigger value="matrix">2軸マトリックス</TabsTrigger>
                  <TabsTrigger value="distribution">評価分布</TabsTrigger>
                </TabsList>

                {/* 評価一覧 */}
                <TabsContent value="list" className="mt-6">
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>職員名</TableHead>
                          <TableHead>部署</TableHead>
                          <TableHead>職種</TableHead>
                          <TableHead className="text-center">技術評価</TableHead>
                          <TableHead className="text-center">施設貢献</TableHead>
                          <TableHead className="text-center">法人貢献</TableHead>
                          <TableHead className="text-center">合計</TableHead>
                          <TableHead className="text-center">施設内</TableHead>
                          <TableHead className="text-center">法人内</TableHead>
                          <TableHead className="text-center">最終評価</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {evaluationResults.map((result) => (
                          <TableRow key={result.staffId}>
                            <TableCell className="font-medium">{result.staffName}</TableCell>
                            <TableCell>{result.department}</TableCell>
                            <TableCell>{result.jobCategory}</TableCell>
                            <TableCell className="text-center">{result.technicalScore}</TableCell>
                            <TableCell className="text-center">{result.facilityContributionScore}</TableCell>
                            <TableCell className="text-center">{result.corporateContributionScore}</TableCell>
                            <TableCell className="text-center font-bold">{result.totalScore}</TableCell>
                            <TableCell className="text-center">
                              <div>
                                <Badge variant="outline">{result.facilityGrade}</Badge>
                                <p className="text-xs text-gray-600 mt-1">
                                  {result.facilityRank}/{result.facilityTotal}位
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div>
                                <Badge variant="outline">{result.corporateGrade}</Badge>
                                <p className="text-xs text-gray-600 mt-1">
                                  {result.corporateRank}/{result.corporateTotal}位
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge 
                                className="text-lg px-3 py-1"
                                style={{ backgroundColor: getEvaluationGradeColor(result.finalGrade as any) }}
                              >
                                {result.finalGrade}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                {/* 2軸マトリックス */}
                <TabsContent value="matrix" className="mt-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-6 gap-1">
                      <div></div>
                      <div className="text-center font-semibold">S</div>
                      <div className="text-center font-semibold">A</div>
                      <div className="text-center font-semibold">B</div>
                      <div className="text-center font-semibold">C</div>
                      <div className="text-center font-semibold">D</div>
                      
                      {['S', 'A', 'B', 'C', 'D'].map((corpGrade) => (
                        <React.Fragment key={corpGrade}>
                          <div className="text-center font-semibold">{corpGrade}</div>
                          {['S', 'A', 'B', 'C', 'D'].map((facGrade) => {
                            const matrixItem = EVALUATION_MATRIX.find(
                              item => item.corporateEval === corpGrade && item.facilityEval === facGrade
                            );
                            const staffCount = evaluationResults.filter(
                              r => r.corporateGrade === corpGrade && r.facilityGrade === facGrade
                            ).length;
                            
                            return (
                              <div 
                                key={`${corpGrade}-${facGrade}`}
                                className="border p-3 text-center rounded-lg hover:shadow-lg transition-shadow"
                                style={{ 
                                  backgroundColor: matrixItem ? 
                                    `${getEvaluationGradeColor(matrixItem.finalEval)}20` : 
                                    '#f9f9f9' 
                                }}
                              >
                                <Badge variant="outline" className="mb-1">
                                  {matrixItem?.finalEval}
                                </Badge>
                                <p className="text-sm font-semibold">{staffCount}名</p>
                              </div>
                            );
                          })}
                        </React.Fragment>
                      ))}
                    </div>
                    
                    <div className="text-center text-sm text-gray-600">
                      <p>縦軸：法人内評価 / 横軸：施設内評価</p>
                    </div>
                  </div>
                </TabsContent>

                {/* 評価分布 */}
                <TabsContent value="distribution" className="mt-6">
                  <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
                    {Object.entries(getGradeDistribution()).map(([grade, count]) => (
                      <Card key={grade}>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <Badge 
                              className="mb-2 text-lg px-3 py-1"
                              style={{ backgroundColor: getEvaluationGradeColor(grade as any) }}
                            >
                              {grade}
                            </Badge>
                            <p className="text-2xl font-bold">{count}</p>
                            <p className="text-xs text-gray-600">
                              {getEvaluationGradeLabel(grade as any)}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {((count / evaluationResults.length) * 100).toFixed(1)}%
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* エクスポート */}
          <div className="mt-6 flex justify-end gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              CSVエクスポート
            </Button>
            <Button className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              評価レポート生成
            </Button>
          </div>
        </>
      )}

      {/* 注意事項 */}
      <Alert className="mt-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>統合評価について</AlertTitle>
        <AlertDescription className="mt-2 space-y-1">
          <p>• 3月末に年1回実施する最終評価処理です</p>
          <p>• 技術評価（50点）+ 施設貢献（25点）+ 法人貢献（25点）= 100点満点</p>
          <p>• 施設内・法人内での相対評価により最終グレード（S+～D）を決定</p>
          <p>• この評価結果は4月の昇給・昇格・人事異動に反映されます</p>
        </AlertDescription>
      </Alert>
    </div>
  );
}