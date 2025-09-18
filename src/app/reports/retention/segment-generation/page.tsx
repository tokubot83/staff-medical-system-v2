'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import { exportToPDF } from '@/utils/pdfExport';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

const generationRetentionData = [
  { generation: '20莉｣', 螳夂捩邇・蟷ｴ: 75, 螳夂捩邇・蟷ｴ: 58, 螳夂捩邇・蟷ｴ: 45 },
  { generation: '30莉｣', 螳夂捩邇・蟷ｴ: 82, 螳夂捩邇・蟷ｴ: 68, 螳夂捩邇・蟷ｴ: 55 },
  { generation: '40莉｣', 螳夂捩邇・蟷ｴ: 88, 螳夂捩邇・蟷ｴ: 76, 螳夂捩邇・蟷ｴ: 65 },
  { generation: '50莉｣', 螳夂捩邇・蟷ｴ: 92, 螳夂捩邇・蟷ｴ: 85, 螳夂捩邇・蟷ｴ: 78 },
  { generation: '60莉｣', 螳夂捩邇・蟷ｴ: 95, 螳夂捩邇・蟷ｴ: 90, 螳夂捩邇・蟷ｴ: 85 },
];

const turnoverTimelineData = [
  { month: '3繝ｶ譛・, '20莉｣': 8, '30莉｣': 5, '40莉｣': 3, '50莉｣': 2, '60莉｣': 1 },
  { month: '6繝ｶ譛・, '20莉｣': 12, '30莉｣': 8, '40莉｣': 5, '50莉｣': 3, '60莉｣': 2 },
  { month: '1蟷ｴ', '20莉｣': 25, '30莉｣': 18, '40莉｣': 12, '50莉｣': 8, '60莉｣': 5 },
  { month: '2蟷ｴ', '20莉｣': 35, '30莉｣': 25, '40莉｣': 18, '50莉｣': 12, '60莉｣': 8 },
  { month: '3蟷ｴ', '20莉｣': 42, '30莉｣': 32, '40莉｣': 24, '50莉｣': 15, '60莉｣': 10 },
];

const generationFactors = [
  { factor: '邨ｦ荳主ｾ・∞', '20莉｣': 85, '30莉｣': 75, '40莉｣': 65, '50莉｣': 55, '60莉｣': 45 },
  { factor: '繧ｭ繝｣繝ｪ繧｢謌宣聞', '20莉｣': 90, '30莉｣': 80, '40莉｣': 60, '50莉｣': 40, '60莉｣': 30 },
  { factor: '繝ｯ繝ｼ繧ｯ繝ｩ繧､繝輔ヰ繝ｩ繝ｳ繧ｹ', '20莉｣': 70, '30莉｣': 85, '40莉｣': 90, '50莉｣': 80, '60莉｣': 75 },
  { factor: '閨ｷ蝣ｴ縺ｮ莠ｺ髢馴未菫・, '20莉｣': 75, '30莉｣': 70, '40莉｣': 75, '50莉｣': 80, '60莉｣': 85 },
  { factor: '莉穂ｺ九・繧・ｊ縺後＞', '20莉｣': 80, '30莉｣': 85, '40莉｣': 80, '50莉｣': 75, '60莉｣': 70 },
  { factor: '髮・畑縺ｮ螳牙ｮ壽ｧ', '20莉｣': 60, '30莉｣': 70, '40莉｣': 85, '50莉｣': 90, '60莉｣': 95 },
];

function SegmentGenerationContent() {
  const searchParams = useSearchParams();
  const facility = searchParams.get('facility') || '蜈ｨ譁ｽ險ｭ';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="荳紋ｻ｣蛻･螳夂捩蛯ｾ蜷大・譫・ />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              蟷ｴ鮨｢螻､蛻･縺ｮ騾閨ｷ繝代ち繝ｼ繝ｳ縺ｨ隕∝屏蛻・梵
            </h2>
            <span className="text-sm text-gray-500">
              蟇ｾ雎｡譁ｽ險ｭ: {facility}
            </span>
          </div>
          <p className="text-gray-600">
            蜷・ｸ紋ｻ｣縺ｮ螳夂捩邇・・驕輔＞縺ｨ縲∽ｸ紋ｻ｣縺斐→縺ｫ逡ｰ縺ｪ繧矩㍾隕悶☆繧玖ｦ∝屏繧貞・譫舌＠縲∽ｸ紋ｻ｣蛻･縺ｮ譛驕ｩ縺ｪ繝ｪ繝・Φ繧ｷ繝ｧ繝ｳ譁ｽ遲悶ｒ謠先｡医＠縺ｾ縺吶・          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              荳紋ｻ｣蛻･螳夂捩邇・ｯ碑ｼ・            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={generationRetentionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="generation" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Bar dataKey="螳夂捩邇・蟷ｴ" fill="#3B82F6" />
                <Bar dataKey="螳夂捩邇・蟷ｴ" fill="#10B981" />
                <Bar dataKey="螳夂捩邇・蟷ｴ" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              髮｢閨ｷ邇・・譎らｳｻ蛻玲耳遘ｻ
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={turnoverTimelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Line type="monotone" dataKey="20莉｣" stroke="#EF4444" strokeWidth={2} />
                <Line type="monotone" dataKey="30莉｣" stroke="#F59E0B" strokeWidth={2} />
                <Line type="monotone" dataKey="40莉｣" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="50莉｣" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="60莉｣" stroke="#6B7280" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            荳紋ｻ｣蛻･驥崎ｦ冶ｦ∝屏繝ｬ繝ｼ繝繝ｼ繝√Ε繝ｼ繝・          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['20莉｣', '30莉｣', '40莉｣'].map((generation) => (
              <div key={generation}>
                <h4 className="text-center font-medium text-gray-700 mb-2">{generation}</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={generationFactors}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="factor" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name={generation}
                      dataKey={generation}
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.6}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              荳紋ｻ｣蛻･縺ｮ迚ｹ蠕ｴ縺ｨ隱ｲ鬘・            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700">20莉｣・・荳紋ｻ｣繝ｻ繝溘Ξ繝九い繝ｫ荳紋ｻ｣・・/h4>
                <ul className="list-disc list-inside text-gray-600 text-sm mt-1 space-y-1">
                  <li>繧ｭ繝｣繝ｪ繧｢謌宣聞讖滉ｼ壹ｒ譛驥崎ｦ厄ｼ・0%・・/li>
                  <li>3蟷ｴ莉･蜀・・髮｢閨ｷ邇・′42%縺ｨ譛繧るｫ倥＞</li>
                  <li>霆｢閨ｷ縺ｫ蟇ｾ縺吶ｋ謚ｵ謚玲─縺御ｽ弱＞</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">30莉｣・医Α繝ｬ繝九い繝ｫ荳紋ｻ｣・・/h4>
                <ul className="list-disc list-inside text-gray-600 text-sm mt-1 space-y-1">
                  <li>繝ｯ繝ｼ繧ｯ繝ｩ繧､繝輔ヰ繝ｩ繝ｳ繧ｹ繧帝㍾隕厄ｼ・5%・・/li>
                  <li>蟄占ご縺ｦ荳紋ｻ｣縺ｨ縺励※譟碑ｻ溘↑蜒阪″譁ｹ繧呈ｱゅａ繧・/li>
                  <li>繧ｭ繝｣繝ｪ繧｢繧｢繝・・縺ｨ螳ｶ蠎ｭ縺ｮ荳｡遶九′隱ｲ鬘・/li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">40莉｣莉･荳奇ｼ・荳紋ｻ｣繝ｻ繝吶ン繝ｼ繝悶・繝槭・・・/h4>
                <ul className="list-disc list-inside text-gray-600 text-sm mt-1 space-y-1">
                  <li>髮・畑縺ｮ螳牙ｮ壽ｧ繧帝㍾隕厄ｼ・5-95%・・/li>
                  <li>螳夂捩邇・′鬮倥￥縲∫ｵ・ｹ斐・荳ｭ譬ｸ繧呈球縺・/li>
                  <li>謚陦灘､牙喧縺ｸ縺ｮ驕ｩ蠢懈髪謠ｴ縺悟ｿ・ｦ・/li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              荳紋ｻ｣蛻･繝ｪ繝・Φ繧ｷ繝ｧ繝ｳ譁ｽ遲匁署譯・            </h3>
            <div className="space-y-4">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-3">
                <h4 className="font-semibold text-blue-800">20莉｣蜷代￠譁ｽ遲・/h4>
                <ul className="list-disc list-inside text-blue-700 text-sm mt-1 space-y-1">
                  <li>譏守｢ｺ縺ｪ繧ｭ繝｣繝ｪ繧｢繝代せ縺ｮ謠千､ｺ</li>
                  <li>繝｡繝ｳ繧ｿ繝ｼ蛻ｶ蠎ｦ縺ｮ蜈・ｮ・/li>
                  <li>遉ｾ螟也比ｿｮ繝ｻ雉・ｼ蜿門ｾ玲髪謠ｴ</li>
                </ul>
              </div>
              <div className="bg-green-50 border-l-4 border-green-400 p-3">
                <h4 className="font-semibold text-green-800">30莉｣蜷代￠譁ｽ遲・/h4>
                <ul className="list-disc list-inside text-green-700 text-sm mt-1 space-y-1">
                  <li>繝輔Ξ繝・け繧ｹ繧ｿ繧､繝繝ｻ繝ｪ繝｢繝ｼ繝医Ρ繝ｼ繧ｯ蟆主・</li>
                  <li>閧ｲ蜈先髪謠ｴ蛻ｶ蠎ｦ縺ｮ諡｡蜈・/li>
                  <li>譎ら洒蜍､蜍吶・譟碑ｻ溘↑驕狗畑</li>
                </ul>
              </div>
              <div className="bg-purple-50 border-l-4 border-purple-400 p-3">
                <h4 className="font-semibold text-purple-800">40莉｣莉･荳雁髄縺第命遲・/h4>
                <ul className="list-disc list-inside text-purple-700 text-sm mt-1 space-y-1">
                  <li>繧ｹ繧ｭ繝ｫ繧｢繝・・遐比ｿｮ縺ｮ謠蝉ｾ・/li>
                  <li>蛛･蠎ｷ邂｡逅・・繝ｭ繧ｰ繝ｩ繝縺ｮ蜈・ｮ・/li>
                  <li>螳壼ｹｴ蠕後・蜀埼寐逕ｨ蛻ｶ蠎ｦ謨ｴ蛯・/li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* 繧｢繧ｯ繧ｷ繝ｧ繝ｳ繝懊ち繝ｳ */}
        <div className="flex gap-4 mt-8">
          <button 
            onClick={() => exportToPDF({
              title: '荳紋ｻ｣蛻･螳夂捩蛯ｾ蜷大・譫舌Ξ繝昴・繝・,
              facility: facility,
              reportType: 'segment-generation',
              elementId: 'report-content',
              dateRange: new Date().toLocaleDateString('ja-JP')
            })}
            className="pdf-exclude bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            PDF繝繧ｦ繝ｳ繝ｭ繝ｼ繝・          </button>
          <button className="pdf-exclude bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition">
            Excel繧ｨ繧ｯ繧ｹ繝昴・繝・          </button>
        </div>
      </div><CategoryTopButton categoryPath="/reports?tab=retention" categoryName="螳夂捩蛻・梵" /></div>
  );
}

export default function SegmentGenerationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <SegmentGenerationContent />
    </Suspense>
  );
}