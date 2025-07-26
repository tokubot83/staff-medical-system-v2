'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import DashboardButton from '@/components/DashboardButton';
import FacilitySelector from '@/components/reports/FacilitySelector';
import CategoryBackButton from '@/components/reports/CategoryBackButton';
import ScrollToTopButton from '@/components/ScrollToTopButton';

const reports = [
  {
    id: 'risk-prediction',
    title: '離職リスク予測',
    path: '/reports/turnover/risk-prediction',
    description: 'AIを活用した個人別離職リスクの予測と早期警告',
    icon: '🎯',
    gradient: 'from-red-500 to-red-600'
  },
  {
    id: 'high-risk-dashboard',
    title: '高リスク者ダッシュボード',
    path: '/reports/turnover/high-risk-dashboard',
    description: '離職リスクの高い職員の一覧と詳細分析',
    icon: '⚠️',
    gradient: 'from-orange-500 to-orange-600'
  },
  {
    id: 'factor-ranking',
    title: '離職要因ランキング',
    path: '/reports/turnover/factor-ranking',
    description: '離職に影響する要因を重要度順にランキング',
    icon: '📊',
    gradient: 'from-purple-500 to-purple-600'
  },
  {
    id: 'correlation-analysis',
    title: '相関分析',
    path: '/reports/turnover/correlation-analysis',
    description: '離職と各種指標の相関関係を可視化',
    icon: '📈',
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    id: 'predictive-modeling',
    title: '予測モデリング',
    path: '/reports/turnover/predictive-modeling',
    description: '機械学習による高精度な離職予測モデル',
    icon: '🤖',
    gradient: 'from-indigo-500 to-indigo-600'
  },
  {
    id: 'what-if-simulation',
    title: 'What-ifシミュレーション',
    path: '/reports/turnover/what-if-simulation',
    description: '施策実施時の離職率変化をシミュレーション',
    icon: '🔮',
    gradient: 'from-pink-500 to-pink-600'
  },
  {
    id: 'retention-strategies',
    title: '定着戦略提案',
    path: '/reports/turnover/retention-strategies',
    description: '部署・職種別の効果的な定着施策を提案',
    icon: '💡',
    gradient: 'from-green-500 to-green-600'
  },
  {
    id: 'improvement-suggestions',
    title: '改善施策提案',
    path: '/reports/turnover/improvement-suggestions',
    description: 'データに基づく具体的な改善アクション',
    icon: '🎯',
    gradient: 'from-teal-500 to-teal-600'
  }
];

function TurnoverPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedFacility = searchParams.get('facility') || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="離職分析" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* カテゴリヘッダー */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">📉</span>
            <h1 className="text-2xl font-bold text-gray-900">離職分析</h1>
          </div>
          <p className="text-gray-600">
            離職リスクの早期発見と予防策の立案を支援します。
            AIを活用した予測モデル、要因分析、シミュレーションなどにより、
            離職率の低減と組織の安定性向上を実現します。
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
            <div
              key={report.id}
              onClick={() => {
                const url = selectedFacility 
                  ? `${report.path}?facility=${encodeURIComponent(selectedFacility)}`
                  : report.path;
                router.push(url);
              }}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
            >
              <div className={`h-2 bg-gradient-to-r ${report.gradient}`} />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{report.icon}</span>
                  <h3 className="text-xl font-semibold">{report.title}</h3>
                </div>
                <p className="text-gray-600">{report.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 使い方ガイド */}
        <div className="mt-12 bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            離職分析の活用方法
          </h3>
          <ul className="list-disc list-inside text-red-800 space-y-1">
            <li>高リスク者を特定し、個別面談やフォローを実施できます</li>
            <li>離職要因を把握し、組織全体の改善策を立案できます</li>
            <li>施策の効果をシミュレーションし、最適な投資判断ができます</li>
            <li>予防的アプローチにより、離職コストを大幅に削減できます</li>
          </ul>
        </div>
      </div>
      
      <ScrollToTopButton />
      <DashboardButton />
    </div>
  );
}

export default function TurnoverPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TurnoverPageContent />
    </Suspense>
  );
}