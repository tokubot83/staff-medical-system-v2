# 医療職員管理システム・VoiceDrive統合MCPサーバー構築計画

**作成日**: 2025年8月10日  
**目的**: 両チームの開発効率を最大化するMCPサーバーの構築

---

## 🏗️ MCPサーバーアーキテクチャ

```
┌─────────────────────────────────────────────┐
│            MCP統合サーバー                    │
│         (http://localhost:8080)              │
├─────────────────────────────────────────────┤
│  ┌─────────────┐        ┌─────────────┐    │
│  │ 医療システム │        │ VoiceDrive  │    │
│  │   Adapter   │        │   Adapter   │    │
│  └──────┬──────┘        └──────┬──────┘    │
│         │                       │            │
│  ┌──────┴───────────────────────┴──────┐    │
│  │        共通サービス層                │    │
│  │  - API Gateway                      │    │
│  │  - 型定義同期                       │    │
│  │  - テストランナー                   │    │
│  │  - ログ集約                         │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

## 📦 MCPサーバーの機能

### 1. 開発環境統合
```typescript
// mcp.config.ts
export const config = {
  projects: {
    medical: {
      path: './staff-medical-system',
      port: 3000,
      apiPrefix: '/api/medical'
    },
    voicedrive: {
      path: './voicedrive-v100',
      port: 5173,
      apiPrefix: '/api/voicedrive'
    }
  },
  integration: {
    port: 8080,
    cors: true,
    logging: true
  }
};
```

### 2. 自動化機能

#### A. 型定義の自動同期
```typescript
// 両チームの型定義を自動マージ
mcp.types.sync({
  source: ['medical/types', 'voicedrive/types'],
  output: 'shared/types',
  watch: true
});
```

#### B. 統合テストの自動実行
```typescript
// 変更検知時に統合テスト実行
mcp.test.watch({
  trigger: ['medical/**/*.tsx', 'voicedrive/**/*.ts'],
  tests: ['integration/*.test.ts'],
  notification: 'slack'
});
```

#### C. APIモックの共有
```typescript
// 共通モックサーバー
mcp.mock.server({
  port: 3001,
  data: 'shared/mocks',
  delay: 100
});
```

### 3. リアルタイム連携

#### A. ログの統合表示
```typescript
// 両システムのログを統合表示
mcp.logs.aggregate({
  sources: ['medical', 'voicedrive'],
  format: 'json',
  output: 'combined.log'
});
```

#### B. メトリクス監視
```typescript
// パフォーマンスメトリクス
mcp.metrics.monitor({
  responseTime: true,
  errorRate: true,
  throughput: true
});
```

## 🚀 セットアップ手順

### Step 1: MCPサーバーのインストール
```bash
# MCPサーバー用ディレクトリ作成
mkdir mcp-integration-server
cd mcp-integration-server

# 必要なパッケージインストール
npm init -y
npm install @anthropic/mcp-server express cors
npm install -D typescript @types/node
```

### Step 2: 設定ファイルの作成
```bash
# MCPサーバー設定
touch mcp.config.ts
touch tsconfig.json
```

### Step 3: 両プロジェクトの接続
```bash
# シンボリックリンク作成
ln -s ../staff-medical-system ./medical
ln -s ../voicedrive-v100 ./voicedrive
```

### Step 4: 起動スクリプト
```json
// package.json
{
  "scripts": {
    "start": "node dist/server.js",
    "dev": "nodemon src/server.ts",
    "test:integration": "jest --config=jest.integration.config.js",
    "sync:types": "node scripts/sync-types.js"
  }
}
```

## 📊 期待される効果

| 課題 | MCPサーバーによる解決 | 効率向上 |
|------|---------------------|----------|
| API仕様の不一致 | 自動検証・同期 | 80% |
| テスト実行の手間 | 自動統合テスト | 70% |
| デバッグの困難さ | 統合ログ表示 | 60% |
| 型定義の重複 | 自動マージ | 90% |
| 環境構築の複雑さ | ワンコマンド起動 | 85% |

## 🔧 実装優先順位

### Phase 1（即座に実装）
1. ✅ 基本的なプロキシサーバー
2. ✅ CORS設定の統一
3. ✅ ログの統合表示

### Phase 2（Week 2中に実装）
1. ⬜ 型定義の自動同期
2. ⬜ 統合テストランナー
3. ⬜ APIモックサーバー

### Phase 3（将来的な拡張）
1. ⬜ メトリクス監視
2. ⬜ CI/CD統合
3. ⬜ デプロイ自動化

## 💻 実装コード例

```typescript
// src/server.ts
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';

const app = express();

// CORS設定
app.use(cors());

// 医療システムへのプロキシ
app.use('/api/medical', createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true
}));

// VoiceDriveへのプロキシ
app.use('/api/voicedrive', createProxyMiddleware({
  target: 'http://localhost:5173',
  changeOrigin: true
}));

// 統合ダッシュボード
app.get('/dashboard', (req, res) => {
  res.send('MCP Integration Dashboard');
});

app.listen(8080, () => {
  console.log('MCP Server running on http://localhost:8080');
});
```

## 🎯 推奨事項

1. **今すぐ実装すべき機能**
   - プロキシサーバー（両システムを1つのポートで統合）
   - ログ集約（デバッグ効率化）
   - 共通型定義（TypeScript型の一元管理）

2. **8/12のキックオフで相談すべき事項**
   - MCPサーバーの運用ルール
   - アクセス権限の設定
   - モニタリング方法

3. **長期的な活用方針**
   - Phase 3でのAI機能統合基盤
   - マイクロサービス化への移行パス
   - 他システムとの連携拡張

---

**結論**: MCPサーバーの構築により、両チームの開発効率が大幅に向上し、Phase 2の統合作業がスムーズに進行します。特に、型定義の同期とAPIプロキシ機能は即座に効果を発揮するでしょう。