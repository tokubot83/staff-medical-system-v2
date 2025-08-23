'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Trophy, 
  Target, 
  TrendingUp, 
  Calendar,
  BookOpen,
  Award,
  AlertCircle,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { V3PersonalEvaluation } from '@/types/evaluation-v3';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { AppError, ErrorLevel } from '@/lib/error/AppError';
import EvaluationHistory from './EvaluationHistory';
import TrainingStatus from './TrainingStatus';
import NextEvaluationTimeline from './NextEvaluationTimeline';

interface Skill {
  name: string;
  level: number;
}

interface PersonalDashboardProps {
  employeeId?: string;
  employeeName?: string;
  selectedStaff?: any; // 職員カルテから渡されるデータ
}

// V3グレード定義
const v3Grades = {
  'S+': { color: '#8B0000', label: 'S+（超優秀）', min: 95 },
  'S': { color: '#FF0000', label: 'S（卓越）', min: 90 },
  'A+': { color: '#FF4500', label: 'A+（優秀+）', min: 85 },
  'A': { color: '#FFA500', label: 'A（優秀）', min: 80 },
  'B': { color: '#32CD32', label: 'B（良好）', min: 70 },
  'C': { color: '#1E90FF', label: 'C（普通）', min: 60 },
  'D': { color: '#808080', label: 'D（要改善）', min: 0 }
}

// V3評価年間スケジュール
const getEvaluationScheduleInfo = () => {
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  
  const scheduleMap = {
    1: { phase: '年度末評価期間', task: '総合評価・年度総括', status: 'active', nextTask: '評価結果開示（2月）', daysUntil: 30 },
    2: { phase: '評価結果開示', task: '評価結果フィードバック・面談', status: 'active', nextTask: '新年度準備（3月）', daysUntil: 28 },
    3: { phase: '新年度移行期', task: '昇進・昇格発令・新年度準備', status: 'active', nextTask: '前年度フィードバック（4月）', daysUntil: 31 },
    4: { phase: '前年度フィードバック', task: '前年度評価最終フィードバック', status: 'completed', nextTask: '上半期計画策定（5月）', daysUntil: 30 },
    5: { phase: '上半期計画', task: '上半期活動計画策定', status: 'completed', nextTask: '夏季組織貢献評価（6-8月）', daysUntil: 31 },
    6: { phase: '夏季組織貢献評価', task: '夏季組織貢献度評価実施', status: 'active', nextTask: '評価継続中', daysUntil: 30 },
    7: { phase: '夏季組織貢献評価', task: '夏季組織貢献度評価実施', status: 'active', nextTask: '評価継続中', daysUntil: 31 },
    8: { phase: '夏季組織貢献評価', task: '夏季組織貢献度評価実施', status: 'active', nextTask: '下半期準備（9月）', daysUntil: 31 },
    9: { phase: '下半期準備', task: '下半期活動計画策定', status: 'upcoming', nextTask: '技術評価準備（10月）', daysUntil: 30 },
    10: { phase: '技術評価準備', task: '技術評価項目確定・準備', status: 'upcoming', nextTask: '技術評価実施（11月）', daysUntil: 31 },
    11: { phase: '技術評価実施', task: '技術評価（法人統一+施設固有）', status: 'upcoming', nextTask: '冬季組織貢献評価（12-2月）', daysUntil: 30 },
    12: { phase: '冬季組織貢献評価', task: '冬季組織貢献度評価実施', status: 'upcoming', nextTask: '年度末評価（1月）', daysUntil: 31 }
  }
  
  return scheduleMap[currentMonth as keyof typeof scheduleMap] || scheduleMap[1]
}

