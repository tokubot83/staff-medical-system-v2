# 作業再開指示書 - 2025年9月21日

## 🎯 **現在の状況サマリー**

### ✅ **完了済み事項**

1. **統合テスト完全成功**
   - Phase 1: 5/5 テスト成功
   - Phase 2: 11/11 テスト成功
   - Phase 3: 9/9 テスト成功
   - **総合: 25/25 (100%成功)**

2. **優先度統一実装**
   - 3段階に統一（high/medium/low）
   - "緊急"カテゴリ削除済み
   - マッピング実装完了

3. **Lightsailマスタープラン作成**
   - ファイル: `mcp-shared/docs/lightsail-integration-master-plan-20250920.md`
   - VoiceDriveチーム承認済み
   - 全5フェーズ承認

---

## 📋 **明日（9/21）から開始する作業**

### 1️⃣ **Phase 0: 組織設計（最優先）**

#### 必要な作業:
```markdown
1. 医療法人厚生会の組織構造図作成
   - 施設一覧の確定
   - 部門構成の確定
   - 職位・役職の定義

2. 権限マトリックス詳細設計
   - 4段階権限（L1～L4）の詳細定義
   - データアクセス範囲の明確化
   - 承認フローの設計

3. データベース設計
   - permission_matrixテーブル設計
   - role_hierarchyテーブル設計
   - organization_structureテーブル設計
```

### 2️⃣ **実装準備タスク**

#### コード実装:
```typescript
// src/types/organization.ts を作成
interface OrganizationStructure {
  headquarters: {
    executives: Role[];
  };
  facilities: Facility[];
  departments: Department[];
}

// src/services/permissionService.ts を作成
class PermissionService {
  checkAccess(userId: string, resource: string): boolean
  getHierarchicalData(userId: string): any[]
}
```

#### データベース準備:
```sql
-- migrations/001_organization_structure.sql を作成
CREATE TABLE organization_hierarchy (
  id INT PRIMARY KEY,
  parent_id INT,
  type ENUM('headquarters', 'facility', 'department', 'team'),
  name VARCHAR(100),
  level INT
);
```

---

## 🚀 **即座に実行するコマンド**

### 作業開始時（9/21朝）:
```bash
# 1. プロジェクトディレクトリへ移動
cd C:\projects\staff-medical-system

# 2. 最新状態を確認
git status
git pull origin main

# 3. Phase 0用のブランチ作成
git checkout -b feature/phase0-organization-design

# 4. 開発サーバー起動
npm run dev

# 5. VoiceDrive APIサーバー起動（別ターミナル）
node voicedrive-production-server.js
```

---

## 📁 **重要ファイル一覧**

### 確認が必要なファイル:
1. `mcp-shared/docs/lightsail-integration-master-plan-20250920.md` - マスタープラン
2. `mcp-shared/docs/voicedrive-master-plan-confirmed-OFFICIAL-20250920.md` - 承認書
3. `src/components/notification/AnnouncementComposer.tsx` - 優先度実装済み
4. `test-integration-phase3.js` - 統合テスト（参考用）

### 新規作成するファイル:
1. `src/types/organization.ts` - 組織構造型定義
2. `src/services/permissionService.ts` - 権限サービス
3. `src/components/admin/OrganizationManager.tsx` - 組織管理UI
4. `migrations/001_organization_structure.sql` - DB初期構造

---

## 🔧 **環境設定チェックリスト**

```bash
# Node.jsバージョン確認（18以上必要）
node --version

# 依存関係確認
npm list

# ポート確認（3000, 3003が空いているか）
netstat -ano | findstr :3000
netstat -ano | findstr :3003

# MCP共有フォルダ確認
ls -la mcp-shared/docs/

# Git設定確認
git config --list
```

---

## 📝 **Phase 0 完了条件**

### 2週間後（10/4）までに完了:
- [ ] 組織構造図の確定と承認
- [ ] 権限マトリックスの実装
- [ ] データベーステーブル作成
- [ ] 基本API実装
- [ ] 管理画面UI作成
- [ ] テストケース作成と実行
- [ ] ドキュメント更新

---

## 🎯 **週次マイルストーン**

### 第1週（9/21-9/27）:
- 組織構造の確定
- 権限設計完了
- DB設計完了

### 第2週（9/28-10/4）:
- 実装完了
- テスト実施
- Phase 1準備開始

---

## 📞 **連絡事項**

### VoiceDriveチームとの連携:
- 週明け（9/23）に組織設計会議予定
- 技術仕様の詳細検討開始
- APIインターフェース仕様の調整

### 報告タイミング:
- 毎日: 進捗をmcp-shared/logsに記録
- 週次: マスタープラン更新
- 完了時: Phase 0完了報告書作成

---

## ⚠️ **注意事項**

1. **docs/フォルダは絶対に削除しない**（面談シート等の重要データ）
2. **mainブランチへの直接pushは禁止**
3. **テストなしのマージは禁止**
4. **毎日バックアップを取る**

---

## 💡 **トラブルシューティング**

### ポート競合時:
```bash
# Windows
taskkill /PID [PID番号] /F

# プロセス確認
netstat -ano | findstr :[ポート番号]
```

### Git競合時:
```bash
git stash
git pull origin main
git stash pop
```

### npm エラー時:
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

---

## 🚦 **作業開始チェックリスト**

明日の朝、以下を順番に確認:

1. [ ] この指示書を読む
2. [ ] マスタープランを再確認
3. [ ] 開発環境を起動
4. [ ] Phase 0ブランチを作成
5. [ ] 組織構造設計を開始
6. [ ] 進捗をTodoWriteツールで管理
7. [ ] 作業ログをmcp-sharedに記録

---

**作成日時**: 2025年9月20日 23:35
**作成者**: 医療システムチーム
**次回確認**: 2025年9月21日 09:00

*この指示書に従って、明日から確実に作業を再開してください。*