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

// Type definitions
type TechnicalScoreCategory = 'careSkills' | 'safety' | 'communication' | 'teamwork';
type EvaluatorType = 'superiorEval' | 'selfEval';

export default function JuniorNursingAideEvaluationV4Pattern5() {
  // 評価項目の状態管理
  const [technicalScores, setTechnicalScores] = useState<{
    [K in EvaluatorType]: Record<TechnicalScoreCategory, number>
  }>({
    superiorEval: { careSkills: 0, safety: 0, communication: 0, teamwork: 0 },
    selfEval: { careSkills: 0, safety: 0, communication: 0, teamwork: 0 }
  });

  const [contributionPoints, setContributionPoints] = useState({
    facility: 0,
    corporate: 0
  });

  const [totalScore, setTotalScore] = useState(0);
  const [facilityRank, setFacilityRank] = useState(50); // パーセンタイル
  const [corporateRank, setCorporateRank] = useState(50);

  // 評価グレードから点数への変換
  const gradeToScore: Record<string, number> = {
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
  }, [technicalScores, facilityRank, corporateRank]);

  const handleTechnicalScoreChange = (evaluator: EvaluatorType, category: TechnicalScoreCategory, grade: keyof typeof gradeToScore) => {
    setTechnicalScores(prev => ({
      ...prev,
      [evaluator]: {
        ...prev[evaluator],
        [category]: gradeToScore[grade]
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
            一般看護補助者（2-3年目） 人事評価シート v4.0
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            パターン5改良版 - 自立した業務遂行と後輩指導を重視した評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              <strong>評価構成：</strong>技術評価（360度評価）50点 + 施設貢献（相対評価）25点 + 法人貢献（相対評価）25点
              <br />
              一般看護補助者は自立した業務遂行能力と後輩指導への貢献を重点的に評価します
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

          <Tabs defaultValue="technical" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="technical">技術評価（50点）</TabsTrigger>
              <TabsTrigger value="facility">施設貢献（25点）</TabsTrigger>
              <TabsTrigger value="corporate">法人貢献（25点）</TabsTrigger>
            </TabsList>

            {/* 技術評価タブ */}
            <TabsContent value="technical" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">技術評価（360度評価：上司60%＋自己40%）</h3>
                <p className="text-sm text-gray-600 mb-4">
                  看護補助者としての実践能力と指導力を評価します
                </p>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/3">評価項目</TableHead>
                    <TableHead className="text-center">上司評価</TableHead>
                    <TableHead className="text-center">自己評価</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <div>
                        <p className="font-semibold">1. 応用的介護技術</p>
                        <p className="text-sm text-gray-600">
                          個別性に応じた援助、効率的な業務遂行、難易度の高い援助技術
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'careSkills', value as keyof typeof gradeToScore)}>
                        <div className="flex justify-center space-x-2">
                          {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                            <div key={grade} className="flex items-center">
                              <RadioGroupItem value={grade} id={`superior-care-${grade}`} />
                              <Label htmlFor={`superior-care-${grade}`} className="ml-1 cursor-pointer">
                                {grade}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </TableCell>
                    <TableCell>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'careSkills', value as keyof typeof gradeToScore)}>
                        <div className="flex justify-center space-x-2">
                          {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                            <div key={grade} className="flex items-center">
                              <RadioGroupItem value={grade} id={`self-care-${grade}`} />
                              <Label htmlFor={`self-care-${grade}`} className="ml-1 cursor-pointer">
                                {grade}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <div>
                        <p className="font-semibold">2. リスクマネジメント</p>
                        <p className="text-sm text-gray-600">
                          リスク予測と対応、インシデント分析、改善提案
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'safety', value as keyof typeof gradeToScore)}>
                        <div className="flex justify-center space-x-2">
                          {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                            <div key={grade} className="flex items-center">
                              <RadioGroupItem value={grade} id={`superior-safety-${grade}`} />
                              <Label htmlFor={`superior-safety-${grade}`} className="ml-1 cursor-pointer">
                                {grade}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </TableCell>
                    <TableCell>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'safety', value as keyof typeof gradeToScore)}>
                        <div className="flex justify-center space-x-2">
                          {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                            <div key={grade} className="flex items-center">
                              <RadioGroupItem value={grade} id={`self-safety-${grade}`} />
                              <Label htmlFor={`self-safety-${grade}`} className="ml-1 cursor-pointer">
                                {grade}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <div>
                        <p className="font-semibold">3. コミュニケーション・連携</p>
                        <p className="text-sm text-gray-600">
                          多職種連携、情報共有、問題解決能力
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'communication', value as keyof typeof gradeToScore)}>
                        <div className="flex justify-center space-x-2">
                          {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                            <div key={grade} className="flex items-center">
                              <RadioGroupItem value={grade} id={`superior-comm-${grade}`} />
                              <Label htmlFor={`superior-comm-${grade}`} className="ml-1 cursor-pointer">
                                {grade}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </TableCell>
                    <TableCell>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'communication', value as keyof typeof gradeToScore)}>
                        <div className="flex justify-center space-x-2">
                          {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                            <div key={grade} className="flex items-center">
                              <RadioGroupItem value={grade} id={`self-comm-${grade}`} />
                              <Label htmlFor={`self-comm-${grade}`} className="ml-1 cursor-pointer">
                                {grade}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <div>
                        <p className="font-semibold">4. 後輩指導・チーム貢献</p>
                        <p className="text-sm text-gray-600">
                          新人指導、業務改善提案、チームワーク向上への貢献
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'teamwork', value as keyof typeof gradeToScore)}>
                        <div className="flex justify-center space-x-2">
                          {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                            <div key={grade} className="flex items-center">
                              <RadioGroupItem value={grade} id={`superior-team-${grade}`} />
                              <Label htmlFor={`superior-team-${grade}`} className="ml-1 cursor-pointer">
                                {grade}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </TableCell>
                    <TableCell>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'teamwork', value as keyof typeof gradeToScore)}>
                        <div className="flex justify-center space-x-2">
                          {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                            <div key={grade} className="flex items-center">
                              <RadioGroupItem value={grade} id={`self-team-${grade}`} />
                              <Label htmlFor={`self-team-${grade}`} className="ml-1 cursor-pointer">
                                {grade}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">技術評価スコア</h4>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(calculateTechnicalScore() * 10) / 10} / 50点
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  上司評価（60%）+ 本人評価（40%）の総合評価
                </p>
              </div>
            </TabsContent>

            {/* 施設貢献評価タブ */}
            <TabsContent value="facility" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">施設貢献評価（25点）- 相対評価</h3>
                <p className="text-sm text-gray-600 mb-4">
                  施設内での貢献度を相対評価で測定します
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="facility-rank">施設内順位（パーセンタイル）</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <Input
                      id="facility-rank"
                      type="number"
                      min="1"
                      max="100"
                      value={facilityRank}
                      onChange={(e) => setFacilityRank(Math.min(100, Math.max(1, parseInt(e.target.value) || 50)))}
                      className="w-24"
                    />
                    <span className="text-sm text-gray-600">パーセンタイル（1-100）</span>
                    <span className="ml-auto font-bold text-lg text-green-600">
                      {calculateContributionScore(facilityRank)}点
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    上位10%=25点、上位20%=22.5点、上位30%=20点...
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* 法人貢献評価タブ */}
            <TabsContent value="corporate" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">法人貢献評価（25点）- 相対評価</h3>
                <p className="text-sm text-gray-600 mb-4">
                  法人全体での貢献度を相対評価で測定します
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="corporate-rank">法人内順位（パーセンタイル）</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <Input
                      id="corporate-rank"
                      type="number"
                      min="1"
                      max="100"
                      value={corporateRank}
                      onChange={(e) => setCorporateRank(Math.min(100, Math.max(1, parseInt(e.target.value) || 50)))}
                      className="w-24"
                    />
                    <span className="text-sm text-gray-600">パーセンタイル（1-100）</span>
                    <span className="ml-auto font-bold text-lg text-orange-600">
                      {calculateContributionScore(corporateRank)}点
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    上位10%=25点、上位20%=22.5点、上位30%=20点...
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}