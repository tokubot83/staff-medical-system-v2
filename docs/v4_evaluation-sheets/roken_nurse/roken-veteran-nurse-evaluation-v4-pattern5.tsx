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
import { InfoIcon, Calculator, Award, Building, Users,  } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

export default function RokenVeteranNurseEvaluationV4Pattern5() {
  // 評価項目の状態管理
  const [technicalScores, setTechnicalScores] = useState({
    superiorEval: { 
      influence: 0,         // 組織全体への影響力
      succession: 0,        // 知識継承と人材育成
      culture: 0,           // 組織文化の醸成
      expertise: 0          // 専門性の活用
    },
    selfEval: { 
      influence: 0, 
      succession: 0, 
      culture: 0, 
      expertise: 0 
    }
  });

  const [contributionPoints, setContributionPoints] = useState({
    facility: 0,
    corporate: 0
  });

  const [totalScore, setTotalScore] = useState(0);
  const [facilityRank, setFacilityRank] = useState(50); // パーセンタイル
  const [corporateRank, setCorporateRank] = useState(50);

  // 特別貢献のチェック項目
  const [specialContributions, setSpecialContributions] = useState({
    nationalPresentation: false,
    certificationLeader: false,
    expertConsultant: false,
    systemDevelopment: false,
    mentorshipProgram: false
  });

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
    
    // 特別貢献のボーナス点（最大5点）
    const bonusPoints = Object.values(specialContributions).filter(Boolean).length * 1;
    
    return Math.min((superiorTotal * 0.6 + selfTotal * 0.4) * 50 + bonusPoints, 50);
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
  }, [technicalScores, facilityRank, corporateRank, specialContributions]);

  const handleTechnicalScoreChange = (evaluator: string, category: string, grade: string) => {
    setTechnicalScores(prev => ({
      ...prev,
      [evaluator]: {
        ...prev[evaluator],
        [category]: gradeToScore[grade] || 0
      }
    }));
  };

  const handleSpecialContributionChange = (key, checked) => {
    setSpecialContributions(prev => ({
      ...prev,
      [key]: checked
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
            介護老人保健施設 ベテラン看護師（11年以上） 人事評価シート v4.0
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
              ベテラン看護師は豊富な経験・専門性を組織のために活用し、知識継承と老健看護の発展への貢献を評価します
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
                    <Label htmlFor="primary-service">主たる配属サービス</Label>
                    <Input type="text" id="primary-service" placeholder="入所 / 通所リハ / 訪問看護" />
                  </div>
                  <div>
                    <Label htmlFor="experience">老健経験年数</Label>
                    <Input type="text" id="experience" placeholder="15年" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="certifications">保有資格</Label>
                    <Input type="text" id="certifications" placeholder="認定看護師 / ケアマネジャー" />
                  </div>
                  <div>
                    <Label htmlFor="specialty">専門領域</Label>
                    <Input type="text" id="specialty" placeholder="リハビリテーション看護 / 認知症ケア" />
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
                    <Input type="text" id="previous-experience" placeholder="他施設○年（参考）" />
                  </div>
                  <div>
                    <Label htmlFor="total-experience">通算看護師経験</Label>
                    <Input type="text" id="total-experience" placeholder="20年" />
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

            {/* 技術評価タブ */}
            <TabsContent value="technical" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">技術評価（50点満点）</h3>
                <p className="text-sm text-gray-600 mb-4">
                  老健ベテラン看護師としての影響力と組織貢献を360度評価で採点します
                  <br />
                  <span className="font-semibold">評価比率：上司評価60% + 自己評価40% + 特別貢献ボーナス（最大5点）</span>
                </p>
              </div>

              <div className="space-y-6">
                {/* 組織全体への影響力 */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Award className="h-4 w-4 mr-2 text-blue-600" />
                    1. 組織全体への影響力と貢献
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    施設運営・看護の質向上への決定的な貢献と組織変革への関与
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">上司評価</Label>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'influence', value)}>
                        <div className="space-y-2 mt-2">
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="S" id="influence-superior-s" />
                            <Label htmlFor="influence-superior-s" className="font-normal">
                              <span className="font-semibold">S：</span> 施設全体の看護の質向上に決定的な貢献をし、組織変革を主導
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="A" id="influence-superior-a" />
                            <Label htmlFor="influence-superior-a" className="font-normal">
                              <span className="font-semibold">A：</span> 複数部門に影響を与え、組織の発展に大きく貢献
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="B" id="influence-superior-b" />
                            <Label htmlFor="influence-superior-b" className="font-normal">
                              <span className="font-semibold">B：</span> 所属部門で安定した貢献をしている
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="C" id="influence-superior-c" />
                            <Label htmlFor="influence-superior-c" className="font-normal">
                              <span className="font-semibold">C：</span> 個人の業務に留まり、組織貢献が限定的
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="D" id="influence-superior-d" />
                            <Label htmlFor="influence-superior-d" className="font-normal">
                              <span className="font-semibold">D：</span> 経験を組織に還元できていない
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="border-t pt-3">
                      <Label className="text-sm font-medium">自己評価</Label>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'influence', value)}>
                        <div className="flex space-x-4 mt-2">
                          {['S', 'A', 'B', 'C', 'D'].map(grade => (
                            <div key={grade} className="flex items-center">
                              <RadioGroupItem value={grade} id={`influence-self-${grade.toLowerCase()}`} />
                              <Label htmlFor={`influence-self-${grade.toLowerCase()}`} className="ml-2">
                                {grade}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                {/* 知識継承と人材育成 */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Users className="h-4 w-4 mr-2 text-green-600" />
                    2. 知識・技術の継承と人材育成
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    体系的な教育プログラムの構築と優秀な人材の輩出
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">上司評価</Label>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'succession', value)}>
                        <div className="space-y-2 mt-2">
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="S" id="succession-superior-s" />
                            <Label htmlFor="succession-superior-s" className="font-normal">
                              <span className="font-semibold">S：</span> 体系的な教育プログラムを構築し、多数の優秀な人材を輩出
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="A" id="succession-superior-a" />
                            <Label htmlFor="succession-superior-a" className="font-normal">
                              <span className="font-semibold">A：</span> 積極的に老健看護の専門性を伝承し、後進の成長に大きく貢献
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="B" id="succession-superior-b" />
                            <Label htmlFor="succession-superior-b" className="font-normal">
                              <span className="font-semibold">B：</span> 求められれば適切に知識・技術を共有
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="C" id="succession-superior-c" />
                            <Label htmlFor="succession-superior-c" className="font-normal">
                              <span className="font-semibold">C：</span> 知識継承への取り組みが不十分
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="D" id="succession-superior-d" />
                            <Label htmlFor="succession-superior-d" className="font-normal">
                              <span className="font-semibold">D：</span> 専門性を個人に留め、組織に還元していない
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="border-t pt-3">
                      <Label className="text-sm font-medium">自己評価</Label>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'succession', value)}>
                        <div className="flex space-x-4 mt-2">
                          {['S', 'A', 'B', 'C', 'D'].map(grade => (
                            <div key={grade} className="flex items-center">
                              <RadioGroupItem value={grade} id={`succession-self-${grade.toLowerCase()}`} />
                              <Label htmlFor={`succession-self-${grade.toLowerCase()}`} className="ml-2">
                                {grade}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                {/* 組織文化の醸成と模範性 */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Building className="h-4 w-4 mr-2 text-orange-600" />
                    3. 組織文化の醸成と模範性
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    老健の理念体現と全職員の模範となる行動
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">上司評価</Label>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'culture', value)}>
                        <div className="space-y-2 mt-2">
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="S" id="culture-superior-s" />
                            <Label htmlFor="culture-superior-s" className="font-normal">
                              <span className="font-semibold">S：</span> 老健の理念を体現し、組織文化のリーダーとして全職員の模範
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="A" id="culture-superior-a" />
                            <Label htmlFor="culture-superior-a" className="font-normal">
                              <span className="font-semibold">A：</span> 高い職業倫理を持ち、良好な組織文化の醸成に貢献
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="B" id="culture-superior-b" />
                            <Label htmlFor="culture-superior-b" className="font-normal">
                              <span className="font-semibold">B：</span> 安定した職務態度で模範的な行動を示す
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="C" id="culture-superior-c" />
                            <Label htmlFor="culture-superior-c" className="font-normal">
                              <span className="font-semibold">C：</span> 個人の業務に専念し、文化醸成への影響は限定的
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="D" id="culture-superior-d" />
                            <Label htmlFor="culture-superior-d" className="font-normal">
                              <span className="font-semibold">D：</span> 組織文化への配慮が不足している
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="border-t pt-3">
                      <Label className="text-sm font-medium">自己評価</Label>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'culture', value)}>
                        <div className="flex space-x-4 mt-2">
                          {['S', 'A', 'B', 'C', 'D'].map(grade => (
                            <div key={grade} className="flex items-center">
                              <RadioGroupItem value={grade} id={`culture-self-${grade.toLowerCase()}`} />
                              <Label htmlFor={`culture-self-${grade.toLowerCase()}`} className="ml-2">
                                {grade}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                {/* 専門性の活用 */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Calculator className="h-4 w-4 mr-2 text-purple-600" />
                    4. 専門性の活用と老健看護の発展
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    在宅復帰支援のエキスパートとしての実績と老健看護の発展への貢献
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">上司評価</Label>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('superiorEval', 'expertise', value)}>
                        <div className="space-y-2 mt-2">
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="S" id="expertise-superior-s" />
                            <Label htmlFor="expertise-superior-s" className="font-normal">
                              <span className="font-semibold">S：</span> 老健看護分野の先駆者として業界全体の発展に貢献
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="A" id="expertise-superior-a" />
                            <Label htmlFor="expertise-superior-a" className="font-normal">
                              <span className="font-semibold">A：</span> 高度な専門性を発揮し、在宅復帰支援の成果で組織をリード
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="B" id="expertise-superior-b" />
                            <Label htmlFor="expertise-superior-b" className="font-normal">
                              <span className="font-semibold">B：</span> 専門分野で確実な成果を上げている
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="C" id="expertise-superior-c" />
                            <Label htmlFor="expertise-superior-c" className="font-normal">
                              <span className="font-semibold">C：</span> 専門性の活用が限定的
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="D" id="expertise-superior-d" />
                            <Label htmlFor="expertise-superior-d" className="font-normal">
                              <span className="font-semibold">D：</span> 専門性を十分に活用できていない
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="border-t pt-3">
                      <Label className="text-sm font-medium">自己評価</Label>
                      <RadioGroup onValueChange={(value) => handleTechnicalScoreChange('selfEval', 'expertise', value)}>
                        <div className="flex space-x-4 mt-2">
                          {['S', 'A', 'B', 'C', 'D'].map(grade => (
                            <div key={grade} className="flex items-center">
                              <RadioGroupItem value={grade} id={`expertise-self-${grade.toLowerCase()}`} />
                              <Label htmlFor={`expertise-self-${grade.toLowerCase()}`} className="ml-2">
                                {grade}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                {/* 特別貢献項目 */}
                <div className="border rounded-lg p-4 bg-amber-50">
                  <h4 className="font-semibold mb-3">特別貢献項目（各1点、最大5点のボーナス）</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="national-presentation"
                        checked={specialContributions.nationalPresentation}
                        onCheckedChange={(checked) => handleSpecialContributionChange('nationalPresentation', checked)}
                      />
                      <Label htmlFor="national-presentation">全国学会・研修会での発表・講演</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="certification-leader"
                        checked={specialContributions.certificationLeader}
                        onCheckedChange={(checked) => handleSpecialContributionChange('certificationLeader', checked)}
                      />
                      <Label htmlFor="certification-leader">認定看護師等の専門資格取得・活用</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="expert-consultant"
                        checked={specialContributions.expertConsultant}
                        onCheckedChange={(checked) => handleSpecialContributionChange('expertConsultant', checked)}
                      />
                      <Label htmlFor="expert-consultant">外部機関からの専門コンサルタント依頼</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="system-development"
                        checked={specialContributions.systemDevelopment}
                        onCheckedChange={(checked) => handleSpecialContributionChange('systemDevelopment', checked)}
                      />
                      <Label htmlFor="system-development">革新的なケアシステム・プログラムの開発</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="mentorship-program"
                        checked={specialContributions.mentorshipProgram}
                        onCheckedChange={(checked) => handleSpecialContributionChange('mentorshipProgram', checked)}
                      />
                      <Label htmlFor="mentorship-program">メンターシッププログラムの設計・運営</Label>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">技術評価点数</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {Math.round(calculateTechnicalScore() * 10) / 10} / 50点
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    特別貢献ボーナス: {Object.values(specialContributions).filter(Boolean).length}点
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* 施設貢献タブ */}
            <TabsContent value="facility" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">施設貢献度評価（25点満点）</h3>
                <p className="text-sm text-gray-600 mb-4">
                  老健内での専門性発揮と組織レベルでの影響力を相対評価で採点します（既存ポイント制度を活用）
                </p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold mb-2">評価対象となる貢献活動</h4>
                <ul className="text-sm space-y-1">
                  <li>• 組織変革プロジェクトの主導</li>
                  <li>• 施設運営への戦略的提言・参画</li>
                  <li>• 体系的な教育プログラムの構築・運営</li>
                  <li>• 新規事業・サービスの企画・立案</li>
                  <li>• 在宅復帰率向上プロジェクトの統括</li>
                  <li>• 他部門・多職種との連携強化の推進</li>
                  <li>• 施設の質改善・認証取得への貢献</li>
                  <li>• 危機管理・緊急事態対応の指揮</li>
                </ul>
              </div>

              <div>
                <Label htmlFor="facility-points">施設貢献度ポイント</Label>
                <Input 
                  type="number" 
                  id="facility-points" 
                  placeholder="取得ポイント数を入力"
                  className="mb-2"
                />
                <p className="text-sm text-gray-600">
                  同期ベテラン看護師の中での相対的な位置づけを評価
                </p>
              </div>

              <div>
                <Label htmlFor="facility-percentile">施設内パーセンタイル順位</Label>
                <div className="flex items-center space-x-4">
                  <Input 
                    type="number" 
                    id="facility-percentile" 
                    value={facilityRank}
                    onChange={(e) => setFacilityRank(Number(e.target.value))}
                    min="1"
                    max="100"
                    className="w-24"
                  />
                  <span className="text-sm text-gray-600">
                    パーセンタイル（1=最上位、100=最下位）
                  </span>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>パーセンタイル</TableHead>
                    <TableHead>評価</TableHead>
                    <TableHead>点数</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>1-10%</TableCell>
                    <TableCell>極めて高い貢献（施設の柱）</TableCell>
                    <TableCell>25点</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>11-20%</TableCell>
                    <TableCell>非常に高い貢献</TableCell>
                    <TableCell>22.5点</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>21-30%</TableCell>
                    <TableCell>高い貢献</TableCell>
                    <TableCell>20点</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>31-40%</TableCell>
                    <TableCell>やや高い貢献</TableCell>
                    <TableCell>17.5点</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>41-50%</TableCell>
                    <TableCell>標準的な貢献</TableCell>
                    <TableCell>15点</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>51-60%</TableCell>
                    <TableCell>やや低い貢献</TableCell>
                    <TableCell>12.5点</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>61-100%</TableCell>
                    <TableCell>改善が必要</TableCell>
                    <TableCell>10点以下</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div>
                <Label htmlFor="facility-activities">具体的な貢献活動</Label>
                <Textarea 
                  id="facility-activities" 
                  placeholder="組織変革の実績、教育プログラムの成果、戦略的提言の内容など具体的に記入"
                  className="min-h-[100px]"
                />
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">施設貢献度点数</span>
                  <span className="text-2xl font-bold text-green-600">
                    {calculateContributionScore(facilityRank)} / 25点
                  </span>
                </div>
              </div>
            </TabsContent>

            {/* 法人貢献タブ */}
            <TabsContent value="corporate" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">法人貢献度評価（25点満点）</h3>
                <p className="text-sm text-gray-600 mb-4">
                  法人全体での専門性発揮と業界への影響力を相対評価で採点します（既存ポイント制度を活用）
                </p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold mb-2">評価対象となる貢献活動</h4>
                <ul className="text-sm space-y-1">
                  <li>• 法人戦略への参画・提言</li>
                  <li>• 法人内他施設の指導・支援統括</li>
                  <li>• 業界団体での役職・委員会活動</li>
                  <li>• 学会発表・論文執筆・書籍執筆</li>
                  <li>• 他法人・大学等との共同研究</li>
                  <li>• 地域包括ケアシステムでの中心的役割</li>
                  <li>• 行政・自治体の専門委員・アドバイザー</li>
                  <li>• メディア出演・専門誌寄稿</li>
                </ul>
              </div>

              <div>
                <Label htmlFor="corporate-points">法人貢献度ポイント</Label>
                <Input 
                  type="number" 
                  id="corporate-points" 
                  placeholder="取得ポイント数を入力"
                  className="mb-2"
                />
                <p className="text-sm text-gray-600">
                  法人内ベテラン看護師全体の中での相対的な位置づけを評価
                </p>
              </div>

              <div>
                <Label htmlFor="corporate-percentile">法人内パーセンタイル順位</Label>
                <div className="flex items-center space-x-4">
                  <Input 
                    type="number" 
                    id="corporate-percentile" 
                    value={corporateRank}
                    onChange={(e) => setCorporateRank(Number(e.target.value))}
                    min="1"
                    max="100"
                    className="w-24"
                  />
                  <span className="text-sm text-gray-600">
                    パーセンタイル（1=最上位、100=最下位）
                  </span>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>パーセンタイル</TableHead>
                    <TableHead>評価</TableHead>
                    <TableHead>点数</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>1-10%</TableCell>
                    <TableCell>極めて高い貢献（法人・業界の顔）</TableCell>
                    <TableCell>25点</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>11-20%</TableCell>
                    <TableCell>非常に高い貢献</TableCell>
                    <TableCell>22.5点</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>21-30%</TableCell>
                    <TableCell>高い貢献</TableCell>
                    <TableCell>20点</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>31-40%</TableCell>
                    <TableCell>やや高い貢献</TableCell>
                    <TableCell>17.5点</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>41-50%</TableCell>
                    <TableCell>標準的な貢献</TableCell>
                    <TableCell>15点</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>51-60%</TableCell>
                    <TableCell>やや低い貢献</TableCell>
                    <TableCell>12.5点</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>61-100%</TableCell>
                    <TableCell>改善が必要</TableCell>
                    <TableCell>10点以下</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div>
                <Label htmlFor="corporate-activities">具体的な貢献活動</Label>
                <Textarea 
                  id="corporate-activities" 
                  placeholder="学会発表、論文執筆、業界団体活動、地域連携での指導的役割など具体的に記入"
                  className="min-h-[100px]"
                />
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">法人貢献度点数</span>
                  <span className="text-2xl font-bold text-orange-600">
                    {calculateContributionScore(corporateRank)} / 25点
                  </span>
                </div>
              </div>
            </TabsContent>

            {/* 総合評価タブ */}
            <TabsContent value="summary" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">総合評価サマリー</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center">
                        <Award className="h-4 w-4 mr-2 text-blue-600" />
                        技術評価
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-blue-600">
                        {Math.round(calculateTechnicalScore() * 10) / 10} / 50点
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        360度評価による実力評価
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center">
                        <Building className="h-4 w-4 mr-2 text-green-600" />
                        施設貢献度
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-green-600">
                        {calculateContributionScore(facilityRank)} / 25点
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        老健内での相対評価
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center">
                        <Users className="h-4 w-4 mr-2 text-orange-600" />
                        法人貢献度
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-orange-600">
                        {calculateContributionScore(corporateRank)} / 25点
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        法人全体での相対評価
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg text-center">
                  <h4 className="text-lg font-semibold mb-2">総合点数</h4>
                  <p className={`text-4xl font-bold ${getScoreColor(totalScore)}`}>
                    {totalScore} / 100点
                  </p>
                  <Progress value={totalScore} className="h-4 mt-4 max-w-md mx-auto" />
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-3">評価ランク判定</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>点数帯</TableHead>
                        <TableHead>ランク</TableHead>
                        <TableHead>判定</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className={totalScore >= 90 ? 'bg-red-50' : ''}>
                        <TableCell>90点以上</TableCell>
                        <TableCell className="font-bold text-red-600">S</TableCell>
                        <TableCell>老健看護の権威（業界を代表する専門家）</TableCell>
                      </TableRow>
                      <TableRow className={totalScore >= 80 && totalScore < 90 ? 'bg-orange-50' : ''}>
                        <TableCell>80-89点</TableCell>
                        <TableCell className="font-bold text-orange-600">A</TableCell>
                        <TableCell>卓越したエキスパート（組織の中核人材）</TableCell>
                      </TableRow>
                      <TableRow className={totalScore >= 70 && totalScore < 80 ? 'bg-green-50' : ''}>
                        <TableCell>70-79点</TableCell>
                        <TableCell className="font-bold text-green-600">B</TableCell>
                        <TableCell>優秀なベテラン（安定した貢献）</TableCell>
                      </TableRow>
                      <TableRow className={totalScore >= 60 && totalScore < 70 ? 'bg-blue-50' : ''}>
                        <TableCell>60-69点</TableCell>
                        <TableCell className="font-bold text-blue-600">C</TableCell>
                        <TableCell>標準的なベテラン（一部課題あり）</TableCell>
                      </TableRow>
                      <TableRow className={totalScore < 60 ? 'bg-gray-50' : ''}>
                        <TableCell>60点未満</TableCell>
                        <TableCell className="font-bold text-gray-600">D</TableCell>
                        <TableCell>要改善（経験の活用に課題）</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div className="space-y-4 mt-6">
                  <div>
                    <Label htmlFor="strengths">特に優れている点・強み</Label>
                    <Textarea 
                      id="strengths" 
                      placeholder="専門性の活用、組織への影響力、人材育成の実績、業界への貢献など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="areas-for-improvement">さらなる発展への期待</Label>
                    <Textarea 
                      id="areas-for-improvement" 
                      placeholder="後継者育成、新分野への挑戦、業界での発信力強化など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="legacy-goals">知識継承・レガシー創出目標</Label>
                    <Textarea 
                      id="legacy-goals" 
                      placeholder="専門知識の体系化、後進の育成計画、組織文化の継承など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="supervisor-comment">上司からの総評</Label>
                    <Textarea 
                      id="supervisor-comment" 
                      placeholder="ベテラン看護師としての価値、組織への貢献度、今後への期待など"
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* 保存ボタン */}
          <div className="flex justify-end space-x-4 pt-6 border-t mt-6">
            <Button variant="outline">一時保存</Button>
            <Button>評価を確定</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}