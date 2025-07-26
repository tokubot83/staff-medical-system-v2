'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import FacilitySelector from '@/components/reports/FacilitySelector';
import CommonHeader from '@/components/CommonHeader';
import DashboardButton from '@/components/DashboardButton';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import CategoryReportCard from '@/components/reports/CategoryReportCard';
import { BackToReportsButton } from '@/components/BackToReportsButton';

export default function SimulationCategoryPage() {
  const router = useRouter();
  const [selectedFacility, setSelectedFacility] = useState('');

  const reports = [
    {
      id: 'recruitment-planning',
      title: '採用計画シミュレーション',
      description: '将来の人員需要を予測し、最適な採用計画を立案',
      icon: '👥',
      gradient: 'from-blue-500 to-cyan-500',
      path: '/reports/simulation/recruitment-planning',
      features: [
        '退職予測に基づく必要人員算出',
        '採用コストの最適化',
        '職種別・部署別の採用計画'
      ]
    },
    {
      id: 'retention-impact',
      title: 'リテンション施策効果予測',
      description: '各種施策が職員定着率に与える影響をシミュレーション',
      icon: '🎯',
      gradient: 'from-green-500 to-emerald-500',
      path: '/reports/simulation/retention-impact',
      features: [
        '施策別の効果予測',
        'コスト対効果の分析',
        '優先順位の提案'
      ]
    },
    {
      id: 'cost-optimization',
      title: '人件費最適化分析',
      description: '人件費と生産性のバランスを考慮した最適な人員配置を提案',
      icon: '💰',
      gradient: 'from-purple-500 to-pink-500',
      path: '/reports/simulation/cost-optimization',
      features: [
        '人件費推移の予測',
        '生産性指標との相関分析',
        '最適配置の提案'
      ]
    },
    {
      id: 'organization-redesign',
      title: '組織改編シミュレーション',
      description: '組織構造変更が業務効率や職員満足度に与える影響を予測',
      icon: '🏢',
      gradient: 'from-orange-500 to-red-500',
      path: '/reports/simulation/organization-redesign',
      features: [
        '組織構造の最適化提案',
        '業務フローへの影響評価',
        '移行計画の策定支援'
      ]
    },
    {
      id: 'scenario-planning',
      title: 'シナリオプランニング',
      description: '複数の将来シナリオに基づく人材戦略の検討',
      icon: '🔮',
      gradient: 'from-indigo-500 to-purple-500',
      path: '/reports/simulation/scenario-planning',
      features: [
        '楽観・現実・悲観シナリオ',
        'リスク要因の特定',
        '対応策の事前検討'
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
        {/* カテゴリー説明 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🔮</span>
            <h1 className="text-2xl font-bold text-gray-900">What-ifシミュレーション</h1>
          </div>
          <p className="text-gray-600">
            様々な条件や施策を仮定し、その影響を事前にシミュレーションすることで、
            データに基づいた意思決定を支援します。採用計画、人件費最適化、
            組織改編など、重要な人事戦略の立案において、リスクを最小化し、
            効果を最大化する最適解を見つけることができます。
          </p>
        </div>

        {/* 施設選択 */}
        <div className="mb-8">
          <FacilitySelector
            selectedFacility={selectedFacility}
            onFacilityChange={setSelectedFacility}
          />
        </div>

        {/* レポート一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <CategoryReportCard
              key={report.id}
              {...report}
              onClick={() => handleReportClick(report.path)}
            />
          ))}
        </div>
      </div>
      
      <ScrollToTopButton />
      <BackToReportsButton />
      <DashboardButton />
    </div>
  );
}