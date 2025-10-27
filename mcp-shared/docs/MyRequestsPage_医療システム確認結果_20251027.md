# MyRequestsPage 医療システム確認結果報告書

**文書番号**: MED-CONF-2025-1027-006
**作成日**: 2025年10月27日
**作成者**: ClaudeCode（医療システムチーム）
**宛先**: VoiceDriveチーム
**件名**: MyRequestsPage（申請状況確認）データ要件の医療システム側確認結果
**参照書類**:
- MyRequestsPage 暫定マスターリスト（ML-2025-1027-004）
- MyRequestsPage DB要件分析（DB-REQ-2025-1027-004）

---

## 📋 エグゼクティブサマリー

VoiceDriveチームからの「MyRequestsPage 暫定マスターリスト」に対する医療システム側の確認結果です。

### 最重要結論

🔴 **MyRequestsPageは医療システム側のDB実装が100%必要で、VoiceDrive側の新規テーブル追加は不要です。**

### 確認結果サマリー

| カテゴリ | VoiceDrive | 医療システム | 状態 |
|---------|-----------|------------|------|
| **データベーステーブル** | 0件（不要） | 3件（必要） | 🔴 医療システム側未実装 |
| **APIエンドポイント** | 0件（不要） | 3件（必要） | 🔴 医療システム側未実装 |
| **Webhook通知** | 1件（受信のみ） | 2件（送信） | 🟡 両方未実装 |
| **UI実装** | 完成 | 管理画面必要 | 🟢 VoiceDrive側完成 |

### データ管理責任分界点

```
【キャリアコース管理データ】
医療システム 100% 管理
├─ コース定義（A/B/C/D）
├─ 現在のコース選択状況
├─ コース変更申請履歴
└─ 審査結果・コメント

【表示・通知】
VoiceDrive 100% 管理
├─ MyRequestsPage UI（実装済み）
├─ 通知サービス（実装済み）
└─ モックデータ（フォールバック）
```

### 推定実装工数

| 作業内容 | 担当 | 工数 | 状態 |
|---------|------|------|------|
| **医療システムDB構築** | バックエンド | 5日 | 🔴 未実装 |
| **医療システムAPI実装** | バックエンド | 5日 | 🔴 未実装 |
| **医療システムWebhook実装** | バックエンド | 2日 | 🔴 未実装 |
| **医療システム管理画面** | フロントエンド | 5日 | 🔴 未実装 |
| **VoiceDrive Webhook受信** | バックエンド | 2日 | 🔴 未実装 |
| **統合テスト** | QA | 2日 | 🔴 未実装 |
| **E2Eテスト** | QA | 1日 | 🔴 未実装 |
| **合計** | - | **22日（約4.5週間）** | - |

---

## 🎯 確認結論

### 医療システム側の実装要否

| 項目 | 必要性 | 理由 | 優先度 |
|------|--------|------|-------|
| **データベーステーブル追加** | ✅ **必要（3件）** | キャリアコース管理データの保存 | 🔴 最高 |
| **APIエンドポイント実装** | ✅ **必要（3件）** | VoiceDriveへのデータ提供 | 🔴 最高 |
| **Webhook通知実装** | ✅ **必要（2件）** | 申請承認・却下のリアルタイム通知 | 🔴 最高 |
| **管理画面実装** | ✅ **必要** | 人事担当者が申請を審査 | 🔴 最高 |
| **VoiceDrive側テーブル追加** | ❌ **不要** | 表示のみ（データ保存なし） | - |

### VoiceDrive側の状況

| 項目 | 状態 | 備考 |
|------|------|------|
| **MyRequestsPage UI** | ✅ 実装完成 | 統計サマリー、申請一覧、詳細モーダル |
| **careerCourseService** | ✅ 実装完成 | API呼び出しサービス |
| **通知サービス** | ✅ 実装完成 | リアルタイム更新リスナー |
| **Webhookエンドポイント** | 🔴 未実装 | `/api/webhooks/career-course` |
| **新規テーブル** | ❌ 不要 | 医療システムAPIから取得 |

