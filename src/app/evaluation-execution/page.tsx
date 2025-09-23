'use client';

import React, { useState } from 'react';
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
import EvaluationSheetSelector from '@/components/evaluation/EvaluationSheetSelector';
import AppealReceptionV3 from '@/components/evaluation/AppealReceptionV3';
import DisclosureManagementV3 from '@/components/evaluation/DisclosureManagementV3';
import FacilityProgressCard from '@/components/evaluation/FacilityProgressCard';

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

interface FacilityProgress {
  facilityId: string;
  facilityName: string;
  totalStaff: number;
  status: 'active' | 'planned' | 'inactive';
  summerFollowup: {
    appealsReceived: number;
    appealsProcessed: number;
    appealsResolved: number;
    voiceDriveNotified: number;
  };
  winterDisclosure: {
    evaluationsCompleted: number;
    disclosuresScheduled: number;
    disclosuresCompleted: number;
    feedbackMeetingsScheduled: number;
    feedbackMeetingsCompleted: number;
  };
  finalEvaluation: {
    technicalEvaluationsCompleted: number;
    disclosuresCompleted: number;
    finalAppealsReceived: number;
    finalAppealsResolved: number;
    yearEndProcessCompleted: boolean;
  };
}

// 評価制度バージョンの型定義
interface SystemVersion {
  id: string;
  version: string;
  name: string;
  status: 'active' | 'preparing' | 'testing';
  description: string;
}

// 利用可能なバージョン
const availableVersions: SystemVersion[] = [
  {
    id: 'v1',
    version: '1.0.0',
    name: '2024年度評価制度（現行）',
    status: 'active',
    description: '技術評価50点・組織貢献50点の2軸マトリックス評価'
  },
  {
    id: 'v2',
    version: '2.0.0-beta',
    name: '2025年度評価制度（準備中）',
    status: 'preparing',
    description: 'コンピテンシー評価と360度評価を統合予定'
  }
];

