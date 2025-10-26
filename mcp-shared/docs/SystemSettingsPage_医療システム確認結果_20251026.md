# SystemSettingsPage 医療システム確認結果報告書

**文書番号**: MED-CONF-2025-1026-012
**作成日**: 2025年10月26日
**作成者**: ClaudeCode（医療システムチーム）
**件名**: SystemSettingsPage暫定マスターリストの医療システム側確認結果

---

## 📋 エグゼクティブサマリー

VoiceDriveチームからの「SystemSettingsPage暫定マスターリスト」に対する回答です。

### 結論

✅ **医療システム側の対応は一切不要です**

**理由**:
- SystemSettingsPageは**VoiceDrive側のシステム基盤設定ページ**
- VoiceDriveのインフラ設定（DB、API、セキュリティ、キャッシュ、通知基盤等）を管理
- 医療システムとは**完全に独立**したシステム基盤設定
- データ管理責任は**VoiceDrive 100%**

### データ管理責任分界点

| データ種別 | 医療システム | VoiceDrive |
|---------|------------|-----------|
| システム基盤設定（27項目） | 0% | ✅ 100% |
| 一般設定（サイト名、メンテナンスモード） | - | ✅ VoiceDrive管理 |
| セキュリティ基盤（パスワードポリシー、2FA） | - | ✅ VoiceDrive管理 |
| 通知基盤設定（メール、システムアラート） | - | ✅ VoiceDrive管理 |
| データベース基盤設定（バックアップ、保持期間） | - | ✅ VoiceDrive管理 |
| API基盤設定（レート制限、CORS） | - | ✅ VoiceDrive管理 |
| 詳細設定（ログレベル、キャッシュ） | - | ✅ VoiceDrive管理 |

---

## 1. ページ概要

### SystemSettingsPageとは

**目的**: VoiceDriveシステムのインフラ・基盤レイヤー設定を管理

**対象ユーザー**: Level 99専用（システムオペレーター）

**管理対象**:
1. 一般設定（4項目）: サイト名、メンテナンスモード、デフォルト言語、セッションタイムアウト
2. セキュリティ設定（5項目）: パスワードポリシー、2FA、ログイン試行制限
3. 通知設定（3項目）: メール通知、システムアラート、保存期間
4. データベース設定（5項目）: バックアップ、保持期間、圧縮、タイムアウト
5. API設定（5項目）: API有効化、レート制限、CORS、キーローテーション、Webhook
6. 詳細設定（5項目）: ログレベル、キャッシュ、パフォーマンス監視、デバッグモード

**合計**: 27項目の設定管理

---

## 2. 医療システム側の対応要否判定

### ❌ 対応不要

**判定理由**:

#### 2.1 データ管理責任の原則

**原則**: システム基盤設定は各システムが独立して管理

- **VoiceDriveの基盤設定**: VoiceDriveが管理
- **医療システムの基盤設定**: 医療システムが管理
- **データ重複のリスク**: なし（完全独立）

#### 2.2 システム基盤設定の性質

**VoiceDrive側の設定内容**:
- VoiceDriveのWebサーバー設定（Vercel）
- VoiceDriveのデータベース設定（Prisma + PostgreSQL）
- VoiceDriveのキャッシュ設定（Redis）
- VoiceDriveのAPI設定（Next.js API Routes）

**医療システム側との関連性**: なし

#### 2.3 業務機能設定との違い

**SystemSettingsPageは管理しない**:
- ❌ 業務機能設定（面談、投票、委員会、プロジェクト等）→ 各専用ページで管理
- ❌ 通知カテゴリ管理 → NotificationSettingsPage
- ❌ ユーザー・権限管理 → UserManagementPage

**→ 医療システムとの連携が必要な業務機能設定はこのページでは扱わない**

---

## 3. 例外: オプション連携（Webhook通知）

### 3.1 セキュリティ設定変更時の通知

**シナリオ**: VoiceDrive側で2要素認証やパスワードポリシーを変更した場合、医療システムのSSO設定と整合性を取る必要がある

