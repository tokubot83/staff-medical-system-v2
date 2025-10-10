# VoiceDriveボイス分析機能API仕様に関する回答

**作成日：2025年10月7日**
**作成者：職員カルテシステム開発チーム**
**宛先：VoiceDrive開発チーム様**

---

## 1. はじめに

VoiceDriveボイス分析機能の集団分析データ受信API仕様に関するお問い合わせ、ありがとうございます。
職員カルテシステム側の現状と今後の対応方針について回答いたします。

### 1.1 回答サマリー

| 質問 | 回答 | 実装状況 |
|------|------|---------|
| **Q1. データ提供可否** | ✅ 提供可能（段階的実装） | 一部実装済み |
| **Q2. 感情分析・トピック分析** | ⏳ 未実施（VoiceDrive側で実装推奨） | 未実装 |
| **Q3. 送信タイミング** | ✅ A案（プッシュ型）を推奨 | 未実装 |
| **Q4. データ更新頻度** | ✅ 日次を推奨 | 未実装 |
| **Q5. 認証方式** | ✅ JWT方式でOK | - |
| **Q6. 追加要望** | ✅ あり（詳細は後述） | - |

---

## 2. Q1: データ提供可否について

### 2.1 現在の実装状況（2025年10月7日時点）

#### ✅ 実装済み機能

| 機能 | 実装ファイル | 実装レベル |
|------|------------|----------|
| **同意データ取得** | `VoiceDriveDataService.ts` | ✅ 本番レベル |
| **K-匿名性チェック** | `VoiceDriveAnalyticsService.ts` | ✅ 本番レベル |
| **分析ダッシュボードUI** | `reports/voicedrive-analytics/page.tsx` | ✅ 本番レベル（モックデータ） |

#### ⏳ 未実装（追加開発が必要）

| 機能 | 実装必要度 | 開発工数 |
|------|----------|---------|
| **投稿データ集計** | 必須 | 2-3日 |
| **部門別分析** | 必須 | 2-3日 |
| **時系列分析** | 推奨 | 1-2日 |
| **感情分析** | オプション | 3-5日 |
| **トピック分析** | オプション | 3-5日 |

### 2.2 提供可能な項目（段階実装）

#### Phase 1: 基本統計（現在実装可能）

```typescript
// 現在実装可能な項目
interface BasicAnalyticsData {
  // メタデータ
  analysisDate: string;
  period: {
    startDate: string;
    endDate: string;
  };

  // 基本統計
  postingTrends: {
    totalPosts: number;              // ⏳ VoiceDrive Postsテーブル集計が必要
    totalUsers: number;              // ✅ 実装済み
    totalEligibleUsers: number;      // ✅ 実装済み
    participationRate: number;       // ⏳ 投稿データ集計が必要
  };

  // エンゲージメント
  engagementMetrics: {
    averageCommentsPerPost: number;  // ⏳ Commentsテーブル集計が必要
    averageVotesPerIdea: number;     // ⏳ Votesテーブル集計が必要
    activeUserRate: number;          // ⏳ 投稿データ集計が必要
  };

  // プライバシー保護情報
  privacyMetadata: {
    totalConsentedUsers: number;     // ✅ 実装済み
    minimumGroupSize: number;        // ✅ 実装済み（K=5）
    excludedSmallGroupsCount: number; // ✅ 実装可能
  };
}
```

#### Phase 2: 部門別・時系列分析（追加開発必要）

```typescript
interface AdvancedAnalyticsData extends BasicAnalyticsData {
  // 部門別
  postingTrends: {
    // ...既存フィールド

    byDepartment: Array<{         // ⏳ VoiceDrive User-Post結合が必要
      department: string;
      count: number;
      percentage: number;
    }>;

    byLevel: Array<{               // ⏳ 権限レベル別集計が必要
      levelRange: string;
      count: number;
      percentage: number;
    }>;

    monthlyTrend: Array<{          // ⏳ 時系列集計が必要
      month: string;
      count: number;
    }>;
  };

  engagementMetrics: {
    // ...既存フィールド

    byDepartment: Array<{          // ⏳ 部門別エンゲージメント集計が必要
      department: string;
      engagementScore: number;
    }>;
  };
}
```

#### Phase 3: 感情分析・トピック分析（VoiceDrive側実装推奨）

