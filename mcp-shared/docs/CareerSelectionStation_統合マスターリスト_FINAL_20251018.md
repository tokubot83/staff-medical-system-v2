# CareerSelectionStation（キャリア選択ステーション）統合マスターリスト - 最終版

**文書番号**: MASTER-CS-2025-1018-FINAL
**作成日**: 2025年10月18日
**最終更新**: 2025年10月18日
**対象システム**: 医療職員管理システム + VoiceDrive v100
**対象機能**: A/B/C/Dキャリアコース選択・変更申請システム
**Phase番号**: Phase 22（マスタープラン統合用）
**ステータス**: ✅ 最終承認済み・マスタープラン統合準備完了

---

## 📋 エグゼクティブサマリー

### プロジェクト概要

医療職員が自身のワークライフバランスとキャリア志向に応じて、4つのキャリアコース（A/B/C/D）を選択・変更できるシステムを構築します。

**キャリアコース概要**:
- **Aコース**: フルタイム・管理職志向・全施設転勤可能
- **Bコース**: フルタイム・現場志向・施設内異動のみ
- **Cコース**: 時短勤務・夜勤なし（育児・介護等）
- **Dコース**: パートタイム・柔軟勤務

### データ管理責任分界点（SSOT）

**Single Source of Truth**: **医療職員管理システム**

| データ項目 | データ管理責任 | 理由 |
|-----------|--------------|------|
| コース定義マスタ | 医療システム | 給与体系・人事制度と密接に連携 |
| コース選択履歴 | 医療システム | 人事マスタの一部として管理 |
| 変更申請データ | 医療システム | 人事承認プロセスの一部 |
| 添付ファイル（医療証明書等） | 医療システム（AWS S3） | 個人情報保護の観点から医療システムで一元管理 |

**VoiceDriveの役割**: 表示専用（APIを通じてリアルタイムにデータ取得）

### データ保持期間

**🔴 重要**: **全期間保存（削除なし）**

**理由**:
1. **Phase 19（CultureDevelopment）と同じポリシーで統一**
2. **長期的なキャリア開発分析**に全履歴が必要
3. 特別事由（妊娠・介護・疾病）によるコース変更の**長期影響分析**に必須
4. A/B/C/Dコース間の移動パターン分析には**10年以上のデータ**が必要な場合がある
5. 組織の人事戦略、キャリア開発施策の**効果測定**に長期データが不可欠
6. ストレージコストよりも**分析価値が高い**

**保持対象データ**:
- ✅ コース定義マスタ（全世代・全バージョン）
- ✅ コース選択履歴（全職員・全期間）
- ✅ 変更申請（承認済み・却下済み・取り下げ済み全て）
- ✅ 添付ファイル（AWS S3、全期間保持）

**削除ポリシー**:
- ❌ 定期削除なし
- ⚠️ 個人情報保護法に基づく削除要請があった場合のみ、個別対応

### マスタープラン統合情報

**Phase 22として統合**:
- **フェーズ名**: キャリア選択ステーション統合実装
- **新規テーブル数（医療システム側）**: **3テーブル**
- **新規テーブル数（VoiceDrive側）**: **0テーブル**（表示専用）
- **Phase 1.6 統合DB構築テーブル数更新**: **159 → 162テーブル**
- **データ保持ポリシー**: **全期間保存（削除なし）**
- **実装優先度**: 🟡 MEDIUM（Phase 18-21の後に実装）
- **総工数見積**: 22-31人日（医療システム: 17-24人日、VoiceDrive: 5-7人日）

---

## 🗄️ データベース設計

### 医療システム側: 3テーブル（新規追加）

#### テーブル1: career_course_definitions（コース定義マスタ）

**役割**: A/B/C/Dの4コースの定義と条件を管理

**テーブル名（MySQL）**: `career_course_definitions`

