# MyRequestsPage VoiceDrive確認事項への回答書

**文書番号**: MED-RESP-MYREQUESTS-2025-1027-001
**作成日**: 2025年10月27日
**作成者**: ClaudeCode（医療システムチーム）
**宛先**: VoiceDriveチーム
**件名**: MyRequestsPage実装に関する4件の確認事項への回答
**参照書類**:
- MyRequestsPage_医療システム確認結果_20251027.md（MED-CONF-2025-1027-006）
- VoiceDriveチームからの確認事項（2025年10月27日受領）

---

## 📋 エグゼクティブサマリー

VoiceDriveチームからの4件の確認事項・追加質問について、医療システムチームとして回答します。

### 回答サマリー

| # | 確認事項 | 回答 | 詳細 |
|---|---------|------|------|
| 1 | コース定義の給与係数 | ✅ **仮の値** | 人事部門と調整必要 |
| 2 | 添付ファイル管理 | ✅ **医療システム側で管理** | S3使用推奨 |
| 3 | 申請の年間回数制限 | ✅ **年1回 + 特例無制限** | ロジック提案承認 |
| 4 | Webhookリトライポリシー | ✅ **3回リトライ** | 提案ポリシー承認 |

### 追加合意事項

✅ **VoiceDriveチームからの提案を全て承認します**
- 実装スケジュール: Phase 1.6と同時実施
- Webhook Secret Key: 開発環境用キー承認
- Webhookエンドポイント実装: Week 3実装計画承認
- 実装優先度: 🔴 最高優先度で合意

---

## ✅ 確認事項への回答

### 1. コース定義の初期データについて

#### VoiceDriveチームからの質問

> 給与係数（Aコース1.20倍、Bコース1.10倍、Cコース1.00倍、Dコース0.90倍）は実際の人事規定に基づいた値ですか？

#### 回答: ⚠️ **仮の値です。人事部門と調整が必要です。**

**現状の給与係数（仮設定）**:

| コース | 給与係数 | 設定根拠 | 状態 |
|--------|---------|---------|------|
| Aコース | 1.20倍 | 施設間異動・転居対応の対価 | 🟡 仮設定 |
| Bコース | 1.10倍 | 部署異動対応の対価 | 🟡 仮設定 |
| Cコース | 1.00倍 | 基準給与（異動なし） | 🟡 仮設定 |
| Dコース | 0.90倍 | 夜勤なし・時短勤務想定 | 🟡 仮設定 |

#### 今後の調整方針

**Phase 1（実装時）**:
- ✅ 仮の値で実装を進める
- ✅ テーブル設計上は`baseSalaryMultiplier`フィールドで管理
- ✅ 後から変更可能な設計

**Phase 2（運用前）**:
- 🔴 人事部門との調整会議を実施
- 🔴 就業規則・給与規定との整合性確認
- 🔴 理事会承認が必要な可能性あり
- 🔴 実際の給与係数を確定

**推奨タイムライン**:
```
Week 1-5:  医療システム実装（仮係数で進行）
Week 6:    人事部門調整会議（実係数確定）
Week 7:    マスタデータ更新（実係数反映）
Week 8-9:  統合テスト（実係数で検証）
```

#### 追加設計提案: 給与係数の履歴管理

将来的に給与係数が変更される可能性を考慮し、履歴管理テーブルを追加することを提案します。

```prisma
// 🆕 給与係数履歴テーブル（Phase 2実装推奨）
model CareerCourseSalaryHistory {
  id                   String   @id @default(cuid())
  courseCode           String   @map("course_code")
  baseSalaryMultiplier Decimal  @map("base_salary_multiplier") @db.Decimal(3, 2)
  effectiveFrom        DateTime @map("effective_from") @db.Date
  effectiveTo          DateTime? @map("effective_to") @db.Date
  changeReason         String?  @map("change_reason")  // 理事会決議番号等
  approvedBy           String?  @map("approved_by")
  createdAt            DateTime @default(now()) @map("created_at")

  @@map("career_course_salary_history")
  @@index([courseCode, effectiveFrom])
}
```

