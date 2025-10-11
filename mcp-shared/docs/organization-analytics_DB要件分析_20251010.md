# 組織分析ページ（OrganizationAnalytics）DB要件分析

**文書番号**: DB-REQ-2025-1010-002
**作成日**: 2025年10月10日
**対象システム**: VoiceDrive v100
**対象機能**: 組織分析ダッシュボード（Level 15+ 人事各部門長専用）
**優先度**: 🟡 MEDIUM（レベル15専用・戦略的分析機能）

---

## 📋 エグゼクティブサマリー

### 対象ページ概要

**URL**: https://voicedrive-v100.vercel.app/organization-analytics
**ファイルパス**: `C:\projects\voicedrive-v100\src\pages\OrganizationAnalyticsPage.tsx`
**権限**: Level 15+（人事各部門長以上）
**目的**: 議題化プロセスの分析と組織の声の可視化による戦略的インサイト提供

### 主要機能（現状）

1. **組織健康度指標**（152-186行目）
   - 声の活性度、参加率、解決率、エンゲージメントスコア、部門間連携

2. **議題化プロセスの進捗**（188-218行目）
   - 部署内議題、施設議題、法人議題、委員会提出済み、決議済み

3. **委員会活動の効果測定**（220-258行目）
   - 提出、審議完了、承認、実装済み、平均審議期間、平均実装期間

4. **議題カテゴリ別分析**（260-309行目）
   - 人事・採用、教育・研修、業務改善、労働環境、医療安全、コミュニケーション

5. **部門別の声の活性度**（311-357行目）
   - 部門ごとの投稿数、議題化数、活性度スコア

6. **戦略的インサイト（AI分析）**（359-392行目）
   - 注目ポイント、ポジティブな動きの自動検出

---

## 🎯 現状分析: データソース

### 🔴 重大な問題: 全てハードコードされたダミーデータ

```typescript
// OrganizationAnalyticsPage.tsx 34-80行目
const agendaProgress = {
  departmentLevel: 45,    // ハードコード
  facilityLevel: 23,      // ハードコード
  corporateLevel: 12,     // ハードコード
  // ...
};

const departmentActivity = [
  { name: '医療療養病棟', posts: 42, agenda: 8, engagement: 85, trend: 'up' },
  // ...全てハードコード
];

const categoryData = [
  { id: 'hr', name: '人事・採用', count: 28, resolved: 12, color: '...' },
  // ...全てハードコード
];

const committeeEffectiveness = {
  submitted: 32,  // ハードコード
  reviewed: 28,   // ハードコード
  // ...
};

const organizationHealth = {
  voiceActivity: 82,        // ハードコード
  participationRate: 68,    // ハードコード
  // ...
};
```

**結論**: 現時点では**実データと全く接続されていない**デモページ状態。

---

## 📊 必要なデータ項目と実装要件

### 1. 組織健康度指標（5つの指標）

#### 1.1 声の活性度（Voice Activity）

**必要なデータ**:
- 投稿総数（期間内）
- アクティブユーザー数
- コメント総数
- 投票総数

**データソース**:
- ✅ VoiceDrive `Post`テーブル（既存）
- ✅ VoiceDrive `Comment`テーブル（既存）
- ✅ VoiceDrive `Vote`テーブル（既存）
- ✅ VoiceDrive `User`テーブル（既存）

**計算式**:
```typescript
voiceActivity = (
  (投稿数 * 10) + (コメント数 * 5) + (投票数 * 1)
) / (全職員数 * 期間日数) * 100
```

**実装状態**: ❌ 未実装（全てハードコード）

---

#### 1.2 参加率（Participation Rate）

**必要なデータ**:
- 期間内にアクション（投稿/コメント/投票）した職員数
- 全職員数

**データソース**:
- ✅ VoiceDrive `Post`, `Comment`, `Vote`テーブル（既存）
- 🔵 医療システム API: `GET /api/v2/employees/active-count`（新規必要）

**計算式**:
```typescript
participationRate = (アクティブユーザー数 / 全職員数) * 100
```

**実装状態**: ❌ 未実装

---

#### 1.3 解決率（Resolution Rate）

**必要なデータ**:
- 期間内に作成された議題総数
- 期間内に解決済みになった議題数

