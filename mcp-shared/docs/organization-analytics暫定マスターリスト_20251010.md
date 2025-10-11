# 組織分析ページ（OrganizationAnalytics）実装暫定マスターリスト

**文書番号**: MASTER-OA-2025-1010-001
**作成日**: 2025年10月10日
**対象システム**: VoiceDrive v100 + 医療職員管理システム
**対象機能**: 組織分析ダッシュボード（Level 15+ 人事各部門長専用）
**総工数見積**: 約15-20営業日（VoiceDrive: 12-15日、医療システム: 3-5日）

---

## 📋 プロジェクト概要

### 目標

ハードコードされたダミーデータで動作している組織分析ページを、実データベースと接続し、リアルタイムな組織分析機能を提供する。

### スコープ

- ✅ 組織健康度指標（5指標）の実データ化
- ✅ 議題化プロセスの進捗（5段階）の実データ化
- ✅ 委員会活動の効果測定（6指標）の実データ化
- ✅ 議題カテゴリ別分析（6カテゴリ）の実データ化
- ✅ 部門別の声の活性度の実データ化
- ✅ 戦略的インサイト（AI分析）の実データ化
- ✅ トレンド分析（前月比、前四半期比）機能追加
- ✅ 医療システムとのAPI連携（部門マスタ、アクティブ職員数）

---

## 🎯 実装Phase一覧

### Phase 1: データ取得基盤構築（11月11日〜15日）

**目標**: VoiceDrive側のデータ集計基盤と医療システムAPIを整備

**総工数**: 5営業日
- VoiceDrive: 3-4日
- 医療システム: 3-4日

**完了条件**:
- ✅ ManagementCommitteeAgenda, DecisionMeetingAgendaに実装追跡フィールド追加
- ✅ 医療システムAPI-3（部門マスタ）実装
- ✅ 医療システムAPI-4（アクティブ職員数）実装
- ✅ OrganizationAnalyticsServiceクラス実装
- ✅ 基本統計計算ロジック実装

---

### Phase 2: 実データ表示実装（11月18日〜22日）

**目標**: OrganizationAnalyticsPageをダミーデータから実データ表示に切り替え

**総工数**: 5営業日
- VoiceDrive: 5日
- 医療システム: 0日（関与なし）

**完了条件**:
- ✅ 組織健康度指標の実データ表示
- ✅ 議題化プロセスの実データ表示
- ✅ 委員会活動効果の実データ表示
- ✅ カテゴリ別分析の実データ表示
- ✅ 部門別活性度の実データ表示

---

### Phase 3: 高度分析機能実装（11月25日〜29日）

**目標**: トレンド分析、戦略的インサイト機能の実装

**総工数**: 5営業日
- VoiceDrive: 5日
- 医療システム: 0日（関与なし）

**完了条件**:
- ✅ OrganizationAnalyticsSnapshotテーブル実装
- ✅ 月次バッチ実装
- ✅ トレンド分析機能実装
- ✅ 戦略的インサイト実装

---

## 📂 Phase 1: データ取得基盤構築（11月11日〜15日）

### 1.1 VoiceDrive - schema.prisma更新

**ファイル**: `C:\projects\voicedrive-v100\prisma\schema.prisma`
**予想行数**: +30行
**実装内容**:

```prisma
// ManagementCommitteeAgenda - 実装追跡フィールド追加
model ManagementCommitteeAgenda {
  // 既存フィールド...

  // 🆕 実装追跡フィールド（2025-10-10追加）
  implementationStatus  String?   @default("not_started") // 'not_started' | 'in_progress' | 'completed' | 'cancelled'
  implementedDate       DateTime? // 実装完了日
  implementationNotes   String?   // 実装メモ
  implementationOwner   String?   // 実装責任者（User.id）

  @@index([implementationStatus])
}

// DecisionMeetingAgenda - 実装追跡フィールド追加
model DecisionMeetingAgenda {
  // 既存フィールド...

  // 🆕 実装追跡フィールド（2025-10-10追加）
  implementationStatus  String?   @default("not_started")
  implementedDate       DateTime?
  implementationNotes   String?
  implementationOwner   String?

  @@index([implementationStatus])
}
```

**実装日**: 11月11日（月）
**担当**: VoiceDriveチーム
**チェックリスト**:
- [ ] schema.prisma編集
- [ ] マイグレーション実行: `npx prisma migrate dev --name add_implementation_tracking`
- [ ] prisma generate実行

---

### 1.2 VoiceDrive - OrganizationAnalyticsService実装

**ファイル**: `C:\projects\voicedrive-v100\src\services\OrganizationAnalyticsService.ts`（新規作成）
**予想行数**: 約800-1000行
**実装内容**:

#### 1.2.1 組織健康度指標の計算（約200行）