**メリット**:
- 給与係数変更の監査証跡
- 過去の給与計算の再現性確保
- 理事会承認との紐付け

---

### 2. 特例変更の添付ファイル管理について

#### VoiceDriveチームからの質問

> ファイルストレージは医療システム側で管理しますか？それともVoiceDrive側で管理すべきでしょうか？

#### 回答: ✅ **医療システム側で管理します（AWS S3使用推奨）**

**理由**:
1. **法的保管義務**: 介護状況証明書、診断書等は3-5年の保管義務あり
2. **アクセス制御**: 人事部門のみアクセス可能にする必要がある
3. **監査対応**: 社労士監査時に提出が必要
4. **個人情報保護**: 医療・介護情報を含むため厳格な管理が必要

#### 実装方針

**ストレージ構成**:
```
AWS S3バケット: medical-system-career-course-attachments

フォルダ構造:
/{facilityId}/{requestId}/{fileName}

例:
/tategami-hospital/req-001/caregiving-certificate.pdf
/obara-hospital/req-002/medical-diagnosis.pdf
```

**アクセス制御**:
```json
{
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::ACCOUNT-ID:role/MedicalSystemHRRole"
      },
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": "arn:aws:s3:::medical-system-career-course-attachments/*"
    }
  ]
}
```

#### attachmentsフィールドの構造（VoiceDrive提案を承認）

✅ **VoiceDriveチームの提案構造を採用します**

```json
{
  "attachments": [
    {
      "fileName": "介護状況証明書.pdf",
      "fileUrl": "https://medical-system-s3.amazonaws.com/tategami-hospital/req-001/caregiving-certificate.pdf",
      "uploadedAt": "2025-10-27T10:00:00Z",
      "fileSize": 245678,
      "mimeType": "application/pdf"
    },
    {
      "fileName": "診断書.pdf",
      "fileUrl": "https://medical-system-s3.amazonaws.com/tategami-hospital/req-001/medical-diagnosis.pdf",
      "uploadedAt": "2025-10-27T10:05:00Z",
      "fileSize": 189234,
      "mimeType": "application/pdf"
    }
  ]
}
```

#### ⚠️ 訂正: 既存のファイルアップロード方式を流用

**重要**: 新規API実装は不要です。**既存の顔写真アップロードAPI（phase2-photo-webhook.ts）と同じ方式を使用**します。

**実装方針**: 既存の `POST /api/v2/upload/file` を拡張（fileType分岐追加のみ）

```typescript
// 医療システム: src/api/v2/career-course/upload-attachment.ts

import { Request, Response } from 'express';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({ region: 'ap-northeast-1' });
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }  // 5MB制限
});

/**
 * POST /api/career-course/upload-attachment
 * 添付ファイルアップロード
 */
export async function uploadAttachment(req: Request, res: Response) {
  const { requestId, employeeId } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'ファイルが指定されていません' });
  }

  // 許可するファイル形式
  const allowedMimeTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return res.status(400).json({
      error: '許可されていないファイル形式です（PDF, JPEG, PNG, DOCXのみ）'
    });
  }

  // S3アップロード
  const fileName = `${uuidv4()}-${file.originalname}`;
  const facilityId = await getFacilityIdFromEmployee(employeeId);
  const key = `${facilityId}/${requestId}/${fileName}`;

  try {
    await s3Client.send(new PutObjectCommand({
      Bucket: 'medical-system-career-course-attachments',
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      Metadata: {
        uploadedBy: employeeId,
        requestId: requestId
      }
    }));

    const fileUrl = `https://medical-system-s3.amazonaws.com/${key}`;

    res.json({
      success: true,
      attachment: {
        fileName: file.originalname,
        fileUrl: fileUrl,
        uploadedAt: new Date().toISOString(),
        fileSize: file.size,
        mimeType: file.mimetype
      }
    });
  } catch (error) {
    console.error('S3アップロードエラー:', error);
    res.status(500).json({ error: 'ファイルアップロードに失敗しました' });
  }
}
```

**VoiceDrive側の実装**:

VoiceDrive側は医療システムのアップロードAPIを呼び出すのみで、ファイル管理は不要です。

```typescript
// VoiceDrive: careerCourseService.ts に追加

