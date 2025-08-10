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

export default function ChronicVeteranAssistantNurseEvaluationV4Pattern5() {
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
            【慢性期医療】ベテラン准看護師（8年目以上） 人事評価シート v4.0
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            パターン5改良版 - 慢性期ケアの熟練性と組織への影響力・後進育成を重視
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              <strong>評価構成：</strong>技術評価（360度評価）50点 + 施設貢献（相対評価）25点 + 法人貢献（相対評価）25点
              <br />
              慢性期医療におけるベテラン准看護師は、卓越した療養ケアの実践と組織文化の醸成・知識技術の伝承を重点的に評価します
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
                    <Input type="text" id="corp-experience" placeholder="8年以上" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="department">配属病棟</Label>
                    <Input type="text" id="department" placeholder="例：療養病棟、認知症病棟" />
                  </div>
                  <div>
                    <Label htmlFor="mentor-role">メンター・指導役割</Label>
                    <Input type="text" id="mentor-role" placeholder="教育責任者、実習指導者等" />
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
                  ベテラン准看護師は卓越した慢性期ケアの実践と組織への影響力・知識技術の伝承を重視
                </p>
              </div>

              {/* 上司評価セクション */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-4 text-blue-600">上司評価（60％）</h4>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">1. 卓越した慢性期ケア技術と専門性</Label>
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
                      S:模範的・革新的実践 A:卓越した実践 B:高度な実践 C:標準的実践 D:要改善
                      <br />
                      （困難事例への対応、複雑な終末期ケア、高度な認知症ケア、家族支援のエキスパート等）
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">2. 慢性期医療の深い知識と革新的提案</Label>
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
                      S:革新的な知識活用 A:深い専門知識 B:豊富な知識 C:適切な知識 D:知識更新必要
                      <br />
                      （エビデンスに基づく実践、新しいケア方法の導入、ケアの標準化推進等）
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">3. 組織文化の醸成と後進育成への貢献</Label>
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
                      S:卓越した影響力 A:強い影響力 B:良好な貢献 C:適切な貢献 D:消極的
                      <br />
                      （メンタリング、技術伝承、組織文化の構築、チーム精神の醸成等）
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">4. 組織全体の質向上とリスク管理への主導</Label>
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
                      S:組織変革の推進者 A:積極的な主導 B:確実な貢献 C:適切な関与 D:要改善
                      <br />
                      （システム改善、プロトコル作成、安全文化の確立、教育体系の構築等）
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <Label htmlFor="superior-comment">上司評価コメント</Label>
                  <Textarea 
                    id="superior-comment" 
                    placeholder="ベテランとしての模範性、組織への影響力、後進育成の成果、今後の期待など具体的に記載"
                    className="min-h-[100px]"
                  />
                </div>
              </div>

              {/* 本人評価セクション */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-4 text-green-600">本人自己評価（40％）</h4>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">1. 卓越した慢性期ケア技術と専門性</Label>
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
                    <Label className="text-sm font-medium">2. 慢性期医療の深い知識と革新的提案</Label>
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
                    <Label className="text-sm font-medium">3. 組織文化の醸成と後進育成への貢献</Label>
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
                    <Label className="text-sm font-medium">4. 組織全体の質向上とリスク管理への主導</Label>
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
                    placeholder="長年の経験を通じた成長、組織への貢献、後進育成での工夫、今後の抱負など"
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
                  慢性期病棟での組織運営への貢献・文化醸成・教育体系構築を評価
                  <br />
                  ベテラン准看護師として組織の要としての役割発揮を重視
                </p>
              </div>

              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">評価対象項目</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start">
                      <span className="font-medium mr-2">1.</span>
                      <span>組織の要としての調整・問題解決力</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-medium mr-2">2.</span>
                      <span>慢性期ケアの質向上システムの構築・運用</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-medium mr-2">3.</span>
                      <span>教育体系の確立と後進育成の成果</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-medium mr-2">4.</span>
                      <span>施設運営への参画と戦略的提言</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-medium mr-2">5.</span>
                      <span>地域連携・外部機関との協働推進</span>
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
                    placeholder="組織運営への影響、教育システムの構築、文化醸成の成果など"
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
                  法人全体への貢献・慢性期医療のモデル構築・組織横断的な活動を評価
                  <br />
                  法人内のベテラン准看護師全体での相対評価を実施
                </p>
              </div>

              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">評価対象項目</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start">
                      <span className="font-medium mr-2">1.</span>
                      <span>法人理念の体現と慢性期ケアモデルの確立</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-medium mr-2">2.</span>
                      <span>法人全体の質向上への戦略的貢献</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-medium mr-2">3.</span>
                      <span>法人教育プログラムの開発・講師活動</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-medium mr-2">4.</span>
                      <span>法人内外での知識・技術の普及活動</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-medium mr-2">5.</span>
                      <span>後継者育成とキャリア開発支援</span>
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
                    placeholder="法人戦略への貢献、教育プログラム開発、外部活動での法人代表としての活動など"
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
                    <Label htmlFor="strengths">特に優れている点（ベテラン准看護師としての観点から）</Label>
                    <Textarea 
                      id="strengths" 
                      placeholder="卓越した専門性、組織への影響力、後進育成の成果、模範的な実践など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="improvements">今後の期待と課題</Label>
                    <Textarea 
                      id="improvements" 
                      placeholder="更なる組織貢献、知識技術の体系化、後継者育成の強化など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="development-plan">今後の役割と活躍領域</Label>
                    <Textarea 
                      id="development-plan" 
                      placeholder="専門分野での更なる活躍、組織開発への参画、教育システムの発展など"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="border-t pt-4">
                    <Label htmlFor="final-comment">総合所見</Label>
                    <Textarea 
                      id="final-comment" 
                      placeholder="ベテラン准看護師としての価値、組織への貢献度、今後の期待と要望など"
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