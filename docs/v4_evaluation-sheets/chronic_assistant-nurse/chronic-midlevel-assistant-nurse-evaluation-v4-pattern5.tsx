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

export default function ChronicMidlevelAssistantNurseEvaluationV4Pattern5() {
  // 評価項目の状態管理
  const [technicalScores, setTechnicalScores] = useState({
    superiorEval: { expertise: 0, leadership: 0, education: 0, innovation: 0 },
    selfEval: { expertise: 0, leadership: 0, education: 0, innovation: 0 }
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
            【慢性期医療】ミドルレベル准看護師（4-10年目） 人事評価シート v4.0
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
              ミドルレベル准看護師は慢性期ケアのリーダーシップ発揮と専門性の深化を重点的に評価します
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
                  <Input type="text" id="eval-period" placeholder="定期評価 / 昇格評価 / 臨時評価" />
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
                    <Input type="text" id="corp-experience" placeholder="例：7年目" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="department">配属病棟</Label>
                    <Input type="text" id="department" placeholder="慢性期病棟3階" />
                  </div>
                  <div>
                    <Label htmlFor="roles">担当役割・専門分野</Label>
                    <Input type="text" id="roles" placeholder="例：チームリーダー、認知症ケア担当" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="previous-experience">前職経験</Label>
                    <Input type="text" id="previous-experience" placeholder="なし / 他病院○年（参考）" />
                  </div>
                  <div>
                    <Label htmlFor="certifications">取得資格・専門研修</Label>
                    <Input type="text" id="certifications" placeholder="認知症ケア専門士、褥瘡管理など" />
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

            {/* 技術評価タブ */}
            <TabsContent value="technical" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">技術評価（360度評価）- 50点</h3>
                <p className="text-sm text-gray-600 mb-4">
                  慢性期ケアの専門性とリーダーシップ能力を評価します。
                  上司評価（60%）と自己評価（40%）の総合評価で算出されます。
                </p>
              </div>

              <Alert className="mb-4">
                <InfoIcon className="h-4 w-4" />
                <AlertDescription>
                  各項目を5段階（S/A/B/C/D）で評価してください。
                  ミドルレベル准看護師は専門性の発揮とチームリーダーとしての役割を重視して評価します。
                </AlertDescription>
              </Alert>

              {/* 評価表 */}
              <div className="space-y-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/3">評価項目</TableHead>
                      <TableHead>上司評価（60%）</TableHead>
                      <TableHead>自己評価（40%）</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* 1. 慢性期ケアの専門性 */}
                    <TableRow>
                      <TableCell className="font-medium">
                        <div>
                          <p className="font-semibold">1. 慢性期ケアの専門性</p>
                          <p className="text-sm text-gray-600">
                            高度な慢性期ケア技術、困難事例への対応、専門分野での実践
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <RadioGroup 
                          onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'expertise', value)}
                        >
                          <div className="flex space-x-4">
                            {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                              <div key={grade} className="flex items-center">
                                <RadioGroupItem value={grade} id={`superior-expertise-${grade}`} />
                                <Label htmlFor={`superior-expertise-${grade}`} className="ml-1">{grade}</Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      </TableCell>
                      <TableCell>
                        <RadioGroup 
                          onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'expertise', value)}
                        >
                          <div className="flex space-x-4">
                            {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                              <div key={grade} className="flex items-center">
                                <RadioGroupItem value={grade} id={`self-expertise-${grade}`} />
                                <Label htmlFor={`self-expertise-${grade}`} className="ml-1">{grade}</Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      </TableCell>
                    </TableRow>

                    {/* 2. リーダーシップの発揮 */}
                    <TableRow>
                      <TableCell className="font-medium">
                        <div>
                          <p className="font-semibold">2. リーダーシップの発揮</p>
                          <p className="text-sm text-gray-600">
                            チーム運営、業務調整、問題解決、スタッフの動機づけ
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <RadioGroup 
                          onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'leadership', value)}
                        >
                          <div className="flex space-x-4">
                            {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                              <div key={grade} className="flex items-center">
                                <RadioGroupItem value={grade} id={`superior-leadership-${grade}`} />
                                <Label htmlFor={`superior-leadership-${grade}`} className="ml-1">{grade}</Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      </TableCell>
                      <TableCell>
                        <RadioGroup 
                          onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'leadership', value)}
                        >
                          <div className="flex space-x-4">
                            {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                              <div key={grade} className="flex items-center">
                                <RadioGroupItem value={grade} id={`self-leadership-${grade}`} />
                                <Label htmlFor={`self-leadership-${grade}`} className="ml-1">{grade}</Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      </TableCell>
                    </TableRow>

                    {/* 3. 教育・人材育成 */}
                    <TableRow>
                      <TableCell className="font-medium">
                        <div>
                          <p className="font-semibold">3. 教育・人材育成</p>
                          <p className="text-sm text-gray-600">
                            体系的な指導、教育プログラムの実施、後輩の成長支援
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <RadioGroup 
                          onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'education', value)}
                        >
                          <div className="flex space-x-4">
                            {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                              <div key={grade} className="flex items-center">
                                <RadioGroupItem value={grade} id={`superior-education-${grade}`} />
                                <Label htmlFor={`superior-education-${grade}`} className="ml-1">{grade}</Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      </TableCell>
                      <TableCell>
                        <RadioGroup 
                          onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'education', value)}
                        >
                          <div className="flex space-x-4">
                            {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                              <div key={grade} className="flex items-center">
                                <RadioGroupItem value={grade} id={`self-education-${grade}`} />
                                <Label htmlFor={`self-education-${grade}`} className="ml-1">{grade}</Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      </TableCell>
                    </TableRow>

                    {/* 4. 業務改善・革新 */}
                    <TableRow>
                      <TableCell className="font-medium">
                        <div>
                          <p className="font-semibold">4. 業務改善・革新</p>
                          <p className="text-sm text-gray-600">
                            効率化の提案、新しい取り組みの導入、質改善への貢献
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <RadioGroup 
                          onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'innovation', value)}
                        >
                          <div className="flex space-x-4">
                            {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                              <div key={grade} className="flex items-center">
                                <RadioGroupItem value={grade} id={`superior-innovation-${grade}`} />
                                <Label htmlFor={`superior-innovation-${grade}`} className="ml-1">{grade}</Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      </TableCell>
                      <TableCell>
                        <RadioGroup 
                          onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'innovation', value)}
                        >
                          <div className="flex space-x-4">
                            {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                              <div key={grade} className="flex items-center">
                                <RadioGroupItem value={grade} id={`self-innovation-${grade}`} />
                                <Label htmlFor={`self-innovation-${grade}`} className="ml-1">{grade}</Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">技術評価点数</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {Math.round(calculateTechnicalScore() * 10) / 10} / 50点
                    </span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="technical-comment">技術評価の具体的コメント</Label>
                  <Textarea 
                    id="technical-comment" 
                    placeholder="専門性の発揮状況、リーダーシップの事例、教育活動、業務改善への取り組みなど、具体的な行動事例を記載してください"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* 施設貢献タブ */}
            <TabsContent value="facility" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">施設貢献評価（相対評価）- 25点</h3>
                <p className="text-sm text-gray-600 mb-4">
                  病棟内での貢献度を既存のポイント制度を活用して相対評価します。
                  ミドルレベル准看護師は病棟運営の中核としての貢献を重視します。
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">施設貢献度ポイント実績</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="facility-points">今期の施設貢献度ポイント</Label>
                    <Input 
                      type="number" 
                      id="facility-points" 
                      placeholder="例: 85"
                      onChange={(e) => setContributionPoints(prev => ({
                        ...prev,
                        facility: parseInt(e.target.value) || 0
                      }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="facility-rank">施設内順位（パーセンタイル）</Label>
                    <div className="flex items-center space-x-4">
                      <Input 
                        type="number" 
                        id="facility-rank"
                        min="1"
                        max="100"
                        value={facilityRank}
                        onChange={(e) => setFacilityRank(parseInt(e.target.value) || 50)}
                      />
                      <span className="text-sm text-gray-600">%</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      上位{facilityRank}%（数値が小さいほど高評価）
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">施設貢献評価点数</span>
                      <span className="text-2xl font-bold text-green-600">
                        {calculateContributionScore(facilityRank)} / 25点
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label>主な貢献内容（複数選択可）</Label>
                    <div className="space-y-2 mt-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>プリセプターシップの実施</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>病棟会議での建設的提案</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>委員会リーダーとしての活動</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>業務マニュアルの作成・改訂</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>病棟勉強会の講師担当</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>シフト調整への積極的協力</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>緊急時のリーダーシップ発揮</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="facility-comment">施設貢献の具体例</Label>
                    <Textarea 
                      id="facility-comment" 
                      placeholder="病棟運営への貢献、人材育成の成果、業務改善の実績など"
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 法人貢献タブ */}
            <TabsContent value="corporate" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">法人貢献評価（相対評価）- 25点</h3>
                <p className="text-sm text-gray-600 mb-4">
                  法人全体での貢献度を既存のポイント制度を活用して相対評価します。
                  ミドルレベル准看護師は専門性の法人内展開と組織貢献を重視します。
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">法人貢献度ポイント実績</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="corporate-points">今期の法人貢献度ポイント</Label>
                    <Input 
                      type="number" 
                      id="corporate-points" 
                      placeholder="例: 75"
                      onChange={(e) => setContributionPoints(prev => ({
                        ...prev,
                        corporate: parseInt(e.target.value) || 0
                      }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="corporate-rank">法人内順位（パーセンタイル）</Label>
                    <div className="flex items-center space-x-4">
                      <Input 
                        type="number" 
                        id="corporate-rank"
                        min="1"
                        max="100"
                        value={corporateRank}
                        onChange={(e) => setCorporateRank(parseInt(e.target.value) || 50)}
                      />
                      <span className="text-sm text-gray-600">%</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      上位{corporateRank}%（数値が小さいほど高評価）
                    </p>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">法人貢献評価点数</span>
                      <span className="text-2xl font-bold text-orange-600">
                        {calculateContributionScore(corporateRank)} / 25点
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label>主な貢献内容（複数選択可）</Label>
                    <div className="space-y-2 mt-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>法人研修プログラムの企画・講師</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>専門分野での院内コンサルテーション</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>法人委員会での中心的役割</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>QI活動・医療安全活動のリード</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>外部研修・学会での発表</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>地域連携活動での中心的役割</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>新規プロジェクトへの参画</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="corporate-comment">法人貢献の具体例</Label>
                    <Textarea 
                      id="corporate-comment" 
                      placeholder="法人活動でのリーダーシップ、専門性の活用、組織横断的な貢献など"
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 総合評価タブ */}
            <TabsContent value="summary" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">総合評価サマリー</h3>
              </div>

              {/* 評価結果サマリー */}
              <Card>
                <CardHeader>
                  <CardTitle>評価結果</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* 総合点数 */}
                    <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                      <p className="text-lg mb-2">総合評価点数</p>
                      <p className={`text-5xl font-bold ${getScoreColor(totalScore)}`}>
                        {totalScore}点
                      </p>
                      <p className="text-sm text-gray-600 mt-2">/ 100点満点</p>
                    </div>

                    {/* 内訳 */}
                    <div className="grid grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <Award className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                            <p className="text-sm text-gray-600">技術評価</p>
                            <p className="text-2xl font-bold mt-1">
                              {Math.round(calculateTechnicalScore() * 10) / 10}点
                            </p>
                            <p className="text-xs text-gray-500">/ 50点</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <Building className="h-8 w-8 mx-auto mb-2 text-green-600" />
                            <p className="text-sm text-gray-600">施設貢献</p>
                            <p className="text-2xl font-bold mt-1">
                              {calculateContributionScore(facilityRank)}点
                            </p>
                            <p className="text-xs text-gray-500">/ 25点</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <Users className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                            <p className="text-sm text-gray-600">法人貢献</p>
                            <p className="text-2xl font-bold mt-1">
                              {calculateContributionScore(corporateRank)}点
                            </p>
                            <p className="text-xs text-gray-500">/ 25点</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* 評価ランク */}
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">評価ランク</p>
                      <p className="text-3xl font-bold">
                        {totalScore >= 90 ? 'S' : 
                         totalScore >= 80 ? 'A' : 
                         totalScore >= 70 ? 'B' : 
                         totalScore >= 60 ? 'C' : 'D'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 総合所見 */}
              <Card>
                <CardHeader>
                  <CardTitle>総合所見・キャリア開発計画</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="strengths">特に優れている点・強み</Label>
                    <Textarea 
                      id="strengths" 
                      placeholder="専門性の高さ、リーダーシップ、教育力、業務改善への貢献など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="growth-areas">さらなる成長が期待される領域</Label>
                    <Textarea 
                      id="growth-areas" 
                      placeholder="管理能力の向上、専門分野の拡大、組織マネジメントスキルなど"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="next-goals">次期目標（1年後）</Label>
                    <Textarea 
                      id="next-goals" 
                      placeholder="主任への昇格準備、専門資格の取得、プロジェクトリーダーとしての活躍など"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="career-development">キャリア開発支援計画</Label>
                    <Textarea 
                      id="career-development" 
                      placeholder="管理職研修への参加、専門分野での講師活動、他部署での経験など"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="succession-plan">後継者育成状況</Label>
                    <Textarea 
                      id="succession-plan" 
                      placeholder="指導した後輩の成長状況、チーム内での知識・技術の継承など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="overall-comment">1次評価者コメント</Label>
                    <Textarea 
                      id="overall-comment" 
                      placeholder="ミドルレベル准看護師としての総合評価、今後への期待、具体的な成果など"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="final-comment">2次評価者コメント</Label>
                    <Textarea 
                      id="final-comment" 
                      placeholder="組織における位置づけ、将来の役割期待、育成方針について"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="next-review">次回評価予定日</Label>
                      <Input type="date" id="next-review" />
                    </div>
                    <div>
                      <Label htmlFor="review-type">次回評価種別</Label>
                      <Input type="text" id="review-type" placeholder="定期評価 / 昇格評価" />
                    </div>
                  </div>
                </CardContent>
              </Card>
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