'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import DashboardButton from '@/components/DashboardButton';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import { BackToReportsButton } from '@/components/BackToReportsButton';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Activity, TrendingDown, Users, Calculator } from 'lucide-react';
import { exportToPDF } from '@/utils/pdfExport';

function WhatIfSimulationContent() {
  const searchParams = useSearchParams();
  const facility = searchParams.get('facility') || '全施設';

  // シミュレーションパラメータの状態管理
  const [overtimeReduction, setOvertimeReduction] = useState([30]);
  const [meetingFrequency, setMeetingFrequency] = useState([2]);
  const [stressReduction, setStressReduction] = useState([20]);
  const [salaryIncrease, setSalaryIncrease] = useState([5]);

  // 現在の離職率
  const currentTurnoverRate = 15.8;
  
  // シミュレーション結果の計算
  const calculateNewTurnoverRate = () => {
    let reduction = 0;
    reduction += overtimeReduction[0] * 0.08; // 残業削減の効果
    reduction += meetingFrequency[0] * 1.5; // 面談頻度の効果
    reduction += stressReduction[0] * 0.05; // ストレス削減の効果
    reduction += salaryIncrease[0] * 0.3; // 給与増加の効果
    
    return Math.max(5, currentTurnoverRate - reduction).toFixed(1);
  };

  const newTurnoverRate = calculateNewTurnoverRate();
  const improvementValue = currentTurnoverRate - parseFloat(newTurnoverRate);
  const improvement = improvementValue.toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="What-ifシミュレーション" />
      
      <div id="report-content" className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">施策実施時の離職率変化シミュレーション</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                対象施設: {facility}
              </span>
              <button
                onClick={() => exportToPDF({
                  title: 'What-ifシミュレーションレポート',
                  facility: facility,
                  reportType: 'what-if-simulation',
                  elementId: 'report-content',
                  dateRange: new Date().toLocaleDateString('ja-JP')
                })}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
              >
                PDFダウンロード
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600">
              各種施策を実施した場合の離職率の変化をシミュレーションします。スライダーを動かして施策の強度を調整してください。
            </p>
          </div>

          {/* 現在の状況と予測結果 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  現在の離職率
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">{currentTurnoverRate}%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  過去12ヶ月の実績
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-700">
                  シミュレーション後の離職率
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{newTurnoverRate}%</div>
                <p className="text-xs text-green-600 mt-1">
                  改善見込み: -{improvement}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  年間削減人数（推定）
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{Math.round(523 * improvementValue / 100)}名</div>
                <p className="text-xs text-muted-foreground mt-1">
                  総職員数523名ベース
                </p>
              </CardContent>
            </Card>
          </div>

          {/* シミュレーションパラメータ */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">施策パラメータ設定</h3>

            {/* 残業時間削減 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  残業時間の削減
                </CardTitle>
                <CardDescription>
                  月間平均残業時間を削減する割合を設定
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>削減率: {overtimeReduction[0]}%</span>
                    <span className="text-green-600">離職率 -{(overtimeReduction[0] * 0.08).toFixed(1)}%</span>
                  </div>
                  <Slider
                    value={overtimeReduction}
                    onValueChange={setOvertimeReduction}
                    max={50}
                    step={5}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-600">
                    現在の平均45時間/月 → {Math.round(45 * (100 - overtimeReduction[0]) / 100)}時間/月
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 面談頻度増加 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  1on1面談の頻度増加
                </CardTitle>
                <CardDescription>
                  月間の1on1面談実施回数を設定
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>月間実施回数: {meetingFrequency[0]}回</span>
                    <span className="text-green-600">離職率 -{(meetingFrequency[0] * 1.5).toFixed(1)}%</span>
                  </div>
                  <Slider
                    value={meetingFrequency}
                    onValueChange={setMeetingFrequency}
                    min={0}
                    max={4}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-600">
                    現在の平均0.5回/月 → {meetingFrequency[0]}回/月
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ストレス対策 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-orange-500" />
                  ストレス軽減施策
                </CardTitle>
                <CardDescription>
                  ストレスチェックスコアの改善目標を設定
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>スコア改善率: {stressReduction[0]}%</span>
                    <span className="text-green-600">離職率 -{(stressReduction[0] * 0.05).toFixed(1)}%</span>
                  </div>
                  <Slider
                    value={stressReduction}
                    onValueChange={setStressReduction}
                    max={40}
                    step={5}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-600">
                    平均ストレススコア65 → {Math.round(65 * (100 - stressReduction[0]) / 100)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 給与改善 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-green-500" />
                  給与・処遇改善
                </CardTitle>
                <CardDescription>
                  基本給または手当の増加率を設定
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>給与増加率: {salaryIncrease[0]}%</span>
                    <span className="text-green-600">離職率 -{(salaryIncrease[0] * 0.3).toFixed(1)}%</span>
                  </div>
                  <Slider
                    value={salaryIncrease}
                    onValueChange={setSalaryIncrease}
                    max={15}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-600">
                    年間コスト増: 約{Math.round(523 * 400000 * salaryIncrease[0] / 100 / 1000000)}百万円
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* コスト効果分析 */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>コスト効果分析</CardTitle>
              <CardDescription>
                施策実施による投資対効果の試算
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">施策コスト（年間）</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>残業削減による人員補充</span>
                      <span className="font-medium">{Math.round(overtimeReduction[0] * 0.5)}百万円</span>
                    </div>
                    <div className="flex justify-between">
                      <span>面談実施の時間コスト</span>
                      <span className="font-medium">{Math.round(meetingFrequency[0] * 10)}百万円</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ストレス対策プログラム</span>
                      <span className="font-medium">{Math.round(stressReduction[0] * 0.3)}百万円</span>
                    </div>
                    <div className="flex justify-between">
                      <span>給与・処遇改善</span>
                      <span className="font-medium">{Math.round(523 * 400000 * salaryIncrease[0] / 100 / 1000000)}百万円</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-semibold">
                      <span>合計コスト</span>
                      <span>{Math.round(overtimeReduction[0] * 0.5 + meetingFrequency[0] * 10 + stressReduction[0] * 0.3 + 523 * 400000 * salaryIncrease[0] / 100 / 1000000)}百万円</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">期待される効果（年間）</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>採用コスト削減</span>
                      <span className="font-medium text-green-600">{Math.round(523 * improvementValue / 100 * 1.5)}百万円</span>
                    </div>
                    <div className="flex justify-between">
                      <span>教育コスト削減</span>
                      <span className="font-medium text-green-600">{Math.round(523 * improvementValue / 100 * 0.8)}百万円</span>
                    </div>
                    <div className="flex justify-between">
                      <span>生産性向上</span>
                      <span className="font-medium text-green-600">{Math.round(improvementValue * 5)}百万円</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-semibold">
                      <span>合計効果</span>
                      <span className="text-green-600">{Math.round(523 * improvementValue / 100 * 1.5 + 523 * improvementValue / 100 * 0.8 + improvementValue * 5)}百万円</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-semibold text-blue-900">
                      ROI: {Math.round((523 * improvementValue / 100 * 1.5 + 523 * improvementValue / 100 * 0.8 + improvementValue * 5) / (overtimeReduction[0] * 0.5 + meetingFrequency[0] * 10 + stressReduction[0] * 0.3 + 523 * 400000 * salaryIncrease[0] / 100 / 1000000) * 100)}%
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      投資1円あたり{((523 * improvementValue / 100 * 1.5 + 523 * improvementValue / 100 * 0.8 + improvementValue * 5) / (overtimeReduction[0] * 0.5 + meetingFrequency[0] * 10 + stressReduction[0] * 0.3 + 523 * 400000 * salaryIncrease[0] / 100 / 1000000)).toFixed(2)}円のリターン
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* アクションボタン */}
          <div className="flex gap-4 mt-8">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              シミュレーション結果を保存
            </button>
            <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition">
              詳細レポート生成
            </button>
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition">
              施策実行計画を作成
            </button>
          </div>
        </div>
      </div>
      <ScrollToTopButton />
      <CategoryTopButton categoryPath="/reports?tab=turnover" categoryName="離職要因分析" />
      <BackToReportsButton />
      <DashboardButton />
    </div>
  );
}

export default function WhatIfSimulationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">読み込み中...</div></div>}>
      <WhatIfSimulationContent />
    </Suspense>
  );
}