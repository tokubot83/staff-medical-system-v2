# OrganizationAnalytics API仕様書 レビュー依頼

**文書番号**: MED-REV-2025-1010-007
**作成日**: 2025年10月10日
**差出人**: 医療職員管理システムチーム
**宛先**: VoiceDriveチーム
**件名**: API仕様書の最終確認依頼
**優先度**: 🟡 MEDIUM
**回答期限**: 2025年10月11日（金）12:00

---

## 📋 概要

VoiceDriveチームからの回答（VD-A-2025-1010-006）を受領し、OrganizationAnalytics用API仕様書をOpenAPI 3.0形式で作成しました。

API実装開始前に、仕様書の最終確認をお願いします。

---

## 📄 API仕様書

**ファイル**: [organization-analytics_API仕様書_20251010.yaml](./organization-analytics_API仕様書_20251010.yaml)

### API一覧

| No | エンドポイント | メソッド | 説明 |
|----|--------------|---------|------|
| 1 | `/api/v2/departments` | GET | 部門マスタ取得 |
| 2 | `/api/v2/employees/count` | GET | 職員総数取得 |

### 認証方式

```http
X-API-Key: vd-med-integration-key-12345
```

### Rate Limit

- **制限**: 100 req/min/IP
- **ヘッダー**:
  ```http
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 95
  X-RateLimit-Reset: 1696934460
  ```

---

## ✅ 確認ポイント（チェックリスト）

### 1. API-1: 部門マスタ取得API

**エンドポイント**: `GET /api/v2/departments`

**レスポンス例**（仕様書より抜粋）:
```json
{
  "departments": [
    {
      "id": "dept-001",
      "name": "医療療養病棟",
      "facilityId": "tategami-hospital",
      "facilityName": "立神リハビリテーション温泉病院",
      "employeeCount": 45,
      "departmentCode": "MTB",
      "isActive": true,
      "parentDepartmentId": null,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2025-10-01T00:00:00Z"
    }
  ],
  "totalCount": 15,
  "activeCount": 14,
  "retrievedAt": "2025-10-10T10:30:00Z"
}
```

#### 確認事項
- [ ] レスポンス構造は要件を満たしているか？
- [ ] フィールド名は適切か？
- [ ] クエリパラメータ（facilityId, isActive）は必要十分か？

---

### 2. API-2: 職員総数取得API

**エンドポイント**: `GET /api/v2/employees/count`

**レスポンス例**（仕様書より抜粋）:
```json
{
  "totalEmployees": 245,
  "byFacility": {
    "tategami-hospital": 120,
    "obara-hospital": 100,
    "headquarters": 25
  },
  "byDepartment": {
    "医療療養病棟": 45,
    "回復期リハ病棟": 38,
    "外来・健診センター": 28
  },
  "activeOnly": true,
  "excludeRetired": true,
  "calculatedAt": "2025-10-10T10:30:00Z",
  "limitations": {
    "employmentTypeDistinction": false,
    "note": "全職員を同一カウント（雇用形態フィールド未実装）"
  }
}
```

#### 確認事項
- [ ] レスポンス構造は要件を満たしているか？
- [ ] byFacilityのキーはfacilityIdでOK？
- [ ] byDepartmentのキーは部門名でOK？
- [ ] limitationsフィールドは必要か？
- [ ] クエリパラメータは必要十分か？

---

### 3. エラーレスポンス

#### 401 Unauthorized
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "認証トークンが無効です",
    "timestamp": "2025-10-10T10:30:00Z"
  }
}
```

#### 403 Forbidden
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "このAPIへのアクセス権限がありません（Level 15以上が必要）",
    "requiredLevel": 15,
    "currentLevel": 10,
    "timestamp": "2025-10-10T10:30:00Z"
  }
}
```

