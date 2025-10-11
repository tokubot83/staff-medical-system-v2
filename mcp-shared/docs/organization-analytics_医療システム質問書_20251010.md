# 組織分析ページ 医療システムからの質問書

**文書番号**: MED-Q-2025-1010-005
**作成日**: 2025年10月10日
**差出人**: 医療職員管理システムチーム
**宛先**: VoiceDriveチーム
**件名**: OrganizationAnalytics API実装前の最終確認事項
**優先度**: 🔴 HIGH（実装ブロッカー）
**関連文書**:
- [organization-analytics_医療システム確認結果_20251010.md](./organization-analytics_医療システム確認結果_20251010.md)
- [organization-analytics_医療システム連携要件確認書_20251010.md](./organization-analytics_医療システム連携要件確認書_20251010.md)

---

## 📋 エグゼクティブサマリー

医療システム側のDB構造調査を完了し、OrganizationAnalytics用API（2件）の実装可能性を確認しました。
API実装開始前に、以下の不明点についてVoiceDriveチームの見解を確認させてください。

### 質問サマリー
1. **質問-1**: 雇用形態区別の必要性とPhase 2の優先度（🔴 重要）
2. **質問-2**: isActiveフィールドの必要性（🟡 中）
3. **質問-3**: API仕様の最終承認（🟡 中）
4. **質問-4**: エラーハンドリングとレスポンス構造（🟢 低）
5. **質問-5**: 認証・認可の実装方式（🟡 中）

### 期待する回答期限
**2025年10月11日（金）17:00まで**

回答受領後、即座にAPI実装を開始します（推定1日）。

---

## ❓ 質問-1: 雇用形態区別の必要性とPhase 2の優先度

### 背景
医療システムの`Employee`テーブルには**雇用形態（employmentType）フィールドが存在しません**。
そのため、正社員/パート/派遣/外部委託/研修生等を区別できません。

### 現状のDB制約

| 職員区分 | 判定可否 | 備考 |
|---------|---------|------|
| 退職済み職員 | ✅ 可能 | `status = 'retired'` |
| 休職中職員 | ✅ 可能 | `status = 'leave'` |
| 試用期間中職員 | ✅ 可能 | `hireDate`から3ヶ月以内で判定 |
| パート・アルバイト | ❌ **区別不可** | employmentTypeフィールド不足 |
| 派遣職員 | ❌ **区別不可** | employmentTypeフィールド不足 |
| 外部委託職員 | ❌ **区別不可** | employmentTypeフィールド不足 |
| 研修生・実習生 | ❌ **区別不可** | employmentTypeフィールド不足 |

### Phase 1実装案（即座に実装可能）

```sql
-- 職員総数: active + leave（退職者除外）
SELECT COUNT(*) as totalEmployees
FROM employees
WHERE status IN ('active', 'leave')
```

**この実装の制約**:
- ✅ 退職者を除外可能
- ✅ 休職中職員を含める
- ❌ 雇用形態を区別できない（全員をカウント）
- ❌ 派遣職員・外部委託職員を除外できない

### Phase 2実装案（将来対応）

```sql
-- Employeeテーブルに employmentType フィールドを追加
ALTER TABLE employees ADD COLUMN employmentType VARCHAR(50);

-- 職員総数: 正社員 + パート（派遣・外部委託除外）
SELECT COUNT(*) as totalEmployees
FROM employees
WHERE status IN ('active', 'leave')
  AND employmentType IN ('full_time', 'part_time', 'contract')
  AND employmentType NOT IN ('dispatch', 'external_contractor', 'intern')
```

**推定工数**:
- DBマイグレーション: 0.5日
- 既存データへの初期値設定: 0.5日
- API拡張: 0.5日
- 合計: **1.5日**

---

### 🔴 質問-1-A: Phase 1実装（雇用形態区別なし）で問題ないか？

**選択肢A**: Phase 1実装でOK（全職員をカウント）
```
✅ Phase 1実装でOK
- 当面は雇用形態を区別せず、全職員をカウントする
- 組織分析の精度は若干落ちるが、許容範囲内
- Phase 2は将来的に検討（優先度: 低）
```

