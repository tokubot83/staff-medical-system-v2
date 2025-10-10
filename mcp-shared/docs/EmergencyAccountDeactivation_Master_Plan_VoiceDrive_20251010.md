# アカウント緊急無効化機能 VoiceDrive側マスタープラン

**文書番号**: PLAN-2025-1010-001
**作成日**: 2025年10月10日
**対象システム**: VoiceDrive（職員カルテシステム）
**対象機能**: アカウント緊急無効化（EmergencyAccountDeactivation）
**優先度**: 🔴 **CRITICAL（グループ0: 緊急機能）**

---

## 📋 エグゼクティブサマリー

### 目的
医療職員管理システム障害時の応急措置として、人事部門（レベル14-17）が緊急的にアカウントを停止できる機能を実装する。

### 現状と課題

#### ✅ 実装済み
- 緊急停止UI（EmergencyAccountDeactivation.tsx）
- 権限チェック（レベル14-17のみ）
- LocalStorageベースの仮実装

#### ❌ 未実装（本プランの対象）
- **DB永続化**: LocalStorage → Prisma DB移行
- **医療システム連携**: Webhook送受信
- **自動同期機能**: 医療システム復旧後の自動データ送信
- **監査ログ強化**: 緊急操作の完全な追跡

### 実装スケジュール

| Phase | 内容 | 期間 | 状態 |
|-------|------|------|------|
| **Phase 1** | DB実装移行 | 2-3日 | ⏳ 準備中 |
| **Phase 2** | Webhook連携 | 3-5日 | ⏳ 医療チーム実装待ち |
| **Phase 3** | 自動同期機能 | 2-3日 | ⏳ Phase 2後 |
| **Phase 4** | 統合テスト・本番リリース | 1週間 | ⏳ Phase 3後 |

**総所要時間**: 約2-3週間（医療システム側の実装と並行）

---

## 🎯 機能要件

### 1. アクセス権限

**対象ユーザー**: レベル14-17のみ

| レベル | 役職 | アクセス可否 |
|--------|------|------------|
| 17 | 理事長 | ✅ 可 |
| 16 | 理事 | ✅ 可 |
| 15 | 事務局長 | ✅ 可 |
| 14 | 人事部長 | ✅ 可 |
| 13以下 | その他 | ❌ 不可 |

**実装場所**: `EmergencyAccountDeactivation.tsx` 21-25行目

```typescript
const hasPermission = () => {
  const level = currentUser?.permissionLevel || 0;
  return level >= 14 && level <= 17;
};
```

---

### 2. 利用シーン

#### シーン1: 退職者のアカウント即時停止
- **状況**: 医療システム障害中に職員が退職
- **対応**: VoiceDriveで緊急停止 → 医療システム復旧後に自動同期

#### シーン2: セキュリティインシデント対応
- **状況**: 不正アクセスの疑い
- **対応**: 即座にアカウント停止 → 監査ログ記録

#### シーン3: コンプライアンス対応
- **状況**: 懲戒処分でアクセス遮断が必要
- **対応**: 緊急停止 → 医療システムにも反映

---

### 3. 操作フロー

```
1. EmergencyAccountDeactivationページにアクセス（レベル14-17のみ）
   ↓
2. 対象ユーザーIDを入力
   ↓
3. 停止理由を入力（必須）
   ↓
4. 確認ダイアログ表示
   ↓
5. 実行ボタン押下
   ↓
6. EmergencyAccountService.deactivateAccount()呼び出し
   ↓
7. DB保存（EmergencyDeactivation、AuditLog、SyncQueue）
   ↓
8. 医療システムへWebhook送信（成功/失敗）
   ↓ 成功時
9. 医療システムがEmployee.accountStatus更新
   ↓
10. 医療システムから確認Webhook受信
    ↓
11. EmergencyDeactivation.syncToStaffSystem = true
    ↓
12. User.isRetired = true（VoiceDrive側キャッシュ更新）
```

---

## 📊 Phase別実装計画

### Phase 1: DB実装移行（2-3日） 🔴 **最優先**

#### 目標
LocalStorageからPrisma DBへの移行を完了し、監査要件を満たす永続化を実現する。

#### 実装内容

##### 1.1 テーブル追加（schema.prisma）

**1.1.1 EmergencyDeactivationテーブル**

**ファイル**: `prisma/schema.prisma`

