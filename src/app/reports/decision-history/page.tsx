'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * 判断履歴レポートページ
 *
 * Phase 6: VoiceDrive期限到達判断履歴機能
 * - 期限到達した提案の判断履歴を権限レベル別に表示
 * - LEVEL_5以上でアクセス可能（現在は実装準備中のため全員アクセス可）
 *
 * 関連ドキュメント:
 * - mcp-shared/docs/phase6-expired-escalation-implementation-request.md
 */

export default function DecisionHistoryPage() {
  const router = useRouter();
  const [isLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg p-4 text-3xl">
                ⚖️
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">判断履歴</h1>
                <p className="text-gray-600 mt-1">
                  期限到達提案の判断履歴と統計を権限レベル別に表示
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push('/reports')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* 実装準備中の案内 */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Phase 6: 実装準備中
              </h3>
              <div className="text-blue-800 space-y-2">
                <p>
                  <strong>判断履歴機能</strong>は、VoiceDriveの期限到達エスカレーション機能と連携し、
                  提案の判断履歴を権限レベル別に表示します。
                </p>
                <div className="mt-4 bg-white rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">実装予定機能</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>サマリー統計</strong>: 総判断件数、承認率、平均判断日数、平均到達率</li>
                    <li><strong>判断履歴一覧</strong>: 提案内容、判断結果、判断者、判断理由</li>
                    <li><strong>権限レベル別フィルタリング</strong>: LEVEL_1-4（自分の提案）、LEVEL_5-6（自分の判断）、LEVEL_7+（部署・施設統計）</li>
                    <li><strong>期間フィルタ</strong>: 日付範囲指定</li>
                    <li><strong>PDF出力</strong>: レポート形式で出力</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 権限レベル別の機能案内 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* LEVEL_1-4 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 text-blue-600 rounded-lg p-3 text-xl">
                👤
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">LEVEL 1-4</h3>
                <p className="text-sm text-gray-600">一般職員</p>
              </div>
            </div>
            <div className="text-sm text-gray-700 space-y-2">
              <p className="font-medium">表示内容：</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>自分が提案した案件の判断履歴</li>
                <li>判断結果と理由</li>
              </ul>
            </div>
          </div>

          {/* LEVEL_5-6 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 text-green-600 rounded-lg p-3 text-xl">
                👥
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">LEVEL 5-6</h3>
                <p className="text-sm text-gray-600">副主任・主任</p>
              </div>
            </div>
            <div className="text-sm text-gray-700 space-y-2">
              <p className="font-medium">表示内容：</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>自分が判断した案件の履歴</li>
                <li>チーム統計</li>
                <li>判断品質の振り返り</li>
              </ul>
            </div>
          </div>

          {/* LEVEL_7-8 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 text-purple-600 rounded-lg p-3 text-xl">
                🏢
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">LEVEL 7-8</h3>
                <p className="text-sm text-gray-600">副師長・師長、副課長・課長</p>
              </div>
            </div>
            <div className="text-sm text-gray-700 space-y-2">
              <p className="font-medium">表示内容：</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>部署全体の判断履歴</li>
                <li>管理職別の判断傾向</li>
                <li>部署統計</li>
              </ul>
            </div>
          </div>

          {/* LEVEL_9-13 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-orange-100 text-orange-600 rounded-lg p-3 text-xl">
                🏥
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">LEVEL 9-13</h3>
                <p className="text-sm text-gray-600">部長・副院長・院長</p>
              </div>
            </div>
            <div className="text-sm text-gray-700 space-y-2">
              <p className="font-medium">表示内容：</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>施設全体の判断履歴</li>
                <li>部署別比較</li>
                <li>管理職ランキング</li>
              </ul>
            </div>
          </div>

          {/* LEVEL_14-18 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 text-red-600 rounded-lg p-3 text-xl">
                🏛️
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">LEVEL 14-18</h3>
                <p className="text-sm text-gray-600">人事部・理事長</p>
              </div>
            </div>
            <div className="text-sm text-gray-700 space-y-2">
              <p className="font-medium">表示内容：</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>法人全体の判断履歴</li>
                <li>施設別比較</li>
                <li>CSVエクスポート</li>
                <li>詳細分析</li>
              </ul>
            </div>
          </div>

          {/* LEVEL_99 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gray-100 text-gray-600 rounded-lg p-3 text-xl">
                🔧
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">LEVEL 99</h3>
                <p className="text-sm text-gray-600">システム管理者</p>
              </div>
            </div>
            <div className="text-sm text-gray-700 space-y-2">
              <p className="font-medium">表示内容：</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>全データアクセス</li>
                <li>システム監査ログ</li>
                <li>デバッグ情報</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 実装スケジュール */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">実装スケジュール</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-32 text-sm font-medium text-gray-700">Phase 1</div>
              <div className="flex-1">
                <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm">
                  基本実装（3日）- レポートセンター統合、基本ページ作成、権限チェック
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-32 text-sm font-medium text-gray-700">Phase 2</div>
              <div className="flex-1">
                <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm">
                  API統合（2日）- MCPサーバー経由データ取得、フィルタリング、ページネーション
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-32 text-sm font-medium text-gray-700">Phase 3</div>
              <div className="flex-1">
                <div className="bg-purple-100 text-purple-800 px-3 py-2 rounded-lg text-sm">
                  UI完成（2日）- サマリー統計、判断履歴テーブル、フィルタUI
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-32 text-sm font-medium text-gray-700">Phase 4</div>
              <div className="flex-1">
                <div className="bg-orange-100 text-orange-800 px-3 py-2 rounded-lg text-sm">
                  PDF出力（1日）- PDF生成機能、レイアウト調整
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            合計: 8営業日（約2週間）
          </div>
        </div>

        {/* フッター */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>レポート生成日時: {new Date().toLocaleString('ja-JP')}</p>
          <p className="mt-1">医療法人厚生会 人事管理システム - Phase 6: 判断履歴機能</p>
        </div>
      </div>
    </div>
  );
}
