# アカウント無効化機能 連携要件確認書

**文書番号**: RES-2025-1010-001
**作成日**: 2025年10月10日
**送信元**: VoiceDriveチーム（職員カルテシステム）
**送信先**: 医療職員管理システムチーム
**件名**: アカウント緊急無効化機能の連携要件確認と実装依頼

---

## 📋 エグゼクティブサマリー

VoiceDriveチームでは、医療職員管理システム障害時の応急措置として**アカウント緊急無効化機能**を実装中です。この機能は人事部門（レベル14-17）専用であり、監査要件を満たすため医療システムとの連携が必須となります。

本文書では、医療システムチームへの以下を依頼・確認いたします：

### ✅ VoiceDrive側で対応済み・対応予定
- **DB実装移行**: LocalStorageからPrisma DBへの移行（Phase 1: 2-3日）
- **テーブル追加**: EmergencyDeactivation、StaffSystemSyncQueue（設計完了）
- **Webhook送信実装**: VoiceDrive → 医療システム（Phase 2: 3-5日）
- **Webhook受信実装**: 医療システム → VoiceDrive（Phase 2: 3-5日）
- **自動同期機能**: ヘルスチェック + キュー処理（Phase 3: 2-3日）

### ❓ 医療システムチームへの依頼・確認事項

#### 🔴 **必須依頼事項（3件）**
1. **Webhook受信エンドポイント実装**（1件）
2. **Webhook送信機能実装**（1件）
3. **ヘルスチェックAPI実装**（1件）

#### ❓ **確認事項（3件）**
1. アカウント無効化の処理方針
2. Webhookリトライポリシー
3. セキュリティ（HMAC署名）

---

## 🎯 プロジェクト背景

### 機能の目的
**アカウント緊急無効化機能**は、医療職員管理システム障害時に人事部門が緊急対応としてアカウントを即座に停止できる機能です。

### 利用シーン例
1. **退職者のアカウント即時停止**: 医療システム障害中に退職者が発生した場合
2. **セキュリティインシデント対応**: 不正アクセスの疑いがある場合
3. **コンプライアンス対応**: 懲戒処分等で即座にアクセスを遮断する必要がある場合

### 権限制限
- **レベル14-17**（人事部長、事務局長、理事、理事長）のみアクセス可能
- 全操作は監査ログに記録

### 現在の実装状況と課題

#### ✅ 実装済み
- 緊急停止UI（EmergencyAccountDeactivation.tsx）
- 権限チェック機能
- LocalStorageベースの仮実装

#### ❌ 未実装（本件の対象）
- DBへの永続化（LocalStorageからの移行）
- 医療システムへのWebhook通知
- 医療システムからの確認Webhook受信
- 自動同期機能（医療システム復旧後）

---

## 🔗 医療システムへの依頼内容

### 📌 依頼1: Webhook受信エンドポイント実装

#### 概要
VoiceDriveからアカウント緊急停止通知を受信するエンドポイントを実装していただきたい。

#### エンドポイント仕様

**URL**: `POST /api/webhooks/voicedrive-emergency-deactivation`

**認証**: HMAC-SHA256署名検証（詳細は後述）

**ペイロード例**:
```json
{
  "eventType": "account.emergency_deactivation",
  "timestamp": "2025-10-10T15:30:00Z",
  "deactivationId": "deact_abc123",
  "employeeId": "EMP2024001",
  "targetUserId": "user_level1_staff",
  "reason": "退職処理・医療システム障害中のため緊急停止",
  "executedBy": {
    "userId": "user_admin",
    "employeeId": "EMP2020001",
    "name": "人事部長",
    "permissionLevel": 15
  },
  "signature": "abc123..."
}
```

**フィールド説明**:
| フィールド | 型 | 説明 |
|-----------|------|------|
| `eventType` | string | 固定値: `"account.emergency_deactivation"` |
| `timestamp` | ISO 8601 | 停止実行日時（UTC） |
| `deactivationId` | string | VoiceDrive側の停止記録ID（トレーサビリティ用） |
| `employeeId` | string | 対象職員の職員コード（医療システムのキー） |
| `targetUserId` | string | VoiceDrive側のユーザーID（参考情報） |
| `reason` | string | 停止理由（監査用） |
| `executedBy.userId` | string | 実行者のVoiceDriveユーザーID |
| `executedBy.employeeId` | string | 実行者の職員コード |
| `executedBy.name` | string | 実行者の氏名 |
| `executedBy.permissionLevel` | number | 実行者の権限レベル（14-17） |
| `signature` | string | HMAC-SHA256署名（セキュリティ検証用） |

