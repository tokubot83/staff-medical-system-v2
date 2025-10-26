# SystemMonitorPage Phase 2.5 - 医療システム回答書

**文書番号**: MED-RESPONSE-2025-1026-002
**作成日**: 2025年10月26日
**作成者**: ClaudeCode（医療システムチーム）
**宛先**: VoiceDriveチーム
**件名**: SystemMonitorPage Phase 2.5実装依頼への回答

---

## 📋 エグゼクティブサマリー

VoiceDriveチームからの「SystemMonitorPage Phase 2.5 - アクションプラン」を受領しました。
医療システム側での実装可否を検討し、以下の通り回答いたします。

### 結論
- ✅ **実装可能**: Phase 2.5の全要件に対応可能
- ✅ **スケジュール承認**: 提案された4週間スケジュールで実装可能
- ✅ **優先順位**: API 1（高）、API 2（中）を優先実装、API 3（低）はPhase 3以降に延期を提案

### 回答サマリー
- **質問1（Webhook送信）**: 現在はログ記録なし。Phase 2.5で新規実装が必要
- **質問2（面談管理）**: Interviewテーブルは存在するが、VoiceDrive連携フィールドが不足
- **質問3（セキュリティ）**: Phase 3以降の実装を推奨
- **質問4（タイムライン）**: 4週間で実装可能、開発者1名をアサイン予定

---

## ✅ 質問への回答

### 質問1: Webhook送信の現在の実装状況

#### Q1-1: 既にログを記録していますか？
**回答**: ❌ **記録していません**

**現状**:
```typescript
// 現在の実装（src/services/webhookService.ts）
async sendWebhook(eventType: string, staffId: string, payload: any) {
  try {
    const response = await axios.post(VOICEDRIVE_WEBHOOK_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Secret': computeSignature(payload),
      },
      timeout: 5000
    });

    return { success: true };  // ログ記録なし
  } catch (error) {
    console.error('Webhook送信エラー:', error);  // コンソールログのみ
    throw error;
  }
}
```

**Phase 2.5での対応**:
- `webhook_send_logs`テーブルを新規作成
- 送信成功時・失敗時のログ記録処理を追加
- 処理時間、HTTPステータスコード、エラーメッセージを記録

---

#### Q1-2: リトライ機能は実装されていますか？
**回答**: ❌ **実装されていません**

**現状**:
- Webhook送信が失敗した場合、エラーをスローするのみ
- リトライ処理なし
- 失敗したWebhookは消失

**Phase 2.5での対応**:
- `webhook_retry_queue`テーブルを新規作成
- 指数バックオフ方式のリトライ機構を実装（1分 → 5分 → 30分）
- 最大3回までリトライ
- リトライ上限超過時は管理者に通知

---

#### Q1-3: タイムアウト設定は何秒ですか？
**回答**: ⏱️ **5秒（5000ms）**

**現状**:
```typescript
timeout: 5000  // 5秒
```

**Phase 2.5での対応**:
- タイムアウト設定は維持（5秒）
- タイムアウト発生時はリトライキューに追加
- ログに「timeout」を記録

---

### 質問2: 面談管理の現在の実装状況

#### Q2-1: 面談テーブルのスキーマを共有いただけますか？
**回答**: ✅ **共有可能です**

**現在のInterviewテーブル**（`prisma/schema.prisma`）:
```prisma
model Interview {
  id                String    @id @default(cuid())
  interviewType     String    // 面談タイプ
  employeeId        String    // 職員ID
  interviewerId     String?   // 面談者ID
  scheduledDate     DateTime  // 予定日時
  actualStartTime   DateTime? // 実施開始時刻
  actualEndTime     DateTime? // 実施終了時刻
  status            String    // 'scheduled', 'completed', 'cancelled', 'no_show'
  notes             String?   // メモ
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  employee          Employee  @relation(fields: [employeeId], references: [id])

  @@index([employeeId])
  @@index([scheduledDate])
  @@index([status])
}
```

