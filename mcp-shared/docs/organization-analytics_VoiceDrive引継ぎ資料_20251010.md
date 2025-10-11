# OrganizationAnalytics API 引継ぎ資料

**作成日**: 2025年10月10日
**医療システムチームからVoiceDriveチームへ**
**VoiceDrive承認番号**: VD-APPROVAL-2025-1010-001

---

## 📋 実装完了のお知らせ

医療システムチームです。OrganizationAnalytics API Phase 1の実装が完了しました。

### 完了項目

✅ **API-1**: GET /api/v2/departments（部門マスタ取得）
✅ **API-2**: GET /api/v2/employees/count（職員数取得）
✅ **認証**: API Key認証（X-API-Keyヘッダー）
✅ **Rate Limit**: 100リクエスト/分/IP
✅ **単体テスト**: 30件全て成功（100%）
✅ **OpenAPI仕様**: 完全準拠

---

## 🔑 API Key共有（統合テスト時）

### API Key生成方法

統合テスト前に、医療システムチームがAPI Keyを生成してVoiceDriveチームに共有します。

```bash
# API Key生成コマンド
openssl rand -hex 32
```

### 設定方法（VoiceDrive側）

VoiceDriveプロジェクトの`.env`に以下を追加してください：

```env
# 医療システムOrganizationAnalytics API設定
MEDICAL_SYSTEM_API_URL=https://medical.example.com/api/v2
MEDICAL_SYSTEM_API_KEY=[医療システムチームから共有されたAPI Key]
```

---

## 📖 API仕様概要

### API-1: 部門マスタ取得

**エンドポイント**: `GET /api/v2/departments`

**リクエストパラメータ**:
- `facilityId` (optional): 施設IDでフィルタ

**リクエスト例**:
```bash
curl -X GET "https://medical.example.com/api/v2/departments?facilityId=facility-001" \
  -H "X-API-Key: YOUR_API_KEY"
```

**レスポンス例**:
```json
{
  "data": [
    {
      "departmentId": "dept-001",
      "departmentCode": "D001",
      "departmentName": "内科",
      "facilityId": "facility-001",
      "facilityCode": "F001",
      "facilityName": "小原病院",
      "parentDepartmentId": null,
      "level": 1,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 9,
    "timestamp": "2025-10-10T12:00:00.000Z"
  }
}
```

---

### API-2: 職員数取得

**エンドポイント**: `GET /api/v2/employees/count`

**リクエストパラメータ**:
- `facilityId` (optional): 施設IDでフィルタ
- `departmentId` (optional): 部門IDでフィルタ

**リクエスト例**:
```bash
curl -X GET "https://medical.example.com/api/v2/employees/count?facilityId=facility-001" \
  -H "X-API-Key: YOUR_API_KEY"
```

**レスポンス例**:
```json
{
  "data": {
    "totalCount": 120,
    "byDepartment": [
      {
        "departmentId": "dept-001",
        "departmentCode": "D001",
        "departmentName": "内科",
        "count": 50
      },
      {
        "departmentId": "dept-002",
        "departmentCode": "D002",
        "departmentName": "外科",
        "count": 70
      }
    ]
  },
  "meta": {
    "timestamp": "2025-10-10T12:00:00.000Z",
    "filters": {
      "facilityId": "facility-001",
      "departmentId": null
    }
  }
}
```

---

## ⚠️ Phase 1制約事項

### 未実装機能（Phase 2で対応予定）

1. **isActiveフィルタ（部門マスタAPI）**
   - Phase 1では`isActive`パラメータを指定すると400エラーを返します
   - 理由: DepartmentテーブルにisActiveフィールドが存在しない
   - 対応: Phase 2でDBスキーマ拡張後に実装

2. **雇用形態別カウント（職員数API）**
   - Phase 1では雇用形態を区別せず、全職員を同一カウント
   - 理由: EmployeeテーブルにemploymentTypeフィールドが存在しない
   - 対応: Phase 2でDBスキーマ拡張後に実装

### Phase 1実装方針

合意事項（VD-APPROVAL-2025-1010-001）:
- 既存DBスキーマの範囲内で実装
- 基本機能（施設別・部門別フィルタ、職員数カウント）を提供
- Phase 2でDB拡張後に追加機能を実装

---

## 🔒 認証・セキュリティ

### API Key認証

全てのAPIリクエストに`X-API-Key`ヘッダーが必要です。

```http
GET /api/v2/departments HTTP/1.1
Host: medical.example.com
X-API-Key: YOUR_API_KEY
```

### エラーレスポンス

**401 Unauthorized（API Key未提供）**:
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "API Key is required",
    "details": "X-API-Key header is missing"
  }
}
```

**401 Unauthorized（不正なAPI Key）**:
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid API Key",
    "details": "The provided API Key is not valid"
  }
}
```

---

## ⏱️ Rate Limit

### 制限

- **100リクエスト/分/IP**
- Rate Limit情報はレスポンスヘッダーに含まれます

### Rate Limitヘッダー

```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1696939200
```

### Rate Limit超過時のレスポンス

**429 Too Many Requests**:
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests",
    "details": "Rate limit of 100 requests per minute exceeded"
  }
}
```

---

## 🧪 テスト方法

### 開発環境でのテスト

```bash
# 部門マスタ取得
curl -X GET "http://localhost:3000/api/v2/departments?facilityId=facility-001" \
  -H "X-API-Key: ${MEDICAL_SYSTEM_API_KEY}"

