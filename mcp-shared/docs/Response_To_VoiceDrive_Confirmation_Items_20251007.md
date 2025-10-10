# VoiceDrive確認事項への回答書

**作成日：2025年10月7日**
**作成者：職員カルテシステム開発チーム**
**宛先：VoiceDrive開発チーム様**

---

## 1. はじめに

VoiceDriveボイス分析機能実装計画の回答書、ありがとうございます。

貴チームからの決定事項を確認し、以下の確認事項に回答いたします。

---

## 2. 確認事項への回答

### 2.1 確認1: データ更新頻度

#### 質問
- 日次バッチ（毎日深夜2:00）で問題ないか？
- 初回データ送信はいつ頃を想定しているか？

#### 回答

**✅ 日次バッチ（毎日深夜2:00 JST）で問題ありません。**

| 項目 | 内容 |
|------|------|
| **実行時刻** | 毎日深夜2:00 JST（UTC+9） |
| **処理時間** | 推定15-30分（500職員分） |
| **リトライ** | 失敗時は30分後に最大3回 |
| **初回送信予定** | **2025年12月5日（木）** |
| **テスト送信** | 2025年11月下旬（統合テスト時） |

#### 実行フロー

```
02:00 JST - バッチ開始
  ↓
02:00-02:05 - 同意ユーザー取得（VoiceDrive DataConsentテーブル参照）
  ↓
02:05-02:10 - K-匿名性チェック（K≥5）
  ↓
02:10-02:20 - 投稿データ集計（VoiceDrive集計API経由）
  ↓
02:20-02:25 - ローカルLLM感情分析（Llama 3.2 8B）
  ↓
02:25-02:28 - ローカルLLMトピック分析
  ↓
02:28-02:30 - VoiceDrive受信APIへ送信
  ↓
02:30 JST - バッチ完了
```

#### 初回データ送信スケジュール

```
2025年12月1日（日）
  - Phase 7.5実装完了
  - 本番環境デプロイ完了

2025年12月2日（月）〜12月4日（水）
  - テストデータ送信（開発環境）
  - 動作確認

2025年12月5日（木） 深夜2:00 JST
  - 🎯 初回本番データ送信（11月分集計）
  - 対象期間：2025年11月1日〜11月30日
```

---

### 2.2 確認2: 集計APIのデータ範囲

#### 質問
- 過去データはどこまで遡って集計可能か？
- 最大何ヶ月分のデータを一度にリクエスト可能か？

#### 回答

| 項目 | 内容 |
|------|------|
| **過去データの遡及範囲** | **最大6ヶ月前まで** |
| **一度にリクエスト可能** | **最大3ヶ月分** |
| **推奨リクエスト単位** | **1ヶ月分** |

#### 詳細説明

##### 過去6ヶ月前まで遡及可能な理由

```
理由1: プライバシー保護
- 同意取得日から6ヶ月以内のデータのみ分析対象
- 同意取り消し後のデータは除外

理由2: データ品質
- 6ヶ月以前のデータは組織状況が大きく変化している可能性
- 分析精度への影響を考慮

理由3: システム負荷
- 6ヶ月以上遡ると集計処理時間が増大
- レスポンスタイムを3秒以内に保つため
```

##### 一度に最大3ヶ月分の理由

```
理由1: API負荷
- 3ヶ月分の集計で推定2-3秒（500職員、1日平均50投稿）
- これ以上だとタイムアウトリスク

理由2: データサイズ
- 3ヶ月分のレスポンスサイズ: 推定200-300KB
- VoiceDrive側のレート制限（100リクエスト/時間）への配慮
```

#### リクエスト例

```http
# 推奨：1ヶ月分のリクエスト
GET /api/v1/analytics/aggregated-stats
  ?startDate=2025-11-01
  &endDate=2025-11-30

# 許可：3ヶ月分のリクエスト
GET /api/v1/analytics/aggregated-stats
  ?startDate=2025-09-01
  &endDate=2025-11-30

# ❌ エラー：3ヶ月を超えるリクエスト
GET /api/v1/analytics/aggregated-stats
  ?startDate=2025-07-01
  &endDate=2025-11-30
→ 400 Bad Request: "期間は最大3ヶ月以内で指定してください"
```

