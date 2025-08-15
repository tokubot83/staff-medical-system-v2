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
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { ExperienceLevelMapper, ExperienceLevelsV3 } from '@/services/evaluationV3Service';
import DashboardHeader from '@/components/evaluation/DashboardHeader';
import IntegratedJudgment from '@/components/evaluation/IntegratedJudgment';
import DisclosureManagement from '@/components/evaluation/DisclosureManagement';
import AppealManagement from '@/components/evaluation/AppealManagement';

export default function EvaluationExecutionPage() {
  const [activeTab, setActiveTab] = useState('input');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedExperienceLevel, setSelectedExperienceLevel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  // モックデータ：評価対象職員
  const staffList = [
    {
      id: '1',
      name: '山田 花子',
      department: '内科病棟',
      jobCategory: '看護師',
      experienceYears: 3,
      experienceLevel: 'young',
      experienceLabel: '若手',
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
      experienceLevel: 'young',
      experienceLabel: '若手',
      evaluationStatus: 'appealed',
      technicalScore: 38,
      contributionScore: 35,
      totalScore: 73,
      grade: 'B',
      appealReason: '技術評価の一部項目について再考を希望'
    }
  ];

  // フィルタリング
  const filteredStaff = staffList.filter(staff => {
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
    total: staffList.length,
    completed: staffList.filter(s => s.evaluationStatus === 'completed' || s.evaluationStatus === 'disclosed').length,
    inProgress: staffList.filter(s => s.evaluationStatus === 'in-progress').length,
    notStarted: staffList.filter(s => s.evaluationStatus === 'not-started').length,
    appealed: staffList.filter(s => s.evaluationStatus === 'appealed').length
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
        {/* 統合ダッシュボードヘッダー */}
        <DashboardHeader
          title="評価統合ダッシュボード"
          description="評価進捗と研修受講状況を一元管理"
          onRefresh={handleRefresh}
        />
        {/* 統計カード */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{statistics.total}</div>
              <div className="text-sm text-gray-600">評価対象者</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{statistics.completed}</div>
              <div className="text-sm text-gray-600">評価完了</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{statistics.inProgress}</div>
              <div className="text-sm text-gray-600">評価中</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-600">{statistics.notStarted}</div>
              <div className="text-sm text-gray-600">未着手</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">{statistics.appealed}</div>
              <div className="text-sm text-gray-600">異議申立</div>
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
            <Card>
              <CardHeader>
                <CardTitle>評価対象者一覧</CardTitle>
                <CardDescription>
                  評価シートへの入力を行います
                </CardDescription>
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
                      <SelectItem value="young">若手（2～3年）</SelectItem>
                      <SelectItem value="midlevel">中堅（4～10年）</SelectItem>
                      <SelectItem value="veteran">ベテラン（11年～）</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 職員リスト */}
                <div className="space-y-2">
                  {filteredStaff.map((staff) => (
                    <div key={staff.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{staff.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span>{staff.department}</span>
                              <span>•</span>
                              <span>{staff.jobCategory}</span>
                              <span>•</span>
                              <Badge variant="outline">{staff.experienceLabel}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            {staff.totalScore !== null && (
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold">{staff.totalScore}</span>
                                <span className="text-sm text-gray-600">/ 100点</span>
                                {getGradeBadge(staff.grade)}
                              </div>
                            )}
                          </div>
                          {getStatusBadge(staff.evaluationStatus)}
                          <div className="flex gap-2">
                            <Link href={`/evaluation-execution/dynamic/${staff.id}`}>
                              <Button 
                                variant="default"
                                size="sm"
                                title="動的評価シート生成"
                              >
                                <Sparkles className="w-4 h-4 mr-2" />
                                動的生成
                              </Button>
                            </Link>
                            <Link href={`/evaluation-execution/input/${staff.id}`}>
                              <Button 
                                variant={staff.evaluationStatus === 'not-started' ? 'outline' : 'outline'}
                                size="sm"
                              >
                                <FileText className="w-4 h-4 mr-2" />
                                {staff.evaluationStatus === 'not-started' ? '評価開始' : '評価編集'}
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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