**データソース**:
- ✅ VoiceDrive `ManagementCommitteeAgenda`テーブル（既存）
- ✅ VoiceDrive `DecisionMeetingAgenda`テーブル（既存）

**計算式**:
```typescript
resolutionRate = (解決済み議題数 / 総議題数) * 100
```

**実装状態**: ❌ 未実装

---

#### 1.4 エンゲージメントスコア（Engagement Score）

**必要なデータ**:
- 投稿あたりの平均コメント数
- 投稿あたりの平均投票数
- 議題化率（投稿から議題への昇格率）

**データソース**:
- ✅ VoiceDrive `Post`, `Comment`, `Vote`テーブル（既存）
- ✅ VoiceDrive `ManagementCommitteeAgenda.relatedPostId`（既存）

**計算式**:
```typescript
engagementScore = (
  (平均コメント数 / 5 * 30) +
  (平均投票数 / 20 * 40) +
  (議題化率 * 30)
)
```

**実装状態**: ❌ 未実装

---

#### 1.5 部門間連携（Cross-Dept Collaboration）

**必要なデータ**:
- 複数部門にまたがる議題数
- 部門外からのコメント数
- 部門外からの投票数

**データソース**:
- ✅ VoiceDrive `ManagementCommitteeAgenda.impactDepartments`（既存・JSON）
- ✅ VoiceDrive `Comment`, `Vote`テーブル（既存）
- 🔵 医療システム API: `GET /api/v2/employees/{employeeId}`で部門情報取得

**計算式**:
```typescript
crossDeptCollaboration = (
  (複数部門議題数 / 総議題数 * 50) +
  (部門外コメント率 * 30) +
  (部門外投票率 * 20)
)
```

**実装状態**: ❌ 未実装

---

### 2. 議題化プロセスの進捗（5段階）

#### 必要なデータ

| ステージ | 必要データ | データソース | 現在のテーブル | 実装状態 |
|---------|----------|------------|-------------|---------|
| **部署内議題** | `Post.agendaLevel = 'DEPT_REVIEW'` | VoiceDrive | `Post` | ✅ フィールド存在 |
| **施設議題** | `Post.agendaLevel = 'FACILITY_AGENDA'` | VoiceDrive | `Post` | ✅ フィールド存在 |
| **法人議題** | `Post.agendaLevel = 'CORPORATE_AGENDA'`（？） | VoiceDrive | `Post`（未定義） | ❌ 未実装 |
| **委員会提出済み** | `ManagementCommitteeAgenda.status != 'pending'` | VoiceDrive | `ManagementCommitteeAgenda` | ✅ 集計可能 |
| **決議済み** | `ManagementCommitteeAgenda.status = 'approved'` または `DecisionMeetingAgenda.decision = 'approved'` | VoiceDrive | `ManagementCommitteeAgenda`, `DecisionMeetingAgenda` | ✅ 集計可能 |

**問題点**:
- `Post.agendaLevel`に`'CORPORATE_AGENDA'`が未定義（現状は`'PENDING'`, `'DEPT_REVIEW'`, `'DEPT_AGENDA'`, `'FACILITY_AGENDA'`のみ）
- 法人議題のカウントロジックが不明確

**実装状態**: ⚠️ 部分実装（法人議題の定義が不足）

---

### 3. 委員会活動の効果測定（6指標）

#### 必要なデータ

| 指標 | 計算方法 | データソース | テーブル | 実装状態 |
|-----|---------|------------|---------|---------|
| **提出** | `count(ManagementCommitteeAgenda)` | VoiceDrive | `ManagementCommitteeAgenda` | ✅ 集計可能 |
| **審議完了** | `count(status IN ['approved', 'rejected', 'deferred'])` | VoiceDrive | `ManagementCommitteeAgenda` | ✅ 集計可能 |
| **承認** | `count(status = 'approved')` | VoiceDrive | `ManagementCommitteeAgenda` | ✅ 集計可能 |
| **実装済み** | ❌ フィールド不足 | VoiceDrive | `ManagementCommitteeAgenda` | ❌ **不足** |
| **平均審議期間** | `AVG(decidedDate - proposedDate)` | VoiceDrive | `ManagementCommitteeAgenda` | ✅ 計算可能 |
| **平均実装期間** | ❌ フィールド不足 | VoiceDrive | `ManagementCommitteeAgenda` | ❌ **不足** |

