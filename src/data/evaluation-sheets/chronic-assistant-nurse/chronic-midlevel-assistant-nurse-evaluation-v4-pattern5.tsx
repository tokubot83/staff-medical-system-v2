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
import { InfoIcon, Calculator, Award, Users, Building, Heart } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ChronicMidlevelAssistantNurseEvaluationV4Pattern5() {
  // 評価項目の状態管理
  const [technicalScores, setTechnicalScores] = useState({
    superiorEval: { skills: 0, knowledge: 0, patient: 0, safety: 0 },
    selfEval: { skills: 0, knowledge: 0, patient: 0, safety: 0 }
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
            【慢性期医療】中堅准看護師（4-7年目） 人事評価シート v4.0
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            パターン5改良版 - 慢性期ケアの専門性向上と指導力・チーム運営力を重視
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              <strong>評価構成：</strong>技術評価（360度評価）50点 + 施設貢献（相対評価）25点 + 法人貢献（相対評価）25点
              <br />
              慢性期医療における中堅准看護師は、専門的な療養ケアの実践とチーム指導・業務改善のリーダーシップを重点的に評価します
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
                  <Input type="text" id="eval-period" placeholder="2024年度上期 / 下期" />
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
                    <Input type="text" id="corp-experience" placeholder="4-7年目" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="department">配属病棟</Label>
                    <Input type="text" id="department" placeholder="例：療養病棟、認知症病棟" />
                  </div>
                  <div>
                    <Label htmlFor="leadership-role">リーダー役割</Label>
                    <Input type="text" id="leadership-role" placeholder="チームリーダー、教育担当等" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">評価者情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="evaluator1">1次評価者（主任看護師）</Label>
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
                  中堅准看護師は専門的な慢性期ケアの実践と後輩指導・チーム運営を重視
                </p>
              </div>

              {/* 上司評価セクション */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-4 text-blue-600">上司評価（60％）</h4>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">1. 高度な慢性期ケア技術の実践と応用</Label>
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
                      S:専門的実践の模範 A:高度な実践力 B:確実な実践 C:改善必要 D:要指導
                      <br />
                      （複雑な褥瘡管理、重度認知症ケア、終末期ケア、家族支援の実践等）
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">2. 慢性期医療の専門知識と問題解決力</Label>
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
                      S:卓越した専門性 A:高い専門知識 B:適切な知識 C:知識不足 D:大幅な不足
                      <br />
                      （複雑なケースへの対応、アセスメント力、ケアプラン立案への参画等）
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">3. 後輩指導とチームマネジメント</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'patient', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`superior-patient-${grade}`} />
                            <Label htmlFor={`superior-patient-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-gray-500 mt-1">
                      S:優れた指導力 A:効果的な指導 B:適切な指導 C:指導力不足 D:要改善
                      <br />
                      （新人・初級者の育成、チーム調整、業務配分、問題解決等）
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">4. 医療安全・質向上への主体的取り組み</Label>
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
                      S:リーダーシップ発揮 A:積極的関与 B:適切な実践 C:消極的 D:要改善
                      <br />
                      （インシデント分析、改善提案、安全文化の醸成、感染対策の推進等）
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <Label htmlFor="superior-comment">上司評価コメント</Label>
                  <Textarea 
                    id="superior-comment" 
                    placeholder="専門性の発揮状況、リーダーシップ、後輩育成の成果、改善点など具体的に記載"
                    className="min-h-[100px]"
                  />
                </div>
              </div>

              {/* 本人評価セクション */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-4 text-green-600">本人自己評価（40％）</h4>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">1. 高度な慢性期ケア技術の実践と応用</Label>
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
                    <Label className="text-sm font-medium">2. 慢性期医療の専門知識と問題解決力</Label>
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
                    <Label className="text-sm font-medium">3. 後輩指導とチームマネジメント</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'patient', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`self-patient-${grade}`} />
                            <Label htmlFor={`self-patient-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">4. 医療安全・質向上への主体的取り組み</Label>
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

                <div className="mt-4">
                  <Label htmlFor="self-reflection">自己評価・振り返り</Label>
                  <Textarea 
                    id="self-reflection" 
                    placeholder="専門性向上への取り組み、指導での工夫、チーム貢献、今後の目標など"
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
                  慢性期病棟でのリーダーシップ・業務改善・教育活動を評価
                  <br />
                  中堅准看護師として病棟運営への積極的関与とチーム牽引を重視
                </p>
              </div>

              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">評価対象項目</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start">
                      <span className="font-medium mr-2">1.</span>
                      <span>チームリーダーとしての業務遂行と調整力</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-medium mr-2">2.</span>
                      <span>慢性期ケアの質向上への改善活動主導</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-medium mr-2">3.</span>
                      <span>後輩育成プログラムの実施と成果</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-medium mr-2">4.</span>
                      <span>委員会活動でのリーダーシップ発揮</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-medium mr-2">5.</span>
                      <span>多職種連携の推進と調整役</span>
                    </div>
                  </div>
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
                    placeholder="リーダーシップの発揮事例、業務改善の成果、教育活動の実績など"
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
                  法人内の中堅准看護師全体での相対評価を実施
                </p>
              </div>

              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">評価対象項目</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start">
                      <span className="font-medium mr-2">1.</span>
                      <span>法人理念に基づく慢性期ケアの実践とモデル化</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-medium mr-2">2.</span>
                      <span>法人全体の患者満足度・QOL向上への貢献</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-medium mr-2">3.</span>
                      <span>法人研修での講師・ファシリテーター役</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-medium mr-2">4.</span>
                      <span>法人内での専門知識・技術の共有と伝承</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-medium mr-2">5.</span>
                      <span>看護師資格取得への挑戦と進捗（該当者）</span>
                    </div>
                  </div>
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
                    placeholder="法人全体への影響、専門性の発揮、教育・研修での貢献など"
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
                          <span className={`font-bold ${getScoreColor(totalScore)}`}>
                            {totalScore >= 90 ? 'S' : 
                             totalScore >= 80 ? 'A' :
                             totalScore >= 70 ? 'B' :
                             totalScore >= 60 ? 'C' : 'D'}
                          </span>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                {/* 評価コメント */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="strengths">特に優れている点（中堅准看護師としての観点から）</Label>
                    <Textarea 
                      id="strengths" 
                      placeholder="専門性の発揮、リーダーシップ、後輩育成の成果、改善活動など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="improvements">今後の成長課題</Label>
                    <Textarea 
                      id="improvements" 
                      placeholder="更なる専門性向上、管理能力開発、看護師資格への挑戦など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="development-plan">次期目標・育成計画</Label>
                    <Textarea 
                      id="development-plan" 
                      placeholder="ベテラン准看護師に向けた目標、必要な研修、キャリア開発支援など"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="border-t pt-4">
                    <Label htmlFor="final-comment">総合所見</Label>
                    <Textarea 
                      id="final-comment" 
                      placeholder="中堅准看護師としての成熟度、慢性期医療での影響力、将来の可能性など"
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