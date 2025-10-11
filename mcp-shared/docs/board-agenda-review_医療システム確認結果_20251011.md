# BoardAgendaReview 医療システム確認結果

**確認日**: 2025年10月11日
**対象ページ**: BoardAgendaReview (理事会議題確認)
**確認者**: 医療職員管理システム開発チーム
**ドキュメントID**: MED-SYS-CONFIRM-BOARD-AGENDA-REV-20251011
**ステータス**: ✅ 確認完了 - 医療システム側実装不要

---

## 1. エグゼクティブサマリー

### 1.1 確認結論

**医療職員管理システム側の追加実装は不要です。**

- ❌ **新規API実装**: 不要
- ❌ **新規テーブル作成**: 不要
- ❌ **既存API拡張**: 不要
- ✅ **医療システム側の作業**: なし

### 1.2 理由

BoardAgendaReviewは**完全にVoiceDrive内部のワークフロー**であり、医療システムのデータを一切使用しません。

#### ワークフローの流れ
```
Level 17（戦略企画部長・人事部長）
  ↓ 理事会議題を準備（BoardPreparationページ）
Level 18（理事長・法人事務局長）
  ↓ 議題を事前確認・レビュー（BoardAgendaReviewページ）← 今回のページ
[承認/修正依頼/却下]の判断
  ↓
Level 17へ通知（VoiceDrive内部）
```

このワークフロー全体が **VoiceDrive内部のBoardMeetingAgendaテーブル** のみで完結します。

### 1.3 データ責任分担

| 項目 | VoiceDrive | 医療システム |
|------|-----------|------------|
| 理事会議題データ | ✅ 100% | ❌ なし |
| 理事長レビュー機能 | ✅ 100% | ❌ なし |
| Level 17への通知 | ✅ 100% | ❌ なし |
| レビュー統計 | ✅ 100% | ❌ なし |

---

## 2. 暫定マスターリスト分析

### 2.1 VoiceDrive側実装内容

#### 2.1.1 データベース拡張

**BoardMeetingAgenda テーブル拡張（7フィールド追加）**

| フィールド | 型 | 説明 |
|-----------|---|------|
| keyPoints | Json? | 主要ポイント配列 |
| expectedDiscussion | Text? | 想定される議論 |
| requiredDecision | Text? | 求められる決定 |
| chairmanReview | String? | レビューステータス（pending/approved/needs_revision/rejected）|
| chairmanComment | Text? | 理事長コメント |
| chairmanReviewedBy | String? | レビュー実施者ID |
| chairmanReviewedAt | DateTime? | レビュー日時 |

#### 2.1.2 VoiceDrive側API（5個）

| No | メソッド | エンドポイント | 説明 |
|----|---------|---------------|------|
| 1 | GET | /api/board-agenda-review/:boardMeetingId/agendas | 議題一覧取得 |
| 2 | GET | /api/board-agenda-review/agendas/:agendaId | 議題詳細取得 |
| 3 | POST | /api/board-agenda-review/agendas/:agendaId/review | 理事長レビュー実行 |
| 4 | GET | /api/board-agenda-review/:boardMeetingId/stats | レビュー統計取得 |
| 5 | GET | /api/board-agenda-review/next-meeting | 次回理事会情報取得 |

すべて **VoiceDrive内部のAPIエンドポイント**です。

### 2.2 医療システム側の必要API

**暫定マスターリストの記載（2.1節）**:
> **なし** - このページは完全にVoiceDrive内部のワークフローであり、医療システム側のデータは不要。

✅ **確認済み**: 医療システム側のAPIは一切不要です。

---

## 3. 医療システム側の対応方針

### 3.1 実装作業

**作業なし**

理由:
1. 医療システムのデータを使用しない
2. VoiceDrive内部のワークフロー機能
3. 既存の医療システムAPIも使用しない

### 3.2 確認事項

- [x] 医療システム側のデータは不要 → ✅ 確認済み（VoiceDrive内部ワークフロー）
- [x] 医療システム側の追加作業は不要 → ✅ 確認済み
- [x] BoardPreparationとの関係性確認 → ✅ 確認済み（Level 17 → Level 18のワークフロー）

---

## 4. VoiceDriveチームへの実装推奨事項

### 4.1 データベース実装

#### 推奨1: マイグレーションの慎重な実行

