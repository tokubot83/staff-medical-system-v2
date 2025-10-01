import { NextRequest, NextResponse } from 'next/server'
// import { createClient } from '@/lib/supabase'

/**
 * Phase 5-3 API: マイページデータ取得
 * GET /api/my-page
 *
 * 機能:
 * - ログイン中職員の基本情報取得
 * - キャリアコース情報取得
 * - 評価・健康情報取得
 */
export async function GET(request: NextRequest) {
  try {
    // 認証チェック（開発環境用）
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.MEDICAL_SYSTEM_API_KEY || 'vd_prod_key_A8B9C2D3E4F5G6H7I8J9K0L1M2N3O4P5'

    if (authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    // TODO: 実際の認証処理を実装（共通DB構築後）
    // const supabase = createClient()
    // const { data: { user }, error: authError } = await supabase.auth.getUser()
    // if (authError || !user) {
    //   return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    // }

    // TODO: 実際のDB取得処理を実装
    // const { data: staffData, error: dbError } = await supabase
    //   .from('staff')
    //   .select(`
    //     *,
    //     careerCourse:staff_career_courses!staff_career_courses_staff_id_fkey(
    //       id,
    //       course_code,
    //       effective_from,
    //       effective_to,
    //       next_change_available_date,
    //       special_change_reason,
    //       special_change_note,
    //       approval_status
    //     )
    //   `)
    //   .eq('id', user.id)
    //   .order('effective_from', { foreignTable: 'staff_career_courses', ascending: false })
    //   .limit(1, { foreignTable: 'staff_career_courses' })
    //   .single()

    // モックデータ（開発用）
    const mockData = {
      id: 'OH-NS-2021-001',
      name: '山田 花子',
      nameInitial: 'YH',
      position: '看護師',
      department: '3階病棟',
      facility: '小原病院',
      employeeId: 'OH-NS-2021-001',
      joinDate: '2021-04-01',
      tenure: '3年6ヶ月',
      age: 29,
      birthDate: '1995-03-15',
      evaluation: 'A',
      evaluationPeriod: '2024年度',
      nextMeeting: '2025-10-15',
      healthStatus: '良好',
      stressIndex: 35,
      engagement: 82,
      overtime: 15,
      paidLeaveRate: 75,
      avatar: '/avatars/default.png',
      email: 'yamada.hanako@example.com',
      phone: '090-1234-5678',
      emergencyContact: '090-9876-5432',
      address: '鹿児島県出水市',
      evaluationHistory: [],
      skills: [],
      careerCourse: {
        id: 'cc-001',
        staffId: 'OH-NS-2021-001',
        courseCode: 'B',
        courseName: 'Bコース（施設内協力型）',
        effectiveFrom: '2025-04-01',
        effectiveTo: null,
        nextChangeAvailableDate: '2026-03-01',
        specialChangeReason: null,
        specialChangeNote: null,
        changeRequestedAt: null,
        changeRequestedBy: null,
        approvedAt: '2025-03-25T10:00:00Z',
        approvedBy: 'HR-001',
        approvalStatus: 'approved',
        rejectionReason: null,
        createdAt: '2025-03-01T09:00:00Z',
        updatedAt: '2025-03-25T10:00:00Z'
      }
    }

    return NextResponse.json(mockData, { status: 200 })
  } catch (error) {
    console.error('マイページデータ取得エラー:', error)
    return NextResponse.json(
      { error: 'データ取得に失敗しました' },
      { status: 500 }
    )
  }
}