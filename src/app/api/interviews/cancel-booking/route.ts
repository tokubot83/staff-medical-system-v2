import { NextRequest, NextResponse } from 'next/server';
import { InterviewReservationService } from '@/services/interviewReservationService';

/**
 * POST /api/interviews/cancel-booking
 * VoiceDriveからの面談キャンセル受信API
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. リクエストバリデーション
    const validationError = validateCancellationRequest(body);
    if (validationError) {
      return NextResponse.json(
        {
          success: false,
          error: validationError
        },
        { status: 400 }
      );
    }

    const {
      bookingId,
      voicedriveRequestId,
      cancellationType,
      reason,
      detailedReason,
      contactMethod,
      cancelledBy,
      cancelTimestamp
    } = body;

    // 2. 予約の存在確認
    const existingReservation = await InterviewReservationService.getReservation(bookingId);
    if (!existingReservation) {
      return NextResponse.json(
        {
          success: false,
          error: 'Reservation not found',
          message: '指定された予約が見つかりません。'
        },
        { status: 404 }
      );
    }

    // 3. キャンセル可能性チェック
    const cancellationCheck = await validateCancellationTiming(
      existingReservation,
      cancellationType,
      cancelTimestamp
    );

    if (!cancellationCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cancellation not allowed',
          message: cancellationCheck.reason,
          suggestedActions: cancellationCheck.alternatives
        },
        { status: 403 }
      );
    }

    // 4. キャンセル処理実行
    const cancellationResult = await processCancellation({
      reservation: existingReservation,
      cancellationType,
      reason,
      detailedReason,
      contactMethod,
      cancelledBy,
      cancelTimestamp,
      voicedriveRequestId
    });

    // 5. 関係者通知
    await notifyStakeholdersOfCancellation(cancellationResult);

    // 6. VoiceDrive側に確認通知送信
    await sendCancellationConfirmation(voicedriveRequestId, cancellationResult);

    // 7. ログ記録
    await logCancellation(bookingId, cancellationType, reason, cancelledBy);

    return NextResponse.json({
      success: true,
      data: {
        cancellationId: cancellationResult.cancellationId,
        status: 'cancelled',
        processedAt: new Date().toISOString(),
        refundInfo: cancellationResult.refundInfo,
        notificationsSent: cancellationResult.notifications,
        message: generateCancellationMessage(cancellationType, existingReservation)
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Cancellation processing failed:', error);

    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'キャンセル処理に失敗しました。人事部にお問い合わせください。'
    }, { status: 500 });
  }
}

/**
 * キャンセルリクエストのバリデーション
 */
function validateCancellationRequest(body: any): string | null {
  const requiredFields = [
    'bookingId',
    'voicedriveRequestId',
    'cancellationType',
    'reason',
    'cancelledBy',
    'cancelTimestamp'
  ];

  for (const field of requiredFields) {
    if (!body[field]) {
      return `${field} is required`;
    }
  }

  const validCancellationTypes = ['emergency', 'same_day', 'advance'];
  if (!validCancellationTypes.includes(body.cancellationType)) {
    return 'Invalid cancellation type';
  }

  const validContactMethods = ['phone', 'direct', 'email'];
  if (body.contactMethod && !validContactMethods.includes(body.contactMethod)) {
    return 'Invalid contact method';
  }

  return null;
}

/**
 * キャンセル可能性・タイミングチェック
 */