**選択肢B**: Phase 2実装が必須（employmentType追加）
```
❌ Phase 1では不十分
- 派遣職員・外部委託職員を除外しないと、組織分析の精度が大きく低下する
- Phase 2を優先的に実装する必要がある
- API実装前にemploymentTypeフィールドを追加してほしい（+1.5日）
```

**選択肢C**: 暫定的にPosition（役職）で判定
```
⚠️ 暫定対応
- 役職マスタ（Position）を使って、派遣職員・外部委託職員を推定
- 完全ではないが、Phase 1の精度を向上できる
- Phase 2は将来的に検討
```

#### ご回答をお願いします：
```
[ ] 選択肢A: Phase 1実装でOK
[ ] 選択肢B: Phase 2実装が必須
[ ] 選択肢C: 暫定的にPosition判定
[ ] その他: （具体的にご記入ください）
```

---

### 🔴 質問-1-B: Phase 2の優先度と実装時期

Phase 2（employmentType追加）を実装する場合、いつ実装しますか？

**選択肢A**: 即座に実装（API実装前）
```
✅ OrganizationAnalytics API実装前にemploymentTypeフィールドを追加
- スケジュール: 10/11-10/14（4日間）
- API実装: 10/15-10/16（2日間）
```

**選択肢B**: Phase 1実装後に実装
```
⚠️ まずPhase 1でAPI実装、動作確認後にPhase 2対応
- Phase 1実装: 10/11-10/12（2日間）
- Phase 2実装: 10/15-10/17（3日間）
```

**選択肢C**: 将来実装（時期未定）
```
🟢 Phase 1実装のみ、Phase 2は要件確定後に実装
- 当面はPhase 1で運用
- VoiceDrive側で精度向上の必要性が確認されたら実装
```

#### ご回答をお願いします：
```
[ ] 選択肢A: 即座に実装（API実装前）
[ ] 選択肢B: Phase 1実装後に実装
[ ] 選択肢C: 将来実装（時期未定）
[ ] その他: （実装時期をご指定ください）
```

---

## ❓ 質問-2: isActiveフィールドの必要性

### 背景
医療システムの`Department`テーブルには**isActiveフィールドが存在しません**。
そのため、部門の有効/無効を管理できません。

### 現状のDB構造
```prisma
model Department {
  id         String   @id @default(cuid())
  code       String   @unique
  name       String
  facilityId String
  parentId   String?
  level      Int
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  // ❌ isActive フィールドなし
}
```

### Phase 1実装案（全部門を有効とみなす）

```json
{
  "departments": [
    {
      "id": "dept-001",
      "name": "医療療養病棟",
      "isActive": true,  // ← 常にtrue
      // ...
    }
  ]
}
```

### Phase 2実装案（isActiveフィールド追加）

```prisma
model Department {
  // ... 既存フィールド
  isActive Boolean @default(true)
}
```

**推定工数**: 0.5日

---

### 🟡 質問-2-A: isActiveフィールドは必要か？

**選択肢A**: 不要（全部門を有効とみなす）
```
✅ isActiveフィールド不要
- 現実的に、部門が無効化されることは稀
- 当面は全部門を有効（isActive: true）として返す
- フィールド追加は不要
```

**選択肢B**: 必要（フィールド追加してほしい）
```
❌ isActiveフィールドが必要
- 統廃合された部門を無効化したい
- API実装前にisActiveフィールドを追加してほしい（+0.5日）
```

**選択肢C**: 将来的に必要（Phase 2で追加）
```
⚠️ 当面は不要だが、将来的に追加したい
- Phase 1では全部門を有効とみなす
- Phase 2で必要性を再検討
```

#### ご回答をお願いします：
```
[ ] 選択肢A: 不要（全部門を有効とみなす）
[ ] 選択肢B: 必要（フィールド追加してほしい）
[ ] 選択肢C: 将来的に必要（Phase 2で追加）
[ ] その他: （具体的にご記入ください）
```

