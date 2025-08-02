# 面談制度API設計方針

## 1. 概要

このドキュメントは、職員カルテ＋人材マネジメントシステムと法人内SNSシステム（VoiceDrive）間のAPI連携に関する設計方針を定義します。

## 2. API設計原則

### 2.1 基本原則
- **RESTful設計**: HTTPメソッドとリソースベースのURL設計
- **JSON形式**: リクエスト/レスポンスはJSON形式で統一
- **認証**: JWT（JSON Web Token）による認証
- **バージョニング**: URLパスにバージョン番号を含める（/api/v1/）
- **エラーハンドリング**: 統一されたエラーレスポンス形式

### 2.2 共通ヘッダー
```
Content-Type: application/json
Authorization: Bearer {JWT_TOKEN}
X-Request-ID: {UUID}
X-Client-Version: {VERSION}
```

## 3. API エンドポイント設計

### 3.1 予約管理API

#### 3.1.1 予約作成
```
POST /api/v1/interview/bookings
```

**リクエスト:**
```json
{
  "employeeId": "E001234",
  "preferredDates": ["2024-12-01", "2024-12-02", "2024-12-03"],
  "preferredTimes": ["13:00", "14:00", "15:00"],
  "interviewType": "career_development",
  "interviewCategory": "career_path",
  "requestedTopics": ["昇進について", "資格取得支援"],
  "description": "今後のキャリアパスについて相談したい",
  "urgencyLevel": "medium",
  "preferredInterviewer": "I001"
}
```

**レスポンス:**
```json
{
  "success": true,
  "message": "面談予約が完了しました",
  "data": {
    "bookingId": "BK2024120100001",
    "confirmedDate": "2024-12-01",
    "confirmedTime": "14:00",
    "location": "人事部面談室A",
    "interviewerName": "田中 太郎"
  }
}
```

#### 3.1.2 予約一覧取得
```
GET /api/v1/interview/bookings?employeeId={id}&status={status}&dateFrom={date}&dateTo={date}
```

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "bookingId": "BK2024120100001",
        "employeeId": "E001234",
        "employeeName": "山田 花子",
        "bookingDate": "2024-12-01",
        "startTime": "14:00",
        "endTime": "15:00",
        "interviewType": "career_development",
        "status": "scheduled",
        "interviewerName": "田中 太郎"
      }
    ],
    "pagination": {
      "total": 15,
      "page": 1,
      "totalPages": 2,
      "limit": 10
    }
  }
}
```

#### 3.1.3 予約詳細取得
```
GET /api/v1/interview/bookings/{bookingId}
```

#### 3.1.4 予約更新
```
PUT /api/v1/interview/bookings/{bookingId}
```

#### 3.1.5 予約キャンセル
```
DELETE /api/v1/interview/bookings/{bookingId}
```

### 3.2 時間枠管理API

#### 3.2.1 利用可能時間枠取得
```
GET /api/v1/interview/time-slots/available?dateFrom={date}&dateTo={date}
```

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "slots": [
      {
        "date": "2024-12-01",
        "availableSlots": [
          {
            "startTime": "09:00",
            "endTime": "10:00",
            "interviewerId": "I001",
            "interviewerName": "田中 太郎"
          },
          {
            "startTime": "14:00",
            "endTime": "15:00",
            "interviewerId": "I002",
            "interviewerName": "佐藤 花子"
          }
        ]
      }
    ]
  }
}
```

#### 3.2.2 時間枠ブロック（管理者用）
```
POST /api/v1/interview/time-slots/block
```

### 3.3 通知管理API

#### 3.3.1 通知送信
```
POST /api/v1/interview/notifications
```

#### 3.3.2 通知一覧取得
```
GET /api/v1/interview/notifications?recipientId={id}&status={status}
```

### 3.4 統計・レポートAPI

