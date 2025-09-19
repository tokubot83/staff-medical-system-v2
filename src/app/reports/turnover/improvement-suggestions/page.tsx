'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

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
      <div id="report-content" className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">AIによる離職防止施策の提案</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                対象施設: {facility}
              </span>
              <button
                onClick={() => exportToPDF({
                  title: '改善提案レポート',
                  facility: facility,
                  reportType: 'improvement-suggestions',
                  elementId: 'report-content',
                  dateRange: new Date().toLocaleDateString('ja-JP')
                })}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm pdf-exclude"
              >
                PDFダウンロード
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600">
              データ分析に基づいて、最も効果的な離職防止施策を優先度順に提案します。各施策の期待効果と実施難易度を考慮した実践的な改善案です。
            </p>
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
                  優先度順に表示
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  期待削減率
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">-8.5%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  全施策実施時
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  即効性施策
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4件</div>
                <p className="text-xs text-muted-foreground mt-1">
                  3ヶ月以内に効果
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  実施中施策
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2件</div>
                <p className="text-xs text-muted-foreground mt-1">
                  効果測定中
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 優先度1: 最重要施策 */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Target className="h-5 w-5 text-red-500" />
              優先度1: 最重要施策
            </h3>

            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      定期的な1on1面談の制度化
                      <Badge variant="destructive">最優先</Badge>
                    </CardTitle>
                    <CardDescription>
                      全職員に対して月1回以上の上司との1on1面談を必須化
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-600">-3.2%</div>
                    <p className="text-xs text-gray-500">離職率削減効果</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">対象者</p>
                    <p className="font-medium">全職員（523名）</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">実施難易度</p>
                    <div className="flex items-center gap-2">
                      <Progress value={30} className="w-20 h-2" />
                      <span className="text-sm">低</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">効果発現時期</p>
                    <p className="font-medium">1ヶ月後〜</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <h5 className="font-medium mb-2">具体的な実施方法</h5>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    <li>毎月第1週に30分の1on1面談を設定</li>
                    <li>面談記録システムの導入（進捗・課題・キャリア希望）</li>
                    <li>管理職向け面談スキル研修の実施（月1回）</li>
                    <li>面談実施率を部門評価に組み込み</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h5 className="font-medium mb-2">期待される効果</h5>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>早期の問題発見</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>心理的安全性の向上</span>
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
                      残業時間管理の強化
                      <Badge className="bg-orange-500">重要</Badge>
                    </CardTitle>
                    <CardDescription>
                      月45時間を上限とした残業管理システムの導入
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-600">-2.1%</div>
                    <p className="text-xs text-gray-500">離職率削減効果</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">対象者</p>
                    <p className="font-medium">156名（月45時間超）</p>
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
                    <p className="font-medium">3ヶ月後〜</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <h5 className="font-medium mb-2">具体的な実施方法</h5>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    <li>勤怠管理システムでの自動アラート機能</li>
                    <li>月35時間到達時点での上司面談必須化</li>
                    <li>業務効率化プロジェクトチームの設置</li>
                    <li>人員配置の最適化（AIシフト管理導入）</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 優先度2: 重要施策 */}
          <div className="space-y-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-yellow-500" />
              優先度2: 重要施策
            </h3>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      メンタルヘルスケアプログラムの拡充
                    </CardTitle>
                    <CardDescription>
                      ストレス管理研修と個別カウンセリングの提供
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">-1.5%</div>
                    <p className="text-xs text-gray-500">離職率削減効果</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-sm">
                    <p className="text-gray-600 mb-1">実施内容</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>月1回のストレス管理研修</li>
                      <li>外部カウンセラーによる相談窓口</li>
                      <li>マインドフルネスプログラム導入</li>
                    </ul>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-600 mb-1">KPI</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>ストレススコア20%改善</li>
                      <li>相談利用率30%以上</li>
                      <li>満足度スコア4.0以上</li>
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
                      キャリア開発支援制度の構築
                    </CardTitle>
                    <CardDescription>
                      個別キャリアプランの策定と研修機会の拡充
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">-1.2%</div>
                    <p className="text-xs text-gray-500">離職率削減効果</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-sm">
                    <p className="text-gray-600 mb-1">実施内容</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>年2回のキャリア面談</li>
                      <li>資格取得支援制度（費用補助）</li>
                      <li>院内留学・部署交流制度</li>
                    </ul>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-600 mb-1">対象者優先順位</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>勤続1-3年の職員</li>
                      <li>エンゲージメント低下層</li>
                      <li>若手リーダー候補</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 実施スケジュール */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>実施スケジュール案</CardTitle>
              <CardDescription>
                効果的な導入のための段階的実施計画
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                    <span className="font-bold text-blue-600">1M</span>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium">第1月</h5>
                    <p className="text-sm text-gray-600">1on1面談制度の導入準備・管理職研修</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                    <span className="font-bold text-blue-600">2M</span>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium">第2月</h5>
                    <p className="text-sm text-gray-600">1on1面談開始・残業管理システム導入</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                    <span className="font-bold text-blue-600">3M</span>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium">第3月</h5>
                    <p className="text-sm text-gray-600">メンタルヘルスプログラム開始・効果測定</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* アクションボタン */}
          <div className="flex gap-4 mt-8">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              実施計画書を作成
            </button>
            <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition">
              詳細分析レポート
            </button>
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
              経営会議用資料作成
            </button>
          </div>
        </div>
      </div></div>
  );
}

export default function ImprovementSuggestionsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">読み込み中...</div></div>}>
      <ImprovementSuggestionsContent />
    </Suspense>
  );
}