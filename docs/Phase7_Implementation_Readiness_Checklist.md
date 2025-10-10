# Phase 7実装準備チェックリスト

**Phase 7: 人事お知らせVoiceDrive統合**
**作成日：2025年10月7日**
**対象：職員カルテシステム開発チーム**

---

## 📋 チェックリスト概要

Phase 7実装を開始する前に、必要な準備が全て整っているかを確認するためのチェックリストです。

**実装期間**：約1週間（7.5日）
**前提条件**：Phase 6（共通DB構築）完了

---

## 1️⃣ 事前準備チェックリスト

### Phase 6完了確認

- [ ] **Phase 6（共通DB構築）が完了している**
  - 共通DBが本番環境に構築済み
  - 接続確認テスト成功
  - マイグレーション実行済み

- [ ] **関連テーブルの確認**
  - `hr_announcements` テーブル作成済み
  - `announcement_stats` テーブル作成済み
  - `announcement_stats_by_department` テーブル作成済み
  - インデックス設定済み

### VoiceDriveからの情報受領

- [ ] **認証情報の受領**
  - `VOICEDRIVE_API_TOKEN` 受領済み
  - `VOICEDRIVE_WEBHOOK_SECRET` 受領済み
  - セキュアな方法で保管（.env.production）

- [ ] **エンドポイント情報の確認**
  - Production環境URL: `https://api.voicedrive.example.com`
  - Staging環境URL: `https://staging-api.voicedrive.example.com`
  - ポート番号: 4000（確認済み）

- [ ] **IPアドレスリストの受領**
  - Production環境IP: `xxx.xxx.xxx.xxx`
  - Staging環境IP: `yyy.yyy.yyy.yyy`
  - ファイアウォール設定用

- [ ] **CORS設定更新の確認**
  - VoiceDrive側のCORS設定に本番ドメインが追加済み
  - `https://medical-staff-system.example.com`
  - `https://staging.medical-staff-system.example.com`

### ドキュメント確認

- [ ] **VoiceDrive提供資料の確認**
  - `hr-announcements.routes.ts` 実装コード ✅
  - `hr-announcements.ts` 型定義 ✅
  - `server.ts` サーバー設定 ✅
  - `voicedrive-stats-webhook-spec-v1.0.0.md` 仕様書 ✅

- [ ] **当チーム作成資料の確認**
  - `mcp-shared/interfaces/hr-announcement-api.interface.ts` ✅
  - `docs/Phase7_人事お知らせ統合実装計画.md` ✅
  - `mcp-shared/lightsail-integration-master-plan-20250920.md` ✅

### 開発環境セットアップ

- [ ] **環境変数の設定**
  - `.env.development` に開発環境用設定追加
  - `.env.production` に本番環境用設定追加（値は空でOK、後で追加）
  ```bash
  # VoiceDrive統合設定
  VOICEDRIVE_API_ENDPOINT=https://api.voicedrive.example.com
  VOICEDRIVE_API_TOKEN=<受領後設定>
  VOICEDRIVE_WEBHOOK_SECRET=<受領後設定>
  VOICEDRIVE_WEBHOOK_URL=https://medical-staff-system.example.com/api/voicedrive/stats
  ```

- [ ] **依存パッケージの確認**
  - `npm install` 実行済み
  - TypeScript型チェック成功（`npm run type-check`）
  - ビルド成功（`npm run build`）

### VoiceDriveチームとの調整

- [ ] **統合テスト日程の確定**
  - Phase 7開始後6日目を目安に調整
  - 所要時間: 2-3時間
  - 参加者: 両チーム開発担当者

- [ ] **コミュニケーションチャネルの確認**
  - Slack `#phase2-integration` チャネル参加済み
  - VoiceDriveチーム担当者の連絡先確認

---

## 2️⃣ 実装チェックリスト

### Day 1-2: お知らせ送信機能実装

#### サービスクラスの実装

- [ ] **`src/services/hrAnnouncementService.ts` 作成**
  - `sendToVoiceDrive()` メソッド実装
  - バリデーションロジック実装（title ≤500, content ≤5000）
  - カテゴリマッピング実装（`interview` → `MEETING`）
  - 優先度マッピング実装（`medium` → `NORMAL`）

- [ ] **エラーハンドリング実装**
  - ネットワークエラーのハンドリング
  - VoiceDriveのエラーレスポンス処理
  - リトライロジック（3回まで、指数バックオフ）

