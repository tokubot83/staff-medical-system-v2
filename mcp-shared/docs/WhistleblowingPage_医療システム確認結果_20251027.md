# WhistleblowingPage 医療システム確認結果報告書

**文書番号**: MED-CONF-2025-1027-007
**作成日**: 2025年10月27日
**作成者**: ClaudeCode（医療システムチーム）
**宛先**: VoiceDriveチーム
**件名**: WhistleblowingPage（内部通報窓口）データ要件の医療システム側確認結果
**参照書類**:
- WhistleblowingPage 暫定マスターリスト（ML-2025-1027-005）
- WhistleblowingPage DB要件分析（DB-REQ-2025-1027-004）
- organization-analytics_医療システム確認結果_20251010.md（参考文書）

---

## 📋 エグゼクティブサマリー

VoiceDriveチームからの「WhistleblowingPage 暫定マスターリスト」に対する医療システム側の確認結果です。

### 最重要結論

✅ **WhistleblowingPageは医療システム側の実装が不要で、VoiceDrive側の単独実装で完結します。**

### 確認結果サマリー

| カテゴリ | VoiceDrive | 医療システム | 状態 |
|---------|-----------|------------|------|
| **データベーステーブル** | 2件（実装済み） | 0件（不要） | ✅ VoiceDrive完結 |
| **APIエンドポイント** | 7件（実装必要） | 0件（不要） | ✅ VoiceDrive完結 |
| **Webhook通知** | 3件（実装必要） | 0件（連携オプション） | 🟡 部分連携可能 |
| **権限情報** | キャッシュ利用 | 既存API提供 | ✅ 既存連携継続 |

### データ管理責任分界点

```
【内部通報データ】
VoiceDrive 100% 管理
├─ 通報データ（WhistleblowingReport）
├─ 調査ノート（InvestigationNote）
├─ 統計データ（集計）
└─ アクセス監査ログ（推奨）

【職員権限情報】
医療システム 100% 管理
└─ ユーザー権限レベル（既存 Employee.permissionLevel）
   → VoiceDrive側でキャッシュして利用（既存実装継続）
```

### 推定実装工数

| 作業内容 | 担当 | 工数 | 状態 |
|---------|------|------|------|
| **VoiceDrive: DB拡張** | バックエンド | 0.5日 | ⏳ 未実装（推奨） |
| **VoiceDrive: API実装** | バックエンド | 5日 | ⏳ 未実装 |
| **VoiceDrive: セキュリティ強化** | バックエンド | 3日 | ⏳ 未実装 |
| **VoiceDrive: UI改修** | フロントエンド | 5日 | 🟢 デモモード実装済み |
| **VoiceDrive: テスト** | QA | 7日 | ⏳ 未実装 |
| **医療システム: Webhook受信** | バックエンド | 2日 | 🟡 オプション（重大案件のみ） |
| **合計（VoiceDrive）** | - | **20.5日（約4週間）** | - |
| **合計（医療システム）** | - | **0日（連携不要）** | - |

---

## 🎯 確認結論

### 医療システム側の実装要否

| 項目 | 必要性 | 理由 | 優先度 |
|------|--------|------|-------|
| **データベーステーブル追加** | ❌ **不要** | 内部通報データはVoiceDrive管轄 | - |
| **APIエンドポイント実装** | ❌ **不要** | VoiceDrive内で完結 | - |
| **Webhook受信実装** | 🟡 **オプション** | 重大案件の人事・法務部門への通知に使用可能 | 🟢 低 |
| **既存API継続提供** | ✅ **必要** | 職員権限情報（既存実装継続） | 🔴 最高 |

### VoiceDrive側の実装範囲

| 項目 | 状態 | 備考 |
|------|------|------|
| **WhistleblowingReportテーブル** | ✅ 実装済み | schema.prismaに存在（VoiceDrive側） |
| **InvestigationNoteテーブル** | ✅ 実装済み | schema.prismaに存在（VoiceDrive側） |
| **WhistleblowingAccessLog** | 🟡 推奨追加 | 監査証跡のため |
| **evidenceDescriptionフィールド** | 🟡 推奨追加 | 既存フォームで使用中 |
| **7つのAPIエンドポイント** | ⏳ 未実装 | VoiceDrive側実装必要 |
| **Webhook通知** | 🟡 オプション | 医療システム連携は任意 |

---

## 🗄️ データベース要件確認

### 医療システム側のDB状況

#### 確認結果

**医療システム（c:\projects\staff-medical-system\prisma\schema.prisma）には、内部通報関連のテーブルが存在しません。**

```bash
# 検索実行結果
Pattern: "model.*Whistleblowing|whistleblowing"
Result: No matches found
```

**評価**: ✅ **医療システム側は内部通報データを管理しない設計であることを確認**

---

### VoiceDrive側のDB状況（参考）

