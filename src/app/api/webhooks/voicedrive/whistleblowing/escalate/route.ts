/**
 * VoiceDrive Webhook: 内部通報エスカレーション受信
 *
 * 用途: VoiceDriveで深刻度が高い通報が発生した際のエスカレーション通知受信
 * 処理フロー:
 *  1. VoiceDriveから通報エスカレーション通知を受信
 *  2. 医療システム側でケース番号（MED-YYYY-NNNN）を発番
 *  3. ケース番号をVoiceDriveに返送
 *  4. 人事部門への通知（将来実装）
 *
 * @see mcp-shared/docs/MyReports_医療システム確認結果_20251026.md
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendWebhook } from '@/lib/webhookSender';
import { generateCaseNumber } from '@/lib/utils/case-number-generator';

/**
 * リクエストペイロード型定義
 */
interface WhistleblowingEscalationPayload {
  event: 'whistleblowing.escalated';
  timestamp: string;
  source: 'voicedrive';
  data: {
    reportId: string;
    anonymousId: string;
    severity: 'high' | 'critical';
    category: string;
    description: string;
    reportedAt: string;
    escalatedAt: string;
    escalatedBy: string;
    requiresUrgentAction: boolean;
  };
}

/**
 * POST /api/webhooks/voicedrive/whistleblowing/escalate
 *
 * VoiceDriveからの内部通報エスカレーション通知を受信
 */
export async function POST(request: NextRequest) {
  try {
    // 1. ペイロード解析
    const payload: WhistleblowingEscalationPayload = await request.json();
    const { reportId, anonymousId, severity, category, reportedAt, escalatedAt } = payload.data;

    // TODO: Webhook署名検証（本番環境では実装必須）
    // const signature = request.headers.get('x-voicedrive-signature');
    // if (!signature || !verifyWebhookSignature(...)) {
    //   return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    // }

    console.log(`[Webhook] Whistleblowing escalated - reportId: ${reportId}, severity: ${severity}`);

    // 2. ケース番号発番（MED-YYYY-NNNN形式）
    const caseNumber = await generateCaseNumber();

    // 3. 医療システム側でエスカレーション記録を保存（将来実装）
    // ※ 現在は記録なし（Phase 2.9実装時に対応）
    // await prisma.whistleblowingCase.create({
    //   data: {
    //     caseNumber,
    //     voiceDriveReportId: reportId,
    //     anonymousId,
    //     severity,
    //     category,
    //     reportedAt: new Date(reportedAt),
    //     escalatedAt: new Date(escalatedAt),
    //     status: 'investigating'
    //   }
    // });

    // 4. ケース番号をVoiceDriveに返送
    const webhookEndpoint = process.env.VOICEDRIVE_WEBHOOK_ENDPOINT;
    if (!webhookEndpoint) {
      console.error('[Webhook] VOICEDRIVE_WEBHOOK_ENDPOINT not set');
      return NextResponse.json(
        { error: 'Webhook endpoint not configured' },
        { status: 500 }
      );
    }

    await sendWebhook({
      endpoint: `${webhookEndpoint}/whistleblowing/case-number-issued`,
      event: 'whistleblowing.case_number_issued',
      data: {
        reportId,
        caseNumber,
        issuedAt: new Date().toISOString(),
        acknowledgement: {
          received: true,
          receivedAt: new Date().toISOString(),
          nextAction: 'Investigation initiated by medical HR department'
        }
      }
    });

    console.log(`[Webhook] Case number ${caseNumber} issued for reportId: ${reportId}`);

    // 5. 人事部門への通知（将来実装）
    // ※ メール/Slack通知などを実装予定
    // await notifyHRDepartment({
    //   caseNumber,
    //   severity,
    //   category,
    //   escalatedAt
    // });

    return NextResponse.json({
      success: true,
      caseNumber,
      issuedAt: new Date().toISOString(),
      message: 'Case number issued and HR department notified'
    });

  } catch (error) {
    console.error('[Webhook] Whistleblowing escalation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
