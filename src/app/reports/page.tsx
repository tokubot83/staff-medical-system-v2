'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { reports } from '@/types/reports';
import FacilitySelector from '@/components/reports/FacilitySelector';

export default function ReportsPage() {
  const [selectedFacility, setSelectedFacility] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <Link 
            href="/"
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← ダッシュボードに戻る
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">分析レポート</h1>
          <p className="mt-2 text-gray-600">
            各種分析レポートを生成・閲覧できます。施設を選択してレポートを生成してください。
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
  );
}