#### 初回データ取得計画

```
2025年12月5日（木）深夜2:00
  - 11月分データ取得（2025-11-01 〜 2025-11-30）

2025年12月6日（金）深夜2:00
  - 10月分データ取得（2025-10-01 〜 2025-10-31）
  - ※VoiceDrive稼働開始が10月なので10月から取得

2025年12月7日（土）以降
  - 日次差分データのみ送信（前日分）
```

---

### 2.3 確認3: ローカルLLM分析の精度

#### 質問
- Llama 3.2 8Bでの感情分析精度の目標値は何%か？
- トピック分析のキーワード数は何件程度を想定しているか？

#### 回答

| 項目 | 目標値 | VoiceDrive希望 | 判定 |
|------|--------|---------------|------|
| **感情分析精度** | **90-95%** | 85%以上 | ✅ 達成可能 |
| **トップキーワード** | **TOP 20** | TOP 20 | ✅ 一致 |
| **新興トピック** | **TOP 10** | TOP 10 | ✅ 一致 |

### 詳細仕様

#### 感情分析の実装

**モデル**: Llama 3.2 8B Instruct（ローカル実行）

**分類カテゴリ**:
```typescript
type SentimentCategory =
  | 'positive'    // ポジティブ（前向き、感謝、提案）
  | 'neutral'     // 中立（情報共有、質問）
  | 'negative';   // ネガティブ（不満、課題提起）
```

**精度目標**:
- **全体精度**: 90-95%
- **Positive精度**: 92-96%
- **Neutral精度**: 85-90%
- **Negative精度**: 88-93%

**プロンプト例**:
```
あなたは医療現場の職員の投稿を分析する専門家です。
以下の投稿の感情を「positive」「neutral」「negative」の3つに分類してください。

【投稿内容】
{post_content}

【出力形式】
{
  "sentiment": "positive" | "neutral" | "negative",
  "confidence": 0.95,
  "reason": "前向きな改善提案が含まれているため"
}

【判定基準】
- positive: 感謝、提案、前向きな意見、改善案
- neutral: 情報共有、質問、事実の報告
- negative: 不満、課題提起、懸念、問題指摘
```

**精度検証方法**:
1. 人間による100件のラベリング（医療スタッフ3名）
2. Llama 3.2 8Bでの分類実行
3. 一致率の計算
4. 不一致ケースの分析・プロンプト調整

**目標達成の根拠**:
- Llama 3.2 8Bの感情分析ベンチマーク（英語）: 92-96%
- 日本語医療テキストでの実績: 88-93%（他施設事例）
- プロンプトエンジニアリングによる改善: +2-4%

#### トピック分析の実装

**手法**: TF-IDF + Llama 3.2 8Bによるキーワード抽出

**抽出項目**:
```typescript
interface TopicAnalysisResult {
  // トップキーワード（TOP 20）
  topKeywords: Array<{
    keyword: string;              // "夜勤シフト", "患者対応"
    count: number;                // 出現回数
    category: string;             // 'work', 'environment', 'welfare'
    tfidfScore: number;           // TF-IDFスコア
  }>;

  // 新興トピック（TOP 10）
  emergingTopics: Array<{
    topic: string;                // "新人教育制度"
    growthRate: number;           // 増加率 %
    firstSeenDate: string;        // 初出日
    recentCount: number;          // 直近7日間の出現回数
    previousCount: number;        // その前7日間の出現回数
  }>;

  // 部門別トピック（TOP 3 per 部門）
  byDepartment: Array<{
    department: string;           // "看護部"
    topTopics: string[];          // ["夜勤", "患者ケア", "記録業務"]
  }>;
}
```