**追加内容**:
```prisma
// アカウント緊急無効化記録
model EmergencyDeactivation {
  id                  String    @id @default(cuid())

  // 対象ユーザー情報
  targetUserId        String    @map("target_user_id")
  targetEmployeeId    String?   @map("target_employee_id") // User.employeeId（キャッシュ）

  // 実行者情報
  executedBy          String    @map("executed_by")        // User.id
  executorEmployeeId  String?   @map("executor_employee_id") // User.employeeId（キャッシュ）
  executorName        String?   @map("executor_name")      // User.name（キャッシュ）
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

**マイグレーション実行**:
```bash
npx prisma migrate dev --name add_emergency_deactivation
```

---

**1.1.2 StaffSystemSyncQueueテーブル**

**追加内容**:
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

**マイグレーション実行**:
```bash
npx prisma migrate dev --name add_staff_system_sync_queue
```

---

**1.1.3 AuditLogテーブル拡張**

**現在のスキーマ（共通DB）**:
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

**拡張内容**:
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

**マイグレーション実行**:
```bash
npx prisma migrate dev --name extend_audit_log_for_emergency
```

---

##### 1.2 EmergencyAccountService.ts修正

**ファイル**: `src/services/EmergencyAccountService.ts`

**修正箇所1: saveDeactivationRecord()（116-136行目）**

**Before（LocalStorage）**:
```typescript
private async saveDeactivationRecord(deactivation: EmergencyDeactivation): Promise<void> {
  const key = `emergency_deactivation_${deactivation.targetUserId}`;
  localStorage.setItem(key, JSON.stringify(deactivation));

  // TODO: Prismaでデータベースに保存
}
```

**After（Prisma）**:
```typescript
private async saveDeactivationRecord(deactivation: EmergencyDeactivation): Promise<void> {
  // 対象ユーザー情報取得
  const targetUser = await prisma.user.findUnique({
    where: { id: deactivation.targetUserId }
  });

  // 実行者情報取得
  const executorUser = await prisma.user.findUnique({
    where: { id: deactivation.executedBy }
  });

  // DB保存
  await prisma.emergencyDeactivation.create({
    data: {
      targetUserId: deactivation.targetUserId,
      targetEmployeeId: targetUser?.employeeId,
      executedBy: deactivation.executedBy,
      executorEmployeeId: executorUser?.employeeId,
      executorName: executorUser?.name,
      executorLevel: executorUser?.permissionLevel || 0,
      reason: deactivation.reason,
      timestamp: deactivation.timestamp,
      isEmergency: deactivation.isEmergency,
      syncToStaffSystem: deactivation.syncToStaffSystem,
      status: deactivation.syncToStaffSystem ? 'synced' : 'pending'
    }
  });
}
```

---

**修正箇所2: logAuditAction()（143-177行目）**

**Before（LocalStorage）**:
```typescript
private async logAuditAction(
  deactivation: EmergencyDeactivation,
  executorUser: User
): Promise<void> {
  const auditLog = {
    id: generateId(),
    userId: executorUser.id,
    action: 'EMERGENCY_ACCOUNT_DEACTIVATION',
    entityType: 'User',
    entityId: deactivation.targetUserId,
    oldValues: {},
    newValues: { isRetired: true },
    ipAddress: getClientIP(),
    userAgent: getUserAgent(),
    timestamp: new Date()
  };

  const auditLogs = JSON.parse(localStorage.getItem('audit_logs') || '[]');
  auditLogs.push(auditLog);
  localStorage.setItem('audit_logs', JSON.stringify(auditLogs));
}
```

**After（Prisma）**:
```typescript
private async logAuditAction(
  deactivation: EmergencyDeactivation,
  executorUser: User
): Promise<void> {
  await prisma.auditLog.create({
    data: {
      userId: executorUser.id,
      action: 'EMERGENCY_ACCOUNT_DEACTIVATION',
      tableName: 'users',
      recordId: deactivation.targetUserId,

      // 既存フィールド
      changes: {
        oldValues: {},
        newValues: { isRetired: true, deactivatedBy: executorUser.name }
      },
      ipAddress: getClientIP(),
      userAgent: getUserAgent(),

      // 🆕 拡張フィールド
      executorLevel: executorUser.permissionLevel,
      targetUserId: deactivation.targetUserId,
      reason: deactivation.reason,
      isEmergencyAction: true,
      syncPending: !deactivation.syncToStaffSystem
    }
  });
}
```

---

**修正箇所3: notifyStaffSystemWhenAvailable()（183-201行目）**

**Before（LocalStorage）**:
```typescript
private async notifyStaffSystemWhenAvailable(targetUserId: string): Promise<void> {
  const syncQueue = JSON.parse(localStorage.getItem('staff_system_sync_queue') || '[]');
  syncQueue.push({
    userId: targetUserId,
    action: 'ACCOUNT_DEACTIVATION',
    timestamp: new Date()
  });
  localStorage.setItem('staff_system_sync_queue', JSON.stringify(syncQueue));
}
```

**After（Prisma）**:
```typescript
private async notifyStaffSystemWhenAvailable(
  deactivation: EmergencyDeactivation
): Promise<void> {
  const targetUser = await prisma.user.findUnique({
    where: { id: deactivation.targetUserId }
  });

  await prisma.staffSystemSyncQueue.create({
    data: {
      type: 'ACCOUNT_DEACTIVATION',
      targetUserId: deactivation.targetUserId,
      targetEmployeeId: targetUser?.employeeId,
      payload: {
        reason: deactivation.reason,
        executedBy: deactivation.executedBy,
        timestamp: deactivation.timestamp.toISOString()
      },
      relatedDeactivationId: deactivation.id,
      status: 'queued',
      retryCount: 0,
      maxRetries: 3
    }
  });
}
```

---

##### 1.3 テスト実装

**1.3.1 単体テスト**

**ファイル**: `src/__tests__/EmergencyAccountService.test.ts`

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EmergencyAccountService } from '../services/EmergencyAccountService';
import { prisma } from '../lib/prisma';

describe('EmergencyAccountService', () => {
  let service: EmergencyAccountService;

  beforeEach(() => {
    service = new EmergencyAccountService();
  });

  describe('deactivateAccount', () => {
    it('レベル14-17のユーザーはアカウントを停止できる', async () => {
      const executorUser = {
        id: 'user_admin',
        permissionLevel: 15,
        name: '人事部長',
        employeeId: 'EMP2020001'
      };

      const result = await service.deactivateAccount({
        targetUserId: 'user_target',
        reason: 'テスト用停止',
        executedBy: executorUser
      });

      expect(result.success).toBe(true);

      // EmergencyDeactivation作成確認
      const deactivation = await prisma.emergencyDeactivation.findFirst({
        where: { targetUserId: 'user_target' }
      });
      expect(deactivation).toBeTruthy();
      expect(deactivation.reason).toBe('テスト用停止');
    });

    it('レベル13以下のユーザーはアカウントを停止できない', async () => {
      const executorUser = {
        id: 'user_staff',
        permissionLevel: 13,
        name: '一般職員',
        employeeId: 'EMP2024001'
      };

      await expect(
        service.deactivateAccount({
          targetUserId: 'user_target',
          reason: 'テスト用停止',
          executedBy: executorUser
        })
      ).rejects.toThrow('権限がありません');
    });

    it('監査ログが正しく記録される', async () => {
      const executorUser = {
        id: 'user_admin',
        permissionLevel: 15,
        name: '人事部長',
        employeeId: 'EMP2020001'
      };

      await service.deactivateAccount({
        targetUserId: 'user_target',
        reason: 'テスト用停止',
        executedBy: executorUser
      });

      const auditLog = await prisma.auditLog.findFirst({
        where: {
          action: 'EMERGENCY_ACCOUNT_DEACTIVATION',
          targetUserId: 'user_target'
        }
      });

      expect(auditLog).toBeTruthy();
      expect(auditLog.isEmergencyAction).toBe(true);
      expect(auditLog.executorLevel).toBe(15);
    });
  });
});
```

