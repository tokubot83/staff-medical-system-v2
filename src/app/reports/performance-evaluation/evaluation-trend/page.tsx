'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import DashboardButton from '@/components/DashboardButton';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import { BackToReportsButton } from '@/components/BackToReportsButton';

interface TrendData {
  period: string;
  date: string;
  avgSkillScore: number;
  avgResultScore: number;
  totalStaff: number;
  newHires: number;
  departures: number;
  promotions: number;
  satisfaction: number;
  efficiency: number;
}

interface DepartmentTrend {
  department: string;
  data: TrendData[];
  color: string;
}

const mockTrendData: TrendData[] = [
  {
    period: '2024-01',
    date: '2024年1月',
    avgSkillScore: 75,
    avgResultScore: 78,
    totalStaff: 268,
    newHires: 8,
    departures: 5,
    promotions: 3,
    satisfaction: 72,
    efficiency: 78
  },
  {
    period: '2024-02',
    date: '2024年2月',
    avgSkillScore: 76,
    avgResultScore: 79,
    totalStaff: 271,
    newHires: 6,
    departures: 3,
    promotions: 2,
    satisfaction: 73,
    efficiency: 79
  },
  {
    period: '2024-03',
    date: '2024年3月',
    avgSkillScore: 77,
    avgResultScore: 80,
    totalStaff: 274,
    newHires: 7,
    departures: 4,
    promotions: 5,
    satisfaction: 75,
    efficiency: 81
  },
  {
    period: '2024-04',
    date: '2024年4月',
    avgSkillScore: 78,
    avgResultScore: 81,
    totalStaff: 278,
    newHires: 12,
    departures: 8,
    promotions: 4,
    satisfaction: 76,
    efficiency: 82
  },
  {
    period: '2024-05',
    date: '2024年5月',
    avgSkillScore: 79,
    avgResultScore: 82,
    totalStaff: 282,
    newHires: 9,
    departures: 5,
    promotions: 6,
    satisfaction: 78,
    efficiency: 84
  },
  {
    period: '2024-06',
    date: '2024年6月',
    avgSkillScore: 80,
    avgResultScore: 83,
    totalStaff: 286,
    newHires: 7,
    departures: 3,
    promotions: 8,
    satisfaction: 80,
    efficiency: 85
  }
];

const mockDepartmentTrends: DepartmentTrend[] = [
  {
    department: '看護部',
    color: '#3B82F6',
    data: [
      { period: '2024-01', date: '2024年1月', avgSkillScore: 76, avgResultScore: 80, totalStaff: 118, newHires: 3, departures: 2, promotions: 1, satisfaction: 70, efficiency: 76 },
      { period: '2024-02', date: '2024年2月', avgSkillScore: 77, avgResultScore: 81, totalStaff: 119, newHires: 2, departures: 1, promotions: 1, satisfaction: 72, efficiency: 77 },
      { period: '2024-03', date: '2024年3月', avgSkillScore: 78, avgResultScore: 82, totalStaff: 120, newHires: 3, departures: 2, promotions: 2, satisfaction: 74, efficiency: 78 },
      { period: '2024-04', date: '2024年4月', avgSkillScore: 78, avgResultScore: 82, totalStaff: 121, newHires: 4, departures: 3, promotions: 2, satisfaction: 75, efficiency: 79 },
      { period: '2024-05', date: '2024年5月', avgSkillScore: 79, avgResultScore: 83, totalStaff: 122, newHires: 3, departures: 2, promotions: 3, satisfaction: 77, efficiency: 80 },
      { period: '2024-06', date: '2024年6月', avgSkillScore: 78, avgResultScore: 82, totalStaff: 120, newHires: 2, departures: 4, promotions: 2, satisfaction: 78, efficiency: 78 }
    ]
  },
  {
    department: 'リハビリ部',
    color: '#10B981',
    data: [
      { period: '2024-01', date: '2024年1月', avgSkillScore: 83, avgResultScore: 81, totalStaff: 33, newHires: 1, departures: 0, promotions: 0, satisfaction: 82, efficiency: 88 },
      { period: '2024-02', date: '2024年2月', avgSkillScore: 84, avgResultScore: 82, totalStaff: 34, newHires: 1, departures: 0, promotions: 0, satisfaction: 83, efficiency: 89 },
      { period: '2024-03', date: '2024年3月', avgSkillScore: 85, avgResultScore: 83, totalStaff: 35, newHires: 1, departures: 0, promotions: 1, satisfaction: 84, efficiency: 90 },
      { period: '2024-04', date: '2024年4月', avgSkillScore: 85, avgResultScore: 83, totalStaff: 35, newHires: 2, departures: 2, promotions: 0, satisfaction: 85, efficiency: 91 },
      { period: '2024-05', date: '2024年5月', avgSkillScore: 86, avgResultScore: 84, totalStaff: 35, newHires: 1, departures: 1, promotions: 1, satisfaction: 85, efficiency: 92 },
      { period: '2024-06', date: '2024年6月', avgSkillScore: 85, avgResultScore: 83, totalStaff: 35, newHires: 1, departures: 1, promotions: 2, satisfaction: 85, efficiency: 92 }
    ]
  },
  {
    department: '介護部',
    color: '#F59E0B',
    data: [
      { period: '2024-01', date: '2024年1月', avgSkillScore: 70, avgResultScore: 76, totalStaff: 78, newHires: 3, departures: 2, promotions: 1, satisfaction: 68, efficiency: 72 },
      { period: '2024-02', date: '2024年2月', avgSkillScore: 71, avgResultScore: 77, totalStaff: 79, newHires: 2, departures: 1, promotions: 0, satisfaction: 69, efficiency: 73 },
      { period: '2024-03', date: '2024年3月', avgSkillScore: 72, avgResultScore: 78, totalStaff: 80, newHires: 2, departures: 1, promotions: 1, satisfaction: 71, efficiency: 75 },
      { period: '2024-04', date: '2024年4月', avgSkillScore: 72, avgResultScore: 78, totalStaff: 82, newHires: 4, departures: 2, promotions: 1, satisfaction: 72, efficiency: 76 },
      { period: '2024-05', date: '2024年5月', avgSkillScore: 73, avgResultScore: 79, totalStaff: 85, newHires: 4, departures: 1, promotions: 1, satisfaction: 74, efficiency: 78 },
      { period: '2024-06', date: '2024年6月', avgSkillScore: 72, avgResultScore: 78, totalStaff: 80, newHires: 2, departures: 7, promotions: 1, satisfaction: 72, efficiency: 78 }
    ]
  }
];

