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
import { Heart, Calculator, Award, Users, Building } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ChronicVeteranAssistantNurseEvaluationV4Pattern5() {
  // 評価項目の状態管理
  const [technicalScores, setTechnicalScores] = useState({
    superiorEval: { mastery: 0, mentoring: 0, influence: 0, legacy: 0 },
    selfEval: { mastery: 0, mentoring: 0, influence: 0, legacy: 0 }
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
            【慢性期医療】ベテラン准看護師（11年以上） 人事評価シート v4.0
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            パターン5改良版 - 長期療養ケアの専門性と知識伝承を重視した評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Heart className="h-4 w-4" />
            <AlertDescription>
              <strong>評価構成：</strong>技術評価（360度評価）50点 + 施設貢献（相対評価）25点 + 法人貢献（相対評価）25点
              <br />
              ベテラン准看護師は卓越した慢性期ケアの実践と次世代育成への貢献を重点的に評価します
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

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">基本情報</TabsTrigger>
              <TabsTrigger value="technical">技術評価</TabsTrigger>
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
                  <Label htmlFor="eval-period">評価時期</Label>
                  <Input type="text" id="eval-period" placeholder="定期評価 / 特別評価" />
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
                    <Label htmlFor="hire-date">入職年月日</Label>
                    <Input type="date" id="hire-date" />
                  </div>
                  <div>
                    <Label htmlFor="corp-experience">法人経験年数</Label>
                    <Input type="text" id="corp-experience" placeholder="例：15年" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="department">配属施設・病棟</Label>
                    <Input type="text" id="department" placeholder="医療療養病棟 / 介護医療院" />
                  </div>
                  <div>
                    <Label htmlFor="total-experience">准看護師経験年数</Label>
                    <Input type="text" id="total-experience" placeholder="例：20年（慢性期15年）" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="special-roles">特別役割・称号</Label>
                    <Input type="text" id="special-roles" placeholder="教育担当、認知症ケアエキスパート等" />
                  </div>
                  <div>
                    <Label htmlFor="certifications">専門資格・認定</Label>
                    <Input type="text" id="certifications" placeholder="介護支援専門員、認知症ケア上級専門士等" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">評価者情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="evaluator1">1次評価者（師長）</Label>
                    <Input type="text" id="evaluator1" />
                  </div>
                  <div>
                    <Label htmlFor="evaluator2">2次評価者（看護部長）</Label>
                    <Input type="text" id="evaluator2" />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 技術評価タブ */}
            <TabsContent value="technical" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">技術評価（360度評価）- 50点</h3>
                <p className="text-sm text-gray-600 mb-4">
                  卓越した慢性期ケアの実践力と組織への影響力を評価します。
                  上司評価（60%）と自己評価（40%）の総合評価で算出されます。
                </p>
              </div>

              <Alert className="mb-4">
                <Heart className="h-4 w-4" />
                <AlertDescription>
                  各項目を5段階（S/A/B/C/D）で評価してください。
                  ベテラン准看護師は長年の経験を活かした模範的実践と知識伝承を重視して評価します。
                </AlertDescription>
              </Alert>

              {/* 評価表 */}
              <div className="space-y-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/3">評価項目</TableHead>
                      <TableHead>上司評価（60%）</TableHead>
                      <TableHead>自己評価（40%）</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* 1. 慢性期ケアの卓越性 */}
                    <TableRow>
                      <TableCell className="font-medium">
                        <div>
                          <p className="font-semibold">1. 慢性期ケアの卓越性</p>
                          <p className="text-sm text-gray-600">
                            最高水準の療養ケア実践、困難事例への対応、創造的問題解決
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <RadioGroup 
                          onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'mastery', value)}
                        >
                          <div className="flex space-x-4">
                            {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                              <div key={grade} className="flex items-center">
                                <RadioGroupItem value={grade} id={`superior-mastery-${grade}`} />
                                <Label htmlFor={`superior-mastery-${grade}`} className="ml-1">{grade}</Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      </TableCell>
                      <TableCell>
                        <RadioGroup 
                          onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'mastery', value)}
                        >
                          <div className="flex space-x-4">
                            {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                              <div key={grade} className="flex items-center">
                                <RadioGroupItem value={grade} id={`self-mastery-${grade}`} />
                                <Label htmlFor={`self-mastery-${grade}`} className="ml-1">{grade}</Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      </TableCell>
                    </TableRow>

                    {/* 2. メンタリングと人材育成 */}
                    <TableRow>
                      <TableCell className="font-medium">
                        <div>
                          <p className="font-semibold">2. メンタリングと人材育成</p>
                          <p className="text-sm text-gray-600">
                            後輩の成長支援、精神的支柱としての役割、育成文化の醸成
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <RadioGroup 
                          onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'mentoring', value)}
                        >
                          <div className="flex space-x-4">
                            {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                              <div key={grade} className="flex items-center">
                                <RadioGroupItem value={grade} id={`superior-mentoring-${grade}`} />
                                <Label htmlFor={`superior-mentoring-${grade}`} className="ml-1">{grade}</Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      </TableCell>
                      <TableCell>
                        <RadioGroup 
                          onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'mentoring', value)}
                        >
                          <div className="flex space-x-4">
                            {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                              <div key={grade} className="flex items-center">
                                <RadioGroupItem value={grade} id={`self-mentoring-${grade}`} />
                                <Label htmlFor={`self-mentoring-${grade}`} className="ml-1">{grade}</Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      </TableCell>
                    </TableRow>

                    {/* 3. 組織への影響力 */}
                    <TableRow>
                      <TableCell className="font-medium">
                        <div>
                          <p className="font-semibold">3. 組織への影響力</p>
                          <p className="text-sm text-gray-600">
                            病棟文化の形成、チーム力向上への貢献、組織変革への関与
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <RadioGroup 
                          onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'influence', value)}
                        >
                          <div className="flex space-x-4">
                            {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                              <div key={grade} className="flex items-center">
                                <RadioGroupItem value={grade} id={`superior-influence-${grade}`} />
                                <Label htmlFor={`superior-influence-${grade}`} className="ml-1">{grade}</Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      </TableCell>
                      <TableCell>
                        <RadioGroup 
                          onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'influence', value)}
                        >
                          <div className="flex space-x-4">
                            {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                              <div key={grade} className="flex items-center">
                                <RadioGroupItem value={grade} id={`self-influence-${grade}`} />
                                <Label htmlFor={`self-influence-${grade}`} className="ml-1">{grade}</Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      </TableCell>
                    </TableRow>

                    {/* 4. 知識の体系化と伝承 */}
                    <TableRow>
                      <TableCell className="font-medium">
                        <div>
                          <p className="font-semibold">4. 知識の体系化と伝承</p>
                          <p className="text-sm text-gray-600">
                            暗黙知の形式知化、ケア手法の標準化、慢性期ケア文化の継承
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <RadioGroup 
                          onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'legacy', value)}
                        >
                          <div className="flex space-x-4">
                            {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                              <div key={grade} className="flex items-center">
                                <RadioGroupItem value={grade} id={`superior-legacy-${grade}`} />
                                <Label htmlFor={`superior-legacy-${grade}`} className="ml-1">{grade}</Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      </TableCell>
                      <TableCell>
                        <RadioGroup 
                          onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'legacy', value)}
                        >
                          <div className="flex space-x-4">
                            {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                              <div key={grade} className="flex items-center">
                                <RadioGroupItem value={grade} id={`self-legacy-${grade}`} />
                                <Label htmlFor={`self-legacy-${grade}`} className="ml-1">{grade}</Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">技術評価点数</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {Math.round(calculateTechnicalScore() * 10) / 10} / 50点
                    </span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="technical-comment">技術評価の具体的コメント</Label>
                  <Textarea 
                    id="technical-comment" 
                    placeholder="卓越したケアの事例、後輩育成の成果、組織への影響、知識伝承の取り組みなど、具体的な行動事例を記載してください"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* 施設貢献タブ */}
            <TabsContent value="facility" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">施設貢献評価（相対評価）- 25点</h3>
                <p className="text-sm text-gray-600 mb-4">
                  病棟内での貢献度を既存のポイント制度を活用して相対評価します。
                  ベテラン准看護師は病棟の精神的支柱としての貢献を重視します。
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">施設貢献度ポイント実績</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="facility-points">今期の施設貢献度ポイント</Label>
                    <Input 
                      type="number" 
                      id="facility-points" 
                      placeholder="例: 95"
                      onChange={(e) => setContributionPoints(prev => ({
                        ...prev,
                        facility: parseInt(e.target.value) || 0
                      }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="facility-rank">施設内順位（パーセンタイル）</Label>
                    <div className="flex items-center space-x-4">
                      <Input 
                        type="number" 
                        id="facility-rank"
                        min="1"
                        max="100"
                        value={facilityRank}
                        onChange={(e) => setFacilityRank(parseInt(e.target.value) || 50)}
                      />
                      <span className="text-sm text-gray-600">%</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      上位{facilityRank}%（数値が小さいほど高評価）
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">施設貢献評価点数</span>
                      <span className="text-2xl font-bold text-green-600">
                        {calculateContributionScore(facilityRank)} / 25点
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label>主な貢献内容（複数選択可）</Label>
                    <div className="space-y-2 mt-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>教育体制の構築・運営</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>病棟の精神的支柱としての役割</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>複数世代の後輩育成実績</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>慢性期ケアマニュアルの作成・監修</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>病棟の伝統・文化の継承</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>困難事例での助言・支援</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>病棟運営への建設的提言</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="facility-comment">施設貢献の具体例</Label>
                    <Textarea 
                      id="facility-comment" 
                      placeholder="病棟の精神的支柱としての活動、後輩育成の実績、知識伝承の成果など"
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 法人貢献タブ */}
            <TabsContent value="corporate" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">法人貢献評価（相対評価）- 25点</h3>
                <p className="text-sm text-gray-600 mb-4">
                  法人全体での貢献度を既存のポイント制度を活用して相対評価します。
                  ベテラン准看護師は長年の経験を活かした組織全体への貢献を重視します。
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">法人貢献度ポイント実績</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="corporate-points">今期の法人貢献度ポイント</Label>
                    <Input 
                      type="number" 
                      id="corporate-points" 
                      placeholder="例: 85"
                      onChange={(e) => setContributionPoints(prev => ({
                        ...prev,
                        corporate: parseInt(e.target.value) || 0
                      }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="corporate-rank">法人内順位（パーセンタイル）</Label>
                    <div className="flex items-center space-x-4">
                      <Input 
                        type="number" 
                        id="corporate-rank"
                        min="1"
                        max="100"
                        value={corporateRank}
                        onChange={(e) => setCorporateRank(parseInt(e.target.value) || 50)}
                      />
                      <span className="text-sm text-gray-600">%</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      上位{corporateRank}%（数値が小さいほど高評価）
                    </p>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">法人貢献評価点数</span>
                      <span className="text-2xl font-bold text-orange-600">
                        {calculateContributionScore(corporateRank)} / 25点
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label>主な貢献内容（複数選択可）</Label>
                    <div className="space-y-2 mt-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>法人の慢性期ケア教育プログラムの構築</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>院内講師・エキスパートとしての活動</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>法人の看護理念・文化の体現と伝承</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>部署横断的な知識共有活動</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>法人史における重要な取り組みへの参画</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>外部機関との連携・地域貢献活動</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>後進育成システムの構築・改善</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="corporate-comment">法人貢献の具体例</Label>
                    <Textarea 
                      id="corporate-comment" 
                      placeholder="法人全体への知識貢献、組織文化の醸成、長年の経験を活かした活動など"
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 総合評価タブ */}
            <TabsContent value="summary" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">総合評価サマリー</h3>
              </div>

              {/* 評価結果サマリー */}
              <Card>
                <CardHeader>
                  <CardTitle>評価結果</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* 総合点数 */}
                    <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                      <p className="text-lg mb-2">総合評価点数</p>
                      <p className={`text-5xl font-bold ${getScoreColor(totalScore)}`}>
                        {totalScore}点
                      </p>
                      <p className="text-sm text-gray-600 mt-2">/ 100点満点</p>
                    </div>

                    {/* 内訳 */}
                    <div className="grid grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <Award className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                            <p className="text-sm text-gray-600">技術評価</p>
                            <p className="text-2xl font-bold mt-1">
                              {Math.round(calculateTechnicalScore() * 10) / 10}点
                            </p>
                            <p className="text-xs text-gray-500">/ 50点</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <Building className="h-8 w-8 mx-auto mb-2 text-green-600" />
                            <p className="text-sm text-gray-600">施設貢献</p>
                            <p className="text-2xl font-bold mt-1">
                              {calculateContributionScore(facilityRank)}点
                            </p>
                            <p className="text-xs text-gray-500">/ 25点</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <Users className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                            <p className="text-sm text-gray-600">法人貢献</p>
                            <p className="text-2xl font-bold mt-1">
                              {calculateContributionScore(corporateRank)}点
                            </p>
                            <p className="text-xs text-gray-500">/ 25点</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* 評価ランク */}
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">評価ランク</p>
                      <p className="text-3xl font-bold">
                        {totalScore >= 90 ? 'S' : 
                         totalScore >= 80 ? 'A' : 
                         totalScore >= 70 ? 'B' : 
                         totalScore >= 60 ? 'C' : 'D'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 総合所見 */}
              <Card>
                <CardHeader>
                  <CardTitle>総合所見・今後の活躍計画</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="career-achievement">キャリアにおける特筆すべき成果</Label>
                    <Textarea 
                      id="career-achievement" 
                      placeholder="長年の慢性期ケアでの功績、育成した人材、組織への貢献など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="current-strengths">現在の強み・組織への価値</Label>
                    <Textarea 
                      id="current-strengths" 
                      placeholder="精神的支柱としての存在、豊富な経験知、後輩への影響力など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="knowledge-transfer">知識・技術の継承計画</Label>
                    <Textarea 
                      id="knowledge-transfer" 
                      placeholder="暗黙知の形式知化、マニュアル作成、講師活動、メンタリングなど"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="future-roles">今後期待される役割</Label>
                    <Textarea 
                      id="future-roles" 
                      placeholder="専門アドバイザー、教育専任、特別プロジェクトへの参画など"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="legacy-building">レガシー構築支援</Label>
                    <Textarea 
                      id="legacy-building" 
                      placeholder="後継者育成の進捗、組織に残すべき知見、継承すべき価値観など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="overall-comment">1次評価者コメント</Label>
                    <Textarea 
                      id="overall-comment" 
                      placeholder="ベテラン准看護師としての価値、組織への貢献、感謝と敬意を込めて"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="final-comment">2次評価者コメント</Label>
                    <Textarea 
                      id="final-comment" 
                      placeholder="法人における存在意義、長年の貢献への評価、今後の活躍への期待"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="next-review">次回評価予定日</Label>
                      <Input type="date" id="next-review" />
                    </div>
                    <div>
                      <Label htmlFor="special-recognition">特別表彰・認定</Label>
                      <Input type="text" id="special-recognition" placeholder="永年勤続表彰、功労賞等" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* 保存ボタン */}
          <div className="flex justify-end space-x-4 pt-6 border-t mt-6">
            <Button variant="outline">下書き保存</Button>
            <Button>評価を確定</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}