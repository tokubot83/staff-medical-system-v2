import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/middleware/jwt-auth';

/**
 * GET /api/medical/executive/initiatives/[id]/roi
 *
 * 戦略イニシアチブROI計算API
 *
 * 用途: ExecutiveFunctionsPageの戦略イニシアチブタブで使用
 *
 * カテゴリ別標準ROI係数:
 * - digital_transformation: 0.24 (24%)
 * - regional_development: 0.18 (18%)
 * - hr_development: 0.15 (15%)
 * - facility_expansion: 0.20 (20%)
 * - quality_improvement: 0.16 (16%)
 * - other: 0.12 (12%)
 *
 * 認可: Level 13（院長・施設長）以上
 *
 * Path Parameters:
 * - id: イニシアチブID（VoiceDrive側のStrategicInitiative.id）
 */

// カテゴリ別標準ROI係数マスタ
const ROI_COEFFICIENTS: Record<string, number> = {
  digital_transformation: 0.24,
  regional_development: 0.18,
  hr_development: 0.15,
  facility_expansion: 0.20,
  quality_improvement: 0.16,
  other: 0.12
};

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

    // 権限チェック: Level 13（院長・施設長）以上
    if (permissionLevel < 13) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permission level' },
        { status: 403 }
      );
    }

    const { id: initiativeId } = params;

    // =============================================
    // VoiceDrive側のイニシアチブデータを取得（仮実装）
    // TODO: VoiceDrive APIから取得、またはVoiceDrive側でカテゴリ・予算をクエリパラメータで渡す
    // =============================================

    // クエリパラメータから取得（VoiceDrive側から渡される）
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') || 'other';
    const investment = parseInt(searchParams.get('investment') || '0');
    const period = parseInt(searchParams.get('period') || '36'); // 月数

    if (!investment || investment <= 0) {
      return NextResponse.json(
        { error: 'Invalid investment amount' },
        { status: 400 }
      );
    }

    // =============================================
    // ROI計算
    // =============================================

    // カテゴリ別ROI係数取得
    const roiCoefficient = ROI_COEFFICIENTS[category] || ROI_COEFFICIENTS.other;

    // 期待リターン計算
    const expectedReturn = investment * roiCoefficient;

    // 期待ROI計算（%）
    const expectedRoi = ((expectedReturn / investment) * 100);

    // 実績リターン取得（仮実装 - 将来的に実績DBから取得）
    // TODO: 実際の財務実績データが蓄積されたら、実績ROIを計算
    const actualReturn: number | null = null;
    const actualRoi: number | null = null;

    // ステータス判定
    let status: 'estimated' | 'partial' | 'confirmed';
    if (actualRoi === null) {
      status = 'estimated'; // 実績なし（見込みのみ）
    } else if (actualRoi < expectedRoi) {
      status = 'partial'; // 部分達成
    } else {
      status = 'confirmed'; // 目標達成
    }

    // レスポンス構築
    const response = {
      initiativeId,
      expectedRoi: parseFloat(expectedRoi.toFixed(2)),
      actualRoi,
      calculatedAt: new Date().toISOString(),
      calculation: {
        investment,
        expectedReturn: parseFloat(expectedReturn.toFixed(0)),
        actualReturn,
        period,
        category,
        roiCoefficient,
        formula: '(expectedReturn / investment) × 100'
      },
      status,
      calculatedBy: employeeId
    };

    console.log(`[ExecutiveROI] ROI calculated for initiative ${initiativeId} by ${employeeId}:`, response);

    return NextResponse.json(response);

  } catch (error) {
    console.error('[ExecutiveROI] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
