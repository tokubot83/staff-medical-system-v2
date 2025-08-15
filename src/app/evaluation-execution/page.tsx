'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { ExperienceLevelMapper, ExperienceLevelsV3 } from '@/services/evaluationV3Service';

export default function EvaluationExecutionPage() {
  const [activeTab, setActiveTab] = useState('input');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedExperienceLevel, setSelectedExperienceLevel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  ダッシュボードに戻る
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <User className="w-7 h-7 text-purple-600" />
                  個人評価管理
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  職員の評価を実施・管理します
                </p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              2025年度 評価期間
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
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

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 w-full max-w-3xl">
            <TabsTrigger value="input">評価入力</TabsTrigger>
            <TabsTrigger value="review">評価確認</TabsTrigger>
            <TabsTrigger value="judgment">総合判定</TabsTrigger>
            <TabsTrigger value="disclosure">評価開示</TabsTrigger>
            <TabsTrigger value="appeal">異議申立</TabsTrigger>
          </TabsList>

          {/* 評価入力タブ */}
          <TabsContent value="input" className="space-y-6 mt-6">
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
                          <Link href={`/evaluation-execution/input/${staff.id}`}>
                            <Button 
                              variant={staff.evaluationStatus === 'not-started' ? 'default' : 'outline'}
                              size="sm"
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              {staff.evaluationStatus === 'not-started' ? '評価開始' : '評価編集'}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 評価確認タブ */}
          <TabsContent value="review" className="space-y-6 mt-6">
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
          </TabsContent>

          {/* 総合判定タブ */}
          <TabsContent value="judgment" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>総合判定</CardTitle>
                <CardDescription>
                  100点満点の自動計算とグレード判定
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">S（90点以上）</div>
                      <div className="text-2xl font-bold text-red-600">
                        {staffList.filter(s => s.grade === 'S').length}名
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">A（80-89点）</div>
                      <div className="text-2xl font-bold text-orange-600">
                        {staffList.filter(s => s.grade === 'A').length}名
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">B（70-79点）</div>
                      <div className="text-2xl font-bold text-green-600">
                        {staffList.filter(s => s.grade === 'B').length}名
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">C（60-69点）</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {staffList.filter(s => s.grade === 'C').length}名
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">D（60点未満）</div>
                      <div className="text-2xl font-bold text-gray-600">
                        {staffList.filter(s => s.grade === 'D').length}名
                      </div>
                    </div>
                  </div>

                  <Button className="w-full" size="lg">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    総合判定を確定する
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 評価開示タブ */}
          <TabsContent value="disclosure" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>評価開示</CardTitle>
                <CardDescription>
                  評価結果の本人への開示とフィードバック
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredStaff
                    .filter(s => s.evaluationStatus === 'completed' || s.evaluationStatus === 'disclosed')
                    .map((staff) => (
                      <div key={staff.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{staff.name}</h4>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-sm text-gray-600">
                                総合: {staff.totalScore}点
                              </span>
                              {getGradeBadge(staff.grade)}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <FileText className="w-4 h-4 mr-2" />
                              評価シート出力
                            </Button>
                            <Button 
                              variant={staff.evaluationStatus === 'disclosed' ? 'outline' : 'default'}
                              size="sm"
                            >
                              <MessageSquare className="w-4 h-4 mr-2" />
                              {staff.evaluationStatus === 'disclosed' ? 'フィードバック記録' : '開示実施'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 異議申立タブ */}
          <TabsContent value="appeal" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>異議申立管理</CardTitle>
                <CardDescription>
                  評価に対する異議申立の受付と対応
                </CardDescription>
              </CardHeader>
              <CardContent>
                {statistics.appealed > 0 ? (
                  <div className="space-y-4">
                    {filteredStaff
                      .filter(s => s.evaluationStatus === 'appealed')
                      .map((staff) => (
                        <div key={staff.id} className="border border-orange-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-orange-600" />
                                {staff.name}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                申立理由: {staff.appealReason}
                              </p>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-sm text-gray-600">
                                  現在の評価: {staff.totalScore}点（{staff.grade}）
                                </span>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              詳細確認
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      現在、異議申立はありません
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}