# VoiceDrive Analytics 通知システム仕様書

**発信**: 医療システムチーム
**宛先**: VoiceDriveチーム
**日付**: 2025年10月9日
**件名**: VoiceDrive Analytics バッチ処理通知機能 実装依頼書
**バージョン**: 1.0.0

---

## 📋 目次

1. [概要](#1-概要)
2. [背景・目的](#2-背景目的)
3. [エンドポイント仕様](#3-エンドポイント仕様)
4. [リクエストフォーマット](#4-リクエストフォーマット)
5. [レスポンスフォーマット](#5-レスポンスフォーマット)
6. [認証・セキュリティ](#6-認証セキュリティ)
7. [通知データモデル](#7-通知データモデル)
8. [エラーハンドリング](#8-エラーハンドリング)
9. [実装例](#9-実装例)
10. [テスト項目](#10-テスト項目)
11. [運用・監視](#11-運用監視)

---

## 1. 概要

### 1.1 実装目的

VoiceDrive Analytics バッチ処理の実行結果（成功・エラー）を、VoiceDriveのアカウントレベル99ユーザー（システム管理者）に自動通知するシステムです。

### 1.2 通知方式の変更理由

**当初計画**: Slack通知
**変更後**: VoiceDrive アカウントレベル99通知

**変更理由**:
- ✅ システム内完結（外部サービス不要）
- ✅ 既存の権限システム活用
- ✅ セキュリティ向上（外部依存排除）
- ✅ 統一された通知管理

### 1.3 通知タイミング

| タイミング | 通知タイプ | 内容 |
|-----------|----------|------|
| **毎日02:00 JST** | success/error | Analytics バッチ処理の実行結果 |
| **エラー発生時** | error | 即座にエラー通知 |
| **警告発生時** | warning | K-匿名性違反など |
| **情報通知** | info | システムメンテナンス等 |

---

## 2. 背景・目的

### 2.1 実装背景

VoiceDrive Analytics バッチ処理（毎日02:00 JST実行予定）の運用監視において、以下の課題がありました：

1. **エラー検知の遅延**: ログファイル確認が必要で、即座にエラー検知できない
2. **成功確認の手間**: 毎日の正常実行を確認する手段がない
3. **外部サービス依存**: Slack通知では外部サービスに依存する

### 2.2 解決策

VoiceDrive内のアカウントレベル99ユーザーに通知することで：

- ✅ **即座のエラー検知**: バッチ処理失敗を即座に通知
- ✅ **成功確認の自動化**: 毎日の正常実行を通知で確認
- ✅ **詳細メトリクス提供**: 処理時間、データ量、レート制限等を自動送信
- ✅ **システム内完結**: VoiceDriveのみで完結

### 2.3 通知対象者

**アカウントレベル99**: システム管理者・開発者のみ

---

## 3. エンドポイント仕様

### 3.1 エンドポイント

```
POST http://localhost:4000/api/webhook/analytics-notification
```

**本番環境**: `https://api.voicedrive.com/api/webhook/analytics-notification`

### 3.2 HTTP メソッド

`POST`

### 3.3 Content-Type

`application/json`

### 3.4 必須ヘッダー

| ヘッダー名 | 値 | 説明 |
|-----------|---|------|
| `Content-Type` | `application/json` | JSON形式 |
| `X-Signature` | HMAC-SHA256署名 | HMAC-SHA256署名（後述） |
| `X-Timestamp` | Unix timestamp（秒） | リクエストタイムスタンプ |

---

## 4. リクエストフォーマット

### 4.1 基本構造

```typescript
interface NotificationRequest {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;                // 最大100文字
  message: string;              // 最大500文字
  details?: Record<string, any>; // 詳細メトリクス（オプション）
  timestamp: number;             // Unix timestamp（秒）
  source: string;                // 'medical-staff-system'（固定）
  accountLevel: number;          // 99（固定）
  notificationId: string;        // 一意のID
}
```

### 4.2 サンプルリクエスト（成功通知）

```json
{
  "type": "success",
  "title": "✅ 職員カルテ分析データ送信完了",
  "message": "期間: 2025-09-30 〜 2025-10-07\n総投稿数: 342件",
  "details": {
    "period": {
      "startDate": "2025-09-30",
      "endDate": "2025-10-07"
    },
    "summary": {
      "totalPosts": 342,
      "totalUsers": 89,
      "participationRate": "74.2%"
    },
    "sentiment": {
      "positive": 172,
      "neutral": 126,
      "negative": 39,
      "confidence": 0.85
    },
    "topics": {
      "topKeywords": "業務改善, シフト調整, 患者対応",
      "emergingTopicsCount": 1
    },
    "performance": {
      "processingTime": "0.07秒",
      "rateLimit": {
        "remaining": 97,
        "limit": 100
      }
    }
  },
  "timestamp": 1728450000,
  "source": "medical-staff-system",
  "accountLevel": 99,
  "notificationId": "analytics-1728450000-abc123xyz"
}
```

### 4.3 サンプルリクエスト（エラー通知）

```json
{
  "type": "error",
  "title": "❌ 職員カルテ分析データ送信失敗",
  "message": "エラーが発生しました。至急ご対応ください。\nエラー内容: VoiceDriveサーバーに接続できません",
  "details": {
    "error": {
      "message": "VoiceDriveサーバーに接続できません",
      "stack": "Error: connect ECONNREFUSED 127.0.0.1:4000\n    at ...",
      "timestamp": "2025-10-07T14:19:13.950Z"
    },
    "performance": {
      "processingTime": "0.05秒",
      "failedAt": "2025-10-07T14:19:13.950Z"
    },
    "actionRequired": "管理者による対応が必要です。ログファイルを確認してください。"
  },
  "timestamp": 1728450000,
  "source": "medical-staff-system",
  "accountLevel": 99,
  "notificationId": "analytics-1728450000-def456uvw"
}
```

---

## 5. レスポンスフォーマット

### 5.1 成功レスポンス

**ステータスコード**: `200 OK`

```json
{
  "success": true,
  "message": "通知を受信しました",
  "notificationId": "analytics-1728450000-abc123xyz",
  "receivedAt": "2025-10-07T14:19:13.950Z"
}
```

### 5.2 エラーレスポンス

**ステータスコード**: `400 Bad Request` / `401 Unauthorized` / `403 Forbidden` / `500 Internal Server Error`

```json
{
  "success": false,
  "error": {
    "code": "INVALID_SIGNATURE",
    "message": "HMAC署名が無効です",
    "details": "署名検証に失敗しました"
  }
}
```

---

## 6. 認証・セキュリティ

### 6.1 HMAC-SHA256署名

#### 署名生成方法（職員カルテシステム側）

```typescript
import crypto from 'crypto';

function createHmacSignature(data: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('hex');
}

// 使用例
const payload = JSON.stringify(notificationRequest);
const signature = createHmacSignature(payload, HMAC_SECRET);

// ヘッダーに設定
headers['X-Signature'] = signature;
headers['X-Timestamp'] = Math.floor(Date.now() / 1000).toString();
```

#### 署名検証方法（VoiceDrive側実装依頼）

```typescript
// VoiceDrive側で実装していただきたい検証ロジック
function verifyHmacSignature(
  payload: string,
  receivedSignature: string,
  timestamp: string,
  secret: string
): boolean {
  // 1. タイムスタンプ検証（±5分以内）
  const now = Math.floor(Date.now() / 1000);
  const requestTime = parseInt(timestamp, 10);
  if (Math.abs(now - requestTime) > 300) { // 5分 = 300秒
    return false; // タイムスタンプが古すぎる/未来すぎる
  }

  // 2. HMAC署名検証
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return expectedSignature === receivedSignature;
}
```

### 6.2 HMAC Secret共有方法

**推奨方法**: 1Password共有Vault

```
Vault名: VoiceDrive-Medical-System-Integration
項目名: Analytics Notification HMAC Secret
値: [32文字以上のランダム文字列]
```

### 6.3 リプレイ攻撃対策

- タイムスタンプ検証（±5分以内）
- 処理済みnotificationIdの記録（オプション）

---

## 7. 通知データモデル

### 7.1 通知タイプ

```typescript
type NotificationType = 'success' | 'error' | 'warning' | 'info';
```

| タイプ | 説明 | 使用例 |
|--------|------|--------|
| `success` | 成功通知 | バッチ処理完了、データ送信成功 |
| `error` | エラー通知 | バッチ処理失敗、API接続エラー |
| `warning` | 警告通知 | K-匿名性違反、レート制限接近 |
| `info` | 情報通知 | システムメンテナンス、バージョンアップ |

### 7.2 Details構造（成功通知）

```typescript
interface SuccessNotificationDetails {
  period?: {
    startDate: string;  // YYYY-MM-DD
    endDate: string;    // YYYY-MM-DD
  };
  summary?: {
    totalPosts: number;
    totalUsers: number;
    participationRate: string;
  };
  sentiment?: {
    positive: number;
    neutral: number;
    negative: number;
    confidence: number; // 0.0-1.0
  };
  topics?: {
    topKeywords: string;         // カンマ区切り
    emergingTopicsCount: number;
  };
  performance?: {
    processingTime: string;
    rateLimit?: {
      remaining: number;
      limit: number;
    };
  };
}
```

### 7.3 Details構造（エラー通知）

```typescript
interface ErrorNotificationDetails {
  error: {
    message: string;
    stack?: string;
    timestamp: string; // ISO 8601
  };
  performance: {
    processingTime: string;
    failedAt: string; // ISO 8601
  };
  actionRequired?: string;
}
```

---

## 8. エラーハンドリング

### 8.1 エラーコード

| コード | HTTPステータス | 説明 | 対処方法 |
|--------|--------------|------|---------|
| `INVALID_SIGNATURE` | 401 | HMAC署名が無効 | 署名生成ロジック確認 |
| `EXPIRED_TIMESTAMP` | 401 | タイムスタンプが古すぎる/未来すぎる | システム時刻確認 |
| `INVALID_PAYLOAD` | 400 | ペイロード形式が不正 | JSONバリデーション確認 |
| `INVALID_ACCOUNT_LEVEL` | 403 | accountLevelが99以外 | accountLevel=99固定 |
| `INTERNAL_ERROR` | 500 | VoiceDrive内部エラー | VoiceDrive側調査 |

### 8.2 リトライポリシー（職員カルテシステム側）

```typescript
// エラー時のリトライロジック
async function sendNotificationWithRetry(
  data: NotificationData,
  maxRetries: number = 3
): Promise<NotificationResponse> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await sendVoiceDriveNotification('error', data);
      if (response.success) {
        return response;
      }
      lastError = new Error(response.error || 'Unknown error');
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // 次回リトライまで待機（指数バックオフ）
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }

  // 最終的に失敗した場合はログに記録
  console.error('[VoiceDriveNotifier] Failed after retries:', lastError);
  return { success: false, error: lastError?.message };
}
```

---

## 9. 実装例

### 9.1 VoiceDrive側実装例（参考）

```typescript
// VoiceDrive側で実装していただきたいWebhookエンドポイント
import express from 'express';
import crypto from 'crypto';

const router = express.Router();

// HMAC Secret（環境変数から取得）
const HMAC_SECRET = process.env.ANALYTICS_NOTIFICATION_HMAC_SECRET || '';

// 署名検証関数
function verifyHmacSignature(
  payload: string,
  receivedSignature: string,
  timestamp: string,
  secret: string
): boolean {
  // タイムスタンプ検証（±5分以内）
  const now = Math.floor(Date.now() / 1000);
  const requestTime = parseInt(timestamp, 10);
  if (Math.abs(now - requestTime) > 300) {
    return false;
  }

  // HMAC署名検証
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return expectedSignature === receivedSignature;
}

// 通知Webhookエンドポイント
router.post('/api/webhook/analytics-notification', async (req, res) => {
  try {
    // 1. ヘッダー取得
    const signature = req.headers['x-signature'] as string;
    const timestamp = req.headers['x-timestamp'] as string;
    const payload = JSON.stringify(req.body);

    // 2. 署名検証
    if (!verifyHmacSignature(payload, signature, timestamp, HMAC_SECRET)) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_SIGNATURE',
          message: 'HMAC署名が無効です'
        }
      });
    }

    // 3. ペイロード検証
    const notification = req.body;
    if (notification.accountLevel !== 99) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'INVALID_ACCOUNT_LEVEL',
          message: 'accountLevelが99ではありません'
        }
      });
    }

    // 4. アカウントレベル99のユーザーに通知
    await notifyAccountLevel99Users({
      type: notification.type,
      title: notification.title,
      message: notification.message,
      details: notification.details,
      timestamp: new Date(notification.timestamp * 1000),
      notificationId: notification.notificationId
    });

    // 5. 成功レスポンス
    res.status(200).json({
      success: true,
      message: '通知を受信しました',
      notificationId: notification.notificationId,
      receivedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Analytics Notification] Error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '内部エラーが発生しました'
      }
    });
  }
});

// アカウントレベル99ユーザーへの通知関数（実装例）
async function notifyAccountLevel99Users(notification: any): Promise<void> {
  // VoiceDriveの通知システムを使用して、アカウントレベル99ユーザーに通知
  // 実装方法はVoiceDrive側の通知システムに依存

  // 例:
  // - データベースに通知レコード作成
  // - WebSocket/SSEで即座に配信
  // - メール/SMS送信（オプション）

  console.log('[Analytics Notification] Notifying account level 99 users:', notification);
}

export default router;
```

### 9.2 通知表示UI（実装イメージ）

```typescript
// VoiceDrive側のUI実装イメージ
interface NotificationUI {
  icon: '✅' | '❌' | '⚠️' | 'ℹ️';
  title: string;
  message: string;
  timestamp: Date;
  details?: Record<string, any>;
  isRead: boolean;
  notificationId: string;
}

// 成功通知の表示例
<NotificationCard type="success">
  <Icon>✅</Icon>
  <Title>職員カルテ分析データ送信完了</Title>
  <Message>
    期間: 2025-09-30 〜 2025-10-07
    総投稿数: 342件
  </Message>
  <Timestamp>2025-10-07 14:19</Timestamp>
  <DetailsButton onClick={showDetails}>詳細を見る</DetailsButton>
</NotificationCard>

// エラー通知の表示例
<NotificationCard type="error" priority="high">
  <Icon>❌</Icon>
  <Title>職員カルテ分析データ送信失敗</Title>
  <Message>
    エラーが発生しました。至急ご対応ください。
    エラー内容: VoiceDriveサーバーに接続できません
  </Message>
  <Timestamp>2025-10-07 14:19</Timestamp>
  <ActionButton onClick={checkLogs}>ログを確認</ActionButton>
</NotificationCard>
```

---

## 10. テスト項目

### 10.1 単体テスト

| No | テスト項目 | 期待結果 |
|----|----------|---------|
| 1 | 正常な成功通知 | 200 OK、通知受信成功 |
| 2 | 正常なエラー通知 | 200 OK、通知受信成功 |
| 3 | 正常な警告通知 | 200 OK、通知受信成功 |
| 4 | 正常な情報通知 | 200 OK、通知受信成功 |
| 5 | 不正なHMAC署名 | 401 Unauthorized |
| 6 | 古いタイムスタンプ（6分前） | 401 Unauthorized |
| 7 | 未来のタイムスタンプ（6分後） | 401 Unauthorized |
| 8 | accountLevel != 99 | 403 Forbidden |
| 9 | 不正なJSON形式 | 400 Bad Request |

### 10.2 統合テスト

| No | テスト項目 | 期待結果 |
|----|----------|---------|
| 1 | バッチ処理成功→通知送信 | 通知がアカウントレベル99ユーザーに表示される |
| 2 | バッチ処理失敗→通知送信 | エラー通知がアカウントレベル99ユーザーに表示される |
| 3 | 通知送信リトライ（1回目失敗） | 2回目で成功、通知が表示される |
| 4 | 複数通知の連続送信 | 全て正常に受信、表示される |

### 10.3 性能テスト

| No | テスト項目 | 期待結果 |
|----|----------|---------|
| 1 | 通知送信レスポンスタイム | 500ms以内 |
| 2 | 同時10件通知送信 | 全て正常処理 |
| 3 | 1日1000件通知（負荷想定） | 全て正常処理 |

---

## 11. 運用・監視

### 11.1 ログ出力

```typescript
// VoiceDrive側でログ出力していただきたい項目
interface NotificationLog {
  timestamp: string;
  notificationId: string;
  type: 'success' | 'error' | 'warning' | 'info';
  source: string;
  receivedAt: string;
  processingTime: number; // ms
  success: boolean;
  errorMessage?: string;
}

// ログ出力例
console.log('[Analytics Notification]', {
  timestamp: '2025-10-07T14:19:13.950Z',
  notificationId: 'analytics-1728450000-abc123xyz',
  type: 'success',
  source: 'medical-staff-system',
  receivedAt: '2025-10-07T14:19:13.950Z',
  processingTime: 45,
  success: true
});
```

### 11.2 メトリクス監視

| メトリクス | 監視項目 | アラート条件 |
|-----------|---------|------------|
| **受信成功率** | 成功/失敗の割合 | 成功率 < 95% |
| **レスポンスタイム** | 平均処理時間 | 平均 > 1秒 |
| **エラー率** | エラー通知の割合 | エラー率 > 10% |
| **署名検証失敗** | 不正な署名の検出 | 1件でも発生 |

### 11.3 定期確認

- 毎日02:30: 成功通知が届いているか確認
- 毎週月曜: ログファイルレビュー
- 毎月1日: メトリクスレビュー

---

## 📞 連絡先

**医療システムチーム**:
- 技術担当: [メールアドレス]
- Slack: #voicedrive-integration

**実装に関するご質問・ご相談**:
- この仕様書に関するご質問
- 実装時の技術的相談
- テスト環境の準備

お気軽にご連絡ください。

---

## 📋 変更履歴

| バージョン | 日付 | 変更内容 |
|-----------|------|---------|
| 1.0.0 | 2025-10-09 | 初版作成 |

---

## ✅ 確認事項

VoiceDriveチームへの確認・依頼事項：

- [ ] HMAC Secret の共有方法確認（1Password推奨）
- [ ] エンドポイントURL確認（本番環境）
- [ ] 実装予定スケジュール確認
- [ ] アカウントレベル99への通知表示UI確認
- [ ] テスト環境の準備
- [ ] 統合テストの実施日程調整

---

**発信者**: 医療システムチーム
**作成日**: 2025年10月9日
**ステータス**: VoiceDriveチーム実装待ち
