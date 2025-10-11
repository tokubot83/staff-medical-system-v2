# Strategic HR Plan 実装計画確認書

**文書番号**: MED-CONF-2025-1010-015
**作成日**: 2025年10月10日
**作成者**: 医療職員管理システムチーム
**承認者**: VoiceDriveチーム
**優先度**: 🔴 HIGH（Level 16経営幹部機能）

**関連文書**:
- [strategic-hr-plan_VoiceDrive回答書_20251010.md](./strategic-hr-plan_VoiceDrive回答書_20251010.md) - VoiceDriveチーム回答
- [strategic-hr-plan_Phase1詳細実装計画_20251010.md](./strategic-hr-plan_Phase1詳細実装計画_20251010.md) - Phase 1詳細計画
- [strategic-hr-plan_実装方針確定書_20251010.md](./strategic-hr-plan_実装方針確定書_20251010.md) - 実装方針確定書
- [strategic-hr-plan_DB要件分析_20251010.md](./strategic-hr-plan_DB要件分析_20251010.md) - DB要件分析
- [strategic-hr-plan暫定マスターリスト_20251010.md](./strategic-hr-plan暫定マスターリスト_20251010.md) - 暫定マスターリスト

---

## 📋 エグゼクティブサマリー

Strategic HR Plan（戦略的人事計画ページ）の実装方針が**VoiceDriveチームとの合意により確定**しました。

本文書は、VoiceDriveチームからの回答書（VD-A-2025-1010-012）に基づき、実装計画の全体像をまとめた確認書です。

### 合意事項サマリー

| 項目 | 決定内容 |
|------|----------|
| **実装方式** | 3-Phase段階実装 |
| **Phase 1範囲** | 戦略的人事計画タブのみ（4 API、3テーブル） |
| **Phase 1期間** | 2025/10/21（月）〜11/1（金）【実働6日】 |
| **Phase 1開始日** | 2025年10月21日（月） |
| **準備期間** | 2025/10/17-18（VoiceDriveチーム） |
| **データ計算** | VoiceDrive活動データから自動計算（日次バッチ） |
| **Phase 2時期** | Phase 1完了後1-2ヶ月後（12月中旬〜1月上旬） |
| **Phase 3時期** | Phase 2完了後（2026年1月下旬〜2月上旬） |

---

## ✅ 確定事項詳細

### 1. Phase分割の合意

**VoiceDriveチーム回答**: ✅ 3-Phase実装でOK

**Phase分割内訳**:
```
Phase 1: 戦略的人事計画タブ（4 API、3テーブル、推定6日）
  └─ 戦略的人事目標、イニシアチブ、ロードマップ、退職統計

Phase 2: 組織開発・パフォーマンス分析タブ（5 API、4テーブル、推定6.5日）
  └─ 組織健全性指標、パフォーマンス分析、改善提案実績

Phase 3: 退職管理タブ・高度分析（3 API、3テーブル、推定3.5日）
  └─ 退職理由分析、影響力分析、部門間協働度
```

### 2. Phase 1優先順位

**VoiceDriveチーム回答**: ✅ 全て同等（並行実装）

**実装順序の推奨**:
1. GET /api/v2/strategic-hr/goals
2. GET /api/v2/strategic-hr/initiatives
3. GET /api/v2/strategic-hr/roadmap
4. GET /api/v2/retirement/statistics

### 3. データ計算方法

**VoiceDriveチーム回答**: ✅ VoiceDrive活動データから自動計算

**計算ロジック**:
```typescript
// 職員満足度 = (投稿数 + コメント数 + 投票数) ÷ 職員数 × 10
currentSatisfaction = (postCount + commentCount + voteCount) / employeeCount * 10;

// 離職率 = 退職者数 ÷ 職員数 × 100
currentTurnoverRate = retiredCount / employeeCount * 100;

// 採用実績 = 今年度の新規入社者数
currentHiring = newHiresThisYear;
```

**実装**: 医療システム側で日次バッチ（毎日2:00 AM実行）

### 4. Phase 1スコープ外の機能