**実行**:
```bash
npm test -- EmergencyAccountService.test.ts
```

---

**1.3.2 E2Eテスト（UI操作）**

**ファイル**: `src/__tests__/e2e/EmergencyAccountDeactivation.e2e.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EmergencyAccountDeactivation from '../../pages/EmergencyAccountDeactivation';

describe('EmergencyAccountDeactivation E2E', () => {
  it('レベル15ユーザーが正常にアカウントを停止できる', async () => {
    // モックユーザー（レベル15）
    const mockUser = {
      id: 'user_admin',
      permissionLevel: 15,
      name: '人事部長'
    };

    render(<EmergencyAccountDeactivation currentUser={mockUser} />);

    // ユーザーID入力
    const userIdInput = screen.getByLabelText('対象ユーザーID');
    fireEvent.change(userIdInput, { target: { value: 'user_target' } });

    // 理由入力
    const reasonInput = screen.getByLabelText('停止理由');
    fireEvent.change(reasonInput, { target: { value: 'E2Eテスト' } });

    // 実行ボタン押下
    const submitButton = screen.getByRole('button', { name: '停止実行' });
    fireEvent.click(submitButton);

    // 確認ダイアログ確認
    await waitFor(() => {
      expect(screen.getByText('アカウントを停止しますか？')).toBeInTheDocument();
    });

    // 確認ボタン押下
    const confirmButton = screen.getByRole('button', { name: '確認' });
    fireEvent.click(confirmButton);

    // 成功メッセージ確認
    await waitFor(() => {
      expect(screen.getByText('アカウント停止が完了しました')).toBeInTheDocument();
    }, { timeout: 5000 });
  });
});
```

**実行**:
```bash
npm run test:e2e
```

---

#### Phase 1完了条件

- [x] EmergencyDeactivationテーブル追加
- [x] StaffSystemSyncQueueテーブル追加
- [x] AuditLog拡張
- [x] EmergencyAccountService.ts修正（Prisma実装）
- [x] 単体テスト作成・実行
- [x] E2Eテスト作成・実行
- [x] マイグレーション実行

**成果物**:
- `prisma/schema.prisma`（更新）
- `src/services/EmergencyAccountService.ts`（修正）
- `src/__tests__/EmergencyAccountService.test.ts`（新規）
- `src/__tests__/e2e/EmergencyAccountDeactivation.e2e.test.ts`（新規）
- `prisma/migrations/xxx_add_emergency_deactivation/`（自動生成）
- `prisma/migrations/xxx_add_staff_system_sync_queue/`（自動生成）
- `prisma/migrations/xxx_extend_audit_log_for_emergency/`（自動生成）

---

### Phase 2: Webhook連携（3-5日） 🟡 **医療チーム実装待ち**

#### 目標
VoiceDriveと医療システム間の双方向Webhook連携を実装し、アカウント停止の同期を実現する。

#### 前提条件
- ✅ Phase 1完了
- ⏳ 医療システム側のWebhook受信エンドポイント実装完了
- ⏳ 医療システム側の確認Webhook送信実装完了
- ⏳ HMAC共有シークレットキーの共有完了

---

#### 実装内容

##### 2.1 Webhook送信機能（VoiceDrive → 医療システム）

**2.1.1 MedicalSystemWebhookService.ts実装**

**ファイル**: `src/services/MedicalSystemWebhookService.ts`

```typescript
import crypto from 'crypto';

// Webhook設定
const MEDICAL_SYSTEM_WEBHOOK_URL =
  process.env.MEDICAL_SYSTEM_WEBHOOK_URL ||
  'https://medical-system.local/api/webhooks/voicedrive-emergency-deactivation';

const MEDICAL_SYSTEM_WEBHOOK_SECRET =
  process.env.MEDICAL_SYSTEM_WEBHOOK_SECRET || '';

const WEBHOOK_TIMEOUT = 30000; // 30秒
const WEBHOOK_MAX_RETRIES = 3;
const WEBHOOK_RETRY_INTERVALS = [60000, 300000, 900000]; // 1分、5分、15分

// HMAC署名生成
function generateHMAC(payload: any): string {
  const hmac = crypto.createHmac('sha256', MEDICAL_SYSTEM_WEBHOOK_SECRET);
  hmac.update(JSON.stringify(payload));
  return hmac.digest('hex');
}

// アカウント緊急停止通知
export async function sendEmergencyDeactivationNotification(
  deactivation: EmergencyDeactivation
): Promise<{ success: boolean; error?: string }> {
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

  const signature = generateHMAC(payload);

  try {
    const response = await fetch(MEDICAL_SYSTEM_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VoiceDrive-Signature': signature
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(WEBHOOK_TIMEOUT)
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Webhook送信失敗:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// リトライロジック付きWebhook送信
export async function sendEmergencyDeactivationNotificationWithRetry(
  deactivation: EmergencyDeactivation
): Promise<{ success: boolean; error?: string }> {
  let lastError: string | undefined;

  for (let i = 0; i < WEBHOOK_MAX_RETRIES; i++) {
    const result = await sendEmergencyDeactivationNotification(deactivation);

    if (result.success) {
      // 成功 → EmergencyDeactivation更新
      await prisma.emergencyDeactivation.update({
        where: { id: deactivation.id },
        data: {
          status: 'synced',
          syncToStaffSystem: true,
          syncedAt: new Date()
        }
      });

      // SyncQueue更新
      await prisma.staffSystemSyncQueue.updateMany({
        where: { relatedDeactivationId: deactivation.id },
        data: {
          status: 'completed',
          completedAt: new Date()
        }
      });

      return { success: true };
    }

    lastError = result.error;

    // リトライ待機
    if (i < WEBHOOK_MAX_RETRIES - 1) {
      await new Promise((resolve) =>
        setTimeout(resolve, WEBHOOK_RETRY_INTERVALS[i])
      );
    }
  }

  // 3回失敗 → SyncQueueに蓄積
  await prisma.staffSystemSyncQueue.updateMany({
    where: { relatedDeactivationId: deactivation.id },
    data: {
      status: 'failed',
      retryCount: WEBHOOK_MAX_RETRIES,
      errorMessage: lastError
    }
  });

  return { success: false, error: lastError };
}
```

