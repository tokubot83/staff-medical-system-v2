'use client';

import React, { useState } from 'react';
import CommonHeader from '@/components/CommonHeader';
import DashboardButton from '@/components/DashboardButton';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import CategoryBackButton from '@/components/reports/CategoryBackButton';

interface OptimizationScenario {
  id: string;
  name: string;
  description: string;
  impact: {
    skillImprovement: number;
    resultImprovement: number;
    costImpact: number;
    timeToImplement: number;
    riskLevel: 'low' | 'medium' | 'high';
  };
  actions: string[];
  targetGroups: string[];
}

interface CurrentState {
  totalStaff: number;
  avgSkillScore: number;
  avgResultScore: number;
  quadrantDistribution: {
    highHigh: number;
    highLow: number;
    lowHigh: number;
    lowLow: number;
  };
  departmentGaps: {
    department: string;
    skillGap: number;
    resultGap: number;
  }[];
}

const currentState: CurrentState = {
  totalStaff: 288,
  avgSkillScore: 72.5,
  avgResultScore: 76.8,
  quadrantDistribution: {
    highHigh: 30,
    highLow: 15,
    lowHigh: 25,
    lowLow: 30
  },
  departmentGaps: [
    { department: '看護部', skillGap: -5, resultGap: -2 },
    { department: 'リハビリ部', skillGap: 5, resultGap: 3 },
    { department: '介護部', skillGap: -12, resultGap: -2 },
    { department: '医事課', skillGap: -6, resultGap: -9 },
    { department: '栄養課', skillGap: 2, resultGap: 5 }
  ]
};

const optimizationScenarios: OptimizationScenario[] = [
  {
    id: '1',
    name: '集中スキルアップ計画',
    description: '低スキル層を対象とした集中的な研修プログラムの実施',
    impact: {
      skillImprovement: 15,
      resultImprovement: 8,
      costImpact: -500000,
      timeToImplement: 6,
      riskLevel: 'low'
    },
    actions: [
      '専門スキル研修の実施（月40時間）',
      'メンター制度の導入',
      'オンライン学習プラットフォームの提供',
      'スキル認定制度の創設'
    ],
    targetGroups: ['低スキル層', '新入職員', '転職者']
  },
  {
    id: '2',
    name: 'パフォーマンス改善プログラム',
    description: '高スキル・低成果層への個別支援と環境改善',
    impact: {
      skillImprovement: 3,
      resultImprovement: 18,
      costImpact: -300000,
      timeToImplement: 3,
      riskLevel: 'medium'
    },
    actions: [
      '目標設定の見直しと明確化',
      '業務プロセスの最適化',
      'モチベーション向上施策',
      '成果測定方法の改善'
    ],
    targetGroups: ['高スキル・低成果層', '中堅職員']
  },
  {
    id: '3',
    name: 'タレント獲得・配置最適化',
    description: '外部からの優秀人材獲得と適材適所の配置転換',
    impact: {
      skillImprovement: 10,
      resultImprovement: 12,
      costImpact: -800000,
      timeToImplement: 12,
      riskLevel: 'high'
    },
    actions: [
      '中途採用の強化（年間20名）',
      '部門間ローテーションの実施',
      'ジョブマッチングシステムの導入',
      '退職リスクの高い優秀層の引き留め'
    ],
    targetGroups: ['全部門', '管理職層']
  },
  {
    id: '4',
    name: '統合的組織開発',
    description: '組織文化変革を含む包括的な改善プログラム',
    impact: {
      skillImprovement: 20,
      resultImprovement: 25,
      costImpact: -1500000,
      timeToImplement: 18,
      riskLevel: 'medium'
    },
    actions: [
      '評価制度の全面改定',
      'キャリアパスの明確化',
      '組織文化変革プログラム',
      'リーダーシップ開発',
      'エンゲージメント向上施策'
    ],
    targetGroups: ['全職員', '全部門']
  }
];

