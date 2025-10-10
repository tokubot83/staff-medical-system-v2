# PersonalStation DB要件への回答書

**文書番号**: RESPONSE-PS-DB-2025-1009-001
**作成日**: 2025年10月9日
**宛先**: VoiceDrive開発チーム様
**差出**: 職員カルテシステム開発チーム
**件名**: PersonalStationページ DB要件分析への回答

---

## 📋 エグゼクティブサマリー

VoiceDrive開発チーム様よりご共有いただきました「PersonalStationページ DB要件分析」について、医療システム側での対応内容を以下の通り回答いたします。

### ✅ 医療システム側で提供するAPI

| API | エンドポイント | 目的 | 実装優先度 | 実装予定 |
|-----|--------------|------|-----------|---------|
| **API-1** | `GET /api/v2/employees/{employeeId}` | 基本職員情報 | 🔴 HIGH | **既存実装済み** |
| **API-2** | `GET /api/v2/employees/{employeeId}/experience-summary` | 経験年数サマリ | 🔴 HIGH | **11月4日〜8日** |

### ✅ 医療システム側で提供するWebhook

| Webhook | イベント | 送信タイミング | 実装優先度 | 実装予定 |
|---------|---------|--------------|-----------|---------|
| **Webhook-1** | `employee.updated` | 職員情報更新時 | 🔴 HIGH | **既存実装済み** |
| **Webhook-2** | `employee.experience_updated` | 経験年数更新時 | 🟡 MEDIUM | **11月11日〜15日（日次バッチ推奨）** |
| **Webhook-3** | `employee.retired` | 退職時 | 🔴 HIGH | **既存実装済み** |
| **Webhook-4** | `employee.reinstated` | 復職時 | 🟡 MEDIUM | **11月11日〜15日** |

---

## 🎯 VoiceDrive側で必要なテーブル追加（医療システム側の見解）

### ✅ 承認するテーブル追加

| テーブル | 優先度 | 医療システム側の見解 | 推奨実装時期 |
|---------|-------|-------------------|------------|
| **VoteHistory** | 🔴 CRITICAL | **強く推奨** - PersonalStation統計の基礎データとして必須 | **Phase 2（11月11日〜18日）** |
| **UserActivitySummary** | 🟡 RECOMMENDED | **推奨** - パフォーマンス最適化に有効 | **Phase 3（11月18日〜22日）** |

### ✅ 承認するフィールド追加

| テーブル | 追加フィールド | 優先度 | 医療システム側の見解 | 推奨実装時期 |
|---------|--------------|-------|-------------------|------------|
| **User** | `experienceYears` | 🔴 CRITICAL | **承認** - 医療システムAPI-2から取得してキャッシュ | **Phase 1（11月4日〜8日）** |

---

## 📝 重大な不足項目への回答

### 🔴 不足項目1: `experienceYears`フィールド

#### 問題点
- PersonalStation 157行目: `{contextUser?.experienceYears || 0}年`
- VoiceDrive `User`テーブルに存在しない
- 医療システム`Employee`テーブルにも直接的には存在しない

#### 医療システム側の解決策

**新規API実装: API-2**