```typescript
// src/services/OrganizationAnalyticsService.ts

import { prisma } from '@/lib/prisma';

interface OrganizationHealthMetrics {
  voiceActivity: number;        // 声の活性度（0-100）
  participationRate: number;    // 参加率（0-100）
  resolutionRate: number;       // 解決率（0-100）
  engagementScore: number;      // エンゲージメントスコア（0-100）
  crossDeptCollaboration: number; // 部門間連携（0-100）
}

export class OrganizationAnalyticsService {
  /**
   * 組織健康度指標を計算
   */
  async calculateOrganizationHealth(
    periodStartDate: Date,
    periodEndDate: Date,
    totalActiveEmployees: number
  ): Promise<OrganizationHealthMetrics> {
    // 1. 声の活性度
    const voiceActivity = await this.calculateVoiceActivity(
      periodStartDate,
      periodEndDate,
      totalActiveEmployees
    );

    // 2. 参加率
    const participationRate = await this.calculateParticipationRate(
      periodStartDate,
      periodEndDate,
      totalActiveEmployees
    );

    // 3. 解決率
    const resolutionRate = await this.calculateResolutionRate(
      periodStartDate,
      periodEndDate
    );

    // 4. エンゲージメントスコア
    const engagementScore = await this.calculateEngagementScore(
      periodStartDate,
      periodEndDate
    );

    // 5. 部門間連携
    const crossDeptCollaboration = await this.calculateCrossDeptCollaboration(
      periodStartDate,
      periodEndDate
    );

    return {
      voiceActivity,
      participationRate,
      resolutionRate,
      engagementScore,
      crossDeptCollaboration,
    };
  }

  /**
   * 声の活性度を計算
   * 計算式: ((投稿数 * 10) + (コメント数 * 5) + (投票数 * 1)) / (全職員数 * 期間日数) * 100
   */
  private async calculateVoiceActivity(
    periodStartDate: Date,
    periodEndDate: Date,
    totalActiveEmployees: number
  ): Promise<number> {
    const periodDays = Math.ceil(
      (periodEndDate.getTime() - periodStartDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // 投稿数
    const postCount = await prisma.post.count({
      where: {
        createdAt: { gte: periodStartDate, lte: periodEndDate },
        status: 'active',
      },
    });

    // コメント数
    const commentCount = await prisma.comment.count({
      where: {
        createdAt: { gte: periodStartDate, lte: periodEndDate },
      },
    });

    // 投票数
    const voteCount = await prisma.vote.count({
      where: {
        timestamp: { gte: periodStartDate, lte: periodEndDate },
      },
    });

    const activityScore =
      (postCount * 10 + commentCount * 5 + voteCount * 1) /
      (totalActiveEmployees * periodDays);

    // 0-100にスケール
    return Math.min(100, Math.round(activityScore * 100));
  }

  /**
   * 参加率を計算
   * 計算式: (アクティブユーザー数 / 全職員数) * 100
   */
  private async calculateParticipationRate(
    periodStartDate: Date,
    periodEndDate: Date,
    totalActiveEmployees: number
  ): Promise<number> {
    // 期間内にアクション（投稿/コメント/投票）したユニークユーザー数
    const activeUserIds = new Set<string>();

    // 投稿したユーザー
    const postAuthors = await prisma.post.findMany({
      where: {
        createdAt: { gte: periodStartDate, lte: periodEndDate },
        status: 'active',
      },
      select: { authorId: true },
      distinct: ['authorId'],
    });
    postAuthors.forEach((p) => activeUserIds.add(p.authorId));

    // コメントしたユーザー
    const commentAuthors = await prisma.comment.findMany({
      where: {
        createdAt: { gte: periodStartDate, lte: periodEndDate },
      },
      select: { authorId: true },
      distinct: ['authorId'],
    });
    commentAuthors.forEach((c) => activeUserIds.add(c.authorId));

    // 投票したユーザー
    const voters = await prisma.vote.findMany({
      where: {
        timestamp: { gte: periodStartDate, lte: periodEndDate },
      },
      select: { userId: true },
      distinct: ['userId'],
    });
    voters.forEach((v) => activeUserIds.add(v.userId));

    const activeUserCount = activeUserIds.size;
    return Math.round((activeUserCount / totalActiveEmployees) * 100);
  }

  /**
   * 解決率を計算
   * 計算式: (解決済み議題数 / 総議題数) * 100
   */
  private async calculateResolutionRate(
    periodStartDate: Date,
    periodEndDate: Date
  ): Promise<number> {
    // 委員会議題
    const committeeAgendas = await prisma.managementCommitteeAgenda.count({
      where: {
        proposedDate: { gte: periodStartDate, lte: periodEndDate },
      },
    });

    const committeeResolved = await prisma.managementCommitteeAgenda.count({
      where: {
        proposedDate: { gte: periodStartDate, lte: periodEndDate },
        status: 'approved',
      },
    });

    // 経営会議議題
    const decisionAgendas = await prisma.decisionMeetingAgenda.count({
      where: {
        proposedDate: { gte: periodStartDate, lte: periodEndDate },
      },
    });

    const decisionResolved = await prisma.decisionMeetingAgenda.count({
      where: {
        proposedDate: { gte: periodStartDate, lte: periodEndDate },
        decision: 'approved',
      },
    });

    const totalAgendas = committeeAgendas + decisionAgendas;
    const totalResolved = committeeResolved + decisionResolved;

    if (totalAgendas === 0) return 0;
    return Math.round((totalResolved / totalAgendas) * 100);
  }

  /**
   * エンゲージメントスコアを計算
   * 計算式: (平均コメント数/5 * 30) + (平均投票数/20 * 40) + (議題化率 * 30)
   */
  private async calculateEngagementScore(
    periodStartDate: Date,
    periodEndDate: Date
  ): Promise<number> {
    // 期間内の投稿
    const posts = await prisma.post.findMany({
      where: {
        createdAt: { gte: periodStartDate, lte: periodEndDate },
        status: 'active',
      },
      include: {
        comments: true,
        votes: true,
      },
    });

    if (posts.length === 0) return 0;

    // 平均コメント数
    const avgComments = posts.reduce((sum, p) => sum + p.comments.length, 0) / posts.length;

    // 平均投票数
    const avgVotes = posts.reduce((sum, p) => sum + p.votes.length, 0) / posts.length;

    // 議題化率（投稿から議題に昇格した割合）
    const agendasFromPosts = await prisma.managementCommitteeAgenda.count({
      where: {
        relatedPostId: { not: null },
        proposedDate: { gte: periodStartDate, lte: periodEndDate },
      },
    });
    const agendaRate = (agendasFromPosts / posts.length) * 100;

    const engagementScore =
      (avgComments / 5) * 30 + (avgVotes / 20) * 40 + agendaRate * 30;

    return Math.min(100, Math.round(engagementScore));
  }

  /**
   * 部門間連携スコアを計算
   * 計算式: (複数部門議題数/総議題数 * 50) + (部門外コメント率 * 30) + (部門外投票率 * 20)
   */
  private async calculateCrossDeptCollaboration(
    periodStartDate: Date,
    periodEndDate: Date
  ): Promise<number> {
    // 複数部門にまたがる議題
    const multiDeptAgendas = await prisma.managementCommitteeAgenda.count({
      where: {
        proposedDate: { gte: periodStartDate, lte: periodEndDate },
        impactDepartments: { not: '[]' }, // JSON配列が空でない
      },
    });

    const totalAgendas = await prisma.managementCommitteeAgenda.count({
      where: {
        proposedDate: { gte: periodStartDate, lte: periodEndDate },
      },
    });

    const multiDeptRate = totalAgendas === 0 ? 0 : (multiDeptAgendas / totalAgendas) * 100;

    // 部門外コメント率・投票率の計算は複雑なため、簡易版として多部門議題率を重視
    const crossDeptScore = multiDeptRate * 0.5 + 50; // 暫定計算式

    return Math.min(100, Math.round(crossDeptScore));
  }
}
```

**実装日**: 11月12日（火）〜14日（木）
**担当**: VoiceDriveチーム
**チェックリスト**:
- [ ] OrganizationAnalyticsService.tsファイル作成
- [ ] calculateOrganizationHealth実装
- [ ] 5つの指標計算メソッド実装
- [ ] 単体テスト作成
- [ ] 統合テスト実行

---

#### 1.2.2 議題化プロセスの進捗計算（約100行）

