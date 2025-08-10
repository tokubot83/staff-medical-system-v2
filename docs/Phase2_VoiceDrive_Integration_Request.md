# VoiceDriveチーム向け Phase 2 統合要請書

**作成日**: 2025年8月10日  
**送信元**: 医療職員管理システムチーム  
**送信先**: VoiceDriveチーム

## 📋 Phase 1完了報告

Phase 1の統合作業、お疲れさまでした！
- 10種類面談システムへの移行: ✅ 完了
- 統合テスト: ✅ 成功（90%成功率）
- 本番デプロイ: ✅ 完了

## 🚀 Phase 2 開始のお知らせ

### 実装済み内容
医療職員管理システム側で以下を実装しました：

1. **3段階選択フローUI**
   - コンポーネント: `ThreeStepInterviewFlow.tsx`
   - デモURL: http://localhost:3000/interview-phase2
   - 設計書: `Phase2_UserFlow_Design.md`（添付）

2. **実装機能**
   - ✅ プログレスバー表示
   - ✅ 選択内容サマリー
   - ✅ モバイルレスポンシブ対応
   - ✅ 条件付きカテゴリ選択（3種類の面談のみ）

## 🤝 VoiceDriveチームへの依頼事項

### 1. API連携準備
以下のエンドポイントの実装をお願いします：

```typescript
// 1. 予約可能時間取得
GET /api/v1/availability
Query Parameters:
  - staffId: string
  - date: string (YYYY-MM-DD)
  - interviewType: string
Response:
  - availableSlots: Array<{time: string, available: boolean}>

// 2. 予約確定
POST /api/v1/bookings/confirm
Body:
  - staffId: string
  - interviewType: string
  - category?: string (3種類の面談のみ)
  - date: string
  - time: string
Response:
  - bookingId: string
  - status: 'confirmed' | 'pending'
  - notificationSent: boolean

// 3. カレンダー最適化情報
GET /api/v1/calendar/optimization
Query Parameters:
  - staffId: string
  - month: string (YYYY-MM)
Response:
  - heatmap: Array<{date: string, availability: 'high'|'medium'|'low'}>
  - suggestedSlots: Array<{date: string, time: string, reason: string}>
```

### 2. 提案機能の実装

Phase 1で提案いただいた以下の機能の実装をお願いします：

```typescript
interface CalendarOptimization {
  showAvailabilityHeatmap: boolean;  // 空き状況のヒートマップ
  smartTimeSlotSuggestion: boolean;   // AIによる最適時間提案
  conflictDetection: boolean;         // 他の予定との競合検出
}
```

### 3. 通知機能の強化
- 予約確定通知
- リマインダー通知（前日・当日）
- キャンセル通知

## 📅 スケジュール提案

### Week 1 (8/10-8/16)
- [ ] キックオフミーティング
- [ ] API仕様の最終確認
- [ ] 開発環境の準備

### Week 2 (8/17-8/23)
- [ ] API実装
- [ ] 統合テスト環境構築
- [ ] 初期統合テスト

### Week 3 (8/24-8/30)
- [ ] 最終調整
- [ ] パフォーマンステスト
- [ ] 本番デプロイ準備

## 🔄 日次同期の提案

効率的な開発のため、以下の同期方法を提案します：

1. **日次スタンドアップ（任意）**
   - 時間: 10:00-10:15
   - 形式: Slack/Teams（テキストベース可）

2. **週次進捗確認**
   - 時間: 毎週月曜 14:00-14:30
   - 形式: オンラインミーティング

3. **Slackチャンネル**
   - `#phase2-integration`での随時コミュニケーション

## 📎 添付資料

1. `Phase2_UserFlow_Design.md` - ユーザーフロー詳細設計
2. `Phase2計画書.md` - 全体計画（参照用）

## ✅ 確認事項

以下についてご確認をお願いします：

- [ ] API仕様に問題がないか
- [ ] スケジュールが実現可能か
- [ ] 追加で必要な情報はないか
- [ ] カレンダー最適化機能の優先順位

## 📞 連絡先

ご質問や調整が必要な場合は、以下の方法でご連絡ください：
- Slackチャンネル: #staff-medical-integration
- メール: medical-system-team@example.com

---

**次のアクション**: 
1. この要請書の内容をご確認ください
2. 8/12（月）までにフィードバックをお願いします
3. キックオフミーティングの日程調整をお願いします

Phase 2も協力して素晴らしいシステムを作りましょう！
よろしくお願いいたします。