async uploadAttachment(
  requestId: string,
  file: File
): Promise<CareerCourseAttachment> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('requestId', requestId);
  formData.append('employeeId', this.currentEmployeeId);

  const response = await fetch(
    `${this.medicalApiBaseUrl}/api/career-course/upload-attachment`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.authToken}`
      },
      body: formData
    }
  );

  if (!response.ok) {
    throw new Error('ファイルアップロードに失敗しました');
  }

  const data = await response.json();
  return data.attachment;
}
```

**保管期間**:
- 原則: 5年間保管（社労士監査対応）
- 自動削除: 5年経過後にS3 Lifecycle Policyで自動削除

---

### 3. 申請の年間回数制限について

#### VoiceDriveチームからの質問

> 年1回の定期変更 + 特例変更（回数制限なし）という理解で正しいですか？

#### 回答: ✅ **正しいです。VoiceDriveチームの提案ロジックを承認します。**

**申請ルール**:

| 申請タイプ | 回数制限 | 条件 | 備考 |
|----------|---------|------|------|
| **定期変更（annual）** | 年1回 | 毎年4月1日から申請可能 | 次回変更可能日: 前回申請日+365日 |
| **特例変更（pregnancy）** | 無制限 | 妊娠証明書必須 | 診断書添付 |
| **特例変更（caregiving）** | 無制限 | 介護状況証明書必須 | 市区町村発行の証明書 |
| **特例変更（illness）** | 無制限 | 診断書必須 | 医師の診断書 |

#### VoiceDriveチーム提案のロジックを承認

✅ **提案された`canSubmitRequest()`ロジックを全面的に採用します**

```typescript
/**
 * 申請可能性チェック
 * VoiceDriveチーム提案のロジックを採用
 */
async function canSubmitRequest(staffId: string): Promise<{
  canSubmit: boolean;
  reason?: string;
}> {
  // 1. 承認待ちの申請があるかチェック
  const pendingRequest = await prisma.careerCourseChangeRequest.findFirst({
    where: { staffId, approvalStatus: 'pending' }
  });

  if (pendingRequest) {
    return {
      canSubmit: false,
      reason: '承認待ちの申請があります。承認または却下されるまでお待ちください。'
    };
  }

  // 2. 次回変更可能日をチェック
  const currentSelection = await prisma.careerCourseSelection.findFirst({
    where: { staffId, effectiveTo: null },
    orderBy: { effectiveFrom: 'desc' }
  });

  if (currentSelection?.nextChangeAvailableDate) {
    const today = new Date();
    const nextDate = new Date(currentSelection.nextChangeAvailableDate);

    if (today < nextDate) {
      return {
        canSubmit: false,
        reason: `次回変更可能日は ${nextDate.toLocaleDateString('ja-JP')} です（定期変更の場合）。特例変更（妊娠・介護・病気）の場合は申請可能です。`
      };
    }
  }

  return { canSubmit: true };
}
```

#### 追加実装: 特例変更の優先処理

特例変更は`nextChangeAvailableDate`を無視して申請可能にします。

```typescript
/**
 * 申請可能性チェック（特例変更考慮版）
 */
async function canSubmitRequest(
  staffId: string,
  changeReason: 'annual' | 'special_pregnancy' | 'special_caregiving' | 'special_illness'
): Promise<{
  canSubmit: boolean;
  reason?: string;
}> {
  // 1. 承認待ちの申請があるかチェック（全タイプ共通）
  const pendingRequest = await prisma.careerCourseChangeRequest.findFirst({
    where: { staffId, approvalStatus: 'pending' }
  });

  if (pendingRequest) {
    return {
      canSubmit: false,
      reason: '承認待ちの申請があります。'
    };
  }

  // 2. 特例変更の場合は次回変更可能日を無視
  if (changeReason.startsWith('special_')) {
    return { canSubmit: true };
  }

  // 3. 定期変更の場合のみ次回変更可能日をチェック
  const currentSelection = await prisma.careerCourseSelection.findFirst({
    where: { staffId, effectiveTo: null },
    orderBy: { effectiveFrom: 'desc' }
  });

  if (currentSelection?.nextChangeAvailableDate) {
    const today = new Date();
    const nextDate = new Date(currentSelection.nextChangeAvailableDate);

    if (today < nextDate) {
      return {
        canSubmit: false,
        reason: `定期変更は ${nextDate.toLocaleDateString('ja-JP')} から申請可能です。`
      };
    }
  }

  return { canSubmit: true };
}
```

