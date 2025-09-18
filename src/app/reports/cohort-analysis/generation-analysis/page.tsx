'use client';

import React, { Suspense, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CommonHeader from '@/components/CommonHeader';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import { exportToPDF } from '@/utils/pdfExport';
import { staffDatabase } from '@/app/data/staffData';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
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
  Cell,
  LineChart,
  Line
} from 'recharts';

interface GenerationData {
  generation: string;
  count: number;
  percentage: number;
  avgAge: number;
  avgTenure: number;
  avgEngagement: number;
  avgStress: number;
  avgOvertime: number;
  avgPaidLeave: number;
  avgPerformance: number;
  turnoverRate: number;
}

function GenerationAnalysisContent() {
  const searchParams = useSearchParams();
  const facilityParam = searchParams.get('facility') || '';
  const [selectedFacility, setSelectedFacility] = useState(facilityParam || '蜈ｨ譁ｽ險ｭ');
  const [selectedPosition, setSelectedPosition] = useState('蜈ｨ閨ｷ遞ｮ');
  const [compareMode, setCompareMode] = useState(false);

  // 荳紋ｻ｣繧貞愛螳壹☆繧矩未謨ｰ
  const getGeneration = (age: number): string => {
    if (age < 27) return 'Z荳紋ｻ｣';
    if (age < 43) return '繝溘Ξ繝九い繝ｫ荳紋ｻ｣';
    if (age < 59) return 'X荳紋ｻ｣';
    return '繝吶ン繝ｼ繝悶・繝槭・荳紋ｻ｣';
  };

  // 荳紋ｻ｣蛻･繝・・繧ｿ繧帝寔險・  const generationData = useMemo(() => {
    const staffList = Object.values(staffDatabase).filter(staff => {
      if (selectedFacility !== '蜈ｨ譁ｽ險ｭ' && staff.facility !== selectedFacility) return false;
      if (selectedPosition !== '蜈ｨ閨ｷ遞ｮ') {
        const basePosition = staff.position.replace(/荳ｻ莉ｻ|蟶ｫ髟ｷ|驛ｨ髟ｷ|遘鷹聞/, '').trim();
        if (basePosition !== selectedPosition) return false;
      }
      return true;
    });

    const totalStaff = staffList.length;

    // 荳紋ｻ｣蛻･縺ｫ繧ｰ繝ｫ繝ｼ繝怜喧
    const generationGroups = staffList.reduce((acc, staff) => {
      const generation = getGeneration(staff.age);
      if (!acc[generation]) {
        acc[generation] = [];
      }
      acc[generation].push(staff);
      return acc;
    }, {} as Record<string, typeof staffList>);

    // 蜷・ｸ紋ｻ｣縺ｮ繝・・繧ｿ繧定ｨ育ｮ・    const data: GenerationData[] = Object.entries(generationGroups).map(([generation, staffGroup]) => {
      const count = staffGroup.length;
      const percentage = Math.round((count / totalStaff) * 100);
      
      // 蟷ｳ蝮・､縺ｮ險育ｮ・      const avgAge = Math.round(staffGroup.reduce((sum, s) => sum + s.age, 0) / count);
      const avgTenure = staffGroup.reduce((sum, s) => {
        const years = parseInt(s.tenure.match(/(\d+)蟷ｴ/)?.[1] || '0');
        return sum + years;
      }, 0) / count;
      const avgEngagement = Math.round(staffGroup.reduce((sum, s) => sum + s.engagement, 0) / count);
      const avgStress = Math.round(staffGroup.reduce((sum, s) => sum + s.stressIndex, 0) / count);
      const avgOvertime = Math.round(staffGroup.reduce((sum, s) => sum + s.overtime, 0) / count);
      const avgPaidLeave = Math.round(staffGroup.reduce((sum, s) => sum + s.paidLeaveRate, 0) / count);
      
      const avgPerformance = staffGroup.reduce((sum, s) => {
        const rating = s.evaluationData?.rating || s.evaluationHistory?.[0]?.performance || 3.5;
        return sum + rating;
      }, 0) / count;
      
      // 髮｢閨ｷ邇・ｼ医す繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ・・      const turnoverRate = Math.round(10 + Math.random() * 15);

      return {
        generation,
        count,
        percentage,
        avgAge,
        avgTenure: Number(avgTenure.toFixed(1)),
        avgEngagement,
        avgStress,
        avgOvertime,
        avgPaidLeave,
        avgPerformance: Number(avgPerformance.toFixed(2)),
        turnoverRate
      };
    });

    // 荳紋ｻ｣鬆・↓繧ｽ繝ｼ繝・    const generationOrder = ['Z荳紋ｻ｣', '繝溘Ξ繝九い繝ｫ荳紋ｻ｣', 'X荳紋ｻ｣', '繝吶ン繝ｼ繝悶・繝槭・荳紋ｻ｣'];
    return data.sort((a, b) => generationOrder.indexOf(a.generation) - generationOrder.indexOf(b.generation));
  }, [selectedFacility, selectedPosition]);

  // 繝ｬ繝ｼ繝繝ｼ繝√Ε繝ｼ繝育畑繝・・繧ｿ
  const radarData = useMemo(() => {
    return [
      {
        metric: '繧ｨ繝ｳ繧ｲ繝ｼ繧ｸ繝｡繝ｳ繝・,
        ...generationData.reduce((acc, gen) => {
          acc[gen.generation] = gen.avgEngagement;
          return acc;
        }, {} as Record<string, number>)
      },
      {
        metric: '繧ｹ繝医Ξ繧ｹ閠先ｧ',
        ...generationData.reduce((acc, gen) => {
          acc[gen.generation] = 100 - gen.avgStress;
          return acc;
        }, {} as Record<string, number>)
      },
      {
        metric: '繝ｯ繝ｼ繧ｯ繝ｩ繧､繝輔ヰ繝ｩ繝ｳ繧ｹ',
        ...generationData.reduce((acc, gen) => {
          acc[gen.generation] = Math.round((100 - gen.avgOvertime * 2 + gen.avgPaidLeave) / 2);
          return acc;
        }, {} as Record<string, number>)
      },
      {
        metric: '繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ',
        ...generationData.reduce((acc, gen) => {
          acc[gen.generation] = Math.round(gen.avgPerformance * 20);
          return acc;
        }, {} as Record<string, number>)
      },
      {
        metric: '螳夂捩諢丞髄',
        ...generationData.reduce((acc, gen) => {
          acc[gen.generation] = 100 - gen.turnoverRate;
          return acc;
        }, {} as Record<string, number>)
      }
    ];
  }, [generationData]);

  // 萓｡蛟､隕ｳ繝・・繧ｿ・医す繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ・・  const valuesData = [
    { value: '謌宣聞讖滉ｼ・, 'Z荳紋ｻ｣': 95, '繝溘Ξ繝九い繝ｫ荳紋ｻ｣': 85, 'X荳紋ｻ｣': 70, '繝吶ン繝ｼ繝悶・繝槭・荳紋ｻ｣': 60 },
    { value: '螳牙ｮ壽ｧ', 'Z荳紋ｻ｣': 60, '繝溘Ξ繝九い繝ｫ荳紋ｻ｣': 70, 'X荳紋ｻ｣': 85, '繝吶ン繝ｼ繝悶・繝槭・荳紋ｻ｣': 95 },
    { value: '譟碑ｻ溘↑蜒阪″譁ｹ', 'Z荳紋ｻ｣': 90, '繝溘Ξ繝九い繝ｫ荳紋ｻ｣': 80, 'X荳紋ｻ｣': 65, '繝吶ン繝ｼ繝悶・繝槭・荳紋ｻ｣': 50 },
    { value: '邨ｦ荳弱・蝣ｱ驟ｬ', 'Z荳紋ｻ｣': 75, '繝溘Ξ繝九い繝ｫ荳紋ｻ｣': 85, 'X荳紋ｻ｣': 90, '繝吶ン繝ｼ繝悶・繝槭・荳紋ｻ｣': 80 },
    { value: '遉ｾ莨夊ｲ｢迪ｮ', 'Z荳紋ｻ｣': 85, '繝溘Ξ繝九い繝ｫ荳紋ｻ｣': 75, 'X荳紋ｻ｣': 65, '繝吶ン繝ｼ繝悶・繝槭・荳紋ｻ｣': 70 }
  ];

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

  // 繧ｰ繝ｩ繝輔・濶ｲ險ｭ螳・  const COLORS = {
    'Z荳紋ｻ｣': '#3B82F6',
    '繝溘Ξ繝九い繝ｫ荳紋ｻ｣': '#10B981',
    'X荳紋ｻ｣': '#F59E0B',
    '繝吶ン繝ｼ繝悶・繝槭・荳紋ｻ｣': '#EF4444'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="荳紋ｻ｣蛻･迚ｹ諤ｧ蛻・梵" />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* 繝倥ャ繝繝ｼ */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold">荳紋ｻ｣蛻･迚ｹ諤ｧ蛻・梵</h1>
            <p className="text-gray-600 mt-2">Z荳紋ｻ｣縲√Α繝ｬ繝九い繝ｫ荳紋ｻ｣縺ｪ縺ｩ荳紋ｻ｣蛻･縺ｮ迚ｹ諤ｧ縺ｨ邨・ｹ秘←蠢懊ｒ蛻・梵</p>
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
              
              <div className="flex items-end">
                <button
                  onClick={() => setCompareMode(!compareMode)}
                  className={`px-4 py-2 rounded-md transition ${
                    compareMode 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  豈碑ｼ・Δ繝ｼ繝・                </button>
              </div>
            </div>
          </div>

          {/* 荳紋ｻ｣讒区・ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>荳紋ｻ｣蛻･莠ｺ蜩｡讒区・</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={generationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ generation, percentage }) => `${generation}: ${percentage}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {generationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[entry.generation as keyof typeof COLORS]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>荳紋ｻ｣蛻･蝓ｺ譛ｬ諠・ｱ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {generationData.map(gen => (
                    <div key={gen.generation} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded" 
                          style={{ backgroundColor: COLORS[gen.generation as keyof typeof COLORS] }}
                        />
                        <span className="font-medium">{gen.generation}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{gen.count}蜷・/span>
                        <span className="mx-2">|</span>
                        <span>蟷ｳ蝮・ｹｴ鮨｢ {gen.avgAge}豁ｳ</span>
                        <span className="mx-2">|</span>
                        <span>蟷ｳ蝮・共邯・{gen.avgTenure}蟷ｴ</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 荳紋ｻ｣蛻･迚ｹ諤ｧ繝ｬ繝ｼ繝繝ｼ繝√Ε繝ｼ繝・*/}
          <Card>
            <CardHeader>
              <CardTitle>荳紋ｻ｣蛻･迚ｹ諤ｧ豈碑ｼ・/CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    {generationData.map(gen => (
                      <Radar
                        key={gen.generation}
                        name={gen.generation}
                        dataKey={gen.generation}
                        stroke={COLORS[gen.generation as keyof typeof COLORS]}
                        fill={COLORS[gen.generation as keyof typeof COLORS]}
                        fillOpacity={0.3}
                      />
                    ))}
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 萓｡蛟､隕ｳ縺ｮ驕輔＞ */}
          <Card>
            <CardHeader>
              <CardTitle>荳紋ｻ｣蛻･萓｡蛟､隕ｳ縺ｮ驕輔＞</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={valuesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="value" />
                    <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value: any) => `${value}%`} />
                    <Legend />
                    {Object.keys(COLORS).map(generation => (
                      <Bar
                        key={generation}
                        dataKey={generation}
                        fill={COLORS[generation as keyof typeof COLORS]}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 隧ｳ邏ｰ謖・ｨ呎ｯ碑ｼ・*/}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>繧ｨ繝ｳ繧ｲ繝ｼ繧ｸ繝｡繝ｳ繝医・繧ｹ繝医Ξ繧ｹ謖・ｨ・/CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={generationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="generation" />
                      <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                      <Tooltip formatter={(value: any) => `${value}%`} />
                      <Legend />
                      <Bar dataKey="avgEngagement" name="繧ｨ繝ｳ繧ｲ繝ｼ繧ｸ繝｡繝ｳ繝・ fill="#10B981" />
                      <Bar dataKey="avgStress" name="繧ｹ繝医Ξ繧ｹ謖・焚" fill="#EF4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>蜒阪″譁ｹ謖・ｨ・/CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={generationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="generation" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="avgOvertime" name="蟷ｳ蝮・ｮ区･ｭ譎る俣" fill="#F59E0B" />
                      <Bar dataKey="avgPaidLeave" name="譛臥ｵｦ蜿門ｾ礼紫" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 繧ｮ繝｣繝・・蛻・梵 */}
          <Card>
            <CardHeader>
              <CardTitle>荳紋ｻ｣髢薙ぐ繝｣繝・・蛻・梵</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">譛螟ｧ繧ｮ繝｣繝・・鬆・岼</h4>
                  <ul className="space-y-2 text-sm text-red-700">
                    <li>窶｢ 譟碑ｻ溘↑蜒阪″譁ｹ縺ｸ縺ｮ譛溷ｾ・ Z荳紋ｻ｣(90%) vs 繝吶ン繝ｼ繝悶・繝槭・荳紋ｻ｣(50%)</li>
                    <li>窶｢ 螳牙ｮ壽ｧ驥崎ｦ・ 繝吶ン繝ｼ繝悶・繝槭・荳紋ｻ｣(95%) vs Z荳紋ｻ｣(60%)</li>
                    <li>窶｢ 謌宣聞讖滉ｼ壹∈縺ｮ譛溷ｾ・ Z荳紋ｻ｣(95%) vs 繝吶ン繝ｼ繝悶・繝槭・荳紋ｻ｣(60%)</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">蜈ｱ騾壻ｾ｡蛟､隕ｳ</h4>
                  <ul className="space-y-2 text-sm text-green-700">
                    <li>窶｢ 遉ｾ莨夊ｲ｢迪ｮ縺ｸ縺ｮ諢剰ｭ倥・蜈ｨ荳紋ｻ｣縺ｧ豈碑ｼ・噪鬮倥＞・・5-85%・・/li>
                    <li>窶｢ 邨ｦ荳弱・蝣ｱ驟ｬ縺ｸ縺ｮ髢｢蠢・・荳紋ｻ｣髢薙〒螟ｧ縺阪↑蟾ｮ縺後↑縺・ｼ・5-90%・・/li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 謗ｨ螂ｨ繧｢繧ｯ繧ｷ繝ｧ繝ｳ */}
          <Card>
            <CardHeader>
              <CardTitle>荳紋ｻ｣蛻･繝槭ロ繧ｸ繝｡繝ｳ繝域耳螂ｨ莠矩・/CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generationData.map(gen => (
                  <div key={gen.generation} className="p-4 border rounded-lg">
                    <h4 className="font-semibold flex items-center gap-2 mb-3">
                      <div 
                        className="w-4 h-4 rounded" 
                        style={{ backgroundColor: COLORS[gen.generation as keyof typeof COLORS] }}
                      />
                      {gen.generation}
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      {gen.generation === 'Z荳紋ｻ｣' && (
                        <>
                          <li>窶｢ 謌宣聞讖滉ｼ壹→蟄ｦ鄙偵・繝ｭ繧ｰ繝ｩ繝縺ｮ蜈・ｮ・/li>
                          <li>窶｢ 繝輔Ξ繧ｭ繧ｷ繝悶Ν繝ｯ繝ｼ繧ｯ縺ｮ謗ｨ騾ｲ</li>
                          <li>窶｢ 鬆ｻ郢√↑繝輔ぅ繝ｼ繝峨ヰ繝・け縺ｮ螳滓命</li>
                        </>
                      )}
                      {gen.generation === '繝溘Ξ繝九い繝ｫ荳紋ｻ｣' && (
                        <>
                          <li>窶｢ 繧ｭ繝｣繝ｪ繧｢繝代せ縺ｮ譏守｢ｺ蛹・/li>
                          <li>窶｢ 繝ｯ繝ｼ繧ｯ繝ｩ繧､繝輔ヰ繝ｩ繝ｳ繧ｹ縺ｮ謾ｯ謠ｴ</li>
                          <li>窶｢ 繝√・繝繝ｯ繝ｼ繧ｯ縺ｮ菫・ｲ</li>
                        </>
                      )}
                      {gen.generation === 'X荳紋ｻ｣' && (
                        <>
                          <li>窶｢ 蟆る摩諤ｧ蜷台ｸ翫・讖滉ｼ壽署萓・/li>
                          <li>窶｢ 閾ｪ蠕狗噪縺ｪ蜒阪″譁ｹ縺ｮ蟆企㍾</li>
                          <li>窶｢ 繝ｪ繝ｼ繝繝ｼ繧ｷ繝・・讖滉ｼ壹・蜑ｵ蜃ｺ</li>
                        </>
                      )}
                      {gen.generation === '繝吶ン繝ｼ繝悶・繝槭・荳紋ｻ｣' && (
                        <>
                          <li>窶｢ 邨碁ｨ薙・遏･隴倥・豢ｻ逕ｨ讖滉ｼ・/li>
                          <li>窶｢ 繝｡繝ｳ繧ｿ繝ｼ蛻ｶ蠎ｦ縺ｸ縺ｮ蜿ら判</li>
                          <li>窶｢ 谿ｵ髫守噪縺ｪ蠑暮繝励Λ繝ｳ縺ｮ謠蝉ｾ・/li>
                        </>
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 繧｢繧ｯ繧ｷ繝ｧ繝ｳ繝懊ち繝ｳ */}
          <div className="flex gap-4">
            <button 
              onClick={() => exportToPDF({
                title: '荳紋ｻ｣蛻･迚ｹ諤ｧ蛻・梵繝ｬ繝昴・繝・,
                facility: selectedFacility,
                reportType: 'generation-analysis',
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

export default function GenerationAnalysisPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GenerationAnalysisContent />
    </Suspense>
  );
}