'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import CommonHeader from '@/components/CommonHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
  Download
} from 'lucide-react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('home');
  const [evaluationProgress] = useState({
    total: 125,
    completed: 78,
    inProgress: 32,
    notStarted: 15
  });

  const completionRate = Math.round((evaluationProgress.completed / evaluationProgress.total) * 100);

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
              <Card className="border-2 border-blue-500 shadow-xl hover:shadow-2xl transition-all bg-gradient-to-br from-blue-600 to-blue-700 text-white">
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
                  <div className="flex items-center gap-2 text-sm text-blue-100">
                    <CheckCircle className="h-4 w-4" />
                    <span>法人統一項目・施設特化項目の管理</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-100">
                    <Sparkles className="h-4 w-4" />
                    <span>AI対応動的設問の自動生成</span>
                  </div>
                  <Link href="/evaluation-design">
                    <Button className="w-full bg-white text-blue-600 hover:bg-blue-50" size="lg">
                      <Target className="mr-2 h-5 w-5" />
                      評価制度を設計する
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* 個人評価管理 */}
              <Card className="border-2 border-purple-500 shadow-xl hover:shadow-2xl transition-all bg-gradient-to-br from-purple-600 to-purple-700 text-white">
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
                  <div className="flex items-center gap-2 text-sm text-purple-100">
                    <FileText className="h-4 w-4" />
                    <span>5段階評価とS~Dグレード判定</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-purple-100">
                    <Shield className="h-4 w-4" />
                    <span>評価開示と異議申立対応</span>
                  </div>
                  <Link href="/evaluation-execution">
                    <Button className="w-full bg-white text-purple-600 hover:bg-purple-50" size="lg">
                      <Award className="mr-2 h-5 w-5" />
                      評価を実施する
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  評価制度の概要
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">100点満点評価システム</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">技術評価（50点）</h4>
                      <ul className="text-sm space-y-1 text-gray-600">
                        <li>• 法人統一項目：30点</li>
                        <li>• 施設特化項目：20点</li>
                        <li>• 職種・経験に応じた評価</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">貢献度評価（50点）</h4>
                      <ul className="text-sm space-y-1 text-gray-600">
                        <li>• 施設貢献度：25点</li>
                        <li>• 法人貢献度：25点</li>
                        <li>• 年2回評価（7月・12月）</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">評価プロセスフロー</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge>1. 制度設計</Badge>
                    <ArrowRight className="h-4 w-4" />
                    <Badge>2. 評価実施</Badge>
                    <ArrowRight className="h-4 w-4" />
                    <Badge>3. 総合判定</Badge>
                    <ArrowRight className="h-4 w-4" />
                    <Badge>4. 評価開示</Badge>
                    <ArrowRight className="h-4 w-4" />
                    <Badge>5. 異議申立</Badge>
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>評価の目的</AlertTitle>
                  <AlertDescription>
                    公正で透明性の高い評価を通じて、職員の成長支援と組織の発展を実現します。
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>よくある質問（FAQ）</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Q: 評価の頻度はどのくらいですか？</h4>
                    <p className="text-sm text-gray-600">A: 技術評価は年1回、貢献度評価は年2回（7月・12月）実施されます。</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Q: 評価結果に不服がある場合は？</h4>
                    <p className="text-sm text-gray-600">A: 評価開示後、異議申立制度を利用して再評価を申請できます。</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Q: 評価は誰が行いますか？</h4>
                    <p className="text-sm text-gray-600">A: 直属の上司による1次評価と、部門長による2次評価の多段階評価を行います。</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="space-y-6 p-6">
            <div className="grid grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    施設別進捗
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">小原病院</span>
                        <span className="text-sm font-semibold">82%</span>
                      </div>
                      <Progress value={82} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">立神リハビリ</span>
                        <span className="text-sm font-semibold">68%</span>
                      </div>
                      <Progress value={68} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">エスポワール立神</span>
                        <span className="text-sm font-semibold">95%</span>
                      </div>
                      <Progress value={95} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    締切アラート
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Alert className="border-red-200">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-sm">
                        <strong>本日締切:</strong> 外科病棟 5名分
                      </AlertDescription>
                    </Alert>
                    <Alert className="border-yellow-200">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      <AlertDescription className="text-sm">
                        <strong>3日後:</strong> ICU 8名分
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    完了率トレンド
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">+15%</div>
                    <p className="text-sm text-gray-600 mt-2">先週比での進捗向上</p>
                    <p className="text-xs text-gray-500 mt-4">このペースなら1/31までに完了予定</p>
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