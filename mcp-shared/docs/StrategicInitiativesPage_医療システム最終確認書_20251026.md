# StrategicInitiativesPage 医療システム最終確認書

**文書番号**: MED-CONFIRM-2025-1026-002
**作成日**: 2025年10月26日
**Phase**: 2.11
**対象ページ**: StrategicInitiativesPage（戦略イニシアチブページ）
**作成者**: 医療システム開発チーム
**宛先**: VoiceDrive開発チーム

---

## 1. 📋 確認事項への回答 - 承認状況

VoiceDrive開発チームからの回答書（VD-RESP-2025-1026-001）を受領し、全ての回答を承認いたします。

### ✅ 確認事項1: プロジェクトテンプレート管理場所

**医療システムからの質問**:
> プロジェクトテンプレート管理は、VoiceDrive側で実施するか、医療システム側で実施するか？

**VoiceDriveからの回答**:
> **VoiceDrive側で管理**します。医療システムチームの提案を採用し、プロジェクトテンプレートはVoiceDrive側でReact Context + ローカルストレージで管理します。

**医療システム承認結果**: ✅ **承認**

**承認理由**:
- VoiceDrive側でのテンプレート管理により、医療システムの実装負荷が軽減されます
- テンプレートはUI/UXに強く依存するため、VoiceDrive側での管理が適切です
- 医療システムは実プロジェクトデータ（StrategicProjectテーブル）のみ管理すれば良いため、責任分界が明確になります

**医療システム側の実装不要**:
- プロジェクトテンプレート用のデータベーステーブル追加不要
- テンプレート管理用のAPI実装不要

---

### ✅ 確認事項2: 統計情報計算場所

**医療システムからの質問**:
> 統計情報（全体進捗率、予算執行率など）の計算は、クライアント側で実施するか、サーバー側APIで計算するか？

**VoiceDriveからの回答**:
> **クライアント側（VoiceDrive）で計算**します。医療システムチームの提案を採用し、生データのみAPIで取得し、集計・計算はVoiceDrive側で実施します。

**医療システム承認結果**: ✅ **承認**

**承認理由**:
- サーバー負荷の軽減が可能です
- VoiceDrive側で柔軟なUI表示調整が可能になります
- 医療システムAPIはシンプルな生データ返却のみで済みます

**医療システムAPIの実装方針**:
```typescript
// GET /api/strategic-projects - 生データのみ返却
{
  "success": true,
  "data": [
    {
      "id": "proj_001",
      "title": "電子カルテシステム刷新",
      "status": "IN_PROGRESS",
      "priority": "HIGH",

      // 進捗情報（生データ）
      "overallProgress": 45.5,

      // 予算情報（生データ）
      "budgetTotal": 50000000,
      "budgetAllocated": 40000000,
      "budgetSpent": 22750000,
      "budgetRemaining": 27250000,
      "budgetUtilizationRate": 56.875,

      // マイルストーン（生データ）
      "milestones": [
        {
          "id": "ms_001",
          "title": "要件定義完了",
          "status": "COMPLETED",
          "completionRate": 100,
          "dueDate": "2025-03-31T00:00:00.000Z"
        }
      ],

      // KPI（生データ）
      "kpis": [
        {
          "id": "kpi_001",
          "name": "システム稼働率",
          "currentValue": 99.8,
          "targetValue": 99.9,
          "unit": "%",
          "status": "ON_TRACK"
        }
      ],

      // リスク（生データ）
      "risks": [
        {
          "id": "risk_001",
          "title": "ベンダー対応遅延",
          "severity": "HIGH",
          "status": "ACTIVE"
        }
      ]
    }
  ]
}
```

**VoiceDrive側での統計計算例**:
```typescript
// VoiceDrive側で実装
function calculateProjectStats(projects) {
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'COMPLETED').length;
  const completionRate = (completedProjects / totalProjects) * 100;

  const totalBudget = projects.reduce((sum, p) => sum + p.budgetTotal, 0);
  const totalSpent = projects.reduce((sum, p) => sum + p.budgetSpent, 0);
  const avgBudgetUtilization = (totalSpent / totalBudget) * 100;

  const avgProgress = projects.reduce((sum, p) => sum + p.overallProgress, 0) / totalProjects;

  return { completionRate, avgBudgetUtilization, avgProgress };
}
```

---

### ✅ 確認事項3: 既存予算管理システムの有無

**医療システムからの質問**:
> 医療システムに既存の予算管理システムは存在するか？既存システムとの統合が必要か？

**VoiceDriveからの回答**:
> **既存の予算管理システムは存在しません**。医療システムチームの提案を採用し、StrategicProjectテーブルで独立管理を実施します。

**医療システム承認結果**: ✅ **承認**

**承認理由**:
- 既存システムがないため、統合作業が不要です
- StrategicProjectテーブルで完結した予算管理が可能です
- 将来的な拡張性も確保されています

**実装仕様確定**:

```prisma
model StrategicProject {
  id                    String   @id @default(cuid())

  // 予算管理（BigInt: 大規模予算対応）
  budgetTotal           BigInt   @map("budget_total")        // 総予算
  budgetAllocated       BigInt   @map("budget_allocated")    // 配分済み予算
  budgetSpent           BigInt   @map("budget_spent")        // 支出済み予算
  budgetRemaining       BigInt   @map("budget_remaining")    // 残予算
  budgetUtilizationRate Float    @default(0) @map("budget_utilization_rate") // 執行率

  // ... その他のフィールド
}
```

**将来的な拡張性**:
- Phase 2（将来）で既存予算システムが導入された場合:
  - `budgetSystemId` フィールド追加でリンク可能
  - 現在の独立管理は維持可能（後方互換性確保）

---

