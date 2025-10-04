'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { staffDatabase } from '@/app/data/staffData';
import { voiceDriveInterviews } from '@/app/data/voiceDriveData';
import { VoiceDriveInterview } from '@/types/voicedrive';

// 緊急案件の型定義
interface UrgentCase {
  id: string;
  type: 'evaluation-deadline' | 'rejection' | 'high-priority' | 'voicedrive-pending' | 'interview-overdue' | 'interview-urgent';
  urgencyLevel: number; // 1-10 (10が最高)
  staffId: string;
  staffName: string;
  department: string;
  facility: string;
  title: string;
  description: string;
  deadline?: string;
  daysRemaining?: number;
  actionLabel: string;
  actionUrl: string;
  badgeColor: string;
  borderColor: string;
  bgColor: string;
  data?: any;
}

// 日付を解析する関数（"2025年2月10日" → Date）
const parseJapaneseDate = (dateStr: string): Date | null => {
  const match = dateStr.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
  if (!match) return null;
  const year = parseInt(match[1]);
  const month = parseInt(match[2]) - 1;
  const day = parseInt(match[3]);
  return new Date(year, month, day);
};

// 日付を解析する関数（"2025/09/25" → Date）
const parseSlashDate = (dateStr: string): Date | null => {
  const match = dateStr.match(/(\d{4})\/(\d{1,2})\/(\d{1,2})/);
  if (!match) return null;
  const year = parseInt(match[1]);
  const month = parseInt(match[2]) - 1;
  const day = parseInt(match[3]);
  return new Date(year, month, day);
};

