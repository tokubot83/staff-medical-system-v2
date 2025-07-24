'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import DashboardButton from '@/components/DashboardButton';

export default function SurvivalCurveOverallPage() {
  const searchParams = useSearchParams();
  const facility = searchParams.get('facility') || '全施設';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader 
        title="全体定着率推移分析" 
        showBackButton={true}
        backUrl="/reports"
        backText="レポートセンターに戻る"
      />
      
      <div className="container mx-auto px-4 py-8">
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

          {/* グラフプレースホルダー */}
          <div className="bg-gray-100 rounded-lg p-8 mb-6 text-center">
            <div className="text-gray-500 mb-4">
              <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-lg font-medium">生存曲線グラフ</p>
              <p className="text-sm">ここにKaplan-Meier曲線が表示されます</p>
            </div>
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
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              PDFダウンロード
            </button>
            <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition">
              Excelエクスポート
            </button>
          </div>
        </div>
      </div>
      <DashboardButton />
    </div>
  );
}