import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/middleware/jwt-auth';

/**
 * GET /api/medical/budgets
 *
 * 予算マスタ一覧取得API
 *
 * 用途: StrategicInitiativesPageのイニシアチブ作成時に予算選択肢として使用
 *
 * 返却データ:
 * - 予算一覧（予算ID、名称、金額、年度、部門、ステータス）
 *
 * 認可: Level 7（主任）以上
 *
 * Query Parameters:
 * - fiscalYear: 会計年度（デフォルト: 現在の年度）
 * - status: ステータスフィルタ（active, completed, cancelled）
 * - department: 部門フィルタ
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

    // 権限チェック: Level 7（主任）以上
    if (permissionLevel < 7) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permission level' },
        { status: 403 }
      );
    }

    // クエリパラメータ取得
    const searchParams = request.nextUrl.searchParams;
    const fiscalYear = parseInt(searchParams.get('fiscalYear') || new Date().getFullYear().toString());
    const status = searchParams.get('status') || 'active';
    const department = searchParams.get('department') || null;

    // =============================================
    // 予算マスタデータ取得（仮実装）
    // =============================================

    // TODO: 実際の予算DBテーブルから取得
    // 現時点では仮データを返却

    /*
    // 実装例（Budgetテーブルが存在する場合）:
    const budgetWhere: any = {
      fiscalYear,
      status
    };

    if (department) {
      budgetWhere.department = department;
    }

    const budgets = await prisma.budget.findMany({
      where: budgetWhere,
      orderBy: { createdAt: 'desc' }
    });
    */

    // 仮データ
    const budgetData = [
      {
        id: 'MED-BUDGET-2025-001',
        name: '地域医療拠点化予算',
        amount: 250000000,
        currency: 'JPY',
        fiscalYear: 2025,
        department: '経営企画部',
        category: 'regional_development',
        status: 'active',
        description: '地域医療連携強化および訪問診療拡充のための予算',
        allocatedAmount: 180000000,
        remainingAmount: 70000000,
        createdAt: '2024-04-01T00:00:00.000Z',
        updatedAt: '2025-10-26T00:00:00.000Z'
      },
      {
        id: 'MED-BUDGET-2025-002',
        name: 'DXプラットフォーム予算',
        amount: 180000000,
        currency: 'JPY',
        fiscalYear: 2025,
        department: 'IT推進部',
        category: 'digital_transformation',
        status: 'active',
        description: '電子カルテ刷新およびDXプラットフォーム構築予算',
        allocatedAmount: 150000000,
        remainingAmount: 30000000,
        createdAt: '2024-04-01T00:00:00.000Z',
        updatedAt: '2025-10-26T00:00:00.000Z'
      },
      {
        id: 'MED-BUDGET-2025-003',
        name: '人材育成プログラム予算',
        amount: 50000000,
        currency: 'JPY',
        fiscalYear: 2025,
        department: '人事部',
        category: 'hr_development',
        status: 'active',
        description: '職員研修制度強化および資格取得支援予算',
        allocatedAmount: 35000000,
        remainingAmount: 15000000,
        createdAt: '2024-04-01T00:00:00.000Z',
        updatedAt: '2025-10-26T00:00:00.000Z'
      },
      {
        id: 'MED-BUDGET-2025-004',
        name: '施設拡張工事予算',
        amount: 500000000,
        currency: 'JPY',
        fiscalYear: 2025,
        department: '施設管理部',
        category: 'facility_expansion',
        status: 'active',
        description: '立神リハビリテーション温泉病院新棟建設予算',
        allocatedAmount: 450000000,
        remainingAmount: 50000000,
        createdAt: '2024-04-01T00:00:00.000Z',
        updatedAt: '2025-10-26T00:00:00.000Z'
      },
      {
        id: 'MED-BUDGET-2025-005',
        name: '医療品質向上予算',
        amount: 80000000,
        currency: 'JPY',
        fiscalYear: 2025,
        department: '医療安全管理部',
        category: 'quality_improvement',
        status: 'active',
        description: '医療安全対策および感染対策強化予算',
        allocatedAmount: 60000000,
        remainingAmount: 20000000,
        createdAt: '2024-04-01T00:00:00.000Z',
        updatedAt: '2025-10-26T00:00:00.000Z'
      }
    ];

    // フィルタリング
    let filteredBudgets = budgetData.filter(b => b.fiscalYear === fiscalYear && b.status === status);

    if (department) {
      filteredBudgets = filteredBudgets.filter(b => b.department === department);
    }

    // レスポンス構築
    const response = {
      budgets: filteredBudgets,
      total: filteredBudgets.length,
      filters: {
        fiscalYear,
        status,
        department
      },
      retrievedAt: new Date().toISOString(),
      retrievedBy: employeeId,
      note: '仮データ: 予算管理システム実装後に実データから取得'
    };

    console.log(`[MedicalBudgets] Budget list retrieved (FY${fiscalYear}, status: ${status}) by ${employeeId}`);

    return NextResponse.json(response);

  } catch (error) {
    console.error('[MedicalBudgets] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
