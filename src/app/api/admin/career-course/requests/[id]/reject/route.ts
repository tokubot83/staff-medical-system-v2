import { NextRequest, NextResponse } from 'next/server'
// import { createClient } from '@/lib/supabase'

/**
 * Phase 5 API: コース変更申請却下（人事部向け）
 * POST /api/admin/career-course/requests/[id]/reject
 *
 * 機能:
 * - 却下処理
 * - 却下理由の記録
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
    const { rejectionReason, reviewComment } = body

    if (!requestId) {
      return NextResponse.json({ error: '申請IDが必要です' }, { status: 400 })
    }

    if (!rejectionReason) {
      return NextResponse.json({ error: '却下理由が必要です' }, { status: 400 })
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

    // // 申請を却下済みに更新
    // const { error: updateError } = await supabase
    //   .from('career_course_change_requests')
    //   .update({
    //     approval_status: 'rejected',
    //     hr_reviewer_id: user.id,
    //     hr_reviewer_name: user.name,
    //     reviewed_at: new Date().toISOString(),
    //     review_comment: reviewComment,
    //     rejection_reason: rejectionReason,
    //     updated_at: new Date().toISOString()
    //   })
    //   .eq('id', requestId)

    // if (updateError) throw updateError

    // // VoiceDrive側への通知送信（Webhook）
    // await fetch(process.env.VOICEDRIVE_WEBHOOK_URL + '/career-course/notify', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${process.env.VOICEDRIVE_API_KEY}`
    //   },
    //   body: JSON.stringify({
    //     type: 'course_change_rejected',
    //     staffId: request.staff_id,
    //     requestId: requestId,
    //     rejectionReason: rejectionReason,
    //     reviewComment: reviewComment
    //   })
    // })

    // モックレスポンス（開発用）
    const mockResponse = {
      success: true,
      requestId: requestId,
      approvalStatus: 'rejected',
      reviewedAt: new Date().toISOString(),
      rejectionReason: rejectionReason,
      message: '申請を却下しました。職員に通知されます。'
    }

    return NextResponse.json(mockResponse, { status: 200 })
  } catch (error) {
    console.error('却下処理エラー:', error)
    return NextResponse.json(
      { error: '却下処理に失敗しました' },
      { status: 500 }
    )
  }
}