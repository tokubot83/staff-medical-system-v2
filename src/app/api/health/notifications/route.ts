import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * 健康データ通知API
 * VoiceDriveシステムへの通知データを管理
 */

interface HealthNotification {
  type: 'health_risk_assessment' | 'health_checkup_result' | 'stress_check_result' | 'reexamination_required';
  staffId: string;
  timestamp: string;
  assessment?: any;
  recommendations?: any;
  data?: any;
  metadata: {
    source: string;
    version: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
  };
}

// MCP共有フォルダのパス
const MCP_SHARED_PATH = path.join(process.cwd(), 'mcp-shared');
const NOTIFICATIONS_PATH = path.join(MCP_SHARED_PATH, 'notifications');
const LOGS_PATH = path.join(MCP_SHARED_PATH, 'logs');

// ディレクトリの初期化
function ensureDirectories() {
  if (!fs.existsSync(NOTIFICATIONS_PATH)) {
    fs.mkdirSync(NOTIFICATIONS_PATH, { recursive: true });
  }
  if (!fs.existsSync(LOGS_PATH)) {
    fs.mkdirSync(LOGS_PATH, { recursive: true });
  }
}

// 通知データの保存
function saveNotification(notification: HealthNotification): string {
  ensureDirectories();

  const notificationId = `health_notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const fileName = `${notificationId}.json`;
  const filePath = path.join(NOTIFICATIONS_PATH, fileName);

  // 通知データの保存
  fs.writeFileSync(filePath, JSON.stringify(notification, null, 2));

  // 通知ログの記録
  const logEntry = {
    notificationId,
    type: notification.type,
    staffId: notification.staffId,
    timestamp: notification.timestamp,
    priority: notification.metadata.priority || 'medium',
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  const logFile = path.join(LOGS_PATH, 'health-notifications.log');
  const existingLogs = fs.existsSync(logFile)
    ? JSON.parse(fs.readFileSync(logFile, 'utf-8'))
    : [];

  existingLogs.push(logEntry);
  fs.writeFileSync(logFile, JSON.stringify(existingLogs, null, 2));

  // VoiceDrive用のサマリーファイル更新
  updateVoiceDriveSummary(notification);

  return notificationId;
}

// VoiceDrive用サマリーの更新
function updateVoiceDriveSummary(notification: HealthNotification) {
  const summaryPath = path.join(MCP_SHARED_PATH, 'docs', 'health-notifications-summary.md');
  const timestamp = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });

  let summaryContent = '';
  if (fs.existsSync(summaryPath)) {
    summaryContent = fs.readFileSync(summaryPath, 'utf-8');
  } else {
    summaryContent = `# 健康データ通知サマリー

VoiceDriveシステムへの健康関連通知の履歴です。

---

`;
  }

  // 新しい通知を追加
  const newEntry = `
## ${timestamp} - ${getNotificationTitle(notification.type)}

- **職員ID**: ${notification.staffId}
- **優先度**: ${notification.metadata.priority || 'medium'}
- **タイプ**: ${notification.type}

${formatNotificationDetails(notification)}

---
`;

  summaryContent = summaryContent.replace('---\n\n', '---\n\n' + newEntry);
  fs.writeFileSync(summaryPath, summaryContent);
}

// 通知タイトルの取得
function getNotificationTitle(type: string): string {
  const titles: Record<string, string> = {
    'health_risk_assessment': '健康リスク評価完了',
    'health_checkup_result': '健康診断結果通知',
    'stress_check_result': 'ストレスチェック結果通知',
    'reexamination_required': '要再検査通知'
  };
  return titles[type] || '健康データ通知';
}

// 通知詳細のフォーマット
function formatNotificationDetails(notification: HealthNotification): string {
  let details = '';

  if (notification.assessment) {
    const { overallScore, overallLevel, priorityActions } = notification.assessment;
    details += `
### リスク評価結果
- 総合スコア: ${overallScore}点
- リスクレベル: ${overallLevel}
- 優先対応事項:
${priorityActions?.map((action: string) => `  - ${action}`).join('\n') || '  なし'}
`;
  }

  if (notification.recommendations) {
    details += `
### 推奨事項
${JSON.stringify(notification.recommendations, null, 2)}
`;
  }

  if (notification.data) {
    details += `
### 詳細データ
\`\`\`json
${JSON.stringify(notification.data, null, 2)}
\`\`\`
`;
  }

  return details;
}

