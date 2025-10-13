# InterviewBookingPage 医療システム確認結果書

**文書番号**: MEDICAL-RESPONSE-2025-1013-003
**作成日**: 2025年10月13日
**作成者**: 医療システムチーム
**宛先**: VoiceDriveチーム
**件名**: InterviewBookingPage要件分析への確認結果

---

## 📌 エグゼクティブサマリー

VoiceDriveチームから提供された以下の2文書を分析しました：
- **VD-MASTER-2025-1013-002**: InterviewBookingPage 暫定マスターリスト
- **VD-DB-ANALYSIS-2025-1013-002**: InterviewBookingPage DB要件分析

**結論**: 医療システムチームは**全面的に協力可能**です。医療システム側の新規実装は極めて軽微（API-5のみ）であり、スケジュール通りの実装に問題はありません。

---

## ✅ 1. 確認結果サマリー

| 分析項目 | 医療システム関与 | VoiceDrive実装 | 医療システム評価 |
|---------|----------------|---------------|----------------|
| **マスターデータ管理** | ❌ 不要 | ✅ 全8種類 | ✅ 適切な分離 |
| **新規API実装** | ✅ API-5のみ | ✅ API-6～10 | ✅ 実装可能 |
| **データベース変更** | ❌ 不要 | ✅ +20フィールド、+3テーブル | ✅ 適切な分離 |
| **Webhook受信** | ✅ 既存機構で対応 | ✅ 実装 | ✅ 問題なし |
| **既存API活用** | ✅ 提供済み | ✅ 利用 | ✅ 十分対応 |

**総合評価**: ✅ **全面協力可能・スケジュール問題なし**

---

## 🎯 2. 医療システム実装範囲の確認

### 2.1 新規実装が必要な項目

#### API-5: 職員連絡先取得API

**エンドポイント**:
```
GET /api/employees/{employeeId}/contact
```

**レスポンス例**:
```json
{
  "employeeId": "EMP-2024-001",
  "employeeName": "山田太郎",
  "email": "yamada.taro@obara-hospital.jp",
  "phoneNumber": "090-1234-5678",
  "facilityId": "obara-hospital",
  "departmentId": "nursing-dept-01",
  "positionId": "staff-nurse"
}
```

**実装工数**: 1～2時間（既存のEmployeeテーブルで対応可能）

**実装予定日**: 2025-11-14（Phase 1開始日に合わせて提供）

**ステータス**: ✅ **実装承認**

---

### 2.2 既存APIで対応可能な項目

VoiceDriveが必要とする以下の情報は、**既に実装済み**のAPIで対応可能です：

| 必要情報 | 既存API | 提供状況 |
|---------|---------|---------|
| 職員一覧 | `GET /api/v2/employees` | ✅ 提供済み |
| 施設情報 | `GET /api/v2/facilities` | ✅ 提供済み |
| 部門情報 | `GET /api/v2/departments` | ✅ 提供済み |
| 役職情報 | `GET /api/v2/positions` | ✅ 提供済み |

**確認事項**: これらのAPIで不足している情報があれば、ご連絡ください。

---

### 2.3 Webhook受信エンドポイント

VoiceDriveから医療システムへのWebhook通知は、**既存のWebhook受信機構**で対応可能です：

| Webhook | エンドポイント | 対応状況 |
|---------|--------------|---------|
| API-6: 面談予約通知 | `POST /api/medical/interviews/notify-reservation` | ✅ 対応可能 |
| API-8: 面談キャンセル通知 | `POST /api/medical/interviews/notify-cancellation` | ✅ 対応可能 |
| API-9: 日程変更リクエスト通知 | `POST /api/medical/interviews/notify-reschedule-request` | ✅ 対応可能 |

**実装予定日**: 2025-11-14～27（Phase 1期間中）

**ステータス**: ✅ **実装承認**

---

## 🔄 3. マスターデータ管理の確認

### 3.1 VoiceDrive独自管理マスター（医療システム実装不要）

以下の8種類のマスターデータは、**VoiceDriveチームが独自管理**することを確認しました：