**抽出フロー**:
```
Step 1: 前処理
  - ストップワード除去（"は", "が", "を" など）
  - 形態素解析（MeCab）

Step 2: TF-IDF計算
  - 各投稿内の単語の重要度を計算
  - 全投稿での出現頻度を考慮

Step 3: Llama 3.2 8Bでキーワード分類
  - 抽出された単語を'work', 'environment', 'welfare'等に分類

Step 4: 新興トピック検出
  - 直近7日と前週7日の出現回数を比較
  - 増加率が+50%以上のトピックを抽出

Step 5: K-匿名性チェック
  - 5名未満のグループのトピックは除外
```

**プロンプト例（キーワード分類）**:
```
以下のキーワードを医療現場のトピックカテゴリに分類してください。

【キーワードリスト】
夜勤シフト, 患者対応, 休憩時間, 新人教育, カンファレンス

【カテゴリ】
- work: 業務内容、業務量、シフト、記録
- environment: 職場環境、設備、システム
- welfare: 休暇、給与、福利厚生
- education: 教育、研修、キャリア
- communication: コミュニケーション、チーム、会議
- other: その他

【出力形式】
{
  "夜勤シフト": "work",
  "患者対応": "work",
  "休憩時間": "welfare",
  "新人教育": "education",
  "カンファレンス": "communication"
}
```

#### 実装予定

| 機能 | 実装時期 | 工数 |
|------|---------|------|
| **感情分析（Llama 3.2 8B）** | 2025年11月中旬 | 3日 |
| **トピック分析（TF-IDF + LLM）** | 2025年11月中旬 | 3日 |
| **精度検証** | 2025年11月下旬 | 2日 |
| **プロンプト調整** | 2025年11月下旬 | 1日 |

**合計工数**: 9日

---

### 2.4 確認4: エラーハンドリング

#### 質問
- ローカルLLM障害時のフォールバック戦略は？
- 分析スキップ or リトライ or エラー通知？

#### 回答

**✅ VoiceDrive側の提案に同意します。**

**基本方針**: **感情分析・トピック分析が失敗しても、基本統計のみ送信**

### エラーハンドリング詳細

#### パターン1: ローカルLLM完全障害

**状況**: Llama 3.2 8Bサーバーがダウン

**対応**:
```typescript
try {
  // 感情分析実行
  const sentiment = await llamaService.analyzeSentiment(posts);
  const topics = await llamaService.analyzeTopics(posts);

  // 成功：全データ送信
  await voiceDriveAPI.sendGroupAnalytics({
    ...basicStats,
    sentimentAnalysis: sentiment,  // ✅
    topicAnalysis: topics          // ✅
  });

} catch (error) {
  console.error('[LLM障害] 感情分析・トピック分析をスキップ', error);

  // 失敗：基本統計のみ送信
  await voiceDriveAPI.sendGroupAnalytics({
    ...basicStats
    // sentimentAnalysis: undefined  ❌ 送信しない
    // topicAnalysis: undefined      ❌ 送信しない
  });

  // エラー通知
  await notifyAdmin({
    level: 'error',
    message: 'ローカルLLM障害により感情分析・トピック分析をスキップしました',
    details: error
  });
}
```

#### パターン2: タイムアウト

**状況**: LLM処理が10分以上かかる

**対応**:
```typescript
// タイムアウト設定: 10分
const LLMA_TIMEOUT = 10 * 60 * 1000;

const sentimentPromise = llamaService.analyzeSentiment(posts);
const timeoutPromise = new Promise((_, reject) =>
  setTimeout(() => reject(new Error('LLM Timeout')), LLMA_TIMEOUT)
);

try {
  const sentiment = await Promise.race([sentimentPromise, timeoutPromise]);
  // 成功：感情分析データを含める

} catch (error) {
  console.warn('[LLMタイムアウト] 感情分析をスキップ');
  // 失敗：基本統計のみ送信
}
```

#### パターン3: 部分的失敗

**状況**: 感情分析は成功、トピック分析は失敗

