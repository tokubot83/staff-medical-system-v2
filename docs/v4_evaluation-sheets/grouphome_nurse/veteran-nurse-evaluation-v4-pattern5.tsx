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
import { InfoIcon, Calculator, Award, Users, Building, Home, Star } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function GrouphomeVeteranNurseEvaluationV4Pattern5() {
  // 評価項目の状態管理
  const [technicalScores, setTechnicalScores] = useState({
    superiorEval: { mastery: 0, strategicLeadership: 0, mentorship: 0, organizationalImpact: 0 },
    selfEval: { mastery: 0, strategicLeadership: 0, mentorship: 0, organizationalImpact: 0 }
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
            グループホーム ベテラン看護師（11年以上） 人事評価シート v4.0
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            パターン5改良版 - 専門性の極致と組織への戦略的貢献を重視した評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Star className="h-4 w-4" />
            <AlertDescription>
              <strong>評価構成：</strong>技術評価（360度評価）50点 + 施設貢献（相対評価）25点 + 法人貢献（相対評価）25点
              <br />
              ベテラン看護師は卓越した専門性と組織全体への戦略的貢献を重点的に評価します
            </AlertDescription>
          </Alert>

          {/* スコア表示バー */}
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-gold-50 rounded-lg">
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
                    <Label htmlFor="hire-date">入職年月日</Label>
                    <Input type="date" id="hire-date" />
                  </div>
                  <div>
                    <Label htmlFor="corp-experience">法人経験年数</Label>
                    <Input type="text" id="corp-experience" placeholder="11年以上" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="position">役職・ポジション</Label>
                    <Input type="text" id="position" placeholder="主任 / 師長補佐 / 管理者候補等" />
                  </div>
                  <div>
                    <Label htmlFor="unit">配属ユニット・担当領域</Label>
                    <Input type="text" id="unit" placeholder="○○ユニット・全体統括" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="certifications">保有資格・専門研修</Label>
                    <Input type="text" id="certifications" placeholder="認知症ケア指導者研修、介護支援専門員等" />
                  </div>
                  <div>
                    <Label htmlFor="leadership-role">組織内リーダーシップ役割</Label>
                    <Input type="text" id="leadership-role" placeholder="教育委員長、品質管理責任者等" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">評価者情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="evaluator1">1次評価者（管理者・施設長）</Label>
                    <Input type="text" id="evaluator1" />
                  </div>
                  <div>
                    <Label htmlFor="evaluator2">2次評価者（法人役員・統括責任者）</Label>
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
                  ベテラン看護師は卓越した専門性と戦略的リーダーシップを重視
                </p>
              </div>

              {/* 上司評価セクション */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-4 text-blue-600">管理者・法人役員評価（60％）</h4>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">1. 認知症ケアの専門性の極致</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'mastery', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`superior-mastery-${grade}`} />
                            <Label htmlFor={`superior-mastery-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-gray-500 mt-1">
                      S:業界のリーダー A:専門家レベル B:熟練レベル C:継続向上必要 D:要再教育
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">2. 戦略的リーダーシップと組織変革</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'strategicLeadership', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`superior-strategic-${grade}`} />
                            <Label htmlFor={`superior-strategic-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-gray-500 mt-1">
                      S:変革的リーダー A:戦略的リーダー B:安定的リーダー C:支援的リーダー D:リーダー不適
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">3. 人材育成とメンターシップ</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'mentorship', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`superior-mentor-${grade}`} />
                            <Label htmlFor={`superior-mentor-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-gray-500 mt-1">
                      S:卓越したメンター A:優秀なメンター B:標準的メンター C:要メンター能力向上 D:メンター不適
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">4. 組織への戦略的影響力</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'organizationalImpact', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`superior-impact-${grade}`} />
                            <Label htmlFor={`superior-impact-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-gray-500 mt-1">
                      S:組織変革の推進力 A:重要な影響力 B:安定的影響力 C:限定的影響力 D:影響力不足
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <Label htmlFor="superior-comments">上司からのコメント</Label>
                  <Textarea
                    id="superior-comments"
                    placeholder="専門性、戦略的貢献、後継者育成、組織への影響など"
                    className="min-h-[100px]"
                  />
                </div>
              </div>

              {/* 本人評価セクション */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-4 text-green-600">本人評価（40％）</h4>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">1. 認知症ケアの専門性の極致</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'mastery', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`self-mastery-${grade}`} />
                            <Label htmlFor={`self-mastery-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">2. 戦略的リーダーシップと組織変革</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'strategicLeadership', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`self-strategic-${grade}`} />
                            <Label htmlFor={`self-strategic-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">3. 人材育成とメンターシップ</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'mentorship', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`self-mentor-${grade}`} />
                            <Label htmlFor={`self-mentor-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">4. 組織への戦略的影響力</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'organizationalImpact', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`self-impact-${grade}`} />
                            <Label htmlFor={`self-impact-${grade}`} className="font-normal">{grade}</Label>
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
                    placeholder="専門家としての到達点、組織への影響、後進への貢献、今後のビジョンなど"
                    className="min-h-[100px]"
                  />
                </div>
              </div>

              {/* 技術評価サマリー */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">技術評価点数</h4>
                <div className="text-2xl font-bold text-purple-700">
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
                    戦略的リーダーシップ、組織改革、人材育成システム構築等
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
                    placeholder="・施設全体のケア品質向上プログラム設計・実施
・新人〜中堅職員の体系的教育プログラム構築
・家族満足度向上プロジェクトの推進
・地域包括ケアシステムとの連携強化
・認知症ケアの質的評価システム導入
・施設運営の効率化と業務改善（○件実施）
・危機管理・BCP策定への中心的関与"
                    className="min-h-[140px]"
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
                    法人戦略への参画、業界活動、研究・発表、標準化推進等
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
                    placeholder="・法人認知症ケア標準化プロジェクトリーダー
・法人全体の人材育成体系構築への参画
・外部研修・学会での法人代表としての発表（○回）
・業界団体・行政委員会への参加・貢献
・法人内グループホーム運営標準化の推進
・新規事業所開設時の立ち上げ支援
・法人のブランド価値向上への貢献
・後進管理者候補の育成プログラム設計"
                    className="min-h-[140px]"
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
                    {totalScore >= 90 ? '卓越した成果（法人表彰・業界貢献候補）' :
                     totalScore >= 80 ? '優秀な成果（昇進・昇格候補）' :
                     totalScore >= 70 ? '良好な成果' :
                     totalScore >= 60 ? '標準的な成果' : '改善が必要'}
                  </p>
                </div>

                {/* 育成・活用計画 */}
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">次期に向けた活用・発展計画</h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="strengths">卓越した強み・さらに活用すべき点</Label>
                      <Textarea
                        id="strengths"
                        placeholder="・業界トップクラスの認知症ケア専門性
・組織変革を推進する戦略的リーダーシップ
・後進育成における卓越したメンターシップ
・法人全体への影響力と外部ネットワーク"
                        className="min-h-[100px]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="developments">さらなる発展・挑戦領域</Label>
                      <Textarea
                        id="developments"
                        placeholder="・次世代リーダー育成システムの確立
・業界標準の開発・普及への貢献
・ICT・DXを活用した革新的ケアモデル開発"
                        className="min-h-[100px]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="next-goals">次期戦略目標</Label>
                      <Textarea
                        id="next-goals"
                        placeholder="・管理職・役員候補としての準備
・業界団体での活動拡大
・研究・学術活動への本格参画
・法人の次世代戦略策定への参画
・地域包括ケアシステムの中核人材として活動"
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