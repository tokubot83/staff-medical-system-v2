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
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Area
} from 'recharts';

interface LifeEventCohort {
  event: string;
  count: number;
  avgRetentionBefore: number;
  avgRetentionAfter: number;
  impactScore: number;
  recoveryTime: number;
  supportNeeded: string;
}

function LifeEventCohortContent() {
  const searchParams = useSearchParams();
  const facilityParam = searchParams.get('facility') || '';
  const [selectedFacility, setSelectedFacility] = useState(facilityParam || '蜈ｨ譁ｽ險ｭ');
  const [selectedEventType, setSelectedEventType] = useState('all');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('all');

  // 繝ｩ繧､繝輔う繝吶Φ繝医・螳夂ｾｩ
  const lifeEventTypes = [
    '邨仙ｩ・,
    '蜃ｺ逕｣繝ｻ閧ｲ蜈・,
    '莉玖ｭｷ・郁ｦｪ・・,
    '霆｢螻・,
    '蟄蝉ｾ帙・騾ｲ蟄ｦ',
    '驟榊・閠・・霆｢蜍､',
    '蛛･蠎ｷ蝠城｡・,
    '螳ｶ譌上・逞・ｰ・
  ];

  // 繝ｩ繧､繝輔う繝吶Φ繝医さ繝帙・繝医ョ繝ｼ繧ｿ縺ｮ逕滓・
  const lifeEventCohorts = useMemo(() => {
    const staffList = Object.values(staffDatabase).filter(staff => {
      if (selectedFacility !== '蜈ｨ譁ｽ險ｭ' && staff.facility !== selectedFacility) return false;
      if (selectedAgeGroup !== 'all') {
        const ageGroups = {
          '20-29': [20, 29],
          '30-39': [30, 39],
          '40-49': [40, 49],
          '50+': [50, 100]
        };
        const [min, max] = ageGroups[selectedAgeGroup as keyof typeof ageGroups];
        if (staff.age < min || staff.age > max) return false;
      }
      return true;
    });

    // 繝ｩ繧､繝輔う繝吶Φ繝亥挨縺ｫ繧ｳ繝帙・繝医ｒ逕滓・・医す繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ・・
    const cohorts: LifeEventCohort[] = lifeEventTypes.map(event => {
      // 繧､繝吶Φ繝育匱逕溽｢ｺ邇・↓蝓ｺ縺･縺・※繧ｹ繧ｿ繝・ヵ繧貞・鬘・
      let eventProbability = 0;
      switch (event) {
        case '邨仙ｩ・: eventProbability = 0.15; break;
        case '蜃ｺ逕｣繝ｻ閧ｲ蜈・: eventProbability = 0.20; break;
        case '莉玖ｭｷ・郁ｦｪ・・: eventProbability = 0.10; break;
        case '霆｢螻・: eventProbability = 0.08; break;
        case '蟄蝉ｾ帙・騾ｲ蟄ｦ': eventProbability = 0.12; break;
        case '驟榊・閠・・霆｢蜍､': eventProbability = 0.05; break;
        case '蛛･蠎ｷ蝠城｡・: eventProbability = 0.06; break;
        case '螳ｶ譌上・逞・ｰ・: eventProbability = 0.07; break;
      }

      const affectedStaff = staffList.filter(() => Math.random() < eventProbability);
      const count = affectedStaff.length;

      if (count === 0) return null;

      // 繧､繝吶Φ繝亥燕蠕後・螳夂捩邇・ｒ險育ｮ・
      const avgRetentionBefore = 85 + Math.random() * 10;
      let avgRetentionAfter = avgRetentionBefore;
      let impactScore = 0;
      let recoveryTime = 0;
      let supportNeeded = '';

      switch (event) {
        case '邨仙ｩ・:
          avgRetentionAfter = avgRetentionBefore + 5;
          impactScore = -5;
          recoveryTime = 0;
          supportNeeded = '逾昴＞驥大宛蠎ｦ縲∵眠蟀壻ｼ第嚊';
          break;
        case '蜃ｺ逕｣繝ｻ閧ｲ蜈・:
          avgRetentionAfter = avgRetentionBefore - 15;
          impactScore = 25;
          recoveryTime = 18;
          supportNeeded = '閧ｲ蜈蝉ｼ第･ｭ縲∵凾遏ｭ蜍､蜍吶∽ｿ晁ご謾ｯ謠ｴ';
          break;
        case '莉玖ｭｷ・郁ｦｪ・・:
          avgRetentionAfter = avgRetentionBefore - 20;
          impactScore = 35;
          recoveryTime = 24;
          supportNeeded = '莉玖ｭｷ莨第･ｭ縲√ヵ繝ｬ繝・け繧ｹ蜍､蜍吶∽ｻ玖ｭｷ謾ｯ謠ｴ驥・;
          break;
        case '霆｢螻・:
          avgRetentionAfter = avgRetentionBefore - 10;
          impactScore = 15;
          recoveryTime = 6;
          supportNeeded = '繝ｪ繝｢繝ｼ繝医Ρ繝ｼ繧ｯ縲∬ｻ｢蜍､謾ｯ謠ｴ';
          break;
        case '蟄蝉ｾ帙・騾ｲ蟄ｦ':
          avgRetentionAfter = avgRetentionBefore - 8;
          impactScore = 12;
          recoveryTime = 3;
          supportNeeded = '謨呵ご雉・≡謾ｯ謠ｴ縲∝ｭｦ雋ｻ陬懷勧';
          break;
        case '驟榊・閠・・霆｢蜍､':
          avgRetentionAfter = avgRetentionBefore - 25;
          impactScore = 40;
          recoveryTime = 12;
          supportNeeded = '繝ｪ繝｢繝ｼ繝医Ρ繝ｼ繧ｯ縲∝挨螻・焔蠖・;
          break;
        case '蛛･蠎ｷ蝠城｡・:
          avgRetentionAfter = avgRetentionBefore - 18;
          impactScore = 30;
          recoveryTime = 12;
          supportNeeded = '蛛･蠎ｷ邂｡逅・髪謠ｴ縲∝現逋りｲｻ陬懷勧';
          break;
        case '螳ｶ譌上・逞・ｰ・:
          avgRetentionAfter = avgRetentionBefore - 12;
          impactScore = 20;
          recoveryTime = 9;
          supportNeeded = '逵玖ｭｷ莨第嚊縲√ヵ繝ｬ繝・け繧ｹ蜍､蜍・;
          break;
      }

      return {
        event,
        count,
        avgRetentionBefore: Math.round(avgRetentionBefore),
        avgRetentionAfter: Math.round(avgRetentionAfter),
        impactScore: Math.round(impactScore),
        recoveryTime,
        supportNeeded
      };
    }).filter(Boolean) as LifeEventCohort[];

    if (selectedEventType !== 'all') {
      return cohorts.filter(c => c.event === selectedEventType);
    }

    return cohorts;
  }, [selectedFacility, selectedEventType, selectedAgeGroup]);

  // 蟷ｴ鮨｢螻､蛻･繝ｩ繧､繝輔う繝吶Φ繝育匱逕溽紫
  const ageGroupEventData = useMemo(() => {
    const ageGroups = ['20-29豁ｳ', '30-39豁ｳ', '40-49豁ｳ', '50豁ｳ莉･荳・];
    return ageGroups.map(age => ({
      age,
      '邨仙ｩ・: age === '20-29豁ｳ' ? 35 : age === '30-39豁ｳ' ? 20 : 5,
      '蜃ｺ逕｣繝ｻ閧ｲ蜈・: age === '20-29豁ｳ' ? 15 : age === '30-39豁ｳ' ? 40 : age === '40-49豁ｳ' ? 10 : 2,
      '莉玖ｭｷ': age === '40-49豁ｳ' ? 25 : age === '50豁ｳ莉･荳・ ? 35 : 5,
      '霆｢螻・: 15 + Math.random() * 10
    }));
  }, []);

  // 繝ｩ繧､繝輔う繝吶Φ繝亥ｽｱ髻ｿ縺ｮ譎らｳｻ蛻励ョ繝ｼ繧ｿ
  const timeSeriesImpactData = useMemo(() => {
    const months = Array.from({ length: 24 }, (_, i) => i + 1);
    return months.map(month => {
      const baseRetention = 90;
      const impactMonth = 6;
      let retention = baseRetention;
      
      if (month >= impactMonth) {
        const monthsSinceEvent = month - impactMonth;
        const maxDrop = 20;
        const recoveryRate = 0.8;
        retention = baseRetention - maxDrop * Math.exp(-monthsSinceEvent * recoveryRate / 10);
      }

      return {
        month: `${month}繝ｶ譛・,
        '螳夂捩邇・: Math.round(retention),
        '繧ｨ繝ｳ繧ｲ繝ｼ繧ｸ繝｡繝ｳ繝・: Math.round(retention * 0.8 + Math.random() * 10),
        '繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ': Math.round(retention * 0.7 + Math.random() * 15)
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

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="繝ｩ繧､繝輔う繝吶Φ繝医さ繝帙・繝亥・譫・ />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* 繝倥ャ繝繝ｼ */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold">繝ｩ繧､繝輔う繝吶Φ繝医さ繝帙・繝亥・譫・/h1>
            <p className="text-gray-600 mt-2">
              邨仙ｩ壹・蜃ｺ逕｣繝ｻ莉玖ｭｷ縺ｪ縺ｩ縺ｮ繝ｩ繧､繝輔う繝吶Φ繝医′閨ｷ蜩｡縺ｮ螳夂捩繝ｻ繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ縺ｫ荳弱∴繧句ｽｱ髻ｿ繧貞・譫・
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
                  繝ｩ繧､繝輔う繝吶Φ繝・
                </label>
                <select
                  value={selectedEventType}
                  onChange={(e) => setSelectedEventType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">蜈ｨ縺ｦ縺ｮ繧､繝吶Φ繝・/option>
                  {lifeEventTypes.map(event => (
                    <option key={event} value={event}>{event}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  蟷ｴ鮨｢螻､
                </label>
                <select
                  value={selectedAgeGroup}
                  onChange={(e) => setSelectedAgeGroup(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">蜈ｨ蟷ｴ鮨｢</option>
                  <option value="20-29">20-29豁ｳ</option>
                  <option value="30-39">30-39豁ｳ</option>
                  <option value="40-49">40-49豁ｳ</option>
                  <option value="50+">50豁ｳ莉･荳・/option>
                </select>
              </div>
            </div>
          </div>

          {/* 繝ｩ繧､繝輔う繝吶Φ繝亥ｽｱ髻ｿ蠎ｦ蛻・梵 */}
          <Card>
            <CardHeader>
              <CardTitle>繝ｩ繧､繝輔う繝吶Φ繝亥挨蠖ｱ髻ｿ蠎ｦ蛻・梵</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={lifeEventCohorts} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 50]} />
                    <YAxis dataKey="event" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="impactScore" name="蠖ｱ髻ｿ蠎ｦ繧ｹ繧ｳ繧｢" fill="#EF4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 螳夂捩邇・∈縺ｮ蠖ｱ髻ｿ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>繧､繝吶Φ繝亥燕蠕後・螳夂捩邇・､牙喧</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={lifeEventCohorts}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="event" angle={-45} textAnchor="end" height={80} />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="avgRetentionBefore" name="繧､繝吶Φ繝亥燕" fill="#3B82F6" />
                      <Bar dataKey="avgRetentionAfter" name="繧､繝吶Φ繝亥ｾ・ fill="#EF4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>蝗槫ｾｩ譛滄俣縺ｮ豈碑ｼ・/CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={lifeEventCohorts}
                        dataKey="recoveryTime"
                        nameKey="event"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ event, recoveryTime }) => `${event}: ${recoveryTime}繝ｶ譛・}
                      >
                        {lifeEventCohorts.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 蟷ｴ鮨｢螻､蛻･繝ｩ繧､繝輔う繝吶Φ繝育匱逕溽紫 */}
          <Card>
            <CardHeader>
              <CardTitle>蟷ｴ鮨｢螻､蛻･繝ｩ繧､繝輔う繝吶Φ繝育匱逕溽紫</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ageGroupEventData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" />
                    <YAxis tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value: any) => `${value}%`} />
                    <Legend />
                    <Bar dataKey="邨仙ｩ・ stackId="a" fill="#3B82F6" />
                    <Bar dataKey="蜃ｺ逕｣繝ｻ閧ｲ蜈・ stackId="a" fill="#10B981" />
                    <Bar dataKey="莉玖ｭｷ" stackId="a" fill="#F59E0B" />
                    <Bar dataKey="霆｢螻・ stackId="a" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 譎らｳｻ蛻怜ｽｱ髻ｿ蛻・梵 */}
          <Card>
            <CardHeader>
              <CardTitle>繝ｩ繧､繝輔う繝吶Φ繝亥ｾ後・蝗槫ｾｩ譖ｲ邱・/CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={timeSeriesImpactData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value: any) => `${value}%`} />
                    <Legend />
                    <Area type="monotone" dataKey="螳夂捩邇・ fill="#3B82F6" fillOpacity={0.3} stroke="#3B82F6" />
                    <Line type="monotone" dataKey="繧ｨ繝ｳ繧ｲ繝ｼ繧ｸ繝｡繝ｳ繝・ stroke="#10B981" strokeWidth={2} />
                    <Line type="monotone" dataKey="繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ" stroke="#F59E0B" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 謾ｯ謠ｴ遲紋ｸ隕ｧ */}
          <Card>
            <CardHeader>
              <CardTitle>繝ｩ繧､繝輔う繝吶Φ繝亥挨謗ｨ螂ｨ謾ｯ謠ｴ遲・/CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lifeEventCohorts.map((cohort, index) => (
                  <div key={cohort.event} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{cohort.event}</h4>
                        <p className="text-sm text-gray-600">{cohort.supportNeeded}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">蟇ｾ雎｡閠・焚: {cohort.count}蜷・/p>
                        <p className="text-xs text-gray-500">蝗槫ｾｩ譛滄俣: {cohort.recoveryTime}繝ｶ譛・/p>
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
                <CardTitle className="text-base">譛繧ょｽｱ髻ｿ縺ｮ螟ｧ縺阪＞繧､繝吶Φ繝・/CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-600">
                  {lifeEventCohorts.reduce((max, cohort) => 
                    cohort.impactScore > max.impactScore ? cohort : max
                  ).event}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  蠖ｱ髻ｿ蠎ｦ繧ｹ繧ｳ繧｢: {Math.max(...lifeEventCohorts.map(c => c.impactScore))}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">蟷ｳ蝮・屓蠕ｩ譛滄俣</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-amber-600">
                  {Math.round(lifeEventCohorts.reduce((sum, c) => sum + c.recoveryTime, 0) / lifeEventCohorts.length)}繝ｶ譛・
                </p>
                <p className="text-sm text-gray-600 mt-1">蜈ｨ繧､繝吶Φ繝亥ｹｳ蝮・/p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">蠖ｱ髻ｿ繧貞女縺代ｋ閨ｷ蜩｡謨ｰ</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600">
                  {lifeEventCohorts.reduce((sum, c) => sum + c.count, 0)}蜷・
                </p>
                <p className="text-sm text-gray-600 mt-1">蟷ｴ髢捺耳螳・/p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">謾ｯ謠ｴ遲悶き繝舌・邇・/CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">78%</p>
                <p className="text-sm text-gray-600 mt-1">蛻ｶ蠎ｦ蛻ｩ逕ｨ蜿ｯ閭ｽ蜑ｲ蜷・/p>
              </CardContent>
            </Card>
          </div>

          {/* 繧｢繧ｯ繧ｷ繝ｧ繝ｳ繝懊ち繝ｳ */}
          <div className="flex gap-4">
            <button 
              onClick={() => exportToPDF({
                title: '繝ｩ繧､繝輔う繝吶Φ繝医さ繝帙・繝亥・譫舌Ξ繝昴・繝・,
                facility: selectedFacility,
                reportType: 'life-event-cohort',
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

export default function LifeEventCohortPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LifeEventCohortContent />
    </Suspense>
  );
}