**連携方式**: Webhook通知（オプション）

**VoiceDrive → 医療システム**:
```http
POST https://medical-system.kousei-kai.jp/api/webhooks/voicedrive/settings-changed
Content-Type: application/json
Authorization: Bearer {webhook_secret}

{
  "event": "settings.security.updated",
  "category": "security",
  "changes": {
    "twoFactorAuth": true,
    "passwordMinLength": 12,
    "passwordRequireNumbers": true,
    "passwordRequireSymbols": true
  },
  "timestamp": "2025-10-26T10:00:00Z",
  "updatedBy": "system-operator-001"
}
```

**医療システム側の対応（オプション）**:
```typescript
// src/app/api/webhooks/voicedrive/settings-changed/route.ts（新規、オプション）
export async function POST(request: NextRequest) {
  const payload = await request.json();

  // 2FA設定変更を受信
  if (payload.category === 'security' && payload.changes.twoFactorAuth !== undefined) {
    // 医療システムのSSO設定に反映（必要に応じて）
    await updateSSOConfig({
      twoFactorAuthEnabled: payload.changes.twoFactorAuth
    });

    // 監査ログ記録
    await AuditService.log({
      userId: 'system',
      action: 'VOICEDRIVE_SECURITY_SETTINGS_SYNC',
      details: `VoiceDrive 2FA設定を同期: ${payload.changes.twoFactorAuth}`,
      severity: 'medium'
    });
  }

  return NextResponse.json({ success: true });
}
```

**実装優先度**: 🟢 低（オプション）

**推定工数**: 0.5日（4時間）

---

### 3.2 通知基盤設定の参照

**シナリオ**: 医療システムからVoiceDriveユーザーへ通知を送信する際、VoiceDrive側の通知設定（メール通知ON/OFF等）を参照する必要がある

**連携方式**: API呼び出し（将来検討）

**医療システム → VoiceDrive**:
```http
GET https://voicedrive-v100.vercel.app/api/system/settings/notification
Authorization: Bearer {api_key}

// レスポンス
{
  "emailNotifications": true,
  "systemAlerts": true,
  "notificationRetention": 30
}
```

**医療システム側の利用**:
```typescript
// src/lib/notificationSender.ts
async function sendNotificationToVoiceDriveUser(userId: string, message: string) {
  // VoiceDrive側の通知設定を確認
  const voiceDriveSettings = await fetch(
    'https://voicedrive-v100.vercel.app/api/system/settings/notification',
    { headers: { Authorization: `Bearer ${VOICEDRIVE_API_KEY}` } }
  ).then(res => res.json());

  // メール通知が有効な場合のみ送信
  if (voiceDriveSettings.emailNotifications) {
    await sendEmail(userId, message);
  }
}
```

**実装優先度**: 🟢 低（将来検討）

**推定工数**: 0.25日（2時間）

---

## 4. 医療システム側の実装タスク

### ❌ 必須実装タスク: なし

**理由**: SystemSettingsPageは医療システムと独立

### 🟢 オプション実装タスク（将来検討）

| # | タスク | 優先度 | 推定工数 | 説明 |
|---|--------|--------|---------|------|
| 1 | Webhook受信エンドポイント実装 | 🟢 低 | 0.5日 | VoiceDriveセキュリティ設定変更通知受信 |
| 2 | VoiceDrive通知設定参照API実装 | 🟢 低 | 0.25日 | VoiceDrive通知設定の取得・参照 |

**合計**: 0.75日（6時間）

**実装判断**: VoiceDriveチームと協議後に決定

---

## 5. VoiceDrive側の実装タスク（参考情報）

### 必須実装（VoiceDrive側）

| # | タスク | 優先度 | 推定工数 |
|---|--------|--------|---------|
| 1 | GET /api/system/settings API実装 | 🔴 高 | 0.5日 |
| 2 | POST /api/system/settings API実装 | 🔴 高 | 0.5日 |
| 3 | SystemConfigテーブルCRUD実装 | 🔴 高 | 0.5日 |
| 4 | 監査ログ統合 | 🔴 高 | 0.5日 |