**不足フィールド**:
```prisma
model ManagementCommitteeAgenda {
  // 既存フィールド...

  // 🆕 必要な追加フィールド
  implementationStatus  String?   // 'not_started' | 'in_progress' | 'completed' | 'cancelled'
  implementedDate       DateTime? // 実装完了日
  implementationNotes   String?   // 実装メモ
}
```

**実装状態**: ⚠️ 部分実装（実装追跡フィールドが不足）

---

### 4. 議題カテゴリ別分析（6カテゴリ）

#### 必要なデータ

**カテゴリリスト**:
1. 人事・採用（hr）
2. 教育・研修（education）
3. 業務改善（workflow）
4. 労働環境（environment）
5. 医療安全（safety）
6. コミュニケーション（communication）

**データソース**:
- ✅ VoiceDrive `Post.proposalType`（既存・部分的）
- ✅ VoiceDrive `ManagementCommitteeAgenda.agendaType`（既存）

**問題点**:
- `Post.proposalType`は `'operational' | 'communication' | 'innovation' | 'strategic'`のみ
- OrganizationAnalyticsPage.tsxで使用しているカテゴリ（hr, education, workflow, environment, safety, communication）とマッピングが不明確

**推奨解決策**:
1. `ManagementCommitteeAgenda.agendaType`を使用（こちらが詳細なカテゴリを持つ）
2. または、`Post.proposalType`に新しいカテゴリを追加

**実装状態**: ⚠️ カテゴリ定義の不一致

---

### 5. 部門別の声の活性度

#### 必要なデータ

| 項目 | 計算方法 | データソース | 実装状態 |
|-----|---------|------------|---------|
| **部門名** | 部門マスタ | 🔵 医療システム API: `GET /api/v2/departments` | ❌ **新規API必要** |
| **投稿数** | `count(Post WHERE author.department = X)` | VoiceDrive `Post` + `User.department` | ✅ 集計可能 |
| **議題化数** | `count(ManagementCommitteeAgenda WHERE proposerDepartment = X)` | VoiceDrive `ManagementCommitteeAgenda.proposerDepartment` | ✅ 集計可能 |
| **活性度スコア** | 複合計算 | VoiceDrive | ⚠️ アルゴリズム未定義 |
| **トレンド** | 前期比較 | VoiceDrive | ❌ 履歴データ不足 |

**活性度スコア計算式（推奨）**:
```typescript
engagement = (
  (投稿数 / 部門人数 * 40) +
  (議題化率 * 30) +
  (コメント参加率 * 20) +
  (投票参加率 * 10)
)
```

**トレンド計算**:
- 前月比または前四半期比を計算するため、期間別の履歴保存が必要
- 推奨: `OrganizationAnalyticsSnapshot`テーブルを新設（月次保存）

**実装状態**: ⚠️ 部門マスタAPI不足、履歴データ不足

---

### 6. 戦略的インサイト（AI分析）

#### 必要なデータ

**現状**: 完全にハードコードされた静的テキスト

**理想の実装**:
1. GroupAnalytics（VoiceAnalytics統合実装済み）のアラートデータを活用
2. AnalyticsAlert（既存テーブル）から高優先度アラートを取得
3. 部門別活性度の急激な変化を検出
4. 議題カテゴリの急増を検出

**データソース**:
- ✅ VoiceDrive `GroupAnalytics`テーブル（既存）
- ✅ VoiceDrive `AnalyticsAlert`テーブル（既存）
- ⚠️ 時系列比較のための履歴データ

**実装状態**: ❌ 未実装（ハードコード）

---

## 🔄 データ管理責任分界点の確認

### VoiceDrive側がマスターとして管理すべきデータ

| データ項目 | 理由 | テーブル | 実装状態 |
|----------|------|---------|---------|
| **投稿データ** | VoiceDrive独自機能 | `Post`, `Comment`, `Vote` | ✅ 実装済み |
| **議題データ** | VoiceDrive独自機能 | `ManagementCommitteeAgenda`, `DecisionMeetingAgenda` | ✅ 実装済み |
| **活動統計** | VoiceDrive独自機能 | `VoteHistory`, `UserActivitySummary` | ✅ 実装済み |
| **分析スナップショット** | VoiceDrive独自機能 | ❌ **新規テーブル必要** | ❌ 未実装 |

---

### 医療システム側がマスターとして管理するデータ（VoiceDriveは参照のみ）

