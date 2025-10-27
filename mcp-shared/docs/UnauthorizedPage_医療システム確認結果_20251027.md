# UnauthorizedPage 医療システム確認結果報告書

**文書番号**: MED-CONF-2025-1027-005
**作成日**: 2025年10月27日
**作成者**: ClaudeCode（医療システムチーム）
**件名**: UnauthorizedPageの医療システム側対応要否確認
**参照書類**: UnauthorizedPage 暫定マスターリスト（VoiceDriveチーム作成）

---

## 📋 エグゼクティブサマリー

VoiceDriveチームから「UnauthorizedPage 暫定マスターリスト」を受領し、医療職員管理システム側での対応要否を分析しました。

### 結論

**医療システム側で新規実装が必要な項目: 2件（認証API + パスワード変更API）**

- ✅ **API-AUTH（職員認証API）**: 実装必要（高優先度）
- ✅ **API-CHANGE-PASSWORD（パスワード変更API）**: 実装必要（高優先度）🆕
- ✅ **Webhook通知**: 既存Webhook（`employee.updated`）で対応可能
- ✅ **DBテーブル**: 既存Employeeテーブル + 2テーブル追加（LoginHistory、LoginAttempt）🆕
- ✅ **パスワード管理方針**: 医療システム集中管理（パターンA採用）🆕

### 対応優先度

**Priority: HIGH（VoiceDrive全体の認証基盤に必要）**

UnauthorizedPage専用のAPIではなく、**VoiceDrive全体の認証システム**に必要な基盤APIです。PersonalStationやその他の全ページで利用されます。

### 重要な更新（2025年10月27日）

VoiceDriveチームからの8件の質問に回答し、以下の方針が確定しました：
- **パスワード管理**: 医療システム集中管理（パターンA）
- **初期パスワード**: `{employeeId}_InitPass2025`形式 + 初回ログイン時強制変更
- **パスワード変更API**: Phase 1で同時実装が必要
- **LoginHistoryテーブル**: Phase 1で実装（監査ログとして重要）
- **アカウントロック**: データベーステーブルで実装（Redis不要）

詳細は回答書を参照: [Response_UnauthorizedPage_Confirmation_20251027.md](./Response_UnauthorizedPage_Confirmation_20251027.md)

---

## 🔗 医療システム側の対応内容

### A. API提供依頼への回答

#### API-AUTH: 職員認証API

**状態**: ✅ **実装可能**（推定工数: 2日）

**エンドポイント**:
```
POST /api/v2/auth/authenticate
```

**必要な理由**:
- VoiceDriveへのログイン時に医療システムの認証情報を検証
- 職員IDとパスワードの照合
- 認証成功時に職員基本情報を返却

**リクエスト例**:
```json
{
  "email": "yamada.taro@hospital.local",
  "password": "hashed_password_here"
}
```

**レスポンス例**:
```json
{
  "success": true,
  "employeeId": "EMP2024001",
  "employee": {
    "employeeId": "EMP2024001",
    "name": "山田 太郎",
    "email": "yamada.taro@hospital.local",
    "permissionLevel": 3.5,
    "accountType": "STAFF",
    "role": "nurse",
    "department": "外科",
    "facilityId": "FAC001"
  }
}
```

**エラーレスポンス例**:
```json
{
  "success": false,
  "error": "INVALID_CREDENTIALS",
  "message": "メールアドレスまたはパスワードが正しくありません"
}
```

#### 医療システム側の実装内容

**1. Employeeテーブルへのパスワードフィールド追加**

現在のEmployeeテーブル（[schema.prisma](../../prisma/schema.prisma) 48-85行目）にはパスワードフィールドが存在しないため、追加が必要です。

**既存スキーマ**:
```prisma
model Employee {
  id              String    @id @default(cuid())
  employeeId      String    @unique @map("employee_id")
  name            String
  email           String    @unique
  permissionLevel Float     @map("permission_level")
  accountType     String    @map("account_type")
  role            String
  departmentId    String    @map("department_id")
  facilityId      String    @map("facility_id")
  // ... その他のフィールド

  // ❌ passwordフィールドが存在しない
}
```