- [ ] **ロギング実装**
  - 送信前ログ（お知らせID、タイトル、対象）
  - 送信成功ログ（VoiceDrive ID、配信予定数）
  - エラーログ（エラーコード、メッセージ）

#### API Routeの実装

- [ ] **`src/app/api/hr-announcements/send/route.ts` 作成**
  - POST エンドポイント実装
  - 認証ミドルウェア適用
  - 権限チェック（管理者・人事部門のみ）

- [ ] **リクエストバリデーション**
  - Zod スキーマ作成
  - バリデーションエラーの適切なレスポンス

#### UIコンポーネントの実装

- [ ] **お知らせ作成フォーム作成**
  - タイトル入力（500文字制限）
  - 本文入力（5000文字制限）
  - カテゴリ選択
  - 優先度選択
  - 配信対象選択（全員/部門別/個別/役職別）

- [ ] **アクションボタン設定UI**
  - アクションボタン有無の選択
  - ボタンタイプ選択
  - ボタンラベル入力
  - 設定内容のプレビュー

- [ ] **送信確認ダイアログ**
  - 送信内容の最終確認画面
  - 配信対象の表示
  - 送信ボタン

#### 単体テストの作成

- [ ] **`__tests__/services/hrAnnouncementService.test.ts`**
  - バリデーションテスト（文字数制限）
  - マッピングテスト（カテゴリ、優先度）
  - エラーハンドリングテスト
  - リトライロジックテスト

---

### Day 3: 統計受信Webhook実装

#### API Routeの実装

- [ ] **`src/app/api/voicedrive/stats/route.ts` 作成**
  - POST エンドポイント実装
  - HMAC-SHA256署名検証実装
  - タイムスタンプ検証（5分以内）

- [ ] **署名検証ロジック**
  ```typescript
  const computedSignature = crypto
    .createHmac('sha256', VOICEDRIVE_WEBHOOK_SECRET)
    .update(JSON.stringify(payload))
    .digest('hex');

  if (computedSignature !== receivedSignature) {
    return Response.json({ success: false, error: 'Invalid signature' }, { status: 403 });
  }
  ```

- [ ] **ペイロード検証**
  - イベントタイプ検証（`stats.updated`, `stats.hourly`, `stats.daily`）
  - 必須フィールドの存在確認
  - データ型の検証

#### データベース保存処理

- [ ] **統計データの保存**
  - `announcement_stats` テーブルに保存
  - `announcement_stats_by_department` テーブルに保存
  - トランザクション処理

- [ ] **エラーハンドリング**
  - DB接続エラー
  - 重複データの処理
  - ログ記録

#### セキュリティ設定

- [ ] **IPホワイトリスト設定**
  - VoiceDrive IPアドレスのみ許可
  - ファイアウォールルール設定

- [ ] **レート制限設定**
  - 20 req/sec の制限設定
  - 制限超過時の適切なレスポンス（429 Too Many Requests）

#### 単体テストの作成

- [ ] **`__tests__/api/voicedrive/stats/route.test.ts`**
  - 署名検証テスト（正常、不正）
  - ペイロード検証テスト
  - DB保存テスト
  - エラーハンドリングテスト

---

### Day 4-5: ダッシュボード実装

#### 統計表示画面の作成

- [ ] **`src/app/hr-announcements/[id]/stats/page.tsx`**
  - 配信数の表示
  - アクション数の表示
  - 完了数の表示
  - リアルタイム更新（SWR使用）

- [ ] **部門別集計グラフ**
  - Chart.js / Recharts 導入
  - 部門別アクション数の棒グラフ
  - 時系列推移の折れ線グラフ

- [ ] **詳細統計情報**
  - 閲覧数（viewCount）
  - ユニーク閲覧者数（uniqueViewers）
  - 平均閲覧時間（averageReadTime）

#### 一覧画面への統計表示

- [ ] **お知らせ一覧画面に統計サマリー追加**
  - 配信数バッジ
  - アクション率の表示
  - 完了率の表示

#### APIエンドポイントの作成

- [ ] **`src/app/api/hr-announcements/[id]/stats/route.ts`**
  - GET エンドポイント（統計取得）
  - リアルタイム統計の取得
  - 部門別集計の取得

---

### Day 6: 統合テスト

#### ローカル環境でのテスト

- [ ] **ngrok セットアップ**
  ```bash
  ngrok http 3000
  ```
  - Webhook URLをVoiceDriveチームに共有

- [ ] **お知らせ送信テスト**
  - 全カテゴリでの送信テスト（announcement, interview, training, survey, other）
  - 全優先度での送信テスト（low, medium, high）
  - 全配信対象での送信テスト（all, departments, individuals, positions）