**SQL定義**:
```sql
CREATE TABLE career_course_definitions (
  id VARCHAR(36) PRIMARY KEY COMMENT 'UUID',

  -- コース識別
  course_code ENUM('A', 'B', 'C', 'D') NOT NULL UNIQUE COMMENT 'コースコード',
  course_name VARCHAR(100) NOT NULL COMMENT 'コース名',
  description TEXT COMMENT 'コース説明',

  -- 勤務条件
  department_transfer_available BOOLEAN DEFAULT TRUE COMMENT '部署異動可否',
  facility_transfer_level ENUM('none', 'limited', 'full') DEFAULT 'none' COMMENT '施設間異動レベル',
  relocation_required BOOLEAN DEFAULT FALSE COMMENT '転居を伴う異動の可能性',
  night_shift_available ENUM('none', 'selectable', 'required') DEFAULT 'selectable' COMMENT '夜勤の可否',
  holiday_work_available BOOLEAN DEFAULT TRUE COMMENT '休日勤務可否',
  management_track BOOLEAN DEFAULT FALSE COMMENT '管理職トラック',

  -- 給与情報
  base_salary_multiplier DECIMAL(3,2) DEFAULT 1.00 COMMENT '基本給倍率',
  salary_grade INT COMMENT '給与グレード',
  salary_notes TEXT COMMENT '給与に関する備考',

  -- 表示制御
  is_active BOOLEAN DEFAULT TRUE COMMENT '有効/無効',
  display_order INT DEFAULT 0 COMMENT '表示順',

  -- メタデータ
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',

  INDEX idx_is_active (is_active),
  INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='キャリアコース定義マスタ';
```

**初期データ（4コース）**:
```sql
INSERT INTO career_course_definitions
  (id, course_code, course_name, description, facility_transfer_level, night_shift_available, management_track, base_salary_multiplier, display_order)
VALUES
  (UUID(), 'A', 'フルキャリアコース', '管理職志向・全施設転勤可能・夜勤あり', 'full', 'required', TRUE, 1.20, 1),
  (UUID(), 'B', 'スペシャリストコース', '現場志向・施設内異動のみ・夜勤あり', 'limited', 'required', FALSE, 1.10, 2),
  (UUID(), 'C', 'ワークライフバランスコース', '時短勤務・夜勤なし（育児・介護等）', 'none', 'none', FALSE, 0.80, 3),
  (UUID(), 'D', 'フレキシブルコース', 'パートタイム・柔軟勤務', 'none', 'selectable', FALSE, 0.70, 4);
```

**フィールド数**: 14フィールド

---

#### テーブル2: career_course_selections（コース選択履歴）

**役割**: 職員のコース選択履歴を管理（全期間保存）

**テーブル名（MySQL）**: `career_course_selections`

**SQL定義**:
```sql
CREATE TABLE career_course_selections (
  id VARCHAR(36) PRIMARY KEY COMMENT 'UUID',

  -- 職員識別
  user_id VARCHAR(36) NOT NULL COMMENT '職員ID',

  -- コース情報
  course_code ENUM('A', 'B', 'C', 'D') NOT NULL COMMENT 'コースコード',

  -- 有効期間
  effective_from DATE NOT NULL COMMENT '適用開始日',
  effective_to DATE DEFAULT NULL COMMENT '適用終了日（NULLの場合は現在も有効）',
  is_current BOOLEAN DEFAULT TRUE COMMENT '現在のコースか（パフォーマンス最適化用）',

  -- 変更制限
  next_change_available_date DATE COMMENT '次回変更可能日（年1回制限）',

  -- 特別事由
  special_change_reason ENUM('pregnancy', 'caregiving', 'illness', 'other') COMMENT '特別変更事由',
  special_change_note TEXT COMMENT '特別変更事由の詳細',

  -- 選択理由
  selection_reason TEXT COMMENT '選択理由（任意）',

  -- 承認情報
  approved_by VARCHAR(36) COMMENT '承認者ID（人事部門）',
  approved_at TIMESTAMP COMMENT '承認日時',

  -- 変更申請情報
  change_requested_at TIMESTAMP COMMENT '変更申請日時',
  change_requested_by VARCHAR(50) COMMENT '変更申請者（通常は本人）',
  rejection_reason TEXT COMMENT '却下理由（却下された場合）',

  -- メタデータ
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',

  INDEX idx_user_id (user_id),
  INDEX idx_course_code (course_code),
  INDEX idx_is_current (is_current),
  INDEX idx_effective_from (effective_from),
  INDEX idx_effective_to (effective_to),
  INDEX idx_next_change_available (next_change_available_date),

  FOREIGN KEY (user_id) REFERENCES employees(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='キャリアコース選択履歴（全期間保存）';
```

**フィールド数**: 18フィールド

**重要ポイント**:
- `is_current`フィールド追加により、現在のコースを高速取得可能
- `next_change_available_date`で年1回制限を実装
- 特別事由（妊娠・介護・疾病）の場合は年1回制限を適用しない

---

#### テーブル3: career_course_change_requests（コース変更申請）

**役割**: コース変更申請とその承認プロセスを管理