// GET: 通知履歴の取得
export async function GET(request: NextRequest) {
  try {
    ensureDirectories();

    const searchParams = request.nextUrl.searchParams;
    const staffId = searchParams.get('staffId');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '10');

    const logFile = path.join(LOGS_PATH, 'health-notifications.log');
    if (!fs.existsSync(logFile)) {
      return NextResponse.json({ notifications: [] });
    }

    let logs = JSON.parse(fs.readFileSync(logFile, 'utf-8'));

    // フィルタリング
    if (staffId) {
      logs = logs.filter((log: any) => log.staffId === staffId);
    }
    if (type) {
      logs = logs.filter((log: any) => log.type === type);
    }

    // ソートと制限
    logs = logs
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);

    return NextResponse.json({ notifications: logs });
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

// POST: 新規通知の送信
export async function POST(request: NextRequest) {
  try {
    const notification: HealthNotification = await request.json();

    // バリデーション
    if (!notification.type || !notification.staffId) {
      return NextResponse.json(
        { error: 'Missing required fields: type and staffId' },
        { status: 400 }
      );
    }

    // タイムスタンプとメタデータの設定
    notification.timestamp = notification.timestamp || new Date().toISOString();
    notification.metadata = {
      source: 'staff-medical-system',
      version: '1.0.0',
      ...notification.metadata
    };

    // 優先度の自動設定
    if (!notification.metadata.priority) {
      if (notification.assessment?.overallLevel === 'very-high') {
        notification.metadata.priority = 'urgent';
      } else if (notification.assessment?.overallLevel === 'high') {
        notification.metadata.priority = 'high';
      } else if (notification.assessment?.overallLevel === 'medium') {
        notification.metadata.priority = 'medium';
      } else {
        notification.metadata.priority = 'low';
      }
    }

    // 通知の保存
    const notificationId = saveNotification(notification);

    // Webhook通知（VoiceDriveへの即時通知）
    await sendWebhookNotification(notification, notificationId);

    return NextResponse.json({
      success: true,
      notificationId,
      message: 'Notification sent to VoiceDrive successfully'
    });
  } catch (error) {
    console.error('Failed to send notification:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}

// Webhook通知の送信
async function sendWebhookNotification(notification: HealthNotification, notificationId: string) {
  // VoiceDriveのWebhook URLが設定されている場合
  const webhookUrl = process.env.VOICEDRIVE_WEBHOOK_URL;

  if (!webhookUrl) {
    console.log('VoiceDrive webhook not configured, skipping webhook notification');
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Source': 'staff-medical-system',
        'X-Notification-ID': notificationId
      },
      body: JSON.stringify({
        id: notificationId,
        ...notification
      })
    });

    if (!response.ok) {
      console.error('Webhook notification failed:', response.statusText);
    }
  } catch (error) {
    console.error('Failed to send webhook notification:', error);
  }
}

// DELETE: 通知の削除（管理用）
export async function DELETE(request: NextRequest) {
  try {
    const { notificationId } = await request.json();

    if (!notificationId) {
      return NextResponse.json(
        { error: 'Missing notificationId' },
        { status: 400 }
      );
    }

    const filePath = path.join(NOTIFICATIONS_PATH, `${notificationId}.json`);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    fs.unlinkSync(filePath);

    // ログの更新
    const logFile = path.join(LOGS_PATH, 'health-notifications.log');
    if (fs.existsSync(logFile)) {
      const logs = JSON.parse(fs.readFileSync(logFile, 'utf-8'));
      const updatedLogs = logs.map((log: any) => {
        if (log.notificationId === notificationId) {
          log.status = 'deleted';
          log.deletedAt = new Date().toISOString();
        }
        return log;
      });
      fs.writeFileSync(logFile, JSON.stringify(updatedLogs, null, 2));
    }

    return NextResponse.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Failed to delete notification:', error);
    return NextResponse.json(
      { error: 'Failed to delete notification' },
      { status: 500 }
    );
  }
}