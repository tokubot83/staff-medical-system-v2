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
import { InfoIcon, Calculator, Award, Building, Users, Home } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function RokenNewAssistantNurseEvaluationV4Pattern5() {
  // 評価項目の状態管理
  const [technicalScores, setTechnicalScores] = useState({
    superiorEval: { 
      skills: 0,           // 基礎准看護師業務と医療的ケア補助
      collaboration: 0,    // 多職種協働とチーム連携
      homeSupport: 0,      // 在宅復帰支援への理解
      rehabilitation: 0    // リハビリテーション看護の基礎
    },
    selfEval: { 
      skills: 0, 
      collaboration: 0, 
      homeSupport: 0, 
      rehabilitation: 0 
    }
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
            介護老人保健施設 新人准看護師（1年目） 人事評価シート v4.0
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            パターン5改良版 - 在宅復帰支援の理解と多職種協働への適応を重視した評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              <strong>評価構成：</strong>技術評価（360度評価）50点 + 施設貢献（相対評価）25点 + 法人貢献（相対評価）25点
              <br />
              老健新人准看護師は在宅復帰の基本概念理解と多職種チームでの役割を重点的に評価します
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
                    <Label htmlFor="primary-service">主たる配属サービス</Label>
                    <Input type="text" id="primary-service" placeholder="入所 / 通所リハ / 訪問看護" />
                  </div>
                  <div>
                    <Label htmlFor="rotation-experience">ローテーション経験</Label>
                    <Input type="text" id="rotation-experience" placeholder="入所3ヶ月、通所1ヶ月" />
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
                    <Label htmlFor="previous-experience">前職経験</Label>
                    <Input type="text" id="previous-experience" placeholder="なし / 他施設○年（参考）" />
                  </div>
                  <div>
                    <Label htmlFor="education">最終学歴・資格取得年</Label>
                    <Input type="text" id="education" placeholder="○○准看護学校 2024年卒" />
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

            {/* 技術評価タブ */}
            <TabsContent value="technical" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">技術評価（50点満点）</h3>
                <p className="text-sm text-gray-600 mb-4">
                  老健准看護師として必要な基礎能力を360度評価で採点します
                  <br />
                  <span className="font-semibold">評価比率：上司評価60% + 自己評価40%</span>
                </p>
              </div>

              <div className="space-y-6">
                {/* 基礎准看護師業務と医療的ケア補助 */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Award className="h-4 w-4 mr-2 text-blue-600" />
                    1. 基礎准看護師業務と医療的ケア補助
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    老健で必要な准看護師業務（日常生活支援、バイタル測定、服薬介助等）の習得状況
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">上司評価</Label>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'skills', value)}>
                        <div className="space-y-2 mt-2">
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="S" id="skills-superior-s" />
                            <Label htmlFor="skills-superior-s" className="font-normal">
                              <span className="font-semibold">S：</span> 老健で必要な准看護師業務を完全習得し、安全・確実に実践
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="A" id="skills-superior-a" />
                            <Label htmlFor="skills-superior-a" className="font-normal">
                              <span className="font-semibold">A：</span> 予定より早く業務を習得し、指導下で実践可能
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="B" id="skills-superior-b" />
                            <Label htmlFor="skills-superior-b" className="font-normal">
                              <span className="font-semibold">B：</span> 計画通りに業務を習得し、基本的な実践ができる
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="C" id="skills-superior-c" />
                            <Label htmlFor="skills-superior-c" className="font-normal">
                              <span className="font-semibold">C：</span> 業務習得に遅れがあり、継続的な指導が必要
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="D" id="skills-superior-d" />
                            <Label htmlFor="skills-superior-d" className="font-normal">
                              <span className="font-semibold">D：</span> 基礎業務の習得が著しく遅れ、集中的な支援が必要
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="border-t pt-3">
                      <Label className="text-sm font-medium">自己評価</Label>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'skills', value)}>
                        <div className="flex space-x-4 mt-2">
                          {['S', 'A', 'B', 'C', 'D'].map(grade => (
                            <div key={grade} className="flex items-center">
                              <RadioGroupItem value={grade} id={`skills-self-${grade.toLowerCase()}`} />
                              <Label htmlFor={`skills-self-${grade.toLowerCase()}`} className="ml-2">
                                {grade}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                {/* 多職種協働とチーム連携 */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Users className="h-4 w-4 mr-2 text-green-600" />
                    2. 多職種協働とチーム連携
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    リハ職・介護職・相談員等との連携とチームケアへの適応
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">上司評価</Label>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'collaboration', value)}>
                        <div className="space-y-2 mt-2">
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="S" id="collab-superior-s" />
                            <Label htmlFor="collab-superior-s" className="font-normal">
                              <span className="font-semibold">S：</span> 多職種チームに完全に適応し、積極的に連携を図る
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="A" id="collab-superior-a" />
                            <Label htmlFor="collab-superior-a" className="font-normal">
                              <span className="font-semibold">A：</span> リハ職・介護職・相談員等と良好な関係を構築
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="B" id="collab-superior-b" />
                            <Label htmlFor="collab-superior-b" className="font-normal">
                              <span className="font-semibold">B：</span> 標準的な適応状況で、チームの一員として機能
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="C" id="collab-superior-c" />
                            <Label htmlFor="collab-superior-c" className="font-normal">
                              <span className="font-semibold">C：</span> 多職種連携に時間を要し、サポートが必要
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="D" id="collab-superior-d" />
                            <Label htmlFor="collab-superior-d" className="font-normal">
                              <span className="font-semibold">D：</span> チーム適応に困難があり、継続的な支援が必要
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="border-t pt-3">
                      <Label className="text-sm font-medium">自己評価</Label>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'collaboration', value)}>
                        <div className="flex space-x-4 mt-2">
                          {['S', 'A', 'B', 'C', 'D'].map(grade => (
                            <div key={grade} className="flex items-center">
                              <RadioGroupItem value={grade} id={`collab-self-${grade.toLowerCase()}`} />
                              <Label htmlFor={`collab-self-${grade.toLowerCase()}`} className="ml-2">
                                {grade}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                {/* 在宅復帰支援への理解 */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Home className="h-4 w-4 mr-2 text-orange-600" />
                    3. 在宅復帰支援への理解
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    在宅復帰の基本概念理解と支援の必要性に対する意識
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">上司評価</Label>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'homeSupport', value)}>
                        <div className="space-y-2 mt-2">
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="S" id="home-superior-s" />
                            <Label htmlFor="home-superior-s" className="font-normal">
                              <span className="font-semibold">S：</span> 在宅復帰の概念を十分理解し、支援の視点を持ち始めている
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="A" id="home-superior-a" />
                            <Label htmlFor="home-superior-a" className="font-normal">
                              <span className="font-semibold">A：</span> 在宅復帰支援の重要性を理解し、基本的な知識を持つ
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="B" id="home-superior-b" />
                            <Label htmlFor="home-superior-b" className="font-normal">
                              <span className="font-semibold">B：</span> 在宅復帰について基本的な理解がある
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="C" id="home-superior-c" />
                            <Label htmlFor="home-superior-c" className="font-normal">
                              <span className="font-semibold">C：</span> 在宅復帰への理解が不十分で、学習が必要
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="D" id="home-superior-d" />
                            <Label htmlFor="home-superior-d" className="font-normal">
                              <span className="font-semibold">D：</span> 在宅復帰の概念理解ができていない
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="border-t pt-3">
                      <Label className="text-sm font-medium">自己評価</Label>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'homeSupport', value)}>
                        <div className="flex space-x-4 mt-2">
                          {['S', 'A', 'B', 'C', 'D'].map(grade => (
                            <div key={grade} className="flex items-center">
                              <RadioGroupItem value={grade} id={`home-self-${grade.toLowerCase()}`} />
                              <Label htmlFor={`home-self-${grade.toLowerCase()}`} className="ml-2">
                                {grade}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                {/* リハビリテーション看護の基礎 */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Calculator className="h-4 w-4 mr-2 text-purple-600" />
                    4. リハビリテーション看護の基礎
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    リハビリ職との連携と生活リハビリの基本的な考え方の理解
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">上司評価</Label>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'rehabilitation', value)}>
                        <div className="space-y-2 mt-2">
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="S" id="rehab-superior-s" />
                            <Label htmlFor="rehab-superior-s" className="font-normal">
                              <span className="font-semibold">S：</span> リハビリ職との連携を理解し、生活リハビリの視点を持つ
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="A" id="rehab-superior-a" />
                            <Label htmlFor="rehab-superior-a" className="font-normal">
                              <span className="font-semibold">A：</span> リハビリテーション看護の基本概念を理解している
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="B" id="rehab-superior-b" />
                            <Label htmlFor="rehab-superior-b" className="font-normal">
                              <span className="font-semibold">B：</span> 基本的なリハビリテーション看護について学習中
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="C" id="rehab-superior-c" />
                            <Label htmlFor="rehab-superior-c" className="font-normal">
                              <span className="font-semibold">C：</span> リハビリテーション看護の理解が不十分
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="D" id="rehab-superior-d" />
                            <Label htmlFor="rehab-superior-d" className="font-normal">
                              <span className="font-semibold">D：</span> リハビリテーション看護について理解できていない
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="border-t pt-3">
                      <Label className="text-sm font-medium">自己評価</Label>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'rehabilitation', value)}>
                        <div className="flex space-x-4 mt-2">
                          {['S', 'A', 'B', 'C', 'D'].map(grade => (
                            <div key={grade} className="flex items-center">
                              <RadioGroupItem value={grade} id={`rehab-self-${grade.toLowerCase()}`} />
                              <Label htmlFor={`rehab-self-${grade.toLowerCase()}`} className="ml-2">
                                {grade}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">技術評価点数</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {Math.round(calculateTechnicalScore() * 10) / 10} / 50点
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 施設貢献タブ */}
            <TabsContent value="facility" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">施設貢献度評価（25点満点）</h3>
                <p className="text-sm text-gray-600 mb-4">
                  老健内での貢献活動を相対評価で採点します（既存ポイント制度を活用）
                </p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold mb-2">評価対象となる貢献活動</h4>
                <ul className="text-sm space-y-1">
                  <li>• サービス間協力（入所・通所・訪問の応援・見学）</li>
                  <li>• レクリエーション活動への参加・準備手伝い</li>
                  <li>• 家族会・地域交流イベントへの参加</li>
                  <li>• 委員会活動（感染対策、褥瘡対策等）への参加</li>
                  <li>• 新人教育のサポート、先輩職員の業務補助</li>
                  <li>• 在宅復帰カンファレンスへの参加</li>
                </ul>
              </div>

              <div>
                <Label htmlFor="facility-points">施設貢献度ポイント</Label>
                <Input 
                  type="number" 
                  id="facility-points" 
                  placeholder="取得ポイント数を入力"
                  className="mb-2"
                />
                <p className="text-sm text-gray-600">
                  同期新人准看護師の中での相対的な位置づけを評価
                </p>
              </div>

              <div>
                <Label htmlFor="facility-percentile">施設内パーセンタイル順位</Label>
                <div className="flex items-center space-x-4">
                  <Input 
                    type="number" 
                    id="facility-percentile" 
                    value={facilityRank}
                    onChange={(e) => setFacilityRank(Number(e.target.value))}
                    min="1"
                    max="100"
                    className="w-24"
                  />
                  <span className="text-sm text-gray-600">
                    パーセンタイル（1=最上位、100=最下位）
                  </span>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>パーセンタイル</TableHead>
                    <TableHead>評価</TableHead>
                    <TableHead>点数</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>1-10%</TableCell>
                    <TableCell>極めて高い貢献</TableCell>
                    <TableCell>25点</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>11-20%</TableCell>
                    <TableCell>非常に高い貢献</TableCell>
                    <TableCell>22.5点</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>21-30%</TableCell>
                    <TableCell>高い貢献</TableCell>
                    <TableCell>20点</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>31-40%</TableCell>
                    <TableCell>やや高い貢献</TableCell>
                    <TableCell>17.5点</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>41-50%</TableCell>
                    <TableCell>標準的な貢献</TableCell>
                    <TableCell>15点</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>51-60%</TableCell>
                    <TableCell>やや低い貢献</TableCell>
                    <TableCell>12.5点</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>61-100%</TableCell>
                    <TableCell>改善が必要</TableCell>
                    <TableCell>10点以下</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div>
                <Label htmlFor="facility-activities">具体的な貢献活動</Label>
                <Textarea 
                  id="facility-activities" 
                  placeholder="サービス間協力の実績、レクリエーション参加、委員会活動など具体的に記入"
                  className="min-h-[100px]"
                />
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">施設貢献度点数</span>
                  <span className="text-2xl font-bold text-green-600">
                    {calculateContributionScore(facilityRank)} / 25点
                  </span>
                </div>
              </div>
            </TabsContent>

            {/* 法人貢献タブ */}
            <TabsContent value="corporate" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">法人貢献度評価（25点満点）</h3>
                <p className="text-sm text-gray-600 mb-4">
                  法人全体での貢献活動を相対評価で採点します（既存ポイント制度を活用）
                </p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold mb-2">評価対象となる貢献活動</h4>
                <ul className="text-sm space-y-1">
                  <li>• 法人内他施設への見学・応援（急性期病院、慢性期病棟等）</li>
                  <li>• 法人研修での積極的な参加・学習</li>
                  <li>• 法人イベント（健康フェア等）への参加・協力</li>
                  <li>• 法人看護部会・委員会への参加</li>
                  <li>• 地域連携活動への参加</li>
                  <li>• 法人理念実践プロジェクトへの参加</li>
                </ul>
              </div>

              <div>
                <Label htmlFor="corporate-points">法人貢献度ポイント</Label>
                <Input 
                  type="number" 
                  id="corporate-points" 
                  placeholder="取得ポイント数を入力"
                  className="mb-2"
                />
                <p className="text-sm text-gray-600">
                  法人内新人准看護師全体の中での相対的な位置づけを評価
                </p>
              </div>

              <div>
                <Label htmlFor="corporate-percentile">法人内パーセンタイル順位</Label>
                <div className="flex items-center space-x-4">
                  <Input 
                    type="number" 
                    id="corporate-percentile" 
                    value={corporateRank}
                    onChange={(e) => setCorporateRank(Number(e.target.value))}
                    min="1"
                    max="100"
                    className="w-24"
                  />
                  <span className="text-sm text-gray-600">
                    パーセンタイル（1=最上位、100=最下位）
                  </span>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>パーセンタイル</TableHead>
                    <TableHead>評価</TableHead>
                    <TableHead>点数</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>1-10%</TableCell>
                    <TableCell>極めて高い貢献</TableCell>
                    <TableCell>25点</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>11-20%</TableCell>
                    <TableCell>非常に高い貢献</TableCell>
                    <TableCell>22.5点</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>21-30%</TableCell>
                    <TableCell>高い貢献</TableCell>
                    <TableCell>20点</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>31-40%</TableCell>
                    <TableCell>やや高い貢献</TableCell>
                    <TableCell>17.5点</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>41-50%</TableCell>
                    <TableCell>標準的な貢献</TableCell>
                    <TableCell>15点</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>51-60%</TableCell>
                    <TableCell>やや低い貢献</TableCell>
                    <TableCell>12.5点</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>61-100%</TableCell>
                    <TableCell>改善が必要</TableCell>
                    <TableCell>10点以下</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div>
                <Label htmlFor="corporate-activities">具体的な貢献活動</Label>
                <Textarea 
                  id="corporate-activities" 
                  placeholder="法人内他施設見学、研修参加、地域連携活動など具体的に記入"
                  className="min-h-[100px]"
                />
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">法人貢献度点数</span>
                  <span className="text-2xl font-bold text-orange-600">
                    {calculateContributionScore(corporateRank)} / 25点
                  </span>
                </div>
              </div>
            </TabsContent>

            {/* 総合評価タブ */}
            <TabsContent value="summary" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">総合評価サマリー</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center">
                        <Award className="h-4 w-4 mr-2 text-blue-600" />
                        技術評価
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-blue-600">
                        {Math.round(calculateTechnicalScore() * 10) / 10} / 50点
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        360度評価による実力評価
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center">
                        <Building className="h-4 w-4 mr-2 text-green-600" />
                        施設貢献度
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-green-600">
                        {calculateContributionScore(facilityRank)} / 25点
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        老健内での相対評価
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center">
                        <Users className="h-4 w-4 mr-2 text-orange-600" />
                        法人貢献度
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-orange-600">
                        {calculateContributionScore(corporateRank)} / 25点
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        法人全体での相対評価
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg text-center">
                  <h4 className="text-lg font-semibold mb-2">総合点数</h4>
                  <p className={`text-4xl font-bold ${getScoreColor(totalScore)}`}>
                    {totalScore} / 100点
                  </p>
                  <Progress value={totalScore} className="h-4 mt-4 max-w-md mx-auto" />
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-3">評価ランク判定</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>点数帯</TableHead>
                        <TableHead>ランク</TableHead>
                        <TableHead>判定</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className={totalScore >= 90 ? 'bg-red-50' : ''}>
                        <TableCell>90点以上</TableCell>
                        <TableCell className="font-bold text-red-600">S</TableCell>
                        <TableCell>将来のリーダー候補（老健准看護師のエース）</TableCell>
                      </TableRow>
                      <TableRow className={totalScore >= 80 && totalScore < 90 ? 'bg-orange-50' : ''}>
                        <TableCell>80-89点</TableCell>
                        <TableCell className="font-bold text-orange-600">A</TableCell>
                        <TableCell>優秀な成長（期待を上回る）</TableCell>
                      </TableRow>
                      <TableRow className={totalScore >= 70 && totalScore < 80 ? 'bg-green-50' : ''}>
                        <TableCell>70-79点</TableCell>
                        <TableCell className="font-bold text-green-600">B</TableCell>
                        <TableCell>順調な成長（期待通り）</TableCell>
                      </TableRow>
                      <TableRow className={totalScore >= 60 && totalScore < 70 ? 'bg-blue-50' : ''}>
                        <TableCell>60-69点</TableCell>
                        <TableCell className="font-bold text-blue-600">C</TableCell>
                        <TableCell>標準的な成長（一部課題あり）</TableCell>
                      </TableRow>
                      <TableRow className={totalScore < 60 ? 'bg-gray-50' : ''}>
                        <TableCell>60点未満</TableCell>
                        <TableCell className="font-bold text-gray-600">D</TableCell>
                        <TableCell>要改善（重点的な指導が必要）</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div className="space-y-4 mt-6">
                  <div>
                    <Label htmlFor="strengths">特に優れている点・強み</Label>
                    <Textarea 
                      id="strengths" 
                      placeholder="多職種協働への適応力、在宅復帰への理解、特定サービスでの成長など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="areas-for-improvement">改善・成長が期待される点</Label>
                    <Textarea 
                      id="areas-for-improvement" 
                      placeholder="他サービスへの理解、リハビリテーション看護の学習、コミュニケーションスキルなど"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="next-term-goals">次期目標（3ヶ月後）</Label>
                    <Textarea 
                      id="next-term-goals" 
                      placeholder="全サービスでの基礎業務習得、在宅復帰支援への参加、准看護師としての専門性向上など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="supervisor-comment">上司からの総評</Label>
                    <Textarea 
                      id="supervisor-comment" 
                      placeholder="老健新人准看護師としての成長度合い、チームへの適応、今後への期待など"
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* 保存ボタン */}
          <div className="flex justify-end space-x-4 pt-6 border-t mt-6">
            <Button variant="outline">一時保存</Button>
            <Button>評価を確定</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}