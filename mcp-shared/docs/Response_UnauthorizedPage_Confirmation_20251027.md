# UnauthorizedPage 認証API実装 回答書兼確認書

**文書番号**: MED-RESPONSE-AUTH-2025-1027-001
**作成日**: 2025年10月27日
**作成者**: ClaudeCode（医療システムチーム）
**宛先**: VoiceDriveチーム
**件名**: UnauthorizedPage認証API実装に関する質問への回答兼最終確認
**参照書類**: UnauthorizedPage_医療システム確認結果_20251027.md（MED-CONF-2025-1027-005）

---

## 📋 エグゼクティブサマリー

VoiceDriveチームからの8件の質問・確認事項に対して、医療システムチームとして回答します。また、パスワード管理方針について重要な更新があります。

### 重要な更新

**パスワード管理方針の確定**: ✅ **医療システム集中管理（パターンA採用）**

- **初回発行**: 医療システムで一括発行
- **パスワード変更**: VoiceDrive画面から医療システムAPI（PUT /api/v2/auth/change-password）を呼び出す
- **データ保存**: パスワードは医療システムのみに保存（シングルソースオブトゥルース）

---

## 🔍 質問への回答

### 1. 🔴 重要: パスワード管理の初期実装方針

#### 質問1-1: 既存職員への初期パスワード設定方法

**VoiceDriveチームからの選択肢**:
- Option A: employeeId + 固定文字列（例: EMP2024001_init）
- Option B: ランダムパスワード生成してメール送信
- Option C: 管理者が個別に設定

**回答**: ✅ **Option A を採用**（employeeId + 固定文字列 + 初回ログイン時強制変更）

**理由**:
1. **一括発行の容易さ**: マイグレーションで全職員に一度に設定可能
2. **職員の利便性**: 自分のemployeeIdを知っていればログイン可能
3. **セキュリティ**: 初回ログイン時に強制変更を要求（後述）
4. **運用コスト**: メール送信（Option B）や個別設定（Option C）は運用負荷が高い

**実装詳細**:

```sql
-- マイグレーション例
UPDATE employees
SET password_hash = CONCAT(
  '$2b$10$',
  -- bcrypt(employeeId + '_InitPass2025')
  -- 例: EMP2024001 → EMP2024001_InitPass2025
  bcrypt_hash(CONCAT(employee_id, '_InitPass2025'), 10)
),
password_updated_at = NULL,  -- NULL = 初期パスワード（未変更）
password_must_change = TRUE  -- 🆕 初回ログイン時強制変更フラグ
WHERE password_hash IS NULL;
```

**初期パスワードフォーマット**: `{employeeId}_InitPass2025`

**例**:
- employeeId: `EMP2024001` → 初期パスワード: `EMP2024001_InitPass2025`
- employeeId: `EMP2024099` → 初期パスワード: `EMP2024099_InitPass2025`

**初回ログイン時の強制変更フロー**:

```typescript
// POST /api/v2/auth/authenticate の拡張
export async function authenticate(req: Request, res: Response) {
  // ... 認証成功後

  // 初期パスワードチェック
  if (employee.passwordMustChange || employee.passwordUpdatedAt === null) {
    return res.json({
      success: true,
      employeeId: employee.employeeId,
      requirePasswordChange: true,  // 🆕 VoiceDrive側でパスワード変更画面へ遷移
      employee: { ... }
    });
  }

  // 通常のログイン成功
  res.json({
    success: true,
    employeeId: employee.employeeId,
    requirePasswordChange: false,
    employee: { ... }
  });
}
```

**VoiceDrive側の実装**:

```typescript
// ログイン後の処理
const result = await authenticate(email, password);

if (result.requirePasswordChange) {
  // パスワード変更画面へ強制遷移
  router.push('/change-password?force=true');
} else {
  // 通常のダッシュボードへ遷移
  router.push('/dashboard');
}
```

**セキュリティ考慮**:
- ✅ 初期パスワードは推測可能だが、初回ログイン時に強制変更を要求
- ✅ 職員に初期パスワードを別途通知する必要がない（employeeIdから自己生成可能）
- ✅ パスワード変更後は強力なパスワードポリシーを適用

