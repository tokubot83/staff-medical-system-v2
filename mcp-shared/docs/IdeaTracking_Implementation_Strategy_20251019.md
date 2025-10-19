# アイデア追跡（Idea Tracking）実装戦略書

**文書番号**: IT-IMPL-2025-1019-001
**作成日**: 2025年10月19日
**作成者**: 医療システムチーム
**対象**: VoiceDriveチーム
**ステータス**: 実装戦略確定

---

## 📋 エグゼクティブサマリー

### 実装方針: VoiceDrive単独実装（医療システム開発不要）

**決定理由**:
- プロジェクト追跡データはVoiceDrive 100%管轄
- 職員・組織マスタのみ医療システムから参照（既存API流用）
- 医療システム側の追加開発: **ゼロ** 🎉

**実装規模**:
- VoiceDrive側開発工数: 22日間（3フェーズ）
- 医療システム側開発工数: **0日間**
- 総開発コスト: **¥0**（VoiceDrive自社リソース）

---

## 🗄️ データベース実装計画

### Phase 1: スキーマ拡張（Day 1-2、2日間）

#### 1.1 Post テーブル拡張

```prisma
model Post {
  // ... 既存フィールド ...

  // プロジェクトモード用（拡張）
  projectScore              Int?      @default(0) @map("project_score")
  projectLevel              String?   @map("project_level")  // ✅ 既存あり
  currentProjectLevelStartedAt DateTime? @map("current_project_level_started_at")
  lastProjectLevelUpgrade   DateTime? @map("last_project_level_upgrade")

  // エンゲージメント統計（キャッシュ、パフォーマンス最適化）
  totalEngagements          Int       @default(0) @map("total_engagements")
  stronglySupportCount      Int       @default(0) @map("strongly_support_count")
  supportCount              Int       @default(0) @map("support_count")
  neutralCount              Int       @default(0) @map("neutral_count")
  opposeCount               Int       @default(0) @map("oppose_count")
  stronglyOpposeCount       Int       @default(0) @map("strongly_oppose_count")

  // リレーション（追加）
  projectLevelHistory       ProjectLevelHistory[]

  @@index([projectScore])
  @@index([currentProjectLevelStartedAt])
}
```

**実装コマンド**:
```bash
# schema.prisma 編集後
npx prisma format
npx prisma migrate dev --name add-project-tracking-fields
```

#### 1.2 ProjectLevelHistory テーブル新規作成

```prisma
model ProjectLevelHistory {
  id              String    @id @default(cuid())
  postId          String    @map("post_id")

  // レベル変更
  fromLevel       String?   @map("from_level")  // PENDING, TEAM, DEPARTMENT, FACILITY, ORGANIZATION
  toLevel         String    @map("to_level")    // PENDING, TEAM, DEPARTMENT, FACILITY, ORGANIZATION

  // スコア記録
  fromScore       Int?      @map("from_score")
  toScore         Int       @map("to_score")

  // トリガー情報
  triggeredBy     String?   @map("triggered_by")      // vote_received, committee_submission, manual_upgrade
  triggeringUserId String?  @map("triggering_user_id") // 昇格のトリガーとなった投票者ID

  // タイムスタンプ
  upgradedAt      DateTime  @default(now()) @map("upgraded_at")

  // メタデータ
  notes           String?   // 備考（手動昇格時の理由など）

  // リレーション
  post            Post      @relation(fields: [postId], references: [id], onDelete: Cascade)

  @@index([postId])
  @@index([toLevel])
  @@index([upgradedAt])
  @@map("project_level_history")
}
```

**データ量試算（5年間）**:
- 総投稿数: 約5,000件（年間1,000件 × 5年）
- レベル変更平均: 投稿あたり2回（PENDING → TEAM → DEPARTMENT）
- ProjectLevelHistoryレコード数: 約10,000件
- 推定データ量: 約5MB

---

### Phase 2: 設定統一（Day 3、1日間）

