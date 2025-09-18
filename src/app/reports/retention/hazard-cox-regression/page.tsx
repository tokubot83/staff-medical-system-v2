'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import { exportToPDF } from '@/utils/pdfExport';

function HazardCoxRegressionContent() {
  const searchParams = useSearchParams();
  const facility = searchParams.get('facility') || '全施設';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="退職リスク要因刁E��" />
      
      <div id="report-content" className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Cox比例ハザードモチE��刁E��</h2>
            <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              対象施設: {facility}
            </span>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600">
              褁E��の要因が退職リスクに与える影響を統計的に刁E��し、各要因のハザード比を算�Eします、E            </p>
          </div>

          {/* ハザード比ランキング */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">退職リスク要因ランキング</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-red-600">1</span>
                  <div>
                    <h4 className="font-medium text-gray-800">趁E��勤務時間（月60時間以上！E/h4>
                    <p className="text-sm text-gray-600">過度な残業による身体的・精神的負拁E/p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-red-600">3.21</p>
                  <p className="text-xs text-gray-500">ハザード毁E/p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-orange-50 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-orange-600">2</span>
                  <div>
                    <h4 className="font-medium text-gray-800">上司との関係性�E�低評価�E�E/h4>
                    <p className="text-sm text-gray-600">職場の人間関係に関する満足度</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-orange-600">2.85</p>
                  <p className="text-xs text-gray-500">ハザード毁E/p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-yellow-600">3</span>
                  <div>
                    <h4 className="font-medium text-gray-800">給与満足度�E�不満�E�E/h4>
                    <p className="text-sm text-gray-600">現在の給与水準への満足度</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-yellow-600">2.14</p>
                  <p className="text-xs text-gray-500">ハザード毁E/p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-600">4</span>
                  <div>
                    <h4 className="font-medium text-gray-800">キャリア開発機会（なし！E/h4>
                    <p className="text-sm text-gray-600">研修めE��キルアチE�Eの機企E/p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-600">1.92</p>
                  <p className="text-xs text-gray-500">ハザード毁E/p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-600">5</span>
                  <div>
                    <h4 className="font-medium text-gray-800">年齢�E�E5歳未満�E�E/h4>
                    <p className="text-sm text-gray-600">若年層の転職傾吁E/p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-600">1.68</p>
                  <p className="text-xs text-gray-500">ハザード毁E/p>
                </div>
              </div>
            </div>
          </div>

          {/* 統計的有意性 */}
          <div className="bg-gray-100 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-gray-800 mb-3">モチE��の統計的検証</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">サンプル数</p>
                <p className="text-xl font-bold text-gray-900">1,245吁E/p>
              </div>
              <div>
                <p className="text-sm text-gray-600">観測期間</p>
                <p className="text-xl font-bold text-gray-900">5年閁E/p>
              </div>
              <div>
                <p className="text-sm text-gray-600">モチE��適合度</p>
                <p className="text-xl font-bold text-gray-900">R² = 0.82</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">p値</p>
                <p className="text-xl font-bold text-gray-900">&lt; 0.001</p>
              </div>
            </div>
          </div>

          {/* 推奨アクション */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">推奨アクション</h4>
            <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
              <li>残業時間管琁E��スチE��の強化と朁E0時間上限の徹庁E/li>
              <li>管琁E�E向けのマネジメント研修とメンタリングプログラムの導�E</li>
              <li>給与体系の見直しと成果連動型インセンチE��ブ�E検訁E/li>
              <li>キャリアパス制度の明確化と個人別育成計画の策宁E/li>
            </ul>
          </div>

          {/* アクションボタン */}
          <div className="flex gap-4 mt-8">
            <button 
              onClick={() => exportToPDF({
                title: 'ハザード�E析！Eox回帰�E�レポ�EチE,
                facility: facility,
                reportType: 'hazard-cox-regression',
                elementId: 'report-content',
                dateRange: new Date().toLocaleDateString('ja-JP')
              })}
              className="pdf-exclude bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              PDFダウンローチE            </button>
            <button className="pdf-exclude bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition">
              チE�Eタエクスポ�EチE            </button>
          </div>
        </div>
      </div><CategoryTopButton categoryPath="/reports?tab=retention" categoryName="定着刁E��" /></div>
  );
}

export default function HazardCoxRegressionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">読み込み中...</div></div>}>
      <HazardCoxRegressionContent />
    </Suspense>
  );
}