'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { 
  Building,
  Users,
  Calendar,
  TrendingUp,
  Save,
  AlertCircle,
  CheckCircle2,
  Star
} from 'lucide-react';

interface ContributionData {
  // 夏季評価（8月）
  summer: {
    facilityRawScore: number;    // 施設貢献度の素点（管理者入力）
    corporateRawScore: number;   // 法人貢献度の素点（管理者入力）
    facilityPoints?: number;     // 相対評価後の配点（最大12.5点）
    corporatePoints?: number;    // 相対評価後の配点（最大12.5点）
    facilityPercentile?: number; // 施設内順位パーセンタイル
    corporatePercentile?: number;// 法人内順位パーセンタイル
  };
  // 冬季評価（12月）
  winter: {
    facilityRawScore: number;    // 施設貢献度の素点（管理者入力）
    corporateRawScore: number;   // 法人貢献度の素点（管理者入力）
    facilityPoints?: number;     // 相対評価後の配点（最大12.5点）
    corporatePoints?: number;    // 相対評価後の配点（最大12.5点）
    facilityPercentile?: number; // 施設内順位パーセンタイル
    corporatePercentile?: number;// 法人内順位パーセンタイル
  };
}

interface Props {
  employeeId: string;
  employeeName: string;
  year: number;
  onSave?: (data: ContributionData) => void;
}

