import { NextRequest, NextResponse } from 'next/server';
import { approveEmergencyDeactivation } from '@/services/EmergencyDeactivationApprovalService';

/**
 * 緊急アカウント停止の事後承認API
 *
 * POST /api/admin/emergency-deactivation/[historyId]/approve
 *
 * 権限: Level 14-17（人事部門）のみ
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { historyId: string } }
) {
  try {
    const { historyId } = params;
    const body = await request.json();
    const { approvedBy, approvedByName, approvalComment } = body;

    // バリデーション
    if (!approvedBy || !approvedByName) {
      return NextResponse.json(
        { error: 'Missing required fields: approvedBy, approvedByName' },
        { status: 400 }
      );
    }

    // 承認処理実行
    await approveEmergencyDeactivation({
      historyId,
      approvedBy,
      approvedByName,
      approvalComment
    });

    return NextResponse.json({
      success: true,
      message: 'Emergency deactivation approved successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('[API] Approval failed:', error);
    return NextResponse.json(
      {
        error: 'Failed to approve emergency deactivation',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
