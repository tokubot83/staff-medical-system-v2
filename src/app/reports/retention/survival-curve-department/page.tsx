'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import BreadcrumbBar from '@/components/navigation/BreadcrumbBar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { exportToPDF } from '@/utils/pdfExport';

function SurvivalCurveDepartmentContent() {
  const searchParams = useSearchParams();
  const facility = searchParams.get('facility') || '全施設';

  return (
    <div className="min-h-screen bg-gray-50">
      <BreadcrumbBar />
      <div id="report-content" className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">部署間の生存曲線比較分析</h2>
            <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              対象施設: {facility}
            </span>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600">
              各部署の定着パターンを比較分析し、部署特有の課題や成功要因を明らかにします。
            </p>
          </div>

          {/* 部署別生存曲線グラフ */}
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
                <Line type="stepAfter" dataKey="nursing" stroke="#10b981" strokeWidth={2} name="看護部" />
                <Line type="stepAfter" dataKey="medical" stroke="#f59e0b" strokeWidth={2} name="医事課" />
                <Line type="stepAfter" dataKey="rehab" stroke="#3b82f6" strokeWidth={2} name="リハビリ部" />
                <Line type="stepAfter" dataKey="pharmacy" stroke="#8b5cf6" strokeWidth={2} name="薬剤部" />
                <Line type="stepAfter" dataKey="nutrition" stroke="#ef4444" strokeWidth={2} name="栄養部" />
                <Line type="stepAfter" dataKey="admin" stroke="#6b7280" strokeWidth={2} name="総務部" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 部署別サマリー */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-800">看護部</h4>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">高定着</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">1年定着率:</span>
                  <span className="font-medium">92.3%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">3年定着率:</span>
                  <span className="font-medium">78.5%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">中央生存期間:</span>
                  <span className="font-medium">5.8年</span>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-800">医事課</h4>
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">要注意</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">1年定着率:</span>
                  <span className="font-medium">75.0%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">3年定着率:</span>
                  <span className="font-medium">52.3%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">中央生存期間:</span>
                  <span className="font-medium">3.2年</span>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-800">リハビリ部</h4>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">安定</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">1年定着率:</span>
                  <span className="font-medium">88.5%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">3年定着率:</span>
                  <span className="font-medium">70.2%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">中央生存期間:</span>
                  <span className="font-medium">4.5年</span>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-800">薬剤部</h4>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">高定着</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">1年定着率:</span>
                  <span className="font-medium">95.0%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">3年定着率:</span>
                  <span className="font-medium">82.1%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">中央生存期間:</span>
                  <span className="font-medium">6.5年</span>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-800">栄養部</h4>
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">要改善</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">1年定着率:</span>
                  <span className="font-medium">68.2%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">3年定着率:</span>
                  <span className="font-medium">45.5%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">中央生存期間:</span>
                  <span className="font-medium">2.8年</span>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-800">総務部</h4>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">安定</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">1年定着率:</span>
                  <span className="font-medium">85.7%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">3年定着率:</span>
                  <span className="font-medium">67.8%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">中央生存期間:</span>
                  <span className="font-medium">4.2年</span>
                </div>
              </div>
            </div>
          </div>

          {/* 分析結果 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">分析インサイト</h3>
            <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
              <li>薬剤部と看護部が最も高い定着率を示しており、専門性の高い職種で定着が良好</li>
              <li>栄養部と医事課は早期離職率が高く、業務負荷や職場環境の改善が必要</li>
              <li>入社1年以内の離職が多い部署では、新人教育体制の見直しが効果的</li>
            </ul>
          </div>

          {/* アクションボタン */}
          <div className="flex gap-4 mt-8">
            <button 
              onClick={() => exportToPDF({
                title: '部門別定着率推移分析レポート',
                facility: facility,
                reportType: 'survival-curve-department',
                elementId: 'report-content',
                dateRange: new Date().toLocaleDateString('ja-JP')
              })}
              className="pdf-exclude bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              PDFダウンロード
            </button>
            <button className="pdf-exclude bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition">
              データエクスポート
            </button>
          </div>
        </div>
      </div></div>
  );
}

export default function SurvivalCurveDepartmentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">読み込み中...</div></div>}>
      <SurvivalCurveDepartmentContent />
    </Suspense>
  );
}