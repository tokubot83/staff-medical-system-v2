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

type TechnicalScoreCategory = 'skills' | 'knowledge' | 'patient' | 'safety';
type EvaluatorType = 'superiorEval' | 'selfEval';

export default function NewOutpatientNurseEvaluationV4Pattern5() {
  const [technicalScores, setTechnicalScores] = useState<{
    [K in EvaluatorType]: Record<TechnicalScoreCategory, number>
  }>({
    superiorEval: { skills: 0, knowledge: 0, patient: 0, safety: 0 },
    selfEval: { skills: 0, knowledge: 0, patient: 0, safety: 0 }
  });

  const [contributionPoints, setContributionPoints] = useState({
    facility: 0,
    corporate: 0
  });

  const [totalScore, setTotalScore] = useState(0);
  const [facilityRank, setFacilityRank] = useState(50);
  const [corporateRank, setCorporateRank] = useState(50);

  const gradeToScore: Record<string, number> = {
    'S': 1.0,
    'A': 0.85,
    'B': 0.70,
    'C': 0.55,
    'D': 0.40
  };

  const calculateTechnicalScore = () => {
    const superiorTotal = Object.values(technicalScores.superiorEval).reduce((a, b) => a + b, 0) / 4;
    const selfTotal = Object.values(technicalScores.selfEval).reduce((a, b) => a + b, 0) / 4;
    return (superiorTotal * 0.6 + selfTotal * 0.4) * 50;
  };

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
            外来新人看護師（1年目） 人事評価シート v4.0
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            パターン5改良版 - 外来看護の基礎習得と多部門連携を重視した評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              <strong>評価構成：</strong>技術評価（360度評価）50点 + 施設貢献（相対評価）25点 + 法人貢献（相対評価）25点
              <br />
              外来新人看護師は外来業務の基礎技術習得、初診対応、検査説明・調整能力を重点的に評価します
            </AlertDescription>
          </Alert>

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
                    <Label htmlFor="department">配属部署</Label>
                    <Input type="text" id="department" value="外来" readOnly />
                  </div>
                  <div>
                    <Label htmlFor="preceptor">プリセプター</Label>
                    <Input type="text" id="preceptor" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">評価者情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="evaluator1">1次評価者（プリセプター）</Label>
                    <Input type="text" id="evaluator1" />
                  </div>
                  <div>
                    <Label htmlFor="evaluator2">2次評価者（主任・師長）</Label>
                    <Input type="text" id="evaluator2" />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="technical" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">技術評価（50点）- 360度評価</h3>
                <p className="text-sm text-gray-600 mb-4">
                  上司評価60％（30点）＋ 本人評価40％（20点）で算出
                  <br />
                  外来新人看護師は外来特有の基礎技術習得と安全な実践を重視
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-4 text-blue-600">プリセプター・上司評価（60％）</h4>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">1. 外来看護技術の習得（初診対応・トリアージ基礎）</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'skills', value as keyof typeof gradeToScore)}>
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
                      S:予定より早く習得 A:順調に習得 B:標準的 C:遅れあり D:大幅な遅れ
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">2. 検査説明・他部門連携（検査室・放射線科・病棟調整）</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'knowledge', value as keyof typeof gradeToScore)}>
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
                      S:的確な説明と調整 A:良好な連携 B:基本的対応 C:連携不足 D:大幅な不足
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">3. 外来患者・家族への対応（短時間での信頼関係構築）</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'patient', value as keyof typeof gradeToScore)}>
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
                      S:模範的対応 A:丁寧で適切 B:標準的 C:改善必要 D:要指導
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">4. 医療安全・感染対策の実践（外来特有のリスク管理）</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'safety', value as keyof typeof gradeToScore)}>
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
                      S:完璧な実践 A:確実な実践 B:基本的実践 C:不十分 D:リスクあり
                    </p>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-4 text-green-600">本人評価（40％）</h4>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">1. 外来看護技術の習得（初診対応・トリアージ基礎）</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'skills', value as keyof typeof gradeToScore)}>
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
                    <Label className="text-sm font-medium">2. 検査説明・他部門連携（検査室・放射線科・病棟調整）</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'knowledge', value as keyof typeof gradeToScore)}>
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
                    <Label className="text-sm font-medium">3. 外来患者・家族への対応（短時間での信頼関係構築）</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'patient', value as keyof typeof gradeToScore)}>
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
                    <Label className="text-sm font-medium">4. 医療安全・感染対策の実践（外来特有のリスク管理）</Label>
                    <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'safety', value as keyof typeof gradeToScore)}>
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

              <div className="bg-gray-50 p-4 rounded-lg">
                <Label htmlFor="self-reflection">自己振り返り・学習計画</Label>
                <Textarea 
                  id="self-reflection" 
                  placeholder="外来業務で努力した点、複数患者対応や病棟調整での課題、今後の学習目標など"
                  className="min-h-[100px] mt-2"
                />
              </div>
            </TabsContent>

            <TabsContent value="facility" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">施設貢献評価（25点）- 組織貢献度ポイント</h3>
                <p className="text-sm text-gray-600 mb-4">
                  外来新人看護師は職場適応と外来チーム貢献を中心に評価
                </p>
              </div>

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
                      <TableCell>外来朝礼・申し送り出席（月平均）</TableCell>
                      <TableCell className="text-center">2pt/回</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="22" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">44pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>新人研修参加</TableCell>
                      <TableCell className="text-center">5pt/回</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="12" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">60pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>外来勉強会・診療科カンファレンス参加</TableCell>
                      <TableCell className="text-center">3pt/回</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="8" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">24pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>検査室・放射線科との連携会議参加</TableCell>
                      <TableCell className="text-center">5pt/回</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="3" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">15pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>病棟入院調整対応（複数患者同時対応含む）</TableCell>
                      <TableCell className="text-center">3pt/件</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="5" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">15pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>外来患者満足度向上活動参加</TableCell>
                      <TableCell className="text-center">8pt/回</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="2" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">16pt</TableCell>
                    </TableRow>
                    <TableRow className="bg-gray-50">
                      <TableCell colSpan={3} className="font-semibold">施設貢献ポイント合計</TableCell>
                      <TableCell className="text-center font-bold text-lg">174pt</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">施設内相対評価（外来新人看護師間）</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="facility-rank">施設内順位</Label>
                    <div className="flex gap-2 mt-1">
                      <Input type="number" id="facility-rank" placeholder="3" className="w-20" />
                      <span className="self-center">位 /</span>
                      <Input type="number" placeholder="8" className="w-20" />
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
                <div className="mt-2">
                  <span className="text-sm font-medium">施設貢献度得点：</span>
                  <span className="ml-2 font-bold text-lg">{calculateContributionScore(facilityRank)} / 25点</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="corporate" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">法人貢献評価（25点）- 法人活動参画</h3>
                <p className="text-sm text-gray-600 mb-4">
                  法人全体での活動参加と貢献を評価
                </p>
              </div>

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
                      <TableCell>法人新人合同研修参加</TableCell>
                      <TableCell className="text-center">10pt/回</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="4" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">40pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>法人理念研修参加</TableCell>
                      <TableCell className="text-center">8pt/回</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="2" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">16pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>他施設見学・交流会参加</TableCell>
                      <TableCell className="text-center">12pt/回</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="1" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">12pt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>法人イベント参加・協力</TableCell>
                      <TableCell className="text-center">5pt/回</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" className="w-16 mx-auto" placeholder="2" />
                      </TableCell>
                      <TableCell className="text-center font-semibold">10pt</TableCell>
                    </TableRow>
                    <TableRow className="bg-gray-50">
                      <TableCell colSpan={3} className="font-semibold">法人貢献ポイント合計</TableCell>
                      <TableCell className="text-center font-bold text-lg">78pt</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">法人内相対評価（全新人看護師間）</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="corporate-rank">法人内順位</Label>
                    <div className="flex gap-2 mt-1">
                      <Input type="number" id="corporate-rank" placeholder="15" className="w-20" />
                      <span className="self-center">位 /</span>
                      <Input type="number" placeholder="45" className="w-20" />
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
                <div className="mt-2">
                  <span className="text-sm font-medium">法人貢献度得点：</span>
                  <span className="ml-2 font-bold text-lg">{calculateContributionScore(corporateRank)} / 25点</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="summary" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">総合評価サマリー</h3>
                
                <div className="border rounded-lg p-4 bg-blue-50">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">総合得点</span>
                      <p className={`text-3xl font-bold ${getScoreColor(totalScore)}`}>
                        {totalScore} / 100点
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">評価ランク</span>
                      <p className="text-3xl font-bold">
                        {totalScore >= 90 ? 'S' : totalScore >= 80 ? 'A' : totalScore >= 70 ? 'B' : totalScore >= 60 ? 'C' : 'D'}
                      </p>
                    </div>
                  </div>
                </div>

                <Table className="mt-6">
                  <TableHeader>
                    <TableRow>
                      <TableHead>評価項目</TableHead>
                      <TableHead className="text-right">配点</TableHead>
                      <TableHead className="text-right">得点</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>技術評価（360度評価）</TableCell>
                      <TableCell className="text-right">50点</TableCell>
                      <TableCell className="text-right font-bold">
                        {Math.round(calculateTechnicalScore() * 10) / 10}点
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>施設貢献度（相対評価）</TableCell>
                      <TableCell className="text-right">25点</TableCell>
                      <TableCell className="text-right font-bold">
                        {calculateContributionScore(facilityRank)}点
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>法人貢献度（相対評価）</TableCell>
                      <TableCell className="text-right">25点</TableCell>
                      <TableCell className="text-right font-bold">
                        {calculateContributionScore(corporateRank)}点
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-bold">合計</TableCell>
                      <TableCell className="text-right font-bold">100点</TableCell>
                      <TableCell className="text-right font-bold text-lg">
                        {totalScore}点
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <div className="mt-6 space-y-4">
                  <div>
                    <Label htmlFor="next-challenges">次期の課題・目標（外来業務）</Label>
                    <Textarea 
                      id="next-challenges" 
                      placeholder="トリアージ能力向上、検査説明の充実、病棟調整のスムーズ化など"
                      className="min-h-[100px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="evaluator-comment">評価者コメント</Label>
                    <Textarea 
                      id="evaluator-comment" 
                      placeholder="外来業務への適応状況、多部門連携での成長点などを記入"
                      className="min-h-[100px]"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <Button variant="outline">一時保存</Button>
                  <Button>評価確定</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}