# 職員数取得
curl -X GET "http://localhost:3000/api/v2/employees/count?facilityId=facility-001" \
  -H "X-API-Key: ${MEDICAL_SYSTEM_API_KEY}"
```

### エラーハンドリングテスト

```bash
# 認証エラーテスト
curl -X GET "http://localhost:3000/api/v2/departments"
# 期待: 401 Unauthorized

# 不正なAPI Keyテスト
curl -X GET "http://localhost:3000/api/v2/departments" \
  -H "X-API-Key: invalid-key"
# 期待: 401 Unauthorized

# Phase 1未対応パラメータテスト
curl -X GET "http://localhost:3000/api/v2/departments?isActive=true" \
  -H "X-API-Key: ${MEDICAL_SYSTEM_API_KEY}"
# 期待: 400 Bad Request
```

---

## 📂 関連ドキュメント

| ドキュメント名 | パス | 説明 |
|--------------|------|------|
| **OpenAPI仕様書** | `mcp-shared/docs/organization-analytics_API仕様書_20251010.yaml` | API詳細仕様（必読） |
| **VoiceDrive承認文書** | `mcp-shared/docs/organization-analytics_API仕様書承認済み_20251010.md` | 承認記録 |
| **実装完了報告書** | `mcp-shared/docs/organization-analytics_API実装完了報告_20251010.md` | 実装詳細 |
| **統合テスト手順** | `docs/共通DB構築後_作業再開指示書_20250928.md` | 6.3節参照 |

---

## 🚀 統合テスト計画（DB構築後）

### タイミング

共通DB構築完了後、以下の手順で統合テストを実施します。

### 事前準備

1. **医療システムチーム**
   - API Keyを生成
   - VoiceDriveチームにSlackで共有
   - 本番環境に`ORGANIZATION_ANALYTICS_API_KEY`を設定

2. **VoiceDriveチーム**
   - 共有されたAPI Keyを`.env`に設定
   - OrganizationAnalyticsService実装完了

### 統合テスト項目

1. **基本動作確認**
   - [ ] 部門マスタ取得が正常動作
   - [ ] 職員数取得が正常動作
   - [ ] facilityIdフィルタが正常動作

2. **認証・Rate Limit確認**
   - [ ] API Key認証が正常動作
   - [ ] Rate Limitが正常動作
   - [ ] エラーレスポンスが仕様通り

3. **OrganizationAnalyticsページ表示確認**
   - [ ] 組織健康度指標が正常表示
   - [ ] 部門別活性度が正常表示
   - [ ] データ更新が正常動作

### 統合テスト完了基準

- ✅ 全APIエンドポイントが実データで正常動作
- ✅ VoiceDrive OrganizationAnalyticsページで正常表示
- ✅ エラーハンドリングが仕様通り動作
- ✅ Rate Limitが正しく機能

---

## 💬 質問・サポート

### 連絡先

**医療システムチーム**:
- Slack: #medical-system-dev
- 担当: Claude Code（医療システム開発）

### よくある質問

**Q1: Phase 1でisActiveフィルタは使えますか？**
- A1: Phase 1では使えません。`isActive`パラメータを指定すると400エラーが返ります。Phase 2で対応予定です。

**Q2: 雇用形態別のカウントは取得できますか？**
- A2: Phase 1では取得できません。全職員を同一カウントします。Phase 2で対応予定です。

**Q3: Rate Limitを超えた場合はどうなりますか？**
- A3: 429エラーが返ります。`X-RateLimit-Reset`ヘッダーでリセット時刻を確認できます。

**Q4: API Keyはどこで取得できますか？**
- A4: 統合テスト前に医療システムチームがSlackで共有します。

**Q5: 本番環境のエンドポイントURLは？**
- A5: 統合テスト前に共有します（例: `https://medical.example.com/api/v2`）

---

## 📅 今後のスケジュール

### Phase 1（現在）

- ✅ API実装完了（2025年10月10日）
- ✅ 単体テスト完了（30/30成功）
- ⏳ 共通DB構築待機中

### Phase 2（DB構築後）

1. **統合テスト**（推定2日間）
   - API Key共有
   - 実データテスト
   - VoiceDriveチームと連携テスト

2. **本番デプロイ**（推定1日間）
   - 本番環境へのデプロイ
   - 監視設定
   - 最終確認

3. **Phase 2機能追加**（時期未定）
   - isActiveフィールド追加
   - employmentTypeフィールド追加
   - isActiveフィルタ実装
   - 雇用形態別カウント実装

---

## ✅ チェックリスト（VoiceDriveチーム用）

統合テスト前に以下を確認してください：

- [ ] この引継ぎ資料を読んだ
- [ ] OpenAPI仕様書を確認した
- [ ] OrganizationAnalyticsService実装が完了している
- [ ] Phase 1制約事項を理解した
- [ ] 医療システムチームからAPI Keyを受領した
- [ ] `.env`にAPI Keyを設定した
- [ ] 統合テスト環境の準備が完了した

---

**以上、ご確認よろしくお願いいたします！**

質問がありましたら、Slackでお気軽にお声がけください。

**医療システムチーム一同**
