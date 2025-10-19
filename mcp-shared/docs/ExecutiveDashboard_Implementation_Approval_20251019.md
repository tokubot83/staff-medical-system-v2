# エグゼクティブダッシュボード実装承認書

**文書番号**: ED-APPROVAL-2025-1019-001
**作成日**: 2025年10月19日
**作成者**: 医療職員管理システムチーム
**宛先**: VoiceDriveチーム
**件名**: エグゼクティブダッシュボード実装計画の承認
**重要度**: 🟡 中
**ステータス**: 承認完了

---

## 📋 エグゼクティブサマリー

VoiceDriveチームからの回答書（ED-RESP-2025-1019-001）を確認し、エグゼクティブダッシュボード実装計画を**全面的に承認**します。

---

## ✅ 承認内容

### 1. 実装方針の承認

| 項目 | VoiceDriveチームの回答 | 医療システムチームの判断 |
|------|---------------------|---------------------|
| **エンドポイント** | Option B（新規作成） | ✅ 承認 |
| **LLM実装タイミング** | Phase 18.5と同時（2026年1月） | ✅ 承認 |
| **ページ配置** | Option A（別ページ） | ✅ 承認 |
| **送信頻度** | 毎週月曜日 02:00 JST | ✅ 承認 |
| **データ保存** | VoiceDrive側（3年保持） | ✅ 承認 |
| **アクセス権限** | Level 12+専用 | ✅ 承認 |
| **K-匿名性チェック** | 最小5名以上 | ✅ 承認 |

---

## 💰 コスト承認

### 医療システム側の開発コスト

| 項目 | 工数 | コスト |
|------|------|--------|
| レポートセンターページ項目追加 | 1日 | ¥40,000 |
| データ取得バッチ処理実装 | 2日 | ¥80,000 |
| LLM分析実装 | 0日 | ¥0（ボイス分析と共通） |
| 分析結果送信バッチ処理実装 | 1日 | ¥40,000 |
| 統合テスト | 1日 | ¥40,000 |
| **合計** | **5日** | **¥200,000** |

**承認**: ✅ **¥200,000を医療システムプロジェクト予算から支出**

### 月額運用コスト

**追加コスト**: ¥0（既存のLightsail統合インスタンスを使用）

**承認**: ✅ **追加の月額運用コストなし**

---

## 📅 スケジュール承認

### Phase 1: VoiceDrive側API実装（2025年10月19日～11月8日）

**VoiceDriveチーム作業**:
- データ提供API実装（`GET /api/v1/executive/dashboard-data`）
- 分析結果受信API実装（`POST /api/v1/executive/strategic-insights`）
- `ExecutiveStrategicInsight`テーブル作成
- API仕様書作成（OpenAPI形式）

**医療システムチーム作業**: なし（待機）

---

### Phase 2: 医療システム側実装（2025年11月11日～12月6日）

**医療システムチーム作業**:

#### Week 1（11月11日～15日）
- [ ] レポートセンターページに「エグゼクティブダッシュボード」項目追加
  - ファイル: `src/app/reports/home/page.tsx`
  - 追加内容: 新規カードコンポーネント
  - 工数: 1日

#### Week 2（11月18日～22日）
- [ ] データ取得バッチ処理実装
  - ファイル: `src/batch/executive-dashboard-fetch.ts`
  - スケジュール: 毎週月曜日 02:00 JST
  - VoiceDrive API呼び出し: `GET /api/v1/executive/dashboard-data`
  - 工数: 2日

#### Week 3（11月25日～29日）
- [ ] モック分析結果送信実装
  - ファイル: `src/batch/executive-dashboard-send.ts`
  - VoiceDrive API呼び出し: `POST /api/v1/executive/strategic-insights`
  - HMAC-SHA256署名認証実装
  - 工数: 1日

#### Week 4（12月2日～6日）
- [ ] 統合テスト準備
  - 単体テスト作成
  - モックデータ作成
  - 工数: 1日

---

### Phase 3: 統合テスト（2025年12月9日～20日）

**両チーム合同作業**:

#### Week 1（12月9日～13日）
- [ ] データ取得APIテスト
  - VoiceDrive API → 医療システムバッチ処理
  - レスポンスデータ検証
  - エラーハンドリング確認

- [ ] 分析結果受信APIテスト
  - 医療システム → VoiceDrive API
  - HMAC署名検証
  - リトライ機構確認

#### Week 2（12月16日～20日）
- [ ] UI表示確認
  - レポートセンターページ表示
  - データ表示確認
  - 権限制御確認（Level 12+のみ）

- [ ] パフォーマンステスト
  - API応答時間測定
  - バッチ処理時間測定

---

### Phase 4: 暫定リリース（2025年12月23日～31日）

**両チーム作業**:
- [ ] ステージング環境テスト
- [ ] 本番環境デプロイ
- [ ] ソフトリリース（モック版）

