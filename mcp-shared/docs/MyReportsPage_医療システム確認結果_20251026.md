# MyReportsPage 医療システム確認結果

**文書番号**: MED-CONFIRM-2025-1026-007
**作成日**: 2025年10月26日
**作成者**: ClaudeCode（医療システムチーム）
**宛先**: VoiceDrive開発チーム
**参照文書**: MyReportsPage 暫定マスターリスト（VD-MASTER-2025-1026-007）

---

## 📋 エグゼクティブサマリー

VoiceDriveチームから提供された「MyReportsPage 暫定マスターリスト」を詳細に分析しました。

### 医療システムチームの結論

✅ **実装対応が必要です**

MyReportsPageは職員のコンプライアンス通報履歴を管理するページであり、医療システム側で以下の対応が必要であることを確認しました：

1. ✅ **Webhook受信エンドポイント実装** - VoiceDriveからの通報受信
2. ✅ **Webhook送信エンドポイント実装** - ステータス更新・調査完了通知
3. ✅ **ケース番号発行ロジック実装** - MED-YYYY-NNNN形式
4. ✅ **受付確認通知Webhook実装** - 既存実装の確認と拡張
5. ⚠️ **内部調査管理機能** - Phase 2で検討（VoiceDrive側に調査ノート機能あり）

---

## 🔍 詳細分析結果

### 1. データ管理責任の分析

VoiceDrive提供の資料によると、データ管理責任は以下のように分担されています：

| カテゴリ | VoiceDrive責任 | 医療システム責任 |
|---------|---------------|----------------|
| 通報データ管理 | 100% | 0% |
| 受付確認通知 | 50%（受信・表示） | 50%（送信） |
| 調査状況更新 | 0% | 100% |
| 統計集計 | 100% | 0% |

**医療システムの結論**:
- ✅ **承認します** - 通報データはVoiceDrive側で一元管理
- ✅ **医療システムは調査・対応管理に特化** - 適切な責任分担です

---

### 2. WhistleblowingReport テーブルの分析

VoiceDrive側で管理される25フィールドのうち、医療システムが**データ書き込み責任**を持つフィールドは以下の通りです：

| フィールド名 | 医療システム責任 | 実装必要性 |
|------------|----------------|----------|
| status | 50% | ✅ Webhook経由で更新 |
| assignedInvestigators | 100% | ✅ Webhook経由で更新 |
| escalationReason | 100% | ✅ Webhook経由で更新 |
| resolutionSummary | 100% | ✅ Webhook経由で更新 |
| followUpRequired | 100% | ✅ Webhook経由で更新 |
| priority | 100% | ✅ Webhook経由で更新 |
| medicalSystemCaseNumber | 100% | ✅ ケース番号発行必須 |
| acknowledgementReceived | 50% | ✅ 受付確認時に更新 |
| acknowledgementDate | 100% | ✅ 受付確認時に更新 |
| estimatedResponseTime | 100% | ✅ 受付確認時に設定 |

**医療システムの結論**:
- ✅ **Webhook経由でのデータ連携が必須**
- ✅ **10フィールドの更新責任** - 実装スコープを確認しました

---

### 3. InvestigationNote テーブルの分析

VoiceDrive側で管理される調査ノートテーブル（9フィールド）は、**医療システムが100%データ責任**を持ちます。

**医療システムの結論**:
- ⚠️ **Phase 2で検討** - 調査ノート機能は現在の医療システムには存在しない
- 🔄 **代替案**: 医療システム内部で調査記録を管理し、サマリーのみVoiceDriveに送信
- 📋 **将来対応**: InvestigationNote APIを実装する場合、Phase 2.10として計画

---

### 4. ComplianceAcknowledgement テーブルの分析

**既存テーブルの確認結果**:
- ✅ **既に実装済み** - `prisma/schema.prisma`に存在
- ✅ **フィールド構成**: VoiceDrive仕様と100%一致
- ✅ **Webhook受信エンドポイント**: `POST /api/webhooks/voicedrive/compliance/acknowledgement` 実装済み

**医療システムの結論**:
- ✅ **追加実装不要** - 現状のまま使用可能

---

## 🔌 API実装要件の確認

### 医療システム側で実装が必要なAPI

#### 1. 通報受信Webhook（新規実装必須）

**エンドポイント**: `POST /api/webhooks/voicedrive/whistleblowing/report`