#### 期待される処理内容

医療システム側で以下の処理を実施していただきたい：

```typescript
// 医療システム: src/api/webhooks/voicedrive-emergency-deactivation.ts
export async function handleEmergencyDeactivation(payload) {
  // 1. 署名検証
  const isValid = verifyHMAC(payload, signature);
  if (!isValid) {
    return Response.json({ error: 'Invalid signature' }, { status: 401 });
  }

  // 2. Employee.accountStatus更新
  await prisma.employee.update({
    where: { employeeId: payload.employeeId },
    data: {
      accountStatus: 'inactive',
      lastModifiedBy: payload.executedBy.employeeId,
      lastModifiedAt: new Date()
    }
  });

  // 3. 履歴記録（推奨）
  await prisma.employeeAccountStatusHistory.create({
    data: {
      employeeId: payload.employeeId,
      previousStatus: 'active',
      newStatus: 'inactive',
      reason: payload.reason,
      changedBy: payload.executedBy.employeeId,
      changedByName: payload.executedBy.name,
      isEmergencyChange: true,
      sourceSystem: 'voicedrive',
      voiceDriveDeactivationId: payload.deactivationId
    }
  });

  // 4. 確認Webhookを送信（依頼2参照）
  await sendConfirmationWebhookToVoiceDrive({
    eventType: 'account.deactivation_confirmed',
    deactivationId: payload.deactivationId,
    employeeId: payload.employeeId,
    status: 'completed',
    medicalSystemConfirmedAt: new Date().toISOString()
  });

  return Response.json({ status: 'ok' });
}
```

#### レスポンス仕様

**成功時（200 OK）**:
```json
{
  "status": "ok",
  "timestamp": "2025-10-10T15:30:05Z"
}
```

**エラー時（401 Unauthorized）**:
```json
{
  "error": "Invalid signature",
  "timestamp": "2025-10-10T15:30:05Z"
}
```

**エラー時（500 Internal Server Error）**:
```json
{
  "error": "Database update failed",
  "details": "...",
  "timestamp": "2025-10-10T15:30:05Z"
}
```

#### VoiceDrive側の実装計画

VoiceDrive側では以下を実装します：

```typescript
// VoiceDrive: src/services/MedicalSystemWebhookService.ts
export async function sendEmergencyDeactivationNotification(
  deactivation: EmergencyDeactivation
) {
  const payload = {
    eventType: 'account.emergency_deactivation',
    timestamp: new Date().toISOString(),
    deactivationId: deactivation.id,
    employeeId: deactivation.targetEmployeeId,
    targetUserId: deactivation.targetUserId,
    reason: deactivation.reason,
    executedBy: {
      userId: deactivation.executedBy,
      employeeId: deactivation.executorEmployeeId,
      name: deactivation.executorName,
      permissionLevel: deactivation.executorLevel
    }
  };

  const signature = generateHMAC(payload, process.env.MEDICAL_SYSTEM_WEBHOOK_SECRET);

  const response = await fetch('https://medical-system.local/api/webhooks/voicedrive-emergency-deactivation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-VoiceDrive-Signature': signature
    },
    body: JSON.stringify(payload),
    timeout: 30000 // 30秒タイムアウト
  });

  if (!response.ok) {
    throw new Error(`Webhook failed: ${response.status}`);
  }

  return await response.json();
}
```

---

### 📌 依頼2: 確認Webhook送信機能実装

#### 概要
医療システム側でアカウント無効化処理が完了した後、VoiceDriveへ確認通知を送信していただきたい。

#### エンドポイント仕様（VoiceDrive側）

**URL**: `POST https://voicedrive.ai/api/webhooks/account-deactivation-confirmed`

**認証**: HMAC-SHA256署名検証