---

## 🗄️ 医療システム側DB要件

### 必要なテーブル（3件）

#### 1. career_course_definitions（コース定義マスタ）

**用途**: A/B/C/Dコースの定義を管理

```prisma
model CareerCourseDefinition {
  id                          String   @id @default(cuid())
  courseCode                  String   @unique @map("course_code")  // 'A', 'B', 'C', 'D'
  courseName                  String   @map("course_name")
  description                 String?
  departmentTransferAvailable Boolean  @default(false) @map("department_transfer_available")
  facilityTransferAvailable   String   @default("none") @map("facility_transfer_available")  // 'none' | 'limited' | 'full'
  relocationRequired          Boolean  @default(false) @map("relocation_required")
  nightShiftAvailable         String   @default("none") @map("night_shift_available")  // 'none' | 'selectable' | 'required'
  managementTrack             Boolean  @default(false) @map("management_track")
  baseSalaryMultiplier        Decimal  @default(1.00) @map("base_salary_multiplier") @db.Decimal(3, 2)
  salaryGrade                 Int?     @map("salary_grade")
  salaryNotes                 String?  @map("salary_notes")
  isActive                    Boolean  @default(true) @map("is_active")
  displayOrder                Int      @default(0) @map("display_order")
  createdAt                   DateTime @default(now()) @map("created_at")
  updatedAt                   DateTime @updatedAt @map("updated_at")

  @@map("career_course_definitions")
}
```

**初期データ（4件）**:
```sql
INSERT INTO career_course_definitions VALUES
('course-a', 'A', 'Aコース（全面協力型）', '施設間異動・転居あり', TRUE, 'full', TRUE, 'required', TRUE, 1.20, NULL, NULL, TRUE, 1, NOW(), NOW()),
('course-b', 'B', 'Bコース（部署異動協力型）', '部署異動あり、施設間異動なし', TRUE, 'none', FALSE, 'selectable', TRUE, 1.10, NULL, NULL, TRUE, 2, NOW(), NOW()),
('course-c', 'C', 'Cコース（限定協力型）', '異動なし、夜勤選択可', FALSE, 'none', FALSE, 'selectable', FALSE, 1.00, NULL, NULL, TRUE, 3, NOW(), NOW()),
('course-d', 'D', 'Dコース（勤務限定型）', '異動なし、夜勤なし', FALSE, 'none', FALSE, 'none', FALSE, 0.90, NULL, NULL, TRUE, 4, NOW(), NOW());
```

---

#### 2. career_course_selections（コース選択状況）

**用途**: 職員ごとの現在のコース選択状況を管理

```prisma
model CareerCourseSelection {
  id                        String    @id @default(cuid())
  staffId                   String    @map("staff_id")
  courseCode                String    @map("course_code")
  effectiveFrom             DateTime  @map("effective_from") @db.Date
  effectiveTo               DateTime? @map("effective_to") @db.Date
  nextChangeAvailableDate   DateTime? @map("next_change_available_date") @db.Date
  specialChangeReason       String?   @map("special_change_reason")  // 'pregnancy' | 'caregiving' | 'illness'
  specialChangeNote         String?   @map("special_change_note")
  changeRequestedAt         DateTime? @map("change_requested_at")
  changeRequestedBy         String?   @map("change_requested_by")
  approvedAt                DateTime? @map("approved_at")
  approvedBy                String?   @map("approved_by")
  approvalStatus            String    @default("pending") @map("approval_status")  // 'pending' | 'approved' | 'rejected' | 'withdrawn'
  rejectionReason           String?   @map("rejection_reason")
  createdAt                 DateTime  @default(now()) @map("created_at")
  updatedAt                 DateTime  @updatedAt @map("updated_at")

  staff                     Employee  @relation(fields: [staffId], references: [employeeId], onDelete: Cascade)

  @@index([staffId, effectiveFrom, effectiveTo], name: "idx_staff_effective")
  @@index([approvalStatus], name: "idx_approval_status")
  @@map("career_course_selections")
}
```

