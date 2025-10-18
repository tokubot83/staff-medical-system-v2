# CareerSelectionStation統合実装 - 最終確認書

**文書番号**: FINAL-CONFIRMATION-CS-2025-1018-001
**作成日**: 2025年10月18日
**作成者**: 医療システムチーム
**参照文書**:
- MED-NOTICE-CS-2025-1018-001（医療チームからの連絡書）
- VD-RESPONSE-CS-2025-1018-001（VoiceDriveチームからの回答書）

---

## 📋 最終確認サマリー

VoiceDriveチーム様

お疲れ様です。医療システムチームです。

Phase 22（キャリア選択ステーション）に関するVoiceDriveチームからの回答書（文書番号: VD-RESPONSE-CS-2025-1018-001）を受領いたしました。

既存実装状況を確認し、以下の通り**最終仕様を確定**いたしますので、ご確認をお願いいたします。

---

## ✅ VoiceDriveチーム回答内容の受理

### 確認-1: PersonalStationページへのコースセクション追加位置

**VoiceDriveチームの回答**: ❌ **いずれも該当せず - 独立ページとして実装済み**

**医療システムチームの判断**: ✅ **受理します**

**理由**:
1. **既存実装の完成度**: 3つのサブページ（マイキャリア、コース変更申請、申請履歴）が既に完成している
2. **機能の独立性**: 年1回の重要な意思決定であり、PersonalStationの「情報確認」機能とは性質が異なる
3. **再実装コストの回避**: PersonalStation統合のための再実装は不要（コスト削減）
4. **UXの最適化**: 変更申請フローの複雑さ（4ステップ、添付ファイル）を考慮すると、独立ページの方が適切

**最終決定**: **独立ページ構成を採用**
- URL: `/career-selection-station`
- ナビゲーション: メインメニュー「ステーション」セクション + PersonalStationからのリンクボタン

---

### 確認-2: コース変更申請フォームのUI設計

**VoiceDriveチームの回答**: ✅ **Option C（独立した新規ページ、既に実装済み）**

**医療システムチームの判断**: ✅ **受理します**

**理由**:
1. **入力項目の多さ**: 6つの入力項目（コース、理由、詳細、日付、添付ファイル、確認）があり、モーダルでは操作しづらい
2. **添付ファイルアップロード**: ドラッグ&ドロップUIが必要で、独立ページの方が実装しやすい
3. **年1回の重要操作**: 慎重に入力できる専用ページが適切
4. **モバイル対応**: 独立ページならスクロールで対応可能

**最終決定**: **独立ページ形式を採用**
- URL: `/career-selection-station/change-request`
- 実装ファイル: `ChangeRequestPage.tsx`

---

### 確認-3: Webhook受信後のUI更新タイミング

**VoiceDriveチームの回答**: ✅ **Option A（推奨通り）**

**医療システムチームの判断**: ✅ **受理します**

**理由**:
1. **緊急性が低い**: コース変更の承認/却下は数日～数週間かかる人事プロセス
2. **SSE実装コスト削減**: Phase 20（面談予約）ではSSEを実装したが、本Phaseでは費用対効果が低い
3. **メール通知で十分**: 職員はメールで承認/却下を知り、次回ログイン時に詳細を確認する運用で問題なし
4. **VoiceDriveはデータを保存しない**: 医療システムがSSOTのため、Webhook受信時のDB更新は不要

**最終決定**: **Webhook受信時にメール通知のみ、UI更新は次回ページアクセス時に医療システムAPIから最新データを取得**

---

## 🎯 最終仕様確定

### UI構成（VoiceDrive側）

#### 独立ページ構成（3つのサブページ）

| # | サブページ名 | URL | 機能 | 実装ファイル |
|---|------------|-----|------|-------------|
| 1 | **マイキャリア** | `/career-selection-station` | 現在のコース表示、職員情報、制度説明 | CareerSelectionStationPage.tsx |
| 2 | **コース変更申請** | `/career-selection-station/change-request` | 変更申請フォーム、添付ファイルアップロード | ChangeRequestPage.tsx |
| 3 | **申請履歴** | `/career-selection-station/my-requests` | 過去の申請一覧、承認状況確認 | MyRequestsPage.tsx |

