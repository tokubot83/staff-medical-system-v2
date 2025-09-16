# VoiceDrive統合テスト用データセット

**作成日**: 2025年9月16日
**作成者**: 医療職員管理システム開発チーム
**対象**: VoiceDrive統合テスト
**用途**: 9月2-3日統合テスト実施用

## 1. テストデータ概要

統合テストで使用するリアルデータ（匿名化済み）とAPIレスポンス例を整備しました。

### データセット構成
- **職員データ**: 150件（各部署・職種・経験年数を網羅）
- **面談予約データ**: 500件（過去6ヶ月分）
- **AI提案サンプル**: 10パターン（適合度別）
- **キャンセル・変更データ**: 100件（各種パターン）

## 2. 職員マスターデータ（テスト用）

### 2-1. 基本職員データ

```json
{
  "testStaffData": [
    {
      "staffId": "OH-NS-2021-001",
      "staffName": "田中 花子",
      "department": "内科",
      "position": "看護師",
      "experienceYears": 3,
      "hireDate": "2021-04-01",
      "skills": ["救急看護", "患者指導"],
      "certifications": ["看護師免許", "BLS資格"],
      "preferredInterviewTypes": ["career_support", "skill_development"]
    },
    {
      "staffId": "OH-PT-2022-015",
      "staffName": "佐藤 健一",
      "department": "リハビリテーション科",
      "position": "理学療法士",
      "experienceYears": 2,
      "hireDate": "2022-04-01",
      "skills": ["運動療法", "物理療法"],
      "certifications": ["理学療法士免許"],
      "preferredInterviewTypes": ["regular", "skill_development"]
    },
    {
      "staffId": "OH-OT-2023-007",
      "staffName": "山田 良子",
      "department": "リハビリテーション科",
      "position": "作業療法士",
      "experienceYears": 1,
      "hireDate": "2023-04-01",
      "skills": ["日常生活訓練", "認知訓練"],
      "certifications": ["作業療法士免許"],
      "preferredInterviewTypes": ["support", "mental_health"]
    },
    {
      "staffId": "OH-ST-2024-003",
      "staffName": "鈴木 太郎",
      "department": "リハビリテーション科",
      "position": "言語聴覚士",
      "experienceYears": 1,
      "hireDate": "2024-04-01",
      "skills": ["失語症訓練", "嚥下訓練"],
      "certifications": ["言語聴覚士免許"],
      "preferredInterviewTypes": ["support", "career_support"]
    },
    {
      "staffId": "OH-HR-2020-012",
      "staffName": "高橋 美香",
      "department": "人事部",
      "position": "人事担当",
      "experienceYears": 5,
      "hireDate": "2020-04-01",
      "skills": ["採用業務", "労務管理"],
      "certifications": ["社会保険労務士"],
      "preferredInterviewTypes": ["regular", "special"]
    }
  ]
}
```

### 2-2. 担当者データ

```json
{
  "interviewerData": [
    {
      "id": "INT-001",
      "name": "田中美香子",
      "title": "看護師長",
      "department": "キャリア支援室",
      "experience": "看護師15年、キャリア相談専門5年",
      "specialties": ["キャリア開発", "専門分野選択", "資格取得支援"],
      "availableTimeSlots": [
        "2025-09-20T14:30:00Z",
        "2025-09-21T10:00:00Z",
        "2025-09-23T09:30:00Z"
      ],
      "maxConcurrentBookings": 4,
      "preferredDuration": 45
    },
    {
      "id": "INT-002",
      "name": "佐藤健一",
      "title": "看護部主任",
      "department": "教育研修部",
      "experience": "看護師12年、新人指導専門3年",
      "specialties": ["新人教育", "スキル向上", "チームワーク"],
      "availableTimeSlots": [
        "2025-09-21T16:00:00Z",
        "2025-09-22T14:00:00Z",
        "2025-09-24T11:30:00Z"
      ],
      "maxConcurrentBookings": 3,
      "preferredDuration": 30
    },
    {
      "id": "INT-003",
      "name": "山田良子",
      "title": "主任看護師",
      "department": "人事部",
      "experience": "看護師10年、人事担当2年",
      "specialties": ["人事制度", "キャリアパス", "昇進相談"],
      "availableTimeSlots": [
        "2025-09-22T15:00:00Z",
        "2025-09-25T13:00:00Z",
        "2025-09-26T10:00:00Z"
      ],
      "maxConcurrentBookings": 2,
      "preferredDuration": 30
    }
  ]
}
```

