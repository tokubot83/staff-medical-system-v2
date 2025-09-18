'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import { exportToPDF } from '@/utils/pdfExport';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  ComposedChart,
  Area
} from 'recharts';

const interventionEffects = [
  { 
    month: '2023蟷ｴ1譛・, 
    螳夂捩邇・ 78, 
    譁ｽ遲門燕蟷ｳ蝮・ 75,
    intervention: '繝｡繝ｳ繧ｿ繝ｼ蛻ｶ蠎ｦ蟆主・',
    effect: '+3%'
  },
  { 
    month: '2023蟷ｴ4譛・, 
    螳夂捩邇・ 82, 
    譁ｽ遲門燕蟷ｳ蝮・ 75,
    intervention: '繧ｪ繝ｳ繝懊・繝・ぅ繝ｳ繧ｰ謾ｹ蝟・,
    effect: '+7%'
  },
  { 
    month: '2023蟷ｴ7譛・, 
    螳夂捩邇・ 85, 
    譁ｽ遲門燕蟷ｳ蝮・ 75,
    intervention: '遖丞茜蜴夂函諡｡蜈・,
    effect: '+10%'
  },
  { 
    month: '2023蟷ｴ10譛・, 
    螳夂捩邇・ 88, 
    譁ｽ遲門燕蟷ｳ蝮・ 75,
    intervention: '繧ｭ繝｣繝ｪ繧｢謾ｯ謠ｴ蠑ｷ蛹・,
    effect: '+13%'
  },
  { 
    month: '2024蟷ｴ1譛・, 
    螳夂捩邇・ 90, 
    譁ｽ遲門燕蟷ｳ蝮・ 75,
    intervention: '邨ｦ荳惹ｽ鍋ｳｻ隕狗峩縺・,
    effect: '+15%'
  },
];

const departmentEffects = [
  { department: '逵玖ｭｷ驛ｨ', 譁ｽ遲門燕: 70, 繝｡繝ｳ繧ｿ繝ｼ蛻ｶ蠎ｦ: 75, 繧ｪ繝ｳ繝懊・繝・ぅ繝ｳ繧ｰ: 80, 遖丞茜蜴夂函: 83, 繧ｭ繝｣繝ｪ繧｢謾ｯ謠ｴ: 85 },
  { department: '繝ｪ繝上ン繝ｪ驛ｨ', 譁ｽ遲門燕: 75, 繝｡繝ｳ繧ｿ繝ｼ蛻ｶ蠎ｦ: 78, 繧ｪ繝ｳ繝懊・繝・ぅ繝ｳ繧ｰ: 82, 遖丞茜蜴夂函: 85, 繧ｭ繝｣繝ｪ繧｢謾ｯ謠ｴ: 88 },
  { department: '阮ｬ蜑､驛ｨ', 譁ｽ遲門燕: 72, 繝｡繝ｳ繧ｿ繝ｼ蛻ｶ蠎ｦ: 76, 繧ｪ繝ｳ繝懊・繝・ぅ繝ｳ繧ｰ: 81, 遖丞茜蜴夂函: 84, 繧ｭ繝｣繝ｪ繧｢謾ｯ謠ｴ: 87 },
  { department: '莠句漁驛ｨ', 譁ｽ遲門燕: 78, 繝｡繝ｳ繧ｿ繝ｼ蛻ｶ蠎ｦ: 81, 繧ｪ繝ｳ繝懊・繝・ぅ繝ｳ繧ｰ: 85, 遖丞茜蜴夂函: 88, 繧ｭ繝｣繝ｪ繧｢謾ｯ謠ｴ: 90 },
];

const costBenefitAnalysis = [
  { 
    譁ｽ遲・ '繝｡繝ｳ繧ｿ繝ｼ蛻ｶ蠎ｦ',
    謚戊ｳ・｡・ 500,
    蜑頑ｸ帙さ繧ｹ繝・ 1200,
    ROI: 140,
    蜉ｹ譫・ '螳夂捩邇・5%'
  },
  { 
    譁ｽ遲・ '繧ｪ繝ｳ繝懊・繝・ぅ繝ｳ繧ｰ謾ｹ蝟・,
    謚戊ｳ・｡・ 800,
    蜑頑ｸ帙さ繧ｹ繝・ 2000,
    ROI: 150,
    蜉ｹ譫・ '螳夂捩邇・7%'
  },
  { 
    譁ｽ遲・ '遖丞茜蜴夂函諡｡蜈・,
    謚戊ｳ・｡・ 1500,
    蜑頑ｸ帙さ繧ｹ繝・ 2800,
    ROI: 87,
    蜉ｹ譫・ '螳夂捩邇・8%'
  },
  { 
    譁ｽ遲・ '繧ｭ繝｣繝ｪ繧｢謾ｯ謠ｴ蠑ｷ蛹・,
    謚戊ｳ・｡・ 1000,
    蜑頑ｸ帙さ繧ｹ繝・ 2500,
    ROI: 150,
    蜉ｹ譫・ '螳夂捩邇・10%'
  },
];

