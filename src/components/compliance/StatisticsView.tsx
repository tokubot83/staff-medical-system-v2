'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Calendar,
  Users,
  FileText,
  Shield
} from 'lucide-react';

const StatisticsView: React.FC = () => {
  // 統計データ（実際はAPIから取得）
  const statistics = {
    monthly: {
      total: 45,
      resolved: 38,
      pending: 7,
      averageResolutionDays: 3.2,
      comparisonLastMonth: '+12%'
    },
    byCategory: [
      { category: 'ハラスメント', count: 18, percentage: 40 },
      { category: '労働条件', count: 12, percentage: 26.7 },
      { category: '診療報酬不正', count: 8, percentage: 17.8 },
      { category: '個人情報漏洩', count: 4, percentage: 8.9 },
      { category: 'その他', count: 3, percentage: 6.6 }
    ],
    bySeverity: [
      { severity: 'critical', label: '重大', count: 5, color: 'bg-red-500' },
      { severity: 'high', label: '高', count: 12, color: 'bg-orange-500' },
      { severity: 'medium', label: '中', count: 20, color: 'bg-yellow-500' },
      { severity: 'low', label: '低', count: 8, color: 'bg-green-500' }
    ],
    byDepartment: [
      { department: '看護部', count: 15 },
      { department: '医師', count: 8 },
      { department: '事務部', count: 7 },
      { department: 'リハビリ部', count: 6 },
      { department: '薬剤部', count: 5 },
      { department: 'その他', count: 4 }
    ],
    trends: [
      { month: '2025年4月', count: 32 },
      { month: '2025年5月', count: 28 },
      { month: '2025年6月', count: 35 },
      { month: '2025年7月', count: 40 },
      { month: '2025年8月', count: 38 },
      { month: '2025年9月', count: 45 }
    ],
    responseTime: {
      within1Hour: 92,
      within24Hours: 98,
      within3Days: 100
    },
    committees: {
      harassment: 8,
      disciplinary: 3,
      healthSafety: 2
    }
  };

  return (
    <div className="space-y-6">
      {/* サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              今月の通報数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.monthly.total}</div>
            <div className="flex items-center gap-1 text-sm mt-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-green-600">{statistics.monthly.comparisonLastMonth}</span>
              <span className="text-gray-500">前月比</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              解決率
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((statistics.monthly.resolved / statistics.monthly.total) * 100)}%
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {statistics.monthly.resolved}/{statistics.monthly.total}件解決
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              平均解決日数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.monthly.averageResolutionDays}日</div>
            <p className="text-xs text-gray-500 mt-1">目標: 5日以内</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Users className="h-4 w-4" />
              委員会付託
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics.committees.harassment + statistics.committees.disciplinary + statistics.committees.healthSafety}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              ハラスメント対策委員会 他
            </p>
          </CardContent>
        </Card>
      </div>

      {/* カテゴリ別統計 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            カテゴリ別通報統計
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {statistics.byCategory.map((item) => (
              <div key={item.category} className="flex items-center gap-3">
                <div className="w-32 text-sm font-medium">{item.category}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                  <div
                    className="bg-blue-500 h-full flex items-center justify-end pr-2"
                    style={{ width: `${item.percentage}%` }}
                  >
                    <span className="text-xs text-white font-medium">{item.count}件</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600 w-12 text-right">
                  {item.percentage.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 緊急度別 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              緊急度別分布
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {statistics.bySeverity.map((item) => (
                <div key={item.severity} className="flex items-center gap-3">
                  <Badge className={`${item.color} text-white w-16 justify-center`}>
                    {item.label}
                  </Badge>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                    <div
                      className={`${item.color} h-full flex items-center justify-end pr-2`}
                      style={{ width: `${(item.count / 45) * 100}%` }}
                    >
                      <span className="text-xs text-white font-medium">{item.count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">初動対応達成率</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>1時間以内（Critical）</span>
                  <span className="font-medium text-green-600">{statistics.responseTime.within1Hour}%</span>
                </div>
                <div className="flex justify-between">
                  <span>24時間以内（High）</span>
                  <span className="font-medium text-green-600">{statistics.responseTime.within24Hours}%</span>
                </div>
                <div className="flex justify-between">
                  <span>3日以内（Medium）</span>
                  <span className="font-medium text-green-600">{statistics.responseTime.within3Days}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 部署別 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              部署別通報数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {statistics.byDepartment.map((item) => (
                <div key={item.department} className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm font-medium">{item.department}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-500 h-full rounded-full"
                        style={{ width: `${(item.count / 15) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8 text-right">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-orange-50 rounded-lg">
              <h4 className="text-sm font-medium text-orange-900 mb-2">委員会への報告</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>ハラスメント対策委員会</span>
                  <span className="font-medium">{statistics.committees.harassment}件</span>
                </div>
                <div className="flex justify-between">
                  <span>懲戒委員会</span>
                  <span className="font-medium">{statistics.committees.disciplinary}件</span>
                </div>
                <div className="flex justify-between">
                  <span>労働衛生委員会</span>
                  <span className="font-medium">{statistics.committees.healthSafety}件</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 月別推移 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            月別通報数推移
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {statistics.trends.map((item, index) => (
              <div key={item.month} className="flex items-center gap-3">
                <div className="w-24 text-sm">{item.month}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                  <div
                    className={`h-full flex items-center justify-end pr-2 ${
                      index === statistics.trends.length - 1 ? 'bg-blue-600' : 'bg-blue-400'
                    }`}
                    style={{ width: `${(item.count / 50) * 100}%` }}
                  >
                    <span className="text-xs text-white font-medium">{item.count}件</span>
                  </div>
                </div>
                {index > 0 && (
                  <div className="flex items-center gap-1">
                    {item.count > statistics.trends[index - 1].count ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              過去6ヶ月の平均: <span className="font-medium">35.8件/月</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsView;