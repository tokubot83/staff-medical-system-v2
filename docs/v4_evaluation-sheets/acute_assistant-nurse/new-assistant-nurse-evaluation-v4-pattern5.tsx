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

export default function NewAssistantNurseEvaluationV4Pattern5() {
  // 評価項目の状態管理
  const [technicalScores, setTechnicalScores] = useState({
    superiorEval: { skills: 0, knowledge: 0, patient: 0, safety: 0 },
    selfEval: { skills: 0, knowledge: 0, patient: 0, safety: 0 }
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
  const calculateContributionScore = (percentile) => {
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

  const handleTechnicalScoreChange = (evaluator, category, grade) => {
    setTechnicalScores(prev => ({
      ...prev,
      [evaluator]: {
        ...prev[evaluator],
        [category]: gradeToScore[grade] || 0
      }
    }));
  };

  const getScoreColor = (score) => {
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
            新人准看護師（1年目） 人事評価シート v4.0
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            パターン5改良版 - 基礎習得と職場適応を重視した評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              100点満点評価：技術評価50点（上司60%+本人40%）＋施設貢献25点＋法人貢献25点
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">基本情報</TabsTrigger>
              <TabsTrigger value="technical">技術評価</TabsTrigger>
              <TabsTrigger value="contribution">貢献度評価</TabsTrigger>
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
                  <Label htmlFor="eval-period">評価時期</Label>
                  <Input type="text" id="eval-period" placeholder="入職3ヶ月 / 6ヶ月 / 12ヶ月" />
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
                    <Input type="text" id="department" />
                  </div>
                  <div>
                    <Label htmlFor="hire-date">入職年月日</Label>
                    <Input type="date" id="hire-date" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">評価者情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="evaluator1">1次評価者（指導担当者）</Label>
                    <Input type="text" id="evaluator1" />
                  </div>
                  <div>
                    <Label htmlFor="evaluator2">2次評価者（主任・師長）</Label>
                    <Input type="text" id="evaluator2" />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 技術評価タブ */}
            <TabsContent value="technical" className="space-y-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  技術評価（50点満点）
                </h3>
                <div className="text-sm text-gray-600">
                  上司評価60% + 本人評価40%
                </div>
              </div>

              <div className="space-y-6">
                {/* 上司評価 */}
                <div className="border rounded-lg p-4 bg-blue-50">
                  <h4 className="font-semibold mb-4 text-blue-800">上司評価（60%）</h4>
                  <div className="space-y-4">
                    <div>
                      <Label className="block mb-2">1. 基本看護技術・准看護師業務</Label>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'skills', value)}>
                        <div className="flex gap-4">
                          <div className="flex items-center">
                            <RadioGroupItem value="S" id="sup-skills-s" />
                            <Label htmlFor="sup-skills-s" className="ml-2">S</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="A" id="sup-skills-a" />
                            <Label htmlFor="sup-skills-a" className="ml-2">A</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="B" id="sup-skills-b" />
                            <Label htmlFor="sup-skills-b" className="ml-2">B</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="C" id="sup-skills-c" />
                            <Label htmlFor="sup-skills-c" className="ml-2">C</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="D" id="sup-skills-d" />
                            <Label htmlFor="sup-skills-d" className="ml-2">D</Label>
                          </div>
                        </div>
                      </RadioGroup>
                      <p className="text-sm text-gray-600 mt-1">
                        日常生活援助、バイタルサイン測定、環境整備等の基本技術
                      </p>
                    </div>

                    <div>
                      <Label className="block mb-2">2. 医療知識・専門性</Label>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'knowledge', value)}>
                        <div className="flex gap-4">
                          <div className="flex items-center">
                            <RadioGroupItem value="S" id="sup-knowledge-s" />
                            <Label htmlFor="sup-knowledge-s" className="ml-2">S</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="A" id="sup-knowledge-a" />
                            <Label htmlFor="sup-knowledge-a" className="ml-2">A</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="B" id="sup-knowledge-b" />
                            <Label htmlFor="sup-knowledge-b" className="ml-2">B</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="C" id="sup-knowledge-c" />
                            <Label htmlFor="sup-knowledge-c" className="ml-2">C</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="D" id="sup-knowledge-d" />
                            <Label htmlFor="sup-knowledge-d" className="ml-2">D</Label>
                          </div>
                        </div>
                      </RadioGroup>
                      <p className="text-sm text-gray-600 mt-1">
                        准看護師として必要な基礎的医療知識の理解度
                      </p>
                    </div>

                    <div>
                      <Label className="block mb-2">3. 患者対応・コミュニケーション</Label>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'patient', value)}>
                        <div className="flex gap-4">
                          <div className="flex items-center">
                            <RadioGroupItem value="S" id="sup-patient-s" />
                            <Label htmlFor="sup-patient-s" className="ml-2">S</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="A" id="sup-patient-a" />
                            <Label htmlFor="sup-patient-a" className="ml-2">A</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="B" id="sup-patient-b" />
                            <Label htmlFor="sup-patient-b" className="ml-2">B</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="C" id="sup-patient-c" />
                            <Label htmlFor="sup-patient-c" className="ml-2">C</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="D" id="sup-patient-d" />
                            <Label htmlFor="sup-patient-d" className="ml-2">D</Label>
                          </div>
                        </div>
                      </RadioGroup>
                      <p className="text-sm text-gray-600 mt-1">
                        患者・家族への接遇、基本的なコミュニケーション能力
                      </p>
                    </div>

                    <div>
                      <Label className="block mb-2">4. 安全管理・報告連絡</Label>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'safety', value)}>
                        <div className="flex gap-4">
                          <div className="flex items-center">
                            <RadioGroupItem value="S" id="sup-safety-s" />
                            <Label htmlFor="sup-safety-s" className="ml-2">S</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="A" id="sup-safety-a" />
                            <Label htmlFor="sup-safety-a" className="ml-2">A</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="B" id="sup-safety-b" />
                            <Label htmlFor="sup-safety-b" className="ml-2">B</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="C" id="sup-safety-c" />
                            <Label htmlFor="sup-safety-c" className="ml-2">C</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="D" id="sup-safety-d" />
                            <Label htmlFor="sup-safety-d" className="ml-2">D</Label>
                          </div>
                        </div>
                      </RadioGroup>
                      <p className="text-sm text-gray-600 mt-1">
                        インシデント予防、適切な報告・連絡・相談の実施
                      </p>
                    </div>
                  </div>
                </div>

                {/* 本人評価 */}
                <div className="border rounded-lg p-4 bg-green-50">
                  <h4 className="font-semibold mb-4 text-green-800">本人評価（40%）</h4>
                  <div className="space-y-4">
                    <div>
                      <Label className="block mb-2">1. 基本看護技術・准看護師業務</Label>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'skills', value)}>
                        <div className="flex gap-4">
                          <div className="flex items-center">
                            <RadioGroupItem value="S" id="self-skills-s" />
                            <Label htmlFor="self-skills-s" className="ml-2">S</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="A" id="self-skills-a" />
                            <Label htmlFor="self-skills-a" className="ml-2">A</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="B" id="self-skills-b" />
                            <Label htmlFor="self-skills-b" className="ml-2">B</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="C" id="self-skills-c" />
                            <Label htmlFor="self-skills-c" className="ml-2">C</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="D" id="self-skills-d" />
                            <Label htmlFor="self-skills-d" className="ml-2">D</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="block mb-2">2. 医療知識・専門性</Label>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'knowledge', value)}>
                        <div className="flex gap-4">
                          <div className="flex items-center">
                            <RadioGroupItem value="S" id="self-knowledge-s" />
                            <Label htmlFor="self-knowledge-s" className="ml-2">S</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="A" id="self-knowledge-a" />
                            <Label htmlFor="self-knowledge-a" className="ml-2">A</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="B" id="self-knowledge-b" />
                            <Label htmlFor="self-knowledge-b" className="ml-2">B</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="C" id="self-knowledge-c" />
                            <Label htmlFor="self-knowledge-c" className="ml-2">C</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="D" id="self-knowledge-d" />
                            <Label htmlFor="self-knowledge-d" className="ml-2">D</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="block mb-2">3. 患者対応・コミュニケーション</Label>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'patient', value)}>
                        <div className="flex gap-4">
                          <div className="flex items-center">
                            <RadioGroupItem value="S" id="self-patient-s" />
                            <Label htmlFor="self-patient-s" className="ml-2">S</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="A" id="self-patient-a" />
                            <Label htmlFor="self-patient-a" className="ml-2">A</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="B" id="self-patient-b" />
                            <Label htmlFor="self-patient-b" className="ml-2">B</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="C" id="self-patient-c" />
                            <Label htmlFor="self-patient-c" className="ml-2">C</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="D" id="self-patient-d" />
                            <Label htmlFor="self-patient-d" className="ml-2">D</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="block mb-2">4. 安全管理・報告連絡</Label>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'safety', value)}>
                        <div className="flex gap-4">
                          <div className="flex items-center">
                            <RadioGroupItem value="S" id="self-safety-s" />
                            <Label htmlFor="self-safety-s" className="ml-2">S</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="A" id="self-safety-a" />
                            <Label htmlFor="self-safety-a" className="ml-2">A</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="B" id="self-safety-b" />
                            <Label htmlFor="self-safety-b" className="ml-2">B</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="C" id="self-safety-c" />
                            <Label htmlFor="self-safety-c" className="ml-2">C</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="D" id="self-safety-d" />
                            <Label htmlFor="self-safety-d" className="ml-2">D</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">技術評価得点</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {calculateTechnicalScore().toFixed(1)} / 50点
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 貢献度評価タブ */}
            <TabsContent value="contribution" className="space-y-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  貢献度評価（50点満点）
                </h3>
                <div className="text-sm text-gray-600">
                  施設25点 + 法人25点
                </div>
              </div>

              <div className="space-y-6">
                {/* 施設貢献度 */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    施設貢献度（25点）
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="facility-points">現在の施設貢献度ポイント</Label>
                      <Input 
                        type="number" 
                        id="facility-points" 
                        value={contributionPoints.facility}
                        onChange={(e) => setContributionPoints(prev => ({
                          ...prev,
                          facility: parseInt(e.target.value) || 0
                        }))}
                        placeholder="例: 85"
                      />
                      <p className="text-sm text-gray-600 mt-1">
                        病棟での活動、委員会参加、改善提案等の累計ポイント
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="facility-rank">施設内順位（パーセンタイル）</Label>
                      <Input 
                        type="number" 
                        id="facility-rank" 
                        value={facilityRank}
                        onChange={(e) => setFacilityRank(parseInt(e.target.value) || 0)}
                        min="1" 
                        max="100"
                        placeholder="例: 25（上位25%）"
                      />
                      <p className="text-sm text-gray-600 mt-1">
                        1～100で入力（数値が小さいほど上位）
                      </p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-sm font-semibold">施設貢献度得点</p>
                      <p className="text-xl font-bold text-blue-600">
                        {calculateContributionScore(facilityRank)}点
                      </p>
                    </div>
                  </div>
                </div>

                {/* 法人貢献度 */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    法人貢献度（25点）
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="corporate-points">現在の法人貢献度ポイント</Label>
                      <Input 
                        type="number" 
                        id="corporate-points"
                        value={contributionPoints.corporate}
                        onChange={(e) => setContributionPoints(prev => ({
                          ...prev,
                          corporate: parseInt(e.target.value) || 0
                        }))}
                        placeholder="例: 45"
                      />
                      <p className="text-sm text-gray-600 mt-1">
                        法人行事参加、資格取得、研修参加等の累計ポイント
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="corporate-rank">法人内順位（パーセンタイル）</Label>
                      <Input 
                        type="number" 
                        id="corporate-rank"
                        value={corporateRank}
                        onChange={(e) => setCorporateRank(parseInt(e.target.value) || 0)}
                        min="1" 
                        max="100"
                        placeholder="例: 40（上位40%）"
                      />
                      <p className="text-sm text-gray-600 mt-1">
                        1～100で入力（数値が小さいほど上位）
                      </p>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <p className="text-sm font-semibold">法人貢献度得点</p>
                      <p className="text-xl font-bold text-green-600">
                        {calculateContributionScore(corporateRank)}点
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 貢献度ポイントの配点表 */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-semibold mb-3">相対評価配点表</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>パーセンタイル</TableHead>
                      <TableHead>得点</TableHead>
                      <TableHead>説明</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>上位10%以内</TableCell>
                      <TableCell className="font-semibold">25点</TableCell>
                      <TableCell>極めて高い貢献</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>上位11-20%</TableCell>
                      <TableCell className="font-semibold">22.5点</TableCell>
                      <TableCell>非常に高い貢献</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>上位21-30%</TableCell>
                      <TableCell className="font-semibold">20点</TableCell>
                      <TableCell>高い貢献</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>上位31-40%</TableCell>
                      <TableCell className="font-semibold">17.5点</TableCell>
                      <TableCell>やや高い貢献</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>上位41-50%</TableCell>
                      <TableCell className="font-semibold">15点</TableCell>
                      <TableCell>標準的な貢献</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>上位51-60%</TableCell>
                      <TableCell className="font-semibold">12.5点</TableCell>
                      <TableCell>やや低い貢献</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>上位61-70%</TableCell>
                      <TableCell className="font-semibold">10点</TableCell>
                      <TableCell>低い貢献</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>上位71-80%</TableCell>
                      <TableCell className="font-semibold">7.5点</TableCell>
                      <TableCell>かなり低い貢献</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>上位81-90%</TableCell>
                      <TableCell className="font-semibold">5点</TableCell>
                      <TableCell>非常に低い貢献</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>上位91-100%</TableCell>
                      <TableCell className="font-semibold">2.5点</TableCell>
                      <TableCell>最低限の貢献</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* 総合評価タブ */}
            <TabsContent value="summary" className="space-y-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  総合評価サマリー
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 text-center bg-blue-50">
                  <p className="text-sm text-gray-600 mb-1">技術評価</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {calculateTechnicalScore().toFixed(1)}点
                  </p>
                  <p className="text-xs text-gray-500">/ 50点</p>
                </div>
                <div className="border rounded-lg p-4 text-center bg-green-50">
                  <p className="text-sm text-gray-600 mb-1">施設貢献</p>
                  <p className="text-2xl font-bold text-green-600">
                    {calculateContributionScore(facilityRank)}点
                  </p>
                  <p className="text-xs text-gray-500">/ 25点</p>
                </div>
                <div className="border rounded-lg p-4 text-center bg-purple-50">
                  <p className="text-sm text-gray-600 mb-1">法人貢献</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {calculateContributionScore(corporateRank)}点
                  </p>
                  <p className="text-xs text-gray-500">/ 25点</p>
                </div>
              </div>

              <div className="border-2 rounded-lg p-6 text-center bg-gradient-to-r from-blue-50 to-purple-50">
                <p className="text-lg text-gray-600 mb-2">総合得点</p>
                <p className={`text-5xl font-bold ${getScoreColor(totalScore)}`}>
                  {totalScore}点
                </p>
                <p className="text-sm text-gray-500 mt-1">/ 100点満点</p>
                <Progress value={totalScore} className="mt-4" />
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="final-grade">最終評価グレード</Label>
                  <RadioGroup id="final-grade">
                    <div className="flex gap-4">
                      <div className="flex items-center">
                        <RadioGroupItem value="S" id="final-s" disabled={totalScore < 90} />
                        <Label htmlFor="final-s" className="ml-2">S（90点以上）</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="A" id="final-a" disabled={totalScore < 80 || totalScore >= 90} />
                        <Label htmlFor="final-a" className="ml-2">A（80-89点）</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="B" id="final-b" disabled={totalScore < 70 || totalScore >= 80} />
                        <Label htmlFor="final-b" className="ml-2">B（70-79点）</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="C" id="final-c" disabled={totalScore < 60 || totalScore >= 70} />
                        <Label htmlFor="final-c" className="ml-2">C（60-69点）</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="D" id="final-d" disabled={totalScore >= 60} />
                        <Label htmlFor="final-d" className="ml-2">D（59点以下）</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="summary-comments">総合所見</Label>
                  <Textarea 
                    id="summary-comments" 
                    rows={6}
                    placeholder="1年目准看護師としての成長度合い、強み、改善点、今後の育成方針等を記載"
                  />
                </div>
              </div>
            </TabsContent>

            {/* 育成計画タブ */}
            <TabsContent value="development" className="space-y-6 mt-6">
              <h3 className="font-bold text-lg mb-4">次期に向けた育成計画</h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="strength">強み・良い点</Label>
                  <Textarea 
                    id="strength" 
                    rows={3}
                    placeholder="新人准看護師として特に優れている点、継続して伸ばすべき点"
                  />
                </div>

                <div>
                  <Label htmlFor="improvement">改善が必要な点</Label>
                  <Textarea 
                    id="improvement" 
                    rows={3}
                    placeholder="技術面、知識面、態度面で改善が必要な具体的内容"
                  />
                </div>

                <div>
                  <Label htmlFor="goals">次期目標（6ヶ月後）</Label>
                  <Textarea 
                    id="goals" 
                    rows={4}
                    placeholder="・基本看護技術の自立度向上
・チームメンバーとしての役割遂行
・准看護師としての専門知識習得
・安全管理意識の向上"
                  />
                </div>

                <div>
                  <Label htmlFor="support">必要な支援・研修</Label>
                  <Textarea 
                    id="support" 
                    rows={3}
                    placeholder="OJT内容、参加すべき研修、メンター制度の活用等"
                  />
                </div>

                <div>
                  <Label htmlFor="career">キャリアプラン</Label>
                  <Textarea 
                    id="career" 
                    rows={3}
                    placeholder="将来的な進路希望（看護師資格取得、専門分野等）と支援計画"
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">面談記録</h4>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="interview-date">面談実施日</Label>
                    <Input type="date" id="interview-date" />
                  </div>
                  <div>
                    <Label htmlFor="interview-notes">面談内容・本人の意向</Label>
                    <Textarea 
                      id="interview-notes" 
                      rows={4}
                      placeholder="本人の自己評価、今後の目標、要望等"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <Button className="flex-1">一時保存</Button>
                <Button variant="outline" className="flex-1">印刷プレビュー</Button>
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">評価を確定</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}