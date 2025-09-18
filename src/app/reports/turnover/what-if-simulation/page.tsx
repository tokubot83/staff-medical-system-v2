'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Activity, TrendingDown, Users, Calculator } from 'lucide-react';
import { exportToPDF } from '@/utils/pdfExport';

function WhatIfSimulationContent() {
  const searchParams = useSearchParams();
  const facility = searchParams.get('facility') || '全施設';

  // シミュレーションパラメータの状態管琁E  const [overtimeReduction, setOvertimeReduction] = useState([30]);
  const [meetingFrequency, setMeetingFrequency] = useState([2]);
  const [stressReduction, setStressReduction] = useState([20]);
  const [salaryIncrease, setSalaryIncrease] = useState([5]);

  // 現在の離職玁E  const currentTurnoverRate = 15.8;
  
  // シミュレーション結果の計箁E  const calculateNewTurnoverRate = () => {
    let reduction = 0;
    reduction += overtimeReduction[0] * 0.08; // 残業削減�E効极E    reduction += meetingFrequency[0] * 1.5; // 面諁E��度の効极E    reduction += stressReduction[0] * 0.05; // ストレス削減�E効极E    reduction += salaryIncrease[0] * 0.3; // 給与増加の効极E    
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
            <h2 className="text-xl font-bold text-gray-800">施策実施時�E離職玁E��化シミュレーション</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                対象施設: {facility}
              </span>
              <button
                onClick={() => exportToPDF({
                  title: 'What-ifシミュレーションレポ�EチE,
                  facility: facility,
                  reportType: 'what-if-simulation',
                  elementId: 'report-content',
                  dateRange: new Date().toLocaleDateString('ja-JP')
                })}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm pdf-exclude"
              >
                PDFダウンローチE              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600">
              吁E��施策を実施した場合�E離職玁E�E変化をシミュレーションします。スライダーを動かして施策�E強度を調整してください、E            </p>
          </div>

          {/* 現在の状況と予測結果 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  現在の離職玁E                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">{currentTurnoverRate}%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  過去12ヶ月�E実績
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-700">
                  シミュレーション後�E離職玁E                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{newTurnoverRate}%</div>
                <p className="text-xs text-green-600 mt-1">
                  改喁E��込み: -{improvement}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  年間削減人数�E�推定！E                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{Math.round(523 * improvementValue / 100)}吁E/div>
                <p className="text-xs text-muted-foreground mt-1">
                  総�E員数523名�Eース
                </p>
              </CardContent>
            </Card>
          </div>

          {/* シミュレーションパラメータ */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">施策パラメータ設宁E/h3>

            {/* 残業時間削渁E*/}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  残業時間の削渁E                </CardTitle>
                <CardDescription>
                  月間平坁E��業時間を削減する割合を設宁E                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>削減率: {overtimeReduction[0]}%</span>
                    <span className="text-green-600">離職玁E-{(overtimeReduction[0] * 0.08).toFixed(1)}%</span>
                  </div>
                  <Slider
                    value={overtimeReduction}
                    onValueChange={setOvertimeReduction}
                    max={50}
                    step={5}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-600">
                    現在の平坁E5時間/朁EↁE{Math.round(45 * (100 - overtimeReduction[0]) / 100)}時間/朁E                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 面諁E��度増加 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  1on1面諁E�E頻度増加
                </CardTitle>
                <CardDescription>
                  月間の1on1面諁E��施回数を設宁E                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>月間実施回数: {meetingFrequency[0]}囁E/span>
                    <span className="text-green-600">離職玁E-{(meetingFrequency[0] * 1.5).toFixed(1)}%</span>
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
                    現在の平坁E.5囁E朁EↁE{meetingFrequency[0]}囁E朁E                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ストレス対筁E*/}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-orange-500" />
                  ストレス軽減施筁E                </CardTitle>
                <CardDescription>
                  ストレスチェチE��スコアの改喁E��標を設宁E                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>スコア改喁E��: {stressReduction[0]}%</span>
                    <span className="text-green-600">離職玁E-{(stressReduction[0] * 0.05).toFixed(1)}%</span>
                  </div>
                  <Slider
                    value={stressReduction}
                    onValueChange={setStressReduction}
                    max={40}
                    step={5}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-600">
                    平坁E��トレススコア65 ↁE{Math.round(65 * (100 - stressReduction[0]) / 100)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 給与改喁E*/}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-green-500" />
                  給与�E処遁E��喁E                </CardTitle>
                <CardDescription>
                  基本給また�E手当�E増加玁E��設宁E                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>給与増加玁E {salaryIncrease[0]}%</span>
                    <span className="text-green-600">離職玁E-{(salaryIncrease[0] * 0.3).toFixed(1)}%</span>
                  </div>
                  <Slider
                    value={salaryIncrease}
                    onValueChange={setSalaryIncrease}
                    max={15}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-600">
                    年間コスト墁E 約{Math.round(523 * 400000 * salaryIncrease[0] / 100 / 1000000)}百丁E�E
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* コスト効果�E极E*/}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>コスト効果�E极E/CardTitle>
              <CardDescription>
                施策実施による投賁E��効果�E試箁E              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">施策コスト（年間！E/h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>残業削減による人員補�E</span>
                      <span className="font-medium">{Math.round(overtimeReduction[0] * 0.5)}百丁E�E</span>
                    </div>
                    <div className="flex justify-between">
                      <span>面諁E��施の時間コスチE/span>
                      <span className="font-medium">{Math.round(meetingFrequency[0] * 10)}百丁E�E</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ストレス対策�Eログラム</span>
                      <span className="font-medium">{Math.round(stressReduction[0] * 0.3)}百丁E�E</span>
                    </div>
                    <div className="flex justify-between">
                      <span>給与�E処遁E��喁E/span>
                      <span className="font-medium">{Math.round(523 * 400000 * salaryIncrease[0] / 100 / 1000000)}百丁E�E</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-semibold">
                      <span>合計コスチE/span>
                      <span>{Math.round(overtimeReduction[0] * 0.5 + meetingFrequency[0] * 10 + stressReduction[0] * 0.3 + 523 * 400000 * salaryIncrease[0] / 100 / 1000000)}百丁E�E</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">期征E��れる効果（年間！E/h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>採用コスト削渁E/span>
                      <span className="font-medium text-green-600">{Math.round(523 * improvementValue / 100 * 1.5)}百丁E�E</span>
                    </div>
                    <div className="flex justify-between">
                      <span>教育コスト削渁E/span>
                      <span className="font-medium text-green-600">{Math.round(523 * improvementValue / 100 * 0.8)}百丁E�E</span>
                    </div>
                    <div className="flex justify-between">
                      <span>生産性向丁E/span>
                      <span className="font-medium text-green-600">{Math.round(improvementValue * 5)}百丁E�E</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-semibold">
                      <span>合計効极E/span>
                      <span className="text-green-600">{Math.round(523 * improvementValue / 100 * 1.5 + 523 * improvementValue / 100 * 0.8 + improvementValue * 5)}百丁E�E</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-semibold text-blue-900">
                      ROI: {Math.round((523 * improvementValue / 100 * 1.5 + 523 * improvementValue / 100 * 0.8 + improvementValue * 5) / (overtimeReduction[0] * 0.5 + meetingFrequency[0] * 10 + stressReduction[0] * 0.3 + 523 * 400000 * salaryIncrease[0] / 100 / 1000000) * 100)}%
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      投賁E冁E��たり{((523 * improvementValue / 100 * 1.5 + 523 * improvementValue / 100 * 0.8 + improvementValue * 5) / (overtimeReduction[0] * 0.5 + meetingFrequency[0] * 10 + stressReduction[0] * 0.3 + 523 * 400000 * salaryIncrease[0] / 100 / 1000000)).toFixed(2)}冁E�Eリターン
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* アクションボタン */}
          <div className="flex gap-4 mt-8">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              シミュレーション結果を保孁E            </button>
            <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition">
              詳細レポ�Eト生戁E            </button>
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition">
              施策実行計画を作�E
            </button>
          </div>
        </div>
      </div><CategoryTopButton categoryPath="/reports?tab=turnover" categoryName="離職要因刁E��" /></div>
  );
}

export default function WhatIfSimulationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">読み込み中...</div></div>}>
      <WhatIfSimulationContent />
    </Suspense>
  );
}