```typescript
/**
 * GET /api/v2/employees/{employeeId}/experience-summary
 * 経験年数サマリ取得（VoiceDrive PersonalStation用）
 */
router.get('/api/v2/employees/:employeeId/experience-summary', authenticateAPI, async (req, res) => {
  const { employeeId } = req.params;

  try {
    const employee = await prisma.employee.findUnique({
      where: { employeeId },
      include: {
        workExperiences: {
          orderBy: { startDate: 'asc' }
        }
      }
    });

    if (!employee) {
      return res.status(404).json({
        error: 'Employee not found',
        code: 'EMPLOYEE_NOT_FOUND'
      });
    }

    // 1. 勤続年数（当法人での年数）
    const yearsOfService = employee.yearsOfService || 0;

    // 2. 前職経験年数の合計（WorkExperienceテーブルから計算）
    const priorExperience = employee.workExperiences
      .filter(exp => exp.endDate && exp.startDate)
      .reduce((total, exp) => {
        const years = (exp.endDate.getTime() - exp.startDate.getTime())
          / (1000 * 60 * 60 * 24 * 365);
        return total + years;
      }, 0);

    // 3. 総職務経験年数（当法人 + 前職）
    const totalExperienceYears = yearsOfService + priorExperience;

    // 4. 現職での年数
    const currentPositionYears = employee.hireDate
      ? (Date.now() - employee.hireDate.getTime()) / (1000 * 60 * 60 * 24 * 365)
      : 0;

    // 5. 専門分野経験年数（同じprofessionCategoryでの合計）
    const specialtyExperience = employee.workExperiences
      .filter(exp =>
        exp.profession === employee.professionCategory &&
        exp.endDate &&
        exp.startDate
      )
      .reduce((total, exp) => {
        const years = (exp.endDate.getTime() - exp.startDate.getTime())
          / (1000 * 60 * 60 * 24 * 365);
        return total + years;
      }, 0);

    const specialtyExperienceYears = yearsOfService + specialtyExperience;

    // レスポンス
    res.json({
      employeeId,
      yearsOfService: Math.round(yearsOfService * 10) / 10,
      totalExperienceYears: Math.round(totalExperienceYears * 10) / 10,
      currentPositionYears: Math.round(currentPositionYears * 10) / 10,
      priorExperience: Math.round(priorExperience * 10) / 10,
      specialtyExperienceYears: Math.round(specialtyExperienceYears * 10) / 10,
      calculatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('[API-2] Experience summary error:', error);
    res.status(500).json({
      error: 'Failed to calculate experience summary',
      code: 'CALCULATION_ERROR'
    });
  }
});
```

**レスポンス例**:
```json
{
  "employeeId": "EMP001",
  "yearsOfService": 4.5,
  "totalExperienceYears": 8.2,
  "currentPositionYears": 2.1,
  "priorExperience": 3.7,
  "specialtyExperienceYears": 6.5,
  "calculatedAt": "2025-10-09T10:00:00.000Z"
}
```

#### VoiceDrive側で必要な対応

**1. Userテーブルにフィールド追加**

```prisma
model User {
  // ... 既存フィールド

  // 🆕 PersonalStation用
  experienceYears          Float?    @map("experience_years")
  experienceLastUpdatedAt  DateTime? @map("experience_last_updated_at")

  @@map("users")
}
```

**2. マイグレーション**

```bash
npx prisma migrate dev --name add_experience_years_to_user
```

**3. 医療システムAPI呼び出し**

```typescript
// VoiceDrive: src/services/MedicalSystemClient.ts

export async function syncEmployeeExperience(employeeId: string) {
  try {
    // API-2を呼び出し
    const response = await fetch(
      `${MEDICAL_SYSTEM_API_BASE}/api/v2/employees/${employeeId}/experience-summary`,
      {
        headers: {
          'Authorization': `Bearer ${JWT_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`API-2 failed: ${response.status}`);
    }

    const data = await response.json();

    // VoiceDrive Userテーブルを更新
    await prisma.user.update({
      where: { employeeId },
      data: {
        experienceYears: data.totalExperienceYears,
        experienceLastUpdatedAt: new Date()
      }
    });

    return data;

  } catch (error) {
    console.error('[MedicalSystemClient] Experience sync failed:', error);
    throw error;
  }
}
```

**4. PersonalStationページで使用**

```typescript
// PersonalStation.tsx (157行目付近)
<Text className="text-lg text-gray-600">
  {contextUser?.experienceYears || 0}年
