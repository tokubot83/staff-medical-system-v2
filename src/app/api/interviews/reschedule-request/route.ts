import { NextRequest, NextResponse } from 'next/server';
import { InterviewReservationService } from '@/services/interviewReservationService';
import { AIOptimizationEngine } from '@/services/ai-optimization-engine';

/**
 * POST /api/interviews/reschedule-request
 * VoiceDriveからの面談日時変更リクエスト受信API
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. リクエストバリデーション
    const validationError = validateRescheduleRequest(body);
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
      changeType,
      newPreferences,
      changeReason,
      requestedBy,
      requestTimestamp
    } = body;

    // 2. 元の予約確認
    const originalReservation = await InterviewReservationService.getReservation(bookingId);
    if (!originalReservation) {
      return NextResponse.json(
        {
          success: false,
          error: 'Reservation not found',
          message: '指定された予約が見つかりません。'
        },
        { status: 404 }
      );
    }

    // 3. 変更可能性チェック
    const rescheduleCheck = await validateRescheduleEligibility(
      originalReservation,
      changeType,
      requestTimestamp
    );

    if (!rescheduleCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Reschedule not allowed',
          message: rescheduleCheck.reason,
          suggestedActions: rescheduleCheck.alternatives
        },
        { status: 403 }
      );
    }

    // 4. 変更リクエスト処理
    const rescheduleRequestId = generateRescheduleRequestId();
    const rescheduleRequest = {
      id: rescheduleRequestId,
      originalBookingId: bookingId,
      voicedriveRequestId,
      changeType,
      newPreferences,
      changeReason,
      requestedBy,
      requestTimestamp,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // 5. リクエスト保存
    await saveRescheduleRequest(rescheduleRequest);

    // 6. AI最適化による新提案生成
    let optimizationResult = null;
    if (changeType === 'datetime' || changeType === 'interviewer') {
      try {
        optimizationResult = await generateAlternativeProposals(
          originalReservation,
          newPreferences,
          rescheduleRequestId
        );
      } catch (error) {
        console.error('Alternative proposal generation failed:', error);
      }
    }

    // 7. 承認者への通知
    await notifyApprovers(rescheduleRequest, originalReservation);

    // 8. 自動承認判定（条件によっては即座に承認）
    const autoApprovalResult = await checkAutoApproval(rescheduleRequest, originalReservation);

    if (autoApprovalResult.approved) {
      // 自動承認の場合、即座に新提案をVoiceDriveに送信
      await processAutoApprovedReschedule(
        rescheduleRequest,
        originalReservation,
        optimizationResult,
        autoApprovalResult
      );

      return NextResponse.json({
        success: true,
        data: {
          rescheduleRequestId,
          status: 'auto_approved',
          processedAt: new Date().toISOString(),
          newProposals: optimizationResult?.proposals || [],
          message: '変更リクエストが自動承認され、新しい候補を提案しています。'
        }
      }, { status: 200 });
    }

    // 9. 手動承認が必要な場合
    return NextResponse.json({
      success: true,
      data: {
        rescheduleRequestId,
        status: 'pending_approval',
        estimatedApprovalTime: calculateApprovalTime(),
        processedAt: new Date().toISOString(),
        message: '変更リクエストを承認者に送信しました。承認後に新しい候補をご提案します。'
      }
    }, { status: 202 });

  } catch (error) {
    console.error('Reschedule request processing failed:', error);

    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: '変更リクエストの処理に失敗しました。人事部にお問い合わせください。'
    }, { status: 500 });
  }
}

/**
 * 変更リクエストのバリデーション
 */
function validateRescheduleRequest(body: any): string | null {
  const requiredFields = [
    'bookingId',
    'voicedriveRequestId',
    'changeType',
    'newPreferences',
    'changeReason',
    'requestedBy',
    'requestTimestamp'
  ];

  for (const field of requiredFields) {
    if (!body[field]) {
      return `${field} is required`;
    }
  }

  const validChangeTypes = ['datetime', 'interviewer', 'location', 'duration'];
  if (!validChangeTypes.includes(body.changeType)) {
    return 'Invalid change type';
  }

  // 新設定の妥当性チェック
  if (body.changeType === 'datetime') {
    if (!body.newPreferences.alternativeDates || !Array.isArray(body.newPreferences.alternativeDates)) {
      return 'Alternative dates are required for datetime change';
    }
  }

  return null;
}

