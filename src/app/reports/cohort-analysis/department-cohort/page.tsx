'use client';

import React, { Suspense, useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import CommonHeader from '@/components/CommonHeader';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import { exportToPDF } from '@/utils/pdfExport';
import { BarChart, Bar, RadarChart, Radar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { Users, TrendingUp, Award, AlertCircle, Activity, Heart } from 'lucide-react';
import { generateAllCohortDemoData } from '@/utils/generateCohortDemoData';
import { StaffDetail } from '@/types/staff';

interface DepartmentCohortData {
  department: string;
  totalStaff: number;
  averageAge: number;
  averageTenure: number;
  retentionRate: number;
  performanceScore: number;
  stressLevel: number;
  engagementScore: number;
  trainingCompletionRate: number;
  leadershipPotential: number;
  riskScore: number;
}

interface ComparisonMetric {
  metric: string;
  [key: string]: any; // 蜍慕噪縺ｫ驛ｨ鄂ｲ蜷阪′繧ｭ繝ｼ縺ｨ縺ｪ繧・}

function Content() {
  const searchParams = useSearchParams();
  const facilityParam = searchParams.get('facility') || '';
  
  const [selectedFacility, setSelectedFacility] = useState<string>('蜈ｨ譁ｽ險ｭ');
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [comparisonType, setComparisonType] = useState<'performance' | 'risk' | 'development'>('performance');
  const [viewMode, setViewMode] = useState<'comparison' | 'ranking'>('comparison');
  const [staffData, setStaffData] = useState<StaffDetail[]>([]);

  // 繝・Δ繝・・繧ｿ逕滓・
  useEffect(() => {
    const data = generateAllCohortDemoData();
    setStaffData(data);
  }, []);

  // 驛ｨ鄂ｲ荳隕ｧ繧貞叙蠕・  const departments = useMemo(() => {
    const deptSet = new Set(
      staffData
        .filter(staff => selectedFacility === '蜈ｨ譁ｽ險ｭ' || staff.facility === selectedFacility)
        .map(staff => staff.department)
    );
    return Array.from(deptSet).sort();
  }, [staffData, selectedFacility]);

  // 蛻晄悄驕ｸ謚・  useEffect(() => {
    if (departments.length > 0 && selectedDepartments.length === 0) {
      setSelectedDepartments(departments.slice(0, 3)); // 譛蛻昴・3驛ｨ鄂ｲ繧帝∈謚・    }
  }, [departments]);

  // 驛ｨ鄂ｲ蛻･繝・・繧ｿ縺ｮ髮・ｨ・  const departmentCohortData = useMemo(() => {
    return departments.map(dept => {
      const deptStaff = staffData.filter(staff => 
        staff.department === dept &&
        (selectedFacility === '蜈ｨ譁ｽ險ｭ' || staff.facility === selectedFacility)
      );

      if (deptStaff.length === 0) {
        return null;
      }

      const avgAge = deptStaff.reduce((sum, s) => sum + s.age, 0) / deptStaff.length;
      // Calculate tenure from tenure string (e.g., "5蟷ｴ3繝ｶ譛・ -> 5.25)
      const avgTenure = deptStaff.reduce((sum, s) => {
        const tenureMatch = s.tenure.match(/(\d+)蟷ｴ/);
        const years = tenureMatch ? parseInt(tenureMatch[1]) : 0;
        return sum + years;
      }, 0) / deptStaff.length;
      const avgPerformance = deptStaff.reduce((sum, s) => sum + (s.evaluationData?.performance || 75), 0) / deptStaff.length;
      const avgStress = deptStaff.reduce((sum, s) => sum + (s.stressIndex || 50), 0) / deptStaff.length;
      const avgEngagement = deptStaff.reduce((sum, s) => sum + (s.engagement || 70), 0) / deptStaff.length;
      // Estimate training completion based on training history
      const trainingCompletion = deptStaff.filter(s => s.trainingHistory && s.trainingHistory.length > 3).length / deptStaff.length * 100;
      // Estimate leadership potential based on evaluation growth score
      const leadershipPotential = deptStaff.filter(s => s.evaluationData && s.evaluationData.growth > 3.5).length / deptStaff.length * 100;

      return {
        department: dept,
        totalStaff: deptStaff.length,
        averageAge: Math.round(avgAge),
        averageTenure: Math.round(avgTenure * 10) / 10,
        retentionRate: 85 + Math.random() * 10, // 繧ｷ繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ蛟､
        performanceScore: Math.round(avgPerformance / 20) / 10, // Convert 0-100 to 0-5 scale
        stressLevel: Math.round(avgStress),
        engagementScore: Math.round(avgEngagement),
        trainingCompletionRate: Math.round(trainingCompletion),
        leadershipPotential: Math.round(leadershipPotential),
        riskScore: Math.round((avgStress / 100) * (100 - avgEngagement) / 10)
      };
    }).filter(data => data !== null) as DepartmentCohortData[];
  }, [staffData, departments, selectedFacility]);

  // 豈碑ｼ・畑繝・・繧ｿ縺ｮ貅門ｙ
  const comparisonData = useMemo(() => {
    const metrics: ComparisonMetric[] = [
      { metric: '蟷ｳ蝮・ｹｴ鮨｢' },
      { metric: '蟷ｳ蝮・共邯壼ｹｴ謨ｰ' },
      { metric: '螳夂捩邇・ },
      { metric: '繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ' },
      { metric: '繧ｹ繝医Ξ繧ｹ繝ｬ繝吶Ν' },
      { metric: '繧ｨ繝ｳ繧ｲ繝ｼ繧ｸ繝｡繝ｳ繝・ },
      { metric: '遐比ｿｮ螳御ｺ・紫' },
      { metric: '繝ｪ繝ｼ繝繝ｼ繧ｷ繝・・貎懷惠蜉・ }
    ];

    selectedDepartments.forEach(dept => {
      const deptData = departmentCohortData.find(d => d.department === dept);
      if (deptData) {
        metrics[0][dept] = deptData.averageAge;
        metrics[1][dept] = deptData.averageTenure;
        metrics[2][dept] = deptData.retentionRate;
        metrics[3][dept] = deptData.performanceScore * 20; // 繧ｹ繧ｱ繝ｼ繝ｫ隱ｿ謨ｴ (0-5 to 0-100)
        metrics[4][dept] = 100 - deptData.stressLevel; // 蜿崎ｻ｢縺励※濶ｯ縺・婿繧帝ｫ倥￥
        metrics[5][dept] = deptData.engagementScore;
        metrics[6][dept] = deptData.trainingCompletionRate;
        metrics[7][dept] = deptData.leadershipPotential;
      }
    });

    return metrics;
  }, [selectedDepartments, departmentCohortData]);

  // 繝ｬ繝ｼ繝繝ｼ繝√Ε繝ｼ繝育畑繝・・繧ｿ
  const radarData = useMemo(() => {
    return comparisonData.map(item => {
      const normalized: any = { metric: item.metric };
      selectedDepartments.forEach(dept => {
        // 蜷・欠讓吶ｒ0-100縺ｫ繧ｹ繧ｱ繝ｼ繝ｪ繝ｳ繧ｰ
        let value = item[dept] || 0;
        if (item.metric === '蟷ｳ蝮・ｹｴ鮨｢') value = (value / 60) * 100;
        if (item.metric === '蟷ｳ蝮・共邯壼ｹｴ謨ｰ') value = (value / 20) * 100;
        normalized[dept] = value;
      });
      return normalized;
    });
  }, [comparisonData, selectedDepartments]);

  // 繝ｩ繝ｳ繧ｭ繝ｳ繧ｰ繝・・繧ｿ
  const rankingData = useMemo(() => {
    const sorted = [...departmentCohortData].sort((a, b) => {
      switch (comparisonType) {
        case 'performance':
          return b.performanceScore - a.performanceScore;
        case 'risk':
          return a.riskScore - b.riskScore; // 繝ｪ繧ｹ繧ｯ縺ｯ菴弱＞譁ｹ縺瑚憶縺・        case 'development':
          return b.leadershipPotential - a.leadershipPotential;
        default:
          return 0;
      }
    });
    return sorted;
  }, [departmentCohortData, comparisonType]);

  const getMetricColor = (value: number, metric: string) => {
    if (metric === '繧ｹ繝医Ξ繧ｹ繝ｬ繝吶Ν' || metric === '繝ｪ繧ｹ繧ｯ繧ｹ繧ｳ繧｢') {
      // 菴弱＞譁ｹ縺瑚憶縺・欠讓・      if (value > 70) return 'text-red-600';
      if (value > 50) return 'text-yellow-600';
      return 'text-green-600';
    } else {
      // 鬮倥＞譁ｹ縺瑚憶縺・欠讓・      if (value > 80) return 'text-green-600';
      if (value > 60) return 'text-yellow-600';
      return 'text-red-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="驛ｨ鄂ｲ蛻･繧ｳ繝帙・繝域ｯ碑ｼ・ />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* 繝倥ャ繝繝ｼ */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold">驛ｨ鄂ｲ蛻･繧ｳ繝帙・繝域ｯ碑ｼ・/h1>
            <p className="text-gray-600 mt-2">驛ｨ鄂ｲ繝ｻ閨ｷ遞ｮ蛻･縺ｫ繧ｳ繝帙・繝医・迚ｹ諤ｧ繧呈ｯ碑ｼ・＠縲∫ｵ・ｹ碑ｪｲ鬘後ｒ迚ｹ螳・/p>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <label className="block text-sm font-medium mb-2">豈碑ｼ・ち繧､繝・/label>
                  <Select value={comparisonType} onValueChange={(value: any) => setComparisonType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="performance">繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ</SelectItem>
                      <SelectItem value="risk">繝ｪ繧ｹ繧ｯ蛻・梵</SelectItem>
                      <SelectItem value="development">謌宣聞繝ｻ閧ｲ謌・/SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">陦ｨ遉ｺ繝｢繝ｼ繝・/label>
                  <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comparison">豈碑ｼ・ン繝･繝ｼ</SelectItem>
                      <SelectItem value="ranking">繝ｩ繝ｳ繧ｭ繝ｳ繧ｰ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {viewMode === 'comparison' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">豈碑ｼ・ｯｾ雎｡驛ｨ鄂ｲ・域怙螟ｧ3縺､・・/label>
                  <div className="flex flex-wrap gap-2">
                    {departments.map(dept => (
                      <button
                        key={dept}
                        onClick={() => {
                          if (selectedDepartments.includes(dept)) {
                            setSelectedDepartments(selectedDepartments.filter(d => d !== dept));
                          } else if (selectedDepartments.length < 3) {
                            setSelectedDepartments([...selectedDepartments, dept]);
                          }
                        }}
                        className={`px-3 py-1 rounded-full text-sm ${
                          selectedDepartments.includes(dept)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        } ${!selectedDepartments.includes(dept) && selectedDepartments.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={!selectedDepartments.includes(dept) && selectedDepartments.length >= 3}
                      >
                        {dept}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 繧ｵ繝槭Μ繝ｼ繧ｫ繝ｼ繝・*/}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">邱城Κ鄂ｲ謨ｰ</p>
                    <p className="text-2xl font-bold">{departments.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">譛鬮倥ヱ繝輔か繝ｼ繝槭Φ繧ｹ</p>
                    <p className="text-2xl font-bold">
                      {departmentCohortData.length > 0 
                        ? Math.max(...departmentCohortData.map(d => d.performanceScore)).toFixed(1)
                        : '0.0'}
                    </p>
                  </div>
                  <Award className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">蟷ｳ蝮・せ繝医Ξ繧ｹ</p>
                    <p className="text-2xl font-bold">
                      {departmentCohortData.length > 0
                        ? Math.round(departmentCohortData.reduce((sum, d) => sum + d.stressLevel, 0) / departmentCohortData.length)
                        : '0'}%
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">鬮倥Μ繧ｹ繧ｯ驛ｨ鄂ｲ</p>
                    <p className="text-2xl font-bold">
                      {departmentCohortData.filter(d => d.riskScore > 7).length}
                    </p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {viewMode === 'comparison' && selectedDepartments.length > 0 && (
            <>
              {/* 豈碑ｼ・メ繝｣繝ｼ繝・*/}
              <Card>
                <CardHeader>
                  <CardTitle>驛ｨ鄂ｲ髢捺ｯ碑ｼ・/CardTitle>
                  <CardDescription>驕ｸ謚槭＠縺滄Κ鄂ｲ縺ｮ荳ｻ隕∵欠讓吶ｒ豈碑ｼ・/CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="metric" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {selectedDepartments.map((dept, index) => (
                        <Bar 
                          key={dept} 
                          dataKey={dept} 
                          fill={['#3b82f6', '#10b981', '#f59e0b'][index]}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* 繝ｬ繝ｼ繝繝ｼ繝√Ε繝ｼ繝・*/}
              <Card>
                <CardHeader>
                  <CardTitle>螟夐擇逧・ｩ穂ｾ｡</CardTitle>
                  <CardDescription>蜷・Κ鄂ｲ縺ｮ蠑ｷ縺ｿ繝ｻ蠑ｱ縺ｿ繧貞庄隕門喧</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      {selectedDepartments.map((dept, index) => (
                        <Radar
                          key={dept}
                          name={dept}
                          dataKey={dept}
                          stroke={['#3b82f6', '#10b981', '#f59e0b'][index]}
                          fill={['#3b82f6', '#10b981', '#f59e0b'][index]}
                          fillOpacity={0.3}
                        />
                      ))}
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* 隧ｳ邏ｰ豈碑ｼ・ユ繝ｼ繝悶Ν */}
              <Card>
                <CardHeader>
                  <CardTitle>隧ｳ邏ｰ豈碑ｼ・/CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            謖・ｨ・                          </th>
                          {selectedDepartments.map(dept => (
                            <th key={dept} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {dept}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {departmentCohortData.length > 0 && selectedDepartments.length > 0 && (
                          <>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                邱丈ｺｺ謨ｰ
                              </td>
                              {selectedDepartments.map(dept => {
                                const data = departmentCohortData.find(d => d.department === dept);
                                return (
                                  <td key={dept} className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                    {data?.totalStaff || 0}蜷・                                  </td>
                                );
                              })}
                            </tr>
                            <tr className="bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ繧ｹ繧ｳ繧｢
                              </td>
                              {selectedDepartments.map(dept => {
                                const data = departmentCohortData.find(d => d.department === dept);
                                return (
                                  <td key={dept} className={`px-6 py-4 whitespace-nowrap text-sm text-center font-semibold ${getMetricColor((data?.performanceScore || 0) * 20, '繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ')}`}>
                                    {data?.performanceScore.toFixed(1) || '0.0'}
                                  </td>
                                );
                              })}
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                繧ｹ繝医Ξ繧ｹ繝ｬ繝吶Ν
                              </td>
                              {selectedDepartments.map(dept => {
                                const data = departmentCohortData.find(d => d.department === dept);
                                return (
                                  <td key={dept} className={`px-6 py-4 whitespace-nowrap text-sm text-center font-semibold ${getMetricColor(data?.stressLevel || 0, '繧ｹ繝医Ξ繧ｹ繝ｬ繝吶Ν')}`}>
                                    {data?.stressLevel || 0}%
                                  </td>
                                );
                              })}
                            </tr>
                            <tr className="bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                繧ｨ繝ｳ繧ｲ繝ｼ繧ｸ繝｡繝ｳ繝・                              </td>
                              {selectedDepartments.map(dept => {
                                const data = departmentCohortData.find(d => d.department === dept);
                                return (
                                  <td key={dept} className={`px-6 py-4 whitespace-nowrap text-sm text-center font-semibold ${getMetricColor(data?.engagementScore || 0, '繧ｨ繝ｳ繧ｲ繝ｼ繧ｸ繝｡繝ｳ繝・)}`}>
                                    {data?.engagementScore || 0}%
                                  </td>
                                );
                              })}
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                繝ｪ繧ｹ繧ｯ繧ｹ繧ｳ繧｢
                              </td>
                              {selectedDepartments.map(dept => {
                                const data = departmentCohortData.find(d => d.department === dept);
                                return (
                                  <td key={dept} className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                    <Badge variant={data?.riskScore && data.riskScore > 7 ? 'destructive' : data?.riskScore && data.riskScore > 4 ? 'secondary' : 'default'}>
                                      {data?.riskScore || 0}
                                    </Badge>
                                  </td>
                                );
                              })}
                            </tr>
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {viewMode === 'ranking' && (
            <>
              {/* 繝ｩ繝ｳ繧ｭ繝ｳ繧ｰ陦ｨ遉ｺ */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {comparisonType === 'performance' && '繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ繝ｩ繝ｳ繧ｭ繝ｳ繧ｰ'}
                    {comparisonType === 'risk' && '繝ｪ繧ｹ繧ｯ繧ｹ繧ｳ繧｢繝ｩ繝ｳ繧ｭ繝ｳ繧ｰ・井ｽ弱＞鬆・ｼ・}
                    {comparisonType === 'development' && '閧ｲ謌舌・繝・Φ繧ｷ繝｣繝ｫ繝ｩ繝ｳ繧ｭ繝ｳ繧ｰ'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {rankingData.map((dept, index) => (
                      <div key={dept.department} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`text-2xl font-bold ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-orange-600' : 'text-gray-600'}`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold">{dept.department}</p>
                            <p className="text-sm text-gray-600">邱丈ｺｺ謨ｰ: {dept.totalStaff}蜷・/p>
                          </div>
                        </div>
                        <div className="text-right">
                          {comparisonType === 'performance' && (
                            <>
                              <p className="text-2xl font-bold text-blue-600">{dept.performanceScore.toFixed(1)}</p>
                              <p className="text-sm text-gray-600">繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ繧ｹ繧ｳ繧｢</p>
                            </>
                          )}
                          {comparisonType === 'risk' && (
                            <>
                              <p className="text-2xl font-bold text-red-600">{dept.riskScore}</p>
                              <p className="text-sm text-gray-600">繝ｪ繧ｹ繧ｯ繧ｹ繧ｳ繧｢</p>
                            </>
                          )}
                          {comparisonType === 'development' && (
                            <>
                              <p className="text-2xl font-bold text-green-600">{dept.leadershipPotential}%</p>
                              <p className="text-sm text-gray-600">繝ｪ繝ｼ繝繝ｼ繧ｷ繝・・貎懷惠蜉・/p>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 繝医Ξ繝ｳ繝峨メ繝｣繝ｼ繝・*/}
              <Card>
                <CardHeader>
                  <CardTitle>驛ｨ鄂ｲ蛻･繝医Ξ繝ｳ繝・/CardTitle>
                  <CardDescription>驕主悉6繝ｶ譛医・謗ｨ遘ｻ・医す繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ・・/CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={[
                      { month: '1譛・, ...Object.fromEntries(rankingData.slice(0, 5).map(d => [d.department, 70 + Math.random() * 20])) },
                      { month: '2譛・, ...Object.fromEntries(rankingData.slice(0, 5).map(d => [d.department, 72 + Math.random() * 20])) },
                      { month: '3譛・, ...Object.fromEntries(rankingData.slice(0, 5).map(d => [d.department, 75 + Math.random() * 20])) },
                      { month: '4譛・, ...Object.fromEntries(rankingData.slice(0, 5).map(d => [d.department, 73 + Math.random() * 20])) },
                      { month: '5譛・, ...Object.fromEntries(rankingData.slice(0, 5).map(d => [d.department, 78 + Math.random() * 20])) },
                      { month: '6譛・, ...Object.fromEntries(rankingData.slice(0, 5).map(d => [d.department, 80 + Math.random() * 20])) }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {rankingData.slice(0, 5).map((dept, index) => (
                        <Line
                          key={dept.department}
                          type="monotone"
                          dataKey={dept.department}
                          stroke={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index]}
                          strokeWidth={2}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          )}

          {/* 繧､繝ｳ繧ｵ繧､繝医→謗ｨ螂ｨ莠矩・*/}
          <Card>
            <CardHeader>
              <CardTitle>蛻・梵邨先棡縺九ｉ縺ｮ繧､繝ｳ繧ｵ繧､繝・/CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-semibold">鬮倥ヱ繝輔か繝ｼ繝槭Φ繧ｹ驛ｨ鄂ｲ縺ｮ迚ｹ蠕ｴ</p>
                    <p className="text-sm text-gray-600">
                      繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ縺碁ｫ倥＞驛ｨ鄂ｲ縺ｯ縲√お繝ｳ繧ｲ繝ｼ繧ｸ繝｡繝ｳ繝医せ繧ｳ繧｢繧るｫ倥￥縲√せ繝医Ξ繧ｹ繝ｬ繝吶Ν縺碁←蛻・↓邂｡逅・＆繧後※縺・∪縺吶・                      縺薙ｌ繧峨・驛ｨ鄂ｲ縺ｮ繝吶せ繝医・繝ｩ繧ｯ繝・ぅ繧ｹ繧剃ｻ夜Κ鄂ｲ縺ｫ螻暮幕縺吶ｋ縺薙→繧呈耳螂ｨ縺励∪縺吶・                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="font-semibold">鬮倥Μ繧ｹ繧ｯ驛ｨ鄂ｲ縺ｸ縺ｮ蟇ｾ蠢・/p>
                    <p className="text-sm text-gray-600">
                      繝ｪ繧ｹ繧ｯ繧ｹ繧ｳ繧｢縺碁ｫ倥＞驛ｨ鄂ｲ縺ｧ縺ｯ縲・屬閨ｷ邇・・荳頑・縺御ｺ域ｸｬ縺輔ｌ縺ｾ縺吶・                      譌ｩ諤･縺ｪ讌ｭ蜍呵ｲ闕ｷ縺ｮ隕狗峩縺励→繧ｵ繝昴・繝井ｽ灘宛縺ｮ蠑ｷ蛹悶′蠢・ｦ√〒縺吶・                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Heart className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div>
                    <p className="font-semibold">驛ｨ鄂ｲ髢馴｣謳ｺ縺ｮ謗ｨ騾ｲ</p>
                    <p className="text-sm text-gray-600">
                      驛ｨ鄂ｲ髢薙〒縺ｮ繝弱え繝上え蜈ｱ譛峨ｄ繧ｸ繝ｧ繝悶Ο繝ｼ繝・・繧ｷ繝ｧ繝ｳ繧帝壹§縺ｦ縲・                      邨・ｹ泌・菴薙・繝ｬ繝吶Ν繧｢繝・・繧貞峙繧九％縺ｨ縺後〒縺阪∪縺吶・                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 繧｢繧ｯ繧ｷ繝ｧ繝ｳ繝懊ち繝ｳ */}
          <div className="flex gap-4">
            <button 
              onClick={() => exportToPDF({
                title: '驛ｨ鄂ｲ蛻･繧ｳ繝帙・繝域ｯ碑ｼ・Ξ繝昴・繝・,
                facility: facilityParam || '蜈ｨ譁ｽ險ｭ',
                reportType: 'department-cohort',
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

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Content />
    </Suspense>
  );
}