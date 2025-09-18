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
  AreaChart,
  Area,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Treemap
} from 'recharts';

function Content() {
  const searchParams = useSearchParams();
  const facilityParam = searchParams.get('facility') || '';
  const [selectedFacility, setSelectedFacility] = useState(facilityParam || '蜈ｨ譁ｽ險ｭ');
  const [selectedDepartment, setSelectedDepartment] = useState('蜈ｨ驛ｨ鄂ｲ');
  const [optimizationStrategy, setOptimizationStrategy] = useState('balanced');
  const [targetReduction, setTargetReduction] = useState(10); // %

  // 迴ｾ蝨ｨ縺ｮ莠ｺ莉ｶ雋ｻ蛻・梵
  const currentCostAnalysis = useMemo(() => {
    const staffList = Object.values(staffDatabase).filter(staff => {
      if (selectedFacility !== '蜈ｨ譁ｽ險ｭ' && staff.facility !== selectedFacility) return false;
      if (selectedDepartment !== '蜈ｨ驛ｨ鄂ｲ' && staff.department !== selectedDepartment) return false;
      return true;
    });

    // 閨ｷ遞ｮ蛻･縺ｮ蟷ｳ蝮・ｹｴ蜿弱ｒ險ｭ螳夲ｼ井ｻｮ螳壼､・・    const avgSalaryByPosition: { [key: string]: number } = {
      '蛹ｻ蟶ｫ': 12000000,
      '逵玖ｭｷ蟶ｫ': 5000000,
      '逵玖ｭｷ陬懷勧閠・: 3500000,
      '莉玖ｭｷ螢ｫ': 3800000,
      '莉玖ｭｷ遖冗･牙｣ｫ': 4200000,
      '逅・ｭｦ逋よｳ募｣ｫ': 4500000,
      '菴懈･ｭ逋よｳ募｣ｫ': 4500000,
      '險隱櫁・隕壼｣ｫ': 4500000,
      '阮ｬ蜑､蟶ｫ': 6000000,
      '險ｺ逋よ叛蟆・ｷ壽橿蟶ｫ': 5000000,
      '閾ｨ蠎頑､懈渊謚蟶ｫ': 4800000,
      '邂｡逅・・､雁｣ｫ': 4000000,
      '莠句漁閨ｷ蜩｡': 3500000
    };

    // 驛ｨ鄂ｲ蛻･繝ｻ閨ｷ遞ｮ蛻･縺ｮ莠ｺ莉ｶ雋ｻ繧定ｨ育ｮ・    const costByDepartment: { [key: string]: { cost: number; count: number; overtime: number } } = {};
    const costByPosition: { [key: string]: { cost: number; count: number } } = {};
    let totalCost = 0;
    let totalOvertime = 0;

    staffList.forEach(staff => {
      const basePosition = staff.position.replace(/荳ｻ莉ｻ|蟶ｫ髟ｷ|驛ｨ髟ｷ|遘鷹聞/, '').trim();
      const baseSalary = avgSalaryByPosition[basePosition] || 4000000;
      
      // 蠖ｹ閨ｷ謇句ｽ・      let positionMultiplier = 1.0;
      if (staff.position.includes('驛ｨ髟ｷ')) positionMultiplier = 1.3;
      else if (staff.position.includes('遘鷹聞')) positionMultiplier = 1.25;
      else if (staff.position.includes('蟶ｫ髟ｷ')) positionMultiplier = 1.2;
      else if (staff.position.includes('荳ｻ莉ｻ')) positionMultiplier = 1.1;
      
      // 邨碁ｨ灘ｹｴ謨ｰ縺ｫ繧医ｋ譏・ｵｦ・育ｰ｡譏楢ｨ育ｮ暦ｼ・      const tenureYears = parseInt(staff.tenure) || 0;
      const tenureMultiplier = 1 + (tenureYears * 0.02);
      
      const annualSalary = baseSalary * positionMultiplier * tenureMultiplier;
      const overtimeCost = (staff.overtime / 160) * (annualSalary / 12) * 1.25; // 譛磯｡肴鋤邂・      const totalStaffCost = annualSalary + (overtimeCost * 12);
      
      totalCost += totalStaffCost;
      totalOvertime += overtimeCost * 12;
      
      // 驛ｨ鄂ｲ蛻･髮・ｨ・      if (!costByDepartment[staff.department]) {
        costByDepartment[staff.department] = { cost: 0, count: 0, overtime: 0 };
      }
      costByDepartment[staff.department].cost += totalStaffCost;
      costByDepartment[staff.department].count++;
      costByDepartment[staff.department].overtime += overtimeCost * 12;
      
      // 閨ｷ遞ｮ蛻･髮・ｨ・      if (!costByPosition[basePosition]) {
        costByPosition[basePosition] = { cost: 0, count: 0 };
      }
      costByPosition[basePosition].cost += totalStaffCost;
      costByPosition[basePosition].count++;
    });

    return {
      totalCost,
      totalOvertime,
      averageCostPerStaff: totalCost / staffList.length,
      overtimeRatio: (totalOvertime / totalCost) * 100,
      departmentData: Object.entries(costByDepartment).map(([dept, data]) => ({
        department: dept,
        totalCost: data.cost,
        averageCost: data.cost / data.count,
        staffCount: data.count,
        overtimeCost: data.overtime,
        overtimeRatio: (data.overtime / data.cost) * 100
      })).sort((a, b) => b.totalCost - a.totalCost),
      positionData: Object.entries(costByPosition).map(([position, data]) => ({
        position,
        totalCost: data.cost,
        averageCost: data.cost / data.count,
        staffCount: data.count
      })).sort((a, b) => b.totalCost - a.totalCost)
    };
  }, [selectedFacility, selectedDepartment]);

  // 譛驕ｩ蛹悶す繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ
  const optimizationSimulation = useMemo(() => {
    const strategies = {
      balanced: {
        overtime: 0.3,      // 谿区･ｭ蜑頑ｸ・        efficiency: 0.3,    // 讌ｭ蜍吝柑邇・喧
        staffing: 0.2,      // 驕ｩ豁｣驟咲ｽｮ
        automation: 0.2     // 閾ｪ蜍募喧繝ｻ繧ｷ繧ｹ繝・Β蛹・      },
      aggressive: {
        overtime: 0.5,
        efficiency: 0.2,
        staffing: 0.2,
        automation: 0.1
      },
      moderate: {
        overtime: 0.2,
        efficiency: 0.3,
        staffing: 0.3,
        automation: 0.2
      },
      technology: {
        overtime: 0.1,
        efficiency: 0.2,
        staffing: 0.2,
        automation: 0.5
      }
    };

    const strategy = strategies[optimizationStrategy as keyof typeof strategies];
    const targetSaving = currentCostAnalysis.totalCost * (targetReduction / 100);
    
    // 蜷・命遲悶↓繧医ｋ蜑頑ｸ幃｡阪ｒ險育ｮ・    const savingsByMethod = {
      overtime: targetSaving * strategy.overtime,
      efficiency: targetSaving * strategy.efficiency,
      staffing: targetSaving * strategy.staffing,
      automation: targetSaving * strategy.automation
    };

    // 螳滓命繧ｳ繧ｹ繝医ｒ謗ｨ螳・    const implementationCost = {
      overtime: savingsByMethod.overtime * 0.1,    // 谿区･ｭ邂｡逅・す繧ｹ繝・Β遲・      efficiency: savingsByMethod.efficiency * 0.3, // 讌ｭ蜍呎隼蝟・さ繝ｳ繧ｵ繝ｫ遲・      staffing: savingsByMethod.staffing * 0.2,    // 驟咲ｽｮ譛驕ｩ蛹悶す繧ｹ繝・Β遲・      automation: savingsByMethod.automation * 0.5  // IT謚戊ｳ・ｭ・    };

    const totalImplementationCost = Object.values(implementationCost).reduce((sum, cost) => sum + cost, 0);
    const netSaving = targetSaving - totalImplementationCost;
    const roi = (netSaving / totalImplementationCost) * 100;
    const paybackPeriod = totalImplementationCost / (targetSaving / 12); // months

    return {
      targetSaving,
      savingsByMethod,
      implementationCost,
      totalImplementationCost,
      netSaving,
      roi,
      paybackPeriod
    };
  }, [currentCostAnalysis.totalCost, targetReduction, optimizationStrategy]);

  // 蟷ｴ谺｡謗ｨ遘ｻ莠域ｸｬ
  const yearlyProjection = useMemo(() => {
    const years = [];
    const currentYear = new Date().getFullYear();
    let baseCost = currentCostAnalysis.totalCost;
    
    for (let i = 0; i <= 5; i++) {
      const year = currentYear + i;
      
      // 閾ｪ辟ｶ蠅暦ｼ亥ｹｴ2%縺ｮ譏・ｵｦ遲会ｼ・      const naturalIncrease = baseCost * 0.02 * i;
      
      // 譛驕ｩ蛹門柑譫懶ｼ域ｮｵ髫守噪縺ｫ螳溽樟・・      let optimizationEffect = 0;
      if (i > 0) {
        const realizationRate = Math.min(i / 3, 1); // 3蟷ｴ縺ｧ螳悟・螳溽樟
        optimizationEffect = optimizationSimulation.targetSaving * realizationRate;
      }
      
      const projectedCost = baseCost + naturalIncrease - optimizationEffect;
      
      years.push({
        year,
        迴ｾ迥ｶ邯ｭ謖・ baseCost + naturalIncrease,
        譛驕ｩ蛹門ｾ・ projectedCost,
        蜑頑ｸ幃｡・ optimizationEffect,
        蜑頑ｸ帷紫: (optimizationEffect / (baseCost + naturalIncrease)) * 100
      });
    }
    
    return years;
  }, [currentCostAnalysis.totalCost, optimizationSimulation.targetSaving]);

  // 逕溽肇諤ｧ謖・ｨ・  const productivityMetrics = useMemo(() => {
    const staffList = Object.values(staffDatabase).filter(staff => {
      if (selectedFacility !== '蜈ｨ譁ｽ險ｭ' && staff.facility !== selectedFacility) return false;
      if (selectedDepartment !== '蜈ｨ驛ｨ鄂ｲ' && staff.department !== selectedDepartment) return false;
      return true;
    });

    // 莉ｮ縺ｮ蜿守寢繝・・繧ｿ・亥ｮ滄圀縺ｯ雋｡蜍吶ョ繝ｼ繧ｿ縺ｨ騾｣謳ｺ・・    const estimatedRevenue = staffList.length * 15000000; // 閨ｷ蜩｡1莠ｺ縺ゅ◆繧・500荳・・縺ｨ莉ｮ螳・    const laborCostRatio = (currentCostAnalysis.totalCost / estimatedRevenue) * 100;
    const revenuePerStaff = estimatedRevenue / staffList.length;
    const costPerPatient = currentCostAnalysis.totalCost / (staffList.length * 300); // 1莠ｺ縺ゅ◆繧雁ｹｴ髢・00莠ｺ蟇ｾ蠢懊→莉ｮ螳・
    return {
      laborCostRatio,
      revenuePerStaff,
      costPerPatient,
      overtimeImpact: currentCostAnalysis.totalOvertime / currentCostAnalysis.totalCost * 100
    };
  }, [selectedFacility, selectedDepartment, currentCostAnalysis]);

  // 繝輔ぅ繝ｫ繧ｿ繝ｼ逕ｨ縺ｮ繝ｪ繧ｹ繝・  const facilities = useMemo(() => {
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

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="莠ｺ莉ｶ雋ｻ譛驕ｩ蛹門・譫・ />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* 繝倥ャ繝繝ｼ */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold">莠ｺ莉ｶ雋ｻ譛驕ｩ蛹門・譫・/h1>
            <p className="text-gray-600 mt-2">莠ｺ莉ｶ雋ｻ謗ｨ遘ｻ縺ｮ莠域ｸｬ縺ｨ逕溽肇諤ｧ謖・ｨ吶→縺ｮ逶ｸ髢｢蛻・梵</p>
            {facilityParam && (
              <p className="text-sm text-gray-500 mt-1">蟇ｾ雎｡譁ｽ險ｭ: {facilityParam}</p>
            )}
          </div>

          {/* 繝輔ぅ繝ｫ繧ｿ繝ｼ */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">譛驕ｩ蛹匁姶逡･</label>
                <select
                  value={optimizationStrategy}
                  onChange={(e) => setOptimizationStrategy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="balanced">繝舌Λ繝ｳ繧ｹ蝙・/option>
                  <option value="aggressive">遨肴･ｵ蝙具ｼ域ｮ区･ｭ蜑頑ｸ幃㍾隕厄ｼ・/option>
                  <option value="moderate">遨丞▼蝙具ｼ域ｮｵ髫守噪謾ｹ蝟・ｼ・/option>
                  <option value="technology">謚陦馴擠譁ｰ蝙具ｼ・T謚戊ｳ・㍾隕厄ｼ・/option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">蜑頑ｸ帷岼讓・/label>
                <select
                  value={targetReduction}
                  onChange={(e) => setTargetReduction(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={5}>5%</option>
                  <option value={10}>10%</option>
                  <option value={15}>15%</option>
                  <option value={20}>20%</option>
                </select>
              </div>
            </div>
          </div>

          {/* 迴ｾ迥ｶ縺ｮ莠ｺ莉ｶ雋ｻ繧ｵ繝槭Μ繝ｼ */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>邱丈ｺｺ莉ｶ雋ｻ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  ﾂ･{(currentCostAnalysis.totalCost / 100000000).toFixed(1)}蜆・                </div>
                <p className="text-sm text-gray-600 mt-2">
                  蟷ｴ髢鍋ｷ城｡・                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>蟷ｳ蝮・ｺｺ莉ｶ雋ｻ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ﾂ･{(currentCostAnalysis.averageCostPerStaff / 10000).toFixed(0)}荳・                </div>
                <p className="text-sm text-gray-600 mt-2">
                  閨ｷ蜩｡1莠ｺ縺ゅ◆繧・                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>谿区･ｭ莉｣豈皮紫</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">
                  {currentCostAnalysis.overtimeRatio.toFixed(1)}%
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  邱丈ｺｺ莉ｶ雋ｻ縺ｫ蜊繧√ｋ蜑ｲ蜷・                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>蜉ｴ蜒榊・驟咲紫</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {productivityMetrics.laborCostRatio.toFixed(1)}%
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  謗ｨ螳壼庶逶翫↓蟇ｾ縺吶ｋ豈皮紫
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 莠ｺ莉ｶ雋ｻ謗ｨ遘ｻ莠域ｸｬ */}
          <Card>
            <CardHeader>
              <CardTitle>莠ｺ莉ｶ雋ｻ謗ｨ遘ｻ莠域ｸｬ・・蟷ｴ髢難ｼ・/CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={yearlyProjection}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis yAxisId="left" tickFormatter={(value) => `${(value / 100000000).toFixed(1)}蜆Я} />
                    <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value.toFixed(1)}%`} />
                    <Tooltip 
                      formatter={(value, name) => {
                        const numValue = typeof value === 'number' ? value : parseFloat(value as string);
                        if (name === '蜑頑ｸ帷紫') return `${numValue.toFixed(1)}%`;
                        return `ﾂ･${(numValue / 100000000).toFixed(2)}蜆Я;
                      }}
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
                    <Area yAxisId="left" type="monotone" dataKey="蜑頑ｸ幃｡・ fill="#10B981" fillOpacity={0.3} stroke="#10B981" />
                    <Line yAxisId="left" type="monotone" dataKey="迴ｾ迥ｶ邯ｭ謖・ stroke="#EF4444" strokeWidth={2} strokeDasharray="5 5" />
                    <Line yAxisId="left" type="monotone" dataKey="譛驕ｩ蛹門ｾ・ stroke="#3B82F6" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="蜑頑ｸ帷紫" stroke="#F59E0B" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 驛ｨ鄂ｲ蛻･莠ｺ莉ｶ雋ｻ蛻・梵 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>驛ｨ鄂ｲ蛻･莠ｺ莉ｶ雋ｻ讒区・</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <Treemap
                      data={currentCostAnalysis.departmentData.slice(0, 10).map(dept => ({
                        name: dept.department,
                        size: dept.totalCost,
                        overtimeRatio: dept.overtimeRatio
                      }))}
                      dataKey="size"
                      aspectRatio={4 / 3}
                      stroke="#fff"
                      fill="#8884d8"
                    >
                      <Tooltip 
                        formatter={(value) => {
                          const numValue = typeof value === 'number' ? value : parseFloat(value as string);
                          return `ﾂ･${(numValue / 1000000).toFixed(1)}M`;
                        }}
                        contentStyle={{ 
                          backgroundColor: '#ffffff', 
                          border: '1px solid #e5e7eb', 
                          borderRadius: '6px',
                          padding: '10px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                        wrapperStyle={{ zIndex: 1000 }}
                      />
                    </Treemap>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>閨ｷ遞ｮ蛻･蟷ｳ蝮・ｺｺ莉ｶ雋ｻ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={currentCostAnalysis.positionData.slice(0, 8)}
                      layout="horizontal"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={(value) => `${(value / 10000).toFixed(0)}荳㌔} />
                      <YAxis dataKey="position" type="category" width={100} />
                      <Tooltip 
                        formatter={(value) => {
                          const numValue = typeof value === 'number' ? value : parseFloat(value as string);
                          return `ﾂ･${(numValue / 10000).toFixed(0)}荳・・`;
                        }}
                        contentStyle={{ 
                          backgroundColor: '#ffffff', 
                          border: '1px solid #e5e7eb', 
                          borderRadius: '6px',
                          padding: '10px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                        wrapperStyle={{ zIndex: 1000 }}
                      />
                      <Bar dataKey="averageCost" fill="#3B82F6" isAnimationActive={false}>
                        {currentCostAnalysis.positionData.slice(0, 8).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 譛驕ｩ蛹匁命遲悶・隧ｳ邏ｰ */}
          <Card>
            <CardHeader>
              <CardTitle>譛驕ｩ蛹匁命遲悶・蜀・ｨｳ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">蜑頑ｸ帛柑譫懊・蜀・ｨｳ</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium">谿区･ｭ譎る俣蜑頑ｸ・/span>
                      <span className="text-lg font-bold text-blue-600">
                        ﾂ･{(optimizationSimulation.savingsByMethod.overtime / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">讌ｭ蜍吝柑邇・喧</span>
                      <span className="text-lg font-bold text-green-600">
                        ﾂ･{(optimizationSimulation.savingsByMethod.efficiency / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                      <span className="text-sm font-medium">驕ｩ豁｣驟咲ｽｮ</span>
                      <span className="text-lg font-bold text-amber-600">
                        ﾂ･{(optimizationSimulation.savingsByMethod.staffing / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium">閾ｪ蜍募喧繝ｻ繧ｷ繧ｹ繝・Β蛹・/span>
                      <span className="text-lg font-bold text-purple-600">
                        ﾂ･{(optimizationSimulation.savingsByMethod.automation / 1000000).toFixed(1)}M
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">謚戊ｳ・ｯｾ蜉ｹ譫・/h4>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">螳滓命繧ｳ繧ｹ繝・/p>
                      <p className="text-2xl font-bold text-gray-900">
                        ﾂ･{(optimizationSimulation.totalImplementationCost / 1000000).toFixed(1)}M
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">ROI・域兜雉・庶逶顔紫・・/p>
                      <p className="text-2xl font-bold text-blue-600">
                        {optimizationSimulation.roi.toFixed(0)}%
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">蝗槫庶譛滄俣</p>
                      <p className="text-2xl font-bold text-green-600">
                        {optimizationSimulation.paybackPeriod.toFixed(1)}繝ｶ譛・                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 螳滓命謗ｨ螂ｨ莠矩・*/}
          <Card>
            <CardHeader>
              <CardTitle>螳滓命謗ｨ螂ｨ莠矩・/CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">遏ｭ譛滓命遲厄ｼ・-6繝ｶ譛茨ｼ・/h4>
                    <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                      <li>谿区･ｭ莠句燕謇ｿ隱榊宛蠎ｦ縺ｮ蟆主・</li>
                      <li>繧ｷ繝輔ヨ譛驕ｩ蛹悶↓繧医ｋ莠ｺ蜩｡驟咲ｽｮ謾ｹ蝟・/li>
                      <li>螳壼梛讌ｭ蜍吶・讓呎ｺ門喧繝ｻ蜉ｹ邇・喧</li>
                      <li>驛ｨ鄂ｲ髢薙・讌ｭ蜍呵ｲ闕ｷ蟷ｳ貅門喧</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">荳ｭ譛滓命遲厄ｼ・-12繝ｶ譛茨ｼ・/h4>
                    <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
                      <li>蜍､諤邂｡逅・す繧ｹ繝・Β縺ｮ蟆主・繝ｻ譖ｴ譁ｰ</li>
                      <li>讌ｭ蜍吶・繝ｭ繧ｻ繧ｹ縺ｮ隕狗峩縺励・謾ｹ蝟・/li>
                      <li>繧ｹ繧ｭ繝ｫ繝槭ヨ繝ｪ繝・け繧ｹ縺ｫ蝓ｺ縺･縺城・鄂ｮ譛驕ｩ蛹・/li>
                      <li>繝代・繝医・豢ｾ驕｣縺ｮ豢ｻ逕ｨ譛驕ｩ蛹・/li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-amber-900 mb-2">髟ｷ譛滓命遲厄ｼ・蟷ｴ莉･荳奇ｼ・/h4>
                    <ul className="list-disc list-inside text-sm text-amber-800 space-y-1">
                      <li>髮ｻ蟄舌き繝ｫ繝・・讌ｭ蜍吶す繧ｹ繝・Β縺ｮ邨ｱ蜷・/li>
                      <li>AI繧呈ｴｻ逕ｨ縺励◆讌ｭ蜍呵・蜍募喧</li>
                      <li>邨・ｹ疲ｧ矩縺ｮ隕狗峩縺・/li>
                      <li>譁ｰ縺溘↑蜍､蜍吝ｽ｢諷九・蟆主・</li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">驥咲せ邂｡逅・Κ鄂ｲ</h4>
                    <ul className="list-disc list-inside text-sm text-purple-800 space-y-1">
                      {currentCostAnalysis.departmentData
                        .filter(d => d.overtimeRatio > 10)
                        .slice(0, 4)
                        .map(dept => (
                          <li key={dept.department}>
                            {dept.department}・域ｮ区･ｭ豈皮紫: {dept.overtimeRatio.toFixed(1)}%・・                          </li>
                        ))}
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
                title: '莠ｺ莉ｶ雋ｻ譛驕ｩ蛹門・譫舌Ξ繝昴・繝・,
                facility: selectedFacility,
                reportType: 'cost-optimization',
                elementId: 'report-content',
                dateRange: `蜑頑ｸ帷岼讓・ ${targetReduction}%`
              })}
              className="pdf-exclude bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              PDF繝繧ｦ繝ｳ繝ｭ繝ｼ繝・            </button>
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