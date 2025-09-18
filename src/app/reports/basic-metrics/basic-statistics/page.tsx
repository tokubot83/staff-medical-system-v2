'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import FacilitySelector from '@/components/reports/FacilitySelector';
function BasicStatisticsPageContent() {
  const searchParams = useSearchParams();
  const selectedFacility = searchParams.get('facility') || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="蝓ｺ譛ｬ邨ｱ險・ />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">投</span>
            <h1 className="text-2xl font-bold text-gray-900">蝓ｺ譛ｬ邨ｱ險・/h1>
          </div>
          <p className="text-gray-600">
            邱剰・蜩｡謨ｰ縲・Κ髢蛻･莠ｺ蜩｡讒区・縺ｪ縺ｩ蝓ｺ譛ｬ逧・↑邨ｱ險医ョ繝ｼ繧ｿ繧堤｢ｺ隱阪＠縺ｾ縺吶・
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
            <h3 className="text-lg font-semibold mb-2">邱剰・蜩｡謨ｰ</h3>
            <p className="text-3xl font-bold text-blue-600">1,234莠ｺ</p>
            <p className="text-sm text-gray-600 mt-2">蜑榊ｹｴ蜷梧悄豈・ +5.2%</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">蟷ｳ蝮・ｹｴ鮨｢</h3>
            <p className="text-3xl font-bold text-green-600">38.5豁ｳ</p>
            <p className="text-sm text-gray-600 mt-2">蜑榊ｹｴ蜷梧悄豈・ +0.3豁ｳ</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">蟷ｳ蝮・共邯壼ｹｴ謨ｰ</h3>
            <p className="text-3xl font-bold text-purple-600">7.8蟷ｴ</p>
            <p className="text-sm text-gray-600 mt-2">蜑榊ｹｴ蜷梧悄豈・ +0.5蟷ｴ</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">逕ｷ螂ｳ豈皮紫</h3>
            <p className="text-xl font-bold">逕ｷ諤ｧ: 35% / 螂ｳ諤ｧ: 65%</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-4">
              <div className="bg-blue-600 h-4 rounded-full" style={{ width: '35%' }}></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">豁｣隕剰・蜩｡豈皮紫</h3>
            <p className="text-3xl font-bold text-indigo-600">78.5%</p>
            <p className="text-sm text-gray-600 mt-2">髱樊ｭ｣隕・ 21.5%</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">髮｢閨ｷ邇・/h3>
            <p className="text-3xl font-bold text-red-600">12.3%</p>
            <p className="text-sm text-gray-600 mt-2">蜑榊ｹｴ蜷梧悄豈・ -1.2pt</p>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">驛ｨ髢蛻･莠ｺ蜩｡讒区・</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>逵玖ｭｷ驛ｨ</span>
              <span className="font-semibold">456莠ｺ (37.0%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span>蛹ｻ逋よ橿陦馴Κ</span>
              <span className="font-semibold">234莠ｺ (19.0%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span>莠句漁驛ｨ</span>
              <span className="font-semibold">185莠ｺ (15.0%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span>險ｺ逋るΚ</span>
              <span className="font-semibold">148莠ｺ (12.0%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span>縺昴・莉・/span>
              <span className="font-semibold">211莠ｺ (17.0%)</span>
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