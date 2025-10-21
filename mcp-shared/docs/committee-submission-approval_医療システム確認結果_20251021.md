# Committee Submission Approval 医療システム確認結果報告書

**文書番号**: MED-CONF-2025-1021-002
**作成日**: 2025年10月21日
**作成者**: ClaudeCode（医療システムチーム）
**件名**: Committee Submission Approval機能の医療システム側確認結果
**参照文書**:
- [committee-submission-approval暫定マスターリスト_20251021.md](./committee-submission-approval暫定マスターリスト_20251021.md)
- [committee-submission-approval_DB要件分析_20251021.md](./committee-submission-approval_DB要件分析_20251021.md)

---

## 📋 エグゼクティブサマリー

VoiceDriveチームから提供された「Committee Submission Approval 暫定マスターリスト」を精査しました。
医療システム側のDB構造・API提供状況を調査し、本機能に対する医療システム側の対応要否を結論付けます。

### 結論

**医療システム側の追加実装は不要です。**

| 項目 | VoiceDrive側 | 医療システム側 | 理由 |
|------|-------------|--------------|------|
| **プロジェクト投稿（Post）** | ✅ 100%管理 | ❌ なし | VoiceDrive専用機能 |
| **投票データ（Vote）** | ✅ 100%管理 | ❌ なし | VoiceDrive専用機能 |
| **議題提案書（ProposalDocument）** | ✅ 100%管理 | ❌ なし | VoiceDrive専用機能 |
| **委員会提出（CommitteeSubmissionRequest）** | ✅ 100%管理 | ❌ なし | VoiceDrive専用機能 |
| **職員権限レベル** | キャッシュのみ | ✅ マスタ管理 | 既存API/Webhookで提供済み |

### 医療システム側の役割

Committee Submission Approval機能において、医療システムが提供するのは以下のみ：

1. **職員基本情報**（名前、部署、役職） - **既存API/Webhook使用**
2. **権限レベル**（Level 7+, Level 8+の判定） - **既存API/Webhook使用**

**これらは既に実装済みであり、新規API・Webhook追加は不要です。**

---

## 🔍 詳細分析

### 1. Committee Submission Approval機能の概要

#### 機能説明
Level 7+（主任・統括主任）が作成した議題提案書を、Level 8+（師長・科長）が委員会に提出承認する機能

#### データフロー
```
┌──────────────────────────────────────────────────────────┐
│  Level 7+ (主任・統括主任)                                 │
│  - 議題提案書を作成（ProposalDocument）                    │
│  - 委員会提出リクエストを作成（CommitteeSubmissionRequest）│
└──────────────────────────────────────────────────────────┘
                       │
                       │ ① 提出リクエスト
                       ▼
┌──────────────────────────────────────────────────────────┐
│  Level 8+ (師長・科長)                                     │
│  - 提出リクエストを確認                                    │
│  - 投票データ・コメント分析を確認                           │
│  - 承認 or 却下を判断                                     │
└──────────────────────────────────────────────────────────┘
                       │
                       │ ② 承認時
                       ▼
┌──────────────────────────────────────────────────────────┐
│  委員会（安全管理委員会、等）                               │
│  - 提案書が正式に委員会に提出される                         │
└──────────────────────────────────────────────────────────┘
```

#### 医療システムから取得するデータ

| データ項目 | 用途 | 提供方法 | 状態 |
|-----------|------|---------|------|
| 職員名 | 提出者・承認者の表示 | **既存API** | ✅ 提供済み |
| 部署名 | 提出者の所属表示 | **既存API** | ✅ 提供済み |
| 役職名 | 提出者の役職表示 | **既存API** | ✅ 提供済み |
| 権限レベル | Level 7+/Level 8+判定 | **既存API** | ✅ 提供済み |

**重要**: 全て**既存API/Webhook**で提供されており、新規実装は不要です。

---

### 2. 医療システムが提供する既存API/Webhook

