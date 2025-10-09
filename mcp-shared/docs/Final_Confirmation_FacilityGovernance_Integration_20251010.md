# 施設ガバナンス統合実装 最終確認書

**文書番号**: FINAL-CONFIRMATION-FG-2025-1010-001
**作成日**: 2025年10月10日
**作成者**: 医療システムチーム
**宛先**: VoiceDriveチーム
**件名**: 施設ガバナンス統合実装に関する3つの確認事項への最終回答
**関連文書**:
- MED-RESPONSE-FG-2025-1010-001（施設ガバナンス統合実装回答書）
- FG-DB-REQ-2025-1009-001（施設ガバナンスページ DB要件分析）

---

## 📢 エグゼクティブサマリー

VoiceDriveチームから受領した施設ガバナンス統合実装回答書の確認要請に対し、医療システムチームとして最終回答を提示します。

### 最終決定事項

| 項目 | 決定内容 |
|------|---------|
| **確認-1** | ✅ **Phase 1.6統合実装に合意** |
| **確認-2** | ✅ **API-FG-1レスポンスフィールド5つで十分** |
| **確認-3** | ✅ **JSON形式で提供可能** |
| **総合判定** | 🟢 **全ての確認事項に合意** - Phase 16実装準備完了 |
| **次のステップ** | Phase 1.6実装時にPhase 15（委員会管理）+ Phase 16（施設ガバナンス）を統合実装 |

---

## ✅ 確認-1への回答: Phase 1.6統合実装方針の承認

### 質問（VoiceDriveチームより）

> 施設ガバナンスをPhase 1.6統合実装（MySQL移行と同時）で進めることに合意いただけますか？

### 回答: ✅ **合意 - Phase 1.6統合実装で進める**

**決定理由**:

1. **Phase 15（委員会管理）と同じ戦略を採用**
   - 委員会管理で既にMySQL統合実装を決定済み
   - 同じパターンを踏襲することで実装の一貫性を確保

2. **二度手間の完全回避**
   - SQLite構築 → MySQL移行の2段階作業を回避
   - Phase 1.6実装時に1回で完了（効率的）

3. **コスト削減の最大化**
   - 個別実装: 20日（¥6,400,000）
   - 統合実装: 11日（¥3,520,000）
   - **削減額: 9日、¥2,880,000（45%削減）**

4. **データ移行リスクの排除**
   - SQLite → MySQL移行時のデータ損失リスクがゼロ
   - 初回から本番環境（MySQL）で構築

### 実装スケジュール確認

| Phase | 内容 | タイミング | 担当 |
|-------|------|-----------|------|
| **Phase 0** | **schema.prisma準備** | **✅ 完了** | **VoiceDrive** |
| **Phase 1** | **MySQL移行＋統合DB構築** | **Phase 1.6実施時** | **医療チーム + VoiceDrive** |
| Phase 2 | API連携実装 | DB構築後（2日） | VoiceDrive + 医療チーム |
| Phase 3 | UI統合 | API連携後（1日） | VoiceDrive |

### テーブル構成確認

- **医療システム既存**: 146テーブル
- **Phase 15（委員会管理）**: 5テーブル（ManagementCommitteeAgenda、CommitteeInfo、CommitteeMember、CommitteeMeeting、CommitteeSubmissionRequest）
- **Phase 16（施設ガバナンス）**: 4テーブル（FacilityPolicy、ComplianceCheck、FacilityRisk、TransparencyReport）
- **統合後合計**: **155テーブル**

---

## ✅ 確認-2への回答: API-FG-1レスポンスフィールド

### 質問（VoiceDriveチームより）

> バッチAPI（API-FG-1）のレスポンスフィールドは以下の5フィールドで十分ですか？
>
> ```json
> {
>   "employeeId": "OH-NS-2024-001",
>   "name": "山田 花子",
>   "department": "看護部",
>   "position": "看護部長",
>   "permissionLevel": 10.0
> }
> ```

### 回答: ✅ **十分 - 5フィールドで問題なし**

**決定理由**:

1. **施設ガバナンスの必要情報を全てカバー**

   | フィールド | 用途 |
   |-----------|------|
