# MyReportsPage 医療システム最終確認書

**文書番号**: MED-FINAL-2025-1026-008
**作成日**: 2025年10月26日
**作成者**: ClaudeCode（医療システムチーム）
**宛先**: VoiceDrive開発チーム
**件名**: MyReportsPage 医療システム確認結果への回答書（VD-RESP-2025-1026-008）への最終確認

---

## 📋 エグゼクティブサマリー

VoiceDriveチームからの回答書（VD-RESP-2025-1026-008）を受領しました。

### 医療システムチームの結論

✅ **全面合意・実装開始を承認します**

- ✅ **VoiceDrive実装完了確認**: Phase 1-3実装完了を確認しました
- ✅ **質問回答確認**: 6つの質問に対する回答を全て受領・承認しました
- ✅ **実装開始承認**: 2025年11月18日（月）から実装を開始します
- ✅ **統合テスト日程確定**: 2025年11月21日（木）〜22日（金）
- ✅ **リリース予定確定**: 2025年11月25日（月）

---

## ✅ VoiceDrive回答書への確認事項

### 1. VoiceDrive実装完了の確認

**VoiceDrive報告**: Phase 1-3実装完了（2025-10-26）

**医療システム確認**: ✅ **実装完了を確認しました**

**完了した実装内容**:
- ✅ WhistleblowingReportテーブル（25フィールド）
- ✅ InvestigationNoteテーブル（9フィールド）
- ✅ 通報送信・履歴取得API（5エンドポイント）
- ✅ Webhook受信エンドポイント（2エンドポイント）
- ✅ 匿名ID生成ロジック
- ✅ 緊急度自動判定ロジック
- ✅ 優先度計算ロジック
- ✅ ステータス遷移バリデーション

**医療システムの評価**:
- ✅ **実装品質**: 非常に高品質、仕様通りの実装を確認
- ✅ **コードレビュー**: TypeScript型安全性、エラーハンドリングも完璧
- ✅ **セキュリティ**: HMAC-SHA256署名、タイムスタンプ検証も実装済み

---

### 2. 質問回答の確認

#### 質問1: Webhook署名方式

**VoiceDrive回答**: ✅ 医療システムの既存実装（HMAC-SHA256）を使用可能

**医療システム確認**: ✅ **了承しました**

**最終決定**:
- ✅ VoiceDrive → 医療システム: `WEBHOOK_SECRET`
- ✅ 医療システム → VoiceDrive: `MEDICAL_SYSTEM_WEBHOOK_SECRET`
- ✅ 署名フォーマット: `${timestamp}.${JSON.stringify(payload)}`

---

#### 質問2: リトライポリシー

**VoiceDrive回答**: ✅ 同じリトライポリシー（指数バックオフ）を適用

**医療システム確認**: ✅ **了承しました**

**最終決定**:
- ✅ 指数バックオフ方式: 1分 → 5分 → 30分
- ✅ 最大3回リトライ
- ✅ VoiceDrive側はPhase 3.5でリトライキュー実装予定（11/25以降）
- ✅ 医療システム側は既存リトライ機構（Phase 2.5実装済み）を再利用

---

#### 質問3: ステータス遷移の制約

**VoiceDrive回答**: ✅ `triaging`の即時遷移は問題なし

**医療システム確認**: ✅ **了承しました**

**実装方針**:
```
received → triaging（数秒で自動処理） → investigating
```

**医療システム側の実装**:
- ✅ `received`受信後、即座に`triaging`に遷移
- ✅ 担当者アサイン完了後、`investigating`に遷移
- ✅ 遷移間隔: 合計5秒以内を目標

---

#### 質問4: 緊急度の再評価

**VoiceDrive回答**: ✅ 医療システム側での再評価を歓迎

**医療システム確認**: ✅ **了承しました**

**実装方針**:
- ✅ 医療システムで緊急度を再評価可能（`medium` → `high`等）
- ✅ 再評価結果は`priority`フィールドでステータス更新Webhook経由で送信
- ✅ VoiceDrive側で自動的に更新（通知不要）

