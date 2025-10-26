import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/middleware/jwt-auth';

/**
 * GET /api/medical/budgets/[id]
 *
 * 予算詳細取得API
 *
 * 用途: StrategicInitiativesPageのイニシアチブ作成・表示時に予算情報を取得
 *
 * 返却データ:
 * - 予算詳細（ID、名称、金額、配分済み、残額、年度、部門等）
 *
 * 認可: Level 7（主任）以上
 *
 * Path Parameters:
 * - id: 予算ID（例: MED-BUDGET-2025-001）
 */

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
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

    const { id: budgetId } = params;

    // =============================================
    // 予算詳細データ取得（仮実装）
    // =============================================

    // TODO: 実際の予算DBテーブルから取得
    // 現時点では仮データを返却

    /*
    // 実装例（Budgetテーブルが存在する場合）:
    const budget = await prisma.budget.findUnique({
      where: { id: budgetId },
      include: {
        allocations: true, // 配分履歴
        initiatives: true  // 紐づくイニシアチブ
      }
    });

    if (!budget) {
      return NextResponse.json(
        { error: 'Budget not found' },
        { status: 404 }
      );
    }
    */

    // 仮データマスタ
    const budgetMaster: Record<string, any> = {
      'MED-BUDGET-2025-001': {
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
        utilizationRate: 72.0,
        createdAt: '2024-04-01T00:00:00.000Z',
        updatedAt: '2025-10-26T00:00:00.000Z',
        createdBy: 'emp_ceo_001',
        lastModifiedBy: 'emp_planning_002',
        initiatives: [
          {
            id: 'init_001',
            title: '訪問診療拡充プロジェクト',
            allocatedAmount: 80000000,
            status: 'active'
          },
          {
            id: 'init_002',
            title: '地域連携システム構築',
            allocatedAmount: 100000000,
            status: 'active'
          }
        ]
      },
      'MED-BUDGET-2025-002': {
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
        utilizationRate: 83.3,
        createdAt: '2024-04-01T00:00:00.000Z',
        updatedAt: '2025-10-26T00:00:00.000Z',
        createdBy: 'emp_ceo_001',
        lastModifiedBy: 'emp_it_001',
        initiatives: [
          {
            id: 'init_003',
            title: '電子カルテシステム刷新',
            allocatedAmount: 150000000,
            status: 'active'
          }
        ]
      },
      'MED-BUDGET-2025-003': {
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
        utilizationRate: 70.0,
        createdAt: '2024-04-01T00:00:00.000Z',
        updatedAt: '2025-10-26T00:00:00.000Z',
        createdBy: 'emp_ceo_001',
        lastModifiedBy: 'emp_hr_001',
        initiatives: []
      },
      'MED-BUDGET-2025-004': {
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
        utilizationRate: 90.0,
        createdAt: '2024-04-01T00:00:00.000Z',
        updatedAt: '2025-10-26T00:00:00.000Z',
        createdBy: 'emp_ceo_001',
        lastModifiedBy: 'emp_facility_001',
        initiatives: [
          {
            id: 'init_004',
            title: '立神病院新棟建設',
            allocatedAmount: 450000000,
            status: 'active'
          }
        ]
      },
      'MED-BUDGET-2025-005': {
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
        utilizationRate: 75.0,
        createdAt: '2024-04-01T00:00:00.000Z',
        updatedAt: '2025-10-26T00:00:00.000Z',
        createdBy: 'emp_ceo_001',
        lastModifiedBy: 'emp_safety_001',
        initiatives: []
      }
    };

    // 予算IDで検索
    const budget = budgetMaster[budgetId];

    if (!budget) {
      return NextResponse.json(
        { error: 'Budget not found', budgetId },
        { status: 404 }
      );
    }

    // レスポンス構築
    const response = {
      ...budget,
      retrievedAt: new Date().toISOString(),
      retrievedBy: employeeId,
      note: '仮データ: 予算管理システム実装後に実データから取得'
    };

    console.log(`[MedicalBudget] Budget detail retrieved (ID: ${budgetId}) by ${employeeId}`);

    return NextResponse.json(response);

  } catch (error) {
    console.error('[MedicalBudget] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
