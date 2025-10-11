# Strategic HR Plan 実装方針確定書

**文書番号**: MED-CONF-2025-1010-013
**作成日**: 2025年10月10日
**作成者**: 医療職員管理システムチーム
**承認**: VoiceDriveチーム回答書（VD-A-2025-1010-012）に基づく
**関連文書**:
- [strategic-hr-plan_VoiceDrive回答書_20251010.md](./strategic-hr-plan_VoiceDrive回答書_20251010.md)
- [strategic-hr-plan_DB要件分析_20251010.md](./strategic-hr-plan_DB要件分析_20251010.md)
- [strategic-hr-plan暫定マスターリスト_20251010.md](./strategic-hr-plan暫定マスターリスト_20251010.md)

---

## 📋 エグゼクティブサマリー

VoiceDriveチームからの回答書を受領し、Strategic HR Plan（StrategicHRPage）の実装方針を確定しました。

### 主要な合意事項

1. **3-Phase実装**: 合計16日（Phase 1: 6日、Phase 2: 6.5日、Phase 3: 3.5日）
2. **Phase 1開始**: 10/21（月）から開始
3. **Phase 1スコープ**: 戦略的人事計画タブのみ実装（パフォーマンス分析・退職理由分析等はPhase 2-3に延期）
4. **データ計算**: VoiceDrive活動データから自動計算（日次バッチ）
5. **VoiceDrive活動データ提供**: Phase 2以降、共通DB直接参照

---

## ✅ 確定事項

### 1. Phase分割（3-Phase実装）

#### Phase 1: 戦略的人事計画タブ（推定6日）

**実装期間**: 10/21（月）〜11/1（金）

**実装内容**:
- **DB**: 3テーブル
  - StrategicHRGoal（戦略的人事目標）
  - StrategicInitiative（戦略的イニシアチブ）
  - HRStrategyRoadmap（人材戦略ロードマップ）
- **API**: 4エンドポイント
  - GET /api/v2/strategic-hr/goals
  - GET /api/v2/strategic-hr/initiatives
  - GET /api/v2/strategic-hr/roadmap
  - GET /api/v2/retirement/statistics（既存Employeeテーブルから計算）

**スコープ外（Phase 2以降に延期）**:
- ❌ パフォーマンス分析タブ
- ❌ 組織健全性指標の自動計算
- ❌ 退職理由分析
- ❌ 影響力分析

#### Phase 2: 組織開発・パフォーマンス分析タブ（推定6.5日）

**実装予定**: Phase 1完了後1-2ヶ月後（12月中旬〜1月上旬）

**実装内容**:
- **DB**: 5テーブル
  - OrganizationHealthMetrics（組織健全性指標）
  - OrgDevelopmentProgram + ProgramParticipant（組織開発プログラム）
  - PerformanceAnalytics（パフォーマンス分析）
  - ImprovementProposal（改善提案実績）
- **API**: 5エンドポイント
  - GET /api/v2/org-health/metrics
  - GET /api/v2/org-development/programs
  - GET /api/v2/performance/analytics
  - GET /api/v2/performance/department
  - GET /api/v2/improvement/proposals
- **VoiceDrive活動データ統合開始**

#### Phase 3: 退職管理タブ・高度分析（推定3.5日）

**実装予定**: Phase 2完了後（2026年1月下旬〜2月上旬）

**実装内容**:
- **DB**: 5テーブル
  - RetirementProcess（退職プロセス管理）
  - RetirementReason + RetentionAction（退職理由分析）
  - InfluenceAnalysis + DepartmentCollaboration（影響力分析）
- **API**: 3エンドポイント
  - GET /api/v2/retirement/processes
  - GET /api/v2/retirement/reason-analysis
  - GET /api/v2/influence/analysis
- **影響力分析の実データ表示**

---

### 2. データ計算方法

#### 戦略目標の実績値（Phase 1）

**計算ロジック**:
```typescript
// 職員満足度 = (投稿数 + コメント数 + 投票数) ÷ 職員数 × 10
currentSatisfaction = (postCount + commentCount + voteCount) / employeeCount * 10;

// 離職率 = 退職者数 ÷ 職員数 × 100
currentTurnoverRate = retiredCount / employeeCount * 100;

// 採用実績 = 今年度の新規入社者数
currentHiring = newHiresThisYear;
```

**実装場所**: 医療システム側（日次バッチ）
**実行タイミング**: 毎日2:00 AM

#### 組織健全性指標（Phase 2）

**方針**: VoiceDrive活動データ + アンケート併用

**Phase 2実装**:
- **日常**: VoiceDrive活動データから自動計算（週次バッチ）
  - エンゲージメント: 投稿頻度・コメント数
  - チーム協働性: 部門間コメント・投票
  - イノベーション指向: 提案数・新規アイデア
- **四半期**: アンケート調査で補正
  - 組織コミットメント: 主観的な帰属意識
  - 職員満足度: 総合的な満足度