---

## ❓ 質問-3: API仕様の最終承認

### API-1: 部門マスタ取得API

#### レスポンス仕様（確認結果報告書より）

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

### 🟡 質問-3-A: このレスポンス構造でOKか？

**確認事項**:
1. **フィールド名**: `departmentCode`でOK？（`code`ではなく）
2. **facilityName**: 必要？（FacilityテーブルとJOINが必要）
3. **employeeCount**: 動的集計でOK？（キャッシュ不要？）
4. **retrievedAt**: 必要？

#### ご回答をお願いします：
```
[ ] このレスポンス構造でOK（変更不要）
[ ] 以下の変更をお願いします:
    - フィールド名変更: （具体的にご記入）
    - フィールド追加: （具体的にご記入）
    - フィールド削除: （具体的にご記入）
```

---

### API-2: 職員総数取得API

#### レスポンス仕様（確認結果報告書より）

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

### 🟡 質問-3-B: このレスポンス構造でOKか？

**確認事項**:
1. **byFacility**: キー名をfacilityIdにするか、facilityCodeにするか？
2. **byDepartment**: キー名を部門名にするか、部門IDにするか？
3. **limitations**: この制約情報フィールドは必要？

#### ご回答をお願いします：
```
[ ] このレスポンス構造でOK（変更不要）
[ ] 以下の変更をお願いします:
    - byFacilityのキー: [ ] facilityId [ ] facilityCode [ ] facilityName
    - byDepartmentのキー: [ ] departmentId [ ] departmentCode [ ] departmentName
    - limitations: [ ] 必要 [ ] 不要
```

---

## ❓ 質問-4: エラーハンドリングとレスポンス構造

### エラーレスポンス仕様（提案）

#### 認証エラー（401 Unauthorized）
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "認証トークンが無効です",
    "timestamp": "2025-10-10T10:30:00Z"
  }
}
```

#### 認可エラー（403 Forbidden）
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

#### バリデーションエラー（400 Bad Request）
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "リクエストパラメータが不正です",
    "details": [
      {
        "field": "facilityId",
        "message": "施設IDが存在しません"
      }
    ],
    "timestamp": "2025-10-10T10:30:00Z"
  }
}
```

#### サーバーエラー（500 Internal Server Error）
```json
{
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "サーバー内部エラーが発生しました",
    "requestId": "req-12345-abcde",
    "timestamp": "2025-10-10T10:30:00Z"
  }
}
```

### 🟢 質問-4-A: このエラーレスポンス構造でOKか？

#### ご回答をお願いします：
```
[ ] このエラーレスポンス構造でOK
[ ] 変更希望（具体的にご記入ください）
```

---

## ❓ 質問-5: 認証・認可の実装方式

### 背景
VoiceDrive側から医療システムAPIを呼び出す際の認証・認可方式を確認させてください。

### 提案A: JWT Bearer Token認証

```http
GET /api/v2/departments
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**実装方式**:
- VoiceDrive側でユーザーのJWTトークンを取得
- 医療システムAPIへのリクエストにトークンを付与
- 医療システム側でトークンを検証し、Level 15以上かチェック

**必要な情報**:
- JWT署名キー（両システムで共有）
- トークンペイロード構造（userId, level, facilityId等）

---

### 提案B: API Key認証

```http
GET /api/v2/departments
X-API-Key: vd-med-integration-key-12345
```

**実装方式**:
- VoiceDrive用の専用APIキーを発行
- 医療システム側でAPIキーを検証
- Level 15以上の権限を持つAPIキーのみ許可

**必要な情報**:
- VoiceDrive用APIキー（事前発行・共有）

---

### 提案C: システム間認証（OAuth 2.0 Client Credentials）

```http
POST /api/oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&
client_id=voicedrive&
client_secret=secret123
```

**実装方式**:
- VoiceDrive側でクライアント認証を行い、アクセストークンを取得
- APIリクエスト時にアクセストークンを使用
- 医療システム側でトークンを検証

**必要な情報**:
- クライアントID・シークレット（事前発行・共有）

---

### 🟡 質問-5-A: どの認証方式を採用しますか？

#### ご回答をお願いします：
```
[ ] 提案A: JWT Bearer Token認証
    - JWT署名キー: （共有方法をご記入）
    - トークンペイロード構造: （ご指定ください）