---

**2.1.2 EmergencyAccountService.tsにWebhook送信を統合**

**ファイル**: `src/services/EmergencyAccountService.ts`

**修正箇所**: `deactivateAccount()`メソッド

```typescript
import { sendEmergencyDeactivationNotificationWithRetry } from './MedicalSystemWebhookService';

public async deactivateAccount(params: DeactivateAccountParams): Promise<DeactivateAccountResult> {
  // 権限チェック
  if (params.executedBy.permissionLevel < 14 || params.executedBy.permissionLevel > 17) {
    throw new Error('権限がありません');
  }

  // EmergencyDeactivation作成
  const deactivation = await this.saveDeactivationRecord({
    targetUserId: params.targetUserId,
    reason: params.reason,
    executedBy: params.executedBy.id,
    timestamp: new Date(),
    isEmergency: true,
    syncToStaffSystem: false
  });

  // 監査ログ記録
  await this.logAuditAction(deactivation, params.executedBy);

  // 🆕 Webhook送信（非同期）
  const webhookResult = await sendEmergencyDeactivationNotificationWithRetry(deactivation);

  if (!webhookResult.success) {
    // Webhook失敗 → SyncQueueに蓄積済み
    console.warn('医療システムへの通知失敗 → 同期キューに蓄積');
  }

  return {
    success: true,
    deactivationId: deactivation.id,
    syncedToMedicalSystem: webhookResult.success
  };
}
```

---

##### 2.2 Webhook受信機能（医療システム → VoiceDrive）

**2.2.1 確認Webhook受信エンドポイント実装**

**ファイル**: `src/api/webhooks/account-deactivation-confirmed.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

const MEDICAL_SYSTEM_WEBHOOK_SECRET =
  process.env.MEDICAL_SYSTEM_WEBHOOK_SECRET || '';

// HMAC署名検証
function verifyHMAC(payload: any, signature: string): boolean {
  const hmac = crypto.createHmac('sha256', MEDICAL_SYSTEM_WEBHOOK_SECRET);
  hmac.update(JSON.stringify(payload));
  const expectedSignature = hmac.digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const signature = request.headers.get('X-Medical-System-Signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    }

    // 署名検証
    const isValid = verifyHMAC(payload, signature);
    if (!isValid) {
      console.error('署名検証失敗:', { payload, signature });
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // EmergencyDeactivation更新
    await prisma.emergencyDeactivation.update({
      where: { id: payload.deactivationId },
      data: {
        syncToStaffSystem: true,
        syncedAt: new Date(payload.medicalSystemConfirmedAt),
        status: payload.status === 'completed' ? 'synced' : 'failed',
        errorMessage: payload.status !== 'completed' ? payload.error : null
      }
    });

    // SyncQueue完了
    await prisma.staffSystemSyncQueue.updateMany({
      where: { relatedDeactivationId: payload.deactivationId },
      data: {
        status: payload.status === 'completed' ? 'completed' : 'failed',
        completedAt: new Date()
      }
    });

    // User.isRetired更新（VoiceDrive側キャッシュ）
    if (payload.status === 'completed') {
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
    }

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Webhook受信エラー:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
```

---

##### 2.3 環境変数設定

**ファイル**: `.env.production`（本番環境）

```env
# 医療システムWebhook設定
MEDICAL_SYSTEM_WEBHOOK_URL=https://medical-system.local/api/webhooks/voicedrive-emergency-deactivation
MEDICAL_SYSTEM_WEBHOOK_SECRET=your-shared-secret-key-here

# Webhook受信設定（VoiceDrive側のURL）
VOICEDRIVE_WEBHOOK_URL=https://voicedrive.ai/api/webhooks/account-deactivation-confirmed
```

**ファイル**: `.env.development`（開発環境）

```env
# 医療システムWebhook設定（ローカル）
MEDICAL_SYSTEM_WEBHOOK_URL=http://localhost:3000/api/webhooks/voicedrive-emergency-deactivation
MEDICAL_SYSTEM_WEBHOOK_SECRET=test-secret-key

# Webhook受信設定（ローカル）
VOICEDRIVE_WEBHOOK_URL=http://localhost:3001/api/webhooks/account-deactivation-confirmed
```

---

##### 2.4 統合テスト（モック使用）

**ファイル**: `src/__tests__/integration/Webhook.integration.test.ts`

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupTestServer } from '../helpers/testServer';
import { sendEmergencyDeactivationNotification } from '../../services/MedicalSystemWebhookService';