</Text>
```

#### 実装スケジュール

| タスク | 担当 | 期日 |
|--------|-----|------|
| API-2実装 | 医療システムチーム | 11月4日〜8日 |
| Userテーブル拡張 | VoiceDriveチーム | 11月4日〜8日 |
| 同期処理実装 | VoiceDriveチーム | 11月4日〜8日 |
| 統合テスト | 両チーム | 11月9日 |

---

### 🔴 不足項目2: VoiceDrive活動統計の集計機能

#### 問題点
- 総投票数、影響力スコア、提案数が全てダミーデータ
- PersonalStation 76-81行目でハードコード
- 実データ集計のための専用テーブルが必要

#### VoiceDrive側で必要な対応（医療システム側は関与なし）

**推奨テーブル: VoteHistory**

```prisma
model VoteHistory {
  id            String    @id @default(cuid())
  userId        String    @map("user_id")
  postId        String    @map("post_id")
  voteOption    String    @map("vote_option")
  // "strongly-support" | "support" | "neutral" | "oppose" | "strongly-oppose"
  voteWeight    Float     @default(1.0) @map("vote_weight")
  // 権限レベルに応じた投票重み（Level 1-3: 1.0, Level 4-6: 1.5, Level 7-9: 2.0）
  votedAt       DateTime  @default(now()) @map("voted_at")

  // 統計用カテゴリ情報（集計高速化のため非正規化）
  postCategory  String?   @map("post_category")
  // "improvement" | "communication" | "innovation" | "strategy"
  postType      String?   @map("post_type")
  // "improvement" | "project"

  // Relations
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  post          Post      @relation(fields: [postId], references: [id], onDelete: Cascade)

  @@unique([userId, postId])
  @@index([userId])
  @@index([postId])
  @@index([votedAt])
  @@index([postCategory])
  @@map("vote_history")
}
```

**統計集計サービス**

```typescript
// VoiceDrive: src/services/UserActivityService.ts

export async function getUserVoteStats(userId: string) {
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // 総投票数
  const totalVotes = await prisma.voteHistory.count({
    where: { userId }
  });

  // 今月の投票数
  const thisMonthVotes = await prisma.voteHistory.count({
    where: {
      userId,
      votedAt: { gte: thisMonthStart }
    }
  });

  // 影響力スコア計算（投票重みの合計 × 2、最大100）
  const votes = await prisma.voteHistory.findMany({
    where: { userId },
    select: { voteWeight: true }
  });

  const totalWeight = votes.reduce((sum, v) => sum + v.voteWeight, 0);
  const impactScore = Math.min(100, Math.round(totalWeight * 2));

  return {
    total: totalVotes,
    thisMonth: thisMonthVotes,
    impactScore
  };
}

export async function getVoteStatsByCategory(userId: string) {
  const votes = await prisma.voteHistory.groupBy({
    by: ['postCategory'],
    where: {
      userId,
      postCategory: { not: null }
    },
    _count: { id: true }
  });

  return {
    improvement: votes.find(v => v.postCategory === 'improvement')?._count.id || 0,
    communication: votes.find(v => v.postCategory === 'communication')?._count.id || 0,
    innovation: votes.find(v => v.postCategory === 'innovation')?._count.id || 0,
    strategy: votes.find(v => v.postCategory === 'strategy')?._count.id || 0,
  };
}
```

**PersonalStationページで使用**

```typescript
// PersonalStation.tsx
const [voteStats, setVoteStats] = useState({ total: 0, thisMonth: 0, impactScore: 0 });
const [categoryStats, setCategoryStats] = useState({ improvement: 0, communication: 0, innovation: 0, strategy: 0 });

useEffect(() => {
  async function loadStats() {
    if (user?.id) {
      const stats = await getUserVoteStats(user.id);
      const categories = await getVoteStatsByCategory(user.id);
      setVoteStats(stats);
      setCategoryStats(categories);
    }
  }
  loadStats();
}, [user?.id]);

// 194-226行目付近で使用
<Text className="text-3xl font-bold">{voteStats.total}</Text>
<Text className="text-sm text-gray-500">今月 {voteStats.thisMonth}回</Text>
<Text className="text-3xl font-bold">{voteStats.impactScore}</Text>
```

#### 医療システム側の関与

**なし** - この機能はVoiceDrive独自の活動統計であり、医療システムは関与しません。

---

### 🔴 不足項目3: 投票履歴の管理テーブル

#### 問題点
- PersonalStation 600-729行目で投票履歴表示
- `posts.filter(p => p.hasUserVoted || p.userVote)` としているが、実際の投票記録テーブルがない
- ページリロードで投票履歴が消える可能性

#### VoiceDrive側で必要な対応（医療システム側は関与なし）

**解決策**: 前述の`VoteHistory`テーブルで対応

**投票履歴取得**

```typescript
// VoiceDrive: src/services/UserActivityService.ts