## 3. AI提案サンプルデータ（10パターン）

### 3-1. 完全一致パターン（適合度95%）

```json
{
  "proposalType": "perfect_match",
  "requestId": "REQ-TEST-001",
  "proposals": [
    {
      "id": "REC-PERFECT-001",
      "rank": 1,
      "confidence": 95,
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
      "aiReasoning": {
        "matchingFactors": [
          "同じ内科病棟出身",
          "キャリア相談専門5年",
          "希望時間にピッタリ空いている"
        ],
        "summary": "あなたのキャリア相談に最も適した担当者です",
        "detailedReasons": [
          "あなたと同じ内科病棟での経験があります",
          "キャリア相談の専門家として最適です",
          "希望時間帯に完全に空いています"
        ]
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
    }
  ]
}
```

### 3-2. 高適合パターン（適合度88%）

```json
{
  "proposalType": "high_match",
  "requestId": "REQ-TEST-002",
  "proposals": [
    {
      "id": "REC-HIGH-001",
      "rank": 1,
      "confidence": 88,
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
      "aiReasoning": {
        "matchingFactors": [
          "新人・若手職員のキャリア支援専門",
          "希望日時に完全一致",
          "相談しやすい雰囲気"
        ],
        "summary": "同年代として相談しやすい環境",
        "detailedReasons": [
          "新人・若手の指導に特化しています",
          "同世代として親しみやすい関係です",
          "希望の日時に完全に対応可能です"
        ]
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
    }
  ]
}
```

### 3-3. マッチング困難パターン（適合度45%）

```json
{
  "proposalType": "difficult_match",
  "requestId": "REQ-TEST-003",
  "proposals": [
    {
      "id": "REC-DIFFICULT-001",
      "rank": 1,
      "confidence": 45,
      "interviewer": {
        "id": "INT-EMERGENCY",
        "name": "緊急対応担当者",
        "title": "人事部スタッフ",
        "department": "人事部",
        "experience": "一般的な相談対応"
      },
      "schedule": {
        "date": "2025-09-30",
        "time": "17:00",
        "duration": 30,
        "location": "人事相談室",
        "format": "face_to_face"
      },
      "aiReasoning": {
        "matchingFactors": [
          "即時対応のみ可能",
          "一般的な相談は対応可能",
          "他に空きがない状況"
        ],
        "summary": "限定的な対応となります",
        "detailedReasons": [
          "専門性は低いですが即座に対応できます",
          "基本的な相談には対応可能です",
          "他の担当者の空きが限定的です"
        ]
      },
      "staffFriendlyDisplay": {
        "title": "緊急対応担当者",
        "summary": "即時対応可能ですが専門性は限定的",
        "highlights": [
          "即座に対応可能",
          "基本的な相談には対応",
          "専門的な内容は別途調整"
        ]
      },
      "rankingReason": "緊急対応として提案",
      "alternatives": [
        "日程を調整して専門担当者との面談",
        "人事部直接相談 (内線1234)",
        "メール相談での事前対応"
      ]
    }
  ]
}
```

## 4. キャンセル・変更テストデータ

### 4-1. 緊急キャンセルパターン

