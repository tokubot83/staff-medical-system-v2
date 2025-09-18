'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import IntegrationFlowVisualization from '@/components/IntegrationFlowVisualization';
import SystemIntegrationService, { CrossSystemAlert } from '@/services/systemIntegrationService';
import EvaluationBulkModal from '@/components/evaluation/EvaluationBulkModal';
import EvaluationDesignSupport from '@/components/evaluation/EvaluationDesignSupport';
import { 
  Calendar,
  CheckCircle2,
  CheckCircle,
  Circle,
  Clock,
  AlertCircle,
  ChevronRight,
  Settings,
  HelpCircle,
  Eye,
  Upload,
  Download,
  FileSpreadsheet,
  Target,
  TrendingUp,
  Award,
  Sparkles,
  BookOpen,
  GraduationCap,
  Bell,
  AlertTriangle,
  BarChart3,
  Users,
  Building,
  Database,
  Shield,
  Zap,
  FlaskConical,
  FileCheck,
  ArrowRight,
  Star
} from 'lucide-react';
import Link from 'next/link';

// 評価担当者向け動的アクションセンター
const EvaluationManagerActionCenter: React.FC = () => {
  const [urgentTasks, setUrgentTasks] = useState<any[]>([]);
  const [todayTasks, setTodayTasks] = useState<any[]>([]);
  const [thisWeekTasks, setThisWeekTasks] = useState<any[]>([]);

  useEffect(() => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    
    const urgent = [];
    const todayTask = [];
    const weekTask = [];

    // 3月の場合：技術評価実施の重要月
    if (currentMonth === 3) {
      urgent.push({
        id: 'march-urgent-1',
        title: '技術評価シート配布完了確認',
        description: '3月15日実施予定の技術評価シート配布状況確認',
        action: '配布状況確認',
        estimatedTime: '20分',
        dependency: '必須研修未完了者17名の対応'
      });
    }

    // 6月の場合：夏季貢献度評価月
    if (currentMonth === 6) {
      todayTask.push({
        id: 'june-today-1',
        title: '夏季貢献度評価データ収集',
        description: '各施設からの評価データ収集期限が近づいています',
        action: 'データ収集開始',
        estimatedTime: '1時間',
        dependency: '第1四半期研修効果測定データと連携'
      });
    }

    // 1月の場合：評価制度設計更新
    if (currentMonth === 1) {
      weekTask.push({
        id: 'jan-week-1',
        title: '新年度評価制度設計',
        description: '前年度データを基に評価項目と研修プログラムの整合性確認',
        action: 'マッピング表更新',
        estimatedTime: '3時間',
        dependency: '前年度研修効果分析データ必須'
      });
    }

    // 次回評価情報
    const nextEvaluation = {
      id: 'next-eval',
      title: '次回評価',
      date: currentMonth === 3 ? '3月15日' : 
            currentMonth === 6 ? '6月30日' :
            currentMonth === 12 ? '12月20日' : '未定',
      participants: currentMonth === 3 ? '技術職全員（85名）' :
                    currentMonth === 6 ? '全職員（142名）' : 
                    currentMonth === 12 ? '全職員（142名）' : '未定',
      trainingDependency: currentMonth === 3 ? '医療安全研修完了必須' :
                           currentMonth === 6 ? '第1四半期研修効果測定連携' :
                           currentMonth === 12 ? '年間研修ROI分析連携' : '未定'
    };

    weekTask.push(nextEvaluation);

    setUrgentTasks(urgent);
    setTodayTasks(todayTask);
    setThisWeekTasks(weekTask);
  }, []);

  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-purple-600 rounded-lg">
            <Target className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">評価担当者 - アクションセンター</h3>
            <p className="text-sm text-gray-600 mt-1">研修スケジュールと連動した優先タスクを表示</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 緊急対応 */}
          <div className="space-y-4">
            <h4 className="font-semibold text-red-700 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              🔴 緊急対応 ({urgentTasks.length}件)
            </h4>
            <div className="space-y-3">
              {urgentTasks.map((task) => (
                <div key={task.id} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h5 className="font-medium text-red-800 text-sm mb-2">{task.title}</h5>
                  <p className="text-xs text-red-700 mb-2">{task.description}</p>
                  <div className="space-y-1 text-xs">
                    <p><span className="font-medium">所要時間:</span> {task.estimatedTime}</p>
                    {task.dependency && (
                      <p className="text-purple-700 font-medium">📚 研修連携: {task.dependency}</p>
                    )}
                  </div>
                  <Button size="sm" className="mt-3 w-full bg-red-600 hover:bg-red-700">
                    {task.action}
                  </Button>
                </div>
              ))}
              {urgentTasks.length === 0 && (
                <p className="text-sm text-gray-500 text-center p-4">緊急タスクはありません</p>
              )}
            </div>
          </div>

          {/* 今日中 */}
          <div className="space-y-4">
            <h4 className="font-semibold text-orange-700 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              🟡 今日中 ({todayTasks.length}件)
            </h4>
            <div className="space-y-3">
              {todayTasks.map((task) => (
                <div key={task.id} className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h5 className="font-medium text-orange-800 text-sm mb-2">{task.title}</h5>
                  <p className="text-xs text-orange-700 mb-2">{task.description}</p>
                  <div className="space-y-1 text-xs">
                    <p><span className="font-medium">所要時間:</span> {task.estimatedTime}</p>
                    {task.dependency && (
                      <p className="text-purple-700 font-medium">📚 研修連携: {task.dependency}</p>
                    )}
                  </div>
                  <Button size="sm" className="mt-3 w-full bg-orange-600 hover:bg-orange-700">
                    {task.action}
                  </Button>
                </div>
              ))}
              {todayTasks.length === 0 && (
                <p className="text-sm text-gray-500 text-center p-4">今日のタスクはありません</p>
              )}
            </div>
          </div>

          {/* 今週・評価連携 */}
          <div className="space-y-4">
            <h4 className="font-semibold text-green-700 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              🟢 今週・評価連携 ({thisWeekTasks.length}件)
            </h4>
            <div className="space-y-3">
              {thisWeekTasks.map((task) => (
                <div key={task.id} className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-green-600" />
                    <h5 className="font-medium text-green-800 text-sm">{task.title}</h5>
                  </div>
                  <div className="space-y-1 text-xs">
                    {task.date && <p><span className="font-medium">実施日:</span> {task.date}</p>}
                    {task.participants && <p><span className="font-medium">対象:</span> {task.participants}</p>}
                    {task.trainingDependency && (
                      <p className="text-green-700 font-medium">📚 必要研修: {task.trainingDependency}</p>
                    )}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-xs h-7 px-2">
                      研修状況確認
                    </Button>
                    <Button size="sm" variant="outline" className="border-green-300 text-green-700 text-xs h-7 px-2">
                      評価詳細
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* アラート */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-yellow-600" />
              <div>
                <h4 className="font-medium text-yellow-800">評価アラート</h4>
                <p className="text-sm text-yellow-700">必須研修未完了者: 12名 - 次回評価に要注意</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="text-xs bg-yellow-600 hover:bg-yellow-700">
                一括通知
              </Button>
              <Link href="/annual-integration-summary">
                <Button size="sm" variant="outline" className="text-xs border-yellow-400 text-yellow-700">
                  統合管理画面
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// 月別タスクインターフェース
interface MonthTask {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending' | 'locked';
  dueDate?: string;
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
  integrationNote?: string;
}

export default function EvaluationDesignPage() {
  const currentMonth = new Date().getMonth() + 1;
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [systemAlerts, setSystemAlerts] = useState<CrossSystemAlert[]>([]);
  const [expandedMonth, setExpandedMonth] = useState<number | null>(currentMonth);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [showDesignSupport, setShowDesignSupport] = useState(false);

  useEffect(() => {
    const alerts = SystemIntegrationService.getAlertsForSystem('evaluation');
    setSystemAlerts(alerts);
  }, []);

  // 年間スケジュールデータ（教育・研修管理ページと同じ構造）
  const yearSchedule: MonthSchedule[] = [
    {
      month: 1,
      name: '1月',
      status: currentMonth === 1 ? 'current' : currentMonth > 1 ? 'completed' : 'upcoming',
      highlight: true,
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
          dependency: '12月冬季貢献度評価結果'
        }
      ]
    },
    {
      month: 2,
      name: '2月',
      status: currentMonth === 2 ? 'current' : currentMonth > 2 ? 'completed' : 'upcoming',
      tasks: [
        {
          id: 'feb-1',
          title: '評価制度の承認',
          description: '法人本部での最終承認と調整',
          status: currentMonth > 2 ? 'completed' : 'pending',
          dueDate: '2月28日'
        }
      ]
    },
    {
      month: 3,
      name: '3月',
      status: currentMonth === 3 ? 'current' : currentMonth > 3 ? 'completed' : 'upcoming',
      highlight: true,
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
          dependency: '技術評価実施結果'
        }
      ]
    },
    {
      month: 4,
      name: '4月',
      status: currentMonth === 4 ? 'current' : currentMonth > 4 ? 'completed' : 'upcoming',
      tasks: [
        {
          id: 'apr-1',
          title: '前年度評価結果フィードバック',
          description: '前年度の最終評価結果を各施設・職員へフィードバック',
          status: currentMonth > 4 ? 'completed' : 'pending'
        }
      ]
    },
    {
      month: 5,
      name: '5月',
      status: currentMonth === 5 ? 'current' : currentMonth > 5 ? 'completed' : 'upcoming',
      tasks: [
        {
          id: 'may-1',
          title: '上半期活動計画策定',
          description: '施設・法人の上半期活動計画を策定',
          status: currentMonth > 5 ? 'completed' : 'pending'
        }
      ]
    },
    {
      month: 6,
      name: '6月',
      status: currentMonth === 6 ? 'current' : currentMonth > 6 ? 'completed' : 'upcoming',
      highlight: true,
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
        }
      ]
    },
    {
      month: 7,
      name: '7月',
      status: currentMonth === 7 ? 'current' : currentMonth > 7 ? 'completed' : 'upcoming',
      tasks: [
        {
          id: 'jul-1',
          title: '夏季評価結果通知',
          description: '夏季貢献度評価の結果を通知',
          status: currentMonth > 7 ? 'completed' : 'pending'
        }
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
        {
          id: 'oct-1',
          title: '下半期活動計画策定',
          description: '施設・法人の下半期活動計画を策定',
          status: currentMonth > 10 ? 'completed' : 'pending'
        }
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
        }
      ]
    }
  ];

  const selectedMonthData = yearSchedule.find(m => m.month === selectedMonth);
  const importantMonths = yearSchedule.filter(m => m.highlight);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-blue-600 animate-pulse" />;
      case 'pending':
        return <Circle className="h-5 w-5 text-gray-400" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto p-6">
        {/* ヘッダー情報 */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">2025年度 評価管理</h1>
            <p className="text-gray-600">年間スケジュールに沿った評価業務の管理・実行</p>
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

        {/* 評価担当者向けアクションセンター */}
        <div className="mb-6">
          <EvaluationManagerActionCenter />
        </div>

        {/* 評価年間計画カード */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              評価制度年間計画
              <Badge className="bg-purple-100 text-purple-800">研修連携</Badge>
            </CardTitle>
            <CardDescription>
              研修管理ダッシュボードとリアルタイム連携 - 詳細な依存関係表示
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* システムアラート */}
            {systemAlerts.length > 0 && (
              <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 mb-3">
                  <Bell className="h-5 w-5 text-orange-600" />
                  <span className="font-semibold text-orange-800">評価システムアラート ({systemAlerts.length}件)</span>
                </div>
                <div className="space-y-2">
                  {systemAlerts.slice(0, 2).map((alert) => (
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
                        <Button size="sm" variant="outline" className="text-xs">
                          解決
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 連携状況 */}
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="font-semibold text-gray-800">研修システム連携状況</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>データ同期: リアルタイム</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>依存関係: 全4月で確立</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <span>要注意: 3月評価前研修完了</span>
                </div>
              </div>
            </div>

            {/* 月選択ボタン */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="font-medium text-gray-700">月を選択:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {importantMonths.map((month) => (
                  <button
                    key={month.month}
                    onClick={() => setSelectedMonth(month.month)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedMonth === month.month
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                    }`}
                  >
                    {month.name}
                    <span className="ml-1">✨</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 選択月の詳細 */}
            {selectedMonthData && (
              <div className="space-y-6">
                <Card className={`border-2 ${
                  selectedMonthData.status === 'current' 
                    ? 'border-blue-500 bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 shadow-2xl' 
                    : selectedMonthData.highlight 
                      ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg' 
                      : 'border-gray-200'
                }`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-bold text-2xl ${
                          selectedMonthData.status === 'current' ? 'text-blue-800' : 
                          selectedMonthData.highlight ? 'text-purple-800' : 'text-gray-800'
                        }`}>
                          {selectedMonthData.name}
                        </h3>
                        {selectedMonthData.status === 'current' && (
                          <Badge className="bg-blue-600 text-white animate-pulse">🎯 実施中</Badge>
                        )}
                        {selectedMonthData.highlight && selectedMonthData.status !== 'current' && (
                          <Badge className="bg-purple-600 text-white">重要月</Badge>
                        )}
                      </div>
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
                                {getStatusIcon(task.status)}
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

                    {/* アクションボタン */}
                    <div className="mt-4 pt-4 border-t flex gap-2">
                      {selectedMonth === 1 && (
                        <>
                          <Button 
                            className="bg-gradient-to-r from-blue-500 to-indigo-600"
                            onClick={() => setShowDesignSupport(true)}
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            評価設計支援ツール
                          </Button>
                          <Link href="/evaluation-design/wizard">
                            <Button variant="outline">
                              <Zap className="h-4 w-4 mr-2" />
                              設計ウィザード
                            </Button>
                          </Link>
                        </>
                      )}
                      {(selectedMonth === 6 || selectedMonth === 12) && (
                        <>
                          <Button 
                            variant="outline"
                            onClick={() => setIsBulkModalOpen(true)}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Excelデータ取込
                          </Button>
                          <Link href="/evaluation-design/templates">
                            <Button variant="outline">
                              <FileSpreadsheet className="h-4 w-4 mr-2" />
                              評価テンプレート
                            </Button>
                          </Link>
                        </>
                      )}
                      {selectedMonth === 3 && (
                        <Button 
                          variant="outline"
                          onClick={() => setIsBulkModalOpen(true)}
                        >
                          <FileCheck className="h-4 w-4 mr-2" />
                          技術評価を開始
                        </Button>
                      )}
                      <Link href="/education?month=${selectedMonth}">
                        <Button variant="outline" className="ml-auto">
                          <BookOpen className="h-4 w-4 mr-2" />
                          研修管理で詳細確認
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* 評価・研修連携サマリー */}
            <Card className="mt-6 border-2 border-blue-400 bg-gradient-to-r from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  評価・研修連携サマリー
                </CardTitle>
                <CardDescription>
                  リアルタイムデータに基づく連携効果測定
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-white rounded-lg border hover:shadow-md transition-all">
                    <div className="text-2xl font-bold text-blue-600">12</div>
                    <div className="text-xs text-gray-600">評価タスク総数</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border hover:shadow-md transition-all">
                    <div className="text-2xl font-bold text-purple-600">4</div>
                    <div className="text-xs text-gray-600">重要連携月</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border hover:shadow-md transition-all">
                    <div className="text-2xl font-bold text-green-600">100%</div>
                    <div className="text-xs text-gray-600">連携カバレッジ</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border hover:shadow-md transition-all">
                    <div className="text-2xl font-bold text-yellow-600">+5.2点</div>
                    <div className="text-xs text-gray-600">平均スコア向上</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-white rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">評価完了率</span>
                      <span className="text-lg font-bold text-green-600">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div className="p-3 bg-white rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">研修連動率</span>
                      <span className="text-lg font-bold text-blue-600">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div className="p-3 bg-white rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">年間ROI</span>
                      <span className="text-lg font-bold text-purple-600">118%</span>
                    </div>
                    <Progress value={100} className="h-2 bg-gradient-to-r from-purple-400 to-blue-500" />
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">研修管理ダッシュボードと連携</h4>
                      <p className="text-sm text-gray-600">リアルタイムで評価結果と研修効果を相互参照</p>
                    </div>
                    <Link href="/education" className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all">
                      研修ダッシュボードへ
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* 評価体系サマリー（コンパクト） */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <Card className="border-blue-200">
            <CardHeader className="text-center pb-3">
              <Target className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">技術評価</CardTitle>
              <div className="text-2xl font-bold text-blue-600">50点</div>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>法人統一</span>
                  <span className="font-semibold">30点</span>
                </div>
                <div className="flex justify-between">
                  <span>施設特化</span>
                  <span className="font-semibold">20点</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader className="text-center pb-3">
              <Users className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">貢献度評価</CardTitle>
              <div className="text-2xl font-bold text-green-600">50点</div>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>夏季（6月）</span>
                  <span className="font-semibold">25点</span>
                </div>
                <div className="flex justify-between">
                  <span>冬季（12月）</span>
                  <span className="font-semibold">25点</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardHeader className="text-center pb-3">
              <Award className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">最終評価</CardTitle>
              <div className="text-2xl font-bold text-purple-600">7段階</div>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>施設内</span>
                  <span className="font-semibold">5段階</span>
                </div>
                <div className="flex justify-between">
                  <span>法人内</span>
                  <span className="font-semibold">5段階</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 詳細機能へのリンク */}
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="h-5 w-5" />
              詳細管理機能
            </CardTitle>
            <CardDescription>高度な設定や管理機能</CardDescription>
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
              
              <Link href="/evaluation-execution">
                <Button variant="ghost" size="sm" className="w-full flex-col h-auto py-3">
                  <Users className="h-5 w-5 mb-1" />
                  <span className="text-xs">個人評価管理</span>
                </Button>
              </Link>
              
              <Button variant="ghost" size="sm" className="w-full flex-col h-auto py-3">
                <BookOpen className="h-5 w-5 mb-1" />
                <span className="text-xs">マニュアル</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 評価設計支援ツールモーダル */}
      {showDesignSupport && (
        <Card className="fixed inset-4 z-50 overflow-auto bg-white">
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

      {/* 一括処理モーダル */}
      <EvaluationBulkModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        currentMonth={currentMonth}
        evaluationPeriod="2025年度"
      />
    </div>
  );
}