以下はPhase 2-3に延期：
- ❌ パフォーマンス分析タブ
- ❌ 組織健全性指標の自動計算
- ❌ 退職理由分析
- ❌ 影響力分析

### 5. VoiceDrive活動データの提供

- **Phase 1**: 不要（医療システムDBのみで計算）
- **Phase 2以降**: 共通DB統合後、医療システムがVoiceDrive DBを直接参照

---

## 🎯 Phase 1成功基準（確定版）

### ✅ DB構築
- [ ] StrategicHRGoal テーブル作成完了
- [ ] StrategicInitiative テーブル作成完了
- [ ] HRStrategyRoadmap テーブル作成完了
- [ ] Prisma Migration実行完了
- [ ] テストデータ投入完了

### ✅ API実装
- [ ] GET /api/v2/strategic-hr/goals 実装完了（Response Time < 3秒）
- [ ] GET /api/v2/strategic-hr/initiatives 実装完了
- [ ] GET /api/v2/strategic-hr/roadmap 実装完了
- [ ] GET /api/v2/retirement/statistics 実装完了
- [ ] レスポンスキャッシュ実装（Redis、5分間）
- [ ] レートリミット実装（100 req/min/IP）

### ✅ バッチ処理
- [ ] 日次バッチ実装（戦略目標実績値計算、2:00 AM実行）
- [ ] currentSatisfaction計算実装
- [ ] currentTurnoverRate計算実装
- [ ] currentHiring計算実装

### ✅ VoiceDrive側統合
- [ ] StrategicHRPageの戦略的人事計画タブが実データで表示
- [ ] エラーハンドリング・ローディング状態が正常動作
- [ ] Level 16権限チェックが正常動作
- [ ] 施設フィルタリングが動作（Level 18理事長用）

### ✅ 統合テスト
- [ ] 全APIエンドポイントが正常動作（4/4 = 100%）
- [ ] E2Eテストが成功（戦略的人事計画タブのみ）
- [ ] パフォーマンステスト合格（応答時間 < 3秒）
- [ ] セキュリティテスト（Level 16権限チェック）

---

## 📅 Phase 1実装スケジュール（確定版）

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

**Phase 1完了予定**: 2025年11月1日（金）

---

## 📋 実装タスク

### VoiceDriveチーム準備タスク（10/17-18）
- [ ] StrategicHRService.ts 骨格作成
- [ ] API統合インターフェース定義
- [ ] エラーハンドリング・ローディング状態のコンポーネント準備
- [ ] 医療システムAPIクライアントのモック実装
- [ ] E2Eテストケース作成

### 医療システムチーム実装タスク

**DB構築（10/21-25）**:
- [ ] StrategicHRGoal テーブル作成
- [ ] StrategicInitiative テーブル作成
- [ ] HRStrategyRoadmap テーブル作成
- [ ] Prisma Migration実行
- [ ] テストデータ投入

**API実装（10/28-11/1）**:
- [ ] GET /api/v2/strategic-hr/goals 実装
- [ ] GET /api/v2/strategic-hr/initiatives 実装
- [ ] GET /api/v2/strategic-hr/roadmap 実装
- [ ] GET /api/v2/retirement/statistics 実装

**バッチ処理（10/29-30）**:
- [ ] 日次バッチ実装（戦略目標実績値計算）

詳細: [strategic-hr-plan_Phase1詳細実装計画_20251010.md](./strategic-hr-plan_Phase1詳細実装計画_20251010.md)参照

---

## 📊 Phase 2-3の方針

### Phase 2: 組織開発・パフォーマンス分析タブ

**開始予定**: Phase 1完了後1-2ヶ月後（12月中旬〜1月上旬）
**実装期間**: 6.5日
**実装内容**:
- 組織健全性指標（VoiceDrive活動データ + アンケート併用）
- パフォーマンス分析（V3評価結果 + 勤怠データ + VoiceDrive提案数）
- 改善提案実績（VoiceDrive Post連携）

**開始条件**:
- ✅ Phase 1完了・検収
- ✅ 共通DB統合完了（VoiceDrive活動データへの直接アクセス可能）
- ✅ 医療システムチーム・VoiceDriveチーム双方のリソース確保

### Phase 3: 退職管理タブ・高度分析

