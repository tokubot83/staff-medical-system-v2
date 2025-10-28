# admin/audit-logs 医療システム確認結果報告書

**文書番号**: MED-CONF-2025-1027-008
**作成日**: 2025年10月27日
**作成者**: ClaudeCode（医療システムチーム）
**宛先**: VoiceDriveチーム
**件名**: admin/audit-logs（監査ログページ）データ要件の医療システム側確認結果
**参照書類**:
- admin/audit-logs 暫定マスターリスト（ML-2025-1027-006）
- admin/audit-logs DB要件分析（DB-REQ-2025-1027-005）
- organization-analytics_医療システム確認結果_20251010.md（参考文書）

---

## 📋 エグゼクティブサマリー

VoiceDriveチームからの「admin/audit-logs 暫定マスターリスト」に対する医療システム側の確認結果です。

### 最重要結論

✅ **admin/audit-logsは医療システム側の実装が不要で、VoiceDrive側の単独実装で完結します。**

### 確認結果サマリー

| カテゴリ | VoiceDrive | 医療システム | 状態 |
|---------|-----------|------------|------|
| **データベーステーブル** | 3件（実装必要） | 1件（既存） | ✅ VoiceDrive完結 |
| **追加フィールド** | 3件（実装必要） | 0件（不要） | ✅ VoiceDrive完結 |
| **新規テーブル** | 2件（推奨） | 0件（不要） | ✅ VoiceDrive完結 |
| **APIエンドポイント** | 数件（実装必要） | 0件（不要） | ✅ VoiceDrive完結 |
| **セキュリティ機能** | 実装必要 | 独立実装 | ✅ 各システム独立 |

### データ管理責任分界点

```
【監査ログデータ】
VoiceDrive 100% 管理
├─ VoiceDrive内の操作ログ（AuditLog）
├─ 監査アラート（AuditAlert）
├─ 日次集計レポート（AuditReportSummary）
└─ セキュリティアラート・改ざん検知

医療システム 100% 管理
└─ 医療システム内の操作ログ（AuditLog）
   ├─ 医療システムDB変更履歴
   ├─ 職員データ変更履歴
   └─ 評価データ変更履歴
```

### 推定実装工数

| 作業内容 | 担当 | 工数 | 状態 |
|---------|------|------|------|
| **VoiceDrive: Phase 1** | バックエンド | 2-3日 | ⏳ 未実装 |
| **VoiceDrive: Phase 2** | バックエンド | 3-4日 | ⏳ 未実装 |
| **VoiceDrive: Phase 3** | バックエンド | 2-3日 | ⏳ 未実装 |
| **VoiceDrive: テスト** | QA | 3日 | ⏳ 未実装 |
| **医療システム** | - | **0日** | **✅ 対応不要** |
| **合計（VoiceDrive）** | - | **10-13日（約2週間）** | - |

---

## 🎯 確認結論

### 医療システム側の実装要否

| 項目 | 必要性 | 理由 | 優先度 |
|------|--------|------|-------|
| **データベーステーブル追加** | ❌ **不要** | 監査ログはシステムごとに独立管理 | - |
| **既存テーブル拡張** | ❌ **不要** | 医療システムの監査ログは既存実装で十分 | - |
| **APIエンドポイント実装** | ❌ **不要** | VoiceDrive内で完結 | - |
| **セキュリティ機能実装** | 🟡 **推奨（独立）** | 医療システム独自の改ざん検知機能 | 🟡 中 |

### VoiceDrive側の実装範囲

| 項目 | 状態 | 備考 |
|------|------|------|
| **AuditLogテーブル既存** | ✅ 実装済み | 基本フィールド完備 |
| **severity追加** | 🔴 未実装 | 重要度分類（low/medium/high/critical） |
| **checksum追加** | 🔴 未実装 | 改ざん検知用SHA-256ハッシュ |
| **previousChecksum追加** | 🔴 未実装 | ブロックチェーン方式検証 |
| **AuditAlertテーブル** | 🟡 推奨追加 | 監査アラート管理 |
| **AuditReportSummaryテーブル** | 🟡 推奨追加 | 日次集計レポート |
| **UI実装** | 🟢 実装済み | AuditLogPage, AuditLogPanel |