**テーブル名（MySQL）**: `career_course_change_requests`

**SQL定義**:
```sql
CREATE TABLE career_course_change_requests (
  id VARCHAR(36) PRIMARY KEY COMMENT 'UUID',

  -- 申請者
  user_id VARCHAR(36) NOT NULL COMMENT '職員ID',

  -- コース変更情報
  current_course_code ENUM('A', 'B', 'C', 'D') NOT NULL COMMENT '現在のコース',
  requested_course_code ENUM('A', 'B', 'C', 'D') NOT NULL COMMENT '希望コース',

  -- 変更理由
  change_reason ENUM('annual', 'special_pregnancy', 'special_caregiving', 'special_illness') NOT NULL COMMENT '変更理由',
  reason_detail TEXT NOT NULL COMMENT '変更理由の詳細',

  -- 希望適用日
  requested_effective_date DATE NOT NULL COMMENT '希望適用開始日',

  -- 添付ファイル（JSON配列）
  attachments JSON COMMENT '添付ファイル情報（妊娠証明書、介護認定書等）',
  -- JSON形式例: [{"filename": "maternity_cert.pdf", "s3_key": "pregnancy/emp123/req456/maternity_cert.pdf", "uploaded_at": "2025-10-01T10:00:00Z"}]

  -- 申請ステータス
  status ENUM('pending', 'approved', 'rejected', 'withdrawn') DEFAULT 'pending' COMMENT 'ステータス',

  -- 承認/却下情報
  hr_reviewer_id VARCHAR(50) COMMENT '人事担当者ID',
  reviewed_at TIMESTAMP COMMENT '審査日時',
  approval_note TEXT COMMENT '承認/却下時のコメント',
  rejection_reason TEXT COMMENT '却下理由',

  -- 取り下げ情報
  withdrawn_at TIMESTAMP COMMENT '取り下げ日時',
  withdrawn_reason TEXT COMMENT '取り下げ理由',

  -- メタデータ
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '申請日時',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',

  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_change_reason (change_reason),
  INDEX idx_requested_effective_date (requested_effective_date),
  INDEX idx_created_at (created_at),

  FOREIGN KEY (user_id) REFERENCES employees(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='キャリアコース変更申請（全期間保存）';
```

**フィールド数**: 16フィールド

**重要ポイント**:
- `attachments`はJSON形式で複数ファイル対応
- `withdrawn_at`で申請取り下げ記録が可能
- `hr_reviewer_id`で人事部門の承認プロセスを追跡

---

### VoiceDrive側: 0テーブル（表示専用）

VoiceDrive側では新規テーブルを追加せず、医療システムのAPIから全データを取得して表示のみ行います。

**理由**:
- データの一貫性を保つため（Single Source of Truth）
- 医療システムの人事マスタと密接に連携
- リアルタイム性が重要（即座に反映）

---

## 🔌 API仕様（v2エンドポイント）

### API-1: 職員のキャリアコース情報取得

**エンドポイント**: `GET /api/v2/employees/{employeeId}/career-course`

