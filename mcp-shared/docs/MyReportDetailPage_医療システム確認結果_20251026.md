# MyReports/MyReportDetailPage 医療システム確認結果

**文書番号**: MED-CONFIRM-2025-1026-008
**作成日**: 2025年10月26日
**作成者**: ClaudeCode（医療システムチーム）
**宛先**: VoiceDrive開発チーム
**参照文書**:
- MyReportsPage暫定マスターリスト（VD-MASTER-2025-1026-007）
- MyReportDetailPage暫定マスターリスト（VD-MASTER-2025-1026-004）

---

## 📋 エグゼクティブサマリー

VoiceDriveチームから提供された「MyReportsPage」および「MyReportDetailPage」の暫定マスターリストを詳細に分析しました。

### 医療システムチームの結論

✅ **Phase 2.9として実装対応が必要です**

MyReports/MyReportDetailPageは内部通報（ホイッスルブロイング）システムであり、医療システム側で以下の対応が必要です：

1. ✅ **通報エスカレーション受信API実装**
2. ✅ **ケース番号発行ロジック実装** （MED-YYYY-NNNN形式）
3. ✅ **受付確認Webhook送信実装**
4. ✅ **ステータス更新Webhook送信実装**
5. ✅ **調査完了通知Webhook送信実装**

### 実装範囲の明確化

| 機能 | VoiceDrive責任 | 医療システム責任 | 連携方法 |
|------|---------------|----------------|---------|
| 通報受付・管理 | ✅ 100% | ❌ なし | - |
| 調査ノート管理 | ✅ 100% | ❌ なし | - |
| トリアージ | ✅ 100% | ❌ なし | - |
| **重大案件エスカレーション** | ✅ 50%（送信） | ✅ 50%（受信） | **API** |
| **ケース番号発行** | ❌ なし | ✅ 100% | **Webhook** |
| **受付確認通知** | ✅ 50%（受信） | ✅ 50%（送信） | **Webhook** |
| **調査状況更新** | ✅ 50%（受信） | ✅ 50%（送信） | **Webhook** |
| **調査完了通知** | ✅ 50%（受信） | ✅ 50%（送信） | **Webhook** |

**結論**: VoiceDriveが基本機能を100%管轄し、重大案件（critical/escalated）のみ医療システムへ連携

---

## 🔍 詳細分析結果

### 1. データ管理責任の分析

#### WhistleblowingReportテーブル（24フィールド）

| カテゴリ | フィールド数 | VoiceDrive管轄 | 医療システム管轄 | 備考 |
|---------|------------|---------------|----------------|------|
| 通報基本情報 | 8 | 8 | 0 | VoiceDrive完結 |
| ステータス・進捗 | 5 | 5 | 0 | VoiceDrive完結 |
| 調査・対応 | 3 | 3 | 0 | VoiceDrive完結 |
| **医療システム連携** | **4** | **0（キャッシュのみ）** | **4** | **Webhook経由** |
| その他 | 4 | 4 | 0 | VoiceDrive完結（機密情報） |
| **合計** | **24** | **20（83%）** | **4（17%）** | - |

#### 医療システムが管轄する4フィールド

| フィールド | データ型 | 用途 | データフロー |
|----------|---------|------|------------|
| `medicalSystemCaseNumber` | String | ケース番号（MED-YYYY-NNNN） | 医療システム→VoiceDrive（Webhook） |
| `acknowledgementReceived` | Boolean | 受付確認フラグ | VoiceDrive管理、Webhookでtrue |
| `acknowledgementDate` | DateTime | 受付確認日時 | 医療システム→VoiceDrive（Webhook） |
| `estimatedResponseTime` | String | 対応予定時間 | 医療システム→VoiceDrive（Webhook） |

**医療システムの結論**:
- ✅ **4フィールドのみデータ書き込み責任** - 実装スコープが明確
- ✅ **Webhook経由での連携のみ** - 既存のWebhook実装パターンを再利用可能

---

### 2. エスカレーション条件の分析

VoiceDrive側で以下の条件に該当する通報が医療システムへエスカレーションされます：

| 条件 | トリガー | 医療システム対応 |
|------|---------|----------------|
| `severity === 'critical'` | 自動エスカレーション | ケース番号発行＋即座受付確認 |
| `category === 'compliance'` AND `severity === 'high'` | 自動エスカレーション | ケース番号発行＋受付確認 |
| 手動エスカレーション | 調査員判断 | ケース番号発行＋受付確認 |

**対応予定時間の自動計算**（医療システム側で実装）:

| 重要度 | 対応予定時間 | 備考 |
|-------|------------|------|
| `critical` | 1時間以内 | 緊急対応チーム招集 |
| `high` | 当日中 | 担当者即座アサイン |
| `medium` | 3営業日以内 | 通常対応 |
| `low` | 1週間以内 | 通常対応 |

**医療システムの結論**:
- ✅ **エスカレーション条件を承認** - 適切な分担です
- ✅ **対応予定時間の自動計算を実装** - アルゴリズムを提供します

---

## 🔌 API実装要件の確認

### 医療システム側で実装が必要なAPI

#### API-1: 通報エスカレーション受付API（新規実装必須）

**エンドポイント**: `POST /api/webhooks/voicedrive/whistleblowing/escalate`

**VoiceDriveから送信されるペイロード**:
```json
{
  "reportId": "RPT-2025-004",
  "anonymousId": "ANON-9E4C3D",
  "category": "compliance",
  "severity": "critical",
  "title": "重大なコンプライアンス違反の疑い",
  "content": "医療記録の不適切な取り扱いを目撃しました...",
  "escalationReason": "重大な法令違反の可能性があるため",
  "submittedAt": "2025-10-26T15:00:00Z",
  "isAnonymous": true,
  "priority": 10
}
```

**医療システム側の処理フロー**:
```typescript
1. ケース番号発行（MED-2025-NNNN形式）
2. 対応予定時間を計算（severity基準）
3. 内部管理テーブルに保存（オプション）
4. 受付確認Webhookを即座に返送
```

**期待レスポンス**:
```json
{
  "success": true,
  "caseNumber": "MED-2025-0004",
  "estimatedResponseTime": "1時間以内",
  "acknowledgedAt": "2025-10-26T15:01:00Z"
}
```

**実装優先度**: 🔴 **最優先** - Phase 2.9実装必須

---

#### API-2: ステータス更新Webhook送信（新規実装必須）

**エンドポイント**: 医療システム → VoiceDrive

**送信先URL**: `https://voicedrive-v100.vercel.app/api/webhooks/medical-system/whistleblowing/status-update`

**ペイロード**:
```json
{
  "reportId": "RPT-2025-001",
  "caseNumber": "MED-2025-0001",
  "status": "investigating",
  "assignedInvestigators": ["hr_specialist", "legal_counsel"],
  "updatedAt": "2025-10-26T16:00:00Z",
  "nextSteps": "担当者による聞き取り調査を実施します"
}
```

**送信タイミング**:
- 調査員がアサインされた時
- ステータスが変更された時（received → investigating → resolved等）

**実装優先度**: 🔴 **最優先** - Phase 2.9実装必須

---

#### API-3: 調査完了通知Webhook送信（新規実装必須）

**エンドポイント**: 医療システム → VoiceDrive

**送信先URL**: `https://voicedrive-v100.vercel.app/api/webhooks/medical-system/whistleblowing/resolution`

**ペイロード**:
```json
{
  "reportId": "RPT-2025-001",
  "caseNumber": "MED-2025-0001",
  "status": "resolved",
  "resolutionSummary": "上司との面談を実施し、再発防止策を講じました。ご報告ありがとうございました。",
  "resolvedAt": "2025-10-30T10:00:00Z",
  "followUpRequired": false
}
```

**送信タイミング**:
- 調査が完了し、対応結果が確定した時

**実装優先度**: 🔴 **最優先** - Phase 2.9実装必須

---

## 🔐 セキュリティ要件の確認

### VoiceDriveから提示されたセキュリティ要件

1. **匿名性の保護**:
   - 匿名ID生成: `ANON-XXXXXX`（6桁英数字ランダム）
   - ユーザーIDから推測不可能
   - 医療システムでは匿名IDのみで管理

2. **アクセス制御**:
   - 職員: 自分の通報のみ閲覧可能（VoiceDrive側で制御）
   - 管理者（Level 99）: 全通報閲覧可能（医療システム側で制御）
   - 調査員: 割り当てられた通報のみ閲覧可能（医療システム側で制御）

3. **データ暗号化**:
   - 証拠ファイル: S3等で暗号化保存（VoiceDrive側）
   - 連絡先情報: DB暗号化保存（VoiceDrive側）

4. **監査ログ**:
   - 通報閲覧履歴: VoiceDrive側で記録
   - 調査ノート編集履歴: 医療システム側で記録（Phase 2.10で検討）

**医療システムの結論**:
- ✅ **承認します** - セキュリティ要件を遵守します
- ✅ **Webhook署名**: 既存のHMAC-SHA256実装を再利用
- ✅ **匿名ID管理**: 医療システム内部ではケース番号のみで管理