**修正後のスキーマ**:
```prisma
model Employee {
  id                 String    @id @default(cuid())
  employeeId         String    @unique @map("employee_id")
  name               String
  email              String    @unique
  passwordHash       String    @map("password_hash")         // 🆕 追加
  passwordUpdatedAt  DateTime? @map("password_updated_at")   // 🆕 追加
  passwordMustChange Boolean   @default(false) @map("password_must_change")  // 🆕 追加
  permissionLevel    Float     @map("permission_level")
  accountType        String    @map("account_type")
  role               String
  departmentId       String    @map("department_id")
  facilityId         String    @map("facility_id")
  // ... その他のフィールド

  loginHistory       LoginHistory[]  // 🆕 追加
  loginAttempts      LoginAttempt[]  // 🆕 追加

  @@map("employees")
}
```

**マイグレーション**:
```sql
-- 1. パスワード関連フィールドを追加
ALTER TABLE employees ADD COLUMN password_hash VARCHAR(255);
ALTER TABLE employees ADD COLUMN password_updated_at TIMESTAMP;
ALTER TABLE employees ADD COLUMN password_must_change BOOLEAN DEFAULT FALSE;

-- 2. 既存職員に初期パスワードを設定
-- フォーマット: {employeeId}_InitPass2025
-- 例: EMP2024001 → EMP2024001_InitPass2025
UPDATE employees
SET password_hash = bcrypt_hash(CONCAT(employee_id, '_InitPass2025'), 10),
    password_updated_at = NULL,        -- NULL = 初期パスワード（未変更）
    password_must_change = TRUE        -- 初回ログイン時強制変更
WHERE password_hash IS NULL;

-- 3. NOT NULL制約を追加
ALTER TABLE employees ALTER COLUMN password_hash SET NOT NULL;
```

**2. 認証API実装**

**ファイル**: `src/api/v2/auth/authenticate.ts`

```typescript
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../../../lib/prisma';

/**
 * POST /api/v2/auth/authenticate
 * 職員認証API
 */
export async function authenticate(req: Request, res: Response) {
  const { email, password } = req.body;

  // 1. 入力検証
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'MISSING_CREDENTIALS',
      message: 'メールアドレスとパスワードを入力してください'
    });
  }

  // 2. Rate Limit チェック（別途ミドルウェアで実装）
  // Express Rate Limit: 5 req/min/IP

  // 3. 職員検索
  const employee = await prisma.employee.findUnique({
    where: { email },
    include: {
      department: true,
      facility: true
    }
  });

  if (!employee) {
    return res.status(401).json({
      success: false,
      error: 'INVALID_CREDENTIALS',
      message: 'メールアドレスまたはパスワードが正しくありません'
    });
  }

  // 4. パスワード検証
  const isPasswordValid = await bcrypt.compare(password, employee.passwordHash);

  if (!isPasswordValid) {
    // ログイン失敗カウント（別途実装）
    await incrementFailedLoginCount(employee.id);

    return res.status(401).json({
      success: false,
      error: 'INVALID_CREDENTIALS',
      message: 'メールアドレスまたはパスワードが正しくありません'
    });
  }

  // 5. アカウントロック確認（5回失敗で30分ロック）
  const isLocked = await checkAccountLock(employee.id);
  if (isLocked) {
    return res.status(403).json({
      success: false,
      error: 'ACCOUNT_LOCKED',
      message: 'アカウントがロックされています。しばらくしてから再試行してください'
    });
  }

  // 6. 認証成功
  await resetFailedLoginCount(employee.id);

  res.json({
    success: true,
    employeeId: employee.employeeId,
    employee: {
      employeeId: employee.employeeId,
      name: employee.name,
      email: employee.email,
      permissionLevel: employee.permissionLevel,
      accountType: employee.accountType,
      role: employee.role,
      department: employee.department.name,
      facilityId: employee.facility.code
    }
  });
}

/**
 * ログイン失敗カウント増加
 */
async function incrementFailedLoginCount(employeeId: string) {
  // Redisまたはデータベースで実装
  // key: `login_attempts:${employeeId}`
  // TTL: 30分
}

/**
 * アカウントロック確認
 */
async function checkAccountLock(employeeId: string): Promise<boolean> {
  // Redisまたはデータベースで実装
  // 5回失敗 → 30分ロック
  return false; // 仮実装
}

/**
 * ログイン失敗カウントリセット
 */
async function resetFailedLoginCount(employeeId: string) {
  // Redisまたはデータベースで実装
}
```

