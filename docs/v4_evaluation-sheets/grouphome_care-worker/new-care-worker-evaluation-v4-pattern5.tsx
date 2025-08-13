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

export default function NewCareWorkerEvaluationV4Pattern5() {
  // 評価項目の状態管理
  const [technicalScores, setTechnicalScores] = useState({
    superiorEval: { skills: 0, knowledge: 0, resident: 0, safety: 0 },
    selfEval: { skills: 0, knowledge: 0, resident: 0, safety: 0 }
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
            グループホーム 新人介護福祉士（1年目） 人事評価シート v4.0
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            パターン5改良版 - 認知症ケアと生活支援の基礎習得を重視した評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              <strong>評価構成：</strong>技術評価（360度評価）50点 + 施設貢献（相対評価）25点 + 法人貢献（相対評価）25点
              <br />
              グループホームの理念「家庭的な環境での個別ケア」を基に、認知症ケアの基礎習得と入居者との関係構築を評価します
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
                    <Label htmlFor="previous-experience">前職経験</Label>
                    <Input type="text" id="previous-experience" placeholder="なし / 他施設○年（参考）" />
                  </div>
                  <div>
                    <Label htmlFor="education">資格・研修状況</Label>
                    <Input type="text" id="education" placeholder="介護福祉士 / 初任者研修修了" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="unit">配属ユニット</Label>
                    <Input type="text" id="unit" placeholder="○○ユニット" />
                  </div>
                  <div>
                    <Label htmlFor="mentor">指導担当者</Label>
                    <Input type="text" id="mentor" />
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
                    <Label htmlFor="evaluator2">2次評価者（ユニットリーダー・管理者）</Label>
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
                  グループホームでの認知症ケアと生活支援の基礎習得を評価
                </p>
              </div>

              {/* 上司評価セクション */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-4 text-blue-600">指導担当者・上司評価（60％）</h4>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">1. 基本的な生活支援技術</Label>
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
                      S:自立して確実に実施 A:概ね自立 B:指導下で実施 C:習得に遅れ D:大幅な指導必要
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">2. 認知症ケアの理解と実践</Label>
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
                      S:深い理解と創意工夫 A:良好な理解 B:基本的理解 C:理解不足 D:大幅な不足
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">3. 入居者・家族とのコミュニケーション</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'resident', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`superior-resident-${grade}`} />
                            <Label htmlFor={`superior-resident-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-gray-500 mt-1">
                      S:信頼関係構築が秀逸 A:良好な関係性 B:標準的 C:改善必要 D:要指導
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">4. リスク管理・安全配慮</Label>
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
                      S:高い安全意識 A:適切な配慮 B:基本的配慮 C:注意散漫 D:危険認識不足
                    </p>
                  </div>
                </div>
              </div>

              {/* 本人評価セクション */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-4 text-green-600">本人評価（40％）</h4>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">1. 基本的な生活支援技術</Label>
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
                    <Label className="text-sm font-medium">2. 認知症ケアの理解と実践</Label>
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
                    <Label className="text-sm font-medium">3. 入居者・家族とのコミュニケーション</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'resident', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`self-resident-${grade}`} />
                            <Label htmlFor={`self-resident-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">4. リスク管理・安全配慮</Label>
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

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">技術評価スコア</h4>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(calculateTechnicalScore() * 10) / 10} / 50点
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  上司評価（60%）+ 本人評価（40%）の総合評価
                </p>
              </div>
            </TabsContent>

            {/* 施設貢献評価タブ（25点）*/}
            <TabsContent value="facility" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">施設貢献評価（25点）- 相対評価</h3>
                <p className="text-sm text-gray-600 mb-4">
                  グループホーム内での貢献度を相対評価で測定
                  <br />
                  家庭的な環境づくりとチームワークへの貢献を重視
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">施設内での貢献度評価項目</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-green-600">1</span>
                      </div>
                      <span className="text-sm">家庭的な環境づくりへの積極的な取り組み</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-green-600">2</span>
                      </div>
                      <span className="text-sm">ユニット運営への協力姿勢（当番業務、環境整備等）</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-green-600">3</span>
                      </div>
                      <span className="text-sm">チームメンバーとの連携・情報共有の質</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-green-600">4</span>
                      </div>
                      <span className="text-sm">入居者の個別ニーズへの対応力</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-green-600">5</span>
                      </div>
                      <span className="text-sm">行事・レクリエーション活動への参加・企画</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="facility-rank">施設内順位（パーセンタイル）</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <Input
                      type="number"
                      id="facility-rank"
                      value={facilityRank}
                      onChange={(e) => setFacilityRank(Number(e.target.value))}
                      min="1"
                      max="100"
                      className="w-24"
                    />
                    <span className="text-sm text-gray-600">%</span>
                    <span className="text-sm font-medium text-green-600">
                      → {calculateContributionScore(facilityRank)}点
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    例：上位10%=25点、上位50%=15点、上位90%=5点
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">評価の観点</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• 新人として学ぶ姿勢と成長意欲</li>
                    <li>• グループホームの理念理解と実践</li>
                    <li>• 入居者の「その人らしさ」を大切にする姿勢</li>
                    <li>• 小規模施設特有のチームワークへの貢献</li>
                  </ul>
                </div>

                <div>
                  <Label htmlFor="facility-evidence">具体的な貢献事例</Label>
                  <Textarea
                    id="facility-evidence"
                    placeholder="家庭的な雰囲気づくりの工夫、入居者との関わりでの成功事例、チーム連携での貢献など"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* 法人貢献評価タブ（25点）*/}
            <TabsContent value="corporate" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">法人貢献評価（25点）- 相対評価</h3>
                <p className="text-sm text-gray-600 mb-4">
                  法人全体での貢献度を相対評価で測定
                  <br />
                  法人理念の実践と組織活動への参加を評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">法人レベルでの貢献度評価項目</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-orange-600">1</span>
                      </div>
                      <span className="text-sm">法人理念・行動指針の理解と実践</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-orange-600">2</span>
                      </div>
                      <span className="text-sm">法人内研修・勉強会への積極的参加</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-orange-600">3</span>
                      </div>
                      <span className="text-sm">他事業所との連携・協力姿勢</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-orange-600">4</span>
                      </div>
                      <span className="text-sm">地域貢献活動への参加</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-orange-600">5</span>
                      </div>
                      <span className="text-sm">法人のイメージ向上への貢献</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="corporate-rank">法人内順位（パーセンタイル）</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <Input
                      type="number"
                      id="corporate-rank"
                      value={corporateRank}
                      onChange={(e) => setCorporateRank(Number(e.target.value))}
                      min="1"
                      max="100"
                      className="w-24"
                    />
                    <span className="text-sm text-gray-600">%</span>
                    <span className="text-sm font-medium text-orange-600">
                      → {calculateContributionScore(corporateRank)}点
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    新人介護福祉士全体の中での相対的な位置づけ
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">評価の観点</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• 新人研修での学習態度と習得度</li>
                    <li>• 法人の価値観・文化への適応</li>
                    <li>• 他施設職員との交流・学び合い</li>
                    <li>• 将来の成長可能性</li>
                  </ul>
                </div>

                <div>
                  <Label htmlFor="corporate-evidence">具体的な貢献事例</Label>
                  <Textarea
                    id="corporate-evidence"
                    placeholder="法人研修での発表、他事業所見学での学び、地域活動への参加など"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* 総合評価タブ */}
            <TabsContent value="summary" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">総合評価サマリー</h3>
              </div>

              {/* 点数内訳表 */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-bold">評価項目</TableHead>
                      <TableHead className="text-center font-bold">配点</TableHead>
                      <TableHead className="text-center font-bold">獲得点</TableHead>
                      <TableHead className="text-center font-bold">達成率</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Award className="h-4 w-4 mr-2 text-blue-600" />
                          技術評価（360度評価）
                        </div>
                      </TableCell>
                      <TableCell className="text-center">50点</TableCell>
                      <TableCell className="text-center font-bold text-blue-600">
                        {Math.round(calculateTechnicalScore() * 10) / 10}点
                      </TableCell>
                      <TableCell className="text-center">
                        {Math.round(calculateTechnicalScore() * 2)}%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2 text-green-600" />
                          施設貢献（相対評価）
                        </div>
                      </TableCell>
                      <TableCell className="text-center">25点</TableCell>
                      <TableCell className="text-center font-bold text-green-600">
                        {calculateContributionScore(facilityRank)}点
                      </TableCell>
                      <TableCell className="text-center">
                        {Math.round(calculateContributionScore(facilityRank) * 4)}%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-orange-600" />
                          法人貢献（相対評価）
                        </div>
                      </TableCell>
                      <TableCell className="text-center">25点</TableCell>
                      <TableCell className="text-center font-bold text-orange-600">
                        {calculateContributionScore(corporateRank)}点
                      </TableCell>
                      <TableCell className="text-center">
                        {Math.round(calculateContributionScore(corporateRank) * 4)}%
                      </TableCell>
                    </TableRow>
                    <TableRow className="bg-gray-50 font-bold">
                      <TableCell>総合計</TableCell>
                      <TableCell className="text-center">100点</TableCell>
                      <TableCell className={`text-center text-xl ${getScoreColor(totalScore)}`}>
                        {totalScore}点
                      </TableCell>
                      <TableCell className="text-center">{totalScore}%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* 評価ランク */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg">
                <h4 className="font-semibold mb-3">総合評価ランク</h4>
                <div className="flex items-center justify-center">
                  <div className={`text-4xl font-bold ${getScoreColor(totalScore)}`}>
                    {totalScore >= 90 ? 'S' :
                     totalScore >= 80 ? 'A' :
                     totalScore >= 70 ? 'B' :
                     totalScore >= 60 ? 'C' : 'D'}
                  </div>
                  <div className="ml-4 text-left">
                    <p className="font-medium">
                      {totalScore >= 90 ? '極めて優秀' :
                       totalScore >= 80 ? '優秀' :
                       totalScore >= 70 ? '良好' :
                       totalScore >= 60 ? '標準' : '要改善'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {totalScore >= 90 ? '新人として卓越した成長' :
                       totalScore >= 80 ? '期待を上回る成長' :
                       totalScore >= 70 ? '順調な成長過程' :
                       totalScore >= 60 ? '基準を満たす成長' : '追加支援が必要'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 強みと改善点 */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="strengths">特に優れている点</Label>
                  <Textarea
                    id="strengths"
                    placeholder="入居者との関係構築、学習意欲、チームワークなど"
                    className="min-h-[120px]"
                  />
                </div>
                <div>
                  <Label htmlFor="improvements">今後の成長課題</Label>
                  <Textarea
                    id="improvements"
                    placeholder="認知症ケアの深化、リスク管理、記録の充実など"
                    className="min-h-[120px]"
                  />
                </div>
              </div>

              {/* 次期目標 */}
              <div>
                <Label htmlFor="next-goals">次期（6ヶ月後）の目標設定</Label>
                <Textarea
                  id="next-goals"
                  placeholder="・基本業務の自立
・認知症ケアの実践力向上
・ユニット運営への積極的な参加
・個別ケアプランの理解と実践"
                  className="min-h-[120px]"
                />
              </div>

              {/* 育成計画 */}
              <div>
                <Label htmlFor="development-plan">個別育成計画</Label>
                <Textarea
                  id="development-plan"
                  placeholder="・認知症ケア専門研修の受講
・他ユニット研修の実施
・ケアプラン作成への参加
・家族対応スキルの向上支援"
                  className="min-h-[120px]"
                />
              </div>

              {/* 総合所見 */}
              <div>
                <Label htmlFor="overall-comment">総合所見</Label>
                <Textarea
                  id="overall-comment"
                  placeholder="グループホームの新人介護福祉士としての成長度、適性、今後の期待など"
                  className="min-h-[120px]"
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* 保存ボタン */}
          <div className="flex justify-end space-x-4 pt-6 border-t mt-6">
            <Button variant="outline">下書き保存</Button>
            <Button className="bg-blue-600 hover:bg-blue-700">評価を確定</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}