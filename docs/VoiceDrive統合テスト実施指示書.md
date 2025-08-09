# VoiceDrive統合テスト実施指示書

## 📅 実施日
2024年12月XX日

## 🎯 テスト目的
VoiceDriveの第1段階実装完了を受けて、医療職員管理システムとのAPI連携をテストし、両システム間のデータ連携が正常に動作することを確認する。

---

## 🔗 テストエンドポイント情報

### ベースURL
```
開発環境: http://localhost:3000
本番環境: https://[medical-system-domain]
```

### 利用可能なエンドポイント

#### 1. 予約登録API
```
POST /api/v1/interviews/bookings/mock
Content-Type: application/json
```

#### 2. 予約一覧取得API
```
GET /api/v1/interviews/bookings/mock?date=2024-12-25
```

#### 3. 予約削除API
```
DELETE /api/v1/interviews/bookings/mock?bookingId=BK-2024-12-001
```

---

## 📝 テストシナリオ

### シナリオ1: カテゴリ不要な面談の予約

#### 1.1 定期面談の予約テスト
```json
POST /api/v1/interviews/bookings/mock
{
  "employeeId": "E001",
  "employeeName": "山田太郎",
  "employeeEmail": "yamada@example.com",
  "facility": "小原病院",
  "department": "内科",
  "position": "看護師",
  "interviewType": "regular_annual",
  "bookingDate": "2024-12-25",
  "startTime": "10:00",
  "endTime": "11:00",
  "requestedTopics": ["年間振り返り", "来年度目標"],
  "urgencyLevel": "medium"
}
```

**期待結果**: 
- `interviewCategory`なしで成功
- `bookingId`が返される

#### 1.2 特別面談の予約テスト
```json
POST /api/v1/interviews/bookings/mock
{
  "employeeId": "E002",
  "employeeName": "佐藤花子",
  "employeeEmail": "sato@example.com",
  "facility": "小原病院",
  "department": "外科",
  "position": "医師",
  "interviewType": "return_to_work",
  "bookingDate": "2024-12-26",
  "startTime": "14:00",
  "endTime": "15:00",
  "requestedTopics": ["復職準備", "業務調整"],
  "urgencyLevel": "high"
}
```

**期待結果**: 
- `interviewCategory`なしで成功

#### 1.3 フィードバック面談の予約テスト
```json
POST /api/v1/interviews/bookings/mock
{
  "employeeId": "E003",
  "employeeName": "鈴木一郎",
  "employeeEmail": "suzuki@example.com",
  "facility": "小原病院",
  "department": "管理部",
  "position": "事務員",
  "interviewType": "feedback",
  "bookingDate": "2024-12-27",
  "startTime": "16:00",
  "endTime": "16:30",
  "requestedTopics": ["業務改善提案"],
  "urgencyLevel": "low"
}
```

**期待結果**: 
- `interviewCategory`なしで成功（フィードバック面談はサポート面談だがカテゴリ不要）

### シナリオ2: カテゴリ必須な面談の予約

#### 2.1 キャリア系面談の予約テスト
```json
POST /api/v1/interviews/bookings/mock
{
  "employeeId": "E004",
  "employeeName": "田中美香",
  "employeeEmail": "tanaka@example.com",
  "facility": "小原病院",
  "department": "看護部",
  "position": "主任看護師",
  "interviewType": "career_support",
  "interviewCategory": "career_path",
  "bookingDate": "2024-12-28",
  "startTime": "13:00",
  "endTime": "14:00",
  "requestedTopics": ["キャリアプラン", "昇進準備"],
  "urgencyLevel": "medium"
}
```

**期待結果**: 
- 成功（`interviewCategory`が必須かつ提供されている）

#### 2.2 職場環境系面談の予約テスト
```json
POST /api/v1/interviews/bookings/mock
{
  "employeeId": "E005",
  "employeeName": "高橋健太",
  "employeeEmail": "takahashi@example.com",
  "facility": "小原病院",
  "department": "リハビリ科",
  "position": "理学療法士",
  "interviewType": "workplace_support",
  "interviewCategory": "work_environment",
  "bookingDate": "2024-12-29",
  "startTime": "11:00",
  "endTime": "12:00",
  "requestedTopics": ["職場環境改善", "設備要望"],
  "urgencyLevel": "medium"
}
```

**期待結果**: 
- 成功

#### 2.3 個別相談面談の予約テスト
```json
POST /api/v1/interviews/bookings/mock
{
  "employeeId": "E006",
  "employeeName": "渡辺由美",
  "employeeEmail": "watanabe@example.com",
  "facility": "小原病院",
  "department": "薬剤部",
  "position": "薬剤師",
  "interviewType": "individual_consultation",
  "interviewCategory": "other",
  "bookingDate": "2024-12-30",
  "startTime": "15:00",
  "endTime": "16:00",
  "requestedTopics": ["個人的な相談"],
  "urgencyLevel": "high"
}
```

