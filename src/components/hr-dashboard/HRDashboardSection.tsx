'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { facilityStaffDistribution } from '@/app/data/facilityData';

interface HRMetrics {
  // 基本指標
  totalStaff: number;
  facilityStaff: {
    obara: number;
    tachigami: number;
  };
  staffByType: {
    doctors: number;
    nurses: number;
    therapists: number;
    technicians: number;
    administrative: number;
    others: number;
  };
  averageAge: number;
  averageTenure: number;
  
  // 離職・定着関連
  turnoverRate: number;
  departmentTurnoverRisk: {
    [key: string]: number;
  };
  retentionRateByYear: {
    year1: number;
    year2: number;
    year3: number;
    year5Plus: number;
  };
  retirementPlanned: number;
  highRiskStaff: number;
  
  // 人材評価・質
  gradeDistribution: {
    S: number;
    A: number;
    B: number;
    C: number;
    D: number;
  };
  satisfaction: number;
  engagement: number;
  qualificationRate: number;
  specialistRate: number;
  
  // 組織効率・リスク
  averageOvertime: number;
  paidLeaveRate: number;
  mentalHealthIssues: number;
  harassmentCases: number;
  transferRequests: number;
}

const mockHRMetrics: HRMetrics = {
  totalStaff: 600,
  facilityStaff: {
    obara: 420,
    tachigami: 180
  },
  staffByType: {
    doctors: 53,
    nurses: 245,
    therapists: 75,
    technicians: 77,
    administrative: 70,
    others: 80
  },
  averageAge: 38.5,
  averageTenure: 6.8,
  
  turnoverRate: 8.5,
  departmentTurnoverRisk: {
    'ICU': 12.5,
    '外来': 10.2,
    '外科病棟': 8.8,
    '内科病棟': 7.3,
    'リハビリ': 5.2
  },
  retentionRateByYear: {
    year1: 88,
    year2: 82,
    year3: 78,
    year5Plus: 92
  },
  retirementPlanned: 15,
  highRiskStaff: 28,
  
  gradeDistribution: {
    S: 5,
    A: 25,
    B: 45,
    C: 20,
    D: 5
  },
  satisfaction: 87,
  engagement: 82,
  qualificationRate: 94,
  specialistRate: 68,
  
  averageOvertime: 12.5,
  paidLeaveRate: 65,
  mentalHealthIssues: 8,
  harassmentCases: 2,
  transferRequests: 23
};

