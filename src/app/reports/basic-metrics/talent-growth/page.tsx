'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import FacilitySelector from '@/components/reports/FacilitySelector';
function TalentGrowthPageContent() {
  const searchParams = useSearchParams();
  const selectedFacility = searchParams.get('facility') || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="莠ｺ譚舌・謌宣聞" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">嶋</span>
            <h1 className="text-2xl font-bold text-gray-900">莠ｺ譚舌・謌宣聞</h1>
          </div>
          <p className="text-gray-600">
            遐比ｿｮ蜿苓ｬ帷紫縲√せ繧ｭ繝ｫ蜷台ｸ雁ｺｦ縲√く繝｣繝ｪ繧｢髢狗匱迥ｶ豕√ｒ遒ｺ隱阪＠縺ｾ縺吶・
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
            <h3 className="text-lg font-semibold mb-2">蟷ｴ髢鍋比ｿｮ蜿苓ｬ帷紫</h3>
            <p className="text-3xl font-bold text-blue-600">87.3%</p>
            <p className="text-sm text-gray-600 mt-2">逶ｮ讓・ 85%莉･荳・/p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">蟷ｳ蝮・比ｿｮ譎る俣</h3>
            <p className="text-3xl font-bold text-green-600">42.5譎る俣</p>
            <p className="text-sm text-gray-600 mt-2">蜑榊ｹｴ蜷梧悄豈・ +5.3譎る俣</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">繧ｹ繧ｭ繝ｫ蜷台ｸ顔紫</h3>
            <p className="text-3xl font-bold text-purple-600">78.2%</p>
            <p className="text-sm text-gray-600 mt-2">隧穂ｾ｡蜷台ｸ願・・蜑ｲ蜷・/p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">雉・ｼ蜿門ｾ苓・焚</h3>
            <p className="text-3xl font-bold text-orange-600">156莠ｺ</p>
            <p className="text-sm text-gray-600 mt-2">蟷ｴ髢鍋岼讓・ 150莠ｺ</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">譏・ｲ繝ｻ譏・ｼ邇・/h3>
            <p className="text-3xl font-bold text-indigo-600">12.4%</p>
            <p className="text-sm text-gray-600 mt-2">蜑榊ｹｴ蜷梧悄豈・ +1.8pt</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">繧ｭ繝｣繝ｪ繧｢髱｢隲・ｮ滓命邇・/h3>
            <p className="text-3xl font-bold text-teal-600">95.6%</p>
            <p className="text-sm text-gray-600 mt-2">蟷ｴ2蝗樔ｻ･荳雁ｮ滓命</p>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">遐比ｿｮ繧ｫ繝・ざ繝ｪ蛻･蜿苓ｬ帷憾豕・/h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>蠢・育比ｿｮ</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '98%' }}></div>
                </div>
                <span className="font-semibold">98%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>蟆る摩繧ｹ繧ｭ繝ｫ遐比ｿｮ</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '82%' }}></div>
                </div>
                <span className="font-semibold">82%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>繝ｪ繝ｼ繝繝ｼ繧ｷ繝・・遐比ｿｮ</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <span className="font-semibold">65%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>螟夜Κ遐比ｿｮ繝ｻ蟄ｦ莨・/span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{ width: '43%' }}></div>
                </div>
                <span className="font-semibold">43%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">繧ｭ繝｣繝ｪ繧｢繝代せ騾ｲ謐・/h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>蛻晉ｴ・竊・荳ｭ邏・/span>
              <span className="font-semibold text-green-600">驕疲・邇・ 85%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>荳ｭ邏・竊・荳顔ｴ・/span>
              <span className="font-semibold text-blue-600">驕疲・邇・ 72%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>荳顔ｴ・竊・邂｡逅・・</span>
              <span className="font-semibold text-purple-600">驕疲・邇・ 68%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>繧ｹ繝壹す繝｣繝ｪ繧ｹ繝医さ繝ｼ繧ｹ</span>
              <span className="font-semibold text-orange-600">驕ｸ謚樒紫: 23%</span>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">謌宣聞謾ｯ謠ｴ繝励Ο繧ｰ繝ｩ繝</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold">繝｡繝ｳ繧ｿ繝ｼ蛻ｶ蠎ｦ</h4>
              <p className="text-sm text-gray-600">蜿ょ刈閠・ 234莠ｺ (貅雜ｳ蠎ｦ: 4.3/5.0)</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold">OJT繝励Ο繧ｰ繝ｩ繝</h4>
              <p className="text-sm text-gray-600">螳滓命邇・ 92% (蜉ｹ譫懈ｸｬ螳・ 濶ｯ螂ｽ)</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold">閾ｪ蟾ｱ蝠鍋匱謾ｯ謠ｴ</h4>
              <p className="text-sm text-gray-600">蛻ｩ逕ｨ閠・ 189莠ｺ (陬懷勧驥第ｴｻ逕ｨ邇・ 76%)</p>
            </div>
            <div className="border-l-4 border-orange-500 pl-4">
              <h4 className="font-semibold">繧ｭ繝｣繝ｪ繧｢繧ｳ繝ｳ繧ｵ繝ｫ繝・ぅ繝ｳ繧ｰ</h4>
              <p className="text-sm text-gray-600">逶ｸ隲・ｻｶ謨ｰ: 312莉ｶ (隗｣豎ｺ邇・ 89%)</p>
            </div>
          </div>
        </div>
      </div></div>
  );
}

export default function TalentGrowthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TalentGrowthPageContent />
    </Suspense>
  );
}