| データ項目 | 理由 | VoiceDrive側の取得方法 | 実装状態 |
|----------|------|---------------------|---------|
| **職員基本情報** | 人事マスタ | ✅ API: `GET /api/v2/employees/{employeeId}` | ✅ 既存API |
| **部門マスタ** | 組織構造マスタ | ❌ **新規API必要**: `GET /api/v2/departments` | ❌ 未実装 |
| **アクティブ職員数** | 人事マスタ | ❌ **新規API必要**: `GET /api/v2/employees/active-count` | ❌ 未実装 |

---

## 🚨 重大な不足項目

### 🔴 不足項目1: 実装追跡フィールド（ManagementCommitteeAgenda）

**問題**:
- 委員会で承認された議題が実際に実装されたかどうかを追跡できない
- OrganizationAnalyticsPage.tsx 228-239行目で「実装済み」指標が表示されているが、データソースがない

**必要なフィールド**:
```prisma
model ManagementCommitteeAgenda {
  // 既存フィールド...

  // 🆕 実装追跡フィールド
  implementationStatus  String?   @default("not_started") // 'not_started' | 'in_progress' | 'completed' | 'cancelled'
  implementedDate       DateTime? // 実装完了日
  implementationNotes   String?   // 実装メモ

  @@index([implementationStatus])
}
```

**影響**:
- 委員会活動の効果測定が不完全
- 承認から実装までの期間が測定不可

---

### 🔴 不足項目2: 部門マスタAPI（医療システム側）

**問題**:
- VoiceDrive側で部門別の統計を計算する際、部門リストと部門人数が取得できない
- `User.department`は文字列であり、正式な部門マスタと紐付いていない

**必要なAPI**:
```typescript
/**
 * GET /api/v2/departments
 * 部門マスタ一覧取得
 */
interface Department {
  id: string;              // 部門ID
  name: string;            // 部門名（例: "医療療養病棟"）
  code: string;            // 部門コード（例: "medical_care_ward"）
  facilityId: string;      // 施設ID
  facilityName: string;    // 施設名
  employeeCount: number;   // 所属職員数
  activeEmployeeCount: number; // アクティブ職員数
  parentDepartmentId?: string; // 親部門ID（階層構造の場合）
}
```

**影響**:
- 部門別活性度の正確な計算が不可能
- 部門別参加率の計算が不可能

---

### 🔴 不足項目3: アクティブ職員数API（医療システム側）

**問題**:
- 組織健康度指標の「参加率」を計算するために、全アクティブ職員数が必要
- 現在は `User`テーブルから取得しているが、退職者やステータス変更が反映されない可能性

**必要なAPI**:
```typescript
/**
 * GET /api/v2/employees/active-count
 * アクティブ職員数取得
 */
interface ActiveCountResponse {
  total: number;           // 全アクティブ職員数
  byDepartment: {
    [departmentCode: string]: number;
  };
  byFacility: {
    [facilityId: string]: number;
  };
  calculatedAt: string;    // 計算日時
}
```

**影響**:
- 参加率の計算が不正確
- 部門別活性度の計算が不正確

---

### 🟡 不足項目4: 分析スナップショットテーブル（VoiceDrive側）

**問題**:
- トレンド分析（前月比、前四半期比）を行うために、過去のデータを保存する必要がある
- 現在は全て動的計算だが、パフォーマンスとトレンド分析のために定期スナップショットが必要

**推奨テーブル**:
```prisma
// 組織分析スナップショット（月次バッチで保存）
model OrganizationAnalyticsSnapshot {
  id                        String    @id @default(cuid())

  // スナップショット期間
  snapshotDate              DateTime  // スナップショット実行日
  periodType                String    // 'weekly' | 'monthly' | 'quarterly'
  periodStartDate           DateTime  // 集計期間開始
  periodEndDate             DateTime  // 集計期間終了

  // 組織健康度指標（JSON保存）
  organizationHealthMetrics Json      // { voiceActivity, participationRate, resolutionRate, engagementScore, crossDeptCollaboration }

  // 議題化プロセス進捗（JSON保存）
  agendaProgressData        Json      // { departmentLevel, facilityLevel, corporateLevel, committeeSubmitted, resolved }

  // 委員会活動効果（JSON保存）
  committeeEffectivenessData Json     // { submitted, reviewed, approved, implemented, avgReviewDays, avgImplementDays }

  // カテゴリ別分析（JSON保存）
  categoryAnalysisData      Json      // [{ id, name, count, resolved, resolutionRate }, ...]

  // 部門別活性度（JSON保存）
  departmentActivityData    Json      // [{ name, posts, agenda, engagement, trend }, ...]

  // メタデータ
  createdAt                 DateTime  @default(now())

  @@index([snapshotDate])
  @@index([periodType])
  @@index([periodStartDate, periodEndDate])
  @@map("organization_analytics_snapshots")
}
```