| マスター名 | データ数 | 医療システム関与 |
|-----------|---------|----------------|
| **InterviewTypeMaster** | 10種類（新規）+ 12種類（互換性） | ❌ 不要 |
| **InterviewCategoryMaster** | 13カテゴリ | ❌ 不要 |
| **Interviewer** | 3名（デモ） | ❌ 不要 |
| **TimeSlot** | 5枠/日 | ❌ 不要 |
| **InterviewScheduleConfig** | 1設定 | ❌ 不要 |
| **CancellationReasonMaster** | 6理由 | ❌ 不要 |
| **InterviewStatusMaster** | 7ステータス | ❌ 不要 |
| **UrgencyLevelMaster** | 4レベル | ❌ 不要 |

**医療システム評価**: ✅ **適切な分離設計**

---

### 3.2 医療システム管理マスター（既存）

医療システムは以下のマスターデータを引き続き管理します：

| マスター名 | 管理チーム | 提供API |
|-----------|-----------|---------|
| Employee（職員） | 医療システム | `GET /api/v2/employees` |
| Facility（施設） | 医療システム | `GET /api/v2/facilities` |
| Department（部門） | 医療システム | `GET /api/v2/departments` |
| Position（役職） | 医療システム | `GET /api/v2/positions` |

**確認事項**: VoiceDrive側で追加のマスターデータが必要になった場合は、ご相談ください。

---

## 📊 4. データベース変更の確認

### 4.1 Interviewテーブルの拡張（VoiceDrive側作業）

VoiceDriveチームが提案する**+20フィールド**の追加を確認しました：

**既存フィールド（医療システム管理）**:
- `id`, `employeeId`, `interviewDate`, `interviewType`, `notes`, `createdBy`, `createdAt`, `updatedAt`

**新規フィールド（VoiceDrive管理）**:
- `employeeName`, `employeeEmail`, `employeePhoneNumber`
- `bookingDate`, `timeSlotId`, `timeSlotStartTime`, `timeSlotEndTime`
- `interviewerId`, `interviewerName`
- `categoryId`, `categoryName`
- `statusId`, `statusName`
- `urgencyLevel`
- `cancellationReasonId`, `cancellationReasonText`, `cancelledAt`
- `rescheduleRequests`, `rescheduleCount`
- `bookingSource`, `reminderSentAt`

**医療システム評価**: ✅ **適切なフィールド設計**

**確認事項**: Interviewテーブルの拡張は、VoiceDrive側のPrismaスキーマで実装してください。医療システム側のschema.prismaには影響しません。

---

### 4.2 新規テーブル（VoiceDrive側作業）

以下の3テーブルは、**VoiceDriveチームが独自管理**することを確認しました：

| テーブル名 | 用途 | 医療システム関与 |
|-----------|------|----------------|
| **Interviewer** | 面談者マスタ | ❌ 不要 |
| **TimeSlot** | 時間枠マスタ | ❌ 不要 |
| **InterviewScheduleConfig** | スケジュール設定 | ❌ 不要 |

**医療システム評価**: ✅ **適切なテーブル分離**

---

## 📅 5. 実装スケジュールの確認

VoiceDriveチームが提案する3フェーズのスケジュールを確認しました：

### Phase 1: 基本予約機能（2025-11-14 ～ 2025-11-27）

| 実装項目 | 担当チーム | 医療システム対応 |
|---------|-----------|----------------|
| 予約画面実装 | VoiceDrive | - |
| マスターデータ実装 | VoiceDrive | - |
| API-5実装 | 医療システム | ✅ 2025-11-14提供 |
| API-6実装 | VoiceDrive | - |
| API-7実装 | VoiceDrive | ✅ Webhook受信準備 |

**医療システム評価**: ✅ **スケジュール問題なし**

---

### Phase 2: キャンセル・日程変更機能（2025-11-28 ～ 2025-12-04）

| 実装項目 | 担当チーム | 医療システム対応 |
|---------|-----------|----------------|
| キャンセル機能 | VoiceDrive | - |
| 日程変更機能 | VoiceDrive | - |
| API-8実装 | VoiceDrive | ✅ Webhook受信準備 |
| API-9, API-10実装 | VoiceDrive | ✅ Webhook受信準備 |

**医療システム評価**: ✅ **スケジュール問題なし**

---