/**
 * 変更可能性・タイミングチェック
 */
async function validateRescheduleEligibility(
  reservation: any,
  changeType: string,
  requestTimestamp: string
): Promise<{
  allowed: boolean;
  reason?: string;
  alternatives?: string[];
}> {
  const now = new Date(requestTimestamp);
  const scheduledDateTime = new Date(`${reservation.scheduledDate} ${reservation.scheduledTime}`);
  const hoursUntilInterview = (scheduledDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

  // 基本的な時間制限チェック
  if (hoursUntilInterview < 24) {
    return {
      allowed: false,
      reason: '面談24時間前以降は変更できません。キャンセル・再予約をご検討ください。',
      alternatives: ['キャンセル後の新規予約', '人事部直接相談 (内線1234)']
    };
  }

  // 変更種別別のチェック
  switch (changeType) {
    case 'datetime':
      // 日時変更は基本的に可能
      return { allowed: true };

    case 'interviewer':
      // 担当者変更は48時間前まで
      if (hoursUntilInterview < 48) {
        return {
          allowed: false,
          reason: '担当者変更は48時間前までに申請してください。',
          alternatives: ['日時変更のみ', '元の担当者での日時変更']
        };
      }
      return { allowed: true };

    case 'location':
      // 場所変更は24時間前まで（同じ建物内のみ）
      return { allowed: true };

    case 'duration':
      // 時間変更は担当者の都合によるため要承認
      return { allowed: true };

    default:
      return {
        allowed: false,
        reason: '不正な変更種別です。'
      };
  }
}

/**
 * AI最適化による代替提案生成
 */
async function generateAlternativeProposals(
  originalReservation: any,
  newPreferences: any,
  rescheduleRequestId: string
) {
  const optimizationRequest = {
    staffId: originalReservation.staffId,
    staffName: originalReservation.staffName,
    department: originalReservation.department,
    position: originalReservation.position,
    type: originalReservation.type,

    // 新しい希望条件
    alternativeDates: newPreferences.alternativeDates,
    alternativeTimes: newPreferences.alternativeTimes,
    keepInterviewer: newPreferences.keepInterviewer,
    preferredInterviewer: newPreferences.preferredInterviewer,
    maxDuration: newPreferences.maxDuration || originalReservation.duration,

    // 元の情報
    originalBookingId: originalReservation.id,
    rescheduleRequestId,
    isReschedule: true
  };

  // AI最適化エンジンで新提案生成
  const optimizationResult = await AIOptimizationEngine.generateRescheduleProposals(
    optimizationRequest
  );

  return optimizationResult;
}

/**
 * 承認者への通知
 */
async function notifyApprovers(rescheduleRequest: any, originalReservation: any) {
  const message = `
面談変更リクエスト（承認依頼）：

・申請者: ${rescheduleRequest.requestedBy}
・元の面談: ${originalReservation.scheduledDate} ${originalReservation.scheduledTime}
・変更種別: ${getChangeTypeLabel(rescheduleRequest.changeType)}
・変更理由: ${rescheduleRequest.changeReason}
・申請時刻: ${rescheduleRequest.requestTimestamp}

承認システムで詳細をご確認ください。
`;

  // TODO: 承認者通知実装
  console.log(`Notifying approvers for reschedule request: ${rescheduleRequest.id}`);
  console.log(message);
}

/**
 * 自動承認判定
 */
async function checkAutoApproval(
  rescheduleRequest: any,
  originalReservation: any
): Promise<{
  approved: boolean;
  reason?: string;
  approver?: string;
}> {
  // 自動承認条件
  const autoApprovalConditions = {
    // 同じ担当者での日時変更のみの場合
    sameInterviewerDatetimeOnly:
      rescheduleRequest.changeType === 'datetime' &&
      rescheduleRequest.newPreferences.keepInterviewer === true,

    // 72時間以上前の申請
    sufficientNotice: (() => {
      const now = new Date();
      const scheduledTime = new Date(`${originalReservation.scheduledDate} ${originalReservation.scheduledTime}`);
      return (scheduledTime.getTime() - now.getTime()) > (72 * 60 * 60 * 1000);
    })(),

    // 標準的な変更理由
    standardReason: ['業務都合', '体調不良', 'シフト変更'].some(reason =>
      rescheduleRequest.changeReason.includes(reason)
    )
  };

  if (autoApprovalConditions.sameInterviewerDatetimeOnly &&
      autoApprovalConditions.sufficientNotice &&
      autoApprovalConditions.standardReason) {
    return {
      approved: true,
      reason: '自動承認条件を満たしています',
      approver: 'system_auto_approval'
    };
  }

  return {
    approved: false,
    reason: '手動承認が必要です'
  };
}

/**
 * 自動承認された変更の処理
 */
async function processAutoApprovedReschedule(
  rescheduleRequest: any,
  originalReservation: any,
  optimizationResult: any,
  autoApprovalResult: any
) {
  // 1. リクエストステータス更新
  await updateRescheduleRequestStatus(
    rescheduleRequest.id,
    'auto_approved',
    autoApprovalResult.approver
  );

  // 2. VoiceDriveに新提案送信
  await sendRevisedProposalsToVoiceDrive(
    rescheduleRequest.voicedriveRequestId,
    rescheduleRequest.id,
    optimizationResult
  );

  // 3. ログ記録
  await logRescheduleAutoApproval(rescheduleRequest, autoApprovalResult);
}

/**
 * VoiceDriveへの再提案送信
 */
async function sendRevisedProposalsToVoiceDrive(
  voicedriveRequestId: string,
  rescheduleRequestId: string,
  optimizationResult: any
) {
  const revisedProposalsData = {
    voicedriveRequestId,
    rescheduleRequestId,
    revisedProposals: optimizationResult?.proposals || [],
    adjustmentSummary: generateAdjustmentSummary(optimizationResult),
    expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString() // 48時間後
  };

  try {
    const response = await fetch('https://voicedrive-api.hospital.jp/api/reschedule-proposals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.VOICEDRIVE_API_TOKEN
      },
      body: JSON.stringify(revisedProposalsData)
    });

    if (!response.ok) {
      throw new Error('VoiceDrive revised proposals notification failed');
    }

    console.log('Revised proposals sent to VoiceDrive');
  } catch (error) {
    console.error('Failed to send revised proposals to VoiceDrive:', error);
    // TODO: 再送キューに追加
  }
}

