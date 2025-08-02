'use client';

import React, { useState } from 'react';
import CommonHeader from '@/components/CommonHeader';
import DashboardButton from '@/components/DashboardButton';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import CategoryBackButton from '@/components/reports/CategoryBackButton';

interface TrendData {
  period: string;
  avgSkillScore: number;
  avgResultScore: number;
  quadrantChanges: {
    toHighHigh: number;
    toHighLow: number;
    toLowHigh: number;
    toLowLow: number;
  };
}

interface IndividualTrend {
  id: string;
  name: string;
  department: string;
  trends: {
    period: string;
    skillScore: number;
    resultScore: number;
  }[];
  currentQuadrant: string;
  improvement: number;
}

const organizationTrendData: TrendData[] = [
  {
    period: '2023年Q1',
    avgSkillScore: 68.5,
    avgResultScore: 72.3,
    quadrantChanges: { toHighHigh: 5, toHighLow: 3, toLowHigh: 4, toLowLow: 2 }
  },
  {
    period: '2023年Q2',
    avgSkillScore: 70.2,
    avgResultScore: 73.8,
    quadrantChanges: { toHighHigh: 8, toHighLow: 2, toLowHigh: 3, toLowLow: 1 }
  },
  {
    period: '2023年Q3',
    avgSkillScore: 71.5,
    avgResultScore: 75.2,
    quadrantChanges: { toHighHigh: 10, toHighLow: 2, toLowHigh: 2, toLowLow: 0 }
  },
  {
    period: '2023年Q4',
    avgSkillScore: 72.5,
    avgResultScore: 76.8,
    quadrantChanges: { toHighHigh: 12, toHighLow: 1, toLowHigh: 1, toLowLow: 0 }
  },
  {
    period: '2024年Q1',
    avgSkillScore: 73.8,
    avgResultScore: 78.2,
    quadrantChanges: { toHighHigh: 15, toHighLow: 1, toLowHigh: 0, toLowLow: 0 }
  }
];

const individualTrends: IndividualTrend[] = [
  {
    id: '1',
    name: '山田太郎',
    department: '看護部',
    trends: [
      { period: '2023年Q1', skillScore: 75, resultScore: 78 },
      { period: '2023年Q2', skillScore: 78, resultScore: 80 },
      { period: '2023年Q3', skillScore: 80, resultScore: 85 },
      { period: '2023年Q4', skillScore: 83, resultScore: 88 },
      { period: '2024年Q1', skillScore: 85, resultScore: 90 }
    ],
    currentQuadrant: 'high-high',
    improvement: 15
  },
  {
    id: '2',
    name: '佐藤花子',
    department: '看護部',
    trends: [
      { period: '2023年Q1', skillScore: 65, resultScore: 68 },
      { period: '2023年Q2', skillScore: 68, resultScore: 70 },
      { period: '2023年Q3', skillScore: 70, resultScore: 73 },
      { period: '2023年Q4', skillScore: 70, resultScore: 75 },
      { period: '2024年Q1', skillScore: 70, resultScore: 75 }
    ],
    currentQuadrant: 'low-high',
    improvement: 7
  },
  {
    id: '3',
    name: '鈴木一郎',
    department: 'リハビリ部',
    trends: [
      { period: '2023年Q1', skillScore: 85, resultScore: 80 },
      { period: '2023年Q2', skillScore: 87, resultScore: 82 },
      { period: '2023年Q3', skillScore: 88, resultScore: 83 },
      { period: '2023年Q4', skillScore: 90, resultScore: 84 },
      { period: '2024年Q1', skillScore: 90, resultScore: 85 }
    ],
    currentQuadrant: 'high-high',
    improvement: 5
  }
];

