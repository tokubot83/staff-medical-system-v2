import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

/**
 * VoiceDriveへのWebhook送信ユーティリティ（Phase 2.5拡張版）
 * - ログ記録機能追加
 * - リトライキュー機能追加
 * - 処理時間計測
 */

const prisma = new PrismaClient();

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
 * リクエストIDを生成（UUIDv4形式）
 */
function generateRequestId(): string {
  return crypto.randomUUID();
}

/**
 * リトライキューに追加
 */
async function addToRetryQueue(
  logId: string,
  eventType: string,
  payload: any,
  lastError: string
): Promise<void> {
  // 次回リトライ時刻を計算（指数バックオフ: 1分後）
  const nextRetryAt = new Date(Date.now() + 60 * 1000); // 1分後

  await prisma.webhookRetryQueue.create({
    data: {
      originalLogId: logId,
      eventType,
      payload,
      retryAttempt: 0,
      maxRetries: 3,
      nextRetryAt,
      status: 'PENDING',
      lastError
    }
  });

  console.log('[Webhook Retry Queue] Added:', {
    logId,
    eventType,
    nextRetryAt: nextRetryAt.toISOString()
  });
}

/**
 * VoiceDriveへWebhookを送信（Phase 2.5版 - ログ記録付き）
 *
 * @param url - VoiceDriveのWebhookエンドポイントURL
 * @param event - イベント名
 * @param data - ペイロードデータ
 * @param secret - 共有秘密鍵
 * @param staffId - 関連職員ID（オプション）
 * @returns 送信成功ならtrue
 */
export async function sendWebhookToVoiceDrive(
  url: string,
  event: string,
  data: any,
  secret: string,
  staffId?: string
): Promise<boolean> {
  const eventTimestamp = new Date();
  const sentAt = new Date();
  const requestId = generateRequestId();
  const startTime = Date.now();

  try {
    const timestamp = sentAt.toISOString();
    const payload = JSON.stringify({
      event,
      timestamp,
      source: 'medical-system',
      data
    });

    const signature = generateWebhookSignature(payload, timestamp, secret);
    const payloadSize = Buffer.byteLength(payload, 'utf8');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Medical-System-Signature': signature,
        'X-Medical-System-Timestamp': timestamp,
        'X-Medical-System-Source': 'staff-medical-system',
        'X-Request-ID': requestId
      },
      body: payload,
      signal: AbortSignal.timeout(5000) // 5秒タイムアウト
    });

    const processingTime = Date.now() - startTime;
    const responseBody = await response.text();

    if (!response.ok) {
      // 失敗ログを記録
      const log = await prisma.webhookSendLog.create({
        data: {
          eventType: event,
          eventTimestamp,
          sentAt,
          staffId,
          requestId,
          payloadSize,
          status: 'FAILED',
          httpStatusCode: response.status,
          processingTime,
          errorMessage: `HTTP ${response.status}: ${response.statusText}`,
          responseBody,
          retryCount: 0
        }
      });

      // リトライキューに追加
      await addToRetryQueue(
        log.id,
        event,
        JSON.parse(payload),
        `HTTP ${response.status}: ${response.statusText}`
      );

      console.error('[Webhook Send] Failed:', {
        status: response.status,
        statusText: response.statusText,
        url,
        event,
        requestId,
        logId: log.id
      });

      return false;
    }

    // 成功ログを記録
    await prisma.webhookSendLog.create({
      data: {
        eventType: event,
        eventTimestamp,
        sentAt,
        staffId,
        requestId,
        payloadSize,
        status: 'SUCCESS',
        httpStatusCode: response.status,
        processingTime,
        responseBody,
        retryCount: 0
      }
    });

    console.log('[Webhook Send] Success:', {
      url,
      event,
      status: response.status,
      requestId,
      processingTime: `${processingTime}ms`
    });

    return true;

  } catch (error) {
    const processingTime = Date.now() - startTime;
    const isTimeout = error instanceof Error && error.name === 'TimeoutError';
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // タイムアウトまたはエラーログを記録
    const log = await prisma.webhookSendLog.create({
      data: {
        eventType: event,
        eventTimestamp,
        sentAt,
        staffId,
        requestId,
        payloadSize: 0, // エラー時はペイロードサイズ不明
        status: isTimeout ? 'TIMEOUT' : 'FAILED',
        httpStatusCode: null,
        processingTime,
        errorMessage,
        retryCount: 0
      }
    });

    // リトライキューに追加
    await addToRetryQueue(
      log.id,
      event,
      data,
      errorMessage
    );

    console.error('[Webhook Send] Error:', {
      url,
      event,
      requestId,
      error: errorMessage,
      logId: log.id,
      isTimeout
    });

    return false;
  }
}

/**
 * レガシー互換性のための旧関数シグネチャ
 */
export async function sendWebhookToVoiceDriveLegacy(
  url: string,
  event: string,
  data: any,
  secret: string
): Promise<boolean> {
  return sendWebhookToVoiceDrive(url, event, data, secret);
}
