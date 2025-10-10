# アカウント緊急無効化機能 DB要件分析（医療システム側）

**文書番号**: DB-REQ-2025-1010-001
**作成日**: 2025年10月10日
**対象システム**: 医療職員管理システム
**対象機能**: アカウント緊急無効化 Webhook連携
**優先度**: 🔴 **CRITICAL（グループ0: 緊急機能）**

---

## 📋 エグゼクティブサマリー

### 背景
VoiceDriveチームより、医療システム障害時の応急措置として「アカウント緊急無効化機能」の連携依頼を受領しました。本機能は人事部門（レベル14-17）専用であり、監査要件を満たすため医療システムとの双方向連携が必須となります。

### 医療システム側の実装範囲

#### ✅ VoiceDrive側で実装済み・実装予定
- LocalStorageからPrisma DBへの移行（Phase 1: 2-3日）
- EmergencyDeactivation、StaffSystemSyncQueueテーブル追加
- VoiceDrive → 医療システム Webhook送信実装
- 医療システム → VoiceDrive Webhook受信実装
- 自動同期機能（ヘルスチェック + キュー処理）

#### 🔴 医療システム側で実装必須（本ドキュメントの対象）
1. **Webhook受信エンドポイント実装**（1件）
2. **Webhook送信機能実装**（1件）
3. **ヘルスチェックAPI実装**（1件）
4. **DB更新処理**（Employee.accountStatus等）
5. **監査ログ記録**（EmployeeAccountStatusHistory）

---

## 🎯 機能概要

### 利用シーン
1. **退職者のアカウント即時停止**: 医療システム障害中に退職者が発生した場合
2. **セキュリティインシデント対応**: 不正アクセスの疑いがある場合
3. **コンプライアンス対応**: 懲戒処分等で即座にアクセスを遮断する必要がある場合

### データフロー

```
【正常時】
1. VoiceDrive: アカウント緊急停止実行（レベル14-17のみ）
2. VoiceDrive: Webhook送信 → 医療システム
3. 医療システム: Employee.accountStatus = 'inactive' 更新
4. 医療システム: EmployeeAccountStatusHistory記録
5. 医療システム: 確認Webhook送信 → VoiceDrive
6. VoiceDrive: EmergencyDeactivation.syncToStaffSystem = true 更新

【医療システム障害時】
1. VoiceDrive: アカウント緊急停止実行
2. VoiceDrive: Webhook送信失敗（医療システム障害中）
3. VoiceDrive: SyncQueueに蓄積
4. VoiceDrive: 5分ごとにヘルスチェック実行
5. 医療システム: 復旧
6. VoiceDrive: 復旧検知 → SyncQueue処理開始
7. VoiceDrive: Webhook再送信 → 医療システム
8. 医療システム: 正常時と同じ処理
```

---

## 📊 医療システム側のDB要件

### 1. 既存テーブルの活用

#### 1.1 Employee（職員マスタ）

**既存フィールド**:
```prisma
model Employee {
  id              String    @id @default(cuid())
  employeeCode    String    @unique
  // ... 他のフィールド
  status          String    @default("active") // active, leave, retired
  // ... 他のフィールド
}
```

**使用方法**:
- `status`フィールドを更新してアカウント停止を実現
- VoiceDriveのWebhookを受信し、`status = 'inactive'`に更新

**⚠️ 注意**:
- `status`は既存フィールドのため、新規追加不要
- ただし、緊急停止の場合は`status = 'inactive'`とする運用を推奨

---

### 2. 新規テーブルの追加（推奨）

#### 2.1 EmployeeAccountStatusHistory（アカウント状態変更履歴）

**優先度**: 🟡 RECOMMENDED（監査要件を満たすため強く推奨）

**テーブル定義**:
```prisma
// 職員アカウント状態変更履歴
model EmployeeAccountStatusHistory {
  id                       String    @id @default(cuid())
  employeeId               String    @map("employee_id")
  previousStatus           String    @map("previous_status")  // 変更前のステータス
  newStatus                String    @map("new_status")       // 変更後のステータス
  reason                   String    @db.Text                 // 変更理由
  changedBy                String    @map("changed_by")       // 変更者の職員コード
  changedByName            String?   @map("changed_by_name")  // 変更者の氏名
  isEmergencyChange        Boolean   @default(false) @map("is_emergency_change") // 緊急変更フラグ
  sourceSystem             String    @default("medical_system") // 'medical_system' | 'voicedrive'
  voiceDriveDeactivationId String?   @map("voicedrive_deactivation_id") // VoiceDrive側のdeactivationId
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

**使用目的**:
- アカウント状態変更の完全な履歴を記録
- 緊急停止操作の監査証跡を確保
- VoiceDriveからの操作と医療システム独自の操作を区別

**Employeeテーブルへのリレーション追加**:
```prisma
model Employee {
  // ... 既存フィールド

  accountStatusHistory EmployeeAccountStatusHistory[]

  // ... 既存のリレーション
}
```

---

## 🔗 医療システム側の実装要件

### 依頼1: Webhook受信エンドポイント実装

#### エンドポイント仕様

**URL**: `POST /api/webhooks/voicedrive-emergency-deactivation`

**認証**: HMAC-SHA256署名検証

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

#### 実装例

**ファイル**: `src/api/webhooks/voicedrive-emergency-deactivation.ts`

```typescript
import { Request, Response } from 'express';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

const VOICEDRIVE_WEBHOOK_SECRET = process.env.VOICEDRIVE_WEBHOOK_SECRET || '';

