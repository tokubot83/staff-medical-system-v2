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
  Play, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  RefreshCw,
  Download,
  Calendar,
  Users,
  Building,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { evaluationBatchService, BatchProcessResult, BatchError } from '@/services/evaluationBatchService';
import ExcelImport from '@/components/evaluation/ExcelImport';

export default function EvaluationBatchPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processResult, setProcessResult] = useState<BatchProcessResult | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('2024-H2');
  const [progress, setProgress] = useState(0);

  // バッチ処理の実行
  const executeBatch = async () => {
    setIsProcessing(true);
    setProgress(0);
    
    // プログレスバーのシミュレーション
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 500);

    try {
      const result = await evaluationBatchService.executeBatchCalculation(selectedPeriod);
      setProcessResult(result);
      setProgress(100);
    } catch (error) {
      console.error('Batch process failed:', error);
      alert('バッチ処理に失敗しました');
    } finally {
      clearInterval(progressInterval);
      setIsProcessing(false);
    }
  };

  // 処理状態の色分け
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'processing': return 'bg-blue-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // エラー種別の日本語化
  const getErrorTypeLabel = (errorType: string) => {
    switch (errorType) {
      case 'MISSING_DATA': return 'データ不足';
      case 'CALCULATION_ERROR': return '計算エラー';
      case 'VALIDATION_ERROR': return '検証エラー';
      default: return errorType;
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">評価バッチ処理管理</h1>
        <p className="text-gray-600">評価期間終了後の一括計算処理を管理します</p>
      </div>

      {/* 処理実行パネル */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            バッチ処理実行
          </CardTitle>
          <CardDescription>
            選択した評価期間の全職員データを一括計算します
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <select 
                className="px-3 py-2 border rounded-md"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                disabled={isProcessing}
              >
                <option value="2024-H2">2024年度 下期</option>
                <option value="2024-H1">2024年度 上期</option>
                <option value="2023-H2">2023年度 下期</option>
              </select>
              
              <Button 
                onClick={executeBatch}
                disabled={isProcessing}
                className="flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    処理中...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    バッチ処理を実行
                  </>
                )}
              </Button>
            </div>

            {isProcessing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>処理進捗</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-gray-600">
                  4軸独立評価（夏施設・夏法人・冬施設・冬法人）の相対順位計算を実行中...
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 処理結果 */}
      {processResult && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                処理結果サマリー
              </span>
              <Badge variant="outline">
                {new Date(processResult.processedAt).toLocaleString('ja-JP')}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">処理対象</p>
                      <p className="text-2xl font-bold">{processResult.totalCount}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">成功</p>
                      <p className="text-2xl font-bold text-green-600">
                        {processResult.successCount}
                      </p>
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-green-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">失敗</p>
                      <p className="text-2xl font-bold text-red-600">
                        {processResult.failureCount}
                      </p>
                    </div>
                    <XCircle className="h-8 w-8 text-red-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">成功率</p>
                      <p className="text-2xl font-bold">
                        {Math.round((processResult.successCount / processResult.totalCount) * 100)}%
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="rankings" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="rankings">ランキング結果</TabsTrigger>
                <TabsTrigger value="distribution">評価分布</TabsTrigger>
                <TabsTrigger value="errors">エラー詳細</TabsTrigger>
              </TabsList>

              {/* ランキング結果タブ */}
              <TabsContent value="rankings" className="mt-4">
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>職員ID</TableHead>
                        <TableHead>施設</TableHead>
                        <TableHead>職種</TableHead>
                        <TableHead className="text-center">総合点</TableHead>
                        <TableHead className="text-center" colSpan={2}>夏季評価</TableHead>
                        <TableHead className="text-center" colSpan={2}>冬季評価</TableHead>
                        <TableHead className="text-center">最終評価</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {processResult.rankings.slice(0, 10).map((ranking) => (
                        <TableRow key={ranking.staffId}>
                          <TableCell className="font-mono text-sm">
                            {ranking.staffId}
                          </TableCell>
                          <TableCell>{ranking.facilityId}</TableCell>
                          <TableCell>{ranking.jobCategory}</TableCell>
                          <TableCell className="text-center font-semibold">
                            {ranking.totalScore.toFixed(1)}
                          </TableCell>
                          {/* 夏季評価 */}
                          <TableCell className="text-center border-l">
                            <div className="text-xs">
                              <div>施設: {ranking.details?.summer.facilityPercentile ? 
                                `上位${ranking.details.summer.facilityPercentile.toFixed(0)}%` : '-'}
                              </div>
                              <Badge variant="outline" className="mt-1 text-xs">
                                {ranking.details?.summer.facilityGrade || '-'}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="text-xs">
                              <div>法人: {ranking.details?.summer.corporatePercentile ? 
                                `上位${ranking.details.summer.corporatePercentile.toFixed(0)}%` : '-'}
                              </div>
                              <Badge variant="outline" className="mt-1 text-xs">
                                {ranking.details?.summer.corporateGrade || '-'}
                              </Badge>
                            </div>
                          </TableCell>
                          {/* 冬季評価 */}
                          <TableCell className="text-center border-l">
                            <div className="text-xs">
                              <div>施設: {ranking.details?.winter.facilityPercentile ? 
                                `上位${ranking.details.winter.facilityPercentile.toFixed(0)}%` : '-'}
                              </div>
                              <Badge variant="outline" className="mt-1 text-xs">
                                {ranking.details?.winter.facilityGrade || '-'}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="text-xs">
                              <div>法人: {ranking.details?.winter.corporatePercentile ? 
                                `上位${ranking.details.winter.corporatePercentile.toFixed(0)}%` : '-'}
                              </div>
                              <Badge variant="outline" className="mt-1 text-xs">
                                {ranking.details?.winter.corporateGrade || '-'}
                              </Badge>
                            </div>
                          </TableCell>
                          {/* 最終評価 */}
                          <TableCell className="text-center border-l">
                            <Badge className={
                              ranking.finalGrade.includes('S') ? 'bg-yellow-500' :
                              ranking.finalGrade.includes('A') ? 'bg-green-500' :
                              ranking.finalGrade === 'B' ? 'bg-blue-500' :
                              ranking.finalGrade === 'C' ? 'bg-orange-500' :
                              'bg-red-500'
                            }>
                              {ranking.finalGrade}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {processResult.rankings.length > 10 && (
                  <div className="mt-4 flex justify-center">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      全データをエクスポート
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* 評価分布タブ */}
              <TabsContent value="distribution" className="mt-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {['S', 'A', 'B', 'C', 'D'].map((grade) => {
                    const count = processResult.rankings.filter(
                      r => r.finalGrade.includes(grade)
                    ).length;
                    const percentage = (count / processResult.successCount) * 100;
                    
                    return (
                      <Card key={grade}>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <Badge className="mb-2 text-lg px-3 py-1">
                              {grade}
                            </Badge>
                            <p className="text-2xl font-bold">{count}名</p>
                            <p className="text-sm text-gray-600">
                              {percentage.toFixed(1)}%
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <Alert className="mt-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>評価分布の目安</AlertTitle>
                  <AlertDescription className="space-y-1">
                    <p>S: 上位10%、A: 上位11-30%、B: 上位31-70%、C: 上位71-90%、D: 下位10%</p>
                    <p className="text-xs mt-2">※ 夏季・冬季の施設/法人貢献度をそれぞれ独立して相対評価</p>
                  </AlertDescription>
                </Alert>
              </TabsContent>

              {/* エラー詳細タブ */}
              <TabsContent value="errors" className="mt-4">
                {processResult.errors.length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>職員ID</TableHead>
                          <TableHead>エラー種別</TableHead>
                          <TableHead>メッセージ</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {processResult.errors.map((error: BatchError, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-mono text-sm">
                              {error.staffId}
                            </TableCell>
                            <TableCell>
                              <Badge variant="destructive">
                                {getErrorTypeLabel(error.errorType)}
                              </Badge>
                            </TableCell>
                            <TableCell>{error.message}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>
                      エラーは発生していません
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Excelインポート */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Excelデータ一括インポート
          </CardTitle>
          <CardDescription>
            組織貢献度評価データをExcelファイルから一括インポートしてバッチ処理を実行します
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExcelImport />
        </CardContent>
      </Card>

      {/* 注意事項 */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>バッチ処理に関する注意事項</AlertTitle>
        <AlertDescription className="mt-2 space-y-1">
          <p>• バッチ処理は評価期間終了後、全職員の評価入力が完了してから実行してください</p>
          <p>• 4軸独立評価により、夏季施設・夏季法人・冬季施設・冬季法人をそれぞれ相対評価します</p>
          <p>• Excelインポートでは、管理者が入力した素点を基に自動的に相対評価・配点計算されます</p>
          <p>• 処理には数分かかる場合があります。処理中はブラウザを閉じないでください</p>
          <p>• 一度確定した評価結果の再計算は、管理者権限が必要です</p>
          <p>• 処理結果は自動的にデータベースに保存されます</p>
        </AlertDescription>
      </Alert>
    </div>
  );
}