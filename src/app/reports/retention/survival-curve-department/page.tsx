'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { exportToPDF } from '@/utils/pdfExport';

function SurvivalCurveDepartmentContent() {
  const searchParams = useSearchParams();
  const facility = searchParams.get('facility') || '蜈ｨ譁ｽ險ｭ';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="驛ｨ鄂ｲ蛻･螳夂捩繝代ち繝ｼ繝ｳ豈碑ｼ・ />
      
      <div id="report-content" className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">驛ｨ鄂ｲ髢薙・逕溷ｭ俶峇邱壽ｯ碑ｼ・・譫・/h2>
            <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              蟇ｾ雎｡譁ｽ險ｭ: {facility}
            </span>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600">
              蜷・Κ鄂ｲ縺ｮ螳夂捩繝代ち繝ｼ繝ｳ繧呈ｯ碑ｼ・・譫舌＠縲・Κ鄂ｲ迚ｹ譛峨・隱ｲ鬘後ｄ謌仙粥隕∝屏繧呈・繧峨°縺ｫ縺励∪縺吶・            </p>
          </div>

          {/* 驛ｨ鄂ｲ蛻･逕溷ｭ俶峇邱壹げ繝ｩ繝・*/}
          <div className="mb-6">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={[
                  { month: 0, nursing: 100, medical: 100, rehab: 100, pharmacy: 100, nutrition: 100, admin: 100 },
                  { month: 6, nursing: 96.8, medical: 83.2, rehab: 94.1, pharmacy: 98.2, nutrition: 78.5, admin: 92.3 },
                  { month: 12, nursing: 92.3, medical: 75.0, rehab: 88.5, pharmacy: 95.0, nutrition: 68.2, admin: 85.7 },
                  { month: 18, nursing: 87.5, medical: 65.8, rehab: 82.3, pharmacy: 91.2, nutrition: 58.9, admin: 79.2 },
                  { month: 24, nursing: 83.2, medical: 58.9, rehab: 76.8, pharmacy: 87.5, nutrition: 52.3, admin: 73.5 },
                  { month: 30, nursing: 79.8, medical: 54.2, rehab: 72.1, pharmacy: 84.3, nutrition: 48.5, admin: 69.8 },
                  { month: 36, nursing: 78.5, medical: 52.3, rehab: 70.2, pharmacy: 82.1, nutrition: 45.5, admin: 67.8 },
                  { month: 42, nursing: 76.2, medical: 49.8, rehab: 67.5, pharmacy: 79.8, nutrition: 42.1, admin: 65.2 },
                  { month: 48, nursing: 73.8, medical: 47.5, rehab: 65.2, pharmacy: 77.5, nutrition: 39.8, admin: 62.5 },
                  { month: 60, nursing: 70.5, medical: 44.2, rehab: 61.8, pharmacy: 73.2, nutrition: 35.5, admin: 58.9 },
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
                <Line type="stepAfter" dataKey="nursing" stroke="#10b981" strokeWidth={2} name="逵玖ｭｷ驛ｨ" />
                <Line type="stepAfter" dataKey="medical" stroke="#f59e0b" strokeWidth={2} name="蛹ｻ莠玖ｪｲ" />
                <Line type="stepAfter" dataKey="rehab" stroke="#3b82f6" strokeWidth={2} name="繝ｪ繝上ン繝ｪ驛ｨ" />
                <Line type="stepAfter" dataKey="pharmacy" stroke="#8b5cf6" strokeWidth={2} name="阮ｬ蜑､驛ｨ" />
                <Line type="stepAfter" dataKey="nutrition" stroke="#ef4444" strokeWidth={2} name="譬・､企Κ" />
                <Line type="stepAfter" dataKey="admin" stroke="#6b7280" strokeWidth={2} name="邱丞漁驛ｨ" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 驛ｨ鄂ｲ蛻･繧ｵ繝槭Μ繝ｼ */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-800">逵玖ｭｷ驛ｨ</h4>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">鬮伜ｮ夂捩</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">1蟷ｴ螳夂捩邇・</span>
                  <span className="font-medium">92.3%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">3蟷ｴ螳夂捩邇・</span>
                  <span className="font-medium">78.5%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">荳ｭ螟ｮ逕溷ｭ俶悄髢・</span>
                  <span className="font-medium">5.8蟷ｴ</span>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-800">蛹ｻ莠玖ｪｲ</h4>
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">隕∵ｳｨ諢・/span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">1蟷ｴ螳夂捩邇・</span>
                  <span className="font-medium">75.0%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">3蟷ｴ螳夂捩邇・</span>
                  <span className="font-medium">52.3%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">荳ｭ螟ｮ逕溷ｭ俶悄髢・</span>
                  <span className="font-medium">3.2蟷ｴ</span>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-800">繝ｪ繝上ン繝ｪ驛ｨ</h4>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">螳牙ｮ・/span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">1蟷ｴ螳夂捩邇・</span>
                  <span className="font-medium">88.5%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">3蟷ｴ螳夂捩邇・</span>
                  <span className="font-medium">70.2%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">荳ｭ螟ｮ逕溷ｭ俶悄髢・</span>
                  <span className="font-medium">4.5蟷ｴ</span>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-800">阮ｬ蜑､驛ｨ</h4>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">鬮伜ｮ夂捩</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">1蟷ｴ螳夂捩邇・</span>
                  <span className="font-medium">95.0%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">3蟷ｴ螳夂捩邇・</span>
                  <span className="font-medium">82.1%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">荳ｭ螟ｮ逕溷ｭ俶悄髢・</span>
                  <span className="font-medium">6.5蟷ｴ</span>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-800">譬・､企Κ</h4>
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">隕∵隼蝟・/span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">1蟷ｴ螳夂捩邇・</span>
                  <span className="font-medium">68.2%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">3蟷ｴ螳夂捩邇・</span>
                  <span className="font-medium">45.5%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">荳ｭ螟ｮ逕溷ｭ俶悄髢・</span>
                  <span className="font-medium">2.8蟷ｴ</span>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-800">邱丞漁驛ｨ</h4>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">螳牙ｮ・/span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">1蟷ｴ螳夂捩邇・</span>
                  <span className="font-medium">85.7%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">3蟷ｴ螳夂捩邇・</span>
                  <span className="font-medium">67.8%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">荳ｭ螟ｮ逕溷ｭ俶悄髢・</span>
                  <span className="font-medium">4.2蟷ｴ</span>
                </div>
              </div>
            </div>
          </div>

          {/* 蛻・梵邨先棡 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">蛻・梵繧､繝ｳ繧ｵ繧､繝・/h3>
            <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
              <li>阮ｬ蜑､驛ｨ縺ｨ逵玖ｭｷ驛ｨ縺梧怙繧るｫ倥＞螳夂捩邇・ｒ遉ｺ縺励※縺翫ｊ縲∝ｰる摩諤ｧ縺ｮ鬮倥＞閨ｷ遞ｮ縺ｧ螳夂捩縺瑚憶螂ｽ</li>
              <li>譬・､企Κ縺ｨ蛹ｻ莠玖ｪｲ縺ｯ譌ｩ譛滄屬閨ｷ邇・′鬮倥￥縲∵･ｭ蜍呵ｲ闕ｷ繧・・蝣ｴ迺ｰ蠅・・謾ｹ蝟・′蠢・ｦ・/li>
              <li>蜈･遉ｾ1蟷ｴ莉･蜀・・髮｢閨ｷ縺悟､壹＞驛ｨ鄂ｲ縺ｧ縺ｯ縲∵眠莠ｺ謨呵ご菴灘宛縺ｮ隕狗峩縺励′蜉ｹ譫懃噪</li>
            </ul>
          </div>

          {/* 繧｢繧ｯ繧ｷ繝ｧ繝ｳ繝懊ち繝ｳ */}
          <div className="flex gap-4 mt-8">
            <button 
              onClick={() => exportToPDF({
                title: '驛ｨ髢蛻･螳夂捩邇・耳遘ｻ蛻・梵繝ｬ繝昴・繝・,
                facility: facility,
                reportType: 'survival-curve-department',
                elementId: 'report-content',
                dateRange: new Date().toLocaleDateString('ja-JP')
              })}
              className="pdf-exclude bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              PDF繝繧ｦ繝ｳ繝ｭ繝ｼ繝・            </button>
            <button className="pdf-exclude bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition">
              繝・・繧ｿ繧ｨ繧ｯ繧ｹ繝昴・繝・            </button>
          </div>
        </div>
      </div><CategoryTopButton categoryPath="/reports?tab=retention" categoryName="螳夂捩蛻・梵" /></div>
  );
}

export default function SurvivalCurveDepartmentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">隱ｭ縺ｿ霎ｼ縺ｿ荳ｭ...</div></div>}>
      <SurvivalCurveDepartmentContent />
    </Suspense>
  );
}