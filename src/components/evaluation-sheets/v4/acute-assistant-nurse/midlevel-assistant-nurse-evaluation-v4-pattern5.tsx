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

export default function MidlevelAssistantNurseEvaluationV4Pattern5() {
  // 評価項目の状態管理
  const [technicalScores, setTechnicalScores] = useState({
    superiorEval: { skills: 0, leadership: 0, education: 0, innovation: 0 },
    selfEval: { skills: 0, leadership: 0, education: 0, innovation: 0 }
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
            ミドル准看護師（4-10年目） 人事評価シート v4.0
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            パターン5改良版 - リーダーシップと専門性向上を重視した評価
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
                  <Label htmlFor="eval-period">評価期間</Label>
                  <Input type="text" id="eval-period" placeholder="例: 2024年4月～2024年9月" />
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
                    <Label htmlFor="experience">経験年数</Label>
                    <Input type="text" id="experience" placeholder="7年6ヶ月" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="position">役職・担当</Label>
                    <Input type="text" id="position" placeholder="チームリーダー / プリセプター等" />
                  </div>
                  <div>
                    <Label htmlFor="certification">保有資格</Label>
                    <Input type="text" id="certification" placeholder="准看護師、その他資格" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">評価者情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="evaluator1">1次評価者（師長・主任）</Label>
                    <Input type="text" id="evaluator1" />
                  </div>
                  <div>
                    <Label htmlFor="evaluator2">2次評価者（看護部長・副部長）</Label>
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
                      <Label className="block mb-2">1. 高度な准看護師業務の実践</Label>
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
                        複雑な看護ケア、緊急時対応、専門的技術の実践力
                      </p>
                    </div>

                    <div>
                      <Label className="block mb-2">2. リーダーシップ・調整力</Label>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'leadership', value)}>
                        <div className="flex gap-4">
                          <div className="flex items-center">
                            <RadioGroupItem value="S" id="sup-leadership-s" />
                            <Label htmlFor="sup-leadership-s" className="ml-2">S</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="A" id="sup-leadership-a" />
                            <Label htmlFor="sup-leadership-a" className="ml-2">A</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="B" id="sup-leadership-b" />
                            <Label htmlFor="sup-leadership-b" className="ml-2">B</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="C" id="sup-leadership-c" />
                            <Label htmlFor="sup-leadership-c" className="ml-2">C</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="D" id="sup-leadership-d" />
                            <Label htmlFor="sup-leadership-d" className="ml-2">D</Label>
                          </div>
                        </div>
                      </RadioGroup>
                      <p className="text-sm text-gray-600 mt-1">
                        チーム運営、業務調整、他部門連携、問題解決能力
                      </p>
                    </div>

                    <div>
                      <Label className="block mb-2">3. 教育・指導力</Label>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'education', value)}>
                        <div className="flex gap-4">
                          <div className="flex items-center">
                            <RadioGroupItem value="S" id="sup-education-s" />
                            <Label htmlFor="sup-education-s" className="ml-2">S</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="A" id="sup-education-a" />
                            <Label htmlFor="sup-education-a" className="ml-2">A</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="B" id="sup-education-b" />
                            <Label htmlFor="sup-education-b" className="ml-2">B</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="C" id="sup-education-c" />
                            <Label htmlFor="sup-education-c" className="ml-2">C</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="D" id="sup-education-d" />
                            <Label htmlFor="sup-education-d" className="ml-2">D</Label>
                          </div>
                        </div>
                      </RadioGroup>
                      <p className="text-sm text-gray-600 mt-1">
                        新人・後輩指導、教育計画立案、OJT実施能力
                      </p>
                    </div>

                    <div>
                      <Label className="block mb-2">4. 業務改善・革新性</Label>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'innovation', value)}>
                        <div className="flex gap-4">
                          <div className="flex items-center">
                            <RadioGroupItem value="S" id="sup-innovation-s" />
                            <Label htmlFor="sup-innovation-s" className="ml-2">S</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="A" id="sup-innovation-a" />
                            <Label htmlFor="sup-innovation-a" className="ml-2">A</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="B" id="sup-innovation-b" />
                            <Label htmlFor="sup-innovation-b" className="ml-2">B</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="C" id="sup-innovation-c" />
                            <Label htmlFor="sup-innovation-c" className="ml-2">C</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="D" id="sup-innovation-d" />
                            <Label htmlFor="sup-innovation-d" className="ml-2">D</Label>
                          </div>
                        </div>
                      </RadioGroup>
                      <p className="text-sm text-gray-600 mt-1">
                        業務改善提案、効率化への取り組み、新しい試みへの参画
                      </p>
                    </div>
                  </div>
                </div>

                {/* 本人評価 */}
                <div className="border rounded-lg p-4 bg-green-50">
                  <h4 className="font-semibold mb-4 text-green-800">本人評価（40%）</h4>
                  <div className="space-y-4">
                    <div>
                      <Label className="block mb-2">1. 高度な准看護師業務の実践</Label>
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
                      <Label className="block mb-2">2. リーダーシップ・調整力</Label>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'leadership', value)}>
                        <div className="flex gap-4">
                          <div className="flex items-center">
                            <RadioGroupItem value="S" id="self-leadership-s" />
                            <Label htmlFor="self-leadership-s" className="ml-2">S</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="A" id="self-leadership-a" />
                            <Label htmlFor="self-leadership-a" className="ml-2">A</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="B" id="self-leadership-b" />
                            <Label htmlFor="self-leadership-b" className="ml-2">B</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="C" id="self-leadership-c" />
                            <Label htmlFor="self-leadership-c" className="ml-2">C</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="D" id="self-leadership-d" />
                            <Label htmlFor="self-leadership-d" className="ml-2">D</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="block mb-2">3. 教育・指導力</Label>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'education', value)}>
                        <div className="flex gap-4">
                          <div className="flex items-center">
                            <RadioGroupItem value="S" id="self-education-s" />
                            <Label htmlFor="self-education-s" className="ml-2">S</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="A" id="self-education-a" />
                            <Label htmlFor="self-education-a" className="ml-2">A</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="B" id="self-education-b" />
                            <Label htmlFor="self-education-b" className="ml-2">B</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="C" id="self-education-c" />
                            <Label htmlFor="self-education-c" className="ml-2">C</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="D" id="self-education-d" />
                            <Label htmlFor="self-education-d" className="ml-2">D</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="block mb-2">4. 業務改善・革新性</Label>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'innovation', value)}>
                        <div className="flex gap-4">
                          <div className="flex items-center">
                            <RadioGroupItem value="S" id="self-innovation-s" />
                            <Label htmlFor="self-innovation-s" className="ml-2">S</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="A" id="self-innovation-a" />
                            <Label htmlFor="self-innovation-a" className="ml-2">A</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="B" id="self-innovation-b" />
                            <Label htmlFor="self-innovation-b" className="ml-2">B</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="C" id="self-innovation-c" />
                            <Label htmlFor="self-innovation-c" className="ml-2">C</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="D" id="self-innovation-d" />
                            <Label htmlFor="self-innovation-d" className="ml-2">D</Label>
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
                        placeholder="例: 180"
                      />
                      <p className="text-sm text-gray-600 mt-1">
                        委員会活動、プロジェクト参加、業務改善実績、教育活動等の累計ポイント
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
                        placeholder="例: 20（上位20%）"
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
                        placeholder="例: 120"
                      />
                      <p className="text-sm text-gray-600 mt-1">
                        法人活動参加、専門研修修了、資格取得、学会参加等の累計ポイント
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
                        placeholder="例: 30（上位30%）"
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
                    placeholder="ミドル准看護師としての専門性、リーダーシップ、組織貢献度、今後への期待等を記載"
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
                    placeholder="ミドル准看護師として発揮している専門性、リーダーシップ、指導力等"
                  />
                </div>

                <div>
                  <Label htmlFor="improvement">改善が必要な点</Label>
                  <Textarea 
                    id="improvement" 
                    rows={3}
                    placeholder="さらなる成長のために必要な改善点、課題等"
                  />
                </div>

                <div>
                  <Label htmlFor="goals">次期目標（6ヶ月後）</Label>
                  <Textarea 
                    id="goals" 
                    rows={4}
                    placeholder="・管理業務への参画拡大
・専門分野の深化
・後輩育成体制の強化
・病棟運営への積極的関与"
                  />
                </div>

                <div>
                  <Label htmlFor="support">必要な支援・研修</Label>
                  <Textarea 
                    id="support" 
                    rows={3}
                    placeholder="管理研修、専門研修、外部研修への派遣、資格取得支援等"
                  />
                </div>

                <div>
                  <Label htmlFor="career">キャリアプラン</Label>
                  <Textarea 
                    id="career" 
                    rows={3}
                    placeholder="将来的なポジション（主任・管理職候補）、看護師資格取得計画、専門分野等"
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
                      placeholder="本人のキャリア希望、組織への要望、将来の目標等"
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