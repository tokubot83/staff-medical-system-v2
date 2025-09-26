# Phase 3 共通DB構築後 作業再開指示書

**文書番号**: RESTART-PHASE3-001
**発行日**: 2025年10月2日
**対象**: 医療システム開発チーム
**優先度**: 高

---

## 作業再開トリガー

以下の条件がすべて満たされた時点で、Phase 3の作業を再開してください。

### ✅ 再開条件チェックリスト

- [ ] 共通データベースの構築完了通知を受領
- [ ] DB接続情報（ホスト、ポート、認証情報）を取得
- [ ] VoiceDriveチームからの再開依頼書を受領
- [ ] テスト用データの準備完了確認
- [ ] 本番APIエンドポイントURLの確定

---

## 1. 作業再開時の初期確認事項

### 1.1 環境設定の更新

```bash
# 1. 環境変数ファイルの更新
cp .env.production .env.production.backup
vi .env.production

# 2. 以下の値を実際の値に更新
DB_HOST=[提供されたホスト]
DB_PORT=[提供されたポート]
DB_NAME=[提供されたDB名]
DB_USER=[提供されたユーザー]
DB_PASSWORD=[提供されたパスワード]
MEDICAL_API_BASE_URL=[実際のAPIURL]
VOICEDRIVE_WEBHOOK_URL=[実際のWebhook URL]

# 3. 接続テスト
npm run test:db:connection
```

### 1.2 依存関係の確認

```bash
# パッケージの更新確認
npm outdated
npm update

# TypeScript型定義の確認
npm run type-check
```

---

## 2. 再開作業フロー

### Phase 1: 接続確認（所要時間: 2時間）

| 順序 | タスク | 担当 | 完了確認 |
|-----|-------|------|----------|
| 1 | DB接続テスト | DBチーム | [ ] |
| 2 | API疎通確認 | APIチーム | [ ] |
| 3 | SSL証明書検証 | セキュリティ | [ ] |
| 4 | Webhook送信テスト | 統合チーム | [ ] |

### Phase 2: データ検証（所要時間: 4時間）

| 順序 | タスク | 担当 | 完了確認 |
|-----|-------|------|----------|
| 5 | 小原病院データ確認 | 業務チーム | [ ] |
| 6 | 立神病院データ確認 | 業務チーム | [ ] |
| 7 | 権限レベル計算検証 | 開発チーム | [ ] |
| 8 | 施設間異動シミュレーション | QAチーム | [ ] |

### Phase 3: 統合テスト（所要時間: 4時間）

| 順序 | タスク | 担当 | 完了確認 |
|-----|-------|------|----------|
| 9 | 実データでの権限計算 | QAチーム | [ ] |
| 10 | 100件同時処理テスト | パフォーマンス | [ ] |
| 11 | Webhook通知確認 | 統合チーム | [ ] |
| 12 | エラーハンドリング検証 | QAチーム | [ ] |

---

## 3. 実行コマンド一覧

### 3.1 テスト実行

```bash
# 単体テスト（既存）
npm test

# 統合テスト（実環境）
node tests/integration/phase3-integration-test.js

# 本番環境接続テスト
node tests/production/production-connection-test.js

# 施設別権限テストのみ
npm test -- --testNamePattern="施設別権限"
```

### 3.2 API動作確認

```bash
# ヘルスチェック
curl https://[API_URL]/health

# 権限計算テスト（小原病院）
curl -X POST https://[API_URL]/api/v1/calculate-level \
  -H "Authorization: Bearer [TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{"staffId":"OBARA_001","facilityId":"obara-hospital"}'

# 権限計算テスト（立神病院・統括主任）
curl -X POST https://[API_URL]/api/v1/calculate-level \
  -H "Authorization: Bearer [TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{"staffId":"TATE_002","facilityId":"tategami-rehabilitation"}'
```

---

## 4. 重点確認項目

### 4.1 統括主任レベル7の動作確認

```javascript
// 必須テストケース
const testCase = {
  staffId: "TATE_002",
  facilityId: "tategami-rehabilitation",
  position: "統括主任",
  expectedLevel: 7  // 医療チーム承認済み
};

// 検証コード
const result = await calculateLevel(testCase);
assert(result.accountLevel === 7, "統括主任レベルが不正");
```

### 4.2 施設間異動の検証

```javascript
// 薬剤部長→薬局長のケース
const transfer = {
  fromFacility: "obara-hospital",
  toFacility: "tategami-rehabilitation",
  fromPosition: "薬剤部長",
  expectedFromLevel: 10,
  expectedToLevel: 8  // 特殊調整適用
};
```

---

## 5. トラブルシューティング

### 5.1 よくある問題と対処

| 問題 | 原因 | 対処法 |
|------|------|--------|
| DB接続エラー | 認証情報誤り | .env.productionを確認 |
| API 404エラー | URL誤り | エンドポイントを確認 |
| SSL証明書エラー | 証明書期限切れ | インフラチームに連絡 |
| Webhook失敗 | シークレット不一致 | VoiceDriveと確認 |

### 5.2 エスカレーション

```
レベル1（開発チーム内）: 15分以内に解決
レベル2（チーム間連携）: 1時間以内に解決
レベル3（PM/管理者）: 即座にエスカレーション

緊急連絡先:
- 開発リーダー: [連絡先]
- PM: [連絡先]
- インフラ: [連絡先]
```

---

## 6. 完了確認

### 6.1 作業完了基準

すべて「はい」になったら作業完了です。

- [ ] DB接続が正常に動作している
- [ ] APIがすべて200 OKを返している
- [ ] 統括主任レベル7が正しく計算される
- [ ] Webhookが正常に送信される
- [ ] パフォーマンステストが基準値内
- [ ] エラーログにCriticalがない

### 6.2 完了報告

```markdown
報告先: プロジェクトマネージャー、VoiceDriveチーム
報告方法: Slack #phase3-integration
報告内容:
1. 全テスト結果（成功率）
2. パフォーマンス測定値
3. 検出された問題と対処
4. 次ステップの推奨事項
```

---

## 7. 関連文書

- `Phase3_実装作業完了報告書_FINAL.md`
- `Phase3_VoiceDrive作業再開依頼書.md`
- `.env.production`（環境設定）
- `tests/production/production-connection-test.js`（テストスクリプト）

---

## 8. 承認

### 作成者
- 氏名: 医療システム開発チーム
- 日付: 2025年10月2日

### 承認者
- [ ] 開発チームリーダー
- [ ] プロジェクトマネージャー
- [ ] 品質管理責任者

---

**注意事項**:
- 本書は共通DB構築完了後に使用してください
- 作業開始前に最新版であることを確認してください
- 不明点は即座に確認し、推測で作業しないこと

---

文書ID: RESTART-PHASE3-001
最終更新: 2025年10月2日