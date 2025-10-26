# SystemMonitorPage 医療システム確認結果報告書

**文書番号**: MED-CONF-2025-1026-001
**作成日**: 2025年10月26日
**作成者**: ClaudeCode（医療システムチーム）
**件名**: SystemMonitorPageEnhanced Phase 2.5要件の医療システム側確認結果

---

## 📋 エグゼクティブサマリー

VoiceDriveチームからの「SystemMonitorPage - 暫定マスターリスト」（SMP-MASTER-2025-1026-001）に対する回答です。
Phase 2（VoiceDrive単独実装）は完了済みですが、**Phase 2.5（医療システム連携強化）** では医療システム側で新規API実装が必要となります。

### 結論
- ✅ **Phase 2完了**: VoiceDrive側で実装済み（Webhook受信監視・データ同期監視）
- ⚠️ **Phase 2.5必要API（医療システム側）**: 3件のAPI実装が必要
  - API 1: Webhook送信統計取得API（**優先度: 高**）
  - API 2: 面談実施統計取得API（**優先度: 中**）
  - API 3: 統合セキュリティイベントAPI（**優先度: 低** - オプション）

### 推定実装時間
- **API 1（Webhook送信統計）**: 2日（16時間） - DB設計含む
- **API 2（面談実施統計）**: 1.5日（12時間）
- **API 3（セキュリティイベント）**: 1日（8時間） - オプション
- **合計（API 1+2）**: 3.5日（28時間）
- **合計（全API）**: 4.5日（36時間）

---

## 🎯 VoiceDrive Phase 2完了状況の確認

### Phase 2で実装済み（VoiceDrive側）
VoiceDriveチームが実装完了したシステム監視機能：

#### ✅ データベース
- `WebhookLog`テーブル - Webhook受信履歴を記録
  - イベントタイプ、受信時刻、処理時間、エラー情報等を記録
  - 署名検証結果、重複検出、リトライ回数も記録

#### ✅ API
- `GET /api/integration/metrics` - 連携監視メトリクス取得
- `GET /api/integration/health` - 連携健全性チェック

#### ✅ フロントエンド
- SystemMonitorPageに「医療システム連携」タブ追加
- Webhook受信統計表示（24時間）
- データ同期統計表示（職員写真同期率）
- 接続性ステータス表示（healthy/warning/critical）

### Phase 2の監視項目（20項目）

| カテゴリ | 監視項目 | データソース |
|---------|---------|------------|
| **連携健全性** | Webhookエンドポイントステータス | VoiceDrive WebhookLog |
| | 最終Webhook受信時刻 | VoiceDrive WebhookLog |
| | エラー率トレンド | VoiceDrive WebhookLog |
| **Webhook受信統計** | 総受信数（24時間） | VoiceDrive WebhookLog |
| | 署名検証失敗数 | VoiceDrive WebhookLog |
| | 処理エラー数 | VoiceDrive WebhookLog |
| | 重複イベント数 | VoiceDrive WebhookLog |
| | イベントタイプ別統計 | VoiceDrive WebhookLog |
| **データ同期統計** | 総職員数 | VoiceDrive User |
| | 写真URL保有ユーザー数 | VoiceDrive User |
| | 写真同期率 | VoiceDrive User |
| | 24時間以内の同期数 | VoiceDrive User |
| | 同期エラー数 | VoiceDrive User |

**Phase 2の特徴**:
- ✅ **VoiceDrive単独**で実装可能（医療システム側の対応不要）
- ✅ Webhook受信側の監視（VoiceDriveが受信したデータの監視）
- ✅ データ同期結果の監視（VoiceDrive User テーブルの統計）

---

## ⚠️ Phase 2.5で医療システム側の対応が必要な項目

### 背景
Phase 2では「VoiceDriveが受信したデータ」を監視できますが、以下の問題があります：