export default function EvaluationTrendPage() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [selectedMetric, setSelectedMetric] = useState<string>('skill');
  const [viewMode, setViewMode] = useState<'overall' | 'department'>('overall');
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>(['看護部', 'リハビリ部', '介護部']);

  const periods = ['all', '2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06'];
  const metrics = [
    { key: 'skill', label: 'スキルスコア' },
    { key: 'result', label: '成果スコア' },
    { key: 'satisfaction', label: '満足度' },
    { key: 'efficiency', label: '効率性' }
  ];

  const filteredData = selectedPeriod === 'all' ? mockTrendData : mockTrendData.filter(d => d.period === selectedPeriod);

  const calculateTrend = (data: TrendData[], metric: string) => {
    if (data.length < 2) return 0;
    const latest = data[data.length - 1];
    const previous = data[data.length - 2];
    
    let latestValue = 0;
    let previousValue = 0;
    
    switch (metric) {
      case 'skill':
        latestValue = latest.avgSkillScore;
        previousValue = previous.avgSkillScore;
        break;
      case 'result':
        latestValue = latest.avgResultScore;
        previousValue = previous.avgResultScore;
        break;
      case 'satisfaction':
        latestValue = latest.satisfaction;
        previousValue = previous.satisfaction;
        break;
      case 'efficiency':
        latestValue = latest.efficiency;
        previousValue = previous.efficiency;
        break;
    }
    
    return ((latestValue - previousValue) / previousValue * 100);
  };

  const toggleDepartment = (dept: string) => {
    if (selectedDepartments.includes(dept)) {
      setSelectedDepartments(selectedDepartments.filter(d => d !== dept));
    } else {
      setSelectedDepartments([...selectedDepartments, dept]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="評価トレンド分析" />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6 flex gap-4">
          <BackToReportsButton />
          <CategoryTopButton categoryPath="/reports/performance-evaluation" categoryName="人事評価分析" />
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">評価推移分析</h2>
            <div className="flex gap-2">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border rounded-lg"
              >
                {periods.map(period => (
                  <option key={period} value={period}>
                    {period === 'all' ? '全期間' : `${period.slice(5)}月`}
                  </option>
                ))}
              </select>
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
                onClick={() => setViewMode(viewMode === 'overall' ? 'department' : 'overall')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {viewMode === 'overall' ? '部門別表示' : '全体表示'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-600">平均スキルスコア</h3>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">{mockTrendData[mockTrendData.length - 1].avgSkillScore}</span>
                <span className={`text-sm ${calculateTrend(mockTrendData, 'skill') >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {calculateTrend(mockTrendData, 'skill') >= 0 ? '↗' : '↘'} {Math.abs(calculateTrend(mockTrendData, 'skill')).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-600">平均成果スコア</h3>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">{mockTrendData[mockTrendData.length - 1].avgResultScore}</span>
                <span className={`text-sm ${calculateTrend(mockTrendData, 'result') >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {calculateTrend(mockTrendData, 'result') >= 0 ? '↗' : '↘'} {Math.abs(calculateTrend(mockTrendData, 'result')).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-yellow-600">満足度</h3>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">{mockTrendData[mockTrendData.length - 1].satisfaction}</span>
                <span className={`text-sm ${calculateTrend(mockTrendData, 'satisfaction') >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {calculateTrend(mockTrendData, 'satisfaction') >= 0 ? '↗' : '↘'} {Math.abs(calculateTrend(mockTrendData, 'satisfaction')).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-purple-600">効率性</h3>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">{mockTrendData[mockTrendData.length - 1].efficiency}</span>
                <span className={`text-sm ${calculateTrend(mockTrendData, 'efficiency') >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {calculateTrend(mockTrendData, 'efficiency') >= 0 ? '↗' : '↘'} {Math.abs(calculateTrend(mockTrendData, 'efficiency')).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="relative h-[400px] border-2 border-gray-200 rounded-lg p-4">
              <h3 className="font-medium mb-3">
                {viewMode === 'overall' ? '全体トレンド' : '部門別トレンド'} - {metrics.find(m => m.key === selectedMetric)?.label}
              </h3>
              <svg width="100%" height="90%" viewBox="0 0 100 100">
                <line x1="10" y1="90" x2="90" y2="90" stroke="#ccc" strokeWidth="0.5" />
                <line x1="10" y1="10" x2="10" y2="90" stroke="#ccc" strokeWidth="0.5" />
                
                {mockTrendData.map((_, index) => (
                  <line
                    key={index}
                    x1={10 + (index * 13.33)}
                    y1="90"
                    x2={10 + (index * 13.33)}
                    y2="85"
                    stroke="#ccc"
                    strokeWidth="0.5"
                  />
                ))}
                
                {mockTrendData.map((point, index) => (
                  <text
                    key={index}
                    x={10 + (index * 13.33)}
                    y="95"
                    textAnchor="middle"
                    fontSize="2.5"
                    fill="#666"
                    transform={`rotate(-45 ${10 + (index * 13.33)} 95)`}
                  >
                    {point.period.slice(5)}月
                  </text>
                ))}

                {viewMode === 'overall' ? (
                  <>
                    {mockTrendData.map((point, index) => {
                      if (index === 0) return null;
                      const prevPoint = mockTrendData[index - 1];
                      const x1 = 10 + ((index - 1) * 13.33);
                      const x2 = 10 + (index * 13.33);
                      
                      let y1 = 0, y2 = 0;
                      switch (selectedMetric) {
                        case 'skill':
                          y1 = 90 - (prevPoint.avgSkillScore / 100 * 70);
                          y2 = 90 - (point.avgSkillScore / 100 * 70);
                          break;
                        case 'result':
                          y1 = 90 - (prevPoint.avgResultScore / 100 * 70);
                          y2 = 90 - (point.avgResultScore / 100 * 70);
                          break;
                        case 'satisfaction':
                          y1 = 90 - (prevPoint.satisfaction / 100 * 70);
                          y2 = 90 - (point.satisfaction / 100 * 70);
                          break;
                        case 'efficiency':
                          y1 = 90 - (prevPoint.efficiency / 100 * 70);
                          y2 = 90 - (point.efficiency / 100 * 70);
                          break;
                      }
                      
                      return (
                        <line
                          key={index}
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke="#3B82F6"
                          strokeWidth="2"
                        />
                      );
                    })}
                    
                    {mockTrendData.map((point, index) => {
                      let y = 0, value = 0;
                      switch (selectedMetric) {
                        case 'skill':
                          y = 90 - (point.avgSkillScore / 100 * 70);
                          value = point.avgSkillScore;
                          break;
                        case 'result':
                          y = 90 - (point.avgResultScore / 100 * 70);
                          value = point.avgResultScore;
                          break;
                        case 'satisfaction':
                          y = 90 - (point.satisfaction / 100 * 70);
                          value = point.satisfaction;
                          break;
                        case 'efficiency':
                          y = 90 - (point.efficiency / 100 * 70);
                          value = point.efficiency;
                          break;
                      }
                      
                      return (
                        <g key={index}>
                          <circle
                            cx={10 + (index * 13.33)}
                            cy={y}
                            r="2"
                            fill="#3B82F6"
                          />
                          <text
                            x={10 + (index * 13.33)}
                            y={y - 3}
                            textAnchor="middle"
                            fontSize="2.5"
                            fill="#333"
                          >
                            {value}
                          </text>
                        </g>
                      );
                    })}
                  </>
                ) : (
                  mockDepartmentTrends
                    .filter(dept => selectedDepartments.includes(dept.department))
                    .map(dept => (
                      <g key={dept.department}>
                        {dept.data.map((point, index) => {
                          if (index === 0) return null;
                          const prevPoint = dept.data[index - 1];
                          const x1 = 10 + ((index - 1) * 13.33);
                          const x2 = 10 + (index * 13.33);
                          
                          let y1 = 0, y2 = 0;
                          switch (selectedMetric) {
                            case 'skill':
                              y1 = 90 - (prevPoint.avgSkillScore / 100 * 70);
                              y2 = 90 - (point.avgSkillScore / 100 * 70);
                              break;
                            case 'result':
                              y1 = 90 - (prevPoint.avgResultScore / 100 * 70);
                              y2 = 90 - (point.avgResultScore / 100 * 70);
                              break;
                            case 'satisfaction':
                              y1 = 90 - (prevPoint.satisfaction / 100 * 70);
                              y2 = 90 - (point.satisfaction / 100 * 70);
                              break;
                            case 'efficiency':
                              y1 = 90 - (prevPoint.efficiency / 100 * 70);
                              y2 = 90 - (point.efficiency / 100 * 70);
                              break;
                          }
                          
                          return (
                            <line
                              key={`${dept.department}-${index}`}
                              x1={x1}
                              y1={y1}
                              x2={x2}
                              y2={y2}
                              stroke={dept.color}
                              strokeWidth="2"
                            />
                          );
                        })}
                        
                        {dept.data.map((point, index) => {
                          let y = 0;
                          switch (selectedMetric) {
                            case 'skill':
                              y = 90 - (point.avgSkillScore / 100 * 70);
                              break;
                            case 'result':
                              y = 90 - (point.avgResultScore / 100 * 70);
                              break;
                            case 'satisfaction':
                              y = 90 - (point.satisfaction / 100 * 70);
                              break;
                            case 'efficiency':
                              y = 90 - (point.efficiency / 100 * 70);
                              break;
                          }
                          
                          return (
                            <circle
                              key={`${dept.department}-point-${index}`}
                              cx={10 + (index * 13.33)}
                              cy={y}
                              r="2"
                              fill={dept.color}
                            />
                          );
                        })}
                      </g>
                    ))
                )}
              </svg>
            </div>

            <div className="space-y-4">
              {viewMode === 'department' && (
                <div>
                  <h3 className="font-medium mb-3">表示部門</h3>
                  {mockDepartmentTrends.map(dept => (
                    <label key={dept.department} className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={selectedDepartments.includes(dept.department)}
                        onChange={() => toggleDepartment(dept.department)}
                        className="w-4 h-4"
                      />
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: dept.color }}></div>
                      <span>{dept.department}</span>
                    </label>
                  ))}
                </div>
              )}

              <div>
                <h3 className="font-medium mb-3">月次変動データ</h3>
                <div className="overflow-x-auto max-h-[300px]">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-3 py-2 text-left">月</th>
                        <th className="px-3 py-2 text-center">入職</th>
                        <th className="px-3 py-2 text-center">退職</th>
                        <th className="px-3 py-2 text-center">昇進</th>
                        <th className="px-3 py-2 text-center">総人数</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockTrendData.map(data => (
                        <tr key={data.period} className="border-t">
                          <td className="px-3 py-2">{data.date.slice(5)}</td>
                          <td className="px-3 py-2 text-center text-green-600">+{data.newHires}</td>
                          <td className="px-3 py-2 text-center text-red-600">-{data.departures}</td>
                          <td className="px-3 py-2 text-center text-blue-600">+{data.promotions}</td>
                          <td className="px-3 py-2 text-center font-medium">{data.totalStaff}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">トレンド分析</h4>
                <ul className="text-sm space-y-1">
                  <li>• 平均スキルスコア: 6ヶ月で{mockTrendData[mockTrendData.length - 1].avgSkillScore - mockTrendData[0].avgSkillScore}ポイント上昇</li>
                  <li>• 職員満足度: 継続的な改善傾向</li>
                  <li>• 人員規模: {mockTrendData[mockTrendData.length - 1].totalStaff - mockTrendData[0].totalStaff}名の増員</li>
                  <li>• 効率性: 顕著な向上傾向</li>
                </ul>
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