```json
{
  "cancellationTest": {
    "emergencyCancel": {
      "bookingId": "AI-BOOK-1726502400-abc123",
      "voicedriveRequestId": "VD-REQ-2025091601",
      "cancellationType": "emergency",
      "reason": "救急患者対応のため参加不可",
      "detailedReason": "緊急手術の助手として参加が必要になりました。大変申し訳ありません。",
      "contactMethod": "phone",
      "cancelledBy": "田中 花子",
      "cancelTimestamp": "2025-09-20T12:30:00Z",
      "expectedResponse": {
        "status": "approved",
        "refundEligible": true,
        "notificationsSent": ["interviewer_phone", "manager_alert", "hr_notification"],
        "emergencyProtocolActivated": true
      }
    },
    "sameDayCancel": {
      "bookingId": "AI-BOOK-1726502401-def456",
      "voicedriveRequestId": "VD-REQ-2025091602",
      "cancellationType": "same_day",
      "reason": "体調不良",
      "detailedReason": "発熱のため出勤できません",
      "contactMethod": "email",
      "cancelledBy": "佐藤 健一",
      "cancelTimestamp": "2025-09-21T08:00:00Z",
      "expectedResponse": {
        "status": "approved",
        "refundEligible": true,
        "notificationsSent": ["interviewer_email", "hr_notification"],
        "replacementOffered": true
      }
    }
  }
}
```

### 4-2. 日時変更テストパターン

```json
{
  "rescheduleTest": {
    "dateTimeChange": {
      "bookingId": "AI-BOOK-1726502402-ghi789",
      "voicedriveRequestId": "VD-REQ-2025091603",
      "changeType": "datetime",
      "newPreferences": {
        "alternativeDates": ["2025-09-23", "2025-09-24", "2025-09-25"],
        "alternativeTimes": ["10:00", "14:00", "16:00"],
        "keepInterviewer": true,
        "maxDuration": 45
      },
      "changeReason": "当日夜勤シフトのため",
      "requestedBy": "山田 良子",
      "requestTimestamp": "2025-09-18T09:00:00Z",
      "expectedResponse": {
        "status": "auto_approved",
        "newProposals": 3,
        "approvalTime": "immediate",
        "sameInterviewer": true
      }
    },
    "interviewerChange": {
      "bookingId": "AI-BOOK-1726502403-jkl012",
      "voicedriveRequestId": "VD-REQ-2025091604",
      "changeType": "interviewer",
      "newPreferences": {
        "keepInterviewer": false,
        "preferredInterviewer": "山田良子",
        "alternativeDates": ["2025-09-22"],
        "alternativeTimes": ["15:00"]
      },
      "changeReason": "人事制度について詳しく相談したい",
      "requestedBy": "鈴木 太郎",
      "requestTimestamp": "2025-09-16T14:00:00Z",
      "expectedResponse": {
        "status": "pending_approval",
        "estimatedApprovalTime": "2時間以内",
        "requiresManualReview": true,
        "reason": "担当者変更のため要承認"
      }
    }
  }
}
```

## 5. エラーパターンテストデータ

### 5-1. API通信エラーパターン

```json
{
  "errorTests": {
    "networkTimeout": {
      "scenario": "VoiceDrive側通信タイムアウト",
      "simulateCondition": "3秒以上のレスポンス遅延",
      "expectedBehavior": "自動リトライ3回 → フォールバック処理",
      "fallbackAction": "人事部直接連絡案内"
    },
    "invalidToken": {
      "scenario": "Bearer Token期限切れ",
      "simulateCondition": "期限切れTokenでのAPI呼び出し",
      "expectedBehavior": "Token自動更新 → リクエスト再実行",
      "fallbackAction": "手動認証画面表示"
    },
    "serverError": {
      "scenario": "医療システム側500エラー",
      "simulateCondition": "内部サーバーエラー発生",
      "expectedBehavior": "エラーメッセージ表示 → 代替手段案内",
      "fallbackAction": "即時予約システムへの誘導"
    }
  }
}
```

### 5-2. データ不整合パターン

```json
{
  "dataInconsistencyTests": {
    "staffIdMismatch": {
      "scenario": "職員ID形式不一致",
      "testData": {
        "voiceDriveFormat": "VD-NS-001",
        "medicalSystemFormat": "OH-NS-2021-001"
      },
      "expectedBehavior": "ID変換処理 → データマッピング",
      "fallbackAction": "手動確認フロー"
    },
    "interviewTypeMismatch": {
      "scenario": "面談種別マッピング不一致",
      "testData": {
        "voiceDriveType": "career_consultation",
        "medicalSystemType": "career_support"
      },
      "expectedBehavior": "種別変換 → 正規化処理",
      "fallbackAction": "デフォルト種別設定"
    }
  }
}
```

