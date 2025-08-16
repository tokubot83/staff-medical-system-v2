'use client';

import React, { useState, useEffect, useCallback } from 'react';
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

type TechnicalScoreCategory = 'clinicalSkills' | 'assessment' | 'teamwork' | 'support';
type EvaluatorType = 'superiorEval' | 'selfEval';

export default function RokenJuniorAssistantNurseEvaluationV4Pattern5() {
  const [technicalScores, setTechnicalScores] = useState<{
    [key in EvaluatorType]: {
      [key in TechnicalScoreCategory]: number;
    };
  }>({
    superiorEval: { clinicalSkills: 0, assessment: 0, teamwork: 0, support: 0 },
    selfEval: { clinicalSkills: 0, assessment: 0, teamwork: 0, support: 0 }
  });

  const [contributionPoints, setContributionPoints] = useState({
    facility: 0,
    corporate: 0
  });

  const [totalScore, setTotalScore] = useState(0);
  const [facilityRank, setFacilityRank] = useState(50);
  const [corporateRank, setCorporateRank] = useState(50);

  const gradeToScore = {
    'S': 1.0,
    'A': 0.85,
    'B': 0.70,
    'C': 0.55,
    'D': 0.40
  };

  const calculateTechnicalScore = useCallback(() => {
    const superiorTotal = Object.values(technicalScores.superiorEval).reduce((a, b) => a + b, 0) / 4;
    const selfTotal = Object.values(technicalScores.selfEval).reduce((a, b) => a + b, 0) / 4;
    return (superiorTotal * 0.6 + selfTotal * 0.4) * 50;
  }, [technicalScores]);

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
            老健 一般准看護師（2-3年目） 人事評価シート v4.0
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            介護老人保健施設における一般准看護師の評価
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
                      <Input id="employeeCode" placeholder="例: LN002" />
                    </div>
                    <div>
                      <Label htmlFor="employeeName">氏名</Label>
                      <Input id="employeeName" placeholder="佐藤 みどり" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="department">所属部署</Label>
                      <Input id="department" placeholder="老健看護部" defaultValue="老健看護部" />
                    </div>
                    <div>
                      <Label htmlFor="position">職位</Label>
                      <Input id="position" placeholder="一般准看護師" defaultValue="一般准看護師" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="qualification">保有資格</Label>
                      <Input id="qualification" placeholder="准看護師" defaultValue="准看護師" />
                    </div>
                    <div>
                      <Label htmlFor="licenseNumber">免許番号</Label>
                      <Input id="licenseNumber" placeholder="第L-23456号" />
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
                            <Label className="text-base font-semibold">1. 熟練した看護技術</Label>
                            <p className="text-sm text-gray-600 mb-2">
                              確実な技術提供、効率的な業務遂行、複数利用者の同時対応
                            </p>
                            <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'clinicalSkills', value as keyof typeof gradeToScore)}>
                              <div className="flex space-x-4">
                                <div className="flex items-center">
                                  <RadioGroupItem value="S" id="superior-clinical-s" />
                                  <Label htmlFor="superior-clinical-s" className="ml-2">S(優秀)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="A" id="superior-clinical-a" />
                                  <Label htmlFor="superior-clinical-a" className="ml-2">A(良好)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="B" id="superior-clinical-b" />
                                  <Label htmlFor="superior-clinical-b" className="ml-2">B(標準)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="C" id="superior-clinical-c" />
                                  <Label htmlFor="superior-clinical-c" className="ml-2">C(要努力)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="D" id="superior-clinical-d" />
                                  <Label htmlFor="superior-clinical-d" className="ml-2">D(要改善)</Label>
                                </div>
                              </div>
                            </RadioGroup>
                          </div>

                          <div>
                            <Label className="text-base font-semibold">2. 観察・判断力</Label>
                            <p className="text-sm text-gray-600 mb-2">
                              利用者状態の適切な観察、異常の早期発見、適切な報告
                            </p>
                            <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'assessment', value as keyof typeof gradeToScore)}>
                              <div className="flex space-x-4">
                                <div className="flex items-center">
                                  <RadioGroupItem value="S" id="superior-assessment-s" />
                                  <Label htmlFor="superior-assessment-s" className="ml-2">S(優秀)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="A" id="superior-assessment-a" />
                                  <Label htmlFor="superior-assessment-a" className="ml-2">A(良好)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="B" id="superior-assessment-b" />
                                  <Label htmlFor="superior-assessment-b" className="ml-2">B(標準)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="C" id="superior-assessment-c" />
                                  <Label htmlFor="superior-assessment-c" className="ml-2">C(要努力)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="D" id="superior-assessment-d" />
                                  <Label htmlFor="superior-assessment-d" className="ml-2">D(要改善)</Label>
                                </div>
                              </div>
                            </RadioGroup>
                          </div>

                          <div>
                            <Label className="text-base font-semibold">3. チーム連携・協働</Label>
                            <p className="text-sm text-gray-600 mb-2">
                              看護師との協働、多職種連携、情報共有の質
                            </p>
                            <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'teamwork', value as keyof typeof gradeToScore)}>
                              <div className="flex space-x-4">
                                <div className="flex items-center">
                                  <RadioGroupItem value="S" id="superior-teamwork-s" />
                                  <Label htmlFor="superior-teamwork-s" className="ml-2">S(優秀)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="A" id="superior-teamwork-a" />
                                  <Label htmlFor="superior-teamwork-a" className="ml-2">A(良好)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="B" id="superior-teamwork-b" />
                                  <Label htmlFor="superior-teamwork-b" className="ml-2">B(標準)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="C" id="superior-teamwork-c" />
                                  <Label htmlFor="superior-teamwork-c" className="ml-2">C(要努力)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="D" id="superior-teamwork-d" />
                                  <Label htmlFor="superior-teamwork-d" className="ml-2">D(要改善)</Label>
                                </div>
                              </div>
                            </RadioGroup>
                          </div>

                          <div>
                            <Label className="text-base font-semibold">4. 在宅復帰支援・家族ケア</Label>
                            <p className="text-sm text-gray-600 mb-2">
                              在宅復帰への看護支援、家族指導・相談対応
                            </p>
                            <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'support', value as keyof typeof gradeToScore)}>
                              <div className="flex space-x-4">
                                <div className="flex items-center">
                                  <RadioGroupItem value="S" id="superior-support-s" />
                                  <Label htmlFor="superior-support-s" className="ml-2">S(優秀)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="A" id="superior-support-a" />
                                  <Label htmlFor="superior-support-a" className="ml-2">A(良好)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="B" id="superior-support-b" />
                                  <Label htmlFor="superior-support-b" className="ml-2">B(標準)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="C" id="superior-support-c" />
                                  <Label htmlFor="superior-support-c" className="ml-2">C(要努力)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="D" id="superior-support-d" />
                                  <Label htmlFor="superior-support-d" className="ml-2">D(要改善)</Label>
                                </div>
                              </div>
                            </RadioGroup>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="self" className="space-y-4">
                        <div className="space-y-4">
                          <div>
                            <Label className="text-base font-semibold">1. 熟練した看護技術</Label>
                            <p className="text-sm text-gray-600 mb-2">
                              確実な技術提供、効率的な業務遂行、複数利用者の同時対応
                            </p>
                            <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'clinicalSkills', value as keyof typeof gradeToScore)}>
                              <div className="flex space-x-4">
                                <div className="flex items-center">
                                  <RadioGroupItem value="S" id="self-clinical-s" />
                                  <Label htmlFor="self-clinical-s" className="ml-2">S(優秀)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="A" id="self-clinical-a" />
                                  <Label htmlFor="self-clinical-a" className="ml-2">A(良好)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="B" id="self-clinical-b" />
                                  <Label htmlFor="self-clinical-b" className="ml-2">B(標準)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="C" id="self-clinical-c" />
                                  <Label htmlFor="self-clinical-c" className="ml-2">C(要努力)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="D" id="self-clinical-d" />
                                  <Label htmlFor="self-clinical-d" className="ml-2">D(要改善)</Label>
                                </div>
                              </div>
                            </RadioGroup>
                          </div>

                          <div>
                            <Label className="text-base font-semibold">2. 観察・判断力</Label>
                            <p className="text-sm text-gray-600 mb-2">
                              利用者状態の適切な観察、異常の早期発見、適切な報告
                            </p>
                            <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'assessment', value as keyof typeof gradeToScore)}>
                              <div className="flex space-x-4">
                                <div className="flex items-center">
                                  <RadioGroupItem value="S" id="self-assessment-s" />
                                  <Label htmlFor="self-assessment-s" className="ml-2">S(優秀)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="A" id="self-assessment-a" />
                                  <Label htmlFor="self-assessment-a" className="ml-2">A(良好)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="B" id="self-assessment-b" />
                                  <Label htmlFor="self-assessment-b" className="ml-2">B(標準)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="C" id="self-assessment-c" />
                                  <Label htmlFor="self-assessment-c" className="ml-2">C(要努力)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="D" id="self-assessment-d" />
                                  <Label htmlFor="self-assessment-d" className="ml-2">D(要改善)</Label>
                                </div>
                              </div>
                            </RadioGroup>
                          </div>

                          <div>
                            <Label className="text-base font-semibold">3. チーム連携・協働</Label>
                            <p className="text-sm text-gray-600 mb-2">
                              看護師との協働、多職種連携、情報共有の質
                            </p>
                            <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'teamwork', value as keyof typeof gradeToScore)}>
                              <div className="flex space-x-4">
                                <div className="flex items-center">
                                  <RadioGroupItem value="S" id="self-teamwork-s" />
                                  <Label htmlFor="self-teamwork-s" className="ml-2">S(優秀)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="A" id="self-teamwork-a" />
                                  <Label htmlFor="self-teamwork-a" className="ml-2">A(良好)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="B" id="self-teamwork-b" />
                                  <Label htmlFor="self-teamwork-b" className="ml-2">B(標準)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="C" id="self-teamwork-c" />
                                  <Label htmlFor="self-teamwork-c" className="ml-2">C(要努力)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="D" id="self-teamwork-d" />
                                  <Label htmlFor="self-teamwork-d" className="ml-2">D(要改善)</Label>
                                </div>
                              </div>
                            </RadioGroup>
                          </div>

                          <div>
                            <Label className="text-base font-semibold">4. 在宅復帰支援・家族ケア</Label>
                            <p className="text-sm text-gray-600 mb-2">
                              在宅復帰への看護支援、家族指導・相談対応
                            </p>
                            <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'support', value as keyof typeof gradeToScore)}>
                              <div className="flex space-x-4">
                                <div className="flex items-center">
                                  <RadioGroupItem value="S" id="self-support-s" />
                                  <Label htmlFor="self-support-s" className="ml-2">S(優秀)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="A" id="self-support-a" />
                                  <Label htmlFor="self-support-a" className="ml-2">A(良好)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="B" id="self-support-b" />
                                  <Label htmlFor="self-support-b" className="ml-2">B(標準)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="C" id="self-support-c" />
                                  <Label htmlFor="self-support-c" className="ml-2">C(要努力)</Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="D" id="self-support-d" />
                                  <Label htmlFor="self-support-d" className="ml-2">D(要改善)</Label>
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
                        この評価シートは、老健における一般准看護師の成長と貢献度を公正に評価し、
                        今後のキャリア開発を明確にすることを目的としています。
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">一般准看護師の期待役割</h3>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        <li>熟練した看護技術による質の高いケア提供</li>
                        <li>利用者状態の的確な観察と判断</li>
                        <li>チーム医療における積極的な協働</li>
                        <li>在宅復帰支援への専門的関与</li>
                        <li>家族への適切な支援とコミュニケーション</li>
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