'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import CommonHeader from '@/components/CommonHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import styles from './Dashboard.module.css';
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
  Sparkles,
  BookOpen,
  Activity,
  Cog,
  ChartBar,
  Home,
  Info,
  Bell,
  Building,
  Download,
  PlayCircle,
  ListChecks,
  Zap,
  HelpCircle,
  ChevronRight,
  Rocket,
  ClipboardList,
  UserCheck,
  UserPlus,
  FilePlus,
  Database,
  RefreshCw,
  Eye,
  Send,
  MessageSquare,
  Archive
} from 'lucide-react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('home');
  const [evaluationProgress] = useState({
    total: 125,
    completed: 78,
    inProgress: 32,
    notStarted: 15
  });
  const [showWorkflowGuide, setShowWorkflowGuide] = useState(true);

  const completionRate = Math.round((evaluationProgress.completed / evaluationProgress.total) * 100);

  // ワークフローステップの定義
  const workflowSteps = [
    { id: 1, title: '評価設計', status: 'completed', icon: Settings },
    { id: 2, title: '評価実施', status: 'current', icon: ClipboardList },
    { id: 3, title: '集計・分析', status: 'upcoming', icon: BarChart3 },
    { id: 4, title: 'フィードバック', status: 'upcoming', icon: MessageSquare }
  ];

  return (
    <div>
      <CommonHeader title="評価管理ダッシュボード" />
      <div className={styles.container}>
        {/* ワークフローガイド */}
        {showWorkflowGuide && (
          <Card className="mb-6 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">現在の評価フロー</CardTitle>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowWorkflowGuide(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                {workflowSteps.map((step, index) => (
                  <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center flex-1">
                      <div className={`
                        p-4 rounded-full mb-2 transition-all
                        ${step.status === 'completed' ? 'bg-green-100' : ''}
                        ${step.status === 'current' ? 'bg-blue-100 ring-4 ring-blue-200' : ''}
                        ${step.status === 'upcoming' ? 'bg-gray-100' : ''}
                      `}>
                        <step.icon className={`
                          h-6 w-6
                          ${step.status === 'completed' ? 'text-green-600' : ''}
                          ${step.status === 'current' ? 'text-blue-600' : ''}
                          ${step.status === 'upcoming' ? 'text-gray-400' : ''}
                        `} />
                      </div>
                      <span className={`
                        text-sm font-medium
                        ${step.status === 'current' ? 'text-blue-600' : 'text-gray-600'}
                      `}>
                        {step.title}
                      </span>
                      {step.status === 'completed' && (
                        <Badge className="mt-1 bg-green-100 text-green-700" variant="secondary">完了</Badge>
                      )}
                      {step.status === 'current' && (
                        <Badge className="mt-1 bg-blue-100 text-blue-700" variant="secondary">進行中</Badge>
                      )}
                    </div>
                    {index < workflowSteps.length - 1 && (
                      <ChevronRight className="h-5 w-5 text-gray-400 mb-8" />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <Alert className="mt-4 border-blue-200 bg-blue-50">
                <Zap className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>次のアクション：</strong> 未完了の評価対象者47名に対して評価を実施してください。
                  締切まであと<strong className="text-red-600">5日</strong>です。
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}
        <div className={styles.tabNavigation}>
          {[
            { id: 'home', label: 'ホーム', icon: '🏠' },
            { id: 'guide', label: '評価ガイド', icon: '📖' },
            { id: 'progress', label: '進捗管理', icon: '📊' },
            { id: 'settings', label: '設定・運用', icon: '⚙️' },
            { id: 'analysis', label: '分析・レポート', icon: '📈' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              <span className={styles.tabLabel}>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className={styles.tabContent}>

          {activeTab === 'home' && (
            <div className="space-y-6 p-6">
            {/* クイックアクションセクション */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                今すぐ実行できるアクション
              </h2>
              <div className="grid grid-cols-4 gap-4">
                <Link href="/evaluation-execution/new">
                  <Card className="hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100">
                    <CardContent className="p-6 text-center">
                      <div className="mx-auto mb-3 p-3 bg-blue-500 rounded-full w-fit">
                        <PlayCircle className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-bold text-blue-900 mb-1">新規評価開始</h3>
                      <p className="text-xs text-blue-700">評価を今すぐ開始</p>
                    </CardContent>
                  </Card>
                </Link>
                
                <Link href="/evaluation-design/templates">
                  <Card className="hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-purple-400 bg-gradient-to-br from-purple-50 to-purple-100">
                    <CardContent className="p-6 text-center">
                      <div className="mx-auto mb-3 p-3 bg-purple-500 rounded-full w-fit">
                        <FilePlus className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-bold text-purple-900 mb-1">テンプレート作成</h3>
                      <p className="text-xs text-purple-700">評価項目を設定</p>
                    </CardContent>
                  </Card>
                </Link>
                
                <Link href="/reminders/send">
                  <Card className="hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-orange-400 bg-gradient-to-br from-orange-50 to-orange-100">
                    <CardContent className="p-6 text-center">
                      <div className="mx-auto mb-3 p-3 bg-orange-500 rounded-full w-fit">
                        <Send className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-bold text-orange-900 mb-1">リマインド送信</h3>
                      <p className="text-xs text-orange-700">未完了者に通知</p>
                    </CardContent>
                  </Card>
                </Link>
                
                <Link href="/reports/export">
                  <Card className="hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-green-400 bg-gradient-to-br from-green-50 to-green-100">
                    <CardContent className="p-6 text-center">
                      <div className="mx-auto mb-3 p-3 bg-green-500 rounded-full w-fit">
                        <Download className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-bold text-green-900 mb-1">レポート出力</h3>
                      <p className="text-xs text-green-700">評価結果を出力</p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>

            {/* メイン機能 - 最重要 */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              {/* 評価制度設計 */}
              <Card className="border-2 border-blue-500 shadow-xl hover:shadow-2xl transition-all bg-gradient-to-br from-blue-600 to-blue-700 text-white relative overflow-hidden">
                <div className="absolute top-2 right-2">
                  <Badge className="bg-yellow-400 text-yellow-900">設定必須</Badge>
                </div>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-white/20 rounded-lg backdrop-blur">
                        <Settings className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold text-white">評価制度設計</CardTitle>
                        <CardDescription className="text-blue-100 mt-1">
                          100点満点配分の設計と動的設問管理
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-white/10 rounded-lg backdrop-blur">
                    <h4 className="text-sm font-bold text-blue-100 mb-3">設定可能な項目：</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-300" />
                        <span className="text-sm">技術評価項目</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-300" />
                        <span className="text-sm">貢献度評価項目</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-300" />
                        <span className="text-sm">配点設定</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-300" />
                        <span className="text-sm">AI動的設問</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white/10 rounded-lg backdrop-blur">
                      <p className="text-blue-100 text-sm mb-1">技術評価</p>
                      <p className="text-2xl font-bold">50点</p>
                    </div>
                    <div className="p-3 bg-white/10 rounded-lg backdrop-blur">
                      <p className="text-blue-100 text-sm mb-1">貢献度評価</p>
                      <p className="text-2xl font-bold">50点</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href="/evaluation-design" className="flex-1">
                      <Button className="w-full bg-white text-blue-600 hover:bg-blue-50" size="lg">
                        <Settings className="mr-2 h-5 w-5" />
                        設計画面へ
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="lg"
                      className="text-white hover:bg-white/20"
                      title="使い方ガイド"
                    >
                      <HelpCircle className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* 個人評価管理 */}
              <Card className="border-2 border-purple-500 shadow-xl hover:shadow-2xl transition-all bg-gradient-to-br from-purple-600 to-purple-700 text-white relative overflow-hidden">
                <div className="absolute top-2 right-2">
                  <Badge className="bg-orange-400 text-orange-900">実施中</Badge>
                </div>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-white/20 rounded-lg backdrop-blur">
                        <User className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold text-white">個人評価管理</CardTitle>
                        <CardDescription className="text-purple-100 mt-1">
                          評価実施から開示まで一元管理
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-white/10 rounded-lg backdrop-blur">
                    <h4 className="text-sm font-bold text-purple-100 mb-3">実施可能な操作：</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-green-300" />
                        <span className="text-sm">個別評価入力</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-green-300" />
                        <span className="text-sm">評価結果確認</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Send className="h-4 w-4 text-green-300" />
                        <span className="text-sm">評価開示</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-green-300" />
                        <span className="text-sm">異議申立対応</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white/10 rounded-lg backdrop-blur">
                      <p className="text-purple-100 text-sm mb-1">評価対象</p>
                      <p className="text-2xl font-bold">125名</p>
                    </div>
                    <div className="p-3 bg-white/10 rounded-lg backdrop-blur">
                      <p className="text-purple-100 text-sm mb-1">完了率</p>
                      <p className="text-2xl font-bold">{completionRate}%</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href="/evaluation-execution" className="flex-1">
                      <Button className="w-full bg-white text-purple-600 hover:bg-purple-50" size="lg">
                        <ClipboardList className="mr-2 h-5 w-5" />
                        評価画面へ
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="lg"
                      className="text-white hover:bg-white/20"
                      title="使い方ガイド"
                    >
                      <HelpCircle className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* タスク優先度セクション */}
            <Card className="mb-6 border-2 border-red-200 bg-gradient-to-r from-red-50 to-pink-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  今すぐ対応が必要なタスク
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border-l-4 border-red-500">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-red-100 text-red-800">緊急</Badge>
                      <div>
                        <p className="font-medium">本日締切の評価</p>
                        <p className="text-sm text-gray-600">外科病棟 5名分の評価が未完了</p>
                      </div>
                    </div>
                    <Link href="/evaluation-execution/urgent">
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        今すぐ対応
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border-l-4 border-orange-500">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-orange-100 text-orange-800">重要</Badge>
                      <div>
                        <p className="font-medium">未設定の評価項目</p>
                        <p className="text-sm text-gray-600">看護部の技術評価項目が未設定</p>
                      </div>
                    </div>
                    <Link href="/evaluation-design/nursing">
                      <Button size="sm" variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50">
                        設定する
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 評価進捗サマリー */}
            <div className="grid grid-cols-4 gap-4">
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
            <Card className="bg-white">
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

            {/* その他の機能 */}
            <div className="grid grid-cols-3 gap-4">
              {/* クイックアクセス */}
              <Card className="bg-white hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Building className="h-5 w-5 text-gray-600" />
                    クイックアクセス
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-2">
                    <Link href="/dashboard/admin">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Shield className="mr-2 h-4 w-4" />
                        管理者ダッシュボード
                      </Button>
                    </Link>
                    <Link href="/dashboard/personal">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <User className="mr-2 h-4 w-4" />
                        個人ダッシュボード
                      </Button>
                    </Link>
                    <Link href="/training">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Award className="mr-2 h-4 w-4" />
                        研修管理システム
                      </Button>
                    </Link>
                    <Link href="/reports">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        分析レポート
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* 動的設問管理 */}
              <Card className="bg-white hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    動的設問管理
                    <Badge className="bg-purple-100 text-purple-800" variant="outline">AI</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      研修履歴と経験レベルに応じた設問を自動生成
                    </p>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-xs text-purple-700 mb-1">現在の設問数</p>
                      <p className="text-lg font-bold text-purple-900">248問</p>
                    </div>
                    <Link href="/evaluation-design/questions">
                      <Button className="w-full" variant="outline" size="sm">
                        <Sparkles className="mr-2 h-4 w-4" />
                        設問を管理
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* 評価締切アラート */}
              <Card className="bg-white hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Bell className="h-5 w-5 text-orange-600" />
                    評価締切アラート
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Alert className="border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-sm">
                        <strong>本日締切:</strong> 5名分
                      </AlertDescription>
                    </Alert>
                    <Alert className="border-yellow-200 bg-yellow-50">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      <AlertDescription className="text-sm">
                        <strong>3日後:</strong> 8名分
                      </AlertDescription>
                    </Alert>
                    <Button variant="outline" size="sm" className="w-full">
                      全ての締切を確認
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
          )}

          {activeTab === 'guide' && (
            <div className="space-y-6 p-6">
            {/* ストーリー形式での評価ガイド */}
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <span className="text-2xl">📖</span>
                  田中さんの1年間評価ストーリー
                </CardTitle>
                <CardDescription className="text-gray-700">
                  新入職員の田中さんが、どのように1年間を通して評価されるかをストーリーで見てみましょう
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* ストーリーのイントロ */}
                <div className="mb-8 p-6 bg-white rounded-xl shadow-md">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white shadow-lg">
                      <span className="text-2xl">👤</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">田中 花子さん</h3>
                      <p className="text-gray-600">看護師・入職1年目</p>
                      <p className="text-sm text-blue-600">2024年4月1日入職</p>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-gray-700 leading-relaxed">
                      田中さんは看護師として初めて働き始めました。<br/>
                      <strong>「評価ってどういう仕組みなの？」</strong><br/>
                      そんな田中さんの1年間を追いながら、評価制度を見てみましょう。
                    </p>
                  </div>
                </div>

                {/* 評価設計の意図 - 重要ポイント解説 */}
                <div className="mb-8">
                  <Card className="border-2 border-indigo-300 bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <span className="text-2xl">🧠</span>
                        なぜこの評価制度になったの？ - 設計の意図
                      </CardTitle>
                      <CardDescription className="text-gray-700">
                        複雑に見える評価制度には、職員のための深い配慮があります
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* 重要ポイント1: 2つの評価軸の理由 */}
                        <div className="p-4 bg-white rounded-xl border-l-4 border-indigo-500 shadow-sm">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                              1
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-indigo-900 mb-2">
                                ⚖️ なぜ「技術評価」と「貢献度評価」の2つに分けるの？
                              </h4>
                              <div className="bg-indigo-50 p-3 rounded-lg mb-3">
                                <p className="text-sm text-indigo-800 font-semibold">
                                  💡 設計意図：<span className="text-indigo-600">「専門スキル」と「組織への貢献」は別々に評価すべきだから</span>
                                </p>
                              </div>
                              <div className="space-y-2 text-sm text-gray-700">
                                <p><strong>技術評価（50点）：</strong>看護師としての専門技術を公平に評価</p>
                                <p><strong>貢献度評価（50点）：</strong>組織活動への積極性を評価</p>
                                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                  <p className="text-yellow-800">
                                    <strong>重要：</strong>技術が優秀でも組織に貢献しない人、技術は普通でも組織に大きく貢献する人、
                                    どちらも適切に評価されるように設計されています
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 重要ポイント2: 相対評価と絶対評価の組み合わせ */}
                        <div className="p-4 bg-white rounded-xl border-l-4 border-purple-500 shadow-sm">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                              2
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-purple-900 mb-2">
                                📊 なぜ「施設内」と「法人内」の2軸で評価するの？
                              </h4>
                              <div className="bg-purple-50 p-3 rounded-lg mb-3">
                                <p className="text-sm text-purple-800 font-semibold">
                                  💡 設計意図：<span className="text-purple-600">「小さな施設でも輝く人」を見逃さないため</span>
                                </p>
                              </div>
                              <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                  <div className="p-3 bg-blue-50 rounded-lg">
                                    <h5 className="font-semibold text-blue-800 mb-1">施設内評価</h5>
                                    <p className="text-blue-700">あなたの職場での相対的な位置</p>
                                  </div>
                                  <div className="p-3 bg-green-50 rounded-lg">
                                    <h5 className="font-semibold text-green-800 mb-1">法人内評価</h5>
                                    <p className="text-green-700">法人全体での相対的な位置</p>
                                  </div>
                                </div>
                                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                                  <p className="text-amber-800">
                                    <strong>重要：</strong>小規模施設のエース職員が法人全体でも高評価を受けられる仕組み。
                                    逆に大規模施設で埋もれがちな優秀な職員も適切に評価されます。
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 重要ポイント3: 年2回+年1回のタイミング */}
                        <div className="p-4 bg-white rounded-xl border-l-4 border-green-500 shadow-sm">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                              3
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-green-900 mb-2">
                                📅 なぜ「8月・12月・3月」の3回に分けるの？
                              </h4>
                              <div className="bg-green-50 p-3 rounded-lg mb-3">
                                <p className="text-sm text-green-800 font-semibold">
                                  💡 設計意図：<span className="text-green-600">「成長の機会」と「公平性の確保」のため</span>
                                </p>
                              </div>
                              <div className="space-y-2 text-sm text-gray-700">
                                <div className="p-3 bg-blue-50 rounded-lg">
                                  <p><strong>8月・12月（貢献度）：</strong>半年ごとの成果を小刻みに評価 → モチベーション維持</p>
                                </div>
                                <div className="p-3 bg-purple-50 rounded-lg">
                                  <p><strong>3月（技術評価）：</strong>1年間の成長を総合的に評価 → 専門性の向上確認</p>
                                </div>
                                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                                  <p className="text-red-800">
                                    <strong>重要：</strong>一発勝負ではなく、複数回のチャンスで評価。
                                    夏に調子が悪くても冬に挽回可能な制度設計です。
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 重要ポイント4: 職員成長支援の視点 */}
                        <div className="p-4 bg-white rounded-xl border-l-4 border-orange-500 shadow-sm">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                              4
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-orange-900 mb-2">
                                🌱 この評価制度の最終目標は？
                              </h4>
                              <div className="bg-orange-50 p-3 rounded-lg mb-3">
                                <p className="text-sm text-orange-800 font-semibold">
                                  💡 設計意図：<span className="text-orange-600">「評価のための評価」ではなく「成長支援のツール」として</span>
                                </p>
                              </div>
                              <div className="grid grid-cols-1 gap-3 text-sm">
                                <div className="p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                                  <h5 className="font-semibold text-gray-800 mb-2">🎯 職員にとってのメリット</h5>
                                  <ul className="space-y-1 text-gray-700">
                                    <li>• 自分の強みと改善点が明確になる</li>
                                    <li>• 成長の方向性がわかる</li>
                                    <li>• 頑張りが適切に評価される</li>
                                  </ul>
                                </div>
                                <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                                  <h5 className="font-semibold text-gray-800 mb-2">🏢 組織にとってのメリット</h5>
                                  <ul className="space-y-1 text-gray-700">
                                    <li>• 優秀な職員の早期発見と育成</li>
                                    <li>• 組織全体のスキル向上</li>
                                    <li>• 公平で透明性の高い人事制度</li>
                                  </ul>
                                </div>
                                <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-300">
                                  <p className="text-yellow-800 font-semibold text-center">
                                    🌟 最終目標：「職員と組織の相互成長」
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* 3つのポイント */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-center">🎯 評価は3つのステップで決まります</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="font-bold">1</span>
                      </div>
                      <h4 className="font-semibold text-blue-800">夏の査定</h4>
                      <p className="text-sm text-gray-600">8月 / 25点</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="font-bold">2</span>
                      </div>
                      <h4 className="font-semibold text-purple-800">冬の査定</h4>
                      <p className="text-sm text-gray-600">12月 / 25点</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="font-bold">3</span>
                      </div>
                      <h4 className="font-semibold text-green-800">技術評価</h4>
                      <p className="text-sm text-gray-600">3月 / 50点</p>
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <span className="text-2xl font-bold text-orange-600">= 100点満点の年間評価</span>
                  </div>
                </div>
                    <Badge className="bg-purple-100 text-purple-800 px-3 py-1">
                      🎯 職種別カスタマイズ
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 年間実施スケジュール - タイムライン表示 */}
            <Card className="border-2 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  年間実施スケジュール
                </CardTitle>
                <CardDescription>
                  評価実施の年間タイムライン（4月〜翌年3月）
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* タイムライン */}
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                  
                  <div className="space-y-6">
                    {/* 8月: 夏季賞与査定 */}
                    <div className="flex gap-4">
                      <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-blue-500 text-white rounded-full shadow-lg">
                        <div className="text-center">
                          <div className="text-xs font-bold">8月</div>
                          <div className="text-xs">①</div>
                        </div>
                      </div>
                      <div className="flex-1 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                        <h4 className="font-semibold text-blue-900">夏季賞与査定</h4>
                        <p className="text-sm text-gray-700 mt-1">12月〜5月実績の貢献度評価</p>
                        <div className="mt-2 flex items-center gap-2">
                          <Badge className="bg-blue-100 text-blue-800">25点満点</Badge>
                          <span className="text-xs text-gray-600">施設12.5点＋法人12.5点</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* 12月: 冬季賞与査定 */}
                    <div className="flex gap-4">
                      <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-purple-500 text-white rounded-full shadow-lg">
                        <div className="text-center">
                          <div className="text-xs font-bold">12月</div>
                          <div className="text-xs">②</div>
                        </div>
                      </div>
                      <div className="flex-1 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                        <h4 className="font-semibold text-purple-900">冬季賞与査定</h4>
                        <p className="text-sm text-gray-700 mt-1">6月〜11月実績の貢献度評価</p>
                        <div className="mt-2 flex items-center gap-2">
                          <Badge className="bg-purple-100 text-purple-800">25点満点</Badge>
                          <span className="text-xs text-gray-600">施設12.5点＋法人12.5点</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* 3月: 技術評価 */}
                    <div className="flex gap-4">
                      <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-green-500 text-white rounded-full shadow-lg">
                        <div className="text-center">
                          <div className="text-xs font-bold">3月</div>
                          <div className="text-xs">③</div>
                        </div>
                      </div>
                      <div className="flex-1 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                        <h4 className="font-semibold text-green-900">技術評価実施</h4>
                        <p className="text-sm text-gray-700 mt-1">職種別専門技術・スキル評価</p>
                        <div className="mt-2 flex items-center gap-2">
                          <Badge className="bg-green-100 text-green-800">50点満点</Badge>
                          <span className="text-xs text-gray-600">法人統一30点＋施設特化20点</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* 年度総合評価 */}
                    <div className="flex gap-4">
                      <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-full shadow-lg">
                        <Award className="h-8 w-8" />
                      </div>
                      <div className="flex-1 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-l-4 border-orange-500">
                        <h4 className="font-semibold text-orange-900">年度総合評価確定</h4>
                        <p className="text-sm text-gray-700 mt-1">
                          貢献度評価（8月25点＋12月25点）＋ 技術評価（3月50点）
                        </p>
                        <div className="mt-2">
                          <span className="text-2xl font-bold text-orange-600">= 100点満点</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 2軸評価マトリックス - 評価結果の決定方法 */}
            <Card className="border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <BarChart3 className="h-5 w-5 text-indigo-600" />
                  2軸評価マトリックス - 総合評価の決定方法
                </CardTitle>
                <CardDescription className="text-gray-700">
                  施設内評価と法人内評価を組み合わせて、最終的な7段階評価（S+〜D）が決定されます
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* 評価ランクの説明 */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-3">各軸での評価分布（5段階）</h4>
                  <div className="grid grid-cols-5 gap-2 mb-4">
                    <div className="text-center p-3 bg-gradient-to-b from-yellow-100 to-yellow-200 rounded-lg border border-yellow-300">
                      <div className="text-2xl font-bold text-yellow-800">S</div>
                      <div className="text-xs text-gray-600">上位10%</div>
                      <div className="text-xs font-semibold">卓越</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-b from-green-100 to-green-200 rounded-lg border border-green-300">
                      <div className="text-2xl font-bold text-green-800">A</div>
                      <div className="text-xs text-gray-600">上位11-30%</div>
                      <div className="text-xs font-semibold">優秀</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-b from-blue-100 to-blue-200 rounded-lg border border-blue-300">
                      <div className="text-2xl font-bold text-blue-800">B</div>
                      <div className="text-xs text-gray-600">上位31-70%</div>
                      <div className="text-xs font-semibold">標準</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-b from-orange-100 to-orange-200 rounded-lg border border-orange-300">
                      <div className="text-2xl font-bold text-orange-800">C</div>
                      <div className="text-xs text-gray-600">上位71-90%</div>
                      <div className="text-xs font-semibold">要改善</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-b from-red-100 to-red-200 rounded-lg border border-red-300">
                      <div className="text-2xl font-bold text-red-800">D</div>
                      <div className="text-xs text-gray-600">下位10%</div>
                      <div className="text-xs font-semibold">要支援</div>
                    </div>
                  </div>
                </div>

                {/* マトリックス表 */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-3">2軸を組み合わせた総合評価マトリックス</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="border border-gray-300 p-3 bg-gray-100 text-sm">法人内＼施設内</th>
                          <th className="border border-gray-300 p-3 bg-yellow-100 text-sm font-bold">S</th>
                          <th className="border border-gray-300 p-3 bg-green-100 text-sm font-bold">A</th>
                          <th className="border border-gray-300 p-3 bg-blue-100 text-sm font-bold">B</th>
                          <th className="border border-gray-300 p-3 bg-orange-100 text-sm font-bold">C</th>
                          <th className="border border-gray-300 p-3 bg-red-100 text-sm font-bold">D</th>
                        </tr>
                      </thead>
                      <tbody className="text-center text-sm font-semibold">
                        <tr>
                          <td className="border border-gray-300 p-3 bg-yellow-100 font-bold">S</td>
                          <td className="border border-gray-300 p-3 bg-green-100 text-lg">A</td>
                          <td className="border border-gray-300 p-3 bg-green-200 text-lg">A+</td>
                          <td className="border border-gray-300 p-3 bg-yellow-100 text-lg">S</td>
                          <td className="border border-gray-300 p-3 bg-yellow-100 text-lg">S</td>
                          <td className="border border-gray-300 p-3 bg-yellow-200 text-lg font-bold">S+</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-3 bg-green-100 font-bold">A</td>
                          <td className="border border-gray-300 p-3 bg-blue-100 text-lg">B</td>
                          <td className="border border-gray-300 p-3 bg-green-100 text-lg">A</td>
                          <td className="border border-gray-300 p-3 bg-green-100 text-lg">A</td>
                          <td className="border border-gray-300 p-3 bg-green-200 text-lg">A+</td>
                          <td className="border border-gray-300 p-3 bg-yellow-100 text-lg">S</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-3 bg-blue-100 font-bold">B</td>
                          <td className="border border-gray-300 p-3 bg-orange-100 text-lg">C</td>
                          <td className="border border-gray-300 p-3 bg-blue-100 text-lg">B</td>
                          <td className="border border-gray-300 p-3 bg-blue-100 text-lg">B</td>
                          <td className="border border-gray-300 p-3 bg-green-100 text-lg">A</td>
                          <td className="border border-gray-300 p-3 bg-green-200 text-lg">A+</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-3 bg-orange-100 font-bold">C</td>
                          <td className="border border-gray-300 p-3 bg-red-100 text-lg">D</td>
                          <td className="border border-gray-300 p-3 bg-orange-100 text-lg">C</td>
                          <td className="border border-gray-300 p-3 bg-orange-100 text-lg">C</td>
                          <td className="border border-gray-300 p-3 bg-blue-100 text-lg">B</td>
                          <td className="border border-gray-300 p-3 bg-green-100 text-lg">A</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-3 bg-red-100 font-bold">D</td>
                          <td className="border border-gray-300 p-3 bg-red-200 text-lg">D</td>
                          <td className="border border-gray-300 p-3 bg-red-100 text-lg">D</td>
                          <td className="border border-gray-300 p-3 bg-orange-100 text-lg">C</td>
                          <td className="border border-gray-300 p-3 bg-orange-100 text-lg">C</td>
                          <td className="border border-gray-300 p-3 bg-blue-100 text-lg">B</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>最終評価：</strong>7段階（S+, S, A+, A, B, C, D）で総合的な評価が決定されます
                    </p>
                  </div>
                </div>

                {/* 具体例での説明 */}
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-3">評価の具体例</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-blue-100 text-blue-800">例1</Badge>
                        <span className="text-sm font-medium">小規模施設で頑張っている職員</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="text-center">
                          <p className="text-xs text-gray-600">施設内評価</p>
                          <p className="font-bold text-green-600">A</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-600">法人内評価</p>
                          <p className="font-bold text-blue-600">B</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-600">総合評価</p>
                          <p className="font-bold text-lg text-green-600">A</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-purple-100 text-purple-800">例2</Badge>
                        <span className="text-sm font-medium">法人全体で高いスキルを持つ職員</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="text-center">
                          <p className="text-xs text-gray-600">施設内評価</p>
                          <p className="font-bold text-blue-600">B</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-600">法人内評価</p>
                          <p className="font-bold text-yellow-600">S</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-600">総合評価</p>
                          <p className="font-bold text-lg text-yellow-600">S</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ステップバイステップガイド */}
            <Card className="border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-blue-600" />
                  評価制度を始めるためのステップ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { step: 1, title: '評価項目の設定', description: '技術・貢献度の評価項目を設定', link: '/evaluation-design' },
                    { step: 2, title: '評価者の指定', description: '1次・2次評価者を指定', link: '/settings/evaluators' },
                    { step: 3, title: 'スケジュール設定', description: '評価期間を設定', link: '/settings/schedule' },
                    { step: 4, title: '評価開始', description: '評価を開始し通知を送信', link: '/evaluation-execution' },
                  ].map((item) => (
                    <div key={item.step} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                        {item.step}
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-semibold">{item.title}</h4>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                      <Link href={item.link}>
                        <Button size="sm" variant="outline">
                          開始
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 2大評価フローの詳細カード */}
            <div className="grid grid-cols-2 gap-6">
              {/* 技術評価フロー */}
              <Card className="border-2 border-blue-200 hover:shadow-xl transition-all">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      ①技術評価
                    </div>
                    <Badge className="bg-blue-600 text-white">50点</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-semibold text-blue-800">3月実施（年度末評価）</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-700">職種別の専門技術・スキルを評価</p>
                    <div className="space-y-2">
                      <div className="p-2 bg-gray-50 rounded">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">法人統一項目</span>
                          <Badge variant="outline">30点</Badge>
                        </div>
                        <div className="ml-2 space-y-1">
                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <span>• C01: 専門技術・スキル</span>
                            <span>10点（上司70%/本人30%）</span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <span>• C02: 対人関係・ケア</span>
                            <span>10点（上司50%/本人50%）</span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <span>• C03: 安全・品質管理</span>
                            <span>10点（上司80%/本人20%）</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">施設特化項目</span>
                        <Badge variant="outline">20点</Badge>
                      </div>
                    </div>
                    <div className="pt-3 space-y-2">
                      <Link href="/evaluation/core-v2">
                        <Button className="w-full" size="sm" variant="outline">
                          <PlayCircle className="mr-2 h-4 w-4" />
                          新V2版で評価開始
                        </Button>
                      </Link>
                      <Link href="/evaluation/facility-specific">
                        <Button className="w-full" size="sm" variant="ghost">
                          施設特化項目を設定
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 貢献度評価フロー */}
              <Card className="border-2 border-purple-200 hover:shadow-xl transition-all">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-600" />
                      ②組織貢献度評価
                    </div>
                    <Badge className="bg-purple-600 text-white">50点</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-semibold text-purple-800">年2回実施</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 bg-white rounded">
                          <span className="font-medium">8月:</span> 夏季査定
                        </div>
                        <div className="p-2 bg-white rounded">
                          <span className="font-medium">12月:</span> 冬季査定
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">組織への貢献度を相対評価</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">施設貢献度（年間）</span>
                        <Badge variant="outline">25点</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">法人貢献度（年間）</span>
                        <Badge variant="outline">25点</Badge>
                      </div>
                    </div>
                    <div className="pt-3">
                      <Link href="/evaluation/contribution">
                        <Button className="w-full" size="sm" variant="outline">
                          <PlayCircle className="mr-2 h-4 w-4" />
                          貢献度評価を開始
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* クイックアクセスパネル */}
            <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-orange-600" />
                  クイックアクセス
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-3">
                  <Link href="/evaluation/technical">
                    <div className="p-4 bg-white rounded-lg border hover:border-orange-400 hover:shadow-md transition-all cursor-pointer text-center">
                      <Target className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                      <div className="text-sm font-medium">技術評価</div>
                      <div className="text-xs text-gray-600">年度末評価</div>
                    </div>
                  </Link>
                  <Link href="/evaluation/contribution">
                    <div className="p-4 bg-white rounded-lg border hover:border-orange-400 hover:shadow-md transition-all cursor-pointer text-center">
                      <Users className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                      <div className="text-sm font-medium">貢献度評価</div>
                      <div className="text-xs text-gray-600">賞与査定</div>
                    </div>
                  </Link>
                  <Link href="/evaluation/integrated-v2">
                    <div className="p-4 bg-white rounded-lg border hover:border-orange-400 hover:shadow-md transition-all cursor-pointer text-center">
                      <Award className="h-6 w-6 text-green-600 mx-auto mb-2" />
                      <div className="text-sm font-medium">統合評価</div>
                      <div className="text-xs text-gray-600">総合確認</div>
                    </div>
                  </Link>
                  <Link href="/evaluation/reports">
                    <div className="p-4 bg-white rounded-lg border hover:border-orange-400 hover:shadow-md transition-all cursor-pointer text-center">
                      <FileText className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                      <div className="text-sm font-medium">レポート</div>
                      <div className="text-xs text-gray-600">結果出力</div>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* 評価プロセス全体像 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ListChecks className="h-5 w-5" />
                  評価プロセス全体像
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { phase: '制度設計', icon: Settings, color: 'blue', desc: '評価項目・配点の設定' },
                    { phase: '評価実施', icon: ClipboardList, color: 'purple', desc: '自己評価・上司評価の入力' },
                    { phase: '総合判定', icon: CheckCircle, color: 'green', desc: '100点満点での最終評価' },
                    { phase: '評価開示', icon: Eye, color: 'orange', desc: '本人への評価結果通知' },
                    { phase: '異議申立', icon: MessageSquare, color: 'red', desc: '評価への異議申立対応' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className={`p-2 bg-${item.color}-100 rounded-lg`}>
                        <item.icon className={`h-4 w-4 text-${item.color}-600`} />
                      </div>
                      <div className="flex-1">
                        <span className="font-medium">{item.phase}</span>
                        <p className="text-xs text-gray-600 mt-1">{item.desc}</p>
                      </div>
                      {index < 4 && <ArrowRight className="h-4 w-4 text-gray-400" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-yellow-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-yellow-600" />
                  よくある質問（FAQ）
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    {
                      q: '評価の頻度はどのくらいですか？',
                      a: '技術評価は年1回、貢献度評価は年2回（7月・12月）実施されます。',
                      category: 'スケジュール'
                    },
                    {
                      q: '評価結果に不服がある場合は？',
                      a: '評価開示後、異議申立制度を利用して再評価を申請できます。',
                      category: '異議申立'
                    },
                    {
                      q: '評価は誰が行いますか？',
                      a: '直属の上司による1次評価と、部門長による2次評価の多段階評価を行います。',
                      category: '評価者'
                    },
                  ].map((faq, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-yellow-50 transition-colors border-l-4 border-yellow-400">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold flex items-center gap-2">
                          <span className="text-yellow-600">Q:</span> {faq.q}
                        </h4>
                        <Badge variant="outline" className="text-xs">{faq.category}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        <span className="text-green-600 font-semibold">A:</span> {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="text-center pt-4">
                  <Link href="/help">
                    <Button variant="outline">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      すべてのFAQを見る
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="space-y-6 p-6">
            {/* 進捗オーバービュー */}
            <div className="grid grid-cols-5 gap-4 mb-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <Badge className="bg-blue-600 text-white">全体</Badge>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">{completionRate}%</p>
                  <p className="text-xs text-blue-700 mt-1">全体進捗率</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <Badge className="bg-green-600 text-white">完了</Badge>
                  </div>
                  <p className="text-2xl font-bold text-green-900">{evaluationProgress.completed}</p>
                  <p className="text-xs text-green-700 mt-1">評価完了</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <Badge className="bg-yellow-600 text-white">進行中</Badge>
                  </div>
                  <p className="text-2xl font-bold text-yellow-900">{evaluationProgress.inProgress}</p>
                  <p className="text-xs text-yellow-700 mt-1">評価中</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <Badge className="bg-red-600 text-white">未開始</Badge>
                  </div>
                  <p className="text-2xl font-bold text-red-900">{evaluationProgress.notStarted}</p>
                  <p className="text-xs text-red-700 mt-1">未開始</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    <Badge className="bg-purple-600 text-white">期限</Badge>
                  </div>
                  <p className="text-2xl font-bold text-purple-900">5日</p>
                  <p className="text-xs text-purple-700 mt-1">残り日数</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <Card className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-blue-600" />
                    施設別進捗
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: '小原病院', value: 82, status: 'good' },
                      { name: '立神リハビリ', value: 68, status: 'warning' },
                      { name: 'エスポワール立神', value: 95, status: 'excellent' },
                    ].map((facility) => (
                      <div key={facility.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{facility.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold">{facility.value}%</span>
                            {facility.status === 'excellent' && <Badge className="bg-green-100 text-green-700 text-xs">優秀</Badge>}
                            {facility.status === 'warning' && <Badge className="bg-yellow-100 text-yellow-700 text-xs">注意</Badge>}
                          </div>
                        </div>
                        <Progress 
                          value={facility.value} 
                          className={`h-3 ${
                            facility.status === 'excellent' ? 'bg-green-100' : 
                            facility.status === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4" variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    詳細を見る
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-shadow border-2 border-red-200">
                <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-red-600" />
                    締切アラート
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <span className="text-sm font-bold text-red-700">本日締切</span>
                          </div>
                          <p className="text-sm text-gray-700">外科病棟 5名分</p>
                        </div>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                          対応
                        </Button>
                      </div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm font-bold text-yellow-700">3日後</span>
                          </div>
                          <p className="text-sm text-gray-700">ICU 8名分</p>
                        </div>
                        <Button size="sm" variant="outline" className="border-yellow-500 text-yellow-700">
                          確認
                        </Button>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-bold text-blue-700">7日後</span>
                          </div>
                          <p className="text-sm text-gray-700">リハビリ部門 12名分</p>
                        </div>
                        <Button size="sm" variant="ghost">
                          詳細
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    完了率トレンド
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <TrendingUp className="h-8 w-8 text-green-600" />
                        <div className="text-4xl font-bold text-green-600">+15%</div>
                      </div>
                      <p className="text-sm text-gray-600">先週比での進捗向上</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">今週</span>
                        <span className="font-bold">{completionRate}%</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">先週</span>
                        <span className="font-bold">{completionRate - 15}%</span>
                      </div>
                    </div>
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-sm">
                        このペースなら1/31までに完了予定
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>未完了リスト</CardTitle>
                <CardDescription>評価が完了していない職員一覧</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium">内科病棟</span>
                      <span className="text-sm text-gray-600 ml-3">12名未完了</span>
                    </div>
                    <Button size="sm">リマインド送信</Button>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium">外来部門</span>
                      <span className="text-sm text-gray-600 ml-3">8名未完了</span>
                    </div>
                    <Button size="sm">リマインド送信</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6 p-6">
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    評価期間設定
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">2025年度 上期評価</h4>
                    <p className="text-sm text-gray-600">期間：2025年7月1日〜7月31日</p>
                    <Button size="sm" variant="outline" className="mt-2">期間を編集</Button>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">2025年度 下期評価</h4>
                    <p className="text-sm text-gray-600">期間：2025年12月1日〜12月31日</p>
                    <Button size="sm" variant="outline" className="mt-2">期間を編集</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    評価者権限管理
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">1次評価者</span>
                      <Badge>128名</Badge>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">2次評価者</span>
                      <Badge>24名</Badge>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">最終承認者</span>
                      <Badge>8名</Badge>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">権限を管理</Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  システム設定
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">自動リマインダー</h4>
                      <p className="text-sm text-gray-600">締切3日前に自動送信</p>
                    </div>
                    <Button size="sm" variant="outline">設定</Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">メール通知</h4>
                      <p className="text-sm text-gray-600">評価完了時に通知</p>
                    </div>
                    <Button size="sm" variant="outline">設定</Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">システム連携</h4>
                      <p className="text-sm text-gray-600">研修・勤怠システムとの連携</p>
                    </div>
                    <Button size="sm" variant="outline">設定</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="space-y-6 p-6">
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    評価結果統計
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">グレード分布</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-8">S:</span>
                          <Progress value={15} className="flex-1" />
                          <span className="text-sm">15%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-8">A:</span>
                          <Progress value={35} className="flex-1" />
                          <span className="text-sm">35%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-8">B:</span>
                          <Progress value={30} className="flex-1" />
                          <span className="text-sm">30%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-8">C:</span>
                          <Progress value={15} className="flex-1" />
                          <span className="text-sm">15%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-8">D:</span>
                          <Progress value={5} className="flex-1" />
                          <span className="text-sm">5%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    前年度比較
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">平均スコア</span>
                        <span className="text-green-600 font-semibold">+3.2%</span>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">S/Aグレード率</span>
                        <span className="text-blue-600 font-semibold">+5.8%</span>
                      </div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">評価完了率</span>
                        <span className="text-yellow-600 font-semibold">-2.1%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  レポート出力
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <Button variant="outline" className="justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    評価結果一覧
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    統計レポート
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Users className="mr-2 h-4 w-4" />
                    部門別分析
                  </Button>
                </div>
              </CardContent>
            </Card>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}