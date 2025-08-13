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

export default function MidlevelNursingAideEvaluationV4Pattern5() {
  // 評価項目の状態管理
  const [technicalScores, setTechnicalScores] = useState({
    superiorEval: { expertSkills: 0, leadership: 0, education: 0, improvement: 0 },
    selfEval: { expertSkills: 0, leadership: 0, education: 0, improvement: 0 }
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
  }, [technicalScores, facilityRank, corporateRank]);

  const handleTechnicalScoreChange = (evaluator: string, category: string, grade: string) => {
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
            中堅看護補助者（4-10年目） 人事評価シート v4.0
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            パターン5改良版 - 実践的リーダーシップと業務改善を重視した評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              v4.0評価システム：技術評価50点（360度評価）+ 施設貢献25点 + 法人貢献25点 = 100点満点
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="basic">基本情報</TabsTrigger>
              <TabsTrigger value="technical">技術評価</TabsTrigger>
              <TabsTrigger value="facility">施設貢献</TabsTrigger>
              <TabsTrigger value="corporate">法人貢献</TabsTrigger>
              <TabsTrigger value="summary">総合評価</TabsTrigger>
              <TabsTrigger value="development">育成計画</TabsTrigger>
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
                  <Input type="text" id="eval-period" placeholder="2024年4月〜2025年3月" />
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
                    <Label htmlFor="department">配属病棟</Label>
                    <Input type="text" id="department" placeholder="3階病棟（急性期）" />
                  </div>
                  <div>
                    <Label htmlFor="experience">経験年数</Label>
                    <Input type="text" id="experience" placeholder="6年5ヶ月" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">評価者情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="evaluator1">1次評価者（主任）</Label>
                    <Input type="text" id="evaluator1" />
                  </div>
                  <div>
                    <Label htmlFor="evaluator2">2次評価者（師長）</Label>
                    <Input type="text" id="evaluator2" />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 技術評価タブ（50点） */}
            <TabsContent value="technical" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  技術評価（50点満点）- 360度評価
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  上司評価（60%）と本人評価（40%）の加重平均で算出
                </p>
              </div>

              {/* 上司評価 */}
              <div className="border p-4 rounded-lg">
                <h4 className="font-semibold mb-4 text-blue-700">上司評価（60%）</h4>
                
                <div className="space-y-6">
                  <div>
                    <h5 className="font-medium mb-3">1. 専門的介護技術・知識</h5>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'expertSkills', value)}>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="S" id="sup-expert-s" />
                          <Label htmlFor="sup-expert-s" className="font-normal">
                            <span className="font-semibold">S：</span> 専門的な介護技術を完璧に習得し、複雑な事例にも対応できる
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="A" id="sup-expert-a" />
                          <Label htmlFor="sup-expert-a" className="font-normal">
                            <span className="font-semibold">A：</span> 高度な介護技術を習得し、幅広い状況に対応できる
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="B" id="sup-expert-b" />
                          <Label htmlFor="sup-expert-b" className="font-normal">
                            <span className="font-semibold">B：</span> 中堅として求められる介護技術を習得している
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="C" id="sup-expert-c" />
                          <Label htmlFor="sup-expert-c" className="font-normal">
                            <span className="font-semibold">C：</span> 介護技術は標準的だが、専門性の向上が必要
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="D" id="sup-expert-d" />
                          <Label htmlFor="sup-expert-d" className="font-normal">
                            <span className="font-semibold">D：</span> 中堅として期待される技術水準に達していない
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <h5 className="font-medium mb-3">2. リーダーシップ・現場統率力</h5>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'leadership', value)}>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="S" id="sup-lead-s" />
                          <Label htmlFor="sup-lead-s" className="font-normal">
                            <span className="font-semibold">S：</span> 優れたリーダーシップを発揮し、チームを効果的に統率する
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="A" id="sup-lead-a" />
                          <Label htmlFor="sup-lead-a" className="font-normal">
                            <span className="font-semibold">A：</span> リーダーシップを発揮し、チームの中核として機能する
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="B" id="sup-lead-b" />
                          <Label htmlFor="sup-lead-b" className="font-normal">
                            <span className="font-semibold">B：</span> 必要に応じてリーダー役を担うことができる
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="C" id="sup-lead-c" />
                          <Label htmlFor="sup-lead-c" className="font-normal">
                            <span className="font-semibold">C：</span> リーダーシップの発揮に消極的で、向上が必要
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="D" id="sup-lead-d" />
                          <Label htmlFor="sup-lead-d" className="font-normal">
                            <span className="font-semibold">D：</span> リーダーシップが不足し、現場統率力に課題がある
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <h5 className="font-medium mb-3">3. 教育・指導力</h5>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'education', value)}>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="S" id="sup-edu-s" />
                          <Label htmlFor="sup-edu-s" className="font-normal">
                            <span className="font-semibold">S：</span> 卓越した教育能力を持ち、後輩育成で顕著な成果を上げる
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="A" id="sup-edu-a" />
                          <Label htmlFor="sup-edu-a" className="font-normal">
                            <span className="font-semibold">A：</span> 効果的な教育・指導を行い、後輩の成長に貢献する
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="B" id="sup-edu-b" />
                          <Label htmlFor="sup-edu-b" className="font-normal">
                            <span className="font-semibold">B：</span> 標準的な教育・指導を行うことができる
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="C" id="sup-edu-c" />
                          <Label htmlFor="sup-edu-c" className="font-normal">
                            <span className="font-semibold">C：</span> 教育・指導力に改善の余地がある
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="D" id="sup-edu-d" />
                          <Label htmlFor="sup-edu-d" className="font-normal">
                            <span className="font-semibold">D：</span> 教育・指導への取り組みが不十分
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <h5 className="font-medium mb-3">4. 業務改善・効率化</h5>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'improvement', value)}>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="S" id="sup-improve-s" />
                          <Label htmlFor="sup-improve-s" className="font-normal">
                            <span className="font-semibold">S：</span> 革新的な改善提案を行い、業務効率化に大きく貢献
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="A" id="sup-improve-a" />
                          <Label htmlFor="sup-improve-a" className="font-normal">
                            <span className="font-semibold">A：</span> 積極的に改善提案を行い、実践している
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="B" id="sup-improve-b" />
                          <Label htmlFor="sup-improve-b" className="font-normal">
                            <span className="font-semibold">B：</span> 業務改善に参加し、標準的な貢献をしている
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="C" id="sup-improve-c" />
                          <Label htmlFor="sup-improve-c" className="font-normal">
                            <span className="font-semibold">C：</span> 業務改善への取り組みが消極的
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="D" id="sup-improve-d" />
                          <Label htmlFor="sup-improve-d" className="font-normal">
                            <span className="font-semibold">D：</span> 業務改善への意識が低く、現状維持に留まる
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              {/* 本人評価 */}
              <div className="border p-4 rounded-lg">
                <h4 className="font-semibold mb-4 text-green-700">本人評価（40%）</h4>
                
                <div className="space-y-6">
                  <div>
                    <h5 className="font-medium mb-3">1. 専門的介護技術・知識</h5>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'expertSkills', value)}>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="S" id="self-expert-s" />
                          <Label htmlFor="self-expert-s" className="font-normal">
                            <span className="font-semibold">S：</span> 専門的な介護技術を完全に習得し、自信を持って実践している
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="A" id="self-expert-a" />
                          <Label htmlFor="self-expert-a" className="font-normal">
                            <span className="font-semibold">A：</span> 高度な介護技術を習得し、幅広く対応できている
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="B" id="self-expert-b" />
                          <Label htmlFor="self-expert-b" className="font-normal">
                            <span className="font-semibold">B：</span> 中堅として必要な技術は習得している
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="C" id="self-expert-c" />
                          <Label htmlFor="self-expert-c" className="font-normal">
                            <span className="font-semibold">C：</span> 専門性をさらに高める必要を感じている
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="D" id="self-expert-d" />
                          <Label htmlFor="self-expert-d" className="font-normal">
                            <span className="font-semibold">D：</span> 技術面で大きな課題を感じている
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <h5 className="font-medium mb-3">2. リーダーシップ・現場統率力</h5>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'leadership', value)}>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="S" id="self-lead-s" />
                          <Label htmlFor="self-lead-s" className="font-normal">
                            <span className="font-semibold">S：</span> 強いリーダーシップを発揮し、チームを統率している
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="A" id="self-lead-a" />
                          <Label htmlFor="self-lead-a" className="font-normal">
                            <span className="font-semibold">A：</span> リーダーシップを発揮し、チームに貢献している
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="B" id="self-lead-b" />
                          <Label htmlFor="self-lead-b" className="font-normal">
                            <span className="font-semibold">B：</span> 必要時にリーダー役を担えている
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="C" id="self-lead-c" />
                          <Label htmlFor="self-lead-c" className="font-normal">
                            <span className="font-semibold">C：</span> リーダーシップを向上させる必要がある
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="D" id="self-lead-d" />
                          <Label htmlFor="self-lead-d" className="font-normal">
                            <span className="font-semibold">D：</span> リーダーシップの発揮に大きな課題がある
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <h5 className="font-medium mb-3">3. 教育・指導力</h5>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'education', value)}>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="S" id="self-edu-s" />
                          <Label htmlFor="self-edu-s" className="font-normal">
                            <span className="font-semibold">S：</span> 効果的な教育・指導を行い、後輩育成に貢献している
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="A" id="self-edu-a" />
                          <Label htmlFor="self-edu-a" className="font-normal">
                            <span className="font-semibold">A：</span> 積極的に教育・指導に取り組んでいる
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="B" id="self-edu-b" />
                          <Label htmlFor="self-edu-b" className="font-normal">
                            <span className="font-semibold">B：</span> 基本的な教育・指導はできている
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="C" id="self-edu-c" />
                          <Label htmlFor="self-edu-c" className="font-normal">
                            <span className="font-semibold">C：</span> 教育・指導力を向上させたい
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="D" id="self-edu-d" />
                          <Label htmlFor="self-edu-d" className="font-normal">
                            <span className="font-semibold">D：</span> 教育・指導に自信がない
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <h5 className="font-medium mb-3">4. 業務改善・効率化</h5>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'improvement', value)}>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="S" id="self-improve-s" />
                          <Label htmlFor="self-improve-s" className="font-normal">
                            <span className="font-semibold">S：</span> 積極的に改善提案を行い、大きな成果を上げている
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="A" id="self-improve-a" />
                          <Label htmlFor="self-improve-a" className="font-normal">
                            <span className="font-semibold">A：</span> 改善提案を積極的に行っている
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="B" id="self-improve-b" />
                          <Label htmlFor="self-improve-b" className="font-normal">
                            <span className="font-semibold">B：</span> 業務改善に参加している
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="C" id="self-improve-c" />
                          <Label htmlFor="self-improve-c" className="font-normal">
                            <span className="font-semibold">C：</span> 改善への取り組みをもっと積極的にしたい
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="D" id="self-improve-d" />
                          <Label htmlFor="self-improve-d" className="font-normal">
                            <span className="font-semibold">D：</span> 業務改善への参加が不十分
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="font-semibold">
                  技術評価点: {calculateTechnicalScore().toFixed(1)}点 / 50点
                </p>
              </div>
            </TabsContent>

            {/* 施設貢献タブ（25点） */}
            <TabsContent value="facility" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  施設貢献度評価（25点満点）
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  組織貢献度ポイント制度に基づく相対評価
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="facility-points">施設貢献ポイント</Label>
                  <Input 
                    type="number" 
                    id="facility-points" 
                    placeholder="年間獲得ポイント"
                    onChange={(e) => setContributionPoints(prev => ({
                      ...prev,
                      facility: parseInt(e.target.value) || 0
                    }))}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    参考：委員会活動、プリセプター、勉強会講師、改善提案実施など
                  </p>
                </div>

                <div>
                  <Label htmlFor="facility-rank">同一職種内でのパーセンタイル順位</Label>
                  <div className="flex items-center gap-4">
                    <Input 
                      type="number" 
                      id="facility-rank" 
                      value={facilityRank}
                      onChange={(e) => setFacilityRank(parseInt(e.target.value) || 50)}
                      min="1" 
                      max="100"
                      className="w-24"
                    />
                    <span className="text-sm">パーセンタイル</span>
                  </div>
                  <Progress value={100 - facilityRank} className="mt-2" />
                  <p className="text-sm text-gray-500 mt-1">
                    上位{facilityRank}%（値が小さいほど上位）
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="font-semibold">
                    施設貢献点: {calculateContributionScore(facilityRank)}点 / 25点
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">中堅看護補助者の施設貢献活動例</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>プリセプターとしての新人教育</li>
                  <li>病棟勉強会の企画・講師</li>
                  <li>委員会活動でのリーダーシップ</li>
                  <li>業務改善プロジェクトの主導</li>
                  <li>実習生指導の中心的役割</li>
                  <li>マニュアル整備・改訂の主導</li>
                  <li>リスク管理・安全対策の推進</li>
                </ul>
              </div>
            </TabsContent>

            {/* 法人貢献タブ（25点） */}
            <TabsContent value="corporate" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  法人貢献度評価（25点満点）
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  組織貢献度ポイント制度に基づく相対評価
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="corporate-points">法人貢献ポイント</Label>
                  <Input 
                    type="number" 
                    id="corporate-points" 
                    placeholder="年間獲得ポイント"
                    onChange={(e) => setContributionPoints(prev => ({
                      ...prev,
                      corporate: parseInt(e.target.value) || 0
                    }))}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    参考：法人研修講師、地域活動リーダー、他施設支援など
                  </p>
                </div>

                <div>
                  <Label htmlFor="corporate-rank">同一職種内でのパーセンタイル順位</Label>
                  <div className="flex items-center gap-4">
                    <Input 
                      type="number" 
                      id="corporate-rank" 
                      value={corporateRank}
                      onChange={(e) => setCorporateRank(parseInt(e.target.value) || 50)}
                      min="1" 
                      max="100"
                      className="w-24"
                    />
                    <span className="text-sm">パーセンタイル</span>
                  </div>
                  <Progress value={100 - corporateRank} className="mt-2" />
                  <p className="text-sm text-gray-500 mt-1">
                    上位{corporateRank}%（値が小さいほど上位）
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="font-semibold">
                    法人貢献点: {calculateContributionScore(corporateRank)}点 / 25点
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">中堅看護補助者の法人貢献活動例</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>法人研修での講師・ファシリテーター</li>
                  <li>法人委員会での中核的役割</li>
                  <li>地域活動のリーダー的参加</li>
                  <li>他施設への技術指導・支援</li>
                  <li>法人プロジェクトへの参画</li>
                  <li>災害支援活動への参加</li>
                  <li>法人理念の実践・啓発活動</li>
                </ul>
              </div>
            </TabsContent>

            {/* 総合評価タブ */}
            <TabsContent value="summary" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  総合評価サマリー
                </h3>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="text-center mb-6">
                  <p className="text-3xl font-bold mb-2">
                    <span className={getScoreColor(totalScore)}>
                      {totalScore.toFixed(1)}点
                    </span>
                    <span className="text-gray-600 text-2xl"> / 100点</span>
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
                    <div 
                      className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${totalScore}%` }}
                    />
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>評価項目</TableHead>
                      <TableHead className="text-right">配点</TableHead>
                      <TableHead className="text-right">獲得点</TableHead>
                      <TableHead className="text-right">獲得率</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>技術評価（360度評価）</TableCell>
                      <TableCell className="text-right">50点</TableCell>
                      <TableCell className="text-right">{calculateTechnicalScore().toFixed(1)}点</TableCell>
                      <TableCell className="text-right">{(calculateTechnicalScore() / 50 * 100).toFixed(0)}%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>施設貢献度</TableCell>
                      <TableCell className="text-right">25点</TableCell>
                      <TableCell className="text-right">{calculateContributionScore(facilityRank)}点</TableCell>
                      <TableCell className="text-right">{(calculateContributionScore(facilityRank) / 25 * 100).toFixed(0)}%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>法人貢献度</TableCell>
                      <TableCell className="text-right">25点</TableCell>
                      <TableCell className="text-right">{calculateContributionScore(corporateRank)}点</TableCell>
                      <TableCell className="text-right">{(calculateContributionScore(corporateRank) / 25 * 100).toFixed(0)}%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">総合ランク判定</h4>
                  <div className="border rounded-lg p-4">
                    <p className="text-2xl font-bold text-center">
                      {totalScore >= 90 ? 'S' : 
                       totalScore >= 80 ? 'A' : 
                       totalScore >= 70 ? 'B' : 
                       totalScore >= 60 ? 'C' : 'D'}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">評価傾向</h4>
                  <div className="text-sm space-y-1">
                    <p>• 技術面: {calculateTechnicalScore() >= 40 ? '優秀' : calculateTechnicalScore() >= 30 ? '良好' : '要改善'}</p>
                    <p>• 施設貢献: {facilityRank <= 30 ? '積極的' : facilityRank <= 60 ? '標準的' : '消極的'}</p>
                    <p>• 法人貢献: {corporateRank <= 30 ? '積極的' : corporateRank <= 60 ? '標準的' : '消極的'}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <Label htmlFor="summary-comment">総合所見</Label>
                <Textarea 
                  id="summary-comment" 
                  placeholder="中堅看護補助者としての実績、リーダーシップ、今後の期待などを記載"
                  className="mt-2 h-32"
                />
              </div>
            </TabsContent>

            {/* 育成計画タブ */}
            <TabsContent value="development" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">育成計画</h3>
                <p className="text-sm text-gray-600 mb-4">
                  評価結果に基づく個別育成計画の策定
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="strengths">強み・良い点</Label>
                  <Textarea 
                    id="strengths" 
                    placeholder="中堅として優れている点、リーダーシップの発揮状況"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="challenges">課題・改善点</Label>
                  <Textarea 
                    id="challenges" 
                    placeholder="さらなる成長のために必要な課題"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="goals">次期目標（1年後）</Label>
                  <Textarea 
                    id="goals" 
                    placeholder="リーダー看護補助者として期待される到達目標"
                    className="mt-2 h-24"
                  />
                </div>

                <div>
                  <Label htmlFor="career-path">キャリアパス検討</Label>
                  <Textarea 
                    id="career-path" 
                    placeholder="将来的な役職登用、専門分野の深化など"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="support-plan">支援計画</Label>
                  <Textarea 
                    id="support-plan" 
                    placeholder="目標達成のための具体的な支援内容、研修計画など"
                    className="mt-2 h-24"
                  />
                </div>

                <div>
                  <Label htmlFor="follow-up">フォローアップ予定</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <Label htmlFor="next-review">次回面談予定日</Label>
                      <Input type="date" id="next-review" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="reviewer">面談担当者</Label>
                      <Input type="text" id="reviewer" placeholder="師長名" className="mt-1" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">推奨研修・学習項目</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>上級介護技術研修</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>リーダーシップ研修（中級）</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>教育指導者研修</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>業務改善・QC手法研修</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>管理職候補者研修</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>専門資格取得支援</span>
                  </label>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 flex justify-end gap-4">
            <Button variant="outline">一時保存</Button>
            <Button>評価を確定</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}