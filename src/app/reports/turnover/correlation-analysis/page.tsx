'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import { exportToPDF } from '@/utils/pdfExport';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';

const correlationFactors = [
  { factor: '髱｢隲・ｻ蠎ｦ', correlation: -0.89, impact: '髱槫ｸｸ縺ｫ蠑ｷ縺・, type: 'positive' },
  { factor: '谿区･ｭ譎る俣', correlation: 0.82, impact: '髱槫ｸｸ縺ｫ蠑ｷ縺・, type: 'negative' },
  { factor: '繧ｹ繝医Ξ繧ｹ繝√ぉ繝・け轤ｹ謨ｰ', correlation: 0.76, impact: '蠑ｷ縺・, type: 'negative' },
  { factor: '譛臥ｵｦ蜿門ｾ礼紫', correlation: -0.75, impact: '蠑ｷ縺・, type: 'positive' },
  { factor: '邨ｦ荳取ｺ雜ｳ蠎ｦ', correlation: -0.68, impact: '蠑ｷ縺・, type: 'positive' },
  { factor: '閨ｷ蝣ｴ縺ｮ莠ｺ髢馴未菫・, correlation: -0.65, impact: '蠑ｷ縺・, type: 'positive' },
  { factor: '隧穂ｾ｡縺ｮ蜈ｬ蟷ｳ諤ｧ', correlation: -0.62, impact: '荳ｭ遞句ｺｦ', type: 'positive' },
  { factor: '螟懷共蝗樊焚', correlation: 0.47, impact: '荳ｭ遞句ｺｦ', type: 'negative' },
  { factor: '遐比ｿｮ蜿ょ刈邇・, correlation: -0.45, impact: '荳ｭ遞句ｺｦ', type: 'positive' },
  { factor: '騾壼共譎る俣', correlation: 0.35, impact: '蠑ｱ縺・, type: 'negative' },
  { factor: '蟷ｴ鮨｢', correlation: -0.28, impact: '蠑ｱ縺・, type: 'positive' },
  { factor: '蜍､邯壼ｹｴ謨ｰ', correlation: -0.21, impact: '蠑ｱ縺・, type: 'positive' },
];

const scatterData = [
  { x: 45, y: 15, name: '蝟ｶ讌ｭ驛ｨA' },
  { x: 50, y: 22, name: '蝟ｶ讌ｭ驛ｨB' },
  { x: 55, y: 28, name: '陬ｽ騾驛ｨA' },
  { x: 60, y: 35, name: '陬ｽ騾驛ｨB' },
  { x: 40, y: 12, name: '邂｡逅・Κ' },
  { x: 48, y: 18, name: 'IT驛ｨ' },
  { x: 52, y: 25, name: '迚ｩ豬・Κ' },
  { x: 38, y: 8, name: '莠ｺ莠矩Κ' },
];

const meetingFrequencyData = [
  { x: 0.5, y: 42, name: 'ICU' },
  { x: 0.8, y: 35, name: '謨第･' },
  { x: 1.2, y: 28, name: '螟也ｧ・ },
  { x: 2.0, y: 18, name: '蜀・ｧ・ },
  { x: 3.5, y: 12, name: '繝ｪ繝上ン繝ｪ' },
  { x: 4.0, y: 8, name: '邂｡逅・Κ' },
  { x: 2.5, y: 15, name: '讀懈渊遘・ },
  { x: 1.5, y: 22, name: '阮ｬ蜑､驛ｨ' },
];

const matrixData = [
  { factor: '髱｢隲・ｻ蠎ｦ', 髱｢隲・ｻ蠎ｦ: 1.00, 谿区･ｭ譎る俣: -0.72, 繧ｹ繝医Ξ繧ｹ: -0.68, 譛臥ｵｦ蜿門ｾ礼紫: 0.65, 螟懷共蝗樊焚: -0.45 },
  { factor: '谿区･ｭ譎る俣', 髱｢隲・ｻ蠎ｦ: -0.72, 谿区･ｭ譎る俣: 1.00, 繧ｹ繝医Ξ繧ｹ: 0.78, 譛臥ｵｦ蜿門ｾ礼紫: -0.65, 螟懷共蝗樊焚: 0.52 },
  { factor: '繧ｹ繝医Ξ繧ｹ', 髱｢隲・ｻ蠎ｦ: -0.68, 谿区･ｭ譎る俣: 0.78, 繧ｹ繝医Ξ繧ｹ: 1.00, 譛臥ｵｦ蜿門ｾ礼紫: -0.58, 螟懷共蝗樊焚: 0.61 },
  { factor: '譛臥ｵｦ蜿門ｾ礼紫', 髱｢隲・ｻ蠎ｦ: 0.65, 谿区･ｭ譎る俣: -0.65, 繧ｹ繝医Ξ繧ｹ: -0.58, 譛臥ｵｦ蜿門ｾ礼紫: 1.00, 螟懷共蝗樊焚: -0.42 },
  { factor: '螟懷共蝗樊焚', 髱｢隲・ｻ蠎ｦ: -0.45, 谿区･ｭ譎る俣: 0.52, 繧ｹ繝医Ξ繧ｹ: 0.61, 譛臥ｵｦ蜿門ｾ礼紫: -0.42, 螟懷共蝗樊焚: 1.00 },
];

function CorrelationAnalysisContent() {
  const searchParams = useSearchParams();
  const facility = searchParams.get('facility') || '蜈ｨ譁ｽ險ｭ';

  const getCorrelationColor = (value: number) => {
    const absValue = Math.abs(value);
    if (absValue > 0.7) return '#EF4444';
    if (absValue > 0.5) return '#F59E0B';
    if (absValue > 0.3) return '#3B82F6';
    return '#6B7280';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="逶ｸ髢｢蛻・梵" />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              髮｢閨ｷ隕∝屏縺ｮ逶ｸ髢｢髢｢菫ゅ→蠖ｱ髻ｿ蠎ｦ縺ｮ蜿ｯ隕門喧
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                蟇ｾ雎｡譁ｽ險ｭ: {facility}
              </span>
              <button
                onClick={() => exportToPDF({
                  title: '逶ｸ髢｢蛻・梵繝ｬ繝昴・繝・,
                  facility: facility,
                  reportType: 'turnover-correlation-analysis',
                  elementId: 'report-content',
                  dateRange: new Date().toLocaleDateString('ja-JP')
                })}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm pdf-exclude"
              >
                PDF繝繧ｦ繝ｳ繝ｭ繝ｼ繝・              </button>
            </div>
          </div>
          <p className="text-gray-600">
            蜷・ｨｮ隕∝屏縺ｨ髮｢閨ｷ邇・・逶ｸ髢｢髢｢菫ゅｒ蛻・梵縺励∵怙繧ょｽｱ髻ｿ蠎ｦ縺ｮ鬮倥＞隕∝屏繧堤音螳壹＠縺ｾ縺吶・          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              髮｢閨ｷ邇・→縺ｮ逶ｸ髢｢菫よ焚
            </h3>
            <div className="space-y-2">
              {correlationFactors.map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-32 text-sm font-medium text-gray-700 text-right">
                    {item.factor}
                  </div>
                  <div className="flex-1 relative">
                    <div className="w-full bg-gray-200 rounded-full h-6">
                      <div
                        className={`h-6 rounded-full flex items-center justify-end pr-2 text-xs font-semibold text-white ${
                          item.correlation < 0 ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{
                          width: `${Math.abs(item.correlation) * 50}%`,
                          marginLeft: item.correlation < 0 ? `${(1 - Math.abs(item.correlation)) * 50}%` : '50%'
                        }}
                      >
                        {item.correlation.toFixed(2)}
                      </div>
                    </div>
                    <div className="absolute inset-x-0 flex justify-center">
                      <div className="w-px h-8 bg-gray-400 -mt-1"></div>
                    </div>
                  </div>
                  <div className="w-20 text-xs text-gray-500">
                    {item.impact}
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-center mt-4 text-xs text-gray-500">
                <span className="mr-8">竊・雋縺ｮ逶ｸ髢｢・磯屬閨ｷ邇・ｽ惹ｸ具ｼ・/span>
                <span>豁｣縺ｮ逶ｸ髢｢・磯屬閨ｷ邇・ｸ頑・・俄・</span>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              髱｢隲・ｻ蠎ｦ縺ｨ髮｢閨ｷ邇・・謨｣蟶・峙
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  name="譛磯俣髱｢隲・屓謨ｰ" 
                  unit="蝗・
                  domain={[0, 5]}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  name="髮｢閨ｷ邇・ 
                  unit="%"
                  domain={[0, 50]}
                />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="驛ｨ鄂ｲ蛻･繝・・繧ｿ" data={meetingFrequencyData} fill="#10B981">
                  {meetingFrequencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#10B981" />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-600 mt-2">
              逶ｸ髢｢菫よ焚: -0.89・磯撼蟶ｸ縺ｫ蠑ｷ縺・ｲ縺ｮ逶ｸ髢｢・・            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              谿区･ｭ譎る俣縺ｨ髮｢閨ｷ邇・・謨｣蟶・峙
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  name="蟷ｳ蝮・ｮ区･ｭ譎る俣" 
                  unit="譎る俣"
                  domain={[30, 65]}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  name="髮｢閨ｷ邇・ 
                  unit="%"
                  domain={[0, 40]}
                />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="驛ｨ鄂ｲ蛻･繝・・繧ｿ" data={scatterData} fill="#EF4444">
                  {scatterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#EF4444" />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-600 mt-2">
              逶ｸ髢｢菫よ焚: 0.82・亥ｼｷ縺・ｭ｣縺ｮ逶ｸ髢｢・・            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              縺昴・莉悶・驥崎ｦ∬ｦ∝屏縺ｨ縺ｮ逶ｸ髢｢
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">繧ｹ繝医Ξ繧ｹ繝√ぉ繝・け轤ｹ謨ｰ</span>
                  <span className="text-sm text-gray-600">逶ｸ髢｢菫よ焚: 0.76</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '76%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">螟懷共蝗樊焚</span>
                  <span className="text-sm text-gray-600">逶ｸ髢｢菫よ焚: 0.47</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '47%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">蜍､邯壼ｹｴ謨ｰ</span>
                  <span className="text-sm text-gray-600">逶ｸ髢｢菫よ焚: -0.21</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '21%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">蟷ｴ鮨｢</span>
                  <span className="text-sm text-gray-600">逶ｸ髢｢菫よ焚: -0.28</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            逶ｸ髢｢繝槭ヨ繝ｪ繝・け繧ｹ
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    隕∝屏
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    髱｢隲・ｻ蠎ｦ
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    谿区･ｭ譎る俣
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    繧ｹ繝医Ξ繧ｹ
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    譛臥ｵｦ蜿門ｾ礼紫
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    螟懷共蝗樊焚
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {matrixData.map((row, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                      {row.factor}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-center">
                      <span style={{ color: getCorrelationColor(row.髱｢隲・ｻ蠎ｦ) }}>
                        {row.髱｢隲・ｻ蠎ｦ.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-center">
                      <span style={{ color: getCorrelationColor(row.谿区･ｭ譎る俣) }}>
                        {row.谿区･ｭ譎る俣.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-center">
                      <span style={{ color: getCorrelationColor(row.繧ｹ繝医Ξ繧ｹ) }}>
                        {row.繧ｹ繝医Ξ繧ｹ.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-center">
                      <span style={{ color: getCorrelationColor(row.譛臥ｵｦ蜿門ｾ礼紫) }}>
                        {row.譛臥ｵｦ蜿門ｾ礼紫.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-center">
                      <span style={{ color: getCorrelationColor(row.螟懷共蝗樊焚) }}>
                        {row.螟懷共蝗樊焚.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>窶ｻ 逶ｸ髢｢菫よ焚縺ｮ隗｣驥茨ｼ・/p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li><span className="text-red-500">笳・/span> 0.7莉･荳・-0.7莉･荳具ｼ壼ｼｷ縺・嶌髢｢</li>
              <li><span className="text-yellow-500">笳・/span> 0.4縲・.7/-0.4縲・0.7・壻ｸｭ遞句ｺｦ縺ｮ逶ｸ髢｢</li>
              <li><span className="text-blue-500">笳・/span> 0.2縲・.4/-0.2縲・0.4・壼ｼｱ縺・嶌髢｢</li>
              <li><span className="text-gray-500">笳・/span> 0.2譛ｪ貅・壹⊇縺ｼ辟｡逶ｸ髢｢</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              荳ｻ隕√↑逋ｺ隕・            </h3>
            <div className="space-y-3">
              <div className="border-l-4 border-green-400 pl-4">
                <h4 className="font-semibold text-gray-700">髱｢隲・ｻ蠎ｦ・育嶌髢｢菫よ焚: -0.89・・/h4>
                <p className="text-sm text-gray-600">譛繧ょｼｷ縺・ｲ縺ｮ逶ｸ髢｢縲よ怦1蝗樔ｻ･荳翫・螳壽悄髱｢隲・〒髮｢閨ｷ邇・′螟ｧ蟷・↓菴惹ｸ・/p>
              </div>
              <div className="border-l-4 border-red-400 pl-4">
                <h4 className="font-semibold text-gray-700">谿区･ｭ譎る俣・育嶌髢｢菫よ焚: 0.82・・/h4>
                <p className="text-sm text-gray-600">髱槫ｸｸ縺ｫ蠑ｷ縺・ｭ｣縺ｮ逶ｸ髢｢縲よ怦45譎る俣繧定ｶ・∴繧九→髮｢閨ｷ邇・′諤･豼縺ｫ荳頑・</p>
              </div>
              <div className="border-l-4 border-orange-400 pl-4">
                <h4 className="font-semibold text-gray-700">繧ｹ繝医Ξ繧ｹ繝√ぉ繝・け轤ｹ謨ｰ・育嶌髢｢菫よ焚: 0.76・・/h4>
                <p className="text-sm text-gray-600">蠑ｷ縺・ｭ｣縺ｮ逶ｸ髢｢縲・0轤ｹ莉･荳翫〒鬮倥Μ繧ｹ繧ｯ</p>
              </div>
              <div className="border-l-4 border-blue-400 pl-4">
                <h4 className="font-semibold text-gray-700">譛臥ｵｦ蜿門ｾ礼紫・育嶌髢｢菫よ焚: -0.75・・/h4>
                <p className="text-sm text-gray-600">蠑ｷ縺・ｲ縺ｮ逶ｸ髢｢縲ょ叙蠕礼紫70%莉･荳翫〒髮｢閨ｷ邇・′螟ｧ蟷・↓菴惹ｸ・/p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              謾ｹ蝟・━蜈磯・ｽ阪・謠先｡・            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                <span className="font-medium text-green-800">1. 螳壽悄髱｢隲・・螳滓命</span>
                <span className="text-sm text-green-600">譛蜆ｪ蜈・/span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded">
                <span className="font-medium text-red-800">2. 谿区･ｭ譎る俣蜑頑ｸ・/span>
                <span className="text-sm text-red-600">蜆ｪ蜈・/span>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded">
                <span className="font-medium text-orange-800">3. 繧ｹ繝医Ξ繧ｹ邂｡逅・ｼｷ蛹・/span>
                <span className="text-sm text-orange-600">驥崎ｦ・/span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded">
                <span className="font-medium text-yellow-800">4. 譛臥ｵｦ蜿門ｾ嶺ｿ・ｲ</span>
                <span className="text-sm text-yellow-600">驥崎ｦ・/span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                <span className="font-medium text-blue-800">5. 螟懷共雋諡・ｻｽ貂・/span>
                <span className="text-sm text-blue-600">謗ｨ螂ｨ</span>
              </div>
            </div>
          </div>
        </div>
      </div><CategoryTopButton categoryPath="/reports?tab=turnover" categoryName="髮｢閨ｷ隕∝屏蛻・梵" /></div>
  );
}

export default function CorrelationAnalysisPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <CorrelationAnalysisContent />
    </Suspense>
  );
}