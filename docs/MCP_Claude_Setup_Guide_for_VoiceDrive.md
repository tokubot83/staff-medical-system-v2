# VoiceDriveチーム向け Claude Code自動認識設定ガイド

**作成日**: 2025年8月10日  
**重要度**: 高（Claude Codeの効率化のため）

---

## 📢 お知らせ

MCPサーバーで共有されたファイルを、VoiceDrive側のClaude Codeが**自動的に認識**できるようにする設定方法です。
**5分で設定完了**し、今後の作業が大幅に効率化されます！

---

## 🎯 設定することで実現できること

### Before（設定前）😔
```
医療チーム: 「報告書を共有しました」
VoiceDrive: 「どこですか？」
医療チーム: 「mcp-shared/docs/report.mdです」
VoiceDrive Claude: 「ファイルパスを教えてください」
→ 手動で確認が必要
```

### After（設定後）😊
```
医療チーム: ファイルを作成
↓
MCPサーバー: 自動共有
↓
VoiceDrive Claude: 「新しい共有ファイルを確認しました。内容は...」
→ 自動認識！
```

---

## ⚙️ 設定手順（3ステップ）

### Step 1: CLAUDE.mdに追記（必須・最重要）

VoiceDriveプロジェクトのルートにある`CLAUDE.md`に以下を追加してください：

```markdown
# CLAUDE.md - VoiceDrive プロジェクト設定

## MCPサーバー共有ファイル自動確認設定

### 作業開始時の確認事項
Claude Codeは作業開始時に必ず以下を実行してください：

1. **最新の要約を確認**
   ```bash
   cat mcp-shared/docs/AI_SUMMARY.md
   ```

2. **新しい共有ファイルをチェック**
   ```bash
   ls -la mcp-shared/docs/ | head -10
   cat mcp-shared/sync-status.json | grep lastSync
   ```

### 監視対象フォルダ
以下のフォルダは医療職員管理システムと自動同期されています：
- `mcp-shared/docs/` - 報告書、設計書
- `mcp-shared/config/` - 設定ファイル（interview-types.json等）
- `mcp-shared/interfaces/` - TypeScript型定義
- `mcp-shared/logs/` - テスト結果

### 重要ファイル
- `mcp-shared/docs/AI_SUMMARY.md` - **最初に必ず読む**（重要更新の要約）
- `mcp-shared/docs/daily-report.md` - 日次報告
- `mcp-shared/config/interview-types.json` - 面談タイプ設定
```

### Step 2: 監視スクリプトの設置（推奨）

以下のコマンドを実行：

```bash
# VoiceDriveプロジェクトのルートで実行
cd voicedrive-v100

# 監視スクリプトをコピー（医療チーム側で作成済み）
cp ../staff-medical-system/scripts/watch-mcp-shared.js ./scripts/

# package.jsonにスクリプトを追加
npm pkg set scripts.watch:mcp="node scripts/watch-mcp-shared.js"

# 監視開始（バックグラウンド実行）
npm run watch:mcp &
```

### Step 3: 初回確認（オプション）

設定が正しく動作するか確認：

```bash
# Claude Codeに聞いてみる
"mcp-sharedフォルダの最新ファイルを確認して"

# 期待される応答
"mcp-shared/docs/AI_SUMMARY.mdを確認しました。
最新の更新は..."
```

---

## 📊 設定完了後の動作

### Claude Codeの自動動作

1. **起動時**
   - mcp-shared/docs/AI_SUMMARY.md を自動確認
   - 新しいファイルがあれば内容を把握

2. **作業中**
   - 監視スクリプトが新ファイルを検出
   - CLAUDE_NOTIFICATIONS.md に記録
   - 必要に応じて通知

3. **型定義やConfigの変更時**
   - 自動的に新しい定義を認識
   - インポート文を提案

---

## 🎁 設定によるメリット

| 項目 | 効果 |
|------|------|
| ファイル共有の認識時間 | 手動5分 → **自動0秒** |
| 型定義の不一致 | よくある → **ゼロ** |
| 設定の同期漏れ | 時々発生 → **ゼロ** |
| コミュニケーションコスト | 高 → **最小** |

---

## ❓ FAQ

**Q: 設定後、何か特別な操作は必要？**
A: いいえ。Claude Codeが自動的に処理します。

**Q: 既存のワークフローへの影響は？**
A: ありません。純粋に効率が向上するだけです。

**Q: 監視スクリプトは常に実行する必要がある？**
A: オプションです。CLAUDE.mdの設定だけでも十分機能します。

---

## 📞 サポート

設定で不明な点があれば：
- Slack: #phase2-integration
- 医療システムチーム: 設定をサポートします

---

## ✅ チェックリスト

VoiceDriveチームの対応：
- [ ] CLAUDE.mdに設定を追加（5分）
- [ ] 監視スクリプトをコピー（オプション・2分）
- [ ] 動作確認（1分）

**合計作業時間: 5-8分**

---

## 🎊 設定完了後

月曜日から、両チーム間のファイル共有が**完全自動化**されます！
「ファイルを確認してください」というやり取りが不要になり、開発に集中できます。

---

医療職員管理システムチーム