VoiceDriveの暫定マスターリストによると、以下のテーブルが実装済みです：

#### 1. WhistleblowingReport（通報データ）

**状態**: ✅ 実装済み（VoiceDrive schema.prisma 2921-2965行目）

**主要フィールド**:
- `id`, `userId`, `anonymousId` - 識別情報
- `category`, `severity`, `title`, `content` - 通報内容
- `evidenceFiles` - 証拠ファイルURL配列
- `status`, `priority` - 案件管理
- `medicalSystemCaseNumber` - 医療システム連携用（オプション）
- `acknowledgementReceived` - 受付確認フラグ
- `contactMethod`, `contactInfo` - 連絡先（暗号化推奨）

**推奨追加**: `evidenceDescription`フィールド（1件）

**理由**: VoiceDriveのWhistleblowingReportFormで入力項目として存在するが、DB保存先がない

---

#### 2. InvestigationNote（調査ノート）

**状態**: ✅ 実装済み（VoiceDrive schema.prisma 2969-2986行目）

**主要フィールド**:
- `id`, `reportId` - 識別情報
- `authorRole`, `authorName` - 調査員情報
- `content` - ノート内容
- `isConfidential` - 機密フラグ
- `actionItems` - アクションアイテム配列

**評価**: ✅ 追加不要（完全実装済み）

---

#### 3. WhistleblowingAccessLog（監査ログ）- 推奨追加

**状態**: 🟡 VoiceDrive側で未実装（推奨）

**用途**: 機密情報へのアクセス監査

**推奨スキーマ**:
```prisma
model WhistleblowingAccessLog {
  id         String   @id @default(cuid())
  reportId   String
  userId     String
  action     String   // viewed, note_added, status_changed, escalated, resolved
  details    String?  // アクション詳細（JSON）
  accessedAt DateTime @default(now())
  ipAddress  String?
  userAgent  String?

  user   User                 @relation("WhistleblowingAccessUser", fields: [userId], references: [id])
  report WhistleblowingReport @relation("ReportAccessLogs", fields: [reportId], references: [id], onDelete: Cascade)

  @@index([reportId])
  @@index([userId])
  @@index([accessedAt])
  @@map("whistleblowing_access_logs")
}
```

**優先度**: 🟡 MEDIUM（セキュリティ強化のため推奨）

---

## 🔌 API要件確認

### 医療システム側のAPI提供状況

#### 既存API（継続提供）

**1. GET /api/v2/users/:id（職員情報取得）**

**用途**: VoiceDrive側での権限レベル確認

**レスポンス例**:
```json
{
  "id": "emp-001",
  "name": "山田 太郎",
  "permissionLevel": 4.0,
  "accountType": "MANAGER",
  "department": "人事部",
  "position": "人事課長"
}
```

**評価**: ✅ **既存実装継続（変更不要）**

---

### VoiceDrive側のAPI実装要件（参考）

以下のAPIはVoiceDrive側で実装が必要です（医療システム不要）：

| # | メソッド | エンドポイント | 権限 | 用途 | 工数 |
|---|---------|---------------|------|------|------|
| 1 | POST | `/api/whistleblowing/reports` | 全職員 | 通報提出 | 1日 |
| 2 | GET | `/api/whistleblowing/reports` | Level 3+ | 通報一覧取得 | 1日 |
| 3 | GET | `/api/whistleblowing/reports/:id` | Level 3+ | 通報詳細取得 | 0.5日 |
| 4 | GET | `/api/whistleblowing/statistics` | Level 3+ | 統計取得 | 1日 |
| 5 | POST | `/api/whistleblowing/reports/:id/notes` | Level 5+ | 調査ノート追加 | 0.5日 |
| 6 | PATCH | `/api/whistleblowing/reports/:id/status` | Level 4+ | ステータス更新 | 0.5日 |
| 7 | GET | `/api/whistleblowing/reports/by-anonymous/:id` | 通報者本人 | 匿名ID検索 | 0.5日 |

**合計工数（VoiceDrive）**: 5日

---

## 🔔 Webhook要件確認

### オプション連携: 医療システムへの重大案件通知

#### Webhook 1: 重大案件通知（VoiceDrive → 医療システム）

**トリガー**: severity = "critical"の通報提出時

**送信先**: `https://medical-system.example.com/api/webhooks/whistleblowing-critical`

**認証**: HMAC-SHA256署名

**ペイロード例**:
```json
{
  "eventType": "whistleblowing.critical_report",
  "timestamp": "2025-10-27T10:30:00Z",
  "data": {
    "reportId": "wb-2025-001",
    "anonymousId": "ANON-2025-A1B2C3",
    "category": "safety",
    "severity": "critical",
    "title": "医療安全に関する緊急案件",
    "content": "[機密情報のため省略]",
    "submittedAt": "2025-10-27T10:30:00Z",
    "requiresImmediateAction": true
  }
}
```

