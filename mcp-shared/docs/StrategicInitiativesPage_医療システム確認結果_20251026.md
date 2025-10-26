# StrategicInitiativesPage 医療システム確認結果報告書

**文書番号**: MED-CONF-2025-1026-011
**作成日**: 2025年10月26日
**作成者**: ClaudeCode（医療システムチーム）
**件名**: StrategicInitiativesPage暫定マスターリストの医療システム側確認結果

---

## 📋 エグゼクティブサマリー

VoiceDriveチームからの「StrategicInitiativesPage暫定マスターリスト」に対する回答です。
StrategicInitiativesPageは**VoiceDrive側のUIページ**ですが、戦略プロジェクトデータは**医療システムが100%管理**します。

### 結論
- ✅ **データベース実装**: 医療システム側に5テーブル追加が必要
- ✅ **API実装**: 7つのAPI実装が必要（プロジェクト管理、進捗管理、リスク管理）
- ✅ **データ管理責任**: 医療システム100%（予算・理事会連携含む）
- ⚠️ **VoiceDrive側**: DB追加不要（医療システムから取得のみ）

### データ管理責任分界点

| データ種別 | 医療システム | VoiceDrive |
|---------|------------|-----------|
| プロジェクト基本データ | ✅ 100%管理 | 表示のみ |
| 予算データ | ✅ 100%管理 | 表示のみ |
| マイルストーン | ✅ 100%管理 | 表示・完了マーク送信 |
| KPI | ✅ 100%管理 | 表示のみ |
| リスク | ✅ 100%管理 | 表示・追加/解決送信 |
| チームメンバー | ✅ 100%管理（Employeeテーブル参照） | 表示のみ |
| 理事会連携 | ✅ 100%管理 | 表示のみ |
| プロジェクトテンプレート | - | VoiceDrive管理 |
| UI設定（ソート順等） | - | VoiceDrive管理 |

**重要原則**:
- 戦略プロジェクトは経営・予算管理の中核データ → 医療システムがSingle Source of Truth
- VoiceDriveは「表示・操作UI」のみ提供
- 予算データは医療システムの既存予算管理システムと統合
- チームメンバーは既存Employee

テーブル参照

### 推定実装時間
- **データベース実装**: 2日（16時間）
  - 5テーブル作成、マイグレーション
- **API実装**: 3日（24時間）
  - 7エンドポイント実装、テスト
- **合計**: 5日（40時間）

---

## 1. データベース要件

### 1.1 VoiceDrive側テーブル

#### ❌ 新規テーブル不要

**理由**:
- StrategicInitiativesPageはVoiceDrive側のUIだが、データ管理は医療システム
- データ管理責任分界点の原則: 戦略プロジェクト・予算は医療システムの管轄
- VoiceDrive側は「表示・選択」のみで、データ永続化は不要
- Single Source of Truth: 医療システムが一元管理

**VoiceDriveの利用方法**:
- 医療システムAPIを呼び出してデータ取得のみ
- VoiceDrive側では**データを書き込まない**

### 1.2 医療システム側テーブル（新規追加必要）

#### StrategicProject（新規）

**実装状況**: ❌ **未実装**（schema.prismaに存在しない）

**必要なスキーマ**:

```prisma
// 戦略プロジェクトマスタ
model StrategicProject {
  id                    String   @id @default(cuid())

  // 基本情報
  title                 String   // プロジェクトタイトル
  description           String?  // 説明
  objective             String?  // 目標

  // ステータス
  status                ProjectStatus @default(PLANNING)
  priority              ProjectPriority @default(MEDIUM)
  phase                 ProjectPhase @default(PLANNING)

  // 期間
  startDate             DateTime @map("start_date")
  endDate               DateTime @map("end_date")
  estimatedDuration     Int      @map("estimated_duration") // 月数

  // 進捗
  overallProgress       Float    @default(0) @map("overall_progress") // 0-100

  // 予算（BigInt: 大規模予算対応）
  budgetTotal           BigInt   @map("budget_total")
  budgetAllocated       BigInt   @map("budget_allocated")
  budgetSpent           BigInt   @map("budget_spent")
  budgetRemaining       BigInt   @map("budget_remaining")
  budgetUtilizationRate Float    @default(0) @map("budget_utilization_rate") // 0-100

  // プロジェクト管理
  owner                 String   // 責任者（職員ID）
  teamSize              Int      @default(0) @map("team_size")

  // 分類
  category              ProjectCategory @default(OTHER)
  tags                  String[] // 複数タグ

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

  @@index([status])
  @@index([priority])
  @@index([owner])
  @@index([category])
  @@index([startDate])
  @@index([endDate])
  @@map("strategic_projects")
}

// Enums
enum ProjectStatus {
  PLANNING    @map("planning")
  IN_PROGRESS @map("in_progress")
  AT_RISK     @map("at_risk")
  ON_HOLD     @map("on_hold")
  COMPLETED   @map("completed")
  CANCELLED   @map("cancelled")
}

enum ProjectPriority {
  CRITICAL @map("critical")
  HIGH     @map("high")
  MEDIUM   @map("medium")
  LOW      @map("low")
}

enum ProjectPhase {
  INITIATION  @map("initiation")
  PLANNING    @map("planning")
  EXECUTION   @map("execution")
  MONITORING  @map("monitoring")
  CLOSURE     @map("closure")
}

enum ProjectCategory {
  FACILITY  @map("facility")
  HR        @map("hr")
  DIGITAL   @map("digital")
  QUALITY   @map("quality")
  COMMUNITY @map("community")
  FINANCE   @map("finance")
  OTHER     @map("other")
}

enum BoardApprovalStatus {
  PENDING  @map("pending")
  APPROVED @map("approved")
  REJECTED @map("rejected")
}
```

**確認結果**: ❌ 未実装、新規追加が必要

---

#### ProjectMilestone（新規）

**実装状況**: ❌ **未実装**

**必要なスキーマ**:

```prisma
// プロジェクトマイルストーン
model ProjectMilestone {
  id             String    @id @default(cuid())
  projectId      String    @map("project_id")

  // 基本情報
  title          String
  description    String?

  // スケジュール
  targetDate     DateTime  @map("target_date")
  completedDate  DateTime? @map("completed_date")

  // ステータス
  status         MilestoneStatus @default(PENDING)
  completionRate Float     @default(0) @map("completion_rate") // 0-100

  // メタデータ
  createdAt      DateTime  @default(now()) @map("created_at")
  updatedAt      DateTime  @updatedAt @map("updated_at")

  // Relations
  project        StrategicProject @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@index([projectId])
  @@index([status])
  @@index([targetDate])
  @@map("project_milestones")
}

enum MilestoneStatus {
  PENDING     @map("pending")
  IN_PROGRESS @map("in_progress")
  COMPLETED   @map("completed")
  DELAYED     @map("delayed")
}
```

---

#### ProjectKPI（新規）

**実装状況**: ❌ **未実装**

**必要なスキーマ**:

```prisma
// プロジェクトKPI
model ProjectKPI {
  id        String @id @default(cuid())
  projectId String @map("project_id")

  // KPI情報
  name      String
  target    Float  // 目標値
  current   Float  // 現在値
  unit      String // 単位（%、件、円等）
  trend     KPITrend @default(STABLE)

  // メタデータ
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  // Relations
  project   StrategicProject @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@index([projectId])
  @@map("project_kpis")
}

enum KPITrend {
  UP     @map("up")
  DOWN   @map("down")
  STABLE @map("stable")
}
```

---

#### ProjectRisk（新規）

**実装状況**: ❌ **未実装**

**必要なスキーマ**:

```prisma
// プロジェクトリスク
model ProjectRisk {
  id          String @id @default(cuid())
  projectId   String @map("project_id")

  // リスク情報
  title       String
  description String?
  level       RiskLevel
  probability RiskProbability
  impact      RiskImpact

  // 対策
  mitigation  String? // 対策内容
  owner       String  // 担当者（職員ID）
  status      RiskStatus @default(IDENTIFIED)

  // メタデータ
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  // Relations
  project     StrategicProject @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@index([projectId])
  @@index([level])
  @@index([status])
  @@map("project_risks")
}

enum RiskLevel {
  HIGH   @map("high")
  MEDIUM @map("medium")
  LOW    @map("low")
}

enum RiskProbability {
  HIGH   @map("high")
  MEDIUM @map("medium")
  LOW    @map("low")
}

enum RiskImpact {
  HIGH   @map("high")
  MEDIUM @map("medium")
  LOW    @map("low")
}

enum RiskStatus {
  IDENTIFIED @map("identified")
  MITIGATING @map("mitigating")
  RESOLVED   @map("resolved")
}
```

---

#### ProjectTeamMember（新規）

**実装状況**: ❌ **未実装**

**必要なスキーマ**:

```prisma
// プロジェクトチームメンバー
model ProjectTeamMember {
  id         String @id @default(cuid())
  projectId  String @map("project_id")
  employeeId String @map("employee_id")

  // チーム情報
  role       String // プロジェクト内の役割
  commitment Int    @default(0) // 稼働率（%）

  // メタデータ
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")

  // Relations
  project    StrategicProject @relation(fields: [projectId], references: [id], onDelete: Cascade)
  employee   Employee         @relation(fields: [employeeId], references: [id])

  @@unique([projectId, employeeId])
  @@index([projectId])
  @@index([employeeId])
  @@map("project_team_members")
}
```

**注意**: Employeeテーブルに `projectTeamMembers ProjectTeamMember[]` リレーション追加が必要

---

## 2. API実装要件

### 2.1 必須API（7件）

#### API-1: プロジェクト一覧取得API

**エンドポイント**: `GET /api/v2/strategic-projects`

**リクエスト**:
```http
GET /api/v2/strategic-projects?status=in_progress&priority=high HTTP/1.1
Authorization: Bearer {token}
```

**クエリパラメータ**:
```typescript
{
  status?: 'planning' | 'in_progress' | 'at_risk' | 'on_hold' | 'completed' | 'cancelled'
  priority?: 'critical' | 'high' | 'medium' | 'low'
  category?: 'facility' | 'hr' | 'digital' | 'quality' | 'community' | 'finance' | 'other'
}
```

**レスポンス（成功）**:
```json
{
  "success": true,
  "projects": [
    {
      "id": "proj-001",
      "title": "電子カルテシステムDX推進プロジェクト",
      "description": "...",
      "objective": "医療DXによる業務効率化と医療品質向上",
      "status": "in_progress",
      "priority": "critical",
      "phase": "execution",
      "startDate": "2024-04-01",
      "endDate": "2026-03-31",
      "estimatedDuration": 24,
      "overallProgress": 45,
      "budget": {
        "total": 500000000,
        "allocated": 400000000,
        "spent": 180000000,
        "remaining": 220000000,
        "utilizationRate": 45
      },
      "owner": "EMP-001",
      "teamSize": 15,
      "category": "digital",
      "tags": ["DX", "電子カルテ", "医療品質"],
      "boardApprovalRequired": true,
      "boardApprovalStatus": "approved",
      "boardPresentationDate": "2024-03-15",
      "milestones": [
        {
          "id": "ms-001",
          "title": "システム要件定義完了",
          "description": "...",
          "targetDate": "2024-06-30",
          "completedDate": "2024-06-28",
          "status": "completed",
          "completionRate": 100
        }
      ],
      "kpis": [
        {
          "id": "kpi-001",
          "name": "カルテ入力時間削減",
          "target": 50,
          "current": 35,
          "unit": "%",
          "trend": "up"
        }
      ],
      "risks": [
        {
          "id": "risk-001",
          "title": "システム移行時の業務停止リスク",
          "description": "...",
          "level": "high",
          "probability": "medium",
          "impact": "high",
          "mitigation": "段階的移行計画の策定",
          "owner": "EMP-002",
          "status": "mitigating"
        }
      ],
      "teamMembers": [
        {
          "id": "tm-001",
          "employeeId": "EMP-001",
          "name": "山田 太郎",
          "role": "プロジェクトマネージャー",
          "department": "情報システム部",
          "commitment": 80
        }
      ],
      "createdAt": "2024-04-01T00:00:00Z",
      "updatedAt": "2025-10-26T10:00:00Z"
    }
  ],
  "stats": {
    "totalProjects": 5,
    "inProgressProjects": 3,
    "averageProgress": 52,
    "onTimeCompletionRate": 85,
    "totalBudget": 1200000000,
    "budgetUtilizationRate": 48,
    "atRiskProjects": 1
  }
}
```

