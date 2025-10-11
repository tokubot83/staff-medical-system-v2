# Strategic HR Plan テーブル設計承認依頼

**文書番号**: MED-REQ-2025-1010-010
**作成日**: 2025年10月10日
**差出人**: 医療職員管理システムチーム
**宛先**: VoiceDriveチーム
**件名**: Strategic HR Plan 関連テーブル設計の承認依頼
**優先度**: 🔴 HIGH
**回答期限**: 2025年10月11日（金）17:00

---

## 📋 概要

StrategicHRPage（戦略的人事計画ページ）の実装に向けて、医療システム側で**11件のテーブル**を追加する計画です。

共通DB構築後の円滑な統合のため、テーブル設計の承認をお願いします。

---

## 🎯 対象ページ

**ページ名**: StrategicHRPage
**URL**: `https://voicedrive-v100.vercel.app/strategic-hr-plan`
**Permission Level**: Level 16+（経営幹部）
**タブ構成**:
1. 戦略的人事計画（strategic_planning）
2. 組織開発（org_development）
3. パフォーマンス分析（performance_analytics）
4. 退職管理（retirement_management）

**現状**: 全データがハードコード（ダミーデータ）で動作中

---

## 🗄️ 追加予定テーブル一覧

### Phase 1: 基本機能（8テーブル）- 優先度 🔴 CRITICAL

| No | テーブル名 | 説明 | 使用箇所 |
|----|-----------|------|---------|
| 1 | `StrategicHRGoal` | 戦略的人事目標（満足度目標、離職率目標等） | 戦略的人事計画タブ |
| 2 | `StrategicInitiative` | 戦略的イニシアチブ（施策管理） | 戦略的人事計画タブ |
| 3 | `HRStrategyRoadmap` | 人材戦略ロードマップ（短期・中期・長期） | 戦略的人事計画タブ |
| 4 | `OrganizationHealthMetrics` | 組織健全性指標（エンゲージメント等） | 組織開発タブ |
| 5 | `OrgDevelopmentProgram` | 組織開発プログラム | 組織開発タブ |
| 6 | `ProgramParticipant` | プログラム参加者（中間テーブル） | 組織開発タブ |
| 7 | `PerformanceAnalytics` | パフォーマンス分析 | パフォーマンス分析タブ |
| 8 | `ImprovementProposal` | 改善提案実績 | パフォーマンス分析タブ |
| 9 | `RetirementProcess` | 退職プロセス管理 | 退職管理タブ |
| 10 | `RetirementReason` | 退職理由分析 | 退職管理タブ |
| 11 | `RetentionAction` | リテンション改善アクション | 退職管理タブ |

### Phase 2: 高度な分析機能（2テーブル）- 優先度 🟡 HIGH

| No | テーブル名 | 説明 | 使用箇所 |
|----|-----------|------|---------|
| 12 | `InfluenceAnalysis` | 影響力分析 | 組織開発タブ |
| 13 | `DepartmentCollaboration` | 部門間連携度 | 組織開発タブ |

---

## 📄 テーブル設計詳細

### 1. StrategicHRGoal（戦略的人事目標）

**目的**: 経営幹部が設定する年度別の人事戦略目標を管理

```prisma
model StrategicHRGoal {
  id                          String    @id @default(cuid())
  fiscalYear                  Int       @map("fiscal_year")
  facilityId                  String    @map("facility_id")

  // 目標値
  employeeSatisfactionTarget  Float     @map("employee_satisfaction_target")  // 95.0
  turnoverRateTarget          Float     @map("turnover_rate_target")          // 5.0
  annualHiringTarget          Int       @map("annual_hiring_target")          // 120

  // 実績値（計算値）
  currentSatisfaction         Float?    @map("current_satisfaction")
  currentTurnoverRate         Float?    @map("current_turnover_rate")
  currentHiring               Int?      @map("current_hiring")

  // メタデータ
  setByUserId                 String    @map("set_by_user_id")
  approvedAt                  DateTime? @map("approved_at")
  createdAt                   DateTime  @default(now()) @map("created_at")
  updatedAt                   DateTime  @updatedAt @map("updated_at")

  facility                    Facility  @relation(fields: [facilityId], references: [id])

  @@unique([fiscalYear, facilityId])
  @@index([fiscalYear])
  @@map("strategic_hr_goals")
}
```

**確認ポイント**:
- [ ] フィールド構成は適切か？
- [ ] VoiceDrive側で表示に必要な情報が揃っているか？

---

### 2. StrategicInitiative（戦略的イニシアチブ）