export async function getUserVotedPosts(userId: string) {
  const votedPosts = await prisma.voteHistory.findMany({
    where: { userId },
    include: {
      post: {
        include: {
          author: true,
          votes: true
        }
      }
    },
    orderBy: { votedAt: 'desc' }
  });

  return votedPosts.map(v => ({
    ...v.post,
    userVote: v.voteOption,
    votedAt: v.votedAt
  }));
}
```

**PersonalStationページで使用**

```typescript
// PersonalStation.tsx (600-729行目付近)
const [votedPosts, setVotedPosts] = useState([]);

useEffect(() => {
  async function loadVotedPosts() {
    if (user?.id) {
      const posts = await getUserVotedPosts(user.id);
      setVotedPosts(posts);
    }
  }
  loadVotedPosts();
}, [user?.id]);

// 表示
const agendaVotes = votedPosts.filter(p => p.type === 'improvement');
const projectVotes = votedPosts.filter(p => p.type !== 'improvement');
```

#### 医療システム側の関与

**なし** - この機能はVoiceDrive独自の投票管理であり、医療システムは関与しません。

---

## 🎯 実装フェーズ提案

### Phase 1: 最小限の動作（11月4日〜8日）

**目標**: PersonalStationページが基本的に動作する

#### 医療システム側

| タスク | 内容 | 担当 | 期日 |
|--------|-----|------|------|
| ✅ API-1確認 | GET /api/v2/employees/:id（既存実装確認） | 医療システム | 11月4日 |
| 🆕 API-2実装 | GET /api/v2/employees/:id/experience-summary | 医療システム | 11月4日〜8日 |
| 🆕 単体テスト | API-2の単体テスト作成 | 医療システム | 11月4日〜8日 |
| 🆕 API仕様書更新 | API-2の仕様書追加 | 医療システム | 11月8日 |

#### VoiceDrive側

| タスク | 内容 | 担当 | 期日 |
|--------|-----|------|------|
| 🆕 Userテーブル拡張 | experienceYears, experienceLastUpdatedAt追加 | VoiceDrive | 11月4日 |
| 🆕 マイグレーション | Prisma migrate実行 | VoiceDrive | 11月4日 |
| 🆕 API-2呼び出し実装 | MedicalSystemClient拡張 | VoiceDrive | 11月5日〜7日 |
| 🆕 PersonalStation修正 | experienceYears表示に切り替え | VoiceDrive | 11月7日〜8日 |

#### 統合テスト

| タスク | 内容 | 担当 | 期日 |
|--------|-----|------|------|
| 🆕 API-2テスト | 経験年数計算の正確性確認 | 両チーム | 11月9日 |
| 🆕 PersonalStation表示確認 | 実データでの表示確認 | 両チーム | 11月9日 |

**Phase 1完了時の動作範囲**:
- ✅ ユーザー基本情報表示（名前、部署、役職、**経験年数**）
- ✅ 権限レベル表示
- ✅ マイポスト表示
- ⚠️ 統計カード（ダミーデータのまま）
- ⚠️ 投票履歴（不正確のまま）

---

### Phase 2: 投票履歴の正確化（11月11日〜18日）

**目標**: 投票関連の統計が正確に表示される

#### VoiceDrive側のみ

| タスク | 内容 | 担当 | 期日 |
|--------|-----|------|------|
| 🆕 VoteHistoryテーブル追加 | Prisma schema定義 | VoiceDrive | 11月11日 |
| 🆕 マイグレーション | Prisma migrate実行 | VoiceDrive | 11月11日 |
| 🆕 投票記録処理実装 | recordVote関数実装 | VoiceDrive | 11月12日〜14日 |
| 🆕 統計集計実装 | UserActivityService実装 | VoiceDrive | 11月14日〜16日 |
| 🆕 PersonalStation修正 | ダミーデータを実データに置き換え | VoiceDrive | 11月16日〜18日 |

#### 医療システム側

**関与なし**

**Phase 2完了時の動作範囲**:
- ✅ 統計カード（実データ）
- ✅ カテゴリ別投票実績（実データ）
- ✅ 投票履歴（正確）

---

### Phase 3: パフォーマンス最適化（11月18日〜22日）

**目標**: ページ読み込みを高速化

#### VoiceDrive側のみ

| タスク | 内容 | 担当 | 期日 |
|--------|-----|------|------|
| 🆕 UserActivitySummaryテーブル追加 | Prisma schema定義 | VoiceDrive | 11月18日 |
| 🆕 マイグレーション | Prisma migrate実行 | VoiceDrive | 11月18日 |
| 🆕 日次バッチ実装 | 全ユーザーの統計を事前集計 | VoiceDrive | 11月19日〜21日 |
| 🆕 PersonalStation最適化 | UserActivitySummaryから取得 | VoiceDrive | 11月21日〜22日 |

#### 医療システム側

**関与なし**

**Phase 3完了時の動作範囲**:
- ✅ 高速な統計表示（事前集計データ使用）
- ✅ スケーラビリティ向上（1000ユーザー対応）

---

## 📋 確認事項と質問

### 質問1: WorkExperienceテーブルの使用可否

**質問**:
医療システムのDB構築計画書 Section 14に`WorkExperience`テーブルが定義されていますが、このテーブルは既に構築済みでしょうか？

**必要な理由**:
API-2 (`/api/v2/employees/:id/experience-summary`) の実装で、前職の経験年数を集計するために使用します。

**代替案**:
もし`WorkExperience`テーブルがまだ構築されていない場合、Phase 1では`Employee.yearsOfService`のみを返し、WorkExperienceテーブル構築後にAPI-2を拡張することも可能です。

---

### 質問2: Webhook-2（経験年数更新）の送信頻度

**提案**:
経験年数は頻繁に変わるデータではないため、**日次バッチでの更新**を推奨します。

**日次バッチ案**:
- **実行時刻**: 毎日 02:00 JST
- **対象**: 全職員
- **処理内容**:
  1. 全職員の経験年数を再計算
  2. 前回計算値と比較して変更があった職員のみWebhook送信
  3. VoiceDrive側でUserテーブルを更新

**メリット**:
- リアルタイム更新の負荷を回避
- 経験年数の計算ロジックが一箇所に集約
- VoiceDrive側のキャッシュと医療システムの整合性が保たれる

**質問**:
この日次バッチ案で問題ないでしょうか？それともリアルタイム更新が必要でしょうか？

---

### 質問3: API認証方式の確認

**確認事項**:
API-1、API-2ともに、現在の統合テストで使用している**JWT Bearer Token認証**で問題ないでしょうか？

**現在の認証情報**:
- **JWT Token**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **アカウントレベル**: 99（最高権限）
- **有効期限**: 無期限

**追加確認**:
- レート制限は100リクエスト/時間で問題ないか？
- IPホワイトリストの設定は必要か？

---

## ✅ 医療システム側の作業スケジュール

### Week 1: Phase 1実装（11月4日〜8日）

| 日付 | タスク | 成果物 | 担当 |
|------|--------|-------|------|
| **11月4日（月）** | API-2設計、WorkExperienceテーブル確認 | 設計書 | 医療システムチーム |
| **11月5日（火）** | API-2実装開始 | src/api/routes/employee.routes.ts | 医療システムチーム |
| **11月6日（水）** | API-2実装完了、単体テスト作成 | テストコード | 医療システムチーム |
| **11月7日（木）** | API-2ドキュメント作成 | API仕様書 | 医療システムチーム |
| **11月8日（金）** | VoiceDriveチームへのAPI提供準備完了通知 | 準備完了通知書 | 医療システムチーム |

### Week 2: 統合テストサポート（11月11日〜15日）

| 日付 | タスク | 成果物 | 担当 |
|------|--------|-------|------|
| **11月9日（土）** | 統合テスト（VoiceDriveチームと合同） | テスト報告書 | 両チーム |
| **11月11日（月）** | Webhook-2設計（日次バッチ） | 設計書 | 医療システムチーム |
| **11月12日（火）** | Webhook-2実装開始 | src/jobs/updateExperienceYears.ts | 医療システムチーム |
| **11月13日（水）** | Webhook-2実装完了、テスト | テストコード | 医療システムチーム |
| **11月14日（木）** | Webhook-4（復職）実装 | src/webhooks/employee-reinstated.ts | 医療システムチーム |
| **11月15日（金）** | Webhook実装完了通知 | 完了通知書 | 医療システムチーム |

---

## 🔗 関連ドキュメント

### 既存ドキュメント
- [データ管理責任分界点定義書_20251008.md](./データ管理責任分界点定義書_20251008.md)
- [DB構築計画書前準備_不足項目整理_20251008.md](../../docs/DB構築計画書前準備_不足項目整理_20251008.md)
- [共通DB構築後統合作業再開計画書_20251008.md](./共通DB構築後統合作業再開計画書_20251008.md)

### 新規作成予定ドキュメント（今後作成）
- [ ] API-2仕様書（11月7日）
- [ ] Webhook-2仕様書（11月13日）
- [ ] Webhook-4仕様書（11月14日）
- [ ] Phase 1統合テスト報告書（11月9日）

---

## 📞 連絡体制

### 実装期間中の連絡体制（11月4日〜11月22日）

#### Slack
- **チャンネル**: `#voicedrive-medical-integration`
- **稼働時間**: 平日9:00-18:00（JST）
- **緊急連絡**: DM（24時間対応）

