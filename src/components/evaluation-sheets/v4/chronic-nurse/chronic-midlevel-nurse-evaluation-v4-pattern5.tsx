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
import { InfoIcon, Calculator, Award, Users, Building, Star } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Type definitions
type TechnicalScoreCategory = 'leadership' | 'expertise' | 'education' | 'management';
type EvaluatorType = 'superiorEval' | 'selfEval';

export default function ChronicMidlevelNurseEvaluationV4Pattern5() {
  // 評価項目の状態管理
  const [technicalScores, setTechnicalScores] = useState<{
    [K in EvaluatorType]: Record<TechnicalScoreCategory, number>
  }>({
    superiorEval: { leadership: 0, expertise: 0, education: 0, management: 0 },
    selfEval: { leadership: 0, expertise: 0, education: 0, management: 0 }
  });

  const [contributionPoints, setContributionPoints] = useState({
    facility: 0,
    corporate: 0
  });

  const [totalScore, setTotalScore] = useState(0);
  const [facilityRank, setFacilityRank] = useState(50); // パーセンタイル
  const [corporateRank, setCorporateRank] = useState(50);

  // 評価グレードから点数への変換
  const gradeToScore: Record<string, number> = {
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

  const handleTechnicalScoreChange = (evaluator: EvaluatorType, category: TechnicalScoreCategory, grade: keyof typeof gradeToScore) => {
    setTechnicalScores(prev => ({
      ...prev,
      [evaluator]: {
        ...prev[evaluator],
        [category]: gradeToScore[grade]
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
            【慢性期医療】中堅看護師（4-6年目） 人事評価シート v4.0
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            パターン5改良版 - 慢性期ケアのリーダーシップと専門性を重視した評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              <strong>評価構成：</strong>技術評価（360度評価）50点 + 施設貢献（相対評価）25点 + 法人貢献（相対評価）25点
              <br />
              中堅看護師は慢性期ケアのリーダーシップ発揮と専門性の深化を重点的に評価します
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
                  <Input type="text" id="eval-period" placeholder="年次評価 / 昇進評価" />
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
                    <Input type="text" id="corp-experience" placeholder="例：5年目" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="previous-experience">前職経験</Label>
                    <Input type="text" id="previous-experience" placeholder="なし / 他病院○年（参考）" />
                  </div>
                  <div>
                    <Label htmlFor="certifications">保有資格・認定</Label>
                    <Input type="text" id="certifications" placeholder="認知症ケア専門士、終末期ケア認定等" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="department">配属病棟</Label>
                    <Input type="text" id="department" placeholder="例：療養病棟、認知症病棟" />
                  </div>
                  <div>
                    <Label htmlFor="roles">担当役割</Label>
                    <Input type="text" id="roles" placeholder="例：チームリーダー、認知症ケア担当" />
                  </div>
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

            {/* 技術評価タブ（50点）- 360度評価 */}
            <TabsContent value="technical" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">技術評価（50点）- 360度評価</h3>
                <p className="text-sm text-gray-600 mb-4">
                  上司評価60％（30点）＋ 本人評価40％（20点）で算出
                  <br />
                  慢性期ケアのリーダーシップと専門性を重視
                </p>
              </div>

              {/* 上司評価セクション */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-4 text-blue-600">主任・師長評価（60％）</h4>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">1. 慢性期ケアリーダーシップ</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'leadership', value as keyof typeof gradeToScore)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`superior-leadership-${grade}`} />
                            <Label htmlFor={`superior-leadership-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-gray-500 mt-1">
                      S:卓越したリーダーシップ A:効果的な指導力 B:標準的な指導 C:限定的 D:不十分
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">2. 慢性期ケアの専門性・実践力</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'expertise', value as keyof typeof gradeToScore)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`superior-expertise-${grade}`} />
                            <Label htmlFor={`superior-expertise-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-gray-500 mt-1">
                      S:高度な専門性で模範 A:優れた専門性 B:十分な専門性 C:専門性不足 D:要改善
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">3. 人材育成・教育活動</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'education', value as keyof typeof gradeToScore)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`superior-education-${grade}`} />
                            <Label htmlFor={`superior-education-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-gray-500 mt-1">
                      S:体系的な教育で成果 A:積極的な育成 B:標準的な指導 C:消極的 D:ほぼ無し
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">4. 病棟運営・マネジメント参画</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'management', value as keyof typeof gradeToScore)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`superior-management-${grade}`} />
                            <Label htmlFor={`superior-management-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-gray-500 mt-1">
                      S:運営の中核として機能 A:積極的な参画 B:適切な遂行 C:限定的 D:不参加
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <Label htmlFor="superior-comment">上司評価コメント</Label>
                  <Textarea 
                    id="superior-comment" 
                    placeholder="慢性期ケアのリーダーシップ、専門性の発揮、人材育成の成果など具体的に記載"
                    className="min-h-[100px]"
                  />
                </div>
              </div>

              {/* 本人評価セクション */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-4 text-green-600">本人自己評価（40％）</h4>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">1. 慢性期ケアリーダーシップ</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'leadership', value as keyof typeof gradeToScore)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`self-leadership-${grade}`} />
                            <Label htmlFor={`self-leadership-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">2. 慢性期ケアの専門性・実践力</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'expertise', value as keyof typeof gradeToScore)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`self-expertise-${grade}`} />
                            <Label htmlFor={`self-expertise-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">3. 人材育成・教育活動</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'education', value as keyof typeof gradeToScore)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`self-education-${grade}`} />
                            <Label htmlFor={`self-education-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">4. 病棟運営・マネジメント参画</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'management', value as keyof typeof gradeToScore)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`self-management-${grade}`} />
                            <Label htmlFor={`self-management-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="mt-4">
                  <Label htmlFor="self-reflection">自己評価・振り返り</Label>
                  <Textarea 
                    id="self-reflection" 
                    placeholder="中堅看護師としての役割遂行、リーダーシップの発揮、今後の目標など"
                    className="min-h-[100px]"
                  />
                </div>
              </div>

              {/* 技術評価サマリー */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">技術評価スコア</h4>
                <div className="flex justify-between items-center">
                  <span>上司評価（60％）+ 本人評価（40％）</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {Math.round(calculateTechnicalScore() * 10) / 10} / 50点
                  </span>
                </div>
              </div>
            </TabsContent>

            {/* 施設貢献タブ（25点）*/}
            <TabsContent value="facility" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">施設貢献評価（25点）- 相対評価</h3>
                <p className="text-sm text-gray-600 mb-4">
                  慢性期病棟でのリーダーシップと病棟運営への貢献を評価
                  <br />
                  既存の組織貢献度ポイント制度を活用し、同期・同職種内での相対評価を実施
                </p>
              </div>

              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">評価対象項目</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start">
                      <span className="font-medium mr-2">1.</span>
                      <span>慢性期チームのリーダーとしての活動・成果</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-medium mr-2">2.</span>
                      <span>人材育成・教育プログラムの構築と実施</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-medium mr-2">3.</span>
                      <span>療養環境改善・QOL向上プロジェクトの推進</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-medium mr-2">4.</span>
                      <span>委員会活動でのリーダーシップ・企画運営</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-medium mr-2">5.</span>
                      <span>病棟運営への参画・業務改善の推進</span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <Label htmlFor="facility-points" className="font-semibold">組織貢献度ポイント（参考）</Label>
                  <Input 
                    type="number" 
                    id="facility-points" 
                    placeholder="例：185ポイント" 
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    年間累計ポイントを記入（リーダー活動、教育実績、改善活動等）
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <Label htmlFor="facility-rank" className="font-semibold">施設内順位（パーセンタイル）</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <Input 
                      type="range" 
                      id="facility-rank" 
                      min="0" 
                      max="100" 
                      value={facilityRank}
                      onChange={(e) => setFacilityRank(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="font-bold text-lg w-20 text-right">{facilityRank}%</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">点数：</span>
                    <span className="font-bold text-green-600">
                      {calculateContributionScore(facilityRank)}点
                    </span>
                    <span className="ml-2">
                      (上位{facilityRank}%)
                    </span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="facility-contribution">具体的な貢献内容</Label>
                  <Textarea 
                    id="facility-contribution" 
                    placeholder="慢性期リーダーとしての実績、人材育成の成果、病棟運営への貢献など"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* 法人貢献タブ（25点）*/}
            <TabsContent value="corporate" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">法人貢献評価（25点）- 相対評価</h3>
                <p className="text-sm text-gray-600 mb-4">
                  法人全体への貢献・慢性期医療の専門性向上への取り組みを評価
                  <br />
                  法人内の中堅看護師全体での相対評価を実施
                </p>
              </div>

              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">評価対象項目</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start">
                      <span className="font-medium mr-2">1.</span>
                      <span>法人理念に基づく慢性期ケアの実践・モデル構築</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-medium mr-2">2.</span>
                      <span>患者満足度向上への顕著な貢献（表彰・評価）</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-medium mr-2">3.</span>
                      <span>法人横断的なプロジェクト・研究への参画</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-medium mr-2">4.</span>
                      <span>慢性期医療の専門資格取得・学会発表</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-medium mr-2">5.</span>
                      <span>他施設への知識共有・法人内教育への貢献</span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <Label htmlFor="corporate-points" className="font-semibold">法人貢献度ポイント（参考）</Label>
                  <Input 
                    type="number" 
                    id="corporate-points" 
                    placeholder="例：145ポイント" 
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    法人全体での活動ポイント（プロジェクト、資格、表彰、発表等）
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <Label htmlFor="corporate-rank" className="font-semibold">法人内順位（パーセンタイル）</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <Input 
                      type="range" 
                      id="corporate-rank" 
                      min="0" 
                      max="100" 
                      value={corporateRank}
                      onChange={(e) => setCorporateRank(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="font-bold text-lg w-20 text-right">{corporateRank}%</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">点数：</span>
                    <span className="font-bold text-orange-600">
                      {calculateContributionScore(corporateRank)}点
                    </span>
                    <span className="ml-2">
                      (上位{corporateRank}%)
                    </span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="corporate-contribution">法人への貢献内容</Label>
                  <Textarea 
                    id="corporate-contribution" 
                    placeholder="慢性期医療の専門性向上、法人プロジェクトでの成果、知識共有の実績など"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* 総合評価タブ */}
            <TabsContent value="summary" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">総合評価サマリー</h3>
                
                {/* 点数内訳表 */}
                <div className="border rounded-lg overflow-hidden mb-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>評価項目</TableHead>
                        <TableHead className="text-center">配点</TableHead>
                        <TableHead className="text-center">取得点</TableHead>
                        <TableHead className="text-center">評価詳細</TableHead>
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
                        <TableCell className="text-center text-sm">
                          上司60% + 本人40%
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
                        <TableCell className="text-center text-sm">
                          上位{facilityRank}%
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
                        <TableCell className="text-center text-sm">
                          上位{corporateRank}%
                        </TableCell>
                      </TableRow>
                      <TableRow className="bg-gray-50">
                        <TableCell className="font-bold">総合評価</TableCell>
                        <TableCell className="text-center font-bold">100点</TableCell>
                        <TableCell className={`text-center text-2xl font-bold ${getScoreColor(totalScore)}`}>
                          {totalScore}点
                        </TableCell>
                        <TableCell className="text-center">
                          -
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                {/* 評価コメント */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="strengths">特に優れている点（慢性期ケアの観点から）</Label>
                    <Textarea 
                      id="strengths" 
                      placeholder="リーダーシップの発揮、専門性の深さ、人材育成の成果など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="improvements">今後の成長課題</Label>
                    <Textarea 
                      id="improvements" 
                      placeholder="管理能力の向上、より広範な専門知識、組織マネジメントなど"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="development-plan">次期目標・育成計画</Label>
                    <Textarea 
                      id="development-plan" 
                      placeholder="管理職候補としての準備、専門認定の取得、法人プロジェクトへの参画など"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="border-t pt-4">
                    <Label htmlFor="final-comment">総合所見</Label>
                    <Textarea 
                      id="final-comment" 
                      placeholder="慢性期医療リーダーとしての評価、将来の管理職候補としての可能性など"
                      className="min-h-[120px]"
                    />
                  </div>
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