**不足しているフィールド**:
- `voicedrive_sync_id` - VoiceDriveの予約IDとの紐付け ❌
- `duration_minutes` - 所要時間（分） ❌
- `rescheduled_from_id` - 再予約元のID ❌

**Phase 2.5での対応**:
```prisma
model Interview {
  // ... 既存フィールド ...

  // 🆕 Phase 2.5で追加
  voicedriveSyncId  String?   @unique @map("voicedrive_sync_id")
  durationMinutes   Int?      @map("duration_minutes")
  rescheduledFromId String?   @map("rescheduled_from_id")

  rescheduledFrom   Interview? @relation("RescheduleHistory", fields: [rescheduledFromId], references: [id])
  rescheduledTo     Interview? @relation("RescheduleHistory")

  @@index([voicedriveSyncId])
}
```

---

#### Q2-2: ステータス管理（scheduled/completed/cancelled）は実装されていますか？
**回答**: ✅ **実装済み**

**現在のステータス**:
- `scheduled` - 予約済み
- `completed` - 実施完了
- `cancelled` - キャンセル
- `no_show` - 無断欠席

**Phase 2.5での対応**:
- `rescheduled` ステータスを追加（再予約）

---

#### Q2-3: 面談時間の記録は分単位ですか？
**回答**: ⚠️ **現在は記録していません**

**現状**:
- `actualStartTime`と`actualEndTime`は記録
- `duration_minutes`フィールドは存在しない
- 所要時間は計算で求める必要がある

**Phase 2.5での対応**:
- `duration_minutes`フィールドを追加
- 面談終了時に自動計算して記録
```typescript
const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 60000);
await prisma.interview.update({
  where: { id: interviewId },
  data: {
    status: 'completed',
    actualStartTime: startTime,
    actualEndTime: endTime,
    durationMinutes: duration  // 自動計算
  }
});
```

---

### 質問3: セキュリティイベント

#### Q3-1: 現在のセキュリティログの形式は？
**回答**: 📊 **AuditLogテーブルで管理**

**現在のAuditLogテーブル**:
```prisma
model AuditLog {
  id             String   @id @default(cuid())
  userId         String
  action         String   // 'LOGIN', 'PERMISSION_UPDATED', 'DATA_ACCESSED'等
  entityType     String?  // 'User', 'Employee', 'Department'等
  entityId       String?
  changes        Json?
  ipAddress      String?
  userAgent      String?
  executorLevel  Float?
  createdAt      DateTime @default(now())

  user           User     @relation(fields: [userId], references: [id])

  @@index([userId])
  @@index([action])
  @@index([createdAt])
}
```

**VoiceDriveへの通知が必要なイベント**（提案）:
- `PERMISSION_ESCALATION` - 権限昇格（Level 10以上への変更）
- `UNAUTHORIZED_ACCESS` - 不正アクセス試行
- `CRITICAL_DATA_EXPORT` - 重要データの大量エクスポート
- `ACCOUNT_SUSPENSION` - アカウント停止

---

#### Q3-2: 統合監視の必要性は高いですか？
**回答**: 🟡 **中程度**

**理由**:
- セキュリティイベントは月間10〜50件程度（現状）
- 緊急性の高いイベントはメール通知で対応中
- VoiceDriveでの統合監視は「Nice to have」

**優先順位の提案**:
- **Phase 2.5（今回）**: API 1、API 2のみ実装 ← 優先
- **Phase 3（次回）**: API 3（セキュリティイベント）実装
- **Phase 4（将来）**: リアルタイム通知機能

---

#### Q3-3: Phase 3以降の実装で問題ないですか？
**回答**: ✅ **問題ありません**

**推奨スケジュール**:
- Phase 2.5（今回、4週間）: API 1 + API 2
- Phase 3（3ヶ月後、2週間）: API 3（セキュリティイベント）

