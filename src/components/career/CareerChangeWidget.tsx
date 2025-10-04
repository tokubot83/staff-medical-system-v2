'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { careerChangeApplications, careerChangeStats } from '@/app/data/careerData';
import { CareerChangeApplication } from '@/types/career';

// コース表示用のヘルパー関数
const getCourseDisplayName = (course: string): string => {
  const courseNames: Record<string, string> = {
    'A': 'Aコース（専門性追求）',
    'B': 'Bコース（管理職）',
    'C': 'Cコース（チーム医療）',
    'D': 'Dコース（ワークライフバランス）',
  };
  return courseNames[course] || course;
};

// コース略称
const getCourseShortName = (course: string): string => {
  return `${course}コース`;
};

// 変更方向のアイコン
const getChangeIcon = (direction: string): string => {
  switch (direction) {
    case 'upgrade': return '⬆️';
    case 'downgrade': return '⬇️';
    case 'lateral': return '↔️';
    default: return '→';
  }
};

// 変更方向の表示色
const getChangeColor = (direction: string): string => {
  switch (direction) {
    case 'upgrade': return 'text-blue-600';
    case 'downgrade': return 'text-red-600';
    case 'lateral': return 'text-gray-600';
    default: return 'text-gray-600';
  }
};

// ステータスの表示
const getStatusDisplay = (status: string): { label: string; color: string } => {
  switch (status) {
    case 'pending':
      return { label: '承認待ち', color: 'bg-yellow-500' };
    case 'reviewing':
      return { label: '審査中', color: 'bg-blue-500' };
    case 'approved':
      return { label: '承認済み', color: 'bg-green-500' };
    case 'rejected':
      return { label: '却下', color: 'bg-red-500' };
    default:
      return { label: status, color: 'bg-gray-500' };
  }
};

