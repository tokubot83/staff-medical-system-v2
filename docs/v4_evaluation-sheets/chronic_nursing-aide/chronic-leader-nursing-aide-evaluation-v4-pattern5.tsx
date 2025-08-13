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
import { InfoIcon, Calculator, Award, Users, Building, Crown } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ChronicLeaderNursingAideEvaluationV4Pattern5() {
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

  const handleTechnicalScoreChange = (evaluator: keyof typeof technicalScores, category: string, grade: string) => {
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
            慢性期医療 看護補助者リーダー 人事評価シート v4.0
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            パターン5改良版 - 療養ケアチームの統括と質向上への貢献を評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              <strong>評価構成：</strong>技術評価（360度評価）50点 + 施設貢献（相対評価）25点 + 法人貢献（相対評価）25点
              <br />
              看護補助者チームのリーダーとして、療養ケアの品質管理とスタッフ育成を重視した評価を行います
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
                  <Label htmlFor="eval-period">評価期</Label>
                  <Input type="text" id="eval-period" placeholder="2024年度 上期/下期" />
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
                    <Input type="text" id="corp-experience" placeholder="10年（リーダー3年）" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="qualification">保有資格</Label>
                    <Input type="text" id="qualification" placeholder="介護福祉士 / 認知症ケア専門士" />
                  </div>
                  <div>
                    <Label htmlFor="team-size">管理スタッフ数</Label>
                    <Input type="text" id="team-size" placeholder="看護補助者10名" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="department">配属病棟</Label>
                    <Input type="text" id="department" placeholder="医療療養病棟 / 介護医療院" />
                  </div>
                  <div>
                    <Label htmlFor="role">現在の役割</Label>
                    <Input type="text" id="role" placeholder="看護補助者リーダー" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">評価者情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="evaluator1">1次評価者（主任・師長）</Label>
                    <Input type="text" id="evaluator1" />
                  </div>
                  <div>
                    <Label htmlFor="evaluator2">2次評価者（看護部長等）</Label>
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
                  リーダーとしてチーム管理能力と品質管理を重視
                </p>
              </div>

              {/* 上司評価セクション */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-4 text-blue-600">上司評価（60％）</h4>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">1. 看護補助者チームの管理・運営</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'skills', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`superior-skills-${grade}`} />
                            <Label htmlFor={`superior-skills-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-gray-500 mt-1">
                      S:卓越した管理で生産性最大化 A:効果的運営で高成果 B:適切な管理業務 C:課題あり D:支障あり
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">2. 療養生活援助の品質管理</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'knowledge', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`superior-knowledge-${grade}`} />
                            <Label htmlFor={`superior-knowledge-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-gray-500 mt-1">
                      S:独自システムで大幅向上 A:高水準維持 B:標準的管理 C:改善余地 D:不十分で影響
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">3. スタッフの育成と能力開発</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'patient', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`superior-patient-${grade}`} />
                            <Label htmlFor={`superior-patient-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-gray-500 mt-1">
                      S:革新的育成で飛躍的向上 A:体系的指導で多数育成 B:適切な指導 C:不十分 D:機能せず
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">4. 他職種連携と組織貢献</Label>
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
                      S:連携の要で質向上主導 A:積極的連携で大貢献 B:適切な連携 C:限定的 D:連携不足
                    </p>
                  </div>
                </div>
              </div>

              {/* 本人評価セクション */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-4 text-green-600">本人評価（40％）</h4>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">1. 看護補助者チームの管理・運営</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'skills', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`self-skills-${grade}`} />
                            <Label htmlFor={`self-skills-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">2. 療養生活援助の品質管理</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'knowledge', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`self-knowledge-${grade}`} />
                            <Label htmlFor={`self-knowledge-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">3. スタッフの育成と能力開発</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'patient', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`self-patient-${grade}`} />
                            <Label htmlFor={`self-patient-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">4. 他職種連携と組織貢献</Label>
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
              </div>

              {/* 自己振り返り */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <Label htmlFor="self-reflection">リーダーとしての自己評価</Label>
                <Textarea 
                  id="self-reflection" 
                  placeholder="チーム管理での工夫、品質向上への取り組み、スタッフ育成の成果、今後の課題など"
                  className="min-h-[100px] mt-2"
                />
              </div>
            </TabsContent>

            {/* 施設貢献タブ（25点）*/}
            <TabsContent value="facility" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">施設貢献評価（25点）- 組織貢献度ポイント</h3>
                <p className="text-sm text-gray-600 mb-4">
                  チーム管理能力と組織への貢献を評価
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
                    <TableRow>
                      <TableCell>看護補助者チーム管理</TableCell>
                      <TableCell className="text-center">20pt/月</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="6" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">120pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>スタッフ育成計画策定・実施</TableCell>
                      <TableCell className="text-center">30pt/件</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="2" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">60pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>業務改善・効率化主導</TableCell>
                      <TableCell className="text-center">25pt/件</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="3" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">75pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>品質管理システム構築</TableCell>
                      <TableCell className="text-center">40pt/件</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="1" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">40pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>新人教育プログラム運営</TableCell>
                      <TableCell className="text-center">20pt/人</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="4" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">80pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>委員会活動（委員長・副委員長）</TableCell>
                      <TableCell className="text-center">15pt/回</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="6" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">90pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>他部署との連携プロジェクト</TableCell>
                      <TableCell className="text-center">20pt/件</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="2" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">40pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>緊急時対応統括</TableCell>
                      <TableCell className="text-center">15pt/回</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="3" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">45pt</TableCell>
                    </TableRow>
                    <TableRow className="bg-gray-50">
                      <TableCell colSpan={3} className="font-semibold">施設貢献ポイント合計</TableCell>
                      <TableCell className="text-center font-bold text-lg">550pt</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* 相対評価 */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">施設内相対評価（リーダー職間）</h4>
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

              {/* 定性評価 */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3">管理実績・組織貢献の定性評価</h4>
                <Textarea 
                  placeholder="チーム管理の成果、スタッフ育成の実績、品質向上への貢献、組織への影響力など"
                  className="min-h-[100px]"
                />
              </div>
            </TabsContent>

            {/* 法人貢献タブ（25点）*/}
            <TabsContent value="corporate" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">法人貢献評価（25点）- 法人共通項目</h3>
                <p className="text-sm text-gray-600 mb-4">
                  リーダーとして法人全体への貢献と専門性発揮を評価
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
                      <TableCell className="font-semibold" colSpan={4}>リーダーシップ・組織運営</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">法人委員会委員長</TableCell>
                      <TableCell className="text-center">40pt</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="1" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">40pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">法人イベント実行委員長</TableCell>
                      <TableCell className="text-center">35pt</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="1" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">35pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">法人横断プロジェクトリーダー</TableCell>
                      <TableCell className="text-center">50pt</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="1" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">50pt</TableCell>
                    </TableRow>
                    
                    <TableRow className="bg-green-50">
                      <TableCell className="font-semibold" colSpan={4}>専門性向上・教育貢献</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">介護福祉士実習指導者</TableCell>
                      <TableCell className="text-center">30pt/期</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="2" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">60pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">法人研修講師（リーダー研修）</TableCell>
                      <TableCell className="text-center">25pt/回</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="3" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">75pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">外部研修発表（学会・研究会）</TableCell>
                      <TableCell className="text-center">40pt/回</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="1" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">40pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">専門資格取得（認知症ケア専門士等）</TableCell>
                      <TableCell className="text-center">60pt</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="1" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">60pt</TableCell>
                    </TableRow>
                    
                    <TableRow className="bg-blue-50">
                      <TableCell className="font-semibold" colSpan={4}>法人標準化・品質向上</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">ケア標準化マニュアル作成</TableCell>
                      <TableCell className="text-center">35pt/件</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="2" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">70pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">他施設指導・技術支援</TableCell>
                      <TableCell className="text-center">20pt/回</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="4" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">80pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">QC活動成果発表（法人大会）</TableCell>
                      <TableCell className="text-center">30pt</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="1" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">30pt</TableCell>
                    </TableRow>
                    
                    <TableRow className="bg-gray-50">
                      <TableCell colSpan={3} className="font-semibold">法人貢献ポイント合計</TableCell>
                      <TableCell className="text-center font-bold text-lg">590pt</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* 相対評価 */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">法人内相対評価（看護補助者リーダー全体）</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="corporate-rank">法人内順位</Label>
                    <div className="flex gap-2 mt-1">
                      <Input type="number" id="corporate-rank" placeholder="5" className="w-20" />
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

              {/* 法人レベルでの貢献 */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3">法人レベルでの品質向上貢献</h4>
                <Textarea 
                  placeholder="法人標準化への貢献、他施設支援の成果、教育活動での影響、専門性発揮など"
                  className="min-h-[100px]"
                />
              </div>
            </TabsContent>

            {/* 総合評価タブ */}
            <TabsContent value="summary" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">総合評価サマリー</h3>
                
                {/* 総合スコア */}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg text-center mb-6">
                  <h4 className="text-xl font-semibold mb-2">最終評価点数</h4>
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
                      <CardTitle className="text-lg">個人の実力（50点）</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>技術評価（360度評価）</span>
                          <span className="font-bold">{Math.round(calculateTechnicalScore() * 10) / 10}点</span>
                        </div>
                        <Progress value={calculateTechnicalScore() * 2} className="h-2" />
                        <p className="text-xs text-gray-600 mt-2">
                          チーム管理、品質管理、スタッフ育成、連携力
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">組織への貢献（50点）</CardTitle>
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
                          管理実績、組織運営、法人標準化
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* リーダーとしての成長段階評価 */}
                <div className="bg-yellow-50 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Crown className="h-5 w-5 mr-2" />
                    看護補助者リーダーとしての成長段階
                  </h4>
                  {(() => {
                    if (totalScore >= 80) {
                      return (
                        <div>
                          <p className="text-sm mb-2">
                            <span className="font-semibold">エグゼクティブリーダー:</span> 
                            卓越した管理能力と組織貢献。次期管理職候補として期待大
                          </p>
                          <ul className="text-sm list-disc list-inside">
                            <li>チーム管理と品質向上で優れた成果</li>
                            <li>法人レベルでの標準化・教育に貢献</li>
                            <li>管理職への昇格を積極検討</li>
                          </ul>
                        </div>
                      );
                    } else if (totalScore >= 70) {
                      return (
                        <div>
                          <p className="text-sm mb-2">
                            <span className="font-semibold">優秀なリーダー:</span>
                            期待通りの活躍。組織の要として機能
                          </p>
                          <ul className="text-sm list-disc list-inside">
                            <li>安定したチーム運営と育成実績</li>
                            <li>更なるマネジメントスキル向上を支援</li>
                            <li>法人横断的な活動機会を拡大</li>
                          </ul>
                        </div>
                      );
                    } else if (totalScore >= 60) {
                      return (
                        <div>
                          <p className="text-sm mb-2">
                            <span className="font-semibold">標準的リーダー:</span>
                            基本的な役割は果たしているが、更なる成長余地あり
                          </p>
                          <ul className="text-sm list-disc list-inside">
                            <li>リーダーシップスキルの強化が必要</li>
                            <li>品質管理・育成能力の向上を支援</li>
                            <li>メンタリングによる成長促進</li>
                          </ul>
                        </div>
                      );
                    } else {
                      return (
                        <div>
                          <p className="text-sm mb-2">
                            <span className="font-semibold">要支援:</span>
                            リーダーとして期待される水準に未達
                          </p>
                          <ul className="text-sm list-disc list-inside">
                            <li>基本的な管理スキルの再確認</li>
                            <li>役割の見直しと適性評価</li>
                            <li>集中的な支援プログラムの実施</li>
                          </ul>
                        </div>
                      );
                    }
                  })()}
                </div>

                {/* 総合コメント */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="strengths">リーダーとしての強み</Label>
                    <Textarea 
                      id="strengths" 
                      placeholder="チーム統率力、品質管理能力、問題解決力、育成実績など"
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="improvements">今後の成長課題</Label>
                    <Textarea 
                      id="improvements" 
                      placeholder="より高度な管理スキル、戦略的思考、組織変革力など"
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="next-term-goals">次期目標とキャリアビジョン</Label>
                    <Textarea 
                      id="next-term-goals" 
                      placeholder="療養ケアの標準化、スタッフ定着率向上、新人育成システムの構築、管理職への挑戦など"
                      className="min-h-[100px]"
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
            <Button>
              評価を保存
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}