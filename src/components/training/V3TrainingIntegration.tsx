'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Target,
  TrendingUp,
  BookOpen,
  Award,
  Users,
  ChevronRight,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Zap,
  BarChart3,
  Route,
  Star,
  Clock,
  ArrowUp
} from 'lucide-react';
import { 
  V3TrainingIntegrationService,
  TrainingRecommendation,
  StrategicTrainingPlan,
  TechnicalGap,
  ContributionGap,
  V3TrainingProgram
} from '@/services/v3TrainingIntegrationService';
import { V3PersonalEvaluation } from '@/types/evaluation-v3';

// モックデータ（実際は職員選択により動的に取得）
const mockCurrentEvaluation: V3PersonalEvaluation = {
  id: 'eval_2024_001',
  staffId: 'staff_001',
  staffName: '田中美咲',
  evaluationPeriod: '2024年度',
  experienceLevel: 'midlevel',
  experienceLabel: '中堅',
  technicalScore: {
    coreItems: 22,
    facilityItems: 14,
    total: 36
  },
  contributionScore: {
    facility: 20,
    corporate: 15,
    total: 17.5
  },
  totalScore: 76.75,
  grade: 'B',
  status: 'completed'
};

export default function V3TrainingIntegration() {
  const [selectedStaff, setSelectedStaff] = useState<V3PersonalEvaluation>(mockCurrentEvaluation);
  const [recommendations, setRecommendations] = useState<TrainingRecommendation[]>([]);
  const [strategicPlan, setStrategicPlan] = useState<StrategicTrainingPlan | null>(null);
  const [technicalGaps, setTechnicalGaps] = useState<TechnicalGap[]>([]);
  const [contributionGap, setContributionGap] = useState<ContributionGap | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [targetGrade, setTargetGrade] = useState('A');
  const [isLoading, setIsLoading] = useState(false);

  // V3研修連携分析の実行
  useEffect(() => {
    const analyzeTrainingNeeds = async () => {
      setIsLoading(true);
      try {
        // 技術評価ギャップ分析
        const techGaps = V3TrainingIntegrationService.analyzeTechnicalGaps(
          selectedStaff,
          selectedStaff.experienceLevel
        );
        setTechnicalGaps(techGaps);

        // 組織貢献度ギャップ分析
        const contribGap = V3TrainingIntegrationService.analyzeContributionGaps(
          selectedStaff,
          selectedStaff.experienceLevel
        );
        setContributionGap(contribGap);

        // 総合研修推奨
        const recommendations = await V3TrainingIntegrationService.generateComprehensiveRecommendations(
          selectedStaff,
          selectedStaff.experienceLevel,
          targetGrade
        );
        setRecommendations(recommendations);

        // 戦略的研修計画
        const plan = await V3TrainingIntegrationService.generateStrategicPlan(
          selectedStaff,
          targetGrade,
          12
        );
        setStrategicPlan(plan);

      } catch (error) {
        console.error('V3研修連携分析エラー:', error);
      } finally {
        setIsLoading(false);
      }
    };

    analyzeTrainingNeeds();
  }, [selectedStaff, targetGrade]);

  const getGradeColor = (grade: string) => {
    const colors: Record<string, string> = {
      'S+': 'text-red-600 bg-red-50',
      'S': 'text-orange-600 bg-orange-50',
      'A+': 'text-yellow-600 bg-yellow-50',
      'A': 'text-green-600 bg-green-50',
      'B': 'text-blue-600 bg-blue-50',
      'C': 'text-gray-600 bg-gray-50',
      'D': 'text-gray-500 bg-gray-100'
    };
    return colors[grade] || 'text-gray-600 bg-gray-50';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'urgent': 'border-red-500 bg-red-50',
      'high': 'border-orange-500 bg-orange-50',
      'medium': 'border-yellow-500 bg-yellow-50',
      'low': 'border-blue-500 bg-blue-50'
    };
    return colors[priority] || 'border-gray-500 bg-gray-50';
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Zap className="w-10 h-10" />
              V3研修連携システム
            </h1>
            <p className="mt-2 text-purple-100">
              100点満点評価に基づく戦略的研修計画・実行支援
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-purple-200">対象職員</div>
            <div className="text-xl font-bold">{selectedStaff.staffName}</div>
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(selectedStaff.grade)}`}>
              {selectedStaff.grade}グレード ({selectedStaff.totalScore}点)
            </div>
          </div>
        </div>
      </div>

      {/* 目標設定 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            成長目標設定
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div>
              <label className="text-sm font-medium">目標グレード</label>
              <select 
                className="ml-2 p-2 border rounded-md"
                value={targetGrade}
                onChange={(e) => setTargetGrade(e.target.value)}
              >
                <option value="A">Aグレード (80点以上)</option>
                <option value="A+">A+グレード (85点以上)</option>
                <option value="S">Sグレード (90点以上)</option>
                <option value="S+">S+グレード (95点以上)</option>
              </select>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ArrowUp className="w-4 h-4" />
              現在から {V3TrainingIntegrationService['getTargetScoreForGrade'](targetGrade) - selectedStaff.totalScore} 点の向上が必要
            </div>
          </div>
        </CardContent>
      </Card>

      {/* メインコンテンツ */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            分析概要
          </TabsTrigger>
          <TabsTrigger value="gaps" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            ギャップ分析
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            研修推奨
          </TabsTrigger>
          <TabsTrigger value="strategic" className="flex items-center gap-2">
            <Route className="w-4 h-4" />
            戦略的計画
          </TabsTrigger>
          <TabsTrigger value="programs" className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            研修プログラム
          </TabsTrigger>
        </TabsList>

        {/* 分析概要タブ */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* 現在の評価状況 */}
            <Card>
              <CardHeader>
                <CardTitle>現在の評価状況</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>技術評価</span>
                    <span>{selectedStaff.technicalScore.total}/50点</span>
                  </div>
                  <Progress value={(selectedStaff.technicalScore.total / 50) * 100} className="h-2" />
                  <div className="text-xs text-gray-500 mt-1">
                    法人統一: {selectedStaff.technicalScore.coreItems}/30点 | 
                    施設固有: {selectedStaff.technicalScore.facilityItems}/20点
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>組織貢献度</span>
                    <span>{selectedStaff.contributionScore.total}/50点</span>
                  </div>
                  <Progress value={(selectedStaff.contributionScore.total / 50) * 100} className="h-2" />
                  <div className="text-xs text-gray-500 mt-1">
                    施設内: {selectedStaff.contributionScore.facility}/25点 | 
                    法人内: {selectedStaff.contributionScore.corporate}/25点
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">総合評価</span>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{selectedStaff.totalScore}/100点</div>
                      <div className={`inline-block px-2 py-1 rounded text-sm ${getGradeColor(selectedStaff.grade)}`}>
                        {selectedStaff.grade}グレード
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 成長ポテンシャル */}
            <Card>
              <CardHeader>
                <CardTitle>成長ポテンシャル分析</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {technicalGaps.length > 0 ? (
                  <div>
                    <h4 className="font-medium mb-2">技術面の改善余地</h4>
                    {technicalGaps.map((gap, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <span className="text-sm">
                          {gap.area === 'coreItems' ? '法人統一項目' : '施設固有項目'}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">+{gap.gap}点</span>
                          <Badge variant={gap.priority === 'urgent' ? 'destructive' : 'secondary'}>
                            {gap.priority === 'urgent' ? '緊急' : 
                             gap.priority === 'high' ? '高' : 
                             gap.priority === 'medium' ? '中' : '低'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    技術評価は目標水準に達しています
                  </div>
                )}

                {contributionGap && (contributionGap.facilityGap > 0 || contributionGap.corporateGap > 0) && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">組織貢献度の改善余地</h4>
                    <div className="space-y-2">
                      {contributionGap.facilityGap > 0 && (
                        <div className="flex justify-between">
                          <span className="text-sm">施設内貢献</span>
                          <span className="text-sm font-medium">+{contributionGap.facilityGap}点</span>
                        </div>
                      )}
                      {contributionGap.corporateGap > 0 && (
                        <div className="flex justify-between">
                          <span className="text-sm">法人内貢献</span>
                          <span className="text-sm font-medium">+{contributionGap.corporateGap}点</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 推奨アクション */}
          <Card>
            <CardHeader>
              <CardTitle>即座に実行可能な改善アクション</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {recommendations.slice(0, 3).map((rec, index) => {
                  const training = V3TrainingIntegrationService.getTrainingProgram(rec.trainingId);
                  return (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-4 h-4 text-blue-500" />
                        <span className="font-medium text-sm">{training?.name}</span>
                      </div>
                      <div className="text-xs text-gray-600 mb-2">{rec.rationale}</div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">+{rec.expectedOutcome.scoreIncrease}点</Badge>
                        <span className="text-xs text-gray-500">{rec.expectedOutcome.timeline}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ギャップ分析タブ */}
        <TabsContent value="gaps" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* 技術評価ギャップ */}
            <Card>
              <CardHeader>
                <CardTitle>技術評価ギャップ分析</CardTitle>
              </CardHeader>
              <CardContent>
                {technicalGaps.length > 0 ? (
                  <div className="space-y-4">
                    {technicalGaps.map((gap, index) => (
                      <div key={index} className={`p-4 border rounded-lg ${getPriorityColor(gap.priority)}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">
                              {gap.area === 'coreItems' ? '法人統一項目' : '施設固有項目'}
                            </h4>
                            <p className="text-sm text-gray-600">
                              現在: {gap.currentScore}点 → 目標: {gap.targetScore}点
                            </p>
                          </div>
                          <Badge variant={gap.priority === 'urgent' ? 'destructive' : 'secondary'}>
                            ギャップ: {gap.gap}点
                          </Badge>
                        </div>
                        <div className="mt-3">
                          <div className="text-sm font-medium mb-1">推奨研修:</div>
                          <div className="space-y-1">
                            {gap.recommendedTrainings.map((trainingId) => {
                              const training = V3TrainingIntegrationService.getTrainingProgram(trainingId);
                              return (
                                <div key={trainingId} className="text-sm text-blue-600">
                                  • {training?.name}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Target className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>技術評価は目標水準に達しています</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 組織貢献度ギャップ */}
            <Card>
              <CardHeader>
                <CardTitle>組織貢献度ギャップ分析</CardTitle>
              </CardHeader>
              <CardContent>
                {contributionGap && (contributionGap.facilityGap > 0 || contributionGap.corporateGap > 0) ? (
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">貢献度バランス分析</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>施設内貢献度</span>
                            <span>{selectedStaff.contributionScore.facility}/25点</span>
                          </div>
                          <Progress value={(selectedStaff.contributionScore.facility / 25) * 100} className="h-2" />
                          {contributionGap.facilityGap > 0 && (
                            <div className="text-xs text-orange-600 mt-1">
                              改善余地: +{contributionGap.facilityGap}点
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>法人内貢献度</span>
                            <span>{selectedStaff.contributionScore.corporate}/25点</span>
                          </div>
                          <Progress value={(selectedStaff.contributionScore.corporate / 25) * 100} className="h-2" />
                          {contributionGap.corporateGap > 0 && (
                            <div className="text-xs text-orange-600 mt-1">
                              改善余地: +{contributionGap.corporateGap}点
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg bg-blue-50">
                      <h4 className="font-medium mb-2">戦略的重点領域</h4>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">
                          {contributionGap.type === 'facility' ? '施設内貢献重点' :
                           contributionGap.type === 'corporate' ? '法人内貢献重点' : 'バランス型成長'}
                        </Badge>
                        <span className="text-sm">戦略的優先度: {contributionGap.strategicPriority.toFixed(1)}</span>
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        {contributionGap.type === 'facility' ? 
                          '施設内でのリーダーシップとチーム貢献を強化することで、より大きな成果が期待できます。' :
                         contributionGap.type === 'corporate' ?
                          '法人全体への貢献とネットワーク構築に重点を置くことで、組織横断的な影響力を発揮できます。' :
                          '施設内と法人内の貢献をバランスよく向上させることで、総合的な組織価値を高めることができます。'}
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-1">推奨研修:</div>
                        {contributionGap.recommendedTrainings.map((trainingId) => {
                          const training = V3TrainingIntegrationService.getTrainingProgram(trainingId);
                          return (
                            <div key={trainingId} className="text-sm text-blue-600">
                              • {training?.name}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>組織貢献度は目標水準に達しています</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 研修推奨タブ */}
        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>優先研修推奨リスト</CardTitle>
              <div className="text-sm text-gray-600">
                現在の評価状況と目標（{targetGrade}グレード）に基づく推奨研修
              </div>
            </CardHeader>
            <CardContent>
              {recommendations.length > 0 ? (
                <div className="space-y-4">
                  {recommendations.map((rec, index) => {
                    const training = V3TrainingIntegrationService.getTrainingProgram(rec.trainingId);
                    if (!training) return null;

                    return (
                      <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-bold">
                                {index + 1}
                              </div>
                              <div>
                                <h4 className="font-medium">{training.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline">{training.category}</Badge>
                                  <Badge variant="secondary">{training.difficulty}</Badge>
                                  <Badge variant="outline">{training.duration}</Badge>
                                </div>
                              </div>
                            </div>
                            <div className="ml-11">
                              <p className="text-sm text-gray-600 mb-2">{rec.rationale}</p>
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500">予想効果:</span>
                                  <span className="ml-1 font-medium">+{rec.expectedOutcome.scoreIncrease}点</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">期間:</span>
                                  <span className="ml-1">{rec.expectedOutcome.timeline}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">ROI:</span>
                                  <span className="ml-1">{training.roi.toFixed(1)}</span>
                                </div>
                              </div>
                              {rec.expectedOutcome.gradePromotion && (
                                <div className="mt-2 p-2 bg-green-50 rounded text-sm">
                                  <Star className="w-4 h-4 inline text-green-600 mr-1" />
                                  グレード昇格の可能性: {rec.expectedOutcome.gradePromotion}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500 mb-1">優先度</div>
                            <div className="text-2xl font-bold text-blue-600">{rec.priority.toFixed(0)}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>現在推奨できる研修はありません</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 戦略的計画タブ */}
        <TabsContent value="strategic" className="space-y-6">
          {strategicPlan ? (
            <>
              {/* 計画概要 */}
              <Card>
                <CardHeader>
                  <CardTitle>戦略的研修計画 概要</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{strategicPlan.currentGrade}</div>
                      <div className="text-sm text-gray-500">現在</div>
                    </div>
                    <div className="flex items-center justify-center">
                      <ChevronRight className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{strategicPlan.targetGrade}</div>
                      <div className="text-sm text-gray-500">目標</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{strategicPlan.totalDuration}</div>
                      <div className="text-sm text-gray-500">期間</div>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">期待ROI</span>
                      <span className="text-xl font-bold text-blue-600">{strategicPlan.expectedROI.toFixed(1)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* フェーズ別計画 */}
              <div className="grid grid-cols-3 gap-6">
                {strategicPlan.phases.map((phase, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Phase {phase.phase}: {phase.title}
                      </CardTitle>
                      <div className="text-sm text-gray-600">{phase.duration}</div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <div className="text-sm text-gray-500 mb-1">フォーカス</div>
                        <div className="font-medium">{phase.focus}</div>
                      </div>
                      <div className="mb-4">
                        <div className="text-sm text-gray-500 mb-1">予想効果</div>
                        <div className="font-medium">+{phase.expectedScoreIncrease}点向上</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-2">実施研修</div>
                        <div className="space-y-1">
                          {phase.trainings.map((trainingId) => {
                            const training = V3TrainingIntegrationService.getTrainingProgram(trainingId);
                            return (
                              <div key={trainingId} className="text-sm bg-gray-50 p-2 rounded">
                                {training?.name}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* マイルストーン */}
              <Card>
                <CardHeader>
                  <CardTitle>成長マイルストーン</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {strategicPlan.milestones.map((milestone, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-full font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{milestone.evaluationCheckpoint}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              {milestone.date}
                            </div>
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            目標スコア: {milestone.targetScore}点
                          </div>
                          <div>
                            <div className="text-sm font-medium mb-1">成功基準:</div>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {milestone.successCriteria.map((criteria, idx) => (
                                <li key={idx} className="flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                                  {criteria}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Route className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-gray-500">戦略的計画を生成中...</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* 研修プログラムタブ */}
        <TabsContent value="programs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>V3対応研修プログラム一覧</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {V3TrainingIntegrationService.getAllTrainingPrograms().map((program) => (
                  <div key={program.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{program.name}</h4>
                      <Badge variant="outline">{program.duration}</Badge>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{program.category}</Badge>
                      <Badge variant="outline">{program.difficulty}</Badge>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      対象: {program.targetArea === 'coreItems' ? '法人統一項目' :
                            program.targetArea === 'facilityItems' ? '施設固有項目' :
                            program.targetArea === 'facilityContribution' ? '施設内貢献' : '法人内貢献'}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">技術向上:</span>
                        <span className="ml-1 font-medium">+{program.expectedImpact.technicalGain}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">貢献向上:</span>
                        <span className="ml-1 font-medium">+{program.expectedImpact.contributionGain}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">ROI:</span>
                        <span className="ml-1 font-medium">{program.roi}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">対象レベル:</span>
                        <span className="ml-1 text-xs">{program.requiredLevel.join(', ')}</span>
                      </div>
                    </div>
                    {program.prerequisites && (
                      <div className="mt-2 p-2 bg-yellow-50 rounded text-xs">
                        <span className="font-medium">前提研修:</span> {program.prerequisites.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}