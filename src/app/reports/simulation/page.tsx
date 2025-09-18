'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import FacilitySelector from '@/components/reports/FacilitySelector';
import CommonHeader from '@/components/CommonHeader';
import CategoryReportCard from '@/components/reports/CategoryReportCard';

export default function SimulationCategoryPage() {
  const router = useRouter();
  const [selectedFacility, setSelectedFacility] = useState('');

  const reports = [
    {
      id: 'recruitment-planning',
      title: '採用計画シミュレーション',
      description: '封E��の人員需要を予測し、最適な採用計画を立桁E,
      icon: '👥',
      gradient: 'from-blue-500 to-cyan-500',
      path: '/reports/simulation/recruitment-planning',
      features: [
        '退職予測に基づく忁E��人員算�E',
        '採用コスト�E最適匁E,
        '職種別・部署別の採用計画'
      ]
    },
    {
      id: 'retention-impact',
      title: 'リチE��ション施策効果予測',
      description: '吁E��施策が職員定着玁E��与える影響をシミュレーション',
      icon: '🎯',
      gradient: 'from-green-500 to-emerald-500',
      path: '/reports/simulation/retention-impact',
      features: [
        '施策別の効果予測',
        'コスト対効果�E刁E��',
        '優先頁E���E提桁E
      ]
    },
    {
      id: 'cost-optimization',
      title: '人件費最適化�E极E,
      description: '人件費と生産性のバランスを老E�Eした最適な人員配置を提桁E,
      icon: '💰',
      gradient: 'from-purple-500 to-pink-500',
      path: '/reports/simulation/cost-optimization',
      features: [
        '人件費推移の予測',
        '生産性持E��との相関刁E��',
        '最適配置の提桁E
      ]
    },
    {
      id: 'organization-redesign',
      title: '絁E��改編シミュレーション',
      description: '絁E��構造変更が業務効玁E��職員満足度に与える影響を予測',
      icon: '🏢',
      gradient: 'from-orange-500 to-red-500',
      path: '/reports/simulation/organization-redesign',
      features: [
        '絁E��構造の最適化提桁E,
        '業務フローへの影響評価',
        '移行計画の策定支援'
      ]
    },
    {
      id: 'scenario-planning',
      title: 'シナリオプランニング',
      description: '褁E��の封E��シナリオに基づく人材戦略の検訁E,
      icon: '🔮',
      gradient: 'from-indigo-500 to-purple-500',
      path: '/reports/simulation/scenario-planning',
      features: [
        '楽観・現実�E悲観シナリオ',
        'リスク要因の特宁E,
        '対応策�E事前検訁E
      ]
    }
  ];

  const handleReportClick = (path: string) => {
    const url = selectedFacility 
      ? `${path}?facility=${encodeURIComponent(selectedFacility)}`
      : path;
    router.push(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="What-ifシミュレーション" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* カチE��リー説昁E*/}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🔮</span>
            <h1 className="text-2xl font-bold text-gray-900">What-ifシミュレーション</h1>
          </div>
          <p className="text-gray-600">
            様、E��条件めE��策を仮定し、その影響を事前にシミュレーションすることで、E
            チE�Eタに基づぁE��意思決定を支援します。採用計画、人件費最適化、E
            絁E��改編など、E��要な人事戦略の立案において、リスクを最小化し、E
            効果を最大化する最適解を見つけることができます、E
          </p>
        </div>

        {/* 施設選抁E*/}
        <div className="mb-8">
          <FacilitySelector
            selectedFacility={selectedFacility}
            onFacilityChange={setSelectedFacility}
          />
        </div>

        {/* レポ�Eト一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <CategoryReportCard
              key={report.id}
              {...report}
              onClick={() => handleReportClick(report.path)}
            />
          ))}
        </div>

        {/* アセスメントパターン */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-6">
            戦略皁E��思決定支援アセスメンチE
          </h3>
          
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="text-blue-800 mb-3">
              <span className="font-medium">推奨フロー�E�E/span>
              採用計画シミュレーション ↁEリチE��ション施策効果予測 ↁE絁E��改編シミュレーション ↁEシナリオプランニング
            </div>
            <ul className="list-disc list-inside text-blue-700 space-y-1">
              <li>封E��の人員需要予測と最適採用計画</li>
              <li>施策効果�E事前評価とROI算�E</li>
              <li>絁E��変更による影響の事前刁E��</li>
              <li>褁E��シナリオでのリスク評価</li>
            </ul>
          </div>

          <div className="mt-4 text-blue-800 text-sm">
            <p className="font-medium">
              What-ifシミュレーションにより、データに基づく戦略皁E��思決定とリスク最小化を実現できます、E
            </p>
          </div>
        </div>
      </div></div>
  );
}