- [ ] **Webhook受信テスト**
  - リアルタイム統計受信テスト（`stats.updated`）
  - 1時間ごと統計受信テスト（`stats.hourly`）
  - 日次統計受信テスト（`stats.daily`）

#### VoiceDriveチームとの統合テスト

- [ ] **正常系テスト**
  - お知らせ送信 → VoiceDriveで受信確認
  - VoiceDriveで統計生成 → 職員カルテで受信確認
  - ダッシュボードで統計表示確認

- [ ] **エラーケーステスト**
  - バリデーションエラー（title 501文字）
  - 認証エラー（無効なトークン）
  - システムエラーヘッダー欠落（`X-Source-System`なし）
  - Webhook署名検証エラー

- [ ] **パフォーマンステスト**
  - レスポンスタイム計測（<500ms）
  - 大量配信テスト（1000人以上）
  - Webhookバースト送信テスト

---

### Day 7: 本番デプロイ準備

#### セキュリティ確認

- [ ] **環境変数の確認**
  - `.env.production` に全ての値が設定済み
  - 秘密鍵が漏洩していないか確認
  - GitHub Secretsに登録済み

- [ ] **HTTPS確認**
  - 本番環境がHTTPSで稼働
  - SSL証明書が有効

- [ ] **CORS設定確認**
  - 本番ドメインが許可リストに含まれている
  - 不要なドメインが含まれていない

#### ドキュメント整備

- [ ] **実装完了報告書の作成**
  - 実装内容のサマリー
  - テスト結果
  - 既知の問題点

- [ ] **運用手順書の作成**
  - お知らせ送信手順
  - エラー発生時の対処方法
  - モニタリング方法

- [ ] **職員向けマニュアルの作成**
  - お知らせ作成方法
  - 統計の見方
  - よくある質問（FAQ）

---

## 3️⃣ VoiceDrive連携チェックリスト

### Phase 7開始前

- [ ] **キックオフミーティング実施**
  - Phase 7開始日の確定
  - 実装スケジュールの共有
  - 統合テスト日程の確定

- [ ] **認証情報の発行依頼**
  - API Token発行依頼
  - Webhook Secret発行依頼
  - セキュアな共有方法の確認

- [ ] **CORS設定更新依頼**
  - 本番ドメインの追加依頼
  - Stagingドメインの追加依頼

- [ ] **IPアドレスリスト提供依頼**
  - Production環境IP
  - Staging環境IP

### Phase 7実装中

- [ ] **進捗報告（毎日）**
  - Slackで進捗状況を共有
  - 問題が発生した場合は即座に報告

- [ ] **質問事項の確認**
  - 実装中の疑問点をリスト化
  - VoiceDriveチームに確認

### Phase 7完了前

- [ ] **統合テスト実施**
  - テスト日程の最終確認
  - テストケースの共有
  - テスト実施

- [ ] **本番デプロイ日程の調整**
  - デプロイ日時の確定
  - メンテナンス告知の確認
  - ロールバック手順の確認

---

## 4️⃣ 完了確認チェックリスト

### 単体テスト

- [ ] **テストカバレッジ確認**
  - カバレッジ ≥ 80%
  - 重要な関数は100%カバー

- [ ] **全テスト成功**
  ```bash
  npm test -- --testPathPattern=hrAnnouncement
  ```
  - サービスクラステスト: 100%成功
  - APIルートテスト: 100%成功
  - Webhookテスト: 100%成功

### 統合テスト

- [ ] **E2Eテスト成功**
  - お知らせ作成 → 送信 → 統計受信 → 表示

- [ ] **VoiceDriveとの統合テスト成功**
  - 全テストケース成功
  - パフォーマンス基準達成（<500ms）

### セキュリティ確認

- [ ] **脆弱性スキャン実施**
  ```bash
  npm audit
  ```
  - Critical/High の脆弱性なし

- [ ] **認証・認可の確認**
  - 管理者以外はお知らせ送信不可
  - Webhook署名検証が動作

- [ ] **レート制限の確認**
  - 100 req/min 制限が動作（お知らせ送信）
  - 20 req/sec 制限が動作（Webhook）

### パフォーマンス確認

- [ ] **レスポンスタイム計測**
  - お知らせ送信: <500ms
  - Webhook受信: <200ms
  - 統計取得: <300ms

- [ ] **負荷テスト実施**
  - 1000人配信でエラーなし
  - Webhook 100件/秒でエラーなし

---

## 5️⃣ デプロイチェックリスト

