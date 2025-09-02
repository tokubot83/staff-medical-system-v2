import { NextRequest, NextResponse } from 'next/server';
import { UnifiedInterviewReservation } from '@/components/interview/UnifiedInterviewDashboard';

// 一時的なメモリストレージ（実際はデータベースを使用）
let reservations: UnifiedInterviewReservation[] = [
  // 定期面談データ（職員ID: OH-NS-2021-001）
  {
    id: 'REGULAR-001',
    type: 'regular',
    staffId: 'OH-NS-2021-001',
    staffName: '田中 花子',
    department: '内科',
    position: '看護師',
    experienceYears: 3,
    scheduledDate: new Date('2024-02-15'),
    scheduledTime: '14:00',
    duration: 60,
    status: 'completed',
    regularType: 'annual',
    urgency: 'medium',
    notes: '年次定期面談を実施しました。',
    source: 'manual',
    createdBy: '管理者',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-15'),
    conductedAt: new Date('2024-02-15T14:00:00'),
    interviewerName: '山田 太郎',
    outcomeSummary: '業務に対して積極的な姿勢を示しており、患者様からの評価も高い。今後はチームリーダーとしての役割も期待される。'
  },
  {
    id: 'REGULAR-002',
    type: 'regular',
    staffId: 'OH-NS-2021-001',
    staffName: '田中 花子',
    department: '内科',
    position: '看護師',
    experienceYears: 3,
    scheduledDate: new Date('2024-01-10'),
    scheduledTime: '10:00',
    duration: 45,
    status: 'completed',
    regularType: 'new_employee',
    urgency: 'low',
    notes: '月次面談を実施しました。',
    source: 'system',
    createdBy: 'システム',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-10'),
    conductedAt: new Date('2024-01-10T10:00:00'),
    interviewerName: '佐藤 美咲',
    outcomeSummary: '新人研修の進捗は順調です。基本的な看護技術は習得済みで、患者対応も丁寧に行えています。'
  },
  {
    id: 'REGULAR-003',
    type: 'regular',
    staffId: 'OH-NS-2021-001',
    staffName: '田中 花子',
    department: '内科',
    position: '看護師',
    experienceYears: 3,
    scheduledDate: new Date('2023-12-05'),
    scheduledTime: '15:30',
    duration: 30,
    status: 'completed',
    regularType: 'management',
    urgency: 'low',
    notes: '管理職向け面談を実施。',
    source: 'manual',
    createdBy: '人事部',
    createdAt: new Date('2023-11-30'),
    updatedAt: new Date('2023-12-05'),
    conductedAt: new Date('2023-12-05T15:30:00'),
    interviewerName: '鈴木 一郎',
    outcomeSummary: 'リーダーシップスキルの向上が見られます。後輩指導にも積極的で、チーム全体のモチベーション向上に貢献しています。'
  },

  // 特別面談データ
  {
    id: 'SPECIAL-001',
    type: 'special',
    staffId: 'OH-NS-2021-001',
    staffName: '田中 花子',
    department: '内科',
    position: '看護師',
    experienceYears: 3,
    scheduledDate: new Date('2024-01-25'),
    scheduledTime: '16:00',
    duration: 45,
    status: 'completed',
    specialType: 'return',
    urgency: 'high',
    notes: '産休からの復職面談を実施しました。',
    source: 'manual',
    createdBy: '人事部',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-25'),
    conductedAt: new Date('2024-01-25T16:00:00'),
    interviewerName: '加藤 良子',
    outcomeSummary: '復職に向けて十分な準備ができており、働く意欲も高いです。段階的に業務負荷を調整していく計画です。'
  },
  {
    id: 'SPECIAL-002',
    type: 'special',
    staffId: 'OH-NS-2021-001',
    staffName: '田中 花子',
    department: '内科',
    position: '看護師',
    experienceYears: 3,
    scheduledDate: new Date('2023-11-20'),
    scheduledTime: '13:00',
    duration: 60,
    status: 'completed',
    specialType: 'promotion',
    urgency: 'medium',
    notes: '昇進に関する面談を実施。',
    source: 'manual',
    createdBy: '部長',
    createdAt: new Date('2023-11-15'),
    updatedAt: new Date('2023-11-20'),
    conductedAt: new Date('2023-11-20T13:00:00'),
    interviewerName: '高橋 部長',
    outcomeSummary: '昇進に必要なスキルと経験を十分に備えています。来年度からの主任看護師への昇進を推薦します。'
  },

  // サポート面談データ
  {
    id: 'SUPPORT-001',
    type: 'support',
    staffId: 'OH-NS-2021-001',
    staffName: '田中 花子',
    department: '内科',
    position: '看護師',
    experienceYears: 3,
    scheduledDate: new Date('2024-02-01'),
    scheduledTime: '11:00',
    duration: 40,
    status: 'completed',
    supportCategory: 'career_support',
    supportTopic: 'キャリア開発計画',
    urgency: 'medium',
    notes: 'キャリア支援面談を実施しました。',
    source: 'manual',
    createdBy: '人事部',
    createdAt: new Date('2024-01-28'),
    updatedAt: new Date('2024-02-01'),
    conductedAt: new Date('2024-02-01T11:00:00'),
    interviewerName: '田村 キャリアコンサルタント',
    outcomeSummary: '専門看護師資格取得に向けた具体的な計画を立てました。研修参加のスケジュールと学習計画を策定しています。'
  },
  {
    id: 'SUPPORT-002',
    type: 'support',
    staffId: 'OH-NS-2021-001',
    staffName: '田中 花子',
    department: '内科',
    position: '看護師',
    experienceYears: 3,
    scheduledDate: new Date('2023-12-20'),
    scheduledTime: '14:30',
    duration: 35,
    status: 'completed',
    supportCategory: 'workplace_support',
    supportTopic: '職場環境改善',
    urgency: 'low',
    notes: '職場環境サポート面談を実施。',
    source: 'system',
    createdBy: 'システム',
    createdAt: new Date('2023-12-15'),
    updatedAt: new Date('2023-12-20'),
    conductedAt: new Date('2023-12-20T14:30:00'),
    interviewerName: '中村 相談員',
    outcomeSummary: '職場でのコミュニケーション改善について話し合いました。チーム内での役割分担の明確化を進めています。'
  },
  {
    id: 'SUPPORT-003',
    type: 'support',
    staffId: 'OH-NS-2021-001',
    staffName: '田中 花子',
    department: '内科',
    position: '看護師',
    experienceYears: 3,
    scheduledDate: new Date('2023-10-15'),
    scheduledTime: '09:30',
    duration: 50,
    status: 'completed',
    supportCategory: 'feedback',
    supportTopic: 'パフォーマンス向上',
    urgency: 'medium',
    notes: 'フィードバック面談を実施しました。',
    source: 'manual',
    createdBy: '直属上司',
    createdAt: new Date('2023-10-10'),
    updatedAt: new Date('2023-10-15'),
    conductedAt: new Date('2023-10-15T09:30:00'),
    interviewerName: '井上 主任',
    outcomeSummary: '業務改善点について具体的なフィードバックを行いました。患者対応スキルの更なる向上を目指します。'
  }
];

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