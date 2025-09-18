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
  Treemap,
  Cell
} from 'recharts';

interface LearningCohort {
  pattern: string;
  count: number;
  avgPerformanceGrowth: number;
  careerAdvancement: number;
  retentionRate: number;
  engagementScore: number;
  characteristics: string[];
}

function LearningCohortContent() {
  const searchParams = useSearchParams();
  const facilityParam = searchParams.get('facility') || '';
  const [selectedFacility, setSelectedFacility] = useState(facilityParam || '蜈ｨ譁ｽ險ｭ');
  const [selectedLearningType, setSelectedLearningType] = useState('all');
  const [selectedCareerStage, setSelectedCareerStage] = useState('all');

  // 蟄ｦ鄙偵ヱ繧ｿ繝ｼ繝ｳ縺ｮ螳夂ｾｩ
  const learningPatterns = [
    '遨肴･ｵ逧・ｭｦ鄙定・,
    '豸域･ｵ逧・ｭｦ鄙定・,
    '雉・ｼ蜿門ｾ鈴㍾隕門梛',
    'OJT驥崎ｦ門梛',
    '螟夜Κ遐比ｿｮ豢ｻ逕ｨ蝙・,
    '繝｡繝ｳ繧ｿ繝ｼ豢ｻ逕ｨ蝙・,
    '閾ｪ蟾ｱ蟄ｦ鄙貞梛',
    '辟｡髢｢蠢・梛'
  ];

  // 蟄ｦ鄙偵さ繝帙・繝医ョ繝ｼ繧ｿ縺ｮ逕滓・
  const learningCohorts = useMemo(() => {
    const staffList = Object.values(staffDatabase).filter(staff => {
      if (selectedFacility !== '蜈ｨ譁ｽ險ｭ' && staff.facility !== selectedFacility) return false;
      if (selectedCareerStage !== 'all') {
        const yearsOfService = new Date().getFullYear() - parseInt(staff.joinDate.match(/\d{4}/)?.[0] || '2020');
        switch (selectedCareerStage) {
          case 'early': if (yearsOfService > 3) return false; break;
          case 'mid': if (yearsOfService < 3 || yearsOfService > 10) return false; break;
        }
      }
      return true;
    });

    // 蟄ｦ鄙偵ヱ繧ｿ繝ｼ繝ｳ蛻･縺ｫ繧ｳ繝帙・繝医ｒ逕滓・
    const cohorts: LearningCohort[] = learningPatterns.map(pattern => {
      // 繝代ち繝ｼ繝ｳ縺ｫ蝓ｺ縺･縺・※繧ｹ繧ｿ繝・ヵ繧貞・鬘橸ｼ医す繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ・・
      let patternProbability = 0;
      let avgPerformanceGrowth = 0;
      let careerAdvancement = 0;
      let retentionRate = 0;
      let engagementScore = 0;
      let characteristics: string[] = [];

      switch (pattern) {
        case '遨肴･ｵ逧・ｭｦ鄙定・:
          patternProbability = 0.15;
          avgPerformanceGrowth = 25;
          careerAdvancement = 80;
          retentionRate = 92;
          engagementScore = 85;
          characteristics = ['遐比ｿｮ蜿ょ刈邇・00%', '雉・ｼ蜿門ｾ怜ｹｴ1莉ｶ莉･荳・, '繝｡繝ｳ繧ｿ繝ｼ蛻ｶ蠎ｦ蛻ｩ逕ｨ'];
          break;
        case '豸域･ｵ逧・ｭｦ鄙定・:
          patternProbability = 0.20;
          avgPerformanceGrowth = 5;
          careerAdvancement = 20;
          retentionRate = 65;
          engagementScore = 45;
          characteristics = ['遐比ｿｮ蜿ょ刈邇・0%莉･荳・, '雉・ｼ蜿門ｾ励↑縺・, '蟄ｦ鄙呈э谺ｲ菴・];
          break;
        case '雉・ｼ蜿門ｾ鈴㍾隕門梛':
          patternProbability = 0.12;
          avgPerformanceGrowth = 20;
          careerAdvancement = 70;
          retentionRate = 88;
          engagementScore = 78;
          characteristics = ['蟆る摩雉・ｼ隍・焚菫晄怏', '雉・ｼ謇句ｽ灘女邨ｦ', '繧ｭ繝｣繝ｪ繧｢繧｢繝・・蠢怜髄'];
          break;
        case 'OJT驥崎ｦ門梛':
          patternProbability = 0.18;
          avgPerformanceGrowth = 15;
          careerAdvancement = 50;
          retentionRate = 82;
          engagementScore = 72;
          characteristics = ['螳溷漁邨碁ｨ馴㍾隕・, '迴ｾ蝣ｴ蟄ｦ鄙貞ｿ怜髄', '繝√・繝蟄ｦ鄙貞盾蜉'];
          break;
        case '螟夜Κ遐比ｿｮ豢ｻ逕ｨ蝙・:
          patternProbability = 0.10;
          avgPerformanceGrowth = 18;
          careerAdvancement = 60;
          retentionRate = 85;
          engagementScore = 75;
          characteristics = ['螟夜Κ繧ｻ繝溘リ繝ｼ蜿ょ刈', '繝阪ャ繝医Ρ繝ｼ繧ｯ蠖｢謌・, '譛譁ｰ遏･隴倡ｿ貞ｾ・];
          break;
        case '繝｡繝ｳ繧ｿ繝ｼ豢ｻ逕ｨ蝙・:
          patternProbability = 0.08;
          avgPerformanceGrowth = 22;
          careerAdvancement = 65;
          retentionRate = 90;
          engagementScore = 82;
          characteristics = ['繝｡繝ｳ繧ｿ繝ｼ蛻ｶ蠎ｦ豢ｻ逕ｨ', '1on1螳滓命', '繝輔ぅ繝ｼ繝峨ヰ繝・け驥崎ｦ・];
          break;
        case '閾ｪ蟾ｱ蟄ｦ鄙貞梛':
          patternProbability = 0.12;
          avgPerformanceGrowth = 17;
          careerAdvancement = 55;
          retentionRate = 80;
          engagementScore = 70;
          characteristics = ['閾ｪ荳ｻ逧・ｭｦ鄙・, '繧ｪ繝ｳ繝ｩ繧､繝ｳ蟄ｦ鄙呈ｴｻ逕ｨ', '隱ｭ譖ｸ鄙呈・'];
          break;
        case '辟｡髢｢蠢・梛':
          patternProbability = 0.05;
          avgPerformanceGrowth = 0;
          careerAdvancement = 10;
          retentionRate = 55;
          engagementScore = 35;
          characteristics = ['蟄ｦ鄙呈ｩ滉ｼ壼屓驕ｿ', '迴ｾ迥ｶ邯ｭ謖∝ｿ怜髄', '謌宣聞諢乗ｬｲ縺ｪ縺・];
          break;
      }

      const cohortStaff = staffList.filter(() => Math.random() < patternProbability);
      const count = cohortStaff.length;

      if (count === 0) return null;

      return {
        pattern,
        count,
        avgPerformanceGrowth,
        careerAdvancement,
        retentionRate,
        engagementScore,
        characteristics
      };
    }).filter(Boolean) as LearningCohort[];

    if (selectedLearningType !== 'all') {
      return cohorts.filter(c => c.pattern === selectedLearningType);
    }

    return cohorts;
  }, [selectedFacility, selectedLearningType, selectedCareerStage]);

  // 遐比ｿｮ蜿ょ刈繝代ち繝ｼ繝ｳ繝・・繧ｿ
  const trainingParticipationData = useMemo(() => {
    const months = ['1譛・, '2譛・, '3譛・, '4譛・, '5譛・, '6譛・, '7譛・, '8譛・, '9譛・, '10譛・, '11譛・, '12譛・];
    return months.map(month => ({
      month,
      '遨肴･ｵ逧・ｭｦ鄙定・: 85 + Math.random() * 10,
      '讓呎ｺ也噪蟄ｦ鄙定・: 50 + Math.random() * 15,
      '豸域･ｵ逧・ｭｦ鄙定・: 15 + Math.random() * 10
    }));
  }, []);

  // 雉・ｼ蜿門ｾ励→繧ｭ繝｣繝ｪ繧｢騾ｲ螻輔・逶ｸ髢｢繝・・繧ｿ
  const qualificationCareerData = useMemo(() => {
    return [
      { qualifications: 0, promotion: 10, count: 120 },
      { qualifications: 1, promotion: 25, count: 180 },
      { qualifications: 2, promotion: 45, count: 150 },
      { qualifications: 3, promotion: 65, count: 100 },
      { qualifications: 4, promotion: 80, count: 60 },
      { qualifications: 5, promotion: 90, count: 30 }
    ];
  }, []);

  // 繝ｬ繝ｼ繝繝ｼ繝√Ε繝ｼ繝育畑繝・・繧ｿ
  const radarData = useMemo(() => {
    const metrics = ['謌宣聞邇・, '繧ｭ繝｣繝ｪ繧｢騾ｲ螻・, '螳夂捩邇・, '繧ｨ繝ｳ繧ｲ繝ｼ繧ｸ繝｡繝ｳ繝・, '蟄ｦ鄙呈兜雉⑲OI'];
    return metrics.map(metric => {
      const dataPoint: any = { metric };
      learningCohorts.forEach(cohort => {
        switch (metric) {
          case '謌宣聞邇・: dataPoint[cohort.pattern] = cohort.avgPerformanceGrowth * 4; break;
          case '繧ｭ繝｣繝ｪ繧｢騾ｲ螻・: dataPoint[cohort.pattern] = cohort.careerAdvancement; break;
          case '螳夂捩邇・: dataPoint[cohort.pattern] = cohort.retentionRate; break;
          case '繧ｨ繝ｳ繧ｲ繝ｼ繧ｸ繝｡繝ｳ繝・: dataPoint[cohort.pattern] = cohort.engagementScore; break;
          case '蟄ｦ鄙呈兜雉⑲OI': dataPoint[cohort.pattern] = (cohort.avgPerformanceGrowth * 3); break;
        }
      });
      return dataPoint;
    });
  }, [learningCohorts]);

  // 繝・Μ繝ｼ繝槭ャ繝礼畑繝・・繧ｿ・亥ｭｦ鄙呈ｴｻ蜍輔・蛻・ｸ・ｼ・
  const treemapData = useMemo(() => {
    return [
      { name: '蠢・育比ｿｮ', size: 3500, category: 'formal' },
      { name: '驕ｸ謚樒比ｿｮ', size: 2800, category: 'formal' },
      { name: '雉・ｼ蜿門ｾ・, size: 2200, category: 'certification' },
      { name: 'OJT', size: 4000, category: 'informal' },
      { name: '繝｡繝ｳ繧ｿ繝ｪ繝ｳ繧ｰ', size: 1800, category: 'informal' },
      { name: '閾ｪ荳ｻ蟄ｦ鄙・, size: 1500, category: 'self' },
      { name: '螟夜Κ繧ｻ繝溘リ繝ｼ', size: 1200, category: 'external' },
      { name: 'e繝ｩ繝ｼ繝九Φ繧ｰ', size: 2000, category: 'digital' }
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

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];
  const TREEMAP_COLORS = {
    formal: '#3B82F6',
    certification: '#10B981',
    informal: '#F59E0B',
    self: '#8B5CF6',
    external: '#EC4899',
    digital: '#14B8A6'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="蟄ｦ鄙偵・謌宣聞繧ｳ繝帙・繝亥・譫・ />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* 繝倥ャ繝繝ｼ */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold">蟄ｦ鄙偵・謌宣聞繧ｳ繝帙・繝亥・譫・/h1>
            <p className="text-gray-600 mt-2">
              遐比ｿｮ蜿ょ刈繝代ち繝ｼ繝ｳ縲∬ｳ・ｼ蜿門ｾ励√Γ繝ｳ繧ｿ繝ｼ蛻ｶ蠎ｦ蛻ｩ逕ｨ縺ｪ縺ｩ蟄ｦ鄙定｡悟虚蛻･縺ｮ謌宣聞霆瑚ｷ｡繧貞・譫・
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
                  蟄ｦ鄙偵ヱ繧ｿ繝ｼ繝ｳ
                </label>
                <select
                  value={selectedLearningType}
                  onChange={(e) => setSelectedLearningType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">蜈ｨ繝代ち繝ｼ繝ｳ</option>
                  {learningPatterns.map(pattern => (
                    <option key={pattern} value={pattern}>{pattern}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  繧ｭ繝｣繝ｪ繧｢繧ｹ繝・・繧ｸ
                </label>
                <select
                  value={selectedCareerStage}
                  onChange={(e) => setSelectedCareerStage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">蜈ｨ繧ｹ繝・・繧ｸ</option>
                  <option value="early">蛻晄悄・医・蟷ｴ・・/option>
                  <option value="mid">荳ｭ譛滂ｼ・縲・0蟷ｴ・・/option>
                </select>
              </div>
            </div>
          </div>

          {/* 蟄ｦ鄙偵ヱ繧ｿ繝ｼ繝ｳ蛻･邨ｱ險・*/}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {learningCohorts.slice(0, 4).map((cohort, index) => (
              <Card key={cohort.pattern}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{cohort.pattern}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">莠ｺ謨ｰ</span>
                      <span className="text-lg font-semibold">{cohort.count}蜷・/span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">謌宣聞邇・/span>
                      <span className={`text-lg font-semibold ${cohort.avgPerformanceGrowth >= 20 ? 'text-green-600' : 'text-amber-600'}`}>
                        +{cohort.avgPerformanceGrowth}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">螳夂捩邇・/span>
                      <span className="text-lg font-semibold text-blue-600">{cohort.retentionRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 蟄ｦ鄙偵ヱ繧ｿ繝ｼ繝ｳ蛻･謌先棡豈碑ｼ・*/}
          <Card>
            <CardHeader>
              <CardTitle>蟄ｦ鄙偵ヱ繧ｿ繝ｼ繝ｳ蛻･謌先棡謖・ｨ・/CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={learningCohorts} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="pattern" type="category" width={120} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="avgPerformanceGrowth" name="謌宣聞邇・%)" fill="#3B82F6" />
                    <Bar dataKey="careerAdvancement" name="譏・ｲ邇・%)" fill="#10B981" />
                    <Bar dataKey="retentionRate" name="螳夂捩邇・%)" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 遐比ｿｮ蜿ょ刈繝医Ξ繝ｳ繝・*/}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>譛亥挨遐比ｿｮ蜿ょ刈邇・耳遘ｻ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trainingParticipationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                      <Tooltip formatter={(value: any) => `${value}%`} />
                      <Legend />
                      <Line type="monotone" dataKey="遨肴･ｵ逧・ｭｦ鄙定・ stroke="#3B82F6" strokeWidth={2} />
                      <Line type="monotone" dataKey="讓呎ｺ也噪蟄ｦ鄙定・ stroke="#10B981" strokeWidth={2} />
                      <Line type="monotone" dataKey="豸域･ｵ逧・ｭｦ鄙定・ stroke="#EF4444" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>雉・ｼ蜿門ｾ励→譏・ｲ邇・・逶ｸ髢｢</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={qualificationCareerData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="qualifications" label={{ value: '菫晄怏雉・ｼ謨ｰ', position: 'insideBottom', offset: -5 }} />
                      <YAxis tickFormatter={(value) => `${value}%`} />
                      <Tooltip formatter={(value: any) => `${value}%`} />
                      <Bar dataKey="promotion" name="譏・ｲ邇・ fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 繝ｬ繝ｼ繝繝ｼ繝√Ε繝ｼ繝・*/}
          <Card>
            <CardHeader>
              <CardTitle>蟄ｦ鄙偵ヱ繧ｿ繝ｼ繝ｳ蛻･邱丞粋隧穂ｾ｡</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    {learningCohorts.slice(0, 4).map((cohort, index) => (
                      <Radar
                        key={cohort.pattern}
                        name={cohort.pattern}
                        dataKey={cohort.pattern}
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

          {/* 蟄ｦ鄙呈ｴｻ蜍輔・蛻・ｸ・*/}
          <Card>
            <CardHeader>
              <CardTitle>蟄ｦ鄙呈ｴｻ蜍輔・蛻・ｸ・ｼ域凾髢薙・繝ｼ繧ｹ・・/CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <Treemap
                    data={treemapData}
                    dataKey="size"
                    aspectRatio={4/3}
                    stroke="#fff"
                    fill="#8884d8"
                  >
                    {treemapData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={TREEMAP_COLORS[entry.category as keyof typeof TREEMAP_COLORS]} />
                    ))}
                  </Treemap>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex flex-wrap gap-4 justify-center">
                {Object.entries(TREEMAP_COLORS).map(([category, color]) => (
                  <div key={category} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: color }}></div>
                    <span className="text-sm capitalize">{category}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 迚ｹ諤ｧ荳隕ｧ */}
          <Card>
            <CardHeader>
              <CardTitle>蟄ｦ鄙偵ヱ繧ｿ繝ｼ繝ｳ蛻･迚ｹ諤ｧ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {learningCohorts.map((cohort) => (
                  <div key={cohort.pattern} className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold">{cohort.pattern}</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {cohort.characteristics.map((char, index) => (
                        <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {char}
                        </span>
                      ))}
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
                title: '蟄ｦ鄙偵・謌宣聞繧ｳ繝帙・繝亥・譫舌Ξ繝昴・繝・,
                facility: selectedFacility,
                reportType: 'learning-cohort',
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

export default function LearningCohortPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LearningCohortContent />
    </Suspense>
  );
}