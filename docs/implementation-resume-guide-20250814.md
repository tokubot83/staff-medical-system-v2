# 実装再開指示書 - 2025年8月14日版

## 📅 作成日: 2025-08-14
## 👤 対象: Claude Code Assistant
## 📍 作業ディレクトリ: C:\projects\staff-medical-system

---

## 🎯 本日の完了事項サマリー

### 1. 評価シート修復作業 ✅
- **問題**: 再起動により老健評価シート（17個）がcomponentsディレクトリに誤配置
- **解決**: `src/components/evaluation-sheets/v4/roken-*` → `src/app/evaluation-sheets/v4/roken-*/page.tsx`へ移動
- **修正ファイル数**: 17個の新規page.tsxファイル作成
- **コミット**: `e2662a3` - "fix: 再起動で失われた老健評価シートを復元し、パスエラーを修正"

### 2. 法人SNSシステム連携ドキュメント作成 ✅
- **ファイル**: `docs/sns-integration-progress.md`
- **内容**: VoiceDriveとの連携開発進捗状況まとめ

### 3. Git作業 ✅
- **ブランチ**: preview/feature-name → main
- **状態**: 両ブランチともリモートにpush済み
- **デプロイ**: Vercel自動デプロイ開始

---

## 🚨 重要: 作業開始時の必須確認事項

### 1. MCPサーバー共有ファイル確認
```bash
# 必ず最初に実行
cat mcp-shared/docs/AI_SUMMARY.md
ls -la mcp-shared/docs/ | head -10
cat mcp-shared/sync-status.json | grep lastSync
```

### 2. 現在のブランチ状態確認
```bash
git status
git branch -vv
git log --oneline -n 5
```

### 3. 評価シート・面談シート実装状況
- **評価シート**: 102個実装済み（v4のみ）
- **面談シート**: 68個実装済み（v5のみ）
- **注意**: componentsディレクトリのファイルは統合版のため削除不要

---

## 📋 次回実装予定タスク（優先順位順）

### 優先度: 高 🔴

#### 1. データマイグレーションツール
**理由**: LocalStorageからDBへの移行が最優先
**実装場所**: `src/lib/migration/`
**必要ファイル**:
- `MigrationManager.ts` - 移行管理クラス
- `MigrationVersion.ts` - バージョン管理
- `MigrationRollback.ts` - ロールバック機能

**実装手順**:
1. 移行スキーマ定義
2. データ検証機能
3. 進捗表示UI
4. ロールバック機能
5. テスト実装

#### 2. APIモックサーバー
**理由**: バックエンド開発前のフロントエンド開発継続のため
**実装場所**: `src/mocks/`
**必要ファイル**:
- `mockServer.ts` - モックサーバー本体
- `handlers/` - 各エンドポイントハンドラー
- `fixtures/` - テストデータ

**実装手順**:
1. MSW (Mock Service Worker) のセットアップ
2. エンドポイント定義（CRUD操作）
3. 遅延・エラーシミュレーション
4. 開発環境での自動起動設定

### 優先度: 中 🟡

#### 3. データバリデーション強化
**実装場所**: `src/lib/validation/`
**技術選定**: Zod（TypeScript親和性が高い）
**必要スキーマ**:
- 職員データスキーマ
- 面談データスキーマ
- 評価データスキーマ

#### 4. トランザクション管理
**実装場所**: `src/lib/transaction/`
**機能**:
- Sagaパターン実装
- ロールバック機能
- 並行制御

#### 5. 監査ログシステム
**実装場所**: `src/lib/audit/`
**記録項目**:
- ユーザーID
- 操作内容
- タイムスタンプ
- 変更前後データ

### 優先度: 低 🟢

#### 6. キャッシュ戦略
**実装場所**: `src/lib/cache/`
**階層**:
1. メモリキャッシュ（既存）
2. IndexedDB（オフライン対応）
3. Redis準備（将来）

#### 7. WebSocket/SSE
**実装場所**: `src/lib/realtime/`
**用途**:
- 面談予約のリアルタイム更新
- 通知システム

