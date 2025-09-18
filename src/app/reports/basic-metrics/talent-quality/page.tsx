'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import FacilitySelector from '@/components/reports/FacilitySelector';
function TalentQualityPageContent() {
  const searchParams = useSearchParams();
  const selectedFacility = searchParams.get('facility') || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="莠ｺ譚舌・雉ｪ" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">箝・/span>
            <h1 className="text-2xl font-bold text-gray-900">莠ｺ譚舌・雉ｪ</h1>
          </div>
          <p className="text-gray-600">
            閨ｷ蜩｡貅雜ｳ蠎ｦ縲√せ繧ｭ繝ｫ隧穂ｾ｡縲∬ｳ・ｼ菫晄怏迥ｶ豕√ｒ蛻・梵縺励∪縺吶・
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
            <h3 className="text-lg font-semibold mb-2">閨ｷ蜩｡貅雜ｳ蠎ｦ</h3>
            <p className="text-3xl font-bold text-green-600">4.2/5.0</p>
            <p className="text-sm text-gray-600 mt-2">蜑榊屓隱ｿ譟ｻ豈・ +0.3pt</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">蟷ｳ蝮・せ繧ｭ繝ｫ隧穂ｾ｡</h3>
            <p className="text-3xl font-bold text-blue-600">3.8/5.0</p>
            <p className="text-sm text-gray-600 mt-2">蜑榊ｹｴ蜷梧悄豈・ +0.2pt</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">蟆る摩雉・ｼ菫晄怏邇・/h3>
            <p className="text-3xl font-bold text-purple-600">82.5%</p>
            <p className="text-sm text-gray-600 mt-2">蜑榊ｹｴ蜷梧悄豈・ +3.2pt</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">遐比ｿｮ蜿ょ刈邇・/h3>
            <p className="text-3xl font-bold text-indigo-600">91.3%</p>
            <p className="text-sm text-gray-600 mt-2">逶ｮ讓咎＃謌千紫: 101.4%</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">謗ｨ螂ｨ諢丞髄蠎ｦ(eNPS)</h3>
            <p className="text-3xl font-bold text-orange-600">+15</p>
            <p className="text-sm text-gray-600 mt-2">讌ｭ逡悟ｹｳ蝮・ +10</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">繝ｪ繝ｼ繝繝ｼ蛟呵｣懃紫</h3>
            <p className="text-3xl font-bold text-teal-600">23.4%</p>
            <p className="text-sm text-gray-600 mt-2">谺｡荳紋ｻ｣繝ｪ繝ｼ繝繝ｼ閧ｲ謌蝉ｸｭ</p>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">雉・ｼ菫晄怏迥ｶ豕・/h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>逵玖ｭｷ蟶ｫ雉・ｼ</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                </div>
                <span className="font-semibold">95%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>蟆る摩逵玖ｭｷ蟶ｫ</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
                <span className="font-semibold">35%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>隱榊ｮ夂恚隴ｷ蟶ｫ</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '42%' }}></div>
                </div>
                <span className="font-semibold">42%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>邂｡逅・・遐比ｿｮ菫ｮ莠・/span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{ width: '68%' }}></div>
                </div>
                <span className="font-semibold">68%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">貅雜ｳ蠎ｦ縺ｮ蜀・ｨｳ</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>閨ｷ蝣ｴ迺ｰ蠅・/span>
              <span className="font-semibold text-green-600">4.3/5.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span>邨ｦ荳弱・遖丞茜蜴夂函</span>
              <span className="font-semibold text-yellow-600">3.8/5.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span>繧ｭ繝｣繝ｪ繧｢髢狗匱</span>
              <span className="font-semibold text-green-600">4.1/5.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span>荳雁昇縺ｨ縺ｮ髢｢菫・/span>
              <span className="font-semibold text-green-600">4.4/5.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span>莉穂ｺ九・繧・ｊ縺後＞</span>
              <span className="font-semibold text-green-600">4.5/5.0</span>
            </div>
          </div>
        </div>
      </div></div>
  );
}

export default function TalentQualityPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TalentQualityPageContent />
    </Suspense>
  );
}