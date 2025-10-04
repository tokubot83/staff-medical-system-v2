/**
 * 自分のストレスチェック結果取得API
 *
 * 職員が自分のストレスチェック結果を取得（本人のみアクセス可能）
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export interface MyStressCheckResultResponse {
  success: boolean;
  message?: string;
  data?: {
    id: string;
    staffId: string;
    implementationDate: Date;
    stressLevel: 'low' | 'medium' | 'high';
    highStressFlag: boolean;
    needsInterview: boolean;
    consentToShare: boolean | null;
    consentDate: Date | null;
    // 本人のみ閲覧可能な詳細情報
    answers?: any; // ストレスチェック質問票の回答
    recommendations?: string[]; // セルフケア推奨事項
  };
  error?: string;
}

/**
 * GET /api/stress-check/my-result?staffId=xxx
 * 自分のストレスチェック結果を取得（本人のみ）
 */
export async function GET(request: NextRequest): Promise<NextResponse<MyStressCheckResultResponse>> {
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

    // TODO: 認証チェック - 本人確認
    // const session = await getServerSession();
    // if (session?.user?.id !== staffId) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       message: '自分の結果のみ閲覧できます',
    //       error: 'UNAUTHORIZED',
    //     },
    //     { status: 403 }
    //   );
    // }

    // 最新のストレスチェック結果を取得
    const latestStressCheck = await prisma.stressCheckResult.findFirst({
      where: { staffId },
      orderBy: { implementationDate: 'desc' },
      select: {
        id: true,
        staffId: true,
        implementationDate: true,
        stressLevel: true,
        highStressFlag: true,
        needsInterview: true,
        consentToShare: true,
        consentDate: true,
        answers: true,
        recommendations: true,
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
          id: latestStressCheck.id,
          staffId: latestStressCheck.staffId,
          implementationDate: latestStressCheck.implementationDate,
          stressLevel: latestStressCheck.stressLevel as 'low' | 'medium' | 'high',
          highStressFlag: latestStressCheck.highStressFlag,
          needsInterview: latestStressCheck.needsInterview,
          consentToShare: latestStressCheck.consentToShare,
          consentDate: latestStressCheck.consentDate,
          answers: latestStressCheck.answers,
          recommendations: latestStressCheck.recommendations as string[] | undefined,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('ストレスチェック結果取得エラー:', error);

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
