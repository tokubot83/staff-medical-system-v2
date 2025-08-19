'use client';

import React, { useState } from 'react';
import CommonHeader from '@/components/CommonHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import styles from './EvaluationDesign.module.css';
import { 
  Calendar, 
  Target, 
  Users, 
  Award,
  Settings,
  FlaskConical,
  BarChart3,
  Info,
  CheckCircle,
  Clock,
  AlertCircle,
  Sparkles,
  ChevronRight,
  PlayCircle,
  Edit3,
  Save,
  FileCheck,
  AlertTriangle,
  TrendingUp,
  Zap,
  BookOpen,
  HelpCircle,
  Shield,
  Database,
  Building,
  Eye,
  Upload,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import Link from 'next/link';

interface MonthData {
  month: number;
  name: string;
  status: 'completed' | 'current' | 'upcoming' | 'inactive';
  tasks: {
    title: string;
    completed: boolean;
    urgent?: boolean;
  }[];
  highlight?: boolean;
  keyTasks?: string[];
}

export default function EvaluationDesignPage() {
  const [currentDate] = useState(new Date());
  const currentMonth = currentDate.getMonth() + 1; // 1-12

  // 年間スケジュールデータ
  const yearSchedule: MonthData[] = [
    {
      month: 4,
      name: '4月',
      status: currentMonth === 4 ? 'current' : currentMonth > 4 ? 'completed' : 'upcoming',
      tasks: [
        { title: '前年度評価結果フィードバック', completed: true },
        { title: '昇給・賞与への反映', completed: true }
      ]
    },
    {
      month: 5,
      name: '5月',
      status: currentMonth === 5 ? 'current' : currentMonth > 5 ? 'completed' : 'upcoming',
      tasks: [
        { title: '上半期活動計画策定', completed: true }
      ]
    },
    {
      month: 6,
      name: '6月',
      status: currentMonth === 6 ? 'current' : currentMonth > 6 ? 'completed' : 'upcoming',
      highlight: true,
      keyTasks: ['夏季貢献度評価（25点）'],
      tasks: [
        { title: '各施設から評価データ収集', completed: true },
        { title: 'Excelデータ取込・検証', completed: true },
        { title: '相対評価ランキング作成', completed: true },
        { title: '評価確定・承認', completed: true }
      ]
    },
    {
      month: 7,
      name: '7月',
      status: currentMonth === 7 ? 'current' : currentMonth > 7 ? 'completed' : 'upcoming',
      tasks: [
        { title: '夏季評価結果通知', completed: true }
      ]
    },
    {
      month: 8,
      name: '8月',
      status: currentMonth === 8 ? 'current' : currentMonth > 8 ? 'completed' : 'upcoming',
      tasks: []
    },
    {
      month: 9,
      name: '9月',
      status: currentMonth === 9 ? 'current' : currentMonth > 9 ? 'completed' : 'upcoming',
      tasks: []
    },
    {
      month: 10,
      name: '10月',
      status: currentMonth === 10 ? 'current' : currentMonth > 10 ? 'completed' : 'upcoming',
      tasks: [
        { title: '下半期活動計画策定', completed: currentMonth > 10 }
      ]
    },
    {
      month: 11,
      name: '11月',
      status: currentMonth === 11 ? 'current' : currentMonth > 11 ? 'completed' : 'upcoming',
      tasks: []
    },
    {
      month: 12,
      name: '12月',
      status: currentMonth === 12 ? 'current' : currentMonth > 12 || currentMonth < 4 ? 'completed' : 'upcoming',
      highlight: true,
      keyTasks: ['冬季貢献度評価（25点）'],
      tasks: [
        { title: '各施設から評価データ収集', completed: currentMonth > 12 || currentMonth < 4 },
        { title: 'Excelデータ取込・検証', completed: currentMonth > 12 || currentMonth < 4 },
        { title: '相対評価ランキング作成', completed: currentMonth > 12 || currentMonth < 4 },
        { title: '年間貢献度スコア確定', completed: currentMonth > 12 || currentMonth < 4 }
      ]
    },
    {
      month: 1,
      name: '1月',
      status: currentMonth === 1 ? 'current' : currentMonth > 1 ? 'completed' : 'upcoming',
      highlight: true,
      keyTasks: ['評価制度設計・更新'],
      tasks: [
        { title: '法人統一項目（30点）の配分設計', completed: currentMonth > 1, urgent: currentMonth === 1 },
        { title: '施設特化項目（20点）の選定', completed: false, urgent: currentMonth === 1 },
        { title: '評価シミュレーション実施', completed: false, urgent: currentMonth === 1 },
        { title: '各施設との調整', completed: false }
      ]
    },
    {
      month: 2,
      name: '2月',
      status: currentMonth === 2 ? 'current' : currentMonth > 2 ? 'completed' : 'upcoming',
      tasks: [
        { title: '法人経営会議での承認', completed: currentMonth > 2, urgent: currentMonth === 2 },
        { title: '全施設への通知', completed: currentMonth > 2 },
        { title: '評価者研修の実施', completed: currentMonth > 2 }
      ]
    },
    {
      month: 3,
      name: '3月',
      status: currentMonth === 3 ? 'current' : currentMonth > 3 ? 'completed' : 'upcoming',
      highlight: true,
      keyTasks: ['技術評価実施（50点）', '年間総合評価決定'],
      tasks: [
        { title: '評価シート配布', completed: currentMonth > 3, urgent: currentMonth === 3 },
        { title: '上司評価・本人評価の実施', completed: currentMonth > 3, urgent: currentMonth === 3 },
        { title: '100点満点スコア確定', completed: currentMonth > 3 },
        { title: '2軸相対評価で最終グレード決定', completed: currentMonth > 3 }
      ]
    }
  ];

  const currentMonthData = yearSchedule.find(m => m.month === currentMonth);
  const urgentTasks = yearSchedule.flatMap(month => 
    month.tasks.filter(task => task.urgent && !task.completed)
  );

  // 進捗計算
  const calculateProgress = () => {
    const totalTasks = yearSchedule.reduce((sum, month) => sum + month.tasks.length, 0);
    const completedTasks = yearSchedule.reduce((sum, month) => 
      sum + month.tasks.filter(task => task.completed).length, 0);
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'current':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'upcoming':
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-300" />;
    }
  };

  const getMonthCardClass = (month: MonthData) => {
    if (month.status === 'current') {
      return 'border-2 border-blue-500 bg-blue-50 shadow-lg';
    }
    if (month.highlight) {
      return 'border-2 border-purple-300 bg-purple-50';
    }
    if (month.status === 'completed') {
      return 'border border-green-200 bg-green-50';
    }
    return 'border border-gray-200';
  };

  return (
    <div>
      <CommonHeader title="評価制度管理ダッシュボード" />
      
      <div className="max-w-7xl mx-auto p-6">
        {/* ヘッダー情報 */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">2025年度 評価管理</h1>
            <p className="text-gray-600">年間スケジュールに沿った評価業務の管理</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-500">年間進捗</div>
              <div className="text-2xl font-bold text-blue-600">{calculateProgress()}%</div>
            </div>
            <Button variant="outline">
              <HelpCircle className="h-4 w-4 mr-2" />
              ヘルプ
            </Button>
          </div>
        </div>

        {/* 今月のタスク（大きく表示） */}
        {currentMonthData && currentMonthData.tasks.length > 0 && (
          <Card className="mb-6 border-2 border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-500 rounded-full">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{currentMonthData.name}の重要タスク</CardTitle>
                    <CardDescription className="text-lg">
                      {currentMonthData.keyTasks ? currentMonthData.keyTasks[0] : '通常業務'}
                    </CardDescription>
                  </div>
                </div>
                <Badge className="bg-blue-600 text-white px-4 py-2">実施中</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">今月のタスク一覧</h4>
                  {currentMonthData.tasks.map((task, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        task.completed ? 'bg-green-500' : 
                        task.urgent ? 'bg-red-500' : 'bg-gray-300'
                      }`} />
                      <span className={task.completed ? 'line-through text-gray-500' : 
                        task.urgent ? 'font-semibold text-red-700' : ''}>
                        {task.title}
                      </span>
                      {task.urgent && !task.completed && (
                        <Badge variant="destructive" className="text-xs">緊急</Badge>
                      )}
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">クイックアクション</h4>
                  <div className="space-y-2">
                    {currentMonth === 1 && (
                      <Link href="/evaluation-design/wizard">
                        <Button size="lg" className="w-full justify-start">
                          <Settings className="h-5 w-5 mr-3" />
                          評価設計ウィザードを開始
                        </Button>
                      </Link>
                    )}
                    {(currentMonth === 6 || currentMonth === 12) && (
                      <>
                        <Button size="lg" variant="outline" className="w-full justify-start">
                          <Upload className="h-5 w-5 mr-3" />
                          Excelデータを取込
                        </Button>
                        <Button size="lg" variant="outline" className="w-full justify-start">
                          <FileSpreadsheet className="h-5 w-5 mr-3" />
                          評価テンプレート
                        </Button>
                      </>
                    )}
                    {currentMonth === 3 && (
                      <Button size="lg" variant="outline" className="w-full justify-start">
                        <FileCheck className="h-5 w-5 mr-3" />
                        技術評価を開始
                      </Button>
                    )}
                    <Link href="/evaluation-design/timeline">
                      <Button variant="ghost" className="w-full justify-start">
                        <Calendar className="h-5 w-5 mr-3" />
                        詳細スケジュールを見る
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 緊急タスクがある場合のアラート */}
        {urgentTasks.length > 0 && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">緊急対応が必要です</AlertTitle>
            <AlertDescription className="text-red-700">
              <div className="mt-2">
                {urgentTasks.map((task, idx) => (
                  <div key={idx} className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full" />
                    {task.title}
                  </div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* 年間タイムライン（横スクロール） */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              年間タイムライン
            </CardTitle>
            <CardDescription>
              評価業務の年間スケジュール
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-4 min-w-max">
                {yearSchedule.map((month) => (
                  <Card key={month.month} className={`min-w-64 ${getMonthCardClass(month)}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(month.status)}
                          <h3 className="font-bold">{month.name}</h3>
                        </div>
                        {month.highlight && (
                          <Badge className="bg-purple-600">重要</Badge>
                        )}
                      </div>
                      {month.keyTasks && (
                        <div className="text-xs text-purple-600 font-medium">
                          {month.keyTasks[0]}
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="pt-0">
                      {month.tasks.length > 0 ? (
                        <div className="space-y-1">
                          {month.tasks.slice(0, 3).map((task, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs">
                              <div className={`w-1.5 h-1.5 rounded-full ${
                                task.completed ? 'bg-green-500' : 'bg-gray-300'
                              }`} />
                              <span className={task.completed ? 'line-through text-gray-500' : ''}>
                                {task.title.length > 20 ? task.title.substring(0, 20) + '...' : task.title}
                              </span>
                            </div>
                          ))}
                          {month.tasks.length > 3 && (
                            <div className="text-xs text-gray-500">
                              他{month.tasks.length - 3}件...
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400">予定なし</div>
                      )}
                      
                      {month.status === 'current' && (
                        <Link href="/evaluation-design/timeline">
                          <Button size="sm" className="w-full mt-3">
                            詳細を見る
                          </Button>
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 評価体系サマリー */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <Card className="border-blue-200">
            <CardHeader className="text-center">
              <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-xl">技術評価</CardTitle>
              <div className="text-3xl font-bold text-blue-600">50点</div>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>法人統一項目</span>
                  <span className="font-semibold">30点</span>
                </div>
                <div className="flex justify-between">
                  <span>施設特化項目</span>
                  <span className="font-semibold">20点</span>
                </div>
                <Link href="/evaluation-design/wizard">
                  <Button size="sm" className="w-full mt-3">設計・確認</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader className="text-center">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-xl">貢献度評価</CardTitle>
              <div className="text-3xl font-bold text-green-600">50点</div>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>夏季評価（6月）</span>
                  <span className="font-semibold">25点</span>
                </div>
                <div className="flex justify-between">
                  <span>冬季評価（12月）</span>
                  <span className="font-semibold">25点</span>
                </div>
                <Button size="sm" variant="outline" className="w-full mt-3">データ取込</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardHeader className="text-center">
              <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-xl">最終評価</CardTitle>
              <div className="text-3xl font-bold text-purple-600">7段階</div>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>施設内相対評価</span>
                  <span className="font-semibold">5段階</span>
                </div>
                <div className="flex justify-between">
                  <span>法人内相対評価</span>
                  <span className="font-semibold">5段階</span>
                </div>
                <Button size="sm" variant="outline" className="w-full mt-3">結果確認</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 詳細機能へのリンク（小さく表示） */}
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="h-5 w-5" />
              詳細管理機能
            </CardTitle>
            <CardDescription>
              高度な設定や管理機能
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-3">
              <Link href="/evaluation-design/questions">
                <Button variant="ghost" size="sm" className="w-full flex-col h-auto py-3">
                  <Sparkles className="h-5 w-5 mb-1" />
                  <span className="text-xs">AI動的設問</span>
                </Button>
              </Link>
              
              <Link href="/evaluation-design/simulation">
                <Button variant="ghost" size="sm" className="w-full flex-col h-auto py-3">
                  <FlaskConical className="h-5 w-5 mb-1" />
                  <span className="text-xs">シミュレーション</span>
                </Button>
              </Link>
              
              <Button variant="ghost" size="sm" className="w-full flex-col h-auto py-3">
                <Download className="h-5 w-5 mb-1" />
                <span className="text-xs">データ出力</span>
              </Button>
              
              <Button variant="ghost" size="sm" className="w-full flex-col h-auto py-3">
                <BookOpen className="h-5 w-5 mb-1" />
                <span className="text-xs">マニュアル</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}