**VoiceDriveから送信されるペイロード**:
```json
{
  "reportId": "RPT-2025-004",
  "anonymousId": "ANON-9E4C3D",
  "category": "harassment",
  "severity": "high",
  "title": "パワーハラスメントの相談",
  "submittedAt": "2025-10-26T15:00:00Z",
  "isAnonymous": true,
  "priority": 8
}
```

**医療システム側の処理**:
1. ✅ ケース番号発行（`MED-2025-NNNN`形式）
2. ✅ 内部管理テーブルに保存（任意）
3. ✅ 緊急度に応じた担当者アサイン
4. ✅ 対応予定時間を計算（緊急度ベース）
5. ✅ 受付確認Webhookを即座に返送

**期待レスポンス**:
```json
{
  "success": true,
  "caseNumber": "MED-2025-0004",
  "estimatedResponseTime": "当日中",
  "receivedAt": "2025-10-26T15:01:00Z"
}
```

**実装優先度**: 🔴 **最優先** - Phase 2.9実装必須

---

#### 2. ステータス更新Webhook（新規実装必須）

**エンドポイント**: 医療システム → VoiceDrive

**送信先URL**: `https://voicedrive-v100.vercel.app/api/webhooks/medical-system/whistleblowing/status-update`

**ペイロード**:
```json
{
  "reportId": "RPT-2025-001",
  "caseNumber": "MED-2025-0001",
  "status": "investigating",
  "assignedInvestigators": ["hr_specialist", "management"],
  "updatedAt": "2025-10-26T16:00:00Z",
  "nextSteps": "担当者による聞き取り調査を実施します",
  "priority": 8
}
```

**送信タイミング**:
- 調査員がアサインされた時
- ステータスが変更された時（received → triaging → investigating → escalated → resolved → closed）
- エスカレーションされた時

**実装優先度**: 🔴 **最優先** - Phase 2.9実装必須

---

#### 3. 調査完了通知Webhook（新規実装必須）

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

#### 4. 受付確認Webhook（既存確認 + 拡張）

**エンドポイント**: 医療システム → VoiceDrive

**送信先URL**: `https://voicedrive-v100.vercel.app/api/webhooks/compliance/acknowledgement`

**現在のペイロード（既存）**:
```json
{
  "reportId": "RPT-2025-003",
  "medicalSystemCaseNumber": "MED-2025-0003",
  "anonymousId": "ANON-2A7F4C",
  "severity": "critical",
  "category": "コンプライアンス",
  "receivedAt": "2025-10-03T08:30:00Z",
  "estimatedResponseTime": "1時間以内",
  "requiresImmediateAction": true,
  "currentStatus": "緊急対応チームによる初動調査を開始",
  "nextSteps": "担当者による聞き取り調査を実施予定です。"
}
```

**医療システムの確認結果**:
- ✅ **既に実装済み** - Phase 2.4で実装完了
- ✅ **フィールド構成**: VoiceDrive仕様と100%一致
- ✅ **追加実装不要**

**実装優先度**: ✅ **完了済み**

---

## 🔐 セキュリティ要件の確認

### VoiceDriveから提示されたセキュリティ要件

1. **匿名性の保護**:
   - 匿名ID生成方式: `ANON-XXXXXX`（6桁英数字）
   - ユーザーIDから推測不可能
   - 医療システムでは匿名IDのみで管理

2. **アクセス制御**:
   - 職員は自分の通報のみ閲覧可能（VoiceDrive側で制御）
   - 管理者（Level 99）は全通報を閲覧可能（医療システム側で制御）
   - 調査員は割り当てられた通報のみ閲覧可能（医療システム側で制御）

3. **データ暗号化**:
   - 証拠ファイルはS3等に暗号化保存（VoiceDrive側）
   - 連絡先情報は暗号化してDB保存（VoiceDrive側）

4. **監査ログ**:
   - 通報の閲覧履歴を記録（VoiceDrive側）
   - 調査ノートの編集履歴を記録（医療システム側、Phase 2で検討）

**医療システムの結論**:
- ✅ **承認します** - セキュリティ要件を遵守します
- ✅ **Webhook署名**: HMAC-SHA256署名を実装済み（既存実装を再利用）
- ✅ **匿名ID管理**: 医療システム内部ではケース番号のみで管理

---

## 🎯 実装スコープの確定

### Phase 2.9: コンプライアンス通報連携（新規フェーズ）

