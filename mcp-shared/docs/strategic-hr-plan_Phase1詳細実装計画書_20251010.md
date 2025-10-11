# Strategic HR Plan Phase 1 詳細実装計画書

**文書番号**: MED-IMPL-2025-1010-014
**作成日**: 2025年10月10日
**作成者**: 医療職員管理システムチーム
**承認**: VoiceDriveチーム回答書（VD-A-2025-1010-012）に基づく
**優先度**: 🔴 HIGH（Level 16経営幹部機能）
**実装期間**: 2025年10月21日（月）〜11月1日（金）【12営業日、実働6日】

**関連文書**:
- [strategic-hr-plan_VoiceDrive回答書_20251010.md](./strategic-hr-plan_VoiceDrive回答書_20251010.md)
- [strategic-hr-plan_実装方針確定書_20251010.md](./strategic-hr-plan_実装方針確定書_20251010.md)
- [strategic-hr-plan_DB要件分析_20251010.md](./strategic-hr-plan_DB要件分析_20251010.md)
- [strategic-hr-plan暫定マスターリスト_20251010.md](./strategic-hr-plan暫定マスターリスト_20251010.md)

---

## 📋 エグゼクティブサマリー

Strategic HR Plan（戦略的人事計画ページ）のPhase 1実装を**2025年10月21日（月）から開始**します。

### Phase 1スコープ

**実装範囲**: 戦略的人事計画タブのみ
- ✅ 戦略的人事目標（職員満足度目標95%等）
- ✅ 戦略的イニシアチブ（タレントマネジメント強化等）
- ✅ 人材戦略ロードマップ（短期・中期・長期目標）
- ✅ 退職統計（人数・離職率）

**スコープ外（Phase 2-3に延期）**:
- ❌ パフォーマンス分析タブ
- ❌ 組織健全性指標の自動計算
- ❌ 退職理由分析
- ❌ 影響力分析

### 実装規模

| 項目 | 数量 |
|------|------|
| **DB テーブル** | 3テーブル + 既存Employee利用 |
| **API エンドポイント** | 4 API |
| **実装工数** | 6日（医療システム4日 + VoiceDrive統合2日） |
| **完了予定日** | 2025年11月1日（金） |

---

## 🎯 Phase 1成功基準

Phase 1は以下がすべて完了した時点で成功とします：

### ✅ DB構築（10/21-25）
- [ ] StrategicHRGoal テーブル作成完了
- [ ] StrategicInitiative テーブル作成完了
- [ ] HRStrategyRoadmap テーブル作成完了
- [ ] Prisma Migration実行完了
- [ ] テストデータ投入完了

### ✅ API実装（10/28-11/1）
- [ ] GET /api/v2/strategic-hr/goals 実装完了（Response Time < 3秒）
- [ ] GET /api/v2/strategic-hr/initiatives 実装完了
- [ ] GET /api/v2/strategic-hr/roadmap 実装完了
- [ ] GET /api/v2/retirement/statistics 実装完了
- [ ] レスポンスキャッシュ実装（Redis、5分間）
- [ ] レートリミット実装（100 req/min/IP）

### ✅ バッチ処理（10/28-11/1）
- [ ] 日次バッチ実装（戦略目標実績値計算、2:00 AM実行）
- [ ] currentSatisfaction計算実装
- [ ] currentTurnoverRate計算実装
- [ ] currentHiring計算実装

### ✅ VoiceDrive側統合（10/28-11/1）
- [ ] StrategicHRPageの戦略的人事計画タブが実データで表示
- [ ] エラーハンドリング・ローディング状態が正常動作
- [ ] Level 16権限チェックが正常動作（院長・事務長のみ閲覧可能）
- [ ] 施設フィルタリングが動作（Level 18理事長用）

### ✅ 統合テスト（11/1）
- [ ] 全APIエンドポイントが正常動作（4/4 = 100%）
- [ ] E2Eテストが成功（戦略的人事計画タブのみ）
- [ ] パフォーマンステスト合格（応答時間 < 3秒）
- [ ] セキュリティテスト（Level 16権限チェック）
- [ ] エラーハンドリングテスト（APIダウン時のフォールバック）

---

## 📅 実装スケジュール

### 全体スケジュール

| 日付 | 作業内容 | 担当 | 工数 | 状態 |
|------|---------|------|------|------|
| **10/16（水）** | OrganizationAnalytics統合テスト完了 | 両チーム | - | ✅ 完了予定 |
| **10/17-18（木-金）** | VoiceDrive準備期間 | VoiceDrive | 1.5日 | 📋 計画 |
| **10/19-20（土-日）** | 週末休息 | - | - | - |
| **10/21（月）** | Phase 1開始・DB設計最終確認 | 医療システム | 0.5日 | 📋 計画 |
| **10/22-25（火-金）** | DB構築・マイグレーション・テストデータ | 医療システム | 2日 | 📋 計画 |
| **10/26-27（土-日）** | 週末休息 | - | - | - |
| **10/28（月）** | API実装開始 | 医療システム | 1日 | 📋 計画 |
| **10/29-30（火-水）** | バッチ処理実装 | 医療システム | 0.5日 | 📋 計画 |
| **10/31（木）** | VoiceDrive統合開始 | 両チーム | 1日 | 📋 計画 |
| **11/1（金）** | 統合テスト・検収 | 両チーム | 1日 | 📋 計画 |