export default function HRDashboardSection() {
  const [selectedFacility, setSelectedFacility] = useState<'all' | 'obara' | 'tachigami'>('all');
  const [activeTab, setActiveTab] = useState<'basic' | 'retention' | 'quality' | 'efficiency'>('basic');

  // 施設別データの計算
  const getFilteredMetrics = () => {
    if (selectedFacility === 'all') return mockHRMetrics;
    
    // 施設別のフィルタリング（簡易版）
    const facilityRatio = selectedFacility === 'obara' ? 0.7 : 0.3;
    
    return {
      ...mockHRMetrics,
      totalStaff: Math.round(mockHRMetrics.totalStaff * facilityRatio),
      staffByType: Object.fromEntries(
        Object.entries(mockHRMetrics.staffByType).map(([key, value]) => 
          [key, Math.round(value * facilityRatio)]
        )
      ),
      retirementPlanned: Math.round(mockHRMetrics.retirementPlanned * facilityRatio),
      highRiskStaff: Math.round(mockHRMetrics.highRiskStaff * facilityRatio),
    };
  };

  const metrics = getFilteredMetrics();

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto p-5">
        <div className="mb-12">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 shadow-lg border border-blue-200">
            {/* ヘッダー */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  📈
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">人事指標ダッシュボード</h2>
                  <p className="text-sm text-gray-600">法人全体の人事KPIを一元管理</p>
                </div>
              </div>
              
              {/* 施設フィルター */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedFacility('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedFacility === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  全施設
                </button>
                <button
                  onClick={() => setSelectedFacility('obara')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedFacility === 'obara'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  小原病院
                </button>
                <button
                  onClick={() => setSelectedFacility('tachigami')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedFacility === 'tachigami'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  立神病院
                </button>
              </div>
            </div>

            {/* タブナビゲーション */}
            <div className="flex gap-2 mb-6 border-b border-blue-200">
              <button
                onClick={() => setActiveTab('basic')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'basic'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                基本指標
              </button>
              <button
                onClick={() => setActiveTab('retention')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'retention'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                離職・定着
              </button>
              <button
                onClick={() => setActiveTab('quality')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'quality'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                人材評価・質
              </button>
              <button
                onClick={() => setActiveTab('efficiency')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'efficiency'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                組織効率・リスク
              </button>
            </div>

            {/* 基本指標タブ */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                {/* 総職員数と施設別 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl p-5 shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-600">総職員数</h3>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        前年比 +2.5%
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-gray-800">{metrics.totalStaff}名</div>
                    {selectedFacility === 'all' && (
                      <div className="mt-3 space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">小原病院</span>
                          <span className="font-semibold">{metrics.facilityStaff.obara}名</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">立神病院</span>
                          <span className="font-semibold">{metrics.facilityStaff.tachigami}名</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-xl p-5 shadow-md">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">平均年齢</h3>
                    <div className="text-3xl font-bold text-gray-800">{metrics.averageAge}歳</div>
                    <div className="mt-2 text-sm text-gray-600">
                      20代: 18% / 30代: 32% / 40代: 28% / 50代+: 22%
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-5 shadow-md">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">平均勤続年数</h3>
                    <div className="text-3xl font-bold text-gray-800">{metrics.averageTenure}年</div>
                    <div className="mt-2 text-sm text-gray-600">
                      中途採用率: 42%
                    </div>
                  </div>
                </div>

                {/* 職種別分布 */}
                <div className="bg-white rounded-xl p-5 shadow-md">
                  <h3 className="text-sm font-medium text-gray-600 mb-4">職種別分布</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">医師</span>
                      <span className="font-semibold">{metrics.staffByType.doctors}名</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">看護師</span>
                      <span className="font-semibold">{metrics.staffByType.nurses}名</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">療法士</span>
                      <span className="font-semibold">{metrics.staffByType.therapists}名</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">技師</span>
                      <span className="font-semibold">{metrics.staffByType.technicians}名</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">事務職</span>
                      <span className="font-semibold">{metrics.staffByType.administrative}名</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">その他</span>
                      <span className="font-semibold">{metrics.staffByType.others}名</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 離職・定着タブ */}
            {activeTab === 'retention' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl p-5 shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-600">離職率</h3>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        要改善
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-orange-600">{metrics.turnoverRate}%</div>
                    <div className="mt-2 text-sm text-gray-600">
                      業界平均: 10.2%
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-5 shadow-md">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">退職予定者</h3>
                    <div className="text-3xl font-bold text-gray-800">{metrics.retirementPlanned}名</div>
                    <div className="mt-2 text-sm text-gray-600">
                      今後6ヶ月以内
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-5 shadow-md">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">離職リスク高</h3>
                    <div className="text-3xl font-bold text-red-600">{metrics.highRiskStaff}名</div>
                    <div className="mt-2 text-sm text-gray-600">
                      要フォロー対象
                    </div>
                  </div>
                </div>

                {/* 部署別離職リスク */}
                <div className="bg-white rounded-xl p-5 shadow-md">
                  <h3 className="text-sm font-medium text-gray-600 mb-4">部署別離職リスク</h3>
                  <div className="space-y-3">
                    {Object.entries(metrics.departmentTurnoverRisk).map(([dept, risk]) => (
                      <div key={dept} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{dept}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-gray-200 rounded-full">
                            <div 
                              className={`h-full rounded-full ${
                                risk > 10 ? 'bg-red-500' : risk > 7 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${risk}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold">{risk}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 勤続年数別定着率 */}
                <div className="bg-white rounded-xl p-5 shadow-md">
                  <h3 className="text-sm font-medium text-gray-600 mb-4">勤続年数別定着率</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800">{metrics.retentionRateByYear.year1}%</div>
                      <div className="text-sm text-gray-600">1年目</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800">{metrics.retentionRateByYear.year2}%</div>
                      <div className="text-sm text-gray-600">2年目</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800">{metrics.retentionRateByYear.year3}%</div>
                      <div className="text-sm text-gray-600">3年目</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800">{metrics.retentionRateByYear.year5Plus}%</div>
                      <div className="text-sm text-gray-600">5年以上</div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>注意:</strong> 1-3年目の定着率が低下傾向。早期離職防止施策の強化が必要です。
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 人材評価・質タブ */}
            {activeTab === 'quality' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl p-5 shadow-md">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">満足度</h3>
                    <div className="text-3xl font-bold text-green-600">{metrics.satisfaction}%</div>
                    <div className="mt-2 text-sm text-gray-600">
                      前回比 +3.2%
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-5 shadow-md">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">エンゲージメント</h3>
                    <div className="text-3xl font-bold text-blue-600">{metrics.engagement}%</div>
                    <div className="mt-2 text-sm text-gray-600">
                      業界平均: 75%
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-5 shadow-md">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">資格取得率</h3>
                    <div className="text-3xl font-bold text-purple-600">{metrics.qualificationRate}%</div>
                    <div className="mt-2 text-sm text-gray-600">
                      目標: 95%
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-5 shadow-md">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">専門職率</h3>
                    <div className="text-3xl font-bold text-indigo-600">{metrics.specialistRate}%</div>
                    <div className="mt-2 text-sm text-gray-600">
                      認定・専門資格保有
                    </div>
                  </div>
                </div>

                {/* 評価グレード分布 */}
                <div className="bg-white rounded-xl p-5 shadow-md">
                  <h3 className="text-sm font-medium text-gray-600 mb-4">評価グレード分布</h3>
                  <div className="flex items-end justify-between gap-2">
                    {Object.entries(metrics.gradeDistribution).map(([grade, percentage]) => (
                      <div key={grade} className="flex-1 text-center">
                        <div className="relative">
                          <div 
                            className={`w-full rounded-t-lg ${
                              grade === 'S' ? 'bg-purple-500' :
                              grade === 'A' ? 'bg-blue-500' :
                              grade === 'B' ? 'bg-green-500' :
                              grade === 'C' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ height: `${percentage * 3}px` }}
                          >
                            <div className="absolute -top-6 left-0 right-0 text-sm font-semibold">
                              {percentage}%
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 text-lg font-bold">{grade}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 組織効率・リスクタブ */}
            {activeTab === 'efficiency' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl p-5 shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-600">平均残業時間</h3>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        要注意
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-orange-600">{metrics.averageOvertime}時間</div>
                    <div className="mt-2 text-sm text-gray-600">
                      月平均 / 目標: 10時間以下
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-5 shadow-md">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">有給取得率</h3>
                    <div className="text-3xl font-bold text-blue-600">{metrics.paidLeaveRate}%</div>
                    <div className="mt-2 text-sm text-gray-600">
                      法定目標: 70%
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-5 shadow-md">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">異動希望者</h3>
                    <div className="text-3xl font-bold text-purple-600">{metrics.transferRequests}名</div>
                    <div className="mt-2 text-sm text-gray-600">
                      前期比 -5名
                    </div>
                  </div>
                </div>

                {/* リスク指標 */}
                <div className="bg-white rounded-xl p-5 shadow-md border-l-4 border-red-500">
                  <h3 className="text-sm font-medium text-gray-600 mb-4">リスク指標</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-gray-700">メンタルヘルス問題</div>
                        <div className="text-xs text-gray-600 mt-1">休職・要フォロー</div>
                      </div>
                      <div className="text-2xl font-bold text-red-600">{metrics.mentalHealthIssues}件</div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-gray-700">ハラスメント相談</div>
                        <div className="text-xs text-gray-600 mt-1">今期発生</div>
                      </div>
                      <div className="text-2xl font-bold text-orange-600">{metrics.harassmentCases}件</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* アクションボタン */}
            <div className="mt-6 flex gap-3">
              <Link href="/reports/home" className="flex-1">
                <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
                  詳細レポートを見る
                </button>
              </Link>
              <Link href="/hr-strategy" className="flex-1">
                <button className="w-full bg-white hover:bg-gray-50 text-blue-600 font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-blue-200">
                  人材戦略を立案
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}