**Phase 1合計**: 2日（16時間）

### 推奨実装（VoiceDrive側）

| # | タスク | 優先度 | 推定工数 |
|---|--------|--------|---------|
| 5 | POST /api/system/database/backup | 🟡 中 | 0.5日 |
| 6 | POST /api/system/database/restore | 🟡 中 | 0.5日 |
| 7 | POST /api/system/database/optimize | 🟡 中 | 0.5日 |
| 8 | POST /api/system/api/regenerate-key | 🟡 中 | 0.5日 |
| 9 | POST /api/system/cache/clear | 🟡 中 | 0.5日 |

**Phase 2合計**: 2.5日（20時間）

**VoiceDrive側全体**: 4.5日（36時間）

---

## 6. データベース実装状況

### VoiceDrive側テーブル

#### ✅ SystemConfig テーブル（既存実装で十分）

**実装状況**: schema.prisma 204-220行目に存在

```prisma
model SystemConfig {
  id            String   @id @default(cuid())
  configKey     String   @unique
  configValue   Json
  category      String
  description   String?
  isActive      Boolean  @default(true)
  updatedBy     String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  updatedByUser User     @relation("SystemConfigUpdater", fields: [updatedBy], references: [id])

  @@index([configKey])
  @@index([category])
  @@index([updatedAt])
  @@map("system_configs")
}
```

**確認結果**: ✅ 既存実装で十分（追加フィールド不要）

### 医療システム側テーブル

#### ❌ 新規テーブル不要

**理由**: SystemSettingsPageは医療システムと独立

---

## 7. セキュリティ考慮事項

### 7.1 Webhook認証（オプション実装時）

**VoiceDrive → 医療システム Webhook送信時**:
- **認証方式**: HMAC-SHA256署名
- **Webhookシークレット**: 共有シークレット鍵
- **タイムスタンプ検証**: リプレイ攻撃防止

**実装例**:
```typescript
// src/app/api/webhooks/voicedrive/settings-changed/route.ts
export async function POST(request: NextRequest) {
  // HMAC-SHA256署名検証
  const signature = request.headers.get('X-Webhook-Signature');
  const timestamp = request.headers.get('X-Webhook-Timestamp');
  const body = await request.text();

  const expectedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(`${timestamp}.${body}`)
    .digest('hex');

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  // タイムスタンプ検証（5分以内）
  if (Date.now() - parseInt(timestamp) > 300000) {
    return NextResponse.json({ error: 'Timestamp expired' }, { status: 401 });
  }

  // Webhook処理
  const payload = JSON.parse(body);
  // ...
}
```

### 7.2 API認証（VoiceDrive通知設定参照時）

**医療システム → VoiceDrive API呼び出し時**:
- **認証方式**: Bearer Token（VoiceDrive発行のAPIキー）
- **有効期限**: 90日（VoiceDrive側で設定可能）
- **権限**: システム設定読み取り専用

---

## 8. パフォーマンス考慮事項

### 8.1 Webhook送信頻度

**VoiceDrive → 医療システム**:
- **頻度**: 設定変更時のみ（低頻度）
- **バッチ処理**: 複数設定変更時は1回のWebhookにまとめる
- **非同期処理**: 医療システム側で非同期処理推奨

### 8.2 API呼び出し頻度

**医療システム → VoiceDrive**:
- **頻度**: 通知送信時のみ（中頻度）
- **キャッシュ**: VoiceDrive通知設定を5分間キャッシュ
- **レート制限**: 100リクエスト/分（VoiceDrive側で設定）

---

## 9. VoiceDriveチームへの確認事項

### 質問1: Webhook通知の必要性

**質問**:
VoiceDrive側でセキュリティ設定（2FA、パスワードポリシー）を変更した際、医療システムへWebhook通知を送信する必要がありますか?

**選択肢**:
1. **不要**: VoiceDriveと医療システムは完全独立（認証システムも別々）
2. **必要**: 将来的にSSO統合を予定しており、設定同期が必要

**医療システムの推奨**: 選択肢1（完全独立）