**追加フィールド（Employeeテーブル）**:

```prisma
model Employee {
  // ... 既存フィールド

  passwordHash       String    @map("password_hash")
  passwordUpdatedAt  DateTime? @map("password_updated_at")
  passwordMustChange Boolean   @default(false) @map("password_must_change")  // 🆕 追加

  @@map("employees")
}
```

---

### 2. 🟡 セキュリティ: パスワードポリシーの即時実装要否

#### 質問2-1: Phase 1（認証API実装）の時点で、どのポリシーを実装しますか？

**回答**: ✅ **VoiceDriveチームの推奨に同意します**

| ポリシー | Phase 1実装 | 理由 |
|---------|-----------|------|
| **最小文字数（8文字）** | ✅ Yes | 基本的なセキュリティ要件 |
| **複雑さ（3種類以上）** | ✅ Yes | ブルートフォース攻撃対策 |
| **有効期限（90日）** | ⏳ Phase 2 | 運用負荷が高い（通知機能等が必要） |
| **再利用制限（過去5回分）** | ⏳ Phase 2 | PasswordHistoryテーブルが必要 |

**実装コード**:

```typescript
// src/utils/validatePassword.ts
export function validatePasswordPolicy(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // 1. 最小文字数チェック（8文字以上）
  if (password.length < 8) {
    errors.push('パスワードは8文字以上である必要があります');
  }

  // 2. 複雑さチェック（大文字・小文字・数字・記号のうち3種類以上）
  let typeCount = 0;
  if (/[A-Z]/.test(password)) typeCount++;  // 大文字
  if (/[a-z]/.test(password)) typeCount++;  // 小文字
  if (/[0-9]/.test(password)) typeCount++;  // 数字
  if (/[^A-Za-z0-9]/.test(password)) typeCount++;  // 記号

  if (typeCount < 3) {
    errors.push('パスワードは大文字、小文字、数字、記号のうち3種類以上を含む必要があります');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
```

**Phase 2以降の実装（将来）**:

```typescript
// Phase 2: 有効期限チェック
if (employee.passwordUpdatedAt) {
  const daysSinceUpdate = daysBetween(employee.passwordUpdatedAt, new Date());
  if (daysSinceUpdate > 90) {
    return res.json({
      success: true,
      requirePasswordChange: true,
      reason: 'PASSWORD_EXPIRED',
      employee: { ... }
    });
  }
}

// Phase 2: 再利用制限チェック
const recentPasswords = await prisma.passwordHistory.findMany({
  where: { employeeId },
  orderBy: { changedAt: 'desc' },
  take: 5
});

for (const history of recentPasswords) {
  const isSamePassword = await bcrypt.compare(newPassword, history.passwordHash);
  if (isSamePassword) {
    return res.status(400).json({
      success: false,
      error: 'PASSWORD_REUSED',
      message: '過去5回分のパスワードは使用できません'
    });
  }
}
```

---

#### 質問2-2: パスワード変更APIも同時実装が必要ですか？

**回答**: ✅ **Yes、Phase 1で同時実装が必要です**

**理由**:
1. **初回ログイン時強制変更**: 質問1-1で採用したOption Aでは、初回ログイン時にパスワード変更APIが必要
2. **認証フローの完結**: 認証API（POST /api/v2/auth/authenticate）だけでは不完全
3. **セキュリティ要件**: 初期パスワードからの変更がセキュリティの前提条件

**実装API**:

```
POST /api/v2/auth/change-password
```

**リクエスト**:
```json
{
  "employeeId": "EMP2024001",
  "currentPassword": "EMP2024001_InitPass2025",
  "newPassword": "MyNewSecurePass123!"
}
```

**レスポンス（成功）**:
```json
{
  "success": true,
  "message": "パスワードを変更しました",
  "passwordUpdatedAt": "2025-10-27T12:00:00Z"
}
```

**実装コード**:

```typescript
// src/api/v2/auth/change-password.ts
export async function changePassword(req: Request, res: Response) {
  const { employeeId, currentPassword, newPassword } = req.body;

  // 1. 入力検証
  if (!employeeId || !currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      error: 'MISSING_FIELDS',
      message: '必須フィールドが不足しています'
    });
  }

  // 2. パスワードポリシー検証（Phase 1: 最小文字数 + 複雑さ）
  const validation = validatePasswordPolicy(newPassword);
  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      error: 'INVALID_PASSWORD_POLICY',
      message: validation.errors.join(', ')
    });
  }

  // 3. 職員検索
  const employee = await prisma.employee.findUnique({
    where: { employeeId }
  });

  if (!employee) {
    return res.status(404).json({
      success: false,
      error: 'EMPLOYEE_NOT_FOUND',
      message: '職員が見つかりません'
    });
  }

  // 4. 現在のパスワード検証
  const isCurrentPasswordValid = await bcrypt.compare(
    currentPassword,
    employee.passwordHash
  );

  if (!isCurrentPasswordValid) {
    return res.status(401).json({
      success: false,
      error: 'INVALID_CURRENT_PASSWORD',
      message: '現在のパスワードが正しくありません'
    });
  }

  // 5. 新しいパスワードのハッシュ化
  const newPasswordHash = await bcrypt.hash(newPassword, 10);

  // 6. パスワード更新
  await prisma.employee.update({
    where: { employeeId },
    data: {
      passwordHash: newPasswordHash,
      passwordUpdatedAt: new Date(),
      passwordMustChange: false  // 強制変更フラグをクリア
    }
  });

  // 7. ログイン履歴に記録
  await prisma.loginHistory.create({
    data: {
      employeeId,
      action: 'PASSWORD_CHANGED',
      success: true,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] || 'unknown',
      timestamp: new Date()
    }
  });

  res.json({
    success: true,
    message: 'パスワードを変更しました',
    passwordUpdatedAt: new Date()
  });
}
```

**工数への影響**:
- 元の見積もり: 3日（認証APIのみ）
- 更新後の見積もり: **4日**（認証API + パスワード変更API）

---

### 3. 🟢 技術詳細: ログイン履歴テーブルの実装優先度

#### 質問3-1: LoginHistoryテーブルはPhase 1で実装しますか、それともPhase 2以降ですか？

**回答**: ✅ **Phase 1で実装（VoiceDriveチームの推奨に同意）**

**理由**:
1. **監査ログとして重要**: 不正アクセスの検知に必須
2. **アカウントロック機能の前提**: ログイン失敗回数のカウントに使用
3. **セキュリティ要件**: ログイン履歴の保存は基本的なセキュリティ要件

**テーブルスキーマ**:

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

**追加フィールド**:
- `action`: ログインの種類を記録（成功、失敗、パスワード変更、ログアウト）
- `errorCode`: 失敗時のエラーコードを記録（分析用）

**使用例**:

```typescript
// ログイン成功時
await prisma.loginHistory.create({
  data: {
    employeeId: employee.employeeId,
    action: 'LOGIN_SUCCESS',
    success: true,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'] || 'unknown'
  }
});

// ログイン失敗時
await prisma.loginHistory.create({
  data: {
    employeeId: email,  // employeeIdが不明な場合はemailを使用
    action: 'LOGIN_FAILURE',
    success: false,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'] || 'unknown',
    errorCode: 'INVALID_CREDENTIALS'
  }
});
```

**データ保持期間**: 3年（医療業界の一般的な監査ログ保存期間）

---

### 4. 🟡 実装スケジュール: リソース確保の確認

#### 質問4-1: 医療システムチームは11/1から作業開始可能ですか？

**回答**: ⚠️ **11/1は早すぎます。Phase 1.6（共通DB構築）と同時実施を推奨**

**理由**:
1. **共通DB（MySQL）がまだ構築されていない**: 現在SQLiteでローカル開発中
2. **二度手間の回避**: SQLiteで実装 → MySQL移行時に再実装が必要
3. **Phase 1.6統合実装戦略**: Phase 15（委員会管理）やPhase 16（施設ガバナンス）と同じパターン

**推奨スケジュール**:

| Phase | 期間 | 作業内容 | 状態 |
|-------|------|---------|------|
| **Phase 1.6（共通DB構築）** | TBD（MySQL構築完了後） | MySQL構築 + Employeeテーブル拡張 | ⏳ 待機中 |
| **Phase 2.15（認証API実装）** | Phase 1.6と同時 | 認証API + パスワード変更API実装 | ⏳ 待機中 |

