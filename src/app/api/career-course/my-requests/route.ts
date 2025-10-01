import { NextRequest, NextResponse } from 'next/server'
// import { createClient } from '@/lib/supabase'

/**
 * Phase 5-3 API: 自分の申請履歴取得
 * GET /api/career-course/my-requests
 *
 * 機能:
 * - ログイン中職員の申請履歴一覧取得
 * - 承認状況、審査結果を含む
 * - 新しい順にソート
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: 実際の認証処理を実装
    // const supabase = createClient()
    // const { data: { user }, error: authError } = await supabase.auth.getUser()
    // if (authError || !user) {
    //   return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    // }

    // TODO: 実際のDB取得処理を実装
    // const { data, error } = await supabase
    //   .from('career_course_change_requests')
    //   .select(`
    //     *,
    //     reviewer:hr_reviewer_id(name)
    //   `)
    //   .eq('staff_id', user.id)
    //   .order('created_at', { ascending: false })

    // モックデータ（開発用）
    const mockRequests = [
      {
        id: 'req-003',
        staffId: 'OH-NS-2021-001',
        currentCourseCode: 'B',
        requestedCourseCode: 'A',
        changeReason: 'annual',
        reasonDetail: '管理職候補として、施設間異動を含む全面協力型コースへの変更を希望します。転居を伴う異動も受諾可能です。',
        requestedEffectiveDate: '2025-04-01',
        hrReviewerId: null,
        hrReviewerName: null,
        reviewedAt: null,
        reviewComment: null,
        approvalStatus: 'pending',
        rejectionReason: null,
        withdrawnAt: null,
        attachments: [],
        createdAt: '2025-09-25T10:30:00Z',
        updatedAt: '2025-09-25T10:30:00Z'
      },
      {
        id: 'req-002',
        staffId: 'OH-NS-2021-001',
        currentCourseCode: 'C',
        requestedCourseCode: 'B',
        changeReason: 'annual',
        reasonDetail: '部署異動に対応可能となったため、Bコースへの変更を希望します。',
        requestedEffectiveDate: '2025-04-01',
        hrReviewerId: 'HR-001',
        hrReviewerName: '人事部長',
        reviewedAt: '2024-03-20T15:00:00Z',
        reviewComment: '職務能力を評価し、承認します。',
        approvalStatus: 'approved',
        rejectionReason: null,
        withdrawnAt: null,
        attachments: [],
        createdAt: '2024-03-01T09:00:00Z',
        updatedAt: '2024-03-20T15:00:00Z'
      },
      {
        id: 'req-001',
        staffId: 'OH-NS-2021-001',
        currentCourseCode: 'C',
        requestedCourseCode: 'D',
        changeReason: 'special_caregiving',
        reasonDetail: '親の介護のため、夜勤なしのDコースへの変更を希望します。',
        requestedEffectiveDate: '2023-10-01',
        hrReviewerId: 'HR-001',
        hrReviewerName: '人事部長',
        reviewedAt: '2023-09-15T14:00:00Z',
        reviewComment: '介護事由を確認し、特例として却下します。勤務調整で対応可能と判断。',
        approvalStatus: 'rejected',
        rejectionReason: '現在の勤務シフト調整で対応可能なため。',
        withdrawnAt: null,
        attachments: ['介護状況証明書.pdf'],
        createdAt: '2023-09-10T10:00:00Z',
        updatedAt: '2023-09-15T14:00:00Z'
      }
    ]

    return NextResponse.json(mockRequests, { status: 200 })
  } catch (error) {
    console.error('申請履歴取得エラー:', error)
    return NextResponse.json(
      { error: 'データ取得に失敗しました' },
      { status: 500 }
    )
  }
}

/**
 * Phase 5-3 API: 申請取下げ
 * DELETE /api/career-course/my-requests/:id
 *
 * 機能:
 * - 承認待ち申請を取り下げ
 * - 承認済み・却下済みの申請は取下げ不可
 */
export async function DELETE(request: NextRequest) {
  try {
    // TODO: 実際の認証処理を実装
    // const supabase = createClient()
    // const { data: { user }, error: authError } = await supabase.auth.getUser()
    // if (authError || !user) {
    //   return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    // }

    const { searchParams } = new URL(request.url)
    const requestId = searchParams.get('id')

    if (!requestId) {
      return NextResponse.json(
        { error: '申請IDが必要です' },
        { status: 400 }
      )
    }

    // TODO: 実際のDB取得・更新処理を実装
    // const { data: existingRequest, error: fetchError } = await supabase
    //   .from('career_course_change_requests')
    //   .select('*')
    //   .eq('id', requestId)
    //   .eq('staff_id', user.id)
    //   .single()

    // if (fetchError || !existingRequest) {
    //   return NextResponse.json({ error: '申請が見つかりません' }, { status: 404 })
    // }

    // if (existingRequest.approval_status !== 'pending') {
    //   return NextResponse.json(
    //     { error: '承認待ちの申請のみ取り下げ可能です' },
    //     { status: 400 }
    //   )
    // }

    // const { data: updatedData, error: updateError } = await supabase
    //   .from('career_course_change_requests')
    //   .update({
    //     approval_status: 'withdrawn',
    //     withdrawn_at: new Date().toISOString(),
    //     updated_at: new Date().toISOString()
    //   })
    //   .eq('id', requestId)
    //   .select()
    //   .single()

    // モックレスポンス（開発用）
    const mockResponse = {
      id: requestId,
      approvalStatus: 'withdrawn',
      withdrawnAt: new Date().toISOString(),
      message: '申請を取り下げました'
    }

    return NextResponse.json(mockResponse, { status: 200 })
  } catch (error) {
    console.error('申請取下げエラー:', error)
    return NextResponse.json(
      { error: '取下げ処理に失敗しました' },
      { status: 500 }
    )
  }
}