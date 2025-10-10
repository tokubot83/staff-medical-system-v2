# schema.prisma 更新提案書（アカウント緊急無効化機能）

**文書番号**: SCHEMA-2025-1010-001
**作成日**: 2025年10月10日
**対象ファイル**: `prisma/schema.prisma`
**目的**: アカウント緊急無効化機能のDB実装

---

## 📋 概要

アカウント緊急無効化機能の実装に伴い、以下のテーブル追加・拡張を提案します。

### 追加・変更内容

| No | 種別 | テーブル名 | 優先度 | 理由 |
|----|------|-----------|--------|------|
| 1 | 新規追加 | EmergencyDeactivation | 🔴 CRITICAL | 緊急停止記録の永続化 |
| 2 | 新規追加 | StaffSystemSyncQueue | 🔴 CRITICAL | 医療システム同期キュー |
| 3 | 既存拡張 | AuditLog | 🟡 RECOMMENDED | 緊急操作の追跡強化 |

---

## 🔧 実装内容

### 1. EmergencyDeactivation（新規追加）

#### 目的
- アカウント緊急停止記録の永続化
- 医療システムとの同期状態の追跡
- 監査要件を満たすトレーサビリティの確保

#### スキーマ定義

**追加場所**: `prisma/schema.prisma` 末尾（629行目以降）

```prisma
// ============================================
// アカウント緊急無効化機能
// ============================================

// アカウント緊急無効化記録
model EmergencyDeactivation {
  id                  String    @id @default(cuid())

  // 対象ユーザー情報
  targetUserId        String    @map("target_user_id")
  targetEmployeeId    String?   @map("target_employee_id") // Employee.employeeCode（キャッシュ）

  // 実行者情報
  executedBy          String    @map("executed_by")        // SystemAccount.accountId（VoiceDrive）
  executorEmployeeId  String?   @map("executor_employee_id") // Employee.employeeCode（キャッシュ）
  executorName        String?   @map("executor_name")      // Employee.name（キャッシュ）
  executorLevel       Float     @map("executor_level")     // 権限レベル（14-17）

  // 停止情報
  reason              String    @db.Text                   // 停止理由（必須）
  timestamp           DateTime  @default(now())
  isEmergency         Boolean   @default(true) @map("is_emergency")

  // 医療システム同期状態
  syncToStaffSystem   Boolean   @default(false) @map("sync_to_staff_system")
  syncedAt            DateTime? @map("synced_at")

  // ステータス
  status              String    @default("pending") // 'pending' | 'synced' | 'failed'
  errorMessage        String?   @map("error_message")

  // 監査情報
  createdAt           DateTime  @default(now()) @map("created_at")
  updatedAt           DateTime  @updatedAt @map("updated_at")

  @@index([targetUserId])
  @@index([executedBy])
  @@index([timestamp])
  @@index([status])
  @@index([syncToStaffSystem])
  @@map("emergency_deactivations")
}
```

#### フィールド詳細

| フィールド名 | 型 | NULL許可 | デフォルト値 | 説明 |
|------------|------|---------|------------|------|
| `id` | String | ❌ | `cuid()` | 主キー（緊急停止記録ID） |
| `targetUserId` | String | ❌ | - | 対象ユーザーID（VoiceDrive側） |
| `targetEmployeeId` | String | ✅ | - | 対象職員コード（医療システム側のキー） |
| `executedBy` | String | ❌ | - | 実行者ID（VoiceDrive側） |
| `executorEmployeeId` | String | ✅ | - | 実行者職員コード |
| `executorName` | String | ✅ | - | 実行者氏名（監査用） |
| `executorLevel` | Float | ❌ | - | 実行者権限レベル（14-17） |
| `reason` | String(Text) | ❌ | - | 停止理由（監査用） |
| `timestamp` | DateTime | ❌ | `now()` | 停止実行日時 |
| `isEmergency` | Boolean | ❌ | `true` | 緊急停止フラグ |
| `syncToStaffSystem` | Boolean | ❌ | `false` | 医療システム同期済みフラグ |
| `syncedAt` | DateTime | ✅ | - | 医療システム同期完了日時 |
| `status` | String | ❌ | `"pending"` | 同期ステータス |
| `errorMessage` | String | ✅ | - | エラーメッセージ（同期失敗時） |
| `createdAt` | DateTime | ❌ | `now()` | レコード作成日時 |
| `updatedAt` | DateTime | ❌ | `updatedAt` | レコード更新日時 |