// HMAC署名検証
function verifyHMAC(payload: any, signature: string): boolean {
  const hmac = crypto.createHmac('sha256', VOICEDRIVE_WEBHOOK_SECRET);
  hmac.update(JSON.stringify(payload));
  const expectedSignature = hmac.digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Webhook受信処理
export async function handleEmergencyDeactivation(req: Request, res: Response) {
  try {
    const payload = req.body;
    const signature = req.headers['x-voicedrive-signature'] as string;

    if (!signature) {
      return res.status(401).json({
        error: 'Missing signature',
        timestamp: new Date().toISOString()
      });
    }

    // 署名検証
    const isValid = verifyHMAC(payload, signature);
    if (!isValid) {
      console.error('[Webhook] 署名検証失敗:', { payload, signature });
      return res.status(401).json({
        error: 'Invalid signature',
        timestamp: new Date().toISOString()
      });
    }

    // 対象職員を取得
    const employee = await prisma.employee.findUnique({
      where: { employeeCode: payload.employeeId }
    });

    if (!employee) {
      return res.status(404).json({
        error: 'Employee not found',
        employeeId: payload.employeeId,
        timestamp: new Date().toISOString()
      });
    }

    // 前のステータスを記録
    const previousStatus = employee.status;

    // Employee.status更新
    await prisma.employee.update({
      where: { employeeCode: payload.employeeId },
      data: {
        status: 'inactive',
        updatedAt: new Date()
      }
    });

    // EmployeeAccountStatusHistory記録
    await prisma.employeeAccountStatusHistory.create({
      data: {
        employeeId: employee.id,
        previousStatus,
        newStatus: 'inactive',
        reason: payload.reason,
        changedBy: payload.executedBy.employeeId,
        changedByName: payload.executedBy.name,
        isEmergencyChange: true,
        sourceSystem: 'voicedrive',
        voiceDriveDeactivationId: payload.deactivationId,
        changedAt: new Date(payload.timestamp)
      }
    });

    // 確認Webhook送信（依頼2参照）
    await sendConfirmationWebhookToVoiceDrive({
      deactivationId: payload.deactivationId,
      employeeId: payload.employeeId,
      status: 'completed',
      medicalSystemConfirmedAt: new Date().toISOString()
    });

    return res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Webhook] 処理エラー:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}
```

---

### 依頼2: 確認Webhook送信機能実装

#### VoiceDrive側エンドポイント

**URL**: `POST https://voicedrive.ai/api/webhooks/account-deactivation-confirmed`

**認証**: HMAC-SHA256署名生成

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

#### 実装例

**ファイル**: `src/services/VoiceDriveWebhookService.ts`

```typescript
import crypto from 'crypto';
import fetch from 'node-fetch';

const VOICEDRIVE_WEBHOOK_URL =
  process.env.VOICEDRIVE_WEBHOOK_URL ||
  'https://voicedrive.ai/api/webhooks/account-deactivation-confirmed';

const VOICEDRIVE_WEBHOOK_SECRET = process.env.VOICEDRIVE_WEBHOOK_SECRET || '';

const WEBHOOK_TIMEOUT = 30000; // 30秒
const WEBHOOK_MAX_RETRIES = 3;

// HMAC署名生成
function generateHMAC(payload: any): string {
  const hmac = crypto.createHmac('sha256', VOICEDRIVE_WEBHOOK_SECRET);
  hmac.update(JSON.stringify(payload));
  return hmac.digest('hex');
}

// 確認Webhook送信
export async function sendConfirmationWebhookToVoiceDrive(data: {
  deactivationId: string;
  employeeId: string;
  status: 'completed' | 'failed';
  medicalSystemConfirmedAt: string;
  error?: string;
}): Promise<void> {
  const payload = {
    eventType: 'account.deactivation_confirmed',
    timestamp: new Date().toISOString(),
    deactivationId: data.deactivationId,
    employeeId: data.employeeId,
    status: data.status,
    medicalSystemConfirmedAt: data.medicalSystemConfirmedAt,
    ...(data.error && { error: data.error })
  };

  const signature = generateHMAC(payload);

  for (let i = 0; i < WEBHOOK_MAX_RETRIES; i++) {
    try {
      const response = await fetch(VOICEDRIVE_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Medical-System-Signature': signature
        },
        body: JSON.stringify(payload),
        timeout: WEBHOOK_TIMEOUT
      });

      if (response.ok) {
        console.log('[VoiceDrive Webhook] 送信成功:', data.deactivationId);
        return;
      }

      throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);

    } catch (error) {
      const isLastRetry = i === WEBHOOK_MAX_RETRIES - 1;
      console.error(`[VoiceDrive Webhook] 送信失敗 (${i + 1}/${WEBHOOK_MAX_RETRIES}):`, error);

      if (isLastRetry) {
        throw error;
      }

      // リトライ待機
      const retryIntervals = [60000, 300000, 900000]; // 1分、5分、15分
      await new Promise((resolve) => setTimeout(resolve, retryIntervals[i]));
    }
  }
}
```

---

### 依頼3: ヘルスチェックAPI実装

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

#### 実装例

**ファイル**: `src/api/health/status.ts`

```typescript
import { Request, Response } from 'express';
import { prisma } from '@/lib/prisma';

const serverStartTime = Date.now();

export async function getHealthStatus(req: Request, res: Response) {
  const errors: Array<{ service: string; message: string }> = [];

  // DB接続確認
  let dbStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    dbStatus = 'unhealthy';
    errors.push({
      service: 'database',
      message: error instanceof Error ? error.message : 'Database connection failed'
    });
  }

  // API状態確認（簡易版）
  const apiStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

  // Webhook受信状態確認（簡易版）
  const webhookStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

  // 全体ステータス判定
  const overallStatus =
    dbStatus === 'unhealthy' || apiStatus === 'unhealthy' || webhookStatus === 'unhealthy'
      ? 'unhealthy'
      : 'healthy';

  const response = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    services: {
      database: dbStatus,
      api: apiStatus,
      webhooks: webhookStatus
    },
    uptime: Math.floor((Date.now() - serverStartTime) / 1000),
    version: process.env.API_VERSION || '1.0.0',
    ...(errors.length > 0 && { errors })
  };

  const httpStatus = overallStatus === 'healthy' ? 200 : 503;
  return res.status(httpStatus).json(response);
}
```

---

## ⚙️ 環境変数設定

### 必要な環境変数

**ファイル**: `.env.production`

```env
# VoiceDrive Webhook設定
VOICEDRIVE_WEBHOOK_URL=https://voicedrive.ai/api/webhooks/account-deactivation-confirmed
VOICEDRIVE_WEBHOOK_SECRET=your-shared-secret-key-here

# API設定
API_VERSION=1.0.0
```

**ファイル**: `.env.development`

```env
# VoiceDrive Webhook設定（ローカル）
VOICEDRIVE_WEBHOOK_URL=http://localhost:3001/api/webhooks/account-deactivation-confirmed
VOICEDRIVE_WEBHOOK_SECRET=test-secret-key

# API設定
API_VERSION=1.0.0-dev
```

### 共有シークレットキーの管理

**セキュリティ要件**:
- 環境変数で管理（`.env`ファイル）
- VoiceDriveチームと同じシークレットキーを使用
- 推奨: 3ヶ月ごとにローテーション

**共有方法**:
- [ ] 1Password等のセキュアな方法で共有
- [ ] Slack DM等では共有しない
- [ ] AWS Secrets Manager使用も検討

---

## 🧪 テスト実装

### 1. Webhook受信エンドポイントのテスト

**ファイル**: `src/__tests__/webhooks/voicedrive-emergency-deactivation.test.ts`

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import crypto from 'crypto';
import { app } from '../../app';
import { prisma } from '../../lib/prisma';

describe('POST /api/webhooks/voicedrive-emergency-deactivation', () => {
  beforeEach(async () => {
    // テストデータクリア
    await prisma.employeeAccountStatusHistory.deleteMany({});
  });

  it('正しい署名で成功する', async () => {
    const payload = {
      eventType: 'account.emergency_deactivation',
      timestamp: new Date().toISOString(),
      deactivationId: 'deact_test123',
      employeeId: 'EMP2024001',
      targetUserId: 'user_target',
      reason: 'テスト用停止',
      executedBy: {
        userId: 'user_admin',
        employeeId: 'EMP2020001',
        name: '人事部長',
        permissionLevel: 15
      }
    };

    const hmac = crypto.createHmac('sha256', process.env.VOICEDRIVE_WEBHOOK_SECRET!);
    hmac.update(JSON.stringify(payload));
    const signature = hmac.digest('hex');

    const response = await request(app)
      .post('/api/webhooks/voicedrive-emergency-deactivation')
      .set('X-VoiceDrive-Signature', signature)
      .send(payload);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');

    // Employee.status更新確認
    const employee = await prisma.employee.findUnique({
      where: { employeeCode: 'EMP2024001' }
    });
    expect(employee?.status).toBe('inactive');

    // EmployeeAccountStatusHistory記録確認
    const history = await prisma.employeeAccountStatusHistory.findFirst({
      where: {
        employeeId: employee?.id,
        voiceDriveDeactivationId: 'deact_test123'
      }
    });
    expect(history).toBeTruthy();
    expect(history?.isEmergencyChange).toBe(true);
  });

  it('署名が不正な場合は401エラー', async () => {
    const payload = {
      eventType: 'account.emergency_deactivation',
      // ... ペイロード
    };

    const response = await request(app)
      .post('/api/webhooks/voicedrive-emergency-deactivation')
      .set('X-VoiceDrive-Signature', 'invalid-signature')
      .send(payload);

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Invalid signature');
  });
});
```

---

### 2. 確認Webhook送信のテスト

**ファイル**: `src/__tests__/services/VoiceDriveWebhookService.test.ts`

```typescript
import { describe, it, expect, vi } from 'vitest';
import { sendConfirmationWebhookToVoiceDrive } from '../../services/VoiceDriveWebhookService';
import fetch from 'node-fetch';

vi.mock('node-fetch');

describe('sendConfirmationWebhookToVoiceDrive', () => {
  it('Webhook送信が成功する', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 200
    });

    await expect(
      sendConfirmationWebhookToVoiceDrive({
        deactivationId: 'deact_test123',
        employeeId: 'EMP2024001',
        status: 'completed',
        medicalSystemConfirmedAt: new Date().toISOString()
      })
    ).resolves.not.toThrow();

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/webhooks/account-deactivation-confirmed'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'X-Medical-System-Signature': expect.any(String)
        })
      })
    );
  });

  it('3回失敗後にエラーをthrowする', async () => {
    (fetch as any).mockRejectedValue(new Error('Network error'));

    await expect(
      sendConfirmationWebhookToVoiceDrive({
        deactivationId: 'deact_test123',
        employeeId: 'EMP2024001',
        status: 'completed',
        medicalSystemConfirmedAt: new Date().toISOString()
      })
    ).rejects.toThrow('Network error');

    expect(fetch).toHaveBeenCalledTimes(3);
  });
});
```

---

### 3. ヘルスチェックAPIのテスト

**ファイル**: `src/__tests__/api/health/status.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../../app';