**目的**: タレントマネジメント、働き方改革等の人事施策を管理

```prisma
model StrategicInitiative {
  id              String    @id @default(cuid())
  facilityId      String    @map("facility_id")
  name            String                                        // "タレントマネジメント強化"
  description     String    @db.Text
  category        String                                        // "talent", "workstyle", "digital"
  progressPercent Int       @default(0) @map("progress_percent") // 75
  deadline        DateTime
  ownerId         String    @map("owner_id")
  priority        Int       @default(5) @map("priority")
  status          String    @default("in_progress")            // "in_progress", "completed", "paused"

  budgetAllocated Float?    @map("budget_allocated")
  budgetUsed      Float?    @map("budget_used")

  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")

  facility        Facility  @relation(fields: [facilityId], references: [id])
  owner           Employee  @relation("InitiativeOwner", fields: [ownerId], references: [id])

  @@index([facilityId])
  @@index([deadline])
  @@map("strategic_initiatives")
}
```

**確認ポイント**:
- [ ] categoryフィールドの値は適切か？
- [ ] 予算管理フィールド（budgetAllocated, budgetUsed）は必要か？

---

### 3. HRStrategyRoadmap（人材戦略ロードマップ）

**目的**: 短期（1年）・中期（3年）・長期（5年）の戦略目標を管理

```prisma
model HRStrategyRoadmap {
  id          String    @id @default(cuid())
  facilityId  String    @map("facility_id")
  timeframe   String                                  // "short_term", "mid_term", "long_term"
  title       String                                  // "新人研修プログラム刷新"
  description String?   @db.Text
  targetYear  Int       @map("target_year")          // 2026, 2028, 2030
  status      String    @default("planned")          // "planned", "in_progress", "completed"
  order       Int       @default(0)                  // 表示順序

  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")

  facility    Facility  @relation(fields: [facilityId], references: [id])

  @@index([facilityId, timeframe])
  @@map("hr_strategy_roadmap")
}
```

**確認ポイント**:
- [ ] timeframeの3区分（short/mid/long）は適切か？
- [ ] orderフィールドでの並び順管理は必要か？

---

### 4. OrganizationHealthMetrics（組織健全性指標）

**目的**: 職員エンゲージメント、組織コミットメント等の指標を定期測定

```prisma
model OrganizationHealthMetrics {
  id                      String    @id @default(cuid())
  facilityId              String    @map("facility_id")
  departmentId            String?   @map("department_id")
  measurementDate         DateTime  @map("measurement_date")

  employeeEngagement      Float     @map("employee_engagement")     // 82
  organizationCommitment  Float     @map("organization_commitment") // 78
  teamCollaboration       Float     @map("team_collaboration")      // 85
  innovationOrientation   Float     @map("innovation_orientation")  // 70

  measurementMethod       String    @map("measurement_method")   // "survey", "calculated", "ai_analysis"
  sampleSize              Int?      @map("sample_size")

  createdAt               DateTime  @default(now()) @map("created_at")

  facility                Facility     @relation(fields: [facilityId], references: [id])
  department              Department?  @relation(fields: [departmentId], references: [id])

  @@index([facilityId, measurementDate])
  @@index([departmentId, measurementDate])
  @@map("organization_health_metrics")
}
```

**確認ポイント**:
- [ ] 4つの指標（engagement, commitment, collaboration, innovation）は適切か？
- [ ] 測定方法（measurementMethod）は必要か？
- [ ] 部門別測定（departmentId）は使用しますか？

---

### 5-6. OrgDevelopmentProgram + ProgramParticipant（組織開発プログラム）

**目的**: チームビルディング、リーダーシップ開発等のプログラム管理

```prisma
model OrgDevelopmentProgram {
  id                    String    @id @default(cuid())
  facilityId            String    @map("facility_id")
  name                  String
  description           String    @db.Text
  category              String                                      // "team_building", "leadership", "culture"
  status                String                                      // "preparing", "in_progress", "completed"

  plannedParticipants   Int       @map("planned_participants")     // 45
  currentParticipants   Int       @default(0) @map("current_participants")
  completedParticipants Int       @default(0) @map("completed_participants")

  scheduledDate         DateTime? @map("scheduled_date")
  startDate             DateTime? @map("start_date")
  endDate               DateTime? @map("end_date")

  budgetAllocated       Float?    @map("budget_allocated")
  budgetUsed            Float?    @map("budget_used")

  createdAt             DateTime  @default(now()) @map("created_at")
  updatedAt             DateTime  @updatedAt @map("updated_at")

  facility              Facility  @relation(fields: [facilityId], references: [id])
  participants          ProgramParticipant[]

  @@index([facilityId])
  @@index([status])
  @@map("org_development_programs")
}

model ProgramParticipant {
  id          String    @id @default(cuid())
  programId   String    @map("program_id")
  employeeId  String    @map("employee_id")
  status      String    @default("enrolled")  // "enrolled", "in_progress", "completed", "dropped"
  enrolledAt  DateTime  @default(now()) @map("enrolled_at")
  completedAt DateTime? @map("completed_at")

  program     OrgDevelopmentProgram @relation(fields: [programId], references: [id], onDelete: Cascade)
  employee    Employee  @relation(fields: [employeeId], references: [id])

  @@unique([programId, employeeId])
  @@index([programId])
  @@index([employeeId])
  @@map("program_participants")
}
```

