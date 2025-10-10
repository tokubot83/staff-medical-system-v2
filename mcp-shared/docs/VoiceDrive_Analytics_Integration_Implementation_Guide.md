# VoiceDrive Analytics Integration 実装ガイド

**作成日**: 2025年10月9日
**作成者**: 職員カルテシステム開発チーム
**ステータス**: Phase 1実装完了（基本インフラ）

---

## 📋 目次

1. [実装完了項目](#実装完了項目)
2. [ファイル構成](#ファイル構成)
3. [環境設定](#環境設定)
4. [VoiceDriveAnalyticsClient使用方法](#voicedriveanalyticsclient使用方法)
5. [統合テスト実行方法](#統合テスト実行方法)
6. [次のステップ](#次のステップ)
7. [トラブルシューティング](#トラブルシューティング)

---

## 実装完了項目

### ✅ Phase 1: 基本インフラ構築（2025年10月9日完了）

| 項目 | ファイル | 説明 |
|------|---------|------|
| **環境設定ファイル** | `.env.voicedrive.test` | JWT、HMAC Secret、API URL等の認証情報 |
| **TypeScript型定義** | `mcp-shared/interfaces/voicedrive-analytics-api.interface.ts` | VoiceDrive Analytics API の型定義 |
| **APIクライアント** | `src/services/VoiceDriveAnalyticsClient.ts` | GET/POST リクエスト、認証、リトライ処理 |
| **統合テスト** | `tests/voicedrive-analytics-integration-test.ts` | 接続確認、API呼び出しテスト |
| **npm script** | `package.json` | `npm run test:voicedrive-analytics` |

### ⏳ Phase 2: 基本統計API実装（予定: 11月4日〜11月10日）

- VoiceDrive集計API連携実装
- K-匿名性チェック強化
- 基本統計データ生成

### ⏳ Phase 3: ローカルLLM分析実装（予定: 11月11日〜11月17日）

- Llama 3.2 8B環境構築
- 感情分析実装
- トピック分析実装

### ⏳ Phase 4: 日次バッチ送信実装（予定: 11月18日〜11月24日）

- バッチ処理ロジック実装
- エラーハンドリング
- 監視ダッシュボード

---

## ファイル構成

```
staff-medical-system/
├── .env.voicedrive.test           # 認証情報（開発/テスト環境）
│
├── mcp-shared/
│   └── interfaces/
│       └── voicedrive-analytics-api.interface.ts  # TypeScript型定義
│
├── src/
│   └── services/
│       ├── VoiceDriveAnalyticsClient.ts          # APIクライアント
│       ├── VoiceDriveAnalyticsService.ts         # K-匿名性チェック
│       └── VoiceDriveDataService.ts              # 同意データ取得
│
├── tests/
│   └── voicedrive-analytics-integration-test.ts  # 統合テスト
│
└── mcp-shared/docs/
    ├── Meeting_Minutes_20251009.md               # 仕様調整ミーティング議事録
    ├── Response_To_VoiceDrive_Confirmation_Items_20251007.md
    └── VoiceDrive_Analytics_Integration_Implementation_Guide.md (本ドキュメント)
```

---

## 環境設定

### 1. `.env.voicedrive.test` の確認

以下の環境変数が正しく設定されていることを確認してください：

```bash
# VoiceDrive API エンドポイント
VOICEDRIVE_ANALYTICS_API_URL="http://localhost:4000"
VOICEDRIVE_ANALYTICS_API_BASE_PATH="/api/v1/analytics"

# JWT認証トークン（VoiceDrive側から提供）
VOICEDRIVE_JWT_TOKEN="vd_test_20251009_xxxxxxxxxxxxx"

# HMAC共有シークレット（両チーム合意）
VOICEDRIVE_HMAC_SECRET="test_voicedrive_analytics_secret_2025"

# その他の設定...
```

### 2. VoiceDriveサーバーの起動

統合テストを実行する前に、VoiceDriveサーバーを起動してください：

```bash
# VoiceDriveプロジェクトディレクトリに移動
cd ../voicedrive-v100

# サーバー起動
npm run dev

# 起動確認（別ターミナル）
curl http://localhost:4000/api/health
```

---

## VoiceDriveAnalyticsClient使用方法

### 基本的な使い方

```typescript
import { VoiceDriveAnalyticsClient } from './src/services/VoiceDriveAnalyticsClient';

// クライアント初期化
const client = new VoiceDriveAnalyticsClient({
  debug: true,  // デバッグログ有効化
});

// 1. 集計データ取得
const getResult = await client.getAggregatedStats({
  startDate: '2025-10-01',
  endDate: '2025-10-07',
});

if (getResult.success) {
  console.log('投稿数:', getResult.data?.data?.postingTrends.totalPosts);
  console.log('参加率:', getResult.data?.data?.postingTrends.participationRate);
}

// 2. グループ分析データ送信
const postResult = await client.sendGroupAnalytics({
  analysisDate: '2025-10-09',
  period: {
    startDate: '2025-10-01',
    endDate: '2025-10-07',
  },
  postingTrends: {
    totalPosts: 120,
    totalUsers: 50,
    totalEligibleUsers: 45,
    participationRate: 90.0,
  },
  privacyMetadata: {
    totalConsentedUsers: 45,
    minimumGroupSize: 5,
    kAnonymityCompliant: true,
  },
  metadata: {
    sourceSystem: 'medical-staff-system',
    version: '1.0.0',
    generatedBy: 'batch-process',
    generatedAt: new Date().toISOString(),
    processingTime: 25.5,
  },
});

if (postResult.success) {
  console.log('送信成功:', postResult.data?.data?.id);
}
```

### エラーハンドリング

```typescript
const result = await client.getAggregatedStats({
  startDate: '2025-01-01',
  endDate: '2025-10-09',  // 9ヶ月間（エラー: 3ヶ月まで）
});

if (!result.success) {
  console.error('エラーコード:', result.error?.code);
  console.error('エラーメッセージ:', result.error?.message);

  switch (result.error?.code) {
    case 'DATE_RANGE_TOO_LONG':
      console.error('期間が3ヶ月を超えています');
      break;
    case 'RATE_LIMIT_EXCEEDED':
      console.error('レート制限超過、しばらく待ってから再試行してください');
      break;
    case 'UNAUTHORIZED':
      console.error('JWT認証に失敗しました');
      break;
  }
}
```

### リトライ処理

`sendGroupAnalytics()` は自動的に3回までリトライします：

```typescript
// デフォルト: 3回リトライ、30分間隔
const client = new VoiceDriveAnalyticsClient({
  retryCount: 3,
  retryInterval: 30 * 60 * 1000,  // 30分
});

const result = await client.sendGroupAnalytics(data);
// 失敗時は自動的に30分後、1時間後にリトライ
```

### ヘルスチェック

```typescript
const isHealthy = await client.healthCheck();

if (isHealthy) {
  console.log('✅ VoiceDriveサーバーに接続OK');
} else {
  console.error('❌ VoiceDriveサーバーに接続できません');
}
```

---

## 統合テスト実行方法

### 1. 前提条件

- [x] `.env.voicedrive.test` が設定されている
- [x] VoiceDriveサーバーが起動している（http://localhost:4000）
- [x] `npm install` 実行済み

### 2. テスト実行

```bash
# 統合テスト実行
npm run test:voicedrive-analytics
```

### 3. 期待される結果

```
🚀 VoiceDrive Analytics API 統合テスト開始

⏰ 実行日時: 2025-10-09T05:00:00.000Z

============================================================
📋 Test 1: 環境設定確認
============================================================
API URL: http://localhost:4000
JWT Token: vd_test_20251009_xx...
HMAC Secret: test_voice...
✅ VOICEDRIVE_ANALYTICS_API_URL が設定されている
✅ VOICEDRIVE_JWT_TOKEN が設定されている
✅ VOICEDRIVE_HMAC_SECRET が設定されている

============================================================
📋 Test 2: VoiceDriveAnalyticsClient 初期化
============================================================
✅ API URL が正しく設定されている
✅ JWT Token が正しく設定されている
✅ HMAC Secret が正しく設定されている

============================================================
📋 Test 3: ヘルスチェック
============================================================
VoiceDriveサーバーへの接続を確認中...
✅ VoiceDriveサーバーに接続成功
✅ ヘルスチェック成功

...

============================================================
📊 テスト結果サマリー
============================================================
総テスト数: 15
✅ 成功: 15
❌ 失敗: 0
📈 成功率: 100.0%
============================================================

🎉 全てのテストが成功しました！
```

### 4. トラブルシューティング

#### ❌ ヘルスチェック失敗

```
⚠️  VoiceDriveサーバーに接続できません
   VoiceDriveサーバーが起動していることを確認してください
   起動方法: cd ../voicedrive-v100 && npm run dev
```

**解決方法**:
1. VoiceDriveサーバーが起動しているか確認
2. `http://localhost:4000/api/health` にアクセスできるか確認
3. ファイアウォール設定を確認

#### ❌ JWT認証失敗

```
❌ GET リクエスト成功
エラーコード: UNAUTHORIZED
```

**解決方法**:
1. `.env.voicedrive.test` の `VOICEDRIVE_JWT_TOKEN` を確認
2. VoiceDrive側でトークンが正しく設定されているか確認
3. トークンの有効期限を確認（2026年12月31日まで有効）

---

## 次のステップ

### 短期（10月10日〜10月15日）

#### ✅ 完了項目
- [x] 認証情報設定（`.env.voicedrive.test`）
- [x] VoiceDriveAnalyticsClient実装
- [x] 統合テストスクリプト作成

#### ⏳ 次のタスク
- [ ] VoiceDriveサーバーとの接続確認（実環境）
- [ ] IPホワイトリスト設定（VoiceDrive側）
- [ ] CORS設定確認（VoiceDrive側）

### 中期（10月16日〜11月3日）

#### Week 1（11/4-11/10）: 基本統計API実装

**実装内容**:
1. VoiceDrive集計API連携
   - `getAggregatedStats()` を使用してデータ取得
   - 投稿トレンド、部門別統計の集計

2. K-匿名性チェック強化
   - 既存の `VoiceDriveAnalyticsService` を拡張
   - 部門別のK-匿名性チェック

3. 基本統計データ生成
   - `GroupAnalyticsRequest` の生成ロジック
   - データ送信処理

**実装ファイル（予定）**:
```
src/services/
├── VoiceDriveAnalyticsOrchestrator.ts  # 新規: オーケストレーション
└── VoiceDriveStatisticsGenerator.ts    # 新規: 統計データ生成
```

**テストコマンド**:
```bash
# 基本統計API単体テスト
npm run test -- VoiceDriveStatisticsGenerator

# 統合テスト
npm run test:voicedrive-analytics
```

#### Week 2（11/11-11/17）: ローカルLLM分析実装

**実装内容**:
1. Llama 3.2 8B環境構築
   - llama.cpp インストール
   - モデルダウンロード（GGUF Q4_K_M）
   - Python API サーバー構築

2. 感情分析実装
   - プロンプトエンジニアリング
   - バッチ処理（100投稿/回）
   - 精度検証（目標: 90-95%）

3. トピック分析実装
   - TF-IDF計算
   - LLMによるキーワード分類
   - 新興トピック検出

**実装ファイル（予定）**:
```
src/services/
├── LlamaLLMService.ts            # 新規: Llama 3.2 8B連携
├── SentimentAnalysisService.ts   # 新規: 感情分析
└── TopicAnalysisService.ts       # 新規: トピック分析
```

#### Week 3（11/18-11/24）: 日次バッチ送信実装

**実装内容**:
1. バッチ処理ロジック
   - 日次実行（深夜2:00 JST）
   - 前日分データの集計・分析・送信

2. エラーハンドリング
   - LLM障害時のフォールバック
   - VoiceDrive API送信失敗時のリトライ

3. 監視・通知
   - Slack通知
   - エラーログ記録

**実装ファイル（予定）**:
```
src/batch/
└── voicedrive-analytics-batch.ts  # 新規: 日次バッチ処理
```

**スケジュール設定**:
```bash
# cron設定（Linux/Mac）
0 2 * * * cd /path/to/staff-medical-system && npm run batch:voicedrive-analytics

# package.json にスクリプト追加
"batch:voicedrive-analytics": "npx tsx src/batch/voicedrive-analytics-batch.ts"
```

#### Week 4（11/25-12/1）: 統合テスト

**テスト内容**:
1. 基本統計のみ送信テスト
2. LLM分析付き送信テスト
3. 負荷テスト（500職員分）
4. エラーシナリオテスト

### 長期（12月2日〜12月5日）

#### 12/2-12/4: テストデータ送信

```
12/2（月）02:00 - Week 1 of Nov（基本統計のみ）
12/3（火）02:00 - Week 2 of Nov（基本統計+感情分析）
12/4（水）02:00 - Week 3 of Nov（完全データ）
```

#### 12/5（木）02:00: 本番リリース

```
🚀 初回本番データ送信
期間: 2025年10月1日〜11月30日（2ヶ月分）
内容: 完全データ（基本統計 + 感情分析 + トピック分析）
```

---

## トラブルシューティング

### Q1: `npm run test:voicedrive-analytics` が失敗する

**A1**: 以下を確認してください：

1. VoiceDriveサーバーが起動しているか
   ```bash
   curl http://localhost:4000/api/health
   ```

2. `.env.voicedrive.test` が存在するか
   ```bash
   ls -la .env.voicedrive.test
   ```

3. 環境変数が正しく読み込まれているか
   ```bash
   cat .env.voicedrive.test | grep VOICEDRIVE_JWT_TOKEN
   ```

### Q2: JWT認証エラー（401 Unauthorized）

**A2**: 以下を確認してください：

1. `.env.voicedrive.test` の `VOICEDRIVE_JWT_TOKEN` が正しいか
2. VoiceDrive側で同じトークンが設定されているか
3. トークンの有効期限が切れていないか

### Q3: HMAC署名検証エラー（403 Invalid Signature）

**A3**: 以下を確認してください：

1. `.env.voicedrive.test` の `VOICEDRIVE_HMAC_SECRET` が正しいか
2. VoiceDrive側で同じシークレットが設定されているか
3. タイムスタンプのズレがないか（サーバー時刻同期）

### Q4: レート制限エラー（429 Rate Limit Exceeded）

**A4**: 以下を確認してください：

1. 開発環境の異常検知設定が緩和されているか
   - 警告: 500リクエスト/時間（通常: 200）
   - 自動ブロック: 1000リクエスト/時間（通常: 400）

2. しばらく待ってから再試行してください

### Q5: タイムアウトエラー

**A5**: 以下を試してください：

1. タイムアウト値を増やす
   ```typescript
   const client = new VoiceDriveAnalyticsClient({
     timeout: 60000,  // 60秒
   });
   ```

2. VoiceDriveサーバーの負荷状況を確認

---

## 参考ドキュメント

- [仕様調整ミーティング議事録](./Meeting_Minutes_20251009.md)
- [VoiceDrive確認事項への回答書](./Response_To_VoiceDrive_Confirmation_Items_20251007.md)
- [VoiceDriveボイス分析API問い合わせへの回答書](./Reply_To_VoiceDrive_Voice_Analytics_API_Inquiry_20251007.md)

---

## 連絡先

### 職員カルテシステム開発チーム
- **Slack**: `#staff-card-dev`
- **Email**: staff-card-dev@example.com
- **MCPサーバー**: `mcp-shared/docs/`

### VoiceDrive開発チーム
- **Slack**: `#voicedrive-analytics-integration`（新規作成）
- **Email**: voicedrive-dev@example.com

---

**最終更新**: 2025年10月9日
**次回更新予定**: 2025年11月10日（Week 1実装完了後）
