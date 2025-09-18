'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { exportToPDF } from '@/utils/pdfExport';

function SurvivalCurveOverallContent() {
  const searchParams = useSearchParams();
  const facility = searchParams.get('facility') || '蜈ｨ譁ｽ險ｭ';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="蜈ｨ菴灘ｮ夂捩邇・耳遘ｻ蛻・梵" />
      
      <div id="report-content" className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Kaplan-Meier逕溷ｭ俶峇邱壼・譫・/h2>
            <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              蟇ｾ雎｡譁ｽ險ｭ: {facility}
            </span>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600">
              蠕捺･ｭ蜩｡縺ｮ蜈･遉ｾ縺九ｉ騾閨ｷ縺ｾ縺ｧ縺ｮ譛滄俣繧堤ｵｱ險育噪縺ｫ蛻・梵縺励∵凾髢鍋ｵ碁℃縺ｫ莨ｴ縺・ｮ夂捩邇・・謗ｨ遘ｻ繧貞庄隕門喧縺励∪縺吶・            </p>
          </div>

          {/* 逕溷ｭ俶峇邱壹げ繝ｩ繝・*/}
          <div className="mb-6">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={[
                  { month: 0, rate: 100 },
                  { month: 3, rate: 97.2 },
                  { month: 6, rate: 94.2 },
                  { month: 9, rate: 90.5 },
                  { month: 12, rate: 87.5 },
                  { month: 18, rate: 81.3 },
                  { month: 24, rate: 76.3 },
                  { month: 30, rate: 70.8 },
                  { month: 36, rate: 65.3 },
                  { month: 42, rate: 61.2 },
                  { month: 48, rate: 57.8 },
                  { month: 54, rate: 54.9 },
                  { month: 60, rate: 52.1 },
                ]}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  label={{ value: '蜍､邯壽怦謨ｰ', position: 'insideBottomRight', offset: -10 }}
                />
                <YAxis 
                  label={{ value: '螳夂捩邇・(%)', angle: -90, position: 'insideLeft' }}
                  domain={[0, 100]}
                />
                <Tooltip 
                  formatter={(value) => `${value}%`}
                  labelFormatter={(label) => `${label}繝ｶ譛・}
                />
                <Legend />
                <Line 
                  type="stepAfter" 
                  dataKey="rate" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  name="逕溷ｭ倡紫"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 荳ｻ隕∵欠讓・*/}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-700 mb-1">荳ｭ螟ｮ逕溷ｭ俶悄髢・/h4>
              <p className="text-2xl font-bold text-blue-900">4.2蟷ｴ</p>
              <p className="text-xs text-blue-600">50%縺碁閨ｷ縺吶ｋ縺ｾ縺ｧ縺ｮ譛滄俣</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-green-700 mb-1">1蟷ｴ螳夂捩邇・/h4>
              <p className="text-2xl font-bold text-green-900">87.5%</p>
              <p className="text-xs text-green-600">蜈･遉ｾ1蟷ｴ蠕後・蝨ｨ邀咲紫</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-purple-700 mb-1">3蟷ｴ螳夂捩邇・/h4>
              <p className="text-2xl font-bold text-purple-900">65.3%</p>
              <p className="text-xs text-purple-600">蜈･遉ｾ3蟷ｴ蠕後・蝨ｨ邀咲紫</p>
            </div>
          </div>

          {/* 隧ｳ邏ｰ繝・・繧ｿ繝・・繝悶Ν */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">譛滄俣蛻･螳夂捩邇・ｩｳ邏ｰ</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">譛滄俣</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">螳夂捩邇・/th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">騾閨ｷ閠・焚</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">繝ｪ繧ｹ繧ｯ邇・/th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-2 text-sm text-gray-900">6繝ｶ譛・/td>
                    <td className="px-4 py-2 text-sm text-gray-900">94.2%</td>
                    <td className="px-4 py-2 text-sm text-gray-900">12蜷・/td>
                    <td className="px-4 py-2 text-sm text-gray-900">5.8%</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-sm text-gray-900">1蟷ｴ</td>
                    <td className="px-4 py-2 text-sm text-gray-900">87.5%</td>
                    <td className="px-4 py-2 text-sm text-gray-900">26蜷・/td>
                    <td className="px-4 py-2 text-sm text-gray-900">12.5%</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-sm text-gray-900">2蟷ｴ</td>
                    <td className="px-4 py-2 text-sm text-gray-900">76.3%</td>
                    <td className="px-4 py-2 text-sm text-gray-900">49蜷・/td>
                    <td className="px-4 py-2 text-sm text-gray-900">23.7%</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-sm text-gray-900">3蟷ｴ</td>
                    <td className="px-4 py-2 text-sm text-gray-900">65.3%</td>
                    <td className="px-4 py-2 text-sm text-gray-900">72蜷・/td>
                    <td className="px-4 py-2 text-sm text-gray-900">34.7%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 繧｢繧ｯ繧ｷ繝ｧ繝ｳ繝懊ち繝ｳ */}
          <div className="flex gap-4 mt-8">
            <button 
              onClick={() => exportToPDF({
                title: '蜈ｨ菴灘ｮ夂捩邇・耳遘ｻ蛻・梵繝ｬ繝昴・繝・,
                facility: facility,
                reportType: 'survival-curve-overall',
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

export default function SurvivalCurveOverallPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">隱ｭ縺ｿ霎ｼ縺ｿ荳ｭ...</div></div>}>
      <SurvivalCurveOverallContent />
    </Suspense>
  );
}