## 2. 🔄 VoiceDriveからの追加確認事項への回答

VoiceDrive開発チームから2件の追加確認事項を受領しました。以下、医療システムチームの回答です。

### ✅ 追加確認1: マイルストーン完了時の通知機能実装

**VoiceDriveからの質問**:
> マイルストーン完了時の通知機能は実装しますか？
> 実装する場合、通知サービスとの連携が必要になります。

**医療システム回答**: ✅ **Phase 2で実装を推奨**

**推奨理由**:
- マイルストーン完了通知はプロジェクト管理において重要な機能です
- ただし、通知サービスとの連携が必要なため、Phase 1（基本機能実装）とは分離して実装することを推奨します

**Phase 1実装範囲（2025年11月11日〜11月20日）**:
- マイルストーン完了ステータス更新API実装のみ
- 通知機能は実装しない

**Phase 2実装範囲（2025年12月以降 - 提案）**:
```typescript
// Phase 2で実装予定のAPI

// POST /api/strategic-projects/{projectId}/milestones/{milestoneId}/complete
{
  "completedAt": "2025-11-15T10:30:00.000Z",
  "actualCompletionRate": 100,
  "notes": "要件定義完了。次フェーズへ移行可能。",

  // Phase 2で追加
  "notificationSettings": {
    "notifyProjectOwner": true,
    "notifyTeamMembers": true,
    "notifyStakeholders": false
  }
}

// 通知サービス連携
// POST /api/notifications/send（Phase 2で実装）
{
  "type": "MILESTONE_COMPLETED",
  "projectId": "proj_001",
  "milestoneId": "ms_001",
  "recipients": ["owner_id", "member1_id", "member2_id"],
  "message": "マイルストーン「要件定義完了」が達成されました。"
}
```

**Phase 2実装時の連携ポイント**:
1. 医療システム側で通知サービスAPIを実装
2. VoiceDrive側で通知設定UI追加
3. WebSocket/Server-Sent Eventsでリアルタイム通知配信
4. メール/Slack連携（オプション）

**Phase 1での代替手段**:
- マイルストーン完了時にプロジェクト詳細ページに「完了」バッジ表示
- プロジェクト一覧で完了マイルストーン数を表示
- 手動での進捗確認を前提とする

---

### ✅ 追加確認2: 高リスク追加時の自動ステータス変更

**VoiceDriveからの質問**:
> 高リスク（severity: HIGH）追加時に、プロジェクトステータスを自動で「要注意」などに変更する機能は実装しますか？

**医療システム回答**: ✅ **実装推奨（Phase 1に含める）**

**推奨理由**:
- リスク管理の自動化により、プロジェクト管理の精度が向上します
- 実装コストが低く、Phase 1に含めることが可能です
- プロジェクトマネージャーの負荷軽減に直結します

**実装仕様**:

#### API実装: POST /api/strategic-projects/{projectId}/risks/add

```typescript
// src/app/api/strategic-projects/[projectId]/risks/add/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, ProjectStatus, RiskSeverity } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const { projectId } = params;
    const body = await request.json();

    const {
      title,
      description,
      severity,
      probability,
      impact,
      mitigation
    } = body;

    // バリデーション
    if (!title || !severity) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'タイトルとリスクレベルは必須です'
          }
        },
        { status: 400 }
      );
    }

    // トランザクション実行
    const result = await prisma.$transaction(async (tx) => {
      // 1. リスクを追加
      const newRisk = await tx.projectRisk.create({
        data: {
          projectId,
          title,
          description,
          severity,
          probability,
          impact,
          mitigation,
          status: 'ACTIVE',
          identifiedDate: new Date()
        }
      });

      // 2. 高リスクの場合、プロジェクトステータスを自動変更
      let updatedProject = null;
      if (severity === 'HIGH') {
        updatedProject = await tx.strategicProject.update({
          where: { id: projectId },
          data: {
            status: 'AT_RISK', // 要注意ステータスに変更
            lastModifiedBy: 'SYSTEM_AUTO_RISK_DETECTION',
            updatedAt: new Date()
          }
        });

        // 3. 変更履歴をログ
        await tx.projectStatusChangeLog.create({
          data: {
            projectId,
            previousStatus: updatedProject.status,
            newStatus: 'AT_RISK',
            reason: `高リスク追加による自動変更: ${title}`,
            changedBy: 'SYSTEM_AUTO_RISK_DETECTION',
            changedAt: new Date()
          }
        });
      }

      return { newRisk, updatedProject };
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          risk: result.newRisk,
          project: result.updatedProject,
          autoStatusChanged: severity === 'HIGH',
          message: severity === 'HIGH'
            ? 'リスクを追加しました。高リスクのため、プロジェクトステータスを「要注意」に自動変更しました。'
            : 'リスクを追加しました。'
        },
        timestamp: new Date().toISOString()
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('[API] POST /api/strategic-projects/risks/add Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'リスク追加中にエラーが発生しました'
        }
      },
      { status: 500 }
    );
  }
}
```

#### データベーススキーマ追加

```prisma
// prisma/schema.prisma

// プロジェクトステータス変更履歴（新規追加）
model ProjectStatusChangeLog {
  id              String   @id @default(cuid())

  projectId       String   @map("project_id")
  previousStatus  ProjectStatus @map("previous_status")
  newStatus       ProjectStatus @map("new_status")
  reason          String?
  changedBy       String   @map("changed_by")
  changedAt       DateTime @default(now()) @map("changed_at")

  // Relations
  project         StrategicProject @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@index([projectId])
  @@index([changedAt])
  @@map("project_status_change_logs")
}

// StrategicProjectにRelation追加
model StrategicProject {
  // ... 既存フィールド

  // Relations
  statusChangeLogs  ProjectStatusChangeLog[]  // 追加

  // ... その他のRelations
}

// ProjectStatusにAT_RISK追加
enum ProjectStatus {
  PLANNING      // 企画中
  IN_PROGRESS   // 進行中
  ON_HOLD       // 保留
  AT_RISK       // 要注意（高リスク検出時）← 追加
  COMPLETED     // 完了
  CANCELLED     // 中止
}
```