#### 2.1 閾値統一（ProjectScoring.ts 修正）

**現状の不整合**:
| レベル | ProjectScoring.ts | UI側 |
|--------|-------------------|------|
| TEAM | 50 | **100** |
| DEPARTMENT | 100 | **200** |
| FACILITY | 300 | **400** |
| ORGANIZATION | 600 | **800** |

**対応**: 設定ファイル一元管理

```typescript
// src/config/projectThresholds.ts（新規作成）
export const PROJECT_THRESHOLDS = {
  TEAM: 100,
  DEPARTMENT: 200,
  FACILITY: 400,
  ORGANIZATION: 800
} as const;

export type ProjectLevel =
  | 'PENDING'
  | 'TEAM'
  | 'DEPARTMENT'
  | 'FACILITY'
  | 'ORGANIZATION';

export const getProjectLevelFromScore = (score: number): ProjectLevel => {
  if (score >= PROJECT_THRESHOLDS.ORGANIZATION) return 'ORGANIZATION';
  if (score >= PROJECT_THRESHOLDS.FACILITY) return 'FACILITY';
  if (score >= PROJECT_THRESHOLDS.DEPARTMENT) return 'DEPARTMENT';
  if (score >= PROJECT_THRESHOLDS.TEAM) return 'TEAM';
  return 'PENDING';
};

export const getNextLevelThreshold = (
  currentLevel: ProjectLevel
): { nextLevel: ProjectLevel; threshold: number } | null => {
  const levels: Array<{ level: ProjectLevel; threshold: number }> = [
    { level: 'TEAM', threshold: PROJECT_THRESHOLDS.TEAM },
    { level: 'DEPARTMENT', threshold: PROJECT_THRESHOLDS.DEPARTMENT },
    { level: 'FACILITY', threshold: PROJECT_THRESHOLDS.FACILITY },
    { level: 'ORGANIZATION', threshold: PROJECT_THRESHOLDS.ORGANIZATION }
  ];

  const currentIndex = levels.findIndex(l => l.level === currentLevel);
  return levels[currentIndex + 1] || null;
};
```

**修正箇所**:
- `src/utils/ProjectScoring.ts`: baseThresholds を PROJECT_THRESHOLDS に置き換え
- `src/services/ProjectPermissionService.ts`: getProjectLevelFromScore() を共通関数に置き換え
- `src/pages/IdeaVoiceTrackingPage.tsx`: getScoreToNextLevel() を共通関数に置き換え

---

### Phase 3: API実装（Day 4-10、7日間）

#### 3.1 GET /api/my/ideas 実装

**実装ファイル**: `src/routes/myIdeaRoutes.ts`（新規作成）