**確認ポイント**:
- [ ] 参加者数の3段階管理（planned/current/completed）は必要か？
- [ ] ProgramParticipantテーブルで個別参加者を管理する必要はあるか？

---

### 7. PerformanceAnalytics（パフォーマンス分析）

**目的**: 総合パフォーマンス、生産性、品質、イノベーション度を分析

```prisma
model PerformanceAnalytics {
  id                    String    @id @default(cuid())
  facilityId            String    @map("facility_id")
  departmentId          String?   @map("department_id")
  analysisDate          DateTime  @map("analysis_date")
  fiscalYear            Int       @map("fiscal_year")

  overallPerformance    Float     @map("overall_performance")       // 8.7
  productivityScore     Float     @map("productivity_score")        // 1.12
  qualityScore          Float     @map("quality_score")             // 9.2
  innovationScore       Float     @map("innovation_score")          // 7.8

  performanceChange     Float?    @map("performance_change")        // +0.3
  productivityChange    Float?    @map("productivity_change")
  qualityChange         Float?    @map("quality_change")
  innovationChange      Float?    @map("innovation_change")

  productivityTarget    Float?    @map("productivity_target")       // 1.0

  createdAt             DateTime  @default(now()) @map("created_at")

  facility              Facility     @relation(fields: [facilityId], references: [id])
  department            Department?  @relation(fields: [departmentId], references: [id])

  @@unique([facilityId, departmentId, analysisDate])
  @@index([facilityId, fiscalYear])
  @@map("performance_analytics")
}
```

**確認ポイント**:
- [ ] 4つのスコア（overall, productivity, quality, innovation）は適切か？
- [ ] 前年比フィールド（*Change）は必要か？
- [ ] 部門別分析（departmentId）は使用しますか？

---

### 8. ImprovementProposal（改善提案実績）

**目的**: 職員からの改善提案とコスト削減効果を管理

```prisma
model ImprovementProposal {
  id                    String    @id @default(cuid())
  voiceDrivePostId      String?   @map("voicedrive_post_id")  // VoiceDrive連携用
  title                 String
  description           String    @db.Text
  proposedByEmployeeId  String    @map("proposed_by_employee_id")
  status                String                                  // "submitted", "adopted", "rejected", "in_progress", "completed"

  estimatedCostSavings  Float?    @map("estimated_cost_savings")
  actualCostSavings     Float?    @map("actual_cost_savings")
  estimatedTimeSavings  Int?      @map("estimated_time_savings")  // 分単位

  proposedDate          DateTime  @map("proposed_date")
  adoptedDate           DateTime? @map("adopted_date")
  completedDate         DateTime? @map("completed_date")

  createdAt             DateTime  @default(now()) @map("created_at")
  updatedAt             DateTime  @updatedAt @map("updated_at")

  proposedBy            Employee  @relation(fields: [proposedByEmployeeId], references: [id])

  @@index([status])
  @@index([proposedDate])
  @@map("improvement_proposals")
}
```

**確認ポイント**:
- [ ] voiceDrivePostIdフィールドでVoiceDrive連携は可能か？
- [ ] ステータス5段階（submitted/adopted/rejected/in_progress/completed）は適切か？
- [ ] コスト削減効果（estimatedCostSavings, actualCostSavings）は必要か？

---

### 9. RetirementProcess（退職プロセス管理）

**目的**: 退職予定者の引き継ぎ状況・面談ステータスを管理

