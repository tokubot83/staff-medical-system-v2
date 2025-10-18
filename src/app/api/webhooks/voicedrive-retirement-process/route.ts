import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyWebhookSignature, verifyTimestamp } from '@/lib/webhookVerifier';

const prisma = new PrismaClient();

/**
 * VoiceDrive退職処理通知受信エンドポイント
 *
 * POST /api/webhooks/voicedrive-retirement-process
 *
 * VoiceDrive側で退職処理（4ステップ）が実行された際に呼び出される
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
    processRetirementProcess(payload).catch((error) => {
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
 * 退職処理通知処理（バックグラウンド）
 */
async function processRetirementProcess(payload: any) {
  const { event, data } = payload;

  console.log('[Webhook] Retirement process event received:', {
    event,
    processId: data.processId,
    step: data.step
  });

  try {
    // イベントタイプによって処理を分岐
    if (event === 'retirement.process_started') {
      await handleRetirementStarted(data);
    } else if (event === 'retirement.step_completed') {
      await handleStepCompleted(data);
    } else if (event === 'retirement.process_completed') {
      await handleRetirementCompleted(data);
    } else {
      console.warn('[Webhook] Unknown event type:', event);
    }

  } catch (error) {
    console.error('[Webhook] Processing failed:', {
      event,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
}

/**
 * 退職処理開始通知
 */
async function handleRetirementStarted(data: any) {
  const {
    processId,
    employeeId,
    employeeName,
    startedBy,
    startedByName,
    timestamp
  } = data;

  // 冪等性チェック
  const existing = await prisma.employeeAccountStatusHistory.findFirst({
    where: { voicedriveRetirementProcessId: processId }
  });

  if (existing) {
    console.log('[Webhook] Retirement process already recorded:', processId);
    return;
  }

  // 履歴記録
  await prisma.employeeAccountStatusHistory.create({
    data: {
      employeeId: employeeId,
      previousStatus: 'active',
      newStatus: 'retiring', // 退職処理中
      sourceSystem: 'voicedrive_emergency',
      isEmergencyChange: true,
      voicedriveRetirementProcessId: processId,
      changedBy: startedBy,
      changedByName: startedByName,
      reason: '緊急退職処理開始',
      changedAt: new Date(timestamp),
      syncedFromVoicedriveAt: new Date(),
      approvalRequired: false
    }
  });

  console.log('[Webhook] Retirement process started:', {
    processId,
    employeeId
  });
}

/**
 * 退職処理ステップ完了通知
 */
async function handleStepCompleted(data: any) {
  const {
    processId,
    step,
    stepName,
    completedAt
  } = data;

  console.log('[Webhook] Retirement step completed:', {
    processId,
    step,
    stepName,
    completedAt
  });

  // ステップ完了は記録のみ（employee_account_status_history は更新しない）
  // 必要に応じて別テーブル（retirement_step_history）に記録可能
}

/**
 * 退職処理完了通知
 */
async function handleRetirementCompleted(data: any) {
  const {
    processId,
    employeeId,
    completedAt
  } = data;

  await prisma.$transaction(async (tx) => {
    // 1. Employee の status を更新
    await tx.employee.update({
      where: { employeeCode: employeeId },
      data: {
        status: 'retired',
        retiredAt: new Date(completedAt)
      }
    });

    // 2. 履歴記録を更新（退職処理開始 → 完了）
    const history = await tx.employeeAccountStatusHistory.findFirst({
      where: { voicedriveRetirementProcessId: processId }
    });

    if (history) {
      await tx.employeeAccountStatusHistory.update({
        where: { id: history.id },
        data: {
          newStatus: 'retired',
          updatedAt: new Date()
        }
      });
    } else {
      // 履歴が見つからない場合は新規作成
      await tx.employeeAccountStatusHistory.create({
        data: {
          employeeId: employeeId,
          previousStatus: 'active',
          newStatus: 'retired',
          sourceSystem: 'voicedrive_emergency',
          isEmergencyChange: true,
          voicedriveRetirementProcessId: processId,
          reason: '緊急退職処理完了',
          changedAt: new Date(completedAt),
          syncedFromVoicedriveAt: new Date(),
          approvalRequired: false
        }
      });
    }
  });

  console.log('[Webhook] Retirement process completed:', {
    processId,
    employeeId
  });
}
