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
  PieChart,
  Pie,
  Cell
} from 'recharts';

const recruitmentTypeData = [
  { month: '1繝ｶ譛・, 譁ｰ蜊・ 98, 荳ｭ騾・ 94 },
  { month: '3繝ｶ譛・, 譁ｰ蜊・ 96, 荳ｭ騾・ 88 },
  { month: '6繝ｶ譛・, 譁ｰ蜊・ 93, 荳ｭ騾・ 82 },
  { month: '1蟷ｴ', 譁ｰ蜊・ 89, 荳ｭ騾・ 75 },
  { month: '2蟷ｴ', 譁ｰ蜊・ 84, 荳ｭ騾・ 68 },
  { month: '3蟷ｴ', 譁ｰ蜊・ 78, 荳ｭ騾・ 62 },
  { month: '5蟷ｴ', 譁ｰ蜊・ 70, 荳ｭ騾・ 55 },
];

const departmentComparison = [
  { department: '逵玖ｭｷ驛ｨ', 譁ｰ蜊貞ｮ夂捩邇・ 85, 荳ｭ騾泌ｮ夂捩邇・ 70 },
  { department: '繝ｪ繝上ン繝ｪ驛ｨ', 譁ｰ蜊貞ｮ夂捩邇・ 90, 荳ｭ騾泌ｮ夂捩邇・ 75 },
  { department: '阮ｬ蜑､驛ｨ', 譁ｰ蜊貞ｮ夂捩邇・ 88, 荳ｭ騾泌ｮ夂捩邇・ 72 },
  { department: '莠句漁驛ｨ', 譁ｰ蜊貞ｮ夂捩邇・ 92, 荳ｭ騾泌ｮ夂捩邇・ 78 },
  { department: '讀懈渊驛ｨ', 譁ｰ蜊貞ｮ夂捩邇・ 87, 荳ｭ騾泌ｮ夂捩邇・ 73 },
];

const turnoverReasons = {
  譁ｰ蜊・ [
    { name: '繧ｭ繝｣繝ｪ繧｢繝√ぉ繝ｳ繧ｸ', value: 35, color: '#3B82F6' },
    { name: '閨ｷ蝣ｴ迺ｰ蠅・, value: 25, color: '#10B981' },
    { name: '邨ｦ荳主ｾ・∞', value: 20, color: '#F59E0B' },
    { name: '莠ｺ髢馴未菫・, value: 15, color: '#EF4444' },
    { name: '縺昴・莉・, value: 5, color: '#6B7280' },
  ],
  荳ｭ騾・ [
    { name: '邨ｦ荳主ｾ・∞', value: 30, color: '#3B82F6' },
    { name: '繧ｭ繝｣繝ｪ繧｢繧｢繝・・', value: 28, color: '#10B981' },
    { name: '閨ｷ蝣ｴ迺ｰ蠅・, value: 22, color: '#F59E0B' },
    { name: '莠ｺ髢馴未菫・, value: 12, color: '#EF4444' },
    { name: '縺昴・莉・, value: 8, color: '#6B7280' },
  ],
};

function SegmentRecruitmentTypeContent() {
  const searchParams = useSearchParams();
  const facility = searchParams.get('facility') || '蜈ｨ譁ｽ險ｭ';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="譁ｰ蜊偵・荳ｭ騾泌挨螳夂捩蛻・梵" />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              謗｡逕ｨ邨瑚ｷｯ縺ｫ繧医ｋ螳夂捩繝代ち繝ｼ繝ｳ縺ｮ隧ｳ邏ｰ蛻・梵
            </h2>
            <span className="text-sm text-gray-500">
              蟇ｾ雎｡譁ｽ險ｭ: {facility}
            </span>
          </div>
          <p className="text-gray-600">
            譁ｰ蜊呈治逕ｨ縺ｨ荳ｭ騾疲治逕ｨ縺ｮ螳夂捩邇・・驕輔＞繧呈凾邉ｻ蛻励〒蛻・梵縺励√◎繧後◇繧後・迚ｹ蠕ｴ逧・↑騾閨ｷ繝代ち繝ｼ繝ｳ縺ｨ隕∝屏繧呈・繧峨°縺ｫ縺励∪縺吶・          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              螳夂捩邇・耳遘ｻ豈碑ｼ・            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={recruitmentTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[50, 100]} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="譁ｰ蜊・ 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="荳ｭ騾・ 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ fill: '#10B981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              驛ｨ鄂ｲ蛻･螳夂捩邇・ｯ碑ｼ・ｼ・蟷ｴ蠕鯉ｼ・            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Bar dataKey="譁ｰ蜊貞ｮ夂捩邇・ fill="#3B82F6" />
                <Bar dataKey="荳ｭ騾泌ｮ夂捩邇・ fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              譁ｰ蜊呈治逕ｨ閠・・騾閨ｷ逅・罰蛻・梵
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={turnoverReasons.譁ｰ蜊筑
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {turnoverReasons.譁ｰ蜊・map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              荳ｭ騾疲治逕ｨ閠・・騾閨ｷ逅・罰蛻・梵
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={turnoverReasons.荳ｭ騾媒
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {turnoverReasons.荳ｭ騾・map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            蛻・梵邨先棡繧ｵ繝槭Μ繝ｼ
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">譁ｰ蜊呈治逕ｨ縺ｮ迚ｹ蠕ｴ</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>蛻晄悄螳夂捩邇・′鬮倥￥縲・聞譛溽噪縺ｫ螳牙ｮ壹＠縺溷ｮ夂捩繧堤､ｺ縺・/li>
                <li>繧ｭ繝｣繝ｪ繧｢繝√ぉ繝ｳ繧ｸ縺御ｸｻ縺ｪ騾閨ｷ逅・罰・・5%・・/li>
                <li>3蟷ｴ逶ｮ莉･髯阪・螳夂捩邇・ｽ惹ｸ九′鬘戊送</li>
                <li>謨呵ご繝ｻ遐比ｿｮ蛻ｶ蠎ｦ縺ｮ蜈・ｮ溘′螳夂捩縺ｫ蟇・ｸ・/li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">荳ｭ騾疲治逕ｨ縺ｮ迚ｹ蠕ｴ</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>蛻晄悄螳夂捩邇・′菴弱￥縲∫音縺ｫ3繝ｶ譛育岼縺ｧ縺ｮ髮｢閨ｷ縺悟､壹＞</li>
                <li>邨ｦ荳主ｾ・∞縺ｸ縺ｮ荳肴ｺ縺御ｸｻ縺ｪ騾閨ｷ逅・罰・・0%・・/li>
                <li>蜊ｳ謌ｦ蜉帶悄蠕・→迴ｾ螳溘・繧ｮ繝｣繝・・縺瑚ｪｲ鬘・/li>
                <li>繧ｪ繝ｳ繝懊・繝・ぅ繝ｳ繧ｰ繝励Ο繧ｻ繧ｹ縺ｮ謾ｹ蝟・′蠢・ｦ・/li>
              </ul>
            </div>
          </div>
          
          {/* 繧｢繧ｯ繧ｷ繝ｧ繝ｳ繝懊ち繝ｳ */}
          <div className="flex gap-4 mt-8">
            <button 
              onClick={() => exportToPDF({
                title: '譁ｰ蜊偵・荳ｭ騾泌挨螳夂捩蛻・梵繝ｬ繝昴・繝・,
                facility: facility,
                reportType: 'segment-recruitment-type',
                elementId: 'report-content',
                dateRange: new Date().toLocaleDateString('ja-JP')
              })}
              className="pdf-exclude bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              PDF繝繧ｦ繝ｳ繝ｭ繝ｼ繝・            </button>
            <button className="pdf-exclude bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition">
              Excel繧ｨ繧ｯ繧ｹ繝昴・繝・            </button>
          </div>
        </div>
      </div><CategoryTopButton categoryPath="/reports?tab=retention" categoryName="螳夂捩蛻・梵" /></div>
  );
}

export default function SegmentRecruitmentTypePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <SegmentRecruitmentTypeContent />
    </Suspense>
  );
}