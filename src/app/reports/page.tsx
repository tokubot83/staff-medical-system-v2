'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FacilitySelector from '@/components/reports/FacilitySelector';
import BreadcrumbBar from '@/components/navigation/BreadcrumbBar';
const categories = [
  {
    id: 'basic',
    label: '蝓ｺ譛ｬ謖・ｨ・,
    icon: '投',
    description: '閨ｷ蜩｡謨ｰ縲∵ｧ区・豈斐∵治逕ｨ繝ｻ髮｢閨ｷ縺ｪ縺ｩ縺ｮ蝓ｺ譛ｬ逧・↑莠ｺ莠区欠讓吶ｒ遒ｺ隱・,
    gradient: 'from-blue-500 to-cyan-500',
    path: '/reports/basic-metrics',
    hasDetailPages: true
  },
  {
    id: 'strategic',
    label: '謌ｦ逡･蛻・梵',
    icon: '嶋',
    description: '莠ｺ譚先姶逡･縺ｮ遶区｡医↓蠢・ｦ√↑鬮伜ｺｦ縺ｪ蛻・梵縺ｨ繧､繝ｳ繧ｵ繧､繝医ｒ謠蝉ｾ・,
    gradient: 'from-purple-500 to-pink-500',
    path: '/reports/strategic-analysis',
    hasDetailPages: true
  },
  {
    id: 'retention',
    label: '螳夂捩蛻・梵',
    icon: '識',
    description: '閨ｷ蜩｡縺ｮ螳夂捩邇・髄荳翫↓蜷代￠縺溯ｩｳ邏ｰ縺ｪ蛻・梵縺ｨ繧｢繧ｯ繧ｷ繝ｧ繝ｳ繝励Λ繝ｳ繧呈署遉ｺ',
    gradient: 'from-green-500 to-emerald-500',
    path: '/reports/retention',
    hasDetailPages: true
  },
  {
    id: 'turnover',
    label: '髮｢閨ｷ蛻・梵',
    icon: '悼',
    description: '髮｢閨ｷ繝ｪ繧ｹ繧ｯ縺ｮ譌ｩ譛溽匱隕九→莠磯亟遲悶・遶区｡医ｒ謾ｯ謠ｴ',
    gradient: 'from-red-500 to-orange-500',
    path: '/reports/turnover',
    hasDetailPages: true
  },
  {
    id: 'talent-mapping',
    label: '繧ｿ繝ｬ繝ｳ繝医・繝・ヴ繝ｳ繧ｰ',
    icon: '虫',
    description: '莠ｺ譚舌・蜿ｯ隕門喧縺ｨ謌ｦ逡･逧・↑驟咲ｽｮ繝ｻ閧ｲ謌舌ｒ謾ｯ謠ｴ',
    gradient: 'from-yellow-500 to-amber-500',
    path: '/reports/talent-mapping',
    hasDetailPages: true
  },
  {
    id: 'flow-analysis',
    label: '莠ｺ譚舌ヵ繝ｭ繝ｼ',
    icon: '売',
    description: '邨・ｹ泌・縺ｮ莠ｺ譚舌・蜍輔″繧貞・譫舌＠縲∵怙驕ｩ縺ｪ驟咲ｽｮ繧呈署譯・,
    gradient: 'from-indigo-500 to-purple-500',
    path: '/reports/flow-analysis',
    hasDetailPages: true
  },
  {
    id: 'cohort-analysis',
    label: '繧ｳ繝帙・繝亥・譫・,
    icon: '投',
    description: '荳紋ｻ｣繝ｻ蜈･遉ｾ蟷ｴ谺｡蛻･縺ｮ蛯ｾ蜷大・譫舌→譁ｽ遲門柑譫懈ｸｬ螳・,
    gradient: 'from-teal-500 to-cyan-500',
    path: '/reports/cohort-analysis',
    hasDetailPages: true
  },
  {
    id: 'simulation',
    label: '繧ｷ繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ',
    icon: '醗',
    description: 'What-if蛻・梵縺ｫ繧医ｋ蟆・擂莠域ｸｬ縺ｨ譛驕ｩ隗｣縺ｮ謗｢邏｢',
    gradient: 'from-pink-500 to-rose-500',
    path: '/reports/simulation',
    hasDetailPages: true
  },
  {
    id: 'wellbeing',
    label: '繧ｦ繧ｧ繝ｫ繝薙・繧､繝ｳ繧ｰ',
    icon: '丁',
    description: '閨ｷ蜩｡縺ｮ蠢・ｺｫ縺ｮ蛛･蠎ｷ縺ｨ蟷ｸ遖丞ｺｦ繧貞､夊ｧ堤噪縺ｫ蛻・梵',
    gradient: 'from-green-500 to-teal-500',
    path: '/reports/wellbeing',
    hasDetailPages: true
  },
  {
    id: 'performance-evaluation',
    label: '莠ｺ莠玖ｩ穂ｾ｡蛻・梵',
    icon: '軸',
    description: '繧ｹ繧ｭ繝ｫ縺ｨ謌先棡縺ｮ2霆ｸ隧穂ｾ｡縺ｪ縺ｩ螟夊ｧ堤噪縺ｪ莠ｺ莠玖ｩ穂ｾ｡蛻・梵',
    gradient: 'from-cyan-500 to-blue-500',
    path: '/reports/performance-evaluation',
    hasDetailPages: true
  }
];

function ReportsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedFacility, setSelectedFacility] = useState('');

  // URL繝代Λ繝｡繝ｼ繧ｿ縺九ｉ譁ｽ險ｭ繧貞・譛溷喧
  useEffect(() => {
    const facilityParam = searchParams.get('facility');
    
    if (facilityParam) {
      setSelectedFacility(facilityParam);
    }
  }, [searchParams]);

  // 繧ｫ繝・ざ繝ｪ繧ｯ繝ｪ繝・け譎ゅ・蜃ｦ逅・
  const handleCategoryClick = (category: typeof categories[0]) => {
    // 繧ｫ繝・ざ繝ｪ繝壹・繧ｸ縺ｸ驕ｷ遘ｻ
    const url = selectedFacility 
      ? `${category.path}?facility=${encodeURIComponent(selectedFacility)}`
      : category.path;
    router.push(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BreadcrumbBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 繝倥ャ繝繝ｼ */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900">繝ｬ繝昴・繝医そ繝ｳ繧ｿ繝ｼ</h1>
          <p className="text-gray-600 mt-2">
            莠ｺ莠九ョ繝ｼ繧ｿ縺ｮ蛻・梵縺ｨ繝ｬ繝昴・繝育函謌舌↓繧医ｊ縲√ョ繝ｼ繧ｿ繝峨Μ繝悶Φ縺ｪ諢乗晄ｱｺ螳壹ｒ謾ｯ謠ｴ縺励∪縺・
          </p>
        </div>

        {/* 譁ｽ險ｭ驕ｸ謚・*/}
        <div className="mb-8">
          <FacilitySelector
            selectedFacility={selectedFacility}
            onFacilityChange={setSelectedFacility}
          />
        </div>

        {/* 繧ｫ繝・ざ繝ｪ荳隕ｧ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
            >
              <div className={`h-2 bg-gradient-to-r ${category.gradient}`} />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{category.icon}</span>
                  <h3 className="text-xl font-semibold">{category.label}</h3>
                </div>
                <p className="text-gray-600">{category.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 豕ｨ諢丈ｺ矩・*/}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            繝ｬ繝昴・繝域ｩ溯・縺ｫ縺､縺・※
          </h3>
          <ul className="list-disc list-inside text-blue-800 space-y-1">
            <li>譁ｽ險ｭ繧帝∈謚槭☆繧九→縲√◎縺ｮ譁ｽ險ｭ縺ｫ迚ｹ蛹悶＠縺溘Ξ繝昴・繝医′逕滓・縺輔ｌ縺ｾ縺・/li>
            <li>蜈ｨ譁ｽ險ｭ繧帝∈謚槭＠縺溷ｴ蜷医・縲∝現逋よｳ穂ｺｺ蜈ｨ菴薙・邨ｱ蜷医Ξ繝昴・繝医′逕滓・縺輔ｌ縺ｾ縺・/li>
            <li>蜷・Ξ繝昴・繝医・PDF蠖｢蠑上〒繝繧ｦ繝ｳ繝ｭ繝ｼ繝牙庄閭ｽ縺ｧ縺・/li>
            <li>繝ｬ繝昴・繝医・譛譁ｰ縺ｮ繝・・繧ｿ縺ｫ蝓ｺ縺･縺・※繝ｪ繧｢繝ｫ繧ｿ繧､繝縺ｧ逕滓・縺輔ｌ縺ｾ縺・/li>
          </ul>
        </div>
      </div></div>
  );
}

export default function ReportsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReportsPageContent />
    </Suspense>
  );
}