**合計工数**: 6日（医療システム4日 + VoiceDrive統合2日）

---

## 🗄️ DB実装詳細（10/21-25、推定2.5日）

### テーブル1: StrategicHRGoal（戦略的人事目標）

**目的**: 年度別・施設別の戦略的人事目標を管理

**Prismaスキーマ**:
```prisma
model StrategicHRGoal {
  id                          String    @id @default(cuid())
  fiscalYear                  Int       @map("fiscal_year")          // 2025
  facilityId                  String    @map("facility_id")          // 施設別目標

  // 目標値
  employeeSatisfactionTarget  Float     @map("employee_satisfaction_target")  // 95.0
  turnoverRateTarget          Float     @map("turnover_rate_target")           // 5.0
  annualHiringTarget          Int       @map("annual_hiring_target")           // 120

  // 実績値（計算値、VoiceDrive活動データから）
  currentSatisfaction         Float?    @map("current_satisfaction")
  currentTurnoverRate         Float?    @map("current_turnover_rate")
  currentHiring               Int?      @map("current_hiring")

  // メタデータ
  setByUserId                 String    @map("set_by_user_id")      // 目標設定者
  approvedAt                  DateTime? @map("approved_at")         // 承認日時
  createdAt                   DateTime  @default(now()) @map("created_at")
  updatedAt                   DateTime  @updatedAt @map("updated_at")

  facility                    Facility  @relation(fields: [facilityId], references: [id])
  setByUser                   User      @relation(fields: [setByUserId], references: [id])

  @@unique([fiscalYear, facilityId])
  @@index([fiscalYear])
  @@map("strategic_hr_goals")
}
```

**テストデータ**: 実装計画書に記載済み（省略）

---

### テーブル2: StrategicInitiative（戦略的イニシアチブ）

**Prismaスキーマ**: 実装計画書に記載済み（省略）

---

### テーブル3: HRStrategyRoadmap（人材戦略ロードマップ）

**Prismaスキーマ**: 実装計画書に記載済み（省略）

---

## 🔌 API実装詳細（10/28-11/1、推定2日）

### API一覧

| No | エンドポイント | メソッド | 説明 |
|----|--------------|---------|------|
| 1 | `/api/v2/strategic-hr/goals` | GET | 戦略的人事目標取得 |
| 2 | `/api/v2/strategic-hr/initiatives` | GET | 戦略的イニシアチブ取得 |
| 3 | `/api/v2/strategic-hr/roadmap` | GET | 人材戦略ロードマップ取得 |
| 4 | `/api/v2/retirement/statistics` | GET | 退職統計取得 |

詳細仕様は実装計画書に記載済み（省略）

---

## ⚙️ バッチ処理実装（10/29-30、推定0.5日）

### 日次バッチ: 戦略目標実績値計算

**実行タイミング**: 毎日2:00 AM
**処理内容**: 実装計画書に記載済み（省略）

---

## 🔗 VoiceDrive側統合（10/28-11/1、推定2日）

### 準備タスク（10/17-18）
実装計画書に記載済み（省略）

### 統合タスク（10/31-11/1）
実装計画書に記載済み（省略）

---

## ✅ 統合テストチェックリスト（11/1）

実装計画書に記載済み（省略）

---

## 📊 Phase 1完了後の状態

### ✅ 実装済み機能

| 機能 | 状態 |
|------|------|
| **戦略的人事目標表示** | ✅ 実装済み（目標・実績・差分） |
| **戦略的イニシアチブ表示** | ✅ 実装済み（進捗・期限・責任者） |
| **人材戦略ロードマップ表示** | ✅ 実装済み（短期・中期・長期） |
| **退職統計表示** | ✅ 実装済み（人数・離職率・新規採用） |
| **権限チェック** | ✅ 実装済み（Level 16以上） |
| **施設フィルタリング** | ✅ 実装済み（Level 18理事長用） |
| **レスポンスキャッシュ** | ✅ 実装済み（Redis、5分間） |
| **日次バッチ** | ✅ 実装済み（戦略目標実績値計算） |

---

## 🔗 関連ドキュメント

1. ✅ [strategic-hr-plan_VoiceDrive回答書_20251010.md](./strategic-hr-plan_VoiceDrive回答書_20251010.md)
2. ✅ [strategic-hr-plan_実装方針確定書_20251010.md](./strategic-hr-plan_実装方針確定書_20251010.md)
3. ✅ [strategic-hr-plan_DB要件分析_20251010.md](./strategic-hr-plan_DB要件分析_20251010.md)
4. ✅ [strategic-hr-plan暫定マスターリスト_20251010.md](./strategic-hr-plan暫定マスターリスト_20251010.md)
5. ✅ [共通DB構築後統合作業再開計画書_20251008.md](./共通DB構築後統合作業再開計画書_20251008.md)

---

## ✅ 承認

**医療システムチーム**: 本Phase 1詳細実装計画を承認し、10/21（月）から実装を開始します。

**VoiceDriveチーム**: 本Phase 1詳細実装計画を承認済み（回答書により確認）

**署名**: 医療職員管理システムチーム
**日付**: 2025年10月10日

---

**文書終了**

最終更新: 2025年10月10日
バージョン: 1.0
次回アクション: Phase 1実装開始（10/21）
