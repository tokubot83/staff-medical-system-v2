/**
 * Phase 2: 顔写真統合 - Webhook送信ユーティリティ
 *
 * VoiceDriveへの職員顔写真データ連携用Webhook送信処理
 *
 * 機能:
 * - HMAC-SHA256署名生成
 * - リトライ機構（1分→5分→30分→アラート）
 * - 3種類のイベント送信（employee.created, employee.photo.updated, employee.photo.deleted）
 *
 * @module phase2-photo-webhook
 */

import crypto from 'crypto';

// ================================================================================
// 型定義
// ================================================================================

/**
 * 職員作成イベントペイロード
 */
export interface EmployeeCreatedPayload {
  staffId: string;
  fullName: string;
  email: string;
  facilityId: string;
  departmentId: string;
  position: string;
  authLevel: number;
  profilePhotoUrl: string;
  photoUpdatedAt: string; // ISO 8601
  photoMimeType: 'image/jpeg' | 'image/png';
  photoFileSize: number; // bytes
  employmentStatus: 'active' | 'onLeave' | 'retired';
  hiredAt: string; // ISO 8601
}

/**
 * 職員写真更新イベントペイロード
 */
export interface EmployeePhotoUpdatedPayload {
  staffId: string;
  profilePhotoUrl: string;
  photoUpdatedAt: string; // ISO 8601
  photoMimeType: 'image/jpeg' | 'image/png';
  photoFileSize: number; // bytes
  updateReason: 'annual_update' | 'user_request' | 'admin_update';
}

/**
 * 職員写真削除イベントペイロード
 */
export interface EmployeePhotoDeletedPayload {
  staffId: string;
  deletionReason: 'user_request' | 'retention_period_expired' | 'admin_action';
  photoDeletedAt: string; // ISO 8601
}

/**
 * Webhookイベントタイプ
 */
export type WebhookEventType =
  | 'employee.created'
  | 'employee.photo.updated'
  | 'employee.photo.deleted';

/**
 * Webhookペイロード（共通構造）
 */
export interface WebhookPayload<T> {
  eventType: WebhookEventType;
  timestamp: string; // ISO 8601
  data: T;
}

/**
 * Webhook送信オプション
 */
export interface WebhookSendOptions {
  maxRetries?: number; // 最大リトライ回数（デフォルト: 3）
  retryDelays?: number[]; // リトライ待機時間（ミリ秒）[1分, 5分, 30分]
  timeout?: number; // タイムアウト（ミリ秒、デフォルト: 30秒）
}

/**
 * Webhook送信結果
 */
export interface WebhookSendResult {
  success: boolean;
  statusCode?: number;
  error?: string;
  retryCount: number;
}

// ================================================================================
// HMAC-SHA256署名生成
// ================================================================================

/**
 * Webhook用のHMAC-SHA256署名を生成
 *
 * @param timestamp - UnixタイムスタンプMilliseconds（文字列）
 * @param payload - JSONペイロード（文字列）
 * @param secret - 共有秘密鍵（MEDICAL_WEBHOOK_SECRET）
 * @returns HMAC-SHA256署名（hex形式）
 *
 * @example
 * ```typescript
 * const timestamp = Date.now().toString();
 * const payloadString = JSON.stringify(payload);
 * const signature = generateWebhookSignature(timestamp, payloadString, secret);
 * ```
 */
export function generateWebhookSignature(
  timestamp: string,
  payload: string,
  secret: string
): string {
  const message = timestamp + payload;
  return crypto
    .createHmac('sha256', secret)
    .update(message)
    .digest('hex');
}

// ================================================================================
// Webhook送信処理（リトライ機構付き）
// ================================================================================

/**
 * VoiceDriveへWebhookを送信（リトライ機構付き）
 *
 * リトライポリシー:
 * - 初回送信失敗時: 1分後にリトライ
 * - 2回目失敗時: 5分後にリトライ
 * - 3回目失敗時: 30分後にリトライ
 * - 3回失敗後: アラート送信（Slack）
 *
 * エラーハンドリング:
 * - 500エラー: リトライ実行
 * - 400/401エラー: リトライしない（即座にアラート）
 * - ネットワークタイムアウト: リトライ実行
 *
 * @param eventType - イベントタイプ
 * @param payload - イベントデータ
 * @param endpoint - VoiceDriveのWebhookエンドポイントURL
 * @param secret - 共有秘密鍵
 * @param options - Webhook送信オプション
 * @returns Webhook送信結果
 *
 * @example
 * ```typescript
 * const result = await sendWebhookWithRetry(
 *   'employee.created',
 *   {
 *     staffId: 'EMP-2025-001',
 *     fullName: '山田太郎',
 *     profilePhotoUrl: 'https://d2k8x5j9m1n4p7.cloudfront.net/employees/EMP-2025-001.jpg',
 *     ...
 *   },
 *   process.env.VOICEDRIVE_WEBHOOK_ENDPOINT_PROD!,
 *   process.env.MEDICAL_WEBHOOK_SECRET!
 * );
 *
 * if (result.success) {
 *   console.log('Webhook送信成功');
 * } else {
 *   console.error('Webhook送信失敗:', result.error);
 * }
 * ```
 */
