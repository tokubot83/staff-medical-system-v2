'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import { exportToPDF } from '@/utils/pdfExport';

function HazardCoxRegressionContent() {
  const searchParams = useSearchParams();
  const facility = searchParams.get('facility') || '全施設';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="退職リスク要因分析" />
      
      <div id="report-content" className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Cox比例ハザードモデル分析</h2>
            <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              対象施設: {facility}
            </span>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600">
              複数の要因が退職リスクに与える影響を統計的に分析し、各要因のハザード比を算出します。
            </p>
          </div>

          {/* ハザード比ランキング */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">退職リスク要因ランキング</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-red-600">1</span>
                  <div>
                    <h4 className="font-medium text-gray-800">超過勤務時間（月60時間以上）</h4>
                    <p className="text-sm text-gray-600">過度な残業による身体的・精神的負担</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-red-600">3.21</p>
                  <p className="text-xs text-gray-500">ハザード比</p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-orange-50 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-orange-600">2</span>
                  <div>
                    <h4 className="font-medium text-gray-800">上司との関係性（低評価）</h4>
                    <p className="text-sm text-gray-600">職場の人間関係に関する満足度</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-orange-600">2.85</p>
                  <p className="text-xs text-gray-500">ハザード比</p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-yellow-600">3</span>
                  <div>
                    <h4 className="font-medium text-gray-800">給与満足度（不満）</h4>
                    <p className="text-sm text-gray-600">現在の給与水準への満足度</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-yellow-600">2.14</p>
                  <p className="text-xs text-gray-500">ハザード比</p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-600">4</span>
                  <div>
                    <h4 className="font-medium text-gray-800">キャリア開発機会（なし）</h4>
                    <p className="text-sm text-gray-600">研修やスキルアップの機会</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-600">1.92</p>
                  <p className="text-xs text-gray-500">ハザード比</p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-600">5</span>
                  <div>
                    <h4 className="font-medium text-gray-800">年齢（25歳未満）</h4>
                    <p className="text-sm text-gray-600">若年層の転職傾向</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-600">1.68</p>
                  <p className="text-xs text-gray-500">ハザード比</p>
                </div>
              </div>
            </div>
          </div>

          {/* 統計的有意性 */}
          <div className="bg-gray-100 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-gray-800 mb-3">モデルの統計的検証</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">サンプル数</p>
                <p className="text-xl font-bold text-gray-900">1,245名</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">観測期間</p>
                <p className="text-xl font-bold text-gray-900">5年間</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">モデル適合度</p>
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
              <li>残業時間管理システムの強化と月40時間上限の徹底</li>
              <li>管理職向けのマネジメント研修とメンタリングプログラムの導入</li>
              <li>給与体系の見直しと成果連動型インセンティブの検討</li>
              <li>キャリアパス制度の明確化と個人別育成計画の策定</li>
            </ul>
          </div>

          {/* アクションボタン */}
          <div className="flex gap-4 mt-8">
            <button 
              onClick={() => exportToPDF({
                title: 'ハザード分析（Cox回帰）レポート',
                facility: facility,
                reportType: 'hazard-cox-regression',
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

export default function HazardCoxRegressionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">読み込み中...</div></div>}>
      <HazardCoxRegressionContent />
    </Suspense>
  );
}