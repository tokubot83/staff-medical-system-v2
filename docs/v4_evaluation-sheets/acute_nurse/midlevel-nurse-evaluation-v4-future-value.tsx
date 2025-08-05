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
import { InfoIcon, Clock, Rocket, Users, Lightbulb } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function MidlevelNurseEvaluationV4FutureValue() {
  // 評価項目の状態管理
  const [scores, setScores] = useState({
    // 現在価値（60点）
    currentTechnical: 0,
    currentContribution: 0,
    
    // 未来価値 - イノベーション（20点）
    innovationMindset: 0,
    processImprovement: 0,
    digitalTransformation: 0,
    
    // 未来価値 - 人材育成（20点）
    mentoring: 0,
    knowledgeTransfer: 0,
    cultureBuilding: 0
  });

  const [totalScore, setTotalScore] = useState(0);

  // 点数配分
  const scoreWeights = {
    // 現在価値（60点）
    currentTechnical: 30,
    currentContribution: 30,
    
    // 未来価値 - イノベーション（20点）
    innovationMindset: 7,
    processImprovement: 7,
    digitalTransformation: 6,
    
    // 未来価値 - 人材育成（20点）
    mentoring: 7,
    knowledgeTransfer: 7,
    cultureBuilding: 6
  };

  // 評価グレードから点数への変換
  const gradeToScore = {
    'S': 1.0,
    'A': 0.85,
    'B': 0.70,
    'C': 0.55,
    'D': 0.40
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

  // カテゴリ別スコア計算
  const calculateCurrentValue = () => {
    return Math.round((scores.currentTechnical * scoreWeights.currentTechnical + 
            scores.currentContribution * scoreWeights.currentContribution) * 10) / 10;
  };

  const calculateFutureValue = () => {
    return Math.round((scores.innovationMindset * scoreWeights.innovationMindset + 
            scores.processImprovement * scoreWeights.processImprovement + 
            scores.digitalTransformation * scoreWeights.digitalTransformation +
            scores.mentoring * scoreWeights.mentoring +
            scores.knowledgeTransfer * scoreWeights.knowledgeTransfer +
            scores.cultureBuilding * scoreWeights.cultureBuilding) * 10) / 10;
  };

  const calculateInnovationScore = () => {
    return Math.round((scores.innovationMindset * scoreWeights.innovationMindset + 
            scores.processImprovement * scoreWeights.processImprovement + 
            scores.digitalTransformation * scoreWeights.digitalTransformation) * 10) / 10;
  };

  const calculateHRDScore = () => {
    return Math.round((scores.mentoring * scoreWeights.mentoring +
            scores.knowledgeTransfer * scoreWeights.knowledgeTransfer +
            scores.cultureBuilding * scoreWeights.cultureBuilding) * 10) / 10;
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            中堅看護師（4-10年） 人事評価シート v4.0
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            未来創造ポイントシステム - 現在価値×未来価値の統合評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              <strong>評価構成：</strong>現在価値（60点）+ 未来価値（40点）
              <br />
              現在の実績だけでなく、将来への投資・組織の持続的成長への貢献を重視
            </AlertDescription>
          </Alert>

          {/* スコア表示バー */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-semibold">現在＋未来スコア</span>
              <span className={`text-3xl font-bold ${getScoreColor(totalScore)}`}>
                {totalScore} / 100点
              </span>
            </div>
            <Progress value={totalScore} className="h-3 mb-4" />
            
            {/* 現在価値と未来価値の対比 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-blue-600" />
                    <span className="font-semibold">現在価値</span>
                  </div>
                  <span className="text-xl font-bold text-blue-600">
                    {calculateCurrentValue()} / 60点
                  </span>
                </div>
                <Progress value={calculateCurrentValue() / 60 * 100} className="h-2" />
                <p className="text-xs text-gray-600 mt-1">現在の実績・成果</p>
              </div>
              
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Rocket className="h-5 w-5 mr-2 text-purple-600" />
                    <span className="font-semibold">未来価値</span>
                  </div>
                  <span className="text-xl font-bold text-purple-600">
                    {calculateFutureValue()} / 40点
                  </span>
                </div>
                <Progress value={calculateFutureValue() / 40 * 100} className="h-2" />
                <p className="text-xs text-gray-600 mt-1">将来への投資・貢献</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="basic">基本情報</TabsTrigger>
              <TabsTrigger value="current">現在価値</TabsTrigger>
              <TabsTrigger value="innovation">イノベーション</TabsTrigger>
              <TabsTrigger value="hrd">人材育成</TabsTrigger>
              <TabsTrigger value="future-plan">未来計画</TabsTrigger>
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
                    <Input type="text" id="corp-experience" placeholder="7年" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="previous-experience">前職経験</Label>
                    <Input type="text" id="previous-experience" placeholder="他病院5年（参考）" />
                  </div>
                  <div>
                    <Label htmlFor="career-goal">キャリア目標</Label>
                    <Input type="text" id="career-goal" placeholder="認定看護師取得、管理職等" />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 現在価値タブ（60点）*/}
            <TabsContent value="current" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-blue-600" />
                  現在価値評価（60点）
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  現時点での技術力と組織貢献の実績を評価
                </p>
              </div>

              <div className="space-y-6">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">1. 技術力・専門性（30点）</h4>
                  <RadioGroup onValueChange={(value) => handleScoreChange('currentTechnical', value)}>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="S" id="current-tech-s" />
                        <Label htmlFor="current-tech-s" className="font-normal">
                          <span className="font-semibold">S：</span> 法人トップクラスの技術力、院外でも認知される専門性
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="A" id="current-tech-a" />
                        <Label htmlFor="current-tech-a" className="font-normal">
                          <span className="font-semibold">A：</span> 高度な技術力を持ち、困難事例にも対応可能
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="B" id="current-tech-b" />
                        <Label htmlFor="current-tech-b" className="font-normal">
                          <span className="font-semibold">B：</span> 中堅として期待される技術レベルを保持
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="C" id="current-tech-c" />
                        <Label htmlFor="current-tech-c" className="font-normal">
                          <span className="font-semibold">C：</span> 基本的な技術は習得しているが、高度な対応に課題
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="D" id="current-tech-d" />
                        <Label htmlFor="current-tech-d" className="font-normal">
                          <span className="font-semibold">D：</span> 技術力に大きな課題があり、基礎からの見直しが必要
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">2. 現在の組織貢献（30点）</h4>
                  <RadioGroup onValueChange={(value) => handleScoreChange('currentContribution', value)}>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="S" id="current-contrib-s" />
                        <Label htmlFor="current-contrib-s" className="font-normal">
                          <span className="font-semibold">S：</span> 組織の要として多大な貢献、なくてはならない存在
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="A" id="current-contrib-a" />
                        <Label htmlFor="current-contrib-a" className="font-normal">
                          <span className="font-semibold">A：</span> リーダーシップを発揮し、チーム・組織に大きく貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="B" id="current-contrib-b" />
                        <Label htmlFor="current-contrib-b" className="font-normal">
                          <span className="font-semibold">B：</span> 期待される役割を適切に果たし、安定的に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="C" id="current-contrib-c" />
                        <Label htmlFor="current-contrib-c" className="font-normal">
                          <span className="font-semibold">C：</span> 基本的な貢献はあるが、より積極的な関与が望まれる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="D" id="current-contrib-d" />
                        <Label htmlFor="current-contrib-d" className="font-normal">
                          <span className="font-semibold">D：</span> 組織貢献が不足、個人プレーに陥りがち
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </TabsContent>

            {/* イノベーションタブ（20点）*/}
            <TabsContent value="innovation" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2 flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" />
                  イノベーション評価（20点）
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  新たな価値創造と組織変革への貢献を評価
                </p>
              </div>

              <div className="space-y-6">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">1. イノベーションマインド（7点）</h4>
                  <div className="mb-3">
                    <Badge variant="outline" className="mb-2">評価ポイント</Badge>
                    <p className="text-sm text-gray-600">新しいアイデアの提案、既存の枠を超えた発想</p>
                  </div>
                  <RadioGroup onValueChange={(value) => handleScoreChange('innovationMindset', value)}>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="S" id="innovation-mind-s" />
                        <Label htmlFor="innovation-mind-s" className="font-normal">
                          <span className="font-semibold">S：</span> 革新的なアイデアを次々と生み出し、実現に向けてリード
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="A" id="innovation-mind-a" />
                        <Label htmlFor="innovation-mind-a" className="font-normal">
                          <span className="font-semibold">A：</span> 常に新しい視点を持ち、積極的に改善提案
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="B" id="innovation-mind-b" />
                        <Label htmlFor="innovation-mind-b" className="font-normal">
                          <span className="font-semibold">B：</span> 時折新しいアイデアを提案し、改善に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="C" id="innovation-mind-c" />
                        <Label htmlFor="innovation-mind-c" className="font-normal">
                          <span className="font-semibold">C：</span> 新しい取り組みへの関心が低い
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="D" id="innovation-mind-d" />
                        <Label htmlFor="innovation-mind-d" className="font-normal">
                          <span className="font-semibold">D：</span> 現状維持志向が強く、変化に抵抗
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">2. 業務プロセス改善（7点）</h4>
                  <div className="mb-3">
                    <Badge variant="outline" className="mb-2">評価ポイント</Badge>
                    <p className="text-sm text-gray-600">効率化、標準化、品質向上への取り組み</p>
                  </div>
                  <RadioGroup onValueChange={(value) => handleScoreChange('processImprovement', value)}>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="S" id="process-s" />
                        <Label htmlFor="process-s" className="font-normal">
                          <span className="font-semibold">S：</span> 組織全体の業務を変革するレベルの改善を実現
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="A" id="process-a" />
                        <Label htmlFor="process-a" className="font-normal">
                          <span className="font-semibold">A：</span> 継続的に業務改善を行い、具体的な成果を創出
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="B" id="process-b" />
                        <Label htmlFor="process-b" className="font-normal">
                          <span className="font-semibold">B：</span> 必要に応じて業務改善に取り組む
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="C" id="process-c" />
                        <Label htmlFor="process-c" className="font-normal">
                          <span className="font-semibold">C：</span> 業務改善への関与が消極的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="D" id="process-d" />
                        <Label htmlFor="process-d" className="font-normal">
                          <span className="font-semibold">D：</span> 既存のやり方に固執し、改善に抵抗
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">3. デジタル化・新技術活用（6点）</h4>
                  <div className="mb-3">
                    <Badge variant="outline" className="mb-2">評価ポイント</Badge>
                    <p className="text-sm text-gray-600">ICT活用、新システム導入、デジタル化推進</p>
                  </div>
                  <RadioGroup onValueChange={(value) => handleScoreChange('digitalTransformation', value)}>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="S" id="digital-s" />
                        <Label htmlFor="digital-s" className="font-normal">
                          <span className="font-semibold">S：</span> デジタル化をリードし、新技術導入で大きな成果
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="A" id="digital-a" />
                        <Label htmlFor="digital-a" className="font-normal">
                          <span className="font-semibold">A：</span> 積極的に新技術を学び、業務に活用
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="B" id="digital-b" />
                        <Label htmlFor="digital-b" className="font-normal">
                          <span className="font-semibold">B：</span> 必要な技術は習得し、適切に活用
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="C" id="digital-c" />
                        <Label htmlFor="digital-c" className="font-normal">
                          <span className="font-semibold">C：</span> 新技術への適応が遅い
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="D" id="digital-d" />
                        <Label htmlFor="digital-d" className="font-normal">
                          <span className="font-semibold">D：</span> デジタル化に抵抗があり、従来の方法に固執
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </TabsContent>

            {/* 人材育成タブ（20点）*/}
            <TabsContent value="hrd" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-green-600" />
                  人材育成評価（20点）
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  次世代育成と組織文化醸成への貢献を評価
                </p>
              </div>

              <div className="space-y-6">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">1. 後輩指導・メンタリング（7点）</h4>
                  <div className="mb-3">
                    <Badge variant="outline" className="mb-2">評価ポイント</Badge>
                    <p className="text-sm text-gray-600">新人・後輩の成長度、指導実績、育成計画</p>
                  </div>
                  <RadioGroup onValueChange={(value) => handleScoreChange('mentoring', value)}>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="S" id="mentor-s" />
                        <Label htmlFor="mentor-s" className="font-normal">
                          <span className="font-semibold">S：</span> 多数の優秀な人材を育成、組織の教育システムに貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="A" id="mentor-a" />
                        <Label htmlFor="mentor-a" className="font-normal">
                          <span className="font-semibold">A：</span> 効果的な指導で後輩を着実に成長させる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="B" id="mentor-b" />
                        <Label htmlFor="mentor-b" className="font-normal">
                          <span className="font-semibold">B：</span> 求められた指導役割を適切に果たす
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="C" id="mentor-c" />
                        <Label htmlFor="mentor-c" className="font-normal">
                          <span className="font-semibold">C：</span> 指導への関与が限定的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="D" id="mentor-d" />
                        <Label htmlFor="mentor-d" className="font-normal">
                          <span className="font-semibold">D：</span> 後輩育成への意識が低い
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">2. 知識・技術の伝承（7点）</h4>
                  <div className="mb-3">
                    <Badge variant="outline" className="mb-2">評価ポイント</Badge>
                    <p className="text-sm text-gray-600">マニュアル作成、勉強会開催、ナレッジ共有</p>
                  </div>
                  <RadioGroup onValueChange={(value) => handleScoreChange('knowledgeTransfer', value)}>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="S" id="knowledge-transfer-s" />
                        <Label htmlFor="knowledge-transfer-s" className="font-normal">
                          <span className="font-semibold">S：</span> 体系的な知識共有システムを構築、組織の財産を創造
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="A" id="knowledge-transfer-a" />
                        <Label htmlFor="knowledge-transfer-a" className="font-normal">
                          <span className="font-semibold">A：</span> 積極的に知識を共有し、チーム全体のレベルアップに貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="B" id="knowledge-transfer-b" />
                        <Label htmlFor="knowledge-transfer-b" className="font-normal">
                          <span className="font-semibold">B：</span> 必要に応じて知識・技術を共有
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="C" id="knowledge-transfer-c" />
                        <Label htmlFor="knowledge-transfer-c" className="font-normal">
                          <span className="font-semibold">C：</span> 知識共有が消極的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="D" id="knowledge-transfer-d" />
                        <Label htmlFor="knowledge-transfer-d" className="font-normal">
                          <span className="font-semibold">D：</span> 知識を囲い込む傾向がある
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">3. 組織文化・風土づくり（6点）</h4>
                  <div className="mb-3">
                    <Badge variant="outline" className="mb-2">評価ポイント</Badge>
                    <p className="text-sm text-gray-600">チームビルディング、職場環境改善、文化醸成</p>
                  </div>
                  <RadioGroup onValueChange={(value) => handleScoreChange('cultureBuilding', value)}>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="S" id="culture-s" />
                        <Label htmlFor="culture-s" className="font-normal">
                          <span className="font-semibold">S：</span> 理想的な組織文化を体現し、全体に波及させる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="A" id="culture-a" />
                        <Label htmlFor="culture-a" className="font-normal">
                          <span className="font-semibold">A：</span> 積極的に良い文化づくりに貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="B" id="culture-b" />
                        <Label htmlFor="culture-b" className="font-normal">
                          <span className="font-semibold">B：</span> 組織文化に適応し、維持に協力
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="C" id="culture-c" />
                        <Label htmlFor="culture-c" className="font-normal">
                          <span className="font-semibold">C：</span> 組織文化への関心が低い
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="D" id="culture-d" />
                        <Label htmlFor="culture-d" className="font-normal">
                          <span className="font-semibold">D：</span> ネガティブな影響を与えることがある
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </TabsContent>

            {/* 未来計画タブ */}
            <TabsContent value="future-plan" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">未来創造計画</h3>
                <p className="text-sm text-gray-600 mb-6">
                  今後1-3年の具体的な成長計画と組織への貢献プラン
                </p>
              </div>

              <div className="space-y-6">
                {/* 個人の成長計画 */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">個人成長計画</h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="skill-goals">習得予定の技術・資格</Label>
                      <Textarea 
                        id="skill-goals" 
                        placeholder="認定看護師資格取得、新技術の習得計画など"
                        className="min-h-[80px]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="learning-plan">学習・研修計画</Label>
                      <Textarea 
                        id="learning-plan" 
                        placeholder="参加予定の研修、学会発表計画など"
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>
                </div>

                {/* イノベーション計画 */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">イノベーション創出計画</h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="innovation-projects">推進予定のプロジェクト</Label>
                      <Textarea 
                        id="innovation-projects" 
                        placeholder="業務改善プロジェクト、新システム導入など"
                        className="min-h-[80px]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="expected-impact">期待される成果・インパクト</Label>
                      <Textarea 
                        id="expected-impact" 
                        placeholder="効率化による時間削減、コスト削減、品質向上など具体的に"
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>
                </div>

                {/* 人材育成計画 */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">人材育成・組織貢献計画</h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="mentoring-plan">指導・育成計画</Label>
                      <Textarea 
                        id="mentoring-plan" 
                        placeholder="プリセプター活動、教育プログラム開発など"
                        className="min-h-[80px]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="culture-plan">組織文化醸成への取り組み</Label>
                      <Textarea 
                        id="culture-plan" 
                        placeholder="チームビルディング活動、職場環境改善提案など"
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 総合評価タブ */}
            <TabsContent value="summary" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">総合評価サマリー</h3>
                
                {/* 総合スコア */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg text-center mb-6">
                  <h4 className="text-xl font-semibold mb-2">未来創造スコア</h4>
                  <p className={`text-5xl font-bold ${getScoreColor(totalScore)}`}>
                    {totalScore}点
                  </p>
                  <p className="text-gray-600 mt-2">100点満点</p>
                  
                  <div className="mt-4 flex justify-center items-center gap-4">
                    <Badge className="text-lg px-4 py-1">
                      現在価値 {calculateCurrentValue()}点
                    </Badge>
                    <span className="text-2xl">+</span>
                    <Badge className="text-lg px-4 py-1" variant="secondary">
                      未来価値 {calculateFutureValue()}点
                    </Badge>
                  </div>
                </div>

                {/* 詳細スコア分析 */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">現在価値の内訳</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">技術力・専門性</span>
                            <span className="text-sm font-semibold">
                              {Math.round(scores.currentTechnical * scoreWeights.currentTechnical * 10) / 10}点
                            </span>
                          </div>
                          <Progress value={scores.currentTechnical * 100} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">組織貢献</span>
                            <span className="text-sm font-semibold">
                              {Math.round(scores.currentContribution * scoreWeights.currentContribution * 10) / 10}点
                            </span>
                          </div>
                          <Progress value={scores.currentContribution * 100} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">未来価値の内訳</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm flex items-center">
                              <Lightbulb className="h-3 w-3 mr-1" />
                              イノベーション
                            </span>
                            <span className="text-sm font-semibold">
                              {calculateInnovationScore()}点
                            </span>
                          </div>
                          <Progress value={calculateInnovationScore() / 20 * 100} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm flex items-center">
                              <Users className="h-3 w-3 mr-1" />
                              人材育成
                            </span>
                            <span className="text-sm font-semibold">
                              {calculateHRDScore()}点
                            </span>
                          </div>
                          <Progress value={calculateHRDScore() / 20 * 100} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* 未来価値診断 */}
                <div className="bg-purple-50 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold mb-2">未来価値タイプ診断</h4>
                  {(() => {
                    const futureValue = calculateFutureValue();
                    const innovationScore = calculateInnovationScore();
                    const hrdScore = calculateHRDScore();
                    
                    if (futureValue >= 35) {
                      return (
                        <div>
                          <Badge className="mb-2">未来創造リーダー</Badge>
                          <p className="text-sm">
                            現在の実績に加え、未来への投資も積極的。次世代の組織を創る人材
                          </p>
                        </div>
                      );
                    } else if (innovationScore >= 15) {
                      return (
                        <div>
                          <Badge className="mb-2">イノベーター</Badge>
                          <p className="text-sm">
                            新しい価値創造に強み。組織変革のキーパーソン
                          </p>
                        </div>
                      );
                    } else if (hrdScore >= 15) {
                      return (
                        <div>
                          <Badge className="mb-2">人材育成エキスパート</Badge>
                          <p className="text-sm">
                            次世代育成に強み。組織の持続的成長を支える人材
                          </p>
                        </div>
                      );
                    } else if (calculateCurrentValue() >= 50) {
                      return (
                        <div>
                          <Badge className="mb-2">現在価値重視型</Badge>
                          <p className="text-sm">
                            現在の業務で高い成果。未来価値創造への意識向上が課題
                          </p>
                        </div>
                      );
                    } else {
                      return (
                        <div>
                          <Badge className="mb-2">成長期待型</Badge>
                          <p className="text-sm">
                            現在・未来両面での成長が期待される。重点的な育成支援が必要
                          </p>
                        </div>
                      );
                    }
                  })()}
                </div>

                {/* キャリア開発提案 */}
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold mb-2">キャリア開発提案</h4>
                  <div className="space-y-2 text-sm">
                    {calculateFutureValue() >= 30 && (
                      <div className="flex items-start">
                        <Rocket className="h-4 w-4 mr-2 mt-0.5 text-blue-600" />
                        <span>管理職・プロジェクトリーダーへのキャリアパス検討</span>
                      </div>
                    )}
                    {calculateInnovationScore() >= 12 && (
                      <div className="flex items-start">
                        <Lightbulb className="h-4 w-4 mr-2 mt-0.5 text-yellow-600" />
                        <span>イノベーションプロジェクトへの参画機会提供</span>
                      </div>
                    )}
                    {calculateHRDScore() >= 12 && (
                      <div className="flex items-start">
                        <Users className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
                        <span>教育担当者・プリセプターとしての役割拡大</span>
                      </div>
                    )}
                    {calculateCurrentValue() < 40 && (
                      <div className="flex items-start">
                        <Clock className="h-4 w-4 mr-2 mt-0.5 text-gray-600" />
                        <span>基礎スキル向上のための研修プログラム参加</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 総合評価コメント */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="overall-evaluation">総合評価</Label>
                    <Textarea 
                      id="overall-evaluation" 
                      placeholder="現在価値と未来価値のバランス、特筆すべき強み、成長ポテンシャルなど"
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="development-recommendation">育成・活用提案</Label>
                    <Textarea 
                      id="development-recommendation" 
                      placeholder="今後の育成方針、配置・異動の提案、プロジェクト参画推奨など"
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-4 mt-6">
            <Button variant="outline">
              下書き保存
            </Button>
            <Button>
              評価を確定
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}