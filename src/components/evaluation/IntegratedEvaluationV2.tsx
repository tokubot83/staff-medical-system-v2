'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calculator,
  Target,
  Users,
  Building,
  TrendingUp,
  FileText,
  CheckCircle2,
  AlertCircle,
  Download,
  Save,
  Award
} from 'lucide-react';

// 統合評価データ型
interface IntegratedEvaluationData {
  employeeId: string;
  employeeName: string;
  evaluationPeriod: string;
  facilityType: string;
  jobCategory: string;
  experienceLevel: string;
  
  // 技術評価（50点）
  technicalEvaluation: {
    coreItems: {  // 法人統一項目（30点）
      C01: { superior: number; self: number; };
      C02: { superior: number; self: number; };
      C03: { superior: number; self: number; };
    };
    facilityItems: { // 施設特化項目（20点）
      selectedItems: string[];
      scores: Record<string, number>;
    };
    totalScore: number;
  };
  
  // 貢献度評価（50点）
  contributionEvaluation: {
    facilityContribution: {  // 施設貢献度（25点）
      summer: number;  // 夏季（12.5点）
      winter: number;  // 冬季（12.5点）
    };
    corporateContribution: { // 法人貢献度（25点）
      summer: number;  // 夏季（12.5点）
      winter: number;  // 冬季（12.5点）
    };
    totalScore: number;
  };
  
  // 総合評価
  totalScore: number;  // 100点満点
  grade: string;       // S, A, B, C, D
}

