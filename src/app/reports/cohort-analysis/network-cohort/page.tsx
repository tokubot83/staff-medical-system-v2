'use client';

import React, { Suspense, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CommonHeader from '@/components/CommonHeader';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import { exportToPDF } from '@/utils/pdfExport';
import { staffDatabase } from '@/app/data/staffData';
import {
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
  Cell,
  PieChart,
  Pie
} from 'recharts';

interface NetworkCohort {
  type: string;
  count: number;
  avgConnections: number;
  influenceScore: number;
  collaborationLevel: number;
  retentionRate: number;
  performanceImpact: number;
  characteristics: string[];
}

function NetworkCohortContent() {
  const searchParams = useSearchParams();
  const facilityParam = searchParams.get('facility') || '';
  const [selectedFacility, setSelectedFacility] = useState(facilityParam || '蜈ｨ譁ｽ險ｭ');
  const [selectedNetworkType, setSelectedNetworkType] = useState('all');
  const [selectedAnalysisView, setSelectedAnalysisView] = useState('overview');

  // 繝阪ャ繝医Ρ繝ｼ繧ｯ繧ｿ繧､繝励・螳夂ｾｩ
  const networkTypes = [
    '繧ｳ繝阪け繧ｿ繝ｼ・医▽縺ｪ縺主ｽｹ・・,
    '繧､繝ｳ繝輔Ν繧ｨ繝ｳ繧ｵ繝ｼ・亥ｽｱ髻ｿ蜉帛､ｧ・・,
    '繧ｨ繧ｭ繧ｹ繝代・繝茨ｼ育衍隴倥・貅撰ｼ・,
    '蟄､遶句梛・医▽縺ｪ縺後ｊ蟆托ｼ・,
    '繝√・繝蜀・ｮ檎ｵ仙梛',
    '繧ｯ繝ｭ繧ｹ繝輔ぃ繝ｳ繧ｯ繧ｷ繝ｧ繝翫Ν蝙・
  ];

  // 繝阪ャ繝医Ρ繝ｼ繧ｯ繧ｳ繝帙・繝医ョ繝ｼ繧ｿ縺ｮ逕滓・
  const networkCohorts = useMemo(() => {
    const staffList = Object.values(staffDatabase).filter(staff => {
      if (selectedFacility !== '蜈ｨ譁ｽ險ｭ' && staff.facility !== selectedFacility) return false;
      return true;
    });

    // 繝阪ャ繝医Ρ繝ｼ繧ｯ繧ｿ繧､繝怜挨縺ｫ繧ｳ繝帙・繝医ｒ逕滓・
    const cohorts: NetworkCohort[] = networkTypes.map(type => {
      let avgConnections = 0;
      let influenceScore = 0;
      let collaborationLevel = 0;
      let retentionRate = 0;
      let performanceImpact = 0;
      let characteristics: string[] = [];

      switch (type) {
        case '繧ｳ繝阪け繧ｿ繝ｼ・医▽縺ｪ縺主ｽｹ・・:
          avgConnections = 45;
          influenceScore = 85;
          collaborationLevel = 90;
          retentionRate = 92;
          performanceImpact = 88;
          characteristics = ['驛ｨ鄂ｲ髢捺ｩ区ｸ｡縺・, '諠・ｱ繝上ヶ', '繝√・繝邨ｱ蜷井ｿ・ｲ'];
          break;
        case '繧､繝ｳ繝輔Ν繧ｨ繝ｳ繧ｵ繝ｼ・亥ｽｱ髻ｿ蜉帛､ｧ・・:
          avgConnections = 35;
          influenceScore = 92;
          collaborationLevel = 82;
          retentionRate = 88;
          performanceImpact = 85;
          characteristics = ['諢剰ｦ九Μ繝ｼ繝繝ｼ', '螟蛾擠謗ｨ騾ｲ閠・, '繝｢繝√・繝ｼ繧ｿ繝ｼ'];
          break;
        case '繧ｨ繧ｭ繧ｹ繝代・繝茨ｼ育衍隴倥・貅撰ｼ・:
          avgConnections = 25;
          influenceScore = 78;
          collaborationLevel = 75;
          retentionRate = 85;
          performanceImpact = 82;
          characteristics = ['蟆る摩遏･隴倅ｿ晄怏', '逶ｸ隲・嶌謇・, '繝｡繝ｳ繧ｿ繝ｼ蠖ｹ'];
          break;
        case '蟄､遶句梛・医▽縺ｪ縺後ｊ蟆托ｼ・:
          avgConnections = 8;
          influenceScore = 25;
          collaborationLevel = 35;
          retentionRate = 65;
          performanceImpact = 55;
          characteristics = ['蜊倡峡菴懈･ｭ蠢怜髄', '莠､豬∝屓驕ｿ', '謾ｯ謠ｴ蠢・ｦ・];
          break;
        case '繝√・繝蜀・ｮ檎ｵ仙梛':
          avgConnections = 15;
          influenceScore = 55;
          collaborationLevel = 68;
          retentionRate = 78;
          performanceImpact = 70;
          characteristics = ['繝√・繝蜀・鵠蜉・, '驛ｨ鄂ｲ蜀・ｮ檎ｵ・, '螟夜Κ莠､豬∝ｰ・];
          break;
        case '繧ｯ繝ｭ繧ｹ繝輔ぃ繝ｳ繧ｯ繧ｷ繝ｧ繝翫Ν蝙・:
          avgConnections = 30;
          influenceScore = 75;
          collaborationLevel = 85;
          retentionRate = 90;
          performanceImpact = 80;
          characteristics = ['驛ｨ髢讓ｪ譁ｭ豢ｻ蜍・, '螟壽ｧ倥↑莠ｺ閼・, '繧､繝弱・繝ｼ繧ｷ繝ｧ繝ｳ菫・ｲ'];
          break;
      }

      // 繧ｷ繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ縺ｧ繧ｹ繧ｿ繝・ヵ繧貞・鬘・
      const cohortStaff = staffList.filter(() => Math.random() < 0.17);
      const count = cohortStaff.length;

      if (count === 0) return null;

      return {
        type,
        count,
        avgConnections,
        influenceScore,
        collaborationLevel,
        retentionRate,
        performanceImpact,
        characteristics
      };
    }).filter(Boolean) as NetworkCohort[];

    if (selectedNetworkType !== 'all') {
      return cohorts.filter(c => c.type === selectedNetworkType);
    }

    return cohorts;
  }, [selectedFacility, selectedNetworkType]);

  // 繝阪ャ繝医Ρ繝ｼ繧ｯ蟇・ｺｦ蛻・梵繝・・繧ｿ
  const networkDensityData = useMemo(() => {
    return [
      { department: '逵玖ｭｷ驛ｨ', density: 78, avgConnections: 32 },
      { department: '蛹ｻ逋よ橿陦馴Κ', density: 65, avgConnections: 28 },
      { department: '莠句漁驛ｨ', density: 72, avgConnections: 30 },
      { department: '繝ｪ繝上ン繝ｪ驛ｨ', density: 85, avgConnections: 35 },
      { department: '阮ｬ蜑､驛ｨ', density: 58, avgConnections: 24 }
    ];
  }, []);

  // 繧ｳ繝ｩ繝懊Ξ繝ｼ繧ｷ繝ｧ繝ｳ蜉ｹ譫懊ョ繝ｼ繧ｿ
  const collaborationEffectData = useMemo(() => {
    return [
      { connections: '0-5', performance: 65, innovation: 45 },
      { connections: '6-10', performance: 72, innovation: 55 },
      { connections: '11-20', performance: 80, innovation: 70 },
      { connections: '21-30', performance: 85, innovation: 82 },
      { connections: '31-40', performance: 88, innovation: 88 },
      { connections: '40+', performance: 86, innovation: 85 }
    ];
  }, []);

  // 繝ｬ繝ｼ繝繝ｼ繝√Ε繝ｼ繝育畑繝・・繧ｿ
  const radarData = useMemo(() => {
    const metrics = ['縺､縺ｪ縺後ｊ謨ｰ', '蠖ｱ髻ｿ蜉・, '蜊泌ロ繝ｬ繝吶Ν', '螳夂捩邇・, '繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ'];
    return metrics.map(metric => {
      const dataPoint: any = { metric };
      networkCohorts.forEach(cohort => {
        let value = 0;
        switch (metric) {
          case '縺､縺ｪ縺後ｊ謨ｰ': value = (cohort.avgConnections / 50) * 100; break;
          case '蠖ｱ髻ｿ蜉・: value = cohort.influenceScore; break;
          case '蜊泌ロ繝ｬ繝吶Ν': value = cohort.collaborationLevel; break;
          case '螳夂捩邇・: value = cohort.retentionRate; break;
          case '繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ': value = cohort.performanceImpact; break;
        }
        dataPoint[cohort.type] = value;
      });
      return dataPoint;
    });
  }, [networkCohorts]);

  // 謨｣蟶・峙逕ｨ繝・・繧ｿ・医ロ繝・ヨ繝ｯ繝ｼ繧ｯ繧ｵ繧､繧ｺ縺ｨ蠖ｱ髻ｿ蜉帙・逶ｸ髢｢・・
  const scatterData = useMemo(() => {
    return Array.from({ length: 100 }, (_, i) => {
      const connections = Math.random() * 50;
      const baseInfluence = connections * 1.5 + Math.random() * 20;
      const influence = Math.min(100, Math.max(0, baseInfluence));
      return {
        x: connections,
        y: influence,
        name: `閨ｷ蜩｡${i + 1}`
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

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#14B8A6'];

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="繝阪ャ繝医Ρ繝ｼ繧ｯ繧ｳ繝帙・繝亥・譫・ />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* 繝倥ャ繝繝ｼ */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold">繝阪ャ繝医Ρ繝ｼ繧ｯ繧ｳ繝帙・繝亥・譫・/h1>
            <p className="text-gray-600 mt-2">
              邨・ｹ泌・繝阪ャ繝医Ρ繝ｼ繧ｯ縺ｮ荳ｭ蠢・ｧ繝ｻ縺､縺ｪ縺後ｊ縺ｮ謨ｰ繝ｻ蠖ｱ髻ｿ蜉帛挨縺ｫ閨ｷ蜩｡繧貞・譫・
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
                  繝阪ャ繝医Ρ繝ｼ繧ｯ繧ｿ繧､繝・
                </label>
                <select
                  value={selectedNetworkType}
                  onChange={(e) => setSelectedNetworkType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">蜈ｨ繧ｿ繧､繝・/option>
                  {networkTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  蛻・梵隕也せ
                </label>
                <select
                  value={selectedAnalysisView}
                  onChange={(e) => setSelectedAnalysisView(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="overview">讎りｦ・/option>
                  <option value="influence">蠖ｱ髻ｿ蜉帛・譫・/option>
                  <option value="collaboration">蜊泌ロ蛻・梵</option>
                </select>
              </div>
            </div>
          </div>

          {/* 繝阪ャ繝医Ρ繝ｼ繧ｯ繧ｿ繧､繝怜挨邨ｱ險・*/}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {networkCohorts.map((cohort, index) => (
              <Card key={cohort.type}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{cohort.type}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">莠ｺ謨ｰ</span>
                      <span className="text-lg font-semibold">{cohort.count}蜷・/span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">蟷ｳ蝮・▽縺ｪ縺後ｊ謨ｰ</span>
                      <span className="text-lg font-semibold text-blue-600">{cohort.avgConnections}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">蠖ｱ髻ｿ蜉帙せ繧ｳ繧｢</span>
                      <span className={`text-lg font-semibold ${cohort.influenceScore >= 80 ? 'text-green-600' : cohort.influenceScore >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                        {cohort.influenceScore}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 繝阪ャ繝医Ρ繝ｼ繧ｯ繧ｿ繧､繝怜挨豈碑ｼ・*/}
          <Card>
            <CardHeader>
              <CardTitle>繝阪ャ繝医Ρ繝ｼ繧ｯ繧ｿ繧､繝怜挨繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ謖・ｨ・/CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={networkCohorts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" angle={-45} textAnchor="end" height={100} />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="influenceScore" name="蠖ｱ髻ｿ蜉・ fill="#3B82F6" />
                    <Bar dataKey="collaborationLevel" name="蜊泌ロ繝ｬ繝吶Ν" fill="#10B981" />
                    <Bar dataKey="retentionRate" name="螳夂捩邇・ fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 繝ｬ繝ｼ繝繝ｼ繝√Ε繝ｼ繝・*/}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>繝阪ャ繝医Ρ繝ｼ繧ｯ繧ｿ繧､繝怜挨迚ｹ諤ｧ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      {networkCohorts.slice(0, 3).map((cohort, index) => (
                        <Radar
                          key={cohort.type}
                          name={cohort.type}
                          dataKey={cohort.type}
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

            <Card>
              <CardHeader>
                <CardTitle>驛ｨ鄂ｲ蛻･繝阪ャ繝医Ρ繝ｼ繧ｯ蟇・ｺｦ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={networkDensityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="department" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="density" name="蟇・ｺｦ(%)" fill="#3B82F6" />
                      <Bar dataKey="avgConnections" name="蟷ｳ蝮・▽縺ｪ縺後ｊ謨ｰ" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 繧ｳ繝ｩ繝懊Ξ繝ｼ繧ｷ繝ｧ繝ｳ蜉ｹ譫・*/}
          <Card>
            <CardHeader>
              <CardTitle>縺､縺ｪ縺後ｊ謨ｰ縺ｨ繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ繝ｻ繧､繝弱・繝ｼ繧ｷ繝ｧ繝ｳ縺ｮ髢｢菫・/CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={collaborationEffectData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="connections" />
                    <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value: any) => `${value}%`} />
                    <Legend />
                    <Bar dataKey="performance" name="繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ" fill="#3B82F6" />
                    <Bar dataKey="innovation" name="繧､繝弱・繝ｼ繧ｷ繝ｧ繝ｳ" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 謨｣蟶・峙 */}
          <Card>
            <CardHeader>
              <CardTitle>繝阪ャ繝医Ρ繝ｼ繧ｯ繧ｵ繧､繧ｺ縺ｨ蠖ｱ髻ｿ蜉帙・逶ｸ髢｢</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="x" 
                      domain={[0, 50]} 
                      label={{ value: '縺､縺ｪ縺後ｊ謨ｰ', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      dataKey="y" 
                      domain={[0, 100]}
                      label={{ value: '蠖ｱ髻ｿ蜉帙せ繧ｳ繧｢', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="閨ｷ蜩｡" data={scatterData} fill="#3B82F6">
                      {scatterData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.y >= 70 ? '#10B981' : entry.y >= 50 ? '#F59E0B' : '#EF4444'} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 迚ｹ諤ｧ荳隕ｧ */}
          <Card>
            <CardHeader>
              <CardTitle>繝阪ャ繝医Ρ繝ｼ繧ｯ繧ｿ繧､繝怜挨迚ｹ諤ｧ縺ｨ謗ｨ螂ｨ譁ｽ遲・/CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {networkCohorts.map((cohort) => (
                  <div key={cohort.type} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{cohort.type}</h4>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {cohort.characteristics.map((char, index) => (
                            <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {char}
                            </span>
                          ))}
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          {cohort.type === '繧ｳ繝阪け繧ｿ繝ｼ・医▽縺ｪ縺主ｽｹ・・ && '邨・ｹ斐・諠・ｱ豬・壹・隕√る←蛻・↑隧穂ｾ｡縺ｨ讓ｩ髯仙ｧ碑ｭｲ縺碁㍾隕√・}
                          {cohort.type === '繧､繝ｳ繝輔Ν繧ｨ繝ｳ繧ｵ繝ｼ・亥ｽｱ髻ｿ蜉帛､ｧ・・ && '螟蛾擠謗ｨ騾ｲ縺ｮ荳ｭ蠢・ｺｺ迚ｩ縲よэ諤晄ｱｺ螳壹∈縺ｮ蜿ら判讖滉ｼ壹ｒ謠蝉ｾ帙・}
                          {cohort.type === '繧ｨ繧ｭ繧ｹ繝代・繝茨ｼ育衍隴倥・貅撰ｼ・ && '遏･隴伜・譛峨・莉慕ｵ・∩蛹悶→繝｡繝ｳ繧ｿ繝ｼ蛻ｶ蠎ｦ縺ｧ縺ｮ豢ｻ逕ｨ繧呈耳騾ｲ縲・}
                          {cohort.type === '蟄､遶句梛・医▽縺ｪ縺後ｊ蟆托ｼ・ && '繝√・繝豢ｻ蜍輔∈縺ｮ蜿ょ刈菫・ｲ縺ｨ蠢・炊逧・ｮ牙・諤ｧ縺ｮ遒ｺ菫昴′蠢・ｦ√・}
                          {cohort.type === '繝√・繝蜀・ｮ檎ｵ仙梛' && '莉夜Κ鄂ｲ縺ｨ縺ｮ莠､豬∵ｩ滉ｼ壹ｒ諢丞峙逧・↓蜑ｵ蜃ｺ縲・}
                          {cohort.type === '繧ｯ繝ｭ繧ｹ繝輔ぃ繝ｳ繧ｯ繧ｷ繝ｧ繝翫Ν蝙・ && '繧､繝弱・繝ｼ繧ｷ繝ｧ繝ｳ繝励Ο繧ｸ繧ｧ繧ｯ繝医∈縺ｮ遨肴･ｵ逧・↑逋ｻ逕ｨ縲・}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">螳夂捩邇・ {cohort.retentionRate}%</p>
                        <p className="text-xs text-gray-500">蠖ｱ髻ｿ蜉・ {cohort.influenceScore}轤ｹ</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 繧｢繧ｯ繧ｷ繝ｧ繝ｳ繝懊ち繝ｳ */}
          <div className="flex gap-4">
            <button 
              onClick={() => exportToPDF({
                title: '繝阪ャ繝医Ρ繝ｼ繧ｯ繧ｳ繝帙・繝亥・譫舌Ξ繝昴・繝・,
                facility: selectedFacility,
                reportType: 'network-cohort',
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

export default function NetworkCohortPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NetworkCohortContent />
    </Suspense>
  );
}