```sql
-- BoardMeetingAgendaテーブルは既にBoardPreparation実装で作成済み
-- 今回は7フィールドを追加するのみ

ALTER TABLE `board_meeting_agendas`
ADD COLUMN `key_points` JSON NULL AFTER `document_urls`,
ADD COLUMN `expected_discussion` TEXT NULL AFTER `key_points`,
ADD COLUMN `required_decision` TEXT NULL AFTER `expected_discussion`,
ADD COLUMN `chairman_review` VARCHAR(191) NULL DEFAULT 'pending' AFTER `required_decision`,
ADD COLUMN `chairman_comment` TEXT NULL AFTER `chairman_review`,
ADD COLUMN `chairman_reviewed_by` VARCHAR(191) NULL AFTER `chairman_comment`,
ADD COLUMN `chairman_reviewed_at` DATETIME(3) NULL AFTER `chairman_reviewed_by`;

-- インデックス追加（パフォーマンス向上）
CREATE INDEX `idx_bma_chairman_review` ON `board_meeting_agendas`(`chairman_review`);
CREATE INDEX `idx_bma_chairman_reviewed_at` ON `board_meeting_agendas`(`chairman_reviewed_at`);

-- 外部キー制約追加
ALTER TABLE `board_meeting_agendas`
ADD CONSTRAINT `fk_bma_chairman_reviewed_by`
FOREIGN KEY (`chairman_reviewed_by`) REFERENCES `users`(`id`)
ON DELETE SET NULL ON UPDATE CASCADE;
```

**注意点**:
- BoardMeetingAgendaテーブルが既存かどうか確認
- 既存データへの影響を事前チェック
- マイグレーション前にバックアップ取得

#### 推奨2: デフォルト値の設定

```typescript
// chairmanReview のデフォルト値を 'pending' に設定
// 議題作成時に自動的に「レビュー待ち」状態にする

model BoardMeetingAgenda {
  // ... 既存フィールド
  chairmanReview     String?   @default("pending")  // ← デフォルト値
  // ...
}
```

### 4.2 サービス層実装

#### 推奨3: レビュー実行時のバリデーション

```typescript
class BoardAgendaReviewService {
  async submitChairmanReview(
    agendaId: string,
    reviewData: {
      status: 'approved' | 'needs_revision' | 'rejected';
      comment?: string;
      reviewedBy: string;
    }
  ): Promise<BoardMeetingAgenda> {
    // バリデーション1: 修正依頼・却下時はコメント必須
    if (
      (reviewData.status === 'needs_revision' ||
       reviewData.status === 'rejected') &&
      !reviewData.comment
    ) {
      throw new Error('修正依頼または却下時はコメントが必須です');
    }

    // バリデーション2: レビュー済み議題は再レビュー不可
    const agenda = await prisma.boardMeetingAgenda.findUnique({
      where: { id: agendaId }
    });

    if (agenda.chairmanReview && agenda.chairmanReview !== 'pending') {
      throw new Error('この議題は既にレビュー済みです');
    }

    // バリデーション3: Level 18権限チェック
    const reviewer = await prisma.user.findUnique({
      where: { id: reviewData.reviewedBy }
    });

    if (reviewer.permissionLevel < 18) {
      throw new ForbiddenError('理事会議題レビューの権限がありません');
    }

    // レビュー実行
    return await prisma.boardMeetingAgenda.update({
      where: { id: agendaId },
      data: {
        chairmanReview: reviewData.status,
        chairmanComment: reviewData.comment,
        chairmanReviewedBy: reviewData.reviewedBy,
        chairmanReviewedAt: new Date()
      }
    });
  }
}
```

#### 推奨4: Level 17への通知機能