---

## 🛠️ 実装時の注意事項

### 1. 既存コードとの整合性
- **必須**: 既存のStorageAdapterパターンを踏襲
- **参考**: `src/lib/storage/StorageAdapter.ts`
- **型定義**: 既存のインターフェースを拡張

### 2. エラーハンドリング
- **使用**: `src/lib/error/AppError.ts`
- **言語**: 日本語エラーメッセージ必須
- **ログ**: 自動ログ記録機能を活用

### 3. テスト
- **カバレッジ**: 80%以上目標
- **種類**: ユニットテスト + 統合テスト
- **ツール**: Jest + React Testing Library

### 4. ドキュメント
- **場所**: 各機能のREADME.mdを作成
- **内容**: 使用方法、API仕様、設定項目

---

## 📂 ファイル構造（推奨）

```
src/
├── lib/
│   ├── migration/          # 新規: データ移行
│   │   ├── MigrationManager.ts
│   │   ├── MigrationVersion.ts
│   │   └── migrations/
│   │       ├── v1_initial.ts
│   │       └── v2_add_fields.ts
│   ├── validation/         # 新規: バリデーション
│   │   ├── schemas/
│   │   └── validators/
│   └── transaction/        # 新規: トランザクション
│       ├── TransactionManager.ts
│       └── Saga.ts
├── mocks/                  # 新規: APIモック
│   ├── browser.ts
│   ├── handlers/
│   └── fixtures/
└── services/
    └── api/               # 新規: API層準備
        ├── client.ts
        └── endpoints/
```

---

## 🔍 デバッグ情報

### 現在の問題点
1. 慢性期看護補助者のパスが一部不完全（junior, midlevel等）
2. 老健看護師の主任が未実装（chief-nurse）
3. componentsディレクトリに統合版ファイルが混在

### 環境情報
- **OS**: Windows (win32)
- **Node**: 確認必要
- **ブランチ**: main / preview/feature-name
- **最終コミット**: e2662a3

---

## 📝 開発メモ

### VoiceDrive連携状況
- **Phase 1**: ✅ 完了（フロントエンド開発）
- **Phase 2**: 🔄 準備中（バックエンド統合）
- **共有インターフェース**: `mcp-shared/interfaces/interview.interface.ts`
- **面談予約API**: 設計済み、実装待ち

### パフォーマンス考慮
- キャッシュTTL: 5分（現在）
- localStorage制限: 5-10MB
- IndexedDB: 無制限（実質）

### セキュリティ
- APIキー: 環境変数管理必須
- 個人情報: マスキング実装済み
- HTTPS: 本番環境必須

---

## ✅ チェックリスト（作業開始時）

- [ ] MCPサーバー共有ファイル確認
- [ ] Git状態確認
- [ ] 依存パッケージ更新確認（`npm outdated`）
- [ ] TypeScriptビルド確認（`npm run build`）
- [ ] テスト実行（`npm test`）
- [ ] Vercelデプロイ状態確認

---

## 🚀 即座に開始できるコマンド

```bash
# 1. プロジェクトディレクトリへ移動
cd C:\projects\staff-medical-system

# 2. 最新状態を取得
git pull origin main

# 3. 依存関係インストール
npm install

# 4. 開発サーバー起動
npm run dev

# 5. 別ターミナルでTypeScript監視
npm run type-check:watch
```

---

## 📞 関連リソース

- **本番URL**: https://staff-medical-system-v2.vercel.app
- **GitHub**: https://github.com/tokubot83/staff-medical-system-v2
- **マスターデータ管理**: /admin/master-data
- **評価シートv4**: /evaluation-sheets/v4
- **面談シートv5**: /interview-sheets/v5

---

## 🎯 本日の成果

1. **修復作業**: 評価シート17個の復元完了
2. **ドキュメント**: SNS連携進捗報告書作成
3. **品質向上**: パスエラー修正、実装状況更新

---

**次回作業開始時は、このドキュメントを最初に確認してください。**

作成者: Claude Code Assistant
最終更新: 2025-08-14 23:30