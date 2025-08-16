'use client';

/**
 * 統合面談バンクシステムタブ
 * 定期面談、サポート面談、特別面談の3つのバンクシステムを統合
 */

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Database,
  Calendar,
  Clock,
  Users,
  TrendingUp,
  AlertTriangle,
  Heart,
  UserX,
  ArrowRightLeft,
  UserCheck,
  Briefcase,
  MessageCircle,
  Settings,
  BarChart3,
  Activity
} from 'lucide-react';

import { UnifiedBankService, BankStatistics } from '@/lib/interview-bank/services/unified-bank-service';
import { InterviewBankService } from '@/lib/interview-bank/services/bank-service';
import SupportInterviewBankFlow from './SupportInterviewBankFlow';
import SpecialInterviewBankFlow from './SpecialInterviewBankFlow';
import DynamicInterviewFlow from './DynamicInterviewFlow';

// 面談タイプのアイコンとカラーマッピング
const interviewTypeIcons = {
  regular: { icon: <Calendar className="h-5 w-5" />, color: '#3b82f6', label: '定期面談' },
  support: { icon: <Heart className="h-5 w-5" />, color: '#10b981', label: 'サポート面談' },
  special: { icon: <AlertTriangle className="h-5 w-5" />, color: '#f59e0b', label: '特別面談' }
};

const specialTypeIcons = {
  exit: { icon: <UserX className="h-4 w-4" />, color: '#ef4444', label: '退職面談' },
  transfer: { icon: <ArrowRightLeft className="h-4 w-4" />, color: '#3b82f6', label: '異動面談' },
  return: { icon: <UserCheck className="h-4 w-4" />, color: '#10b981', label: '復職面談' },
  promotion: { icon: <TrendingUp className="h-4 w-4" />, color: '#8b5cf6', label: '昇進面談' },
  disciplinary: { icon: <AlertTriangle className="h-4 w-4" />, color: '#ef4444', label: '懲戒面談' }
};

