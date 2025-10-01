import { NextRequest, NextResponse } from 'next/server'

/**
 * Phase 5-3 API: VoiceDriveへのWebhook通知送信
 * 内部使用: 医療システムから自動的に呼び出される
 *
 * このエンドポイントは人事部が申請を承認/却下した際に自動実行され、
 * VoiceDrive側に通知を送信します。
 */

interface WebhookPayload {
  type: 'course_change_approved' | 'course_change_rejected'
  staffId: string
  requestId: string
  approvedCourse?: string
  effectiveDate?: string
  rejectionReason?: string
  reviewComment?: string
}

/**
 * VoiceDriveに通知を送信
 */
export async function sendNotificationToVoiceDrive(payload: WebhookPayload): Promise<boolean> {
  try {
    const voiceDriveWebhookUrl = process.env.VOICEDRIVE_WEBHOOK_URL || 'http://localhost:3001/api/career-course/notify'
    const apiKey = process.env.VOICEDRIVE_API_KEY || 'dev-api-key-12345'

    const response = await fetch(voiceDriveWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'X-Medical-System-Version': '1.0',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      console.error('VoiceDrive通知送信失敗:', response.status, await response.text())
      return false
    }

    const result = await response.json()
    console.log('VoiceDrive通知送信成功:', result)
    return true
  } catch (error) {
    console.error('VoiceDrive通知送信エラー:', error)
    return false
  }
}

/**
 * POST: 内部からの通知送信リクエスト
 * 人事部の承認/却下処理から呼び出される
 */
export async function POST(request: NextRequest) {
  try {
    // 内部認証（APIキーチェック）
    const authHeader = request.headers.get('authorization')
    const internalApiKey = process.env.INTERNAL_API_KEY || 'internal-secret-key'

    if (authHeader !== `Bearer ${internalApiKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload: WebhookPayload = await request.json()

    // バリデーション
    if (!payload.type || !payload.staffId || !payload.requestId) {
      return NextResponse.json(
        { error: 'type, staffId, requestId are required' },
        { status: 400 }
      )
    }

    // VoiceDriveに通知送信
    const success = await sendNotificationToVoiceDrive(payload)

    if (!success) {
      // リトライ機構（最大3回）
      let retryCount = 0
      let retrySuccess = false

      while (retryCount < 3 && !retrySuccess) {
        retryCount++
        console.log(`VoiceDrive通知リトライ ${retryCount}/3...`)
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)) // 指数バックオフ
        retrySuccess = await sendNotificationToVoiceDrive(payload)
      }

      if (!retrySuccess) {
        // TODO: リトライキューに追加（将来実装）
        console.error('VoiceDrive通知送信が完全に失敗しました。手動で再送信が必要です。')
        return NextResponse.json(
          { error: 'Notification failed after retries', success: false },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({
      success: true,
      message: 'VoiceDriveに通知を送信しました',
      payload
    })
  } catch (error) {
    console.error('Webhook通知処理エラー:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
