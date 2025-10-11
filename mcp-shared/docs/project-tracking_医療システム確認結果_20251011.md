# ProjectTracking（プロジェクト追跡）医療システム確認結果

**作成日**: 2025年10月11日
**対象ページ**: ProjectTracking（プロジェクト追跡）
**確認者**: Claude Code
**ステータス**: 確認完了 ✅

---

## エグゼクティブサマリー

ProjectTracking（プロジェクト追跡）ページは、ユーザーが自分の投稿・投票・参加したプロジェクトを一覧表示する機能です。

**結論**: 医療職員管理システムでの追加実装は**不要**です。

- ✅ 医療システムAPIは**一切不要**（VoiceDrive内部データのみ使用）
- ✅ 新しいテーブル追加は**不要**（既存Post/Vote/Commentテーブルで実装可能）
- ⚠️ パフォーマンス最適化のため**2つの複合インデックス追加を推奨**
- 🔧 VoiceDrive側で4つのAPI実装が必要

---

## 1. 暫定マスターリスト分析結果

### 1.1 ページ概要
- **対象ユーザー**: 全ユーザー（Level 1-18）
- **主要機能**:
  - 提案したプロジェクト一覧表示
  - 投票したプロジェクト一覧表示
  - 参加したプロジェクト一覧表示
  - アクティビティ統計表示

### 1.2 データソース分析

| データ種別 | 使用テーブル | 医療システム依存 |
|-----------|------------|----------------|
| 投稿プロジェクト | VoiceDrive.Post | ❌ 不要 |
| 投票情報 | VoiceDrive.Vote | ❌ 不要 |
| コメント参加情報 | VoiceDrive.Comment | ❌ 不要 |
| ユーザー情報 | VoiceDrive.User | ❌ 不要 |

**結論**: すべてVoiceDrive内部データで完結するため、医療システムとの連携は不要です。

### 1.3 テーブル要件分析

**新規テーブル**: なし（既存テーブルのみ使用）

**既存テーブル拡張**: なし

**パフォーマンス最適化**: 以下の2つの複合インデックス追加を推奨

#### 推奨インデックス1: Post.authorId複合インデックス
```prisma
model Post {
  // ... 既存フィールド

  @@index([authorId, type, createdAt])  // 新規追加
}
```

**理由**:
- `GET /api/project-tracking/my-projects`で`authorId`と`type='project'`による絞り込み頻繁
- `createdAt`ソートが必須
- 複合インデックスにより約10-50倍のパフォーマンス向上を期待

#### 推奨インデックス2: Vote.userId複合インデックス
```prisma
model Vote {
  // ... 既存フィールド

  @@index([userId, timestamp])  // 新規追加
}
```

**理由**:
- `GET /api/project-tracking/voted-projects`で`userId`による絞り込み頻繁
- `timestamp`ソートが必須
- 投票データは増加速度が速いため、インデックスなしではN秒単位の遅延発生リスク

---

## 2. 医療システム側の対応不要項目

### 2.1 新規API不要
ProjectTrackingページは以下のような医療システムデータを必要としません：

- ❌ 施設情報（facilities）
- ❌ 部門情報（departments）
- ❌ 職員情報（employees）
- ❌ 役職情報（positions）
- ❌ 権限情報（permissions）

### 2.2 既存API流用不要
既存の医療システムAPIも使用しません：

- `/api/v2/facilities` - 不要
- `/api/v2/departments` - 不要
- `/api/v2/employees` - 不要

すべてVoiceDrive内部で完結します。

---

## 3. VoiceDrive側実装推奨事項

### 3.1 データベースマイグレーション（優先度: 高）

#### マイグレーション1: Post複合インデックス追加
```sql
-- Migration: add_post_author_type_created_index
-- Description: ProjectTracking "提案したプロジェクト"クエリ最適化

CREATE INDEX "Post_authorId_type_createdAt_idx"
ON "Post"("authorId", "type", "createdAt" DESC);
```

