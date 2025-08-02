'use client';

import React, { useState } from 'react';
import CommonHeader from '@/components/CommonHeader';
import DashboardButton from '@/components/DashboardButton';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import CategoryBackButton from '@/components/reports/CategoryBackButton';

interface DepartmentData {
  id: string;
  name: string;
  totalStaff: number;
  avgSkillScore: number;
  avgResultScore: number;
  quadrantDistribution: {
    highHigh: number;
    highLow: number;
    lowHigh: number;
    lowLow: number;
  };
  growthRate: number;
  turnoverRate: number;
  trainingHours: number;
  satisfactionScore: number;
}

const mockDepartmentData: DepartmentData[] = [
  {
    id: '1',
    name: '看護部',
    totalStaff: 120,
    avgSkillScore: 75,
    avgResultScore: 78,
    quadrantDistribution: { highHigh: 35, highLow: 15, lowHigh: 25, lowLow: 25 },
    growthRate: 8.5,
    turnoverRate: 12.3,
    trainingHours: 45,
    satisfactionScore: 82
  },
  {
    id: '2',
    name: 'リハビリテーション部',
    totalStaff: 45,
    avgSkillScore: 85,
    avgResultScore: 83,
    quadrantDistribution: { highHigh: 60, highLow: 10, lowHigh: 20, lowLow: 10 },
    growthRate: 12.0,
    turnoverRate: 5.2,
    trainingHours: 60,
    satisfactionScore: 88
  },
  {
    id: '3',
    name: '介護部',
    totalStaff: 80,
    avgSkillScore: 68,
    avgResultScore: 78,
    quadrantDistribution: { highHigh: 20, highLow: 10, lowHigh: 40, lowLow: 30 },
    growthRate: 6.5,
    turnoverRate: 18.5,
    trainingHours: 35,
    satisfactionScore: 75
  },
  {
    id: '4',
    name: '医事課',
    totalStaff: 25,
    avgSkillScore: 74,
    avgResultScore: 71,
    quadrantDistribution: { highHigh: 20, highLow: 30, lowHigh: 20, lowLow: 30 },
    growthRate: 4.0,
    turnoverRate: 8.0,
    trainingHours: 25,
    satisfactionScore: 78
  },
  {
    id: '5',
    name: '栄養課',
    totalStaff: 18,
    avgSkillScore: 82,
    avgResultScore: 85,
    quadrantDistribution: { highHigh: 50, highLow: 10, lowHigh: 25, lowLow: 15 },
    growthRate: 10.0,
    turnoverRate: 3.5,
    trainingHours: 40,
    satisfactionScore: 85
  }
];