**実装期間**: 2025年11月18日（月）〜 11月22日（金）（5営業日）

#### 実装項目

| # | 項目 | 優先度 | 推定工数 | 担当 |
|---|------|--------|---------|------|
| 1 | POST /api/webhooks/voicedrive/whistleblowing/report 実装 | 🔴 最優先 | 0.5日 | 医療システム |
| 2 | ケース番号発行ロジック実装（MED-YYYY-NNNN形式） | 🔴 最優先 | 0.25日 | 医療システム |
| 3 | ステータス更新Webhook送信実装 | 🔴 最優先 | 0.5日 | 医療システム |
| 4 | 調査完了通知Webhook送信実装 | 🔴 最優先 | 0.5日 | 医療システム |
| 5 | 緊急度ベースの対応予定時間計算ロジック | 🔴 最優先 | 0.25日 | 医療システム |
| 6 | 単体テスト実装 | 🔴 最優先 | 0.5日 | 医療システム |
| 7 | 統合テスト（VoiceDrive連携） | 🔴 最優先 | 1日 | 両チーム |

**合計工数**: 3.5日（実装2.5日 + テスト1日）

---

### Phase 2.10: 調査ノート機能（将来対応）

**実装期間**: 未定（Phase 2.9完了後に検討）

#### 検討項目

| # | 項目 | 検討内容 |
|---|------|---------|
| 1 | 内部調査管理UI | 調査員専用の管理画面 |
| 2 | InvestigationNote API実装 | VoiceDrive側APIとの連携 |
| 3 | 調査員権限管理 | Level 98-99での制御 |
| 4 | 調査履歴のエクスポート | PDF出力機能 |

**優先度**: 🟡 **低優先** - Phase 2.9完了後に判断

---

## 📊 データフローの確認

### 1. 通報受信フロー

```
VoiceDrive（職員が通報送信）
  ↓
VoiceDrive DB（WhistleblowingReport作成）
  ↓ POST /api/webhooks/voicedrive/whistleblowing/report
医療システム
  ↓ ケース番号発行（MED-2025-0004）
  ↓ 対応予定時間計算
  ↓ レスポンス返却 { caseNumber, estimatedResponseTime }
VoiceDrive
  ↓ WhistleblowingReport更新
  ↓ 即座にPOST /api/webhooks/compliance/acknowledgement
医療システム
  ↓ ComplianceAcknowledgement作成
  ↓ レスポンス返却
VoiceDrive
  ↓ 職員へ受付確認通知
```

**医療システムの確認結果**:
- ✅ **承認します** - このフローで実装します
- ✅ **レスポンスタイム目標**: 3秒以内

---

### 2. 調査状況更新フロー

```
医療システム（調査進行）
  ↓ ステータス更新（received → triaging → investigating）
  ↓ POST /api/webhooks/medical-system/whistleblowing/status-update
VoiceDrive
  ↓ WhistleblowingReport更新
  ↓ 職員へプッシュ通知（オプション）
```

**医療システムの確認結果**:
- ✅ **承認します** - このフローで実装します
- ✅ **送信タイミング**: ステータス変更時にリアルタイム送信

---

### 3. 調査完了通知フロー

```
医療システム（調査完了）
  ↓ POST /api/webhooks/medical-system/whistleblowing/resolution
VoiceDrive
  ↓ WhistleblowingReport更新（status='resolved'）
  ↓ resolutionSummary保存
  ↓ 職員へメール通知（オプション）
```

**医療システムの確認結果**:
- ✅ **承認します** - このフローで実装します
- ✅ **resolutionSummary**: 0-1000文字で対応結果を記載

---

## ⚠️ VoiceDriveチームへの質問・確認事項

### 1. Webhook仕様の詳細確認

**質問**: Webhook署名方式の詳細を教えてください。

**医療システムの既存実装**:
```typescript
// 既存のWebhook署名方式（Phase 2.4で実装済み）
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
- ✅ この署名方式でMyReportsPage連携も問題ないか？
- ✅ Webhook秘密鍵は既存の `VOICEDRIVE_WEBHOOK_SECRET` を再利用可能か？

---

### 2. リトライポリシーの確認

**質問**: Webhook送信失敗時のリトライポリシーを教えてください。

**医療システムの既存実装**（Phase 2.5で実装済み）:
- 指数バックオフ方式: 1分 → 5分 → 30分
- 最大3回リトライ
- リトライキュー管理

**確認事項**:
- ✅ MyReportsPage連携でも同じリトライポリシーを適用して良いか？
- ✅ VoiceDrive側でもリトライ機構を実装する予定か？

---

### 3. ステータス遷移の制約

**質問**: ステータス遷移に制約はありますか？

**VoiceDriveの仕様**:
```
received → triaging → investigating → resolved → closed
                ↓           ↓
              escalated ----┘
