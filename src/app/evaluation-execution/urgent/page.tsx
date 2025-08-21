'use client';

import React, { useState, useEffect } from 'react';
import CommonHeader from '@/components/CommonHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
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
  CheckCircle,
  Eye,
  MessageSquare,
  AlertTriangle,
  Search,
  Clock,
  Zap,
  AlertCircle,
  ClipboardList,
  PlayCircle,
  Edit3,
  Sparkles,
  RefreshCw,
  Activity,
  Timer,
  Flame,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import EvaluationSheetSelector from '@/components/evaluation/EvaluationSheetSelector';

export default function UrgentEvaluationPage() {
  // モックデータ：緊急対応が必要な職員のみ
  const urgentStaffList = [
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
      urgencyLevel: 'critical',
      daysRemaining: 2,
      technicalScore: null,
      contributionScore: null,
      totalScore: null,
      grade: null,
      lastReminder: '2025-08-19',
      reason: '病棟主任候補のため早急な評価完了が必要'
    },
    {
      id: '6',
      name: '中村 健太',
      department: '外科病棟',
      jobCategory: '看護師',
      experienceYears: 5,
      experienceLevel: 'midlevel',
      experienceLabel: '中堅',
      facilityType: 'acute',
      evaluationStatus: 'in-progress',
      urgencyLevel: 'high',
      daysRemaining: 3,
      technicalScore: 28,
      contributionScore: null,
      totalScore: null,
      grade: null,
      lastReminder: '2025-08-18',
      reason: '異動予定があり締切前の完了が必須'
    },
    {
      id: '7',
      name: '吉田 彩香',
      department: '内科病棟',
      jobCategory: '看護師',
      experienceYears: 1,
      experienceLevel: 'new',
      experienceLabel: '新人',
      facilityType: 'acute',
      evaluationStatus: 'not-started',
      urgencyLevel: 'high',
      daysRemaining: 4,
      technicalScore: null,
      contributionScore: null,
      totalScore: null,
      grade: null,
      lastReminder: '2025-08-17',
      reason: '試用期間終了判定のため評価完了が必要'
    },
    {
      id: '8',
      name: '松本 裕子',
      department: 'ICU',
      jobCategory: '看護師',
      experienceYears: 12,
      experienceLevel: 'veteran',
      experienceLabel: 'ベテラン',
      facilityType: 'acute',
      evaluationStatus: 'in-progress',
      urgencyLevel: 'medium',
      daysRemaining: 5,
      technicalScore: 35,
      contributionScore: 28,
      totalScore: null,
      grade: null,
      lastReminder: '2025-08-16',
      reason: '昇進審査の参考資料として必要'
    }
  ];

  // State定義
  const [staffData, setStaffData] = useState(urgentStaffList);
  const [selectedStaffForEvaluation, setSelectedStaffForEvaluation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUrgency, setSelectedUrgency] = useState('all');
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  // リアルタイム時計の更新
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // フィルタリング
  const filteredStaff = staffData.filter(staff => {
    if (selectedUrgency !== 'all' && staff.urgencyLevel !== selectedUrgency) return false;
    if (searchQuery && !staff.name.includes(searchQuery)) return false;
    return true;
  });

  const getUrgencyBadge = (urgency: string, daysRemaining: number) => {
    switch (urgency) {
      case 'critical':
        return <Badge className="bg-red-100 text-red-800 animate-pulse">🔥 緊急 ({daysRemaining}日)</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800">⚡ 高 ({daysRemaining}日)</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">⏰ 中 ({daysRemaining}日)</Badge>;
      default:
        return <Badge>-</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">評価完了</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800">評価中</Badge>;
      case 'not-started':
        return <Badge className="bg-gray-100 text-gray-800">未着手</Badge>;
      default:
        return <Badge>-</Badge>;
    }
  };

  // 統計情報
  const statistics = {
    total: staffData.length,
    critical: staffData.filter(s => s.urgencyLevel === 'critical').length,
    high: staffData.filter(s => s.urgencyLevel === 'high').length,
    medium: staffData.filter(s => s.urgencyLevel === 'medium').length,
    notStarted: staffData.filter(s => s.evaluationStatus === 'not-started').length,
    inProgress: staffData.filter(s => s.evaluationStatus === 'in-progress').length,
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleSendReminder = (staffId: string) => {
    // リマインダー送信処理
    const updatedStaff = staffData.map(staff => 
      staff.id === staffId 
        ? { ...staff, lastReminder: currentTime.toISOString().split('T')[0] }
        : staff
    );
    setStaffData(updatedStaff);
    alert('リマインダーを送信しました');
  };

  const handleBulkReminder = () => {
    // 一括リマインダー送信
    const today = currentTime.toISOString().split('T')[0];
    const updatedStaff = staffData.map(staff => ({
      ...staff,
      lastReminder: today
    }));
    setStaffData(updatedStaff);
    alert(`${statistics.total}名にリマインダーを送信しました`);
  };

  return (
    <div>
      <CommonHeader title="緊急評価対応" />
      <div className="container mx-auto p-6">
        {/* 緊急対応ヘッダー */}
        <Card className="mb-6 border-2 border-red-200 bg-gradient-to-r from-red-50 to-orange-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <Flame className="h-6 w-6 text-red-600 animate-pulse" />
                </div>
                <div>
                  <CardTitle className="text-xl text-red-900 flex items-center gap-2">
                    緊急評価対応センター
                    <Badge className="bg-red-500 text-white animate-bounce">URGENT</Badge>
                  </CardTitle>
                  <CardDescription className="text-red-700">
                    締切が近い・優先度の高い評価を集約管理
                  </CardDescription>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-red-800">
                  {currentTime.toLocaleTimeString('ja-JP')}
                </div>
                <div className="text-sm text-red-600">
                  {currentTime.toLocaleDateString('ja-JP')}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Alert className="border-red-300 bg-red-100">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>緊急対応が必要：</strong> {statistics.critical}名が48時間以内の対応を要求、
                {statistics.high}名が高優先度です。
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* クイック統計 */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="border-2 border-red-300">
            <CardContent className="p-4 text-center">
              <div className="mx-auto mb-2 p-2 bg-red-500 rounded-full w-fit">
                <Flame className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-bold text-red-900 text-sm">緊急</h3>
              <p className="text-2xl font-bold text-red-600">{statistics.critical}名</p>
              <p className="text-xs text-red-700">48時間以内</p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-orange-300">
            <CardContent className="p-4 text-center">
              <div className="mx-auto mb-2 p-2 bg-orange-500 rounded-full w-fit">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-bold text-orange-900 text-sm">高優先度</h3>
              <p className="text-2xl font-bold text-orange-600">{statistics.high}名</p>
              <p className="text-xs text-orange-700">1週間以内</p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-yellow-300">
            <CardContent className="p-4 text-center">
              <div className="mx-auto mb-2 p-2 bg-yellow-500 rounded-full w-fit">
                <Timer className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-bold text-yellow-900 text-sm">中優先度</h3>
              <p className="text-2xl font-bold text-yellow-600">{statistics.medium}名</p>
              <p className="text-xs text-yellow-700">2週間以内</p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-gray-300">
            <CardContent className="p-4 text-center">
              <div className="mx-auto mb-2 p-2 bg-gray-500 rounded-full w-fit">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm">未着手</h3>
              <p className="text-2xl font-bold text-gray-600">{statistics.notStarted}名</p>
              <p className="text-xs text-gray-700">要即時対応</p>
            </CardContent>
          </Card>
        </div>

        {/* 一括操作パネル */}
        <Card className="mb-6 border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-blue-600" />
              一括操作
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button 
                onClick={handleBulkReminder}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                全員にリマインダー送信
              </Button>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                一括スケジュール調整
              </Button>
              <Button variant="outline" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                データ更新
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 緊急対応職員リスト */}
        {selectedStaffForEvaluation ? (
          <div>
            <div className="mb-4 flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setSelectedStaffForEvaluation(null)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                緊急リストに戻る
              </Button>
              <div className="text-lg font-semibold">
                {staffData.find(s => s.id === selectedStaffForEvaluation)?.name} の緊急評価
              </div>
            </div>
            
            <EvaluationSheetSelector
              staff={staffData.find(s => s.id === selectedStaffForEvaluation)!}
              onEvaluationSubmit={async (evaluationData) => {
                console.log('緊急評価データ受信:', evaluationData);
                
                try {
                  const contributionScore = Math.round(Math.random() * 50);
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
                  
                  setStaffData(updatedStaff);
                  
                  alert(`🎉 緊急評価が完了しました！\n技術評価: ${evaluationData.technicalTotal}点\n完了日時: ${currentTime.toLocaleString('ja-JP')}`);
                  
                  setSelectedStaffForEvaluation(null);
                  handleRefresh();
                  
                } catch (error) {
                  console.error('緊急評価提出エラー:', error);
                  alert('評価の提出中にエラーが発生しました。もう一度お試しください。');
                }
              }}
              mode="input"
            />
          </div>
        ) : (
          <Card className="border-2 border-orange-200">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    緊急対応リスト
                  </CardTitle>
                  <CardDescription>
                    優先度順に表示しています - 緊急度の高い順から処理してください
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Link href="/evaluation-execution">通常評価に戻る</Link>
                  </Button>
                </div>
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
                <Select value={selectedUrgency} onValueChange={setSelectedUrgency}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="緊急度で絞り込み" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全緊急度</SelectItem>
                    <SelectItem value="critical">🔥 緊急</SelectItem>
                    <SelectItem value="high">⚡ 高</SelectItem>
                    <SelectItem value="medium">⏰ 中</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 職員リスト - 緊急度順 */}
              <div className="space-y-3">
                {filteredStaff
                  .sort((a, b) => {
                    const urgencyOrder = { critical: 0, high: 1, medium: 2 };
                    return urgencyOrder[a.urgencyLevel as keyof typeof urgencyOrder] - 
                           urgencyOrder[b.urgencyLevel as keyof typeof urgencyOrder] ||
                           a.daysRemaining - b.daysRemaining;
                  })
                  .map((staff) => {
                    const isCritical = staff.urgencyLevel === 'critical';
                    const isHigh = staff.urgencyLevel === 'high';
                    const isNotStarted = staff.evaluationStatus === 'not-started';
                    const isInProgress = staff.evaluationStatus === 'in-progress';
                    
                    return (
                      <div 
                        key={staff.id} 
                        className={`border-2 rounded-lg p-4 transition-all
                          ${isCritical ? 'border-red-300 bg-red-50 shadow-lg animate-pulse' : ''}
                          ${isHigh ? 'border-orange-300 bg-orange-50' : ''}
                          ${!isCritical && !isHigh ? 'border-yellow-300 bg-yellow-50' : ''}
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center
                              ${isCritical ? 'bg-red-200 ring-2 ring-red-400' : ''}
                              ${isHigh ? 'bg-orange-200' : ''}
                              ${!isCritical && !isHigh ? 'bg-yellow-200' : ''}
                            `}>
                              <User className={`w-7 h-7
                                ${isCritical ? 'text-red-700' : ''}
                                ${isHigh ? 'text-orange-700' : ''}
                                ${!isCritical && !isHigh ? 'text-yellow-700' : ''}
                              `} />
                            </div>
                            <div>
                              <h4 className="font-bold text-lg flex items-center gap-2">
                                {staff.name}
                                {isCritical && <Flame className="w-4 h-4 text-red-600" />}
                              </h4>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Badge variant="outline" className="text-xs">{staff.department}</Badge>
                                <Badge variant="outline" className="text-xs">{staff.jobCategory}</Badge>
                                <Badge className="bg-purple-100 text-purple-800 text-xs">{staff.experienceLabel}</Badge>
                              </div>
                              <div className="mt-1 text-sm text-gray-700">
                                <strong>理由：</strong> {staff.reason}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="mb-2">
                                {getUrgencyBadge(staff.urgencyLevel, staff.daysRemaining)}
                              </div>
                              <div className="mb-2">
                                {getStatusBadge(staff.evaluationStatus)}
                              </div>
                              <div className="text-xs text-gray-600">
                                最終催促: {staff.lastReminder}
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Button 
                                variant={isCritical ? 'destructive' : isHigh ? 'default' : 'outline'}
                                size="sm"
                                className={
                                  isCritical ? 'animate-pulse' :
                                  isHigh ? 'bg-orange-600 hover:bg-orange-700' : ''
                                }
                                onClick={() => setSelectedStaffForEvaluation(staff.id)}
                              >
                                {isNotStarted && <PlayCircle className="w-4 h-4 mr-2" />}
                                {isInProgress && <Edit3 className="w-4 h-4 mr-2" />}
                                {isCritical ? '🔥 緊急開始' : 
                                 isNotStarted ? '評価開始' : 
                                 '続きから'}
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleSendReminder(staff.id)}
                              >
                                <MessageSquare className="w-4 h-4 mr-2" />
                                催促
                              </Button>
                              {isNotStarted && (
                                <Link href={`/evaluation-execution/dynamic/${staff.id}`}>
                                  <Button 
                                    className="bg-purple-600 hover:bg-purple-700 w-full"
                                    size="sm"
                                    title="AIが経験レベルに応じた評価シートを生成"
                                  >
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    AI生成
                                  </Button>
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* 進捗バー（評価中の場合） */}
                        {isInProgress && (
                          <div className="mt-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span>評価進捗</span>
                              <span>技術評価: {staff.technicalScore || 0}/50点</span>
                            </div>
                            <Progress 
                              value={((staff.technicalScore || 0) / 50) * 100} 
                              className="h-2"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}