[ ] 提案B: API Key認証
    - APIキー発行方法: （ご指定ください）

[ ] 提案C: OAuth 2.0 Client Credentials
    - クライアントID/シークレット発行方法: （ご指定ください）

[ ] その他: （具体的にご記入ください）
```

---

### 🟡 質問-5-B: Rate Limitの実装方式

#### 提案仕様
- **Rate Limit**: 100 req/min/IP
- **超過時のレスポンス**: 429 Too Many Requests

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

#### ご回答をお願いします：
```
[ ] この仕様でOK
[ ] Rate Limitの数値を変更: （ご指定ください）req/min
[ ] Rate Limit不要
[ ] その他: （具体的にご記入ください）
```

---

## 📊 質問サマリー表

| 質問番号 | 質問内容 | 優先度 | 回答期限 |
|---------|---------|-------|---------|
| **質問-1-A** | Phase 1実装（雇用形態区別なし）でOKか？ | 🔴 高 | 10/11 17:00 |
| **質問-1-B** | Phase 2の優先度と実装時期 | 🔴 高 | 10/11 17:00 |
| **質問-2-A** | isActiveフィールドは必要か？ | 🟡 中 | 10/11 17:00 |
| **質問-3-A** | API-1のレスポンス構造でOKか？ | 🟡 中 | 10/11 17:00 |
| **質問-3-B** | API-2のレスポンス構造でOKか？ | 🟡 中 | 10/11 17:00 |
| **質問-4-A** | エラーレスポンス構造でOKか？ | 🟢 低 | 10/11 17:00 |
| **質問-5-A** | 認証方式の選択 | 🟡 中 | 10/11 17:00 |
| **質問-5-B** | Rate Limitの仕様 | 🟢 低 | 10/11 17:00 |

---

## 📅 回答後のスケジュール（提案）

### パターンA: Phase 1実装のみ

| 日付 | 作業内容 | 担当 | 工数 |
|------|---------|------|------|
| 10/11（金） | VoiceDriveチームから回答受領 | VoiceDrive | - |
| 10/12（土）-10/13（日） | （週末） | - | - |
| 10/14（月） | API-1実装（部門マスタAPI） | 医療システム | 0.5日 |
| 10/14（月） | API-2実装（職員総数API） | 医療システム | 0.5日 |
| 10/15（火） | 単体テスト作成 | 医療システム | 0.5日 |
| 10/15（火） | API仕様書更新・共有 | 医療システム | 0.5日 |
| 10/16（水） | VoiceDriveチームとの統合テスト | 両チーム | 1日 |

**合計工数**: 2.5日

---

### パターンB: Phase 2実装込み（employmentType追加）

| 日付 | 作業内容 | 担当 | 工数 |
|------|---------|------|------|
| 10/11（金） | VoiceDriveチームから回答受領 | VoiceDrive | - |
| 10/12（土）-10/13（日） | （週末） | - | - |
| 10/14（月） | employmentTypeフィールド追加 | 医療システム | 0.5日 |
| 10/14（月） | マイグレーション実行 | 医療システム | 0.5日 |
| 10/15（火） | 既存データへの初期値設定 | 医療システム | 0.5日 |
| 10/15（火） | API-1実装（部門マスタAPI） | 医療システム | 0.5日 |
| 10/16（水） | API-2実装（職員総数API拡張版） | 医療システム | 0.5日 |
| 10/16（水） | 単体テスト作成 | 医療システム | 0.5日 |
| 10/17（木） | API仕様書更新・共有 | 医療システム | 0.5日 |
| 10/18（金） | VoiceDriveチームとの統合テスト | 両チーム | 1日 |

**合計工数**: 4.5日

---

## 📞 連絡体制

### 医療システムチーム
- **Slack**: #medical-system-integration
- **担当**: システム開発チーム
- **質問対応**: 平日 9:00-18:00

### VoiceDriveチーム
- **Slack**: #voicedrive-integration
- **担当**: システム開発チーム

### 共通
- **MCPサーバー共有フォルダ**: `mcp-shared/docs/`
- **定例会議**: 毎週月曜 10:00-11:00
- **緊急連絡**: Slack DM

---

## 🎯 回答フォーマット（コピー用）

以下のフォーマットをコピーして、ご回答ください：

```markdown
# OrganizationAnalytics API実装 質問への回答