// 日数差を計算する関数
const getDaysDifference = (date1: Date, date2: Date): number => {
  const diffTime = date2.getTime() - date1.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// 緊急案件を生成する関数
const generateUrgentCases = (): UrgentCase[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const urgentCases: UrgentCase[] = [];

  // 1. VoiceDrive連携案件を処理
  voiceDriveInterviews.forEach((interview) => {
    // 1-1. 評価異議申立期限（最優先）
    if (interview.evaluationResult?.appealDeadline) {
      const deadline = parseSlashDate(interview.evaluationResult.appealDeadline);
      if (deadline) {
        const daysRemaining = getDaysDifference(today, deadline);
        if (daysRemaining <= 7) {
          urgentCases.push({
            id: `eval-${interview.id}`,
            type: 'evaluation-deadline',
            urgencyLevel: 10 - daysRemaining, // 残り日数が少ないほど緊急度が高い
            staffId: interview.staffId,
            staffName: interview.staffName,
            department: interview.department,
            facility: interview.facility,
            title: '評価異議申立期限',
            description: `${interview.evaluationResult.period} 評価結果フィードバック面談 - 期限まで残り${daysRemaining}日`,
            deadline: interview.evaluationResult.appealDeadline,
            daysRemaining,
            actionLabel: '即時対応',
            actionUrl: `/interviews?id=${interview.id}`,
            badgeColor: 'bg-red-500',
            borderColor: 'border-red-500',
            bgColor: 'bg-red-50',
            data: interview,
          });
        }
      }
    }

    // 1-2. 再提案必要（拒否回数あり）
    if (interview.rejectionCount > 0) {
      urgentCases.push({
        id: `reject-${interview.id}`,
        type: 'rejection',
        urgencyLevel: 9,
        staffId: interview.staffId,
        staffName: interview.staffName,
        department: interview.department,
        facility: interview.facility,
        title: '面談再提案必要',
        description: `${interview.type} - 拒否回数${interview.rejectionCount}回・調整${interview.adjustmentCount}回目`,
        actionLabel: '再調整開始',
        actionUrl: `/interviews?id=${interview.id}`,
        badgeColor: 'bg-orange-500',
        borderColor: 'border-orange-500',
        bgColor: 'bg-orange-50',
        data: interview,
      });
    }

    // 1-3. 高優先度申込（メンタル・ハラスメント関連）
    if (interview.priority === 'high' && interview.status === 'pending') {
      const isEvaluationDeadline = interview.evaluationResult?.appealDeadline;
      if (!isEvaluationDeadline) { // 評価期限と重複しない場合のみ
        urgentCases.push({
          id: `highpri-${interview.id}`,
          type: 'high-priority',
          urgencyLevel: 8,
          staffId: interview.staffId,
          staffName: interview.staffName,
          department: interview.department,
          facility: interview.facility,
          title: '高優先度面談申込',
          description: `${interview.type} - ${interview.consultationContent}`,
          actionLabel: '緊急面談設定',
          actionUrl: `/interviews?id=${interview.id}`,
          badgeColor: 'bg-yellow-500',
          borderColor: 'border-yellow-500',
          bgColor: 'bg-yellow-50',
          data: interview,
        });
      }
    }

    // 1-4. VoiceDrive仮予約（未処理）
    if (interview.status === 'pending' && interview.priority !== 'high') {
      urgentCases.push({
        id: `pending-${interview.id}`,
        type: 'voicedrive-pending',
        urgencyLevel: 6,
        staffId: interview.staffId,
        staffName: interview.staffName,
        department: interview.department,
        facility: interview.facility,
        title: 'VoiceDrive仮予約',
        description: `${interview.type} - 受信${interview.daysElapsed}日経過`,
        actionLabel: '処理開始',
        actionUrl: `/interviews?id=${interview.id}`,
        badgeColor: 'bg-blue-500',
        borderColor: 'border-blue-500',
        bgColor: 'bg-blue-50',
        data: interview,
      });
    }
  });

  // 2. 定期面談期限を処理
  Object.values(staffDatabase).forEach((staff) => {
    if (!staff.nextMeeting) return;

    const meetingDate = parseJapaneseDate(staff.nextMeeting);
    if (!meetingDate) return;

    const daysDiff = getDaysDifference(today, meetingDate);

    // 2-1. 期限超過
    if (daysDiff < 0) {
      urgentCases.push({
        id: `overdue-${staff.id}`,
        type: 'interview-overdue',
        urgencyLevel: 5 + Math.min(Math.abs(daysDiff), 5), // 超過日数に応じて緊急度調整
        staffId: staff.id,
        staffName: staff.name,
        department: staff.department,
        facility: staff.facility || '',
        title: '定期面談期限超過',
        description: `${staff.nextMeeting}予定 - ${Math.abs(daysDiff)}日超過`,
        daysRemaining: daysDiff,
        actionLabel: '緊急対応',
        actionUrl: `/staff-cards/${staff.id}`,
        badgeColor: 'bg-red-500',
        borderColor: 'border-red-500',
        bgColor: 'bg-red-50',
        data: staff,
      });
    }
    // 2-2. 7日以内
    else if (daysDiff >= 0 && daysDiff <= 7) {
      urgentCases.push({
        id: `urgent-${staff.id}`,
        type: 'interview-urgent',
        urgencyLevel: 4,
        staffId: staff.id,
        staffName: staff.name,
        department: staff.department,
        facility: staff.facility || '',
        title: '定期面談期限間近',
        description: `${staff.nextMeeting}予定 - 残り${daysDiff === 0 ? '本日' : `${daysDiff}日`}`,
        daysRemaining: daysDiff,
        actionLabel: '面談調整',
        actionUrl: `/staff-cards/${staff.id}`,
        badgeColor: 'bg-yellow-500',
        borderColor: 'border-yellow-500',
        bgColor: 'bg-yellow-50',
        data: staff,
      });
    }
  });

  // 緊急度でソート（降順）
  return urgentCases.sort((a, b) => b.urgencyLevel - a.urgencyLevel);
};

export default function InterviewDeadlineWidget() {
  const urgentCases = useMemo(() => generateUrgentCases(), []);

  // カテゴリ別に分類
  const topUrgent = urgentCases.filter(c => c.urgencyLevel >= 8).slice(0, 5); // 最優先対応
  const voiceDrivePending = urgentCases.filter(c => c.type === 'voicedrive-pending');
  const interviewDeadlines = urgentCases.filter(c => c.type === 'interview-overdue' || c.type === 'interview-urgent');

  // 統計
  const stats = {
    topUrgentCount: topUrgent.length,
    voiceDrivePendingCount: voiceDrivePending.length,
    interviewOverdueCount: interviewDeadlines.filter(c => c.type === 'interview-overdue').length,
    interviewUrgentCount: interviewDeadlines.filter(c => c.type === 'interview-urgent').length,
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto p-5">
        <div className="mb-12">
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 shadow-lg border-2 border-red-200">
            {/* ヘッダー */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                🚨
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">面談緊急対応センター</h2>
                <p className="text-sm text-gray-600">VoiceDrive連携・定期面談期限の統合管理</p>
              </div>
            </div>

            {/* サマリーカード */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl p-5 shadow-md border-t-4 border-red-500 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-semibold text-gray-600">🔥 最優先対応</h3>
                  <span className="text-3xl font-bold text-red-600">{stats.topUrgentCount}</span>
                </div>
                <p className="text-xs text-gray-500">即時対応が必要</p>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-md border-t-4 border-blue-500 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-semibold text-gray-600">📋 VoiceDrive仮予約</h3>
                  <span className="text-3xl font-bold text-blue-600">{stats.voiceDrivePendingCount}</span>
                </div>
                <p className="text-xs text-gray-500">処理待ち案件</p>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-md border-t-4 border-orange-500 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-semibold text-gray-600">⚠️ 期限超過</h3>
                  <span className="text-3xl font-bold text-orange-600">{stats.interviewOverdueCount}</span>
                </div>
                <p className="text-xs text-gray-500">定期面談遅延</p>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-md border-t-4 border-yellow-500 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-semibold text-gray-600">⏰ 7日以内</h3>
                  <span className="text-3xl font-bold text-yellow-600">{stats.interviewUrgentCount}</span>
                </div>
                <p className="text-xs text-gray-500">早急な調整必要</p>
              </div>
            </div>

            {/* 最優先対応リスト */}
            {topUrgent.length > 0 && (
              <div className="bg-white rounded-xl p-5 shadow-md mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  🔥 最優先対応が必要
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                    {topUrgent.length}件
                  </span>
                </h3>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {topUrgent.map((item) => (
                    <Link
                      key={item.id}
                      href={item.actionUrl}
                      className={`block p-4 rounded-lg border-l-4 ${item.borderColor} ${item.bgColor} hover:shadow-md transition-all cursor-pointer`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-800">{item.staffName}</span>
                            <span className={`text-xs ${item.badgeColor} text-white px-2 py-0.5 rounded-full font-semibold`}>
                              {item.title}
                            </span>
                            {item.daysRemaining !== undefined && (
                              <span className="text-xs bg-gray-600 text-white px-2 py-0.5 rounded-full">
                                {item.daysRemaining < 0
                                  ? `${Math.abs(item.daysRemaining)}日超過`
                                  : item.daysRemaining === 0
                                  ? '本日期限'
                                  : `残り${item.daysRemaining}日`}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            {item.facility} - {item.department}
                          </div>
                          <div className="text-sm text-gray-700 mt-2 font-medium">
                            {item.description}
                          </div>
                        </div>
                        <button className={`${item.badgeColor} hover:opacity-90 text-white px-4 py-2 rounded-md text-xs font-semibold transition-colors ml-4`}>
                          {item.actionLabel}
                        </button>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 最優先対応なしの場合 */}
            {topUrgent.length === 0 && (
              <div className="bg-green-50 rounded-xl p-6 text-center border border-green-200 mb-6">
                <div className="text-4xl mb-3">✅</div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">緊急対応案件なし</h3>
                <p className="text-sm text-green-600">
                  現在、最優先対応が必要な案件はありません。
                </p>
              </div>
            )}

            {/* セカンダリ情報（VoiceDrive仮予約・定期面談期限） */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* VoiceDrive仮予約 */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  📋 VoiceDrive仮予約
                  <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                    {voiceDrivePending.length}件
                  </span>
                </h4>
                {voiceDrivePending.length > 0 ? (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {voiceDrivePending.slice(0, 3).map((item) => (
                      <Link
                        key={item.id}
                        href={item.actionUrl}
                        className="block text-sm text-blue-700 hover:text-blue-900 hover:underline"
                      >
                        • {item.staffName}（{item.department}）- {item.data.consultationContent}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-blue-600">処理待ち案件はありません</p>
                )}
              </div>

              {/* 定期面談期限 */}
              <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                <h4 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                  📅 定期面談期限
                  <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">
                    超過{stats.interviewOverdueCount}件・間近{stats.interviewUrgentCount}件
                  </span>
                </h4>
                {interviewDeadlines.length > 0 ? (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {interviewDeadlines.slice(0, 3).map((item) => (
                      <Link
                        key={item.id}
                        href={item.actionUrl}
                        className="block text-sm text-orange-700 hover:text-orange-900 hover:underline"
                      >
                        • {item.staffName}（{item.department}）- {item.description}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-orange-600">期限超過・間近の案件はありません</p>
                )}
              </div>
            </div>

            {/* アクションボタン */}
            <div className="flex gap-3 mt-6">
              <Link
                href="/interviews"
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors text-center"
              >
                📋 面談管理ページへ
              </Link>
              <Link
                href="/interviews?tab=voicedrive"
                className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors text-center"
              >
                📱 VoiceDrive連携
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
