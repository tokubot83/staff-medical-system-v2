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
  Rocket,
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
import DisclosureManagement from '@/components/evaluation/DisclosureManagement';
import AppealManagement from '@/components/evaluation/AppealManagement';
import EvaluationSheetSelector from '@/components/evaluation/EvaluationSheetSelector';

export default function EvaluationExecutionPage() {
  // 評価実施のワークフローステップ
  const executionSteps = [
    { id: 1, title: '評価入力', status: 'current', icon: ClipboardList },
    { id: 2, title: '評価確認', status: 'upcoming', icon: CheckCircle },
    { id: 3, title: '総合判定', status: 'upcoming', icon: Activity },
    { id: 4, title: '評価開示', status: 'upcoming', icon: Eye },
    { id: 5, title: '異議申立', status: 'upcoming', icon: MessageSquare }
  ];

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
  const [activeTab, setActiveTab] = useState('input');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedExperienceLevel, setSelectedExperienceLevel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [staffData, setStaffData] = useState(staffList);
  const [showWorkflowGuide, setShowWorkflowGuide] = useState(true);
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
        {/* 評価実施ワークフローガイド */}
        {showWorkflowGuide && (
          <Card className="mb-6 border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-lg">評価実施フロー</CardTitle>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowWorkflowGuide(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                {executionSteps.map((step, index) => (
                  <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center flex-1">
                      <div className={`
                        p-3 rounded-full mb-2 transition-all
                        ${step.status === 'completed' ? 'bg-green-100' : ''}
                        ${step.status === 'current' ? 'bg-green-100 ring-4 ring-green-200' : ''}
                        ${step.status === 'upcoming' ? 'bg-gray-100' : ''}
                      `}>
                        <step.icon className={`
                          h-5 w-5
                          ${step.status === 'completed' ? 'text-green-600' : ''}
                          ${step.status === 'current' ? 'text-green-600' : ''}
                          ${step.status === 'upcoming' ? 'text-gray-400' : ''}
                        `} />
                      </div>
                      <span className={`
                        text-sm font-medium
                        ${step.status === 'current' ? 'text-green-600' : 'text-gray-600'}
                      `}>
                        {step.title}
                      </span>
                      {step.status === 'current' && (
                        <Badge className="mt-1 bg-green-100 text-green-700" variant="secondary">進行中</Badge>
                      )}
                    </div>
                    {index < executionSteps.length - 1 && (
                      <ChevronRight className="h-5 w-5 text-gray-400 mb-8" />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <Alert className="border-green-200 bg-green-50">
                <Zap className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>現在のタスク：</strong> {statistics.notStarted}名の職員の評価が未着手です。
                  締切まであと<strong className="text-red-600">7日</strong>です。
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* クイックアクション */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            今すぐ必要なアクション
          </h2>
          <div className="grid grid-cols-5 gap-4">
            <Card className="hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-red-400 bg-gradient-to-br from-red-50 to-red-100">
              <CardContent className="p-4 text-center">
                <div className="mx-auto mb-2 p-2 bg-red-500 rounded-full w-fit">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-red-900 text-sm">未着手者</h3>
                <p className="text-2xl font-bold text-red-600 mt-1">{statistics.notStarted}名</p>
                <Button size="sm" variant="outline" className="mt-2 text-xs">
                  リマインド送信
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-4 text-center">
                <div className="mx-auto mb-2 p-2 bg-blue-500 rounded-full w-fit">
                  <ClipboardList className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-blue-900 text-sm">評価中</h3>
                <p className="text-2xl font-bold text-blue-600 mt-1">{statistics.inProgress}名</p>
                <Button size="sm" variant="outline" className="mt-2 text-xs">
                  進捗確認
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-green-400 bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-4 text-center">
                <div className="mx-auto mb-2 p-2 bg-green-500 rounded-full w-fit">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-green-900 text-sm">完了</h3>
                <p className="text-2xl font-bold text-green-600 mt-1">{statistics.completed}名</p>
                <Button size="sm" variant="outline" className="mt-2 text-xs">
                  結果確認
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-orange-400 bg-gradient-to-br from-orange-50 to-orange-100">
              <CardContent className="p-4 text-center">
                <div className="mx-auto mb-2 p-2 bg-orange-500 rounded-full w-fit">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-orange-900 text-sm">異議申立</h3>
                <p className="text-2xl font-bold text-orange-600 mt-1">{statistics.appealed}名</p>
                <Button size="sm" variant="outline" className="mt-2 text-xs">
                  対応確認
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-purple-400 bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-4 text-center">
                <div className="mx-auto mb-2 p-2 bg-purple-500 rounded-full w-fit">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-purple-900 text-sm">完了率</h3>
                <p className="text-2xl font-bold text-purple-600 mt-1">{completionRate}%</p>
                <Button size="sm" variant="outline" className="mt-2 text-xs">
                  詳細分析
                </Button>
              </CardContent>
            </Card>
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

        <div className={styles.mainTabNavigation}>
          {[
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

        <div className={styles.tabContent}>
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
              <DisclosureManagement />
            </div>
          )}

          {activeTab === 'appeal' && (
            <div className="p-6">
              <AppealManagement />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}