#### VoiceDrive側UI表示例

```typescript
// VoiceDrive側での実装例

// リスク追加後のレスポンス処理
async function handleAddRisk(projectId: string, riskData: RiskInput) {
  const response = await fetch(`/api/strategic-projects/${projectId}/risks/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(riskData)
  });

  const result = await response.json();

  if (result.success && result.data.autoStatusChanged) {
    // 自動ステータス変更の通知を表示
    showNotification({
      type: 'warning',
      title: 'プロジェクトステータス自動変更',
      message: result.data.message,
      duration: 5000,
      icon: '⚠️'
    });

    // プロジェクト詳細を再取得してUI更新
    refreshProjectDetails(projectId);
  }
}
```

**自動変更ロジックの詳細**:

| リスクレベル | ステータス自動変更 | 変更後ステータス | 通知 |
|-------------|------------------|----------------|-----|
| HIGH        | ✅ Yes           | AT_RISK        | ✅ Yes |
| MEDIUM      | ❌ No            | 変更なし       | ❌ No  |
| LOW         | ❌ No            | 変更なし       | ❌ No  |

**手動でのステータス戻し**:
- プロジェクトマネージャーが手動で「進行中」に戻すことが可能
- リスクが解決（status: RESOLVED）された場合は、手動で戻す必要あり（完全自動化はPhase 2で検討）

---

## 3. 📊 最終実装仕様確定

### 3.1 データベーステーブル（6テーブル - 1テーブル追加）

VoiceDriveからの回答を踏まえ、最終的なデータベーステーブル構成を確定します。

#### 追加テーブル一覧

1. **StrategicProject** - 戦略プロジェクトマスタ
2. **ProjectMilestone** - マイルストーン管理
3. **ProjectKPI** - KPI管理
4. **ProjectRisk** - リスク管理
5. **ProjectTeamMember** - チームメンバー管理
6. **ProjectStatusChangeLog** - ステータス変更履歴（追加）← 高リスク自動変更対応

#### 完全なPrismaスキーマ

```prisma
// prisma/schema.prisma

// ================================================================================
// Phase 2.11: StrategicInitiativesPage データベーススキーマ
// ================================================================================

// 1. StrategicProject（戦略プロジェクトマスタ）
model StrategicProject {
  id                    String   @id @default(cuid())

  // 基本情報
  title                 String
  description           String?  @db.Text
  objective             String?  @db.Text

  // ステータス
  status                ProjectStatus @default(PLANNING)
  priority              ProjectPriority @default(MEDIUM)
  phase                 ProjectPhase @default(PLANNING)

  // 期間
  startDate             DateTime @map("start_date")
  endDate               DateTime @map("end_date")
  estimatedDuration     Int      @map("estimated_duration") // 日数

  // 進捗
  overallProgress       Float    @default(0) @map("overall_progress") // 0-100

  // 予算（BigInt: 大規模予算対応）
  budgetTotal           BigInt   @map("budget_total")
  budgetAllocated       BigInt   @map("budget_allocated")
  budgetSpent           BigInt   @map("budget_spent")
  budgetRemaining       BigInt   @map("budget_remaining")
  budgetUtilizationRate Float    @default(0) @map("budget_utilization_rate") // 0-100

  // プロジェクト管理
  owner                 String   // Employee ID
  teamSize              Int      @default(0) @map("team_size")

  // 分類
  category              ProjectCategory @default(OTHER)
  tags                  String[]

  // 理事会連携
  boardApprovalRequired Boolean  @default(false) @map("board_approval_required")
  boardApprovalStatus   BoardApprovalStatus? @map("board_approval_status")
  boardPresentationDate DateTime? @map("board_presentation_date")

  // メタデータ
  createdAt             DateTime @default(now()) @map("created_at")
  updatedAt             DateTime @updatedAt @map("updated_at")
  createdBy             String   @map("created_by")
  lastModifiedBy        String   @map("last_modified_by")

  // Relations
  milestones            ProjectMilestone[]
  kpis                  ProjectKPI[]
  risks                 ProjectRisk[]
  teamMembers           ProjectTeamMember[]
  statusChangeLogs      ProjectStatusChangeLog[] // 追加

  @@index([status])
  @@index([priority])
  @@index([owner])
  @@index([category])
  @@index([startDate])
  @@index([endDate])
  @@map("strategic_projects")
}

// 2. ProjectMilestone（マイルストーン）
model ProjectMilestone {
  id                String   @id @default(cuid())
  projectId         String   @map("project_id")

  title             String
  description       String?  @db.Text
  status            MilestoneStatus @default(NOT_STARTED)

  dueDate           DateTime @map("due_date")
  completedAt       DateTime? @map("completed_at")
  completionRate    Float    @default(0) @map("completion_rate") // 0-100

  // メタデータ
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")

  // Relations
  project           StrategicProject @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@index([projectId])
  @@index([status])
  @@index([dueDate])
  @@map("project_milestones")
}

