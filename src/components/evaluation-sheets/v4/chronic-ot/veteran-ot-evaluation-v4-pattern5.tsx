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

export default function VeteranOTEvaluationV4Pattern5() {
  // 評価項目の状態管理
  const [technicalScores, setTechnicalScores] = useState({
    superiorEval: { 
      assessment: 0,      // 評価技術
      treatment: 0,       // 治療技術
      planning: 0,        // 計画立案
      documentation: 0    // 記録・報告
    },
    selfEval: { 
      assessment: 0, 
      treatment: 0, 
      planning: 0, 
      documentation: 0 
    }
  });

  const [contributionPoints, setContributionPoints] = useState({
    facility: 0,
    corporate: 0
  });

  const [totalScore, setTotalScore] = useState(0);
  const [facilityRank, setFacilityRank] = useState(50);
  const [corporateRank, setCorporateRank] = useState(50);

  const gradeToScore: Record<string, number> = {
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
  }, [technicalScores, facilityRank, corporateRank]);

  const handleTechnicalScoreChange = (evaluator: 'superiorEval' | 'selfEval', category: string, grade: string) => {
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
            療養型ベテラン作業療法士（11年以上） 人事評価シート v4.0
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            パターン5改良版 - 療養型作業療法のエキスパートとして組織貢献とメンタリングを重視した評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              本評価シートは技術評価（50点）と貢献度評価（50点）の合計100点満点で構成されています。
              療養型病床におけるベテラン作業療法士のエキスパートとしての技術発揮と組織への貢献を評価します。
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="technical" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="technical">技術評価</TabsTrigger>
              <TabsTrigger value="contribution">貢献度評価</TabsTrigger>
              <TabsTrigger value="summary">総合評価</TabsTrigger>
              <TabsTrigger value="feedback">フィードバック</TabsTrigger>
            </TabsList>

            <TabsContent value="technical">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    技術評価（50点満点）
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4">上司評価（60%）</h3>
                    <div className="space-y-4">
                      <div>
                        <Label>エキスパート評価技術（高次脳機能総合評価、重度認知症評価、終末期QOL評価等）</Label>
                        <RadioGroup 
                          onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'assessment', value)}
                          className="flex flex-row gap-4 mt-2"
                        >
                          {['S', 'A', 'B', 'C', 'D'].map(grade => (
                            <div key={grade} className="flex items-center space-x-2">
                              <RadioGroupItem value={grade} id={`superior-assessment-${grade}`} />
                              <Label htmlFor={`superior-assessment-${grade}`}>{grade}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                      <div>
                        <Label>最高度治療技術（終末期ケア、重症例対応、難治例アプローチ、イノベーション創出）</Label>
                        <RadioGroup 
                          onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'treatment', value)}
                          className="flex flex-row gap-4 mt-2"
                        >
                          {['S', 'A', 'B', 'C', 'D'].map(grade => (
                            <div key={grade} className="flex items-center space-x-2">
                              <RadioGroupItem value={grade} id={`superior-treatment-${grade}`} />
                              <Label htmlFor={`superior-treatment-${grade}`}>{grade}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                      <div>
                        <Label>戦略的計画立案能力（病棟全体最適化、長期展望、質向上企画、組織改善提案）</Label>
                        <RadioGroup 
                          onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'planning', value)}
                          className="flex flex-row gap-4 mt-2"
                        >
                          {['S', 'A', 'B', 'C', 'D'].map(grade => (
                            <div key={grade} className="flex items-center space-x-2">
                              <RadioGroupItem value={grade} id={`superior-planning-${grade}`} />
                              <Label htmlFor={`superior-planning-${grade}`}>{grade}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                      <div>
                        <Label>組織指導・教育能力（研修体系構築、専門知識伝承、外部発表、新人メンタリング）</Label>
                        <RadioGroup 
                          onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'documentation', value)}
                          className="flex flex-row gap-4 mt-2"
                        >
                          {['S', 'A', 'B', 'C', 'D'].map(grade => (
                            <div key={grade} className="flex items-center space-x-2">
                              <RadioGroupItem value={grade} id={`superior-documentation-${grade}`} />
                              <Label htmlFor={`superior-documentation-${grade}`}>{grade}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">自己評価（40%）</h3>
                    <div className="space-y-4">
                      <div>
                        <Label>エキスパート評価技術（高次脳機能総合評価、重度認知症評価、終末期QOL評価等）</Label>
                        <RadioGroup 
                          onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'assessment', value)}
                          className="flex flex-row gap-4 mt-2"
                        >
                          {['S', 'A', 'B', 'C', 'D'].map(grade => (
                            <div key={grade} className="flex items-center space-x-2">
                              <RadioGroupItem value={grade} id={`self-assessment-${grade}`} />
                              <Label htmlFor={`self-assessment-${grade}`}>{grade}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                      <div>
                        <Label>最高度治療技術（終末期ケア、重症例対応、難治例アプローチ、イノベーション創出）</Label>
                        <RadioGroup 
                          onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'treatment', value)}
                          className="flex flex-row gap-4 mt-2"
                        >
                          {['S', 'A', 'B', 'C', 'D'].map(grade => (
                            <div key={grade} className="flex items-center space-x-2">
                              <RadioGroupItem value={grade} id={`self-treatment-${grade}`} />
                              <Label htmlFor={`self-treatment-${grade}`}>{grade}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                      <div>
                        <Label>戦略的計画立案能力（病棟全体最適化、長期展望、質向上企画、組織改善提案）</Label>
                        <RadioGroup 
                          onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'planning', value)}
                          className="flex flex-row gap-4 mt-2"
                        >
                          {['S', 'A', 'B', 'C', 'D'].map(grade => (
                            <div key={grade} className="flex items-center space-x-2">
                              <RadioGroupItem value={grade} id={`self-planning-${grade}`} />
                              <Label htmlFor={`self-planning-${grade}`}>{grade}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                      <div>
                        <Label>組織指導・教育能力（研修体系構築、専門知識伝承、外部発表、新人メンタリング）</Label>
                        <RadioGroup 
                          onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'documentation', value)}
                          className="flex flex-row gap-4 mt-2"
                        >
                          {['S', 'A', 'B', 'C', 'D'].map(grade => (
                            <div key={grade} className="flex items-center space-x-2">
                              <RadioGroupItem value={grade} id={`self-documentation-${grade}`} />
                              <Label htmlFor={`self-documentation-${grade}`}>{grade}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm font-semibold">
                      技術評価点: {calculateTechnicalScore().toFixed(1)}点 / 50点
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contribution">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    貢献度評価（50点満点）
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="facility-rank" className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      施設内順位（パーセンタイル）
                    </Label>
                    <Input
                      id="facility-rank"
                      type="number"
                      min="1"
                      max="100"
                      value={facilityRank}
                      onChange={(e) => setFacilityRank(Number(e.target.value))}
                      className="mt-2"
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      上位{facilityRank}%（施設内での相対評価）
                    </p>
                    <div className="mt-2">
                      <Progress value={100 - facilityRank} className="h-2" />
                    </div>
                    <p className="text-sm font-semibold mt-2">
                      施設内評価点: {calculateContributionScore(facilityRank)}点 / 25点
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="corporate-rank" className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      法人内順位（パーセンタイル）
                    </Label>
                    <Input
                      id="corporate-rank"
                      type="number"
                      min="1"
                      max="100"
                      value={corporateRank}
                      onChange={(e) => setCorporateRank(Number(e.target.value))}
                      className="mt-2"
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      上位{corporateRank}%（法人内での相対評価）
                    </p>
                    <div className="mt-2">
                      <Progress value={100 - corporateRank} className="h-2" />
                    </div>
                    <p className="text-sm font-semibold mt-2">
                      法人内評価点: {calculateContributionScore(corporateRank)}点 / 25点
                    </p>
                  </div>

                  <Alert>
                    <AlertDescription>
                      貢献度評価は、療養型病床での最高度作業療法実践、組織全体への影響力、外部発表・研修講師実績、
                      メンタリング・人材育成、イノベーション創出等を総合的に評価した順位です。
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="summary">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">総合評価結果</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className={`text-4xl font-bold text-center ${getScoreColor(totalScore)}`}>
                      総合得点: {totalScore}点 / 100点
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>評価項目</TableHead>
                          <TableHead className="text-right">配点</TableHead>
                          <TableHead className="text-right">得点</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>技術評価</TableCell>
                          <TableCell className="text-right">50点</TableCell>
                          <TableCell className="text-right">{calculateTechnicalScore().toFixed(1)}点</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>施設内貢献度</TableCell>
                          <TableCell className="text-right">25点</TableCell>
                          <TableCell className="text-right">{calculateContributionScore(facilityRank)}点</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>法人内貢献度</TableCell>
                          <TableCell className="text-right">25点</TableCell>
                          <TableCell className="text-right">{calculateContributionScore(corporateRank)}点</TableCell>
                        </TableRow>
                        <TableRow className="font-bold">
                          <TableCell>合計</TableCell>
                          <TableCell className="text-right">100点</TableCell>
                          <TableCell className="text-right">{totalScore}点</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">評価ランク判定</h4>
                      <div className="space-y-1 text-sm">
                        <p className={totalScore >= 90 ? 'font-bold text-red-600' : ''}>
                          S評価（90点以上）: 卓越した成果と貢献
                        </p>
                        <p className={totalScore >= 80 && totalScore < 90 ? 'font-bold text-orange-600' : ''}>
                          A評価（80-89点）: 優秀な成果と貢献
                        </p>
                        <p className={totalScore >= 70 && totalScore < 80 ? 'font-bold text-green-600' : ''}>
                          B評価（70-79点）: 良好な成果と貢献
                        </p>
                        <p className={totalScore >= 60 && totalScore < 70 ? 'font-bold text-blue-600' : ''}>
                          C評価（60-69点）: 標準的な成果と貢献
                        </p>
                        <p className={totalScore < 60 ? 'font-bold text-gray-600' : ''}>
                          D評価（60点未満）: 改善が必要
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="feedback">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">フィードバック記入欄</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="strengths">強み・優れている点</Label>
                    <Textarea
                      id="strengths"
                      placeholder="療養型病床でのエキスパート作業療法士として特に優れている点、組織への貢献内容を記入してください"
                      className="mt-2 h-24"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="improvements">改善点・今後の課題</Label>
                    <Textarea
                      id="improvements"
                      placeholder="さらなる組織貢献のための改善点、指導者としての成長課題を記入してください"
                      className="mt-2 h-24"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="goals">次期目標設定</Label>
                    <Textarea
                      id="goals"
                      placeholder="次の評価期間に向けたエキスパートとしての目標、組織全体への影響力発揮目標を記入してください"
                      className="mt-2 h-24"
                    />
                  </div>

                  <div className="pt-4 border-t">
                    <Label htmlFor="supervisor-comment">上司コメント</Label>
                    <Textarea
                      id="supervisor-comment"
                      placeholder="療養型病床でのベテラン作業療法士としての総合的な評価コメントを記入してください"
                      className="mt-2 h-32"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-end gap-4">
            <Button variant="outline">一時保存</Button>
            <Button>評価を確定</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}