**3. Rate Limit ミドルウェア**

```typescript
import rateLimit from 'express-rate-limit';

export const authRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1分
  max: 5, // 5回まで
  message: {
    success: false,
    error: 'TOO_MANY_REQUESTS',
    message: 'リクエストが多すぎます。しばらくしてから再試行してください'
  }
});
```

**4. ルート設定**

```typescript
// src/routes/v2/auth.ts
import express from 'express';
import { authenticate } from '../../api/v2/auth/authenticate';
import { authRateLimiter } from '../../middleware/rateLimiter';

const router = express.Router();

router.post('/authenticate', authRateLimiter, authenticate);

export default router;
```

#### セキュリティ要件

| 要件 | 実装内容 | 状態 |
|-----|---------|------|
| **HTTPS必須** | SSL/TLS証明書設定 | ✅ 実装済み |
| **パスワードハッシュ化** | bcrypt（コスト10） | ⏳ 要実装 |
| **Rate Limit** | 5 req/min/IP | ⏳ 要実装 |
| **アカウントロック** | 5回失敗で30分ロック | ⏳ 要実装 |
| **CORS設定** | VoiceDriveドメイン許可 | ✅ 実装済み |

---

### B. Webhook通知への回答

#### 既存Webhookで対応可能

UnauthorizedPage専用のWebhookは不要です。既存の`employee.updated` Webhookで権限情報の変更を通知できます。

**既存Webhook**: `employee.updated`

**トリガー条件**:
- 職員の`permissionLevel`変更時
- 職員の`accountType`変更時

**ペイロード例**:
```json
{
  "event": "employee.updated",
  "timestamp": "2025-10-27T10:30:00Z",
  "data": {
    "employeeId": "EMP2024001",
    "changes": {
      "permissionLevel": {
        "old": 3.5,
        "new": 5.0
      },
      "accountType": {
        "old": "STAFF",
        "new": "MANAGER"
      }
    }
  }
}
```

**評価**: ✅ 既存Webhookで対応可能（新規実装不要）

---

### C. データベース構築への回答

#### 新規テーブル追加: 2件（LoginHistory、LoginAttempt）

**1. LoginHistoryテーブル（監査ログ）**

```prisma
model LoginHistory {
  id          String   @id @default(cuid())
  employeeId  String   @map("employee_id")
  action      String   // 'LOGIN_SUCCESS' | 'LOGIN_FAILURE' | 'PASSWORD_CHANGED' | 'LOGOUT'
  timestamp   DateTime @default(now())
  success     Boolean
  ipAddress   String   @map("ip_address")
  userAgent   String   @map("user_agent")
  errorCode   String?  @map("error_code")  // 'INVALID_CREDENTIALS' | 'ACCOUNT_LOCKED' 等

  employee    Employee @relation(fields: [employeeId], references: [employeeId])

  @@map("login_history")
  @@index([employeeId, timestamp])
  @@index([timestamp])
}
```

**目的**: ログイン履歴の保存、不正アクセスの監視
**データ保持期間**: 3年

**2. LoginAttemptテーブル（アカウントロック）**

```prisma
model LoginAttempt {
  id          String   @id @default(cuid())
  employeeId  String   @map("employee_id")
  attemptTime DateTime @default(now()) @map("attempt_time")
  success     Boolean
  ipAddress   String   @map("ip_address")

  employee    Employee @relation(fields: [employeeId], references: [employeeId])

  @@index([employeeId, attemptTime])
  @@map("login_attempts")
}
```

**目的**: ログイン失敗回数のカウント、アカウントロック（5回失敗で30分）
**データ保持期間**: 7日間（自動クリーンアップ）

