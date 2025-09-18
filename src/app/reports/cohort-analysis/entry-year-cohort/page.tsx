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
  RadialBarChart,
  RadialBar,
  Cell
} from 'recharts';

interface CohortData {
  year: string;
  totalCount: number;
  currentCount: number;
  retentionRate: number;
  avgPerformance: number;
  avgEngagement: number;
  turnoverCount: number;
  riskScore: number;
}

function EntryYearCohortContent() {
  const searchParams = useSearchParams();
  const facilityParam = searchParams.get('facility') || '';
  const [selectedFacility, setSelectedFacility] = useState(facilityParam || '蜈ｨ譁ｽ險ｭ');
  const [selectedPosition, setSelectedPosition] = useState('蜈ｨ閨ｷ遞ｮ');
  const [selectedTimeRange, setSelectedTimeRange] = useState('all');

  // 繧ｹ繧ｿ繝・ヵ繝・・繧ｿ縺九ｉ蜈･遉ｾ蟷ｴ谺｡蛻･繧ｳ繝帙・繝医ョ繝ｼ繧ｿ繧堤函謌・  const cohortData = useMemo(() => {
    const staffList = Object.values(staffDatabase).filter(staff => {
      if (selectedFacility !== '蜈ｨ譁ｽ險ｭ' && staff.facility !== selectedFacility) return false;
      if (selectedPosition !== '蜈ｨ閨ｷ遞ｮ') {
        const basePosition = staff.position.replace(/荳ｻ莉ｻ|蟶ｫ髟ｷ|驛ｨ髟ｷ|遘鷹聞/, '').trim();
        if (basePosition !== selectedPosition) return false;
      }
      return true;
    });

    // 蜈･遉ｾ蟷ｴ蛻･縺ｫ繧ｰ繝ｫ繝ｼ繝怜喧
    const yearGroups = staffList.reduce((acc, staff) => {
      const joinYear = staff.joinDate.match(/(\d{4})蟷ｴ/)?.[1] || '荳肴・';
      if (!acc[joinYear]) {
        acc[joinYear] = [];
      }
      acc[joinYear].push(staff);
      return acc;
    }, {} as Record<string, typeof staffList>);

    // 蜷・ｹｴ谺｡縺ｮ繧ｳ繝帙・繝医ョ繝ｼ繧ｿ繧定ｨ育ｮ・    const cohortData: CohortData[] = Object.entries(yearGroups)
      .filter(([year]) => year !== '荳肴・')
      .map(([year, staffGroup]) => {
        const totalCount = staffGroup.length;
        // 迴ｾ蝨ｨ繧ょ惠邀阪＠縺ｦ縺・ｋ閨ｷ蜩｡・磯屬閨ｷ縺励※縺・↑縺・ｼ・        const currentCount = staffGroup.filter(s => !s.assignmentHistory?.some(h => h.reason === '騾閨ｷ')).length;
        const retentionRate = Math.round((currentCount / totalCount) * 100);
        
        // 繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ縺ｨ繧ｨ繝ｳ繧ｲ繝ｼ繧ｸ繝｡繝ｳ繝医・蟷ｳ蝮・        const avgPerformance = staffGroup.reduce((sum, s) => {
          const rating = s.evaluationData?.rating || s.evaluationHistory?.[0]?.performance || 3.5;
          return sum + rating;
        }, 0) / totalCount;
        
        const avgEngagement = staffGroup.reduce((sum, s) => sum + s.engagement, 0) / totalCount;
        
        // 髮｢閨ｷ繝ｪ繧ｹ繧ｯ繧ｹ繧ｳ繧｢・医せ繝医Ξ繧ｹ謖・焚縲∵ｮ区･ｭ譎る俣縲∵怏邨ｦ蜿門ｾ礼紫縺九ｉ險育ｮ暦ｼ・        const riskScore = staffGroup.reduce((sum, s) => {
          const stress = s.stressIndex / 100;
          const overtime = Math.min(s.overtime / 50, 1);
          const paidLeave = 1 - (s.paidLeaveRate / 100);
          return sum + ((stress + overtime + paidLeave) / 3);
        }, 0) / totalCount * 100;

        return {
          year,
          totalCount,
          currentCount,
          retentionRate,
          avgPerformance: Number(avgPerformance.toFixed(2)),
          avgEngagement: Math.round(avgEngagement),
          turnoverCount: totalCount - currentCount,
          riskScore: Math.round(riskScore)
        };
      })
      .sort((a, b) => Number(a.year) - Number(b.year));

    // 譎る俣遽・峇縺ｧ繝輔ぅ繝ｫ繧ｿ繝ｪ繝ｳ繧ｰ
    if (selectedTimeRange === 'recent5') {
      const currentYear = new Date().getFullYear();
      return cohortData.filter(d => Number(d.year) >= currentYear - 5);
    } else if (selectedTimeRange === 'recent3') {
      const currentYear = new Date().getFullYear();
      return cohortData.filter(d => Number(d.year) >= currentYear - 3);
    }
    
    return cohortData;
  }, [selectedFacility, selectedPosition, selectedTimeRange]);

  // 邏ｯ遨榊ｮ夂捩邇・ョ繝ｼ繧ｿ・域凾邉ｻ蛻励〒蜷・ｹｴ谺｡繧ｳ繝帙・繝医・螳夂捩邇・耳遘ｻ繧定｡ｨ遉ｺ・・  const retentionTrendData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = [1, 2, 3, 5, 10]; // 蜈･遉ｾ蠕後・邨碁℃蟷ｴ謨ｰ
    
    return years.map(elapsed => {
      const dataPoint: any = { year: `${elapsed}蟷ｴ蠕形 };
      
      cohortData.forEach(cohort => {
        const cohortYear = Number(cohort.year);
        if (currentYear - cohortYear >= elapsed) {
          // 邁｡譏鍋噪縺ｪ螳夂捩邇・ｸ幄｡ｰ繝｢繝・Ν・亥ｮ滄圀縺ｯ繧医ｊ隍・尅縺ｪ險育ｮ励′蠢・ｦ・ｼ・          const baseRetention = cohort.retentionRate;
          const decayRate = 0.05; // 蟷ｴ髢・%縺ｮ貂帛ｰ・          const retention = baseRetention * Math.pow(1 - decayRate, elapsed);
          dataPoint[cohort.year] = Math.round(retention);
        }
      });
      
      return dataPoint;
    });
  }, [cohortData]);

  // 閨ｷ遞ｮ繝ｪ繧ｹ繝医ｒ蜿門ｾ・  const positions = useMemo(() => {
    const positionSet = new Set<string>();
    Object.values(staffDatabase).forEach(staff => {
      const basePosition = staff.position.replace(/荳ｻ莉ｻ|蟶ｫ髟ｷ|驛ｨ髟ｷ|遘鷹聞/, '').trim();
      positionSet.add(basePosition);
    });
    return ['蜈ｨ閨ｷ遞ｮ', ...Array.from(positionSet).sort()];
  }, []);

  // 譁ｽ險ｭ繝ｪ繧ｹ繝医ｒ蜿門ｾ・  const facilities = useMemo(() => {
    const facilitySet = new Set<string>();
    Object.values(staffDatabase).forEach(staff => {
      facilitySet.add(staff.facility);
    });
    return ['蜈ｨ譁ｽ險ｭ', ...Array.from(facilitySet).sort()];
  }, []);

  // 繧ｰ繝ｩ繝輔・濶ｲ險ｭ螳・  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="蜈･遉ｾ蟷ｴ谺｡蛻･繧ｳ繝帙・繝郁ｿｽ霍｡" />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* 繝倥ャ繝繝ｼ */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold">蜈･遉ｾ蟷ｴ谺｡蛻･繧ｳ繝帙・繝郁ｿｽ霍｡</h1>
            <p className="text-gray-600 mt-2">蜈･遉ｾ蟷ｴ谺｡蛻･縺ｫ閨ｷ蜩｡縺ｮ螳夂捩邇・・謌宣聞繝ｻ繧ｭ繝｣繝ｪ繧｢蠖｢謌舌ｒ髟ｷ譛溽噪縺ｫ霑ｽ霍｡蛻・梵</p>
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
                  閨ｷ遞ｮ
                </label>
                <select
                  value={selectedPosition}
                  onChange={(e) => setSelectedPosition(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {positions.map(position => (
                    <option key={position} value={position}>{position}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  譛滄俣
                </label>
                <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">蜈ｨ譛滄俣</option>
                  <option value="recent5">逶ｴ霑・蟷ｴ</option>
                  <option value="recent3">逶ｴ霑・蟷ｴ</option>
                </select>
              </div>
            </div>
          </div>

          {/* 螳夂捩邇・耳遘ｻ繧ｰ繝ｩ繝・*/}
          <Card>
            <CardHeader>
              <CardTitle>蜈･遉ｾ蟷ｴ谺｡蛻･螳夂捩邇・耳遘ｻ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cohortData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value: any) => `${value}%`} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="retentionRate" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      name="螳夂捩邇・
                      dot={{ fill: '#3B82F6', r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ縺ｨ繧ｨ繝ｳ繧ｲ繝ｼ繧ｸ繝｡繝ｳ繝・*/}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>蟷ｴ谺｡蛻･繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ隧穂ｾ｡</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={cohortData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="avgPerformance" 
                        fill="#10B981" 
                        name="蟷ｳ蝮・ｩ穂ｾ｡"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>蟷ｴ谺｡蛻･繧ｨ繝ｳ繧ｲ繝ｼ繧ｸ繝｡繝ｳ繝・/CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={cohortData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                      <Tooltip formatter={(value: any) => `${value}%`} />
                      <Legend />
                      <Bar 
                        dataKey="avgEngagement" 
                        fill="#F59E0B" 
                        name="繧ｨ繝ｳ繧ｲ繝ｼ繧ｸ繝｡繝ｳ繝・
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 髮｢閨ｷ繝ｪ繧ｹ繧ｯ蛻・梵 */}
          <Card>
            <CardHeader>
              <CardTitle>蟷ｴ谺｡蛻･髮｢閨ｷ繝ｪ繧ｹ繧ｯ繧ｹ繧ｳ繧｢</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cohortData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value: any) => `${value}%`} />
                    <Legend />
                    <Bar dataKey="riskScore" name="繝ｪ繧ｹ繧ｯ繧ｹ繧ｳ繧｢">
                      {cohortData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.riskScore > 60 ? '#EF4444' : entry.riskScore > 40 ? '#F59E0B' : '#10B981'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>菴弱Μ繧ｹ繧ｯ・・-40%・・/span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-amber-500 rounded"></div>
                  <span>荳ｭ繝ｪ繧ｹ繧ｯ・・0-60%・・/span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span>鬮倥Μ繧ｹ繧ｯ・・0%莉･荳奇ｼ・/span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 邏ｯ遨榊ｮ夂捩邇・耳遘ｻ */}
          <Card>
            <CardHeader>
              <CardTitle>邨碁℃蟷ｴ謨ｰ蛻･螳夂捩邇・耳遘ｻ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={retentionTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value: any) => `${value}%`} />
                    <Legend />
                    {cohortData.slice(0, 6).map((cohort, index) => (
                      <Line
                        key={cohort.year}
                        type="monotone"
                        dataKey={cohort.year}
                        stroke={COLORS[index % COLORS.length]}
                        strokeWidth={2}
                        name={`${cohort.year}蟷ｴ蜈･遉ｾ`}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 繧ｵ繝槭Μ繝ｼ邨ｱ險・*/}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>蜈ｨ菴灘ｮ夂捩邇・/CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {cohortData.length > 0 
                    ? Math.round(cohortData.reduce((sum, d) => sum + d.retentionRate, 0) / cohortData.length) 
                    : 0}%
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  蜈ｨ繧ｳ繝帙・繝医・蟷ｳ蝮・ｮ夂捩邇・                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>邱城屬閨ｷ閠・焚</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {cohortData.reduce((sum, d) => sum + d.turnoverCount, 0)}蜷・                </div>
                <p className="text-sm text-gray-600 mt-2">
                  蜈ｨ譛滄俣縺ｮ邏ｯ險磯屬閨ｷ閠・焚
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>鬮倥Μ繧ｹ繧ｯ繧ｳ繝帙・繝・/CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-600">
                  {cohortData.filter(d => d.riskScore > 60).length}莉ｶ
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  繝ｪ繧ｹ繧ｯ繧ｹ繧ｳ繧｢60%莉･荳・                </p>
              </CardContent>
            </Card>
          </div>

          {/* 繧｢繧ｯ繧ｷ繝ｧ繝ｳ繝懊ち繝ｳ */}
          <div className="flex gap-4">
            <button 
              onClick={() => exportToPDF({
                title: '蜈･遉ｾ蟷ｴ谺｡蛻･繧ｳ繝帙・繝郁ｿｽ霍｡繝ｬ繝昴・繝・,
                facility: selectedFacility,
                reportType: 'entry-year-cohort',
                elementId: 'report-content',
                dateRange: new Date().toLocaleDateString('ja-JP')
              })}
              className="pdf-exclude bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              PDF繝繧ｦ繝ｳ繝ｭ繝ｼ繝・            </button>
          </div>

        </div>
      </div><CategoryTopButton categoryPath="/reports/cohort-analysis" categoryName="繧ｳ繝帙・繝亥・譫・ /></div>
  );
}

export default function EntryYearCohortPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EntryYearCohortContent />
    </Suspense>
  );
}