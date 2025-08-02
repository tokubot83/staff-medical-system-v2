'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import DashboardButton from '@/components/DashboardButton';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import { BackToReportsButton } from '@/components/BackToReportsButton';

interface StaffPerformance {
  id: string;
  name: string;
  department: string;
  position: string;
  skillScore: number;
  resultScore: number;
  previousSkillScore?: number;
  previousResultScore?: number;
  trend: 'improving' | 'stable' | 'declining';
}

const mockStaffData: StaffPerformance[] = [
  { id: '1', name: '山田太郎', department: '看護部', position: '看護師長', skillScore: 85, resultScore: 90, previousSkillScore: 80, previousResultScore: 85, trend: 'improving' },
  { id: '2', name: '佐藤花子', department: '看護部', position: '看護師', skillScore: 70, resultScore: 75, trend: 'stable' },
  { id: '3', name: '鈴木一郎', department: 'リハビリ部', position: '理学療法士', skillScore: 90, resultScore: 85, trend: 'stable' },
  { id: '4', name: '田中美咲', department: '介護部', position: '介護士', skillScore: 60, resultScore: 80, trend: 'improving' },
  { id: '5', name: '伊藤健', department: '医事課', position: '主任', skillScore: 75, resultScore: 70, trend: 'declining' },
  { id: '6', name: '渡辺梨香', department: '栄養課', position: '管理栄養士', skillScore: 85, resultScore: 88, trend: 'stable' },
  { id: '7', name: '高橋勇', department: '看護部', position: '看護師', skillScore: 55, resultScore: 60, trend: 'improving' },
  { id: '8', name: '小林由美', department: '介護部', position: '介護福祉士', skillScore: 80, resultScore: 82, trend: 'stable' },
];

