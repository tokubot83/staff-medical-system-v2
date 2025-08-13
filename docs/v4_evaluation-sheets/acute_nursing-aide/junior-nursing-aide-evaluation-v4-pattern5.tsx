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

export default function JuniorNursingAideEvaluationV4Pattern5() {
  // 評価項目の状態管理
  const [technicalScores, setTechnicalScores] = useState({
    superiorEval: { practicalSkills: 0, guidance: 0, problemSolving: 0, teamwork: 0 },
    selfEval: { practicalSkills: 0, guidance: 0, problemSolving: 0, teamwork: 0 }
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
            ジュニア看護補助者（2-3年目） 人事評価シート v4.0
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            パターン5改良版 - 実践力と後輩指導の基礎を重視した評価
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
                    <Input type="text" id="experience" placeholder="2年3ヶ月" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">評価者情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="evaluator1">1次評価者（主任・副主任）</Label>
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
                    <h5 className="font-medium mb-3">1. 実践的介護技術</h5>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'practicalSkills', value)}>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="S" id="sup-practical-s" />
                          <Label htmlFor="sup-practical-s" className="font-normal">
                            <span className="font-semibold">S：</span> 高度な介護技術を習得し、難しいケースにも対応できる
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="A" id="sup-practical-a" />
                          <Label htmlFor="sup-practical-a" className="font-normal">
                            <span className="font-semibold">A：</span> 多様な介護技術を習得し、状況に応じて適切に実施できる
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="B" id="sup-practical-b" />
                          <Label htmlFor="sup-practical-b" className="font-normal">
                            <span className="font-semibold">B：</span> 標準的な介護技術を習得し、独立して実施できる
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="C" id="sup-practical-c" />
                          <Label htmlFor="sup-practical-c" className="font-normal">
                            <span className="font-semibold">C：</span> 基本的な介護技術は習得しているが、応用力に課題がある
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="D" id="sup-practical-d" />
                          <Label htmlFor="sup-practical-d" className="font-normal">
                            <span className="font-semibold">D：</span> 介護技術の習得が不十分で、継続的な指導が必要
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <h5 className="font-medium mb-3">2. 後輩指導・教育</h5>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'guidance', value)}>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="S" id="sup-guidance-s" />
                          <Label htmlFor="sup-guidance-s" className="font-normal">
                            <span className="font-semibold">S：</span> 新人の指導を積極的に行い、分かりやすく丁寧に教育できる
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="A" id="sup-guidance-a" />
                          <Label htmlFor="sup-guidance-a" className="font-normal">
                            <span className="font-semibold">A：</span> 新人の指導に協力的で、基本的な教育ができる
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="B" id="sup-guidance-b" />
                          <Label htmlFor="sup-guidance-b" className="font-normal">
                            <span className="font-semibold">B：</span> 求められれば新人指導に参加し、サポートできる
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="C" id="sup-guidance-c" />
                          <Label htmlFor="sup-guidance-c" className="font-normal">
                            <span className="font-semibold">C：</span> 新人指導への参加は消極的で、教育スキルに課題がある
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="D" id="sup-guidance-d" />
                          <Label htmlFor="sup-guidance-d" className="font-normal">
                            <span className="font-semibold">D：</span> 新人指導に関わることが少なく、教育への意識が低い
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <h5 className="font-medium mb-3">3. 問題解決・判断力</h5>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'problemSolving', value)}>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="S" id="sup-problem-s" />
                          <Label htmlFor="sup-problem-s" className="font-normal">
                            <span className="font-semibold">S：</span> 複雑な問題も適切に判断し、迅速に解決できる
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="A" id="sup-problem-a" />
                          <Label htmlFor="sup-problem-a" className="font-normal">
                            <span className="font-semibold">A：</span> 日常的な問題を適切に判断し、解決できる
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="B" id="sup-problem-b" />
                          <Label htmlFor="sup-problem-b" className="font-normal">
                            <span className="font-semibold">B：</span> 基本的な問題は判断できるが、複雑な場合は相談が必要
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="C" id="sup-problem-c" />
                          <Label htmlFor="sup-problem-c" className="font-normal">
                            <span className="font-semibold">C：</span> 問題解決力が不十分で、頻繁に指導が必要
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="D" id="sup-problem-d" />
                          <Label htmlFor="sup-problem-d" className="font-normal">
                            <span className="font-semibold">D：</span> 問題を適切に判断できず、常に支援が必要
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <h5 className="font-medium mb-3">4. チームワーク・協調性</h5>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'teamwork', value)}>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="S" id="sup-team-s" />
                          <Label htmlFor="sup-team-s" className="font-normal">
                            <span className="font-semibold">S：</span> チームの中心となり、積極的に協力・調整を行う
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="A" id="sup-team-a" />
                          <Label htmlFor="sup-team-a" className="font-normal">
                            <span className="font-semibold">A：</span> チームワークを重視し、良好な協力関係を築ける
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="B" id="sup-team-b" />
                          <Label htmlFor="sup-team-b" className="font-normal">
                            <span className="font-semibold">B：</span> チームの一員として標準的な協力ができる
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="C" id="sup-team-c" />
                          <Label htmlFor="sup-team-c" className="font-normal">
                            <span className="font-semibold">C：</span> チームワークに課題があり、協調性の向上が必要
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="D" id="sup-team-d" />
                          <Label htmlFor="sup-team-d" className="font-normal">
                            <span className="font-semibold">D：</span> チームワークが不十分で、協調性に大きな課題がある
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
                    <h5 className="font-medium mb-3">1. 実践的介護技術</h5>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'practicalSkills', value)}>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="S" id="self-practical-s" />
                          <Label htmlFor="self-practical-s" className="font-normal">
                            <span className="font-semibold">S：</span> 高度な介護技術を習得し、自信を持って実践している
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="A" id="self-practical-a" />
                          <Label htmlFor="self-practical-a" className="font-normal">
                            <span className="font-semibold">A：</span> 多様な介護技術を習得し、適切に実施できている
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="B" id="self-practical-b" />
                          <Label htmlFor="self-practical-b" className="font-normal">
                            <span className="font-semibold">B：</span> 標準的な介護技術は独立して実施できる
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="C" id="self-practical-c" />
                          <Label htmlFor="self-practical-c" className="font-normal">
                            <span className="font-semibold">C：</span> 基本的な技術はできるが、応用力を高める必要がある
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="D" id="self-practical-d" />
                          <Label htmlFor="self-practical-d" className="font-normal">
                            <span className="font-semibold">D：</span> 介護技術にまだ不安があり、さらなる習得が必要
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <h5 className="font-medium mb-3">2. 後輩指導・教育</h5>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'guidance', value)}>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="S" id="self-guidance-s" />
                          <Label htmlFor="self-guidance-s" className="font-normal">
                            <span className="font-semibold">S：</span> 新人指導に積極的に取り組み、効果的に教育できている
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="A" id="self-guidance-a" />
                          <Label htmlFor="self-guidance-a" className="font-normal">
                            <span className="font-semibold">A：</span> 新人指導に協力的で、基本的な教育ができている
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="B" id="self-guidance-b" />
                          <Label htmlFor="self-guidance-b" className="font-normal">
                            <span className="font-semibold">B：</span> 新人指導に参加し、サポートすることができる
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="C" id="self-guidance-c" />
                          <Label htmlFor="self-guidance-c" className="font-normal">
                            <span className="font-semibold">C：</span> 新人指導に不安があり、教育スキルを向上させたい
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="D" id="self-guidance-d" />
                          <Label htmlFor="self-guidance-d" className="font-normal">
                            <span className="font-semibold">D：</span> 新人指導にはまだ自信がなく、経験を積む必要がある
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <h5 className="font-medium mb-3">3. 問題解決・判断力</h5>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'problemSolving', value)}>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="S" id="self-problem-s" />
                          <Label htmlFor="self-problem-s" className="font-normal">
                            <span className="font-semibold">S：</span> 複雑な問題も適切に判断し、解決できている
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="A" id="self-problem-a" />
                          <Label htmlFor="self-problem-a" className="font-normal">
                            <span className="font-semibold">A：</span> 日常的な問題を適切に判断し、解決できている
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="B" id="self-problem-b" />
                          <Label htmlFor="self-problem-b" className="font-normal">
                            <span className="font-semibold">B：</span> 基本的な問題は判断できるが、複雑な場合は相談している
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="C" id="self-problem-c" />
                          <Label htmlFor="self-problem-c" className="font-normal">
                            <span className="font-semibold">C：</span> 問題解決力をさらに向上させる必要がある
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="D" id="self-problem-d" />
                          <Label htmlFor="self-problem-d" className="font-normal">
                            <span className="font-semibold">D：</span> 問題解決に不安があり、判断力を高める必要がある
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <h5 className="font-medium mb-3">4. チームワーク・協調性</h5>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'teamwork', value)}>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="S" id="self-team-s" />
                          <Label htmlFor="self-team-s" className="font-normal">
                            <span className="font-semibold">S：</span> チームの中心となり、積極的に協力・調整している
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="A" id="self-team-a" />
                          <Label htmlFor="self-team-a" className="font-normal">
                            <span className="font-semibold">A：</span> チームワークを重視し、良好な協力関係を築けている
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="B" id="self-team-b" />
                          <Label htmlFor="self-team-b" className="font-normal">
                            <span className="font-semibold">B：</span> チームの一員として協力できている
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="C" id="self-team-c" />
                          <Label htmlFor="self-team-c" className="font-normal">
                            <span className="font-semibold">C：</span> チームワークをさらに向上させる必要がある
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="D" id="self-team-d" />
                          <Label htmlFor="self-team-d" className="font-normal">
                            <span className="font-semibold">D：</span> チームワークに課題があり、協調性を高める必要がある
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
                    参考：委員会参加、勉強会企画、新人指導、改善提案など
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
                <h4 className="font-semibold mb-3">ジュニア看護補助者の施設貢献活動例</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>新人看護補助者の指導・サポート</li>
                  <li>病棟勉強会の企画・運営への参加</li>
                  <li>委員会活動への積極的な参加</li>
                  <li>業務改善提案の実施</li>
                  <li>病棟マニュアルの作成・更新</li>
                  <li>実習生の指導補助</li>
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
                    参考：法人研修参加、地域活動参加、他施設支援など
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
                <h4 className="font-semibold mb-3">ジュニア看護補助者の法人貢献活動例</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>法人研修への積極的な参加</li>
                  <li>法人行事の運営協力</li>
                  <li>地域イベントへの参加</li>
                  <li>他施設との交流活動参加</li>
                  <li>法人の委員会活動への参加</li>
                  <li>災害訓練への参加</li>
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
                  placeholder="ジュニア看護補助者としての成長度、強み、今後の課題などを記載"
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
                    placeholder="ジュニアとして優れている点、成長が見られる点"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="challenges">課題・改善点</Label>
                  <Textarea 
                    id="challenges" 
                    placeholder="今後改善が必要な点、重点的に指導すべき点"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="goals">次期目標（1年後）</Label>
                  <Textarea 
                    id="goals" 
                    placeholder="中堅看護補助者として期待される到達目標"
                    className="mt-2 h-24"
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
                      <Input type="text" id="reviewer" placeholder="主任・副主任名" className="mt-1" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">推奨研修・学習項目</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>中級介護技術研修</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>プリセプター研修（新人指導）</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>リーダーシップ基礎研修</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>医療安全研修（応用編）</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>認知症ケア研修</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>緊急時対応研修</span>
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