---

## 🗄️ データベース要件確認

### 医療システム側のDB状況

#### 既存テーブル: AuditLog

**ファイル**: `c:\projects\staff-medical-system\prisma\schema.prisma` (Line 297-312)

```prisma
model AuditLog {
  id          String   @id @default(cuid())
  tableName   String
  recordId    String
  action      String   // create, update, delete
  userId      String
  changes     Json     // 変更内容のJSON
  ipAddress   String?
  userAgent   String?
  createdAt   DateTime @default(now())

  @@index([tableName, recordId])
  @@index([userId])
  @@map("audit_logs")
}
```

**評価**: ✅ **医療システム側は基本的な監査ログ機能を実装済み**

**医療システムのAuditLog用途**:
1. 医療システムDB内のデータ変更履歴
2. 職員マスタ（Employee）の変更追跡
3. 評価データ（Evaluation）の変更追跡
4. 面談データ（Interview）の変更追跡

**VoiceDriveのAuditLogとの違い**:

| 項目 | 医療システム | VoiceDrive | 比較 |
|------|-------------|-----------|------|
| **用途** | DBデータ変更履歴 | ユーザー操作ログ | 異なる目的 |
| **フィールド** | tableName, recordId, changes | entityType, entityId, oldValues/newValues | 類似 |
| **重要度分類** | なし | severity（追加必要） | VoiceDrive拡張 |
| **改ざん検知** | なし | checksum（追加推奨） | VoiceDrive拡張 |
| **セキュリティアラート** | なし | AuditAlert（推奨） | VoiceDrive独自 |

**結論**: **医療システムとVoiceDriveの監査ログは目的が異なり、独立して管理すべき**

---

### VoiceDrive側のDB要件（参考）

#### 1. 既存テーブル拡張: AuditLog

**追加フィールド**（3件）:
```prisma
model AuditLog {
  // 既存フィールド...

  // 🆕 Phase 1: 重要度分類
  severity          String?  @default("medium")  // low/medium/high/critical

  // 🆕 Phase 2: 改ざん検知
  checksum          String?                     // SHA-256ハッシュ
  previousChecksum  String?  @map("previous_checksum")  // チェーン検証用

  @@index([severity])
  @@index([createdAt])
}
```

**重要度自動判定ロジック**:
```typescript
function calculateSeverity(action: string, isEmergencyAction: boolean, executorLevel: number): string {
  if (isEmergencyAction) return 'critical';

  if (executorLevel >= 20) {
    if (action.includes('SYSTEM_MODE') || action.includes('PERMISSION_LEVEL')) {
      return 'critical';
    }
    return 'high';
  }

  if (action.includes('EMERGENCY') || action.includes('OVERRIDE')) {
    return 'high';
  }
  if (action.includes('DELETE') || action.includes('SUSPEND')) {
    return 'medium';
  }
  return 'low';
}
```

---

#### 2. 新規テーブル: AuditAlert（推奨）

**用途**: 監査アラート管理

```prisma
model AuditAlert {
  id                   String    @id @default(cuid())
  type                 String    // suspicious_activity, policy_violation, access_anomaly, data_tampering
  severity             String    // low, medium, high, critical
  description          String    @db.Text
  relatedLogs          Json      // 関連ログIDの配列
  detectedAt           DateTime  @default(now())
  investigationStatus  String    @default("pending")  // pending, investigating, resolved, escalated
  assignedTo           String?
  investigatedBy       String?
  investigatedAt       DateTime?
  resolution           String?   @db.Text
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt

  assignee             User?     @relation("AlertAssignee", fields: [assignedTo], references: [id])
  investigator         User?     @relation("AlertInvestigator", fields: [investigatedBy], references: [id])

  @@index([type])
  @@index([severity])
  @@index([investigationStatus])
  @@index([detectedAt])
  @@map("audit_alerts")
}
```

**自動アラート生成例**:
- 短時間での大量操作検知（5分間に10回以上）
- 深夜アクセス検知（22時〜6時）
- 高権限操作の異常検知（SYSTEM_MODE変更等）

