import { NextRequest, NextResponse } from 'next/server';
import { UnifiedInterviewReservation } from '@/components/interview/UnifiedInterviewDashboard';

// 一時的なメモリストレージ（実際はデータベースを使用）
let reservations: UnifiedInterviewReservation[] = [];

/**
 * GET /api/interviews/reservations/[id]
 * 特定の面談予約を取得
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reservation = reservations.find(r => r.id === params.id);

    if (!reservation) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Reservation not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: reservation
    });

  } catch (error) {
    console.error('Error fetching reservation:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch reservation' 
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/interviews/reservations/[id]
 * 面談予約を更新
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const index = reservations.findIndex(r => r.id === params.id);

    if (index === -1) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Reservation not found' 
        },
        { status: 404 }
      );
    }

    // 更新可能なフィールドのみ更新
    const updatableFields = [
      'status', 'scheduledDate', 'scheduledTime', 'duration',
      'urgency', 'notes', 'location', 'onlineUrl'
    ];

    const currentReservation = reservations[index];
    const updatedReservation = { ...currentReservation };

    // 変更内容を記録（ログ用）
    const changes: Record<string, any> = {};

    for (const field of updatableFields) {
      if (body[field] !== undefined && body[field] !== currentReservation[field as keyof UnifiedInterviewReservation]) {
        changes[field] = {
          old: currentReservation[field as keyof UnifiedInterviewReservation],
          new: body[field]
        };
        (updatedReservation as any)[field] = body[field];
      }
    }

    // 更新日時を設定
    updatedReservation.updatedAt = new Date();

    // 予約を更新
    reservations[index] = updatedReservation;

    // TODO: データベースを更新
    // await db.interview_reservations.update(params.id, updatedReservation);

    // TODO: 変更ログを記録
    // await db.interview_reservation_logs.create({
    //   reservation_id: params.id,
    //   action: 'updated',
    //   performed_by: body.updatedBy || 'system',
    //   changes: changes
    // });

    // TODO: 必要に応じて通知を送信
    if (changes.scheduledDate || changes.scheduledTime) {
      // await sendRescheduleNotification(updatedReservation);
      console.log('Reservation rescheduled:', params.id);
    }

    return NextResponse.json({
      success: true,
      data: updatedReservation,
      changes: changes,
      message: 'Reservation updated successfully'
    });

  } catch (error) {
    console.error('Error updating reservation:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update reservation' 
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/interviews/reservations/[id]
 * 面談予約をキャンセル（論理削除）
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const reason = searchParams.get('reason');
    const cancelledBy = searchParams.get('cancelledBy') || 'system';

    const index = reservations.findIndex(r => r.id === params.id);

    if (index === -1) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Reservation not found' 
        },
        { status: 404 }
      );
    }

    const reservation = reservations[index];

    // 既にキャンセル済みの場合
    if (reservation.status === 'cancelled') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Reservation is already cancelled' 
        },
        { status: 400 }
      );
    }

    // 完了済みの場合はキャンセル不可
    if (reservation.status === 'completed') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Cannot cancel a completed reservation' 
        },
        { status: 400 }
      );
    }

    // ステータスをキャンセルに更新
    reservation.status = 'cancelled';
    reservation.updatedAt = new Date();

    // TODO: データベースを更新
    // await db.interview_reservations.update(params.id, {
    //   status: 'cancelled',
    //   updatedAt: new Date()
    // });

    // TODO: キャンセルログを記録
    // await db.interview_reservation_logs.create({
    //   reservation_id: params.id,
    //   action: 'cancelled',
    //   performed_by: cancelledBy,
    //   reason: reason
    // });

    // TODO: キャンセル通知を送信
    // await sendCancellationNotification(reservation);

    console.log('Reservation cancelled:', params.id);

    return NextResponse.json({
      success: true,
      message: 'Reservation cancelled successfully',
      data: {
        id: params.id,
        status: 'cancelled',
        cancelledBy: cancelledBy,
        reason: reason
      }
    });

  } catch (error) {
    console.error('Error cancelling reservation:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to cancel reservation' 
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/interviews/reservations/[id]
 * 面談予約のステータスを更新
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, updatedBy } = body;

    if (!status) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Status is required' 
        },
        { status: 400 }
      );
    }

    const validStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid status value' 
        },
        { status: 400 }
      );
    }

    const index = reservations.findIndex(r => r.id === params.id);

    if (index === -1) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Reservation not found' 
        },
        { status: 404 }
      );
    }

    const reservation = reservations[index];
    const oldStatus = reservation.status;

    // ステータス遷移の妥当性チェック
    const invalidTransitions = {
      'completed': ['pending', 'confirmed', 'in_progress'], // 完了から戻せない
      'cancelled': ['pending', 'confirmed', 'in_progress', 'completed'] // キャンセルから戻せない
    };

    if (invalidTransitions[oldStatus]?.includes(status)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Cannot transition from ${oldStatus} to ${status}` 
        },
        { status: 400 }
      );
    }

    // ステータスを更新
    reservation.status = status;
    reservation.updatedAt = new Date();

    // TODO: データベースを更新
    // await db.interview_reservations.update(params.id, {
    //   status: status,
    //   updatedAt: new Date()
    // });

    // TODO: ステータス変更ログを記録
    // await db.interview_reservation_logs.create({
    //   reservation_id: params.id,
    //   action: status === 'completed' ? 'completed' : 'updated',
    //   performed_by: updatedBy || 'system',
    //   changes: { status: { old: oldStatus, new: status } }
    // });

    console.log(`Reservation ${params.id} status changed from ${oldStatus} to ${status}`);

    return NextResponse.json({
      success: true,
      data: reservation,
      message: `Status updated to ${status}`
    });

  } catch (error) {
    console.error('Error updating reservation status:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update reservation status' 
      },
      { status: 500 }
    );
  }
}