**回答日**: 2025年10月11日
**回答者**: VoiceDriveチーム

---

## 質問-1-A: Phase 1実装（雇用形態区別なし）でOKか？
[X] 選択肢A: Phase 1実装でOK
[ ] 選択肢B: Phase 2実装が必須
[ ] 選択肢C: 暫定的にPosition判定
[ ] その他:

**補足コメント**:


---

## 質問-1-B: Phase 2の優先度と実装時期
[ ] 選択肢A: 即座に実装（API実装前）
[ ] 選択肢B: Phase 1実装後に実装
[X] 選択肢C: 将来実装（時期未定）
[ ] その他:

**補足コメント**:


---

## 質問-2-A: isActiveフィールドは必要か？
[X] 選択肢A: 不要（全部門を有効とみなす）
[ ] 選択肢B: 必要（フィールド追加してほしい）
[ ] 選択肢C: 将来的に必要（Phase 2で追加）
[ ] その他:

**補足コメント**:


---

## 質問-3-A: API-1のレスポンス構造でOKか？
[X] このレスポンス構造でOK（変更不要）
[ ] 以下の変更をお願いします:
    - フィールド名変更:
    - フィールド追加:
    - フィールド削除:

**補足コメント**:


---

## 質問-3-B: API-2のレスポンス構造でOKか？
[X] このレスポンス構造でOK（変更不要）
[ ] 以下の変更をお願いします:
    - byFacilityのキー: [ ] facilityId [X] facilityCode [ ] facilityName
    - byDepartmentのキー: [ ] departmentId [ ] departmentCode [X] departmentName
    - limitations: [X] 必要 [ ] 不要

**補足コメント**:


---

## 質問-4-A: エラーレスポンス構造でOKか？
[X] このエラーレスポンス構造でOK
[ ] 変更希望:

**補足コメント**:


---

## 質問-5-A: 認証方式の選択
[X] 提案A: JWT Bearer Token認証
    - JWT署名キー:
    - トークンペイロード構造:

[ ] 提案B: API Key認証
    - APIキー発行方法:

[ ] 提案C: OAuth 2.0 Client Credentials
    - クライアントID/シークレット発行方法:

[ ] その他:

**補足コメント**:


---

## 質問-5-B: Rate Limitの実装方式
[X] この仕様でOK
[ ] Rate Limitの数値を変更: req/min
[ ] Rate Limit不要
[ ] その他:

**補足コメント**:


---

## 総合コメント
（その他の要望、懸念事項等があればご記入ください）


```

---

## 🔗 関連ドキュメント

1. [organization-analytics_医療システム確認結果_20251010.md](./organization-analytics_医療システム確認結果_20251010.md) - 医療システム側の確認結果
2. [organization-analytics_医療システム連携要件確認書_20251010.md](./organization-analytics_医療システム連携要件確認書_20251010.md) - VoiceDriveからの要件定義
3. [organization-analytics_DB要件分析_20251010.md](./organization-analytics_DB要件分析_20251010.md) - VoiceDrive側のDB分析
4. [organization-analytics暫定マスターリスト_20251010.md](./organization-analytics暫定マスターリスト_20251010.md) - 実装チェックリスト
5. [prisma/schema.prisma](../../prisma/schema.prisma) - 医療システムDBスキーマ

---

**文書終了**

最終更新: 2025年10月10日
バージョン: 1.0
回答期限: 2025年10月11日（金）17:00
次回アクション: VoiceDriveチームからの回答受領後、API実装開始