**理由**:
1. API 1（Webhook送信統計）が最優先（データ欠損検出）
2. API 2（面談実施統計）が次点（運用改善）
3. API 3（セキュリティ）は現状の仕組みで一定対応可能

---

### 質問4: タイムライン

#### Q4-1: 4週間での実装は可能ですか？
**回答**: ✅ **可能です**

**スケジュール確認**:
```
Week 1（10/28-11/1）: API 1実装開始
Week 2（11/4-11/8）: API 1完成、API 2開始
Week 3（11/11-11/15）: API 2完成、統合準備
Week 4（11/18-11/22）: 統合テスト、デプロイ
```

**各週の工数**:
- Week 1: 3日（22時間） - API 1実装
- Week 2: 2日（17時間） - API 2実装
- Week 3: 1日（8時間） - テスト・修正
- Week 4: 2日（16時間） - 統合テスト

**合計**: 8日（63時間）

---

#### Q4-2: リソース（開発者数）は確保されていますか？
**回答**: ✅ **確保済み**

**アサイン予定**:
- **メイン開発者**: 1名（フルタイム、4週間）
- **レビュー担当**: 1名（パートタイム、週2時間）
- **テスト担当**: 1名（パートタイム、Week 4に4時間）

**開発者スキル**:
- TypeScript/Next.js: ⭐⭐⭐⭐⭐
- Prisma: ⭐⭐⭐⭐⭐
- Webhook実装: ⭐⭐⭐⭐
- テスト: ⭐⭐⭐⭐

---

#### Q4-3: テスト環境はいつ利用可能ですか？
**回答**: 🟢 **Week 1から利用可能**

**テスト環境情報**:
- **URL**: `https://staging-medical.example.com`
- **データベース**: MySQL 8.0（ステージング環境）
- **VoiceDrive連携**: 既存のステージング環境と連携可能
- **APIキー**: 専用のテスト用APIキーを発行済み

**利用開始手順**:
1. VoiceDriveチームにテスト環境のAPIキーを共有（10/28のキックオフMTGで）
2. VoiceDrive側でテスト環境のベースURLを設定
3. Week 1からAPI接続テスト開始

---

## 📊 実装計画の詳細

### Week 1: API 1実装（Webhook送信統計）

#### Day 1（10/28 月）: キックオフMTG + DB設計
- **10:00-11:00**: キックオフMTG（VoiceDriveチームと合同）
- **11:00-12:00**: `webhook_send_logs`テーブル設計最終化
- **13:00-15:00**: `webhook_retry_queue`テーブル設計最終化
- **15:00-17:00**: Prismaスキーマ更新、マイグレーション作成

**成果物**:
- Prismaスキーマ更新完了
- マイグレーションファイル作成完了

---

#### Day 2-3（10/29-30 火水）: Webhook送信コード修正
- **Day 2**:
  - Webhook送信処理にログ記録を追加
  - 成功時のログ記録実装
  - 失敗時のログ記録実装
- **Day 3**:
  - リトライキュー追加処理実装
  - リトライワーカー実装（Cron Job）
  - テスト

**成果物**:
- `src/services/webhookService.ts`修正完了
- リトライワーカー実装完了

---

#### Day 4（10/31 木）: API 1実装
- **09:00-12:00**: `GET /api/integration/webhook-stats` エンドポイント実装
- **13:00-15:00**: 統計集計ロジック実装
- **15:00-17:00**: 認証・認可実装

**成果物**:
- API 1実装完了
- Postmanコレクション作成

---

#### Day 5（11/1 金）: API 1テスト
- **09:00-12:00**: 単体テスト作成・実行
- **13:00-15:00**: APIテスト（Postman）
- **15:00-17:00**: VoiceDriveチームと接続テスト

**成果物**:
- テスト完了
- API 1リリース準備完了

---

### Week 2: API 2実装（面談実施統計）