1. **送信vs受信の差分検出不可**: 医療システムが送信したWebhookがVoiceDriveに到達しているか不明
2. **データ欠損の早期検出不可**: ネットワーク障害等で欠損しても気づけない
3. **面談実施率の監視不可**: VoiceDriveで予約された面談が実際に実施されたか不明
4. **双方向の健全性確認不可**: 医療システム側の送信状況が不明

### Phase 2.5の目的
- 医療システム側の送信統計を取得
- 送信数 vs 受信数の比較で**データ欠損を検出**
- リトライ状況の監視
- 面談実施率の監視

---

## 📝 必要なAPI実装（医療システム側）

### API 1: Webhook送信統計取得API（優先度: 高）

#### エンドポイント
```
GET /api/integration/webhook-stats
```

#### 認証
```
Authorization: Bearer {voicedrive_api_token}
X-VoiceDrive-System-ID: voicedrive-v100
```

#### レスポンス仕様
```typescript
{
  sent24h: number;                // 送信総数（24時間）
  succeeded: number;              // 成功数
  failed: number;                 // 失敗数
  retried: number;                // リトライ発生数
  lastSentAt: string;             // ISO 8601
  byEventType: {
    "employee.created": {
      sent: number;
      succeeded: number;
      failed: number;
      avgProcessingTime: number;  // 医療システム側の送信処理時間（ms）
    };
    "employee.photo.updated": {
      sent: number;
      succeeded: number;
      failed: number;
      avgProcessingTime: number;
    };
    "employee.photo.deleted": {
      sent: number;
      succeeded: number;
      failed: number;
      avgProcessingTime: number;
    };
  };
  queueStatus: {
    pending: number;              // 送信待ち
    processing: number;           // 送信中
    failed: number;               // 失敗（リトライ上限超過）
  };
  retryPolicy: {
    maxRetries: number;           // 最大リトライ回数（例: 3）
    retryIntervals: number[];     // リトライ間隔（秒）例: [60, 300, 1800]
    currentRetrying: number;      // 現在リトライ中の数
  };
}
```

#### 実装要件

##### 1. Webhook送信ログテーブルの追加
**テーブル名**: `webhook_send_logs`

