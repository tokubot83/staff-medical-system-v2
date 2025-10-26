/**
 * 内部通報Webhook送信サービス
 *
 * 用途: 医療システムからVoiceDriveへの内部通報関連の通知送信
 * 主な機能:
 *  - ステータス更新通知
 *  - 解決通知
 *  - 調査進捗通知
 *
 * @see mcp-shared/docs/MyReports_医療システム確認結果_20251026.md
 */

import { sendWebhook } from '@/lib/webhookSender';

/**
 * ステータス更新通知ペイロード型定義
 */
export interface StatusUpdatePayload {
  reportId: string;
  caseNumber: string;
  status: 'investigating' | 'under_review' | 'action_taken' | 'resolved' | 'closed';
  updatedBy: string;
  updatedAt: string;
  comment?: string;
}

/**
 * 解決通知ペイロード型定義
 */
export interface ResolutionPayload {
  reportId: string;
  caseNumber: string;
  resolvedAt: string;
  resolvedBy: string;
  resolutionSummary: string;
  actionsTaken: string[];
  followUpRequired: boolean;
}

/**
 * 調査進捗通知ペイロード型定義
 */
export interface InvestigationProgressPayload {
  reportId: string;
  caseNumber: string;
  progressNote: string;
  investigatedBy: string;
  investigatedAt: string;
  nextSteps?: string;
}

/**
 * ステータス更新通知をVoiceDriveに送信
 *
 * @param payload - ステータス更新情報
 */
export async function sendStatusUpdateWebhook(payload: StatusUpdatePayload): Promise<void> {
  const webhookEndpoint = process.env.VOICEDRIVE_WEBHOOK_ENDPOINT;
  if (!webhookEndpoint) {
    throw new Error('VOICEDRIVE_WEBHOOK_ENDPOINT not configured');
  }

  try {
    await sendWebhook({
      endpoint: `${webhookEndpoint}/whistleblowing/status-updated`,
      event: 'whistleblowing.status_updated',
      data: {
        reportId: payload.reportId,
        caseNumber: payload.caseNumber,
        status: payload.status,
        updatedBy: payload.updatedBy,
        updatedAt: payload.updatedAt,
        comment: payload.comment || null
      }
    });

    console.log(`[WhistleblowingWebhook] Status update sent - caseNumber: ${payload.caseNumber}, status: ${payload.status}`);
  } catch (error) {
    console.error('[WhistleblowingWebhook] Failed to send status update:', error);
    throw error;
  }
}

/**
 * 解決通知をVoiceDriveに送信
 *
 * @param payload - 解決情報
 */
export async function sendResolutionWebhook(payload: ResolutionPayload): Promise<void> {
  const webhookEndpoint = process.env.VOICEDRIVE_WEBHOOK_ENDPOINT;
  if (!webhookEndpoint) {
    throw new Error('VOICEDRIVE_WEBHOOK_ENDPOINT not configured');
  }

  try {
    await sendWebhook({
      endpoint: `${webhookEndpoint}/whistleblowing/resolved`,
      event: 'whistleblowing.resolved',
      data: {
        reportId: payload.reportId,
        caseNumber: payload.caseNumber,
        resolvedAt: payload.resolvedAt,
        resolvedBy: payload.resolvedBy,
        resolutionSummary: payload.resolutionSummary,
        actionsTaken: payload.actionsTaken,
        followUpRequired: payload.followUpRequired
      }
    });

    console.log(`[WhistleblowingWebhook] Resolution notification sent - caseNumber: ${payload.caseNumber}`);
  } catch (error) {
    console.error('[WhistleblowingWebhook] Failed to send resolution notification:', error);
    throw error;
  }
}

/**
 * 調査進捗通知をVoiceDriveに送信
 *
 * @param payload - 調査進捗情報
 */
export async function sendInvestigationProgressWebhook(payload: InvestigationProgressPayload): Promise<void> {
  const webhookEndpoint = process.env.VOICEDRIVE_WEBHOOK_ENDPOINT;
  if (!webhookEndpoint) {
    throw new Error('VOICEDRIVE_WEBHOOK_ENDPOINT not configured');
  }

  try {
    await sendWebhook({
      endpoint: `${webhookEndpoint}/whistleblowing/investigation-progress`,
      event: 'whistleblowing.investigation_progress',
      data: {
        reportId: payload.reportId,
        caseNumber: payload.caseNumber,
        progressNote: payload.progressNote,
        investigatedBy: payload.investigatedBy,
        investigatedAt: payload.investigatedAt,
        nextSteps: payload.nextSteps || null
      }
    });

    console.log(`[WhistleblowingWebhook] Investigation progress sent - caseNumber: ${payload.caseNumber}`);
  } catch (error) {
    console.error('[WhistleblowingWebhook] Failed to send investigation progress:', error);
    throw error;
  }
}

/**
 * 一括ステータス更新通知
 *
 * @param payloads - ステータス更新情報配列
 */
export async function sendBatchStatusUpdateWebhooks(payloads: StatusUpdatePayload[]): Promise<void> {
  try {
    const promises = payloads.map(payload => sendStatusUpdateWebhook(payload));
    await Promise.all(promises);
    console.log(`[WhistleblowingWebhook] Batch status updates sent - count: ${payloads.length}`);
  } catch (error) {
    console.error('[WhistleblowingWebhook] Failed to send batch status updates:', error);
    throw error;
  }
}