```

**医療システムの確認**:
- ✅ この遷移ルールを遵守します
- ⚠️ `triaging`（分類中）は医療システム側で自動処理するため、即座に`investigating`に遷移します
  - つまり: `received` → `triaging`（数秒） → `investigating`
  - 問題ないか？

---

### 4. 緊急度の自動判定

**質問**: VoiceDrive側で緊急度（severity）を自動判定しますか？

**VoiceDriveの仕様**:
```typescript
function detectSeverity(content: string, category: string): ReportSeverity {
  // キーワードベースの自動判定
  // critical/high/medium/lowを判定
}
```

**医療システムの確認**:
- ✅ VoiceDrive側で判定した緊急度を信頼します
- ⚠️ 医療システム側で緊急度を再評価することは可能か？
  - 例: `medium` → `high`に引き上げ
  - 引き上げた場合、VoiceDrive側に通知が必要か？

---

### 5. 調査ノート（InvestigationNote）の運用

**質問**: InvestigationNoteは職員に公開しますか？

**VoiceDriveの仕様**:
- InvestigationNoteは機密扱い
- 職員には非公開
- 調査員のみ閲覧可能

**医療システムの確認**:
- ✅ 職員非公開で了承
- ⚠️ Phase 2.10で実装を検討する場合、VoiceDrive側のAPIエンドポイントは？
  - 例: `POST /api/whistleblowing/investigation-notes`

---

### 6. 統合テストの日程調整

**質問**: Phase 2.9の統合テスト日程を調整させてください。

**医療システムの提案**:

| 日付 | テスト内容 | 担当 |
|------|----------|------|
| 2025-11-21 (木) | API 1: 通報受信Webhook接続確認 | 両チーム |
| 2025-11-21 (木) | API 2: ステータス更新Webhook接続確認 | 両チーム |
| 2025-11-22 (金) | API 3: 調査完了通知Webhook接続確認 | 両チーム |
| 2025-11-22 (金) | E2Eテスト: 通報送信→受付→調査→完了の一連フロー | 両チーム |

**確認事項**:
- ✅ この日程で問題ないか？
- ✅ テスト環境のエンドポイントURLは？

---

## 📝 医療システム側の実装計画（詳細）

### Week 1: API実装（11/18-11/20）

#### Day 1（11/18 月）: Webhook受信エンドポイント実装

**ファイル**: `src/app/api/webhooks/voicedrive/whistleblowing/report/route.ts`

**実装内容**:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/webhookVerifier';
import { prisma } from '@/lib/prisma';

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

    // 3. 対応予定時間計算
    const estimatedResponseTime = calculateEstimatedResponseTime(payload.severity);

    // 4. 内部管理テーブルに保存（オプション）
    // await saveWhistleblowingReport(payload, caseNumber);

    // 5. 担当者アサイン（緊急度ベース）
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

    // 7. レスポンス返却
    return NextResponse.json({
      success: true,
      caseNumber,
      estimatedResponseTime,
      receivedAt: new Date().toISOString(),
      assignedInvestigators
    });

  } catch (error) {
    console.error('[Webhook] 通報受信エラー:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ケース番号発行
async function generateCaseNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.whistleblowingCase.count({
    where: {
      caseNumber: {
        startsWith: `MED-${year}-`
      }
    }
  });

  return `MED-${year}-${String(count + 1).padStart(4, '0')}`;
}

// 対応予定時間計算
function calculateEstimatedResponseTime(severity: string): string {
  switch (severity) {
    case 'critical': return '1時間以内';
    case 'high': return '当日中';
    case 'medium': return '3営業日以内';
    case 'low': return '1週間以内';
    default: return '3営業日以内';
  }
}

// カテゴリーの日本語変換
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
    return '緊急対応チームが即座に状況確認を実施します。';
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

// 担当者アサイン
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

**実装内容**:
```typescript
import { sendWebhook, generateWebhookSignature } from './webhookSender';