**実行タイミング**: Phase 1実装前（必須）

**影響範囲**:
- テーブルサイズによりインデックス作成に5-30秒程度
- ダウンタイムなし（オンラインインデックス作成）
- ディスク使用量: Postレコード数 × 約50バイト増加

#### マイグレーション2: Vote複合インデックス追加
```sql
-- Migration: add_vote_user_timestamp_index
-- Description: ProjectTracking "投票したプロジェクト"クエリ最適化

CREATE INDEX "Vote_userId_timestamp_idx"
ON "Vote"("userId", "timestamp" DESC);
```

**実行タイミング**: Phase 1実装前（必須）

**影響範囲**:
- テーブルサイズによりインデックス作成に3-20秒程度
- ダウンタイムなし
- ディスク使用量: Voteレコード数 × 約50バイト増加

### 3.2 サービス層実装（優先度: 高）

#### ProjectTrackingService実装例
```typescript
// src/services/ProjectTrackingService.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ProjectTrackingService {
  /**
   * ユーザーが提案したプロジェクト一覧取得
   */
  async getMyProjects(userId: string, options: {
    limit?: number;
    offset?: number;
    status?: 'active' | 'completed' | 'archived';
  }) {
    const { limit = 10, offset = 0, status } = options;

    // WHERE条件構築
    const where: any = {
      authorId: userId,
      type: 'project'
    };

    if (status) {
      where.status = status;
    }

    // 一覧取得（複合インデックス使用）
    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
      include: {
        _count: {
          select: {
            votes: true,
            comments: true
          }
        }
      }
    });

    // 総件数取得
    const totalCount = await prisma.post.count({ where });

    return {
      projects: posts.map(post => ({
        id: post.id,
        title: post.title,
        description: post.description,
        status: post.status,
        createdAt: post.createdAt,
        votesCount: post._count.votes,
        commentsCount: post._count.comments
      })),
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    };
  }

  /**
   * ユーザーが投票したプロジェクト一覧取得
   */
  async getVotedProjects(userId: string, options: {
    limit?: number;
    offset?: number;
  }) {
    const { limit = 10, offset = 0 } = options;

    // 投票情報取得（複合インデックス使用）
    const votes = await prisma.vote.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      skip: offset,
      take: limit,
      include: {
        post: {
          include: {
            _count: {
              select: {
                votes: true,
                comments: true
              }
            }
          }
        }
      }
    });

    // 総件数取得
    const totalCount = await prisma.vote.count({
      where: { userId }
    });

    return {
      projects: votes
        .filter(vote => vote.post?.type === 'project')
        .map(vote => ({
          id: vote.post.id,
          title: vote.post.title,
          description: vote.post.description,
          status: vote.post.status,
          votedAt: vote.timestamp,
          myScore: vote.score,
          totalVotesCount: vote.post._count.votes,
          commentsCount: vote.post._count.comments
        })),
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    };
  }

  /**
   * ユーザーがコメント参加したプロジェクト一覧取得
   */
  async getJoinedProjects(userId: string, options: {
    limit?: number;
    offset?: number;
  }) {
    const { limit = 10, offset = 0 } = options;

    // コメント参加プロジェクト取得
    const comments = await prisma.comment.findMany({
      where: {
        authorId: userId,
        post: {
          type: 'project'
        }
      },
      orderBy: { createdAt: 'desc' },
      distinct: ['postId'],  // 重複排除
      skip: offset,
      take: limit,
      include: {
        post: {
          include: {
            _count: {
              select: {
                votes: true,
                comments: true
              }
            }
          }
        }
      }
    });

    // 総件数取得（ユニークpostId数）
    const totalCount = await prisma.comment.findMany({
      where: {
        authorId: userId,
        post: { type: 'project' }
      },
      distinct: ['postId'],
      select: { postId: true }
    }).then(results => results.length);

    return {
      projects: comments.map(comment => ({
        id: comment.post.id,
        title: comment.post.title,
        description: comment.post.description,
        status: comment.post.status,
        lastCommentedAt: comment.createdAt,
        votesCount: comment.post._count.votes,
        commentsCount: comment.post._count.comments
      })),
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    };
  }

  /**
   * ユーザーのプロジェクトアクティビティ統計取得
   */
  async getProjectStats(userId: string) {
    // 並列実行で高速化
    const [
      myPostsCount,
      votedPostsCount,
      commentedProjectsCount,
      achievedCount
    ] = await Promise.all([
      // 提案したプロジェクト数
      prisma.post.count({
        where: {
          authorId: userId,
          type: 'project'
        }
      }),

      // 投票したプロジェクト数
      prisma.vote.count({
        where: {
          userId,
          post: { type: 'project' }
        }
      }),

      // 参加したプロジェクト数（ユニークpostId数）
      prisma.comment.findMany({
        where: {
          authorId: userId,
          post: { type: 'project' }
        },
        distinct: ['postId'],
        select: { postId: true }
      }).then(results => results.length),

      // 完了したプロジェクト数
      prisma.post.count({
        where: {
          authorId: userId,
          type: 'project',
          status: 'completed'
        }
      })
    ]);

    return {
      myPostsCount,
      votedPostsCount,
      commentedProjectsCount,
      achievedCount
    };
  }
}
```

