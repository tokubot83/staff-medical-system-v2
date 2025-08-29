'use client';

import React, { useState, useEffect } from 'react';
import CommonHeader from '@/components/CommonHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar,
  CheckCircle2,
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
  Bell
} from 'lucide-react';
import Link from 'next/link';
import SystemIntegrationService, { CrossSystemAlert } from '@/services/systemIntegrationService';
import IntegrationFlowVisualization from '@/components/IntegrationFlowVisualization';

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

  // 年間スケジュールデータ
  const yearSchedule: MonthSchedule[] = [
    {
      month: 4,
      name: '4月',
      status: 'completed',
      tasks: [
        {
          id: 'apr-1',
          title: '前年度評価結果フィードバック',
          description: '前年度の最終評価結果を各施設・職員へフィードバック',
          status: 'completed',
          subtasks: [
            { id: 'apr-1-1', title: '評価結果通知書の送付', completed: true },
            { id: 'apr-1-2', title: '個別面談の実施', completed: true },
            { id: 'apr-1-3', title: '昇給・賞与への反映', completed: true }
          ]
        }
      ],
      trainingTasks: [
        {
          id: 'apr-training-1',
          title: '基礎看護技術研修 完了',
          status: 'completed',
          impact: '新人看護師の技術向上',
          dependency: '前年度評価結果'
        },
        {
          id: 'apr-training-2',
          title: '個別研修計画の確定・通知',
          status: 'completed',
          impact: '評価連動型研修の開始',
          dependency: '3月技術評価結果'
        }
      ]
    },
    {
      month: 5,
      name: '5月',
      status: 'completed',
      tasks: [
        {
          id: 'may-1',
          title: '上半期活動計画策定',
          description: '施設・法人の上半期活動計画を策定',
          status: 'completed'
        }
      ],
      trainingTasks: [
        {
          id: 'may-training-1',
          title: '専門研修プログラム開始',
          status: 'completed',
          impact: '専門スキル向上',
          dependency: '4月基礎研修完了'
        }
      ]
    },
    {
      month: 6,
      name: '6月',
      status: 'completed',
      highlight: true,
      alerts: systemAlerts.filter(alert => alert.month === 6),
      integrationNote: '夏季貢献度評価と第1四半期研修効果測定の連携',
      tasks: [
        {
          id: 'jun-1',
          title: '夏季貢献度評価（25点）',
          description: '上半期の施設・法人貢献度を評価',
          status: 'completed',
          dueDate: '6月30日',
          subtasks: [
            { id: 'jun-1-1', title: '各施設から評価データ収集', completed: true },
            { id: 'jun-1-2', title: 'Excelデータ取込・検証', completed: true },
            { id: 'jun-1-3', title: '相対評価ランキング作成', completed: true },
            { id: 'jun-1-4', title: '評価確定・承認', completed: true }
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
          status: 'completed',
          impact: '貢献度評価+3点向上',
          dependency: '4-5月実施研修データ'
        },
        {
          id: 'jun-training-2',
          title: '貢献度スコアと研修受講の相関分析',
          status: 'completed',
          impact: '研修効果の定量的証明',
          dependency: '夏季貢献度評価結果'
        }
      ]
    },
    {
      month: 7,
      name: '7月',
      status: 'completed',
      tasks: [
        {
          id: 'jul-1',
          title: '夏季評価結果通知',
          description: '夏季貢献度評価の結果を通知',
          status: 'completed'
        }
      ],
      trainingTasks: [
        {
          id: 'jul-training-1',
          title: '下半期研修計画調整',
          status: 'completed',
          impact: '評価結果に基づく最適化',
          dependency: '6月評価相関分析結果'
        }
      ]
    },
    {
      month: 8,
      name: '8月',
      status: currentMonth === 8 ? 'current' : currentMonth > 8 ? 'completed' : 'upcoming',
      tasks: [],
      trainingTasks: [
        {
          id: 'aug-training-1',
          title: '医療安全研修 集中実施',
          status: currentMonth > 8 ? 'completed' : 'in-progress',
          impact: '必須研修の完了',
          dependency: 'なし'
        },
        {
          id: 'aug-training-2',
          title: '未受講者への個別対応（25名）',
          status: currentMonth > 8 ? 'completed' : 'pending',
          impact: '100%受講達成',
          dependency: '受講管理データ'
        }
      ]
    },
    {
      month: 9,
      name: '9月',
      status: currentMonth === 9 ? 'current' : currentMonth > 9 ? 'completed' : 'upcoming',
      tasks: [],
      trainingTasks: [
        {
          id: 'sep-training-1',
          title: 'スキル向上研修実施',
          status: currentMonth > 9 ? 'completed' : 'pending',
          impact: '年末評価への準備',
          dependency: 'なし'
        }
      ]
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
      ],
      trainingTasks: [
        {
          id: 'oct-training-1',
          title: '年間研修進捗レビュー',
          status: currentMonth > 10 ? 'completed' : 'pending',
          impact: '年末評価準備',
          dependency: 'Q3研修結果'
        }
      ]
    },
    {
      month: 11,
      name: '11月',
      status: currentMonth === 11 ? 'current' : currentMonth > 11 ? 'completed' : 'upcoming',
      tasks: [],
      trainingTasks: [
        {
          id: 'nov-training-1',
          title: '年末評価対策研修',
          status: currentMonth > 11 ? 'completed' : 'pending',
          impact: '評価スコア底上げ',
          dependency: 'なし'
        }
      ]
    },
    {
      month: 12,
      name: '12月',
      status: currentMonth === 12 ? 'current' : currentMonth > 12 || currentMonth < 4 ? 'completed' : 'upcoming',
      highlight: true,
      alerts: systemAlerts.filter(alert => alert.month === 12),
      integrationNote: '冬季貢献度評価と年間研修ROI分析の重要な連携月',
      tasks: [
        {
          id: 'dec-1',
          title: '冬季貢献度評価（25点）',
          description: '下半期の施設・法人貢献度を評価',
          status: currentMonth > 12 || currentMonth < 4 ? 'completed' : 'pending',
          dueDate: '12月20日',
          subtasks: [
            { id: 'dec-1-1', title: '各施設から評価データ収集', completed: currentMonth > 12 || currentMonth < 4 },
            { id: 'dec-1-2', title: 'Excelデータ取込・検証', completed: currentMonth > 12 || currentMonth < 4 },
            { id: 'dec-1-3', title: '相対評価ランキング作成', completed: currentMonth > 12 || currentMonth < 4 },
            { id: 'dec-1-4', title: '年間貢献度スコア確定', completed: currentMonth > 12 || currentMonth < 4 }
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
          status: 'pending',
          impact: '成功モデルの横展開',
          dependency: '冬季評価上位者の研修履歴'
        }
      ]
    },
    {
      month: 1,
      name: '1月',
      status: currentMonth === 1 ? 'current' : currentMonth > 1 ? 'completed' : 'upcoming',
      highlight: true,
      alerts: systemAlerts.filter(alert => alert.month === 1),
      integrationNote: '研修計画調整期と評価制度設計の相互影響',
      tasks: [
        {
          id: 'jan-1',
          title: '評価制度設計・更新',
          description: '新年度評価制度の詳細設計と配点調整',
          status: currentMonth > 1 ? 'completed' : 'pending',
          dueDate: '1月31日',
          subtasks: [
            { id: 'jan-1-1', title: '法人統一項目（30点）の配分設計', completed: currentMonth > 1 },
            { id: 'jan-1-2', title: '施設特化項目（20点）の選定', completed: currentMonth > 1 },
            { id: 'jan-1-3', title: '技術評価項目（50点）の更新', completed: currentMonth > 1 }
          ]
        }
      ],
      trainingTasks: [
        {
          id: 'jan-training-1',
          title: '前年度評価データから研修効果分析',
          status: currentMonth > 1 ? 'completed' : 'pending',
          impact: '研修ROI 120%達成',
          dependency: '12月冬季貢献度評価結果'
        },
        {
          id: 'jan-training-2',
          title: '評価項目と研修プログラムのマッピング',
          status: currentMonth > 1 ? 'completed' : 'pending',
          impact: '全項目カバー率100%',
          dependency: '前年度年間技術評価総合スコア'
        },
        {
          id: 'jan-training-3',
          title: '必須研修カリキュラム策定',
          status: currentMonth > 1 ? 'completed' : 'pending',
          impact: '評価制度との整合性確保',
          dependency: '評価制度設計結果'
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
          dueDate: '2月28日',
          subtasks: [
            { id: 'feb-1-1', title: '法人経営会議での承認', completed: currentMonth > 2 },
            { id: 'feb-1-2', title: '全施設への通知', completed: currentMonth > 2 },
            { id: 'feb-1-3', title: '評価者研修の実施', completed: currentMonth > 2 }
          ]
        }
      ],
      trainingTasks: [
        {
          id: 'feb-training-1',
          title: '評価者向け研修実施',
          status: currentMonth > 2 ? 'completed' : 'pending',
          impact: '公正な評価実施の担保',
          dependency: '評価制度承認'
        },
        {
          id: 'feb-training-2',
          title: 'プリセプター養成研修',
          status: currentMonth > 2 ? 'completed' : 'planned',
          impact: '新人教育体制強化',
          dependency: 'なし'
        }
      ]
    },
    {
      month: 3,
      name: '3月',
      status: currentMonth === 3 ? 'current' : currentMonth > 3 ? 'completed' : 'upcoming',
      highlight: true,
      alerts: systemAlerts.filter(alert => alert.month === 3),
      integrationNote: '技術評価実施と研修効果測定の最重要連携月',
      tasks: [
        {
          id: 'mar-1',
          title: '技術評価実施（50点）',
          description: '年間の技術・スキル評価を実施',
          status: currentMonth > 3 ? 'completed' : 'pending',
          dueDate: '3月15日',
          subtasks: [
            { id: 'mar-1-1', title: '評価シート配布', completed: currentMonth > 3 },
            { id: 'mar-1-2', title: '上司評価・本人評価の実施', completed: currentMonth > 3 },
            { id: 'mar-1-3', title: '100点満点スコア確定', completed: currentMonth > 3 },
            { id: 'mar-1-4', title: '年間総合評価決定', completed: currentMonth > 3 }
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
          impact: '65点未満職員への対応',
          dependency: '100点満点スコア確定データ'
        },
        {
          id: 'mar-training-3',
          title: '新年度研修予算配分提案',
          status: currentMonth > 3 ? 'completed' : 'pending',
          impact: '投資効率15%改善',
          dependency: '年間総合評価・グレード決定結果'
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
      <CommonHeader title="評価制度管理 - 年間スケジュール" />
      
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

          {/* 月別詳細 */}
          <div className="col-span-9">
            {selectedMonthData && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <Calendar className="h-6 w-6" />
                        {selectedMonthData.name}の作業・連携状況
                      </CardTitle>
                      <CardDescription className="mt-2">
                        評価タスクと教育研修の連携状況を一元管理
                      </CardDescription>
                      {selectedMonthData.integrationNote && (
                        <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-700 font-medium">
                            🔗 {selectedMonthData.integrationNote}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {getMonthBadge(selectedMonthData.status)}
                      {selectedMonthData.alerts && selectedMonthData.alerts.length > 0 && (
                        <Badge className="bg-orange-100 text-orange-800">
                          <Bell className="h-3 w-3 mr-1" />
                          {selectedMonthData.alerts.length}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* アラート表示 */}
                  {selectedMonthData.alerts && selectedMonthData.alerts.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        この月のアラート
                      </h4>
                      <div className="space-y-2">
                        {selectedMonthData.alerts.map((alert) => (
                          <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                            alert.priority === 'high' ? 'border-l-red-500 bg-red-50' :
                            alert.priority === 'medium' ? 'border-l-orange-500 bg-orange-50' :
                            'border-l-yellow-500 bg-yellow-50'
                          }`}>
                            <p className="text-sm font-medium">{alert.message}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={
                                alert.priority === 'high' ? 'bg-red-100 text-red-800' :
                                alert.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                                'bg-yellow-100 text-yellow-800'
                              } size="sm">
                                {alert.priority === 'high' ? '高優先' : 
                                 alert.priority === 'medium' ? '中優先' : '低優先'}
                              </Badge>
                              {alert.actionRequired && (
                                <Badge variant="outline" size="sm">対応必要</Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 連携詳細ボタン */}
                  {selectedMonthData.integrationNote && (
                    <div className="mb-6 flex justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowDataFlow(!showDataFlow)}
                        className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                      >
                        <Target className="h-4 w-4 mr-2" />
                        {showDataFlow ? 'データフローを閉じる' : '🔗 連携詳細・データフローを表示'}
                      </Button>
                    </div>
                  )}

                  {/* データフロー可視化 */}
                  {showDataFlow && selectedMonthData.integrationNote && (
                    <div className="mb-6">
                      <IntegrationFlowVisualization
                        month={selectedMonthData.month}
                        nodes={[
                          {
                            id: `${selectedMonthData.month}-eval-1`,
                            type: 'source',
                            label: '評価データ',
                            status: selectedMonthData.tasks?.[0]?.status || 'pending',
                            data: { impact: '基準データ提供' }
                          },
                          {
                            id: `${selectedMonthData.month}-process-1`,
                            type: 'process',
                            label: 'データ分析・処理',
                            status: 'in-progress',
                            data: { impact: '相関分析実施' }
                          },
                          {
                            id: `${selectedMonthData.month}-training-1`,
                            type: 'output',
                            label: '研修計画生成',
                            status: selectedMonthData.trainingTasks?.[0]?.status || 'pending',
                            data: { impact: selectedMonthData.trainingTasks?.[0]?.impact }
                          }
                        ]}
                        edges={[
                          {
                            from: `${selectedMonthData.month}-eval-1`,
                            to: `${selectedMonthData.month}-process-1`,
                            label: 'データ送信',
                            type: 'data'
                          },
                          {
                            from: `${selectedMonthData.month}-process-1`,
                            to: `${selectedMonthData.month}-training-1`,
                            label: '分析結果',
                            type: 'trigger'
                          }
                        ]}
                        onNodeClick={(node) => {
                          console.log('Node clicked:', node);
                        }}
                      />
                    </div>
                  )}

                  {/* メインコンテンツ: 2カラム表示 */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* 左側: 評価タスク（メイン） */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-purple-800">
                        <Target className="h-5 w-5" />
                        評価管理タスク
                      </h3>
                      {(!selectedMonthData.tasks || selectedMonthData.tasks.length === 0) ? (
                        <div className="text-center py-8 text-gray-500">
                          <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                          <p>この月に予定されている評価作業はありません</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {selectedMonthData.tasks.map((task) => (
                            <Card key={task.id} className={`border-2 ${
                              task.status === 'in-progress' ? 'border-blue-200 bg-blue-50' : ''
                            }`}>
                              <CardHeader>
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start gap-3">
                                    {getStatusIcon(task.status)}
                                    <div className="flex-1">
                                      <h4 className="font-semibold">{task.title}</h4>
                                      {task.description && (
                                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                                      )}
                                      {task.dueDate && (
                                        <div className="flex items-center gap-2 mt-2">
                                          <Clock className="h-4 w-4 text-gray-500" />
                                          <span className="text-sm text-gray-500">期限: {task.dueDate}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                                  >
                                    <ChevronRight className={`h-4 w-4 transition-transform ${
                                      expandedTask === task.id ? 'rotate-90' : ''
                                    }`} />
                                  </Button>
                                </div>
                              </CardHeader>
                          
                          {expandedTask === task.id && (
                            <CardContent className="pt-0">
                              {/* サブタスク */}
                              {task.subtasks && (
                                <div className="mb-4">
                                  <h4 className="font-medium mb-2 text-sm">チェックリスト</h4>
                                  <div className="space-y-2">
                                    {task.subtasks.map((subtask) => (
                                      <div key={subtask.id} className="flex items-center gap-2">
                                        <input
                                          type="checkbox"
                                          checked={subtask.completed || isTaskSynced(subtask.id)}
                                          className="rounded"
                                          onChange={(e) => {
                                            handleTaskCompletion(subtask.id, e.target.checked);
                                          }}
                                        />
                                        <span className={`text-sm ${
                                          subtask.completed ? 'line-through text-gray-500' : ''
                                        }`}>
                                          {subtask.title}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                  <Progress 
                                    value={(task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100}
                                    className="mt-3 h-2"
                                  />
                                </div>
                              )}

                              {/* アクションボタン */}
                              {task.actions && (
                                <div className="flex gap-2">
                                  {task.actions.map((action, idx) => (
                                    action.href ? (
                                      <Link key={idx} href={action.href}>
                                        <Button size="sm">
                                          {action.label}
                                        </Button>
                                      </Link>
                                    ) : (
                                      <Button key={idx} size="sm" onClick={action.onClick}>
                                        {action.label}
                                      </Button>
                                    )
                                  ))}
                                </div>
                              )}
                            </CardContent>
                          )}
                        </Card>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 右側: 教育研修タスク（連携情報） */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-green-800">
                        <BookOpen className="h-5 w-5" />
                        教育研修連携情報
                      </h3>
                      {(!selectedMonthData.trainingTasks || selectedMonthData.trainingTasks.length === 0) ? (
                        <div className="text-center py-8 text-gray-500">
                          <GraduationCap className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                          <p>この月に関連する研修情報はありません</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {selectedMonthData.trainingTasks.map((task) => (
                            <div key={task.id} className={`p-4 border rounded-lg ${
                              task.status === 'completed' ? 'bg-green-50 border-green-200' :
                              task.status === 'in-progress' ? 'bg-blue-50 border-blue-200' :
                              'bg-gray-50 border-gray-200'
                            }`}>
                              <div className="flex items-start gap-3">
                                {task.status === 'completed' && <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />}
                                {task.status === 'in-progress' && <Clock className="h-4 w-4 text-blue-600 mt-0.5" />}
                                {task.status === 'pending' && <Circle className="h-4 w-4 text-gray-400 mt-0.5" />}
                                <div className="flex-1">
                                  <h4 className="font-medium text-sm">{task.title}</h4>
                                  {task.impact && (
                                    <div className="mt-2">
                                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                        効果: {task.impact}
                                      </span>
                                    </div>
                                  )}
                                  {task.dependency && (
                                    <div className="mt-2 text-xs text-gray-600">
                                      <strong>依存:</strong> {task.dependency}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {/* 教育研修システムへのリンク */}
                          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-green-800">教育研修管理で詳細確認</p>
                                <p className="text-xs text-green-600">研修スケジュールと進捗状況を確認できます</p>
                              </div>
                              <Link href={`/education?month=${selectedMonthData.month}`}>
                                <Button size="sm" variant="outline" className="text-green-700 border-green-300 hover:bg-green-100">
                                  <BookOpen className="h-4 w-4 mr-1" />
                                  研修管理へ
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 月別特別注意事項 */}
            {selectedMonth === 1 && (
              <Alert className="mt-6 border-orange-200 bg-orange-50">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription>
                  <strong>重要:</strong> 1月は次年度の評価制度設計と研修計画の連携調整を行う重要な時期です。
                  各施設の特性と研修効果を考慮した評価制度を構築してください。
                  <div className="mt-3 flex gap-2">
                    <Link href="/evaluation-design/wizard">
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                        設計ウィザードを開始
                      </Button>
                    </Link>
                    <Link href="/education">
                      <Button size="sm" variant="outline">
                        <BookOpen className="h-4 w-4 mr-2" />
                        研修計画を確認
                      </Button>
                    </Link>
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            {selectedMonth === 3 && (
              <Alert className="mt-6 border-purple-200 bg-purple-50">
                <AlertCircle className="h-4 w-4 text-purple-600" />
                <AlertDescription>
                  <strong>重要:</strong> 3月は技術評価実施と研修効果測定の最重要連携月です。
                  必須研修の完了状況を確認し、評価結果と研修効果の相関分析を実施してください。
                  <div className="mt-3 flex gap-2">
                    <Link href="/evaluation-execution">
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                        評価実施へ
                      </Button>
                    </Link>
                    <Link href="/education">
                      <Button size="sm" variant="outline">
                        <GraduationCap className="h-4 w-4 mr-2" />
                        研修効果測定
                      </Button>
                    </Link>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* 年間サマリーへのリンク */}
            <Card className="mt-6 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-1">📈 年間連携サマリー</h4>
                    <p className="text-sm text-blue-600">評価システムと教育研修システムの連携状況を俱瞰</p>
                  </div>
                  <Link href="/annual-integration-summary">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      サマリーを表示
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}