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

export default function MidlevelCareWorkerEvaluationV4Pattern5() {
  // 評価項目の状態管理
  const [technicalScores, setTechnicalScores] = useState({
    superiorEval: { expertise: 0, leadership: 0, management: 0, mentoring: 0 },
    selfEval: { expertise: 0, leadership: 0, management: 0, mentoring: 0 }
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
            老健 ミドルレベル介護福祉士（4-10年目） 人事評価シート v4.0
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            パターン5改良版 - チームリーダーシップと専門性発揮を重視した評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              <strong>評価構成：</strong>技術評価（360度評価）50点 + 施設貢献（相対評価）25点 + 法人貢献（相対評価）25点
              <br />
              ミドルレベル介護福祉士はチームリーダーとしての役割、高度な専門性、後輩育成力を重点的に評価します
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
                  <Input type="text" id="experience" placeholder="4年目～10年目" />
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
                    <Input type="text" id="corp-experience" placeholder="○年目" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="position">役職・担当</Label>
                    <Input type="text" id="position" placeholder="チームリーダー、フロアリーダー等" />
                  </div>
                  <div>
                    <Label htmlFor="qualification">保有資格</Label>
                    <Input type="text" id="qualification" placeholder="介護福祉士、認知症ケア専門士等" />
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
                    <Label htmlFor="team-size">指導対象人数</Label>
                    <Input type="text" id="team-size" placeholder="直接指導○名、チーム○名" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">評価者情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="evaluator1">1次評価者（介護課長・主任）</Label>
                    <Input type="text" id="evaluator1" />
                  </div>
                  <div>
                    <Label htmlFor="evaluator2">2次評価者（施設長・管理者）</Label>
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
                  ミドルレベル介護福祉士は専門性の深化とリーダーシップを重視
                </p>
              </div>

              {/* 上司評価セクション */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-4 text-blue-600">上司評価（60％）</h4>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">1. 高度な介護技術と専門性</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'expertise', value)}>
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
                      S:卓越した専門性で模範 A:高度な技術を発揮 B:確実な専門技術 C:標準的技術 D:技術不足
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">2. チームリーダーシップと運営力</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'leadership', value)}>
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
                      S:卓越したリーダーシップ A:効果的なチーム運営 B:基本的なリーダー業務 C:リーダー力不足 D:要改善
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">3. 在宅復帰支援の企画・実践</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'management', value)}>
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
                      S:革新的な取組で成果 A:積極的な企画実践 B:標準的な実践 C:受動的対応 D:取組不足
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">4. 後輩育成・指導力</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'mentoring', value)}>
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
                      S:優れた育成で人材輩出 A:効果的な指導実施 B:基本的な指導 C:指導力不足 D:育成困難
                    </p>
                  </div>
                </div>
              </div>

              {/* 本人評価セクション */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-4 text-green-600">本人評価（40％）</h4>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">1. 高度な介護技術と専門性</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'expertise', value)}>
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
                    <Label className="text-sm font-medium">2. チームリーダーシップと運営力</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'leadership', value)}>
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
                    <Label className="text-sm font-medium">3. 在宅復帰支援の企画・実践</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'management', value)}>
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

                  <div>
                    <Label className="text-sm font-medium">4. 後輩育成・指導力</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'mentoring', value)}>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`self-mentoring-${grade}`} />
                            <Label htmlFor={`self-mentoring-${grade}`} className="font-normal">{grade}</Label>
                          </div>
                        )}}
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              {/* 自己振り返り */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <Label htmlFor="self-reflection">自己振り返り・リーダーとしての成長</Label>
                <Textarea 
                  id="self-reflection" 
                  placeholder="リーダーとしての実践、専門性向上の取り組み、チーム運営での工夫など"
                  className="min-h-[100px] mt-2"
                />
              </div>
            </TabsContent>

            {/* 施設貢献タブ（25点）*/}
            <TabsContent value="facility" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">施設貢献評価（25点）- 組織貢献度ポイント</h3>
                <p className="text-sm text-gray-600 mb-4">
                  ミドルレベル介護福祉士はチームリーダーとしての貢献、施設運営への参画を重視
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
                    <TableCell className="font-medium">チーム運営・管理</TableCell>
                    <TableCell>
                      <Input type="number" className="w-20" placeholder="0" />
                    </TableCell>
                    <TableCell>
                      <Input type="text" placeholder="チーム目標達成、シフト管理、業務調整など" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">在宅復帰実績・質向上</TableCell>
                    <TableCell>
                      <Input type="number" className="w-20" placeholder="0" />
                    </TableCell>
                    <TableCell>
                      <Input type="text" placeholder="在宅復帰率向上、カンファレンスリード、家族支援など" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">教育・研修企画運営</TableCell>
                    <TableCell>
                      <Input type="number" className="w-20" placeholder="0" />
                    </TableCell>
                    <TableCell>
                      <Input type="text" placeholder="勉強会企画、OJTプログラム作成、実習指導など" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">委員会・プロジェクトリード</TableCell>
                    <TableCell>
                      <Input type="number" className="w-20" placeholder="0" />
                    </TableCell>
                    <TableCell>
                      <Input type="text" placeholder="委員会リーダー、改善プロジェクト主導など" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">施設運営への貢献</TableCell>
                    <TableCell>
                      <Input type="number" className="w-20" placeholder="0" />
                    </TableCell>
                    <TableCell>
                      <Input type="text" placeholder="経営改善提案、コスト削減、新規事業参画など" />
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
                  法人価値向上、専門性による外部貢献、次世代育成を評価
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
                    <TableCell className="font-medium">法人研修講師・発表</TableCell>
                    <TableCell>
                      <Input type="number" className="w-20" placeholder="0" />
                    </TableCell>
                    <TableCell>
                      <Input type="text" placeholder="法人研修講師、学会発表、事例報告など" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">専門資格・スキル向上</TableCell>
                    <TableCell>
                      <Input type="number" className="w-20" placeholder="0" />
                    </TableCell>
                    <TableCell>
                      <Input type="text" placeholder="上級資格取得、専門研修修了、指導者資格など" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">法人間連携・協力</TableCell>
                    <TableCell>
                      <Input type="number" className="w-20" placeholder="0" />
                    </TableCell>
                    <TableCell>
                      <Input type="text" placeholder="他施設支援、合同プロジェクト、ノウハウ共有など" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">外部活動・地域貢献</TableCell>
                    <TableCell>
                      <Input type="number" className="w-20" placeholder="0" />
                    </TableCell>
                    <TableCell>
                      <Input type="text" placeholder="外部講師、専門職団体活動、地域ケア会議参加など" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">法人ブランド向上</TableCell>
                    <TableCell>
                      <Input type="number" className="w-20" placeholder="0" />
                    </TableCell>
                    <TableCell>
                      <Input type="text" placeholder="外部表彰、メディア掲載、モデル事業参加など" />
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
                      {totalScore >= 90 ? '極めて優秀な中堅リーダー' : 
                       totalScore >= 80 ? '優秀なチームリーダー' : 
                       totalScore >= 70 ? '期待に応える中堅職員' : 
                       totalScore >= 60 ? '標準的な中堅職員' : '課題のある中堅職員'}
                    </p>
                  </div>
                </div>

                {/* 強み・課題 */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <Label htmlFor="strengths">特に優れている点・強み</Label>
                    <Textarea 
                      id="strengths" 
                      placeholder="リーダーシップ、専門性、育成力、改善提案力など"
                      className="min-h-[100px] mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="challenges">今後の成長課題</Label>
                    <Textarea 
                      id="challenges" 
                      placeholder="マネジメント力強化、より高度な専門性、組織運営参画など"
                      className="min-h-[100px] mt-2"
                    />
                  </div>
                </div>

                {/* 次期目標 */}
                <div>
                  <Label htmlFor="next-goals">次期（1年後）の目標設定</Label>
                  <Textarea 
                    id="next-goals" 
                    placeholder="・チーム在宅復帰率○％達成&#10;・後輩○名の自立支援&#10;・施設運営改善プロジェクトのリード&#10;・上級専門資格の取得"
                    className="min-h-[120px] mt-2"
                  />
                </div>

                {/* キャリアパス */}
                <div className="mt-4">
                  <Label htmlFor="career-path">キャリアパス・将来像</Label>
                  <Textarea 
                    id="career-path" 
                    placeholder="・介護主任候補として管理職研修受講&#10;・認定介護福祉士資格取得支援&#10;・法人内他施設での管理職経験&#10;・将来の施設運営幹部候補"
                    className="min-h-[120px] mt-2"
                  />
                </div>

                {/* 総合所見 */}
                <div className="mt-4">
                  <Label htmlFor="overall-assessment">総合所見</Label>
                  <Textarea 
                    id="overall-assessment" 
                    placeholder="ミドルレベル介護福祉士としての実績、リーダーとしての成長、今後の期待など"
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