**期待結果**: 
- 成功

### シナリオ3: エラーケースのテスト

#### 3.1 カテゴリが必須なのに未提供
```json
POST /api/v1/interviews/bookings/mock
{
  "employeeId": "E007",
  "employeeName": "中村太一",
  "employeeEmail": "nakamura@example.com",
  "facility": "小原病院",
  "department": "検査部",
  "position": "臨床検査技師",
  "interviewType": "career_support",
  "bookingDate": "2024-12-31",
  "startTime": "10:00",
  "endTime": "11:00",
  "requestedTopics": ["スキル開発"],
  "urgencyLevel": "medium"
}
```

**期待結果**: 
- エラー（400）
- エラーメッセージ: "interviewCategory is required for career_support"

#### 3.2 必須項目の欠落
```json
POST /api/v1/interviews/bookings/mock
{
  "employeeName": "山田太郎",
  "interviewType": "regular_annual"
}
```

**期待結果**: 
- エラー（400）
- 複数のエラーメッセージ（必須項目不足）

### シナリオ4: 予約一覧取得テスト

```
GET /api/v1/interviews/bookings/mock?date=2024-12-25
```

**期待結果**: 
- 該当日付の予約一覧が返される
- カテゴリありなしの面談が混在している

### シナリオ5: 予約削除テスト

```
DELETE /api/v1/interviews/bookings/mock?bookingId=BK-2024-12-001
```

**期待結果**: 
- 削除成功メッセージ

---

## 🔍 確認ポイント

### 1. カテゴリ選択ルールの確認

#### カテゴリ不要（7種類）
- [ ] `new_employee_monthly` - カテゴリなしで成功
- [ ] `regular_annual` - カテゴリなしで成功
- [ ] `management_biannual` - カテゴリなしで成功
- [ ] `return_to_work` - カテゴリなしで成功
- [ ] `incident_followup` - カテゴリなしで成功
- [ ] `exit_interview` - カテゴリなしで成功
- [ ] `feedback` - カテゴリなしで成功

#### カテゴリ必須（3種類）
- [ ] `career_support` - カテゴリなしでエラー
- [ ] `workplace_support` - カテゴリなしでエラー
- [ ] `individual_consultation` - カテゴリなしでエラー

### 2. 名称マッピングの確認

旧名称でのリクエストも受け付けられることを確認：
- [ ] `performance_review` → `feedback` として処理
- [ ] `career_development` → `career_support` として処理
- [ ] `stress_care` → `workplace_support` として処理
- [ ] `ad_hoc` → `individual_consultation` として処理

### 3. レスポンス形式の確認

- [ ] 成功時: `success: true`, `bookingId`, `message`
- [ ] エラー時: `success: false`, `errors[]`, `code`

---

## 📊 モニタリング

### リアルタイムモニター
医療職員管理システム側で以下のURLでモニタリング画面を提供しています：
```
http://localhost:3000/integration-monitor
```

このモニターで確認できる情報：
- リアルタイムのリクエスト受信状況
- 成功/失敗の統計
- 面談種別ごとのリクエスト数
- 詳細なリクエスト/レスポンス内容

---

## 📋 テスト結果報告フォーマット

テスト完了後、以下の形式で報告をお願いします：

```markdown
## テスト実施結果

### 実施日時
2024年12月XX日 XX:XX - XX:XX

### テスト環境
- VoiceDrive: [バージョン/環境]
- 医療職員管理システム: [環境URL]

### テスト結果サマリー
- 総テストケース数: XX件
- 成功: XX件
- 失敗: XX件
- 成功率: XX%

### 詳細結果
[各シナリオの結果を記載]

### 発見された問題
[もしあれば記載]

### 改善提案
[もしあれば記載]
```

---

## 🚀 次のステップ

1. **統合テスト完了後**
   - テスト結果レポートの提出
   - 問題があれば修正対応

2. **テスト成功後**
   - 本番環境へのデプロイ準備
   - ユーザー向けリリースノート作成

3. **第2段階の準備**
   - 3段階選択フローの実装検討
   - UI/UXの改善

---

## 📞 連絡先

テスト中に問題が発生した場合は、以下に連絡してください：
- 医療職員管理システムチーム: [連絡先]
- 緊急時: [緊急連絡先]

---

**作成日**: 2024年12月  
**作成者**: 医療職員管理システムチーム  
**承認者**: _________________