```typescript
interface SentimentAnalyticsData extends AdvancedAnalyticsData {
  // 感情分析
  sentimentAnalysis: {
    positive: number;
    neutral: number;
    negative: number;
    positiveRate: number;
    negativeRate: number;

    byDepartment: Array<{
      department: string;
      positiveRate: number;
      negativeRate: number;
    }>;
  };

  // トピック分析
  topicAnalysis: {
    topKeywords: Array<{
      keyword: string;
      count: number;
      category: string;
    }>;

    emergingTopics: Array<{
      topic: string;
      growthRate: number;
      firstSeenDate: string;
    }>;

    byDepartment: Array<{
      department: string;
      topTopics: string[];
    }>;
  };
}
```

### 2.3 実装ロードマップ

#### 今後の実装計画（提案）

| Phase | 内容 | 工数 | 実施時期 |
|-------|------|------|---------|
| **Phase 1** | 基本統計API実装 | 5日 | Phase 7完了後 |
| **Phase 2** | 部門別・時系列分析 | 5日 | Phase 1完了後 |
| **Phase 3** | 感情分析・トピック分析 | 10日 | Phase 2完了後 |

**合計工数：約20日（約1ヶ月）**

---

## 3. Q2: 感情分析・トピック分析について

### 3.1 現状

**❌ 未実施**

職員カルテシステム側では、現在感情分析・トピック分析は実施していません。

### 3.2 実装方針の提案

#### 提案1: VoiceDrive側での実装（推奨）

**理由**：
- ✅ VoiceDrive側に投稿テキストデータがある
- ✅ 感情分析エンジン（Google Natural Language API、Azure Text Analytics等）との連携が容易
- ✅ プライバシー保護が容易（集団統計化してから職員カルテに送信）
- ✅ リアルタイム分析が可能

**実装イメージ**：
```typescript
// VoiceDrive側で実装（提案）
class VoiceAnalyticsService {
  async analyzeSentiment(posts: Post[]): Promise<SentimentResult> {
    // Google Natural Language APIで感情分析
    const sentiments = await this.sentimentAnalyzer.analyze(posts);

    // 個人が特定されないよう集団統計化
    return this.aggregateSentiments(sentiments);
  }

  async analyzeTopics(posts: Post[]): Promise<TopicResult> {
    // TF-IDFまたはLDAでトピック抽出
    const topics = await this.topicAnalyzer.extract(posts);

    // K-匿名性チェック後に集団統計化
    return this.aggregateTopics(topics);
  }
}
```

#### 提案2: 職員カルテ側での実装（代替案）

**条件**：
- VoiceDrive側から投稿テキストデータを共有いただく必要がある
- プライバシー保護のため、匿名化された投稿のみ受信

**実装イメージ**：
```typescript
// 職員カルテ側で実装する場合
class StaffCardAnalyticsService {
  async analyzeSentiment(anonymizedPosts: AnonymizedPost[]): Promise<SentimentResult> {
    // 匿名化された投稿を感情分析
    // （個人特定不可であることが前提）
  }
}
```

### 3.3 推奨実装方針

**VoiceDrive側での実装を推奨します。**

理由：
1. ✅ データソースに近い場所での処理が効率的
2. ✅ プライバシー保護が容易（生データを外部に送信しない）
3. ✅ 感情分析APIとの連携が容易
4. ✅ リアルタイム分析が可能

職員カルテシステムには、VoiceDrive側で分析・集約された**集団統計データのみ**を受信します。

---

## 4. Q3: データ送信タイミングについて

### 4.1 推奨方式

**A案: 職員カルテ側から定期的にプッシュ（推奨）**

#### 推奨理由

| 項目 | A案（プッシュ） | B案（プル） |
|------|---------------|------------|
| **実装の容易さ** | ✅ 簡単 | △ VoiceDrive側でAPIエンドポイント実装が必要 |
| **セキュリティ** | ✅ VoiceDrive側のAPI公開不要 | △ VoiceDrive側にAPIを公開 |
| **リトライ制御** | ✅ 職員カルテ側で制御可能 | △ VoiceDrive側での制御が必要 |
| **データ鮮度** | ✅ 定期的に最新データ送信 | ⚠️ VoiceDriveからのリクエストに依存 |
| **負荷分散** | ✅ バッチ処理で深夜実行可能 | △ VoiceDriveのリクエストタイミングに依存 |

### 4.2 実装イメージ（A案）

