'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import FacilitySelector from '@/components/reports/FacilitySelector';
import Link from 'next/link';
const reports = [
  {
    id: 'real-time-dashboard',
    title: '繝ｪ繧｢繝ｫ繧ｿ繧､繝繝繝・す繝･繝懊・繝・,
    path: '/reports/basic-metrics/real-time-dashboard',
    description: '蜃ｺ蜍､迥ｶ豕√√す繝輔ヨ蜈・ｶｳ邇・∫ｷ頑･蟇ｾ蠢懷鴨繧偵Μ繧｢繝ｫ繧ｿ繧､繝縺ｧ逶｣隕悶＠縺ｾ縺・,
    icon: '藤',
    bgColor: 'bg-green-500'
  },
  {
    id: 'predictive-analytics',
    title: '莠域ｸｬ逧・ｺｺ蜩｡蛻・梵',
    path: '/reports/basic-metrics/predictive-analytics',
    description: 'AI豢ｻ逕ｨ縺ｫ繧医ｋ髴隕∽ｺ域ｸｬ縲∵ｬ蜍､莠域ｸｬ縲∵治逕ｨ蠢・ｦ∵焚繧貞・譫舌＠縺ｾ縺・,
    icon: '醗',
    bgColor: 'bg-purple-500'
  },
  {
    id: 'diversity-inclusion',
    title: '繝繧､繝舌・繧ｷ繝・ぅ・・う繝ｳ繧ｯ繝ｫ繝ｼ繧ｸ繝ｧ繝ｳ',
    path: '/reports/basic-metrics/diversity-inclusion',
    description: '諤ｧ蛻･縲∝ｹｴ鮨｢縲∝嵜邀阪・螟壽ｧ俶ｧ縺ｨ髫懊′縺・・寐逕ｨ迥ｶ豕√ｒ遒ｺ隱阪＠縺ｾ縺・,
    icon: '決',
    bgColor: 'bg-indigo-500'
  },
  {
    id: 'compliance',
    title: '繧ｳ繝ｳ繝励Λ繧､繧｢繝ｳ繧ｹ謖・ｨ・,
    path: '/reports/basic-metrics/compliance',
    description: '蜉ｴ蜒肴ｳ戊ｦ上∬ｳ・ｼ隕∽ｻｶ縲∝ｮ牙・陦帷函縺ｮ驕ｵ螳育憾豕√ｒ邂｡逅・＠縺ｾ縺・,
    icon: '笞厄ｸ・,
    bgColor: 'bg-blue-500'
  },
  {
    id: 'productivity',
    title: '逕溽肇諤ｧ謖・ｨ・,
    path: '/reports/basic-metrics/productivity',
    description: '荳莠ｺ蠖薙◆繧雁｣ｲ荳翫∽ｻ伜刈萓｡蛟､蛻・梵縲√う繝弱・繝ｼ繧ｷ繝ｧ繝ｳ謖・ｨ吶ｒ遒ｺ隱阪＠縺ｾ縺・,
    icon: '笞｡',
    bgColor: 'bg-yellow-500'
  },
  {
    id: 'engagement',
    title: '繧ｨ繝ｳ繧ｲ繝ｼ繧ｸ繝｡繝ｳ繝域欠讓・,
    path: '/reports/basic-metrics/engagement',
    description: '蠕捺･ｭ蜩｡貅雜ｳ蠎ｦ縲‘NPS縲∝ｮ夂捩諢丞髄縲√Δ繝√・繝ｼ繧ｷ繝ｧ繝ｳ繧呈ｸｬ螳壹＠縺ｾ縺・,
    icon: '苧',
    bgColor: 'bg-pink-500'
  },
  {
    id: 'cost-analysis',
    title: '繧ｳ繧ｹ繝亥・譫先欠讓・,
    path: '/reports/basic-metrics/cost-analysis',
    description: '莠ｺ莉ｶ雋ｻ邇・∵治逕ｨ繧ｳ繧ｹ繝医∵蕗閧ｲ謚戊ｳ⑲OI縲・屬閨ｷ繧ｳ繧ｹ繝医ｒ蛻・梵縺励∪縺・,
    icon: '腸',
    bgColor: 'bg-orange-500'
  },
  {
    id: 'benchmark',
    title: '繝吶Φ繝√・繝ｼ繧ｯ謖・ｨ・,
    path: '/reports/basic-metrics/benchmark',
    description: '讌ｭ逡梧ｯ碑ｼ・∝慍蝓滓ｯ碑ｼ・√・繧ｹ繝医・繝ｩ繧ｯ繝・ぅ繧ｹ蛻・梵繧定｡後＞縺ｾ縺・,
    icon: '醇',
    bgColor: 'bg-cyan-500'
  },
  {
    id: 'integrated-assessment',
    title: '邨ｱ蜷育噪謖・ｨ吶い繧ｻ繧ｹ繝｡繝ｳ繝・,
    path: '/reports/basic-metrics/integrated-assessment',
    description: 'KPI邨ｱ蜷育ｮ｡逅・∽ｺ域ｸｬ繧｢繝ｩ繝ｼ繝医√ヰ繝ｩ繝ｳ繧ｹ繧ｹ繧ｳ繧｢繧ｫ繝ｼ繝峨ｒ謠蝉ｾ帙＠縺ｾ縺・,
    icon: '識',
    bgColor: 'bg-red-500'
  },
  {
    id: 'two-axis-evaluation',
    title: '2霆ｸ隧穂ｾ｡蛻・梵',
    path: '/reports/two-axis-evaluation',
    description: '譁ｽ險ｭ蜀・ｩ穂ｾ｡縺ｨ豕穂ｺｺ蜀・ｩ穂ｾ｡縺ｫ繧医ｋ螟夊ｧ堤噪縺ｪ莠ｺ莠玖ｩ穂ｾ｡蛻・梵繧定｡後＞縺ｾ縺・,
    icon: '盗',
    bgColor: 'bg-purple-600'
  },
  {
    id: 'basic',
    title: '蝓ｺ譛ｬ邨ｱ險・,
    path: '/reports/basic-metrics/basic-statistics',
    description: '邱剰・蜩｡謨ｰ縲・Κ髢蛻･莠ｺ蜩｡讒区・縺ｪ縺ｩ蝓ｺ譛ｬ逧・↑邨ｱ險医ョ繝ｼ繧ｿ繧堤｢ｺ隱阪＠縺ｾ縺・,
    icon: '投',
    bgColor: 'bg-gray-500'
  },
  {
    id: 'quality',
    title: '莠ｺ譚舌・雉ｪ',
    path: '/reports/basic-metrics/talent-quality',
    description: '閨ｷ蜩｡貅雜ｳ蠎ｦ縲√せ繧ｭ繝ｫ隧穂ｾ｡縲∬ｳ・ｼ菫晄怏迥ｶ豕√ｒ蛻・梵縺励∪縺・,
    icon: '箝・,
    bgColor: 'bg-gray-500'
  },
  {
    id: 'growth',
    title: '莠ｺ譚舌・謌宣聞',
    path: '/reports/basic-metrics/talent-growth',
    description: '遐比ｿｮ蜿苓ｬ帷紫縲√せ繧ｭ繝ｫ蜷台ｸ雁ｺｦ縲√く繝｣繝ｪ繧｢髢狗匱迥ｶ豕√ｒ遒ｺ隱阪＠縺ｾ縺・,
    icon: '嶋',
    bgColor: 'bg-gray-500'
  },
  {
    id: 'risk',
    title: '繝ｪ繧ｹ繧ｯ邂｡逅・,
    path: '/reports/basic-metrics/risk-management',
    description: '髮｢閨ｷ繝ｪ繧ｹ繧ｯ縲√さ繝ｳ繝励Λ繧､繧｢繝ｳ繧ｹ縲∬ｦ∵ｳｨ諢剰・蜩｡縺ｮ迥ｶ豕√ｒ邂｡逅・＠縺ｾ縺・,
    icon: '笞・・,
    bgColor: 'bg-gray-500'
  },
  {
    id: 'efficiency',
    title: '邨・ｹ泌柑邇・,
    path: '/reports/basic-metrics/organizational-efficiency',
    description: '蜉ｴ蜒咲函逕｣諤ｧ縲∵･ｭ蜍吝柑邇・∫ｷ頑･蟇ｾ蠢應ｺ矩・ｒ遒ｺ隱阪＠縺ｾ縺・,
    icon: '噫',
    bgColor: 'bg-gray-500'
  }
];