describe('GET /api/health/status', () => {
  it('正常時は200とhealthyを返す', async () => {
    const response = await request(app).get('/api/health/status');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('healthy');
    expect(response.body.services.database).toBe('healthy');
    expect(response.body.uptime).toBeGreaterThan(0);
  });
});
```

---

## 📅 実装スケジュール

### 医療システム側の実装期間

| 項目 | 所要時間（推定） | 優先度 | 開始日 | 完了日 |
|------|----------------|--------|--------|--------|
| **依頼1**: Webhook受信実装 | 2-3日 | 🔴 HIGH | 10月11日 | 10月13日 |
| **依頼2**: Webhook送信実装 | 1-2日 | 🔴 HIGH | 10月14日 | 10月15日 |
| **依頼3**: ヘルスチェックAPI | 1日 | 🟡 MEDIUM | 10月16日 | 10月16日 |
| **推奨**: EmployeeAccountStatusHistory | 1日 | 🟢 LOW | 10月17日 | 10月17日 |
| **統合テスト** | 2-3日 | 🔴 HIGH | 10月18日 | 10月20日 |

**総所要時間**: 約1-2週間（7-10営業日）

---

## ✅ チェックリスト

### DB実装

- [ ] EmployeeAccountStatusHistoryテーブル追加（schema.prisma）
- [ ] Employeeテーブルにリレーション追加
- [ ] マイグレーション実行（development）
- [ ] マイグレーション実行（production）

### Webhook受信実装（依頼1）

- [ ] `/api/webhooks/voicedrive-emergency-deactivation` エンドポイント実装
- [ ] HMAC署名検証実装
- [ ] Employee.status更新ロジック実装
- [ ] EmployeeAccountStatusHistory記録ロジック実装
- [ ] エラーハンドリング実装
- [ ] 単体テスト作成・実行

### Webhook送信実装（依頼2）

- [ ] VoiceDriveWebhookService.ts実装
- [ ] HMAC署名生成実装
- [ ] リトライロジック実装（3回、1分/5分/15分間隔）
- [ ] タイムアウト設定（30秒）
- [ ] 単体テスト作成・実行

### ヘルスチェックAPI実装（依頼3）

- [ ] `/api/health/status` エンドポイント実装
- [ ] DB接続確認ロジック実装
- [ ] サービス状態判定ロジック実装
- [ ] 単体テスト作成・実行

### 環境設定

- [ ] `.env.production` 更新（VOICEDRIVE_WEBHOOK_URL等）
- [ ] `.env.development` 更新
- [ ] VoiceDriveチームと共有シークレットキー共有

### 統合テスト

- [ ] VoiceDriveチームと統合テスト実施
- [ ] 障害シミュレーションテスト実施
- [ ] 復旧シミュレーションテスト実施
- [ ] 負荷テスト実施

---

## 🔄 次のステップ

### 1. VoiceDriveチームへの回答（本ドキュメント共有）
- [ ] 本DB要件分析書をMCP共有フォルダに配置
- [ ] アカウント無効化暫定マスターリストを作成
- [ ] 実装スケジュールを確定

### 2. 実装開始
- [ ] 依頼1（Webhook受信）から実装開始
- [ ] 依頼2（Webhook送信）実装
- [ ] 依頼3（ヘルスチェック）実装

### 3. 統合テスト
- [ ] VoiceDriveチームと統合テスト日程調整
- [ ] テスト環境でのエンドツーエンドテスト実施

### 4. 本番リリース
- [ ] ステージング環境デプロイ
- [ ] 本番環境デプロイ
- [ ] 監視設定

---

## 📝 補足資料

### 参照ドキュメント

1. **VoiceDriveからの要件確認書**
   - `mcp-shared/docs/Response_EmergencyAccountDeactivation_Requirements_20251010.md`

2. **VoiceDrive側マスタープラン**
   - `mcp-shared/docs/EmergencyAccountDeactivation_Master_Plan_VoiceDrive_20251010.md`

3. **データ管理責任分界点定義書**
   - `mcp-shared/docs/データ管理責任分界点定義書_20251008.md`

4. **PersonalStation DB要件分析（参考）**
   - `mcp-shared/docs/Response_PersonalStation_DB_Requirements_20251009.md`

---

## 🙏 謝辞

VoiceDriveチーム様

詳細な要件定義書およびマスタープランをご共有いただき、誠にありがとうございます。
医療システム側としても、アカウント緊急無効化機能の重要性を認識しており、迅速かつ確実に実装を進めてまいります。

本DB要件分析書の内容について、ご不明点や追加のご要望がございましたら、お気軽にご連絡ください。

引き続きよろしくお願いいたします。

---

**医療職員管理システム開発チーム一同**
**作成日**: 2025年10月10日
**文書番号**: DB-REQ-2025-1010-001