#### 申請取り下げ後の再申請制限

**ルール**: ✅ **同日中の再申請は不可、翌日から再申請可能**

```typescript
/**
 * 取り下げ後の再申請可能性チェック
 */
async function canResubmitAfterWithdrawal(staffId: string): Promise<{
  canSubmit: boolean;
  reason?: string;
}> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 本日中に取り下げた申請があるかチェック
  const todayWithdrawn = await prisma.careerCourseChangeRequest.findFirst({
    where: {
      staffId,
      approvalStatus: 'withdrawn',
      withdrawnAt: {
        gte: today
      }
    }
  });

  if (todayWithdrawn) {
    return {
      canSubmit: false,
      reason: '本日中に取り下げた申請があるため、再申請は翌日以降に可能です。'
    };
  }

  return { canSubmit: true };
}
```

---

### 4. Webhookのリトライポリシーについて

#### VoiceDriveチームからの質問

> Webhook送信失敗時のリトライ回数、リトライ間隔、永続的失敗時の通知方法は？

#### 回答: ✅ **VoiceDriveチームの提案ポリシーを全面的に採用します**

**リトライ設定（VoiceDrive提案を承認）**:

| 項目 | 設定値 | 備考 |
|-----|--------|------|
| 最大リトライ回数 | 3回 | 計4回の送信試行 |
| 1回目リトライ | 1秒後 | 一時的なネットワーク障害対応 |
| 2回目リトライ | 5秒後 | サーバー再起動待ち |
| 3回目リトライ | 15秒後 | 長時間障害からの復旧待ち |
| タイムアウト | 10秒 | 1回あたりの送信タイムアウト |

#### 実装コード（VoiceDrive提案を採用）

✅ **VoiceDriveチームが提案した`sendWebhookWithRetry()`をそのまま採用します**

```typescript
// 医療システム: src/services/webhook/sendCareerCourseNotification.ts

const WEBHOOK_RETRY_CONFIG = {
  maxRetries: 3,
  retryDelays: [1000, 5000, 15000],  // 1秒、5秒、15秒
  timeout: 10000  // 10秒
};

/**
 * Webhookリトライ送信
 * VoiceDriveチーム提案のロジックを採用
 */
async function sendWebhookWithRetry(
  url: string,
  payload: any,
  retries = 0
): Promise<boolean> {
  try {
    const signature = generateHMAC(
      payload,
      process.env.CAREER_COURSE_WEBHOOK_SECRET || ''
    );

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      WEBHOOK_RETRY_CONFIG.timeout
    );

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Medical-System-Signature': signature
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      console.log('✅ Webhook送信成功:', {
        type: payload.type,
        staffId: payload.staffId,
        attempt: retries + 1
      });
      return true;
    }

    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  } catch (error) {
    console.error(
      `❌ Webhook送信失敗 (試行 ${retries + 1}/${WEBHOOK_RETRY_CONFIG.maxRetries + 1}):`,
      {
        error: error instanceof Error ? error.message : String(error),
        payload: payload
      }
    );

    if (retries < WEBHOOK_RETRY_CONFIG.maxRetries) {
      const delay = WEBHOOK_RETRY_CONFIG.retryDelays[retries];
      console.log(`⏳ ${delay}ms後にリトライします...`);

      await new Promise(resolve => setTimeout(resolve, delay));
      return sendWebhookWithRetry(url, payload, retries + 1);
    }

    // 全リトライ失敗時: 管理者に通知 + ログ記録
    await handleWebhookPermanentFailure(payload);
    return false;
  }
}
```

#### 永続的失敗時の通知方法

**3段階の通知**:

1. **データベースログ記録**:
```typescript
async function handleWebhookPermanentFailure(payload: any) {
  // 1. 失敗ログをDBに記録
  await prisma.webhookFailureLog.create({
    data: {
      webhookType: 'career_course_notification',
      payload: JSON.stringify(payload),
      failedAt: new Date(),
      retryCount: WEBHOOK_RETRY_CONFIG.maxRetries,
      errorMessage: '全リトライ失敗'
    }
  });

  // 2. 管理者にメール通知
  await sendAdminEmail({
    subject: '【重要】Webhook送信失敗 - キャリアコース変更通知',
    body: `
      職員ID: ${payload.staffId}
      申請ID: ${payload.requestId}
      通知タイプ: ${payload.type}

      VoiceDriveへの通知送信が4回失敗しました。
      手動での通知が必要です。
    `,
    to: 'hr-admin@hospital.local'
  });

  // 3. Slackチャンネルに通知（オプション）
  await sendSlackNotification({
    channel: '#medical-system-alerts',
    message: `🚨 Webhook送信失敗\n職員ID: ${payload.staffId}\n申請ID: ${payload.requestId}`
  });
}
```

2. **管理画面アラート表示**:
```typescript
// 医療システム管理画面: ダッシュボードに失敗アラート表示
const failedWebhooks = await prisma.webhookFailureLog.findMany({
  where: {
    resolvedAt: null,  // 未解決のみ
    failedAt: {
      gte: new Date(Date.now() - 24 * 60 * 60 * 1000)  // 過去24時間
    }
  },
  orderBy: { failedAt: 'desc' }
});

// ダッシュボードに赤色バッジで表示
```

3. **手動再送機能**:
```typescript
// 管理画面から手動再送
async function manualRetryWebhook(failureLogId: string) {
  const log = await prisma.webhookFailureLog.findUnique({
    where: { id: failureLogId }
  });

  if (!log) return;

  const payload = JSON.parse(log.payload);
  const success = await sendWebhookWithRetry(
    process.env.VOICEDRIVE_WEBHOOK_URL,
    payload
  );

  if (success) {
    await prisma.webhookFailureLog.update({
      where: { id: failureLogId },
      data: {
        resolvedAt: new Date(),
        resolvedBy: 'admin-manual-retry'
      }
    });
  }
}
```

#### WebhookFailureLogテーブルの追加

```prisma
model WebhookFailureLog {
  id           String    @id @default(cuid())
  webhookType  String    @map("webhook_type")  // 'career_course_notification'
  payload      String    @db.Text  // JSON文字列
  failedAt     DateTime  @default(now()) @map("failed_at")
  retryCount   Int       @map("retry_count")
  errorMessage String    @map("error_message")
  resolvedAt   DateTime? @map("resolved_at")
  resolvedBy   String?   @map("resolved_by")  // 'admin-manual-retry' | 'auto-retry-success'
  createdAt    DateTime  @default(now()) @map("created_at")

  @@map("webhook_failure_logs")
  @@index([failedAt])
  @@index([resolvedAt])
}
```

---

## ✅ VoiceDriveチームからの提案への合意

### 1. 実装スケジュール

✅ **Phase 1.6（共通DB構築）と同時実施を承認します**

**理由**:
- キャリアコース管理は人事業務の中核機能
- 他の基幹機能と依存関係が少ない
- VoiceDrive側UI実装完了済み

**合意スケジュール**:
```
Week 1-2:  医療システムDB構築 + API実装
Week 3:    Webhook実装 + VoiceDrive側Webhook受信実装
Week 4-5:  医療システム管理画面実装
Week 6:    統合テスト + E2Eテスト
```

---

### 2. Webhook Secret Key

✅ **開発環境用Secret Keyを承認します**

**開発環境**:
```bash
CAREER_COURSE_WEBHOOK_SECRET=voicedrive_medical_system_webhook_secret_dev_2025
```

**本番環境**:
```bash
# AWS Secrets Managerで管理
# Secret Name: medical-system/career-course/webhook-secret
# 64文字以上のランダム文字列を生成
# 定期ローテーション: 3ヶ月ごと
```

