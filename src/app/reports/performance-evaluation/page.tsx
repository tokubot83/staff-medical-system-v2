'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import FacilitySelector from '@/components/reports/FacilitySelector';
import CommonHeader from '@/components/CommonHeader';
import CategoryReportCard from '@/components/reports/CategoryReportCard';

export default function PerformanceEvaluationCategoryPage() {
  const router = useRouter();
  const [selectedFacility, setSelectedFacility] = useState('');

  const reports = [
    {
      id: 'performance-matrix',
      title: '繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ繝槭ヨ繝ｪ繧ｯ繧ｹ',
      description: '蛟倶ｺｺ縺ｮ繧ｹ繧ｭ繝ｫ縺ｨ謌先棡繧・霆ｸ縺ｧ隧穂ｾ｡縺励・雎｡髯舌〒蛻・｡槭・蜿ｯ隕門喧',
      icon: '投',
      gradient: 'from-blue-500 to-indigo-500',
      path: '/reports/performance-evaluation/performance-matrix',
      features: [
        '繧ｹ繧ｭ繝ｫﾃ玲・譫懊・2霆ｸ隧穂ｾ｡',
        '4雎｡髯舌〒縺ｮ閨ｷ蜩｡蛻・｡・,
        '蛟倶ｺｺ蛻･謌宣聞霆瑚ｷ｡縺ｮ霑ｽ霍｡'
      ]
    },
    {
      id: 'team-analysis',
      title: '繝√・繝隧穂ｾ｡蛻・梵',
      description: '繝√・繝蜊倅ｽ阪〒縺ｮ2霆ｸ隧穂ｾ｡縺ｮ髮・ｨ医→豈碑ｼ・・譫・,
      icon: '則',
      gradient: 'from-purple-500 to-pink-500',
      path: '/reports/performance-evaluation/team-analysis',
      features: [
        '繝√・繝蛻･繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ豈碑ｼ・,
        '繝｡繝ｳ繝舌・讒区・縺ｮ譛驕ｩ蛹匁署譯・,
        '繝√・繝髢薙す繝翫ず繝ｼ蛻・梵'
      ]
    },
    {
      id: 'department-comparison',
      title: '驛ｨ髢蛻･豈碑ｼ・,
      description: '驛ｨ髢髢薙・2霆ｸ隧穂ｾ｡繧ｹ繧ｳ繧｢縺ｨ蛻・ｸ・・豈碑ｼ・・譫・,
      icon: '召',
      gradient: 'from-green-500 to-emerald-500',
      path: '/reports/performance-evaluation/department-comparison',
      features: [
        '驛ｨ髢蛻･繧ｹ繧ｳ繧｢蛻・ｸ・,
        '雎｡髯仙・蟶・・蜿ｯ隕門喧',
        '驛ｨ髢髢薙ぐ繝｣繝・・蛻・梵'
      ]
    },
    {
      id: 'organization-optimization',
      title: '邨・ｹ泌・菴捺怙驕ｩ蛹・,
      description: '2霆ｸ隧穂ｾ｡縺ｫ蝓ｺ縺･縺冗ｵ・ｹ疲隼蝟・す繝翫Μ繧ｪ縺ｮ繧ｷ繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ',
      icon: '識',
      gradient: 'from-orange-500 to-amber-500',
      path: '/reports/performance-evaluation/organization-optimization',
      features: [
        '謾ｹ蝟・す繝翫Μ繧ｪ豈碑ｼ・,
        'ROI蛻・梵',
        '譁ｽ遲門━蜈亥ｺｦ縺ｮ謠先｡・
      ]
    },
    {
      id: 'evaluation-trend',
      title: '隧穂ｾ｡謗ｨ遘ｻ蛻・梵',
      description: '蛟倶ｺｺ繝ｻ繝√・繝繝ｻ驛ｨ髢縺ｮ2霆ｸ隧穂ｾ｡縺ｮ譎らｳｻ蛻怜､牙喧繧定ｿｽ霍｡',
      icon: '嶋',
      gradient: 'from-indigo-500 to-purple-500',
      path: '/reports/performance-evaluation/evaluation-trend',
      features: [
        '隧穂ｾ｡繧ｹ繧ｳ繧｢縺ｮ謗ｨ遘ｻ',
        '雎｡髯千ｧｻ蜍輔ヱ繧ｿ繝ｼ繝ｳ',
        '謌宣聞邇・・蜿ｯ隕門喧'
      ]
    },
    {
      id: 'cluster-analysis',
      title: '繧ｯ繝ｩ繧ｹ繧ｿ繝ｼ蛻・梵',
      description: '鬘樔ｼｼ繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ迚ｹ諤ｧ繧呈戟縺､閨ｷ蜩｡繧ｰ繝ｫ繝ｼ繝励・迚ｹ螳壹→蛻・梵',
      icon: '剥',
      gradient: 'from-pink-500 to-rose-500',
      path: '/reports/performance-evaluation/cluster-analysis',
      features: [
        '繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ繧ｯ繝ｩ繧ｹ繧ｿ繝ｼ迚ｹ螳・,
        '繧ｯ繝ｩ繧ｹ繧ｿ繝ｼ蛻･迚ｹ諤ｧ蛻・梵',
        '繧ｰ繝ｫ繝ｼ繝怜挨譁ｽ遲匁署譯・
      ]
    },
    {
      id: 'skill-assessment',
      title: '繧ｹ繧ｭ繝ｫ隧穂ｾ｡蛻・梵',
      description: '閨ｷ蜩｡縺ｮ繧ｹ繧ｭ繝ｫ繝ｬ繝吶Ν繧貞､夊ｧ堤噪縺ｫ隧穂ｾ｡繝ｻ蛻・梵',
      icon: '庁',
      gradient: 'from-yellow-500 to-orange-500',
      path: '/reports/performance-evaluation/skill-assessment',
      features: [
        '繧ｹ繧ｭ繝ｫ繝槭ヨ繝ｪ繧ｯ繧ｹ菴懈・',
        '繧ｹ繧ｭ繝ｫ繧ｮ繝｣繝・・蛻・梵',
        '閧ｲ謌占ｨ育判縺ｮ謠先｡・
      ]
    },
    {
      id: 'performance-prediction',
      title: '繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ莠域ｸｬ',
      description: '驕主悉繝・・繧ｿ縺九ｉ蟆・擂縺ｮ繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ繧剃ｺ域ｸｬ',
      icon: '醗',
      gradient: 'from-teal-500 to-cyan-500',
      path: '/reports/performance-evaluation/performance-prediction',
      features: [
        '蟆・擂諤ｧ繧ｹ繧ｳ繧｢邂怜・',
        '謌宣聞繝昴ユ繝ｳ繧ｷ繝｣繝ｫ隧穂ｾ｡',
        '譌ｩ譛溯ｭｦ蜻翫す繧ｹ繝・Β'
      ]
    }
  ];

  const handleReportClick = (reportPath: string) => {
    const url = selectedFacility ? `${reportPath}?facility=${selectedFacility}` : reportPath;
    router.push(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="莠ｺ莠玖ｩ穂ｾ｡蛻・梵" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">莠ｺ莠玖ｩ穂ｾ｡蛻・梵繝ｬ繝昴・繝・/h1>
            <p className="text-gray-600">
              繧ｹ繧ｭ繝ｫ縺ｨ謌先棡縺ｮ2霆ｸ隧穂ｾ｡繧剃ｸｭ蠢・↓縲∝､夊ｧ堤噪縺ｪ隕也せ縺九ｉ閨ｷ蜩｡縺ｮ繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ繧貞・譫舌＠縲・
              邨・ｹ斐・莠ｺ譚仙鴨蜷台ｸ翫↓蜷代￠縺溷・菴鍋噪縺ｪ譁ｽ遲悶ｒ謠先｡医＠縺ｾ縺吶・
            </p>
          </div>
          
          <FacilitySelector
            selectedFacility={selectedFacility}
            onFacilityChange={setSelectedFacility}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((report) => (
            <CategoryReportCard
              key={report.id}
              {...report}
              onClick={() => handleReportClick(report.path)}
            />
          ))}
        </div>

        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">
            庁 莠ｺ莠玖ｩ穂ｾ｡蛻・梵縺ｮ豢ｻ逕ｨ繝昴う繝ｳ繝・
          </h2>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>窶｢ 繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ繝槭ヨ繝ｪ繧ｯ繧ｹ縺ｧ蛟倶ｺｺ縺ｮ菴咲ｽｮ縺･縺代ｒ謚頑升縺励・←蛻・↑閧ｲ謌占ｨ育判繧堤ｫ区｡・/li>
            <li>窶｢ 繝√・繝繝ｻ驛ｨ髢蛻･縺ｮ蛻・梵縺ｧ邨・ｹ斐・蠑ｷ縺ｿ繝ｻ蠑ｱ縺ｿ繧堤音螳壹＠縲∵姶逡･逧・↑莠ｺ譚宣・鄂ｮ繧貞ｮ溽樟</li>
            <li>窶｢ 隧穂ｾ｡謗ｨ遘ｻ縺ｨ繧ｯ繝ｩ繧ｹ繧ｿ繝ｼ蛻・梵縺ｧ蟆・擂縺ｮ莠ｺ譚舌Μ繧ｹ繧ｯ繧呈掠譛溘↓逋ｺ隕九・蟇ｾ蠢・/li>
            <li>窶｢ 邨・ｹ疲怙驕ｩ蛹悶す繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ縺ｧ謚戊ｳ・ｯｾ蜉ｹ譫懊・鬮倥＞譁ｽ遲悶ｒ蜆ｪ蜈育噪縺ｫ螳滓命</li>
          </ul>
        </div>
      </div></div>
  );
}