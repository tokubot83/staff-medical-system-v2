# ExecutiveFunctionsPage 医療システム確認結果報告書

**文書番号**: MED-CONF-2025-1026-010
**作成日**: 2025年10月26日
**作成者**: ClaudeCode（医療システムチーム）
**件名**: ExecutiveFunctionsPage暫定マスターリストの医療システム側確認結果

---

## 📋 エグゼクティブサマリー

VoiceDriveチームからの「ExecutiveFunctionsPage暫定マスターリスト」を分析しました。

### 医療システムチームの結論

✅ **Phase 2.10として5つのAPI実装が必要です**

ExecutiveFunctionsPageは経営層向け統合管理ページであり、医療システム側で以下の対応が必要です：

1. ✅ **経営KPI提供API実装** - 総売上、純利益、患者満足度等
2. ✅ **ROI計算API実装** - 戦略イニシアチブのROI算出
3. ✅ **人材配置状況API実装** - キーポジション充足率
4. ✅ **リーダーシップ評価API実装** - V3評価システム連携
5. ✅ **組織能力評価API実装** - 組織分析メトリクス

### 実装範囲の明確化

| 機能 | VoiceDrive責任 | 医療システム責任 | データ管理 |
|------|---------------|----------------|----------|
| 経営KPI（売上・利益） | 表示のみ | ✅ 100%管理 | 医療システムDB |
| 戦略イニシアチブ管理 | ✅ 100%管理 | 予算データ提供 | VoiceDrive DB（キャッシュ）|
| ROI計算 | 表示のみ | ✅ 100%計算 | 医療システムDB |
| 組織分析（リーダーシップ等） | 表示のみ | ✅ 100%管理 | 医療システムDB |
| 人材配置分析 | 表示のみ | ✅ 100%管理 | 医療システムDB |
| 重要課題管理 | ✅ 100%管理 | なし | VoiceDrive DB |
| 理事会報告書管理 | ✅ 100%管理 | なし | VoiceDrive DB |

**結論**: 財務・経営・人事データは医療システムが管理、VoiceDriveは組織課題・報告書を管理

---

## 🔍 詳細分析結果

### 1. API実装要件の分析

VoiceDriveから要求された5つのAPIの医療システム側実装可能性を確認しました。

#### API-1: GET /api/medical/executive/kpis（経営KPI取得）

**目的**: 総売上、純利益、職員数、患者満足度の取得

**必要なデータソース**: 医療システム財務DB、人事DB、アンケートDB

**実装可能性**: ✅ **実装可能**

**レスポンス構造**:
```json
{
  "fiscalYear": 2024,
  "quarter": 4,
  "revenue": {
    "total": 1200000000,
    "growth": 8.0,
    "currency": "JPY"
  },
  "profit": {
    "net": 180000000,
    "margin": 15.0,
    "currency": "JPY"
  },
  "staff": {
    "total": 255,
    "facilities": 3,
    "byFacility": {
      "obara-hospital": 150,
      "ryokufuen": 80,
      "visiting-nurse": 25
    }
  },
  "patientSatisfaction": {
    "overall": 94.0,
    "growth": 2.0,
    "surveyDate": "2024-12-01"
  }
}
```

**実装場所**: `src/app/api/medical/executive/kpis/route.ts`（新規）

**実装要件**:
1. 財務DBから売上・利益データ取得
2. EmployeeテーブルからGroupBy集計（施設別職員数）
3. アンケートDBから患者満足度取得
4. 前年同期比計算
5. 認可: Level 99（理事長）、Level 13（院長・施設長）

**推定工数**: 1.5日（12時間）

---

#### API-2: GET /api/medical/executive/initiatives/:id/roi（ROI取得）

**目的**: 戦略イニシアチブの投資収益率（ROI）を計算

**必要なデータソース**: 医療システム予算DB、財務DB

**実装可能性**: ✅ **実装可能**