```prisma
model RetirementProcess {
  id                    String    @id @default(cuid())
  employeeId            String    @map("employee_id")
  retirementDate        DateTime  @map("retirement_date")
  retirementType        String    @map("retirement_type")  // "voluntary", "mandatory", "retirement_age"

  status                String    @default("initiated")    // "initiated", "handover", "interview_done", "completed"
  handoverStatus        String?   @map("handover_status")  // "not_started", "in_progress", "completed"
  interviewStatus       String?   @map("interview_status") // "scheduled", "completed", "skipped"

  handoverDocument      String?   @db.Text @map("handover_document")
  successorEmployeeId   String?   @map("successor_employee_id")

  exitInterviewDate     DateTime? @map("exit_interview_date")
  exitInterviewerId     String?   @map("exit_interviewer_id")

  createdAt             DateTime  @default(now()) @map("created_at")
  updatedAt             DateTime  @updatedAt @map("updated_at")

  employee              Employee  @relation("RetirementProcess", fields: [employeeId], references: [id])
  successor             Employee? @relation("Successor", fields: [successorEmployeeId], references: [id])
  interviewer           Employee? @relation("ExitInterviewer", fields: [exitInterviewerId], references: [id])

  @@unique([employeeId])
  @@index([retirementDate])
  @@map("retirement_processes")
}
```

**確認ポイント**:
- [ ] 3つのステータス管理（status, handoverStatus, interviewStatus）は必要か？
- [ ] 引き継ぎドキュメント（handoverDocument）はText型で十分か？

---

### 10-11. RetirementReason + RetentionAction（退職理由分析）

**目的**: 退職理由を分析し、改善アクションを管理

```prisma
model RetirementReason {
  id                      String    @id @default(cuid())
  employeeId              String    @map("employee_id")
  retirementDate          DateTime  @map("retirement_date")

  primaryReason           String    @map("primary_reason")    // "career_growth", "family", "industry_change", "retirement_age", "health", "relocation"
  secondaryReasons        String?   @db.Text @map("secondary_reasons") // JSON array

  reasonDetails           String?   @db.Text @map("reason_details")
  satisfaction            Int?                                  // 1-5
  wouldRecommend          Boolean?  @map("would_recommend")

  improvementSuggestions  String?   @db.Text @map("improvement_suggestions")

  createdAt               DateTime  @default(now()) @map("created_at")

  employee                Employee  @relation(fields: [employeeId], references: [id])

  @@unique([employeeId])
  @@index([retirementDate])
  @@index([primaryReason])
  @@map("retirement_reasons")
}

model RetentionAction {
  id            String    @id @default(cuid())
  facilityId    String    @map("facility_id")
  title         String                              // "キャリアパス明確化"
  description   String    @db.Text
  targetReason  String    @map("target_reason")     // "career_growth"対策
  status        String    @default("planned")       // "planned", "in_progress", "completed"
  priority      Int       @default(5)

  startDate     DateTime? @map("start_date")
  completedDate DateTime? @map("completed_date")

  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  facility      Facility  @relation(fields: [facilityId], references: [id])

  @@index([facilityId])
  @@index([targetReason])
  @@map("retention_actions")
}
```

**確認ポイント**:
- [ ] primaryReasonの6区分（career_growth, family, industry_change, retirement_age, health, relocation）は適切か？
- [ ] secondaryReasonsはJSON配列でOK？
- [ ] RetentionActionテーブルは必要か？

---

### 12-13. InfluenceAnalysis + DepartmentCollaboration（Phase 2）

**目的**: 影響力の高い職員を自動抽出、部門間連携度を測定

```prisma
model InfluenceAnalysis {
  id                  String    @id @default(cuid())
  employeeId          String    @map("employee_id")
  facilityId          String    @map("facility_id")
  analysisDate        DateTime  @map("analysis_date")

  influenceScore      Int       @map("influence_score")      // 0-100
  networkSize         Int       @map("network_size")
  centralityScore     Float     @map("centrality_score")

  voiceDriveActivity  Float?    @map("voicedrive_activity")  // VoiceDrive活動度
  meetingParticipation Float?   @map("meeting_participation")
  projectLeadership   Float?    @map("project_leadership")

  createdAt           DateTime  @default(now()) @map("created_at")

  employee            Employee  @relation(fields: [employeeId], references: [id])
  facility            Facility  @relation(fields: [facilityId], references: [id])

  @@unique([employeeId, analysisDate])
  @@index([facilityId, influenceScore])
  @@map("influence_analysis")
}

model DepartmentCollaboration {
  id                  String    @id @default(cuid())
  facilityId          String    @map("facility_id")
  departmentAId       String    @map("department_a_id")
  departmentBId       String    @map("department_b_id")
  analysisDate        DateTime  @map("analysis_date")

  collaborationLevel  String    @map("collaboration_level")  // "high", "medium", "low"
  collaborationScore  Float     @map("collaboration_score")  // 0-100

  sharedProjects      Int       @default(0) @map("shared_projects")
  crossMeetings       Int       @default(0) @map("cross_meetings")
  sharedResources     Int       @default(0) @map("shared_resources")

  createdAt           DateTime  @default(now()) @map("created_at")

  facility            Facility     @relation(fields: [facilityId], references: [id])
  departmentA         Department   @relation("DeptA", fields: [departmentAId], references: [id])
  departmentB         Department   @relation("DeptB", fields: [departmentBId], references: [id])

  @@unique([departmentAId, departmentBId, analysisDate])
  @@index([facilityId, analysisDate])
  @@map("department_collaboration")
}
```