---

## 📊 データフロー図

### フロー1: 重大通報のエスカレーション

```
VoiceDrive（職員が重大通報送信）
  ↓
VoiceDrive DB（WhistleblowingReport作成、severity='critical'）
  ↓
VoiceDrive（status='escalated'に自動設定）
  ↓ POST /api/webhooks/voicedrive/whistleblowing/escalate
医療システム
  ↓ ケース番号発行（MED-2025-0004）
  ↓ 対応予定時間計算（"1時間以内"）
  ↓ レスポンス返却
VoiceDrive
  ↓ WhistleblowingReport更新
  ↓ medicalSystemCaseNumber = "MED-2025-0004"
  ↓ estimatedResponseTime = "1時間以内"
  ↓ 即座にPOST /api/webhooks/medical-system/whistleblowing/acknowledged
医療システム（受付確認）
  ↓ acknowledgementReceived = true
  ↓ acknowledgementDate = now()
  ↓ レスポンス返却
VoiceDrive
  ↓ 職員へ受付確認通知
```

**レスポンスタイム目標**: 3秒以内

---

### フロー2: 調査状況更新

```
医療システム（調査進行）
  ↓ ステータス更新（received → investigating）
  ↓ POST /api/webhooks/medical-system/whistleblowing/status-update
VoiceDrive
  ↓ WhistleblowingReport更新
  ↓ status = 'investigating'
  ↓ updatedAt = now()
  ↓ 職員へプッシュ通知（オプション）
```

---

### フロー3: 調査完了通知

```
医療システム（調査完了）
  ↓ POST /api/webhooks/medical-system/whistleblowing/resolution
VoiceDrive
  ↓ WhistleblowingReport更新
  ↓ status = 'resolved'
  ↓ resolutionSummary保存
  ↓ 職員へメール通知（オプション）
```

---

## 🎯 実装スコープの確定

### Phase 2.9: 内部通報システム連携

**実装期間**: 2025年11月18日（月）〜 11月22日（金）（5営業日）

#### 実装項目

| # | 項目 | 優先度 | 推定工数 | 担当 |
|---|------|--------|---------|------|
| 1 | POST /api/webhooks/voicedrive/whistleblowing/escalate 実装 | 🔴 最優先 | 0.5日 | 医療システム |
| 2 | ケース番号発行ロジック実装（MED-YYYY-NNNN形式） | 🔴 最優先 | 0.25日 | 医療システム |
| 3 | 対応予定時間計算ロジック実装 | 🔴 最優先 | 0.25日 | 医療システム |
| 4 | 受付確認Webhook送信実装 | 🔴 最優先 | 0.5日 | 医療システム |
| 5 | ステータス更新Webhook送信実装 | 🔴 最優先 | 0.5日 | 医療システム |
| 6 | 調査完了通知Webhook送信実装 | 🔴 最優先 | 0.5日 | 医療システム |
| 7 | 単体テスト実装 | 🔴 最優先 | 0.5日 | 医療システム |
| 8 | 統合テスト（VoiceDrive連携） | 🔴 最優先 | 1日 | 両チーム |

**合計工数**: 4日（実装3日 + テスト1日）

---

### Phase 2.10: 調査ノート機能（将来対応）

**実装期間**: 未定（Phase 2.9完了後に検討）

**検討項目**:
- 内部調査管理UI
- InvestigationNote API実装
- 調査員権限管理
- 調査履歴エクスポート

**優先度**: 🟡 **低優先** - Phase 2.9完了後に判断

---

## ⚠️ VoiceDriveチームへの質問・確認事項

### 1. Webhook署名方式の確認

**質問**: Webhook署名方式は既存実装と同じで良いですか？

**医療システムの既存実装**（Phase 2.4で実装済み）:
```typescript
import crypto from 'crypto';

function generateWebhookSignature(
  payload: any,
  timestamp: string,
  secret: string
): string {
  const message = `${timestamp}.${JSON.stringify(payload)}`;
  return crypto.createHmac('sha256', secret).update(message).digest('hex');
}
```

**確認事項**:
- ✅ この署名方式で問題ないか？
- ✅ Webhook秘密鍵は既存の `VOICEDRIVE_WEBHOOK_SECRET` を再利用可能か？

---

### 2. リトライポリシーの確認

**医療システムの既存実装**（Phase 2.5で実装済み）:
- 指数バックオフ方式: 1分 → 5分 → 30分
- 最大3回リトライ
- リトライキュー管理

**確認事項**:
- ✅ 内部通報連携でも同じリトライポリシーを適用して良いか？