#### ナビゲーション

- **メインメニュー**: 「ステーション」セクション内に「キャリア選択ステーション」リンク
- **PersonalStationからのリンク**: 「キャリアコースを確認」ボタン → `/career-selection-station`へ遷移

#### コース変更申請フォーム構成

```
ChangeRequestPage
├─ 現在のコース表示（読み取り専用）
├─ 希望コース選択（4つのカードボタン: A/B/C/D）
│  └─ 各カードに給与倍率、勤務条件を表示
├─ 変更理由選択（ラジオボタン）
│  ├─ 年1回定期変更
│  ├─ 特例: 妊娠・出産
│  ├─ 特例: 介護
│  └─ 特例: 疾病
├─ 理由詳細（テキストエリア、1000文字まで）
├─ 希望適用日（日付ピッカー）
├─ 添付ファイル（特例変更時のみ表示）
│  └─ ドラッグ&ドロップ + ファイル選択ボタン
└─ アクションボタン
   ├─ 申請内容を確認（モーダル表示）
   └─ 戻る
```

---

### データフロー（最終版）

#### 申請フロー

```
VoiceDrive（申請）
  ↓ POST /api/v2/career-course/change-request
医療システム（受付・保存）
  ↓ career_course_change_requests.INSERT
  ↓ AWS S3に添付ファイル保存
人事部（承認/却下）
  ↓ approval_status更新（approved/rejected）
医療システム（Webhook送信）
  ↓ POST /api/webhooks/career-course/change-approved
VoiceDrive（Webhook受信）
  ↓ メール通知送信
職員（メール受信）
  ↓ 次回ログイン
VoiceDrive（最新データ取得）
  ↓ GET /api/v2/employees/{employeeId}/career-course
医療システム（最新データ返却）
  ↓ 変更後のコース情報
VoiceDrive（UI更新）
```

#### データ管理責任分界点（SSOT: 医療システム）

| データ項目 | 管理責任 | VoiceDriveの役割 | 備考 |
|-----------|---------|------------------|------|
| コース定義マスタ | 医療システム | APIで取得して表示 | GET /api/v2/career-course/definitions |
| コース選択履歴 | 医療システム | APIで取得して表示 | GET /api/v2/employees/{employeeId}/career-course |
| 変更申請データ | 医療システム | 申請フォーム提供、POST送信 | POST /api/v2/career-course/change-request |
| 承認/却下状態 | 医療システム | APIで取得して表示 | GET /api/v2/career-course/my-requests |
| 添付ファイル | 医療システム（S3） | アップロードUI提供 | マルチパート形式で送信 |

**VoiceDrive側のデータベース**: **一切保存しません**（医療システムからAPIでリアルタイム取得）

---

### API仕様（最終版）

#### 医療システム側: 4エンドポイント

| API | メソッド | エンドポイント | 説明 | リクエスト | レスポンス |
|-----|---------|---------------|------|----------|----------|
| **API-1** | GET | `/api/v2/employees/{employeeId}/career-course` | 職員のコース情報取得 | - | { currentCourse, history, nextChangeAvailableDate } |
| **API-2** | GET | `/api/v2/career-course/definitions` | コース定義マスタ取得 | - | [{ courseCode, courseName, description, conditions }] |
| **API-3** | POST | `/api/v2/career-course/change-request` | コース変更申請 | { requestedCourse, reason, attachments } | { requestId, status } |
| **API-4** | GET | `/api/v2/career-course/my-requests` | 自分の申請一覧取得 | - | [{ requestId, status, requestedCourse, createdAt }] |

#### 認証方式

**JWT Bearer Token認証**: Phase 3～21と統一