describe('Webhook統合テスト', () => {
  let testServer: any;

  beforeAll(() => {
    testServer = setupTestServer();
  });

  afterAll(() => {
    testServer.close();
  });

  it('VoiceDrive → 医療システムのWebhook送信が成功する', async () => {
    const mockDeactivation = {
      id: 'deact_test123',
      targetUserId: 'user_target',
      targetEmployeeId: 'EMP2024001',
      executedBy: 'user_admin',
      executorEmployeeId: 'EMP2020001',
      executorName: '人事部長',
      executorLevel: 15,
      reason: 'テスト用停止',
      timestamp: new Date(),
      isEmergency: true,
      syncToStaffSystem: false,
      status: 'pending'
    };

    const result = await sendEmergencyDeactivationNotification(mockDeactivation);

    expect(result.success).toBe(true);
  });

  it('医療システム → VoiceDriveの確認Webhook受信が成功する', async () => {
    const mockPayload = {
      eventType: 'account.deactivation_confirmed',
      timestamp: new Date().toISOString(),
      deactivationId: 'deact_test123',
      employeeId: 'EMP2024001',
      status: 'completed',
      medicalSystemConfirmedAt: new Date().toISOString()
    };

    const signature = generateHMAC(mockPayload);

    const response = await fetch('http://localhost:3001/api/webhooks/account-deactivation-confirmed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Medical-System-Signature': signature
      },
      body: JSON.stringify(mockPayload)
    });

    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.status).toBe('ok');
  });
});
```

**実行**:
```bash
npm run test:integration
```

---

#### Phase 2完了条件

- [x] MedicalSystemWebhookService.ts実装
- [x] /api/webhooks/account-deactivation-confirmed.ts実装
- [x] HMAC署名生成・検証実装
- [x] EmergencyAccountService.tsにWebhook送信統合
- [x] 環境変数設定
- [x] 統合テスト作成・実行（モック）
- [ ] 医療システム側の実装完了（医療チーム作業）
- [ ] 医療システムとの統合テスト実施

**成果物**:
- `src/services/MedicalSystemWebhookService.ts`（新規）
- `src/api/webhooks/account-deactivation-confirmed.ts`（新規）
- `src/services/EmergencyAccountService.ts`（修正）
- `.env.production`（更新）
- `.env.development`（更新）
- `src/__tests__/integration/Webhook.integration.test.ts`（新規）

---

### Phase 3: 自動同期機能（2-3日） 🟢 **Phase 2後**

#### 目標
医療システム復旧後、同期キューに蓄積された操作を自動的に医療システムに送信する機能を実装する。

#### 実装内容

##### 3.1 ヘルスチェック機能

**ファイル**: `src/jobs/medicalSystemHealthCheck.ts`

```typescript
import { prisma } from '../lib/prisma';
import { processSyncQueue } from './processSyncQueue';

const MEDICAL_SYSTEM_HEALTH_URL =
  process.env.MEDICAL_SYSTEM_HEALTH_URL ||
  'https://medical-system.local/api/health/status';

const HEALTH_CHECK_TIMEOUT = 10000; // 10秒

// 医療システムヘルスチェック
export async function checkMedicalSystemHealth(): Promise<boolean> {
  try {
    const response = await fetch(MEDICAL_SYSTEM_HEALTH_URL, {
      signal: AbortSignal.timeout(HEALTH_CHECK_TIMEOUT)
    });

    if (!response.ok) {
      console.log('医療システム: 障害中');
      return false;
    }

    const health = await response.json();

    if (health.status === 'healthy') {
      console.log('医療システム: 正常稼働中');
      return true;
    } else {
      console.log('医療システム: 部分的障害');
      return false;
    }
  } catch (error) {
    console.error('医療システムヘルスチェック失敗:', error);
    return false;
  }
}

// 定期ヘルスチェック＋同期キュー処理
export async function periodicHealthCheckAndSync(): Promise<void> {
  const isHealthy = await checkMedicalSystemHealth();

  if (isHealthy) {
    // 医療システム復旧 → 同期キュー処理
    const queuedCount = await prisma.staffSystemSyncQueue.count({
      where: {
        status: { in: ['queued', 'failed'] },
        retryCount: { lt: 3 }
      }
    });

    if (queuedCount > 0) {
      console.log(`同期キュー処理開始: ${queuedCount}件`);
      await processSyncQueue();
    }
  }
}
```

---

##### 3.2 同期キュー処理

**ファイル**: `src/jobs/processSyncQueue.ts`

```typescript
import { prisma } from '../lib/prisma';
import { sendEmergencyDeactivationNotification } from '../services/MedicalSystemWebhookService';

// 同期キュー処理
export async function processSyncQueue(): Promise<void> {
  const queuedItems = await prisma.staffSystemSyncQueue.findMany({
    where: {
      status: { in: ['queued', 'failed'] },
      retryCount: { lt: 3 }
    },
    orderBy: { queuedAt: 'asc' }
  });

  console.log(`同期キュー処理: ${queuedItems.length}件`);

  for (const item of queuedItems) {
    await processQueueItem(item);
  }
}

// キューアイテム処理
async function processQueueItem(item: StaffSystemSyncQueue): Promise<void> {
  try {
    // ステータス更新: processing
    await prisma.staffSystemSyncQueue.update({
      where: { id: item.id },
      data: {
        status: 'processing',
        processedAt: new Date()
      }
    });

    // タイプ別処理
    switch (item.type) {
      case 'ACCOUNT_DEACTIVATION':
        await processAccountDeactivation(item);
        break;
      case 'ACCOUNT_REACTIVATION':
        await processAccountReactivation(item);
        break;
      case 'USER_UPDATE':
        await processUserUpdate(item);
        break;
      default:
        throw new Error(`Unknown sync type: ${item.type}`);
    }

    // 成功 → completed
    await prisma.staffSystemSyncQueue.update({
      where: { id: item.id },
      data: {
        status: 'completed',
        completedAt: new Date()
      }
    });

    console.log(`同期成功: ${item.id} (${item.type})`);
  } catch (error) {
    // 失敗 → リトライカウント増加
    const newRetryCount = item.retryCount + 1;
    const nextRetryAt = new Date(Date.now() + getRetryInterval(newRetryCount));

    await prisma.staffSystemSyncQueue.update({
      where: { id: item.id },
      data: {
        status: 'failed',
        retryCount: newRetryCount,
        nextRetryAt,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorStack: error instanceof Error ? error.stack : undefined
      }
    });

    console.error(`同期失敗: ${item.id} (リトライ: ${newRetryCount}/3)`);
  }
}