**計算ロジック**:
```typescript
// エンゲージメント = (投稿数 + コメント数) ÷ 職員数 × 10
employeeEngagement = (postCount + commentCount) / employeeCount * 10;

// チーム協働性 = 部門間コメント数 ÷ 総コメント数 × 100
teamCollaboration = crossDeptComments / totalComments * 100;

// イノベーション指向 = 提案タグ付き投稿数 ÷ 総投稿数 × 100
innovationOrientation = proposalTaggedPosts / totalPosts * 100;
```

---

### 3. VoiceDrive活動データの提供方法

#### Phase 1
- **不要**: 医療システムDBのみで計算可能な指標のみ提供

#### Phase 2以降
- **方式**: 共通DB統合後、医療システムがVoiceDrive DBを直接参照
- **暫定対応**: DB統合未完了の場合はVoiceDrive側がAPI提供

**実装方法**:
```sql
-- 医療システム側から直接VoiceDrive DBを参照
SELECT
  authorId,
  COUNT(*) as postCount
FROM voicedrive.Post
WHERE createdAt >= '2025-01-01'
GROUP BY authorId;
```

---

### 4. 改善提案の連携（Phase 2）

#### VoiceDrive Post → ImprovementProposal連携

**VoiceDrive側**:
- Post（type="improvement"）は提案の入口として使用

**医療システム側**:
- ImprovementProposalテーブルで採用・実施管理
- 紐付け: `voiceDrivePostId`フィールドで連携

**コスト削減効果入力**: 部門長・経営幹部（Level 10+）

---

### 5. API仕様

#### Rate Limit
- **100 req/min/IP**（標準）

#### Response Cache
- **必要**: 5分間キャッシュ（Redis）

#### バッチ更新
- **日次バッチ**: 戦略指標の集計（2:00 AM実行）

#### エラーハンドリング
- **APIダウン時**: 前回キャッシュデータを表示（注意書き付き）
- **リトライ**: 3回まで、1秒間隔
- **タイムアウト**: 10秒

---

### 6. データ権限とフィルタリング

#### 閲覧権限
- **Level 18（理事長）**: 全施設のデータを閲覧可能
- **Level 16（院長・事務長）**: 自施設のデータのみ

#### フィルタリング
- **施設フィルタリング**: 必要（Level 18用ドロップダウン）
- **部門フィルタリング**: 必要（詳細分析用）

---

### 7. 測定方法（Phase 2）

#### 組織健全性指標
- **方法**: 定期アンケート調査（医療システム内で実施）
- **頻度**: 四半期ごと
- **対象**: 全職員

#### パフォーマンス分析
- **データソース**: V3評価結果 + 勤怠データ + 経営データ
- **計算ロジック**: 共通DB構築後に実装予定
- **VoiceDriveからの提供データ**: 改善提案数・採用数（イノベーション度の計算に使用）

---

## 📅 実装スケジュール確定

### Phase 1: 戦略的人事計画タブ（10/21-11/1、6日）

| 日付 | 作業内容 | 担当 | 状態 |
|------|---------|------|------|
| **10/17-18（木-金）** | VoiceDrive準備期間 | VoiceDrive | 📋 計画 |
| **10/19-20（土-日）** | 週末休息 | - | - |
| **10/21（月）** | Phase 1開始（DB構築開始） | 医療システム | 📋 計画 |
| **10/22-25（火-金）** | DB構築完了 | 医療システム | 📋 計画 |
| **10/28（月）** | API実装開始 | 医療システム | 📋 計画 |
| **10/29-11/1（火-金）** | 統合テスト | 両チーム | 📋 計画 |
| **11/1（金）** | Phase 1完了・検収 | 両チーム | 📋 計画 |

### Phase 2: 組織開発・パフォーマンス分析（Phase 1完了後1-2ヶ月後）

- **開始予定**: 12月中旬〜1月上旬
- **期間**: 6.5日

### Phase 3: 退職管理・高度分析（Phase 2完了後）

- **開始予定**: 2026年1月下旬〜2月上旬
- **期間**: 3.5日

---

## 🎯 Phase 1成功基準

### ✅ DB構築
- [ ] StrategicHRGoal テーブル作成完了
- [ ] StrategicInitiative テーブル作成完了
- [ ] HRStrategyRoadmap テーブル作成完了
- [ ] テストデータ投入完了

### ✅ API実装
- [ ] GET /api/v2/strategic-hr/goals が動作（Response Time < 3秒）
- [ ] GET /api/v2/strategic-hr/initiatives が動作
- [ ] GET /api/v2/strategic-hr/roadmap が動作
- [ ] GET /api/v2/retirement/statistics が動作

### ✅ VoiceDrive側統合
- [ ] StrategicHRPageの戦略的人事計画タブが実データで表示
- [ ] エラーハンドリング・ローディング状態が正常動作
- [ ] Level 16権限チェックが正常動作
- [ ] 施設フィルタリングが動作（Level 18用）

