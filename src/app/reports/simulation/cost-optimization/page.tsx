'use client';

import React, { Suspense, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CommonHeader from '@/components/CommonHeader';
import DashboardButton from '@/components/DashboardButton';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import { BackToReportsButton } from '@/components/BackToReportsButton';
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
  const [selectedFacility, setSelectedFacility] = useState(facilityParam || '全施設');
  const [selectedDepartment, setSelectedDepartment] = useState('全部署');
  const [optimizationStrategy, setOptimizationStrategy] = useState('balanced');
  const [targetReduction, setTargetReduction] = useState(10); // %

  // 現在の人件費分析
  const currentCostAnalysis = useMemo(() => {
    const staffList = Object.values(staffDatabase).filter(staff => {
      if (selectedFacility !== '全施設' && staff.facility !== selectedFacility) return false;
      if (selectedDepartment !== '全部署' && staff.department !== selectedDepartment) return false;
      return true;
    });

    // 職種別の平均年収を設定（仮定値）
    const avgSalaryByPosition: { [key: string]: number } = {
      '医師': 12000000,
      '看護師': 5000000,
      '看護補助者': 3500000,
      '介護士': 3800000,
      '介護福祉士': 4200000,
      '理学療法士': 4500000,
      '作業療法士': 4500000,
      '言語聴覚士': 4500000,
      '薬剤師': 6000000,
      '診療放射線技師': 5000000,
      '臨床検査技師': 4800000,
      '管理栄養士': 4000000,
      '事務職員': 3500000
    };

    // 部署別・職種別の人件費を計算
    const costByDepartment: { [key: string]: { cost: number; count: number; overtime: number } } = {};
    const costByPosition: { [key: string]: { cost: number; count: number } } = {};
    let totalCost = 0;
    let totalOvertime = 0;

    staffList.forEach(staff => {
      const basePosition = staff.position.replace(/主任|師長|部長|科長/, '').trim();
      const baseSalary = avgSalaryByPosition[basePosition] || 4000000;
      
      // 役職手当
      let positionMultiplier = 1.0;
      if (staff.position.includes('部長')) positionMultiplier = 1.3;
      else if (staff.position.includes('科長')) positionMultiplier = 1.25;
      else if (staff.position.includes('師長')) positionMultiplier = 1.2;
      else if (staff.position.includes('主任')) positionMultiplier = 1.1;
      
      // 経験年数による昇給（簡易計算）
      const tenureYears = parseInt(staff.tenure) || 0;
      const tenureMultiplier = 1 + (tenureYears * 0.02);
      
      const annualSalary = baseSalary * positionMultiplier * tenureMultiplier;
      const overtimeCost = (staff.overtime / 160) * (annualSalary / 12) * 1.25; // 月額換算
      const totalStaffCost = annualSalary + (overtimeCost * 12);
      
      totalCost += totalStaffCost;
      totalOvertime += overtimeCost * 12;
      
      // 部署別集計
      if (!costByDepartment[staff.department]) {
        costByDepartment[staff.department] = { cost: 0, count: 0, overtime: 0 };
      }
      costByDepartment[staff.department].cost += totalStaffCost;
      costByDepartment[staff.department].count++;
      costByDepartment[staff.department].overtime += overtimeCost * 12;
      
      // 職種別集計
      if (!costByPosition[basePosition]) {
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

  // 最適化シミュレーション
  const optimizationSimulation = useMemo(() => {
    const strategies = {
      balanced: {
        overtime: 0.3,      // 残業削減
        efficiency: 0.3,    // 業務効率化
        staffing: 0.2,      // 適正配置
        automation: 0.2     // 自動化・システム化
      },
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
    
    // 各施策による削減額を計算
    const savingsByMethod = {
      overtime: targetSaving * strategy.overtime,
      efficiency: targetSaving * strategy.efficiency,
      staffing: targetSaving * strategy.staffing,
      automation: targetSaving * strategy.automation
    };

    // 実施コストを推定
    const implementationCost = {
      overtime: savingsByMethod.overtime * 0.1,    // 残業管理システム等
      efficiency: savingsByMethod.efficiency * 0.3, // 業務改善コンサル等
      staffing: savingsByMethod.staffing * 0.2,    // 配置最適化システム等
      automation: savingsByMethod.automation * 0.5  // IT投資等
    };

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

  // 年次推移予測
  const yearlyProjection = useMemo(() => {
    const years = [];
    const currentYear = new Date().getFullYear();
    let baseCost = currentCostAnalysis.totalCost;
    
    for (let i = 0; i <= 5; i++) {
      const year = currentYear + i;
      
      // 自然増（年2%の昇給等）
      const naturalIncrease = baseCost * 0.02 * i;
      
      // 最適化効果（段階的に実現）
      let optimizationEffect = 0;
      if (i > 0) {
        const realizationRate = Math.min(i / 3, 1); // 3年で完全実現
        optimizationEffect = optimizationSimulation.targetSaving * realizationRate;
      }
      
      const projectedCost = baseCost + naturalIncrease - optimizationEffect;
      
      years.push({
        year,
        現状維持: baseCost + naturalIncrease,
        最適化後: projectedCost,
        削減額: optimizationEffect,
        削減率: (optimizationEffect / (baseCost + naturalIncrease)) * 100
      });
    }
    
    return years;
  }, [currentCostAnalysis.totalCost, optimizationSimulation.targetSaving]);

  // 生産性指標
  const productivityMetrics = useMemo(() => {
    const staffList = Object.values(staffDatabase).filter(staff => {
      if (selectedFacility !== '全施設' && staff.facility !== selectedFacility) return false;
      if (selectedDepartment !== '全部署' && staff.department !== selectedDepartment) return false;
      return true;
    });

    // 仮の収益データ（実際は財務データと連携）
    const estimatedRevenue = staffList.length * 15000000; // 職員1人あたり1500万円と仮定
    const laborCostRatio = (currentCostAnalysis.totalCost / estimatedRevenue) * 100;
    const revenuePerStaff = estimatedRevenue / staffList.length;
    const costPerPatient = currentCostAnalysis.totalCost / (staffList.length * 300); // 1人あたり年間300人対応と仮定

    return {
      laborCostRatio,
      revenuePerStaff,
      costPerPatient,
      overtimeImpact: currentCostAnalysis.totalOvertime / currentCostAnalysis.totalCost * 100
    };
  }, [selectedFacility, selectedDepartment, currentCostAnalysis]);

  // フィルター用のリスト
  const facilities = useMemo(() => {
    const facilitySet = new Set(Object.values(staffDatabase).map(s => s.facility));
    return ['全施設', ...Array.from(facilitySet)];
  }, []);

  const departments = useMemo(() => {
    const staffList = selectedFacility === '全施設' 
      ? Object.values(staffDatabase)
      : Object.values(staffDatabase).filter(s => s.facility === selectedFacility);
    const deptSet = new Set(staffList.map(s => s.department));
    return ['全部署', ...Array.from(deptSet)];
  }, [selectedFacility]);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="人件費最適化分析" />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold">人件費最適化分析</h1>
            <p className="text-gray-600 mt-2">人件費推移の予測と生産性指標との相関分析</p>
            {facilityParam && (
              <p className="text-sm text-gray-500 mt-1">対象施設: {facilityParam}</p>
            )}
          </div>

          {/* フィルター */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">施設</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">部署</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">最適化戦略</label>
                <select
                  value={optimizationStrategy}
                  onChange={(e) => setOptimizationStrategy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="balanced">バランス型</option>
                  <option value="aggressive">積極型（残業削減重視）</option>
                  <option value="moderate">穏健型（段階的改善）</option>
                  <option value="technology">技術革新型（IT投資重視）</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">削減目標</label>
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

          {/* 現状の人件費サマリー */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>総人件費</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  ¥{(currentCostAnalysis.totalCost / 100000000).toFixed(1)}億
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  年間総額
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>平均人件費</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ¥{(currentCostAnalysis.averageCostPerStaff / 10000).toFixed(0)}万
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  職員1人あたり
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>残業代比率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">
                  {currentCostAnalysis.overtimeRatio.toFixed(1)}%
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  総人件費に占める割合
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>労働分配率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {productivityMetrics.laborCostRatio.toFixed(1)}%
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  推定収益に対する比率
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 人件費推移予測 */}
          <Card>
            <CardHeader>
              <CardTitle>人件費推移予測（5年間）</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={yearlyProjection}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis yAxisId="left" tickFormatter={(value) => `${(value / 100000000).toFixed(1)}億`} />
                    <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value.toFixed(1)}%`} />
                    <Tooltip 
                      formatter={(value, name) => {
                        const numValue = typeof value === 'number' ? value : parseFloat(value as string);
                        if (name === '削減率') return `${numValue.toFixed(1)}%`;
                        return `¥${(numValue / 100000000).toFixed(2)}億`;
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
                    <Area yAxisId="left" type="monotone" dataKey="削減額" fill="#10B981" fillOpacity={0.3} stroke="#10B981" />
                    <Line yAxisId="left" type="monotone" dataKey="現状維持" stroke="#EF4444" strokeWidth={2} strokeDasharray="5 5" />
                    <Line yAxisId="left" type="monotone" dataKey="最適化後" stroke="#3B82F6" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="削減率" stroke="#F59E0B" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 部署別人件費分析 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>部署別人件費構成</CardTitle>
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
                          return `¥${(numValue / 1000000).toFixed(1)}M`;
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
                <CardTitle>職種別平均人件費</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={currentCostAnalysis.positionData.slice(0, 8)}
                      layout="horizontal"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={(value) => `${(value / 10000).toFixed(0)}万`} />
                      <YAxis dataKey="position" type="category" width={100} />
                      <Tooltip 
                        formatter={(value) => {
                          const numValue = typeof value === 'number' ? value : parseFloat(value as string);
                          return `¥${(numValue / 10000).toFixed(0)}万円`;
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
                      <Bar dataKey="averageCost" fill="#3B82F6">
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

          {/* 最適化施策の詳細 */}
          <Card>
            <CardHeader>
              <CardTitle>最適化施策の内訳</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">削減効果の内訳</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium">残業時間削減</span>
                      <span className="text-lg font-bold text-blue-600">
                        ¥{(optimizationSimulation.savingsByMethod.overtime / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">業務効率化</span>
                      <span className="text-lg font-bold text-green-600">
                        ¥{(optimizationSimulation.savingsByMethod.efficiency / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                      <span className="text-sm font-medium">適正配置</span>
                      <span className="text-lg font-bold text-amber-600">
                        ¥{(optimizationSimulation.savingsByMethod.staffing / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium">自動化・システム化</span>
                      <span className="text-lg font-bold text-purple-600">
                        ¥{(optimizationSimulation.savingsByMethod.automation / 1000000).toFixed(1)}M
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">投資対効果</h4>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">実施コスト</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ¥{(optimizationSimulation.totalImplementationCost / 1000000).toFixed(1)}M
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">ROI（投資収益率）</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {optimizationSimulation.roi.toFixed(0)}%
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">回収期間</p>
                      <p className="text-2xl font-bold text-green-600">
                        {optimizationSimulation.paybackPeriod.toFixed(1)}ヶ月
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 実施推奨事項 */}
          <Card>
            <CardHeader>
              <CardTitle>実施推奨事項</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">短期施策（3-6ヶ月）</h4>
                    <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                      <li>残業事前承認制度の導入</li>
                      <li>シフト最適化による人員配置改善</li>
                      <li>定型業務の標準化・効率化</li>
                      <li>部署間の業務負荷平準化</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">中期施策（6-12ヶ月）</h4>
                    <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
                      <li>勤怠管理システムの導入・更新</li>
                      <li>業務プロセスの見直し・改善</li>
                      <li>スキルマトリックスに基づく配置最適化</li>
                      <li>パート・派遣の活用最適化</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-amber-900 mb-2">長期施策（1年以上）</h4>
                    <ul className="list-disc list-inside text-sm text-amber-800 space-y-1">
                      <li>電子カルテ・業務システムの統合</li>
                      <li>AIを活用した業務自動化</li>
                      <li>組織構造の見直し</li>
                      <li>新たな勤務形態の導入</li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">重点管理部署</h4>
                    <ul className="list-disc list-inside text-sm text-purple-800 space-y-1">
                      {currentCostAnalysis.departmentData
                        .filter(d => d.overtimeRatio > 10)
                        .slice(0, 4)
                        .map(dept => (
                          <li key={dept.department}>
                            {dept.department}（残業比率: {dept.overtimeRatio.toFixed(1)}%）
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* アクションボタン */}
          <div className="flex gap-4">
            <button 
              onClick={() => exportToPDF({
                title: '人件費最適化分析レポート',
                facility: selectedFacility,
                reportType: 'cost-optimization',
                elementId: 'report-content',
                dateRange: `削減目標: ${targetReduction}%`
              })}
              className="pdf-exclude bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              PDFダウンロード
            </button>
          </div>

        </div>
      </div>
      
      <ScrollToTopButton />
      <CategoryTopButton categoryPath="/reports/simulation" categoryName="シミュレーション" />
      <BackToReportsButton />
      <DashboardButton />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Content />
    </Suspense>
  );
}