**レスポンス構造**:
```json
{
  "initiativeId": "init-001",
  "expectedRoi": 18.0,
  "actualRoi": 16.5,
  "calculatedAt": "2025-10-26T00:00:00Z",
  "calculation": {
    "investment": 250000000,
    "expectedReturn": 45000000,
    "period": 36
  }
}
```

**実装場所**: `src/app/api/medical/executive/initiatives/[id]/roi/route.ts`（新規）

**実装要件**:
1. 予算DBからイニシアチブ投資額取得
2. 財務DBから実績リターン取得
3. ROI計算式: `(Return - Investment) / Investment × 100`
4. 期間を考慮した年率ROI計算

**推定工数**: 0.5日（4時間）

---

#### API-3: GET /api/medical/executive/staffing-status（人材配置状況取得）

**目的**: キーポジション充足率を取得

**必要なデータソース**: 医療システム人事DB、Employeeテーブル

**実装可能性**: ✅ **実装可能**

**レスポンス構造**:
```json
{
  "management": {
    "current": 15,
    "required": 15,
    "rate": 100
  },
  "specialists": {
    "current": 42,
    "required": 50,
    "rate": 84
  },
  "nextGen": {
    "current": 23,
    "required": 30,
    "rate": 76.7
  }
}
```

**実装場所**: `src/app/api/medical/executive/staffing-status/route.ts`（新規）

**実装要件**:
1. Employeeテーブルから職階・資格でGroupBy集計
2. 人事マスタから必要人数取得
3. 充足率計算
4. 次世代リーダー候補の抽出（V3評価A以上等）

**推定工数**: 0.75日（6時間）

---

#### API-4: GET /api/medical/executive/leadership-rating（リーダーシップ評価取得）

**目的**: V3評価システムからリーダーシップ評価を取得

**必要なデータソース**: V3評価DB

**実装可能性**: ✅ **実装可能**

**レスポンス構造**:
```json
{
  "overall": 4.3,
  "byFacility": {
    "obara-hospital": 4.5,
    "ryokufuen": 4.2,
    "visiting-nurse": 4.1
  },
  "surveyDate": "2024-12-01"
}
```

**実装場所**: `src/app/api/medical/executive/leadership-rating/route.ts`（新規）

**実装要件**:
1. V3Evaluationテーブルからリーダーシップスコア集計
2. 施設別平均計算
3. 法人全体平均計算

**推定工数**: 0.5日（4時間）

---

#### API-5: GET /api/medical/executive/organization-capabilities（組織能力評価取得）

**目的**: 組織能力マトリックス（実行力、適応力、結束力、創造性）を取得

**必要なデータソース**: 医療システムアンケートDB、V3評価DB

**実装可能性**: ✅ **実装可能**

**レスポンス構造**:
```json
{
  "execution": 92,
  "adaptation": 88,
  "cohesion": 90,
  "creativity": 75,
  "calculatedAt": "2024-12-01",
  "method": "survey"
}
```

**実装場所**: `src/app/api/medical/executive/organization-capabilities/route.ts`（新規）

**実装要件**:
1. アンケートDBから組織能力スコア取得
2. 4軸（実行力、適応力、結束力、創造性）集計
3. 0-100スケールに正規化

**推定工数**: 0.75日（6時間）

---

### 2. API実装サマリー

| API | エンドポイント | メソッド | 実装可能性 | 推定工数 |
|-----|-------------|---------|----------|---------|
| 経営KPI取得 | /api/medical/executive/kpis | GET | ✅ 可能 | 1.5日 |
| ROI取得 | /api/medical/executive/initiatives/:id/roi | GET | ✅ 可能 | 0.5日 |
| 人材配置状況取得 | /api/medical/executive/staffing-status | GET | ✅ 可能 | 0.75日 |
| リーダーシップ評価取得 | /api/medical/executive/leadership-rating | GET | ✅ 可能 | 0.5日 |
| 組織能力評価取得 | /api/medical/executive/organization-capabilities | GET | ✅ 可能 | 0.75日 |
| **合計** | - | - | - | **4日** |

---

## 📊 データ管理責任の分析