---

#### 3. 新規テーブル: AuditReportSummary（推奨）

**用途**: 日次集計レポート（パフォーマンス最適化）

```prisma
model AuditReportSummary {
  id                 String    @id @default(cuid())
  reportDate         DateTime  @unique

  // 集計データ
  totalActions       Int       @default(0)
  totalUsers         Int       @default(0)
  criticalActions    Int       @default(0)
  highActions        Int       @default(0)
  mediumActions      Int       @default(0)
  lowActions         Int       @default(0)

  // アクションタイプ別
  actionTypeCounts   Json      // { "USER_LOGIN": 150, "POST_CREATE": 45, ... }

  // トップアクター（上位10名）
  topActors          Json      // [{ userId: "...", count: 45 }, ...]

  // アラート統計
  totalAlerts        Int       @default(0)
  pendingAlerts      Int       @default(0)
  resolvedAlerts     Int       @default(0)

  // 完全性チェック
  integrityIssues    Int       @default(0)

  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt

  @@index([reportDate])
  @@map("audit_report_summaries")
}
```

---

## 🔌 API要件確認

### 医療システム側のAPI

**必要なAPI**: ❌ **0件（不要）**

**理由**: admin/audit-logsはVoiceDrive内の操作ログを表示するページであり、医療システムのログは無関係

---

### VoiceDrive側のAPI実装要件（参考）

以下のAPIはVoiceDrive側で実装が必要です（医療システム不要）：

| # | メソッド | エンドポイント | 用途 | 工数 |
|---|---------|---------------|------|------|
| 1 | GET | `/api/audit-logs` | ログ一覧取得（フィルタ付き） | 1日 |
| 2 | GET | `/api/audit-logs/statistics` | 統計カード用データ取得 | 0.5日 |
| 3 | GET | `/api/audit-logs/export` | CSVエクスポート | 0.5日 |
| 4 | GET | `/api/audit-alerts` | アラート一覧取得 | 0.5日 |
| 5 | POST | `/api/audit-alerts/:id/investigate` | アラート調査開始 | 0.5日 |
| 6 | POST | `/api/audit-alerts/:id/resolve` | アラート解決 | 0.5日 |
| 7 | GET | `/api/audit-reports/daily` | 日次レポート取得 | 0.5日 |

**合計工数（VoiceDrive）**: 4日

---

## 📊 データ管理責任分界点

### 基本原則

**admin/audit-logsは「VoiceDrive完全管轄」のページです。**

医療システムとVoiceDriveは、それぞれ独立した監査ログシステムを持ちます。

### データ所有者マトリックス

| データ項目 | 所有者 | 理由 | 医療システム対応 |
|----------|-------|------|---------------|
| **VoiceDrive操作ログ** | VoiceDrive | VoiceDrive内のユーザー操作 | 不要 |
| **VoiceDrive監査アラート** | VoiceDrive | VoiceDrive内のセキュリティ監視 | 不要 |
| **VoiceDrive日次レポート** | VoiceDrive | VoiceDrive内の集計データ | 不要 |
| **医療システム操作ログ** | 医療システム | 医療システムDB変更履歴 | 既存実装継続 |

---

### システム間の監査ログ連携

**連携方針**: ❌ **連携不要**

**理由**:
1. **目的が異なる**:
   - 医療システム: DBデータ変更履歴（バックエンド監査）
   - VoiceDrive: ユーザー操作ログ（フロントエンド監査）

2. **セキュリティ上の分離**:
   - 各システムの監査ログは独立して管理すべき
   - システム間でログを共有すると、改ざんリスクが増大

3. **技術的な独立性**:
   - 各システムの監査ログ実装は異なる
   - フィールド構造、重要度分類、アラート機能が異なる

**参考: 他システムとの比較**

| システム | 監査ログの用途 | 連携の有無 | 理由 |
|---------|-------------|----------|------|
| **WhistleblowingPage** | VoiceDrive内の通報ログ | 連携不要 | VoiceDrive完結 |
| **PersonalStation** | VoiceDrive内のユーザー操作 | 連携不要 | VoiceDrive完結 |
| **admin/audit-logs** | VoiceDrive内の管理操作 | **連携不要** | **各システム独立** |

