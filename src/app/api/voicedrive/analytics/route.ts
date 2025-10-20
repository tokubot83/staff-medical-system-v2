import { NextRequest, NextResponse } from 'next/server';
import { voiceDriveDataService } from '@/services/VoiceDriveDataService';
import { voiceDriveAnalyticsService, KAnonymityError } from '@/services/VoiceDriveAnalyticsService';

// 動的レンダリングを強制（ビルド時の静的生成をスキップ）
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const facility = searchParams.get('facility') || '';

    console.log(`[VoiceDrive Analytics API] 分析リクエスト - 施設: ${facility || '全施設'}`);

    // 1. 同意済みユーザー取得
    const consentedUserIds = await voiceDriveDataService.getConsentedUsers();
    console.log(`[VoiceDrive Analytics API] 同意済みユーザー: ${consentedUserIds.length}名`);

    // 2. 削除リクエスト取得
    const deletionRequests = await voiceDriveDataService.getDeletionRequests();
    console.log(`[VoiceDrive Analytics API] 削除リクエスト: ${deletionRequests.length}件`);

    // 3. 全ユーザー数取得
    const allConsents = await voiceDriveDataService.getAllConsents();
    const totalUsers = allConsents.length;
    console.log(`[VoiceDrive Analytics API] 全ユーザー: ${totalUsers}名`);

    // 4. K-匿名性チェック
    let kAnonymityCheck = {
      passed: false,
      userCount: consentedUserIds.length,
      minimumRequired: 5
    };

    try {
      voiceDriveAnalyticsService.checkKAnonymity(consentedUserIds);
      kAnonymityCheck.passed = true;
      console.log('[VoiceDrive Analytics API] K-匿名性チェック: 合格');
    } catch (error) {
      if (error instanceof KAnonymityError) {
        console.log(`[VoiceDrive Analytics API] K-匿名性チェック: 不合格（${error.userCount}名 < ${error.minimumRequired}名）`);
        kAnonymityCheck = {
          passed: false,
          userCount: error.userCount,
          minimumRequired: error.minimumRequired
        };
      } else {
        throw error;
      }
    }

    // 5. 部署別分布取得（モックデータ - 将来的にはVoiceDrive DBから取得）
    let departmentDistribution = undefined;

    if (kAnonymityCheck.passed) {
      // K-匿名性チェック合格時のみ部署別分布を返す
      departmentDistribution = [
        { department: '内科病棟', count: 3, percentage: 37.5 },
        { department: '外来', count: 2, percentage: 25.0 },
        { department: '地域包括ケア病棟', count: 2, percentage: 25.0 },
        { department: '外科病棟', count: 1, percentage: 12.5 }
      ];
    }

    // 6. レスポンス作成
    const response = {
      kAnonymityCheck,
      consentedUsers: consentedUserIds.length,
      totalUsers,
      deletionRequests: deletionRequests.length,
      departmentDistribution,
      lastUpdated: new Date().toISOString(),
      facility: facility || 'all'
    };

    console.log('[VoiceDrive Analytics API] 分析完了:', response);

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('[VoiceDrive Analytics API] エラー:', error);

    return NextResponse.json(
      {
        error: 'VoiceDrive分析データの取得に失敗しました',
        message: error instanceof Error ? error.message : '不明なエラー',
        kAnonymityCheck: {
          passed: false,
          userCount: 0,
          minimumRequired: 5
        },
        consentedUsers: 0,
        totalUsers: 0,
        deletionRequests: 0,
        lastUpdated: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
