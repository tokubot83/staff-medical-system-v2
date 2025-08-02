'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import DashboardButton from '@/components/DashboardButton';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import { BackToReportsButton } from '@/components/BackToReportsButton';

interface OptimizationScenario {
  id: string;
  name: string;
  description: string;
  changes: {
    type: 'reallocation' | 'hiring' | 'training' | 'restructure';
    department: string;
    details: string;
    cost: number;
    timeframe: string;
  }[];
  expectedResults: {
    efficiency: number;
    satisfaction: number;
    costSaving: number;
    riskLevel: 'low' | 'medium' | 'high';
  };
}

interface CurrentState {
  department: string;
  currentStaff: number;
  optimalStaff: number;
  efficiency: number;
  workload: number;
  cost: number;
}

const mockCurrentState: CurrentState[] = [
  { department: '看護部', currentStaff: 120, optimalStaff: 115, efficiency: 78, workload: 85, cost: 450000000 },
  { department: 'リハビリ部', currentStaff: 35, optimalStaff: 40, efficiency: 85, workload: 92, cost: 120000000 },
  { department: '介護部', currentStaff: 80, optimalStaff: 85, efficiency: 72, workload: 88, cost: 320000000 },
  { department: '医事課', currentStaff: 25, optimalStaff: 22, efficiency: 74, workload: 75, cost: 80000000 },
  { department: '栄養課', currentStaff: 18, optimalStaff: 18, efficiency: 80, workload: 80, cost: 60000000 }
];

const mockScenarios: OptimizationScenario[] = [
  {
    id: '1',
    name: 'バランス調整案',
    description: '部門間での人員再配置による効率化',
    changes: [
      { type: 'reallocation', department: '看護部', details: '5名をリハビリ部・介護部に異動', cost: 2000000, timeframe: '3ヶ月' },
      { type: 'training', department: 'リハビリ部', details: '新規スタッフ研修プログラム', cost: 1500000, timeframe: '2ヶ月' },
      { type: 'reallocation', department: '医事課', details: '3名を他部門に異動', cost: 500000, timeframe: '1ヶ月' }
    ],
    expectedResults: {
      efficiency: 82,
      satisfaction: 80,
      costSaving: 15000000,
      riskLevel: 'low'
    }
  },
  {
    id: '2',
    name: '技能向上重点案',
    description: '既存スタッフのスキルアップによる生産性向上',
    changes: [
      { type: 'training', department: '全部門', details: '包括的研修プログラム実施', cost: 8000000, timeframe: '6ヶ月' },
      { type: 'restructure', department: '看護部', details: 'チーム制の導入', cost: 3000000, timeframe: '4ヶ月' },
      { type: 'training', department: '介護部', details: '専門技術研修強化', cost: 5000000, timeframe: '5ヶ月' }
    ],
    expectedResults: {
      efficiency: 88,
      satisfaction: 85,
      costSaving: 25000000,
      riskLevel: 'medium'
    }
  },
  {
    id: '3',
    name: '段階的改革案',
    description: '組織構造の抜本的見直し',
    changes: [
      { type: 'restructure', department: '全組織', details: 'フラット組織への移行', cost: 12000000, timeframe: '12ヶ月' },
      { type: 'hiring', department: 'リハビリ部', details: '専門職5名増員', cost: 15000000, timeframe: '6ヶ月' },
      { type: 'training', department: '全部門', details: 'リーダーシップ開発', cost: 6000000, timeframe: '8ヶ月' }
    ],
    expectedResults: {
      efficiency: 92,
      satisfaction: 88,
      costSaving: 40000000,
      riskLevel: 'high'
    }
  }
];