**確認ポイント**:
- [ ] Phase 2実装なので、Phase 1では不要という理解でOK？
- [ ] VoiceDrive活動データ（voiceDriveActivity）の提供は可能か？

---

## ✅ 承認チェックリスト

### テーブル設計全般
- [ ] テーブル構成は適切か？
- [ ] フィールド名は分かりやすいか？
- [ ] 必要な情報が揃っているか？
- [ ] 不要なフィールドはないか？

### VoiceDrive側の実装
- [ ] API経由でこれらのデータを取得可能か？
- [ ] StrategicHRPageの表示に必要な情報が揃っているか？
- [ ] Phase 1/Phase 2の分け方は適切か？

### データ連携
- [ ] VoiceDrive PostとImprovementProposalの連携方法は適切か？
- [ ] 影響力分析でVoiceDrive活動データの提供は可能か？

---

## 📝 回答フォーマット

以下のフォーマットでご回答ください：

```markdown
# Strategic HR Plan テーブル設計承認結果

**回答日**: 2025年10月11日
**回答者**: VoiceDriveチーム

---

## Phase 1テーブル（11件）

### 1. StrategicHRGoal
[X] 承認
[ ] 修正希望

**コメント**:


### 2. StrategicInitiative
[X] 承認
[ ] 修正希望

**コメント**:


### 3. HRStrategyRoadmap
[X] 承認
[ ] 修正希望

**コメント**:


### 4. OrganizationHealthMetrics
[X] 承認
[ ] 修正希望

**コメント**:


### 5-6. OrgDevelopmentProgram + ProgramParticipant
[X] 承認
[ ] 修正希望

**コメント**:


### 7. PerformanceAnalytics
[X] 承認
[ ] 修正希望

**コメント**:


### 8. ImprovementProposal
[X] 承認
[ ] 修正希望

**コメント**:


### 9. RetirementProcess
[X] 承認
[ ] 修正希望

**コメント**:


### 10-11. RetirementReason + RetentionAction
[X] 承認
[ ] 修正希望

**コメント**:


---

## Phase 2テーブル（2件）

### 12-13. InfluenceAnalysis + DepartmentCollaboration
[X] 承認（Phase 2実装でOK）
[ ] Phase 1で必要
[ ] 修正希望

**コメント**:


---

## 総合評価
[X] 承認（テーブル設計OK）
[ ] 修正後承認
[ ] 不承認（大幅な変更必要）

**総合コメント**:


```

---

## 📅 スケジュール

| 日付 | 作業内容 | 担当 |
|------|---------|------|
| **10/10（木）** | テーブル設計承認依頼作成 | 医療システム | ✅ |
| **10/11（金）17:00** | VoiceDriveチーム承認回答 | VoiceDrive | ⏳ |
| **10/11（金）午後** | テーブル設計修正（必要に応じて） | 医療システム | - |
| **共通DB構築完了後** | Prisma Migration実行 | 医療システム | - |
| **DB構築後+1週間** | API実装開始 | 医療システム | - |

---

## 🔗 関連ドキュメント

1. [organization-analytics暫定マスターリスト_20251010.md](./organization-analytics暫定マスターリスト_20251010.md)
2. [organization-analytics_DB要件分析_20251010.md](./organization-analytics_DB要件分析_20251010.md)
3. [共通DB構築後統合作業再開計画書_20251008.md](./共通DB構築後統合作業再開計画書_20251008.md)

---

## 📞 連絡先

### 医療システムチーム
- **Slack**: #medical-system-integration
- **質問対応**: 平日 9:00-18:00

### VoiceDriveチーム
- **Slack**: #voicedrive-integration

---

**文書終了**

最終更新: 2025年10月10日
バージョン: 1.0
回答期限: 2025年10月11日（金）17:00
次回アクション: VoiceDriveチームからの承認回答受領