export default function ContributionEvaluationV2({
  employeeId,
  employeeName,
  year,
  onSave
}: Props) {
  const [contributionData, setContributionData] = useState<ContributionData>({
    summer: {
      facilityRawScore: 0,
      corporateRawScore: 0,
      facilityPoints: undefined,
      corporatePoints: undefined,
      facilityPercentile: undefined,
      corporatePercentile: undefined
    },
    winter: {
      facilityRawScore: 0,
      corporateRawScore: 0,
      facilityPoints: undefined,
      corporatePoints: undefined,
      facilityPercentile: undefined,
      corporatePercentile: undefined
    }
  });

  const [activeSeason, setActiveSeason] = useState<'summer' | 'winter'>('summer');
  const [saved, setSaved] = useState(false);

  // 各期の合計計算（相対評価後の配点を使用）
  const summerTotal = (contributionData.summer.facilityPoints || 0) + (contributionData.summer.corporatePoints || 0);
  const winterTotal = (contributionData.winter.facilityPoints || 0) + (contributionData.winter.corporatePoints || 0);
  const yearTotal = summerTotal + winterTotal;
  
  // 素点の合計（参考表示用）
  const summerRawTotal = contributionData.summer.facilityRawScore + contributionData.summer.corporateRawScore;
  const winterRawTotal = contributionData.winter.facilityRawScore + contributionData.winter.corporateRawScore;

  // 素点更新（管理者による評価入力）
  const updateRawScore = (
    season: 'summer' | 'winter',
    type: 'facility' | 'corporate',
    value: number
  ) => {
    const scoreKey = type === 'facility' ? 'facilityRawScore' : 'corporateRawScore';
    
    setContributionData(prev => ({
      ...prev,
      [season]: {
        ...prev[season],
        [scoreKey]: value
      }
    }));
  };
  
  // パーセンタイルから配点への変換（相対評価）
  const percentileToPoints = (percentile: number): number => {
    if (percentile <= 10) return 12.5;  // 上位10%
    if (percentile <= 20) return 11.25; // 上位20%
    if (percentile <= 30) return 10.0;  // 上位30%
    if (percentile <= 40) return 8.75;  // 上位40%
    if (percentile <= 50) return 7.5;   // 上位50%
    if (percentile <= 60) return 6.25;  // 上位60%
    if (percentile <= 70) return 5.0;   // 上位70%
    if (percentile <= 80) return 3.75;  // 上位80%
    if (percentile <= 90) return 2.5;   // 上位90%
    return 0;  // 下位10%
  };

  // 保存処理
  const handleSave = () => {
    if (onSave) {
      onSave(contributionData);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    
    console.log('貢献度評価を保存:', {
      employeeId,
      year,
      contributionData,
      total: yearTotal
    });
  };

  // 評価指標の説明
  const evaluationCriteria = {
    facility: [
      '施設内委員会活動への参加・貢献',
      '施設内研修の講師・企画運営',
      '業務改善提案・QC活動',
      '新人教育・プリセプター活動',
      '時間外協力・緊急対応',
      'チーム医療への貢献度'
    ],
    corporate: [
      '法人イベントへの参加・運営',
      '他施設への応援・技術指導',
      '法人プロジェクトへの参加',
      '採用活動・施設見学対応',
      '広報活動・対外的な活動',
      '法人理念の実践・浸透活動'
    ]
  };

  // パーセンタイルから評価グレードへの変換
  const percentileToGrade = (percentile: number | undefined) => {
    if (!percentile) return { grade: '未定', label: '順位待ち', color: 'text-gray-600' };
    if (percentile <= 10) return { grade: 'S', label: '卓越', color: 'text-yellow-800' };
    if (percentile <= 30) return { grade: 'A', label: '優秀', color: 'text-green-800' };
    if (percentile <= 70) return { grade: 'B', label: '標準', color: 'text-blue-800' };
    if (percentile <= 90) return { grade: 'C', label: '要改善', color: 'text-orange-800' };
    return { grade: 'D', label: '要支援', color: 'text-red-800' };
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Users className="w-8 h-8 text-blue-600" />
            貢献度評価（組織貢献度）
          </CardTitle>
          <CardDescription className="text-base">
            {employeeName} - {year}年度 - 年間50点満点（夏季25点 + 冬季25点）
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">夏季評価（8月）</p>
              <p className="text-2xl font-bold text-blue-600">
                {contributionData.summer.facilityPoints !== undefined ? 
                  `${summerTotal.toFixed(1)} / 25` : 
                  `素点: ${summerRawTotal}`
                }
              </p>
              {contributionData.summer.facilityPoints !== undefined && (
                <Progress 
                  value={(summerTotal / 25) * 100} 
                  className="mt-2 h-2"
                />
              )}
              {contributionData.summer.facilityPercentile !== undefined && (
                <p className="text-xs text-muted-foreground mt-1">
                  施設内: 上位{contributionData.summer.facilityPercentile.toFixed(0)}%
                </p>
              )}
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">冬季評価（12月）</p>
              <p className="text-2xl font-bold text-green-600">
                {contributionData.winter.facilityPoints !== undefined ? 
                  `${winterTotal.toFixed(1)} / 25` : 
                  `素点: ${winterRawTotal}`
                }
              </p>
              {contributionData.winter.facilityPoints !== undefined && (
                <Progress 
                  value={(winterTotal / 25) * 100} 
                  className="mt-2 h-2"
                />
              )}
              {contributionData.winter.facilityPercentile !== undefined && (
                <p className="text-xs text-muted-foreground mt-1">
                  施設内: 上位{contributionData.winter.facilityPercentile.toFixed(0)}%
                </p>
              )}
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">年間合計</p>
              <p className="text-2xl font-bold">
                {yearTotal.toFixed(1)} / 50
              </p>
              <Progress 
                value={(yearTotal / 50) * 100} 
                className="mt-2 h-2"
              />
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">評価期間</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <Calendar className="w-5 h-5 text-gray-600" />
                <span className="font-semibold">{year}年度</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 評価入力タブ */}
      <Tabs value={activeSeason} onValueChange={(v) => setActiveSeason(v as 'summer' | 'winter')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="summer" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            夏季評価（8月）- 12月〜5月実績
          </TabsTrigger>
          <TabsTrigger value="winter" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            冬季評価（12月）- 6月〜11月実績
          </TabsTrigger>
        </TabsList>

        {/* 夏季評価タブ */}
        <TabsContent value="summer" className="space-y-4">
          <EvaluationInput
            season="summer"
            facilityRawScore={contributionData.summer.facilityRawScore}
            corporateRawScore={contributionData.summer.corporateRawScore}
            facilityPoints={contributionData.summer.facilityPoints}
            corporatePoints={contributionData.summer.corporatePoints}
            facilityPercentile={contributionData.summer.facilityPercentile}
            corporatePercentile={contributionData.summer.corporatePercentile}
            onFacilityChange={(v) => updateRawScore('summer', 'facility', v)}
            onCorporateChange={(v) => updateRawScore('summer', 'corporate', v)}
            evaluationCriteria={evaluationCriteria}
            percentileToPoints={percentileToPoints}
            percentileToGrade={percentileToGrade}
          />
        </TabsContent>

        {/* 冬季評価タブ */}
        <TabsContent value="winter" className="space-y-4">
          <EvaluationInput
            season="winter"
            facilityRawScore={contributionData.winter.facilityRawScore}
            corporateRawScore={contributionData.winter.corporateRawScore}
            facilityPoints={contributionData.winter.facilityPoints}
            corporatePoints={contributionData.winter.corporatePoints}
            facilityPercentile={contributionData.winter.facilityPercentile}
            corporatePercentile={contributionData.winter.corporatePercentile}
            onFacilityChange={(v) => updateRawScore('winter', 'facility', v)}
            onCorporateChange={(v) => updateRawScore('winter', 'corporate', v)}
            evaluationCriteria={evaluationCriteria}
            percentileToPoints={percentileToPoints}
            percentileToGrade={percentileToGrade}
          />
        </TabsContent>
      </Tabs>

      {/* 年間サマリー */}
      <Card>
        <CardHeader>
          <CardTitle>年間評価サマリー</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 詳細内訳 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  施設貢献度（年間25点）
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">夏季（8月）</span>
                    <span className="font-medium">
                      {contributionData.summer.facilityPoints !== undefined ? 
                        `${contributionData.summer.facilityPoints.toFixed(1)} / 12.5点` : 
                        `素点: ${contributionData.summer.facilityRawScore}`
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">冬季（12月）</span>
                    <span className="font-medium">
                      {contributionData.winter.facilityPoints !== undefined ? 
                        `${contributionData.winter.facilityPoints.toFixed(1)} / 12.5点` : 
                        `素点: ${contributionData.winter.facilityRawScore}`
                      }
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>年間合計</span>
                    <span className="text-blue-600">
                      {(contributionData.summer.facilityPoints || 0) + (contributionData.winter.facilityPoints || 0)} / 25点
                    </span>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  法人貢献度（年間25点）
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">夏季（8月）</span>
                    <span className="font-medium">
                      {contributionData.summer.corporatePoints !== undefined ? 
                        `${contributionData.summer.corporatePoints.toFixed(1)} / 12.5点` : 
                        `素点: ${contributionData.summer.corporateRawScore}`
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">冬季（12月）</span>
                    <span className="font-medium">
                      {contributionData.winter.corporatePoints !== undefined ? 
                        `${contributionData.winter.corporatePoints.toFixed(1)} / 12.5点` : 
                        `素点: ${contributionData.winter.corporateRawScore}`
                      }
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>年間合計</span>
                    <span className="text-green-600">
                      {(contributionData.summer.corporatePoints || 0) + (contributionData.winter.corporatePoints || 0)} / 25点
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 総合結果 */}
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">貢献度評価 年間総合得点</p>
              <p className="text-3xl font-bold mb-2">
                {yearTotal.toFixed(1)} / 50点
              </p>
              <p className="text-sm text-muted-foreground">
                ※技術評価50点と合わせて100点満点で総合評価されます
              </p>
            </div>

            {/* 保存ボタン */}
            <div className="flex justify-end gap-3">
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                評価を保存
              </Button>
            </div>

            {saved && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  貢献度評価が正常に保存されました。
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 注意事項 */}
      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription>
          <strong>相対評価による配点システム：</strong>
          <div className="mt-2 space-y-1 text-sm">
            <p>1. 管理者が入力した素点を基に、施設・職種内で順位付けを実施</p>
            <p>2. パーセンタイルに基づいて自動的に配点（各期最大12.5点）</p>
            <p className="ml-4">・上位10%: 12.5点　・上位20%: 11.25点　・上位30%: 10点</p>
            <p className="ml-4">・上位50%: 7.5点　・上位70%: 5点　・上位90%: 2.5点</p>
            <p>3. 年度末に技術評価と統合して100点満点で最終評価</p>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}

// 評価入力コンポーネント
function EvaluationInput({
  season,
  facilityRawScore,
  corporateRawScore,
  facilityPoints,
  corporatePoints,
  facilityPercentile,
  corporatePercentile,
  onFacilityChange,
  onCorporateChange,
  evaluationCriteria,
  percentileToPoints,
  percentileToGrade
}: {
  season: string;
  facilityRawScore: number;
  corporateRawScore: number;
  facilityPoints?: number;
  corporatePoints?: number;
  facilityPercentile?: number;
  corporatePercentile?: number;
  onFacilityChange: (value: number) => void;
  onCorporateChange: (value: number) => void;
  evaluationCriteria: any;
  percentileToPoints: (percentile: number) => number;
  percentileToGrade: (percentile: number | undefined) => { grade: string; label: string; color: string };
}) {
  return (
    <div className="space-y-4">
      {/* 施設貢献度 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            施設貢献度（管理者評価）
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">評価素点（管理者入力）</label>
                <Input
                  type="number"
                  value={facilityRawScore}
                  onChange={(e) => onFacilityChange(Number(e.target.value))}
                  className="w-24 text-right"
                  placeholder="0-100"
                />
              </div>
              
              {facilityPercentile !== undefined && (
                <div className="bg-blue-50 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>施設内順位</span>
                    <span className="font-semibold">上位{facilityPercentile.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>相対評価グレード</span>
                    <Badge className={percentileToGrade(facilityPercentile).color}>
                      {percentileToGrade(facilityPercentile).grade}ランク
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">配点</span>
                    <span className="text-xl font-bold text-blue-600">
                      {facilityPoints?.toFixed(1)} / 12.5点
                    </span>
                  </div>
                  <Progress 
                    value={(facilityPoints || 0) / 12.5 * 100} 
                    className="h-2"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">評価基準：</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                {evaluationCriteria.facility.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Star className="w-3 h-3 mt-0.5 text-blue-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 法人貢献度 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            法人貢献度（管理者評価）
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">評価素点（管理者入力）</label>
                <Input
                  type="number"
                  value={corporateRawScore}
                  onChange={(e) => onCorporateChange(Number(e.target.value))}
                  className="w-24 text-right"
                  placeholder="0-100"
                />
              </div>
              
              {corporatePercentile !== undefined && (
                <div className="bg-green-50 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>法人内順位（職種別）</span>
                    <span className="font-semibold">上位{corporatePercentile.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>相対評価グレード</span>
                    <Badge className={percentileToGrade(corporatePercentile).color}>
                      {percentileToGrade(corporatePercentile).grade}ランク
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">配点</span>
                    <span className="text-xl font-bold text-green-600">
                      {corporatePoints?.toFixed(1)} / 12.5点
                    </span>
                  </div>
                  <Progress 
                    value={(corporatePoints || 0) / 12.5 * 100} 
                    className="h-2"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">評価基準：</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                {evaluationCriteria.corporate.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Star className="w-3 h-3 mt-0.5 text-green-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 期間合計 */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">
              {season === 'summer' ? '夏季' : '冬季'}評価 管理者入力素点
            </span>
            <span className="text-lg font-semibold">
              {(facilityRawScore + corporateRawScore).toFixed(0)}点
            </span>
          </div>
          
          {facilityPoints !== undefined && corporatePoints !== undefined && (
            <>
              <div className="border-t pt-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">相対評価後の配点</span>
                  <span className="text-2xl font-bold">
                    {(facilityPoints + corporatePoints).toFixed(1)} / 25点
                  </span>
                </div>
                <Progress 
                  value={((facilityPoints + corporatePoints) / 25) * 100} 
                  className="mt-2"
                />
              </div>
              
              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-sm">
                  ※ この配点は同じ施設・職種内での相対順位に基づいて自動計算されました
                </AlertDescription>
              </Alert>
            </>
          )}
        </div>
      </div>
    </div>
  );
}