```typescript
async notifyLevel17(
  agendaId: string,
  reviewResult: { status: string; comment?: string }
): Promise<void> {
  const agenda = await prisma.boardMeetingAgenda.findUnique({
    where: { id: agendaId },
    include: { presenter: true }
  });

  // 議題作成者（Level 17）に通知
  const notificationMessage =
    reviewResult.status === 'approved'
      ? `理事会議題「${agenda.item}」が承認されました。`
      : reviewResult.status === 'needs_revision'
      ? `理事会議題「${agenda.item}」の修正依頼があります。理事長コメント: ${reviewResult.comment}`
      : `理事会議題「${agenda.item}」が却下されました。理事長コメント: ${reviewResult.comment}`;

  await prisma.notification.create({
    data: {
      userId: agenda.presenterId,
      category: 'board_agenda_review',
      title: '理事会議題レビュー結果',
      message: notificationMessage,
      link: '/board-preparation',
      priority: reviewResult.status === 'approved' ? 'normal' : 'high',
      isRead: false
    }
  });

  // Level 17全員にも通知（戦略企画部長・人事部長）
  const level17Users = await prisma.user.findMany({
    where: { permissionLevel: { gte: 17, lt: 18 } }
  });

  for (const user of level17Users) {
    if (user.id !== agenda.presenterId) {
      await prisma.notification.create({
        data: {
          userId: user.id,
          category: 'board_agenda_review',
          title: '理事会議題レビュー結果（参考）',
          message: notificationMessage,
          link: '/board-preparation',
          priority: 'normal',
          isRead: false
        }
      });
    }
  }
}
```

### 4.3 セキュリティ実装

#### 推奨5: Level 18専用アクセス制御

```typescript
// ミドルウェア: Level 18（理事長・法人事務局長）のみアクセス可能
const requireLevel18 = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user; // 認証済みユーザー

  if (user.permissionLevel < 18) {
    return res.status(403).json({
      error: 'Forbidden',
      message: '理事会議題確認へのアクセス権限がありません（Level 18以上必要）'
    });
  }

  next();
};

// 全エンドポイントに適用
router.get('/api/board-agenda-review/:boardMeetingId/agendas', requireLevel18, ...);
router.post('/api/board-agenda-review/agendas/:agendaId/review', requireLevel18, ...);
```

#### 推奨6: 監査ログの記録

```typescript
// 理事長レビューを監査ログに記録
await auditLog.create({
  userId: reviewData.reviewedBy,
  action: 'CHAIRMAN_REVIEW_AGENDA',
  resource: agendaId,
  resourceType: 'BoardMeetingAgenda',
  details: {
    status: reviewData.status,
    comment: reviewData.comment,
    agendaItem: agenda.item,
    meetingDate: agenda.meetingDate
  },
  ipAddress: req.ip,
  userAgent: req.headers['user-agent'],
  timestamp: new Date()
});
```

### 4.4 パフォーマンス最適化

#### 推奨7: インデックス戦略

```sql
-- 理事会IDでの議題検索を高速化（既存インデックスを確認）
CREATE INDEX IF NOT EXISTS idx_board_meeting_agendas_meeting_id
ON board_meeting_agendas(board_meeting_id);

-- レビューステータスでのフィルタリングを高速化
CREATE INDEX idx_board_meeting_agendas_chairman_review
ON board_meeting_agendas(chairman_review);

-- レビュー日時でのソートを高速化
CREATE INDEX idx_board_meeting_agendas_chairman_reviewed_at
ON board_meeting_agendas(chairman_reviewed_at);

-- 複合インデックス: 理事会ID + レビューステータス
CREATE INDEX idx_bma_meeting_review
ON board_meeting_agendas(board_meeting_id, chairman_review);
```

#### 推奨8: キャッシュ戦略

```typescript
// 次回理事会情報: 10分キャッシュ
const cacheKey = 'board-agenda-review:next-meeting';
const cached = await redis.get(cacheKey);
if (cached) {
  return JSON.parse(cached);
}

const nextMeeting = await getNextMeeting();
await redis.setex(cacheKey, 600, JSON.stringify(nextMeeting)); // 10分
return nextMeeting;

// 議題一覧: 5分キャッシュ
const agendasCacheKey = `board-agenda-review:agendas:${boardMeetingId}`;
const cachedAgendas = await redis.get(agendasCacheKey);
if (cachedAgendas) {
  return JSON.parse(cachedAgendas);
}

const agendas = await getAgendasForReview(boardMeetingId);
await redis.setex(agendasCacheKey, 300, JSON.stringify(agendas)); // 5分
return agendas;

// レビュー実行時はキャッシュクリア
await redis.del(`board-agenda-review:agendas:${agenda.boardMeetingId}`);
await redis.del('board-agenda-review:next-meeting');
```

### 4.5 フロントエンド実装

#### 推奨9: レビューステータスのビジュアル化

