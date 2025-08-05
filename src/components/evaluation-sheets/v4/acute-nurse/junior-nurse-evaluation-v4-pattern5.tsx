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

export default function JuniorNurseEvaluationV4Pattern5() {
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
            ジュニア看護師（2-3年目） 人事評価シート v4.0
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            パターン5改良版 - 実践力とチーム貢献を重視した評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              <strong>評価構成：</strong>技術評価（360度評価）50点 + 施設貢献（相対評価）25点 + 法人貢献（相対評価）25点
              <br />
              2-3年目は独立した実践能力に加え、チームへの積極的な貢献と後輩支援を評価します
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
                  <Label htmlFor="eval-period">評価期間</Label>
                  <Input type="text" id="eval-period" placeholder="2025年度" />
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
                    <Input type="text" id="corp-experience" placeholder="2年6ヶ月" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="previous-experience">前職経験</Label>
                    <Input type="text" id="previous-experience" placeholder="なし / 他病院○年（参考）" />
                  </div>
                  <div>
                    <Label htmlFor="total-experience">通算経験年数</Label>
                    <Input type="text" id="total-experience" placeholder="2年6ヶ月" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="department">所属病棟</Label>
                    <Input type="text" id="department" />
                  </div>
                  <div>
                    <Label htmlFor="role">現在の役割</Label>
                    <Input type="text" id="role" placeholder="新人サポーター / 委員会メンバー" />
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

            {/* 技術評価タブ（50点）- 360度評価 */}
            <TabsContent value="technical" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">技術評価（50点）- 360度評価</h3>
                <p className="text-sm text-gray-600 mb-4">
                  上司評価60％（30点）＋ 本人評価40％（20点）で算出
                  <br />
                  ジュニア看護師は独立した実践能力と応用力を重視
                </p>
              </div>

              {/* 上司評価セクション */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-4 text-blue-600">上司評価（60％）</h4>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">1. 看護技術の実践力</Label>
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
                      S:複雑な事例も独立対応 A:幅広く確実に実践 B:標準的な実践力 C:一部支援必要 D:実践力不足
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">2. 看護知識の深化と応用</Label>
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
                      S:専門的知識で指導可 A:幅広い知識を活用 B:必要な知識を保有 C:知識の深化が必要 D:基礎知識に課題
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">3. 患者ケアの質</Label>
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
                      S:卓越したケアで評価高 A:質の高いケア提供 B:適切なケア実施 C:ケアの質にばらつき D:改善が必要
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">4. リスク管理・判断力</Label>
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
                      S:リスク予見し予防 A:的確な判断と対応 B:安全に配慮した実践 C:判断に迷いあり D:リスク管理不足
                    </p>
                  </div>
                </div>
              </div>

              {/* 本人評価セクション */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-4 text-green-600">本人評価（40％）</h4>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">1. 看護技術の実践力</Label>
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
                    <Label className="text-sm font-medium">2. 看護知識の深化と応用</Label>
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
                    <Label className="text-sm font-medium">3. 患者ケアの質</Label>
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
                    <Label className="text-sm font-medium">4. リスク管理・判断力</Label>
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

              {/* 専門性開発 */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <Label htmlFor="specialty-development">専門性開発・今後の目標</Label>
                <Textarea 
                  id="specialty-development" 
                  placeholder="興味のある専門分野、習得を目指す技術、キャリア目標など"
                  className="min-h-[100px] mt-2"
                />
              </div>
            </TabsContent>

            {/* 施設貢献タブ（25点）*/}
            <TabsContent value="facility" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">施設貢献評価（25点）- 組織貢献度ポイント</h3>
                <p className="text-sm text-gray-600 mb-4">
                  チーム活動への参加、後輩支援、業務改善への貢献を評価
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
                      <TableCell>新人サポーター活動</TableCell>
                      <TableCell className="text-center">10pt</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="2" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">20pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>病棟勉強会開催・講師</TableCell>
                      <TableCell className="text-center">8pt/回</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="3" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">24pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>委員会活動（感染・医療安全等）</TableCell>
                      <TableCell className="text-center">5pt/回</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="12" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">60pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>業務改善提案・実施</TableCell>
                      <TableCell className="text-center">15pt</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="2" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">30pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>朝礼・申し送り参加（月平均）</TableCell>
                      <TableCell className="text-center">3pt/回</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="20" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">60pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>防災訓練参加</TableCell>
                      <TableCell className="text-center">5pt</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="2" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">10pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>急変対応・緊急時リーダー</TableCell>
                      <TableCell className="text-center">10pt/回</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="3" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">30pt</TableCell>
                    </TableRow>
                    <TableRow className="bg-gray-50">
                      <TableCell colSpan={3} className="font-semibold">施設貢献ポイント合計</TableCell>
                      <TableCell className="text-center font-bold text-lg">234pt</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* 相対評価 */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">施設内相対評価（ジュニア看護師間）</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="facility-rank">施設内順位</Label>
                    <div className="flex gap-2 mt-1">
                      <Input type="number" id="facility-rank" placeholder="12" className="w-20" />
                      <span className="self-center">位 /</span>
                      <Input type="number" placeholder="40" className="w-20" />
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

              {/* チーム貢献評価 */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3">チーム貢献・リーダーシップの定性評価</h4>
                <Textarea 
                  placeholder="チーム活動での役割、後輩指導の成果、業務改善の具体例など"
                  className="min-h-[100px]"
                />
              </div>
            </TabsContent>

            {/* 法人貢献タブ（25点）*/}
            <TabsContent value="corporate" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">法人貢献評価（25点）- 法人共通項目</h3>
                <p className="text-sm text-gray-600 mb-4">
                  法人活動への積極的な参加と貢献を評価
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
                      <TableCell className="font-semibold" colSpan={4}>イベント・文化活動</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">法人祭り踊り参加</TableCell>
                      <TableCell className="text-center">10pt</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="1" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">10pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">法人スポーツ大会参加</TableCell>
                      <TableCell className="text-center">8pt</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="1" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">8pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">法人広報誌寄稿</TableCell>
                      <TableCell className="text-center">5pt</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="1" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">5pt</TableCell>
                    </TableRow>
                    
                    <TableRow className="bg-green-50">
                      <TableCell className="font-semibold" colSpan={4}>学術・教育活動</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">院内研究発表</TableCell>
                      <TableCell className="text-center">15pt</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="1" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">15pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">法人研修参加</TableCell>
                      <TableCell className="text-center">5pt/回</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="4" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">20pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">他施設研修受け入れ支援</TableCell>
                      <TableCell className="text-center">10pt</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="2" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">20pt</TableCell>
                    </TableRow>
                    
                    <TableRow className="bg-blue-50">
                      <TableCell className="font-semibold" colSpan={4}>組織横断活動</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">他施設支援・ヘルプ</TableCell>
                      <TableCell className="text-center">20pt/日</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="2" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">40pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">法人プロジェクト参加</TableCell>
                      <TableCell className="text-center">15pt</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="1" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">15pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">BCP訓練参加</TableCell>
                      <TableCell className="text-center">10pt</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="1" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">10pt</TableCell>
                    </TableRow>
                    
                    <TableRow className="bg-gray-50">
                      <TableCell colSpan={3} className="font-semibold">法人貢献ポイント合計</TableCell>
                      <TableCell className="text-center font-bold text-lg">143pt</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* 相対評価 */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">法人内相対評価（ジュニア看護師全体）</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="corporate-rank">法人内順位（ジュニア看護師）</Label>
                    <div className="flex gap-2 mt-1">
                      <Input type="number" id="corporate-rank" placeholder="50" className="w-20" />
                      <span className="self-center">位 /</span>
                      <Input type="number" placeholder="150" className="w-20" />
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

              {/* 法人活動への姿勢 */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3">法人理念の実践・組織横断的活動</h4>
                <Textarea 
                  placeholder="法人活動での具体的な貢献、他施設との連携、法人理念の体現など"
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
                          実践力、知識応用、ケアの質、リスク管理
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
                          チーム活動、後輩支援、法人活動参加
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* ジュニア看護師の成長評価 */}
                <div className="bg-yellow-50 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold mb-2">ジュニア看護師としての成長評価</h4>
                  {totalScore >= 80 ? (
                    <div>
                      <p className="text-sm mb-2">
                        <span className="font-semibold">次期リーダー候補:</span> 
                        優れた実践力と貢献度を示している。中堅看護師への移行準備完了
                      </p>
                      <ul className="text-sm list-disc list-inside">
                        <li>プリセプター役割への登用を検討</li>
                        <li>専門分野の深化を支援</li>
                        <li>リーダーシップ研修への参加推奨</li>
                      </ul>
                    </div>
                  ) : totalScore >= 70 ? (
                    <div>
                      <p className="text-sm mb-2">
                        <span className="font-semibold">順調な成長:</span>
                        独立した実践ができており、チーム貢献も良好
                      </p>
                      <ul className="text-sm list-disc list-inside">
                        <li>より複雑な業務への挑戦を促進</li>
                        <li>委員会活動での中心的役割</li>
                        <li>後輩指導の機会を増やす</li>
                      </ul>
                    </div>
                  ) : totalScore >= 60 ? (
                    <div>
                      <p className="text-sm mb-2">
                        <span className="font-semibold">標準的な成長:</span>
                        基本的な実践は可能だが、さらなる成長余地あり
                      </p>
                      <ul className="text-sm list-disc list-inside">
                        <li>実践力の向上に注力</li>
                        <li>チーム活動への積極的参加を促す</li>
                        <li>メンターによる継続支援</li>
                      </ul>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm mb-2">
                        <span className="font-semibold">要支援:</span>
                        2-3年目として期待される水準に達していない
                      </p>
                      <ul className="text-sm list-disc list-inside">
                        <li>基礎技術の再確認と強化</li>
                        <li>個別指導計画の策定</li>
                        <li>適性の再評価も視野に</li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* 人事活用提案 */}
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold mb-2">人事活用提案</h4>
                  {(() => {
                    const techScore = calculateTechnicalScore();
                    const contribScore = calculateContributionScore(facilityRank) + calculateContributionScore(corporateRank);
                    
                    if (techScore >= 40 && contribScore >= 40) {
                      return (
                        <p className="text-sm">
                          技術・貢献ともに高水準。次期プリセプター候補、専門チーム配属を検討
                        </p>
                      );
                    } else if (techScore >= 40) {
                      return (
                        <p className="text-sm">
                          技術力は高いが組織活動参加が少ない。チーム活動への参画機会を増やす
                        </p>
                      );
                    } else if (contribScore >= 40) {
                      return (
                        <p className="text-sm">
                          貢献意欲は高いが技術面に課題。スキルアップ研修を優先的に受講
                        </p>
                      );
                    } else {
                      return (
                        <p className="text-sm">
                          全体的に成長支援が必要。メンター制度の活用と段階的な目標設定
                        </p>
                      );
                    }
                  })()}
                </div>

                {/* 総合コメント */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="strengths">強み・優れている点</Label>
                    <Textarea 
                      id="strengths" 
                      placeholder="独立した実践力、チーム貢献、後輩への良い影響など"
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="improvements">改善点・成長課題</Label>
                    <Textarea 
                      id="improvements" 
                      placeholder="さらなるスキルアップが必要な領域、リーダーシップ開発など"
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="next-goals">次期目標・キャリアプラン</Label>
                    <Textarea 
                      id="next-goals" 
                      placeholder="中堅看護師への成長目標、専門分野の選択、リーダー役割への準備など"
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