const PersonalDashboard: React.FC<PersonalDashboardProps> = ({ 
  employeeId = 'E001',
  employeeName = '山田 太郎',
  selectedStaff
}) => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [v3EvaluationData, setV3EvaluationData] = useState<V3PersonalEvaluation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { handleError } = useErrorHandler();

  // V3評価データの取得
  useEffect(() => {
    const loadV3EvaluationData = async () => {
      try {
        setIsLoading(true);
        
        // V3評価データ（モック）
        const mockV3Data: V3PersonalEvaluation = {
          id: `eval_${selectedStaff?.id || employeeId}_2024`,
          staffId: selectedStaff?.id || employeeId,
          staffName: selectedStaff?.name || employeeName,
          evaluationPeriod: '2024年度',
          experienceLevel: 'midlevel',
          experienceLabel: '中堅',
          technicalScore: {
            coreItems: 28,    // 30点満点
            facilityItems: 18, // 20点満点
            total: 46         // 50点満点
          },
          contributionScore: {
            facility: 24,     // 25点満点
            corporate: 22,    // 25点満点
            total: 46        // 50点満点
          },
          totalScore: 92,    // 100点満点
          grade: 'S',
          status: 'completed',
          evaluatedAt: new Date('2024-12-15'),
          disclosedAt: new Date('2025-01-10'),
          feedback: 'V3評価システムにおいて優秀な成果を達成。Sグレードに到達し、次期リーダー候補として期待。'
        };

        setV3EvaluationData(mockV3Data);
      } catch (error) {
        const appError = new AppError(
          'V3_EVALUATION_LOAD_FAILED',
          'V3評価データの取得に失敗しました',
          ErrorLevel.ERROR,
          { staffId: selectedStaff?.id || employeeId, error }
        );
        handleError(appError);
      } finally {
        setIsLoading(false);
      }
    };

    loadV3EvaluationData();
  }, [selectedStaff?.id, employeeId, handleError]);

  // 現在の評価スケジュール情報
  const scheduleInfo = getEvaluationScheduleInfo();

  // 職員カルテデータがある場合はそれを使用、なければV3デフォルト値
  const personalData = selectedStaff ? {
    employeeId: selectedStaff.id || 'OH-NS-2021-001',
    name: selectedStaff.name || employeeName,
    department: selectedStaff.department || '3階病棟',
    position: selectedStaff.position || '看護師',
    facility: selectedStaff.facility || '小原病院',
    joinDate: selectedStaff.joinDate || '2021-04-01',
    age: selectedStaff.age || 29,
    // V3評価データ
    currentGrade: v3EvaluationData?.grade || 'A',
    currentScore: v3EvaluationData?.totalScore || 81.5,
    previousGrade: 'A',
    previousScore: 78.5,
    trend: 'up' as const,
    trendValue: 3.0,
    technicalScore: v3EvaluationData?.technicalScore?.total || 42,
    contributionScore: v3EvaluationData?.contributionScore?.total || 39.5,
    experienceLevel: v3EvaluationData?.experienceLabel || '中堅',
    // V3スケジュール連動
    currentPhase: scheduleInfo.phase,
    currentTask: scheduleInfo.task,
    nextTask: scheduleInfo.nextTask,
    daysUntilNext: scheduleInfo.daysUntil,
    nextEvaluationDate: '2025-11-30',
    daysUntilEvaluation: scheduleInfo.daysUntil,
    // 研修・成長関連
    completedTrainings: 9,
    requiredTrainings: 10,
    rank: 85,
    totalEmployees: 450,
    // 詳細データ
    evaluation: selectedStaff.evaluation || 'A',
    healthScore: selectedStaff.healthScore || 75,
    stressIndex: selectedStaff.stressIndex || 48,
    engagement: selectedStaff.engagement || 82,
    skills: selectedStaff.skills || [
      { name: '看護技術', level: 85 },
      { name: '患者対応', level: 90 },
      { name: 'チーム連携', level: 88 },
      { name: '記録・報告', level: 82 }
    ],
    qualifications: selectedStaff.qualifications || ['看護師免許', 'BLS資格'],
    certifications: selectedStaff.certifications || ['感染対策研修修了', '医療安全研修修了']
  } : {
    // V3システム対応デフォルトデータ
    employeeId: employeeId,
    name: employeeName,
    department: '看護部',
    position: '主任看護師',
    facility: '医療法人',
    joinDate: '2018-04-01',
    age: 32,
    // V3評価データ（デフォルト）
    currentGrade: v3EvaluationData?.grade || 'S',
    currentScore: v3EvaluationData?.totalScore || 92,
    previousGrade: 'A',
    previousScore: 86.5,
    trend: 'up' as const,
    trendValue: 5.5,
    technicalScore: v3EvaluationData?.technicalScore?.total || 46,
    contributionScore: v3EvaluationData?.contributionScore?.total || 46,
    experienceLevel: v3EvaluationData?.experienceLabel || '中堅',
    // V3スケジュール連動
    currentPhase: scheduleInfo.phase,
    currentTask: scheduleInfo.task,
    nextTask: scheduleInfo.nextTask,
    daysUntilNext: scheduleInfo.daysUntil,
    nextEvaluationDate: '2025-11-30',
    daysUntilEvaluation: scheduleInfo.daysUntil,
    // 研修・成長関連
    completedTrainings: 8,
    requiredTrainings: 10,
    rank: 142,
    totalEmployees: 450,
    // 詳細データ
    evaluation: 'S',
    healthScore: 85,
    stressIndex: 35,
    engagement: 92,
    skills: [
      { name: '看護技術', level: 92 },
      { name: '患者対応', level: 95 },
      { name: 'チーム連携', level: 90 },
      { name: '記録・報告', level: 88 }
    ],
    qualifications: ['看護師免許', 'BLS資格', '認定看護師（感染管理）'],
    certifications: ['感染対策研修修了', '医療安全研修修了', 'リーダーシップ研修修了']
  };

  // V3グレードに対応した色設定
  const getGradeColor = (grade: string) => {
    const gradeInfo = v3Grades[grade as keyof typeof v3Grades];
    if (gradeInfo) {
      // V3グレードの色を背景色として使用
      const baseColor = gradeInfo.color;
      if (grade.includes('S')) {
        return 'bg-red-100 text-red-800 border-red-300'; // S+, S
      } else if (grade.includes('A')) {
        return 'bg-orange-100 text-orange-800 border-orange-300'; // A+, A
      } else if (grade === 'B') {
        return 'bg-green-100 text-green-800 border-green-300'; // B
      } else if (grade === 'C') {
        return 'bg-blue-100 text-blue-800 border-blue-300'; // C
      } else if (grade === 'D') {
        return 'bg-gray-100 text-gray-800 border-gray-300'; // D
      }
    }
    return 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const percentile = Math.round((1 - personalData.rank / personalData.totalEmployees) * 100);

  return (
    <div className="p-6 space-y-6">
      {/* 最上部：メインタブナビゲーション */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex space-x-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-blue-600 text-white shadow-lg">
            <span>🏠</span>
            <span>作業ダッシュボード</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100">
            <span>✍️</span>
            <span>評価入力</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100">
            <span>🔍</span>
            <span>評価確認</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100">
            <span>⚖️</span>
            <span>総合判定</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100">
            <span>👁️</span>
            <span>評価開示</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100">
            <span>📢</span>
            <span>異議申立</span>
          </button>
        </div>
        <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg px-4 py-2 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-purple-600">
            <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
            <path d="M20 3v4"></path>
            <path d="M22 5h-4"></path>
            <path d="M4 17v2"></path>
            <path d="M5 18H3"></path>
          </svg>
          <div className="text-sm">
            <div className="font-medium text-purple-900">V3評価システム</div>
            <div className="text-purple-700">技術50点+組織貢献50点</div>
          </div>
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 bg-purple-100 text-purple-800 font-medium">100点満点</div>
        </div>
      </div>

      {/* 評価フェーズ情報と今月のタスク */}
      <div className="space-y-6 p-6">
        <div className="rounded-xl text-card-foreground border-4 border-blue-600 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 shadow-2xl ring-4 ring-opacity-30">
          <div className="flex flex-col space-y-1.5 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-full shadow-lg animate-pulse bg-gradient-to-br from-green-600 to-emerald-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-white drop-shadow-lg">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <path d="M16 3.128a4 4 0 0 1 0 7.744"></path>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                  </svg>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-blue-600">
                  <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                  <path d="m9 11 3 3L22 4"></path>
                </svg>
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2">
                    <path d="M12 3v12"></path>
                    <path d="m17 8-5-5-5 5"></path>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  </svg>
                  Excelデータ取込
                </button>
                <a href="/evaluation-design">
                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 py-2 px-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                      <path d="M8 2v4"></path>
                      <path d="M16 2v4"></path>
                      <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                      <path d="M3 10h18"></path>
                    </svg>
                    年間スケジュール
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-card text-card-foreground shadow border-2 border-purple-200">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="font-semibold leading-none tracking-tight flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-purple-600">
                <path d="M8 2v4"></path>
                <path d="M16 2v4"></path>
                <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                <path d="M3 10h18"></path>
              </svg>
              今後の評価予定
            </h3>
            <p className="text-sm text-muted-foreground">次の評価業務の準備と計画</p>
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-200 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-purple-700">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <path d="M16 3.128a4 4 0 0 1 0 7.744"></path>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                    </svg>
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

      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{personalData.name}</h1>
              <p className="text-blue-100">{personalData.facility} / {personalData.department} / {personalData.position}</p>
              <p className="text-sm text-blue-200 mt-1">
                ID: {personalData.employeeId} | 入職: {personalData.joinDate} | 年齢: {personalData.age}歳
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-200">現在の評価グレード</p>
            <div className={`inline-block px-4 py-2 rounded-lg text-2xl font-bold mt-1 ${getGradeColor(personalData.currentGrade)}`}>
              {personalData.currentGrade}
            </div>
          </div>
        </div>
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                総合評価点
              </CardTitle>
              <Trophy className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{personalData.currentScore}点</div>
            <p className={`text-xs mt-1 ${personalData.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              前期比 {personalData.trend === 'up' ? '+' : ''}{personalData.trendValue}点
            </p>
            <div className="mt-2 text-xs text-gray-500">
              技術: {personalData.technicalScore}点 / 貢献: {personalData.contributionScore}点
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                社内順位
              </CardTitle>
              <Award className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{personalData.rank}位</div>
            <p className="text-xs text-gray-500 mt-1">
              全{personalData.totalEmployees}名中
            </p>
            <div className="mt-2">
              <Badge variant="outline">上位{100 - percentile}%</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                研修進捗
              </CardTitle>
              <BookOpen className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {personalData.completedTrainings}/{personalData.requiredTrainings}
            </div>
            <p className="text-xs text-gray-500 mt-1">必須研修完了</p>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(personalData.completedTrainings / personalData.requiredTrainings) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                評価スケジュール
              </CardTitle>
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-blue-600 mb-1">{personalData.currentPhase}</div>
            <p className="text-sm text-gray-700 mb-2">{personalData.currentTask}</p>
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
              <Clock className="h-3 w-3" />
              <span>次: {personalData.nextTask}</span>
            </div>
            <Button size="sm" variant="outline" className="w-full">
              {scheduleInfo.status === 'active' ? '実行中' : scheduleInfo.status === 'completed' ? '完了済み' : '準備中'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* V3スケジュール連動アラート */}
      {scheduleInfo.status === 'active' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-900">
              {personalData.currentPhase}が実行中です
            </span>
            <Badge variant="secondary" className="ml-auto">
              {personalData.daysUntilNext}日後に次フェーズ
            </Badge>
          </div>
          <p className="text-sm text-blue-700 mt-2">
            現在のタスク: {personalData.currentTask}
          </p>
        </div>
      )}
      
      {/* 研修アラート */}
      {personalData.completedTrainings < personalData.requiredTrainings && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <span className="font-medium text-amber-900">
              未完了の必須研修があります
            </span>
            <Badge variant="secondary" className="ml-auto">
              残り{personalData.requiredTrainings - personalData.completedTrainings}件
            </Badge>
          </div>
          <p className="text-sm text-amber-700 mt-2">
            次回評価までに全ての必須研修を完了してください。
          </p>
        </div>
      )}

      {/* メインコンテンツ */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="history">評価履歴</TabsTrigger>
          <TabsTrigger value="training">研修状況</TabsTrigger>
          <TabsTrigger value="timeline">スケジュール</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="space-y-6">
            {/* 評価とスキル */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>評価サマリー</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">技術評価</span>
                        <span className="text-sm font-bold">{personalData.technicalScore}/50点</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(personalData.technicalScore / 50) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">組織貢献度</span>
                        <span className="text-sm font-bold">{personalData.contributionScore}/50点</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${(personalData.contributionScore / 50) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>スキル・専門性</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {personalData.skills.map((skill: Skill, index: number) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{skill.name}</span>
                          <span className="text-sm text-gray-600">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 資格と評価コメント */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>資格・研修</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">保有資格</h4>
                      <div className="flex flex-wrap gap-2">
                        {personalData.qualifications.map((qual: string, index: number) => (
                          <Badge key={index} variant="outline" className="bg-blue-50">
                            {qual}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">修了研修</h4>
                      <div className="flex flex-wrap gap-2">
                        {personalData.certifications.map((cert: string, index: number) => (
                          <Badge key={index} variant="outline" className="bg-green-50">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>最近の評価コメント</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {v3EvaluationData?.feedback ? (
                      <div className="border-l-4 border-green-500 pl-4">
                        <p className="text-sm text-gray-600 mb-1">V3評価システム - 最新評価</p>
                        <p className="text-sm">
                          {v3EvaluationData.feedback}
                        </p>
                      </div>
                    ) : (
                      <div className="border-l-4 border-blue-500 pl-4">
                        <p className="text-sm text-gray-600 mb-1">2024年度評価</p>
                        <p className="text-sm">
                          V3評価システムに移行し、技術評価と組織貢献度の両面で優秀な成果を達成。
                        </p>
                      </div>
                    )}
                    <div className="border-l-4 border-purple-500 pl-4">
                      <p className="text-sm text-gray-600 mb-1">現在の評価フェーズ</p>
                      <p className="text-sm">
                        {personalData.currentPhase}: {personalData.currentTask}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        次回: {personalData.nextTask}（{personalData.daysUntilNext}日後）
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 今期の目標 */}
            <Card>
              <CardHeader>
                <CardTitle>今期の目標・アクションプラン</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <Target className="h-5 w-5 text-blue-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium">専門スキル向上</p>
                      <p className="text-xs text-gray-600 mt-1">認定看護師資格取得に向けた学習</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <Target className="h-5 w-5 text-green-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium">チーム貢献</p>
                      <p className="text-xs text-gray-600 mt-1">新人教育プログラムのリーダー</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                    <Target className="h-5 w-5 text-purple-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium">業務改善</p>
                      <p className="text-xs text-gray-600 mt-1">看護記録システムの効率化提案</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <EvaluationHistory employeeId={personalData.employeeId} />
        </TabsContent>

        <TabsContent value="training" className="mt-6">
          <TrainingStatus employeeId={personalData.employeeId} />
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <NextEvaluationTimeline employeeId={personalData.employeeId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PersonalDashboard;