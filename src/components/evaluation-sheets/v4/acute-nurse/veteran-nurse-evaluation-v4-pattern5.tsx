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
import { Checkbox } from "@/components/ui/checkbox";

// Type definitions
type TechnicalScoreCategory = 'skills' | 'knowledge' | 'patient' | 'safety';
type EvaluatorType = 'superiorEval' | 'selfEval';

export default function VeteranNurseEvaluationV4Pattern5() {
  // 評価項目の状態管理
  const [technicalScores, setTechnicalScores] = useState<{
    [K in EvaluatorType]: Record<string, number>
  }>({
    superiorEval: { expertise: 0, mentoring: 0, innovation: 0, leadership: 0 },
    selfEval: { expertise: 0, mentoring: 0, innovation: 0, leadership: 0 }
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

  const handleTechnicalScoreChange = (evaluator: EvaluatorType, category: string, grade: keyof typeof gradeToScore) => {
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
            ベテラン看護師（11年以上） 人事評価シート v4.0
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            パターン5改良版 - 専門性の活用と組織全体への貢献を重視した評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              <strong>評価構成：</strong>技術評価（360度評価）50点 + 施設貢献（相対評価）25点 + 法人貢献（相対評価）25点
              <br />
              ベテラン看護師は豊富な経験・専門性を組織のために活用し、知識継承と組織発展への貢献を評価します
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
                    <Label htmlFor="hire-date">入職年月日</Label>
                    <Input type="date" id="hire-date" />
                  </div>
                  <div>
                    <Label htmlFor="corp-experience">法人経験年数</Label>
                    <Input type="text" id="corp-experience" placeholder="15年" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="previous-experience">前職経験</Label>
                    <Input type="text" id="previous-experience" placeholder="他病院○年（参考）" />
                  </div>
                  <div>
                    <Label htmlFor="total-experience">通算経験年数</Label>
                    <Input type="text" id="total-experience" placeholder="20年" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="department">所属病棟</Label>
                    <Input type="text" id="department" />
                  </div>
                  <div>
                    <Label htmlFor="role">現在の役割</Label>
                    <Input type="text" id="role" placeholder="教育担当 / 委員会委員長 / 専門チーム" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="certifications">保有資格</Label>
                    <Input type="text" id="certifications" placeholder="認定看護師 / 専門看護師 / その他" />
                  </div>
                  <div>
                    <Label htmlFor="specialty">専門領域</Label>
                    <Input type="text" id="specialty" placeholder="救急看護 / 緩和ケア / 感染管理" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">評価者情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="evaluator1">1次評価者（師長）</Label>
                    <Input type="text" id="evaluator1" />
                  </div>
                  <div>
                    <Label htmlFor="evaluator2">2次評価者（看護部長）</Label>
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
                  ベテラン看護師は専門性の深さと組織への知識還元を重視
                </p>
              </div>

              {/* 上司評価セクション */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-4 text-blue-600">上司評価（60％）</h4>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">1. 専門性・エキスパート性</Label>
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
                      S:法人全体の第一人者 A:高度な専門性 B:十分な専門性 C:専門性の更新必要 D:専門性不足
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">2. 知識継承・人材育成</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'mentoring', value as keyof typeof gradeToScore)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`superior-mentoring-${grade}`} />
                            <Label htmlFor={`superior-mentoring-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-gray-500 mt-1">
                      S:教育システム構築 A:多数の人材育成 B:適切な指導実施 C:指導機会少ない D:知識継承なし
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">3. 業務改革・イノベーション</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'innovation', value as keyof typeof gradeToScore)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`superior-innovation-${grade}`} />
                            <Label htmlFor={`superior-innovation-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-gray-500 mt-1">
                      S:組織変革を主導 A:重要な改善実現 B:改善に貢献 C:現状維持的 D:変化に抵抗
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">4. 組織的リーダーシップ</Label>
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
                      S:組織の精神的支柱 A:強い影響力 B:適切な指導力 C:影響力限定的 D:リーダーシップ不足
                    </p>
                  </div>
                </div>
              </div>

              {/* 本人評価セクション */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-4 text-green-600">本人評価（40％）</h4>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">1. 専門性・エキスパート性</Label>
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
                    <Label className="text-sm font-medium">2. 知識継承・人材育成</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'mentoring', value as keyof typeof gradeToScore)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`self-mentoring-${grade}`} />
                            <Label htmlFor={`self-mentoring-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">3. 業務改革・イノベーション</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'innovation', value as keyof typeof gradeToScore)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`self-innovation-${grade}`} />
                            <Label htmlFor={`self-innovation-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">4. 組織的リーダーシップ</Label>
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
                </div>
              </div>

              {/* 知識継承計画 */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <Label htmlFor="knowledge-transfer">知識継承・後継者育成計画</Label>
                <Textarea 
                  id="knowledge-transfer" 
                  placeholder="専門知識の継承方法、後継者育成の具体的計画、教育プログラムへの貢献など"
                  className="min-h-[100px] mt-2"
                />
              </div>
            </TabsContent>

            {/* 施設貢献タブ（25点）*/}
            <TabsContent value="facility" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">施設貢献評価（25点）- 組織貢献度ポイント</h3>
                <p className="text-sm text-gray-600 mb-4">
                  組織の要としての活動、影響力、知識継承を評価
                </p>
              </div>

              {/* ポイント集計表 */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60%]">活動項目</TableHead>
                      <TableHead className="text-center">ポイント</TableHead>
                      <TableHead className="text-center">実績</TableHead>
                      <TableHead className="text-center">合計</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>教育プログラム開発・講師</TableCell>
                      <TableCell className="text-center">20pt</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="3" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">60pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>プリセプター統括・指導</TableCell>
                      <TableCell className="text-center">15pt</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="2" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">30pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>委員会委員長・主要メンバー</TableCell>
                      <TableCell className="text-center">15pt</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="2" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">30pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>業務改善プロジェクトリーダー</TableCell>
                      <TableCell className="text-center">20pt</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="2" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">40pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>院内マニュアル・手順書作成</TableCell>
                      <TableCell className="text-center">10pt</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="4" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">40pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>専門チーム活動（RST、NST等）</TableCell>
                      <TableCell className="text-center">10pt/月</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="12" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">120pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>師長代行・管理業務支援</TableCell>
                      <TableCell className="text-center">15pt/回</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="4" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">60pt</TableCell>
                    </TableRow>
                    <TableRow className="bg-gray-50">
                      <TableCell colSpan={3} className="font-semibold">施設貢献ポイント合計</TableCell>
                      <TableCell className="text-center font-bold text-lg">380pt</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* 相対評価 */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">施設内相対評価（ベテラン看護師間）</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="facility-rank">施設内順位</Label>
                    <div className="flex gap-2 mt-1">
                      <Input type="number" id="facility-rank" placeholder="5" className="w-20" />
                      <span className="self-center">位 /</span>
                      <Input type="number" placeholder="30" className="w-20" />
                      <span className="self-center">人中</span>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="facility-percentile">パーセンタイル</Label>
                    <div className="flex gap-2 mt-1">
                      <span className="self-center">上位</span>
                      <Input 
                        type="number" 
                        id="facility-percentile" 
                        value={facilityRank}
                        onChange={(e) => setFacilityRank(Number(e.target.value))}
                        className="w-20" 
                      />
                      <span className="self-center">％</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="font-semibold">施設貢献点数: </span>
                  <span className="text-2xl font-bold text-blue-600">
                    {calculateContributionScore(facilityRank)} / 25点
                  </span>
                </div>
              </div>

              {/* 組織的影響力 */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3">組織への影響力・存在価値</h4>
                <Textarea 
                  placeholder="組織文化への貢献、精神的支柱としての役割、後進への影響など"
                  className="min-h-[100px]"
                />
              </div>
            </TabsContent>

            {/* 法人貢献タブ（25点）*/}
            <TabsContent value="corporate" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">法人貢献評価（25点）- 法人共通項目</h3>
                <p className="text-sm text-gray-600 mb-4">
                  法人全体への専門知識の展開と組織横断的な貢献を評価
                </p>
              </div>

              {/* ポイント集計表 */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60%]">活動項目</TableHead>
                      <TableHead className="text-center">ポイント</TableHead>
                      <TableHead className="text-center">実績</TableHead>
                      <TableHead className="text-center">合計</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="bg-yellow-50">
                      <TableCell className="font-semibold" colSpan={4}>学術・専門活動</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">学会発表（筆頭演者）</TableCell>
                      <TableCell className="text-center">30pt</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="1" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">30pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">論文投稿・執筆</TableCell>
                      <TableCell className="text-center">40pt</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="1" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">40pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">法人内研修講師（年間）</TableCell>
                      <TableCell className="text-center">15pt/回</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="6" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">90pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">外部講師・講演</TableCell>
                      <TableCell className="text-center">25pt</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="2" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">50pt</TableCell>
                    </TableRow>
                    
                    <TableRow className="bg-green-50">
                      <TableCell className="font-semibold" colSpan={4}>組織横断活動</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">法人プロジェクトリーダー</TableCell>
                      <TableCell className="text-center">30pt</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="1" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">30pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">他施設コンサルテーション</TableCell>
                      <TableCell className="text-center">20pt/回</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="4" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">80pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">法人看護部会議メンバー</TableCell>
                      <TableCell className="text-center">10pt/回</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="12" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">120pt</TableCell>
                    </TableRow>
                    
                    <TableRow className="bg-blue-50">
                      <TableCell className="font-semibold" colSpan={4}>法人発展への貢献</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">新規事業立ち上げ参画</TableCell>
                      <TableCell className="text-center">40pt</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="1" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">40pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">法人表彰受賞</TableCell>
                      <TableCell className="text-center">30pt</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="1" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">30pt</TableCell>
                    </TableRow>
                    
                    <TableRow className="bg-gray-50">
                      <TableCell colSpan={3} className="font-semibold">法人貢献ポイント合計</TableCell>
                      <TableCell className="text-center font-bold text-lg">510pt</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* 相対評価 */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">法人内相対評価（ベテラン看護師全体）</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="corporate-rank">法人内順位（ベテラン看護師）</Label>
                    <div className="flex gap-2 mt-1">
                      <Input type="number" id="corporate-rank" placeholder="20" className="w-20" />
                      <span className="self-center">位 /</span>
                      <Input type="number" placeholder="120" className="w-20" />
                      <span className="self-center">人中</span>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="corporate-percentile">パーセンタイル</Label>
                    <div className="flex gap-2 mt-1">
                      <span className="self-center">上位</span>
                      <Input 
                        type="number" 
                        id="corporate-percentile"
                        value={corporateRank}
                        onChange={(e) => setCorporateRank(Number(e.target.value))}
                        className="w-20" 
                      />
                      <span className="self-center">％</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="font-semibold">法人貢献点数: </span>
                  <span className="text-2xl font-bold text-green-600">
                    {calculateContributionScore(corporateRank)} / 25点
                  </span>
                </div>
              </div>

              {/* 専門性の法人内活用 */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3">専門性の法人内展開・知識共有</h4>
                <Textarea 
                  placeholder="法人全体への専門知識の展開、他施設支援の実績、法人発展への具体的貢献など"
                  className="min-h-[100px]"
                />
              </div>
            </TabsContent>

            {/* 総合評価タブ */}
            <TabsContent value="summary" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">総合評価サマリー</h3>
                
                {/* 総合スコア */}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg text-center mb-6">
                  <h4 className="text-xl font-semibold mb-2">最終評価点数</h4>
                  <p className={`text-5xl font-bold ${getScoreColor(totalScore)}`}>
                    {totalScore}点
                  </p>
                  <p className="text-gray-600 mt-2">100点満点</p>
                  
                  <div className="mt-4">
                    <span className="text-lg font-semibold">評価ランク: </span>
                    <span className={`text-2xl font-bold ${getScoreColor(totalScore)}`}>
                      {totalScore >= 90 ? 'S' : 
                       totalScore >= 80 ? 'A' : 
                       totalScore >= 70 ? 'B' : 
                       totalScore >= 60 ? 'C' : 'D'}
                    </span>
                  </div>
                </div>

                {/* 評価の内訳 */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">個人の実力（50点）</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>技術評価（360度評価）</span>
                          <span className="font-bold">{Math.round(calculateTechnicalScore() * 10) / 10}点</span>
                        </div>
                        <Progress value={calculateTechnicalScore() * 2} className="h-2" />
                        <p className="text-xs text-gray-600 mt-2">
                          専門性、知識継承、イノベーション、リーダーシップ
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">組織への貢献（50点）</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>施設貢献</span>
                          <span className="font-bold">{calculateContributionScore(facilityRank)}点</span>
                        </div>
                        <div className="flex justify-between">
                          <span>法人貢献</span>
                          <span className="font-bold">{calculateContributionScore(corporateRank)}点</span>
                        </div>
                        <Progress 
                          value={(calculateContributionScore(facilityRank) + calculateContributionScore(corporateRank)) * 2} 
                          className="h-2" 
                        />
                        <p className="text-xs text-gray-600 mt-2">
                          教育システム構築、組織横断活動、専門知識展開
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* ベテラン看護師の活用提案 */}
                <div className="bg-yellow-50 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold mb-2">ベテラン看護師としての活用提案</h4>
                  {totalScore >= 80 ? (
                    <div>
                      <p className="text-sm mb-2">
                        <span className="font-semibold">組織の財産:</span> 
                        法人全体の発展に不可欠な人材。その知識と経験を最大限活用
                      </p>
                      <ul className="text-sm list-disc list-inside">
                        <li>法人教育システムの中核として位置づけ</li>
                        <li>専門看護師・認定看護師としての活動支援</li>
                        <li>法人プロジェクトのアドバイザー役</li>
                        <li>次世代管理者の育成メンター</li>
                      </ul>
                    </div>
                  ) : totalScore >= 70 ? (
                    <div>
                      <p className="text-sm mb-2">
                        <span className="font-semibold">重要な戦力:</span>
                        専門性と経験を活かした貢献を継続
                      </p>
                      <ul className="text-sm list-disc list-inside">
                        <li>専門分野での指導的役割を強化</li>
                        <li>教育プログラムへの積極的関与</li>
                        <li>他施設への知識共有機会の創出</li>
                      </ul>
                    </div>
                  ) : totalScore >= 60 ? (
                    <div>
                      <p className="text-sm mb-2">
                        <span className="font-semibold">活用機会の拡大:</span>
                        豊富な経験を組織に還元する仕組みづくり
                      </p>
                      <ul className="text-sm list-disc list-inside">
                        <li>得意分野での活動機会を増やす</li>
                        <li>若手との協働プロジェクト参加</li>
                        <li>知識継承の具体的計画策定</li>
                      </ul>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm mb-2">
                        <span className="font-semibold">再活性化支援:</span>
                        モチベーション向上と新たな役割の模索
                      </p>
                      <ul className="text-sm list-disc list-inside">
                        <li>キャリア面談による意欲喚起</li>
                        <li>新たな学習機会の提供</li>
                        <li>働き方の見直しと最適化</li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* キャリア後期の活用計画 */}
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold mb-3">キャリア後期の活用計画</h4>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm">今後の役割希望</Label>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="role-education" />
                          <Label htmlFor="role-education" className="text-sm font-normal">教育・指導役割の強化</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="role-specialist" />
                          <Label htmlFor="role-specialist" className="text-sm font-normal">専門分野での活動継続</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="role-management" />
                          <Label htmlFor="role-management" className="text-sm font-normal">管理的役割への移行</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="role-consultant" />
                          <Label htmlFor="role-consultant" className="text-sm font-normal">コンサルタント的役割</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 総合コメント */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="strengths">強み・組織への貢献</Label>
                    <Textarea 
                      id="strengths" 
                      placeholder="専門性の深さ、組織への影響力、知識継承の実績、後進育成への貢献など"
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="legacy">知識・技術の継承計画</Label>
                    <Textarea 
                      id="legacy" 
                      placeholder="継承すべき専門知識、継承方法、後継者育成計画など"
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="future-contribution">今後の活躍領域</Label>
                    <Textarea 
                      id="future-contribution" 
                      placeholder="専門性を活かした新たな役割、組織発展への貢献方法など"
                      className="min-h-[100px]"
                    />
                  </div>
                </div>

                {/* 評価者サイン */}
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
                  <div>
                    <Label htmlFor="evaluator1-sign">1次評価者確認</Label>
                    <Input type="text" id="evaluator1-sign" placeholder="氏名・日付" />
                  </div>
                  <div>
                    <Label htmlFor="evaluator2-sign">2次評価者確認</Label>
                    <Input type="text" id="evaluator2-sign" placeholder="氏名・日付" />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-4 mt-6">
            <Button variant="outline">
              <Calculator className="mr-2 h-4 w-4" />
              点数を再計算
            </Button>
            <Button>
              評価を保存
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}