```typescript
// src/routes/myIdeaRoutes.ts
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateJWT } from '../middleware/auth';
import { calculateProjectScore } from '../utils/ProjectScoring';
import { getProjectLevelFromScore } from '../config/projectThresholds';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/my/ideas', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user!.id;
    const {
      limit = 50,
      offset = 0,
      filter = 'all',
      orderBy = 'createdAt_desc'
    } = req.query;

    // 1. 自分の投稿を取得（type='improvement'のみ）
    const posts = await prisma.post.findMany({
      where: {
        authorId: userId,
        type: 'improvement'
      },
      include: {
        voteHistory: {
          include: {
            user: {
              select: {
                permissionLevel: true
              }
            }
          }
        }
      },
      take: Number(limit),
      skip: Number(offset),
      orderBy: getOrderBy(String(orderBy))
    });

    // 2. 各投稿のプロジェクトスコア・レベルを計算
    const ideasWithScores = posts.map(post => {
      const engagements = convertVotesToEngagements(post.voteHistory);
      const projectScore = calculateProjectScore(
        engagements,
        post.proposalType || 'operational'
      );
      const projectLevel = getProjectLevelFromScore(projectScore);
      const isProjectized = projectScore >= 100;

      return {
        id: post.id,
        content: post.content,
        type: post.type,
        proposalType: post.proposalType,
        projectScore,
        projectLevel,
        currentProjectLevelStartedAt: post.currentProjectLevelStartedAt,
        lastProjectLevelUpgrade: post.lastProjectLevelUpgrade,
        totalEngagements: post.totalEngagements,
        stronglySupportCount: post.stronglySupportCount,
        supportCount: post.supportCount,
        neutralCount: post.neutralCount,
        opposeCount: post.opposeCount,
        stronglyOpposeCount: post.stronglyOpposeCount,
        supportRate: calculateSupportRate(post),
        isProjectized,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt
      };
    });

    // 3. フィルタ適用
    const filteredIdeas = applyFilter(ideasWithScores, String(filter));

    // 4. 統計サマリー計算
    const stats = {
      total: ideasWithScores.length,
      pending: ideasWithScores.filter(i => !i.isProjectized).length,
      projectized: ideasWithScores.filter(i => i.isProjectized).length,
      avgScore: Math.round(
        ideasWithScores.reduce((sum, i) => sum + i.projectScore, 0) /
        ideasWithScores.length
      )
    };

    res.json({
      success: true,
      data: filteredIdeas,
      stats,
      pagination: {
        total: filteredIdeas.length,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: filteredIdeas.length >= Number(limit)
      }
    });
  } catch (error) {
    console.error('[GET /api/my/ideas]', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;
```

**実装工数**: 3日間

#### 3.2 GET /api/posts/:postId/project-level-history 実装

**実装ファイル**: `src/routes/projectRoutes.ts`（既存拡張）

```typescript
// src/routes/projectRoutes.ts（追加）
router.get('/posts/:postId/project-level-history', authenticateJWT, async (req, res) => {
  try {
    const { postId } = req.params;

    // 投稿の存在確認
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    // レベル履歴取得（降順）
    const history = await prisma.projectLevelHistory.findMany({
      where: { postId },
      orderBy: { upgradedAt: 'desc' },
      include: {
        triggeringUser: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('[GET /api/posts/:postId/project-level-history]', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});
```

**実装工数**: 1日間

#### 3.3 POST /api/posts/:postId/recalculate-project-score 実装

**実装ファイル**: `src/routes/adminRoutes.ts`（既存拡張）

```typescript
// src/routes/adminRoutes.ts（追加）
router.post(
  '/posts/:postId/recalculate-project-score',
  authenticateJWT,
  requirePermissionLevel(11), // 事務長以上
  async (req, res) => {
    try {
      const { postId } = req.params;
      const { reason } = req.body;

      // 投稿取得
      const post = await prisma.post.findUnique({
        where: { id: postId },
        include: {
          voteHistory: {
            include: {
              user: {
                select: {
                  permissionLevel: true
                }
              }
            }
          }
        }
      });

      if (!post) {
        return res.status(404).json({
          success: false,
          error: 'Post not found'
        });
      }

      // スコア再計算
      const oldScore = post.projectScore || 0;
      const oldLevel = post.projectLevel || 'PENDING';

      const engagements = convertVotesToEngagements(post.voteHistory);
      const newScore = calculateProjectScore(
        engagements,
        post.proposalType || 'operational'
      );
      const newLevel = getProjectLevelFromScore(newScore);

      // Post更新
      await prisma.post.update({
        where: { id: postId },
        data: {
          projectScore: newScore,
          projectLevel: newLevel
        }
      });

      // レベル変更があればProjectLevelHistory記録
      if (oldLevel !== newLevel) {
        await prisma.projectLevelHistory.create({
          data: {
            postId,
            fromLevel: oldLevel,
            toLevel: newLevel,
            fromScore: oldScore,
            toScore: newScore,
            triggeredBy: 'manual_recalculation',
            notes: reason
          }
        });
      }

      res.json({
        success: true,
        data: {
          postId,
          oldScore,
          newScore,
          oldLevel,
          newLevel,
          levelChanged: oldLevel !== newLevel,
          recalculatedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('[POST /api/posts/:postId/recalculate-project-score]', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
);
```

