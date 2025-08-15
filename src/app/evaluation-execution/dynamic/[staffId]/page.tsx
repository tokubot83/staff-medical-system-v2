'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  User,
  FileText,
  RefreshCw,
  Save,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  BookOpen,
  Target,
  Calendar,
  Clock,
  TrendingUp,
  Award,
  Download,
  Eye,
  Brain,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { 
  DynamicSheetGenerationService, 
  StaffProfile, 
  DynamicEvaluationSheet,
  EvaluationCategory,
  EvaluationItem 
} from '@/services/dynamicSheetGenerationService';

export default function DynamicEvaluationPage() {
  const params = useParams();
  const staffId = params.staffId as string;
  
  const [activeTab, setActiveTab] = useState('generate');
  const [staff, setStaff] = useState<StaffProfile | null>(null);
  const [evaluationSheet, setEvaluationSheet] = useState<DynamicEvaluationSheet | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [evaluationProgress, setEvaluationProgress] = useState(0);
  const [currentScores, setCurrentScores] = useState<Record<string, any>>({});
  const [sheetStatistics, setSheetStatistics] = useState<any>(null);

  // スタッフ情報の取得（モック）
  useEffect(() => {
    const mockStaff: StaffProfile = {
      id: staffId,
      name: '山田 太郎',
      employeeNumber: 'N2023001',
      department: '看護部',
      position: '看護師',
      experienceLevel: 'young',
      jobCategory: 'nurse',
      hireDate: new Date('2021-04-01'),
      facilityId: 'facility_001',
      facilityType: 'acute',
      completedTrainings: ['infection_control', 'safety_management', 'personal_info'],
      lastEvaluationScore: 75,
      specialSkills: ['感染管理', '救急対応']
    };
    setStaff(mockStaff);
  }, [staffId]);

  // 評価シートの生成
  const generateEvaluationSheet = async () => {
    if (!staff) return;

    setIsGenerating(true);
    try {
      const result = await DynamicSheetGenerationService.previewEvaluationSheet(
        staff,
        '2025年度上期'
      );
      
      setEvaluationSheet(result.sheet);
      setSheetStatistics(result.statistics);
      setActiveTab('evaluation');
      
      // 初期スコアの設定
      const initialScores: Record<string, any> = {};
      result.sheet.categories.forEach(category => {
        category.items.forEach(item => {
          initialScores[item.id] = {
            superiorScore: 0,
            selfScore: 0,
            comment: ''
          };
        });
      });
      setCurrentScores(initialScores);
    } catch (error) {
      console.error('Failed to generate evaluation sheet:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // スコア更新
  const updateScore = (itemId: string, type: 'superior' | 'self', score: number) => {
    setCurrentScores(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [`${type}Score`]: score
      }
    }));
    
    // 進捗計算
    const totalItems = evaluationSheet?.categories.flatMap(c => c.items).length || 0;
    const scoredItems = Object.values(currentScores).filter((s: any) => 
      s.superiorScore > 0 || s.selfScore > 0
    ).length;
    setEvaluationProgress((scoredItems / totalItems) * 100);
  };

  // コメント更新
  const updateComment = (itemId: string, comment: string) => {
    setCurrentScores(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        comment
      }
    }));
  };

  // 経験レベルのラベル取得
  const getExperienceLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      'new': '新人',
      'young': '若手',
      'midlevel': '中堅',
      'veteran': 'ベテラン',
      'ward-chief': '病棟主任',
      'ward-manager': '病棟師長'
    };
    return labels[level] || level;
  };

  // 難易度のバッジ
  const getDifficultyBadge = (difficulty?: string) => {
    if (!difficulty) return null;
    switch (difficulty) {
      case 'basic': return <Badge className="bg-green-100 text-green-800">基礎</Badge>;
      case 'intermediate': return <Badge className="bg-yellow-100 text-yellow-800">中級</Badge>;
      case 'advanced': return <Badge className="bg-red-100 text-red-800">上級</Badge>;
      default: return null;
    }
  };

  // ソースのアイコン
  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'training': return <BookOpen className="w-4 h-4 text-blue-600" />;
      case 'template': return <Sparkles className="w-4 h-4 text-purple-600" />;
      case 'custom': return <Zap className="w-4 h-4 text-yellow-600" />;
      default: return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  // 合計スコアの計算
  const calculateTotalScore = () => {
    let total = 0;
    if (!evaluationSheet) return 0;
    
    evaluationSheet.categories.forEach(category => {
      category.items.forEach(item => {
        const scores = currentScores[item.id];
        if (scores && scores.superiorScore > 0) {
          total += (scores.superiorScore / 5) * item.points;
        }
      });
    });
    
    return Math.round(total);
  };

  if (!staff) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/evaluation-execution">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  評価管理に戻る
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Sparkles className="w-7 h-7 text-purple-600" />
                  動的評価シート生成
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  職員の条件に応じて最適な評価シートを自動生成
                </p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              2025年度上期
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="generate">生成設定</TabsTrigger>
            <TabsTrigger value="evaluation" disabled={!evaluationSheet}>評価入力</TabsTrigger>
            <TabsTrigger value="analysis" disabled={!evaluationSheet}>分析</TabsTrigger>
            <TabsTrigger value="review" disabled={!evaluationSheet}>確認・提出</TabsTrigger>
          </TabsList>

          {/* 生成設定タブ */}
          <TabsContent value="generate" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>評価対象職員情報</CardTitle>
                <CardDescription>
                  この職員に最適な評価項目を動的に選定します
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-gray-600" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-xl font-medium">{staff.name}</h3>
                      <p className="text-sm text-gray-600">
                        {staff.department} / {staff.position}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label className="text-xs text-gray-600">経験レベル</Label>
                        <div className="mt-1">
                          <Badge className="bg-blue-100 text-blue-800">
                            {getExperienceLevelLabel(staff.experienceLevel)}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600">勤続年数</Label>
                        <p className="mt-1 font-medium">
                          {new Date().getFullYear() - staff.hireDate.getFullYear()}年目
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600">前回評価</Label>
                        <p className="mt-1 font-medium">
                          {staff.lastEvaluationScore}点
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-gray-600">完了済み研修</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {staff.completedTrainings.map(training => (
                          <Badge key={training} className="bg-green-100 text-green-800">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            {training === 'infection_control' && '感染対策研修'}
                            {training === 'safety_management' && '医療安全研修'}
                            {training === 'personal_info' && '個人情報保護研修'}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {staff.specialSkills && staff.specialSkills.length > 0 && (
                      <div>
                        <Label className="text-xs text-gray-600">特殊技能</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {staff.specialSkills.map(skill => (
                            <Badge key={skill} variant="secondary">
                              <Award className="w-3 h-3 mr-1" />
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Alert className="mt-6">
                  <Brain className="h-4 w-4" />
                  <AlertTitle>AI評価シート生成</AlertTitle>
                  <AlertDescription>
                    この職員の経験レベル「{getExperienceLevelLabel(staff.experienceLevel)}」、
                    研修履歴{staff.completedTrainings.length}件、
                    施設タイプ「急性期」を分析し、最適な評価項目を選定します。
                  </AlertDescription>
                </Alert>

                <Button 
                  className="w-full mt-6" 
                  size="lg"
                  onClick={generateEvaluationSheet}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      評価シート生成中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      動的評価シートを生成
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 評価入力タブ */}
          <TabsContent value="evaluation" className="space-y-6 mt-6">
            {evaluationSheet && (
              <>
                {/* 進捗状況 */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{evaluationSheet.staffName}</h3>
                        <p className="text-sm text-gray-600">評価期間: {evaluationSheet.evaluationPeriod}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">進捗率</p>
                        <div className="flex items-center gap-2">
                          <Progress value={evaluationProgress} className="w-32" />
                          <span className="text-sm font-medium">{Math.round(evaluationProgress)}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 生成情報 */}
                <Alert>
                  <Sparkles className="h-4 w-4" />
                  <AlertTitle>動的生成された評価シート</AlertTitle>
                  <AlertDescription>
                    {evaluationSheet.metadata.selectionRationale}
                    <div className="flex gap-4 mt-2">
                      <span className="text-xs">
                        自動選定: {evaluationSheet.metadata.autoSelectedCount}項目
                      </span>
                      <span className="text-xs">
                        テンプレート生成: {evaluationSheet.metadata.templateGeneratedCount}項目
                      </span>
                      <span className="text-xs">
                        研修完了率: {evaluationSheet.metadata.trainingCompletion.toFixed(0)}%
                      </span>
                    </div>
                  </AlertDescription>
                </Alert>

                {/* 評価カテゴリー */}
                {evaluationSheet.categories.map((category) => (
                  <Card key={category.code}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {category.name}（{category.totalPoints}点）
                        </CardTitle>
                        <Badge variant={category.type === 'corporate' ? 'default' : 'secondary'}>
                          {category.type === 'corporate' ? '法人統一' : '施設特化'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {category.items.map((item, index) => (
                          <div key={item.id} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-sm font-medium text-gray-600">
                                    設問 {index + 1}
                                  </span>
                                  {getSourceIcon(item.source)}
                                  {item.metadata?.autoSelected && (
                                    <Badge className="bg-purple-100 text-purple-800" variant="secondary">
                                      AI選定
                                    </Badge>
                                  )}
                                  {getDifficultyBadge(item.metadata?.difficulty)}
                                  {item.metadata?.effectiveness && (
                                    <Badge variant="outline" className="text-xs">
                                      効果性: {item.metadata.effectiveness}%
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm mb-2">{item.question}</p>
                                {item.metadata?.selectionReason && (
                                  <p className="text-xs text-gray-500">
                                    <Brain className="w-3 h-3 inline mr-1" />
                                    {item.metadata.selectionReason}
                                  </p>
                                )}
                              </div>
                              <div className="ml-4">
                                <Badge variant="outline">
                                  {item.points}点
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              {(item.evaluator === 'superior' || item.evaluator === 'both') && (
                                <div>
                                  <Label className="text-xs">上司評価</Label>
                                  <Select
                                    onValueChange={(value) => updateScore(item.id, 'superior', parseInt(value))}
                                  >
                                    <SelectTrigger className="mt-1">
                                      <SelectValue placeholder="選択" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="5">5 - 優秀</SelectItem>
                                      <SelectItem value="4">4 - 良好</SelectItem>
                                      <SelectItem value="3">3 - 標準</SelectItem>
                                      <SelectItem value="2">2 - 要改善</SelectItem>
                                      <SelectItem value="1">1 - 不十分</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}
                              {(item.evaluator === 'self' || item.evaluator === 'both') && (
                                <div>
                                  <Label className="text-xs">自己評価</Label>
                                  <Select
                                    onValueChange={(value) => updateScore(item.id, 'self', parseInt(value))}
                                  >
                                    <SelectTrigger className="mt-1">
                                      <SelectValue placeholder="選択" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="5">5 - 優秀</SelectItem>
                                      <SelectItem value="4">4 - 良好</SelectItem>
                                      <SelectItem value="3">3 - 標準</SelectItem>
                                      <SelectItem value="2">2 - 要改善</SelectItem>
                                      <SelectItem value="1">1 - 不十分</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}
                            </div>
                            
                            <div className="mt-3">
                              <Label className="text-xs">コメント（任意）</Label>
                              <Textarea 
                                className="mt-1" 
                                rows={2}
                                placeholder="評価の根拠や改善点など"
                                onChange={(e) => updateComment(item.id, e.target.value)}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* 保存ボタン */}
                <div className="flex gap-4">
                  <Button className="flex-1" variant="outline">
                    <Save className="w-4 h-4 mr-2" />
                    一時保存
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => setActiveTab('review')}
                  >
                    確認画面へ
                    <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                  </Button>
                </div>
              </>
            )}
          </TabsContent>

          {/* 分析タブ */}
          <TabsContent value="analysis" className="space-y-6 mt-6">
            {evaluationSheet && sheetStatistics && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>評価シート分析</CardTitle>
                    <CardDescription>
                      動的生成された評価シートの構成分析
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-6">
                      {/* 設問ソース分析 */}
                      <div>
                        <h4 className="font-medium mb-3">設問ソース</h4>
                        <div className="space-y-2">
                          {Object.entries(sheetStatistics.questionSources).map(([source, count]) => (
                            <div key={source} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {getSourceIcon(source)}
                                <span className="text-sm">
                                  {source === 'bank' && '設問バンク'}
                                  {source === 'training' && '研修連動'}
                                  {source === 'template' && 'テンプレート'}
                                  {source === 'custom' && 'カスタム'}
                                </span>
                              </div>
                              <Badge variant="secondary">{count as number}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 難易度分布 */}
                      <div>
                        <h4 className="font-medium mb-3">難易度分布</h4>
                        <div className="space-y-2">
                          {Object.entries(sheetStatistics.difficultyDistribution).map(([difficulty, count]) => (
                            <div key={difficulty} className="flex items-center justify-between">
                              <span className="text-sm">{difficulty}</span>
                              <Badge variant="secondary">{count as number}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 評価者タイプ */}
                      <div>
                        <h4 className="font-medium mb-3">評価者タイプ</h4>
                        <div className="space-y-2">
                          {Object.entries(sheetStatistics.evaluatorTypes).map(([type, count]) => (
                            <div key={type} className="flex items-center justify-between">
                              <span className="text-sm">
                                {type === 'superior' && '上司評価'}
                                {type === 'self' && '自己評価'}
                                {type === 'both' && '両方'}
                              </span>
                              <Badge variant="secondary">{count as number}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">研修カバー率</p>
                          <p className="text-2xl font-bold">
                            {sheetStatistics.trainingCoverage.toFixed(0)}%
                          </p>
                        </div>
                        <Alert className="max-w-md">
                          <CheckCircle2 className="h-4 w-4" />
                          <AlertDescription>
                            研修履歴に基づく設問が適切に含まれています
                          </AlertDescription>
                        </Alert>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* 確認・提出タブ */}
          <TabsContent value="review" className="space-y-6 mt-6">
            {evaluationSheet && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>評価内容の確認</CardTitle>
                    <CardDescription>
                      評価内容を確認し、問題なければ提出してください
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* サマリー */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                      <Card>
                        <CardContent className="p-4">
                          <p className="text-sm text-gray-600">合計点</p>
                          <p className="text-2xl font-bold">
                            {calculateTotalScore()} / 100
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <p className="text-sm text-gray-600">評価完了率</p>
                          <p className="text-2xl font-bold">{Math.round(evaluationProgress)}%</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <p className="text-sm text-gray-600">評価項目数</p>
                          <p className="text-2xl font-bold">
                            {evaluationSheet.categories.flatMap(c => c.items).length}
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <p className="text-sm text-gray-600">AI選定率</p>
                          <p className="text-2xl font-bold">
                            {Math.round((evaluationSheet.metadata.autoSelectedCount / 
                              evaluationSheet.categories.flatMap(c => c.items).length) * 100)}%
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    <Alert className="mb-6">
                      <Sparkles className="h-4 w-4" />
                      <AlertTitle>動的生成による最適化</AlertTitle>
                      <AlertDescription>
                        この評価シートは{staff?.name}さんの経験レベル、研修履歴、
                        施設特性を分析して動的に生成されました。
                        従来の固定評価と比較して、より個人に適した評価が可能です。
                      </AlertDescription>
                    </Alert>

                    {/* アクションボタン */}
                    <div className="space-y-3">
                      <Button className="w-full" size="lg">
                        <Send className="w-5 h-5 mr-2" />
                        評価を提出
                      </Button>
                      <Button className="w-full" variant="outline">
                        <Download className="w-5 h-5 mr-2" />
                        評価シートをダウンロード
                      </Button>
                      <Button 
                        className="w-full" 
                        variant="ghost"
                        onClick={() => setActiveTab('evaluation')}
                      >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        評価画面に戻る
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}