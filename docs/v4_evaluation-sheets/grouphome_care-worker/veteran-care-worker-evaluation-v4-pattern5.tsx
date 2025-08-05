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
import { InfoIcon, Calculator, Award, Users, Building, Star, TrendingUp } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function VeteranCareWorkerEvaluationV4Pattern5() {
  // 評価項目の状態管理
  const [technicalScores, setTechnicalScores] = useState({
    superiorEval: { expertise: 0, leadership: 0, innovation: 0, management: 0 },
    selfEval: { expertise: 0, leadership: 0, innovation: 0, management: 0 }
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
            グループホーム ベテラン介護福祉士（11年以上） 人事評価シート v4.0
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            パターン5改良版 - 専門性リーダーシップと組織貢献を重視した評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              <strong>評価構成：</strong>技術評価（360度評価）50点 + 施設貢献（相対評価）25点 + 法人貢献（相対評価）25点
              <br />
              ベテラン職員として、高度な専門性と組織をけん引するリーダーシップ、後進育成への貢献を評価します
            </AlertDescription>
          </Alert>

          {/* スコア表示バー */}
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 via-blue-50 to-green-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-semibold flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-500" />
                現在の総合点数
              </span>
              <span className={`text-3xl font-bold ${getScoreColor(totalScore)}`}>
                {totalScore} / 100点
              </span>
            </div>
            <Progress value={totalScore} className="h-3" />
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Award className="h-4 w-4 mr-1 text-purple-600" />
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
                  <Input type="text" id="eval-period" placeholder="2024年4月～2025年3月" />
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
                    <Input type="text" id="corp-experience" placeholder="11年以上" readOnly />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="total-experience">総経験年数</Label>
                    <Input type="text" id="total-experience" placeholder="法人経験＋前職経験" />
                  </div>
                  <div>
                    <Label htmlFor="certifications">専門資格・認定</Label>
                    <Input type="text" id="certifications" placeholder="認知症ケア専門士、介護支援専門員等" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="current-role">現在の役職・役割</Label>
                    <Input type="text" id="current-role" placeholder="主任、ユニットリーダー、指導責任者等" />
                  </div>
                  <div>
                    <Label htmlFor="expertise-area">専門・得意領域</Label>
                    <Input type="text" id="expertise-area" placeholder="認知症ケア、ターミナルケア、家族支援等" />
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
                    <Label htmlFor="evaluator2">2次評価者（施設長・統括責任者）</Label>
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
                  ベテラン職員として期待される高度な専門性とリーダーシップを評価
                </p>
              </div>

              {/* 上司評価セクション */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-4 text-purple-600">管理者・上司評価（60％）</h4>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">1. 認知症ケアの専門性と指導力</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'expertise', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`superior-expertise-${grade}`} />
                            <Label htmlFor={`superior-expertise-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-gray-500 mt-1">
                      S:専門家レベルの実践と指導 A:高度な専門性 B:安定した専門実践 C:専門性向上要 D:専門性不足
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">2. チームリーダーシップと組織運営</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'leadership', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`superior-leadership-${grade}`} />
                            <Label htmlFor={`superior-leadership-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-gray-500 mt-1">
                      S:卓越したリーダーシップ A:優れた統率力 B:安定した指導 C:指導力向上要 D:リーダーシップ不足
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">3. 業務改善・イノベーション創出</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'innovation', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`superior-innovation-${grade}`} />
                            <Label htmlFor={`superior-innovation-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-gray-500 mt-1">
                      S:革新的改善の実現 A:効果的改善提案 B:改善への参画 C:改善意識低 D:現状維持志向
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">4. 危機管理・組織統制能力</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'management', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`superior-management-${grade}`} />
                            <Label htmlFor={`superior-management-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-gray-500 mt-1">
                      S:優れた危機対応力 A:適切な統制力 B:基本的管理 C:管理力向上要 D:管理能力不足
                    </p>
                  </div>
                </div>
              </div>

              {/* 本人評価セクション */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-4 text-green-600">本人評価（40％）</h4>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">1. 認知症ケアの専門性と指導力</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'expertise', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`self-expertise-${grade}`} />
                            <Label htmlFor={`self-expertise-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">2. チームリーダーシップと組織運営</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'leadership', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`self-leadership-${grade}`} />
                            <Label htmlFor={`self-leadership-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">3. 業務改善・イノベーション創出</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'innovation', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`self-innovation-${grade}`} />
                            <Label htmlFor={`self-innovation-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">4. 危機管理・組織統制能力</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'management', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`self-management-${grade}`} />
                            <Label htmlFor={`self-management-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              {/* ベテランとしての自己研鑽 */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <Label htmlFor="professional-development">専門性向上・継続学習の取り組み</Label>
                <Textarea 
                  id="professional-development" 
                  placeholder="研修・学会参加、資格取得、専門書籍学習、実践研究など"
                  className="min-h-[100px] mt-2"
                />
              </div>

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

            {/* 施設貢献評価タブ（25点）*/}
            <TabsContent value="facility" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">施設貢献評価（25点）- 組織貢献度ポイント</h3>
                <p className="text-sm text-gray-600 mb-4">
                  ベテラン職員として組織をけん引する重要な役割を評価
                </p>
              </div>

              {/* ポイント集計表 */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60%]">活動項目</TableHead>
                      <TableHead className="text-center">ポイント</TableHead>
                      <TableHead className="text-center">実績</TableHead>
                      <TableHead className="text-center">合計</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="bg-purple-50">
                      <TableCell className="font-semibold" colSpan={4}>リーダーシップ・指導</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">新人・ジュニア職員の指導統括</TableCell>
                      <TableCell className="text-center">15pt/月</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="12" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">180pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">ユニット会議の司会・運営</TableCell>
                      <TableCell className="text-center">8pt/回</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="12" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">96pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">困難事例のリーダー対応</TableCell>
                      <TableCell className="text-center">12pt/事例</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="8" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">96pt</TableCell>
                    </TableRow>
                    
                    <TableRow className="bg-blue-50">
                      <TableCell className="font-semibold" colSpan={4}>専門性発揮</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">ケアプラン作成・統括</TableCell>
                      <TableCell className="text-center">10pt/件</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="15" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">150pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">家族面談・相談対応統括</TableCell>
                      <TableCell className="text-center">8pt/回</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="20" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">160pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">認知症ケア研修講師</TableCell>
                      <TableCell className="text-center">25pt/回</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="4" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">100pt</TableCell>
                    </TableRow>
                    
                    <TableRow className="bg-green-50">
                      <TableCell className="font-semibold" colSpan={4}>組織運営</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">施設改善プロジェクトリーダー</TableCell>
                      <TableCell className="text-center">30pt/PJ</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="2" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">60pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">地域交流・ボランティア統括</TableCell>
                      <TableCell className="text-center">15pt/回</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="6" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">90pt</TableCell>
                    </TableRow>
                    
                    <TableRow className="bg-gray-50">
                      <TableCell colSpan={3} className="font-semibold">施設貢献ポイント合計</TableCell>
                      <TableCell className="text-center font-bold text-lg">932pt</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* 相対評価 */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">施設内相対評価（ベテラン職員間）</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="facility-rank">施設内順位</Label>
                    <div className="flex gap-2 mt-1">
                      <Input type="number" id="facility-rank" placeholder="2" className="w-20" />
                      <span className="self-center">位 /</span>
                      <Input type="number" placeholder="5" className="w-20" />
                      <span className="self-center">人中</span>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="facility-percentile">パーセンタイル</Label>
                    <div className="flex gap-2 mt-1">
                      <span className="self-center">上位</span>
                      <Input 
                        type="number" 
                        id="facility-percentile" 
                        value={facilityRank}
                        onChange={(e) => setFacilityRank(Number(e.target.value))}
                        className="w-20" 
                      />
                      <span className="self-center">％</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="font-semibold">施設貢献点数: </span>
                  <span className="text-2xl font-bold text-blue-600">
                    {calculateContributionScore(facilityRank)} / 25点
                  </span>
                </div>
              </div>

              {/* 組織への影響評価 */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3">組織への影響力・貢献の定性評価</h4>
                <Textarea 
                  placeholder="組織運営への影響、後進育成の成果、改善実績、専門性による施設の質向上への貢献など"
                  className="min-h-[120px]"
                />
              </div>
            </TabsContent>

            {/* 法人貢献タブ（25点）*/}
            <TabsContent value="corporate" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">法人貢献評価（25点）- 法人共通項目</h3>
                <p className="text-sm text-gray-600 mb-4">
                  ベテラン職員として法人全体をけん引する重要な役割を評価
                </p>
              </div>

              {/* ポイント集計表 */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60%]">活動項目</TableHead>
                      <TableHead className="text-center">ポイント</TableHead>
                      <TableHead className="text-center">実績</TableHead>
                      <TableHead className="text-center">合計</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="bg-yellow-50">
                      <TableCell className="font-semibold" colSpan={4}>法人教育・指導</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">法人新人研修講師</TableCell>
                      <TableCell className="text-center">30pt/日</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="6" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">180pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">法人中堅研修企画・講師</TableCell>
                      <TableCell className="text-center">40pt/回</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="3" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">120pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">他施設指導・コンサルティング</TableCell>
                      <TableCell className="text-center">25pt/回</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="8" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">200pt</TableCell>
                    </TableRow>
                    
                    <TableRow className="bg-green-50">
                      <TableCell className="font-semibold" colSpan={4}>法人運営・企画</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">法人委員会委員長・副委員長</TableCell>
                      <TableCell className="text-center">20pt/月</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="12" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">240pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">法人祭り企画・統括責任者</TableCell>
                      <TableCell className="text-center">50pt</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="1" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">50pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">法人広報・PR活動リーダー</TableCell>
                      <TableCell className="text-center">15pt/回</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="4" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">60pt</TableCell>
                    </TableRow>
                    
                    <TableRow className="bg-blue-50">
                      <TableCell className="font-semibold" colSpan={4}>専門性発信</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">学会発表・論文投稿</TableCell>
                      <TableCell className="text-center">60pt/回</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="1" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">60pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">外部研修・講演依頼対応</TableCell>
                      <TableCell className="text-center">30pt/回</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="3" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">90pt</TableCell>
                    </TableRow>
                    
                    <TableRow className="bg-gray-50">
                      <TableCell colSpan={3} className="font-semibold">法人貢献ポイント合計</TableCell>
                      <TableCell className="text-center font-bold text-lg">1000pt</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* 相対評価 */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">法人内相対評価（ベテラン職員全体）</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="corporate-rank">法人内順位（ベテラン職員）</Label>
                    <div className="flex gap-2 mt-1">
                      <Input type="number" id="corporate-rank" placeholder="3" className="w-20" />
                      <span className="self-center">位 /</span>
                      <Input type="number" placeholder="15" className="w-20" />
                      <span className="self-center">人中</span>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="corporate-percentile">パーセンタイル</Label>
                    <div className="flex gap-2 mt-1">
                      <span className="self-center">上位</span>
                      <Input 
                        type="number" 
                        id="corporate-percentile"
                        value={corporateRank}
                        onChange={(e) => setCorporateRank(Number(e.target.value))}
                        className="w-20" 
                      />
                      <span className="self-center">％</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="font-semibold">法人貢献点数: </span>
                  <span className="text-2xl font-bold text-green-600">
                    {calculateContributionScore(corporateRank)} / 25点
                  </span>
                </div>
              </div>

              {/* 法人への影響力 */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3">法人全体への影響力・将来貢献への期待</h4>
                <Textarea 
                  placeholder="法人理念の体現、組織文化の醸成、次世代リーダー育成、専門性による法人全体の質向上など"
                  className="min-h-[120px]"
                />
              </div>
            </TabsContent>

            {/* 総合評価タブ */}
            <TabsContent value="summary" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">総合評価サマリー</h3>
                
                {/* 総合スコア */}
                <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-green-50 p-6 rounded-lg text-center mb-6">
                  <div className="flex items-center justify-center mb-2">
                    <Star className="h-6 w-6 mr-2 text-yellow-500" />
                    <h4 className="text-xl font-semibold">最終評価点数</h4>
                  </div>
                  <p className={`text-5xl font-bold ${getScoreColor(totalScore)}`}>
                    {totalScore}点
                  </p>
                  <p className="text-gray-600 mt-2">100点満点</p>
                  
                  <div className="mt-4">
                    <span className="text-lg font-semibold">評価ランク: </span>
                    <span className={`text-2xl font-bold ${getScoreColor(totalScore)}`}>
                      {totalScore >= 90 ? 'S' : 
                       totalScore >= 80 ? 'A' : 
                       totalScore >= 70 ? 'B' : 
                       totalScore >= 60 ? 'C' : 'D'}
                    </span>
                  </div>
                </div>

                {/* 評価の内訳 */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2" />
                        専門性・リーダーシップ（50点）
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>技術評価（360度評価）</span>
                          <span className="font-bold">{Math.round(calculateTechnicalScore() * 10) / 10}点</span>
                        </div>
                        <Progress value={calculateTechnicalScore() * 2} className="h-2" />
                        <p className="text-xs text-gray-600 mt-2">
                          認知症ケア専門性、リーダーシップ、イノベーション、危機管理
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Users className="h-5 w-5 mr-2" />
                        組織貢献・影響力（50点）
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>施設貢献</span>
                          <span className="font-bold">{calculateContributionScore(facilityRank)}点</span>
                        </div>
                        <div className="flex justify-between">
                          <span>法人貢献</span>
                          <span className="font-bold">{calculateContributionScore(corporateRank)}点</span>
                        </div>
                        <Progress 
                          value={(calculateContributionScore(facilityRank) + calculateContributionScore(corporateRank)) * 2} 
                          className="h-2" 
                        />
                        <p className="text-xs text-gray-600 mt-2">
                          組織をけん引するリーダーシップ、後進育成、改善推進
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* ベテラン職員の評価段階 */}
                <div className="bg-purple-50 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Star className="h-5 w-5 mr-2 text-yellow-500" />
                    ベテラン職員としての評価段階
                  </h4>
                  {(() => {
                    if (totalScore >= 90) {
                      return (
                        <div>
                          <p className="text-sm mb-2">
                            <span className="font-semibold text-red-600">卓越したエキスパートリーダー:</span> 
                            法人を代表するリーダーとして他の模範となる存在
                          </p>
                          <ul className="text-sm list-disc list-inside">
                            <li>管理職・経営陣としての登用を検討</li>
                            <li>法人の顔として外部発信・代表業務</li>
                            <li>後継者育成プログラムの責任者</li>
                            <li>新規事業・施設立ち上げへの参画</li>
                          </ul>
                        </div>
                      );
                    } else if (totalScore >= 80) {
                      return (
                        <div>
                          <p className="text-sm mb-2">
                            <span className="font-semibold text-orange-600">優秀なリーダー職員:</span>
                            組織の中核として高い影響力を発揮
                          </p>
                          <ul className="text-sm list-disc list-inside">
                            <li>主任・管理職候補としての育成強化</li>
                            <li>法人内横断プロジェクトのリーダー</li>
                            <li>専門分野での権威確立支援</li>
                            <li>管理業務への段階的移行</li>
                          </ul>
                        </div>
                      );
                    } else if (totalScore >= 70) {
                      return (
                        <div>
                          <p className="text-sm mb-2">
                            <span className="font-semibold text-green-600">安定したベテラン職員:</span>
                            専門性を活かして安定した貢献を継続
                          </p>
                          <ul className="text-sm list-disc list-inside">
                            <li>専門分野でのさらなる深化を支援</li>
                            <li>リーダーシップスキルの向上</li>
                            <li>後進育成能力の強化</li>
                            <li>組織運営への参画拡大</li>
                          </ul>
                        </div>
                      );
                    } else if (totalScore >= 60) {
                      return (
                        <div>
                          <p className="text-sm mb-2">
                            <span className="font-semibold text-blue-600">成長支援が必要:</span>
                            ベテランとしての期待水準に向けた支援が必要
                          </p>
                          <ul className="text-sm list-disc list-inside">
                            <li>専門性向上のための集中的研修</li>
                            <li>リーダーシップ開発プログラム参加</li>
                            <li>役割・責任の明確化と段階的拡大</li>
                            <li>メンタリング・コーチング強化</li>
                          </ul>
                        </div>
                      );
                    } else {
                      return (
                        <div>
                          <p className="text-sm mb-2">
                            <span className="font-semibold text-gray-600">抜本的見直しが必要:</span>
                            ベテランとしての役割・適性の再評価が必要
                          </p>
                          <ul className="text-sm list-disc list-inside">
                            <li>適性と役割の根本的見直し</li>
                            <li>個別能力開発計画の策定</li>
                            <li>配置転換・役割変更の検討</li>
                            <li>専門性向上のための抜本的支援</li>
                          </ul>
                        </div>
                      );
                    }
                  })()}
                </div>

                {/* 総合コメント */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="leadership-achievements">リーダーシップ・専門性の発揮状況</Label>
                    <Textarea 
                      id="leadership-achievements" 
                      placeholder="組織への影響力、専門性の発揮、後進育成の成果、イノベーション創出など"
                      className="min-h-[120px]"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="growth-areas">さらなる向上への期待・課題</Label>
                    <Textarea 
                      id="growth-areas" 
                      placeholder="管理能力のさらなる向上、専門分野の深化、組織運営への参画拡大など"
                      className="min-h-[120px]"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="future-vision">将来への期待・キャリアビジョン</Label>
                    <Textarea 
                      id="future-vision" 
                      placeholder="管理職・経営陣への登用、専門家としての確立、法人発展への貢献など"
                      className="min-h-[120px]"
                    />
                  </div>
                </div>

                {/* 評価者サイン */}
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
                  <div>
                    <Label htmlFor="evaluator1-sign">1次評価者確認</Label>
                    <Input type="text" id="evaluator1-sign" placeholder="氏名・日付" />
                  </div>
                  <div>
                    <Label htmlFor="evaluator2-sign">2次評価者確認</Label>
                    <Input type="text" id="evaluator2-sign" placeholder="氏名・日付" />
                  </div>
                </div>

                {/* 本人確認 */}
                <div className="mt-4">
                  <Label htmlFor="employee-sign">本人確認</Label>
                  <Input type="text" id="employee-sign" placeholder="評価内容を確認しました（氏名・日付）" />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-4 mt-6">
            <Button variant="outline">
              <Calculator className="mr-2 h-4 w-4" />
              点数を再計算
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Star className="mr-2 h-4 w-4" />
              評価を保存
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}