```typescript
// ReviewStatusBadge コンポーネント
const getStatusStyle = (status: string) => {
  switch (status) {
    case 'pending':
      return { bg: 'yellow-100', text: 'yellow-800', label: 'レビュー待ち' };
    case 'approved':
      return { bg: 'green-100', text: 'green-800', label: '承認済み' };
    case 'needs_revision':
      return { bg: 'orange-100', text: 'orange-800', label: '修正依頼' };
    case 'rejected':
      return { bg: 'red-100', text: 'red-800', label: '却下' };
    default:
      return { bg: 'gray-100', text: 'gray-800', label: '不明' };
  }
};

export const ReviewStatusBadge = ({ status }: { status: string }) => {
  const style = getStatusStyle(status);
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${style.bg} text-${style.text}`}>
      {style.label}
    </span>
  );
};
```

#### 推奨10: レビューアクションの確認ダイアログ

```typescript
// ReviewCommentDialog コンポーネント
const handleSubmitReview = async (status: 'approved' | 'needs_revision' | 'rejected') => {
  // 修正依頼・却下時はコメント必須
  if ((status === 'needs_revision' || status === 'rejected') && !comment) {
    setError('修正依頼または却下時はコメントを入力してください');
    return;
  }

  // 確認ダイアログ
  const confirmed = await confirm({
    title: `議題を${getStatusLabel(status)}しますか？`,
    message: `この操作は取り消せません。Level 17（${agenda.presenterTitle}）に通知が送信されます。`,
    confirmText: '確認して実行',
    cancelText: 'キャンセル'
  });

  if (!confirmed) return;

  try {
    await submitChairmanReview(agenda.id, { status, comment });
    toast.success(`議題を${getStatusLabel(status)}しました`);
    router.refresh();
  } catch (error) {
    toast.error('レビューの実行に失敗しました');
  }
};
```

### 4.6 運用実装

#### 推奨11: レビュー期限管理

```typescript
// 理事会3日前にリマインダー通知
async function sendReviewReminder() {
  const threeDaysLater = new Date();
  threeDaysLater.setDate(threeDaysLater.getDate() + 3);

  const upcomingMeetings = await prisma.boardMeeting.findMany({
    where: {
      meetingDate: {
        gte: new Date(),
        lte: threeDaysLater
      },
      status: 'planning'
    },
    include: {
      agendas: true
    }
  });

  for (const meeting of upcomingMeetings) {
    const pendingAgendas = meeting.agendas.filter(
      a => a.chairmanReview === 'pending'
    );

    if (pendingAgendas.length > 0) {
      // Level 18に通知
      const level18Users = await prisma.user.findMany({
        where: { permissionLevel: { gte: 18 } }
      });

      for (const user of level18Users) {
        await prisma.notification.create({
          data: {
            userId: user.id,
            category: 'board_agenda_review',
            title: '理事会議題レビューのリマインダー',
            message: `${meeting.meetingDate.toLocaleDateString('ja-JP')}の理事会まで3日です。未レビュー議題が${pendingAgendas.length}件あります。`,
            link: '/board-agenda-review',
            priority: 'high',
            isRead: false
          }
        });
      }
    }
  }
}

