import { NextRequest, NextResponse } from 'next/server';
import {
  EnhancedInterviewReservation,
  BookingConfirmationResponse
} from '@/types/pattern-d-interview';

/**
 * POST /api/interviews/confirm-choice
 * 職員による推薦候補の最終選択・予約確定
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. リクエストバリデーション
    const validationError = validateConfirmationRequest(body);
    if (validationError) {
      return NextResponse.json(
        {
          success: false,
          error: validationError
        },
        { status: 400 }
      );
    }

    const { requestId, selectedProposalId, staffFeedback } = body;

    // 2. 元の申込情報と推薦結果を取得
    const originalRequest = await getOriginalRequest(requestId);
    const selectedProposal = await getSelectedProposal(requestId, selectedProposalId);

    if (!originalRequest || !selectedProposal) {
      return NextResponse.json(
        {
          success: false,
          error: 'Request or proposal not found',
          message: '申込または推薦候補が見つかりません。'
        },
        { status: 404 }
      );
    }

    // 3. 面談予約の作成
    const bookingId = generateBookingId();
    const reservation: EnhancedInterviewReservation = {
      // 基本情報
      id: bookingId,
      type: originalRequest.type,
      staffId: originalRequest.staffId,
      staffName: originalRequest.staffName,
      department: originalRequest.department,
      position: originalRequest.position,
      experienceYears: originalRequest.experienceYears,
      scheduledDate: new Date(selectedProposal.schedule.date),
      scheduledTime: selectedProposal.schedule.time,
      duration: selectedProposal.schedule.duration,
      status: 'confirmed',

      // Pattern D拡張情報
      bookingType: 'ai_optimized',
      originalRequest,
      selectedRecommendationId: selectedProposalId,

      // 担当者情報
      interviewerInfo: {
        id: selectedProposal.interviewer.id,
        name: selectedProposal.interviewer.name,
        title: selectedProposal.interviewer.title,
        department: selectedProposal.interviewer.department
      },

      // システム情報
      source: 'voicedrive',
      createdBy: `職員:${originalRequest.staffName}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // 4. データベースに予約保存
    await saveReservation(reservation);

    // 5. 関係者への通知処理
    const notificationResults = await notifyStakeholders(reservation);

    // 6. 学習データとして記録
    await recordLearningData(requestId, selectedProposalId, staffFeedback);

    // 7. 確定通知の準備
    const confirmationResponse: BookingConfirmationResponse = {
      bookingId,
      reservation,
      confirmationDetails: {
        interviewerNotified: notificationResults.interviewerNotified,
        calendarUpdated: notificationResults.calendarUpdated,
        reminderScheduled: notificationResults.reminderScheduled
      },
      message: `面談が確定しました。${selectedProposal.schedule.date} ${selectedProposal.schedule.time}に${selectedProposal.interviewer.name}${selectedProposal.interviewer.title}との面談を予定しています。`
    };

    // 8. 成功ログ記録
    await logBookingConfirmation(requestId, bookingId, selectedProposalId);

    // 9. リアルタイム通知（VoiceDrive向け）
    await sendRealTimeUpdate(requestId, {
      status: 'confirmed',
      message: '面談予約が確定しました',
      bookingId,
      actionRequired: false
    });

    return NextResponse.json({
      success: true,
      data: confirmationResponse
    }, { status: 201 });

  } catch (error) {
    console.error('Booking confirmation failed:', error);

    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: '予約確定に失敗しました。人事部にお問い合わせください。'
    }, { status: 500 });
  }
}

/**
 * 確定リクエストのバリデーション
 */
function validateConfirmationRequest(body: any): string | null {
  if (!body.requestId) {
    return 'Request ID is required';
  }

  if (!body.selectedProposalId) {
    return 'Selected proposal ID is required';
  }

  return null;
}

/**
 * 元の申込情報取得
 */
async function getOriginalRequest(requestId: string) {
  // TODO: データベースから取得
  // 現在はモック実装
  return {
    staffId: 'OH-NS-2021-001',
    staffName: '田中 花子',
    department: '内科',
    position: '看護師',
    experienceYears: 3,
    type: 'support',
    category: 'career_support',
    topic: 'キャリアプラン相談',
    urgencyLevel: 'this_week',
    timePreference: {
      morning: false,
      afternoon: true,
      evening: false,
      anytime: false
    },
    interviewerPreference: {
      anyAvailable: true
    },
    minDuration: 30,
    maxDuration: 45
  };
}

