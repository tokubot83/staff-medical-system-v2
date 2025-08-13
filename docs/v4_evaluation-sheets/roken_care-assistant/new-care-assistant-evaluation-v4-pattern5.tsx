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

export default function NewCareAssistantEvaluationV4Pattern5() {
  // 評価項目の状態管理
  const [technicalScores, setTechnicalScores] = useState({
    superiorEval: { basic: 0, learning: 0, communication: 0, teamwork: 0 },
    selfEval: { basic: 0, learning: 0, communication: 0, teamwork: 0 }
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
            老健 新人介護士（1年目） 人事評価シート v4.0
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            パターン5改良版 - 基礎習得と職場適応・学習意欲を重視した評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              <strong>評価構成：</strong>技術評価（360度評価）50点 + 施設貢献（相対評価）25点 + 法人貢献（相対評価）25点
              <br />
              新人介護士は介護の基本技術習得と職場適応、介護福祉士からの指導への姿勢を重点的に評価します
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
                    <Label htmlFor="qualification">保有資格</Label>
                    <select id="qualification" className="w-full border rounded-md px-3 py-2">
                      <option value="">選択してください</option>
                      <option value="none">無資格</option>
                      <option value="shoninsya">介護職員初任者研修</option>
                      <option value="jissen">介護職員実務者研修</option>
                      <option value="herupaー">ホームヘルパー2級</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="previous-experience">前職経験</Label>
                    <Input type="text" id="previous-experience" placeholder="なし / 他業界○年（参考）" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="department">配属部門</Label>
                    <select id="department" className="w-full border rounded-md px-3 py-2">
                      <option value="">選択してください</option>
                      <option value="admission">入所サービス</option>
                      <option value="daycare">通所サービス</option>
                      <option value="both">入所・通所兼務</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="mentor">指導担当介護福祉士</Label>
                    <Input type="text" id="mentor" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">評価者情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="evaluator1">1次評価者（指導担当介護福祉士）</Label>
                    <Input type="text" id="evaluator1" />
                  </div>
                  <div>
                    <Label htmlFor="evaluator2">2次評価者（介護主任）</Label>
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
                  新人介護士は基本技術の習得と学習姿勢、職場適応を重視
                </p>
              </div>

              {/* 上司評価セクション */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-4 text-blue-600">指導担当者・上司評価（60％）</h4>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">1. 基本的介護技術の習得</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'basic', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`superior-basic-${grade}`} />
                            <Label htmlFor={`superior-basic-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-gray-500 mt-1">
                      S:期待以上の習得 A:順調な習得 B:標準的な習得 C:やや遅れ D:大幅な遅れ
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">2. 学習意欲と指導への姿勢</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'learning', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`superior-learning-${grade}`} />
                            <Label htmlFor={`superior-learning-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-gray-500 mt-1">
                      S:自主的学習と積極質問 A:前向きな学習姿勢 B:基本的な学習姿勢 C:受動的 D:学習意欲低い
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">3. 利用者・家族とのコミュニケーション</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'communication', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`superior-communication-${grade}`} />
                            <Label htmlFor={`superior-communication-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-gray-500 mt-1">
                      S:優れた関係構築 A:良好なコミュニケーション B:基本的対応 C:改善必要 D:要指導
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">4. チームワーク・職場適応</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'teamwork', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`superior-teamwork-${grade}`} />
                            <Label htmlFor={`superior-teamwork-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-gray-500 mt-1">
                      S:チームに積極貢献 A:良好な協調性 B:基本的な協調 C:消極的 D:協調性に課題
                    </p>
                  </div>
                </div>
              </div>

              {/* 本人評価セクション */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-4 text-green-600">本人評価（40％）</h4>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">1. 基本的介護技術の習得</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'basic', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`self-basic-${grade}`} />
                            <Label htmlFor={`self-basic-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">2. 学習意欲と指導への姿勢</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'learning', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`self-learning-${grade}`} />
                            <Label htmlFor={`self-learning-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">3. 利用者・家族とのコミュニケーション</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'communication', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`self-communication-${grade}`} />
                            <Label htmlFor={`self-communication-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">4. チームワーク・職場適応</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'teamwork', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`self-teamwork-${grade}`} />
                            <Label htmlFor={`self-teamwork-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              {/* 自己振り返り */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <Label htmlFor="self-reflection">自己振り返り・学習目標</Label>
                <Textarea 
                  id="self-reflection" 
                  placeholder="介護の仕事で心がけていること、学んだこと、今後の学習目標など"
                  className="min-h-[100px] mt-2"
                />
              </div>
            </TabsContent>

            {/* 施設貢献タブ（25点）*/}
            <TabsContent value="facility" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">施設貢献評価（25点）- 組織貢献度ポイント</h3>
                <p className="text-sm text-gray-600 mb-4">
                  新人介護士は基本業務の習得と積極的な参加姿勢を中心に評価
                </p>
              </div>

              {/* ポイント集計表 */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>貢献項目</TableHead>
                    <TableHead>ポイント</TableHead>
                    <TableHead>具体例・実績</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">基本業務の習得・実践</TableCell>
                    <TableCell>
                      <Input type="number" className="w-20" placeholder="0" />
                    </TableCell>
                    <TableCell>
                      <Input type="text" placeholder="清掃業務、配膳・下膳、見守り業務等" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">研修・勉強会参加</TableCell>
                    <TableCell>
                      <Input type="number" className="w-20" placeholder="0" />
                    </TableCell>
                    <TableCell>
                      <Input type="text" placeholder="新人研修参加、施設内勉強会参加など" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">行事・レクリエーション協力</TableCell>
                    <TableCell>
                      <Input type="number" className="w-20" placeholder="0" />
                    </TableCell>
                    <TableCell>
                      <Input type="text" placeholder="季節行事サポート、レクリエーション補助など" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">業務改善への気づき報告</TableCell>
                    <TableCell>
                      <Input type="number" className="w-20" placeholder="0" />
                    </TableCell>
                    <TableCell>
                      <Input type="text" placeholder="気づき報告、改善提案、ヒヤリハット報告など" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">その他の積極的行動</TableCell>
                    <TableCell>
                      <Input type="number" className="w-20" placeholder="0" />
                    </TableCell>
                    <TableCell>
                      <Input type="text" placeholder="自主的な環境整備、利用者対応補助など" />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="facility-total" className="text-lg font-semibold">施設貢献ポイント合計</Label>
                  <Input type="number" id="facility-total" className="w-24" placeholder="0" />
                </div>
                <div className="flex justify-between items-center">
                  <Label htmlFor="facility-rank" className="text-sm">同職種内でのパーセンタイル順位</Label>
                  <div className="flex items-center space-x-2">
                    <Input 
                      type="number" 
                      id="facility-rank" 
                      className="w-20" 
                      value={facilityRank}
                      onChange={(e) => setFacilityRank(parseInt(e.target.value) || 50)}
                      min="1" 
                      max="100" 
                    />
                    <span className="text-sm">%</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 法人貢献タブ（25点）*/}
            <TabsContent value="corporate" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">法人貢献評価（25点）- 組織貢献度ポイント</h3>
                <p className="text-sm text-gray-600 mb-4">
                  法人理念の理解と実践への意欲、成長への姿勢を評価
                </p>
              </div>

              {/* ポイント集計表 */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>貢献項目</TableHead>
                    <TableHead>ポイント</TableHead>
                    <TableHead>具体例・実績</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">法人理念の理解と実践</TableCell>
                    <TableCell>
                      <Input type="number" className="w-20" placeholder="0" />
                    </TableCell>
                    <TableCell>
                      <Input type="text" placeholder="在宅復帰支援への理解、利用者本位の姿勢など" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">資格取得・学習活動</TableCell>
                    <TableCell>
                      <Input type="number" className="w-20" placeholder="0" />
                    </TableCell>
                    <TableCell>
                      <Input type="text" placeholder="初任者研修受講、実務者研修受講、自主学習など" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">法人行事・研修参加</TableCell>
                    <TableCell>
                      <Input type="number" className="w-20" placeholder="0" />
                    </TableCell>
                    <TableCell>
                      <Input type="text" placeholder="法人合同研修参加、法人行事参加など" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">他施設見学・交流</TableCell>
                    <TableCell>
                      <Input type="number" className="w-20" placeholder="0" />
                    </TableCell>
                    <TableCell>
                      <Input type="text" placeholder="他施設見学参加、交流研修参加など" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">成長意欲・将来性</TableCell>
                    <TableCell>
                      <Input type="number" className="w-20" placeholder="0" />
                    </TableCell>
                    <TableCell>
                      <Input type="text" placeholder="介護福祉士資格取得意欲、キャリアアップ計画など" />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="corporate-total" className="text-lg font-semibold">法人貢献ポイント合計</Label>
                  <Input type="number" id="corporate-total" className="w-24" placeholder="0" />
                </div>
                <div className="flex justify-between items-center">
                  <Label htmlFor="corporate-rank" className="text-sm">同職種内でのパーセンタイル順位</Label>
                  <div className="flex items-center space-x-2">
                    <Input 
                      type="number" 
                      id="corporate-rank" 
                      className="w-20" 
                      value={corporateRank}
                      onChange={(e) => setCorporateRank(parseInt(e.target.value) || 50)}
                      min="1" 
                      max="100" 
                    />
                    <span className="text-sm">%</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 総合評価タブ */}
            <TabsContent value="summary" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">総合評価サマリー</h3>
                
                {/* 点数内訳 */}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg mb-6">
                  <h4 className="font-semibold mb-4">評価点数内訳</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center">
                        <Award className="h-4 w-4 mr-2 text-blue-600" />
                        技術評価（360度評価）
                      </span>
                      <span className="font-bold">{Math.round(calculateTechnicalScore() * 10) / 10} / 50点</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center">
                        <Building className="h-4 w-4 mr-2 text-green-600" />
                        施設貢献（相対評価）
                      </span>
                      <span className="font-bold">{calculateContributionScore(facilityRank)} / 25点</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-orange-600" />
                        法人貢献（相対評価）
                      </span>
                      <span className="font-bold">{calculateContributionScore(corporateRank)} / 25点</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between items-center">
                      <span className="text-lg font-semibold">総合得点</span>
                      <span className={`text-2xl font-bold ${getScoreColor(totalScore)}`}>
                        {totalScore} / 100点
                      </span>
                    </div>
                  </div>
                </div>

                {/* 評価グレード */}
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h4 className="font-semibold mb-3">総合評価グレード</h4>
                  <div className="text-center">
                    <div className={`text-4xl font-bold mb-2 ${getScoreColor(totalScore)}`}>
                      {totalScore >= 90 ? 'S' : 
                       totalScore >= 80 ? 'A' : 
                       totalScore >= 70 ? 'B' : 
                       totalScore >= 60 ? 'C' : 'D'}
                    </div>
                    <p className="text-sm text-gray-600">
                      {totalScore >= 90 ? '極めて優秀な新人介護士' : 
                       totalScore >= 80 ? '優秀な新人介護士' : 
                       totalScore >= 70 ? '順調に成長している新人' : 
                       totalScore >= 60 ? '標準的な新人介護士' : '要支援の新人介護士'}
                    </p>
                  </div>
                </div>

                {/* 強み・課題 */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <Label htmlFor="strengths">特に優れている点・強み</Label>
                    <Textarea 
                      id="strengths" 
                      placeholder="学習意欲、利用者との関係構築、チームワークなど"
                      className="min-h-[100px] mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="challenges">今後の成長課題</Label>
                    <Textarea 
                      id="challenges" 
                      placeholder="技術習得の加速、知識の拡充、専門性向上など"
                      className="min-h-[100px] mt-2"
                    />
                  </div>
                </div>

                {/* 次期目標 */}
                <div>
                  <Label htmlFor="next-goals">次期（3ヶ月後）の目標設定</Label>
                  <Textarea 
                    id="next-goals" 
                    placeholder="・基本介護技術の習熟（移乗・食事介助等）&#10;・利用者個別対応の理解&#10;・老健の特徴と在宅復帰支援への理解深化&#10;・初任者研修または実務者研修の受講"
                    className="min-h-[120px] mt-2"
                  />
                </div>

                {/* 育成計画 */}
                <div className="mt-4">
                  <Label htmlFor="development-plan">個別育成計画</Label>
                  <Textarea 
                    id="development-plan" 
                    placeholder="・介護技術OJTの継続（週2回）&#10;・老健の理念と在宅復帰支援の学習&#10;・多職種連携の理解促進&#10;・資格取得支援（初任者研修等）"
                    className="min-h-[120px] mt-2"
                  />
                </div>

                {/* 総合所見 */}
                <div className="mt-4">
                  <Label htmlFor="overall-assessment">総合所見</Label>
                  <Textarea 
                    id="overall-assessment" 
                    placeholder="新人介護士としての成長度、老健での適性、将来性、介護福祉士への道筋など"
                    className="min-h-[100px] mt-2"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* 保存ボタン */}
          <div className="flex justify-end space-x-4 pt-6 border-t mt-6">
            <Button variant="outline">下書き保存</Button>
            <Button>評価を確定</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}