# アクセス制御システム セットアップガイド

**作成日**: 2025年10月6日
**対象**: システム管理者（Level 99）
**バージョン**: Phase 1 実装

---

## 概要

このガイドでは、タブ・ページ・機能の権限管理をマスターデータベースで動的に管理するアクセス制御システムのセットアップ方法を説明します。

### 主な機能

✅ **タブ単位の権限管理** - 17タブの閲覧権限をLevel 14-99で制御
✅ **動的設定変更** - コード変更不要で権限を調整
✅ **変更履歴記録** - 全ての権限変更を監査ログとして記録
✅ **モックモード** - DB構築前でも動作（開発・テスト用）
✅ **VSCode経由アクセス** - Claude Code/API経由で設定変更可能

---

## Phase 1: モックモードでの動作確認（DB構築前）

共通データベース構築前でもシステムをテスト可能です。

### 1. 環境変数の設定

`.env` ファイルに以下を追加：

```bash
# モックモードを有効化（DB構築前）
USE_MOCK_ACCESS_CONTROL="true"

# API Key生成（システム管理者用）
SYSTEM_ADMIN_API_KEY="your-random-api-key-here"
```

**API Keyの生成方法**:

```bash
# Linuxの場合
openssl rand -hex 32

# Windowsの場合
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. アプリケーションの起動

```bash
npm run dev
```

### 3. モックモードでの動作確認

#### 方法1: ブラウザでアクセス

```
http://localhost:3000/admin/access-control
```

（Level 99でログイン後）

#### 方法2: CLI経由でアクセス（推奨）

```bash
# 環境変数を設定
export SYSTEM_ADMIN_API_KEY="your-api-key-here"

# 全タブ設定を表示
node scripts/access-control-cli.js list tab

# 特定タブの設定を表示
node scripts/access-control-cli.js get evaluation-history

# 設定を変更（モックモード - メモリ内のみ）
node scripts/access-control-cli.js update evaluation \
  --minLevel=14 \
  --reason="Level 14の人数が増加したため、評価タブを開放"

# 変更履歴を表示
node scripts/access-control-cli.js history
```

**⚠️ モックモードの注意点**:
- 変更は**永続化されません**（アプリケーション再起動で初期化）
- DB構築後は環境変数を `USE_MOCK_ACCESS_CONTROL="false"` に変更

---

## Phase 2: 本番モード（DB構築後）

### 1. データベースのセットアップ

#### マイグレーションの実行

```bash
# MySQLに接続
mysql -u root -p staff_medical_system

# マイグレーション実行
mysql -u root -p staff_medical_system < src/lib/database/migrations/002_create_access_control_tables.sql
mysql -u root -p staff_medical_system < src/lib/database/migrations/003_insert_initial_access_control_data.sql
```

#### 確認クエリ

```sql
-- テーブル確認
SHOW TABLES LIKE 'access_control%';

-- データ確認
SELECT resource_name, min_level, category
FROM access_control_master
WHERE resource_type = 'tab'
ORDER BY display_order;

-- 件数確認（17タブあるはず）
SELECT COUNT(*) FROM access_control_master WHERE resource_type = 'tab';
```

### 2. 環境変数の更新

`.env` ファイルを更新：

```bash
# 本番モードに切り替え
USE_MOCK_ACCESS_CONTROL="false"

# MySQL接続情報
DB_HOST="localhost"
DB_PORT="3306"
DB_USER="your_db_user"
DB_PASSWORD="your_db_password"
DB_NAME="staff_medical_system"

# API Key（既存のまま）
SYSTEM_ADMIN_API_KEY="your-api-key-here"
```

### 3. アプリケーションの再起動

```bash
npm run dev
```

### 4. 本番モードでの動作確認

```bash
# 全タブ設定を表示（DB から取得）
node scripts/access-control-cli.js list tab

# 設定を変更（DBに永続化）
node scripts/access-control-cli.js update evaluation \
  --minLevel=14 \
  --reason="正式運用開始：Level 14にも評価タブを開放" \
  --changedBy="ADMIN_yamada" \
  --changedByName="山田太郎"

# 変更履歴を確認（DBから取得）
node scripts/access-control-cli.js history
```

**✅ 本番モードの特徴**:
- 変更は**データベースに永続化**
- 変更履歴が `access_control_change_log` テーブルに記録
- 複数サーバーでキャッシュ共有（5分TTL）

---

## VSCode / Claude Code からの使用方法

### CLIツールの実行

Claude Codeチャットから直接実行可能：

```
タブ権限の一覧を表示してください

node scripts/access-control-cli.js list tab
```

```
evaluation-historyタブをLevel 14に変更してください

node scripts/access-control-cli.js update evaluation-history \
  --minLevel=14 \
  --reason="人事部門員の業務範囲拡大のため"
```

### curlでのAPI呼び出し（高度な使用）

```bash
# 全設定を取得
curl -H "X-API-Key: your-api-key-here" \
  http://localhost:3000/api/admin/access-control

# 特定リソースを取得
curl -H "X-API-Key: your-api-key-here" \
  http://localhost:3000/api/admin/access-control/evaluation-history