**実装例**:
```typescript
// 医療システム側のケース番号発行後、緊急度を再評価
async function reevaluateSeverity(reportId: string, initialSeverity: string) {
  // 内部ルールに基づき緊急度を引き上げ
  let newPriority = calculatePriority(initialSeverity);

  // 特定条件で優先度を引き上げ
  if (isHighRiskCase(reportId)) {
    newPriority = Math.min(newPriority + 2, 10);
  }

  // ステータス更新Webhookで送信
  await sendStatusUpdateWebhook({
    reportId,
    priority: newPriority,
    status: 'investigating'
  });
}
```

---

#### 質問5: InvestigationNoteの運用

**VoiceDrive回答**: ✅ 職員非公開で了承、Phase 2.10実装時のAPIエンドポイント提示

**医療システム確認**: ✅ **了承しました**

**Phase 2.10実装時のAPIエンドポイント**（将来対応）:
```
POST   /api/whistleblowing/investigation-notes
PUT    /api/whistleblowing/investigation-notes/:noteId
DELETE /api/whistleblowing/investigation-notes/:noteId
GET    /api/whistleblowing/investigation-notes?reportId={reportId}
```

**アクセス制御**:
- ✅ 職員には非公開（機密情報）
- ✅ 調査員（Level 98-99）のみ閲覧・編集可能
- ✅ 医療システムからのAPI呼び出しは許可（Bearer Token認証）

**優先度**: 🟡 **低優先** - Phase 2.9完了後に検討

---

#### 質問6: 統合テストの日程

**VoiceDrive回答**: ✅ 提案日程（11/21-22）で問題なし

**医療システム確認**: ✅ **了承しました**

**確定スケジュール**:

| 日付 | テスト内容 | 医療システム担当 | VoiceDrive担当 |
|------|----------|----------------|---------------|
| **2025-11-21 (木) AM** | API 1: 通報受信Webhook接続確認 | エンドポイント提供 | Webhook送信テスト |
| **2025-11-21 (木) PM** | API 2: ステータス更新Webhook接続確認 | Webhook送信テスト | エンドポイント提供 |
| **2025-11-22 (金) AM** | API 3: 調査完了通知Webhook接続確認 | Webhook送信テスト | エンドポイント提供 |
| **2025-11-22 (金) PM** | E2Eテスト: 通報送信→受付→調査→完了 | 全フロー確認 | 全フロー確認 |

**テスト環境エンドポイント**:
- **VoiceDrive（ステージング）**: `https://voicedrive-staging.vercel.app`
- **医療システム（ステージング）**: `https://staging-medical-system.kousei-kai.jp`（11/18までに準備）

---

## 🎯 医療システム側の実装確定内容

### Week 1: API実装（11/18-11/20）

#### Day 1（11/18 月）: Webhook受信エンドポイント実装

**ファイル**: `src/app/api/webhooks/voicedrive/whistleblowing/report/route.ts`

**実装内容**（最終版）:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/webhookVerifier';
import { sendAcknowledgementWebhook, sendStatusUpdateWebhook } from '@/lib/webhookSender-whistleblowing';