**Phase 1.6の実施タイミング確認が必要**:
- VoiceDriveチームにPhase 1.6の実施予定を確認
- 共通DB構築後に認証API実装を開始

---

#### 質問4-2: 担当者は専任ですか、それとも他タスクと並行ですか？

**回答**: 🟡 **並行作業を想定**

**理由**:
1. **現状の開発体制**: ClaudeCode（AI）が主体のため、並行作業が可能
2. **工数**: 4日間（実働時間）なので、カレンダー上は1-2週間を想定

**推奨リソース配分**:
- 専任率: 50%（他タスクと並行可能）
- カレンダー期間: 約2週間（実働4日÷50% = 8日間）

---

### 5. 🔴 アカウントロック: Redis の運用体制

#### 質問5-1: 医療システムの本番環境にRedisは既に導入されていますか？

**回答**: ❌ **未導入（推定）**

**理由**:
1. 現在のプロジェクトはSQLiteベース（ローカル開発）
2. 本番環境はAWS Lightsail + MySQLを想定
3. Redisの導入状況が明記されていない

**推奨**: ✅ **Option B（データベーステーブルで代用）を採用**

**理由**:
1. **シンプルな実装**: 既存のPrisma + MySQLで実装可能
2. **運用コスト削減**: Redis新規導入の運用負荷を回避
3. **Phase 1での実装可能性**: データベーステーブルなら即座に実装可能

**実装方法（Option B）**:

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

**アカウントロック判定ロジック**:

```typescript
// ログイン失敗カウント増加
async function incrementFailedLoginCount(employeeId: string, ipAddress: string) {
  await prisma.loginAttempt.create({
    data: {
      employeeId,
      success: false,
      ipAddress,
      attemptTime: new Date()
    }
  });
}

// アカウントロック確認（5回失敗で30分ロック）
async function checkAccountLock(employeeId: string): Promise<boolean> {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

  // 過去30分間の失敗回数をカウント
  const failedAttempts = await prisma.loginAttempt.count({
    where: {
      employeeId,
      success: false,
      attemptTime: {
        gte: thirtyMinutesAgo
      }
    }
  });

  return failedAttempts >= 5;
}

// ログイン失敗カウントリセット
async function resetFailedLoginCount(employeeId: string) {
  // 成功時に失敗カウントをリセット（古いレコードを削除）
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  await prisma.loginAttempt.deleteMany({
    where: {
      employeeId,
      attemptTime: {
        lt: oneHourAgo
      }
    }
  });
}
```

**データクリーンアップ（バッチ処理）**:

```typescript
// 毎日深夜に古いレコードを削除
async function cleanupOldLoginAttempts() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  await prisma.loginAttempt.deleteMany({
    where: {
      attemptTime: {
        lt: sevenDaysAgo
      }
    }
  });
}
```

**パフォーマンス考慮**:
- ✅ インデックス設定（employeeId, attemptTime）でクエリ高速化
- ✅ 定期的なデータクリーンアップでテーブルサイズ制御
- ⚠️ 大規模環境（10,000+職員）ではRedis移行を検討

**将来的なRedis移行（Phase 2以降、Optional）**:
- Option B（データベース）で動作確認後、必要に応じてRedisに移行可能
- 移行コスト: 約1日

---

### 6. 🟢 API仕様: エラーコードの詳細化

#### 質問6-1: 以下のエラーケースも定義が必要ですか？

**回答**: ✅ **VoiceDriveチームの推奨に同意します**

| エラーコード | 発生条件 | Phase 1実装 | 理由 |
|------------|---------|------------|------|
| `MISSING_CREDENTIALS` | email/password未入力 | ✅ Yes | 基本的なバリデーション |
| `INVALID_CREDENTIALS` | パスワード誤り | ✅ Yes | 認証の基本エラー |
| `ACCOUNT_LOCKED` | 5回失敗ロック | ✅ Yes | アカウントロック機能の前提 |
| `TOO_MANY_REQUESTS` | Rate Limit超過 | ✅ Yes | DDoS攻撃対策 |
| `ACCOUNT_DISABLED` | 退職済み職員 | ✅ Yes（Phase 1で実装） | セキュリティ要件（質問7参照） |
| `PASSWORD_EXPIRED` | パスワード有効期限切れ | ⏳ Phase 2 | 有効期限機能がPhase 2のため |

