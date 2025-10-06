# アクセス制御システム 実装完了サマリー

**実装日**: 2025年10月6日
**実装者**: Claude Code（医療チーム）
**ステータス**: ✅ Phase 1 完了（DB構築前でも動作可能）

---

## エグゼクティブサマリー

**持続可能なシステム運用**を実現するため、タブ・ページ・機能の権限管理をマスターデータベースで動的に管理するアクセス制御システムを実装しました。

### 主な成果

✅ **コード変更不要で権限調整が可能**
✅ **DB構築前でも動作（モックモード）**
✅ **VSCode/Claude Code経由での設定変更をサポート**
✅ **変更履歴の完全な記録（監査対応）**
✅ **17タブの段階的権限設計（Level 14-18）**

---

## 実装内容

### 1. データベーススキーマ（3テーブル）

| テーブル名 | 用途 | レコード数 |
|-----------|------|-----------|
| `access_control_master` | アクセス制御設定 | 18件（17タブ+拡張用） |
| `access_control_change_log` | 変更履歴 | 無制限 |
| `access_control_snapshot` | スナップショット（Phase 2） | - |

**ファイル**:
- `src/lib/database/migrations/002_create_access_control_tables.sql`
- `src/lib/database/migrations/003_insert_initial_access_control_data.sql`

### 2. バックエンドサービス

#### accessControlService.ts
- 権限チェック関数（`canAccessTab`, `canAccessPage`）
- 設定取得関数（`getAccessControlConfigs`）
- 設定更新関数（`updateAccessControl`）
- 変更履歴取得関数（`getChangeLog`）
- **モック/本番モード自動切り替え**

#### accessControlService.mock.ts
- 17タブ分のモックデータ
- DB構築前の開発・テスト用

**ファイル**:
- `src/services/accessControlService.ts`
- `src/services/accessControlService.mock.ts`
- `src/lib/database/db.ts`

### 3. API Routes（Level 99専用）

| エンドポイント | メソッド | 用途 |
|--------------|---------|------|
| `/api/admin/access-control` | GET | 全設定取得 |
| `/api/admin/access-control` | DELETE | キャッシュクリア |
| `/api/admin/access-control/[resourceId]` | GET | 特定リソース取得 |
| `/api/admin/access-control/[resourceId]` | PUT | 設定更新 |
| `/api/admin/access-control/change-log` | GET | 変更履歴取得 |

**認証方式**:
- API Key認証（ヘッダー: `X-API-Key`）← **VSCode/Claude Code用**
- セッション認証（ブラウザ）← Phase 2実装

**ファイル**:
- `src/app/api/admin/access-control/route.ts`
- `src/app/api/admin/access-control/[resourceId]/route.ts`
- `src/app/api/admin/access-control/change-log/route.ts`

### 4. CLIツール（VSCode/Claude Code対応）

```bash
# 全タブ設定を表示
node scripts/access-control-cli.js list tab

# 特定タブの設定を表示
node scripts/access-control-cli.js get evaluation-history

# 設定を変更
node scripts/access-control-cli.js update evaluation \
  --minLevel=14 \
  --reason="Level 14の人数増加のため"

# 変更履歴を表示
node scripts/access-control-cli.js history
```

**ファイル**:
- `scripts/access-control-cli.js`

### 5. ドキュメント

- `docs/ACCESS_CONTROL_SETUP_GUIDE.md` - セットアップガイド（65KB）
- `docs/ACCESS_CONTROL_IMPLEMENTATION_SUMMARY.md` - 本ドキュメント
- `.env.example` - 環境変数設定例

---

## タブ権限設計（合意済み）

### レベル別アクセス可能タブ数

| Level | 人数 | アクセス可能タブ数 | 備考 |
|-------|------|--------------------|------|
| **14** | 7-8名 | 11タブ | 基本情報・面談・研修 |
| **15** | 4名 | 17タブ | + 評価・育成データ |
| **16-17** | 各1名 | 17タブ | 戦略企画部門 |
| **18** | - | 17タブ | 理事長 |
| **97/98** | - | 3タブ | 健康管理専用 |
| **99** | - | 全タブ | システム管理者 |

### 主な権限差分

**Level 14 → 15で追加されるタブ**:
- 実績・表彰
- 能力開発
- 最新評価
- 評価履歴
- 評価分析
- 総合分析

**健診担当者・産業医専用タブ（Level 97/98のみ）**:
- ウェルビーイング
- 健康診断

---

## モードの切り替え

### DB構築前（モックモード）

```bash
# .env
USE_MOCK_ACCESS_CONTROL="true"
```

**特徴**:
- データはメモリ内配列
- 変更は永続化されない
- 開発・テスト用

### DB構築後（本番モード）

```bash
# .env
USE_MOCK_ACCESS_CONTROL="false"

# MySQL接続情報
DB_HOST="localhost"
DB_PORT="3306"
DB_USER="your_user"
DB_PASSWORD="your_password"
DB_NAME="staff_medical_system"
```

**特徴**:
- データはMySQLデータベース
- 変更は永続化される
- 変更履歴が完全に記録される

**切り替え手順**:
1. マイグレーションSQL実行
2. 環境変数を `false` に変更
3. アプリケーション再起動

---

## VSCode/Claude Code 統合

### API Key認証

```bash
# .env
SYSTEM_ADMIN_API_KEY="your-random-api-key-here"

# API Key生成
openssl rand -hex 32
```