// アカウント無効化処理
async function processAccountDeactivation(item: StaffSystemSyncQueue): Promise<void> {
  const deactivation = await prisma.emergencyDeactivation.findUnique({
    where: { id: item.relatedDeactivationId || '' }
  });

  if (!deactivation) {
    throw new Error(`EmergencyDeactivation not found: ${item.relatedDeactivationId}`);
  }

  const result = await sendEmergencyDeactivationNotification(deactivation);

  if (!result.success) {
    throw new Error(result.error || 'Webhook failed');
  }
}

// アカウント再有効化処理（今後実装）
async function processAccountReactivation(item: StaffSystemSyncQueue): Promise<void> {
  // TODO: 実装
  throw new Error('Not implemented yet');
}

// ユーザー更新処理（今後実装）
async function processUserUpdate(item: StaffSystemSyncQueue): Promise<void> {
  // TODO: 実装
  throw new Error('Not implemented yet');
}

// リトライ間隔計算
function getRetryInterval(retryCount: number): number {
  const intervals = [60000, 300000, 900000]; // 1分、5分、15分
  return intervals[Math.min(retryCount - 1, intervals.length - 1)];
}
```

---

##### 3.3 Cronジョブ設定

**ファイル**: `src/jobs/index.ts`

```typescript
import cron from 'node-cron';
import { periodicHealthCheckAndSync } from './medicalSystemHealthCheck';

// 5分ごとにヘルスチェック＋同期キュー処理
cron.schedule('*/5 * * * *', async () => {
  console.log('医療システムヘルスチェック開始');
  await periodicHealthCheckAndSync();
});

console.log('Cronジョブ起動完了: 5分ごとにヘルスチェック');
```

**ファイル**: `src/server.ts`（サーバー起動時にCronジョブを起動）

```typescript
import './jobs'; // Cronジョブ起動

// サーバー起動処理
// ...
```

---

##### 3.4 リトライロジックテスト

**ファイル**: `src/__tests__/processSyncQueue.test.ts`

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { processSyncQueue } from '../jobs/processSyncQueue';
import { prisma } from '../lib/prisma';

describe('processSyncQueue', () => {
  beforeEach(async () => {
    // テストデータクリア
    await prisma.staffSystemSyncQueue.deleteMany({});
  });

  it('キューアイテムを正しく処理する', async () => {
    // テスト用キューアイテム作成
    await prisma.staffSystemSyncQueue.create({
      data: {
        type: 'ACCOUNT_DEACTIVATION',
        targetUserId: 'user_target',
        targetEmployeeId: 'EMP2024001',
        payload: {
          reason: 'テスト用停止',
          executedBy: 'user_admin',
          timestamp: new Date().toISOString()
        },
        relatedDeactivationId: 'deact_test123',
        status: 'queued',
        retryCount: 0
      }
    });

    // 同期キュー処理実行
    await processSyncQueue();

    // 結果確認
    const processed = await prisma.staffSystemSyncQueue.findFirst({
      where: { targetUserId: 'user_target' }
    });

    expect(processed.status).toBe('completed');
  });

  it('失敗時にリトライカウントが増加する', async () => {
    // 失敗するキューアイテム作成（無効なdeactivationId）
    await prisma.staffSystemSyncQueue.create({
      data: {
        type: 'ACCOUNT_DEACTIVATION',
        targetUserId: 'user_target',
        payload: {},
        relatedDeactivationId: 'invalid_id',
        status: 'queued',
        retryCount: 0
      }
    });

    // 同期キュー処理実行
    await processSyncQueue();

    // 結果確認
    const failed = await prisma.staffSystemSyncQueue.findFirst({
      where: { targetUserId: 'user_target' }
    });

    expect(failed.status).toBe('failed');
    expect(failed.retryCount).toBe(1);
    expect(failed.nextRetryAt).toBeTruthy();
  });
});
```

**実行**:
```bash
npm test -- processSyncQueue.test.ts
```

---

#### Phase 3完了条件

- [x] checkMedicalSystemHealth.ts実装
- [x] processSyncQueue.ts実装
- [x] Cronジョブ設定
- [x] リトライロジック実装
- [x] テスト作成・実行
- [ ] 負荷テスト実施
- [ ] エラーハンドリング確認

**成果物**:
- `src/jobs/medicalSystemHealthCheck.ts`（新規）
- `src/jobs/processSyncQueue.ts`（新規）
- `src/jobs/index.ts`（新規）
- `src/server.ts`（修正）
- `src/__tests__/processSyncQueue.test.ts`（新規）

---

### Phase 4: 統合テスト・本番リリース（1週間） 🟢 **Phase 3後**

#### 目標
医療システムとの統合テストを実施し、本番環境にリリースする。

#### 実装内容

##### 4.1 統合テスト

**4.1.1 障害シミュレーション**

**テストシナリオ**:
1. 医療システム障害中にVoiceDriveでアカウント停止実行
2. SyncQueueに蓄積されることを確認
3. 医療システム復旧
4. 5分以内に自動同期されることを確認

