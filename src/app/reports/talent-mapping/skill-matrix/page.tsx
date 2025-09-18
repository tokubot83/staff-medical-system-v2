'use client';

import React, { Suspense, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CommonHeader from '@/components/CommonHeader';
import { CategoryTopButton } from '@/components/CategoryTopButton';
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
  
  // 繧ｹ繧ｿ繝・ヵ繝・・繧ｿ繧偵ヵ繧｣繝ｫ繧ｿ繝ｪ繝ｳ繧ｰ
  const filteredStaff = useMemo(() => {
    return Object.values(staffDatabase).filter(staff => {
      const facilityMatch = !facilityParam || staff.facility === facilityParam;
      const positionMatch = selectedPosition === 'all' || staff.position.includes(selectedPosition);
      const departmentMatch = selectedDepartment === 'all' || staff.department === selectedDepartment;
      return facilityMatch && positionMatch && departmentMatch;
    });
  }, [facilityParam, selectedPosition, selectedDepartment]);
  
  // 閨ｷ遞ｮ繝ｪ繧ｹ繝医ｒ蜿門ｾ・
  const positions = useMemo(() => {
    const posSet = new Set<string>();
    Object.values(staffDatabase).forEach(staff => {
      if (!facilityParam || staff.facility === facilityParam) {
        if (staff.position.includes('逵玖ｭｷ蟶ｫ') && !staff.position.includes('荳ｻ莉ｻ') && !staff.position.includes('蟶ｫ髟ｷ') && !staff.position.includes('驛ｨ髟ｷ')) {
          posSet.add('逵玖ｭｷ蟶ｫ');
        } else if (staff.position.includes('逵玖ｭｷ陬懷勧閠・) && !staff.position.includes('荳ｻ莉ｻ')) {
          posSet.add('逵玖ｭｷ陬懷勧閠・);
        } else if (staff.position.includes('莉玖ｭｷ螢ｫ') && !staff.position.includes('荳ｻ莉ｻ')) {
          posSet.add('莉玖ｭｷ螢ｫ');
        } else if (staff.position.includes('莉玖ｭｷ遖冗･牙｣ｫ') && !staff.position.includes('荳ｻ莉ｻ')) {
          posSet.add('莉玖ｭｷ遖冗･牙｣ｫ');
        } else if (staff.position.includes('逅・ｭｦ逋よｳ募｣ｫ') && !staff.position.includes('荳ｻ莉ｻ') && !staff.position.includes('遘鷹聞')) {
          posSet.add('逅・ｭｦ逋よｳ募｣ｫ');
        } else if (staff.position.includes('菴懈･ｭ逋よｳ募｣ｫ') && !staff.position.includes('荳ｻ莉ｻ')) {
          posSet.add('菴懈･ｭ逋よｳ募｣ｫ');
        }
      }
    });
    return Array.from(posSet).sort();
  }, [facilityParam]);
  
  // 驛ｨ鄂ｲ繝ｪ繧ｹ繝医ｒ蜿門ｾ・
  const departments = useMemo(() => {
    const deptSet = new Set<string>();
    Object.values(staffDatabase).forEach(staff => {
      if (!facilityParam || staff.facility === facilityParam) {
        deptSet.add(staff.department);
      }
    });
    return Array.from(deptSet).sort();
  }, [facilityParam]);
  
  // 繧ｹ繧ｭ繝ｫ髮・ｨ医ョ繝ｼ繧ｿ
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
  
  // 繧ｹ繧ｭ繝ｫ繝ｬ繝吶Ν蛻・ｸ・ョ繝ｼ繧ｿ
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
  
  // 遐比ｿｮ蜿苓ｬ帷憾豕・
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
      <CommonHeader title="繧ｹ繧ｭ繝ｫ繝槭ヨ繝ｪ繝・け繧ｹ" />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* 繝倥ャ繝繝ｼ */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">繧ｹ繧ｭ繝ｫ繝槭ヨ繝ｪ繝・け繧ｹ</h1>
                <p className="text-gray-600 mt-2">閨ｷ蜩｡縺ｮ繧ｹ繧ｭ繝ｫ繝ｻ雉・ｼ繝ｻ邨碁ｨ薙ｒ螟夊ｧ堤噪縺ｫ隧穂ｾ｡縺励∫ｵ・ｹ斐・蠑ｷ縺ｿ縺ｨ謾ｹ蝟・せ繧貞庄隕門喧</p>
                {facilityParam && (
                  <p className="text-sm text-gray-500 mt-1">蟇ｾ雎｡譁ｽ險ｭ: {facilityParam}</p>
                )}
              </div>
              <button
                onClick={() => exportToPDF({
                  title: '繧ｹ繧ｭ繝ｫ繝槭ヨ繝ｪ繝・け繧ｹ繝ｬ繝昴・繝・,
                  facility: facilityParam,
                  reportType: 'skill-matrix',
                  elementId: 'report-content',
                  dateRange: new Date().toLocaleDateString('ja-JP')
                })}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm pdf-exclude"
              >
                PDF繝繧ｦ繝ｳ繝ｭ繝ｼ繝・
              </button>
            </div>
          </div>

          {/* 繝輔ぅ繝ｫ繧ｿ繝ｼ */}
          <Card>
            <CardHeader>
              <CardTitle>繝輔ぅ繝ｫ繧ｿ繝ｼ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    閨ｷ遞ｮ
                  </label>
                  <select
                    value={selectedPosition}
                    onChange={(e) => setSelectedPosition(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">蜈ｨ閨ｷ遞ｮ</option>
                    {positions.map(pos => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    驛ｨ鄂ｲ
                  </label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">蜈ｨ驛ｨ鄂ｲ</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* 邨ｱ險域ュ蝣ｱ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-blue-600">{filteredStaff.length}</div>
                <p className="text-sm text-gray-600 mt-1">蟇ｾ雎｡閨ｷ蜩｡謨ｰ</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-green-600">{skillSummary.length}</div>
                <p className="text-sm text-gray-600 mt-1">隧穂ｾ｡繧ｹ繧ｭ繝ｫ鬆・岼</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(skillSummary.reduce((sum, s) => sum + s.averageLevel, 0) / skillSummary.length || 0)}
                </div>
                <p className="text-sm text-gray-600 mt-1">蟷ｳ蝮・せ繧ｭ繝ｫ繝ｬ繝吶Ν</p>
              </CardContent>
            </Card>
          </div>
          
          {/* 繧ｹ繧ｭ繝ｫ隧穂ｾ｡繝槭ヨ繝ｪ繝・け繧ｹ */}
          <Card>
            <CardHeader>
              <CardTitle>繧ｹ繧ｭ繝ｫ隧穂ｾ｡繝槭ヨ繝ｪ繝・け繧ｹ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        繧ｹ繧ｭ繝ｫ蜷・
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        蟇ｾ雎｡閠・焚
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        蟷ｳ蝮・Ξ繝吶Ν
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        繝ｬ繝吶Ν蛻・ｸ・
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
                          {skill.staffCount}莠ｺ
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
                                  title={`繝ｬ繝吶Ν${level}: ${count}莠ｺ`}
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
          
          {/* 遐比ｿｮ蜿苓ｬ帷憾豕・*/}
          <Card>
            <CardHeader>
              <CardTitle>遐比ｿｮ蜿苓ｬ帷憾豕・/CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trainingStats.map((stat, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900">{stat.category}</h4>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">蜿苓ｬ幄・焚</span>
                        <span className="font-medium">{stat.count}莠ｺ</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">蟷ｳ蝮・女隰帶凾髢・/span>
                        <span className="font-medium">{stat.averageHours}譎る俣</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">雉・ｼ蜿門ｾ礼紫</span>
                        <span className="font-medium">{stat.certificateRate}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* 繧ｹ繧ｭ繝ｫ繧ｮ繝｣繝・・蛻・梵 */}
          <Card>
            <CardHeader>
              <CardTitle>繧ｹ繧ｭ繝ｫ繧ｮ繝｣繝・・蛻・梵</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  逶ｮ讓吶Ξ繝吶Ν4莉･荳翫↓蟇ｾ縺吶ｋ驕疲・迥ｶ豕・
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
                          {gap > 0 ? `繧ｮ繝｣繝・・: -${gap.toFixed(1)}` : '驕疲・'}
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
      </div><CategoryTopButton categoryPath="/reports/talent-mapping" categoryName="繧ｿ繝ｬ繝ｳ繝医・繝・ヴ繝ｳ繧ｰ" /></div>
  );
}

export default function SkillMatrixPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SkillMatrixContent />
    </Suspense>
  );
}