### CLIツールの使用例

**Claude Codeチャットから実行**:

```
evaluation-historyタブをLevel 14に変更してください

node scripts/access-control-cli.js update evaluation-history \
  --minLevel=14 \
  --reason="人事部門員の業務範囲拡大のため" \
  --changedBy="ADMIN_yamada" \
  --changedByName="山田太郎"
```

**直接API呼び出し**:

```bash
curl -H "X-API-Key: your-api-key" \
  http://localhost:3000/api/admin/access-control?type=tab
```

---

## セキュリティ設計

### 1. システム保護フラグ

健康診断タブなど、法的に重要な権限には `isSystemProtected: true` を設定：

```json
{
  "resourceId": "health-checkup",
  "minLevel": 97,
  "isSystemProtected": true
}
```

変更時に警告ダイアログ表示（Phase 2実装予定）

### 2. 推奨設定との差分チェック

```json
{
  "resourceId": "evaluation-history",
  "minLevel": 15,
  "recommendedMinLevel": 15,
  "recommendedReason": "評価履歴の分析は部門長以上の権限"
}
```

推奨レベルより低い設定は `isDeviationFromRecommended: true` でフラグ

### 3. 変更理由の必須化

```typescript
if (!body.changeReason || body.changeReason.trim().length < 10) {
  return error('変更理由は10文字以上で入力してください');
}
```

全ての変更に10文字以上の理由が必須

### 4. 監査ログの記録

```sql
INSERT INTO access_control_change_log (
  master_record_id, resource_id, field_name,
  old_value, new_value, change_reason,
  changed_by, changed_by_name, changed_by_level,
  ip_address, user_agent
) VALUES (...)
```

誰が・いつ・何を・なぜ変更したかを完全記録

---

## 今後の拡張（Phase 2以降）

### Phase 2: 本番運用機能

- [ ] 管理画面UI実装（`/admin/access-control`）
- [ ] ロールバック機能（スナップショット利用）
- [ ] 変更確認ダイアログ（システム保護フラグ対応）
- [ ] セッション認証の実装

### Phase 3: 高度な権限管理

- [ ] ページ権限のマスター化
- [ ] 機能権限のマスター化（エクスポート等）
- [ ] 役割ベースアクセス制御（RBAC）
- [ ] 施設別の権限オーバーライド

### Phase 4: データ項目レベル権限

- [ ] 給与情報の権限制御
- [ ] 懲戒情報の権限制御
- [ ] 項目単位の閲覧・編集権限

---

## トラブルシューティング

### よくあるエラーと解決方法

#### 1. "Unauthorized" エラー

**原因**: API Keyが設定されていない

**解決**:
```bash
export SYSTEM_ADMIN_API_KEY="your-api-key"
node scripts/access-control-cli.js list
```

#### 2. "データベース接続エラー"

**原因**: MySQLが起動していない

**解決**:
```bash
# モックモードで一時的に動作
USE_MOCK_ACCESS_CONTROL="true" npm run dev
```

#### 3. キャッシュが更新されない

**解決**:
```bash
# キャッシュクリア
curl -X DELETE -H "X-API-Key: your-key" \
  http://localhost:3000/api/admin/access-control
```

---

## パフォーマンス

### キャッシュ戦略

- **TTL**: 5分
- **無効化**: 設定更新時に自動クリア
- **API**: `/api/admin/access-control` (DELETE) で手動クリア可能

### データベース負荷

- **読み取り**: キャッシュヒット率 > 95%（想定）
- **書き込み**: 1日数回程度（想定）
- **インデックス**: `resource_type`, `min_level`, `is_active`

---

## まとめ

### 実装の成功要因

✅ **柔軟性**: コード変更不要で権限調整可能
✅ **保守性**: システム管理者が自律的に管理可能
✅ **セキュリティ**: セーフガードで誤設定を防止
✅ **監査対応**: 変更履歴の完全な記録
✅ **開発効率**: DB構築前でも開発・テスト可能

### 次のステップ

1. **DB構築後**: 環境変数を `USE_MOCK_ACCESS_CONTROL=false` に変更
2. **マイグレーション実行**: 002, 003のSQLファイルを実行
3. **動作確認**: CLIツールで設定取得・更新をテスト
4. **管理画面UI実装**: `/admin/access-control` ページの開発

---

## 関連ファイル一覧

### データベース
- `src/lib/database/migrations/002_create_access_control_tables.sql`
- `src/lib/database/migrations/003_insert_initial_access_control_data.sql`
- `src/lib/database/db.ts`

### サービス層
- `src/services/accessControlService.ts`
- `src/services/accessControlService.mock.ts`

### API
- `src/app/api/admin/access-control/route.ts`
- `src/app/api/admin/access-control/[resourceId]/route.ts`
- `src/app/api/admin/access-control/change-log/route.ts`

### ツール
- `scripts/access-control-cli.js`

### ドキュメント
- `docs/ACCESS_CONTROL_SETUP_GUIDE.md`
- `docs/ACCESS_CONTROL_IMPLEMENTATION_SUMMARY.md`
- `mcp-shared/config/unified-account-level-definition.json`

### 設定
- `.env.example`

---

**実装完了日**: 2025年10月6日
**実装者**: Claude Code + 医療チーム
**レビュー**: 承認待ち
