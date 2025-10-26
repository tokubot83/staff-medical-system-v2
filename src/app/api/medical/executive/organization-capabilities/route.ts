import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/middleware/jwt-auth';

/**
 * GET /api/medical/executive/organization-capabilities
 *
 * 組織能力評価取得API
 *
 * 用途: ExecutiveFunctionsPageの組織分析タブで使用
 *
 * 返却データ（4軸評価）:
 * - execution: 実行力（0-100）
 * - adaptation: 適応力（0-100）
 * - cohesion: 結束力（0-100）
 * - creativity: 創造性（0-100）
 *
 * データソース: 医療システムアンケートDB（月次バッチ計算）
 *
 * 認可: Level 13（院長・施設長）以上
 *
 * Query Parameters:
 * - year: 対象年（デフォルト: 現在の年）
 * - month: 対象月（デフォルト: 前月）
 * - facilityId: 施設ID（オプション、指定時は施設別データ）
 */
export async function GET(request: NextRequest) {
  try {
    // JWT認証
    const authResult = await verifyJWT(request);
    if (!authResult.valid || !authResult.payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { employeeId, permissionLevel } = authResult.payload;

    // 権限チェック: Level 13（院長・施設長）以上
    if (permissionLevel < 13) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permission level' },
        { status: 403 }
      );
    }

    // クエリパラメータ取得
    const searchParams = request.nextUrl.searchParams;
    const currentDate = new Date();
    const year = parseInt(searchParams.get('year') || currentDate.getFullYear().toString());
    const month = parseInt(searchParams.get('month') || (currentDate.getMonth() === 0 ? '12' : currentDate.getMonth().toString()));
    const facilityId = searchParams.get('facilityId') || null;

    // =============================================
    // 組織能力評価の月次データ取得
    // =============================================

    // TODO: 実際のアンケートDBから月次バッチで計算されたデータを取得
    // 現時点では仮実装

    /*
    // 実装例（OrganizationCapabilitiesMonthlyテーブルが存在する場合）:
    const capabilities = await prisma.organizationCapabilitiesMonthly.findUnique({
      where: {
        year_month_facilityId: {
          year,
          month,
          facilityId: facilityId || null
        }
      }
    });

    if (!capabilities) {
      return NextResponse.json(
        { error: 'No data available for the specified period' },
        { status: 404 }
      );
    }

    const { execution, adaptation, cohesion, creativity, calculatedAt, responseRate, sampleSize } = capabilities;
    */

    // =============================================
    // 仮実装: 固定値を返却
    // =============================================

    // VoiceDriveチームからの合意: 月次バッチで計算
    // 医療システム側で毎月1日AM 3:00にバッチ実行予定

    const execution = 92;      // 実行力
    const adaptation = 88;     // 適応力
    const cohesion = 90;       // 結束力
    const creativity = 75;     // 創造性

    const calculatedAt = new Date(year, month - 1, 1, 3, 0, 0).toISOString();
    const responseRate = 87.5; // アンケート回答率
    const sampleSize = 450;    // サンプル数

    // レスポンス構築
    const response = {
      year,
      month,
      facilityId,
      execution,
      adaptation,
      cohesion,
      creativity,
      calculatedAt,
      method: 'survey', // アンケート調査による算出
      responseRate,
      sampleSize,
      note: '仮データ: アンケートDBおよび月次バッチ実装後に実データから取得',
      retrievedBy: employeeId
    };

    console.log(`[ExecutiveOrgCapabilities] Organization capabilities retrieved for ${year}-${month} by ${employeeId}`);

    return NextResponse.json(response);

  } catch (error) {
    console.error('[ExecutiveOrgCapabilities] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