### 3.3 API実装（優先度: 高）

#### API 1: 提案したプロジェクト一覧取得
```typescript
// src/app/api/project-tracking/my-projects/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { ProjectTrackingService } from '@/services/ProjectTrackingService';
import { authenticateUser } from '@/lib/auth';

const service = new ProjectTrackingService();

export async function GET(request: NextRequest) {
  try {
    // 認証
    const user = await authenticateUser(request);
    if (!user) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    // クエリパラメータ取得
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const status = searchParams.get('status') as 'active' | 'completed' | 'archived' | undefined;

    // バリデーション
    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: { code: 'INVALID_PARAMETER', message: 'limit must be between 1-100' } },
        { status: 400 }
      );
    }

    if (offset < 0) {
      return NextResponse.json(
        { error: { code: 'INVALID_PARAMETER', message: 'offset must be >= 0' } },
        { status: 400 }
      );
    }

    // データ取得
    const result = await service.getMyProjects(user.id, { limit, offset, status });

    return NextResponse.json({
      data: result.projects,
      pagination: result.pagination,
      meta: {
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('GET /api/project-tracking/my-projects error:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch my projects',
          details: error.message
        }
      },
      { status: 500 }
    );
  }
}
```

#### API 2: 投票したプロジェクト一覧取得
```typescript
// src/app/api/project-tracking/voted-projects/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { ProjectTrackingService } from '@/services/ProjectTrackingService';
import { authenticateUser } from '@/lib/auth';

const service = new ProjectTrackingService();

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateUser(request);
    if (!user) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const result = await service.getVotedProjects(user.id, { limit, offset });

    return NextResponse.json({
      data: result.projects,
      pagination: result.pagination,
      meta: {
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('GET /api/project-tracking/voted-projects error:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch voted projects',
          details: error.message
        }
      },
      { status: 500 }
    );
  }
}
```

#### API 3: 参加したプロジェクト一覧取得
```typescript
// src/app/api/project-tracking/joined-projects/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { ProjectTrackingService } from '@/services/ProjectTrackingService';
import { authenticateUser } from '@/lib/auth';

const service = new ProjectTrackingService();

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateUser(request);
    if (!user) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const result = await service.getJoinedProjects(user.id, { limit, offset });

    return NextResponse.json({
      data: result.projects,
      pagination: result.pagination,
      meta: {
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('GET /api/project-tracking/joined-projects error:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch joined projects',
          details: error.message
        }
      },
      { status: 500 }
    );
  }
}
```