**ペイロード例**:
```json
{
  "eventType": "account.deactivation_confirmed",
  "timestamp": "2025-10-10T15:30:45Z",
  "deactivationId": "deact_abc123",
  "employeeId": "EMP2024001",
  "status": "completed",
  "medicalSystemConfirmedAt": "2025-10-10T15:30:40Z",
  "signature": "xyz789..."
}
```

**フィールド説明**:
| フィールド | 型 | 説明 |
|-----------|------|------|
| `eventType` | string | 固定値: `"account.deactivation_confirmed"` |
| `timestamp` | ISO 8601 | Webhook送信日時（UTC） |
| `deactivationId` | string | VoiceDrive側の停止記録ID（依頼1で受信したもの） |
| `employeeId` | string | 対象職員の職員コード |
| `status` | string | 処理結果: `"completed"` or `"failed"` |
| `medicalSystemConfirmedAt` | ISO 8601 | 医療システム側での処理完了日時 |
| `signature` | string | HMAC-SHA256署名 |

#### 医療システム側の実装例

```typescript
// 医療システム: src/services/VoiceDriveWebhookService.ts
export async function sendConfirmationWebhookToVoiceDrive(data) {
  const payload = {
    eventType: 'account.deactivation_confirmed',
    timestamp: new Date().toISOString(),
    deactivationId: data.deactivationId,
    employeeId: data.employeeId,
    status: data.status,
    medicalSystemConfirmedAt: data.medicalSystemConfirmedAt
  };

  const signature = generateHMAC(payload, process.env.VOICEDRIVE_WEBHOOK_SECRET);

  const response = await fetch('https://voicedrive.ai/api/webhooks/account-deactivation-confirmed', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Medical-System-Signature': signature
    },
    body: JSON.stringify(payload),
    timeout: 30000
  });

  if (!response.ok) {
    throw new Error(`VoiceDrive webhook failed: ${response.status}`);
  }

  return await response.json();
}
```

#### VoiceDrive側の受信処理

VoiceDrive側では以下を実装します：

```typescript
// VoiceDrive: src/api/webhooks/account-deactivation-confirmed.ts
export async function POST(request: Request) {
  const payload = await request.json();

  // 署名検証
  const signature = request.headers.get('X-Medical-System-Signature');
  const isValid = verifyHMAC(payload, signature, process.env.MEDICAL_SYSTEM_WEBHOOK_SECRET);

  if (!isValid) {
    return Response.json({ error: 'Invalid signature' }, { status: 401 });
  }

  // EmergencyDeactivation更新
  await prisma.emergencyDeactivation.update({
    where: { id: payload.deactivationId },
    data: {
      syncToStaffSystem: true,
      syncedAt: new Date(payload.medicalSystemConfirmedAt),
      status: payload.status === 'completed' ? 'synced' : 'failed'
    }
  });

  // SyncQueue完了
  await prisma.staffSystemSyncQueue.updateMany({
    where: { relatedDeactivationId: payload.deactivationId },
    data: {
      status: 'completed',
      completedAt: new Date()
    }
  });

  // User.isRetired更新（キャッシュ）
  const user = await prisma.user.findFirst({
    where: { employeeId: payload.employeeId }
  });

  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isRetired: true,
        retirementDate: new Date()
      }
    });
  }

  return Response.json({ status: 'ok' });
}
```

---

### 📌 依頼3: ヘルスチェックAPI実装

#### 概要
医療システムの稼働状態を確認するためのヘルスチェックAPIを実装していただきたい。これにより、VoiceDrive側で医療システムの復旧を自動検知し、同期キューに蓄積された操作を自動送信できます。

#### エンドポイント仕様

**URL**: `GET /api/health/status`

**認証**: 不要（パブリックエンドポイント）

**Rate Limit**: 推奨 10 req/min/IP

