'use client';

import React, { useState, useEffect } from 'react';
import CommonHeader from '@/components/CommonHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  BarChart3, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Download,
  Upload,
  PlayCircle,
  RefreshCw,
  TrendingUp,
  FileSpreadsheet,
  Calculator,
  Eye,
  ChevronRight,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import RelativeEvaluationEngine from '@/services/RelativeEvaluationEngine';
import IntegratedJudgment from '@/components/evaluation/IntegratedJudgment';
import { 
  EvaluationDataIntegrationService, 
  type FacilityCompletionStatus, 
  type CompletedStaffEvaluation,
  type EvaluationIntegrationStats
} from '@/services/evaluationDataIntegrationService';

interface FacilityProgress {
  facilityId: string;
  facilityName: string;
  totalStaff: number;
  technicalCompleted: number;
  technicalInProgress: number;
  technicalNotStarted: number;
  provisionalGraded: number;
  finalGraded: number;
}

interface StaffEvaluation {
  staffId: string;
  staffName: string;
  facilityId: string;
  facilityName: string;
  jobCategory: string;
  experienceLevel: string;
  technicalScore: number;
  contributionScore: number;
  totalScore: number;
  facilityGrade?: 'S' | 'A' | 'B' | 'C' | 'D';
  corporateGrade?: 'S' | 'A' | 'B' | 'C' | 'D';
  finalGrade?: 'S+' | 'S' | 'A+' | 'A' | 'B' | 'C' | 'D';
  status: 'pending' | 'provisional' | 'final';
}

