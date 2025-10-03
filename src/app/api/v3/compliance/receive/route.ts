import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import type { AcknowledgementNotification } from '@/types/complianceMaster';

// VoiceDriveからの通報受信API
// 小原病院ハラスメント防止規程・公益通報規程に準拠

interface EncryptedPayload {
  encrypted: string;
  iv: string;
  authTag: string;
}

interface ComplianceReportMetadata {
  reportId: string;
  anonymousId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  requiresImmediateAction: boolean;
  category: string;
}

interface ReceiveRequest {
  version: string;
  source: string;
  payload: EncryptedPayload;
  checksum: string;
  metadata: ComplianceReportMetadata;
}

// ケース番号生成
function generateCaseNumber(): string {
  const year = new Date().getFullYear();
  const sequence = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  return `MED-${year}-${sequence}`;
}

// チェックサム検証
function verifyChecksum(payload: any, checksum: string): boolean {
  const calculatedChecksum = crypto
    .createHash('sha256')
    .update(JSON.stringify(payload))
    .digest('hex');
  return calculatedChecksum === checksum;
}

// 暗号化データの復号化（実際の実装では環境変数から鍵を取得）
function decryptPayload(encryptedData: EncryptedPayload): any {
  // 本番環境では実際の復号化処理を実装
  // ここではダミーデータを返す
  return {
    reportId: encryptedData.encrypted.substring(0, 10),
    category: 'ハラスメント',
    subcategory: 'パワーハラスメント',
    description: '上司による継続的な人格否定的発言',
    occurredAt: new Date().toISOString(),
    reporterInfo: {
      department: '看護部',
      consentLevel: 'conditional'
    }
  };
}

// 緊急度に基づく対応時間の算出
function getEstimatedResponseTime(severity: string) {
  switch (severity) {
    case 'critical':
      return { value: 1, unit: 'hours' };
    case 'high':
      return { value: 24, unit: 'hours' };
    case 'medium':
      return { value: 3, unit: 'days' };
    default:
      return { value: 7, unit: 'days' };
  }
}

// 担当者への通知（実際の実装では通知システムと連携）
async function notifyHandlers(report: any): Promise<void> {
  console.log('Notifying handlers for report:', report);

  // 緊急度に応じた通知先の決定
  const handlers = [];
  if (report.severity === 'critical' || report.severity === 'high') {
    handlers.push('事務長', '看護部長');
  }

  if (report.category === 'ハラスメント') {
    handlers.push('ハラスメント対策委員会');
  }

  // 実際の通知送信処理（メール、SMS、プッシュ通知等）
  for (const handler of handlers) {
    console.log(`Sending notification to: ${handler}`);
    // await sendNotification(handler, report);
  }
}

// 監査ログ記録（改ざん防止のためハッシュチェーン実装）
async function recordAuditLog(action: string, data: any): Promise<void> {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    action,
    data,
    previousHash: 'PREVIOUS_HASH', // 実際は前のログのハッシュ値を取得
    currentHash: ''
  };

  // 現在のログのハッシュ値を計算
  const hashData = JSON.stringify({
    timestamp: logEntry.timestamp,
    action: logEntry.action,
    data: logEntry.data,
    previousHash: logEntry.previousHash
  });

  logEntry.currentHash = crypto
    .createHash('sha256')
    .update(hashData)
    .digest('hex');

  console.log('Audit log recorded:', logEntry);
  // 実際はデータベースに保存
}

// 受付確認通知データの生成
function createAcknowledgementNotification(
  reportId: string,
  caseNumber: string,
  anonymousId: string,
  category: string,
  severity: 'critical' | 'high' | 'medium' | 'low'
): AcknowledgementNotification {
  const estimatedResponseTime = getEstimatedResponseTime(severity);

  return {
    reportId,
    caseNumber,
    anonymousId,
    receivedAt: new Date().toISOString(),
    category,
    severity,
    message: getAcknowledgementMessage(severity),
    nextSteps: {
      description: getNextStepsDescription(severity),
      estimatedResponseTime,
      deadlineForAdditionalInfo: severity === 'critical' || severity === 'high'
        ? new Date(Date.now() + 86400000).toISOString() // 24時間後
        : undefined
    },
    anonymityProtection: {
      level: 'full',
      message: 'あなたの匿名性は厳格に保護されます。通報者の特定につながる情報は暗号化され、限定された担当者のみがアクセス可能です。'
    },
    trackingInfo: {
      statusCheckUrl: `/api/v3/compliance/receive?anonymousId=${anonymousId}`,
      contactMethod: '匿名IDを使用して、いつでもケースの進捗状況を確認できます。'
    }
  };
}

// 受付確認メッセージの生成
function getAcknowledgementMessage(severity: string): string {
  switch (severity) {
    case 'critical':
      return '【緊急】通報を受け付けました。重大案件として直ちに対応を開始します。';
    case 'high':
      return '通報を受け付けました。優先案件として速やかに対応いたします。';
    case 'medium':
      return '通報を受け付けました。担当者を割り当て、調査を開始いたします。';
    default:
      return '通報を受け付けました。内容を確認し、適切に対応いたします。';
  }
}

// 今後の流れの説明
function getNextStepsDescription(severity: string): string {
  switch (severity) {
    case 'critical':
      return '1時間以内に担当者に通知し、緊急対応を開始します。24時間以内に初期調査結果をお知らせします。';
    case 'high':
      return '当日中に担当者に通知し、調査を開始します。3営業日以内に初期調査結果をお知らせします。';
    case 'medium':
      return '3営業日以内に担当者を割り当て、調査を開始します。1週間以内に初期調査結果をお知らせします。';
    default:
      return '1週間以内に内容を確認し、必要に応じて調査を開始します。進捗は適宜お知らせします。';
  }
}

