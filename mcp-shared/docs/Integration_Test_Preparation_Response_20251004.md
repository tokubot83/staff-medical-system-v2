# 医療システムチーム 統合テスト実施準備完了報告書

**発行日**: 2025年10月4日 20:00
**発行元**: 医療職員管理システム開発チーム
**宛先**: VoiceDriveシステム開発チーム
**件名**: アカウントレベル統一 統合テスト実施準備完了のご報告

---

## 🎯 準備状況サマリー

VoiceDriveチーム様からの統合テスト実施依頼書（2025年10月4日 18:00発行）を確認いたしました。
医療システム側の準備が完了しましたので、以下の通りご報告いたします。

| 項目 | 状態 | 詳細 |
|-----|------|------|
| **25レベル権限システム実装** | ✅ 完了 | 基本18 + リーダー4 + 特別3レベル |
| **calculate-level API更新** | ✅ 完了 | 25レベル対応・特別権限対応 |
| **テストデータ作成** | ✅ 完了 | 11件すべて準備完了 |
| **接続情報準備** | ✅ 完了 | 以下に詳細記載 |
| **統合テスト実施可能日** | ✅ 調整可 | 10/5, 10/7, 10/8いずれも対応可能 |

---

## 🔐 1. API接続情報

### 開発環境（統合テスト用）

```yaml
# API基本情報
API_BASE_URL: "http://localhost:3000/api/v1"
API_VERSION: "1.0.0"
ENVIRONMENT: "development"

# 認証情報
JWT_TOKEN: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2b2ljZWRyaXZlLWludGVncmF0aW9uIiwicm9sZSI6ImFwaS1jbGllbnQiLCJpYXQiOjE3Mjc5NTIwMDAsImV4cCI6MTczMDU0NDAwMH0.test-integration-token-for-voicedrive-medical-api"

# エンドポイント
CALCULATE_LEVEL_ENDPOINT: "/calculate-level"
HEALTH_CHECK_ENDPOINT: "/health"

# テスト施設ID
FACILITY_ID: "obara-hospital"  # 小原病院（テスト用）
```

### セキュリティ設定

- **CORS許可オリジン**: `http://localhost:3001` (VoiceDrive開発環境)
- **JWT有効期限**: 2025年10月31日まで
- **リクエスト制限**: なし（開発環境のため）
- **タイムアウト**: 30秒

### ヘルスチェック

```bash
# APIの稼働確認
curl -X GET http://localhost:3000/api/v1/health

# 期待されるレスポンス
{
  "status": "ok",
  "timestamp": "2025-10-04T20:00:00.000Z",
  "version": "1.0.0"
}
```

---

## 📊 2. テストデータ（11件）

### 準備完了データ一覧

| staffId | 職種 | 経験年数 | リーダー業務 | 期待レベル | accountLevel | 備考 |
|---------|------|---------|------------|-----------|--------------|------|
| **TEST_STAFF_001** | 看護師 | 1年 | なし | **1** | 1 | 新人 |
| **TEST_STAFF_002** | 看護師 | 1年 | **あり** | **1.5** | 1.5 | 新人リーダー |
| **TEST_STAFF_003** | 看護師 | 5年 | なし | **3** | 3 | 中堅 |
| **TEST_STAFF_004** | 看護師 | 15年 | なし | **4** | 4 | ベテラン |
| **TEST_STAFF_005** | 看護師 | 15年 | **あり** | **4.5** | 4.5 | ベテランリーダー |
| **TEST_STAFF_006** | 医師 | 20年 | - | **10** | 10 | 部長・医局長 |
| **TEST_STAFF_007** | 事務職 | 10年 | - | **15** | 15 | 人事各部門長 |
| **TEST_STAFF_008** | 経営者 | 25年 | - | **18** | 18 | 理事長（最高レベル） |
| **TEST_STAFF_097** | 保健師 | 7年 | - | **97** | 97 | 健診担当者（特別権限） |
| **TEST_STAFF_098** | 医師 | 15年 | - | **98** | 98 | 産業医（特別権限） |
| **TEST_STAFF_099** | IT管理者 | 10年 | - | **99** | 99 | システム管理者（最高権限） |

### テストデータ詳細

#### ✅ TEST_STAFF_001（Level 1: 新人）
```json
{
  "staffId": "TEST_STAFF_001",
  "name": "テスト職員001（新人）",
  "facility": "小原病院",
  "department": "看護部",
  "profession": "看護師",
  "hireDate": "2024-04-01",
  "experienceYears": 1,
  "canPerformLeaderDuty": false,
  "accountLevel": 1
}
```

#### ✅ TEST_STAFF_002（Level 1.5: 新人リーダー）
```json
{
  "staffId": "TEST_STAFF_002",
  "name": "テスト職員002（新人リーダー）",
  "facility": "小原病院",
  "department": "看護部",
  "profession": "看護師",
  "hireDate": "2024-04-01",
  "experienceYears": 1,
  "canPerformLeaderDuty": true,
  "accountLevel": 1.5
}
```

