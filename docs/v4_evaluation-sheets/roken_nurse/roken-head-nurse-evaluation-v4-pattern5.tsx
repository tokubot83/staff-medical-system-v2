'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, Calculator, Award, Building, Users, Building2, TrendingUp, Target } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function RokenHeadNurseEvaluationV4Pattern5() {
  // 評価項目の状態管理
  const [technicalScores, setTechnicalScores] = useState({
    superiorEval: { 
      leadership: 0,         // 看護部門統括力
      development: 0,        // 人材育成と組織開発
      strategy: 0,           // 戦略実行力
      innovation: 0          // 業務革新力
    },
    selfEval: { 
      leadership: 0, 
      development: 0, 
      strategy: 0, 
      innovation: 0 
    }
  });

  const [contributionPoints, setContributionPoints] = useState({
    facility: 0,
    corporate: 0
  });

  // KPI指標の状態管理
  const [kpiMetrics, setKpiMetrics] = useState({
    homeReturnRate: 0,
    homeReturnTarget: 30,
    bedOccupancy: 95,
    avgStayDays: 90,
    staffRetention: 92,
    userSatisfaction: 'good',
    incidentRate: 'low'
  });

  const [totalScore, setTotalScore] = useState(0);
  const [facilityRank, setFacilityRank] = useState(50); // パーセンタイル
  const [corporateRank, setCorporateRank] = useState(50);
  const [kpiBonus, setKpiBonus] = useState(0);

  // 評価グレードから点数への変換
  const gradeToScore = {
    'S': 1.0,
    'A': 0.85,
    'B': 0.70,
    'C': 0.55,
    'D': 0.40
  };

  // KPIボーナス計算
  const calculateKpiBonus = () => {
    let bonus = 0;
    
    // 在宅復帰率達成度ボーナス
    const homeReturnAchievement = (kpiMetrics.homeReturnRate / kpiMetrics.homeReturnTarget) * 100;
    if (homeReturnAchievement >= 110) bonus += 3;
    else if (homeReturnAchievement >= 100) bonus += 2;
    else if (homeReturnAchievement >= 90) bonus += 1;
    
    // 職員定着率ボーナス
    if (kpiMetrics.staffRetention >= 95) bonus += 2;
    else if (kpiMetrics.staffRetention >= 90) bonus += 1;
    
    // 利用者満足度ボーナス
    if (kpiMetrics.userSatisfaction === 'excellent') bonus += 2;
    else if (kpiMetrics.userSatisfaction === 'good') bonus += 1;
    
    // インシデント率改善ボーナス
    if (kpiMetrics.incidentRate === 'very-low') bonus += 2;
    else if (kpiMetrics.incidentRate === 'low') bonus += 1;
    
    return Math.min(bonus, 5); // 最大5点
  };

  // 技術評価の計算（50点満点）
  const calculateTechnicalScore = () => {
    const superiorTotal = Object.values(technicalScores.superiorEval).reduce((a, b) => a + b, 0) / 4;
    const selfTotal = Object.values(technicalScores.selfEval).reduce((a, b) => a + b, 0) / 4;
    const baseScore = (superiorTotal * 0.6 + selfTotal * 0.4) * 50;
    
    return Math.min(baseScore + kpiBonus, 50);
  };

  // 貢献度評価の計算（各25点満点）
  const calculateContributionScore = (percentile: number) => {
    if (percentile <= 10) return 25;
    if (percentile <= 20) return 22.5;
    if (percentile <= 30) return 20;
    if (percentile <= 40) return 17.5;
    if (percentile <= 50) return 15;
    if (percentile <= 60) return 12.5;
    if (percentile <= 70) return 10;
    if (percentile <= 80) return 7.5;
    if (percentile <= 90) return 5;
    return 2.5;
  };

  // 合計点数の計算
  useEffect(() => {
    const newKpiBonus = calculateKpiBonus();
    setKpiBonus(newKpiBonus);
    
    const technical = calculateTechnicalScore();
    const facility = calculateContributionScore(facilityRank);
    const corporate = calculateContributionScore(corporateRank);
    setTotalScore(Math.round((technical + facility + corporate) * 10) / 10);
  }, [technicalScores, facilityRank, corporateRank, kpiMetrics]);

  const handleTechnicalScoreChange = (evaluator: string, category: string, grade: string) => {
    setTechnicalScores(prev => ({
      ...prev,
      [evaluator]: {
        ...prev[evaluator],
        [category]: gradeToScore[grade] || 0
      }
    }));
  };

  const handleKpiChange = (key, value) => {
    setKpiMetrics(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-red-600';
    if (score >= 80) return 'text-orange-600';
    if (score >= 70) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    return 'text-gray-600';
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            介護老人保健施設 看護師長 人事評価シート v4.0
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            パターン5改良版 - 経営貢献と戦略的施設運営を重視した評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              <strong>評価構成：</strong>技術評価（360度評価＋KPIボーナス）50点 + 施設貢献（相対評価）25点 + 法人貢献（相対評価）25点
              <br />
              老健看護師長は在宅復帰率向上の責任者として、業績達成・人材育成・戦略実行を総合的に評価します
            </AlertDescription>
          </Alert>

          {/* スコア表示バー */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-semibold">現在の総合点数</span>
              <span className={`text-3xl font-bold ${getScoreColor(totalScore)}`}>
                {totalScore} / 100点
              </span>
            </div>
            <Progress value={totalScore} className="h-3" />
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Award className="h-4 w-4 mr-1 text-blue-600" />
                  <span className="text-sm text-gray-600">技術評価</span>
                </div>
                <span className="font-bold text-lg">
                  {Math.round(calculateTechnicalScore() * 10) / 10} / 50点
                </span>
                <p className="text-xs text-gray-500">KPIボーナス: +{kpiBonus}点</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Building className="h-4 w-4 mr-1 text-green-600" />
                  <span className="text-sm text-gray-600">施設貢献</span>
                </div>
                <span className="font-bold text-lg">
                  {calculateContributionScore(facilityRank)} / 25点
                </span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Users className="h-4 w-4 mr-1 text-orange-600" />
                  <span className="text-sm text-gray-600">法人貢献</span>
                </div>
                <span className="font-bold text-lg">
                  {calculateContributionScore(corporateRank)} / 25点
                </span>
              </div>
            </div>
          </div>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="basic">基本情報</TabsTrigger>
              <TabsTrigger value="technical">技術評価</TabsTrigger>
              <TabsTrigger value="kpi">KPI指標</TabsTrigger>
              <TabsTrigger value="facility">施設貢献</TabsTrigger>
              <TabsTrigger value="corporate">法人貢献</TabsTrigger>
              <TabsTrigger value="summary">総合評価</TabsTrigger>
            </TabsList>

            {/* 基本情報タブ */}
            <TabsContent value="basic" className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="eval-date">評価日</Label>
                  <Input type="date" id="eval-date" />
                </div>
                <div>
                  <Label htmlFor="eval-period">評価期間</Label>
                  <Input type="text" id="eval-period" placeholder="2025年度" />
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">管理職情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">氏名</Label>
                    <Input type="text" id="name" />
                  </div>
                  <div>
                    <Label htmlFor="employee-id">職員番号</Label>
                    <Input type="text" id="employee-id" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="department">管理部門</Label>
                    <Input type="text" id="department" placeholder="看護部" />
                  </div>
                  <div>
                    <Label htmlFor="manager-years">師長経験年数</Label>
                    <Input type="text" id="manager-years" placeholder="5年" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="staff-count">管理職員数</Label>
                    <Input type="text" id="staff-count" placeholder="看護師25名、介護士30名" />
                  </div>
                  <div>
                    <Label htmlFor="service-types">管理サービス</Label>
                    <Input type="text" id="service-types" placeholder="入所・通所リハ・訪問看護" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="hire-date">入職年月日</Label>
                    <Input type="date" id="hire-date" />
                  </div>
                  <div>
                    <Label htmlFor="corp-experience">法人経験年数</Label>
                    <Input type="text" id="corp-experience" placeholder="12年" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="previous-management">前職管理経験</Label>
                    <Input type="text" id="previous-management" placeholder="他施設主任3年（参考）" />
                  </div>
                  <div>
                    <Label htmlFor="total-experience">通算看護師経験</Label>
                    <Input type="text" id="total-experience" placeholder="20年" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">評価者情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="evaluator1">1次評価者（看護部長/施設長）</Label>
                    <Input type="text" id="evaluator1" />
                  </div>
                  <div>
                    <Label htmlFor="evaluator2">2次評価者（理事長/事務長）</Label>
                    <Input type="text" id="evaluator2" />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 技術評価タブ */}
            <TabsContent value="technical" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">技術評価（50点満点）</h3>
                <p className="text-sm text-gray-600 mb-4">
                  老健看護師長としての管理能力と戦略実行力を360度評価で採点します
                  <br />
                  <span className="font-semibold">評価比率：上司評価60% + 自己評価40% + KPIボーナス（最大5点）</span>
                </p>
              </div>

              <div className="space-y-6">
                {/* 看護部門統括力 */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Building2 className="h-4 w-4 mr-2 text-blue-600" />
                    1. 看護部門の統括とリーダーシップ
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    全職員を統率する卓越したリーダーシップと組織変革力
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">上司評価</Label>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'leadership', value)}>
                        <div className="space-y-2 mt-2">
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="S" id="leadership-superior-s" />
                            <Label htmlFor="leadership-superior-s" className="font-normal">
                              <span className="font-semibold">S：</span> 卓越したリーダーシップで全職員を統率し、組織を変革
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="A" id="leadership-superior-a" />
                            <Label htmlFor="leadership-superior-a" className="font-normal">
                              <span className="font-semibold">A：</span> 効果的なリーダーシップで高い組織力を実現
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="B" id="leadership-superior-b" />
                            <Label htmlFor="leadership-superior-b" className="font-normal">
                              <span className="font-semibold">B：</span> 標準的な管理で部門を運営
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="C" id="leadership-superior-c" />
                            <Label htmlFor="leadership-superior-c" className="font-normal">
                              <span className="font-semibold">C：</span> 管理能力に課題があり、改善が必要
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="D" id="leadership-superior-d" />
                            <Label htmlFor="leadership-superior-d" className="font-normal">
                              <span className="font-semibold">D：</span> 管理職としての役割を果たせていない
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="border-t pt-3">
                      <Label className="text-sm font-medium">自己評価</Label>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'leadership', value)}>
                        <div className="flex space-x-4 mt-2">
                          {['S', 'A', 'B', 'C', 'D'].map(grade => (
                            <div key={grade} className="flex items-center">
                              <RadioGroupItem value={grade} id={`leadership-self-${grade.toLowerCase()}`} />
                              <Label htmlFor={`leadership-self-${grade.toLowerCase()}`} className="ml-2">
                                {grade}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                {/* 人材育成と組織開発 */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Users className="h-4 w-4 mr-2 text-green-600" />
                    2. 人材育成と組織開発
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    革新的な育成システムの構築と優秀な人材の輩出
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">上司評価</Label>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'development', value)}>
                        <div className="space-y-2 mt-2">
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="S" id="development-superior-s" />
                            <Label htmlFor="development-superior-s" className="font-normal">
                              <span className="font-semibold">S：</span> 革新的な育成システムを構築し、優秀な人材を多数輩出
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="A" id="development-superior-a" />
                            <Label htmlFor="development-superior-a" className="font-normal">
                              <span className="font-semibold">A：</span> 体系的な育成で職員の能力を大幅に向上
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="B" id="development-superior-b" />
                            <Label htmlFor="development-superior-b" className="font-normal">
                              <span className="font-semibold">B：</span> 基本的な人材育成を実施
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="C" id="development-superior-c" />
                            <Label htmlFor="development-superior-c" className="font-normal">
                              <span className="font-semibold">C：</span> 育成への取り組みが不十分
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="D" id="development-superior-d" />
                            <Label htmlFor="development-superior-d" className="font-normal">
                              <span className="font-semibold">D：</span> 人材育成が機能していない
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="border-t pt-3">
                      <Label className="text-sm font-medium">自己評価</Label>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'development', value)}>
                        <div className="flex space-x-4 mt-2">
                          {['S', 'A', 'B', 'C', 'D'].map(grade => (
                            <div key={grade} className="flex items-center">
                              <RadioGroupItem value={grade} id={`development-self-${grade.toLowerCase()}`} />
                              <Label htmlFor={`development-self-${grade.toLowerCase()}`} className="ml-2">
                                {grade}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                {/* 戦略実行力 */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Target className="h-4 w-4 mr-2 text-orange-600" />
                    3. 戦略実行力
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    在宅復帰率向上戦略の実行と地域包括ケアシステムへの貢献
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">上司評価</Label>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'strategy', value)}>
                        <div className="space-y-2 mt-2">
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="S" id="strategy-superior-s" />
                            <Label htmlFor="strategy-superior-s" className="font-normal">
                              <span className="font-semibold">S：</span> 革新的な戦略により在宅復帰率を業界トップレベルに向上
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="A" id="strategy-superior-a" />
                            <Label htmlFor="strategy-superior-a" className="font-normal">
                              <span className="font-semibold">A：</span> 効果的な施策で在宅復帰率を大幅に改善
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="B" id="strategy-superior-b" />
                            <Label htmlFor="strategy-superior-b" className="font-normal">
                              <span className="font-semibold">B：</span> 目標とする在宅復帰率を達成
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="C" id="strategy-superior-c" />
                            <Label htmlFor="strategy-superior-c" className="font-normal">
                              <span className="font-semibold">C：</span> 在宅復帰率が目標に達していない
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="D" id="strategy-superior-d" />
                            <Label htmlFor="strategy-superior-d" className="font-normal">
                              <span className="font-semibold">D：</span> 在宅復帰への取り組みが不足
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="border-t pt-3">
                      <Label className="text-sm font-medium">自己評価</Label>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'strategy', value)}>
                        <div className="flex space-x-4 mt-2">
                          {['S', 'A', 'B', 'C', 'D'].map(grade => (
                            <div key={grade} className="flex items-center">
                              <RadioGroupItem value={grade} id={`strategy-self-${grade.toLowerCase()}`} />
                              <Label htmlFor={`strategy-self-${grade.toLowerCase()}`} className="ml-2">
                                {grade}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                {/* 業務革新力 */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Calculator className="h-4 w-4 mr-2 text-purple-600" />
                    4. 業務革新力
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    革新的な取り組みによる老健看護の新たなモデルの確立
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">上司評価</Label>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'innovation', value)}>
                        <div className="space-y-2 mt-2">
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="S" id="innovation-superior-s" />
                            <Label htmlFor="innovation-superior-s" className="font-normal">
                              <span className="font-semibold">S：</span> 革新的な取り組みで老健看護の新たなモデルを確立
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="A" id="innovation-superior-a" />
                            <Label htmlFor="innovation-superior-a" className="font-normal">
                              <span className="font-semibold">A：</span> 質向上施策により利用者満足度を大幅に向上
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="B" id="innovation-superior-b" />
                            <Label htmlFor="innovation-superior-b" className="font-normal">
                              <span className="font-semibold">B：</span> 安定した質の高いサービスを提供
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="C" id="innovation-superior-c" />
                            <Label htmlFor="innovation-superior-c" className="font-normal">
                              <span className="font-semibold">C：</span> サービスの質に改善の余地がある
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="D" id="innovation-superior-d" />
                            <Label htmlFor="innovation-superior-d" className="font-normal">
                              <span className="font-semibold">D：</span> 質の向上が見られない
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="border-t pt-3">
                      <Label className="text-sm font-medium">自己評価</Label>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'innovation', value)}>
                        <div className="flex space-x-4 mt-2">
                          {['S', 'A', 'B', 'C', 'D'].map(grade => (
                            <div key={grade} className="flex items-center">
                              <RadioGroupItem value={grade} id={`innovation-self-${grade.toLowerCase()}`} />
                              <Label htmlFor={`innovation-self-${grade.toLowerCase()}`} className="ml-2">
                                {grade}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">技術評価点数</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {Math.round(calculateTechnicalScore() * 10) / 10} / 50点
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    基礎点数 + KPIボーナス {kpiBonus}点
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* KPI指標タブ */}
            <TabsContent value="kpi" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <TrendingUp className="mr-2" />
                  KPI指標達成状況
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  経営指標の達成状況に応じて技術評価にボーナス点を付与します（最大5点）
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">在宅復帰関連指標</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="home-return-rate">在宅復帰率（%）</Label>
                      <Input 
                        type="number" 
                        id="home-return-rate" 
                        value={kpiMetrics.homeReturnRate}
                        onChange={(e) => handleKpiChange('homeReturnRate', Number(e.target.value))}
                        placeholder="35" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="home-return-target">目標値（%）</Label>
                      <Input 
                        type="number" 
                        id="home-return-target" 
                        value={kpiMetrics.homeReturnTarget}
                        onChange={(e) => handleKpiChange('homeReturnTarget', Number(e.target.value))}
                        placeholder="30" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="home-return-achievement">達成率（%）</Label>
                      <Input 
                        type="number" 
                        id="home-return-achievement" 
                        value={Math.round((kpiMetrics.homeReturnRate / kpiMetrics.homeReturnTarget) * 100)}
                        readOnly
                        className="bg-gray-100"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">運営効率指標</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="bed-occupancy">ベッド稼働率（%）</Label>
                      <Input 
                        type="number" 
                        id="bed-occupancy" 
                        value={kpiMetrics.bedOccupancy}
                        onChange={(e) => handleKpiChange('bedOccupancy', Number(e.target.value))}
                        placeholder="95" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="avg-stay">平均在所日数</Label>
                      <Input 
                        type="number" 
                        id="avg-stay" 
                        value={kpiMetrics.avgStayDays}
                        onChange={(e) => handleKpiChange('avgStayDays', Number(e.target.value))}
                        placeholder="90" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="staff-retention">職員定着率（%）</Label>
                      <Input 
                        type="number" 
                        id="staff-retention" 
                        value={kpiMetrics.staffRetention}
                        onChange={(e) => handleKpiChange('staffRetention', Number(e.target.value))}
                        placeholder="92" 
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">質的指標</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="user-satisfaction">利用者満足度</Label>
                      <Select 
                        value={kpiMetrics.userSatisfaction} 
                        onValueChange={(value) => handleKpiChange('userSatisfaction', value)}
                      >
                        <SelectTrigger id="user-satisfaction">
                          <SelectValue placeholder="評価を選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excellent">非常に高い（90%以上）+2pt</SelectItem>
                          <SelectItem value="good">高い（80-89%）+1pt</SelectItem>
                          <SelectItem value="average">普通（70-79%）</SelectItem>
                          <SelectItem value="below">低い（70%未満）</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="incident-rate">インシデント発生率</Label>
                      <Select 
                        value={kpiMetrics.incidentRate} 
                        onValueChange={(value) => handleKpiChange('incidentRate', value)}
                      >
                        <SelectTrigger id="incident-rate">
                          <SelectValue placeholder="評価を選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="very-low">非常に低い（前年比20%以上減）+2pt</SelectItem>
                          <SelectItem value="low">低い（前年比10-19%減）+1pt</SelectItem>
                          <SelectItem value="same">前年同等</SelectItem>
                          <SelectItem value="high">高い（前年比増）</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">KPIボーナス算出</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p>在宅復帰率達成度: {kpiMetrics.homeReturnRate >= kpiMetrics.homeReturnTarget * 1.1 ? '+3pt' : 
                                         kpiMetrics.homeReturnRate >= kpiMetrics.homeReturnTarget ? '+2pt' : 
                                         kpiMetrics.homeReturnRate >= kpiMetrics.homeReturnTarget * 0.9 ? '+1pt' : '0pt'}</p>
                      <p>職員定着率: {kpiMetrics.staffRetention >= 95 ? '+2pt' : kpiMetrics.staffRetention >= 90 ? '+1pt' : '0pt'}</p>
                    </div>
                    <div>
                      <p>利用者満足度: {kpiMetrics.userSatisfaction === 'excellent' ? '+2pt' : kpiMetrics.userSatisfaction === 'good' ? '+1pt' : '0pt'}</p>
                      <p>インシデント率: {kpiMetrics.incidentRate === 'very-low' ? '+2pt' : kpiMetrics.incidentRate === 'low' ? '+1pt' : '0pt'}</p>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-amber-200">
                    <p className="font-semibold">合計KPIボーナス: {kpiBonus}点（最大5点）</p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="kpi-analysis">KPI分析・改善計画</Label>
                  <Textarea 
                    id="kpi-analysis" 
                    placeholder="指標の達成状況分析、改善施策、今後の目標など"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* 施設貢献タブ */}
            <TabsContent value="facility" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">施設貢献度評価（25点満点）</h3>
                <p className="text-sm text-gray-600 mb-4">
                  老健内での管理職としての組織運営と変革推進を相対評価で採点します（既存ポイント制度を活用）
                </p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold mb-2">評価対象となる貢献活動</h4>
                <ul className="text-sm space-y-1">
                  <li>• 施設全体の組織変革プロジェクトの主導</li>
                  <li>• 部門間連携の強化と統合的運営</li>
                  <li>• 危機管理・緊急事態対応の指揮</li>
                  <li>• 施設の質改善・認証取得への貢献</li>
                  <li>• 新規事業・サービスの企画・立案</li>
                  <li>• コスト管理・収益向上への取り組み</li>
                  <li>• 職員満足度向上・働き方改革の推進</li>
                  <li>• 地域との連携強化・渉外活動</li>
                </ul>
              </div>

              <div>
                <Label htmlFor="facility-points">施設貢献度ポイント</Label>
                <Input 
                  type="number" 
                  id="facility-points" 
                  placeholder="取得ポイント数を入力"
                  className="mb-2"
                />
                <p className="text-sm text-gray-600">
                  同期看護師長の中での相対的な位置づけを評価
                </p>
              </div>

              <div>
                <Label htmlFor="facility-percentile">施設内パーセンタイル順位</Label>
                <div className="flex items-center space-x-4">
                  <Input 
                    type="number" 
                    id="facility-percentile" 
                    value={facilityRank}
                    onChange={(e) => setFacilityRank(Number(e.target.value))}
                    min="1"
                    max="100"
                    className="w-24"
                  />
                  <span className="text-sm text-gray-600">
                    パーセンタイル（1=最上位、100=最下位）
                  </span>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>パーセンタイル</TableHead>
                    <TableHead>評価</TableHead>
                    <TableHead>点数</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>1-10%</TableCell>
                    <TableCell>極めて高い貢献（施設の中枢）</TableCell>
                    <TableCell>25点</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>11-20%</TableCell>
                    <TableCell>非常に高い貢献</TableCell>
                    <TableCell>22.5点</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>21-30%</TableCell>
                    <TableCell>高い貢献</TableCell>
                    <TableCell>20点</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>31-40%</TableCell>
                    <TableCell>やや高い貢献</TableCell>
                    <TableCell>17.5点</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>41-50%</TableCell>
                    <TableCell>標準的な貢献</TableCell>
                    <TableCell>15点</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>51-60%</TableCell>
                    <TableCell>やや低い貢献</TableCell>
                    <TableCell>12.5点</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>61-100%</TableCell>
                    <TableCell>改善が必要</TableCell>
                    <TableCell>10点以下</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div>
                <Label htmlFor="facility-activities">具体的な貢献活動</Label>
                <Textarea 
                  id="facility-activities" 
                  placeholder="組織変革の実績、部門統合の成果、危機管理での指揮力など具体的に記入"
                  className="min-h-[100px]"
                />
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">施設貢献度点数</span>
                  <span className="text-2xl font-bold text-green-600">
                    {calculateContributionScore(facilityRank)} / 25点
                  </span>
                </div>
              </div>
            </TabsContent>

            {/* 法人貢献タブ */}
            <TabsContent value="corporate" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">法人貢献度評価（25点満点）</h3>
                <p className="text-sm text-gray-600 mb-4">
                  法人全体での戦略的貢献と業界への影響力を相対評価で採点します（既存ポイント制度を活用）
                </p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold mb-2">評価対象となる貢献活動</h4>
                <ul className="text-sm space-y-1">
                  <li>• 法人経営戦略への参画・提言</li>
                  <li>• 法人内他施設の指導・支援</li>
                  <li>• 業界団体での役職・委員会活動</li>
                  <li>• 地域包括ケアシステムでの中心的役割</li>
                  <li>• 行政・自治体の専門委員・アドバイザー</li>
                  <li>• 学会発表・論文執筆・講演活動</li>
                  <li>• 他法人・大学等との共同研究・連携</li>
                  <li>• メディア出演・専門誌への寄稿</li>
                </ul>
              </div>

              <div>
                <Label htmlFor="corporate-points">法人貢献度ポイント</Label>
                <Input 
                  type="number" 
                  id="corporate-points" 
                  placeholder="取得ポイント数を入力"
                  className="mb-2"
                />
                <p className="text-sm text-gray-600">
                  法人内看護師長全体の中での相対的な位置づけを評価
                </p>
              </div>

              <div>
                <Label htmlFor="corporate-percentile">法人内パーセンタイル順位</Label>
                <div className="flex items-center space-x-4">
                  <Input 
                    type="number" 
                    id="corporate-percentile" 
                    value={corporateRank}
                    onChange={(e) => setCorporateRank(Number(e.target.value))}
                    min="1"
                    max="100"
                    className="w-24"
                  />
                  <span className="text-sm text-gray-600">
                    パーセンタイル（1=最上位、100=最下位）
                  </span>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>パーセンタイル</TableHead>
                    <TableHead>評価</TableHead>
                    <TableHead>点数</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>1-10%</TableCell>
                    <TableCell>極めて高い貢献（法人・業界の顔）</TableCell>
                    <TableCell>25点</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>11-20%</TableCell>
                    <TableCell>非常に高い貢献</TableCell>
                    <TableCell>22.5点</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>21-30%</TableCell>
                    <TableCell>高い貢献</TableCell>
                    <TableCell>20点</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>31-40%</TableCell>
                    <TableCell>やや高い貢献</TableCell>
                    <TableCell>17.5点</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>41-50%</TableCell>
                    <TableCell>標準的な貢献</TableCell>
                    <TableCell>15点</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>51-60%</TableCell>
                    <TableCell>やや低い貢献</TableCell>
                    <TableCell>12.5点</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>61-100%</TableCell>
                    <TableCell>改善が必要</TableCell>
                    <TableCell>10点以下</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div>
                <Label htmlFor="corporate-activities">具体的な貢献活動</Label>
                <Textarea 
                  id="corporate-activities" 
                  placeholder="法人戦略への参画、業界団体活動、学会発表、地域での指導的役割など具体的に記入"
                  className="min-h-[100px]"
                />
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">法人貢献度点数</span>
                  <span className="text-2xl font-bold text-orange-600">
                    {calculateContributionScore(corporateRank)} / 25点
                  </span>
                </div>
              </div>
            </TabsContent>

            {/* 総合評価タブ */}
            <TabsContent value="summary" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">総合評価サマリー</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center">
                        <Award className="h-4 w-4 mr-2 text-blue-600" />
                        技術評価
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-blue-600">
                        {Math.round(calculateTechnicalScore() * 10) / 10} / 50点
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        360度評価 + KPIボーナス
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center">
                        <Building className="h-4 w-4 mr-2 text-green-600" />
                        施設貢献度
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-green-600">
                        {calculateContributionScore(facilityRank)} / 25点
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        老健内での相対評価
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center">
                        <Users className="h-4 w-4 mr-2 text-orange-600" />
                        法人貢献度
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-orange-600">
                        {calculateContributionScore(corporateRank)} / 25点
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        法人全体での相対評価
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg text-center">
                  <h4 className="text-lg font-semibold mb-2">総合点数</h4>
                  <p className={`text-4xl font-bold ${getScoreColor(totalScore)}`}>
                    {totalScore} / 100点
                  </p>
                  <Progress value={totalScore} className="h-4 mt-4 max-w-md mx-auto" />
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-3">評価ランク判定</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>点数帯</TableHead>
                        <TableHead>ランク</TableHead>
                        <TableHead>判定</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className={totalScore >= 90 ? 'bg-red-50' : ''}>
                        <TableCell>90点以上</TableCell>
                        <TableCell className="font-bold text-red-600">S</TableCell>
                        <TableCell>変革型リーダー（組織を革新する経営者）</TableCell>
                      </TableRow>
                      <TableRow className={totalScore >= 80 && totalScore < 90 ? 'bg-orange-50' : ''}>
                        <TableCell>80-89点</TableCell>
                        <TableCell className="font-bold text-orange-600">A</TableCell>
                        <TableCell>戦略型リーダー（高い経営貢献）</TableCell>
                      </TableRow>
                      <TableRow className={totalScore >= 70 && totalScore < 80 ? 'bg-green-50' : ''}>
                        <TableCell>70-79点</TableCell>
                        <TableCell className="font-bold text-green-600">B</TableCell>
                        <TableCell>バランス型リーダー（安定した運営）</TableCell>
                      </TableRow>
                      <TableRow className={totalScore >= 60 && totalScore < 70 ? 'bg-blue-50' : ''}>
                        <TableCell>60-69点</TableCell>
                        <TableCell className="font-bold text-blue-600">C</TableCell>
                        <TableCell>運営型リーダー（一部課題あり）</TableCell>
                      </TableRow>
                      <TableRow className={totalScore < 60 ? 'bg-gray-50' : ''}>
                        <TableCell>60点未満</TableCell>
                        <TableCell className="font-bold text-gray-600">D</TableCell>
                        <TableCell>成長期リーダー（更なる向上が必要）</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div className="space-y-4 mt-6">
                  <div>
                    <Label htmlFor="management-strengths">経営者としての強み</Label>
                    <Textarea 
                      id="management-strengths" 
                      placeholder="リーダーシップスタイル、戦略立案力、実行力、人材育成力など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="areas-for-development">今後の成長課題</Label>
                    <Textarea 
                      id="areas-for-development" 
                      placeholder="経営視点の強化、イノベーション力、外部ネットワーク構築など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="career-vision">キャリアビジョン</Label>
                    <Textarea 
                      id="career-vision" 
                      placeholder="施設長への昇格、法人本部での役割、地域での要職など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="succession-planning">後継者育成計画</Label>
                    <Textarea 
                      id="succession-planning" 
                      placeholder="次期師長候補の育成状況、引き継ぎ計画など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="supervisor-comment">上司からの総評</Label>
                    <Textarea 
                      id="supervisor-comment" 
                      placeholder="老健看護師長としての強み、経営への貢献度、今後への期待など"
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* 保存ボタン */}
          <div className="flex justify-end space-x-4 pt-6 border-t mt-6">
            <Button variant="outline">一時保存</Button>
            <Button>評価を確定</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}