```typescript
interface AgendaProgressData {
  departmentLevel: number;    // 部署内議題
  facilityLevel: number;      // 施設議題
  corporateLevel: number;     // 法人議題
  committeeSubmitted: number; // 委員会提出済み
  resolved: number;           // 決議済み
}

export class OrganizationAnalyticsService {
  // ...

  /**
   * 議題化プロセスの進捗を計算
   */
  async calculateAgendaProgress(
    periodStartDate: Date,
    periodEndDate: Date
  ): Promise<AgendaProgressData> {
    // 部署内議題
    const departmentLevel = await prisma.post.count({
      where: {
        createdAt: { gte: periodStartDate, lte: periodEndDate },
        agendaLevel: 'DEPT_REVIEW',
      },
    });

    // 施設議題
    const facilityLevel = await prisma.post.count({
      where: {
        createdAt: { gte: periodStartDate, lte: periodEndDate },
        agendaLevel: 'FACILITY_AGENDA',
      },
    });

    // 法人議題（委員会に提出された議題）
    const corporateLevel = await prisma.managementCommitteeAgenda.count({
      where: {
        proposedDate: { gte: periodStartDate, lte: periodEndDate },
        status: 'pending',
      },
    });

    // 委員会提出済み（審議中含む）
    const committeeSubmitted = await prisma.managementCommitteeAgenda.count({
      where: {
        proposedDate: { gte: periodStartDate, lte: periodEndDate },
        status: { in: ['in_review', 'approved', 'rejected', 'deferred'] },
      },
    });

    // 決議済み（承認・却下・保留）
    const resolved = await prisma.managementCommitteeAgenda.count({
      where: {
        proposedDate: { gte: periodStartDate, lte: periodEndDate },
        status: { in: ['approved', 'rejected', 'deferred'] },
      },
    });

    return {
      departmentLevel,
      facilityLevel,
      corporateLevel,
      committeeSubmitted,
      resolved,
    };
  }
}
```

**実装日**: 11月12日（火）〜14日（木）
**担当**: VoiceDriveチーム

---

#### 1.2.3 委員会活動の効果測定（約150行）

```typescript
interface CommitteeEffectivenessData {
  submitted: number;
  reviewed: number;
  approved: number;
  implemented: number;
  avgReviewDays: number;
  avgImplementDays: number;
}

export class OrganizationAnalyticsService {
  // ...

  /**
   * 委員会活動の効果を測定
   */
  async calculateCommitteeEffectiveness(
    periodStartDate: Date,
    periodEndDate: Date
  ): Promise<CommitteeEffectivenessData> {
    // 提出
    const submitted = await prisma.managementCommitteeAgenda.count({
      where: {
        proposedDate: { gte: periodStartDate, lte: periodEndDate },
      },
    });

    // 審議完了
    const reviewed = await prisma.managementCommitteeAgenda.count({
      where: {
        proposedDate: { gte: periodStartDate, lte: periodEndDate },
        status: { in: ['approved', 'rejected', 'deferred'] },
      },
    });

    // 承認
    const approved = await prisma.managementCommitteeAgenda.count({
      where: {
        proposedDate: { gte: periodStartDate, lte: periodEndDate },
        status: 'approved',
      },
    });

    // 🆕 実装済み（新規フィールド使用）
    const implemented = await prisma.managementCommitteeAgenda.count({
      where: {
        proposedDate: { gte: periodStartDate, lte: periodEndDate },
        implementationStatus: 'completed',
      },
    });

    // 平均審議期間
    const reviewedAgendas = await prisma.managementCommitteeAgenda.findMany({
      where: {
        proposedDate: { gte: periodStartDate, lte: periodEndDate },
        decidedDate: { not: null },
      },
      select: {
        proposedDate: true,
        decidedDate: true,
      },
    });

    const avgReviewDays =
      reviewedAgendas.length === 0
        ? 0
        : Math.round(
            reviewedAgendas.reduce((sum, agenda) => {
              const days = Math.ceil(
                (agenda.decidedDate!.getTime() - agenda.proposedDate.getTime()) /
                  (1000 * 60 * 60 * 24)
              );
              return sum + days;
            }, 0) / reviewedAgendas.length
          );

    // 🆕 平均実装期間（新規フィールド使用）
    const implementedAgendas = await prisma.managementCommitteeAgenda.findMany({
      where: {
        proposedDate: { gte: periodStartDate, lte: periodEndDate },
        implementedDate: { not: null },
        decidedDate: { not: null },
      },
      select: {
        decidedDate: true,
        implementedDate: true,
      },
    });

    const avgImplementDays =
      implementedAgendas.length === 0
        ? 0
        : Math.round(
            implementedAgendas.reduce((sum, agenda) => {
              const days = Math.ceil(
                (agenda.implementedDate!.getTime() - agenda.decidedDate!.getTime()) /
                  (1000 * 60 * 60 * 24)
              );
              return sum + days;
            }, 0) / implementedAgendas.length
          );

    return {
      submitted,
      reviewed,
      approved,
      implemented,
      avgReviewDays,
      avgImplementDays,
    };
  }
}
```

**実装日**: 11月12日（火）〜14日（木）
**担当**: VoiceDriveチーム

---

#### 1.2.4 カテゴリ別分析（約100行）

```typescript
interface CategoryAnalysisItem {
  id: string;
  name: string;
  count: number;
  resolved: number;
  resolutionRate: number;
}

export class OrganizationAnalyticsService {
  // ...

  /**
   * 議題カテゴリ別分析
   */
  async calculateCategoryAnalysis(
    periodStartDate: Date,
    periodEndDate: Date
  ): Promise<CategoryAnalysisItem[]> {
    const categories = [
      { id: 'personnel', name: '人事・採用', agendaType: 'personnel' },
      { id: 'education', name: '教育・研修', agendaType: 'education' },
      { id: 'workflow', name: '業務改善', agendaType: 'committee_proposal' },
      { id: 'environment', name: '労働環境', agendaType: 'facility_policy' },
      { id: 'safety', name: '医療安全', agendaType: 'equipment' },
      { id: 'communication', name: 'コミュニケーション', agendaType: 'other' },
    ];

    const results: CategoryAnalysisItem[] = [];

    for (const category of categories) {
      const count = await prisma.managementCommitteeAgenda.count({
        where: {
          proposedDate: { gte: periodStartDate, lte: periodEndDate },
          agendaType: category.agendaType,
        },
      });

      const resolved = await prisma.managementCommitteeAgenda.count({
        where: {
          proposedDate: { gte: periodStartDate, lte: periodEndDate },
          agendaType: category.agendaType,
          status: 'approved',
        },
      });

      const resolutionRate = count === 0 ? 0 : Math.round((resolved / count) * 100);

      results.push({
        id: category.id,
        name: category.name,
        count,
        resolved,
        resolutionRate,
      });
    }

    return results;
  }
}
```

**実装日**: 11月12日（火）〜14日（木）
**担当**: VoiceDriveチーム

---

#### 1.2.5 部門別活性度（約150行）