**リクエスト例**:
```http
GET /api/v2/employees/emp_123456/career-course HTTP/1.1
Host: medical-system.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**レスポンス例**:
```json
{
  "employeeId": "emp_123456",
  "employeeName": "山田 太郎",
  "currentCourse": {
    "courseCode": "B",
    "courseName": "スペシャリストコース",
    "effectiveFrom": "2024-04-01",
    "effectiveTo": null,
    "nextChangeAvailableDate": "2025-04-01",
    "selectionReason": "現場でのスペシャリストとして成長したい",
    "approvedBy": "hr_manager_001",
    "approvedAt": "2024-03-25T14:30:00Z"
  },
  "courseHistory": [
    {
      "courseCode": "A",
      "courseName": "フルキャリアコース",
      "effectiveFrom": "2023-04-01",
      "effectiveTo": "2024-03-31",
      "selectionReason": "入職時の初期設定"
    }
  ],
  "canChangeNow": false,
  "changeRestrictionReason": "次回変更可能日: 2025-04-01（年1回制限）"
}
```

**認証**: JWT（Bearer Token）
**権限**: 本人または人事部門（Level 15+）のみアクセス可

---

### API-2: コース定義マスタ取得

**エンドポイント**: `GET /api/v2/career-course/definitions`

**リクエスト例**:
```http
GET /api/v2/career-course/definitions HTTP/1.1
Host: medical-system.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**レスポンス例**:
```json
{
  "courses": [
    {
      "courseCode": "A",
      "courseName": "フルキャリアコース",
      "description": "管理職志向・全施設転勤可能・夜勤あり",
      "conditions": {
        "departmentTransferAvailable": true,
        "facilityTransferLevel": "full",
        "relocationRequired": true,
        "nightShiftAvailable": "required",
        "holidayWorkAvailable": true,
        "managementTrack": true
      },
      "salary": {
        "baseSalaryMultiplier": 1.20,
        "salaryGrade": 5,
        "salaryNotes": "管理職手当別途支給"
      },
      "isActive": true,
      "displayOrder": 1
    },
    {
      "courseCode": "B",
      "courseName": "スペシャリストコース",
      "description": "現場志向・施設内異動のみ・夜勤あり",
      "conditions": {
        "departmentTransferAvailable": true,
        "facilityTransferLevel": "limited",
        "relocationRequired": false,
        "nightShiftAvailable": "required",
        "holidayWorkAvailable": true,
        "managementTrack": false
      },
      "salary": {
        "baseSalaryMultiplier": 1.10,
        "salaryGrade": 4,
        "salaryNotes": "専門職手当別途支給"
      },
      "isActive": true,
      "displayOrder": 2
    },
    {
      "courseCode": "C",
      "courseName": "ワークライフバランスコース",
      "description": "時短勤務・夜勤なし（育児・介護等）",
      "conditions": {
        "departmentTransferAvailable": false,
        "facilityTransferLevel": "none",
        "relocationRequired": false,
        "nightShiftAvailable": "none",
        "holidayWorkAvailable": false,
        "managementTrack": false
      },
      "salary": {
        "baseSalaryMultiplier": 0.80,
        "salaryGrade": 3,
        "salaryNotes": "時短勤務のため基本給80%"
      },
      "isActive": true,
      "displayOrder": 3
    },
    {
      "courseCode": "D",
      "courseName": "フレキシブルコース",
      "description": "パートタイム・柔軟勤務",
      "conditions": {
        "departmentTransferAvailable": false,
        "facilityTransferLevel": "none",
        "relocationRequired": false,
        "nightShiftAvailable": "selectable",
        "holidayWorkAvailable": true,
        "managementTrack": false
      },
      "salary": {
        "baseSalaryMultiplier": 0.70,
        "salaryGrade": 2,
        "salaryNotes": "パートタイム給与体系"
      },
      "isActive": true,
      "displayOrder": 4
    }
  ],
  "retrievedAt": "2025-10-18T10:00:00Z"
}
```

**認証**: JWT（Bearer Token）
**権限**: 全職員アクセス可

---

### API-3: コース変更申請

**エンドポイント**: `POST /api/v2/career-course/change-request`

**リクエスト例**:
```http
POST /api/v2/career-course/change-request HTTP/1.1
Host: medical-system.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "requestedCourseCode": "C",
  "changeReason": "special_pregnancy",
  "reasonDetail": "第一子妊娠のため、夜勤なしのコースへ変更を希望します。予定日は2026年3月15日です。",
  "requestedEffectiveDate": "2025-12-01",
  "attachments": [
    {
      "filename": "maternity_certificate.pdf",
      "s3Key": "pregnancy/emp_123456/req_789/maternity_certificate.pdf",
      "uploadedAt": "2025-10-18T09:30:00Z"
    }
  ]
}
```

**レスポンス例**:
```json
{
  "requestId": "req_789",
  "status": "pending",
  "message": "変更申請を受け付けました。人事部門の審査をお待ちください。",
  "estimatedReviewDate": "2025-10-25",
  "createdAt": "2025-10-18T10:00:00Z"
}
```

**バリデーションルール**:
1. **年1回制限チェック**: `next_change_available_date`を超えているか確認
2. **特別事由の場合は制限なし**: `change_reason`が`special_*`の場合はチェック不要
3. **添付ファイル必須チェック**: 特別事由の場合は証明書が必須
4. **有効日チェック**: 申請日から最低14日後以降を指定

**認証**: JWT（Bearer Token）
**権限**: 本人のみ申請可

---

### API-4: 自分の申請一覧取得

**エンドポイント**: `GET /api/v2/career-course/my-requests`

