'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import DashboardButton from '@/components/DashboardButton';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import CategoryBackButton from '@/components/reports/CategoryBackButton';

interface DepartmentData {
  id: string;
  name: string;
  memberCount: number;
  avgSkillScore: number;
  avgResultScore: number;
  budget: number;
  efficiency: number;
  satisfaction: number;
  turnoverRate: number;
  monthlyTrend: { month: string; skill: number; result: number }[];
}

const mockDepartmentData: DepartmentData[] = [
  {
    id: '1',
    name: '看護部',
    memberCount: 120,
    avgSkillScore: 78,
    avgResultScore: 82,
    budget: 450000000,
    efficiency: 85,
    satisfaction: 78,
    turnoverRate: 12,
    monthlyTrend: [
      { month: '1月', skill: 76, result: 80 },
      { month: '2月', skill: 77, result: 81 },
      { month: '3月', skill: 78, result: 82 },
      { month: '4月', skill: 78, result: 82 },
      { month: '5月', skill: 79, result: 83 },
      { month: '6月', skill: 78, result: 82 }
    ]
  },
  {
    id: '2',
    name: 'リハビリ部',
    memberCount: 35,
    avgSkillScore: 85,
    avgResultScore: 83,
    budget: 120000000,
    efficiency: 92,
    satisfaction: 85,
    turnoverRate: 8,
    monthlyTrend: [
      { month: '1月', skill: 83, result: 81 },
      { month: '2月', skill: 84, result: 82 },
      { month: '3月', skill: 85, result: 83 },
      { month: '4月', skill: 85, result: 83 },
      { month: '5月', skill: 86, result: 84 },
      { month: '6月', skill: 85, result: 83 }
    ]
  },
  {
    id: '3',
    name: '介護部',
    memberCount: 80,
    avgSkillScore: 72,
    avgResultScore: 78,
    budget: 320000000,
    efficiency: 78,
    satisfaction: 72,
    turnoverRate: 18,
    monthlyTrend: [
      { month: '1月', skill: 70, result: 76 },
      { month: '2月', skill: 71, result: 77 },
      { month: '3月', skill: 72, result: 78 },
      { month: '4月', skill: 72, result: 78 },
      { month: '5月', skill: 73, result: 79 },
      { month: '6月', skill: 72, result: 78 }
    ]
  },
  {
    id: '4',
    name: '医事課',
    memberCount: 25,
    avgSkillScore: 74,
    avgResultScore: 71,
    budget: 80000000,
    efficiency: 82,
    satisfaction: 70,
    turnoverRate: 15,
    monthlyTrend: [
      { month: '1月', skill: 72, result: 69 },
      { month: '2月', skill: 73, result: 70 },
      { month: '3月', skill: 74, result: 71 },
      { month: '4月', skill: 74, result: 71 },
      { month: '5月', skill: 75, result: 72 },
      { month: '6月', skill: 74, result: 71 }
    ]
  },
  {
    id: '5',
    name: '栄養課',
    memberCount: 18,
    avgSkillScore: 80,
    avgResultScore: 85,
    budget: 60000000,
    efficiency: 88,
    satisfaction: 82,
    turnoverRate: 10,
    monthlyTrend: [
      { month: '1月', skill: 78, result: 83 },
      { month: '2月', skill: 79, result: 84 },
      { month: '3月', skill: 80, result: 85 },
      { month: '4月', skill: 80, result: 85 },
      { month: '5月', skill: 81, result: 86 },
      { month: '6月', skill: 80, result: 85 }
    ]
  }
];

