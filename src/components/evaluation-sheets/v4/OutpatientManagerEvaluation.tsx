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
import { InfoIcon, Calculator, Award, Users, Building, Target } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { V4EvaluationSheet, V4EvaluationScores, EvaluationGrade } from '@/types/evaluation';
import evaluationData from '@/data/evaluation-sheets/v4/outpatient-manager.json';

type TechnicalScoreCategory = 'business-results' | 'team-leadership' | 'strategic-planning' | 'quality-safety';
type EvaluatorType = 'superiorEval' | 'selfEval';

export default function OutpatientManagerEvaluation() {
  const sheet = evaluationData as V4EvaluationSheet;
  
  const [technicalScores, setTechnicalScores] = useState<{
    [key in EvaluatorType]: {
      [key in TechnicalScoreCategory]: number;
    };
  }>({
    superiorEval: { 
      'business-results': 0, 
      'team-leadership': 0, 
      'strategic-planning': 0, 
      'quality-safety': 0 
    },
    selfEval: { 
      'business-results': 0, 
      'team-leadership': 0, 
      'strategic-planning': 0, 
      'quality-safety': 0 
    }
  });

  const [facilityRank, setFacilityRank] = useState(50);
  const [corporateRank, setCorporateRank] = useState(50);
  const [totalScore, setTotalScore] = useState(0);

  const calculateTechnicalScore = () => {
    const superiorTotal = Object.values(technicalScores.superiorEval).reduce((a, b) => a + b, 0) / 4;
    const selfTotal = Object.values(technicalScores.selfEval).reduce((a, b) => a + b, 0) / 4;
    return (superiorTotal * 0.6 + selfTotal * 0.4) * 50;
  };

  const calculateContributionScore = (percentile: number) => {
    const rules = sheet.scoringRules.percentileToScore;
    if (percentile <= 10) return rules['10'];
    if (percentile <= 20) return rules['20'];
    if (percentile <= 30) return rules['30'];
    if (percentile <= 40) return rules['40'];
    if (percentile <= 50) return rules['50'];
    if (percentile <= 60) return rules['60'];
    if (percentile <= 70) return rules['70'];
    if (percentile <= 80) return rules['80'];
    if (percentile <= 90) return rules['90'];
    return rules['100'];
  };

  useEffect(() => {
    const technical = calculateTechnicalScore();
    const facility = calculateContributionScore(facilityRank);
    const corporate = calculateContributionScore(corporateRank);
    setTotalScore(Math.round((technical + facility + corporate) * 10) / 10);
  }, [technicalScores, facilityRank, corporateRank]);

  const handleTechnicalScoreChange = (
    evaluator: EvaluatorType, 
    category: TechnicalScoreCategory, 
    grade: EvaluationGrade
  ) => {
    setTechnicalScores(prev => ({
      ...prev,
      [evaluator]: {
        ...prev[evaluator],
        [category]: sheet.scoringRules.gradeToScore[grade] || 0
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
            {sheet.name} v{sheet.version}
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            {sheet.description}
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              <strong>評価構成：</strong>
              {sheet.evaluationStructure.technical.description}（{sheet.evaluationStructure.technical.weight}点） + 
              {sheet.evaluationStructure.facilityContribution.description}（{sheet.evaluationStructure.facilityContribution.weight}点） + 
              {sheet.evaluationStructure.corporateContribution.description}（{sheet.evaluationStructure.corporateContribution.weight}点）
            </AlertDescription>
          </Alert>

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
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">基本情報</TabsTrigger>
              <TabsTrigger value="technical">技術評価</TabsTrigger>
              <TabsTrigger value="facility">施設貢献</TabsTrigger>
              <TabsTrigger value="corporate">法人貢献</TabsTrigger>
              <TabsTrigger value="summary">総合評価</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="eval-date">評価日</Label>
                  <Input type="date" id="eval-date" />
                </div>
                <div>
                  <Label htmlFor="eval-period">評価期間</Label>
                  <Input type="text" id="eval-period" placeholder="2024年度上期 / 下期" />
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">職員情報</h3>
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
                    <Label htmlFor="department">管理部署</Label>
                    <Input type="text" id="department" value="外来" readOnly />
                  </div>
                  <div>
                    <Label htmlFor="experience">師長経験年数</Label>
                    <Input type="text" id="experience" placeholder="5年目" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">評価者情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="evaluator1">1次評価者（看護部長）</Label>
                    <Input type="text" id="evaluator1" />
                  </div>
                  <div>
                    <Label htmlFor="evaluator2">2次評価者（病院長）</Label>
                    <Input type="text" id="evaluator2" />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="technical" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">技術評価（50点）- 360度評価</h3>
                <p className="text-sm text-gray-600 mb-4">
                  上司評価60％（30点）＋ 本人評価40％（20点）で算出
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-4 text-blue-600">
                  {sheet.evaluationStructure.technical.evaluators.superior.evaluator}評価（60％）
                </h4>
                
                <div className="space-y-4">
                  {sheet.technicalEvaluationItems.map((item) => (
                    <div key={item.id}>
                      <Label className="text-sm font-medium">
                        {item.name}（{item.description}）
                      </Label>
                      <RadioGroup 
                        onValueChange={(value) => 
                          handleTechnicalScoreChange('superiorEval', item.id as TechnicalScoreCategory, value as EvaluationGrade)
                        }
                      >
                        <div className="grid grid-cols-5 gap-2 mt-2">
                          {(['S', 'A', 'B', 'C', 'D'] as EvaluationGrade[]).map((grade) => (
                            <div key={grade} className="flex items-center space-x-1">
                              <RadioGroupItem value={grade} id={`superior-${item.id}-${grade}`} />
                              <Label htmlFor={`superior-${item.id}-${grade}`} className="font-normal">
                                {grade}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                      <p className="text-xs text-gray-500 mt-1">
                        S:{item.grades.S} A:{item.grades.A} B:{item.grades.B} C:{item.grades.C} D:{item.grades.D}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-4 text-green-600">本人評価（40％）</h4>
                
                <div className="space-y-4">
                  {sheet.technicalEvaluationItems.map((item) => (
                    <div key={item.id}>
                      <Label className="text-sm font-medium">
                        {item.name}（{item.description}）
                      </Label>
                      <RadioGroup 
                        onValueChange={(value) => 
                          handleTechnicalScoreChange('selfEval', item.id as TechnicalScoreCategory, value as EvaluationGrade)
                        }
                      >
                        <div className="grid grid-cols-5 gap-2 mt-2">
                          {(['S', 'A', 'B', 'C', 'D'] as EvaluationGrade[]).map((grade) => (
                            <div key={grade} className="flex items-center space-x-1">
                              <RadioGroupItem value={grade} id={`self-${item.id}-${grade}`} />
                              <Label htmlFor={`self-${item.id}-${grade}`} className="font-normal">
                                {grade}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <Label htmlFor="self-reflection">自己振り返り・学習計画</Label>
                <Textarea 
                  id="self-reflection" 
                  placeholder="外来運営での成果、チーム管理での課題、戦略的取り組みなど"
                  className="min-h-[100px] mt-2"
                />
              </div>
            </TabsContent>

            <TabsContent value="facility" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">施設貢献評価（25点）</h3>
                <p className="text-sm text-gray-600 mb-4">
                  外来運営の中核としての組織的貢献を評価
                </p>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60%]">活動項目</TableHead>
                      <TableHead className="text-center">ポイント</TableHead>
                      <TableHead className="text-center">実績</TableHead>
                      <TableHead className="text-center">合計</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sheet.facilityContributionItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-center">{item.points}pt/{item.unit}</TableCell>
                        <TableCell className="text-center">
                          <Input type="number" className="w-16 mx-auto" placeholder="0" />
                        </TableCell>
                        <TableCell className="text-center font-semibold">0pt</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">施設内相対評価（外来師長間）</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="facility-rank">施設内順位</Label>
                    <div className="flex gap-2 mt-1">
                      <Input type="number" id="facility-rank" placeholder="1" className="w-20" />
                      <span className="self-center">位 /</span>
                      <Input type="number" placeholder="3" className="w-20" />
                      <span className="self-center">人中</span>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="facility-percentile">パーセンタイル</Label>
                    <div className="flex gap-2 mt-1">
                      <span className="self-center">上位</span>
                      <Input 
                        type="number" 
                        id="facility-percentile" 
                        value={facilityRank}
                        onChange={(e) => setFacilityRank(Number(e.target.value))}
                        className="w-20" 
                      />
                      <span className="self-center">％</span>
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-sm font-medium">施設貢献度得点：</span>
                  <span className="ml-2 font-bold text-lg">{calculateContributionScore(facilityRank)} / 25点</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="corporate" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">法人貢献評価（25点）</h3>
                <p className="text-sm text-gray-600 mb-4">
                  法人全体での活動参加と貢献を評価
                </p>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60%]">活動項目</TableHead>
                      <TableHead className="text-center">ポイント</TableHead>
                      <TableHead className="text-center">実績</TableHead>
                      <TableHead className="text-center">合計</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sheet.corporateContributionItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-center">{item.points}pt/{item.unit}</TableCell>
                        <TableCell className="text-center">
                          <Input type="number" className="w-16 mx-auto" placeholder="0" />
                        </TableCell>
                        <TableCell className="text-center font-semibold">0pt</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">法人内相対評価（全師長間）</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="corporate-rank">法人内順位</Label>
                    <div className="flex gap-2 mt-1">
                      <Input type="number" id="corporate-rank" placeholder="5" className="w-20" />
                      <span className="self-center">位 /</span>
                      <Input type="number" placeholder="20" className="w-20" />
                      <span className="self-center">人中</span>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="corporate-percentile">パーセンタイル</Label>
                    <div className="flex gap-2 mt-1">
                      <span className="self-center">上位</span>
                      <Input 
                        type="number" 
                        id="corporate-percentile" 
                        value={corporateRank}
                        onChange={(e) => setCorporateRank(Number(e.target.value))}
                        className="w-20" 
                      />
                      <span className="self-center">％</span>
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-sm font-medium">法人貢献度得点：</span>
                  <span className="ml-2 font-bold text-lg">{calculateContributionScore(corporateRank)} / 25点</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="summary" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">総合評価サマリー</h3>
                
                <div className="border rounded-lg p-4 bg-blue-50">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">総合得点</span>
                      <p className={`text-3xl font-bold ${getScoreColor(totalScore)}`}>
                        {totalScore} / 100点
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">評価ランク</span>
                      <p className="text-3xl font-bold">
                        {totalScore >= 90 ? 'S' : totalScore >= 80 ? 'A' : totalScore >= 70 ? 'B' : totalScore >= 60 ? 'C' : 'D'}
                      </p>
                    </div>
                  </div>
                </div>

                <Table className="mt-6">
                  <TableHeader>
                    <TableRow>
                      <TableHead>評価項目</TableHead>
                      <TableHead className="text-right">配点</TableHead>
                      <TableHead className="text-right">得点</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>技術評価（360度評価）</TableCell>
                      <TableCell className="text-right">50点</TableCell>
                      <TableCell className="text-right font-bold">
                        {Math.round(calculateTechnicalScore() * 10) / 10}点
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>施設貢献度（相対評価）</TableCell>
                      <TableCell className="text-right">25点</TableCell>
                      <TableCell className="text-right font-bold">
                        {calculateContributionScore(facilityRank)}点
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>法人貢献度（相対評価）</TableCell>
                      <TableCell className="text-right">25点</TableCell>
                      <TableCell className="text-right font-bold">
                        {calculateContributionScore(corporateRank)}点
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-bold">合計</TableCell>
                      <TableCell className="text-right font-bold">100点</TableCell>
                      <TableCell className="text-right font-bold text-lg">
                        {totalScore}点
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <div className="mt-6 space-y-4">
                  <div>
                    <Label htmlFor="next-challenges">次期の課題・目標</Label>
                    <Textarea 
                      id="next-challenges" 
                      placeholder="外来部門の更なる発展、組織改革、人材育成など"
                      className="min-h-[100px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="evaluator-comment">評価者コメント</Label>
                    <Textarea 
                      id="evaluator-comment" 
                      placeholder="経営管理能力、リーダーシップ、組織貢献などを記入"
                      className="min-h-[100px]"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <Button variant="outline">一時保存</Button>
                  <Button>評価確定</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}