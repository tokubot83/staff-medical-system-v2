'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import FacilitySelector from '@/components/reports/FacilitySelector';

interface SkillData {
  name: string;
  department: string;
  skills: {
    clinical: number;
    communication: number;
    leadership: number;
    teamwork: number;
    problemSolving: number;
    technical: number;
  };
  trend: 'up' | 'down' | 'stable';
  growthRate: number;
}

function SkillAssessmentContent() {
  const searchParams = useSearchParams();
  const facilityFromUrl = searchParams.get('facility');
  const [selectedFacility, setSelectedFacility] = useState(facilityFromUrl || '');

  // サンプルチE�Eタ
  const skillData: SkillData[] = [
    {
      name: '山田太郁E,
      department: '冁E��病棁E,
      skills: {
        clinical: 85,
        communication: 90,
        leadership: 75,
        teamwork: 88,
        problemSolving: 82,
        technical: 79
      },
      trend: 'up',
      growthRate: 12
    },
    {
      name: '鈴木花孁E,
      department: '外科病棁E,
      skills: {
        clinical: 92,
        communication: 85,
        leadership: 88,
        teamwork: 91,
        problemSolving: 87,
        technical: 90
      },
      trend: 'up',
      growthRate: 8
    },
    {
      name: '田中美咲',
      department: 'ICU',
      skills: {
        clinical: 78,
        communication: 82,
        leadership: 70,
        teamwork: 85,
        problemSolving: 75,
        technical: 80
      },
      trend: 'stable',
      growthRate: 3
    }
  ];

  const getSkillLevel = (score: number) => {
    if (score >= 90) return { label: '卓趁E, color: 'text-purple-600' };
    if (score >= 80) return { label: '優秀', color: 'text-blue-600' };
    if (score >= 70) return { label: '良好', color: 'text-green-600' };
    if (score >= 60) return { label: '標溁E, color: 'text-yellow-600' };
    return { label: '要改喁E, color: 'text-red-600' };
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return '↗︁E;
      case 'down':
        return '↘︁E;
      case 'stable':
        return 'ↁE;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="スキル評価刁E��" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6"></div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">スキル評価刁E��レポ�EチE/h1>
            <p className="text-gray-600">
              職員の多面皁E��スキル評価を可視化し、個人の強み・弱みを把握して最適な育成計画を立案します、E
            </p>
          </div>
          
          <FacilitySelector
            selectedFacility={selectedFacility}
            onFacilityChange={setSelectedFacility}
          />
        </div>

        {/* 概要カーチE*/}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">平坁E��キルスコア</h3>
              <span className="text-2xl">📊</span>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">82.5</div>
            <p className="text-sm text-gray-600">前月毁E+2.3ポインチE/p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">成長玁E��チE�E</h3>
              <span className="text-2xl">🚀</span>
            </div>
            <div className="text-xl font-bold text-green-600 mb-2">山田太郁E/div>
            <p className="text-sm text-gray-600">成長玁E+12%</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">育成対象老E/h3>
              <span className="text-2xl">🎯</span>
            </div>
            <div className="text-3xl font-bold text-orange-600 mb-2">15吁E/div>
            <p className="text-sm text-gray-600">スキルギャチE�E要対忁E/p>
          </div>
        </div>

        {/* スキルマトリクス */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">個人別スキルマトリクス</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    氏名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    部門
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    臨床スキル
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    コミュニケーション
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    リーダーシチE�E
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    チ�Eムワーク
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    問題解決
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    技術スキル
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    成長玁E
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {skillData.map((person, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {person.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {person.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className={`text-sm font-medium ${getSkillLevel(person.skills.clinical).color}`}>
                        {person.skills.clinical}
                      </div>
                      <div className="text-xs text-gray-500">
                        {getSkillLevel(person.skills.clinical).label}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className={`text-sm font-medium ${getSkillLevel(person.skills.communication).color}`}>
                        {person.skills.communication}
                      </div>
                      <div className="text-xs text-gray-500">
                        {getSkillLevel(person.skills.communication).label}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className={`text-sm font-medium ${getSkillLevel(person.skills.leadership).color}`}>
                        {person.skills.leadership}
                      </div>
                      <div className="text-xs text-gray-500">
                        {getSkillLevel(person.skills.leadership).label}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className={`text-sm font-medium ${getSkillLevel(person.skills.teamwork).color}`}>
                        {person.skills.teamwork}
                      </div>
                      <div className="text-xs text-gray-500">
                        {getSkillLevel(person.skills.teamwork).label}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className={`text-sm font-medium ${getSkillLevel(person.skills.problemSolving).color}`}>
                        {person.skills.problemSolving}
                      </div>
                      <div className="text-xs text-gray-500">
                        {getSkillLevel(person.skills.problemSolving).label}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className={`text-sm font-medium ${getSkillLevel(person.skills.technical).color}`}>
                        {person.skills.technical}
                      </div>
                      <div className="text-xs text-gray-500">
                        {getSkillLevel(person.skills.technical).label}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center">
                        <span className="text-lg mr-1">{getTrendIcon(person.trend)}</span>
                        <span className={`text-sm font-medium ${
                          person.trend === 'up' ? 'text-green-600' : 
                          person.trend === 'down' ? 'text-red-600' : 
                          'text-gray-600'
                        }`}>
                          {person.growthRate > 0 ? '+' : ''}{person.growthRate}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* スキルギャチE�E刁E�� */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">スキルギャチE�E刁E��</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">部門別スキルギャチE�E</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">冁E��病棁E- リーダーシチE�E</span>
                  <span className="text-sm font-bold text-red-600">-15pt</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">外科病棁E- 技術スキル</span>
                  <span className="text-sm font-bold text-orange-600">-10pt</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">ICU - 問題解決</span>
                  <span className="text-sm font-bold text-yellow-600">-8pt</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">推奨育成�Eログラム</h3>
              <div className="space-y-3">
                <div className="p-3 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">リーダーシチE�E研修</span>
                    <span className="text-xs text-blue-600 font-medium">優先度: 髁E/span>
                  </div>
                  <p className="text-xs text-gray-600">対象: 冁E��病棟中堁E�E員 15吁E/p>
                </div>
                <div className="p-3 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">技術スキル向上�Eログラム</span>
                    <span className="text-xs text-green-600 font-medium">優先度: 中</span>
                  </div>
                  <p className="text-xs text-gray-600">対象: 外科病棟若手�E員 8吁E/p>
                </div>
                <div className="p-3 border border-purple-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">問題解決ワークショチE�E</span>
                    <span className="text-xs text-purple-600 font-medium">優先度: 中</span>
                  </div>
                  <p className="text-xs text-gray-600">対象: ICU全職員 12吁E/p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 活用ポインチE*/}
        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">
            💡 スキル評価刁E��の活用ポインチE
          </h2>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• 個人の強み・弱みを�E確化し、パーソナライズされた育成計画を立桁E/li>
            <li>• 部門別のスキルギャチE�Eを特定し、絁E���E体�E能力向上を図めE/li>
            <li>• 成長玁E�E高い職員を特定し、次世代リーダー候補として育戁E/li>
            <li>• スキルマトリクスを活用した適材適所の人材�E置を実現</li>
          </ul>
        </div>
      </div><CategoryTopButton categoryPath="/reports/performance-evaluation" categoryName="人事評価刁E��" /></div>
  );
}

export default function SkillAssessmentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SkillAssessmentContent />
    </Suspense>
  );
}