#### 429 Too Many Requests
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "リクエスト数が制限を超えました",
    "limit": 100,
    "remaining": 0,
    "resetAt": "2025-10-10T10:31:00Z",
    "timestamp": "2025-10-10T10:30:00Z"
  }
}
```

#### 確認事項
- [ ] エラーレスポンス構造は統一されているか？
- [ ] VoiceDrive側でエラーハンドリングしやすい形式か？

---

### 4. 認証・Rate Limit

#### 認証ヘッダー
```http
X-API-Key: vd-med-integration-key-12345
```

#### Rate Limitヘッダー（レスポンスに含む）
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1696934460
```

#### 確認事項
- [ ] X-API-Keyヘッダー名でOK？
- [ ] Rate Limitヘッダーは必要か？（VoiceDrive回答では「可能であれば」と記載）

---

## 🔍 レビュー方法

### オプション1: Swagger Editorで確認（推奨）

1. [Swagger Editor](https://editor.swagger.io/)を開く
2. `organization-analytics_API仕様書_20251010.yaml`の内容をコピペ
3. 右側のプレビューでAPI仕様を確認
4. 「Try it out」で擬似的なリクエスト/レスポンスを確認

### オプション2: YAMLファイルを直接確認

- VSCodeやテキストエディタで`organization-analytics_API仕様書_20251010.yaml`を開く
- スキーマ定義（components/schemas）を確認
- エンドポイント定義（paths）を確認

---

## 📝 回答フォーマット

以下のフォーマットでご回答ください：

```markdown
# API仕様書レビュー結果

**回答日**: 2025年10月11日
**回答者**: VoiceDriveチーム

---

## API-1: 部門マスタ取得API
[X] レスポンス構造OK
[ ] 変更希望:

**コメント**:


---

## API-2: 職員総数取得API
[X] レスポンス構造OK
[ ] 変更希望:

**コメント**:


---

## エラーレスポンス
[X] 問題なし
[ ] 変更希望:

**コメント**:


---

## 認証・Rate Limit
[X] X-API-Keyヘッダー名でOK
[X] Rate Limitヘッダー必要
[ ] 変更希望:

**コメント**:


---

## 総合評価
[X] 承認（API実装開始OK）
[ ] 修正後承認
[ ] 不承認（大幅な変更必要）

**総合コメント**:


```

---

## 📅 スケジュール

| 日付 | 作業内容 | 担当 |
|------|---------|------|
| **10/10（木）** | API仕様書作成完了 | 医療システム | ✅ |
| **10/11（金）12:00** | VoiceDriveチームレビュー回答 | VoiceDrive | ⏳ |
| **10/11（金）午後** | 仕様修正（必要に応じて） | 医療システム | - |
| **10/14（月）** | API実装開始 | 医療システム | - |
| **10/15（火）** | 単体テスト・API仕様書更新 | 医療システム | - |
| **10/16（水）** | 統合テスト | 両チーム | - |

---

## 🔗 関連ドキュメント

1. [organization-analytics_API仕様書_20251010.yaml](./organization-analytics_API仕様書_20251010.yaml) - **レビュー対象**
2. [organization-analytics_VoiceDrive回答_20251010.md](./organization-analytics_VoiceDrive回答_20251010.md) - VoiceDriveからの回答
3. [organization-analytics_医療システム質問書_20251010.md](./organization-analytics_医療システム質問書_20251010.md) - 医療システムからの質問
4. [organization-analytics_医療システム確認結果_20251010.md](./organization-analytics_医療システム確認結果_20251010.md) - DB調査結果

---

## 📞 連絡先

### 医療システムチーム
- **Slack**: #medical-system-integration
- **質問対応**: 平日 9:00-18:00

### VoiceDriveチーム
- **Slack**: #voicedrive-integration

---

## ⚡ 緊急時の対応

API仕様書に重大な問題が見つかった場合は、すぐにSlackでご連絡ください。
軽微な修正であれば、10/11（金）中に対応し、10/14（月）のAPI実装開始に影響が出ないようにします。

---

**文書終了**

最終更新: 2025年10月10日
バージョン: 1.0
回答期限: 2025年10月11日（金）12:00
次回アクション: VoiceDriveチームからのレビュー結果受領