**HMAC実装**:
✅ VoiceDriveチームが提案した`generateHMAC()`と`verifyHMAC()`をそのまま採用します。

---

### 3. VoiceDrive側Webhookエンドポイント実装

✅ **Week 3実装計画を承認します**

**実装内容**:
- ✅ `/api/webhooks/career-course` エンドポイント
- ✅ HMAC署名検証
- ✅ 通知サービス統合

**実装コード**:
✅ VoiceDriveチームが提案したエンドポイント実装コードを承認します。

**テスト協力**:
医療システム側から以下の統合テストを実施します：
1. 承認通知の送信・受信テスト
2. 却下通知の送信・受信テスト
3. HMAC署名検証テスト
4. リトライ機能テスト

---

### 4. データ管理責任

✅ **以下の責任分担で合意します**

| データ | 管理者 | 備考 |
|--------|--------|------|
| **コース定義** | 医療システム 100% | career_course_definitions |
| **現在のコース選択** | 医療システム 100% | career_course_selections |
| **申請履歴** | 医療システム 100% | career_course_change_requests |
| **添付ファイル** | 医療システム 100% | AWS S3管理 |
| **給与係数** | 医療システム 100% | 人事部門調整後確定 |
| **UI表示** | VoiceDrive 100% | MyRequestsPage |
| **通知処理** | VoiceDrive 100% | CareerCourseNotificationService |

---

## 📊 実装状態の最終確認（医療システム側）

### 追加実装項目（⚠️ 訂正版：既存機能流用により大幅削減）

| 項目 | 内容 | 元の工数 | 訂正後 | 状態 |
|------|------|---------|-------|------|
| **1. ファイルアップロード** | ~~新規API~~ → 既存API拡張（if分岐追加） | ~~1日~~ | **0.1日** | ✅ 既存流用 |
| **2. S3統合** | ~~新規バケット~~ → 既存バケット流用 | ~~0.5日~~ | **0日** | ✅ 既存流用 |
| **3. WebhookFailureLogテーブル** | 永続的失敗記録 | 0.25日 | 0.25日 | 🆕 追加 |
| **4. 管理者通知機能** | ~~新規実装~~ → 既存Slackアラート流用 | ~~0.5日~~ | **0日** | ✅ 既存流用 |
| **5. 手動再送機能** | 管理画面からWebhook再送 | 0.5日 | 0日 | ⏳ Phase 2 |
| **6. Webhookイベント追加** | 型定義+関数1つ（phase2-photo-webhook.ts） | - | **0.1日** | 🆕 追加 |
| **7. 給与係数履歴テーブル** | CareerCourseSalaryHistory | 0.5日 | 0.5日 | ⏳ Phase 2 |

**削減**: -2.3日
**更新後の合計工数**: 22日 + ~~2.75日~~ → **22日 + 0.45日 = 22.45日（約4.5週間）**

---

## 📅 更新後の実装スケジュール

### Phase 1: データベース構築（1.5週間）

| 日付 | 作業内容 | 担当 | 状態 |
|------|---------|------|------|
| Day 1-2 | 3テーブル作成 + WebhookFailureLog追加 | バックエンド | ⏳ 未実装 |
| Day 3 | S3バケット設定 | DevOps | ⏳ 未実装 |
| Day 4-5 | マイグレーション実行 + 初期データ投入 | バックエンド | ⏳ 未実装 |

---

### Phase 2: API実装（1.5週間）

| 日付 | 作業内容 | 担当 | 状態 |
|------|---------|------|------|
| Day 1-2 | GET /my-requests, GET /definitions 実装 | バックエンド | ⏳ 未実装 |
| Day 3 | POST /change-request 実装 | バックエンド | ⏳ 未実装 |
| Day 4 | POST /upload-attachment 実装 🆕 | バックエンド | ⏳ 未実装 |
| Day 5 | JWT認証実装 | バックエンド | ⏳ 未実装 |

---

### Phase 3: Webhook実装（1週間）

