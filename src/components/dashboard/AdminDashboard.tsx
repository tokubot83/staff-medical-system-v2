'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, TrendingUp, AlertCircle, Target } from 'lucide-react';
import EvaluationProgress from './EvaluationProgress';
import GradeDistribution from './GradeDistribution';
import DepartmentAnalysis from './DepartmentAnalysis';

interface AdminDashboardProps {
  facilityId?: string;
  period?: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  facilityId = 'all',
  period = '2025-summer' 
}) => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedFacility, setSelectedFacility] = useState(facilityId);
  const [selectedPeriod, setSelectedPeriod] = useState(period);

  const facilities = [
    { id: 'all', name: '全施設' },
    { id: 'hospital', name: '病院' },
    { id: 'elderly', name: '高齢者施設' },
    { id: 'welfare', name: '福祉施設' }
  ];

  const periods = [
    { id: '2025-summer', name: '2025年夏季' },
    { id: '2024-winter', name: '2024年冬季' },
    { id: '2024-summer', name: '2024年夏季' }
  ];

  const summaryStats = {
    totalEmployees: 450,
    evaluationCompleted: 312,
    evaluationPending: 138,
    averageScore: 72.5,
    deadline: '2025-08-31'
  };

  const completionRate = Math.round((summaryStats.evaluationCompleted / summaryStats.totalEmployees) * 100);

  return (
    <div className="p-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">管理者ダッシュボード</h1>
          <p className="text-gray-600 mt-2">人事評価システム統合管理</p>
        </div>
        <div className="flex gap-2">
          <select 
            className="px-4 py-2 border rounded-lg bg-white"
            value={selectedFacility}
            onChange={(e) => setSelectedFacility(e.target.value)}
          >
            {facilities.map(facility => (
              <option key={facility.id} value={facility.id}>
                {facility.name}
              </option>
            ))}
          </select>
          <select 
            className="px-4 py-2 border rounded-lg bg-white"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            {periods.map(period => (
              <option key={period.id} value={period.id}>
                {period.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                対象職員数
              </CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.totalEmployees}名</div>
            <p className="text-xs text-gray-500 mt-1">
              前期比 +12名
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                評価完了率
              </CardTitle>
              <Target className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">
                {summaryStats.evaluationCompleted}/{summaryStats.totalEmployees}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                平均評価点
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.averageScore}点</div>
            <p className="text-xs text-green-600 mt-1">
              前期比 +2.3点
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                評価期限
              </CardTitle>
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">残り15日</div>
            <p className="text-xs text-gray-500 mt-1">
              {summaryStats.deadline}まで
            </p>
          </CardContent>
        </Card>
      </div>

      {/* アラート */}
      {summaryStats.evaluationPending > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <span className="font-medium text-amber-900">
              未完了の評価があります
            </span>
            <Badge variant="secondary" className="ml-auto">
              {summaryStats.evaluationPending}件
            </Badge>
          </div>
          <p className="text-sm text-amber-700 mt-2">
            評価期限までに全職員の評価を完了してください。
          </p>
        </div>
      )}

      {/* メインコンテンツ */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="progress">評価進捗</TabsTrigger>
          <TabsTrigger value="distribution">グレード分布</TabsTrigger>
          <TabsTrigger value="analysis">部門分析</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EvaluationProgress 
              facilityId={selectedFacility}
              period={selectedPeriod}
              compact={true}
            />
            <GradeDistribution 
              facilityId={selectedFacility}
              period={selectedPeriod}
              compact={true}
            />
          </div>
        </TabsContent>

        <TabsContent value="progress" className="mt-6">
          <EvaluationProgress 
            facilityId={selectedFacility}
            period={selectedPeriod}
            compact={false}
          />
        </TabsContent>

        <TabsContent value="distribution" className="mt-6">
          <GradeDistribution 
            facilityId={selectedFacility}
            period={selectedPeriod}
            compact={false}
          />
        </TabsContent>

        <TabsContent value="analysis" className="mt-6">
          <DepartmentAnalysis 
            facilityId={selectedFacility}
            period={selectedPeriod}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;