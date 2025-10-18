import { PrismaClient } from '@prisma/client';
import { sendWebhookToVoiceDrive } from '@/lib/webhookSender';

const prisma = new PrismaClient();

/**
 * 緊急アカウント停止の事後承認サービス
 */

export interface ApprovalRequest {
  historyId: string;
  approvedBy: string;
  approvedByName: string;
  approvalComment?: string;
}

export interface RejectionRequest {
  historyId: string;
  rejectedBy: string;
  rejectedByName: string;
  rejectionReason: string;
}

/**
 * 緊急アカウント停止を事後承認
 *
 * @param request - 承認リクエスト
 * @returns 承認成功ならtrue
 */
export async function approveEmergencyDeactivation(
  request: ApprovalRequest
): Promise<boolean> {
  const { historyId, approvedBy, approvedByName, approvalComment } = request;

  try {
    // 履歴レコードを取得
    const history = await prisma.employeeAccountStatusHistory.findUnique({
      where: { id: historyId }
    });

    if (!history) {
      throw new Error(`History record not found: ${historyId}`);
    }

    if (!history.isEmergencyChange) {
      throw new Error('Not an emergency change record');
    }

    if (history.approvedAt) {
      throw new Error('Already approved');
    }

    // トランザクション開始
    await prisma.$transaction(async (tx) => {
      // 1. 履歴レコードを更新（承認情報を記録）
      await tx.employeeAccountStatusHistory.update({
        where: { id: historyId },
        data: {
          approvedBy,
          approvedByName,
          approvedAt: new Date(),
          reason: approvalComment
            ? `${history.reason} （承認コメント: ${approvalComment}）`
            : history.reason
        }
      });

      console.log('[Approval] Emergency deactivation approved:', {
        historyId,
        employeeId: history.employeeId,
        approvedBy: approvedByName
      });
    });

    // 2. VoiceDriveへWebhook送信
    const voicedriveUrl = process.env.VOICEDRIVE_WEBHOOK_URL;
    const secret = process.env.VOICEDRIVE_WEBHOOK_SECRET;

    if (!voicedriveUrl || !secret) {
      console.error('[Approval] VoiceDrive webhook not configured');
      // Webhook送信失敗でも承認は完了している
      return true;
    }

    const webhookSuccess = await sendWebhookToVoiceDrive(
      `${voicedriveUrl}/api/webhook/staff-system/status-change`,
      'account.status_changed',
      {
        employeeId: history.employeeId,
        previousStatus: 'emergency_deactivated',
        newStatus: 'retired',
        changedAt: new Date().toISOString(),
        approvalInfo: {
          approvedBy,
          approvedByName,
          approvedAt: new Date().toISOString(),
          comment: approvalComment
        },
        voicedriveDeactivationId: history.voicedriveDeactivationId
      },
      secret
    );

    if (!webhookSuccess) {
      console.warn('[Approval] Webhook to VoiceDrive failed (approval completed)');
    }

    return true;

  } catch (error) {
    console.error('[Approval] Failed:', {
      historyId,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
}

/**
 * 緊急アカウント停止を却下（復元）
 *
 * @param request - 却下リクエスト
 * @returns 却下成功ならtrue
 */
export async function rejectEmergencyDeactivation(
  request: RejectionRequest
): Promise<boolean> {
  const { historyId, rejectedBy, rejectedByName, rejectionReason } = request;

  try {
    // 履歴レコードを取得
    const history = await prisma.employeeAccountStatusHistory.findUnique({
      where: { id: historyId }
    });

    if (!history) {
      throw new Error(`History record not found: ${historyId}`);
    }

    if (!history.isEmergencyChange) {
      throw new Error('Not an emergency change record');
    }

    // トランザクション開始
    await prisma.$transaction(async (tx) => {
      // 1. Employee の status を元に戻す
      await tx.employee.update({
        where: { employeeCode: history.employeeId },
        data: { status: history.previousStatus || 'active' }
      });

      // 2. 履歴レコードを更新（却下情報を記録）
      await tx.employeeAccountStatusHistory.update({
        where: { id: historyId },
        data: {
          reason: `${history.reason} （却下理由: ${rejectionReason}）`,
          updatedAt: new Date()
        }
      });

      // 3. 却下履歴を新規作成
      await tx.employeeAccountStatusHistory.create({
        data: {
          employeeId: history.employeeId,
          previousStatus: history.newStatus,
          newStatus: history.previousStatus || 'active',
          sourceSystem: 'staff_medical_system',
          isEmergencyChange: false,
          changedBy: rejectedBy,
          changedByName: rejectedByName,
          reason: `緊急処理却下（復元）: ${rejectionReason}`,
          changedAt: new Date()
        }
      });

      console.log('[Rejection] Emergency deactivation rejected:', {
        historyId,
        employeeId: history.employeeId,
        rejectedBy: rejectedByName
      });
    });

    // VoiceDriveへWebhook送信
    const voicedriveUrl = process.env.VOICEDRIVE_WEBHOOK_URL;
    const secret = process.env.VOICEDRIVE_WEBHOOK_SECRET;

    if (voicedriveUrl && secret) {
      await sendWebhookToVoiceDrive(
        `${voicedriveUrl}/api/webhook/staff-system/status-change`,
        'account.status_changed',
        {
          employeeId: history.employeeId,
          previousStatus: 'emergency_deactivated',
          newStatus: history.previousStatus || 'active',
          changedAt: new Date().toISOString(),
          rejectionInfo: {
            rejectedBy,
            rejectedByName,
            rejectedAt: new Date().toISOString(),
            reason: rejectionReason
          },
          voicedriveDeactivationId: history.voicedriveDeactivationId
        },
        secret
      );
    }

    return true;

  } catch (error) {
    console.error('[Rejection] Failed:', {
      historyId,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
}

/**
 * 承認待ちの緊急処理一覧を取得
 *
 * @returns 承認待ちの履歴レコードリスト
 */
export async function getPendingEmergencyDeactivations() {
  return await prisma.employeeAccountStatusHistory.findMany({
    where: {
      isEmergencyChange: true,
      approvalRequired: true,
      approvedAt: null
    },
    orderBy: {
      changedAt: 'desc'
    }
  });
}