```http
GET /api/v2/employees/EMP-001/career-course
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### Webhook仕様（最終版）

#### 医療システム → VoiceDrive: 2種類

| Webhook | イベント名 | エンドポイント | ペイロード | 認証方式 |
|---------|-----------|--------------|----------|---------|
| **Webhook-1** | `career_course.change_approved` | POST /api/webhooks/career-course/change-approved | { requestId, employeeId, newCourseCode, effectiveDate } | HMAC-SHA256 |
| **Webhook-2** | `career_course.change_rejected` | POST /api/webhooks/career-course/change-rejected | { requestId, employeeId, rejectionReason } | HMAC-SHA256 |

#### 認証方式: HMAC-SHA256署名

**ヘッダー**: `X-Medical-System-Signature`

**VoiceDrive側の検証処理**（既存の`webhookVerifier.ts`を使用）:

```typescript
const signature = req.headers['x-medical-system-signature'];
const payload = JSON.stringify(req.body);

if (!verifyWebhookSignature(payload, signature, process.env.MEDICAL_SYSTEM_WEBHOOK_SECRET)) {
  return res.status(401).json({ error: 'Invalid signature' });
}
```

#### Webhook受信後の処理（VoiceDrive側）

**処理フロー**:
1. HMAC署名検証
2. **データベース更新は行わない**（VoiceDriveはデータを保存しないため）
3. メール通知送信
4. HTTP 200 OK返却

**メール通知テンプレート**:

##### 承認時（career_course.change_approved）

```
件名: キャリアコース変更承認のお知らせ

○○様

お疲れ様です。人事部です。

申請いただいたキャリアコース変更が承認されました。

- 変更後のコース: Aコース（全面協力型）
- 適用開始日: 2026年4月1日
- 申請ID: req-003

詳細は以下のリンクからご確認ください：
https://voicedrive.example.com/career-selection-station/my-requests

VoiceDriveシステム
```

##### 却下時（career_course.change_rejected）

```
件名: キャリアコース変更申請に関するお知らせ

○○様

お疲れ様です。人事部です。

申請いただいたキャリアコース変更について、以下の理由により承認できませんでした。

- 申請ID: req-004
- 却下理由: 現在の部署で必要な人材のため、異動は困難です

ご不明点がございましたら、人事部（内線1234）までお問い合わせください。

