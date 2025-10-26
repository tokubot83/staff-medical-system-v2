import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/middleware/jwt-auth';

/**
 * GET /api/medical/executive/leadership-rating
 *
 * リーダーシップ評価取得API
 *
 * 用途: ExecutiveFunctionsPageの組織分析タブで使用
 *
 * 返却データ:
 * - 全体平均リーダーシップスコア
 * - 施設別平均リーダーシップスコア
 *
 * データソース: V3評価システム（V3Evaluationテーブル）
 *
 * 認可: Level 13（院長・施設長）以上
 *
 * Query Parameters:
 * - year: 評価年度（デフォルト: 現在の年度）
 * - period: 評価期間（1-2、デフォルト: 最新期間）
 * - facilityId: 施設ID（オプション、指定時は施設別データのみ）
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
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
    const period = parseInt(searchParams.get('period') || '1');
    const facilityId = searchParams.get('facilityId') || null;

    // =============================================
    // 1. V3評価データからリーダーシップスコアを取得
    // =============================================

    // V3評価のリーダーシップ項目を集計
    // TODO: V3Evaluationテーブルが実装されたら、実際のデータから取得
    // 現時点では仮実装

    const evaluationWhere: any = {
      year,
      period,
      // リーダーシップ評価のカテゴリでフィルタ
      // category: 'leadership'
    };

    if (facilityId) {
      evaluationWhere.facilityId = facilityId;
    }

    // =============================================
    // 仮実装: 評価データがない場合のダミーデータ
    // =============================================
    // TODO: 実際のV3Evaluationテーブルから取得するコードに置き換え

    /*
    // 実装例（V3Evaluationテーブルが存在する場合）:
    const leadershipEvaluations = await prisma.v3Evaluation.findMany({
      where: evaluationWhere,
      select: {
        employeeId: true,
        facilityId: true,
        leadershipScore: true
      }
    });

    const overall = leadershipEvaluations.length > 0
      ? leadershipEvaluations.reduce((sum, e) => sum + e.leadershipScore, 0) / leadershipEvaluations.length
      : 0;
    */

    // 仮データ（実装例）
    const overall = 4.3;

    // =============================================
    // 2. 施設別平均計算
    // =============================================

    let byFacility: Record<string, number> | null = null;

    if (!facilityId) {
      // 全施設の平均を計算（仮データ）
      // TODO: 実際のV3Evaluationテーブルから施設別に集計

      /*
      // 実装例:
      const facilityGroups = await prisma.v3Evaluation.groupBy({
        by: ['facilityId'],
        where: {
          year,
          period
        },
        _avg: {
          leadershipScore: true
        }
      });

      byFacility = {};
      for (const group of facilityGroups) {
        byFacility[group.facilityId] = group._avg.leadershipScore || 0;
      }
      */

      byFacility = {
        'obara-hospital': 4.5,
        'ryokufuen': 4.2,
        'visiting-nurse': 4.1
      };
    }

    // =============================================
    // 3. 評価日取得
    // =============================================

    // 評価実施日（仮設定）
    const surveyMonth = period === 1 ? 6 : 12; // 期間1: 6月、期間2: 12月
    const surveyDate = `${year}-${surveyMonth.toString().padStart(2, '0')}-01`;

    // レスポンス構築
    const response = {
      year,
      period,
      facilityId,
      overall: parseFloat(overall.toFixed(2)),
      byFacility,
      surveyDate,
      calculatedAt: new Date().toISOString(),
      calculatedBy: employeeId,
      note: '仮データ: V3Evaluationテーブル実装後に実データから取得'
    };

    console.log(`[ExecutiveLeadership] Leadership rating retrieved for FY${year} P${period} by ${employeeId}`);

    return NextResponse.json(response);

  } catch (error) {
    console.error('[ExecutiveLeadership] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
