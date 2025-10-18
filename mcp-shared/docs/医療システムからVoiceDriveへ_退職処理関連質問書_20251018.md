# 退職処理関連機能 VoiceDriveチームへの質問・確認書

**文書番号**: QUE-2025-1018-001
**作成日**: 2025年10月18日
**送信元**: 医療職員管理システムチーム
**送信先**: VoiceDriveチーム（職員カルテシステム）
**回答期限**: 2025年10月25日（1週間以内）
**優先度**: 🟡 MEDIUM（緊急アカウント無効化機能の関連実装）

---

## 📋 30秒サマリー

**目的**: 退職処理・緊急アカウント無効化機能の実装連携確認
**新規ファイル**: 2件（テストデータSQL・テーブル定義SQL）
**質問事項**: 5カテゴリ・計12件
**期待される回答**: 実装方針の確認、データ同期仕様の明確化

---

## 🆕 新規作成ファイルの概要

### ファイル1: TestData_EmergencyRetirement_20251018.sql

**概要**: 緊急退職処理・緊急アカウント停止統合テスト用テストデータ

**内容**:
- テスト職員データ: 4名
  - `TEST-EMP-001`: 緊急退職処理テスト用
  - `TEST-EMP-002`: 緊急アカウント停止テスト用
  - `TEST-EMP-003`: 正式退職処理テスト用（緊急処理あり）
  - `TEST-EMP-004`: 正式退職処理テスト用（緊急処理なし）
- テスト用人事担当者: 1名
  - `TEST-HR-001`: 人事部長（権限レベル15.0）
- 確認用View: `v_test_employees`

**ファイルパス**: `mcp-shared/docs/TestData_EmergencyRetirement_20251018.sql`

---

### ファイル2: EmployeeAccountStatusHistory_TableDefinition_20251018.sql

**概要**: アカウント状態変更履歴テーブル定義（VoiceDrive緊急処理統合用）

**テーブル名**: `employee_account_status_history`

**主要カラム**:
- 対象職員: `employee_id`
- 変更内容: `previous_status`, `new_status`
- 変更元システム: `source_system` ('staff_medical_system' | 'voicedrive_emergency')
- 緊急変更フラグ: `is_emergency_change`
- **VoiceDrive連携**:
  - `voicedrive_deactivation_id` - VoiceDrive EmergencyDeactivation.id
  - `voicedrive_retirement_process_id` - VoiceDrive RetirementProcess.id
- **事後承認ワークフロー**:
  - `approval_required` - 承認が必要か
  - `approved_by`, `approved_by_name` - 承認者情報
  - `approved_at` - 承認日時

**確認用View**: `v_emergency_deactivation_history`（緊急変更のみ抽出・承認ステータス表示）

**ファイルパス**: `mcp-shared/docs/EmployeeAccountStatusHistory_TableDefinition_20251018.sql`

---

## ❓ 質問・確認事項（12件）

### カテゴリ1: テーブル実装の配置先確認（3件）

#### 質問1-1: `employee_account_status_history` テーブルの実装先

**質問**:
`employee_account_status_history` テーブルは、どちらのシステムに実装すべきでしょうか？

**選択肢**:

| Option | 実装先 | 理由 |
|--------|--------|------|
| **A** | 医療システムのみ | 医療システムが職員マスタ管理の責任を持つため |
| **B** | VoiceDriveのみ | VoiceDrive側で緊急処理履歴を完全に管理するため |
| **C** | 両システムに実装 | 各システムで独立した履歴管理が必要なため |
| **D** | 共通DB（将来構築予定） | 両システムから参照可能にするため |

**医療システム側の仮説**: **Option A（医療システムのみ）**
- 理由: 職員の正式な状態変更履歴は医療システムが管理責任を持つ
- VoiceDriveからの緊急処理も、最終的には医療システムのemployees.account_statusに反映される

**ご確認事項**: VoiceDrive側の方針をご教示ください。

---

#### 質問1-2: VoiceDrive側の `EmergencyDeactivation` テーブルとの関係