### VoiceDrive側で管理するデータ

| データカテゴリ | 理由 | VoiceDrive DB |
|-------------|------|--------------|
| 重要課題管理（ExecutiveKeyIssue） | 組織課題管理はVoiceDrive独自機能 | ✅ 必要 |
| 月次業績サマリー（ExecutiveMonthlySummary） | VoiceDrive活動と医療システムデータの統合 | ✅ 必要 |
| 戦略イニシアチブ（StrategicInitiative） | イニシアチブ管理はVoiceDrive主導 | ✅ 必要 |
| イニシアチブリスク（StrategicInitiativeRisk） | リスク管理はVoiceDrive主導 | ✅ 必要 |
| 組織分析メトリクス（OrganizationAnalyticsMetrics） | VoiceDrive活動統計と医療システムデータの統合 | ✅ 必要 |
| 理事会報告書（BoardReport） | 報告書管理はVoiceDrive独自機能 | ✅ 必要 |

### 医療システム側で管理するデータ

| データカテゴリ | 理由 | 医療システムDB |
|-------------|------|--------------|
| 財務データ（売上・利益） | 医療システムの中核データ | ✅ 既存DB |
| 予算データ | 医療システムの予算管理システム | ✅ 既存DB |
| 職員数・人事データ | Employeeテーブル | ✅ 既存DB |
| 患者満足度 | 医療システムアンケートDB | ✅ 既存DB |
| V3評価データ | V3評価システム | ✅ 既存DB |
| 組織能力評価 | 医療システムアンケートDB | ✅ 既存DB |

---

## 🎯 医療システム側の対応内容

### Phase 2.10: ExecutiveFunctionsPage連携（5つのAPI実装）

**実装期間**: 2025年11月25日（月）〜 12月2日（月）（5営業日）

#### 実装項目

| # | 項目 | 優先度 | 推定工数 | 担当 |
|---|------|--------|---------|------|
| 1 | GET /api/medical/executive/kpis 実装 | 🔴 最優先 | 1.5日 | 医療システム |
| 2 | GET /api/medical/executive/initiatives/:id/roi 実装 | 🔴 最優先 | 0.5日 | 医療システム |
| 3 | GET /api/medical/executive/staffing-status 実装 | 🟡 高 | 0.75日 | 医療システム |
| 4 | GET /api/medical/executive/leadership-rating 実装 | 🟡 高 | 0.5日 | 医療システム |
| 5 | GET /api/medical/executive/organization-capabilities 実装 | 🟡 高 | 0.75日 | 医療システム |
| 6 | 単体テスト実装 | 🔴 最優先 | 0.5日 | 医療システム |
| 7 | 統合テスト（VoiceDrive連携） | 🔴 最優先 | 0.5日 | 両チーム |

**合計工数**: 5日（40時間）

---

## ⚠️ VoiceDriveチームへの確認事項

### 確認1: 予算データの連携方法

**質問**:
- 戦略イニシアチブの予算情報は医療システムから提供可能か？
- 提供可能な場合、APIまたはWebhookどちらが適切か？

**背景**:
- StrategicInitiativeテーブルに予算情報をキャッシュする設計
- データ同期方法を確定する必要がある

**医療システムの推奨**: **API方式**
- VoiceDrive側でイニシアチブ作成時に予算マスタIDを紐づけ
- 医療システムAPIで最新予算を取得（キャッシュは1日）

---

### 確認2: ROI計算の前提条件

**質問**:
- ROI計算に必要な「期待リターン」はどこで管理するか？
- VoiceDrive側でイニシアチブ作成時に設定？それとも医療システム側で算出？

**背景**:
- ROI = (Return - Investment) / Investment × 100
- Investmentは予算データから取得可能
- Returnの算出方法を確認する必要がある

**医療システムの推奨**: **医療システム側で算出**
- イニシアチブカテゴリ別の標準ROI係数をマスタで管理
- 実績データから自動算出

---

### 確認3: 組織能力評価の更新頻度

