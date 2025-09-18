'use client';

import React, { Suspense, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CommonHeader from '@/components/CommonHeader';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import { exportToPDF } from '@/utils/pdfExport';
import { staffDatabase } from '@/app/data/staffData';
import { organizationData as obaraOrganizationData } from '@/app/data/organizationData';
import { tachigamiOrganizationData } from '@/app/data/tachigamiOrganizationData';
import {
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
  Cell
} from 'recharts';

function Content() {
  const searchParams = useSearchParams();
  const facilityParam = searchParams.get('facility') || '';
  const [selectedFacility, setSelectedFacility] = useState(facilityParam || '小原痁E��');
  const [redesignScenario, setRedesignScenario] = useState('flatten');
  const [implementationPhase, setImplementationPhase] = useState('analysis');

  // 現在の絁E��構造刁E��
  const currentOrgAnalysis = useMemo(() => {
    const orgDataArray = selectedFacility === '小原痁E��' ? obaraOrganizationData : tachigamiOrganizationData;
    const staffList = Object.values(staffDatabase).filter(staff => staff.facility === selectedFacility);
    
    // 階層レベル別の刁E��
    const levelAnalysis: { [key: number]: { count: number; positions: string[] } } = {};
    const departmentStats: { [key: string]: { count: number; totalStaff: number } } = {};
    const spanOfControl: { [key: string]: number } = {}; // 管琁E��パン
    
    // 配�E形式�EチE�Eタを階層構造に変換
    interface OrgNode {
      name: string;
      type: string;
      children?: OrgNode[];
    }
    
    const buildHierarchy = (departments: typeof orgDataArray): OrgNode => {
      const deptMap = new Map(departments.map(d => [d.id, { ...d, children: [] as OrgNode[] }]));
      let root: OrgNode | null = null;
      
      departments.forEach(dept => {
        const node = deptMap.get(dept.id)!;
        if (dept.parentId) {
          const parent = deptMap.get(dept.parentId);
          if (parent && parent.children) {
            parent.children.push(node);
          }
        } else if (dept.level === 1) {
          root = node;
        }
      });
      
      return root || { name: 'Root', type: 'executive', children: [] };
    };
    
    const analyzeHierarchy = (node: OrgNode, level = 1, parentPath = '') => {
      const currentPath = parentPath ? `${parentPath} > ${node.name}` : node.name;
      
      if (!levelAnalysis[level]) {
        levelAnalysis[level] = { count: 0, positions: [] };
      }
      levelAnalysis[level].count++;
      levelAnalysis[level].positions.push(node.name);
      
      // 部署統訁E      if (!departmentStats[node.type]) {
        departmentStats[node.type] = { count: 0, totalStaff: 0 };
      }
      departmentStats[node.type].count++;
      
      // 管琁E��パンの計箁E      if (node.children && node.children.length > 0) {
        spanOfControl[currentPath] = node.children.length;
        node.children.forEach(child => analyzeHierarchy(child, level + 1, currentPath));
      }
    };
    
    const orgHierarchy = buildHierarchy(orgDataArray);
    analyzeHierarchy(orgHierarchy);
    
    // スタチE��配置の刁E��
    const staffByDepartment: { [key: string]: number } = {};
    staffList.forEach(staff => {
      if (!staffByDepartment[staff.department]) {
        staffByDepartment[staff.department] = 0;
      }
      staffByDepartment[staff.department]++;
    });
    
    // 効玁E��持E���E計箁E    const totalLevels = Object.keys(levelAnalysis).length;
    const avgSpanOfControl = Object.values(spanOfControl).reduce((sum, span) => sum + span, 0) / Object.keys(spanOfControl).length;
    const managementRatio = Object.values(levelAnalysis).slice(0, 3).reduce((sum, level) => sum + level.count, 0) / staffList.length;
    
    return {
      totalLevels,
      levelAnalysis,
      departmentStats,
      spanOfControl,
      avgSpanOfControl,
      managementRatio,
      staffByDepartment,
      totalStaff: staffList.length,
      organizationEfficiency: 100 - (managementRatio * 100) // 管琁E�E比率が低いほど効玁E��
    };
  }, [selectedFacility]);

  // 絁E��改編シナリオ
  const redesignScenarios = useMemo(() => ({
    flatten: {
      name: 'フラチE��匁E,
      description: '階層を削減し、意思決定を迁E��化',
      targetLevels: Math.max(3, currentOrgAnalysis.totalLevels - 2),
      benefits: ['意思決定�E迁E��化', '惁E��伝達の改喁E, '管琁E��スト削渁E],
      risks: ['管琁E��パンの増大', '中間管琁E�Eの抵抁E, '統制の困難匁E]
    },
    functional: {
      name: '機�E別再編',
      description: '専門機�Eごとに絁E��を再編戁E,
      targetStructure: '機�E別絁E��E,
      benefits: ['専門性の向丁E, '効玁E��なリソース活用', '標準化の俁E��'],
      risks: ['部門間連携の低丁E, 'サイロ匁E, '患老E��応�E刁E��']
    },
    matrix: {
      name: 'マトリチE��ス絁E��E,
      description: 'プロジェクト型の柔軟な絁E��構造',
      targetStructure: 'マトリチE��ス垁E,
      benefits: ['柔軟なリソース配�E', '専門知識�E共朁E, 'イノ�Eーション俁E��'],
      risks: ['持E��系統の褁E��匁E, '役割の曖昧ぁE, '調整コスト�E増加']
    },
    divisionalize: {
      name: '事業部制',
      description: '診療科�E部門ごとの独立性強匁E,
      targetStructure: '事業部制',
      benefits: ['責任の明確匁E, '迁E��な意思決宁E, '部門別採算管琁E],
      risks: ['重褁E���Eの発甁E, '全体最適の困難', '管琁E��門の肥大匁E]
    }
  }), [currentOrgAnalysis.totalLevels]);

  // 改編後�E効果予測
  const redesignImpact = useMemo(() => {
    const scenario = redesignScenarios[redesignScenario as keyof typeof redesignScenarios];
    const baseline = currentOrgAnalysis;
    
    // シナリオ別の効果を計箁E    let projectedMetrics = {
      levels: baseline.totalLevels,
      managementRatio: baseline.managementRatio,
      efficiency: baseline.organizationEfficiency,
      decisionSpeed: 50, // ベ�Eスライン
      flexibility: 50,
      coordination: 50,
      innovation: 50
    };
    
    switch (redesignScenario) {
      case 'flatten':
        if ('targetLevels' in scenario) {
          projectedMetrics.levels = scenario.targetLevels;
        }
        projectedMetrics.managementRatio *= 0.7;
        projectedMetrics.efficiency += 15;
        projectedMetrics.decisionSpeed += 30;
        projectedMetrics.flexibility += 20;
        projectedMetrics.coordination -= 10;
        break;
        
      case 'functional':
        projectedMetrics.efficiency += 20;
        projectedMetrics.decisionSpeed += 10;
        projectedMetrics.coordination -= 15;
        projectedMetrics.innovation += 10;
        break;
        
      case 'matrix':
        projectedMetrics.flexibility += 35;
        projectedMetrics.innovation += 30;
        projectedMetrics.coordination += 15;
        projectedMetrics.decisionSpeed -= 10;
        projectedMetrics.efficiency -= 5;
        break;
        
      case 'divisionalize':
        projectedMetrics.decisionSpeed += 25;
        projectedMetrics.flexibility += 15;
        projectedMetrics.efficiency -= 10;
        projectedMetrics.coordination -= 20;
        break;
    }
    
    // コスト影響の計箁E    const implementationCost = baseline.totalStaff * 50000; // 1人あためE丁E�Eの移行コスチE    const annualSaving = (baseline.managementRatio - projectedMetrics.managementRatio) * baseline.totalStaff * 5000000; // 管琁E�E削減による節紁E    
    return {
      current: {
        levels: baseline.totalLevels,
        efficiency: baseline.organizationEfficiency,
        managementRatio: baseline.managementRatio * 100,
        decisionSpeed: 50,
        flexibility: 50,
        coordination: 50,
        innovation: 50
      },
      projected: projectedMetrics,
      implementationCost,
      annualSaving,
      paybackPeriod: annualSaving > 0 ? implementationCost / annualSaving : null
    };
  }, [redesignScenario, currentOrgAnalysis, redesignScenarios]);

  // 実施フェーズ
  const implementationPhases = [
    { id: 'analysis', name: '現状刁E��', duration: '1-2ヶ朁E, status: implementationPhase === 'analysis' ? 'current' : 'pending' },
    { id: 'design', name: '設訁E, duration: '2-3ヶ朁E, status: implementationPhase === 'design' ? 'current' : 'pending' },
    { id: 'pilot', name: 'パイロチE��', duration: '3-6ヶ朁E, status: implementationPhase === 'pilot' ? 'current' : 'pending' },
    { id: 'rollout', name: '展開', duration: '6-12ヶ朁E, status: implementationPhase === 'rollout' ? 'current' : 'pending' },
    { id: 'stabilization', name: '定着', duration: '3-6ヶ朁E, status: implementationPhase === 'stabilization' ? 'current' : 'pending' }
  ];

  // 部門影響度刁E��
  const departmentImpactAnalysis = useMemo(() => {
    // staffByDepartmentが空の場合�Eフォールバック
    if (!currentOrgAnalysis.staffByDepartment || Object.keys(currentOrgAnalysis.staffByDepartment).length === 0) {
      return [];
    }
    
    return Object.entries(currentOrgAnalysis.staffByDepartment).map(([dept, count]) => {
      // シナリオ別の影響度を計箁E      let impactScore = 50; // ベ�Eスライン
      
      switch (redesignScenario) {
        case 'flatten':
          // 管琁E��門により大きな影響
          if (dept.includes('部') || dept.includes('私E)) impactScore = 80;
          break;
        case 'functional':
          // 診療部門に大きな影響
          if (dept.includes('痁E��E) || dept.includes('外来')) impactScore = 75;
          break;
        case 'matrix':
          // 全部門に中程度の影響
          impactScore = 65;
          break;
        case 'divisionalize':
          // 支援部門に大きな影響
          if (dept.includes('事務') || dept.includes('管琁E)) impactScore = 70;
          break;
      }
      
      return {
        department: dept,
        staffCount: count,
        impactScore: impactScore, // 数値であることを確実にする
        changeType: impactScore > 70 ? '大幁E��更' : impactScore > 50 ? '中程度変更' : '軽微な変更'
      };
    }).sort((a, b) => b.impactScore - a.impactScore);
  }, [currentOrgAnalysis.staffByDepartment, redesignScenario]);

  // レーダーチャート用チE�Eタ
  const performanceRadarData = [
    { metric: '効玁E��', current: redesignImpact.current.efficiency, projected: redesignImpact.projected.efficiency },
    { metric: '意思決定速度', current: redesignImpact.current.decisionSpeed, projected: redesignImpact.projected.decisionSpeed },
    { metric: '柔軟性', current: redesignImpact.current.flexibility, projected: redesignImpact.projected.flexibility },
    { metric: '調整劁E, current: redesignImpact.current.coordination, projected: redesignImpact.projected.coordination },
    { metric: 'イノ�Eーション', current: redesignImpact.current.innovation, projected: redesignImpact.projected.innovation }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="絁E��改編シミュレーション" />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold">絁E��改編シミュレーション</h1>
            <p className="text-gray-600 mt-2">絁E��構造の最適化提案と業務フローへの影響評価</p>
            {facilityParam && (
              <p className="text-sm text-gray-500 mt-1">対象施設: {facilityParam}</p>
            )}
          </div>

          {/* フィルター */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">対象施設</label>
                <select
                  value={selectedFacility}
                  onChange={(e) => setSelectedFacility(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="小原痁E��">小原痁E��</option>
                  <option value="立神リハビリチE�Eション温泉病院">立神リハビリチE�Eション温泉病院</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">改編シナリオ</label>
                <select
                  value={redesignScenario}
                  onChange={(e) => setRedesignScenario(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(redesignScenarios).map(([key, scenario]) => (
                    <option key={key} value={key}>{scenario.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">実施フェーズ</label>
                <select
                  value={implementationPhase}
                  onChange={(e) => setImplementationPhase(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {implementationPhases.map(phase => (
                    <option key={phase.id} value={phase.id}>{phase.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 現在の絁E��構造サマリー */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>階層レベル数</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {currentOrgAnalysis.totalLevels}層
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  現在の絁E��階層
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>平坁E��琁E��パン</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {currentOrgAnalysis.avgSpanOfControl.toFixed(1)}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  1人あたり�E直接部下数
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>管琁E�E比率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-600">
                  {(currentOrgAnalysis.managementRatio * 100).toFixed(1)}%
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  全職員に占める割吁E                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>絁E��効玁E��</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {currentOrgAnalysis.organizationEfficiency.toFixed(0)}%
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  効玁E��スコア
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 改編シナリオ詳細 */}
          <Card>
            <CardHeader>
              <CardTitle>{redesignScenarios[redesignScenario as keyof typeof redesignScenarios].name}シナリオ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">概要E/h4>
                  <p className="text-gray-600 mb-4">{redesignScenarios[redesignScenario as keyof typeof redesignScenarios].description}</p>
                  
                  <h4 className="font-semibold text-green-900 mb-2">期征E��极E/h4>
                  <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
                    {redesignScenarios[redesignScenario as keyof typeof redesignScenarios].benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-red-900 mb-2">リスク・課顁E/h4>
                  <ul className="list-disc list-inside text-sm text-red-800 space-y-1 mb-4">
                    {redesignScenarios[redesignScenario as keyof typeof redesignScenarios].risks.map((risk, index) => (
                      <li key={index}>{risk}</li>
                    ))}
                  </ul>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">コスト影響</h4>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="text-gray-600">実施コスト！E/span>
                        <span className="font-bold text-blue-600">¥{(redesignImpact.implementationCost / 1000000).toFixed(1)}M</span>
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-600">年間削減額！E/span>
                        <span className="font-bold text-green-600">
                          {redesignImpact.annualSaving > 0 ? `¥${(redesignImpact.annualSaving / 1000000).toFixed(1)}M` : '-'}
                        </span>
                      </p>
                      {redesignImpact.paybackPeriod && (
                        <p className="text-sm">
                          <span className="text-gray-600">回収期間�E�E/span>
                          <span className="font-bold">{redesignImpact.paybackPeriod.toFixed(1)}年</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* パフォーマンス比輁E*/}
          <Card>
            <CardHeader>
              <CardTitle>絁E��パフォーマンス比輁E/CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={performanceRadarData}>
                    <PolarGrid strokeDasharray="3 3" />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="現在" dataKey="current" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} />
                    <Radar name="改編征E dataKey="projected" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
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

          {/* 部門別影響度 */}
          <Card>
            <CardHeader>
              <CardTitle>部門別影響度刁E��</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                {departmentImpactAnalysis.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    チE�Eタがありません
                  </div>
                ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={departmentImpactAnalysis.slice(0, 10)} 
                    layout="horizontal"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="department" type="category" width={120} />
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
                    <Bar dataKey="impactScore" name="影響度スコア" fill="#3B82F6" isAnimationActive={false}>
                      {departmentImpactAnalysis.slice(0, 10).map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.impactScore > 70 ? '#EF4444' : entry.impactScore > 50 ? '#F59E0B' : '#10B981'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                )}
              </div>
              <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span>大幁E��更�E�E0以上！E/span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-amber-500 rounded"></div>
                  <span>中程度変更�E�E0-70�E�E/span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>軽微な変更�E�E0未満�E�E/span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 実施ロード�EチE�E */}
          <Card>
            <CardHeader>
              <CardTitle>実施ロード�EチE�E</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {implementationPhases.map((phase, index) => (
                  <div key={phase.id} className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold
                      ${phase.status === 'current' ? 'bg-blue-600' : 'bg-gray-300'}`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold ${phase.status === 'current' ? 'text-blue-900' : 'text-gray-700'}`}>
                        {phase.name}
                      </h4>
                      <p className="text-sm text-gray-600">期間: {phase.duration}</p>
                    </div>
                    {index < implementationPhases.length - 1 && (
                      <div className="w-16 h-0.5 bg-gray-300"></div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">
                  現在のフェーズ: {implementationPhases.find(p => p.id === implementationPhase)?.name}
                </h4>
                <div className="space-y-2 text-sm text-blue-800">
                  {implementationPhase === 'analysis' && (
                    <>
                      <p>• 現状の絁E��構造と課題�E詳細刁E��</p>
                      <p>• スチE�Eクホルダーへのヒアリング</p>
                      <p>• ベンチ�Eーク調査</p>
                    </>
                  )}
                  {implementationPhase === 'design' && (
                    <>
                      <p>• 新絁E��構造の詳細設訁E/p>
                      <p>• 役割・責任の再定義</p>
                      <p>• 移行計画の策宁E/p>
                    </>
                  )}
                  {implementationPhase === 'pilot' && (
                    <>
                      <p>• パイロチE��部門での試衁E/p>
                      <p>• 効果測定とフィードバチE��収集</p>
                      <p>• 改喁E��の特定と修正</p>
                    </>
                  )}
                  {implementationPhase === 'rollout' && (
                    <>
                      <p>• 段階的な全体展開</p>
                      <p>• 研修・教育の実施</p>
                      <p>• 継続的なモニタリング</p>
                    </>
                  )}
                  {implementationPhase === 'stabilization' && (
                    <>
                      <p>• 新絁E���E定着支援</p>
                      <p>• 効果�E検証と最適匁E/p>
                      <p>• 継続的改喁E�E仕絁E��構篁E/p>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 推奨事頁E*/}
          <Card>
            <CardHeader>
              <CardTitle>実施推奨事頁E/CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">成功要因</h4>
                    <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
                      <li>経営層の強ぁE��ミットメンチE/li>
                      <li>明確なビジョンとコミュニケーション</li>
                      <li>段階的な実施アプローチE/li>
                      <li>職員の参画と意見反映</li>
                      <li>継続的な効果測宁E/li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">重点管琁E��E��</h4>
                    <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                      <li>変更管琁E�Eロセスの確竁E/li>
                      <li>コミュニケーション計画の策宁E/li>
                      <li>研修・教育プログラムの準備</li>
                      <li>KPIの設定と測定体制</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-amber-900 mb-2">リスク対筁E/h4>
                    <ul className="list-disc list-inside text-sm text-amber-800 space-y-1">
                      <li>抵抗勢力への個別対忁E/li>
                      <li>業務継続性の確俁E/li>
                      <li>移行期間中のサポ�Eト体制</li>
                      <li>問題発生時のエスカレーション</li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">次のスチE��チE/h4>
                    <ul className="list-disc list-inside text-sm text-purple-800 space-y-1">
                      <li>スチE��リングコミッチE��の設置</li>
                      <li>詳細実施計画の策宁E/li>
                      <li>予算�E確保と承誁E/li>
                      <li>プロジェクトチームの編戁E/li>
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
                title: '絁E��改編シミュレーションレポ�EチE,
                facility: selectedFacility,
                reportType: 'organization-redesign',
                elementId: 'report-content',
                dateRange: `シナリオ: ${redesignScenarios[redesignScenario as keyof typeof redesignScenarios].name}`
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