**医療システム側の処理（オプション）**:
1. 人事部・法務部門への緊急メール通知
2. ケース番号発行（MED-2025-XXXX）
3. 受付確認Webhook返信（任意）

**実装要否**: 🟡 **オプション**（重大案件のみ連携したい場合）

**工数**: 2日（医療システム側）

---

#### Webhook 2: 受付確認（医療システム → VoiceDrive）- オプション

**送信先**: `https://voicedrive-v100.vercel.app/api/webhooks/whistleblowing-acknowledged`

**ペイロード例**:
```json
{
  "eventType": "whistleblowing.acknowledged",
  "timestamp": "2025-10-27T10:35:00Z",
  "data": {
    "reportId": "wb-2025-001",
    "medicalSystemCaseNumber": "MED-2025-0001",
    "estimatedResponseTime": "1時間以内",
    "currentStatus": "人事部が緊急対応を開始しました"
  }
}
```

**実装要否**: 🟡 **オプション**（Webhook 1を実装する場合のみ）

---

#### Webhook 3: 進捗更新（医療システム → VoiceDrive）- オプション

**送信先**: `https://voicedrive-v100.vercel.app/api/webhooks/whistleblowing-progress-updated`

**ペイロード例**:
```json
{
  "eventType": "whistleblowing.progress_updated",
  "timestamp": "2025-10-30T15:00:00Z",
  "data": {
    "reportId": "wb-2025-001",
    "medicalSystemCaseNumber": "MED-2025-0001",
    "newStatus": "resolved",
    "resolutionSummary": "適切な是正措置を実施しました。",
    "followUpRequired": true
  }
}
```

**実装要否**: 🟡 **オプション**（医療システム側で進捗管理する場合のみ）

---

### Webhook実装の推奨度

| 連携パターン | 推奨度 | 理由 |
|-----------|-------|------|
| **パターン1: 連携なし** | ✅ **推奨** | VoiceDrive単独で完結、シンプル |
| **パターン2: 通知のみ** | 🟡 任意 | 重大案件の人事・法務部門への緊急通知 |
| **パターン3: 双方向連携** | 🟢 低優先度 | 医療システム側で案件管理する場合 |

**結論**: パターン1（連携なし）を推奨。必要に応じてパターン2（通知のみ）を将来実装。

---

## 📊 データ管理責任分界点

### 基本原則

**WhistleblowingPageは「VoiceDrive完全管轄」のページです。**

### データ所有者マトリックス

| データ項目 | 所有者 | 理由 | 医療システム対応 |
|----------|-------|------|---------------|
| **通報データ** | VoiceDrive | 内部通報窓口機能 | 不要 |
| **調査ノート** | VoiceDrive | 機密情報管理 | 不要 |
| **統計データ** | VoiceDrive | 集計値 | 不要 |
| **匿名ID** | VoiceDrive | 匿名性保護 | 不要 |
| **職員権限情報** | 医療システム | 人事マスタ | 既存API継続提供 |

---

### 参考: 他ページとの比較

| ページ | データ管理責任 | 医療システム対応 | 理由 |
|-------|-------------|---------------|------|
| **PersonalStation** | VoiceDrive 70% + 医療 30% | 一部必要 | 360度評価、組織サーベイ等の共有 |
| **MyRequestsPage** | 医療システム 100% | 完全実装必要 | キャリアコース管理は人事データ |
| **WhistleblowingPage** | VoiceDrive 100% | 不要 | 内部通報窓口は独立機能 |

---

## 🔧 医療システム側の対応要否

### 必須対応（0件）

**なし**

---

### オプション対応（1件）

#### Webhook受信実装（重大案件通知）

**実装内容**:
- POST /api/webhooks/whistleblowing-critical
- HMAC署名検証
- 人事部・法務部門への緊急メール通知
- ケース番号発行（任意）
- 受付確認Webhook返信（任意）

**優先度**: 🟡 **低**（VoiceDrive単独運用で十分）

**工数**: 2日

**実装時期**: Phase 2以降（VoiceDrive運用開始後、必要性を判断）

---

### 継続提供（1件）

#### GET /api/v2/users/:id（職員情報取得API）

**現在の実装**: ✅ 実装済み

**用途**: VoiceDrive側での権限レベル確認（Level 3+ で管理画面表示）

**対応**: ✅ **現状維持（変更不要）**

---

## 📅 実装スケジュール（VoiceDrive側参考）

### 全体工数: 20.5日（約4週間）