**質問**:
- 組織能力評価（実行力、適応力、結束力、創造性）の更新頻度は？
- リアルタイム計算？それとも月次バッチ？

**背景**:
- リアルタイム計算は負荷が高い
- 月次バッチの場合、VoiceDrive側でキャッシュ

**医療システムの推奨**: **月次バッチ**
- 毎月初日にバッチ計算
- VoiceDrive側で1ヶ月キャッシュ

---

## 📅 実装スケジュール

### Phase 2.10実装スケジュール

| 日付 | 作業内容 | 医療システム担当 | VoiceDrive担当 | 状態 |
|------|---------|----------------|---------------|------|
| **2025-11-25 (月)** | API-1実装（経営KPI） | API実装 | - | ⏳ 待機中 |
| **2025-11-26 (火)** | API-2, 3実装（ROI, 人材配置） | API実装 | - | ⏳ 待機中 |
| **2025-11-27 (水)** | API-4, 5実装（評価系） | API実装 | - | ⏳ 待機中 |
| **2025-11-28 (木)** | 単体テスト | テスト実施 | - | ⏳ 待機中 |
| **2025-11-29 (金)** | 統合テスト | テスト実施 | API統合確認 | ⏳ 待機中 |
| **2025-12-02 (月)** | リリース | デプロイ | デプロイ | ⏳ 待機中 |

**リリース予定日**: 2025年12月2日（月）

---

## ✅ 医療システムチームの承認事項

### 承認事項サマリー

1. ✅ **Phase 2.10として新規実装**: ExecutiveFunctionsPage連携（5つのAPI）
2. ✅ **実装スコープ**: 5つのAPI実装
3. ✅ **実装期間**: 2025年11月25日〜12月2日（5営業日）
4. ✅ **推定工数**: 5日（40時間）
5. ✅ **データ管理責任**: 財務・経営・人事データは医療システムが100%管理
6. ⚠️ **VoiceDrive側DB追加**: 6テーブル（VoiceDriveチームが対応）

---

## 📞 次のアクション

### 医療システムチームの対応（即座に実施）

1. ✅ **本確認結果をVoiceDriveチームへ送付** - 2025年10月26日
2. ⏳ **3つの確認事項への回答待ち** - 11月1日までに回答希望
3. ⏳ **Phase 2.10実装開始** - 11月25日（月）から開始

### VoiceDriveチームへの期待

1. ⏳ **本確認結果のレビュー** - 10月31日（木）までに確認
2. ⏳ **3つの確認事項への回答** - 11月1日（金）までに回答
3. ⏳ **VoiceDrive側DB構築** - 6テーブル追加（ExecutiveKeyIssue等）
4. ⏳ **統合テスト実施** - 11月29日（金）医療システムチームと協力

---

## 🔗 関連ドキュメント

1. [ExecutiveFunctionsPage暫定マスターリスト](VD-MASTER-2025-1026-003) - VoiceDrive提供資料
2. [ExecutiveFunctionsPage_DB要件分析_20251026.md](./ExecutiveFunctionsPage_DB要件分析_20251026.md) - VoiceDrive側のDB分析
3. [organization-analytics_医療システム確認結果_20251010.md](./organization-analytics_医療システム確認結果_20251010.md) - 参考: 過去の確認結果
4. [lightsail-integration-master-plan-20251005-updated.md](./lightsail-integration-master-plan-20251005-updated.md) - マスタープラン（Phase 2.10追加予定）

---

**文書終了**

最終更新: 2025年10月26日
バージョン: 1.0
承認: 医療システムチーム承認済み
次回レビュー: VoiceDriveチームからの回答受領後

---

**医療システムチーム一同、VoiceDriveチームの詳細な暫定マスターリスト作成に感謝申し上げます。**

引き続き、Phase 2.10 ExecutiveFunctionsPage連携の成功に向けて全力で取り組みます。

---

**連絡先**:
- Slack: #phase2-integration
- Email: medical-system-dev@kousei-kai.jp
- 担当: 医療システム開発チーム
