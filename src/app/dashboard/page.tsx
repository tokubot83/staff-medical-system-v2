'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  User, 
  ArrowRight, 
  Target, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  Clock,
  AlertCircle,
  FileText,
  Award,
  BarChart3,
  Settings,
  Calendar,
  Sparkles
} from 'lucide-react';

export default function DashboardPage() {
  const [evaluationProgress] = useState({
    total: 125,
    completed: 78,
    inProgress: 32,
    notStarted: 15
  });

  const completionRate = Math.round((evaluationProgress.completed / evaluationProgress.total) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-lg">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            新人事評価管理システム
          </h1>
          <p className="text-gray-600 mt-3 text-lg">総合評価システムv3 - 評価制度の設計から実行まで統合管理</p>
        </div>

        {/* 評価進捗サマリー */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="bg-white hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">評価対象者</p>
                  <p className="text-3xl font-bold text-gray-900">{evaluationProgress.total}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">評価完了</p>
                  <p className="text-3xl font-bold text-green-600">{evaluationProgress.completed}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">評価中</p>
                  <p className="text-3xl font-bold text-blue-600">{evaluationProgress.inProgress}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">完了率</p>
                  <p className="text-3xl font-bold text-purple-600">{completionRate}%</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 全体進捗バー */}
        <Card className="mb-8 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">2025年度 評価進捗状況</h3>
              <Badge className="bg-blue-100 text-blue-800">進行中</Badge>
            </div>
            <Progress value={completionRate} className="h-3 mb-2" />
            <p className="text-sm text-gray-600">
              {evaluationProgress.completed}名完了 / {evaluationProgress.total}名中
            </p>
          </CardContent>
        </Card>

        {/* メイン機能エリア */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* 評価制度設計 */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Settings className="h-7 w-7 text-blue-600" />
              評価制度設計
            </h2>
            <Card className="border-2 border-blue-200 hover:shadow-xl transition-all bg-gradient-to-br from-blue-50 to-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  100点満点配分管理
                </CardTitle>
                <CardDescription>
                  技術評価と貢献度評価の配分を設計
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-white rounded-lg border">
                      <p className="text-gray-600 mb-1">技術評価</p>
                      <p className="text-xl font-bold text-blue-600">50点</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border">
                      <p className="text-gray-600 mb-1">貢献度評価</p>
                      <p className="text-xl font-bold text-green-600">50点</p>
                    </div>
                  </div>
                  <Link href="/evaluation-design">
                    <Button className="w-full" size="lg">
                      評価制度を設計する
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* 動的設問管理 */}
            <Card className="border-2 border-purple-200 hover:shadow-xl transition-all bg-gradient-to-br from-purple-50 to-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  動的設問管理
                  <Badge className="bg-purple-100 text-purple-800">AI対応</Badge>
                </CardTitle>
                <CardDescription>
                  研修履歴と経験レベルに応じた設問自動生成
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/evaluation-design/questions">
                  <Button className="w-full" variant="outline">
                    <Sparkles className="mr-2 h-4 w-4" />
                    動的設問を管理
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* 個人評価管理 */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <User className="h-7 w-7 text-purple-600" />
              個人評価管理
            </h2>
            <Card className="border-2 border-purple-200 hover:shadow-xl transition-all bg-gradient-to-br from-purple-50 to-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  評価実施・管理
                </CardTitle>
                <CardDescription>
                  評価入力から開示まで一元管理
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">評価入力</span>
                    <Badge variant="outline">5段階評価</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">総合判定</span>
                    <Badge variant="outline">S~Dグレード</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">評価開示</span>
                    <Badge variant="outline">異議申立対応</Badge>
                  </div>
                </div>
                <Link href="/evaluation-execution">
                  <Button className="w-full" size="lg">
                    評価を実施する
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* クイックアクセス */}
            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="text-base">クイックアクセス</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/dashboard/admin">
                    <Button variant="outline" size="sm" className="w-full">
                      <Shield className="mr-2 h-4 w-4" />
                      管理者用
                    </Button>
                  </Link>
                  <Link href="/dashboard/personal">
                    <Button variant="outline" size="sm" className="w-full">
                      <User className="mr-2 h-4 w-4" />
                      個人用
                    </Button>
                  </Link>
                  <Link href="/training">
                    <Button variant="outline" size="sm" className="w-full">
                      <Award className="mr-2 h-4 w-4" />
                      研修管理
                    </Button>
                  </Link>
                  <Link href="/reports">
                    <Button variant="outline" size="sm" className="w-full">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      レポート
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* スケジュールと重要日程 */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-700" />
              2025年度 評価スケジュール
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-sm text-gray-600 mb-1">評価設計期間</p>
                <p className="font-semibold">12月〜1月</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <p className="text-sm text-gray-600 mb-1">上期評価</p>
                <p className="font-semibold">7月実施</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <p className="text-sm text-gray-600 mb-1">下期評価</p>
                <p className="font-semibold">12月実施</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                <p className="text-sm text-gray-600 mb-1">次回締切</p>
                <p className="font-semibold">1月31日</p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}