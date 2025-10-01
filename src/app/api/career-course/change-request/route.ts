import { NextRequest, NextResponse } from 'next/server'
// import { createClient } from '@/lib/supabase'

/**
 * Phase 5-3 API: キャリアコース変更申請送信
 * POST /api/career-course/change-request
 *
 * 機能:
 * - コース変更申請を受け付け
 * - 添付ファイルをアップロード
 * - 申請データをDBに保存
 * - 特例変更の場合は即時処理フラグ設定
 */
export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const {
      currentCourseCode,
      requestedCourseCode,
      changeReason,
      reasonDetail,
      requestedEffectiveDate,
      attachments // Base64エンコードされたファイルデータ配列
    } = body

    // バリデーション
    if (!currentCourseCode || !requestedCourseCode) {
      return NextResponse.json(
        { error: 'コース情報が不足しています' },
        { status: 400 }
      )
    }

    if (!changeReason) {
      return NextResponse.json(
        { error: '変更事由が必要です' },
        { status: 400 }
      )
    }

    if (!requestedEffectiveDate) {
      return NextResponse.json(
        { error: '希望適用日が必要です' },
        { status: 400 }
      )
    }

    // 特例変更の場合は添付ファイル必須
    const isSpecialChange = changeReason.startsWith('special_')
    if (isSpecialChange && (!attachments || attachments.length === 0)) {
      return NextResponse.json(
        { error: '特例変更の場合は証明書類の添付が必要です' },
        { status: 400 }
      )
    }

    // TODO: 実際のファイルアップロード処理を実装
    // const uploadedFiles: string[] = []
    // if (attachments && attachments.length > 0) {
    //   for (const file of attachments) {
    //     const { data, error } = await supabase.storage
    //       .from('career-course-attachments')
    //       .upload(`${user.id}/${Date.now()}_${file.name}`, file.data, {
    //         contentType: file.type
    //       })
    //     if (error) throw error
    //     uploadedFiles.push(data.path)
    //   }
    // }

    // TODO: 実際のDB保存処理を実装
    // const { data: insertData, error: insertError } = await supabase
    //   .from('career_course_change_requests')
    //   .insert({
    //     staff_id: user.id,
    //     current_course_code: currentCourseCode,
    //     requested_course_code: requestedCourseCode,
    //     change_reason: changeReason,
    //     reason_detail: reasonDetail,
    //     requested_effective_date: requestedEffectiveDate,
    //     attachments: uploadedFiles,
    //     approval_status: 'pending',
    //     created_at: new Date().toISOString(),
    //     updated_at: new Date().toISOString()
    //   })
    //   .select()
    //   .single()

    // モックレスポンス（開発用）
    const mockResponse = {
      id: `req-${Date.now()}`,
      staffId: 'OH-NS-2021-001',
      currentCourseCode,
      requestedCourseCode,
      changeReason,
      reasonDetail,
      requestedEffectiveDate,
      attachments: attachments?.map((f: any) => f.name) || [],
      approvalStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      message: '申請を受け付けました。人事部の審査をお待ちください。'
    }

    // TODO: 実際の通知処理を実装
    // - 人事部への通知メール送信
    // - 申請者への受付完了通知
    // - 管理画面への通知バッジ更新

    return NextResponse.json(mockResponse, { status: 201 })
  } catch (error) {
    console.error('申請送信エラー:', error)
    return NextResponse.json(
      { error: '申請の送信に失敗しました' },
      { status: 500 }
    )
  }
}