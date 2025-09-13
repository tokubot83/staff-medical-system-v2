'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Star,
  Brain,
  Users,
  Zap,
  Target,
  Activity,
  RefreshCw
} from 'lucide-react';
import { EnhancedInterviewReservation } from '@/types/pattern-d-interview';

interface PatternDAnalyticsProps {
  patternDReservations: EnhancedInterviewReservation[];
  onRefresh: () => void;
}

interface AnalyticsData {
  totalAIBookings: number;
  averageMatchingAccuracy: number;
  averageSatisfactionScore: number;
  averageProcessingTime: number;
  popularTimeSlots: { slot: string; count: number }[];
  topInterviewers: { name: string; bookings: number; satisfaction: number }[];
  improvementSuggestions: string[];
}

export default function PatternDAnalytics({ patternDReservations, onRefresh }: PatternDAnalyticsProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateAnalytics();
  }, [patternDReservations]);

  const generateAnalytics = async () => {
    setLoading(true);

    try {
      // 実際の分析処理をシミュレート
      await new Promise(resolve => setTimeout(resolve, 1000));

      const analytics: AnalyticsData = {
        totalAIBookings: patternDReservations.length,
        averageMatchingAccuracy: calculateAverageAccuracy(),
        averageSatisfactionScore: calculateAverageSatisfaction(),
        averageProcessingTime: 4.2, // 秒
        popularTimeSlots: generateTimeSlotStats(),
        topInterviewers: generateInterviewerStats(),
        improvementSuggestions: generateSuggestions()
      };

      setAnalyticsData(analytics);
    } catch (error) {
      console.error('分析データ生成エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageAccuracy = (): number => {
    if (patternDReservations.length === 0) return 0;
    const total = patternDReservations.reduce((sum, reservation) =>
      sum + (reservation.qualityMetrics?.matchingAccuracy || 85), 0
    );
    return Math.round(total / patternDReservations.length);
  };

  const calculateAverageSatisfaction = (): number => {
    if (patternDReservations.length === 0) return 0;
    const total = patternDReservations.reduce((sum, reservation) =>
      sum + (reservation.qualityMetrics?.staffSatisfaction || 4.5), 0
    );
    return Math.round((total / patternDReservations.length) * 10) / 10;
  };

  const generateTimeSlotStats = () => {
    const timeSlotCounts = new Map<string, number>();

    patternDReservations.forEach(reservation => {
      const timeSlot = getTimeSlotCategory(reservation.scheduledTime);
      timeSlotCounts.set(timeSlot, (timeSlotCounts.get(timeSlot) || 0) + 1);
    });

    return Array.from(timeSlotCounts.entries())
      .map(([slot, count]) => ({ slot, count }))
      .sort((a, b) => b.count - a.count);
  };

  const generateInterviewerStats = () => {
    const interviewerStats = new Map<string, { bookings: number; totalSatisfaction: number }>();

    patternDReservations.forEach(reservation => {
      const name = reservation.interviewerInfo.name;
      const current = interviewerStats.get(name) || { bookings: 0, totalSatisfaction: 0 };

      interviewerStats.set(name, {
        bookings: current.bookings + 1,
        totalSatisfaction: current.totalSatisfaction + (reservation.qualityMetrics?.staffSatisfaction || 4.5)
      });
    });

    return Array.from(interviewerStats.entries())
      .map(([name, stats]) => ({
        name,
        bookings: stats.bookings,
        satisfaction: Math.round((stats.totalSatisfaction / stats.bookings) * 10) / 10
      }))
      .sort((a, b) => b.bookings - a.bookings);
  };

  const generateSuggestions = (): string[] => {
    const suggestions = [];

    if (calculateAverageAccuracy() < 90) {
      suggestions.push('マッチングアルゴリズムの調整により、精度向上が期待できます');
    }

    if (calculateAverageSatisfaction() < 4.5) {
      suggestions.push('職員フィードバックの分析により、満足度向上の機会があります');
    }

    const timeSlots = generateTimeSlotStats();
    const leastPopular = timeSlots[timeSlots.length - 1];
    if (leastPopular && leastPopular.count < 3) {
      suggestions.push(`${leastPopular.slot}の時間帯は利用が少なく、見直しを検討できます`);
    }

    return suggestions;
  };

  const getTimeSlotCategory = (time: string): string => {
    const hour = parseInt(time.split(':')[0]);
    if (hour < 12) return '午前 (9:00-12:00)';
    if (hour < 17) return '午後 (13:00-17:00)';
    return '夕方 (17:00-19:00)';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Pattern D AI最適化分析</h3>
          <Button onClick={onRefresh} disabled>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            分析中...
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">分析データの読み込みに失敗しました。</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Pattern D AI最適化分析
          </h3>
          <p className="text-sm text-gray-600">AI予約システムのパフォーマンス分析</p>
        </div>
        <Button onClick={onRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          更新
        </Button>
      </div>

      {/* KPI メトリクス */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AI予約総数</p>
                <p className="text-2xl font-bold text-blue-600">
                  {analyticsData.totalAIBookings}
                </p>
              </div>
              <Zap className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">マッチング精度</p>
                <p className="text-2xl font-bold text-green-600">
                  {analyticsData.averageMatchingAccuracy}%
                </p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">職員満足度</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {analyticsData.averageSatisfactionScore}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">処理時間</p>
                <p className="text-2xl font-bold text-purple-600">
                  {analyticsData.averageProcessingTime}s
                </p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 人気時間帯 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              人気時間帯
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.popularTimeSlots.map((slot, index) => (
                <div key={slot.slot} className="flex items-center justify-between">
                  <span className="font-medium">{slot.slot}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(slot.count / Math.max(...analyticsData.popularTimeSlots.map(s => s.count))) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 min-w-[2rem] text-right">
                      {slot.count}件
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* トップ担当者 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              トップ担当者
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topInterviewers.map((interviewer, index) => (
                <div key={interviewer.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-xs">
                      #{index + 1}
                    </Badge>
                    <span className="font-medium">{interviewer.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-semibold">{interviewer.bookings}件</p>
                      <p className="text-xs text-gray-600">満足度: {interviewer.satisfaction}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 改善提案 */}
      {analyticsData.improvementSuggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              改善提案
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.improvementSuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <Activity className="h-5 w-5 text-blue-600 mt-0.5" />
                  <p className="text-sm text-blue-800">{suggestion}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}