---

#### 3. career_course_change_requests（コース変更申請）

**用途**: コース変更申請履歴を管理（MyRequestsPageで表示）

```prisma
model CareerCourseChangeRequest {
  id                      String    @id @default(cuid())
  staffId                 String    @map("staff_id")
  currentCourseCode       String    @map("current_course_code")
  requestedCourseCode     String    @map("requested_course_code")
  changeReason            String    @map("change_reason")  // 'annual' | 'special_pregnancy' | 'special_caregiving' | 'special_illness'
  reasonDetail            String    @map("reason_detail")
  requestedEffectiveDate  DateTime  @map("requested_effective_date") @db.Date
  hrReviewerId            String?   @map("hr_reviewer_id")
  hrReviewerName          String?   @map("hr_reviewer_name")
  reviewedAt              DateTime? @map("reviewed_at")
  reviewComment           String?   @map("review_comment")
  approvalStatus          String    @default("pending") @map("approval_status")  // 'pending' | 'approved' | 'rejected' | 'withdrawn'
  rejectionReason         String?   @map("rejection_reason")
  withdrawnAt             DateTime? @map("withdrawn_at")
  attachments             Json?     @map("attachments")  // ファイルパスの配列
  createdAt               DateTime  @default(now()) @map("created_at")
  updatedAt               DateTime  @updatedAt @map("updated_at")

  staff                   Employee  @relation(fields: [staffId], references: [employeeId], onDelete: Cascade)

  @@index([staffId, approvalStatus], name: "idx_staff_status")
  @@index([approvalStatus], name: "idx_approval_status")
  @@index([createdAt], name: "idx_created_at")
  @@map("career_course_change_requests")
}
```

**推定レコード数**:
- 立神リハビリテーション温泉病院: 約120名 × 年間0.5件 = 60件/年
- 小原病院: 約100名 × 年間0.5件 = 50件/年
- **合計**: 約110件/年

---

## 🔌 医療システム側API要件

### 必要なAPIエンドポイント（3件）

#### 1. GET /api/career-course/my-requests

**用途**: 現在のユーザーの申請履歴を取得（MyRequestsPageで使用）

**認証**: JWT Bearer Token必須

**リクエスト**:
```http
GET /api/career-course/my-requests HTTP/1.1
Host: medical-system.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**レスポンス**:
```json
{
  "success": true,
  "data": [
    {
      "id": "req-003",
      "staffId": "OH-NS-2021-001",
      "staffName": "山田 花子",
      "facility": "小原病院",
      "department": "内科",
      "position": "看護師",
      "currentCourseCode": "B",
      "requestedCourseCode": "A",
      "changeReason": "annual",
      "reasonDetail": "管理職候補として、施設間異動を含む全面協力型コースへの変更を希望します。",
      "requestedEffectiveDate": "2026-04-01",
      "hrReviewerId": null,
      "hrReviewerName": null,
      "reviewedAt": null,
      "reviewComment": null,
      "approvalStatus": "pending",
      "rejectionReason": null,
      "withdrawnAt": null,
      "attachments": [],
      "createdAt": "2025-09-25T10:30:00Z",
      "updatedAt": "2025-09-25T10:30:00Z"
    }
  ],
  "message": "申請履歴を取得しました"
}
```

**実装例（Node.js + Express + Prisma）**:
```typescript
router.get('/my-requests', authenticateJWT, async (req, res) => {
  const staffId = req.user.employeeId;  // JWT から取得

  const requests = await prisma.careerCourseChangeRequest.findMany({
    where: { staffId },
    orderBy: { createdAt: 'desc' },
    include: {
      staff: {
        select: {
          name: true,
          facility: true,
          department: true,
          position: true
        }
      }
    }
  });

  res.json({
    success: true,
    data: requests.map(req => ({
      ...req,
      staffName: req.staff.name,
      facility: req.staff.facility,
      department: req.staff.department,
      position: req.staff.position
    })),
    message: '申請履歴を取得しました'
  });
});
```

---

#### 2. GET /api/career-course/definitions

**用途**: コース定義（A/B/C/D）を取得

**認証**: JWT Bearer Token必須

**リクエスト**:
```http
GET /api/career-course/definitions HTTP/1.1
Host: medical-system.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**レスポンス**:
```json
{
  "success": true,
  "data": [
    {
      "id": "course-a",
      "courseCode": "A",
      "courseName": "Aコース（全面協力型）",
      "description": "施設間異動・転居を伴う可能性あり",
      "departmentTransferAvailable": true,
      "facilityTransferAvailable": "full",
      "relocationRequired": true,
      "nightShiftAvailable": "required",
      "managementTrack": true,
      "baseSalaryMultiplier": 1.20,
      "isActive": true,
      "displayOrder": 1
    }
  ]
}
```

