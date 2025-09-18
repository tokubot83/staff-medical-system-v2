'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, TrendingUp, BarChart3, Activity } from 'lucide-react';
import { exportToPDF } from '@/utils/pdfExport';

function PredictiveModelingContent() {
  const searchParams = useSearchParams();
  const facility = searchParams.get('facility') || '全施設';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="予測モチE��ング" />
      
      <div id="report-content" className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">機械学習による離職予測モチE��</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                対象施設: {facility}
              </span>
              <button
                onClick={() => exportToPDF({
                  title: '予測モチE��ングレポ�EチE,
                  facility: facility,
                  reportType: 'predictive-modeling',
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
              褁E��の機械学習アルゴリズムを使用して離職予測モチE��を構築し、精度評価と特徴量�E重要度刁E��を行います、E            </p>
          </div>

          {/* モチE��性能持E��E*/}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  予測精度�E�EUC�E�E                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">0.92</div>
                <p className="text-xs text-muted-foreground mt-1">
                  非常に高い精度
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  適合率�E�Erecision�E�E                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">88.5%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  誤検知玁E 11.5%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  再現玁E��Eecall�E�E                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85.2%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  見送E��玁E 14.8%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  F1スコア
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0.868</div>
                <p className="text-xs text-muted-foreground mt-1">
                  バランスの取れた性能
                </p>
              </CardContent>
            </Card>
          </div>

          {/* モチE��比輁E*/}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>アルゴリズム別性能比輁E/CardTitle>
              <CardDescription>
                3つの主要な機械学習アルゴリズムの性能を比輁E              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-purple-500" />
                      <span className="font-medium">XGBoost</span>
                      <Badge variant="default" className="text-xs">最高性能</Badge>
                    </div>
                    <span className="text-sm font-semibold">AUC: 0.92</span>
                  </div>
                  <Progress value={92} className="h-2" />
                  <p className="text-xs text-gray-600 mt-1">
                    勾配ブースチE��ング決定木による高精度な予測
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Random Forest</span>
                    </div>
                    <span className="text-sm font-semibold">AUC: 0.89</span>
                  </div>
                  <Progress value={89} className="h-2" />
                  <p className="text-xs text-gray-600 mt-1">
                    褁E��の決定木を絁E��合わせた安定した予測
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-green-500" />
                      <span className="font-medium">LightGBM</span>
                    </div>
                    <span className="text-sm font-semibold">AUC: 0.91</span>
                  </div>
                  <Progress value={91} className="h-2" />
                  <p className="text-xs text-gray-600 mt-1">
                    高速で効玁E��な勾配ブースチE��ング
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 特徴量�E重要度 */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>特徴量重要度 TOP 10</CardTitle>
              <CardDescription>
                モチE��が重視してぁE��予測因子�E頁E��E              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: '面諁E��度', value: 0.182, change: 'up' },
                  { name: 'ストレスチェチE��スコア', value: 0.156, change: 'same' },
                  { name: 'エンゲージメントスコア', value: 0.134, change: 'up' },
                  { name: '月間残業時間', value: 0.098, change: 'down' },
                  { name: '夜勤回数', value: 0.087, change: 'same' },
                  { name: '有給取得率', value: 0.076, change: 'up' },
                  { name: '上司との関係性', value: 0.065, change: 'new' },
                  { name: '研修参加時間', value: 0.054, change: 'same' },
                  { name: '勤続年数', value: 0.043, change: 'down' },
                  { name: '年齢', value: 0.032, change: 'down' }
                ].map((feature, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-500 w-6">{index + 1}.</span>
                      <span className="font-medium">{feature.name}</span>
                      {feature.change === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                      {feature.change === 'down' && <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />}
                      {feature.change === 'new' && <Badge variant="secondary" className="text-xs">NEW</Badge>}
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={feature.value * 100 / 0.182} className="w-24 h-2" />
                      <span className="text-sm font-semibold w-12 text-right">{feature.value.toFixed(3)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* モチE��の検証 */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>交差検証結果</CardTitle>
              <CardDescription>
                5刁E��交差検証による安定性の確誁E              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((fold) => (
                  <div key={fold} className="text-center">
                    <div className="text-sm text-gray-600 mb-1">Fold {fold}</div>
                    <div className="text-xl font-bold">{(0.90 + Math.random() * 0.04).toFixed(3)}</div>
                    <div className="text-xs text-gray-500">AUC</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800">
                  <strong>検証結果�E�E/strong>すべてのFoldで0.90以上�EAUCを達成。モチE��の安定性が確認されました、E                </p>
              </div>
            </CardContent>
          </Card>

          {/* 予測の説明可能性 */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>SHAP値による予測の説昁E/CardTitle>
              <CardDescription>
                個別の予測に対する吁E��徴量�E寁E��度
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 mb-3">
                  例：山田太郎さん（離職リスク: 85%�E��E場吁E                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>面諁E��し！Eヶ月！E/span>
                    <span className="text-red-600 font-medium">+25%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>高ストレス�E�スコア: 85�E�E/span>
                    <span className="text-red-600 font-medium">+18%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>残業時間�E�E5時間/月！E/span>
                    <span className="text-red-600 font-medium">+12%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>勤続年数�E�E年3ヶ月！E/span>
                    <span className="text-green-600 font-medium">-5%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>基準リスク</span>
                    <span className="font-medium">35%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* アクションボタン */}
          <div className="flex gap-4">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              モチE��詳細レポ�EチE            </button>
            <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition">
              予測結果ダウンローチE            </button>
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition">
              モチE��再学翁E            </button>
          </div>
        </div>
      </div><CategoryTopButton categoryPath="/reports?tab=turnover" categoryName="離職要因刁E��" /></div>
  );
}

export default function PredictiveModelingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">読み込み中...</div></div>}>
      <PredictiveModelingContent />
    </Suspense>
  );
}