export default function CareerChangeWidget() {
  // 緊急度順にソート
  const sortedApplications = useMemo(() => {
    return [...careerChangeApplications].sort((a, b) => b.urgencyLevel - a.urgencyLevel);
  }, []);

  // カテゴリ別に分類
  const urgentApplications = sortedApplications.filter(a => a.urgencyLevel >= 7 && a.status === 'pending').slice(0, 5);
  const reviewingApplications = sortedApplications.filter(a => a.status === 'reviewing');
  const approvedApplications = sortedApplications.filter(a => a.status === 'approved');

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto p-5">
        <div className="mb-12">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 shadow-lg border-2 border-emerald-200">
            {/* ヘッダー */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                🎯
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">キャリアコース変更申請センター</h2>
                <p className="text-sm text-gray-600">VoiceDrive連携・キャリア自律支援</p>
              </div>
            </div>

            {/* サマリーカード */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl p-5 shadow-md border-t-4 border-yellow-500 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-semibold text-gray-600">🟡 承認待ち</h3>
                  <span className="text-3xl font-bold text-yellow-600">{careerChangeStats.totalPending}</span>
                </div>
                <p className="text-xs text-gray-500">審査開始待ち</p>
                {careerChangeStats.downgradeRequests > 0 && (
                  <p className="text-xs text-red-600 mt-1 font-semibold">⬇️ ダウングレード: {careerChangeStats.downgradeRequests}件</p>
                )}
                {careerChangeStats.overduePending > 0 && (
                  <p className="text-xs text-orange-600 mt-1 font-semibold">⚠️ 7日以上未処理: {careerChangeStats.overduePending}件</p>
                )}
              </div>

              <div className="bg-white rounded-xl p-5 shadow-md border-t-4 border-blue-500 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-semibold text-gray-600">🔵 審査中</h3>
                  <span className="text-3xl font-bold text-blue-600">{careerChangeStats.totalReviewing}</span>
                </div>
                <p className="text-xs text-gray-500">検討・調整中</p>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-md border-t-4 border-green-500 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-semibold text-gray-600">✅ 承認済み</h3>
                  <span className="text-3xl font-bold text-green-600">{careerChangeStats.totalApproved}</span>
                </div>
                <p className="text-xs text-gray-500">今月の実績</p>
              </div>
            </div>

            {/* 緊急対応リスト */}
            {urgentApplications.length > 0 && (
              <div className="bg-white rounded-xl p-5 shadow-md mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  🔥 優先対応が必要
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                    {urgentApplications.length}件
                  </span>
                </h3>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {urgentApplications.map((app) => {
                    const status = getStatusDisplay(app.status);
                    const isDowngrade = app.changeDirection === 'downgrade';

                    return (
                      <Link
                        key={app.id}
                        href={`/career/applications/${app.id}`}
                        className={`block p-4 rounded-lg border-l-4 ${
                          isDowngrade ? 'border-red-500 bg-red-50' : 'border-yellow-500 bg-yellow-50'
                        } hover:shadow-md transition-all cursor-pointer`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-bold text-gray-800">{app.staffName}</span>
                              {isDowngrade && (
                                <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full font-semibold">
                                  ⚠️ 離職リスク要注意
                                </span>
                              )}
                              <span className={`text-xs ${status.color} text-white px-2 py-0.5 rounded-full`}>
                                {status.label}
                              </span>
                              {app.daysElapsed >= 7 && (
                                <span className="text-xs bg-orange-600 text-white px-2 py-0.5 rounded-full">
                                  {app.daysElapsed}日経過
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                              {app.facility} - {app.department} - {app.position}
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium">{getCourseShortName(app.currentCourse)}</span>
                              <span className={`text-lg ${getChangeColor(app.changeDirection)}`}>
                                {getChangeIcon(app.changeDirection)}
                              </span>
                              <span className="text-sm font-medium">{getCourseShortName(app.requestedCourse)}</span>
                            </div>
                            <div className="text-sm text-gray-700 bg-white p-2 rounded">
                              <strong>理由:</strong> {app.reason}
                            </div>
                            <div className="text-xs text-gray-500 mt-2">
                              申請日: {new Date(app.submittedAt).toLocaleDateString('ja-JP')}
                            </div>
                          </div>
                          <button className={`${
                            isDowngrade ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-600 hover:bg-yellow-700'
                          } text-white px-4 py-2 rounded-md text-xs font-semibold transition-colors ml-4`}>
                            {isDowngrade ? '緊急面談設定' : '審査開始'}
                          </button>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 緊急対応なしの場合 */}
            {urgentApplications.length === 0 && careerChangeStats.totalPending === 0 && (
              <div className="bg-green-50 rounded-xl p-6 text-center border border-green-200 mb-6">
                <div className="text-4xl mb-3">✅</div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">承認待ちの申請なし</h3>
                <p className="text-sm text-green-600">
                  現在、対応が必要なキャリアコース変更申請はありません。
                </p>
              </div>
            )}

            {/* セカンダリ情報（審査中・承認済み） */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 審査中 */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  🔵 審査中の申請
                  <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                    {reviewingApplications.length}件
                  </span>
                </h4>
                {reviewingApplications.length > 0 ? (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {reviewingApplications.slice(0, 3).map((app) => (
                      <Link
                        key={app.id}
                        href={`/career/applications/${app.id}`}
                        className="block text-sm text-blue-700 hover:text-blue-900 hover:underline"
                      >
                        • {app.staffName}（{app.department}）: {getCourseShortName(app.currentCourse)} → {getCourseShortName(app.requestedCourse)}
                        {app.reviewer && ` - 担当: ${app.reviewer}`}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-blue-600">審査中の申請はありません</p>
                )}
              </div>

              {/* 承認済み */}
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                  ✅ 承認済み（今月）
                  <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                    {approvedApplications.length}件
                  </span>
                </h4>
                {approvedApplications.length > 0 ? (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {approvedApplications.slice(0, 3).map((app) => (
                      <Link
                        key={app.id}
                        href={`/career/applications/${app.id}`}
                        className="block text-sm text-green-700 hover:text-green-900 hover:underline"
                      >
                        • {app.staffName}（{app.department}）: {getCourseShortName(app.currentCourse)} → {getCourseShortName(app.requestedCourse)}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-green-600">承認済み申請はありません</p>
                )}
              </div>
            </div>

            {/* アクションボタン */}
            <div className="flex gap-3 mt-6">
              <Link
                href="/career/applications"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors text-center"
              >
                📋 申請一覧ページへ
              </Link>
              <Link
                href="/hr-station"
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors text-center"
              >
                📊 人事ステーション
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