**実装工数**: 1日間

#### 3.4 POST /api/projects/:postId/approve 実装

**実装ファイル**: `src/routes/projectRoutes.ts`（既存拡張）

```typescript
// src/routes/projectRoutes.ts（追加）
router.post('/projects/:postId/approve', authenticateJWT, async (req, res) => {
  try {
    const { postId } = req.params;
    const { approvalType = 'standard', comments } = req.body;
    const userId = req.user!.id;

    // 投稿取得
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    // 権限チェック
    const permission = projectPermissionService.getPermission(
      req.user!,
      post.projectLevel as ProjectLevel
    );

    if (!permission.canApprove) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions to approve this project level'
      });
    }

    // ProjectApproval作成
    const approval = await prisma.projectApproval.create({
      data: {
        postId,
        projectLevel: post.projectLevel!,
        projectScore: post.projectScore!,
        approverId: userId,
        approvalType,
        comments
      }
    });

    // Post更新
    await prisma.post.update({
      where: { id: postId },
      data: {
        approvalStatus: 'approved',
        approvedAt: new Date(),
        approvedBy: userId
      }
    });

    // 投稿者に通知
    await notificationService.sendProjectApprovedNotification(
      post.authorId,
      postId,
      post.projectLevel!
    );

    res.json({
      success: true,
      data: {
        approvalId: approval.id,
        postId,
        projectLevel: post.projectLevel,
        projectScore: post.projectScore,
        approverId: userId,
        approvedAt: approval.approvedAt,
        approvalType
      }
    });
  } catch (error) {
    console.error('[POST /api/projects/:postId/approve]', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});
```

**実装工数**: 2日間

---

### Phase 4: 自動処理実装（Day 11-15、5日間）

#### 4.1 投票受付時の自動スコア再計算

**実装ファイル**: `src/routes/voteRoutes.ts`（既存拡張）

```typescript
// src/routes/voteRoutes.ts（既存の投票API拡張）
router.post('/posts/:postId/vote', authenticateJWT, async (req, res) => {
  try {
    const { postId } = req.params;
    const { voteOption } = req.body;
    const userId = req.user!.id;

    // 1. 投票記録（既存処理）
    await prisma.voteHistory.create({
      data: {
        userId,
        postId,
        voteOption,
        voteWeight: calculateVoteWeight(req.user!.permissionLevel)
      }
    });

    // 2. プロジェクトスコア再計算（追加処理）
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        voteHistory: {
          include: {
            user: {
              select: {
                permissionLevel: true
              }
            }
          }
        }
      }
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    // 3. エンゲージメント統計更新
    const engagementStats = calculateEngagementStats(post.voteHistory);

    const oldScore = post.projectScore || 0;
    const oldLevel = post.projectLevel || 'PENDING';

    const engagements = convertVotesToEngagements(post.voteHistory);
    const newScore = calculateProjectScore(
      engagements,
      post.proposalType || 'operational'
    );
    const newLevel = getProjectLevelFromScore(newScore);

    // 4. Post更新
    await prisma.post.update({
      where: { id: postId },
      data: {
        projectScore: newScore,
        projectLevel: newLevel,
        ...engagementStats // totalEngagements, stronglySupportCount 等
      }
    });

    // 5. レベル変更があればProjectLevelHistory記録
    if (oldLevel !== newLevel) {
      await prisma.projectLevelHistory.create({
        data: {
          postId,
          fromLevel: oldLevel,
          toLevel: newLevel,
          fromScore: oldScore,
          toScore: newScore,
          triggeredBy: 'vote_received',
          triggeringUserId: userId
        }
      });

      // 6. 投稿者にリアルタイム通知（WebSocket）
      await webSocketService.sendProjectLevelUpgraded({
        postId,
        authorId: post.authorId,
        fromLevel: oldLevel,
        toLevel: newLevel,
        fromScore: oldScore,
        toScore: newScore
      });
    }

    res.json({
      success: true,
      data: {
        voteRecorded: true,
        projectScore: newScore,
        projectLevel: newLevel,
        levelChanged: oldLevel !== newLevel
      }
    });
  } catch (error) {
    console.error('[POST /posts/:postId/vote]', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});
```

