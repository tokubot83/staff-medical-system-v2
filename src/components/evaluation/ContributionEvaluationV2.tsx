'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
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
    facility: number;  // 施設貢献度（最大12.5点）
    corporate: number; // 法人貢献度（最大12.5点）
  };
  // 冬季評価（12月）
  winter: {
    facility: number;  // 施設貢献度（最大12.5点）
    corporate: number; // 法人貢献度（最大12.5点）
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
      facility: 0,
      corporate: 0
    },
    winter: {
      facility: 0,
      corporate: 0
    }
  });

  const [activeSeason, setActiveSeason] = useState<'summer' | 'winter'>('summer');
  const [saved, setSaved] = useState(false);

  // 各期の合計計算
  const summerTotal = contributionData.summer.facility + contributionData.summer.corporate;
  const winterTotal = contributionData.winter.facility + contributionData.winter.corporate;
  const yearTotal = summerTotal + winterTotal;

  // スコア更新
  const updateScore = (
    season: 'summer' | 'winter',
    type: 'facility' | 'corporate',
    value: number
  ) => {
    // 最大12.5点に制限
    const limitedValue = Math.min(12.5, Math.max(0, value));
    
    setContributionData(prev => ({
      ...prev,
      [season]: {
        ...prev[season],
        [type]: limitedValue
      }
    }));
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

  // 相対評価の基準
  const getRelativeGrade = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 90) return { grade: 'S', label: '卓越', color: 'text-yellow-800' };
    if (percentage >= 70) return { grade: 'A', label: '優秀', color: 'text-green-800' };
    if (percentage >= 50) return { grade: 'B', label: '標準', color: 'text-blue-800' };
    if (percentage >= 30) return { grade: 'C', label: '要改善', color: 'text-orange-800' };
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
                {summerTotal.toFixed(1)} / 25
              </p>
              <Progress 
                value={(summerTotal / 25) * 100} 
                className="mt-2 h-2"
              />
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">冬季評価（12月）</p>
              <p className="text-2xl font-bold text-green-600">
                {winterTotal.toFixed(1)} / 25
              </p>
              <Progress 
                value={(winterTotal / 25) * 100} 
                className="mt-2 h-2"
              />
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
            facilityScore={contributionData.summer.facility}
            corporateScore={contributionData.summer.corporate}
            onFacilityChange={(v) => updateScore('summer', 'facility', v)}
            onCorporateChange={(v) => updateScore('summer', 'corporate', v)}
            evaluationCriteria={evaluationCriteria}
          />
        </TabsContent>

        {/* 冬季評価タブ */}
        <TabsContent value="winter" className="space-y-4">
          <EvaluationInput
            season="winter"
            facilityScore={contributionData.winter.facility}
            corporateScore={contributionData.winter.corporate}
            onFacilityChange={(v) => updateScore('winter', 'facility', v)}
            onCorporateChange={(v) => updateScore('winter', 'corporate', v)}
            evaluationCriteria={evaluationCriteria}
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
                    <span className="font-medium">{contributionData.summer.facility.toFixed(1)} / 12.5点</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">冬季（12月）</span>
                    <span className="font-medium">{contributionData.winter.facility.toFixed(1)} / 12.5点</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>年間合計</span>
                    <span className="text-blue-600">
                      {(contributionData.summer.facility + contributionData.winter.facility).toFixed(1)} / 25点
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
                    <span className="font-medium">{contributionData.summer.corporate.toFixed(1)} / 12.5点</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">冬季（12月）</span>
                    <span className="font-medium">{contributionData.winter.corporate.toFixed(1)} / 12.5点</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>年間合計</span>
                    <span className="text-green-600">
                      {(contributionData.summer.corporate + contributionData.winter.corporate).toFixed(1)} / 25点
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
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>相対評価について：</strong>
          各期の25点満点の得点は、最終的に同職種内での相対順位によりS～Dランクに変換されます。
          施設内評価と法人内評価の2軸でマトリクス評価を行い、最終グレードが決定されます。
        </AlertDescription>
      </Alert>
    </div>
  );
}

// 評価入力コンポーネント
function EvaluationInput({
  season,
  facilityScore,
  corporateScore,
  onFacilityChange,
  onCorporateChange,
  evaluationCriteria
}: {
  season: string;
  facilityScore: number;
  corporateScore: number;
  onFacilityChange: (value: number) => void;
  onCorporateChange: (value: number) => void;
  evaluationCriteria: any;
}) {
  return (
    <div className="space-y-4">
      {/* 施設貢献度 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            施設貢献度（12.5点満点）
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-blue-600">
                {facilityScore.toFixed(1)}点
              </span>
              <Badge variant="outline">
                {((facilityScore / 12.5) * 100).toFixed(0)}%
              </Badge>
            </div>
            
            <Slider
              value={[facilityScore]}
              onValueChange={(v) => onFacilityChange(v[0])}
              max={12.5}
              step={0.5}
              className="w-full"
            />

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
            法人貢献度（12.5点満点）
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-green-600">
                {corporateScore.toFixed(1)}点
              </span>
              <Badge variant="outline">
                {((corporateScore / 12.5) * 100).toFixed(0)}%
              </Badge>
            </div>
            
            <Slider
              value={[corporateScore]}
              onValueChange={(v) => onCorporateChange(v[0])}
              max={12.5}
              step={0.5}
              className="w-full"
            />

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
        <div className="flex items-center justify-between">
          <span className="font-medium">
            {season === 'summer' ? '夏季' : '冬季'}評価 合計
          </span>
          <span className="text-2xl font-bold">
            {(facilityScore + corporateScore).toFixed(1)} / 25点
          </span>
        </div>
        <Progress 
          value={((facilityScore + corporateScore) / 25) * 100} 
          className="mt-2"
        />
      </div>
    </div>
  );
}