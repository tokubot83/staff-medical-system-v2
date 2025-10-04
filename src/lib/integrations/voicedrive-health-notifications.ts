/**
 * VoiceDrive連携 - 健康データ通知システム
 *
 * 医療システムからVoiceDriveへ健康関連イベントを通知
 * - ストレスチェック同意状況変更
 * - 高ストレス判定
 * - 産業医面談実施
 * - 就業制限措置の発動
 */

export type HealthNotificationEvent =
  | 'stress_check_consent_changed'
  | 'high_stress_detected'
  | 'occupational_consultation_completed'
  | 'work_restriction_applied'
  | 'medical_opinion_issued';

export interface VoiceDriveHealthNotification {
  event: HealthNotificationEvent;
  staffId: string;
  timestamp: string;
  data: Record<string, any>;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface VoiceDriveNotificationResponse {
  success: boolean;
  messageId?: string;
  receivedAt?: string;
  error?: string;
}

/**
 * VoiceDriveへ健康関連イベントを通知
 *
 * @param notification 通知内容
 * @param retryCount リトライ回数（デフォルト: 3回）
 * @returns 通知結果
 */
export async function notifyVoiceDrive(
  notification: VoiceDriveHealthNotification,
  retryCount: number = 3
): Promise<VoiceDriveNotificationResponse> {
  const VOICEDRIVE_WEBHOOK_URL = process.env.VOICEDRIVE_WEBHOOK_URL;
  const VOICEDRIVE_API_KEY = process.env.VOICEDRIVE_API_KEY;

  if (!VOICEDRIVE_WEBHOOK_URL) {
    console.warn('VoiceDrive Webhook URL未設定のため通知スキップ');
    return {
      success: false,
      error: 'WEBHOOK_URL_NOT_CONFIGURED',
    };
  }

  let lastError: Error | null = null;

  // リトライロジック
  for (let attempt = 0; attempt < retryCount; attempt++) {
    try {
      const response = await fetch(VOICEDRIVE_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${VOICEDRIVE_API_KEY || ''}`,
          'X-Event-Type': notification.event,
          'X-Priority': notification.priority,
        },
        body: JSON.stringify(notification),
      });

      if (!response.ok) {
        throw new Error(`VoiceDrive通知失敗: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      return {
        success: true,
        messageId: result.messageId,
        receivedAt: result.receivedAt,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      console.error(`VoiceDrive通知試行 ${attempt + 1}/${retryCount} 失敗:`, error);

      // 最後の試行でなければ待機してリトライ
      if (attempt < retryCount - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1))); // 指数バックオフ
      }
    }
  }

  return {
    success: false,
    error: lastError?.message || 'UNKNOWN_ERROR',
  };
}

/**
 * ストレスチェック同意状況変更を通知
 *
 * @param staffId 職員ID
 * @param newConsent 新しい同意状況
 * @param previousConsent 以前の同意状況
 */
export async function notifyStressCheckConsentChanged(
  staffId: string,
  newConsent: boolean,
  previousConsent: boolean | null
): Promise<VoiceDriveNotificationResponse> {
  return notifyVoiceDrive({
    event: 'stress_check_consent_changed',
    staffId,
    timestamp: new Date().toISOString(),
    data: {
      previousConsent,
      newConsent,
      consentDate: new Date().toISOString(),
    },
    priority: 'low',
  });
}

/**
 * 高ストレス判定を通知
 *
 * @param staffId 職員ID
 * @param stressLevel ストレスレベル
 * @param needsInterview 産業医面談が必要か
 */
export async function notifyHighStressDetected(
  staffId: string,
  stressLevel: 'low' | 'medium' | 'high',
  needsInterview: boolean
): Promise<VoiceDriveNotificationResponse> {
  return notifyVoiceDrive({
    event: 'high_stress_detected',
    staffId,
    timestamp: new Date().toISOString(),
    data: {
      stressLevel,
      highStressFlag: true,
      needsInterview,
      implementationDate: new Date().toISOString(),
    },
    priority: needsInterview ? 'high' : 'medium',
  });
}

/**
 * 産業医面談完了を通知
 *
 * @param staffId 職員ID
 * @param consultationId 面談ID
 * @param recommendations 推奨措置
 */
export async function notifyOccupationalConsultationCompleted(
  staffId: string,
  consultationId: string,
  recommendations: string[]
): Promise<VoiceDriveNotificationResponse> {
  return notifyVoiceDrive({
    event: 'occupational_consultation_completed',
    staffId,
    timestamp: new Date().toISOString(),
    data: {
      consultationId,
      recommendations,
      consultationDate: new Date().toISOString(),
    },
    priority: 'medium',
  });
}

/**
 * 就業制限措置の発動を通知
 *
 * @param staffId 職員ID
 * @param restrictionType 制限種別
 * @param startDate 開始日
 * @param endDate 終了日（予定）
 */
export async function notifyWorkRestrictionApplied(
  staffId: string,
  restrictionType: string,
  startDate: Date,
  endDate?: Date
): Promise<VoiceDriveNotificationResponse> {
  return notifyVoiceDrive({
    event: 'work_restriction_applied',
    staffId,
    timestamp: new Date().toISOString(),
    data: {
      restrictionType,
      startDate: startDate.toISOString(),
      endDate: endDate?.toISOString(),
    },
    priority: 'urgent',
  });
}

/**
 * 医学的意見書発行を通知
 *
 * @param staffId 職員ID
 * @param opinionId 意見書ID
 * @param issuedBy 発行者（産業医）
 */
export async function notifyMedicalOpinionIssued(
  staffId: string,
  opinionId: string,
  issuedBy: string
): Promise<VoiceDriveNotificationResponse> {
  return notifyVoiceDrive({
    event: 'medical_opinion_issued',
    staffId,
    timestamp: new Date().toISOString(),
    data: {
      opinionId,
      issuedBy,
      issuedDate: new Date().toISOString(),
    },
    priority: 'high',
  });
}

/**
 * VoiceDrive通知履歴を記録
 *
 * @param notification 通知内容
 * @param response 通知結果
 */
export async function logVoiceDriveNotification(
  notification: VoiceDriveHealthNotification,
  response: VoiceDriveNotificationResponse
): Promise<void> {
  // 実際の実装ではデータベースに記録
  console.log('[VoiceDrive通知履歴]', {
    event: notification.event,
    staffId: notification.staffId,
    priority: notification.priority,
    success: response.success,
    messageId: response.messageId,
    timestamp: notification.timestamp,
  });
}