| `employeeId` | 方針の管理責任者・承認者の一意識別 |
   | `name` | UIでの表示名（方針一覧、コンプライアンスチェック一覧） |
   | `department` | 部署フィルタリング、部署別ガバナンス表示 |
   | `position` | 役職表示、責任者の適切性確認 |
   | `permissionLevel` | Level 10+の権限確認、承認権限判定 |

2. **委員会管理（Phase 15）と同じフィールド構成**
   - API-CM-1（委員会管理バッチAPI）と統一
   - 同じAPIエンドポイント流用の可能性（将来的な統合）

3. **追加フィールドは不要**
   - `facilityId`: 施設ガバナンスは施設横断的な機能（全施設共通）
   - `hireDate`: 施設ガバナンスでは不要
   - `experienceYears`: 施設ガバナンスでは不要
   - `email`/`phone`: 連絡先情報は個人情報保護の観点から最小限に

### API実装仕様確認

**エンドポイント**: `POST /api/employees/batch`

**リクエスト例**:
```json
{
  "employeeIds": ["OH-NS-2024-001", "OH-DOC-2024-001", "OH-ADM-2024-001"]
}
```

**レスポンス例**:
```json
{
  "employees": [
    {
      "employeeId": "OH-NS-2024-001",
      "name": "山田 花子",
      "department": "看護部",
      "position": "看護部長",
      "permissionLevel": 10.0
    },
    {
      "employeeId": "OH-DOC-2024-001",
      "name": "佐藤 太郎",
      "department": "医局",
      "position": "医局長",
      "permissionLevel": 12.0
    },
    {
      "employeeId": "OH-ADM-2024-001",
      "name": "鈴木 一郎",
      "department": "事務部",
      "position": "事務長",
      "permissionLevel": 10.0
    }
  ]
}
```

**実装工数**: 3時間（¥120,000）
**実装タイミング**: Phase 1.6実装時

---

## ✅ 確認-3への回答: 初期データ提供形式

### 質問（VoiceDriveチームより）

> permissionLevel 10+職員リストをJSON形式で提供することに問題ありませんか？
>
> **提供形式例**:
> ```json
> {
>   "permissionLevel10Plus": [
>     { "employeeId": "OH-NS-2024-001", "name": "山田 花子", "position": "看護部長", "permissionLevel": 10.0 }
>   ]
> }
> ```

### 回答: ✅ **問題なし - JSON形式で提供可能**

**決定理由**:

1. **JSON形式が最も効率的**
   - VoiceDrive側でそのまま読み込み可能（パース不要）
   - 型安全性が高い（TypeScript型定義と整合）
   - 医療システム側での生成も容易（Prisma → JSON変換）

2. **委員会管理（Phase 15）と同じ形式**
   - Phase 15でも同様にJSON形式で職員リスト提供予定
   - データ形式の統一により、VoiceDrive側の処理を共通化可能

3. **データ量が適切**
   - permissionLevel 10+の職員: 約15-20名程度
   - JSONファイルサイズ: < 5KB（軽量）

### 提供データ形式（最終版）

**ファイル名**: `mcp-shared/data/permissionLevel10Plus-employees.json`