**開始予定**: Phase 2完了後（2026年1月下旬〜2月上旬）
**実装期間**: 3.5日
**実装内容**:
- 退職理由分析（複数選択: 主要因+副次要因）
- 影響力分析（VoiceDrive活動データ + 医療システムデータ統合）
- 部門間協働度分析

---

## 🔗 関連ドキュメント一覧

| # | 文書名 | 用途 | 状態 |
|---|--------|------|------|
| 1 | [strategic-hr-plan_VoiceDrive回答書_20251010.md](./strategic-hr-plan_VoiceDrive回答書_20251010.md) | VoiceDriveチーム回答 | ✅ 完成 |
| 2 | [strategic-hr-plan_Phase1詳細実装計画_20251010.md](./strategic-hr-plan_Phase1詳細実装計画_20251010.md) | Phase 1詳細実装計画 | ✅ 完成 |
| 3 | [strategic-hr-plan_実装方針確定書_20251010.md](./strategic-hr-plan_実装方針確定書_20251010.md) | 実装方針確定書 | ✅ 完成 |
| 4 | [strategic-hr-plan_DB要件分析_20251010.md](./strategic-hr-plan_DB要件分析_20251010.md) | DB要件分析 | ✅ 完成 |
| 5 | [strategic-hr-plan暫定マスターリスト_20251010.md](./strategic-hr-plan暫定マスターリスト_20251010.md) | 暫定マスターリスト | ✅ 完成 |
| 6 | [strategic-hr-plan_テーブル設計承認依頼_20251010.md](./strategic-hr-plan_テーブル設計承認依頼_20251010.md) | テーブル設計承認依頼 | ✅ 完成 |
| 7 | [strategic-hr-plan_確認事項質問書_20251010.md](./strategic-hr-plan_確認事項質問書_20251010.md) | 確認事項質問書 | ✅ 完成 |
| 8 | **本文書** | 実装計画確認書 | ✅ 完成 |

---

## ✅ 最終承認

### 医療システムチーム
**承認内容**:
- ✅ 3-Phase実装方針に同意
- ✅ Phase 1スコープ確定（戦略的人事計画タブのみ）
- ✅ Phase 1開始日確定（2025年10月21日）
- ✅ 実装スケジュール承認（6日間、11/1完了予定）
- ✅ データ計算方法承認（VoiceDrive活動データから自動計算）

**署名**: 医療職員管理システムチーム
**日付**: 2025年10月10日

### VoiceDriveチーム
**承認内容**:
- ✅ 3-Phase実装方針に同意
- ✅ Phase 1スコープ確定
- ✅ 準備期間確保（10/17-18）
- ✅ 実装スケジュール承認
- ✅ データ提供方法承認（Phase 2以降で共通DB直接参照）

**署名**: VoiceDrive開発チーム
**日付**: 2025年10月10日（回答書により承認済み）

---

## 📞 連絡先

### 医療システムチーム
- **Slack**: #medical-system-dev
- **質問対応時間**: 平日 9:00-18:00

### VoiceDriveチーム
- **Slack**: #voicedrive-integration
- **質問対応時間**: 平日 10:00-19:00

---

## 🎯 次のアクション

### 医療システムチーム側
1. ✅ **10/10（木）**: 実装計画確認書作成・承認
2. 📋 **10/21（月）**: Phase 1開始（DB構築）
3. 📋 **10/28（月）**: API実装開始
4. 📋 **11/1（金）**: Phase 1統合テスト・検収

### VoiceDriveチーム側
1. ✅ **10/10（木）**: 回答書提出・実装計画確認書確認
2. 📋 **10/16（水）**: OrganizationAnalytics統合テスト完了
3. 📋 **10/17-18（木-金）**: StrategicHRPlan Phase 1準備期間
4. 📋 **10/21（月）**: Phase 1開始（医療システムチームDB構築開始を確認）
5. 📋 **10/28-11/1（月-金）**: Phase 1統合作業・テスト

---

**文書終了**

最終更新: 2025年10月10日
バージョン: 1.0
次回アクション: Phase 1実装開始（10/21）
完了予定日: 2025年11月1日（金）
