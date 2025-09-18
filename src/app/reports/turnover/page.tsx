'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import FacilitySelector from '@/components/reports/FacilitySelector';
const reports = [
  {
    id: 'risk-prediction',
    title: '髮｢閨ｷ繝ｪ繧ｹ繧ｯ莠域ｸｬ',
    path: '/reports/turnover/risk-prediction',
    description: 'AI繧呈ｴｻ逕ｨ縺励◆蛟倶ｺｺ蛻･髮｢閨ｷ繝ｪ繧ｹ繧ｯ縺ｮ莠域ｸｬ縺ｨ譌ｩ譛溯ｭｦ蜻・,
    icon: '識',
    gradient: 'from-red-500 to-red-600'
  },
  {
    id: 'high-risk-dashboard',
    title: '鬮倥Μ繧ｹ繧ｯ閠・ム繝・す繝･繝懊・繝・,
    path: '/reports/turnover/high-risk-dashboard',
    description: '髮｢閨ｷ繝ｪ繧ｹ繧ｯ縺ｮ鬮倥＞閨ｷ蜩｡縺ｮ荳隕ｧ縺ｨ隧ｳ邏ｰ蛻・梵',
    icon: '笞・・,
    gradient: 'from-orange-500 to-orange-600'
  },
  {
    id: 'factor-ranking',
    title: '髮｢閨ｷ隕∝屏繝ｩ繝ｳ繧ｭ繝ｳ繧ｰ',
    path: '/reports/turnover/factor-ranking',
    description: '髮｢閨ｷ縺ｫ蠖ｱ髻ｿ縺吶ｋ隕∝屏繧帝㍾隕∝ｺｦ鬆・↓繝ｩ繝ｳ繧ｭ繝ｳ繧ｰ',
    icon: '投',
    gradient: 'from-purple-500 to-purple-600'
  },
  {
    id: 'correlation-analysis',
    title: '逶ｸ髢｢蛻・梵',
    path: '/reports/turnover/correlation-analysis',
    description: '髮｢閨ｷ縺ｨ蜷・ｨｮ謖・ｨ吶・逶ｸ髢｢髢｢菫ゅｒ蜿ｯ隕門喧',
    icon: '嶋',
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    id: 'predictive-modeling',
    title: '莠域ｸｬ繝｢繝・Μ繝ｳ繧ｰ',
    path: '/reports/turnover/predictive-modeling',
    description: '讖滓｢ｰ蟄ｦ鄙偵↓繧医ｋ鬮倡ｲｾ蠎ｦ縺ｪ髮｢閨ｷ莠域ｸｬ繝｢繝・Ν',
    icon: '､・,
    gradient: 'from-indigo-500 to-indigo-600'
  },
  {
    id: 'what-if-simulation',
    title: 'What-if繧ｷ繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ',
    path: '/reports/turnover/what-if-simulation',
    description: '譁ｽ遲門ｮ滓命譎ゅ・髮｢閨ｷ邇・､牙喧繧偵す繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ',
    icon: '醗',
    gradient: 'from-pink-500 to-pink-600'
  },
  {
    id: 'retention-strategies',
    title: '螳夂捩謌ｦ逡･謠先｡・,
    path: '/reports/turnover/retention-strategies',
    description: '驛ｨ鄂ｲ繝ｻ閨ｷ遞ｮ蛻･縺ｮ蜉ｹ譫懃噪縺ｪ螳夂捩譁ｽ遲悶ｒ謠先｡・,
    icon: '庁',
    gradient: 'from-green-500 to-green-600'
  },
  {
    id: 'improvement-suggestions',
    title: '謾ｹ蝟・命遲匁署譯・,
    path: '/reports/turnover/improvement-suggestions',
    description: '繝・・繧ｿ縺ｫ蝓ｺ縺･縺丞・菴鍋噪縺ｪ謾ｹ蝟・い繧ｯ繧ｷ繝ｧ繝ｳ',
    icon: '識',
    gradient: 'from-teal-500 to-teal-600'
  },
  {
    id: 'time-series-trend',
    title: '譎らｳｻ蛻励ヨ繝ｬ繝ｳ繝牙・譫・,
    path: '/reports/turnover/time-series-trend',
    description: '髮｢閨ｷ邇・・譎らｳｻ蛻怜､牙喧縺ｨ繝医Ξ繝ｳ繝我ｺ域ｸｬ',
    icon: '嶋',
    gradient: 'from-cyan-500 to-cyan-600'
  },
  {
    id: 'cost-impact',
    title: '髮｢閨ｷ繧ｳ繧ｹ繝亥ｽｱ髻ｿ蛻・梵',
    path: '/reports/turnover/cost-impact',
    description: '髮｢閨ｷ縺ｫ繧医ｋ雋｡蜍咏噪蠖ｱ髻ｿ縺ｨROI蛻・梵',
    icon: '腸',
    gradient: 'from-amber-500 to-amber-600'
  },
  {
    id: 'exit-feedback',
    title: '騾閨ｷ閠・ヵ繧｣繝ｼ繝峨ヰ繝・け蛻・梵',
    path: '/reports/turnover/exit-feedback',
    description: '騾閨ｷ閠・・螢ｰ縺九ｉ隱ｲ鬘後ｒ謚ｽ蜃ｺ',
    icon: '眺',
    gradient: 'from-violet-500 to-violet-600'
  },
  {
    id: 'benchmark-best-practices',
    title: '繝吶Φ繝√・繝ｼ繧ｯ繝ｻ繝吶せ繝医・繝ｩ繧ｯ繝・ぅ繧ｹ',
    path: '/reports/turnover/benchmark-best-practices',
    description: '讌ｭ逡後ヨ繝・・繝代ヵ繧ｩ繝ｼ繝槭・縺ｨ縺ｮ豈碑ｼ・,
    icon: '醇',
    gradient: 'from-emerald-500 to-emerald-600'
  }
];

function TurnoverPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedFacility = searchParams.get('facility') || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="髮｢閨ｷ蛻・梵" />
      
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
          {reports.map((report) => (
            <div
              key={report.id}
              onClick={() => {
                const url = selectedFacility 
                  ? `${report.path}?facility=${encodeURIComponent(selectedFacility)}`
                  : report.path;
                router.push(url);
              }}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
            >
              <div className={`h-2 bg-gradient-to-r ${report.gradient}`} />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{report.icon}</span>
                  <h3 className="text-xl font-semibold">{report.title}</h3>
                </div>
                <p className="text-gray-600">{report.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 繧｢繧ｻ繧ｹ繝｡繝ｳ繝医ヱ繧ｿ繝ｼ繝ｳ */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-6">
            髮｢閨ｷ蛻・梵縺ｮ繧｢繧ｻ繧ｹ繝｡繝ｳ繝医ヱ繧ｿ繝ｼ繝ｳ
          </h3>
          
          <div className="space-y-6">
            {/* 1. 險ｺ譁ｭ逧・い繧ｻ繧ｹ繝｡繝ｳ繝・*/}
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-2">
                1. 險ｺ譁ｭ逧・い繧ｻ繧ｹ繝｡繝ｳ繝茨ｼ育樟迥ｶ謚頑升・・
              </h4>
              <div className="text-blue-800 mb-2">
                <span className="font-medium">謗ｨ螂ｨ繝輔Ο繝ｼ・・/span>
                髮｢閨ｷ隕∝屏繝ｩ繝ｳ繧ｭ繝ｳ繧ｰ 竊・逶ｸ髢｢蛻・梵 竊・驛ｨ鄂ｲ蛻･豺ｱ謗倥ｊ
              </div>
              <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
                <li>荳ｻ隕√↑髮｢閨ｷ隕∝屏繧堤音螳・/li>
                <li>隕∝屏髢薙・逶ｸ莠帝未菫ゅｒ逅・ｧ｣</li>
                <li>蝠城｡後・螟ｧ縺阪＞驛ｨ鄂ｲ繧貞━蜈亥ｯｾ蠢・/li>
              </ul>
            </div>

            {/* 2. 莠域ｸｬ逧・い繧ｻ繧ｹ繝｡繝ｳ繝・*/}
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-2">
                2. 莠域ｸｬ逧・い繧ｻ繧ｹ繝｡繝ｳ繝茨ｼ医Μ繧ｹ繧ｯ隧穂ｾ｡・・
              </h4>
              <div className="text-blue-800 mb-2">
                <span className="font-medium">謗ｨ螂ｨ繝輔Ο繝ｼ・・/span>
                繝ｪ繧ｹ繧ｯ莠域ｸｬ 竊・鬮倥Μ繧ｹ繧ｯ閠・音螳・竊・蛟句挨蟇ｾ蠢懆ｨ育判
              </div>
              <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
                <li>AI縺ｫ繧医ｋ髮｢閨ｷ遒ｺ邇・ｨ育ｮ・/li>
                <li>繝ｪ繧ｹ繧ｯ繝ｬ繝吶Ν蛻･縺ｮ蛻・｡・/li>
                <li>繝励Ο繧｢繧ｯ繝・ぅ繝悶↑莉句・</li>
              </ul>
            </div>

            {/* 3. 譎らｳｻ蛻励い繧ｻ繧ｹ繝｡繝ｳ繝・*/}
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-2">
                3. 譎らｳｻ蛻励い繧ｻ繧ｹ繝｡繝ｳ繝茨ｼ医ヨ繝ｬ繝ｳ繝牙・譫撰ｼ・
              </h4>
              <div className="text-blue-800 mb-2">
                <span className="font-medium">謗ｨ螂ｨ繝輔Ο繝ｼ・・/span>
                譎らｳｻ蛻励ヨ繝ｬ繝ｳ繝・竊・蟄｣遽諤ｧ謚頑升 竊・蟆・擂莠域ｸｬ
              </div>
              <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
                <li>髮｢閨ｷ邇・・螟牙喧繝代ち繝ｼ繝ｳ隱崎ｭ・/li>
                <li>郢∝ｿ呎悄繝ｻ蟷ｴ蠎ｦ譛ｫ遲峨・蠖ｱ髻ｿ隧穂ｾ｡</li>
                <li>荳ｭ髟ｷ譛溽噪縺ｪ莠ｺ蜩｡險育判縺ｸ縺ｮ蜿肴丐</li>
              </ul>
            </div>

            {/* 4. 雋｡蜍咏噪繧｢繧ｻ繧ｹ繝｡繝ｳ繝・*/}
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-2">
                4. 雋｡蜍咏噪繧｢繧ｻ繧ｹ繝｡繝ｳ繝茨ｼ医さ繧ｹ繝亥・譫撰ｼ・
              </h4>
              <div className="text-blue-800 mb-2">
                <span className="font-medium">謗ｨ螂ｨ繝輔Ο繝ｼ・・/span>
                繧ｳ繧ｹ繝亥ｽｱ髻ｿ蛻・梵 竊・ROI險育ｮ・竊・謚戊ｳ・━蜈磯・ｽ・
              </div>
              <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
                <li>髮｢閨ｷ縺ｫ繧医ｋ謳榊､ｱ鬘阪・蜿ｯ隕門喧</li>
                <li>譁ｽ遲悶・雋ｻ逕ｨ蟇ｾ蜉ｹ譫懆ｩ穂ｾ｡</li>
                <li>莠育ｮ鈴・蛻・・譛驕ｩ蛹・/li>
              </ul>
            </div>

            {/* 5. 螳壽ｧ逧・い繧ｻ繧ｹ繝｡繝ｳ繝・*/}
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-2">
                5. 螳壽ｧ逧・い繧ｻ繧ｹ繝｡繝ｳ繝茨ｼ亥｣ｰ縺ｮ蛻・梵・・
              </h4>
              <div className="text-blue-800 mb-2">
                <span className="font-medium">謗ｨ螂ｨ繝輔Ο繝ｼ・・/span>
                騾閨ｷ閠・ヵ繧｣繝ｼ繝峨ヰ繝・け 竊・繧ｻ繝ｳ繝√Γ繝ｳ繝亥・譫・竊・謾ｹ蝟・せ謚ｽ蜃ｺ
              </div>
              <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
                <li>騾閨ｷ逅・罰縺ｮ譛ｬ雉ｪ逧・炊隗｣</li>
                <li>邨・ｹ疲枚蛹悶・隱ｲ鬘檎匱隕・/li>
                <li>蜈ｷ菴鍋噪縺ｪ謾ｹ蝟・い繧ｯ繧ｷ繝ｧ繝ｳ</li>
              </ul>
            </div>

            {/* 6. 豈碑ｼ・噪繧｢繧ｻ繧ｹ繝｡繝ｳ繝・*/}
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-2">
                6. 豈碑ｼ・噪繧｢繧ｻ繧ｹ繝｡繝ｳ繝茨ｼ医・繝ｳ繝√・繝ｼ繧ｯ・・
              </h4>
              <div className="text-blue-800 mb-2">
                <span className="font-medium">謗ｨ螂ｨ繝輔Ο繝ｼ・・/span>
                讌ｭ逡梧ｯ碑ｼ・竊・繧ｮ繝｣繝・・蛻・梵 竊・繝吶せ繝医・繝ｩ繧ｯ繝・ぅ繧ｹ蟆主・
              </div>
              <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
                <li>閾ｪ邨・ｹ斐・繝昴ず繧ｷ繝ｧ繝ｳ謚頑升</li>
                <li>謾ｹ蝟・ｽ吝慍縺ｮ螳夐㍼蛹・/li>
                <li>謌仙粥莠倶ｾ九・驕ｩ逕ｨ讀懆ｨ・/li>
              </ul>
            </div>
          </div>
        </div>

        {/* 菴ｿ縺・婿繧ｬ繧､繝・*/}
        <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            髮｢閨ｷ蛻・梵縺ｮ豢ｻ逕ｨ譁ｹ豕・
          </h3>
          <ul className="list-disc list-inside text-red-800 space-y-1">
            <li>鬮倥Μ繧ｹ繧ｯ閠・ｒ迚ｹ螳壹＠縲∝句挨髱｢隲・ｄ繝輔か繝ｭ繝ｼ繧貞ｮ滓命縺ｧ縺阪∪縺・/li>
            <li>髮｢閨ｷ隕∝屏繧呈滑謠｡縺励∫ｵ・ｹ泌・菴薙・謾ｹ蝟・ｭ悶ｒ遶区｡医〒縺阪∪縺・/li>
            <li>譁ｽ遲悶・蜉ｹ譫懊ｒ繧ｷ繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ縺励∵怙驕ｩ縺ｪ謚戊ｳ・愛譁ｭ縺後〒縺阪∪縺・/li>
            <li>莠磯亟逧・い繝励Ο繝ｼ繝√↓繧医ｊ縲・屬閨ｷ繧ｳ繧ｹ繝医ｒ螟ｧ蟷・↓蜑頑ｸ帙〒縺阪∪縺・/li>
          </ul>
        </div>
      </div></div>
  );
}

export default function TurnoverPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TurnoverPageContent />
    </Suspense>
  );
}