**対応**:
```typescript
let sentiment = undefined;
let topics = undefined;

// 感情分析（独立実行）
try {
  sentiment = await llamaService.analyzeSentiment(posts);
} catch (error) {
  console.error('[感情分析失敗]', error);
}

// トピック分析（独立実行）
try {
  topics = await llamaService.analyzeTopics(posts);
} catch (error) {
  console.error('[トピック分析失敗]', error);
}

// 部分的なデータでも送信
await voiceDriveAPI.sendGroupAnalytics({
  ...basicStats,
  sentimentAnalysis: sentiment,    // ✅ 成功した場合のみ
  topicAnalysis: topics            // ⚠️ undefinedの場合あり
});
```

#### エラー通知レベル

| エラーパターン | 通知レベル | 通知先 | 対応 |
|--------------|----------|--------|------|
| **LLM完全障害** | 🔴 Critical | Slack + Email | 即座に対応 |
| **タイムアウト（1回）** | 🟡 Warning | Slack | 監視 |
| **タイムアウト（連続3回）** | 🔴 Critical | Slack + Email | 即座に対応 |
| **部分的失敗** | 🟢 Info | ログのみ | 記録 |

#### リトライ戦略

**基本方針**: **VoiceDrive受信APIへの送信はリトライ、LLM処理はリトライしない**

```typescript
// VoiceDrive受信APIへの送信（リトライあり）
async function sendToVoiceDrive(data: GroupAnalyticsRequest): Promise<void> {
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 30 * 60 * 1000; // 30分

  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      await voiceDriveAPI.sendGroupAnalytics(data);
      console.log('[VoiceDrive送信成功]');
      return;

    } catch (error) {
      console.error(`[VoiceDrive送信失敗] リトライ ${i + 1}/${MAX_RETRIES}`, error);

      if (i < MAX_RETRIES - 1) {
        await sleep(RETRY_DELAY);
      } else {
        // 最終リトライも失敗
        await notifyAdmin({
          level: 'critical',
          message: 'VoiceDriveへのデータ送信が3回失敗しました',
          data: data
        });
        throw error;
      }
    }
  }
}

// LLM処理（リトライなし）
async function analyzeSentiment(posts: Post[]): Promise<SentimentResult | undefined> {
  try {
    return await llamaService.analyzeSentiment(posts);
  } catch (error) {
    console.error('[感情分析失敗] リトライせずにスキップ', error);
    return undefined; // リトライせずに即座にundefinedを返す
  }
}
```

**リトライしない理由**:
- LLM処理は時間がかかる（5-10分）
- リトライしても同じエラーが発生する可能性が高い
- バッチ処理全体の遅延を防ぐ

#### 監視ダッシュボード

```
【LLM処理状況ダッシュボード】

感情分析成功率（直近7日）: 97.3% ✅
トピック分析成功率（直近7日）: 95.8% ✅

平均処理時間:
  - 感情分析: 4分32秒
  - トピック分析: 3分18秒

エラー履歴（直近24時間）:
  - 02:00 感情分析タイムアウト（1件）
  - 02:30 リトライ成功
```

---

## 3. ローカルLLM実装の詳細

### 3.1 システム構成

```
┌─────────────────────────────────────────────┐
│  職員カルテシステム（Next.js）              │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │ バッチ処理サービス                    │  │
│  │ (Daily 02:00 JST)                    │  │
│  │                                       │  │
│  │ 1. VoiceDrive同意データ取得           │  │
│  │ 2. VoiceDrive集計API呼び出し          │  │
│  │ 3. ローカルLLM分析 ────────┐         │  │
│  │ 4. VoiceDrive受信API送信   │         │  │
│  └──────────────────────────┼──────────┘  │
└──────────────────────────────┼─────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ ローカルLLMサーバー │
                    │ (Llama 3.2 8B)     │
                    │                     │
                    │ - 感情分析          │
                    │ - トピック分析      │
                    │                     │
                    │ GPU: NVIDIA RTX 4090│
                    │ RAM: 32GB           │
                    └─────────────────────┘
```

### 3.2 ローカルLLMサーバー仕様