export default function OrganizationOptimizationPage() {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [compareScenarios, setCompareScenarios] = useState<string[]>([]);

  const handleScenarioSelect = (scenarioId: string) => {
    if (comparisonMode) {
      if (compareScenarios.includes(scenarioId)) {
        setCompareScenarios(compareScenarios.filter(id => id !== scenarioId));
      } else if (compareScenarios.length < 2) {
        setCompareScenarios([...compareScenarios, scenarioId]);
      }
    } else {
      setSelectedScenario(scenarioId === selectedScenario ? null : scenarioId);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const projectedState = (scenario: OptimizationScenario) => {
    return {
      avgSkillScore: currentState.avgSkillScore + scenario.impact.skillImprovement,
      avgResultScore: currentState.avgResultScore + scenario.impact.resultImprovement,
      quadrantDistribution: {
        highHigh: currentState.quadrantDistribution.highHigh + 15,
        highLow: currentState.quadrantDistribution.highLow - 5,
        lowHigh: currentState.quadrantDistribution.lowHigh - 5,
        lowLow: currentState.quadrantDistribution.lowLow - 5
      }
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="組織全体最適化" />
      
      <div className="max-w-7xl mx-auto p-6">
        <CategoryBackButton categoryId="dual-axis" />
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">2軸評価に基づく組織最適化シミュレーション</h2>
            <button
              onClick={() => {
                setComparisonMode(!comparisonMode);
                setCompareScenarios([]);
                setSelectedScenario(null);
              }}
              className={`px-4 py-2 rounded-lg transition-colors ${
                comparisonMode 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {comparisonMode ? 'シナリオ比較中' : 'シナリオ比較'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-4">現在の組織状態</h3>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded border">
                  <p className="text-sm text-gray-600">総職員数</p>
                  <p className="text-2xl font-bold">{currentState.totalStaff}名</p>
                </div>
                <div className="bg-white p-3 rounded border">
                  <p className="text-sm text-gray-600">平均スキルスコア</p>
                  <p className="text-2xl font-bold">{currentState.avgSkillScore}</p>
                </div>
                <div className="bg-white p-3 rounded border">
                  <p className="text-sm text-gray-600">平均成果スコア</p>
                  <p className="text-2xl font-bold">{currentState.avgResultScore}</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium mb-2">象限分布</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-green-50 p-2 rounded text-center">
                    <p>高高: {currentState.quadrantDistribution.highHigh}%</p>
                  </div>
                  <div className="bg-yellow-50 p-2 rounded text-center">
                    <p>高低: {currentState.quadrantDistribution.highLow}%</p>
                  </div>
                  <div className="bg-blue-50 p-2 rounded text-center">
                    <p>低高: {currentState.quadrantDistribution.lowHigh}%</p>
                  </div>
                  <div className="bg-red-50 p-2 rounded text-center">
                    <p>低低: {currentState.quadrantDistribution.lowLow}%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <h3 className="font-semibold mb-4">部門別ギャップ分析</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2">
                  {currentState.departmentGaps.map((gap, index) => (
                    <div key={index} className="bg-white p-3 rounded border flex justify-between items-center">
                      <span className="font-medium">{gap.department}</span>
                      <div className="flex gap-4 text-sm">
                        <span className={gap.skillGap >= 0 ? 'text-green-600' : 'text-red-600'}>
                          スキル: {gap.skillGap > 0 ? '+' : ''}{gap.skillGap}
                        </span>
                        <span className={gap.resultGap >= 0 ? 'text-green-600' : 'text-red-600'}>
                          成果: {gap.resultGap > 0 ? '+' : ''}{gap.resultGap}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">最適化シナリオ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {optimizationScenarios.map(scenario => (
                <div
                  key={scenario.id}
                  className={`border rounded-lg p-6 cursor-pointer transition-all ${
                    selectedScenario === scenario.id || compareScenarios.includes(scenario.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleScenarioSelect(scenario.id)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-lg">{scenario.name}</h4>
                    <span className={`px-2 py-1 rounded text-xs ${getRiskColor(scenario.impact.riskLevel)}`}>
                      リスク: {scenario.impact.riskLevel}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{scenario.description}</p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <p className="text-xs text-gray-600">スキル向上</p>
                      <p className="font-bold text-green-600">+{scenario.impact.skillImprovement}%</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <p className="text-xs text-gray-600">成果向上</p>
                      <p className="font-bold text-green-600">+{scenario.impact.resultImprovement}%</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <p className="text-xs text-gray-600">投資額</p>
                      <p className="font-bold text-red-600">
                        {Math.abs(scenario.impact.costImpact / 10000).toFixed(0)}万円
                      </p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <p className="text-xs text-gray-600">実施期間</p>
                      <p className="font-bold">{scenario.impact.timeToImplement}ヶ月</p>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <p className="font-medium mb-1">対象グループ:</p>
                    <div className="flex flex-wrap gap-1">
                      {scenario.targetGroups.map((group, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 rounded text-xs">
                          {group}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {(selectedScenario || compareScenarios.length > 0) && (
            <div className="mt-6">
              <h3 className="font-semibold mb-4">シナリオ詳細分析</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {(selectedScenario ? [selectedScenario] : compareScenarios).map(scenarioId => {
                  const scenario = optimizationScenarios.find(s => s.id === scenarioId);
                  if (!scenario) return null;
                  const projected = projectedState(scenario);
                  
                  return (
                    <div key={scenarioId} className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-lg mb-4">{scenario.name}</h4>
                      
                      <div className="mb-4">
                        <p className="font-medium mb-2">実施アクション:</p>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {scenario.actions.map((action, idx) => (
                            <li key={idx}>{action}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-white p-4 rounded">
                        <p className="font-medium mb-2">予測される成果:</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>平均スキルスコア:</span>
                            <span className="font-medium">
                              {currentState.avgSkillScore} → {projected.avgSkillScore}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>平均成果スコア:</span>
                            <span className="font-medium">
                              {currentState.avgResultScore} → {projected.avgResultScore}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>ROI (投資対効果):</span>
                            <span className="font-medium text-green-600">
                              {((scenario.impact.skillImprovement + scenario.impact.resultImprovement) / 
                                (Math.abs(scenario.impact.costImpact) / 1000000)).toFixed(1)}%/百万円
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
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