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

## Phase 3 実装状況（2025年10月2日更新）

### 実装完了項目（100%完了）
- ✅ 施設別権限レベル管理システム
- ✅ 小原病院（obara-hospital）9役職マッピング
- ✅ 立神リハビリテーション温泉病院（tategami-rehabilitation）12役職マッピング
- ✅ 統括主任レベル7調整（医療チーム承認済み）
- ✅ facilityIdパラメータによる施設識別
- ✅ Webhook通知システム（リトライ機構付き）

### テスト結果
- 単体テスト: 17/17成功（100%）
- 統合テスト: 15/15成功（100%）
- 本番環境接続テスト: 6/7成功（SSL/TLS接続のみ失敗 - 共通DB未構築のため）

### 共通DB構築後の再開作業
1. **環境設定更新** - .env.productionに実際のDB接続情報を設定
2. **接続確認** - `npm run test:db:connection`
3. **実データテスト** - 立神病院の統括主任レベル7確認
4. **統合テスト実行** - `node tests/integration/phase3-integration-test.js`
5. **VoiceDrive連携確認** - Webhook送信テスト

### 重要コマンド
```bash
# DB接続テスト
npm run test:db:connection

# 統合テスト（実環境）
node tests/integration/phase3-integration-test.js

# 本番環境接続テスト
node tests/production/production-connection-test.js

# 施設別権限テストのみ
npm test -- --testNamePattern="施設別権限"
```

### 関連ドキュメント
- `docs/Phase3_実装作業完了報告書_FINAL.md` - 完了報告書
- `docs/Phase3_作業再開指示書.md` - DB構築後の再開手順
- `docs/Phase3_VoiceDrive作業再開依頼書.md` - VoiceDriveチームへの依頼書

## 注意事項
- docs/フォルダ内のファイルは全て本番で使用される重要なコンテンツです
- 不要なファイルの削除作業を行う際は、docs/フォルダを除外してください
- mcp-shared/フォルダは両チーム共有のため、削除・変更時は要確認
- Phase 3の実装は完了済み、共通DB構築待機中です