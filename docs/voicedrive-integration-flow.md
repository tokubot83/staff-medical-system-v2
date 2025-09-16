# VoiceDrive連携 面談予約通信フロー設計書

**作成日**: 2025年9月16日
**対象**: VoiceDriveシステム開発チーム
**提供元**: 医療職員管理システム開発チーム

## 1. 通信フロー概要

VoiceDriveシステムとの面談予約連携において、以下の段階的な通信フローを実装しています。

```
VoiceDrive → 職員管理システム → VoiceDrive
     ↓              ↓               ↓
  仮予約申込    →  AI最適化処理  →  提案3パターン送信
     ↓              ↓               ↓
  選択・編集    →   確認・承認    →   本予約確定通知
```

## 2. 通信エンドポイント一覧

### 2-1. 職員管理システム → VoiceDrive 送信API

| フェーズ | 送信タイミング | エンドポイント | 説明 |
|----------|----------------|----------------|------|
| **Phase 1** | 仮予約受信後 | `POST /api/voicedrive/proposals` | 提案3パターンの送信 |
| **Phase 2** | 本予約確定時 | `POST /api/voicedrive/booking-confirmed` | 確定通知 |
| **Phase 3** | 日程調整時 | `POST /api/voicedrive/reschedule-request` | 再調整要求 |

### 2-2. VoiceDrive → 職員管理システム 受信API

| フェーズ | 受信タイミング | 当システムAPI | 説明 |
|----------|----------------|---------------|------|
| **Phase 1** | 職員申込時 | `POST /api/interviews/assisted-booking` | 仮予約申込受信 |
| **Phase 2** | 提案選択時 | `POST /api/interviews/confirm-choice` | 職員の最終選択受信 |
| **Phase 3** | 編集要求時 | `POST /api/interviews/schedule-adjustment` | 職員の編集要求受信 |

## 3. 詳細通信フロー

### Phase 1: 仮予約申込 → 提案3パターン送信

#### 3-1. VoiceDriveからの仮予約申込受信
```http
POST /api/interviews/assisted-booking
Content-Type: application/json

{
  "staffId": "OH-NS-2021-001",
  "staffName": "田中 花子",
  "department": "内科",
  "position": "看護師",
  "experienceYears": 3,
  "type": "support",
  "category": "career_support",
  "topic": "キャリアプラン相談",
  "urgencyLevel": "this_week",
  "timePreference": {
    "morning": false,
    "afternoon": true,
    "evening": false,
    "anytime": false
  },
  "interviewerPreference": {
    "anyAvailable": true,
    "preferredName": null
  },
  "minDuration": 30,
  "maxDuration": 45,
  "source": "voicedrive",
  "voicedriveRequestId": "VD-REQ-2025091601"
}
```

