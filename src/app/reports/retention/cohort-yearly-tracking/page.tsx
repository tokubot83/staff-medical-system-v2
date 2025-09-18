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
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';

const cohortData = [
  { year: '1蟷ｴ逶ｮ', '2020蟷ｴ蜈･遉ｾ': 100, '2021蟷ｴ蜈･遉ｾ': 100, '2022蟷ｴ蜈･遉ｾ': 100, '2023蟷ｴ蜈･遉ｾ': 100, '2024蟷ｴ蜈･遉ｾ': 100 },
  { year: '2蟷ｴ逶ｮ', '2020蟷ｴ蜈･遉ｾ': 85, '2021蟷ｴ蜈･遉ｾ': 88, '2022蟷ｴ蜈･遉ｾ': 90, '2023蟷ｴ蜈･遉ｾ': 92, '2024蟷ｴ蜈･遉ｾ': null },
  { year: '3蟷ｴ逶ｮ', '2020蟷ｴ蜈･遉ｾ': 78, '2021蟷ｴ蜈･遉ｾ': 82, '2022蟷ｴ蜈･遉ｾ': 85, '2023蟷ｴ蜈･遉ｾ': null, '2024蟷ｴ蜈･遉ｾ': null },
  { year: '4蟷ｴ逶ｮ', '2020蟷ｴ蜈･遉ｾ': 72, '2021蟷ｴ蜈･遉ｾ': 76, '2022蟷ｴ蜈･遉ｾ': null, '2023蟷ｴ蜈･遉ｾ': null, '2024蟷ｴ蜈･遉ｾ': null },
  { year: '5蟷ｴ逶ｮ', '2020蟷ｴ蜈･遉ｾ': 68, '2021蟷ｴ蜈･遉ｾ': null, '2022蟷ｴ蜈･遉ｾ': null, '2023蟷ｴ蜈･遉ｾ': null, '2024蟷ｴ蜈･遉ｾ': null },
];

