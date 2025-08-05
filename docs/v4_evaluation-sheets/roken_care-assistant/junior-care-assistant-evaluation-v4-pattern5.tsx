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

export default function JuniorCareAssistantEvaluationV4Pattern5() {
  // 評価項目の状態管理
  const [technicalScores, setTechnicalScores] = useState({
    superiorEval: { skills: 0, independence: 0, support: 0, growth: 0 },
    selfEval: { skills: 0, independence: 0, support: 0, growth: 0 }
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
            老健 ジュニア介護士（2-3年目） 人事評価シート v4.0
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            パターン5改良版 - 自立性向上と後輩サポートを重視した評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              <strong>評価構成：</strong>技術評価（360度評価）50点 + 施設貢献（相対評価）25点 + 法人貢献（相対評価）25点
              <br />
              ジュニア介護士は業務の自立性向上と新人サポート、専門性向上への取り組みを重点的に評価します
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
                  <Label htmlFor="experience">経験年数</Label>
                  <select id="experience" className="w-full border rounded-md px-3 py-2">
                    <option value="">選択してください</option>
                    <option value="2">2年目</option>
                    <option value="3">3年目</option>
                  </select>
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
                    <Input type="text" id="corp-experience" placeholder="2-3年目" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="qualification">保有資格</Label>
                    <select id="qualification" className="w-full border rounded-md px-3 py-2">
                      <option value="">選択してください</option>
                      <option value="shoninsya">介護職員初任者研修</option>
                      <option value="jissen">介護職員実務者研修</option>
                      <option value="studying">介護福祉士受験予定</option>
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
                    <Label htmlFor="mentor-role">新人指導役割</Label>
                    <select id="mentor-role" className="w-full border rounded-md px-3 py-2">
                      <option value="">選択してください</option>
                      <option value="yes">新人サポート担当あり</option>
                      <option value="no">なし</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">評価者情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="evaluator1">1次評価者（介護福祉士・主任）</Label>
                    <Input type="text" id="evaluator1" />
                  </div>
                  <div>
                    <Label htmlFor="evaluator2">2次評価者（管理者）</Label>
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
                  ジュニア介護士は自立性向上と後輩サポート能力を重視
                </p>
              </div>

              {/* 上司評価セクション */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-4 text-blue-600">上司評価（60％）</h4>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">1. 介護技術の習熟と自立性</Label>
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
                      S:高い技術で自立実施 A:確実な技術で自立 B:基本的技術習得 C:一部要支援 D:継続指導必要
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">2. 在宅復帰支援への理解と実践</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'independence', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`superior-independence-${grade}`} />
                            <Label htmlFor={`superior-independence-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-gray-500 mt-1">
                      S:積極的に支援実践 A:理解して実践 B:基本的理解 C:理解不足 D:関心が低い
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">3. 新人サポート・チーム貢献</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'support', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`superior-support-${grade}`} />
                            <Label htmlFor={`superior-support-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-gray-500 mt-1">
                      S:積極的に新人指導 A:適切なサポート B:基本的協力 C:消極的 D:協力不足
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">4. 専門性への成長意欲</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'growth', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`superior-growth-${grade}`} />
                            <Label htmlFor={`superior-growth-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-gray-500 mt-1">
                      S:自主的な学習・向上 A:積極的な成長志向 B:基本的向上心 C:やや消極的 D:成長意欲低い
                    </p>
                  </div>
                </div>
              </div>

              {/* 本人評価セクション */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-4 text-green-600">本人評価（40％）</h4>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">1. 介護技術の習熟と自立性</Label>
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
                    <Label className="text-sm font-medium">2. 在宅復帰支援への理解と実践</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'independence', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`self-independence-${grade}`} />
                            <Label htmlFor={`self-independence-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">3. 新人サポート・チーム貢献</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'support', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`self-support-${grade}`} />
                            <Label htmlFor={`self-support-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">4. 専門性への成長意欲</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'growth', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`self-growth-${grade}`} />
                            <Label htmlFor={`self-growth-${grade}`} className="font-normal">{grade}</Label>
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
                  placeholder="2-3年目として成長した点、新人サポートでの学び、今後の専門性向上目標など"
                  className="min-h-[100px] mt-2"
                />
              </div>
            </TabsContent>

            {/* 施設貢献タブ（25点）*/}
            <TabsContent value="facility" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">施設貢献評価（25点）- 組織貢献度ポイント</h3>
                <p className="text-sm text-gray-600 mb-4">
                  ジュニア介護士は新人サポートと積極的な業務参加、改善提案を重視
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
                    <TableCell className="font-medium">新人指導・サポート</TableCell>
                    <TableCell>
                      <Input type="number" className="w-20" placeholder="0" />
                    </TableCell>
                    <TableCell>
                      <Input type="text" placeholder="新人への技術指導、相談対応、OJTサポートなど" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">委員会・勉強会参加</TableCell>
                    <TableCell>
                      <Input type="number" className="w-20" placeholder="0" />
                    </TableCell>
                    <TableCell>
                      <Input type="text" placeholder="委員会活動、勉強会参加、発表など" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">業務改善・効率化提案</TableCell>
                    <TableCell>
                      <Input type="number" className="w-20" placeholder="0" />
                    </TableCell>
                    <TableCell>
                      <Input type="text" placeholder="業務改善提案、効率化アイデア、問題解決など" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">行事・レクリエーション企画</TableCell>
                    <TableCell>
                      <Input type="number" className="w-20" placeholder="0" />
                    </TableCell>
                    <TableCell>
                      <Input type="text" placeholder="季節行事企画、レクリエーション立案・実施など" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">利用者・家族満足度向上</TableCell>
                    <TableCell>
                      <Input type="number" className="w-20" placeholder="0" />
                    </TableCell>
                    <TableCell>
                      <Input type="text" placeholder="個別対応の工夫、家族との良好な関係構築など" />
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
                  資格取得への取り組み、法人理念の実践、成長への意欲を評価
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
                    <TableCell className="font-medium">資格取得・専門性向上</TableCell>
                    <TableCell>
                      <Input type="number" className="w-20" placeholder="0" />
                    </TableCell>
                    <TableCell>
                      <Input type="text" placeholder="実務者研修受講、介護福祉士受験準備、専門研修参加など" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">法人研修・発表参加</TableCell>
                    <TableCell>
                      <Input type="number" className="w-20" placeholder="0" />
                    </TableCell>
                    <TableCell>
                      <Input type="text" placeholder="法人研修参加、事例発表、研修アシスタントなど" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">法人内交流・連携</TableCell>
                    <TableCell>
                      <Input type="number" className="w-20" placeholder="0" />
                    </TableCell>
                    <TableCell>
                      <Input type="text" placeholder="他施設見学、法人内研修交流、情報共有など" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">採用・広報活動協力</TableCell>
                    <TableCell>
                      <Input type="number" className="w-20" placeholder="0" />
                    </TableCell>
                    <TableCell>
                      <Input type="text" placeholder="採用面接同席、施設見学案内、体験談発表など" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">キャリアアップ計画</TableCell>
                    <TableCell>
                      <Input type="number" className="w-20" placeholder="0" />
                    </TableCell>
                    <TableCell>
                      <Input type="text" placeholder="将来計画の明確化、目標設定、継続学習など" />
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
                      {totalScore >= 90 ? '極めて優秀なジュニア介護士' : 
                       totalScore >= 80 ? '優秀なジュニア介護士' : 
                       totalScore >= 70 ? '期待通り成長しているスタッフ' : 
                       totalScore >= 60 ? '標準的なジュニア介護士' : '要支援のジュニア介護士'}
                    </p>
                  </div>
                </div>

                {/* 強み・課題 */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <Label htmlFor="strengths">特に優れている点・強み</Label>
                    <Textarea 
                      id="strengths" 
                      placeholder="自立性、新人サポート力、チーム貢献、成長意欲など"
                      className="min-h-[100px] mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="challenges">今後の成長課題</Label>
                    <Textarea 
                      id="challenges" 
                      placeholder="専門性の深化、指導力向上、資格取得など"
                      className="min-h-[100px] mt-2"
                    />
                  </div>
                </div>

                {/* 次期目標 */}
                <div>
                  <Label htmlFor="next-goals">次期（6ヶ月後）の目標設定</Label>
                  <Textarea 
                    id="next-goals" 
                    placeholder="・実務者研修修了または介護福祉士受験&#10;・新人指導の質向上&#10;・委員会活動での積極参加&#10;・専門分野の知識深化"
                    className="min-h-[120px] mt-2"
                  />
                </div>

                {/* キャリアパス */}
                <div className="mt-4">
                  <Label htmlFor="career-path">キャリアパス・将来像</Label>
                  <Textarea 
                    id="career-path" 
                    placeholder="・介護福祉士資格取得後の専門性向上&#10;・指導的役割への準備&#10;・専門分野（認知症ケア等）への特化&#10;・将来的なリーダー候補としての育成"
                    className="min-h-[120px] mt-2"
                  />
                </div>

                {/* 総合所見 */}
                <div className="mt-4">
                  <Label htmlFor="overall-assessment">総合所見</Label>
                  <Textarea 
                    id="overall-assessment" 
                    placeholder="ジュニア介護士としての成長度、老健での適性、今後の期待など"
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