#### 既存テーブル拡張: Employeeテーブル

**Employeeテーブル** ([schema.prisma](../../prisma/schema.prisma) 48-85行目):

UnauthorizedPageに必要なフィールド：

| フィールド | 型 | 状態 | 備考 |
|----------|-----|------|------|
| `employeeId` | String | ✅ **存在** | 職員ID |
| `name` | String | ✅ **存在** | 職員名 |
| `email` | String | ✅ **存在** | メールアドレス |
| `passwordHash` | String | ❌ **不足** | 🆕 追加必要 |
| `passwordUpdatedAt` | DateTime? | ❌ **不足** | 🆕 追加必要 |
| `passwordMustChange` | Boolean | ❌ **不足** | 🆕 追加必要（初回ログイン強制変更） |
| `permissionLevel` | Float | ✅ **存在** | 権限レベル |
| `accountType` | String | ✅ **存在** | アカウントタイプ |
| `role` | String | ✅ **存在** | 役職 |

**評価**: ⚠️ 3フィールド追加必要 + 2テーブル追加

---

## ❓ VoiceDriveチームへの回答

### 確認-1: 認証方式の選択

**質問**:
> VoiceDriveの認証方式について、以下のどちらを希望しますか？
>
> **Option A: 医療システムの認証APIを呼び出す（推奨）**
> **Option B: VoiceDrive独自の認証システム**

**回答**: ✅ **Option A を採用**（医療システム認証API）

**理由**:
1. **真実の情報源**: 職員マスタ（Employeeテーブル）が医療システムにある
2. **パスワード管理の一元化**: 医療システムで統一管理
3. **退職処理の即時反映**: 退職職員は即座にログイン不可
4. **監査ログ**: 医療システム側でログイン履歴を一元管理

**実装内容**:
- ✅ 認証APIエンドポイント: `POST /api/v2/auth/authenticate`
- ✅ パスワード変更APIエンドポイント: `PUT /api/v2/auth/change-password` 🆕
- ✅ Rate Limit: 5 req/min/IP
- ✅ アカウントロック: 5回失敗で30分ロック（データベーステーブルで実装）
- ✅ パスワードハッシュ: bcrypt（コスト10）
- ✅ 初期パスワード: `{employeeId}_InitPass2025`形式
- ✅ 初回ログイン時強制変更

---

## 📊 実装工数見積もり

### 医療システム側の作業（更新版）

| 作業項目 | 推定工数 | 優先度 | 変更内容 |
|---------|---------|-------|---------|
| **1. Employeeテーブル拡張** | 0.5日 | 高 | passwordMustChange追加 |
| **2. 認証API実装** | 1.5日 | 高 | ✅ +0.5日（初回ログイン強制変更） |
| **3. パスワード変更API実装** | 1日 | 高 | 🆕 追加 |
| **4. LoginHistoryテーブル追加** | 0.5日 | 高 | 🆕 追加 |
| **5. LoginAttemptテーブル追加** | 0.5日 | 中 | 🆕 追加（データベース版） |
| **6. Rate Limit実装** | 0.25日 | 高 | 変更なし |
| **7. アカウントロック実装** | 0.5日 | 中 | ✅ データベース版に変更 |
| **8. 退職職員チェック実装** | 0.25日 | 高 | 🆕 追加 |
| **9. 単体テスト作成** | 1日 | 高 | ✅ +0.5日（テストケース追加） |
| **10. API仕様書更新** | 0.25日 | 中 | 変更なし |

**合計工数**: 6.25日（約6.5日）

**変更内容サマリー**:
- 元の見積もり: 3日
- 更新後の見積もり: **6.5日**
- 増加分: +3.5日

**増加理由**:
1. パスワード変更API追加（+1日）
2. LoginHistoryテーブル追加（+0.5日）
3. LoginAttemptテーブル追加（+0.5日）
4. 初回ログイン強制変更（+0.5日）
5. テストケース追加（+0.5日）
6. 退職職員チェック（+0.25日）
7. その他（+0.25日）

---

## 📅 実装スケジュール（更新版）

