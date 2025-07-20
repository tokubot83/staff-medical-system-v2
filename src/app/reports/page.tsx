'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { allReports } from '@/types/reports';
import FacilitySelector from '@/components/reports/FacilitySelector';
import CommonHeader from '@/components/CommonHeader';

export default function ReportsPage() {
  const [selectedFacility, setSelectedFacility] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader 
        title="レポートセンター" 
        showBackButton={true}
        backUrl="/"
        backText="ダッシュボードに戻る"
      />
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* ページ説明 */}
          <div className="mb-8">
            <p className="text-gray-600">
              基本指標から戦略的分析まで、全てのレポートを一覧できます。施設を選択してレポートを生成してください。
            </p>
          </div>

          {/* クイックアクセス */}
          <div className="mb-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">クイックアクセス</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Link href="/metrics/basic" className="flex items-center justify-center bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-3 transition-colors">
                <span className="text-green-700 font-medium">基本指標</span>
              </Link>
              <Link href="/metrics/quality" className="flex items-center justify-center bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-3 transition-colors">
                <span className="text-blue-700 font-medium">人材の質</span>
              </Link>
              <Link href="/metrics/growth" className="flex items-center justify-center bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-3 transition-colors">
                <span className="text-purple-700 font-medium">人材の成長</span>
              </Link>
              <Link href="/metrics/risk" className="flex items-center justify-center bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-lg p-3 transition-colors">
                <span className="text-yellow-700 font-medium">リスク管理</span>
              </Link>
              <Link href="/metrics/efficiency" className="flex items-center justify-center bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg p-3 transition-colors">
                <span className="text-red-700 font-medium">組織効率</span>
              </Link>
            </div>
          </div>

        {/* 施設選択 */}
        <div className="mb-8">
          <FacilitySelector
            selectedFacility={selectedFacility}
            onFacilityChange={setSelectedFacility}
          />
        </div>

        {/* 基本指標レポート */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">基本指標レポート</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allReports.filter(report => report.type === 'basic').map((report) => (
            <Link
              key={report.id}
              href={`${report.path}${selectedFacility ? `?facility=${selectedFacility}` : ''}`}
              className="block"
            >
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 h-full">
                <div className="flex items-center mb-4">
                  <div className={`${report.color} text-white rounded-lg p-3 text-2xl`}>
                    {report.icon}
                  </div>
                  <h3 className="ml-4 text-lg font-semibold text-gray-900">
                    {report.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  {report.description}
                </p>
                <div className="mt-4 flex items-center text-blue-600">
                  <span className="text-sm">レポートを見る</span>
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
            ))}
          </div>
        </div>

        {/* 戦略分析レポート */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">戦略分析レポート</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allReports.filter(report => report.type === 'strategic').map((report) => (
              <Link
                key={report.id}
                href={`${report.path}${selectedFacility ? `?facility=${selectedFacility}` : ''}`}
                className="block"
              >
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 h-full">
                  <div className="flex items-center mb-4">
                    <div className={`${report.color} text-white rounded-lg p-3 text-2xl`}>
                      {report.icon}
                    </div>
                    <h3 className="ml-4 text-lg font-semibold text-gray-900">
                      {report.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {report.description}
                  </p>
                  <div className="mt-4 flex items-center text-blue-600">
                    <span className="text-sm">レポートを見る</span>
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 注意事項 */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            レポート機能について
          </h3>
          <ul className="list-disc list-inside text-blue-800 space-y-1">
            <li>施設を選択すると、その施設に特化したレポートが生成されます</li>
            <li>全施設を選択した場合は、医療法人全体の統合レポートが生成されます</li>
            <li>各レポートはPDF形式でダウンロード可能です</li>
            <li>レポートは最新のデータに基づいてリアルタイムで生成されます</li>
          </ul>
        </div>
        </div>
      </div>
    </div>
  );
}