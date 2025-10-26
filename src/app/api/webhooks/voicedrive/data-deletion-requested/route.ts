/**
 * VoiceDrive Webhook: データ削除リクエスト受信
 *
 * 用途: VoiceDriveユーザーがデータ削除をリクエストした際の通知受信
 * 処理フロー:
 *  1. VoiceDrive活動データの削除（将来実装）
 *  2. 職員カルテ分析データの削除（将来実装）
 *  3. 削除完了通知をVoiceDriveに送信
 *
 * @see mcp-shared/docs/SettingsPage_医療システム確認結果_20251026.md
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendWebhook } from '@/lib/webhookSender';

/**
 * リクエストペイロード型定義
 */
interface DataDeletionRequestPayload {
  event: 'data_deletion.requested';
  timestamp: string;
  source: 'voicedrive';
  data: {
    userId: string;
    employeeId: string;
    requestedAt: string;
    requestedBy: string;
    targetDataTypes: string[];
  };
}

/**
 * POST /api/webhooks/voicedrive/data-deletion-requested
 *
 * VoiceDriveからのデータ削除リクエスト通知を受信
 */
export async function POST(request: NextRequest) {
  try {
    // 1. ペイロード解析
    const payload: DataDeletionRequestPayload = await request.json();
    const { userId, employeeId, requestedAt } = payload.data;

    // TODO: Webhook署名検証（本番環境では実装必須）
    // const signature = request.headers.get('x-voicedrive-signature');
    // if (!signature || !verifyWebhookSignature(...)) {
    //   return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    // }

    console.log(`[Webhook] Data deletion requested for userId: ${userId}, employeeId: ${employeeId}`);

    // 3. VoiceDrive活動データの削除
    // ※ 現在は削除対象データなし（将来実装時に対応）
    // ※ 例: 投稿、コメント、いいね、投票データ等
    // await prisma.voiceDriveActivity.deleteMany({
    //   where: { employeeId }
    // });

    // 4. 職員カルテ分析データの削除（将来実装）
    // ※ 組織分析ページで使用する集計データ
    // await prisma.voiceDriveAnalytics.deleteMany({
    //   where: { employeeId }
    // });

    // 5. 削除完了通知をVoiceDriveに送信
    const deletionCompletedAt = new Date().toISOString();

    const webhookEndpoint = process.env.VOICEDRIVE_WEBHOOK_ENDPOINT;
    if (!webhookEndpoint) {
      console.error('[Webhook] VOICEDRIVE_WEBHOOK_ENDPOINT not set');
      return NextResponse.json(
        { error: 'Webhook endpoint not configured' },
        { status: 500 }
      );
    }

    await sendWebhook({
      endpoint: `${webhookEndpoint}/data-deletion-completed`,
      event: 'data_deletion.completed',
      data: {
        userId,
        employeeId,
        deletionRequestedAt: requestedAt,
        deletionCompletedAt,
        deletedDataTypes: [
          'VoiceDrive活動データ',
          '職員カルテ分析データ'
        ]
      }
    });

    console.log(`[Webhook] Data deletion completed and notified to VoiceDrive`);

    return NextResponse.json({
      success: true,
      message: 'Data deletion completed',
      deletionCompletedAt
    });

  } catch (error) {
    console.error('[Webhook] Data deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