---

### 3. ステータス遷移の確認

**VoiceDrive仕様**:
```
received → triaging → investigating → resolved → closed
                ↓           ↓
              escalated ----┘
```

**医療システムの確認**:
- ✅ `triaging`（分類中）は医療システム側で自動処理するため、即座に`investigating`に遷移します
  - つまり: `received` → `triaging`（数秒） → `investigating`
  - 問題ないか？

---

### 4. 緊急度の再評価

**確認事項**:
- ⚠️ 医療システム側で緊急度を再評価することは可能か？
  - 例: `medium` → `high`に引き上げ
  - 引き上げた場合、VoiceDrive側に通知が必要か？

---

### 5. InvestigationNoteの運用

**VoiceDrive仕様**:
- InvestigationNoteは機密扱い
- 職員には非公開
- 調査員のみ閲覧可能

**医療システムの確認**:
- ⚠️ Phase 2.10で実装を検討する場合、VoiceDrive側のAPIエンドポイントは？
  - 例: `POST /api/whistleblowing/investigation-notes`

---

### 6. 統合テストの日程調整

**医療システムの提案**:

| 日付 | テスト内容 | 担当 |
|------|----------|------|
| 2025-11-21 (木) | エスカレーションAPI接続確認 | 両チーム |
| 2025-11-21 (木) | 受付確認Webhook接続確認 | 両チーム |
| 2025-11-22 (金) | ステータス更新Webhook接続確認 | 両チーム |
| 2025-11-22 (金) | 調査完了通知Webhook接続確認 | 両チーム |
| 2025-11-22 (金) | E2Eテスト: 通報送信→受付→調査→完了 | 両チーム |

**確認事項**:
- ✅ この日程で問題ないか？
- ✅ テスト環境のエンドポイントURLは？

---

## 📝 医療システム側の実装計画（詳細）

### Week 1: API実装（11/18-11/20）

#### Day 1（11/18 月）: エスカレーション受信API実装

**ファイル**: `src/app/api/webhooks/voicedrive/whistleblowing/escalate/route.ts`

