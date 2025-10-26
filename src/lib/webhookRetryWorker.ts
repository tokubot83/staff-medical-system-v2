import { PrismaClient } from '@prisma/client';
import { sendWebhookToVoiceDrive } from './webhookSender';

/**
 * Webhookリトライワーカー（Phase 2.5）
 *
 * 失敗したWebhookを指数バックオフ方式で再送信します：
 * - 1回目のリトライ: 1分後
 * - 2回目のリトライ: 5分後
 * - 3回目のリトライ: 30分後
 * - 3回失敗したら、管理者に通知
 */

const prisma = new PrismaClient();

// リトライ間隔（秒）
const RETRY_INTERVALS = [
  60,    // 1回目: 1分後
  300,   // 2回目: 5分後
  1800   // 3回目: 30分後
];

// VoiceDrive Webhook URL（環境変数から取得）
const VOICEDRIVE_WEBHOOK_URL = process.env.VOICEDRIVE_WEBHOOK_URL || 'https://voicedrive-v100.example.com/webhook';
const VOICEDRIVE_WEBHOOK_SECRET = process.env.VOICEDRIVE_WEBHOOK_SECRET || 'your-secret-key';

/**
 * 次回リトライ時刻を計算
 */
function calculateNextRetryTime(retryAttempt: number): Date {
  const intervalSeconds = RETRY_INTERVALS[retryAttempt] || RETRY_INTERVALS[RETRY_INTERVALS.length - 1];
  return new Date(Date.now() + intervalSeconds * 1000);
}

/**
 * リトライキューを処理
 */
export async function processRetryQueue(): Promise<void> {
  console.log('[Webhook Retry Worker] Starting...');

  const now = new Date();

  // リトライ対象のアイテムを取得
  const retryItems = await prisma.webhookRetryQueue.findMany({
    where: {
      status: 'PENDING',
      nextRetryAt: {
        lte: now
      }
    },
    orderBy: {
      nextRetryAt: 'asc'
    },
    take: 10 // 一度に10件まで処理
  });

  console.log(`[Webhook Retry Worker] Found ${retryItems.length} items to retry`);

  for (const item of retryItems) {
    try {
      // ステータスを処理中に更新
      await prisma.webhookRetryQueue.update({
        where: { id: item.id },
        data: { status: 'PROCESSING' }
      });

      console.log(`[Webhook Retry Worker] Retrying: ${item.id} (Attempt ${item.retryAttempt + 1}/${item.maxRetries})`);

      // Webhookを再送信
      const payload = item.payload as any;
      const success = await sendWebhookToVoiceDrive(
        VOICEDRIVE_WEBHOOK_URL,
        item.eventType,
        payload.data || payload,
        VOICEDRIVE_WEBHOOK_SECRET,
        payload.data?.staffId
      );

      if (success) {
        // 成功: キューから削除
        await prisma.webhookRetryQueue.update({
          where: { id: item.id },
          data: {
            status: 'COMPLETED',
            retryAttempt: item.retryAttempt + 1
          }
        });

        // 元のログを更新
        await prisma.webhookSendLog.update({
          where: { id: item.originalLogId },
          data: {
            retryCount: item.retryAttempt + 1,
            lastRetryAt: new Date(),
            status: 'SUCCESS' // リトライ成功
          }
        });

        console.log(`[Webhook Retry Worker] ✅ Success: ${item.id}`);

      } else {
        // 失敗: リトライ回数をインクリメント
        const newRetryAttempt = item.retryAttempt + 1;

        if (newRetryAttempt >= item.maxRetries) {
          // 最大リトライ回数に達した
          await prisma.webhookRetryQueue.update({
            where: { id: item.id },
            data: {
              status: 'FAILED',
              retryAttempt: newRetryAttempt,
              lastError: 'Max retries reached'
            }
          });

          // 元のログを更新
          await prisma.webhookSendLog.update({
            where: { id: item.originalLogId },
            data: {
              retryCount: newRetryAttempt,
              lastRetryAt: new Date(),
              errorMessage: 'Max retries reached - manual intervention required'
            }
          });

          console.error(`[Webhook Retry Worker] ❌ Failed (max retries): ${item.id}`);

          // TODO: 管理者に通知（メール、Slackなど）
          await notifyAdministrator(item);

        } else {
          // 次回リトライをスケジュール
          const nextRetryAt = calculateNextRetryTime(newRetryAttempt);

          await prisma.webhookRetryQueue.update({
            where: { id: item.id },
            data: {
              status: 'PENDING',
              retryAttempt: newRetryAttempt,
              nextRetryAt,
              lastError: 'Retry failed, will retry again'
            }
          });

          // 元のログを更新
          await prisma.webhookSendLog.update({
            where: { id: item.originalLogId },
            data: {
              retryCount: newRetryAttempt,
              lastRetryAt: new Date()
            }
          });

          console.log(`[Webhook Retry Worker] ⏰ Scheduled next retry: ${item.id} at ${nextRetryAt.toISOString()}`);
        }
      }

    } catch (error) {
      console.error(`[Webhook Retry Worker] Error processing ${item.id}:`, error);

      // エラーが発生した場合は、ステータスをPENDINGに戻す
      await prisma.webhookRetryQueue.update({
        where: { id: item.id },
        data: {
          status: 'PENDING',
          lastError: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  }

  console.log('[Webhook Retry Worker] Finished');
}

/**
 * 管理者に通知（最大リトライ回数に達した場合）
 */
async function notifyAdministrator(item: any): Promise<void> {
  console.error('[Webhook Retry Worker] 🚨 ALERT: Max retries reached', {
    queueId: item.id,
    originalLogId: item.originalLogId,
    eventType: item.eventType,
    retryAttempt: item.retryAttempt,
    lastError: item.lastError
  });

  // TODO: メール通知またはSlack通知を実装
  // 例:
  // await sendEmailToAdmin({
  //   subject: 'Webhook送信失敗: 手動対応が必要です',
  //   body: `Webhook ID: ${item.originalLogId}\nイベント: ${item.eventType}\nエラー: ${item.lastError}`
  // });
}

/**
 * Cron Jobのエントリーポイント
 *
 * 使用例:
 * ```bash
 * # 毎分実行
 * * * * * * node -e "require('./src/lib/webhookRetryWorker').processRetryQueue()"
 * ```
 */
if (require.main === module) {
  processRetryQueue()
    .then(() => {
      console.log('[Webhook Retry Worker] Done');
      process.exit(0);
    })
    .catch((error) => {
      console.error('[Webhook Retry Worker] Fatal error:', error);
      process.exit(1);
    });
}