**レスポンス例（正常時）**:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-10T15:30:00Z",
  "services": {
    "database": "healthy",
    "api": "healthy",
    "webhooks": "healthy"
  },
  "uptime": 86400,
  "version": "1.0.0"
}
```

**レスポンス例（障害時）**:
```json
{
  "status": "unhealthy",
  "timestamp": "2025-10-10T15:30:00Z",
  "services": {
    "database": "healthy",
    "api": "degraded",
    "webhooks": "unhealthy"
  },
  "errors": [
    {
      "service": "webhooks",
      "message": "Webhook queue full"
    }
  ]
}
```

**フィールド説明**:
| フィールド | 型 | 説明 |
|-----------|------|------|
| `status` | string | 全体ステータス: `"healthy"` or `"unhealthy"` |
| `timestamp` | ISO 8601 | レスポンス生成日時 |
| `services.database` | string | DB状態: `"healthy"`, `"degraded"`, `"unhealthy"` |
| `services.api` | string | API状態 |
| `services.webhooks` | string | Webhook受信状態 |
| `uptime` | number | サーバー稼働時間（秒） |
| `version` | string | APIバージョン |

#### VoiceDrive側の使用方法

VoiceDrive側では、5分ごとにヘルスチェックを実行します：

```typescript
// VoiceDrive: src/jobs/medicalSystemHealthCheck.ts
export async function checkMedicalSystemHealth() {
  try {
    const response = await fetch('https://medical-system.local/api/health/status', {
      timeout: 10000 // 10秒タイムアウト
    });

    if (response.ok) {
      const health = await response.json();

      if (health.status === 'healthy') {
        console.log('医療システム復旧検知 → 同期キュー処理開始');
        await processSyncQueue();
      }
    }
  } catch (error) {
    console.log('医療システム未復旧:', error.message);
  }
}

// Cron設定: 5分ごと
cron.schedule('*/5 * * * *', checkMedicalSystemHealth);
```

---

## ❓ 医療システムチームへの確認事項

### 確認1: アカウント無効化の処理方針

VoiceDriveから緊急アカウント停止通知を受けた場合、医療システム側では以下のどの処理を行いますか？

#### Option A: `Employee.accountStatus`のみ更新 🟢 **VoiceDrive側推奨**
```typescript
await prisma.employee.update({
  where: { employeeId: payload.employeeId },
  data: {
    accountStatus: 'inactive',
    // isRetiredは手動確認後に更新（緊急停止≠退職の可能性）
  }
});
```

**理由**:
- 緊急停止は応急措置であり、必ずしも退職を意味しない
- 人事部門が後から正式な退職処理を実施できる
- データ不整合のリスクが低い

---

#### Option B: `Employee.accountStatus`と`isRetired`を両方更新
```typescript
await prisma.employee.update({
  where: { employeeId: payload.employeeId },
  data: {
    accountStatus: 'inactive',
    isRetired: true,
    retiredAt: new Date()
  }
});
```

**理由**:
- 緊急停止 = 退職とみなす
- データ整合性が即座に確保される

---

#### Option C: カスタム処理
- 独自の業務ロジックに基づいて処理

---

**VoiceDrive側の希望**: **Option A**を推奨しますが、貴チームの業務要件に合わせて決定してください。

**質問**: どのオプションを採用されますか？また、その理由をお聞かせください。

---

### 確認2: Webhookリトライポリシー

Webhook送信失敗時のリトライポリシーについて確認させてください。

#### VoiceDrive → 医療システム（依頼1）

**VoiceDrive側の提案**:
- リトライ回数: **3回**
- リトライ間隔: **1分、5分、15分**（指数バックオフ）
- タイムアウト: **30秒**
- 3回失敗後: 同期キューに蓄積し、医療システム復旧後に自動再送

**質問1**: このリトライポリシーで問題ありませんか？調整が必要な場合は希望を教えてください。

---

#### 医療システム → VoiceDrive（依頼2）

**VoiceDrive側の希望**:
- リトライ回数: **3回**
- リトライ間隔: **1分、5分、15分**
- タイムアウト: **30秒**
- 失敗時: アラート通知（Slack等）

**質問2**: 医療システム側のリトライポリシーはどのように設定されますか？

---

#### Webhook受信タイムアウト

**VoiceDrive側の提案**:
- Webhook受信処理のタイムアウト: **30秒**
- 処理に30秒以上かかる場合、非同期処理とする

**質問3**: 医療システム側のWebhook受信処理（依頼1）は30秒以内に完了しますか？

---

### 確認3: セキュリティとHMAC署名

#### 署名アルゴリズム

**VoiceDrive側の提案**: **HMAC-SHA256**

**質問1**: HMAC-SHA256で問題ありませんか？別のアルゴリズムが必要な場合は教えてください。

---

#### 共有シークレットキーの管理

**VoiceDrive側の提案**:
- 環境変数で管理（`.env`ファイル）
- VoiceDrive側: `MEDICAL_SYSTEM_WEBHOOK_SECRET`
- 医療システム側: `VOICEDRIVE_WEBHOOK_SECRET`

**シークレットキーの共有方法**:
- [ ] セキュアな方法で共有（1Password、AWS Secrets Manager等）
- [ ] 定期的なローテーション（推奨: 3ヶ月ごと）

**質問2**: シークレットキーの共有方法はどうしますか？

---

#### 署名検証失敗時の処理

**VoiceDrive側の実装**:
- 401 Unauthorized返却
- エラーログ記録
- アラート通知（Slack）

**質問3**: 医療システム側の署名検証失敗時の処理方針を教えてください。

---

#### HMAC署名の実装例

**VoiceDrive側の実装**:
```typescript
import crypto from 'crypto';