| 日付 | 作業内容 | 担当 | 状態 |
|------|---------|------|------|
| Day 1 | HMAC署名生成機能 | バックエンド | ⏳ 未実装 |
| Day 2 | sendWebhookWithRetry実装 🆕 | バックエンド | ⏳ 未実装 |
| Day 3 | 管理者通知機能（メール、Slack）🆕 | バックエンド | ⏳ 未実装 |

---

### Phase 4: 管理画面実装（1.5週間）

| 日付 | 作業内容 | 担当 | 状態 |
|------|---------|------|------|
| Day 1-3 | 申請一覧画面 | フロントエンド | ⏳ 未実装 |
| Day 4-5 | 申請詳細画面 | フロントエンド | ⏳ 未実装 |
| Day 6 | 承認・却下処理 | フロントエンド | ⏳ 未実装 |
| Day 7 | 手動再送機能 🆕 | フロントエンド | ⏳ 未実装 |

---

### Phase 5: 統合テスト（1週間）

| 日付 | 作業内容 | 担当 | 状態 |
|------|---------|------|------|
| Day 1-2 | API統合テスト | QA | ⏳ 未実装 |
| Day 3-4 | Webhook統合テスト（VoiceDriveと協力）🆕 | QA + VoiceDrive | ⏳ 未実装 |
| Day 5 | ファイルアップロードテスト 🆕 | QA | ⏳ 未実装 |

---

### Phase 6: E2Eテスト（0.5週間）

| 日付 | 作業内容 | 担当 | 状態 |
|------|---------|------|------|
| Day 1 | 申請作成→審査→通知→画面更新 | QA + VoiceDrive | ⏳ 未実装 |
| Day 2 | リトライ・失敗通知テスト 🆕 | QA + VoiceDrive | ⏳ 未実装 |

---

## 🎯 次のアクション

### 医療システムチーム

1. ✅ VoiceDriveチームからの確認事項に回答完了
2. ✅ 追加実装項目の工数見積もり完了
3. ⏳ Phase 1.6実施日の確定待ち
4. ⏳ 実装開始準備

### VoiceDriveチーム

1. ✅ 医療システム回答書のレビュー
2. ⏳ Week 3でのWebhookエンドポイント実装
3. ⏳ 統合テスト準備

---

## 📞 最終確認

以下の内容で合意できましたら、実装を開始いたします：

### ✅ 合意事項（8項目）

1. ✅ 給与係数は仮設定で実装、Phase 2で人事部門と調整
2. ✅ 添付ファイルは医療システム側でS3管理
3. ✅ VoiceDrive提案のattachmentsフィールド構造を採用
4. ✅ 申請ルール: 年1回定期 + 特例無制限
5. ✅ VoiceDrive提案の申請可能性チェックロジックを採用
6. ✅ Webhookリトライ: 3回、1秒/5秒/15秒間隔
7. ✅ 永続的失敗時: DB記録 + メール + Slack通知
8. ✅ 実装スケジュール: Phase 1.6と同時実施（約5週間）

### 📋 追加実装項目（⚠️ 訂正：既存機能流用により削減）

1. ~~🆕 POST /api/career-course/upload-attachment~~ → ✅ **既存API拡張（0.1日）**
2. ~~🆕 S3統合~~ → ✅ **既存バケット流用（0日）**
3. 🆕 WebhookFailureLogテーブル（0.25日）
4. ~~🆕 管理者通知機能~~ → ✅ **既存Slackアラート流用（0日）**
5. ~~🆕 手動再送機能~~ → ⏳ **Phase 2へ延期（0日）**
6. 🆕 Webhookイベント追加（0.1日）

### 📊 更新後の合計工数

**~~24.75日~~** → **22.45日（約4.5週間）** ← **-2.3日削減**

---

## 🙏 感謝

VoiceDriveチームからの詳細な確認事項とご提案、誠にありがとうございました。提案いただいたロジック・実装コードは全て非常に的確で、そのまま採用させていただきます。

両チームが協力し、医療現場のキャリア選択制度を実現してまいります。引き続きよろしくお願いいたします。

---

**文書終了**

最終更新: 2025年10月27日
バージョン: 1.0
承認: 医療システムチーム承認済み、VoiceDriveチーム確認待ち
次回レビュー: Phase 1.6実施日確定後