**データ構造**:
```json
{
  "generatedAt": "2025-10-10T10:00:00.000Z",
  "facilityId": "obara-hospital",
  "totalCount": 18,
  "permissionLevel10Plus": [
    {
      "employeeId": "OH-DR-2020-001",
      "name": "田中 一郎",
      "department": "院長室",
      "position": "院長",
      "permissionLevel": 25.0,
      "facilityId": "obara-hospital"
    },
    {
      "employeeId": "OH-DR-2020-002",
      "name": "佐藤 次郎",
      "department": "副院長室",
      "position": "副院長",
      "permissionLevel": 20.0,
      "facilityId": "obara-hospital"
    },
    {
      "employeeId": "OH-ADM-2020-001",
      "name": "鈴木 一郎",
      "department": "事務部",
      "position": "事務長",
      "permissionLevel": 20.0,
      "facilityId": "obara-hospital"
    },
    {
      "employeeId": "OH-NS-2020-005",
      "name": "高橋 花子",
      "department": "看護部",
      "position": "看護部長",
      "permissionLevel": 15.0,
      "facilityId": "obara-hospital"
    },
    {
      "employeeId": "OH-DR-2020-010",
      "name": "山田 太郎",
      "department": "医局",
      "position": "医局長",
      "permissionLevel": 15.0,
      "facilityId": "obara-hospital"
    },
    {
      "employeeId": "OH-NS-2021-020",
      "name": "伊藤 美咲",
      "department": "医療安全管理室",
      "position": "医療安全管理者",
      "permissionLevel": 12.0,
      "facilityId": "obara-hospital"
    },
    {
      "employeeId": "OH-NS-2021-030",
      "name": "渡辺 健",
      "department": "感染管理室",
      "position": "感染管理認定看護師",
      "permissionLevel": 10.0,
      "facilityId": "obara-hospital"
    },
    {
      "employeeId": "OH-ADM-2021-010",
      "name": "中村 良子",
      "department": "総務課",
      "position": "総務課長",
      "permissionLevel": 10.0,
      "facilityId": "obara-hospital"
    },
    {
      "employeeId": "OH-ADM-2021-020",
      "name": "小林 修",
      "department": "人事課",
      "position": "人事課長",
      "permissionLevel": 10.0,
      "facilityId": "obara-hospital"
    },
    {
      "employeeId": "OH-NS-2022-010",
      "name": "加藤 愛",
      "department": "内科病棟",
      "position": "病棟師長",
      "permissionLevel": 10.0,
      "facilityId": "obara-hospital"
    },
    {
      "employeeId": "OH-NS-2022-020",
      "name": "斉藤 優",
      "department": "外科病棟",
      "position": "病棟師長",
      "permissionLevel": 10.0,
      "facilityId": "obara-hospital"
    },
    {
      "employeeId": "OH-NS-2022-030",
      "name": "松本 翔",
      "department": "整形外科病棟",
      "position": "病棟師長",
      "permissionLevel": 10.0,
      "facilityId": "obara-hospital"
    },
    {
      "employeeId": "OH-NS-2022-040",
      "name": "井上 絵美",
      "department": "小児科病棟",
      "position": "病棟師長",
      "permissionLevel": 10.0,
      "facilityId": "obara-hospital"
    },
    {
      "employeeId": "OH-NS-2022-050",
      "name": "木村 大輔",
      "department": "救急科",
      "position": "救急外来師長",
      "permissionLevel": 10.0,
      "facilityId": "obara-hospital"
    },
    {
      "employeeId": "OH-MT-2020-010",
      "name": "林 健太",
      "department": "放射線科",
      "position": "放射線技師長",
      "permissionLevel": 10.0,
      "facilityId": "obara-hospital"
    },
    {
      "employeeId": "OH-MT-2020-020",
      "name": "清水 明子",
      "department": "検査科",
      "position": "臨床検査技師長",
      "permissionLevel": 10.0,
      "facilityId": "obara-hospital"
    },
    {
      "employeeId": "OH-PT-2020-010",
      "name": "山本 悟",
      "department": "リハビリテーション科",
      "position": "理学療法士長",
      "permissionLevel": 10.0,
      "facilityId": "obara-hospital"
    },
    {
      "employeeId": "OH-PH-2020-010",
      "name": "吉田 信一",
      "department": "薬剤部",
      "position": "薬剤部長",
      "permissionLevel": 12.0,
      "facilityId": "obara-hospital"
    }
  ]
}
```

### 提供タイミング

- **提供時期**: Phase 1.6実装開始時
- **提供方法**: `mcp-shared/data/` フォルダに配置
- **更新頻度**: 年1回（組織改編時）
- **更新方法**: 手動更新（組織改編発生時に医療システムチームから再提供）

---

## 📊 最終コスト・工数サマリー

### Phase 16（施設ガバナンス）コスト内訳

