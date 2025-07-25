'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import DashboardButton from '@/components/DashboardButton';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import BackToReportsButton from '@/components/BackToReportsButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, TrendingUp, Shield, Activity } from 'lucide-react';

function HazardRiskScoreContent() {
  const searchParams = useSearchParams();
  const facility = searchParams.get('facility') || '全施設';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader 
        title="ハザードリスクスコア分析" 
        showBackButton={false}
        backUrl="/reports"
        backText="レポートセンターに戻る"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">個別職員のハザードリスクスコア算出</h2>
            <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              対象施設: {facility}
            </span>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600">
              Cox比例ハザードモデルに基づいて、各職員の退職リスクをスコア化し、リスクレベル別に分類します。
            </p>
          </div>

          {/* リスク分布サマリー */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-red-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  超高リスク（80以上）
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">23名</div>
                <p className="text-xs text-muted-foreground mt-1">
                  全体の4.4%
                </p>
              </CardContent>
            </Card>

            <Card className="border-orange-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  高リスク（60-79）
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">67名</div>
                <p className="text-xs text-muted-foreground mt-1">
                  全体の12.8%
                </p>
              </CardContent>
            </Card>

            <Card className="border-yellow-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  中リスク（40-59）
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">156名</div>
                <p className="text-xs text-muted-foreground mt-1">
                  全体の29.8%
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  低リスク（40未満）
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">277名</div>
                <p className="text-xs text-muted-foreground mt-1">
                  全体の53.0%
                </p>
              </CardContent>
            </Card>
          </div>

          {/* リスクスコア計算方法 */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>リスクスコア算出方法</CardTitle>
              <CardDescription>
                Cox比例ハザードモデルによる多変量解析
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium mb-2">基本計算式</h5>
                  <p className="text-sm font-mono bg-white p-2 rounded border">
                    リスクスコア = exp(β1×X1 + β2×X2 + ... + βn×Xn) × 100
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    β: 回帰係数、X: 各要因の値（標準化済み）
                  </p>
                </div>

                <div>
                  <h5 className="font-medium mb-2">主要な予測因子と重み</h5>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>超過勤務時間（月60時間以上）</span>
                      <span className="font-medium">β = 1.17</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>上司との関係性（低評価）</span>
                      <span className="font-medium">β = 1.05</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>給与満足度（不満）</span>
                      <span className="font-medium">β = 0.76</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>キャリア開発機会（なし）</span>
                      <span className="font-medium">β = 0.65</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>年齢（25歳未満）</span>
                      <span className="font-medium">β = 0.52</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 部署別リスク分析 */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>部署別ハザードリスク分析</CardTitle>
              <CardDescription>
                各部署の平均リスクスコアと高リスク者の割合
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <div>
                      <div className="font-medium">救急部</div>
                      <div className="text-sm text-muted-foreground">
                        平均スコア: 68.5 / 高リスク者: 8名
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={68.5} className="w-24 h-2" />
                    <Badge variant="destructive">要注意</Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-orange-500" />
                    <div>
                      <div className="font-medium">内科病棟</div>
                      <div className="text-sm text-muted-foreground">
                        平均スコア: 52.3 / 高リスク者: 12名
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={52.3} className="w-24 h-2" />
                    <Badge className="bg-orange-500">中リスク</Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-medium">検査部</div>
                      <div className="text-sm text-muted-foreground">
                        平均スコア: 32.1 / 高リスク者: 2名
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={32.1} className="w-24 h-2" />
                    <Badge className="bg-green-500">低リスク</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 高リスク職員の詳細 */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>超高リスク職員（スコア80以上）の詳細</CardTitle>
              <CardDescription>
                早急な対応が必要な職員リスト
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-red-50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">田中 一郎</h4>
                      <p className="text-sm text-gray-600">救急部 / 看護師 / 勤続1年2ヶ月</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-600">92.3</div>
                      <p className="text-xs text-gray-500">リスクスコア</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">リスク要因</p>
                      <ul className="list-disc list-inside text-gray-700 mt-1">
                        <li>月間残業: 72時間</li>
                        <li>上司評価: 2.1/5.0</li>
                        <li>給与満足度: 不満</li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-gray-600">予測退職時期</p>
                      <p className="font-medium text-red-600">3ヶ月以内: 78%</p>
                      <p className="text-xs text-gray-500 mt-1">6ヶ月以内: 92%</p>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">鈴木 花子</h4>
                      <p className="text-sm text-gray-600">内科病棟 / 看護師 / 勤続8ヶ月</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-600">85.7</div>
                      <p className="text-xs text-gray-500">リスクスコア</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">リスク要因</p>
                      <ul className="list-disc list-inside text-gray-700 mt-1">
                        <li>年齢: 23歳</li>
                        <li>キャリア開発: 機会なし</li>
                        <li>夜勤回数: 14回/月</li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-gray-600">予測退職時期</p>
                      <p className="font-medium text-orange-600">3ヶ月以内: 65%</p>
                      <p className="text-xs text-gray-500 mt-1">6ヶ月以内: 88%</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* リスクトレンド */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>リスクスコアの推移</CardTitle>
              <CardDescription>
                過去6ヶ月間の全体的なリスクトレンド
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">6ヶ月前</span>
                  <div className="flex items-center gap-2">
                    <Progress value={42} className="w-32 h-2" />
                    <span className="text-sm font-medium w-12 text-right">42.1</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">3ヶ月前</span>
                  <div className="flex items-center gap-2">
                    <Progress value={48} className="w-32 h-2" />
                    <span className="text-sm font-medium w-12 text-right">48.3</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">現在</span>
                  <div className="flex items-center gap-2">
                    <Progress value={51} className="w-32 h-2" />
                    <span className="text-sm font-bold w-12 text-right">51.2</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>警告：</strong>全体的なリスクスコアが上昇傾向にあります。
                  特に若手職員層でのリスク増加が顕著です。
                </p>
              </div>
            </CardContent>
          </Card>

          {/* アクションボタン */}
          <div className="flex gap-4">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              個別リスクレポート
            </button>
            <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition">
              高リスク者一覧出力
            </button>
            <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition">
              分析データエクスポート
            </button>
          </div>
        </div>
      </div>
            <ScrollToTopButton />
      <BackToReportsButton />
      <DashboardButton />
    </div>
  );
}

export default function HazardRiskScorePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">読み込み中...</div></div>}>
      <HazardRiskScoreContent />
    </Suspense>
  );
}