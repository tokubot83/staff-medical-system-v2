import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/middleware/jwt-auth';

/**
 * GET /api/medical/executive/staffing-status
 *
 * 人材配置状況取得API
 *
 * 用途: ExecutiveFunctionsPageの組織分析タブで使用
 *
 * 返却データ:
 * - 管理職充足率
 * - 専門資格者充足率
 * - 次世代リーダー候補数
 *
 * 認可: Level 13（院長・施設長）以上
 *
 * Query Parameters:
 * - facilityId: 施設ID（オプション、指定時は施設別データ）
 * - year: 対象年度（デフォルト: 現在の年度）
 * - quarter: 四半期（1-4、デフォルト: 現在の四半期）
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
    const facilityId = searchParams.get('facilityId') || null;
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
    const quarter = parseInt(searchParams.get('quarter') || Math.ceil((new Date().getMonth() + 1) / 3).toString());

    // =============================================
    // 1. 管理職充足率の算出
    // =============================================

    // Level 7以上を管理職と定義（Phase 3で確定した基準）
    const managementWhere: any = {
      status: 'active',
      permissionLevel: { gte: 7 }
    };

    if (facilityId) {
      managementWhere.facilityId = facilityId;
    }

    const managementCurrent = await prisma.employee.count({
      where: managementWhere
    });

    // 必要管理職数（仮設定 - 将来的にマスタDBから取得）
    // TODO: 施設別必要人数マスタを作成
    const managementRequired = facilityId ? 5 : 15; // 全体15人、施設別5人

    const managementRate = managementRequired > 0
      ? (managementCurrent / managementRequired) * 100
      : 100;

    // =============================================
    // 2. 専門資格者充足率の算出
    // =============================================

    // 専門資格者の定義（例: 認定看護師、専門医等）
    // TODO: qualifications フィールドを確認して専門資格者を抽出
    // 現時点では仮実装
    const specialistsWhere: any = {
      status: 'active',
      // qualifications フィールドが存在する場合はフィルタ追加
      // qualifications: { not: null }
    };

    if (facilityId) {
      specialistsWhere.facilityId = facilityId;
    }

    // 仮実装: positionに「専門」を含む職員を専門資格者とみなす
    const specialistsCurrent = await prisma.employee.count({
      where: {
        ...specialistsWhere,
        OR: [
          { position: { contains: '専門' } },
          { position: { contains: '認定' } },
          { position: { contains: '主任' } }
        ]
      }
    });

    // 必要専門資格者数（仮設定）
    const specialistsRequired = facilityId ? 17 : 50;

    const specialistsRate = specialistsRequired > 0
      ? (specialistsCurrent / specialistsRequired) * 100
      : 100;

    // =============================================
    // 3. 次世代リーダー候補の抽出
    // =============================================

    // 次世代リーダー候補の定義:
    // - 35歳以下
    // - Level 5-6（主任クラス）
    // - V3評価がA以上（仮実装では全員カウント）

    const nextGenWhere: any = {
      status: 'active',
      permissionLevel: { in: [5, 6] },
      // birthdate から35歳以下を算出（仮実装では省略）
    };

    if (facilityId) {
      nextGenWhere.facilityId = facilityId;
    }

    const nextGenCurrent = await prisma.employee.count({
      where: nextGenWhere
    });

    // 必要次世代リーダー数（仮設定）
    const nextGenRequired = facilityId ? 10 : 30;

    const nextGenRate = nextGenRequired > 0
      ? (nextGenCurrent / nextGenRequired) * 100
      : 100;

    // =============================================
    // 4. 施設別内訳（全体取得時のみ）
    // =============================================

    let byFacility: Record<string, any> | null = null;

    if (!facilityId) {
      const facilities = await prisma.employee.groupBy({
        by: ['facilityId'],
        where: { status: 'active' },
        _count: { id: true }
      });

      byFacility = {};
      for (const facility of facilities) {
        // 施設ごとの詳細計算（簡易版）
        const facilityManagement = await prisma.employee.count({
          where: {
            facilityId: facility.facilityId,
            status: 'active',
            permissionLevel: { gte: 7 }
          }
        });

        byFacility[facility.facilityId] = {
          total: facility._count.id,
          management: facilityManagement,
          managementRate: (facilityManagement / 5) * 100 // 施設別必要数5人
        };
      }
    }

    // レスポンス構築
    const response = {
      year,
      quarter,
      facilityId,
      management: {
        current: managementCurrent,
        required: managementRequired,
        rate: parseFloat(managementRate.toFixed(2))
      },
      specialists: {
        current: specialistsCurrent,
        required: specialistsRequired,
        rate: parseFloat(specialistsRate.toFixed(2))
      },
      nextGen: {
        current: nextGenCurrent,
        required: nextGenRequired,
        rate: parseFloat(nextGenRate.toFixed(2))
      },
      byFacility,
      calculatedAt: new Date().toISOString(),
      calculatedBy: employeeId
    };

    console.log(`[ExecutiveStaffing] Staffing status retrieved for FY${year} Q${quarter} by ${employeeId}`);

    return NextResponse.json(response);

  } catch (error) {
    console.error('[ExecutiveStaffing] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
