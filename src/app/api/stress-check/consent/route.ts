/**
 * ストレスチェック結果 同意状況更新API
 *
 * 職員が自分のストレスチェック結果を人事部門と共有することへの同意を更新
 * 労働安全衛生法第66条の10第2項準拠
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database/prisma';

export interface ConsentUpdateRequest {
  staffId: string;
  consent: boolean;
  reason?: string; // 変更理由（任意）
}

export interface ConsentUpdateResponse {
  success: boolean;
  message: string;
  data?: {
    staffId: string;
    consentToShare: boolean;
    consentDate: Date;
    previousConsent: boolean | null;
  };
  error?: string;
}

/**
 * POST /api/stress-check/consent
 * ストレスチェック結果の人事部共有同意状況を更新
 */
export async function POST(request: NextRequest): Promise<NextResponse<ConsentUpdateResponse>> {
  try {
    // リクエストボディの取得
    const body: ConsentUpdateRequest = await request.json();
    const { staffId, consent, reason } = body;

    // バリデーション
    if (!staffId) {
      return NextResponse.json(
        {
          success: false,
          message: '職員IDが指定されていません',
          error: 'STAFF_ID_REQUIRED',
        },
        { status: 400 }
      );
    }

    if (typeof consent !== 'boolean') {
      return NextResponse.json(
        {
          success: false,
          message: '同意状況（true/false）を指定してください',
          error: 'CONSENT_VALUE_INVALID',
        },
        { status: 400 }
      );
    }

    // TODO: 認証チェック - 本人確認
    // const session = await getServerSession();
    // if (session?.user?.id !== staffId) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       message: '自分の同意状況のみ更新できます',
    //       error: 'UNAUTHORIZED',
    //     },
    //     { status: 403 }
    //   );
    // }

    // 最新のストレスチェック結果を取得
    const latestStressCheck = await prisma.stressCheckResult.findFirst({
      where: { staffId },
      orderBy: { implementationDate: 'desc' },
    });

    if (!latestStressCheck) {
      return NextResponse.json(
        {
          success: false,
          message: 'ストレスチェック結果が見つかりません',
          error: 'STRESS_CHECK_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // 現在の同意状況を保存（監査ログ用）
    const previousConsent = latestStressCheck.consentToShare;

    // 同意状況の更新
    const updated = await prisma.stressCheckResult.update({
      where: { id: latestStressCheck.id },
      data: {
        consentToShare: consent,
        consentDate: new Date(),
      },
    });

    // 監査ログの記録
    await prisma.auditLog.create({
      data: {
        userId: staffId,
        action: 'STRESS_CHECK_CONSENT_UPDATE',
        targetType: 'StressCheckResult',
        targetId: updated.id,
        changes: {
          previousConsent,
          newConsent: consent,
          reason: reason || '本人による同意状況の変更',
        },
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        timestamp: new Date(),
      },
    });

    // VoiceDrive通知（非同期・エラーは無視）
    try {
      await notifyVoiceDriveConsentChange(staffId, consent, previousConsent);
    } catch (notifyError) {
      console.error('VoiceDrive通知エラー（処理は継続）:', notifyError);
    }

    return NextResponse.json(
      {
        success: true,
        message: consent
          ? 'ストレスチェック結果の人事部門共有に同意しました'
          : 'ストレスチェック結果の人事部門共有への同意を取り消しました',
        data: {
          staffId: updated.staffId,
          consentToShare: updated.consentToShare,
          consentDate: updated.consentDate!,
          previousConsent,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('同意状況更新エラー:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'サーバーエラーが発生しました',
        error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/stress-check/consent?staffId=xxx
 * 現在の同意状況を取得
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const staffId = searchParams.get('staffId');

    if (!staffId) {
      return NextResponse.json(
        {
          success: false,
          message: '職員IDが指定されていません',
          error: 'STAFF_ID_REQUIRED',
        },
        { status: 400 }
      );
    }

    // TODO: 認証チェック - 本人または権限者のみ
    // const session = await getServerSession();
    // const userLevel = await getUserLevel(session?.user?.id);
    // if (session?.user?.id !== staffId && userLevel < 97) {
    //   return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 403 });
    // }

    // 最新のストレスチェック結果を取得
    const latestStressCheck = await prisma.stressCheckResult.findFirst({
      where: { staffId },
      orderBy: { implementationDate: 'desc' },
      select: {
        id: true,
        staffId: true,
        consentToShare: true,
        consentDate: true,
        implementationDate: true,
      },
    });

    if (!latestStressCheck) {
      return NextResponse.json(
        {
          success: false,
          message: 'ストレスチェック結果が見つかりません',
          error: 'STRESS_CHECK_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          staffId: latestStressCheck.staffId,
          consentToShare: latestStressCheck.consentToShare,
          consentDate: latestStressCheck.consentDate,
          implementationDate: latestStressCheck.implementationDate,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('同意状況取得エラー:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'サーバーエラーが発生しました',
        error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
      },
      { status: 500 }
    );
  }
}

/**
 * VoiceDriveへの同意状況変更通知
 *
 * @param staffId 職員ID
 * @param newConsent 新しい同意状況
 * @param previousConsent 以前の同意状況
 */
async function notifyVoiceDriveConsentChange(
  staffId: string,
  newConsent: boolean,
  previousConsent: boolean | null
): Promise<void> {
  const VOICEDRIVE_WEBHOOK_URL = process.env.VOICEDRIVE_WEBHOOK_URL;
  const VOICEDRIVE_API_KEY = process.env.VOICEDRIVE_API_KEY;

  if (!VOICEDRIVE_WEBHOOK_URL) {
    console.warn('VoiceDrive Webhook URL未設定のため通知スキップ');
    return;
  }

  const response = await fetch(VOICEDRIVE_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${VOICEDRIVE_API_KEY || ''}`,
    },
    body: JSON.stringify({
      event: 'stress_check_consent_changed',
      staffId,
      previousConsent,
      newConsent,
      timestamp: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error(`VoiceDrive通知失敗: ${response.status} ${response.statusText}`);
  }
}
