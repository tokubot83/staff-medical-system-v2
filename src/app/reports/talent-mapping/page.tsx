'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import FacilitySelector from '@/components/reports/FacilitySelector';
import CommonHeader from '@/components/CommonHeader';
import CategoryReportCard from '@/components/reports/CategoryReportCard';

export default function TalentMappingCategoryPage() {
  const router = useRouter();
  const [selectedFacility, setSelectedFacility] = useState('');

  const reports = [
    {
      id: 'talent-grid',
      title: '9繝懊ャ繧ｯ繧ｹ繧ｰ繝ｪ繝・ラ蛻・梵',
      description: '繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ縺ｨ繝昴ユ繝ｳ繧ｷ繝｣繝ｫ縺ｮ2霆ｸ縺ｧ莠ｺ譚舌ｒ蜿ｯ隕門喧縺励√せ繧ｿ繝ｼ莠ｺ譚舌・鬮倥・繝・Φ繧ｷ繝｣繝ｫ莠ｺ譚舌ｒ迚ｹ螳・,
      icon: '虫',
      gradient: 'from-purple-500 to-pink-500',
      path: '/reports/talent-mapping/talent-grid',
      features: [
        '9縺､縺ｮ繧ｫ繝・ざ繝ｪ繝ｼ縺ｧ莠ｺ譚舌ｒ蛻・｡・,
        '繧ｹ繧ｿ繝ｼ莠ｺ譚舌・迚ｹ螳壹→閧ｲ謌先署譯・,
        '驛ｨ鄂ｲ蛻･縺ｮ莠ｺ譚仙・蟶・憾豕・
      ]
    },
    {
      id: 'skill-matrix',
      title: '繧ｹ繧ｭ繝ｫ繝槭ヨ繝ｪ繝・け繧ｹ',
      description: '閨ｷ蜩｡縺ｮ繧ｹ繧ｭ繝ｫ繝ｻ雉・ｼ繝ｻ邨碁ｨ薙ｒ螟夊ｧ堤噪縺ｫ隧穂ｾ｡縺励∫ｵ・ｹ斐・蠑ｷ縺ｿ縺ｨ謾ｹ蝟・せ繧貞庄隕門喧',
      icon: '識',
      gradient: 'from-blue-500 to-cyan-500',
      path: '/reports/talent-mapping/skill-matrix',
      features: [
        '繧ｹ繧ｭ繝ｫ繧ｮ繝｣繝・・蛻・梵',
        '雉・ｼ蜿門ｾ礼憾豕√・謚頑升',
        '謨呵ご繝九・繧ｺ縺ｮ迚ｹ螳・
      ]
    },
    {
      id: 'succession-planning',
      title: '蠕檎ｶ呵・ｨ育判',
      description: '繧ｭ繝ｼ繝昴ず繧ｷ繝ｧ繝ｳ縺ｮ蠕檎ｶ呵・呵｣懊ｒ迚ｹ螳壹＠縲∬ｨ育判逧・↑莠ｺ譚占ご謌舌ｒ謾ｯ謠ｴ',
      icon: '則',
      gradient: 'from-green-500 to-emerald-500',
      path: '/reports/talent-mapping/succession-planning',
      features: [
        '繧ｭ繝ｼ繝昴ず繧ｷ繝ｧ繝ｳ縺ｮ迚ｹ螳・,
        '蠕檎ｶ呵・呵｣懊・隧穂ｾ｡',
        '閧ｲ謌占ｨ育判縺ｮ謠先｡・
      ]
    }
  ];

  const handleReportClick = (path: string) => {
    const url = selectedFacility 
      ? `${path}?facility=${encodeURIComponent(selectedFacility)}`
      : path;
    router.push(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="繧ｿ繝ｬ繝ｳ繝医・繝・ヴ繝ｳ繧ｰ" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 繧ｫ繝・ざ繝ｪ繝ｼ隱ｬ譏・*/}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">虫</span>
            <h1 className="text-2xl font-bold text-gray-900">繧ｿ繝ｬ繝ｳ繝医・繝・ヴ繝ｳ繧ｰ</h1>
          </div>
          <p className="text-gray-600">
            邨・ｹ斐・莠ｺ譚舌ｒ螟夊ｧ堤噪縺ｫ隧穂ｾ｡繝ｻ蛻・梵縺励∵姶逡･逧・↑莠ｺ譚宣・鄂ｮ縺ｨ閧ｲ謌舌ｒ謾ｯ謠ｴ縺励∪縺吶・
            繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ縺ｨ繝昴ユ繝ｳ繧ｷ繝｣繝ｫ縺ｮ隧穂ｾ｡縲√せ繧ｭ繝ｫ縺ｮ蜿ｯ隕門喧縲∝ｾ檎ｶ呵・ｨ育判縺ｪ縺ｩ縲・
            莠ｺ譚舌・迴ｾ迥ｶ縺ｨ蟆・擂諤ｧ繧堤ｷ丞粋逧・↓謚頑升縺ｧ縺阪∪縺吶・
          </p>
        </div>

        {/* 譁ｽ險ｭ驕ｸ謚・*/}
        <div className="mb-8">
          <FacilitySelector
            selectedFacility={selectedFacility}
            onFacilityChange={setSelectedFacility}
          />
        </div>

        {/* 繝ｬ繝昴・繝井ｸ隕ｧ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <CategoryReportCard
              key={report.id}
              {...report}
              onClick={() => handleReportClick(report.path)}
            />
          ))}
        </div>

        {/* 繧｢繧ｻ繧ｹ繝｡繝ｳ繝医ヱ繧ｿ繝ｼ繝ｳ */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-6">
            謌ｦ逡･逧・ｺｺ譚宣・鄂ｮ繧｢繧ｻ繧ｹ繝｡繝ｳ繝・
          </h3>
          
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="text-blue-800 mb-3">
              <span className="font-medium">謗ｨ螂ｨ繝輔Ο繝ｼ・・/span>
              9繝懊ャ繧ｯ繧ｹ繧ｰ繝ｪ繝・ラ 竊・繧ｹ繧ｭ繝ｫ繝槭ヨ繝ｪ繝・け繧ｹ 竊・蠕檎ｶ呵・ｨ育判
            </div>
            <ul className="list-disc list-inside text-blue-700 space-y-1">
              <li>鬮倥・繝・Φ繧ｷ繝｣繝ｫ莠ｺ譚舌・迚ｹ螳壹→謌ｦ逡･逧・・鄂ｮ</li>
              <li>邨・ｹ泌・菴薙・繧ｹ繧ｭ繝ｫ迴ｾ迥ｶ謚頑升縺ｨ繧ｮ繝｣繝・・蛻・梵</li>
              <li>繧ｭ繝ｼ繝昴ず繧ｷ繝ｧ繝ｳ縺ｮ蠕檎ｶ呵・ご謌占ｨ育判</li>
              <li>莠ｺ譚舌・繝ｼ繝医ヵ繧ｩ繝ｪ繧ｪ縺ｮ譛驕ｩ蛹・/li>
            </ul>
          </div>

          <div className="mt-4 text-blue-800 text-sm">
            <p className="font-medium">
              繧ｿ繝ｬ繝ｳ繝医・繝・ヴ繝ｳ繧ｰ縺ｫ繧医ｊ縲∫ｵ・ｹ斐・莠ｺ譚占ｳ・肇繧貞庄隕門喧縺励∵姶逡･逧・↑莠ｺ譚先ｴｻ逕ｨ縺ｨ閧ｲ謌舌ｒ螳溽樟縺ｧ縺阪∪縺吶・
            </p>
          </div>
        </div>
      </div></div>
  );
}