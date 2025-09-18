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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Cell
} from 'recharts';

// 繝ｪ繝・Φ繧ｷ繝ｧ繝ｳ譁ｽ遲悶・螳夂ｾｩ
const retentionStrategies = {
  workLifeBalance: {
    name: '繝ｯ繝ｼ繧ｯ繝ｩ繧､繝輔ヰ繝ｩ繝ｳ繧ｹ謾ｹ蝟・,
    cost: 5000000,
    impact: {
      overtime: -20,
      paidLeaveRate: 15,
      stressIndex: -10,
      engagement: 10
    }
  },
  careerDevelopment: {
    name: '繧ｭ繝｣繝ｪ繧｢髢狗匱繝励Ο繧ｰ繝ｩ繝',
    cost: 8000000,
    impact: {
      skills: 15,
      growth: 20,
      engagement: 15,
      performance: 10
    }
  },
  compensation: {
    name: '蝣ｱ驟ｬ蛻ｶ蠎ｦ謾ｹ髱ｩ',
    cost: 15000000,
    impact: {
      satisfaction: 25,
      engagement: 20,
      performance: 5,
      retention: 15
    }
  },
  wellness: {
    name: '繧ｦ繧ｧ繝ｫ繝阪せ繝励Ο繧ｰ繝ｩ繝',
    cost: 3000000,
    impact: {
      healthScore: 10,
      stressIndex: -15,
      engagement: 8,
      paidLeaveRate: 10
    }
  },
  recognition: {
    name: '陦ｨ蠖ｰ繝ｻ隧穂ｾ｡蛻ｶ蠎ｦ蠑ｷ蛹・,
    cost: 2000000,
    impact: {
      engagement: 12,
      performance: 8,
      teamwork: 10,
      satisfaction: 15
    }
  }
};