/**
 * 選択された推薦候補取得
 */
async function getSelectedProposal(requestId: string, proposalId: string) {
  // TODO: 実際の推薦結果から取得
  // 現在はモック実装
  if (proposalId === 'REC-001') {
    return {
      id: 'REC-001',
      confidence: 92,
      interviewer: {
        id: 'INT-001',
        name: '田中美香子',
        title: '看護師長',
        department: 'キャリア支援室',
        experience: '看護師15年、キャリア相談専門5年'
      },
      schedule: {
        date: '2025-09-20',
        time: '14:30',
        duration: 45,
        location: '相談室A',
        format: 'face_to_face'
      }
    };
  }

  return null;
}

/**
 * 予約保存
 */
async function saveReservation(reservation: EnhancedInterviewReservation) {
  // TODO: データベース保存
  console.log('Saving reservation:', reservation.id);

  // 重複チェック
  const exists = await checkReservationExists(
    reservation.staffId,
    reservation.scheduledDate,
    reservation.scheduledTime
  );

  if (exists) {
    throw new Error('Duplicate reservation detected');
  }

  // 実際の保存処理
  // await db.enhanced_interview_reservations.create(reservation);
}

/**
 * 重複予約チェック
 */
async function checkReservationExists(
  staffId: string,
  date: Date,
  time: string
): Promise<boolean> {
  // TODO: データベースチェック
  return false;
}

/**
 * 関係者通知
 */
async function notifyStakeholders(reservation: EnhancedInterviewReservation) {
  const results = {
    interviewerNotified: false,
    calendarUpdated: false,
    reminderScheduled: false
  };

  try {
    // 1. 担当者への通知
    await notifyInterviewer(reservation);
    results.interviewerNotified = true;

    // 2. カレンダー更新
    await updateCalendar(reservation);
    results.calendarUpdated = true;

    // 3. リマインダー設定
    await scheduleReminder(reservation);
    results.reminderScheduled = true;

  } catch (error) {
    console.error('Stakeholder notification failed:', error);
  }

  return results;
}

/**
 * 担当者通知
 */
async function notifyInterviewer(reservation: EnhancedInterviewReservation) {
  const message = `
面談予約が確定しました：

・日時: ${reservation.scheduledDate.toLocaleDateString()} ${reservation.scheduledTime}
・職員: ${reservation.staffName} (${reservation.department} ${reservation.position})
・場所: 相談室A
・所要時間: ${reservation.duration}分
・種別: AI最適化によるおまかせ予約

ご確認をお願いします。
`;

  // TODO: メール/チャット通知
  console.log(`Notifying interviewer: ${reservation.interviewerInfo.name}`);
  console.log(message);
}

/**
 * カレンダー更新
 */
async function updateCalendar(reservation: EnhancedInterviewReservation) {
  // TODO: カレンダーシステム連携
  console.log(`Calendar updated for: ${reservation.id}`);
}

/**
 * リマインダー設定
 */
async function scheduleReminder(reservation: EnhancedInterviewReservation) {
  // TODO: リマインダースケジューリング
  console.log(`Reminder scheduled for: ${reservation.id}`);
}

/**
 * 学習データ記録
 */
async function recordLearningData(
  requestId: string,
  selectedProposalId: string,
  staffFeedback?: string
) {
  const learningData = {
    requestId,
    selectedProposalId,
    selectionTime: Date.now(),
    staffFeedback,
    timestamp: new Date().toISOString()
  };

  // TODO: AI学習用データとして保存
  console.log('Recording learning data:', learningData);
}

/**
 * 予約ID生成
 */
function generateBookingId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 6);
  return `AI-BOOK-${timestamp}-${random}`;
}

/**
 * リアルタイム更新送信
 */
async function sendRealTimeUpdate(requestId: string, update: any) {
  // TODO: WebSocket/SSE実装
  console.log(`Real-time update for ${requestId}:`, update);
}

/**
 * 確定ログ記録
 */
async function logBookingConfirmation(
  requestId: string,
  bookingId: string,
  selectedProposalId: string
) {
  const logEntry = {
    requestId,
    bookingId,
    selectedProposalId,
    timestamp: new Date().toISOString(),
    action: 'booking_confirmed',
    source: 'voicedrive'
  };

  // TODO: ログDB保存
  console.log('Booking confirmed:', logEntry);
}