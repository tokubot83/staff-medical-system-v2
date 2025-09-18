'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import { exportToPDF } from '@/utils/pdfExport';

function EarlyTurnoverAlertContent() {
  const searchParams = useSearchParams();
  const facility = searchParams.get('facility') || '全施設';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="早期離職アラートシスチE��" />
      
      <div id="report-content" className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">AI予測による高リスク従業員検�E</h2>
            <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              対象施設: {facility}
            </span>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600">
              機械学習モチE��により、E��職リスクの高い従業員をリアルタイムで検�Eし、早期介�Eを可能にします、E            </p>
          </div>

          {/* アラートサマリー */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-red-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </span>
                <span className="text-2xl font-bold text-red-700">12</span>
              </div>
              <p className="text-sm text-red-600 font-medium">緊急対忁E/p>
              <p className="text-xs text-gray-600">90%以上�E確玁E/p>
            </div>

            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-orange-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <span className="text-2xl font-bold text-orange-700">28</span>
              </div>
              <p className="text-sm text-orange-600 font-medium">要注愁E/p>
              <p className="text-xs text-gray-600">70-89%の確玁E/p>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-yellow-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <span className="text-2xl font-bold text-yellow-700">45</span>
              </div>
              <p className="text-sm text-yellow-600 font-medium">要観寁E/p>
              <p className="text-xs text-gray-600">50-69%の確玁E/p>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <span className="text-2xl font-bold text-green-700">1,160</span>
              </div>
              <p className="text-sm text-green-600 font-medium">低リスク</p>
              <p className="text-xs text-gray-600">50%未満</p>
            </div>
          </div>

          {/* 高リスク従業員リスチE*/}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">緊急対応が忁E��な従業員</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">社員ID</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">氏名</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">部署</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">勤綁E/th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">リスクスコア</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">主要因</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">推奨アクション</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="bg-red-50">
                    <td className="px-4 py-2 text-sm text-gray-900">N-2451</td>
                    <td className="px-4 py-2 text-sm text-gray-900">山田 太郁E/td>
                    <td className="px-4 py-2 text-sm text-gray-900">医事課</td>
                    <td className="px-4 py-2 text-sm text-gray-900">8ヶ朁E/td>
                    <td className="px-4 py-2">
                      <span className="text-red-600 font-bold">95%</span>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">過重労働�E人間関俁E/td>
                    <td className="px-4 py-2 text-sm">
                      <button className="text-blue-600 hover:text-blue-800">面諁E��施</button>
                    </td>
                  </tr>
                  <tr className="bg-red-50">
                    <td className="px-4 py-2 text-sm text-gray-900">N-3892</td>
                    <td className="px-4 py-2 text-sm text-gray-900">佐藤 花孁E/td>
                    <td className="px-4 py-2 text-sm text-gray-900">栁E��部</td>
                    <td className="px-4 py-2 text-sm text-gray-900">6ヶ朁E/td>
                    <td className="px-4 py-2">
                      <span className="text-red-600 font-bold">93%</span>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">給与不満・キャリア</td>
                    <td className="px-4 py-2 text-sm">
                      <button className="text-blue-600 hover:text-blue-800">面諁E��施</button>
                    </td>
                  </tr>
                  <tr className="bg-red-50">
                    <td className="px-4 py-2 text-sm text-gray-900">R-1234</td>
                    <td className="px-4 py-2 text-sm text-gray-900">鈴木 一郁E/td>
                    <td className="px-4 py-2 text-sm text-gray-900">リハビリ部</td>
                    <td className="px-4 py-2 text-sm text-gray-900">11ヶ朁E/td>
                    <td className="px-4 py-2">
                      <span className="text-red-600 font-bold">91%</span>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">上司関係�E業務量</td>
                    <td className="px-4 py-2 text-sm">
                      <button className="text-blue-600 hover:text-blue-800">面諁E��施</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* リスク要因の冁E�� */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3">リスク要因の刁E��E/h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">過重労僁E/span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{width: '45%'}}></div>
                    </div>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">人間関俁E/span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{width: '32%'}}></div>
                    </div>
                    <span className="text-sm font-medium">32%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">給与�E征E��</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{width: '28%'}}></div>
                    </div>
                    <span className="text-sm font-medium">28%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">キャリア不宁E/span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: '25%'}}></div>
                    </div>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3">予測モチE��の精度</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">適合率�E�Erecision�E�E/span>
                  <span className="font-medium">87.3%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">再現玁E��Eecall�E�E/span>
                  <span className="font-medium">91.2%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">F1スコア</span>
                  <span className="font-medium">89.2%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">AUC-ROC</span>
                  <span className="font-medium">0.94</span>
                </div>
              </div>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex gap-4 mt-8">
            <button 
              onClick={() => exportToPDF({
                title: '早期離職アラートレポ�EチE,
                facility: facility,
                reportType: 'early-turnover-alert',
                elementId: 'report-content',
                dateRange: new Date().toLocaleDateString('ja-JP')
              })}
              className="pdf-exclude bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              PDFダウンローチE            </button>
            <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition">
              アラート一括送信
            </button>
            <button className="pdf-exclude bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition">
              CSVエクスポ�EチE            </button>
          </div>
        </div>
      </div><CategoryTopButton categoryPath="/reports?tab=retention" categoryName="定着刁E��" /></div>
  );
}

export default function EarlyTurnoverAlertPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    }>
      <EarlyTurnoverAlertContent />
    </Suspense>
  );
}