export default function OrganizationOptimizationPage() {
  const router = useRouter();
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [simulationStep, setSimulationStep] = useState(0);
  const [showComparison, setShowComparison] = useState(false);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getChangeTypeIcon = (type: string) => {
    switch (type) {
      case 'reallocation': return '↔️';
      case 'hiring': return '➕';
      case 'training': return '🎓';
      case 'restructure': return '🔄';
      default: return '📋';
    }
  };

  const simulateScenario = (scenario: OptimizationScenario) => {
    setSelectedScenario(scenario.id);
    setSimulationStep(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="組織最適化シミュレーション" />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6 flex gap-4">
          <BackToReportsButton />
          <CategoryTopButton categoryPath="/reports/performance-evaluation" categoryName="人事評価分析" />
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">組織最適化分析</h2>
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {showComparison ? '詳細表示' : '比較表示'}
            </button>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-4">現状分析</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border rounded-lg">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium">部門</th>
                    <th className="px-4 py-3 text-center text-sm font-medium">現在人数</th>
                    <th className="px-4 py-3 text-center text-sm font-medium">最適人数</th>
                    <th className="px-4 py-3 text-center text-sm font-medium">差異</th>
                    <th className="px-4 py-3 text-center text-sm font-medium">効率性</th>
                    <th className="px-4 py-3 text-center text-sm font-medium">負荷率</th>
                    <th className="px-4 py-3 text-center text-sm font-medium">年間コスト(千万円)</th>
                  </tr>
                </thead>
                <tbody>
                  {mockCurrentState.map(state => (
                    <tr key={state.department} className="border-t">
                      <td className="px-4 py-3 font-medium">{state.department}</td>
                      <td className="px-4 py-3 text-center">{state.currentStaff}</td>
                      <td className="px-4 py-3 text-center">{state.optimalStaff}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`font-medium ${
                          state.currentStaff > state.optimalStaff ? 'text-red-600' : 
                          state.currentStaff < state.optimalStaff ? 'text-yellow-600' : 
                          'text-green-600'
                        }`}>
                          {state.currentStaff - state.optimalStaff > 0 ? '+' : ''}{state.currentStaff - state.optimalStaff}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">{state.efficiency}%</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`${
                          state.workload > 90 ? 'text-red-600' : 
                          state.workload > 80 ? 'text-yellow-600' : 
                          'text-green-600'
                        }`}>
                          {state.workload}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">{Math.round(state.cost / 10000000)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {!showComparison ? (
            <div>
              <h3 className="font-semibold text-lg mb-4">最適化シナリオ</h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {mockScenarios.map(scenario => (
                  <div key={scenario.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="mb-4">
                      <h4 className="font-semibold text-lg mb-2">{scenario.name}</h4>
                      <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
                      <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(scenario.expectedResults.riskLevel)}`}>
                        リスク: {scenario.expectedResults.riskLevel === 'low' ? '低' : scenario.expectedResults.riskLevel === 'medium' ? '中' : '高'}
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      {scenario.changes.map((change, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{getChangeTypeIcon(change.type)}</span>
                            <span className="font-medium text-sm">{change.department}</span>
                          </div>
                          <p className="text-sm text-gray-600">{change.details}</p>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>費用: {(change.cost / 10000).toLocaleString()}万円</span>
                            <span>期間: {change.timeframe}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2 mb-4">
                      <h5 className="font-medium text-sm mb-2">期待効果</h5>
                      <div className="flex justify-between text-sm">
                        <span>効率性向上:</span>
                        <span className="font-medium text-green-600">+{scenario.expectedResults.efficiency}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>満足度向上:</span>
                        <span className="font-medium text-blue-600">+{scenario.expectedResults.satisfaction}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>年間コスト削減:</span>
                        <span className="font-medium text-purple-600">{(scenario.expectedResults.costSaving / 10000).toLocaleString()}万円</span>
                      </div>
                    </div>

                    <button
                      onClick={() => simulateScenario(scenario)}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      シミュレーション実行
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h3 className="font-semibold text-lg mb-4">シナリオ比較</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded-lg">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-sm font-medium">項目</th>
                      <th className="px-4 py-3 text-center text-sm font-medium">現状</th>
                      {mockScenarios.map(scenario => (
                        <th key={scenario.id} className="px-4 py-3 text-center text-sm font-medium">
                          {scenario.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="px-4 py-3 font-medium">平均効率性</td>
                      <td className="px-4 py-3 text-center">
                        {Math.round(mockCurrentState.reduce((sum, s) => sum + s.efficiency, 0) / mockCurrentState.length)}%
                      </td>
                      {mockScenarios.map(scenario => (
                        <td key={scenario.id} className="px-4 py-3 text-center text-green-600 font-medium">
                          {scenario.expectedResults.efficiency}%
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-3 font-medium">職員満足度</td>
                      <td className="px-4 py-3 text-center">75%</td>
                      {mockScenarios.map(scenario => (
                        <td key={scenario.id} className="px-4 py-3 text-center text-blue-600 font-medium">
                          {scenario.expectedResults.satisfaction}%
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-3 font-medium">年間コスト削減</td>
                      <td className="px-4 py-3 text-center">-</td>
                      {mockScenarios.map(scenario => (
                        <td key={scenario.id} className="px-4 py-3 text-center text-purple-600 font-medium">
                          {(scenario.expectedResults.costSaving / 10000).toLocaleString()}万円
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-3 font-medium">実装コスト</td>
                      <td className="px-4 py-3 text-center">-</td>
                      {mockScenarios.map(scenario => (
                        <td key={scenario.id} className="px-4 py-3 text-center text-orange-600 font-medium">
                          {(scenario.changes.reduce((sum, c) => sum + c.cost, 0) / 10000).toLocaleString()}万円
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-3 font-medium">リスクレベル</td>
                      <td className="px-4 py-3 text-center">-</td>
                      {mockScenarios.map(scenario => (
                        <td key={scenario.id} className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs ${getRiskColor(scenario.expectedResults.riskLevel)}`}>
                            {scenario.expectedResults.riskLevel === 'low' ? '低' : scenario.expectedResults.riskLevel === 'medium' ? '中' : '高'}
                          </span>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedScenario && simulationStep > 0 && (
            <div className="mt-6 p-6 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-4">シミュレーション結果</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded">
                    <h4 className="font-medium text-green-600">効率性改善</h4>
                    <p className="text-2xl font-bold">
                      +{mockScenarios.find(s => s.id === selectedScenario)?.expectedResults.efficiency}%
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded">
                    <h4 className="font-medium text-blue-600">満足度向上</h4>
                    <p className="text-2xl font-bold">
                      +{mockScenarios.find(s => s.id === selectedScenario)?.expectedResults.satisfaction}%
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded">
                    <h4 className="font-medium text-purple-600">年間削減額</h4>
                    <p className="text-2xl font-bold">
                      {((mockScenarios.find(s => s.id === selectedScenario)?.expectedResults.costSaving || 0) / 10000).toLocaleString()}万円
                    </p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <button
                    onClick={() => {
                      setSelectedScenario(null);
                      setSimulationStep(0);
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 mr-2"
                  >
                    リセット
                  </button>
                  <button
                    onClick={() => router.push('/reports/performance-evaluation')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    計画書作成
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ScrollToTopButton />
      <DashboardButton />
    </div>
  );
}