---

### Phase 5: 本格実装（2026年1月、Phase 18.5）

**医療システムチーム作業**:

#### Week 1（1月6日～10日）
- [ ] Llama 3.2 8B連携準備
  - ボイス分析のLLM実装確認
  - プロンプト設計

#### Week 2～3（1月13日～24日）
- [ ] 高度な戦略分析実装
  - 施設間比較分析
  - 原因特定
  - 推奨アクション生成
  - ベストプラクティス抽出
  - 予測分析
  - 中長期戦略提案

#### Week 4（1月27日～31日）
- [ ] 統合テスト・本番リリース

---

## 🔧 実装詳細の確認

### データ取得バッチ処理の実装仕様

**ファイル**: `src/batch/executive-dashboard-fetch.ts`

```typescript
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

interface ExecutiveDashboardData {
  period: string;
  generatedAt: string;
  facilities: Array<{
    facilityCode: string;
    facilityName: string;
    stats: {
      totalPosts: number;
      agendaCreated: number;
      committeeSubmitted: number;
      resolved: number;
      participationRate: number;
      resolutionRate: number;
      avgResolutionDays: number;
    };
    departments: Array<{
      name: string;
      posts: number;
      agendas: number;
      activeScore: number;
      trend: string;
    }>;
    alerts: Array<{
      type: string;
      severity: string;
      title: string;
      description: string;
      department: string;
      affectedCount: number;
    }>;
    projects: {
      inProgress: number;
      completed: number;
      delayed: number;
      avgProgress: number;
    };
  }>;
  trends: {
    monthly: Array<{
      month: string;
      totalPosts: number;
      participationRate: number;
      resolutionRate: number;
    }>;
  };
}

async function fetchExecutiveDashboardData(): Promise<ExecutiveDashboardData | null> {
  try {
    const currentPeriod = new Date().toISOString().slice(0, 7); // YYYY-MM

    const response = await axios.get<ExecutiveDashboardData>(
      `${process.env.VOICEDRIVE_API_URL}/api/v1/executive/dashboard-data`,
      {
        params: {
          period: currentPeriod,
          facilities: ['obara-hospital', 'tategami-rehabilitation']
        },
        headers: {
          'Authorization': `Bearer ${process.env.VOICEDRIVE_JWT_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    console.log(`[ExecutiveDashboard] データ取得成功: ${response.data.facilities.length}施設`);
    return response.data;

  } catch (error) {
    console.error('[ExecutiveDashboard] データ取得エラー:', error);
    return null;
  }
}

async function main() {
  console.log('[ExecutiveDashboard] バッチ処理開始');

  const data = await fetchExecutiveDashboardData();
  if (!data) {
    console.error('[ExecutiveDashboard] データ取得失敗、処理中断');
    process.exit(1);
  }

  // データをログに記録（デバッグ用）
  console.log('[ExecutiveDashboard] 取得データサマリー:');
  console.log(`  - 期間: ${data.period}`);
  console.log(`  - 施設数: ${data.facilities.length}`);
  console.log(`  - 総投稿数: ${data.facilities.reduce((sum, f) => sum + f.stats.totalPosts, 0)}`);

  // Phase 5でLLM分析を実装
  // 現在はモック分析を実施
  await sendMockAnalysisResult(data);

  console.log('[ExecutiveDashboard] バッチ処理完了');
}

async function sendMockAnalysisResult(data: ExecutiveDashboardData) {
  // モック分析結果（統計ベース）
  const mockAnalysis = {
    analysisDate: new Date().toISOString(),
    insights: [
      {
        type: "priority_action",
        severity: "medium",
        title: "施設間の参加率格差",
        analysis: `施設別の参加率にばらつきがあります（最大: ${Math.max(...data.facilities.map(f => f.stats.participationRate))}%、最小: ${Math.min(...data.facilities.map(f => f.stats.participationRate))}%）`,
        rootCause: "施設間のコミュニケーション文化の違い",
        recommendedActions: [
          "参加率の低い施設での説明会開催",
          "施設間ベストプラクティス共有会の実施"
        ],
        expectedImpact: "3ヶ月以内に参加率10%向上見込み",
        urgency: "1ヶ月以内に対応推奨"
      }
    ],
    predictions: [],
    strategicRecommendations: [],
    successCases: []
  };

  try {
    const timestamp = Date.now();
    const body = JSON.stringify(mockAnalysis);
    const signature = generateHMACSignature(timestamp, 'POST', '/api/v1/executive/strategic-insights', body);

    await axios.post(
      `${process.env.VOICEDRIVE_API_URL}/api/v1/executive/strategic-insights`,
      mockAnalysis,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-HMAC-Signature': signature,
          'X-Timestamp': timestamp.toString()
        },
        timeout: 30000
      }
    );

    console.log('[ExecutiveDashboard] モック分析結果送信成功');
  } catch (error) {
    console.error('[ExecutiveDashboard] 分析結果送信エラー:', error);
  }
}