const timelineData = [
  { phase: '蟆主・蜑・, 髮｢閨ｷ邇・ 25, 螳夂捩邇・ 75, 貅雜ｳ蠎ｦ: 65 },
  { phase: '蟆主・3繝ｶ譛・, 髮｢閨ｷ邇・ 22, 螳夂捩邇・ 78, 貅雜ｳ蠎ｦ: 70 },
  { phase: '蟆主・6繝ｶ譛・, 髮｢閨ｷ邇・ 18, 螳夂捩邇・ 82, 貅雜ｳ蠎ｦ: 75 },
  { phase: '蟆主・9繝ｶ譛・, 髮｢閨ｷ邇・ 15, 螳夂捩邇・ 85, 貅雜ｳ蠎ｦ: 80 },
  { phase: '蟆主・12繝ｶ譛・, 髮｢閨ｷ邇・ 10, 螳夂捩邇・ 90, 貅雜ｳ蠎ｦ: 85 },
];

function CohortInterventionEffectContent() {
  const searchParams = useSearchParams();
  const facility = searchParams.get('facility') || '蜈ｨ譁ｽ險ｭ';
  const [selectedMetric, setSelectedMetric] = useState('螳夂捩邇・);

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="繝ｪ繝・Φ繧ｷ繝ｧ繝ｳ譁ｽ遲門柑譫懈ｸｬ螳・ />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              蜷・ｨｮ譁ｽ遲門ｮ滓命蜑榊ｾ後〒縺ｮ螳夂捩邇・隼蝟・柑譫懈ｸｬ螳・
            </h2>
            <span className="text-sm text-gray-500">
              蟇ｾ雎｡譁ｽ險ｭ: {facility}
            </span>
          </div>
          <p className="text-gray-600">
            螳滓命縺励◆蜷・ｨｮ繝ｪ繝・Φ繧ｷ繝ｧ繝ｳ譁ｽ遲悶・蜉ｹ譫懊ｒ螳夐㍼逧・↓貂ｬ螳壹＠縲∵兜雉・ｯｾ蜉ｹ譫懶ｼ・OI・峨ｒ蛻・梵縺励∪縺吶・
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            譁ｽ遲門ｰ主・縺ｫ繧医ｋ螳夂捩邇・隼蝟・耳遘ｻ
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={interventionEffects}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[70, 95]} />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="譁ｽ遲門燕蟷ｳ蝮・
                fill="#FEE2E2"
                stroke="#EF4444"
                strokeDasharray="5 5"
                name="譁ｽ遲門燕蟷ｳ蝮・
              />
              <Line
                type="monotone"
                dataKey="螳夂捩邇・
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: '#3B82F6', r: 6 }}
                name="螳滄圀縺ｮ螳夂捩邇・
              />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2">
            {interventionEffects.map((item, index) => (
              <div key={index} className="bg-gray-50 p-2 rounded text-center">
                <p className="text-xs text-gray-600">{item.intervention}</p>
                <p className="text-sm font-semibold text-green-600">{item.effect}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              驛ｨ鄂ｲ蛻･譁ｽ遲門柑譫・
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentEffects}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis domain={[60, 100]} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Bar dataKey="譁ｽ遲門燕" fill="#EF4444" />
                <Bar dataKey="繝｡繝ｳ繧ｿ繝ｼ蛻ｶ蠎ｦ" fill="#F59E0B" />
                <Bar dataKey="繧ｪ繝ｳ繝懊・繝・ぅ繝ｳ繧ｰ" fill="#3B82F6" />
                <Bar dataKey="遖丞茜蜴夂函" fill="#10B981" />
                <Bar dataKey="繧ｭ繝｣繝ｪ繧｢謾ｯ謠ｴ" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              譁ｽ遲門ｰ主・蠕後・邱丞粋謖・ｨ呎耳遘ｻ
            </h3>
            <div className="mb-4">
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="螳夂捩邇・>螳夂捩邇・/option>
                <option value="髮｢閨ｷ邇・>髮｢閨ｷ邇・/option>
                <option value="貅雜ｳ蠎ｦ">貅雜ｳ蠎ｦ</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="phase" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Line
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            雋ｻ逕ｨ蟇ｾ蜉ｹ譫懷・譫撰ｼ・OI・・
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    譁ｽ遲門錐
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    謚戊ｳ・｡搾ｼ井ｸ・・・・
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    蜑頑ｸ帙さ繧ｹ繝茨ｼ井ｸ・・・・
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ROI・・・・
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    蜉ｹ譫・
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {costBenefitAnalysis.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.譁ｽ遲凡
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(item.謚戊ｳ・｡・?? 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(item.蜑頑ｸ帙さ繧ｹ繝・?? 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`font-semibold ${item.ROI > 100 ? 'text-green-600' : 'text-yellow-600'}`}>
                        {item.ROI}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.蜉ｹ譫怡
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-4 bg-green-50 rounded">
            <p className="text-sm text-green-800">
              <strong>邱丞粋隧穂ｾ｡・・/strong>蜈ｨ譁ｽ遲悶・蟷ｳ蝮⑲OI縺ｯ131.75%縺ｧ縲∵兜雉・｡阪↓蟇ｾ縺励※鬮倥＞繝ｪ繧ｿ繝ｼ繝ｳ繧貞ｮ溽樟縲・
              迚ｹ縺ｫ繧ｭ繝｣繝ｪ繧｢謾ｯ謠ｴ蠑ｷ蛹悶→繧ｪ繝ｳ繝懊・繝・ぅ繝ｳ繧ｰ謾ｹ蝟・′鬮倥＞雋ｻ逕ｨ蟇ｾ蜉ｹ譫懊ｒ遉ｺ縺励※縺・∪縺吶・
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              謌仙粥隕∝屏蛻・梵
            </h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-semibold text-sm">1</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">谿ｵ髫守噪縺ｪ譁ｽ遲門ｰ主・</p>
                  <p className="text-sm text-gray-600">蜉ｹ譫懊ｒ遒ｺ隱阪＠縺ｪ縺後ｉ谺｡縺ｮ譁ｽ遲悶ｒ蟆主・</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-semibold text-sm">2</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">繝・・繧ｿ繝峨Μ繝悶Φ縺ｪ謾ｹ蝟・/p>
                  <p className="text-sm text-gray-600">螳夐㍼逧・↑蜉ｹ譫懈ｸｬ螳壹↓蝓ｺ縺･縺乗怙驕ｩ蛹・/p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-semibold text-sm">3</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">迴ｾ蝣ｴ縺ｨ縺ｮ騾｣謳ｺ</p>
                  <p className="text-sm text-gray-600">驛ｨ鄂ｲ縺斐→縺ｮ繝九・繧ｺ縺ｫ蜷医ｏ縺帙◆譁ｽ遲冶ｪｿ謨ｴ</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              莉雁ｾ後・謗ｨ螂ｨ譁ｽ遲・
            </h3>
            <div className="space-y-3">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-3">
                <h4 className="font-semibold text-blue-800 text-sm">AI莠域ｸｬ繝｢繝・Ν蟆主・</h4>
                <p className="text-blue-700 text-sm mt-1">
                  髮｢閨ｷ繝ｪ繧ｹ繧ｯ縺ｮ譌ｩ譛溽匱隕九↓繧医ｋ莠磯亟逧・ｻ句・
                </p>
              </div>
              <div className="bg-purple-50 border-l-4 border-purple-400 p-3">
                <h4 className="font-semibold text-purple-800 text-sm">繝代・繧ｽ繝翫Λ繧､繧ｺ繝画髪謠ｴ</h4>
                <p className="text-purple-700 text-sm mt-1">
                  蛟倶ｺｺ縺ｮ繝九・繧ｺ縺ｫ蠢懊§縺溘き繧ｹ繧ｿ繝槭う繧ｺ蝙区髪謠ｴ
                </p>
              </div>
              <div className="bg-green-50 border-l-4 border-green-400 p-3">
                <h4 className="font-semibold text-green-800 text-sm">髟ｷ譛溘う繝ｳ繧ｻ繝ｳ繝・ぅ繝・/h4>
                <p className="text-green-700 text-sm mt-1">
                  蜍､邯壼ｹｴ謨ｰ縺ｫ蠢懊§縺滓ｮｵ髫守噪縺ｪ蝣ｱ驟ｬ蛻ｶ蠎ｦ
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* 繧｢繧ｯ繧ｷ繝ｧ繝ｳ繝懊ち繝ｳ */}
        <div className="flex gap-4 mt-8">
          <button 
            onClick={() => exportToPDF({
              title: '繧ｳ繝帙・繝亥・譫撰ｼ井ｻ句・蜉ｹ譫懶ｼ峨Ξ繝昴・繝・,
              facility: facility,
              reportType: 'cohort-intervention-effect',
              elementId: 'report-content',
              dateRange: new Date().toLocaleDateString('ja-JP')
            })}
            className="pdf-exclude bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            PDF繝繧ｦ繝ｳ繝ｭ繝ｼ繝・
          </button>
          <button className="pdf-exclude bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition">
            Excel繧ｨ繧ｯ繧ｹ繝昴・繝・
          </button>
        </div>
      </div><CategoryTopButton categoryPath="/reports?tab=retention" categoryName="螳夂捩蛻・梵" /></div>
  );
}

export default function CohortInterventionEffectPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <CohortInterventionEffectContent />
    </Suspense>
  );
}