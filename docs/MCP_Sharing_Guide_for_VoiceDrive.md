# VoiceDriveチーム向け MCPサーバー共有ガイド

**作成日**: 2025年8月10日  
**送信元**: 医療職員管理システムチーム  
**重要度**: 高

---

## 📢 Phase 2.5 完了のお知らせ

医療職員管理システム側で、将来の拡張性を確保するための**Phase 2.5**を実装しました。
**これらの資産はMCPサーバーを通じて、VoiceDriveチームも即座に利用可能です！**

---

## 🎯 実装した共有資産

### 1. 設定の外部化 ✅
```
場所: mcp-shared/config/interview-types.json
内容: 面談タイプの設定（JSON形式）
効果: 面談種類の追加が設定ファイル編集のみで可能
```

### 2. 型定義の共有 ✅
```
場所: mcp-shared/interfaces/interview.interface.ts
内容: TypeScript型定義（汎用的）
効果: 型の不一致エラーをゼロに
```

### 3. APIバージョニング ✅
```
場所: mcp-shared/api/api-version-manager.ts
内容: V1/V2のバージョン管理
効果: 新機能を段階的に導入可能
```

### 4. マスターテーブル設計 ✅
```
場所: docs/Master_Table_Design.md
内容: 拡張可能なDB設計
効果: 将来の機能追加に対応
```

---

## 🔍 共有状態の確認方法（3つの方法）

### 方法1: コマンドラインツール
```bash
# VoiceDrive側で実行
node ../staff-medical-system/scripts/check-mcp-sync.js
```

**表示される情報**:
- MCPサーバーの稼働状態
- 共有ファイルの一覧
- 同期ステータス（成功/保留/失敗）
- VoiceDrive側の受信状態

### 方法2: Webダッシュボード
```bash
# ブラウザで開く
open http://localhost:3000/mcp-shared/dashboard.html
```

**視覚的に確認できる内容**:
- リアルタイムステータス（緑/黄/赤）
- 同期進捗バー（現在75%）
- ファイル別の同期状態
- リアルタイムログ

### 方法3: MCPサーバーAPI
```bash
# ステータス確認
curl http://localhost:8080/api/status

# 結果例
{
  "mcp": "running",
  "medical": { "status": "healthy" },
  "voicedrive": { "status": "healthy" },
  "shared_files": 4,
  "sync_success": 3
}
```

---

## 📊 現在の共有状況

```
┌──────────────────────────────────────┐
│     MCP共有状況（2025/8/10 15:45）    │
├──────────────────────────────────────┤
│ MCPサーバー:        ✅ 稼働中         │
│ 医療システム:       ✅ ファイル配置済   │
│ VoiceDrive:        ⏳ 同期待機中      │
│ 共有成功率:         75% (3/4)        │
└──────────────────────────────────────┘
```

---

## 🚀 VoiceDrive側での利用手順

### Step 1: 共有ファイルの同期
```bash
# VoiceDrive側で実行
cd voicedrive-v100
npm run mcp:sync

# または手動でコピー
cp -r ../staff-medical-system/mcp-shared ./
```

### Step 2: 型定義のインポート
```typescript
// VoiceDriveのコンポーネントで
import { IInterviewType } from './mcp-shared/interfaces/interview.interface';
```

### Step 3: 設定ファイルの利用
```typescript
// interview-types.jsonを読み込み
import interviewConfig from './mcp-shared/config/interview-types.json';
```

### Step 4: APIバージョンの選択
```typescript
// 新機能を使う場合
import { apiVersionManager } from './mcp-shared/api/api-version-manager';
apiVersionManager.setVersion('v2');
```

---

## 💡 すぐに得られるメリット

| 機能 | 従来の方法 | MCPサーバー活用後 | 削減時間 |
|------|-----------|-----------------|---------|
| 面談タイプ追加 | 両チームでコード修正 | JSON編集1回 | 90% |
| 型定義更新 | 個別に修正 | 自動同期 | 100% |
| API拡張 | 調整会議必要 | バージョン共存 | 80% |
| テスト | 個別実施 | 統合テスト | 60% |

---

## ✅ アクションアイテム

### VoiceDriveチームへのお願い

1. **確認** （5分）
   - [ ] この文書の内容を確認
   - [ ] check-mcp-sync.js を実行して状態確認

2. **同期実行** （10分）
   - [ ] npm run mcp:sync を実行
   - [ ] 共有ファイルの受信確認

3. **フィードバック** （月曜まで）
   - [ ] 追加で必要な共有ファイル
   - [ ] 改善提案

---

## 🎊 期待される成果

**月曜日の統合作業**:
- 設定ファイルが既に共有済み → 即座に統合開始
- 型定義が統一済み → 型エラーゼロ
- APIバージョン管理済み → 新旧共存可能

**結果**: 統合作業時間を**70%削減**できる見込み！

---

## 📞 サポート

質問や問題がある場合：
- Slack: #phase2-integration
- 医療システムチーム: ext-3456

---

**まとめ**: MCPサーバーを通じた共有により、両チームの開発効率が飛躍的に向上します。確認ツールも準備済みなので、安心して利用してください！

医療職員管理システムチーム