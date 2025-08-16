'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Database,
  Users,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw,
  ChevronRight,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Sparkles,
  MessageCircle,
  UserX,
  ArrowRightLeft,
  UserCheck
} from 'lucide-react';

import { UnifiedBankService, BankStatistics } from '@/lib/interview-bank/services/unified-bank-service';
import { BankInterviewResult } from '@/lib/interview-bank/types';
import Link from 'next/link';

// 統計カードコンポーネント
interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  description?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

function StatCard({ title, value, change, icon, description, variant = 'default' }: StatCardProps) {
  const variantColors = {
    default: 'text-blue-600 bg-blue-50',
    success: 'text-green-600 bg-green-50',
    warning: 'text-yellow-600 bg-yellow-50',
    danger: 'text-red-600 bg-red-50'
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <div className="text-2xl font-bold">{value}</div>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
            {change !== undefined && (
              <div className={`text-xs ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% 前月比
              </div>
            )}
          </div>
          <div className={`p-3 rounded-lg ${variantColors[variant]}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 最近の面談リストアイテム
interface RecentInterviewItemProps {
  interview: BankInterviewResult;
  onView: (id: string) => void;
}

function RecentInterviewItem({ interview, onView }: RecentInterviewItemProps) {
  const getBankTypeInfo = (type: string) => {
    switch (type) {
      case 'regular':
        return { label: '定期面談', color: 'blue', icon: <Calendar className="w-4 h-4" /> };
      case 'support':
        return { label: 'サポート面談', color: 'green', icon: <MessageCircle className="w-4 h-4" /> };
      case 'special':
        return { label: '特別面談', color: 'orange', icon: <AlertCircle className="w-4 h-4" /> };
      default:
        return { label: '面談', color: 'gray', icon: <FileText className="w-4 h-4" /> };
    }
  };

  const bankInfo = getBankTypeInfo(interview.generationParams?.bankType || 'regular');
  const statusColors = {
    pending: 'secondary',
    in_progress: 'default',
    completed: 'success'
  } as const;

  return (
    <div 
      className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent cursor-pointer"
      onClick={() => onView(interview.id)}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded bg-${bankInfo.color}-50`}>
          {bankInfo.icon}
        </div>
        <div>
          <div className="font-medium">{interview.staffProfile.name}</div>
          <div className="text-sm text-muted-foreground">
            {bankInfo.label} - {interview.staffProfile.department}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={statusColors[interview.status as keyof typeof statusColors]}>
          {interview.status === 'completed' ? '完了' : 
           interview.status === 'in_progress' ? '実施中' : '予定'}
        </Badge>
        <span className="text-sm text-muted-foreground">
          {new Date(interview.conductedAt).toLocaleDateString('ja-JP')}
        </span>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </div>
    </div>
  );
}

// メインダッシュボード
export default function InterviewBankDashboard() {
  const [statistics, setStatistics] = useState<BankStatistics | null>(null);
  const [recentInterviews, setRecentInterviews] = useState<BankInterviewResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month');
  const [unifiedService] = useState(() => UnifiedBankService.getInstance());

  // データ取得
  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // 期間設定
      const end = new Date();
      const start = new Date();
      if (selectedPeriod === 'week') {
        start.setDate(start.getDate() - 7);
      } else if (selectedPeriod === 'month') {
        start.setMonth(start.getMonth() - 1);
      } else {
        start.setMonth(start.getMonth() - 3);
      }

      // 統計取得
      const stats = await unifiedService.getUnifiedStatistics({ start, end });
      setStatistics(stats);

      // 最近の面談取得
      const { results } = await unifiedService.searchInterviews({
        dateFrom: start,
        dateTo: end,
        limit: 10
      });
      setRecentInterviews(results);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewInterview = (id: string) => {
    // 面談詳細画面へ遷移（実装時）
    console.log('View interview:', id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Database className="w-8 h-8" />
            面談バンクシステム
          </h1>
          <p className="text-muted-foreground">統合面談管理ダッシュボード</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadDashboardData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            更新
          </Button>
          <Button asChild>
            <Link href="/interview-bank/create">
              <Plus className="w-4 h-4 mr-2" />
              新規面談作成
            </Link>
          </Button>
        </div>
      </div>

      {/* 期間選択 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">表示期間:</span>
        <div className="flex gap-1">
          {(['week', 'month', 'quarter'] as const).map(period => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
            >
              {period === 'week' ? '週間' : period === 'month' ? '月間' : '四半期'}
            </Button>
          ))}
        </div>
      </div>

      {/* 統計カード */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="総面談数"
            value={statistics.overall.totalInterviews}
            icon={<Database className="w-5 h-5" />}
            description="全バンクシステム合計"
            variant="default"
          />
          <StatCard
            title="実施中"
            value={statistics.overall.activeInterviews}
            icon={<Activity className="w-5 h-5" />}
            description="現在進行中の面談"
            variant="warning"
          />
          <StatCard
            title="完了率"
            value={`${Math.round(statistics.overall.completionRate)}%`}
            icon={<CheckCircle className="w-5 h-5" />}
            description="平均完了率"
            variant="success"
          />
          <StatCard
            title="平均時間"
            value={`${statistics.overall.averageDuration}分`}
            icon={<Clock className="w-5 h-5" />}
            description="面談あたり平均"
            variant="default"
          />
        </div>
      )}

      {/* バンク別統計 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 定期面談 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              定期面談バンク
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>実施数</span>
                <span className="font-bold">{statistics?.regular.total || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>完了</span>
                <span className="font-bold text-green-600">{statistics?.regular.completed || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>保留中</span>
                <span className="font-bold text-yellow-600">{statistics?.regular.pending || 0}</span>
              </div>
            </div>
            <Progress 
              value={statistics?.regular.averageCompletionRate || 0} 
              className="h-2"
            />
            <Button variant="outline" className="w-full" asChild>
              <Link href="/interview-bank/regular">
                詳細を見る
                <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* サポート面談 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              サポート面談バンク
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>申込数</span>
                <span className="font-bold">{statistics?.support.total || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>解決率</span>
                <span className="font-bold text-green-600">
                  {Math.round(statistics?.support.resolutionRate || 0)}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>平均応答</span>
                <span className="font-bold">{statistics?.support.averageResponseTime || 0}時間</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {Object.entries(statistics?.support.byCategory || {}).map(([cat, count]) => (
                <Badge key={cat} variant="secondary" className="text-xs">
                  {cat}: {count}
                </Badge>
              ))}
            </div>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/interview-bank/support">
                詳細を見る
                <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* 特別面談 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              特別面談バンク
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>実施数</span>
                <span className="font-bold">{statistics?.special.total || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>重要案件</span>
                <span className="font-bold text-red-600">{statistics?.special.criticalCases || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>要フォロー</span>
                <span className="font-bold text-yellow-600">
                  {statistics?.special.followUpRequired || 0}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {Object.entries(statistics?.special.byType || {}).map(([type, count]) => (
                <Badge key={type} variant="outline" className="text-xs">
                  {type === 'exit' ? '退職' :
                   type === 'transfer' ? '異動' :
                   type === 'return' ? '復職' :
                   type === 'promotion' ? '昇進' :
                   type === 'disciplinary' ? '懲戒' : type}: {count}
                </Badge>
              ))}
            </div>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/interview-bank/special">
                詳細を見る
                <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 最近の面談 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              最近の面談
            </span>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/interview-bank/history">
                すべて表示
                <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-2">
              {recentInterviews.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  該当する面談がありません
                </div>
              ) : (
                recentInterviews.map(interview => (
                  <RecentInterviewItem
                    key={interview.id}
                    interview={interview}
                    onView={handleViewInterview}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* アラート */}
      {statistics && statistics.special.criticalCases > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>{statistics.special.criticalCases}件</strong>の重要案件があります。
            早急な対応が必要です。
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}