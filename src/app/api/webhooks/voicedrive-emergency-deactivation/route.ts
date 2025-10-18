import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyWebhookSignature, verifyTimestamp } from '@/lib/webhookVerifier';

const prisma = new PrismaClient();

/**
 * VoiceDrive緊急アカウント停止通知受信エンドポイント
 *
 * POST /api/webhooks/voicedrive-emergency-deactivation
 *
 * VoiceDrive側で緊急アカウント停止が実行された際に呼び出される
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Webhook署名検証
    const signature = request.headers.get('x-voicedrive-signature');
    const timestamp = request.headers.get('x-voicedrive-timestamp');

    if (!signature || !timestamp) {
      return NextResponse.json(
        { error: 'Missing signature or timestamp headers' },
        { status: 401 }
      );
    }

    // タイムスタンプ検証（リプレイ攻撃防止）
    if (!verifyTimestamp(timestamp)) {
      return NextResponse.json(
        { error: 'Invalid or expired timestamp' },
        { status: 401 }
      );
    }

    const rawBody = await request.text();
    const payload = JSON.parse(rawBody);

    const secret = process.env.VOICEDRIVE_WEBHOOK_SECRET;
    if (!secret) {
      console.error('VOICEDRIVE_WEBHOOK_SECRET not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const isValid = verifyWebhookSignature(rawBody, signature, timestamp, secret);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    // 2. 即座にレスポンス（5秒以内）
    // バックグラウンドで処理を継続
    const response = NextResponse.json({ success: true }, { status: 200 });

    // 3. バックグラウンド処理（非同期）
    processEmergencyDeactivation(payload).catch((error) => {
      console.error('Background processing error:', error);
    });

    return response;

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * 緊急アカウント停止処理（バックグラウンド）
 */
async function processEmergencyDeactivation(payload: any) {
  const {
    event,
    data: {
      deactivationId,
      targetEmployeeId,
      targetUserName,
      executedBy,
      executorEmployeeId,
      executorName,
      executorLevel,
      reason,
      timestamp: deactivationTimestamp
    }
  } = payload;

  console.log('[Webhook] Emergency deactivation received:', {
    deactivationId,
    targetEmployeeId,
    executedBy: executorName
  });

  try {
    // 冪等性チェック（同じdeactivationIdで既に処理済みか確認）
    const existing = await prisma.employeeAccountStatusHistory.findFirst({
      where: { voicedriveDeactivationId: deactivationId }
    });

    if (existing) {
      console.log('[Webhook] Already processed:', deactivationId);
      return;
    }

    // トランザクション開始
    await prisma.$transaction(async (tx) => {
      // 1. Employee の account_status を更新
      const employee = await tx.employee.findUnique({
        where: { employeeCode: targetEmployeeId }
      });

      if (!employee) {
        console.warn('[Webhook] Employee not found:', targetEmployeeId);
        // 職員が見つからない場合でも履歴は記録（同期エラー記録）
      } else {
        await tx.employee.update({
          where: { employeeCode: targetEmployeeId },
          data: { status: 'inactive' }
        });

        console.log('[Webhook] Employee status updated:', {
          employeeId: targetEmployeeId,
          newStatus: 'inactive'
        });
      }

      // 2. employee_account_status_history に履歴記録
      await tx.employeeAccountStatusHistory.create({
        data: {
          employeeId: targetEmployeeId,
          previousStatus: employee?.status || 'unknown',
          newStatus: 'inactive',
          sourceSystem: 'voicedrive_emergency',
          isEmergencyChange: true,
          voicedriveDeactivationId: deactivationId,
          changedBy: executedBy,
          changedByName: executorName,
          reason: reason || '緊急アカウント停止',
          changedAt: new Date(deactivationTimestamp),
          syncedFromVoicedriveAt: new Date(),
          approvalRequired: false // 緊急処理は事後承認不要（VoiceDrive側で既に承認済み）
        }
      });

      console.log('[Webhook] History record created:', {
        deactivationId,
        employeeId: targetEmployeeId
      });
    });

    console.log('[Webhook] Emergency deactivation completed:', deactivationId);

  } catch (error) {
    console.error('[Webhook] Processing failed:', {
      deactivationId,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
}
