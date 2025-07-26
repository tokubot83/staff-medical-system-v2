'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import DashboardButton from '@/components/DashboardButton';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import { BackToReportsButton } from '@/components/BackToReportsButton';
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
      <CommonHeader title="高リスク職員ダッシュボード" />
      
      <div id="report-content" className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">離職リスクが高い職員の一覧と対応状況</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                対象施設: {facility}
              </span>
              <button
                onClick={() => exportToPDF({
                  title: '高リスク職員ダッシュボード',
                  facility: facility,
                  reportType: 'high-risk-dashboard',
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
              AIモデルにより離職リスクが70%以上と判定された職員の詳細情報と、実施済み・予定の対応策を管理します。
            </p>
          </div>

          {/* サマリーカード */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  高リスク職員数
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">42名</div>
                <p className="text-xs text-muted-foreground mt-1">
                  前月比 +3名
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  対応実施率
                </CardTitle>
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
                  平均リスクスコア
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">82.5%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  前月比 +2.3%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  今週の面談予定
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8件</div>
                <p className="text-xs text-muted-foreground mt-1">
                  未設定: 11名
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 高リスク職員リスト */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">高リスク職員一覧（リスクスコア順）</h3>
            
            {/* 職員カード例 */}
            <div className="border rounded-lg p-4 bg-red-50 border-red-200">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">山田 太郎</h4>
                    <Badge variant="destructive">緊急対応</Badge>
                  </div>
                  <p className="text-sm text-gray-600">内科病棟 / 看護師 / 勤続2年3ヶ月</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-600">95%</div>
                  <p className="text-xs text-gray-500">離職リスク</p>
                </div>
              </div>
              
              <Progress value={95} className="h-2 mb-3" />
              
              <div className="grid gap-2 md:grid-cols-2 mb-3">
                <div className="text-sm">
                  <span className="text-gray-600">主要リスク要因：</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <Badge variant="outline" className="text-xs">面談なし（3ヶ月）</Badge>
                    <Badge variant="outline" className="text-xs">残業60時間超</Badge>
                    <Badge variant="outline" className="text-xs">ストレス指数85</Badge>
                  </div>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">最終面談：</span>
                  <span className="ml-1 font-medium">2024年4月15日</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span>次回面談: 未設定</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span>担当: 看護部長</span>
                  </div>
                </div>
                <button className="bg-red-600 text-white px-4 py-1 rounded text-sm hover:bg-red-700 transition">
                  面談設定
                </button>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">佐藤 花子</h4>
                    <Badge variant="secondary">対応中</Badge>
                  </div>
                  <p className="text-sm text-gray-600">外科病棟 / 看護師 / 勤続1年6ヶ月</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-600">88%</div>
                  <p className="text-xs text-gray-500">離職リスク</p>
                </div>
              </div>
              
              <Progress value={88} className="h-2 mb-3" />
              
              <div className="grid gap-2 md:grid-cols-2 mb-3">
                <div className="text-sm">
                  <span className="text-gray-600">主要リスク要因：</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <Badge variant="outline" className="text-xs">エンゲージメント低下</Badge>
                    <Badge variant="outline" className="text-xs">夜勤12回/月</Badge>
                    <Badge variant="outline" className="text-xs">有給取得率20%</Badge>
                  </div>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">最終面談：</span>
                  <span className="ml-1 font-medium">2024年7月10日</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-green-500" />
                    <span>次回面談: 7月28日</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span>担当: 主任看護師</span>
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
                    <h4 className="font-semibold">鈴木 一郎</h4>
                    <Badge variant="secondary">対応中</Badge>
                  </div>
                  <p className="text-sm text-gray-600">リハビリテーション科 / 理学療法士 / 勤続8ヶ月</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-600">85%</div>
                  <p className="text-xs text-gray-500">離職リスク</p>
                </div>
              </div>
              
              <Progress value={85} className="h-2 mb-3" />
              
              <div className="grid gap-2 md:grid-cols-2 mb-3">
                <div className="text-sm">
                  <span className="text-gray-600">主要リスク要因：</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <Badge variant="outline" className="text-xs">新入職員（1年未満）</Badge>
                    <Badge variant="outline" className="text-xs">研修機会不足</Badge>
                    <Badge variant="outline" className="text-xs">キャリア不安</Badge>
                  </div>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">最終面談：</span>
                  <span className="ml-1 font-medium">2024年7月5日</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-green-500" />
                    <span>次回面談: 7月26日</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span>担当: リハビリ部長</span>
                  </div>
                </div>
                <button className="bg-gray-600 text-white px-4 py-1 rounded text-sm hover:bg-gray-700 transition">
                  対応履歴
                </button>
              </div>
            </div>
          </div>

          {/* フィルターと並び替え */}
          <div className="flex gap-4 mt-6">
            <select className="border rounded px-3 py-2 text-sm">
              <option>全部署</option>
              <option>内科病棟</option>
              <option>外科病棟</option>
              <option>ICU</option>
              <option>救急部</option>
            </select>
            <select className="border rounded px-3 py-2 text-sm">
              <option>リスクスコア順</option>
              <option>対応状況順</option>
              <option>部署順</option>
              <option>勤続年数順</option>
            </select>
            <button className="bg-blue-600 text-white px-6 py-2 rounded text-sm hover:bg-blue-700 transition ml-auto">
              CSVエクスポート
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

export default function HighRiskDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">読み込み中...</div></div>}>
      <HighRiskDashboardContent />
    </Suspense>
  );
}