// 3. ProjectKPI（KPI管理）
model ProjectKPI {
  id            String   @id @default(cuid())
  projectId     String   @map("project_id")

  name          String
  description   String?  @db.Text
  unit          String   // 単位（%, 件, 日, 円など）

  currentValue  Float    @map("current_value")
  targetValue   Float    @map("target_value")
  baselineValue Float?   @map("baseline_value")

  status        KPIStatus @default(NOT_STARTED)
  achievementRate Float  @default(0) @map("achievement_rate") // 0-100

  // 測定
  measurementFrequency String @map("measurement_frequency") // 日次、週次、月次
  lastMeasuredAt       DateTime? @map("last_measured_at")

  // メタデータ
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  // Relations
  project       StrategicProject @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@index([projectId])
  @@index([status])
  @@map("project_kpis")
}

// 4. ProjectRisk（リスク管理）
model ProjectRisk {
  id            String   @id @default(cuid())
  projectId     String   @map("project_id")

  title         String
  description   String?  @db.Text

  severity      RiskSeverity
  probability   RiskProbability
  impact        RiskImpact

  status        RiskStatus @default(ACTIVE)

  mitigation    String?  @db.Text // 対策
  contingency   String?  @db.Text // 代替案

  identifiedDate DateTime @default(now()) @map("identified_date")
  resolvedDate   DateTime? @map("resolved_date")

  // メタデータ
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  // Relations
  project       StrategicProject @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@index([projectId])
  @@index([severity])
  @@index([status])
  @@map("project_risks")
}

// 5. ProjectTeamMember（チームメンバー）
model ProjectTeamMember {
  id            String   @id @default(cuid())
  projectId     String   @map("project_id")

  employeeId    String   @map("employee_id")
  role          String   // プロジェクトマネージャー、開発リーダー、メンバーなど

  allocationRate Float   @map("allocation_rate") // 0-100（稼働率）

  joinedAt      DateTime @default(now()) @map("joined_at")
  leftAt        DateTime? @map("left_at")

  // メタデータ
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  // Relations
  project       StrategicProject @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@unique([projectId, employeeId])
  @@index([projectId])
  @@index([employeeId])
  @@map("project_team_members")
}

// 6. ProjectStatusChangeLog（ステータス変更履歴）← 追加
model ProjectStatusChangeLog {
  id              String   @id @default(cuid())

  projectId       String   @map("project_id")
  previousStatus  ProjectStatus @map("previous_status")
  newStatus       ProjectStatus @map("new_status")
  reason          String?  @db.Text
  changedBy       String   @map("changed_by") // Employee ID or "SYSTEM_AUTO_RISK_DETECTION"
  changedAt       DateTime @default(now()) @map("changed_at")

  // Relations
  project         StrategicProject @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@index([projectId])
  @@index([changedAt])
  @@map("project_status_change_logs")
}

// ================================================================================
// Enums（列挙型）
// ================================================================================

enum ProjectStatus {
  PLANNING      // 企画中
  IN_PROGRESS   // 進行中
  ON_HOLD       // 保留
  AT_RISK       // 要注意（高リスク検出時）← 追加
  COMPLETED     // 完了
  CANCELLED     // 中止
}

enum ProjectPriority {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

enum ProjectPhase {
  PLANNING      // 企画フェーズ
  DESIGN        // 設計フェーズ
  DEVELOPMENT   // 開発フェーズ
  TESTING       // テストフェーズ
  DEPLOYMENT    // 展開フェーズ
  OPERATION     // 運用フェーズ
  CLOSED        // 終了
}

enum ProjectCategory {
  DIGITAL_TRANSFORMATION    // DX推進
  QUALITY_IMPROVEMENT       // 品質改善
  COST_REDUCTION           // コスト削減
  PATIENT_SAFETY           // 患者安全
  STAFF_DEVELOPMENT        // 職員育成
  FACILITY_EXPANSION       // 施設拡張
  SYSTEM_INTEGRATION       // システム統合
  COMPLIANCE               // コンプライアンス
  OTHER                    // その他
}

enum BoardApprovalStatus {
  PENDING       // 承認待ち
  APPROVED      // 承認済み
  REJECTED      // 却下
  REVISION      // 修正要求
}

enum MilestoneStatus {
  NOT_STARTED   // 未着手
  IN_PROGRESS   // 進行中
  COMPLETED     // 完了
  DELAYED       // 遅延
  CANCELLED     // キャンセル
}

enum KPIStatus {
  NOT_STARTED   // 未測定
  ON_TRACK      // 目標達成中
  AT_RISK       // 要注意
  OFF_TRACK     // 未達成
  ACHIEVED      // 達成
}

enum RiskSeverity {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

enum RiskProbability {
  VERY_LOW      // 10%未満
  LOW           // 10-30%
  MEDIUM        // 30-60%
  HIGH          // 60-90%
  VERY_HIGH     // 90%以上
}

enum RiskImpact {
  MINIMAL       // 影響軽微
  MINOR         // 影響小
  MODERATE      // 影響中
  MAJOR         // 影響大
  SEVERE        // 影響甚大
}

enum RiskStatus {
  ACTIVE        // アクティブ
  MONITORING    // 監視中
  RESOLVED      // 解決済み
  ACCEPTED      // 受容（対策なし）
}
```

---

### 3.2 API実装仕様（7エンドポイント）

VoiceDriveからの回答を踏まえ、最終的なAPI仕様を確定します。

#### API一覧

| No. | Method | Endpoint | 機能 | Phase 1実装 |
|-----|--------|----------|------|------------|
| 1   | GET    | `/api/strategic-projects` | プロジェクト一覧取得 | ✅ Yes |
| 2   | GET    | `/api/strategic-projects/{projectId}` | プロジェクト詳細取得 | ✅ Yes |
| 3   | POST   | `/api/strategic-projects/create` | プロジェクト新規作成 | ✅ Yes |
| 4   | PATCH  | `/api/strategic-projects/{projectId}` | プロジェクト情報更新 | ✅ Yes |
| 5   | POST   | `/api/strategic-projects/{projectId}/milestones/{milestoneId}/complete` | マイルストーン完了 | ✅ Yes（通知なし） |
| 6   | POST   | `/api/strategic-projects/{projectId}/risks/add` | リスク追加 | ✅ Yes（自動ステータス変更あり） |
| 7   | PATCH  | `/api/strategic-projects/{projectId}/risks/{riskId}/resolve` | リスク解決 | ✅ Yes |

---

#### API 1: プロジェクト一覧取得

**エンドポイント**: `GET /api/strategic-projects`

**クエリパラメータ**:
```typescript
{
  status?: ProjectStatus;        // ステータスフィルタ
  priority?: ProjectPriority;    // 優先度フィルタ
  category?: ProjectCategory;    // カテゴリフィルタ
  owner?: string;                // オーナーID
  page?: number;                 // ページ番号（デフォルト: 1）
  limit?: number;                // 1ページあたりの件数（デフォルト: 20）
}
```

**レスポンス**:
```typescript
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "proj_001",
        "title": "電子カルテシステム刷新",
        "description": "現行システムの老朽化に伴う全面刷新プロジェクト",
        "status": "IN_PROGRESS",
        "priority": "HIGH",
        "phase": "DEVELOPMENT",
        "category": "DIGITAL_TRANSFORMATION",