**実装場所**: `src/app/api/v2/strategic-projects/route.ts`（新規）

**実装要件**:
1. StrategicProjectテーブルから取得
2. フィルタリング: status, priority, category
3. 関連データ取得（milestones, kpis, risks, teamMembers）
4. 統計情報計算（クライアント側でも可能）
5. 認可: Level 13以上（院長・施設長）
6. レスポンス整形

**推定工数**: 0.5日（4時間）

---

#### API-2: プロジェクト詳細取得API

**エンドポイント**: `GET /api/v2/strategic-projects/:id`

**リクエスト**:
```http
GET /api/v2/strategic-projects/proj-001 HTTP/1.1
Authorization: Bearer {token}
```

**レスポンス（成功）**:
```json
{
  "success": true,
  "project": {
    // API-1と同じ構造（1プロジェクトのみ）
  }
}
```

**実装場所**: `src/app/api/v2/strategic-projects/[id]/route.ts`（新規）

**実装要件**:
1. StrategicProjectテーブルから取得（IDで検索）
2. 全関連データ取得（milestones, kpis, risks, teamMembers）
3. 認可: Level 13以上
4. エラーハンドリング（404 Not Found）

**推定工数**: 0.25日（2時間）

---

#### API-3: プロジェクト作成API

**エンドポイント**: `POST /api/v2/strategic-projects`

**リクエスト**:
```json
{
  "title": "人材育成改革プロジェクト",
  "description": "次世代リーダー育成プログラムの構築",
  "objective": "5年後の管理職候補を30名育成",
  "priority": "high",
  "startDate": "2025-04-01",
  "endDate": "2027-03-31",
  "estimatedDuration": 24,
  "budgetTotal": 80000000,
  "owner": "EMP-003",
  "teamSize": 8,
  "category": "hr",
  "tags": ["人材育成", "リーダーシップ"],
  "boardApprovalRequired": true,
  "milestones": [
    {
      "title": "研修プログラム策定",
      "description": "...",
      "targetDate": "2025-06-30"
    }
  ],
  "kpis": [
    {
      "name": "育成対象者数",
      "target": 30,
      "current": 0,
      "unit": "名"
    }
  ],
  "teamMembers": [
    {
      "employeeId": "EMP-003",
      "role": "プロジェクトリーダー",
      "commitment": 50
    }
  ]
}
```

**レスポンス（成功）**:
```json
{
  "success": true,
  "project": {
    "id": "proj-006",
    // ... 作成されたプロジェクト全データ
  },
  "message": "プロジェクトを作成しました"
}
```

**実装場所**: `src/app/api/v2/strategic-projects/route.ts`（POST handler）

**実装要件**:
1. バリデーション（必須フィールド、予算範囲等）
2. StrategicProject作成
3. 関連データ作成（milestones, kpis, teamMembers）
4. 予算初期化（allocated=total, spent=0, remaining=total）
5. overallProgress=0
6. createdBy, lastModifiedBy設定
7. 監査ログ記録

