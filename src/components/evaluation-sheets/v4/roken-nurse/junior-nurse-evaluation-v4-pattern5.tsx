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
import { InfoIcon, Calculator, Award, Users, Building } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type TechnicalScoreCategory = 'nursingSkills' | 'safety' | 'communication' | 'leadership';
type EvaluatorType = 'superiorEval' | 'selfEval';

export default function RokenJuniorNurseEvaluationV4Pattern5() {
  // 評価項目の状態管理
  const [technicalScores, setTechnicalScores] = useState<{
    [key in EvaluatorType]: {
      [key in TechnicalScoreCategory]: number;
    };
  }>({
    superiorEval: { nursingSkills: 0, safety: 0, communication: 0, leadership: 0 },
    selfEval: { nursingSkills: 0, safety: 0, communication: 0, leadership: 0 }
  });

  const [contributionPoints, setContributionPoints] = useState({
    facility: 0,
    corporate: 0
  });

  const [totalScore, setTotalScore] = useState(0);
  const [facilityRank, setFacilityRank] = useState(50); // パーセンタイル
  const [corporateRank, setCorporateRank] = useState(50);

  // 評価グレードから点数への変換
  const gradeToScore = {
    'S': 1.0,
    'A': 0.85,
    'B': 0.70,
    'C': 0.55,
    'D': 0.40
  };

  // 技術評価の計算（50点満点）
  const calculateTechnicalScore = () => {
    const superiorTotal = Object.values(technicalScores.superiorEval).reduce((a, b) => a + b, 0) / 4;
    const selfTotal = Object.values(technicalScores.selfEval).reduce((a, b) => a + b, 0) / 4;
    return (superiorTotal * 0.6 + selfTotal * 0.4) * 50;
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
    const technical = calculateTechnicalScore();
    const facility = calculateContributionScore(facilityRank);
    const corporate = calculateContributionScore(corporateRank);
    setTotalScore(Math.round((technical + facility + corporate) * 10) / 10);
  }, [technicalScores, facilityRank, corporateRank, calculateTechnicalScore]);

  const handleTechnicalScoreChange = (evaluator: EvaluatorType, category: TechnicalScoreCategory, grade: keyof typeof gradeToScore) => {
    setTechnicalScores(prev => ({
      ...prev,
      [evaluator]: {
        ...prev[evaluator],
        [category]: gradeToScore[grade] || 0
      }
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
            老健 若手看護師（2-3年目） 人事評価シート v4.0
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            介護老人保健施設における若手看護師の評価
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">基本情報</TabsTrigger>
              <TabsTrigger value="technical">技術評価</TabsTrigger>
              <TabsTrigger value="contribution">貢献度</TabsTrigger>
              <TabsTrigger value="summary">総合評価</TabsTrigger>
              <TabsTrigger value="guide">記入ガイド</TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    基本情報
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="employeeCode">職員コード</Label>
                      <Input id="employeeCode" placeholder="例: RN002" />
                    </div>
                    <div>
                      <Label htmlFor="employeeName">氏名</Label>
                      <Input id="employeeName" placeholder="山田 花子" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="department">所属部署</Label>
                      <Input id="department" placeholder="老健看護部" defaultValue="老健看護部" />
                    </div>
                    <div>
                      <Label htmlFor="position">職位</Label>
                      <Input id="position" placeholder="若手看護師" defaultValue="若手看護師" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="evaluationPeriod">評価期間</Label>
                      <Input id="evaluationPeriod" placeholder="2024年4月～2025年3月" />
                    </div>
                    <div>
                      <Label htmlFor="evaluationDate">評価日</Label>
                      <Input id="evaluationDate" type="date" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="technical">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    技術評価（50点満点）
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <Alert>
                      <InfoIcon className="h-4 w-4" />
                      <AlertDescription>
                        上司評価60%、自己評価40%の配分で計算されます。各項目をS～Dの5段階で評価してください。
                      </AlertDescription>
                    </Alert>

                    <Tabs defaultValue="superior" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="superior">上司評価</TabsTrigger>
                        <TabsTrigger value="self">自己評価</TabsTrigger>
                      </TabsList>

                      <TabsContent value="superior" className="space-y-4">
                        <div className="space-y-4">
                          <div>
                            <Label className="text-base font-semibold">1. 看護実践・アセスメント能力</Label>
                            <p className="text-sm text-gray-600 mb-2">
                              老健特有の看護実践、包括的アセスメント能力
                            </p>
                            <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'nursingSkills', value as keyof typeof gradeToScore)}>
                              <div className="flex space-x-4">
                                <div className="flex items-center">
                                  <RadioGroupItem value="S" id="superior-nursing-s" />
                                  <Label htmlFor="superior-nursing-s" className="ml-2">S(優秀)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="A" id="superior-nursing-a" />
                                  <Label htmlFor="superior-nursing-a" className="ml-2">A(良好)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="B" id="superior-nursing-b" />
                                  <Label htmlFor="superior-nursing-b" className="ml-2">B(標準)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="C" id="superior-nursing-c" />
                                  <Label htmlFor="superior-nursing-c" className="ml-2">C(要努力)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="D" id="superior-nursing-d" />
                                  <Label htmlFor="superior-nursing-d" className="ml-2">D(要改善)</Label>
                                </div>
                              </div>
                            </RadioGroup>
                          </div>

                          <div>
                            <Label className="text-base font-semibold">2. リスクマネジメント・医療安全</Label>
                            <p className="text-sm text-gray-600 mb-2">
                              転倒転落予防、誤嚥予防、感染管理の実践
                            </p>
                            <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'safety', value as keyof typeof gradeToScore)}>
                              <div className="flex space-x-4">
                                <div className="flex items-center">
                                  <RadioGroupItem value="S" id="superior-safety-s" />
                                  <Label htmlFor="superior-safety-s" className="ml-2">S(優秀)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="A" id="superior-safety-a" />
                                  <Label htmlFor="superior-safety-a" className="ml-2">A(良好)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="B" id="superior-safety-b" />
                                  <Label htmlFor="superior-safety-b" className="ml-2">B(標準)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="C" id="superior-safety-c" />
                                  <Label htmlFor="superior-safety-c" className="ml-2">C(要努力)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="D" id="superior-safety-d" />
                                  <Label htmlFor="superior-safety-d" className="ml-2">D(要改善)</Label>
                                </div>
                              </div>
                            </RadioGroup>
                          </div>

                          <div>
                            <Label className="text-base font-semibold">3. チーム医療・多職種協働</Label>
                            <p className="text-sm text-gray-600 mb-2">
                              介護職への指導、リハビリ職との協働、カンファレンス参加
                            </p>
                            <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'communication', value as keyof typeof gradeToScore)}>
                              <div className="flex space-x-4">
                                <div className="flex items-center">
                                  <RadioGroupItem value="S" id="superior-comm-s" />
                                  <Label htmlFor="superior-comm-s" className="ml-2">S(優秀)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="A" id="superior-comm-a" />
                                  <Label htmlFor="superior-comm-a" className="ml-2">A(良好)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="B" id="superior-comm-b" />
                                  <Label htmlFor="superior-comm-b" className="ml-2">B(標準)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="C" id="superior-comm-c" />
                                  <Label htmlFor="superior-comm-c" className="ml-2">C(要努力)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="D" id="superior-comm-d" />
                                  <Label htmlFor="superior-comm-d" className="ml-2">D(要改善)</Label>
                                </div>
                              </div>
                            </RadioGroup>
                          </div>

                          <div>
                            <Label className="text-base font-semibold">4. 在宅復帰支援・後輩指導</Label>
                            <p className="text-sm text-gray-600 mb-2">
                              退所支援、家族指導、新人への基本的な指導
                            </p>
                            <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'leadership', value as keyof typeof gradeToScore)}>
                              <div className="flex space-x-4">
                                <div className="flex items-center">
                                  <RadioGroupItem value="S" id="superior-lead-s" />
                                  <Label htmlFor="superior-lead-s" className="ml-2">S(優秀)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="A" id="superior-lead-a" />
                                  <Label htmlFor="superior-lead-a" className="ml-2">A(良好)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="B" id="superior-lead-b" />
                                  <Label htmlFor="superior-lead-b" className="ml-2">B(標準)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="C" id="superior-lead-c" />
                                  <Label htmlFor="superior-lead-c" className="ml-2">C(要努力)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="D" id="superior-lead-d" />
                                  <Label htmlFor="superior-lead-d" className="ml-2">D(要改善)</Label>
                                </div>
                              </div>
                            </RadioGroup>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="self" className="space-y-4">
                        <div className="space-y-4">
                          <div>
                            <Label className="text-base font-semibold">1. 看護実践・アセスメント能力</Label>
                            <p className="text-sm text-gray-600 mb-2">
                              老健特有の看護実践、包括的アセスメント能力
                            </p>
                            <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'nursingSkills', value as keyof typeof gradeToScore)}>
                              <div className="flex space-x-4">
                                <div className="flex items-center">
                                  <RadioGroupItem value="S" id="self-nursing-s" />
                                  <Label htmlFor="self-nursing-s" className="ml-2">S(優秀)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="A" id="self-nursing-a" />
                                  <Label htmlFor="self-nursing-a" className="ml-2">A(良好)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="B" id="self-nursing-b" />
                                  <Label htmlFor="self-nursing-b" className="ml-2">B(標準)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="C" id="self-nursing-c" />
                                  <Label htmlFor="self-nursing-c" className="ml-2">C(要努力)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="D" id="self-nursing-d" />
                                  <Label htmlFor="self-nursing-d" className="ml-2">D(要改善)</Label>
                                </div>
                              </div>
                            </RadioGroup>
                          </div>

                          <div>
                            <Label className="text-base font-semibold">2. リスクマネジメント・医療安全</Label>
                            <p className="text-sm text-gray-600 mb-2">
                              転倒転落予防、誤嚥予防、感染管理の実践
                            </p>
                            <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'safety', value as keyof typeof gradeToScore)}>
                              <div className="flex space-x-4">
                                <div className="flex items-center">
                                  <RadioGroupItem value="S" id="self-safety-s" />
                                  <Label htmlFor="self-safety-s" className="ml-2">S(優秀)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="A" id="self-safety-a" />
                                  <Label htmlFor="self-safety-a" className="ml-2">A(良好)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="B" id="self-safety-b" />
                                  <Label htmlFor="self-safety-b" className="ml-2">B(標準)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="C" id="self-safety-c" />
                                  <Label htmlFor="self-safety-c" className="ml-2">C(要努力)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="D" id="self-safety-d" />
                                  <Label htmlFor="self-safety-d" className="ml-2">D(要改善)</Label>
                                </div>
                              </div>
                            </RadioGroup>
                          </div>

                          <div>
                            <Label className="text-base font-semibold">3. チーム医療・多職種協働</Label>
                            <p className="text-sm text-gray-600 mb-2">
                              介護職への指導、リハビリ職との協働、カンファレンス参加
                            </p>
                            <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'communication', value as keyof typeof gradeToScore)}>
                              <div className="flex space-x-4">
                                <div className="flex items-center">
                                  <RadioGroupItem value="S" id="self-comm-s" />
                                  <Label htmlFor="self-comm-s" className="ml-2">S(優秀)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="A" id="self-comm-a" />
                                  <Label htmlFor="self-comm-a" className="ml-2">A(良好)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="B" id="self-comm-b" />
                                  <Label htmlFor="self-comm-b" className="ml-2">B(標準)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="C" id="self-comm-c" />
                                  <Label htmlFor="self-comm-c" className="ml-2">C(要努力)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="D" id="self-comm-d" />
                                  <Label htmlFor="self-comm-d" className="ml-2">D(要改善)</Label>
                                </div>
                              </div>
                            </RadioGroup>
                          </div>

                          <div>
                            <Label className="text-base font-semibold">4. 在宅復帰支援・後輩指導</Label>
                            <p className="text-sm text-gray-600 mb-2">
                              退所支援、家族指導、新人への基本的な指導
                            </p>
                            <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'leadership', value as keyof typeof gradeToScore)}>
                              <div className="flex space-x-4">
                                <div className="flex items-center">
                                  <RadioGroupItem value="S" id="self-lead-s" />
                                  <Label htmlFor="self-lead-s" className="ml-2">S(優秀)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="A" id="self-lead-a" />
                                  <Label htmlFor="self-lead-a" className="ml-2">A(良好)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="B" id="self-lead-b" />
                                  <Label htmlFor="self-lead-b" className="ml-2">B(標準)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="C" id="self-lead-c" />
                                  <Label htmlFor="self-lead-c" className="ml-2">C(要努力)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="D" id="self-lead-d" />
                                  <Label htmlFor="self-lead-d" className="ml-2">D(要改善)</Label>
                                </div>
                              </div>
                            </RadioGroup>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm font-semibold">技術評価得点: {calculateTechnicalScore().toFixed(1)} / 50点</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contribution">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    貢献度評価（50点満点）
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <Alert>
                      <InfoIcon className="h-4 w-4" />
                      <AlertDescription>
                        施設貢献度と法人貢献度をそれぞれパーセンタイル順位で評価します。
                        上位10%以内なら25点、下位10%なら2.5点となります。
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="facilityContribution" className="text-base font-semibold">
                          施設貢献度順位（パーセンタイル）
                        </Label>
                        <p className="text-sm text-gray-600 mb-2">
                          老健内での相対的な貢献度（1-100%、小さいほど上位）
                        </p>
                        <div className="flex items-center space-x-4">
                          <Input
                            id="facilityContribution"
                            type="number"
                            min="1"
                            max="100"
                            value={facilityRank}
                            onChange={(e) => setFacilityRank(parseInt(e.target.value) || 50)}
                            className="w-24"
                          />
                          <span className="text-sm">%</span>
                          <Progress value={100 - facilityRank} className="flex-1" />
                          <span className="text-sm font-semibold">
                            {calculateContributionScore(facilityRank)}点
                          </span>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="corporateContribution" className="text-base font-semibold">
                          法人貢献度順位（パーセンタイル）
                        </Label>
                        <p className="text-sm text-gray-600 mb-2">
                          法人全体での相対的な貢献度（1-100%、小さいほど上位）
                        </p>
                        <div className="flex items-center space-x-4">
                          <Input
                            id="corporateContribution"
                            type="number"
                            min="1"
                            max="100"
                            value={corporateRank}
                            onChange={(e) => setCorporateRank(parseInt(e.target.value) || 50)}
                            className="w-24"
                          />
                          <span className="text-sm">%</span>
                          <Progress value={100 - corporateRank} className="flex-1" />
                          <span className="text-sm font-semibold">
                            {calculateContributionScore(corporateRank)}点
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-green-50 rounded-lg">
                      <p className="text-sm font-semibold">
                        貢献度評価得点: {(calculateContributionScore(facilityRank) + calculateContributionScore(corporateRank)).toFixed(1)} / 50点
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="summary">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    総合評価
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="border-2">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">評価内訳</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Table>
                            <TableBody>
                              <TableRow>
                                <TableCell className="font-medium">技術評価</TableCell>
                                <TableCell className="text-right">
                                  {calculateTechnicalScore().toFixed(1)} / 50点
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">施設貢献度</TableCell>
                                <TableCell className="text-right">
                                  {calculateContributionScore(facilityRank).toFixed(1)} / 25点
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">法人貢献度</TableCell>
                                <TableCell className="text-right">
                                  {calculateContributionScore(corporateRank).toFixed(1)} / 25点
                                </TableCell>
                              </TableRow>
                              <TableRow className="font-bold text-lg">
                                <TableCell>合計</TableCell>
                                <TableCell className={`text-right ${getScoreColor(totalScore)}`}>
                                  {totalScore} / 100点
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>

                      <Card className="border-2">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">評価ランク</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center py-4">
                            <div className={`text-6xl font-bold ${getScoreColor(totalScore)}`}>
                              {totalScore >= 90 ? 'S' :
                               totalScore >= 80 ? 'A' :
                               totalScore >= 70 ? 'B' :
                               totalScore >= 60 ? 'C' : 'D'}
                            </div>
                            <p className="mt-2 text-gray-600">
                              {totalScore >= 90 ? '特に優秀' :
                               totalScore >= 80 ? '優秀' :
                               totalScore >= 70 ? '良好' :
                               totalScore >= 60 ? '標準' : '要改善'}
                            </p>
                          </div>
                          <div className="mt-4 space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>S: 90点以上</span>
                              <span className="text-gray-600">特に優秀</span>
                            </div>
                            <div className="flex justify-between">
                              <span>A: 80-89点</span>
                              <span className="text-gray-600">優秀</span>
                            </div>
                            <div className="flex justify-between">
                              <span>B: 70-79点</span>
                              <span className="text-gray-600">良好</span>
                            </div>
                            <div className="flex justify-between">
                              <span>C: 60-69点</span>
                              <span className="text-gray-600">標準</span>
                            </div>
                            <div className="flex justify-between">
                              <span>D: 60点未満</span>
                              <span className="text-gray-600">要改善</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="achievements">今期の成果・取り組み</Label>
                        <Textarea
                          id="achievements"
                          placeholder="今期の具体的な成果や取り組みを記入してください"
                          rows={4}
                        />
                      </div>
                      <div>
                        <Label htmlFor="challenges">課題と改善点</Label>
                        <Textarea
                          id="challenges"
                          placeholder="今後の課題や改善すべき点を記入してください"
                          rows={4}
                        />
                      </div>
                      <div>
                        <Label htmlFor="nextGoals">次期目標</Label>
                        <Textarea
                          id="nextGoals"
                          placeholder="次期の具体的な目標を記入してください"
                          rows={4}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="guide">
              <Card>
                <CardHeader>
                  <CardTitle>記入ガイド</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">評価の目的</h3>
                      <p className="text-sm text-gray-600">
                        この評価シートは、老健における若手看護師の成長と貢献度を公正に評価し、
                        今後の育成方針を明確にすることを目的としています。
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">技術評価の基準</h3>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        <li><strong>S（優秀）</strong>：期待を大きく上回る。リーダーシップを発揮</li>
                        <li><strong>A（良好）</strong>：期待を上回る。自立して高度な業務遂行可能</li>
                        <li><strong>B（標準）</strong>：期待通り。通常業務を問題なく遂行</li>
                        <li><strong>C（要努力）</strong>：期待をやや下回る。一部支援が必要</li>
                        <li><strong>D（要改善）</strong>：期待を大きく下回る。継続的な指導が必要</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">貢献度評価について</h3>
                      <p className="text-sm text-gray-600">
                        施設や法人への貢献度は、委員会活動、改善提案、研修参加、
                        チーム医療への貢献などを総合的に評価し、相対的な順位として表現します。
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">若手看護師の期待役割</h3>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        <li>自立した看護実践と的確なアセスメント</li>
                        <li>新人看護師への基本的な指導・サポート</li>
                        <li>多職種との積極的な連携とチーム医療の実践</li>
                        <li>施設内研修や勉強会への積極的参加</li>
                        <li>在宅復帰支援への主体的な取り組み</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-8 flex justify-end space-x-4">
            <Button variant="outline">下書き保存</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">評価を確定</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}