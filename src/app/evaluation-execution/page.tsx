'use client';

import React, { useState } from 'react';
import CommonHeader from '@/components/CommonHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import styles from './EvaluationExecution.module.css';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ArrowLeft,
  User,
  FileText,
  CheckCircle,
  Eye,
  MessageSquare,
  AlertTriangle,
  Search,
  Filter,
  Download,
  Upload,
  Calendar,
  Clock,
  TrendingUp,
  Sparkles,
  ChevronRight,
  PlayCircle,
  Edit3,
  Zap,
  Users,
  AlertCircle,
  Send,
  ClipboardList,
  UserCheck,
  HelpCircle,
  RefreshCw,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import { ExperienceLevelMapper, ExperienceLevelsV3 } from '@/services/evaluationV3Service';
import DashboardHeader from '@/components/evaluation/DashboardHeader';
import IntegratedJudgment from '@/components/evaluation/IntegratedJudgment';
import DisclosureManagementV3 from '@/components/evaluation/DisclosureManagementV3';
import AppealReceptionV3 from '@/components/evaluation/AppealReceptionV3';
import EvaluationSheetSelector from '@/components/evaluation/EvaluationSheetSelector';

interface MonthlyEvaluationTask {
  month: number;
  name: string;
  evaluationType: 'contribution' | 'technical' | 'comprehensive';
  points: number;
  status: 'current' | 'upcoming' | 'completed' | 'inactive';
  deadline: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  tasks: {
    title: string;
    completed: boolean;
    urgent?: boolean;
    staffCount?: number;
  }[];
}

