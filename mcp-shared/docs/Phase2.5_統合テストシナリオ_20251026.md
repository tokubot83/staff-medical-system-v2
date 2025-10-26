# Phase 2.5 統合テストシナリオ

**文書番号**: MED-TEST-2025-1026-001
**作成日**: 2025年10月26日
**作成者**: 医療システムチーム
**対象**: VoiceDriveチーム + 医療システムチーム
**テスト期間**: Week 4（2025年11月18日〜22日）

---

## 📋 目次

1. [テスト環境準備](#テスト環境準備)
2. [事前準備チェックリスト](#事前準備チェックリスト)
3. [テストシナリオ一覧](#テストシナリオ一覧)
4. [詳細テストケース](#詳細テストケース)
5. [パフォーマンステスト](#パフォーマンステスト)
6. [エラーシナリオテスト](#エラーシナリオテスト)
7. [合格基準](#合格基準)

---

## テスト環境準備

### 医療システム側環境

```bash
# ステージング環境
URL: https://staging-medical.example.com
Database: staging_staff_medical_system
Status: ✅ 準備完了

# APIエンドポイント
API 1: GET /api/integration/webhook-stats
API 2: GET /api/interviews/completion-stats

# 認証
Authorization: Bearer vd-staging-api-key-a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

### VoiceDrive側環境

```bash
# ステージング環境
URL: https://staging-voicedrive.example.com
Page: /admin/system-monitor

# APIクライアント
MedicalSystemClient.ts: ✅ 実装完了
MonitoringService.ts: ✅ 実装完了
```

### テストデータ

```bash
# 医療システム側で準備済み
Webhook送信ログ: 100件（成功95件、失敗3件、タイムアウト2件）
面談記録: 50件（完了45件、予定2件、キャンセル1件、無断欠席2件）
リトライキュー: 5件（PENDING 3件、PROCESSING 1件、COMPLETED 1件）

# 生成コマンド
npx ts-node tests/integration/phase2.5-seed-test-data.ts
```

---

## 事前準備チェックリスト

### 医療システムチーム

- [ ] ステージング環境にPhase 2.5をデプロイ
- [ ] データベースマイグレーション実行
- [ ] テストデータ生成（100件のWebhookログ、50件の面談記録）
- [ ] Cron Job（リトライワーカー）設定
- [ ] APIキーをVoiceDriveチームに共有
- [ ] ヘルスチェックエンドポイント確認（`GET /api/health`）
- [ ] ログ監視ツール準備

### VoiceDriveチーム

- [ ] ステージング環境にPhase 2.5をデプロイ
- [ ] 医療システムAPIキーを環境変数に設定
- [ ] MedicalSystemClientの接続確認
- [ ] SystemMonitorPageにアクセス可能確認
- [ ] エラーログ監視準備

---

## テストシナリオ一覧

### フェーズ1: 接続確認（Day 1, 11/18）

| # | シナリオ | 担当 | 所要時間 | ステータス |
|---|---|---|---|---|
| 1.1 | ヘルスチェックAPI接続確認 | VoiceDrive | 10分 | - |
| 1.2 | API 1（Webhook統計）初回接続 | VoiceDrive | 15分 | - |
| 1.3 | API 2（面談統計）初回接続 | VoiceDrive | 15分 | - |
| 1.4 | レスポンス形式確認 | 両チーム | 20分 | - |

### フェーズ2: 機能テスト（Day 2-3, 11/19-20）

| # | シナリオ | 担当 | 所要時間 | ステータス |
|---|---|---|---|---|
| 2.1 | Webhook送信統計の精度確認 | 両チーム | 30分 | - |
| 2.2 | 面談完了統計の精度確認 | 両チーム | 30分 | - |
| 2.3 | データ欠損検出シナリオ | 両チーム | 45分 | - |
| 2.4 | 面談実施率計算確認 | 両チーム | 30分 | - |
| 2.5 | イベントタイプ別集計確認 | 両チーム | 20分 | - |

### フェーズ3: パフォーマンステスト（Day 3, 11/20）

| # | シナリオ | 担当 | 所要時間 | ステータス |
|---|---|---|---|---|
| 3.1 | API 1レスポンス時間測定 | 両チーム | 20分 | - |
| 3.2 | API 2レスポンス時間測定 | 両チーム | 20分 | - |
| 3.3 | 負荷テスト（100リクエスト/分） | 両チーム | 30分 | - |

### フェーズ4: エラーシナリオテスト（Day 4, 11/21）

| # | シナリオ | 担当 | 所要時間 | ステータス |
|---|---|---|---|---|
| 4.1 | 認証エラー（401）確認 | VoiceDrive | 15分 | - |
| 4.2 | レート制限（429）確認 | VoiceDrive | 20分 | - |
| 4.3 | 医療システムダウン時の挙動 | VoiceDrive | 30分 | - |
| 4.4 | タイムアウトエラー確認 | VoiceDrive | 20分 | - |

### フェーズ5: UI統合テスト（Day 4-5, 11/21-22）

| # | シナリオ | 担当 | 所要時間 | ステータス |
|---|---|---|---|---|
| 5.1 | SystemMonitorPageでの統計表示確認 | VoiceDrive | 30分 | - |
| 5.2 | データ欠損アラート表示確認 | VoiceDrive | 20分 | - |
| 5.3 | 面談実施率の可視化確認 | VoiceDrive | 20分 | - |
| 5.4 | リアルタイム更新確認 | VoiceDrive | 15分 | - |

---

## 詳細テストケース

### テストケース 1.1: ヘルスチェックAPI接続確認

**目的**: VoiceDriveから医療システムのヘルスチェックAPIに接続できることを確認

**手順**:
1. VoiceDrive側で `MedicalSystemClient.healthCheck()` を実行
2. レスポンスが `true` であることを確認

**期待結果**:
```typescript
const isHealthy = await MedicalSystemClient.healthCheck();
console.log(isHealthy); // true
```

**確認ポイント**:
- HTTPステータス: 200 OK
- レスポンス時間: < 1000ms
- エラーログなし

---

### テストケース 2.1: Webhook送信統計の精度確認

**目的**: API 1が正確な統計データを返すことを確認

**前提条件**:
- テストデータ100件が登録済み
  - 成功: 95件
  - 失敗: 3件
  - タイムアウト: 2件

**手順**:
1. VoiceDrive側で `MedicalSystemClient.getWebhookStats()` を実行
2. レスポンスのデータを確認

**期待結果**:
```json
{
  "success": true,
  "data": {
    "sent24h": 100,
    "succeeded": 95,
    "failed": 3,
    "timeout": 2,
    "retried": 5,
    "byEventType": {
      "employee.created": {
        "sent": 50,
        "succeeded": 50,
        "failed": 0
      },
      "interview.completed": {
        "sent": 50,
        "succeeded": 45,
        "failed": 3
      }
    },
    "queueStatus": {
      "pending": 3,
      "processing": 1,
      "completed": 1,
      "failed": 0
    }
  }
}
```

**確認ポイント**:
- 総送信件数が100件
- 成功率が95%
- イベントタイプ別集計が正確
- リトライキューの状態が正確

---

### テストケース 2.2: 面談完了統計の精度確認

**目的**: API 2が正確な統計データを返すことを確認

**前提条件**:
- テストデータ50件が登録済み
  - 完了: 45件（90%）
  - 予定: 2件
  - キャンセル: 1件
  - 無断欠席: 2件（4%）

**手順**:
1. VoiceDrive側で `MedicalSystemClient.getInterviewStats()` を実行
2. レスポンスのデータを確認

**期待結果**:
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalScheduled": 50,
      "completed": 45,
      "scheduled": 2,
      "cancelled": 1,
      "noShow": 2,
      "completionRate": 90.0,
      "noShowRate": 4.0,
      "avgDurationMinutes": 48
    },
    "byType": {
      "regular": {
        "total": 31,
        "completed": 28,
        "completionRate": 90.3
      },
      "support": {
        "total": 19,
        "completed": 17,
        "completionRate": 89.5
      }
    },
    "voicedrive": {
      "syncedCount": 50,
      "syncRate": 100.0
    }
  }
}
```

**確認ポイント**:
- 完了率が90.0%
- 無断欠席率が4.0%
- 面談タイプ別集計が正確
- VoiceDrive連携率が100%

---

### テストケース 2.3: データ欠損検出シナリオ

**目的**: Webhook送信と受信の差分を正しく検出できることを確認

**シナリオ1: 健全（差分5件以内）**

**手順**:
1. 医療システム: Webhook送信100件
2. VoiceDrive: Webhook受信98件
3. VoiceDrive SystemMonitorPageで差分を確認

**期待結果**:
```
医療システム送信: 100件
VoiceDrive受信: 98件
差分: 2件
ステータス: 🟢 健全（緑色表示）
```

---

**シナリオ2: 警告（差分6-20件）**

**手順**:
1. 医療システム: Webhook送信100件
2. VoiceDrive: Webhook受信85件
3. VoiceDrive SystemMonitorPageで差分を確認

**期待結果**:
```
医療システム送信: 100件
VoiceDrive受信: 85件
差分: 15件
ステータス: 🟡 警告（黄色アラート表示）
アラートメッセージ: ⚠️ データ欠損検出: 15件のWebhookが未受信です
```

---

**シナリオ3: 深刻（差分21件以上）**

**手順**:
1. 医療システム: Webhook送信100件
2. VoiceDrive: Webhook受信70件
3. VoiceDrive SystemMonitorPageで差分を確認

**期待結果**:
```
医療システム送信: 100件
VoiceDrive受信: 70件
差分: 30件
ステータス: 🔴 深刻（赤色アラート表示）
アラートメッセージ: 🚨 重大なデータ欠損: 30件のWebhookが未受信です。至急確認が必要です。
```

---

## パフォーマンステスト

### 目標値

| 指標 | 目標値 | 測定方法 |
|---|---|---|
| API 1レスポンス時間 | < 300ms（95パーセンタイル） | 100回リクエストして測定 |
| API 2レスポンス時間 | < 300ms（95パーセンタイル） | 100回リクエストして測定 |
| レート制限 | 100 req/min/IP | 101リクエスト送信、101回目が429 |
| 同時接続数 | 10接続 | 10個の並列リクエスト |

### テストケース 3.1: API 1レスポンス時間測定

**手順**:
```bash
# 医療システム側でパフォーマンステスト実行
npx ts-node tests/integration/phase2.5-integration-test.ts

# または VoiceDrive側で測定
const startTime = Date.now();
await MedicalSystemClient.getWebhookStats();
const duration = Date.now() - startTime;
console.log(`API 1レスポンス時間: ${duration}ms`);
```

**合格基準**:
- 95パーセンタイル: < 300ms
- 平均: < 150ms

---

### テストケース 3.3: 負荷テスト（100リクエスト/分）

**手順**:
```typescript
// 100リクエストを1分間で送信
const results = [];
for (let i = 0; i < 100; i++) {
  const start = Date.now();
  const response = await MedicalSystemClient.getWebhookStats();
  const duration = Date.now() - start;
  results.push({ success: response.success, duration });
  await sleep(600); // 600ms待機（100 req/min = 600ms間隔）
}

// 結果集計
const successRate = results.filter(r => r.success).length / 100;
const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / 100;

console.log(`成功率: ${successRate * 100}%`);
console.log(`平均レスポンス時間: ${avgDuration}ms`);
```

**合格基準**:
- 成功率: 100%
- 平均レスポンス時間: < 150ms
- 429エラー: 0件

---

## エラーシナリオテスト

### テストケース 4.1: 認証エラー（401）確認

**目的**: 無効なAPIキーで401エラーが返ることを確認

**手順**:
```typescript
// 無効なAPIキーで接続
const response = await fetch('https://staging-medical.example.com/api/integration/webhook-stats', {
  headers: {
    'Authorization': 'Bearer invalid-api-key'
  }
});

console.log(response.status); // 401
const json = await response.json();
console.log(json);
```

**期待結果**:
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Missing or invalid authorization header"
  },
  "timestamp": "2025-11-18T10:00:00Z"
}
```

---

### テストケース 4.2: レート制限（429）確認

**目的**: 100リクエスト/分を超えると429エラーが返ることを確認

**手順**:
```typescript
// 101リクエストを短時間で送信
for (let i = 0; i < 101; i++) {
  const response = await fetch('https://staging-medical.example.com/api/integration/webhook-stats', {
    headers: {
      'Authorization': 'Bearer vd-staging-api-key-a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6'
    }
  });

  if (i === 100) {
    console.log(response.status); // 429
    const json = await response.json();
    console.log(json);
  }
}
```

**期待結果**:
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later."
  },
  "timestamp": "2025-11-18T10:00:00Z"
}
```

---

### テストケース 4.3: 医療システムダウン時の挙動

**目的**: 医療システムがダウンしてもVoiceDriveが正常動作することを確認

**手順**:
1. 医療システムのステージング環境を一時停止
2. VoiceDrive SystemMonitorPageにアクセス
3. エラーメッセージが表示されることを確認
4. VoiceDrive側のメトリクスは正常に表示されることを確認

**期待結果**:
- VoiceDriveのWebhook受信統計: 正常表示 ✅
- 医療システムのWebhook送信統計: エラーメッセージ表示 ⚠️
- ページ全体がクラッシュしない ✅

**エラーメッセージ例**:
```
⚠️ 医療システムに接続できませんでした。
VoiceDrive側の統計のみ表示しています。
```

---

## 合格基準

### 必須項目（すべて合格必須）

- [ ] API 1（Webhook送信統計）の接続成功率: 100%
- [ ] API 2（面談完了統計）の接続成功率: 100%
- [ ] レスポンス形式がVoiceDrive型定義に100%準拠
- [ ] データ欠損検出（差分5件）が正確に動作
- [ ] 面談実施率90%が正確に計算される
- [ ] 無断欠席率4%が正確に計算される
- [ ] API 1レスポンス時間: 95パーセンタイル < 300ms
- [ ] API 2レスポンス時間: 95パーセンタイル < 300ms
- [ ] 認証エラー（401）が正しく処理される
- [ ] レート制限（429）が正しく処理される

### 推奨項目（80%以上合格）

- [ ] 負荷テスト成功率: 100%
- [ ] エラーシナリオテスト合格率: 100%
- [ ] UI統合テスト合格率: 100%

---

## テスト結果記録

### テスト実施日: 2025年11月18日〜22日

| フェーズ | 合格/総数 | 成功率 | 備考 |
|---|---|---|---|
| フェーズ1: 接続確認 | - / 4 | - % | - |
| フェーズ2: 機能テスト | - / 5 | - % | - |
| フェーズ3: パフォーマンス | - / 3 | - % | - |
| フェーズ4: エラーシナリオ | - / 4 | - % | - |
| フェーズ5: UI統合 | - / 4 | - % | - |
| **総合** | **- / 20** | **- %** | **-** |

---

## 問題・課題トラッキング

| # | 発見日 | 問題内容 | 優先度 | ステータス | 担当 | 解決日 |
|---|---|---|---|---|---|---|
| - | - | - | - | - | - | - |

---

## 次のステップ

### テスト合格後

1. **本番環境デプロイ準備**（11/22）
   - [ ] 本番環境へのデプロイ計画確定
   - [ ] 本番APIキー発行
   - [ ] ロールバック手順確認

2. **本番環境デプロイ**（11/25-26）
   - [ ] 医療システム本番デプロイ
   - [ ] VoiceDrive本番デプロイ
   - [ ] 本番環境スモークテスト

3. **運用監視開始**（11/27〜）
   - [ ] データ欠損アラート監視開始
   - [ ] 面談実施率監視開始
   - [ ] Webhook送信成功率監視開始

---

**文書終了**

最終更新: 2025年10月26日
バージョン: 1.0
承認: 医療システムチーム・VoiceDriveチーム承認待ち
次回レビュー: 統合テスト完了後（11月22日）