```typescript
// 職員カルテ側: 日次バッチ処理
export class VoiceAnalyticsExportService {
  /**
   * VoiceDriveに集団分析データを送信（日次バッチ）
   */
  async exportDailyAnalytics(): Promise<void> {
    console.log('[VoiceAnalytics] 日次エクスポート開始');

    try {
      // 1. 前日分のデータを分析
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const analyticsData = await this.generateAnalytics({
        startDate: yesterday,
        endDate: yesterday
      });

      // 2. K-匿名性チェック
      if (!this.checkKAnonymity(analyticsData)) {
        console.warn('[VoiceAnalytics] K-匿名性要件未達のため送信スキップ');
        return;
      }

      // 3. VoiceDriveに送信
      await this.sendToVoiceDrive(analyticsData);

      console.log('[VoiceAnalytics] 日次エクスポート完了');
    } catch (error) {
      console.error('[VoiceAnalytics] エクスポートエラー:', error);
      // リトライ処理
      await this.retryExport(error);
    }
  }

  private async sendToVoiceDrive(data: GroupAnalyticsRequest): Promise<void> {
    const response = await fetch('https://voicedrive.example.com/api/v1/analytics/group-data', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.VOICEDRIVE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`VoiceDrive API error: ${response.status}`);
    }
  }
}
```

### 4.3 実行スケジュール（提案）

```bash
# cron設定例（毎日深夜2:00に実行）
0 2 * * * node /app/scripts/export-voice-analytics.js
```

---

## 5. Q4: データ更新頻度について

### 5.1 推奨頻度

**日次（毎日深夜2:00実行）を推奨します。**

### 5.2 理由

| 更新頻度 | メリット | デメリット | 推奨度 |
|---------|---------|----------|--------|
| **日次** | ✅ データ鮮度と負荷のバランスが良い<br>✅ バッチ処理の安定性が高い<br>✅ 分析に十分な時間が取れる | △ リアルタイム性はない | ⭐⭐⭐⭐⭐ |
| **週次** | ✅ 負荷が低い<br>✅ データ量が多く分析精度が高い | ❌ データが古くなる<br>❌ トレンド変化の検知が遅れる | ⭐⭐ |
| **月次** | ✅ 負荷が最小 | ❌ データが古すぎる<br>❌ 緊急対応が必要な課題の検知が遅れる | ⭐ |
| **リアルタイム** | ✅ 最新データ | ❌ 実装が複雑<br>❌ 負荷が高い<br>❌ K-匿名性チェックが難しい | ⭐ |

### 5.3 段階的実装（提案）

#### Phase 1: 日次バッチ（推奨）

- **頻度**: 毎日深夜2:00
- **データ**: 前日の集団統計
- **実装難易度**: ⭐（簡単）

#### Phase 2: 日次 + 週次レポート

- **頻度**: 日次 + 毎週月曜日に週次サマリー
- **データ**: 日次統計 + 週次トレンド分析
- **実装難易度**: ⭐⭐（普通）

#### Phase 3: リアルタイム + バッチ

- **頻度**: 重要指標はリアルタイム、詳細分析は日次
- **データ**: 投稿数・エンゲージメント率はリアルタイム、詳細分析は日次
- **実装難易度**: ⭐⭐⭐⭐（高難易度）

### 5.4 初期実装の推奨

**Phase 1（日次バッチ）から開始し、運用実績を見て段階的に拡張することを推奨します。**

---

## 6. Q5: 認証方式について

### 6.1 回答

**✅ お知らせAPIと同様のJWT方式で問題ありません。**

### 6.2 実装イメージ

```typescript
// 職員カルテ側: JWT認証でデータ送信
const response = await fetch('https://voicedrive.example.com/api/v1/analytics/group-data', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.VOICEDRIVE_API_TOKEN}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(analyticsData)
});
```

### 6.3 セキュリティ強化（提案）

お知らせAPIと同様、以下のセキュリティ対策を推奨します：

- ✅ **HTTPS必須**（TLS 1.3）
- ✅ **JWTトークン**（有効期限付き）
- ✅ **IPホワイトリスト**（職員カルテシステムのIPのみ許可）
- ✅ **レート制限**（1時間あたり10リクエストまで）
- ✅ **署名検証**（HMAC-SHA256、オプション）

---

## 7. Q6: 追加要望について

### 7.1 VoiceDrive側への依頼事項

