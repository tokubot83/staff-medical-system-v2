'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import DashboardButton from '@/components/DashboardButton';
import FacilitySelector from '@/components/reports/FacilitySelector';
import ReportNavigationCard from '@/components/reports/ReportNavigationCard';
import CategoryBackButton from '@/components/reports/CategoryBackButton';
import ScrollToTopButton from '@/components/ScrollToTopButton';

const reports = [
  {
    id: 'headcount-trends',
    title: '職員数推移',
    path: '/reports/basic-metrics/headcount-trends',
    description: '職員数の月次・年次推移を可視化',
    icon: '👥',
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    id: 'composition-analysis',
    title: '職員構成分析',
    path: '/reports/basic-metrics/composition-analysis',
    description: '職種・部署・年齢別の構成比を分析',
    icon: '📊',
    gradient: 'from-cyan-500 to-cyan-600'
  },
  {
    id: 'recruitment-metrics',
    title: '採用指標',
    path: '/reports/basic-metrics/recruitment-metrics',
    description: '採用数・採用率・充足率の追跡',
    icon: '🎯',
    gradient: 'from-green-500 to-green-600'
  },
  {
    id: 'turnover-metrics',
    title: '離職指標',
    path: '/reports/basic-metrics/turnover-metrics',
    description: '離職率・平均勤続年数の分析',
    icon: '📉',
    gradient: 'from-red-500 to-red-600'
  },
  {
    id: 'attendance-metrics',
    title: '勤怠指標',
    path: '/reports/basic-metrics/attendance-metrics',
    description: '出勤率・残業時間・有給取得率',
    icon: '⏰',
    gradient: 'from-purple-500 to-purple-600'
  },
  {
    id: 'cost-metrics',
    title: '人件費指標',
    path: '/reports/basic-metrics/cost-metrics',
    description: '人件費率・一人当たりコストの分析',
    icon: '💰',
    gradient: 'from-yellow-500 to-yellow-600'
  }
];

function BasicMetricsPageContent() {
  const searchParams = useSearchParams();
  const selectedFacility = searchParams.get('facility') || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="基本指標" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* カテゴリヘッダー */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">📊</span>
            <h1 className="text-2xl font-bold text-gray-900">基本指標</h1>
          </div>
          <p className="text-gray-600">
            職員数、構成比、採用・離職などの基本的な人事指標を確認します。
            組織の現状を数値で把握し、経営判断の基礎となるデータを提供します。
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
            <ReportNavigationCard
              key={report.id}
              report={report}
              selectedFacility={selectedFacility}
            />
          ))}
        </div>

        {/* 使い方ガイド */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            基本指標の活用方法
          </h3>
          <ul className="list-disc list-inside text-blue-800 space-y-1">
            <li>定期的にモニタリングすることで、組織の健全性を把握できます</li>
            <li>前年同期比や他施設との比較により、課題を早期発見できます</li>
            <li>採用計画や人員配置の最適化に活用できます</li>
            <li>経営層への報告資料として活用できます</li>
          </ul>
        </div>
      </div>
      
      <ScrollToTopButton />
      <DashboardButton />
    </div>
  );
}

export default function BasicMetricsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BasicMetricsPageContent />
    </Suspense>
  );
}