**背景**:
VoiceDrive側のマスタープラン（`EmergencyAccountDeactivation_Master_Plan_VoiceDrive_20251010.md`）では、以下のテーブルが定義されています：

```prisma
model EmergencyDeactivation {
  id                  String    @id @default(cuid())
  targetUserId        String
  targetEmployeeId    String?
  executedBy          String
  reason              String    @db.Text
  syncToStaffSystem   Boolean   @default(false)
  syncedAt            DateTime?
  status              String    @default("pending") // 'pending' | 'synced' | 'failed'
  // ...
}
```

**質問**:
医療システム側の `employee_account_status_history` テーブルの `voicedrive_deactivation_id` カラムは、VoiceDrive側の `EmergencyDeactivation.id` を格納する想定です。

1. VoiceDrive側から医療システムへのWebhook送信時、`EmergencyDeactivation.id` を含めていただけますか？
2. Webhook送信のペイロード例をご提示いただけますか？

**医療システム側の想定ペイロード**:
```json
{
  "eventType": "account.emergency_deactivation",
  "timestamp": "2025-10-18T15:30:00Z",
  "deactivationId": "deact_abc123xyz",  // ← これを voicedrive_deactivation_id に格納
  "employeeId": "EMP2024001",
  "targetUserId": "user_target_123",
  "reason": "緊急退職",
  "executedBy": {
    "userId": "user_admin",
    "employeeId": "EMP2020001",
    "name": "人事部長",
    "permissionLevel": 15
  }
}
```

**ご確認事項**: ペイロード仕様の確認をお願いします。

---

#### 質問1-3: `RetirementProcess` テーブルとの連携

**質問**:
VoiceDrive側に `RetirementProcess` テーブルも実装予定とのことですが、医療システム側の `employee_account_status_history.voicedrive_retirement_process_id` との連携方法を確認させてください。

**シナリオ**:
1. VoiceDriveで緊急退職処理実行（`EmergencyDeactivation` 作成）
2. 医療システムで正式退職処理実行
3. VoiceDriveで正式退職プロセス開始（`RetirementProcess` 作成）
4. 医療システムに `RetirementProcess.id` を通知？

**質問**:
- `RetirementProcess` と `EmergencyDeactivation` の関係はどうなりますか？
- `RetirementProcess` のWebhook通知は別途実装予定ですか？

---

### カテゴリ2: データ同期仕様の確認（3件）

#### 質問2-1: Webhook送信のタイミング

**質問**:
VoiceDrive側から医療システムへのWebhook送信タイミングを確認させてください。

**想定シナリオ**:

| # | イベント | VoiceDrive → 医療システムWebhook | 医療システム → VoiceDriveWebhook |
|---|----------|--------------------------------|--------------------------------|
| 1 | 緊急アカウント停止実行 | ✅ 送信（即時） | ✅ 受信（確認通知） |
| 2 | 緊急退職処理実行 | ✅ 送信（即時） | ✅ 受信（確認通知） |
| 3 | 医療システム障害中の緊急処理 | ⏳ キュー蓄積 → 復旧後送信 | - |
| 4 | 正式退職処理開始 | ❓ 送信するか？ | - |

**ご確認事項**:
1. シナリオ1-3の理解は正しいですか？
2. シナリオ4（正式退職処理開始）のWebhook送信は必要ですか？

---

#### 質問2-2: 医療システム復旧後の自動同期処理

**背景**:
VoiceDrive側のマスタープランでは、以下の自動同期機能が計画されています：

- 5分ごとのヘルスチェック（`GET /api/health/status`）
- 医療システム復旧検知 → SyncQueue処理開始

**質問**:
医療システム側の `/api/health/status` エンドポイントは以下の仕様で問題ありませんか？

**レスポンス例**:
```json
{
  "status": "healthy",  // 'healthy' | 'degraded' | 'down'
  "timestamp": "2025-10-18T15:30:00Z",
  "services": {
    "database": "healthy",
    "api": "healthy"
  }
}
```

**ご確認事項**:
1. この仕様で問題ありませんか？
2. 追加で必要な情報はありますか？

---

#### 質問2-3: 同期失敗時のリトライ方針

