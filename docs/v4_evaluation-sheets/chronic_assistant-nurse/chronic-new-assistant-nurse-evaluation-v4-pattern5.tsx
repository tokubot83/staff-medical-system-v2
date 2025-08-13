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

export default function ChronicNewAssistantNurseEvaluationV4Pattern5() {
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
            【慢性期医療】新人准看護師（1年目） 人事評価シート v4.0
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            パターン5改良版 - 慢性期ケアの基礎習得と療養環境への適応を重視した評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              <strong>評価構成：</strong>技術評価（360度評価）50点 + 施設貢献（相対評価）25点 + 法人貢献（相対評価）25点
              <br />
              新人准看護師は慢性期ケアの基礎技術習得と療養環境への適応・チーム貢献を重点的に評価します
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
                    <Label htmlFor="hire-date">入職年月日</Label>
                    <Input type="date" id="hire-date" />
                  </div>
                  <div>
                    <Label htmlFor="corp-experience">法人経験年数</Label>
                    <Input type="text" id="corp-experience" placeholder="1年目" readOnly />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="previous-experience">前職経験</Label>
                    <Input type="text" id="previous-experience" placeholder="なし / 他病院○年（参考）" />
                  </div>
                  <div>
                    <Label htmlFor="education">最終学歴・資格取得年</Label>
                    <Input type="text" id="education" placeholder="○○准看護学校 2024年卒" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="department">配属病棟</Label>
                    <Input type="text" id="department" placeholder="慢性期病棟3階" />
                  </div>
                  <div>
                    <Label htmlFor="preceptor">プリセプター</Label>
                    <Input type="text" id="preceptor" />
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

            {/* 技術評価タブ */}
            <TabsContent value="technical" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">技術評価（360度評価）- 50点</h3>
                <p className="text-sm text-gray-600 mb-4">
                  慢性期ケアの基礎的な准看護実践能力を評価します。
                  上司評価（60%）と自己評価（40%）の総合評価で算出されます。
                </p>
              </div>

              <Alert className="mb-4">
                <InfoIcon className="h-4 w-4" />
                <AlertDescription>
                  各項目を5段階（S/A/B/C/D）で評価してください。
                  新人准看護師は特に基礎技術の習得と安全な実践を重視して評価します。
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
                    {/* 1. 慢性期ケアの基礎技術 */}
                    <TableRow>
                      <TableCell className="font-medium">
                        <div>
                          <p className="font-semibold">1. 慢性期ケアの基礎技術</p>
                          <p className="text-sm text-gray-600">
                            療養環境での基本的な援助技術（体位変換、移乗、清潔援助等）
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <RadioGroup 
                          onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'skills', value)}
                        >
                          <div className="flex space-x-4">
                            {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                              <div key={grade} className="flex items-center">
                                <RadioGroupItem value={grade} id={`superior-skills-${grade}`} />
                                <Label htmlFor={`superior-skills-${grade}`} className="ml-1">{grade}</Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      </TableCell>
                      <TableCell>
                        <RadioGroup 
                          onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'skills', value)}
                        >
                          <div className="flex space-x-4">
                            {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                              <div key={grade} className="flex items-center">
                                <RadioGroupItem value={grade} id={`self-skills-${grade}`} />
                                <Label htmlFor={`self-skills-${grade}`} className="ml-1">{grade}</Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      </TableCell>
                    </TableRow>

                    {/* 2. 慢性期疾患の理解 */}
                    <TableRow>
                      <TableCell className="font-medium">
                        <div>
                          <p className="font-semibold">2. 慢性期疾患の理解</p>
                          <p className="text-sm text-gray-600">
                            長期療養患者の疾患特性と観察ポイントの理解
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <RadioGroup 
                          onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'knowledge', value)}
                        >
                          <div className="flex space-x-4">
                            {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                              <div key={grade} className="flex items-center">
                                <RadioGroupItem value={grade} id={`superior-knowledge-${grade}`} />
                                <Label htmlFor={`superior-knowledge-${grade}`} className="ml-1">{grade}</Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      </TableCell>
                      <TableCell>
                        <RadioGroup 
                          onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'knowledge', value)}
                        >
                          <div className="flex space-x-4">
                            {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                              <div key={grade} className="flex items-center">
                                <RadioGroupItem value={grade} id={`self-knowledge-${grade}`} />
                                <Label htmlFor={`self-knowledge-${grade}`} className="ml-1">{grade}</Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      </TableCell>
                    </TableRow>

                    {/* 3. 患者・家族との関わり */}
                    <TableRow>
                      <TableCell className="font-medium">
                        <div>
                          <p className="font-semibold">3. 患者・家族との関わり</p>
                          <p className="text-sm text-gray-600">
                            療養生活を支える温かく丁寧な対応
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <RadioGroup 
                          onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'patient', value)}
                        >
                          <div className="flex space-x-4">
                            {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                              <div key={grade} className="flex items-center">
                                <RadioGroupItem value={grade} id={`superior-patient-${grade}`} />
                                <Label htmlFor={`superior-patient-${grade}`} className="ml-1">{grade}</Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      </TableCell>
                      <TableCell>
                        <RadioGroup 
                          onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'patient', value)}
                        >
                          <div className="flex space-x-4">
                            {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                              <div key={grade} className="flex items-center">
                                <RadioGroupItem value={grade} id={`self-patient-${grade}`} />
                                <Label htmlFor={`self-patient-${grade}`} className="ml-1">{grade}</Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      </TableCell>
                    </TableRow>

                    {/* 4. 安全管理と感染対策 */}
                    <TableRow>
                      <TableCell className="font-medium">
                        <div>
                          <p className="font-semibold">4. 安全管理と感染対策</p>
                          <p className="text-sm text-gray-600">
                            転倒転落予防、誤嚥予防、標準予防策の実践
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <RadioGroup 
                          onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'safety', value)}
                        >
                          <div className="flex space-x-4">
                            {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                              <div key={grade} className="flex items-center">
                                <RadioGroupItem value={grade} id={`superior-safety-${grade}`} />
                                <Label htmlFor={`superior-safety-${grade}`} className="ml-1">{grade}</Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      </TableCell>
                      <TableCell>
                        <RadioGroup 
                          onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'safety', value)}
                        >
                          <div className="flex space-x-4">
                            {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                              <div key={grade} className="flex items-center">
                                <RadioGroupItem value={grade} id={`self-safety-${grade}`} />
                                <Label htmlFor={`self-safety-${grade}`} className="ml-1">{grade}</Label>
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
                    placeholder="慢性期ケアの技術習得状況、患者との関わり方、安全への意識など、具体的な行動事例を記載してください"
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
                  新人准看護師は病棟への適応とチーム協働を重視します。
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
                      placeholder="例: 45"
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
                        <span>病棟行事への積極的参加</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>環境整備への貢献</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>同期との良好な協力関係</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>病棟会議での積極的発言</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>レクリエーション活動のサポート</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="facility-comment">施設貢献の具体例</Label>
                    <Textarea 
                      id="facility-comment" 
                      placeholder="病棟での貢献活動、チーム協働の様子、環境整備への取り組みなど"
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
                  新人准看護師は法人理念の理解と学習意欲を重視します。
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
                      placeholder="例: 30"
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
                        <span>法人研修への積極的参加</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>院内勉強会への参加</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>感染対策委員会活動への協力</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>医療安全への取り組み</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>法人理念の理解と実践</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="corporate-comment">法人貢献の具体例</Label>
                    <Textarea 
                      id="corporate-comment" 
                      placeholder="法人活動への参加状況、研修での学習姿勢、院内活動への協力など"
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
                  <CardTitle>総合所見・育成計画</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="strengths">特に優れている点・強み</Label>
                    <Textarea 
                      id="strengths" 
                      placeholder="患者への優しい関わり、学習意欲、チーム協調性など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="growth-areas">重点的に育成すべき領域</Label>
                    <Textarea 
                      id="growth-areas" 
                      placeholder="基礎技術の確実な習得、慢性期ケアの理解深化など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="next-goals">次期（3ヶ月後）の目標</Label>
                    <Textarea 
                      id="next-goals" 
                      placeholder="日常生活援助の自立、夜勤業務への参加準備など"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="support-plan">必要なサポート・教育計画</Label>
                    <Textarea 
                      id="support-plan" 
                      placeholder="技術チェックリストの活用、プリセプターとの定期面談など"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="overall-comment">1次評価者コメント</Label>
                    <Textarea 
                      id="overall-comment" 
                      placeholder="新人准看護師としての成長度、今後の可能性、具体的な指導内容など"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="final-comment">2次評価者コメント</Label>
                    <Textarea 
                      id="final-comment" 
                      placeholder="総合的な評価と今後の育成方針について"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="next-review">次回評価予定日</Label>
                      <Input type="date" id="next-review" />
                    </div>
                    <div>
                      <Label htmlFor="review-type">次回評価種別</Label>
                      <Input type="text" id="review-type" placeholder="6ヶ月評価" />
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