---

### 質問2: 通知設定の参照

**質問**:
医療システムからVoiceDriveユーザーへ通知を送信する際、VoiceDrive側の通知設定（メール通知ON/OFF）を参照する必要がありますか?

**選択肢**:
1. **不要**: 医療システムからの通知は常に送信（ユーザーが個別にON/OFF設定）
2. **必要**: VoiceDrive側の通知設定を尊重し、OFFの場合は送信しない

**医療システムの推奨**: 選択肢1（独立送信）

---

### 質問3: 実装スケジュール

**質問**:
SystemSettingsPageの実装スケジュールを教えてください。医療システム側のオプション実装（Webhook受信等）のタイミングを調整します。

**医療システムの対応**:
- VoiceDrive側のPhase 1完了後に判断
- 必要性が確認された場合、Phase 2で実装検討

---

## 10. まとめ

### データ管理責任（再確認）

| データ種別 | 医療システム | VoiceDrive | 備考 |
|---------|------------|-----------|------|
| システム基盤設定（27項目） | 0% | ✅ 100% | 完全独立 |
| セキュリティ設定 | - | ✅ VoiceDrive管理 | オプション: Webhook通知 |
| 通知基盤設定 | - | ✅ VoiceDrive管理 | オプション: API参照 |
| データベース設定 | - | ✅ VoiceDrive管理 | 医療システム関与なし |
| API設定 | - | ✅ VoiceDrive管理 | 医療システム関与なし |
| 詳細設定 | - | ✅ VoiceDrive管理 | 医療システム関与なし |

### 医療システム側の実装タスク

#### ❌ 必須実装: なし

**理由**: SystemSettingsPageは医療システムと完全独立

#### 🟢 オプション実装（将来検討）

| # | タスク | 推定工数 | 実装判断時期 |
|---|--------|---------|------------|
| 1 | Webhook受信エンドポイント | 0.5日 | VoiceDrive Phase 1完了後 |
| 2 | VoiceDrive通知設定参照API | 0.25日 | VoiceDrive Phase 1完了後 |

**合計**: 0.75日（6時間）

### VoiceDrive側の実装タスク（参考）

| Phase | 工数 | 内容 |
|-------|------|------|
| Phase 1 - 必須 | 2日 | 設定取得/保存API、CRUD実装、監査ログ |
| Phase 2 - 推奨 | 2.5日 | DB操作、APIキー再生成、キャッシュクリア |
| **合計** | **4.5日** | **VoiceDrive側のみ** |

---

## 11. 次のアクション

### 医療システムチームの対応

1. ✅ **本報告書をVoiceDriveチームへ送付** - 確認結果共有
2. ⏳ **VoiceDriveからの3つの確認事項への回答待ち**
3. ⏳ **オプション実装の必要性判断** - VoiceDrive Phase 1完了後

### VoiceDriveチームへの期待

1. ⏳ **本報告書のレビュー** - 医療システム側の判断確認
2. ⏳ **3つの確認事項への回答** - Webhook通知、通知設定参照、実装スケジュール
3. ⏳ **Phase 1実装開始** - SystemSettingsPageの基本機能実装

---

## 12. 関連ドキュメント

1. [SystemSettingsPage暫定マスターリスト](./SystemSettingsPage暫定マスターリスト_20251026.md) - VoiceDriveからの要件定義
2. [SystemSettingsPage DB要件分析](./SystemSettingsPage_DB要件分析_20251026.md) - VoiceDrive側のDB分析
3. [organization-analytics_医療システム確認結果_20251010.md](./organization-analytics_医療システム確認結果_20251010.md) - 参考: 組織分析ページの確認結果
4. [UserManagementPage_医療システム確認結果_20251026.md](./UserManagementPage_医療システム確認結果_20251026.md) - 参考: UserManagementPageの確認結果

---

**文書終了**

最終更新: 2025年10月26日
バージョン: 1.0
承認: 未承認（VoiceDriveチームレビュー待ち）
次回レビュー: VoiceDriveチームからのフィードバック受領後