export default function PerformanceMatrixPage() {
  const router = useRouter();
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedQuadrant, setSelectedQuadrant] = useState<string | null>(null);

  const departments = ['all', '看護部', 'リハビリ部', '介護部', '医事課', '栄養課'];

  const filteredStaff = mockStaffData.filter(staff => 
    selectedDepartment === 'all' || staff.department === selectedDepartment
  );

  const getQuadrant = (skillScore: number, resultScore: number): string => {
    if (skillScore >= 75 && resultScore >= 75) return 'high-high';
    if (skillScore >= 75 && resultScore < 75) return 'high-low';
    if (skillScore < 75 && resultScore >= 75) return 'low-high';
    return 'low-low';
  };

  const quadrantInfo: Record<string, { label: string; color: string; bgColor: string; icon: string }> = {
    'high-high': { label: 'ハイパフォーマー', color: 'text-green-600', bgColor: 'bg-green-50', icon: '⭐' },
    'high-low': { label: '要活性化', color: 'text-yellow-600', bgColor: 'bg-yellow-50', icon: '⚡' },
    'low-high': { label: '潜在力あり', color: 'text-blue-600', bgColor: 'bg-blue-50', icon: '🌱' },
    'low-low': { label: '要育成', color: 'text-red-600', bgColor: 'bg-red-50', icon: '📚' }
  };

  const quadrantCounts = filteredStaff.reduce((acc, staff) => {
    const quadrant = getQuadrant(staff.skillScore, staff.resultScore);
    acc[quadrant] = (acc[quadrant] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="パフォーマンスマトリクス" />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6 flex gap-4">
          <BackToReportsButton />
          <CategoryTopButton categoryPath="/reports/performance-evaluation" categoryName="人事評価分析" />
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">個人評価マトリクス</h2>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept === 'all' ? '全部門' : dept}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="relative h-[500px] border-2 border-gray-200 rounded-lg">
                <div className="absolute inset-0 p-4">
                  <svg width="100%" height="100%" viewBox="0 0 100 100">
                    <line x1="50" y1="0" x2="50" y2="100" stroke="#ccc" strokeWidth="0.5" />
                    <line x1="0" y1="50" x2="100" y2="50" stroke="#ccc" strokeWidth="0.5" />
                    
                    <text x="98" y="98" textAnchor="end" fontSize="3" fill="#666">高</text>
                    <text x="2" y="98" textAnchor="start" fontSize="3" fill="#666">低</text>
                    <text x="50" y="98" textAnchor="middle" fontSize="3" fill="#666">スキルレベル</text>
                    
                    <text x="2" y="4" textAnchor="start" fontSize="3" fill="#666">高</text>
                    <text x="2" y="98" textAnchor="start" fontSize="3" fill="#666" transform="rotate(-90 2 50)">低</text>
                    <text x="2" y="50" textAnchor="middle" fontSize="3" fill="#666" transform="rotate(-90 2 50)">成果・業績</text>

                    {filteredStaff.map(staff => {
                      const quadrant = getQuadrant(staff.skillScore, staff.resultScore);
                      const isSelected = selectedQuadrant === null || selectedQuadrant === quadrant;
                      return (
                        <g key={staff.id} opacity={isSelected ? 1 : 0.3}>
                          <circle
                            cx={staff.skillScore}
                            cy={100 - staff.resultScore}
                            r="2"
                            fill={quadrantInfo[quadrant].color.replace('text-', '')}
                            className="cursor-pointer hover:r-3 transition-all"
                            onClick={() => router.push(`/staff/${staff.id}`)}
                          />
                          {staff.previousSkillScore && staff.previousResultScore && (
                            <line
                              x1={staff.previousSkillScore}
                              y1={100 - staff.previousResultScore}
                              x2={staff.skillScore}
                              y2={100 - staff.resultScore}
                              stroke={quadrantInfo[quadrant].color.replace('text-', '')}
                              strokeWidth="0.5"
                              strokeDasharray="2,2"
                              opacity="0.5"
                            />
                          )}
                          <text
                            x={staff.skillScore}
                            y={100 - staff.resultScore - 3}
                            textAnchor="middle"
                            fontSize="2.5"
                            fill="#333"
                          >
                            {staff.name}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                <div className="absolute top-4 left-4 bg-green-50 text-green-700 px-3 py-1 rounded text-sm">
                  ハイパフォーマー
                </div>
                <div className="absolute top-4 right-4 bg-yellow-50 text-yellow-700 px-3 py-1 rounded text-sm">
                  要活性化
                </div>
                <div className="absolute bottom-4 left-4 bg-red-50 text-red-700 px-3 py-1 rounded text-sm">
                  要育成
                </div>
                <div className="absolute bottom-4 right-4 bg-blue-50 text-blue-700 px-3 py-1 rounded text-sm">
                  潜在力あり
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-3">象限別分布</h3>
              {Object.entries(quadrantInfo).map(([key, info]) => (
                <div
                  key={key}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedQuadrant === key ? 'ring-2 ring-offset-2' : ''
                  } ${info.bgColor}`}
                  onClick={() => setSelectedQuadrant(selectedQuadrant === key ? null : key)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{info.icon}</span>
                      <span className={`font-medium ${info.color}`}>{info.label}</span>
                    </div>
                    <span className="text-2xl font-bold">{quadrantCounts[key] || 0}</span>
                  </div>
                </div>
              ))}

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">分析サマリー</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 総評価対象: {filteredStaff.length}名</li>
                  <li>• 平均スキルスコア: {Math.round(filteredStaff.reduce((sum, s) => sum + s.skillScore, 0) / filteredStaff.length)}</li>
                  <li>• 平均成果スコア: {Math.round(filteredStaff.reduce((sum, s) => sum + s.resultScore, 0) / filteredStaff.length)}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-3">職員詳細</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border rounded-lg">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium">氏名</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">部門</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">役職</th>
                    <th className="px-4 py-3 text-center text-sm font-medium">スキル</th>
                    <th className="px-4 py-3 text-center text-sm font-medium">成果</th>
                    <th className="px-4 py-3 text-center text-sm font-medium">象限</th>
                    <th className="px-4 py-3 text-center text-sm font-medium">トレンド</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff
                    .filter(staff => selectedQuadrant === null || getQuadrant(staff.skillScore, staff.resultScore) === selectedQuadrant)
                    .map(staff => {
                      const quadrant = getQuadrant(staff.skillScore, staff.resultScore);
                      return (
                        <tr key={staff.id} className="border-t hover:bg-gray-50 cursor-pointer" onClick={() => router.push(`/staff/${staff.id}`)}>
                          <td className="px-4 py-3">{staff.name}</td>
                          <td className="px-4 py-3">{staff.department}</td>
                          <td className="px-4 py-3">{staff.position}</td>
                          <td className="px-4 py-3 text-center">{staff.skillScore}</td>
                          <td className="px-4 py-3 text-center">{staff.resultScore}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-2 py-1 rounded text-xs ${quadrantInfo[quadrant].bgColor} ${quadrantInfo[quadrant].color}`}>
                              {quadrantInfo[quadrant].label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`text-sm ${
                              staff.trend === 'improving' ? 'text-green-600' : 
                              staff.trend === 'declining' ? 'text-red-600' : 
                              'text-gray-600'
                            }`}>
                              {staff.trend === 'improving' ? '↑' : staff.trend === 'declining' ? '↓' : '→'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <ScrollToTopButton />
      <DashboardButton />
    </div>
  );
}