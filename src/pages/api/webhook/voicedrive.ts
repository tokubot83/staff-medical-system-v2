import { NextApiRequest, NextApiResponse } from 'next';

/**
 * VoiceDriveからのWebhook通知受信エンドポイント
 * POST /api/webhook/voicedrive
 *
 * VoiceDriveシステムからの各種イベント通知を受信・処理
 * - 投票完了通知
 * - 議題エスカレーション通知
 * - システム状態変更通知
 */

// Webhookイベント型定義
interface WebhookEvent {
  event: string;
  timestamp: string;
  data: any;
  signature?: string;  // 署名検証用
}

// サポートするイベント種別
const SUPPORTED_EVENTS = [
  'proposal.created',         // 議題作成
  'proposal.escalated',       // 議題エスカレーション
  'proposal.approved',        // 議題承認
  'proposal.rejected',        // 議題却下
  'voting.completed',         // 投票完了
  'committee.submitted',      // 委員会提出
  'system.health_check',      // ヘルスチェック
  'staff.permission_changed'  // 職員権限変更要求
];

// レスポンス型定義
interface WebhookResponse {
  received: boolean;
  processed: boolean;
  eventId?: string;
  message?: string;
  timestamp: string;
}

interface WebhookError {
  error: {
    code: string;
    message: string;
    timestamp: string;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WebhookResponse | WebhookError>
) {
  // CORSヘッダー設定
  res.setHeader('Access-Control-Allow-Origin', process.env.VOICEDRIVE_URL || 'http://localhost:3001');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Webhook-Signature');

  // OPTIONSリクエスト対応
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POSTメソッドのみ許可
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'Only POST method is allowed',
        timestamp: new Date().toISOString()
      }
    });
  }

  const timestamp = new Date().toISOString();

  try {
    // リクエストボディの検証
    const webhookEvent: WebhookEvent = req.body;

    if (!webhookEvent.event || !webhookEvent.timestamp || !webhookEvent.data) {
      return res.status(400).json({
        error: {
          code: 'INVALID_PAYLOAD',
          message: 'Missing required fields: event, timestamp, data',
          timestamp
        }
      });
    }

    // サポートするイベント種別の確認
    if (!SUPPORTED_EVENTS.includes(webhookEvent.event)) {
      console.warn(`Unsupported webhook event: ${webhookEvent.event}`);
      return res.status(400).json({
        error: {
          code: 'UNSUPPORTED_EVENT',
          message: `Event type '${webhookEvent.event}' is not supported`,
          timestamp
        }
      });
    }

    // 署名検証（本番環境では必須）
    if (process.env.NODE_ENV === 'production') {
      const signature = req.headers['x-webhook-signature'] as string;
      if (!verifyWebhookSignature(JSON.stringify(req.body), signature)) {
        return res.status(401).json({
          error: {
            code: 'INVALID_SIGNATURE',
            message: 'Webhook signature verification failed',
            timestamp
          }
        });
      }
    }

    // イベント処理
    const processed = await processWebhookEvent(webhookEvent);

    // 成功レスポンス
    const response: WebhookResponse = {
      received: true,
      processed,
      eventId: generateEventId(),
      message: `Event '${webhookEvent.event}' processed successfully`,
      timestamp
    };

    console.log(`Webhook processed: ${webhookEvent.event}`, {
      eventId: response.eventId,
      processed,
      timestamp
    });

    return res.status(200).json(response);

  } catch (error) {
    console.error('Webhook processing error:', error);

    return res.status(500).json({
      error: {
        code: 'PROCESSING_ERROR',
        message: 'An error occurred while processing webhook',
        timestamp
      }
    });
  }
}

/**
 * Webhookイベントの処理
 */
async function processWebhookEvent(event: WebhookEvent): Promise<boolean> {
  try {
    switch (event.event) {
      case 'proposal.created':
        await handleProposalCreated(event.data);
        break;

      case 'proposal.escalated':
        await handleProposalEscalated(event.data);
        break;

      case 'proposal.approved':
        await handleProposalApproved(event.data);
        break;

      case 'proposal.rejected':
        await handleProposalRejected(event.data);
        break;

      case 'voting.completed':
        await handleVotingCompleted(event.data);
        break;

      case 'committee.submitted':
        await handleCommitteeSubmitted(event.data);
        break;

      case 'system.health_check':
        await handleHealthCheck(event.data);
        break;

      case 'staff.permission_changed':
        await handleStaffPermissionChanged(event.data);
        break;

      default:
        console.warn(`Unhandled event type: ${event.event}`);
        return false;
    }

    return true;
  } catch (error) {
    console.error(`Error processing event ${event.event}:`, error);
    return false;
  }
}

/**
 * 個別イベントハンドラ（実装例）
 */

async function handleProposalCreated(data: any): Promise<void> {
  console.log('Proposal created:', {
    proposalId: data.proposalId,
    title: data.title,
    submittedBy: data.submittedBy,
    department: data.department
  });

  // 必要に応じて通知、ログ記録、他システム連携などを実行
  // 例: 管理者への通知メール送信
  // 例: 社内チャットへの通知
}

async function handleProposalEscalated(data: any): Promise<void> {
  console.log('Proposal escalated:', {
    proposalId: data.proposalId,
    fromLevel: data.fromLevel,
    toLevel: data.toLevel,
    score: data.score
  });

  // エスカレーション通知の処理
  // 例: 関係者への通知
  // 例: ダッシュボードへの表示更新
}

async function handleVotingCompleted(data: any): Promise<void> {
  console.log('Voting completed:', {
    proposalId: data.proposalId,
    totalVotes: data.totalVotes,
    finalScore: data.finalScore,
    decision: data.decision
  });

  // 投票結果の処理
  // 例: 結果の保存
  // 例: 関係者への結果通知
}

async function handleCommitteeSubmitted(data: any): Promise<void> {
  console.log('Committee submitted:', {
    proposalId: data.proposalId,
    committee: data.committee,
    scheduledDate: data.scheduledDate
  });

  // 委員会提出の処理
  // 例: 委員会メンバーへの通知
  // 例: カレンダーへの登録
}

async function handleHealthCheck(data: any): Promise<void> {
  console.log('Health check received:', {
    status: data.status,
    timestamp: data.timestamp
  });

  // ヘルスチェック応答
  // 例: システム状態の記録
  // 例: 監視システムへの応答
}

async function handleStaffPermissionChanged(data: any): Promise<void> {
  console.log('Staff permission change requested:', {
    staffId: data.staffId,
    oldLevel: data.oldLevel,
    newLevel: data.newLevel,
    reason: data.reason
  });

  // 権限変更要求の処理
  // 実際のシステムでは、職員マスターの更新が必要
  // 例: データベースの更新
  // 例: 承認フローの開始
}

/**
 * Webhook署名の検証（セキュリティ用）
 */
function verifyWebhookSignature(payload: string, signature: string): boolean {
  if (!signature) return false;

  // 実際の実装では HMAC-SHA256 などで署名検証
  // 現在は開発用の簡易実装
  const expectedSignature = process.env.WEBHOOK_SECRET;
  return signature === expectedSignature;
}

/**
 * イベントIDの生成
 */
function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}