**実装工数**: 2日間

#### 4.2 ProjectLevelUpgradeService 実装

**実装ファイル**: `src/services/ProjectLevelUpgradeService.ts`（新規作成）

```typescript
// src/services/ProjectLevelUpgradeService.ts
import { PrismaClient } from '@prisma/client';
import { getProjectLevelFromScore } from '../config/projectThresholds';
import { webSocketService } from './WebSocketService';

const prisma = new PrismaClient();

export class ProjectLevelUpgradeService {
  /**
   * プロジェクトレベル昇格判定・記録
   */
  async checkAndUpgradeLevel(
    postId: string,
    newScore: number,
    triggeredBy: string,
    triggeringUserId?: string
  ): Promise<{
    upgraded: boolean;
    oldLevel: string | null;
    newLevel: string;
  }> {
    // 投稿取得
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      throw new Error('Post not found');
    }

    const oldLevel = post.projectLevel || 'PENDING';
    const newLevel = getProjectLevelFromScore(newScore);

    // レベル変更なし
    if (oldLevel === newLevel) {
      return {
        upgraded: false,
        oldLevel,
        newLevel
      };
    }

    // 1. Post更新
    await prisma.post.update({
      where: { id: postId },
      data: {
        projectLevel: newLevel,
        currentProjectLevelStartedAt: new Date(),
        lastProjectLevelUpgrade: new Date()
      }
    });

    // 2. ProjectLevelHistory記録
    await prisma.projectLevelHistory.create({
      data: {
        postId,
        fromLevel: oldLevel,
        toLevel: newLevel,
        fromScore: post.projectScore || 0,
        toScore: newScore,
        triggeredBy,
        triggeringUserId
      }
    });

    // 3. 投稿者にリアルタイム通知
    await webSocketService.sendProjectLevelUpgraded({
      postId,
      authorId: post.authorId,
      fromLevel: oldLevel,
      toLevel: newLevel,
      fromScore: post.projectScore || 0,
      toScore: newScore,
      message: `おめでとうございます！あなたのアイデアが${newLevel}レベルに到達しました。`
    });

    return {
      upgraded: true,
      oldLevel,
      newLevel
    };
  }
}

export const projectLevelUpgradeService = new ProjectLevelUpgradeService();
```

**実装工数**: 2日間

#### 4.3 WebSocket通知実装

**実装ファイル**: `src/services/WebSocketService.ts`（既存拡張）

```typescript
// src/services/WebSocketService.ts（追加）
async sendProjectLevelUpgraded(data: {
  postId: string;
  authorId: string;
  fromLevel: string;
  toLevel: string;
  fromScore: number;
  toScore: number;
  message: string;
}): Promise<void> {
  const payload = {
    type: 'project_level_upgraded',
    data: {
      postId: data.postId,
      fromLevel: data.fromLevel,
      toLevel: data.toLevel,
      fromScore: data.fromScore,
      toScore: data.toScore,
      upgradedAt: new Date().toISOString(),
      message: data.message
    }
  };

  // 投稿者に送信
  this.sendToUser(data.authorId, payload);

  // 管理者にも通知（Level 11以上）
  this.broadcastToPermissionLevel(11, payload);
}
```

**実装工数**: 1日間

---

### Phase 5: フロントエンド統合（Day 16-22、7日間）

#### 5.1 IdeaVoiceTrackingPage.tsx からデモデータ削除