#### MCPサーバー
- **場所**: `mcp-shared/docs/`
- **更新頻度**: 毎営業日

#### ミーティング
- **週次ミーティング**: 毎週月曜 14:00-14:30
- **Phase 1統合テスト**: 11月9日（土） 10:00-12:00
- **緊急ミーティング**: 必要に応じて随時

### 質問・確認事項の連絡方法

**即座に回答が必要な場合**:
1. Slack `#voicedrive-medical-integration` にメンション
2. 緊急の場合はDM

**ドキュメントベースの確認事項**:
1. MCPサーバー `mcp-shared/docs/` に質問書を作成
2. Slackで通知
3. 翌営業日中に回答書を作成

---

## 🎉 まとめ

### ✅ 医療システム側の対応サマリー

| 項目 | 対応内容 | 実装時期 | 状態 |
|------|---------|---------|------|
| **API-1** | 基本職員情報取得 | 既存 | ✅ 実装済み |
| **API-2** | 経験年数サマリ取得 | 11月4日〜8日 | 🆕 新規実装 |
| **Webhook-1** | 職員情報更新 | 既存 | ✅ 実装済み |
| **Webhook-2** | 経験年数更新（日次バッチ推奨） | 11月11日〜15日 | 🆕 新規実装 |
| **Webhook-3** | 退職通知 | 既存 | ✅ 実装済み |
| **Webhook-4** | 復職通知 | 11月11日〜15日 | 🆕 新規実装 |