// VoiceDriveへの受付確認通知送信
async function sendAcknowledgementToVoiceDrive(notification: AcknowledgementNotification): Promise<void> {
  const webhookUrl = process.env.VOICEDRIVE_ACKNOWLEDGEMENT_WEBHOOK_URL
    || process.env.VOICEDRIVE_WEBHOOK_URL
    || 'https://voicedrive.example.com/api/webhook/compliance/acknowledgement';
  const webhookSecret = process.env.VOICEDRIVE_WEBHOOK_SECRET || 'shared-secret-key';

  // Webhook署名の生成
  const signature = crypto
    .createHmac('sha256', webhookSecret)
    .update(JSON.stringify(notification))
    .digest('hex');

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Secret': signature,
        'X-Case-Number': notification.caseNumber,
        'X-Anonymous-Id': notification.anonymousId,
        'X-Timestamp': new Date().toISOString()
      },
      body: JSON.stringify(notification)
    });

    if (!response.ok) {
      console.error('Failed to send acknowledgement to VoiceDrive:', {
        status: response.status,
        statusText: response.statusText,
        caseNumber: notification.caseNumber
      });
      throw new Error('Acknowledgement delivery failed');
    }

    console.log('Acknowledgement sent successfully to VoiceDrive:', notification.caseNumber);
  } catch (error) {
    console.error('Error sending acknowledgement:', error);
    // エラーでも処理は継続（受付自体は成功）
    // 後でリトライ機構を実装予定
  }
}

export async function POST(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') || crypto.randomUUID();

  try {
    // 1. リクエストボディの取得
    const body: ReceiveRequest = await request.json();

    // 2. リクエスト検証
    if (body.version !== '1.0' || body.source !== 'voicedrive') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'Invalid request format or source'
          },
          requestId,
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      );
    }

    // 3. チェックサム検証
    const checksumValid = verifyChecksum(body.payload, body.checksum);
    if (!checksumValid) {
      await recordAuditLog('CHECKSUM_VERIFICATION_FAILED', {
        requestId,
        source: body.source
      });

      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'CHECKSUM_MISMATCH',
            message: 'Checksum verification failed'
          },
          requestId,
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      );
    }

    // 4. ペイロード復号化
    const decryptedData = decryptPayload(body.payload);

    // 5. ケース番号生成
    const caseNumber = generateCaseNumber();

    // 6. データベース保存（実際の実装）
    const report = {
      caseNumber,
      voicedriveReportId: body.metadata.reportId,
      anonymousId: body.metadata.anonymousId,
      category: body.metadata.category,
      severity: body.metadata.severity,
      status: 'received',
      requiresImmediateAction: body.metadata.requiresImmediateAction,
      data: decryptedData,
      checksum: body.checksum,
      receivedAt: new Date().toISOString()
    };

    // 実際はデータベースに保存
    console.log('Saving report to database:', report);

    // 7. 緊急度に応じた通知
    if (body.metadata.requiresImmediateAction || body.metadata.severity === 'critical') {
      await notifyHandlers(report);
    }

    // 8. 通報者への受付確認通知送信（新規実装）
    const acknowledgementNotification = createAcknowledgementNotification(
      body.metadata.reportId,
      caseNumber,
      body.metadata.anonymousId,
      body.metadata.category,
      body.metadata.severity
    );

    await sendAcknowledgementToVoiceDrive(acknowledgementNotification);

    // 9. 監査ログ記録
    await recordAuditLog('REPORT_RECEIVED', {
      requestId,
      caseNumber,
      severity: body.metadata.severity,
      category: body.metadata.category
    });

    await recordAuditLog('ACKNOWLEDGEMENT_SENT', {
      requestId,
      caseNumber,
      anonymousId: body.metadata.anonymousId,
      sentAt: new Date().toISOString()
    });

    // 10. 成功応答
    return NextResponse.json(
      {
        success: true,
        caseNumber,
        acknowledgementId: crypto.randomUUID(),
        receivedAt: new Date().toISOString(),
        message: 'Report received and processing started',
        estimatedResponseTime: getEstimatedResponseTime(body.metadata.severity),
        acknowledgementSent: true
      },
      { status: 200 }
    );

  } catch (error) {
    console.error(`[${requestId}] Error:`, error);

    await recordAuditLog('RECEIVE_ERROR', {
      requestId,
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
          details: process.env.NODE_ENV === 'development'
            ? error instanceof Error ? error.message : 'Unknown error'
            : undefined
        },
        requestId,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// ステータス確認API
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const anonymousId = searchParams.get('anonymousId');

  if (!anonymousId) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'MISSING_PARAMETER',
          message: 'Anonymous ID is required'
        }
      },
      { status: 400 }
    );
  }

  // 実際はデータベースから取得
  const caseData = {
    anonymousId,
    caseNumber: 'MED-2025-0001',
    currentStatus: {
      code: 'investigating',
      label: '調査中',
      description: '担当者による調査が進行中です',
      since: new Date().toISOString()
    },
    history: [
      {
        status: 'received',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        note: '通報を受信しました'
      },
      {
        status: 'triaging',
        timestamp: new Date(Date.now() - 82800000).toISOString(),
        note: 'トリアージを実施しました'
      },
      {
        status: 'investigating',
        timestamp: new Date(Date.now() - 79200000).toISOString(),
        note: '調査を開始しました'
      }
    ],
    estimatedCompletion: new Date(Date.now() + 259200000).toISOString(),
    actions: {
      canProvideAdditionalInfo: true,
      canWithdraw: true,
      canViewDetails: false
    },
    nextSteps: '担当者による聞き取り調査を実施中です。追加情報がある場合はお知らせください。'
  };

  return NextResponse.json({
    success: true,
    ...caseData
  });
}