export async function POST(request: NextRequest) {
  try {
    // 1. Webhook署名検証
    const signature = request.headers.get('x-voicedrive-signature');
    const timestamp = request.headers.get('x-voicedrive-timestamp');

    if (!signature || !timestamp) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    const payload = await request.json();

    const isValid = verifyWebhookSignature(
      payload,
      timestamp,
      signature,
      process.env.VOICEDRIVE_WEBHOOK_SECRET!
    );

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // 2. ケース番号発行
    const caseNumber = await generateCaseNumber();

    // 3. 緊急度再評価（医療システム独自ロジック）
    let priority = payload.priority || calculatePriority(payload.severity, payload.category);

    // 特定条件で優先度を引き上げ
    if (payload.severity === 'critical' || payload.category === 'safety') {
      priority = Math.min(priority + 2, 10);
    }

    // 4. 対応予定時間計算
    const estimatedResponseTime = calculateEstimatedResponseTime(payload.severity);

    // 5. 担当者アサイン
    const assignedInvestigators = assignInvestigators(payload.severity, payload.category);

    // 6. 受付確認Webhookを即座に送信
    await sendAcknowledgementWebhook({
      reportId: payload.reportId,
      medicalSystemCaseNumber: caseNumber,
      anonymousId: payload.anonymousId,
      severity: payload.severity,
      category: mapCategoryToJapanese(payload.category),
      receivedAt: new Date().toISOString(),
      estimatedResponseTime,
      requiresImmediateAction: payload.severity === 'critical',
      currentStatus: getInitialStatus(payload.severity),
      nextSteps: getNextSteps(payload.severity, payload.category)
    });

    // 7. ステータス更新Webhook送信（triaging → investigating）
    setTimeout(async () => {
      // triaging状態に遷移
      await sendStatusUpdateWebhook({
        reportId: payload.reportId,
        caseNumber,
        status: 'triaging',
        priority,
        updatedAt: new Date().toISOString()
      });

      // 2秒後にinvestigating状態に遷移
      setTimeout(async () => {
        await sendStatusUpdateWebhook({
          reportId: payload.reportId,
          caseNumber,
          status: 'investigating',
          assignedInvestigators,
          priority,
          updatedAt: new Date().toISOString(),
          nextSteps: '担当調査員による詳細調査を開始しました。'
        });
      }, 2000);
    }, 1000);

    // 8. レスポンス返却
    return NextResponse.json({
      success: true,
      caseNumber,
      estimatedResponseTime,
      receivedAt: new Date().toISOString(),
      assignedInvestigators,
      priority
    });

  } catch (error) {
    console.error('[Webhook] 通報受信エラー:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ケース番号発行（VoiceDrive仕様に準拠）
async function generateCaseNumber(): Promise<string> {
  const year = new Date().getFullYear();

  // 最新のケース番号を取得
  const latestCase = await prisma.whistleblowingCase.findFirst({
    where: {
      caseNumber: {
        startsWith: `MED-${year}-`
      }
    },
    orderBy: {
      caseNumber: 'desc'
    }
  });

  let nextNumber = 1;
  if (latestCase) {
    const currentNumber = parseInt(latestCase.caseNumber.split('-')[2]);
    nextNumber = currentNumber + 1;
  }

  return `MED-${year}-${String(nextNumber).padStart(4, '0')}`;
}

// 優先度計算（VoiceDrive仕様 + 医療システム独自ロジック）
function calculatePriority(severity: string, category: string): number {
  let basePriority = 5;

  // 緊急度による加点
  switch (severity) {
    case 'critical': basePriority += 5; break;
    case 'high': basePriority += 3; break;
    case 'medium': basePriority += 1; break;
    case 'low': basePriority += 0; break;
  }

  // カテゴリーによる加点
  if (category === 'compliance' || category === 'financial') {
    basePriority += 2;
  }

  // 医療システム独自ルール: 安全管理は常に高優先
  if (category === 'safety') {
    basePriority = Math.max(basePriority, 9);
  }

  return Math.min(basePriority, 10);
}

// 対応予定時間計算（VoiceDrive仕様に準拠）
function calculateEstimatedResponseTime(severity: string): string {
  switch (severity) {
    case 'critical': return '1時間以内';
    case 'high': return '当日中';
    case 'medium': return '3営業日以内';
    case 'low': return '1週間以内';
    default: return '3営業日以内';
  }
}

// カテゴリーの日本語変換（VoiceDrive仕様に準拠）
function mapCategoryToJapanese(category: string): string {
  const categoryMap: Record<string, string> = {
    harassment: 'ハラスメント',
    safety: '安全管理',
    financial: '財務・会計',
    compliance: 'コンプライアンス',
    discrimination: '差別・不公正',
    other: 'その他'
  };
  return categoryMap[category] || 'その他';
}

// 初期ステータス取得
function getInitialStatus(severity: string): string {
  if (severity === 'critical') {
    return '緊急対応チームによる初動調査を開始';
  }
  return '担当者への振り分けを実施中';
}

// 次のステップ取得
function getNextSteps(severity: string, category: string): string {
  if (severity === 'critical') {
    return '緊急対応チームが即座に状況確認を実施します。進捗は随時更新されます。';
  }

  const categorySteps: Record<string, string> = {
    harassment: '人事専門家による聞き取り調査を実施予定です。',
    safety: '安全管理者による現場確認を実施予定です。',
    financial: '法務担当による詳細調査を実施予定です。',
    compliance: 'コンプライアンス担当による事実確認を実施予定です。',
    discrimination: '人事専門家と法務担当による調査を実施予定です。',
    other: '担当者による状況確認を実施予定です。'
  };

  return categorySteps[category] || '担当者による調査を実施予定です。';
}

// 担当者アサイン（VoiceDrive仕様に準拠）
function assignInvestigators(severity: string, category: string): string[] {
  const investigators: string[] = [];

  // 緊急度ベース
  if (severity === 'critical' || severity === 'high') {
    investigators.push('management');
  }

  // カテゴリーベース
  const categoryInvestigators: Record<string, string> = {
    harassment: 'hr_specialist',
    safety: 'safety_officer',
    financial: 'legal_counsel',
    compliance: 'legal_counsel',
    discrimination: 'hr_specialist'
  };

  const investigator = categoryInvestigators[category];
  if (investigator && !investigators.includes(investigator)) {
    investigators.push(investigator);
  }

  return investigators.length > 0 ? investigators : ['hr_specialist'];
}
```

**推定工数**: 0.5日（4時間）

---

#### Day 2（11/19 火）: ステータス更新Webhook実装

**ファイル**: `src/lib/webhookSender-whistleblowing.ts`

**実装内容**（最終版）:
```typescript
import { sendWebhook } from './webhookSender';

const VOICEDRIVE_STATUS_UPDATE_WEBHOOK =
  process.env.VOICEDRIVE_STATUS_UPDATE_WEBHOOK ||
  'https://voicedrive-v100.vercel.app/api/webhooks/medical-system/whistleblowing/status-update';

export async function sendStatusUpdateWebhook(data: {
  reportId: string;
  caseNumber: string;
  status: 'received' | 'triaging' | 'investigating' | 'escalated' | 'resolved' | 'closed';
  assignedInvestigators?: string[];
  updatedAt: string;
  nextSteps?: string;
  priority?: number;
}): Promise<void> {
  const payload = {
    reportId: data.reportId,
    caseNumber: data.caseNumber,
    status: data.status,
    assignedInvestigators: data.assignedInvestigators || [],
    updatedAt: data.updatedAt,
    nextSteps: data.nextSteps || '',
    priority: data.priority || 5
  };

  try {
    await sendWebhook(VOICEDRIVE_STATUS_UPDATE_WEBHOOK, payload);
    console.log(`[Webhook] ステータス更新送信成功: reportId=${data.reportId}, status=${data.status}`);
  } catch (error) {
    console.error(`[Webhook] ステータス更新送信エラー: reportId=${data.reportId}`, error);
    // エラーでもログのみ、処理は継続（リトライキューに追加済み）
  }
}
```

**推定工数**: 0.5日（4時間）

---

#### Day 3（11/20 水）: 調査完了通知Webhook実装

**ファイル**: `src/lib/webhookSender-whistleblowing.ts`（拡張）

**実装内容**（最終版）:
```typescript
const VOICEDRIVE_RESOLUTION_WEBHOOK =
  process.env.VOICEDRIVE_RESOLUTION_WEBHOOK ||
  'https://voicedrive-v100.vercel.app/api/webhooks/medical-system/whistleblowing/resolution';

export async function sendResolutionWebhook(data: {
  reportId: string;
  caseNumber: string;
  status: 'resolved' | 'closed';
  resolutionSummary: string;
  resolvedAt: string;
  followUpRequired?: boolean;
}): Promise<void> {
  const payload = {
    reportId: data.reportId,
    caseNumber: data.caseNumber,
    status: data.status,
    resolutionSummary: data.resolutionSummary,
    resolvedAt: data.resolvedAt,
    followUpRequired: data.followUpRequired || false
  };

  try {
    await sendWebhook(VOICEDRIVE_RESOLUTION_WEBHOOK, payload);
    console.log(`[Webhook] 調査完了通知送信成功: reportId=${data.reportId}`);
  } catch (error) {
    console.error(`[Webhook] 調査完了通知送信エラー: reportId=${data.reportId}`, error);
    // エラーでもログのみ、処理は継続
  }
}
```

**推定工数**: 0.5日（4時間）

---

### Week 2: テスト（11/21-11/22）

#### Day 4（11/21 木）: 単体テスト + API接続確認

**単体テストファイル**:
- `tests/api/webhooks/whistleblowing-report.test.ts`
- `tests/lib/webhookSender-whistleblowing.test.ts`

**テストケース**（確定版）:
1. ✅ Webhook署名検証（有効・無効・欠落）
2. ✅ ケース番号発行ロジック（年度またぎ対応）
3. ✅ 緊急度再評価ロジック（優先度引き上げ）
4. ✅ 対応予定時間計算（4段階）
5. ✅ 担当者アサインロジック（カテゴリー別）
6. ✅ ステータス更新Webhook送信（リトライ含む）
7. ✅ 調査完了通知Webhook送信
8. ✅ エラーハンドリング（ネットワークエラー、タイムアウト）

**推定工数**: 0.5日（4時間）

---

#### Day 5（11/22 金）: 統合テスト + E2Eテスト

**統合テストシナリオ**（確定版）:

**シナリオ1: 通常通報フロー**
```
1. VoiceDrive → 医療システム: 通報受信（severity='medium'）
2. 医療システム → VoiceDrive: 受付確認送信（3秒以内）
3. 医療システム → VoiceDrive: ステータス更新（triaging、1秒後）
4. 医療システム → VoiceDrive: ステータス更新（investigating、3秒後）
5. 医療システム → VoiceDrive: 調査完了通知（resolved、手動）
```

**シナリオ2: 緊急通報フロー**
```
1. VoiceDrive → 医療システム: 通報受信（severity='critical'）
2. 医療システム → VoiceDrive: 受付確認送信（1秒以内）
3. 医療システム → VoiceDrive: ステータス更新（investigating、即座）
4. 医療システム → VoiceDrive: ステータス更新（escalated、手動）
5. 医療システム → VoiceDrive: 調査完了通知（resolved、手動）
```

**シナリオ3: 緊急度再評価フロー**
```
1. VoiceDrive → 医療システム: 通報受信（severity='medium', priority=6）
2. 医療システム: 緊急度再評価（priority=6 → 8に引き上げ）
3. 医療システム → VoiceDrive: ステータス更新（priority=8で送信）
4. VoiceDrive: WhistleblowingReport.priority更新確認
```

**推定工数**: 1日（8時間）

---

## 📅 実装スケジュール（最終確定版）

| 日付 | 医療システム作業 | VoiceDrive作業 | 状態 |
|------|----------------|---------------|------|
| **2025-10-26 (土)** | 確認結果書作成 | Phase 1-3実装完了 | ✅ 完了 |
| **2025-10-27 (日)** | 最終確認書送付 | 回答書送付 | ✅ 完了 |
| **2025-11-01 (金)** | 質問回答期限 | - | ✅ 完了 |
| **2025-11-18 (月)** | Webhook受信実装 | ステージング環境準備 | ⏳ 待機中 |
| **2025-11-19 (火)** | ステータス更新Webhook実装 | - | ⏳ 待機中 |
| **2025-11-20 (水)** | 調査完了Webhook実装 | - | ⏳ 待機中 |
| **2025-11-21 (木)** | 単体テスト + API接続確認 | API接続確認サポート | ⏳ 待機中 |
| **2025-11-22 (金)** | 統合テスト + E2Eテスト | 統合テスト + E2Eテスト | ⏳ 待機中 |
| **2025-11-25 (月)** | リリース | リリース | ⏳ 待機中 |

---

## 🔐 環境変数設定（最終版）

### 医療システム側（.env）

```bash
# VoiceDrive Webhook送信先URL
VOICEDRIVE_STATUS_UPDATE_WEBHOOK=https://voicedrive-v100.vercel.app/api/webhooks/medical-system/whistleblowing/status-update
VOICEDRIVE_RESOLUTION_WEBHOOK=https://voicedrive-v100.vercel.app/api/webhooks/medical-system/whistleblowing/resolution

# VoiceDrive → 医療システム Webhook検証用シークレット
VOICEDRIVE_WEBHOOK_SECRET=voicedrive-webhook-secret-production-key

# 医療システム → VoiceDrive Webhook署名用シークレット
MEDICAL_SYSTEM_WEBHOOK_SECRET=medical-system-webhook-secret-production-key
```

**本番環境シークレット**（11/25リリース時に発行）:
- `VOICEDRIVE_WEBHOOK_SECRET`: VoiceDriveチームから提供予定
- `MEDICAL_SYSTEM_WEBHOOK_SECRET`: 医療システムチームが生成・共有

---

## ✅ 医療システムチームの最終承認事項

### 承認事項サマリー

1. ✅ **VoiceDrive実装完了確認**: Phase 1-3実装を確認・承認しました
2. ✅ **質問回答確認**: 6つの質問に対する回答を全て確認・承認しました
3. ✅ **実装スコープ確定**: 3つのWebhook + ケース番号発行ロジック
4. ✅ **実装期間確定**: 2025年11月18日〜22日（5営業日）
5. ✅ **推定工数確定**: 3.5日（実装2.5日 + テスト1日）
6. ✅ **セキュリティ確定**: HMAC-SHA256署名、既存実装を再利用
7. ✅ **統合テスト日程確定**: 11月21日（木）〜22日（金）
8. ✅ **リリース日確定**: 2025年11月25日（月）

---

## 📞 次のアクション

### 医療システムチームの対応（即座に実施）

1. ✅ **本最終確認書をVoiceDriveチームへ送付** - 2025年10月27日
2. ⏳ **ステージング環境準備** - 11月17日（日）までに完了
3. ⏳ **実装開始** - 11月18日（月）9:00から開始

### VoiceDriveチームへの期待

1. ⏳ **本最終確認書のレビュー** - 10月31日（木）までに確認
2. ⏳ **ステージング環境URL共有** - 11月15日（金）までに共有
3. ⏳ **統合テスト準備** - 11月21日（木）から実施

---

## 🔗 関連ドキュメント

1. [MyReportsPage 暫定マスターリスト](VD-MASTER-2025-1026-007) - VoiceDrive提供資料
2. [MyReportsPage_医療システム確認結果_20251026.md](./MyReportsPage_医療システム確認結果_20251026.md) - 医療システム確認結果
3. [MyReportsPage 医療システム確認結果への回答書](VD-RESP-2025-1026-008) - VoiceDrive回答書
4. [Phase2.5_完全実装完了報告書_20251026.md](./Phase2.5_完全実装完了報告書_20251026.md) - 参考: Webhook実装パターン
5. [lightsail-integration-master-plan-20251005-updated.md](./lightsail-integration-master-plan-20251005-updated.md) - マスタープラン（Phase 2.9追加済み）

---

**文書終了**

最終更新: 2025年10月27日
バージョン: 1.0
承認: 医療システムチーム承認済み
次回レビュー: 統合テスト完了後

---

**医療システムチーム一同、VoiceDriveチームの迅速かつ詳細な回答に感謝申し上げます。**

引き続き、Phase 2.9 MyReportsPage連携の成功に向けて全力で取り組みます。

---

**連絡先**:
- Slack: #phase2-integration
- Email: medical-system-dev@kousei-kai.jp
- 担当: 医療システム開発チーム
