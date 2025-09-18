'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Briefcase, Heart, GraduationCap, Target, TrendingUp } from 'lucide-react';
import { exportToPDF } from '@/utils/pdfExport';

function RetentionStrategiesContent() {
  const searchParams = useSearchParams();
  const facility = searchParams.get('facility') || '全施設';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="定着戦略レポ�EチE />
      
      <div id="report-content" className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">部署別・職種別の効果的な定着戦略</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                対象施設: {facility}
              </span>
              <button
                onClick={() => exportToPDF({
                  title: '定着戦略レポ�EチE,
                  facility: facility,
                  reportType: 'retention-strategies',
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
              吁E��署・職種の特性に応じた最適な人材定着戦略を、データ刁E��に基づぁE��策定します、E            </p>
          </div>

          {/* 全体概要E*/}
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
                  全部署カバ�E
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
                <div className="text-2xl font-bold">186吁E/div>
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
                <div className="text-2xl font-bold">5種顁E/div>
                <p className="text-xs text-muted-foreground mt-1">
                  特性別アプローチE                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  予想改喁E��
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">-6.8%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  離職玁E��減見込み
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
                      <Badge variant="destructive">最優允E/Badge>
                    </CardTitle>
                    <CardDescription>
                      職員数: 285吁E/ 現在離職玁E 18.5% / 目樁E 12.0%
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">リスクレベル</div>
                    <div className="text-xl font-bold text-red-600">髁E/div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h5 className="font-medium mb-2">主要課顁E/h5>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">夜勤負拁E��平坁E2囁E月！E/Badge>
                    <Badge variant="outline">新人教育体制不足</Badge>
                    <Badge variant="outline">キャリアパス不�E確</Badge>
                    <Badge variant="outline">休暇取得困難</Badge>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-2">推奨戦略: ワークライフバランス重視型</h5>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <span className="text-blue-500 font-bold">1.</span>
                      <div>
                        <p className="font-medium">夜勤負拁E��減�Eログラム</p>
                        <p className="text-sm text-gray-600">朁E回上限設定、夜勤専従看護師の採用、夜勤手彁E0%増顁E/p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-blue-500 font-bold">2.</span>
                      <div>
                        <p className="font-medium">新人メンター制度</p>
                        <p className="text-sm text-gray-600">1年間�E専任メンター配置、E��1回�E振り返り面諁E/p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-blue-500 font-bold">3.</span>
                      <div>
                        <p className="font-medium">キャリアラダー制度導�E</p>
                        <p className="text-sm text-gray-600">5段階�E明確なキャリアパス、各段階での忁E��スキル・研修の明示</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="text-sm">
                    <span className="text-gray-600">期征E��果！E/span>
                    <span className="font-medium text-green-600">離職玁E-6.5%</span>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition">
                    実施計画を作�E
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* リハビリチE�Eション私E*/}
            <Card className="border-purple-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-500" />
                      リハビリチE�Eション私E                      <Badge className="bg-orange-500">重要E/Badge>
                    </CardTitle>
                    <CardDescription>
                      職員数: 48吁E/ 現在離職玁E 22.3% / 目樁E 15.0%
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">リスクレベル</div>
                    <div className="text-xl font-bold text-orange-600">中髁E/div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-purple-50 rounded-lg p-4">
                  <h5 className="font-medium mb-2">主要課顁E/h5>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">若手�E員の早期離職</Badge>
                    <Badge variant="outline">研修機会不足</Badge>
                    <Badge variant="outline">評価基準�E不�E確ぁE/Badge>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-2">推奨戦略: 成長機会提供型</h5>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <span className="text-purple-500 font-bold">1.</span>
                      <div>
                        <p className="font-medium">スキルアチE�E支援制度</p>
                        <p className="text-sm text-gray-600">外部研修費用全額補助、学会参加支援、賁E��取得報奨釁E/p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-purple-500 font-bold">2.</span>
                      <div>
                        <p className="font-medium">若手育成�Eログラム</p>
                        <p className="text-sm text-gray-600">3年間�E段階的育成計画、症例検討会�E定期開催</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-purple-500 font-bold">3.</span>
                      <div>
                        <p className="font-medium">360度評価制度</p>
                        <p className="text-sm text-gray-600">多面皁E��評価とフィードバチE��、�E長目標�E共同設宁E/p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="text-sm">
                    <span className="text-gray-600">期征E��果！E/span>
                    <span className="font-medium text-green-600">離職玁E-7.3%</span>
                  </div>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700 transition">
                    実施計画を作�E
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
                      職員数: 32吁E/ 現在離職玁E 12.5% / 目樁E 8.0%
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
                  <h5 className="font-medium mb-2">主要課顁E/h5>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">単調な業務�E容</Badge>
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
                        <p className="font-medium">ジョブローチE�Eション制度</p>
                        <p className="text-sm text-gray-600">院冁E��部署での短期研修、業務�E多様化</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-gray-500 font-bold">2.</span>
                      <div>
                        <p className="font-medium">プロジェクト参加機企E/p>
                        <p className="text-sm text-gray-600">業務改喁E�Eロジェクトへの参画、提案制度の活性匁E/p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="text-sm">
                    <span className="text-gray-600">期征E��果！E/span>
                    <span className="font-medium text-green-600">離職玁E-4.5%</span>
                  </div>
                  <button className="bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700 transition">
                    実施計画を作�E
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
                職種特性に応じぁEつの基本戦略
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
                  <p className="text-xs text-gray-500">勤務体制の改喁E��休暇取得俁E��</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <h5 className="font-medium">成長機会提供型</h5>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">対象: リハビリ職、技師</p>
                  <p className="text-xs text-gray-500">研修允E��、スキルアチE�E支援</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <h5 className="font-medium">キャリア明確化型</h5>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">対象: 若手�E般</p>
                  <p className="text-xs text-gray-500">キャリアパス提示、目標設定支援</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <h5 className="font-medium">承認�E評価允E��型</h5>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">対象: 中堁E�E員</p>
                  <p className="text-xs text-gray-500">公正な評価、�E進機会�E提侁E/p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 実施優先頁E��E*/}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>実施優先頁E���Eトリクス</CardTitle>
              <CardDescription>
                効果と実施難易度による優先頁E��付け
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 rounded-lg p-4">
                  <h5 className="font-medium text-red-700 mb-2">最優先（高効果�E低難易度�E�E/h5>
                  <ul className="text-sm space-y-1">
                    <li>• 看護部の夜勤負拁E��渁E/li>
                    <li>• 全部署での1on1面諁E��度</li>
                    <li>• 若手メンター制度</li>
                  </ul>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <h5 className="font-medium text-orange-700 mb-2">優先（高効果�E高難易度�E�E/h5>
                  <ul className="text-sm space-y-1">
                    <li>• キャリアラダー制度構篁E/li>
                    <li>• 給与体系の見直ぁE/li>
                    <li>• 人員配置の最適匁E/li>
                  </ul>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h5 className="font-medium text-yellow-700 mb-2">次点�E�中効果�E低難易度�E�E/h5>
                  <ul className="text-sm space-y-1">
                    <li>• 研修プログラム拡允E/li>
                    <li>• 提案制度の活性匁E/li>
                    <li>• 部署間交流俁E��</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-700 mb-2">検討（中効果�E高難易度�E�E/h5>
                  <ul className="text-sm space-y-1">
                    <li>• 評価制度の全面改宁E/li>
                    <li>• 絁E��構造の見直ぁE/li>
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
      </div><CategoryTopButton categoryPath="/reports?tab=turnover" categoryName="離職要因刁E��" /></div>
  );
}

export default function RetentionStrategiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">読み込み中...</div></div>}>
      <RetentionStrategiesContent />
    </Suspense>
  );
}