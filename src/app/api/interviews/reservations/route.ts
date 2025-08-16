import { NextRequest, NextResponse } from 'next/server';
import { UnifiedInterviewReservation } from '@/components/interview/UnifiedInterviewDashboard';

// 一時的なメモリストレージ（実際はデータベースを使用）
let reservations: UnifiedInterviewReservation[] = [];

/**
 * GET /api/interviews/reservations
 * 面談予約一覧を取得
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const staffId = searchParams.get('staffId');
    const date = searchParams.get('date');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const source = searchParams.get('source');

    // フィルタリング
    let filteredReservations = [...reservations];

    if (staffId) {
      filteredReservations = filteredReservations.filter(r => r.staffId === staffId);
    }

    if (date) {
      const targetDate = new Date(date);
      filteredReservations = filteredReservations.filter(r => {
        const rDate = new Date(r.scheduledDate);
        return rDate.toDateString() === targetDate.toDateString();
      });
    }

    if (type) {
      filteredReservations = filteredReservations.filter(r => r.type === type);
    }

    if (status) {
      filteredReservations = filteredReservations.filter(r => r.status === status);
    }

    if (source) {
      filteredReservations = filteredReservations.filter(r => r.source === source);
    }

    // ソート（日付順）
    filteredReservations.sort((a, b) => {
      return new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime();
    });

    return NextResponse.json({
      success: true,
      data: filteredReservations,
      total: filteredReservations.length
    });

  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch reservations' 
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/interviews/reservations
 * 新規面談予約を作成
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // バリデーション
    const requiredFields = ['staffId', 'staffName', 'department', 'position', 'type', 'scheduledDate', 'scheduledTime'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Missing required field: ${field}` 
          },
          { status: 400 }
        );
      }
    }

    // 面談タイプ別の追加バリデーション
    if (body.type === 'regular' && !body.regularType) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Regular type is required for regular interviews' 
        },
        { status: 400 }
      );
    }

    if (body.type === 'special' && !body.specialType) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Special type is required for special interviews' 
        },
        { status: 400 }
      );
    }

    if (body.type === 'support' && !body.supportCategory) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Support category is required for support interviews' 
        },
        { status: 400 }
      );
    }

    // 新規予約の作成
    const newReservation: UnifiedInterviewReservation = {
      id: body.id || `RES-${Date.now()}`,
      type: body.type,
      staffId: body.staffId,
      staffName: body.staffName,
      department: body.department,
      position: body.position,
      experienceYears: body.experienceYears || 0,
      scheduledDate: new Date(body.scheduledDate),
      scheduledTime: body.scheduledTime,
      duration: body.duration || 30,
      status: body.status || 'confirmed',
      urgency: body.urgency,
      regularType: body.regularType,
      specialType: body.specialType,
      supportCategory: body.supportCategory,
      supportTopic: body.supportTopic,
      supportDetails: body.supportDetails,
      notes: body.notes,
      source: body.source || 'system',
      createdBy: body.createdBy || 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // 重複チェック（同じ職員、同じ日時）
    const isDuplicate = reservations.some(r => 
      r.staffId === newReservation.staffId &&
      new Date(r.scheduledDate).toDateString() === new Date(newReservation.scheduledDate).toDateString() &&
      r.scheduledTime === newReservation.scheduledTime &&
      r.status !== 'cancelled'
    );

    if (isDuplicate) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'A reservation already exists for this staff member at the specified time' 
        },
        { status: 409 }
      );
    }

    // 予約を追加
    reservations.push(newReservation);

    // TODO: ここでデータベースに保存
    // await db.interview_reservations.create(newReservation);

    // TODO: 通知キューに追加
    // await addNotificationToQueue(newReservation);

    // ログ記録
    console.log('New reservation created:', newReservation.id);

    return NextResponse.json({
      success: true,
      data: newReservation,
      message: 'Reservation created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create reservation' 
      },
      { status: 500 }
    );
  }
}