#### インデックス

| インデックス名 | カラム | 目的 |
|-------------|--------|------|
| `idx_emergency_deactivations_target_user` | `targetUserId` | ユーザー別の停止履歴検索 |
| `idx_emergency_deactivations_executor` | `executedBy` | 実行者別の操作履歴検索 |
| `idx_emergency_deactivations_timestamp` | `timestamp` | 日時順のソート |
| `idx_emergency_deactivations_status` | `status` | ステータス別フィルタ |
| `idx_emergency_deactivations_sync` | `syncToStaffSystem` | 未同期レコードの検索 |

#### 使用例

```typescript
// 緊急停止記録の作成
const deactivation = await prisma.emergencyDeactivation.create({
  data: {
    targetUserId: 'user_level1_staff',
    targetEmployeeId: 'EMP2024001',
    executedBy: 'user_admin',
    executorEmployeeId: 'EMP2020001',
    executorName: '人事部長',
    executorLevel: 15,
    reason: '退職処理・医療システム障害中のため緊急停止',
    isEmergency: true
  }
});

// 同期状態の更新
await prisma.emergencyDeactivation.update({
  where: { id: deactivation.id },
  data: {
    syncToStaffSystem: true,
    syncedAt: new Date(),
    status: 'synced'
  }
});

// 未同期レコードの検索
const unsyncedDeactivations = await prisma.emergencyDeactivation.findMany({
  where: {
    syncToStaffSystem: false,
    status: { in: ['pending', 'failed'] }
  },
  orderBy: { timestamp: 'asc' }
});
```

---

### 2. StaffSystemSyncQueue（新規追加）

#### 目的
- 医療システム障害時の同期キュー管理
- リトライ機能の実装
- 医療システム復旧後の自動同期

#### スキーマ定義

**追加場所**: `prisma/schema.prisma` EmergencyDeactivationテーブルの後

```prisma
// 医療システム同期キュー
model StaffSystemSyncQueue {
  id                    String    @id @default(cuid())

  // 同期タイプ
  type                  String    // 'ACCOUNT_DEACTIVATION' | 'ACCOUNT_REACTIVATION' | 'USER_UPDATE'

  // 対象情報
  targetUserId          String?   @map("target_user_id")
  targetEmployeeId      String?   @map("target_employee_id")

  // ペイロード
  payload               Json      // 同期データ（type別に内容が異なる）

  // ステータス
  status                String    @default("queued") // 'queued' | 'processing' | 'completed' | 'failed'
  retryCount            Int       @default(0) @map("retry_count")
  maxRetries            Int       @default(3) @map("max_retries")

  // 実行情報
  queuedAt              DateTime  @default(now()) @map("queued_at")
  processedAt           DateTime? @map("processed_at")
  completedAt           DateTime? @map("completed_at")
  nextRetryAt           DateTime? @map("next_retry_at")

  // エラー情報
  errorMessage          String?   @map("error_message")
  errorStack            String?   @db.Text @map("error_stack")

  // 関連レコード
  relatedDeactivationId String?   @map("related_deactivation_id")

  // タイムスタンプ
  createdAt             DateTime  @default(now()) @map("created_at")
  updatedAt             DateTime  @updatedAt @map("updated_at")

  @@index([status])
  @@index([type])
  @@index([queuedAt])
  @@index([nextRetryAt])
  @@index([targetUserId])
  @@map("staff_system_sync_queue")
}
```

#### フィールド詳細