| Phase | 内容 | 担当 | 工数 | 状態 |
|-------|------|------|------|------|
| Phase 1 | スキーマ更新 | VoiceDrive | 0.5日 | ⏳ 未実装 |
| Phase 2 | 権限管理強化 | VoiceDrive | 3日 | ⏳ 未実装 |
| Phase 3 | API実装 | VoiceDrive | 5日 | ⏳ 未実装 |
| Phase 4 | Webhook実装（オプション） | VoiceDrive | 5日 | 🟡 スキップ可能 |
| Phase 5 | セキュリティ強化 | VoiceDrive | 3日 | ⏳ 未実装 |
| Phase 6 | UI改修 | VoiceDrive | 5日 | 🟢 デモモード実装済み |
| Phase 7 | テスト | VoiceDrive | 7日 | ⏳ 未実装 |

**医療システム側の工数**: **0日**（連携不要）

---

## ✅ VoiceDriveチームへの回答まとめ

### 確認-1: 医療システム側のDB実装要否

**回答**: ❌ **不要**

**理由**:
- 内部通報データはVoiceDrive管轄
- 医療システムには関連テーブルが存在しない（設計として正しい）
- VoiceDrive側のWhistleblowingReport + InvestigationNoteで完結

---

### 確認-2: 医療システム側のAPI実装要否

**回答**: ❌ **不要**（既存API継続提供のみ）

**既存API（継続提供）**:
- ✅ GET /api/v2/users/:id（職員権限情報取得）

**新規API**: なし

---

### 確認-3: 医療システム連携（Webhook）の要否

**回答**: 🟡 **オプション**（推奨: 連携なし）

**連携パターン**:
1. ✅ **推奨**: VoiceDrive単独運用（連携なし）
2. 🟡 **任意**: 重大案件のみ通知（Webhook 1のみ実装）
3. 🟢 **低優先度**: 双方向連携（Webhook 1-3実装）

**推奨理由**:
- 内部通報窓口はVoiceDrive内で完結するのが自然
- 医療システム側で案件管理するメリットが少ない
- 必要に応じて将来追加可能

---

## 📞 次のステップ

### 医療システムチームの対応

1. **本報告書のレビュー** - VoiceDriveチームに送付（即座）
2. **既存API継続提供の確認** - GET /api/v2/users/:id（現状維持）
3. **Webhook連携の要否確認** - VoiceDriveチームと協議（任意）

---

### VoiceDriveチームへの確認事項

1. **Webhook連携の必要性** - パターン1（連携なし）でOKか確認
2. **権限レベルの範囲** - Level 3-5の定義確認（既存で十分か）
3. **実装スケジュール** - Phase 1-7の実施予定を共有

---

## 🔗 関連ドキュメント

1. [WhistleblowingPage暫定マスターリスト_20251027.md](./WhistleblowingPage暫定マスターリスト_20251027.md) - VoiceDriveからの要件定義
2. [WhistleblowingPage_DB要件分析_20251027.md](./WhistleblowingPage_DB要件分析_20251027.md) - VoiceDrive側のDB分析
3. [organization-analytics_医療システム確認結果_20251010.md](./organization-analytics_医療システム確認結果_20251010.md) - 参考文書（API実装パターン）
4. [prisma/schema.prisma](../../prisma/schema.prisma) - 医療システムDBスキーマ

---

## 📊 まとめ

### WhistleblowingPageの特徴

1. **完全にVoiceDrive管轄**: 内部通報窓口機能として独立
2. **医療システム連携不要**: 既存の職員権限API継続提供のみ
3. **Webhook連携はオプション**: 必要性に応じて将来実装可能
4. **スキーマ完成度**: VoiceDrive側で95%完成（一部追加推奨）

### 5ページの比較サマリー

| 要素 | NotFoundPage | UnauthorizedPage | PersonalStation | MyRequestsPage | WhistleblowingPage |
|-----|-------------|-----------------|----------------|----------------|-------------------|
| **新規テーブル（医療）** | 0件 | 0件 | 1件 | **3件** | **0件** |
| **新規API（医療）** | 0件 | 1件 | 2件 | **3件** | **0件** |
| **Webhook（医療）** | 0件 | 0件 | 0件 | **2件** | **0件（オプション）** |
| **医療システム工数** | 0日 | 3週間 | 4-6週間 | **4.5週間** | **0日** |
| **データ管理責任** | - | 医療 | VD 70% + 医療 30% | 医療 100% | **VD 100%** |

### 最終結論

**WhistleblowingPageは医療システム側の実装が不要で、VoiceDrive側の単独実装で完結します。**

内部通報窓口は職員の心理的安全性を確保する重要な機能であり、VoiceDrive内で完結する設計が適切です。医療システム側は既存の職員権限API（GET /api/v2/users/:id）の継続提供のみで対応完了となります。

**医療システム実装工数: 0日**（オプション連携を含めても2日）

---

**文書終了**

最終更新: 2025年10月27日
バージョン: 1.0
承認: 未承認（VoiceDriveチームレビュー待ち）
次回レビュー: VoiceDriveチームからのフィードバック受領後
