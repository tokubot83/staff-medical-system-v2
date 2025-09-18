'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, TrendingUp, Clock, Users } from 'lucide-react';
import { exportToPDF } from '@/utils/pdfExport';

function HighRiskDashboardContent() {
  const searchParams = useSearchParams();
  const facility = searchParams.get('facility') || '全施設';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="高リスク職員ダチE��ュボ�EチE />
      
      <div id="report-content" className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">離職リスクが高い職員の一覧と対応状況E/h2>
            <div className="flex items-center gap-2">
              <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                対象施設: {facility}
              </span>
              <button
                onClick={() => exportToPDF({
                  title: '高リスク職員ダチE��ュボ�EチE,
                  facility: facility,
                  reportType: 'high-risk-dashboard',
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
              AIモチE��により離職リスクぁE0%以上と判定された職員の詳細惁E��と、実施済み・予定�E対応策を管琁E��ます、E            </p>
          </div>

          {/* サマリーカーチE*/}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  高リスク職員数
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">42吁E/div>
                <p className="text-xs text-muted-foreground mt-1">
                  前月毁E+3吁E                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  対応実施玁E                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">73.8%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  31/42名に対応済み
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  平坁E��スクスコア
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">82.5%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  前月毁E+2.3%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  今週の面諁E��宁E                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8件</div>
                <p className="text-xs text-muted-foreground mt-1">
                  未設宁E 11吁E                </p>
              </CardContent>
            </Card>
          </div>

          {/* 高リスク職員リスチE*/}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">高リスク職員一覧�E�リスクスコア頁E��E/h3>
            
            {/* 職員カード侁E*/}
            <div className="border rounded-lg p-4 bg-red-50 border-red-200">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">山田 太郁E/h4>
                    <Badge variant="destructive">緊急対忁E/Badge>
                  </div>
                  <p className="text-sm text-gray-600">冁E��病棁E/ 看護師 / 勤綁E年3ヶ朁E/p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-600">95%</div>
                  <p className="text-xs text-gray-500">離職リスク</p>
                </div>
              </div>
              
              <Progress value={95} className="h-2 mb-3" />
              
              <div className="grid gap-2 md:grid-cols-2 mb-3">
                <div className="text-sm">
                  <span className="text-gray-600">主要リスク要因�E�E/span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <Badge variant="outline" className="text-xs">面諁E��し！Eヶ月！E/Badge>
                    <Badge variant="outline" className="text-xs">残業60時間趁E/Badge>
                    <Badge variant="outline" className="text-xs">ストレス持E��85</Badge>
                  </div>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">最終面諁E��E/span>
                  <span className="ml-1 font-medium">2024年4朁E5日</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span>次回面諁E 未設宁E/span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span>拁E��E 看護部長</span>
                  </div>
                </div>
                <button className="bg-red-600 text-white px-4 py-1 rounded text-sm hover:bg-red-700 transition">
                  面諁E��宁E                </button>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">佐藤 花孁E/h4>
                    <Badge variant="secondary">対応中</Badge>
                  </div>
                  <p className="text-sm text-gray-600">外科病棁E/ 看護師 / 勤綁E年6ヶ朁E/p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-600">88%</div>
                  <p className="text-xs text-gray-500">離職リスク</p>
                </div>
              </div>
              
              <Progress value={88} className="h-2 mb-3" />
              
              <div className="grid gap-2 md:grid-cols-2 mb-3">
                <div className="text-sm">
                  <span className="text-gray-600">主要リスク要因�E�E/span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <Badge variant="outline" className="text-xs">エンゲージメント低丁E/Badge>
                    <Badge variant="outline" className="text-xs">夜勤12囁E朁E/Badge>
                    <Badge variant="outline" className="text-xs">有給取得率20%</Badge>
                  </div>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">最終面諁E��E/span>
                  <span className="ml-1 font-medium">2024年7朁E0日</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-green-500" />
                    <span>次回面諁E 7朁E8日</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span>拁E��E 主任看護師</span>
                  </div>
                </div>
                <button className="bg-gray-600 text-white px-4 py-1 rounded text-sm hover:bg-gray-700 transition">
                  対応履歴
                </button>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">鈴木 一郁E/h4>
                    <Badge variant="secondary">対応中</Badge>
                  </div>
                  <p className="text-sm text-gray-600">リハビリチE�Eション私E/ 琁E��療法士 / 勤綁Eヶ朁E/p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-600">85%</div>
                  <p className="text-xs text-gray-500">離職リスク</p>
                </div>
              </div>
              
              <Progress value={85} className="h-2 mb-3" />
              
              <div className="grid gap-2 md:grid-cols-2 mb-3">
                <div className="text-sm">
                  <span className="text-gray-600">主要リスク要因�E�E/span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <Badge variant="outline" className="text-xs">新入職員�E�E年未満�E�E/Badge>
                    <Badge variant="outline" className="text-xs">研修機会不足</Badge>
                    <Badge variant="outline" className="text-xs">キャリア不宁E/Badge>
                  </div>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">最終面諁E��E/span>
                  <span className="ml-1 font-medium">2024年7朁E日</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-green-500" />
                    <span>次回面諁E 7朁E6日</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span>拁E��E リハビリ部長</span>
                  </div>
                </div>
                <button className="bg-gray-600 text-white px-4 py-1 rounded text-sm hover:bg-gray-700 transition">
                  対応履歴
                </button>
              </div>
            </div>
          </div>

          {/* フィルターと並び替ぁE*/}
          <div className="flex gap-4 mt-6">
            <select className="border rounded px-3 py-2 text-sm">
              <option>全部署</option>
              <option>冁E��病棁E/option>
              <option>外科病棁E/option>
              <option>ICU</option>
              <option>救急部</option>
            </select>
            <select className="border rounded px-3 py-2 text-sm">
              <option>リスクスコア頁E/option>
              <option>対応状況E��E/option>
              <option>部署頁E/option>
              <option>勤続年数頁E/option>
            </select>
            <button className="bg-blue-600 text-white px-6 py-2 rounded text-sm hover:bg-blue-700 transition ml-auto">
              CSVエクスポ�EチE            </button>
          </div>
        </div>
      </div><CategoryTopButton categoryPath="/reports?tab=turnover" categoryName="離職要因刁E��" /></div>
  );
}

export default function HighRiskDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">読み込み中...</div></div>}>
      <HighRiskDashboardContent />
    </Suspense>
  );
}