#### 依頼1: VoiceDrive投稿データへのアクセス方法の提供

**背景**：
職員カルテシステム側で集団分析を実施するには、VoiceDrive側の投稿データ（Posts, Comments, Votes）にアクセスする必要があります。

**依頼内容**：
以下のいずれかの方法で投稿データへのアクセスを提供いただけますでしょうか。

**方法A: 共有DBビューの作成（推奨）**

```sql
-- VoiceDrive側でビューを作成（個人特定不可データのみ）
CREATE VIEW StaffCard_AnonymizedPosts AS
SELECT
  p.id,
  p.createdAt,
  u.department,
  u.jobCategory,
  u.facilityId,
  -- ❌ 投稿内容は含めない（プライバシー保護）
  -- ❌ ユーザーIDは含めない（匿名性保護）
  (SELECT COUNT(*) FROM Comments WHERE postId = p.id) as commentCount,
  (SELECT COUNT(*) FROM Votes WHERE postId = p.id) as voteCount
FROM Posts p
INNER JOIN Users u ON p.userId = u.id
INNER JOIN DataConsent dc ON u.id = dc.userId
WHERE dc.analyticsConsent = 1
  AND dc.revokeDate IS NULL
  AND dc.dataDeletionRequested = 0;
```

**方法B: 集計APIの提供**

```typescript
// VoiceDrive側でAPIを提供
GET /api/v1/analytics/aggregated-stats
Response:
{
  "period": { "startDate": "2025-10-01", "endDate": "2025-10-07" },
  "stats": {
    "totalPosts": 123,
    "totalUsers": 45,
    "byDepartment": [
      { "department": "内科病棟", "postCount": 30, "userCount": 12 },
      { "department": "外来", "postCount": 25, "userCount": 10 }
    ]
  }
}
```

#### 依頼2: 感情分析・トピック分析の実装（推奨）

**背景**：
VoiceDrive側で感情分析・トピック分析を実装いただくことで、プライバシー保護が容易になります。

**依頼内容**：
- Google Natural Language API、Azure Text Analytics等を使用した感情分析
- TF-IDF、LDAを使用したトピック抽出
- 集団統計化（K-匿名性チェック後）

#### 依頼3: API仕様書の相互確認

**依頼内容**：
- 本問い合わせドキュメントの仕様案について、VoiceDrive側の設計と整合性を確認
- 必要に応じて調整

### 7.2 職員カルテ側の実装予定

| 機能 | 実装時期 | 工数 |
|------|---------|------|
| **基本統計API実装** | Phase 7完了後 | 5日 |
| **日次バッチ送信** | Phase 7完了後 | 2日 |
| **K-匿名性チェック強化** | Phase 7完了後 | 1日 |
| **部門別分析** | 基本統計完了後 | 3日 |
| **時系列分析** | 部門別分析完了後 | 2日 |

**合計工数：約13日（約2.5週間）**

---

## 8. 実装スケジュール（提案）

### 8.1 タイムライン

```
現在: 2025年10月7日
対応期限: 2025年10月10日（仕様回答）

Phase 7（人事お知らせ統合）: 2025年10月中旬〜下旬（2週間）
  ↓
Phase 7.5（ボイス分析API実装）: 2025年11月上旬〜中旬（2.5週間）
  - 基本統計API実装（5日）
  - 日次バッチ送信（2日）
  - K-匿名性チェック強化（1日）
  - 部門別分析（3日）
  - 時系列分析（2日）
  - テスト・調整（2日）
  ↓
統合テスト: 2025年11月下旬（3日）
  ↓
本番リリース: 2025年12月上旬
```

### 8.2 今後のアクション

#### 短期（10/10まで）

- [x] VoiceDriveチームへの回答書作成（本ドキュメント）
- [ ] VoiceDriveチームとの仕様調整ミーティング（オンライン）
- [ ] 相互確認事項の整理

#### 中期（Phase 7完了後）

- [ ] VoiceDrive投稿データへのアクセス方法の確定
- [ ] 基本統計API実装開始
- [ ] 日次バッチ送信機能実装

#### 長期（Phase 7.5）

- [ ] 部門別・時系列分析実装
- [ ] 統合テスト
- [ ] 本番リリース

---

## 9. 技術的な補足

### 9.1 K-匿名性チェックの実装

職員カルテシステム側では、既にK-匿名性チェック機能を実装済みです。