**変更箇所**:
```typescript
// src/pages/IdeaVoiceTrackingPage.tsx

// 削除: getDemoMyIdeas() 呼び出し
const loadMyIdeas = async () => {
  setLoading(true);
  try {
    // 実API呼び出し
    const response = await fetch('/api/my/ideas', {
      headers: {
        'Authorization': `Bearer ${user?.token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch my ideas');
    }

    const result = await response.json();
    setMyIdeas(result.data);
    setStats(result.stats);
  } catch (error) {
    console.error('[loadMyIdeas]', error);
    alert('アイデア一覧の取得に失敗しました。');
  } finally {
    setLoading(false);
  }
};
```

**実装工数**: 1日間

#### 5.2 プロジェクトレベル履歴表示追加

**実装ファイル**: `src/components/ProjectLevelHistoryModal.tsx`（新規作成）

```typescript
// src/components/ProjectLevelHistoryModal.tsx
interface ProjectLevelHistoryModalProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectLevelHistoryModal: React.FC<ProjectLevelHistoryModalProps> = ({
  postId,
  isOpen,
  onClose
}) => {
  const [history, setHistory] = useState<ProjectLevelHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen, postId]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/posts/${postId}/project-level-history`);
      const result = await response.json();
      setHistory(result.data);
    } catch (error) {
      console.error('[loadHistory]', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">📊 プロジェクトレベル履歴</h2>

        {loading ? (
          <div>読み込み中...</div>
        ) : (
          <div className="space-y-3">
            {history.map(item => (
              <div key={item.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold">
                    {item.fromLevel || '作成'} → {item.toLevel}
                  </span>
                  <span className="text-sm text-gray-400">
                    {formatDate(item.upgradedAt)}
                  </span>
                </div>
                <div className="text-sm text-gray-300">
                  スコア: {item.fromScore || 0} → {item.toScore} ポイント
                </div>
                {item.triggeredBy === 'vote_received' && (
                  <div className="text-xs text-gray-400 mt-1">
                    🗳️ 投票により自動昇格
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};
```

**実装工数**: 2日間

#### 5.3 WebSocket通知受信実装

**実装ファイル**: `src/hooks/useProjectNotifications.ts`（新規作成）

```typescript
// src/hooks/useProjectNotifications.ts
import { useEffect } from 'react';
import { useWebSocket } from './useWebSocket';

export const useProjectNotifications = () => {
  const { subscribe, unsubscribe } = useWebSocket();

  useEffect(() => {
    const handleProjectLevelUpgraded = (data: any) => {
      // トースト通知表示
      showToast({
        type: 'success',
        title: 'プロジェクトレベル昇格！',
        message: data.message,
        duration: 10000 // 10秒表示
      });

      // 効果音再生
      playSound('level-up');
    };

    subscribe('project_level_upgraded', handleProjectLevelUpgraded);

    return () => {
      unsubscribe('project_level_upgraded', handleProjectLevelUpgraded);
    };
  }, []);
};
```

**実装工数**: 2日間

#### 5.4 統合テスト

**テストシナリオ**:
1. 投稿作成 → PENDINGレベル確認
2. 10人がstrongly-support投票 → TEAMレベル昇格確認
3. プロジェクトレベル履歴表示 → 昇格記録確認
4. WebSocket通知受信 → トースト表示確認

**実装工数**: 2日間

---

## 📊 実装スケジュール

### 全体スケジュール（22日間）

| Phase | 期間 | 内容 | 担当 | 工数 |
|-------|------|------|------|------|
| **Phase 1** | Day 1-2 | スキーマ拡張 | VoiceDrive | 2日 |
| **Phase 2** | Day 3 | 設定統一 | VoiceDrive | 1日 |
| **Phase 3** | Day 4-10 | API実装 | VoiceDrive | 7日 |
| **Phase 4** | Day 11-15 | 自動処理実装 | VoiceDrive | 5日 |
| **Phase 5** | Day 16-22 | フロントエンド統合 | VoiceDrive | 7日 |