```typescript
interface DepartmentActivityItem {
  name: string;
  code: string;
  posts: number;
  agenda: number;
  engagement: number;
  trend: 'up' | 'down' | 'stable';
}

export class OrganizationAnalyticsService {
  // ...

  /**
   * 部門別の声の活性度を計算
   */
  async calculateDepartmentActivity(
    periodStartDate: Date,
    periodEndDate: Date,
    departments: Array<{ id: string; name: string; code: string; activeEmployeeCount: number }>
  ): Promise<DepartmentActivityItem[]> {
    const results: DepartmentActivityItem[] = [];

    for (const dept of departments) {
      // 投稿数（部門所属職員による投稿）
      const posts = await prisma.post.count({
        where: {
          createdAt: { gte: periodStartDate, lte: periodEndDate },
          status: 'active',
          author: {
            department: dept.code,
          },
        },
      });

      // 議題化数
      const agenda = await prisma.managementCommitteeAgenda.count({
        where: {
          proposedDate: { gte: periodStartDate, lte: periodEndDate },
          proposerDepartment: dept.code,
        },
      });

      // 活性度スコア計算
      const postRate = (posts / dept.activeEmployeeCount) * 100;
      const agendaRate = posts === 0 ? 0 : (agenda / posts) * 100;

      // 簡易的な活性度スコア
      const engagement = Math.min(100, Math.round(postRate * 0.6 + agendaRate * 0.4));

      // トレンド（前期比較）- 現時点では 'stable' 固定（Phase 3で実装）
      const trend = 'stable';

      results.push({
        name: dept.name,
        code: dept.code,
        posts,
        agenda,
        engagement,
        trend,
      });
    }

    // エンゲージメントスコア順にソート
    return results.sort((a, b) => b.engagement - a.engagement);
  }
}
```

**実装日**: 11月12日（火）〜14日（木）
**担当**: VoiceDriveチーム

---

### 1.3 医療システム - API-3実装（部門マスタ取得）

**ファイル**: `C:\projects\staff-medical-system\src\api\routes\department.routes.ts`（新規作成）
**予想行数**: 約150行
**実装内容**:

```typescript
// src/api/routes/department.routes.ts

import { Router } from 'express';
import { prisma } from '@/lib/prisma';
import { authenticateAPI } from '@/middleware/auth';

const router = Router();

/**
 * GET /api/v2/departments
 * 部門マスタ一覧取得
 */
router.get('/api/v2/departments', authenticateAPI, async (req, res) => {
  try {
    // 部門マスタ取得
    const departments = await prisma.department.findMany({
      where: {
        isActive: true, // アクティブな部門のみ
      },
      include: {
        facility: {
          select: {
            id: true,
            name: true,
          },
        },
        employees: {
          where: {
            status: 'active', // アクティブ職員のみカウント
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: [
        { facilityId: 'asc' },
        { name: 'asc' },
      ],
    });

    // レスポンス整形
    const response = {
      departments: departments.map((dept) => ({
        id: dept.id,
        name: dept.name,
        code: dept.code,
        facilityId: dept.facilityId,
        facilityName: dept.facility.name,
        employeeCount: dept.employees.length,
        activeEmployeeCount: dept.employees.length, // 既にactiveでフィルタ済み
        parentDepartmentId: dept.parentDepartmentId || null,
      })),
      total: departments.length,
      retrievedAt: new Date().toISOString(),
    };

    res.json(response);
  } catch (error) {
    console.error('[API-3] Department list error:', error);
    res.status(500).json({
      error: 'Failed to retrieve department list',
      code: 'DEPARTMENT_LIST_ERROR',
    });
  }
});

export default router;
```

**実装日**: 11月11日（月）〜13日（水）
**担当**: 医療システムチーム
**チェックリスト**:
- [ ] department.routes.tsファイル作成
- [ ] GET /api/v2/departmentsエンドポイント実装
- [ ] 部門マスタ取得ロジック実装
- [ ] 単体テスト作成
- [ ] API仕様書更新

---

### 1.4 医療システム - API-4実装（アクティブ職員数取得）

**ファイル**: `C:\projects\staff-medical-system\src\api\routes\employee.routes.ts`（既存ファイル）
**予想行数**: +100行
**実装内容**:

```typescript
// src/api/routes/employee.routes.ts

/**
 * GET /api/v2/employees/active-count
 * アクティブ職員数取得
 */
router.get('/api/v2/employees/active-count', authenticateAPI, async (req, res) => {
  try {
    // 全体のアクティブ職員数
    const total = await prisma.employee.count({
      where: {
        status: 'active',
      },
    });

    // 部門別
    const byDepartment: Record<string, number> = {};
    const departmentCounts = await prisma.employee.groupBy({
      by: ['departmentCode'],
      where: {
        status: 'active',
        departmentCode: { not: null },
      },
      _count: {
        id: true,
      },
    });

    departmentCounts.forEach((item) => {
      byDepartment[item.departmentCode!] = item._count.id;
    });

    // 施設別
    const byFacility: Record<string, number> = {};
    const facilityCounts = await prisma.employee.groupBy({
      by: ['facilityId'],
      where: {
        status: 'active',
        facilityId: { not: null },
      },
      _count: {
        id: true,
      },
    });

    facilityCounts.forEach((item) => {
      byFacility[item.facilityId!] = item._count.id;
    });

    res.json({
      total,
      byDepartment,
      byFacility,
      calculatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[API-4] Active count error:', error);
    res.status(500).json({
      error: 'Failed to retrieve active employee count',
      code: 'ACTIVE_COUNT_ERROR',
    });
  }
});
```

**実装日**: 11月11日（月）〜13日（水）
**担当**: 医療システムチーム
**チェックリスト**:
- [ ] GET /api/v2/employees/active-countエンドポイント実装
- [ ] アクティブ職員数集計ロジック実装
- [ ] 部門別・施設別集計実装
- [ ] 単体テスト作成
- [ ] API仕様書更新

---

### 1.5 VoiceDrive - 医療システムAPIクライアント実装

**ファイル**: `C:\projects\voicedrive-v100\src\services\MedicalSystemClient.ts`（既存ファイル）
**予想行数**: +150行
**実装内容**:

```typescript
// src/services/MedicalSystemClient.ts

const MEDICAL_SYSTEM_API_BASE = process.env.MEDICAL_SYSTEM_API_URL || 'http://localhost:8080';
const JWT_TOKEN = process.env.MEDICAL_SYSTEM_JWT_TOKEN || '';

/**
 * 部門マスタ取得
 */
export async function fetchDepartments(): Promise<Department[]> {
  try {
    const response = await fetch(`${MEDICAL_SYSTEM_API_BASE}/api/v2/departments`, {
      headers: {
        Authorization: `Bearer ${JWT_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API-3 failed: ${response.status}`);
    }

    const data = await response.json();
    return data.departments;
  } catch (error) {
    console.error('[MedicalSystemClient] Department fetch failed:', error);
    throw error;
  }
}

/**
 * アクティブ職員数取得
 */
export async function fetchActiveEmployeeCount(): Promise<ActiveCountResponse> {
  try {
    const response = await fetch(`${MEDICAL_SYSTEM_API_BASE}/api/v2/employees/active-count`, {
      headers: {
        Authorization: `Bearer ${JWT_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API-4 failed: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[MedicalSystemClient] Active count fetch failed:', error);
    throw error;
  }
}
```

**実装日**: 11月14日（木）
**担当**: VoiceDriveチーム
**チェックリスト**:
- [ ] fetchDepartments関数実装
- [ ] fetchActiveEmployeeCount関数実装
- [ ] エラーハンドリング実装
- [ ] 統合テスト実行

---

## 📂 Phase 2: 実データ表示実装（11月18日〜22日）

### 2.1 VoiceDrive - OrganizationAnalyticsPage修正

**ファイル**: `C:\projects\voicedrive-v100\src\pages\OrganizationAnalyticsPage.tsx`
**予想行数**: 約+400行（ハードコードの削除と実データ取得ロジック追加）
**実装内容**:

#### 2.1.1 State管理の実装（約50行）

```typescript
// OrganizationAnalyticsPage.tsx