async function validateCancellationTiming(
  reservation: any,
  cancellationType: string,
  cancelTimestamp: string
): Promise<{
  allowed: boolean;
  reason?: string;
  alternatives?: string[];
}> {
  const now = new Date(cancelTimestamp);
  const scheduledDateTime = new Date(`${reservation.scheduledDate} ${reservation.scheduledTime}`);
  const hoursUntilInterview = (scheduledDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

  switch (cancellationType) {
    case 'emergency':
      // 緊急キャンセル: 2時間前以降
      if (hoursUntilInterview < 0) {
        return {
          allowed: false,
          reason: '面談開始時刻を過ぎているため、キャンセルできません。',
          alternatives: ['人事部直接連絡 (内線1234)']
        };
      }
      return { allowed: true };

    case 'same_day':
      // 当日キャンセル: 面談当日
      const isSameDay = scheduledDateTime.toDateString() === now.toDateString();
      if (!isSameDay) {
        return {
          allowed: false,
          reason: '当日キャンセルは面談当日のみ可能です。',
          alternatives: ['事前キャンセルに変更', '日時変更リクエスト']
        };
      }
      if (hoursUntilInterview < 2) {
        return {
          allowed: false,
          reason: '面談2時間前以降は緊急キャンセルとして処理してください。',
          alternatives: ['緊急キャンセルに変更']
        };
      }
      return { allowed: true };

    case 'advance':
      // 事前キャンセル: 前日まで
      if (hoursUntilInterview < 24) {
        return {
          allowed: false,
          reason: '面談24時間前以降は当日キャンセル扱いとなります。',
          alternatives: ['当日キャンセルに変更']
        };
      }
      return { allowed: true };

    default:
      return {
        allowed: false,
        reason: '不正なキャンセル種別です。'
      };
  }
}

/**
 * キャンセル処理実行
 */
async function processCancellation(params: {
  reservation: any;
  cancellationType: string;
  reason: string;
  detailedReason?: string;
  contactMethod?: string;
  cancelledBy: string;
  cancelTimestamp: string;
  voicedriveRequestId: string;
}) {
  const cancellationId = generateCancellationId();

  // データベース更新
  await InterviewReservationService.updateReservationStatus(
    params.reservation.id,
    'cancelled',
    `VoiceDrive:${params.cancelledBy}`
  );

  // キャンセル詳細記録
  const cancellationDetails = {
    cancellationId,
    originalBookingId: params.reservation.id,
    cancellationType: params.cancellationType,
    reason: params.reason,
    detailedReason: params.detailedReason,
    contactMethod: params.contactMethod,
    cancelledBy: params.cancelledBy,
    cancelTimestamp: params.cancelTimestamp,
    voicedriveRequestId: params.voicedriveRequestId,
    processedAt: new Date().toISOString()
  };

  // TODO: キャンセル詳細をデータベースに保存
  await saveCancellationDetails(cancellationDetails);

  // 返金情報計算
  const refundInfo = calculateRefundInfo(params.reservation, params.cancellationType);

  return {
    cancellationId,
    cancellationDetails,
    refundInfo,
    notifications: []
  };
}

/**
 * 関係者への通知
 */
async function notifyStakeholdersOfCancellation(cancellationResult: any) {
  const notifications = [];

  try {
    // 1. 担当者への通知
    await notifyInterviewerOfCancellation(cancellationResult);
    notifications.push('interviewer_notified');

    // 2. 部門管理者への通知（緊急の場合）
    if (cancellationResult.cancellationDetails.cancellationType === 'emergency') {
      await notifyDepartmentManager(cancellationResult);
      notifications.push('manager_notified');
    }

    // 3. 人事部への通知
    await notifyHRDepartment(cancellationResult);
    notifications.push('hr_notified');

    // 4. カレンダー更新
    await removeFromCalendar(cancellationResult.cancellationDetails.originalBookingId);
    notifications.push('calendar_updated');

  } catch (error) {
    console.error('Notification failed:', error);
  }

  cancellationResult.notifications = notifications;
  return cancellationResult;
}

/**
 * VoiceDrive側への確認通知送信
 */
async function sendCancellationConfirmation(
  voicedriveRequestId: string,
  cancellationResult: any
) {
  const confirmationData = {
    voicedriveRequestId,
    cancellationId: cancellationResult.cancellationId,
    status: 'cancellation_processed',
    processedAt: new Date().toISOString(),
    refundInfo: cancellationResult.refundInfo,
    notificationsSent: cancellationResult.notifications,
    message: 'キャンセル処理が完了しました'
  };

  try {
    // TODO: VoiceDrive側APIに送信
    const response = await fetch('https://voicedrive-api.hospital.jp/api/cancellation-confirmed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.VOICEDRIVE_API_TOKEN
      },
      body: JSON.stringify(confirmationData)
    });

    if (!response.ok) {
      throw new Error('VoiceDrive notification failed');
    }

    console.log('Cancellation confirmation sent to VoiceDrive');
  } catch (error) {
    console.error('Failed to notify VoiceDrive:', error);
    // TODO: 再送キューに追加
  }
}

