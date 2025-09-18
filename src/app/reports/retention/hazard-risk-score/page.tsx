'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, TrendingUp, Shield, Activity } from 'lucide-react';
import { exportToPDF } from '@/utils/pdfExport';

function HazardRiskScoreContent() {
  const searchParams = useSearchParams();
  const facility = searchParams.get('facility') || '全施設';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="ハザードリスクスコア刁E��" />
      
      <div id="report-content" className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">個別職員のハザードリスクスコア算�E</h2>
            <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              対象施設: {facility}
            </span>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600">
              Cox比例ハザードモチE��に基づぁE��、各職員の退職リスクをスコア化し、リスクレベル別に刁E��します、E            </p>
          </div>

          {/* リスク刁E��E��マリー */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-red-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  趁E��リスク�E�E0以上！E                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">23吁E/div>
                <p className="text-xs text-muted-foreground mt-1">
                  全体�E4.4%
                </p>
              </CardContent>
            </Card>

            <Card className="border-orange-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  高リスク�E�E0-79�E�E                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">67吁E/div>
                <p className="text-xs text-muted-foreground mt-1">
                  全体�E12.8%
                </p>
              </CardContent>
            </Card>

            <Card className="border-yellow-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  中リスク�E�E0-59�E�E                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">156吁E/div>
                <p className="text-xs text-muted-foreground mt-1">
                  全体�E29.8%
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  低リスク�E�E0未満�E�E                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">277吁E/div>
                <p className="text-xs text-muted-foreground mt-1">
                  全体�E53.0%
                </p>
              </CardContent>
            </Card>
          </div>

          {/* リスクスコア計算方況E*/}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>リスクスコア算�E方況E/CardTitle>
              <CardDescription>
                Cox比例ハザードモチE��による多変量解极E              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium mb-2">基本計算弁E/h5>
                  <p className="text-sm font-mono bg-white p-2 rounded border">
                    リスクスコア = exp(β1×X1 + β2×X2 + ... + βn×Xn) ÁE100
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    β: 回帰係数、X: 吁E��因の値�E�標準化済み�E�E                  </p>
                </div>

                <div>
                  <h5 className="font-medium mb-2">主要な予測因子と重み</h5>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>趁E��勤務時間（月60時間以上！E/span>
                      <span className="font-medium">β = 1.17</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>上司との関係性�E�低評価�E�E/span>
                      <span className="font-medium">β = 1.05</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>給与満足度�E�不満�E�E/span>
                      <span className="font-medium">β = 0.76</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>キャリア開発機会（なし！E/span>
                      <span className="font-medium">β = 0.65</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>年齢�E�E5歳未満�E�E/span>
                      <span className="font-medium">β = 0.52</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 部署別リスク刁E�� */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>部署別ハザードリスク刁E��</CardTitle>
              <CardDescription>
                吁E��署の平坁E��スクスコアと高リスク老E�E割吁E              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <div>
                      <div className="font-medium">救急部</div>
                      <div className="text-sm text-muted-foreground">
                        平坁E��コア: 68.5 / 高リスク老E 8吁E                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={68.5} className="w-24 h-2" />
                    <Badge variant="destructive">要注愁E/Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-orange-500" />
                    <div>
                      <div className="font-medium">冁E��病棁E/div>
                      <div className="text-sm text-muted-foreground">
                        平坁E��コア: 52.3 / 高リスク老E 12吁E                      </div>
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
                        平坁E��コア: 32.1 / 高リスク老E 2吁E                      </div>
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
              <CardTitle>趁E��リスク職員�E�スコア80以上）�E詳細</CardTitle>
              <CardDescription>
                早急な対応が忁E��な職員リスチE              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-red-50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">田中 一郁E/h4>
                      <p className="text-sm text-gray-600">救急部 / 看護師 / 勤綁E年2ヶ朁E/p>
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
                      <p className="font-medium text-red-600">3ヶ月以冁E 78%</p>
                      <p className="text-xs text-gray-500 mt-1">6ヶ月以冁E 92%</p>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">鈴木 花孁E/h4>
                      <p className="text-sm text-gray-600">冁E��病棁E/ 看護師 / 勤綁Eヶ朁E/p>
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
                        <li>キャリア開発: 機会なぁE/li>
                        <li>夜勤回数: 14囁E朁E/li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-gray-600">予測退職時期</p>
                      <p className="font-medium text-orange-600">3ヶ月以冁E 65%</p>
                      <p className="text-xs text-gray-500 mt-1">6ヶ月以冁E 88%</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* リスクトレンチE*/}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>リスクスコアの推移</CardTitle>
              <CardDescription>
                過去6ヶ月間の全体的なリスクトレンチE              </CardDescription>
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
                  <strong>警告！E/strong>全体的なリスクスコアが上�E傾向にあります、E                  特に若手�E員層でのリスク増加が顕著です、E                </p>
              </div>
            </CardContent>
          </Card>

          {/* アクションボタン */}
          <div className="flex gap-4">
            <button 
              onClick={() => exportToPDF({
                title: 'ハザードリスクスコア刁E��レポ�EチE,
                facility: facility,
                reportType: 'hazard-risk-score',
                elementId: 'report-content',
                dateRange: new Date().toLocaleDateString('ja-JP')
              })}
              className="pdf-exclude bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              PDFダウンローチE            </button>
            <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition">
              高リスク老E��覧出劁E            </button>
            <button className="pdf-exclude bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition">
              刁E��チE�Eタエクスポ�EチE            </button>
          </div>
        </div>
      </div><CategoryTopButton categoryPath="/reports?tab=retention" categoryName="定着刁E��" /></div>
  );
}

export default function HazardRiskScorePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">読み込み中...</div></div>}>
      <HazardRiskScoreContent />
    </Suspense>
  );
}