#### API 4: プロジェクト統計取得
```typescript
// src/app/api/project-tracking/stats/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { ProjectTrackingService } from '@/services/ProjectTrackingService';
import { authenticateUser } from '@/lib/auth';

const service = new ProjectTrackingService();

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateUser(request);
    if (!user) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const stats = await service.getProjectStats(user.id);

    return NextResponse.json({
      data: stats,
      meta: {
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('GET /api/project-tracking/stats error:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch project stats',
          details: error.message
        }
      },
      { status: 500 }
    );
  }
}
```

### 3.4 フロントエンド実装（優先度: 中）

#### useProjectTrackingフック実装例
```typescript
// src/hooks/useProjectTracking.ts

import useSWR from 'swr';

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  votesCount: number;
  commentsCount: number;
  createdAt?: string;
  votedAt?: string;
  lastCommentedAt?: string;
  myScore?: number;
}

interface ProjectStats {
  myPostsCount: number;
  votedPostsCount: number;
  commentedProjectsCount: number;
  achievedCount: number;
}

export function useProjectTracking(activeTab: 'my-posts' | 'voted' | 'joined') {
  // 統計データ取得（全タブ共通）
  const { data: statsData } = useSWR<{ data: ProjectStats }>(
    '/api/project-tracking/stats',
    { refreshInterval: 60000 }  // 1分ごとに再取得
  );

  // タブ別データ取得
  const endpoint = {
    'my-posts': '/api/project-tracking/my-projects',
    'voted': '/api/project-tracking/voted-projects',
    'joined': '/api/project-tracking/joined-projects'
  }[activeTab];

  const { data, error, isLoading, mutate } = useSWR<{
    data: Project[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    };
  }>(endpoint);

  return {
    projects: data?.data || [],
    pagination: data?.pagination,
    stats: statsData?.data,
    isLoading,
    error,
    refetch: mutate
  };
}
```

#### ProjectTrackingPage実装例
```typescript
// src/app/project-tracking/page.tsx

'use client';

import { useState } from 'react';
import { useProjectTracking } from '@/hooks/useProjectTracking';

export default function ProjectTrackingPage() {
  const [activeTab, setActiveTab] = useState<'my-posts' | 'voted' | 'joined'>('my-posts');
  const { projects, stats, isLoading } = useProjectTracking(activeTab);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">プロジェクト追跡</h1>

      {/* 統計サマリー */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="提案" count={stats?.myPostsCount || 0} />
        <StatCard label="投票" count={stats?.votedPostsCount || 0} />
        <StatCard label="参加" count={stats?.commentedProjectsCount || 0} />
        <StatCard label="完了" count={stats?.achievedCount || 0} />
      </div>

      {/* タブ切り替え */}
      <div className="flex space-x-4 mb-6">
        <TabButton
          active={activeTab === 'my-posts'}
          onClick={() => setActiveTab('my-posts')}
        >
          提案したプロジェクト
        </TabButton>
        <TabButton
          active={activeTab === 'voted'}
          onClick={() => setActiveTab('voted')}
        >
          投票したプロジェクト
        </TabButton>
        <TabButton
          active={activeTab === 'joined'}
          onClick={() => setActiveTab('joined')}
        >
          参加したプロジェクト
        </TabButton>
      </div>

      {/* プロジェクト一覧 */}
      <div className="space-y-4">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
```

---

## 4. テスト推奨事項

### 4.1 パフォーマンステスト（必須）