### 本番環境準備

- [ ] **環境変数の設定**
  - Vercel環境変数に全て設定済み
  - 値が正しいか最終確認

- [ ] **データベース確認**
  - テーブル作成済み
  - インデックス設定済み
  - バックアップ設定済み

- [ ] **監視設定**
  - Vercel Analytics設定
  - エラーログ監視（Sentry等）
  - Webhook失敗時のアラート設定

### デプロイ実行

- [ ] **Stagingデプロイ**
  ```bash
  vercel deploy --env=staging
  ```
  - Staging環境で動作確認
  - VoiceDriveと連携確認

- [ ] **Productionデプロイ**
  ```bash
  vercel deploy --prod
  ```
  - 本番環境デプロイ
  - スモークテスト実施

### デプロイ後確認

- [ ] **動作確認**
  - お知らせ送信機能の動作確認
  - Webhook受信の動作確認
  - ダッシュボード表示の確認

- [ ] **モニタリング開始**
  - エラーログ監視
  - レスポンスタイム監視
  - Webhook受信率監視

- [ ] **VoiceDriveチームへの完了報告**
  - デプロイ完了の報告
  - 動作確認結果の共有
  - 今後の運用方針の確認

---

## 6️⃣ トラブルシューティング

### よくある問題と対処法

#### お知らせ送信が失敗する

- **症状**: 401 Unauthorized
- **原因**: API Tokenが無効
- **対処**: 環境変数を確認、VoiceDriveチームに再発行依頼

- **症状**: 403 Forbidden
- **原因**: `X-Source-System` ヘッダーが欠落
- **対処**: リクエストヘッダーに `X-Source-System: medical-staff-system` を追加

#### Webhook受信が失敗する

- **症状**: 403 Invalid signature
- **原因**: Webhook Secretが間違っている
- **対処**: 環境変数を確認、署名検証ロジックをデバッグ

- **症状**: Webhookが届かない
- **原因**: ファイアウォールでブロックされている
- **対処**: VoiceDrive IPアドレスをホワイトリストに追加

#### パフォーマンスが遅い

- **症状**: レスポンスタイムが500ms超過
- **原因**: DB接続が遅い、VoiceDrive APIが遅い
- **対処**: DB接続プールの設定確認、VoiceDriveチームに確認

---

## 7️⃣ 成功基準

### Phase 7完了と認められる条件

- ✅ 全ての単体テストが成功（カバレッジ ≥ 80%）
- ✅ VoiceDriveとの統合テストが成功（全テストケース成功）
- ✅ パフォーマンス基準達成（<500ms）
- ✅ セキュリティ確認完了（脆弱性なし、認証動作）
- ✅ 本番環境デプロイ成功
- ✅ VoiceDriveチームからの承認

### KPI（運用開始後）

- **Webhook成功率**: ≥ 99%
- **お知らせ送信成功率**: ≥ 99.5%
- **平均レスポンスタイム**: <500ms
- **ダウンタイム**: 月間99.9%稼働

---

## 📊 進捗管理

### チェックリスト進捗

- **事前準備**: 0/XX項目完了
- **実装**: 0/XX項目完了
- **VoiceDrive連携**: 0/XX項目完了
- **完了確認**: 0/XX項目完了
- **デプロイ**: 0/XX項目完了

**全体進捗**: 0% (0/XX項目)

### タイムライン

```
Week -1: 事前準備（Phase 6完了待ち）
Week 0, Day 1-2: お知らせ送信機能実装
Week 0, Day 3: 統計受信Webhook実装
Week 0, Day 4-5: ダッシュボード実装
Week 0, Day 6: 統合テスト
Week 0, Day 7: 本番デプロイ準備
Week 1: デプロイ・運用開始
```

---

## 📝 メモ

**Phase 7開始前の最終確認事項**：
1. Phase 6（共通DB構築）の完全な完了
2. VoiceDriveからの認証情報受領
3. VoiceDriveとの統合テスト日程確定

**Phase 7実装中の注意点**：
1. 毎日の進捗報告をSlackで共有
2. 問題が発生したら即座にエスカレーション
3. テストカバレッジを常に80%以上に保つ

**Phase 7完了後の運用**：
1. モニタリングダッシュボードで毎日確認
2. Webhook失敗時のアラート対応手順を整備
3. 月次レポートをVoiceDriveチームと共有

---

**作成者：職員カルテシステム開発チーム**
**作成日：2025年10月7日**
**最終更新：2025年10月7日**
**ステータス：Phase 6完了待ち**