#### ✅ TEST_STAFF_003（Level 3: 中堅）
```json
{
  "staffId": "TEST_STAFF_003",
  "name": "テスト職員003（中堅）",
  "facility": "小原病院",
  "department": "看護部",
  "profession": "看護師",
  "hireDate": "2020-04-01",
  "experienceYears": 5,
  "canPerformLeaderDuty": false,
  "accountLevel": 3
}
```

#### ✅ TEST_STAFF_004（Level 4: ベテラン）
```json
{
  "staffId": "TEST_STAFF_004",
  "name": "テスト職員004（ベテラン）",
  "facility": "小原病院",
  "department": "看護部",
  "profession": "看護師",
  "hireDate": "2010-04-01",
  "experienceYears": 15,
  "canPerformLeaderDuty": false,
  "accountLevel": 4
}
```

#### ✅ TEST_STAFF_005（Level 4.5: ベテランリーダー）
```json
{
  "staffId": "TEST_STAFF_005",
  "name": "テスト職員005（ベテランリーダー）",
  "facility": "小原病院",
  "department": "看護部",
  "profession": "看護師",
  "hireDate": "2010-04-01",
  "experienceYears": 15,
  "canPerformLeaderDuty": true,
  "accountLevel": 4.5
}
```

#### ✅ TEST_STAFF_006（Level 10: 部長・医局長）
```json
{
  "staffId": "TEST_STAFF_006",
  "name": "テスト職員006（部長）",
  "facility": "小原病院",
  "department": "医局",
  "position": "部長",
  "profession": "医師",
  "hireDate": "2005-04-01",
  "experienceYears": 20,
  "accountLevel": 10
}
```

#### ✅ TEST_STAFF_007（Level 15: 人事各部門長）
```json
{
  "staffId": "TEST_STAFF_007",
  "name": "テスト職員007（人事マネージャー）",
  "facility": "法人本部",
  "department": "人事部",
  "position": "人事各部門長",
  "profession": "事務職",
  "hireDate": "2015-04-01",
  "experienceYears": 10,
  "accountLevel": 15
}
```

#### ✅ TEST_STAFF_008（Level 18: 理事長・最高経営層）
```json
{
  "staffId": "TEST_STAFF_008",
  "name": "テスト職員008（理事）",
  "facility": "法人本部",
  "department": "経営企画",
  "position": "理事長",
  "profession": "経営者",
  "hireDate": "2000-04-01",
  "experienceYears": 25,
  "accountLevel": 18
}
```

#### ✅ TEST_STAFF_097（Level 97: 健診担当者・特別権限）
```json
{
  "staffId": "TEST_STAFF_097",
  "name": "テスト職員097（健診担当者）",
  "facility": "小原病院",
  "department": "健康管理室",
  "position": "健診担当者",
  "profession": "保健師",
  "hireDate": "2018-04-01",
  "experienceYears": 7,
  "accountLevel": 97
}
```

#### ✅ TEST_STAFF_098（Level 98: 産業医・特別権限）
```json
{
  "staffId": "TEST_STAFF_098",
  "name": "テスト職員098（産業医）",
  "facility": "小原病院",
  "department": "健康管理室",
  "position": "産業医",
  "profession": "医師",
  "hireDate": "2010-04-01",
  "experienceYears": 15,
  "accountLevel": 98
}
```

#### ✅ TEST_STAFF_099（Level 99: システム管理者・最高権限）
```json
{
  "staffId": "TEST_STAFF_099",
  "name": "テスト職員099（システム管理者）",
  "facility": "法人本部",
  "department": "情報システム部",
  "position": "システム管理者",
  "profession": "IT管理者",
  "hireDate": "2015-04-01",
  "experienceYears": 10,
  "accountLevel": 99
}
```

---

## 🔧 3. APIリクエスト・レスポンス例

### リクエスト例（staffIdで照会）

```bash
curl -X POST http://localhost:3000/api/v1/calculate-level \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "staffId": "TEST_STAFF_001",
    "facilityId": "obara-hospital"
  }'
```

### レスポンス例

```json
{
  "staffId": "TEST_STAFF_001",
  "facilityId": "obara-hospital",
  "position": null,
  "accountLevel": 1,
  "breakdown": {
    "baseLevel": 1,
    "experienceBonus": 0,
    "leaderBonus": 0,
    "facilityAdjustment": 0
  },
  "levelDetails": {
    "name": "新人（1年目）",
    "category": "一般職員層",
    "description": "新人（1年目）"
  },
  "timestamp": "2025-10-04T20:00:00.000Z"
}
```

### 特別権限レベルのレスポンス例（Level 97）

```json
{
  "staffId": "TEST_STAFF_097",
  "facilityId": "obara-hospital",
  "position": "健診担当者",
  "accountLevel": 97,
  "breakdown": {
    "baseLevel": 97,
    "experienceBonus": 0,
    "leaderBonus": 0,
    "facilityAdjustment": 0
  },
  "levelDetails": {
    "name": "健診担当者（特別権限）",
    "category": "健康管理専用",
    "description": "健診担当者（特別権限）"
  },
  "timestamp": "2025-10-04T20:00:00.000Z"
}
```

