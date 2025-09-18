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
  Scatter,
  ScatterChart,
  ComposedChart,
  Cell
} from 'recharts';

// リスク要因の定義
const riskFactors = {
  pandemic: { name: '感染痁E��ンチE��チE��', probability: 0.15, impact: 0.9 },
  economicRecession: { name: '経済不況E, probability: 0.3, impact: 0.7 },
  nursingShortage: { name: '看護師不足深刻匁E, probability: 0.6, impact: 0.8 },
  agingSociety: { name: '趁E��齢化進屁E, probability: 0.9, impact: 0.6 },
  digitalization: { name: 'DX加送E, probability: 0.8, impact: 0.5 },
  regulatoryChange: { name: '制度改正', probability: 0.7, impact: 0.6 },
  naturalDisaster: { name: '自然災害', probability: 0.2, impact: 0.8 },
  competition: { name: '競争激匁E, probability: 0.5, impact: 0.5 }
};

function Content() {
  const searchParams = useSearchParams();
  const facilityParam = searchParams.get('facility') || '';
  const [selectedFacility, setSelectedFacility] = useState(facilityParam || '全施設');
  const [selectedScenario, setSelectedScenario] = useState('realistic');
  const [timeHorizon, setTimeHorizon] = useState(3); // years
  const [selectedRiskFactors, setSelectedRiskFactors] = useState(['nursingShortage', 'agingSociety', 'digitalization']);

  // 現状刁E��
  const currentState = useMemo(() => {
    const staffList = Object.values(staffDatabase).filter(staff => 
      selectedFacility === '全施設' || staff.facility === selectedFacility
    );
    
    const avgAge = staffList.reduce((sum, s) => sum + s.age, 0) / staffList.length;
    const avgTenure = staffList.reduce((sum, s) => sum + parseInt(s.tenure) || 0, 0) / staffList.length;
    const avgEngagement = staffList.reduce((sum, s) => sum + s.engagement, 0) / staffList.length;
    const avgStress = staffList.reduce((sum, s) => sum + s.stressIndex, 0) / staffList.length;
    
    // 職種別構�E
    const positionComposition: { [key: string]: number } = {};
    staffList.forEach(staff => {
      const basePosition = staff.position.replace(/主任|師長|部長|科長/, '').trim();
      positionComposition[basePosition] = (positionComposition[basePosition] || 0) + 1;
    });
    
    return {
      totalStaff: staffList.length,
      avgAge,
      avgTenure,
      avgEngagement,
      avgStress,
      positionComposition,
      retirementRisk: staffList.filter(s => s.age >= 55).length / staffList.length * 100
    };
  }, [selectedFacility]);

  // シナリオ定義
  const scenarios = useMemo(() => ({
    optimistic: {
      name: '楽観シナリオ',
      description: '経済�E長・医療需要増�E技術革新が進む',
      assumptions: {
        economicGrowth: 0.03,
        staffTurnover: 0.08,
        patientDemand: 1.15,
        technologyAdoption: 0.8,
        reimbursementRate: 1.02
      },
      color: '#10B981'
    },
    realistic: {
      name: '現実的シナリオ',
      description: '現状トレンドが継綁E,
      assumptions: {
        economicGrowth: 0.01,
        staffTurnover: 0.12,
        patientDemand: 1.08,
        technologyAdoption: 0.5,
        reimbursementRate: 0.98
      },
      color: '#3B82F6'
    },
    pessimistic: {
      name: '悲観シナリオ',
      description: '経済停滞�E人材不足・競争激匁E,
      assumptions: {
        economicGrowth: -0.01,
        staffTurnover: 0.18,
        patientDemand: 0.95,
        technologyAdoption: 0.3,
        reimbursementRate: 0.95
      },
      color: '#EF4444'
    }
  }), []);

  // シナリオ別予測
  const scenarioProjections = useMemo(() => {
    const projections = [];
    const currentYear = new Date().getFullYear();
    const scenario = scenarios[selectedScenario as keyof typeof scenarios];
    
    for (let i = 0; i <= timeHorizon; i++) {
      const year = currentYear + i;
      
      // スタチE��数予測
      const turnoverImpact = Math.pow(1 - scenario.assumptions.staffTurnover, i);
      const projectedStaff = Math.round(currentState.totalStaff * turnoverImpact);
      
      // 患老E��要予測
      const demandGrowth = Math.pow(scenario.assumptions.patientDemand, i);
      const projectedDemand = 100 * demandGrowth;
      
      // 収益予測�E�相対値�E�E      const revenueGrowth = Math.pow(scenario.assumptions.reimbursementRate, i) * demandGrowth;
      const projectedRevenue = 100 * revenueGrowth;
      
      // コスト予測
      const inflationFactor = Math.pow(1.02, i); // 年2%のインフレ
      const efficiencyGain = Math.pow(1 - scenario.assumptions.technologyAdoption * 0.05, i);
      const projectedCost = 100 * inflationFactor * efficiencyGain;
      
      projections.push({
        year,
        staffCount: projectedStaff,
        patientDemand: projectedDemand,
        revenue: projectedRevenue,
        cost: projectedCost,
        margin: projectedRevenue - projectedCost
      });
    }
    
    return projections;
  }, [selectedScenario, timeHorizon, currentState.totalStaff, scenarios]);

  // リスク影響度刁E��
  const riskImpactAnalysis = useMemo(() => {
    return selectedRiskFactors.map(riskKey => {
      const risk = riskFactors[riskKey as keyof typeof riskFactors];
      const scenario = scenarios[selectedScenario as keyof typeof scenarios];
      
      // シナリオ別のリスク影響度調整
      let adjustedProbability = risk.probability;
      let adjustedImpact = risk.impact;
      
      if (selectedScenario === 'optimistic') {
        adjustedProbability *= 0.7;
        adjustedImpact *= 0.8;
      } else if (selectedScenario === 'pessimistic') {
        adjustedProbability *= 1.3;
        adjustedImpact *= 1.2;
      }
      
      const riskScore = adjustedProbability * adjustedImpact * 100;
      
      return {
        name: risk.name,
        probability: Math.min(adjustedProbability * 100, 100),
        impact: Math.min(adjustedImpact * 100, 100),
        riskScore,
        category: riskScore > 60 ? 'high' : riskScore > 30 ? 'medium' : 'low'
      };
    });
  }, [selectedRiskFactors, selectedScenario, scenarios]);

  // 対応策�EトリチE��ス
  const responseStrategies = useMemo(() => {
    const strategies: Array<{ risk: string; strategies: string[]; priority: string; timeline: string }> = [];
    
    riskImpactAnalysis.forEach(risk => {
      const baseStrategies = {
        nursingShortage: ['採用強匁E, '定着玁E��上施筁E, '業務効玁E��', '外部人材活用'],
        agingSociety: ['慢性期対応強匁E, '在宁E��療展開', '予防医療推進', '地域連携強匁E],
        digitalization: ['IT投賁E��大', 'スタチE��教育', 'シスチE��統吁E, 'チE�Eタ活用推進'],
        pandemic: ['感染対策強匁E, 'BCM整傁E, '在宁E��務体制', '備蓄管琁E],
        economicRecession: ['コスト削渁E, '収益多角化', '効玁E��推進', '投賁E��制'],
        regulatoryChange: ['惁E��収集強匁E, '体制整傁E, 'コンプライアンス強匁E, '専門人材確俁E],
        naturalDisaster: ['BCP策宁E, '施設強匁E, '訓練実施', '代替拠点確俁E],
        competition: ['差別化戦略', 'サービス向丁E, 'マ�EケチE��ング強匁E, '提携推進']
      };
      
      const riskKey = Object.keys(riskFactors).find(key => riskFactors[key as keyof typeof riskFactors].name === risk.name);
      if (riskKey && baseStrategies[riskKey as keyof typeof baseStrategies]) {
        strategies.push({
          risk: risk.name,
          priority: risk.category === 'high' ? '最優允E : risk.category === 'medium' ? '優允E : '通常',
          strategies: baseStrategies[riskKey as keyof typeof baseStrategies],
          timeline: risk.category === 'high' ? '即時対忁E : risk.category === 'medium' ? '6ヶ月以冁E : '1年以冁E
        });
      }
    });
    
    return strategies.sort((a, b) => {
      const priorityOrder = { '最優允E: 0, '優允E: 1, '通常': 2 };
      return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
    });
  }, [riskImpactAnalysis]);

  // KPI目標設宁E  const kpiTargets = useMemo(() => {
    const scenario = scenarios[selectedScenario as keyof typeof scenarios];
    const baseTargets = {
      staffRetention: 88,
      patientSatisfaction: 85,
      operatingMargin: 5,
      bedOccupancy: 85,
      averageStay: 12
    };
    
    // シナリオ別調整
    const adjustmentFactor = selectedScenario === 'optimistic' ? 1.1 : 
                           selectedScenario === 'pessimistic' ? 0.9 : 1.0;
    
    return Object.entries(baseTargets).map(([key, value]) => ({
      indicator: key,
      current: value * 0.95,
      target: value * adjustmentFactor,
      stretch: value * adjustmentFactor * 1.1
    }));
  }, [selectedScenario, scenarios]);

  // シナリオ比輁E��ータ
  const scenarioComparison = useMemo(() => {
    const metrics = ['スタチE��数', '患老E��要E, '収益性', '投賁E��力', '競争力'];
    
    return metrics.map(metric => {
      const data: { metric: string; [key: string]: any } = { metric };
      
      Object.keys(scenarios).forEach(scenarioKey => {
        const scenario = scenarios[scenarioKey as keyof typeof scenarios];
        let value = 50; // ベ�Eスライン
        
        switch (metric) {
          case 'スタチE��数':
            value = 100 - (scenario.assumptions.staffTurnover * 100);
            break;
          case '患老E��要E:
            value = scenario.assumptions.patientDemand * 80;
            break;
          case '収益性':
            value = scenario.assumptions.reimbursementRate * 100 - 50;
            break;
          case '投賁E��力':
            value = (scenario.assumptions.economicGrowth + 0.05) * 1000;
            break;
          case '競争力':
            value = scenario.assumptions.technologyAdoption * 100;
            break;
        }
        
        data[scenarioKey] = Math.max(0, Math.min(100, value));
      });
      
      return data;
    });
  }, [scenarios]);

  const facilities = useMemo(() => {
    const facilitySet = new Set(Object.values(staffDatabase).map(s => s.facility));
    return ['全施設', ...Array.from(facilitySet)];
  }, []);

  const COLORS = {
    optimistic: '#10B981',
    realistic: '#3B82F6',
    pessimistic: '#EF4444'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="シナリオプランニング" />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold">シナリオプランニング</h1>
            <p className="text-gray-600 mt-2">褁E��の封E��シナリオに基づくリスク要因の特定と対応策�E事前検訁E/p>
            {facilityParam && (
              <p className="text-sm text-gray-500 mt-1">対象施設: {facilityParam}</p>
            )}
          </div>

          {/* フィルター */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">シナリオ</label>
                <select
                  value={selectedScenario}
                  onChange={(e) => setSelectedScenario(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(scenarios).map(([key, scenario]) => (
                    <option key={key} value={key}>{scenario.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">予測期間</label>
                <select
                  value={timeHorizon}
                  onChange={(e) => setTimeHorizon(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>1年</option>
                  <option value={3}>3年</option>
                  <option value={5}>5年</option>
                  <option value={10}>10年</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">老E�Eするリスク要因</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(riskFactors).map(([key, risk]) => (
                  <label key={key} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedRiskFactors.includes(key)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRiskFactors([...selectedRiskFactors, key]);
                        } else {
                          setSelectedRiskFactors(selectedRiskFactors.filter(k => k !== key));
                        }
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm">{risk.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* シナリオ概要E*/}
          <Card>
            <CardHeader>
              <CardTitle>{scenarios[selectedScenario as keyof typeof scenarios].name}の詳細</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{scenarios[selectedScenario as keyof typeof scenarios].description}</p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-600">経済�E長玁E/p>
                  <p className="text-lg font-bold">{(scenarios[selectedScenario as keyof typeof scenarios].assumptions.economicGrowth * 100).toFixed(1)}%</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-600">離職玁E/p>
                  <p className="text-lg font-bold">{(scenarios[selectedScenario as keyof typeof scenarios].assumptions.staffTurnover * 100).toFixed(0)}%</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-600">患老E��要E/p>
                  <p className="text-lg font-bold">×{scenarios[selectedScenario as keyof typeof scenarios].assumptions.patientDemand.toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-600">技術導�E玁E/p>
                  <p className="text-lg font-bold">{(scenarios[selectedScenario as keyof typeof scenarios].assumptions.technologyAdoption * 100).toFixed(0)}%</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-600">診療報酬</p>
                  <p className="text-lg font-bold">×{scenarios[selectedScenario as keyof typeof scenarios].assumptions.reimbursementRate.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 主要指標�E推移予測 */}
          <Card>
            <CardHeader>
              <CardTitle>主要指標�E推移予測</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={scenarioProjections}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
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
                    <Line type="monotone" dataKey="staffCount" stroke="#8B5CF6" strokeWidth={2} name="スタチE��数" />
                    <Line type="monotone" dataKey="patientDemand" stroke="#3B82F6" strokeWidth={2} name="患老E��要E />
                    <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} name="収益" />
                    <Line type="monotone" dataKey="cost" stroke="#F59E0B" strokeWidth={2} name="コスチE />
                    <Line type="monotone" dataKey="margin" stroke="#EF4444" strokeWidth={2} strokeDasharray="5 5" name="利益率" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* シナリオ比輁E��ーダーチャーチE*/}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>シナリオ別影響度比輁E/CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={scenarioComparison}>
                      <PolarGrid strokeDasharray="3 3" />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar name="楽観" dataKey="optimistic" stroke={COLORS.optimistic} fill={COLORS.optimistic} fillOpacity={0.3} />
                      <Radar name="現実的" dataKey="realistic" stroke={COLORS.realistic} fill={COLORS.realistic} fillOpacity={0.3} />
                      <Radar name="悲観" dataKey="pessimistic" stroke={COLORS.pessimistic} fill={COLORS.pessimistic} fillOpacity={0.3} />
                      <Legend />
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
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>リスクマトリチE��ス</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="probability" domain={[0, 100]} name="発生確玁E unit="%" />
                      <YAxis dataKey="impact" domain={[0, 100]} name="影響度" unit="%" />
                      <Tooltip 
                        cursor={{ strokeDasharray: '3 3' }}
                        contentStyle={{ 
                          backgroundColor: '#ffffff', 
                          border: '1px solid #e5e7eb', 
                          borderRadius: '6px',
                          padding: '10px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                        wrapperStyle={{ zIndex: 1000 }}
                      />
                      <Scatter name="リスク要因" data={riskImpactAnalysis}>
                        {riskImpactAnalysis.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={
                            entry.category === 'high' ? '#EF4444' :
                            entry.category === 'medium' ? '#F59E0B' : '#10B981'
                          } />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex items-center justify-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span>高リスク</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
                    <span>中リスク</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span>低リスク</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* リスク対応戦略 */}
          <Card>
            <CardHeader>
              <CardTitle>リスク対応戦略</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        リスク要因
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        優先度
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        対応戦略
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        実施時期
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {responseStrategies.map((strategy, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {strategy.risk}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            strategy.priority === '最優允E ? 'bg-red-100 text-red-800' :
                            strategy.priority === '優允E ? 'bg-amber-100 text-amber-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {strategy.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <ul className="list-disc list-inside">
                            {strategy.strategies.slice(0, 2).map((str: string, idx: number) => (
                              <li key={idx}>{str}</li>
                            ))}
                          </ul>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {strategy.timeline}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* KPI目標設宁E*/}
          <Card>
            <CardHeader>
              <CardTitle>シナリオ別KPI目樁E/CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={kpiTargets} 
                    layout="horizontal"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="indicator" type="category" width={120} />
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
                    <Bar dataKey="current" fill="#94A3B8" name="現在値" isAnimationActive={false} />
                    <Bar dataKey="target" fill={scenarios[selectedScenario as keyof typeof scenarios].color} name="目標値" isAnimationActive={false} />
                    <Bar dataKey="stretch" fill="#F59E0B" name="ストレチE��目樁E isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* アクションプラン */}
          <Card>
            <CardHeader>
              <CardTitle>推奨アクションプラン</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">即時対応頁E��</h4>
                    <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                      <li>リスク管琁E��員会�E設置</li>
                      <li>シナリオ別対応計画の策宁E/li>
                      <li>早期警戒指標！EWI�E��E設宁E/li>
                      <li>定期皁E��シナリオ見直し体制構篁E/li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">中期的取り絁E��</h4>
                    <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
                      <li>絁E��レジリエンスの強匁E/li>
                      <li>多様な収益源�E開発</li>
                      <li>人材育成�Eログラムの拡允E/li>
                      <li>チE��タル化投賁E�E加送E/li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-amber-900 mb-2">モニタリング頁E��</h4>
                    <ul className="list-disc list-inside text-sm text-amber-800 space-y-1">
                      <li>外部環墁E��化の定期評価</li>
                      <li>リスク持E���E継続的監要E/li>
                      <li>シナリオ前提条件の検証</li>
                      <li>対応策�E効果測宁E/li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">絁E���E力開発</h4>
                    <ul className="list-disc list-inside text-sm text-purple-800 space-y-1">
                      <li>シナリオ思老E�E絁E��浸送E/li>
                      <li>リスク感度の向丁E/li>
                      <li>変化対応力の強匁E/li>
                      <li>イノ�Eーション斁E��の醸戁E/li>
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
                title: 'シナリオプランニングレポ�EチE,
                facility: selectedFacility,
                reportType: 'scenario-planning',
                elementId: 'report-content',
                dateRange: `${scenarios[selectedScenario as keyof typeof scenarios].name} - ${timeHorizon}年予測`
              })}
              className="pdf-exclude bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              PDFダウンローチE            </button>
          </div>

        </div>
      </div><CategoryTopButton categoryPath="/reports/simulation" categoryName="シミュレーション" /></div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Content />
    </Suspense>
  );
}