/**
 * 担当者への通知
 */
async function notifyInterviewerOfCancellation(cancellationResult: any) {
  const details = cancellationResult.cancellationDetails;

  const message = `
面談キャンセルのお知らせ：

・キャンセル種別: ${getCancellationTypeLabel(details.cancellationType)}
・理由: ${details.reason}
・キャンセル者: ${details.cancelledBy}
・キャンセル時刻: ${details.cancelTimestamp}

該当する面談枠が空きました。
詳細はシステムでご確認ください。
`;

  // TODO: メール/チャット通知実装
  console.log(`Notifying interviewer about cancellation: ${details.cancellationId}`);
  console.log(message);
}

/**
 * 部門管理者への通知（緊急時）
 */
async function notifyDepartmentManager(cancellationResult: any) {
  const details = cancellationResult.cancellationDetails;

  const message = `
緊急面談キャンセル発生：

・職員: ${details.cancelledBy}
・理由: ${details.reason}
・詳細: ${details.detailedReason || 'なし'}
・時刻: ${details.cancelTimestamp}

緊急対応が必要な場合は速やかにご連絡ください。
`;

  // TODO: 緊急通知実装（電話・SMS等）
  console.log(`Emergency cancellation notification: ${details.cancellationId}`);
}

/**
 * 人事部への通知
 */
async function notifyHRDepartment(cancellationResult: any) {
  // TODO: 人事部システム連携
  console.log(`HR notification for cancellation: ${cancellationResult.cancellationId}`);
}

/**
 * カレンダーから削除
 */
async function removeFromCalendar(bookingId: string) {
  // TODO: カレンダーシステム連携
  console.log(`Removing from calendar: ${bookingId}`);
}

/**
 * 返金情報計算
 */
function calculateRefundInfo(reservation: any, cancellationType: string) {
  // 基本的に無料サービスのため返金はないが、
  // 将来的な有料サービス対応のための準備

  switch (cancellationType) {
    case 'advance':
      return {
        eligible: true,
        amount: 0,
        processingFee: 0,
        refundMethod: 'none'
      };
    case 'same_day':
      return {
        eligible: true,
        amount: 0,
        processingFee: 0,
        refundMethod: 'none'
      };
    case 'emergency':
      return {
        eligible: true,
        amount: 0,
        processingFee: 0,
        refundMethod: 'none',
        note: '緊急キャンセルですが、返金対象となります'
      };
    default:
      return {
        eligible: false,
        amount: 0,
        reason: '不正なキャンセル種別'
      };
  }
}

/**
 * キャンセルメッセージ生成
 */
function generateCancellationMessage(cancellationType: string, reservation: any): string {
  const typeLabels = {
    emergency: '緊急キャンセル',
    same_day: '当日キャンセル',
    advance: '事前キャンセル'
  };

  const typeLabel = typeLabels[cancellationType as keyof typeof typeLabels] || 'キャンセル';

  return `${typeLabel}が正常に処理されました。${reservation.scheduledDate} ${reservation.scheduledTime}の面談予約がキャンセルされ、関係者に通知されました。`;
}

/**
 * キャンセル種別ラベル取得
 */
function getCancellationTypeLabel(type: string): string {
  const labels = {
    emergency: '緊急キャンセル',
    same_day: '当日キャンセル',
    advance: '事前キャンセル'
  };

  return labels[type as keyof typeof labels] || type;
}

/**
 * キャンセルID生成
 */
function generateCancellationId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 6);
  return `CANCEL-${timestamp}-${random}`;
}

/**
 * キャンセル詳細保存
 */
async function saveCancellationDetails(details: any) {
  // TODO: データベース保存実装
  console.log('Saving cancellation details:', details);
}

/**
 * キャンセルログ記録
 */
async function logCancellation(
  bookingId: string,
  cancellationType: string,
  reason: string,
  cancelledBy: string
) {
  const logEntry = {
    bookingId,
    cancellationType,
    reason,
    cancelledBy,
    timestamp: new Date().toISOString(),
    action: 'booking_cancelled',
    source: 'voicedrive'
  };

  // TODO: ログDB保存
  console.log('Cancellation logged:', logEntry);
}