**推定工数**: 0.75日（6時間）

---

#### API-4: プロジェクト更新API

**エンドポイント**: `PATCH /api/v2/strategic-projects/:id`

**リクエスト**:
```json
{
  "title": "電子カルテシステムDX推進プロジェクト（改訂版）",
  "status": "at_risk",
  "overallProgress": 48,
  "budgetSpent": 200000000
}
```

**レスポンス（成功）**:
```json
{
  "success": true,
  "project": {
    // 更新後のプロジェクト全データ
  },
  "message": "プロジェクトを更新しました"
}
```

**実装場所**: `src/app/api/v2/strategic-projects/[id]/route.ts`（PATCH handler）

**実装要件**:
1. 部分更新対応（PATCHメソッド）
2. バリデーション
3. 予算再計算（budgetSpent更新時）
4. lastModifiedBy更新
5. 監査ログ記録

**推定工数**: 0.5日（4時間）

---

#### API-5: マイルストーン完了API

**エンドポイント**: `POST /api/v2/strategic-projects/:id/milestones/:milestoneId/complete`

**リクエスト**:
```json
{
  "completedDate": "2025-10-26"
}
```

**レスポンス（成功）**:
```json
{
  "success": true,
  "milestone": {
    "id": "ms-002",
    "title": "ベンダー選定完了",
    "status": "completed",
    "completedDate": "2025-10-26",
    "completionRate": 100
  },
  "project": {
    "id": "proj-001",
    "overallProgress": 52  // 再計算後
  },
  "message": "マイルストーンを完了しました"
}
```

**実装場所**: `src/app/api/v2/strategic-projects/[id]/milestones/[milestoneId]/complete/route.ts`（新規）

**実装要件**:
1. ProjectMilestone更新（status=completed, completedDate, completionRate=100）
2. StrategicProject.overallProgress再計算（完了マイルストーン数/総マイルストーン数 × 100）
3. 監査ログ記録

**推定工数**: 0.25日（2時間）

---

#### API-6: リスク追加API

**エンドポイント**: `POST /api/v2/strategic-projects/:id/risks`

**リクエスト**:
```json
{
  "title": "予算超過リスク",
  "description": "ベンダー追加要求による予算超過の可能性",
  "level": "high",
  "probability": "medium",
  "impact": "high",
  "mitigation": "予算予備費の確保、ベンダー交渉",
  "owner": "EMP-001"
}
```

**レスポンス（成功）**:
```json
{
  "success": true,
  "risk": {
    "id": "risk-002",
    "projectId": "proj-001",
    // ... リスク全データ
  },
  "message": "リスクを追加しました"
}
```

**実装場所**: `src/app/api/v2/strategic-projects/[id]/risks/route.ts`（POST handler）

**実装要件**:
1. ProjectRisk作成
2. StrategicProject.status更新（high riskの場合はstatus=at_riskに変更検討）
3. 監査ログ記録

**推定工数**: 0.25日（2時間）

---

#### API-7: リスク解決API

**エンドポイント**: `PATCH /api/v2/strategic-projects/:id/risks/:riskId`

**リクエスト**:
```json
{
  "status": "resolved",
  "mitigation": "予算予備費を確保し、ベンダーと合意"
}
```

**レスポンス（成功）**:
```json
{
  "success": true,
  "risk": {
    "id": "risk-002",
    "status": "resolved",
    // ...
  },
  "message": "リスクを解決しました"
}
```

**実装場所**: `src/app/api/v2/strategic-projects/[id]/risks/[riskId]/route.ts`（PATCH handler）

**実装要件**:
1. ProjectRisk更新（status, mitigation）
2. 監査ログ記録

**推定工数**: 0.25日（2時間）

---

### 2.2 API実装サマリー

