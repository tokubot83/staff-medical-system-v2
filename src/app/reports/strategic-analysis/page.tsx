'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import FacilitySelector from '@/components/reports/FacilitySelector';
import Link from 'next/link';
const reports = [
  {
    id: 'hr-strategy',
    title: '莠ｺ莠狗ｮ｡逅・姶逡･蛻・梵',
    path: '/reports/hr-strategy',
    description: '邨・ｹ斐・莠ｺ莠狗ｮ｡逅・姶逡･繧堤ｷ丞粋逧・↓蛻・梵縺励∵隼蝟・署譯医ｒ謠蝉ｾ帙＠縺ｾ縺・,
    icon: '投',
    bgColor: 'bg-blue-500'
  },
  {
    id: 'work-life-balance',
    title: '繝ｯ繝ｼ繧ｯ繝ｩ繧､繝輔ヰ繝ｩ繝ｳ繧ｹ蛻・梵',
    path: '/reports/work-life-balance',
    description: '閨ｷ蜩｡縺ｮ蜉ｴ蜒肴凾髢薙∽ｼ第嚊蜿門ｾ礼憾豕√√せ繝医Ξ繧ｹ謖・ｨ吶ｒ蛻・梵縺励∪縺・,
    icon: '笞厄ｸ・,
    bgColor: 'bg-green-500'
  },
  {
    id: 'talent-development',
    title: '閨ｷ遞ｮ蛻･莠ｺ譚占ご謌先姶逡･',
    path: '/reports/talent-development',
    description: '閨ｷ遞ｮ縺斐→縺ｮ閧ｲ謌占ｨ育判縺ｨ繧ｭ繝｣繝ｪ繧｢繝代せ蛻・梵繧定｡後＞縺ｾ縺・,
    icon: '識',
    bgColor: 'bg-purple-500'
  },
  {
    id: 'organization-optimization',
    title: '邨・ｹ疲ｧ矩譛驕ｩ蛹門・譫・,
    path: '/reports/organization-optimization',
    description: '驛ｨ髢蛻･縺ｮ莠ｺ蜩｡驟咲ｽｮ縺ｨ邨・ｹ泌柑邇・ｒ蛻・梵縺励∪縺・,
    icon: '召',
    bgColor: 'bg-indigo-500'
  },
  {
    id: 'work-environment',
    title: '蜉ｴ蜒咲腸蠅・隼蝟・姶逡･',
    path: '/reports/work-environment',
    description: '閨ｷ蝣ｴ迺ｰ蠅・・隱ｲ鬘後ｒ迚ｹ螳壹＠縲∵隼蝟・ｭ悶ｒ謠先｡医＠縺ｾ縺・,
    icon: '検',
    bgColor: 'bg-yellow-500'
  },
  {
    id: 'cost-optimization',
    title: '莠ｺ莉ｶ雋ｻ譛驕ｩ蛹門・譫・,
    path: '/reports/cost-optimization',
    description: '莠ｺ莉ｶ雋ｻ縺ｮ隧ｳ邏ｰ蛻・梵縺ｨ譛驕ｩ蛹匁署譯医ｒ陦後＞縺ｾ縺・,
    icon: '腸',
    bgColor: 'bg-red-500'
  },
  {
    id: 'recruitment-effectiveness',
    title: '謗｡逕ｨ蜉ｹ譫懷・譫・,
    path: '/reports/recruitment-effectiveness',
    description: '謗｡逕ｨ豢ｻ蜍輔・蜉ｹ譫懈ｸｬ螳壹→謾ｹ蝟・署譯医ｒ謠蝉ｾ帙＠縺ｾ縺・,
    icon: '識',
    bgColor: 'bg-teal-500'
  },
  {
    id: 'turnover-risk',
    title: '髮｢閨ｷ繝ｪ繧ｹ繧ｯ莠域ｸｬ',
    path: '/reports/turnover-risk',
    description: '繝・・繧ｿ蛻・梵縺ｫ繧医ｋ髮｢閨ｷ繝ｪ繧ｹ繧ｯ縺ｮ莠域ｸｬ縺ｨ蟇ｾ遲悶ｒ謠先｡医＠縺ｾ縺・,
    icon: '笞・・,
    bgColor: 'bg-orange-500'
  },
  {
    id: 'skill-qualification',
    title: '繧ｹ繧ｭ繝ｫ繝ｻ雉・ｼ邂｡逅・・譫・,
    path: '/reports/skill-qualification',
    description: '閨ｷ蜩｡縺ｮ繧ｹ繧ｭ繝ｫ縺ｨ雉・ｼ縺ｮ迴ｾ迥ｶ蛻・梵縺ｨ閧ｲ謌占ｨ育判繧堤ｭ門ｮ壹＠縺ｾ縺・,
    icon: '糖',
    bgColor: 'bg-pink-500'
  }
];

function StrategicAnalysisPageContent() {
  const searchParams = useSearchParams();
  const selectedFacility = searchParams.get('facility') || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="謌ｦ逡･蛻・梵" />
      
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
            謌ｦ逡･逧・ｺｺ譚仙・譫舌い繧ｻ繧ｹ繝｡繝ｳ繝・
          </h3>
          
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="text-blue-800 mb-3">
              <span className="font-medium">謗ｨ螂ｨ繝輔Ο繝ｼ・・/span>
              莠ｺ莠狗ｮ｡逅・姶逡･ 竊・繧ｹ繧ｭ繝ｫ繝ｻ雉・ｼ邂｡逅・竊・謗｡逕ｨ蜉ｹ譫懷・譫・竊・邨・ｹ疲ｧ矩譛驕ｩ蛹・
            </div>
            <ul className="list-disc list-inside text-blue-700 space-y-1">
              <li>荳ｭ髟ｷ譛溽噪縺ｪ莠ｺ譚先姶逡･縺ｮ遶区｡医→KPI險ｭ螳・/li>
              <li>邨・ｹ斐・遶ｶ莠牙鴨蠑ｷ蛹悶↓蠢・ｦ√↑譁ｽ遲也音螳・/li>
              <li>莠ｺ譚先兜雉・・蜆ｪ蜈磯・ｽ堺ｻ倥￠縺ｨROI隧穂ｾ｡</li>
              <li>邨悟霧謌ｦ逡･縺ｨ莠ｺ譚先姶逡･縺ｮ謨ｴ蜷域ｧ遒ｺ菫・/li>
            </ul>
          </div>

          <div className="mt-4 text-blue-800 text-sm">
            <p className="font-medium">
              謌ｦ逡･蛻・梵縺ｫ繧医ｊ縲√ョ繝ｼ繧ｿ縺ｫ蝓ｺ縺･縺丈ｺｺ譚舌・繝阪ず繝｡繝ｳ繝医→謖∫ｶ夂噪縺ｪ邨・ｹ疲・髟ｷ繧貞ｮ溽樟縺ｧ縺阪∪縺吶・
            </p>
          </div>
        </div>
      </div></div>
  );
}

export default function StrategicAnalysisPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StrategicAnalysisPageContent />
    </Suspense>
  );
}