---

#### 3. POST /api/career-course/change-request

**用途**: コース変更申請を送信

**認証**: JWT Bearer Token必須

**リクエスト**:
```http
POST /api/career-course/change-request HTTP/1.1
Host: medical-system.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "currentCourseCode": "B",
  "requestedCourseCode": "A",
  "changeReason": "annual",
  "reasonDetail": "管理職候補として、施設間異動を含む全面協力型コースへの変更を希望します。",
  "requestedEffectiveDate": "2026-04-01",
  "attachments": []
}
```

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "id": "req-004",
    "staffId": "OH-NS-2021-001",
    "approvalStatus": "pending",
    "createdAt": "2025-10-27T10:00:00Z"
  },
  "message": "コース変更申請を受け付けました"
}
```

---

## 🔔 Webhook通知要件

### 医療システム → VoiceDrive

#### 1. course_change_approved（申請承認通知）

**送信タイミング**: 人事担当者が申請を承認した時

**送信先**: `https://voicedrive-v100.vercel.app/api/webhooks/career-course`

**認証**: HMAC-SHA256署名（`X-Medical-System-Signature`ヘッダー）

**ペイロード**:
```json
{
  "type": "course_change_approved",
  "staffId": "OH-NS-2021-001",
  "requestId": "req-003",
  "approvedCourse": "A",
  "effectiveDate": "2026-04-01",
  "reviewComment": "管理職候補として評価し、承認します。"
}
```

**実装例**:
```typescript
// 医療システム側
export async function sendApprovalNotification(requestId: string) {
  const request = await prisma.careerCourseChangeRequest.findUnique({
    where: { id: requestId }
  });

  const payload = {
    type: 'course_change_approved',
    staffId: request.staffId,
    requestId: request.id,
    approvedCourse: request.requestedCourseCode,
    effectiveDate: request.requestedEffectiveDate,
    reviewComment: request.reviewComment
  };

  const signature = generateHMAC(payload, process.env.WEBHOOK_SECRET);

  await fetch('https://voicedrive-v100.vercel.app/api/webhooks/career-course', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Medical-System-Signature': signature
    },
    body: JSON.stringify(payload)
  });
}
```

---

#### 2. course_change_rejected（申請却下通知）

**送信タイミング**: 人事担当者が申請を却下した時

**ペイロード**:
```json
{
  "type": "course_change_rejected",
  "staffId": "OH-NS-2021-001",
  "requestId": "req-001",
  "rejectionReason": "現在の勤務シフト調整で対応可能なため。",
  "reviewComment": "介護事由を確認しましたが、現在の勤務シフト調整で対応可能と判断しました。"
}
```

---

### VoiceDrive側Webhookエンドポイント

```typescript
// VoiceDrive: src/pages/api/webhooks/career-course.ts

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // HMAC署名検証
  const signature = req.headers['x-medical-system-signature'];
  if (!verifyHMAC(req.body, signature)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const notification: CareerCourseNotification = req.body;

  // 通知サービスに転送
  const notificationService = CareerCourseNotificationService.getInstance();
  await notificationService.handleWebhookNotification(notification);

  res.status(200).json({ success: true });
}
```

