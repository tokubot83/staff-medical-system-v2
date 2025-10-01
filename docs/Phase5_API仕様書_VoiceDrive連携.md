# Phase 5 キャリア選択制度 API仕様書（VoiceDrive連携）

**作成日**: 2025年10月1日
**作成者**: 医療職員管理システム開発チーム
**対象**: VoiceDriveシステム開発チーム
**バージョン**: 1.0

---

## 📋 目次

1. [認証方式](#1-認証方式)
2. [エンドポイント一覧](#2-エンドポイント一覧)
3. [API詳細仕様](#3-api詳細仕様)
4. [エラーレスポンス](#4-エラーレスポンス)
5. [環境変数設定](#5-環境変数設定)
6. [データ型定義](#6-データ型定義)

---

## 1. 認証方式

### 1.1 VoiceDrive → 医療システム

**方式**: Bearer Token認証

VoiceDrive側でログイン中のユーザーのJWTトークンを使用します。

```http
Authorization: Bearer <VoiceDrive_JWT_Token>
```

### 1.2 医療システム → VoiceDrive (Webhook)

**方式**: API Key認証

医療システムからVoiceDriveへのWebhook通知時に使用します。

```http
Authorization: Bearer <VOICEDRIVE_API_KEY>
X-Medical-System-Version: 1.0
```

### 1.3 認証エラー

| ステータスコード | 説明 |
|----------------|------|
| 401 Unauthorized | トークンが無効または期限切れ |
| 403 Forbidden | 権限不足 |

---

## 2. エンドポイント一覧

| メソッド | エンドポイント | 説明 | 認証 |
|---------|---------------|------|------|
| GET | `/api/my-page` | マイページデータ取得 | VoiceDrive JWT |
| GET | `/api/career-courses/definitions` | コース定義一覧取得 | VoiceDrive JWT |
| POST | `/api/career-course/change-request` | コース変更申請送信 | VoiceDrive JWT |
| GET | `/api/career-course/my-requests` | 申請履歴取得 | VoiceDrive JWT |

**※ Webhook通知**: 医療システム → VoiceDrive への通知は、VoiceDrive側でエンドポイントを実装してください。

---

## 3. API詳細仕様

### 3.1 マイページデータ取得

#### リクエスト

```http
GET /api/my-page
Authorization: Bearer <VoiceDrive_JWT_Token>
```

#### レスポンス (200 OK)

```json
{
  "id": "OH-NS-2021-001",
  "name": "山田 花子",
  "nameInitial": "YH",
  "position": "看護師",
  "department": "3階病棟",
  "facility": "小原病院",
  "employeeId": "OH-NS-2021-001",
  "joinDate": "2021-04-01",
  "tenure": "3年6ヶ月",
  "age": 29,
  "email": "yamada.hanako@example.com",
  "phone": "090-1234-5678",
  "careerCourse": {
    "id": "cc-001",
    "staffId": "OH-NS-2021-001",
    "courseCode": "B",
    "courseName": "Bコース（施設内協力型）",
    "effectiveFrom": "2025-04-01",
    "effectiveTo": null,
    "nextChangeAvailableDate": "2026-03-01",
    "specialChangeReason": null,
    "specialChangeNote": null,
    "approvedAt": "2025-03-25T10:00:00Z",
    "approvedBy": "HR-001",
    "approvalStatus": "approved",
    "createdAt": "2025-03-01T09:00:00Z",
    "updatedAt": "2025-03-25T10:00:00Z"
  }
}
```

#### フィールド説明

| フィールド | 型 | 説明 |
|-----------|---|------|
| careerCourse.courseCode | 'A' \| 'B' \| 'C' \| 'D' | コースコード |
| careerCourse.nextChangeAvailableDate | string | 次回変更可能日（YYYY-MM-DD） |
| careerCourse.approvalStatus | 'pending' \| 'approved' \| 'rejected' | 承認ステータス |

---

### 3.2 コース定義一覧取得

#### リクエスト

```http
GET /api/career-courses/definitions
Authorization: Bearer <VoiceDrive_JWT_Token>
```

#### レスポンス (200 OK)

```json
[
  {
    "id": "course-def-a",
    "courseCode": "A",
    "courseName": "Aコース（全面協力型）",
    "description": "部署・施設間異動に全面協力し、管理職候補として育成対象。転居を伴う転勤も受諾。夜勤あり。",
    "departmentTransferAvailable": true,
    "facilityTransferAvailable": "full",
    "nightShiftAvailable": "required",
    "managementTrack": true,
    "baseSalaryMultiplier": 1.2,
    "isActive": true,
    "displayOrder": 1
  },
  {
    "id": "course-def-b",
    "courseCode": "B",
    "courseName": "Bコース（施設内協力型）",
    "description": "同一施設内の部署異動（病棟移動等）に対応。施設間異動なし。管理職登用対象。夜勤あり。",
    "departmentTransferAvailable": true,
    "facilityTransferAvailable": "none",
    "nightShiftAvailable": "required",
    "managementTrack": true,
    "baseSalaryMultiplier": 1.1,
    "isActive": true,
    "displayOrder": 2
  }
]
```

#### フィールド説明

| フィールド | 型 | 説明 |
|-----------|---|------|
| facilityTransferAvailable | 'none' \| 'limited' \| 'full' | 施設間異動レベル |
| nightShiftAvailable | 'none' \| 'selectable' \| 'required' | 夜勤可否 |
| baseSalaryMultiplier | number | 基本給係数（例: 1.2 = 1.2倍） |

---

### 3.3 コース変更申請送信

#### リクエスト

```http
POST /api/career-course/change-request
Authorization: Bearer <VoiceDrive_JWT_Token>
Content-Type: application/json
```

```json
{
  "currentCourseCode": "B",
  "requestedCourseCode": "A",
  "changeReason": "annual",
  "reasonDetail": "管理職候補として、施設間異動を含む全面協力型コースへの変更を希望します。",
  "requestedEffectiveDate": "2026-04-01",
  "attachments": []
}
```

#### パラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| currentCourseCode | 'A' \| 'B' \| 'C' \| 'D' | ✅ | 現在のコース |
| requestedCourseCode | 'A' \| 'B' \| 'C' \| 'D' | ✅ | 希望コース |
| changeReason | string | ✅ | 変更事由 (下表参照) |
| reasonDetail | string | ✅ | 詳細理由（最大1000文字） |
| requestedEffectiveDate | string | ✅ | 希望適用日（YYYY-MM-DD、今日以降） |
| attachments | array | ※ | 添付ファイル（特例変更時は必須） |

**changeReason の値**:

| 値 | 説明 | 添付ファイル |
|---|------|------------|
| `annual` | 年1回定期変更 | 不要 |
| `special_pregnancy` | 特例: 妊娠・出産 | 必須 |
| `special_caregiving` | 特例: 介護 | 必須 |
| `special_illness` | 特例: 疾病 | 必須 |

#### レスポンス (201 Created)

```json
{
  "id": "req-20251001-001",
  "staffId": "OH-NS-2021-001",
  "currentCourseCode": "B",
  "requestedCourseCode": "A",
  "approvalStatus": "pending",
  "createdAt": "2025-10-01T10:30:00Z",
  "message": "申請を受け付けました。人事部の審査をお待ちください。"
}
```

#### エラーレスポンス (400 Bad Request)

```json
{
  "error": "特例変更の場合は証明書類の添付が必要です"
}
```

---

### 3.4 申請履歴取得

#### リクエスト

```http
GET /api/career-course/my-requests
Authorization: Bearer <VoiceDrive_JWT_Token>
```

#### レスポンス (200 OK)

```json
[
  {
    "id": "req-003",
    "staffId": "OH-NS-2021-001",
    "currentCourseCode": "B",
    "requestedCourseCode": "A",
    "changeReason": "annual",
    "reasonDetail": "管理職候補として...",
    "requestedEffectiveDate": "2026-04-01",
    "hrReviewerId": null,
    "hrReviewerName": null,
    "reviewedAt": null,
    "reviewComment": null,
    "approvalStatus": "pending",
    "rejectionReason": null,
    "attachments": [],
    "createdAt": "2025-09-25T10:30:00Z",
    "updatedAt": "2025-09-25T10:30:00Z"
  },
  {
    "id": "req-002",
    "staffId": "OH-NS-2021-001",
    "currentCourseCode": "C",
    "requestedCourseCode": "B",
    "changeReason": "annual",
    "reasonDetail": "部署異動に対応可能となったため...",
    "requestedEffectiveDate": "2025-04-01",
    "hrReviewerId": "HR-001",
    "hrReviewerName": "人事部長",
    "reviewedAt": "2024-03-20T15:00:00Z",
    "reviewComment": "職務能力を評価し、承認します。",
    "approvalStatus": "approved",
    "rejectionReason": null,
    "attachments": [],
    "createdAt": "2024-03-01T09:00:00Z",
    "updatedAt": "2024-03-20T15:00:00Z"
  }
]
```

#### ソート順

- 最新の申請が先頭（`createdAt` 降順）

---

## 4. エラーレスポンス

### 4.1 標準エラー形式

```json
{
  "error": "エラーメッセージ"
}
```

### 4.2 HTTPステータスコード

| コード | 説明 |
|-------|------|
| 200 | 成功 |
| 201 | 作成成功 |
| 400 | リクエストが不正 |
| 401 | 認証エラー |
| 403 | 権限不足 |
| 404 | リソースが見つからない |
| 500 | サーバーエラー |

---

## 5. 環境変数設定

### 5.1 VoiceDrive側

```env
# 医療システムAPIのベースURL
NEXT_PUBLIC_MEDICAL_SYSTEM_API=https://medical.system.local

# 医療システムからのWebhook認証用APIキー
MEDICAL_SYSTEM_API_KEY=vd_prod_key_A8B9C2D3E4F5G6H7I8J9K0L1M2N3O4P5
```

### 5.2 医療システム側

```env
# VoiceDriveへのWebhook通知URL
VOICEDRIVE_WEBHOOK_URL=https://voicedrive.system.local/api/career-course/notify

# VoiceDrive認証用APIキー
VOICEDRIVE_API_KEY=ms_prod_key_X1Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6

# 内部API認証キー
INTERNAL_API_KEY=internal-secret-key-change-in-production
```

---

## 6. データ型定義

### 6.1 TypeScript型定義（参考）

```typescript
export type CourseCode = 'A' | 'B' | 'C' | 'D';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'withdrawn';
export type FacilityTransferLevel = 'none' | 'limited' | 'full';
export type NightShiftAvailability = 'none' | 'selectable' | 'required';
export type ChangeReason = 'annual' | 'special_pregnancy' | 'special_caregiving' | 'special_illness';

export interface CareerCourseSelection {
  id: string;
  staffId: string;
  courseCode: CourseCode;
  courseName: string;
  effectiveFrom: string; // YYYY-MM-DD
  effectiveTo: string | null;
  nextChangeAvailableDate: string; // YYYY-MM-DD
  specialChangeReason: string | null;
  specialChangeNote: string | null;
  changeRequestedAt: string | null;
  changeRequestedBy: string | null;
  approvedAt: string | null;
  approvedBy: string | null;
  approvalStatus: ApprovalStatus;
  rejectionReason: string | null;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface CourseDefinition {
  id: string;
  courseCode: CourseCode;
  courseName: string;
  description: string;
  departmentTransferAvailable: boolean;
  facilityTransferAvailable: FacilityTransferLevel;
  relocationRequired: boolean;
  nightShiftAvailable: NightShiftAvailability;
  managementTrack: boolean;
  baseSalaryMultiplier: number;
  salaryGrade: number | null;
  salaryNotes: string | null;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChangeRequest {
  id: string;
  staffId: string;
  staffName?: string;
  facility?: string;
  department?: string;
  position?: string;
  currentCourseCode: CourseCode;
  requestedCourseCode: CourseCode;
  changeReason: ChangeReason;
  reasonDetail: string;
  requestedEffectiveDate: string; // YYYY-MM-DD
  hrReviewerId: string | null;
  hrReviewerName: string | null;
  reviewedAt: string | null;
  reviewComment: string | null;
  approvalStatus: ApprovalStatus;
  rejectionReason: string | null;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}
```

---

## 7. Webhook通知（医療システム → VoiceDrive）

### 7.1 VoiceDrive側で実装が必要なエンドポイント

```
POST /api/career-course/notify
```

### 7.2 リクエストヘッダー

```http
Authorization: Bearer <VOICEDRIVE_API_KEY>
X-Medical-System-Version: 1.0
Content-Type: application/json
```

### 7.3 リクエストボディ（承認時）

```json
{
  "type": "course_change_approved",
  "staffId": "OH-NS-2021-001",
  "requestId": "req-003",
  "approvedCourse": "A",
  "effectiveDate": "2026-04-01",
  "reviewComment": "管理職候補として適性を認めます。"
}
```

### 7.4 リクエストボディ（却下時）

```json
{
  "type": "course_change_rejected",
  "staffId": "OH-NS-2021-001",
  "requestId": "req-003",
  "rejectionReason": "現在の勤務状況から、来年度の変更が望ましいと判断しました。",
  "reviewComment": "再度、2027年4月での変更申請をご検討ください。"
}
```

### 7.5 VoiceDrive側の処理

1. 認証確認（`Authorization` ヘッダー検証）
2. staffIdの職員にプッシュ通知送信
3. 通知センターに追加
4. メール通知（オプション）

### 7.6 レスポンス (200 OK)

```json
{
  "success": true,
  "notificationSent": true
}
```

---

## 8. 開発環境での動作確認

### 8.1 モックデータ

現在、医療システムAPIは**モックデータ**で動作しています。

- 認証チェック: コメントアウト済み
- DB接続: コメントアウト済み
- レスポンス: 固定のモックデータ

### 8.2 共通DB構築後の対応

共通DB構築後、以下の作業が必要です：

1. 認証処理の有効化
2. Supabase接続の有効化
3. 実データによるテスト
4. 環境変数の本番設定

---

## 9. セキュリティ考慮事項

### 9.1 個人情報保護

- APIレスポンスには必要最小限の情報のみ含める
- 添付ファイルはプライベートストレージに保存
- アクセスログを記録

### 9.2 認証・認可

- JWT有効期限チェック
- APIキーのローテーション（3ヶ月ごと推奨）
- IPホワイトリスト（本番環境）

### 9.3 監査証跡

- 全API呼び出しのログ記録
- 申請・審査操作の記録
- ログ保存期間: 3年

---

## 10. サポート・問い合わせ

**医療システム開発チーム**
- Slack: #phase5-medical-system
- Email: medical-system-dev@example.com
- 担当: Claude Code (AI開発支援)

**報告書作成日**: 2025年10月1日
**次回更新予定**: 共通DB構築後

---

*本API仕様書は開発中のドキュメントです。変更があり次第、随時更新します。*