#### テスト1: 複合インデックス効果検証
```typescript
// tests/performance/project-tracking-index-test.ts

describe('ProjectTracking Index Performance', () => {
  it('Post複合インデックスの効果を検証', async () => {
    const userId = 'test-user-001';

    // EXPLAIN ANALYZEで実行計画確認
    const result = await prisma.$queryRaw`
      EXPLAIN ANALYZE
      SELECT * FROM "Post"
      WHERE "authorId" = ${userId}
        AND "type" = 'project'
      ORDER BY "createdAt" DESC
      LIMIT 10;
    `;

    // インデックススキャンが使用されていることを確認
    expect(result).toContain('Index Scan using Post_authorId_type_createdAt_idx');

    // 実行時間が50ms以下であることを確認
    const executionTime = extractExecutionTime(result);
    expect(executionTime).toBeLessThan(50);
  });

  it('Vote複合インデックスの効果を検証', async () => {
    const userId = 'test-user-001';

    const result = await prisma.$queryRaw`
      EXPLAIN ANALYZE
      SELECT * FROM "Vote"
      WHERE "userId" = ${userId}
      ORDER BY "timestamp" DESC
      LIMIT 10;
    `;

    expect(result).toContain('Index Scan using Vote_userId_timestamp_idx');

    const executionTime = extractExecutionTime(result);
    expect(executionTime).toBeLessThan(30);
  });
});
```

#### テスト2: 大量データ負荷テスト
```typescript
describe('ProjectTracking Load Test', () => {
  beforeAll(async () => {
    // テストデータ準備: 10,000プロジェクト、100,000投票
    await seedLargeDataset();
  });

  it('10,000プロジェクト中から自分の投稿を高速取得', async () => {
    const startTime = Date.now();

    const result = await service.getMyProjects('heavy-user-001', {
      limit: 20,
      offset: 0
    });

    const duration = Date.now() - startTime;

    expect(result.projects).toHaveLength(20);
    expect(duration).toBeLessThan(100);  // 100ms以下
  });

  it('100,000投票から自分の投票プロジェクトを高速取得', async () => {
    const startTime = Date.now();

    const result = await service.getVotedProjects('heavy-voter-001', {
      limit: 20,
      offset: 0
    });

    const duration = Date.now() - startTime;

    expect(duration).toBeLessThan(150);  // 150ms以下
  });
});
```

### 4.2 APIテスト（必須）

```typescript
describe('ProjectTracking API Tests', () => {
  it('GET /api/project-tracking/my-projects - 正常系', async () => {
    const response = await fetch('/api/project-tracking/my-projects?limit=10', {
      headers: { Authorization: `Bearer ${validToken}` }
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.data).toBeInstanceOf(Array);
    expect(data.pagination.total).toBeGreaterThanOrEqual(0);
  });

  it('GET /api/project-tracking/voted-projects - 正常系', async () => {
    const response = await fetch('/api/project-tracking/voted-projects?limit=10', {
      headers: { Authorization: `Bearer ${validToken}` }
    });

    expect(response.status).toBe(200);
  });

  it('GET /api/project-tracking/stats - 統計取得', async () => {
    const response = await fetch('/api/project-tracking/stats', {
      headers: { Authorization: `Bearer ${validToken}` }
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.data).toHaveProperty('myPostsCount');
    expect(data.data).toHaveProperty('votedPostsCount');
    expect(data.data).toHaveProperty('commentedProjectsCount');
    expect(data.data).toHaveProperty('achievedCount');
  });

  it('認証なしリクエストは401エラー', async () => {
    const response = await fetch('/api/project-tracking/my-projects');
    expect(response.status).toBe(401);
  });
});
```

### 4.3 E2Eテスト（推奨）

```typescript
describe('ProjectTracking E2E Test', () => {
  it('ユーザーがプロジェクト追跡ページを正常に操作できる', async () => {
    // ログイン
    await page.goto('/login');
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'password123');
    await page.click('#login-button');

    // プロジェクト追跡ページへ移動
    await page.goto('/project-tracking');

    // 統計カードが表示される
    await expect(page.locator('[data-testid="stat-my-posts"]')).toBeVisible();
    await expect(page.locator('[data-testid="stat-voted"]')).toBeVisible();

    // タブ切り替え
    await page.click('[data-testid="tab-voted"]');
    await expect(page.locator('[data-testid="voted-projects-list"]')).toBeVisible();

    // プロジェクトカードクリック
    await page.click('[data-testid="project-card-001"]');
    await expect(page).toHaveURL(/\/projects\/001/);
  });
});
```