**VoiceDrive側の方針**（マスタープランより）:
- リトライ回数: 3回
- リトライ間隔: 1分、5分、15分
- タイムアウト: 30秒
- 3回失敗 → SyncQueueに蓄積、医療システム復旧後に自動送信

**質問**:
医療システム側でWebhook受信に失敗した場合のリトライ方針はどうしますか？

**選択肢**:

| Option | 方針 |
|--------|------|
| **A** | 医療システム側はリトライしない（VoiceDrive側のリトライに任せる） |
| **B** | 医療システム側でもリトライ実装（冪等性を保証） |
| **C** | 医療システム側で手動再処理機能を提供 |

**医療システム側の仮説**: **Option A**
- 理由: VoiceDrive側で十分なリトライ機構があるため、二重リトライを避ける

**ご確認事項**: VoiceDrive側の推奨方針をご教示ください。

---

### カテゴリ3: 事後承認ワークフローの実装範囲（2件）

#### 質問3-1: 事後承認機能の実装範囲

**背景**:
`employee_account_status_history` テーブルには事後承認フィールドがあります：
- `approval_required` - 承認が必要か
- `approved_by` - 承認者ID
- `approved_at` - 承認日時

**質問**:
事後承認ワークフローの実装範囲を確認させてください。

**想定実装範囲**:

| # | 機能 | 医療システム | VoiceDrive | 備考 |
|---|------|------------|-----------|------|
| 1 | 緊急処理の記録 | ✅ | ✅ | 両システムで記録 |
| 2 | 承認待ちリスト表示 | ✅ | ❓ | 医療システムのみ？ |
| 3 | 承認実行UI | ✅ | ❓ | 医療システムのみ？ |
| 4 | 承認結果のWebhook通知 | ✅ → VoiceDrive | - | VoiceDrive側で承認状態を同期 |

**ご確認事項**:
1. VoiceDrive側で事後承認UI（承認待ちリスト・承認ボタン）は実装予定ですか？
2. 医療システム側で承認実行後、VoiceDrive側に通知するWebhookは必要ですか？

---

#### 質問3-2: 承認者の権限レベル

**質問**:
事後承認を実行できる権限レベルを確認させてください。

**想定権限レベル**:

| 権限レベル | 役職 | 緊急処理実行 | 事後承認実行 |
|-----------|------|------------|------------|
| Level 17 | 理事長 | ✅ | ✅ |
| Level 16 | 理事 | ✅ | ✅ |
| Level 15 | 事務局長 | ✅ | ✅ |
| Level 14 | 人事部長 | ✅ | ✅ |
| Level 13 | 院長・施設長 | ❌ | ✅ ？ |
| Level 11 | 事務長 | ❌ | ✅ ？ |

**質問**:
1. 事後承認はLevel 14-17のみですか？
2. それともLevel 11-17（院長・事務長も含む）ですか？

**医療システム側の仮説**: **Level 14-17のみ**
- 理由: 緊急処理を実行した本人が自分で承認できる方がスムーズ

**ご確認事項**: VoiceDrive側の方針をご教示ください。

---

### カテゴリ4: テストデータの使用方法（2件）

#### 質問4-1: テストデータの投入タイミング

**質問**:
`TestData_EmergencyRetirement_20251018.sql` のテストデータは、いつ投入すべきでしょうか？

**想定タイミング**:

| タイミング | 説明 | 推奨度 |
|----------|------|--------|
| **統合テスト時** | 医療システム・VoiceDrive両方で統合テスト実施時 | 🟢 推奨 |
| **単体テスト時** | 各システムの単体テスト時 | 🟡 任意 |
| **ステージング環境** | ステージング環境のみ | 🔴 非推奨 |
| **本番環境** | 本番環境には投入しない | ❌ 禁止 |

**ご確認事項**:
1. VoiceDrive側でも同様のテストデータを作成する予定ですか？
2. 統合テスト時の手順を共有していただけますか？

---

#### 質問4-2: VoiceDrive側のテストデータとの整合性