export async function sendWebhookWithRetry<T>(
  eventType: WebhookEventType,
  data: T,
  endpoint: string,
  secret: string,
  options: WebhookSendOptions = {}
): Promise<WebhookSendResult> {
  const {
    maxRetries = 3,
    retryDelays = [60000, 300000, 1800000], // 1分、5分、30分
    timeout = 30000 // 30秒
  } = options;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const timestamp = Date.now().toString();
      const webhookPayload: WebhookPayload<T> = {
        eventType,
        timestamp: new Date().toISOString(),
        data
      };
      const payloadString = JSON.stringify(webhookPayload);
      const signature = generateWebhookSignature(timestamp, payloadString, secret);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-webhook-signature': signature,
          'x-webhook-timestamp': timestamp
        },
        body: payloadString,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // 成功（200 OK）
      if (response.status === 200) {
        console.log(`[Webhook送信成功] ${eventType}`, {
          staffId: (data as any).staffId,
          attempt: attempt + 1,
          statusCode: response.status
        });

        return {
          success: true,
          statusCode: response.status,
          retryCount: attempt
        };
      }

      // クライアントエラー（400, 401） → リトライしない
      if (response.status === 400 || response.status === 401) {
        const errorMessage = `Webhook送信失敗（リトライ不可）: ${response.status} ${response.statusText}`;
        console.error(`[Webhook送信失敗] ${eventType}`, {
          staffId: (data as any).staffId,
          statusCode: response.status,
          statusText: response.statusText,
          error: errorMessage
        });

        // アラート送信（Slack等）
        await sendWebhookAlert('error', eventType, data, response.status, errorMessage);

        return {
          success: false,
          statusCode: response.status,
          error: errorMessage,
          retryCount: attempt
        };
      }

      // サーバーエラー（500） → リトライ
      if (response.status >= 500 && attempt < maxRetries) {
        const delay = retryDelays[attempt];
        console.warn(`[Webhook送信失敗（リトライ ${attempt + 1}/${maxRetries}）] ${eventType}`, {
          staffId: (data as any).staffId,
          statusCode: response.status,
          nextRetryIn: `${delay}ms`
        });

        await sleep(delay);
        continue; // リトライ
      }

      // 最大リトライ回数到達
      if (attempt === maxRetries) {
        const errorMessage = `Webhook送信失敗（最大リトライ回数到達）: ${response.status}`;
        console.error(`[Webhook送信失敗（最大リトライ回数到達）] ${eventType}`, {
          staffId: (data as any).staffId,
          attempts: maxRetries + 1,
          statusCode: response.status
        });

        // 緊急アラート送信
        await sendWebhookAlert('critical', eventType, data, response.status, errorMessage);

        return {
          success: false,
          statusCode: response.status,
          error: errorMessage,
          retryCount: attempt
        };
      }

    } catch (error) {
      // ネットワークタイムアウト → リトライ
      if ((error as any).name === 'AbortError' && attempt < maxRetries) {
        const delay = retryDelays[attempt];
        console.warn(`[ネットワークタイムアウト（リトライ ${attempt + 1}/${maxRetries}）] ${eventType}`, {
          staffId: (data as any).staffId,
          nextRetryIn: `${delay}ms`
        });

        await sleep(delay);
        continue; // リトライ
      }

      // その他のエラー
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[Webhook送信エラー] ${eventType}`, {
        staffId: (data as any).staffId,
        error: errorMessage
      });

      if (attempt === maxRetries) {
        await sendWebhookAlert('critical', eventType, data, undefined, errorMessage);
      }

      return {
        success: false,
        error: errorMessage,
        retryCount: attempt
      };
    }
  }

  // ここには到達しないはず
  return {
    success: false,
    error: 'Unknown error',
    retryCount: maxRetries
  };
}

// ================================================================================
// アラート送信（Slack等）
// ================================================================================

/**
 * Webhook送信失敗時のアラート送信
 *
 * @param level - アラートレベル（error, critical）
 * @param eventType - イベントタイプ
 * @param data - ペイロードデータ
 * @param statusCode - HTTPステータスコード（オプション）
 * @param errorMessage - エラーメッセージ
 */
async function sendWebhookAlert<T>(
  level: 'error' | 'critical',
  eventType: WebhookEventType,
  data: T,
  statusCode?: number,
  errorMessage?: string
): Promise<void> {
  // TODO: Slack Webhook URLを環境変数から取得
  const slackWebhookUrl = process.env.SLACK_WEBHOOK_ALERT_URL;

  if (!slackWebhookUrl) {
    console.warn('[Alert] Slack Webhook URLが設定されていません（アラート送信スキップ）');
    return;
  }

  const emoji = level === 'critical' ? '🚨' : '⚠️';
  const levelText = level === 'critical' ? 'CRITICAL' : 'ERROR';

  const alertMessage = {
    text: `${emoji} Webhook送信失敗アラート`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `${emoji} Webhook送信失敗アラート（${levelText}）`
        }
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*イベントタイプ:*\n${eventType}`
          },
          {
            type: 'mrkdwn',
            text: `*staffId:*\n${(data as any).staffId || 'N/A'}`
          },
          {
            type: 'mrkdwn',
            text: `*ステータスコード:*\n${statusCode || 'N/A'}`
          },
          {
            type: 'mrkdwn',
            text: `*タイムスタンプ:*\n${new Date().toISOString()}`
          }
        ]
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*エラー内容:*\n\`\`\`${errorMessage || 'Unknown error'}\`\`\``
        }
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `対応が必要です。 cc: <@medical-backend-lead> <@voicedrive-backend-lead>`
          }
        ]
      }
    ]
  };

  try {
    await fetch(slackWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(alertMessage)
    });

    console.log('[Alert] Slackアラート送信成功');
  } catch (error) {
    console.error('[Alert] Slackアラート送信失敗:', error);
  }
}

