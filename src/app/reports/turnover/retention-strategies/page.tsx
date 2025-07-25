'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import DashboardButton from '@/components/DashboardButton';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Briefcase, Heart, GraduationCap, Target, TrendingUp } from 'lucide-react';

function RetentionStrategiesContent() {
  const searchParams = useSearchParams();
  const facility = searchParams.get('facility') || '全施設';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader 
        title="定着戦略レポート" 
        showBackButton={false}
        backUrl="/reports"
        backText="レポートセンターに戻る"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">部署別・職種別の効果的な定着戦略</h2>
            <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              対象施設: {facility}
            </span>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600">
              各部署・職種の特性に応じた最適な人材定着戦略を、データ分析に基づいて策定します。
            </p>
          </div>

          {/* 全体概要 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  対象部署数
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12部署</div>
                <p className="text-xs text-muted-foreground mt-1">
                  全部署カバー
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  重点対象職員
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">186名</div>
                <p className="text-xs text-muted-foreground mt-1">
                  高リスク・高価値層
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  戦略パターン
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5種類</div>
                <p className="text-xs text-muted-foreground mt-1">
                  特性別アプローチ
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  予想改善率
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">-6.8%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  離職率削減見込み
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 部署別戦略 */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">部署別定着戦略</h3>

            {/* 看護部 */}
            <Card className="border-blue-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-blue-500" />
                      看護部
                      <Badge variant="destructive">最優先</Badge>
                    </CardTitle>
                    <CardDescription>
                      職員数: 285名 / 現在離職率: 18.5% / 目標: 12.0%
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">リスクレベル</div>
                    <div className="text-xl font-bold text-red-600">高</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h5 className="font-medium mb-2">主要課題</h5>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">夜勤負担（平均12回/月）</Badge>
                    <Badge variant="outline">新人教育体制不足</Badge>
                    <Badge variant="outline">キャリアパス不明確</Badge>
                    <Badge variant="outline">休暇取得困難</Badge>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-2">推奨戦略: ワークライフバランス重視型</h5>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <span className="text-blue-500 font-bold">1.</span>
                      <div>
                        <p className="font-medium">夜勤負担軽減プログラム</p>
                        <p className="text-sm text-gray-600">月8回上限設定、夜勤専従看護師の採用、夜勤手当30%増額</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-blue-500 font-bold">2.</span>
                      <div>
                        <p className="font-medium">新人メンター制度</p>
                        <p className="text-sm text-gray-600">1年間の専任メンター配置、週1回の振り返り面談</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-blue-500 font-bold">3.</span>
                      <div>
                        <p className="font-medium">キャリアラダー制度導入</p>
                        <p className="text-sm text-gray-600">5段階の明確なキャリアパス、各段階での必要スキル・研修の明示</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="text-sm">
                    <span className="text-gray-600">期待効果：</span>
                    <span className="font-medium text-green-600">離職率 -6.5%</span>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition">
                    実施計画を作成
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* リハビリテーション科 */}
            <Card className="border-purple-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-500" />
                      リハビリテーション科
                      <Badge className="bg-orange-500">重要</Badge>
                    </CardTitle>
                    <CardDescription>
                      職員数: 48名 / 現在離職率: 22.3% / 目標: 15.0%
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">リスクレベル</div>
                    <div className="text-xl font-bold text-orange-600">中高</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-purple-50 rounded-lg p-4">
                  <h5 className="font-medium mb-2">主要課題</h5>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">若手職員の早期離職</Badge>
                    <Badge variant="outline">研修機会不足</Badge>
                    <Badge variant="outline">評価基準の不明確さ</Badge>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-2">推奨戦略: 成長機会提供型</h5>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <span className="text-purple-500 font-bold">1.</span>
                      <div>
                        <p className="font-medium">スキルアップ支援制度</p>
                        <p className="text-sm text-gray-600">外部研修費用全額補助、学会参加支援、資格取得報奨金</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-purple-500 font-bold">2.</span>
                      <div>
                        <p className="font-medium">若手育成プログラム</p>
                        <p className="text-sm text-gray-600">3年間の段階的育成計画、症例検討会の定期開催</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-purple-500 font-bold">3.</span>
                      <div>
                        <p className="font-medium">360度評価制度</p>
                        <p className="text-sm text-gray-600">多面的な評価とフィードバック、成長目標の共同設定</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="text-sm">
                    <span className="text-gray-600">期待効果：</span>
                    <span className="font-medium text-green-600">離職率 -7.3%</span>
                  </div>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700 transition">
                    実施計画を作成
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* 医事課 */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-gray-500" />
                      医事課
                    </CardTitle>
                    <CardDescription>
                      職員数: 32名 / 現在離職率: 12.5% / 目標: 8.0%
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">リスクレベル</div>
                    <div className="text-xl font-bold text-yellow-600">中</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium mb-2">主要課題</h5>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">単調な業務内容</Badge>
                    <Badge variant="outline">キャリアの停滞感</Badge>
                    <Badge variant="outline">他部署との連携不足</Badge>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-2">推奨戦略: エンゲージメント向上型</h5>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <span className="text-gray-500 font-bold">1.</span>
                      <div>
                        <p className="font-medium">ジョブローテーション制度</p>
                        <p className="text-sm text-gray-600">院内他部署での短期研修、業務の多様化</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-gray-500 font-bold">2.</span>
                      <div>
                        <p className="font-medium">プロジェクト参加機会</p>
                        <p className="text-sm text-gray-600">業務改善プロジェクトへの参画、提案制度の活性化</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="text-sm">
                    <span className="text-gray-600">期待効果：</span>
                    <span className="font-medium text-green-600">離職率 -4.5%</span>
                  </div>
                  <button className="bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700 transition">
                    実施計画を作成
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 職種別戦略サマリー */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>職種別戦略パターン</CardTitle>
              <CardDescription>
                職種特性に応じた5つの基本戦略
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <h5 className="font-medium">ワークライフバランス重視型</h5>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">対象: 看護師、介護士</p>
                  <p className="text-xs text-gray-500">勤務体制の改善、休暇取得促進</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <h5 className="font-medium">成長機会提供型</h5>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">対象: リハビリ職、技師</p>
                  <p className="text-xs text-gray-500">研修充実、スキルアップ支援</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <h5 className="font-medium">キャリア明確化型</h5>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">対象: 若手全般</p>
                  <p className="text-xs text-gray-500">キャリアパス提示、目標設定支援</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <h5 className="font-medium">承認・評価充実型</h5>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">対象: 中堅職員</p>
                  <p className="text-xs text-gray-500">公正な評価、昇進機会の提供</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 実施優先順位 */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>実施優先順位マトリクス</CardTitle>
              <CardDescription>
                効果と実施難易度による優先順位付け
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 rounded-lg p-4">
                  <h5 className="font-medium text-red-700 mb-2">最優先（高効果・低難易度）</h5>
                  <ul className="text-sm space-y-1">
                    <li>• 看護部の夜勤負担軽減</li>
                    <li>• 全部署での1on1面談制度</li>
                    <li>• 若手メンター制度</li>
                  </ul>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <h5 className="font-medium text-orange-700 mb-2">優先（高効果・高難易度）</h5>
                  <ul className="text-sm space-y-1">
                    <li>• キャリアラダー制度構築</li>
                    <li>• 給与体系の見直し</li>
                    <li>• 人員配置の最適化</li>
                  </ul>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h5 className="font-medium text-yellow-700 mb-2">次点（中効果・低難易度）</h5>
                  <ul className="text-sm space-y-1">
                    <li>• 研修プログラム拡充</li>
                    <li>• 提案制度の活性化</li>
                    <li>• 部署間交流促進</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-700 mb-2">検討（中効果・高難易度）</h5>
                  <ul className="text-sm space-y-1">
                    <li>• 評価制度の全面改定</li>
                    <li>• 組織構造の見直し</li>
                    <li>• 新規採用戦略変更</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* アクションボタン */}
          <div className="flex gap-4 mt-8">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              部署別実施計画書
            </button>
            <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition">
              戦略効果シミュレーション
            </button>
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
              経営層向けサマリー
            </button>
          </div>
        </div>
      </div>
            <ScrollToTopButton />
      <DashboardButton />
    </div>
  );
}

export default function RetentionStrategiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">読み込み中...</div></div>}>
      <RetentionStrategiesContent />
    </Suspense>
  );
}