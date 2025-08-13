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
import { InfoIcon, Calculator, Award, Users, Building, HandHeart } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ChronicJuniorNursingAideEvaluationV4Pattern5() {
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
            慢性期医療 2・3年目看護補助者 人事評価シート v4.0
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            パターン5改良版 - 療養ケアの実践力向上と自立した業務遂行を評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              <strong>評価構成：</strong>技術評価（360度評価）50点 + 施設貢献（相対評価）25点 + 法人貢献（相対評価）25点
              <br />
              療養生活支援の確実な実践と、新人指導への参加を重視した評価を行います
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
                    <Input type="text" id="corp-experience" placeholder="2年3ヶ月" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="previous-experience">前職経験</Label>
                    <Input type="text" id="previous-experience" placeholder="介護施設○年（参考）" />
                  </div>
                  <div>
                    <Label htmlFor="qualification">保有資格</Label>
                    <Input type="text" id="qualification" placeholder="介護職員初任者研修 / 実務者研修" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="department">配属病棟</Label>
                    <Input type="text" id="department" placeholder="医療療養病棟 / 介護医療院" />
                  </div>
                  <div>
                    <Label htmlFor="mentor">メンター</Label>
                    <Input type="text" id="mentor" placeholder="先輩職員名" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">評価者情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="evaluator1">1次評価者（主任・リーダー）</Label>
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
                  2・3年目は確実な技術実践と自立した業務遂行を重視
                </p>
              </div>

              {/* 上司評価セクション */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-4 text-blue-600">上司評価（60％）</h4>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">1. 療養生活援助の実践力</Label>
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
                      S:高度な援助技術で個別対応 A:確実で丁寧な援助 B:標準的実施 C:改善余地あり D:要指導
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">2. 認知症・重度要介護者への対応</Label>
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
                      S:専門的対応で困難事例も解決 A:個別性ある関わり B:基本的対応 C:戸惑いあり D:要支援
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">3. 患者・家族との信頼関係構築</Label>
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
                      S:深い信頼関係で療養生活を支援 A:温かく丁寧な関わり B:標準的対応 C:改善必要 D:要指導
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">4. 観察力と報告・連絡・相談</Label>
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
                      S:鋭い観察で早期発見・的確報告 A:細やかな観察と適切報告 B:基本的実践 C:漏れあり D:不十分
                    </p>
                  </div>
                </div>
              </div>

              {/* 本人評価セクション */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-4 text-green-600">本人評価（40％）</h4>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">1. 療養生活援助の実践力</Label>
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
                    <Label className="text-sm font-medium">2. 認知症・重度要介護者への対応</Label>
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
                    <Label className="text-sm font-medium">3. 患者・家族との信頼関係構築</Label>
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
                    <Label className="text-sm font-medium">4. 観察力と報告・連絡・相談</Label>
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
                <Label htmlFor="self-reflection">自己振り返り・成長実感</Label>
                <Textarea 
                  id="self-reflection" 
                  placeholder="1年目からの成長点、自立した業務遂行での工夫、認知症ケアでの学びなど"
                  className="min-h-[100px] mt-2"
                />
              </div>
            </TabsContent>

            {/* 施設貢献タブ（25点）*/}
            <TabsContent value="facility" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">施設貢献評価（25点）- 組織貢献度ポイント</h3>
                <p className="text-sm text-gray-600 mb-4">
                  療養チームでの役割拡大と新人指導への貢献を評価
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
                      <TableCell>朝礼・申し送り出席（月平均）</TableCell>
                      <TableCell className="text-center">2pt/回</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="22" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">44pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>新人指導サポート</TableCell>
                      <TableCell className="text-center">8pt/回</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="6" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">48pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>療養活動の企画・実施</TableCell>
                      <TableCell className="text-center">10pt/回</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="4" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">40pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>病棟勉強会参加</TableCell>
                      <TableCell className="text-center">3pt/回</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="8" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">24pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>委員会活動参加</TableCell>
                      <TableCell className="text-center">5pt/回</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="4" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">20pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>業務改善提案</TableCell>
                      <TableCell className="text-center">15pt/件</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="2" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">30pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>環境整備リーダー</TableCell>
                      <TableCell className="text-center">5pt/月</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="3" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">15pt</TableCell>
                    </TableRow>
                    <TableRow className="bg-gray-50">
                      <TableCell colSpan={3} className="font-semibold">施設貢献ポイント合計</TableCell>
                      <TableCell className="text-center font-bold text-lg">221pt</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* 相対評価 */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">施設内相対評価（2・3年目看護補助者間）</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="facility-rank">施設内順位</Label>
                    <div className="flex gap-2 mt-1">
                      <Input type="number" id="facility-rank" placeholder="8" className="w-20" />
                      <span className="self-center">位 /</span>
                      <Input type="number" placeholder="20" className="w-20" />
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
                <h4 className="font-semibold mb-3">自立性・指導力の定性評価</h4>
                <Textarea 
                  placeholder="自立した業務遂行の具体例、新人への関わり方、療養活動での創意工夫など"
                  className="min-h-[100px]"
                />
              </div>
            </TabsContent>

            {/* 法人貢献タブ（25点）*/}
            <TabsContent value="corporate" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">法人貢献評価（25点）- 法人共通項目</h3>
                <p className="text-sm text-gray-600 mb-4">
                  2・3年目として法人活動への積極的な参加を評価
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
                      <TableCell className="pl-8">法人祭り企画・運営参加</TableCell>
                      <TableCell className="text-center">15pt</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="1" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">15pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">法人スポーツ大会参加</TableCell>
                      <TableCell className="text-center">5pt</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="1" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">5pt</TableCell>
                    </TableRow>
                    
                    <TableRow className="bg-green-50">
                      <TableCell className="font-semibold" colSpan={4}>学習・研修活動</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">認知症ケア専門研修</TableCell>
                      <TableCell className="text-center">15pt</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="1" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">15pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">介護技術向上研修</TableCell>
                      <TableCell className="text-center">10pt</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="2" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">20pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">法人接遇研修（アドバンス）</TableCell>
                      <TableCell className="text-center">8pt</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="1" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">8pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">外部研修参加</TableCell>
                      <TableCell className="text-center">12pt/回</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="1" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">12pt</TableCell>
                    </TableRow>
                    
                    <TableRow className="bg-blue-50">
                      <TableCell className="font-semibold" colSpan={4}>組織活動</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">法人QC活動参加</TableCell>
                      <TableCell className="text-center">20pt</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="1" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">20pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">他施設応援・交流</TableCell>
                      <TableCell className="text-center">10pt/回</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="2" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">20pt</TableCell>
                    </TableRow>
                    
                    <TableRow className="bg-gray-50">
                      <TableCell colSpan={3} className="font-semibold">法人貢献ポイント合計</TableCell>
                      <TableCell className="text-center font-bold text-lg">115pt</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* 相対評価 */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">法人内相対評価（2・3年目看護補助者全体）</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="corporate-rank">法人内順位</Label>
                    <div className="flex gap-2 mt-1">
                      <Input type="number" id="corporate-rank" placeholder="25" className="w-20" />
                      <span className="self-center">位 /</span>
                      <Input type="number" placeholder="60" className="w-20" />
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

              {/* 法人理念実践 */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3">法人理念の実践と専門性向上</h4>
                <Textarea 
                  placeholder="法人理念の日常実践、研修での学びの活用、他施設との交流成果など"
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
                          療養援助技術、認知症対応、信頼関係、観察力
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
                          自立性、新人指導、法人活動参加
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* 2・3年目としての成長段階評価 */}
                <div className="bg-yellow-50 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <HandHeart className="h-5 w-5 mr-2" />
                    2・3年目看護補助者としての成長段階
                  </h4>
                  {(() => {
                    if (totalScore >= 80) {
                      return (
                        <div>
                          <p className="text-sm mb-2">
                            <span className="font-semibold">リーダー候補:</span> 
                            優れた実践力と指導力を発揮。将来のリーダーとして期待大
                          </p>
                          <ul className="text-sm list-disc list-inside">
                            <li>新人指導で優れた成果を上げている</li>
                            <li>療養活動の企画・運営でリーダーシップ発揮</li>
                            <li>4年目以降はチームリーダーとしての活躍を期待</li>
                          </ul>
                        </div>
                      );
                    } else if (totalScore >= 70) {
                      return (
                        <div>
                          <p className="text-sm mb-2">
                            <span className="font-semibold">バランス成長型:</span>
                            着実に成長し、期待通りの活躍。自立した業務遂行が定着
                          </p>
                          <ul className="text-sm list-disc list-inside">
                            <li>確実な援助技術で患者・家族から信頼</li>
                            <li>新人のよき相談相手として機能</li>
                            <li>専門性を深めて中堅職員への成長を支援</li>
                          </ul>
                        </div>
                      );
                    } else if (totalScore >= 60) {
                      return (
                        <div>
                          <p className="text-sm mb-2">
                            <span className="font-semibold">成長途上型:</span>
                            基本は身についているが、更なる向上の余地あり
                          </p>
                          <ul className="text-sm list-disc list-inside">
                            <li>特定分野での技術向上を重点支援</li>
                            <li>自信を持って業務遂行できるよう支援</li>
                            <li>強みを活かした役割設定を検討</li>
                          </ul>
                        </div>
                      );
                    } else {
                      return (
                        <div>
                          <p className="text-sm mb-2">
                            <span className="font-semibold">要支援:</span>
                            2・3年目として期待される水準に達していない
                          </p>
                          <ul className="text-sm list-disc list-inside">
                            <li>基礎技術の再確認と強化が必要</li>
                            <li>個別支援計画による重点的フォロー</li>
                            <li>適性や配置の見直しも検討</li>
                          </ul>
                        </div>
                      );
                    }
                  })()}
                </div>

                {/* 総合コメント */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="strengths">強みと優れている点</Label>
                    <Textarea 
                      id="strengths" 
                      placeholder="確実な援助技術、患者への温かい関わり、チームワーク、新人への適切な助言など"
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="improvements">今後の成長課題</Label>
                    <Textarea 
                      id="improvements" 
                      placeholder="専門知識の深化、リーダーシップの発揮、新人指導力の向上など"
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="next-term-goals">次期（中堅職員）に向けた目標</Label>
                    <Textarea 
                      id="next-term-goals" 
                      placeholder="認知症ケアの専門性向上、療養活動の企画力強化、後輩指導の充実など"
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