#### 3-2. AI最適化処理後、VoiceDriveへ提案3パターン送信
```http
POST https://voicedrive-api.hospital.jp/api/proposals
Content-Type: application/json
Authorization: Bearer {API_TOKEN}

{
  "voicedriveRequestId": "VD-REQ-2025091601",
  "requestId": "REQ-AI-2025091601-001",
  "proposals": [
    {
      "id": "REC-001",
      "rank": 1,
      "confidence": 92,
      "interviewer": {
        "id": "INT-001",
        "name": "田中美香子",
        "title": "看護師長",
        "department": "キャリア支援室",
        "experience": "看護師15年、キャリア相談専門5年",
        "specialties": ["キャリア開発", "専門分野選択", "資格取得支援"]
      },
      "schedule": {
        "date": "2025-09-20",
        "time": "14:30",
        "duration": 45,
        "location": "相談室A",
        "format": "face_to_face"
      },
      "staffFriendlyDisplay": {
        "title": "田中美香子 看護師長",
        "summary": "キャリア相談の専門家として最適",
        "highlights": [
          "同じ内科病棟出身",
          "キャリア相談専門5年",
          "希望時間にピッタリ空いている"
        ]
      },
      "rankingReason": "あなたのご希望に最も適しています"
    },
    {
      "id": "REC-002",
      "rank": 2,
      "confidence": 87,
      "interviewer": {
        "id": "INT-002",
        "name": "佐藤健一",
        "title": "看護部主任",
        "department": "教育研修部",
        "experience": "看護師12年、新人指導専門3年"
      },
      "schedule": {
        "date": "2025-09-21",
        "time": "16:00",
        "duration": 30,
        "location": "研修室B",
        "format": "face_to_face"
      },
      "staffFriendlyDisplay": {
        "title": "佐藤健一 看護部主任",
        "summary": "同年代として相談しやすい環境",
        "highlights": [
          "新人・若手職員のキャリア支援専門",
          "希望日時に完全一致",
          "相談しやすい雰囲気"
        ]
      },
      "rankingReason": "代替候補として良い選択肢です"
    },
    {
      "id": "REC-003",
      "rank": 3,
      "confidence": 82,
      "interviewer": {
        "id": "INT-003",
        "name": "山田良子",
        "title": "主任看護師",
        "department": "人事部",
        "experience": "看護師10年、人事担当2年"
      },
      "schedule": {
        "date": "2025-09-22",
        "time": "15:00",
        "duration": 30,
        "location": "人事相談室",
        "format": "face_to_face"
      },
      "staffFriendlyDisplay": {
        "title": "山田良子 主任看護師",
        "summary": "人事観点からのアドバイス",
        "highlights": [
          "人事制度に詳しい",
          "キャリアパス設計サポート",
          "昇進・異動相談対応"
        ]
      },
      "rankingReason": "その他のご提案です"
    }
  ],
  "expiresAt": "2025-09-17T23:59:59Z",
  "contactInfo": {
    "urgentPhone": "内線1234",
    "email": "hr-support@hospital.jp"
  },
  "metadata": {
    "processingModel": "面談最適化システム v2.1",
    "totalCandidates": 12,
    "selectedTop": 3,
    "dataPrivacy": "院内完結処理・個人情報保護完全対応"
  }
}
```

### Phase 2: 職員選択 → 本予約確定

#### 2-1. VoiceDriveからの職員選択受信
```http
POST /api/interviews/confirm-choice
Content-Type: application/json

{
  "requestId": "REQ-AI-2025091601-001",
  "voicedriveRequestId": "VD-REQ-2025091601",
  "selectedProposalId": "REC-001",
  "staffFeedback": "時間がちょうど良く、専門性も高そうで安心しました",
  "selectedBy": "田中 花子",
  "selectionTimestamp": "2025-09-16T15:30:00Z"
}
```

#### 2-2. 承認待ちカラム表示情報（職員管理システム内部処理）
承認待ちカラムでは以下の情報が表示されます：
- 職員名、部署、職種
- 選択された面談担当者
- 予定日時、場所
- **「確認・移動」ボタン** ← 重要なUI要素

#### 2-3. 承認確定後、VoiceDriveへ本予約確定通知
```http
POST https://voicedrive-api.hospital.jp/api/booking-confirmed
Content-Type: application/json
Authorization: Bearer {API_TOKEN}

{
  "voicedriveRequestId": "VD-REQ-2025091601",
  "requestId": "REQ-AI-2025091601-001",
  "bookingId": "AI-BOOK-1726502400-abc123",
  "status": "confirmed",
  "confirmedBy": "人事部 承認者",
  "confirmedAt": "2025-09-16T16:00:00Z",
  "finalReservation": {
    "staffId": "OH-NS-2021-001",
    "staffName": "田中 花子",
    "interviewerId": "INT-001",
    "interviewerName": "田中美香子",
    "interviewerTitle": "看護師長",
    "scheduledDate": "2025-09-20",
    "scheduledTime": "14:30",
    "duration": 45,
    "location": "相談室A",
    "type": "support",
    "category": "career_support"
  },
  "notifications": {
    "interviewerNotified": true,
    "calendarUpdated": true,
    "reminderScheduled": true
  },
  "message": "面談予約が正式に確定しました。2025年9月20日 14:30から田中美香子看護師長との面談を実施します。"
}
```