**質問**:
医療システム側のテストデータ（`TEST-EMP-001` 〜 `TEST-HR-001`）と、VoiceDrive側のテストデータは同じ内容にすべきでしょうか？

**想定ケース**:

| ケース | 説明 | メリット | デメリット |
|--------|------|---------|----------|
| **同一データ** | `employee_id`、`full_name` 等を完全に一致させる | 統合テストがシンプル | 両チームでSQL共有が必要 |
| **別データ** | 各システムで独立したテストデータ | 各チームが自由に変更可能 | 統合テスト時に紐付けが複雑 |

**医療システム側の仮説**: **同一データ**
- 理由: `employee_id` を共通キーとして使うため、統合テスト時の混乱を避ける

**ご確認事項**:
1. VoiceDrive側で同一のテストデータSQLを使用していただけますか？
2. テストデータの `employee_id` のフォーマット（`TEST-EMP-XXX`）は問題ありませんか？

---

### カテゴリ5: 実装スケジュール・Phase確認（2件）

#### 質問5-1: この実装はどのPhaseに含まれますか？

**VoiceDrive側のマスタープラン**（`EmergencyAccountDeactivation_Master_Plan_VoiceDrive_20251010.md`）:

| Phase | 内容 | 期間 | 状態 |
|-------|------|------|------|
| **Phase 1** | DB実装移行 | 2-3日 | ⏳ 準備中 |
| **Phase 2** | Webhook連携 | 3-5日 | ⏳ 医療チーム実装待ち |
| **Phase 3** | 自動同期機能 | 2-3日 | ⏳ Phase 2後 |
| **Phase 4** | 統合テスト・本番リリース | 1週間 | ⏳ Phase 3後 |

**質問**:
今回の2つのファイル（テストデータ・テーブル定義）は、どのPhaseに含まれますか？

**選択肢**:

| Option | Phase | 理由 |
|--------|-------|------|
| **A** | Phase 1（DB実装移行） | テーブル定義が含まれるため |
| **B** | Phase 2（Webhook連携） | Webhook連携時に必要なテーブルのため |
| **C** | Phase 4（統合テスト） | テストデータが含まれるため |
| **D** | 独立したPhase | 新規Phase 1.5として扱う |

**ご確認事項**: どのPhaseとして扱うべきかご教示ください。

---

#### 質問5-2: 実装スケジュールの調整

**質問**:
医療システム側の実装スケジュールを調整する必要があるか確認させてください。

**医療システム側の想定スケジュール**:

| Week | 作業内容 | 状態 |
|------|---------|------|
| **Week 1 (10/18-10/24)** | `employee_account_status_history` テーブル追加・マイグレーション | ⏳ 実装準備中 |
| **Week 2 (10/25-10/31)** | Webhook受信エンドポイント実装・確認Webhook送信実装 | ⏳ VoiceDrive実装待ち |
| **Week 3 (11/1-11/7)** | 統合テスト・テストデータ投入 | ⏳ Week 2後 |
| **Week 4 (11/8-11/14)** | 本番デプロイ | ⏳ Week 3後 |

**ご確認事項**:
1. VoiceDrive側のスケジュールとの整合性は取れていますか？
2. 調整が必要な箇所はありますか？

---

## 📊 想定データフロー図

### シナリオ1: 緊急アカウント停止（医療システム正常時）

```
VoiceDrive                           医療システム
    │                                     │
    │ ①緊急停止実行                         │
    │  - EmergencyDeactivation作成          │
    │  - User.isRetired = true             │
    │                                     │
    │ ②Webhook送信                         │
    ├─────────────────────────────────────>│
    │  POST /api/webhooks/                 │
    │  voicedrive-emergency-deactivation   │
    │  {                                   │
    │    deactivationId: "deact_abc123",   │
    │    employeeId: "EMP2024001",         │
    │    reason: "緊急退職"                 │
    │  }                                   │
    │                                     │
    │                              ③Employee更新
    │                              - account_status = 'inactive'
    │                                     │
    │                              ④履歴記録
    │                              - employee_account_status_history
    │                                INSERT:
    │                                  voicedrive_deactivation_id = "deact_abc123"
    │                                  source_system = 'voicedrive_emergency'
    │                                  is_emergency_change = true
    │                                     │
    │ ⑤確認Webhook受信                      │
    │<─────────────────────────────────────┤
    │  POST /api/webhooks/                 │
    │  account-deactivation-confirmed      │
    │  {                                   │
    │    deactivationId: "deact_abc123",   │
    │    status: "completed"               │
    │  }                                   │
    │                                     │
    │ ⑥EmergencyDeactivation更新            │
    │  - syncToStaffSystem = true          │
    │  - status = 'synced'                 │
    │                                     │
```

