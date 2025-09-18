'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { exportToPDF } from '@/utils/pdfExport';

function FactorRankingContent() {
  const searchParams = useSearchParams();
  const facility = searchParams.get('facility') || '全施設';

  return (
    <div className="min-h-screen bg-gray-50">
      <div id="report-content" className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">離職に影響する要因の重要度ランキング</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                対象施設: {facility}
              </span>
              <button
                onClick={() => exportToPDF({
                  title: '離職要因ランキングレポート',
                  facility: facility,
                  reportType: 'turnover-factor-ranking',
                  elementId: 'report-content',
                  dateRange: new Date().toLocaleDateString('ja-JP')
                })}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm pdf-exclude"
              >
                PDFダウンロード
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600">
              機械学習モデルによる特徴量重要度分析に基づき、離職に最も影響を与える要因をランキング形式で表示します。
            </p>
          </div>

          {/* 要因ランキング */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">重要度ランキング TOP10</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-red-600">1</span>
                  <div>
                    <h4 className="font-medium text-gray-800">面談頻度の不足</h4>
                    <p className="text-sm text-gray-600">定期的な1on1面談の実施頻度が月1回未満</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-red-600">0.89</p>
                  <p className="text-xs text-gray-500">重要度スコア</p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-orange-50 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-orange-600">2</span>
                  <div>
                    <h4 className="font-medium text-gray-800">高ストレス状態</h4>
                    <p className="text-sm text-gray-600">ストレスチェックのスコアが70点以上</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-orange-600">0.76</p>
                  <p className="text-xs text-gray-500">重要度スコア</p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-yellow-600">3</span>
                  <div>
                    <h4 className="font-medium text-gray-800">低エンゲージメント</h4>
                    <p className="text-sm text-gray-600">職場への愛着・やりがいスコアが30%以下</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-yellow-600">0.68</p>
                  <p className="text-xs text-gray-500">重要度スコア</p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-600">4</span>
                  <div>
                    <h4 className="font-medium text-gray-800">長時間残業</h4>
                    <p className="text-sm text-gray-600">月間残業時間が45時間以上</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-600">0.54</p>
                  <p className="text-xs text-gray-500">重要度スコア</p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-600">5</span>
                  <div>
                    <h4 className="font-medium text-gray-800">夜勤回数過多</h4>
                    <p className="text-sm text-gray-600">月間夜勤回数が10回以上</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-600">0.47</p>
                  <p className="text-xs text-gray-500">重要度スコア</p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-600">6</span>
                  <div>
                    <h4 className="font-medium text-gray-800">有給取得率の低さ</h4>
                    <p className="text-sm text-gray-600">年間有給取得率が40%未満</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-600">0.39</p>
                  <p className="text-xs text-gray-500">重要度スコア</p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-600">7</span>
                  <div>
                    <h4 className="font-medium text-gray-800">昇進機会の不足</h4>
                    <p className="text-sm text-gray-600">3年以上同一職位での滞留</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-600">0.32</p>
                  <p className="text-xs text-gray-500">重要度スコア</p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-600">8</span>
                  <div>
                    <h4 className="font-medium text-gray-800">研修参加機会の少なさ</h4>
                    <p className="text-sm text-gray-600">年間研修参加時間が20時間未満</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-600">0.28</p>
                  <p className="text-xs text-gray-500">重要度スコア</p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-600">9</span>
                  <div>
                    <h4 className="font-medium text-gray-800">勤続年数の短さ</h4>
                    <p className="text-sm text-gray-600">入社1年未満の新入職員</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-600">0.21</p>
                  <p className="text-xs text-gray-500">重要度スコア</p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-600">10</span>
                  <div>
                    <h4 className="font-medium text-gray-800">年齢（若年層）</h4>
                    <p className="text-sm text-gray-600">25歳未満の若手職員</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-600">0.15</p>
                  <p className="text-xs text-gray-500">重要度スコア</p>
                </div>
              </div>
            </div>
          </div>

          {/* 分析手法の説明 */}
          <div className="bg-gray-100 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-gray-800 mb-3">分析手法</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <p>・ランダムフォレスト、XGBoost、LightGBMの3つの機械学習モデルを使用</p>
              <p>・各モデルの特徴量重要度を算出し、平均値を計算</p>
              <p>・過去3年間の退職者データ（n=523）を学習データとして使用</p>
              <p>・モデルの予測精度：AUC = 0.92（高精度な予測が可能）</p>
            </div>
          </div>

          {/* 重要な発見 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-900 mb-2">重要な発見</h4>
            <p className="text-sm text-blue-800">
              従来「若い人がすぐ辞める」という通説がありましたが、データ分析の結果、
              年齢の影響度は10位（0.15）と低く、最も重要なのは「面談頻度」（0.89）であることが判明しました。
              月1回以上の定期面談を実施することで、離職リスクを大幅に低減できる可能性があります。
            </p>
          </div>

          {/* アクションボタン */}
          <div className="flex gap-4 mt-8">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              詳細分析レポート
            </button>
            <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition">
              データエクスポート
            </button>
          </div>
        </div>
      </div></div>
  );
}

export default function FactorRankingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">読み込み中...</div></div>}>
      <FactorRankingContent />
    </Suspense>
  );
}