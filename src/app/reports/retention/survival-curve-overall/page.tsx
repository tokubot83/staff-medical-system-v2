'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { exportToPDF } from '@/utils/pdfExport';

function SurvivalCurveOverallContent() {
  const searchParams = useSearchParams();
  const facility = searchParams.get('facility') || '全施設';

  return (
    <div className="min-h-screen bg-gray-50">
      <div id="report-content" className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Kaplan-Meier生存曲線分析</h2>
            <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              対象施設: {facility}
            </span>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600">
              従業員の入社から退職までの期間を統計的に分析し、時間経過に伴う定着率の推移を可視化します。
            </p>
          </div>

          {/* 生存曲線グラフ */}
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
                  label={{ value: '勤続月数', position: 'insideBottomRight', offset: -10 }}
                />
                <YAxis 
                  label={{ value: '定着率 (%)', angle: -90, position: 'insideLeft' }}
                  domain={[0, 100]}
                />
                <Tooltip 
                  formatter={(value) => `${value}%`}
                  labelFormatter={(label) => `${label}ヶ月`}
                />
                <Legend />
                <Line 
                  type="stepAfter" 
                  dataKey="rate" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  name="生存率"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 主要指標 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-700 mb-1">中央生存期間</h4>
              <p className="text-2xl font-bold text-blue-900">4.2年</p>
              <p className="text-xs text-blue-600">50%が退職するまでの期間</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-green-700 mb-1">1年定着率</h4>
              <p className="text-2xl font-bold text-green-900">87.5%</p>
              <p className="text-xs text-green-600">入社1年後の在籍率</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-purple-700 mb-1">3年定着率</h4>
              <p className="text-2xl font-bold text-purple-900">65.3%</p>
              <p className="text-xs text-purple-600">入社3年後の在籍率</p>
            </div>
          </div>

          {/* 詳細データテーブル */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">期間別定着率詳細</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">期間</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">定着率</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">退職者数</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">リスク率</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-2 text-sm text-gray-900">6ヶ月</td>
                    <td className="px-4 py-2 text-sm text-gray-900">94.2%</td>
                    <td className="px-4 py-2 text-sm text-gray-900">12名</td>
                    <td className="px-4 py-2 text-sm text-gray-900">5.8%</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-sm text-gray-900">1年</td>
                    <td className="px-4 py-2 text-sm text-gray-900">87.5%</td>
                    <td className="px-4 py-2 text-sm text-gray-900">26名</td>
                    <td className="px-4 py-2 text-sm text-gray-900">12.5%</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-sm text-gray-900">2年</td>
                    <td className="px-4 py-2 text-sm text-gray-900">76.3%</td>
                    <td className="px-4 py-2 text-sm text-gray-900">49名</td>
                    <td className="px-4 py-2 text-sm text-gray-900">23.7%</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-sm text-gray-900">3年</td>
                    <td className="px-4 py-2 text-sm text-gray-900">65.3%</td>
                    <td className="px-4 py-2 text-sm text-gray-900">72名</td>
                    <td className="px-4 py-2 text-sm text-gray-900">34.7%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex gap-4 mt-8">
            <button 
              onClick={() => exportToPDF({
                title: '全体定着率推移分析レポート',
                facility: facility,
                reportType: 'survival-curve-overall',
                elementId: 'report-content',
                dateRange: new Date().toLocaleDateString('ja-JP')
              })}
              className="pdf-exclude bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              PDFダウンロード
            </button>
            <button className="pdf-exclude bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition">
              Excelエクスポート
            </button>
          </div>
        </div>
      </div></div>
  );
}

export default function SurvivalCurveOverallPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">読み込み中...</div></div>}>
      <SurvivalCurveOverallContent />
    </Suspense>
  );
}