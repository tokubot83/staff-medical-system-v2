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
            老健 新人介護福祉士（1年目） 人事評価シート v4.0
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            パターン5改良版 - 基礎習得と職場適応を重視した評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              <strong>評価構成：</strong>技術評価（360度評価）50点 + 施設貢献（相対評価）25点 + 法人貢献（相対評価）25点
              <br />
              新人介護福祉士は基礎技術の習得状況と職場への適応・チーム貢献を重点的に評価します
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
                    <Label htmlFor="education">最終学歴・資格取得年</Label>
                    <Input type="text" id="education" placeholder="○○介護福祉専門学校 2024年卒" />
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
                    <Label htmlFor="preceptor">指導担当者</Label>
                    <Input type="text" id="preceptor" />
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
                    <Label htmlFor="evaluator2">2次評価者（介護主任・管理者）</Label>
                    <Input type="text" id="evaluator2" />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 技術評価タブ */}
            <TabsContent value="technical" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">技術評価（360度評価：上司60%＋自己40%）</h3>
                <p className="text-sm text-gray-600 mb-4">
                  介護福祉士としての基礎技術と専門性を評価します
                </p>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/3">評価項目</TableHead>
                    <TableHead className="text-center">上司評価</TableHead>
                    <TableHead className="text-center">自己評価</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <div>
                        <p className="font-semibold">1. 基本的介護技術</p>
                        <p className="text-sm text-gray-600">
                          食事・入浴・排泄介助、移乗・移動支援、自立支援の視点
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'skills', value)}>
                        <div className="flex justify-center space-x-2">
                          {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                            <div key={grade} className="flex items-center">
                              <RadioGroupItem value={grade} id={`superior-skills-${grade}`} />
                              <Label htmlFor={`superior-skills-${grade}`} className="ml-1 cursor-pointer">
                                {grade}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </TableCell>
                    <TableCell>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'skills', value)}>
                        <div className="flex justify-center space-x-2">
                          {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                            <div key={grade} className="flex items-center">
                              <RadioGroupItem value={grade} id={`self-skills-${grade}`} />
                              <Label htmlFor={`self-skills-${grade}`} className="ml-1 cursor-pointer">
                                {grade}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <div>
                        <p className="font-semibold">2. 老健特有の知識・技術</p>
                        <p className="text-sm text-gray-600">
                          在宅復帰支援、リハビリ連携、多職種協働の理解と実践
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'knowledge', value)}>
                        <div className="flex justify-center space-x-2">
                          {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                            <div key={grade} className="flex items-center">
                              <RadioGroupItem value={grade} id={`superior-knowledge-${grade}`} />
                              <Label htmlFor={`superior-knowledge-${grade}`} className="ml-1 cursor-pointer">
                                {grade}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </TableCell>
                    <TableCell>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'knowledge', value)}>
                        <div className="flex justify-center space-x-2">
                          {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                            <div key={grade} className="flex items-center">
                              <RadioGroupItem value={grade} id={`self-knowledge-${grade}`} />
                              <Label htmlFor={`self-knowledge-${grade}`} className="ml-1 cursor-pointer">
                                {grade}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <div>
                        <p className="font-semibold">3. 利用者・家族対応</p>
                        <p className="text-sm text-gray-600">
                          尊厳の保持、個別性の理解、コミュニケーション、認知症ケア
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'patient', value)}>
                        <div className="flex justify-center space-x-2">
                          {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                            <div key={grade} className="flex items-center">
                              <RadioGroupItem value={grade} id={`superior-patient-${grade}`} />
                              <Label htmlFor={`superior-patient-${grade}`} className="ml-1 cursor-pointer">
                                {grade}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </TableCell>
                    <TableCell>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'patient', value)}>
                        <div className="flex justify-center space-x-2">
                          {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                            <div key={grade} className="flex items-center">
                              <RadioGroupItem value={grade} id={`self-patient-${grade}`} />
                              <Label htmlFor={`self-patient-${grade}`} className="ml-1 cursor-pointer">
                                {grade}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <div>
                        <p className="font-semibold">4. 安全管理・記録</p>
                        <p className="text-sm text-gray-600">
                          リスク予測、事故防止、観察力、適切な記録・報告
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'safety', value)}>
                        <div className="flex justify-center space-x-2">
                          {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                            <div key={grade} className="flex items-center">
                              <RadioGroupItem value={grade} id={`superior-safety-${grade}`} />
                              <Label htmlFor={`superior-safety-${grade}`} className="ml-1 cursor-pointer">
                                {grade}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </TableCell>
                    <TableCell>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'safety', value)}>
                        <div className="flex justify-center space-x-2">
                          {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                            <div key={grade} className="flex items-center">
                              <RadioGroupItem value={grade} id={`self-safety-${grade}`} />
                              <Label htmlFor={`self-safety-${grade}`} className="ml-1 cursor-pointer">
                                {grade}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-3">評価基準</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-semibold">S（優秀）：</span>新人として期待を大きく上回る。自立して業務遂行可能</p>
                  <p><span className="font-semibold">A（良好）：</span>期待通りの成長。基本業務を適切に実施</p>
                  <p><span className="font-semibold">B（標準）：</span>概ね順調に成長。一部指導が必要</p>
                  <p><span className="font-semibold">C（要努力）：</span>成長に遅れあり。継続的な指導が必要</p>
                  <p><span className="font-semibold">D（要改善）：</span>大幅な改善が必要。集中的な支援を要する</p>
                </div>
              </div>

              <div>
                <Label htmlFor="technical-comment">技術評価コメント（具体的な事例・成長度など）</Label>
                <Textarea
                  id="technical-comment"
                  placeholder="具体的な介護実践の例、成長が見られた点、今後の課題など"
                  className="min-h-[120px]"
                />
              </div>
            </TabsContent>

            {/* 施設貢献タブ */}
            <TabsContent value="facility" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">施設貢献度評価（相対評価・25点満点）</h3>
                <p className="text-sm text-gray-600 mb-4">
                  既存の施設内ポイント制度（委員会・勉強会・業務改善等）を基に相対評価
                </p>
              </div>

              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertDescription>
                  新人職員は基本業務習得が優先されるため、追加貢献は期待値を調整して評価します
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="facility-activities">今期の施設内活動実績</Label>
                  <Textarea
                    id="facility-activities"
                    placeholder="例：
・感染対策委員会参加（月1回）
・新人研修での発表
・レクリエーション活動補助
・ヒヤリハット報告○件"
                    className="min-h-[120px]"
                  />
                </div>

                <div>
                  <Label htmlFor="facility-points">獲得ポイント数</Label>
                  <Input
                    type="number"
                    id="facility-points"
                    placeholder="例：15ポイント"
                    onChange={(e) => setContributionPoints(prev => ({
                      ...prev,
                      facility: parseInt(e.target.value) || 0
                    }))}
                  />
                </div>

                <div>
                  <Label htmlFor="facility-rank">同期・同職種内での相対位置（パーセンタイル）</Label>
                  <div className="flex items-center space-x-4">
                    <Input
                      type="range"
                      id="facility-rank"
                      min="0"
                      max="100"
                      value={facilityRank}
                      onChange={(e) => setFacilityRank(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="w-20 text-center font-semibold">
                      上位{facilityRank}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    点数: {calculateContributionScore(facilityRank)}/25点
                  </p>
                </div>

                <Table className="mt-4">
                  <TableHeader>
                    <TableRow>
                      <TableHead>パーセンタイル</TableHead>
                      <TableHead>点数</TableHead>
                      <TableHead>目安</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>上位10%以内</TableCell>
                      <TableCell>25点</TableCell>
                      <TableCell>新人として卓越した貢献</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>上位20%以内</TableCell>
                      <TableCell>22.5点</TableCell>
                      <TableCell>期待を大きく上回る活動</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>上位30%以内</TableCell>
                      <TableCell>20点</TableCell>
                      <TableCell>積極的な参加姿勢</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>上位50%以内</TableCell>
                      <TableCell>15点</TableCell>
                      <TableCell>標準的な活動参加</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>上位70%以内</TableCell>
                      <TableCell>10点</TableCell>
                      <TableCell>基本業務に専念</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* 法人貢献タブ */}
            <TabsContent value="corporate" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">法人貢献度評価（相対評価・25点満点）</h3>
                <p className="text-sm text-gray-600 mb-4">
                  法人全体への貢献（他施設支援・法人研修・採用活動等）を相対評価
                </p>
              </div>

              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertDescription>
                  新人は法人行事への参加と学習姿勢を中心に評価。高度な貢献は2年目以降に期待
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="corporate-activities">今期の法人レベル活動実績</Label>
                  <Textarea
                    id="corporate-activities"
                    placeholder="例：
・法人新人研修への積極的参加
・法人主催イベントのスタッフ協力
・採用説明会での体験談発表
・他施設見学研修参加"
                    className="min-h-[120px]"
                  />
                </div>

                <div>
                  <Label htmlFor="corporate-points">法人貢献ポイント数</Label>
                  <Input
                    type="number"
                    id="corporate-points"
                    placeholder="例：8ポイント"
                    onChange={(e) => setContributionPoints(prev => ({
                      ...prev,
                      corporate: parseInt(e.target.value) || 0
                    }))}
                  />
                </div>

                <div>
                  <Label htmlFor="corporate-rank">法人内同期での相対位置（パーセンタイル）</Label>
                  <div className="flex items-center space-x-4">
                    <Input
                      type="range"
                      id="corporate-rank"
                      min="0"
                      max="100"
                      value={corporateRank}
                      onChange={(e) => setCorporateRank(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="w-20 text-center font-semibold">
                      上位{corporateRank}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    点数: {calculateContributionScore(corporateRank)}/25点
                  </p>
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">新人職員の法人貢献評価の視点</h4>
                  <ul className="space-y-1 text-sm">
                    <li>・法人理念の理解と実践への意欲</li>
                    <li>・法人研修での学習態度と理解度</li>
                    <li>・法人文化への適応と協調性</li>
                    <li>・将来的な法人貢献への可能性</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            {/* 総合評価タブ */}
            <TabsContent value="summary" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">総合評価サマリー</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center">
                      <Award className="h-4 w-4 mr-2 text-blue-600" />
                      技術評価
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-blue-600">
                      {Math.round(calculateTechnicalScore() * 10) / 10} / 50点
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      360度評価（上司60%＋自己40%）
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center">
                      <Building className="h-4 w-4 mr-2 text-green-600" />
                      施設貢献
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-green-600">
                      {calculateContributionScore(facilityRank)} / 25点
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      上位{facilityRank}%（相対評価）
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center">
                      <Users className="h-4 w-4 mr-2 text-orange-600" />
                      法人貢献
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-orange-600">
                      {calculateContributionScore(corporateRank)} / 25点
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      上位{corporateRank}%（相対評価）
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg text-center">
                <h4 className="text-lg font-semibold mb-2">総合評価点数</h4>
                <p className={`text-4xl font-bold ${getScoreColor(totalScore)}`}>
                  {totalScore} / 100点
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  技術評価と貢献度評価の総合点
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="strengths">特に優れている点・強み</Label>
                  <Textarea
                    id="strengths"
                    placeholder="例：
・利用者との関係構築が良好で、個別性を重視したケアができている
・多職種連携への意識が高く、積極的に情報共有を行っている
・学習意欲が高く、研修内容を実践に活かそうとする姿勢がある"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="growth-areas">今後の成長課題・改善点</Label>
                  <Textarea
                    id="growth-areas"
                    placeholder="例：
・基本的な介護技術の更なる習熟が必要
・記録の充実と観察力の向上
・在宅復帰支援の視点を深める必要がある"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="next-goals">次期評価までの目標設定</Label>
                  <Textarea
                    id="next-goals"
                    placeholder="例：
1. 基本介護技術の自立的実施（特に移乗・入浴介助）
2. 担当利用者のケアプラン理解と個別ケアの実践
3. 委員会活動への積極的参加（年間10ポイント以上獲得）"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="support-plan">必要な支援・育成計画</Label>
                  <Textarea
                    id="support-plan"
                    placeholder="例：
・認知症ケア実践者研修の受講（6ヶ月以内）
・リハビリスタッフとの同行研修実施
・月1回の指導者との面談継続"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="overall-comment">総合所見（1年目の総括と2年目への期待）</Label>
                  <Textarea
                    id="overall-comment"
                    placeholder="新人介護福祉士としての成長度、老健での適性、今後の可能性など"
                    className="min-h-[120px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="next-review-date">次回評価予定日</Label>
                    <Input type="date" id="next-review-date" />
                  </div>
                  <div>
                    <Label htmlFor="review-cycle">評価サイクル</Label>
                    <select id="review-cycle" className="w-full border rounded-md px-3 py-2">
                      <option value="3months">3ヶ月後</option>
                      <option value="6months">6ヶ月後</option>
                      <option value="1year">1年後</option>
                    </select>
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