**ファイル**: `src/__tests__/integration/FailoverSimulation.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { EmergencyAccountService } from '../../services/EmergencyAccountService';
import { periodicHealthCheckAndSync } from '../../jobs/medicalSystemHealthCheck';
import { prisma } from '../../lib/prisma';

describe('障害シミュレーション', () => {
  it('医療システム障害中の停止→復旧後の自動同期', async () => {
    // 1. 医療システムダウン状態で停止実行
    const service = new EmergencyAccountService();
    const result = await service.deactivateAccount({
      targetUserId: 'user_test',
      reason: '障害テスト',
      executedBy: { id: 'user_admin', permissionLevel: 15, name: '人事部長' }
    });

    expect(result.success).toBe(true);
    expect(result.syncedToMedicalSystem).toBe(false);

    // SyncQueueに蓄積確認
    const queued = await prisma.staffSystemSyncQueue.findFirst({
      where: { targetUserId: 'user_test', status: 'queued' }
    });
    expect(queued).toBeTruthy();

    // 2. 医療システム復旧（モック）
    // （医療システムのヘルスチェックエンドポイントを正常に戻す）

    // 3. 定期ヘルスチェック実行
    await periodicHealthCheckAndSync();

    // 4. 同期完了確認
    const synced = await prisma.staffSystemSyncQueue.findFirst({
      where: { targetUserId: 'user_test' }
    });
    expect(synced.status).toBe('completed');
  });
});
```

---

**4.1.2 復旧シミュレーション**

**テストシナリオ**:
1. 複数のアカウント停止を同期キューに蓄積（10件）
2. 医療システム復旧
3. 全て正しく同期されることを確認

---

**4.1.3 負荷テスト**

**テストシナリオ**:
- 100件の同期キューを一度に処理
- レート制限やタイムアウトが正しく動作することを確認

---

##### 4.2 ドキュメント整備

**4.2.1 API仕様書（OpenAPI 3.0）**

**ファイル**: `docs/api/emergency-account-deactivation-api.yaml`

```yaml
openapi: 3.0.0
info:
  title: アカウント緊急無効化 API仕様書
  version: 1.0.0
  description: VoiceDriveと医療システム間のWebhook連携仕様

servers:
  - url: https://voicedrive.ai/api
    description: VoiceDrive本番環境
  - url: https://medical-system.local/api
    description: 医療システム本番環境

paths:
  /webhooks/voicedrive-emergency-deactivation:
    post:
      summary: アカウント緊急停止通知（医療システム側）
      description: VoiceDriveから医療システムへのアカウント停止通知
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/EmergencyDeactivationNotification'
      responses:
        '200':
          description: 処理成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SuccessResponse'
        '401':
          description: 署名検証失敗
        '500':
          description: サーバーエラー

  /webhooks/account-deactivation-confirmed:
    post:
      summary: アカウント停止確認通知（VoiceDrive側）
      description: 医療システムからVoiceDriveへの停止完了通知
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/DeactivationConfirmedNotification'
      responses:
        '200':
          description: 処理成功
        '401':
          description: 署名検証失敗

components:
  schemas:
    EmergencyDeactivationNotification:
      type: object
      required:
        - eventType
        - timestamp
        - deactivationId
        - employeeId
        - reason
        - executedBy
        - signature
      properties:
        eventType:
          type: string
          example: account.emergency_deactivation
        timestamp:
          type: string
          format: date-time
        deactivationId:
          type: string
        employeeId:
          type: string
        targetUserId:
          type: string
        reason:
          type: string
        executedBy:
          $ref: '#/components/schemas/Executor'
        signature:
          type: string

    Executor:
      type: object
      properties:
        userId:
          type: string
        employeeId:
          type: string
        name:
          type: string
        permissionLevel:
          type: number

    DeactivationConfirmedNotification:
      type: object
      properties:
        eventType:
          type: string
        timestamp:
          type: string
          format: date-time
        deactivationId:
          type: string
        employeeId:
          type: string
        status:
          type: string
          enum: [completed, failed]
        medicalSystemConfirmedAt:
          type: string
          format: date-time
        signature:
          type: string

    SuccessResponse:
      type: object
      properties:
        status:
          type: string
          example: ok
        timestamp:
          type: string
          format: date-time
```

---

**4.2.2 運用手順書**

**ファイル**: `docs/operation/emergency-account-deactivation-ops.md`

（緊急停止手順、停止解除手順、障害時の対応、トラブルシューティング等）

---

**4.2.3 トラブルシューティングガイド**

**ファイル**: `docs/troubleshooting/emergency-account-deactivation.md`

**よくある問題**:
1. Webhook送信失敗（401 Unauthorized）
   - 原因: HMAC署名不一致
   - 対処: 環境変数の共有シークレットキーを確認

2. 同期キューが処理されない
   - 原因: Cronジョブ未起動
   - 対処: `src/jobs/index.ts`がサーバー起動時にロードされているか確認

3. 医療システムヘルスチェック失敗
   - 原因: ネットワーク障害
   - 対処: VPN接続確認、医療システムのファイアウォール設定確認

---

##### 4.3 段階的ロールアウト

**Week 1: テスト環境デプロイ**
- テスト環境にPhase 1-3を全デプロイ
- 医療システムチームと統合テスト実施

**Week 2: ステージング環境デプロイ**
- ステージング環境にデプロイ
- 本番同等の環境で最終テスト

**Week 3: 本番環境デプロイ**
- カナリアリリース（10%のユーザーのみ）
- 問題なければ100%にロールアウト

---

#### Phase 4完了条件

- [ ] 障害シミュレーションテスト実施
- [ ] 復旧シミュレーションテスト実施
- [ ] 負荷テスト実施
- [ ] API仕様書作成
- [ ] 運用手順書作成
- [ ] トラブルシューティングガイド作成
- [ ] テスト環境デプロイ完了
- [ ] ステージング環境デプロイ完了
- [ ] 本番環境デプロイ完了

