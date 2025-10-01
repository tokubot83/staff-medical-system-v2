import { NextRequest, NextResponse } from 'next/server'
// import { createClient } from '@/lib/supabase'

/**
 * Phase 5 API: コース変更申請承認（人事部向け）
 * POST /api/admin/career-course/requests/[id]/approve
 *
 * 機能:
 * - 承認処理
 * - staff_career_coursesテーブルへの反映
 * - VoiceDrive側への通知送信
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: 実際の認証処理を実装
    // const supabase = createClient()
    // const { data: { user }, error: authError } = await supabase.auth.getUser()
    // if (authError || !user || user.role !== 'hr_admin') {
    //   return NextResponse.json({ error: '権限がありません' }, { status: 403 })
    // }

    const requestId = params.id
    const body = await request.json()
    const { reviewComment } = body

    if (!requestId) {
      return NextResponse.json({ error: '申請IDが必要です' }, { status: 400 })
    }

    // TODO: 実際のDB更新処理を実装
    // const { data: request, error: fetchError } = await supabase
    //   .from('career_course_change_requests')
    //   .select('*')
    //   .eq('id', requestId)
    //   .single()

    // if (fetchError || !request) {
    //   return NextResponse.json({ error: '申請が見つかりません' }, { status: 404 })
    // }

    // if (request.approval_status !== 'pending') {
    //   return NextResponse.json(
    //     { error: '承認待ち以外の申請は処理できません' },
    //     { status: 400 }
    //   )
    // }

    // // 1. 申請を承認済みに更新
    // const { error: updateError } = await supabase
    //   .from('career_course_change_requests')
    //   .update({
    //     approval_status: 'approved',
    //     hr_reviewer_id: user.id,
    //     hr_reviewer_name: user.name,
    //     reviewed_at: new Date().toISOString(),
    //     review_comment: reviewComment,
    //     updated_at: new Date().toISOString()
    //   })
    //   .eq('id', requestId)

    // if (updateError) throw updateError

    // // 2. staff_career_coursesテーブルに新しいレコードを作成
    // //    （トリガーで自動実行される場合もあり）
    // const { error: insertError } = await supabase
    //   .from('staff_career_courses')
    //   .insert({
    //     staff_id: request.staff_id,
    //     course_code: request.requested_course_code,
    //     effective_from: request.requested_effective_date,
    //     effective_to: null,
    //     next_change_available_date: calculateNextChangeDate(request.requested_effective_date),
    //     approval_status: 'approved',
    //     created_at: new Date().toISOString(),
    //     updated_at: new Date().toISOString()
    //   })

    // if (insertError) throw insertError

    // // 3. VoiceDrive側への通知送信（Webhook）
    // await fetch(process.env.VOICEDRIVE_WEBHOOK_URL + '/career-course/notify', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${process.env.VOICEDRIVE_API_KEY}`
    //   },
    //   body: JSON.stringify({
    //     type: 'course_change_approved',
    //     staffId: request.staff_id,
    //     requestId: requestId,
    //     approvedCourse: request.requested_course_code,
    //     effectiveDate: request.requested_effective_date,
    //     reviewComment: reviewComment
    //   })
    // })

    // モックレスポンス（開発用）
    const mockResponse = {
      success: true,
      requestId: requestId,
      approvalStatus: 'approved',
      reviewedAt: new Date().toISOString(),
      message: '申請を承認しました。職員に通知されます。'
    }

    return NextResponse.json(mockResponse, { status: 200 })
  } catch (error) {
    console.error('承認処理エラー:', error)
    return NextResponse.json(
      { error: '承認処理に失敗しました' },
      { status: 500 }
    )
  }
}

// 次回変更可能日を計算（1年後の3月1日）
function calculateNextChangeDate(effectiveDate: string): string {
  const date = new Date(effectiveDate)
  const nextYear = date.getFullYear() + 1
  return `${nextYear}-03-01`
}