#### API-1: 職員情報取得API（既存）

**エンドポイント**: `GET /api/v2/employees/{employeeId}`

**レスポンス例**:
```json
{
  "employeeId": "EMP2024001",
  "name": "山田 太郎",
  "department": "外科",
  "position": "主任",
  "permissionLevel": 7.0,
  "facilityId": "tategami-hospital",
  "hireDate": "2020-04-01",
  "email": "yamada@example.com"
}
```

**使用箇所**:
- Committee Submission ApprovalページのLevel 7+/Level 8+判定
- 提出者・承認者の名前・部署表示

**状態**: ✅ **実装済み**（Phase 3完了）

---

#### Webhook-1: 職員情報更新通知（既存）

**エンドポイント**: `POST https://voicedrive.ai/api/webhooks/employee-updated`

**ペイロード例**:
```json
{
  "eventType": "employee.updated",
  "timestamp": "2025-10-21T10:30:00Z",
  "employeeId": "EMP2024001",
  "changes": {
    "name": { "old": "山田 太郎", "new": "山田 花子" },
    "permissionLevel": { "old": 7.0, "new": 8.0 },
    "department": { "old": "外科", "new": "内科" }
  },
  "signature": "abc123..."
}
```

**使用箇所**:
- VoiceDrive側のUserテーブルキャッシュ更新
- 権限レベル変更時のリアルタイム反映

**状態**: ✅ **実装済み**（Phase 3完了）

**VoiceDrive側の処理**:
```typescript
// Userテーブルのキャッシュを更新（既存実装）
await prisma.user.update({
  where: { employeeId },
  data: {
    name: changes.name?.new,
    permissionLevel: changes.permissionLevel?.new,
    department: changes.department?.new,
    updatedAt: new Date()
  }
});
```

---

### 3. VoiceDrive側で実装が必要なテーブル

Committee Submission Approval機能は**VoiceDrive専用機能**であり、以下のテーブルは全てVoiceDrive側のDBに実装されます。

#### 🔴 必須テーブル（VoiceDrive側実装）

| テーブル | 責任 | 状態 | 医療システム側対応 |
|---------|------|------|------------------|
| `CommitteeSubmissionRequest` | VoiceDrive | 🔴 未実装（メモリのみ） | ❌ **なし** |
| `ProposalDocument` | VoiceDrive | 🔴 未実装（メモリのみ） | ❌ **なし** |
| `ProposalAuditLog` | VoiceDrive | 🔴 未実装 | ❌ **なし** |
| `CommitteeInfo` | VoiceDrive | 🟡 拡張推奨 | ❌ **なし** |

**結論**: 医療システム側のテーブル追加は**0件**です。

---

### 4. VoiceDrive側の実装要件（参考情報）

以下はVoiceDriveチームが対応する実装内容です。医療システム側の対応は不要です。

#### Phase 1: DB永続化（VoiceDrive側: 2-3日）

**VoiceDriveチームの作業**:
1. CommitteeSubmissionRequestテーブル追加
2. ProposalDocumentテーブル追加
3. ProposalAuditLogテーブル追加
4. CommitteeSubmissionServiceのDB対応リファクタリング
5. ProposalDocumentGeneratorのDB対応リファクタリング

**医療システムチームの作業**: ❌ **なし**

---

#### Phase 2: 監査ログ実装（VoiceDrive側: 1-2日）

**VoiceDriveチームの作業**:
1. ProposalAuditLog記録処理実装
2. 監査ログ表示UI実装

**医療システムチームの作業**: ❌ **なし**

---

#### Phase 3: 正規化（VoiceDrive側: 1日）

**VoiceDriveチームの作業**:
1. CommitteeInfoテーブル確認・拡張
2. targetCommittee正規化

**医療システムチームの作業**: ❌ **なし**

---

## ✅ 医療システム側の確認結果

### 確認-1: 既存APIで全ての要件を満たすか？