| API | エンドポイント | メソッド | 実装状況 | 推定工数 |
|-----|-------------|---------|---------|---------|
| プロジェクト一覧取得 | /api/v2/strategic-projects | GET | ❌ 未実装 | 0.5日 |
| プロジェクト詳細取得 | /api/v2/strategic-projects/:id | GET | ❌ 未実装 | 0.25日 |
| プロジェクト作成 | /api/v2/strategic-projects | POST | ❌ 未実装 | 0.75日 |
| プロジェクト更新 | /api/v2/strategic-projects/:id | PATCH | ❌ 未実装 | 0.5日 |
| マイルストーン完了 | /api/v2/strategic-projects/:id/milestones/:mid/complete | POST | ❌ 未実装 | 0.25日 |
| リスク追加 | /api/v2/strategic-projects/:id/risks | POST | ❌ 未実装 | 0.25日 |
| リスク解決 | /api/v2/strategic-projects/:id/risks/:rid | PATCH | ❌ 未実装 | 0.25日 |
| **合計** | - | - | - | **2.75日** |

---

## 3. VoiceDrive側の不足実装

### 3.1 クライアント側API関数

#### ❌ デモデータから実APIへの切り替え

**ファイル**: `src/services/StrategicProjectService.ts`（VoiceDrive側）

**現状**: デモデータのみ（メモリ内）

**必要な修正**:
```typescript
// Before（デモデータ）
export async function getStrategicProjects(): Promise<StrategicProject[]> {
  return demoProjects;  // メモリ内のデモデータ
}

// After（実API）
export async function getStrategicProjects(params?: {
  status?: string;
  priority?: string;
  category?: string;
}): Promise<StrategicProject[]> {
  const queryString = new URLSearchParams(params || {}).toString();
  const response = await fetch(`${MEDICAL_SYSTEM_API_URL}/api/v2/strategic-projects?${queryString}`, {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('プロジェクト一覧の取得に失敗しました');
  }

  const data = await response.json();
  return data.projects;
}

export async function getStrategicProject(id: string): Promise<StrategicProject> {
  const response = await fetch(`${MEDICAL_SYSTEM_API_URL}/api/v2/strategic-projects/${id}`, {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('プロジェクト詳細の取得に失敗しました');
  }

  const data = await response.json();
  return data.project;
}

export async function createStrategicProject(project: CreateProjectRequest): Promise<StrategicProject> {
  const response = await fetch(`${MEDICAL_SYSTEM_API_URL}/api/v2/strategic-projects`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(project)
  });

  if (!response.ok) {
    throw new Error('プロジェクトの作成に失敗しました');
  }

  const data = await response.json();
  return data.project;
}

export async function completeMilestone(projectId: string, milestoneId: string, completedDate: string): Promise<void> {
  const response = await fetch(`${MEDICAL_SYSTEM_API_URL}/api/v2/strategic-projects/${projectId}/milestones/${milestoneId}/complete`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ completedDate })
  });

  if (!response.ok) {
    throw new Error('マイルストーンの完了処理に失敗しました');
  }
}

export async function addRisk(projectId: string, risk: CreateRiskRequest): Promise<ProjectRisk> {
  const response = await fetch(`${MEDICAL_SYSTEM_API_URL}/api/v2/strategic-projects/${projectId}/risks`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(risk)
  });

  if (!response.ok) {
    throw new Error('リスクの追加に失敗しました');
  }

  const data = await response.json();
  return data.risk;
}
```

**推定工数**: 1日（8時間）

---

## 4. セキュリティ要件

### 4.1 アクセス制御

#### VoiceDrive側
- **認証**: JWT認証（実装予定）
- **認可**: Level 13以上（院長・施設長）のみアクセス可能
  - ProtectedRoute実装済み

#### 医療システム側
- **API認証**: Bearer Token（既存実装）
- **認可**:
  - プロジェクト一覧取得: Level 13以上
  - プロジェクト作成: Level 13以上
  - プロジェクト更新: Level 13以上（プロジェクトオーナーまたは院長）
  - マイルストーン完了: Level 13以上（プロジェクトメンバー）
  - リスク追加・解決: Level 13以上（プロジェクトメンバー）