| フィールド名 | 型 | NULL許可 | デフォルト値 | 説明 |
|------------|------|---------|------------|------|
| `id` | String | ❌ | `cuid()` | 主キー（キューID） |
| `type` | String | ❌ | - | 同期タイプ（'ACCOUNT_DEACTIVATION' 等） |
| `targetUserId` | String | ✅ | - | 対象ユーザーID（VoiceDrive側） |
| `targetEmployeeId` | String | ✅ | - | 対象職員コード（医療システム側） |
| `payload` | Json | ❌ | - | 同期データ（タイプ別に構造が異なる） |
| `status` | String | ❌ | `"queued"` | 処理ステータス |
| `retryCount` | Int | ❌ | `0` | リトライ回数 |
| `maxRetries` | Int | ❌ | `3` | 最大リトライ回数 |
| `queuedAt` | DateTime | ❌ | `now()` | キューイング日時 |
| `processedAt` | DateTime | ✅ | - | 処理開始日時 |
| `completedAt` | DateTime | ✅ | - | 処理完了日時 |
| `nextRetryAt` | DateTime | ✅ | - | 次回リトライ日時 |
| `errorMessage` | String | ✅ | - | エラーメッセージ |
| `errorStack` | String(Text) | ✅ | - | エラースタックトレース |
| `relatedDeactivationId` | String | ✅ | - | 関連EmergencyDeactivation.id |
| `createdAt` | DateTime | ❌ | `now()` | レコード作成日時 |
| `updatedAt` | DateTime | ❌ | `updatedAt` | レコード更新日時 |

#### インデックス

| インデックス名 | カラム | 目的 |
|-------------|--------|------|
| `idx_sync_queue_status` | `status` | ステータス別フィルタ |
| `idx_sync_queue_type` | `type` | タイプ別フィルタ |
| `idx_sync_queue_queued_at` | `queuedAt` | 日時順のソート |
| `idx_sync_queue_next_retry` | `nextRetryAt` | リトライ対象の検索 |
| `idx_sync_queue_target_user` | `targetUserId` | ユーザー別の検索 |

#### 使用例

```typescript
// 同期キューに追加
const queueItem = await prisma.staffSystemSyncQueue.create({
  data: {
    type: 'ACCOUNT_DEACTIVATION',
    targetUserId: 'user_level1_staff',
    targetEmployeeId: 'EMP2024001',
    payload: {
      reason: '退職処理・医療システム障害中のため緊急停止',
      executedBy: 'user_admin',
      timestamp: new Date().toISOString()
    },
    relatedDeactivationId: 'deact_abc123',
    status: 'queued'
  }
});

// 未処理キューの取得
const queuedItems = await prisma.staffSystemSyncQueue.findMany({
  where: {
    status: { in: ['queued', 'failed'] },
    retryCount: { lt: 3 }
  },
  orderBy: { queuedAt: 'asc' }
});

// リトライ処理
await prisma.staffSystemSyncQueue.update({
  where: { id: queueItem.id },
  data: {
    status: 'processing',
    processedAt: new Date(),
    retryCount: { increment: 1 },
    nextRetryAt: new Date(Date.now() + 60000) // 1分後
  }
});
```

---

### 3. AuditLog（既存拡張）

#### 目的
- 緊急操作の特定とフィルタリング
- 監査証跡の強化
- コンプライアンス要件への対応

#### 現在のスキーマ（298-312行目）

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

#### 拡張後のスキーマ

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
  executorLevel      Float?    @map("executor_level")      // 実行者の権限レベル
  targetUserId       String?   @map("target_user_id")      // 対象ユーザーID
  reason             String?   @db.Text                    // 理由（緊急停止等）
  isEmergencyAction  Boolean   @default(false) @map("is_emergency_action")
  syncPending        Boolean   @default(false) @map("sync_pending")

  @@index([tableName, recordId])
  @@index([userId])
  @@index([action, isEmergencyAction])
  @@index([targetUserId])
  @@map("audit_logs")
}
```

#### 追加フィールド詳細

| フィールド名 | 型 | NULL許可 | デフォルト値 | 説明 |
|------------|------|---------|------------|------|
| `executorLevel` | Float | ✅ | - | 実行者の権限レベル |
| `targetUserId` | String | ✅ | - | 操作対象のユーザーID |
| `reason` | String(Text) | ✅ | - | 操作理由（緊急停止等） |
| `isEmergencyAction` | Boolean | ❌ | `false` | 緊急操作フラグ |
| `syncPending` | Boolean | ❌ | `false` | 同期待ちフラグ |

#### 追加インデックス

| インデックス名 | カラム | 目的 |
|-------------|--------|------|
| `idx_audit_logs_action_emergency` | `action`, `isEmergencyAction` | 緊急操作のフィルタ |
| `idx_audit_logs_target_user` | `targetUserId` | 対象ユーザー別の検索 |

#### マイグレーションSQL

```sql
-- AuditLog拡張
ALTER TABLE audit_logs ADD COLUMN executor_level DECIMAL(4,1) NULL;
ALTER TABLE audit_logs ADD COLUMN target_user_id VARCHAR(255) NULL;
ALTER TABLE audit_logs ADD COLUMN reason TEXT NULL;
ALTER TABLE audit_logs ADD COLUMN is_emergency_action BOOLEAN DEFAULT FALSE;
ALTER TABLE audit_logs ADD COLUMN sync_pending BOOLEAN DEFAULT FALSE;

