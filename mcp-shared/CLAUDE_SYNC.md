# MCPサーバー共有ファイル自動認識設定

## VoiceDrive側のCLAUDE.mdに追加する内容

```markdown
# CLAUDE.md - VoiceDrive プロジェクト設定

## MCPサーバー共有ファイル

### 自動監視対象フォルダ
以下のフォルダは医療職員管理システムと自動同期されています。
Claude Codeは作業開始時に必ず確認してください：

- `mcp-shared/docs/` - 共有ドキュメント（報告書、設計書）
- `mcp-shared/config/` - 設定ファイル（interview-types.json等）
- `mcp-shared/interfaces/` - TypeScript型定義
- `mcp-shared/logs/` - テスト結果、作業ログ

### 最新の共有ファイルを確認
```bash
# 作業開始時に実行
ls -la mcp-shared/docs/ | head -5
cat mcp-shared/sync-status.json | grep lastSync
```

### 重要な共有ファイル
- `mcp-shared/docs/daily-report.md` - 日次報告（毎日更新）
- `mcp-shared/docs/blockers.md` - ブロッカー一覧
- `mcp-shared/config/interview-types.json` - 面談タイプ設定
```

## これをVoiceDrive側のCLAUDE.mdに追加することで

1. VoiceDrive側のClaude Codeが起動時に自動的に確認
2. 「mcp-shared内に新しいファイルがあるか」を認識
3. 必要に応じて内容を読み込み
```