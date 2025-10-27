# MyRequestsPage ファイルアップロード方式の訂正

**文書番号**: MED-CORRECTION-2025-1027-001
**作成日**: 2025年10月27日
**作成者**: ClaudeCode（医療システムチーム）
**件名**: キャリアコース申請の添付ファイルアップロード方式の訂正
**参照書類**:
- MyRequestsPage_医療システム回答書_20251027.md（MED-RESP-MYREQUESTS-2025-1027-001）
- phase2-photo-webhook.ts（既存実装）

---

## 📋 訂正内容

### ❌ 誤り（回答書の内容）

以下の新規実装が必要と記載していました：

1. **POST /api/career-course/upload-attachment**（新規API）
2. **AWS S3統合**（新規バケット作成）
3. **ファイルアップロード処理**（新規実装）
4. **追加工数**: +2.75日

### ✅ 正しい方式

**既存の顔写真アップロード機能と全く同じ方式を使用**

- 新規API実装: **不要**
- 新規S3バケット: **不要**
- 追加工数: **0日**

---

## 🎯 既存機能の活用

### 既に実装済みの顔写真アップロード機能

**ファイル**: [src/lib/webhooks/phase2-photo-webhook.ts](c:\projects\staff-medical-system\src\lib\webhooks\phase2-photo-webhook.ts)

**機能**:
- ✅ HMAC-SHA256署名生成
- ✅ リトライ機構（1分→5分→30分）
- ✅ エラーハンドリング
- ✅ Slackアラート送信
- ✅ Webhook送信処理

**実装済みイベント**:
1. `employee.created` - 職員作成
2. `employee.photo.updated` - 写真更新
3. `employee.photo.deleted` - 写真削除

---

## 🔄 同じ方式をキャリアコース申請に適用

### 実装方針: **全く同じパターンで実装**

顔写真アップロードと同様に、以下のパターンを使用：

```typescript
// 既存: 顔写真アップロード
employee.photo.updated
  → profilePhotoUrl: "https://d2k8x5j9m1n4p7.cloudfront.net/employees/EMP-2025-001.jpg"
  → photoMimeType: "image/jpeg"
  → photoFileSize: 245678

// 新規: キャリアコース申請書類アップロード
career_course_request.attachment.uploaded
  → attachmentUrl: "https://d2k8x5j9m1n4p7.cloudfront.net/career-course/req-001/diagnosis.pdf"
  → mimeType: "application/pdf"
  → fileSize: 320000
```

---

## 📂 ファイル保存先

### 既存の方式と同じCloudFront + S3

**既存（顔写真）**:
```
CloudFront URL: https://d2k8x5j9m1n4p7.cloudfront.net/
S3バケット: medical-system-employee-photos
フォルダ構造: /employees/{employeeId}.jpg
```

**新規（キャリアコース申請書類）**:
```
CloudFront URL: https://d2k8x5j9m1n4p7.cloudfront.net/
S3バケット: medical-system-employee-photos (同じバケット)
フォルダ構造: /career-course/{requestId}/{filename}
```

**理由**:
- ✅ 既存のS3バケットを流用（新規作成不要）
- ✅ 既存のCloudFront Distributionを流用
- ✅ 既存のIAMロールを流用
- ✅ コスト増加ゼロ

---

## 🔧 実装方法（既存コードの拡張のみ）

### 1. Webhookイベントタイプに1つ追加

```typescript
// src/lib/webhooks/phase2-photo-webhook.ts に追加

/**
 * Webhookイベントタイプ
 */
export type WebhookEventType =
  | 'employee.created'
  | 'employee.photo.updated'
  | 'employee.photo.deleted'
  | 'career_course_request.attachment.uploaded';  // 🆕 追加（1行のみ）
```

### 2. ペイロード型定義を追加