---

## 5. リスク・注意事項

### 5.1 パフォーマンスリスク（高）

**リスク**: 複合インデックス未追加の場合、データ増加に伴いクエリ速度が著しく低下

**影響**:
- Postテーブルが10,000件超過時: 1-3秒のクエリ遅延
- Voteテーブルが100,000件超過時: 3-10秒のクエリ遅延
- ユーザーエクスペリエンスの著しい低下

**対策**:
- ✅ 必ず複合インデックスを追加してから実装開始
- ✅ 実装後にEXPLAIN ANALYZEで実行計画確認
- ✅ 本番環境でパフォーマンス監視設定

### 5.2 データ整合性リスク（中）

**リスク**: Comment.distinctクエリがPostId重複を完全に排除できない可能性

**影響**:
- 「参加したプロジェクト」の件数が不正確になる
- ページネーションの総件数が実際と異なる

**対策**:
```typescript
// より厳密なユニークPostId取得
const uniquePostIds = await prisma.comment.groupBy({
  by: ['postId'],
  where: {
    authorId: userId,
    post: { type: 'project' }
  },
  _count: { id: true }
});

const totalCount = uniquePostIds.length;
```

### 5.3 認証・認可リスク（中）

**リスク**: 自分以外のユーザーのプロジェクト追跡情報が閲覧される

**影響**: プライバシー侵害、セキュリティインシデント

**対策**:
```typescript
// 必ずリクエストユーザーのIDを使用
const user = await authenticateUser(request);
const result = await service.getMyProjects(user.id, options);  // ✅ 正しい

// URLパラメータのuserIdは使用しない
const userId = searchParams.get('userId');  // ❌ 危険
```

---

## 6. 将来拡張提案

### 6.1 高度なフィルタリング機能
```typescript
interface AdvancedFilterOptions {
  status?: 'active' | 'completed' | 'archived';
  dateRange?: { start: Date; end: Date };
  sortBy?: 'latest' | 'most-voted' | 'most-commented';
  minVotes?: number;
}
```

### 6.2 プロジェクトタグ別集計
```typescript
async getProjectStatsByTag(userId: string): Promise<{
  tagName: string;
  projectCount: number;
  totalVotes: number;
}[]> {
  // タグ別の統計情報を集計
}
```

### 6.3 アクティビティタイムライン
```typescript
async getProjectActivityTimeline(userId: string, limit: number): Promise<{
  timestamp: Date;
  activityType: 'posted' | 'voted' | 'commented';
  projectId: string;
  projectTitle: string;
}[]> {
  // 時系列でアクティビティを取得
}
```

---

## 7. まとめ

### 医療システム側の対応
- ✅ **追加実装不要**: 医療システムAPIは一切使用しません
- ✅ **既存機能で対応可能**: 新しいエンドポイント追加は不要です

### VoiceDrive側の実装要件
- 🔧 **複合インデックス追加**: Post/Voteテーブルに2つ（必須）
- 🔧 **API実装**: 4エンドポイント（必須）
- 🔧 **フロントエンド実装**: useProjectTrackingフック + ページコンポーネント
- 📊 **パフォーマンステスト**: インデックス効果検証（必須）

### 実装優先度
1. **Phase 1（必須）**: 複合インデックス追加 + API実装
2. **Phase 2（推奨）**: フロントエンド実装 + パフォーマンステスト
3. **Phase 3（将来）**: 高度なフィルタリング + タグ別集計

**推定工数**: 4日間（Phase 1-2のみ）

---

**承認状態**: VoiceDriveチームレビュー待ち
**次のアクション**: VoiceDriveチームによる実装スケジュール確定

---

**添付ファイル**:
- なし（暫定マスターリストのみ参照）

**関連ドキュメント**:
- `ProjectTracking_暫定マスターリスト_20251011.md`（参照元）
- `共通DB構築後_作業再開指示書_20250928.md`（更新対象）
