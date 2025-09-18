'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import FacilitySelector from '@/components/reports/FacilitySelector';
import BreadcrumbBar from '@/components/navigation/BreadcrumbBar';
function BasicStatisticsPageContent() {
  const searchParams = useSearchParams();
  const selectedFacility = searchParams.get('facility') || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <BreadcrumbBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">📊</span>
            <h1 className="text-2xl font-bold text-gray-900">基本統計</h1>
          </div>
          <p className="text-gray-600">
            総職員数、部門別人員構成など基本的な統計データを確認します。
          </p>
        </div>

        <div className="mb-8">
          <FacilitySelector
            selectedFacility={selectedFacility}
            onFacilityChange={() => {}}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">総職員数</h3>
            <p className="text-3xl font-bold text-blue-600">1,234人</p>
            <p className="text-sm text-gray-600 mt-2">前年同期比: +5.2%</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">平均年齢</h3>
            <p className="text-3xl font-bold text-green-600">38.5歳</p>
            <p className="text-sm text-gray-600 mt-2">前年同期比: +0.3歳</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">平均勤続年数</h3>
            <p className="text-3xl font-bold text-purple-600">7.8年</p>
            <p className="text-sm text-gray-600 mt-2">前年同期比: +0.5年</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">男女比率</h3>
            <p className="text-xl font-bold">男性: 35% / 女性: 65%</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-4">
              <div className="bg-blue-600 h-4 rounded-full" style={{ width: '35%' }}></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">正規職員比率</h3>
            <p className="text-3xl font-bold text-indigo-600">78.5%</p>
            <p className="text-sm text-gray-600 mt-2">非正規: 21.5%</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">離職率</h3>
            <p className="text-3xl font-bold text-red-600">12.3%</p>
            <p className="text-sm text-gray-600 mt-2">前年同期比: -1.2pt</p>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">部門別人員構成</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>看護部</span>
              <span className="font-semibold">456人 (37.0%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span>医療技術部</span>
              <span className="font-semibold">234人 (19.0%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span>事務部</span>
              <span className="font-semibold">185人 (15.0%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span>診療部</span>
              <span className="font-semibold">148人 (12.0%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span>その他</span>
              <span className="font-semibold">211人 (17.0%)</span>
            </div>
          </div>
        </div>
      </div></div>
  );
}

export default function BasicStatisticsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BasicStatisticsPageContent />
    </Suspense>
  );
}