| 項目 | 担当 | 工数 | コスト |
|------|------|------|--------|
| **医療システム側** | | | |
| API-FG-1実装（バッチ職員情報） | 医療チーム | 3時間 | ¥120,000 |
| permissionLevel 10+職員リスト作成 | 医療チーム | 1時間 | ¥0（医療チーム作業） |
| API-2流用（PersonalStation） | - | 0時間 | ¥0 |
| API-8流用（DepartmentStation） | - | 0時間 | ¥0 |
| **医療システム合計** | | **4時間** | **¥120,000** |
| **VoiceDrive側** | | | |
| schema.prisma準備（4テーブル） | VoiceDrive | 6時間 | - |
| 初期データJSON作成 | VoiceDrive | 6時間 | - |
| API連携実装 | VoiceDrive | 2日 | - |
| UI統合 | VoiceDrive | 1日 | - |
| **総合計（医療システム側のみ）** | | **4時間** | **¥120,000** |

### コスト削減サマリー

| 比較項目 | 全て新規実装 | API再利用 | 削減額 |
|---------|-------------|-----------|--------|
| 単体職員情報API | ¥120,000 | ¥0 | **-¥120,000** |
| バッチ職員情報API | ¥120,000 | ¥120,000 | ¥0 |
| 部署マスタAPI | ¥120,000 | ¥0 | **-¥120,000** |
| **合計** | **¥360,000** | **¥120,000** | **-¥240,000（67%削減）** |

### 統合実装による追加削減

| 実装方式 | 工数 | コスト（¥320,000/日） | 削減額 |
|---------|------|---------------------|--------|
| 個別実装（Phase 16単独） | 7日 | ¥2,240,000 | - |
| 統合実装（Phase 1.6 + 15 + 16） | 3日 | ¥960,000 | **-¥1,280,000** |

**Phase 16単独での総削減額**: **¥240,000（67%）**
**Phase 1.6統合実装での追加削減**: **¥1,280,000**
**総削減額**: **¥1,520,000**

---

## 🏗️ Phase 1.6統合実装時の作業内容

### 医療システムチーム作業

| Day | 作業内容 | 工数 | 成果物 |
|-----|---------|------|--------|
| **Day 1** | schema.prisma統合（155テーブル） | 4時間 | schema.prisma（医療146 + 委員会5 + 施設ガバナンス4） |
| **Day 2** | Prisma Migration実行・検証 | 4時間 | マイグレーション完了 |
| **Day 3** | permissionLevel 10+職員リストJSON作成 | 1時間 | permissionLevel10Plus-employees.json |
| **Day 4** | API-FG-1実装 | 3時間 | POST /api/employees/batch |
| **Day 5** | 統合テスト（VoiceDriveと協働） | 3時間 | テスト完了 |

**医療システム総工数**: 15時間（約2日）
**医療システム総コスト**: ¥120,000（API-FG-1のみ）

---

### VoiceDriveチーム作業

| Day | 作業内容 | 工数 | 成果物 |
|-----|---------|------|--------|
| **Day 1** | schema.prisma最終確認 | 2時間 | 確認完了 |
| **Day 2** | Prisma Migration実行協力 | 2時間 | マイグレーション完了 |
| **Day 3** | 初期データJSON作成（委員会 + 施設ガバナンス） | 6時間 | 初期データJSON（委員会8件、方針8件、チェック5件、リスク5件） |
| **Day 4** | API連携実装（委員会） | 8時間 | API-CM-1統合 |
| **Day 5** | API連携実装（施設ガバナンス） | 8時間 | API-FG-1統合 |
| **Day 6** | UI統合・統合テスト（委員会） | 8時間 | CommitteeManagement動作確認 |
| **Day 7** | UI統合・統合テスト（施設ガバナンス） | 8時間 | FacilityGovernance動作確認 |

**VoiceDrive総工数**: 42時間（約7日）

---

## ✅ 成功基準（最終版）

### 機能要件

- [ ] **方針・規則タブ**: 8件の方針が表示され、管理責任者・承認者情報が正確に表示される
- [ ] **コンプライアンスタブ**: 5件のチェック項目が表示され、スコア計算が正常動作する
- [ ] **リスク管理タブ**: 5件のリスクが表示され、ステータス更新が正常動作する
- [ ] **透明性レポートタブ**: UI表示のみ（データ投入は将来実装）
- [ ] **統計サマリー**: 運用中の方針数、平均遵守率、管理中リスク数、課題数が正確に表示される
- [ ] **方針ダウンロード機能**: PDF/Word形式でダウンロード可能
- [ ] **リスクステータス更新**: identified → mitigating → resolvedの状態遷移が正常動作

