'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  BookOpen,
  Award,
  TrendingUp,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Clock,
  Users,
  FileText,
  Download,
  ArrowUpRight,
  Target
} from 'lucide-react';
import { TrainingIntegrationService, TrainingRecord } from '@/services/trainingIntegrationService';

interface TrainingIntegrationPanelProps {
  staffId: string;
  staffName: string;
  year: number;
  onIntegrationComplete?: (points: { technical: number; contribution: number }) => void;
}

export default function TrainingIntegrationPanel({
  staffId,
  staffName,
  year,
  onIntegrationComplete
}: TrainingIntegrationPanelProps) {
  const [trainingRecord, setTrainingRecord] = useState<TrainingRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // 研修実績の取得
  useEffect(() => {
    loadTrainingRecord();
  }, [staffId, year]);

  const loadTrainingRecord = async () => {
    setIsLoading(true);
    try {
      const records = await TrainingIntegrationService.getStaffTrainingHistory(staffId);
      
      // モックデータとして trainingRecord を構築
      const mockRecord = {
        staffId,
        year,
        completedTrainings: records,
        evaluationImpact: {
          technicalPoints: records.length * 3,
          contributionPoints: records.length * 2,
          specialAchievements: []
        }
      };
      
      setTrainingRecord(mockRecord);
    } catch (error) {
      console.error('Failed to load training record:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 評価システムへの同期
  const handleSync = async () => {
    if (!trainingRecord) return;
    
    setIsSyncing(true);
    try {
      // モック実装
      const result = {
        success: true,
        technicalImpact: trainingRecord.evaluationImpact.technicalPoints,
        contributionImpact: trainingRecord.evaluationImpact.contributionPoints,
        message: '研修データが評価システムに同期されました'
      };
      setSyncResult(result);
      
      if (result.success && onIntegrationComplete) {
        onIntegrationComplete({
          technical: result.technicalImpact,
          contribution: result.contributionImpact
        });
      }
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  // カテゴリ別の集計
  const getCategoryStats = () => {
    if (!trainingRecord) return {};
    
    const stats: Record<string, number> = {
      mandatory: 0,
      specialized: 0,
      leadership: 0,
      certification: 0
    };
    
    trainingRecord.completedPrograms.forEach(program => {
      stats[program.category]++;
    });
    
    return stats;
  };

  const categoryStats = getCategoryStats();

  // カテゴリラベル
  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      mandatory: '必須研修',
      specialized: '専門研修',
      leadership: 'リーダーシップ',
      certification: '資格認定'
    };
    return labels[category] || category;
  };

  // カテゴリカラー
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      mandatory: 'bg-red-100 text-red-800',
      specialized: 'bg-blue-100 text-blue-800',
      leadership: 'bg-purple-100 text-purple-800',
      certification: 'bg-green-100 text-green-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center gap-3">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span>研修実績を読み込み中...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!trainingRecord) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          研修実績データが見つかりません
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            研修実績・評価連携
          </CardTitle>
          <CardDescription>
            {staffName} - {year}年度研修実績
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-3 text-center">
              <p className="text-sm text-gray-600">完了プログラム</p>
              <p className="text-2xl font-bold">{trainingRecord.completedPrograms.length}</p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <p className="text-sm text-gray-600">総研修時間</p>
              <p className="text-2xl font-bold">{trainingRecord.statistics.totalHours}h</p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <p className="text-sm text-gray-600">平均スコア</p>
              <p className="text-2xl font-bold">{trainingRecord.statistics.averageScore.toFixed(1)}</p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <p className="text-sm text-gray-600">取得資格</p>
              <p className="text-2xl font-bold">{trainingRecord.statistics.certificationCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* タブコンテンツ */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="programs">研修詳細</TabsTrigger>
          <TabsTrigger value="impact">評価影響</TabsTrigger>
          <TabsTrigger value="sync">連携設定</TabsTrigger>
        </TabsList>

        {/* 概要タブ */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>研修実績サマリー</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* 必須研修完了率 */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">必須研修完了率</span>
                    <span className="text-sm font-bold">
                      {trainingRecord.statistics.mandatoryCompletion}%
                    </span>
                  </div>
                  <Progress value={trainingRecord.statistics.mandatoryCompletion} className="h-2" />
                  {trainingRecord.statistics.mandatoryCompletion === 100 && (
                    <div className="flex items-center gap-1 mt-1">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-xs text-green-600">全必須研修完了</span>
                    </div>
                  )}
                </div>

                {/* カテゴリ別実績 */}
                <div>
                  <p className="text-sm font-medium mb-3">カテゴリ別実績</p>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(categoryStats).map(([category, count]) => (
                      <div key={category} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{getCategoryLabel(category)}</span>
                        <Badge variant="secondary">{count}件</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 特別実績 */}
                {trainingRecord.evaluationImpact.specialAchievements.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">特別実績</p>
                    <div className="flex flex-wrap gap-2">
                      {trainingRecord.evaluationImpact.specialAchievements.map((achievement, idx) => (
                        <Badge key={idx} variant="outline">
                          <Award className="h-3 w-3 mr-1" />
                          {achievement}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 研修詳細タブ */}
        <TabsContent value="programs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>完了プログラム一覧</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>研修名</TableHead>
                    <TableHead>カテゴリ</TableHead>
                    <TableHead>完了日</TableHead>
                    <TableHead className="text-center">スコア</TableHead>
                    <TableHead className="text-center">資格</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainingRecord.completedPrograms.map((program) => (
                    <TableRow key={program.programId}>
                      <TableCell className="font-medium">{program.programName}</TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(program.category)}>
                          {getCategoryLabel(program.category)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(program.completedDate).toLocaleDateString('ja-JP')}
                      </TableCell>
                      <TableCell className="text-center">
                        {program.score ? (
                          <div className="flex items-center justify-center gap-2">
                            <span className="font-semibold">{program.score}</span>
                            <Progress value={program.score} className="w-16 h-2" />
                          </div>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {program.certificate && (
                          <Badge className="bg-green-100 text-green-800">
                            <Award className="h-3 w-3 mr-1" />
                            取得
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 評価影響タブ */}
        <TabsContent value="impact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>評価への影響度</CardTitle>
              <CardDescription>
                研修実績が人事評価に与える影響を表示
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* 技術評価への影響 */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">技術評価への加点</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      +{trainingRecord.evaluationImpact.technicalPoints}点
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      専門研修や資格取得により、技術評価に加点されます（最大10点）
                    </p>
                  </div>
                </div>

                {/* 貢献度評価への影響 */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-green-600" />
                      <span className="font-medium">貢献度評価への加点</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      +{trainingRecord.evaluationImpact.contributionPoints}点
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-sm text-green-800">
                      リーダーシップ研修や研修時間により、貢献度評価に加点されます（最大7.5点）
                    </p>
                  </div>
                </div>

                {/* 影響の詳細 */}
                <div className="border-t pt-4">
                  <p className="text-sm font-medium mb-3">加点の根拠</p>
                  <div className="space-y-2">
                    {trainingRecord.evaluationImpact.specialAchievements.map((detail, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                        <span className="text-sm">{detail}</span>
                      </div>
                    ))}
                    {trainingRecord.statistics.mandatoryCompletion === 100 && (
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                        <span className="text-sm">必須研修100%完了</span>
                      </div>
                    )}
                    {trainingRecord.statistics.totalHours > 100 && (
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                        <span className="text-sm">年間100時間以上の研修受講</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 連携設定タブ */}
        <TabsContent value="sync" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>評価システムへの連携</CardTitle>
              <CardDescription>
                研修実績を人事評価システムに反映します
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* 連携状態 */}
                {syncResult && (
                  <Alert className={syncResult.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
                    <AlertDescription className={syncResult.success ? "text-green-800" : "text-red-800"}>
                      {syncResult.message}
                    </AlertDescription>
                  </Alert>
                )}

                {/* 連携内容の確認 */}
                <div className="border rounded-lg p-4 space-y-3">
                  <h4 className="font-medium">連携内容</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">技術評価への反映</p>
                      <div className="flex items-center gap-2">
                        <ArrowUpRight className="h-4 w-4 text-blue-600" />
                        <span className="text-lg font-semibold text-blue-600">
                          +{trainingRecord.evaluationImpact.technicalPoints}点
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">貢献度評価への反映</p>
                      <div className="flex items-center gap-2">
                        <ArrowUpRight className="h-4 w-4 text-green-600" />
                        <span className="text-lg font-semibold text-green-600">
                          +{trainingRecord.evaluationImpact.contributionPoints}点
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 連携ボタン */}
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    <Clock className="h-4 w-4 inline mr-1" />
                    最終連携: {syncResult ? new Date().toLocaleString('ja-JP') : '未連携'}
                  </div>
                  <Button 
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="flex items-center gap-2"
                  >
                    {isSyncing ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        連携中...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4" />
                        評価システムに反映
                      </>
                    )}
                  </Button>
                </div>

                {/* 自動連携の設定 */}
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    研修完了時に自動的に評価システムへ反映される設定も可能です。
                    システム管理者にお問い合わせください。
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}