**回答**: ✅ **はい、満たします。**

| 必要なデータ | 既存API/Webhook | 状態 |
|------------|----------------|------|
| 職員名 | `GET /api/v2/employees/{employeeId}` | ✅ 提供済み |
| 部署名 | `GET /api/v2/employees/{employeeId}` | ✅ 提供済み |
| 役職名 | `GET /api/v2/employees/{employeeId}` | ✅ 提供済み |
| 権限レベル | `GET /api/v2/employees/{employeeId}` | ✅ 提供済み |
| 権限レベル更新通知 | `POST /api/webhooks/employee-updated` | ✅ 提供済み |

**結論**: 新規API・Webhook追加は**不要**です。

---

### 確認-2: VoiceDrive側のUserテーブルキャッシュは十分か？

**回答**: ✅ **はい、十分です。**

VoiceDrive側のUserテーブル（キャッシュ）には、以下のフィールドが既に実装されています：

```prisma
model User {
  id               String   @id @default(cuid())
  employeeId       String   @unique  // 医療システムの職員ID
  name             String            // 医療システムから同期
  department       String?           // 医療システムから同期
  position         String?           // 医療システムから同期
  permissionLevel  Decimal           // 医療システムから同期
  facilityId       String?           // 医療システムから同期
  email            String?

  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  // ... その他のフィールド
}
```

**同期方法**:
1. 初回ログイン時: `GET /api/v2/employees/{employeeId}` でデータ取得
2. 更新時: Webhook `POST /api/webhooks/employee-updated` で自動同期

**結論**: 既存のキャッシュ仕組みで十分対応可能です。

---

## 📊 医療システム側の対応チェックリスト

### ✅ 確認完了項目

- [x] ✅ Committee Submission Approval機能の要件確認
- [x] ✅ 既存API/Webhookの十分性確認
- [x] ✅ VoiceDrive側のUserキャッシュ仕組み確認
- [x] ✅ 新規API・Webhook不要の結論
- [x] ✅ 本確認結果報告書の作成

### ❌ 必要な新規実装

**なし**

医療システム側の追加実装は一切不要です。

---

## 🎯 VoiceDriveチームへの回答まとめ

### A. API提供依頼への回答

**依頼内容**: なし

Committee Submission Approvalページで必要な医療システムデータは、全て**既存API**で取得可能です。

**既存API**:
- `GET /api/v2/employees/{employeeId}` - 職員基本情報・権限レベル取得

**レスポンス例**:
```json
{
  "employeeId": "EMP2024001",
  "name": "山田 太郎",
  "department": "外科",
  "position": "主任",
  "permissionLevel": 7.0
}
```

**結論**: 新規API追加は**不要**です。

---

### B. Webhook通知依頼への回答

**依頼内容**: なし

Committee Submission Approvalページで必要なWebhook通知は、全て**既存Webhook**で対応可能です。

**既存Webhook**:
- `POST /api/webhooks/employee-updated` - 職員情報更新通知

**ペイロード例**:
```json
{
  "eventType": "employee.updated",
  "timestamp": "2025-10-21T10:30:00Z",
  "employeeId": "EMP2024001",
  "changes": {
    "name": { "old": "山田 太郎", "new": "山田 花子" },
    "permissionLevel": { "old": 7.0, "new": 8.0 }
  },
  "signature": "abc123..."
}
```

**結論**: 新規Webhook追加は**不要**です。

---

### C. VoiceDrive DB構築計画への確認

**確認内容**: VoiceDrive側のDB構築計画（3テーブル追加）を確認しました。

| テーブル | 優先度 | 医療システム側の関与 |
|---------|-------|-------------------|
| CommitteeSubmissionRequest | 🔴 CRITICAL | ❌ **なし** |
| ProposalDocument | 🔴 CRITICAL | ❌ **なし** |
| ProposalAuditLog | 🔴 CRITICAL | ❌ **なし** |

