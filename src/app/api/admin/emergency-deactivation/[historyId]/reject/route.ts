import { NextRequest, NextResponse } from 'next/server';
import { rejectEmergencyDeactivation } from '@/services/EmergencyDeactivationApprovalService';

/**
 * 緊急アカウント停止の却下（復元）API
 *
 * POST /api/admin/emergency-deactivation/[historyId]/reject
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
    const { rejectedBy, rejectedByName, rejectionReason } = body;

    // バリデーション
    if (!rejectedBy || !rejectedByName || !rejectionReason) {
      return NextResponse.json(
        { error: 'Missing required fields: rejectedBy, rejectedByName, rejectionReason' },
        { status: 400 }
      );
    }

    // 却下処理実行
    await rejectEmergencyDeactivation({
      historyId,
      rejectedBy,
      rejectedByName,
      rejectionReason
    });

    return NextResponse.json({
      success: true,
      message: 'Emergency deactivation rejected successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('[API] Rejection failed:', error);
    return NextResponse.json(
      {
        error: 'Failed to reject emergency deactivation',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