export default function IntegratedEvaluationV2() {
  // デモ用初期データ
  const [evaluationData, setEvaluationData] = useState<IntegratedEvaluationData>({
    employeeId: 'EMP001',
    employeeName: '山田 花子',
    evaluationPeriod: '2025年度',
    facilityType: 'acute',
    jobCategory: 'nurse',
    experienceLevel: 'midlevel',
    
    technicalEvaluation: {
      coreItems: {
        C01: { superior: 0, self: 0 },
        C02: { superior: 0, self: 0 },
        C03: { superior: 0, self: 0 }
      },
      facilityItems: {
        selectedItems: [],
        scores: {}
      },
      totalScore: 0
    },
    
    contributionEvaluation: {
      facilityContribution: {
        summer: 0,
        winter: 0
      },
      corporateContribution: {
        summer: 0,
        winter: 0
      },
      totalScore: 0
    },
    
    totalScore: 0,
    grade: ''
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [saved, setSaved] = useState(false);

  // 技術評価の計算
  const calculateTechnicalScore = () => {
    const { coreItems, facilityItems } = evaluationData.technicalEvaluation;
    
    // 法人統一項目（30点）
    const coreScore = 
      coreItems.C01.superior + coreItems.C01.self +
      coreItems.C02.superior + coreItems.C02.self +
      coreItems.C03.superior + coreItems.C03.self;
    
    // 施設特化項目（20点）
    const facilityScore = Object.values(facilityItems.scores).reduce((sum, score) => sum + score, 0);
    
    return coreScore + facilityScore;
  };

  // 貢献度評価の計算
  const calculateContributionScore = () => {
    const { facilityContribution, corporateContribution } = evaluationData.contributionEvaluation;
    
    const facilityTotal = facilityContribution.summer + facilityContribution.winter;
    const corporateTotal = corporateContribution.summer + corporateContribution.winter;
    
    return facilityTotal + corporateTotal;
  };

  // 総合評価の計算とグレード判定
  const calculateTotalScoreAndGrade = () => {
    const technicalScore = calculateTechnicalScore();
    const contributionScore = calculateContributionScore();
    const total = technicalScore + contributionScore;
    
    let grade = '';
    if (total >= 90) grade = 'S';
    else if (total >= 80) grade = 'A';
    else if (total >= 70) grade = 'B';
    else if (total >= 60) grade = 'C';
    else grade = 'D';
    
    return { total, grade };
  };

  // スコアが変更されたときの処理
  useEffect(() => {
    const technicalScore = calculateTechnicalScore();
    const contributionScore = calculateContributionScore();
    const { total, grade } = calculateTotalScoreAndGrade();
    
    setEvaluationData(prev => ({
      ...prev,
      technicalEvaluation: {
        ...prev.technicalEvaluation,
        totalScore: technicalScore
      },
      contributionEvaluation: {
        ...prev.contributionEvaluation,
        totalScore: contributionScore
      },
      totalScore: total,
      grade: grade
    }));
  }, [
    evaluationData.technicalEvaluation.coreItems,
    evaluationData.technicalEvaluation.facilityItems,
    evaluationData.contributionEvaluation.facilityContribution,
    evaluationData.contributionEvaluation.corporateContribution
  ]);

  // デモ用：技術評価の入力
  const updateTechnicalScore = (category: 'C01' | 'C02' | 'C03', type: 'superior' | 'self', value: number) => {
    setEvaluationData(prev => ({
      ...prev,
      technicalEvaluation: {
        ...prev.technicalEvaluation,
        coreItems: {
          ...prev.technicalEvaluation.coreItems,
          [category]: {
            ...prev.technicalEvaluation.coreItems[category],
            [type]: value
          }
        }
      }
    }));
  };

  // デモ用：貢献度評価の入力
  const updateContributionScore = (
    type: 'facilityContribution' | 'corporateContribution',
    season: 'summer' | 'winter',
    value: number
  ) => {
    setEvaluationData(prev => ({
      ...prev,
      contributionEvaluation: {
        ...prev.contributionEvaluation,
        [type]: {
          ...prev.contributionEvaluation[type],
          [season]: value
        }
      }
    }));
  };

  // 保存処理
  const handleSave = () => {
    console.log('統合評価を保存:', evaluationData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // グレードの色
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'S': return 'text-purple-600 bg-purple-100';
      case 'A': return 'text-blue-600 bg-blue-100';
      case 'B': return 'text-green-600 bg-green-100';
      case 'C': return 'text-yellow-600 bg-yellow-100';
      case 'D': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Award className="w-8 h-8 text-indigo-600" />
            統合評価システム V2（100点満点）
          </CardTitle>
          <CardDescription className="text-base">
            {evaluationData.employeeName} - {evaluationData.evaluationPeriod}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">技術評価</p>
              <p className="text-2xl font-bold text-blue-600">
                {evaluationData.technicalEvaluation.totalScore} / 50
              </p>
              <Progress 
                value={(evaluationData.technicalEvaluation.totalScore / 50) * 100} 
                className="mt-2 h-2"
              />
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">貢献度評価</p>
              <p className="text-2xl font-bold text-green-600">
                {evaluationData.contributionEvaluation.totalScore} / 50
              </p>
              <Progress 
                value={(evaluationData.contributionEvaluation.totalScore / 50) * 100} 
                className="mt-2 h-2"
              />
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">総合評価</p>
              <p className="text-2xl font-bold">
                {evaluationData.totalScore} / 100
              </p>
              <Progress 
                value={evaluationData.totalScore} 
                className="mt-2 h-2"
              />
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">評価グレード</p>
              <div className={`text-3xl font-bold rounded-lg py-2 ${getGradeColor(evaluationData.grade)}`}>
                {evaluationData.grade || '-'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* タブコンテンツ */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="technical">技術評価</TabsTrigger>
          <TabsTrigger value="contribution">貢献度評価</TabsTrigger>
          <TabsTrigger value="summary">総合結果</TabsTrigger>
        </TabsList>

        {/* 概要タブ */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>評価構成</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* 技術評価の構成 */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    技術評価（50点）
                  </h3>
                  <div className="ml-7 space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>法人統一項目</span>
                      <Badge variant="secondary">30点</Badge>
                    </div>
                    <div className="ml-4 space-y-1 text-sm text-muted-foreground">
                      <div>・C01 専門技術・スキル（上司7点 + 本人3点）</div>
                      <div>・C02 対人関係・ケア（上司5点 + 本人5点）</div>
                      <div>・C03 安全・品質管理（上司8点 + 本人2点）</div>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>施設特化項目</span>
                      <Badge variant="secondary">20点</Badge>
                    </div>
                    <div className="ml-4 text-sm text-muted-foreground">
                      ・施設特性に応じて選択した項目を評価
                    </div>
                  </div>
                </div>

                {/* 貢献度評価の構成 */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    貢献度評価（50点）
                  </h3>
                  <div className="ml-7 space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>施設貢献度</span>
                      <Badge variant="secondary">25点</Badge>
                    </div>
                    <div className="ml-4 space-y-1 text-sm text-muted-foreground">
                      <div>・夏季査定（8月）: 12.5点</div>
                      <div>・冬季査定（12月）: 12.5点</div>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>法人貢献度</span>
                      <Badge variant="secondary">25点</Badge>
                    </div>
                    <div className="ml-4 space-y-1 text-sm text-muted-foreground">
                      <div>・夏季査定（8月）: 12.5点</div>
                      <div>・冬季査定（12月）: 12.5点</div>
                    </div>
                  </div>
                </div>

                {/* 評価グレード基準 */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    評価グレード基準
                  </h3>
                  <div className="ml-7 grid grid-cols-5 gap-2">
                    <div className="text-center p-2 bg-purple-50 rounded">
                      <div className="font-bold text-purple-600">S</div>
                      <div className="text-xs">90点以上</div>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="font-bold text-blue-600">A</div>
                      <div className="text-xs">80-89点</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded">
                      <div className="font-bold text-green-600">B</div>
                      <div className="text-xs">70-79点</div>
                    </div>
                    <div className="text-center p-2 bg-yellow-50 rounded">
                      <div className="font-bold text-yellow-600">C</div>
                      <div className="text-xs">60-69点</div>
                    </div>
                    <div className="text-center p-2 bg-red-50 rounded">
                      <div className="font-bold text-red-600">D</div>
                      <div className="text-xs">60点未満</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 技術評価タブ */}
        <TabsContent value="technical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>法人統一項目（30点）</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* C01: 専門技術・スキル */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">C01: 専門技術・スキル（10点）</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm">上司評価（7点満点）</label>
                      <div className="flex gap-1 mt-1">
                        {[...Array(7)].map((_, i) => (
                          <Button
                            key={i}
                            size="sm"
                            variant={evaluationData.technicalEvaluation.coreItems.C01.superior === i + 1 ? "default" : "outline"}
                            onClick={() => updateTechnicalScore('C01', 'superior', i + 1)}
                          >
                            {i + 1}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm">本人評価（3点満点）</label>
                      <div className="flex gap-1 mt-1">
                        {[...Array(3)].map((_, i) => (
                          <Button
                            key={i}
                            size="sm"
                            variant={evaluationData.technicalEvaluation.coreItems.C01.self === i + 1 ? "default" : "outline"}
                            onClick={() => updateTechnicalScore('C01', 'self', i + 1)}
                          >
                            {i + 1}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* C02: 対人関係・ケア */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">C02: 対人関係・ケア（10点）</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm">上司評価（5点満点）</label>
                      <div className="flex gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Button
                            key={i}
                            size="sm"
                            variant={evaluationData.technicalEvaluation.coreItems.C02.superior === i + 1 ? "default" : "outline"}
                            onClick={() => updateTechnicalScore('C02', 'superior', i + 1)}
                          >
                            {i + 1}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm">本人評価（5点満点）</label>
                      <div className="flex gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Button
                            key={i}
                            size="sm"
                            variant={evaluationData.technicalEvaluation.coreItems.C02.self === i + 1 ? "default" : "outline"}
                            onClick={() => updateTechnicalScore('C02', 'self', i + 1)}
                          >
                            {i + 1}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* C03: 安全・品質管理 */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">C03: 安全・品質管理（10点）</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm">上司評価（8点満点）</label>
                      <div className="flex gap-1 mt-1">
                        {[...Array(8)].map((_, i) => (
                          <Button
                            key={i}
                            size="sm"
                            variant={evaluationData.technicalEvaluation.coreItems.C03.superior === i + 1 ? "default" : "outline"}
                            onClick={() => updateTechnicalScore('C03', 'superior', i + 1)}
                          >
                            {i + 1}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm">本人評価（2点満点）</label>
                      <div className="flex gap-1 mt-1">
                        {[...Array(2)].map((_, i) => (
                          <Button
                            key={i}
                            size="sm"
                            variant={evaluationData.technicalEvaluation.coreItems.C03.self === i + 1 ? "default" : "outline"}
                            onClick={() => updateTechnicalScore('C03', 'self', i + 1)}
                          >
                            {i + 1}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>施設特化項目（20点）</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  施設特化項目は別画面で選択・評価します。
                  ここではデモ用に20点満点として計算されています。
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 貢献度評価タブ */}
        <TabsContent value="contribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>施設貢献度（25点）</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">夏季査定（8月）- 12.5点満点</label>
                  <input
                    type="number"
                    min="0"
                    max="12.5"
                    step="0.5"
                    className="w-full mt-1 p-2 border rounded"
                    value={evaluationData.contributionEvaluation.facilityContribution.summer}
                    onChange={(e) => updateContributionScore('facilityContribution', 'summer', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">冬季査定（12月）- 12.5点満点</label>
                  <input
                    type="number"
                    min="0"
                    max="12.5"
                    step="0.5"
                    className="w-full mt-1 p-2 border rounded"
                    value={evaluationData.contributionEvaluation.facilityContribution.winter}
                    onChange={(e) => updateContributionScore('facilityContribution', 'winter', Number(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>法人貢献度（25点）</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">夏季査定（8月）- 12.5点満点</label>
                  <input
                    type="number"
                    min="0"
                    max="12.5"
                    step="0.5"
                    className="w-full mt-1 p-2 border rounded"
                    value={evaluationData.contributionEvaluation.corporateContribution.summer}
                    onChange={(e) => updateContributionScore('corporateContribution', 'summer', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">冬季査定（12月）- 12.5点満点</label>
                  <input
                    type="number"
                    min="0"
                    max="12.5"
                    step="0.5"
                    className="w-full mt-1 p-2 border rounded"
                    value={evaluationData.contributionEvaluation.corporateContribution.winter}
                    onChange={(e) => updateContributionScore('corporateContribution', 'winter', Number(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 総合結果タブ */}
        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>評価サマリー</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* スコア詳細 */}
                <div>
                  <h3 className="font-semibold mb-3">評価内訳</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                      <span className="font-medium">技術評価</span>
                      <span className="font-bold text-blue-600">
                        {evaluationData.technicalEvaluation.totalScore} / 50点
                      </span>
                    </div>
                    <div className="ml-4 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>法人統一項目</span>
                        <span>
                          {evaluationData.technicalEvaluation.coreItems.C01.superior + evaluationData.technicalEvaluation.coreItems.C01.self +
                           evaluationData.technicalEvaluation.coreItems.C02.superior + evaluationData.technicalEvaluation.coreItems.C02.self +
                           evaluationData.technicalEvaluation.coreItems.C03.superior + evaluationData.technicalEvaluation.coreItems.C03.self} / 30点
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>施設特化項目</span>
                        <span>- / 20点</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                      <span className="font-medium">貢献度評価</span>
                      <span className="font-bold text-green-600">
                        {evaluationData.contributionEvaluation.totalScore} / 50点
                      </span>
                    </div>
                    <div className="ml-4 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>施設貢献度</span>
                        <span>
                          {evaluationData.contributionEvaluation.facilityContribution.summer + 
                           evaluationData.contributionEvaluation.facilityContribution.winter} / 25点
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>法人貢献度</span>
                        <span>
                          {evaluationData.contributionEvaluation.corporateContribution.summer + 
                           evaluationData.contributionEvaluation.corporateContribution.winter} / 25点
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 最終結果 */}
                <div className="border-t pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">総合評価</p>
                    <p className="text-4xl font-bold mb-4">
                      {evaluationData.totalScore} / 100点
                    </p>
                    <div className={`inline-block text-2xl font-bold px-6 py-3 rounded-lg ${getGradeColor(evaluationData.grade)}`}>
                      グレード: {evaluationData.grade || '-'}
                    </div>
                  </div>
                </div>

                {/* アクションボタン */}
                <div className="flex justify-center gap-3 pt-4">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    PDFダウンロード
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    評価を保存
                  </Button>
                </div>

                {saved && (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      評価が正常に保存されました。
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}