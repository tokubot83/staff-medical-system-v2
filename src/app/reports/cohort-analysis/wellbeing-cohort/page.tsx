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
  AreaChart,
  Area,
  ComposedChart,
  Cell
} from 'recharts';

interface WellbeingCohort {
  type: string;
  count: number;
  healthScore: number;
  mentalHealthScore: number;
  workLifeBalance: number;
  stressLevel: number;
  retentionRate: number;
  productivityScore: number;
  riskFactors: string[];
}

function WellbeingCohortContent() {
  const searchParams = useSearchParams();
  const facilityParam = searchParams.get('facility') || '';
  const [selectedFacility, setSelectedFacility] = useState(facilityParam || '蜈ｨ譁ｽ險ｭ');
  const [selectedWellbeingType, setSelectedWellbeingType] = useState('all');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState('all');

  // 繧ｦ繧ｧ繝ｫ繝薙・繧､繝ｳ繧ｰ繧ｿ繧､繝励・螳夂ｾｩ
  const wellbeingTypes = [
    '蛛･蠎ｷ蜆ｪ濶ｯ鄒､',
    '蛛･蠎ｷ繝ｪ繧ｹ繧ｯ鄒､',
    '繝｡繝ｳ繧ｿ繝ｫ繝倥Ν繧ｹ濶ｯ螂ｽ鄒､',
    '繝｡繝ｳ繧ｿ繝ｫ繝倥Ν繧ｹ隕∵ｳｨ諢冗ｾ､',
    '繝ｯ繝ｼ繧ｯ繝ｩ繧､繝輔ヰ繝ｩ繝ｳ繧ｹ蜈・ｮ溽ｾ､',
    '辯・∴蟆ｽ縺咲裸蛟咏ｾ､繝ｪ繧ｹ繧ｯ鄒､',
    '繝ｬ繧ｸ繝ｪ繧ｨ繝ｳ繧ｹ鬮倡ｾ､',
    '邱丞粋逧・ｦ∵髪謠ｴ鄒､'
  ];

  // 繧ｦ繧ｧ繝ｫ繝薙・繧､繝ｳ繧ｰ繧ｳ繝帙・繝医ョ繝ｼ繧ｿ縺ｮ逕滓・
  const wellbeingCohorts = useMemo(() => {
    const staffList = Object.values(staffDatabase).filter(staff => {
      if (selectedFacility !== '蜈ｨ譁ｽ險ｭ' && staff.facility !== selectedFacility) return false;
      if (selectedRiskLevel !== 'all') {
        const stressIndex = staff.stressIndex;
        switch (selectedRiskLevel) {
          case 'low': if (stressIndex > 30) return false; break;
          case 'medium': if (stressIndex <= 30 || stressIndex > 60) return false; break;
          case 'high': if (stressIndex <= 60) return false; break;
        }
      }
      return true;
    });

    // 繧ｦ繧ｧ繝ｫ繝薙・繧､繝ｳ繧ｰ繧ｿ繧､繝怜挨縺ｫ繧ｳ繝帙・繝医ｒ逕滓・
    const cohorts: WellbeingCohort[] = wellbeingTypes.map(type => {
      let healthScore = 0;
      let mentalHealthScore = 0;
      let workLifeBalance = 0;
      let stressLevel = 0;
      let retentionRate = 0;
      let productivityScore = 0;
      let riskFactors: string[] = [];

      switch (type) {
        case '蛛･蠎ｷ蜆ｪ濶ｯ鄒､':
          healthScore = 90;
          mentalHealthScore = 85;
          workLifeBalance = 82;
          stressLevel = 20;
          retentionRate = 95;
          productivityScore = 88;
          riskFactors = ['迚ｹ縺ｫ縺ｪ縺・];
          break;
        case '蛛･蠎ｷ繝ｪ繧ｹ繧ｯ鄒､':
          healthScore = 45;
          mentalHealthScore = 60;
          workLifeBalance = 55;
          stressLevel = 65;
          retentionRate = 70;
          productivityScore = 65;
          riskFactors = ['逕滓ｴｻ鄙呈・逞・Μ繧ｹ繧ｯ', '驕句虚荳崎ｶｳ', '鬟溽函豢ｻ縺ｮ荵ｱ繧・];
          break;
        case '繝｡繝ｳ繧ｿ繝ｫ繝倥Ν繧ｹ濶ｯ螂ｽ鄒､':
          healthScore = 75;
          mentalHealthScore = 90;
          workLifeBalance = 85;
          stressLevel = 25;
          retentionRate = 92;
          productivityScore = 85;
          riskFactors = ['霆ｽ蠎ｦ縺ｮ霄ｫ菴鍋噪逍ｲ蜉ｴ'];
          break;
        case '繝｡繝ｳ繧ｿ繝ｫ繝倥Ν繧ｹ隕∵ｳｨ諢冗ｾ､':
          healthScore = 65;
          mentalHealthScore = 40;
          workLifeBalance = 45;
          stressLevel = 75;
          retentionRate = 60;
          productivityScore = 55;
          riskFactors = ['鬮倥せ繝医Ξ繧ｹ', '逹｡逵荳崎ｶｳ', '荳榊ｮ牙だ蜷・];
          break;
        case '繝ｯ繝ｼ繧ｯ繝ｩ繧､繝輔ヰ繝ｩ繝ｳ繧ｹ蜈・ｮ溽ｾ､':
          healthScore = 80;
          mentalHealthScore = 82;
          workLifeBalance = 92;
          stressLevel = 30;
          retentionRate = 90;
          productivityScore = 82;
          riskFactors = ['迚ｹ縺ｫ縺ｪ縺・];
          break;
        case '辯・∴蟆ｽ縺咲裸蛟咏ｾ､繝ｪ繧ｹ繧ｯ鄒､':
          healthScore = 55;
          mentalHealthScore = 35;
          workLifeBalance = 30;
          stressLevel = 85;
          retentionRate = 45;
          productivityScore = 40;
          riskFactors = ['諷｢諤ｧ逍ｲ蜉ｴ', '諢乗ｬｲ菴惹ｸ・, '諢滓ュ逧・ｶ郁・];
          break;
        case '繝ｬ繧ｸ繝ｪ繧ｨ繝ｳ繧ｹ鬮倡ｾ､':
          healthScore = 78;
          mentalHealthScore = 88;
          workLifeBalance = 75;
          stressLevel = 35;
          retentionRate = 88;
          productivityScore = 90;
          riskFactors = ['荳譎ら噪繧ｹ繝医Ξ繧ｹ'];
          break;
        case '邱丞粋逧・ｦ∵髪謠ｴ鄒､':
          healthScore = 50;
          mentalHealthScore = 45;
          workLifeBalance = 40;
          stressLevel = 70;
          retentionRate = 55;
          productivityScore = 50;
          riskFactors = ['隍・粋逧・▼蠎ｷ繝ｪ繧ｹ繧ｯ', '謾ｯ謠ｴ菴灘宛荳崎ｶｳ', '蟄､遶句だ蜷・];
          break;
      }

      // 繧ｷ繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ縺ｧ繧ｹ繧ｿ繝・ヵ繧貞・鬘・
      const cohortStaff = staffList.filter(staff => {
        const stress = staff.stressIndex;
        const workLife = 100 - staff.overtime * 2;
        switch (type) {
          case '蛛･蠎ｷ蜆ｪ濶ｯ鄒､': return stress < 30 && workLife > 70;
          case '蛛･蠎ｷ繝ｪ繧ｹ繧ｯ鄒､': return stress > 50 && workLife < 50;
          case '繝｡繝ｳ繧ｿ繝ｫ繝倥Ν繧ｹ濶ｯ螂ｽ鄒､': return stress < 25;
          case '繝｡繝ｳ繧ｿ繝ｫ繝倥Ν繧ｹ隕∵ｳｨ諢冗ｾ､': return stress > 70;
          case '繝ｯ繝ｼ繧ｯ繝ｩ繧､繝輔ヰ繝ｩ繝ｳ繧ｹ蜈・ｮ溽ｾ､': return workLife > 80;
          case '辯・∴蟆ｽ縺咲裸蛟咏ｾ､繝ｪ繧ｹ繧ｯ鄒､': return stress > 80 && workLife < 30;
          case '繝ｬ繧ｸ繝ｪ繧ｨ繝ｳ繧ｹ鬮倡ｾ､': return stress < 40 && Math.random() < 0.2;
          case '邱丞粋逧・ｦ∵髪謠ｴ鄒､': return stress > 60 && workLife < 40;
          default: return false;
        }
      });

      const count = cohortStaff.length;

      if (count === 0) return null;

      return {
        type,
        count,
        healthScore,
        mentalHealthScore,
        workLifeBalance,
        stressLevel,
        retentionRate,
        productivityScore,
        riskFactors
      };
    }).filter(Boolean) as WellbeingCohort[];

    if (selectedWellbeingType !== 'all') {
      return cohorts.filter(c => c.type === selectedWellbeingType);
    }

    return cohorts;
  }, [selectedFacility, selectedWellbeingType, selectedRiskLevel]);

  // 繧ｹ繝医Ξ繧ｹ繝ｬ繝吶Ν縺ｮ謗ｨ遘ｻ繝・・繧ｿ
  const stressTrendData = useMemo(() => {
    const months = ['1譛・, '2譛・, '3譛・, '4譛・, '5譛・, '6譛・, '7譛・, '8譛・, '9譛・, '10譛・, '11譛・, '12譛・];
    return months.map((month, index) => ({
      month,
      '蜈ｨ菴灘ｹｳ蝮・: 45 + Math.sin(index * 0.5) * 10,
      '蛛･蠎ｷ蜆ｪ濶ｯ鄒､': 20 + Math.sin(index * 0.3) * 5,
      '繝ｪ繧ｹ繧ｯ鄒､': 70 + Math.sin(index * 0.7) * 15,
      '隕∵髪謠ｴ鄒､': 80 + Math.sin(index * 0.4) * 10
    }));
  }, []);

  // 蛛･蠎ｷ謖・ｨ吶・逶ｸ髢｢繝・・繧ｿ
  const healthCorrelationData = useMemo(() => {
    return [
      { indicator: '逹｡逵譎る俣', wellbeing: 85, performance: 82, retention: 90 },
      { indicator: '驕句虚鄙呈・', wellbeing: 78, performance: 75, retention: 85 },
      { indicator: '鬟溽函豢ｻ', wellbeing: 72, performance: 70, retention: 80 },
      { indicator: '莨第嚊蜿門ｾ・, wellbeing: 88, performance: 85, retention: 92 },
      { indicator: '莠ｺ髢馴未菫・, wellbeing: 90, performance: 88, retention: 95 },
      { indicator: '繧ｹ繝医Ξ繧ｹ邂｡逅・, wellbeing: 82, performance: 80, retention: 88 }
    ];
  }, []);

  // 繝ｬ繝ｼ繝繝ｼ繝√Ε繝ｼ繝育畑繝・・繧ｿ
  const radarData = useMemo(() => {
    const metrics = ['蛛･蠎ｷ蠎ｦ', '繝｡繝ｳ繧ｿ繝ｫ繝倥Ν繧ｹ', 'WLB', '菴弱せ繝医Ξ繧ｹ', '逕溽肇諤ｧ'];
    return metrics.map(metric => {
      const dataPoint: any = { metric };
      wellbeingCohorts.slice(0, 4).forEach(cohort => {
        switch (metric) {
          case '蛛･蠎ｷ蠎ｦ': dataPoint[cohort.type] = cohort.healthScore; break;
          case '繝｡繝ｳ繧ｿ繝ｫ繝倥Ν繧ｹ': dataPoint[cohort.type] = cohort.mentalHealthScore; break;
          case 'WLB': dataPoint[cohort.type] = cohort.workLifeBalance; break;
          case '菴弱せ繝医Ξ繧ｹ': dataPoint[cohort.type] = 100 - cohort.stressLevel; break;
          case '逕溽肇諤ｧ': dataPoint[cohort.type] = cohort.productivityScore; break;
        }
      });
      return dataPoint;
    });
  }, [wellbeingCohorts]);

  // 莉句・繝励Ο繧ｰ繝ｩ繝縺ｮ蜉ｹ譫懊ョ繝ｼ繧ｿ
  const interventionEffectData = useMemo(() => {
    return [
      { program: '繧ｹ繝医Ξ繧ｹ邂｡逅・比ｿｮ', before: 65, after: 45, improvement: 20 },
      { program: '繝輔Ξ繝・け繧ｹ繧ｿ繧､繝蟆主・', before: 55, after: 35, improvement: 20 },
      { program: '蛛･蠎ｷ蠅鈴ｲ繝励Ο繧ｰ繝ｩ繝', before: 60, after: 42, improvement: 18 },
      { program: '繝｡繝ｳ繧ｿ繝ｫ繝倥Ν繧ｹ逶ｸ隲・, before: 70, after: 50, improvement: 20 },
      { program: '繝√・繝繝薙Ν繝・ぅ繝ｳ繧ｰ', before: 58, after: 40, improvement: 18 },
      { program: '蝨ｨ螳・共蜍吝宛蠎ｦ', before: 62, after: 38, improvement: 24 }
    ];
  }, []);

  // 譁ｽ險ｭ繝ｪ繧ｹ繝医ｒ蜿門ｾ・
  const facilities = useMemo(() => {
    const facilitySet = new Set<string>();
    Object.values(staffDatabase).forEach(staff => {
      facilitySet.add(staff.facility);
    });
    return ['蜈ｨ譁ｽ險ｭ', ...Array.from(facilitySet).sort()];
  }, []);

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="繧ｦ繧ｧ繝ｫ繝薙・繧､繝ｳ繧ｰ繧ｳ繝帙・繝亥・譫・ />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* 繝倥ャ繝繝ｼ */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold">繧ｦ繧ｧ繝ｫ繝薙・繧､繝ｳ繧ｰ繧ｳ繝帙・繝亥・譫・/h1>
            <p className="text-gray-600 mt-2">
              蛛･蠎ｷ迥ｶ諷九・繝｡繝ｳ繧ｿ繝ｫ繝倥Ν繧ｹ繝ｻ繝ｯ繝ｼ繧ｯ繝ｩ繧､繝輔ヰ繝ｩ繝ｳ繧ｹ縺ｫ蝓ｺ縺･縺剰・蜩｡縺ｮ蛻・｡槭→蛻・梵
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
                  繧ｦ繧ｧ繝ｫ繝薙・繧､繝ｳ繧ｰ繧ｿ繧､繝・
                </label>
                <select
                  value={selectedWellbeingType}
                  onChange={(e) => setSelectedWellbeingType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">蜈ｨ繧ｿ繧､繝・/option>
                  {wellbeingTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  繝ｪ繧ｹ繧ｯ繝ｬ繝吶Ν
                </label>
                <select
                  value={selectedRiskLevel}
                  onChange={(e) => setSelectedRiskLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">蜈ｨ繝ｬ繝吶Ν</option>
                  <option value="low">菴弱Μ繧ｹ繧ｯ</option>
                  <option value="medium">荳ｭ繝ｪ繧ｹ繧ｯ</option>
                  <option value="high">鬮倥Μ繧ｹ繧ｯ</option>
                </select>
              </div>
            </div>
          </div>

          {/* 繧ｦ繧ｧ繝ｫ繝薙・繧､繝ｳ繧ｰ繧ｳ繝帙・繝域ｦりｦ・*/}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {wellbeingCohorts.slice(0, 4).map((cohort, index) => (
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
                      <span className="text-sm text-gray-600">蛛･蠎ｷ繧ｹ繧ｳ繧｢</span>
                      <span className={`text-lg font-semibold ${cohort.healthScore >= 70 ? 'text-green-600' : cohort.healthScore >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                        {cohort.healthScore}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">繧ｹ繝医Ξ繧ｹ</span>
                      <span className={`text-lg font-semibold ${cohort.stressLevel <= 30 ? 'text-green-600' : cohort.stressLevel <= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                        {cohort.stressLevel}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 繧ｦ繧ｧ繝ｫ繝薙・繧､繝ｳ繧ｰ謖・ｨ呎ｯ碑ｼ・*/}
          <Card>
            <CardHeader>
              <CardTitle>繧ｦ繧ｧ繝ｫ繝薙・繧､繝ｳ繧ｰ繧ｿ繧､繝怜挨謖・ｨ呎ｯ碑ｼ・/CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={wellbeingCohorts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" angle={-45} textAnchor="end" height={100} />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="healthScore" name="蛛･蠎ｷ蠎ｦ" fill="#10B981" />
                    <Bar dataKey="mentalHealthScore" name="繝｡繝ｳ繧ｿ繝ｫ繝倥Ν繧ｹ" fill="#3B82F6" />
                    <Bar dataKey="workLifeBalance" name="WLB" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 繧ｹ繝医Ξ繧ｹ繝ｬ繝吶Ν謗ｨ遘ｻ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>繧ｹ繝医Ξ繧ｹ繝ｬ繝吶Ν縺ｮ蟷ｴ髢捺耳遘ｻ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stressTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                      <Tooltip formatter={(value: any) => `${value}%`} />
                      <Legend />
                      <Area type="monotone" dataKey="隕∵髪謠ｴ鄒､" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="繝ｪ繧ｹ繧ｯ鄒､" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="蜈ｨ菴灘ｹｳ蝮・ stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="蛛･蠎ｷ蜆ｪ濶ｯ鄒､" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>繧ｦ繧ｧ繝ｫ繝薙・繧､繝ｳ繧ｰ邱丞粋隧穂ｾ｡</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      {wellbeingCohorts.slice(0, 3).map((cohort, index) => (
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
          </div>

          {/* 蛛･蠎ｷ謖・ｨ吶→謌先棡縺ｮ逶ｸ髢｢ */}
          <Card>
            <CardHeader>
              <CardTitle>蛛･蠎ｷ髢｢騾｣謖・ｨ吶→繝薙ず繝阪せ謌先棡縺ｮ逶ｸ髢｢</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={healthCorrelationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="indicator" />
                    <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value: any) => `${value}%`} />
                    <Legend />
                    <Bar dataKey="wellbeing" name="繧ｦ繧ｧ繝ｫ繝薙・繧､繝ｳ繧ｰ" fill="#10B981" />
                    <Line type="monotone" dataKey="performance" name="繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ" stroke="#3B82F6" strokeWidth={2} />
                    <Line type="monotone" dataKey="retention" name="螳夂捩邇・ stroke="#F59E0B" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 莉句・繝励Ο繧ｰ繝ｩ繝蜉ｹ譫・*/}
          <Card>
            <CardHeader>
              <CardTitle>繧ｦ繧ｧ繝ｫ繝薙・繧､繝ｳ繧ｰ謾ｹ蝟・・繝ｭ繧ｰ繝ｩ繝縺ｮ蜉ｹ譫・/CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={interventionEffectData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="program" angle={-45} textAnchor="end" height={100} />
                    <YAxis domain={[0, 80]} tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value: any) => `${value}%`} />
                    <Legend />
                    <Bar dataKey="before" name="螳滓命蜑阪せ繝医Ξ繧ｹ" fill="#EF4444" />
                    <Bar dataKey="after" name="螳滓命蠕後せ繝医Ξ繧ｹ" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 繝ｪ繧ｹ繧ｯ隕∝屏荳隕ｧ */}
          <Card>
            <CardHeader>
              <CardTitle>繧ｦ繧ｧ繝ｫ繝薙・繧､繝ｳ繧ｰ繧ｳ繝帙・繝亥挨繝ｪ繧ｹ繧ｯ隕∝屏縺ｨ蟇ｾ遲・/CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {wellbeingCohorts.map((cohort) => (
                  <div key={cohort.type} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{cohort.type}</h4>
                        <div className="mt-2">
                          <span className="text-sm font-medium">繝ｪ繧ｹ繧ｯ隕∝屏・・/span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {cohort.riskFactors.map((risk, index) => (
                              <span key={index} className={`text-xs px-2 py-1 rounded ${
                                risk === '迚ｹ縺ｫ縺ｪ縺・ ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {risk}
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          {cohort.type === '蛛･蠎ｷ蜆ｪ濶ｯ鄒､' && '迴ｾ迥ｶ邯ｭ謖√→莉冶・蜩｡縺ｸ縺ｮ螂ｽ蠖ｱ髻ｿ豕｢蜿翫ｒ菫・ｲ縲・}
                          {cohort.type === '蛛･蠎ｷ繝ｪ繧ｹ繧ｯ鄒､' && '逕滓ｴｻ鄙呈・謾ｹ蝟・・繝ｭ繧ｰ繝ｩ繝縺ｨ蛛･蠎ｷ逶ｸ隲・・螳滓命縲・}
                          {cohort.type === '繝｡繝ｳ繧ｿ繝ｫ繝倥Ν繧ｹ隕∵ｳｨ諢冗ｾ､' && '蟆る摩繧ｫ繧ｦ繝ｳ繧ｻ繝ｪ繝ｳ繧ｰ縺ｨ讌ｭ蜍呵ｲ闕ｷ縺ｮ隱ｿ謨ｴ縲・}
                          {cohort.type === '辯・∴蟆ｽ縺咲裸蛟咏ｾ､繝ｪ繧ｹ繧ｯ鄒､' && '髟ｷ譛滉ｼ第嚊蜿門ｾ励→蠖ｹ蜑ｲ縺ｮ隕狗峩縺励√く繝｣繝ｪ繧｢逶ｸ隲・・}
                          {cohort.type === '邱丞粋逧・ｦ∵髪謠ｴ鄒､' && '蛹・峡逧・髪謠ｴ繝励Ο繧ｰ繝ｩ繝縺ｨ蛟句挨繝輔か繝ｭ繝ｼ繧｢繝・・縲・}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">螳夂捩邇・ {cohort.retentionRate}%</p>
                        <p className="text-xs text-gray-500">逕溽肇諤ｧ: {cohort.productivityScore}轤ｹ</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 繧ｵ繝槭Μ繝ｼ邨ｱ險・*/}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">蛛･蠎ｷ蜆ｪ濶ｯ閨ｷ蜩｡邇・/CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(wellbeingCohorts.filter(c => c.healthScore >= 80).reduce((sum, c) => sum + c.count, 0) / wellbeingCohorts.reduce((sum, c) => sum + c.count, 0) * 100)}%
                </p>
                <p className="text-sm text-gray-600 mt-1">蛛･蠎ｷ繧ｹ繧ｳ繧｢80莉･荳・/p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">鬮倥せ繝医Ξ繧ｹ閠・/CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-600">
                  {wellbeingCohorts.filter(c => c.stressLevel >= 70).reduce((sum, c) => sum + c.count, 0)}蜷・
                </p>
                <p className="text-sm text-gray-600 mt-1">隕∽ｻ句・蟇ｾ雎｡</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">蟷ｳ蝮ⅣLB繧ｹ繧ｳ繧｢</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(wellbeingCohorts.reduce((sum, c) => sum + c.workLifeBalance * c.count, 0) / wellbeingCohorts.reduce((sum, c) => sum + c.count, 0))}
                </p>
                <p className="text-sm text-gray-600 mt-1">100轤ｹ貅轤ｹ</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">謾ｹ蝟・庄閭ｽ諤ｧ</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-purple-600">68%</p>
                <p className="text-sm text-gray-600 mt-1">莉句・縺ｫ繧医ｋ謾ｹ蝟・ｦ玖ｾｼ縺ｿ</p>
              </CardContent>
            </Card>
          </div>

          {/* 繧｢繧ｯ繧ｷ繝ｧ繝ｳ繝懊ち繝ｳ */}
          <div className="flex gap-4">
            <button 
              onClick={() => exportToPDF({
                title: '繧ｦ繧ｧ繝ｫ繝薙・繧､繝ｳ繧ｰ繧ｳ繝帙・繝亥・譫舌Ξ繝昴・繝・,
                facility: selectedFacility,
                reportType: 'wellbeing-cohort',
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

export default function WellbeingCohortPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WellbeingCohortContent />
    </Suspense>
  );
}