**エラーレスポンス仕様**:

```typescript
// エラーレスポンスの型定義
interface ErrorResponse {
  success: false;
  error: ErrorCode;
  message: string;
  details?: string;  // 追加情報（オプション）
}

type ErrorCode =
  | 'MISSING_CREDENTIALS'
  | 'INVALID_CREDENTIALS'
  | 'ACCOUNT_LOCKED'
  | 'TOO_MANY_REQUESTS'
  | 'ACCOUNT_DISABLED'
  | 'PASSWORD_EXPIRED'      // Phase 2
  | 'INVALID_PASSWORD_POLICY'
  | 'EMPLOYEE_NOT_FOUND'
  | 'INVALID_CURRENT_PASSWORD'
  | 'PASSWORD_REUSED';      // Phase 2
```

**実装例**:

```typescript
// src/api/v2/auth/authenticate.ts
export async function authenticate(req: Request, res: Response) {
  const { email, password } = req.body;

  // 1. MISSING_CREDENTIALS
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'MISSING_CREDENTIALS',
      message: 'メールアドレスとパスワードを入力してください'
    });
  }

  // 2. TOO_MANY_REQUESTS（Rate Limitミドルウェアで処理）
  // express-rate-limitが自動的に429ステータスを返す

  // 3. 職員検索
  const employee = await prisma.employee.findUnique({
    where: { email }
  });

  // 4. EMPLOYEE_NOT_FOUND（セキュリティ上、INVALID_CREDENTIALSとして返す）
  if (!employee) {
    return res.status(401).json({
      success: false,
      error: 'INVALID_CREDENTIALS',
      message: 'メールアドレスまたはパスワードが正しくありません'
    });
  }

  // 5. ACCOUNT_DISABLED（退職済み職員）
  if (employee.status === 'retired' || employee.isRetired) {
    return res.status(403).json({
      success: false,
      error: 'ACCOUNT_DISABLED',
      message: 'このアカウントは無効化されています'
    });
  }

  // 6. ACCOUNT_LOCKED
  const isLocked = await checkAccountLock(employee.employeeId);
  if (isLocked) {
    return res.status(403).json({
      success: false,
      error: 'ACCOUNT_LOCKED',
      message: 'アカウントがロックされています。30分後に再試行してください',
      details: '5回連続でログインに失敗したため、アカウントがロックされました'
    });
  }

  // 7. INVALID_CREDENTIALS（パスワード誤り）
  const isPasswordValid = await bcrypt.compare(password, employee.passwordHash);
  if (!isPasswordValid) {
    await incrementFailedLoginCount(employee.employeeId, req.ip);

    return res.status(401).json({
      success: false,
      error: 'INVALID_CREDENTIALS',
      message: 'メールアドレスまたはパスワードが正しくありません'
    });
  }

  // 8. ログイン成功
  await resetFailedLoginCount(employee.employeeId);
  // ...
}
```

**HTTPステータスコードの使い分け**:

| エラーコード | HTTPステータス | 理由 |
|------------|--------------|------|
| `MISSING_CREDENTIALS` | 400 Bad Request | クライアント側の入力エラー |
| `INVALID_CREDENTIALS` | 401 Unauthorized | 認証失敗 |
| `ACCOUNT_LOCKED` | 403 Forbidden | アクセス拒否 |
| `ACCOUNT_DISABLED` | 403 Forbidden | アクセス拒否 |
| `TOO_MANY_REQUESTS` | 429 Too Many Requests | Rate Limit超過 |
| `PASSWORD_EXPIRED` | 403 Forbidden | パスワード変更が必要 |

---

### 7. 🔴 退職職員の扱い

#### 質問7-1: 退職職員（Employee.isRetired = true）のログインを防ぐロジックは必要ですか？

**回答**: ✅ **Yes、Phase 1で実装が必要です**

