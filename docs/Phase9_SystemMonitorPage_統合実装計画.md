# Phase 9: SystemMonitorPage連携強化（Phase 2.5）

**実装時期**: 共通DB構築後（2025年11月1日〜11月8日予定）
**優先度**: 🟡 中優先度（データ欠損検出機能）
**参照文書**: `mcp-shared/docs/SystemMonitorPage_医療システム確認結果_20251026.md`
**作成日**: 2025年10月26日

---

## 📋 概要

VoiceDrive側のSystemMonitorPageEnhanced（システム監視ダッシュボード）でWebhook送信統計・面談実施統計を実現するためのAPI実装。

**Phase 2完了状況（VoiceDrive側）**:
- ✅ WebhookLogテーブル追加（Webhook受信履歴記録）
- ✅ Webhook受信統計表示（24時間）
- ✅ データ同期統計表示（職員写真同期率）
- ✅ 接続性ステータス表示（healthy/warning/critical）

**Phase 2.5の目的（医療システム側）**:
- ⚠️ 医療システム側のWebhook送信統計を取得
- ⚠️ 送信数 vs 受信数の比較で**データ欠損を検出**
- ⚠️ リトライ状況の監視
- ⚠️ 面談実施率の監視

---

## 🎯 実装対象API

### API 1: Webhook送信統計取得API（優先度: 高）
- エンドポイント: `GET /api/integration/webhook-stats`
- 推定工数: 2日（16時間）

### API 2: 面談実施統計取得API（優先度: 中）
- エンドポイント: `GET /api/interviews/completion-stats`
- 推定工数: 1.5日（12時間）

### 合計工数: 3.5日（28時間）

---

## 📅 実装スケジュール

| 日付 | 作業内容 | 推定工数 | 状態 |
|------|---------|---------|------|
| 11/1 (金) | DB設計・テーブル作成 | 4時間 | ⏳ 待機中 |
| 11/4 (月) | API 1実装（Webhook送信統計） | 8時間 | ⏳ 待機中 |
| 11/5 (火) | Webhook送信コード修正 | 6時間 | ⏳ 待機中 |
| 11/6 (水) | API 2実装（面談実施統計） | 6時間 | ⏳ 待機中 |
| 11/7 (木) | 単体テスト作成・実行 | 6時間 | ⏳ 待機中 |
| 11/8 (金) | VoiceDriveチームとの統合テスト | 4時間 | ⏳ 待機中 |

---

詳細な実装内容は `mcp-shared/docs/SystemMonitorPage_医療システム確認結果_20251026.md` を参照してください。