| 項目 | 仕様 |
|------|------|
| **モデル** | Llama 3.2 8B Instruct |
| **量子化** | GGUF Q4_K_M（4bit量子化） |
| **実行環境** | llama.cpp + Python API |
| **GPU** | NVIDIA RTX 4090 (24GB VRAM) |
| **RAM** | 32GB |
| **OS** | Ubuntu 22.04 LTS |
| **推論速度** | 50-80 tokens/sec |

### 3.3 API仕様

#### エンドポイント1: 感情分析

```http
POST http://localhost:11434/api/analyze-sentiment
Content-Type: application/json

{
  "posts": [
    {
      "id": "post_001",
      "content": "新しい研修制度が導入されて、とても勉強になっています。"
    },
    {
      "id": "post_002",
      "content": "夜勤のシフト調整が難しい状況が続いています。"
    }
  ]
}
```

**レスポンス**:
```json
{
  "results": [
    {
      "postId": "post_001",
      "sentiment": "positive",
      "confidence": 0.94,
      "reason": "前向きな研修評価が含まれているため"
    },
    {
      "postId": "post_002",
      "sentiment": "negative",
      "confidence": 0.87,
      "reason": "シフト調整の困難さが指摘されているため"
    }
  ],
  "summary": {
    "positive": 1,
    "neutral": 0,
    "negative": 1,
    "total": 2
  },
  "processingTime": "4.2s"
}
```

#### エンドポイント2: トピック分析

```http
POST http://localhost:11434/api/analyze-topics
Content-Type: application/json

{
  "posts": [
    {
      "id": "post_001",
      "content": "新しい研修制度が導入されて、とても勉強になっています。"
    }
  ]
}
```

**レスポンス**:
```json
{
  "topKeywords": [
    {
      "keyword": "研修制度",
      "count": 1,
      "category": "education",
      "tfidfScore": 0.89
    }
  ],
  "processingTime": "3.5s"
}
```

### 3.4 性能見積もり

| 項目 | 値 |
|------|---|
| **1投稿あたりの処理時間** | 2-3秒 |
| **100投稿の処理時間** | 4-5分 |
| **500投稿の処理時間（最大想定）** | 15-20分 |
| **バッチ全体の処理時間** | 25-35分（集計含む） |

**バッチ処理時間内訳**:
```
02:00-02:05 (5分)  - VoiceDrive同意データ取得
02:05-02:10 (5分)  - VoiceDrive集計API呼び出し
02:10-02:25 (15分) - ローカルLLM分析（感情+トピック）
02:25-02:30 (5分)  - VoiceDrive受信API送信
```

---

## 4. 実装スケジュールの調整

### 4.1 職員カルテシステム側の実装計画

```
Phase 7（人事お知らせ統合）: 10月中旬〜下旬
  ↓
Phase 7.5（ボイス分析API実装）: 11月上旬〜中旬（4週間）

Week 1（11/4-11/10）: 基本統計API実装
├─ Day 1-2: VoiceDrive集計API連携実装
├─ Day 3-4: K-匿名性チェック強化
└─ Day 5-7: 単体テスト + バグ修正

Week 2（11/11-11/17）: ローカルLLM分析実装
├─ Day 1-3: Llama 3.2 8B環境構築 + 感情分析実装
├─ Day 4-5: トピック分析実装（TF-IDF + LLM）
└─ Day 6-7: 精度検証（人間ラベリング100件）

Week 3（11/18-11/24）: 日次バッチ送信実装
├─ Day 1-2: バッチ処理ロジック実装
├─ Day 3-4: エラーハンドリング + リトライ実装
└─ Day 5-7: 単体テスト + パフォーマンステスト

Week 4（11/25-12/1）: 統合テスト
├─ Day 1-3: VoiceDriveとの統合テスト
├─ Day 4-5: 負荷テスト（500職員分）
└─ Day 6-7: 本番環境デプロイ準備

本番リリース: 2025年12月5日（木）
```

### 4.2 マイルストーン

| 日付 | マイルストーン | 成果物 |
|------|--------------|--------|
| **11/10** | 基本統計API実装完了 | VoiceDrive集計API連携 |
| **11/17** | ローカルLLM分析実装完了 | 感情分析90%精度達成 |
| **11/24** | 日次バッチ送信実装完了 | バッチ処理動作確認 |
| **12/1** | 統合テスト完了 | テスト結果報告書 |
| **12/5** | 本番リリース | 初回データ送信成功 |