**理由**:
1. **セキュリティ要件**: 退職職員のアクセス権を即座に無効化することは基本的なセキュリティ要件
2. **コンプライアンス**: 医療情報へのアクセス制御は法的要件
3. **実装コスト**: 追加コストはほぼゼロ（1行のif文で実装可能）

**実装方法**:

```typescript
// POST /api/v2/auth/authenticate
export async function authenticate(req: Request, res: Response) {
  // ... 職員検索後

  // 退職職員チェック
  if (employee.status === 'retired' || employee.isRetired) {
    // ログイン試行を記録（監査ログ）
    await prisma.loginHistory.create({
      data: {
        employeeId: employee.employeeId,
        action: 'LOGIN_FAILURE',
        success: false,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] || 'unknown',
        errorCode: 'ACCOUNT_DISABLED'
      }
    });

    return res.status(403).json({
      success: false,
      error: 'ACCOUNT_DISABLED',
      message: 'このアカウントは無効化されています'
    });
  }

  // ... 以降の認証処理
}
```

**Employeeテーブルの状態フィールド確認**:

現在のスキーマを確認する必要があります。以下のいずれかが存在する想定：

```prisma
model Employee {
  // Option A: status フィールド
  status String  // 'active' | 'leave' | 'retired'

  // または

  // Option B: isRetired フラグ
  isRetired Boolean @default(false) @map("is_retired")

  // または

  // Option C: retiredAt 日時
  retiredAt DateTime? @map("retired_at")
}
```

**推奨**: 既存のフィールドを確認し、そのまま利用

---

### 8. 🟢 CORS設定の詳細

#### 質問8-1: 許可するドメインは以下で正しいですか？

**回答**: ✅ **VoiceDriveチームに確認が必要です**

**推奨設定**:

```typescript
// src/middleware/cors.ts
import cors from 'cors';

const allowedOrigins = [
  'https://voicedrive-v100.vercel.app',        // 本番
  'https://voicedrive-v100-staging.vercel.app', // ステージング
  'http://localhost:3001',                      // 開発（VoiceDrive）
  'http://localhost:3000'                       // 開発（医療システム管理画面用）
];

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // origin未定義の場合（同一オリジン）は許可
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,  // Cookie送信を許可（セッション管理に必要）
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});
```

**環境変数での管理（推奨）**:

```env
# .env.production
ALLOWED_ORIGINS=https://voicedrive-v100.vercel.app,https://voicedrive-v100-staging.vercel.app

# .env.development
ALLOWED_ORIGINS=http://localhost:3001,http://localhost:3000
```

```typescript
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
```

---

#### 質問8-2: Credentialsの送信を許可しますか？

**回答**: ✅ **Yes、credentials: true を設定します**

**理由**:
1. **セッション管理**: VoiceDrive側でCookieベースのセッション管理を使用する場合に必要
2. **JWT認証**: Authorization ヘッダーの送信に必要
3. **セキュリティ**: 同時に`origin`を厳密に制御することでセキュリティを確保

**実装**:

```typescript
export const corsMiddleware = cors({
  origin: allowedOrigins,
  credentials: true,  // ✅ 有効化
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});
```

**VoiceDrive側の実装**:

```typescript
// fetch APIでcredentials: 'include'を指定
fetch('https://medical-system.example.com/api/v2/auth/authenticate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',  // Cookieを送信
  body: JSON.stringify({ email, password })
});
```

---

## 📊 更新後の実装工数見積もり

### 医療システム側の作業（更新版）

| 作業項目 | 推定工数 | 優先度 | 変更内容 |
|---------|---------|-------|---------|
| **1. Employeeテーブル拡張** | 0.5日 | 高 | passwordMustChange追加 |
| **2. 認証API実装** | 1.5日 | 高 | ✅ +0.5日（初回ログイン強制変更） |
| **3. パスワード変更API実装** | 1日 | 高 | 🆕 追加（質問2-2） |
| **4. LoginHistoryテーブル追加** | 0.5日 | 高 | 🆕 追加（質問3-1） |
| **5. LoginAttemptテーブル追加** | 0.5日 | 中 | 🆕 追加（質問5-1、Option B） |
| **6. Rate Limit実装** | 0.25日 | 高 | 変更なし |
| **7. アカウントロック実装** | 0.5日 | 中 | ✅ データベース版に変更 |
| **8. 退職職員チェック実装** | 0.25日 | 高 | 🆕 追加（質問7-1） |
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

