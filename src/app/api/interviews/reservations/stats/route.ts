import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/interviews/reservations/stats
 * 面談予約の統計情報を取得
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const department = searchParams.get('department');

    // デフォルトで今月の統計を取得
    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const end = endDate ? new Date(endDate) : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    // TODO: データベースから統計を取得
    // const stats = await db.interview_reservations.aggregate({
    //   where: {
    //     scheduledDate: { between: [start, end] },
    //     ...(department && { department })
    //   }
    // });

    // 仮の統計データ
    const stats = {
      period: {
        start: start.toISOString(),
        end: end.toISOString()
      },
      summary: {
        total: 62,
        completed: 45,
        pending: 10,
        cancelled: 7,
        completionRate: 72.58
      },
      byType: {
        regular: {
          total: 45,
          completed: 35,
          pending: 8,
          cancelled: 2,
          subtypes: {
            new_employee: 15,
            annual: 25,
            management: 5
          }
        },
        special: {
          total: 5,
          completed: 5,
          pending: 0,
          cancelled: 0,
          subtypes: {
            exit: 2,
            transfer: 1,
            return: 1,
            promotion: 1,
            disciplinary: 0
          }
        },
        support: {
          total: 12,
          completed: 5,
          pending: 2,
          cancelled: 5,
          categories: {
            career: 4,
            workplace: 3,
            relationships: 2,
            worklife: 1,
            health: 1,
            other: 1
          }
        }
      },
      byDepartment: department ? {
        [department]: {
          total: 15,
          completed: 12,
          pending: 2,
          cancelled: 1
        }
      } : {
        '看護部': {
          total: 25,
          completed: 20,
          pending: 3,
          cancelled: 2
        },
        'リハビリテーション科': {
          total: 12,
          completed: 8,
          pending: 3,
          cancelled: 1
        },
        '医事課': {
          total: 10,
          completed: 7,
          pending: 2,
          cancelled: 1
        },
        '総務部': {
          total: 8,
          completed: 6,
          pending: 1,
          cancelled: 1
        },
        '栄養科': {
          total: 7,
          completed: 4,
          pending: 1,
          cancelled: 2
        }
      },
      bySource: {
        manual: 8,
        voicedrive: 12,
        system: 42
      },
      byUrgency: {
        urgent: 2,
        high: 8,
        medium: 35,
        low: 17
      },
      trends: {
        dailyAverage: 2.1,
        peakDay: 'Tuesday',
        peakTime: '10:00-11:00',
        averageDuration: 32,
        satisfactionScore: 4.5
      },
      upcomingWeek: {
        total: 15,
        byDay: {
          monday: 3,
          tuesday: 4,
          wednesday: 2,
          thursday: 3,
          friday: 3
        }
      }
    };

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching reservation statistics:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch reservation statistics' 
      },
      { status: 500 }
    );
  }
}