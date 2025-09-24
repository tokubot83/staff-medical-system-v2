import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// VoiceDriveへのステータス更新通知Webhook
// 医療職員管理システム → VoiceDrive

interface StatusUpdateWebhook {
  reportId: string;           // VoiceDriveのレポートID
  caseNumber: string;         // 医療システムのケース番号
  anonymousId: string;        // 匿名ID
  status: {
    current: string;
    previous: string;
    changedAt: string;
    changedBy: {
      role: string;
      department: string;
    };
  };
  message?: string;           // 通報者への通知メッセージ
  investigation?: {
    assigned: boolean;
    investigator: {
      role: string;
      department: string;
    };
    estimatedCompletion?: string;
  };
  requiresAdditionalInfo?: {
    needed: boolean;
    type: string;
    deadline?: string;
  };
}

// Webhook署名の生成（HMAC-SHA256）
function generateWebhookSignature(payload: any, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
}

// VoiceDriveへの通知送信
async function sendToVoiceDrive(webhookData: StatusUpdateWebhook): Promise<void> {
  const webhookUrl = process.env.VOICEDRIVE_WEBHOOK_URL || 'https://voicedrive.example.com/api/webhook/compliance';
  const webhookSecret = process.env.VOICEDRIVE_WEBHOOK_SECRET || 'shared-secret-key';

  const signature = generateWebhookSignature(webhookData, webhookSecret);

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Webhook-Secret': signature,
      'X-Case-Number': webhookData.caseNumber,
      'X-Timestamp': new Date().toISOString()
    },
    body: JSON.stringify(webhookData)
  });

  if (!response.ok) {
    console.error('Failed to send webhook to VoiceDrive:', {
      status: response.status,
      statusText: response.statusText
    });
    throw new Error('Webhook delivery failed');
  }

  console.log('Webhook sent successfully to VoiceDrive:', webhookData.caseNumber);
}

// ステータス更新処理
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      caseNumber,
      voicedriveReportId,
      anonymousId,
      newStatus,
      assignedTo,
      message
    } = body;

    // 入力検証
    if (!caseNumber || !voicedriveReportId || !anonymousId || !newStatus) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_PARAMETERS',
            message: 'Required parameters are missing'
          }
        },
        { status: 400 }
      );
    }

    // 現在のステータスを取得（実際はDBから）
    const currentStatus = 'investigating'; // ダミーデータ

    // Webhook用のデータを準備
    const webhookData: StatusUpdateWebhook = {
      reportId: voicedriveReportId,
      caseNumber,
      anonymousId,
      status: {
        current: newStatus,
        previous: currentStatus,
        changedAt: new Date().toISOString(),
        changedBy: {
          role: assignedTo?.role || '事務長',
          department: assignedTo?.department || '管理部'
        }
      },
      message: message || getStatusMessage(newStatus)
    };

    // 調査担当者情報を追加
    if (assignedTo && newStatus === 'investigating') {
      webhookData.investigation = {
        assigned: true,
        investigator: {
          role: assignedTo.role,
          department: assignedTo.department
        },
        estimatedCompletion: new Date(Date.now() + 259200000).toISOString() // 3日後
      };
    }

    // エスカレーション時の追加情報
    if (newStatus === 'escalated') {
      webhookData.message = 'ハラスメント対策委員会に報告されました。委員会での審議後、対応を決定いたします。';
    }

    // VoiceDriveへ通知送信
    await sendToVoiceDrive(webhookData);

    // 監査ログ記録
    await recordAuditLog('STATUS_UPDATE_WEBHOOK_SENT', {
      caseNumber,
      newStatus,
      webhookData
    });

    return NextResponse.json({
      success: true,
      message: 'Status update sent to VoiceDrive',
      caseNumber,
      newStatus,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Webhook error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'WEBHOOK_ERROR',
          message: 'Failed to send status update',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    );
  }
}

// ステータスに応じたメッセージテンプレート
function getStatusMessage(status: string): string {
  switch (status) {
    case 'received':
      return '通報を受信しました。内容を確認中です。';
    case 'triaging':
      return 'トリアージを実施中です。緊急度と対応優先度を判定しています。';
    case 'investigating':
      return '調査を開始しました。関係者への聞き取りを実施しています。';
    case 'escalated':
      return 'ハラスメント対策委員会に報告されました。';
    case 'resolved':
      return '調査が完了し、適切な措置を実施しました。';
    case 'closed':
      return 'ケースをクローズしました。ご協力ありがとうございました。';
    default:
      return 'ステータスが更新されました。';
  }
}

// 監査ログ記録
async function recordAuditLog(action: string, data: any): Promise<void> {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    action,
    data,
    hash: crypto.createHash('sha256').update(JSON.stringify({ timestamp, action, data })).digest('hex')
  };

  console.log('Audit log:', logEntry);
  // 実際はデータベースに保存
}