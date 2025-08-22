'use client';

import React, { useState } from 'react';
import CommonHeader from '@/components/CommonHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import EvaluationBulkModal from '@/components/evaluation/EvaluationBulkModal';
import EvaluationDesignSupport from '@/components/evaluation/EvaluationDesignSupport';
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
  CheckCircle2,
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
  FileSpreadsheet,
  Star,
  ArrowRight
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
  trainingTasks?: {  // 研修連携タスク
    title: string;
    completed: boolean;
    type: 'planning' | 'execution' | 'analysis';
    expectedImpact?: string;
  }[];
  highlight?: boolean;
  keyTasks?: string[];
}

export default function EvaluationDesignPage() {
  const [currentDate] = useState(new Date());
  const currentMonth = currentDate.getMonth() + 1; // 1-12
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [showDesignSupport, setShowDesignSupport] = useState(false);
  const [activeTab, setActiveTab] = useState<'evaluation' | 'training' | 'analysis'>('evaluation');
  const [showTrainingSimulator, setShowTrainingSimulator] = useState(false);

  // 年間スケジュールデータ
  const yearSchedule: MonthData[] = [
    {
      month: 4,
      name: '4月',
      status: currentMonth === 4 ? 'current' : currentMonth > 4 ? 'completed' : 'upcoming',
      tasks: [
        { title: '前年度評価結果フィードバック', completed: true },
        { title: '昇給・賞与への反映', completed: true }
      ],
      trainingTasks: [
        { title: '個別研修計画の確定・通知', completed: true, type: 'execution' },
        { title: '第1四半期必須研修の予約開始', completed: true, type: 'execution' },
        { title: '研修進捗トラッキング開始', completed: true, type: 'execution' }
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
      ],
      trainingTasks: [
        { title: '第1四半期研修効果測定', completed: true, type: 'analysis', expectedImpact: '貢献度+3点' },
        { title: '貢献度スコアと研修受講の相関分析', completed: true, type: 'analysis' },
        { title: '下半期研修計画の調整', completed: false, type: 'planning' }
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
      ],
      trainingTasks: [
        { title: '上半期研修完了率レビュー', completed: currentMonth > 10, type: 'analysis', expectedImpact: '完了率85%' },
        { title: '技術評価予測スコア算出', completed: false, type: 'analysis', expectedImpact: '平均78点予測' },
        { title: '目標グレード到達のための追加研修提案', completed: false, type: 'planning' }
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
      ],
      trainingTasks: [
        { title: '年間研修ROI分析', completed: currentMonth > 12 || currentMonth < 4, type: 'analysis', expectedImpact: 'ROI 125%' },
        { title: '次年度研修プログラム改善提案', completed: false, type: 'planning' },
        { title: '高成果者の研修パターン分析', completed: false, type: 'analysis' }
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
      ],
      trainingTasks: [
        { title: '前年度評価データから研修効果分析', completed: currentMonth > 1, type: 'analysis', expectedImpact: '研修ROI 120%達成' },
        { title: '評価項目と研修プログラムのマッピング', completed: false, type: 'planning', expectedImpact: '全項目カバー率100%' },
        { title: '必須研修カリキュラム策定', completed: false, type: 'planning' }
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
      ],
      trainingTasks: [
        { title: '評価結果即時分析→個別研修計画生成', completed: currentMonth > 3, type: 'analysis', expectedImpact: '平均スコア+5点' },
        { title: 'スコアギャップ基づく優先研修リスト', completed: currentMonth > 3, type: 'planning' },
        { title: '新年度研修予算配分提案', completed: false, type: 'planning', expectedImpact: '投資効率15%改善' }
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
        return <CheckCircle className="h-5 w-5 text-gray-500" />;
      case 'current':
        return <Clock className="h-6 w-6 text-blue-600 animate-pulse drop-shadow-lg" />;
      case 'upcoming':
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-300" />;
    }
  };

  const getMonthCardClass = (month: MonthData) => {
    if (month.status === 'current') {
      // 当月は強烈に強調：青い光る境界線と鮮やかなグラデーション
      return 'border-4 border-blue-500 bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 shadow-2xl ring-2 ring-blue-200 ring-opacity-50';
    }
    if (month.status === 'completed') {
      // 完了した月はグレー系で落ち着いた表示
      return 'border border-gray-300 bg-gradient-to-br from-gray-100 to-slate-100 shadow-sm opacity-75';
    }
    if (month.highlight && month.status !== 'completed') {
      // 重要な未来の月は紫系
      return 'border-2 border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg';
    }
    return 'border border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-sm';
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
          <Card className="mb-6 border-4 border-blue-600 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 shadow-2xl ring-4 ring-blue-200 ring-opacity-30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full shadow-lg animate-pulse">
                    <Calendar className="h-8 w-8 text-white drop-shadow-lg" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-800 bg-clip-text text-transparent">
                      {currentMonthData.name}の重要タスク
                    </CardTitle>
                    <CardDescription className="text-xl font-medium text-indigo-700">
                      {currentMonthData.keyTasks ? currentMonthData.keyTasks[0] : '通常業務'}
                    </CardDescription>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 text-lg font-semibold shadow-lg animate-pulse">
                  🎯 実施中
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {/* タブ切り替え */}
              <div className="flex gap-2 mb-4 p-1 bg-gray-100 rounded-lg">
                <button
                  onClick={() => setActiveTab('evaluation')}
                  className={`flex-1 px-4 py-2 rounded-md font-medium transition-all ${
                    activeTab === 'evaluation' 
                      ? 'bg-white text-blue-700 shadow-md' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Target className="inline h-4 w-4 mr-2" />
                  評価タスク
                </button>
                <button
                  onClick={() => setActiveTab('training')}
                  className={`flex-1 px-4 py-2 rounded-md font-medium transition-all ${
                    activeTab === 'training' 
                      ? 'bg-white text-purple-700 shadow-md' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <BookOpen className="inline h-4 w-4 mr-2" />
                  研修連携
                </button>
                <button
                  onClick={() => setActiveTab('analysis')}
                  className={`flex-1 px-4 py-2 rounded-md font-medium transition-all ${
                    activeTab === 'analysis' 
                      ? 'bg-white text-green-700 shadow-md' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <BarChart3 className="inline h-4 w-4 mr-2" />
                  分析
                </button>
              </div>

              {/* タブコンテンツ */}
              {activeTab === 'evaluation' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold">今月のタスク一覧</h4>
                  {currentMonthData.tasks.map((task, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors">
                      {task.completed ? (
                        <div className="flex items-center justify-center w-6 h-6 bg-green-500 rounded-full">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                      ) : task.urgent ? (
                        <div className="flex items-center justify-center w-6 h-6 bg-red-500 rounded-full animate-pulse">
                          <Clock className="w-4 h-4 text-white" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />
                      )}
                      <span className={`flex-1 ${
                        task.completed ? 'text-green-700 font-medium' : 
                        task.urgent ? 'font-semibold text-red-700' : 'text-gray-700'
                      }`}>
                        {task.title}
                      </span>
                      {task.urgent && !task.completed && (
                        <Badge variant="destructive" className="text-xs animate-pulse">緊急</Badge>
                      )}
                      {task.completed && (
                        <Badge className="bg-green-100 text-green-800 text-xs">完了</Badge>
                      )}
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">クイックアクション</h4>
                  <div className="space-y-2">
                    {currentMonth === 1 && (
                      <>
                        <Button 
                          size="lg" 
                          className="w-full justify-start bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg"
                          onClick={() => setShowDesignSupport(true)}
                        >
                          <Settings className="h-5 w-5 mr-3" />
                          評価設計支援ツール
                        </Button>
                        <Link href="/evaluation-design/wizard">
                          <Button size="lg" variant="outline" className="w-full justify-start hover:bg-blue-50">
                            <Zap className="h-5 w-5 mr-3" />
                            従来ウィザード
                          </Button>
                        </Link>
                      </>
                    )}
                    {(currentMonth === 6 || currentMonth === 12) && (
                      <>
                        <Button 
                          size="lg" 
                          variant="outline" 
                          className="w-full justify-start hover:bg-blue-50 hover:border-blue-300"
                          onClick={() => setIsBulkModalOpen(true)}
                        >
                          <Upload className="h-5 w-5 mr-3" />
                          Excelデータを取込
                        </Button>
                        <Link href="/evaluation-design/templates">
                          <Button size="lg" variant="outline" className="w-full justify-start">
                            <FileSpreadsheet className="h-5 w-5 mr-3" />
                            評価テンプレート
                          </Button>
                        </Link>
                      </>
                    )}
                    {currentMonth === 3 && (
                      <Button 
                        size="lg" 
                        variant="outline" 
                        className="w-full justify-start hover:bg-purple-50 hover:border-purple-300"
                        onClick={() => setIsBulkModalOpen(true)}
                      >
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
              )}

              {/* 研修連携タブ */}
              {activeTab === 'training' && currentMonthData.trainingTasks && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Zap className="h-4 w-4 text-purple-600" />
                      研修連携タスク
                    </h4>
                    {currentMonthData.trainingTasks.map((task, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors">
                        {task.completed ? (
                          <div className="flex items-center justify-center w-6 h-6 bg-purple-500 rounded-full">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 border-2 border-purple-300 rounded-full" />
                        )}
                        <div className="flex-1">
                          <span className={task.completed ? 'text-purple-700 font-medium' : 'text-gray-700'}>
                            {task.title}
                          </span>
                          {task.expectedImpact && (
                            <div className="text-xs text-purple-600 mt-1">
                              期待効果: {task.expectedImpact}
                            </div>
                          )}
                        </div>
                        <Badge className={`text-xs ${
                          task.type === 'planning' ? 'bg-blue-100 text-blue-800' :
                          task.type === 'execution' ? 'bg-green-100 text-green-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {task.type === 'planning' ? '計画' :
                           task.type === 'execution' ? '実行' : '分析'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold">研修アクション</h4>
                    <div className="space-y-2">
                      <Link href="/training-v3">
                        <Button className="w-full justify-start bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                          <Zap className="h-5 w-5 mr-3" />
                          V3研修システムへ
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setShowTrainingSimulator(true)}
                      >
                        <TrendingUp className="h-5 w-5 mr-3" />
                        成長予測シミュレーター
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* 分析タブ */}
              {activeTab === 'analysis' && (
                <div className="space-y-4">
                  <Alert className="border-green-200 bg-green-50">
                    <Sparkles className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">研修効果分析</AlertTitle>
                    <AlertDescription className="text-green-700">
                      前期研修による評価向上: 平均+4.2点 | ROI: 118%
                    </AlertDescription>
                  </Alert>
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="border-blue-200">
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-blue-600">78.5点</div>
                        <p className="text-xs text-gray-600">現在の平均スコア</p>
                      </CardContent>
                    </Card>
                    <Card className="border-purple-200">
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-purple-600">82.0点</div>
                        <p className="text-xs text-gray-600">研修後予測スコア</p>
                      </CardContent>
                    </Card>
                    <Card className="border-green-200">
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-green-600">+3.5点</div>
                        <p className="text-xs text-gray-600">期待向上幅</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
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

        {/* 年間タイムライン（縦表示） */}
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
            <div className="space-y-4">
              {yearSchedule.map((month, index) => {
                const isExpanded = month.status === 'current';
                const taskProgress = month.tasks.length > 0 
                  ? Math.round((month.tasks.filter(t => t.completed).length / month.tasks.length) * 100)
                  : 0;

                return (
                  <Card key={month.month} className={`transition-all ${getMonthCardClass(month)}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(month.status)}
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className={`font-bold text-lg ${
                                month.status === 'current' 
                                  ? 'text-blue-800 text-2xl' 
                                  : month.status === 'completed' 
                                    ? 'text-gray-600' 
                                    : 'text-gray-800'
                              }`}>
                                {month.name}
                              </h3>
                              {month.highlight && month.status !== 'completed' && (
                                <Badge className={month.status === 'current' ? 'bg-blue-600 animate-pulse' : 'bg-purple-600'}>
                                  重要
                                </Badge>
                              )}
                              {month.status === 'completed' && (
                                <Badge className="bg-gray-400 text-white">完了</Badge>
                              )}
                            </div>
                            {month.keyTasks && (
                              <div className="flex items-center gap-1 mt-1">
                                <Star className={`w-3 h-3 ${
                                  month.status === 'completed' ? 'text-gray-400' : 
                                  month.status === 'current' ? 'text-blue-500' : 'text-purple-500'
                                }`} />
                                <div className={`text-sm font-medium ${
                                  month.status === 'completed' ? 'text-gray-500' : 
                                  month.status === 'current' ? 'text-blue-600' : 'text-purple-600'
                                }`}>
                                  {month.keyTasks[0]}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {month.tasks.length > 0 && (
                            <div className="text-right">
                              <div className={`text-sm font-medium ${
                                month.status === 'current' ? 'text-blue-700 font-bold' : 
                                month.status === 'completed' ? 'text-gray-500' : 'text-gray-700'
                              }`}>
                                {taskProgress}%
                              </div>
                              <div className={`text-xs ${
                                month.status === 'completed' ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                {month.tasks.filter(t => t.completed).length}/{month.tasks.length} 完了
                              </div>
                            </div>
                          )}
                          <ChevronRight className={`h-5 w-5 transition-transform ${
                            isExpanded ? 'rotate-90' : ''
                          } ${
                            month.status === 'current' ? 'text-blue-600' : 
                            month.status === 'completed' ? 'text-gray-400' : 'text-gray-600'
                          }`} />
                        </div>
                      </div>
                      
                      {/* 進捗バー */}
                      {month.tasks.length > 0 && (
                        <Progress 
                          value={taskProgress} 
                          className={`mt-3 h-3 ${
                            month.status === 'current' ? 'ring-2 ring-blue-200' : 
                            month.status === 'completed' ? 'opacity-50' : ''
                          }`}
                        />
                      )}
                    </CardHeader>

                    {/* 展開時の詳細表示 */}
                    {isExpanded && (
                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          {/* タスクリスト */}
                          <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                              <Target className="h-4 w-4 text-blue-600" />
                              評価タスク
                            </h4>
                            <div className="space-y-3">
                              {month.tasks.map((task, idx) => (
                                <div key={idx} className={`flex items-center justify-between p-4 rounded-xl border transition-all hover:shadow-md ${
                                  task.completed ? 'bg-green-50 border-green-200' : 
                                  task.urgent ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'
                                }`}>
                                  <div className="flex items-center gap-4">
                                    {task.completed ? (
                                      <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-full">
                                        <CheckCircle2 className="w-5 h-5 text-white" />
                                      </div>
                                    ) : task.urgent ? (
                                      <div className="flex items-center justify-center w-8 h-8 bg-red-500 rounded-full animate-pulse">
                                        <Clock className="w-5 h-5 text-white" />
                                      </div>
                                    ) : (
                                      <div className="w-8 h-8 border-2 border-gray-300 rounded-full flex items-center justify-center">
                                        <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                                      </div>
                                    )}
                                    <div>
                                      <span className={`font-medium ${
                                        task.completed ? 'text-green-700' : 
                                        task.urgent ? 'text-red-700' : 'text-gray-700'
                                      }`}>
                                        {task.title}
                                      </span>
                                      <div className="flex gap-2 mt-1">
                                        {task.urgent && !task.completed && (
                                          <Badge variant="destructive" className="text-xs animate-pulse">緊急</Badge>
                                        )}
                                        {task.completed && (
                                          <Badge className="bg-green-100 text-green-800 text-xs">完了済み</Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* タスクアクション */}
                                  <div className="flex gap-2">
                                    {!task.completed && task.urgent && (
                                      <Button size="sm" className="bg-red-500 hover:bg-red-600">
                                        <ArrowRight className="h-4 w-4 mr-1" />
                                        開始
                                      </Button>
                                    )}
                                    {task.completed && (
                                      <Button size="sm" variant="ghost" className="text-green-600 hover:text-green-700">
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 研修連携タスク */}
                          {month.trainingTasks && month.trainingTasks.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-purple-600" />
                                研修連携タスク
                              </h4>
                              <div className="space-y-3">
                                {month.trainingTasks.map((task, idx) => (
                                  <div key={idx} className="flex items-center justify-between p-4 rounded-xl border bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 hover:shadow-md transition-all">
                                    <div className="flex items-center gap-4">
                                      {task.completed ? (
                                        <div className="flex items-center justify-center w-8 h-8 bg-purple-500 rounded-full">
                                          <CheckCircle2 className="w-5 h-5 text-white" />
                                        </div>
                                      ) : (
                                        <div className="w-8 h-8 border-2 border-purple-300 rounded-full flex items-center justify-center">
                                          <Zap className="w-4 h-4 text-purple-500" />
                                        </div>
                                      )}
                                      <div>
                                        <span className={`font-medium ${
                                          task.completed ? 'text-purple-700' : 'text-gray-700'
                                        }`}>
                                          {task.title}
                                        </span>
                                        <div className="flex gap-2 mt-1">
                                          <Badge className={`text-xs ${
                                            task.type === 'planning' ? 'bg-blue-100 text-blue-800' :
                                            task.type === 'execution' ? 'bg-green-100 text-green-800' :
                                            'bg-orange-100 text-orange-800'
                                          }`}>
                                            {task.type === 'planning' ? '計画' :
                                             task.type === 'execution' ? '実行' : '分析'}
                                          </Badge>
                                          {task.expectedImpact && (
                                            <Badge className="bg-purple-100 text-purple-800 text-xs">
                                              {task.expectedImpact}
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    {!task.completed && (
                                      <Link href="/training-v3">
                                        <Button size="sm" variant="ghost" className="text-purple-600 hover:text-purple-700">
                                          <ArrowRight className="h-4 w-4" />
                                        </Button>
                                      </Link>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* クイックアクション */}
                          <div>
                            <h4 className="font-semibold mb-3">クイックアクション</h4>
                            <div className="grid grid-cols-2 gap-3">
                              {currentMonth === 1 && (
                                <Link href="/evaluation-design/wizard">
                                  <Button className="w-full justify-start">
                                    <Settings className="h-4 w-4 mr-2" />
                                    評価設計ウィザード
                                  </Button>
                                </Link>
                              )}
                              {(currentMonth === 6 || currentMonth === 12) && (
                                <>
                                  <Button 
                                    variant="outline" 
                                    className="w-full justify-start hover:bg-blue-50"
                                    onClick={() => setIsBulkModalOpen(true)}
                                  >
                                    <Upload className="h-4 w-4 mr-2" />
                                    データ取込
                                  </Button>
                                  <Link href="/evaluation-design/templates">
                                    <Button variant="outline" className="w-full justify-start">
                                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                                      テンプレート
                                    </Button>
                                  </Link>
                                </>
                              )}
                              {currentMonth === 3 && (
                                <Button 
                                  variant="outline" 
                                  className="w-full justify-start hover:bg-purple-50"
                                  onClick={() => setIsBulkModalOpen(true)}
                                >
                                  <FileCheck className="h-4 w-4 mr-2" />
                                  技術評価開始
                                </Button>
                              )}
                              <Link href="/evaluation-design/timeline">
                                <Button variant="ghost" className="w-full justify-start">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  詳細スケジュール
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    )}

                    {/* 折りたたみ時のサマリー表示 */}
                    {!isExpanded && month.tasks.length > 0 && (
                      <CardContent className="pt-0">
                        <div className="text-sm text-gray-600">
                          {month.tasks.slice(0, 2).map((task, idx) => (
                            <div key={idx} className="flex items-center gap-3 mb-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                              {task.completed ? (
                                <div className="flex items-center justify-center w-5 h-5 bg-green-500 rounded-full">
                                  <CheckCircle2 className="w-3 h-3 text-white" />
                                </div>
                              ) : (
                                <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                              )}
                              <span className={`${
                                task.completed ? 
                                  month.status === 'completed' ? 'text-gray-600 font-medium' : 'text-green-700 font-medium' 
                                  : month.status === 'completed' ? 'text-gray-600' : 'text-gray-700'
                              }`}>
                                {task.title.length > 35 ? task.title.substring(0, 35) + '...' : task.title}
                              </span>
                              {task.completed && (
                                <Badge className={`text-xs ml-auto ${
                                  month.status === 'completed' 
                                    ? 'bg-gray-200 text-gray-600' 
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  ✓
                                </Badge>
                              )}
                            </div>
                          ))}
                          {month.tasks.length > 2 && (
                            <div className="text-xs text-gray-400 ml-4">
                              他{month.tasks.length - 2}件...
                            </div>
                          )}
                        </div>
                      </CardContent>
                    )}

                    {!isExpanded && month.tasks.length === 0 && (
                      <CardContent className="pt-0">
                        <div className="text-sm text-gray-400">予定されているタスクはありません</div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* 研修連携ダッシュボード */}
        <Card className="mb-6 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-600" />
                V3研修連携ダッシュボード
                <Badge className="bg-purple-100 text-purple-800" variant="outline">New</Badge>
              </CardTitle>
              <Link href="/training-v3">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  詳細を見る
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              {/* 現在の評価状況 */}
              <Card className="border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                    <span className="text-xs text-gray-500">現在</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">76.8点</div>
                  <p className="text-xs text-gray-600 mt-1">平均評価スコア</p>
                  <div className="text-xs text-orange-600 mt-2">
                    Bグレード (70-79点)
                  </div>
                </CardContent>
              </Card>

              {/* 研修完了率 */}
              <Card className="border-purple-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <BookOpen className="h-4 w-4 text-purple-600" />
                    <span className="text-xs text-gray-500">進捗</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">68%</div>
                  <p className="text-xs text-gray-600 mt-1">年間研修完了率</p>
                  <Progress value={68} className="mt-2 h-2" />
                </CardContent>
              </Card>

              {/* 予測スコア */}
              <Card className="border-green-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-xs text-gray-500">予測</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">82.3点</div>
                  <p className="text-xs text-gray-600 mt-1">研修後予測</p>
                  <div className="text-xs text-green-600 mt-2">
                    Aグレード到達見込み
                  </div>
                </CardContent>
              </Card>

              {/* ROI */}
              <Card className="border-yellow-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Sparkles className="h-4 w-4 text-yellow-600" />
                    <span className="text-xs text-gray-500">ROI</span>
                  </div>
                  <div className="text-2xl font-bold text-yellow-600">124%</div>
                  <p className="text-xs text-gray-600 mt-1">研修投資効果</p>
                  <div className="text-xs text-green-600 mt-2">
                    ↑ 前期比+8%
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 優先研修リスト */}
            <div className="mt-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                優先度高の推奨研修
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-white border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">リーダーシップ研修</span>
                    <Badge className="bg-red-100 text-red-800 text-xs">Urgent</Badge>
                  </div>
                  <div className="text-xs text-gray-600">期待スコア: +3.5点</div>
                  <div className="text-xs text-purple-600 mt-1">組織貢献度向上</div>
                </div>
                <div className="p-3 rounded-lg bg-white border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">専門技術研修</span>
                    <Badge className="bg-orange-100 text-orange-800 text-xs">High</Badge>
                  </div>
                  <div className="text-xs text-gray-600">期待スコア: +2.8点</div>
                  <div className="text-xs text-purple-600 mt-1">技術評価向上</div>
                </div>
                <div className="p-3 rounded-lg bg-white border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">コミュニケーション</span>
                    <Badge className="bg-blue-100 text-blue-800 text-xs">Medium</Badge>
                  </div>
                  <div className="text-xs text-gray-600">期待スコア: +1.5点</div>
                  <div className="text-xs text-purple-600 mt-1">施設内貢献度向上</div>
                </div>
              </div>
            </div>

            {/* アクションボタン */}
            <div className="flex gap-3 mt-4">
              <Button 
                className="flex-1" 
                variant="outline"
                onClick={() => setShowTrainingSimulator(true)}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                成長予測シミュレーター
              </Button>
              <Link href="/training-v3" className="flex-1">
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <Zap className="h-4 w-4 mr-2" />
                  V3研修システムで詳細分析
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* 評価設計支援ツール */}
        {showDesignSupport && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  評価設計支援システム
                </CardTitle>
                <Button variant="outline" onClick={() => setShowDesignSupport(false)}>
                  閉じる
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <EvaluationDesignSupport 
                onConfigChange={(config) => {
                  console.log('評価設計設定更新:', config);
                }}
              />
            </CardContent>
          </Card>
        )}

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
                <div className="space-y-2 mt-3">
                  <Button 
                    size="sm" 
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600"
                    onClick={() => setShowDesignSupport(true)}
                  >
                    項目設計支援
                  </Button>
                  <Link href="/evaluation-design/wizard">
                    <Button size="sm" variant="outline" className="w-full">従来ウィザード</Button>
                  </Link>
                </div>
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
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full mt-3 hover:bg-green-50"
                  onClick={() => setIsBulkModalOpen(true)}
                >
                  データ取込
                </Button>
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

      {/* 一括処理モーダル */}
      <EvaluationBulkModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        currentMonth={currentMonth}
        evaluationPeriod="2025年度"
      />

      {/* 研修成長予測シミュレーターモーダル */}
      {showTrainingSimulator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                  成長予測シミュレーター
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => setShowTrainingSimulator(false)}
                  className="hover:bg-gray-100"
                >
                  ×
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              {/* 現在のステータス */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">現在のステータス</h3>
                <div className="grid grid-cols-4 gap-4">
                  <Card className="border-blue-200">
                    <CardContent className="pt-4">
                      <div className="text-sm text-gray-600">現在スコア</div>
                      <div className="text-2xl font-bold text-blue-600">76.8点</div>
                      <Badge className="mt-2 bg-orange-100 text-orange-800">Bグレード</Badge>
                    </CardContent>
                  </Card>
                  <Card className="border-green-200">
                    <CardContent className="pt-4">
                      <div className="text-sm text-gray-600">技術評価</div>
                      <div className="text-2xl font-bold text-green-600">38/50点</div>
                      <Progress value={76} className="mt-2 h-2" />
                    </CardContent>
                  </Card>
                  <Card className="border-purple-200">
                    <CardContent className="pt-4">
                      <div className="text-sm text-gray-600">貢献度評価</div>
                      <div className="text-2xl font-bold text-purple-600">38.8/50点</div>
                      <Progress value={77.6} className="mt-2 h-2" />
                    </CardContent>
                  </Card>
                  <Card className="border-yellow-200">
                    <CardContent className="pt-4">
                      <div className="text-sm text-gray-600">研修完了</div>
                      <div className="text-2xl font-bold text-yellow-600">12/18</div>
                      <Progress value={66.7} className="mt-2 h-2" />
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* シミュレーション結果 */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">予測シミュレーション結果</h3>
                <Alert className="border-green-200 bg-green-50">
                  <Sparkles className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">成長予測</AlertTitle>
                  <AlertDescription className="text-green-700">
                    推奨研修をすべて完了した場合、<strong>82.3点</strong>に到達し、
                    <strong>Aグレード</strong>への昇格が見込まれます。
                  </AlertDescription>
                </Alert>
                
                {/* 成長ロードマップ */}
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-20 text-sm font-medium text-gray-600">Phase 1</div>
                    <div className="flex-1 bg-blue-100 rounded-lg p-3">
                      <div className="font-medium text-blue-800">基礎強化 (1-3ヶ月)</div>
                      <div className="text-xs text-blue-600 mt-1">
                        リーダーシップ研修 → +3.5点 | コミュニケーション研修 → +1.5点
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-20 text-sm font-medium text-gray-600">Phase 2</div>
                    <div className="flex-1 bg-purple-100 rounded-lg p-3">
                      <div className="font-medium text-purple-800">専門性向上 (4-6ヶ月)</div>
                      <div className="text-xs text-purple-600 mt-1">
                        専門技術研修 → +2.8点 | マネジメント研修 → +2.0点
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-20 text-sm font-medium text-gray-600">Phase 3</div>
                    <div className="flex-1 bg-green-100 rounded-lg p-3">
                      <div className="font-medium text-green-800">総合力完成 (7-12ヶ月)</div>
                      <div className="text-xs text-green-600 mt-1">
                        指導者育成研修 → +1.2点 | 組織貢献実践 → +0.5点
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 研修選択オプション */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">研修選択オプション</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="border-blue-200 hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">最速コース</span>
                        <Badge className="bg-red-100 text-red-800">6ヶ月</Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        短期間でAグレードを目指す集中プログラム
                      </div>
                      <div className="mt-2 text-xs">
                        <span className="text-green-600">予測: 81.5点</span> | 
                        <span className="text-blue-600 ml-2">費用: 45万円</span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-purple-200 hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">バランスコース</span>
                        <Badge className="bg-blue-100 text-blue-800">12ヶ月</Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        着実に成長を積み重ねる標準プログラム
                      </div>
                      <div className="mt-2 text-xs">
                        <span className="text-green-600">予測: 82.3点</span> | 
                        <span className="text-blue-600 ml-2">費用: 30万円</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* アクションボタン */}
              <div className="flex gap-3">
                <Link href="/training-v3" className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    <Zap className="h-4 w-4 mr-2" />
                    V3研修システムで詳細計画を作成
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => setShowTrainingSimulator(false)}
                >
                  閉じる
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}