export default function IntegratedBankSystemTab() {
  const [activeBank, setActiveBank] = useState<'overview' | 'regular' | 'support' | 'special'>('overview');
  const [bankStatistics, setBankStatistics] = useState<BankStatistics | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'1month' | '3months' | '6months' | '1year'>('6months');
  const [loading, setLoading] = useState(true);

  const unifiedService = UnifiedBankService.getInstance();
  const bankService = InterviewBankService.getInstance();

  useEffect(() => {
    loadBankData();
  }, [selectedPeriod]);

  const loadBankData = async () => {
    setLoading(true);
    try {
      const endDate = new Date();
      const startDate = new Date();
      
      switch (selectedPeriod) {
        case '1month':
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case '3months':
          startDate.setMonth(startDate.getMonth() - 3);
          break;
        case '6months':
          startDate.setMonth(startDate.getMonth() - 6);
          break;
        case '1year':
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
      }

      const stats = await unifiedService.getUnifiedStatistics({ start: startDate, end: endDate });
      setBankStatistics(stats);
    } catch (error) {
      console.error('Failed to load bank statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  // 統計ダッシュボード
  const StatisticsOverview = () => {
    if (!bankStatistics) return null;

    // チャート用データ
    const bankComparisonData = [
      {
        bank: '定期面談',
        total: bankStatistics.regular.total,
        completed: bankStatistics.regular.completed,
        pending: bankStatistics.regular.pending,
        completionRate: bankStatistics.regular.averageCompletionRate
      },
      {
        bank: 'サポート面談',
        total: bankStatistics.support.total,
        completed: bankStatistics.support.total * (bankStatistics.support.resolutionRate / 100),
        pending: bankStatistics.support.total - (bankStatistics.support.total * (bankStatistics.support.resolutionRate / 100)),
        completionRate: bankStatistics.support.resolutionRate
      },
      {
        bank: '特別面談',
        total: bankStatistics.special.total,
        completed: bankStatistics.special.total - bankStatistics.special.followUpRequired,
        pending: bankStatistics.special.followUpRequired,
        completionRate: ((bankStatistics.special.total - bankStatistics.special.followUpRequired) / bankStatistics.special.total) * 100
      }
    ];

    const pieData = [
      { name: '定期面談', value: bankStatistics.regular.total, color: '#3b82f6' },
      { name: 'サポート面談', value: bankStatistics.support.total, color: '#10b981' },
      { name: '特別面談', value: bankStatistics.special.total, color: '#f59e0b' }
    ];

    return (
      <div className="space-y-6">
        {/* ヘッダー統計 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">総面談数</p>
                  <p className="text-2xl font-bold">{bankStatistics.overall.totalInterviews}</p>
                </div>
                <Database className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">実施中</p>
                  <p className="text-2xl font-bold">{bankStatistics.overall.activeInterviews}</p>
                </div>
                <Activity className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">完了率</p>
                  <p className="text-2xl font-bold">{bankStatistics.overall.completionRate.toFixed(0)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">平均時間</p>
                  <p className="text-2xl font-bold">{bankStatistics.overall.averageDuration.toFixed(0)}分</p>
                </div>
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* チャート */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* バンク別比較 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                バンク別実施状況
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={bankComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bank" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" fill="#10b981" name="完了" />
                  <Bar dataKey="pending" fill="#f59e0b" name="未完了" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 面談タイプ分布 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                面談タイプ分布
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* 詳細統計 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 定期面談 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {interviewTypeIcons.regular.icon}
                定期面談
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">総数</span>
                <span className="font-medium">{bankStatistics.regular.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">完了</span>
                <span className="font-medium">{bankStatistics.regular.completed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">保留</span>
                <span className="font-medium">{bankStatistics.regular.pending}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>完了率</span>
                  <span>{bankStatistics.regular.averageCompletionRate.toFixed(0)}%</span>
                </div>
                <Progress value={bankStatistics.regular.averageCompletionRate} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* サポート面談 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {interviewTypeIcons.support.icon}
                サポート面談
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">総数</span>
                <span className="font-medium">{bankStatistics.support.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">平均応答時間</span>
                <span className="font-medium">{bankStatistics.support.averageResponseTime}時間</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>解決率</span>
                  <span>{bankStatistics.support.resolutionRate.toFixed(0)}%</span>
                </div>
                <Progress value={bankStatistics.support.resolutionRate} className="h-2" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold">カテゴリ別:</p>
                {Object.entries(bankStatistics.support.byCategory).slice(0, 3).map(([category, count]) => (
                  <div key={category} className="flex justify-between text-xs">
                    <span>{category}</span>
                    <span>{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 特別面談 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {interviewTypeIcons.special.icon}
                特別面談
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">総数</span>
                <span className="font-medium">{bankStatistics.special.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">クリティカル</span>
                <span className="font-medium text-red-600">{bankStatistics.special.criticalCases}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">フォローアップ必要</span>
                <span className="font-medium text-yellow-600">{bankStatistics.special.followUpRequired}</span>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold">タイプ別:</p>
                {Object.entries(bankStatistics.special.byType).slice(0, 3).map(([type, count]) => (
                  <div key={type} className="flex justify-between text-xs">
                    <span>{type}</span>
                    <span>{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Database className="w-6 h-6" />
            統合面談バンクシステム
          </h2>
          <p className="text-muted-foreground">
            定期・サポート・特別面談の3つのバンクシステムを統合管理
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={(value: any) => setSelectedPeriod(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">1ヶ月</SelectItem>
              <SelectItem value="3months">3ヶ月</SelectItem>
              <SelectItem value="6months">6ヶ月</SelectItem>
              <SelectItem value="1year">1年</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            設定
          </Button>
        </div>
      </div>

      {/* バンクシステムタブ */}
      <Tabs value={activeBank} onValueChange={(value: any) => setActiveBank(value)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            統計概要
          </TabsTrigger>
          <TabsTrigger value="regular" className="flex items-center gap-2">
            {interviewTypeIcons.regular.icon}
            定期面談バンク
          </TabsTrigger>
          <TabsTrigger value="support" className="flex items-center gap-2">
            {interviewTypeIcons.support.icon}
            サポート面談バンク
          </TabsTrigger>
          <TabsTrigger value="special" className="flex items-center gap-2">
            {interviewTypeIcons.special.icon}
            特別面談バンク
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <StatisticsOverview />
        </TabsContent>

        <TabsContent value="regular" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {interviewTypeIcons.regular.icon}
                定期面談バンクシステム
              </CardTitle>
              <CardDescription>
                新人、年次、管理職面談などの定期面談を管理
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DynamicInterviewFlow />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support" className="space-y-6">
          <SupportInterviewBankFlow />
        </TabsContent>

        <TabsContent value="special" className="space-y-6">
          <SpecialInterviewBankFlow />
        </TabsContent>
      </Tabs>
    </div>
  );
}