### 重要: Phase 1.6（共通DB構築）と同時実施を推奨

**理由**:
1. **共通DB（MySQL）がまだ構築されていない**: 現在SQLiteでローカル開発中
2. **二度手間の回避**: SQLiteで実装 → MySQL移行時に再実装が必要
3. **Phase 1.6統合実装戦略**: Phase 15（委員会管理）やPhase 16（施設ガバナンス）と同じパターン

### Phase 1.6統合実装（推奨）

**期間**: Phase 1.6（共通DB構築）と同時実施

| 日付 | 作業内容 | 担当 | 工数 |
|------|---------|------|------|
| **Day 1** | MySQL構築＋Employeeテーブル拡張 | 医療システム | 1日 |
| **Day 2-3** | 認証API実装 | 医療システム | 1.5日 |
| **Day 4-5** | パスワード変更API実装 | 医療システム | 1日 |
| **Day 5-6** | LoginHistory/LoginAttemptテーブル追加 | 医療システム | 1日 |
| **Day 6** | アカウントロック実装 | 医療システム | 0.5日 |
| **Day 7** | Rate Limit、退職職員チェック実装 | 医療システム | 0.5日 |
| **Day 8-9** | 単体テスト作成 | 医療システム | 1日 |
| **Day 9** | API仕様書更新 | 医療システム | 0.25日 |

**合計**: 約9日間（カレンダー上、50%稼働の場合は約3週間）

### VoiceDrive側統合テスト

**期間**: 医療システム側実装完了後

| 作業内容 | 担当 | 工数 |
|---------|------|------|
| VoiceDrive側useAuth実装 | VoiceDrive | 2週間 |
| usePermissions修正 | VoiceDrive | 1週間 |
| 統合テスト | 両チーム | 1週間 |
| セキュリティ監査 | 両チーム | 1週間 |

---

## 📊 データフロー図

### 認証フロー（将来の実装）

```
VoiceDrive
  ↓ ①ログイン画面
[POST] /api/auth/login
  email: "yamada.taro@hospital.local"
  password: "password123"
  ↓ ②医療システム認証API呼び出し
┌─────────────────────────────────────────────────────────────┐
│                    医療職員管理システム                       │
│                                                               │
│  [POST] /api/v2/auth/authenticate                            │
│    email: "yamada.taro@hospital.local"                       │
│    password: "password123"                                   │
│         ↓ ③パスワード検証                                    │
│  Employee.findUnique({ where: { email } })                   │
│  bcrypt.compare(password, employee.passwordHash)             │
│         ↓ ④認証成功                                          │
│  return {                                                     │
│    success: true,                                             │
│    employeeId: "EMP2024001",                                 │
│    employee: {                                                │
│      permissionLevel: 3.5,                                    │
│      accountType: "STAFF"                                     │
│    }                                                          │
│  }                                                            │
└─────────────────────────────────────────────────────────────┘
  ↓ ⑤職員情報返却
VoiceDrive User作成/更新
  User.upsert({
    where: { employeeId: "EMP2024001" },
    create: { ... },
    update: { permissionLevel: 3.5, accountType: "STAFF" }
  })
  ↓ ⑥セッション作成
  Session.create({ userId: user.id })
  ↓ ⑦ログイン完了
UnauthorizedPage表示時
  useAuth() → currentUser
  表示: STAFF (Level 3.5)
```

---

## ✅ チェックリスト（更新版）

### 医療システム側作業

#### Phase 1: データベース拡張
- [ ] Employeeテーブルに以下のフィールド追加:
  - [ ] `passwordHash` (String)
  - [ ] `passwordUpdatedAt` (DateTime?)
  - [ ] `passwordMustChange` (Boolean)
- [ ] LoginHistoryテーブル作成
- [ ] LoginAttemptテーブル作成（アカウントロック用）
- [ ] マイグレーション作成
- [ ] 既存職員へ初期パスワード設定（`{employeeId}_InitPass2025`形式）
- [ ] NOT NULL制約追加

