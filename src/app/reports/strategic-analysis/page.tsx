'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import DashboardButton from '@/components/DashboardButton';
import FacilitySelector from '@/components/reports/FacilitySelector';
import CategoryReportCard from '@/components/reports/CategoryReportCard';
import CategoryBackButton from '@/components/reports/CategoryBackButton';
import ScrollToTopButton from '@/components/ScrollToTopButton';

const reports = [
  {
    id: 'talent-portfolio',
    title: 'タレントポートフォリオ',
    path: '/reports/strategic-analysis/talent-portfolio',
    description: '人材の能力と潜在性を可視化し戦略的配置を支援',
    icon: '💎',
    gradient: 'from-purple-500 to-purple-600'
  },
  {
    id: 'workforce-planning',
    title: '要員計画分析',
    path: '/reports/strategic-analysis/workforce-planning',
    description: '将来の人材需要予測と最適な要員配置計画',
    icon: '📈',
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    id: 'succession-risk',
    title: '後継者リスク分析',
    path: '/reports/strategic-analysis/succession-risk',
    description: 'キーポジションの後継者育成状況とリスク評価',
    icon: '🎯',
    gradient: 'from-red-500 to-red-600'
  },
  {
    id: 'skill-gap-analysis',
    title: 'スキルギャップ分析',
    path: '/reports/strategic-analysis/skill-gap-analysis',
    description: '組織に必要なスキルと現状のギャップを特定',
    icon: '🔍',
    gradient: 'from-green-500 to-green-600'
  },
  {
    id: 'org-effectiveness',
    title: '組織効率性分析',
    path: '/reports/strategic-analysis/org-effectiveness',
    description: '組織構造の最適性と業務効率を評価',
    icon: '⚙️',
    gradient: 'from-cyan-500 to-cyan-600'
  },
  {
    id: 'talent-investment-roi',
    title: '人材投資ROI',
    path: '/reports/strategic-analysis/talent-investment-roi',
    description: '研修・育成投資の効果測定と費用対効果',
    icon: '💰',
    gradient: 'from-yellow-500 to-yellow-600'
  }
];

function StrategicAnalysisPageContent() {
  const searchParams = useSearchParams();
  const selectedFacility = searchParams.get('facility') || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="戦略分析" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* カテゴリヘッダー */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">📈</span>
            <h1 className="text-2xl font-bold text-gray-900">戦略分析</h1>
          </div>
          <p className="text-gray-600">
            人材戦略の立案に必要な高度な分析とインサイトを提供します。
            タレントポートフォリオ、要員計画、スキルギャップなどの戦略的視点から、
            組織の持続的成長を支援する意思決定を可能にします。
          </p>
        </div>

        {/* 施設選択 */}
        <div className="mb-8">
          <FacilitySelector
            selectedFacility={selectedFacility}
            onFacilityChange={() => {}}
          />
        </div>

        {/* 戻るボタン */}
        <div className="mb-6">
          <CategoryBackButton />
        </div>

        {/* レポート一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <CategoryReportCard
              key={report.id}
              report={report}
              selectedFacility={selectedFacility}
            />
          ))}
        </div>

        {/* 使い方ガイド */}
        <div className="mt-12 bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-purple-900 mb-2">
            戦略分析の活用方法
          </h3>
          <ul className="list-disc list-inside text-purple-800 space-y-1">
            <li>中長期的な人材戦略の立案に活用できます</li>
            <li>組織の競争力強化に必要な施策を特定できます</li>
            <li>人材投資の優先順位付けが可能になります</li>
            <li>経営戦略と人材戦略の整合性を確保できます</li>
          </ul>
        </div>
      </div>
      
      <ScrollToTopButton />
      <DashboardButton />
    </div>
  );
}

export default function StrategicAnalysisPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StrategicAnalysisPageContent />
    </Suspense>
  );
}