**リクエスト例**:
```http
GET /api/v2/career-course/my-requests?status=all HTTP/1.1
Host: medical-system.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**クエリパラメータ**:
- `status`: `all` | `pending` | `approved` | `rejected` | `withdrawn`（デフォルト: `all`）

**レスポンス例**:
```json
{
  "requests": [
    {
      "requestId": "req_789",
      "currentCourseCode": "B",
      "requestedCourseCode": "C",
      "changeReason": "special_pregnancy",
      "reasonDetail": "第一子妊娠のため、夜勤なしのコースへ変更を希望します。",
      "requestedEffectiveDate": "2025-12-01",
      "status": "pending",
      "attachments": [
        {
          "filename": "maternity_certificate.pdf",
          "downloadUrl": "https://medical-system.example.com/api/v2/career-course/attachments/download?key=pregnancy/emp_123456/req_789/maternity_certificate.pdf&token=...",
          "uploadedAt": "2025-10-18T09:30:00Z"
        }
      ],
      "createdAt": "2025-10-18T10:00:00Z",
      "reviewedAt": null,
      "hrReviewerName": null
    },
    {
      "requestId": "req_456",
      "currentCourseCode": "A",
      "requestedCourseCode": "B",
      "changeReason": "annual",
      "reasonDetail": "現場でのスペシャリストとして成長したい",
      "requestedEffectiveDate": "2024-04-01",
      "status": "approved",
      "attachments": [],
      "createdAt": "2024-03-20T14:00:00Z",
      "reviewedAt": "2024-03-25T14:30:00Z",
      "hrReviewerName": "人事部 佐藤"
    }
  ],
  "total": 2
}
```

**認証**: JWT（Bearer Token）
**権限**: 本人のみアクセス可

---

## 🔔 Webhook仕様（dot.notation）

### Webhook-1: career_course.change_approved

**トリガー**: 人事部門がコース変更申請を承認した時

**送信先**: VoiceDriveシステム

**HTTPメソッド**: `POST`

**送信URL**: `https://voicedrive-v100.vercel.app/api/webhooks/career-course/change-approved`

**ペイロード例**:
```json
{
  "event": "career_course.change_approved",
  "timestamp": "2025-10-25T15:30:00Z",
  "data": {
    "requestId": "req_789",
    "employeeId": "emp_123456",
    "employeeName": "山田 太郎",
    "previousCourseCode": "B",
    "newCourseCode": "C",
    "effectiveDate": "2025-12-01",
    "changeReason": "special_pregnancy",
    "approvedBy": "hr_manager_002",
    "approvedAt": "2025-10-25T15:30:00Z",
    "approvalNote": "妊娠証明書を確認しました。12月1日からCコースへ変更します。"
  },
  "signature": "a3f5b8c2d1e4f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1"
}
```

**署名検証**: HMAC-SHA256

**VoiceDrive側の処理**:
1. 署名検証
2. 通知をユーザーのダッシュボードに表示
3. PersonalStationページに反映

---

### Webhook-2: career_course.change_rejected

**トリガー**: 人事部門がコース変更申請を却下した時

**送信先**: VoiceDriveシステム

**HTTPメソッド**: `POST`

**送信URL**: `https://voicedrive-v100.vercel.app/api/webhooks/career-course/change-rejected`

**ペイロード例**:
```json
{
  "event": "career_course.change_rejected",
  "timestamp": "2025-10-25T15:45:00Z",
  "data": {
    "requestId": "req_800",
    "employeeId": "emp_234567",
    "employeeName": "鈴木 花子",
    "requestedCourseCode": "D",
    "rejectionReason": "現在の部署の人員配置上、コース変更が難しい状況です。来年度の申請をお願いします。",
    "rejectedBy": "hr_manager_002",
    "rejectedAt": "2025-10-25T15:45:00Z"
  },
  "signature": "b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a2b4c6"
}
```

**署名検証**: HMAC-SHA256

**VoiceDrive側の処理**:
1. 署名検証
2. 却下理由を通知
3. PersonalStationページに反映
4. 再申請を促すメッセージ表示

---

## ☁️ ストレージ設計（AWS S3）

### バケット構成

**バケット名**: `medical-system-career-course-attachments`

**リージョン**: `ap-northeast-1`（東京）

**ディレクトリ構造**:
```
s3://medical-system-career-course-attachments/
  ├── pregnancy/                  # 妊娠関連証明書
  │   └── {employeeId}/
  │       └── {requestId}/
  │           ├── maternity_certificate.pdf
  │           └── doctor_letter.pdf
  ├── caregiving/                 # 介護関連証明書
  │   └── {employeeId}/
  │       └── {requestId}/
  │           ├── caregiving_certificate.pdf
  │           └── care_level_notification.pdf
  └── illness/                    # 疾病関連証明書
      └── {employeeId}/
          └── {requestId}/
              ├── medical_certificate.pdf
              └── diagnosis_report.pdf
```