// 署名生成
function generateHMAC(payload: any, secret: string): string {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(JSON.stringify(payload));
  return hmac.digest('hex');
}

// 署名検証
function verifyHMAC(payload: any, signature: string, secret: string): boolean {
  const expectedSignature = generateHMAC(payload, secret);
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

**質問4**: 医療システム側でも同様の実装で問題ありませんか？

---

## 📊 VoiceDrive側のDB実装計画

### 追加テーブル一覧

VoiceDrive側では以下のテーブルを追加予定です：

#### Table 1: EmergencyDeactivation（緊急停止記録）

**優先度**: 🔴 CRITICAL

```prisma
model EmergencyDeactivation {
  id                  String    @id @default(cuid())
  targetUserId        String    @map("target_user_id")
  targetEmployeeId    String?   @map("target_employee_id")
  executedBy          String    @map("executed_by")
  executorEmployeeId  String?   @map("executor_employee_id")
  executorName        String?   @map("executor_name")
  executorLevel       Float     @map("executor_level")
  reason              String    @db.Text
  timestamp           DateTime  @default(now())
  isEmergency         Boolean   @default(true) @map("is_emergency")
  syncToStaffSystem   Boolean   @default(false) @map("sync_to_staff_system")
  syncedAt            DateTime? @map("synced_at")
  status              String    @default("pending")
  errorMessage        String?   @map("error_message")
  createdAt           DateTime  @default(now()) @map("created_at")
  updatedAt           DateTime  @updatedAt @map("updated_at")

  @@index([targetUserId])
  @@index([executedBy])
  @@index([timestamp])
  @@index([status])
  @@map("emergency_deactivations")
}
```

---

#### Table 2: StaffSystemSyncQueue（医療システム同期キュー）

**優先度**: 🔴 CRITICAL

```prisma
model StaffSystemSyncQueue {
  id                    String    @id @default(cuid())
  type                  String
  targetUserId          String?   @map("target_user_id")
  targetEmployeeId      String?   @map("target_employee_id")
  payload               Json
  status                String    @default("queued")
  retryCount            Int       @default(0) @map("retry_count")
  maxRetries            Int       @default(3) @map("max_retries")
  queuedAt              DateTime  @default(now()) @map("queued_at")
  processedAt           DateTime? @map("processed_at")
  completedAt           DateTime? @map("completed_at")
  nextRetryAt           DateTime? @map("next_retry_at")
  errorMessage          String?   @map("error_message")
  errorStack            String?   @db.Text @map("error_stack")
  relatedDeactivationId String?   @map("related_deactivation_id")
  createdAt             DateTime  @default(now()) @map("created_at")
  updatedAt             DateTime  @updatedAt @map("updated_at")

  @@index([status])
  @@index([type])
  @@index([queuedAt])
  @@index([nextRetryAt])
  @@map("staff_system_sync_queue")
}
```

---

#### Table 3: AuditLog拡張（監査ログ強化）

**優先度**: 🟡 RECOMMENDED

**現在のスキーマ（共通DB: schema.prisma）**:
```prisma
model AuditLog {
  id          String   @id @default(cuid())
  tableName   String
  recordId    String
  action      String
  userId      String
  changes     Json
  ipAddress   String?
  userAgent   String?
  createdAt   DateTime @default(now())

  @@index([tableName, recordId])
  @@index([userId])
  @@map("audit_logs")
}
```

**推奨拡張**:
```prisma
model AuditLog {
  id                 String   @id @default(cuid())
  tableName          String
  recordId           String
  action             String
  userId             String
  changes            Json
  ipAddress          String?
  userAgent          String?
  createdAt          DateTime @default(now())

  // 🆕 緊急停止専用フィールド
  executorLevel      Float?    @map("executor_level")
  targetUserId       String?   @map("target_user_id")
  reason             String?   @db.Text
  isEmergencyAction  Boolean   @default(false) @map("is_emergency_action")
  syncPending        Boolean   @default(false) @map("sync_pending")

  @@index([tableName, recordId])
  @@index([userId])
  @@index([action, isEmergencyAction])
  @@index([targetUserId])
  @@map("audit_logs")
}
```

**マイグレーション**:
```sql
ALTER TABLE audit_logs ADD COLUMN executor_level DECIMAL(4,1) NULL;
ALTER TABLE audit_logs ADD COLUMN target_user_id VARCHAR(255) NULL;
ALTER TABLE audit_logs ADD COLUMN reason TEXT NULL;
ALTER TABLE audit_logs ADD COLUMN is_emergency_action BOOLEAN DEFAULT FALSE;
ALTER TABLE audit_logs ADD COLUMN sync_pending BOOLEAN DEFAULT FALSE;

CREATE INDEX idx_audit_logs_action_emergency ON audit_logs(action, is_emergency_action);
CREATE INDEX idx_audit_logs_target_user ON audit_logs(target_user_id);
```

---

## 📋 医療システム側の推奨DB実装

### 推奨Table: EmployeeAccountStatusHistory

**優先度**: 🟡 RECOMMENDED

**目的**: 医療システム側でもアカウント状態変更履歴を記録

```prisma
// 医療システム: prisma/schema.prisma
model EmployeeAccountStatusHistory {
  id                       String    @id @default(cuid())
  employeeId               String    @map("employee_id")
  previousStatus           String    @map("previous_status")
  newStatus                String    @map("new_status")
  reason                   String    @db.Text
  changedBy                String    @map("changed_by")
  changedByName            String?   @map("changed_by_name")
  isEmergencyChange        Boolean   @default(false) @map("is_emergency_change")
  sourceSystem             String    @default("medical_system")
  voiceDriveDeactivationId String?   @map("voicedrive_deactivation_id")
  changedAt                DateTime  @default(now()) @map("changed_at")
  createdAt                DateTime  @default(now()) @map("created_at")

  employee Employee @relation(fields: [employeeId], references: [id])

  @@index([employeeId])
  @@index([changedAt])
  @@index([sourceSystem])
  @@index([isEmergencyChange])
  @@map("employee_account_status_history")
}
```

**使用例**:
```typescript
// 依頼1のWebhook受信処理内で記録
await prisma.employeeAccountStatusHistory.create({
  data: {
    employeeId: payload.employeeId,
    previousStatus: 'active',
    newStatus: 'inactive',
    reason: payload.reason,
    changedBy: payload.executedBy.employeeId,
    changedByName: payload.executedBy.name,
    isEmergencyChange: true,
    sourceSystem: 'voicedrive',
    voiceDriveDeactivationId: payload.deactivationId
  }
});
```

---

## 📅 想定スケジュール

### VoiceDrive側の実装スケジュール

| Phase | 内容 | 期間 | 状態 |
|-------|------|------|------|
| **Phase 1** | DB実装移行 | 2-3日 | ⏳ 準備中 |
| **Phase 2** | Webhook連携 | 3-5日 | ⏳ 医療チーム実装待ち |
| **Phase 3** | 自動同期機能 | 2-3日 | ⏳ Phase 2後 |
| **Phase 4** | 統合テスト | 1週間 | ⏳ Phase 3後 |

**総所要時間**: 約2-3週間（医療システム側の実装と並行）

---

### 医療システム側の実装依頼スケジュール

**希望スケジュール**:

| 項目 | 所要時間（推定） | 優先度 |
|------|----------------|--------|
| **依頼1**: Webhook受信実装 | 2-3日 | 🔴 HIGH |
| **依頼2**: Webhook送信実装 | 1-2日 | 🔴 HIGH |
| **依頼3**: ヘルスチェックAPI | 1日 | 🟡 MEDIUM |
| **推奨**: EmployeeAccountStatusHistory | 1日 | 🟢 LOW |
| **統合テスト** | 2-3日 | 🔴 HIGH |

**総所要時間**: 約1-2週間

---

### マイルストーン

| 日程 | マイルストーン | VoiceDrive | 医療システム |
|------|--------------|-----------|-------------|
| **Week 1** | Phase 1完了 | ✅ DB実装 | - |
| **Week 2** | Phase 2準備 | Webhook送受信実装 | 🔴 依頼1-3実装 |
| **Week 3** | 統合テスト | ✅ Phase 3実装 | 🔴 統合テスト |
| **Week 4** | 本番リリース | ✅ 本番デプロイ | ✅ 本番デプロイ |

---

## 📊 データフロー図

```
┌─────────────────────────────────────────────────────────────┐
│                      VoiceDrive                              │
│                                                               │
│  ┌────────────────────────────────────────────┐             │
│  │  EmergencyAccountDeactivation.tsx          │             │
│  │  （レベル14-17のみアクセス可能）            │             │
│  └────────────────────────────────────────────┘             │
│         │ ①停止実行                                          │
│         ▼                                                     │
│  ┌────────────────────────────────────────────┐             │
│  │  EmergencyAccountService.ts                │             │
│  └────────────────────────────────────────────┘             │
│         │                                                     │
│         ├─ ②Prisma保存                                      │
│         │  ├─ EmergencyDeactivation                        │
│         │  ├─ AuditLog                                     │
│         │  └─ StaffSystemSyncQueue                         │
│         │                                                     │
│         └─ ③Webhook送信（依頼1）                            │
│            POST /api/webhooks/voicedrive-emergency-deactivation
└─────────────────────────────────────────────────────────────┘
               │ HTTPS + HMAC-SHA256
               ▼
┌─────────────────────────────────────────────────────────────┐
│                  医療職員管理システム                         │
│                                                               │
│  ┌────────────────────────────────────────────┐             │
│  │  Webhook受信: /api/webhooks/               │             │
│  │  voicedrive-emergency-deactivation         │             │
│  └────────────────────────────────────────────┘             │
│         │                                                     │
│         ├─ ④Employee.accountStatus更新                      │
│         │  └─ 'inactive'                                    │
│         │                                                     │
│         ├─ ⑤EmployeeAccountStatusHistory記録               │
│         │  └─ isEmergencyChange: true                       │
│         │                                                     │
│         └─ ⑥確認Webhook送信（依頼2）                        │
│            POST /api/webhooks/account-deactivation-confirmed│
└─────────────────────────────────────────────────────────────┘
               │ HTTPS + HMAC-SHA256
               ▼
┌─────────────────────────────────────────────────────────────┐
│                      VoiceDrive                              │
│                                                               │
│  ┌────────────────────────────────────────────┐             │
│  │  Webhook受信: /api/webhooks/               │             │
│  │  account-deactivation-confirmed            │             │
│  └────────────────────────────────────────────┘             │
│         │                                                     │
│         ├─ ⑦EmergencyDeactivation更新                       │
│         │  └─ syncToStaffSystem: true                       │
│         │                                                     │
│         ├─ ⑧SyncQueue完了                                   │
│         │  └─ status: 'completed'                           │
│         │                                                     │
│         └─ ⑨User.isRetired更新（キャッシュ）                │
│            └─ isRetired: true                               │
└─────────────────────────────────────────────────────────────┘

         医療システム障害時のフロー
         ────────────────────────

┌─────────────────────────────────────────────────────────────┐
│                      VoiceDrive                              │
│                                                               │
│  ①停止実行                                                    │
│  ②Prisma保存（EmergencyDeactivation等）                      │
│  ③Webhook送信失敗（医療システム障害中）                      │
│  ④StaffSystemSyncQueueに追加                                │
│  ⑤5分ごとにヘルスチェック（依頼3）                           │
│     GET /api/health/status                                   │
│  ⑥医療システム復旧検知                                        │
│  ⑦同期キュー処理開始                                          │
│  ⑧Webhook再送信成功                                          │
│  ⑨確認Webhook受信                                            │
│  ⑩EmergencyDeactivation.syncToStaffSystem = true            │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ アクションアイテム

### 医療システムチーム様へのお願い

#### 🔴 必須（2週間以内）

- [ ] **依頼1**: Webhook受信エンドポイント実装
  - `POST /api/webhooks/voicedrive-emergency-deactivation`
  - HMAC署名検証
  - Employee.accountStatus更新
  - EmployeeAccountStatusHistory記録（推奨）

- [ ] **依頼2**: 確認Webhook送信実装
  - `POST https://voicedrive.ai/api/webhooks/account-deactivation-confirmed`
  - HMAC署名生成

- [ ] **依頼3**: ヘルスチェックAPI実装
  - `GET /api/health/status`

#### ❓ 確認事項（1週間以内）

- [ ] **確認1**: アカウント無効化の処理方針（Option A/B/C）
- [ ] **確認2**: Webhookリトライポリシー
- [ ] **確認3**: HMAC署名仕様の確認

---

### VoiceDriveチーム（参考情報）

#### Phase 1: DB実装（今週中）
- [ ] EmergencyDeactivationテーブル追加
- [ ] StaffSystemSyncQueueテーブル追加
- [ ] AuditLog拡張
- [ ] EmergencyAccountService.ts修正

#### Phase 2: Webhook連携（来週）
- [ ] MedicalSystemWebhookService.ts実装
- [ ] /api/webhooks/account-deactivation-confirmed.ts実装
- [ ] HMAC署名実装

#### Phase 3: 自動同期（再来週）
- [ ] checkMedicalSystemHealth.ts実装
- [ ] processSyncQueue.ts実装
- [ ] cronジョブ設定

---

## 📝 補足資料

### 参照ドキュメント

1. **データ管理責任分界点定義書**
   `mcp-shared/docs/データ管理責任分界点定義書_20251008.md`

2. **PersonalStation DB要件分析**
   `mcp-shared/docs/PersonalStation_DB要件分析_20251008.md`

3. **共通DB構築後統合作業再開計画書**
   `mcp-shared/docs/共通DB構築後統合作業再開計画書_20251008.md`

4. **アカウント無効化 暫定マスターリスト**
   （今回の依頼の詳細版）

5. **アカウント無効化 DB要件分析**
   （技術詳細分析版）

---

### 技術スタック

**VoiceDrive**:
- MySQL 8.0 (AWS Lightsail 16GB) → SQLite（開発環境）
- Prisma ORM
- TypeScript + React
- Vite

**医療システム**:
- MySQL 8.0 (AWS Lightsail 16GB)
- Prisma ORM
- TypeScript + Next.js
- NestJS (API Server)

---

## 🙏 謝辞

日頃より医療職員管理システムの開発にご尽力いただき、誠にありがとうございます。

本件は緊急アカウント無効化機能という医療現場の業務継続性に直結する重要な機能です。貴チームのご協力により、より安全で信頼性の高いシステムを実現できると確信しております。

ご多忙のところ恐縮ですが、上記依頼事項および確認事項につきまして、**2週間以内（2025年10月24日まで）**にご回答いただけますと幸いです。

ご不明点やご質問がございましたら、いつでもお気軽にお問い合わせください。

引き続きよろしくお願いいたします。

---

**VoiceDriveチーム（職員カルテシステム）**
**作成日**: 2025年10月10日
**文書番号**: RES-2025-1010-001

---

## 📧 連絡先

**Slack**: `#voicedrive-medical-system-integration`
**Email**: voicedrive-dev@example.com
**MCP共有フォルダ**: `mcp-shared/docs/`

**緊急連絡先**: DM（24時間対応）

---

**文書終了**