**結論**: VoiceDrive側の独自実装であり、医療システム側の対応は**不要**です。

---

### D. 医療システムへの確認事項への回答

**確認事項-1**: なし

VoiceDrive暫定マスターリストには、医療システムチームへの確認事項が**0件**でした。

**理由**: Committee Submission Approvalは**VoiceDrive専用機能**であり、医療システムチームへの確認事項は存在しません。

---

## 📅 実装スケジュール（参考: VoiceDrive側）

以下はVoiceDriveチームの実装スケジュールです。医療システムチームの作業は発生しません。

### VoiceDrive側実装計画（4日間）

| Day | 日付 | 作業内容 | 担当 | 状態 |
|-----|------|---------|------|------|
| Day 1 | TBD | DB実装（3テーブル追加） + サービス層リファクタリング | VoiceDrive | ⏳ 提案中 |
| Day 2 | TBD | API実装（6エンドポイント） | VoiceDrive | ⏳ 提案中 |
| Day 3 | TBD | フロントエンド統合 | VoiceDrive | ⏳ 提案中 |
| Day 4 | TBD | テスト + デプロイ | VoiceDrive | ⏳ 提案中 |

### 医療システム側作業

**なし**

---

## 📝 医療システムチームへの推奨事項

### ✅ 実装推奨事項

**なし**

Committee Submission Approval機能は**VoiceDrive専用機能**であり、医療システム側の実装推奨事項はありません。

### ✅ テスト推奨事項

**なし**

ただし、以下の**既存API/Webhook**が正常に動作していることを確認することを推奨します：

1. **職員情報取得API**（`GET /api/v2/employees/{employeeId}`）
   - Level 7+, Level 8+の権限レベルが正確に返却されること
   - 部署名、役職名が正確に返却されること

2. **職員情報更新Webhook**（`POST /api/webhooks/employee-updated`）
   - 権限レベル変更時に正常に発火すること
   - VoiceDrive側でキャッシュが正常に更新されること

**テスト実施時期**: VoiceDrive側のPhase 1実装完了後（統合テスト時）

---

## 🔗 関連ドキュメント

### VoiceDrive側ドキュメント

1. **Committee Submission Approval 暫定マスターリスト**
   - `mcp-shared/docs/committee-submission-approval暫定マスターリスト_20251021.md`
   - VoiceDrive側の実装計画、スケジュール、チェックリスト

2. **Committee Submission Approval DB要件分析**
   - `mcp-shared/docs/committee-submission-approval_DB要件分析_20251021.md`
   - テーブル定義、データフロー、実装優先順位

### 医療システム側ドキュメント（本文書）

3. **Committee Submission Approval 医療システム確認結果報告書**
   - `mcp-shared/docs/committee-submission-approval_医療システム確認結果_20251021.md`
   - 本文書

### 既存ドキュメント（参考）

4. **PersonalStation暫定マスターリスト**
   - `mcp-shared/docs/PersonalStation暫定マスターリスト_20251008.md`
   - 同様の分析プロセスの参考事例

5. **組織分析ページ 医療システム確認結果**
   - `mcp-shared/docs/organization-analytics_医療システム確認結果_20251010.md`
   - 同様の分析プロセスの参考事例

---

## ✅ チェックリスト

### 医療システムチーム（本チーム）

#### 分析・確認
- [x] ✅ VoiceDrive暫定マスターリストの受領・確認
- [x] ✅ Committee Submission Approval機能の理解
- [x] ✅ 既存API/Webhookの十分性確認
- [x] ✅ 新規API・Webhook不要の結論
- [x] ✅ 本確認結果報告書の作成

#### 実装・テスト
- [ ] ❌ **新規実装なし**（既存API/Webhookのみ使用）
- [ ] 🟢 統合テスト参加（VoiceDrive Phase 1完了後）
- [ ] 🟢 既存API動作確認（Level 7+/Level 8+権限レベル）