### アクセス制御

**IAMポリシー**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789012:role/MedicalSystemAPIRole"
      },
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::medical-system-career-course-attachments/*"
    }
  ]
}
```

**アクセス権限**:
- ✅ 本人: 自分の申請に関連するファイルのみアクセス可
- ✅ 人事部門（Level 15+）: 全ファイルアクセス可
- ❌ その他: アクセス不可

**署名付きURL**:
- 有効期限: 24時間
- ダウンロード専用（変更・削除不可）

### 保持期間とコスト最適化

**保持期間**: **全期間保存（削除なし）**

**ストレージクラス**: S3 Intelligent-Tiering

**アクセス頻度に応じた自動階層化**:
- 30日間アクセスなし → Infrequent Access Tier
- 90日間アクセスなし → Archive Instant Access Tier
- 180日間アクセスなし → Archive Access Tier

**コスト試算**:
- 初年度: 月額約$50-100（250名×年間50件申請×2MB/ファイル）
- 5年後: 月額約$300（累積データ増加、ただしInfrequent Access移行により単価減）

**暗号化**:
- サーバーサイド暗号化（SSE-S3、AES-256）
- 転送中の暗号化（HTTPS必須）

---

## 📅 実装Phase計画

### Phase 1: 医療システム側DB構築（3-4人日）

**期間**: 3-4営業日

**担当**: 医療システムチーム

**タスク**:
| タスク | 内容 | 工数 |
|--------|-----|------|
| テーブル設計レビュー | 3テーブルの最終確認 | 0.5日 |
| SQLマイグレーション作成 | CREATE TABLE文作成 | 1.0日 |
| 初期データ投入 | 4コースのマスタデータ | 0.5日 |
| テスト環境適用 | マイグレーション実行確認 | 0.5日 |
| 単体テスト | テーブル制約のテスト | 0.5日 |

**完了条件**:
- ✅ 3テーブルがテスト環境に作成済み
- ✅ 4コースの初期データ投入済み
- ✅ 外部キー制約が正常動作

---

### Phase 2: API実装（7-9人日）

**期間**: 7-9営業日

**担当**: 医療システムチーム

**タスク**:
| タスク | 内容 | 工数 |
|--------|-----|------|
| API-1実装 | GET /api/v2/employees/{employeeId}/career-course | 2-3日 |
| API-2実装 | GET /api/v2/career-course/definitions | 1日 |
| API-3実装 | POST /api/v2/career-course/change-request | 3-4日 |
| API-4実装 | GET /api/v2/career-course/my-requests | 1-2日 |

**API-3の詳細タスク**:
1. 年1回制限チェックロジック（0.5日）
2. 特別事由の判定ロジック（0.5日）
3. S3ファイルアップロード処理（1日）
4. バリデーション実装（0.5日）
5. エラーハンドリング（0.5日）

**完了条件**:
- ✅ 4APIエンドポイントが動作
- ✅ JWT認証が正常動作
- ✅ バリデーションが正常動作
- ✅ S3アップロードが正常動作

---

### Phase 3: Webhook実装（2-4人日）

**期間**: 2-4営業日

**担当**: 医療システムチーム

**タスク**:
| タスク | 内容 | 工数 |
|--------|-----|------|
| Webhook送信基盤実装 | HMAC-SHA256署名、リトライ機構 | 1-2日 |
| career_course.change_approved実装 | 承認時Webhook | 0.5-1日 |
| career_course.change_rejected実装 | 却下時Webhook | 0.5-1日 |

**完了条件**:
- ✅ Webhook送信が正常動作
- ✅ HMAC-SHA256署名検証が成功
- ✅ リトライ機構が動作（3回まで）

---

### Phase 4: VoiceDrive側実装（5人日）

**期間**: 5営業日

**担当**: VoiceDriveチーム

**重要**: VoiceDriveチームから回答書受領により、**独立ページ構成が既に実装済み**であることが判明

**タスク**:
| タスク | 内容 | 工数 |
|--------|-----|------|
| Webhook受信エンドポイント実装 | 2種類（承認・却下）、HMAC署名検証 | 1人日 |
| メール通知テンプレート作成 | 承認・却下の2テンプレート | 1人日 |
| APIサービスのモック削除 | 実API接続、環境変数設定 | 1人日 |
| 統合テスト | 4シナリオ（通常・特例・却下・取り下げ） | 2人日 |

**既存実装（確認のみ、追加工数なし）**:
1. ✅ CareerSelectionStationPage.tsx（マイキャリアページ）- 既存
2. ✅ ChangeRequestPage.tsx（コース変更申請ページ）- 既存
3. ✅ MyRequestsPage.tsx（申請履歴ページ）- 既存
4. ✅ careerCourseService.ts（APIサービス、モック実装）- 実API接続のみ必要

**VoiceDriveチームからの回答内容**:
- **確認-1**: PersonalStation配置位置 → **独立ページとして実装済み**（`/career-selection-station`）
- **確認-2**: 申請フォームUI形式 → **独立ページ形式（既存実装）**（`/career-selection-station/change-request`）
- **確認-3**: Webhook後のUI更新 → **Option A採用**（メール通知 + 次回アクセス時反映）

**完了条件**:
- ✅ Webhook受信エンドポイントが動作
- ✅ HMAC署名検証が成功
- ✅ メール通知が送信される
- ✅ 次回ページアクセス時に最新データが反映される

---

### Phase 5: 統合テスト（3-4人日）

**期間**: 3-4営業日

**担当**: 医療システム + VoiceDrive合同

**タスク**:
| タスク | 内容 | 工数 |
|--------|-----|------|
| API統合テスト | 4エンドポイントの動作確認 | 1日 |
| Webhook統合テスト | 2種類のWebhook送受信確認 | 1日 |
| E2Eテスト | 申請〜承認〜通知の全フロー | 1-2日 |

**テストシナリオ**:
1. **年1回変更申請（通常）**: Bコース → Aコース
2. **特別事由（妊娠）**: Aコース → Cコース
3. **却下シナリオ**: Cコース → Aコース（人員配置の都合で却下）
4. **申請取り下げ**: 申請後に自分で取り下げ

**完了条件**:
- ✅ 全APIが正常動作
- ✅ 全Webhookが正常動作
- ✅ E2Eテスト全シナリオ成功

---

## 💰 工数見積サマリー

### 医療システム側

| Phase | タスク | 工数（人日） |
|-------|--------|------------|
| Phase 1 | DB構築 | 3-4 |
| Phase 2 | API実装（4エンドポイント） | 7-9 |
| Phase 3 | Webhook実装（2種類） | 2-4 |
| Phase 5 | 統合テスト（合同） | 2-3 |
| **医療システム合計** | | **14-20人日** |

**バッファ含む総工数**: **17-24人日**（バッファ率: 20%）

---

### VoiceDrive側

| Phase | タスク | 工数（人日） |
|-------|--------|------------|
| Phase 4 | Webhook受信エンドポイント実装 | 1 |
| Phase 4 | メール通知テンプレート作成 | 1 |
| Phase 4 | APIサービスのモック削除 | 1 |
| Phase 4 | 統合テスト（VoiceDrive側） | 2 |
| Phase 5 | 統合テスト（合同） | 1 |
| **VoiceDrive合計** | | **6人日** |

**バッファ含む総工数**: **5-7人日**（バッファ率: 20%）

**重要**: VoiceDrive側の独立ページ構成（3ページ）は既に実装済みのため、PersonalStation統合・変更申請UI実装の工数は不要

---

### 全体合計

**総工数**: **22-31人日**（約4-6週間）

---

## 🔐 セキュリティ要件

### 認証・認可

1. **JWT認証**: 全APIエンドポイントでBearer Token必須
2. **権限チェック**:
   - 本人のみアクセス可: API-1（自分のデータのみ）、API-3、API-4
   - 人事部門（Level 15+）: 全職員のデータアクセス可
3. **CORS設定**: VoiceDriveドメインからのみアクセス許可

### データ保護

1. **個人情報保護**:
   - 添付ファイル（医療証明書）の暗号化（S3 SSE-S3）
   - アクセスログ監査（CloudWatch Logs）
2. **HTTPS必須**: 全通信をTLS 1.2以上で暗号化
3. **署名付きURL**: ファイルダウンロードは24時間有効の署名付きURL

### Webhook署名検証

**HMAC-SHA256署名**:
```typescript
// 医療システム側（送信）
const signature = crypto
  .createHmac('sha256', WEBHOOK_SECRET)
  .update(JSON.stringify(payload))
  .digest('hex');

// VoiceDrive側（検証）
const expectedSignature = crypto
  .createHmac('sha256', WEBHOOK_SECRET)
  .update(JSON.stringify(req.body))
  .digest('hex');

if (signature !== expectedSignature) {
  throw new Error('Invalid signature');
}
```

---

## ✅ テスト計画

### 単体テスト（医療システム側）

**テーブル制約テスト**:
- ✅ UNIQUE制約（course_code）
- ✅ ENUM制約（正しい値のみ）
- ✅ 外部キー制約（user_id）

**APIバリデーションテスト**:
- ✅ 年1回制限チェック
- ✅ 特別事由の判定
- ✅ 添付ファイル必須チェック
- ✅ 有効日チェック（14日後以降）

### 統合テスト

**API統合テスト**:
- ✅ API-1: 存在しない職員IDで404エラー
- ✅ API-2: 全4コースが取得できる
- ✅ API-3: 年1回制限で422エラー
- ✅ API-3: 特別事由で制限なし
- ✅ API-4: 自分の申請のみ取得

**Webhook統合テスト**:
- ✅ 承認Webhook送信成功
- ✅ 却下Webhook送信成功
- ✅ 署名検証成功
- ✅ リトライ機構動作（3回まで）

### E2Eテスト

**シナリオ1: 年1回変更申請（通常）**
1. Bコース職員がAコースへ変更申請
2. 人事部門が承認
3. Webhook送信
4. VoiceDriveで通知表示
5. PersonalStationページに反映

**シナリオ2: 特別事由（妊娠）**
1. Aコース職員がCコースへ変更申請（特別事由: 妊娠）
2. 妊娠証明書アップロード
3. 人事部門が証明書確認後に承認
4. Webhook送信
5. VoiceDriveで通知表示

**シナリオ3: 却下シナリオ**
1. Cコース職員がAコースへ変更申請
2. 人事部門が却下（人員配置の都合）
3. 却下Webhook送信
4. VoiceDriveで却下理由表示
5. 再申請を促すメッセージ表示

---

## 📝 ドキュメント

### 作成するドキュメント

1. **API仕様書**: Swagger/OpenAPI形式
2. **Webhook仕様書**: ペイロード例、署名検証方法
3. **運用マニュアル**: 人事部門向け（承認プロセス）
4. **ユーザーマニュアル**: 職員向け（申請方法）
5. **障害対応手順書**: エラー発生時の対応

---

## 🎯 マスタープラン統合用情報

### Phase 22として追加

**フェーズ名**: キャリア選択ステーション統合実装

**新規テーブル数**:
- 医療システム側: **3テーブル**
- VoiceDrive側: **0テーブル**

**Phase 1.6 統合DB構築テーブル数更新**:
- 更新前: 159テーブル
- 更新後: **162テーブル**

**データ保持ポリシー**: **全期間保存（削除なし）**

**SSOT（Single Source of Truth）**: 医療職員管理システム

**実装優先度**: 🟡 MEDIUM（Phase 18-21の後に実装）

**総工数見積**: 22-31人日
- 医療システム: 17-24人日
- VoiceDrive: 5-7人日

**実装期間**: 約4-6週間

**依存関係**:
- Phase 1.6（統合DB構築）完了後に実装可能
- AWS S3バケット準備必須
- JWT認証基盤準備必須

---

## 🔗 関連ドキュメント

1. [CareerSelectionStation_DB要件分析_20251013.md](./CareerSelectionStation_DB要件分析_20251013.md)
2. [CareerSelectionStation暫定マスターリスト_20251013.md](./CareerSelectionStation暫定マスターリスト_20251013.md)
3. [CareerSelectionStation_医療システム確認結果_20251018.md](./CareerSelectionStation_医療システム確認結果_20251018.md)
4. [lightsail-integration-master-plan-20251005-updated.md](./lightsail-integration-master-plan-20251005-updated.md)

---

## 📞 連絡体制

### 実装期間中の連絡体制

**Slack**: `#voicedrive-medical-integration`

**週次ミーティング**: 毎週月曜 14:00-14:30（進捗確認）

**MCPサーバー**: `mcp-shared/docs/`（ドキュメント共有）

---

## 🙏 謝辞

本統合マスターリストは、VoiceDrive開発チームと医療職員管理システム開発チームの協力により作成されました。

キャリア選択ステーションの成功により、医療職員のワークライフバランスとキャリア開発の両立がさらに促進されることを期待しています。

---

**文書終了**

**最終更新**: 2025年10月18日
**バージョン**: 1.0 FINAL
**ステータス**: ✅ 最終承認済み・マスタープラン統合準備完了
**次のアクション**: マスタープランPhase 22へ統合