---

## 🖥️ 医療システム管理画面要件

### 申請審査画面（人事担当者向け）

**必要な機能**:
1. 申請一覧表示（承認待ち、承認済み、却下済み）
2. 申請詳細表示（職員情報、現在のコース、希望コース、理由）
3. 承認処理（コメント入力、適用日確認）
4. 却下処理（却下理由入力必須）
5. 保留処理（保留理由入力）

**権限要件**:
- Level 14以上（人事部スタッフ）: 申請一覧閲覧、詳細確認
- Level 15以上（人事部長）: 承認・却下実行

**実装例（React + TailwindCSS）**:
```typescript
// 医療システム管理画面: src/pages/career-course/review.tsx

export default function CareerCourseReviewPage() {
  const [requests, setRequests] = useState<CareerCourseChangeRequest[]>([]);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    const res = await fetch(`/api/career-course/requests?status=${filter}`);
    const data = await res.json();
    setRequests(data.data);
  };

  const handleApprove = async (requestId: string, comment: string) => {
    await fetch(`/api/career-course/requests/${requestId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewComment: comment })
    });

    fetchRequests();
  };

  const handleReject = async (requestId: string, reason: string, comment: string) => {
    await fetch(`/api/career-course/requests/${requestId}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rejectionReason: reason, reviewComment: comment })
    });

    fetchRequests();
  };

  return (
    <div>
      <h1>キャリアコース変更申請 審査</h1>

      {/* フィルタ */}
      <div>
        <button onClick={() => setFilter('pending')}>承認待ち</button>
        <button onClick={() => setFilter('approved')}>承認済み</button>
        <button onClick={() => setFilter('rejected')}>却下済み</button>
      </div>

      {/* 申請一覧 */}
      <table>
        <thead>
          <tr>
            <th>職員名</th>
            <th>現在のコース</th>
            <th>希望コース</th>
            <th>理由</th>
            <th>申請日</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(req => (
            <tr key={req.id}>
              <td>{req.staffName}</td>
              <td>{req.currentCourseCode}</td>
              <td>{req.requestedCourseCode}</td>
              <td>{req.changeReason}</td>
              <td>{req.createdAt}</td>
              <td>
                <button onClick={() => handleApprove(req.id, '')}>承認</button>
                <button onClick={() => handleReject(req.id, '', '')}>却下</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## 📊 実装スケジュール（提案）

### Phase 1: データベース構築（1週間）

| 日付 | 作業内容 | 担当 | 状態 |
|------|---------|------|------|
| Day 1 | `career_course_definitions`テーブル作成 | バックエンド | ⏳ 未実装 |
| Day 2 | `career_course_selections`テーブル作成 | バックエンド | ⏳ 未実装 |
| Day 3 | `career_course_change_requests`テーブル作成 | バックエンド | ⏳ 未実装 |
| Day 4 | マイグレーション実行 | バックエンド | ⏳ 未実装 |
| Day 5 | 初期データ投入 | バックエンド | ⏳ 未実装 |

---

### Phase 2: API実装（1週間）

| 日付 | 作業内容 | 担当 | 状態 |
|------|---------|------|------|
| Day 1-2 | `GET /my-requests` 実装 | バックエンド | ⏳ 未実装 |
| Day 3 | `GET /definitions` 実装 | バックエンド | ⏳ 未実装 |
| Day 4 | `POST /change-request` 実装 | バックエンド | ⏳ 未実装 |
| Day 5 | JWT認証実装 | バックエンド | ⏳ 未実装 |

---

### Phase 3: Webhook実装（3日）

| 日付 | 作業内容 | 担当 | 状態 |
|------|---------|------|------|
| Day 1 | HMAC署名生成機能 | バックエンド | ⏳ 未実装 |
| Day 2 | `sendApprovalNotification()` | バックエンド | ⏳ 未実装 |
| Day 3 | `sendRejectionNotification()` | バックエンド | ⏳ 未実装 |

---

### Phase 4: 管理画面実装（1週間）

| 日付 | 作業内容 | 担当 | 状態 |
|------|---------|------|------|
| Day 1-2 | 申請一覧画面 | フロントエンド | ⏳ 未実装 |
| Day 3-4 | 申請詳細画面 | フロントエンド | ⏳ 未実装 |
| Day 5 | 承認・却下処理 | フロントエンド | ⏳ 未実装 |

---

### Phase 5: 統合テスト（2日）

| 日付 | 作業内容 | 担当 | 状態 |
|------|---------|------|------|
| Day 1 | API統合テスト | QA | ⏳ 未実装 |
| Day 2 | Webhook統合テスト | QA | ⏳ 未実装 |

---

### Phase 6: E2Eテスト（1日）

| 日付 | 作業内容 | 担当 | 状態 |
|------|---------|------|------|
| Day 1 | 申請作成→審査→通知→画面更新 | QA | ⏳ 未実装 |

---

## ✅ 実装チェックリスト

### 医療システム側

#### データベース構築
- [ ] `career_course_definitions` テーブル作成
- [ ] `career_course_selections` テーブル作成
- [ ] `career_course_change_requests` テーブル作成
- [ ] マイグレーションスクリプト作成
- [ ] 初期データ投入（A/B/C/Dコース定義）
- [ ] インデックス設定
- [ ] 外部キー制約設定

#### API実装
- [ ] `GET /api/career-course/my-requests` 実装
- [ ] `GET /api/career-course/definitions` 実装
- [ ] `POST /api/career-course/change-request` 実装
- [ ] JWT認証機能実装
- [ ] エラーハンドリング実装
- [ ] バリデーション実装
- [ ] 単体テスト作成

#### Webhook実装
- [ ] `sendApprovalNotification()` 実装
- [ ] `sendRejectionNotification()` 実装
- [ ] HMAC署名生成機能
- [ ] Webhookリトライ機能

#### 管理画面実装
- [ ] 申請一覧画面（人事担当者向け）
- [ ] 申請詳細画面
- [ ] 承認・却下処理実装
- [ ] コース定義管理画面
- [ ] 統計ダッシュボード

---

### VoiceDrive側

#### API連携
- [x] `careerCourseService.ts` 実装済み
- [x] `getMyRequests()` 実装済み
- [x] API認証トークン管理実装済み
- [ ] エラーハンドリング強化

#### Webhook受信
- [x] `CareerCourseNotificationService.ts` 実装済み
- [ ] `/api/webhooks/career-course` エンドポイント実装
- [ ] HMAC署名検証実装
- [x] リアルタイム通知リスナー実装済み

#### UI
- [x] `MyRequestsPage.tsx` 実装済み
- [x] 統計サマリー表示実装済み
- [x] 申請一覧表示実装済み
- [x] 申請詳細モーダル実装済み
- [x] リアルタイム更新実装済み

---

### テスト

#### 単体テスト
- [ ] API `/my-requests` のテスト
- [ ] Webhook通知処理のテスト
- [ ] 統計計算のテスト

#### 統合テスト
- [ ] MyRequestsPage全体の動作確認
- [ ] Webhook通知→画面更新のフロー確認
- [ ] エラー時のモックデータ表示確認

#### E2Eテスト
- [ ] 申請作成→審査→通知→画面更新の一連のフロー

---

## 🎯 成功指標

| 指標 | 目標値 | 測定方法 |
|------|--------|---------|
| API応答時間 | <500ms | パフォーマンス監視 |
| Webhook到達率 | >99% | ログ分析 |
| 通知遅延 | <3秒 | タイムスタンプ比較 |
| UI表示速度 | <2秒 | ページロード計測 |
| エラー率 | <0.1% | エラーログ分析 |
| 申請データ整合性 | 100% | 日次検証バッチ |

---

## 📞 VoiceDriveチームへの確認事項

### 確認事項（3件）

1. **実装スケジュール**:
   - 医療システム側の実装開始時期はいつを想定していますか？
   - Phase 1.6（共通DB構築）と同時実施が推奨ですが、先行実装も可能です

2. **Webhook Secret Key**:
   - HMAC署名用のSecret Keyを共有してください
   - `.env`ファイルに`CAREER_COURSE_WEBHOOK_SECRET`として保存します

3. **VoiceDrive側Webhookエンドポイント**:
   - `/api/webhooks/career-course` の実装予定を教えてください
   - HMAC署名検証の実装方法を確認したいです

---

## 🔗 関連ドキュメント

1. **MyRequestsPage 暫定マスターリスト**
   - `mcp-shared/docs/MyRequestsPage暫定マスターリスト_20251027.md`
   - 全実装項目の詳細仕様

2. **MyRequestsPage DB要件分析**
   - `mcp-shared/docs/MyRequestsPage_DB要件分析_20251027.md`
   - DB設計、API仕様、データフロー

3. **データ管理責任分界点定義書**
   - `mcp-shared/docs/データ管理責任分界点定義書_20251008.md`
   - 医療システムとVoiceDriveのデータ管理責任

---

## 📊 まとめ

### MyRequestsPageの特徴

1. **完全に医療システム依存**: 全データが医療システムDBに保存される
2. **VoiceDrive側は表示のみ**: 新規テーブル追加不要
3. **リアルタイム通知対応**: Webhook経由で即座に画面更新
4. **モックデータでフォールバック**: 開発環境でも動作確認可能

### 4ページの比較サマリー

| 要素 | NotFoundPage | UnauthorizedPage | PersonalStation | MyRequestsPage |
|-----|-------------|-----------------|----------------|----------------|
| **新規テーブル** | 不要 | 不要 | 2件必要 | **不要** |
| **新規フィールド** | 不要 | 不要 | 1件必要 | **不要** |
| **医療システムDB** | 不要 | 不要 | 一部必要 | **3件必要** |
| **API呼び出し** | なし | 間接的（認証） | 複数（直接） | **1件（必須）** |
| **Webhook通知** | 不要 | 不要 | 不要 | **2件必要** |
| **実装工数** | 0日（完成） | 3週間（認証含む） | 4-6週間 | **4.5週間（医療システム実装含む）** |

### 最終結論

**MyRequestsPageはVoiceDrive側の新規テーブルやフィールド追加が不要ですが、医療システム側の完全な実装が必須です。**

現在はモックデータで動作しており、医療システム側の3つのテーブル（`career_course_definitions`, `career_course_selections`, `career_course_change_requests`）とAPIエンドポイント（`GET /my-requests`）が実装されれば、すぐに実データ対応が完了します。

**キャリア選択制度の中核機能**として、最高優先度での実装を推奨します。

---

## 📅 次のステップ

### 医療システムチームの対応

1. **Phase 1.6統合実装**: 共通DB構築と同時実施を推奨
2. **DB設計レビュー**: 3テーブルのスキーマ最終確認
3. **API仕様レビュー**: 3エンドポイントのレスポンス形式確認
4. **Webhook仕様レビュー**: HMAC署名方式の確認
5. **実装開始**: VoiceDriveチームの承認後

### VoiceDriveチームへの依頼事項

1. **実装スケジュール確認**: Phase 1.6の実施予定日を教えてください
2. **Webhook Secret Key共有**: HMAC署名用のSecret Keyを共有してください
3. **Webhookエンドポイント実装**: `/api/webhooks/career-course` の実装予定を教えてください
4. **統合テスト協力**: 医療システム実装完了後、統合テストにご協力ください

---

**文書終了**

最終更新: 2025年10月27日
バージョン: 1.0
承認: 未承認（VoiceDriveチームレビュー待ち）
次回レビュー: 医療システム実装開始時