#### ドキュメント
- [x] ✅ 医療システム確認結果報告書作成
- [ ] 🟢 VoiceDriveチームへの送付
- [ ] 🟢 マスタープラン更新確認（必要に応じて）

### VoiceDriveチーム

#### Phase 1: DB永続化
- [ ] ⏳ CommitteeSubmissionRequestテーブル追加
- [ ] ⏳ ProposalDocumentテーブル追加
- [ ] ⏳ ProposalAuditLogテーブル追加
- [ ] ⏳ CommitteeSubmissionServiceリファクタリング
- [ ] ⏳ ProposalDocumentGeneratorリファクタリング

#### Phase 2: 監査ログ
- [ ] ⏳ ProposalAuditLog記録処理実装
- [ ] ⏳ 監査ログ表示UI実装

#### Phase 3: 正規化
- [ ] ⏳ CommitteeInfoテーブル拡張
- [ ] ⏳ targetCommittee正規化

#### テスト
- [ ] ⏳ 単体テスト実装
- [ ] ⏳ 統合テスト実施（医療システムと協力）
- [ ] ⏳ E2Eテスト実施

---

## 🎯 次のアクション

### 医療システムチーム（即座）

1. [x] ✅ 本確認結果報告書のレビュー
2. [ ] 🟢 VoiceDriveチームへの送付（MCPサーバー経由）
3. [ ] 🟢 マスタープラン更新の要否確認

### VoiceDriveチーム（実装開始前）

1. [ ] ⏳ 本確認結果報告書のレビュー
2. [ ] ⏳ 実装計画の最終確認
3. [ ] ⏳ DB設計の最終承認

### 統合テスト（VoiceDrive Phase 1完了後）

1. [ ] 🟢 医療システムAPI動作確認
   - `GET /api/v2/employees/{employeeId}` の正常動作
   - Level 7+/Level 8+の正確な権限レベル返却
2. [ ] 🟢 Webhook動作確認
   - `POST /api/webhooks/employee-updated` の正常発火
   - VoiceDrive側キャッシュ更新の確認

---

## 📞 問い合わせ先

**医療システムチーム**:
- Slack: `#medical-system-team`
- Email: medical-system@example.com
- 担当: 医療システムチームリーダー

**VoiceDriveチーム**:
- Slack: `#voicedrive-team`
- Email: voicedrive@example.com
- 担当: VoiceDriveチームリーダー

---

## 📊 データサイズ見積もり（参考: VoiceDrive側）

以下はVoiceDrive側のDBデータサイズ見積もりです。

**CommitteeSubmissionRequest**:
- 想定レコード数: 月50件 × 12ヶ月 = 600件/年
- 1レコードサイズ: 約500 bytes
- 年間データ量: 600 × 500 bytes = 300 KB/年

**ProposalDocument**:
- 想定レコード数: 月50件 × 12ヶ月 = 600件/年
- 1レコードサイズ: 約5 KB（JSON含む）
- 年間データ量: 600 × 5 KB = 3 MB/年

**ProposalAuditLog**:
- 想定レコード数: 1提案あたり平均10操作 × 600件 = 6,000件/年
- 1レコードサイズ: 約300 bytes
- 年間データ量: 6,000 × 300 bytes = 1.8 MB/年

**合計**: 約5 MB/年（非常に軽量、医療システムDBへの影響なし）

---

**文書終了**

**作成者**: ClaudeCode（医療システムチーム）
**作成日**: 2025年10月21日
**バージョン**: 1.0
**承認**: 未承認（VoiceDriveチームレビュー待ち）
**次回レビュー**: VoiceDriveチームからのフィードバック受領後

---

## 🔄 更新履歴

| 日付 | 内容 | 担当 |
|------|------|------|
| 2025-10-21 | 初版作成 - 医療システム側の確認結果まとめ | ClaudeCode |
