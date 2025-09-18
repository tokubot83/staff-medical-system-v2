'use client';

import React, { useState, useEffect, useReducer } from 'react';
import BreadcrumbBar from '@/components/navigation/BreadcrumbBar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import styles from './Education.module.css';
import {
  BookOpen,
  Calendar,
  Users,
  Award,
  ChevronRight,
  Clock,
  Target,
  TrendingUp,
  User,
  Building,
  FileText,
  CheckCircle,
  AlertCircle,
  BarChart3,
  AlertTriangle,
  Sparkles,
  Bell
} from 'lucide-react';
import Link from 'next/link';
import {
  facilityTypeNames,
  jobCategoryNames,
  experienceLevelNames
} from '@/data/evaluationMasterData';
import SystemIntegrationService, { CrossSystemAlert } from '@/services/systemIntegrationService';

// 教育研修担当者向け動的アクションブロック
const TrainingManagerActionBlock: React.FC = () => {
  const [urgentTasks, setUrgentTasks] = useState<any[]>([]);
  const [todayTasks, setTodayTasks] = useState<any[]>([]);
  const [thisWeekTasks, setThisWeekTasks] = useState<any[]>([]);
  const [upcomingEvaluations, setUpcomingEvaluations] = useState<any[]>([]);
  const [trainingAlerts, setTrainingAlerts] = useState<any[]>([]);

  useEffect(() => {
    // 現在の日時に基づいて動的にタスクを生成
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    
    // 緊急タスクの設定（評価スケジュール連動）
    const urgent = [];
    const todayTask = [];
    const weekTask = [];
    const evaluations = [];
    const alerts = [];

    // 3月の場合：技術評価前の必須タスク
    if (currentMonth === 3) {
      urgent.push({
        id: 'march-urgent-1',
        title: '技術評価前 必須研修未完了者確認',
        description: '3月15日技術評価前に医療安全研修未完了者17名の対応が必要',
        priority: 'critical',
        deadline: '今日まで',
        action: '個別通知送信',
        impact: '評価実施可否に直接影響',
        estimatedTime: '30分',
        relatedSystem: '評価システム',
        dependentEvaluation: '技術評価（3月15日予定）'
      });
      
      todayTask.push({
        id: 'march-today-1',
        title: '個別研修計画の最終確認',
        description: '評価結果連動型研修計画の事前チェック',
        priority: 'high',
        deadline: '今日中',
        estimatedTime: '45分'
      });
    }

    // 6月の場合：貢献度評価と研修効果測定
    if (currentMonth === 6) {
      urgent.push({
        id: 'june-urgent-1',
        title: '上半期研修効果測定レポート作成',
        description: '6月貢献度評価に向けた研修ROI分析が必要',
        priority: 'high',
        deadline: '3日以内',
        action: 'レポート作成開始',
        impact: '貢献度評価の根拠データ',
        estimatedTime: '2時間',
        relatedSystem: '評価システム',
        dependentEvaluation: '貢献度評価（6月30日予定）'
      });
    }

    // 12月の場合：年間総括と次年度準備
    if (currentMonth === 12) {
      urgent.push({
        id: 'dec-urgent-1',
        title: '年間研修効果測定と次年度計画策定',
        description: '冬季貢献度評価結果を踏まえた来年度研修計画の準備',
        priority: 'high',
        deadline: '1週間以内',
        action: '計画策定会議設定',
        impact: '次年度予算・体制に影響',
        estimatedTime: '3時間',
        relatedSystem: '評価システム',
        dependentEvaluation: '冬季貢献度評価（12月20日予定）'
      });
    }

    // 4月の場合：新年度研修開始と評価連携準備
    if (currentMonth === 4) {
      todayTask.push({
        id: 'april-today-1',
        title: '前年度評価結果から個別研修計画生成',
        description: '3月技術評価結果（70点未満対象）から研修推奨リスト作成',
        priority: 'high',
        deadline: '今日中',
        estimatedTime: '1時間'
      });
      
      weekTask.push({
        id: 'april-week-1',
        title: '新人研修プログラムの最終調整',
        description: '4月入職者向け基礎研修スケジュール確定',
        priority: 'medium',
        deadline: '今週中',
        estimatedTime: '2時間'
      });
    }

    // 評価予定の取得
    evaluations.push({
      id: 'eval-1',
      title: currentMonth === 3 ? '技術評価実施予定' : 
              currentMonth === 6 ? '上半期貢献度評価' :
              currentMonth === 12 ? '冬季貢献度評価' : '次回評価',
      date: currentMonth === 3 ? '3月15日' : 
            currentMonth === 6 ? '6月30日' :
            currentMonth === 12 ? '12月20日' : '未定',
      participants: currentMonth === 3 ? '技術職全員（85名）' :
                    currentMonth === 6 ? '全職員（142名）' : 
                    currentMonth === 12 ? '全職員（142名）' : '未定',
      trainingRequirement: currentMonth === 3 ? '医療安全研修完了必須' :
                           currentMonth === 6 ? '上半期必須研修完了' :
                           currentMonth === 12 ? '年間継続研修完了' : '未定'
    });

    // 研修アラートの設定
    alerts.push({
      id: 'alert-1',
      type: 'warning',
      title: '必須研修未完了者',
      count: currentMonth === 3 ? 17 : currentMonth === 6 ? 8 : 12,
      message: currentMonth === 3 ? '技術評価前に完了必須' :
               currentMonth === 6 ? '貢献度評価に影響する可能性' :
               '年間目標達成に要注意',
      action: '個別通知・フォローアップ'
    });

    setUrgentTasks(urgent);
    setTodayTasks(todayTask);
    setThisWeekTasks(weekTask);
    setUpcomingEvaluations(evaluations);
    setTrainingAlerts(alerts);
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
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">教育研修担当者 - アクションセンター</h3>
              <p className="text-sm text-gray-600 mt-1">評価スケジュールと連動した優先タスクを表示</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 緊急タスク */}
            <div className="space-y-4">
              <h4 className="font-semibold text-red-700 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                🔴 緊急対応 ({urgentTasks.length}件)
              </h4>
              <div className="space-y-3">
                {urgentTasks.map((task) => (
                  <div key={task.id} className="p-4 bg-white border border-red-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-gray-900 text-sm leading-tight">{task.title}</h5>
                      {getPriorityBadge(task.priority)}
                    </div>
                    <p className="text-xs text-gray-600 mb-3">{task.description}</p>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-red-600 font-medium">⏰ {task.deadline}</span>
                        <span className="text-gray-500">所要時間: {task.estimatedTime}</span>
                      </div>
                      {task.dependentEvaluation && (
                        <div className="p-2 bg-orange-50 border border-orange-200 rounded">
                          <p className="text-orange-700 font-medium">📋 連動評価: {task.dependentEvaluation}</p>
                          <p className="text-orange-600">影響: {task.impact}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" className="bg-red-600 hover:bg-red-700 text-xs h-7 px-3">
                        {task.action}
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs h-7 px-3">
                        詳細確認
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 今日のタスク */}
            <div className="space-y-4">
              <h4 className="font-semibold text-orange-700 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                🟡 今日中 ({todayTasks.length}件)
              </h4>
              <div className="space-y-3">
                {todayTasks.map((task) => (
                  <div key={task.id} className="p-4 bg-white border border-orange-200 rounded-lg shadow-sm">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-gray-900 text-sm">{task.title}</h5>
                      {getPriorityBadge(task.priority)}
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="text-orange-600 font-medium">⏰ {task.deadline}</span>
                      <span className="text-gray-500">所要時間: {task.estimatedTime}</span>
                    </div>
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-xs h-7 w-full">
                      開始する
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* 今週のタスク・評価予定 */}
            <div className="space-y-4">
              <h4 className="font-semibold text-green-700 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                🟢 今週・評価連携 ({thisWeekTasks.length + upcomingEvaluations.length}件)
              </h4>
              <div className="space-y-3">
                {thisWeekTasks.map((task) => (
                  <div key={task.id} className="p-4 bg-white border border-green-200 rounded-lg shadow-sm">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-gray-900 text-sm">{task.title}</h5>
                      {getPriorityBadge(task.priority)}
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="text-green-600 font-medium">⏰ {task.deadline}</span>
                      <span className="text-gray-500">所要時間: {task.estimatedTime}</span>
                    </div>
                    <Button size="sm" variant="outline" className="border-green-300 text-green-700 hover:bg-green-50 text-xs h-7 w-full">
                      計画確認
                    </Button>
                  </div>
                ))}
                
                {/* 評価予定情報 */}
                {upcomingEvaluations.map((evaluation) => (
                  <div key={evaluation.id} className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-purple-600" />
                      <h5 className="font-medium text-purple-800 text-sm">{evaluation.title}</h5>
                    </div>
                    <div className="space-y-1 text-xs">
                      <p><span className="font-medium">実施日:</span> {evaluation.date}</p>
                      <p><span className="font-medium">対象:</span> {evaluation.participants}</p>
                      <p className="text-purple-700 font-medium">📚 必要研修: {evaluation.trainingRequirement}</p>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-xs h-7 px-2">
                        研修状況確認
                      </Button>
                      <Button size="sm" variant="outline" className="border-purple-300 text-purple-700 text-xs h-7 px-2">
                        評価詳細
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* アラートサマリー */}
          {trainingAlerts.length > 0 && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-yellow-600" />
                  <div>
                    <h4 className="font-medium text-yellow-800">研修アラート</h4>
                    {trainingAlerts.map((alert) => (
                      <p key={alert.id} className="text-sm text-yellow-700">
                        {alert.title}: {alert.count}名 - {alert.message}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                    一括通知
                  </Button>
                  <Link href="/annual-integration-summary">
                    <Button size="sm" variant="outline" className="border-yellow-400 text-yellow-700">
                      統合管理画面
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

interface TrainingProgram {
  id: string;
  name: string;
  category: 'basic' | 'specialty' | 'management' | 'safety';
  type: 'OJT' | 'OffJT' | 'e-learning';
  targetJobs: string[];
  targetLevels: string[];
  duration: number;
  requiredFor: string[];
  schedule: string;
  status: 'planned' | 'ongoing' | 'completed';
  participants: number;
  completionRate: number;
}

interface MonthData {
  month: number;
  name: string;
  status: 'completed' | 'current' | 'upcoming' | 'inactive';
  trainingTasks: {
    title: string;
    completed: boolean;
    type: 'planning' | 'execution' | 'analysis';
    expectedImpact?: string;
    dependsOn?: string; // 評価データ依存の詳細
    targetGroup?: string; // 対象者の詳細
    deadline?: string;
  }[];
  evaluationTasks: {
    title: string;
    completed: boolean;
    requiresTraining?: boolean; // 研修完了が必要かどうか
    trainingImpact?: string; // 研修による期待効果
  }[];
  highlight?: boolean;
  keyTasks?: string[];
  linkage?: {
    type: 'critical' | 'important' | 'moderate';
    description: string;
    dataFlow: string; // データの流れの説明
  };
}

// 月の現在ステータスを取得する関数
const currentMonth = new Date().getMonth() + 1;

// 年間スケジュールデータ（評価管理ダッシュボードと統一構造）
const yearSchedule: MonthData[] = [
  {
    month: 1,
    name: '1月',
    status: currentMonth === 1 ? 'current' : currentMonth > 1 ? 'completed' : 'upcoming',
    highlight: true,
    keyTasks: ['研修計画調整期', '評価制度設計・更新'],
    trainingTasks: [
      {
        title: '前年度評価データから研修効果分析',
        completed: currentMonth > 1,
        type: 'analysis',
        expectedImpact: '研修ROI 120%達成',
        dependsOn: '12月冬季貢献度評価結果（70点未満対象）',
        targetGroup: '全職員・低スコア者優先',
        deadline: '1月15日'
      },
      {
        title: '評価項目と研修プログラムのマッピング',
        completed: false,
        type: 'planning',
        expectedImpact: '全項目カバー率100%',
        dependsOn: '前年度年間技術評価総合スコア（65点未満・要強化項目）',
        targetGroup: '弱点領域該当者'
      },
      {
        title: '必須研修カリキュラム策定',
        completed: false,
        type: 'planning',
        dependsOn: '評価制度設計結果との整合性確保',
        deadline: '1月31日'
      }
    ],
    evaluationTasks: [
      {
        title: '法人統一項目（30点）の配分設計',
        completed: currentMonth > 1,
        requiresTraining: true,
        trainingImpact: '研修完了者は基準点+2点加算'
      },
      {
        title: '施設特化項目（20点）の選定',
        completed: false,
        requiresTraining: false
      }
    ],
    linkage: {
      type: 'critical',
      description: '研修計画調整期と評価制度設計が相互に影響',
      dataFlow: '12月評価結果 → 1月研修計画調整 → 評価項目マッピング → 2-3月研修実施'
    }
  },
  {
    month: 3,
    name: '3月',
    status: currentMonth === 3 ? 'current' : currentMonth > 3 ? 'completed' : 'upcoming',
    highlight: true,
    keyTasks: ['技術評価実施（50点）', '年間総合評価決定'],
    trainingTasks: [
      {
        title: '評価結果即時分析→個別研修計画生成',
        completed: currentMonth > 3,
        type: 'analysis',
        expectedImpact: '平均スコア+5点向上目標',
        dependsOn: '技術評価実施結果（リアルタイム）',
        targetGroup: 'スコアギャップ対象者',
        deadline: '評価完了後48時間以内'
      },
      {
        title: 'スコアギャップ基づく優先研修リスト作成',
        completed: currentMonth > 3,
        type: 'planning',
        dependsOn: '100点満点スコア確定データ',
        targetGroup: '65点未満職員（約25名予定）'
      },
      {
        title: '新年度研修予算配分提案',
        completed: false,
        type: 'planning',
        expectedImpact: '投資効率15%改善',
        dependsOn: '年間総合評価・グレード決定結果'
      }
    ],
    evaluationTasks: [
      {
        title: '評価シート配布',
        completed: currentMonth > 3,
        requiresTraining: true,
        trainingImpact: '必須研修未完了者は評価対象外または減点'
      },
      {
        title: '上司評価・本人評価の実施',
        completed: currentMonth > 3,
        requiresTraining: true,
        trainingImpact: '研修受講履歴が評価公正性の担保要素'
      },
      {
        title: '100点満点スコア確定',
        completed: currentMonth > 3,
        requiresTraining: false
      }
    ],
    linkage: {
      type: 'critical',
      description: '技術評価実施と研修効果測定の最重要連携月',
      dataFlow: '技術評価結果 → 即時スコア分析 → 個別研修計画自動生成 → 4月研修開始'
    }
  },
  {
    month: 6,
    name: '6月',
    status: currentMonth === 6 ? 'current' : currentMonth > 6 ? 'completed' : 'upcoming',
    highlight: true,
    keyTasks: ['夏季貢献度評価（25点）'],
    trainingTasks: [
      {
        title: '第1四半期研修効果測定',
        completed: true,
        type: 'analysis',
        expectedImpact: '貢献度評価+3点向上',
        dependsOn: '4-5月実施研修の完了データ',
        targetGroup: '研修受講完了者'
      },
      {
        title: '貢献度スコアと研修受講の相関分析',
        completed: true,
        type: 'analysis',
        dependsOn: '夏季貢献度評価結果（リアルタイム）',
        expectedImpact: '研修効果の定量的証明'
      },
      {
        title: '下半期研修計画の調整',
        completed: false,
        type: 'planning',
        dependsOn: '相関分析結果に基づく優先度再設定'
      }
    ],
    evaluationTasks: [
      {
        title: '各施設から評価データ収集',
        completed: true,
        requiresTraining: false
      },
      {
        title: '相対評価ランキング作成',
        completed: true,
        requiresTraining: true,
        trainingImpact: '研修受講者の貢献度平均+3点向上を反映'
      }
    ],
    linkage: {
      type: 'important',
      description: '研修効果測定と夏季貢献度評価の連携',
      dataFlow: '研修完了データ → 貢献度評価 → 相関分析 → 下半期計画調整'
    }
  },
  {
    month: 12,
    name: '12月',
    status: currentMonth === 12 ? 'current' : currentMonth > 12 || currentMonth < 4 ? 'completed' : 'upcoming',
    highlight: true,
    keyTasks: ['冬季貢献度評価（25点）'],
    trainingTasks: [
      {
        title: '年間研修ROI分析',
        completed: currentMonth > 12 || currentMonth < 4,
        type: 'analysis',
        expectedImpact: 'ROI 125%達成',
        dependsOn: '年間貢献度スコア確定データ',
        targetGroup: '全研修受講者'
      },
      {
        title: '高成果者の研修パターン分析',
        completed: false,
        type: 'analysis',
        dependsOn: '冬季評価上位者の研修履歴',
        expectedImpact: '成功モデルの横展開'
      },
      {
        title: '次年度研修プログラム改善提案',
        completed: false,
        type: 'planning',
        dependsOn: 'ROI分析・パターン分析結果',
        deadline: '12月末'
      }
    ],
    evaluationTasks: [
      {
        title: '年間貢献度スコア確定',
        completed: currentMonth > 12 || currentMonth < 4,
        requiresTraining: true,
        trainingImpact: '研修完了者は年間平均+8.5点向上を確認'
      }
    ],
    linkage: {
      type: 'critical',
      description: '年間成果確定と次年度計画策定の重要な連携',
      dataFlow: '年間評価確定 → ROI分析 → 成功パターン抽出 → 次年度改善計画'
    }
  }
];

const trainingPrograms: TrainingProgram[] = [
  {
    id: 'TR001',
    name: '基礎看護技術研修',
    category: 'basic',
    type: 'OJT',
    targetJobs: ['nurse', 'assistantNurse'],
    targetLevels: ['new', 'junior'],
    duration: 40,
    requiredFor: ['C01'],
    schedule: '4月',
    status: 'completed',
    participants: 25,
    completionRate: 100
  },
  {
    id: 'TR002',
    name: '医療安全管理研修',
    category: 'safety',
    type: 'OffJT',
    targetJobs: ['nurse', 'assistantNurse', 'nursingAide'],
    targetLevels: ['new', 'junior', 'midlevel', 'veteran'],
    duration: 8,
    requiredFor: ['C03'],
    schedule: '4月、10月',
    status: 'ongoing',
    participants: 120,
    completionRate: 85
  },
  {
    id: 'TR003',
    name: 'プリセプター養成研修',
    category: 'management',
    type: 'OffJT',
    targetJobs: ['nurse'],
    targetLevels: ['midlevel', 'veteran'],
    duration: 16,
    requiredFor: ['F02'],
    schedule: '2月',
    status: 'planned',
    participants: 15,
    completionRate: 0
  },
  {
    id: 'TR004',
    name: '認知症ケア研修',
    category: 'specialty',
    type: 'e-learning',
    targetJobs: ['nurse', 'careWorker', 'careAssistant'],
    targetLevels: ['junior', 'midlevel'],
    duration: 12,
    requiredFor: ['F06'],
    schedule: '随時',
    status: 'ongoing',
    participants: 45,
    completionRate: 60
  }
];

export default function EducationPage() {
  const [selectedFacility, setSelectedFacility] = useState('acute');
  const [selectedJob, setSelectedJob] = useState('nurse');
  const [selectedLevel, setSelectedLevel] = useState('junior');
  const [activeTab, setActiveTab] = useState('station');
  const [showLinkageDetails, setShowLinkageDetails] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    // 現在月をデフォルトで選択
    return new Date().getMonth() + 1;
  });
  const [systemAlerts, setSystemAlerts] = useState<CrossSystemAlert[]>([]);
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  
  useEffect(() => {
    // 教育研修システム向けアラートを取得
    const alerts = SystemIntegrationService.getAlertsForSystem('training');
    setSystemAlerts(alerts);
  }, []);
  
  // タスク完了ハンドラー
  const handleTaskCompletion = (taskId: string, completed: boolean) => {
    SystemIntegrationService.syncTaskCompletion(taskId, 'training', completed);
    SystemIntegrationService.addSyncActivity(
      'training',
      completed ? `研修タスク完了: ${taskId}` : `研修タスク未完了に変更: ${taskId}`,
      taskId
    );
    
    // アラートを更新
    const updatedAlerts = SystemIntegrationService.getAlertsForSystem('training');
    setSystemAlerts(updatedAlerts);
    
    // UIの再レンダリングをトリガー
    forceUpdate({});
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      basic: 'bg-blue-100 text-blue-800',
      specialty: 'bg-purple-100 text-purple-800',
      management: 'bg-orange-100 text-orange-800',
      safety: 'bg-red-100 text-red-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      OJT: 'bg-green-100 text-green-800',
      OffJT: 'bg-yellow-100 text-yellow-800',
      'e-learning': 'bg-indigo-100 text-indigo-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'ongoing':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'planned':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  // フィルタリング
  const filteredPrograms = trainingPrograms.filter(program => {
    const jobMatch = program.targetJobs.includes(selectedJob);
    const levelMatch = program.targetLevels.includes(selectedLevel);
    return jobMatch && levelMatch;
  });

  return (
    <div>
      <BreadcrumbBar />
      <div className={styles.container}>
        <div className={styles.tabNavigation}>
          <button 
            onClick={() => setActiveTab('station')}
            className={`${styles.tabButton} ${activeTab === 'station' ? styles.active : ''}`}
          >
            <span className={styles.tabIcon}>🚉</span>
            <span className={styles.tabLabel}>研修ステーション</span>
          </button>
          <button 
            onClick={() => setActiveTab('guide')}
            className={`${styles.tabButton} ${activeTab === 'guide' ? styles.active : ''}`}
          >
            <span className={styles.tabIcon}>📖</span>
            <span className={styles.tabLabel}>教育研修ガイド</span>
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`${styles.tabButton} ${activeTab === 'analytics' ? styles.active : ''}`}
          >
            <span className={styles.tabIcon}>📊</span>
            <span className={styles.tabLabel}>分析・効果測定</span>
          </button>
        </div>

        <div className={styles.tabContent}>

        {/* 研修ステーションタブ */}
        {activeTab === 'station' && (
          <div className={`${styles.stationContent} space-y-6`}>
            <div className={styles.stationCards}>
              {/* 研修計画カード */}
              <div className={`${styles.stationCard} ${styles.stationCardGradient}`}>
                <div className={styles.stationCardBadge}>計画必須</div>
                <div className={styles.stationCardContent}>
                  <div>
                    <div className={styles.stationCardHeader}>
                      <div className={styles.stationCardIcon}>
                        <Calendar className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h2 className={styles.stationCardTitle}>研修計画</h2>
                        <p className={styles.stationCardDescription}>
                          評価連動型年間研修スケジュール
                        </p>
                      </div>
                    </div>
                    <div className={styles.featureGrid}>
                      <div className={styles.featureItem}>
                        <CheckCircle className="h-4 w-4 text-blue-200" />
                        <span>年間研修計画</span>
                      </div>
                      <div className={styles.featureItem}>
                        <CheckCircle className="h-4 w-4 text-blue-200" />
                        <span>評価連動設定</span>
                      </div>
                      <div className={styles.featureItem}>
                        <CheckCircle className="h-4 w-4 text-blue-200" />
                        <span>ROI分析</span>
                      </div>
                      <div className={styles.featureItem}>
                        <CheckCircle className="h-4 w-4 text-blue-200" />
                        <span>効果測定</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    className={styles.actionButton}
                    onClick={() => setActiveTab('planning')}
                    style={{color: '#3b82f6'}}
                  >
                    <Calendar className="h-5 w-5" />
                    年間計画を開く
                  </button>
                </div>
              </div>

              {/* 受講管理カード */}
              <div className={`${styles.stationCard} ${styles.stationCardGradient}`} style={{background: 'linear-gradient(135deg, #9333ea, #7c3aed)'}}>
                <div className={styles.stationCardBadge}>進行中</div>
                <div className={styles.stationCardContent}>
                  <div>
                    <div className={styles.stationCardHeader}>
                      <div className={styles.stationCardIcon}>
                        <Users className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h2 className={styles.stationCardTitle}>受講管理</h2>
                        <p className={styles.stationCardDescription}>
                          個人別研修履歴と進捗管理
                        </p>
                      </div>
                    </div>
                    <div className={styles.featureGrid}>
                      <div className={styles.featureItem}>
                        <CheckCircle className="h-4 w-4 text-purple-200" />
                        <span>個人別進捗</span>
                      </div>
                      <div className={styles.featureItem}>
                        <CheckCircle className="h-4 w-4 text-purple-200" />
                        <span>受講履歴</span>
                      </div>
                      <div className={styles.featureItem}>
                        <CheckCircle className="h-4 w-4 text-purple-200" />
                        <span>修了証発行</span>
                      </div>
                      <div className={styles.featureItem}>
                        <CheckCircle className="h-4 w-4 text-purple-200" />
                        <span>フォロー管理</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    className={styles.actionButton}
                    onClick={() => setActiveTab('management')}
                    style={{color: '#9333ea'}}
                  >
                    <Users className="h-5 w-5" />
                    受講管理を開く
                  </button>
                </div>
              </div>
            </div>

            {/* 今月の重点タスク（動的表示） */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  今月の重点タスク（8月）
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">研修実施強化</h4>
                    <p className="text-sm text-gray-600 mb-3">第2四半期の研修を集中実施</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">医療安全</Badge>
                      <Badge variant="outline" className="text-xs">感染対策</Badge>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">個別フォローアップ</h4>
                    <p className="text-sm text-gray-600 mb-3">未受講者への個別対応</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs bg-orange-100 text-orange-800">要対応 25名</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 教育研修ガイドタブ */}
        {activeTab === 'guide' && (
          <div className={styles.tabContentPadding}>
            {/* システム概要 */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl text-center justify-center">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                  教育・研修管理システム概要
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-100">
                    <div className="text-4xl">🎯</div>
                    <div className="text-left">
                      <h3 className="text-xl font-semibold text-blue-900 mb-2">目的</h3>
                      <p className="text-blue-700">評価結果と連動した効果的な研修計画により、職員のスキル向上と組織全体のパフォーマンス向上を実現</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg border">
                    <div className="text-3xl mb-2">📊</div>
                    <h4 className="font-semibold text-green-800 mb-2">評価連動研修</h4>
                    <p className="text-sm text-green-700">個人の評価結果に基づく最適な研修プログラムの自動提案</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg border">
                    <div className="text-3xl mb-2">🔄</div>
                    <h4 className="font-semibold text-purple-800 mb-2">継続的改善</h4>
                    <p className="text-sm text-purple-700">研修効果の測定と次期プログラムへの反映による品質向上</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg border">
                    <div className="text-3xl mb-2">💰</div>
                    <h4 className="font-semibold text-orange-800 mb-2">ROI最大化</h4>
                    <p className="text-sm text-orange-700">研修投資効果の可視化と最適な予算配分の実現</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 年間スケジュール概要 */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-blue-600" />
                  年間スケジュール・評価連携タイムライン
                </CardTitle>
                <CardDescription>研修計画と評価実施のタイミングを統合管理</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <h4 className="font-semibold text-blue-800 mb-2">第1四半期（4-6月）</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• 基礎研修実施</li>
                      <li>• 前年度評価フィードバック</li>
                      <li>• 6月：夏季貢献度評価</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg bg-green-50">
                    <h4 className="font-semibold text-green-800 mb-2">第2四半期（7-9月）</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• 専門研修集中実施</li>
                      <li>• 個別フォローアップ</li>
                      <li>• 研修効果測定</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg bg-orange-50">
                    <h4 className="font-semibold text-orange-800 mb-2">第3四半期（10-12月）</h4>
                    <ul className="text-sm text-orange-700 space-y-1">
                      <li>• スキル向上研修</li>
                      <li>• 年間成果分析</li>
                      <li>• 12月：冬季貢献度評価</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg bg-purple-50">
                    <h4 className="font-semibold text-purple-800 mb-2">第4四半期（1-3月）</h4>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• 年度末総合評価</li>
                      <li>• 3月：技術評価実施</li>
                      <li>• 次年度計画策定</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span className="font-semibold">連携効果</span>
                  </div>
                  <p className="text-sm text-gray-700">研修受講者の評価スコアが年間平均+8.5点向上、ROI 125%を達成</p>
                </div>
              </CardContent>
            </Card>

            {/* 機能ストーリー */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-blue-600" />
                  機能ストーリー・業務フロー
                </CardTitle>
                <CardDescription>実際の業務での活用シナリオ</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-blue-800 mb-2">シナリオ1: 評価結果に基づく個別研修計画</h4>
                    <div className="text-sm text-gray-700 space-y-2">
                      <p><strong>状況：</strong>3月の技術評価で、看護師Aの「医療安全」スコアが平均より5点低い結果</p>
                      <p><strong>システム対応：</strong>自動的に医療安全研修を4月の個別計画に追加、優先度「高」で表示</p>
                      <p><strong>結果：</strong>6月の貢献度評価で該当スコアが8点向上、年間目標達成</p>
                    </div>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold text-green-800 mb-2">シナリオ2: ROI分析による研修プログラム最適化</h4>
                    <div className="text-sm text-gray-700 space-y-2">
                      <p><strong>状況：</strong>リーダーシップ研修の効果測定で期待値を下回る結果</p>
                      <p><strong>システム対応：</strong>受講者の評価向上データを分析し、プログラム内容の改善提案を生成</p>
                      <p><strong>結果：</strong>改善後の研修で効果が2倍に向上、予算効率125%を達成</p>
                    </div>
                  </div>
                  
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-semibold text-purple-800 mb-2">シナリオ3: 施設間比較による成功事例共有</h4>
                    <div className="text-sm text-gray-700 space-y-2">
                      <p><strong>状況：</strong>A施設の研修完了率が他施設より20%高い状況を発見</p>
                      <p><strong>システム対応：</strong>成功要因を分析し、他施設への横展開プランを自動生成</p>
                      <p><strong>結果：</strong>全施設の研修完了率が平均15%向上、組織全体のスキル底上げを実現</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* クイックアクセス・操作ガイド */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-6 w-6 text-blue-600" />
                  クイックアクセス・操作ガイド
                </CardTitle>
                <CardDescription>各機能へのアクセス方法と使い方</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <button 
                    onClick={() => setActiveTab('station')}
                    className="p-4 text-left border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">🚉</span>
                      <span className="font-semibold text-blue-800">研修ステーション</span>
                    </div>
                    <p className="text-sm text-gray-600">研修計画と受講管理の統合ダッシュボード</p>
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('analytics')}
                    className="p-4 text-left border rounded-lg hover:bg-green-50 hover:border-green-300 transition-all"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">📊</span>
                      <span className="font-semibold text-green-800">分析・効果測定</span>
                    </div>
                    <p className="text-sm text-gray-600">研修ROIと評価連携効果の可視化</p>
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('planning')}
                    className="p-4 text-left border rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-all"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">📅</span>
                      <span className="font-semibold text-purple-800">年間計画</span>
                    </div>
                    <p className="text-sm text-gray-600">研修と評価の連携スケジュール表示</p>
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('management')}
                    className="p-4 text-left border rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-all"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">👥</span>
                      <span className="font-semibold text-orange-800">受講管理</span>
                    </div>
                    <p className="text-sm text-gray-600">個人別進捗と未受講者フォロー</p>
                  </button>
                  
                  <div className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">🔗</span>
                      <span className="font-semibold text-gray-800">評価システム連携</span>
                    </div>
                    <p className="text-sm text-gray-600">評価ダッシュボードとのリアルタイム連携</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-yellow-50">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">📈</span>
                      <span className="font-semibold text-yellow-800">成果予測</span>
                    </div>
                    <p className="text-sm text-gray-600">研修効果のシミュレーションと予測</p>
                  </div>
                </div>
                
                {/* 導入効果の説明 */}
                <Alert className="mt-6 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>導入効果：</strong>評価連動研修により、職員の技術向上率が従来比150%向上。組織全体のパフォーマンス向上と人材定着率の改善を実現しています。
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 年間計画タブ - 評価管理ダッシュボードと統一構造 */}
        {activeTab === 'planning' && (
          <div className={styles.tabContentPadding}>
            {/* 教育研修担当者向け動的アクションブロック */}
            <TrainingManagerActionBlock />
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  教育研修年間計画
                  <Badge className="bg-green-100 text-green-800">評価連携</Badge>
                </CardTitle>
                <CardDescription>評価管理ダッシュボードとリアルタイム連携 - 詳細な依存関係表示</CardDescription>
              </CardHeader>
              <CardContent>
                {/* システム連携アラート */}
                {systemAlerts.length > 0 && (
                  <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Bell className="h-5 w-5 text-orange-600" />
                      <span className="font-semibold text-orange-800">研修システムアラート ({systemAlerts.length}件)</span>
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
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => SystemIntegrationService.resolveAlert(alert.id)}
                            >
                              解決
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 連携状況サマリー */}
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-semibold text-gray-800">評価システム連携状況</span>
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

                {/* 月選択ナビゲーション */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-medium text-gray-700">月を選択:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {yearSchedule.map((month) => {
                      const isSelected = selectedMonth === month.month;
                      const isCurrent = month.month === currentMonth;
                      return (
                        <button
                          key={month.month}
                          onClick={() => setSelectedMonth(month.month)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-lg'
                              : isCurrent
                              ? 'bg-blue-100 text-blue-800 border-2 border-blue-300 animate-pulse'
                              : month.highlight
                              ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {month.name}
                          {isCurrent && <span className="ml-1">🎯</span>}
                          {month.highlight && !isCurrent && <span className="ml-1">✨</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                {/* 月別詳細表示 */}
                <div className="space-y-6">
                  {yearSchedule.filter(month => month.month === selectedMonth).map((monthData) => {
                    const isCurrentMonth = monthData.month === currentMonth;
                    const isSelectedMonth = monthData.month === selectedMonth;
                    const cardClass = `border-2 ${
                      isCurrentMonth 
                        ? 'border-blue-500 bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 shadow-2xl ring-2 ring-blue-200' 
                        : isSelectedMonth
                        ? 'border-indigo-400 bg-gradient-to-br from-indigo-50 to-blue-50 shadow-lg'
                        : monthData.highlight 
                          ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300'
                    }`;
                    
                    return (
                      <Card key={monthData.month} className={cardClass}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <h3 className={`font-bold text-xl ${
                                isCurrentMonth ? 'text-blue-800' : 'text-gray-800'
                              }`}>
                                {monthData.name}
                              </h3>
                              {isCurrentMonth && (
                                <Badge className="bg-blue-600 text-white animate-pulse">
                                  🎯 実施中
                                </Badge>
                              )}
                              {monthData.highlight && !isCurrentMonth && (
                                <Badge className="bg-purple-600 text-white">
                                  重要月
                                </Badge>
                              )}
                            </div>
                            {monthData.linkage && (
                              <button
                                onClick={() => setShowLinkageDetails(
                                  showLinkageDetails === monthData.month ? null : monthData.month
                                )}
                                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                                  monthData.linkage.type === 'critical'
                                    ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                    : monthData.linkage.type === 'important'
                                      ? 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                                      : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                }`}
                              >
                                🔗 連携詳細
                              </button>
                            )}
                          </div>
                          
                          {/* 重要タスク表示 */}
                          {monthData.keyTasks && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {monthData.keyTasks.map((task, index) => (
                                <Badge key={index} className="bg-indigo-100 text-indigo-800">
                                  {task}
                                </Badge>
                              ))}
                            </div>
                          )}
                          
                          {/* 連携依存関係詳細表示 */}
                          {showLinkageDetails === monthData.month && monthData.linkage && (
                            <div className="mt-4 p-4 bg-white rounded-lg border-l-4 border-blue-500">
                              <div className="mb-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className={`w-3 h-3 rounded-full ${
                                    monthData.linkage.type === 'critical' ? 'bg-red-500'
                                      : monthData.linkage.type === 'important' ? 'bg-orange-500'
                                        : 'bg-yellow-500'
                                  }`}></div>
                                  <span className="font-semibold text-gray-800">連携依存関係</span>
                                </div>
                                <p className="text-sm text-gray-700 mb-2">{monthData.linkage.description}</p>
                                <div className="p-2 bg-gray-50 rounded text-xs text-gray-600">
                                  <strong>データフロー:</strong> {monthData.linkage.dataFlow}
                                </div>
                              </div>
                            </div>
                          )}
                        </CardHeader>
                        
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* 左側：研修タスク */}
                            <div className="border-r md:border-r pr-4">
                              <h4 className="text-md font-semibold mb-3 text-blue-800 flex items-center gap-2">
                                <BookOpen className="h-4 w-4" />
                                教育研修タスク
                              </h4>
                              <div className="space-y-2">
                                {monthData.trainingTasks.map((task, index) => {
                                  const taskId = `training-${monthData.month}-${index}`;
                                  const isCompleted = SystemIntegrationService.getTaskCompletionStatus(taskId, 'training');
                                  
                                  return (
                                  <div key={index} className={`p-3 rounded-lg border-l-3 ${
                                    isCompleted 
                                      ? 'bg-green-50 border-l-green-500'
                                      : 'bg-yellow-50 border-l-yellow-500'
                                  }`}>
                                    <div className="flex items-start gap-2">
                                      <label className="flex items-center gap-1 cursor-pointer mt-0.5">
                                        <input
                                          type="checkbox"
                                          checked={isCompleted}
                                          onChange={(e) => handleTaskCompletion(taskId, e.target.checked)}
                                          className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        {isCompleted ? (
                                          <CheckCircle className="h-4 w-4 text-green-500" />
                                        ) : (
                                          <Clock className="h-4 w-4 text-yellow-500" />
                                        )}
                                      </label>
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                          <span className={`text-sm font-medium ${
                                            isCompleted ? 'text-green-700' : 'text-yellow-700'
                                          }`}>
                                            {task.title}
                                          </span>
                                          {isCompleted && (
                                            <span className="text-xs text-green-600 flex items-center gap-1">
                                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                              </svg>
                                              同期済み
                                            </span>
                                          )}
                                        </div>
                                        
                                        {/* 依存情報表示 */}
                                        {task.dependsOn && (
                                          <div className="mt-1 text-xs text-gray-600">
                                            <strong>依存:</strong> {task.dependsOn}
                                          </div>
                                        )}
                                        
                                        {/* 対象グループ表示 */}
                                        {task.targetGroup && (
                                          <div className="mt-1 text-xs text-gray-600">
                                            <strong>対象:</strong> {task.targetGroup}
                                          </div>
                                        )}
                                        
                                        {/* 期待効果表示 */}
                                        {task.expectedImpact && (
                                          <div className="mt-1">
                                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                              効果: {task.expectedImpact}
                                            </span>
                                          </div>
                                        )}
                                        
                                        {/* 期限表示 */}
                                        {task.deadline && (
                                          <div className="mt-1 text-xs text-red-600">
                                            <strong>期限:</strong> {task.deadline}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  );
                                })}
                              </div>
                            </div>
                            
                            {/* 右側：評価タスク */}
                            <div className="pl-0 md:pl-4">
                              <h4 className="text-md font-semibold mb-3 text-purple-800 flex items-center gap-2">
                                <Target className="h-4 w-4" />
                                評価管理タスク
                              </h4>
                              <div className="space-y-2">
                                {monthData.evaluationTasks.map((task, index) => (
                                  <div key={index} className={`p-3 rounded-lg border-l-3 ${
                                    task.completed 
                                      ? 'bg-green-50 border-l-green-500'
                                      : 'bg-yellow-50 border-l-yellow-500'
                                  }`}>
                                    <div className="flex items-start gap-2">
                                      {task.completed ? (
                                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                                      ) : (
                                        <Clock className="h-4 w-4 text-yellow-500 mt-0.5" />
                                      )}
                                      <div className="flex-1">
                                        <span className={`text-sm font-medium ${
                                          task.completed ? 'text-green-700' : 'text-yellow-700'
                                        }`}>
                                          {task.title}
                                        </span>
                                        
                                        {/* 研修必要性表示 */}
                                        {task.requiresTraining && (
                                          <div className="mt-1">
                                            <span className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded">
                                              研修必要
                                            </span>
                                          </div>
                                        )}
                                        
                                        {/* 研修影響表示 */}
                                        {task.trainingImpact && (
                                          <div className="mt-1 text-xs text-gray-600">
                                            <strong>研修影響:</strong> {task.trainingImpact}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          {/* クロスリンクボタン */}
                          <div className="mt-4 pt-4 border-t">
                            <div className="flex justify-center">
                              <a
                                href={`/evaluation-design#month-${monthData.month}`}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-all text-sm font-medium"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Target className="h-4 w-4" />
                                評価管理ダッシュボードで確認
                                <ChevronRight className="h-4 w-4" />
                              </a>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* 統合サマリーカード */}
                <Card className="mt-6 border-2 border-green-400 bg-gradient-to-r from-green-50 to-blue-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-green-600" />
                      教育・評価連携サマリー
                    </CardTitle>
                    <CardDescription>リアルタイムデータに基づく連携効果測定</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-4 bg-white rounded-lg border hover:shadow-md transition-all">
                        <div className="text-2xl font-bold text-blue-600">{yearSchedule.reduce((sum, month) => sum + month.trainingTasks.length, 0)}</div>
                        <div className="text-xs text-gray-600">研修タスク総数</div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg border hover:shadow-md transition-all">
                        <div className="text-2xl font-bold text-purple-600">{yearSchedule.filter(m => m.highlight).length}</div>
                        <div className="text-xs text-gray-600">重要連携月</div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg border hover:shadow-md transition-all">
                        <div className="text-2xl font-bold text-green-600">100%</div>
                        <div className="text-xs text-gray-600">連携カバレッジ</div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg border hover:shadow-md transition-all">
                        <div className="text-2xl font-bold text-yellow-600">+8.5点</div>
                        <div className="text-xs text-gray-600">平均スコア向上</div>
                      </div>
                    </div>
                    
                    {/* 連携効果インジケーター */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-3 bg-white rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">研修完了率</span>
                          <span className="text-lg font-bold text-green-600">85%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{width: '85%'}}></div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-white rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">評価連動率</span>
                          <span className="text-lg font-bold text-blue-600">100%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{width: '100%'}}></div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-white rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">年間ROI</span>
                          <span className="text-lg font-bold text-purple-600">125%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-gradient-to-r from-purple-400 to-blue-500 h-2 rounded-full" style={{width: '100%'}}></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* 評価システムへのリンク */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-1">評価管理ダッシュボードと連携</h4>
                          <p className="text-sm text-gray-600">リアルタイムで評価結果と研修効果を相互参照</p>
                        </div>
                        <a
                          href="/dashboard"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          評価ダッシュボードへ
                          <ChevronRight className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 受講管理タブ */}
        {activeTab === 'management' && (
          <div className={styles.tabContentPadding}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 研修プログラム一覧 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    研修プログラム一覧
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredPrograms.map(program => (
                      <div key={program.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getStatusIcon(program.status)}
                              <span className="font-semibold">{program.name}</span>
                              <Badge className={getCategoryColor(program.category)}>
                                {program.category}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{program.duration}時間</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Target className="h-4 w-4" />
                                <span>完了率: {program.completionRate}%</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            管理
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 個人別受講状況 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    個人別受講状況
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">山田太郎</p>
                        <p className="text-sm text-gray-600">看護師・中堅</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600">95%完了</p>
                        <Badge variant="outline" className="text-xs">評価対象</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">佐藤花子</p>
                        <p className="text-sm text-gray-600">介護士・新人</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-orange-600">60%完了</p>
                        <Badge variant="outline" className="text-xs bg-orange-100 text-orange-800">要フォロー</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">田中一郎</p>
                        <p className="text-sm text-gray-600">理学療法士・ベテラン</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600">100%完了</p>
                        <Badge variant="outline" className="text-xs bg-green-100 text-green-800">模範</Badge>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    全件表示
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* 未受講者アラート */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  未受講者アラート
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Alert className="border-orange-200 bg-orange-50">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-orange-700">
                      医療安全研修の未受講者が25名います。評価実施前に受講完了が必要です。
                    </AlertDescription>
                  </Alert>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                      個別通知送信
                    </Button>
                    <Button size="sm" variant="outline">
                      詳細確認
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 分析・効果測定タブ */}
        {activeTab === 'analytics' && (
          <div className={styles.tabContentPadding}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">研修ROI</span>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold">125%</div>
                  <div className="text-sm text-green-600">+5% 前期比</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">評価スコア向上</span>
                    <Users className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="text-2xl font-bold">+7.2点</div>
                  <div className="text-sm text-gray-600">研修受講者平均</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">研修完了率</span>
                    <BarChart3 className="h-4 w-4 text-purple-500" />
                  </div>
                  <div className="text-2xl font-bold">78.5%</div>
                  <div className="text-sm text-gray-600">年間目標達成</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">評価連携率</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-sm text-green-600">システム連携完了</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 研修効果と評価スコアの相関分析 */}
              <Card>
                <CardHeader>
                  <CardTitle>研修効果と評価スコアの相関</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 border rounded-lg bg-green-50">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">医療安全研修</span>
                        <Badge className="bg-green-100 text-green-800">効果大</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">受講者の技術評価が平均+8.5点向上</p>
                    </div>
                    <div className="p-3 border rounded-lg bg-blue-50">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">リーダーシップ研修</span>
                        <Badge className="bg-blue-100 text-blue-800">効果中</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">受講者の貢献度評価が平均+5.2点向上</p>
                    </div>
                    <div className="p-3 border rounded-lg bg-yellow-50">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">専門技術研修</span>
                        <Badge className="bg-yellow-100 text-yellow-800">要改善</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">効果が限定的（+2.1点）。内容の見直しが必要</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 効果予測シミュレーション */}
              <Card>
                <CardHeader>
                  <CardTitle>効果予測シミュレーション</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Alert className="border-blue-200 bg-blue-50">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-700">
                        <strong>来期予測:</strong> 現在の研修計画で平均評価スコアが82.3点に向上見込み
                      </AlertDescription>
                    </Alert>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Sグレード到達予測</span>
                        <span className="font-medium">18% → 25%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Aグレード到達予測</span>
                        <span className="font-medium">35% → 42%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>C・Dグレード削減予測</span>
                        <span className="font-medium">25% → 15%</span>
                      </div>
                    </div>
                    <Button className="w-full" size="sm">
                      詳細シミュレーション
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 施設別進捗 */}
            <Card>
              <CardHeader>
                <CardTitle>施設別研修進捗と評価連携状況</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(facilityTypeNames).map(([key, name]) => (
                    <div key={key} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{name}</span>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs">研修75%</Badge>
                          <Badge variant="outline" className="text-xs bg-green-100 text-green-800">連携OK</Badge>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: '75%' }}
                        />
                      </div>
                    </div>
                  ))}
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