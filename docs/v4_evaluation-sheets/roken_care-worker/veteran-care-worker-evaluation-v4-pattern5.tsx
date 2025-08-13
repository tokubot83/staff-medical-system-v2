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

export default function VeteranCareWorkerEvaluationV4Pattern5() {
  // 評価項目の状態管理
  const [technicalScores, setTechnicalScores] = useState({
    superiorEval: { expertise: 0, leadership: 0, innovation: 0, mentoring: 0 },
    selfEval: { expertise: 0, leadership: 0, innovation: 0, mentoring: 0 }
  });

  const [contributionPoints, setContributionPoints] = useState({
    facility: 0,
    corporate: 0
  });

  const [totalScore, setTotalScore] = useState(0);
  const [facilityRank, setFacilityRank] = useState(50);
  const [corporateRank, setCorporateRank] = useState(50);

  // 評価グレードから点数への変換
  const gradeToScore: { [key: string]: number } = {
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
            老健 ベテラン介護福祉士（11年以上） 人事評価シート v4.0
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            パターン5改良版 - エキスパート性とリーダーシップを重視した評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              <strong>評価構成：</strong>技術評価（360度評価）50点 + 施設貢献（相対評価）25点 + 法人貢献（相対評価）25点
              <br />
              ベテラン介護福祉士は専門性の深化、組織への影響力、次世代育成の貢献を重点的に評価します
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
                  <Label htmlFor="experience">総経験年数</Label>
                  <Input type="text" id="experience" placeholder="例：15年目" />
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
                    <Input type="text" id="corp-experience" placeholder="○年目" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="previous-experience">前職経験</Label>
                    <Input type="text" id="previous-experience" placeholder="他施設○年、病院○年等" />
                  </div>
                  <div>
                    <Label htmlFor="specialization">専門分野・保有資格</Label>
                    <Input type="text" id="specialization" placeholder="認知症ケア専門士、介護支援専門員等" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="department">配属部門・役職</Label>
                    <select id="department" className="w-full border rounded-md px-3 py-2">
                      <option value="">選択してください</option>
                      <option value="admission">入所サービス</option>
                      <option value="daycare">通所サービス</option>
                      <option value="both">入所・通所統括</option>
                      <option value="supervisor">主任・リーダー</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="mentoring-count">現在の指導担当者数</Label>
                    <Input type="number" id="mentoring-count" placeholder="例：3名" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">評価者情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="evaluator1">1次評価者（介護主任・管理者）</Label>
                    <Input type="text" id="evaluator1" />
                  </div>
                  <div>
                    <Label htmlFor="evaluator2">2次評価者（施設長・事業部長）</Label>
                    <Input type="text" id="evaluator2" />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 技術評価タブ */}
            <TabsContent value="technical" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">技術評価（360度評価：上司60%＋自己40%）</h3>
                <p className="text-sm text-gray-600 mb-4">
                  エキスパートとしての専門性と組織への影響力を評価します
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
                        <p className="font-semibold">1. 高度専門技術・エキスパート性</p>
                        <p className="text-sm text-gray-600">
                          複雑事例への対応、専門知識の活用、技術革新への取り組み
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'expertise', value)}>
                        <div className="flex justify-center space-x-2">
                          {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                            <div key={grade} className="flex items-center">
                              <RadioGroupItem value={grade} id={`superior-expertise-${grade}`} />
                              <Label htmlFor={`superior-expertise-${grade}`} className="ml-1 cursor-pointer">
                                {grade}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </TableCell>
                    <TableCell>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'expertise', value)}>
                        <div className="flex justify-center space-x-2">
                          {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                            <div key={grade} className="flex items-center">
                              <RadioGroupItem value={grade} id={`self-expertise-${grade}`} />
                              <Label htmlFor={`self-expertise-${grade}`} className="ml-1 cursor-pointer">
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
                        <p className="font-semibold">2. リーダーシップ・組織運営</p>
                        <p className="text-sm text-gray-600">
                          チーム統率、業務改善推進、組織目標達成への貢献
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'leadership', value)}>
                        <div className="flex justify-center space-x-2">
                          {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                            <div key={grade} className="flex items-center">
                              <RadioGroupItem value={grade} id={`superior-leadership-${grade}`} />
                              <Label htmlFor={`superior-leadership-${grade}`} className="ml-1 cursor-pointer">
                                {grade}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </TableCell>
                    <TableCell>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'leadership', value)}>
                        <div className="flex justify-center space-x-2">
                          {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                            <div key={grade} className="flex items-center">
                              <RadioGroupItem value={grade} id={`self-leadership-${grade}`} />
                              <Label htmlFor={`self-leadership-${grade}`} className="ml-1 cursor-pointer">
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
                        <p className="font-semibold">3. 改革・革新への取り組み</p>
                        <p className="text-sm text-gray-600">
                          新しいケア手法の導入、業務効率化、サービス向上提案
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'innovation', value)}>
                        <div className="flex justify-center space-x-2">
                          {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                            <div key={grade} className="flex items-center">
                              <RadioGroupItem value={grade} id={`superior-innovation-${grade}`} />
                              <Label htmlFor={`superior-innovation-${grade}`} className="ml-1 cursor-pointer">
                                {grade}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </TableCell>
                    <TableCell>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'innovation', value)}>
                        <div className="flex justify-center space-x-2">
                          {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                            <div key={grade} className="flex items-center">
                              <RadioGroupItem value={grade} id={`self-innovation-${grade}`} />
                              <Label htmlFor={`self-innovation-${grade}`} className="ml-1 cursor-pointer">
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
                        <p className="font-semibold">4. 次世代育成・メンタリング</p>
                        <p className="text-sm text-gray-600">
                          後輩指導、知識技術伝承、職場風土改善への貢献
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'mentoring', value)}>
                        <div className="flex justify-center space-x-2">
                          {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                            <div key={grade} className="flex items-center">
                              <RadioGroupItem value={grade} id={`superior-mentoring-${grade}`} />
                              <Label htmlFor={`superior-mentoring-${grade}`} className="ml-1 cursor-pointer">
                                {grade}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </TableCell>
                    <TableCell>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'mentoring', value)}>
                        <div className="flex justify-center space-x-2">
                          {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                            <div key={grade} className="flex items-center">
                              <RadioGroupItem value={grade} id={`self-mentoring-${grade}`} />
                              <Label htmlFor={`self-mentoring-${grade}`} className="ml-1 cursor-pointer">
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

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-3">評価基準（ベテラン職員）</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-semibold">S（卓越）：</span>組織全体に大きな影響を与える。業界のリーダー的存在</p>
                  <p><span className="font-semibold">A（優秀）：</span>高い専門性を発揮し、組織の中核として活躍</p>
                  <p><span className="font-semibold">B（良好）：</span>安定した専門性。期待される役割を適切に遂行</p>
                  <p><span className="font-semibold">C（要努力）：</span>専門性に課題あり。さらなる向上が必要</p>
                  <p><span className="font-semibold">D（要改善）：</span>ベテランとしての期待水準を下回る。改善が急務</p>
                </div>
              </div>

              <div>
                <Label htmlFor="technical-comment">技術評価コメント（専門性の発揮事例・影響力など）</Label>
                <Textarea
                  id="technical-comment"
                  placeholder="エキスパートとしての専門技術の発揮、組織への影響力、革新的な取り組みなど"
                  className="min-h-[120px]"
                />
              </div>
            </TabsContent>

            {/* 施設貢献タブ */}
            <TabsContent value="facility" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">施設貢献度評価（相対評価・25点満点）</h3>
                <p className="text-sm text-gray-600 mb-4">
                  委員会リーダー、研修講師、組織改革推進等の施設運営への貢献を評価
                </p>
              </div>

              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertDescription>
                  ベテラン職員は委員会の中心的役割や、施設全体のサービス向上への貢献が期待されます
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="facility-activities">今期の施設内活動実績</Label>
                  <Textarea
                    id="facility-activities"
                    placeholder="例：
・感染対策委員会委員長（月1回）
・新人研修プログラム企画・講師
・ケアの質向上委員会での改善提案採用（○件）
・他部門との連携強化プロジェクトリーダー
・実習生指導責任者"
                    className="min-h-[120px]"
                  />
                </div>

                <div>
                  <Label htmlFor="facility-points">獲得ポイント数</Label>
                  <Input
                    type="number"
                    id="facility-points"
                    placeholder="例：45ポイント"
                    onChange={(e) => setContributionPoints(prev => ({
                      ...prev,
                      facility: parseInt(e.target.value) || 0
                    }))}
                  />
                </div>

                <div>
                  <Label htmlFor="facility-rank">同期・同職種内での相対位置（パーセンタイル）</Label>
                  <div className="flex items-center space-x-4">
                    <Input
                      type="range"
                      id="facility-rank"
                      min="0"
                      max="100"
                      value={facilityRank}
                      onChange={(e) => setFacilityRank(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="w-20 text-center font-semibold">
                      上位{facilityRank}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    点数: {calculateContributionScore(facilityRank)}/25点
                  </p>
                </div>

                <Table className="mt-4">
                  <TableHeader>
                    <TableRow>
                      <TableHead>パーセンタイル</TableHead>
                      <TableHead>点数</TableHead>
                      <TableHead>目安（ベテラン）</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>上位10%以内</TableCell>
                      <TableCell>25点</TableCell>
                      <TableCell>施設運営の中核的存在</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>上位20%以内</TableCell>
                      <TableCell>22.5点</TableCell>
                      <TableCell>複数委員会のリーダー</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>上位30%以内</TableCell>
                      <TableCell>20点</TableCell>
                      <TableCell>委員長・主任級の活動</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>上位50%以内</TableCell>
                      <TableCell>15点</TableCell>
                      <TableCell>標準的なベテラン活動</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>上位70%以内</TableCell>
                      <TableCell>10点</TableCell>
                      <TableCell>基本的な委員会参加</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* 法人貢献タブ */}
            <TabsContent value="corporate" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">法人貢献度評価（相対評価・25点満点）</h3>
                <p className="text-sm text-gray-600 mb-4">
                  法人研修企画・講師、他施設指導、事業展開支援等を評価
                </p>
              </div>

              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertDescription>
                  ベテラン職員は法人全体の介護サービス向上と、組織の発展に重要な役割を果たすことが期待されます
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="corporate-activities">今期の法人レベル活動実績</Label>
                  <Textarea
                    id="corporate-activities"
                    placeholder="例：
・法人介護技術研修主任講師
・新規事業所開設支援（○ヶ月）
・法人全体のケア標準化プロジェクトリーダー
・他施設への指導・コンサルティング
・法人理事会での現場報告・提言
・業界団体での講演・発表"
                    className="min-h-[120px]"
                  />
                </div>

                <div>
                  <Label htmlFor="corporate-points">法人貢献ポイント数</Label>
                  <Input
                    type="number"
                    id="corporate-points"
                    placeholder="例：35ポイント"
                    onChange={(e) => setContributionPoints(prev => ({
                      ...prev,
                      corporate: parseInt(e.target.value) || 0
                    }))}
                  />
                </div>

                <div>
                  <Label htmlFor="corporate-rank">法人内同職種での相対位置（パーセンタイル）</Label>
                  <div className="flex items-center space-x-4">
                    <Input
                      type="range"
                      id="corporate-rank"
                      min="0"
                      max="100"
                      value={corporateRank}
                      onChange={(e) => setCorporateRank(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="w-20 text-center font-semibold">
                      上位{corporateRank}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    点数: {calculateContributionScore(corporateRank)}/25点
                  </p>
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">ベテラン職員の法人貢献評価の視点</h4>
                  <ul className="space-y-1 text-sm">
                    <li>・法人全体の介護サービス向上への影響力</li>
                    <li>・他施設への知識・技術移転</li>
                    <li>・法人の事業展開・発展への貢献</li>
                    <li>・業界全体への影響力・知名度</li>
                    <li>・法人の人材育成体制構築への関与</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            {/* 総合評価タブ */}
            <TabsContent value="summary" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">総合評価サマリー</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center">
                      <Award className="h-4 w-4 mr-2 text-blue-600" />
                      技術評価
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-blue-600">
                      {Math.round(calculateTechnicalScore() * 10) / 10} / 50点
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      360度評価（上司60%＋自己40%）
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center">
                      <Building className="h-4 w-4 mr-2 text-green-600" />
                      施設貢献
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-green-600">
                      {calculateContributionScore(facilityRank)} / 25点
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      上位{facilityRank}%（相対評価）
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center">
                      <Users className="h-4 w-4 mr-2 text-orange-600" />
                      法人貢献
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-orange-600">
                      {calculateContributionScore(corporateRank)} / 25点
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      上位{corporateRank}%（相対評価）
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg text-center">
                <h4 className="text-lg font-semibold mb-2">総合評価点数</h4>
                <p className={`text-4xl font-bold ${getScoreColor(totalScore)}`}>
                  {totalScore} / 100点
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  技術評価と貢献度評価の総合点
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="strengths">特に優れている点・強み</Label>
                  <Textarea
                    id="strengths"
                    placeholder="例：
・○○分野での深い専門性と業界での知名度
・組織全体のサービス向上に大きく貢献
・後輩育成で多くの優秀な人材を輩出
・法人の事業発展に戦略的視点で貢献
・他施設からの指導要請が多い"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="growth-areas">今後の成長課題・改善点</Label>
                  <Textarea
                    id="growth-areas"
                    placeholder="例：
・新しい技術・手法への適応とアップデート
・デジタル化への対応と活用
・若手職員との世代間ギャップの解消"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="next-goals">次期評価までの目標設定</Label>
                  <Textarea
                    id="next-goals"
                    placeholder="例：
1. ○○分野の最新知識習得と実践への展開
2. 法人全体の人材育成プログラム改革推進
3. 新規事業所開設での指導的役割遂行
4. 業界団体での講演・発表実施（年○回）"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="support-plan">必要な支援・育成計画</Label>
                  <Textarea
                    id="support-plan"
                    placeholder="例：
・最新技術習得のための外部研修参加支援
・学会発表・論文執筆のための環境整備
・管理職研修への参加機会提供
・他法人との交流・見学機会の確保"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="leadership-development">次期リーダー候補としての育成計画</Label>
                  <Textarea
                    id="leadership-development"
                    placeholder="管理職候補、専門職リーダー、法人幹部候補等の育成方針と具体的計画"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="succession-planning">知識・技術継承計画</Label>
                  <Textarea
                    id="succession-planning"
                    placeholder="後継者育成、技術伝承、組織の知見保存に関する具体的取り組み"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="overall-comment">総合所見（エキスパートとしての評価と期待）</Label>
                  <Textarea
                    id="overall-comment"
                    placeholder="ベテラン職員としての専門性発揮、組織への影響力、将来的な役割など"
                    className="min-h-[120px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="next-review-date">次回評価予定日</Label>
                    <Input type="date" id="next-review-date" />
                  </div>
                  <div>
                    <Label htmlFor="review-cycle">評価サイクル</Label>
                    <select id="review-cycle" className="w-full border rounded-md px-3 py-2">
                      <option value="1year">1年後</option>
                      <option value="2years">2年後</option>
                    </select>
                  </div>
                </div>
              </div>
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