### 詳細スケジュール

#### Week 1（Day 1-5）

| Day | 作業内容 | 成果物 |
|-----|---------|--------|
| **Day 1** | Post拡張、ProjectLevelHistory作成 | Prismaスキーマ |
| **Day 2** | マイグレーション実行、初期データ投入 | DBテーブル |
| **Day 3** | 設定統一（projectThresholds.ts作成） | 設定ファイル |
| **Day 4** | GET /api/my/ideas 実装（Day 1/3） | API実装50% |
| **Day 5** | GET /api/my/ideas 実装（Day 2/3） | API実装75% |

#### Week 2（Day 6-10）

| Day | 作業内容 | 成果物 |
|-----|---------|--------|
| **Day 6** | GET /api/my/ideas 完了、テスト | API実装100% |
| **Day 7** | GET /api/posts/:postId/project-level-history 実装 | API実装 |
| **Day 8** | POST /api/posts/:postId/recalculate-project-score 実装 | 管理API |
| **Day 9** | POST /api/projects/:postId/approve 実装（Day 1/2） | API実装50% |
| **Day 10** | POST /api/projects/:postId/approve 完了、テスト | API実装100% |

#### Week 3（Day 11-15）

| Day | 作業内容 | 成果物 |
|-----|---------|--------|
| **Day 11** | 投票API拡張（スコア再計算追加）（Day 1/2） | 自動処理50% |
| **Day 12** | 投票API拡張完了、テスト | 自動処理75% |
| **Day 13** | ProjectLevelUpgradeService 実装（Day 1/2） | サービス実装50% |
| **Day 14** | ProjectLevelUpgradeService 完了、テスト | サービス実装100% |
| **Day 15** | WebSocket通知実装、テスト | 通知機能完了 |

#### Week 4（Day 16-22）

| Day | 作業内容 | 成果物 |
|-----|---------|--------|
| **Day 16** | IdeaVoiceTrackingPage デモデータ削除 | 実API統合 |
| **Day 17** | ProjectLevelHistoryModal 実装（Day 1/2） | UI実装50% |
| **Day 18** | ProjectLevelHistoryModal 完了、テスト | UI実装100% |
| **Day 19** | useProjectNotifications 実装（Day 1/2） | WebSocket統合50% |
| **Day 20** | useProjectNotifications 完了、テスト | WebSocket統合100% |
| **Day 21** | 統合テスト（Day 1/2） | テスト実施 |
| **Day 22** | 統合テスト完了、最終確認 | Phase 5完了 |

---

## 💰 コスト見積もり

### VoiceDrive側

| 項目 | 工数 | 単価 | 金額 |
|------|------|------|------|
| Phase 1: スキーマ拡張 | 2日 | 自社リソース | ¥0 |
| Phase 2: 設定統一 | 1日 | 自社リソース | ¥0 |
| Phase 3: API実装 | 7日 | 自社リソース | ¥0 |
| Phase 4: 自動処理実装 | 5日 | 自社リソース | ¥0 |
| Phase 5: フロントエンド統合 | 7日 | 自社リソース | ¥0 |
| **合計** | **22日** | | **¥0** |

### 医療システム側

| 項目 | 工数 | 単価 | 金額 |
|------|------|------|------|
| API開発 | 0日 | ¥40,000/日 | **¥0** |
| Webhook実装 | 0日 | ¥40,000/日 | **¥0** |
| **合計** | **0日** | | **¥0** |

### 総コスト

**¥0**（VoiceDrive自社リソースで実装）

---

## 🚨 リスクと対策

### リスク1: ProjectLevelHistory の大量データ蓄積

**リスク**: 5年間で約10,000レコード蓄積

**対策**:
- インデックス最適化（postId, toLevel, upgradedAt）
- クエリ最適化（LIMIT句で最新20件のみ取得）
- データ量は5MBと小規模、パフォーマンス問題なし

