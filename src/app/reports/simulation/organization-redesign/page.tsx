'use client';

import React, { Suspense, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CommonHeader from '@/components/CommonHeader';
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
  const [selectedFacility, setSelectedFacility] = useState(facilityParam || '小原病院');
  const [redesignScenario, setRedesignScenario] = useState('flatten');
  const [implementationPhase, setImplementationPhase] = useState('analysis');

  // 現在の組織構造分析
  const currentOrgAnalysis = useMemo(() => {
    const orgDataArray = selectedFacility === '小原病院' ? obaraOrganizationData : tachigamiOrganizationData;
    const staffList = Object.values(staffDatabase).filter(staff => staff.facility === selectedFacility);
    
    // 階層レベル別の分析
    const levelAnalysis: { [key: number]: { count: number; positions: string[] } } = {};
    const departmentStats: { [key: string]: { count: number; totalStaff: number } } = {};
    const spanOfControl: { [key: string]: number } = {}; // 管理スパン
    
    // 配列形式のデータを階層構造に変換
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
      
      // 部署統計
      if (!departmentStats[node.type]) {
        departmentStats[node.type] = { count: 0, totalStaff: 0 };
      }
      departmentStats[node.type].count++;
      
      // 管理スパンの計算
      if (node.children && node.children.length > 0) {
        spanOfControl[currentPath] = node.children.length;
        node.children.forEach(child => analyzeHierarchy(child, level + 1, currentPath));
      }
    };
    
    const orgHierarchy = buildHierarchy(orgDataArray);
    analyzeHierarchy(orgHierarchy);
    
    // スタッフ配置の分析
    const staffByDepartment: { [key: string]: number } = {};
    staffList.forEach(staff => {
      if (!staffByDepartment[staff.department]) {
        staffByDepartment[staff.department] = 0;
      }
      staffByDepartment[staff.department]++;
    });
    
    // 効率性指標の計算
    const totalLevels = Object.keys(levelAnalysis).length;
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
      organizationEfficiency: 100 - (managementRatio * 100) // 管理職比率が低いほど効率的
    };
  }, [selectedFacility]);

  // 組織改編シナリオ
  const redesignScenarios = useMemo(() => ({
    flatten: {
      name: 'フラット化',
      description: '階層を削減し、意思決定を迅速化',
      targetLevels: Math.max(3, currentOrgAnalysis.totalLevels - 2),
      benefits: ['意思決定の迅速化', '情報伝達の改善', '管理コスト削減'],
      risks: ['管理スパンの増大', '中間管理職の抵抗', '統制の困難化']
    },
    functional: {
      name: '機能別再編',
      description: '専門機能ごとに組織を再編成',
      targetStructure: '機能別組織',
      benefits: ['専門性の向上', '効率的なリソース活用', '標準化の促進'],
      risks: ['部門間連携の低下', 'サイロ化', '患者対応の分断']
    },
    matrix: {
      name: 'マトリックス組織',
      description: 'プロジェクト型の柔軟な組織構造',
      targetStructure: 'マトリックス型',
      benefits: ['柔軟なリソース配分', '専門知識の共有', 'イノベーション促進'],
      risks: ['指揮系統の複雑化', '役割の曖昧さ', '調整コストの増加']
    },
    divisionalize: {
      name: '事業部制',
      description: '診療科・部門ごとの独立性強化',
      targetStructure: '事業部制',
      benefits: ['責任の明確化', '迅速な意思決定', '部門別採算管理'],
      risks: ['重複機能の発生', '全体最適の困難', '管理部門の肥大化']
    }
  }), [currentOrgAnalysis.totalLevels]);

  // 改編後の効果予測
  const redesignImpact = useMemo(() => {
    const scenario = redesignScenarios[redesignScenario as keyof typeof redesignScenarios];
    const baseline = currentOrgAnalysis;
    
    // シナリオ別の効果を計算
    let projectedMetrics = {
      levels: baseline.totalLevels,
      managementRatio: baseline.managementRatio,
      efficiency: baseline.organizationEfficiency,
      decisionSpeed: 50, // ベースライン
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
    
    // コスト影響の計算
    const implementationCost = baseline.totalStaff * 50000; // 1人あたり5万円の移行コスト
    const annualSaving = (baseline.managementRatio - projectedMetrics.managementRatio) * baseline.totalStaff * 5000000; // 管理職削減による節約
    
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
    { id: 'analysis', name: '現状分析', duration: '1-2ヶ月', status: implementationPhase === 'analysis' ? 'current' : 'pending' },
    { id: 'design', name: '設計', duration: '2-3ヶ月', status: implementationPhase === 'design' ? 'current' : 'pending' },
    { id: 'pilot', name: 'パイロット', duration: '3-6ヶ月', status: implementationPhase === 'pilot' ? 'current' : 'pending' },
    { id: 'rollout', name: '展開', duration: '6-12ヶ月', status: implementationPhase === 'rollout' ? 'current' : 'pending' },
    { id: 'stabilization', name: '定着', duration: '3-6ヶ月', status: implementationPhase === 'stabilization' ? 'current' : 'pending' }
  ];

  // 部門影響度分析
  const departmentImpactAnalysis = useMemo(() => {
    // staffByDepartmentが空の場合のフォールバック
    if (!currentOrgAnalysis.staffByDepartment || Object.keys(currentOrgAnalysis.staffByDepartment).length === 0) {
      return [];
    }
    
    return Object.entries(currentOrgAnalysis.staffByDepartment).map(([dept, count]) => {
      // シナリオ別の影響度を計算
      let impactScore = 50; // ベースライン
      
      switch (redesignScenario) {
        case 'flatten':
          // 管理部門により大きな影響
          if (dept.includes('部') || dept.includes('科')) impactScore = 80;
          break;
        case 'functional':
          // 診療部門に大きな影響
          if (dept.includes('病棟') || dept.includes('外来')) impactScore = 75;
          break;
        case 'matrix':
          // 全部門に中程度の影響
          impactScore = 65;
          break;
        case 'divisionalize':
          // 支援部門に大きな影響
          if (dept.includes('事務') || dept.includes('管理')) impactScore = 70;
          break;
      }
      
      return {
        department: dept,
        staffCount: count,
        impactScore: impactScore, // 数値であることを確実にする
        changeType: impactScore > 70 ? '大幅変更' : impactScore > 50 ? '中程度変更' : '軽微な変更'
      };
    }).sort((a, b) => b.impactScore - a.impactScore);
  }, [currentOrgAnalysis.staffByDepartment, redesignScenario]);

  // レーダーチャート用データ
  const performanceRadarData = [
    { metric: '効率性', current: redesignImpact.current.efficiency, projected: redesignImpact.projected.efficiency },
    { metric: '意思決定速度', current: redesignImpact.current.decisionSpeed, projected: redesignImpact.projected.decisionSpeed },
    { metric: '柔軟性', current: redesignImpact.current.flexibility, projected: redesignImpact.projected.flexibility },
    { metric: '調整力', current: redesignImpact.current.coordination, projected: redesignImpact.projected.coordination },
    { metric: 'イノベーション', current: redesignImpact.current.innovation, projected: redesignImpact.projected.innovation }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="組織改編シミュレーション" />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold">組織改編シミュレーション</h1>
            <p className="text-gray-600 mt-2">組織構造の最適化提案と業務フローへの影響評価</p>
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
                  <option value="小原病院">小原病院</option>
                  <option value="立神リハビリテーション温泉病院">立神リハビリテーション温泉病院</option>
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

          {/* 現在の組織構造サマリー */}
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
                  現在の組織階層
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>平均管理スパン</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {currentOrgAnalysis.avgSpanOfControl.toFixed(1)}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  1人あたりの直接部下数
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>管理職比率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-600">
                  {(currentOrgAnalysis.managementRatio * 100).toFixed(1)}%
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  全職員に占める割合
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>組織効率性</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {currentOrgAnalysis.organizationEfficiency.toFixed(0)}%
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  効率性スコア
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
                  <h4 className="font-semibold text-gray-900 mb-2">概要</h4>
                  <p className="text-gray-600 mb-4">{redesignScenarios[redesignScenario as keyof typeof redesignScenarios].description}</p>
                  
                  <h4 className="font-semibold text-green-900 mb-2">期待効果</h4>
                  <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
                    {redesignScenarios[redesignScenario as keyof typeof redesignScenarios].benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-red-900 mb-2">リスク・課題</h4>
                  <ul className="list-disc list-inside text-sm text-red-800 space-y-1 mb-4">
                    {redesignScenarios[redesignScenario as keyof typeof redesignScenarios].risks.map((risk, index) => (
                      <li key={index}>{risk}</li>
                    ))}
                  </ul>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">コスト影響</h4>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="text-gray-600">実施コスト：</span>
                        <span className="font-bold text-blue-600">¥{(redesignImpact.implementationCost / 1000000).toFixed(1)}M</span>
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-600">年間削減額：</span>
                        <span className="font-bold text-green-600">
                          {redesignImpact.annualSaving > 0 ? `¥${(redesignImpact.annualSaving / 1000000).toFixed(1)}M` : '-'}
                        </span>
                      </p>
                      {redesignImpact.paybackPeriod && (
                        <p className="text-sm">
                          <span className="text-gray-600">回収期間：</span>
                          <span className="font-bold">{redesignImpact.paybackPeriod.toFixed(1)}年</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* パフォーマンス比較 */}
          <Card>
            <CardHeader>
              <CardTitle>組織パフォーマンス比較</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={performanceRadarData}>
                    <PolarGrid strokeDasharray="3 3" />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="現在" dataKey="current" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} />
                    <Radar name="改編後" dataKey="projected" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
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
              <CardTitle>部門別影響度分析</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                {departmentImpactAnalysis.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    データがありません
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
                  <span>大幅変更（70以上）</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-amber-500 rounded"></div>
                  <span>中程度変更（50-70）</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>軽微な変更（50未満）</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 実施ロードマップ */}
          <Card>
            <CardHeader>
              <CardTitle>実施ロードマップ</CardTitle>
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
                      <p>• 現状の組織構造と課題の詳細分析</p>
                      <p>• ステークホルダーへのヒアリング</p>
                      <p>• ベンチマーク調査</p>
                    </>
                  )}
                  {implementationPhase === 'design' && (
                    <>
                      <p>• 新組織構造の詳細設計</p>
                      <p>• 役割・責任の再定義</p>
                      <p>• 移行計画の策定</p>
                    </>
                  )}
                  {implementationPhase === 'pilot' && (
                    <>
                      <p>• パイロット部門での試行</p>
                      <p>• 効果測定とフィードバック収集</p>
                      <p>• 改善点の特定と修正</p>
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
                      <p>• 新組織の定着支援</p>
                      <p>• 効果の検証と最適化</p>
                      <p>• 継続的改善の仕組み構築</p>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 推奨事項 */}
          <Card>
            <CardHeader>
              <CardTitle>実施推奨事項</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">成功要因</h4>
                    <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
                      <li>経営層の強いコミットメント</li>
                      <li>明確なビジョンとコミュニケーション</li>
                      <li>段階的な実施アプローチ</li>
                      <li>職員の参画と意見反映</li>
                      <li>継続的な効果測定</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">重点管理項目</h4>
                    <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                      <li>変更管理プロセスの確立</li>
                      <li>コミュニケーション計画の策定</li>
                      <li>研修・教育プログラムの準備</li>
                      <li>KPIの設定と測定体制</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-amber-900 mb-2">リスク対策</h4>
                    <ul className="list-disc list-inside text-sm text-amber-800 space-y-1">
                      <li>抵抗勢力への個別対応</li>
                      <li>業務継続性の確保</li>
                      <li>移行期間中のサポート体制</li>
                      <li>問題発生時のエスカレーション</li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">次のステップ</h4>
                    <ul className="list-disc list-inside text-sm text-purple-800 space-y-1">
                      <li>ステアリングコミッティの設置</li>
                      <li>詳細実施計画の策定</li>
                      <li>予算の確保と承認</li>
                      <li>プロジェクトチームの編成</li>
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
                title: '組織改編シミュレーションレポート',
                facility: selectedFacility,
                reportType: 'organization-redesign',
                elementId: 'report-content',
                dateRange: `シナリオ: ${redesignScenarios[redesignScenario as keyof typeof redesignScenarios].name}`
              })}
              className="pdf-exclude bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              PDFダウンロード
            </button>
          </div>

        </div>
      </div></div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Content />
    </Suspense>
  );
}