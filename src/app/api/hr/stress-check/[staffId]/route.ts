/**
 * 人事部門向けストレスチェック結果取得API
 *
 * 本人の同意がある場合のみ制限付き情報を返す
 * 全アクセスを監査ログに記録
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getHRViewStressCheckInfo } from '@/lib/stress-check/access-control';

export interface HRStressCheckResponse {
  success: boolean;
  message?: string;
  data?: {
    canView: boolean;
    consentRequired: boolean;
    consentStatus: boolean | null;
    staffInfo?: {
      staffId: string;
      name: string;
      department: string;
      position: string;
    };
    displayData?: {
      implementationDate: Date;
      stressLevel: 'low' | 'medium' | 'high';
      highStressFlag: boolean;
      needsInterview: boolean;
      hrRecommendations?: string[];
      consentDate?: Date;
    };
    accessDeniedMessage?: string;
  };
  error?: string;
}

/**
 * GET /api/hr/stress-check/[staffId]
 * 人事部門向けストレスチェック結果取得（同意ベースのアクセス制御）
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { staffId: string } }
): Promise<NextResponse<HRStressCheckResponse>> {
  const { staffId } = params;

  try {
    // TODO: 認証チェック - 人事部権限（レベル14-17）確認
    // const session = await getServerSession();
    // const userId = session?.user?.id;
    // const userLevel = await getUserLevel(userId);
    const userId = 'USER_HR_001'; // 仮のユーザーID
    const userLevel = 15; // 仮のレベル（副院長）

    // 人事部権限チェック
    if (userLevel < 14 || userLevel > 17) {
      // 監査ログに不正アクセス試行を記録
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'UNAUTHORIZED_STRESS_CHECK_ACCESS_ATTEMPT',
          targetType: 'StressCheckResult',
          targetId: staffId,
          changes: {
            userLevel,
            reason: '人事部権限なし（レベル14-17が必要）',
          },
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
          timestamp: new Date(),
        },
      });

      return NextResponse.json(
        {
          success: false,
          message: 'アクセス権限がありません',
          error: 'INSUFFICIENT_PERMISSION',
        },
        { status: 403 }
      );
    }

    // 職員情報の取得
    const staff = await prisma.staff.findUnique({
      where: { id: staffId },
      select: {
        id: true,
        name: true,
        department: true,
        position: true,
      },
    });

    if (!staff) {
      return NextResponse.json(
        {
          success: false,
          message: '職員が見つかりません',
          error: 'STAFF_NOT_FOUND',
        },
        { status: 404 }
      );
    }

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

    // アクセス制御チェック
    const accessInfo = getHRViewStressCheckInfo(
      staffId,
      userId,
      userLevel,
      latestStressCheck.consentToShare
    );

    // 監査ログの記録（全アクセスを記録）
    await prisma.auditLog.create({
      data: {
        userId,
        action: accessInfo.canView ? 'HR_STRESS_CHECK_VIEW' : 'HR_STRESS_CHECK_VIEW_DENIED',
        targetType: 'StressCheckResult',
        targetId: latestStressCheck.id,
        changes: {
          staffId,
          staffName: staff.name,
          userLevel,
          consentStatus: accessInfo.consentStatus,
          accessGranted: accessInfo.canView,
          viewedFields: accessInfo.canView
            ? ['stressLevel', 'highStressFlag', 'needsInterview', 'hrRecommendations']
            : [],
        },
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        timestamp: new Date(),
      },
    });

    // 同意がない場合: 制限情報のみ返す
    if (!accessInfo.canView) {
      return NextResponse.json(
        {
          success: true,
          data: {
            canView: false,
            consentRequired: accessInfo.consentRequired,
            consentStatus: accessInfo.consentStatus,
            staffInfo: {
              staffId: staff.id,
              name: staff.name,
              department: staff.department || '未設定',
              position: staff.position || '未設定',
            },
            accessDeniedMessage: accessInfo.accessDeniedMessage,
          },
        },
        { status: 200 }
      );
    }

    // 同意あり: 制限付きデータを返す
    return NextResponse.json(
      {
        success: true,
        data: {
          canView: true,
          consentRequired: accessInfo.consentRequired,
          consentStatus: accessInfo.consentStatus,
          staffInfo: {
            staffId: staff.id,
            name: staff.name,
            department: staff.department || '未設定',
            position: staff.position || '未設定',
          },
          displayData: {
            implementationDate: latestStressCheck.implementationDate,
            stressLevel: latestStressCheck.stressLevel as 'low' | 'medium' | 'high',
            highStressFlag: latestStressCheck.highStressFlag,
            needsInterview: latestStressCheck.needsInterview,
            hrRecommendations: latestStressCheck.hrRecommendations as string[] | undefined,
            consentDate: latestStressCheck.consentDate || undefined,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('人事部ストレスチェック結果取得エラー:', error);

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