### リスク2: 閾値の不整合によるバグ

**リスク**: ProjectScoring.ts と UI側の閾値が異なる

**対策**:
- Phase 2で設定ファイル一元管理（projectThresholds.ts）
- 両方の箇所を共通関数に置き換え
- ユニットテストで閾値の一貫性を確認

### リスク3: 投票時の自動スコア再計算のパフォーマンス

**リスク**: 投票API が重くなる

**対策**:
- エンゲージメント統計のキャッシュフィールド使用（totalEngagements等）
- VoteHistory の都度集計を避ける
- 非同期ジョブ化も検討（投票後、バックグラウンドでスコア更新）

### リスク4: WebSocket通知の配信失敗

**リスク**: 投稿者がオフライン時、昇格通知が届かない

**対策**:
- WebSocket送信失敗時、メール通知にフォールバック
- 次回ログイン時に未読通知を表示
- プロジェクトレベル履歴で後から確認可能

---

## 📋 実装チェックリスト

### Phase 1: スキーマ拡張

- [ ] Post テーブルにフィールド追加
  - [ ] `projectScore` (Int, default: 0)
  - [ ] `currentProjectLevelStartedAt` (DateTime, nullable)
  - [ ] `lastProjectLevelUpgrade` (DateTime, nullable)
  - [ ] `totalEngagements` (Int, default: 0)
  - [ ] `stronglySupportCount` (Int, default: 0)
  - [ ] `supportCount` (Int, default: 0)
  - [ ] `neutralCount` (Int, default: 0)
  - [ ] `opposeCount` (Int, default: 0)
  - [ ] `stronglyOpposeCount` (Int, default: 0)
- [ ] Post テーブルにインデックス追加
  - [ ] `@@index([projectScore])`
  - [ ] `@@index([currentProjectLevelStartedAt])`
- [ ] ProjectLevelHistory テーブル作成
- [ ] Prismaマイグレーション実行
- [ ] 初期データ投入（既存投稿のprojectScore計算）

### Phase 2: 設定統一

- [ ] `src/config/projectThresholds.ts` 作成
- [ ] `getProjectLevelFromScore()` 共通関数実装
- [ ] `getNextLevelThreshold()` 共通関数実装
- [ ] ProjectScoring.ts 修正（共通関数使用）
- [ ] ProjectPermissionService.ts 修正（共通関数使用）
- [ ] IdeaVoiceTrackingPage.tsx 修正（共通関数使用）

### Phase 3: API実装

- [ ] `GET /api/my/ideas` 実装
  - [ ] クエリパラメータ処理（filter, orderBy）
  - [ ] プロジェクトスコア計算
  - [ ] 統計サマリー計算
  - [ ] ページネーション
- [ ] `GET /api/posts/:postId/project-level-history` 実装
- [ ] `POST /api/posts/:postId/recalculate-project-score` 実装（管理用）
- [ ] `POST /api/projects/:postId/approve` 実装

### Phase 4: 自動処理実装

- [ ] 投票API拡張（スコア再計算追加）
  - [ ] エンゲージメント統計更新
  - [ ] プロジェクトスコア再計算
  - [ ] レベル昇格判定
  - [ ] ProjectLevelHistory記録
- [ ] ProjectLevelUpgradeService 実装
- [ ] WebSocket通知実装（project_level_upgraded）

### Phase 5: フロントエンド統合

- [ ] IdeaVoiceTrackingPage.tsx デモデータ削除
- [ ] 実API統合（GET /api/my/ideas）
- [ ] ProjectLevelHistoryModal 実装
- [ ] useProjectNotifications 実装
- [ ] 統合テスト

---

## 📖 関連ドキュメント

- **IT-ML-2025-1018-001**: アイデア追跡暫定マスターリスト
- **IT-DB-2025-1018-001**: アイデア追跡DB要件分析
- **DM-DEF-2025-1008-001**: データ管理責任分界点定義書

---

**文書終了**