#### Phase 2: API実装
- [ ] POST /api/v2/auth/authenticate（認証API）
  - [ ] 入力検証
  - [ ] パスワード検証
  - [ ] 退職職員チェック
  - [ ] アカウントロックチェック
  - [ ] 初回ログイン強制変更フラグ
  - [ ] ログイン履歴記録
- [ ] PUT /api/v2/auth/change-password（パスワード変更API）🆕
  - [ ] 現在のパスワード検証
  - [ ] パスワードポリシー検証
  - [ ] パスワード更新
  - [ ] passwordMustChangeフラグクリア

#### Phase 3: セキュリティ機能
- [ ] Rate Limit実装（5 req/min/IP）
- [ ] アカウントロック実装（5回失敗で30分）
- [ ] パスワードポリシー検証
  - [ ] 最小文字数（8文字）
  - [ ] 複雑さ（3種類以上）
- [ ] CORS設定
  - [ ] 許可ドメイン設定
  - [ ] credentials: true

#### Phase 4: テスト
- [ ] 正常系テスト
  - [ ] 認証成功
  - [ ] 初回ログイン（強制変更）
  - [ ] パスワード変更成功
- [ ] 異常系テスト
  - [ ] パスワード誤り
  - [ ] 退職職員ログイン試行
  - [ ] アカウントロック
  - [ ] Rate Limit超過
- [ ] カバレッジ80%以上確認

#### Phase 5: ドキュメント
- [ ] API仕様書更新（OpenAPI 3.0）
- [ ] セキュリティ仕様書作成
- [ ] 初期パスワード設定手順書作成
- [ ] VoiceDriveチームへ共有

### VoiceDrive側作業（参考）

- [ ] useAuthフック実装
- [ ] GET /api/auth/me 実装
- [ ] POST /api/auth/login 実装（医療API呼び出し）
- [ ] POST /api/auth/logout 実装
- [ ] usePermissions修正（デモモードから実データへ）
- [ ] ChangePasswordPage実装🆕
- [ ] 初回ログイン時パスワード変更フロー実装🆕
- [ ] UnauthorizedPage実データ表示確認

---

## 🔗 関連ドキュメント

### 医療システム側ドキュメント（本プロジェクト）
1. **UnauthorizedPage医療システム確認結果** - 本文書
2. **Response_UnauthorizedPage_Confirmation_20251027.md** - 🆕 VoiceDriveチームからの質問への回答書
3. **Prisma Schema** - [prisma/schema.prisma](../../prisma/schema.prisma)
4. **API仕様書v2** - `docs/api-specs-v2.md`（要更新）

### VoiceDrive側ドキュメント
1. **UnauthorizedPage 暫定マスターリスト** - VoiceDriveチーム作成
2. **UnauthorizedPage DB要件分析** - `mcp-shared/docs/UnauthorizedPage_DB要件分析_20251027.md`
3. **データ管理責任分界点定義書** - `mcp-shared/docs/データ管理責任分界点定義書_20251008.md`

### 比較参考用
1. **organization-analytics 医療システム確認結果** - `mcp-shared/docs/organization-analytics_医療システム確認結果_20251010.md`
2. **PersonalStation 暫定マスターリスト** - `mcp-shared/docs/PersonalStation暫定マスターリスト_20251008.md`

---

## 📝 補足事項

### 1. 既存実装への影響

**影響度**: 🟡 中程度

- ✅ Employeeテーブルへのフィールド追加のみ（既存フィールドは変更なし）
- ✅ 新規APIエンドポイント追加（既存APIへの影響なし）
- ⚠️ パスワード管理が新規に必要（初期パスワード設定要）

### 2. セキュリティ考慮事項

#### パスワードポリシー

| 項目 | 要件 |
|-----|------|
| **最小文字数** | 8文字 |
| **複雑さ** | 大文字、小文字、数字、記号のうち3種類以上 |
| **有効期限** | 90日（推奨） |
| **再利用制限** | 過去5回分のパスワードは使用不可（推奨） |
| **初期パスワード** | `employeeId` + 固定文字列（初回ログイン時に変更必須） |

#### ログイン履歴保存