VoiceDriveシステム
```

---

## 📊 実装工数（最終版）

### VoiceDrive側の追加実装項目

| # | 実装項目 | ファイル | 工数 | 備考 |
|---|---------|---------|------|------|
| 1 | Webhook受信エンドポイント（承認） | webhook.routes.ts | 0.25人日 | 既存パターン流用 |
| 2 | Webhook受信エンドポイント（却下） | webhook.routes.ts | 0.25人日 | 既存パターン流用 |
| 3 | HMAC署名検証 | webhookVerifier.ts | 0.5人日 | 既存実装を使用 |
| 4 | メール通知テンプレート（承認） | email/career-course-approved.html | 0.5人日 | |
| 5 | メール通知テンプレート（却下） | email/career-course-rejected.html | 0.5人日 | |
| 6 | APIサービスのモック削除 | careerCourseService.ts | 0.5人日 | |
| 7 | 環境変数設定 | .env.production | 0.5人日 | |
| 8 | 統合テスト | tests/career-course.test.ts | 2人日 | 4シナリオ |

**合計**: 5人日

### 医療システム側の実装項目

| # | 実装項目 | 工数 | 備考 |
|---|---------|------|------|
| 1 | DB構築（3テーブル） | 3-4人日 | career_course_definitions, career_course_selections, career_course_change_requests |
| 2 | API実装（4エンドポイント） | 7-9人日 | バリデーション、年1回制限チェック含む |
| 3 | Webhook実装（2種類） | 2-4人日 | HMAC-SHA256署名生成 |
| 4 | AWS S3実装 | 3-4人日 | バケット作成、アップロード、署名付きURL生成 |
| 5 | 統合テスト | 2-3人日 | 4シナリオ |

**合計**: 17-24人日

### 総工数

| チーム | 工数 | 金額 |
|--------|------|------|
| **医療システム** | 17-24人日 | ¥680,000～¥960,000 |
| **VoiceDrive** | 5人日 | ¥200,000 |
| **合計** | 22-29人日 | ¥880,000～¥1,160,000 |

---

## 📅 実装スケジュール（最終版）

### 前提条件

- ✅ Phase 1.6（統合DB構築）完了後に実装開始可能
- ⚠️ AWS S3バケット準備必須（医療システム側で事前準備）
- ⚠️ JWT認証基盤準備必須（既存Phase 3～21で構築済み）

### 実装フェーズ（Phase 1-5）

| フェーズ | 期間 | 作業内容 | 担当 | 工数 |
|---------|------|---------|------|------|
| **Phase 1** | Week 1 | DB構築（3テーブル作成、マイグレーション） | 医療 | 3-4人日 |
| | | AWS S3バケット作成、IAM設定 | 医療 | 1人日 |
| **Phase 2** | Week 2-3 | API実装（4エンドポイント、バリデーション） | 医療 | 7-9人日 |
| | | Webhook受信エンドポイント実装 | VoiceDrive | 1人日 |
| **Phase 3** | Week 3 | Webhook実装（2種類、HMAC-SHA256署名） | 医療 | 2-4人日 |
| | | メール通知テンプレート作成 | VoiceDrive | 1人日 |
| **Phase 4** | Week 4 | APIサービスのモック削除、実API接続 | VoiceDrive | 1人日 |
| | | 環境変数設定、デプロイ準備 | VoiceDrive | 0.5人日 |
| **Phase 5** | Week 5-6 | 統合テスト（4シナリオ、E2E） | 両チーム | 4-5人日 |

**総実装期間**: 約5-6週間

---

## ✅ 統合テストシナリオ（確定版）

### シナリオ1: 通常変更（年1回定期）

**前提条件**:
- テストユーザー（TEST-EMP-001）が現在Bコース
- 最後の変更から1年以上経過

**テスト手順**:
1. VoiceDrive: `/career-selection-station/change-request`にアクセス
2. VoiceDrive: 「Aコース」カードをクリック
3. VoiceDrive: 変更理由「年1回定期変更」選択
4. VoiceDrive: 理由詳細入力、希望適用日選択（14日後以降）
5. VoiceDrive: 「申請内容を確認」→ 確認モーダル表示
6. VoiceDrive: 「申請を送信」→ `POST /api/v2/career-course/change-request`
7. 医療システム: 申請受付、`career_course_change_requests`にINSERT
8. 医療システム: 人事部が承認操作（管理画面）
9. 医療システム: `POST /api/webhooks/career-course/change-approved`送信
10. VoiceDrive: Webhook受信、HMAC署名検証
11. VoiceDrive: メール通知送信
12. 職員: メール受信確認
13. VoiceDrive: `/career-selection-station`にアクセス
14. VoiceDrive: `GET /api/v2/employees/TEST-EMP-001/career-course`呼び出し
15. VoiceDrive: 最新データ表示（Aコースに変更済み）

**期待結果**: ✅ コース変更成功、メール受信、UI更新

---

### シナリオ2: 特例変更（妊娠・出産）

**前提条件**:
- テストユーザー（TEST-EMP-002）が現在Bコース
- 最後の変更から6ヶ月経過（年1回制限未満）

**テスト手順**:
1. VoiceDrive: `/career-selection-station/change-request`にアクセス
2. VoiceDrive: 「Dコース」カードをクリック
3. VoiceDrive: 変更理由「特例: 妊娠・出産」選択
4. VoiceDrive: 理由詳細入力、希望適用日選択
5. VoiceDrive: 添付ファイルセクション表示（特例変更のため）
6. VoiceDrive: 妊娠証明書PDFをドラッグ&ドロップ
7. VoiceDrive: 「申請を送信」→ マルチパート形式で送信
8. 医療システム: S3に証明書保存（`pregnancy/TEST-EMP-002/req-005/certificate.pdf`）
9. 医療システム: 申請受付（`special_change_reason: "pregnancy"`）
10. 医療システム: 人事部が証明書をS3から取得、内容確認
11. 医療システム: 承認操作
12. 医療システム: Webhook送信
13. VoiceDrive: メール通知送信
14. VoiceDrive: 次回アクセス時、Dコースに変更済み

**期待結果**: ✅ 年1回制限を無視して変更成功、添付ファイル保存確認

---

### シナリオ3: 申請却下

**前提条件**:
- テストユーザー（TEST-EMP-003）が現在Cコース

**テスト手順**:
1. VoiceDrive: コース変更申請（Cコース → Aコース）
2. 医療システム: 申請受付
3. 医療システム: 人事部が却下操作（却下理由: 現在の部署で必要な人材のため）
4. 医療システム: `approval_status: "rejected"`, `rejection_reason`更新
5. 医療システム: `POST /api/webhooks/career-course/change-rejected`送信
6. VoiceDrive: Webhook受信、メール通知送信（却下理由含む）
7. 職員: メール受信確認（却下理由を確認）
8. VoiceDrive: `/career-selection-station/my-requests`にアクセス
9. VoiceDrive: `GET /api/v2/career-course/my-requests`呼び出し
10. VoiceDrive: 申請一覧に却下ステータス表示（却下理由も表示）

**期待結果**: ✅ 却下メール受信、申請履歴に却下理由表示

---

### シナリオ4: 申請取り下げ

**前提条件**:
- テストユーザー（TEST-EMP-004）が既に申請中（承認待ち）

**テスト手順**:
1. 医療システム: 職員が直接医療システムで取り下げ操作
2. 医療システム: `approval_status: "withdrawn"`に更新
3. VoiceDrive: `/career-selection-station/my-requests`にアクセス
4. VoiceDrive: `GET /api/v2/career-course/my-requests`呼び出し
5. VoiceDrive: 取り下げステータス表示

**期待結果**: ✅ 取り下げ状態が正しく表示される

**Note**: 取り下げ時はWebhook送信なし（メール通知なし、次回アクセス時に反映）

---

## 🔐 セキュリティ要件（最終版）

### JWT認証（API）

**全APIエンドポイント**: JWT Bearer Token認証必須

**権限チェック**:
- **API-1, API-3, API-4**: 本人のみアクセス可能（employeeId = JWTのemployeeId）
- **API-2**: 全職員アクセス可能（コース定義は公開情報）
- **人事部門（Level 15+）**: 全職員のデータアクセス可能

### HMAC-SHA256署名（Webhook）

**署名生成（医療システム側）**:

```typescript
import crypto from 'crypto';