        "startDate": "2025-01-01T00:00:00.000Z",
        "endDate": "2025-12-31T23:59:59.999Z",
        "estimatedDuration": 365,
        "overallProgress": 45.5,

        "budgetTotal": 50000000,
        "budgetAllocated": 40000000,
        "budgetSpent": 22750000,
        "budgetRemaining": 27250000,
        "budgetUtilizationRate": 56.875,

        "owner": "emp_001",
        "teamSize": 12,
        "tags": ["電子カルテ", "DX", "基幹システム"],

        "boardApprovalRequired": true,
        "boardApprovalStatus": "APPROVED",
        "boardPresentationDate": "2024-11-15T00:00:00.000Z",

        "createdAt": "2024-10-01T09:00:00.000Z",
        "updatedAt": "2025-10-26T14:30:00.000Z",
        "createdBy": "emp_001",
        "lastModifiedBy": "emp_001",

        // 集計情報（生データ）
        "milestonesSummary": {
          "total": 8,
          "completed": 3,
          "inProgress": 2,
          "notStarted": 3
        },
        "kpisSummary": {
          "total": 5,
          "onTrack": 3,
          "atRisk": 1,
          "offTrack": 1
        },
        "risksSummary": {
          "total": 4,
          "active": 2,
          "monitoring": 1,
          "resolved": 1,
          "highSeverity": 1
        }
      }
    ],
    "pagination": {
      "total": 24,
      "page": 1,
      "limit": 20,
      "totalPages": 2
    }
  },
  "timestamp": "2025-10-26T14:30:00.000Z"
}
```

**実装コード**:
```typescript
// src/app/api/strategic-projects/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, ProjectStatus, ProjectPriority, ProjectCategory } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // クエリパラメータ取得
    const status = searchParams.get('status') as ProjectStatus | null;
    const priority = searchParams.get('priority') as ProjectPriority | null;
    const category = searchParams.get('category') as ProjectCategory | null;
    const owner = searchParams.get('owner');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // フィルタ条件構築
    const where: any = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (category) where.category = category;
    if (owner) where.owner = owner;

    // ページネーション
    const skip = (page - 1) * limit;

    // データ取得
    const [projects, total] = await Promise.all([
      prisma.strategicProject.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          milestones: {
            select: {
              id: true,
              status: true
            }
          },
          kpis: {
            select: {
              id: true,
              status: true
            }
          },
          risks: {
            select: {
              id: true,
              status: true,
              severity: true
            }
          }
        }
      }),
      prisma.strategicProject.count({ where })
    ]);

    // 集計情報を計算
    const projectsWithSummary = projects.map(project => {
      const milestonesSummary = {
        total: project.milestones.length,
        completed: project.milestones.filter(m => m.status === 'COMPLETED').length,
        inProgress: project.milestones.filter(m => m.status === 'IN_PROGRESS').length,
        notStarted: project.milestones.filter(m => m.status === 'NOT_STARTED').length
      };

      const kpisSummary = {
        total: project.kpis.length,
        onTrack: project.kpis.filter(k => k.status === 'ON_TRACK').length,
        atRisk: project.kpis.filter(k => k.status === 'AT_RISK').length,
        offTrack: project.kpis.filter(k => k.status === 'OFF_TRACK').length
      };

      const risksSummary = {
        total: project.risks.length,
        active: project.risks.filter(r => r.status === 'ACTIVE').length,
        monitoring: project.risks.filter(r => r.status === 'MONITORING').length,
        resolved: project.risks.filter(r => r.status === 'RESOLVED').length,
        highSeverity: project.risks.filter(r => r.severity === 'HIGH' || r.severity === 'CRITICAL').length
      };

      // milestones, kpis, risksフィールドを除外
      const { milestones, kpis, risks, ...projectData } = project;

      return {
        ...projectData,
        milestonesSummary,
        kpisSummary,
        risksSummary
      };
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          projects: projectsWithSummary,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
          }
        },
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('[API] GET /api/strategic-projects Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'プロジェクト一覧取得中にエラーが発生しました'
        }
      },
      { status: 500 }
    );
  }
}
```

---

#### API 6: リスク追加（高リスク自動ステータス変更）

**エンドポイント**: `POST /api/strategic-projects/{projectId}/risks/add`

**リクエストボディ**:
```typescript
{
  "title": "ベンダー対応遅延",
  "description": "電子カルテベンダーの開発チーム人員不足により、要件定義の遅延リスクあり",
  "severity": "HIGH",
  "probability": "HIGH",
  "impact": "MAJOR",
  "mitigation": "週次ミーティングでの進捗確認強化。代替ベンダーの調査を開始。"
}
```

**レスポンス（高リスクの場合）**:
```typescript
{
  "success": true,
  "data": {
    "risk": {
      "id": "risk_001",
      "projectId": "proj_001",
      "title": "ベンダー対応遅延",
      "description": "電子カルテベンダーの開発チーム人員不足により、要件定義の遅延リスクあり",
      "severity": "HIGH",
      "probability": "HIGH",
      "impact": "MAJOR",
      "status": "ACTIVE",
      "mitigation": "週次ミーティングでの進捗確認強化。代替ベンダーの調査を開始。",
      "identifiedDate": "2025-10-26T14:30:00.000Z",
      "createdAt": "2025-10-26T14:30:00.000Z",
      "updatedAt": "2025-10-26T14:30:00.000Z"
    },
    "project": {
      "id": "proj_001",
      "status": "AT_RISK", // 自動変更
      "updatedAt": "2025-10-26T14:30:00.000Z",
      "lastModifiedBy": "SYSTEM_AUTO_RISK_DETECTION"
    },
    "autoStatusChanged": true,
    "message": "リスクを追加しました。高リスクのため、プロジェクトステータスを「要注意」に自動変更しました。"
  },
  "timestamp": "2025-10-26T14:30:00.000Z"
}
```

**実装コード**: 上記「追加確認2」セクションに記載

---

## 4. 📅 実装スケジュール

VoiceDriveからの回答を踏まえ、最終的な実装スケジュールを確定します。

### Phase 1実装期間: 2025年11月11日（月）〜 2025年11月20日（水）- 10日間

| 日付 | 医療システム実装内容 | VoiceDrive実装内容 | 担当 |
|------|---------------------|-------------------|------|
| **11/11（月）** | データベーススキーマ設計（6テーブル） | ページ構成設計 | 医療チーム |
| **11/12（火）** | Prisma migration実行・テストデータ投入 | UI/UXデザイン確定 | 医療チーム |
| **11/13（水）** | API 1-2実装（一覧・詳細） | プロジェクトテンプレート実装 | 両チーム |
| **11/14（木）** | API 3-4実装（作成・更新） | 統計計算ロジック実装 | 両チーム |
| **11/15（金）** | API 5実装（マイルストーン完了） | マイルストーン管理UI実装 | 両チーム |
| **11/18（月）** | API 6-7実装（リスク追加・解決）+ 自動ステータス変更ロジック | リスク管理UI実装 | 両チーム |
| **11/19（火）** | 統合テスト（7API + 自動変更ロジック） | 統合テスト | 両チーム |
| **11/20（水）** | 本番デプロイ + 動作確認 | 本番デプロイ + 動作確認 | 両チーム |

### Phase 2実装期間（提案）: 2025年12月以降

| 日付 | 実装内容 | 備考 |
|------|---------|------|
| **12月** | マイルストーン完了通知機能 | 通知サービス連携 |
| **12月** | リスク解決時の自動ステータス復元 | 完全自動化 |
| **12月** | メール/Slack通知連携 | オプション機能 |

---

## 5. 🧪 統合テストシナリオ

VoiceDriveからの回答を踏まえ、最終的な統合テストシナリオを確定します。

### テストシナリオ1: プロジェクト作成〜高リスク追加〜自動ステータス変更

**目的**: 高リスク追加時の自動ステータス変更ロジック確認

**手順**:
1. VoiceDrive: プロジェクト新規作成（status: PLANNING）
2. 医療システム: POST /api/strategic-projects/create
3. VoiceDrive: プロジェクト詳細ページ表示（status: PLANNING確認）
4. VoiceDrive: 高リスク追加（severity: HIGH）
5. 医療システム: POST /api/strategic-projects/{projectId}/risks/add
6. 医療システム: 自動でstatus: AT_RISKに変更
7. VoiceDrive: 通知表示「プロジェクトステータスを「要注意」に自動変更しました」
8. VoiceDrive: プロジェクト詳細ページ再取得（status: AT_RISK確認）

**期待結果**:
- ✅ status: PLANNING → AT_RISK 自動変更
- ✅ lastModifiedBy: SYSTEM_AUTO_RISK_DETECTION
- ✅ ProjectStatusChangeLog作成（reason: 高リスク追加による自動変更）
- ✅ VoiceDrive通知表示

---

### テストシナリオ2: 中リスク追加〜ステータス変更なし

**目的**: 中リスク追加時はステータス変更しないことを確認

**手順**:
1. VoiceDrive: 既存プロジェクト選択（status: IN_PROGRESS）
2. VoiceDrive: 中リスク追加（severity: MEDIUM）
3. 医療システム: POST /api/strategic-projects/{projectId}/risks/add
4. VoiceDrive: プロジェクト詳細ページ再取得（status: IN_PROGRESS のまま確認）

**期待結果**:
- ✅ status: IN_PROGRESS（変更なし）
- ✅ autoStatusChanged: false
- ✅ 通知表示なし

---

### テストシナリオ3: マイルストーン完了〜進捗率計算（クライアント側）

**目的**: マイルストーン完了後の進捗率計算がクライアント側で正しく行われることを確認

**手順**:
1. VoiceDrive: プロジェクト詳細ページ表示（マイルストーン5件中2件完了）
2. VoiceDrive: クライアント側で進捗率計算（2/5 = 40%）
3. VoiceDrive: マイルストーン1件完了
4. 医療システム: POST /api/strategic-projects/{projectId}/milestones/{milestoneId}/complete
5. VoiceDrive: プロジェクト詳細ページ再取得（マイルストーン5件中3件完了）
6. VoiceDrive: クライアント側で進捗率再計算（3/5 = 60%）

**期待結果**:
- ✅ 医療システムは生データのみ返却（計算なし）
- ✅ VoiceDriveクライアント側で40% → 60%に更新
- ✅ Phase 1では通知なし（Phase 2で実装）

---

### テストシナリオ4: プロジェクトテンプレート選択〜作成（VoiceDrive側管理）

**目的**: プロジェクトテンプレート機能がVoiceDrive側で完結することを確認

**手順**:
1. VoiceDrive: プロジェクトテンプレート一覧表示（ローカルストレージから取得）
2. VoiceDrive: テンプレート選択「電子カルテ刷新プロジェクト」
3. VoiceDrive: テンプレートデータをフォームに反映
4. VoiceDrive: プロジェクト作成API呼び出し
5. 医療システム: POST /api/strategic-projects/create（テンプレートIDは含まれない）

**期待結果**:
- ✅ 医療システムはテンプレートIDを受け取らない
- ✅ VoiceDrive側でテンプレート管理が完結
- ✅ 医療システムDBにはテンプレート関連テーブル不要

---

## 6. ✅ 最終確認チェックリスト

### 医療システム実装確認

- [x] データベーステーブル設計完了（6テーブル）
  - [x] StrategicProject
  - [x] ProjectMilestone
  - [x] ProjectKPI
  - [x] ProjectRisk
  - [x] ProjectTeamMember
  - [x] ProjectStatusChangeLog（追加）
- [x] API実装仕様確定（7エンドポイント）
  - [x] GET /api/strategic-projects
  - [x] GET /api/strategic-projects/{projectId}
  - [x] POST /api/strategic-projects/create
  - [x] PATCH /api/strategic-projects/{projectId}
  - [x] POST /api/strategic-projects/{projectId}/milestones/{milestoneId}/complete
  - [x] POST /api/strategic-projects/{projectId}/risks/add（自動ステータス変更）
  - [x] PATCH /api/strategic-projects/{projectId}/risks/{riskId}/resolve
- [x] VoiceDriveからの3つの確認事項に回答・承認
  - [x] テンプレート管理: VoiceDrive側
  - [x] 統計計算: クライアント側
  - [x] 予算システム: 独立管理
- [x] VoiceDriveからの2つの追加確認事項に回答
  - [x] マイルストーン通知: Phase 2実装推奨
  - [x] 高リスク自動変更: Phase 1実装推奨
- [x] 統合テストシナリオ作成（4シナリオ）
- [x] 実装スケジュール確定（11/11-11/20）

### VoiceDrive実装確認（医療システムから期待する実装）

- [ ] プロジェクトテンプレート管理（ローカルストレージ）
- [ ] 統計計算ロジック（クライアント側）
- [ ] 高リスク追加時の通知UI
- [ ] プロジェクト詳細ページ実装
- [ ] マイルストーン管理UI
- [ ] リスク管理UI

---

## 7. 📝 付録: VoiceDrive回答書（原文）

```markdown
# StrategicInitiativesPage 医療システム確認事項への回答書