### 4.2 データ保護

- **転送中**: HTTPS（本番環境）
- **予算データ**: 高度な機密情報として扱う（暗号化、アクセス制御）
- **ログ記録**: 全操作を監査ログに記録（AuditLogテーブル）

### 4.3 タイムアウト

- **VoiceDrive → 医療システム**: 30秒タイムアウト
- **データベースクエリ**: 10秒タイムアウト

---

## 5. パフォーマンス要件

### 5.1 レスポンスタイム

| API | 目標レスポンスタイム | 許容最大時間 |
|-----|------------------|------------|
| プロジェクト一覧取得 | < 2秒 | 5秒 |
| プロジェクト詳細取得 | < 1秒 | 3秒 |
| プロジェクト作成 | < 3秒 | 10秒 |
| マイルストーン完了 | < 1秒 | 3秒 |
| リスク追加 | < 1秒 | 3秒 |

### 5.2 キャッシュ戦略

#### VoiceDrive側
- **プロジェクト一覧**: 5分間キャッシュ（メモリ内）
  - 理由: 統計情報計算の負荷軽減
  - 無効化: プロジェクト作成後、更新後

#### 医療システム側
- **統計情報**: 計算結果をキャッシュ（Redis）
  - 有効期限: 5分
  - 無効化: プロジェクト作成/更新時

### 5.3 ページネーション

- **現状**: 全件表示（プロジェクト数が少ない想定）
- **将来**: プロジェクト数が50件を超える場合、ページネーション実装検討

---

## 6. 実装優先度

### 🔴 Phase 1（高優先度・必須）

**期間**: 2025年11月11日（月）〜 11月20日（水）（7営業日）

| 作業内容 | 担当 | 推定工数 | 状態 |
|---------|------|---------|------|
| DBスキーマ作成（5テーブル） | 医療システム | 1日 | ⏳ 待機中 |
| マイグレーション実行 | 医療システム | 0.5日 | ⏳ 待機中 |
| API-1実装（一覧取得） | 医療システム | 0.5日 | ⏳ 待機中 |
| API-2実装（詳細取得） | 医療システム | 0.25日 | ⏳ 待機中 |
| VoiceDrive側API統合 | VoiceDrive | 1日 | ⏳ 待機中 |
| 統合テスト | 両チーム | 0.5日 | ⏳ 待機中 |

**合計**: 3.75日（30時間）

### 🟡 Phase 2（中優先度・推奨）

**期間**: TBD（Phase 1完了後）

| 作業内容 | 担当 | 推定工数 |
|---------|------|---------|
| API-3実装（プロジェクト作成） | 医療システム | 0.75日 |
| API-4実装（プロジェクト更新） | 医療システム | 0.5日 |
| API-5実装（マイルストーン完了） | 医療システム | 0.25日 |
| API-6実装（リスク追加） | 医療システム | 0.25日 |
| API-7実装（リスク解決） | 医療システム | 0.25日 |
| 新規プロジェクト作成フォーム実装 | VoiceDrive | 1日 |
| プロジェクトテンプレート管理UI | VoiceDrive | 0.5日 |

**合計**: 3.5日（28時間）

### 🟢 Phase 3（低優先度・オプション）

| 作業内容 | 担当 | 推定工数 |
|---------|------|---------|
| プロジェクト編集機能 | VoiceDrive | 1日 |
| 統計情報の高度化 | 医療システム | 0.5日 |
| ページネーション実装 | VoiceDrive | 0.5日 |
| 予算管理システム統合 | 医療システム | 2日 |

---

## 7. VoiceDriveチームへの確認事項

### 質問1: プロジェクトテンプレートの管理

**質問**:
プロジェクトテンプレート（DX推進、地域医療拠点化等）はVoiceDrive側で管理しますか？それとも医療システム側で管理しますか？

