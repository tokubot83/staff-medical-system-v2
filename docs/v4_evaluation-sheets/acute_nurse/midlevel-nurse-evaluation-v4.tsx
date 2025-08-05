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
import { InfoIcon, Calculator } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

export default function MidlevelNurseEvaluationV4() {
  // 評価項目の状態管理
  const [scores, setScores] = useState({
    // 技術習得（30点）
    clinicalSkills: 0,
    specialtyKnowledge: 0,
    patientCare: 0,
    
    // 施設貢献（35点）
    teamLeadership: 0,
    mentoring: 0,
    operationalContribution: 0,
    
    // 法人貢献（35点）
    corporatePhilosophy: 0,
    crossDepartment: 0,
    corporateInitiatives: 0,
    innovation: 0
  });

  const [totalScore, setTotalScore] = useState(0);

  // 点数配分
  const scoreWeights = {
    // 技術習得（30点）
    clinicalSkills: 12,
    specialtyKnowledge: 10,
    patientCare: 8,
    
    // 施設貢献（35点）
    teamLeadership: 15,
    mentoring: 10,
    operationalContribution: 10,
    
    // 法人貢献（35点）
    corporatePhilosophy: 10,
    crossDepartment: 10,
    corporateInitiatives: 10,
    innovation: 5
  };

  // 評価グレードから点数への変換
  const gradeToScore = {
    'S': 1.0,   // 100%
    'A': 0.85,  // 85%
    'B': 0.70,  // 70%
    'C': 0.55,  // 55%
    'D': 0.40   // 40%
  };

  // 合計点数の計算
  useEffect(() => {
    let total = 0;
    Object.keys(scores).forEach(key => {
      total += scores[key] * scoreWeights[key];
    });
    setTotalScore(Math.round(total * 10) / 10);
  }, [scores]);

  const handleScoreChange = (category, grade) => {
    setScores(prev => ({
      ...prev,
      [category]: gradeToScore[grade] || 0
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
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            中堅看護師（4-10年） 人事評価シート v4.0
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            100点満点評価 - 技術習得・施設貢献・法人貢献のバランス重視
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              評価は各項目をS〜Dで評価し、自動的に100点満点に換算されます。
              技術習得（30点）・施設貢献（35点）・法人貢献（35点）の配分で総合評価を行います。
            </AlertDescription>
          </Alert>

          {/* スコア表示バー */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-semibold">現在の総合点数</span>
              <span className={`text-3xl font-bold ${getScoreColor(totalScore)}`}>
                {totalScore} / 100点
              </span>
            </div>
            <Progress value={totalScore} className="h-3" />
            <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
              <div>
                <span className="text-gray-600">技術習得: </span>
                <span className="font-semibold">
                  {Math.round((scores.clinicalSkills * scoreWeights.clinicalSkills + 
                   scores.specialtyKnowledge * scoreWeights.specialtyKnowledge + 
                   scores.patientCare * scoreWeights.patientCare) * 10) / 10} / 30点
                </span>
              </div>
              <div>
                <span className="text-gray-600">施設貢献: </span>
                <span className="font-semibold">
                  {Math.round((scores.teamLeadership * scoreWeights.teamLeadership + 
                   scores.mentoring * scoreWeights.mentoring + 
                   scores.operationalContribution * scoreWeights.operationalContribution) * 10) / 10} / 35点
                </span>
              </div>
              <div>
                <span className="text-gray-600">法人貢献: </span>
                <span className="font-semibold">
                  {Math.round((scores.corporatePhilosophy * scoreWeights.corporatePhilosophy + 
                   scores.crossDepartment * scoreWeights.crossDepartment + 
                   scores.corporateInitiatives * scoreWeights.corporateInitiatives + 
                   scores.innovation * scoreWeights.innovation) * 10) / 10} / 35点
                </span>
              </div>
            </div>
          </div>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">基本情報</TabsTrigger>
              <TabsTrigger value="technical">技術習得</TabsTrigger>
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
                    <Label htmlFor="department">所属病棟</Label>
                    <Input type="text" id="department" />
                  </div>
                  <div>
                    <Label htmlFor="experience">経験年数</Label>
                    <Input type="text" id="experience" placeholder="7年" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="role">現在の役割</Label>
                    <Input type="text" id="role" placeholder="チームリーダー / プリセプター" />
                  </div>
                  <div>
                    <Label htmlFor="specialty">専門分野</Label>
                    <Input type="text" id="specialty" placeholder="急性期看護 / がん看護" />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 技術習得タブ（30点） */}
            <TabsContent value="technical" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">技術習得評価（30点）</h3>
                <p className="text-sm text-gray-600 mb-4">
                  専門的な看護実践能力と知識の深さを評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 高度看護技術の実践（12点）</h4>
                  <RadioGroup onValueChange={(value) => handleScoreChange('clinicalSkills', value)}>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="S" id="clinical-s" />
                        <Label htmlFor="clinical-s" className="font-normal">
                          <span className="font-semibold">S：</span> 高度な技術を完璧に習得し、院内教育の講師として指導
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="A" id="clinical-a" />
                        <Label htmlFor="clinical-a" className="font-normal">
                          <span className="font-semibold">A：</span> 高度な技術を習得し、他スタッフの模範となる実践
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="B" id="clinical-b" />
                        <Label htmlFor="clinical-b" className="font-normal">
                          <span className="font-semibold">B：</span> 期待される技術を適切に実践できる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="C" id="clinical-c" />
                        <Label htmlFor="clinical-c" className="font-normal">
                          <span className="font-semibold">C：</span> 基本的な技術は実践できるが、高度な技術に課題
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="D" id="clinical-d" />
                        <Label htmlFor="clinical-d" className="font-normal">
                          <span className="font-semibold">D：</span> 中堅として期待される技術レベルに達していない
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 専門知識の深化と活用（10点）</h4>
                  <RadioGroup onValueChange={(value) => handleScoreChange('specialtyKnowledge', value)}>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="S" id="knowledge-s" />
                        <Label htmlFor="knowledge-s" className="font-normal">
                          <span className="font-semibold">S：</span> 専門分野のエキスパートとして、法人全体に知識を展開
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="A" id="knowledge-a" />
                        <Label htmlFor="knowledge-a" className="font-normal">
                          <span className="font-semibold">A：</span> 深い専門知識を持ち、部署内での相談役として機能
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="B" id="knowledge-b" />
                        <Label htmlFor="knowledge-b" className="font-normal">
                          <span className="font-semibold">B：</span> 必要な専門知識を持ち、適切に活用している
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="C" id="knowledge-c" />
                        <Label htmlFor="knowledge-c" className="font-normal">
                          <span className="font-semibold">C：</span> 基本的な知識はあるが、専門性の深化が不十分
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="D" id="knowledge-d" />
                        <Label htmlFor="knowledge-d" className="font-normal">
                          <span className="font-semibold">D：</span> 専門知識の更新が遅れ、実践への活用が限定的
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 患者・家族への高度なケア実践（8点）</h4>
                  <RadioGroup onValueChange={(value) => handleScoreChange('patientCare', value)}>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="S" id="care-s" />
                        <Label htmlFor="care-s" className="font-normal">
                          <span className="font-semibold">S：</span> 複雑な事例でも卓越したケアを提供し、患者満足度向上に大きく貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="A" id="care-a" />
                        <Label htmlFor="care-a" className="font-normal">
                          <span className="font-semibold">A：</span> 高度なアセスメントに基づく質の高いケアを実践
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="B" id="care-b" />
                        <Label htmlFor="care-b" className="font-normal">
                          <span className="font-semibold">B：</span> 期待されるレベルのケアを安定して提供
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="C" id="care-c" />
                        <Label htmlFor="care-c" className="font-normal">
                          <span className="font-semibold">C：</span> 基本的なケアは提供できるが、複雑な事例への対応に課題
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="D" id="care-d" />
                        <Label htmlFor="care-d" className="font-normal">
                          <span className="font-semibold">D：</span> ケアの質にばらつきがあり、改善が必要
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </TabsContent>

            {/* 施設貢献タブ（35点） */}
            <TabsContent value="facility" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">施設貢献評価（35点）</h3>
                <p className="text-sm text-gray-600 mb-4">
                  病棟運営への貢献とチームへの影響力を評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. チームリーダーシップ（15点）</h4>
                  <RadioGroup onValueChange={(value) => handleScoreChange('teamLeadership', value)}>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="S" id="leadership-s" />
                        <Label htmlFor="leadership-s" className="font-normal">
                          <span className="font-semibold">S：</span> 卓越したリーダーシップで病棟変革を主導、次期管理者候補
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="A" id="leadership-a" />
                        <Label htmlFor="leadership-a" className="font-normal">
                          <span className="font-semibold">A：</span> 優れたリーダーシップを発揮し、チームの士気向上に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="B" id="leadership-b" />
                        <Label htmlFor="leadership-b" className="font-normal">
                          <span className="font-semibold">B：</span> 期待されるリーダーシップを適切に発揮
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="C" id="leadership-c" />
                        <Label htmlFor="leadership-c" className="font-normal">
                          <span className="font-semibold">C：</span> リーダーシップの発揮が限定的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="D" id="leadership-d" />
                        <Label htmlFor="leadership-d" className="font-normal">
                          <span className="font-semibold">D：</span> リーダーシップが不足し、チームへの影響力が弱い
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 後輩指導・人材育成（10点）</h4>
                  <RadioGroup onValueChange={(value) => handleScoreChange('mentoring', value)}>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="S" id="mentor-s" />
                        <Label htmlFor="mentor-s" className="font-normal">
                          <span className="font-semibold">S：</span> 優秀な人材を多数育成し、施設の教育体制構築に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="A" id="mentor-a" />
                        <Label htmlFor="mentor-a" className="font-normal">
                          <span className="font-semibold">A：</span> 効果的な指導で後輩の成長を促進
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="B" id="mentor-b" />
                        <Label htmlFor="mentor-b" className="font-normal">
                          <span className="font-semibold">B：</span> 適切な後輩指導を実施
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="C" id="mentor-c" />
                        <Label htmlFor="mentor-c" className="font-normal">
                          <span className="font-semibold">C：</span> 指導は行うが効果が限定的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="D" id="mentor-d" />
                        <Label htmlFor="mentor-d" className="font-normal">
                          <span className="font-semibold">D：</span> 後輩指導への関与が不十分
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 病棟運営への貢献（10点）</h4>
                  <RadioGroup onValueChange={(value) => handleScoreChange('operationalContribution', value)}>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="S" id="operation-s" />
                        <Label htmlFor="operation-s" className="font-normal">
                          <span className="font-semibold">S：</span> 業務改善を主導し、病棟の効率化・質向上に大きく貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="A" id="operation-a" />
                        <Label htmlFor="operation-a" className="font-normal">
                          <span className="font-semibold">A：</span> 積極的な改善提案と実行で病棟運営に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="B" id="operation-b" />
                        <Label htmlFor="operation-b" className="font-normal">
                          <span className="font-semibold">B：</span> 病棟運営に適切に参画
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="C" id="operation-c" />
                        <Label htmlFor="operation-c" className="font-normal">
                          <span className="font-semibold">C：</span> 病棟運営への参画が受動的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="D" id="operation-d" />
                        <Label htmlFor="operation-d" className="font-normal">
                          <span className="font-semibold">D：</span> 病棟運営への貢献が不足
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </TabsContent>

            {/* 法人貢献タブ（35点） */}
            <TabsContent value="corporate" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">法人貢献評価（35点）</h3>
                <p className="text-sm text-gray-600 mb-4">
                  法人全体への貢献と組織横断的な活動を評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 法人理念・価値観の実践（10点）</h4>
                  <RadioGroup onValueChange={(value) => handleScoreChange('corporatePhilosophy', value)}>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="S" id="philosophy-s" />
                        <Label htmlFor="philosophy-s" className="font-normal">
                          <span className="font-semibold">S：</span> 法人理念の体現者として、他職員の模範となり文化醸成をリード
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="A" id="philosophy-a" />
                        <Label htmlFor="philosophy-a" className="font-normal">
                          <span className="font-semibold">A：</span> 法人理念を深く理解し、日々の実践で具現化
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="B" id="philosophy-b" />
                        <Label htmlFor="philosophy-b" className="font-normal">
                          <span className="font-semibold">B：</span> 法人理念に沿った行動を取っている
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="C" id="philosophy-c" />
                        <Label htmlFor="philosophy-c" className="font-normal">
                          <span className="font-semibold">C：</span> 法人理念の理解と実践が表面的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="D" id="philosophy-d" />
                        <Label htmlFor="philosophy-d" className="font-normal">
                          <span className="font-semibold">D：</span> 法人理念への意識が低い
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 他部署・他施設との連携（10点）</h4>
                  <RadioGroup onValueChange={(value) => handleScoreChange('crossDepartment', value)}>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="S" id="cross-s" />
                        <Label htmlFor="cross-s" className="font-normal">
                          <span className="font-semibold">S：</span> 法人内ネットワークのハブとなり、組織横断的な課題解決を主導
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="A" id="cross-a" />
                        <Label htmlFor="cross-a" className="font-normal">
                          <span className="font-semibold">A：</span> 積極的に他部署と連携し、法人全体の質向上に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="B" id="cross-b" />
                        <Label htmlFor="cross-b" className="font-normal">
                          <span className="font-semibold">B：</span> 必要に応じて他部署と適切に連携
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="C" id="cross-c" />
                        <Label htmlFor="cross-c" className="font-normal">
                          <span className="font-semibold">C：</span> 他部署との連携が限定的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="D" id="cross-d" />
                        <Label htmlFor="cross-d" className="font-normal">
                          <span className="font-semibold">D：</span> 部署内に閉じた活動にとどまる
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 法人全体の取り組みへの参加（10点）</h4>
                  <RadioGroup onValueChange={(value) => handleScoreChange('corporateInitiatives', value)}>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="S" id="initiatives-s" />
                        <Label htmlFor="initiatives-s" className="font-normal">
                          <span className="font-semibold">S：</span> 法人プロジェクトをリードし、成果を上げる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="A" id="initiatives-a" />
                        <Label htmlFor="initiatives-a" className="font-normal">
                          <span className="font-semibold">A：</span> 法人の委員会やプロジェクトに積極的に参加し貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="B" id="initiatives-b" />
                        <Label htmlFor="initiatives-b" className="font-normal">
                          <span className="font-semibold">B：</span> 求められた法人活動に適切に参加
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="C" id="initiatives-c" />
                        <Label htmlFor="initiatives-c" className="font-normal">
                          <span className="font-semibold">C：</span> 法人活動への参加が消極的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="D" id="initiatives-d" />
                        <Label htmlFor="initiatives-d" className="font-normal">
                          <span className="font-semibold">D：</span> 法人活動にほとんど参加しない
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">4. イノベーション・改善提案（5点）</h4>
                  <RadioGroup onValueChange={(value) => handleScoreChange('innovation', value)}>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="S" id="innovation-s" />
                        <Label htmlFor="innovation-s" className="font-normal">
                          <span className="font-semibold">S：</span> 革新的な提案を実現し、法人全体に大きなインパクト
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="A" id="innovation-a" />
                        <Label htmlFor="innovation-a" className="font-normal">
                          <span className="font-semibold">A：</span> 優れた改善提案を行い、実装に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="B" id="innovation-b" />
                        <Label htmlFor="innovation-b" className="font-normal">
                          <span className="font-semibold">B：</span> 建設的な提案を適宜行う
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="C" id="innovation-c" />
                        <Label htmlFor="innovation-c" className="font-normal">
                          <span className="font-semibold">C：</span> 提案は少ないが、求められれば意見を述べる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="D" id="innovation-d" />
                        <Label htmlFor="innovation-d" className="font-normal">
                          <span className="font-semibold">D：</span> 改善への意識が低く、現状維持的
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
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
                  
                  {/* 評価ランク */}
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

                {/* カテゴリ別スコア */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">技術習得</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-blue-600">
                        {Math.round((scores.clinicalSkills * scoreWeights.clinicalSkills + 
                         scores.specialtyKnowledge * scoreWeights.specialtyKnowledge + 
                         scores.patientCare * scoreWeights.patientCare) * 10) / 10}
                      </p>
                      <p className="text-sm text-gray-600">/ 30点</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">施設貢献</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-green-600">
                        {Math.round((scores.teamLeadership * scoreWeights.teamLeadership + 
                         scores.mentoring * scoreWeights.mentoring + 
                         scores.operationalContribution * scoreWeights.operationalContribution) * 10) / 10}
                      </p>
                      <p className="text-sm text-gray-600">/ 35点</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">法人貢献</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-orange-600">
                        {Math.round((scores.corporatePhilosophy * scoreWeights.corporatePhilosophy + 
                         scores.crossDepartment * scoreWeights.crossDepartment + 
                         scores.corporateInitiatives * scoreWeights.corporateInitiatives + 
                         scores.innovation * scoreWeights.innovation) * 10) / 10}
                      </p>
                      <p className="text-sm text-gray-600">/ 35点</p>
                    </CardContent>
                  </Card>
                </div>

                {/* 総合コメント */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="strengths">強み・優れている点</Label>
                    <Textarea 
                      id="strengths" 
                      placeholder="特に優れている能力、他者への良い影響、組織への貢献など"
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="improvements">改善点・成長課題</Label>
                    <Textarea 
                      id="improvements" 
                      placeholder="さらなる成長のための課題、スキルアップが必要な領域など"
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="next-actions">次期に向けたアクションプラン</Label>
                    <Textarea 
                      id="next-actions" 
                      placeholder="具体的な目標設定、研修計画、役割の変更など"
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