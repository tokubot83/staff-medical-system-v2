'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import { exportToPDF } from '@/utils/pdfExport';

function FactorRankingContent() {
  const searchParams = useSearchParams();
  const facility = searchParams.get('facility') || '全施設';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="離職要因ランキング" />
      
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
                  title: '離職要因ランキングレポ�EチE,
                  facility: facility,
                  reportType: 'turnover-factor-ranking',
                  elementId: 'report-content',
                  dateRange: new Date().toLocaleDateString('ja-JP')
                })}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm pdf-exclude"
              >
                PDFダウンローチE              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600">
              機械学習モチE��による特徴量重要度刁E��に基づき、E��職に最も影響を与える要因をランキング形式で表示します、E            </p>
          </div>

          {/* 要因ランキング */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">重要度ランキング TOP10</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-red-600">1</span>
                  <div>
                    <h4 className="font-medium text-gray-800">面諁E��度の不足</h4>
                    <p className="text-sm text-gray-600">定期皁E��1on1面諁E�E実施頻度が月1回未満</p>
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
                    <h4 className="font-medium text-gray-800">高ストレス状慁E/h4>
                    <p className="text-sm text-gray-600">ストレスチェチE��のスコアぁE0点以丁E/p>
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
                    <h4 className="font-medium text-gray-800">低エンゲージメンチE/h4>
                    <p className="text-sm text-gray-600">職場への愛着・めE��がいスコアぁE0%以丁E/p>
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
                    <p className="text-sm text-gray-600">月間残業時間ぁE5時間以丁E/p>
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
                    <h4 className="font-medium text-gray-800">夜勤回数過夁E/h4>
                    <p className="text-sm text-gray-600">月間夜勤回数ぁE0回以丁E/p>
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
                    <p className="text-sm text-gray-600">年間有給取得率ぁE0%未満</p>
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
                    <h4 className="font-medium text-gray-800">昁E��機会�E不足</h4>
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
                    <h4 className="font-medium text-gray-800">研修参加機会�E少なぁE/h4>
                    <p className="text-sm text-gray-600">年間研修参加時間ぁE0時間未満</p>
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
                    <h4 className="font-medium text-gray-800">勤続年数の短ぁE/h4>
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
                    <h4 className="font-medium text-gray-800">年齢�E�若年層�E�E/h4>
                    <p className="text-sm text-gray-600">25歳未満の若手�E員</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-600">0.15</p>
                  <p className="text-xs text-gray-500">重要度スコア</p>
                </div>
              </div>
            </div>
          </div>

          {/* 刁E��手法�E説昁E*/}
          <div className="bg-gray-100 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-gray-800 mb-3">刁E��手況E/h4>
            <div className="space-y-2 text-sm text-gray-600">
              <p>・ランダムフォレスト、XGBoost、LightGBMの3つの機械学習モチE��を使用</p>
              <p>・吁E��チE��の特徴量重要度を算�Eし、平坁E��を計箁E/p>
              <p>・過去3年間�E退職老E��ータ�E�E=523�E�を学習データとして使用</p>
              <p>・モチE��の予測精度�E�AUC = 0.92�E�高精度な予測が可能�E�E/p>
            </div>
          </div>

          {/* 重要な発要E*/}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-900 mb-2">重要な発要E/h4>
            <p className="text-sm text-blue-800">
              従来「若ぁE��がすぐ辞める」とぁE��通説がありましたが、データ刁E��の結果、E              年齢の影響度は10位！E.15�E�と低く、最も重要なのは「面諁E��度」！E.89�E�であることが判明しました、E              朁E回以上�E定期面諁E��実施することで、E��職リスクを大幁E��低減できる可能性があります、E            </p>
          </div>

          {/* アクションボタン */}
          <div className="flex gap-4 mt-8">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              詳細刁E��レポ�EチE            </button>
            <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition">
              チE�Eタエクスポ�EチE            </button>
          </div>
        </div>
      </div><CategoryTopButton categoryPath="/reports?tab=turnover" categoryName="離職要因刁E��" /></div>
  );
}

export default function FactorRankingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">読み込み中...</div></div>}>
      <FactorRankingContent />
    </Suspense>
  );
}