'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line
} from 'recharts';
import { TrendingUp, TrendingDown, Minus, Award, Users, Target } from 'lucide-react';

interface DepartmentAnalysisProps {
  facilityId: string;
  period: string;
}

interface DepartmentStats {
  department: string;
  averageScore: number;
  previousScore: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  completionRate: number;
  employeeCount: number;
  topPerformers: number;
  needsImprovement: number;
}

interface SkillCategory {
  category: string;
  nursing: number;
  medical: number;
  rehabilitation: number;
  administration: number;
  welfare: number;
}

const DepartmentAnalysis: React.FC<DepartmentAnalysisProps> = ({ 
  facilityId, 
  period 
}) => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [comparisonMode, setComparisonMode] = useState<'period' | 'department'>('department');

  // サンプルデータ
  const departmentStats: DepartmentStats[] = [
    {
      department: '看護部',
      averageScore: 73.2,
      previousScore: 70.9,
      trend: 'up',
      trendValue: 2.3,
      completionRate: 79.2,
      employeeCount: 120,
      topPerformers: 36,
      needsImprovement: 36
    },
    {
      department: '医療技術部',
      averageScore: 75.8,
      previousScore: 74.2,
      trend: 'up',
      trendValue: 1.6,
      completionRate: 84.4,
      employeeCount: 45,
      topPerformers: 14,
      needsImprovement: 13
    },
    {
      department: 'リハビリテーション部',
      averageScore: 74.5,
      previousScore: 74.8,
      trend: 'down',
      trendValue: -0.3,
      completionRate: 85.7,
      employeeCount: 35,
      topPerformers: 11,
      needsImprovement: 10
    },
    {
      department: '事務部',
      averageScore: 71.0,
      previousScore: 71.0,
      trend: 'stable',
      trendValue: 0,
      completionRate: 72.0,
      employeeCount: 25,
      topPerformers: 8,
      needsImprovement: 7
    },
    {
      department: '福祉部',
      averageScore: 72.3,
      previousScore: 69.8,
      trend: 'up',
      trendValue: 2.5,
      completionRate: 76.4,
      employeeCount: 55,
      topPerformers: 17,
      needsImprovement: 16
    }
  ];

  const skillCategories: SkillCategory[] = [
    { category: '専門技術', nursing: 75, medical: 78, rehabilitation: 76, administration: 70, welfare: 73 },
    { category: '対人関係', nursing: 72, medical: 74, rehabilitation: 77, administration: 73, welfare: 75 },
    { category: '安全管理', nursing: 74, medical: 76, rehabilitation: 73, administration: 71, welfare: 72 },
    { category: '記録・報告', nursing: 71, medical: 75, rehabilitation: 74, administration: 72, welfare: 70 },
    { category: '法定研修', nursing: 73, medical: 77, rehabilitation: 75, administration: 70, welfare: 71 }
  ];

  const trendData = [
    { period: '2024夏', nursing: 70.9, medical: 74.2, rehabilitation: 74.8, administration: 71.0, welfare: 69.8 },
    { period: '2024冬', nursing: 72.1, medical: 74.8, rehabilitation: 74.5, administration: 71.2, welfare: 71.0 },
    { period: '2025夏', nursing: 73.2, medical: 75.8, rehabilitation: 74.5, administration: 71.0, welfare: 72.3 }
  ];

  const radarData = skillCategories.map(cat => ({
    category: cat.category,
    看護部: cat.nursing,
    医療技術部: cat.medical,
    リハビリ部: cat.rehabilitation,
    事務部: cat.administration,
    福祉部: cat.welfare
  }));

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'stable':
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      case 'stable':
        return 'text-gray-600';
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}点
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* 部門別サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {departmentStats.map(dept => (
          <Card 
            key={dept.department}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedDepartment === dept.department ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedDepartment(dept.department)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-sm font-medium">{dept.department}</CardTitle>
                {getTrendIcon(dept.trend)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-2xl font-bold">{dept.averageScore}点</p>
                  <p className={`text-xs ${getTrendColor(dept.trend)}`}>
                    前期比 {dept.trendValue > 0 ? '+' : ''}{dept.trendValue}点
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Users className="h-3 w-3" />
                  <span>{dept.employeeCount}名</span>
                  <span className="text-gray-400">|</span>
                  <span>{dept.completionRate}%完了</span>
                </div>
                <div className="flex gap-1">
                  <Badge variant="outline" className="text-xs">
                    S/A: {dept.topPerformers}名
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    C/D: {dept.needsImprovement}名
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 詳細分析 */}
      <Tabs defaultValue="comparison" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="comparison">部門比較</TabsTrigger>
          <TabsTrigger value="skills">スキル分析</TabsTrigger>
          <TabsTrigger value="trend">推移分析</TabsTrigger>
        </TabsList>

        <TabsContent value="comparison" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>部門別評価スコア比較</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" angle={-45} textAnchor="end" height={60} />
                    <YAxis domain={[60, 80]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="averageScore" fill="#3b82f6" name="平均スコア" />
                    <Bar dataKey="previousScore" fill="#94a3b8" name="前期スコア" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>部門別スキル評価レーダーチャート</CardTitle>
                <Badge variant="outline">5項目評価</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" />
                    <PolarRadiusAxis angle={90} domain={[60, 80]} />
                    <Radar name="看護部" dataKey="看護部" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                    <Radar name="医療技術部" dataKey="医療技術部" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                    <Radar name="リハビリ部" dataKey="リハビリ部" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                    <Radar name="事務部" dataKey="事務部" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                    <Radar name="福祉部" dataKey="福祉部" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                    <Tooltip />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              
              {/* スキル別スコア表 */}
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">評価項目</th>
                      <th className="text-center p-2">看護部</th>
                      <th className="text-center p-2">医療技術部</th>
                      <th className="text-center p-2">リハビリ部</th>
                      <th className="text-center p-2">事務部</th>
                      <th className="text-center p-2">福祉部</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skillCategories.map(cat => (
                      <tr key={cat.category} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-medium">{cat.category}</td>
                        <td className="text-center p-2">{cat.nursing}</td>
                        <td className="text-center p-2">{cat.medical}</td>
                        <td className="text-center p-2">{cat.rehabilitation}</td>
                        <td className="text-center p-2">{cat.administration}</td>
                        <td className="text-center p-2">{cat.welfare}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trend" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>部門別評価推移（3期分）</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis domain={[65, 80]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="nursing" stroke="#ef4444" name="看護部" strokeWidth={2} />
                    <Line type="monotone" dataKey="medical" stroke="#3b82f6" name="医療技術部" strokeWidth={2} />
                    <Line type="monotone" dataKey="rehabilitation" stroke="#10b981" name="リハビリ部" strokeWidth={2} />
                    <Line type="monotone" dataKey="administration" stroke="#f59e0b" name="事務部" strokeWidth={2} />
                    <Line type="monotone" dataKey="welfare" stroke="#8b5cf6" name="福祉部" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {/* 成長率ランキング */}
              <div className="mt-6">
                <h3 className="font-semibold mb-3">成長率ランキング（前期比）</h3>
                <div className="space-y-2">
                  {departmentStats
                    .sort((a, b) => b.trendValue - a.trendValue)
                    .map((dept, index) => (
                      <div key={dept.department} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <span className="font-medium">{dept.department}</span>
                        </div>
                        <div className={`font-semibold ${getTrendColor(dept.trend)}`}>
                          {dept.trendValue > 0 ? '+' : ''}{dept.trendValue}点
                        </div>
                        {index === 0 && <Award className="h-5 w-5 text-yellow-500" />}
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DepartmentAnalysis;