export default function RelativeGradingPage() {
  const [activeTab, setActiveTab] = useState('progress');
  const [selectedFacility, setSelectedFacility] = useState<string>('all');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  const [integrationStats, setIntegrationStats] = useState<EvaluationIntegrationStats | null>(null);
  const [facilityCompletionData, setFacilityCompletionData] = useState<FacilityCompletionStatus[]>([]);
  const [dataValidationErrors, setDataValidationErrors] = useState<string[]>([]);
  const [lastDataSync, setLastDataSync] = useState<Date | null>(null);
  const evaluationEngine = new RelativeEvaluationEngine();

  // データロード
  useEffect(() => {
    loadEvaluationData();
    validateDataIntegrity();
  }, []);

  const loadEvaluationData = async () => {
    try {
      const stats = await EvaluationDataIntegrationService.getIntegrationStats();
      const facilities = await EvaluationDataIntegrationService.getFacilityCompletionStatus();
      
      setIntegrationStats(stats);
      setFacilityCompletionData(facilities);
      setLastDataSync(new Date());
    } catch (error) {
      console.error('データロードエラー:', error);
    }
  };

  const validateDataIntegrity = async () => {
    try {
      const validation = await EvaluationDataIntegrationService.validateDataIntegrity();
      setDataValidationErrors(validation.errors);
    } catch (error) {
      console.error('データ整合性チェックエラー:', error);
    }
  };

  // サンプルデータ（実際はAPIから取得）
  const facilityProgressData: FacilityProgress[] = [
    {
      facilityId: 'kohara',
      facilityName: '小原病院',
      totalStaff: 120,
      technicalCompleted: 80,
      technicalInProgress: 30,
      technicalNotStarted: 10,
      provisionalGraded: 80,
      finalGraded: 0
    },
    {
      facilityId: 'tategami',
      facilityName: '立神リハビリテーション温泉病院',
      totalStaff: 180,
      technicalCompleted: 100,
      technicalInProgress: 50,
      technicalNotStarted: 30,
      provisionalGraded: 100,
      finalGraded: 0
    },
    {
      facilityId: 'espoir',
      facilityName: 'エスポワール立神',
      totalStaff: 150,
      technicalCompleted: 70,
      technicalInProgress: 40,
      technicalNotStarted: 40,
      provisionalGraded: 70,
      finalGraded: 0
    },
    {
      facilityId: 'hojuan',
      facilityName: '宝寿庵',
      totalStaff: 50,
      technicalCompleted: 0,
      technicalInProgress: 10,
      technicalNotStarted: 40,
      provisionalGraded: 0,
      finalGraded: 0
    }
  ];

  const totalStats = {
    totalStaff: facilityProgressData.reduce((sum, f) => sum + f.totalStaff, 0),
    technicalCompleted: facilityProgressData.reduce((sum, f) => sum + f.technicalCompleted, 0),
    provisionalGraded: facilityProgressData.reduce((sum, f) => sum + f.provisionalGraded, 0),
    finalGraded: facilityProgressData.reduce((sum, f) => sum + f.finalGraded, 0)
  };

  // 暫定判定実行（安全装置付き）
  const executeProvisionalGrading = async (facilityId: string) => {
    setIsProcessing(true);
    setProcessingMessage('実行前チェックを開始...');
    
    try {
      // 1. データ整合性チェック
      setProcessingMessage('データ整合性を検証中...');
      const validation = await EvaluationDataIntegrationService.validateDataIntegrity();
      if (!validation.isValid) {
        throw new Error(`データ整合性エラー: ${validation.errors.join(', ')}`);
      }

      // 2. 技術評価完了確認
      setProcessingMessage('技術評価完了状況を確認中...');
      const completedStaff = facilityId === 'all' 
        ? await EvaluationDataIntegrationService.getCompletedTechnicalEvaluations()
        : await EvaluationDataIntegrationService.getCompletedStaffByFacility(facilityId);
      
      if (completedStaff.length === 0) {
        throw new Error('技術評価が完了した職員が見つかりません');
      }

      // 3. 未完了者の警告確認
      const facilityData = facilityCompletionData.find(f => facilityId === 'all' || f.facilityId === facilityId);
      const hasIncompleteEvaluations = facilityData && facilityData.technicalNotStarted > 0;
      
      if (hasIncompleteEvaluations && facilityId !== 'all') {
        const confirm = window.confirm(
          `${facilityData.facilityName}には技術評価未完了者が${facilityData.technicalNotStarted}名います。\n` +
          '完了者のみで暫定判定を実行しますか？\n' +
          '※後から評価が追加された場合、再計算が必要になります。'
        );
        if (!confirm) {
          setIsProcessing(false);
          setProcessingMessage('');
          return;
        }
      }

      // 4. 相対評価の前処理
      setProcessingMessage('相対評価データを準備中...');
      const evaluationData = completedStaff.map(staff => ({
        staffId: staff.staffId,
        staffName: staff.staffName,
        facilityId: staff.facilityId,
        facilityName: staff.facilityName,
        jobCategory: staff.jobCategory,
        experienceLevel: staff.experienceLevel,
        score: staff.totalScore,
        technicalScore: staff.technicalScore,
        contributionScore: staff.contributionScore,
        rawFacilityScore: staff.contributionBreakdown.facilityContribution,
        rawCorporateScore: staff.contributionBreakdown.corporateContribution
      }));

      // 5. RelativeEvaluationEngineで相対評価実行
      setProcessingMessage('相対評価を実行中...');
      const results = evaluationEngine.processRelativeEvaluation(evaluationData, {
        groupBy: 'facility_job',
        evaluationType: 'comprehensive_final',
        isProvisional: true
      });

      // 6. 結果を統合サービスに保存
      setProcessingMessage('判定結果を保存中...');
      const updatedStaff = results.map(result => ({
        ...completedStaff.find(staff => staff.staffId === result.staffId)!,
        facilityRank: result.facilityRank,
        corporateRank: result.corporateRank,
        facilityGrade: result.facilityGrade,
        corporateGrade: result.corporateGrade,
        finalGrade: result.finalGrade,
        gradingDate: new Date()
      }));

      await EvaluationDataIntegrationService.saveRelativeGradingResults(updatedStaff);
      
      // 7. データを再読み込み
      setProcessingMessage('データを更新中...');
      await loadEvaluationData();
      
      alert(
        `${facilityId === 'all' ? '全施設' : '選択施設'}の暫定判定が完了しました\n` +
        `処理対象: ${completedStaff.length}名\n` +
        `判定完了: ${updatedStaff.length}名`
      );

    } catch (error) {
      console.error('暫定判定エラー:', error);
      alert(`暫定判定中にエラーが発生しました:\n${error instanceof Error ? error.message : '不明なエラー'}`);
    } finally {
      setIsProcessing(false);
      setProcessingMessage('');
    }
  };

  return (
    <div>
      <CommonHeader title="最終判定" />
      <div className="container mx-auto p-6">
        
        {/* ヘッダー情報 */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">2025年度 最終判定処理</h2>
              <p className="text-gray-600 mt-1">
                技術評価（50点）+ 組織貢献（50点）= 100点満点 → 7段階成績判定
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/dashboard">
                <Button variant="outline">
                  ダッシュボードへ戻る
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* データ整合性エラー表示 */}
        {dataValidationErrors.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>データ整合性エラー</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside">
                {dataValidationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* 全体統計 */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">対象職員数</p>
                  <p className="text-2xl font-bold">{integrationStats?.totalStaff || 0}名</p>
                  {lastDataSync && (
                    <p className="text-xs text-gray-500 mt-1">
                      更新: {lastDataSync.toLocaleTimeString()}
                    </p>
                  )}
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">技術評価完了</p>
                  <p className="text-2xl font-bold">{integrationStats?.technicalCompleted || 0}名</p>
                  <Progress value={integrationStats ? (integrationStats.technicalCompleted / integrationStats.totalStaff) * 100 : 0} className="mt-2" />
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">暫定判定済</p>
                  <p className="text-2xl font-bold">{integrationStats?.provisionalGraded || 0}名</p>
                  <Progress value={integrationStats ? (integrationStats.provisionalGraded / integrationStats.totalStaff) * 100 : 0} className="mt-2" />
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">最終確定</p>
                  <p className="text-2xl font-bold">{integrationStats?.finalGraded || 0}名</p>
                  <Progress value={integrationStats ? (integrationStats.finalGraded / integrationStats.totalStaff) * 100 : 0} className="mt-2" />
                </div>
                <BarChart3 className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* メインタブ */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="progress">
              <Clock className="mr-2 h-4 w-4" />
              進捗確認
            </TabsTrigger>
            <TabsTrigger value="provisional">
              <PlayCircle className="mr-2 h-4 w-4" />
              暫定実行
            </TabsTrigger>
            <TabsTrigger value="results">
              <Eye className="mr-2 h-4 w-4" />
              結果確認
            </TabsTrigger>
            <TabsTrigger value="final">
              <CheckCircle className="mr-2 h-4 w-4" />
              最終確定
            </TabsTrigger>
          </TabsList>

          {/* 進捗確認タブ */}
          <TabsContent value="progress">
            <Card>
              <CardHeader>
                <CardTitle>施設別評価収集状況</CardTitle>
                <CardDescription>
                  各施設の技術評価完了状況と判定処理状況を確認できます
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>施設名</TableHead>
                      <TableHead className="text-center">対象人数</TableHead>
                      <TableHead className="text-center">技術評価完了</TableHead>
                      <TableHead className="text-center">技術評価中</TableHead>
                      <TableHead className="text-center">未着手</TableHead>
                      <TableHead className="text-center">暫定判定済</TableHead>
                      <TableHead className="text-center">最終確定</TableHead>
                      <TableHead className="text-center">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {facilityProgressData.map((facility) => (
                      <TableRow key={facility.facilityId}>
                        <TableCell className="font-medium">{facility.facilityName}</TableCell>
                        <TableCell className="text-center">{facility.totalStaff}名</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={facility.technicalCompleted > 0 ? "default" : "secondary"}>
                            {facility.technicalCompleted}名
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{facility.technicalInProgress}名</Badge>
                        </TableCell>
                        <TableCell className="text-center">{facility.technicalNotStarted}名</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={facility.provisionalGraded > 0 ? "default" : "secondary"}>
                            {facility.provisionalGraded}名
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={facility.finalGraded > 0 ? "default" : "secondary"}>
                            {facility.finalGraded}名
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {facility.technicalCompleted > facility.provisionalGraded && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => executeProvisionalGrading(facility.facilityId)}
                              disabled={isProcessing}
                            >
                              暫定判定
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 暫定実行タブ */}
          <TabsContent value="provisional">
            <Card>
              <CardHeader>
                <CardTitle>暫定判定実行</CardTitle>
                <CardDescription>
                  技術評価が完了した職員分のみで暫定的な相対評価を実行します
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 施設選択 */}
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium">対象施設：</label>
                  <Select value={selectedFacility} onValueChange={setSelectedFacility}>
                    <SelectTrigger className="w-64">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全施設</SelectItem>
                      <SelectItem value="kohara">小原病院</SelectItem>
                      <SelectItem value="tategami">立神リハビリテーション温泉病院</SelectItem>
                      <SelectItem value="espoir">エスポワール立神</SelectItem>
                      <SelectItem value="hojuan">宝寿庵</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 処理内容説明 */}
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>暫定判定について</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>技術評価が完了した職員のみを対象に相対評価を実行</li>
                      <li>施設内同職種での順位付け（5段階）</li>
                      <li>法人内同職種での順位付け（5段階）</li>
                      <li>2軸マトリックスによる暫定成績判定（7段階）</li>
                      <li>後から評価が追加された場合、再計算が必要</li>
                    </ul>
                  </AlertDescription>
                </Alert>

                {/* 実行ボタン */}
                <div className="flex justify-center pt-4">
                  <Button 
                    size="lg" 
                    className="w-64"
                    onClick={() => executeProvisionalGrading(selectedFacility)}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        {processingMessage}
                      </>
                    ) : (
                      <>
                        <PlayCircle className="mr-2 h-5 w-5" />
                        暫定判定を実行
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 結果確認タブ */}
          <TabsContent value="results">
            <IntegratedJudgment />
          </TabsContent>

          {/* 最終確定タブ */}
          <TabsContent value="final">
            <Card>
              <CardHeader>
                <CardTitle>最終確定処理</CardTitle>
                <CardDescription>
                  全職員の評価が完了後、最終的な成績判定を確定します
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>注意</AlertTitle>
                  <AlertDescription>
                    最終確定後は成績の変更ができません。全ての評価が完了していることを確認してください。
                  </AlertDescription>
                </Alert>

                {/* 確定前チェックリスト */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">確定前チェックリスト</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {totalStats.technicalCompleted === totalStats.totalStaff ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-orange-500" />
                        )}
                        <span>全職員の技術評価完了（{totalStats.technicalCompleted}/{totalStats.totalStaff}名）</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>組織貢献度評価の確定（夏季・冬季）</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {totalStats.provisionalGraded === totalStats.totalStaff ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-orange-500" />
                        )}
                        <span>暫定判定の完了（{totalStats.provisionalGraded}/{totalStats.totalStaff}名）</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 最終確定ボタン */}
                <div className="flex justify-center pt-4">
                  <Button 
                    size="lg" 
                    variant="destructive"
                    className="w-64"
                    disabled={totalStats.technicalCompleted !== totalStats.totalStaff}
                  >
                    <CheckCircle className="mr-2 h-5 w-5" />
                    最終確定を実行
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}