---

## 📅 4. 統合テスト実施スケジュール提案

### オプション1: 最短スケジュール（推奨）

| 日時 | 作業内容 | 担当 | 所要時間 |
|-----|---------|------|---------|
| **10/5 (土) 10:00-10:15** | 接続設定・疎通確認 | VoiceDriveチーム | 15分 |
| **10/5 (土) 10:15-11:15** | 統合テスト実行（11件） | 両チーム合同 | 1時間 |
| **10/5 (土) 11:15-11:45** | 結果確認・報告書作成 | 両チーム | 30分 |

**合計所要時間**: 1時間45分

### オプション2: 余裕を持ったスケジュール

| 日時 | 作業内容 | 担当 |
|-----|---------|------|
| **10/7 (月) 午前** | 事前疎通確認 | 両チーム |
| **10/8 (火) 10:00-12:00** | 統合テスト実行（合同） | 両チーム |
| **10/8 (火) 13:00-14:00** | 結果確認・報告書作成 | 両チーム |

---

## ✅ 5. 成功基準（医療システム側の確認項目）

| No. | 確認項目 | 期待される結果 | 確認方法 |
|-----|---------|---------------|---------|
| 1 | **API疎通** | 11件すべて200 OKレスポンス | HTTPステータスコード確認 |
| 2 | **レベル計算精度** | 期待値と実際の値が100%一致 | accountLevel値の比較 |
| 3 | **0.5刻みレベル** | 1.5, 2.5, 3.5, 4.5が正しく返る | TEST_STAFF_002, 005の確認 |
| 4 | **特別権限レベル** | 97, 98, 99が正しく返る | TEST_STAFF_097, 098, 099の確認 |
| 5 | **レスポンスタイム** | 平均 < 500ms | タイムスタンプ測定 |
| 6 | **JWT認証** | 認証成功、エラーなし | 認証ヘッダー確認 |
| 7 | **CORS設定** | VoiceDriveからのアクセス許可 | オリジン確認 |

---

## 🚀 6. 医療システム側の準備完了項目

| 項目 | 状態 | 詳細 |
|-----|------|------|
| **25レベル権限システム** | ✅ 完了 | 基本18 + リーダー4 + 特別3 |
| **calculate-level API** | ✅ 完了 | 25レベル対応・特別権限対応 |
| **モックテストデータ** | ✅ 完了 | 11件すべて登録済み |
| **JWT認証設定** | ✅ 完了 | VoiceDrive用トークン発行済み |
| **CORS設定** | ✅ 完了 | localhost:3001許可 |
| **ヘルスチェックAPI** | ✅ 完了 | /api/v1/health稼働中 |
| **エラーハンドリング** | ✅ 完了 | 400, 401, 404, 500対応 |
| **統合テストログ記録** | ✅ 完了 | 監査ログ自動記録 |

---

## 📞 7. 連絡先・サポート

### 医療システム開発チーム

- **Slack**: `#medical-voicedrive-integration`
- **メール**: medical-dev@example.com
- **担当者**: 医療システムリード
- **稼働時間**: 平日 9:00-18:00、土日 10:00-15:00（統合テスト対応）

### 統合テスト日時調整

以下のいずれかの方法でご連絡ください：

1. **Slackチャンネル**: `#voicedrive-integration-test`
2. **メール**: medical-dev@example.com
3. **本報告書への返信**

---

## 📋 8. 次のアクション

### VoiceDriveチーム様へのお願い

| No. | アクション | 期限 | 方法 |
|-----|----------|------|------|
| 1 | **統合テスト日時の確定** | 10/5朝まで | Slack `#voicedrive-integration-test` |
| 2 | **VoiceDrive側の準備完了確認** | テスト前日 | 進捗報告 |
| 3 | **接続情報の受領確認** | 10/5朝まで | Slack DM または返信メール |

### 医療システムチーム側のアクション

- ✅ 接続情報提供（本報告書にて完了）
- ✅ テストデータ準備（11件完了）
- ✅ APIサーバー稼働確認（完了）
- ⏳ 統合テスト日時確定待ち
- ⏳ 統合テスト実施
- ⏳ 結果報告書作成

---

## 📎 添付資料

- [25レベル権限システム仕様書](./Account_Level_Definition_Unification_Request_20251004.md)
- [マスタープラン（v2.1）](./lightsail-integration-master-plan-integrated-20251003.md)
- [calculate-level APIソースコード](../../src/pages/api/v1/calculate-level.ts)

---

## 📝 変更履歴

| 日付 | バージョン | 変更内容 |
|-----|----------|---------|
| 2025-10-04 | 1.0 | 初版作成・統合テスト準備完了報告 |

---

**医療システム開発チーム一同、VoiceDriveチーム様との統合テスト実施を楽しみにしております。**
**スムーズな統合に向けて、全力でサポートさせていただきます。**

---

**報告者**: 医療職員管理システム開発チーム
**報告日時**: 2025年10月4日 20:00
**次回報告**: 統合テスト実施後