function BasicMetricsPageContent() {
  const searchParams = useSearchParams();
  const selectedFacility = searchParams.get('facility') || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="蝓ｺ譛ｬ謖・ｨ・ />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 譁ｽ險ｭ驕ｸ謚・*/}
        <div className="mb-8">
          <FacilitySelector
            selectedFacility={selectedFacility}
            onFacilityChange={() => {}}
          />
        </div>

        {/* 繝ｬ繝昴・繝井ｸ隕ｧ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => {
            const url = selectedFacility 
              ? `${report.path}?facility=${encodeURIComponent(selectedFacility)}`
              : report.path;
            
            return (
              <Link key={report.id} className="block" href={url}>
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 h-full">
                  <div className="flex items-center mb-4">
                    <div className={`${report.bgColor} text-white rounded-lg p-3 text-2xl`}>
                      {report.icon}
                    </div>
                    <h3 className="ml-4 text-lg font-semibold text-gray-900">{report.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{report.description}</p>
                  <div className="mt-auto flex items-center text-blue-600">
                    <span className="text-sm">繝ｬ繝昴・繝医ｒ隕九ｋ</span>
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* 繧｢繧ｻ繧ｹ繝｡繝ｳ繝医ヱ繧ｿ繝ｼ繝ｳ */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-6">
            蝓ｺ譛ｬ謖・ｨ吶Δ繝九ち繝ｪ繝ｳ繧ｰ繧｢繧ｻ繧ｹ繝｡繝ｳ繝・
          </h3>
          
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="text-blue-800 mb-3">
              <span className="font-medium">謗ｨ螂ｨ繝輔Ο繝ｼ・・/span>
              繝ｪ繧｢繝ｫ繧ｿ繧､繝繝繝・す繝･繝懊・繝・竊・蝓ｺ譛ｬ邨ｱ險・竊・繧ｨ繝ｳ繧ｲ繝ｼ繧ｸ繝｡繝ｳ繝域欠讓・竊・邨ｱ蜷育噪謖・ｨ吶い繧ｻ繧ｹ繝｡繝ｳ繝・
            </div>
            <ul className="list-disc list-inside text-blue-700 space-y-1">
              <li>邨・ｹ斐・迴ｾ迥ｶ繧呈焚蛟､縺ｧ螳壽悄逧・↓繝｢繝九ち繝ｪ繝ｳ繧ｰ</li>
              <li>蜑榊ｹｴ蜷梧悄豈斐ｄ莉匁命險ｭ縺ｨ縺ｮ豈碑ｼ・・譫・/li>
              <li>邨悟霧蛻､譁ｭ縺ｮ蝓ｺ遉弱→縺ｪ繧九ョ繝ｼ繧ｿ謠蝉ｾ・/li>
              <li>謗｡逕ｨ險育判繧・ｺｺ蜩｡驟咲ｽｮ縺ｮ譛驕ｩ蛹匁髪謠ｴ</li>
            </ul>
          </div>

          <div className="mt-4 text-blue-800 text-sm">
            <p className="font-medium">
              蝓ｺ譛ｬ謖・ｨ吶・邯咏ｶ夂噪縺ｪ繝｢繝九ち繝ｪ繝ｳ繧ｰ縺ｫ繧医ｊ縲∫ｵ・ｹ斐・蛛･蜈ｨ諤ｧ繧呈滑謠｡縺励∵姶逡･逧・↑邨悟霧蛻､譁ｭ繧呈髪謠ｴ縺ｧ縺阪∪縺吶・
            </p>
          </div>
        </div>
      </div></div>
  );
}

export default function BasicMetricsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BasicMetricsPageContent />
    </Suspense>
  );
}