### シナリオ2: 緊急アカウント停止（医療システム障害時）

```
VoiceDrive                           医療システム
    │                                     │
    │ ①緊急停止実行                         │
    │  - EmergencyDeactivation作成          │
    │                                     │
    │ ②Webhook送信 → タイムアウト            │
    ├─────────────────────X (障害中)
    │
    │ ③リトライ1回目（1分後） → 失敗
    ├─────────────────────X
    │
    │ ④リトライ2回目（5分後） → 失敗
    ├─────────────────────X
    │
    │ ⑤リトライ3回目（15分後） → 失敗
    ├─────────────────────X
    │
    │ ⑥SyncQueueに蓄積
    │  - status = 'failed'
    │  - retryCount = 3
    │
    │ ⑦定期ヘルスチェック（5分ごと）
    ├─────────────────────────────────────>│
    │  GET /api/health/status              │
    │<─────────────────────────────────────┤
    │  { status: "down" }                  │
    │                                     │
    │ ... (医療システム復旧待機) ...         │
    │                                     │
    │ ⑧ヘルスチェック → 復旧検知             │
    ├─────────────────────────────────────>│
    │  GET /api/health/status              │
    │<─────────────────────────────────────┤
    │  { status: "healthy" } ✅            │
    │                                     │
    │ ⑨SyncQueue処理開始                    │
    │  - processSyncQueue()                │
    │                                     │
    │ ⑩Webhook再送信                       │
    ├─────────────────────────────────────>│
    │                              (以降、シナリオ1の③-⑥)
```

---

## 📝 回答用テンプレート

以下をコピーしてご回答ください（**回答期限: 2025年10月25日**）：

```markdown
---
## VoiceDriveチームからの回答

**回答者**: ___________
**回答日**: ___________

---

### カテゴリ1: テーブル実装の配置先確認

**質問1-1: `employee_account_status_history` テーブルの実装先**
- [ ] Option A: 医療システムのみ
- [ ] Option B: VoiceDriveのみ
- [ ] Option C: 両システムに実装
- [ ] Option D: 共通DB
- 補足: _________________________________________________________________

**質問1-2: Webhookペイロードに `deactivationId` を含める**
- [ ] はい、含めます
- [ ] いいえ、含めません（理由: _________________）
- 実際のペイロード仕様: _________________________________________________________________

**質問1-3: `RetirementProcess` との連携**
- `RetirementProcess` と `EmergencyDeactivation` の関係: _________________________________________________________________
- `RetirementProcess` のWebhook通知: [ ] 実装予定 / [ ] 実装予定なし

---

### カテゴリ2: データ同期仕様の確認

**質問2-1: Webhook送信のタイミング**
- シナリオ1-3の理解: [ ] 正しい / [ ] 修正が必要（詳細: _________________）
- シナリオ4（正式退職処理開始）のWebhook送信: [ ] 必要 / [ ] 不要

**質問2-2: `/api/health/status` エンドポイント仕様**
- 提示された仕様: [ ] 問題なし / [ ] 修正が必要
- 追加で必要な情報: _________________________________________________________________

**質問2-3: 同期失敗時のリトライ方針**
- [ ] Option A: 医療システム側はリトライしない
- [ ] Option B: 医療システム側でもリトライ実装
- [ ] Option C: 手動再処理機能を提供
- 補足: _________________________________________________________________

---

### カテゴリ3: 事後承認ワークフローの実装範囲

**質問3-1: 事後承認機能の実装範囲**
- VoiceDrive側で事後承認UI実装: [ ] はい / [ ] いいえ
- 承認結果のWebhook通知: [ ] 必要 / [ ] 不要
- 補足: _________________________________________________________________

**質問3-2: 承認者の権限レベル**
- 事後承認実行可能レベル: [ ] Level 14-17のみ / [ ] Level 11-17 / [ ] その他（_____）
- 補足: _________________________________________________________________

---

### カテゴリ4: テストデータの使用方法

**質問4-1: テストデータの投入タイミング**
- VoiceDrive側でも同様のテストデータ作成: [ ] はい / [ ] いいえ
- 統合テスト手順書: [ ] 作成済み（URL: _________________） / [ ] これから作成

**質問4-2: テストデータの整合性**
- 医療システム側と同一のテストデータを使用: [ ] はい / [ ] いいえ
- `TEST-EMP-XXX` フォーマット: [ ] 問題なし / [ ] 変更希望（_________________）

---

### カテゴリ5: 実装スケジュール・Phase確認

**質問5-1: Phaseの位置づけ**
- [ ] Option A: Phase 1（DB実装移行）
- [ ] Option B: Phase 2（Webhook連携）
- [ ] Option C: Phase 4（統合テスト）
- [ ] Option D: 独立したPhase（Phase 1.5）

**質問5-2: スケジュール調整**
- 医療システム側のスケジュールとの整合性: [ ] 問題なし / [ ] 調整が必要
- 調整が必要な箇所: _________________________________________________________________

---

### 追加の質問・懸念事項
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________

---

### 統合テスト協力可否
- [ ] ステージング環境でのテスト協力可能
- [ ] ステージング環境URL: _________________
- テスト実施可能日: ___/___/___

---
```