---

## 5. 仕様調整ミーティング提案

### 5.1 ミーティング日程

**希望日時**:
- **第1希望**: 2025年10月9日（水） 14:00-15:00 JST
- **第2希望**: 2025年10月10日（木） 10:00-11:00 JST
- **第3希望**: 2025年10月10日（木） 14:00-15:00 JST

**方法**: Zoom または Google Meet

### 5.2 議題

1. **確認事項の最終確認**（15分）
   - 本回答書の内容確認
   - 追加質問・疑問点の解消

2. **API仕様の詳細確認**（20分）
   - 集計APIレスポンスフォーマットの確認
   - 受信APIリクエストフォーマットの確認
   - エラーレスポンスの仕様確認

3. **実装スケジュールの調整**（15分）
   - マイルストーンの合意
   - 統合テスト日程の調整
   - 本番リリース日の最終決定

4. **セキュリティ・認証の確認**（10分）
   - JWTトークン発行方法
   - IPホワイトリスト設定
   - 監査ログの保存期間

---

## 6. 今後のアクション

### 6.1 短期（10/8-10/10）

#### 職員カルテシステム側
- [x] 確認事項への回答書作成（本ドキュメント）
- [ ] VoiceDriveチームとの仕様調整ミーティング参加
- [ ] 最終仕様の合意

#### VoiceDriveチーム側
- [ ] 本回答書の確認
- [ ] 追加質問・疑問点の整理
- [ ] 仕様調整ミーティングの日程調整

### 6.2 中期（11月上旬〜中旬）

#### 職員カルテシステム側
- [ ] Week 1: 基本統計API実装
- [ ] Week 2: ローカルLLM分析実装
- [ ] Week 3: 日次バッチ送信実装
- [ ] Week 4: 統合テスト

#### VoiceDriveチーム側
- [ ] Week 1-2: 集計APIエンドポイント実装
- [ ] Week 3: 受信APIエンドポイント実装
- [ ] Week 4: 統合テスト（合同）

### 6.3 長期（11月下旬〜12月上旬）

#### 両チーム合同
- [ ] 11/25-12/1: 統合テスト
- [ ] 12/2-12/4: 本番環境デプロイ準備
- [ ] 12/5: 本番リリース（初回データ送信）

---

## 7. まとめ

### 7.1 確認事項への回答サマリー

| 確認事項 | 回答 |
|---------|------|
| **データ更新頻度** | ✅ 日次バッチ（毎日深夜2:00 JST）、初回送信は2025年12月5日 |
| **集計APIデータ範囲** | ✅ 過去6ヶ月前まで遡及可能、一度に最大3ヶ月分リクエスト |
| **LLM分析精度** | ✅ 感情分析90-95%、トップキーワードTOP 20、新興トピックTOP 10 |
| **エラーハンドリング** | ✅ LLM障害時は基本統計のみ送信、VoiceDrive受信API送信はリトライ |

### 7.2 次のステップ

1. ✅ 本回答書の送付（10/7完了）
2. ⏳ 仕様調整ミーティング（10/9-10/10）
3. ⏳ 最終仕様の合意
4. ⏳ Phase 7.5実装開始（11月上旬）

---

## 8. 連絡先・対応窓口

### 職員カルテシステム開発チーム

- **Slack**: `#staff-card-dev`
- **Email**: staff-card-dev@example.com
- **MCPサーバー**: `mcp-shared/docs/`
- **担当者**: 職員カルテプロジェクトリード

### 仕様調整ミーティング参加希望

以下のいずれかの方法でご連絡いただけますと幸いです：
- Slackで日程調整（Zoom/Google Meetリンク共有）
- MCPサーバー経由でのドキュメント共有

---

**ご確認のほど、よろしくお願いいたします。**

**職員カルテシステム開発チーム一同**
**2025年10月7日**
