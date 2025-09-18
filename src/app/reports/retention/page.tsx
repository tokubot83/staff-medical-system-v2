'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import FacilitySelector from '@/components/reports/FacilitySelector';
const reports = [
  {
    id: 'survival-curve-overall',
    title: '逕溷ｭ俶峇邱壼・譫撰ｼ亥・菴難ｼ・,
    path: '/reports/retention/survival-curve-overall',
    description: '蜈ｨ閨ｷ蜩｡縺ｮ螳夂捩邇・ｒ譎らｳｻ蛻励〒蜿ｯ隕門喧縺励∝ｮ夂捩繝代ち繝ｼ繝ｳ繧貞・譫・,
    icon: '嶋',
    gradient: 'from-green-500 to-green-600'
  },
  {
    id: 'survival-curve-department',
    title: '逕溷ｭ俶峇邱壼・譫撰ｼ磯Κ鄂ｲ蛻･・・,
    path: '/reports/retention/survival-curve-department',
    description: '驛ｨ鄂ｲ縺斐→縺ｮ螳夂捩邇・・驕輔＞繧呈ｯ碑ｼ・・譫・,
    icon: '唱',
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    id: 'cohort-yearly-tracking',
    title: '繧ｳ繝帙・繝亥ｹｴ谺｡霑ｽ霍｡',
    path: '/reports/retention/cohort-yearly-tracking',
    description: '蜈･遉ｾ蟷ｴ谺｡蛻･縺ｮ螳夂捩邇・耳遘ｻ繧帝聞譛溯ｿｽ霍｡',
    icon: '投',
    gradient: 'from-purple-500 to-purple-600'
  },
  {
    id: 'cohort-intervention-effect',
    title: '繧ｳ繝帙・繝域命遲門柑譫・,
    path: '/reports/retention/cohort-intervention-effect',
    description: '螳夂捩譁ｽ遲悶・蜉ｹ譫懊ｒ蜈･遉ｾ蟷ｴ谺｡蛻･縺ｫ貂ｬ螳・,
    icon: '庁',
    gradient: 'from-yellow-500 to-yellow-600'
  },
  {
    id: 'early-turnover-pattern',
    title: '譌ｩ譛滄屬閨ｷ繝代ち繝ｼ繝ｳ',
    path: '/reports/retention/early-turnover-pattern',
    description: '蜈･遉ｾ3蟷ｴ莉･蜀・・髮｢閨ｷ繝代ち繝ｼ繝ｳ縺ｨ隕∝屏蛻・梵',
    icon: '笞・・,
    gradient: 'from-red-500 to-red-600'
  },
  {
    id: 'early-turnover-alert',
    title: '譌ｩ譛滄屬閨ｷ繧｢繝ｩ繝ｼ繝・,
    path: '/reports/retention/early-turnover-alert',
    description: '譌ｩ譛滄屬閨ｷ繝ｪ繧ｹ繧ｯ縺ｮ鬮倥＞閨ｷ蜩｡繧呈掠譛滓､懃衍',
    icon: '圷',
    gradient: 'from-orange-500 to-orange-600'
  },
  {
    id: 'segment-generation',
    title: '繧ｻ繧ｰ繝｡繝ｳ繝井ｸ紋ｻ｣蛻・梵',
    path: '/reports/retention/segment-generation',
    description: '荳紋ｻ｣蛻･縺ｮ螳夂捩蛯ｾ蜷代→萓｡蛟､隕ｳ縺ｮ驕輔＞繧貞・譫・,
    icon: '則',
    gradient: 'from-teal-500 to-teal-600'
  },
  {
    id: 'segment-recruitment-type',
    title: '繧ｻ繧ｰ繝｡繝ｳ繝域治逕ｨ遞ｮ蛻･',
    path: '/reports/retention/segment-recruitment-type',
    description: '譁ｰ蜊偵・荳ｭ騾泌挨縺ｮ螳夂捩邇・→謌仙粥隕∝屏',
    icon: '識',
    gradient: 'from-indigo-500 to-indigo-600'
  },
  {
    id: 'hazard-risk-score',
    title: '繝上じ繝ｼ繝峨Μ繧ｹ繧ｯ繧ｹ繧ｳ繧｢',
    path: '/reports/retention/hazard-risk-score',
    description: '蛟倶ｺｺ蛻･縺ｮ髮｢閨ｷ繝ｪ繧ｹ繧ｯ繧偵せ繧ｳ繧｢蛹・,
    icon: '悼',
    gradient: 'from-pink-500 to-pink-600'
  },
  {
    id: 'hazard-cox-regression',
    title: 'Cox蝗槫ｸｰ蛻・梵',
    path: '/reports/retention/hazard-cox-regression',
    description: '髮｢閨ｷ隕∝屏縺ｮ邨ｱ險育噪縺ｪ蠖ｱ髻ｿ蠎ｦ繧貞・譫・,
    icon: '投',
    gradient: 'from-gray-500 to-gray-600'
  },
  {
    id: 'factor-mapping',
    title: '螳夂捩隕∝屏繝槭ャ繝斐Φ繧ｰ',
    path: '/reports/retention/factor-mapping',
    description: '螳夂捩縺ｫ蠖ｱ髻ｿ縺吶ｋ隕∝屏繧堤ｶｲ鄒・噪縺ｫ蛻・梵',
    icon: '亮・・,
    gradient: 'from-cyan-500 to-cyan-600'
  },
  {
    id: 'retention-simulator',
    title: '螳夂捩繧ｷ繝溘Η繝ｬ繝ｼ繧ｿ繝ｼ',
    path: '/reports/retention/retention-simulator',
    description: '譁ｽ遲門ｰ主・縺ｫ繧医ｋ螳夂捩邇・､牙喧繧偵す繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ',
    icon: '醗',
    gradient: 'from-violet-500 to-violet-600'
  },
  {
    id: 'turnover-contagion',
    title: '髮｢閨ｷ騾｣骼門・譫・,
    path: '/reports/retention/turnover-contagion',
    description: '荳莠ｺ縺ｮ髮｢閨ｷ縺悟捉蝗ｲ縺ｫ荳弱∴繧句ｽｱ髻ｿ繧貞・譫・,
    icon: '迫',
    gradient: 'from-amber-500 to-amber-600'
  }
];

function RetentionPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedFacility = searchParams.get('facility') || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="螳夂捩蛻・梵" />
      
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
            螳夂捩蛻・梵縺ｮ繧｢繧ｻ繧ｹ繝｡繝ｳ繝医ヱ繧ｿ繝ｼ繝ｳ
          </h3>
          
          <div className="space-y-6">
            {/* 1. 逕溷ｭ伜・譫舌い繧ｻ繧ｹ繝｡繝ｳ繝・*/}
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-2">
                1. 逕溷ｭ伜・譫舌い繧ｻ繧ｹ繝｡繝ｳ繝茨ｼ亥ｮ夂捩繝代ち繝ｼ繝ｳ・・
              </h4>
              <div className="text-blue-800 mb-2">
                <span className="font-medium">謗ｨ螂ｨ繝輔Ο繝ｼ・・/span>
                逕溷ｭ俶峇邱夲ｼ亥・菴難ｼ俄・ 驛ｨ鄂ｲ蛻･豈碑ｼ・竊・蜊ｱ髯ｺ譛溽音螳・
              </div>
              <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
                <li>蜍､邯壽悄髢灘挨縺ｮ螳夂捩邇・滑謠｡</li>
                <li>驛ｨ鄂ｲ髢薙・繝吶せ繝医・繝ｩ繧ｯ繝・ぅ繧ｹ逋ｺ隕・/li>
                <li>驥咲せ莉句・譎よ悄縺ｮ迚ｹ螳・/li>
              </ul>
            </div>

            {/* 2. 繧ｳ繝帙・繝郁ｿｽ霍｡繧｢繧ｻ繧ｹ繝｡繝ｳ繝・*/}
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-2">
                2. 繧ｳ繝帙・繝郁ｿｽ霍｡繧｢繧ｻ繧ｹ繝｡繝ｳ繝茨ｼ井ｸ紋ｻ｣蛻･蛻・梵・・
              </h4>
              <div className="text-blue-800 mb-2">
                <span className="font-medium">謗ｨ螂ｨ繝輔Ο繝ｼ・・/span>
                蟷ｴ谺｡繧ｳ繝帙・繝郁ｿｽ霍｡ 竊・譁ｽ遲門柑譫懈ｸｬ螳・竊・荳紋ｻ｣蛻･蟇ｾ蠢・
              </div>
              <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
                <li>蜈･閨ｷ蟷ｴ蠎ｦ蛻･縺ｮ螳夂捩蛯ｾ蜷・/li>
                <li>驕主悉譁ｽ遲悶・髟ｷ譛溽噪蜉ｹ譫懈､懆ｨｼ</li>
                <li>荳紋ｻ｣迚ｹ諤ｧ縺ｫ蠢懊§縺滓命遲冶ｨｭ險・/li>
              </ul>
            </div>

            {/* 3. 隕∝屏繝槭ャ繝斐Φ繧ｰ繧｢繧ｻ繧ｹ繝｡繝ｳ繝・*/}
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-2">
                3. 隕∝屏繝槭ャ繝斐Φ繧ｰ繧｢繧ｻ繧ｹ繝｡繝ｳ繝茨ｼ亥桁諡ｬ逧・・譫撰ｼ・
              </h4>
              <div className="text-blue-800 mb-2">
                <span className="font-medium">謗ｨ螂ｨ繝輔Ο繝ｼ・・/span>
                隕∝屏繝槭ャ繝斐Φ繧ｰ 竊・蜆ｪ蜈亥ｺｦ繝槭ヨ繝ｪ繝・け繧ｹ 竊・謾ｹ蝟・ｨ育判
              </div>
              <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
                <li>螳夂捩隕∝屏縺ｮ邯ｲ鄒・噪謚頑升</li>
                <li>驥崎ｦ∝ｺｦﾃ礼ｷ頑･蠎ｦ縺ｧ縺ｮ蜆ｪ蜈磯・ｽ・/li>
                <li>繝ｪ繧ｽ繝ｼ繧ｹ驟榊・縺ｮ譛驕ｩ蛹・/li>
              </ul>
            </div>

            {/* 4. 繧ｷ繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ繧｢繧ｻ繧ｹ繝｡繝ｳ繝・*/}
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-2">
                4. 繧ｷ繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ繧｢繧ｻ繧ｹ繝｡繝ｳ繝茨ｼ・hat-if蛻・梵・・
              </h4>
              <div className="text-blue-800 mb-2">
                <span className="font-medium">謗ｨ螂ｨ繝輔Ο繝ｼ・・/span>
                譁ｽ遲夜∈謚・竊・蜉ｹ譫應ｺ域ｸｬ 竊・ROI隧穂ｾ｡
              </div>
              <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
                <li>隍・焚譁ｽ遲悶・邨・∩蜷医ｏ縺帛柑譫・/li>
                <li>謚戊ｳ・屓蜿取悄髢薙・邂怜・</li>
                <li>谿ｵ髫守噪螳滓命險育判縺ｮ遶区｡・/li>
              </ul>
            </div>

            {/* 5. 騾｣骼門ｽｱ髻ｿ繧｢繧ｻ繧ｹ繝｡繝ｳ繝・*/}
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-2">
                5. 騾｣骼門ｽｱ髻ｿ繧｢繧ｻ繧ｹ繝｡繝ｳ繝茨ｼ域ｳ｢蜿雁柑譫懶ｼ・
              </h4>
              <div className="text-blue-800 mb-2">
                <span className="font-medium">謗ｨ螂ｨ繝輔Ο繝ｼ・・/span>
                繝阪ャ繝医Ρ繝ｼ繧ｯ蛻・梵 竊・騾｣骼悶Μ繧ｹ繧ｯ隧穂ｾ｡ 竊・莠磯亟謌ｦ逡･
              </div>
              <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
                <li>繧ｭ繝ｼ繝代・繧ｽ繝ｳ縺ｮ蠖ｱ髻ｿ蜉帶ｸｬ螳・/li>
                <li>髮｢閨ｷ騾｣骼悶・繝代ち繝ｼ繝ｳ隱崎ｭ・/li>
                <li>譌ｩ譛滉ｻ句・繝昴う繝ｳ繝医・迚ｹ螳・/li>
              </ul>
            </div>

            {/* 6. 繧ｻ繧ｰ繝｡繝ｳ繝医い繧ｻ繧ｹ繝｡繝ｳ繝・*/}
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-2">
                6. 繧ｻ繧ｰ繝｡繝ｳ繝医い繧ｻ繧ｹ繝｡繝ｳ繝茨ｼ亥ｱ樊ｧ蛻･蛻・梵・・
              </h4>
              <div className="text-blue-800 mb-2">
                <span className="font-medium">謗ｨ螂ｨ繝輔Ο繝ｼ・・/span>
                荳紋ｻ｣蛻・梵 竊・謗｡逕ｨ遞ｮ蛻･蛻・梵 竊・繧ｫ繧ｹ繧ｿ繝槭う繧ｺ譁ｽ遲・
              </div>
              <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
                <li>Z荳紋ｻ｣縲√Α繝ｬ繝九い繝ｫ荳紋ｻ｣遲峨・迚ｹ諤ｧ逅・ｧ｣</li>
                <li>譁ｰ蜊・荳ｭ騾斐・螳夂捩繝代ち繝ｼ繝ｳ驕輔＞</li>
                <li>繧ｿ繝ｼ繧ｲ繝・ヨ蛻･繧｢繝励Ο繝ｼ繝・/li>
              </ul>
            </div>
          </div>
        </div>

        {/* 邨ｱ蜷育噪繧｢繧ｻ繧ｹ繝｡繝ｳ繝医ヱ繧ｿ繝ｼ繝ｳ */}
        <div className="mt-8 bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-purple-900 mb-6">
            邨ｱ蜷育噪繧｢繧ｻ繧ｹ繝｡繝ｳ繝医ヱ繧ｿ繝ｼ繝ｳ
          </h3>
          
          <div className="space-y-6">
            {/* 1. 莠磯亟逧・ｺｺ譚舌・繝阪ず繝｡繝ｳ繝・*/}
            <div className="bg-white rounded-lg p-4 border border-purple-100">
              <h4 className="font-semibold text-purple-900 mb-2">
                1. 莠磯亟逧・ｺｺ譚舌・繝阪ず繝｡繝ｳ繝・
              </h4>
              <div className="text-purple-800 mb-2">
                <span className="font-medium">邨ｱ蜷医ヵ繝ｭ繝ｼ・・/span>
                髮｢閨ｷ繝ｪ繧ｹ繧ｯ莠域ｸｬ 竊・螳夂捩隕∝屏蠑ｷ蛹・竊・蜉ｹ譫懈ｸｬ螳・
              </div>
              <ul className="list-disc list-inside text-purple-700 text-sm space-y-1">
                <li>繝ｪ繧ｹ繧ｯ縺ｮ譌ｩ譛溽匱隕・/li>
                <li>莠磯亟逧・命遲悶・螳滓命</li>
                <li>邯咏ｶ夂噪縺ｪ謾ｹ蝟・し繧､繧ｯ繝ｫ</li>
              </ul>
            </div>

            {/* 2. 謌ｦ逡･逧・ｺｺ蜩｡險育判 */}
            <div className="bg-white rounded-lg p-4 border border-purple-100">
              <h4 className="font-semibold text-purple-900 mb-2">
                2. 謌ｦ逡･逧・ｺｺ蜩｡險育判
              </h4>
              <div className="text-purple-800 mb-2">
                <span className="font-medium">邨ｱ蜷医ヵ繝ｭ繝ｼ・・/span>
                髮｢閨ｷ莠域ｸｬ 竊・逕溷ｭ倡紫閠・・ 竊・謗｡逕ｨ險育判譛驕ｩ蛹・
              </div>
              <ul className="list-disc list-inside text-purple-700 text-sm space-y-1">
                <li>蟆・擂縺ｮ莠ｺ蜩｡髴隕∽ｺ域ｸｬ</li>
                <li>螳夂捩邇・ｒ郢斐ｊ霎ｼ繧薙□謗｡逕ｨ謨ｰ豎ｺ螳・/li>
                <li>繧ｳ繧ｹ繝亥柑邇・噪縺ｪ莠ｺ蜩｡遒ｺ菫・/li>
              </ul>
            </div>

            {/* 3. 邨・ｹ秘幕逋ｺ繧｢繝励Ο繝ｼ繝・*/}
            <div className="bg-white rounded-lg p-4 border border-purple-100">
              <h4 className="font-semibold text-purple-900 mb-2">
                3. 邨・ｹ秘幕逋ｺ繧｢繝励Ο繝ｼ繝・
              </h4>
              <div className="text-purple-800 mb-2">
                <span className="font-medium">邨ｱ蜷医ヵ繝ｭ繝ｼ・・/span>
                髮｢閨ｷ隕∝屏ﾃ怜ｮ夂捩隕∝屏 竊・邨・ｹ碑ｪｲ鬘檎音螳・竊・譁・喧螟蛾擠
              </div>
              <ul className="list-disc list-inside text-purple-700 text-sm space-y-1">
                <li>繝励ャ繧ｷ繝･隕∝屏縺ｨ繝励Ν隕∝屏縺ｮ荳｡髱｢蛻・梵</li>
                <li>譬ｹ譛ｬ逧・↑邨・ｹ碑ｪｲ鬘後∈縺ｮ蟇ｾ蠢・/li>
                <li>謖∫ｶ壼庄閭ｽ縺ｪ閨ｷ蝣ｴ迺ｰ蠅・ｧ狗ｯ・/li>
              </ul>
            </div>

            {/* 4. 蛟句挨譛驕ｩ蛹悶い繝励Ο繝ｼ繝・*/}
            <div className="bg-white rounded-lg p-4 border border-purple-100">
              <h4 className="font-semibold text-purple-900 mb-2">
                4. 蛟句挨譛驕ｩ蛹悶い繝励Ο繝ｼ繝・
              </h4>
              <div className="text-purple-800 mb-2">
                <span className="font-medium">邨ｱ蜷医ヵ繝ｭ繝ｼ・・/span>
                蛟倶ｺｺ繝ｪ繧ｹ繧ｯ繧ｹ繧ｳ繧｢ 竊・繧ｭ繝｣繝ｪ繧｢繧ｹ繝・・繧ｸ閠・・ 竊・繝代・繧ｽ繝翫Λ繧､繧ｺ謾ｯ謠ｴ
              </div>
              <ul className="list-disc list-inside text-purple-700 text-sm space-y-1">
                <li>荳莠ｺ縺ｲ縺ｨ繧翫・繝ｪ繧ｹ繧ｯ繝ｬ繝吶Ν隧穂ｾ｡</li>
                <li>繝ｩ繧､繝輔せ繝・・繧ｸ縺ｫ蠢懊§縺滓髪謠ｴ</li>
                <li>蛟句挨縺ｮ繧ｭ繝｣繝ｪ繧｢髢狗匱險育判</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 text-purple-800 text-sm">
            <p className="font-medium">
              縺薙ｌ繧峨・繧｢繧ｻ繧ｹ繝｡繝ｳ繝医ヱ繧ｿ繝ｼ繝ｳ繧堤ｵ・∩蜷医ｏ縺帙ｋ縺薙→縺ｧ縲∝､夊ｧ堤噪縺ｧ蜉ｹ譫懃噪縺ｪ莠ｺ譚仙ｮ夂捩謌ｦ逡･繧呈ｧ狗ｯ峨〒縺阪∪縺吶・
            </p>
          </div>
        </div>

        {/* 菴ｿ縺・婿繧ｬ繧､繝・*/}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            螳夂捩蛻・梵縺ｮ豢ｻ逕ｨ譁ｹ豕・
          </h3>
          <ul className="list-disc list-inside text-green-800 space-y-1">
            <li>螳夂捩邇・・菴弱＞驛ｨ鄂ｲ繧・・遞ｮ繧堤音螳壹＠縲∵隼蝟・ｭ悶ｒ遶区｡医〒縺阪∪縺・/li>
            <li>譌ｩ譛滄屬閨ｷ縺ｮ繝ｪ繧ｹ繧ｯ縺碁ｫ倥＞閨ｷ蜩｡繧剃ｺ句燕縺ｫ逋ｺ隕九＠縲√ヵ繧ｩ繝ｭ繝ｼ縺ｧ縺阪∪縺・/li>
            <li>荳紋ｻ｣繧・治逕ｨ遞ｮ蛻･縺ｫ繧医ｋ驕輔＞繧堤炊隗｣縺励√″繧∫ｴｰ縺九↑蟇ｾ蠢懊′蜿ｯ閭ｽ縺ｧ縺・/li>
            <li>螳夂捩譁ｽ遲悶・蜉ｹ譫懊ｒ螳夐㍼逧・↓貂ｬ螳壹＠縲￣DCA繧ｵ繧､繧ｯ繝ｫ繧貞屓縺帙∪縺・/li>
          </ul>
        </div>
      </div></div>
  );
}

export default function RetentionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RetentionPageContent />
    </Suspense>
  );
}