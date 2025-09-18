'use client';

import React, { Suspense, useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import CommonHeader from '@/components/CommonHeader';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import { exportToPDF } from '@/utils/pdfExport';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown, Activity, CheckCircle, XCircle, AlertCircle, Calendar, Users, DollarSign } from 'lucide-react';
import { generateAllCohortDemoData } from '@/utils/generateCohortDemoData';
import { StaffDetail } from '@/types/staff';

interface InterventionData {
  id: string;
  name: string;
  type: 'training' | 'wellbeing' | 'retention' | 'performance';
  startDate: string;
  targetGroup: string;
  status: 'completed' | 'ongoing' | 'planned';
  metrics: {
    name: string;
    beforeValue: number;
    afterValue: number;
    improvement: number;
    target: number;
  }[];
  cost: number;
  participants: number;
  roi: number;
}

interface TimeSeriesData {
  month: string;
  interventionGroup: number;
  controlGroup: number;
  difference: number;
}

function Content() {
  const searchParams = useSearchParams();
  const facilityParam = searchParams.get('facility') || '';
  
  const [selectedFacility, setSelectedFacility] = useState<string>('蜈ｨ譁ｽ險ｭ');
  const [selectedIntervention, setSelectedIntervention] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('6months');
  const [comparisonMode, setComparisonMode] = useState<'before-after' | 'control-group'>('before-after');
  const [staffData, setStaffData] = useState<StaffDetail[]>([]);

  // 繝・Δ繝・・繧ｿ逕滓・
  useEffect(() => {
    const data = generateAllCohortDemoData();
    setStaffData(data);
  }, []);

  // 譁ｽ遲悶ョ繝ｼ繧ｿ・医ョ繝｢・・
  const interventions: InterventionData[] = [
    {
      id: '1',
      name: '繝ｪ繝ｼ繝繝ｼ繧ｷ繝・・遐比ｿｮ繝励Ο繧ｰ繝ｩ繝',
      type: 'training',
      startDate: '2024-04-01',
      targetGroup: '荳ｭ蝣・恚隴ｷ蟶ｫ・・-10蟷ｴ逶ｮ・・,
      status: 'completed',
      metrics: [
        { name: '繝ｪ繝ｼ繝繝ｼ繧ｷ繝・・繧ｹ繧ｳ繧｢', beforeValue: 3.2, afterValue: 4.1, improvement: 28.1, target: 4.0 },
        { name: '繝√・繝逕溽肇諤ｧ', beforeValue: 72, afterValue: 85, improvement: 18.1, target: 80 },
        { name: '驛ｨ荳区ｺ雜ｳ蠎ｦ', beforeValue: 68, afterValue: 82, improvement: 20.6, target: 80 },
        { name: '髮｢閨ｷ諢丞髄', beforeValue: 25, afterValue: 15, improvement: -40.0, target: 15 }
      ],
      cost: 2500000,
      participants: 45,
      roi: 320
    },
    {
      id: '2',
      name: '繝｡繝ｳ繧ｿ繝ｫ繝倥Ν繧ｹ繧ｵ繝昴・繝亥宛蠎ｦ',
      type: 'wellbeing',
      startDate: '2024-01-01',
      targetGroup: '蜈ｨ閨ｷ蜩｡',
      status: 'ongoing',
      metrics: [
        { name: '繧ｹ繝医Ξ繧ｹ繝ｬ繝吶Ν', beforeValue: 65, afterValue: 48, improvement: -26.2, target: 50 },
        { name: '繝ｯ繝ｼ繧ｯ繧ｨ繝ｳ繧ｲ繝ｼ繧ｸ繝｡繝ｳ繝・, beforeValue: 68, afterValue: 78, improvement: 14.7, target: 75 },
        { name: '逞・ｬ譌･謨ｰ', beforeValue: 8.5, afterValue: 5.2, improvement: -38.8, target: 5.0 },
        { name: '繧ｫ繧ｦ繝ｳ繧ｻ繝ｪ繝ｳ繧ｰ蛻ｩ逕ｨ邇・, beforeValue: 12, afterValue: 35, improvement: 191.7, target: 30 }
      ],
      cost: 4800000,
      participants: 165,
      roi: 280
    },
    {
      id: '3',
      name: '譁ｰ莠ｺ螳夂捩謾ｯ謠ｴ繝励Ο繧ｰ繝ｩ繝',
      type: 'retention',
      startDate: '2024-06-01',
      targetGroup: '蜈･閨ｷ1蟷ｴ逶ｮ閨ｷ蜩｡',
      status: 'ongoing',
      metrics: [
        { name: '1蟷ｴ逶ｮ螳夂捩邇・, beforeValue: 75, afterValue: 88, improvement: 17.3, target: 85 },
        { name: 'OJT貅雜ｳ蠎ｦ', beforeValue: 65, afterValue: 85, improvement: 30.8, target: 80 },
        { name: '讌ｭ蜍咏ｿ堤・蠎ｦ', beforeValue: 60, afterValue: 78, improvement: 30.0, target: 75 },
        { name: '繝｡繝ｳ繧ｿ繝ｼ隧穂ｾ｡', beforeValue: 70, afterValue: 88, improvement: 25.7, target: 85 }
      ],
      cost: 1800000,
      participants: 25,
      roi: 450
    },
    {
      id: '4',
      name: '繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ蜷台ｸ頑命遲・,
      type: 'performance',
      startDate: '2024-03-01',
      targetGroup: '逵玖ｭｷ驛ｨ',
      status: 'completed',
      metrics: [
        { name: '讌ｭ蜍吝柑邇・, beforeValue: 72, afterValue: 85, improvement: 18.1, target: 80 },
        { name: '謔｣閠・ｺ雜ｳ蠎ｦ', beforeValue: 85, afterValue: 92, improvement: 8.2, target: 90 },
        { name: '繧､繝ｳ繧ｷ繝・Φ繝育紫', beforeValue: 2.5, afterValue: 1.2, improvement: -52.0, target: 1.5 },
        { name: '繧ｹ繧ｭ繝ｫ隧穂ｾ｡', beforeValue: 3.5, afterValue: 4.2, improvement: 20.0, target: 4.0 }
      ],
      cost: 3200000,
      participants: 85,
      roi: 380
    }
  ];

  // 驕ｸ謚槭＆繧後◆譁ｽ遲・
  const selectedInterventionData = useMemo(() => {
    if (selectedIntervention === 'all') return interventions;
    return interventions.filter(i => i.id === selectedIntervention);
  }, [selectedIntervention]);

  // 譎らｳｻ蛻励ョ繝ｼ繧ｿ・医ョ繝｢・・
  const timeSeriesData: TimeSeriesData[] = [
    { month: '1譛・, interventionGroup: 72, controlGroup: 71, difference: 1 },
    { month: '2譛・, interventionGroup: 74, controlGroup: 72, difference: 2 },
    { month: '3譛・, interventionGroup: 78, controlGroup: 71, difference: 7 },
    { month: '4譛・, interventionGroup: 82, controlGroup: 73, difference: 9 },
    { month: '5譛・, interventionGroup: 85, controlGroup: 72, difference: 13 },
    { month: '6譛・, interventionGroup: 88, controlGroup: 74, difference: 14 }
  ];

  // 邱丞粋蜉ｹ譫懊・險育ｮ・
  const overallImpact = useMemo(() => {
    const totalCost = selectedInterventionData.reduce((sum, i) => sum + i.cost, 0);
    const totalParticipants = selectedInterventionData.reduce((sum, i) => sum + i.participants, 0);
    const avgROI = selectedInterventionData.reduce((sum, i) => sum + i.roi, 0) / selectedInterventionData.length;
    const avgImprovement = selectedInterventionData.reduce((sum, i) => {
      const metricAvg = i.metrics.reduce((mSum, m) => mSum + Math.abs(m.improvement), 0) / i.metrics.length;
      return sum + metricAvg;
    }, 0) / selectedInterventionData.length;

    return {
      totalCost,
      totalParticipants,
      avgROI: Math.round(avgROI),
      avgImprovement: Math.round(avgImprovement * 10) / 10
    };
  }, [selectedInterventionData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'ongoing': return 'bg-blue-100 text-blue-800';
      case 'planned': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImprovementColor = (improvement: number, isNegativeGood: boolean = false) => {
    const absImprovement = Math.abs(improvement);
    const isGood = isNegativeGood ? improvement < 0 : improvement > 0;
    
    if (isGood) {
      if (absImprovement > 20) return 'text-green-600';
      if (absImprovement > 10) return 'text-green-500';
      return 'text-green-400';
    } else {
      if (absImprovement > 20) return 'text-red-600';
      if (absImprovement > 10) return 'text-red-500';
      return 'text-red-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="譁ｽ遲門柑譫懈ｸｬ螳・ />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* 繝倥ャ繝繝ｼ */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold">譁ｽ遲門柑譫懈ｸｬ螳・/h1>
            <p className="text-gray-600 mt-2">莠ｺ莠区命遲門ｰ主・蜑榊ｾ後・繧ｳ繝帙・繝域ｯ碑ｼ・↓繧医ｊ縲∵命遲悶・蜉ｹ譫懊ｒ螳夐㍼隧穂ｾ｡</p>
            {facilityParam && (
              <p className="text-sm text-gray-500 mt-1">蟇ｾ雎｡譁ｽ險ｭ: {facilityParam}</p>
            )}
          </div>

          {/* 繝輔ぅ繝ｫ繧ｿ繝ｼ */}
          <Card className="pdf-exclude">
            <CardHeader>
              <CardTitle>蛻・梵險ｭ螳・/CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">譁ｽ險ｭ</label>
                  <Select value={selectedFacility} onValueChange={setSelectedFacility}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="蜈ｨ譁ｽ險ｭ">蜈ｨ譁ｽ險ｭ</SelectItem>
                      <SelectItem value="蟆丞次逞・劼">蟆丞次逞・劼</SelectItem>
                      <SelectItem value="遶狗･槭Μ繝上ン繝ｪ繝・・繧ｷ繝ｧ繝ｳ貂ｩ豕臥羅髯｢">遶狗･槭Μ繝上ン繝ｪ繝・・繧ｷ繝ｧ繝ｳ貂ｩ豕臥羅髯｢</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">譁ｽ遲・/label>
                  <Select value={selectedIntervention} onValueChange={setSelectedIntervention}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">縺吶∋縺ｦ縺ｮ譁ｽ遲・/SelectItem>
                      {interventions.map(i => (
                        <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">譛滄俣</label>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3months">3繝ｶ譛・/SelectItem>
                      <SelectItem value="6months">6繝ｶ譛・/SelectItem>
                      <SelectItem value="1year">1蟷ｴ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">豈碑ｼ・婿豕・/label>
                  <Select value={comparisonMode} onValueChange={(value: any) => setComparisonMode(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="before-after">蜑榊ｾ梧ｯ碑ｼ・/SelectItem>
                      <SelectItem value="control-group">蟇ｾ辣ｧ鄒､豈碑ｼ・/SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 繧ｵ繝槭Μ繝ｼ繧ｫ繝ｼ繝・*/}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">螳滓命譁ｽ遲匁焚</p>
                    <p className="text-2xl font-bold">{selectedInterventionData.length}</p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">蟇ｾ雎｡閠・焚</p>
                    <p className="text-2xl font-bold">{overallImpact.totalParticipants}蜷・/p>
                  </div>
                  <Users className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">蟷ｳ蝮・隼蝟・紫</p>
                    <p className="text-2xl font-bold">{overallImpact.avgImprovement}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">蟷ｳ蝮⑲OI</p>
                    <p className="text-2xl font-bold">{overallImpact.avgROI}%</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 譁ｽ遲紋ｸ隕ｧ縺ｨ蜉ｹ譫・*/}
          <Card>
            <CardHeader>
              <CardTitle>譁ｽ遲門柑譫應ｸ隕ｧ</CardTitle>
              <CardDescription>蜷・命遲悶・螳滓命迥ｶ豕√→荳ｻ隕∵欠讓吶・謾ｹ蝟・憾豕・/CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {selectedInterventionData.map(intervention => (
                  <div key={intervention.id} className="border rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{intervention.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">蟇ｾ雎｡: {intervention.targetGroup}</p>
                        <p className="text-sm text-gray-500">髢句ｧ区律: {intervention.startDate}</p>
                      </div>
                      <Badge className={getStatusColor(intervention.status)}>
                        {intervention.status === 'completed' ? '螳御ｺ・ : intervention.status === 'ongoing' ? '螳滓命荳ｭ' : '險育判荳ｭ'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      {intervention.metrics.map((metric, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm font-medium text-gray-700">{metric.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-500">{metric.beforeValue}</span>
                            <span className="text-gray-400">竊・/span>
                            <span className="text-sm font-semibold">{metric.afterValue}</span>
                          </div>
                          <p className={`text-sm font-semibold mt-1 ${getImprovementColor(
                            metric.improvement,
                            metric.name.includes('髮｢閨ｷ') || metric.name.includes('繧ｹ繝医Ξ繧ｹ') || metric.name.includes('繧､繝ｳ繧ｷ繝・Φ繝・) || metric.name.includes('逞・ｬ')
                          )}`}>
                            {metric.improvement > 0 ? '+' : ''}{metric.improvement}%
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="flex gap-6 text-sm">
                        <span>蜿ょ刈閠・ <span className="font-semibold">{intervention.participants}蜷・/span></span>
                        <span>謚戊ｳ・｡・ <span className="font-semibold">ﾂ･{(intervention.cost ?? 0).toLocaleString()}</span></span>
                        <span>ROI: <span className="font-semibold text-green-600">{intervention.roi}%</span></span>
                      </div>
                      <div className="flex gap-2">
                        {intervention.metrics.every(m => {
                          const isNegativeGood = m.name.includes('髮｢閨ｷ') || m.name.includes('繧ｹ繝医Ξ繧ｹ') || m.name.includes('繧､繝ｳ繧ｷ繝・Φ繝・) || m.name.includes('逞・ｬ');
                          return isNegativeGood ? m.afterValue <= m.target : m.afterValue >= m.target;
                        }) ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            逶ｮ讓咎＃謌・
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            荳驛ｨ譛ｪ驕疲・
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 譎らｳｻ蛻玲ｯ碑ｼ・*/}
          {comparisonMode === 'control-group' && (
            <Card>
              <CardHeader>
                <CardTitle>莉句・鄒､ vs 蟇ｾ辣ｧ鄒､豈碑ｼ・/CardTitle>
                <CardDescription>譁ｽ遲門ｮ滓命鄒､縺ｨ髱槫ｮ滓命鄒､縺ｮ繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ謗ｨ遘ｻ</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <ReferenceLine x="3譛・ stroke="#666" strokeDasharray="3 3" label="譁ｽ遲夜幕蟋・ />
                    <Line 
                      type="monotone" 
                      dataKey="interventionGroup" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="莉句・鄒､"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="controlGroup" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      name="蟇ｾ辣ｧ鄒､"
                    />
                  </LineChart>
                </ResponsiveContainer>

                <div className="mt-4">
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="difference" 
                        stroke="#10b981" 
                        fill="#10b981" 
                        fillOpacity={0.3}
                        name="蟾ｮ蛻・
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 蜉ｹ譫懊・謖∫ｶ壽ｧ蛻・梵 */}
          <Card>
            <CardHeader>
              <CardTitle>蜉ｹ譫懊・謖∫ｶ壽ｧ蛻・梵</CardTitle>
              <CardDescription>譁ｽ遲門ｮ滓命蠕後・蜉ｹ譫懈戟邯壽悄髢・/CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="font-semibold">繝ｪ繝ｼ繝繝ｼ繧ｷ繝・・遐比ｿｮ繝励Ο繧ｰ繝ｩ繝</p>
                      <p className="text-sm text-gray-600">蜉ｹ譫懈戟邯壽悄髢・ 12繝ｶ譛井ｻ･荳・/p>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-green-100 text-green-800">謖∫ｶ夂噪蜉ｹ譫・/Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Activity className="h-6 w-6 text-yellow-600" />
                    <div>
                      <p className="font-semibold">繝｡繝ｳ繧ｿ繝ｫ繝倥Ν繧ｹ繧ｵ繝昴・繝亥宛蠎ｦ</p>
                      <p className="text-sm text-gray-600">蜉ｹ譫懈戟邯壽悄髢・ 邯咏ｶ夂噪繧ｵ繝昴・繝亥ｿ・ｦ・/p>
                    </div>
                  </div>
                  <Badge variant="secondary">邯咏ｶ壽髪謠ｴ隕・/Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 繧ｳ繧ｹ繝亥柑譫懷・譫・*/}
          <Card>
            <CardHeader>
              <CardTitle>繧ｳ繧ｹ繝亥柑譫懷・譫・/CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={selectedInterventionData.map(i => ({
                  name: i.name.length > 20 ? i.name.substring(0, 20) + '...' : i.name,
                  cost: i.cost / 10000, // 荳・・蜊倅ｽ・
                  roi: i.roi,
                  costPerPerson: Math.round(i.cost / i.participants / 1000) // 蜊・・蜊倅ｽ・
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="cost" fill="#3b82f6" name="謚戊ｳ・｡搾ｼ井ｸ・・・・ />
                  <Bar yAxisId="right" dataKey="roi" fill="#10b981" name="ROI・・・・ />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 謗ｨ螂ｨ莠矩・*/}
          <Card>
            <CardHeader>
              <CardTitle>蛻・梵邨先棡縺九ｉ縺ｮ謗ｨ螂ｨ莠矩・/CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-semibold">鬮漏OI譁ｽ遲悶・讓ｪ螻暮幕</p>
                    <p className="text-sm text-gray-600">
                      譁ｰ莠ｺ螳夂捩謾ｯ謠ｴ繝励Ο繧ｰ繝ｩ繝・・OI 450%・峨・迚ｹ縺ｫ蜉ｹ譫懊′鬮倥￥縲・
                      莉悶・閨ｷ遞ｮ繝ｻ驛ｨ鄂ｲ縺ｸ縺ｮ螻暮幕繧呈耳螂ｨ縺励∪縺吶・
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-semibold">邯咏ｶ夂噪繝｢繝九ち繝ｪ繝ｳ繧ｰ縺ｮ蠢・ｦ∵ｧ</p>
                    <p className="text-sm text-gray-600">
                      繝｡繝ｳ繧ｿ繝ｫ繝倥Ν繧ｹ繧ｵ繝昴・繝医・邯咏ｶ夂噪縺ｪ謾ｯ謠ｴ縺悟ｿ・ｦ√〒縺吶・
                      螳壽悄逧・↑蜉ｹ譫懈ｸｬ螳壹→譁ｽ遲悶・謾ｹ蝟・ｒ陦後▲縺ｦ縺上□縺輔＞縲・
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-semibold">隍・粋逧・い繝励Ο繝ｼ繝√・謗ｨ騾ｲ</p>
                    <p className="text-sm text-gray-600">
                      蜊倅ｸ譁ｽ遲悶ｈ繧翫ｂ縲∬､・焚縺ｮ譁ｽ遲悶ｒ邨・∩蜷医ｏ縺帙ｋ縺薙→縺ｧ
                      逶ｸ荵怜柑譫懊′譛溷ｾ・〒縺阪∪縺吶・
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
                title: '譁ｽ遲門柑譫懈ｸｬ螳壹Ξ繝昴・繝・,
                facility: facilityParam || '蜈ｨ譁ｽ險ｭ',
                reportType: 'intervention-effect',
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

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Content />
    </Suspense>
  );
}