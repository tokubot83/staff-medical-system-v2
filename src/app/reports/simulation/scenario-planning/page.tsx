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
  pandemic: { name: '感染症パンデミック', probability: 0.15, impact: 0.9 },
  economicRecession: { name: '経済不況', probability: 0.3, impact: 0.7 },
  nursingShortage: { name: '看護師不足深刻化', probability: 0.6, impact: 0.8 },
  agingSociety: { name: '超高齢化進展', probability: 0.9, impact: 0.6 },
  digitalization: { name: 'DX加速', probability: 0.8, impact: 0.5 },
  regulatoryChange: { name: '制度改正', probability: 0.7, impact: 0.6 },
  naturalDisaster: { name: '自然災害', probability: 0.2, impact: 0.8 },
  competition: { name: '競争激化', probability: 0.5, impact: 0.5 }
};

function Content() {
  const searchParams = useSearchParams();
  const facilityParam = searchParams.get('facility') || '';
  const [selectedFacility, setSelectedFacility] = useState(facilityParam || '全施設');
  const [selectedScenario, setSelectedScenario] = useState('realistic');
  const [timeHorizon, setTimeHorizon] = useState(3); // years
  const [selectedRiskFactors, setSelectedRiskFactors] = useState(['nursingShortage', 'agingSociety', 'digitalization']);

  // 現状分析
  const currentState = useMemo(() => {
    const staffList = Object.values(staffDatabase).filter(staff => 
      selectedFacility === '全施設' || staff.facility === selectedFacility
    );
    
    const avgAge = staffList.reduce((sum, s) => sum + s.age, 0) / staffList.length;
    const avgTenure = staffList.reduce((sum, s) => sum + parseInt(s.tenure) || 0, 0) / staffList.length;
    const avgEngagement = staffList.reduce((sum, s) => sum + s.engagement, 0) / staffList.length;
    const avgStress = staffList.reduce((sum, s) => sum + s.stressIndex, 0) / staffList.length;
    
    // 職種別構成
    const positionComposition = {};
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
  const scenarios = {
    optimistic: {
      name: '楽観シナリオ',
      description: '経済成長・医療需要増・技術革新が進む',
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
      description: '現状トレンドが継続',
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
      description: '経済停滞・人材不足・競争激化',
      assumptions: {
        economicGrowth: -0.01,
        staffTurnover: 0.18,
        patientDemand: 0.95,
        technologyAdoption: 0.3,
        reimbursementRate: 0.95
      },
      color: '#EF4444'
    }
  };

  // シナリオ別予測
  const scenarioProjections = useMemo(() => {
    const projections = [];
    const currentYear = new Date().getFullYear();
    const scenario = scenarios[selectedScenario];
    
    for (let i = 0; i <= timeHorizon; i++) {
      const year = currentYear + i;
      
      // スタッフ数予測
      const turnoverImpact = Math.pow(1 - scenario.assumptions.staffTurnover, i);
      const projectedStaff = Math.round(currentState.totalStaff * turnoverImpact);
      
      // 患者需要予測
      const demandGrowth = Math.pow(scenario.assumptions.patientDemand, i);
      const projectedDemand = 100 * demandGrowth;
      
      // 収益予測（相対値）
      const revenueGrowth = Math.pow(scenario.assumptions.reimbursementRate, i) * demandGrowth;
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
  }, [selectedScenario, timeHorizon, currentState.totalStaff]);

  // リスク影響度分析
  const riskImpactAnalysis = useMemo(() => {
    return selectedRiskFactors.map(riskKey => {
      const risk = riskFactors[riskKey];
      const scenario = scenarios[selectedScenario];
      
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
  }, [selectedRiskFactors, selectedScenario]);

  // 対応策マトリックス
  const responseStrategies = useMemo(() => {
    const strategies = [];
    
    riskImpactAnalysis.forEach(risk => {
      const baseStrategies = {
        nursingShortage: ['採用強化', '定着率向上施策', '業務効率化', '外部人材活用'],
        agingSociety: ['慢性期対応強化', '在宅医療展開', '予防医療推進', '地域連携強化'],
        digitalization: ['IT投資拡大', 'スタッフ教育', 'システム統合', 'データ活用推進'],
        pandemic: ['感染対策強化', 'BCM整備', '在宅勤務体制', '備蓄管理'],
        economicRecession: ['コスト削減', '収益多角化', '効率化推進', '投資抑制'],
        regulatoryChange: ['情報収集強化', '体制整備', 'コンプライアンス強化', '専門人材確保'],
        naturalDisaster: ['BCP策定', '施設強化', '訓練実施', '代替拠点確保'],
        competition: ['差別化戦略', 'サービス向上', 'マーケティング強化', '提携推進']
      };
      
      const riskKey = Object.keys(riskFactors).find(key => riskFactors[key].name === risk.name);
      if (riskKey && baseStrategies[riskKey]) {
        strategies.push({
          risk: risk.name,
          priority: risk.category === 'high' ? '最優先' : risk.category === 'medium' ? '優先' : '通常',
          strategies: baseStrategies[riskKey],
          timeline: risk.category === 'high' ? '即時対応' : risk.category === 'medium' ? '6ヶ月以内' : '1年以内'
        });
      }
    });
    
    return strategies.sort((a, b) => {
      const priorityOrder = { '最優先': 0, '優先': 1, '通常': 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, [riskImpactAnalysis]);

  // KPI目標設定
  const kpiTargets = useMemo(() => {
    const scenario = scenarios[selectedScenario];
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
  }, [selectedScenario]);

  // シナリオ比較データ
  const scenarioComparison = useMemo(() => {
    const metrics = ['スタッフ数', '患者需要', '収益性', '投資余力', '競争力'];
    
    return metrics.map(metric => {
      const data = { metric };
      
      Object.keys(scenarios).forEach(scenarioKey => {
        const scenario = scenarios[scenarioKey];
        let value = 50; // ベースライン
        
        switch (metric) {
          case 'スタッフ数':
            value = 100 - (scenario.assumptions.staffTurnover * 100);
            break;
          case '患者需要':
            value = scenario.assumptions.patientDemand * 80;
            break;
          case '収益性':
            value = scenario.assumptions.reimbursementRate * 100 - 50;
            break;
          case '投資余力':
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
  }, []);

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
            <p className="text-gray-600 mt-2">複数の将来シナリオに基づくリスク要因の特定と対応策の事前検討</p>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">考慮するリスク要因</label>
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

          {/* シナリオ概要 */}
          <Card>
            <CardHeader>
              <CardTitle>{scenarios[selectedScenario].name}の詳細</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{scenarios[selectedScenario].description}</p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-600">経済成長率</p>
                  <p className="text-lg font-bold">{(scenarios[selectedScenario].assumptions.economicGrowth * 100).toFixed(1)}%</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-600">離職率</p>
                  <p className="text-lg font-bold">{(scenarios[selectedScenario].assumptions.staffTurnover * 100).toFixed(0)}%</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-600">患者需要</p>
                  <p className="text-lg font-bold">×{scenarios[selectedScenario].assumptions.patientDemand.toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-600">技術導入率</p>
                  <p className="text-lg font-bold">{(scenarios[selectedScenario].assumptions.technologyAdoption * 100).toFixed(0)}%</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-600">診療報酬</p>
                  <p className="text-lg font-bold">×{scenarios[selectedScenario].assumptions.reimbursementRate.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 主要指標の推移予測 */}
          <Card>
            <CardHeader>
              <CardTitle>主要指標の推移予測</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={scenarioProjections}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="staffCount" stroke="#8B5CF6" strokeWidth={2} name="スタッフ数" />
                    <Line type="monotone" dataKey="patientDemand" stroke="#3B82F6" strokeWidth={2} name="患者需要" />
                    <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} name="収益" />
                    <Line type="monotone" dataKey="cost" stroke="#F59E0B" strokeWidth={2} name="コスト" />
                    <Line type="monotone" dataKey="margin" stroke="#EF4444" strokeWidth={2} strokeDasharray="5 5" name="利益率" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* シナリオ比較レーダーチャート */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>シナリオ別影響度比較</CardTitle>
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
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>リスクマトリックス</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="probability" domain={[0, 100]} name="発生確率" unit="%" />
                      <YAxis dataKey="impact" domain={[0, 100]} name="影響度" unit="%" />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
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
                            strategy.priority === '最優先' ? 'bg-red-100 text-red-800' :
                            strategy.priority === '優先' ? 'bg-amber-100 text-amber-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {strategy.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <ul className="list-disc list-inside">
                            {strategy.strategies.slice(0, 2).map((str, idx) => (
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

          {/* KPI目標設定 */}
          <Card>
            <CardHeader>
              <CardTitle>シナリオ別KPI目標</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={kpiTargets} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="indicator" type="category" width={120} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="current" fill="#94A3B8" name="現在値" />
                    <Bar dataKey="target" fill={scenarios[selectedScenario].color} name="目標値" />
                    <Bar dataKey="stretch" fill="#F59E0B" name="ストレッチ目標" />
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
                    <h4 className="font-semibold text-blue-900 mb-2">即時対応項目</h4>
                    <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                      <li>リスク管理委員会の設置</li>
                      <li>シナリオ別対応計画の策定</li>
                      <li>早期警戒指標（EWI）の設定</li>
                      <li>定期的なシナリオ見直し体制構築</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">中期的取り組み</h4>
                    <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
                      <li>組織レジリエンスの強化</li>
                      <li>多様な収益源の開発</li>
                      <li>人材育成プログラムの拡充</li>
                      <li>デジタル化投資の加速</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-amber-900 mb-2">モニタリング項目</h4>
                    <ul className="list-disc list-inside text-sm text-amber-800 space-y-1">
                      <li>外部環境変化の定期評価</li>
                      <li>リスク指標の継続的監視</li>
                      <li>シナリオ前提条件の検証</li>
                      <li>対応策の効果測定</li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">組織能力開発</h4>
                    <ul className="list-disc list-inside text-sm text-purple-800 space-y-1">
                      <li>シナリオ思考の組織浸透</li>
                      <li>リスク感度の向上</li>
                      <li>変化対応力の強化</li>
                      <li>イノベーション文化の醸成</li>
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
                title: 'シナリオプランニングレポート',
                facility: selectedFacility,
                reportType: 'scenario-planning',
                elementId: 'report-content',
                dateRange: `${scenarios[selectedScenario].name} - ${timeHorizon}年予測`
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