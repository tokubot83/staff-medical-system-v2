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
import { InfoIcon, Calculator, Award, Building, Users, UserCheck } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function RokenMidlevelAssistantNurseEvaluationV4Pattern5() {
  // 評価項目の状態管理
  const [technicalScores, setTechnicalScores] = useState({
    superiorEval: { 
      leadership: 0,        // チームリーダーシップ
      mentoring: 0,         // 後輩准看護師育成と知識伝承
      specialty: 0,         // 在宅復帰支援の専門性
      improvement: 0        // 業務改善と革新への貢献
    },
    selfEval: { 
      leadership: 0, 
      mentoring: 0, 
      specialty: 0, 
      improvement: 0 
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
            介護老人保健施設 ミドル准看護師（4-10年目） 人事評価シート v4.0
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            パターン5改良版 - チームリーダーシップと在宅復帰支援の専門性を重視した評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              <strong>評価構成：</strong>技術評価（360度評価）50点 + 施設貢献（相対評価）25点 + 法人貢献（相対評価）25点
              <br />
              4-10年目は組織の中核として、リーダーシップと専門性の発揮を評価します
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
                    <Label htmlFor="primary-service">主たる配属サービス</Label>
                    <Input type="text" id="primary-service" placeholder="入所 / 通所リハ / 訪問看護" />
                  </div>
                  <div>
                    <Label htmlFor="experience">老健経験年数</Label>
                    <Input type="text" id="experience" placeholder="6年3ヶ月" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="hire-date">入職年月日</Label>
                    <Input type="date" id="hire-date" />
                  </div>
                  <div>
                    <Label htmlFor="corp-experience">法人経験年数</Label>
                    <Input type="text" id="corp-experience" placeholder="6年6ヶ月" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="previous-experience">前職経験</Label>
                    <Input type="text" id="previous-experience" placeholder="○○病院3年（参考）" />
                  </div>
                  <div>
                    <Label htmlFor="total-experience">通算准看護師経験</Label>
                    <Input type="text" id="total-experience" placeholder="9年6ヶ月" />
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
                    <Label htmlFor="evaluator2">2次評価者（副院長・部長）</Label>
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
                  老健ミドル准看護師として組織の中核となるリーダーシップと専門性を360度評価で採点します
                  <br />
                  <span className="font-semibold">評価比率：上司評価60% + 自己評価40%</span>
                </p>
              </div>

              <div className="space-y-6">
                {/* チームリーダーシップ */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <UserCheck className="h-4 w-4 mr-2 text-blue-600" />
                    1. チームリーダーシップ
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    准看護師チームの統率と組織目標の達成への貢献
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">上司評価</Label>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'leadership', value)}>
                        <div className="space-y-2 mt-2">
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="S" id="leadership-superior-s" />
                            <Label htmlFor="leadership-superior-s" className="font-normal">
                              <span className="font-semibold">S：</span> 卓越したリーダーシップで組織目標を大幅に上回る成果を実現
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="A" id="leadership-superior-a" />
                            <Label htmlFor="leadership-superior-a" className="font-normal">
                              <span className="font-semibold">A：</span> 優れたリーダーシップで組織目標を確実に達成
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="B" id="leadership-superior-b" />
                            <Label htmlFor="leadership-superior-b" className="font-normal">
                              <span className="font-semibold">B：</span> 適切なリーダーシップでチームを統率
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="C" id="leadership-superior-c" />
                            <Label htmlFor="leadership-superior-c" className="font-normal">
                              <span className="font-semibold">C：</span> リーダーシップ発揮に課題があり、改善が必要
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="D" id="leadership-superior-d" />
                            <Label htmlFor="leadership-superior-d" className="font-normal">
                              <span className="font-semibold">D：</span> リーダーシップが不足し、組織運営に支障
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="border-t pt-3">
                      <Label className="text-sm font-medium">自己評価</Label>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'leadership', value)}>
                        <div className="flex space-x-4 mt-2">
                          {['S', 'A', 'B', 'C', 'D'].map(grade => (
                            <div key={grade} className="flex items-center">
                              <RadioGroupItem value={grade} id={`leadership-self-${grade.toLowerCase()}`} />
                              <Label htmlFor={`leadership-self-${grade.toLowerCase()}`} className="ml-2">
                                {grade}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                {/* 後輩准看護師育成と知識伝承 */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Users className="h-4 w-4 mr-2 text-green-600" />
                    2. 後輩准看護師育成と知識伝承
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    体系的な教育プログラムの実施と老健准看護師のスキル向上への貢献
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">上司評価</Label>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'mentoring', value)}>
                        <div className="space-y-2 mt-2">
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="S" id="mentor-superior-s" />
                            <Label htmlFor="mentor-superior-s" className="font-normal">
                              <span className="font-semibold">S：</span> 卓越した教育力で後輩の飛躍的成長を実現
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="A" id="mentor-superior-a" />
                            <Label htmlFor="mentor-superior-a" className="font-normal">
                              <span className="font-semibold">A：</span> 体系的な教育で後輩の確実な成長を支援
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="B" id="mentor-superior-b" />
                            <Label htmlFor="mentor-superior-b" className="font-normal">
                              <span className="font-semibold">B：</span> 適切な指導で後輩の成長をサポート
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="C" id="mentor-superior-c" />
                            <Label htmlFor="mentor-superior-c" className="font-normal">
                              <span className="font-semibold">C：</span> 指導力に課題があり、改善が必要
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="D" id="mentor-superior-d" />
                            <Label htmlFor="mentor-superior-d" className="font-normal">
                              <span className="font-semibold">D：</span> 教育・指導への取り組みが不足
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="border-t pt-3">
                      <Label className="text-sm font-medium">自己評価</Label>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'mentoring', value)}>
                        <div className="flex space-x-4 mt-2">
                          {['S', 'A', 'B', 'C', 'D'].map(grade => (
                            <div key={grade} className="flex items-center">
                              <RadioGroupItem value={grade} id={`mentor-self-${grade.toLowerCase()}`} />
                              <Label htmlFor={`mentor-self-${grade.toLowerCase()}`} className="ml-2">
                                {grade}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                {/* 在宅復帰支援の専門性 */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Award className="h-4 w-4 mr-2 text-orange-600" />
                    3. 在宅復帰支援の専門性
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    在宅復帰支援のエキスパートとしての実践と成果創出
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">上司評価</Label>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'specialty', value)}>
                        <div className="space-y-2 mt-2">
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="S" id="specialty-superior-s" />
                            <Label htmlFor="specialty-superior-s" className="font-normal">
                              <span className="font-semibold">S：</span> 在宅復帰支援のエキスパートとして卓越した成果を創出
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="A" id="specialty-superior-a" />
                            <Label htmlFor="specialty-superior-a" className="font-normal">
                              <span className="font-semibold">A：</span> 高い専門性で在宅復帰率向上に大きく貢献
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="B" id="specialty-superior-b" />
                            <Label htmlFor="specialty-superior-b" className="font-normal">
                              <span className="font-semibold">B：</span> 専門性を活かした在宅復帰支援を実践
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="C" id="specialty-superior-c" />
                            <Label htmlFor="specialty-superior-c" className="font-normal">
                              <span className="font-semibold">C：</span> 専門性の向上が必要
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="D" id="specialty-superior-d" />
                            <Label htmlFor="specialty-superior-d" className="font-normal">
                              <span className="font-semibold">D：</span> 専門性の発揮が不十分
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="border-t pt-3">
                      <Label className="text-sm font-medium">自己評価</Label>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'specialty', value)}>
                        <div className="flex space-x-4 mt-2">
                          {['S', 'A', 'B', 'C', 'D'].map(grade => (
                            <div key={grade} className="flex items-center">
                              <RadioGroupItem value={grade} id={`specialty-self-${grade.toLowerCase()}`} />
                              <Label htmlFor={`specialty-self-${grade.toLowerCase()}`} className="ml-2">
                                {grade}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                {/* 業務改善と革新への貢献 */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Calculator className="h-4 w-4 mr-2 text-purple-600" />
                    4. 業務改善と革新への貢献
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    組織の効率化と改善への積極的な取り組みと成果
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">上司評価</Label>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'improvement', value)}>
                        <div className="space-y-2 mt-2">
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="S" id="improvement-superior-s" />
                            <Label htmlFor="improvement-superior-s" className="font-normal">
                              <span className="font-semibold">S：</span> 革新的な改善提案で組織運営を大幅に向上
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="A" id="improvement-superior-a" />
                            <Label htmlFor="improvement-superior-a" className="font-normal">
                              <span className="font-semibold">A：</span> 積極的な改善活動で組織効率を向上
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="B" id="improvement-superior-b" />
                            <Label htmlFor="improvement-superior-b" className="font-normal">
                              <span className="font-semibold">B：</span> 業務改善に取り組み、一定の成果を創出
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="C" id="improvement-superior-c" />
                            <Label htmlFor="improvement-superior-c" className="font-normal">
                              <span className="font-semibold">C：</span> 改善への取り組みが消極的
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="D" id="improvement-superior-d" />
                            <Label htmlFor="improvement-superior-d" className="font-normal">
                              <span className="font-semibold">D：</span> 改善活動への参加が不足
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="border-t pt-3">
                      <Label className="text-sm font-medium">自己評価</Label>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'improvement', value)}>
                        <div className="flex space-x-4 mt-2">
                          {['S', 'A', 'B', 'C', 'D'].map(grade => (
                            <div key={grade} className="flex items-center">
                              <RadioGroupItem value={grade} id={`improvement-self-${grade.toLowerCase()}`} />
                              <Label htmlFor={`improvement-self-${grade.toLowerCase()}`} className="ml-2">
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
                  <li>• 准看護師チームの統括・管理</li>
                  <li>• 委員会活動の委員長・副委員長</li>
                  <li>• 在宅復帰支援プログラムの企画・運営</li>
                  <li>• 業務改善プロジェクトのリーダー</li>
                  <li>• 地域連携活動の中心的役割</li>
                  <li>• 施設内研修の企画・講師</li>
                  <li>• 新サービス開発への参画</li>
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
                  同期ミドル准看護師の中での相対的な位置づけを評価
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
                  placeholder="チーム統括実績、委員会運営、業務改善プロジェクトなど具体的に記入"
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
                  <li>• 法人内准看護師部門の統括・管理</li>
                  <li>• 法人研修の企画・講師</li>
                  <li>• 法人准看護師委員会での役員活動</li>
                  <li>• 地域包括ケアシステムでの中核的役割</li>
                  <li>• 法人経営戦略への参画</li>
                  <li>• 学会発表・研究活動での代表</li>
                  <li>• 法人ブランディング活動への貢献</li>
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
                  法人内ミドル准看護師全体の中での相対的な位置づけを評価
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
                  placeholder="法人統括活動、研修企画、経営参画など具体的に記入"
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
                        <TableCell>エキスパート（老健准看護師のリーダー）</TableCell>
                      </TableRow>
                      <TableRow className={totalScore >= 80 && totalScore < 90 ? 'bg-orange-50' : ''}>
                        <TableCell>80-89点</TableCell>
                        <TableCell className="font-bold text-orange-600">A</TableCell>
                        <TableCell>優秀な中核人材（期待を大きく上回る）</TableCell>
                      </TableRow>
                      <TableRow className={totalScore >= 70 && totalScore < 80 ? 'bg-green-50' : ''}>
                        <TableCell>70-79点</TableCell>  
                        <TableCell className="font-bold text-green-600">B</TableCell>
                        <TableCell>安定した中核人材（期待通り）</TableCell>
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
                      placeholder="リーダーシップ、専門性、教育力、改善力など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="areas-for-improvement">改善・成長が期待される点</Label>
                    <Textarea 
                      id="areas-for-improvement" 
                      placeholder="さらなるリーダーシップ開発、専門性向上など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="next-term-goals">次期目標（1年後）</Label>
                    <Textarea 
                      id="next-term-goals" 
                      placeholder="組織運営への参画、専門分野の確立、人材育成システムの構築など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="supervisor-comment">上司からの総評</Label>
                    <Textarea 
                      id="supervisor-comment" 
                      placeholder="ミドル准看護師としての貢献度、今後の期待役割、キャリア展望など"
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