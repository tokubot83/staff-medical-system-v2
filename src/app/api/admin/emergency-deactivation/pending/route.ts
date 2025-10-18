import { NextResponse } from 'next/server';
import { getPendingEmergencyDeactivations } from '@/services/EmergencyDeactivationApprovalService';

/**
 * 承認待ち緊急処理一覧取得API
 *
 * GET /api/admin/emergency-deactivation/pending
 *
 * 権限: Level 14-17（人事部門）のみ
 */
export async function GET() {
  try {
    const pendingList = await getPendingEmergencyDeactivations();

    return NextResponse.json({
      success: true,
      count: pendingList.length,
      data: pendingList
    }, { status: 200 });

  } catch (error) {
    console.error('[API] Get pending list failed:', error);
    return NextResponse.json(
      {
        error: 'Failed to get pending emergency deactivations',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
