'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import DashboardButton from '@/components/DashboardButton';
import FacilitySelector from '@/components/reports/FacilitySelector';
import Link from 'next/link';
import CategoryBackButton from '@/components/reports/CategoryBackButton';
import ScrollToTopButton from '@/components/ScrollToTopButton';

const reports = [
  {
    id: 'basic',
    title: '基本指標',
    path: '/metrics/basic',
    description: '総職員数、部門別人員構成など基本的な統計データを確認します',
    icon: '📊',
    bgColor: 'bg-green-500'
  },
  {
    id: 'quality',
    title: '人材の質',
    path: '/metrics/quality',
    description: '職員満足度、スキル評価、資格保有状況を分析します',
    icon: '⭐',
    bgColor: 'bg-blue-500'
  },
  {
    id: 'growth',
    title: '人材の成長',
    path: '/metrics/growth',
    description: '研修受講率、スキル向上度、キャリア開発状況を確認します',
    icon: '📈',
    bgColor: 'bg-purple-500'
  },
  {
    id: 'risk',
    title: 'リスク管理',
    path: '/metrics/risk',
    description: '離職リスク、コンプライアンス、要注意職員の状況を管理します',
    icon: '⚠️',
    bgColor: 'bg-yellow-500'
  },
  {
    id: 'efficiency',
    title: '組織効率',
    path: '/metrics/efficiency',
    description: '労働生産性、業務効率、緊急対応事項を確認します',
    icon: '⚡',
    bgColor: 'bg-red-500'
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
          {reports.map((report) => {
            const url = selectedFacility 
              ? `${report.path}?facility=${encodeURIComponent(selectedFacility)}`
              : report.path;
            
            return (
              <Link key={report.id} className="block" href={url}>
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 h-full">
                  <div className="flex items-center mb-4">
                    <div className={`${report.bgColor} text-white rounded-lg p-3 text-2xl`}>
                      {report.icon}
                    </div>
                    <h3 className="ml-4 text-lg font-semibold text-gray-900">{report.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{report.description}</p>
                  <div className="mt-auto flex items-center text-blue-600">
                    <span className="text-sm">レポートを見る</span>
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
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