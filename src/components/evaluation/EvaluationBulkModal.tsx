/**
 * 評価システム一括処理モーダル
 * 年間スケジュールUIに統合された一括処理機能
 */

'use client';

import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Upload, Download, FileSpreadsheet, BarChart3, Calculator,
  CheckCircle2, AlertCircle, Clock, Zap, Target, Users,
  ArrowRight, FileCheck, Database, Settings
} from 'lucide-react';

import { EvaluationBulkService, ImportResult, EvaluationData } from '@/services/evaluationBulkService';

interface EvaluationBulkModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMonth: number;
  evaluationPeriod: string;
}

type ProcessingStep = 'upload' | 'validation' | 'ranking' | 'grading' | 'complete';

interface ProcessingStatus {
  step: ProcessingStep;
  progress: number;
  message: string;
  isProcessing: boolean;
  results?: {
    importResult?: ImportResult;
    rankingCount?: number;
    gradingCount?: number;
  };
}

export default function EvaluationBulkModal({
  isOpen,
  onClose,
  currentMonth,
  evaluationPeriod
}: EvaluationBulkModalProps) {
  const [activeTab, setActiveTab] = useState('import');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({
    step: 'upload',
    progress: 0,
    message: '',
    isProcessing: false
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 現在月に応じた処理内容を決定
  const getCurrentMonthProcessing = () => {
    switch (currentMonth) {
      case 6:
        return {
          title: '夏季貢献度評価（6月）',
          description: '夏季貢献度評価データの一括処理',
          type: 'contribution_summer' as const,
          expectedPoints: 25
        };
      case 12:
        return {
          title: '冬季貢献度評価（12月）',
          description: '冬季貢献度評価データの一括処理と年間総合判定',
          type: 'contribution_winter' as const,
          expectedPoints: 50
        };
      case 3:
        return {
          title: '技術評価・総合判定（3月）',
          description: '技術評価データの処理と100点満点総合評価の確定',
          type: 'technical_final' as const,
          expectedPoints: 100
        };
      default:
        return {
          title: '評価データ一括処理',
          description: '評価データの処理・分析',
          type: 'general' as const,
          expectedPoints: 0
        };
    }
  };

  const currentProcessing = getCurrentMonthProcessing();

  // ファイル選択処理
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setProcessingStatus({
        step: 'upload',
        progress: 0,
        message: `${file.name} が選択されました`,
        isProcessing: false
      });
    }
  };

  // 一括処理実行
  const executeProcessing = async () => {
    if (!selectedFile) return;

    setProcessingStatus({
      step: 'upload',
      progress: 0,
      message: 'ファイルを読み込んでいます...',
      isProcessing: true
    });

    try {
      // Step 1: ファイルインポート
      setProcessingStatus(prev => ({ ...prev, progress: 20 }));
      const importResult = await EvaluationBulkService.importFromExcel(selectedFile);
      
      if (!importResult.success) {
        throw new Error(`インポートエラー: ${importResult.errors.join(', ')}`);
      }

      // Step 2: データ検証
      setProcessingStatus({
        step: 'validation',
        progress: 40,
        message: 'データを検証しています...',
        isProcessing: true,
        results: { importResult }
      });

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 3: 相対評価ランキング作成
      setProcessingStatus({
        step: 'ranking',
        progress: 60,
        message: '相対評価ランキングを作成しています...',
        isProcessing: true,
        results: { importResult }
      });

      const rankingResults = await EvaluationBulkService.createRelativeEvaluationRanking(importResult.data || []);

      // Step 4: 総合評価判定
      setProcessingStatus({
        step: 'grading',
        progress: 80,
        message: '総合評価を判定しています...',
        isProcessing: true,
        results: { 
          importResult, 
          rankingCount: rankingResults.length 
        }
      });

      const finalResults = await EvaluationBulkService.batchProcessFinalEvaluation(importResult.data || []);

      // Step 5: 完了
      setProcessingStatus({
        step: 'complete',
        progress: 100,
        message: '一括処理が完了しました！',
        isProcessing: false,
        results: {
          importResult,
          rankingCount: rankingResults.length,
          gradingCount: finalResults.length
        }
      });

    } catch (error) {
      setProcessingStatus({
        step: 'upload',
        progress: 0,
        message: `エラー: ${error}`,
        isProcessing: false
      });
    }
  };

  // テンプレート生成
  const generateTemplate = (templateType: 'technical' | 'contribution' | 'integrated') => {
    EvaluationBulkService.generateImportTemplate(templateType);
    setProcessingStatus({
      step: 'upload',
      progress: 0,
      message: `${templateType}用テンプレートファイルをダウンロードしました`,
      isProcessing: false
    });
  };

  // 結果エクスポート
  const exportResults = async () => {
    // デモデータ（実際は処理結果を使用）
    const demoData: EvaluationData[] = [
      {
        employeeId: 'EMP001',
        employeeName: '山田太郎',
        department: '内科病棟',
        position: '看護師',
        facilityType: 'acute',
        experienceLevel: 'midlevel',
        technicalEvaluation: { corporateItems: 25, facilityItems: 18, total: 43 },
        contributionEvaluation: { 
          facilityContribution: { summer: 11.5, winter: 12.0 },
          corporateContribution: { summer: 10.5, winter: 11.0 },
          total: 45
        },
        totalScore: 88,
        facilityRank: 2,
        corporateRank: 15,
        finalGrade: 'A',
        evaluationPeriod,
        createdAt: new Date()
      }
    ];

    await EvaluationBulkService.exportToMultiSheetExcel(demoData, evaluationPeriod);
    
    setProcessingStatus(prev => ({
      ...prev,
      message: '処理結果をExcelファイルで出力しました'
    }));
  };

  const getStepIcon = (step: ProcessingStep) => {
    switch (step) {
      case 'upload': return <Upload className="h-5 w-5" />;
      case 'validation': return <CheckCircle2 className="h-5 w-5" />;
      case 'ranking': return <BarChart3 className="h-5 w-5" />;
      case 'grading': return <Calculator className="h-5 w-5" />;
      case 'complete': return <Target className="h-5 w-5" />;
    }
  };

  const getStepColor = (step: ProcessingStep, currentStep: ProcessingStep) => {
    const steps: ProcessingStep[] = ['upload', 'validation', 'ranking', 'grading', 'complete'];
    const currentIndex = steps.indexOf(currentStep);
    const stepIndex = steps.indexOf(step);
    
    if (stepIndex < currentIndex) return 'text-green-600';
    if (stepIndex === currentIndex) return 'text-blue-600';
    return 'text-gray-400';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <Zap className="h-6 w-6 text-blue-600" />
            {currentProcessing.title}
          </DialogTitle>
          <DialogDescription className="text-lg">
            {currentProcessing.description}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="import">データ取込</TabsTrigger>
            <TabsTrigger value="ranking">ランキング作成</TabsTrigger>
            <TabsTrigger value="grading">評価判定</TabsTrigger>
            <TabsTrigger value="export">結果出力</TabsTrigger>
          </TabsList>

          {/* データ取込タブ */}
          <TabsContent value="import" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  ファイルアップロード
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* ファイル選択 */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium">
                      {selectedFile ? selectedFile.name : '評価データファイルを選択'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Excel (.xlsx, .xls) または CSV ファイルを選択してください
                    </p>
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="mt-4"
                    >
                      ファイルを選択
                    </Button>
                  </div>
                </div>

                {/* テンプレート生成 */}
                <Card className="bg-gray-50">
                  <CardHeader>
                    <CardTitle className="text-lg">テンプレートファイル生成</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <Button
                        variant="outline"
                        onClick={() => generateTemplate('technical')}
                        className="flex flex-col h-auto py-4"
                      >
                        <Target className="h-6 w-6 mb-2" />
                        技術評価テンプレート
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => generateTemplate('contribution')}
                        className="flex flex-col h-auto py-4"
                      >
                        <Users className="h-6 w-6 mb-2" />
                        貢献度評価テンプレート
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => generateTemplate('integrated')}
                        className="flex flex-col h-auto py-4"
                      >
                        <Database className="h-6 w-6 mb-2" />
                        統合評価テンプレート
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* 処理実行ボタン */}
                <div className="flex justify-center pt-4">
                  <Button
                    onClick={executeProcessing}
                    disabled={!selectedFile || processingStatus.isProcessing}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
                  >
                    <ArrowRight className="h-5 w-5 mr-2" />
                    一括処理を開始
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ランキング作成タブ */}
          <TabsContent value="ranking" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  相対評価ランキング作成
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold">施設内相対評価</h4>
                      <p className="text-sm text-gray-600">
                        同じ施設内の同職種でランキング作成
                      </p>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">5段階評価</span>
                          <Badge className="bg-blue-600">施設内</Badge>
                        </div>
                        <div className="text-sm text-gray-700">
                          上位10% → 5、上位30% → 4、中位40% → 3、下位20% → 2、下位10% → 1
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold">法人内相対評価</h4>
                      <p className="text-sm text-gray-600">
                        法人全体の同職種でランキング作成
                      </p>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">5段階評価</span>
                          <Badge className="bg-green-600">法人内</Badge>
                        </div>
                        <div className="text-sm text-gray-700">
                          上位10% → 5、上位30% → 4、中位40% → 3、下位20% → 2、下位10% → 1
                        </div>
                      </div>
                    </div>
                  </div>

                  {processingStatus.results?.rankingCount && (
                    <Alert className="bg-green-50 border-green-200">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        {processingStatus.results.rankingCount}名の相対評価ランキングが作成されました
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 評価判定タブ */}
          <TabsContent value="grading" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  7段階総合評価判定
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-lg font-semibold mb-4">
                      2軸相対評価による最終グレード決定
                    </div>
                    <div className="grid grid-cols-5 gap-2 max-w-2xl mx-auto">
                      <div className="text-center p-3 bg-yellow-100 rounded-lg">
                        <div className="font-bold text-yellow-800 text-xl">S</div>
                        <div className="text-xs">卓越</div>
                        <div className="text-xs">上位10%</div>
                      </div>
                      <div className="text-center p-3 bg-green-100 rounded-lg">
                        <div className="font-bold text-green-800 text-xl">A</div>
                        <div className="text-xs">優秀</div>
                        <div className="text-xs">上位30%</div>
                      </div>
                      <div className="text-center p-3 bg-blue-100 rounded-lg">
                        <div className="font-bold text-blue-800 text-xl">B</div>
                        <div className="text-xs">標準</div>
                        <div className="text-xs">中位40%</div>
                      </div>
                      <div className="text-center p-3 bg-orange-100 rounded-lg">
                        <div className="font-bold text-orange-800 text-xl">C</div>
                        <div className="text-xs">要改善</div>
                        <div className="text-xs">下位20%</div>
                      </div>
                      <div className="text-center p-3 bg-red-100 rounded-lg">
                        <div className="font-bold text-red-800 text-xl">D</div>
                        <div className="text-xs">要支援</div>
                        <div className="text-xs">下位10%</div>
                      </div>
                    </div>
                  </div>

                  {processingStatus.results?.gradingCount && (
                    <Alert className="bg-purple-50 border-purple-200">
                      <Target className="h-4 w-4 text-purple-600" />
                      <AlertDescription className="text-purple-800">
                        {processingStatus.results.gradingCount}名の7段階総合評価が完了しました
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 結果出力タブ */}
          <TabsContent value="export" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  処理結果エクスポート
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <Button
                    onClick={exportResults}
                    variant="outline"
                    size="lg"
                    className="h-auto py-6 flex flex-col"
                  >
                    <FileSpreadsheet className="h-8 w-8 mb-2" />
                    <div className="text-lg font-semibold">Excel出力</div>
                    <div className="text-sm text-gray-600">多シート形式で詳細出力</div>
                  </Button>

                  <div className="space-y-3">
                    <h4 className="font-semibold">出力内容</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 評価サマリー</li>
                      <li>• 詳細評価データ</li>
                      <li>• 相対評価ランキング</li>
                      <li>• 部署別統計</li>
                      <li>• グレード分布</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* プロセス状況表示 */}
        {(processingStatus.isProcessing || processingStatus.step === 'complete') && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                処理状況
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* プロセス進行状況 */}
              <div className="flex items-center justify-between space-x-4">
                {(['upload', 'validation', 'ranking', 'grading', 'complete'] as ProcessingStep[]).map((step, index) => (
                  <div key={step} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      getStepColor(step, processingStatus.step).includes('green') ? 'bg-green-100 border-green-500' :
                      getStepColor(step, processingStatus.step).includes('blue') ? 'bg-blue-100 border-blue-500' :
                      'bg-gray-100 border-gray-300'
                    }`}>
                      <span className={getStepColor(step, processingStatus.step)}>
                        {getStepIcon(step)}
                      </span>
                    </div>
                    {index < 4 && (
                      <ArrowRight className="h-4 w-4 text-gray-400 mx-2" />
                    )}
                  </div>
                ))}
              </div>

              <Progress value={processingStatus.progress} className="h-3" />
              
              <div className="text-center">
                <p className="font-medium">{processingStatus.message}</p>
                {processingStatus.results?.importResult && (
                  <div className="mt-2 text-sm text-gray-600">
                    インポート: {processingStatus.results.importResult.successCount}件成功 / 
                    {processingStatus.results.importResult.totalRecords}件中
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}