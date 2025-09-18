'use client';

import React, { Suspense, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import BreadcrumbBar from '@/components/navigation/BreadcrumbBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { exportToPDF } from '@/utils/pdfExport';
import { staffDatabase } from '@/app/data/staffData';
import { Bar, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler
);

function SkillMatrixContent() {
  const searchParams = useSearchParams();
  const facilityParam = searchParams.get('facility') || '';
  const [selectedPosition, setSelectedPosition] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  
  // スタッフデータをフィルタリング
  const filteredStaff = useMemo(() => {
    return Object.values(staffDatabase).filter(staff => {
      const facilityMatch = !facilityParam || staff.facility === facilityParam;
      const positionMatch = selectedPosition === 'all' || staff.position.includes(selectedPosition);
      const departmentMatch = selectedDepartment === 'all' || staff.department === selectedDepartment;
      return facilityMatch && positionMatch && departmentMatch;
    });
  }, [facilityParam, selectedPosition, selectedDepartment]);
  
  // 職種リストを取得
  const positions = useMemo(() => {
    const posSet = new Set<string>();
    Object.values(staffDatabase).forEach(staff => {
      if (!facilityParam || staff.facility === facilityParam) {
        if (staff.position.includes('看護師') && !staff.position.includes('主任') && !staff.position.includes('師長') && !staff.position.includes('部長')) {
          posSet.add('看護師');
        } else if (staff.position.includes('看護補助者') && !staff.position.includes('主任')) {
          posSet.add('看護補助者');
        } else if (staff.position.includes('介護士') && !staff.position.includes('主任')) {
          posSet.add('介護士');
        } else if (staff.position.includes('介護福祉士') && !staff.position.includes('主任')) {
          posSet.add('介護福祉士');
        } else if (staff.position.includes('理学療法士') && !staff.position.includes('主任') && !staff.position.includes('科長')) {
          posSet.add('理学療法士');
        } else if (staff.position.includes('作業療法士') && !staff.position.includes('主任')) {
          posSet.add('作業療法士');
        }
      }
    });
    return Array.from(posSet).sort();
  }, [facilityParam]);
  
  // 部署リストを取得
  const departments = useMemo(() => {
    const deptSet = new Set<string>();
    Object.values(staffDatabase).forEach(staff => {
      if (!facilityParam || staff.facility === facilityParam) {
        deptSet.add(staff.department);
      }
    });
    return Array.from(deptSet).sort();
  }, [facilityParam]);
  
  // スキル集計データ
  const skillSummary = useMemo(() => {
    const skillData: Record<string, { total: number, count: number, staffIds: string[] }> = {};
    
    filteredStaff.forEach(staff => {
      staff.skills.forEach(skill => {
        if (!skillData[skill.name]) {
          skillData[skill.name] = { total: 0, count: 0, staffIds: [] };
        }
        skillData[skill.name].total += skill.level;
        skillData[skill.name].count += 1;
        skillData[skill.name].staffIds.push(staff.id);
      });
    });
    
    return Object.entries(skillData)
      .map(([name, data]) => ({
        skillName: name,
        averageLevel: Math.round(data.total / data.count),
        staffCount: data.count,
        staffIds: data.staffIds
      }))
      .sort((a, b) => b.averageLevel - a.averageLevel);
  }, [filteredStaff]);
  
  // スキルレベル分布データ
  const skillLevelDistribution = useMemo(() => {
    const distribution: Record<string, number[]> = {};
    const levels = [1, 2, 3, 4, 5];
    
    skillSummary.forEach(skill => {
      distribution[skill.skillName] = levels.map(level => {
        return filteredStaff.filter(staff => 
          staff.skills.some(s => s.name === skill.skillName && s.level === level)
        ).length;
      });
    });
    
    return distribution;
  }, [filteredStaff, skillSummary]);
  
  // 研修受講状況
  const trainingStats = useMemo(() => {
    const stats: Record<string, { count: number, totalHours: number, certificates: number }> = {};
    
    filteredStaff.forEach(staff => {
      if (staff.trainingHistory) {
        staff.trainingHistory.forEach(training => {
          if (!stats[training.category]) {
            stats[training.category] = { count: 0, totalHours: 0, certificates: 0 };
          }
          stats[training.category].count += 1;
          stats[training.category].totalHours += training.hours;
          if (training.certificate) {
            stats[training.category].certificates += 1;
          }
        });
      }
    });
    
    return Object.entries(stats)
      .map(([category, data]) => ({
        category,
        count: data.count,
        averageHours: Math.round(data.totalHours / data.count),
        certificateRate: Math.round((data.certificates / data.count) * 100)
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredStaff]);

  return (
    <div className="min-h-screen bg-gray-50">
      <BreadcrumbBar />
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">スキルマトリックス</h1>
                <p className="text-gray-600 mt-2">職員のスキル・資格・経験を多角的に評価し、組織の強みと改善点を可視化</p>
                {facilityParam && (
                  <p className="text-sm text-gray-500 mt-1">対象施設: {facilityParam}</p>
                )}
              </div>
              <button
                onClick={() => exportToPDF({
                  title: 'スキルマトリックスレポート',
                  facility: facilityParam,
                  reportType: 'skill-matrix',
                  elementId: 'report-content',
                  dateRange: new Date().toLocaleDateString('ja-JP')
                })}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm pdf-exclude"
              >
                PDFダウンロード
              </button>
            </div>
          </div>

          {/* フィルター */}
          <Card>
            <CardHeader>
              <CardTitle>フィルター</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    職種
                  </label>
                  <select
                    value={selectedPosition}
                    onChange={(e) => setSelectedPosition(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">全職種</option>
                    {positions.map(pos => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    部署
                  </label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">全部署</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* 統計情報 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-blue-600">{filteredStaff.length}</div>
                <p className="text-sm text-gray-600 mt-1">対象職員数</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-green-600">{skillSummary.length}</div>
                <p className="text-sm text-gray-600 mt-1">評価スキル項目</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(skillSummary.reduce((sum, s) => sum + s.averageLevel, 0) / skillSummary.length || 0)}
                </div>
                <p className="text-sm text-gray-600 mt-1">平均スキルレベル</p>
              </CardContent>
            </Card>
          </div>
          
          {/* スキル評価マトリックス */}
          <Card>
            <CardHeader>
              <CardTitle>スキル評価マトリックス</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        スキル名
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        対象者数
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        平均レベル
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        レベル分布
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {skillSummary.slice(0, 10).map((skill, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {skill.skillName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {skill.staffCount}人
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900 mr-2">
                              {skill.averageLevel}
                            </span>
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${(skill.averageLevel / 5) * 100}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map(level => {
                              const count = skillLevelDistribution[skill.skillName]?.[level - 1] || 0;
                              return (
                                <div
                                  key={level}
                                  className="flex flex-col items-center"
                                  title={`レベル${level}: ${count}人`}
                                >
                                  <div
                                    className="w-8 bg-blue-100 rounded-t"
                                    style={{
                                      height: `${Math.max(5, (count / skill.staffCount) * 50)}px`,
                                      backgroundColor: `rgba(59, 130, 246, ${0.2 + (level - 1) * 0.2})`
                                    }}
                                  />
                                  <span className="text-xs text-gray-500 mt-1">{level}</span>
                                </div>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          {/* 研修受講状況 */}
          <Card>
            <CardHeader>
              <CardTitle>研修受講状況</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trainingStats.map((stat, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900">{stat.category}</h4>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">受講者数</span>
                        <span className="font-medium">{stat.count}人</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">平均受講時間</span>
                        <span className="font-medium">{stat.averageHours}時間</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">資格取得率</span>
                        <span className="font-medium">{stat.certificateRate}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* スキルギャップ分析 */}
          <Card>
            <CardHeader>
              <CardTitle>スキルギャップ分析</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  目標レベル4以上に対する達成状況
                </p>
                {skillSummary.slice(0, 8).map((skill, index) => {
                  const gap = 4 - skill.averageLevel;
                  const achievementRate = Math.min(100, (skill.averageLevel / 4) * 100);
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          {skill.skillName}
                        </span>
                        <span className="text-sm text-gray-500">
                          {gap > 0 ? `ギャップ: -${gap.toFixed(1)}` : '達成'}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            achievementRate >= 100 ? 'bg-green-600' : 'bg-yellow-600'
                          }`}
                          style={{ width: `${achievementRate}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

        </div>
      </div></div>
  );
}

export default function SkillMatrixPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SkillMatrixContent />
    </Suspense>
  );
}