**文書番号**: VD-RESP-2025-1026-001
**作成日**: 2025年10月26日
**Phase**: 2.11
**対象ページ**: StrategicInitiativesPage（戦略イニシアチブページ）
**作成者**: VoiceDrive開発チーム
**宛先**: 医療システム開発チーム

---

## 1. 確認事項への回答

### 確認事項1: プロジェクトテンプレート管理場所

**医療システムからの質問**:
> プロジェクトテンプレート管理は、VoiceDrive側で実施するか、医療システム側で実施するか？

**VoiceDrive回答**: ✅ **VoiceDrive側で管理**します

**理由**:
- 医療システムチームの提案（VoiceDrive側管理）を採用します
- プロジェクトテンプレートはUI/UX上の補助機能であり、VoiceDrive側でReact Context + ローカルストレージで管理することで、医療システムの実装負荷を軽減できます
- テンプレートは実データではなく、あくまで入力補助のため、永続化する必要性は低いと判断しました

**実装方針**:
```typescript
// VoiceDrive側で実装予定のテンプレート管理

// src/contexts/ProjectTemplateContext.tsx
interface ProjectTemplate {
  id: string;
  name: string;
  category: ProjectCategory;
  defaultBudget: number;
  defaultDuration: number;
  milestones: { title: string; description: string }[];
  kpis: { name: string; unit: string; targetValue: number }[];
}

const defaultTemplates: ProjectTemplate[] = [
  {
    id: "template_001",
    name: "電子カルテ刷新プロジェクト",
    category: "DIGITAL_TRANSFORMATION",
    defaultBudget: 50000000,
    defaultDuration: 365,
    milestones: [
      { title: "要件定義完了", description: "ベンダーとの要件定義" },
      { title: "設計完了", description: "システム設計書承認" }
    ],
    kpis: [
      { name: "システム稼働率", unit: "%", targetValue: 99.9 }
    ]
  }
];

// ローカルストレージに保存
localStorage.setItem('projectTemplates', JSON.stringify(defaultTemplates));
```