#### 3.4.1 面談統計取得
```
GET /api/v1/interview/statistics?department={dept}&dateFrom={date}&dateTo={date}
```

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalBookings": 150,
      "completedInterviews": 120,
      "cancelledInterviews": 10,
      "averageSatisfaction": 4.2
    },
    "byType": {
      "career_development": 45,
      "regular_annual": 40,
      "stress_care": 35
    },
    "byDepartment": {
      "nursing": 50,
      "medical": 40,
      "administration": 30
    }
  }
}
```

## 4. エラーハンドリング

### 4.1 エラーレスポンス形式
```json
{
  "success": false,
  "error": {
    "code": "BOOKING_CONFLICT",
    "message": "指定された時間帯は既に予約されています",
    "details": {
      "conflictingBookingId": "BK2024120100002",
      "suggestedAlternatives": [
        {
          "date": "2024-12-01",
          "time": "15:00"
        }
      ]
    }
  },
  "timestamp": "2024-12-01T10:30:00Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### 4.2 エラーコード一覧

| コード | HTTPステータス | 説明 |
|--------|---------------|------|
| UNAUTHORIZED | 401 | 認証エラー |
| FORBIDDEN | 403 | 権限不足 |
| NOT_FOUND | 404 | リソースが見つからない |
| BOOKING_CONFLICT | 409 | 予約の競合 |
| INVALID_REQUEST | 400 | リクエストパラメータエラー |
| INTERNAL_ERROR | 500 | サーバー内部エラー |

## 5. 認証・認可

### 5.1 JWT構造
```json
{
  "sub": "E001234",
  "name": "山田 花子",
  "email": "yamada@example.com",
  "department": "nursing",
  "permissionLevel": 3,
  "iat": 1701410400,
  "exp": 1701414000
}
```

### 5.2 権限チェック
各APIエンドポイントで必要な権限レベルをチェック：

| エンドポイント | 必要権限レベル |
|---------------|---------------|
| 予約作成 | L1以上 |
| 予約一覧（自分） | L1以上 |
| 予約一覧（全体） | L5以上 |
| 時間枠ブロック | L5以上 |
| 統計取得 | L7以上 |

## 6. システム間連携

### 6.1 イベント駆動型連携
```json
{
  "eventType": "BOOKING_CREATED",
  "timestamp": "2024-12-01T10:30:00Z",
  "data": {
    "bookingId": "BK2024120100001",
    "employeeId": "E001234",
    "interviewType": "career_development"
  }
}
```

### 6.2 Webhook設定
両システム間でWebhookを設定し、リアルタイムでのデータ同期を実現：

- 予約作成/更新/キャンセル時の通知
- 面談完了時の記録同期
- リマインダー送信状態の共有

## 7. パフォーマンス最適化

### 7.1 レスポンスキャッシング
- 時間枠情報: 5分間キャッシュ
- 統計情報: 1時間キャッシュ
- 個人の予約情報: キャッシュなし

### 7.2 ページネーション
大量データ取得時は必ずページネーションを実装：
```
?page=1&limit=20&sortBy=date&sortOrder=desc
```

### 7.3 フィールド選択
必要なフィールドのみ取得可能に：
```
?fields=bookingId,employeeName,bookingDate,status
```

## 8. セキュリティ考慮事項

### 8.1 通信の暗号化
- 全ての通信はHTTPS（TLS 1.2以上）で暗号化
- 証明書のピン留めを実装

### 8.2 レート制限
- 一般ユーザー: 100リクエスト/分
- 管理者: 500リクエスト/分
- IPアドレスベース: 1000リクエスト/分

### 8.3 入力検証
- SQLインジェクション対策
- XSS対策
- パラメータの型・範囲チェック

## 9. モニタリング

### 9.1 ロギング
全てのAPIリクエスト/レスポンスをログ記録：
- リクエストID
- ユーザーID
- HTTPメソッド・URL
- レスポンスステータス
- 処理時間

### 9.2 メトリクス
- API応答時間
- エラー率
- 同時接続数
- データベース接続プール状態

## 10. 移行計画

### Phase 1: API基盤構築
- 認証・認可システムの実装
- 基本的なCRUD APIの実装

### Phase 2: 既存システムとの接続
- VoiceDriveシステムとの接続テスト
- データ同期の検証

### Phase 3: 段階的移行
- 新規予約から新APIを使用
- 既存データの移行バッチ実行

### Phase 4: 完全移行
- 旧APIの廃止
- パフォーマンスチューニング

## 11. API仕様書の管理

- OpenAPI 3.0形式で管理
- Swagger UIでの閲覧・テスト環境提供
- バージョン管理とチェンジログの維持