### ✅ VoiceDrive側の対応サマリー（医療システム側の推奨）

| 項目 | 対応内容 | 実装時期 | 優先度 |
|------|---------|---------|--------|
| **User.experienceYears** | フィールド追加 | 11月4日〜8日 | 🔴 CRITICAL |
| **VoteHistory** | テーブル追加 | 11月11日〜18日 | 🔴 CRITICAL |
| **UserActivitySummary** | テーブル追加 | 11月18日〜22日 | 🟡 RECOMMENDED |

### 📅 全体スケジュール

```
11月4日〜8日   : Phase 1実装（経験年数API + VoiceDrive Userテーブル拡張）
11月9日       : Phase 1統合テスト
11月11日〜18日 : Phase 2実装（VoteHistory + 統計集計）
11月18日〜22日 : Phase 3実装（UserActivitySummary + パフォーマンス最適化）
11月25日〜30日 : 全体統合テスト
12月2日〜4日   : 本番環境デプロイ
12月5日 02:00  : PersonalStation本番リリース 🎉
```

---

## 🙏 今後の協力について

VoiceDrive開発チーム様

詳細なDB要件分析書をご共有いただき、誠にありがとうございます。
医療システム側としても、PersonalStationページの成功は両チームの協力の成果と考えております。

本回答書の内容について、ご不明点や追加のご要望がございましたら、お気軽にご連絡ください。

引き続き、医療現場のDX推進に向けて協力してまいりましょう。

よろしくお願いいたします。

---

**職員カルテシステム開発チーム一同**
**2025年10月9日**
