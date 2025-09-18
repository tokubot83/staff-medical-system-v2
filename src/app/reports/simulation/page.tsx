'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import FacilitySelector from '@/components/reports/FacilitySelector';
import CommonHeader from '@/components/CommonHeader';
import CategoryReportCard from '@/components/reports/CategoryReportCard';

export default function SimulationCategoryPage() {
  const router = useRouter();
  const [selectedFacility, setSelectedFacility] = useState('');

  const reports = [
    {
      id: 'recruitment-planning',
      title: '謗｡逕ｨ險育判繧ｷ繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ',
      description: '蟆・擂縺ｮ莠ｺ蜩｡髴隕√ｒ莠域ｸｬ縺励∵怙驕ｩ縺ｪ謗｡逕ｨ險育判繧堤ｫ区｡・,
      icon: '則',
      gradient: 'from-blue-500 to-cyan-500',
      path: '/reports/simulation/recruitment-planning',
      features: [
        '騾閨ｷ莠域ｸｬ縺ｫ蝓ｺ縺･縺丞ｿ・ｦ∽ｺｺ蜩｡邂怜・',
        '謗｡逕ｨ繧ｳ繧ｹ繝医・譛驕ｩ蛹・,
        '閨ｷ遞ｮ蛻･繝ｻ驛ｨ鄂ｲ蛻･縺ｮ謗｡逕ｨ險育判'
      ]
    },
    {
      id: 'retention-impact',
      title: '繝ｪ繝・Φ繧ｷ繝ｧ繝ｳ譁ｽ遲門柑譫應ｺ域ｸｬ',
      description: '蜷・ｨｮ譁ｽ遲悶′閨ｷ蜩｡螳夂捩邇・↓荳弱∴繧句ｽｱ髻ｿ繧偵す繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ',
      icon: '識',
      gradient: 'from-green-500 to-emerald-500',
      path: '/reports/simulation/retention-impact',
      features: [
        '譁ｽ遲門挨縺ｮ蜉ｹ譫應ｺ域ｸｬ',
        '繧ｳ繧ｹ繝亥ｯｾ蜉ｹ譫懊・蛻・梵',
        '蜆ｪ蜈磯・ｽ阪・謠先｡・
      ]
    },
    {
      id: 'cost-optimization',
      title: '莠ｺ莉ｶ雋ｻ譛驕ｩ蛹門・譫・,
      description: '莠ｺ莉ｶ雋ｻ縺ｨ逕溽肇諤ｧ縺ｮ繝舌Λ繝ｳ繧ｹ繧定・・縺励◆譛驕ｩ縺ｪ莠ｺ蜩｡驟咲ｽｮ繧呈署譯・,
      icon: '腸',
      gradient: 'from-purple-500 to-pink-500',
      path: '/reports/simulation/cost-optimization',
      features: [
        '莠ｺ莉ｶ雋ｻ謗ｨ遘ｻ縺ｮ莠域ｸｬ',
        '逕溽肇諤ｧ謖・ｨ吶→縺ｮ逶ｸ髢｢蛻・梵',
        '譛驕ｩ驟咲ｽｮ縺ｮ謠先｡・
      ]
    },
    {
      id: 'organization-redesign',
      title: '邨・ｹ疲隼邱ｨ繧ｷ繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ',
      description: '邨・ｹ疲ｧ矩螟画峩縺梧･ｭ蜍吝柑邇・ｄ閨ｷ蜩｡貅雜ｳ蠎ｦ縺ｫ荳弱∴繧句ｽｱ髻ｿ繧剃ｺ域ｸｬ',
      icon: '召',
      gradient: 'from-orange-500 to-red-500',
      path: '/reports/simulation/organization-redesign',
      features: [
        '邨・ｹ疲ｧ矩縺ｮ譛驕ｩ蛹匁署譯・,
        '讌ｭ蜍吶ヵ繝ｭ繝ｼ縺ｸ縺ｮ蠖ｱ髻ｿ隧穂ｾ｡',
        '遘ｻ陦瑚ｨ育判縺ｮ遲門ｮ壽髪謠ｴ'
      ]
    },
    {
      id: 'scenario-planning',
      title: '繧ｷ繝翫Μ繧ｪ繝励Λ繝ｳ繝九Φ繧ｰ',
      description: '隍・焚縺ｮ蟆・擂繧ｷ繝翫Μ繧ｪ縺ｫ蝓ｺ縺･縺丈ｺｺ譚先姶逡･縺ｮ讀懆ｨ・,
      icon: '醗',
      gradient: 'from-indigo-500 to-purple-500',
      path: '/reports/simulation/scenario-planning',
      features: [
        '讌ｽ隕ｳ繝ｻ迴ｾ螳溘・謔ｲ隕ｳ繧ｷ繝翫Μ繧ｪ',
        '繝ｪ繧ｹ繧ｯ隕∝屏縺ｮ迚ｹ螳・,
        '蟇ｾ蠢懃ｭ悶・莠句燕讀懆ｨ・
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
      <CommonHeader title="What-if繧ｷ繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 繧ｫ繝・ざ繝ｪ繝ｼ隱ｬ譏・*/}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">醗</span>
            <h1 className="text-2xl font-bold text-gray-900">What-if繧ｷ繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ</h1>
          </div>
          <p className="text-gray-600">
            讒倥・↑譚｡莉ｶ繧・命遲悶ｒ莉ｮ螳壹＠縲√◎縺ｮ蠖ｱ髻ｿ繧剃ｺ句燕縺ｫ繧ｷ繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ縺吶ｋ縺薙→縺ｧ縲・
            繝・・繧ｿ縺ｫ蝓ｺ縺･縺・◆諢乗晄ｱｺ螳壹ｒ謾ｯ謠ｴ縺励∪縺吶よ治逕ｨ險育判縲∽ｺｺ莉ｶ雋ｻ譛驕ｩ蛹悶・
            邨・ｹ疲隼邱ｨ縺ｪ縺ｩ縲・㍾隕√↑莠ｺ莠区姶逡･縺ｮ遶区｡医↓縺翫＞縺ｦ縲√Μ繧ｹ繧ｯ繧呈怙蟆丞喧縺励・
            蜉ｹ譫懊ｒ譛螟ｧ蛹悶☆繧区怙驕ｩ隗｣繧定ｦ九▽縺代ｋ縺薙→縺後〒縺阪∪縺吶・
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
            謌ｦ逡･逧・э諤晄ｱｺ螳壽髪謠ｴ繧｢繧ｻ繧ｹ繝｡繝ｳ繝・
          </h3>
          
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="text-blue-800 mb-3">
              <span className="font-medium">謗ｨ螂ｨ繝輔Ο繝ｼ・・/span>
              謗｡逕ｨ險育判繧ｷ繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ 竊・繝ｪ繝・Φ繧ｷ繝ｧ繝ｳ譁ｽ遲門柑譫應ｺ域ｸｬ 竊・邨・ｹ疲隼邱ｨ繧ｷ繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ 竊・繧ｷ繝翫Μ繧ｪ繝励Λ繝ｳ繝九Φ繧ｰ
            </div>
            <ul className="list-disc list-inside text-blue-700 space-y-1">
              <li>蟆・擂縺ｮ莠ｺ蜩｡髴隕∽ｺ域ｸｬ縺ｨ譛驕ｩ謗｡逕ｨ險育判</li>
              <li>譁ｽ遲門柑譫懊・莠句燕隧穂ｾ｡縺ｨROI邂怜・</li>
              <li>邨・ｹ泌､画峩縺ｫ繧医ｋ蠖ｱ髻ｿ縺ｮ莠句燕蛻・梵</li>
              <li>隍・焚繧ｷ繝翫Μ繧ｪ縺ｧ縺ｮ繝ｪ繧ｹ繧ｯ隧穂ｾ｡</li>
            </ul>
          </div>

          <div className="mt-4 text-blue-800 text-sm">
            <p className="font-medium">
              What-if繧ｷ繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ縺ｫ繧医ｊ縲√ョ繝ｼ繧ｿ縺ｫ蝓ｺ縺･縺乗姶逡･逧・э諤晄ｱｺ螳壹→繝ｪ繧ｹ繧ｯ譛蟆丞喧繧貞ｮ溽樟縺ｧ縺阪∪縺吶・
            </p>
          </div>
        </div>
      </div></div>
  );
}