---

### 確認事項2: 統計情報計算場所

**医療システムからの質問**:
> 統計情報（全体進捗率、予算執行率など）の計算は、クライアント側で実施するか、サーバー側APIで計算するか？

**VoiceDrive回答**: ✅ **クライアント側（VoiceDrive）で計算**します

**理由**:
- 医療システムチームの提案（クライアント側計算）を採用します
- サーバー負荷の軽減が可能です
- VoiceDrive側で柔軟なUI表示調整が可能になります
- 医療システムAPIはシンプルな生データ返却のみで済みます

**実装方針**:
```typescript
// VoiceDrive側で実装予定の統計計算ロジック

// src/utils/projectStats.ts
export function calculateProjectStats(projects: StrategicProject[]) {
  const totalProjects = projects.length;

  // プロジェクト完了率
  const completedProjects = projects.filter(p => p.status === 'COMPLETED').length;
  const completionRate = (completedProjects / totalProjects) * 100;

  // 予算執行率（全体）
  const totalBudget = projects.reduce((sum, p) => sum + Number(p.budgetTotal), 0);
  const totalSpent = projects.reduce((sum, p) => sum + Number(p.budgetSpent), 0);
  const avgBudgetUtilization = (totalSpent / totalBudget) * 100;

  // 平均進捗率
  const avgProgress = projects.reduce((sum, p) => sum + p.overallProgress, 0) / totalProjects;

  // リスク統計
  const totalRisks = projects.reduce((sum, p) => sum + p.risksSummary.total, 0);
  const highRisks = projects.reduce((sum, p) => sum + p.risksSummary.highSeverity, 0);

  return {
    totalProjects,
    completedProjects,
    completionRate: Math.round(completionRate * 10) / 10,
    avgBudgetUtilization: Math.round(avgBudgetUtilization * 10) / 10,
    avgProgress: Math.round(avgProgress * 10) / 10,
    totalRisks,
    highRisks
  };
}
```

