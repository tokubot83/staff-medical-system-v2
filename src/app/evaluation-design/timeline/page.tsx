'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar,
  CheckCircle2,
  CheckCircle,
  Circle,
  Clock,
  AlertCircle,
  ChevronRight,
  FileSpreadsheet,
  Settings,
  PlayCircle,
  HelpCircle,
  Eye,
  Download,
  Upload,
  BarChart3,
  Users,
  Building,
  Target,
  TrendingUp,
  Award,
  Sparkles,
  BookOpen,
  GraduationCap,
  Bell,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import SystemIntegrationService, { CrossSystemAlert } from '@/services/systemIntegrationService';
import IntegrationFlowVisualization from '@/components/IntegrationFlowVisualization';

// 評価担当者向け動的アクションブロック
const EvaluationManagerActionBlock: React.FC = () => {
  const [urgentTasks, setUrgentTasks] = useState<any[]>([]);
  const [todayTasks, setTodayTasks] = useState<any[]>([]);
  const [thisWeekTasks, setThisWeekTasks] = useState<any[]>([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<any[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<any[]>([]);

  useEffect(() => {
    // 現在の日時に基づいて動的にタスクを生成
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    
    // 緊急タスクの設定（研修システム連動）
    const urgent = [];
    const todayTask = [];
    const weekTask = [];
    const deadlines = [];
    const alerts = [];

    // 3月の場合：技術評価実施の重要月
    if (currentMonth === 3) {
      urgent.push({
        id: 'march-urgent-1',
        title: '技術評価シート配布完了確認',
        description: '3月15日実施予定の技術評価シート配布状況確認',
        priority: 'critical',
        deadline: '今日まで',
        action: '配布完了率確認',
        impact: '評価実施スケジュールに直接影響',
        estimatedTime: '20分',
        relatedSystem: '研修システム',
        dependentTraining: '必須研修未完了者17名の対応'
      });
      
      todayTask.push({
        id: 'march-today-1',
        title: '評価実施準備の最終確認',
        description: '技術評価実施に向けた事前チェック',
        priority: 'high',
        deadline: '今日中',
        estimatedTime: '45分'
      });
    }

    // 6月の場合：夏季貢献度評価月
    if (currentMonth === 6) {
      urgent.push({
        id: 'june-urgent-1',
        title: '夏季貢献度評価データ収集',
        description: '各施設からの評価データ収集期限が近づいています',
        priority: 'high',
        deadline: '3日以内',
        action: 'データ収集状況確認',
        impact: '評価スケジュールの遵守',
        estimatedTime: '1時間',
        relatedSystem: '研修システム',
        dependentTraining: '第1四半期研修効果測定データと連携'
      });
    }

    // 12月の場合：冬季貢献度評価と年間総括
    if (currentMonth === 12) {
      urgent.push({
        id: 'dec-urgent-1',
        title: '冬季貢献度評価とROI分析連携',
        description: '年間研修ROI分析結果と貢献度評価の整合性確認',
        priority: 'high',
        deadline: '1週間以内',
        action: 'データ連携確認',
        impact: '年間評価の公正性確保',
        estimatedTime: '2時間',
        relatedSystem: '研修システム',
        dependentTraining: '年間研修ROI分析完了待ち'
      });
    }

    // 1月の場合：評価制度設計更新
    if (currentMonth === 1) {
      urgent.push({
        id: 'jan-urgent-1',
        title: '新年度評価制度設計と研修マッピング',
        description: '前年度データを基に評価項目と研修プログラムの整合性確認',
        priority: 'high',
        deadline: '2週間以内',
        action: 'マッピング表更新',
        impact: '新年度評価の精度向上',
        estimatedTime: '3時間',
        relatedSystem: '研修システム',
        dependentTraining: '前年度研修効果分析データ必須'
      });
    }

    // 評価期限の設定
    deadlines.push({
      id: 'deadline-1',
      title: currentMonth === 3 ? '技術評価実施' : 
              currentMonth === 6 ? '夏季貢献度評価' :
              currentMonth === 12 ? '冬季貢献度評価' : '次回評価',
      date: currentMonth === 3 ? '3月15日' : 
            currentMonth === 6 ? '6月30日' :
            currentMonth === 12 ? '12月20日' : '未定',
      participants: currentMonth === 3 ? '技術職全員（85名）' :
                    currentMonth === 6 ? '全職員（142名）' : 
                    currentMonth === 12 ? '全職員（142名）' : '未定',
      trainingDependency: currentMonth === 3 ? '医療安全研修完了必須' :
                           currentMonth === 6 ? '第1四半期研修効果測定連携' :
                           currentMonth === 12 ? '年間研修ROI分析連携' : '未定'
    });

    // システムアラートの設定
    alerts.push({
      id: 'alert-1',
      type: 'integration',
      title: '研修システム連携状況',
      status: currentMonth === 3 ? 'attention' : currentMonth === 6 ? 'good' : 'normal',
      message: currentMonth === 3 ? '必須研修未完了者の評価実施可否要確認' :
               currentMonth === 6 ? '研修効果測定データとの相関分析準備完了' :
               '正常に連携中',
      action: '連携状況詳細確認'
    });

    setUrgentTasks(urgent);
    setTodayTasks(todayTask);
    setThisWeekTasks(weekTask);
    setUpcomingDeadlines(deadlines);
    setSystemAlerts(alerts);
  }, []);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <Badge className="bg-red-600 text-white animate-pulse">🚨 緊急</Badge>;
      case 'high':
        return <Badge className="bg-orange-500 text-white">高優先</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500 text-white">中優先</Badge>;
      default:
        return <Badge variant="outline">通常</Badge>;
    }
  };

  return (
    <div className="mb-8">
      <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-purple-600 rounded-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">評価担当者 - アクションセンター</h3>
              <p className="text-sm text-gray-600 mt-1">研修システムと連動した評価業務の優先タスクを表示</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 緊急タスク */}
            <div>
              <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                緊急対応 ({urgentTasks.length})
              </h4>
              <div className="space-y-3">
                {urgentTasks.map((task) => (
                  <Card key={task.id} className="border border-red-200 bg-red-50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-medium text-sm text-red-900">{task.title}</h5>
                        {getPriorityBadge(task.priority)}
                      </div>
                      <p className="text-xs text-red-700 mb-3">{task.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-red-500" />
                          <span className="text-xs text-red-600">期限: {task.deadline}</span>
                        </div>
                        {task.relatedSystem && (
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-3 w-3 text-purple-500" />
                            <span className="text-xs text-purple-600">{task.relatedSystem}: {task.dependentTraining}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Target className="h-3 w-3 text-blue-500" />
                          <span className="text-xs text-blue-600">影響: {task.impact}</span>
                        </div>
                      </div>
                      <Button size="sm" className="mt-3 w-full bg-red-600 hover:bg-red-700">
                        {task.action}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                {urgentTasks.length === 0 && (
                  <p className="text-sm text-gray-500 text-center p-4">緊急タスクはありません</p>
                )}
              </div>
            </div>

            {/* 今日のタスク */}
            <div>
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                今日のタスク ({todayTasks.length})
              </h4>
              <div className="space-y-3">
                {todayTasks.map((task) => (
                  <Card key={task.id} className="border border-blue-200 bg-blue-50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-medium text-sm text-blue-900">{task.title}</h5>
                        {getPriorityBadge(task.priority)}
                      </div>
                      <p className="text-xs text-blue-700 mb-3">{task.description}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-3 w-3 text-blue-500" />
                        <span className="text-xs text-blue-600">所要時間: {task.estimatedTime}</span>
                      </div>
                      <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                        開始
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                {todayTasks.length === 0 && (
                  <p className="text-sm text-gray-500 text-center p-4">今日のタスクはありません</p>
                )}
              </div>
            </div>

            {/* 評価スケジュール・システム連携状況 */}
            <div>
              <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                評価予定・システム連携
              </h4>
              <div className="space-y-3">
                {upcomingDeadlines.map((deadline) => (
                  <Card key={deadline.id} className="border border-purple-200 bg-purple-50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-sm text-purple-900">{deadline.title}</h5>
                        <Badge className="bg-purple-600 text-white">予定</Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-purple-700">日程: {deadline.date}</p>
                        <p className="text-xs text-purple-700">対象: {deadline.participants}</p>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3 text-green-500" />
                          <p className="text-xs text-green-700">研修連携: {deadline.trainingDependency}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {systemAlerts.map((alert) => (
                  <Card key={alert.id} className="border border-green-200 bg-green-50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-sm text-green-900">{alert.title}</h5>
                        <Badge className={
                          alert.status === 'good' ? 'bg-green-600 text-white' :
                          alert.status === 'attention' ? 'bg-orange-500 text-white' :
                          'bg-gray-500 text-white'
                        }>
                          {alert.status === 'good' ? '良好' : alert.status === 'attention' ? '要注意' : '正常'}
                        </Badge>
                      </div>
                      <p className="text-xs text-green-700 mb-2">{alert.message}</p>
                      <Button size="sm" variant="outline" className="w-full">
                        {alert.action}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface MonthTask {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending' | 'locked';
  dueDate?: string;
  actions?: Array<{
    label: string;
    href?: string;
    onClick?: () => void;
  }>;
  subtasks?: Array<{
    id: string;
    title: string;
    completed: boolean;
  }>;
}

interface TrainingTask {
  id: string;
  title: string;
  status: 'completed' | 'in-progress' | 'pending';
  impact?: string;
  dependency?: string;
}

interface MonthSchedule {
  month: number;
  name: string;
  status: 'completed' | 'current' | 'upcoming' | 'inactive';
  tasks: MonthTask[];
  trainingTasks?: TrainingTask[];
  highlight?: boolean;
  alerts?: CrossSystemAlert[];
  integrationNote?: string;
}

export default function EvaluationTimelinePage() {
  // 現在月を取得
  const currentMonth = new Date().getMonth() + 1;
  
  const [selectedMonth, setSelectedMonth] = useState(() => {
    return currentMonth;
  });
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [simulationMode, setSimulationMode] = useState(false);
  const [systemAlerts, setSystemAlerts] = useState<CrossSystemAlert[]>([]);
  const [showDataFlow, setShowDataFlow] = useState(false);
  
  useEffect(() => {
    // システム統合アラートを取得
    const alerts = SystemIntegrationService.getAlertsForSystem('evaluation');
    setSystemAlerts(alerts);
  }, []);
  
  // タスク完了ハンドラー
  const handleTaskCompletion = (taskId: string, completed: boolean) => {
    // SystemIntegrationServiceでタスク状態を同期
    SystemIntegrationService.syncTaskCompletion(taskId, 'evaluation', completed);
    
    // 同期アクティビティを記録
    SystemIntegrationService.addSyncActivity(
      'evaluation',
      completed ? `タスク完了: ${taskId}` : `タスク未完了に変更: ${taskId}`,
      taskId
    );
    
    // アラートを更新
    const updatedAlerts = SystemIntegrationService.getAlertsForSystem('evaluation');
    setSystemAlerts(updatedAlerts);
  };

  // 年間スケジュールデータ（教育・研修管理ページと同じ構造に統一）
  const yearSchedule: MonthSchedule[] = [
    // 1月 - 評価制度設計・研修計画調整期
    {
      month: 1,
      name: '1月',
      status: currentMonth === 1 ? 'current' : currentMonth > 1 ? 'completed' : 'upcoming',
      highlight: true,
      alerts: systemAlerts.filter(alert => alert.month === 1),
      integrationNote: '評価制度設計と研修計画調整の重要な連携月',
      tasks: [
        {
          id: 'jan-eval-1',
          title: '評価制度設計・更新',
          description: '新年度評価制度の詳細設計と配点調整',
          status: currentMonth > 1 ? 'completed' : 'pending',
          dueDate: '1月31日',
          subtasks: [
            { id: 'jan-eval-1-1', title: '法人統一項目（30点）の配分設計', completed: currentMonth > 1 },
            { id: 'jan-eval-1-2', title: '施設特化項目（20点）の選定', completed: currentMonth > 1 },
            { id: 'jan-eval-1-3', title: '技術評価項目（50点）の更新', completed: currentMonth > 1 }
          ]
        }
      ],
      trainingTasks: [
        {
          id: 'jan-training-1',
          title: '前年度評価データから研修効果分析',
          status: currentMonth > 1 ? 'completed' : 'pending',
          impact: '研修ROI 120%達成目標',
          dependency: '12月冬季貢献度評価結果（70点未満対象）'
        },
        {
          id: 'jan-training-2',
          title: '評価項目と研修プログラムのマッピング',
          status: currentMonth > 1 ? 'completed' : 'pending',
          impact: '全項目カバー率100%',
          dependency: '前年度年間技術評価総合スコア（65点未満・要強化項目）'
        }
      ]
    },
    
    // 3月 - 技術評価実施月
    {
      month: 3,
      name: '3月',
      status: currentMonth === 3 ? 'current' : currentMonth > 3 ? 'completed' : 'upcoming',
      highlight: true,
      alerts: systemAlerts.filter(alert => alert.month === 3),
      integrationNote: '技術評価実施と研修効果測定の最重要連携月',
      tasks: [
        {
          id: 'mar-eval-1',
          title: '技術評価実施（50点）',
          description: '年度末技術評価・年間総合評価決定',
          status: currentMonth > 3 ? 'completed' : 'pending',
          dueDate: '3月15日',
          subtasks: [
            { id: 'mar-eval-1-1', title: '評価シート配布', completed: currentMonth > 3 },
            { id: 'mar-eval-1-2', title: '上司評価・本人評価の実施', completed: currentMonth > 3 },
            { id: 'mar-eval-1-3', title: '100点満点スコア確定', completed: currentMonth > 3 },
            { id: 'mar-eval-1-4', title: '年間総合評価決定', completed: currentMonth > 3 }
          ]
        }
      ],
      trainingTasks: [
        {
          id: 'mar-training-1',
          title: '評価結果即時分析→個別研修計画生成',
          status: currentMonth > 3 ? 'completed' : 'pending',
          impact: '平均スコア+5点向上目標',
          dependency: '技術評価実施結果（リアルタイム）'
        },
        {
          id: 'mar-training-2',
          title: 'スコアギャップ基づく優先研修リスト作成',
          status: currentMonth > 3 ? 'completed' : 'pending',
          impact: '個別最適化研修',
          dependency: '100点満点スコア確定データ'
        }
      ]
    },
    
    // 6月 - 夏季貢献度評価月
    {
      month: 6,
      name: '6月',
      status: currentMonth === 6 ? 'current' : currentMonth > 6 ? 'completed' : 'upcoming',
      highlight: true,
      alerts: systemAlerts.filter(alert => alert.month === 6),
      integrationNote: '夏季貢献度評価と第1四半期研修効果測定の連携',
      tasks: [
        {
          id: 'jun-eval-1',
          title: '夏季貢献度評価（25点）',
          description: '上半期の施設・法人貢献度を評価',
          status: currentMonth > 6 ? 'completed' : 'pending',
          dueDate: '6月30日',
          subtasks: [
            { id: 'jun-eval-1-1', title: '各施設から評価データ収集', completed: currentMonth > 6 },
            { id: 'jun-eval-1-2', title: 'Excelデータ取込・検証', completed: currentMonth > 6 },
            { id: 'jun-eval-1-3', title: '相対評価ランキング作成', completed: currentMonth > 6 },
            { id: 'jun-eval-1-4', title: '評価確定・承認', completed: currentMonth > 6 }
          ],
          actions: [
            { label: 'Excelテンプレート', href: '/templates/contribution-summer.xlsx' },
            { label: '取込履歴', href: '/evaluation-design/import-history' }
          ]
        }
      ],
      trainingTasks: [
        {
          id: 'jun-training-1',
          title: '第1四半期研修効果測定',
          status: currentMonth > 6 ? 'completed' : 'pending',
          impact: '貢献度評価+3点向上',
          dependency: '4-5月実施研修完了データ'
        },
        {
          id: 'jun-training-2',
          title: '貢献度スコアと研修受講の相関分析',
          status: currentMonth > 6 ? 'completed' : 'pending',
          impact: '研修効果の定量的証明',
          dependency: '夏季貢献度評価結果（リアルタイム）'
        }
      ]
    },
    
    // 12月 - 冬季貢献度評価月
    {
      month: 12,
      name: '12月',
      status: currentMonth === 12 ? 'current' : currentMonth > 12 || currentMonth < 4 ? 'completed' : 'upcoming',
      highlight: true,
      alerts: systemAlerts.filter(alert => alert.month === 12),
      integrationNote: '冬季貢献度評価と年間研修ROI分析の重要な連携月',
      tasks: [
        {
          id: 'dec-eval-1',
          title: '冬季貢献度評価（25点）',
          description: '下半期の施設・法人貢献度を評価',
          status: currentMonth > 12 || currentMonth < 4 ? 'completed' : 'pending',
          dueDate: '12月20日',
          subtasks: [
            { id: 'dec-eval-1-1', title: '各施設から評価データ収集', completed: currentMonth > 12 || currentMonth < 4 },
            { id: 'dec-eval-1-2', title: 'Excelデータ取込・検証', completed: currentMonth > 12 || currentMonth < 4 },
            { id: 'dec-eval-1-3', title: '相対評価ランキング作成', completed: currentMonth > 12 || currentMonth < 4 },
            { id: 'dec-eval-1-4', title: '年間貢献度スコア確定', completed: currentMonth > 12 || currentMonth < 4 }
          ]
        }
      ],
      trainingTasks: [
        {
          id: 'dec-training-1',
          title: '年間研修ROI分析',
          status: currentMonth > 12 || currentMonth < 4 ? 'completed' : 'pending',
          impact: 'ROI 125%達成',
          dependency: '年間貢献度スコア確定データ'
        },
        {
          id: 'dec-training-2',
          title: '高成果者の研修パターン分析',
          status: currentMonth > 12 || currentMonth < 4 ? 'completed' : 'pending',
          impact: '成功モデルの横展開',
          dependency: '冬季評価上位者の研修履歴'
        }
      ]
    }
  ];

  const selectedMonthData = yearSchedule.find(m => m.month === selectedMonth);
  const importantDates = yearSchedule.filter(m => m.highlight);
  
  // タスクステータスのアイコンを取得
  const getTrainingTaskIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'pending':
        return <Circle className="h-4 w-4 text-gray-400" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };
  
  // システム間同期状態をチェック
  const isTaskSynced = (taskId: string) => {
    return SystemIntegrationService.getTaskCompletionStatus(taskId, 'evaluation');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-blue-600 animate-pulse" />;
      case 'pending':
        return <Circle className="h-5 w-5 text-gray-400" />;
      case 'locked':
        return <AlertCircle className="h-5 w-5 text-gray-300" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getMonthBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">完了</Badge>;
      case 'current':
        return <Badge className="bg-blue-100 text-blue-800">実施中</Badge>;
      case 'upcoming':
        return <Badge className="bg-yellow-100 text-yellow-800">予定</Badge>;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto p-6">
        {/* ヘッダー情報 */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">2025年度 評価スケジュール管理</h1>
            <p className="text-gray-600">年間の評価業務を時系列で管理・実行</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              年間計画をエクスポート
            </Button>
            <Button variant="outline" size="sm">
              <HelpCircle className="h-4 w-4 mr-2" />
              ヘルプ
            </Button>
          </div>
        </div>

        {/* 重要日程サマリー */}
        <Card className="mb-6 border-2 border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              年間重要日程
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">6月</div>
                <div className="text-sm text-gray-600">夏季貢献度評価</div>
                <div className="text-xs font-medium">25点</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">12月</div>
                <div className="text-sm text-gray-600">冬季貢献度評価</div>
                <div className="text-xs font-medium">25点</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">3月</div>
                <div className="text-sm text-gray-600">技術評価</div>
                <div className="text-xs font-medium">50点</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">3月末</div>
                <div className="text-sm text-gray-600">総合評価決定</div>
                <div className="text-xs font-medium">100点満点</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* システム連携アラート */}
        {systemAlerts.length > 0 && (
          <Card className="mb-6 border-2 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-600" />
                システム連携アラート ({systemAlerts.length}件)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {systemAlerts.slice(0, 3).map((alert) => (
                  <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                    alert.priority === 'high' ? 'border-l-red-500 bg-red-50' :
                    alert.priority === 'medium' ? 'border-l-orange-500 bg-orange-50' :
                    'border-l-yellow-500 bg-yellow-50'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                        {alert.month && (
                          <p className="text-xs text-gray-600 mt-1">対象月: {alert.month}月</p>
                        )}
                      </div>
                      <Badge className={
                        alert.priority === 'high' ? 'bg-red-100 text-red-800' :
                        alert.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }>
                        {alert.priority === 'high' ? '高' : alert.priority === 'medium' ? '中' : '低'}
                      </Badge>
                    </div>
                  </div>
                ))}
                {systemAlerts.length > 3 && (
                  <div className="text-center pt-2">
                    <Button variant="outline" size="sm">
                      さらに{systemAlerts.length - 3}件を表示
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 評価担当者向けアクションセンター */}
        <EvaluationManagerActionBlock />

        {/* メインコンテンツ */}
        <div className="grid grid-cols-12 gap-6">
          {/* 年間タイムライン */}
          <div className="col-span-3">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">年間スケジュール</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {yearSchedule.map((month) => (
                    <button
                      key={month.month}
                      onClick={() => setSelectedMonth(month.month)}
                      className={`w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                        selectedMonth === month.month ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                      } ${month.highlight ? 'font-semibold' : ''} ${
                        month.status === 'current' ? 'bg-gradient-to-r from-blue-100 to-indigo-100 border-l-4 border-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {month.status === 'completed' && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                        {month.status === 'current' && <Clock className="h-4 w-4 text-blue-600 animate-pulse" />}
                        {month.status === 'upcoming' && <Circle className="h-4 w-4 text-gray-400" />}
                        {month.status === 'inactive' && <Circle className="h-4 w-4 text-gray-300" />}
                        <span className={`${
                          month.highlight ? 'text-purple-600 font-semibold' : ''
                        } ${
                          month.status === 'current' ? 'text-blue-800 font-bold' : ''
                        }`}>
                          {month.name}
                        </span>
                        {month.alerts && month.alerts.length > 0 && (
                          <Bell className="h-3 w-3 text-orange-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {(month.tasks?.length || 0) > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {month.tasks.length}
                          </Badge>
                        )}
                        {(month.trainingTasks?.length || 0) > 0 && (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            研{month.trainingTasks.length}
                          </Badge>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 月別詳細（教育・研修管理ページと同じ構造） */}
          <div className="col-span-9">
            <div className="space-y-6">
              {/* 選択月の情報ヘッダー */}
              {selectedMonthData && (
                <Card className={`border-2 ${selectedMonthData.status === 'current' ? 'border-blue-500 bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 shadow-2xl' : selectedMonthData.highlight ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg' : 'border-gray-200'}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-bold text-2xl ${selectedMonthData.status === 'current' ? 'text-blue-800' : selectedMonthData.highlight ? 'text-purple-800' : 'text-gray-800'}`}>
                          {selectedMonthData.name}
                        </h3>
                        {selectedMonthData.status === 'current' && <Badge className="bg-blue-600 text-white animate-pulse">🎯 実施中</Badge>}
                        {selectedMonthData.highlight && selectedMonthData.status !== 'current' && (
                          <Badge className="bg-purple-600 text-white">重要月</Badge>
                        )}
                      </div>
                      {selectedMonthData.alerts && selectedMonthData.alerts.length > 0 && (
                        <Badge className="bg-orange-100 text-orange-800">
                          <Bell className="h-3 w-3 mr-1" />
                          {selectedMonthData.alerts.length}件のアラート
                        </Badge>
                      )}
                    </div>
                    {selectedMonthData.integrationNote && (
                      <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-semibold text-gray-700">システム連携:</span>
                          <span className="text-sm text-purple-700">{selectedMonthData.integrationNote}</span>
                        </div>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      {/* 左側：評価管理タスク */}
                      <div className="border-r pr-4">
                        <h4 className="text-md font-semibold mb-3 text-purple-800 flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          評価管理タスク
                        </h4>
                        <div className="space-y-2">
                          {selectedMonthData.tasks && selectedMonthData.tasks.length > 0 ? (
                            selectedMonthData.tasks.map((task) => (
                              <div key={task.id} className={`flex items-center gap-2 p-2 rounded-lg ${
                                task.status === 'completed' ? 'bg-green-50' :
                                task.status === 'in-progress' ? 'bg-blue-50' :
                                task.status === 'pending' ? 'bg-yellow-50' : 'bg-gray-50'
                              }`}>
                                {getStatusIcon(task.status)}
                                <div className="flex-1">
                                  <span className={`text-sm font-medium ${
                                    task.status === 'completed' ? 'text-green-700' :
                                    task.status === 'in-progress' ? 'text-blue-700' :
                                    task.status === 'pending' ? 'text-yellow-700' : 'text-gray-700'
                                  }`}>
                                    {task.title}
                                  </span>
                                  {task.dueDate && (
                                    <div className="text-xs text-gray-600 mt-1">期限: {task.dueDate}</div>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center p-3 bg-gray-100 rounded-lg">
                              <span className="text-sm text-gray-600">通常の評価業務はありません</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* 右側：研修システム連携状況 */}
                      <div className="pl-4">
                        <h4 className="text-md font-semibold mb-3 text-blue-800 flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          研修システム連携
                        </h4>
                        <div className="space-y-2">
                          {selectedMonthData.trainingTasks && selectedMonthData.trainingTasks.length > 0 ? (
                            selectedMonthData.trainingTasks.map((task) => (
                              <div key={task.id} className={`flex items-center gap-2 p-2 rounded-lg ${
                                task.status === 'completed' ? 'bg-green-50' :
                                task.status === 'in-progress' ? 'bg-blue-50' :
                                task.status === 'pending' ? 'bg-yellow-50' : 'bg-gray-50'
                              }`}>
                                {getTrainingTaskIcon(task.status)}
                                <div className="flex-1">
                                  <span className={`text-sm font-medium ${
                                    task.status === 'completed' ? 'text-green-700' :
                                    task.status === 'in-progress' ? 'text-blue-700' :
                                    task.status === 'pending' ? 'text-yellow-700' : 'text-gray-700'
                                  }`}>
                                    {task.title}
                                  </span>
                                  {task.impact && (
                                    <div className="text-xs text-blue-600 mt-1">効果: {task.impact}</div>
                                  )}
                                  {task.dependency && (
                                    <div className="text-xs text-gray-600 mt-1">依存: {task.dependency}</div>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center p-3 bg-gray-100 rounded-lg">
                              <span className="text-sm text-gray-600">研修連携タスクはありません</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}