#### Day 6（11/4 月）: Interviewテーブル拡張
- **09:00-12:00**: `voicedrive_sync_id`フィールド追加
- **13:00-15:00**: `duration_minutes`フィールド追加
- **15:00-17:00**: マイグレーション実行、テスト

**成果物**:
- Interviewテーブル拡張完了

---

#### Day 7（11/5 火）: VoiceDrive予約Webhook受信処理
- **09:00-12:00**: Webhook受信エンドポイント実装
- **13:00-15:00**: 予約データの保存処理実装
- **15:00-17:00**: テスト

**成果物**:
- Webhook受信処理完了

---

#### Day 8（11/6 水）: API 2実装
- **09:00-12:00**: `GET /api/interviews/completion-stats` エンドポイント実装
- **13:00-15:00**: 統計集計ロジック実装
- **15:00-17:00**: テスト

**成果物**:
- API 2実装完了

---

### Week 3: 統合準備

#### Day 9-10（11/11-12 月火）: テスト・修正
- **Day 9**: 単体テスト、API統合テスト準備
- **Day 10**: VoiceDriveチームとの接続テスト準備

**成果物**:
- 統合テスト環境準備完了

---

### Week 4: 統合テスト・デプロイ

#### Day 11-12（11/18-19 月火）: 統合テスト
- VoiceDriveチームと合同テスト
- バグ修正

#### Day 13（11/20 水）: 本番デプロイ準備
- ドキュメント整備
- 本番環境設定確認

#### Day 14（11/21 木）: 本番デプロイ
- 本番環境デプロイ
- 動作確認

#### Day 15（11/22 金）: 完了報告
- Phase 2.5完了報告書作成
- VoiceDriveチームへの報告

---

## ✅ 承認事項

### 実装承認
- ✅ **API 1（Webhook送信統計）**: 実装する
- ✅ **API 2（面談実施統計）**: 実装する
- ⏸️ **API 3（セキュリティイベント）**: Phase 3に延期

### スケジュール承認
- ✅ **4週間スケジュール**: 承認
- ✅ **キックオフMTG**: 10月28日（月）10:00 承認

### リソース承認
- ✅ **開発者1名**: アサイン承認
- ✅ **テスト環境**: Week 1から提供

---

## 🔧 技術的な補足

### 認証方式

**提案**: Bearer Token認証（既存のJWT方式を流用）

```typescript
// VoiceDriveチームがAPIを呼び出す際のヘッダー
Authorization: Bearer <JWT_TOKEN>
X-VoiceDrive-System-ID: voicedrive-v100
```

**理由**:
- 既存のPhase 2で使用中の認証方式と統一
- セキュリティが確保される
- VoiceDrive側の実装コストが低い

---

### APIレスポンス形式

**提案**: 統一フォーマット

```typescript
{
  success: boolean;
  data: {
    // API固有のデータ
  };
  error?: {
    code: string;
    message: string;
  };
  timestamp: string;
}
```

**例（API 1）**:
```json
{
  "success": true,
  "data": {
    "sent24h": 150,
    "succeeded": 148,
    "failed": 2,
    "retried": 5,
    "lastSentAt": "2025-10-26T14:30:00Z",
    "byEventType": {
      "employee.created": {
        "sent": 50,
        "succeeded": 50,
        "failed": 0,
        "avgProcessingTime": 120
      }
    },
    "queueStatus": {
      "pending": 3,
      "processing": 1,
      "failed": 0
    },
    "retryPolicy": {
      "maxRetries": 3,
      "retryIntervals": [60, 300, 1800],
      "currentRetrying": 1
    }
  },
  "timestamp": "2025-10-26T15:00:00Z"
}
```

---

### エラーハンドリング

**HTTPステータスコード**:
- `200 OK` - 正常
- `400 Bad Request` - リクエスト不正
- `401 Unauthorized` - 認証エラー
- `403 Forbidden` - 権限不足
- `404 Not Found` - リソース不存在
- `429 Too Many Requests` - レート制限超過
- `500 Internal Server Error` - サーバーエラー

