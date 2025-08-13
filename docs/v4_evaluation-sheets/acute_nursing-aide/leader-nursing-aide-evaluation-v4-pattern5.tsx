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

export default function LeaderNursingAideEvaluationV4Pattern5() {
  // 評価項目の状態管理
  const [technicalScores, setTechnicalScores] = useState({
    superiorEval: { masterSkills: 0, organizationalLeadership: 0, mentoring: 0, innovation: 0 },
    selfEval: { masterSkills: 0, organizationalLeadership: 0, mentoring: 0, innovation: 0 }
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
            リーダー看護補助者（11年以上） 人事評価シート v4.0
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            パターン5改良版 - 組織運営への貢献と高度な指導力を重視した評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              v4.0評価システム：技術評価50点（360度評価）+ 施設貢献25点 + 法人貢献25点 = 100点満点
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="basic">基本情報</TabsTrigger>
              <TabsTrigger value="technical">技術評価</TabsTrigger>
              <TabsTrigger value="facility">施設貢献</TabsTrigger>
              <TabsTrigger value="corporate">法人貢献</TabsTrigger>
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
                    <Label htmlFor="department">配属病棟</Label>
                    <Input type="text" id="department" placeholder="3階病棟（急性期）" />
                  </div>
                  <div>
                    <Label htmlFor="experience">経験年数</Label>
                    <Input type="text" id="experience" placeholder="15年2ヶ月" />
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="role">現在の役職・役割</Label>
                  <Input type="text" id="role" placeholder="看護補助者リーダー / プリセプター統括" />
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

            {/* 技術評価タブ（50点） */}
            <TabsContent value="technical" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  技術評価（50点満点）- 360度評価
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  上司評価（60%）と本人評価（40%）の加重平均で算出
                </p>
              </div>

              {/* 上司評価 */}
              <div className="border p-4 rounded-lg">
                <h4 className="font-semibold mb-4 text-blue-700">上司評価（60%）</h4>
                
                <div className="space-y-6">
                  <div>
                    <h5 className="font-medium mb-3">1. 卓越した技術・専門性</h5>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'masterSkills', value)}>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="S" id="sup-master-s" />
                          <Label htmlFor="sup-master-s" className="font-normal">
                            <span className="font-semibold">S：</span> 病院内で最高水準の技術を持ち、他職種からも頼られる存在
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="A" id="sup-master-a" />
                          <Label htmlFor="sup-master-a" className="font-normal">
                            <span className="font-semibold">A：</span> 卓越した技術を持ち、困難な事例も確実に対応できる
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="B" id="sup-master-b" />
                          <Label htmlFor="sup-master-b" className="font-normal">
                            <span className="font-semibold">B：</span> リーダーとして十分な技術と知識を持っている
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="C" id="sup-master-c" />
                          <Label htmlFor="sup-master-c" className="font-normal">
                            <span className="font-semibold">C：</span> 技術は標準的だが、リーダーとしてさらなる向上が必要
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="D" id="sup-master-d" />
                          <Label htmlFor="sup-master-d" className="font-normal">
                            <span className="font-semibold">D：</span> リーダーとして期待される技術水準に達していない
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <h5 className="font-medium mb-3">2. 組織運営・マネジメント力</h5>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'organizationalLeadership', value)}>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="S" id="sup-org-s" />
                          <Label htmlFor="sup-org-s" className="font-normal">
                            <span className="font-semibold">S：</span> 組織運営に卓越した能力を発揮し、部署全体の向上に貢献
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="A" id="sup-org-a" />
                          <Label htmlFor="sup-org-a" className="font-normal">
                            <span className="font-semibold">A：</span> 効果的な組織運営を行い、チーム全体を統率できる
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="B" id="sup-org-b" />
                          <Label htmlFor="sup-org-b" className="font-normal">
                            <span className="font-semibold">B：</span> 基本的な組織運営・マネジメントができる
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="C" id="sup-org-c" />
                          <Label htmlFor="sup-org-c" className="font-normal">
                            <span className="font-semibold">C：</span> 組織運営力にやや課題があり、改善が必要
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="D" id="sup-org-d" />
                          <Label htmlFor="sup-org-d" className="font-normal">
                            <span className="font-semibold">D：</span> 組織運営・マネジメント力が不足している
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <h5 className="font-medium mb-3">3. 人材育成・メンタリング</h5>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'mentoring', value)}>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="S" id="sup-mentor-s" />
                          <Label htmlFor="sup-mentor-s" className="font-normal">
                            <span className="font-semibold">S：</span> 優れた育成能力で多くの後輩を成長させ、組織に貢献
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="A" id="sup-mentor-a" />
                          <Label htmlFor="sup-mentor-a" className="font-normal">
                            <span className="font-semibold">A：</span> 効果的な人材育成を行い、後輩の成長を促進する
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="B" id="sup-mentor-b" />
                          <Label htmlFor="sup-mentor-b" className="font-normal">
                            <span className="font-semibold">B：</span> 標準的な人材育成・指導を行っている
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="C" id="sup-mentor-c" />
                          <Label htmlFor="sup-mentor-c" className="font-normal">
                            <span className="font-semibold">C：</span> 人材育成への取り組みがやや不足している
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="D" id="sup-mentor-d" />
                          <Label htmlFor="sup-mentor-d" className="font-normal">
                            <span className="font-semibold">D：</span> 人材育成への関与が不十分
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <h5 className="font-medium mb-3">4. 革新・変革推進力</h5>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'innovation', value)}>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="S" id="sup-innov-s" />
                          <Label htmlFor="sup-innov-s" className="font-normal">
                            <span className="font-semibold">S：</span> 革新的な取り組みを主導し、組織全体に大きな変革をもたらす
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="A" id="sup-innov-a" />
                          <Label htmlFor="sup-innov-a" className="font-normal">
                            <span className="font-semibold">A：</span> 積極的に変革を推進し、新しい取り組みを実現する
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="B" id="sup-innov-b" />
                          <Label htmlFor="sup-innov-b" className="font-normal">
                            <span className="font-semibold">B：</span> 必要な変革には協力的に参加する
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="C" id="sup-innov-c" />
                          <Label htmlFor="sup-innov-c" className="font-normal">
                            <span className="font-semibold">C：</span> 変革への取り組みがやや消極的
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="D" id="sup-innov-d" />
                          <Label htmlFor="sup-innov-d" className="font-normal">
                            <span className="font-semibold">D：</span> 現状維持に留まり、変革への意欲が低い
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              {/* 本人評価 */}
              <div className="border p-4 rounded-lg">
                <h4 className="font-semibold mb-4 text-green-700">本人評価（40%）</h4>
                
                <div className="space-y-6">
                  <div>
                    <h5 className="font-medium mb-3">1. 卓越した技術・専門性</h5>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'masterSkills', value)}>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="S" id="self-master-s" />
                          <Label htmlFor="self-master-s" className="font-normal">
                            <span className="font-semibold">S：</span> 最高水準の技術を持ち、他者の模範となっている
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="A" id="self-master-a" />
                          <Label htmlFor="self-master-a" className="font-normal">
                            <span className="font-semibold">A：</span> 高度な技術を持ち、幅広い場面で活用している
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="B" id="self-master-b" />
                          <Label htmlFor="self-master-b" className="font-normal">
                            <span className="font-semibold">B：</span> リーダーとして必要な技術は身につけている
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="C" id="self-master-c" />
                          <Label htmlFor="self-master-c" className="font-normal">
                            <span className="font-semibold">C：</span> 技術面でさらなる向上が必要と感じる
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="D" id="self-master-d" />
                          <Label htmlFor="self-master-d" className="font-normal">
                            <span className="font-semibold">D：</span> 技術面で大きな課題を感じている
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <h5 className="font-medium mb-3">2. 組織運営・マネジメント力</h5>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'organizationalLeadership', value)}>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="S" id="self-org-s" />
                          <Label htmlFor="self-org-s" className="font-normal">
                            <span className="font-semibold">S：</span> 組織運営に自信を持ち、効果的にマネジメントしている
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="A" id="self-org-a" />
                          <Label htmlFor="self-org-a" className="font-normal">
                            <span className="font-semibold">A：</span> 組織運営を適切に行い、チームを統率している
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="B" id="self-org-b" />
                          <Label htmlFor="self-org-b" className="font-normal">
                            <span className="font-semibold">B：</span> 基本的な組織運営はできている
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="C" id="self-org-c" />
                          <Label htmlFor="self-org-c" className="font-normal">
                            <span className="font-semibold">C：</span> 組織運営力を向上させる必要がある
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="D" id="self-org-d" />
                          <Label htmlFor="self-org-d" className="font-normal">
                            <span className="font-semibold">D：</span> 組織運営に大きな課題を感じている
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <h5 className="font-medium mb-3">3. 人材育成・メンタリング</h5>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'mentoring', value)}>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="S" id="self-mentor-s" />
                          <Label htmlFor="self-mentor-s" className="font-normal">
                            <span className="font-semibold">S：</span> 人材育成に情熱を持ち、多くの後輩を成長させている
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="A" id="self-mentor-a" />
                          <Label htmlFor="self-mentor-a" className="font-normal">
                            <span className="font-semibold">A：</span> 積極的に人材育成に取り組み、成果を上げている
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="B" id="self-mentor-b" />
                          <Label htmlFor="self-mentor-b" className="font-normal">
                            <span className="font-semibold">B：</span> 人材育成に参加し、指導を行っている
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="C" id="self-mentor-c" />
                          <Label htmlFor="self-mentor-c" className="font-normal">
                            <span className="font-semibold">C：</span> 人材育成にもっと力を入れる必要がある
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="D" id="self-mentor-d" />
                          <Label htmlFor="self-mentor-d" className="font-normal">
                            <span className="font-semibold">D：</span> 人材育成への取り組みが不十分
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <h5 className="font-medium mb-3">4. 革新・変革推進力</h5>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'innovation', value)}>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="S" id="self-innov-s" />
                          <Label htmlFor="self-innov-s" className="font-normal">
                            <span className="font-semibold">S：</span> 革新的な取り組みを主導し、変革を実現している
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="A" id="self-innov-a" />
                          <Label htmlFor="self-innov-a" className="font-normal">
                            <span className="font-semibold">A：</span> 積極的に変革を推進している
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="B" id="self-innov-b" />
                          <Label htmlFor="self-innov-b" className="font-normal">
                            <span className="font-semibold">B：</span> 必要な変革には参加している
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="C" id="self-innov-c" />
                          <Label htmlFor="self-innov-c" className="font-normal">
                            <span className="font-semibold">C：</span> 変革への取り組みをもっと積極的にしたい
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="D" id="self-innov-d" />
                          <Label htmlFor="self-innov-d" className="font-normal">
                            <span className="font-semibold">D：</span> 変革への意識が不足している
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="font-semibold">
                  技術評価点: {calculateTechnicalScore().toFixed(1)}点 / 50点
                </p>
              </div>
            </TabsContent>

            {/* 施設貢献タブ（25点） */}
            <TabsContent value="facility" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  施設貢献度評価（25点満点）
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  組織貢献度ポイント制度に基づく相対評価
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="facility-points">施設貢献ポイント</Label>
                  <Input 
                    type="number" 
                    id="facility-points" 
                    placeholder="年間獲得ポイント"
                    onChange={(e) => setContributionPoints(prev => ({
                      ...prev,
                      facility: parseInt(e.target.value) || 0
                    }))}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    参考：委員会委員長、教育プログラム統括、品質改善リーダーなど
                  </p>
                </div>

                <div>
                  <Label htmlFor="facility-rank">同一職種内でのパーセンタイル順位</Label>
                  <div className="flex items-center gap-4">
                    <Input 
                      type="number" 
                      id="facility-rank" 
                      value={facilityRank}
                      onChange={(e) => setFacilityRank(parseInt(e.target.value) || 50)}
                      min="1" 
                      max="100"
                      className="w-24"
                    />
                    <span className="text-sm">パーセンタイル</span>
                  </div>
                  <Progress value={100 - facilityRank} className="mt-2" />
                  <p className="text-sm text-gray-500 mt-1">
                    上位{facilityRank}%（値が小さいほど上位）
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="font-semibold">
                    施設貢献点: {calculateContributionScore(facilityRank)}点 / 25点
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">リーダー看護補助者の施設貢献活動例</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>看護補助者教育プログラムの統括・運営</li>
                  <li>病棟運営への積極的な参画と提言</li>
                  <li>委員会活動での委員長・副委員長</li>
                  <li>品質改善活動のリーダーシップ</li>
                  <li>新人教育システムの構築・改善</li>
                  <li>他部署との連携強化の推進</li>
                  <li>病院機能評価への中心的貢献</li>
                  <li>看護補助者の代表としての活動</li>
                </ul>
              </div>
            </TabsContent>

            {/* 法人貢献タブ（25点） */}
            <TabsContent value="corporate" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  法人貢献度評価（25点満点）
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  組織貢献度ポイント制度に基づく相対評価
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="corporate-points">法人貢献ポイント</Label>
                  <Input 
                    type="number" 
                    id="corporate-points" 
                    placeholder="年間獲得ポイント"
                    onChange={(e) => setContributionPoints(prev => ({
                      ...prev,
                      corporate: parseInt(e.target.value) || 0
                    }))}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    参考：法人プロジェクトリーダー、地域連携統括、学会発表など
                  </p>
                </div>

                <div>
                  <Label htmlFor="corporate-rank">同一職種内でのパーセンタイル順位</Label>
                  <div className="flex items-center gap-4">
                    <Input 
                      type="number" 
                      id="corporate-rank" 
                      value={corporateRank}
                      onChange={(e) => setCorporateRank(parseInt(e.target.value) || 50)}
                      min="1" 
                      max="100"
                      className="w-24"
                    />
                    <span className="text-sm">パーセンタイル</span>
                  </div>
                  <Progress value={100 - corporateRank} className="mt-2" />
                  <p className="text-sm text-gray-500 mt-1">
                    上位{corporateRank}%（値が小さいほど上位）
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="font-semibold">
                    法人貢献点: {calculateContributionScore(corporateRank)}点 / 25点
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">リーダー看護補助者の法人貢献活動例</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>法人全体の教育プログラム開発・講師</li>
                  <li>法人委員会での主導的役割</li>
                  <li>地域連携活動の統括・推進</li>
                  <li>他施設への指導・コンサルティング</li>
                  <li>法人戦略プロジェクトへの参画</li>
                  <li>学会・研究会での発表</li>
                  <li>法人の対外的活動での代表</li>
                  <li>新規事業・サービスの企画立案</li>
                </ul>
              </div>
            </TabsContent>

            {/* 総合評価タブ */}
            <TabsContent value="summary" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  総合評価サマリー
                </h3>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="text-center mb-6">
                  <p className="text-3xl font-bold mb-2">
                    <span className={getScoreColor(totalScore)}>
                      {totalScore.toFixed(1)}点
                    </span>
                    <span className="text-gray-600 text-2xl"> / 100点</span>
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
                    <div 
                      className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${totalScore}%` }}
                    />
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>評価項目</TableHead>
                      <TableHead className="text-right">配点</TableHead>
                      <TableHead className="text-right">獲得点</TableHead>
                      <TableHead className="text-right">獲得率</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>技術評価（360度評価）</TableCell>
                      <TableCell className="text-right">50点</TableCell>
                      <TableCell className="text-right">{calculateTechnicalScore().toFixed(1)}点</TableCell>
                      <TableCell className="text-right">{(calculateTechnicalScore() / 50 * 100).toFixed(0)}%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>施設貢献度</TableCell>
                      <TableCell className="text-right">25点</TableCell>
                      <TableCell className="text-right">{calculateContributionScore(facilityRank)}点</TableCell>
                      <TableCell className="text-right">{(calculateContributionScore(facilityRank) / 25 * 100).toFixed(0)}%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>法人貢献度</TableCell>
                      <TableCell className="text-right">25点</TableCell>
                      <TableCell className="text-right">{calculateContributionScore(corporateRank)}点</TableCell>
                      <TableCell className="text-right">{(calculateContributionScore(corporateRank) / 25 * 100).toFixed(0)}%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">総合ランク判定</h4>
                  <div className="border rounded-lg p-4">
                    <p className="text-2xl font-bold text-center">
                      {totalScore >= 90 ? 'S' : 
                       totalScore >= 80 ? 'A' : 
                       totalScore >= 70 ? 'B' : 
                       totalScore >= 60 ? 'C' : 'D'}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">評価傾向</h4>
                  <div className="text-sm space-y-1">
                    <p>• 技術面: {calculateTechnicalScore() >= 40 ? '優秀' : calculateTechnicalScore() >= 30 ? '良好' : '要改善'}</p>
                    <p>• 施設貢献: {facilityRank <= 30 ? '積極的' : facilityRank <= 60 ? '標準的' : '消極的'}</p>
                    <p>• 法人貢献: {corporateRank <= 30 ? '積極的' : corporateRank <= 60 ? '標準的' : '消極的'}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <Label htmlFor="summary-comment">総合所見</Label>
                <Textarea 
                  id="summary-comment" 
                  placeholder="リーダーとしての功績、組織への貢献、今後の期待などを記載"
                  className="mt-2 h-32"
                />
              </div>
            </TabsContent>

            {/* 育成計画タブ */}
            <TabsContent value="development" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">育成計画</h3>
                <p className="text-sm text-gray-600 mb-4">
                  評価結果に基づく個別育成計画・キャリア開発
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="strengths">強み・良い点</Label>
                  <Textarea 
                    id="strengths" 
                    placeholder="リーダーとしての優れた点、組織への貢献"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="challenges">課題・改善点</Label>
                  <Textarea 
                    id="challenges" 
                    placeholder="さらなる飛躍のための課題"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="succession">後継者育成計画</Label>
                  <Textarea 
                    id="succession" 
                    placeholder="知識・技術の継承、次世代リーダーの育成"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="career-development">キャリア開発・役職登用</Label>
                  <Textarea 
                    id="career-development" 
                    placeholder="管理職登用、専門職としての発展、法人での役割など"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="goals">次期目標（1年後）</Label>
                  <Textarea 
                    id="goals" 
                    placeholder="組織的な目標、個人的な成長目標"
                    className="mt-2 h-24"
                  />
                </div>

                <div>
                  <Label htmlFor="follow-up">フォローアップ予定</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <Label htmlFor="next-review">次回面談予定日</Label>
                      <Input type="date" id="next-review" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="reviewer">面談担当者</Label>
                      <Input type="text" id="reviewer" placeholder="看護部長名" className="mt-1" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">推奨研修・学習項目</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>管理職研修（上級）</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>組織マネジメント研修</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>戦略立案・企画力研修</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>コーチング・メンタリング研修</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>医療経営・病院管理研修</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>外部研修・学会参加</span>
                  </label>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 flex justify-end gap-4">
            <Button variant="outline">一時保存</Button>
            <Button>評価を確定</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}