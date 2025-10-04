'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { complianceReports, complianceStats } from '@/app/data/complianceData';
import { ComplianceReport } from '@/types/compliance';

// 緊急案件の型定義
interface UrgentComplianceCase {
  report: ComplianceReport;
  urgencyLevel: number; // 1-10 (10が最高)
  hoursRemaining: number; // 対応期限までの残り時間
  isOverdue: boolean; // 期限超過フラグ
  displayBadge: string;
  displayColor: string;
  borderColor: string;
  bgColor: string;
}

// 緊急度を計算する関数
const calculateUrgency = (report: ComplianceReport): UrgentComplianceCase => {
  const now = new Date('2025-10-04T14:00:00'); // システム現在時刻（仮）
  const deadline = new Date(report.actionDeadline);
  const hoursRemaining = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
  const isOverdue = hoursRemaining < 0;

  let urgencyLevel = 0;
  let displayBadge = '';
  let displayColor = '';
  let borderColor = '';
  let bgColor = '';

  // 緊急度判定ロジック
  if (report.status === 'unprocessed') {
    if (isOverdue) {
      // 期限超過・未対応 = 最優先
      urgencyLevel = 10;
      displayBadge = `${Math.abs(Math.floor(hoursRemaining))}時間超過`;
      displayColor = 'bg-red-600';
      borderColor = 'border-red-500';
      bgColor = 'bg-red-50';
    } else if (hoursRemaining <= 24) {
      // 24時間以内・未対応 = 超緊急
      urgencyLevel = 9;
      displayBadge = `残り${Math.floor(hoursRemaining)}時間`;
      displayColor = 'bg-orange-600';
      borderColor = 'border-orange-500';
      bgColor = 'bg-orange-50';
    } else if (hoursRemaining <= 48) {
      // 48時間以内・未対応 = 緊急
      urgencyLevel = 8;
      displayBadge = `残り${Math.floor(hoursRemaining)}時間`;
      displayColor = 'bg-yellow-600';
      borderColor = 'border-yellow-500';
      bgColor = 'bg-yellow-50';
    } else {
      urgencyLevel = 6;
      displayBadge = '未対応';
      displayColor = 'bg-blue-600';
      borderColor = 'border-blue-500';
      bgColor = 'bg-blue-50';
    }
  } else if (report.status === 'investigating') {
    urgencyLevel = 5;
    displayBadge = '調査中';
    displayColor = 'bg-indigo-600';
    borderColor = 'border-indigo-500';
    bgColor = 'bg-indigo-50';
  } else if (report.status === 'action_taken') {
    urgencyLevel = 3;
    displayBadge = '措置実施中';
    displayColor = 'bg-purple-600';
    borderColor = 'border-purple-500';
    bgColor = 'bg-purple-50';
  } else {
    urgencyLevel = 1;
    displayBadge = '解決済み';
    displayColor = 'bg-green-600';
    borderColor = 'border-green-500';
    bgColor = 'bg-green-50';
  }

  // 重大度による緊急度の加算
  if (report.severity === 'critical') urgencyLevel += 2;
  else if (report.severity === 'high') urgencyLevel += 1;

  return {
    report,
    urgencyLevel: Math.min(urgencyLevel, 10),
    hoursRemaining,
    isOverdue,
    displayBadge,
    displayColor,
    borderColor,
    bgColor,
  };
};

// 通報タイプのアイコンを返す関数
const getReportTypeIcon = (type: string): string => {
  switch (type) {
    case 'ハラスメント': return '⚠️';
    case 'パワハラ': return '💢';
    case 'セクハラ': return '🚫';
    case '労働環境': return '🏭';
    case '不正行為': return '🔍';
    case '安全衛生': return '🛡️';
    default: return '📋';
  }
};