```typescript
// VoiceDriveAnalyticsService.ts（既存実装）
export class VoiceDriveAnalyticsService {
  private readonly K_ANONYMITY_MINIMUM = 5;

  checkKAnonymity(userIds: string[]): boolean {
    if (userIds.length < this.K_ANONYMITY_MINIMUM) {
      throw new KAnonymityError(userIds.length, this.K_ANONYMITY_MINIMUM);
    }
    return true;
  }
}
```

### 9.2 プライバシー保護の実装方針

職員カルテシステムでは、以下のプライバシー保護原則を遵守します：

- ✅ **n≥5ルール**: 5名未満のグループは分析対象外
- ✅ **同意済みユーザーのみ**: `analyticsConsent = true`のユーザーのみ
- ✅ **取り消し対応**: `revokeDate IS NOT NULL`のユーザーは除外
- ✅ **削除リクエスト対応**: `dataDeletionRequested = true`のユーザーは除外
- ✅ **個人特定不可**: 集団統計データのみ送信

---

## 10. まとめ

### 10.1 回答サマリー

| 質問 | 回答 |
|------|------|
| **Q1. データ提供可否** | ✅ 段階的に提供可能（Phase 1: 基本統計、Phase 2: 部門別・時系列、Phase 3: 感情分析） |
| **Q2. 感情分析・トピック分析** | ⏳ 未実施（VoiceDrive側での実装を推奨） |
| **Q3. 送信タイミング** | ✅ A案（プッシュ型、日次バッチ）を推奨 |
| **Q4. データ更新頻度** | ✅ 日次（毎日深夜2:00）を推奨 |
| **Q5. 認証方式** | ✅ JWT方式でOK |
| **Q6. 追加要望** | ✅ VoiceDrive投稿データへのアクセス方法の提供、感情分析の実装（VoiceDrive側） |

### 10.2 推奨実装アプローチ

**段階的実装（3段階）を推奨します。**

| Phase | 内容 | 工数 | 実施時期 |
|-------|------|------|---------|
| **Phase 1** | 基本統計（投稿数、ユーザー数、エンゲージメント） | 5日 | 2025年11月 |
| **Phase 2** | 部門別・時系列分析 | 5日 | 2025年12月 |
| **Phase 3** | 感情分析・トピック分析（VoiceDrive側実装） | 10日 | 2026年1月 |

### 10.3 次のステップ

#### 職員カルテシステム側

1. ✅ 本回答書の送付（10/7完了）
2. ⏳ VoiceDriveチームとの仕様調整ミーティング（10/8-10/10）
3. ⏳ Phase 7完了後、Phase 7.5（ボイス分析API実装）開始

#### VoiceDriveチーム側

1. ⏳ 本回答書の確認
2. ⏳ 投稿データアクセス方法の検討・提案
3. ⏳ 感情分析・トピック分析の実装検討
4. ⏳ API仕様書の最終調整

---

## 11. 連絡先・対応窓口

### 職員カルテシステム開発チーム

- **Slack**: `#staff-card-dev`
- **Email**: staff-card-dev@example.com
- **担当者**: 職員カルテプロジェクトリード

### 対応期限

**仕様確認ミーティング**: 2025年10月10日（木）までに実施希望

お手数ですが、以下のいずれかの方法でご連絡いただけますと幸いです：
- Slackで日程調整（Zoom/Google Meet）
- MCPサーバー経由でのドキュメント共有（`mcp-shared/docs/`）

---

## 12. 補足資料

### 12.1 参考実装ファイル

職員カルテシステム側で参考になる実装ファイル：

- `src/services/VoiceDriveDataService.ts` - 同意データ取得サービス
- `src/services/VoiceDriveAnalyticsService.ts` - K-匿名性チェック、分析サービス
- `src/app/reports/voicedrive-analytics/page.tsx` - 分析ダッシュボードUI

### 12.2 関連ドキュメント

- `mcp-shared/docs/AI_SUMMARY.md` - VoiceDrive統合プロジェクト全体概要
- `docs/Phase7_人事お知らせ統合実装計画.md` - Phase 7実装計画
- `mcp-shared/specs/voicedrive-stats-webhook-spec-v1.0.0.md` - 統計Webhook仕様書

---

**ご確認のほど、よろしくお願いいたします。**

**職員カルテシステム開発チーム一同**
**2025年10月7日**