export default function DepartmentComparisonPage() {
  const router = useRouter();
  const [selectedMetric, setSelectedMetric] = useState<string>('performance');
  const [compareDepartments, setCompareDepartments] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');

  const metrics = [
    { key: 'performance', label: '総合パフォーマンス', getValue: (dept: DepartmentData) => (dept.avgSkillScore + dept.avgResultScore) / 2 },
    { key: 'efficiency', label: '効率性', getValue: (dept: DepartmentData) => dept.efficiency },
    { key: 'satisfaction', label: '満足度', getValue: (dept: DepartmentData) => dept.satisfaction },
    { key: 'turnover', label: '離職率', getValue: (dept: DepartmentData) => dept.turnoverRate, reverse: true }
  ];

  const currentMetric = metrics.find(m => m.key === selectedMetric) || metrics[0];
  
  const sortedDepartments = [...mockDepartmentData].sort((a, b) => {
    const aValue = currentMetric.getValue(a);
    const bValue = currentMetric.getValue(b);
    return currentMetric.reverse ? aValue - bValue : bValue - aValue;
  });

  const handleDepartmentToggle = (deptId: string) => {
    if (compareDepartments.includes(deptId)) {
      setCompareDepartments(compareDepartments.filter(id => id !== deptId));
    } else if (compareDepartments.length < 3) {
      setCompareDepartments([...compareDepartments, deptId]);
    }
  };

  const getMetricColor = (value: number, metric: string) => {
    if (metric === 'turnover') {
      if (value <= 10) return 'text-green-600';
      if (value <= 15) return 'text-yellow-600';
      return 'text-red-600';
    } else {
      if (value >= 80) return 'text-green-600';
      if (value >= 70) return 'text-yellow-600';
      return 'text-red-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="部門間比較分析" />
      
      <div className="max-w-7xl mx-auto p-6">
        <CategoryBackButton />
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">部門パフォーマンス比較</h2>
            <div className="flex gap-2">
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-4 py-2 border rounded-lg"
              >
                {metrics.map(metric => (
                  <option key={metric.key} value={metric.key}>
                    {metric.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setViewMode(viewMode === 'table' ? 'chart' : 'table')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {viewMode === 'table' ? 'チャート表示' : 'テーブル表示'}
              </button>
            </div>
          </div>

          {viewMode === 'table' ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border rounded-lg">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium">順位</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">部門名</th>
                    <th className="px-4 py-3 text-center text-sm font-medium">人数</th>
                    <th className="px-4 py-3 text-center text-sm font-medium">スキル</th>
                    <th className="px-4 py-3 text-center text-sm font-medium">成果</th>
                    <th className="px-4 py-3 text-center text-sm font-medium">効率性</th>
                    <th className="px-4 py-3 text-center text-sm font-medium">満足度</th>
                    <th className="px-4 py-3 text-center text-sm font-medium">離職率(%)</th>
                    <th className="px-4 py-3 text-center text-sm font-medium">予算(千万円)</th>
                    <th className="px-4 py-3 text-center text-sm font-medium">比較</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedDepartments.map((dept, index) => (
                    <tr key={dept.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 text-center font-bold text-lg">{index + 1}</td>
                      <td className="px-4 py-3 font-medium">{dept.name}</td>
                      <td className="px-4 py-3 text-center">{dept.memberCount}</td>
                      <td className="px-4 py-3 text-center">{dept.avgSkillScore}</td>
                      <td className="px-4 py-3 text-center">{dept.avgResultScore}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={getMetricColor(dept.efficiency, 'efficiency')}>
                          {dept.efficiency}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={getMetricColor(dept.satisfaction, 'satisfaction')}>
                          {dept.satisfaction}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={getMetricColor(dept.turnoverRate, 'turnover')}>
                          {dept.turnoverRate}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">{Math.round(dept.budget / 10000000)}</td>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={compareDepartments.includes(dept.id)}
                          onChange={() => handleDepartmentToggle(dept.id)}
                          disabled={!compareDepartments.includes(dept.id) && compareDepartments.length >= 3}
                          className="w-4 h-4"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="relative h-[400px] border-2 border-gray-200 rounded-lg p-4">
              <h3 className="font-medium mb-3">{currentMetric.label}比較チャート</h3>
              <svg width="100%" height="90%" viewBox="0 0 100 100">
                <line x1="10" y1="90" x2="90" y2="90" stroke="#ccc" strokeWidth="0.5" />
                <line x1="10" y1="10" x2="10" y2="90" stroke="#ccc" strokeWidth="0.5" />
                
                {sortedDepartments.map((dept, index) => {
                  const value = currentMetric.getValue(dept);
                  const maxValue = Math.max(...sortedDepartments.map(d => currentMetric.getValue(d)));
                  const height = (value / maxValue) * 70;
                  const x = 15 + (index * 15);
                  
                  return (
                    <g key={dept.id}>
                      <rect
                        x={x}
                        y={90 - height}
                        width="10"
                        height={height}
                        fill={getMetricColor(value, selectedMetric).replace('text-', '')}
                        className="cursor-pointer hover:opacity-75"
                        onClick={() => handleDepartmentToggle(dept.id)}
                      />
                      <text
                        x={x + 5}
                        y={95}
                        textAnchor="middle"
                        fontSize="2.5"
                        fill="#333"
                        transform={`rotate(-45 ${x + 5} 95)`}
                      >
                        {dept.name}
                      </text>
                      <text
                        x={x + 5}
                        y={90 - height - 2}
                        textAnchor="middle"
                        fontSize="2.5"
                        fill="#333"
                      >
                        {Math.round(value)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          )}

          {compareDepartments.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-4">詳細比較 ({compareDepartments.length}部門選択中)</h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {compareDepartments.map(deptId => {
                  const dept = mockDepartmentData.find(d => d.id === deptId);
                  if (!dept) return null;
                  
                  return (
                    <div key={deptId} className="bg-gray-50 rounded-lg p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold text-lg">{dept.name}</h4>
                        <button
                          onClick={() => handleDepartmentToggle(deptId)}
                          className="text-red-600 hover:text-red-800"
                        >
                          ×
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>メンバー数:</span>
                          <span className="font-medium">{dept.memberCount}名</span>
                        </div>
                        <div className="flex justify-between">
                          <span>平均スキル:</span>
                          <span className="font-medium">{dept.avgSkillScore}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>平均成果:</span>
                          <span className="font-medium">{dept.avgResultScore}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>効率性:</span>
                          <span className={`font-medium ${getMetricColor(dept.efficiency, 'efficiency')}`}>
                            {dept.efficiency}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>満足度:</span>
                          <span className={`font-medium ${getMetricColor(dept.satisfaction, 'satisfaction')}`}>
                            {dept.satisfaction}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>離職率:</span>
                          <span className={`font-medium ${getMetricColor(dept.turnoverRate, 'turnover')}`}>
                            {dept.turnoverRate}%
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <h5 className="font-medium mb-2">6ヶ月トレンド</h5>
                        <div className="relative h-[100px]">
                          <svg width="100%" height="100%" viewBox="0 0 100 100">
                            <line x1="0" y1="90" x2="100" y2="90" stroke="#ccc" strokeWidth="1" />
                            <line x1="10" y1="0" x2="10" y2="90" stroke="#ccc" strokeWidth="1" />
                            
                            {dept.monthlyTrend.map((point, index) => {
                              if (index === 0) return null;
                              const prevPoint = dept.monthlyTrend[index - 1];
                              const x1 = 10 + ((index - 1) * 15);
                              const x2 = 10 + (index * 15);
                              const y1 = 90 - (prevPoint.skill / 100 * 80);
                              const y2 = 90 - (point.skill / 100 * 80);
                              
                              return (
                                <line
                                  key={`skill-${index}`}
                                  x1={x1}
                                  y1={y1}
                                  x2={x2}
                                  y2={y2}
                                  stroke="#3B82F6"
                                  strokeWidth="2"
                                />
                              );
                            })}
                            
                            {dept.monthlyTrend.map((point, index) => (
                              <circle
                                key={`skill-point-${index}`}
                                cx={10 + (index * 15)}
                                cy={90 - (point.skill / 100 * 80)}
                                r="2"
                                fill="#3B82F6"
                              />
                            ))}
                          </svg>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium mb-2">分析サマリー</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600">最高パフォーマンス部門</p>
                <p className="font-bold text-green-600">
                  {sortedDepartments[0]?.name} ({Math.round(currentMetric.getValue(sortedDepartments[0]))})
                </p>
              </div>
              <div>
                <p className="text-gray-600">総職員数</p>
                <p className="font-bold">{mockDepartmentData.reduce((sum, d) => sum + d.memberCount, 0)}名</p>
              </div>
              <div>
                <p className="text-gray-600">平均満足度</p>
                <p className="font-bold">{Math.round(mockDepartmentData.reduce((sum, d) => sum + d.satisfaction, 0) / mockDepartmentData.length)}</p>
              </div>
              <div>
                <p className="text-gray-600">全体離職率</p>
                <p className="font-bold">{Math.round(mockDepartmentData.reduce((sum, d) => sum + d.turnoverRate, 0) / mockDepartmentData.length)}%</p>
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