'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, User, ArrowRight, Target } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ダッシュボード</h1>
          <p className="text-gray-600 mt-2">人事評価システム統合管理</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 管理者ダッシュボード */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>管理者ダッシュボード</CardTitle>
                  <CardDescription>組織全体の評価管理</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  組織全体の評価進捗、グレード分布、部門別分析を確認できます。
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 施設全体の評価進捗管理</li>
                  <li>• グレード分布の可視化</li>
                  <li>• 部門別パフォーマンス分析</li>
                  <li>• リマインダー送信機能</li>
                </ul>
                <Link href="/dashboard/admin">
                  <Button className="w-full">
                    管理者ダッシュボードへ
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* 個人ダッシュボード */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <User className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle>個人ダッシュボード</CardTitle>
                  <CardDescription>個人の評価・研修管理</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  個人の評価履歴、研修状況、次回評価の準備状況を確認できます。
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 評価履歴の確認</li>
                  <li>• 研修受講状況の管理</li>
                  <li>• 次回評価スケジュール</li>
                  <li>• 個人目標の設定と追跡</li>
                </ul>
                <Link href="/dashboard/personal">
                  <Button className="w-full" variant="outline">
                    個人ダッシュボードへ
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 総合評価システムv3 */}
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            🎯 総合評価システム v3
            <Badge className="bg-red-500 text-white">NEW</Badge>
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            評価制度の設計から個人評価まで、統合的に管理できる新システム
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/evaluation-design">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Target className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">評価制度設計</h3>
                      <p className="text-xs text-gray-600">100点の配分を決める</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/evaluation-execution">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <User className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">個人評価管理</h3>
                      <p className="text-xs text-gray-600">職員を評価する</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* クイックアクセス（既存） */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">クイックアクセス（従来版）</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/evaluation">
              <Button variant="outline" className="w-full h-20 flex-col">
                <span className="text-xs">評価入力</span>
              </Button>
            </Link>
            <Link href="/training">
              <Button variant="outline" className="w-full h-20 flex-col">
                <span className="text-xs">研修管理</span>
              </Button>
            </Link>
            <Link href="/evaluation/core-v2">
              <Button variant="outline" className="w-full h-20 flex-col">
                <span className="text-xs">コア評価V2</span>
              </Button>
            </Link>
            <Link href="/reports">
              <Button variant="outline" className="w-full h-20 flex-col">
                <span className="text-xs">レポート</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}