### 非機能要件

- [ ] **ページ読み込み時間**: < 2秒（初回読み込み）
- [ ] **API応答時間**:
  - API-FG-1（バッチ取得、100件）: < 500ms
  - API-2（単体取得）: < 300ms
  - API-8（部署マスタ）: < 100ms
- [ ] **データ整合性**: 医療システムとVoiceDriveで職員情報が100%一致
- [ ] **エラーハンドリング**: API障害時にユーザーフレンドリーなエラーメッセージ表示

### データ管理

- [ ] **データ管理責任分界点**: データ管理責任分界点定義書に準拠
  - 医療システム: 職員情報（employeeId、name、department、position、permissionLevel）
  - VoiceDrive: 方針・規則データ、コンプライアンスチェックデータ、リスクデータ
- [ ] **職員情報キャッシュ**: 24時間キャッシュ戦略確立（VoiceDrive側）
- [ ] **部署マスタ同期**: 24時間キャッシュ + 深夜2時自動更新

---

## 📅 次のステップ

### ステップ1: Phase 1.6実装開始準備（医療システムチーム）

- [ ] Phase 1.6実装開始日の確定（VoiceDriveチームと調整）
- [ ] permissionLevel 10+職員リストJSON作成開始
- [ ] API-FG-1実装準備（開発環境セットアップ）

### ステップ2: VoiceDriveチーム側準備

- [ ] schema.prisma最終確認（4テーブル）
- [ ] 初期データJSON作成開始（方針8件、チェック5件、リスク5件）
- [ ] API連携実装準備（開発環境セットアップ）

### ステップ3: Phase 1.6実施（両チーム協働）

- [ ] Day 1-2: schema.prisma統合 + Prisma Migration
- [ ] Day 3: 初期データ投入
- [ ] Day 4-5: API連携実装
- [ ] Day 6-7: UI統合 + 統合テスト

---

## 📚 関連文書

### VoiceDriveチーム作成

- [FG-DB-REQ-2025-1009-001] - 施設ガバナンスページ DB要件分析

### 医療システムチーム作成

- [MED-RESPONSE-FG-2025-1010-001] - 施設ガバナンス統合実装回答書
- [Response_CommitteeManagement_Integration_20251010.md] - 委員会管理統合実装回答書
- [データ管理責任分界点定義書_20251008.md] - データ管理責任分界点定義

### マスタープラン

- [lightsail-integration-master-plan-20251005-updated.md] - AWS Lightsail統合実装マスタープラン（Version 2.20）
  - Phase 15追加（委員会管理）
  - Phase 16追加（施設ガバナンス）

---

## 🎯 最終確認サマリー

### 全ての確認事項に合意 ✅

| 確認項目 | 回答 | 決定内容 |
|---------|------|---------|
| **確認-1** | ✅ 合意 | Phase 1.6統合実装で進める |
| **確認-2** | ✅ 十分 | API-FG-1レスポンスフィールド5つで問題なし |
| **確認-3** | ✅ 問題なし | JSON形式で提供可能 |

### Phase 16実装準備完了 🟢

- ✅ schema.prisma設計承認（4テーブル）
- ✅ API連携方針確定（API-FG-1新規、API-2/API-8流用）
- ✅ 初期データ提供形式確定（JSON形式）
- ✅ 実装スケジュール確定（Phase 1.6統合実装）
- ✅ コスト削減確認（¥240,000削減、67%削減）

### 総削減額

- **Phase 16単独コスト削減**: ¥240,000（67%削減）
- **Phase 1.6統合実装による追加削減**: ¥1,280,000
- **総削減額**: **¥1,520,000**

---

**医療システムチームは施設ガバナンス統合実装を全面的に承認し、Phase 1.6実装時に委員会管理と同時実装することに合意しました。**

**VoiceDriveチームの素晴らしい設計と実装計画に感謝します。Phase 1.6実装成功に向けて協力していきましょう。**

---

**文書終了**

**次回更新**: Phase 1.6実装開始時
**承認**: ✅ 承認（医療システムチーム）
**実装開始待機**: Phase 1.6実装開始日確定待ち