## 6. 負荷テスト用データセット

### 6-1. 同時接続テスト

```json
{
  "loadTestData": {
    "concurrentRequests": {
      "maxConnections": 50,
      "requestsPerMinute": 100,
      "testDuration": "10分間",
      "testScenarios": [
        {
          "scenario": "通常予約申込",
          "concurrency": 20,
          "frequency": "30秒間隔"
        },
        {
          "scenario": "AI提案取得",
          "concurrency": 15,
          "frequency": "45秒間隔"
        },
        {
          "scenario": "キャンセル処理",
          "concurrency": 10,
          "frequency": "60秒間隔"
        },
        {
          "scenario": "変更リクエスト",
          "concurrency": 5,
          "frequency": "120秒間隔"
        }
      ]
    }
  }
}
```

### 6-2. 大量データ処理テスト

```json
{
  "bulkDataTest": {
    "staffBatch": {
      "recordCount": 1000,
      "batchSize": 50,
      "processingTime": "5秒以内/バッチ",
      "memoryUsage": "100MB以下"
    },
    "evaluationBatch": {
      "recordCount": 5000,
      "batchSize": 100,
      "processingTime": "10秒以内/バッチ",
      "memoryUsage": "200MB以下"
    }
  }
}
```

## 7. APIスキーマ定義（OpenAPI）

### 7-1. 提案受信APIスキーマ

```yaml
openapi: 3.0.0
info:
  title: Medical System Interview API
  version: 2.1.0
paths:
  /api/voicedrive/proposals:
    post:
      summary: AI提案3パターン送信
      requestBody:
        content:
          application/json:
            schema:
              type: object
              required:
                - voicedriveRequestId
                - requestId
                - proposals
              properties:
                voicedriveRequestId:
                  type: string
                  example: "VD-REQ-2025091601"
                requestId:
                  type: string
                  example: "REQ-AI-2025091601-001"
                proposals:
                  type: array
                  minItems: 1
                  maxItems: 3
                  items:
                    $ref: '#/components/schemas/InterviewProposal'
      responses:
        '200':
          description: 提案受信成功
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  message:
                    type: string
components:
  schemas:
    InterviewProposal:
      type: object
      required:
        - id
        - rank
        - confidence
        - interviewer
        - schedule
      properties:
        id:
          type: string
          example: "REC-001"
        rank:
          type: integer
          minimum: 1
          maximum: 3
        confidence:
          type: number
          minimum: 0
          maximum: 100
        interviewer:
          $ref: '#/components/schemas/Interviewer'
        schedule:
          $ref: '#/components/schemas/Schedule'
```

## 8. テスト実行手順

### 8-1. 事前準備チェックリスト

```
□ Bearer Token発行・設定確認
□ API endpoints接続確認
□ テストデータベース準備
□ ログ監視システム起動
□ エラーハンドリング設定確認
□ フォールバック機能確認
□ 通知システム動作確認
□ カレンダー連携確認
```

### 8-2. テスト実行順序

```
Phase 1: 基本通信テスト (30分)
1. API接続確認
2. 認証機能テスト
3. 基本データ送受信

Phase 2: 機能統合テスト (2時間)
1. 面談予約フルフロー
2. AI提案表示・選択
3. キャンセル・変更処理

Phase 3: 負荷・性能テスト (1時間)
1. 同時接続テスト
2. 大量データ処理
3. レスポンス時間測定

Phase 4: 障害・復旧テスト (1時間)
1. ネットワーク障害シミュレーション
2. システム障害対応
3. データ復旧確認
```

---

**テストサポート**: 医療システム開発チーム
**技術問い合わせ**: integration-test@hospital.jp
**緊急連絡**: 内線1234（24時間対応）