**実装内容**:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { sendWebhook } from '@/lib/webhookSender';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const { reportId, anonymousId, severity, category } = payload;

    // 1. ケース番号発行
    const caseNumber = await generateCaseNumber();

    // 2. 対応予定時間計算
    const estimatedResponseTime = calculateEstimatedResponseTime(severity);

    // 3. 受付確認Webhook送信
    await sendWebhook({
      endpoint: process.env.VOICEDRIVE_WEBHOOK_ENDPOINT + '/whistleblowing/acknowledged',
      event: 'whistleblowing.acknowledged',
      data: {
        reportId,
        caseNumber,
        estimatedResponseTime,
        acknowledgedAt: new Date().toISOString()
      }
    });

    return NextResponse.json({
      success: true,
      caseNumber,
      estimatedResponseTime,
      acknowledgedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Webhook] エスカレーション受信エラー:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function generateCaseNumber(): Promise<string> {
  const year = new Date().getFullYear();
  // 既存のケース番号発行ロジックを再利用または新規実装
  return `MED-${year}-0001`; // 簡易実装例
}

function calculateEstimatedResponseTime(severity: string): string {
  switch (severity) {
    case 'critical': return '1時間以内';
    case 'high': return '当日中';
    case 'medium': return '3営業日以内';
    case 'low': return '1週間以内';
    default: return '3営業日以内';
  }
}
```

**推定工数**: 0.5日（4時間）

---

#### Day 2（11/19 火）: ステータス更新・完了通知Webhook実装

**ファイル**: `src/lib/webhookSender-whistleblowing.ts`

**実装内容**:
```typescript
import { sendWebhook } from './webhookSender';

export async function sendStatusUpdateWebhook(data: {
  reportId: string;
  caseNumber: string;
  status: string;
  assignedInvestigators?: string[];
  nextSteps?: string;
}): Promise<void> {
  await sendWebhook({
    endpoint: process.env.VOICEDRIVE_WEBHOOK_ENDPOINT + '/whistleblowing/status-update',
    event: 'whistleblowing.status_updated',
    data
  });
}

export async function sendResolutionWebhook(data: {
  reportId: string;
  caseNumber: string;
  status: 'resolved';
  resolutionSummary: string;
  resolvedAt: string;
  followUpRequired?: boolean;
}): Promise<void> {
  await sendWebhook({
    endpoint: process.env.VOICEDRIVE_WEBHOOK_ENDPOINT + '/whistleblowing/resolution',
    event: 'whistleblowing.resolution',
    data
  });
}
```

**推定工数**: 1日（8時間）

---

### Week 2: テスト（11/21-11/22）

#### Day 3（11/21 木）: 単体テスト

**テストケース**:
1. ✅ エスカレーション受信API署名検証
2. ✅ ケース番号発行ロジック
3. ✅ 対応予定時間計算ロジック
4. ✅ 受付確認Webhook送信
5. ✅ ステータス更新Webhook送信
6. ✅ 調査完了通知Webhook送信
7. ✅ エラーハンドリング

**推定工数**: 0.5日（4時間）

---

#### Day 4（11/22 金）: 統合テスト

**テストシナリオ**:
1. ✅ VoiceDrive → 医療システム: エスカレーション
2. ✅ 医療システム → VoiceDrive: 受付確認
3. ✅ 医療システム → VoiceDrive: ステータス更新
4. ✅ 医療システム → VoiceDrive: 調査完了通知
5. ✅ E2Eテスト: 通報送信から完了までの一連フロー

**推定工数**: 1日（8時間）

---

## 📅 実装スケジュール（確定版）

| 日付 | 作業内容 | 医療システム担当 | VoiceDrive担当 | 状態 |
|------|---------|----------------|---------------|------|
| **2025-11-18 (月)** | エスカレーション受信API実装 | API実装 | - | ⏳ 待機中 |
| **2025-11-19 (火)** | Webhook送信実装 | Webhook送信実装 | - | ⏳ 待機中 |
| **2025-11-20 (水)** | 環境変数設定・準備 | 環境設定 | - | ⏳ 待機中 |
| **2025-11-21 (木)** | 単体テスト + API接続確認 | テスト実施 | 接続確認サポート | ⏳ 待機中 |
| **2025-11-22 (金)** | 統合テスト + E2Eテスト | テスト実施 | テスト実施 | ⏳ 待機中 |

**リリース予定日**: 2025年11月25日（月）

---

## ✅ 医療システムチームの承認事項

### 承認事項サマリー

1. ✅ **Phase 2.9として新規実装**: 内部通報システム連携
2. ✅ **実装スコープ**: 1つのAPI + 3つのWebhook
3. ✅ **実装期間**: 2025年11月18日〜22日（5営業日）
4. ✅ **推定工数**: 4日（実装3日 + テスト1日）
5. ✅ **セキュリティ**: 既存のWebhook署名方式を再利用
6. ✅ **匿名性保護**: 匿名IDのみで管理、ユーザーIDは保存しない
7. ⚠️ **Phase 2.10検討**: InvestigationNote機能は将来対応

---

## 📞 次のアクション

### 医療システムチームの対応（即座に実施）

1. ✅ **本確認結果をVoiceDriveチームへ送付** - 2025年10月26日
2. ⏳ **VoiceDriveチームからの質問回答待ち** - 11月1日までに回答希望
3. ⏳ **実装開始** - 11月18日（月）から開始

### VoiceDriveチームへの期待

1. ⏳ **本確認結果のレビュー** - 10月31日（木）までに確認
2. ⏳ **質問事項への回答** - 11月1日（金）までに回答
3. ⏳ **統合テスト日程の最終承認** - 11月15日（金）までに承認

---

## 🔗 関連ドキュメント

1. [MyReportsPage暫定マスターリスト](VD-MASTER-2025-1026-007) - VoiceDrive提供資料
2. [MyReportDetailPage暫定マスターリスト](VD-MASTER-2025-1026-004) - VoiceDrive提供資料
3. [organization-analytics_医療システム確認結果_20251010.md](./organization-analytics_医療システム確認結果_20251010.md) - 参考: 過去の確認結果
4. [Phase2.5_完全実装完了報告書_20251026.md](./Phase2.5_完全実装完了報告書_20251026.md) - 参考: Webhook実装パターン
5. [lightsail-integration-master-plan-20251005-updated.md](./lightsail-integration-master-plan-20251005-updated.md) - マスタープラン（Phase 2.9追加予定）

---

**文書終了**

最終更新: 2025年10月26日
バージョン: 1.0
承認: 医療システムチーム承認済み
次回レビュー: VoiceDriveチームからの回答受領後

---

**医療システムチーム一同、VoiceDriveチームの詳細な暫定マスターリスト作成に感謝申し上げます。**

引き続き、Phase 2.9 内部通報システム連携の成功に向けて全力で取り組みます。

---

**連絡先**:
- Slack: #phase2-integration
- Email: medical-system-dev@kousei-kai.jp
- 担当: 医療システム開発チーム