---

### 確認事項3: 既存予算管理システムの有無

**医療システムからの質問**:
> 医療システムに既存の予算管理システムは存在するか？既存システムとの統合が必要か？

**VoiceDrive回答**: ✅ **既存システムは存在しません。StrategicProjectテーブルで独立管理を推奨します**

**理由**:
- 医療システムに既存の予算管理システムは存在しないことを確認しました
- 医療システムチームの提案（StrategicProjectテーブルで独立管理）を採用します
- 将来的な拡張性も確保されており、Phase 1では独立管理で問題ないと判断しました

**実装方針**:
- 医療システムのStrategicProjectテーブルで予算管理を完結
- VoiceDrive側では生データを受け取り、UI表示のみ実施
- 将来的に既存予算システムが導入された場合は、budgetSystemIdフィールド追加でリンク可能

---

## 2. VoiceDriveからの追加確認事項

医療システムチームへの2つの追加確認事項です。

### 追加確認1: マイルストーン完了時の通知機能実装

**VoiceDriveからの質問**:
> マイルストーン完了時の通知機能は実装しますか？
> 実装する場合、通知サービスとの連携が必要になります。

**VoiceDrive提案**:
- Phase 1では通知機能は実装せず、マイルストーン完了API実装のみ
- Phase 2（12月以降）で通知サービス連携を実装
- 通知方法: WebSocket/Server-Sent Events + メール/Slack連携（オプション）

**医療システムチームへの確認**:
- Phase 2での通知機能実装に同意いただけますか？
- 通知サービスAPIの実装は医療システム側で実施可能ですか？

---

### 追加確認2: 高リスク追加時の自動ステータス変更

**VoiceDriveからの質問**:
> 高リスク（severity: HIGH）追加時に、プロジェクトステータスを自動で「要注意」などに変更する機能は実装しますか？

**VoiceDrive提案**:
- 実装推奨（Phase 1に含める）
- リスク管理の自動化により、プロジェクト管理の精度が向上
- 実装コストが低く、Phase 1に含めることが可能

**実装イメージ**:
```typescript
// リスク追加API（医療システム側）
// POST /api/strategic-projects/{projectId}/risks/add

// 高リスク（severity: HIGH）が追加された場合
if (severity === 'HIGH') {
  // プロジェクトステータスを自動変更
  await prisma.strategicProject.update({
    where: { id: projectId },
    data: {
      status: 'AT_RISK', // 要注意
      lastModifiedBy: 'SYSTEM_AUTO_RISK_DETECTION'
    }
  });
}
```

**医療システムチームへの確認**:
- この自動ステータス変更機能をPhase 1に含めることに同意いただけますか？
- ProjectStatusにAT_RISK（要注意）を追加することに問題ありませんか？

---

## 3. まとめ

### VoiceDrive側実装予定（Phase 1: 11/11-11/20）

1. ✅ プロジェクトテンプレート管理（ローカルストレージ）
2. ✅ 統計計算ロジック（クライアント側）
3. ✅ プロジェクト一覧・詳細ページUI
4. ✅ マイルストーン管理UI
5. ✅ リスク管理UI
6. ✅ 高リスク追加時の通知UI（医療システムの自動変更に対応）

### 医療システムへの期待実装（Phase 1: 11/11-11/20）

1. ✅ データベーステーブル追加（6テーブル）
2. ✅ API実装（7エンドポイント）
3. ❓ 高リスク自動ステータス変更ロジック（追加確認2への回答待ち）

### Phase 2実装予定（12月以降）

1. ❓ マイルストーン完了通知機能（追加確認1への回答待ち）
2. リスク解決時の自動ステータス復元
3. メール/Slack通知連携（オプション）

---

**次のアクション**:
- 医療システムチームから追加確認1・2への回答を受領
- 最終確認書の作成
- 実装開始（11/11）

以上
```

---

## 8. 次のアクション

1. **医療システム**: 本最終確認書をVoiceDriveチームに送付
2. **VoiceDrive**: 最終確認書を確認・承認
3. **両チーム**: 実装開始（2025年11月11日）
4. **医療システム**: マスタープラン更新（Version 2.44）

---

**作成者**: 医療システム開発チーム
**承認**: 未承認（VoiceDriveチーム承認待ち）
**最終更新日**: 2025年10月26日

以上