**メリット**:
- トレンド分析が可能（前月比、前四半期比）
- ページ読み込みが高速化（事前集計データを使用）
- 月次報告書の自動生成が可能

---

### 🟡 不足項目5: 法人議題の定義（Post.agendaLevel）

**問題**:
- `Post.agendaLevel`に`'CORPORATE_AGENDA'`が未定義
- 現在は`'PENDING'`, `'DEPT_REVIEW'`, `'DEPT_AGENDA'`, `'FACILITY_AGENDA'`のみ

**推奨修正**:
```prisma
model Post {
  // ...
  agendaLevel  String?   // 'PENDING' | 'DEPT_REVIEW' | 'DEPT_AGENDA' | 'FACILITY_AGENDA' | 'CORPORATE_AGENDA' | 'COMMITTEE_SUBMITTED'
  // ...
}
```

**または、ManagementCommitteeAgendaとの紐付けで対応**:
- `ManagementCommitteeAgenda.relatedPostId`が存在する場合、その議題のステータスで法人議題かどうかを判定

---

## 📝 schema.prisma更新提案

### 提案1: ManagementCommitteeAgenda - 実装追跡フィールド追加

```prisma
model ManagementCommitteeAgenda {
  id                   String    @id @default(cuid())

  // 既存フィールド...

  // 🆕 実装追跡フィールド（2025-10-10追加）
  implementationStatus  String?   @default("not_started") // 'not_started' | 'in_progress' | 'completed' | 'cancelled'
  implementedDate       DateTime? // 実装完了日
  implementationNotes   String?   // 実装メモ
  implementationOwner   String?   // 実装責任者（User.id）

  // 既存のリレーション...

  @@index([implementationStatus])
  @@map("management_committee_agendas")
}
```

**マイグレーション**:
```bash
npx prisma migrate dev --name add_implementation_tracking_to_committee_agenda
```

---

### 提案2: OrganizationAnalyticsSnapshot - 新規テーブル追加

```prisma
// 組織分析スナップショット（月次バッチで保存）
model OrganizationAnalyticsSnapshot {
  id                        String    @id @default(cuid())

  // スナップショット期間
  snapshotDate              DateTime  // スナップショット実行日
  periodType                String    // 'weekly' | 'monthly' | 'quarterly'
  periodStartDate           DateTime  // 集計期間開始
  periodEndDate             DateTime  // 集計期間終了

  // 組織健康度指標（JSON保存）
  organizationHealthMetrics Json      // { voiceActivity, participationRate, resolutionRate, engagementScore, crossDeptCollaboration }

  // 議題化プロセス進捗（JSON保存）
  agendaProgressData        Json      // { departmentLevel, facilityLevel, corporateLevel, committeeSubmitted, resolved }

  // 委員会活動効果（JSON保存）
  committeeEffectivenessData Json     // { submitted, reviewed, approved, implemented, avgReviewDays, avgImplementDays }

  // カテゴリ別分析（JSON保存）
  categoryAnalysisData      Json      // [{ id, name, count, resolved, resolutionRate }, ...]

  // 部門別活性度（JSON保存）
  departmentActivityData    Json      // [{ name, posts, agenda, engagement, trend }, ...]

  // メタデータ
  createdAt                 DateTime  @default(now())

  @@index([snapshotDate])
  @@index([periodType])
  @@index([periodStartDate, periodEndDate])
  @@map("organization_analytics_snapshots")
}
```

**マイグレーション**:
```bash
npx prisma migrate dev --name add_organization_analytics_snapshot
```

---

### 提案3: DecisionMeetingAgenda - 実装追跡フィールド追加