export default function EvaluationExecutionPage() {
  const [currentDate] = useState(new Date());
  const [selectedVersion, setSelectedVersion] = useState<SystemVersion>(
    availableVersions.find(v => v.status === 'active') || availableVersions[0]
  );
  const currentMonth = currentDate.getMonth() + 1; // 1-12

  // 施設別進捗データ
  const facilityProgressData: FacilityProgress[] = [
    {
      facilityId: 'kohara',
      facilityName: '小原病院',
      totalStaff: 120,
      status: 'active',
      summerFollowup: {
        appealsReceived: 3,
        appealsProcessed: 2,
        appealsResolved: 1,
        voiceDriveNotified: 3
      },
      winterDisclosure: {
        evaluationsCompleted: 115,
        disclosuresScheduled: 120,
        disclosuresCompleted: 108,
        feedbackMeetingsScheduled: 25,
        feedbackMeetingsCompleted: 18
      },
      finalEvaluation: {
        technicalEvaluationsCompleted: 120,
        disclosuresCompleted: 120,
        finalAppealsReceived: 2,
        finalAppealsResolved: 1,
        yearEndProcessCompleted: currentMonth > 3
      }
    },
    {
      facilityId: 'tategami',
      facilityName: '立神リハビリテーション温泉病院',
      totalStaff: 85,
      status: 'active',
      summerFollowup: {
        appealsReceived: 1,
        appealsProcessed: 1,
        appealsResolved: 1,
        voiceDriveNotified: 1
      },
      winterDisclosure: {
        evaluationsCompleted: 82,
        disclosuresScheduled: 85,
        disclosuresCompleted: 80,
        feedbackMeetingsScheduled: 15,
        feedbackMeetingsCompleted: 12
      },
      finalEvaluation: {
        technicalEvaluationsCompleted: 85,
        disclosuresCompleted: 85,
        finalAppealsReceived: 0,
        finalAppealsResolved: 0,
        yearEndProcessCompleted: currentMonth > 3
      }
    },
    {
      facilityId: 'espoir',
      facilityName: 'エスポワール立神',
      totalStaff: 65,
      status: 'active',
      summerFollowup: {
        appealsReceived: 0,
        appealsProcessed: 0,
        appealsResolved: 0,
        voiceDriveNotified: 0
      },
      winterDisclosure: {
        evaluationsCompleted: 63,
        disclosuresScheduled: 65,
        disclosuresCompleted: 58,
        feedbackMeetingsScheduled: 12,
        feedbackMeetingsCompleted: 8
      },
      finalEvaluation: {
        technicalEvaluationsCompleted: 65,
        disclosuresCompleted: 62,
        finalAppealsReceived: 1,
        finalAppealsResolved: 0,
        yearEndProcessCompleted: currentMonth > 3
      }
    },
    {
      facilityId: 'hojuan',
      facilityName: '宝寿庵',
      totalStaff: 45,
      status: 'planned',
      summerFollowup: {
        appealsReceived: 0,
        appealsProcessed: 0,
        appealsResolved: 0,
        voiceDriveNotified: 0
      },
      winterDisclosure: {
        evaluationsCompleted: 0,
        disclosuresScheduled: 0,
        disclosuresCompleted: 0,
        feedbackMeetingsScheduled: 0,
        feedbackMeetingsCompleted: 0
      },
      finalEvaluation: {
        technicalEvaluationsCompleted: 0,
        disclosuresCompleted: 0,
        finalAppealsReceived: 0,
        finalAppealsResolved: 0,
        yearEndProcessCompleted: false
      }
    }
  ];

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

  // 法人全体の施設別統計
  const corporateStatistics = {
    totalFacilities: facilityProgressData.filter(f => f.status === 'active').length,
    totalStaff: facilityProgressData.reduce((sum, f) => sum + f.totalStaff, 0),
    plannedFacilities: facilityProgressData.filter(f => f.status === 'planned').length,
    summerAppeals: facilityProgressData.reduce((sum, f) => sum + f.summerFollowup.appealsReceived, 0),
    winterDisclosures: facilityProgressData.reduce((sum, f) => sum + f.winterDisclosure.disclosuresCompleted, 0),
    finalCompletion: facilityProgressData.filter(f => f.status === 'active' && f.finalEvaluation.yearEndProcessCompleted).length
  };

  const completionRate = Math.round((statistics.completed / statistics.total) * 100);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div>
      <div className={styles.container}>
        {/* バージョン選択UI */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Label htmlFor="version-select" className="text-sm font-medium">評価制度バージョン:</Label>
            <Select
              value={selectedVersion.id}
              onValueChange={(value) => {
                const version = availableVersions.find(v => v.id === value);
                if (version) setSelectedVersion(version);
              }}
            >
              <SelectTrigger id="version-select" className="w-[300px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableVersions.map(version => (
                  <SelectItem key={version.id} value={version.id}>
                    <div className="flex items-center gap-2">
                      {version.status === 'active' && <Badge className="bg-green-100 text-green-800">運用中</Badge>}
                      {version.status === 'preparing' && <Badge className="bg-blue-100 text-blue-800">準備中</Badge>}
                      {version.status === 'testing' && <Badge className="bg-yellow-100 text-yellow-800">テスト中</Badge>}
                      <span>{version.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 現在のバージョン情報 */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg px-4 py-2 shadow-sm">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <div className="text-sm">
              <div className="font-medium text-purple-900">{selectedVersion.name}</div>
              <div className="text-purple-700">{selectedVersion.description}</div>
            </div>
            <Badge className="bg-purple-100 text-purple-800 font-medium">v{selectedVersion.version}</Badge>
          </div>
        </div>

        {/* V2が選択された場合は準備中メッセージを表示 */}
        {selectedVersion.id === 'v2' ? (
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                2025年度評価制度（準備中）
              </CardTitle>
              <CardDescription>
                次期評価制度は現在準備中です。以下の新機能を実装予定です。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>新機能実装予定</AlertTitle>
                  <AlertDescription>
                    <ul className="mt-2 space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>コンピテンシー評価（30点）の追加</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>360度評価の導入</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>人事評価会議での最終決定プロセス</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>AI支援による評価補助機能</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>評価段階を7段階から9段階へ拡張</span>
                      </li>
                    </ul>
                  </AlertDescription>
                </Alert>

                <div className="p-4 bg-white rounded-lg">
                  <h4 className="font-semibold mb-2">移行スケジュール</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>2025年1月〜3月: リハビリテーション科でテスト運用</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>2025年4月: 全施設で本格運用開始</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  評価制度マスターで詳細を確認
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* V1（現行）の評価システム表示 */
          <>

        <div className={styles.tabContent}>
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
              
              {/* 法人全体サマリー */}
              <Card className="border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-indigo-600" />
                    法人全体 施設別進捗サマリー
                  </CardTitle>
                  <CardDescription>
                    全{corporateStatistics.totalFacilities}施設・総{corporateStatistics.totalStaff}名の評価進捗状況
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg border">
                      <div className="text-2xl font-bold text-indigo-600">{corporateStatistics.totalFacilities}</div>
                      <div className="text-sm text-gray-600">運営施設</div>
                      {corporateStatistics.plannedFacilities > 0 && (
                        <div className="text-xs text-purple-600 mt-1">+{corporateStatistics.plannedFacilities}施設準備中</div>
                      )}
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border">
                      <div className="text-2xl font-bold text-green-600">{corporateStatistics.totalStaff}</div>
                      <div className="text-sm text-gray-600">総職員数</div>
                      <div className="text-xs text-gray-500 mt-1">評価対象者</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border">
                      <div className="text-2xl font-bold text-orange-600">{corporateStatistics.summerAppeals}</div>
                      <div className="text-sm text-gray-600">夏季異議申立</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {corporateStatistics.totalStaff > 0 ? 
                          `${((corporateStatistics.summerAppeals / corporateStatistics.totalStaff) * 100).toFixed(1)}%` 
                          : '0%'}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border">
                      <div className="text-2xl font-bold text-blue-600">{corporateStatistics.winterDisclosures}</div>
                      <div className="text-sm text-gray-600">冬季開示完了</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {corporateStatistics.totalStaff > 0 ? 
                          `${((corporateStatistics.winterDisclosures / corporateStatistics.totalStaff) * 100).toFixed(1)}%` 
                          : '0%'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    {facilityProgressData.map((facility) => (
                      <Badge 
                        key={facility.facilityId} 
                        variant={facility.status === 'active' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {facility.facilityName} ({facility.totalStaff}名)
                        {facility.status === 'planned' && ' 🚧'}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* 時期別の統合機能表示 */}
              {currentMonth === 8 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2">
                      <Card className="border-2 border-orange-200 bg-orange-50/50">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-orange-600" />
                            8月: 夏季評価フォローアップ - 異議申立受付
                          </CardTitle>
                          <CardDescription>
                            夏季組織貢献度評価（25点）の結果に対する異議申立を受け付けています
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <AppealReceptionV3 />
                        </CardContent>
                      </Card>
                    </div>
                    <div>
                      <FacilityProgressCard type="summer" facilityProgressData={facilityProgressData} />
                    </div>
                  </div>
                </div>
              )}
              
              {currentMonth === 12 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2">
                      <Card className="border-2 border-blue-200 bg-blue-50/50">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Eye className="h-5 w-5 text-blue-600" />
                            12月: 冬季貢献度評価 - 評価開示管理
                          </CardTitle>
                          <CardDescription>
                            冬季組織貢献度評価（25点）の結果開示と面談管理
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <DisclosureManagementV3 />
                        </CardContent>
                      </Card>
                    </div>
                    <div>
                      <FacilityProgressCard type="winter" facilityProgressData={facilityProgressData} />
                    </div>
                  </div>
                </div>
              )}
              
              {currentMonth === 3 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 space-y-6">
                      <Card className="border-2 border-purple-200 bg-purple-50/50">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Eye className="h-5 w-5 text-purple-600" />
                            3月: 最終技術評価 - 評価開示管理
                          </CardTitle>
                          <CardDescription>
                            年間技術評価（50点）の結果開示と面談管理
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <DisclosureManagementV3 />
                        </CardContent>
                      </Card>
                      
                      <Card className="border-2 border-red-200 bg-red-50/50">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-red-600" />
                            3月: 最終評価 - 異議申立受付
                          </CardTitle>
                          <CardDescription>
                            年間総合評価（100点）に対する最終異議申立を受け付けています
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <AppealReceptionV3 />
                        </CardContent>
                      </Card>
                    </div>
                    <div>
                      <FacilityProgressCard type="final" facilityProgressData={facilityProgressData} />
                    </div>
                  </div>
                </div>
              )}

              {/* 職員一覧 */}
              <Card className="border-2 border-blue-200">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <ClipboardList className="h-5 w-5 text-blue-600" />
                        評価対象者一覧
                      </CardTitle>
                      <CardDescription>
                        時期に応じた評価・フォローアップを実施します
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
            </div>
          </div>
        </div>
      </>
        )}
      </div>
    </div>
  );
}