'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import DashboardButton from '@/components/DashboardButton';

export default function SurvivalCurveDepartmentPage() {
  const searchParams = useSearchParams();
  const facility = searchParams.get('facility') || '全施設';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader 
        title="部署別定着パターン比較" 
        showBackButton={true}
        backUrl="/reports"
        backText="レポートセンターに戻る"
      />
      
      <div className="container mx-auto px-4 py-8">
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

          {/* グラフプレースホルダー */}
          <div className="bg-gray-100 rounded-lg p-8 mb-6 text-center">
            <div className="text-gray-500 mb-4">
              <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              <p className="text-lg font-medium">部署別生存曲線</p>
              <p className="text-sm">複数部署の定着率推移を比較表示</p>
            </div>
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
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              詳細レポート生成
            </button>
            <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition">
              データエクスポート
            </button>
          </div>
        </div>
      </div>
      <DashboardButton />
    </div>
  );
}