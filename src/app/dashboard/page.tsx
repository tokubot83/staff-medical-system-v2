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
  ClipboardList,
  UserCheck,
  UserPlus,
  Database,
  RefreshCw,
  Eye,
  Send,
  Rocket,
  MessageSquare,
  Archive
} from 'lucide-react';

export default function DashboardPage() {
  const [evaluationProgress] = useState({
    total: 125,
    completed: 78,
    inProgress: 32,
    notStarted: 15
  });
  
  // 現在の月を取得
  const currentMonth = new Date().getMonth() + 1;
  const [activeTab, setActiveTab] = useState<'home' | 'guide' | 'progress' | 'settings' | 'reports'>('home');
  const [storyActiveTab, setStoryActiveTab] = useState<'新人' | '一般' | '中堅' | 'ベテラン' | '管理職' | '評価制度' | 'シミュレーション'>('評価制度');

  const completionRate = Math.round((evaluationProgress.completed / evaluationProgress.total) * 100);


  // 世代別ストーリータブの定義
  const storyTabs = [
    { id: '評価制度', label: '評価制度', icon: '📋', character: '制度解説' },
    { id: 'シミュレーション', label: '年間UI体験', icon: '🖥️', character: 'システム体験' },
    { id: '新人', label: '新人（1年目）', icon: '🌱', character: '田中さん' },
    { id: '一般', label: '一般（2-3年）', icon: '🌿', character: '佐藤さん' },
    { id: '中堅', label: '中堅（4-10年）', icon: '🌳', character: '山田さん' },
    { id: 'ベテラン', label: 'ベテラン（11年以上）', icon: '🎋', character: '高橋さん' },
    { id: '管理職', label: '管理職（主任・師長）', icon: '👑', character: '伊藤主任' }
  ];

  return (
    <div>
      <CommonHeader title="評価管理ダッシュボード" />
      <div className={styles.container}>
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

            {/* 最終判定カード - 3月～5月限定表示 */}
            {(currentMonth >= 3 && currentMonth <= 5) && (
              <Card className="rounded-xl border-2 border-red-500 shadow-xl hover:shadow-2xl transition-all bg-gradient-to-br from-red-600 to-orange-600 text-white relative overflow-hidden">
                <div className="absolute top-2 right-2">
                  <Badge className="bg-yellow-400 text-yellow-900">3-5月限定</Badge>
                </div>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-white/20 rounded-lg backdrop-blur">
                        <BarChart3 className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold text-white">最終判定</CardTitle>
                        <CardDescription className="text-red-100 mt-1">
                          100点満点から7段階成績を決定
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-white/10 rounded-lg backdrop-blur">
                    <h4 className="text-sm font-bold text-red-100 mb-3">処理状況：</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <p className="text-xs text-red-200">技術評価収集</p>
                        <p className="text-xl font-bold">250/500名</p>
                        <Progress value={50} className="h-2 mt-1 bg-white/20" />
                      </div>
                      <div>
                        <p className="text-xs text-red-200">暫定判定済</p>
                        <p className="text-xl font-bold">180名</p>
                        <Progress value={36} className="h-2 mt-1 bg-white/20" />
                      </div>
                      <div>
                        <p className="text-xs text-red-200">最終確定</p>
                        <p className="text-xl font-bold">0名</p>
                        <Progress value={0} className="h-2 mt-1 bg-white/20" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-white/10 rounded-lg backdrop-blur">
                    <h4 className="text-sm font-bold text-red-100 mb-2">判定プロセス：</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-300" />
                        <span>施設内相対評価（5段階）</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-300" />
                        <span>法人内相対評価（5段階）</span>
                      </div>
                      <div className="flex items-center gap-2 col-span-2">
                        <CheckCircle className="h-4 w-4 text-green-300" />
                        <span>2軸マトリックス最終判定（S+/S/A+/A/B/C/D）</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link href="/evaluation-relative-grading" className="flex-1">
                      <Button className="w-full bg-white text-red-600 hover:bg-red-50">
                        <BarChart3 className="mr-2 h-5 w-5" />
                        判定実行画面へ
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      className="text-white hover:bg-white/20"
                      title="最終判定について"
                    >
                      <HelpCircle className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

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
                    <Link href="/training-v3">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Zap className="mr-2 h-4 w-4" />
                        V3評価連動研修
                        <Badge className="ml-2 bg-purple-100 text-purple-800" variant="outline">New</Badge>
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

              {/* V3評価連動研修システム */}
              <Card className="bg-white hover:shadow-lg transition-shadow border-purple-200">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Zap className="h-5 w-5 text-purple-600" />
                    V3評価連動研修
                    <Badge className="bg-purple-100 text-purple-800" variant="outline">New</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      100点満点評価に基づく戦略的研修計画・実行支援
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-blue-50 rounded text-center">
                        <p className="text-xs text-blue-700 mb-1">技術評価</p>
                        <p className="text-sm font-bold text-blue-900">ギャップ分析</p>
                      </div>
                      <div className="p-2 bg-green-50 rounded text-center">
                        <p className="text-xs text-green-700 mb-1">組織貢献</p>
                        <p className="text-sm font-bold text-green-900">成長計画</p>
                      </div>
                    </div>
                    <Link href="/training-v3">
                      <Button className="w-full" variant="outline" size="sm">
                        <Zap className="mr-2 h-4 w-4" />
                        V3研修システム
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
            
            {/* 世代別評価ストーリー */}
            <Card className="border-2 border-indigo-300 bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <span className="text-2xl">🌟</span>
                  世代別 1年間評価ストーリー
                </CardTitle>
                <CardDescription className="text-gray-700">
                  あなたの経験年数に合わせたストーリーで、評価の流れを直感的に理解できます
                </CardDescription>
                
                {/* 世代別タブナビゲーション */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {storyTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setStoryActiveTab(tab.id)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        storyActiveTab === tab.id
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-indigo-50'
                      }`}
                    >
                      <span className="mr-1">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* 世代別ストーリーコンテンツ */}
                  {storyActiveTab === '新人' && (
                    <div>
                      <div className="mb-4 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                        <h3 className="font-semibold text-green-900">🌱 田中さん（新卒看護師・1年目）</h3>
                        <p className="text-sm text-green-700 mt-1">循環器病棟配属。基本業務を覚えながら、評価制度も一から学んでいきます。</p>
                      </div>
                      
                      {/* タイムライン形式のストーリー */}
                      <div className="relative">
                        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-indigo-300"></div>
                    
                    <div className="space-y-8">
                      {/* 4月 - 入職 */}
                      <div className="flex gap-6">
                        <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-green-500 text-white rounded-full shadow-lg">
                          <div className="text-center">
                            <div className="text-xs font-bold">4月</div>
                            <div className="text-xs">入職</div>
                          </div>
                        </div>
                        <div className="flex-1 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                          <h4 className="font-semibold text-green-900 mb-2">👋 田中さん、看護師として入職</h4>
                          <p className="text-sm text-gray-700 mb-3">
                            新卒で循環器病棟に配属された田中さん。「評価って難しそう...」と不安でしたが、
                            先輩から「年間を通じて段階的に評価されるから大丈夫よ」と教えてもらいました。
                          </p>
                          <div className="bg-white p-3 rounded border-l-4 border-green-400">
                            <div className="text-xs text-gray-600 mb-1">💭 田中さんの気持ち</div>
                            <p className="text-sm italic">"1年目は基本的な業務ができればOKなんですね。安心しました！"</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* 8月 - 夏季査定 */}
                      <div className="flex gap-6">
                        <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-blue-500 text-white rounded-full shadow-lg">
                          <div className="text-center">
                            <div className="text-xs font-bold">8月</div>
                            <div className="text-xs">夏季</div>
                          </div>
                        </div>
                        <div className="flex-1 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                          <h4 className="font-semibold text-blue-900 mb-2">⭐ 初めての組織貢献度評価</h4>
                          <p className="text-sm text-gray-700 mb-3">
                            4ヶ月経った田中さん。委員会活動や研修参加を評価されます。
                            「同期と比較されるのかな？」と心配でしたが、経験年数を考慮した評価でした。
                          </p>
                          <div className="grid grid-cols-2 gap-2 mb-3">
                            <div className="bg-white p-2 rounded text-xs">
                              <div className="font-medium text-blue-700">施設貢献度</div>
                              <div>新人指導補助: 8/12.5点</div>
                            </div>
                            <div className="bg-white p-2 rounded text-xs">
                              <div className="font-medium text-purple-700">法人貢献度</div>
                              <div>法人研修参加: 9/12.5点</div>
                            </div>
                          </div>
                          <div className="bg-white p-3 rounded border-l-4 border-blue-400">
                            <div className="text-xs text-gray-600 mb-1">💭 田中さんの気持ち</div>
                            <p className="text-sm italic">"想像していたより評価してもらえました。頑張った甲斐があった！"</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* 12月 - 冬季査定 */}
                      <div className="flex gap-6">
                        <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-purple-500 text-white rounded-full shadow-lg">
                          <div className="text-center">
                            <div className="text-xs font-bold">12月</div>
                            <div className="text-xs">冬季</div>
                          </div>
                        </div>
                        <div className="flex-1 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                          <h4 className="font-semibold text-purple-900 mb-2">📈 成長が見える中間評価</h4>
                          <p className="text-sm text-gray-700 mb-3">
                            8ヶ月目の田中さん。QC活動にも参加し、患者さんからの評価も向上。
                            成長が数字に表れて、上司からも「この調子で頑張って」と励まされました。
                          </p>
                          <div className="grid grid-cols-2 gap-2 mb-3">
                            <div className="bg-white p-2 rounded text-xs">
                              <div className="font-medium text-blue-700">施設貢献度</div>
                              <div>QC活動参加: 10/12.5点</div>
                            </div>
                            <div className="bg-white p-2 rounded text-xs">
                              <div className="font-medium text-purple-700">法人貢献度</div>
                              <div>他部署応援: 11/12.5点</div>
                            </div>
                          </div>
                          <div className="bg-white p-3 rounded border-l-4 border-purple-400">
                            <div className="text-xs text-gray-600 mb-1">💭 田中さんの気持ち</div>
                            <p className="text-sm italic">"夏より点数が上がってる！努力が認められて嬉しいです。"</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* 3月 - 技術評価 */}
                      <div className="flex gap-6">
                        <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-orange-500 text-white rounded-full shadow-lg">
                          <div className="text-center">
                            <div className="text-xs font-bold">3月</div>
                            <div className="text-xs">技術</div>
                          </div>
                        </div>
                        <div className="flex-1 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                          <h4 className="font-semibold text-orange-900 mb-2">🎯 1年目の技術評価</h4>
                          <p className="text-sm text-gray-700 mb-3">
                            ついに年度末の技術評価。1年前は何もできなかった田中さんも、
                            今では患者ケアから医療安全まで、一人前の看護師として評価されました。
                          </p>
                          <div className="grid grid-cols-2 gap-2 mb-3">
                            <div className="bg-white p-2 rounded text-xs">
                              <div className="font-medium text-green-700">法人統一項目</div>
                              <div>基本技術: 22/30点</div>
                            </div>
                            <div className="bg-white p-2 rounded text-xs">
                              <div className="font-medium text-blue-700">施設特化項目</div>
                              <div>循環器ケア: 15/20点</div>
                            </div>
                          </div>
                          <div className="bg-white p-3 rounded border-l-4 border-orange-400">
                            <div className="text-xs text-gray-600 mb-1">💭 田中さんの気持ち</div>
                            <p className="text-sm italic">"1年前の自分と比べて、本当に成長したなあ。来年はもっと頑張ろう！"</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* 4月 - 総合評価発表（2軸評価プロセス） */}
                      <div className="flex gap-6">
                        <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-yellow-500 text-white rounded-full shadow-lg">
                          <div className="text-center">
                            <div className="text-xs font-bold">4月</div>
                            <div className="text-xs">結果</div>
                          </div>
                        </div>
                        <div className="flex-1 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                          <h4 className="font-semibold text-yellow-900 mb-2">🏆 田中さんの総合評価が決定！</h4>
                          <p className="text-sm text-gray-700 mb-3">
                            人事部から届いた評価結果。田中さんの75点がどう評価されるのか...ドキドキの瞬間です。
                          </p>
                          
                          {/* ステップ1: 100点満点の集計 */}
                          <div className="bg-white p-3 rounded mb-3 border-2 border-orange-200">
                            <div className="text-xs font-semibold text-orange-700 mb-2">📊 STEP 1: 100点満点での集計</div>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div className="text-center">
                                <div className="font-medium">技術評価</div>
                                <div className="text-lg font-bold text-orange-600">37/50</div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium">施設貢献</div>
                                <div className="text-lg font-bold text-blue-600">18/25</div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium">法人貢献</div>
                                <div className="text-lg font-bold text-purple-600">20/25</div>
                              </div>
                            </div>
                            <div className="mt-2 text-center">
                              <div className="text-xl font-bold text-gray-800">合計 75/100点</div>
                            </div>
                          </div>
                          
                          {/* ステップ2: 施設内評価 */}
                          <div className="bg-white p-3 rounded mb-3 border-2 border-blue-200">
                            <div className="text-xs font-semibold text-blue-700 mb-2">🏥 STEP 2: 施設内評価（同職種での順位）</div>
                            <p className="text-xs text-gray-700 mb-2">
                              田中さんの勤務する「厚生会中央病院」の看護師150名中...
                              <span className="text-xs text-blue-600 block mt-1">
                                ※病棟単位ではなく施設全体の同職種で順位化。経験年数調整済みの評価で公平に比較
                              </span>
                            </p>
                            <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                              <div className="text-sm">
                                <span className="font-bold text-blue-800">75点 = 第42位</span>
                                <span className="text-xs text-gray-600 ml-2">（上位28%）</span>
                              </div>
                              <div className="text-lg font-bold text-green-600 px-3 py-1 bg-white rounded">A評価</div>
                            </div>
                            <div className="mt-2 text-xs text-gray-600">
                              💭 "施設全体の看護師150名の中で上位30%以内！ベテランの先輩たちと比べても頑張れてる！"
                            </div>
                          </div>
                          
                          {/* ステップ3: 法人内評価 */}
                          <div className="bg-white p-3 rounded mb-3 border-2 border-purple-200">
                            <div className="text-xs font-semibold text-purple-700 mb-2">🏢 STEP 3: 法人内評価（法人全体での順位）</div>
                            <p className="text-xs text-gray-700 mb-2">
                              厚生会グループ全体の看護師300名中...
                              <span className="text-xs text-purple-600 block mt-1">
                                ※経験年数ごとに調整された評価シートを使用しているので、1年目もベテランも同じ土俵で公平に評価されます
                              </span>
                            </p>
                            <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                              <div className="text-sm">
                                <span className="font-bold text-purple-800">75点 = 第85位</span>
                                <span className="text-xs text-gray-600 ml-2">（上位28%）</span>
                              </div>
                              <div className="text-lg font-bold text-green-600 px-3 py-1 bg-white rounded">A評価</div>
                            </div>
                            <div className="mt-2 text-xs text-gray-600">
                              💭 "すごい！ベテランの先輩たちも含めた中で上位30%に入れた！評価シートが経験年数で調整されてるから1年目でも正当に評価してもらえるんだ！"
                            </div>
                          </div>
                          
                          {/* ステップ4: 2軸マトリックスによる最終評価 */}
                          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-3 rounded mb-3 border-2 border-yellow-400">
                            <div className="text-xs font-semibold text-orange-800 mb-2">✨ STEP 4: 2軸評価マトリックスで最終決定</div>
                            <div className="grid grid-cols-2 gap-4 mb-3">
                              <div className="text-center">
                                <div className="text-xs text-gray-600">施設内評価</div>
                                <div className="text-2xl font-bold text-green-600">A</div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs text-gray-600">法人内評価</div>
                                <div className="text-2xl font-bold text-green-600">A</div>
                              </div>
                            </div>
                            <div className="text-center p-3 bg-white rounded">
                              <div className="text-xs text-gray-600 mb-1">マトリックス判定</div>
                              <div className="text-3xl font-bold text-yellow-600">A+評価</div>
                              <div className="text-xs text-gray-700 mt-1">
                                施設内A × 法人内A = 総合A+評価
                              </div>
                            </div>
                            <div className="mt-2 p-2 bg-green-50 rounded text-xs">
                              <span className="font-semibold text-green-800">評価の意味：</span>
                              <span className="text-green-700">
                                「配属施設でも法人全体でも優秀層。両方の環境で高い成果を発揮できている」
                              </span>
                            </div>
                          </div>
                          
                          <div className="bg-white p-3 rounded border-l-4 border-yellow-400">
                            <div className="text-xs text-gray-600 mb-1">💭 田中さんの最終的な気持ち</div>
                            <p className="text-sm italic">
                              "なるほど！私の75点は施設内では150名中42位でA評価、法人全体でも300名中85位でA評価。
                              この2つを組み合わせて最終的にA+評価になったんだ！
                              経験年数で調整された評価シートのおかげで、1年目でもベテランと同じ土俵で評価してもらえて、
                              施設規模の違いも2軸評価で公平に考慮されてる。すごく納得できる制度だなあ。"
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                      {/* まとめ */}
                      <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-lg border-2 border-green-300">
                        <h4 className="font-semibold text-green-800 mb-2">🎓 田中さんから後輩へのメッセージ</h4>
                        <p className="text-sm text-gray-700 italic">
                          "最初は難しそうに見えた評価制度も、実際は自分の成長を確認できる良い機会でした。
                          年間を通じて段階的に評価されるので、焦らず一歩ずつ成長していけば大丈夫です！"
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 一般（2-3年目）佐藤さんのストーリー */}
                  {storyActiveTab === '一般' && (
                    <div>
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                        <h3 className="font-semibold text-blue-900">🌿 佐藤さん（一般看護師・3年目）</h3>
                        <p className="text-sm text-blue-700 mt-1">循環器病棟所属。プリセプター業務開始と専門性向上の年です。</p>
                      </div>
                      
                      {/* タイムライン形式のストーリー */}
                      <div className="relative">
                        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-300"></div>
                    
                        <div className="space-y-8">
                          {/* 4月 - プリセプター任命 */}
                          <div className="flex gap-6">
                            <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-blue-500 text-white rounded-full shadow-lg">
                              <div className="text-center">
                                <div className="text-xs font-bold">4月</div>
                                <div className="text-xs">任命</div>
                              </div>
                            </div>
                            <div className="flex-1 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                              <h4 className="font-semibold text-blue-900 mb-2">👩‍🏫 初めてのプリセプター任命</h4>
                              <p className="text-sm text-gray-700 mb-3">
                                3年目になった佐藤さん、ついにプリセプターに任命されました。
                                「新人の田中さんを担当することになったけど、ちゃんと指導できるかな...」と不安もあります。
                              </p>
                              <div className="bg-white p-3 rounded border-l-4 border-blue-400">
                                <div className="text-xs text-gray-600 mb-1">💭 佐藤さんの気持ち</div>
                                <p className="text-sm italic">"2年前の自分を思い出すな。あの時の先輩のように、温かく指導したい。でも評価にも影響するから責任重大..."</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* 6月 - 指導スキル向上 */}
                          <div className="flex gap-6">
                            <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-green-500 text-white rounded-full shadow-lg">
                              <div className="text-center">
                                <div className="text-xs font-bold">6月</div>
                                <div className="text-xs">成長</div>
                              </div>
                            </div>
                            <div className="flex-1 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                              <h4 className="font-semibold text-green-900 mb-2">📈 指導スキルの成長を実感</h4>
                              <p className="text-sm text-gray-700 mb-3">
                                田中さんの成長を見て、佐藤さん自身も指導の楽しさを実感。
                                師長から「佐藤さんの指導で田中さんがすごく伸びてる」と褒められました。
                              </p>
                              <div className="bg-white p-3 rounded border-l-4 border-green-400">
                                <div className="text-xs text-gray-600 mb-1">💭 佐藤さんの気持ち</div>
                                <p className="text-sm italic">"田中さんが頑張ってくれているおかげで、私も教えることの意味を学んでいる。これも評価につながりそう！"</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* 8月 - 夏季査定（組織貢献度） */}
                          <div className="flex gap-6">
                            <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-purple-500 text-white rounded-full shadow-lg">
                              <div className="text-center">
                                <div className="text-xs font-bold">8月</div>
                                <div className="text-xs">夏季</div>
                              </div>
                            </div>
                            <div className="flex-1 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                              <h4 className="font-semibold text-purple-900 mb-2">⭐ 指導者としての組織貢献度評価</h4>
                              <p className="text-sm text-gray-700 mb-3">
                                プリセプター業務が初めて評価対象に。新人教育プログラム改善提案も提出し、
                                「3年目で既にこれだけの視点を持っている」と高く評価されました。
                              </p>
                              <div className="grid grid-cols-2 gap-2 mb-3">
                                <div className="bg-white p-2 rounded text-xs">
                                  <div className="font-medium text-blue-700">施設貢献度</div>
                                  <div>新人教育指導: 11/12.5点</div>
                                </div>
                                <div className="bg-white p-2 rounded text-xs">
                                  <div className="font-medium text-purple-700">法人貢献度</div>
                                  <div>教育改善提案: 10.5/12.5点</div>
                                </div>
                              </div>
                              <div className="bg-white p-3 rounded border-l-4 border-purple-400">
                                <div className="text-xs text-gray-600 mb-1">💭 佐藤さんの気持ち</div>
                                <p className="text-sm italic">"指導業務も評価してもらえるんですね。田中さんと一緒に頑張った甲斐があった！"</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* 10月 - 専門研修受講 */}
                          <div className="flex gap-6">
                            <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-indigo-500 text-white rounded-full shadow-lg">
                              <div className="text-center">
                                <div className="text-xs font-bold">10月</div>
                                <div className="text-xs">研修</div>
                              </div>
                            </div>
                            <div className="flex-1 p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-500">
                              <h4 className="font-semibold text-indigo-900 mb-2">📚 循環器専門研修を受講</h4>
                              <p className="text-sm text-gray-700 mb-3">
                                循環器専門看護の認定研修に参加。3年目になり専門性も求められるように。
                                「一般職員として技術面でも一段階上を目指したい」と意欲を燃やします。
                              </p>
                              <div className="bg-white p-3 rounded border-l-4 border-indigo-400">
                                <div className="text-xs text-gray-600 mb-1">💭 佐藤さんの気持ち</div>
                                <p className="text-sm italic">"指導だけでなく、自分の専門技術もレベルアップしないと。来年の技術評価が楽しみです！"</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* 12月 - 冬季査定 */}
                          <div className="flex gap-6">
                            <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-orange-500 text-white rounded-full shadow-lg">
                              <div className="text-center">
                                <div className="text-xs font-bold">12月</div>
                                <div className="text-xs">冬季</div>
                              </div>
                            </div>
                            <div className="flex-1 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                              <h4 className="font-semibold text-orange-900 mb-2">📈 指導成果が数字に表れる</h4>
                              <p className="text-sm text-gray-700 mb-3">
                                担当した田中さんの成長が素晴らしく、師長から「佐藤さんの指導力が光っている」と評価。
                                QC活動でも新人教育改善の発表を行い、法人内でも注目されました。
                              </p>
                              <div className="grid grid-cols-2 gap-2 mb-3">
                                <div className="bg-white p-2 rounded text-xs">
                                  <div className="font-medium text-blue-700">施設貢献度</div>
                                  <div>指導成果実績: 12/12.5点</div>
                                </div>
                                <div className="bg-white p-2 rounded text-xs">
                                  <div className="font-medium text-purple-700">法人貢献度</div>
                                  <div>QC発表評価: 11.5/12.5点</div>
                                </div>
                              </div>
                              <div className="bg-white p-3 rounded border-l-4 border-orange-400">
                                <div className="text-xs text-gray-600 mb-1">💭 佐藤さんの気持ち</div>
                                <p className="text-sm italic">"夏より点数が上がってる！田中さんの頑張りが私の評価にもつながった。win-winの関係っていいなあ。"</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* 3月 - 技術評価 */}
                          <div className="flex gap-6">
                            <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-red-500 text-white rounded-full shadow-lg">
                              <div className="text-center">
                                <div className="text-xs font-bold">3月</div>
                                <div className="text-xs">技術</div>
                              </div>
                            </div>
                            <div className="flex-1 p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                              <h4 className="font-semibold text-red-900 mb-2">🎯 3年目の技術評価</h4>
                              <p className="text-sm text-gray-700 mb-3">
                                3年目の佐藤さんは技術評価でも大きく成長。プリセプター業務を通じて教える立場になったことで、
                                自分の技術も客観視できるようになり、より高いレベルに到達しました。
                              </p>
                              <div className="grid grid-cols-2 gap-2 mb-3">
                                <div className="bg-white p-2 rounded text-xs">
                                  <div className="font-medium text-green-700">法人統一項目</div>
                                  <div>技術+指導力: 42/50点</div>
                                </div>
                                <div className="bg-white p-2 rounded text-xs">
                                  <div className="font-medium text-blue-700">施設特化項目</div>
                                  <div>循環器専門: 16/20点</div>
                                </div>
                              </div>
                              <div className="bg-white p-3 rounded border-l-4 border-red-400">
                                <div className="text-xs text-gray-600 mb-1">💭 佐藤さんの気持ち</div>
                                <p className="text-sm italic">"人に教えることで自分も成長できた1年でした。技術評価も去年より確実にアップしている！"</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* 4月 - 総合評価発表（2軸評価プロセス） */}
                          <div className="flex gap-6">
                            <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-yellow-500 text-white rounded-full shadow-lg">
                              <div className="text-center">
                                <div className="text-xs font-bold">4月</div>
                                <div className="text-xs">結果</div>
                              </div>
                            </div>
                            <div className="flex-1 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                              <h4 className="font-semibold text-yellow-900 mb-2">🏆 佐藤さんの総合評価が決定！</h4>
                              <p className="text-sm text-gray-700 mb-3">
                                プリセプターとしての指導成果と専門技術の向上が評価された佐藤さん。82点という高得点をどう評価されるのでしょうか。
                              </p>
                              
                              {/* ステップ1: 100点満点の集計 */}
                              <div className="bg-white p-3 rounded mb-3 border-2 border-orange-200">
                                <div className="text-xs font-semibold text-orange-700 mb-2">📊 STEP 1: 100点満点での集計</div>
                                <div className="grid grid-cols-3 gap-2 text-xs">
                                  <div className="text-center">
                                    <div className="font-medium">技術評価</div>
                                    <div className="text-lg font-bold text-orange-600">42/50</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-medium">施設貢献</div>
                                    <div className="text-lg font-bold text-blue-600">23/25</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-medium">法人貢献</div>
                                    <div className="text-lg font-bold text-purple-600">22/25</div>
                                  </div>
                                </div>
                                <div className="mt-2 text-center">
                                  <div className="text-xl font-bold text-gray-800">合計 82/100点</div>
                                </div>
                              </div>
                              
                              {/* ステップ2: 施設内評価 */}
                              <div className="bg-white p-3 rounded mb-3 border-2 border-blue-200">
                                <div className="text-xs font-semibold text-blue-700 mb-2">🏥 STEP 2: 施設内評価（同職種での順位）</div>
                                <p className="text-xs text-gray-700 mb-2">
                                  佐藤さんの勤務する「厚生会中央病院」の看護師150名中...
                                  <span className="text-xs text-blue-600 block mt-1">
                                    ※3年目として適正な評価シートで評価。新人時代の田中さんより高い要求水準で公平に比較
                                  </span>
                                </p>
                                <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                                  <div className="text-sm">
                                    <span className="font-bold text-blue-800">82点 = 第12位</span>
                                    <span className="text-xs text-gray-600 ml-2">（上位8%）</span>
                                  </div>
                                  <div className="text-lg font-bold text-yellow-600 px-3 py-1 bg-white rounded">S評価</div>
                                </div>
                                <div className="mt-2 text-xs text-gray-600">
                                  💭 "すごい！施設内で上位8%に入った！プリセプター業務が高く評価されたんだ！"
                                </div>
                              </div>
                              
                              {/* ステップ3: 法人内評価 */}
                              <div className="bg-white p-3 rounded mb-3 border-2 border-purple-200">
                                <div className="text-xs font-semibold text-purple-700 mb-2">🏢 STEP 3: 法人内評価（法人全体での順位）</div>
                                <p className="text-xs text-gray-700 mb-2">
                                  厚生会グループ全体の看護師300名中...
                                  <span className="text-xs text-purple-600 block mt-1">
                                    ※指導実績と専門研修参加が法人レベルでも評価される仕組み
                                  </span>
                                </p>
                                <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                                  <div className="text-sm">
                                    <span className="font-bold text-purple-800">82点 = 第48位</span>
                                    <span className="text-xs text-gray-600 ml-2">（上位16%）</span>
                                  </div>
                                  <div className="text-lg font-bold text-green-600 px-3 py-1 bg-white rounded">A評価</div>
                                </div>
                                <div className="mt-2 text-xs text-gray-600">
                                  💭 "法人全体でも上位16%！他の施設のベテラン看護師と比べても十分通用するレベルになった！"
                                </div>
                              </div>
                              
                              {/* ステップ4: 2軸マトリックスによる最終評価 */}
                              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-3 rounded mb-3 border-2 border-yellow-400">
                                <div className="text-xs font-semibold text-orange-800 mb-2">✨ STEP 4: 2軸評価マトリックスで最終決定</div>
                                <div className="grid grid-cols-2 gap-4 mb-3">
                                  <div className="text-center">
                                    <div className="text-xs text-gray-600">施設内評価</div>
                                    <div className="text-2xl font-bold text-yellow-600">S</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-xs text-gray-600">法人内評価</div>
                                    <div className="text-2xl font-bold text-green-600">A</div>
                                  </div>
                                </div>
                                <div className="text-center p-3 bg-white rounded">
                                  <div className="text-xs text-gray-600 mb-1">マトリックス判定</div>
                                  <div className="text-3xl font-bold text-yellow-600">S評価</div>
                                  <div className="text-xs text-gray-700 mt-1">
                                    施設内S × 法人内A = 総合S評価
                                  </div>
                                </div>
                                <div className="mt-2 p-2 bg-yellow-50 rounded text-xs">
                                  <span className="font-semibold text-yellow-800">評価の意味：</span>
                                  <span className="text-yellow-700">
                                    「職場では超優秀、法人全体でも優秀層。3年目としては申し分ない成長」
                                  </span>
                                </div>
                              </div>
                              
                              <div className="bg-white p-3 rounded border-l-4 border-yellow-400">
                                <div className="text-xs text-gray-600 mb-1">💭 佐藤さんの気持ち</div>
                                <p className="text-sm italic">
                                  "S評価！田中さんを指導したことで自分も大きく成長できた1年でした。
                                  来年はもっと専門性を高めて、認定看護師を目指してみようかな。
                                  教えることと学ぶことの両立ができるようになったのが一番の成果です！"
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 中堅（4-10年目）山田さんのストーリー */}
                  {storyActiveTab === '中堅' && (
                    <div>
                      <div className="mb-4 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                        <h3 className="font-semibold text-green-900">🌳 山田さん（中堅看護師・7年目）</h3>
                        <p className="text-sm text-green-700 mt-1">循環器病棟所属。認定看護師として専門性とリーダーシップを発揮中です。</p>
                      </div>
                      
                      {/* タイムライン形式のストーリー */}
                      <div className="relative">
                        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-green-300"></div>
                        
                        <div className="space-y-8">
                          {/* 4月 - リーダーナース任命 */}
                          <div className="flex gap-6">
                            <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-green-500 text-white rounded-full shadow-lg">
                              <div className="text-center">
                                <div className="text-xs font-bold">4月</div>
                                <div className="text-xs">昇格</div>
                              </div>
                            </div>
                            <div className="flex-1 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                              <h4 className="font-semibold text-green-900 mb-2">🎖️ リーダーナースに昇格</h4>
                              <p className="text-sm text-gray-700 mb-3">
                                7年目の山田さん、ついにリーダーナースに昇格しました。
                                病棟全体のマネジメントと、複数のプリセプターの統括が新たな任務です。
                                「責任は重いけれど、やりがいもその分大きい」と意気込んでいます。
                              </p>
                              <div className="bg-white p-3 rounded border-l-4 border-green-400">
                                <div className="text-xs text-gray-600 mb-1">💭 山田さんの気持ち</div>
                                <p className="text-sm italic">"新人だった自分がリーダーに...。今度は病棟全体を見渡して、みんなが成長できる環境を作りたい。"</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* 5月 - 認定看護師資格挑戦 */}
                          <div className="flex gap-6">
                            <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-purple-500 text-white rounded-full shadow-lg">
                              <div className="text-center">
                                <div className="text-xs font-bold">5月</div>
                                <div className="text-xs">挑戦</div>
                              </div>
                            </div>
                            <div className="flex-1 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                              <h4 className="font-semibold text-purple-900 mb-2">📚 循環器認定看護師資格に挑戦</h4>
                              <p className="text-sm text-gray-700 mb-3">
                                リーダー業務と並行して、循環器認定看護師の資格取得を目指すことに。
                                法人からも「将来の専門看護師候補」として期待され、研修費用もサポートしてもらえました。
                              </p>
                              <div className="bg-white p-3 rounded border-l-4 border-purple-400">
                                <div className="text-xs text-gray-600 mb-1">💭 山田さんの気持ち</div>
                                <p className="text-sm italic">"リーダー業務も大変だけど、専門性も極めたい。法人も応援してくれているし、頑張らないと！"</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* 7月 - QC活動リーダー任命 */}
                          <div className="flex gap-6">
                            <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-blue-500 text-white rounded-full shadow-lg">
                              <div className="text-center">
                                <div className="text-xs font-bold">7月</div>
                                <div className="text-xs">QC</div>
                              </div>
                            </div>
                            <div className="flex-1 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                              <h4 className="font-semibold text-blue-900 mb-2">🔬 病棟QC活動リーダーに任命</h4>
                              <p className="text-sm text-gray-700 mb-3">
                                病棟の医療安全向上QC活動のリーダーに任命された山田さん。
                                「インシデント削減プロジェクト」を立ち上げ、他職種とのチーム医療も統括します。
                              </p>
                              <div className="bg-white p-3 rounded border-l-4 border-blue-400">
                                <div className="text-xs text-gray-600 mb-1">💭 山田さんの気持ち</div>
                                <p className="text-sm italic">"看護師だけでなく、医師、薬剤師、検査技師みんなと連携するのは初めて。でも患者さんのためになる！"</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* 8月 - 夏季査定（組織貢献度） */}
                          <div className="flex gap-6">
                            <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-orange-500 text-white rounded-full shadow-lg">
                              <div className="text-center">
                                <div className="text-xs font-bold">8月</div>
                                <div className="text-xs">夏季</div>
                              </div>
                            </div>
                            <div className="flex-1 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                              <h4 className="font-semibold text-orange-900 mb-2">⭐ リーダーとしての組織貢献度評価</h4>
                              <p className="text-sm text-gray-700 mb-3">
                                リーダーナースとしての初の評価。プリセプター統括、QC活動立ち上げ、
                                他職種連携の構築など、多岐にわたる貢献が認められました。
                              </p>
                              <div className="grid grid-cols-2 gap-2 mb-3">
                                <div className="bg-white p-2 rounded text-xs">
                                  <div className="font-medium text-blue-700">施設貢献度</div>
                                  <div>リーダー業務統括: 12/12.5点</div>
                                </div>
                                <div className="bg-white p-2 rounded text-xs">
                                  <div className="font-medium text-purple-700">法人貢献度</div>
                                  <div>多職種連携構築: 11/12.5点</div>
                                </div>
                              </div>
                              <div className="bg-white p-3 rounded border-l-4 border-orange-400">
                                <div className="text-xs text-gray-600 mb-1">💭 山田さんの気持ち</div>
                                <p className="text-sm italic">"リーダー業務が評価されて嬉しい！QC活動も他職種の方々から好評で、やってて良かった。"</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* 10月 - 認定看護師資格取得 */}
                          <div className="flex gap-6">
                            <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-yellow-500 text-white rounded-full shadow-lg">
                              <div className="text-center">
                                <div className="text-xs font-bold">10月</div>
                                <div className="text-xs">合格</div>
                              </div>
                            </div>
                            <div className="flex-1 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                              <h4 className="font-semibold text-yellow-900 mb-2">🎓 循環器認定看護師資格取得！</h4>
                              <p className="text-sm text-gray-700 mb-3">
                                ついに循環器認定看護師の資格を取得した山田さん。
                                法人内でも数少ない認定看護師として、今後は法人全体の教育にも参画することに。
                              </p>
                              <div className="bg-white p-3 rounded border-l-4 border-yellow-400">
                                <div className="text-xs text-gray-600 mb-1">💭 山田さんの気持ち</div>
                                <p className="text-sm italic">"やった！これで専門性に自信が持てる。法人の他の病院でも研修講師をやってみたいな。"</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* 11月 - 法人内研修講師デビュー */}
                          <div className="flex gap-6">
                            <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-indigo-500 text-white rounded-full shadow-lg">
                              <div className="text-center">
                                <div className="text-xs font-bold">11月</div>
                                <div className="text-xs">講師</div>
                              </div>
                            </div>
                            <div className="flex-1 p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-500">
                              <h4 className="font-semibold text-indigo-900 mb-2">👩‍🏫 法人内研修講師デビュー</h4>
                              <p className="text-sm text-gray-700 mb-3">
                                認定看護師として初の法人内研修講師を担当。
                                他施設の看護師30名を対象とした「循環器看護の最新技術」研修で大好評でした。
                              </p>
                              <div className="bg-white p-3 rounded border-l-4 border-indigo-400">
                                <div className="text-xs text-gray-600 mb-1">💭 山田さんの気持ち</div>
                                <p className="text-sm italic">"法人内の他の病院の看護師さんたちとも繋がりができた。これが法人貢献ってことなのかな。"</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* 12月 - 冬季査定 */}
                          <div className="flex gap-6">
                            <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-red-500 text-white rounded-full shadow-lg">
                              <div className="text-center">
                                <div className="text-xs font-bold">12月</div>
                                <div className="text-xs">冬季</div>
                              </div>
                            </div>
                            <div className="flex-1 p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                              <h4 className="font-semibold text-red-900 mb-2">📈 専門性と指導力の飛躍的向上</h4>
                              <p className="text-sm text-gray-700 mb-3">
                                認定看護師資格取得と法人内研修講師実績が評価に大きく影響。
                                QC活動の成果も数値で表れ、インシデント発生率を20%削減しました。
                              </p>
                              <div className="grid grid-cols-2 gap-2 mb-3">
                                <div className="bg-white p-2 rounded text-xs">
                                  <div className="font-medium text-blue-700">施設貢献度</div>
                                  <div>QC活動成果: 12.5/12.5点</div>
                                </div>
                                <div className="bg-white p-2 rounded text-xs">
                                  <div className="font-medium text-purple-700">法人貢献度</div>
                                  <div>法人研修講師: 12/12.5点</div>
                                </div>
                              </div>
                              <div className="bg-white p-3 rounded border-l-4 border-red-400">
                                <div className="text-xs text-gray-600 mb-1">💭 山田さんの気持ち</div>
                                <p className="text-sm italic">"夏より更に点数アップ！認定看護師になって本当に良かった。法人への貢献も実感できる。"</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* 3月 - 技術評価 */}
                          <div className="flex gap-6">
                            <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-purple-600 text-white rounded-full shadow-lg">
                              <div className="text-center">
                                <div className="text-xs font-bold">3月</div>
                                <div className="text-xs">技術</div>
                              </div>
                            </div>
                            <div className="flex-1 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                              <h4 className="font-semibold text-purple-900 mb-2">🎯 中堅としての技術評価</h4>
                              <p className="text-sm text-gray-700 mb-3">
                                認定看護師として高度な専門技術を習得し、リーダーとしての統括力も評価対象に。
                                7年目の山田さんは技術評価でも飛躍的な成長を見せました。
                              </p>
                              <div className="grid grid-cols-2 gap-2 mb-3">
                                <div className="bg-white p-2 rounded text-xs">
                                  <div className="font-medium text-green-700">法人統一項目</div>
                                  <div>高度技術+教育: 46/50点</div>
                                </div>
                                <div className="bg-white p-2 rounded text-xs">
                                  <div className="font-medium text-blue-700">施設特化項目</div>
                                  <div>専門資格活用: 18/20点</div>
                                </div>
                              </div>
                              <div className="bg-white p-3 rounded border-l-4 border-purple-400">
                                <div className="text-xs text-gray-600 mb-1">💭 山田さんの気持ち</div>
                                <p className="text-sm italic">"認定看護師として技術面でも大きく成長できた1年。リーダー業務と専門性の両立ができている！"</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* 4月 - 総合評価発表（2軸評価プロセス） */}
                          <div className="flex gap-6">
                            <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-yellow-500 text-white rounded-full shadow-lg">
                              <div className="text-center">
                                <div className="text-xs font-bold">4月</div>
                                <div className="text-xs">結果</div>
                              </div>
                            </div>
                            <div className="flex-1 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                              <h4 className="font-semibold text-yellow-900 mb-2">🏆 山田さんの総合評価が決定！</h4>
                              <p className="text-sm text-gray-700 mb-3">
                                リーダー業務、認定看護師資格取得、法人研修講師、QC活動成果...
                                すべてが評価に反映された山田さん。88点の高得点はどう評価されるのでしょうか。
                              </p>
                              
                              {/* ステップ1: 100点満点の集計 */}
                              <div className="bg-white p-3 rounded mb-3 border-2 border-orange-200">
                                <div className="text-xs font-semibold text-orange-700 mb-2">📊 STEP 1: 100点満点での集計</div>
                                <div className="grid grid-cols-3 gap-2 text-xs">
                                  <div className="text-center">
                                    <div className="font-medium">技術評価</div>
                                    <div className="text-lg font-bold text-orange-600">46/50</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-medium">施設貢献</div>
                                    <div className="text-lg font-bold text-blue-600">24.5/25</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-medium">法人貢献</div>
                                    <div className="text-lg font-bold text-purple-600">23/25</div>
                                  </div>
                                </div>
                                <div className="mt-2 text-center">
                                  <div className="text-xl font-bold text-gray-800">合計 88/100点</div>
                                </div>
                              </div>
                              
                              {/* ステップ2: 施設内評価 */}
                              <div className="bg-white p-3 rounded mb-3 border-2 border-blue-200">
                                <div className="text-xs font-semibold text-blue-700 mb-2">🏥 STEP 2: 施設内評価（同職種での順位）</div>
                                <p className="text-xs text-gray-700 mb-2">
                                  山田さんの勤務する「厚生会中央病院」の看護師150名中...
                                  <span className="text-xs text-blue-600 block mt-1">
                                    ※7年目中堅として適正な評価シート使用。リーダー業務と専門性の両方で評価
                                  </span>
                                </p>
                                <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                                  <div className="text-sm">
                                    <span className="font-bold text-blue-800">88点 = 第22位</span>
                                    <span className="text-xs text-gray-600 ml-2">（上位15%）</span>
                                  </div>
                                  <div className="text-lg font-bold text-green-600 px-3 py-1 bg-white rounded">A評価</div>
                                </div>
                                <div className="mt-2 text-xs text-gray-600">
                                  💭 "施設内で上位15%！リーダー業務と認定看護師の専門性が認められた！"
                                </div>
                              </div>
                              
                              {/* ステップ3: 法人内評価 */}
                              <div className="bg-white p-3 rounded mb-3 border-2 border-purple-200">
                                <div className="text-xs font-semibold text-purple-700 mb-2">🏢 STEP 3: 法人内評価（法人全体での順位）</div>
                                <p className="text-xs text-gray-700 mb-2">
                                  厚生会グループ全体の看護師300名中...
                                  <span className="text-xs text-purple-600 block mt-1">
                                    ※法人研修講師実績と認定看護師資格が法人レベルで高く評価される
                                  </span>
                                </p>
                                <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                                  <div className="text-sm">
                                    <span className="font-bold text-purple-800">88点 = 第18位</span>
                                    <span className="text-xs text-gray-600 ml-2">（上位6%）</span>
                                  </div>
                                  <div className="text-lg font-bold text-yellow-600 px-3 py-1 bg-white rounded">S評価</div>
                                </div>
                                <div className="mt-2 text-xs text-gray-600">
                                  💭 "法人全体で上位6%！法人研修講師をやったことが大きく評価されたんだ！すごい！"
                                </div>
                              </div>
                              
                              {/* ステップ4: 2軸マトリックスによる最終評価 */}
                              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-3 rounded mb-3 border-2 border-yellow-400">
                                <div className="text-xs font-semibold text-orange-800 mb-2">✨ STEP 4: 2軸評価マトリックスで最終決定</div>
                                <div className="grid grid-cols-2 gap-4 mb-3">
                                  <div className="text-center">
                                    <div className="text-xs text-gray-600">施設内評価</div>
                                    <div className="text-2xl font-bold text-green-600">A</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-xs text-gray-600">法人内評価</div>
                                    <div className="text-2xl font-bold text-yellow-600">S</div>
                                  </div>
                                </div>
                                <div className="text-center p-3 bg-white rounded">
                                  <div className="text-xs text-gray-600 mb-1">マトリックス判定</div>
                                  <div className="text-3xl font-bold text-yellow-600">S評価</div>
                                  <div className="text-xs text-gray-700 mt-1">
                                    施設内A × 法人内S = 総合S評価
                                  </div>
                                </div>
                                <div className="mt-2 p-2 bg-yellow-50 rounded text-xs">
                                  <span className="font-semibold text-yellow-800">評価の意味：</span>
                                  <span className="text-yellow-700">
                                    「施設では優秀、法人全体では超優秀。中堅として理想的な成長を遂げている」
                                  </span>
                                </div>
                              </div>
                              
                              <div className="bg-white p-3 rounded border-l-4 border-yellow-400">
                                <div className="text-xs text-gray-600 mb-1">💭 山田さんの気持ち</div>
                                <p className="text-sm italic">
                                  "S評価！認定看護師として法人レベルで活動したことが評価された。
                                  7年目でここまで成長できるとは思わなかった。
                                  来年は専門看護師を目指して、さらに上を目指したいと思います！"
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ベテラン（11年以上）高橋さんのストーリー */}
                  {storyActiveTab === 'ベテラン' && (
                    <div>
                      <div className="mb-4 p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                        <h3 className="font-semibold text-purple-900">🎋 高橋さん（ベテラン看護師・15年目）</h3>
                        <p className="text-sm text-purple-700 mt-1">循環器病棟所属。専門看護師として法人全体の教育を牽引しています。</p>
                      </div>
                      
                      {/* タイムライン形式のストーリー */}
                      <div className="relative">
                        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-purple-300"></div>
                        
                        <div className="space-y-8">
                          {/* 4月 - 専門看護師として更なる発展 */}
                          <div className="flex gap-6">
                            <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-purple-500 text-white rounded-full shadow-lg">
                              <div className="text-center">
                                <div className="text-xs font-bold">4月</div>
                                <div className="text-xs">発展</div>
                              </div>
                            </div>
                            <div className="flex-1 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                              <h4 className="font-semibold text-purple-900 mb-2">🏅 法人教育担当専門看護師に就任</h4>
                              <p className="text-sm text-gray-700 mb-3">
                                15年目の高橋さん、専門看護師として法人全体の循環器看護教育を統括する役職に就任。
                                3つの病院、総勢200名の看護師の教育プログラム開発を担当することになりました。
                              </p>
                              <div className="bg-white p-3 rounded border-l-4 border-purple-400">
                                <div className="text-xs text-gray-600 mb-1">💭 高橋さんの気持ち</div>
                                <p className="text-sm italic">"15年かけて培った知識と経験を、法人全体に還元できる立場になった。責任は重いけれど、とてもやりがいを感じています。"</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* 5月 - 新人教育制度改革 */}
                          <div className="flex gap-6">
                            <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-blue-500 text-white rounded-full shadow-lg">
                              <div className="text-center">
                                <div className="text-xs font-bold">5月</div>
                                <div className="text-xs">改革</div>
                              </div>
                            </div>
                            <div className="flex-1 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                              <h4 className="font-semibold text-blue-900 mb-2">🔄 法人統一新人教育制度を構築</h4>
                              <p className="text-sm text-gray-700 mb-3">
                                各病院でバラバラだった新人教育を、高橋さん主導で統一化。
                                「どの病院でも質の高い教育を受けられるように」という理念で、標準化された教育カリキュラムを作成しました。
                              </p>
                              <div className="bg-white p-3 rounded border-l-4 border-blue-400">
                                <div className="text-xs text-gray-600 mb-1">💭 高橋さんの気持ち</div>
                                <p className="text-sm italic">"法人の未来は新人教育にかかっている。私が新人だった時に学んだことを、より良い形で次世代に伝えたい。"</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* 7月 - 学会発表・論文執筆 */}
                          <div className="flex gap-6">
                            <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-green-500 text-white rounded-full shadow-lg">
                              <div className="text-center">
                                <div className="text-xs font-bold">7月</div>
                                <div className="text-xs">学会</div>
                              </div>
                            </div>
                            <div className="flex-1 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                              <h4 className="font-semibold text-green-900 mb-2">📝 全国学会で研究発表</h4>
                              <p className="text-sm text-gray-700 mb-3">
                                「循環器看護における多職種連携の効果的実践」というテーマで全国学会で発表。
                                法人の取り組み事例が業界で注目され、他施設からの視察依頼も相次ぎました。
                              </p>
                              <div className="bg-white p-3 rounded border-l-4 border-green-400">
                                <div className="text-xs text-gray-600 mb-1">💭 高橋さんの気持ち</div>
                                <p className="text-sm italic">"私たちの取り組みが全国レベルで評価された。法人の名前を広められて嬉しい！"</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* 8月 - 夏季査定（組織貢献度） */}
                          <div className="flex gap-6">
                            <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-orange-500 text-white rounded-full shadow-lg">
                              <div className="text-center">
                                <div className="text-xs font-bold">8月</div>
                                <div className="text-xs">夏季</div>
                              </div>
                            </div>
                            <div className="flex-1 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                              <h4 className="font-semibold text-orange-900 mb-2">⭐ 法人レベルでの組織貢献度評価</h4>
                              <p className="text-sm text-gray-700 mb-3">
                                法人教育担当として、新人教育制度構築と学会発表実績が評価に反映。
                                「15年目のベテランとして期待以上の成果」と経営陣からも高く評価されました。
                              </p>
                              <div className="grid grid-cols-2 gap-2 mb-3">
                                <div className="bg-white p-2 rounded text-xs">
                                  <div className="font-medium text-blue-700">施設貢献度</div>
                                  <div>教育制度統括: 12.5/12.5点</div>
                                </div>
                                <div className="bg-white p-2 rounded text-xs">
                                  <div className="font-medium text-purple-700">法人貢献度</div>
                                  <div>学会発表・制度改革: 12.5/12.5点</div>
                                </div>
                              </div>
                              <div className="bg-white p-3 rounded border-l-4 border-orange-400">
                                <div className="text-xs text-gray-600 mb-1">💭 高橋さんの気持ち</div>
                                <p className="text-sm italic">"満点！法人レベルでの貢献が認められて本当に嬉しい。15年間の努力が報われました。"</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* 10月 - 他施設への講師派遣 */}
                          <div className="flex gap-6">
                            <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-indigo-500 text-white rounded-full shadow-lg">
                              <div className="text-center">
                                <div className="text-xs font-bold">10月</div>
                                <div className="text-xs">講師</div>
                              </div>
                            </div>
                            <div className="flex-1 p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-500">
                              <h4 className="font-semibold text-indigo-900 mb-2">🌐 業界団体の教育委員に就任</h4>
                              <p className="text-sm text-gray-700 mb-3">
                                循環器看護学会から教育委員就任の依頼が。法人外での活動も始まり、
                                全国の看護師教育にも関わることになりました。まさにトップレベルの専門家として認められた証です。
                              </p>
                              <div className="bg-white p-3 rounded border-l-4 border-indigo-400">
                                <div className="text-xs text-gray-600 mb-1">💭 高橋さんの気持ち</div>
                                <p className="text-sm italic">"まさか全国レベルの委員になるなんて...。法人の看護師として誇らしいし、もっと頑張らなくては！"</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* 11月 - 後進育成プログラム開発 */}
                          <div className="flex gap-6">
                            <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-teal-500 text-white rounded-full shadow-lg">
                              <div className="text-center">
                                <div className="text-xs font-bold">11月</div>
                                <div className="text-xs">育成</div>
                              </div>
                            </div>
                            <div className="flex-1 p-4 bg-teal-50 rounded-lg border-l-4 border-teal-500">
                              <h4 className="font-semibold text-teal-900 mb-2">👥 次世代専門看護師育成プログラム開発</h4>
                              <p className="text-sm text-gray-700 mb-3">
                                高橋さん自身の経験を活かし、認定看護師から専門看護師へのキャリアアップを支援するプログラムを開発。
                                法人内で専門看護師を増やす取り組みをスタートしました。
                              </p>
                              <div className="bg-white p-3 rounded border-l-4 border-teal-400">
                                <div className="text-xs text-gray-600 mb-1">💭 高橋さんの気持ち</div>
                                <p className="text-sm italic">"私が専門看護師になる時に苦労した経験を活かして、後輩たちの道筋を作ってあげたい。"</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* 12月 - 冬季査定 */}
                          <div className="flex gap-6">
                            <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-red-500 text-white rounded-full shadow-lg">
                              <div className="text-center">
                                <div className="text-xs font-bold">12月</div>
                                <div className="text-xs">冬季</div>
                              </div>
                            </div>
                            <div className="flex-1 p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                              <h4 className="font-semibold text-red-900 mb-2">📈 業界レベルでの活躍が評価に反映</h4>
                              <p className="text-sm text-gray-700 mb-3">
                                学会委員就任と次世代育成プログラムが高く評価。
                                「法人の看護師として業界全体に貢献している」として、これまでにない高い評価を受けました。
                              </p>
                              <div className="grid grid-cols-2 gap-2 mb-3">
                                <div className="bg-white p-2 rounded text-xs">
                                  <div className="font-medium text-blue-700">施設貢献度</div>
                                  <div>次世代育成統括: 12.5/12.5点</div>
                                </div>
                                <div className="bg-white p-2 rounded text-xs">
                                  <div className="font-medium text-purple-700">法人貢献度</div>
                                  <div>業界委員活動: 12.5/12.5点</div>
                                </div>
                              </div>
                              <div className="bg-white p-3 rounded border-l-4 border-red-400">
                                <div className="text-xs text-gray-600 mb-1">💭 高橋さんの気持ち</div>
                                <p className="text-sm italic">"また満点！業界委員の活動も評価してもらえるなんて思わなかった。法人の理解とサポートに感謝です。"</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* 3月 - 技術評価 */}
                          <div className="flex gap-6">
                            <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-indigo-600 text-white rounded-full shadow-lg">
                              <div className="text-center">
                                <div className="text-xs font-bold">3月</div>
                                <div className="text-xs">技術</div>
                              </div>
                            </div>
                            <div className="flex-1 p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-500">
                              <h4 className="font-semibold text-indigo-900 mb-2">🎯 ベテランとしての技術評価</h4>
                              <p className="text-sm text-gray-700 mb-3">
                                15年の経験と専門看護師としての高度な知識、さらに教育プログラム開発力まで、
                                全てが最高レベルで評価されました。技術評価においても「法人の宝」と評される結果に。
                              </p>
                              <div className="grid grid-cols-2 gap-2 mb-3">
                                <div className="bg-white p-2 rounded text-xs">
                                  <div className="font-medium text-green-700">法人統一項目</div>
                                  <div>専門性+組織貢献: 48/50点</div>
                                </div>
                                <div className="bg-white p-2 rounded text-xs">
                                  <div className="font-medium text-blue-700">施設特化項目</div>
                                  <div>教育プログラム開発: 19/20点</div>
                                </div>
                              </div>
                              <div className="bg-white p-3 rounded border-l-4 border-indigo-400">
                                <div className="text-xs text-gray-600 mb-1">💭 高橋さんの気持ち</div>
                                <p className="text-sm italic">"15年間の集大成として、技術面でも最高の評価をいただけた。これまでの努力が報われました。"</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* 4月 - 総合評価発表（2軸評価プロセス） */}
                          <div className="flex gap-6">
                            <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-yellow-500 text-white rounded-full shadow-lg">
                              <div className="text-center">
                                <div className="text-xs font-bold">4月</div>
                                <div className="text-xs">結果</div>
                              </div>
                            </div>
                            <div className="flex-1 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                              <h4 className="font-semibold text-yellow-900 mb-2">🏆 高橋さんの総合評価が決定！</h4>
                              <p className="text-sm text-gray-700 mb-3">
                                法人教育統括、学会発表、業界委員、次世代育成...
                                すべてが最高レベルで評価された高橋さん。92点という高得点はどう評価されるのでしょうか。
                              </p>
                              
                              {/* ステップ1: 100点満点の集計 */}
                              <div className="bg-white p-3 rounded mb-3 border-2 border-orange-200">
                                <div className="text-xs font-semibold text-orange-700 mb-2">📊 STEP 1: 100点満点での集計</div>
                                <div className="grid grid-cols-3 gap-2 text-xs">
                                  <div className="text-center">
                                    <div className="font-medium">技術評価</div>
                                    <div className="text-lg font-bold text-orange-600">48/50</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-medium">施設貢献</div>
                                    <div className="text-lg font-bold text-blue-600">25/25</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-medium">法人貢献</div>
                                    <div className="text-lg font-bold text-purple-600">25/25</div>
                                  </div>
                                </div>
                                <div className="mt-2 text-center">
                                  <div className="text-xl font-bold text-gray-800">合計 92/100点</div>
                                </div>
                              </div>
                              
                              {/* ステップ2: 施設内評価 */}
                              <div className="bg-white p-3 rounded mb-3 border-2 border-blue-200">
                                <div className="text-xs font-semibold text-blue-700 mb-2">🏥 STEP 2: 施設内評価（同職種での順位）</div>
                                <p className="text-xs text-gray-700 mb-2">
                                  高橋さんの勤務する「厚生会中央病院」の看護師150名中...
                                  <span className="text-xs text-blue-600 block mt-1">
                                    ※15年目ベテランとして最高水準の評価シート使用。専門性と教育力で評価
                                  </span>
                                </p>
                                <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                                  <div className="text-sm">
                                    <span className="font-bold text-blue-800">92点 = 第3位</span>
                                    <span className="text-xs text-gray-600 ml-2">（上位2%）</span>
                                  </div>
                                  <div className="text-lg font-bold text-yellow-600 px-3 py-1 bg-white rounded">S評価</div>
                                </div>
                                <div className="mt-2 text-xs text-gray-600">
                                  💭 "施設内で3位！150名中の上位2%は本当にすごい。15年間の積み重ねが花開いた！"
                                </div>
                              </div>
                              
                              {/* ステップ3: 法人内評価 */}
                              <div className="bg-white p-3 rounded mb-3 border-2 border-purple-200">
                                <div className="text-xs font-semibold text-purple-700 mb-2">🏢 STEP 3: 法人内評価（法人全体での順位）</div>
                                <p className="text-xs text-gray-700 mb-2">
                                  厚生会グループ全体の看護師300名中...
                                  <span className="text-xs text-purple-600 block mt-1">
                                    ※業界委員活動と次世代育成実績が法人レベルを超えて評価される
                                  </span>
                                </p>
                                <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                                  <div className="text-sm">
                                    <span className="font-bold text-purple-800">92点 = 第8位</span>
                                    <span className="text-xs text-gray-600 ml-2">（上位3%）</span>
                                  </div>
                                  <div className="text-lg font-bold text-yellow-600 px-3 py-1 bg-white rounded">S評価</div>
                                </div>
                                <div className="mt-2 text-xs text-gray-600">
                                  💭 "法人全体で8位！業界委員活動まで評価してもらえるなんて...。法人の理解の深さに感動です！"
                                </div>
                              </div>
                              
                              {/* ステップ4: 2軸マトリックスによる最終評価 */}
                              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-3 rounded mb-3 border-2 border-yellow-400">
                                <div className="text-xs font-semibold text-orange-800 mb-2">✨ STEP 4: 2軸評価マトリックスで最終決定</div>
                                <div className="grid grid-cols-2 gap-4 mb-3">
                                  <div className="text-center">
                                    <div className="text-xs text-gray-600">施設内評価</div>
                                    <div className="text-2xl font-bold text-yellow-600">S</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-xs text-gray-600">法人内評価</div>
                                    <div className="text-2xl font-bold text-yellow-600">S</div>
                                  </div>
                                </div>
                                <div className="text-center p-3 bg-white rounded">
                                  <div className="text-xs text-gray-600 mb-1">マトリックス判定</div>
                                  <div className="text-3xl font-bold text-orange-600">S+評価</div>
                                  <div className="text-xs text-gray-700 mt-1">
                                    施設内S × 法人内S = 総合S+評価
                                  </div>
                                </div>
                                <div className="mt-2 p-2 bg-orange-50 rounded text-xs">
                                  <span className="font-semibold text-orange-800">S+評価の意味：</span>
                                  <span className="text-orange-700">
                                    「法人の宝」級の職員。専門性と組織貢献の両方で最高レベル
                                  </span>
                                </div>
                              </div>
                              
                              <div className="bg-white p-3 rounded border-l-4 border-yellow-400">
                                <div className="text-xs text-gray-600 mb-1">💭 高橋さんの気持ち</div>
                                <p className="text-sm italic">
                                  "S+評価！15年間積み重ねてきた経験と専門性が最高の形で評価されて感無量です。
                                  法人内でも数名しかいないS+評価をいただけるなんて...。
                                  この評価に恥じないよう、後輩たちの成長支援と業界全体の発展にもっと力を注いでいきたいと思います。"
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 管理職（主任・師長）伊藤主任のストーリー */}
                  {storyActiveTab === '管理職' && (
                    <div>
                      <div className="mb-4 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                        <h3 className="font-semibold text-yellow-900">👑 伊藤主任（循環器病棟主任・管理職3年目）</h3>
                        <p className="text-sm text-yellow-700 mt-1">循環器病棟主任として病棟運営とスタッフマネジメントを統括しています。</p>
                      </div>
                      
                      {/* タイムライン形式のストーリー */}
                      <div className="relative">
                        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-yellow-300"></div>
                        
                        <div className="space-y-8">
                          {/* 4月 - 病棟運営改善プロジェクト開始 */}
                          <div className="flex gap-6">
                            <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-yellow-500 text-white rounded-full shadow-lg">
                              <div className="text-center">
                                <div className="text-xs font-bold">4月</div>
                                <div className="text-xs">改善</div>
                              </div>
                            </div>
                            <div className="flex-1 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                              <h4 className="font-semibold text-yellow-900 mb-2">🚀 病棟運営効率化プロジェクト開始</h4>
                              <p className="text-sm text-gray-700 mb-3">
                                管理職3年目の伊藤主任、病棟の効率化を目指した大規模プロジェクトをスタート。
                                勤務体制の見直し、業務フローの改善、スタッフ満足度向上を一体的に推進します。
                              </p>
                              <div className="bg-white p-3 rounded border-l-4 border-yellow-400">
                                <div className="text-xs text-gray-600 mb-1">💭 伊藤主任の気持ち</div>
                                <p className="text-sm italic">"管理職として3年目。経験も積んだし、今年は病棟全体を大きく変える年にしたい。スタッフのことを第一に考えて改革を進めよう。"</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* 5月 - 新人指導体制の再構築 */}
                          <div className="flex gap-6">
                            <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-green-500 text-white rounded-full shadow-lg">
                              <div className="text-center">
                                <div className="text-xs font-bold">5月</div>
                                <div className="text-xs">指導</div>
                              </div>
                            </div>
                            <div className="flex-1 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                              <h4 className="font-semibold text-green-900 mb-2">👥 新人指導体制を抜本的に見直し</h4>
                              <p className="text-sm text-gray-700 mb-3">
                                従来の1対1指導から、チーム全体でサポートする体制に変更。
                                プリセプターの負担軽減と新人の成長促進を両立する仕組みを構築しました。
                              </p>
                              <div className="bg-white p-3 rounded border-l-4 border-green-400">
                                <div className="text-xs text-gray-600 mb-1">💭 伊藤主任の気持ち</div>
                                <p className="text-sm italic">"プリセプターの佐藤さんも田中さんも頑張ってくれている。でも一人に負担が偏らないよう、チーム全体で支える体制にしたい。"</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* 7月 - コスト削減と業務効率化 */}
                          <div className="flex gap-6">
                            <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-blue-500 text-white rounded-full shadow-lg">
                              <div className="text-center">
                                <div className="text-xs font-bold">7月</div>
                                <div className="text-xs">効率</div>
                              </div>
                            </div>
                            <div className="flex-1 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                              <h4 className="font-semibold text-blue-900 mb-2">💰 データ分析による業務効率化</h4>
                              <p className="text-sm text-gray-700 mb-3">
                                病棟の業務データを詳細分析し、無駄な業務を特定。
                                材料費15%削減、残業時間20%短縮を実現しながら、患者満足度は向上させました。
                              </p>
                              <div className="bg-white p-3 rounded border-l-4 border-blue-400">
                                <div className="text-xs text-gray-600 mb-1">💭 伊藤主任の気持ち</div>
                                <p className="text-sm italic">"数字で見える化すると、こんなに無駄があったんだ。でも削減だけじゃダメ。患者さんのケアの質は絶対に落とさない。"</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* 8月 - 夏季査定（組織貢献度） */}
                          <div className="flex gap-6">
                            <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-purple-500 text-white rounded-full shadow-lg">
                              <div className="text-center">
                                <div className="text-xs font-bold">8月</div>
                                <div className="text-xs">夏季</div>
                              </div>
                            </div>
                            <div className="flex-1 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                              <h4 className="font-semibold text-purple-900 mb-2">⭐ 管理職としての組織貢献度評価</h4>
                              <p className="text-sm text-gray-700 mb-3">
                                病棟運営改善の成果が数値で表れ、管理職としての評価が急上昇。
                                「3年目管理職としては期待以上」と上層部からも高く評価されました。
                              </p>
                              <div className="grid grid-cols-2 gap-2 mb-3">
                                <div className="bg-white p-2 rounded text-xs">
                                  <div className="font-medium text-blue-700">施設貢献度</div>
                                  <div>業務効率化成果: 12/12.5点</div>
                                </div>
                                <div className="bg-white p-2 rounded text-xs">
                                  <div className="font-medium text-purple-700">法人貢献度</div>
                                  <div>コスト削減実績: 11.5/12.5点</div>
                                </div>
                              </div>
                              <div className="bg-white p-3 rounded border-l-4 border-purple-400">
                                <div className="text-xs text-gray-600 mb-1">💭 伊藤主任の気持ち</div>
                                <p className="text-sm italic">"管理職の評価は結果が全て。数字で成果を示せて良かった。でも数字の裏にはスタッフの頑張りがある。"</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* 10月 - 他病棟への展開と法人内発表 */}
                          <div className="flex gap-6">
                            <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-indigo-500 text-white rounded-full shadow-lg">
                              <div className="text-center">
                                <div className="text-xs font-bold">10月</div>
                                <div className="text-xs">展開</div>
                              </div>
                            </div>
                            <div className="flex-1 p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-500">
                              <h4 className="font-semibold text-indigo-900 mb-2">🌐 改善ノウハウを法人内に横展開</h4>
                              <p className="text-sm text-gray-700 mb-3">
                                循環器病棟での成功事例を法人内の管理職会議で発表。
                                他の病棟主任からも「ぜひ教えてほしい」と相談を受け、法人全体の改善に貢献しました。
                              </p>
                              <div className="bg-white p-3 rounded border-l-4 border-indigo-400">
                                <div className="text-xs text-gray-600 mb-1">💭 伊藤主任の気持ち</div>
                                <p className="text-sm italic">"他の病棟の主任さんたちからも頼られるようになった。一人の管理職として成長できているのかな。"</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* 11月 - スタッフ満足度向上施策 */}
                          <div className="flex gap-6">
                            <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-teal-500 text-white rounded-full shadow-lg">
                              <div className="text-center">
                                <div className="text-xs font-bold">11月</div>
                                <div className="text-xs">満足</div>
                              </div>
                            </div>
                            <div className="flex-1 p-4 bg-teal-50 rounded-lg border-l-4 border-teal-500">
                              <h4 className="font-semibold text-teal-900 mb-2">😊 スタッフ満足度向上プロジェクト</h4>
                              <p className="text-sm text-gray-700 mb-3">
                                業務効率化で生まれた余裕を、スタッフのワークライフバランス向上に活用。
                                有給取得率90%達成、残業ゼロの日を月10日以上確保できました。
                              </p>
                              <div className="bg-white p-3 rounded border-l-4 border-teal-400">
                                <div className="text-xs text-gray-600 mb-1">💭 伊藤主任の気持ち</div>
                                <p className="text-sm italic">"効率化の目的はここ。スタッフが笑顔で働けることが一番大切。それが患者さんのためにもなる。"</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* 12月 - 冬季査定 */}
                          <div className="flex gap-6">
                            <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-orange-500 text-white rounded-full shadow-lg">
                              <div className="text-center">
                                <div className="text-xs font-bold">12月</div>
                                <div className="text-xs">冬季</div>
                              </div>
                            </div>
                            <div className="flex-1 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                              <h4 className="font-semibold text-orange-900 mb-2">📈 総合的な管理成果が評価される</h4>
                              <p className="text-sm text-gray-700 mb-3">
                                法人内展開とスタッフ満足度向上の両立が高く評価。
                                「理想的な管理職モデル」として法人内でも注目される存在になりました。
                              </p>
                              <div className="grid grid-cols-2 gap-2 mb-3">
                                <div className="bg-white p-2 rounded text-xs">
                                  <div className="font-medium text-blue-700">施設貢献度</div>
                                  <div>総合管理成果: 12.5/12.5点</div>
                                </div>
                                <div className="bg-white p-2 rounded text-xs">
                                  <div className="font-medium text-purple-700">法人貢献度</div>
                                  <div>横展開・モデル化: 12/12.5点</div>
                                </div>
                              </div>
                              <div className="bg-white p-3 rounded border-l-4 border-orange-400">
                                <div className="text-xs text-gray-600 mb-1">💭 伊藤主任の気持ち</div>
                                <p className="text-sm italic">"満点近い評価！スタッフみんなが頑張ってくれた結果です。来年はもっと法人に貢献したい。"</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* 3月 - 管理職技術評価 */}
                          <div className="flex gap-6">
                            <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-red-500 text-white rounded-full shadow-lg">
                              <div className="text-center">
                                <div className="text-xs font-bold">3月</div>
                                <div className="text-xs">管理</div>
                              </div>
                            </div>
                            <div className="flex-1 p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                              <h4 className="font-semibold text-red-900 mb-2">🎯 管理職としての総合評価</h4>
                              <p className="text-sm text-gray-700 mb-3">
                                管理職用の特別な評価シートで、スタッフ育成、病棟運営、数値管理、専門技術の
                                4領域で評価。3年目管理職としては非常に高いレベルに達しました。
                              </p>
                              <div className="bg-white p-3 rounded mb-3">
                                <h5 className="text-xs font-semibold text-red-700 mb-2">管理職用評価項目</h5>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div className="p-2 bg-red-50 rounded">
                                    <div className="font-medium">スタッフ育成</div>
                                    <div>18/20点</div>
                                  </div>
                                  <div className="p-2 bg-red-50 rounded">
                                    <div className="font-medium">病棟運営</div>
                                    <div>17/20点</div>
                                  </div>
                                  <div className="p-2 bg-red-50 rounded">
                                    <div className="font-medium">数値管理</div>
                                    <div>15/20点</div>
                                  </div>
                                  <div className="p-2 bg-red-50 rounded">
                                    <div className="font-medium">専門技術</div>
                                    <div>16/20点</div>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-white p-3 rounded border-l-4 border-red-400">
                                <div className="text-xs text-gray-600 mb-1">💭 伊藤主任の気持ち</div>
                                <p className="text-sm italic">"管理職として必要な4つの領域、どれも向上できた。特にスタッフ育成は自信を持てるレベルに。"</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* 4月 - 総合評価発表（2軸評価プロセス） */}
                          <div className="flex gap-6">
                            <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-yellow-500 text-white rounded-full shadow-lg">
                              <div className="text-center">
                                <div className="text-xs font-bold">4月</div>
                                <div className="text-xs">結果</div>
                              </div>
                            </div>
                            <div className="flex-1 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                              <h4 className="font-semibold text-yellow-900 mb-2">🏆 伊藤主任の総合評価が決定！</h4>
                              <p className="text-sm text-gray-700 mb-3">
                                病棟運営改善、コスト削減、スタッフ満足度向上、法人内展開...
                                管理職として求められる全ての要素で成果を上げた伊藤主任。86点の評価はどうなるのでしょうか。
                              </p>
                              
                              {/* ステップ1: 100点満点の集計 */}
                              <div className="bg-white p-3 rounded mb-3 border-2 border-orange-200">
                                <div className="text-xs font-semibold text-orange-700 mb-2">📊 STEP 1: 管理職評価（100点満点）</div>
                                <div className="grid grid-cols-3 gap-2 text-xs">
                                  <div className="text-center">
                                    <div className="font-medium">管理技術</div>
                                    <div className="text-lg font-bold text-orange-600">42/50</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-medium">施設貢献</div>
                                    <div className="text-lg font-bold text-blue-600">24.5/25</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-medium">法人貢献</div>
                                    <div className="text-lg font-bold text-purple-600">23.5/25</div>
                                  </div>
                                </div>
                                <div className="mt-2 text-center">
                                  <div className="text-xl font-bold text-gray-800">合計 86/100点</div>
                                </div>
                              </div>
                              
                              {/* ステップ2: 施設内管理職評価 */}
                              <div className="bg-white p-3 rounded mb-3 border-2 border-blue-200">
                                <div className="text-xs font-semibold text-blue-700 mb-2">🏥 STEP 2: 施設内管理職評価</div>
                                <p className="text-xs text-gray-700 mb-2">
                                  厚生会中央病院の管理職（主任・師長）12名中...
                                  <span className="text-xs text-blue-600 block mt-1">
                                    ※管理職3年目として適正な期待値での評価。同じ管理職層での比較
                                  </span>
                                </p>
                                <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                                  <div className="text-sm">
                                    <span className="font-bold text-blue-800">86点 = 第4位</span>
                                    <span className="text-xs text-gray-600 ml-2">（上位33%）</span>
                                  </div>
                                  <div className="text-lg font-bold text-green-600 px-3 py-1 bg-white rounded">A評価</div>
                                </div>
                                <div className="mt-2 text-xs text-gray-600">
                                  💭 "施設内で4位！管理職12人中の上位33%は上出来。3年目としては十分な成果だ。"
                                </div>
                              </div>
                              
                              {/* ステップ3: 法人内管理職評価 */}
                              <div className="bg-white p-3 rounded mb-3 border-2 border-purple-200">
                                <div className="text-xs font-semibold text-purple-700 mb-2">🏢 STEP 3: 法人内管理職評価</div>
                                <p className="text-xs text-gray-700 mb-2">
                                  厚生会グループ全体の管理職45名中...
                                  <span className="text-xs text-purple-600 block mt-1">
                                    ※法人内展開実績と改善ノウハウの共有が法人レベルで評価される
                                  </span>
                                </p>
                                <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                                  <div className="text-sm">
                                    <span className="font-bold text-purple-800">86点 = 第12位</span>
                                    <span className="text-xs text-gray-600 ml-2">（上位27%）</span>
                                  </div>
                                  <div className="text-lg font-bold text-green-600 px-3 py-1 bg-white rounded">A評価</div>
                                </div>
                                <div className="mt-2 text-xs text-gray-600">
                                  💭 "法人全体でも12位！45名中の上位27%。改善事例を共有したことが評価されたんだ！"
                                </div>
                              </div>
                              
                              {/* ステップ4: 2軸マトリックスによる最終評価 */}
                              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-3 rounded mb-3 border-2 border-yellow-400">
                                <div className="text-xs font-semibold text-orange-800 mb-2">✨ STEP 4: 管理職向け2軸評価マトリックス</div>
                                <div className="grid grid-cols-2 gap-4 mb-3">
                                  <div className="text-center">
                                    <div className="text-xs text-gray-600">施設内管理職評価</div>
                                    <div className="text-2xl font-bold text-green-600">A</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-xs text-gray-600">法人内管理職評価</div>
                                    <div className="text-2xl font-bold text-green-600">A</div>
                                  </div>
                                </div>
                                <div className="text-center p-3 bg-white rounded">
                                  <div className="text-xs text-gray-600 mb-1">マトリックス判定</div>
                                  <div className="text-3xl font-bold text-yellow-600">A+評価</div>
                                  <div className="text-xs text-gray-700 mt-1">
                                    施設内A × 法人内A = 総合A+評価
                                  </div>
                                </div>
                                <div className="mt-2 p-2 bg-yellow-50 rounded text-xs">
                                  <span className="font-semibold text-yellow-800">評価の意味：</span>
                                  <span className="text-yellow-700">
                                    「施設でも法人でも優秀な管理職。3年目として理想的な成長」
                                  </span>
                                </div>
                              </div>
                              
                              <div className="bg-white p-3 rounded border-l-4 border-yellow-400">
                                <div className="text-xs text-gray-600 mb-1">💭 伊藤主任の気持ち</div>
                                <p className="text-sm italic">
                                  "A+評価！管理職になってから評価の視点が大きく変わりました。
                                  個人の技術よりも、いかにスタッフを成長させ、病棟全体のパフォーマンスを上げるかが重要。
                                  まだまだ学ぶことが多いですが、本当にやりがいのある仕事です。
                                  来年は師長を目指して、さらに大きな責任を担えるよう成長したいと思います！"
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* V3評価制度解説タブ */}
                  {storyActiveTab === '評価制度' && (
                    <div>
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                        <h3 className="font-semibold text-blue-900">📋 評価制度 完全ガイド</h3>
                        <p className="text-sm text-blue-700 mt-1">2025年3月開始の新評価制度の詳細解説</p>
                      </div>

                      {/* 制度概要 */}
                      <div className="space-y-4">
                        <div className="p-4 bg-white rounded-lg border border-gray-200">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <span className="text-blue-600">🎯</span>
                            V3評価制度の基本構造
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-500">
                              <div className="font-semibold text-blue-900">技術評価（50点）</div>
                              <div className="text-sm text-blue-700 mt-1">
                                • 法人統一項目（30点）<br/>
                                • 施設特化項目（20点）<br/>
                                • 年1回実施（3月）
                              </div>
                            </div>
                            <div className="p-3 bg-green-50 rounded border-l-4 border-green-500">
                              <div className="font-semibold text-green-900">組織貢献評価（50点）</div>
                              <div className="text-sm text-green-700 mt-1">
                                • 施設貢献（25点）<br/>
                                • 法人貢献（25点）<br/>
                                • 年2回実施（9月・3月）
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 p-3 bg-yellow-50 rounded border-l-4 border-yellow-500">
                            <div className="font-semibold text-yellow-900">合計100点満点制</div>
                            <div className="text-sm text-yellow-700 mt-1">
                              技術力と組織貢献のバランス評価により、患者と組織双方に価値提供する職員を適正評価
                            </div>
                          </div>
                        </div>

                        {/* 相対評価システム */}
                        <div className="p-4 bg-white rounded-lg border border-gray-200">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <span className="text-purple-600">📊</span>
                            2軸マトリックス相対評価システム
                          </h4>
                          <div className="space-y-3">
                            <div className="bg-purple-50 p-3 rounded">
                              <div className="font-semibold text-purple-900 mb-2">STEP 1: 施設内相対評価</div>
                              <div className="text-sm text-purple-700">
                                同職種職員を施設内で順位化し、5段階評価（S/A/B/C/D）を決定
                              </div>
                            </div>
                            <div className="bg-purple-50 p-3 rounded">
                              <div className="font-semibold text-purple-900 mb-2">STEP 2: 法人内相対評価</div>
                              <div className="text-sm text-purple-700">
                                同職種職員を法人全体で順位化し、5段階評価（S/A/B/C/D）を決定
                              </div>
                            </div>
                            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-3 rounded border-2 border-yellow-400">
                              <div className="font-semibold text-orange-800 mb-2">STEP 3: 2軸マトリックス最終判定</div>
                              <div className="text-sm text-orange-700 mb-2">
                                施設内評価×法人内評価の組み合わせで7段階最終評価を決定
                              </div>
                              <div className="grid grid-cols-3 gap-2 text-xs text-center">
                                <div className="bg-red-100 p-2 rounded font-bold text-red-800">S+ 最優秀</div>
                                <div className="bg-orange-100 p-2 rounded font-bold text-orange-800">S 優秀</div>
                                <div className="bg-yellow-100 p-2 rounded font-bold text-yellow-800">A+ 良好上位</div>
                                <div className="bg-green-100 p-2 rounded font-bold text-green-800">A 良好</div>
                                <div className="bg-blue-100 p-2 rounded font-bold text-blue-800">B 標準</div>
                                <div className="bg-gray-100 p-2 rounded font-bold text-gray-700">C 要改善</div>
                                <div className="bg-red-200 p-2 rounded font-bold text-red-900">D 要指導</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 年間スケジュール */}
                        <div className="p-4 bg-white rounded-lg border border-gray-200">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <span className="text-green-600">📅</span>
                            年間評価スケジュール
                          </h4>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded">
                              <div className="font-bold text-blue-900 min-w-[60px]">3月</div>
                              <div className="text-sm text-blue-700">
                                <div className="font-semibold">技術評価 + 組織貢献評価実施</div>
                                <div>→ 100点満点での個人評価確定 → 最終判定実行</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-green-50 rounded">
                              <div className="font-bold text-green-900 min-w-[60px]">4-5月</div>
                              <div className="text-sm text-green-700">
                                <div className="font-semibold">相対評価処理期間</div>
                                <div>→ 最終評価確定・結果開示・異議申立対応</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded">
                              <div className="font-bold text-yellow-900 min-w-[60px]">9月</div>
                              <div className="text-sm text-yellow-700">
                                <div className="font-semibold">組織貢献評価のみ実施</div>
                                <div>→ 賞与査定・中間フィードバック</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 職種別評価項目 */}
                        <div className="p-4 bg-white rounded-lg border border-gray-200">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <span className="text-red-600">👥</span>
                            職種別評価項目
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="p-2 bg-pink-50 rounded border-l-4 border-pink-500">
                                <div className="font-semibold text-pink-900">看護師</div>
                                <div className="text-xs text-pink-700">
                                  基本看護技術、専門性、患者対応、チーム医療
                                </div>
                              </div>
                              <div className="p-2 bg-blue-50 rounded border-l-4 border-blue-500">
                                <div className="font-semibold text-blue-900">准看護師</div>
                                <div className="text-xs text-blue-700">
                                  基本業務、指示実行、連携・報告、安全管理
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="p-2 bg-green-50 rounded border-l-4 border-green-500">
                                <div className="font-semibold text-green-900">看護補助者</div>
                                <div className="text-xs text-green-700">
                                  日常業務、患者支援、環境整備、チームワーク
                                </div>
                              </div>
                              <div className="p-2 bg-purple-50 rounded border-l-4 border-purple-500">
                                <div className="font-semibold text-purple-900">介護職</div>
                                <div className="text-xs text-purple-700">
                                  介護技術、利用者対応、記録・報告、安全配慮
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 評価の活用 */}
                        <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-300">
                          <h4 className="font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                            <span className="text-indigo-600">🎖️</span>
                            評価結果の活用方法
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="p-2 bg-white rounded border-l-4 border-blue-500">
                                <div className="font-semibold text-blue-900 text-sm">昇進・昇格</div>
                                <div className="text-xs text-blue-700">継続的高評価者の優先選考</div>
                              </div>
                              <div className="p-2 bg-white rounded border-l-4 border-green-500">
                                <div className="font-semibold text-green-900 text-sm">研修・教育</div>
                                <div className="text-xs text-green-700">個別成長プラン策定</div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="p-2 bg-white rounded border-l-4 border-yellow-500">
                                <div className="font-semibold text-yellow-900 text-sm">賞与査定</div>
                                <div className="text-xs text-yellow-700">成果に応じた適正処遇</div>
                              </div>
                              <div className="p-2 bg-white rounded border-l-4 border-purple-500">
                                <div className="font-semibold text-purple-900 text-sm">キャリア支援</div>
                                <div className="text-xs text-purple-700">専門性向上支援</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 年間UI体験シミュレーションタブ */}
                  {storyActiveTab === 'シミュレーション' && (
                    <div>
                      <div className="mb-4 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                        <h3 className="font-semibold text-green-900">🖥️ 年間UI体験シミュレーション</h3>
                        <p className="text-sm text-green-700 mt-1">実際のシステム画面を時系列で体験</p>
                      </div>

                      {/* 年間評価サイクル概要 */}
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border-2 border-blue-300 mb-6">
                        <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                          <span className="text-blue-600">📆</span>
                          年間評価サイクル全体像
                        </h4>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="px-3 py-1 bg-green-500 text-white rounded-full font-bold">8月</div>
                            <span className="text-green-700">夏季組織貢献</span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                          <div className="flex items-center gap-2">
                            <div className="px-3 py-1 bg-purple-500 text-white rounded-full font-bold">12月</div>
                            <span className="text-purple-700">冬季組織貢献</span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                          <div className="flex items-center gap-2">
                            <div className="px-3 py-1 bg-blue-500 text-white rounded-full font-bold">3月</div>
                            <span className="text-blue-700">技術+組織評価</span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                          <div className="flex items-center gap-2">
                            <div className="px-3 py-1 bg-red-500 text-white rounded-full font-bold">3-5月</div>
                            <span className="text-red-700">最終判定</span>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-white rounded text-xs text-gray-600">
                          年2回の組織貢献評価と年1回の技術評価により、職員の成長と貢献を継続的に評価
                        </div>
                      </div>

                      <div className="space-y-6">
                        {/* 8月: 夏季組織貢献評価 */}
                        <div className="p-4 bg-white rounded-lg border-2 border-green-500">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-bold">8月</span>
                            <h4 className="font-semibold text-green-900">夏季組織貢献評価期間</h4>
                          </div>
                          
                          <div className="mb-3">
                            <div className="text-sm text-green-700 mb-2">ダッシュボードに表示される組織貢献評価カード：</div>
                            <Card className="border-2 border-green-500 bg-gradient-to-br from-green-600 to-teal-600 text-white">
                              <CardHeader className="pb-4">
                                <div className="flex items-center gap-3">
                                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur">
                                    <Users className="h-8 w-8 text-white" />
                                  </div>
                                  <div>
                                    <CardTitle className="text-xl font-bold text-white">組織貢献評価（夏季）</CardTitle>
                                    <CardDescription className="text-green-100">
                                      上期の施設・法人貢献度を評価
                                    </CardDescription>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="mb-3">
                                  <Progress value={45} className="h-3 bg-white/20" />
                                  <div className="flex justify-between text-sm mt-1">
                                    <span>進捗状況</span>
                                    <span>45% (56/125名完了)</span>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                  <div>
                                    <div className="text-green-100">施設貢献</div>
                                    <div className="font-bold">25点満点</div>
                                  </div>
                                  <div>
                                    <div className="text-green-100">法人貢献</div>
                                    <div className="font-bold">25点満点</div>
                                  </div>
                                </div>
                                <Button className="w-full mt-3 bg-white text-green-600 hover:bg-green-50" disabled>
                                  <TrendingUp className="mr-2 h-4 w-4" />
                                  貢献度評価開始（デモ用・非アクティブ）
                                </Button>
                              </CardContent>
                            </Card>
                          </div>
                          
                          <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                            <div className="text-sm font-semibold text-green-900 mb-2">8月評価の特徴：</div>
                            <div className="space-y-1 text-sm text-green-700">
                              <div>• 上期（4-7月）の組織貢献度を評価</div>
                              <div>• 秋季賞与査定の基礎データとして活用</div>
                              <div>• 技術評価は実施せず、貢献度のみ</div>
                              <div>• 合計50点満点で評価</div>
                            </div>
                          </div>
                        </div>

                        {/* 12月: 冬季組織貢献評価 */}
                        <div className="p-4 bg-white rounded-lg border-2 border-purple-500">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="px-3 py-1 bg-purple-500 text-white rounded-full text-sm font-bold">12月</span>
                            <h4 className="font-semibold text-purple-900">冬季組織貢献評価期間</h4>
                          </div>
                          
                          <div className="mb-3">
                            <div className="text-sm text-purple-700 mb-2">ダッシュボードに表示される組織貢献評価カード：</div>
                            <Card className="border-2 border-purple-500 bg-gradient-to-br from-purple-600 to-indigo-600 text-white">
                              <CardHeader className="pb-4">
                                <div className="flex items-center gap-3">
                                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur">
                                    <Award className="h-8 w-8 text-white" />
                                  </div>
                                  <div>
                                    <CardTitle className="text-xl font-bold text-white">組織貢献評価（冬季）</CardTitle>
                                    <CardDescription className="text-purple-100">
                                      下期の施設・法人貢献度を評価
                                    </CardDescription>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="mb-3">
                                  <Progress value={72} className="h-3 bg-white/20" />
                                  <div className="flex justify-between text-sm mt-1">
                                    <span>進捗状況</span>
                                    <span>72% (90/125名完了)</span>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                  <div>
                                    <div className="text-purple-100">施設貢献</div>
                                    <div className="font-bold">25点満点</div>
                                  </div>
                                  <div>
                                    <div className="text-purple-100">法人貢献</div>
                                    <div className="font-bold">25点満点</div>
                                  </div>
                                </div>
                                <Button className="w-full mt-3 bg-white text-purple-600 hover:bg-purple-50" disabled>
                                  <Award className="mr-2 h-4 w-4" />
                                  貢献度評価開始（デモ用・非アクティブ）
                                </Button>
                              </CardContent>
                            </Card>
                          </div>
                          
                          <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                            <div className="text-sm font-semibold text-purple-900 mb-2">12月評価の特徴：</div>
                            <div className="space-y-1 text-sm text-purple-700">
                              <div>• 下期（8-11月）の組織貢献度を評価</div>
                              <div>• 春季賞与査定の基礎データとして活用</div>
                              <div>• 3月の総合評価に向けた中間評価</div>
                              <div>• 合計50点満点で評価</div>
                            </div>
                          </div>
                        </div>

                        {/* 3月: 技術評価期間 */}
                        <div className="p-4 bg-white rounded-lg border-2 border-blue-500">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-bold">3月</span>
                            <h4 className="font-semibold text-blue-900">技術評価実施期間</h4>
                          </div>
                          
                          <div className="mb-3">
                            <div className="text-sm text-blue-700 mb-2">ダッシュボードに表示される技術評価カード：</div>
                            <Card className="border-2 border-blue-500 bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                              <CardHeader className="pb-4">
                                <div className="flex items-center gap-3">
                                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur">
                                    <ClipboardList className="h-8 w-8 text-white" />
                                  </div>
                                  <div>
                                    <CardTitle className="text-xl font-bold text-white">技術評価</CardTitle>
                                    <CardDescription className="text-blue-100">
                                      年1回の専門技術評価を実施
                                    </CardDescription>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="mb-3">
                                  <Progress value={65} className="h-3 bg-white/20" />
                                  <div className="flex justify-between text-sm mt-1">
                                    <span>進捗状況</span>
                                    <span>65% (81/125名完了)</span>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                  <div>
                                    <div className="text-blue-100">法人統一項目</div>
                                    <div className="font-bold">30点満点</div>
                                  </div>
                                  <div>
                                    <div className="text-blue-100">施設特化項目</div>
                                    <div className="font-bold">20点満点</div>
                                  </div>
                                </div>
                                <Button className="w-full mt-3 bg-white text-blue-600 hover:bg-blue-50" disabled>
                                  <PlayCircle className="mr-2 h-4 w-4" />
                                  評価開始（デモ用・非アクティブ）
                                </Button>
                              </CardContent>
                            </Card>
                          </div>
                          
                          <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                            <div className="text-sm font-semibold text-blue-900 mb-2">3月評価の特徴：</div>
                            <div className="space-y-1 text-sm text-blue-700">
                              <div>• 年1回の技術評価（50点満点）</div>
                              <div>• 同時に組織貢献評価も実施（50点満点）</div>
                              <div>• 合計100点満点で個人評価が確定</div>
                              <div>• この100点が相対評価の基礎データとなる</div>
                            </div>
                          </div>
                        </div>

                        {/* 3-5月: 最終判定期間 */}
                        <div className="p-4 bg-white rounded-lg border-2 border-red-500">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-bold">3-5月</span>
                            <h4 className="font-semibold text-red-900">最終判定実行期間</h4>
                          </div>
                          
                          <div className="mb-3">
                            <div className="text-sm text-red-700 mb-2">ダッシュボードに表示される最終判定カード：</div>
                            <Card className="border-2 border-red-500 bg-gradient-to-br from-red-600 to-orange-600 text-white">
                              <div className="absolute top-2 right-2">
                                <Badge className="bg-yellow-400 text-yellow-900">3-5月限定</Badge>
                              </div>
                              <CardHeader className="pb-4">
                                <div className="flex items-center gap-3">
                                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur">
                                    <BarChart3 className="h-8 w-8 text-white" />
                                  </div>
                                  <div>
                                    <CardTitle className="text-xl font-bold text-white">最終判定</CardTitle>
                                    <CardDescription className="text-red-100">
                                      100点満点から7段階成績を決定
                                    </CardDescription>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="p-3 bg-white/10 rounded-lg backdrop-blur mb-3">
                                  <h4 className="text-sm font-bold text-red-100 mb-2">処理状況：</h4>
                                  <div className="grid grid-cols-3 gap-2 text-xs">
                                    <div>
                                      <div className="text-red-200">技術評価収集</div>
                                      <div className="font-bold">250/500名</div>
                                      <Progress value={50} className="h-2 mt-1 bg-white/20" />
                                    </div>
                                    <div>
                                      <div className="text-red-200">暫定判定済</div>
                                      <div className="font-bold">180名</div>
                                      <Progress value={36} className="h-2 mt-1 bg-white/20" />
                                    </div>
                                    <div>
                                      <div className="text-red-200">最終確定</div>
                                      <div className="font-bold">0名</div>
                                      <Progress value={0} className="h-2 mt-1 bg-white/20" />
                                    </div>
                                  </div>
                                </div>
                                <Button className="w-full bg-white text-red-600 hover:bg-red-50" disabled>
                                  <BarChart3 className="mr-2 h-5 w-5" />
                                  判定実行画面へ（デモ用・非アクティブ）
                                </Button>
                              </CardContent>
                            </Card>
                          </div>

                          <div className="mt-4 p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                            <div className="text-sm font-semibold text-red-900 mb-2">相対評価プロセス：</div>
                            <div className="space-y-2 text-sm text-red-700">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>1. 技術評価完了者データ収集</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>2. 施設内同職種順位化（5段階評価）</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>3. 法人内同職種順位化（5段階評価）</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-orange-500" />
                                <span>4. 2軸マトリックス最終判定（7段階評価）</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 6月-7月: 通常期間 */}
                        <div className="p-4 bg-white rounded-lg border-2 border-gray-400">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="px-3 py-1 bg-gray-400 text-white rounded-full text-sm font-bold">6-7月</span>
                            <h4 className="font-semibold text-gray-700">通常業務期間</h4>
                          </div>
                          
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-700 mb-2">
                              評価期間外のため、評価関連カードは表示されません。
                            </div>
                            <div className="text-xs text-gray-600">
                              • 最終評価結果に基づく昇進・昇格の実施
                              • 個別フィードバックと成長計画策定
                              • 次回評価に向けた目標設定
                            </div>
                          </div>
                        </div>

                        {/* システム設計の考慮点 */}
                        <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border-2 border-purple-300">
                          <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                            <span className="text-purple-600">🔧</span>
                            システム設計の考慮点
                          </h4>
                          <div className="space-y-3">
                            <div className="p-3 bg-white rounded border-l-4 border-blue-500">
                              <div className="font-semibold text-blue-900 text-sm">時期限定表示</div>
                              <div className="text-xs text-blue-700">
                                評価に関するUIは適切な時期のみ表示し、職員の混乱を防止
                              </div>
                            </div>
                            <div className="p-3 bg-white rounded border-l-4 border-green-500">
                              <div className="font-semibold text-green-900 text-sm">安全性確保</div>
                              <div className="text-xs text-green-700">
                                技術評価未完了時の最終判定実行を阻止し、誤判定を防止
                              </div>
                            </div>
                            <div className="p-3 bg-white rounded border-l-4 border-purple-500">
                              <div className="font-semibold text-purple-900 text-sm">データ整合性</div>
                              <div className="text-xs text-purple-700">
                                スコア合計チェック、範囲検証により、データの信頼性を保証
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* 評価設計の意図解説 */}
            <Card className="border-2 border-indigo-300 bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <span className="text-2xl">🧠</span>
                  なぜこの評価制度になったの？ - 設計の意図
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-white rounded-lg border-l-4 border-blue-500">
                    <h4 className="font-semibold text-blue-900 mb-2">💡 重要ポイント1: なぜ技術評価50点 + 貢献度評価50点なの？</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      単純に技術だけで評価すると、「仕事はできるけど協調性がない」職員が高評価になってしまいます。
                      逆に貢献度だけだと「人当たりは良いけど技術が未熟」な職員が過大評価される可能性があります。
                    </p>
                    <div className="bg-blue-50 p-3 rounded">
                      <div className="text-xs font-medium text-blue-800 mb-1">設計思想</div>
                      <p className="text-xs text-blue-700">「技術力」と「組織への貢献」の両方をバランスよく評価することで、患者にも組織にも価値を提供できる職員を正しく評価します。</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg border-l-4 border-green-500">
                    <h4 className="font-semibold text-green-900 mb-2">💡 重要ポイント2: なぜ年2回の貢献度評価 + 年1回の技術評価？</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      技術力は短期間では大きく変わりませんが、組織貢献度は季節や時期によって変動します。
                      また、賞与査定では最新の貢献度を反映させたいというニーズがあります。
                    </p>
                    <div className="bg-green-50 p-3 rounded">
                      <div className="text-xs font-medium text-green-800 mb-1">設計思想</div>
                      <p className="text-xs text-green-700">技術評価は「年間を通じた成長」を、貢献度評価は「半年ごとの活動実績」を測ることで、適切なタイミングでの評価を実現します。</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg border-l-4 border-purple-500">
                    <h4 className="font-semibold text-purple-900 mb-2">💡 重要ポイント3: なぜ「施設内順位」と「法人内順位」の2軸評価？</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      小規模な施設で頑張っている職員と、大規模施設の職員を同じ土俵で比較するのは不公平です。
                      でも法人全体での相対的なレベルも把握したい。この矛盾を解決するのが2軸評価です。
                    </p>
                    <div className="bg-purple-50 p-3 rounded">
                      <div className="text-xs font-medium text-purple-800 mb-1">設計思想</div>
                      <p className="text-xs text-purple-700">「自分の職場では優秀」+「法人全体でも高水準」= 最高評価。どちらか一方でも適切な評価を受けられる仕組みです。</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg border-l-4 border-orange-500">
                    <h4 className="font-semibold text-orange-900 mb-2">💡 重要ポイント4: なぜ7段階評価（S+〜D）なの？</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      3段階だと差がつきすぎ、10段階だと細かすぎて評価者が迷います。
                      7段階は「努力が報われる」と感じられる適切な刻み幅です。
                    </p>
                    <div className="bg-orange-50 p-3 rounded">
                      <div className="text-xs font-medium text-orange-800 mb-1">設計思想</div>
                      <p className="text-xs text-orange-700">S+（法人の宝）からD（要支援）まで、職員のモチベーション向上と適切なフィードバックを両立する段階設定です。</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* 評価システム概要 - ビジュアル強化版 */}
            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <span className="text-2xl">📊</span>
                  人事評価システム概要
                </CardTitle>
                <CardDescription className="text-gray-700">
                  公平・透明・成長支援を重視した総合評価制度
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* ビジュアル強化: 評価配分の円グラフ風表示 */}
                <div className="mb-8">
                  <div className="flex items-center justify-center gap-8">
                    <div className="relative">
                      <div className="w-40 h-40 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex flex-col items-center justify-center text-white shadow-xl">
                        <div className="text-3xl font-bold">100点</div>
                        <div className="text-sm">年間総合評価</div>
                      </div>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md border-l-4 border-blue-500">
                        <Target className="h-10 w-10 text-blue-500" />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800">技術評価</div>
                          <div className="text-2xl font-bold text-blue-600">50点</div>
                          <div className="text-xs text-gray-600">専門スキル・知識（年1回）</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md border-l-4 border-purple-500">
                        <Users className="h-10 w-10 text-purple-500" />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800">組織貢献度</div>
                          <div className="text-2xl font-bold text-purple-600">50点</div>
                          <div className="text-xs text-gray-600">施設・法人への貢献（年2回）</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 評価の特徴 */}
                  <div className="flex justify-center gap-4 mt-6">
                    <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
                      ⚖️ 絶対評価と相対評価の併用
                    </Badge>
                    <Badge className="bg-green-100 text-green-800 px-3 py-1">
                      📈 成長支援重視
                    </Badge>
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
                      <Link href="/evaluation-execution">
                        <Button className="w-full" size="sm" variant="outline">
                          <PlayCircle className="mr-2 h-4 w-4" />
                          V3評価システムで開始
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
                  <Link href="/evaluation-execution">
                    <div className="p-4 bg-white rounded-lg border hover:border-orange-400 hover:shadow-md transition-all cursor-pointer text-center">
                      <Award className="h-6 w-6 text-green-600 mx-auto mb-2" />
                      <div className="text-sm font-medium">V3統合評価</div>
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
