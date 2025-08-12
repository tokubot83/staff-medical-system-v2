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
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface GradeDistributionProps {
  facilityId: string;
  period: string;
  compact?: boolean;
}

interface GradeData {
  grade: string;
  count: number;
  percentage: number;
  color: string;
  description: string;
}

interface DepartmentGradeData {
  department: string;
  S: number;
  A: number;
  B: number;
  C: number;
  D: number;
  total: number;
}

const GradeDistribution: React.FC<GradeDistributionProps> = ({ 
  facilityId, 
  period,
  compact = false 
}) => {
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');

  // グレード定義（相対評価）
  const gradeDefinitions = {
    S: { range: '上位10%', color: '#10b981', description: '極めて優秀' },
    A: { range: '11-30%', color: '#3b82f6', description: '優秀' },
    B: { range: '31-70%', color: '#f59e0b', description: '標準' },
    C: { range: '71-90%', color: '#f97316', description: '要改善' },
    D: { range: '下位10%', color: '#ef4444', description: '要指導' }
  };

  // サンプルデータ
  const gradeData: GradeData[] = [
    { grade: 'S', count: 28, percentage: 10, color: '#10b981', description: '極めて優秀' },
    { grade: 'A', count: 56, percentage: 20, color: '#3b82f6', description: '優秀' },
    { grade: 'B', count: 112, percentage: 40, color: '#f59e0b', description: '標準' },
    { grade: 'C', count: 56, percentage: 20, color: '#f97316', description: '要改善' },
    { grade: 'D', count: 28, percentage: 10, color: '#ef4444', description: '要指導' }
  ];

  const departmentGradeData: DepartmentGradeData[] = [
    { department: '看護部', S: 12, A: 24, B: 48, C: 24, D: 12, total: 120 },
    { department: '医療技術部', S: 5, A: 9, B: 18, C: 9, D: 4, total: 45 },
    { department: 'リハビリ部', S: 4, A: 7, B: 14, C: 7, D: 3, total: 35 },
    { department: '事務部', S: 3, A: 5, B: 10, C: 5, D: 2, total: 25 },
    { department: '福祉部', S: 6, A: 11, B: 22, C: 11, D: 5, total: 55 }
  ];

  const totalEmployees = gradeData.reduce((sum, g) => sum + g.count, 0);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}名
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (compact) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>グレード分布</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-2">
              {gradeData.map(grade => (
                <div 
                  key={grade.grade} 
                  className="text-center p-3 rounded-lg"
                  style={{ backgroundColor: `${grade.color}20` }}
                >
                  <div 
                    className="text-2xl font-bold mb-1"
                    style={{ color: grade.color }}
                  >
                    {grade.grade}
                  </div>
                  <div className="text-sm font-semibold">{grade.count}名</div>
                  <div className="text-xs text-gray-500">{grade.percentage}%</div>
                </div>
              ))}
            </div>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="grade" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="#8884d8">
                    {gradeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* メインカード */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>グレード分布詳細</CardTitle>
            <div className="flex gap-2">
              <button
                onClick={() => setChartType('bar')}
                className={`px-3 py-1 rounded ${
                  chartType === 'bar' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                棒グラフ
              </button>
              <button
                onClick={() => setChartType('pie')}
                className={`px-3 py-1 rounded ${
                  chartType === 'pie' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                円グラフ
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* 統計サマリー */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            {gradeData.map(grade => (
              <Card key={grade.grade} className="border-2" style={{ borderColor: grade.color }}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span 
                      className="text-3xl font-bold"
                      style={{ color: grade.color }}
                    >
                      {grade.grade}
                    </span>
                    <Badge 
                      variant="outline"
                      style={{ 
                        borderColor: grade.color,
                        color: grade.color
                      }}
                    >
                      {gradeDefinitions[grade.grade as keyof typeof gradeDefinitions].range}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-semibold">{grade.count}名</p>
                    <p className="text-sm text-gray-500">{grade.percentage}%</p>
                    <p className="text-xs text-gray-400">{grade.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* グラフ表示 */}
          <div className="h-80">
            {chartType === 'bar' ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="grade" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="count" name="人数">
                    {gradeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gradeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.grade}: ${entry.count}名`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {gradeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 部門別分布 */}
      <Card>
        <CardHeader>
          <CardTitle>部門別グレード分布</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">部門</th>
                  <th className="text-center p-2" style={{ color: gradeDefinitions.S.color }}>S</th>
                  <th className="text-center p-2" style={{ color: gradeDefinitions.A.color }}>A</th>
                  <th className="text-center p-2" style={{ color: gradeDefinitions.B.color }}>B</th>
                  <th className="text-center p-2" style={{ color: gradeDefinitions.C.color }}>C</th>
                  <th className="text-center p-2" style={{ color: gradeDefinitions.D.color }}>D</th>
                  <th className="text-center p-2">合計</th>
                </tr>
              </thead>
              <tbody>
                {departmentGradeData.map(dept => (
                  <tr key={dept.department} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{dept.department}</td>
                    <td className="text-center p-2">
                      <span className="font-semibold">{dept.S}</span>
                      <span className="text-xs text-gray-500 ml-1">
                        ({Math.round(dept.S / dept.total * 100)}%)
                      </span>
                    </td>
                    <td className="text-center p-2">
                      <span className="font-semibold">{dept.A}</span>
                      <span className="text-xs text-gray-500 ml-1">
                        ({Math.round(dept.A / dept.total * 100)}%)
                      </span>
                    </td>
                    <td className="text-center p-2">
                      <span className="font-semibold">{dept.B}</span>
                      <span className="text-xs text-gray-500 ml-1">
                        ({Math.round(dept.B / dept.total * 100)}%)
                      </span>
                    </td>
                    <td className="text-center p-2">
                      <span className="font-semibold">{dept.C}</span>
                      <span className="text-xs text-gray-500 ml-1">
                        ({Math.round(dept.C / dept.total * 100)}%)
                      </span>
                    </td>
                    <td className="text-center p-2">
                      <span className="font-semibold">{dept.D}</span>
                      <span className="text-xs text-gray-500 ml-1">
                        ({Math.round(dept.D / dept.total * 100)}%)
                      </span>
                    </td>
                    <td className="text-center p-2 font-bold">{dept.total}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-bold bg-gray-100">
                  <td className="p-2">合計</td>
                  <td className="text-center p-2" style={{ color: gradeDefinitions.S.color }}>
                    {gradeData[0].count}
                  </td>
                  <td className="text-center p-2" style={{ color: gradeDefinitions.A.color }}>
                    {gradeData[1].count}
                  </td>
                  <td className="text-center p-2" style={{ color: gradeDefinitions.B.color }}>
                    {gradeData[2].count}
                  </td>
                  <td className="text-center p-2" style={{ color: gradeDefinitions.C.color }}>
                    {gradeData[3].count}
                  </td>
                  <td className="text-center p-2" style={{ color: gradeDefinitions.D.color }}>
                    {gradeData[4].count}
                  </td>
                  <td className="text-center p-2">{totalEmployees}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GradeDistribution;