// ================================================================================
// ヘルパー関数
// ================================================================================

/**
 * スリープ（指定ミリ秒待機）
 *
 * @param ms - 待機時間（ミリ秒）
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ================================================================================
// 便利関数（各イベント送信のラッパー）
// ================================================================================

/**
 * 職員作成イベント送信
 *
 * @param payload - 職員作成イベントペイロード
 * @param endpoint - VoiceDriveのWebhookエンドポイントURL
 * @param secret - 共有秘密鍵
 * @returns Webhook送信結果
 */
export async function sendEmployeeCreatedEvent(
  payload: EmployeeCreatedPayload,
  endpoint: string = process.env.VOICEDRIVE_WEBHOOK_ENDPOINT_PROD || '',
  secret: string = process.env.MEDICAL_WEBHOOK_SECRET || ''
): Promise<WebhookSendResult> {
  return sendWebhookWithRetry('employee.created', payload, endpoint, secret);
}

/**
 * 職員写真更新イベント送信
 *
 * @param payload - 職員写真更新イベントペイロード
 * @param endpoint - VoiceDriveのWebhookエンドポイントURL
 * @param secret - 共有秘密鍵
 * @returns Webhook送信結果
 */
export async function sendEmployeePhotoUpdatedEvent(
  payload: EmployeePhotoUpdatedPayload,
  endpoint: string = process.env.VOICEDRIVE_WEBHOOK_ENDPOINT_PROD || '',
  secret: string = process.env.MEDICAL_WEBHOOK_SECRET || ''
): Promise<WebhookSendResult> {
  return sendWebhookWithRetry('employee.photo.updated', payload, endpoint, secret);
}

/**
 * 職員写真削除イベント送信
 *
 * @param payload - 職員写真削除イベントペイロード
 * @param endpoint - VoiceDriveのWebhookエンドポイントURL
 * @param secret - 共有秘密鍵
 * @returns Webhook送信結果
 */
export async function sendEmployeePhotoDeletedEvent(
  payload: EmployeePhotoDeletedPayload,
  endpoint: string = process.env.VOICEDRIVE_WEBHOOK_ENDPOINT_PROD || '',
  secret: string = process.env.MEDICAL_WEBHOOK_SECRET || ''
): Promise<WebhookSendResult> {
  return sendWebhookWithRetry('employee.photo.deleted', payload, endpoint, secret);
}