export default function EvaluationExecutionPage() {
  const [currentDate] = useState(new Date());
  const currentMonth = currentDate.getMonth() + 1; // 1-12

  // 月別評価業務データ
  const monthlyEvaluationTasks: MonthlyEvaluationTask[] = [
    {
      month: 6,
      name: '夏季貢献度評価',
      evaluationType: 'contribution',
      points: 25,
      status: currentMonth === 6 ? 'current' : currentMonth > 6 ? 'completed' : 'upcoming',
      deadline: '6月30日',
      description: '組織貢献度の中間評価（年間50点の前半分）',
      priority: 'high',
      tasks: [
        { title: '各施設から評価データ収集', completed: currentMonth > 6, staffCount: 45 },
        { title: 'Excelデータ取込・検証', completed: currentMonth > 6, staffCount: 45 },
        { title: '相対評価ランキング作成', completed: currentMonth > 6 },
        { title: '評価確定・承認', completed: currentMonth > 6 }
      ]
    },
    {
      month: 8,
      name: '夏季評価フォローアップ',
      evaluationType: 'contribution',
      points: 0,
      status: currentMonth === 8 ? 'current' : currentMonth > 8 ? 'completed' : 'upcoming',
      deadline: '8月15日',
      description: '夏季評価結果の確認と異議申立対応',
      priority: 'medium',
      tasks: [
        { title: '夏季評価結果通知完了確認', completed: currentMonth > 8, staffCount: 45 },
        { title: '異議申立の受付・対応', completed: currentMonth > 8, staffCount: 2 },
        { title: '評価結果の最終確定', completed: currentMonth > 8 }
      ]
    },
    {
      month: 12,
      name: '冬季貢献度評価',
      evaluationType: 'contribution',
      points: 25,
      status: currentMonth === 12 ? 'current' : currentMonth > 12 || currentMonth < 4 ? 'completed' : 'upcoming',
      deadline: '12月28日',
      description: '組織貢献度の最終評価（年間50点の後半分）',
      priority: 'high',
      tasks: [
        { title: '各施設から評価データ収集', completed: currentMonth > 12 || currentMonth < 4, staffCount: 45 },
        { title: 'Excelデータ取込・検証', completed: currentMonth > 12 || currentMonth < 4, staffCount: 45 },
        { title: '年間貢献度スコア算出', completed: currentMonth > 12 || currentMonth < 4 },
        { title: '相対評価ランキング作成', completed: currentMonth > 12 || currentMonth < 4 }
      ]
    },
    {
      month: 3,
      name: '技術評価実施',
      evaluationType: 'technical',
      points: 50,
      status: currentMonth === 3 ? 'current' : currentMonth > 3 ? 'completed' : 'upcoming',
      deadline: '3月31日',
      description: '年間技術評価の実施（法人統一30点＋施設特化20点）',
      priority: 'high',
      tasks: [
        { title: '評価シート配布', completed: currentMonth > 3, urgent: currentMonth === 3, staffCount: 45 },
        { title: '上司評価・本人評価の実施', completed: currentMonth > 3, urgent: currentMonth === 3, staffCount: 45 },
        { title: '100点満点スコア確定', completed: currentMonth > 3, staffCount: 45 },
        { title: '2軸相対評価で最終グレード決定', completed: currentMonth > 3 }
      ]
    },
    {
      month: 4,
      name: '年度末評価完了・新年度準備',
      evaluationType: 'comprehensive',
      points: 100,
      status: currentMonth === 4 ? 'current' : currentMonth > 4 ? 'completed' : 'upcoming',
      deadline: '4月15日',
      description: '最終評価結果の確定と新年度準備',
      priority: 'high',
      tasks: [
        { title: '最終評価結果フィードバック', completed: currentMonth > 4, staffCount: 45 },
        { title: '昇給・賞与への反映', completed: currentMonth > 4 },
        { title: '新年度評価計画策定', completed: currentMonth > 4 },
        { title: '評価者研修の実施', completed: currentMonth > 4 }
      ]
    }
  ];

  // 現在月の評価タスクを取得
  const currentMonthTask = monthlyEvaluationTasks.find(task => task.status === 'current');
  const upcomingTasks = monthlyEvaluationTasks.filter(task => task.status === 'upcoming').slice(0, 2);

  // モックデータ：評価対象職員
  const staffList = [
    {
      id: '1',
      name: '山田 花子',
      department: '内科病棟',
      jobCategory: '看護師',
      experienceYears: 3,
      experienceLevel: 'junior',
      experienceLabel: '若手',
      facilityType: 'acute',
      evaluationStatus: 'completed',
      technicalScore: 42,
      contributionScore: 38,
      totalScore: 80,
      grade: 'A'
    },
    {
      id: '2',
      name: '佐藤 太郎',
      department: '外科病棟',
      jobCategory: '看護師',
      experienceYears: 1,
      experienceLevel: 'new',
      experienceLabel: '新人',
      facilityType: 'acute',
      evaluationStatus: 'in-progress',
      technicalScore: 35,
      contributionScore: null,
      totalScore: null,
      grade: null
    },
    {
      id: '3',
      name: '鈴木 美咲',
      department: 'ICU',
      jobCategory: '看護師',
      experienceYears: 8,
      experienceLevel: 'midlevel',
      experienceLabel: '中堅',
      facilityType: 'acute',
      evaluationStatus: 'not-started',
      technicalScore: null,
      contributionScore: null,
      totalScore: null,
      grade: null
    },
    {
      id: '4',
      name: '田中 健一',
      department: '内科病棟',
      jobCategory: '看護師',
      experienceYears: 15,
      experienceLevel: 'veteran',
      experienceLabel: 'ベテラン',
      facilityType: 'acute',
      evaluationStatus: 'disclosed',
      technicalScore: 45,
      contributionScore: 42,
      totalScore: 87,
      grade: 'A'
    },
    {
      id: '5',
      name: '高橋 さゆり',
      department: '外科病棟',
      jobCategory: '看護師',
      experienceYears: 2,
      experienceLevel: 'junior',
      experienceLabel: '若手',
      facilityType: 'recovery',
      evaluationStatus: 'appealed',
      technicalScore: 38,
      contributionScore: 35,
      totalScore: 73,
      grade: 'B',
      appealReason: '技術評価の一部項目について再考を希望'
    }
  ];

  // State定義
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedExperienceLevel, setSelectedExperienceLevel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [staffData, setStaffData] = useState(staffList);
  const [selectedStaffForEvaluation, setSelectedStaffForEvaluation] = useState<string | null>(null);

  // フィルタリング
  const filteredStaff = staffData.filter(staff => {
    if (selectedDepartment !== 'all' && staff.department !== selectedDepartment) return false;
    if (selectedExperienceLevel !== 'all' && staff.experienceLevel !== selectedExperienceLevel) return false;
    if (searchQuery && !staff.name.includes(searchQuery)) return false;
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">評価完了</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800">評価中</Badge>;
      case 'not-started':
        return <Badge className="bg-gray-100 text-gray-800">未着手</Badge>;
      case 'disclosed':
        return <Badge className="bg-purple-100 text-purple-800">開示済み</Badge>;
      case 'appealed':
        return <Badge className="bg-orange-100 text-orange-800">異議申立中</Badge>;
      default:
        return <Badge>-</Badge>;
    }
  };

  const getGradeBadge = (grade: string | null) => {
    if (!grade) return <span className="text-gray-400">-</span>;
    const colors: Record<string, string> = {
      'S': 'bg-red-100 text-red-800',
      'A': 'bg-orange-100 text-orange-800',
      'B': 'bg-green-100 text-green-800',
      'C': 'bg-blue-100 text-blue-800',
      'D': 'bg-gray-100 text-gray-800'
    };
    return <Badge className={colors[grade] || ''}>{grade}</Badge>;
  };

  // 統計情報
  const statistics = {
    total: staffData.length,
    completed: staffData.filter(s => s.evaluationStatus === 'completed' || s.evaluationStatus === 'disclosed').length,
    inProgress: staffData.filter(s => s.evaluationStatus === 'in-progress').length,
    notStarted: staffData.filter(s => s.evaluationStatus === 'not-started').length,
    appealed: staffData.filter(s => s.evaluationStatus === 'appealed').length
  };

  const completionRate = Math.round((statistics.completed / statistics.total) * 100);

  const handleRefresh = () => {
    // データを再取得する処理
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div>
      <CommonHeader title="個人評価管理" />
      <div className={styles.container}>
        {/* 最上部：メインタブナビゲーション */}
        <div className="mb-4 flex items-center justify-between">
          <div className={`${styles.mainTabNavigation} flex space-x-2`}>
            <button className={`${styles.mainTabButton} ${styles.active} flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-blue-600 text-white shadow-lg`}>
              <span className={styles.tabIcon}>🏠</span>
              <span className={styles.tabLabel}>作業ダッシュボード</span>
            </button>
            <button className={`${styles.mainTabButton} flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100`}>
              <span className={styles.tabIcon}>✍️</span>
              <span className={styles.tabLabel}>評価入力</span>
            </button>
            <button className={`${styles.mainTabButton} flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100`}>
              <span className={styles.tabIcon}>🔍</span>
              <span className={styles.tabLabel}>評価確認</span>
            </button>
            <button className={`${styles.mainTabButton} flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100`}>
              <span className={styles.tabIcon}>⚖️</span>
              <span className={styles.tabLabel}>総合判定</span>
            </button>
            <button className={`${styles.mainTabButton} flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100`}>
              <span className={styles.tabIcon}>👁️</span>
              <span className={styles.tabLabel}>評価開示</span>
            </button>
            <button className={`${styles.mainTabButton} flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100`}>
              <span className={styles.tabIcon}>📢</span>
              <span className={styles.tabLabel}>異議申立</span>
            </button>
          </div>
          <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg px-4 py-2 shadow-sm">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <div className="text-sm">
              <div className="font-medium text-purple-900">V3評価システム</div>
              <div className="text-purple-700">技術50点+組織貢献50点</div>
            </div>
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 bg-purple-100 text-purple-800 font-medium">100点満点</div>
          </div>
        </div>

        {/* 評価フェーズ情報と今月のタスク */}
        <div className={`${styles.tabContent} space-y-6 p-6`}>
          <div className="rounded-xl text-card-foreground border-4 border-blue-600 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 shadow-2xl ring-4 ring-opacity-30">
            <div className="flex flex-col space-y-1.5 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-full shadow-lg animate-pulse bg-gradient-to-br from-green-600 to-emerald-700">
                    <Users className="h-8 w-8 text-white drop-shadow-lg" />
                  </div>
                  <div>
                    <h3 className="tracking-tight text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-800 bg-clip-text text-transparent">8月: 夏季評価フォローアップ</h3>
                    <p className="text-xl font-medium text-indigo-700">フォローアップ・夏季評価結果の確認と異議申立対応</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 px-6 py-3 text-lg font-semibold shadow-lg animate-pulse bg-gradient-to-r from-yellow-600 to-orange-700 text-white">🎯 実施中</div>
                  <div className="mt-2 text-sm text-indigo-600 font-medium">締切: 8月15日</div>
                </div>
              </div>
            </div>
            <div className="p-6 pt-0">
              <div className="space-y-4">
                <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  今月の作業タスク
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 rounded-xl border transition-all hover:shadow-md bg-white border-gray-200">
                    <div className="w-8 h-8 border-2 border-gray-300 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-gray-700">夏季評価結果通知完了確認</span>
                      <div className="text-xs text-gray-600 mt-1">対象: 45名</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl border transition-all hover:shadow-md bg-white border-gray-200">
                    <div className="w-8 h-8 border-2 border-gray-300 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-gray-700">異議申立の受付・対応</span>
                      <div className="text-xs text-gray-600 mt-1">対象: 2名</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl border transition-all hover:shadow-md bg-white border-gray-200">
                    <div className="w-8 h-8 border-2 border-gray-300 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-gray-700">評価結果の最終確定</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                    <Upload className="h-5 w-5 mr-2" />
                    Excelデータ取込
                  </button>
                  <Link href="/evaluation-design">
                    <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 py-2 px-6">
                      <Calendar className="h-4 w-4 mr-2" />
                      年間スケジュール
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-card text-card-foreground shadow border-2 border-purple-200">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="font-semibold leading-none tracking-tight flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                今後の評価予定
              </h3>
              <p className="text-sm text-muted-foreground">次の評価業務の準備と計画</p>
            </div>
            <div className="p-6 pt-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-200 rounded-full">
                      <Users className="h-5 w-5 text-purple-700" />
                    </div>
                    <div>
                      <div className="font-semibold text-purple-900">12月: 冬季貢献度評価</div>
                      <div className="text-sm text-purple-700">25点・締切: 12月28日</div>
                    </div>
                  </div>
                  <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 bg-purple-100 text-purple-800">予定</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 統合ダッシュボードヘッダー */}
        <DashboardHeader
          title="評価統合ダッシュボード"
          description="評価進捗と研修受講状況を一元管理"
          onRefresh={handleRefresh}
        />
        {/* 進捗オーバービューカード */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="border-2 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                評価対象者サマリー
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-gray-700">{statistics.total}</div>
                  <div className="text-sm text-gray-600">全対象者</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">完了</span>
                    <span className="font-bold text-green-600">{statistics.completed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">進行中</span>
                    <span className="font-bold text-blue-600">{statistics.inProgress}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">未着手</span>
                    <span className="font-bold text-gray-600">{statistics.notStarted}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                進捗状況
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">全体進捗</span>
                    <span className="text-2xl font-bold text-green-600">{completionRate}%</span>
                  </div>
                  <Progress value={completionRate} className="h-3" />
                </div>
                <Alert className="border-yellow-200 bg-yellow-50">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-sm">
                    締切まであと<strong>7日</strong>
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 進捗バー */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">全体進捗</span>
              <span className="text-sm text-gray-600">{completionRate}%</span>
            </div>
            <Progress value={completionRate} className="h-2" />
          </CardContent>
        </Card>

        {/* V3評価システム専用ヘッダー */}
        <div className="mb-4 flex items-center justify-between">
          <div className={styles.mainTabNavigation}>
            {[
              { id: 'dashboard', label: '作業ダッシュボード', icon: '🏠' },
              { id: 'input', label: '評価入力', icon: '✍️' },
              { id: 'review', label: '評価確認', icon: '🔍' },
              { id: 'judgment', label: '総合判定', icon: '⚖️' },
              { id: 'disclosure', label: '評価開示', icon: '👁️' },
              { id: 'appeal', label: '異議申立', icon: '📢' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${styles.mainTabButton} ${activeTab === tab.id ? styles.active : ''}`}
              >
                <span className={styles.tabIcon}>{tab.icon}</span>
                <span className={styles.tabLabel}>{tab.label}</span>
              </button>
            ))}
          </div>
          
          {/* V3システム表示 */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg px-4 py-2 shadow-sm">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <div className="text-sm">
              <div className="font-medium text-purple-900">V3評価システム</div>
              <div className="text-purple-700">技術50点+組織貢献50点</div>
            </div>
            <Badge className="bg-purple-100 text-purple-800 font-medium">
              100点満点
            </Badge>
          </div>
        </div>

        <div className={styles.tabContent}>
          {activeTab === 'dashboard' && (
            <div className="space-y-6 p-6">
              {/* 現在の評価業務カード */}
              {currentMonthTask && (
                <Card className="border-4 border-blue-600 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 shadow-2xl ring-4 ring-blue-200 ring-opacity-30">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-full shadow-lg animate-pulse ${
                          currentMonthTask.evaluationType === 'contribution' ? 'bg-gradient-to-br from-green-600 to-emerald-700' :
                          currentMonthTask.evaluationType === 'technical' ? 'bg-gradient-to-br from-purple-600 to-indigo-700' :
                          'bg-gradient-to-br from-orange-600 to-red-700'
                        }`}>
                          {currentMonthTask.evaluationType === 'contribution' && <Users className="h-8 w-8 text-white drop-shadow-lg" />}
                          {currentMonthTask.evaluationType === 'technical' && <ClipboardList className="h-8 w-8 text-white drop-shadow-lg" />}
                          {currentMonthTask.evaluationType === 'comprehensive' && <Activity className="h-8 w-8 text-white drop-shadow-lg" />}
                        </div>
                        <div>
                          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-800 bg-clip-text text-transparent">
                            {currentMonth}月: {currentMonthTask.name}
                          </CardTitle>
                          <CardDescription className="text-xl font-medium text-indigo-700">
                            {currentMonthTask.points > 0 ? `${currentMonthTask.points}点` : 'フォローアップ'} ・ {currentMonthTask.description}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={`px-6 py-3 text-lg font-semibold shadow-lg animate-pulse ${
                          currentMonthTask.priority === 'high' ? 'bg-gradient-to-r from-red-600 to-pink-700 text-white' :
                          currentMonthTask.priority === 'medium' ? 'bg-gradient-to-r from-yellow-600 to-orange-700 text-white' :
                          'bg-gradient-to-r from-blue-600 to-indigo-700 text-white'
                        }`}>
                          🎯 実施中
                        </Badge>
                        <div className="mt-2 text-sm text-indigo-600 font-medium">
                          締切: {currentMonthTask.deadline}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                        今月の作業タスク
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        {currentMonthTask.tasks.map((task, idx) => (
                          <div key={idx} className={`flex items-center gap-3 p-4 rounded-xl border transition-all hover:shadow-md ${
                            task.completed ? 'bg-green-50 border-green-200' : 
                            task.urgent ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'
                          }`}>
                            {task.completed ? (
                              <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-full">
                                <CheckCircle className="w-5 h-5 text-white" />
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
                            <div className="flex-1">
                              <span className={`font-medium ${
                                task.completed ? 'text-green-700' : 
                                task.urgent ? 'text-red-700' : 'text-gray-700'
                              }`}>
                                {task.title}
                              </span>
                              {task.staffCount && (
                                <div className="text-xs text-gray-600 mt-1">
                                  対象: {task.staffCount}名
                                </div>
                              )}
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
                        ))}
                      </div>
                      
                      {/* クイックアクション */}
                      <div className="mt-6 flex gap-3">
                        {currentMonthTask.evaluationType === 'contribution' && (
                          <Button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                            <Upload className="h-5 w-5 mr-2" />
                            Excelデータ取込
                          </Button>
                        )}
                        {currentMonthTask.evaluationType === 'technical' && (
                          <Button 
                            className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                            onClick={() => setActiveTab('input')}
                          >
                            <ClipboardList className="h-5 w-5 mr-2" />
                            技術評価開始
                          </Button>
                        )}
                        <Link href="/evaluation-design">
                          <Button variant="outline" className="px-6">
                            <Calendar className="h-4 w-4 mr-2" />
                            年間スケジュール
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* 今後の予定 */}
              {upcomingTasks.length > 0 && (
                <Card className="border-2 border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-purple-600" />
                      今後の評価予定
                    </CardTitle>
                    <CardDescription>
                      次の評価業務の準備と計画
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingTasks.map((task, idx) => (
                        <div key={task.month} className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-200 rounded-full">
                              {task.evaluationType === 'contribution' && <Users className="h-5 w-5 text-purple-700" />}
                              {task.evaluationType === 'technical' && <ClipboardList className="h-5 w-5 text-purple-700" />}
                              {task.evaluationType === 'comprehensive' && <Activity className="h-5 w-5 text-purple-700" />}
                            </div>
                            <div>
                              <div className="font-semibold text-purple-900">
                                {task.month}月: {task.name}
                              </div>
                              <div className="text-sm text-purple-700">
                                {task.points > 0 ? `${task.points}点` : 'フォルローアップ'} ・ 締切: {task.deadline}
                              </div>
                            </div>
                          </div>
                          <Badge className="bg-purple-100 text-purple-800">
                            予定
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
          
          {activeTab === 'input' && (
            <div className="space-y-6 p-6">
              {/* 評価シート選択モード */}
              {selectedStaffForEvaluation ? (
                <div>
                  <div className="mb-4 flex items-center gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedStaffForEvaluation(null)}
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      職員一覧に戻る
                    </Button>
                    <div className="text-lg font-semibold">
                      {staffData.find(s => s.id === selectedStaffForEvaluation)?.name} の評価
                    </div>
                  </div>
                  
                  <EvaluationSheetSelector
                    staff={staffData.find(s => s.id === selectedStaffForEvaluation)!}
                    onEvaluationSubmit={async (evaluationData) => {
                      console.log('評価データ受信:', evaluationData);
                      
                      // 実際の評価データ保存処理
                      try {
                        // 職員の評価状況を更新
                        const contributionScore = Math.round(Math.random() * 50); // 仮の値
                        const totalScore = Math.round(evaluationData.technicalTotal + contributionScore);
                        
                        const updatedStaff = staffData.map(staff => {
                          if (staff.id === selectedStaffForEvaluation) {
                            return {
                              ...staff,
                              evaluationStatus: 'completed' as const,
                              technicalScore: evaluationData.technicalTotal,
                              contributionScore,
                              totalScore,
                              grade: totalScore >= 90 ? 'S' : 
                                     totalScore >= 80 ? 'A' :
                                     totalScore >= 70 ? 'B' :
                                     totalScore >= 60 ? 'C' : 'D'
                            };
                          }
                          return staff;
                        });
                        
                        // 状態を更新
                        setStaffData(updatedStaff);
                        
                        // リアルタイムでのデータ更新処理（将来的にはAPIに送信）
                        console.log('評価完了:', updatedStaff.find(s => s.id === selectedStaffForEvaluation));
                        
                        alert(`評価が正常に提出されました！\n技術評価: ${evaluationData.technicalTotal}点\n評価項目数: ${evaluationData.corporateEvaluation.items.length + evaluationData.facilityEvaluation.items.length}項目`);
                        
                        setSelectedStaffForEvaluation(null);
                        handleRefresh();
                        
                      } catch (error) {
                        console.error('評価提出エラー:', error);
                        alert('評価の提出中にエラーが発生しました。もう一度お試しください。');
                      }
                    }}
                    mode="input"
                  />
                </div>
              ) : (
                /* 職員一覧表示 */
                <Card className="border-2 border-blue-200">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <ClipboardList className="h-5 w-5 text-blue-600" />
                          評価対象者一覧
                        </CardTitle>
                        <CardDescription>
                          評価シートへの入力を行います
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm" onClick={handleRefresh}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        更新
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* フィルター */}
                    <div className="flex gap-4 mb-6">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            placeholder="職員名で検索"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="部署で絞り込み" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">全部署</SelectItem>
                          <SelectItem value="内科病棟">内科病棟</SelectItem>
                          <SelectItem value="外科病棟">外科病棟</SelectItem>
                          <SelectItem value="ICU">ICU</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={selectedExperienceLevel} onValueChange={setSelectedExperienceLevel}>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="経験レベル" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">全レベル</SelectItem>
                          <SelectItem value="new">新人（～1年）</SelectItem>
                          <SelectItem value="junior">若手（2～3年）</SelectItem>
                          <SelectItem value="midlevel">中堅（4～10年）</SelectItem>
                          <SelectItem value="veteran">ベテラン（11年～）</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* 職員リスト */}
                    <div className="space-y-3">
                      {filteredStaff.map((staff) => {
                        const isNotStarted = staff.evaluationStatus === 'not-started';
                        const isInProgress = staff.evaluationStatus === 'in-progress';
                        const isCompleted = staff.evaluationStatus === 'completed' || staff.evaluationStatus === 'disclosed';
                        const isAppealed = staff.evaluationStatus === 'appealed';
                        
                        return (
                          <div key={staff.id} className={`border-2 rounded-lg p-4 hover:shadow-lg transition-all
                            ${isNotStarted ? 'border-red-200 bg-red-50' : ''}
                            ${isInProgress ? 'border-blue-200 bg-blue-50' : ''}
                            ${isCompleted ? 'border-green-200 bg-green-50' : ''}
                            ${isAppealed ? 'border-orange-200 bg-orange-50' : ''}
                          `}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center
                                  ${isNotStarted ? 'bg-red-200' : ''}
                                  ${isInProgress ? 'bg-blue-200' : ''}
                                  ${isCompleted ? 'bg-green-200' : ''}
                                  ${isAppealed ? 'bg-orange-200' : ''}
                                `}>
                                  <User className={`w-6 h-6
                                    ${isNotStarted ? 'text-red-600' : ''}
                                    ${isInProgress ? 'text-blue-600' : ''}
                                    ${isCompleted ? 'text-green-600' : ''}
                                    ${isAppealed ? 'text-orange-600' : ''}
                                  `} />
                                </div>
                                <div>
                                  <h4 className="font-bold text-lg">{staff.name}</h4>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Badge variant="outline" className="text-xs">{staff.department}</Badge>
                                    <Badge variant="outline" className="text-xs">{staff.jobCategory}</Badge>
                                    <Badge className="bg-purple-100 text-purple-800 text-xs">{staff.experienceLabel}</Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  {staff.totalScore !== null ? (
                                    <div className="flex flex-col items-end">
                                      <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold">{staff.totalScore}</span>
                                        <span className="text-sm text-gray-600">/ 100点</span>
                                      </div>
                                      <div className="mt-1">
                                        {getGradeBadge(staff.grade)}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-gray-400 text-sm">未評価</div>
                                  )}
                                </div>
                                <div className="flex flex-col gap-2">
                                  {getStatusBadge(staff.evaluationStatus)}
                                  <div className="flex gap-2">
                                    {isNotStarted && (
                                      <Link href={`/evaluation-execution/dynamic/${staff.id}`}>
                                        <Button 
                                          className="bg-purple-600 hover:bg-purple-700"
                                          size="sm"
                                          title="AIが経験レベルに応じた評価シートを生成"
                                        >
                                          <Sparkles className="w-4 h-4 mr-2" />
                                          AI生成
                                        </Button>
                                      </Link>
                                    )}
                                    <Button 
                                      variant={isNotStarted ? 'default' : 'outline'}
                                      size="sm"
                                      className={isNotStarted ? 'bg-red-600 hover:bg-red-700' : ''}
                                      onClick={() => setSelectedStaffForEvaluation(staff.id)}
                                    >
                                      {isNotStarted && <PlayCircle className="w-4 h-4 mr-2" />}
                                      {isInProgress && <Edit3 className="w-4 h-4 mr-2" />}
                                      {isCompleted && <Eye className="w-4 h-4 mr-2" />}
                                      {isAppealed && <MessageSquare className="w-4 h-4 mr-2" />}
                                      {isNotStarted ? '評価開始' : 
                                       isInProgress ? '続きから' :
                                       isCompleted ? '結果確認' :
                                       '対応確認'}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {isAppealed && staff.appealReason && (
                              <Alert className="mt-3 border-orange-300 bg-orange-100">
                                <AlertTriangle className="h-4 w-4 text-orange-600" />
                                <AlertDescription className="text-sm">
                                  <strong>異議申立理由：</strong> {staff.appealReason}
                                </AlertDescription>
                              </Alert>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'review' && (
            <div className="space-y-6 p-6">
            <Card>
              <CardHeader>
                <CardTitle>評価確認</CardTitle>
                <CardDescription>
                  上司評価と本人評価の確認・調整を行います
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>評価の確認プロセス</AlertTitle>
                  <AlertDescription>
                    1次評価（上司）と本人評価を比較し、必要に応じて調整会議を実施します
                  </AlertDescription>
                </Alert>
                <div className="mt-6 space-y-4">
                  {filteredStaff
                    .filter(s => s.evaluationStatus === 'completed')
                    .map((staff) => (
                      <div key={staff.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{staff.name}</h4>
                            <p className="text-sm text-gray-600">
                              {staff.department} • {staff.experienceLabel}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            詳細確認
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
            </div>
          )}

          {activeTab === 'judgment' && (
            <div className="p-6">
              <IntegratedJudgment />
            </div>
          )}

          {activeTab === 'disclosure' && (
            <div className="p-6">
              <DisclosureManagementV3 />
            </div>
          )}

          {activeTab === 'appeal' && (
            <div className="p-6">
              <AppealReceptionV3 />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}