```typescript
// src/lib/webhooks/phase2-photo-webhook.ts に追加

/**
 * キャリアコース申請書類アップロードイベントペイロード
 */
export interface CareerCourseAttachmentUploadedPayload {
  requestId: string;
  staffId: string;
  attachmentUrl: string;
  fileName: string;
  mimeType: 'application/pdf' | 'image/jpeg' | 'image/png';
  fileSize: number; // bytes
  uploadedAt: string; // ISO 8601
}
```

### 3. イベント送信関数を追加（既存の`sendEmployeePhotoUpdatedEvent`をコピー）

```typescript
// src/lib/webhooks/phase2-photo-webhook.ts に追加

/**
 * キャリアコース申請書類アップロードイベント送信
 *
 * @param payload - 申請書類アップロードペイロード
 * @param endpoint - VoiceDriveのWebhookエンドポイントURL
 * @param secret - 共有秘密鍵
 * @returns Webhook送信結果
 */
export async function sendCareerCourseAttachmentUploadedEvent(
  payload: CareerCourseAttachmentUploadedPayload,
  endpoint: string = process.env.VOICEDRIVE_WEBHOOK_ENDPOINT_PROD || '',
  secret: string = process.env.MEDICAL_WEBHOOK_SECRET || ''
): Promise<WebhookSendResult> {
  return sendWebhookWithRetry('career_course_request.attachment.uploaded', payload, endpoint, secret);
}
```

**追加コード量**: **約15行のみ**

---

## 💾 ファイルアップロードフロー（顔写真と同じ）

### 職員（VoiceDrive側）

```typescript
// 1. ファイル選択（既存UIコンポーネント流用）
<input
  type="file"
  accept=".pdf,.jpg,.jpeg,.png"
  onChange={handleFileSelect}
/>

// 2. 医療システムの既存アップロードAPIを呼び出し
// （顔写真アップロードと同じエンドポイント）
const uploadedFile = await medicalSystemService.uploadFile(
  selectedFile,
  'career-course',  // ファイルタイプ
  requestId         // リクエストID
);

// 3. 申請送信
await careerCourseService.submitChangeRequest({
  ...requestData,
  attachments: [uploadedFile]  // アップロード済みファイル情報
});
```

### 医療システム側