## 📅 更新後の実装スケジュール

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

---

## ✅ チェックリスト（更新版）

### Phase 1実装項目

#### データベース拡張
- [ ] Employeeテーブルに以下のフィールド追加:
  - [ ] `passwordHash` (String)
  - [ ] `passwordUpdatedAt` (DateTime?)
  - [ ] `passwordMustChange` (Boolean)
- [ ] LoginHistoryテーブル作成
- [ ] LoginAttemptテーブル作成（アカウントロック用）

#### API実装
- [ ] POST /api/v2/auth/authenticate（認証API）
  - [ ] 入力検証
  - [ ] パスワード検証
  - [ ] 退職職員チェック
  - [ ] アカウントロックチェック
  - [ ] 初回ログイン強制変更フラグ
  - [ ] ログイン履歴記録
- [ ] PUT /api/v2/auth/change-password（パスワード変更API）
  - [ ] 現在のパスワード検証
  - [ ] パスワードポリシー検証
  - [ ] パスワード更新
  - [ ] passwordMustChangeフラグクリア

#### セキュリティ機能
- [ ] Rate Limit実装（5 req/min/IP）
- [ ] アカウントロック実装（5回失敗で30分）
- [ ] パスワードポリシー検証
  - [ ] 最小文字数（8文字）
  - [ ] 複雑さ（3種類以上）
- [ ] CORS設定
  - [ ] 許可ドメイン設定
  - [ ] credentials: true

#### テスト
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

#### ドキュメント
- [ ] API仕様書更新（OpenAPI 3.0）
- [ ] セキュリティ仕様書作成
- [ ] 初期パスワード設定手順書作成

---

## 🎯 まとめ

### 主要な決定事項

1. **パスワード管理方針**: 医療システム集中管理（パターンA）
2. **初期パスワード**: employeeId + '_InitPass2025' + 初回ログイン時強制変更
3. **パスワードポリシー（Phase 1）**: 最小8文字 + 複雑さ3種類以上
4. **パスワード変更API**: Phase 1で同時実装
5. **LoginHistoryテーブル**: Phase 1で実装
6. **アカウントロック**: データベーステーブルで実装（Redis不要）
7. **退職職員チェック**: Phase 1で実装
8. **CORS設定**: credentials: true + 許可ドメイン厳格化

### 工数への影響

| 項目 | 元の見積もり | 更新後 | 差分 |
|-----|------------|-------|------|
| 実装工数 | 3日 | **6.5日** | +3.5日 |
| カレンダー期間 | 1週間 | **約3週間**（50%稼働） | +2週間 |

### 実装開始タイミング

⏳ **Phase 1.6（共通DB構築）と同時実施を推奨**

- 現時点では作業開始せず、共通DB構築完了後に開始
- VoiceDriveチームにPhase 1.6の実施予定を確認

---

## 📞 VoiceDriveチームへの確認依頼

### 確認事項（3件）

1. **Phase 1.6の実施予定**:
   - 共通DB（MySQL）構築の予定時期を教えてください

2. **許可ドメインの確認**:
   - CORS設定で許可するドメインは以下で正しいですか？
     - 本番: `https://voicedrive-v100.vercel.app`
     - ステージング: `https://voicedrive-v100-staging.vercel.app`
     - 開発: `http://localhost:3001`

3. **初期パスワードフォーマットの承認**:
   - 初期パスワード: `{employeeId}_InitPass2025` で問題ないですか？
   - 例: `EMP2024001_InitPass2025`

---

## 🔄 更新履歴

| 日付 | 内容 | 担当 |
|------|------|------|
| 2025-10-27 | 初版作成（8件の質問への回答） | ClaudeCode（医療システム） |

---

**作成者**: ClaudeCode（医療システムチーム）
**承認待ち**: VoiceDriveチームからの確認事項への回答
**次のステップ**: Phase 1.6実施予定の確認後、認証API実装開始

---

**文書終了**