export default function EvaluationTrendPage() {
  const [viewMode, setViewMode] = useState<'organization' | 'individual' | 'department'>('organization');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  const getQuadrantLabel = (quadrant: string) => {
    const labels: Record<string, string> = {
      'high-high': 'ハイパフォーマー',
      'high-low': '要活性化',
      'low-high': '潜在力あり',
      'low-low': '要育成'
    };
    return labels[quadrant] || quadrant;
  };

  const getTrendIcon = (improvement: number) => {
    if (improvement > 10) return '↑↑';
    if (improvement > 0) return '↑';
    if (improvement < -10) return '↓↓';
    if (improvement < 0) return '↓';
    return '→';
  };

  const getTrendColor = (improvement: number) => {
    if (improvement > 0) return 'text-green-600';
    if (improvement < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="評価推移分析" />
      
      <div className="max-w-7xl mx-auto p-6">
        <CategoryBackButton />
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">2軸評価の時系列推移分析</h2>
            <div className="flex gap-3">
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as any)}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="organization">組織全体</option>
                <option value="individual">個人別</option>
                <option value="department">部門別</option>
              </select>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="all">全期間</option>
                <option value="year">過去1年</option>
                <option value="quarter">過去四半期</option>
              </select>
            </div>
          </div>

          {viewMode === 'organization' && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-4">組織全体のスコア推移</h3>
                  <div className="h-64 relative">
                    <svg width="100%" height="100%" viewBox="0 0 400 200">
                      <line x1="40" y1="180" x2="380" y2="180" stroke="#ccc" strokeWidth="1" />
                      <line x1="40" y1="20" x2="40" y2="180" stroke="#ccc" strokeWidth="1" />
                      
                      {organizationTrendData.map((data, index) => {
                        const x = 40 + (index * 320 / (organizationTrendData.length - 1));
                        const ySkill = 180 - ((data.avgSkillScore - 60) * 160 / 40);
                        const yResult = 180 - ((data.avgResultScore - 60) * 160 / 40);
                        
                        return (
                          <g key={data.period}>
                            {index > 0 && (
                              <>
                                <line
                                  x1={40 + ((index - 1) * 320 / (organizationTrendData.length - 1))}
                                  y1={180 - ((organizationTrendData[index - 1].avgSkillScore - 60) * 160 / 40)}
                                  x2={x}
                                  y2={ySkill}
                                  stroke="#3B82F6"
                                  strokeWidth="2"
                                />
                                <line
                                  x1={40 + ((index - 1) * 320 / (organizationTrendData.length - 1))}
                                  y1={180 - ((organizationTrendData[index - 1].avgResultScore - 60) * 160 / 40)}
                                  x2={x}
                                  y2={yResult}
                                  stroke="#10B981"
                                  strokeWidth="2"
                                />
                              </>
                            )}
                            <circle cx={x} cy={ySkill} r="4" fill="#3B82F6" />
                            <circle cx={x} cy={yResult} r="4" fill="#10B981" />
                            <text x={x} y="195" textAnchor="middle" fontSize="10" fill="#666">
                              {data.period.replace('年', '\n')}
                            </text>
                          </g>
                        );
                      })}
                      
                      <text x="20" y="25" fontSize="10" fill="#666">100</text>
                      <text x="20" y="180" fontSize="10" fill="#666">60</text>
                      <text x="200" y="15" textAnchor="middle" fontSize="12" fill="#333">スコア推移</text>
                    </svg>
                    <div className="absolute bottom-0 right-0 flex gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>スキル</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>成果</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-4">象限移動の傾向</h3>
                  <div className="space-y-3">
                    {organizationTrendData.slice(-3).map((data, index) => (
                      <div key={index} className="bg-white p-4 rounded border">
                        <p className="font-medium mb-2">{data.period}</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="bg-green-50 p-2 rounded">
                            <span className="text-green-700">→ハイパフォーマー: </span>
                            <span className="font-bold">{data.quadrantChanges.toHighHigh}名</span>
                          </div>
                          <div className="bg-yellow-50 p-2 rounded">
                            <span className="text-yellow-700">→要活性化: </span>
                            <span className="font-bold">{data.quadrantChanges.toHighLow}名</span>
                          </div>
                          <div className="bg-blue-50 p-2 rounded">
                            <span className="text-blue-700">→潜在力あり: </span>
                            <span className="font-bold">{data.quadrantChanges.toLowHigh}名</span>
                          </div>
                          <div className="bg-red-50 p-2 rounded">
                            <span className="text-red-700">→要育成: </span>
                            <span className="font-bold">{data.quadrantChanges.toLowLow}名</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-4">成長分析サマリー</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded border">
                    <p className="text-sm text-gray-600">平均スキル向上率</p>
                    <p className="text-2xl font-bold text-green-600">+7.6%</p>
                    <p className="text-xs text-gray-500">過去1年間</p>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <p className="text-sm text-gray-600">平均成果向上率</p>
                    <p className="text-2xl font-bold text-green-600">+8.1%</p>
                    <p className="text-xs text-gray-500">過去1年間</p>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <p className="text-sm text-gray-600">高評価者増加数</p>
                    <p className="text-2xl font-bold text-blue-600">+45名</p>
                    <p className="text-xs text-gray-500">前年同期比</p>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <p className="text-sm text-gray-600">改善必要者減少率</p>
                    <p className="text-2xl font-bold text-green-600">-32%</p>
                    <p className="text-xs text-gray-500">前年同期比</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {viewMode === 'individual' && (
            <div>
              <div className="mb-4">
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="px-4 py-2 border rounded-lg"
                >
                  <option value="all">全部門</option>
                  <option value="nursing">看護部</option>
                  <option value="rehab">リハビリ部</option>
                  <option value="care">介護部</option>
                </select>
              </div>

              <div className="space-y-4">
                {individualTrends.map(individual => (
                  <div key={individual.id} className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-lg">{individual.name}</h4>
                        <p className="text-sm text-gray-600">{individual.department}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getTrendColor(individual.improvement)}`}>
                          {getTrendIcon(individual.improvement)} {individual.improvement}%
                        </div>
                        <p className="text-xs text-gray-600">総合改善率</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded border">
                        <p className="text-sm font-medium mb-2">評価推移</p>
                        <div className="space-y-1">
                          {individual.trends.map((trend, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span>{trend.period}</span>
                              <span>スキル: {trend.skillScore} / 成果: {trend.resultScore}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded border">
                        <p className="text-sm font-medium mb-2">成長分析</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>現在の象限:</span>
                            <span className="font-medium">{getQuadrantLabel(individual.currentQuadrant)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>スキル成長:</span>
                            <span className="font-medium text-green-600">
                              +{individual.trends[individual.trends.length - 1].skillScore - individual.trends[0].skillScore}点
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>成果成長:</span>
                            <span className="font-medium text-green-600">
                              +{individual.trends[individual.trends.length - 1].resultScore - individual.trends[0].resultScore}点
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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