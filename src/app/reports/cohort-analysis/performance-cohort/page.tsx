'use client';

import React, { Suspense, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CommonHeader from '@/components/CommonHeader';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import { exportToPDF } from '@/utils/pdfExport';
import { staffDatabase } from '@/app/data/staffData';
import {
  LineChart,
  Line,
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
  ScatterChart,
  Scatter,
  Cell
} from 'recharts';

interface PerformanceCohort {
  level: string;
  count: number;
  avgRetention: number;
  promotionRate: number;
  avgEngagement: number;
  avgSalary: number;
  turnoverRate: number;
  skillDevelopment: number;
}

function PerformanceCohortContent() {
  const searchParams = useSearchParams();
  const facilityParam = searchParams.get('facility') || '';
  const [selectedFacility, setSelectedFacility] = useState(facilityParam || '蜈ｨ譁ｽ險ｭ');
  const [selectedDepartment, setSelectedDepartment] = useState('蜈ｨ驛ｨ鄂ｲ');
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('current');

  // 繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ繝ｬ繝吶Ν縺ｮ螳夂ｾｩ
  const performanceLevels = ['繝医ャ繝励ヱ繝輔か繝ｼ繝槭・', '繝上う繝代ヵ繧ｩ繝ｼ繝槭・', '繧ｹ繧ｿ繝ｳ繝繝ｼ繝・, '繝九・繧ｺ謾ｹ蝟・];

  // 繧ｹ繧ｿ繝・ヵ繝・・繧ｿ縺九ｉ繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ繧ｳ繝帙・繝医ｒ逕滓・
  const performanceCohorts = useMemo(() => {
    const staffList = Object.values(staffDatabase).filter(staff => {
      if (selectedFacility !== '蜈ｨ譁ｽ險ｭ' && staff.facility !== selectedFacility) return false;
      if (selectedDepartment !== '蜈ｨ驛ｨ鄂ｲ' && staff.department !== selectedDepartment) return false;
      return true;
    });

    // 繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ繝ｬ繝吶Ν縺斐→縺ｫ繧ｰ繝ｫ繝ｼ繝怜喧
    const cohortGroups = performanceLevels.map(level => {
      let cohortStaff = staffList.filter(staff => {
        const rating = staff.evaluationData?.rating || staff.evaluationHistory?.[0]?.performance || 3.5;
        switch (level) {
          case '繝医ャ繝励ヱ繝輔か繝ｼ繝槭・': return rating >= 4.5;
          case '繝上う繝代ヵ繧ｩ繝ｼ繝槭・': return rating >= 3.8 && rating < 4.5;
          case '繧ｹ繧ｿ繝ｳ繝繝ｼ繝・: return rating >= 3.0 && rating < 3.8;
          case '繝九・繧ｺ謾ｹ蝟・: return rating < 3.0;
          default: return false;
        }
      });

      const count = cohortStaff.length;
      if (count === 0) return null;

      // 蜷・欠讓吶・險育ｮ・
      const avgRetention = cohortStaff.filter(s => !s.assignmentHistory?.some(h => h.reason === '騾閨ｷ')).length / count * 100;
      const promotionRate = cohortStaff.filter(s => s.assignmentHistory?.some(h => h.reason === '譏・ｲ')).length / count * 100;
      const avgEngagement = cohortStaff.reduce((sum, s) => sum + s.engagement, 0) / count;
      // Salary is calculated based on performance level (simulation)
      const avgSalary = level === '繝医ャ繝励ヱ繝輔か繝ｼ繝槭・' ? 500 : 
                       level === '繝上う繝代ヵ繧ｩ繝ｼ繝槭・' ? 450 : 
                       level === '繧ｹ繧ｿ繝ｳ繝繝ｼ繝・ ? 400 : 350;
      const turnoverRate = 100 - avgRetention;
      const skillDevelopment = cohortStaff.reduce((sum, s) => {
        const skills = s.skills?.length || 0;
        return sum + (skills > 0 ? 1 : 0);
      }, 0) / count * 100;

      return {
        level,
        count,
        avgRetention: Math.round(avgRetention),
        promotionRate: Math.round(promotionRate),
        avgEngagement: Math.round(avgEngagement),
        avgSalary: Math.round(avgSalary / 10000),
        turnoverRate: Math.round(turnoverRate),
        skillDevelopment: Math.round(skillDevelopment)
      };
    }).filter(Boolean) as PerformanceCohort[];

    return cohortGroups;
  }, [selectedFacility, selectedDepartment]);

  // 謌宣聞霆瑚ｷ｡繝・・繧ｿ・域凾邉ｻ蛻励〒縺ｮ繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ螟牙喧・・
  const growthTrajectoryData = useMemo(() => {
    const years = ['1蟷ｴ逶ｮ', '2蟷ｴ逶ｮ', '3蟷ｴ逶ｮ', '5蟷ｴ逶ｮ', '10蟷ｴ逶ｮ'];
    return years.map((year, index) => ({
      year,
      '繝医ャ繝励ヱ繝輔か繝ｼ繝槭・': 4.5 + index * 0.1,
      '繝上う繝代ヵ繧ｩ繝ｼ繝槭・': 3.8 + index * 0.15,
      '繧ｹ繧ｿ繝ｳ繝繝ｼ繝・: 3.0 + index * 0.1,
      '繝九・繧ｺ謾ｹ蝟・: 2.5 + index * 0.2
    }));
  }, []);

  // 繝ｬ繝ｼ繝繝ｼ繝√Ε繝ｼ繝育畑繝・・繧ｿ・医ヱ繝輔か繝ｼ繝槭Φ繧ｹ繝ｬ繝吶Ν蛻･迚ｹ諤ｧ・・
  const radarData = useMemo(() => {
    const metrics = ['螳夂捩邇・, '譏・ｲ邇・, '繧ｨ繝ｳ繧ｲ繝ｼ繧ｸ繝｡繝ｳ繝・, '繧ｹ繧ｭ繝ｫ髢狗匱', '邨ｦ荳取ｰｴ貅・];
    return metrics.map(metric => {
      const dataPoint: any = { metric };
      performanceCohorts.forEach(cohort => {
        switch (metric) {
          case '螳夂捩邇・: dataPoint[cohort.level] = cohort.avgRetention; break;
          case '譏・ｲ邇・: dataPoint[cohort.level] = cohort.promotionRate; break;
          case '繧ｨ繝ｳ繧ｲ繝ｼ繧ｸ繝｡繝ｳ繝・: dataPoint[cohort.level] = cohort.avgEngagement; break;
          case '繧ｹ繧ｭ繝ｫ髢狗匱': dataPoint[cohort.level] = cohort.skillDevelopment; break;
          case '邨ｦ荳取ｰｴ貅・: dataPoint[cohort.level] = cohort.avgSalary / 5; break;
        }
      });
      return dataPoint;
    });
  }, [performanceCohorts]);

  // 謨｣蟶・峙逕ｨ繝・・繧ｿ・医ヱ繝輔か繝ｼ繝槭Φ繧ｹ縺ｨ繧ｨ繝ｳ繧ｲ繝ｼ繧ｸ繝｡繝ｳ繝医・逶ｸ髢｢・・
  const scatterData = useMemo(() => {
    return Object.values(staffDatabase).map(staff => {
      const performance = staff.evaluationData?.rating || staff.evaluationHistory?.[0]?.performance || 3.5;
      return {
        x: performance,
        y: staff.engagement,
        z: staff.stressIndex,
        name: staff.name
      };
    });
  }, []);

  // 譁ｽ險ｭ繝ｪ繧ｹ繝医ｒ蜿門ｾ・
  const facilities = useMemo(() => {
    const facilitySet = new Set<string>();
    Object.values(staffDatabase).forEach(staff => {
      facilitySet.add(staff.facility);
    });
    return ['蜈ｨ譁ｽ險ｭ', ...Array.from(facilitySet).sort()];
  }, []);

  // 驛ｨ鄂ｲ繝ｪ繧ｹ繝医ｒ蜿門ｾ・
  const departments = useMemo(() => {
    const departmentSet = new Set<string>();
    Object.values(staffDatabase).forEach(staff => {
      departmentSet.add(staff.department);
    });
    return ['蜈ｨ驛ｨ鄂ｲ', ...Array.from(departmentSet).sort()];
  }, []);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ繧ｳ繝帙・繝亥・譫・ />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* 繝倥ャ繝繝ｼ */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold">繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ繧ｳ繝帙・繝亥・譫・/h1>
            <p className="text-gray-600 mt-2">
              繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ繝ｬ繝吶Ν蛻･縺ｫ閨ｷ蜩｡繧貞・鬘槭＠縲∝推鄒､縺ｮ迚ｹ諤ｧ繝ｻ謌宣聞霆瑚ｷ｡繝ｻ螳夂捩邇・ｒ蛻・梵
            </p>
            {facilityParam && (
              <p className="text-sm text-gray-500 mt-1">蟇ｾ雎｡譁ｽ險ｭ: {facilityParam}</p>
            )}
          </div>

          {/* 繝輔ぅ繝ｫ繧ｿ繝ｼ */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  譁ｽ險ｭ
                </label>
                <select
                  value={selectedFacility}
                  onChange={(e) => setSelectedFacility(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {facilities.map(facility => (
                    <option key={facility} value={facility}>{facility}</option>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {departments.map(department => (
                    <option key={department} value={department}>{department}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  陦ｨ遉ｺ譛滄俣
                </label>
                <select
                  value={selectedTimeFrame}
                  onChange={(e) => setSelectedTimeFrame(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="current">迴ｾ蝨ｨ</option>
                  <option value="yearly">蟷ｴ谺｡謗ｨ遘ｻ</option>
                  <option value="historical">驕主悉豈碑ｼ・/option>
                </select>
              </div>
            </div>
          </div>

          {/* 繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ繝ｬ繝吶Ν蛻･邨ｱ險・*/}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {performanceCohorts.map((cohort, index) => (
              <Card key={cohort.level}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{cohort.level}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">莠ｺ謨ｰ</span>
                      <span className="text-lg font-semibold">{cohort.count}蜷・/span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">螳夂捩邇・/span>
                      <span className={`text-lg font-semibold ${cohort.avgRetention >= 80 ? 'text-green-600' : 'text-amber-600'}`}>
                        {cohort.avgRetention}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">譏・ｲ邇・/span>
                      <span className="text-lg font-semibold text-blue-600">{cohort.promotionRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ繝ｬ繝吶Ν蛻･豈碑ｼ・*/}
          <Card>
            <CardHeader>
              <CardTitle>繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ繝ｬ繝吶Ν蛻･謖・ｨ呎ｯ碑ｼ・/CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceCohorts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="level" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="avgRetention" name="螳夂捩邇・%)" fill="#3B82F6" />
                    <Bar dataKey="avgEngagement" name="繧ｨ繝ｳ繧ｲ繝ｼ繧ｸ繝｡繝ｳ繝・%)" fill="#10B981" />
                    <Bar dataKey="promotionRate" name="譏・ｲ邇・%)" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 謌宣聞霆瑚ｷ｡蛻・梵 */}
          <Card>
            <CardHeader>
              <CardTitle>繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ繝ｬ繝吶Ν蛻･謌宣聞霆瑚ｷ｡</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={growthTrajectoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} />
                    <Tooltip />
                    <Legend />
                    {performanceLevels.map((level, index) => (
                      <Line
                        key={level}
                        type="monotone"
                        dataKey={level}
                        stroke={COLORS[index]}
                        strokeWidth={2}
                        dot={{ fill: COLORS[index], r: 6 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 繝ｬ繝ｼ繝繝ｼ繝√Ε繝ｼ繝・*/}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ繝ｬ繝吶Ν蛻･迚ｹ諤ｧ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      {performanceCohorts.map((cohort, index) => (
                        <Radar
                          key={cohort.level}
                          name={cohort.level}
                          dataKey={cohort.level}
                          stroke={COLORS[index]}
                          fill={COLORS[index]}
                          fillOpacity={0.3}
                        />
                      ))}
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* 謨｣蟶・峙 */}
            <Card>
              <CardHeader>
                <CardTitle>繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ vs 繧ｨ繝ｳ繧ｲ繝ｼ繧ｸ繝｡繝ｳ繝・/CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="x" 
                        domain={[0, 5]} 
                        label={{ value: '繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ隧穂ｾ｡', position: 'insideBottom', offset: -5 }}
                      />
                      <YAxis 
                        dataKey="y" 
                        domain={[0, 100]}
                        label={{ value: '繧ｨ繝ｳ繧ｲ繝ｼ繧ｸ繝｡繝ｳ繝・, angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Scatter name="閨ｷ蜩｡" data={scatterData} fill="#3B82F6">
                        {scatterData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.x >= 4.5 ? '#3B82F6' : entry.x >= 3.8 ? '#10B981' : entry.x >= 3.0 ? '#F59E0B' : '#EF4444'} 
                          />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 繧､繝ｳ繧ｵ繧､繝・*/}
          <Card>
            <CardHeader>
              <CardTitle>荳ｻ隕√う繝ｳ繧ｵ繧､繝・/CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold">繝医ャ繝励ヱ繝輔か繝ｼ繝槭・縺ｮ迚ｹ蠕ｴ</p>
                    <p className="text-sm text-gray-600">
                      螳夂捩邇・′蟷ｳ蝮・ｈ繧・0%鬮倥￥縲√お繝ｳ繧ｲ繝ｼ繧ｸ繝｡繝ｳ繝医ｂ鬮俶ｰｴ貅悶ｒ邯ｭ謖√・
                      邯咏ｶ夂噪縺ｪ繧ｹ繧ｭ繝ｫ髢狗匱縺ｨ譏・ｲ讖滉ｼ壹・謠蝉ｾ帙′驥崎ｦ√・
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold">謌宣聞蜿ｯ閭ｽ諤ｧ縺ｮ鬮倥＞螻､</p>
                    <p className="text-sm text-gray-600">
                      繧ｹ繧ｿ繝ｳ繝繝ｼ繝峨ヱ繝輔か繝ｼ繝槭・縺ｮ30%縺ｯ縲・←蛻・↑謾ｯ謠ｴ縺ｫ繧医ｊ
                      繝上う繝代ヵ繧ｩ繝ｼ繝槭・縺ｸ縺ｮ謌宣聞縺梧悄蠕・〒縺阪ｋ縲・
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold">謾ｹ蝟・′蠢・ｦ√↑鬆伜沺</p>
                    <p className="text-sm text-gray-600">
                      繝九・繧ｺ謾ｹ蝟・ｾ､縺ｮ髮｢閨ｷ邇・′鬮倥￥縲∵掠譛溘・莉句・縺ｨ蛟句挨謾ｯ謠ｴ繝励Ο繧ｰ繝ｩ繝縺ｮ
                      螳滓命縺梧耳螂ｨ縺輔ｌ繧九・
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 繧｢繧ｯ繧ｷ繝ｧ繝ｳ繝懊ち繝ｳ */}
          <div className="flex gap-4">
            <button 
              onClick={() => exportToPDF({
                title: '繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ繧ｳ繝帙・繝亥・譫舌Ξ繝昴・繝・,
                facility: selectedFacility,
                reportType: 'performance-cohort',
                elementId: 'report-content',
                dateRange: new Date().toLocaleDateString('ja-JP')
              })}
              className="pdf-exclude bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              PDF繝繧ｦ繝ｳ繝ｭ繝ｼ繝・
            </button>
          </div>

        </div>
      </div><CategoryTopButton categoryPath="/reports/cohort-analysis" categoryName="繧ｳ繝帙・繝亥・譫・ /></div>
  );
}

export default function PerformanceCohortPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PerformanceCohortContent />
    </Suspense>
  );
}