-- インデックス追加
CREATE INDEX idx_audit_logs_action_emergency ON audit_logs(action, is_emergency_action);
CREATE INDEX idx_audit_logs_target_user ON audit_logs(target_user_id);
```

#### 使用例

```typescript
// 緊急停止の監査ログ記録
await prisma.auditLog.create({
  data: {
    tableName: 'system_accounts',
    recordId: 'user_level1_staff',
    action: 'EMERGENCY_ACCOUNT_DEACTIVATION',
    userId: 'user_admin',
    changes: {
      oldValues: { isActive: true },
      newValues: { isActive: false, deactivatedBy: '人事部長' }
    },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0...',

    // 🆕 拡張フィールド
    executorLevel: 15,
    targetUserId: 'user_level1_staff',
    reason: '退職処理・医療システム障害中のため緊急停止',
    isEmergencyAction: true,
    syncPending: false
  }
});

// 緊急操作の検索
const emergencyActions = await prisma.auditLog.findMany({
  where: {
    isEmergencyAction: true,
    createdAt: {
      gte: new Date('2025-10-01'),
      lte: new Date('2025-10-31')
    }
  },
  orderBy: { createdAt: 'desc' }
});
```

---

## 📋 マイグレーション手順

### 1. 開発環境（SQLite）

#### Step 1: schema.prisma更新

1. `prisma/schema.prisma`を開く
2. 上記の3つのテーブル定義を末尾に追加
3. 保存

#### Step 2: マイグレーション生成

```bash
# 開発環境でマイグレーション生成
npx prisma migrate dev --name add_emergency_deactivation_tables

# 生成されるマイグレーションファイル:
# prisma/migrations/20251010120000_add_emergency_deactivation_tables/migration.sql
```

#### Step 3: マイグレーション内容確認

生成された `migration.sql` の内容を確認：

```sql
-- CreateTable: EmergencyDeactivation
CREATE TABLE "emergency_deactivations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "target_user_id" TEXT NOT NULL,
    "target_employee_id" TEXT,
    "executed_by" TEXT NOT NULL,
    "executor_employee_id" TEXT,
    "executor_name" TEXT,
    "executor_level" REAL NOT NULL,
    "reason" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_emergency" BOOLEAN NOT NULL DEFAULT true,
    "sync_to_staff_system" BOOLEAN NOT NULL DEFAULT false,
    "synced_at" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "error_message" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable: StaffSystemSyncQueue
CREATE TABLE "staff_system_sync_queue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "target_user_id" TEXT,
    "target_employee_id" TEXT,
    "payload" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "max_retries" INTEGER NOT NULL DEFAULT 3,
    "queued_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" DATETIME,
    "completed_at" DATETIME,
    "next_retry_at" DATETIME,
    "error_message" TEXT,
    "error_stack" TEXT,
    "related_deactivation_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "idx_emergency_deactivations_target_user" ON "emergency_deactivations"("target_user_id");
CREATE INDEX "idx_emergency_deactivations_executor" ON "emergency_deactivations"("executed_by");
CREATE INDEX "idx_emergency_deactivations_timestamp" ON "emergency_deactivations"("timestamp");
CREATE INDEX "idx_emergency_deactivations_status" ON "emergency_deactivations"("status");
CREATE INDEX "idx_emergency_deactivations_sync" ON "emergency_deactivations"("sync_to_staff_system");

CREATE INDEX "idx_sync_queue_status" ON "staff_system_sync_queue"("status");
CREATE INDEX "idx_sync_queue_type" ON "staff_system_sync_queue"("type");
CREATE INDEX "idx_sync_queue_queued_at" ON "staff_system_sync_queue"("queued_at");
CREATE INDEX "idx_sync_queue_next_retry" ON "staff_system_sync_queue"("next_retry_at");
CREATE INDEX "idx_sync_queue_target_user" ON "staff_system_sync_queue"("target_user_id");

