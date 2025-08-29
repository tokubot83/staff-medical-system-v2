'use client';

import React, { useState, useEffect } from 'react';
import CommonHeader from '@/components/CommonHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Users,
  Target,
  BookOpen,
  Bell,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Download,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import SystemIntegrationService, { AnnualIntegrationSummary, CrossSystemAlert } from '@/services/systemIntegrationService';

export default function AnnualIntegrationSummaryPage() {
  const [summaryData, setSummaryData] = useState<AnnualIntegrationSummary | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<CrossSystemAlert | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadSummaryData();
  }, []);

  const loadSummaryData = async () => {
    setRefreshing(true);
    // 実際の実装では非同期でデータを取得
    const data = SystemIntegrationService.getAnnualIntegrationSummary();
    setSummaryData(data);
    setRefreshing(false);
  };

  const handleRefresh = () => {
    loadSummaryData();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-green-100 text-green-800';
      case 'attention-needed':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'attention-needed':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!summaryData) {
    return (
      <div>
        <CommonHeader title="年間連携サマリー" />
        <div className="max-w-7xl mx-auto p-6">
          <div className="text-center py-12">
            <RefreshCw className="h-12 w-12 mx-auto mb-4 text-gray-300 animate-spin" />
            <p className="text-gray-500">データを読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <CommonHeader title="年間連携サマリー" subtitle="評価システムと教育研修システムの統合管理" />
      
      <div className="max-w-7xl mx-auto p-6">
        {/* ヘッダー情報 */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">📊 2025年度 システム連携サマリー</h1>
            <p className="text-gray-600">評価管理と教育研修管理の連携状況を一元監視</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              更新
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              レポート出力
            </Button>
          </div>
        </div>

        {/* 統計サマリー */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-700">総合同期率</span>
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-800">{summaryData.totalSyncRate}%</div>
              <div className="text-sm text-blue-600">目標: 95%</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-700">アラート対応率</span>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-800">{summaryData.alertResolutionRate}%</div>
              <div className="text-sm text-green-600">優良レベル</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-700">研修完了率</span>
                <BookOpen className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-purple-800">{summaryData.preEvaluationTrainingCompletionRate}%</div>
              <div className="text-sm text-purple-600">評価前必須研修</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-orange-700">アクティブアラート</span>
                <Bell className="h-5 w-5 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-orange-800">{summaryData.activeAlerts.length}</div>
              <div className="text-sm text-orange-600">要対応</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 月別連携状況 */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  月別連携状況
                </CardTitle>
                <CardDescription>各月のタスク実行と連携状況</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {summaryData.monthlyStatuses.map((month) => (
                    <div key={month.month} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(month.status)}
                          <span className="font-semibold text-lg">{month.month}月</span>
                          <Badge className={getStatusColor(month.status)}>
                            {month.status === 'on-track' ? '順調' : 
                             month.status === 'attention-needed' ? '要注意' : '重要'}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">{month.syncRate}%</div>
                          <div className="text-xs text-gray-500">同期率</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">評価タスク</div>
                          <Progress 
                            value={(month.evaluationTasksCompleted / month.evaluationTasksTotal) * 100}
                            className="h-2"
                          />
                          <div className="text-xs text-gray-500 mt-1">
                            {month.evaluationTasksCompleted}/{month.evaluationTasksTotal} 完了
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-gray-600 mb-1">研修タスク</div>
                          <Progress 
                            value={(month.trainingTasksCompleted / month.trainingTasksTotal) * 100}
                            className="h-2"
                          />
                          <div className="text-xs text-gray-500 mt-1">
                            {month.trainingTasksCompleted}/{month.trainingTasksTotal} 完了
                          </div>
                        </div>
                      </div>

                      {month.criticalAlerts > 0 && (
                        <div className="flex items-center gap-2 text-red-600">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            重要アラート {month.criticalAlerts}件
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* アクティブアラート */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-orange-600" />
                  アクティブアラート
                </CardTitle>
                <CardDescription>対応が必要な問題</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {summaryData.activeAlerts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-300" />
                      <p>現在アクティブなアラートはありません</p>
                    </div>
                  ) : (
                    summaryData.activeAlerts.map((alert) => (
                      <div 
                        key={alert.id} 
                        className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                          getPriorityColor(alert.priority)
                        } ${selectedAlert?.id === alert.id ? 'ring-2 ring-blue-300' : ''}`}
                        onClick={() => setSelectedAlert(selectedAlert?.id === alert.id ? null : alert)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge size="sm" className={
                                alert.priority === 'high' ? 'bg-red-600 text-white' :
                                alert.priority === 'medium' ? 'bg-orange-600 text-white' :
                                'bg-yellow-600 text-white'
                              }>
                                {alert.priority === 'high' ? '高' : 
                                 alert.priority === 'medium' ? '中' : '低'}
                              </Badge>
                              {alert.month && (
                                <Badge variant="outline" size="sm">{alert.month}月</Badge>
                              )}
                            </div>
                            <p className="text-sm font-medium mb-2">{alert.message}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <Clock className="h-3 w-3" />
                              <span>{new Date(alert.createdAt).toLocaleDateString('ja-JP')}</span>
                            </div>
                          </div>
                          {alert.actionRequired && (
                            <ArrowRight className="h-4 w-4 text-gray-400 ml-2" />
                          )}
                        </div>
                        
                        {selectedAlert?.id === alert.id && (
                          <div className="mt-3 pt-3 border-t">
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  SystemIntegrationService.resolveAlert(alert.id);
                                  setSummaryData({
                                    ...summaryData,
                                    activeAlerts: summaryData.activeAlerts.filter(a => a.id !== alert.id)
                                  });
                                  setSelectedAlert(null);
                                }}
                              >
                                解決済み
                              </Button>
                              <Button size="sm" variant="outline">
                                詳細確認
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 最近の同期アクティビティ */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-green-600" />
                  最近の同期アクティビティ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {summaryData.recentSyncActivities.slice(0, 5).map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.source === 'evaluation' ? 'bg-purple-500' : 'bg-green-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{activity.source === 'evaluation' ? '評価' : '研修'}</span>
                          <span>•</span>
                          <span>{new Date(activity.timestamp).toLocaleString('ja-JP')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* クイックアクション */}
        <Card className="mt-8 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  <Sparkles className="inline h-5 w-5 mr-2 text-blue-600" />
                  クイックアクション
                </h3>
                <p className="text-gray-600">システム管理の主要機能にアクセス</p>
              </div>
              <div className="flex gap-3">
                <Link href="/evaluation-design/timeline">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Target className="h-4 w-4 mr-2" />
                    評価管理
                  </Button>
                </Link>
                <Link href="/education">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <BookOpen className="h-4 w-4 mr-2" />
                    研修管理
                  </Button>
                </Link>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  設定
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}