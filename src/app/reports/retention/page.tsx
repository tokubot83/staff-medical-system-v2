'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import DashboardButton from '@/components/DashboardButton';
import FacilitySelector from '@/components/reports/FacilitySelector';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import { BackToReportsButton } from '@/components/BackToReportsButton';

const reports = [
  {
    id: 'survival-curve-overall',
    title: '生存曲線分析（全体）',
    path: '/reports/retention/survival-curve-overall',
    description: '全職員の定着率を時系列で可視化し、定着パターンを分析',
    icon: '📈',
    gradient: 'from-green-500 to-green-600'
  },
  {
    id: 'survival-curve-department',
    title: '生存曲線分析（部署別）',
    path: '/reports/retention/survival-curve-department',
    description: '部署ごとの定着率の違いを比較分析',
    icon: '🏥',
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    id: 'cohort-yearly-tracking',
    title: 'コホート年次追跡',
    path: '/reports/retention/cohort-yearly-tracking',
    description: '入社年次別の定着率推移を長期追跡',
    icon: '📊',
    gradient: 'from-purple-500 to-purple-600'
  },
  {
    id: 'cohort-intervention-effect',
    title: 'コホート施策効果',
    path: '/reports/retention/cohort-intervention-effect',
    description: '定着施策の効果を入社年次別に測定',
    icon: '💡',
    gradient: 'from-yellow-500 to-yellow-600'
  },
  {
    id: 'early-turnover-pattern',
    title: '早期離職パターン',
    path: '/reports/retention/early-turnover-pattern',
    description: '入社3年以内の離職パターンと要因分析',
    icon: '⚠️',
    gradient: 'from-red-500 to-red-600'
  },
  {
    id: 'early-turnover-alert',
    title: '早期離職アラート',
    path: '/reports/retention/early-turnover-alert',
    description: '早期離職リスクの高い職員を早期検知',
    icon: '🚨',
    gradient: 'from-orange-500 to-orange-600'
  },
  {
    id: 'segment-generation',
    title: 'セグメント世代分析',
    path: '/reports/retention/segment-generation',
    description: '世代別の定着傾向と価値観の違いを分析',
    icon: '👥',
    gradient: 'from-teal-500 to-teal-600'
  },
  {
    id: 'segment-recruitment-type',
    title: 'セグメント採用種別',
    path: '/reports/retention/segment-recruitment-type',
    description: '新卒・中途別の定着率と成功要因',
    icon: '🎯',
    gradient: 'from-indigo-500 to-indigo-600'
  },
  {
    id: 'hazard-risk-score',
    title: 'ハザードリスクスコア',
    path: '/reports/retention/hazard-risk-score',
    description: '個人別の離職リスクをスコア化',
    icon: '📉',
    gradient: 'from-pink-500 to-pink-600'
  },
  {
    id: 'hazard-cox-regression',
    title: 'Cox回帰分析',
    path: '/reports/retention/hazard-cox-regression',
    description: '離職要因の統計的な影響度を分析',
    icon: '📊',
    gradient: 'from-gray-500 to-gray-600'
  },
  {
    id: 'factor-mapping',
    title: '定着要因マッピング',
    path: '/reports/retention/factor-mapping',
    description: '定着に影響する要因を網羅的に分析',
    icon: '🗺️',
    gradient: 'from-cyan-500 to-cyan-600'
  },
  {
    id: 'retention-simulator',
    title: '定着シミュレーター',
    path: '/reports/retention/retention-simulator',
    description: '施策導入による定着率変化をシミュレーション',
    icon: '🔮',
    gradient: 'from-violet-500 to-violet-600'
  },
  {
    id: 'turnover-contagion',
    title: '離職連鎖分析',
    path: '/reports/retention/turnover-contagion',
    description: '一人の離職が周囲に与える影響を分析',
    icon: '🔗',
    gradient: 'from-amber-500 to-amber-600'
  }
];

function RetentionPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedFacility = searchParams.get('facility') || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="定着分析" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* カテゴリヘッダー */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🎯</span>
            <h1 className="text-2xl font-bold text-gray-900">定着分析</h1>
          </div>
          <p className="text-gray-600">
            職員の定着率向上に向けた詳細な分析とアクションプランを提示します。
            生存曲線分析、コホート分析、早期離職予防など、多角的なアプローチで
            職員が長く働き続けられる組織づくりを支援します。
          </p>
        </div>

        {/* 施設選択 */}
        <div className="mb-8">
          <FacilitySelector
            selectedFacility={selectedFacility}
            onFacilityChange={() => {}}
          />
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
        <div className="mt-12 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            定着分析の活用方法
          </h3>
          <ul className="list-disc list-inside text-green-800 space-y-1">
            <li>定着率の低い部署や職種を特定し、改善策を立案できます</li>
            <li>早期離職のリスクが高い職員を事前に発見し、フォローできます</li>
            <li>世代や採用種別による違いを理解し、きめ細かな対応が可能です</li>
            <li>定着施策の効果を定量的に測定し、PDCAサイクルを回せます</li>
          </ul>
        </div>
      </div>
      <ScrollToTopButton />
      <BackToReportsButton />
      <DashboardButton />
    </div>
  );
}

export default function RetentionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RetentionPageContent />
    </Suspense>
  );
}