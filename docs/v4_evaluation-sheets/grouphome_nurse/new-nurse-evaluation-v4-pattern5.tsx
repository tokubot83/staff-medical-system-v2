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
import { InfoIcon, Calculator, Award, Users, Building, Home } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function GrouphomeNewNurseEvaluationV4Pattern5() {
  // 評価項目の状態管理
  const [technicalScores, setTechnicalScores] = useState({
    superiorEval: { dementiaCare: 0, dailySupport: 0, familyComm: 0, safety: 0 },
    selfEval: { dementiaCare: 0, dailySupport: 0, familyComm: 0, safety: 0 }
  });

  const [contributionPoints, setContributionPoints] = useState({
    facility: 0,
    corporate: 0
  });

  const [totalScore, setTotalScore] = useState(0);
  const [facilityRank, setFacilityRank] = useState(50); // パーセンタイル
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
            グループホーム 新人看護師（1年目） 人事評価シート v4.0
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            パターン5改良版 - 認知症ケアと生活支援の基礎習得を重視した評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Home className="h-4 w-4" />
            <AlertDescription>
              <strong>評価構成：</strong>技術評価（360度評価）50点 + 施設貢献（相対評価）25点 + 法人貢献（相対評価）25点
              <br />
              グループホーム新人看護師は認知症ケアの基礎習得と家庭的環境での生活支援を重点的に評価します
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
                    <Label htmlFor="unit">配属ユニット</Label>
                    <Input type="text" id="unit" placeholder="○○ユニット" />
                  </div>
                  <div>
                    <Label htmlFor="mentor">指導担当者</Label>
                    <Input type="text" id="mentor" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="previous-experience">前職経験</Label>
                    <Input type="text" id="previous-experience" placeholder="なし / 介護施設○年（参考）" />
                  </div>
                  <div>
                    <Label htmlFor="education">最終学歴・資格取得年</Label>
                    <Input type="text" id="education" placeholder="○○看護専門学校 2024年卒" />
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
                    <Label htmlFor="evaluator2">2次評価者（管理者）</Label>
                    <Input type="text" id="evaluator2" />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 技術評価タブ（50点）- 360度評価 */}
            <TabsContent value="technical" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">技術評価（50点）- 360度評価</h3>
                <p className="text-sm text-gray-600 mb-4">
                  上司評価60％（30点）＋ 本人評価40％（20点）で算出
                  <br />
                  新人看護師は認知症ケアの基礎と生活支援技術の習得を重視
                </p>
              </div>

              {/* 上司評価セクション */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-4 text-blue-600">指導担当者・管理者評価（60％）</h4>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">1. 認知症ケアの基礎習得</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'dementiaCare', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`superior-dementia-${grade}`} />
                            <Label htmlFor={`superior-dementia-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-gray-500 mt-1">
                      S:優れた理解と実践 A:良好な習得 B:標準的 C:習得に課題 D:要指導
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">2. 日常生活支援技術</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'dailySupport', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`superior-daily-${grade}`} />
                            <Label htmlFor={`superior-daily-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-gray-500 mt-1">
                      S:個別性を重視した支援 A:適切な支援 B:基本的支援 C:改善必要 D:大幅な改善要
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">3. 入居者・家族とのコミュニケーション</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'familyComm', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`superior-comm-${grade}`} />
                            <Label htmlFor={`superior-comm-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-gray-500 mt-1">
                      S:信頼関係構築が優秀 A:良好な関係性 B:標準的 C:関係構築に課題 D:要改善
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">4. 医療安全・感染対策・リスク管理</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'safety', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`superior-safety-${grade}`} />
                            <Label htmlFor={`superior-safety-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-gray-500 mt-1">
                      S:模範的な実践 A:確実な実践 B:基本的実践 C:実践に不安 D:要指導
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <Label htmlFor="superior-comments">上司からのコメント</Label>
                  <Textarea
                    id="superior-comments"
                    placeholder="認知症ケアへの取り組み、生活支援の姿勢、成長した点など"
                    className="min-h-[100px]"
                  />
                </div>
              </div>

              {/* 本人評価セクション */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-4 text-green-600">本人評価（40％）</h4>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">1. 認知症ケアの基礎習得</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'dementiaCare', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`self-dementia-${grade}`} />
                            <Label htmlFor={`self-dementia-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">2. 日常生活支援技術</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'dailySupport', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`self-daily-${grade}`} />
                            <Label htmlFor={`self-daily-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">3. 入居者・家族とのコミュニケーション</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'familyComm', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`self-comm-${grade}`} />
                            <Label htmlFor={`self-comm-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">4. 医療安全・感染対策・リスク管理</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'safety', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`self-safety-${grade}`} />
                            <Label htmlFor={`self-safety-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="mt-4">
                  <Label htmlFor="self-reflection">自己振り返り</Label>
                  <Textarea
                    id="self-reflection"
                    placeholder="この期間で学んだこと、困難だったこと、今後の目標など"
                    className="min-h-[100px]"
                  />
                </div>
              </div>

              {/* 技術評価サマリー */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">技術評価点数</h4>
                <div className="text-2xl font-bold text-blue-700">
                  {Math.round(calculateTechnicalScore() * 10) / 10} / 50点
                </div>
              </div>
            </TabsContent>

            {/* 施設貢献タブ（25点） */}
            <TabsContent value="facility" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">施設貢献評価（25点）- 相対評価</h3>
                <p className="text-sm text-gray-600 mb-4">
                  グループホーム内での貢献度を相対的に評価（既存ポイント制度活用）
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="facility-points">現在の施設貢献ポイント</Label>
                  <Input
                    type="number"
                    id="facility-points"
                    value={contributionPoints.facility}
                    onChange={(e) => setContributionPoints(prev => ({...prev, facility: parseInt(e.target.value) || 0}))}
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    ユニット行事参加、委員会活動、入居者支援の工夫等
                  </p>
                </div>

                <div>
                  <Label htmlFor="facility-percentile">施設内順位（パーセンタイル）</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      id="facility-percentile"
                      value={facilityRank}
                      onChange={(e) => setFacilityRank(Math.max(0, Math.min(100, parseInt(e.target.value) || 50)))}
                      min="0"
                      max="100"
                    />
                    <span className="text-sm text-gray-600">%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    上位10%なら「10」と入力（小さい数値ほど高評価）
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">施設貢献点数</h4>
                  <div className="text-2xl font-bold text-green-700">
                    {calculateContributionScore(facilityRank)} / 25点
                  </div>
                </div>

                <div>
                  <Label htmlFor="facility-activities">主な貢献活動</Label>
                  <Textarea
                    id="facility-activities"
                    placeholder="・家族会への参加と支援
・レクリエーション企画の実施
・地域交流イベントへの協力
・ユニット環境整備の工夫"
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* 法人貢献タブ（25点） */}
            <TabsContent value="corporate" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">法人貢献評価（25点）- 相対評価</h3>
                <p className="text-sm text-gray-600 mb-4">
                  法人全体への貢献度を相対的に評価（既存ポイント制度活用）
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="corporate-points">現在の法人貢献ポイント</Label>
                  <Input
                    type="number"
                    id="corporate-points"
                    value={contributionPoints.corporate}
                    onChange={(e) => setContributionPoints(prev => ({...prev, corporate: parseInt(e.target.value) || 0}))}
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    法人研修参加、施設間応援、法人行事協力等
                  </p>
                </div>

                <div>
                  <Label htmlFor="corporate-percentile">法人内順位（パーセンタイル）</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      id="corporate-percentile"
                      value={corporateRank}
                      onChange={(e) => setCorporateRank(Math.max(0, Math.min(100, parseInt(e.target.value) || 50)))}
                      min="0"
                      max="100"
                    />
                    <span className="text-sm text-gray-600">%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    上位10%なら「10」と入力（小さい数値ほど高評価）
                  </p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">法人貢献点数</h4>
                  <div className="text-2xl font-bold text-orange-700">
                    {calculateContributionScore(corporateRank)} / 25点
                  </div>
                </div>

                <div>
                  <Label htmlFor="corporate-activities">主な貢献活動</Label>
                  <Textarea
                    id="corporate-activities"
                    placeholder="・法人研修への積極的参加
・他施設見学の受け入れ協力
・法人理念の実践
・施設間交流への参加"
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* 総合評価タブ */}
            <TabsContent value="summary" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">総合評価サマリー</h3>
                
                {/* 得点内訳 */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>評価項目</TableHead>
                      <TableHead>配点</TableHead>
                      <TableHead>取得点</TableHead>
                      <TableHead>達成率</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>技術評価（360度評価）</TableCell>
                      <TableCell>50点</TableCell>
                      <TableCell>{Math.round(calculateTechnicalScore() * 10) / 10}点</TableCell>
                      <TableCell>{Math.round(calculateTechnicalScore() * 2)}%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>施設貢献（相対評価）</TableCell>
                      <TableCell>25点</TableCell>
                      <TableCell>{calculateContributionScore(facilityRank)}点</TableCell>
                      <TableCell>{Math.round(calculateContributionScore(facilityRank) * 4)}%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>法人貢献（相対評価）</TableCell>
                      <TableCell>25点</TableCell>
                      <TableCell>{calculateContributionScore(corporateRank)}点</TableCell>
                      <TableCell>{Math.round(calculateContributionScore(corporateRank) * 4)}%</TableCell>
                    </TableRow>
                    <TableRow className="font-bold">
                      <TableCell>合計</TableCell>
                      <TableCell>100点</TableCell>
                      <TableCell className={getScoreColor(totalScore)}>{totalScore}点</TableCell>
                      <TableCell>{totalScore}%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                {/* 総合評価ランク */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">総合評価ランク</h4>
                  <div className="text-3xl font-bold">
                    {totalScore >= 90 ? 'S' :
                     totalScore >= 80 ? 'A' :
                     totalScore >= 70 ? 'B' :
                     totalScore >= 60 ? 'C' : 'D'}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {totalScore >= 90 ? '卓越した成果（法人表彰候補）' :
                     totalScore >= 80 ? '優秀な成果' :
                     totalScore >= 70 ? '良好な成果' :
                     totalScore >= 60 ? '標準的な成果' : '改善が必要'}
                  </p>
                </div>

                {/* 育成計画 */}
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">次期に向けた育成計画</h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="strengths">強み・伸ばすべき点</Label>
                      <Textarea
                        id="strengths"
                        placeholder="・認知症ケアへの理解と実践
・入居者との信頼関係構築
・チームワークへの貢献"
                        className="min-h-[100px]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="improvements">改善・成長が必要な点</Label>
                      <Textarea
                        id="improvements"
                        placeholder="・医療的ケアのスキル向上
・緊急時対応力の強化
・家族対応の経験を増やす"
                        className="min-h-[100px]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="next-goals">次期目標</Label>
                      <Textarea
                        id="next-goals"
                        placeholder="・認知症ケアの専門性を深める
・ユニットリーダーのサポート役として成長
・地域連携活動への参加"
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                </div>

                {/* 承認欄 */}
                <div className="mt-6 border-t pt-6">
                  <h4 className="font-semibold mb-3">承認</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="evaluator-sign">評価者署名</Label>
                      <Input type="text" id="evaluator-sign" />
                      <Input type="date" className="mt-2" />
                    </div>
                    <div>
                      <Label htmlFor="manager-sign">施設管理者署名</Label>
                      <Input type="text" id="manager-sign" />
                      <Input type="date" className="mt-2" />
                    </div>
                    <div>
                      <Label htmlFor="hr-sign">人事部署名</Label>
                      <Input type="text" id="hr-sign" />
                      <Input type="date" className="mt-2" />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-end space-x-2">
            <Button variant="outline">一時保存</Button>
            <Button>評価を確定</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}