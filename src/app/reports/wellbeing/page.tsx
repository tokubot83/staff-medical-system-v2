'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import FacilitySelector from '@/components/reports/FacilitySelector';
import CommonHeader from '@/components/CommonHeader';
import CategoryReportCard from '@/components/reports/CategoryReportCard';

export default function WellbeingCategoryPage() {
  const router = useRouter();
  const [selectedFacility, setSelectedFacility] = useState('');

  const reports = [
    {
      id: 'wellbeing-index',
      title: '繧ｦ繧ｧ繝ｫ繝薙・繧､繝ｳ繧ｰ邱丞粋謖・ｨ・,
      description: '霄ｫ菴鍋噪繝ｻ邊ｾ逾樒噪繝ｻ遉ｾ莨夂噪蛛･蠎ｷ繧堤ｷ丞粋逧・↓隧穂ｾ｡縺励∫ｵ・ｹ斐・蛛･蠎ｷ蠎ｦ繧貞庄隕門喧',
      icon: '丁',
      gradient: 'from-green-500 to-teal-500',
      path: '/reports/wellbeing/wellbeing-index',
      features: [
        '6縺､縺ｮ隕ｳ轤ｹ縺九ｉ縺ｮ邱丞粋隧穂ｾ｡',
        '驛ｨ鄂ｲ蛻･繝ｻ閨ｷ遞ｮ蛻･縺ｮ豈碑ｼ・,
        '邨悟ｹｴ螟牙喧縺ｮ霑ｽ霍｡'
      ]
    },
    {
      id: 'stress-analysis',
      title: '繧ｹ繝医Ξ繧ｹ隕∝屏蛻・梵',
      description: '閨ｷ蝣ｴ縺ｮ繧ｹ繝医Ξ繧ｹ隕∝屏繧堤音螳壹＠縲√Γ繝ｳ繧ｿ繝ｫ繝倥Ν繧ｹ蟇ｾ遲悶ｒ謾ｯ謠ｴ',
      icon: 'ｧ',
      gradient: 'from-purple-500 to-indigo-500',
      path: '/reports/wellbeing/stress-analysis',
      features: [
        '繧ｹ繝医Ξ繧ｹ隕∝屏縺ｮ迚ｹ螳・,
        '鬮倥Μ繧ｹ繧ｯ閠・・譌ｩ譛溽匱隕・,
        '驛ｨ鄂ｲ蛻･縺ｮ繝ｪ繧ｹ繧ｯ隧穂ｾ｡'
      ]
    },
    {
      id: 'work-life-balance',
      title: '繝ｯ繝ｼ繧ｯ繝ｩ繧､繝輔ヰ繝ｩ繝ｳ繧ｹ隧穂ｾ｡',
      description: '蜉ｴ蜒肴凾髢薙∵怏邨ｦ蜿門ｾ礼紫縲√・繝ｩ繧､繝吶・繝亥・螳溷ｺｦ縺九ｉ蜒阪″譁ｹ繧貞・譫・,
      icon: '笞厄ｸ・,
      gradient: 'from-blue-500 to-cyan-500',
      path: '/reports/wellbeing/work-life-balance',
      features: [
        '蜉ｴ蜒肴凾髢薙・驕ｩ豁｣諤ｧ隧穂ｾ｡',
        '譛臥ｵｦ蜿門ｾ礼憾豕√・蛻・梵',
        '繝ｩ繧､繝輔う繝吶Φ繝医∈縺ｮ蟇ｾ蠢・
      ]
    },
    {
      id: 'engagement-survey',
      title: '繧ｨ繝ｳ繧ｲ繝ｼ繧ｸ繝｡繝ｳ繝郁ｪｿ譟ｻ',
      description: '閨ｷ蜩｡縺ｮ莉穂ｺ九∈縺ｮ辭ｱ諢上・邨・ｹ斐∈縺ｮ繧ｳ繝溘ャ繝医Γ繝ｳ繝医ｒ貂ｬ螳・,
      icon: '笶､・・,
      gradient: 'from-red-500 to-pink-500',
      path: '/reports/wellbeing/engagement-survey',
      features: [
        '繧ｨ繝ｳ繧ｲ繝ｼ繧ｸ繝｡繝ｳ繝医せ繧ｳ繧｢',
        '謗ｨ螂ｨ蠎ｦ・・NPS・峨・貂ｬ螳・,
        '謾ｹ蝟・い繧ｯ繧ｷ繝ｧ繝ｳ縺ｮ謠先｡・
      ]
    },
    {
      id: 'intervention-program',
      title: '莉句・繝励Ο繧ｰ繝ｩ繝蜉ｹ譫懈ｸｬ螳・,
      description: '繧ｦ繧ｧ繝ｫ繝薙・繧､繝ｳ繧ｰ蜷台ｸ頑命遲悶・蜉ｹ譫懊ｒ螳夐㍼逧・↓隧穂ｾ｡',
      icon: '嶋',
      gradient: 'from-orange-500 to-amber-500',
      path: '/reports/wellbeing/intervention-program',
      features: [
        '譁ｽ遲門燕蠕後・豈碑ｼ・,
        'ROI縺ｮ邂怜・',
        '谺｡譛滓命遲悶・謠先｡・
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
      <CommonHeader title="繧ｦ繧ｧ繝ｫ繝薙・繧､繝ｳ繧ｰ蛻・梵" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 繧ｫ繝・ざ繝ｪ繝ｼ隱ｬ譏・*/}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">丁</span>
            <h1 className="text-2xl font-bold text-gray-900">繧ｦ繧ｧ繝ｫ繝薙・繧､繝ｳ繧ｰ蛻・梵</h1>
          </div>
          <p className="text-gray-600">
            閨ｷ蜩｡縺ｮ蠢・ｺｫ縺ｮ蛛･蠎ｷ縺ｨ蟷ｸ遖丞ｺｦ繧貞､夊ｧ堤噪縺ｫ蛻・梵縺励∝ロ縺阪ｄ縺吶＞閨ｷ蝣ｴ迺ｰ蠅・・螳溽樟繧呈髪謠ｴ縺励∪縺吶・
            繧ｹ繝医Ξ繧ｹ隕∝屏縺ｮ迚ｹ螳壹√Ρ繝ｼ繧ｯ繝ｩ繧､繝輔ヰ繝ｩ繝ｳ繧ｹ縺ｮ隧穂ｾ｡縲√お繝ｳ繧ｲ繝ｼ繧ｸ繝｡繝ｳ繝医・貂ｬ螳壹↑縺ｩ繧帝壹§縺ｦ縲・
            閨ｷ蜩｡縺檎函縺咲函縺阪→蜒阪￠繧狗ｵ・ｹ斐▼縺上ｊ縺ｮ縺溘ａ縺ｮ蜈ｷ菴鍋噪縺ｪ譁ｽ遲悶ｒ謠先｡医＠縺ｾ縺吶・
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
            邱丞粋逧・え繧ｧ繝ｫ繝薙・繧､繝ｳ繧ｰ隧穂ｾ｡繧｢繧ｻ繧ｹ繝｡繝ｳ繝・
          </h3>
          
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="text-blue-800 mb-3">
              <span className="font-medium">謗ｨ螂ｨ繝輔Ο繝ｼ・・/span>
              繧ｦ繧ｧ繝ｫ繝薙・繧､繝ｳ繧ｰ邱丞粋謖・ｨ・竊・繧ｹ繝医Ξ繧ｹ隕∝屏蛻・梵 竊・繧ｨ繝ｳ繧ｲ繝ｼ繧ｸ繝｡繝ｳ繝郁ｪｿ譟ｻ 竊・莉句・繝励Ο繧ｰ繝ｩ繝蜉ｹ譫懈ｸｬ螳・
            </div>
            <ul className="list-disc list-inside text-blue-700 space-y-1">
              <li>螟夐擇逧・↑蛛･蠎ｷ繝ｻ蟷ｸ遖丞ｺｦ縺ｮ迴ｾ迥ｶ謚頑升</li>
              <li>繧ｹ繝医Ξ繧ｹ隕∝屏縺ｮ迚ｹ螳壹→譌ｩ譛滉ｻ句・</li>
              <li>邨・ｹ斐∈縺ｮ繧ｳ繝溘ャ繝医Γ繝ｳ繝域ｸｬ螳・/li>
              <li>繧ｦ繧ｧ繝ｫ繝薙・繧､繝ｳ繧ｰ蜷台ｸ頑命遲悶・蜉ｹ譫懈､懆ｨｼ</li>
            </ul>
          </div>

          <div className="mt-4 text-blue-800 text-sm">
            <p className="font-medium">
              蛹・峡逧・↑繧ｦ繧ｧ繝ｫ繝薙・繧､繝ｳ繧ｰ蛻・梵縺ｫ繧医ｊ縲∬・蜩｡縺ｮ蠢・ｺｫ縺ｮ蛛･蠎ｷ縺ｨ邨・ｹ斐ヱ繝輔か繝ｼ繝槭Φ繧ｹ縺ｮ蜷台ｸ翫ｒ螳溽樟縺ｧ縺阪∪縺吶・
            </p>
          </div>
        </div>
      </div></div>
  );
}