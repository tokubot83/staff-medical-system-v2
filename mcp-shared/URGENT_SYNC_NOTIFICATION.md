# 【緊急】VoiceDriveチーム向け同期通知

## 作成日時: 2025-08-15 14:30 JST

## 重要: 新規異議申し立てAPI実装ドキュメント追加

VoiceDriveチーム各位

医療職員管理システムチームより、異議申し立て機能のAPI実装に関する重要なドキュメントを
MCP共有フォルダに追加しました。至急ご確認ください。

## 新規追加ファイル

### 1. 実装指示書（最優先で確認）
**ファイル**: `mcp-shared/docs/voicedrive-appeal-request.md`
- VoiceDrive SNS側で実装いただきたい異議申し立て機能の詳細仕様
- APIエンドポイント定義
- 必須パラメータ
- レスポンス形式

### 2. インターフェース定義
**ファイル**: `mcp-shared/interfaces/appeal.interface.ts`
- TypeScript型定義
- 共通データ構造
- ステータス管理

### 3. 実装ステータス
**ファイル**: `mcp-shared/docs/appeal-api-implementation-status.md`
- 医療システム側のAPI実装状況
- テスト用コマンド例
- 統合手順

## 医療システム側の準備状況

✅ **APIエンドポイント稼働中**
- POST /api/v1/appeals/submit（異議申し立て受付）
- GET /api/v1/appeals/status/[appealId]（ステータス確認）
- PUT /api/v1/appeals/status/[appealId]（ステータス更新）

✅ **面談予約システムと同じアーキテクチャ**
- 既存の面談予約実装をベースに構築
- 同じレスポンス形式を採用

## 対応依頼事項

1. **ドキュメント確認**（本日中）
   - voicedrive-appeal-request.md を確認
   - 不明点があれば連絡

2. **実装スケジュール調整**
   - Phase 1: API実装とMCP連携（2週間）
   - Phase 2: UI実装（1週間）
   - Phase 3: テストと修正（1週間）

3. **テスト環境での動作確認**
   - 医療システム側のAPIは既に稼働中
   - テスト用curlコマンドはドキュメント参照

## 同期確認方法

```bash
# MCP共有フォルダの最新ファイルを確認
ls -la mcp-shared/docs/ | grep appeal
ls -la mcp-shared/interfaces/ | grep appeal

# 同期ステータス確認
cat mcp-shared/sync-status.json | grep -A5 "voicedrive-appeal"
```

## 連絡先

技術的な質問は以下へ：
- Slackチャンネル: #medical-voicedrive-integration
- 緊急時: 内線 xxxx

## 備考

- 8月10日の同期から更新が止まっていたため、手動で同期通知を作成
- sync-status.jsonも更新済み
- 異議申し立て機能は評価開示後の重要機能のため、早期実装をお願いします

---
医療職員管理システムチーム