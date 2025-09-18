'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import { exportToPDF } from '@/utils/pdfExport';

function HazardCoxRegressionContent() {
  const searchParams = useSearchParams();
  const facility = searchParams.get('facility') || '蜈ｨ譁ｽ險ｭ';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="騾閨ｷ繝ｪ繧ｹ繧ｯ隕∝屏蛻・梵" />
      
      <div id="report-content" className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Cox豈比ｾ九ワ繧ｶ繝ｼ繝峨Δ繝・Ν蛻・梵</h2>
            <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              蟇ｾ雎｡譁ｽ險ｭ: {facility}
            </span>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600">
              隍・焚縺ｮ隕∝屏縺碁閨ｷ繝ｪ繧ｹ繧ｯ縺ｫ荳弱∴繧句ｽｱ髻ｿ繧堤ｵｱ險育噪縺ｫ蛻・梵縺励∝推隕∝屏縺ｮ繝上じ繝ｼ繝画ｯ斐ｒ邂怜・縺励∪縺吶・            </p>
          </div>

          {/* 繝上じ繝ｼ繝画ｯ斐Λ繝ｳ繧ｭ繝ｳ繧ｰ */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">騾閨ｷ繝ｪ繧ｹ繧ｯ隕∝屏繝ｩ繝ｳ繧ｭ繝ｳ繧ｰ</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-red-600">1</span>
                  <div>
                    <h4 className="font-medium text-gray-800">雜・℃蜍､蜍呎凾髢難ｼ域怦60譎る俣莉･荳奇ｼ・/h4>
                    <p className="text-sm text-gray-600">驕主ｺｦ縺ｪ谿区･ｭ縺ｫ繧医ｋ霄ｫ菴鍋噪繝ｻ邊ｾ逾樒噪雋諡・/p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-red-600">3.21</p>
                  <p className="text-xs text-gray-500">繝上じ繝ｼ繝画ｯ・/p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-orange-50 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-orange-600">2</span>
                  <div>
                    <h4 className="font-medium text-gray-800">荳雁昇縺ｨ縺ｮ髢｢菫よｧ・井ｽ手ｩ穂ｾ｡・・/h4>
                    <p className="text-sm text-gray-600">閨ｷ蝣ｴ縺ｮ莠ｺ髢馴未菫ゅ↓髢｢縺吶ｋ貅雜ｳ蠎ｦ</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-orange-600">2.85</p>
                  <p className="text-xs text-gray-500">繝上じ繝ｼ繝画ｯ・/p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-yellow-600">3</span>
                  <div>
                    <h4 className="font-medium text-gray-800">邨ｦ荳取ｺ雜ｳ蠎ｦ・井ｸ肴ｺ・・/h4>
                    <p className="text-sm text-gray-600">迴ｾ蝨ｨ縺ｮ邨ｦ荳取ｰｴ貅悶∈縺ｮ貅雜ｳ蠎ｦ</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-yellow-600">2.14</p>
                  <p className="text-xs text-gray-500">繝上じ繝ｼ繝画ｯ・/p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-600">4</span>
                  <div>
                    <h4 className="font-medium text-gray-800">繧ｭ繝｣繝ｪ繧｢髢狗匱讖滉ｼ夲ｼ医↑縺暦ｼ・/h4>
                    <p className="text-sm text-gray-600">遐比ｿｮ繧・せ繧ｭ繝ｫ繧｢繝・・縺ｮ讖滉ｼ・/p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-600">1.92</p>
                  <p className="text-xs text-gray-500">繝上じ繝ｼ繝画ｯ・/p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-600">5</span>
                  <div>
                    <h4 className="font-medium text-gray-800">蟷ｴ鮨｢・・5豁ｳ譛ｪ貅・・/h4>
                    <p className="text-sm text-gray-600">闍･蟷ｴ螻､縺ｮ霆｢閨ｷ蛯ｾ蜷・/p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-600">1.68</p>
                  <p className="text-xs text-gray-500">繝上じ繝ｼ繝画ｯ・/p>
                </div>
              </div>
            </div>
          </div>

          {/* 邨ｱ險育噪譛画э諤ｧ */}
          <div className="bg-gray-100 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-gray-800 mb-3">繝｢繝・Ν縺ｮ邨ｱ險育噪讀懆ｨｼ</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">繧ｵ繝ｳ繝励Ν謨ｰ</p>
                <p className="text-xl font-bold text-gray-900">1,245蜷・/p>
              </div>
              <div>
                <p className="text-sm text-gray-600">隕ｳ貂ｬ譛滄俣</p>
                <p className="text-xl font-bold text-gray-900">5蟷ｴ髢・/p>
              </div>
              <div>
                <p className="text-sm text-gray-600">繝｢繝・Ν驕ｩ蜷亥ｺｦ</p>
                <p className="text-xl font-bold text-gray-900">Rﾂｲ = 0.82</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">p蛟､</p>
                <p className="text-xl font-bold text-gray-900">&lt; 0.001</p>
              </div>
            </div>
          </div>

          {/* 謗ｨ螂ｨ繧｢繧ｯ繧ｷ繝ｧ繝ｳ */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">謗ｨ螂ｨ繧｢繧ｯ繧ｷ繝ｧ繝ｳ</h4>
            <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
              <li>谿区･ｭ譎る俣邂｡逅・す繧ｹ繝・Β縺ｮ蠑ｷ蛹悶→譛・0譎る俣荳企剞縺ｮ蠕ｹ蠎・/li>
              <li>邂｡逅・・蜷代￠縺ｮ繝槭ロ繧ｸ繝｡繝ｳ繝育比ｿｮ縺ｨ繝｡繝ｳ繧ｿ繝ｪ繝ｳ繧ｰ繝励Ο繧ｰ繝ｩ繝縺ｮ蟆主・</li>
              <li>邨ｦ荳惹ｽ鍋ｳｻ縺ｮ隕狗峩縺励→謌先棡騾｣蜍募梛繧､繝ｳ繧ｻ繝ｳ繝・ぅ繝悶・讀懆ｨ・/li>
              <li>繧ｭ繝｣繝ｪ繧｢繝代せ蛻ｶ蠎ｦ縺ｮ譏守｢ｺ蛹悶→蛟倶ｺｺ蛻･閧ｲ謌占ｨ育判縺ｮ遲門ｮ・/li>
            </ul>
          </div>

          {/* 繧｢繧ｯ繧ｷ繝ｧ繝ｳ繝懊ち繝ｳ */}
          <div className="flex gap-4 mt-8">
            <button 
              onClick={() => exportToPDF({
                title: '繝上じ繝ｼ繝牙・譫撰ｼ・ox蝗槫ｸｰ・峨Ξ繝昴・繝・,
                facility: facility,
                reportType: 'hazard-cox-regression',
                elementId: 'report-content',
                dateRange: new Date().toLocaleDateString('ja-JP')
              })}
              className="pdf-exclude bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              PDF繝繧ｦ繝ｳ繝ｭ繝ｼ繝・            </button>
            <button className="pdf-exclude bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition">
              繝・・繧ｿ繧ｨ繧ｯ繧ｹ繝昴・繝・            </button>
          </div>
        </div>
      </div><CategoryTopButton categoryPath="/reports?tab=retention" categoryName="螳夂捩蛻・梵" /></div>
  );
}

export default function HazardCoxRegressionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">隱ｭ縺ｿ霎ｼ縺ｿ荳ｭ...</div></div>}>
      <HazardCoxRegressionContent />
    </Suspense>
  );
}