**背景**:
- VoiceDrive側: UIに直接組み込み（簡単、柔軟性低）
- 医療システム側: DBで管理（拡張性高、管理が複雑）

**医療システムの推奨**: VoiceDrive側で管理（テンプレートはUI層の機能）

### 質問2: 統計情報の計算場所

**質問**:
統計情報（総プロジェクト数、平均進捗率等）はクライアント側で計算しますか？それともサーバー側で計算しますか？

**選択肢**:
1. **クライアント側計算**（推奨）: プロジェクト一覧取得後、VoiceDriveで計算
2. **サーバー側計算**: 医療システムAPI側で計算してレスポンス

**医療システムの推奨**: クライアント側計算（プロジェクト数が少ない想定）

### 質問3: 予算管理システムとの統合

**質問**:
医療システムに既存の予算管理システムはありますか？

**影響**:
- **あり**: StrategicProject.budget* フィールドは既存システムから取得
- **なし**: StrategicProjectテーブルで独立管理

**医療システムの確認**: 既存予算管理システムの有無を確認中

---

## 8. 関連ドキュメント

1. [StrategicInitiativesPage暫定マスターリスト](./StrategicInitiativesPage暫定マスターリスト_20251026.md) - VoiceDriveからの要件定義
2. [StrategicInitiativesPage DB要件分析](./StrategicInitiativesPage_DB要件分析_20251026.md) - VoiceDrive側のDB分析
3. [organization-analytics_医療システム確認結果_20251010.md](./organization-analytics_医療システム確認結果_20251010.md) - 参考: 組織分析ページの確認結果
4. [prisma/schema.prisma](../../prisma/schema.prisma) - 医療システムDBスキーマ（StrategicProject未実装確認済み）

---

## 9. まとめ

### データ管理責任の明確化

| データ | 医療システム | VoiceDrive |
|-------|------------|-----------|
| プロジェクト基本データ | ✅ 100%管理（StrategicProject） | 表示のみ |
| 予算データ | ✅ 100%管理 | 表示のみ |
| マイルストーン | ✅ 100%管理（ProjectMilestone） | 表示・完了マーク送信 |
| KPI | ✅ 100%管理（ProjectKPI） | 表示のみ |
| リスク | ✅ 100%管理（ProjectRisk） | 表示・追加/解決送信 |
| チームメンバー | ✅ 100%管理（ProjectTeamMember + Employee） | 表示のみ |
| 理事会連携 | ✅ 100%管理（StrategicProject内） | 表示のみ |
| プロジェクトテンプレート | - | VoiceDrive管理（UI層） |
| UI設定 | - | VoiceDrive管理 |

### 実装タスク

#### 医療システム側
1. ❌ DBスキーマ作成（5テーブル）- 1日
2. ❌ マイグレーション実行 - 0.5日
3. ❌ API-1実装（一覧取得）- 0.5日
4. ❌ API-2実装（詳細取得）- 0.25日
5. 🟡 API-3〜7実装（作成・更新・マイルストーン・リスク）- 2日

**Phase 1合計**: 2.25日（18時間）
**全体合計**: 4.25日（34時間）

#### VoiceDrive側
1. ❌ デモデータから実APIへ切り替え - 1日
2. 🟡 新規プロジェクト作成フォーム実装 - 1日
3. 🟡 プロジェクトテンプレート管理UI - 0.5日

**Phase 1合計**: 1日（8時間）
**全体合計**: 2.5日（20時間）

### 次のステップ

1. **医療システムチーム**: 本報告書をレビュー後、Phase 1実装開始（11/11〜）
2. **VoiceDriveチーム**: 3つの確認事項に回答
3. **両チーム**: API仕様最終確認（11/11）
4. **統合テスト**: 11/19-11/20

---

**文書終了**

最終更新: 2025年10月26日
バージョン: 1.0
承認: 未承認（VoiceDriveチームレビュー待ち）
次回レビュー: VoiceDriveチームからのフィードバック受領後
