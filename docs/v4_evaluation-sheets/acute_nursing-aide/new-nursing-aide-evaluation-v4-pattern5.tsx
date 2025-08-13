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

export default function NewNursingAideEvaluationV4Pattern5() {
  // 評価項目の状態管理
  const [technicalScores, setTechnicalScores] = useState({
    superiorEval: { careSkills: 0, safety: 0, communication: 0, adaptation: 0 },
    selfEval: { careSkills: 0, safety: 0, communication: 0, adaptation: 0 }
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
            新人看護補助者（1年目） 人事評価シート v4.0
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            パターン5改良版 - 基礎習得と職場適応を重視した評価
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
                    <Label htmlFor="department">配属病棟</Label>
                    <Input type="text" id="department" placeholder="3階病棟（急性期）" />
                  </div>
                  <div>
                    <Label htmlFor="employment-date">入職年月日</Label>
                    <Input type="date" id="employment-date" />
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
                    <Label htmlFor="evaluator2">2次評価者（主任・師長）</Label>
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
                    <h5 className="font-medium mb-3">1. 基礎的介護技術</h5>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'careSkills', value)}>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="S" id="sup-care-s" />
                          <Label htmlFor="sup-care-s" className="font-normal">
                            <span className="font-semibold">S：</span> 基本的な介護技術を完璧に習得し、他の新人の模範となる
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="A" id="sup-care-a" />
                          <Label htmlFor="sup-care-a" className="font-normal">
                            <span className="font-semibold">A：</span> 基本的な介護技術を確実に習得し、安全に実施できる
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="B" id="sup-care-b" />
                          <Label htmlFor="sup-care-b" className="font-normal">
                            <span className="font-semibold">B：</span> 基本的な介護技術を概ね習得し、指導下で実施できる
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="C" id="sup-care-c" />
                          <Label htmlFor="sup-care-c" className="font-normal">
                            <span className="font-semibold">C：</span> 基本的な介護技術の習得に時間を要し、継続的な指導が必要
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="D" id="sup-care-d" />
                          <Label htmlFor="sup-care-d" className="font-normal">
                            <span className="font-semibold">D：</span> 基本的な介護技術の習得が不十分で、集中的な指導が必要
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <h5 className="font-medium mb-3">2. 安全管理</h5>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'safety', value)}>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="S" id="sup-safety-s" />
                          <Label htmlFor="sup-safety-s" className="font-normal">
                            <span className="font-semibold">S：</span> 安全管理の意識が非常に高く、リスクを予測して行動できる
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="A" id="sup-safety-a" />
                          <Label htmlFor="sup-safety-a" className="font-normal">
                            <span className="font-semibold">A：</span> 安全管理の基本を理解し、確実に実践できる
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="B" id="sup-safety-b" />
                          <Label htmlFor="sup-safety-b" className="font-normal">
                            <span className="font-semibold">B：</span> 安全管理の基本を理解し、概ね実践できる
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="C" id="sup-safety-c" />
                          <Label htmlFor="sup-safety-c" className="font-normal">
                            <span className="font-semibold">C：</span> 安全管理の理解が不十分で、時々注意を要する
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="D" id="sup-safety-d" />
                          <Label htmlFor="sup-safety-d" className="font-normal">
                            <span className="font-semibold">D：</span> 安全管理の意識が低く、頻繁な指導が必要
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <h5 className="font-medium mb-3">3. コミュニケーション</h5>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'communication', value)}>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="S" id="sup-comm-s" />
                          <Label htmlFor="sup-comm-s" className="font-normal">
                            <span className="font-semibold">S：</span> 患者・スタッフと優れたコミュニケーションを取り、信頼関係を構築
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="A" id="sup-comm-a" />
                          <Label htmlFor="sup-comm-a" className="font-normal">
                            <span className="font-semibold">A：</span> 患者・スタッフと良好なコミュニケーションが取れる
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="B" id="sup-comm-b" />
                          <Label htmlFor="sup-comm-b" className="font-normal">
                            <span className="font-semibold">B：</span> 基本的なコミュニケーションが取れる
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="C" id="sup-comm-c" />
                          <Label htmlFor="sup-comm-c" className="font-normal">
                            <span className="font-semibold">C：</span> コミュニケーションに課題があり、改善が必要
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="D" id="sup-comm-d" />
                          <Label htmlFor="sup-comm-d" className="font-normal">
                            <span className="font-semibold">D：</span> コミュニケーションに大きな課題があり、継続的な指導が必要
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <h5 className="font-medium mb-3">4. 職場適応・学習姿勢</h5>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'adaptation', value)}>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="S" id="sup-adapt-s" />
                          <Label htmlFor="sup-adapt-s" className="font-normal">
                            <span className="font-semibold">S：</span> 職場に完全に適応し、主体的に学習して成長している
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="A" id="sup-adapt-a" />
                          <Label htmlFor="sup-adapt-a" className="font-normal">
                            <span className="font-semibold">A：</span> 職場に良好に適応し、積極的な学習姿勢を示す
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="B" id="sup-adapt-b" />
                          <Label htmlFor="sup-adapt-b" className="font-normal">
                            <span className="font-semibold">B：</span> 職場に概ね適応し、標準的な学習姿勢を示す
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="C" id="sup-adapt-c" />
                          <Label htmlFor="sup-adapt-c" className="font-normal">
                            <span className="font-semibold">C：</span> 職場適応に時間を要し、学習姿勢に改善の余地がある
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="D" id="sup-adapt-d" />
                          <Label htmlFor="sup-adapt-d" className="font-normal">
                            <span className="font-semibold">D：</span> 職場適応が困難で、学習姿勢に大きな課題がある
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
                    <h5 className="font-medium mb-3">1. 基礎的介護技術</h5>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'careSkills', value)}>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="S" id="self-care-s" />
                          <Label htmlFor="self-care-s" className="font-normal">
                            <span className="font-semibold">S：</span> 基本的な介護技術を完璧に習得し、自信を持って実施できる
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="A" id="self-care-a" />
                          <Label htmlFor="self-care-a" className="font-normal">
                            <span className="font-semibold">A：</span> 基本的な介護技術を習得し、安全に実施できる
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="B" id="self-care-b" />
                          <Label htmlFor="self-care-b" className="font-normal">
                            <span className="font-semibold">B：</span> 基本的な介護技術を概ね習得しているが、まだ不安がある
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="C" id="self-care-c" />
                          <Label htmlFor="self-care-c" className="font-normal">
                            <span className="font-semibold">C：</span> 基本的な介護技術の習得に努力が必要と感じている
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="D" id="self-care-d" />
                          <Label htmlFor="self-care-d" className="font-normal">
                            <span className="font-semibold">D：</span> 基本的な介護技術の習得に大きな課題を感じている
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <h5 className="font-medium mb-3">2. 安全管理</h5>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'safety', value)}>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="S" id="self-safety-s" />
                          <Label htmlFor="self-safety-s" className="font-normal">
                            <span className="font-semibold">S：</span> 安全管理を常に意識し、リスクを予測して行動している
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="A" id="self-safety-a" />
                          <Label htmlFor="self-safety-a" className="font-normal">
                            <span className="font-semibold">A：</span> 安全管理の重要性を理解し、確実に実践している
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="B" id="self-safety-b" />
                          <Label htmlFor="self-safety-b" className="font-normal">
                            <span className="font-semibold">B：</span> 安全管理を意識しているが、時々確認が必要
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="C" id="self-safety-c" />
                          <Label htmlFor="self-safety-c" className="font-normal">
                            <span className="font-semibold">C：</span> 安全管理の意識をさらに高める必要がある
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="D" id="self-safety-d" />
                          <Label htmlFor="self-safety-d" className="font-normal">
                            <span className="font-semibold">D：</span> 安全管理の理解と実践に大きな課題がある
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <h5 className="font-medium mb-3">3. コミュニケーション</h5>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'communication', value)}>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="S" id="self-comm-s" />
                          <Label htmlFor="self-comm-s" className="font-normal">
                            <span className="font-semibold">S：</span> 患者・スタッフと優れたコミュニケーションが取れている
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="A" id="self-comm-a" />
                          <Label htmlFor="self-comm-a" className="font-normal">
                            <span className="font-semibold">A：</span> 患者・スタッフと良好なコミュニケーションが取れている
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="B" id="self-comm-b" />
                          <Label htmlFor="self-comm-b" className="font-normal">
                            <span className="font-semibold">B：</span> 基本的なコミュニケーションは取れているが、改善の余地がある
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="C" id="self-comm-c" />
                          <Label htmlFor="self-comm-c" className="font-normal">
                            <span className="font-semibold">C：</span> コミュニケーションに不安があり、努力が必要
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="D" id="self-comm-d" />
                          <Label htmlFor="self-comm-d" className="font-normal">
                            <span className="font-semibold">D：</span> コミュニケーションに大きな課題を感じている
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <h5 className="font-medium mb-3">4. 職場適応・学習姿勢</h5>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'adaptation', value)}>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="S" id="self-adapt-s" />
                          <Label htmlFor="self-adapt-s" className="font-normal">
                            <span className="font-semibold">S：</span> 職場に完全に適応し、主体的に学習している
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="A" id="self-adapt-a" />
                          <Label htmlFor="self-adapt-a" className="font-normal">
                            <span className="font-semibold">A：</span> 職場に良好に適応し、積極的に学習している
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="B" id="self-adapt-b" />
                          <Label htmlFor="self-adapt-b" className="font-normal">
                            <span className="font-semibold">B：</span> 職場に概ね適応し、学習に取り組んでいる
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="C" id="self-adapt-c" />
                          <Label htmlFor="self-adapt-c" className="font-normal">
                            <span className="font-semibold">C：</span> 職場適応と学習姿勢に努力が必要
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="D" id="self-adapt-d" />
                          <Label htmlFor="self-adapt-d" className="font-normal">
                            <span className="font-semibold">D：</span> 職場適応と学習姿勢に大きな課題がある
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
                    参考：委員会参加、勉強会企画、改善提案など
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
                <h4 className="font-semibold mb-3">新人看護補助者の施設貢献活動例</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>病棟の勉強会への積極的な参加</li>
                  <li>環境整備活動への貢献</li>
                  <li>新人同士の学習会の企画・参加</li>
                  <li>病棟行事への積極的な参加</li>
                  <li>改善提案の提出</li>
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
                    参考：法人研修参加、地域活動参加など
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
                <h4 className="font-semibold mb-3">新人看護補助者の法人貢献活動例</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>法人全体研修への参加</li>
                  <li>法人行事への参加・協力</li>
                  <li>地域ボランティア活動への参加</li>
                  <li>法人の委員会活動への参加（可能な範囲で）</li>
                  <li>他施設との交流研修への参加</li>
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
                  placeholder="新人看護補助者としての成長度、強み、今後の課題などを記載"
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
                    placeholder="新人として優れている点、成長が見られる点"
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
                  <Label htmlFor="goals">次期目標（6ヶ月後）</Label>
                  <Textarea 
                    id="goals" 
                    placeholder="具体的な到達目標を3-5項目程度"
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
                      <Input type="text" id="reviewer" placeholder="指導担当者名" className="mt-1" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">推奨研修・学習項目</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>基礎介護技術研修（レベル2）</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>コミュニケーション研修</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>医療安全研修（基礎編）</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>感染対策研修</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>チームワーク研修</span>
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