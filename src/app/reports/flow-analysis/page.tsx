'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import FacilitySelector from '@/components/reports/FacilitySelector';
import CommonHeader from '@/components/CommonHeader';
import CategoryReportCard from '@/components/reports/CategoryReportCard';

export default function FlowAnalysisCategoryPage() {
  const router = useRouter();
  const [selectedFacility, setSelectedFacility] = useState('');

  const reports = [
    {
      id: 'department-flow',
      title: '驛ｨ鄂ｲ髢鍋焚蜍輔ヵ繝ｭ繝ｼ',
      description: '驛ｨ鄂ｲ髢薙・莠ｺ譚千ｧｻ蜍輔ヱ繧ｿ繝ｼ繝ｳ繧貞庄隕門喧縺励∫ｵ・ｹ泌・縺ｮ莠ｺ譚先ｵ∝虚諤ｧ繧貞・譫・,
      icon: '売',
      gradient: 'from-indigo-500 to-purple-500',
      path: '/reports/flow-analysis/department-flow',
      features: [
        'Sankey繝繧､繧｢繧ｰ繝ｩ繝縺ｫ繧医ｋ蜿ｯ隕門喧',
        '驛ｨ鄂ｲ蛻･縺ｮ豬∝・繝ｻ豬∝・邨ｱ險・,
        '逡ｰ蜍輔ヱ繧ｿ繝ｼ繝ｳ縺ｮ蛯ｾ蜷大・譫・
      ]
    },
    {
      id: 'career-path',
      title: '繧ｭ繝｣繝ｪ繧｢繝代せ蛻・梵',
      description: '閨ｷ蜩｡縺ｮ繧ｭ繝｣繝ｪ繧｢蠖｢謌舌ヱ繧ｿ繝ｼ繝ｳ繧貞・譫舌＠縲∝柑譫懃噪縺ｪ繧ｭ繝｣繝ｪ繧｢髢狗匱繧呈髪謠ｴ',
      icon: '嶋',
      gradient: 'from-green-500 to-teal-500',
      path: '/reports/flow-analysis/career-path',
      features: [
        '蜈ｸ蝙狗噪縺ｪ繧ｭ繝｣繝ｪ繧｢繝代せ縺ｮ迚ｹ螳・,
        '譏・ｲ繝ｻ譏・ｼ繝代ち繝ｼ繝ｳ縺ｮ蛻・梵',
        '繧ｭ繝｣繝ｪ繧｢蛛懈ｻ槭Μ繧ｹ繧ｯ縺ｮ讀懷・'
      ]
    },
    {
      id: 'mobility-matrix',
      title: '莠ｺ譚舌Δ繝薙Μ繝・ぅ繝槭ヨ繝ｪ繝・け繧ｹ',
      description: '閨ｷ菴阪・閨ｷ遞ｮ髢薙・遘ｻ蜍募庄閭ｽ諤ｧ繧定ｩ穂ｾ｡縺励∵姶逡･逧・↑莠ｺ譚宣・鄂ｮ繧呈髪謠ｴ',
      icon: '投',
      gradient: 'from-orange-500 to-red-500',
      path: '/reports/flow-analysis/mobility-matrix',
      features: [
        '閨ｷ菴阪・閨ｷ遞ｮ髢薙・遘ｻ蜍募ｮ溽ｸｾ',
        '繧ｹ繧ｭ繝ｫ霆｢謠帙・蜿ｯ閭ｽ諤ｧ隧穂ｾ｡',
        '譛驕ｩ驟咲ｽｮ縺ｮ謠先｡・
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
      <CommonHeader title="莠ｺ譚舌ヵ繝ｭ繝ｼ蛻・梵" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 繧ｫ繝・ざ繝ｪ繝ｼ隱ｬ譏・*/}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">売</span>
            <h1 className="text-2xl font-bold text-gray-900">莠ｺ譚舌ヵ繝ｭ繝ｼ蛻・梵</h1>
          </div>
          <p className="text-gray-600">
            邨・ｹ泌・縺ｮ莠ｺ譚舌・蜍輔″繧貞､夊ｧ堤噪縺ｫ蛻・梵縺励∝柑譫懃噪縺ｪ莠ｺ譚宣・鄂ｮ縺ｨ繧ｭ繝｣繝ｪ繧｢髢狗匱繧呈髪謠ｴ縺励∪縺吶・
            驛ｨ鄂ｲ髢薙・逡ｰ蜍輔ヱ繧ｿ繝ｼ繝ｳ縲√く繝｣繝ｪ繧｢繝代せ縺ｮ蛯ｾ蜷代∽ｺｺ譚舌・豬∝虚諤ｧ縺ｪ縺ｩ繧貞庄隕門喧縺励・
            邨・ｹ斐・豢ｻ諤ｧ蛹悶→閨ｷ蜩｡縺ｮ謌宣聞繧剃ｿ・ｲ縺吶ｋ譁ｽ遲也ｫ区｡医↓豢ｻ逕ｨ縺ｧ縺阪∪縺吶・
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
            莠ｺ譚先ｵ∝虚諤ｧ繧｢繧ｻ繧ｹ繝｡繝ｳ繝・
          </h3>
          
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="text-blue-800 mb-3">
              <span className="font-medium">謗ｨ螂ｨ繝輔Ο繝ｼ・・/span>
              驛ｨ鄂ｲ髢薙ヵ繝ｭ繝ｼ 竊・繧ｭ繝｣繝ｪ繧｢繝代せ蛻・梵 竊・繝｢繝薙Μ繝・ぅ繝槭ヨ繝ｪ繝・け繧ｹ
            </div>
            <ul className="list-disc list-inside text-blue-700 space-y-1">
              <li>邨・ｹ泌・縺ｮ莠ｺ譚千ｧｻ蜍輔ヱ繧ｿ繝ｼ繝ｳ謚頑升</li>
              <li>繧ｭ繝｣繝ｪ繧｢謌宣聞邨瑚ｷｯ縺ｮ蜿ｯ隕門喧</li>
              <li>逡ｰ蜍輔↓繧医ｋ閭ｽ蜉幃幕逋ｺ蜉ｹ譫・/li>
              <li>驕ｩ譚宣←謇縺ｮ螳溽樟蠎ｦ隧穂ｾ｡</li>
            </ul>
          </div>

          <div className="mt-4 text-blue-800 text-sm">
            <p className="font-medium">
              莠ｺ譚舌ヵ繝ｭ繝ｼ縺ｮ蛻・梵縺ｫ繧医ｊ縲∫ｵ・ｹ斐・豢ｻ諤ｧ蛹悶→閨ｷ蜩｡縺ｮ謌宣聞讖滉ｼ壹・蜑ｵ蜃ｺ繧貞ｮ溽樟縺ｧ縺阪∪縺吶・
            </p>
          </div>
        </div>
      </div></div>
  );
}