### Phase 3: 管理者機能・統計機能（2025-12-05 ～ 2025-12-11）

| 実装項目 | 担当チーム | 医療システム対応 |
|---------|-----------|----------------|
| 管理者画面 | VoiceDrive | - |
| 統計・レポート | VoiceDrive | - |
| 予約状況ダッシュボード | VoiceDrive | - |

**医療システム評価**: ✅ **スケジュール問題なし**

---

## 🔍 6. 確認事項・質問事項

医療システムチームから、以下の確認事項があります：

### 6.1 API-5のレスポンス仕様

**質問**: API-5のレスポンスに含める`phoneNumber`について、以下のどちらを返すべきでしょうか？

- **選択肢A**: 職員の個人携帯電話番号
- **選択肢B**: 職員の内線番号（院内PHS等）
- **選択肢C**: 両方を返す（`phoneNumber`と`internalPhoneNumber`）

**推奨**: 選択肢Cを推奨しますが、VoiceDriveチームの要件に合わせます。

---

### 6.2 Webhook認証方式

**質問**: VoiceDriveから医療システムへのWebhook通知（API-6, API-8, API-9）の認証方式はどのようにしますか？

- **選択肢A**: Bearer Token認証（既存のJWT方式）
- **選択肢B**: HMAC署名認証（Webhook専用）
- **選択肢C**: API Key認証

**推奨**: 選択肢Aを推奨します（既存のPhase 3～19のWebhookと統一）。

---

### 6.3 面談データの参照権限

**質問**: VoiceDrive側で予約された面談データを、医療システム側の既存の面談記録システムと統合しますか？

- **選択肢A**: 統合する（医療システムの面談記録画面でVoiceDrive予約データも表示）
- **選択肢B**: 分離する（VoiceDrive側のみで管理）

**推奨**: VoiceDriveチームのビジネス要件に合わせます。

---

## ✅ 7. 医療システムの最終確認

### 7.1 実装承認項目

医療システムチームは、以下の項目を**承認**します：

| 項目 | 承認状況 | 実装予定日 |
|------|---------|----------|
| **API-5実装** | ✅ 承認 | 2025-11-14 |
| **Webhook受信エンドポイント実装** | ✅ 承認 | 2025-11-14～27 |
| **マスターデータの分離設計** | ✅ 承認 | - |
| **Interviewテーブル拡張（VoiceDrive側）** | ✅ 承認 | - |
| **新規3テーブル（VoiceDrive側）** | ✅ 承認 | - |
| **実装スケジュール** | ✅ 承認 | Phase 1～3 |

---

### 7.2 テスト協力

医療システムチームは、以下のテストに協力します：

| テスト項目 | テスト予定日 | 医療システム対応 |
|-----------|------------|----------------|
| **Phase 1 統合テスト** | 2025-11-27 | ✅ 協力 |
| **Phase 2 統合テスト** | 2025-12-04 | ✅ 協力 |
| **Phase 3 統合テスト** | 2025-12-11 | ✅ 協力 |
| **本番環境テスト** | 2025-12-18～20 | ✅ 協力 |

---

## 📝 8. 次のアクション

### 8.1 医療システムチーム

- [ ] **2025-10-14**: 確認事項（6.1～6.3）への回答を待つ
- [ ] **2025-11-01**: API-5の実装開始
- [ ] **2025-11-14**: API-5を本番環境にデプロイ
- [ ] **2025-11-14**: Webhook受信エンドポイントの実装開始
- [ ] **2025-11-27**: Phase 1統合テスト参加

---

### 8.2 VoiceDriveチーム

- [ ] **2025-10-14**: 確認事項（6.1～6.3）への回答
- [ ] **2025-11-14**: Phase 1開発開始
- [ ] **2025-11-27**: Phase 1統合テスト実施

---

## 📞 連絡先

**医療システムチーム 担当者**:
- プロジェクトリーダー: [担当者名]
- 技術担当: [担当者名]
- 連絡先: medical-system-team@example.com

**文書履歴**:
- Version 1.0 (2025-10-13): 初版作成

---

**承認**: ✅ **医療システムチーム 全面協力承認**

**次回更新予定**: 確認事項への回答受領後（2025-10-14予定）