---

## 📞 連絡先

### 医療システムチーム
**Slack**: `#medical-system-voicedrive-integration`
**MCP共有フォルダ**: `mcp-shared/docs/`
**緊急連絡**: DM（平日9:00-18:00）

### VoiceDriveチーム（ご記入ください）
**プロジェクトリード**: ___________
**技術リード**: ___________
**緊急連絡先**: ___________

---

## 📎 添付資料

### 新規作成ファイル
1. **テストデータSQL**
   `mcp-shared/docs/TestData_EmergencyRetirement_20251018.sql`

2. **テーブル定義SQL**
   `mcp-shared/docs/EmployeeAccountStatusHistory_TableDefinition_20251018.sql`

### 参照ドキュメント（VoiceDrive側）
1. **VoiceDrive側マスタープラン**
   `mcp-shared/docs/EmergencyAccountDeactivation_Master_Plan_VoiceDrive_20251010.md`

2. **エグゼクティブサマリー**
   `mcp-shared/docs/Response_EmergencyAccountDeactivation_Requirements_EXECUTIVE_SUMMARY_20251010.md`

3. **DB要件分析書**
   `mcp-shared/docs/account-deactivation_DB要件分析_20251010.md`

---

## ✅ 次のステップ

### VoiceDriveチーム様
1. **1週間以内（10/25まで）**: 質問事項にご回答
2. **回答後**: 実装方針の最終確認ミーティング（必要に応じて）
3. **Week 2（10/25-31）**: 両チーム並行実装開始

### 医療システムチーム
1. **10/25**: VoiceDriveチームからの回答受領
2. **10/25-26**: 回答内容を踏まえた実装計画の最終調整
3. **10/28-**: 実装開始（`employee_account_status_history` テーブル追加）

---

## 🙏 謝辞

日頃よりVoiceDrive開発にご尽力いただき、誠にありがとうございます。

本件は緊急アカウント無効化機能の重要な連携部分であり、両システムの整合性確保が不可欠です。貴チームのご協力により、より堅牢で信頼性の高いシステムを実現できると確信しております。

**回答期限**: 2025年10月25日（1週間以内）

ご不明点がございましたら、いつでもお気軽にお問い合わせください。

引き続きよろしくお願いいたします。

---

**医療職員管理システムチーム**
**作成日**: 2025年10月18日
**文書番号**: QUE-2025-1018-001

---

**文書終了**
