# Phase 3 共通DB構築後チェックリスト

**文書番号**: CHECKLIST-DB-001
**作成日**: 2025年10月2日
**対象**: 医療システムチーム / VoiceDriveチーム

---

## 📋 作業開始前チェックリスト

### 1. 環境準備確認

- [ ] **共通DB構築完了通知を受領**
- [ ] **DB接続情報を取得**
  - [ ] ホスト名/IPアドレス
  - [ ] ポート番号
  - [ ] データベース名
  - [ ] ユーザー名
  - [ ] パスワード
  - [ ] SSL証明書（必要な場合）

- [ ] **本番APIエンドポイントURLを確認**
  - [ ] 医療システムAPI URL
  - [ ] VoiceDrive Webhook URL

- [ ] **認証情報を確認**
  - [ ] Bearer Token（本番用）
  - [ ] Webhook署名シークレット

---

## ⚙️ 環境設定チェックリスト

### 2. 設定ファイル更新

- [ ] **.env.productionをバックアップ**
  ```bash
  cp .env.production .env.production.backup
  ```

- [ ] **環境変数を更新**
  ```env
  DB_HOST=[実際のホスト]
  DB_PORT=[実際のポート]
  DB_NAME=[実際のDB名]
  DB_USER=[実際のユーザー]
  DB_PASSWORD=[実際のパスワード]
  MEDICAL_API_BASE_URL=[実際のAPIURL]
  VOICEDRIVE_WEBHOOK_URL=[実際のWebhookURL]
  ```

- [ ] **パッケージを最新化**
  ```bash
  npm outdated
  npm update
  ```

---

## 🧪 テスト実行チェックリスト

### 3. Phase 1: 接続確認（2時間）

- [ ] **DB接続テスト**
  ```bash
  npm run test:db:connection
  ```

- [ ] **API疎通確認**
  ```bash
  curl https://[API_URL]/health
  ```

- [ ] **SSL証明書検証**
  ```bash
  openssl s_client -connect [API_URL]:443 -showcerts
  ```

- [ ] **Webhook送信テスト**
  ```bash
  node tests/webhook-test.js
  ```

### 4. Phase 2: データ検証（4時間）

- [ ] **小原病院データ確認**
  - [ ] 職員マスタ存在確認
  - [ ] 役職マッピング確認
  - [ ] 権限レベル計算確認

- [ ] **立神病院データ確認**
  - [ ] 職員マスタ存在確認
  - [ ] 統括主任レベル7確認 ⚠️ **重要**
  - [ ] 役職マッピング確認

- [ ] **施設間異動シミュレーション**
  - [ ] 小原→立神の権限変換
  - [ ] 立神→小原の権限変換

### 5. Phase 3: 統合テスト（4時間）

- [ ] **統合テスト実行**
  ```bash
  node tests/integration/phase3-integration-test.js
  ```

- [ ] **本番環境接続テスト**
  ```bash
  node tests/production/production-connection-test.js
  ```

- [ ] **負荷テスト（100件同時処理）**
  ```bash
  npm run test:load
  ```

- [ ] **パフォーマンス測定**
  - [ ] 平均応答時間 < 500ms
  - [ ] 最大応答時間 < 1000ms
  - [ ] エラー率 < 0.1%

---

## 🔍 重点確認項目

### 6. 機能別確認

#### 統括主任レベル7（最重要）
- [ ] スタッフID: TATE_002でテスト
- [ ] 期待値: Level 7
- [ ] 計算式: 基本6 + 調整1 = 7

#### API動作確認
- [ ] POST `/api/v1/calculate-level`
- [ ] GET `/api/v1/facilities/{id}/position-mapping`

#### Webhook通知
- [ ] staff.created イベント
- [ ] staff.updated イベント
- [ ] staff.transferred イベント
- [ ] staff.deleted イベント

---

## 📊 品質確認チェックリスト

### 7. 品質指標確認

- [ ] **テスト成功率 > 95%**
- [ ] **コードカバレッジ > 90%**
- [ ] **静的解析エラー = 0**
- [ ] **TypeScript型エラー = 0**

### 8. セキュリティ確認

- [ ] **Bearer Token認証が有効**
- [ ] **SSL/TLS接続が正常**
- [ ] **Webhook署名検証が有効**
- [ ] **環境変数に機密情報がハードコードされていない**

---

## 📝 ドキュメント確認

### 9. ドキュメント完備確認

- [ ] **実装完了報告書が最新**
- [ ] **API仕様書が最新**
- [ ] **テスト結果が記録済み**
- [ ] **運用手順書が完成**

---

## ✅ 最終確認

### 10. Go/No-Go判定

- [ ] **全テストが成功**
- [ ] **パフォーマンス基準を満たす**
- [ ] **セキュリティ要件を満たす**
- [ ] **VoiceDriveチームとの連携確認完了**
- [ ] **本番デプロイの準備完了**

---

## 🚨 問題発生時の対応

### エスカレーションパス

1. **レベル1（15分以内）**
   - 各チーム内で解決を試みる
   - Slack: #phase3-integration

2. **レベル2（1時間以内）**
   - チーム間で協力して解決
   - チームリーダーに報告

3. **レベル3（即座）**
   - プロジェクトマネージャーにエスカレーション
   - 緊急会議を招集

### よくある問題と対処法

| 問題 | 対処法 |
|------|--------|
| DB接続エラー | .env.productionの認証情報を確認 |
| API 404エラー | エンドポイントURLを確認 |
| SSL証明書エラー | インフラチームに連絡 |
| Webhook失敗 | シークレットをVoiceDriveと確認 |
| 権限計算エラー | facilityIdの形式を確認 |

---

## 📞 連絡先

### 医療システムチーム
- Slack: #medical-team
- Email: medical-dev@example.com

### VoiceDriveチーム
- Slack: #voicedrive-team
- Email: voicedrive@example.com

### インフラチーム
- Slack: #infrastructure
- 緊急: [電話番号]

---

## 署名欄

### 確認者

- [ ] 医療システムチーム確認済み
  - 確認者: _____________
  - 日付: _____________

- [ ] VoiceDriveチーム確認済み
  - 確認者: _____________
  - 日付: _____________

- [ ] プロジェクトマネージャー承認
  - 承認者: _____________
  - 日付: _____________

---

**注意**: このチェックリストは共通DB構築完了後に使用してください。
すべての項目にチェックが入るまで、本番デプロイは行わないでください。