const improvementData = [
  { metric: '繧ｪ繝ｳ繝懊・繝・ぅ繝ｳ繧ｰ謾ｹ蝟・, '2020蟷ｴ': 0, '2021蟷ｴ': 15, '2022蟷ｴ': 25, '2023蟷ｴ': 35, '2024蟷ｴ': 45 },
  { metric: '繝｡繝ｳ繧ｿ繝ｼ蛻ｶ蠎ｦ蟆主・', '2020蟷ｴ': 0, '2021蟷ｴ': 0, '2022蟷ｴ': 20, '2023蟷ｴ': 30, '2024蟷ｴ': 40 },
  { metric: '遖丞茜蜴夂函蜈・ｮ・, '2020蟷ｴ': 0, '2021蟷ｴ': 10, '2022蟷ｴ': 15, '2023蟷ｴ': 25, '2024蟷ｴ': 30 },
  { metric: '繧ｭ繝｣繝ｪ繧｢謾ｯ謠ｴ蠑ｷ蛹・, '2020蟷ｴ': 0, '2021蟷ｴ': 5, '2022蟷ｴ': 15, '2023蟷ｴ': 20, '2024蟷ｴ': 35 },
];

const departmentCohortData: Record<string, Array<{ year: string; value: number }>> = {
  逵玖ｭｷ驛ｨ: [
    { year: '1蟷ｴ逶ｮ', value: 100 },
    { year: '2蟷ｴ逶ｮ', value: 82 },
    { year: '3蟷ｴ逶ｮ', value: 75 },
    { year: '4蟷ｴ逶ｮ', value: 68 },
    { year: '5蟷ｴ逶ｮ', value: 62 },
  ],
  繝ｪ繝上ン繝ｪ驛ｨ: [
    { year: '1蟷ｴ逶ｮ', value: 100 },
    { year: '2蟷ｴ逶ｮ', value: 88 },
    { year: '3蟷ｴ逶ｮ', value: 82 },
    { year: '4蟷ｴ逶ｮ', value: 76 },
    { year: '5蟷ｴ逶ｮ', value: 72 },
  ],
  阮ｬ蜑､驛ｨ: [
    { year: '1蟷ｴ逶ｮ', value: 100 },
    { year: '2蟷ｴ逶ｮ', value: 90 },
    { year: '3蟷ｴ逶ｮ', value: 85 },
    { year: '4蟷ｴ逶ｮ', value: 80 },
    { year: '5蟷ｴ逶ｮ', value: 75 },
  ],
  莠句漁驛ｨ: [
    { year: '1蟷ｴ逶ｮ', value: 100 },
    { year: '2蟷ｴ逶ｮ', value: 92 },
    { year: '3蟷ｴ逶ｮ', value: 88 },
    { year: '4蟷ｴ逶ｮ', value: 84 },
    { year: '5蟷ｴ逶ｮ', value: 80 },
  ],
};

const retentionMilestones = [
  { cohort: '2020蟷ｴ蜈･遉ｾ', '3繝ｶ譛・: 92, '6繝ｶ譛・: 88, '1蟷ｴ': 85, '2蟷ｴ': 78, '3蟷ｴ': 72 },
  { cohort: '2021蟷ｴ蜈･遉ｾ', '3繝ｶ譛・: 94, '6繝ｶ譛・: 90, '1蟷ｴ': 88, '2蟷ｴ': 82, '3蟷ｴ': 76 },
  { cohort: '2022蟷ｴ蜈･遉ｾ', '3繝ｶ譛・: 96, '6繝ｶ譛・: 93, '1蟷ｴ': 90, '2蟷ｴ': 85, '3蟷ｴ': null },
  { cohort: '2023蟷ｴ蜈･遉ｾ', '3繝ｶ譛・: 97, '6繝ｶ譛・: 95, '1蟷ｴ': 92, '2蟷ｴ': null, '3蟷ｴ': null },
  { cohort: '2024蟷ｴ蜈･遉ｾ', '3繝ｶ譛・: 98, '6繝ｶ譛・: 96, '1蟷ｴ': null, '2蟷ｴ': null, '3蟷ｴ': null },
];

function CohortYearlyTrackingContent() {
  const searchParams = useSearchParams();
  const facility = searchParams.get('facility') || '蜈ｨ譁ｽ險ｭ';
  const [selectedDepartment, setSelectedDepartment] = useState('逵玖ｭｷ驛ｨ');

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="蜈･遉ｾ蟷ｴ蠎ｦ蛻･繧ｳ繝帙・繝郁ｿｽ霍｡" />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              蜷・治逕ｨ蟷ｴ谺｡縺ｮ螳夂捩迥ｶ豕・聞譛溯ｿｽ霍｡蛻・梵
            </h2>
            <span className="text-sm text-gray-500">
              蟇ｾ雎｡譁ｽ險ｭ: {facility}
            </span>
          </div>
          <p className="text-gray-600">
            蜷・治逕ｨ蟷ｴ谺｡縺ｮ繧ｳ繝帙・繝医ｒ髟ｷ譛溽噪縺ｫ霑ｽ霍｡縺励∵命遲悶・蜉ｹ譫懊ｄ螳夂捩邇・・謾ｹ蝟・だ蜷代ｒ蜿ｯ隕門喧縺励∪縺吶・          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            蜈･遉ｾ蟷ｴ蠎ｦ蛻･螳夂捩邇・耳遘ｻ
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={cohortData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis domain={[60, 100]} />
              <Tooltip formatter={(value) => value !== null ? `${value}%` : '繝・・繧ｿ縺ｪ縺・} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="2020蟷ｴ蜈･遉ｾ" 
                stroke="#8B5CF6" 
                strokeWidth={2}
                connectNulls={false}
              />
              <Line 
                type="monotone" 
                dataKey="2021蟷ｴ蜈･遉ｾ" 
                stroke="#3B82F6" 
                strokeWidth={2}
                connectNulls={false}
              />
              <Line 
                type="monotone" 
                dataKey="2022蟷ｴ蜈･遉ｾ" 
                stroke="#10B981" 
                strokeWidth={2}
                connectNulls={false}
              />
              <Line 
                type="monotone" 
                dataKey="2023蟷ｴ蜈･遉ｾ" 
                stroke="#F59E0B" 
                strokeWidth={2}
                connectNulls={false}
              />
              <Line 
                type="monotone" 
                dataKey="2024蟷ｴ蜈･遉ｾ" 
                stroke="#EF4444" 
                strokeWidth={2}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 p-4 bg-blue-50 rounded">
            <p className="text-sm text-blue-800">
              <strong>蛻・梵邨先棡・・/strong>2021蟷ｴ莉･髯阪・蜈･遉ｾ繧ｳ繝帙・繝医〒螳夂捩邇・・謾ｹ蝟・′鬘戊送縺ｫ隕九ｉ繧後∪縺吶・              迚ｹ縺ｫ2蟷ｴ逶ｮ縺ｮ螳夂捩邇・′2020蟷ｴ蜈･遉ｾ縺ｮ85%縺九ｉ2023蟷ｴ蜈･遉ｾ縺ｮ92%縺ｸ縺ｨ7繝昴う繝ｳ繝域隼蝟・＠縺ｦ縺・∪縺吶・            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              驥崎ｦ√・繧､繝ｫ繧ｹ繝医・繝ｳ螳夂捩邇・            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={retentionMilestones}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="cohort" angle={-45} textAnchor="end" height={80} />
                <YAxis domain={[60, 100]} />
                <Tooltip formatter={(value) => value !== null ? `${value}%` : '繝・・繧ｿ縺ｪ縺・} />
                <Legend />
                <Bar dataKey="3繝ｶ譛・ fill="#3B82F6" />
                <Bar dataKey="1蟷ｴ" fill="#10B981" />
                <Bar dataKey="3蟷ｴ" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              譁ｽ遲門ｰ主・蜉ｹ譫懊・謗ｨ遘ｻ
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={improvementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="metric" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value) => `${value}%謾ｹ蝟Я} />
                <Legend />
                <Area type="monotone" dataKey="2021蟷ｴ" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" />
                <Area type="monotone" dataKey="2022蟷ｴ" stackId="1" stroke="#3B82F6" fill="#3B82F6" />
                <Area type="monotone" dataKey="2023蟷ｴ" stackId="1" stroke="#10B981" fill="#10B981" />
                <Area type="monotone" dataKey="2024蟷ｴ" stackId="1" stroke="#F59E0B" fill="#F59E0B" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              驛ｨ鄂ｲ蛻･繧ｳ繝帙・繝亥・譫・            </h3>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.keys(departmentCohortData).map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={departmentCohortData[selectedDepartment]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis domain={[50, 100]} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              繧ｳ繝帙・繝亥挨縺ｮ迚ｹ蠕ｴ蛻・梵
            </h3>
            <div className="space-y-3">
              <div className="border-l-4 border-purple-400 pl-4">
                <h4 className="font-semibold text-gray-700">2020-2021蟷ｴ蜈･遉ｾ</h4>
                <p className="text-sm text-gray-600">COVID-19蠖ｱ髻ｿ荳九〒縺ｮ謗｡逕ｨ縲ゅΜ繝｢繝ｼ繝医が繝ｳ繝懊・繝・ぅ繝ｳ繧ｰ縺ｮ隱ｲ鬘後′螳夂捩邇・↓蠖ｱ髻ｿ</p>
              </div>
              <div className="border-l-4 border-blue-400 pl-4">
                <h4 className="font-semibold text-gray-700">2022蟷ｴ蜈･遉ｾ</h4>
                <p className="text-sm text-gray-600">繝｡繝ｳ繧ｿ繝ｼ蛻ｶ蠎ｦ蟆主・縺ｫ繧医ｊ縲∝・譛溷ｮ夂捩邇・′螟ｧ蟷・隼蝟・/p>
              </div>
              <div className="border-l-4 border-green-400 pl-4">
                <h4 className="font-semibold text-gray-700">2023-2024蟷ｴ蜈･遉ｾ</h4>
                <p className="text-sm text-gray-600">蛹・峡逧・↑螳夂捩謾ｯ謠ｴ繝励Ο繧ｰ繝ｩ繝縺ｫ繧医ｊ縲・℃蜴ｻ譛鬮倥・螳夂捩邇・ｒ險倬鹸</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              莉雁ｾ後・謾ｹ蝟・署譯・            </h3>
            <div className="space-y-3">
              <div className="bg-blue-50 p-3 rounded">
                <h4 className="font-semibold text-blue-800 text-sm">遏ｭ譛滂ｼ・繝ｶ譛井ｻ･蜀・ｼ・/h4>
                <ul className="list-disc list-inside text-blue-700 text-sm mt-1 space-y-1">
                  <li>譁ｰ蜈･遉ｾ蜩｡蜷代￠繝舌ョ繧｣蛻ｶ蠎ｦ縺ｮ蟆主・</li>
                  <li>騾ｱ谺｡繝√ぉ繝・け繧､繝ｳ繝溘・繝・ぅ繝ｳ繧ｰ縺ｮ讓呎ｺ門喧</li>
                </ul>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <h4 className="font-semibold text-green-800 text-sm">荳ｭ譛滂ｼ・繝ｶ譛井ｻ･蜀・ｼ・/h4>
                <ul className="list-disc list-inside text-green-700 text-sm mt-1 space-y-1">
                  <li>繧ｭ繝｣繝ｪ繧｢繝代せ髱｢隲・・螳壽悄蛹・/li>
                  <li>驛ｨ鄂ｲ讓ｪ譁ｭ逧・↑莠､豬∵ｩ滉ｼ壹・蜑ｵ蜃ｺ</li>
                </ul>
              </div>
              <div className="bg-purple-50 p-3 rounded">
                <h4 className="font-semibold text-purple-800 text-sm">髟ｷ譛滂ｼ・蟷ｴ莉･蜀・ｼ・/h4>
                <ul className="list-disc list-inside text-purple-700 text-sm mt-1 space-y-1">
                  <li>繧｢繝ｫ繝繝翫う繝阪ャ繝医Ρ繝ｼ繧ｯ縺ｮ讒狗ｯ・/li>
                  <li>髟ｷ譛溘う繝ｳ繧ｻ繝ｳ繝・ぅ繝門宛蠎ｦ縺ｮ險ｭ險・/li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* 繧｢繧ｯ繧ｷ繝ｧ繝ｳ繝懊ち繝ｳ */}
        <div className="flex gap-4 mt-8">
          <button 
            onClick={() => exportToPDF({
              title: '繧ｳ繝帙・繝亥・譫撰ｼ亥ｹｴ蠎ｦ蛻･霑ｽ霍｡・峨Ξ繝昴・繝・,
              facility: facility,
              reportType: 'cohort-yearly-tracking',
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

export default function CohortYearlyTrackingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <CohortYearlyTrackingContent />
    </Suspense>
  );
}