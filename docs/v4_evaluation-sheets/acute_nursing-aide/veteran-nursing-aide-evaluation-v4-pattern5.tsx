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

export default function VeteranNursingAideEvaluationV4Pattern5() {
  // 評価項目の状態管理
  const [technicalScores, setTechnicalScores] = useState({
    superiorEval: { advancedSkills: 0, subLeadership: 0, advancedEducation: 0, qualityImprovement: 0 },
    selfEval: { advancedSkills: 0, subLeadership: 0, advancedEducation: 0, qualityImprovement: 0 }
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
            ベテラン看護補助者（8-10年目） 人事評価シート v4.0
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            パターン5改良版 - 高度な実践力とサブリーダーシップを重視した評価
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
                    <Input type="text" id="experience" placeholder="9年3ヶ月" />
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="role">現在の役割</Label>
                  <Input type="text" id="role" placeholder="サブリーダー / 教育担当" />
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
                    <h5 className="font-medium mb-3">1. 高度な介護技術・専門性</h5>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'advancedSkills', value)}>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="S" id="sup-advanced-s" />
                          <Label htmlFor="sup-advanced-s" className="font-normal">
                            <span className="font-semibold">S：</span> 極めて高度な技術を持ち、専門分野では病棟のトップレベル
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="A" id="sup-advanced-a" />
                          <Label htmlFor="sup-advanced-a" className="font-normal">
                            <span className="font-semibold">A：</span> 高度な技術を持ち、困難な事例にも確実に対応できる
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="B" id="sup-advanced-b" />
                          <Label htmlFor="sup-advanced-b" className="font-normal">
                            <span className="font-semibold">B：</span> ベテランとして十分な技術と知識を持っている
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="C" id="sup-advanced-c" />
                          <Label htmlFor="sup-advanced-c" className="font-normal">
                            <span className="font-semibold">C：</span> 技術は標準的だが、ベテランとしてさらなる向上が必要
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="D" id="sup-advanced-d" />
                          <Label htmlFor="sup-advanced-d" className="font-normal">
                            <span className="font-semibold">D：</span> ベテランとして期待される技術水準に達していない
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <h5 className="font-medium mb-3">2. サブリーダーシップ・調整力</h5>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'subLeadership', value)}>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="S" id="sup-sublead-s" />
                          <Label htmlFor="sup-sublead-s" className="font-normal">
                            <span className="font-semibold">S：</span> リーダー不在時も完璧に代行し、チームを効果的に統率
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="A" id="sup-sublead-a" />
                          <Label htmlFor="sup-sublead-a" className="font-normal">
                            <span className="font-semibold">A：</span> サブリーダーとして積極的に活動し、チームをサポート
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="B" id="sup-sublead-b" />
                          <Label htmlFor="sup-sublead-b" className="font-normal">
                            <span className="font-semibold">B：</span> 必要に応じてリーダー業務を補佐できる
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="C" id="sup-sublead-c" />
                          <Label htmlFor="sup-sublead-c" className="font-normal">
                            <span className="font-semibold">C：</span> サブリーダーとしての役割遂行に課題がある
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="D" id="sup-sublead-d" />
                          <Label htmlFor="sup-sublead-d" className="font-normal">
                            <span className="font-semibold">D：</span> サブリーダーシップの発揮が不十分
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <h5 className="font-medium mb-3">3. 高度な教育・指導力</h5>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'advancedEducation', value)}>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="S" id="sup-advedu-s" />
                          <Label htmlFor="sup-advedu-s" className="font-normal">
                            <span className="font-semibold">S：</span> 教育プログラムの企画・実施で中心的役割を果たす
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="A" id="sup-advedu-a" />
                          <Label htmlFor="sup-advedu-a" className="font-normal">
                            <span className="font-semibold">A：</span> 効果的な教育を行い、多くの後輩の成長に貢献
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="B" id="sup-advedu-b" />
                          <Label htmlFor="sup-advedu-b" className="font-normal">
                            <span className="font-semibold">B：</span> 標準的な教育・指導を確実に行える
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="C" id="sup-advedu-c" />
                          <Label htmlFor="sup-advedu-c" className="font-normal">
                            <span className="font-semibold">C：</span> 教育・指導力にまだ改善の余地がある
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="D" id="sup-advedu-d" />
                          <Label htmlFor="sup-advedu-d" className="font-normal">
                            <span className="font-semibold">D：</span> 教育・指導への取り組みが不十分
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <h5 className="font-medium mb-3">4. 品質向上・業務改善</h5>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'qualityImprovement', value)}>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="S" id="sup-quality-s" />
                          <Label htmlFor="sup-quality-s" className="font-normal">
                            <span className="font-semibold">S：</span> 品質向上活動をリードし、顕著な成果を上げる
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="A" id="sup-quality-a" />
                          <Label htmlFor="sup-quality-a" className="font-normal">
                            <span className="font-semibold">A：</span> 積極的に改善提案を行い、実行に移している
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="B" id="sup-quality-b" />
                          <Label htmlFor="sup-quality-b" className="font-normal">
                            <span className="font-semibold">B：</span> 業務改善活動に参加し、貢献している
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="C" id="sup-quality-c" />
                          <Label htmlFor="sup-quality-c" className="font-normal">
                            <span className="font-semibold">C：</span> 品質向上への取り組みがやや消極的
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="D" id="sup-quality-d" />
                          <Label htmlFor="sup-quality-d" className="font-normal">
                            <span className="font-semibold">D：</span> 業務改善への意識が低い
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
                    <h5 className="font-medium mb-3">1. 高度な介護技術・専門性</h5>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'advancedSkills', value)}>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="S" id="self-advanced-s" />
                          <Label htmlFor="self-advanced-s" className="font-normal">
                            <span className="font-semibold">S：</span> 極めて高度な技術を持ち、自信を持って実践している
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="A" id="self-advanced-a" />
                          <Label htmlFor="self-advanced-a" className="font-normal">
                            <span className="font-semibold">A：</span> 高度な技術を習得し、確実に実践できている
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="B" id="self-advanced-b" />
                          <Label htmlFor="self-advanced-b" className="font-normal">
                            <span className="font-semibold">B：</span> ベテランとして必要な技術は身につけている
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="C" id="self-advanced-c" />
                          <Label htmlFor="self-advanced-c" className="font-normal">
                            <span className="font-semibold">C：</span> 技術面でさらなる向上が必要と感じる
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="D" id="self-advanced-d" />
                          <Label htmlFor="self-advanced-d" className="font-normal">
                            <span className="font-semibold">D：</span> 技術面で大きな課題を感じている
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <h5 className="font-medium mb-3">2. サブリーダーシップ・調整力</h5>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'subLeadership', value)}>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="S" id="self-sublead-s" />
                          <Label htmlFor="self-sublead-s" className="font-normal">
                            <span className="font-semibold">S：</span> サブリーダーとして自信を持って活動している
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="A" id="self-sublead-a" />
                          <Label htmlFor="self-sublead-a" className="font-normal">
                            <span className="font-semibold">A：</span> サブリーダーとして積極的に役割を果たしている
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="B" id="self-sublead-b" />
                          <Label htmlFor="self-sublead-b" className="font-normal">
                            <span className="font-semibold">B：</span> リーダー業務の補佐ができている
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="C" id="self-sublead-c" />
                          <Label htmlFor="self-sublead-c" className="font-normal">
                            <span className="font-semibold">C：</span> サブリーダーとしての能力を高めたい
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="D" id="self-sublead-d" />
                          <Label htmlFor="self-sublead-d" className="font-normal">
                            <span className="font-semibold">D：</span> サブリーダーとしての役割に不安がある
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <h5 className="font-medium mb-3">3. 高度な教育・指導力</h5>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'advancedEducation', value)}>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="S" id="self-advedu-s" />
                          <Label htmlFor="self-advedu-s" className="font-normal">
                            <span className="font-semibold">S：</span> 教育活動で中心的役割を果たしている
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="A" id="self-advedu-a" />
                          <Label htmlFor="self-advedu-a" className="font-normal">
                            <span className="font-semibold">A：</span> 効果的な教育・指導を行えている
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="B" id="self-advedu-b" />
                          <Label htmlFor="self-advedu-b" className="font-normal">
                            <span className="font-semibold">B：</span> 基本的な教育・指導はできている
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="C" id="self-advedu-c" />
                          <Label htmlFor="self-advedu-c" className="font-normal">
                            <span className="font-semibold">C：</span> 教育・指導力をさらに向上させたい
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="D" id="self-advedu-d" />
                          <Label htmlFor="self-advedu-d" className="font-normal">
                            <span className="font-semibold">D：</span> 教育・指導に自信がない
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <h5 className="font-medium mb-3">4. 品質向上・業務改善</h5>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'qualityImprovement', value)}>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="S" id="self-quality-s" />
                          <Label htmlFor="self-quality-s" className="font-normal">
                            <span className="font-semibold">S：</span> 品質向上活動で主導的役割を果たしている
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="A" id="self-quality-a" />
                          <Label htmlFor="self-quality-a" className="font-normal">
                            <span className="font-semibold">A：</span> 積極的に改善提案・実施を行っている
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="B" id="self-quality-b" />
                          <Label htmlFor="self-quality-b" className="font-normal">
                            <span className="font-semibold">B：</span> 業務改善活動に参加している
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="C" id="self-quality-c" />
                          <Label htmlFor="self-quality-c" className="font-normal">
                            <span className="font-semibold">C：</span> 品質向上にもっと貢献したい
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="D" id="self-quality-d" />
                          <Label htmlFor="self-quality-d" className="font-normal">
                            <span className="font-semibold">D：</span> 業務改善への参加が不十分
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
                    参考：委員会副委員長、教育プログラム責任者、QC活動リーダーなど
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
                <h4 className="font-semibold mb-3">ベテラン看護補助者の施設貢献活動例</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>教育プログラムの企画・運営責任者</li>
                  <li>委員会活動での副委員長・事務局</li>
                  <li>QC活動・業務改善プロジェクトのリーダー</li>
                  <li>新人教育の統括・カリキュラム作成</li>
                  <li>病棟マニュアルの整備・管理</li>
                  <li>他職種連携の推進役</li>
                  <li>病棟行事の企画・運営責任者</li>
                  <li>リスク管理活動での中核的役割</li>
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
                    参考：法人研修講師、地域活動参加、他施設支援など
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
                <h4 className="font-semibold mb-3">ベテラン看護補助者の法人貢献活動例</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>法人研修での講師・ファシリテーター</li>
                  <li>法人委員会での中核メンバー</li>
                  <li>地域活動への積極的参加</li>
                  <li>他施設との交流・技術交換</li>
                  <li>法人プロジェクトへの参画</li>
                  <li>災害支援・訓練での指導的役割</li>
                  <li>地域連携活動での実務担当</li>
                  <li>法人の広報活動への協力</li>
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
                  placeholder="ベテランとしての実績、サブリーダーとしての活動、今後の期待などを記載"
                  className="mt-2 h-32"
                />
              </div>
            </TabsContent>

            {/* 育成計画タブ */}
            <TabsContent value="development" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">育成計画</h3>
                <p className="text-sm text-gray-600 mb-4">
                  評価結果に基づく個別育成計画の策定
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="strengths">強み・良い点</Label>
                  <Textarea 
                    id="strengths" 
                    placeholder="ベテランとしての優れた点、サブリーダーとしての貢献"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="challenges">課題・改善点</Label>
                  <Textarea 
                    id="challenges" 
                    placeholder="リーダーを目指すための課題"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="goals">次期目標（1年後）</Label>
                  <Textarea 
                    id="goals" 
                    placeholder="リーダー看護補助者への成長目標"
                    className="mt-2 h-24"
                  />
                </div>

                <div>
                  <Label htmlFor="career-path">キャリアパス</Label>
                  <Textarea 
                    id="career-path" 
                    placeholder="リーダー登用への道筋、専門分野の確立など"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="support-plan">支援計画</Label>
                  <Textarea 
                    id="support-plan" 
                    placeholder="目標達成のための具体的な支援内容、研修計画など"
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
                      <Input type="text" id="reviewer" placeholder="師長名" className="mt-1" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">推奨研修・学習項目</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>リーダーシップ研修（上級）</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>組織マネジメント基礎研修</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>教育プログラム開発研修</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>品質管理・改善手法研修</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>管理職準備研修</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>専門資格取得（介護福祉士等）</span>
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