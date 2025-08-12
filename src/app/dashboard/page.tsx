'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, User, ArrowRight } from 'lucide-react';

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

        {/* クイックアクセス */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">クイックアクセス</h2>
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