function generateHMACSignature(timestamp: number, method: string, path: string, body: string): string {
  const crypto = require('crypto');
  const secret = process.env.VOICEDRIVE_HMAC_SECRET || '';
  const signatureString = `${timestamp}:${method}:${path}:${body}`;
  return crypto.createHmac('sha256', secret).update(signatureString).digest('hex');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**実装期間**: 2日（11月18日～19日）

---

### レポートセンターページの実装仕様

**ファイル**: `src/app/reports/home/page.tsx`

**追加内容**:

```tsx
// 既存のカテゴリーに追加
const reportCategories = [
  // ... 既存のカテゴリー ...

  // 🆕 エグゼクティブダッシュボード
  {
    id: 'executive-dashboard',
    name: 'エグゼクティブダッシュボード',
    icon: <Building2 className="h-8 w-8" />,
    description: '組織全体の健康状態と戦略的意思決定支援',
    color: 'from-purple-500 to-pink-500',
    requiredLevel: 12, // Level 12+専用
    reports: [
      {
        id: 'executive-overview',
        name: '経営概要',
        path: '/reports/executive/overview',
        description: '月次KPIサマリー、重要アラート、プロジェクト進捗',
        icon: <BarChart3 className="h-5 w-5" />
      },
      {
        id: 'strategic-analysis',
        name: '戦略分析',
        path: '/reports/executive/strategic-analysis',
        description: '施設間比較、原因特定、推奨アクション、予測分析',
        icon: <TrendingUp className="h-5 w-5" />
      }
    ]
  }
];
```

**アクセス制御**:

```tsx
// Level 12+のみ表示
{reportCategories.map((category) => {
  // 権限チェック
  if (category.requiredLevel && user.permissionLevel < category.requiredLevel) {
    return null; // Level 12未満は非表示
  }

  return (
    <CategoryCard key={category.id} category={category} />
  );
})}
```

**実装期間**: 1日（11月11日）

---

## 🔐 セキュリティ確認

### アクセス権限の実装

**確認事項**:
- ✅ Level 12+のみアクセス可能（UI非表示 + API権限チェック）
- ✅ 施設別権限制御なし（経営層は全施設閲覧可能）
- ✅ K-匿名性チェック（VoiceDrive側で実装済み）

**実装箇所**:
1. UI表示制御: `src/app/reports/home/page.tsx`
2. API権限チェック: VoiceDrive側で実装

---

### HMAC署名認証の実装

**確認事項**:
- ✅ ボイス分析と同じHMAC-SHA256方式
- ✅ 署名文字列: `${timestamp}:${method}:${path}:${body}`
- ✅ シークレット: `process.env.VOICEDRIVE_HMAC_SECRET`

**実装箇所**: `src/batch/executive-dashboard-send.ts`

---

## 📊 成功指標（KPI）

### 技術指標

| 指標 | 目標値 | 測定方法 |
|------|--------|---------|
| API応答時間 | < 500ms（95%） | CloudWatch |
| バッチ処理時間 | < 5分 | バッチログ |
| データ取得成功率 | > 99% | バッチログ |
| 分析結果送信成功率 | > 99% | Webhookログ |

### ビジネス指標

| 指標 | 目標値 | 測定方法 |
|------|--------|---------|
| 経営層の利用率 | > 80% | アクセスログ |
| 戦略的意思決定の改善 | 定性評価 | 四半期アンケート |
| データドリブン経営の定着 | 定性評価 | 理事会でのKPI確認頻度 |

---

## 🎯 まとめ

### 承認内容の確認

✅ **実装計画**: 全面承認
✅ **開発コスト**: ¥200,000承認
✅ **月額運用コスト**: ¥0（追加なし）
✅ **スケジュール**: 承認（2025年11月11日開始、2026年1月本格実装）
✅ **実装範囲**: レポートセンターページ項目追加、バッチ処理実装

### 次のステップ

**VoiceDriveチーム**:
- ✅ Phase 1実装開始（2025年10月19日～11月8日）
- API実装、テーブル作成、API仕様書作成

**医療システムチーム**:
- ⏳ Phase 2実装開始（2025年11月11日～12月6日）
- レポートセンターページ項目追加、バッチ処理実装

---

## 📞 連絡先

**医療職員管理システムチーム**
- Slack: `#phase2-integration`
- MCPサーバー: `mcp-shared/docs/`
- 担当者: 医療システムプロジェクトリード

**実装に関する質問**:
- 実装スケジュールの調整
- 技術的な質問
- 統合テストの調整

---

**VoiceDriveチームの詳細な回答書に感謝いたします。実装計画を全面的に承認し、2025年11月11日から医療システム側の実装を開始します。**

**医療職員管理システムチーム**
2025年10月19日