**成果物**:
- `src/__tests__/integration/FailoverSimulation.test.ts`（新規）
- `docs/api/emergency-account-deactivation-api.yaml`（新規）
- `docs/operation/emergency-account-deactivation-ops.md`（新規）
- `docs/troubleshooting/emergency-account-deactivation.md`（新規）

---

## 📊 全体スケジュール

### タイムライン（4週間）

| Week | Phase | 主な作業 | 成果物 | 依存関係 |
|------|-------|---------|--------|---------|
| **Week 1** | Phase 1 | DB実装移行 | テーブル3件、Service修正、テスト | なし |
| **Week 2** | Phase 2 | Webhook連携 | Webhook送受信、統合テスト | Phase 1完了、医療チーム実装待ち |
| **Week 3** | Phase 3 | 自動同期機能 | ヘルスチェック、SyncQueue処理 | Phase 2完了 |
| **Week 4** | Phase 4 | 統合テスト・リリース | ドキュメント、本番デプロイ | Phase 3完了 |

---

### マイルストーン

| 日程 | マイルストーン | 状態 |
|------|--------------|------|
| **2025-10-11** | Phase 1開始（DB実装） | ⏳ |
| **2025-10-14** | Phase 1完了 | ⏳ |
| **2025-10-15** | Phase 2開始（Webhook連携） | ⏳ 医療チーム実装待ち |
| **2025-10-21** | Phase 2完了 | ⏳ |
| **2025-10-22** | Phase 3開始（自動同期） | ⏳ |
| **2025-10-25** | Phase 3完了 | ⏳ |
| **2025-10-28** | Phase 4開始（統合テスト） | ⏳ |
| **2025-11-04** | 本番リリース | ⏳ |

---

## ✅ チェックリスト

### Phase 1: DB実装移行

#### テーブル追加
- [ ] EmergencyDeactivationテーブル追加（schema.prisma）
- [ ] StaffSystemSyncQueueテーブル追加（schema.prisma）
- [ ] AuditLog拡張（schema.prisma）
- [ ] マイグレーション実行（development）
- [ ] マイグレーション実行（production）

#### Service修正
- [ ] EmergencyAccountService.ts: saveDeactivationRecord()修正
- [ ] EmergencyAccountService.ts: logAuditAction()修正
- [ ] EmergencyAccountService.ts: notifyStaffSystemWhenAvailable()修正

#### テスト
- [ ] 単体テスト作成（EmergencyAccountService.test.ts）
- [ ] E2Eテスト作成（EmergencyAccountDeactivation.e2e.test.ts）
- [ ] 全テスト実行・合格

---

### Phase 2: Webhook連携

#### Webhook送信
- [ ] MedicalSystemWebhookService.ts実装
- [ ] HMAC署名生成実装
- [ ] リトライロジック実装
- [ ] EmergencyAccountService.tsに統合

#### Webhook受信
- [ ] /api/webhooks/account-deactivation-confirmed.ts実装
- [ ] HMAC署名検証実装
- [ ] EmergencyDeactivation更新ロジック実装
- [ ] User.isRetired更新ロジック実装

#### 環境設定
- [ ] .env.production更新
- [ ] .env.development更新
- [ ] 医療システムチームと共有シークレットキー共有

#### テスト
- [ ] 統合テスト作成（モック使用）
- [ ] 医療システムとの統合テスト実施

---

### Phase 3: 自動同期機能

#### ヘルスチェック
- [ ] checkMedicalSystemHealth.ts実装
- [ ] periodicHealthCheckAndSync()実装

#### SyncQueue処理
- [ ] processSyncQueue.ts実装
- [ ] processQueueItem()実装
- [ ] リトライロジック実装

#### Cronジョブ
- [ ] Cronジョブ設定（5分ごと）
- [ ] サーバー起動時のCronジョブ起動確認

#### テスト
- [ ] processSyncQueue.test.ts作成
- [ ] リトライロジックテスト
- [ ] 負荷テスト

---

### Phase 4: 統合テスト・リリース

#### 統合テスト
- [ ] 障害シミュレーションテスト
- [ ] 復旧シミュレーションテスト
- [ ] 負荷テスト（100件同期）

#### ドキュメント
- [ ] API仕様書（OpenAPI 3.0）
- [ ] Webhookペイロード仕様書
- [ ] 運用手順書
- [ ] トラブルシューティングガイド

#### デプロイ
- [ ] テスト環境デプロイ
- [ ] ステージング環境デプロイ
- [ ] 本番環境デプロイ（カナリア）
- [ ] 本番環境ロールアウト（100%）

---

## 📝 補足資料

### 参照ドキュメント

1. **医療システムへの回答書・確認書**
   `mcp-shared/docs/Response_EmergencyAccountDeactivation_Requirements_20251010.md`

2. **データ管理責任分界点定義書**
   `mcp-shared/docs/データ管理責任分界点定義書_20251008.md`

3. **アカウント無効化 暫定マスターリスト**
   （ユーザー提供ドキュメント）

4. **アカウント無効化 DB要件分析**
   （ユーザー提供ドキュメント）

---

### 技術スタック

**VoiceDrive**:
- **DB**: MySQL 8.0 (AWS Lightsail 16GB) → SQLite（開発環境）
- **ORM**: Prisma
- **言語**: TypeScript
- **フレームワーク**: React + Vite
- **Cron**: node-cron

**医療システム**:
- **DB**: MySQL 8.0 (AWS Lightsail 16GB)
- **ORM**: Prisma
- **言語**: TypeScript
- **フレームワーク**: Next.js + NestJS

---

## 🔄 更新履歴

| 日付 | 内容 | 担当 |
|------|------|------|
| 2025-10-10 | 初版作成 | VoiceDriveチーム |

---

**VoiceDriveチーム（職員カルテシステム）**
**作成日**: 2025年10月10日
**文書番号**: PLAN-2025-1010-001

---

**文書終了**