---

## 🔧 医療システム側の対応要否

### 必須対応（0件）

**なし**

---

### 推奨対応（1件）- 独立実装

#### セキュリティ機能強化（医療システム独自）

**実装内容**:
- 医療システムAuditLogに改ざん検知機能追加
- チェックサム生成（SHA-256）
- ブロックチェーン方式の完全性検証

**優先度**: 🟡 **中**（VoiceDriveとは無関係、医療システム独自の判断）

**工数**: 2-3日

**実装時期**: Phase 2以降（医療システム側の優先順位による）

**実装例**:
```prisma
// 医療システムの schema.prisma
model AuditLog {
  id          String   @id @default(cuid())
  tableName   String
  recordId    String
  action      String
  userId      String
  changes     Json
  ipAddress   String?
  userAgent   String?

  // 🆕 医療システム独自追加
  checksum          String?
  previousChecksum  String?

  createdAt   DateTime @default(now())

  @@index([tableName, recordId])
  @@index([userId])
  @@map("audit_logs")
}
```

---

## 📅 実装スケジュール（VoiceDrive側参考）

### 全体工数: 10-13日（約2週間）

| Phase | 内容 | 担当 | 工数 | 状態 |
|-------|------|------|------|------|
| Phase 1 | 基本機能完全化 | VoiceDrive | 2-3日 | ⏳ 未実装 |
| Phase 2 | セキュリティ機能強化 | VoiceDrive | 3-4日 | ⏳ 未実装 |
| Phase 3 | パフォーマンス最適化 | VoiceDrive | 2-3日 | ⏳ 未実装 |
| Phase 4 | テスト | VoiceDrive | 3日 | ⏳ 未実装 |

**医療システム側の工数**: **0日**（独立実装を含めても2-3日）

---

### Phase 1: 基本機能完全化（2-3日）

**VoiceDrive側作業**:
1. AuditLogテーブルに`severity`フィールド追加
2. 重要度自動判定ロジック実装
3. 既存ログの重要度バックフィル
4. AuditLogPageのフィルタ機能動作確認
5. CSVエクスポート機能テスト

**完了後に動作する機能**:
- ✅ 統計カード（総ログ数、重大イベント数、高重要度数、アクティブユーザー）
- ✅ 重要度フィルター（低/中/高/重大）
- ✅ アクションタイプフィルター
- ✅ 日付範囲フィルター
- ✅ Level 99操作フィルター
- ✅ CSVエクスポート

---

### Phase 2: セキュリティ機能強化（3-4日）

**VoiceDrive側作業**:
1. AuditLogに`checksum`, `previousChecksum`追加
2. チェックサム生成機能実装（SHA-256）
3. 完全性検証機能実装
4. AuditAlertテーブル追加
5. 不審なアクティビティ検知機能実装
6. AuditServiceのメモリ管理をDB連携に変更

**完了後に動作する機能**:
- ✅ ログ改ざん検知（チェックサムベース）
- ✅ ブロックチェーン方式の完全性検証
- ✅ 自動アラート生成
- ✅ アラート管理画面
- ✅ セキュリティチームへの通知

---

### Phase 3: パフォーマンス最適化（2-3日）

**VoiceDrive側作業**:
1. AuditReportSummaryテーブル追加
2. 日次集計バッチ実装
3. cron設定（毎日午前2時実行）
4. AuditLogPanelを最適化（集計テーブル利用）
5. ページネーション機能追加
6. パフォーマンステスト（100万ログ）

**完了後の改善**:
- ✅ 30日間レポートが高速表示
- ✅ 大量ログでもスムーズなスクロール
- ✅ フィルタリング結果の高速表示

---

## ✅ VoiceDriveチームへの回答まとめ

### 確認-1: 医療システム側のDB実装要否

**回答**: ❌ **不要**

**理由**:
- 監査ログはシステムごとに独立管理すべき
- 医療システムには独自のAuditLogテーブルが存在（既存実装）
- VoiceDriveのadmin/audit-logsはVoiceDrive内の操作ログを管理
- システム間でログを共有するセキュリティリスクあり