```prisma
model DecisionMeetingAgenda {
  id                      String    @id @default(cuid())

  // 既存フィールド...

  // 🆕 実装追跡フィールド（2025-10-10追加）
  implementationStatus    String?   @default("not_started") // 'not_started' | 'in_progress' | 'completed' | 'cancelled'
  implementedDate         DateTime? // 実装完了日
  implementationNotes     String?   // 実装メモ
  implementationOwner     String?   // 実装責任者（User.id）

  // 既存のリレーション...

  @@index([implementationStatus])
  @@map("decision_meeting_agendas")
}
```

**マイグレーション**:
```bash
npx prisma migrate dev --name add_implementation_tracking_to_decision_agenda
```

---

## 🔗 医療システムとの連携が必要な項目

### API-3: 部門マスタ取得（新規実装必要）

**エンドポイント**: `GET /api/v2/departments`

**レスポンス例**:
```json
{
  "departments": [
    {
      "id": "dept_001",
      "name": "医療療養病棟",
      "code": "medical_care_ward",
      "facilityId": "tategami_hospital",
      "facilityName": "たてがみ病院",
      "employeeCount": 45,
      "activeEmployeeCount": 42,
      "parentDepartmentId": null
    },
    {
      "id": "dept_002",
      "name": "回復期リハ病棟",
      "code": "rehabilitation_ward",
      "facilityId": "tategami_hospital",
      "facilityName": "たてがみ病院",
      "employeeCount": 38,
      "activeEmployeeCount": 36,
      "parentDepartmentId": null
    }
  ],
  "total": 12,
  "retrievedAt": "2025-10-10T10:00:00.000Z"
}
```

**優先度**: 🔴 HIGH
**実装予定**: Phase 2（11月中旬）

---

### API-4: アクティブ職員数取得（新規実装必要）

**エンドポイント**: `GET /api/v2/employees/active-count`

**レスポンス例**:
```json
{
  "total": 250,
  "byDepartment": {
    "medical_care_ward": 42,
    "rehabilitation_ward": 36,
    "outpatient_clinic": 28,
    "visiting_nurse": 25,
    "administration": 18
  },
  "byFacility": {
    "tategami_hospital": 180,
    "tategami_clinic": 70
  },
  "calculatedAt": "2025-10-10T10:00:00.000Z"
}
```

**優先度**: 🔴 HIGH
**実装予定**: Phase 2（11月中旬）

---

## 📅 実装Phase提案

### Phase 1: データ取得基盤構築（11月11日〜15日）

#### VoiceDrive側

| タスク | 内容 | 担当 | 期日 |
|--------|-----|------|------|
| 🆕 schema.prisma更新 | ManagementCommitteeAgenda, DecisionMeetingAgendaに実装追跡フィールド追加 | VoiceDrive | 11月11日 |
| 🆕 マイグレーション | Prisma migrate実行 | VoiceDrive | 11月11日 |
| 🆕 OrganizationAnalyticsServiceクラス作成 | データ集計サービス実装 | VoiceDrive | 11月12日〜14日 |
| 🆕 基本統計API実装 | 組織健康度指標、議題進捗の集計 | VoiceDrive | 11月12日〜14日 |

#### 医療システム側

| タスク | 内容 | 担当 | 期日 |
|--------|-----|------|------|
| 🆕 API-3実装 | GET /api/v2/departments | 医療システム | 11月11日〜13日 |
| 🆕 API-4実装 | GET /api/v2/employees/active-count | 医療システム | 11月11日〜13日 |
| 🆕 単体テスト | API-3, API-4のテスト | 医療システム | 11月14日 |

**Phase 1完了時の動作範囲**:
- ✅ 医療システムから部門マスタ取得
- ✅ 医療システムからアクティブ職員数取得
- ✅ VoiceDrive側で組織健康度指標の実データ計算
- ✅ VoiceDrive側で議題進捗の実データ計算
- ⚠️ トレンド分析は未対応（履歴データなし）

---

### Phase 2: 実データ表示実装（11月18日〜22日）

#### VoiceDrive側のみ

