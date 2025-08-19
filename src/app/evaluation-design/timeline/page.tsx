'use client';

import React, { useState } from 'react';
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
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

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

interface MonthSchedule {
  month: number;
  name: string;
  status: 'completed' | 'current' | 'upcoming' | 'inactive';
  tasks: MonthTask[];
  highlight?: boolean;
}

export default function EvaluationTimelinePage() {
  const [selectedMonth, setSelectedMonth] = useState(1); // 1月を選択
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [simulationMode, setSimulationMode] = useState(false);

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
      ]
    },
    {
      month: 6,
      name: '6月',
      status: 'completed',
      highlight: true,
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
      ]
    },
    {
      month: 8,
      name: '8月',
      status: 'completed',
      tasks: []
    },
    {
      month: 9,
      name: '9月',
      status: 'completed',
      tasks: []
    },
    {
      month: 10,
      name: '10月',
      status: 'completed',
      tasks: [
        {
          id: 'oct-1',
          title: '下半期活動計画策定',
          description: '施設・法人の下半期活動計画を策定',
          status: 'completed'
        }
      ]
    },
    {
      month: 11,
      name: '11月',
      status: 'completed',
      tasks: []
    },
    {
      month: 12,
      name: '12月',
      status: 'completed',
      highlight: true,
      tasks: [
        {
          id: 'dec-1',
          title: '冬季貢献度評価（25点）',
          description: '下半期の施設・法人貢献度を評価',
          status: 'completed',
          dueDate: '12月20日',
          subtasks: [
            { id: 'dec-1-1', title: '各施設から評価データ収集', completed: true },
            { id: 'dec-1-2', title: 'Excelデータ取込・検証', completed: true },
            { id: 'dec-1-3', title: '相対評価ランキング作成', completed: true },
            { id: 'dec-1-4', title: '年間貢献度スコア確定', completed: true }
          ]
        }
      ]
    },
    {
      month: 1,
      name: '1月',
      status: 'current',
      highlight: true,
      tasks: [
        {
          id: 'jan-1',
          title: '評価制度設計・更新',
          description: '次年度の評価項目と配分を設計',
          status: 'in-progress',
          dueDate: '1月31日',
          subtasks: [
            { id: 'jan-1-1', title: '法人統一項目（30点）の配分設計', completed: true },
            { id: 'jan-1-2', title: '施設特化項目（20点）の選定', completed: false },
            { id: 'jan-1-3', title: '評価シミュレーション実施', completed: false },
            { id: 'jan-1-4', title: '各施設との調整', completed: false }
          ],
          actions: [
            { label: '配分設計を開始', href: '/evaluation-design/wizard' },
            { label: 'シミュレーション', onClick: () => setSimulationMode(true) }
          ]
        }
      ]
    },
    {
      month: 2,
      name: '2月',
      status: 'upcoming',
      tasks: [
        {
          id: 'feb-1',
          title: '評価制度の承認',
          description: '法人本部での最終承認と調整',
          status: 'pending',
          dueDate: '2月28日',
          subtasks: [
            { id: 'feb-1-1', title: '法人経営会議での承認', completed: false },
            { id: 'feb-1-2', title: '全施設への通知', completed: false },
            { id: 'feb-1-3', title: '評価者研修の実施', completed: false }
          ]
        }
      ]
    },
    {
      month: 3,
      name: '3月',
      status: 'upcoming',
      highlight: true,
      tasks: [
        {
          id: 'mar-1',
          title: '技術評価実施（50点）',
          description: '法人統一項目と施設特化項目の評価',
          status: 'pending',
          dueDate: '3月15日',
          subtasks: [
            { id: 'mar-1-1', title: '評価シート配布', completed: false },
            { id: 'mar-1-2', title: '上司評価の実施', completed: false },
            { id: 'mar-1-3', title: '本人評価の実施', completed: false },
            { id: 'mar-1-4', title: '評価データ集計', completed: false }
          ]
        },
        {
          id: 'mar-2',
          title: '年間総合評価決定（100点）',
          description: '技術評価＋貢献度評価で最終評価決定',
          status: 'pending',
          dueDate: '3月31日',
          subtasks: [
            { id: 'mar-2-1', title: '100点満点スコア確定', completed: false },
            { id: 'mar-2-2', title: '施設内相対評価（5段階）', completed: false },
            { id: 'mar-2-3', title: '法人内相対評価（5段階）', completed: false },
            { id: 'mar-2-4', title: '7段階総合評価決定', completed: false }
          ]
        }
      ]
    }
  ];

  const currentMonth = yearSchedule.find(m => m.month === selectedMonth);
  const importantDates = yearSchedule.filter(m => m.highlight);

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
                      } ${month.highlight ? 'font-semibold' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        {month.status === 'completed' && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                        {month.status === 'current' && <Clock className="h-4 w-4 text-blue-600" />}
                        {month.status === 'upcoming' && <Circle className="h-4 w-4 text-gray-400" />}
                        {month.status === 'inactive' && <Circle className="h-4 w-4 text-gray-300" />}
                        <span className={month.highlight ? 'text-purple-600' : ''}>{month.name}</span>
                      </div>
                      {month.tasks.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {month.tasks.length}
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 月別詳細 */}
          <div className="col-span-9">
            {currentMonth && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <Calendar className="h-6 w-6" />
                        {currentMonth.name}の作業
                      </CardTitle>
                      <CardDescription className="mt-2">
                        評価スケジュールに沿って必要な作業を実行してください
                      </CardDescription>
                    </div>
                    {getMonthBadge(currentMonth.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  {currentMonth.tasks.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>この月に予定されている作業はありません</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {currentMonth.tasks.map((task) => (
                        <Card key={task.id} className={`border-2 ${
                          task.status === 'in-progress' ? 'border-blue-200 bg-blue-50' : ''
                        }`}>
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                {getStatusIcon(task.status)}
                                <div className="flex-1">
                                  <h3 className="font-semibold text-lg">{task.title}</h3>
                                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
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
                                          checked={subtask.completed}
                                          className="rounded"
                                          readOnly
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
                </CardContent>
              </Card>
            )}

            {/* 現在月が1月の場合の特別表示 */}
            {selectedMonth === 1 && (
              <Alert className="mt-6 border-orange-200 bg-orange-50">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription>
                  <strong>重要:</strong> 1月は次年度の評価制度を設計する重要な時期です。
                  各施設の特性を考慮しながら、公平で効果的な評価制度を構築してください。
                  <div className="mt-3 flex gap-2">
                    <Link href="/evaluation-design/wizard">
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                        設計ウィザードを開始
                      </Button>
                    </Link>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      前年度設定を確認
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}