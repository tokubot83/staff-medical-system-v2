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

type TechnicalScoreCategory = 'careSkills' | 'safety' | 'communication' | 'development';
type EvaluatorType = 'superiorEval' | 'selfEval';

export default function RokenJuniorCareWorkerEvaluationV4Pattern5() {
  const [technicalScores, setTechnicalScores] = useState<{
    [key in EvaluatorType]: {
      [key in TechnicalScoreCategory]: number;
    };
  }>({
    superiorEval: { careSkills: 0, safety: 0, communication: 0, development: 0 },
    selfEval: { careSkills: 0, safety: 0, communication: 0, development: 0 }
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

  const calculateTechnicalScore = () => {
    const superiorTotal = Object.values(technicalScores.superiorEval).reduce((a, b) => a + b, 0) / 4;
    const selfTotal = Object.values(technicalScores.selfEval).reduce((a, b) => a + b, 0) / 4;
    return (superiorTotal * 0.6 + selfTotal * 0.4) * 50;
  };

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
            老健 一般介護職員（2-3年目） 人事評価シート v4.0
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            介護老人保健施設における一般介護職員（無資格）の評価
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
                      <Input id="employeeCode" placeholder="例: CS002" />
                    </div>
                    <div>
                      <Label htmlFor="employeeName">氏名</Label>
                      <Input id="employeeName" placeholder="鈴木 美咲" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="department">所属部署</Label>
                      <Input id="department" placeholder="老健介護部" defaultValue="老健介護部" />
                    </div>
                    <div>
                      <Label htmlFor="position">職位</Label>
                      <Input id="position" placeholder="一般介護職員" defaultValue="一般介護職員" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="qualification">保有資格</Label>
                      <Input id="qualification" placeholder="介護職員初任者研修修了" />
                    </div>
                    <div>
                      <Label htmlFor="experience">介護経験</Label>
                      <Input id="experience" placeholder="2年6ヶ月" />
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
                            <Label className="text-base font-semibold">1. 基本的介護技術</Label>
                            <p className="text-sm text-gray-600 mb-2">
                              日常生活支援、移乗・移動介助、入浴・食事・排泄介助の確実な実施
                            </p>
                            <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'careSkills', value as keyof typeof gradeToScore)}>
                              <div className="flex space-x-4">
                                {['S', 'A', 'B', 'C', 'D'].map(grade => (
                                  <div key={grade} className="flex items-center">
                                    <RadioGroupItem value={grade} id={`superior-care-${grade}`} />
                                    <Label htmlFor={`superior-care-${grade}`} className="ml-2">
                                      {grade}({grade === 'S' ? '優秀' : grade === 'A' ? '良好' : grade === 'B' ? '標準' : grade === 'C' ? '要努力' : '要改善'})
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </RadioGroup>
                          </div>

                          <div>
                            <Label className="text-base font-semibold">2. 安全管理・リスク意識</Label>
                            <p className="text-sm text-gray-600 mb-2">
                              事故防止対策、感染対策、安全確認、危険予知
                            </p>
                            <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'safety', value as keyof typeof gradeToScore)}>
                              <div className="flex space-x-4">
                                {['S', 'A', 'B', 'C', 'D'].map(grade => (
                                  <div key={grade} className="flex items-center">
                                    <RadioGroupItem value={grade} id={`superior-safety-${grade}`} />
                                    <Label htmlFor={`superior-safety-${grade}`} className="ml-2">
                                      {grade}({grade === 'S' ? '優秀' : grade === 'A' ? '良好' : grade === 'B' ? '標準' : grade === 'C' ? '要努力' : '要改善'})
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </RadioGroup>
                          </div>

                          <div>
                            <Label className="text-base font-semibold">3. コミュニケーション・チームワーク</Label>
                            <p className="text-sm text-gray-600 mb-2">
                              利用者・家族対応、スタッフ連携、記録・申し送り
                            </p>
                            <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'communication', value as keyof typeof gradeToScore)}>
                              <div className="flex space-x-4">
                                {['S', 'A', 'B', 'C', 'D'].map(grade => (
                                  <div key={grade} className="flex items-center">
                                    <RadioGroupItem value={grade} id={`superior-communication-${grade}`} />
                                    <Label htmlFor={`superior-communication-${grade}`} className="ml-2">
                                      {grade}({grade === 'S' ? '優秀' : grade === 'A' ? '良好' : grade === 'B' ? '標準' : grade === 'C' ? '要努力' : '要改善'})
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </RadioGroup>
                          </div>

                          <div>
                            <Label className="text-base font-semibold">4. 資格取得・スキル向上</Label>
                            <p className="text-sm text-gray-600 mb-2">
                              介護福祉士資格取得への取り組み、研修参加、知識・技術習得意欲
                            </p>
                            <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'development', value as keyof typeof gradeToScore)}>
                              <div className="flex space-x-4">
                                {['S', 'A', 'B', 'C', 'D'].map(grade => (
                                  <div key={grade} className="flex items-center">
                                    <RadioGroupItem value={grade} id={`superior-development-${grade}`} />
                                    <Label htmlFor={`superior-development-${grade}`} className="ml-2">
                                      {grade}({grade === 'S' ? '優秀' : grade === 'A' ? '良好' : grade === 'B' ? '標準' : grade === 'C' ? '要努力' : '要改善'})
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </RadioGroup>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="self" className="space-y-4">
                        <div className="space-y-4">
                          <div>
                            <Label className="text-base font-semibold">1. 基本的介護技術</Label>
                            <p className="text-sm text-gray-600 mb-2">
                              日常生活支援、移乗・移動介助、入浴・食事・排泄介助の確実な実施
                            </p>
                            <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'careSkills', value as keyof typeof gradeToScore)}>
                              <div className="flex space-x-4">
                                {['S', 'A', 'B', 'C', 'D'].map(grade => (
                                  <div key={grade} className="flex items-center">
                                    <RadioGroupItem value={grade} id={`self-care-${grade}`} />
                                    <Label htmlFor={`self-care-${grade}`} className="ml-2">
                                      {grade}({grade === 'S' ? '優秀' : grade === 'A' ? '良好' : grade === 'B' ? '標準' : grade === 'C' ? '要努力' : '要改善'})
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </RadioGroup>
                          </div>

                          <div>
                            <Label className="text-base font-semibold">2. 安全管理・リスク意識</Label>
                            <p className="text-sm text-gray-600 mb-2">
                              事故防止対策、感染対策、安全確認、危険予知
                            </p>
                            <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'safety', value as keyof typeof gradeToScore)}>
                              <div className="flex space-x-4">
                                {['S', 'A', 'B', 'C', 'D'].map(grade => (
                                  <div key={grade} className="flex items-center">
                                    <RadioGroupItem value={grade} id={`self-safety-${grade}`} />
                                    <Label htmlFor={`self-safety-${grade}`} className="ml-2">
                                      {grade}({grade === 'S' ? '優秀' : grade === 'A' ? '良好' : grade === 'B' ? '標準' : grade === 'C' ? '要努力' : '要改善'})
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </RadioGroup>
                          </div>

                          <div>
                            <Label className="text-base font-semibold">3. コミュニケーション・チームワーク</Label>
                            <p className="text-sm text-gray-600 mb-2">
                              利用者・家族対応、スタッフ連携、記録・申し送り
                            </p>
                            <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'communication', value as keyof typeof gradeToScore)}>
                              <div className="flex space-x-4">
                                {['S', 'A', 'B', 'C', 'D'].map(grade => (
                                  <div key={grade} className="flex items-center">
                                    <RadioGroupItem value={grade} id={`self-communication-${grade}`} />
                                    <Label htmlFor={`self-communication-${grade}`} className="ml-2">
                                      {grade}({grade === 'S' ? '優秀' : grade === 'A' ? '良好' : grade === 'B' ? '標準' : grade === 'C' ? '要努力' : '要改善'})
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </RadioGroup>
                          </div>

                          <div>
                            <Label className="text-base font-semibold">4. 資格取得・スキル向上</Label>
                            <p className="text-sm text-gray-600 mb-2">
                              介護福祉士資格取得への取り組み、研修参加、知識・技術習得意欲
                            </p>
                            <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'development', value as keyof typeof gradeToScore)}>
                              <div className="flex space-x-4">
                                {['S', 'A', 'B', 'C', 'D'].map(grade => (
                                  <div key={grade} className="flex items-center">
                                    <RadioGroupItem value={grade} id={`self-development-${grade}`} />
                                    <Label htmlFor={`self-development-${grade}`} className="ml-2">
                                      {grade}({grade === 'S' ? '優秀' : grade === 'A' ? '良好' : grade === 'B' ? '標準' : grade === 'C' ? '要努力' : '要改善'})
                                    </Label>
                                  </div>
                                ))}
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
                        この評価シートは、老健における一般介護職員の成長と貢献度を公正に評価し、
                        今後のキャリア開発を明確にすることを目的としています。
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">一般介護職員の期待役割</h3>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        <li>基本的介護技術の確実な習得と実践</li>
                        <li>安全意識を持った業務遂行</li>
                        <li>利用者・家族との良好な関係構築</li>
                        <li>チーム医療・介護への協働参加</li>
                        <li>介護福祉士資格取得に向けた継続的な学習</li>
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