export default function ComplianceReportWidget() {
  const urgentCases = useMemo(() => {
    return complianceReports
      .map(calculateUrgency)
      .sort((a, b) => b.urgencyLevel - a.urgencyLevel);
  }, []);

  // カテゴリ別に分類
  const criticalCases = urgentCases.filter(c => c.urgencyLevel >= 8 && c.report.status === 'unprocessed').slice(0, 5);
  const investigatingCases = urgentCases.filter(c => c.report.status === 'investigating');
  const resolvedCases = urgentCases.filter(c => c.report.status === 'resolved');

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto p-5">
        <div className="mb-12">
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 shadow-lg border-2 border-purple-200">
            {/* ヘッダー */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                🔒
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">コンプライアンス通報センター</h2>
                <p className="text-sm text-gray-600">VoiceDrive連携・匿名通報システム</p>
              </div>
            </div>

            {/* サマリーカード */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl p-5 shadow-md border-t-4 border-red-500 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-semibold text-gray-600">🚨 未対応</h3>
                  <span className="text-3xl font-bold text-red-600">{complianceStats.totalUnprocessed}</span>
                </div>
                <p className="text-xs text-gray-500">即時対応が必要</p>
                {complianceStats.overdueCount > 0 && (
                  <p className="text-xs text-red-600 mt-1 font-semibold">期限超過: {complianceStats.overdueCount}件</p>
                )}
              </div>

              <div className="bg-white rounded-xl p-5 shadow-md border-t-4 border-indigo-500 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-semibold text-gray-600">🔍 調査中</h3>
                  <span className="text-3xl font-bold text-indigo-600">{complianceStats.totalInvestigating}</span>
                </div>
                <p className="text-xs text-gray-500">対応進行中</p>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-md border-t-4 border-green-500 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-semibold text-gray-600">✅ 解決済み</h3>
                  <span className="text-3xl font-bold text-green-600">{complianceStats.totalResolved}</span>
                </div>
                <p className="text-xs text-gray-500">今月の実績</p>
              </div>
            </div>

            {/* 緊急対応リスト */}
            {criticalCases.length > 0 && (
              <div className="bg-white rounded-xl p-5 shadow-md mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  🔥 緊急対応が必要
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                    {criticalCases.length}件
                  </span>
                </h3>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {criticalCases.map((item) => (
                    <Link
                      key={item.report.id}
                      href={`/compliance/reports/${item.report.id}`}
                      className={`block p-4 rounded-lg border-l-4 ${item.borderColor} ${item.bgColor} hover:shadow-md transition-all cursor-pointer`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">{getReportTypeIcon(item.report.reportType)}</span>
                            <span className="font-bold text-gray-800">{item.report.reportType}</span>
                            <span className={`text-xs ${item.displayColor} text-white px-2 py-0.5 rounded-full font-semibold`}>
                              {item.displayBadge}
                            </span>
                            {item.report.severity === 'critical' && (
                              <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full">
                                最重要
                              </span>
                            )}
                            <span className="text-xs bg-gray-600 text-white px-2 py-0.5 rounded-full">
                              {item.report.reporterType === 'anonymous' ? '匿名' : '記名'}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            {item.report.facility} - {item.report.department}
                          </div>
                          <div className="text-sm text-gray-700 font-medium">
                            {item.report.summary}
                          </div>
                          <div className="text-xs text-gray-500 mt-2">
                            受信: {new Date(item.report.receivedAt).toLocaleString('ja-JP')} ({item.report.hoursElapsed}時間経過)
                          </div>
                          {item.report.relatedStaffCount && (
                            <div className="text-xs text-gray-500">
                              関係職員: {item.report.relatedStaffCount}名
                            </div>
                          )}
                        </div>
                        <button className={`${item.displayColor} hover:opacity-90 text-white px-4 py-2 rounded-md text-xs font-semibold transition-colors ml-4`}>
                          {item.isOverdue ? '即時対応' : '調査開始'}
                        </button>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 緊急対応なしの場合 */}
            {criticalCases.length === 0 && complianceStats.totalUnprocessed === 0 && (
              <div className="bg-green-50 rounded-xl p-6 text-center border border-green-200 mb-6">
                <div className="text-4xl mb-3">✅</div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">未対応の通報なし</h3>
                <p className="text-sm text-green-600">
                  現在、緊急対応が必要なコンプライアンス通報はありません。
                </p>
              </div>
            )}

            {/* セカンダリ情報（調査中・解決済み） */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 調査中 */}
              <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
                <h4 className="font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                  🔍 調査中の案件
                  <span className="text-xs bg-indigo-500 text-white px-2 py-0.5 rounded-full">
                    {investigatingCases.length}件
                  </span>
                </h4>
                {investigatingCases.length > 0 ? (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {investigatingCases.slice(0, 3).map((item) => (
                      <Link
                        key={item.report.id}
                        href={`/compliance/reports/${item.report.id}`}
                        className="block text-sm text-indigo-700 hover:text-indigo-900 hover:underline"
                      >
                        • {getReportTypeIcon(item.report.reportType)} {item.report.reportType}（{item.report.department}）
                        {item.report.investigator && ` - 担当: ${item.report.investigator}`}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-indigo-600">調査中の案件はありません</p>
                )}
              </div>

              {/* 解決済み */}
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                  ✅ 解決済み（今月）
                  <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                    {resolvedCases.length}件
                  </span>
                </h4>
                {resolvedCases.length > 0 ? (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {resolvedCases.slice(0, 3).map((item) => (
                      <Link
                        key={item.report.id}
                        href={`/compliance/reports/${item.report.id}`}
                        className="block text-sm text-green-700 hover:text-green-900 hover:underline"
                      >
                        • {getReportTypeIcon(item.report.reportType)} {item.report.reportType}（{item.report.department}）
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-green-600">解決済み案件はありません</p>
                )}
              </div>
            </div>

            {/* アクションボタン */}
            <div className="flex gap-3 mt-6">
              <Link
                href="/compliance/reports"
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors text-center"
              >
                📋 通報管理ページへ
              </Link>
              <Link
                href="/compliance/analytics"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors text-center"
              >
                📊 統計・分析
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