const payload = JSON.stringify(webhookData);
const signature = crypto
  .createHmac('sha256', process.env.WEBHOOK_SECRET)
  .update(payload)
  .digest('hex');

// ヘッダーに追加
headers['X-Medical-System-Signature'] = signature;
```

**署名検証（VoiceDrive側）**:

```typescript
import { verifyWebhookSignature } from '@/services/webhookVerifier';

const signature = req.headers['x-medical-system-signature'];
const payload = JSON.stringify(req.body);

if (!verifyWebhookSignature(payload, signature, process.env.MEDICAL_SYSTEM_WEBHOOK_SECRET)) {
  return res.status(401).json({ error: 'Invalid signature' });
}
```

### 環境変数（VoiceDrive側）

**必要な環境変数**:

```env
# 医療システムAPI
MEDICAL_SYSTEM_API_URL=https://medical-system-api.example.com

# Webhook署名検証用
MEDICAL_SYSTEM_WEBHOOK_SECRET=<医療システムから共有されるシークレット>

# メール送信（既存）
SMTP_HOST=smtp.example.com
SMTP_USER=noreply@voicedrive.example.com
SMTP_PASS=<パスワード>
```

### AWS S3セキュリティ

- **暗号化**: SSE-S3（AES-256）
- **アクセス制御**: 本人＋人事部門（Level 15+）のみ
- **署名付きURL**: 24時間有効期限
- **バケットポリシー**: パブリックアクセス禁止

---

## 📎 関連ドキュメント（最終版）

### 作成済みドキュメント

1. **統合マスターリスト最終版**（要更新）
   - パス: `mcp-shared/docs/CareerSelectionStation_統合マスターリスト_FINAL_20251018.md`
   - 文書番号: MASTER-CS-2025-1018-FINAL
   - 更新内容: UI設計部分を独立ページ構成に修正

2. **医療システム確認結果**
   - パス: `mcp-shared/docs/CareerSelectionStation_医療システム確認結果_20251018.md`
   - 文書番号: MS-CONFIRM-CS-2025-1018-001

3. **医療チームからの連絡書**
   - パス: `mcp-shared/docs/CareerSelectionStation_VoiceDriveチームへの連絡書_20251018.md`
   - 文書番号: MED-NOTICE-CS-2025-1018-001

4. **VoiceDriveチームからの回答書**
   - パス: `mcp-shared/docs/CareerSelectionStation_VoiceDrive回答書_20251018.md`
   - 文書番号: VD-RESPONSE-CS-2025-1018-001

5. **本最終確認書**
   - パス: `mcp-shared/docs/CareerSelectionStation_最終確認書_20251018.md`
   - 文書番号: FINAL-CONFIRMATION-CS-2025-1018-001

### マスタープラン

- **ファイル**: `mcp-shared/docs/lightsail-integration-master-plan-20251005-updated.md`
- **最新バージョン**: 2.35（2025年10月18日更新）
- **Phase 22セクション**: 更新履歴テーブルの最終行に追加済み
- **次回更新内容**: 独立ページ構成を反映（Version 2.36予定）

---

## 🎯 最終決定事項のまとめ

### 1. UI設計

**独立ページ構成を採用** ✅
- URL: `/career-selection-station`
- 3つのサブページ: マイキャリア、コース変更申請、申請履歴
- PersonalStationには統合しない
- 変更申請フォームは独立ページ形式

### 2. データ管理

**SSOT: 医療職員管理システム** ✅
- VoiceDriveはデータを一切保存しない
- 全データは医療システムAPIからリアルタイム取得
- Webhook受信時もDB更新なし（メール通知のみ）

### 3. Webhook連携

**Option A: メール通知 + 次回アクセス時反映** ✅
- Webhook受信時: HMAC署名検証 → メール送信 → 200 OK返却
- UI更新: 次回ページアクセス時に医療システムAPIから最新データ取得
- SSE/リアルタイム通知は実装しない（コスト削減）

### 4. 実装工数

**総工数: 22-29人日** ✅
- 医療システム: 17-24人日（¥680,000～¥960,000）
- VoiceDrive: 5人日（¥200,000）
- 合計: ¥880,000～¥1,160,000

### 5. 実装スケジュール

**実装期間: 約5-6週間** ✅
- Phase 1.6（統合DB構築）完了後に実装開始
- Phase 1-5の段階的実装
- 統合テスト: 4シナリオ

---

## 📝 次のアクション

### 医療システムチーム側

1. ✅ **本最終確認書の送付**: 2025年10月18日（本日）
2. ⏳ **統合マスターリスト更新**: UI設計部分を独立ページ構成に修正
3. ⏳ **マスタープラン更新**: Version 2.35 → 2.36（UI設計反映）
4. ⏳ **Phase 1.6完了待機**: 共通DB構築完了後に実装開始

### VoiceDriveチーム側

1. ⏳ **本最終確認書の確認**: 2025年10月21日まで
2. ⏳ **最終承認**: 2025年10月25日まで
3. ⏳ **Phase 1.6完了待機**: 医療システムチームと同期
4. ⏳ **実装開始**: Phase 1.6完了後

### 両チーム共同

1. ⏳ **Webhookシークレット共有**: Phase 1.6完了前に実施
2. ⏳ **環境変数設定**: Phase 1.6完了時に実施
3. ⏳ **統合テスト**: Phase 1-5実装完了後
4. ⏳ **本番リリース**: 統合テスト成功後

---

## ✅ 合意事項

本最終確認書に記載の仕様で、Phase 22（キャリア選択ステーション）の実装を進めることに合意します。

### 医療システムチーム

- **合意日**: 2025年10月18日
- **合意者**: 医療システム開発担当

### VoiceDriveチーム

- **合意日**: _____________（VoiceDriveチームによる確認後）
- **合意者**: _____________

---

## 💬 連絡先

ご不明点、ご質問等ございましたら、以下までお気軽にお問い合わせください：

- **医療システムチーム**: medical-team@example.com
- **担当者**: 医療システム開発担当
- **Slackチャンネル**: #lightsail-integration

---

**以上、よろしくお願いいたします。**

医療システムチーム
2025年10月18日

---

**文書終了**
