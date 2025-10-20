/**
 * 同意状況ダッシュボードデータ取得API
 *
 * 健診担当者（レベル97）・産業医（レベル98）・システム管理者（レベル99）専用
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database/prisma';
import { logHealthDataAccess } from '@/lib/audit/health-data-audit';

// 動的レンダリングを強制（ビルド時の静的生成をスキップ）
export const dynamic = 'force-dynamic'

export interface ConsentDashboardResponse {
  success: boolean;
  message?: string;
  data?: {
    statistics: {
      total: number;
      consented: number;
      notConsented: number;
      notSet: number;
      consentRate: number;
    };
    staffList: {
      staffId: string;
      name: string;
      department: string;
      position: string;
      implementationDate: Date | null;
      consentStatus: boolean | null;
      consentDate: Date | null;
      highStressFlag: boolean;
    }[];
  };
  error?: string;
}

/**
 * GET /api/health/consent-dashboard
 * 全職員の同意状況を取得
 */
export async function GET(request: NextRequest): Promise<NextResponse<ConsentDashboardResponse>> {
  try {
    // TODO: 認証チェック - 健診担当者以上（レベル97-99）確認
    // const session = await getServerSession();
    // const userId = session?.user?.id;
    // const userLevel = await getUserLevel(userId);
    const userId = 'USER_HEALTH_001'; // 仮のユーザーID
    const userLevel = 97; // 仮のレベル（健診担当者）

    // 権限チェック
    if (userLevel < 97 || userLevel > 99) {
      return NextResponse.json(
        {
          success: false,
          message: 'アクセス権限がありません（健診担当者以上のみ）',
          error: 'INSUFFICIENT_PERMISSION',
        },
        { status: 403 }
      );
    }

    // 全職員のストレスチェック結果を取得（最新のみ）
    const allStaff = await prisma.staff.findMany({
      select: {
        id: true,
        name: true,
        department: true,
        position: true,
      },
      where: {
        isActive: true, // 在籍中の職員のみ
      },
    });

    // 各職員の最新ストレスチェック結果を取得
    const staffListPromises = allStaff.map(async (staff) => {
      const latestStressCheck = await prisma.stressCheckResult.findFirst({
        where: { staffId: staff.id },
        orderBy: { implementationDate: 'desc' },
        select: {
          implementationDate: true,
          consentToShare: true,
          consentDate: true,
          highStressFlag: true,
        },
      });

      return {
        staffId: staff.id,
        name: staff.name,
        department: staff.department || '未設定',
        position: staff.position || '未設定',
        implementationDate: latestStressCheck?.implementationDate || null,
        consentStatus: latestStressCheck?.consentToShare || null,
        consentDate: latestStressCheck?.consentDate || null,
        highStressFlag: latestStressCheck?.highStressFlag || false,
      };
    });

    const staffList = await Promise.all(staffListPromises);

    // 統計計算
    const total = staffList.filter((s) => s.implementationDate !== null).length; // 受検者のみカウント
    const consented = staffList.filter((s) => s.consentStatus === true).length;
    const notConsented = staffList.filter((s) => s.consentStatus === false).length;
    const notSet = staffList.filter(
      (s) => s.implementationDate !== null && s.consentStatus === null
    ).length;
    const consentRate = total > 0 ? (consented / total) * 100 : 0;

    const statistics = {
      total,
      consented,
      notConsented,
      notSet,
      consentRate,
    };

    // 監査ログ記録
    await logHealthDataAccess({
      userId,
      userLevel,
      action: 'VIEW',
      dataType: 'stress_check',
      targetStaffId: 'ALL', // 全職員の同意状況ダッシュボード
      accessGranted: true,
      viewedFields: ['consentStatus', 'consentDate', 'highStressFlag'],
      accessPurpose: '同意状況ダッシュボード閲覧',
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      timestamp: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          statistics,
          staffList,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('同意状況ダッシュボードデータ取得エラー:', error);

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