// 毎日午前9時に実行（cron: 0 9 * * *）
```

#### 推奨12: レビュー完了率の監視

```typescript
// レビュー完了率の監視
async function monitorReviewCompletionRate() {
  const upcomingMeetings = await prisma.boardMeeting.findMany({
    where: {
      meetingDate: { gte: new Date() },
      status: 'planning'
    },
    include: {
      agendas: true
    }
  });

  for (const meeting of upcomingMeetings) {
    const totalAgendas = meeting.agendas.length;
    const reviewedAgendas = meeting.agendas.filter(
      a => a.chairmanReview && a.chairmanReview !== 'pending'
    ).length;

    const completionRate = reviewedAgendas / totalAgendas;
    const daysUntilMeeting = Math.ceil(
      (meeting.meetingDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    // アラート条件: 理事会まで3日を切り、レビュー完了率80%未満
    if (daysUntilMeeting < 3 && completionRate < 0.8) {
      logger.warn({
        message: '理事会議題レビュー完了率が低下',
        meetingId: meeting.id,
        meetingDate: meeting.meetingDate,
        daysUntilMeeting,
        completionRate: `${(completionRate * 100).toFixed(1)}%`,
        reviewedAgendas,
        totalAgendas
      });

      // Slackに通知
      await notifySlack({
        channel: '#board-meeting-alerts',
        message: `:warning: 理事会まで${daysUntilMeeting}日ですが、議題レビュー完了率が${(completionRate * 100).toFixed(1)}%です（${reviewedAgendas}/${totalAgendas}件）`
      });
    }
  }
}

// 毎日午前10時、午後3時に実行
```

---

## 5. テスト推奨事項

### 5.1 ユニットテスト

```typescript
describe('BoardAgendaReviewService', () => {
  describe('submitChairmanReview', () => {
    it('承認時に正しくステータスを更新すること', async () => {
      const result = await service.submitChairmanReview('AGENDA001', {
        status: 'approved',
        reviewedBy: 'USR_CHAIRMAN'
      });

      expect(result.chairmanReview).toBe('approved');
      expect(result.chairmanReviewedAt).toBeDefined();
      expect(result.chairmanReviewedBy).toBe('USR_CHAIRMAN');
      expect(result.chairmanComment).toBeNull();
    });

    it('修正依頼時はコメントが必須であること', async () => {
      await expect(
        service.submitChairmanReview('AGENDA001', {
          status: 'needs_revision',
          reviewedBy: 'USR_CHAIRMAN'
        })
      ).rejects.toThrow('修正依頼または却下時はコメントが必須です');
    });

    it('却下時はコメントが必須であること', async () => {
      await expect(
        service.submitChairmanReview('AGENDA001', {
          status: 'rejected',
          reviewedBy: 'USR_CHAIRMAN'
        })
      ).rejects.toThrow('修正依頼または却下時はコメントが必須です');
    });

    it('Level 18未満はレビュー実行不可', async () => {
      await expect(
        service.submitChairmanReview('AGENDA001', {
          status: 'approved',
          reviewedBy: 'USR_LEVEL17' // Level 17ユーザー
        })
      ).rejects.toThrow('理事会議題レビューの権限がありません');
    });

    it('既にレビュー済みの議題は再レビュー不可', async () => {
      // 1回目のレビュー
      await service.submitChairmanReview('AGENDA001', {
        status: 'approved',
        reviewedBy: 'USR_CHAIRMAN'
      });

      // 2回目のレビュー（エラー）
      await expect(
        service.submitChairmanReview('AGENDA001', {
          status: 'needs_revision',
          comment: '修正依頼',
          reviewedBy: 'USR_CHAIRMAN'
        })
      ).rejects.toThrow('この議題は既にレビュー済みです');
    });
  });

  describe('notifyLevel17', () => {
    it('議題作成者（Level 17）に通知が送信されること', async () => {
      await service.notifyLevel17('AGENDA001', {
        status: 'approved'
      });

      const notifications = await prisma.notification.findMany({
        where: {
          category: 'board_agenda_review',
          userId: 'USR_LEVEL17_001' // 議題作成者
        }
      });

      expect(notifications.length).toBeGreaterThan(0);
      expect(notifications[0].message).toContain('承認されました');
    });

    it('修正依頼時は理事長コメントが含まれること', async () => {
      await service.notifyLevel17('AGENDA001', {
        status: 'needs_revision',
        comment: '具体的な数値根拠を補強してください'
      });

      const notification = await prisma.notification.findFirst({
        where: {
          category: 'board_agenda_review',
          userId: 'USR_LEVEL17_001'
        },
        orderBy: { createdAt: 'desc' }
      });

      expect(notification.message).toContain('修正依頼');
      expect(notification.message).toContain('具体的な数値根拠を補強してください');
      expect(notification.priority).toBe('high');
    });
  });

  describe('getReviewStats', () => {
    it('レビュー統計が正しく計算されること', async () => {
      const stats = await service.getReviewStats('BM001');

      expect(stats).toMatchObject({
        totalAgendas: 6,
        approvedCount: 2,
        needsRevisionCount: 1,
        rejectedCount: 0,
        pendingCount: 3,
        completionRate: 50 // (2+1+0)/6 = 50%
      });
    });
  });
});
```

### 5.2 API統合テスト

```typescript
describe('Board Agenda Review API', () => {
  describe('GET /api/board-agenda-review/:boardMeetingId/agendas', () => {
    it('Level 18未満はアクセス拒否', async () => {
      const response = await request(app)
        .get('/api/board-agenda-review/BM001/agendas')
        .set('Authorization', 'Bearer level17_token'); // Level 17

      expect(response.status).toBe(403);
      expect(response.body.message).toContain('Level 18以上必要');
    });

    it('Level 18以上は正常取得', async () => {
      const response = await request(app)
        .get('/api/board-agenda-review/BM001/agendas')
        .set('Authorization', 'Bearer level18_token'); // Level 18

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(6);
      expect(response.body[0]).toHaveProperty('keyPoints');
      expect(response.body[0]).toHaveProperty('chairmanReview');
    });

    it('存在しない理事会IDはエラー', async () => {
      const response = await request(app)
        .get('/api/board-agenda-review/INVALID_ID/agendas')
        .set('Authorization', 'Bearer level18_token');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/board-agenda-review/agendas/:agendaId/review', () => {
    it('承認処理が正常に完了すること', async () => {
      const response = await request(app)
        .post('/api/board-agenda-review/agendas/AGENDA001/review')
        .set('Authorization', 'Bearer level18_token')
        .send({ status: 'approved' });

      expect(response.status).toBe(200);
      expect(response.body.chairmanReview).toBe('approved');
      expect(response.body.chairmanReviewedAt).toBeDefined();
    });

    it('修正依頼はコメント必須', async () => {
      const response = await request(app)
        .post('/api/board-agenda-review/agendas/AGENDA001/review')
        .set('Authorization', 'Bearer level18_token')
        .send({ status: 'needs_revision' });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('コメントが必須');
    });

    it('修正依頼が正常に完了すること', async () => {
      const response = await request(app)
        .post('/api/board-agenda-review/agendas/AGENDA006/review')
        .set('Authorization', 'Bearer level18_token')
        .send({
          status: 'needs_revision',
          comment: '具体的な数値根拠を補強してください'
        });

      expect(response.status).toBe(200);
      expect(response.body.chairmanReview).toBe('needs_revision');
      expect(response.body.chairmanComment).toBe('具体的な数値根拠を補強してください');
    });

    it('Level 17はレビュー実行不可', async () => {
      const response = await request(app)
        .post('/api/board-agenda-review/agendas/AGENDA001/review')
        .set('Authorization', 'Bearer level17_token')
        .send({ status: 'approved' });

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/board-agenda-review/:boardMeetingId/stats', () => {
    it('レビュー統計が正常に取得できること', async () => {
      const response = await request(app)
        .get('/api/board-agenda-review/BM001/stats')
        .set('Authorization', 'Bearer level18_token');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        totalAgendas: 6,
        approvedCount: 2,
        needsRevisionCount: 1,
        rejectedCount: 0,
        pendingCount: 3,
        completionRate: 50
      });
    });
  });
});
```

### 5.3 エンドツーエンドテスト

```typescript
describe('Board Agenda Review E2E', () => {
  it('Level 17 → Level 18 ワークフロー全体が正常に動作すること', async () => {
    // 1. Level 17が議題を準備（BoardPreparation）
    const agendaResponse = await request(app)
      .post('/api/board-preparation/agendas')
      .set('Authorization', 'Bearer level17_token')
      .send({
        boardMeetingId: 'BM001',
        item: 'テスト議題',
        description: 'テスト用の議題です',
        category: '人事戦略',
        duration: 15,
        preparationStatus: 'finalized'
      });

    expect(agendaResponse.status).toBe(201);
    const agendaId = agendaResponse.body.id;
    expect(agendaResponse.body.chairmanReview).toBe('pending'); // デフォルト値

    // 2. Level 18が議題を確認（BoardAgendaReview）
    const reviewListResponse = await request(app)
      .get('/api/board-agenda-review/BM001/agendas')
      .set('Authorization', 'Bearer level18_token');

    expect(reviewListResponse.status).toBe(200);
    const pendingAgenda = reviewListResponse.body.find(a => a.id === agendaId);
    expect(pendingAgenda.chairmanReview).toBe('pending');

    // 3. Level 18がレビュー実行（修正依頼）
    const reviewResponse = await request(app)
      .post(`/api/board-agenda-review/agendas/${agendaId}/review`)
      .set('Authorization', 'Bearer level18_token')
      .send({
        status: 'needs_revision',
        comment: '議題の背景をもっと詳しく記載してください'
      });

    expect(reviewResponse.status).toBe(200);
    expect(reviewResponse.body.chairmanReview).toBe('needs_revision');

    // 4. Level 17に通知が届いていることを確認
    const notificationResponse = await request(app)
      .get('/api/notifications')
      .set('Authorization', 'Bearer level17_token');

    expect(notificationResponse.status).toBe(200);
    const notification = notificationResponse.body.find(
      n => n.category === 'board_agenda_review' && n.message.includes('修正依頼')
    );
    expect(notification).toBeDefined();
    expect(notification.message).toContain('議題の背景をもっと詳しく記載してください');

    // 5. Level 17が修正して再提出
    const updateResponse = await request(app)
      .put(`/api/board-preparation/agendas/${agendaId}`)
      .set('Authorization', 'Bearer level17_token')
      .send({
        description: 'テスト用の議題です（背景を詳細追記）',
        chairmanReview: 'pending' // レビューステータスをリセット
      });

    expect(updateResponse.status).toBe(200);

    // 6. Level 18が再レビュー（承認）
    const approveResponse = await request(app)
      .post(`/api/board-agenda-review/agendas/${agendaId}/review`)
      .set('Authorization', 'Bearer level18_token')
      .send({ status: 'approved' });

    expect(approveResponse.status).toBe(200);
    expect(approveResponse.body.chairmanReview).toBe('approved');

    // 7. Level 17に承認通知が届いていることを確認
    await new Promise(resolve => setTimeout(resolve, 500)); // 通知送信待ち

    const approvalNotificationResponse = await request(app)
      .get('/api/notifications')
      .set('Authorization', 'Bearer level17_token');

    const approvalNotification = approvalNotificationResponse.body.find(
      n => n.category === 'board_agenda_review' && n.message.includes('承認されました')
    );
    expect(approvalNotification).toBeDefined();
  });
});
```

---

## 6. リスク管理

### 6.1 技術的リスク

#### リスク1: レビュー済み議題の再レビュー

**内容**: 誤ってレビュー済み議題を再レビューしようとする
**影響度**: 中
**対策**:
- サービス層でレビューステータスをチェック
- 既にレビュー済み（pending以外）の場合はエラー
- フロントエンドでもボタンを無効化

**実装例**:
```typescript
if (agenda.chairmanReview && agenda.chairmanReview !== 'pending') {
  throw new Error('この議題は既にレビュー済みです');
}
```

#### リスク2: 同時レビューの競合

**内容**: 複数のLevel 18ユーザーが同じ議題を同時にレビュー
**影響度**: 低
**対策**:
- 楽観的ロック（updatedAtで競合検出）
- 先勝ちルール
- 競合時はエラーメッセージ表示

**実装例**:
```typescript
const result = await prisma.boardMeetingAgenda.update({
  where: {
    id: agendaId,
    updatedAt: currentUpdatedAt // 楽観的ロック
  },
  data: { ... }
});

if (!result) {
  throw new Error('他のユーザーが同時にレビューしました。再度確認してください。');
}
```

#### リスク3: Level 17への通知失敗

**内容**: レビュー完了後の通知がLevel 17に届かない
**影響度**: 高
**対策**:
- 非同期ジョブキュー（BullMQ等）でリトライ
- 通知失敗時はログ記録＋Slack通知
- 手動再送機能の提供

### 6.2 運用リスク

#### リスク4: レビュー期限切れ

**内容**: 理事会直前までレビューが完了しない
**影響度**: 高
**対策**:
- 理事会3日前にリマインダー通知
- 未レビュー議題のレポート自動生成
- エスカレーション機能（秘書室に通知）

**実装例**:
```typescript
// 理事会3日前の午前9時に実行
if (daysUntilMeeting === 3 && pendingCount > 0) {
  await notifyLevel18({
    title: '理事会議題レビューのリマインダー',
    message: `理事会まで3日です。未レビュー議題が${pendingCount}件あります。`,
    priority: 'urgent'
  });
}
```

#### リスク5: 修正依頼の無限ループ

**内容**: Level 18 → Level 17 → Level 18 の修正依頼が繰り返される
**影響度**: 中
**対策**:
- 修正依頼回数の記録（3回まで）
- 4回目以降は理事会議題から除外の提案
- エスカレーション機能（直接ミーティング設定）

---

## 7. 今後の拡張可能性

### Phase 2機能（3ヶ月後）

#### 機能1: 理事長レビューの一括承認
```typescript
// 一括承認API
POST /api/board-agenda-review/:boardMeetingId/bulk-approve
{
  agendaIds: ['AGENDA001', 'AGENDA002', 'AGENDA003']
}
```

#### 機能2: レビュー履歴の表示
```typescript
// 議題のレビュー履歴を表示
model BoardAgendaReviewHistory {
  id            String   @id @default(cuid())
  agendaId      String
  reviewedBy    String
  status        String
  comment       String?
  reviewedAt    DateTime
}
```

#### 機能3: レビューコメントのテンプレート
```typescript
// よく使うコメントをテンプレート化
const commentTemplates = [
  '具体的な数値根拠を補強してください',
  '予算措置の詳細を追記してください',
  '他施設への影響を検討してください',
  'スケジュールの妥当性を再確認してください'
];
```

### Phase 3機能（6ヶ月後）

#### 機能4: AIによる議題の論点抽出
```typescript
// OpenAI APIで議題から論点を自動抽出
const keyPoints = await extractKeyPoints(agenda.description);
const expectedDiscussion = await predictDiscussionPoints(agenda);
```

#### 機能5: 過去の議論履歴の参照
```typescript
// 過去の類似議題を検索・表示
const similarAgendas = await findSimilarAgendas(agenda.item);
```

#### 機能6: レビュー結果の統計分析
```typescript
// 理事長のレビュー傾向を分析
const stats = {
  approvalRate: 0.67, // 承認率
  avgReviewTime: 5.2, // 平均レビュー時間（分）
  commonComments: ['予算措置の詳細', '他施設への影響'] // よく使うコメント
};
```

---

## 8. まとめ

### 8.1 医療システム側の対応

**作業不要** - このページは完全にVoiceDrive内部のワークフローです。

### 8.2 VoiceDrive側の実装項目

#### データベース
- [ ] BoardMeetingAgendaテーブルに7フィールド追加
- [ ] Userテーブルにリレーション追加
- [ ] インデックス作成（3個）

#### バックエンド
- [ ] BoardAgendaReviewService実装
- [ ] 5つのAPIエンドポイント実装
- [ ] Level 18権限チェック実装
- [ ] Level 17への通知機能実装
- [ ] 監査ログ記録実装

#### フロントエンド
- [ ] 4つのコンポーネント実装
- [ ] useBoardAgendaReview フック実装
- [ ] API連携・エラーハンドリング

#### 運用
- [ ] レビュー期限管理（リマインダー）
- [ ] レビュー完了率監視
- [ ] 監査ログ・モニタリング

### 8.3 実装スケジュール

| Phase | 期間 | 成果物 |
|-------|------|--------|
| Phase 1 | 2日 | データベース・サービス層実装 |
| Phase 2 | 1日 | API実装・統合テスト |
| Phase 3 | 2日 | フロントエンド実装・ページ統合 |

**総工数**: **5日（1週間）**

### 8.4 テスト要件

- ユニットテスト: 15ケース以上
- API統合テスト: 10ケース以上
- エンドツーエンドテスト: 1ケース（Level 17 → Level 18 ワークフロー全体）

### 8.5 次のステップ

1. **VoiceDrive側**: 実装開始（推定5日）
2. **医療システム側**: 待機（作業なし）
3. **統合テスト**: 実装完了後、ワークフローテスト実施

---

## 9. 関連ドキュメント

- **暫定マスターリスト**: Board Agenda Review 暫定マスターリスト（受領済み）
- **BoardPreparation確認結果**: [board-preparation_医療システム確認結果_20251011.md](./board-preparation_医療システム確認結果_20251011.md)
- **ExecutiveReports確認結果**: [executive-reports_医療システム確認結果_20251011.md](./executive-reports_医療システム確認結果_20251011.md)
- **データ管理責任分界点定義書**: データ管理責任分界点定義書_20251008.md（共有済み）

---

## 10. 承認

### 10.1 医療システム側承認

- [x] **確認完了**: 2025年10月11日
- [x] **医療システム側の追加実装不要を確認**
- [x] **VoiceDrive側実装推奨事項を提供**

### 10.2 VoiceDrive側確認依頼

この確認結果ドキュメントをVoiceDriveチームに共有し、以下を確認してください：

- [ ] 医療システム側の実装不要について合意
- [ ] VoiceDrive側の実装推奨事項を確認
- [ ] 実装スケジュール（5日）の妥当性確認
- [ ] 統合テスト日程の調整

---

**ドキュメント作成者**: 医療職員管理システム開発チーム
**作成日**: 2025年10月11日
**バージョン**: 1.0.0
**ステータス**: ✅ 確認完了
**次のアクション**: VoiceDriveチームへの共有・実装開始承認待ち