-- AlterTable: AuditLog
ALTER TABLE "audit_logs" ADD COLUMN "executor_level" REAL;
ALTER TABLE "audit_logs" ADD COLUMN "target_user_id" TEXT;
ALTER TABLE "audit_logs" ADD COLUMN "reason" TEXT;
ALTER TABLE "audit_logs" ADD COLUMN "is_emergency_action" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "audit_logs" ADD COLUMN "sync_pending" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX "idx_audit_logs_action_emergency" ON "audit_logs"("action", "is_emergency_action");
CREATE INDEX "idx_audit_logs_target_user" ON "audit_logs"("target_user_id");
```

#### Step 4: Prisma Clientの再生成

```bash
npx prisma generate
```

#### Step 5: マイグレーション適用確認

```bash
# マイグレーション状態確認
npx prisma migrate status

# DBスキーマ確認
npx prisma db push --preview-feature
```

---

### 2. 本番環境（MySQL）

#### Step 1: 本番環境のバックアップ

```bash
# MySQLダンプ作成
mysqldump -u root -p voicedrive_production > backup_20251010.sql
```

#### Step 2: マイグレーションファイルの確認

開発環境で生成したマイグレーションファイルを本番環境用に調整（MySQL特有の構文対応）

```sql
-- MySQL用マイグレーション
-- prisma/migrations/20251010120000_add_emergency_deactivation_tables/migration.sql