### Phase 3: 日程調整が必要な場合

#### 3-1. VoiceDriveからの編集・調整要求受信
```http
POST /api/interviews/schedule-adjustment
Content-Type: application/json

{
  "requestId": "REQ-AI-2025091601-001",
  "voicedriveRequestId": "VD-REQ-2025091601",
  "adjustmentType": "schedule_change",
  "reason": "提案された時間が都合つかない",
  "staffPreferences": {
    "alternativeDates": ["2025-09-23", "2025-09-24"],
    "alternativeTimes": ["10:00", "13:00", "15:00"],
    "interviewerPreference": "original", // または "any"
    "maxDuration": 45,
    "notes": "午前中の方が参加しやすいです"
  },
  "requestedBy": "田中 花子",
  "requestTimestamp": "2025-09-16T15:45:00Z"
}
```

#### 3-2. 再調整処理後、新提案をVoiceDriveへ送信
```http
POST https://voicedrive-api.hospital.jp/api/reschedule-proposals
Content-Type: application/json
Authorization: Bearer {API_TOKEN}

{
  "voicedriveRequestId": "VD-REQ-2025091601",
  "requestId": "REQ-AI-2025091601-001",
  "adjustmentId": "ADJ-001",
  "revisedProposals": [
    {
      "id": "REC-001-REV",
      "rank": 1,
      "confidence": 89,
      "interviewer": {
        "id": "INT-001",
        "name": "田中美香子",
        "title": "看護師長",
        "department": "キャリア支援室"
      },
      "schedule": {
        "date": "2025-09-23",
        "time": "10:00",
        "duration": 45,
        "location": "相談室A",
        "format": "face_to_face"
      },
      "adjustmentNote": "ご希望の午前中で調整できました"
    }
  ],
  "adjustmentSummary": "午前中のご希望に合わせて同じ担当者で調整しました",
  "expiresAt": "2025-09-18T23:59:59Z"
}
```

## 4. VoiceDriveで必要なUI機能

### 4-1. 提案3パターン選択UI
- 提案カード表示（担当者情報、日時、特徴）
- ランキング表示（1位推奨、2位代替、3位その他）
- 選択ボタン
- 「どれも合わない場合の編集」ボタン

### 4-2. 編集・調整UI
- 希望日時の再設定
- 担当者変更希望の指定
- 理由・要望の入力フォーム
- 再提案依頼送信

### 4-3. 確定・完了UI
- 予約確定状態の表示
- 確定詳細情報（担当者、日時、場所）
- カレンダー連携機能
- リマインダー設定

### 4-4. ステータス管理UI
- 申込状況の追跡
- 処理進捗の表示（AI処理中、提案受信済み、確定済み）
- エラー時の代替案表示

## 5. エラーハンドリング

### 5-1. 職員管理システム側のエラー対応
- AI最適化失敗時 → 即時予約への誘導案内
- 担当者都合変更時 → 代替候補の自動提案
- システム障害時 → 人事部直接連絡の案内

### 5-2. VoiceDrive側で想定すべきエラー
- ネットワーク接続エラー → リトライ機能
- 提案期限切れ → 再申込誘導
- 重複予約検出 → アラート表示と再選択要求

## 6. 認証・セキュリティ

### 6-1. API認証
- Bearer Token方式
- Token有効期限: 24時間
- Token更新エンドポイント提供

### 6-2. データ保護
- 通信は全てHTTPS
- 個人情報は最小限の転送
- ログは暗号化保存

## 7. 実装優先度

### 最優先（Phase 1）
1. 仮予約申込受信API
2. 提案3パターン送信API
3. 職員選択受信API
4. 本予約確定通知API

### 次優先（Phase 2）
1. 日程調整・編集機能
2. 再提案機能
3. エラーハンドリング強化

### 将来対応（Phase 3）
1. リアルタイム通知機能
2. 統計・分析連携
3. 自動リマインダー機能

---

**連絡先**: 医療職員管理システム開発チーム
**技術サポート**: internal-dev@hospital.jp