# 設定を更新
curl -X PUT \
  -H "X-API-Key: your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "minLevel": 14,
    "changeReason": "人事部門員の業務範囲拡大のため",
    "changedBy": "ADMIN_001",
    "changedByName": "山田太郎"
  }' \
  http://localhost:3000/api/admin/access-control/evaluation-history
```

---

## タブ権限設定一覧（初期設定）

| タブID | タブ名 | カテゴリ | Level 14 | Level 15 | Level 97/98 |
|--------|--------|---------|----------|----------|-------------|
| basic | 基本情報 | 基本情報 | ✅ | ✅ | ✅ |
| career | 経歴・キャリア | 基本情報 | ✅ | ✅ | ✅ |
| career-course | キャリア選択コース | 基本情報 | ✅ | ✅ | ✅ |
| mindset | マインド・志向性 | 基本情報 | ✅ | ✅ | ✅ |
| qualification | 資格・専門性 | 資格・実績 | ✅ | ✅ | ✅ |
| **achievement** | **実績・表彰** | 資格・実績 | ❌ | ✅ | ✅ |
| attendance | 勤務状況 | 健康管理 | ✅ | ✅ | ✅ |
| **wellbeing** | **ウェルビーイング** | 健康管理 | ❌ | ❌ | ✅ |
| **health-checkup** | **健康診断** | 健康管理 | ❌ | ❌ | ✅ |
| **development** | **能力開発** | 育成・評価 | ❌ | ✅ | ✅ |
| interview | 面談・指導 | 育成・評価 | ✅ | ✅ | ✅ |
| **evaluation** | **最新評価** | 育成・評価 | ❌ | ✅ | ✅ |
| **evaluation-history** | **評価履歴** | 育成・評価 | ❌ | ✅ | ✅ |
| **evaluation-report** | **評価分析** | 育成・評価 | ❌ | ✅ | ✅ |
| **analytics** | **総合分析** | 育成・評価 | ❌ | ✅ | ✅ |
| recruitment | 採用・配属 | 採用・研修 | ✅ | ✅ | ✅ |
| education | 教育・研修 | 採用・研修 | ✅ | ✅ | ✅ |
| links | 統合管理リンク | 統合管理 | ✅ | ✅ | ✅ |

**太字** = Level 15以上または特別権限が必要

---

## よくある質問（FAQ）

### Q1: モックモードと本番モードの違いは？

| 項目 | モックモード | 本番モード |
|------|------------|----------|
| データソース | メモリ内配列 | MySQLデータベース |
| 変更の永続化 | なし | あり |
| 変更履歴 | サンプルのみ | 全記録 |
| 複数サーバー | 非対応 | 対応 |
| 用途 | 開発・テスト | 本番運用 |

### Q2: Level 14の人数が増えた場合、どのタブを開放すべき？

**推奨アプローチ**:
1. まず**実績・表彰タブ**を検討（評価に直接関係しないため）
2. 次に**面談・指導タブ**の担当者制限を強化
3. **評価系タブ（evaluation, evaluation-history等）は慎重に検討**

**変更例**:

```bash
node scripts/access-control-cli.js update achievement \
  --minLevel=14 \
  --reason="Level 14の人数増加により、実績・表彰タブを開放"
```

### Q3: 健康診断タブを人事部に開放できますか？

**できません（推奨しません）**:
- 個人情報保護法：健康情報は「要配慮個人情報」
- 労働安全衛生法：健診結果は産業医・健診担当者のみ
- **Level 97（健診担当者）または Level 98（産業医）のみ**

### Q4: 変更履歴を削除できますか？

**できません**:
- 変更履歴は監査ログとして保存
- コンプライアンス対応のため削除不可
- データベース直接操作でも推奨されません

---

## トラブルシューティング

### エラー: "Unauthorized"

**原因**: API Keyが正しく設定されていない

**解決方法**:

```bash
# API Keyを確認
echo $SYSTEM_ADMIN_API_KEY

# 設定されていない場合
export SYSTEM_ADMIN_API_KEY="your-api-key-here"

# または .env ファイルを確認
cat .env | grep SYSTEM_ADMIN_API_KEY
```

### エラー: "データベース接続エラー"

**原因**: MySQLが起動していない、または接続情報が誤っている

**解決方法**:

```bash
# MySQL起動確認
mysql -u root -p -e "SELECT 1"

# .env の接続情報を確認
cat .env | grep DB_

# モックモードで一時的に動作確認
USE_MOCK_ACCESS_CONTROL="true" npm run dev
```

### キャッシュがクリアされない

**解決方法**:

```bash
# キャッシュを手動でクリア（API経由）
curl -X DELETE \
  -H "X-API-Key: your-api-key-here" \
  http://localhost:3000/api/admin/access-control

# またはアプリケーション再起動
npm run dev
```

---

## 次のステップ

- [ ] 共通データベース構築後、本番モードに切り替え
- [ ] 管理画面UI（/admin/access-control）の実装
- [ ] ロールバック機能の実装（Phase 2）
- [ ] ページ・機能権限のマスター化（Phase 2）

---

## サポート

質問・問題がある場合は、システム管理者にお問い合わせください。

**関連ドキュメント**:
- `unified-account-level-definition.json` - アカウントレベル定義
- `src/lib/database/migrations/002_create_access_control_tables.sql` - テーブル定義
- `src/services/accessControlService.ts` - サービス実装