```prisma
model LoginHistory {
  id          String   @id @default(cuid())
  employeeId  String   @map("employee_id")
  timestamp   DateTime @default(now())
  success     Boolean
  ipAddress   String   @map("ip_address")
  userAgent   String   @map("user_agent")

  employee    Employee @relation(fields: [employeeId], references: [employeeId])

  @@map("login_history")
}
```

**推奨**: ログイン履歴を保存し、不正アクセスの監視に利用

### 3. パスワードリセット機能

**将来実装推奨**:
- 🔴 パスワード忘れた場合のリセット機能
- 🔴 管理者による強制パスワードリセット
- 🔴 初回ログイン時の強制パスワード変更

**優先度**: 🟢 低（Phase 2以降で実装）

---

## 🎯 まとめ

### UnauthorizedPageの医療システム対応（更新版）

1. **新規API実装**: 2件（認証API + パスワード変更API）🆕
2. **Webhook通知**: 既存Webhookで対応可能
3. **DB拡張**: 3フィールド追加（passwordHash、passwordUpdatedAt、passwordMustChange）🆕
4. **新規テーブル**: 2件（LoginHistory、LoginAttempt）🆕
5. **実装工数**: 約6.5日（元の見積もり3日から+3.5日増加）🆕

### 3ページ比較サマリー（医療システム視点・更新版）

| 要素 | NotFoundPage | UnauthorizedPage | PersonalStation |
|-----|-------------|-----------------|----------------|
| **医療システムAPI** | 不要 | 2件必要（認証+パスワード変更）🆕 | 2件必要 |
| **Webhook通知** | 不要 | 既存で対応可能 | 4件必要 |
| **新規テーブル** | 不要 | 2件（LoginHistory、LoginAttempt）🆕 | 0件（既存のみ） |
| **新規フィールド** | 不要 | 3件（password関連）🆕 | 複数件 |
| **実装工数** | 0日 | 6.5日🆕 | 1日 |

### 最終結論

**医療システム側では、認証API（POST /api/v2/auth/authenticate）とパスワード変更API（PUT /api/v2/auth/change-password）の実装が必要です。**

この認証システムはUnauthorizedPageだけでなく、**VoiceDrive全体の認証基盤**として使用されるため、高優先度で実装すべきです。

**パスワード管理方針の確定（2025年10月27日）**:
- ✅ 医療システム集中管理（パターンA）
- ✅ 初期パスワード: `{employeeId}_InitPass2025`形式
- ✅ 初回ログイン時強制変更
- ✅ アカウントロック: データベーステーブルで実装（Redis不要）
- ✅ LoginHistoryテーブル: Phase 1で実装（監査ログとして重要）

**実装タイミング**: Phase 1.6（共通DB構築）と同時実施を推奨

---

## 🔄 更新履歴

| 日付 | バージョン | 内容 | 担当 |
|------|----------|------|------|
| 2025-10-27 | 1.0 | 初版作成 | ClaudeCode（医療システム） |
| 2025-10-27 | 2.0 | VoiceDriveチームからの8件の質問に回答、パスワード管理方針確定、工数を6.5日に更新 | ClaudeCode（医療システム） |

**主要な更新（Version 2.0）**:
1. パスワード変更API追加（PUT /api/v2/auth/change-password）
2. LoginHistoryテーブル追加（監査ログ）
3. LoginAttemptテーブル追加（アカウントロック）
4. 初期パスワードフォーマット確定（`{employeeId}_InitPass2025`）
5. 初回ログイン時強制変更フラグ追加（passwordMustChange）
6. アカウントロック実装方法確定（データベーステーブル、Redis不要）
7. 実装工数更新（3日 → 6.5日、+3.5日）
8. Phase 1.6統合実装戦略の明記

---

**作成者**: ClaudeCode（医療システムチーム）
**参照書類**: [Response_UnauthorizedPage_Confirmation_20251027.md](./Response_UnauthorizedPage_Confirmation_20251027.md)
**承認待ち**: VoiceDriveチームからの確認事項への回答（3件）
**次のステップ**: Phase 1.6実施予定の確認後、認証API実装開始

---

**文書終了**