---

### 確認-2: 医療システム側のAPI実装要否

**回答**: ❌ **不要**

**理由**:
- admin/audit-logsページはVoiceDrive内で完結
- 医療システムのログは無関係
- 各システムの監査ログは独立して管理

---

### 確認-3: セキュリティ機能の連携要否

**回答**: ❌ **不要**（各システム独立実装）

**理由**:
- VoiceDrive: チェックサム、アラート、日次集計をVoiceDrive内で実装
- 医療システム: 独自の改ざん検知機能を医療システム内で実装（任意）
- システム間でセキュリティ機能を共有する必要なし

---

## 📞 次のステップ

### 医療システムチームの対応

1. **本報告書のレビュー** - VoiceDriveチームに送付（即座）
2. **既存AuditLog継続運用** - 医療システム内のDB変更履歴を継続記録
3. **独自セキュリティ強化（任意）** - 医療システムの判断で改ざん検知機能追加

---

### VoiceDriveチームへの確認事項

1. **Phase 1-3の実施予定** - 実装スケジュールを共有
2. **セキュリティ機能の優先度** - チェックサム、アラート機能の実装優先度確認
3. **医療システム側の独立実装** - 医療システムが独自にセキュリティ強化する場合、情報共有

---

## 🔗 関連ドキュメント

1. [admin/audit-logs暫定マスターリスト_20251027.md](./admin_audit-logs暫定マスターリスト_20251027.md) - VoiceDriveからの要件定義
2. [admin/audit-logs_DB要件分析_20251027.md](./admin_audit-logs_DB要件分析_20251027.md) - VoiceDrive側のDB分析
3. [organization-analytics_医療システム確認結果_20251010.md](./organization-analytics_医療システム確認結果_20251010.md) - 参考文書（独立実装パターン）
4. [prisma/schema.prisma](../../prisma/schema.prisma) - 医療システムDBスキーマ（Line 297-312: AuditLog）

---

## 📊 まとめ

### admin/audit-logsの特徴

1. **完全にVoiceDrive管轄**: 監査ログ・アラート・レポート全てVoiceDrive内
2. **医療システム連携不要**: 各システムの監査ログは独立管理
3. **セキュリティ独立実装**: 改ざん検知機能は各システムで独自実装
4. **既存実装活用**: 医療システムは既存のAuditLogテーブルを継続運用

### 6ページの比較サマリー

| 要素 | NotFoundPage | UnauthorizedPage | PersonalStation | MyRequestsPage | WhistleblowingPage | **admin/audit-logs** |
|-----|-------------|-----------------|----------------|----------------|-------------------|-------------------|
| **新規テーブル（医療）** | 0件 | 0件 | 1件 | **3件** | **0件** | **0件** |
| **新規API（医療）** | 0件 | 1件 | 2件 | **3件** | **0件** | **0件** |
| **Webhook（医療）** | 0件 | 0件 | 0件 | **2件** | **0件（オプション）** | **0件** |
| **医療システム工数** | 0日 | 3週間 | 4-6週間 | **4.5週間** | **0日** | **0日** |
| **データ管理責任** | - | 医療 | VD 70% + 医療 30% | 医療 100% | **VD 100%** | **VD 100%** |
| **システム間連携** | - | 認証 | 一部必要 | 完全連携 | **不要** | **不要** |

### 最終結論

**admin/audit-logsは医療システム側の実装が不要で、VoiceDrive側の単独実装で完結します。**

監査ログはシステムごとに独立して管理すべきセキュリティ機能であり、システム間でログを共有することはセキュリティリスクを増大させます。医療システムは既存のAuditLogテーブルを継続運用し、VoiceDriveはVoiceDrive内の監査ログシステムを実装します。

**医療システム実装工数: 0日**（独立実装を含めても2-3日、VoiceDriveとは無関係）

---

**文書終了**

最終更新: 2025年10月27日
バージョン: 1.0
承認: 未承認（VoiceDriveチームレビュー待ち）
次回レビュー: VoiceDriveチームからのフィードバック受領後