### ✅ 統合テスト
- [ ] 全APIエンドポイントが正常動作（100%）
- [ ] E2Eテストが成功（戦略的人事計画タブのみ）
- [ ] パフォーマンステスト合格（応答時間 < 3秒）
- [ ] セキュリティテスト（Level 16権限チェック）

---

## 📋 VoiceDriveチーム準備タスク（10/17-18）

### 準備期間タスク
- [ ] StrategicHRService.ts 骨格作成
- [ ] API統合インターフェース定義
- [ ] エラーハンドリング・ローディング状態のコンポーネント準備
- [ ] 医療システムAPIクライアントのモック実装
- [ ] E2Eテストケース作成

### Phase 1統合タスク（10/28-11/1）
- [ ] 医療システムAPIクライアント実装（4エンドポイント）
- [ ] StrategicHRPageの戦略的人事計画タブ実データ統合
- [ ] エラーハンドリング・ローディング状態実装
- [ ] 施設フィルタリング実装（Level 18用）
- [ ] E2Eテスト実施

---

## 📋 医療システムチーム実装タスク

### DB構築（10/21-25）

#### テーブル作成
- [ ] **StrategicHRGoal** テーブル作成
  - フィールド: fiscalYear, facilityId, employeeSatisfactionTarget, turnoverRateTarget, annualHiringTarget, currentSatisfaction, currentTurnoverRate, currentHiring
  - ユニーク制約: `@@unique([fiscalYear, facilityId])`
- [ ] **StrategicInitiative** テーブル作成
  - フィールド: facilityId, name, description, category, progressPercent, deadline, ownerId, priority, status
  - インデックス: facilityId, deadline
- [ ] **HRStrategyRoadmap** テーブル作成
  - フィールド: facilityId, timeframe, title, description, targetYear, status, order
  - インデックス: `[facilityId, timeframe]`
- [ ] Prisma Migration実行
- [ ] テストデータ投入

### API実装（10/28-11/1）

#### API-1: 戦略的人事目標取得API
- [ ] **GET /api/v2/strategic-hr/goals**
  - クエリパラメータ: fiscalYear, facilityId
  - レスポンスキャッシュ: 5分間
  - 権限チェック: Level 16以上

#### API-2: 戦略的イニシアチブ取得API
- [ ] **GET /api/v2/strategic-hr/initiatives**
  - クエリパラメータ: facilityId, status
  - レスポンスキャッシュ: 5分間
  - 権限チェック: Level 16以上

#### API-3: 人材戦略ロードマップ取得API
- [ ] **GET /api/v2/strategic-hr/roadmap**
  - クエリパラメータ: facilityId
  - レスポンスキャッシュ: 5分間
  - 権限チェック: Level 16以上

#### API-4: 退職統計取得API
- [ ] **GET /api/v2/retirement/statistics**
  - クエリパラメータ: facilityId, fiscalYear
  - 既存Employeeテーブルから計算
  - レスポンスキャッシュ: 5分間
  - 権限チェック: Level 16以上

### バッチ処理（10/28-11/1）

#### 日次バッチ: 戦略目標実績値計算（2:00 AM実行）
- [ ] currentSatisfaction計算（VoiceDrive活動データから）
- [ ] currentTurnoverRate計算（Employeeテーブルから）
- [ ] currentHiring計算（Employeeテーブルから）

---

## 🔗 関連ドキュメント

1. ✅ [strategic-hr-plan_VoiceDrive回答書_20251010.md](./strategic-hr-plan_VoiceDrive回答書_20251010.md)
2. ✅ [strategic-hr-plan_DB要件分析_20251010.md](./strategic-hr-plan_DB要件分析_20251010.md)
3. ✅ [strategic-hr-plan暫定マスターリスト_20251010.md](./strategic-hr-plan暫定マスターリスト_20251010.md)
4. ✅ [strategic-hr-plan_テーブル設計承認依頼_20251010.md](./strategic-hr-plan_テーブル設計承認依頼_20251010.md)
5. ✅ [共通DB構築後統合作業再開計画書_20251008.md](./共通DB構築後統合作業再開計画書_20251008.md)

---

## ✅ 承認

**医療システムチーム**: 本実装方針をすべて承認し、10/21（月）からPhase 1実装を開始します。

**VoiceDriveチーム**: 本実装方針を承認済み（回答書により確認）

**署名**: 医療職員管理システムチーム
**日付**: 2025年10月10日

---

## 📞 連絡先

### 医療システムチーム
- **Slack**: #medical-system-dev
- **質問対応**: 平日 9:00-18:00

### VoiceDriveチーム
- **Slack**: #voicedrive-integration

---

**文書終了**

最終更新: 2025年10月10日
バージョン: 1.0
次回アクション: Phase 1実装開始（10/21）