import React, { useState, useEffect } from 'react';
import { OrganizationAnalyticsService } from '@/services/OrganizationAnalyticsService';
import { fetchDepartments, fetchActiveEmployeeCount } from '@/services/MedicalSystemClient';

const OrganizationAnalyticsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // 🆕 実データState
  const [organizationHealth, setOrganizationHealth] = useState<OrganizationHealthMetrics | null>(null);
  const [agendaProgress, setAgendaProgress] = useState<AgendaProgressData | null>(null);
  const [committeeEffectiveness, setCommitteeEffectiveness] = useState<CommitteeEffectivenessData | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryAnalysisItem[]>([]);
  const [departmentActivity, setDepartmentActivity] = useState<DepartmentActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🆕 期間計算
  const getPeriodDates = (periodType: 'week' | 'month' | 'quarter') => {
    const now = new Date();
    let startDate: Date;

    if (periodType === 'week') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (periodType === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
      // quarter
      const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
      startDate = new Date(now.getFullYear(), quarterStartMonth, 1);
    }

    return { startDate, endDate: now };
  };

  // 🆕 データ取得
  useEffect(() => {
    async function loadAnalytics() {
      setLoading(true);
      setError(null);

      try {
        const { startDate, endDate } = getPeriodDates(selectedPeriod);
        const service = new OrganizationAnalyticsService();

        // 医療システムからデータ取得
        const departments = await fetchDepartments();
        const activeCount = await fetchActiveEmployeeCount();

        // VoiceDrive側で分析計算
        const [health, progress, effectiveness, categories, activity] = await Promise.all([
          service.calculateOrganizationHealth(startDate, endDate, activeCount.total),
          service.calculateAgendaProgress(startDate, endDate),
          service.calculateCommitteeEffectiveness(startDate, endDate),
          service.calculateCategoryAnalysis(startDate, endDate),
          service.calculateDepartmentActivity(startDate, endDate, departments),
        ]);

        setOrganizationHealth(health);
        setAgendaProgress(progress);
        setCommitteeEffectiveness(effectiveness);
        setCategoryData(categories);
        setDepartmentActivity(activity);
      } catch (err) {
        console.error('[OrganizationAnalytics] Load error:', err);
        setError('データの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, [selectedPeriod]);

  // ローディング表示
  if (loading) {
    return <div className="p-8">データを読み込み中...</div>;
  }

  // エラー表示
  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  // ...以降、実データを使用した表示
};
```

**実装日**: 11月18日（月）〜19日（火）
**担当**: VoiceDriveチーム

---

#### 2.1.2 組織健康度指標の実データ表示（約50行）

```typescript
// OrganizationAnalyticsPage.tsx（152-186行目付近を修正）

<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
  {[
    { label: '声の活性度', value: organizationHealth?.voiceActivity || 0, icon: MessageSquare },
    { label: '参加率', value: organizationHealth?.participationRate || 0, icon: Users },
    { label: '解決率', value: organizationHealth?.resolutionRate || 0, icon: CheckCircle },
    { label: 'エンゲージメント', value: organizationHealth?.engagementScore || 0, icon: Target },
    { label: '部門間連携', value: organizationHealth?.crossDeptCollaboration || 0, icon: Building2 },
  ].map((metric, index) => (
    <div key={index} className="bg-slate-900/50 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <metric.icon className="w-5 h-5 text-slate-400" />
        <span className="text-sm text-slate-400">{metric.label}</span>
      </div>
      <div className={`text-3xl font-bold ${getHealthColor(metric.value)}`}>
        {metric.value}
        <span className="text-lg">%</span>
      </div>
      <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${
            metric.value >= 80 ? 'bg-green-500' :
            metric.value >= 60 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${metric.value}%` }}
        />
      </div>
    </div>
  ))}
</div>
```

**実装日**: 11月19日（火）
**担当**: VoiceDriveチーム

---

#### 2.1.3 議題化プロセスの実データ表示（約50行）

```typescript
// OrganizationAnalyticsPage.tsx（188-218行目付近を修正）

{[
  { label: '部署内議題', value: agendaProgress?.departmentLevel || 0, icon: Users, color: 'blue' },
  { label: '施設議題', value: agendaProgress?.facilityLevel || 0, icon: Building2, color: 'purple' },
  { label: '法人議題', value: agendaProgress?.corporateLevel || 0, icon: Briefcase, color: 'indigo' },
  { label: '委員会提出済み', value: agendaProgress?.committeeSubmitted || 0, icon: CheckCircle, color: 'green' },
  { label: '決議済み', value: agendaProgress?.resolved || 0, icon: Award, color: 'emerald' },
].map((stage, index) => (
  <div key={index} className="flex items-center justify-between">
    <div className="flex items-center gap-3 flex-1">
      <div className={`p-2 bg-${stage.color}-600/20 rounded-lg`}>
        <stage.icon className={`w-5 h-5 text-${stage.color}-400`} />
      </div>
      <span className="text-slate-300">{stage.label}</span>
    </div>
    <div className="flex items-center gap-3">
      <span className="text-2xl font-bold text-white">{stage.value}</span>
      <span className="text-sm text-slate-400">件</span>
    </div>
  </div>
))}
```

**実装日**: 11月19日（火）
**担当**: VoiceDriveチーム

---

#### 2.1.4 委員会活動効果の実データ表示（約50行）

```typescript
// OrganizationAnalyticsPage.tsx（220-258行目付近を修正）

{[
  { label: '提出', value: committeeEffectiveness?.submitted || 0, color: 'blue' },
  { label: '審議完了', value: committeeEffectiveness?.reviewed || 0, color: 'purple' },
  { label: '承認', value: committeeEffectiveness?.approved || 0, color: 'green' },
  { label: '実装済み', value: committeeEffectiveness?.implemented || 0, color: 'emerald' },
].map((metric, index) => (
  <div key={index} className="bg-slate-900/50 rounded-lg p-4">
    <div className="text-sm text-slate-400 mb-1">{metric.label}</div>
    <div className={`text-3xl font-bold text-${metric.color}-400`}>
      {metric.value}
    </div>
  </div>
))}

{/* 平均期間 */}
<div className="space-y-3 pt-4 border-t border-slate-700">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2 text-slate-400">
      <Clock className="w-4 h-4" />
      <span className="text-sm">平均審議期間</span>
    </div>
    <span className="text-white font-semibold">{committeeEffectiveness?.avgReviewDays || 0}日</span>
  </div>
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2 text-slate-400">
      <CheckCircle className="w-4 h-4" />
      <span className="text-sm">平均実装期間</span>
    </div>
    <span className="text-white font-semibold">{committeeEffectiveness?.avgImplementDays || 0}日</span>
  </div>
</div>
```

**実装日**: 11月19日（火）
**担当**: VoiceDriveチーム

---

#### 2.1.5 カテゴリ別分析の実データ表示（約50行）

```typescript
// OrganizationAnalyticsPage.tsx（260-309行目付近を修正）

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {categoryData.map((category) => (
    <div
      key={category.id}
      className="bg-slate-900/50 rounded-lg p-4 hover:bg-slate-900/70 transition-colors cursor-pointer"
      onClick={() => setSelectedCategory(category.id)}
    >
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-full mb-3">
        <span className="text-sm font-medium text-blue-400">{category.name}</span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-3xl font-bold text-white">{category.count}</div>
          <div className="text-xs text-slate-400">総議題数</div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-green-400">{category.resolved}</div>
          <div className="text-xs text-slate-400">解決済み</div>
        </div>
      </div>
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span>解決率</span>
          <span>{category.resolutionRate}%</span>
        </div>
        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500"
            style={{ width: `${category.resolutionRate}%` }}
          />
        </div>
      </div>
    </div>
  ))}
</div>
```

**実装日**: 11月20日（水）
**担当**: VoiceDriveチーム

---

#### 2.1.6 部門別活性度の実データ表示（約50行）

```typescript
// OrganizationAnalyticsPage.tsx（311-357行目付近を修正）

<div className="space-y-3">
  {departmentActivity.map((dept, index) => (
    <div
      key={index}
      className="bg-slate-900/50 rounded-lg p-4 hover:bg-slate-900/70 transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-white font-medium">{dept.name}</span>
          {getTrendIcon(dept.trend)}
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-slate-400">投稿数</div>
            <div className="text-lg font-bold text-white">{dept.posts}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-400">議題化</div>
            <div className="text-lg font-bold text-indigo-400">{dept.agenda}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-400">活性度</div>
            <div className={`text-lg font-bold ${getHealthColor(dept.engagement)}`}>
              {dept.engagement}%
            </div>
          </div>
        </div>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${
            dept.engagement >= 80 ? 'bg-green-500' :
            dept.engagement >= 60 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${dept.engagement}%` }}
        />
      </div>
    </div>
  ))}
</div>
```

**実装日**: 11月20日（水）
**担当**: VoiceDriveチーム

---

### 2.2 VoiceDrive - 統合テスト

**実装日**: 11月21日（木）〜22日（金）
**担当**: VoiceDriveチーム

**チェックリスト**:
- [ ] 組織健康度指標の表示確認
- [ ] 議題化プロセスの表示確認
- [ ] 委員会活動効果の表示確認
- [ ] カテゴリ別分析の表示確認
- [ ] 部門別活性度の表示確認
- [ ] 期間切り替え（週次/月次/四半期）動作確認
- [ ] エラーハンドリング確認
- [ ] パフォーマンステスト（ページ読み込み時間3秒以内）

---

## 📂 Phase 3: 高度分析機能実装（11月25日〜29日）

### 3.1 VoiceDrive - OrganizationAnalyticsSnapshot実装

**ファイル**: `C:\projects\voicedrive-v100\prisma\schema.prisma`
**予想行数**: +40行
**実装内容**:

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

**実装日**: 11月25日（月）
**担当**: VoiceDriveチーム
**チェックリスト**:
- [ ] schema.prisma更新
- [ ] マイグレーション実行: `npx prisma migrate dev --name add_organization_analytics_snapshot`
- [ ] prisma generate実行

---

### 3.2 VoiceDrive - 月次バッチ実装

**ファイル**: `C:\projects\voicedrive-v100\src\jobs\saveOrganizationAnalyticsSnapshot.ts`（新規作成）
**予想行数**: 約200行
**実装内容**:

```typescript
// src/jobs/saveOrganizationAnalyticsSnapshot.ts

import { prisma } from '@/lib/prisma';
import { OrganizationAnalyticsService } from '@/services/OrganizationAnalyticsService';
import { fetchDepartments, fetchActiveEmployeeCount } from '@/services/MedicalSystemClient';

/**
 * 組織分析スナップショット保存バッチ
 * 実行頻度: 月次（毎月1日 03:00 JST）
 */
export async function saveOrganizationAnalyticsSnapshot() {
  console.log('[Job] Organization Analytics Snapshot - Start');

  try {
    const service = new OrganizationAnalyticsService();

    // 前月のデータをスナップショット
    const now = new Date();
    const periodEndDate = new Date(now.getFullYear(), now.getMonth(), 0); // 前月末日
    const periodStartDate = new Date(periodEndDate.getFullYear(), periodEndDate.getMonth(), 1); // 前月1日

    console.log(`[Job] Period: ${periodStartDate.toISOString()} - ${periodEndDate.toISOString()}`);

    // 医療システムからデータ取得
    const departments = await fetchDepartments();
    const activeCount = await fetchActiveEmployeeCount();

    // 分析計算
    const [
      organizationHealthMetrics,
      agendaProgressData,
      committeeEffectivenessData,
      categoryAnalysisData,
      departmentActivityData,
    ] = await Promise.all([
      service.calculateOrganizationHealth(periodStartDate, periodEndDate, activeCount.total),
      service.calculateAgendaProgress(periodStartDate, periodEndDate),
      service.calculateCommitteeEffectiveness(periodStartDate, periodEndDate),
      service.calculateCategoryAnalysis(periodStartDate, periodEndDate),
      service.calculateDepartmentActivity(periodStartDate, periodEndDate, departments),
    ]);

    // スナップショット保存
    await prisma.organizationAnalyticsSnapshot.create({
      data: {
        snapshotDate: now,
        periodType: 'monthly',
        periodStartDate,
        periodEndDate,
        organizationHealthMetrics: JSON.stringify(organizationHealthMetrics),
        agendaProgressData: JSON.stringify(agendaProgressData),
        committeeEffectivenessData: JSON.stringify(committeeEffectivenessData),
        categoryAnalysisData: JSON.stringify(categoryAnalysisData),
        departmentActivityData: JSON.stringify(departmentActivityData),
      },
    });

    console.log('[Job] Organization Analytics Snapshot - Success');
  } catch (error) {
    console.error('[Job] Organization Analytics Snapshot - Error:', error);
    throw error;
  }
}
```

**実装日**: 11月26日（火）〜27日（水）
**担当**: VoiceDriveチーム
**チェックリスト**:
- [ ] saveOrganizationAnalyticsSnapshot.tsファイル作成
- [ ] スナップショット保存ロジック実装
- [ ] cron設定（毎月1日 03:00 JST実行）
- [ ] 手動実行テスト
- [ ] エラーハンドリング確認

---

### 3.3 VoiceDrive - トレンド分析実装

**ファイル**: `C:\projects\voicedrive-v100\src\services\OrganizationAnalyticsService.ts`（既存ファイル）
**予想行数**: +150行
**実装内容**:

```typescript
// src/services/OrganizationAnalyticsService.ts

export class OrganizationAnalyticsService {
  // ...

  /**
   * トレンド分析（前月比）
   */
  async calculateTrend(currentPeriodType: 'weekly' | 'monthly' | 'quarterly') {
    // 現在期間のスナップショット
    const currentSnapshot = await prisma.organizationAnalyticsSnapshot.findFirst({
      where: {
        periodType: currentPeriodType,
      },
      orderBy: {
        snapshotDate: 'desc',
      },
    });

    if (!currentSnapshot) {
      return null; // スナップショットがまだない場合
    }

    // 前期のスナップショット
    let previousSnapshotDate: Date;
    if (currentPeriodType === 'weekly') {
      previousSnapshotDate = new Date(
        currentSnapshot.snapshotDate.getTime() - 7 * 24 * 60 * 60 * 1000
      );
    } else if (currentPeriodType === 'monthly') {
      previousSnapshotDate = new Date(
        currentSnapshot.snapshotDate.getFullYear(),
        currentSnapshot.snapshotDate.getMonth() - 1,
        1
      );
    } else {
      // quarterly
      previousSnapshotDate = new Date(
        currentSnapshot.snapshotDate.getFullYear(),
        currentSnapshot.snapshotDate.getMonth() - 3,
        1
      );
    }

    const previousSnapshot = await prisma.organizationAnalyticsSnapshot.findFirst({
      where: {
        periodType: currentPeriodType,
        snapshotDate: {
          gte: previousSnapshotDate,
          lt: currentSnapshot.snapshotDate,
        },
      },
      orderBy: {
        snapshotDate: 'desc',
      },
    });

    if (!previousSnapshot) {
      return null; // 前期のスナップショットがない場合
    }

    // トレンド計算
    const currentHealth = JSON.parse(currentSnapshot.organizationHealthMetrics as string);
    const previousHealth = JSON.parse(previousSnapshot.organizationHealthMetrics as string);

    const trend = {
      voiceActivity: {
        current: currentHealth.voiceActivity,
        previous: previousHealth.voiceActivity,
        change: currentHealth.voiceActivity - previousHealth.voiceActivity,
        direction:
          currentHealth.voiceActivity > previousHealth.voiceActivity
            ? 'up'
            : currentHealth.voiceActivity < previousHealth.voiceActivity
            ? 'down'
            : 'stable',
      },
      participationRate: {
        current: currentHealth.participationRate,
        previous: previousHealth.participationRate,
        change: currentHealth.participationRate - previousHealth.participationRate,
        direction:
          currentHealth.participationRate > previousHealth.participationRate
            ? 'up'
            : currentHealth.participationRate < previousHealth.participationRate
            ? 'down'
            : 'stable',
      },
      // ...他の指標も同様
    };

    return trend;
  }
}
```

**実装日**: 11月27日（水）〜28日（木）
**担当**: VoiceDriveチーム

---

### 3.4 VoiceDrive - 戦略的インサイト実装

**ファイル**: `C:\projects\voicedrive-v100\src\services\OrganizationAnalyticsService.ts`（既存ファイル）
**予想行数**: +200行
**実装内容**:

```typescript
// src/services/OrganizationAnalyticsService.ts

interface StrategicInsight {
  type: 'alert' | 'positive';
  title: string;
  message: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export class OrganizationAnalyticsService {
  // ...

  /**
   * 戦略的インサイト生成
   * GroupAnalytics, AnalyticsAlertとの連携
   */
  async generateStrategicInsights(
    periodStartDate: Date,
    periodEndDate: Date
  ): Promise<StrategicInsight[]> {
    const insights: StrategicInsight[] = [];

    // 1. 高優先度アラートの取得
    const highPriorityAlerts = await prisma.analyticsAlert.findMany({
      where: {
        createdAt: { gte: periodStartDate, lte: periodEndDate },
        severity: { in: ['high', 'critical'] },
        isAcknowledged: false,
      },
      orderBy: {
        severity: 'desc',
      },
      take: 3,
    });

    highPriorityAlerts.forEach((alert) => {
      insights.push({
        type: 'alert',
        title: '注目ポイント',
        message: alert.description,
        severity: alert.severity,
      });
    });

    // 2. 活性度の急激な変化を検出
    const departmentActivityData = await this.calculateDepartmentActivity(
      periodStartDate,
      periodEndDate,
      [] // 部門データは別途取得
    );

    departmentActivityData.forEach((dept) => {
      if (dept.engagement < 60) {
        insights.push({
          type: 'alert',
          title: '注目ポイント',
          message: `${dept.name}の活性度が${dept.engagement}%に低下。人材確保と育成の課題が表面化している可能性があります。`,
          severity: 'medium',
        });
      } else if (dept.engagement >= 85) {
        insights.push({
          type: 'positive',
          title: 'ポジティブな動き',
          message: `${dept.name}で活性度が${dept.engagement}%に上昇。議題の解決率も向上しており、委員会活動が効果的に機能しています。`,
        });
      }
    });

    // 3. 議題カテゴリの急増を検出
    const categoryData = await this.calculateCategoryAnalysis(periodStartDate, periodEndDate);

    categoryData.forEach((category) => {
      if (category.count > 30) {
        insights.push({
          type: 'alert',
          title: '注目ポイント',
          message: `${category.name}関連の議題が${category.count}件に増加。重点的な対応が必要です。`,
          severity: 'medium',
        });
      }
    });

    return insights.slice(0, 4); // 最大4件まで表示
  }
}
```

**実装日**: 11月28日（木）〜29日（金）
**担当**: VoiceDriveチーム

---

### 3.5 VoiceDrive - OrganizationAnalyticsPage修正（トレンド・インサイト追加）

**ファイル**: `C:\projects\voicedrive-v100\src\pages\OrganizationAnalyticsPage.tsx`
**予想行数**: +100行
**実装内容**:

```typescript
// OrganizationAnalyticsPage.tsx

const [strategicInsights, setStrategicInsights] = useState<StrategicInsight[]>([]);

useEffect(() => {
  async function loadAnalytics() {
    // ...既存のデータ取得処理

    // 🆕 戦略的インサイト取得
    const insights = await service.generateStrategicInsights(startDate, endDate);
    setStrategicInsights(insights);
  }

  loadAnalytics();
}, [selectedPeriod]);

// ...

{/* 戦略的インサイト（359-392行目付近を修正） */}
<div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-xl rounded-xl p-6 border border-indigo-500/30">
  <div className="flex items-center gap-2 mb-4">
    <Target className="w-6 h-6 text-indigo-400" />
    <h2 className="text-xl font-bold text-white">戦略的インサイト（AI分析）</h2>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {strategicInsights.map((insight, index) => (
      <div key={index} className="bg-slate-900/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          {insight.type === 'alert' ? (
            <AlertCircle className="w-5 h-5 text-yellow-400 mt-1" />
          ) : (
            <CheckCircle className="w-5 h-5 text-green-400 mt-1" />
          )}
          <div>
            <h3 className="text-white font-semibold mb-2">{insight.title}</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{insight.message}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
```

**実装日**: 11月29日（金）
**担当**: VoiceDriveチーム

---

## 📅 全体スケジュール

```
11月11日（月）: Phase 1開始 - schema.prisma更新、医療システムAPI実装開始
11月12日（火）: OrganizationAnalyticsService実装開始
11月13日（水）: 医療システムAPI実装完了
11月14日（木）: VoiceDrive側統計計算ロジック実装完了
11月15日（金）: Phase 1統合テスト

11月18日（月）: Phase 2開始 - OrganizationAnalyticsPage修正開始
11月19日（火）: 組織健康度指標、議題進捗の実データ表示実装
11月20日（水）: カテゴリ別分析、部門別活性度の実データ表示実装
11月21日（木）: Phase 2統合テスト開始
11月22日（金）: Phase 2統合テスト完了

11月25日（月）: Phase 3開始 - スナップショットテーブル実装
11月26日（火）: 月次バッチ実装開始
11月27日（水）: トレンド分析実装開始
11月28日（木）: 戦略的インサイト実装開始
11月29日（金）: Phase 3統合テスト完了

12月2日（月）〜4日（水）: 全体統合テスト
12月5日（木）: 本番環境デプロイ
12月6日（金）: 組織分析ページ本番リリース 🎉
```

---

## 📊 工数見積サマリー

### VoiceDrive側

| Phase | タスク | 工数（人日） |
|-------|--------|------------|
| Phase 1 | schema.prisma更新 | 0.5 |
| Phase 1 | OrganizationAnalyticsService実装 | 3.0 |
| Phase 1 | 医療システムAPIクライアント実装 | 0.5 |
| Phase 1 | 統合テスト | 1.0 |
| **Phase 1 小計** | | **5.0** |
| Phase 2 | OrganizationAnalyticsPage修正 | 3.0 |
| Phase 2 | 統合テスト | 2.0 |
| **Phase 2 小計** | | **5.0** |
| Phase 3 | スナップショットテーブル実装 | 0.5 |
| Phase 3 | 月次バッチ実装 | 1.5 |
| Phase 3 | トレンド分析実装 | 1.5 |
| Phase 3 | 戦略的インサイト実装 | 1.5 |
| **Phase 3 小計** | | **5.0** |
| **VoiceDrive合計** | | **15.0人日** |

---

### 医療システム側

| Phase | タスク | 工数（人日） |
|-------|--------|------------|
| Phase 1 | API-3実装（部門マスタ） | 2.0 |
| Phase 1 | API-4実装（アクティブ職員数） | 1.5 |
| Phase 1 | 単体テスト | 0.5 |
| **医療システム合計** | | **4.0人日** |

---

### 全体合計

**総工数**: **19.0人日**（約3-4週間）

---

## ✅ 最終チェックリスト

### VoiceDrive側

#### Phase 1
- [ ] schema.prisma更新（実装追跡フィールド）
- [ ] マイグレーション実行
- [ ] OrganizationAnalyticsServiceクラス作成
- [ ] 組織健康度指標計算実装
- [ ] 議題化プロセス計算実装
- [ ] 委員会活動効果計算実装
- [ ] カテゴリ別分析計算実装
- [ ] 部門別活性度計算実装
- [ ] 医療システムAPIクライアント実装
- [ ] Phase 1統合テスト

#### Phase 2
- [ ] OrganizationAnalyticsPage修正（実データ取得）
- [ ] 組織健康度指標の実データ表示
- [ ] 議題化プロセスの実データ表示
- [ ] 委員会活動効果の実データ表示
- [ ] カテゴリ別分析の実データ表示
- [ ] 部門別活性度の実データ表示
- [ ] エラーハンドリング実装
- [ ] Phase 2統合テスト

#### Phase 3
- [ ] OrganizationAnalyticsSnapshotテーブル作成
- [ ] マイグレーション実行
- [ ] 月次バッチ実装
- [ ] cron設定
- [ ] トレンド分析実装
- [ ] 戦略的インサイト実装
- [ ] OrganizationAnalyticsPage修正（トレンド・インサイト追加）
- [ ] Phase 3統合テスト

---

### 医療システム側

- [ ] API-3実装（GET /api/v2/departments）
- [ ] API-4実装（GET /api/v2/employees/active-count）
- [ ] 単体テスト作成
- [ ] API仕様書更新
- [ ] 統合テスト（VoiceDriveチームと合同）

---

## 🎉 プロジェクト完了条件

### 必須条件

1. ✅ 全ての実データが正しく表示される
2. ✅ 期間選択（週次/月次/四半期）が動作する
3. ✅ 医療システムAPI（部門マスタ、アクティブ職員数）が正常動作する
4. ✅ トレンド分析が動作する
5. ✅ 戦略的インサイトが動作する
6. ✅ ページ読み込み時間が3秒以内
7. ✅ エラーハンドリングが適切に機能する

### 推奨条件

1. ✅ 月次バッチが自動実行される
2. ✅ スナップショットデータが正しく保存される
3. ✅ ドキュメント（API仕様書、実装ガイド）が整備される

---

## 📞 連絡体制

### 実装期間中の連絡体制（11月11日〜12月6日）

#### Slack
- **チャンネル**: `#voicedrive-medical-integration`
- **稼働時間**: 平日9:00-18:00（JST）
- **緊急連絡**: DM（24時間対応）

#### MCPサーバー
- **場所**: `mcp-shared/docs/`
- **更新頻度**: 毎営業日

#### ミーティング
- **週次ミーティング**: 毎週月曜 14:00-14:30
- **Phase 1統合テスト**: 11月15日（金） 14:00-16:00
- **Phase 2統合テスト**: 11月22日（金） 14:00-16:00
- **Phase 3統合テスト**: 11月29日（金） 14:00-16:00
- **最終統合テスト**: 12月4日（水） 10:00-12:00

---

## 🙏 謝辞

本マスターリストは、VoiceDrive開発チームと医療職員管理システム開発チームの協力により作成されました。

組織分析ページの成功により、医療現場のDX推進と組織改善がさらに加速することを期待しています。

---

**作成日**: 2025年10月10日
**文書番号**: MASTER-OA-2025-1010-001
**作成者**: VoiceDrive開発チーム