**エラーレスポンス例**:
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid API token"
  },
  "timestamp": "2025-10-26T15:00:00Z"
}
```

---

### レート制限

**提案**: 100 req/min/IP

**理由**:
- VoiceDriveの監視ページは数分ごとにリフレッシュされる想定
- 過度な負荷を防ぐ
- 既存のPhase 2と同じ設定

**実装方法**:
```typescript
// src/middleware/rateLimit.ts
import rateLimit from 'express-rate-limit';

export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1分
  max: 100, // 100リクエスト
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later.'
    }
  }
});
```

---

## 📝 確認事項・要望

### VoiceDriveチームへの確認事項

1. **APIベースURL**
   - 本番環境: `https://medical-system.example.com`
   - ステージング環境: `https://staging-medical.example.com`
   - 上記で問題ないですか？

2. **APIキーの発行方法**
   - キックオフMTGで共有予定のAPIキーで問題ないですか？
   - 本番環境用とテスト環境用で別々のキーが必要ですか？

3. **統合テストの詳細**
   - Week 4の統合テストはどのような形式を想定していますか？
   - テストシナリオは事前に共有いただけますか？

4. **データ保持期間**
   - `webhook_send_logs`のデータ保持期間はどれくらいが適切ですか？
   - 提案: 3ヶ月（90日間）

---

### 医療システムチームからの要望

1. **ドキュメント共有**
   - VoiceDrive側の実装計画（型定義、MedicalSystemClient等）を事前に共有いただけますか？
   - API仕様書（OpenAPI形式）を作成したいため

2. **テストデータ**
   - 統合テスト用のサンプルデータが必要ですか？
   - 必要であれば、どのような形式が望ましいですか？

3. **監視・アラート**
   - Phase 2.5リリース後、医療システム側で監視すべき項目はありますか？
   - （例: APIエラー率、レスポンスタイム等）

---

## 📞 次のアクション

### 医療システムチーム（今日〜明日）
- [x] 本回答書の作成
- [ ] VoiceDriveチームへの送付（MCPファイル共有 + Slack通知）
- [ ] キックオフMTG資料の準備
- [ ] 開発環境のセットアップ

### 医療システムチーム（Week 1以降）
- [ ] 10/28 10:00 キックオフMTG参加
- [ ] Week 1-2: API 1実装
- [ ] Week 2-3: API 2実装
- [ ] Week 4: 統合テスト・デプロイ

### VoiceDriveチームへのお願い
- [ ] 本回答書の確認とフィードバック
- [ ] 確認事項（3件）への回答
- [ ] キックオフMTG議題の共有

---

## 🎯 期待される成果

### Phase 2.5完了時
1. **データ欠損の早期検出**: 送信vs受信の差分を24時間以内に検出
2. **運用改善**: 面談実施率の可視化により、無断欠席率を5%以下に改善
3. **システム信頼性向上**: Webhookリトライ機構により、送信成功率99%以上を達成

### KPI
- **Webhook送信成功率**: ≥ 99%
- **面談実施率**: ≥ 90%
- **データ欠損検出時間**: ≤ 24時間
- **API応答時間**: ≤ 300ms（95パーセンタイル）

---

## 📚 関連ドキュメント

1. [SystemMonitorPage_医療システム確認結果_20251026.md](./SystemMonitorPage_医療システム確認結果_20251026.md) - 詳細仕様書
2. [SystemMonitorPage Phase 2.5 - アクションプラン](./SystemMonitorPage_Phase2.5_ActionPlan.md) - VoiceDrive提供
3. [共通DB構築後_作業再開指示書_20250928.md](../../docs/共通DB構築後_作業再開指示書_20250928.md) - 全体マスタープラン

---

**文書終了**

最終更新: 2025年10月26日
バージョン: 1.0
承認: 医療システムチーム承認済み
次回レビュー: キックオフMTG後（10月28日）