```sql
CREATE TABLE webhook_send_logs (
  id VARCHAR(50) PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL,              -- employee.created, employee.photo.updated, employee.photo.deleted
  event_timestamp TIMESTAMP NOT NULL,            -- イベント発生時刻
  sent_at TIMESTAMP NOT NULL,                    -- 送信時刻
  staff_id VARCHAR(50) NOT NULL,                 -- 対象職員ID
  request_id VARCHAR(100) UNIQUE,                -- X-Request-ID（重複送信防止用）
  payload_size INT NOT NULL,                     -- ペイロードサイズ（バイト）
  status VARCHAR(20) NOT NULL,                   -- success, failed, retrying
  http_status_code INT,                          -- HTTPステータスコード
  processing_time INT NOT NULL,                  -- 送信処理時間（ミリ秒）
  error_message TEXT,                            -- エラーメッセージ
  retry_count INT DEFAULT 0,                     -- リトライ回数
  last_retry_at TIMESTAMP,                       -- 最終リトライ時刻
  response_body TEXT,                            -- VoiceDriveからのレスポンス
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_event_type (event_type),
  INDEX idx_sent_at (sent_at),
  INDEX idx_status (status),
  INDEX idx_staff_id (staff_id),
  INDEX idx_event_type_sent_at (event_type, sent_at),
  INDEX idx_status_sent_at (status, sent_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

##### 2. Webhookリトライキューテーブルの追加
**テーブル名**: `webhook_retry_queue`

```sql
CREATE TABLE webhook_retry_queue (
  id VARCHAR(50) PRIMARY KEY,
  webhook_log_id VARCHAR(50) NOT NULL,           -- webhook_send_logsのID
  retry_count INT NOT NULL,                      -- 現在のリトライ回数
  next_retry_at TIMESTAMP NOT NULL,              -- 次回リトライ予定時刻
  status VARCHAR(20) DEFAULT 'pending',          -- pending, processing, failed
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (webhook_log_id) REFERENCES webhook_send_logs(id),
  INDEX idx_next_retry (next_retry_at),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

##### 3. Webhook送信コードの修正
現在の医療システムのWebhook送信コードに、ログ記録処理を追加：

```typescript
// src/services/webhookService.ts (修正例)
async sendWebhook(eventType: string, staffId: string, payload: any) {
  const startTime = Date.now();
  const requestId = generateRequestId(); // UUID生成

  try {
    // Webhook送信
    const response = await axios.post(VOICEDRIVE_WEBHOOK_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Secret': computeSignature(payload),
        'X-Request-ID': requestId,
        'X-Event-Type': eventType,
      },
      timeout: 5000
    });

    const processingTime = Date.now() - startTime;

    // ✅ ログ記録（成功）
    await db.webhook_send_logs.create({
      id: generateId(),
      event_type: eventType,
      event_timestamp: new Date(),
      sent_at: new Date(),
      staff_id: staffId,
      request_id: requestId,
      payload_size: JSON.stringify(payload).length,
      status: 'success',
      http_status_code: response.status,
      processing_time: processingTime,
      response_body: JSON.stringify(response.data),
      retry_count: 0
    });

    return { success: true };

  } catch (error) {
    const processingTime = Date.now() - startTime;

    // ❌ ログ記録（失敗）
    const logId = await db.webhook_send_logs.create({
      id: generateId(),
      event_type: eventType,
      event_timestamp: new Date(),
      sent_at: new Date(),
      staff_id: staffId,
      request_id: requestId,
      payload_size: JSON.stringify(payload).length,
      status: 'failed',
      http_status_code: error.response?.status,
      processing_time: processingTime,
      error_message: error.message,
      retry_count: 0
    });

    // 🔄 リトライキューに追加
    await db.webhook_retry_queue.create({
      id: generateId(),
      webhook_log_id: logId,
      retry_count: 0,
      next_retry_at: new Date(Date.now() + 60 * 1000), // 1分後
      status: 'pending'
    });

    throw error;
  }
}
```

##### 4. API実装例
```typescript
// src/app/api/integration/webhook-stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  // 認証チェック
  const apiKey = request.headers.get('Authorization')?.replace('Bearer ', '');
  const systemId = request.headers.get('X-VoiceDrive-System-ID');

  if (apiKey !== process.env.VOICEDRIVE_API_TOKEN || systemId !== 'voicedrive-v100') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  // 総送信数
  const sent24h = await db.webhook_send_logs.count({
    where: { sent_at: { gte: twentyFourHoursAgo } }
  });

  // 成功数
  const succeeded = await db.webhook_send_logs.count({
    where: {
      sent_at: { gte: twentyFourHoursAgo },
      status: 'success'
    }
  });

  // 失敗数
  const failed = await db.webhook_send_logs.count({
    where: {
      sent_at: { gte: twentyFourHoursAgo },
      status: 'failed'
    }
  });

  // リトライ発生数
  const retried = await db.webhook_send_logs.count({
    where: {
      sent_at: { gte: twentyFourHoursAgo },
      retry_count: { gt: 0 }
    }
  });

  // イベントタイプ別統計
  const eventTypes = ['employee.created', 'employee.photo.updated', 'employee.photo.deleted'];
  const byEventType: any = {};

  for (const eventType of eventTypes) {
    const logs = await db.webhook_send_logs.findMany({
      where: {
        sent_at: { gte: twentyFourHoursAgo },
        event_type: eventType
      }
    });

    byEventType[eventType] = {
      sent: logs.length,
      succeeded: logs.filter(l => l.status === 'success').length,
      failed: logs.filter(l => l.status === 'failed').length,
      avgProcessingTime: logs.reduce((sum, l) => sum + l.processing_time, 0) / logs.length || 0
    };
  }

  // キュー状況
  const queueStatus = {
    pending: await db.webhook_retry_queue.count({ where: { status: 'pending' } }),
    processing: await db.webhook_retry_queue.count({ where: { status: 'processing' } }),
    failed: await db.webhook_retry_queue.count({ where: { status: 'failed' } })
  };

  // 最終送信時刻
  const lastLog = await db.webhook_send_logs.findFirst({
    orderBy: { sent_at: 'desc' }
  });

  return NextResponse.json({
    sent24h,
    succeeded,
    failed,
    retried,
    lastSentAt: lastLog?.sent_at?.toISOString() || null,
    byEventType,
    queueStatus,
    retryPolicy: {
      maxRetries: 3,
      retryIntervals: [60, 300, 1800], // 1分、5分、30分
      currentRetrying: queueStatus.processing
    }
  });
}
```

#### 実装チェックリスト
- [ ] `webhook_send_logs`テーブル作成
- [ ] `webhook_retry_queue`テーブル作成
- [ ] Webhook送信コードにログ記録処理を追加
- [ ] リトライ機構の実装
- [ ] `GET /api/integration/webhook-stats` API実装
- [ ] 認証・認可実装（Bearer Token + System ID）
- [ ] レート制限設定（100 req/min）
- [ ] 単体テスト作成
- [ ] API仕様書作成

---

### API 2: 面談実施統計取得API（優先度: 中）

#### エンドポイント
```
GET /api/interviews/completion-stats
```

#### 認証
```
Authorization: Bearer {voicedrive_api_token}
```

#### レスポンス仕様
```typescript
{
  totalScheduled: number;         // VoiceDriveから受信した予約総数
  actuallyCompleted: number;      // 実際に実施された数
  completionRate: number;         // 実施率（%）
  noShowRate: number;             // 無断欠席率（%）
  rescheduledCount: number;       // 再予約数
  averageDuration: number;        // 平均所要時間（分）
  byInterviewType: {
    [type: string]: {
      scheduled: number;
      completed: number;
      completionRate: number;
      avgDuration: number;
    };
  };
  recentNoShows: Array<{
    interviewId: string;
    employeeId: string;
    scheduledDate: string;
    interviewType: string;
  }>;
}
```

#### 実装要件

##### 1. 医療システム側のInterviewテーブル構造確認
医療システムに面談実施記録テーブルが存在するか確認：

```sql
-- 想定されるテーブル構造
-- interviews または interview_records
SELECT * FROM interviews LIMIT 1;
```

**必要なフィールド**:
- `interview_id` - VoiceDriveから受信した予約ID（Webhook経由）
- `employee_id` - 職員ID
- `interview_type` - 面談タイプ
- `scheduled_date` - 予定日時
- `actual_start_time` - 実施開始時刻
- `actual_end_time` - 実施終了時刻
- `status` - 'completed', 'no_show', 'cancelled', 'rescheduled'
- `duration_minutes` - 所要時間
- `voicedrive_sync_id` - VoiceDriveの予約IDとの紐付け

##### 2. VoiceDrive予約との紐付け
VoiceDriveからの面談予約Webhookを受信時に、医療システム側のInterviewテーブルに登録：

```typescript
// Webhook受信時の処理例
// POST /api/webhooks/interview-scheduled
async function handleInterviewScheduled(payload: any) {
  await db.interviews.create({
    interview_id: generateId(),
    voicedrive_sync_id: payload.interviewId,  // VoiceDriveの予約ID
    employee_id: payload.employeeId,
    interview_type: payload.interviewType,
    scheduled_date: payload.scheduledDate,
    status: 'scheduled'  // 初期状態
  });
}

// 面談実施時の処理
async function completeInterview(interviewId: string, startTime: Date, endTime: Date) {
  const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 60000);

  await db.interviews.update({
    where: { interview_id: interviewId },
    data: {
      status: 'completed',
      actual_start_time: startTime,
      actual_end_time: endTime,
      duration_minutes: duration
    }
  });
}
```

##### 3. API実装例
```typescript
// src/app/api/interviews/completion-stats/route.ts
export async function GET(request: NextRequest) {
  // 認証チェック
  const apiKey = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (apiKey !== process.env.VOICEDRIVE_API_TOKEN) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  // VoiceDriveから受信した予約総数
  const totalScheduled = await db.interviews.count({
    where: {
      voicedrive_sync_id: { not: null }  // VoiceDriveからの予約のみ
    }
  });

  // 実施完了数
  const actuallyCompleted = await db.interviews.count({
    where: {
      voicedrive_sync_id: { not: null },
      status: 'completed'
    }
  });

  // 無断欠席数
  const noShows = await db.interviews.count({
    where: {
      voicedrive_sync_id: { not: null },
      status: 'no_show'
    }
  });

  // 再予約数
  const rescheduled = await db.interviews.count({
    where: {
      voicedrive_sync_id: { not: null },
      status: 'rescheduled'
    }
  });

  // 平均所要時間
  const completedInterviews = await db.interviews.findMany({
    where: {
      voicedrive_sync_id: { not: null },
      status: 'completed',
      duration_minutes: { not: null }
    },
    select: { duration_minutes: true }
  });

  const averageDuration = completedInterviews.length > 0
    ? completedInterviews.reduce((sum, i) => sum + i.duration_minutes, 0) / completedInterviews.length
    : 0;

  // 面談タイプ別統計
  const interviewTypes = await db.interviews.groupBy({
    by: ['interview_type'],
    where: { voicedrive_sync_id: { not: null } },
    _count: true
  });

  const byInterviewType: any = {};
  for (const type of interviewTypes) {
    const scheduled = type._count;
    const completed = await db.interviews.count({
      where: {
        voicedrive_sync_id: { not: null },
        interview_type: type.interview_type,
        status: 'completed'
      }
    });

    byInterviewType[type.interview_type] = {
      scheduled,
      completed,
      completionRate: (completed / scheduled) * 100,
      avgDuration: 0  // TODO: 計算
    };
  }

  // 最近の無断欠席（最新5件）
  const recentNoShows = await db.interviews.findMany({
    where: {
      voicedrive_sync_id: { not: null },
      status: 'no_show'
    },
    orderBy: { scheduled_date: 'desc' },
    take: 5,
    select: {
      interview_id: true,
      employee_id: true,
      scheduled_date: true,
      interview_type: true
    }
  });

  return NextResponse.json({
    totalScheduled,
    actuallyCompleted,
    completionRate: (actuallyCompleted / totalScheduled) * 100,
    noShowRate: (noShows / totalScheduled) * 100,
    rescheduledCount: rescheduled,
    averageDuration,
    byInterviewType,
    recentNoShows: recentNoShows.map(i => ({
      interviewId: i.interview_id,
      employeeId: i.employee_id,
      scheduledDate: i.scheduled_date.toISOString(),
      interviewType: i.interview_type
    }))
  });
}
```

#### 実装チェックリスト
- [ ] Interviewテーブルに`voicedrive_sync_id`フィールド追加
- [ ] VoiceDrive予約Webhook受信処理の実装
- [ ] 面談実施記録の更新処理実装
- [ ] `GET /api/interviews/completion-stats` API実装
- [ ] 認証・認可実装
- [ ] 単体テスト作成
- [ ] API仕様書作成

---

### API 3: 統合セキュリティイベントAPI（優先度: 低 - オプション）

#### エンドポイント
```
GET /api/security/events/recent
```

#### クエリパラメータ
```
?limit=50
&severity=high,critical
&since=2025-10-26T00:00:00Z
```

#### レスポンス仕様
```typescript
{
  events: Array<{
    eventId: string;
    timestamp: string;
    eventType: string;            // 例: "PERMISSION_ESCALATION", "UNAUTHORIZED_ACCESS"
    severity: 'low' | 'medium' | 'high' | 'critical';
    source: 'medical-system' | 'voicedrive';
    description: string;
    affectedUserId?: string;
    affectedEmployeeId?: string;
    ipAddress?: string;
    action: string;
    result: 'success' | 'blocked' | 'failed';
  }>;
  summary: {
    total24h: number;
    bySeverity: {
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
    bySource: {
      medicalSystem: number;
      voicedrive: number;
    };
  };
}
```

#### 実装要件
この機能は**オプション**です。医療システム側にセキュリティイベントログがある場合に実装します。

- [ ] セキュリティイベントログテーブルの確認
- [ ] VoiceDriveへの通知が必要なイベントの定義
- [ ] API実装
- [ ] 認証・認可実装

---

## 📊 実装可能性サマリー

### API 1: Webhook送信統計取得API
**実装可能性**: ⚠️ **新規テーブル追加が必要**

| 機能 | 状態 | 備考 |
|------|------|------|
| Webhook送信ログ記録 | ❌ 未実装 | webhook_send_logsテーブル追加 |
| リトライキュー管理 | ❌ 未実装 | webhook_retry_queueテーブル追加 |
| 送信統計集計 | ✅ 実装可能 | SQL集計ロジック |
| イベントタイプ別統計 | ✅ 実装可能 | GROUP BYで集計 |

**推定実装時間**: 2日（16時間）
- テーブル設計・作成: 4時間
- Webhook送信コード修正: 4時間
- API実装: 4時間
- テスト: 4時間

---

### API 2: 面談実施統計取得API
**実装可能性**: ⚠️ **VoiceDrive予約との紐付けが必要**

| 機能 | 状態 | 備考 |
|------|------|------|
| 面談実施記録 | ✅ 存在 | Interviewテーブル |
| VoiceDrive予約との紐付け | ❌ 未実装 | voicedrive_sync_idフィールド追加 |
| 実施率計算 | ✅ 実装可能 | SQL集計ロジック |
| 無断欠席検出 | ✅ 実装可能 | statusフィールド |

**推定実装時間**: 1.5日（12時間）
- テーブル修正: 2時間
- Webhook受信処理: 4時間
- API実装: 4時間
- テスト: 2時間

---

### API 3: 統合セキュリティイベントAPI
**実装可能性**: ❓ **オプション（優先度低）**

| 機能 | 状態 | 備考 |
|------|------|------|
| セキュリティイベントログ | ❓ 未確認 | audit_logsテーブルの確認が必要 |
| イベント統合 | ❌ 未実装 | 新規実装 |

**推定実装時間**: 1日（8時間）

---

## 🔧 必要な対応事項

### 即座に対応可能（Phase 2.5 - 推奨）

#### 1. API 1実装（Webhook送信統計取得API）- 優先度: 高
- [ ] `webhook_send_logs`テーブル作成
- [ ] `webhook_retry_queue`テーブル作成
- [ ] Webhook送信コードにログ記録処理を追加
- [ ] リトライ機構実装
- [ ] `GET /api/integration/webhook-stats` API実装
- [ ] 認証・認可実装
- [ ] 単体テスト作成（カバレッジ80%以上）
- [ ] API仕様書作成

**推定工数**: 2日（16時間）

---

#### 2. API 2実装（面談実施統計取得API）- 優先度: 中
- [ ] `interviews`テーブルに`voicedrive_sync_id`フィールド追加
- [ ] VoiceDrive予約Webhook受信処理実装
- [ ] 面談実施記録の更新処理実装
- [ ] `GET /api/interviews/completion-stats` API実装
- [ ] 認証・認可実装
- [ ] 単体テスト作成
- [ ] API仕様書作成

**推定工数**: 1.5日（12時間）

---

### 将来対応検討（低優先度）

#### 3. API 3実装（統合セキュリティイベントAPI）- オプション
- [ ] セキュリティイベントログテーブルの確認
- [ ] イベント定義の策定
- [ ] API実装
- [ ] 認証・認可実装

**推定工数**: 1日（8時間）

---

## 📅 実装スケジュール（提案）

### Phase 2.5: 双方向連携強化（1週間）
**期間**: 2025年11月1日（金）〜 11月8日（金）

| 日付 | 作業内容 | 担当 | 状態 |
|------|---------|------|------|
| 11/1 (金) | API 1設計・テーブル作成 | 医療システム | ⏳ 待機中 |
| 11/4 (月) | API 1実装（Webhook送信ログ記録） | 医療システム | ⏳ 待機中 |
| 11/5 (火) | API 1実装（統計API） | 医療システム | ⏳ 待機中 |
| 11/6 (水) | API 2実装（面談実施統計） | 医療システム | ⏳ 待機中 |
| 11/7 (木) | 単体テスト作成・実行 | 医療システム | ⏳ 待機中 |
| 11/8 (金) | VoiceDriveチームとの統合テスト | 両チーム | ⏳ 待機中 |

---

## ✅ VoiceDriveチームへの回答まとめ

### Phase 2完了状況
**回答**: ✅ **VoiceDrive側で実装完了**

- ✅ `WebhookLog`テーブル追加済み
- ✅ Webhook受信統計の表示機能実装済み
- ✅ データ同期統計の表示機能実装済み
- ✅ 接続性ステータス表示実装済み

### Phase 2.5で必要な医療システム側API
**回答**: ⚠️ **3件のAPI実装が必要（2件推奨、1件オプション）**

#### API 1: Webhook送信統計取得API（優先度: 高）
- ⚠️ **新規実装必要**
- 📊 `webhook_send_logs`テーブル追加
- 📊 `webhook_retry_queue`テーブル追加
- 🔄 Webhook送信コードの修正
- ⏱️ 推定工数: 2日（16時間）

#### API 2: 面談実施統計取得API（優先度: 中）
- ⚠️ **一部実装必要**
- 📊 `interviews`テーブルに`voicedrive_sync_id`追加
- 🔄 VoiceDrive予約Webhook受信処理
- ⏱️ 推定工数: 1.5日（12時間）

#### API 3: 統合セキュリティイベントAPI（優先度: 低）
- ❓ **オプション機能**
- ⏱️ 推定工数: 1日（8時間）

---

## 📞 次のステップ

### 医療システムチームの対応
1. **本報告書のレビュー** - VoiceDriveチームに送付
2. **Phase 2.5実装の優先度判断** - API 1+2を実装するか決定
3. **実装スケジュールの調整** - VoiceDriveチームと協議
4. **キックオフミーティング** - 実装開始前の最終確認

### VoiceDriveチームへの確認事項
1. **Phase 2.5の必要性** - 送信vs受信差分検出は必須機能か？
2. **優先順位の確認** - API 1のみ先行実装でもOKか？
3. **統合テスト日程** - 実装完了後のテスト日程調整
4. **API仕様の最終承認** - レスポンス構造の確認

---

## 🔗 関連ドキュメント

1. [SystemMonitorPage - 暫定マスターリスト (VoiceDrive提供)](./SystemMonitorPage_暫定マスターリスト_20251026.md) - VoiceDriveからの要件定義
2. [organization-analytics_医療システム確認結果_20251010.md](./organization-analytics_医療システム確認結果_20251010.md) - 組織分析ページAPI実装時の参考資料
3. [共通DB構築後_作業再開指示書_20250928.md](../../docs/共通DB構築後_作業再開指示書_20250928.md) - 医療システム全体マスタープラン

---

**文書終了**

最終更新: 2025年10月26日
バージョン: 1.0
承認: 未承認（VoiceDriveチームレビュー待ち）
次回レビュー: VoiceDriveチームからのフィードバック受領後