const VOICEDRIVE_STATUS_UPDATE_WEBHOOK =
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

  await sendWebhook(VOICEDRIVE_STATUS_UPDATE_WEBHOOK, payload);

  console.log(`[Webhook] ステータス更新送信成功: reportId=${data.reportId}, status=${data.status}`);
}
```

**推定工数**: 0.5日（4時間）

---

#### Day 3（11/20 水）: 調査完了通知Webhook実装

**ファイル**: `src/lib/webhookSender-whistleblowing.ts`（拡張）

**実装内容**:
```typescript
const VOICEDRIVE_RESOLUTION_WEBHOOK =
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

  await sendWebhook(VOICEDRIVE_RESOLUTION_WEBHOOK, payload);

  console.log(`[Webhook] 調査完了通知送信成功: reportId=${data.reportId}`);
}
```

**推定工数**: 0.5日（4時間）

---

### Week 2: テスト（11/21-11/22）

#### Day 4（11/21 木）: 単体テスト

**テストファイル**:
- `tests/api/webhooks/whistleblowing-report.test.ts`
- `tests/lib/webhookSender-whistleblowing.test.ts`

**テストケース**:
1. ✅ 通報受信Webhookの署名検証
2. ✅ ケース番号発行ロジック
3. ✅ 対応予定時間計算ロジック
4. ✅ ステータス更新Webhook送信
5. ✅ 調査完了通知Webhook送信
6. ✅ エラーハンドリング

**推定工数**: 0.5日（4時間）

---

#### Day 5（11/22 金）: 統合テスト

**テストシナリオ**:
1. ✅ VoiceDrive → 医療システム: 通報受信
2. ✅ 医療システム → VoiceDrive: 受付確認送信
3. ✅ 医療システム → VoiceDrive: ステータス更新送信
4. ✅ 医療システム → VoiceDrive: 調査完了通知送信
5. ✅ E2Eテスト: 通報送信から完了までの一連フロー

**推定工数**: 1日（8時間）

---

## 📅 実装スケジュール（確定版）

| 日付 | 作業内容 | 医療システム担当 | VoiceDrive担当 | 状態 |
|------|---------|----------------|---------------|------|
| **2025-11-18 (月)** | Webhook受信エンドポイント実装 | API実装 | - | ⏳ 待機中 |
| **2025-11-19 (火)** | ステータス更新Webhook実装 | Webhook送信実装 | - | ⏳ 待機中 |
| **2025-11-20 (水)** | 調査完了通知Webhook実装 | Webhook送信実装 | - | ⏳ 待機中 |
| **2025-11-21 (木)** | 単体テスト + API接続確認 | テスト実施 | 接続確認サポート | ⏳ 待機中 |
| **2025-11-22 (金)** | 統合テスト + E2Eテスト | テスト実施 | テスト実施 | ⏳ 待機中 |

**リリース予定日**: 2025年11月25日（月）

---

## ✅ 医療システムチームの承認事項

### 承認事項サマリー

1. ✅ **Phase 2.9として新規実装**: コンプライアンス通報連携
2. ✅ **実装スコープ**: 3つのWebhook + ケース番号発行ロジック
3. ✅ **実装期間**: 2025年11月18日〜22日（5営業日）
4. ✅ **推定工数**: 3.5日（実装2.5日 + テスト1日）
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

1. [MyReportsPage 暫定マスターリスト](VD-MASTER-2025-1026-007) - VoiceDrive提供資料
2. [organization-analytics_医療システム確認結果_20251010.md](./organization-analytics_医療システム確認結果_20251010.md) - 参考: 過去の確認結果
3. [Phase2.5_完全実装完了報告書_20251026.md](./Phase2.5_完全実装完了報告書_20251026.md) - 参考: Webhook実装パターン
4. [lightsail-integration-master-plan-20251005-updated.md](./lightsail-integration-master-plan-20251005-updated.md) - マスタープラン（Phase 2.9追加予定）

---

**文書終了**

最終更新: 2025年10月26日
バージョン: 1.0
承認: 医療システムチーム承認済み
次回レビュー: VoiceDriveチームからの回答受領後

---

**医療システムチーム一同、VoiceDriveチームの詳細な暫定マスターリスト作成に感謝申し上げます。**

引き続き、Phase 2.9 MyReportsPage連携の成功に向けて全力で取り組みます。

---

**連絡先**:
- Slack: #phase2-integration
- Email: medical-system-dev@kousei-kai.jp
- 担当: 医療システム開発チーム
