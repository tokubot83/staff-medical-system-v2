# API連携準備チェックリスト

## 📅 スケジュール
- VoiceDrive第1段階完了予定：1-2週間後
- テスト・検証期間：3-5日
- API連携開始：第1段階安定稼働後

## ✅ 準備タスク

### 1. モックAPIエンドポイントの作成

#### 1.1 予約登録API
```typescript
POST /api/v1/interviews/bookings/mock

// リクエスト（MedicalSystemBookingRequest形式）
{
  "employeeId": "E001",
  "employeeName": "山田太郎",
  "employeeEmail": "yamada@example.com",
  "facility": "小原病院",
  "department": "内科",
  "position": "看護師",
  "interviewType": "career_support",
  "interviewCategory": "career_path",
  "bookingDate": "2024-12-25",
  "startTime": "14:00",
  "endTime": "15:00",
  "requestedTopics": ["キャリアプラン", "資格取得"],
  "urgencyLevel": "medium"
}

// レスポンス
{
  "success": true,
  "bookingId": "BK-2024-12-001",
  "message": "予約を受け付けました"
}
```

#### 1.2 予約一覧取得API
```typescript
GET /api/v1/interviews/bookings/mock?date=2024-12-25

// レスポンス
{
  "bookings": [...],
  "total": 10,
  "page": 1,
  "totalPages": 1
}
```

### 2. テストシナリオ

#### 2.1 正常系テスト
- [ ] 定期面談の予約（カテゴリなし）
- [ ] サポート面談の予約（カテゴリあり）
- [ ] フィードバック面談の予約（カテゴリなし）
- [ ] 予約の取得・更新・削除

#### 2.2 異常系テスト
- [ ] 必須項目の欠落
- [ ] 不正な日時形式
- [ ] 存在しない面談種別
- [ ] 権限エラー

#### 2.3 パフォーマンステスト
- [ ] 同時アクセス（10件/秒）
- [ ] 大量データ取得（1000件）
- [ ] レスポンスタイム測定

### 3. データ検証項目

#### 3.1 面談種別マッピング
```typescript
// VoiceDrive旧名称 → 新名称の確認
const mappingValidation = {
  'performance_review': 'feedback',
  'career_development': 'career_support',
  'stress_care': 'workplace_support',
  'ad_hoc': 'individual_consultation'
};
```

#### 3.2 カテゴリ選択ルール
```typescript
// カテゴリが不要な面談
const noCategoryRequired = [
  'new_employee_monthly',
  'regular_annual',
  'management_biannual',
  'return_to_work',
  'incident_followup',
  'exit_interview',
  'feedback'
];

// カテゴリが必要な面談と利用可能カテゴリ
const categoryRequired = {
  'career_support': ['career_path', 'skill_development', 'promotion', 'transfer'],
  'workplace_support': ['work_environment', 'interpersonal', 'workload_balance', 'health_safety'],
  'individual_consultation': ['performance', 'compensation', 'training', 'compliance', 'other']
};
```

### 4. エラーハンドリング

#### 4.1 エラーコード定義
```typescript
const errorCodes = {
  'E001': '必須項目が不足しています',
  'E002': '日時形式が不正です',
  'E003': '面談種別が存在しません',
  'E004': 'カテゴリが必要です',
  'E005': 'カテゴリは不要です',
  'E401': '権限がありません',
  'E500': 'サーバーエラー'
};
```

### 5. ログ記録

#### 5.1 記録項目
- リクエスト日時
- 職員ID
- 面談種別
- カテゴリ（該当する場合）
- 処理結果
- エラー詳細（発生時）

### 6. セキュリティ対策

- [ ] HTTPS通信の強制
- [ ] CORS設定の確認
- [ ] レート制限の実装
- [ ] SQLインジェクション対策
- [ ] XSS対策

## 📝 VoiceDriveからの成果物受領時の確認項目

### 1. 実装差分レポート
- [ ] 変更ファイル一覧
- [ ] 変更内容の詳細
- [ ] 影響範囲の説明

### 2. テスト結果レポート
- [ ] 機能テスト結果
- [ ] 統合テスト結果
- [ ] パフォーマンス測定値

### 3. スクリーンショット
- [ ] 各面談種別の予約画面
- [ ] カテゴリ選択の表示/非表示
- [ ] エラー画面

### 4. 課題管理
- [ ] 発見された問題点
- [ ] 対応策
- [ ] 残課題リスト

## 🚀 次のステップ

1. **Week 1-2**: VoiceDrive第1段階実装
2. **Week 2-3**: モックAPI準備・テスト環境構築
3. **Week 3**: 統合テスト実施
4. **Week 4**: 本番環境準備

---

作成日：2024年12月
医療職員管理システムチーム