/**
 * 調整サマリー生成
 */
function generateAdjustmentSummary(optimizationResult: any): string {
  if (!optimizationResult || !optimizationResult.proposals) {
    return '新しい候補を調整中です';
  }

  const proposalCount = optimizationResult.proposals.length;
  return `ご要望に合わせて${proposalCount}つの新しい候補を用意しました`;
}

/**
 * 承認時間計算
 */
function calculateApprovalTime(): string {
  const now = new Date();
  const businessHours = {
    start: 9,
    end: 17
  };

  if (now.getHours() >= businessHours.start && now.getHours() < businessHours.end) {
    // 営業時間内: 2時間以内
    return '2時間以内';
  } else {
    // 営業時間外: 翌営業日
    return '翌営業日中';
  }
}

/**
 * 変更種別ラベル取得
 */
function getChangeTypeLabel(changeType: string): string {
  const labels = {
    datetime: '日時変更',
    interviewer: '担当者変更',
    location: '場所変更',
    duration: '時間変更'
  };

  return labels[changeType as keyof typeof labels] || changeType;
}

/**
 * 変更リクエストID生成
 */
function generateRescheduleRequestId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 6);
  return `RESCHEDULE-${timestamp}-${random}`;
}

/**
 * 変更リクエスト保存
 */
async function saveRescheduleRequest(rescheduleRequest: any) {
  // TODO: データベース保存実装
  console.log('Saving reschedule request:', rescheduleRequest);
}

/**
 * 変更リクエストステータス更新
 */
async function updateRescheduleRequestStatus(
  requestId: string,
  status: string,
  approver: string
) {
  // TODO: データベース更新実装
  console.log(`Updating reschedule request ${requestId} to ${status} by ${approver}`);
}

/**
 * 自動承認ログ記録
 */
async function logRescheduleAutoApproval(rescheduleRequest: any, autoApprovalResult: any) {
  const logEntry = {
    rescheduleRequestId: rescheduleRequest.id,
    originalBookingId: rescheduleRequest.originalBookingId,
    approvalType: 'auto_approval',
    approver: autoApprovalResult.approver,
    reason: autoApprovalResult.reason,
    timestamp: new Date().toISOString(),
    action: 'reschedule_auto_approved',
    source: 'voicedrive'
  };

  // TODO: ログDB保存
  console.log('Reschedule auto-approval logged:', logEntry);
}