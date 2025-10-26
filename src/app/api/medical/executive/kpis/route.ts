import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/middleware/jwt-auth';

/**
 * GET /api/medical/executive/kpis
 *
 * 経営KPI取得API
 *
 * 用途: ExecutiveFunctionsPageの経営概要タブで使用
 *
 * 返却データ:
 * - 総売上・純利益（財務データ）
 * - 職員数（人事データ）
 * - 患者満足度（アンケートデータ）
 *
 * 認可: Level 99（理事長）、Level 13（院長・施設長）以上
 *
 * Query Parameters:
 * - fiscalYear: 会計年度（デフォルト: 現在の年度）
 * - quarter: 四半期（1-4、デフォルト: 現在の四半期）
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
    const fiscalYear = parseInt(searchParams.get('fiscalYear') || new Date().getFullYear().toString());
    const quarter = parseInt(searchParams.get('quarter') || Math.ceil((new Date().getMonth() + 1) / 3).toString());
    const facilityId = searchParams.get('facilityId') || null;

    // 四半期の期間を計算
    const quarterStartMonth = (quarter - 1) * 3 + 1;
    const quarterEndMonth = quarter * 3;
    const startDate = new Date(fiscalYear, quarterStartMonth - 1, 1);
    const endDate = new Date(fiscalYear, quarterEndMonth, 0, 23, 59, 59);

    // 前年同期の期間
    const prevYearStartDate = new Date(fiscalYear - 1, quarterStartMonth - 1, 1);
    const prevYearEndDate = new Date(fiscalYear - 1, quarterEndMonth, 0, 23, 59, 59);

    // =============================================
    // 1. 職員数の取得
    // =============================================
    const staffCountWhere: any = {
      status: 'active',
      hireDate: { lte: endDate }
    };

    if (facilityId) {
      staffCountWhere.facilityId = facilityId;
    }

    const totalStaff = await prisma.employee.count({
      where: staffCountWhere
    });

    // 施設別職員数
    const staffByFacility = await prisma.employee.groupBy({
      by: ['facilityId'],
      where: {
        status: 'active',
        hireDate: { lte: endDate }
      },
      _count: {
        id: true
      }
    });

    const byFacility: Record<string, number> = {};
    for (const group of staffByFacility) {
      byFacility[group.facilityId] = group._count.id;
    }

    // 前年同期比
    const prevYearStaffCount = await prisma.employee.count({
      where: {
        status: 'active',
        hireDate: { lte: prevYearEndDate }
      }
    });

    const staffGrowthRate = prevYearStaffCount > 0
      ? ((totalStaff - prevYearStaffCount) / prevYearStaffCount) * 100
      : 0;

    // =============================================
    // 2. 財務データの取得（仮実装 - 将来的にFinanceテーブルから取得）
    // =============================================
    // TODO: 実際の財務テーブルが実装されたら置き換え
    const revenue = {
      total: 1200000000, // 12億円（仮データ）
      growth: 8.0,
      currency: 'JPY'
    };

    const profit = {
      net: 180000000, // 1.8億円（仮データ）
      margin: 15.0,
      currency: 'JPY'
    };

    // =============================================
    // 3. 患者満足度の取得（仮実装 - 将来的にSurveyテーブルから取得）
    // =============================================
    // TODO: 実際のアンケートテーブルが実装されたら置き換え
    const patientSatisfaction = {
      overall: 94.0,
      growth: 2.0,
      surveyDate: new Date(fiscalYear, quarterEndMonth - 1, 15).toISOString().split('T')[0],
      responseRate: 87.5,
      sampleSize: 450
    };

    // =============================================
    // 4. 組織エンゲージメント（医療システム側60%分）
    // =============================================
    // TODO: 実際のアンケートDBから取得
    const organizationEngagement = {
      medical: 85.2, // 医療システム側のエンゲージメント指標
      jobSatisfaction: 88.5,
      organizationalCommitment: 82.3,
      workLifeBalance: 84.8
    };

    // レスポンス構築
    const response = {
      fiscalYear,
      quarter,
      facilityId,
      period: {
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0]
      },
      revenue,
      profit,
      staff: {
        total: totalStaff,
        growth: parseFloat(staffGrowthRate.toFixed(2)),
        facilities: Object.keys(byFacility).length,
        byFacility
      },
      patientSatisfaction,
      organizationEngagement,
      calculatedAt: new Date().toISOString(),
      calculatedBy: employeeId
    };

    console.log(`[ExecutiveKPI] KPI data retrieved for FY${fiscalYear} Q${quarter} by ${employeeId}`);

    return NextResponse.json(response);

  } catch (error) {
    console.error('[ExecutiveKPI] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
