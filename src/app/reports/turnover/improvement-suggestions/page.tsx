'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Lightbulb, Target, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { exportToPDF } from '@/utils/pdfExport';

function ImprovementSuggestionsContent() {
  const searchParams = useSearchParams();
  const facility = searchParams.get('facility') || '全施設';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="改喁E��桁E />
      
      <div id="report-content" className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">AIによる離職防止施策�E提桁E/h2>
            <div className="flex items-center gap-2">
              <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                対象施設: {facility}
              </span>
              <button
                onClick={() => exportToPDF({
                  title: '改喁E��案レポ�EチE,
                  facility: facility,
                  reportType: 'improvement-suggestions',
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
              チE�Eタ刁E��に基づぁE��、最も効果的な離職防止施策を優先度頁E��提案します。各施策�E期征E��果と実施難易度を老E�Eした実践皁E��改喁E��です、E            </p>
          </div>

          {/* 重要指標サマリー */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  提案施策数
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12件</div>
                <p className="text-xs text-muted-foreground mt-1">
                  優先度頁E��表示
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  期征E��減率
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">-8.5%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  全施策実施晁E                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  即効性施筁E                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4件</div>
                <p className="text-xs text-muted-foreground mt-1">
                  3ヶ月以冁E��効极E                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  実施中施筁E                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2件</div>
                <p className="text-xs text-muted-foreground mt-1">
                  効果測定中
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 優先度1: 最重要施筁E*/}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Target className="h-5 w-5 text-red-500" />
              優先度1: 最重要施筁E            </h3>

            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      定期皁E��1on1面諁E�E制度匁E                      <Badge variant="destructive">最優允E/Badge>
                    </CardTitle>
                    <CardDescription>
                      全職員に対して朁E回以上�E上司との1on1面諁E��忁E��化
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-600">-3.2%</div>
                    <p className="text-xs text-gray-500">離職玁E��減効极E/p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">対象老E/p>
                    <p className="font-medium">全職員�E�E23名！E/p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">実施難易度</p>
                    <div className="flex items-center gap-2">
                      <Progress value={30} className="w-20 h-2" />
                      <span className="text-sm">佁E/span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">効果発現時期</p>
                    <p className="font-medium">1ヶ月後、E/p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <h5 className="font-medium mb-2">具体的な実施方況E/h5>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    <li>毎月第1週に30刁E�E1on1面諁E��設宁E/li>
                    <li>面諁E��録シスチE��の導�E�E�進捗�E課題�Eキャリア希望�E�E/li>
                    <li>管琁E�E向け面諁E��キル研修の実施�E�月1回！E/li>
                    <li>面諁E��施玁E��部門評価に絁E��込み</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h5 className="font-medium mb-2">期征E��れる効极E/h5>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>早期�E問題発要E/span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>忁E��皁E���E性の向丁E/span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>キャリア支援</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      残業時間管琁E�E強匁E                      <Badge className="bg-orange-500">重要E/Badge>
                    </CardTitle>
                    <CardDescription>
                      朁E5時間を上限とした残業管琁E��スチE��の導�E
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-600">-2.1%</div>
                    <p className="text-xs text-gray-500">離職玁E��減効极E/p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">対象老E/p>
                    <p className="font-medium">156名（月45時間趁E��E/p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">実施難易度</p>
                    <div className="flex items-center gap-2">
                      <Progress value={60} className="w-20 h-2" />
                      <span className="text-sm">中</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">効果発現時期</p>
                    <p className="font-medium">3ヶ月後、E/p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <h5 className="font-medium mb-2">具体的な実施方況E/h5>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    <li>勤怠管琁E��スチE��での自動アラート機�E</li>
                    <li>朁E5時間到達時点での上司面諁E��E��化</li>
                    <li>業務効玁E��プロジェクトチームの設置</li>
                    <li>人員配置の最適化！EIシフト管琁E���E�E�E/li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 優先度2: 重要施筁E*/}
          <div className="space-y-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-yellow-500" />
              優先度2: 重要施筁E            </h3>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      メンタルヘルスケアプログラムの拡允E                    </CardTitle>
                    <CardDescription>
                      ストレス管琁E��修と個別カウンセリングの提侁E                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">-1.5%</div>
                    <p className="text-xs text-gray-500">離職玁E��減効极E/p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-sm">
                    <p className="text-gray-600 mb-1">実施冁E��</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>朁E回�Eストレス管琁E��修</li>
                      <li>外部カウンセラーによる相諁E��口</li>
                      <li>マインドフルネスプログラム導�E</li>
                    </ul>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-600 mb-1">KPI</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>ストレススコア20%改喁E/li>
                      <li>相諁E��用玁E0%以丁E/li>
                      <li>満足度スコア4.0以丁E/li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      キャリア開発支援制度の構篁E                    </CardTitle>
                    <CardDescription>
                      個別キャリアプランの策定と研修機会�E拡允E                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">-1.2%</div>
                    <p className="text-xs text-gray-500">離職玁E��減効极E/p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-sm">
                    <p className="text-gray-600 mb-1">実施冁E��</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>年2回�Eキャリア面諁E/li>
                      <li>賁E��取得支援制度�E�費用補助�E�E/li>
                      <li>院冁E��学・部署交流制度</li>
                    </ul>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-600 mb-1">対象老E��先頁E��E/p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>勤綁E-3年の職員</li>
                      <li>エンゲージメント低下層</li>
                      <li>若手リーダー候裁E/li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 実施スケジュール */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>実施スケジュール桁E/CardTitle>
              <CardDescription>
                効果的な導�Eのための段階的実施計画
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                    <span className="font-bold text-blue-600">1M</span>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium">第1朁E/h5>
                    <p className="text-sm text-gray-600">1on1面諁E��度の導�E準備・管琁E�E研修</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                    <span className="font-bold text-blue-600">2M</span>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium">第2朁E/h5>
                    <p className="text-sm text-gray-600">1on1面諁E��始�E残業管琁E��スチE��導�E</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                    <span className="font-bold text-blue-600">3M</span>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium">第3朁E/h5>
                    <p className="text-sm text-gray-600">メンタルヘルスプログラム開始�E効果測宁E/p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* アクションボタン */}
          <div className="flex gap-4 mt-8">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              実施計画書を作�E
            </button>
            <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition">
              詳細刁E��レポ�EチE            </button>
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
              経営会議用賁E��作�E
            </button>
          </div>
        </div>
      </div><CategoryTopButton categoryPath="/reports?tab=turnover" categoryName="離職要因刁E��" /></div>
  );
}

export default function ImprovementSuggestionsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">読み込み中...</div></div>}>
      <ImprovementSuggestionsContent />
    </Suspense>
  );
}