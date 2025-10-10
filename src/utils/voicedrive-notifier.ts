/**
 * VoiceDrive通知システム
 *
 * 機能:
 * - VoiceDriveのアカウントレベル99（システム管理者）に通知を送信
 * - 分析バッチの成功/失敗を通知
 * - HMAC署名による改ざん防止
 *
 * 使用方法:
 * await sendVoiceDriveNotification('success', {
 *   title: '✅ 分析データ送信完了',
 *   message: '期間: 2025-09-30 〜 2025-10-07',
 *   details: { totalPosts: 342, positive: 172 }
 * });
 */

import crypto from 'crypto';

/**
 * 通知の型
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

/**
 * 通知データの型
 */
export interface NotificationData {
  title: string;
  message: string;
  details?: Record<string, any>;
}

/**
 * 通知レスポンスの型
 */
export interface NotificationResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * HMAC署名を生成
 */
function createHmacSignature(data: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('hex');
}

/**
 * VoiceDriveのアカウントレベル99に通知を送信
 *
 * @param type 通知タイプ（success/error/warning/info）
 * @param data 通知データ（タイトル、メッセージ、詳細）
 * @returns 送信結果
 */
export async function sendVoiceDriveNotification(
  type: NotificationType,
  data: NotificationData
): Promise<NotificationResponse> {
  try {
    // 環境変数取得
    const apiUrl = process.env.VOICEDRIVE_ANALYTICS_API_URL || 'http://localhost:4000';
    const hmacSecret = process.env.VOICEDRIVE_HMAC_SECRET || '';

    if (!hmacSecret) {
      console.warn('[VoiceDriveNotifier] HMAC secret not configured - skipping notification');
      return { success: false, error: 'HMAC secret not configured' };
    }

    // 通知エンドポイント
    const notificationEndpoint = `${apiUrl}/api/webhook/analytics-notification`;

    // ペイロード作成
    const timestamp = Math.floor(Date.now() / 1000);
    const payload = {
      type,
      title: data.title,
      message: data.message,
      details: data.details || {},
      timestamp,
      source: 'medical-staff-system',
      accountLevel: 99, // アカウントレベル99に通知
      notificationId: `analytics-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    const payloadString = JSON.stringify(payload);

    // HMAC署名生成
    const signature = createHmacSignature(payloadString, hmacSecret);

    // 通知送信
    console.log(`[VoiceDriveNotifier] Sending ${type} notification to VoiceDrive...`);
    console.log(`[VoiceDriveNotifier] Endpoint: ${notificationEndpoint}`);
    console.log(`[VoiceDriveNotifier] Title: ${data.title}`);

    const response = await fetch(notificationEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Signature': signature,
        'X-Timestamp': timestamp.toString()
      },
      body: payloadString
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[VoiceDriveNotifier] Notification failed: ${response.status} ${errorText}`);
      return {
        success: false,
        error: `HTTP ${response.status}: ${errorText}`
      };
    }

    const result = await response.json();
    console.log(`[VoiceDriveNotifier] Notification sent successfully`);

    return {
      success: true,
      message: result.message || 'Notification sent'
    };

  } catch (error) {
    console.error('[VoiceDriveNotifier] Error sending notification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * 成功通知を送信（ヘルパー関数）
 */
export async function sendSuccessNotification(
  title: string,
  message: string,
  details?: Record<string, any>
): Promise<NotificationResponse> {
  return sendVoiceDriveNotification('success', { title, message, details });
}

/**
 * エラー通知を送信（ヘルパー関数）
 */
export async function sendErrorNotification(
  title: string,
  message: string,
  details?: Record<string, any>
): Promise<NotificationResponse> {
  return sendVoiceDriveNotification('error', { title, message, details });
}

/**
 * 警告通知を送信（ヘルパー関数）
 */
export async function sendWarningNotification(
  title: string,
  message: string,
  details?: Record<string, any>
): Promise<NotificationResponse> {
  return sendVoiceDriveNotification('warning', { title, message, details });
}

/**
 * 情報通知を送信（ヘルパー関数）
 */
export async function sendInfoNotification(
  title: string,
  message: string,
  details?: Record<string, any>
): Promise<NotificationResponse> {
  return sendVoiceDriveNotification('info', { title, message, details });
}

export default {
  sendVoiceDriveNotification,
  sendSuccessNotification,
  sendErrorNotification,
  sendWarningNotification,
  sendInfoNotification
};