-- CreateTable: EmergencyDeactivation
CREATE TABLE `emergency_deactivations` (
    `id` VARCHAR(191) NOT NULL PRIMARY KEY,
    `target_user_id` VARCHAR(191) NOT NULL,
    `target_employee_id` VARCHAR(191),
    `executed_by` VARCHAR(191) NOT NULL,
    `executor_employee_id` VARCHAR(191),
    `executor_name` VARCHAR(255),
    `executor_level` DECIMAL(4,1) NOT NULL,
    `reason` TEXT NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `is_emergency` BOOLEAN NOT NULL DEFAULT true,
    `sync_to_staff_system` BOOLEAN NOT NULL DEFAULT false,
    `synced_at` DATETIME(3),
    `status` VARCHAR(50) NOT NULL DEFAULT 'pending',
    `error_message` TEXT,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CreateTable: StaffSystemSyncQueue
CREATE TABLE `staff_system_sync_queue` (
    `id` VARCHAR(191) NOT NULL PRIMARY KEY,
    `type` VARCHAR(50) NOT NULL,
    `target_user_id` VARCHAR(191),
    `target_employee_id` VARCHAR(191),
    `payload` JSON NOT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'queued',
    `retry_count` INT NOT NULL DEFAULT 0,
    `max_retries` INT NOT NULL DEFAULT 3,
    `queued_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `processed_at` DATETIME(3),
    `completed_at` DATETIME(3),
    `next_retry_at` DATETIME(3),
    `error_message` TEXT,
    `error_stack` TEXT,
    `related_deactivation_id` VARCHAR(191),
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `idx_emergency_deactivations_target_user` ON `emergency_deactivations`(`target_user_id`);
CREATE INDEX `idx_emergency_deactivations_executor` ON `emergency_deactivations`(`executed_by`);
CREATE INDEX `idx_emergency_deactivations_timestamp` ON `emergency_deactivations`(`timestamp`);
CREATE INDEX `idx_emergency_deactivations_status` ON `emergency_deactivations`(`status`);
CREATE INDEX `idx_emergency_deactivations_sync` ON `emergency_deactivations`(`sync_to_staff_system`);

CREATE INDEX `idx_sync_queue_status` ON `staff_system_sync_queue`(`status`);
CREATE INDEX `idx_sync_queue_type` ON `staff_system_sync_queue`(`type`);
CREATE INDEX `idx_sync_queue_queued_at` ON `staff_system_sync_queue`(`queued_at`);
CREATE INDEX `idx_sync_queue_next_retry` ON `staff_system_sync_queue`(`next_retry_at`);
CREATE INDEX `idx_sync_queue_target_user` ON `staff_system_sync_queue`(`target_user_id`);

-- AlterTable: AuditLog
ALTER TABLE `audit_logs` ADD COLUMN `executor_level` DECIMAL(4,1);
ALTER TABLE `audit_logs` ADD COLUMN `target_user_id` VARCHAR(191);
ALTER TABLE `audit_logs` ADD COLUMN `reason` TEXT;
ALTER TABLE `audit_logs` ADD COLUMN `is_emergency_action` BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE `audit_logs` ADD COLUMN `sync_pending` BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX `idx_audit_logs_action_emergency` ON `audit_logs`(`action`, `is_emergency_action`);
CREATE INDEX `idx_audit_logs_target_user` ON `audit_logs`(`target_user_id`);
```

#### Step 3: 本番環境デプロイ

```bash
# 本番環境の環境変数設定
export DATABASE_URL="mysql://user:password@host:3306/voicedrive_production"

# マイグレーション適用（本番環境）
npx prisma migrate deploy
```

#### Step 4: 動作確認

```bash
# テーブル作成確認
mysql -u root -p voicedrive_production -e "SHOW TABLES LIKE '%emergency%';"
mysql -u root -p voicedrive_production -e "SHOW TABLES LIKE '%sync_queue%';"

# スキーマ確認
mysql -u root -p voicedrive_production -e "DESCRIBE emergency_deactivations;"
mysql -u root -p voicedrive_production -e "DESCRIBE staff_system_sync_queue;"
mysql -u root -p voicedrive_production -e "DESCRIBE audit_logs;"

# インデックス確認
mysql -u root -p voicedrive_production -e "SHOW INDEX FROM emergency_deactivations;"
```

---

## ✅ チェックリスト

### 開発環境

- [ ] schema.prisma更新（3テーブル追加・拡張）
- [ ] `npx prisma migrate dev --name add_emergency_deactivation_tables`実行
- [ ] マイグレーションファイル確認
- [ ] `npx prisma generate`実行
- [ ] テーブル作成確認（SQLiteブラウザ）
- [ ] インデックス作成確認

### 本番環境

- [ ] 本番環境バックアップ作成
- [ ] MySQL用マイグレーションファイル作成
- [ ] マイグレーション適用（ステージング）
- [ ] ステージング環境動作確認
- [ ] マイグレーション適用（本番）
- [ ] 本番環境動作確認
- [ ] ロールバック手順確認

---

## 🔄 ロールバック手順

### 開発環境（SQLite）

```bash
# マイグレーション履歴確認
npx prisma migrate status

# 最新マイグレーションをロールバック
npx prisma migrate reset --skip-seed

# 特定マイグレーションまでロールバック
npx prisma migrate resolve --rolled-back 20251010120000_add_emergency_deactivation_tables
```

### 本番環境（MySQL）

```sql
-- テーブル削除
DROP TABLE IF EXISTS `emergency_deactivations`;
DROP TABLE IF EXISTS `staff_system_sync_queue`;

-- AuditLog拡張フィールド削除
ALTER TABLE `audit_logs` DROP COLUMN `executor_level`;
ALTER TABLE `audit_logs` DROP COLUMN `target_user_id`;
ALTER TABLE `audit_logs` DROP COLUMN `reason`;
ALTER TABLE `audit_logs` DROP COLUMN `is_emergency_action`;
ALTER TABLE `audit_logs` DROP COLUMN `sync_pending`;

-- インデックス削除
DROP INDEX `idx_audit_logs_action_emergency` ON `audit_logs`;
DROP INDEX `idx_audit_logs_target_user` ON `audit_logs`;
```

---

## 📝 補足資料

### 参照ドキュメント

1. **VoiceDrive側マスタープラン**
   `mcp-shared/docs/EmergencyAccountDeactivation_Master_Plan_VoiceDrive_20251010.md`

2. **医療システムへの回答書**
   `mcp-shared/docs/Response_EmergencyAccountDeactivation_Requirements_20251010.md`

3. **データ管理責任分界点定義書**
   `mcp-shared/docs/データ管理責任分界点定義書_20251008.md`

---

**VoiceDriveチーム（職員カルテシステム）**
**作成日**: 2025年10月10日
**文書番号**: SCHEMA-2025-1010-001

---

**文書終了**