| タスク | 内容 | 担当 | 期日 |
|--------|-----|------|------|
| 🆕 OrganizationAnalyticsPage修正 | ダミーデータを実データ取得に置き換え | VoiceDrive | 11月18日〜20日 |
| 🆕 統計カード実装 | 組織健康度指標の実データ表示 | VoiceDrive | 11月18日〜20日 |
| 🆕 議題進捗フロー実装 | 議題化プロセスの実データ表示 | VoiceDrive | 11月18日〜20日 |
| 🆕 委員会効果測定実装 | 委員会活動の実データ表示 | VoiceDrive | 11月18日〜20日 |
| 🆕 カテゴリ別分析実装 | カテゴリ別議題数の実データ表示 | VoiceDrive | 11月18日〜20日 |
| 🆕 部門別活性度実装 | 部門別統計の実データ表示 | VoiceDrive | 11月18日〜20日 |
| 🆕 統合テスト | 全機能の動作確認 | VoiceDrive | 11月21日〜22日 |

**Phase 2完了時の動作範囲**:
- ✅ 全指標が実データで表示
- ✅ 期間選択（週次/月次/四半期）機能動作
- ⚠️ トレンド分析は未対応（履歴データなし）

---

### Phase 3: 高度分析機能実装（11月25日〜29日）

#### VoiceDrive側のみ

| タスク | 内容 | 担当 | 期日 |
|--------|-----|------|------|
| 🆕 OrganizationAnalyticsSnapshotテーブル追加 | schema.prisma更新 | VoiceDrive | 11月25日 |
| 🆕 マイグレーション | Prisma migrate実行 | VoiceDrive | 11月25日 |
| 🆕 月次バッチ実装 | 組織分析スナップショット保存 | VoiceDrive | 11月26日〜27日 |
| 🆕 トレンド分析実装 | 前月比、前四半期比の計算 | VoiceDrive | 11月27日〜28日 |
| 🆕 戦略的インサイト実装 | GroupAnalytics, AnalyticsAlertとの連携 | VoiceDrive | 11月28日〜29日 |
| 🆕 統合テスト | トレンド分析、インサイト機能の確認 | VoiceDrive | 11月29日 |

**Phase 3完了時の動作範囲**:
- ✅ トレンド分析（前月比、前四半期比）
- ✅ 戦略的インサイト（AI分析）の実データ表示
- ✅ 月次レポート自動生成機能

---

## ✅ チェックリスト

### VoiceDrive側の実装

- [ ] ManagementCommitteeAgendaに実装追跡フィールド追加
- [ ] DecisionMeetingAgendaに実装追跡フィールド追加
- [ ] OrganizationAnalyticsSnapshotテーブル作成
- [ ] OrganizationAnalyticsServiceクラス実装
- [ ] 組織健康度指標の実データ計算実装
- [ ] 議題化プロセスの実データ計算実装
- [ ] 委員会活動効果の実データ計算実装
- [ ] カテゴリ別分析の実データ計算実装
- [ ] 部門別活性度の実データ計算実装
- [ ] 月次バッチ実装（スナップショット保存）
- [ ] トレンド分析実装
- [ ] 戦略的インサイト実装
- [ ] OrganizationAnalyticsPage修正（実データ表示）

### 医療システム側の実装

- [ ] API-3実装: GET /api/v2/departments
- [ ] API-4実装: GET /api/v2/employees/active-count
- [ ] 単体テスト作成
- [ ] API仕様書更新

### 統合テスト

- [ ] 部門マスタ取得テスト
- [ ] アクティブ職員数取得テスト
- [ ] 組織健康度指標の計算精度確認
- [ ] 議題化プロセスの集計精度確認
- [ ] 委員会活動効果の集計精度確認
- [ ] トレンド分析の精度確認

---

## 📝 補足資料

### 参照ドキュメント

1. **PersonalStation DB要件分析（参考）**
   - `C:\projects\staff-medical-system\mcp-shared\docs\Response_PersonalStation_DB_Requirements_20251009.md`

2. **account-deactivation DB要件分析（参考）**
   - `C:\projects\staff-medical-system\mcp-shared\docs\account-deactivation_DB要件分析_20251010.md`

3. **schema.prisma（現状）**
   - `C:\projects\voicedrive-v100\prisma\schema.prisma`

---

## 🙏 謝辞

本ドキュメントは、VoiceDrive開発チームと医療職員管理システム開発チームの協力により作成されました。

組織分析ページは、VoiceDriveの戦略的価値を最大化する重要な機能です。両チームの連携により、データドリブンな組織改善を実現してまいります。

---

**作成日**: 2025年10月10日
**文書番号**: DB-REQ-2025-1010-002
**作成者**: VoiceDrive開発チーム
