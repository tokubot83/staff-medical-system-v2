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
import { InfoIcon, TrendingUp, Building2, Globe } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

// 評価カテゴリの型定義
type ScoreCategories = {
  technicalGrowth: number;
  knowledgeExpansion: number;
  leadershipDevelopment: number;
  patientSatisfaction: number;
  teamPerformance: number;
  operationalExcellence: number;
  communityHealth: number;
  regionalCollaboration: number;
  sdgsContribution: number;
};

type ScoreWeights = ScoreCategories;

type GradeValue = 'S' | 'A' | 'B' | 'C' | 'D';

export default function MidlevelNurseEvaluationV4TripleImpact() {
  // 評価項目の状態管理
  const [scores, setScores] = useState<ScoreCategories>({
    // 個人成長（33点）
    technicalGrowth: 0,
    knowledgeExpansion: 0,
    leadershipDevelopment: 0,
    
    // 施設インパクト（33点）
    patientSatisfaction: 0,
    teamPerformance: 0,
    operationalExcellence: 0,
    
    // 社会インパクト（34点）
    communityHealth: 0,
    regionalCollaboration: 0,
    sdgsContribution: 0
  });

  const [totalScore, setTotalScore] = useState(0);

  // 点数配分
  const scoreWeights: ScoreWeights = {
    // 個人成長（33点）
    technicalGrowth: 11,
    knowledgeExpansion: 11,
    leadershipDevelopment: 11,
    
    // 施設インパクト（33点）
    patientSatisfaction: 12,
    teamPerformance: 11,
    operationalExcellence: 10,
    
    // 社会インパクト（34点）
    communityHealth: 12,
    regionalCollaboration: 11,
    sdgsContribution: 11
  };

  // 評価グレードから点数への変換
  const gradeToScore: Record<GradeValue, number> = {
    'S': 1.0,
    'A': 0.85,
    'B': 0.70,
    'C': 0.55,
    'D': 0.40
  };

  // 合計点数の計算
  useEffect(() => {
    let total = 0;
    (Object.keys(scores) as Array<keyof ScoreCategories>).forEach(key => {
      total += scores[key] * scoreWeights[key];
    });
    setTotalScore(Math.round(total * 10) / 10);
  }, [scores]);

  const handleScoreChange = (category: keyof ScoreCategories, grade: GradeValue) => {
    setScores(prev => ({
      ...prev,
      [category]: gradeToScore[grade] || 0
    }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-red-600';
    if (score >= 80) return 'text-orange-600';
    if (score >= 70) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    return 'text-gray-600';
  };

  // 各カテゴリの合計計算
  const calculateCategoryScore = (category: 'personal' | 'facility' | 'social') => {
    switch(category) {
      case 'personal':
        return Math.round((scores.technicalGrowth * scoreWeights.technicalGrowth + 
                scores.knowledgeExpansion * scoreWeights.knowledgeExpansion + 
                scores.leadershipDevelopment * scoreWeights.leadershipDevelopment) * 10) / 10;
      case 'facility':
        return Math.round((scores.patientSatisfaction * scoreWeights.patientSatisfaction + 
                scores.teamPerformance * scoreWeights.teamPerformance + 
                scores.operationalExcellence * scoreWeights.operationalExcellence) * 10) / 10;
      case 'social':
        return Math.round((scores.communityHealth * scoreWeights.communityHealth + 
                scores.regionalCollaboration * scoreWeights.regionalCollaboration + 
                scores.sdgsContribution * scoreWeights.sdgsContribution) * 10) / 10;
      default:
        return 0;
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            中堅看護師（4-10年） 人事評価シート v4.0
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            トリプルインパクトシステム - 個人×施設×社会への貢献を評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              <strong>評価構成：</strong>個人成長（33点）+ 施設インパクト（33点）+ 社会インパクト（34点）
              <br />
              医療機関の社会的責任とESG経営の観点を組み込んだ先進的評価システム
            </AlertDescription>
          </Alert>

          {/* スコア表示バー */}
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 via-blue-50 to-green-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-semibold">現在の総合点数</span>
              <span className={`text-3xl font-bold ${getScoreColor(totalScore)}`}>
                {totalScore} / 100点
              </span>
            </div>
            <Progress value={totalScore} className="h-3 mb-4" />
            
            {/* トリプルインパクト表示 */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center bg-white rounded-lg p-3">
                <div className="flex items-center justify-center mb-1">
                  <TrendingUp className="h-5 w-5 mr-1 text-purple-600" />
                  <span className="text-sm font-semibold">個人成長</span>
                </div>
                <span className="text-xl font-bold text-purple-600">
                  {calculateCategoryScore('personal')} / 33点
                </span>
              </div>
              <div className="text-center bg-white rounded-lg p-3">
                <div className="flex items-center justify-center mb-1">
                  <Building2 className="h-5 w-5 mr-1 text-blue-600" />
                  <span className="text-sm font-semibold">施設インパクト</span>
                </div>
                <span className="text-xl font-bold text-blue-600">
                  {calculateCategoryScore('facility')} / 33点
                </span>
              </div>
              <div className="text-center bg-white rounded-lg p-3">
                <div className="flex items-center justify-center mb-1">
                  <Globe className="h-5 w-5 mr-1 text-green-600" />
                  <span className="text-sm font-semibold">社会インパクト</span>
                </div>
                <span className="text-xl font-bold text-green-600">
                  {calculateCategoryScore('social')} / 34点
                </span>
              </div>
            </div>
          </div>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">基本情報</TabsTrigger>
              <TabsTrigger value="personal">個人成長</TabsTrigger>
              <TabsTrigger value="facility">施設インパクト</TabsTrigger>
              <TabsTrigger value="social">社会インパクト</TabsTrigger>
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
                    <Label htmlFor="total-experience">通算経験年数</Label>
                    <Input type="text" id="total-experience" placeholder="12年" />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 個人成長タブ（33点）*/}
            <TabsContent value="personal" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
                  個人成長評価（33点）
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  職員個人の成長と自己実現への取り組みを評価
                </p>
              </div>

              <div className="space-y-6">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">1. 技術的成長（11点）</h4>
                  <RadioGroup onValueChange={(value) => handleScoreChange('technicalGrowth', value)}>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="S" id="tech-growth-s" />
                        <Label htmlFor="tech-growth-s" className="font-normal">
                          <span className="font-semibold">S：</span> 新しい技術を習得し、院内のイノベーターとして活躍
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="A" id="tech-growth-a" />
                        <Label htmlFor="tech-growth-a" className="font-normal">
                          <span className="font-semibold">A：</span> 継続的に技術向上に取り組み、専門性を深化
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="B" id="tech-growth-b" />
                        <Label htmlFor="tech-growth-b" className="font-normal">
                          <span className="font-semibold">B：</span> 必要な技術習得を着実に進めている
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="C" id="tech-growth-c" />
                        <Label htmlFor="tech-growth-c" className="font-normal">
                          <span className="font-semibold">C：</span> 技術向上への取り組みが限定的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="D" id="tech-growth-d" />
                        <Label htmlFor="tech-growth-d" className="font-normal">
                          <span className="font-semibold">D：</span> 技術的成長が停滞している
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">2. 知識・視野の拡大（11点）</h4>
                  <RadioGroup onValueChange={(value) => handleScoreChange('knowledgeExpansion', value)}>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="S" id="knowledge-s" />
                        <Label htmlFor="knowledge-s" className="font-normal">
                          <span className="font-semibold">S：</span> 学会発表・論文執筆など学術的貢献も含む幅広い知識獲得
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="A" id="knowledge-a" />
                        <Label htmlFor="knowledge-a" className="font-normal">
                          <span className="font-semibold">A：</span> 専門外の分野も含め、積極的に知識を拡大
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="B" id="knowledge-b" />
                        <Label htmlFor="knowledge-b" className="font-normal">
                          <span className="font-semibold">B：</span> 業務に必要な知識を適切に習得
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="C" id="knowledge-c" />
                        <Label htmlFor="knowledge-c" className="font-normal">
                          <span className="font-semibold">C：</span> 知識習得が受動的で範囲が狭い
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="D" id="knowledge-d" />
                        <Label htmlFor="knowledge-d" className="font-normal">
                          <span className="font-semibold">D：</span> 新しい知識への関心が低い
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">3. リーダーシップ開発（11点）</h4>
                  <RadioGroup onValueChange={(value) => handleScoreChange('leadershipDevelopment', value)}>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="S" id="leadership-s" />
                        <Label htmlFor="leadership-s" className="font-normal">
                          <span className="font-semibold">S：</span> 変革型リーダーシップを発揮し、組織文化に影響
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="A" id="leadership-a" />
                        <Label htmlFor="leadership-a" className="font-normal">
                          <span className="font-semibold">A：</span> リーダーシップスキルを磨き、チームに良い影響
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="B" id="leadership-b" />
                        <Label htmlFor="leadership-b" className="font-normal">
                          <span className="font-semibold">B：</span> 必要な場面でリーダーシップを発揮
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="C" id="leadership-c" />
                        <Label htmlFor="leadership-c" className="font-normal">
                          <span className="font-semibold">C：</span> リーダーシップ発揮の機会が限定的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="D" id="leadership-d" />
                        <Label htmlFor="leadership-d" className="font-normal">
                          <span className="font-semibold">D：</span> リーダーシップ開発への意欲が低い
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </TabsContent>

            {/* 施設インパクトタブ（33点）*/}
            <TabsContent value="facility" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2 flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                  施設インパクト評価（33点）
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  施設運営と患者ケアへの具体的な影響を評価
                </p>
              </div>

              <div className="space-y-6">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">1. 患者満足度への貢献（12点）</h4>
                  <div className="mb-3">
                    <Badge variant="outline" className="mb-2">測定指標</Badge>
                    <p className="text-sm text-gray-600">NPS向上、感謝の声、クレーム減少率など</p>
                  </div>
                  <RadioGroup onValueChange={(value) => handleScoreChange('patientSatisfaction', value)}>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="S" id="patient-sat-s" />
                        <Label htmlFor="patient-sat-s" className="font-normal">
                          <span className="font-semibold">S：</span> 患者満足度向上に顕著な貢献、表彰レベルの実績
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="A" id="patient-sat-a" />
                        <Label htmlFor="patient-sat-a" className="font-normal">
                          <span className="font-semibold">A：</span> 多数の患者から高評価、満足度指標の改善に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="B" id="patient-sat-b" />
                        <Label htmlFor="patient-sat-b" className="font-normal">
                          <span className="font-semibold">B：</span> 安定した患者対応で標準的な満足度を維持
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="C" id="patient-sat-c" />
                        <Label htmlFor="patient-sat-c" className="font-normal">
                          <span className="font-semibold">C：</span> 患者対応に改善の余地あり
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="D" id="patient-sat-d" />
                        <Label htmlFor="patient-sat-d" className="font-normal">
                          <span className="font-semibold">D：</span> 患者満足度に課題があり改善が必要
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">2. チームパフォーマンス向上（11点）</h4>
                  <div className="mb-3">
                    <Badge variant="outline" className="mb-2">測定指標</Badge>
                    <p className="text-sm text-gray-600">病棟KPI改善、離職率低下、チーム生産性向上など</p>
                  </div>
                  <RadioGroup onValueChange={(value) => handleScoreChange('teamPerformance', value)}>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="S" id="team-perf-s" />
                        <Label htmlFor="team-perf-s" className="font-normal">
                          <span className="font-semibold">S：</span> チーム全体のパフォーマンスを大幅に向上させる存在
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="A" id="team-perf-a" />
                        <Label htmlFor="team-perf-a" className="font-normal">
                          <span className="font-semibold">A：</span> チームの中核として高いパフォーマンスを牽引
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="B" id="team-perf-b" />
                        <Label htmlFor="team-perf-b" className="font-normal">
                          <span className="font-semibold">B：</span> チームメンバーとして適切に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="C" id="team-perf-c" />
                        <Label htmlFor="team-perf-c" className="font-normal">
                          <span className="font-semibold">C：</span> チーム貢献が限定的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="D" id="team-perf-d" />
                        <Label htmlFor="team-perf-d" className="font-normal">
                          <span className="font-semibold">D：</span> チームパフォーマンスへの貢献が不足
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">3. 業務効率・品質改善（10点）</h4>
                  <div className="mb-3">
                    <Badge variant="outline" className="mb-2">測定指標</Badge>
                    <p className="text-sm text-gray-600">インシデント減少、業務時間短縮、コスト削減など</p>
                  </div>
                  <RadioGroup onValueChange={(value) => handleScoreChange('operationalExcellence', value)}>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="S" id="operation-s" />
                        <Label htmlFor="operation-s" className="font-normal">
                          <span className="font-semibold">S：</span> 革新的な改善で施設全体の効率を大幅向上
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="A" id="operation-a" />
                        <Label htmlFor="operation-a" className="font-normal">
                          <span className="font-semibold">A：</span> 継続的な改善活動で明確な成果を創出
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="B" id="operation-b" />
                        <Label htmlFor="operation-b" className="font-normal">
                          <span className="font-semibold">B：</span> 日常業務を効率的に遂行
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="C" id="operation-c" />
                        <Label htmlFor="operation-c" className="font-normal">
                          <span className="font-semibold">C：</span> 業務効率に改善の余地あり
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="D" id="operation-d" />
                        <Label htmlFor="operation-d" className="font-normal">
                          <span className="font-semibold">D：</span> 業務効率・品質に課題あり
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </TabsContent>

            {/* 社会インパクトタブ（34点）*/}
            <TabsContent value="social" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2 flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-green-600" />
                  社会インパクト評価（34点）
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  地域社会への貢献とESG活動への取り組みを評価
                </p>
              </div>

              <div className="space-y-6">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">1. 地域健康増進への貢献（12点）</h4>
                  <div className="mb-3">
                    <Badge variant="outline" className="mb-2">測定指標</Badge>
                    <p className="text-sm text-gray-600">在宅復帰率、健康教室参加者数、予防活動実績など</p>
                  </div>
                  <RadioGroup onValueChange={(value) => handleScoreChange('communityHealth', value)}>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="S" id="community-s" />
                        <Label htmlFor="community-s" className="font-normal">
                          <span className="font-semibold">S：</span> 地域の健康指標改善に顕著な貢献、表彰・メディア掲載レベル
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="A" id="community-a" />
                        <Label htmlFor="community-a" className="font-normal">
                          <span className="font-semibold">A：</span> 地域健康教室の主導、在宅復帰率向上に大きく貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="B" id="community-b" />
                        <Label htmlFor="community-b" className="font-normal">
                          <span className="font-semibold">B：</span> 地域連携活動に適切に参加
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="C" id="community-c" />
                        <Label htmlFor="community-c" className="font-normal">
                          <span className="font-semibold">C：</span> 地域活動への参加が限定的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="D" id="community-d" />
                        <Label htmlFor="community-d" className="font-normal">
                          <span className="font-semibold">D：</span> 地域貢献への意識が低い
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">2. 地域医療連携の推進（11点）</h4>
                  <div className="mb-3">
                    <Badge variant="outline" className="mb-2">測定指標</Badge>
                    <p className="text-sm text-gray-600">他施設連携数、地域ケア会議参加、連携パス運用など</p>
                  </div>
                  <RadioGroup onValueChange={(value) => handleScoreChange('regionalCollaboration', value)}>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="S" id="regional-s" />
                        <Label htmlFor="regional-s" className="font-normal">
                          <span className="font-semibold">S：</span> 地域医療ネットワークの中心的存在として活躍
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="A" id="regional-a" />
                        <Label htmlFor="regional-a" className="font-normal">
                          <span className="font-semibold">A：</span> 積極的な連携活動で地域医療の質向上に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="B" id="regional-b" />
                        <Label htmlFor="regional-b" className="font-normal">
                          <span className="font-semibold">B：</span> 必要な連携業務を適切に遂行
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="C" id="regional-c" />
                        <Label htmlFor="regional-c" className="font-normal">
                          <span className="font-semibold">C：</span> 地域連携への関与が消極的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="D" id="regional-d" />
                        <Label htmlFor="regional-d" className="font-normal">
                          <span className="font-semibold">D：</span> 地域連携活動にほとんど参加しない
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">3. SDGs・社会課題への取り組み（11点）</h4>
                  <div className="mb-3">
                    <Badge variant="outline" className="mb-2">測定指標</Badge>
                    <p className="text-sm text-gray-600">環境負荷削減、ダイバーシティ推進、社会的弱者支援など</p>
                  </div>
                  <RadioGroup onValueChange={(value) => handleScoreChange('sdgsContribution', value)}>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="S" id="sdgs-s" />
                        <Label htmlFor="sdgs-s" className="font-normal">
                          <span className="font-semibold">S：</span> SDGsプロジェクトをリードし、社会的インパクトを創出
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="A" id="sdgs-a" />
                        <Label htmlFor="sdgs-a" className="font-normal">
                          <span className="font-semibold">A：</span> 環境・社会課題に積極的に取り組み、具体的成果
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="B" id="sdgs-b" />
                        <Label htmlFor="sdgs-b" className="font-normal">
                          <span className="font-semibold">B：</span> 基本的なSDGs活動に参加
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="C" id="sdgs-c" />
                        <Label htmlFor="sdgs-c" className="font-normal">
                          <span className="font-semibold">C：</span> SDGsへの関心・活動が限定的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="D" id="sdgs-d" />
                        <Label htmlFor="sdgs-d" className="font-normal">
                          <span className="font-semibold">D：</span> 社会課題への意識が低い
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
                <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-green-50 p-6 rounded-lg text-center mb-6">
                  <h4 className="text-xl font-semibold mb-2">トリプルインパクトスコア</h4>
                  <p className={`text-5xl font-bold ${getScoreColor(totalScore)}`}>
                    {totalScore}点
                  </p>
                  <p className="text-gray-600 mt-2">100点満点</p>
                </div>

                {/* インパクト分析 */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1 text-purple-600" />
                        個人成長
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-purple-600">
                        {calculateCategoryScore('personal')}
                      </p>
                      <p className="text-sm text-gray-600">/ 33点</p>
                      <Progress 
                        value={calculateCategoryScore('personal') / 33 * 100} 
                        className="h-2 mt-2"
                      />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <Building2 className="h-4 w-4 mr-1 text-blue-600" />
                        施設インパクト
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-blue-600">
                        {calculateCategoryScore('facility')}
                      </p>
                      <p className="text-sm text-gray-600">/ 33点</p>
                      <Progress 
                        value={calculateCategoryScore('facility') / 33 * 100} 
                        className="h-2 mt-2"
                      />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <Globe className="h-4 w-4 mr-1 text-green-600" />
                        社会インパクト
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-green-600">
                        {calculateCategoryScore('social')}
                      </p>
                      <p className="text-sm text-gray-600">/ 34点</p>
                      <Progress 
                        value={calculateCategoryScore('social') / 34 * 100} 
                        className="h-2 mt-2"
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* ESG評価 */}
                <div className="bg-green-50 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold mb-2">ESG貢献度評価</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-semibold">E（環境）:</span>
                      <span className="ml-2">省エネ活動、廃棄物削減への取り組み</span>
                    </div>
                    <div>
                      <span className="font-semibold">S（社会）:</span>
                      <span className="ml-2">地域健康増進、医療格差解消への貢献</span>
                    </div>
                    <div>
                      <span className="font-semibold">G（ガバナンス）:</span>
                      <span className="ml-2">医療安全、コンプライアンスへの貢献</span>
                    </div>
                  </div>
                </div>

                {/* 人材タイプ診断 */}
                <div className="bg-yellow-50 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold mb-2">人材タイプ診断</h4>
                  {(() => {
                    const personal = calculateCategoryScore('personal');
                    const facility = calculateCategoryScore('facility');
                    const social = calculateCategoryScore('social');
                    
                    if (personal >= 28 && facility >= 28 && social >= 28) {
                      return (
                        <div>
                          <Badge className="mb-2">トリプルインパクター</Badge>
                          <p className="text-sm">全方位で高い影響力を持つ稀有な人材。次世代経営幹部候補</p>
                        </div>
                      );
                    } else if (social >= 28) {
                      return (
                        <div>
                          <Badge className="mb-2">ソーシャルイノベーター</Badge>
                          <p className="text-sm">社会課題解決に情熱を持つ人材。地域連携・SDGsプロジェクトのリーダー適任</p>
                        </div>
                      );
                    } else if (facility >= 28) {
                      return (
                        <div>
                          <Badge className="mb-2">オペレーショナルエクセレンス</Badge>
                          <p className="text-sm">施設運営の要となる人材。管理職・主任候補として育成</p>
                        </div>
                      );
                    } else if (personal >= 28) {
                      return (
                        <div>
                          <Badge className="mb-2">プロフェッショナル</Badge>
                          <p className="text-sm">高い専門性を持つ人材。スペシャリストとしてのキャリア支援</p>
                        </div>
                      );
                    } else {
                      return (
                        <div>
                          <Badge className="mb-2">バランス型</Badge>
                          <p className="text-sm">各領域でバランスよく成長中。強みを見出し特化支援が必要</p>
                        </div>
                      );
                    }
                  })()}
                </div>

                {/* 総合コメント */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="impact-examples">具体的なインパクト事例</Label>
                    <Textarea 
                      id="impact-examples" 
                      placeholder="個人・施設・社会への具体的な貢献事例を記載"
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="growth-plan">成長支援プラン</Label>
                    <Textarea 
                      id="growth-plan" 
                      placeholder="トリプルインパクトを高めるための具体的な支援策"
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