export default function DepartmentComparisonPage() {
  const [selectedMetric, setSelectedMetric] = useState<'skill' | 'result' | 'overall'>('overall');
  const [sortBy, setSortBy] = useState<string>('name');

  const sortedDepartments = [...mockDepartmentData].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'skill':
        return b.avgSkillScore - a.avgSkillScore;
      case 'result':
        return b.avgResultScore - a.avgResultScore;
      case 'overall':
        return ((b.avgSkillScore + b.avgResultScore) / 2) - ((a.avgSkillScore + a.avgResultScore) / 2);
      case 'staff':
        return b.totalStaff - a.totalStaff;
      case 'growth':
        return b.growthRate - a.growthRate;
      default:
        return 0;
    }
  });

  const getPerformanceLevel = (score: number) => {
    if (score >= 80) return { label: '優秀', color: 'text-green-600', bg: 'bg-green-50' };
    if (score >= 70) return { label: '良好', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { label: '要改善', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const maxStaff = Math.max(...mockDepartmentData.map(d => d.totalStaff));

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="部門別比較分析" />
      
      <div className="max-w-7xl mx-auto p-6">
        <CategoryBackButton categoryId="dual-axis" />
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">部門別2軸評価比較</h2>
            <div className="flex gap-3">
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value as any)}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="overall">総合評価</option>
                <option value="skill">スキル重視</option>
                <option value="result">成果重視</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="name">部門名順</option>
                <option value="overall">総合スコア順</option>
                <option value="skill">スキルスコア順</option>
                <option value="result">成果スコア順</option>
                <option value="staff">人員数順</option>
                <option value="growth">成長率順</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-4">部門別スコア分布</h3>
              <div className="space-y-3">
                {sortedDepartments.map(dept => {
                  const overallScore = (dept.avgSkillScore + dept.avgResultScore) / 2;
                  const performance = getPerformanceLevel(overallScore);
                  return (
                    <div key={dept.id} className="bg-white p-4 rounded border">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <h4 className="font-medium">{dept.name}</h4>
                          <p className="text-sm text-gray-600">{dept.totalStaff}名</p>
                        </div>
                        <div className={`px-3 py-1 rounded text-sm ${performance.bg} ${performance.color}`}>
                          {performance.label}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600">スキル: </span>
                          <span className="font-medium">{dept.avgSkillScore}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">成果: </span>
                          <span className="font-medium">{dept.avgResultScore}</span>
                        </div>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${(overallScore / 100) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-4">象限分布比較</h3>
              <div className="space-y-4">
                {sortedDepartments.map(dept => (
                  <div key={dept.id} className="bg-white p-4 rounded border">
                    <h4 className="font-medium mb-2">{dept.name}</h4>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="bg-green-50 p-2 rounded">
                        <p className="text-xs text-gray-600">高高</p>
                        <p className="font-bold text-green-600">{dept.quadrantDistribution.highHigh}%</p>
                      </div>
                      <div className="bg-yellow-50 p-2 rounded">
                        <p className="text-xs text-gray-600">高低</p>
                        <p className="font-bold text-yellow-600">{dept.quadrantDistribution.highLow}%</p>
                      </div>
                      <div className="bg-blue-50 p-2 rounded">
                        <p className="text-xs text-gray-600">低高</p>
                        <p className="font-bold text-blue-600">{dept.quadrantDistribution.lowHigh}%</p>
                      </div>
                      <div className="bg-red-50 p-2 rounded">
                        <p className="text-xs text-gray-600">低低</p>
                        <p className="font-bold text-red-600">{dept.quadrantDistribution.lowLow}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-4">部門別詳細指標</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border rounded-lg">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-3 text-left text-sm font-medium">部門</th>
                    <th className="px-4 py-3 text-center text-sm font-medium">人員数</th>
                    <th className="px-4 py-3 text-center text-sm font-medium">スキル</th>
                    <th className="px-4 py-3 text-center text-sm font-medium">成果</th>
                    <th className="px-4 py-3 text-center text-sm font-medium">総合</th>
                    <th className="px-4 py-3 text-center text-sm font-medium">成長率</th>
                    <th className="px-4 py-3 text-center text-sm font-medium">離職率</th>
                    <th className="px-4 py-3 text-center text-sm font-medium">研修時間</th>
                    <th className="px-4 py-3 text-center text-sm font-medium">満足度</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedDepartments.map(dept => {
                    const overallScore = (dept.avgSkillScore + dept.avgResultScore) / 2;
                    return (
                      <tr key={dept.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{dept.name}</td>
                        <td className="px-4 py-3 text-center">{dept.totalStaff}</td>
                        <td className="px-4 py-3 text-center">{dept.avgSkillScore}</td>
                        <td className="px-4 py-3 text-center">{dept.avgResultScore}</td>
                        <td className="px-4 py-3 text-center font-medium">{overallScore.toFixed(1)}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={dept.growthRate >= 10 ? 'text-green-600' : ''}>
                            {dept.growthRate}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={dept.turnoverRate >= 15 ? 'text-red-600' : ''}>
                            {dept.turnoverRate}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">{dept.trainingHours}h</td>
                        <td className="px-4 py-3 text-center">{dept.satisfactionScore}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded border">
                <h4 className="font-medium mb-2">最高パフォーマンス部門</h4>
                <p className="text-lg font-bold text-green-600">
                  {sortedDepartments.reduce((best, dept) => 
                    ((dept.avgSkillScore + dept.avgResultScore) / 2) > ((best.avgSkillScore + best.avgResultScore) / 2) ? dept : best
                  ).name}
                </p>
              </div>
              <div className="bg-white p-4 rounded border">
                <h4 className="font-medium mb-2">最高成長率部門</h4>
                <p className="text-lg font-bold text-blue-600">
                  {sortedDepartments.reduce((best, dept) => 
                    dept.growthRate > best.growthRate ? dept : best
                  ).name}
                </p>
              </div>
              <div className="bg-white p-4 rounded border">
                <h4 className="font-medium mb-2">要改善優先部門</h4>
                <p className="text-lg font-bold text-red-600">
                  {sortedDepartments.reduce((worst, dept) => 
                    ((dept.avgSkillScore + dept.avgResultScore) / 2) < ((worst.avgSkillScore + worst.avgResultScore) / 2) ? dept : worst
                  ).name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ScrollToTopButton />
      <DashboardButton />
    </div>
  );
}