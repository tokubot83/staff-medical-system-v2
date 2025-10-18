import crypto from 'crypto';

/**
 * VoiceDriveからのWebhook HMAC-SHA256署名を検証
 *
 * @param payload - Webhookペイロード（JSON文字列）
 * @param signature - X-VoiceDrive-Signatureヘッダーの値
 * @param timestamp - X-VoiceDrive-Timestampヘッダーの値
 * @param secret - 共有秘密鍵（環境変数から取得）
 * @returns 署名が有効ならtrue
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  timestamp: string,
  secret: string
): boolean {
  try {
    // VoiceDrive側の署名生成ロジックと同じ形式
    // `${timestamp}.${payload}` の形式でHMAC-SHA256署名を計算
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${timestamp}.${payload}`)
      .digest('hex');

    // タイミング攻撃を防ぐため、crypto.timingSafeEqual を使用
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    console.error('Webhook signature verification error:', error);
    return false;
  }
}

/**
 * タイムスタンプの有効性を検証（リプレイ攻撃防止）
 *
 * @param timestamp - ISO 8601形式のタイムスタンプ
 * @param maxAgeMs - 許容する最大経過時間（ミリ秒、デフォルト: 5分）
 * @returns タイムスタンプが有効ならtrue
 */
export function verifyTimestamp(timestamp: string, maxAgeMs: number = 5 * 60 * 1000): boolean {
  try {
    const webhookTime = new Date(timestamp).getTime();
    const now = Date.now();
    const age = now - webhookTime;

    // 未来のタイムスタンプまたは古すぎるタイムスタンプを拒否
    return age >= 0 && age <= maxAgeMs;
  } catch (error) {
    console.error('Timestamp verification error:', error);
    return false;
  }
}
