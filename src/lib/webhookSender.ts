import crypto from 'crypto';

/**
 * VoiceDriveへのWebhook送信ユーティリティ
 */

/**
 * HMAC-SHA256署名を生成
 *
 * @param payload - JSONペイロード（文字列）
 * @param timestamp - ISO 8601形式のタイムスタンプ
 * @param secret - 共有秘密鍵
 * @returns HMAC-SHA256署名（hex形式）
 */
export function generateWebhookSignature(
  payload: string,
  timestamp: string,
  secret: string
): string {
  return crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${payload}`)
    .digest('hex');
}

/**
 * VoiceDriveへWebhookを送信
 *
 * @param url - VoiceDriveのWebhookエンドポイントURL
 * @param event - イベント名
 * @param data - ペイロードデータ
 * @param secret - 共有秘密鍵
 * @returns 送信成功ならtrue
 */
export async function sendWebhookToVoiceDrive(
  url: string,
  event: string,
  data: any,
  secret: string
): Promise<boolean> {
  try {
    const timestamp = new Date().toISOString();
    const payload = JSON.stringify({
      event,
      timestamp,
      source: 'medical-system',
      data
    });

    const signature = generateWebhookSignature(payload, timestamp, secret);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Medical-System-Signature': signature,
        'X-Medical-System-Timestamp': timestamp,
        'X-Medical-System-Source': 'staff-medical-system'
      },
      body: payload
    });

    if (!response.ok) {
      console.error('[Webhook Send] Failed:', {
        status: response.status,
        statusText: response.statusText,
        url,
        event
      });
      return false;
    }

    console.log('[Webhook Send] Success:', {
      url,
      event,
      status: response.status
    });

    return true;

  } catch (error) {
    console.error('[Webhook Send] Error:', {
      url,
      event,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    return false;
  }
}