function Content() {
  const searchParams = useSearchParams();
  const facilityParam = searchParams.get('facility') || '';
  const [selectedFacility, setSelectedFacility] = useState(facilityParam || '蜈ｨ譁ｽ險ｭ');
  const [selectedDepartment, setSelectedDepartment] = useState('蜈ｨ驛ｨ鄂ｲ');
  const [selectedStrategies, setSelectedStrategies] = useState(['workLifeBalance', 'careerDevelopment']);
  const [implementationPeriod, setImplementationPeriod] = useState(12); // months

  // 迴ｾ蝨ｨ縺ｮ髮｢閨ｷ繝ｪ繧ｹ繧ｯ蛻・梵
  const currentTurnoverRisk = useMemo(() => {
    const staffList = Object.values(staffDatabase).filter(staff => {
      if (selectedFacility !== '蜈ｨ譁ｽ險ｭ' && staff.facility !== selectedFacility) return false;
      if (selectedDepartment !== '蜈ｨ驛ｨ鄂ｲ' && staff.department !== selectedDepartment) return false;
      return true;
    });

    // 繝ｪ繧ｹ繧ｯ繝ｬ繝吶Ν蛻･縺ｫ蛻・｡・
    const riskLevels = { high: 0, medium: 0, low: 0 };
    const departmentRisks: { [key: string]: { total: number; risk: number } } = {};

    staffList.forEach(staff => {
      const riskScore = (staff.stressIndex / 100) * 0.3 + 
                       (1 - staff.engagement / 100) * 0.3 +
                       (staff.overtime > 30 ? 0.2 : 0) +
                       (staff.paidLeaveRate < 50 ? 0.2 : 0);
      
      if (riskScore > 0.6) riskLevels.high++;
      else if (riskScore > 0.3) riskLevels.medium++;
      else riskLevels.low++;

      if (!departmentRisks[staff.department]) {
        departmentRisks[staff.department] = { total: 0, risk: 0 };
      }
      departmentRisks[staff.department].total++;
      if (riskScore > 0.6) departmentRisks[staff.department].risk++;
    });

    return {
      total: staffList.length,
      riskLevels,
      departmentRisks: Object.entries(departmentRisks).map(([dept, data]) => ({
        department: dept,
        riskRate: (data.risk / data.total) * 100,
        count: data.risk
      })).sort((a, b) => b.riskRate - a.riskRate)
    };
  }, [selectedFacility, selectedDepartment]);

  // 譁ｽ遲門ｮ滓命蠕後・蜉ｹ譫應ｺ域ｸｬ
  const impactPrediction = useMemo(() => {
    const baseline = {
      turnoverRate: 12, // %
      engagement: 75,
      stressIndex: 45,
      overtime: 20,
      paidLeaveRate: 60
    };

    let totalCost = 0;
    let predictedMetrics = { ...baseline };

    selectedStrategies.forEach(strategyKey => {
      const strategy = retentionStrategies[strategyKey as keyof typeof retentionStrategies];
      totalCost += strategy.cost;
      
      // 蜷・命遲悶・蠖ｱ髻ｿ繧定ｨ育ｮ・
      if (strategy.impact.engagement) {
        predictedMetrics.engagement += strategy.impact.engagement;
      }
      if ('stressIndex' in strategy.impact && strategy.impact.stressIndex) {
        predictedMetrics.stressIndex += strategy.impact.stressIndex;
      }
      if ('overtime' in strategy.impact && strategy.impact.overtime) {
        predictedMetrics.overtime = Math.max(0, predictedMetrics.overtime + strategy.impact.overtime);
      }
      if ('paidLeaveRate' in strategy.impact && strategy.impact.paidLeaveRate) {
        predictedMetrics.paidLeaveRate = Math.min(100, predictedMetrics.paidLeaveRate + strategy.impact.paidLeaveRate);
      }
    });

    // 髮｢閨ｷ邇・・謾ｹ蝟・ｒ險育ｮ・
    const improvementFactor = (predictedMetrics.engagement - baseline.engagement) * 0.02 +
                            (baseline.stressIndex - predictedMetrics.stressIndex) * 0.01 +
                            (baseline.overtime - predictedMetrics.overtime) * 0.005 +
                            (predictedMetrics.paidLeaveRate - baseline.paidLeaveRate) * 0.005;
    
    predictedMetrics.turnoverRate = Math.max(5, baseline.turnoverRate - improvementFactor);

    return {
      baseline,
      predicted: predictedMetrics,
      totalCost,
      roi: ((baseline.turnoverRate - predictedMetrics.turnoverRate) * currentTurnoverRisk.total * 5000000 - totalCost) / totalCost * 100
    };
  }, [selectedStrategies, currentTurnoverRisk.total]);

  // 譎らｳｻ蛻励〒縺ｮ蜉ｹ譫懊す繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ
  const timeSeriesImpact = useMemo(() => {
    const months = [];
    const baseline = impactPrediction.baseline.turnoverRate;
    const target = impactPrediction.predicted.turnoverRate;
    
    for (let i = 0; i <= implementationPeriod; i++) {
      const progress = i / implementationPeriod;
      const easeProgress = 1 - Math.pow(1 - progress, 2); // 繧､繝ｼ繧ｸ繝ｳ繧ｰ蜉ｹ譫・
      
      months.push({
        month: `${i}繝ｶ譛・,
        髮｢閨ｷ邇・ baseline - (baseline - target) * easeProgress,
        繧ｨ繝ｳ繧ｲ繝ｼ繧ｸ繝｡繝ｳ繝・ 75 + (impactPrediction.predicted.engagement - 75) * easeProgress,
        繧ｹ繝医Ξ繧ｹ謖・焚: 45 + (impactPrediction.predicted.stressIndex - 45) * easeProgress
      });
    }
    
    return months;
  }, [implementationPeriod, impactPrediction]);

  // 譁ｽ遲也ｵ・∩蜷医ｏ縺帙・蜉ｹ譫懈ｯ碑ｼ・
  const strategyComparison = useMemo(() => {
    return Object.entries(retentionStrategies).map(([key, strategy]) => {
      const isSelected = selectedStrategies.includes(key);
      const costPerEmployee = currentTurnoverRisk.total > 0 ? strategy.cost / currentTurnoverRisk.total : 0;
      
      // 蜷・命遲悶・蜉ｹ譫懊せ繧ｳ繧｢繧定ｨ育ｮ・
      let effectScore = 0;
      Object.values(strategy.impact).forEach(value => {
        effectScore += Math.abs(value);
      });
      
      const costInMillion = strategy.cost / 1000000;
      return {
        name: strategy.name,
        cost: costInMillion, // 逋ｾ荳・・蜊倅ｽ・
        蜉ｹ譫懊せ繧ｳ繧｢: effectScore,
        繧ｳ繧ｹ繝亥柑邇・ costInMillion > 0 ? effectScore / costInMillion : 0,
        selected: isSelected
      };
    });
  }, [selectedStrategies, currentTurnoverRisk.total]);

  // 繝輔ぅ繝ｫ繧ｿ繝ｼ逕ｨ縺ｮ繝ｪ繧ｹ繝・
  const facilities = useMemo(() => {
    const facilitySet = new Set(Object.values(staffDatabase).map(s => s.facility));
    return ['蜈ｨ譁ｽ險ｭ', ...Array.from(facilitySet)];
  }, []);

  const departments = useMemo(() => {
    const staffList = selectedFacility === '蜈ｨ譁ｽ險ｭ' 
      ? Object.values(staffDatabase)
      : Object.values(staffDatabase).filter(s => s.facility === selectedFacility);
    const deptSet = new Set(staffList.map(s => s.department));
    return ['蜈ｨ驛ｨ鄂ｲ', ...Array.from(deptSet)];
  }, [selectedFacility]);

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="繝ｪ繝・Φ繧ｷ繝ｧ繝ｳ譁ｽ遲門柑譫應ｺ域ｸｬ" />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* 繝倥ャ繝繝ｼ */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold">繝ｪ繝・Φ繧ｷ繝ｧ繝ｳ譁ｽ遲門柑譫應ｺ域ｸｬ</h1>
            <p className="text-gray-600 mt-2">譁ｽ遲門挨縺ｮ蜉ｹ譫應ｺ域ｸｬ縺ｨ繧ｳ繧ｹ繝亥ｯｾ蜉ｹ譫懊・蛻・梵</p>
            {facilityParam && (
              <p className="text-sm text-gray-500 mt-1">蟇ｾ雎｡譁ｽ險ｭ: {facilityParam}</p>
            )}
          </div>

          {/* 繝輔ぅ繝ｫ繧ｿ繝ｼ */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">譁ｽ險ｭ</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">驛ｨ鄂ｲ</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">螳滓命譛滄俣</label>
                <select
                  value={implementationPeriod}
                  onChange={(e) => setImplementationPeriod(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={6}>6繝ｶ譛・/option>
                  <option value={12}>12繝ｶ譛・/option>
                  <option value={18}>18繝ｶ譛・/option>
                  <option value={24}>24繝ｶ譛・/option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">螳滓命譁ｽ遲悶・驕ｸ謚・/label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {Object.entries(retentionStrategies).map(([key, strategy]) => (
                  <label key={key} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedStrategies.includes(key)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStrategies([...selectedStrategies, key]);
                        } else {
                          setSelectedStrategies(selectedStrategies.filter(s => s !== key));
                        }
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm">{strategy.name} (ﾂ･{(strategy.cost / 1000000).toFixed(1)}M)</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* 迴ｾ蝨ｨ縺ｮ髮｢閨ｷ繝ｪ繧ｹ繧ｯ迥ｶ豕・*/}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>鬮倥Μ繧ｹ繧ｯ閨ｷ蜩｡謨ｰ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {currentTurnoverRisk.riskLevels.high}蜷・
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  蜈ｨ菴薙・{((currentTurnoverRisk.riskLevels.high / currentTurnoverRisk.total) * 100).toFixed(1)}%
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>莠域ｸｬ髮｢閨ｷ邇・/CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-600">
                  {impactPrediction.baseline.turnoverRate}%
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  迴ｾ蝨ｨ縺ｮ迥ｶ豕√ｒ邯ｭ謖√＠縺溷ｴ蜷・
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>譁ｽ遲門ｮ滓命蠕後・髮｢閨ｷ邇・/CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {impactPrediction.predicted.turnoverRate.toFixed(1)}%
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {(impactPrediction.baseline.turnoverRate - impactPrediction.predicted.turnoverRate).toFixed(1)}%謾ｹ蝟・
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 譁ｽ遲門柑譫懊・譎らｳｻ蛻玲耳遘ｻ */}
          <Card>
            <CardHeader>
              <CardTitle>譁ｽ遲門柑譫懊・譎らｳｻ蛻玲耳遘ｻ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeSeriesImpact}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '6px',
                        padding: '10px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                      wrapperStyle={{ zIndex: 1000 }}
                    />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="髮｢閨ｷ邇・ 
                      stroke="#EF4444" 
                      strokeWidth={2}
                      name="髮｢閨ｷ邇・(%)"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="繧ｨ繝ｳ繧ｲ繝ｼ繧ｸ繝｡繝ｳ繝・ 
                      stroke="#10B981" 
                      strokeWidth={2}
                      name="繧ｨ繝ｳ繧ｲ繝ｼ繧ｸ繝｡繝ｳ繝・
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="繧ｹ繝医Ξ繧ｹ謖・焚" 
                      stroke="#F59E0B" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="繧ｹ繝医Ξ繧ｹ謖・焚"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 譁ｽ遲門挨繧ｳ繧ｹ繝亥柑邇・・譫・*/}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>譁ｽ遲門挨蜉ｹ譫懊せ繧ｳ繧｢</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {strategyComparison.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      繝・・繧ｿ縺後≠繧翫∪縺帙ｓ
                    </div>
                  ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={strategyComparison} 
                      layout="horizontal"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={150} />
                      <Tooltip 
                        formatter={(value: number) => value.toFixed(1)}
                        contentStyle={{ 
                          backgroundColor: '#ffffff', 
                          border: '1px solid #e5e7eb', 
                          borderRadius: '6px',
                          padding: '10px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                        wrapperStyle={{ zIndex: 1000 }}
                      />
                      <Legend />
                      <Bar dataKey="蜉ｹ譫懊せ繧ｳ繧｢" fill="#3B82F6" isAnimationActive={false} />
                      <Bar dataKey="繧ｳ繧ｹ繝亥柑邇・ fill="#10B981" isAnimationActive={false} />
                    </BarChart>
                  </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>驛ｨ鄂ｲ蛻･髮｢閨ｷ繝ｪ繧ｹ繧ｯ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">驛ｨ鄂ｲ</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">繝ｪ繧ｹ繧ｯ邇・/th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">莠ｺ謨ｰ</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentTurnoverRisk.departmentRisks.slice(0, 10).map((dept, index) => (
                        <tr key={dept.department} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-2 text-sm text-gray-900">{dept.department}</td>
                          <td className="px-4 py-2 text-sm">
                            <div className="flex items-center">
                              <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                                <div 
                                  className="bg-red-500 h-2 rounded-full" 
                                  style={{ width: `${dept.riskRate}%` }}
                                />
                              </div>
                              <span className="text-xs">{dept.riskRate.toFixed(1)}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500">{dept.count}蜷・/td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ROI蛻・梵縺ｨ謗ｨ螂ｨ莠矩・*/}
          <Card>
            <CardHeader>
              <CardTitle>謚戊ｳ・ｯｾ蜉ｹ譫懶ｼ・OI・牙・譫・/CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">譁ｽ遲匁兜雉・｡・/h4>
                    <p className="text-2xl font-bold text-blue-600">
                      ﾂ･{(impactPrediction.totalCost ?? 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      驕ｸ謚槭＠縺毬selectedStrategies.length}縺､縺ｮ譁ｽ遲悶・蜷郁ｨ・
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">莠域Φ蜑頑ｸ帙さ繧ｹ繝・/h4>
                    <p className="text-2xl font-bold text-green-600">
                      ﾂ･{Math.round(((impactPrediction.baseline?.turnoverRate ?? 0) - (impactPrediction.predicted?.turnoverRate ?? 0)) * (currentTurnoverRisk?.total ?? 0) * 500000).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      髮｢閨ｷ邇・隼蝟・↓繧医ｋ謗｡逕ｨ繝ｻ遐比ｿｮ繧ｳ繧ｹ繝亥炎貂・
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">ROI</h4>
                    <p className="text-2xl font-bold text-blue-600">
                      {impactPrediction.roi.toFixed(1)}%
                    </p>
                    <p className="text-sm text-blue-800 mt-1">
                      {implementationPeriod}繝ｶ譛医〒縺ｮ謚戊ｳ・屓蜿守紫
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-amber-900 mb-2">蜆ｪ蜈亥ｮ滓命謗ｨ螂ｨ譁ｽ遲・/h4>
                    <ul className="list-disc list-inside text-sm text-amber-800 space-y-1">
                      {strategyComparison
                        .filter(s => s.selected)
                        .sort((a, b) => b.繧ｳ繧ｹ繝亥柑邇・- a.繧ｳ繧ｹ繝亥柑邇・
                        .slice(0, 3)
                        .map(strategy => (
                          <li key={strategy.name}>
                            {strategy.name}・医さ繧ｹ繝亥柑邇・ {strategy.繧ｳ繧ｹ繝亥柑邇・toFixed(1)}・・
                          </li>
                        ))}
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">螳滓命荳翫・謗ｨ螂ｨ莠矩・/h4>
                    <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
                      <li>谿ｵ髫守噪縺ｪ蟆主・縺ｫ繧医ｊ蜉ｹ譫懊ｒ讀懆ｨｼ</li>
                      <li>鬮倥Μ繧ｹ繧ｯ驛ｨ鄂ｲ縺九ｉ蜆ｪ蜈育噪縺ｫ螳滓命</li>
                      <li>螳壽悄逧・↑蜉ｹ譫懈ｸｬ螳壹→繝輔ぅ繝ｼ繝峨ヰ繝・け</li>
                      <li>閨ｷ蜩｡縺ｮ螢ｰ繧貞渚譏縺励◆譁ｽ遲悶・隱ｿ謨ｴ</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 繧｢繧ｯ繧ｷ繝ｧ繝ｳ繝懊ち繝ｳ */}
          <div className="flex gap-4">
            <button 
              onClick={() => exportToPDF({
                title: '繝ｪ繝・Φ繧ｷ繝ｧ繝ｳ譁ｽ遲門柑譫應ｺ域ｸｬ繝ｬ繝昴・繝・,
                facility: selectedFacility,
                reportType: 'retention-impact',
                elementId: 'report-content',
                dateRange: `螳滓命譛滄俣: ${implementationPeriod}繝ｶ譛・
              })}
              className="pdf-exclude bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              PDF繝繧ｦ繝ｳ繝ｭ繝ｼ繝・
            </button>
          </div>

        </div>
      </div><CategoryTopButton categoryPath="/reports/simulation" categoryName="繧ｷ繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ" /></div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Content />
    </Suspense>
  );
}