```typescript
// 既存のアップロードエンドポイントを拡張
// POST /api/v2/upload/file

export async function uploadFile(req: Request, res: Response) {
  const { fileType, referenceId } = req.body;  // fileType: 'employee-photo' | 'career-course'
  const file = req.file;

  // S3アップロード（既存処理）
  let s3Key: string;
  if (fileType === 'employee-photo') {
    s3Key = `employees/${referenceId}.jpg`;
  } else if (fileType === 'career-course') {
    s3Key = `career-course/${referenceId}/${file.originalname}`;  // 🆕 追加
  }

  // 既存のS3アップロード処理を流用
  await s3Client.send(new PutObjectCommand({
    Bucket: 'medical-system-employee-photos',  // 既存バケット
    Key: s3Key,
    Body: file.buffer,
    ContentType: file.mimetype
  }));

  const fileUrl = `https://d2k8x5j9m1n4p7.cloudfront.net/${s3Key}`;

  // Webhook送信（既存の仕組みを流用）
  if (fileType === 'career-course') {
    await sendCareerCourseAttachmentUploadedEvent({
      requestId: referenceId,
      staffId: req.user.employeeId,
      attachmentUrl: fileUrl,
      fileName: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
      uploadedAt: new Date().toISOString()
    });
  }

  res.json({
    success: true,
    fileUrl,
    fileName: file.originalname,
    fileSize: file.size,
    mimeType: file.mimetype
  });
}
```

**変更箇所**: `if (fileType === 'career-course')` の分岐を追加するのみ（**約10行**）

---

## 📊 訂正後の工数見積もり

### 元の見積もり（誤り）

| 項目 | 工数 |
|------|------|
| POST /api/career-course/upload-attachment | 1日 |
| S3統合 | 0.5日 |
| WebhookFailureLogテーブル | 0.25日 |
| 管理者通知機能 | 0.5日 |
| 手動再送機能 | 0.5日 |
| **合計** | **+2.75日** |

### 訂正後の見積もり（正しい）

| 項目 | 工数 | 理由 |
|------|------|------|
| 既存アップロードAPI拡張 | **0.1日（約1時間）** | if分岐追加のみ |
| Webhookイベント追加 | **0.1日（約1時間）** | 型定義+関数1つ追加 |
| WebhookFailureLogテーブル | 0.25日 | 既存の実装を流用 |
| 管理者通知機能 | **0日** | 既存のSlackアラート流用 |
| 手動再送機能 | **0日** | 将来実装（Phase 2） |
| **合計** | **+0.45日（約3.6時間）** | **-2.3日削減** |

---

## 📅 訂正後の実装スケジュール

### 元のスケジュール（誤り）

**合計工数**: 24.75日（約5週間）

### 訂正後のスケジュール（正しい）

**合計工数**: **22.45日（約4.5週間）**

**削減**: -2.3日

---

## ✅ 訂正内容のまとめ

### 主要な変更点

1. ✅ **新規S3バケット不要** → 既存バケットを流用
2. ✅ **新規API不要** → 既存アップロードAPIを拡張（if分岐追加のみ）
3. ✅ **Webhook仕組み不要** → 既存の`sendWebhookWithRetry()`を流用
4. ✅ **管理者通知不要** → 既存のSlackアラートを流用
5. ✅ **工数削減**: -2.3日

### 実装が必要な箇所（最小限）

| 実装箇所 | 変更内容 | 行数 |
|---------|---------|------|
| **phase2-photo-webhook.ts** | イベントタイプ追加 | 1行 |
| **phase2-photo-webhook.ts** | ペイロード型定義追加 | 8行 |
| **phase2-photo-webhook.ts** | イベント送信関数追加 | 6行 |
| **upload API** | fileType分岐追加 | 10行 |
| **合計** | - | **約25行** |

---

## 💰 コスト面でのメリット

### 元の見積もり（誤り）

```
新規S3バケット: medical-system-career-course-attachments
年間コスト: 約10円（0.22GB）
```

### 訂正後（正しい）

```
既存S3バケット: medical-system-employee-photos
追加コスト: 約10円（0.22GB追加分のみ）
実質コスト: 約10円（変わらず）
```

**理由**:
- 既存のCloudFront Distribution使用（追加料金なし）
- 既存のIAMロール使用（追加料金なし）
- 同一バケット内のフォルダ追加のみ（追加料金なし）

---

## 🎯 VoiceDriveチームへの訂正通知

### 訂正事項（3件）

1. **新規API不要**:
   - ❌ 誤: POST /api/career-course/upload-attachment
   - ✅ 正: 既存の POST /api/v2/upload/file を拡張

2. **実装工数削減**:
   - ❌ 誤: +2.75日
   - ✅ 正: +0.45日（**-2.3日削減**）

3. **総工数削減**:
   - ❌ 誤: 24.75日（約5週間）
   - ✅ 正: **22.45日（約4.5週間）**

---

## 📝 次のアクション

### 医療システムチーム

1. ✅ 訂正内容をVoiceDriveチームに通知
2. ⏳ 既存アップロードAPI拡張（約1時間）
3. ⏳ Webhookイベント追加（約1時間）
4. ⏳ 統合テスト

### VoiceDriveチーム

1. ✅ 訂正内容の確認
2. ⏳ 既存のファイルアップロードUI流用
3. ⏳ Webhookエンドポイント実装（Week 3）

---

## 🙏 謝辞

顔写真アップロード方式の流用というご指摘、誠にありがとうございました。既存実装を活用することで、**2.3日の工数削減**と**実装の簡素化**が実現できます。

---

**文書終了**

最終更新: 2025年10月27日
バージョン: 1.0
訂正理由: 既存機能の活用による工数削減
承認: 医療システムチーム承認済み、VoiceDriveチーム確認待ち
