# CLAUDE.md - 医療職員管理システム プロジェクト設定

## 重要フォルダ・ファイル

### docs/ フォルダ
**絶対に削除してはいけない重要フォルダ**

このフォルダには以下の重要な面談シート・評価シートが含まれています：
- interview-sheets/ - 面談シート
- v2_interview-sheets/ - v2面談シート
- v3_interview-sheets/ - v3面談シート
- v4_interview/ - v4統合面談シート
- v3_evaluation-sheets/ - v3評価シート
- v4_evaluation-sheets/ - v4評価シート
- 各種ドキュメント（面談制度の説明書、マニュアル等）

これらは本システムの中核となるコンテンツであり、削除すると面談・評価機能が使用できなくなります。

## MCPサーバー共有ファイル自動確認設定

### 作業開始時の確認事項
Claude Codeは作業開始時に必ず以下を実行してください：

1. **最新の要約を確認**
   ```bash
   cat mcp-shared/docs/AI_SUMMARY.md
   ```

2. **VoiceDriveからの新しい共有ファイルをチェック**
   ```bash
   ls -la mcp-shared/docs/ | head -10
   cat mcp-shared/sync-status.json | grep lastSync
   ```

### 監視対象フォルダ
以下のフォルダはVoiceDriveと自動同期されています：
- `mcp-shared/docs/` - 共有ドキュメント（報告書、設計書）
- `mcp-shared/config/` - 設定ファイル
- `mcp-shared/interfaces/` - TypeScript型定義
- `mcp-shared/logs/` - テスト結果、作業ログ

### 重要ファイル（毎回確認）
- `mcp-shared/docs/AI_SUMMARY.md` - **最初に必ず読む**（VoiceDriveからの重要更新）
- `mcp-shared/docs/voicedrive-daily-report.md` - VoiceDriveの日次報告
- `mcp-shared/logs/voicedrive-test-results.json` - VoiceDriveのテスト結果

## 注意事項
- docs/フォルダ内のファイルは全て本番で使用される重要なコンテンツです
- 不要なファイルの削除作業を行う際は、docs/フォルダを除外してください
- mcp-shared/フォルダは両チーム共有のため、削除・変更時は要確認