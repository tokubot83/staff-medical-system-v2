# AI制御センター設計書

## 📅 作成日: 2025年9月29日
## 🎯 目的: システム全体のAI機能を統合管理

---

## 1. 概要

医療職員管理システムの各所で活用されるAI/ローカルLLM機能を一元管理する統合プラットフォームです。

### 主要機能
- 🎛️ **統合管理**: すべてのAI機能を一箇所で制御
- 🎨 **カスタマイズ**: 機能別のプロンプト・パラメータ調整
- 📊 **可視化**: AI使用状況のリアルタイム監視
- 🔒 **ガバナンス**: セキュリティとコンプライアンス管理
- 💰 **最適化**: コストとパフォーマンスの最適化

---

## 2. AI活用箇所マッピング

### 2.1 面談・評価系
| 機能ID | 機能名 | 説明 | 使用頻度 |
|--------|--------|------|----------|
| `interview.analysis` | 面談内容分析 | 感情分析、リスク検出、推奨アクション生成 | 高 |
| `interview.summary` | フィードバックサマリ生成 | 面談後のサマリ自動作成 | 高 |
| `interview.suggestion` | 次回面談提案 | 最適な次回面談時期・内容の提案 | 中 |
| `evaluation.comment` | 評価コメント生成 | 人事評価コメントの下書き生成 | 中 |
| `evaluation.calibration` | 評価一貫性チェック | 評価のバイアス検出と調整提案 | 低 |

### 2.2 レポート生成系
| 機能ID | 機能名 | 説明 | 使用頻度 |
|--------|--------|------|----------|
| `report.monthly` | 月次レポート作成 | 部門別月次レポートの自動生成 | 中 |
| `report.risk` | リスク分析レポート | 離職リスク等の分析レポート | 低 |
| `report.trend` | トレンド分析 | 職員動向の分析と予測 | 低 |

### 2.3 日常業務支援系
| 機能ID | 機能名 | 説明 | 使用頻度 |
|--------|--------|------|----------|
| `smartsuggest.navigation` | スマートサジェスト | 画面遷移の予測提案 | 極高 |
| `smartsuggest.action` | アクション提案 | 次の操作の提案 | 高 |
| `email.draft` | メール下書き | 定型メールの自動生成 | 中 |
| `schedule.optimization` | スケジュール最適化 | 面談スケジュールの最適化 | 低 |
| `document.summary` | 文書要約 | 長文書類の要約生成 | 中 |

### 2.4 外部連携系
| 機能ID | 機能名 | 説明 | 使用頻度 |
|--------|--------|------|----------|
| `voicedrive.notification` | VoiceDrive通知文生成 | 通知メッセージの自動生成 | 高 |
| `voicedrive.response` | 自動応答生成 | チャットボット応答の生成 | 中 |

---

## 3. 管理者設定ページUI設計

### 3.1 メインダッシュボード
```
┌─────────────────────────────────────────────┐
│  🤖 AI制御センター                          │
├─────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ AI利用率 │ │ 処理件数 │ │ 節約時間 │  │
│  │   85%    │ │  1,234   │ │  456h    │  │
│  └──────────┘ └──────────┘ └──────────┘  │
│                                             │
│  [📊 使用状況マップ]                        │
│  ┌─────────────────────────────────────┐  │
│  │  面談系 ████████████ 45%            │  │
│  │  レポート ████████ 25%               │  │
│  │  業務支援 █████████ 30%              │  │
│  └─────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

### 3.2 機能別ON/OFF設定

```typescript
// src/app/admin/ai-settings/page.tsx
interface AIFeatureToggle {
  id: string
  name: string
  category: string
  enabled: boolean
  usage: 'high' | 'medium' | 'low'
  lastUsed: Date
}

export function AIFeatureControls() {
  return (
    <Card>
      <CardHeader>
        <h3>AI機能 ON/OFF設定</h3>
        <div className="flex gap-2">
          <button className="btn-primary">すべて有効化</button>
          <button className="btn-secondary">すべて無効化</button>
        </div>
      </CardHeader>

      <CardContent>
        {/* スマートサジェスト専用セクション */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-bold flex items-center gap-2">
                💡 スマートサジェスト機能
              </h4>
              <p className="text-sm text-gray-600">
                ユーザーの操作を予測して次のアクションを提案
              </p>
            </div>
            <Toggle
              checked={smartSuggestEnabled}
              onChange={toggleSmartSuggest}
              label="システム全体で有効"
            />
          </div>

          {smartSuggestEnabled && (
            <div className="ml-4 space-y-2">
              <Toggle label="画面遷移の提案" defaultChecked />
              <Toggle label="入力補完" defaultChecked />
              <Toggle label="ショートカット提案" defaultChecked />
              <Slider
                label="提案の積極度"
                min={1} max={5}
                defaultValue={3}
                marks={['控えめ', '', '標準', '', '積極的']}
              />
            </div>
          )}
        </div>

        {/* その他のAI機能 */}
        <div className="space-y-4">
          <FeatureGroup title="面談・評価">
            <FeatureToggle id="interview.analysis" />
            <FeatureToggle id="interview.summary" />
            <FeatureToggle id="evaluation.comment" />
          </FeatureGroup>

          <FeatureGroup title="レポート生成">
            <FeatureToggle id="report.monthly" />
            <FeatureToggle id="report.risk" />
          </FeatureGroup>
        </div>
      </CardContent>
    </Card>
  )
}
```

---

## 4. プロンプト管理システム

### 4.1 3層構造の設定

```typescript
interface PromptConfiguration {
  // レベル1: グローバル設定
  global: {
    model: string           // 'llama2-7b' | 'gpt-3.5' | 'claude-instant'
    temperature: number     // 0.1 - 1.0
    maxTokens: number      // 100 - 4000
    language: 'ja' | 'en'
    tone: 'formal' | 'friendly' | 'professional'
    safety: {
      filterLevel: 'strict' | 'moderate' | 'minimal'
      piiMasking: boolean
      auditLogging: boolean
    }
  }

  // レベル2: カテゴリ別設定
  categories: {
    [category: string]: {
      basePrompt?: string
      temperature?: number
      outputFormat?: 'text' | 'json' | 'markdown'
      specialRules?: string[]
    }
  }

  // レベル3: 機能別詳細設定
  features: {
    [featureId: string]: {
      enabled: boolean
      customPrompt?: string
      parameters?: Record<string, any>
      maxRetries?: number
      cacheTimeout?: number
    }
  }
}
```

### 4.2 プロンプトテンプレート管理

```typescript
// プロンプトテンプレートエディタ
interface PromptTemplate {
  id: string
  name: string
  category: string
  systemPrompt: string
  userPromptTemplate: string
  variables: string[]  // {{staffName}}, {{interviewDate}} など
  examples: {
    input: string
    expectedOutput: string
  }[]
  version: number
  lastModified: Date
  modifiedBy: string
}
```

---

## 5. 実装ロードマップ

### Phase 1: 基盤構築（共通DB構築後すぐ）
- [ ] ローカルLLM（Ollama）接続
- [ ] 基本的なプロンプト実装
- [ ] AI分析・サマリ生成の本番実装
- [ ] 簡易的なON/OFF機能

### Phase 2: 管理機能（1ヶ月後）
- [ ] 管理者設定ページの基本UI
- [ ] スマートサジェストON/OFF
- [ ] 機能別の有効/無効設定
- [ ] 基本的な使用統計

### Phase 3: カスタマイズ機能（2ヶ月後）
- [ ] プロンプトエディタ
- [ ] パラメータ調整UI
- [ ] カテゴリ別設定
- [ ] テストプレイグラウンド

### Phase 4: 高度な機能（3ヶ月後）
- [ ] A/Bテスト機能
- [ ] 自動最適化
- [ ] 詳細分析ダッシュボード
- [ ] コスト最適化AI

---

## 6. セキュリティ考慮事項

### 6.1 アクセス制御
- 管理者のみアクセス可能
- 操作ログの完全記録
- 設定変更の承認フロー

### 6.2 データ保護
- プロンプトインジェクション対策
- 個人情報の自動マスキング
- ローカル処理の徹底

### 6.3 監査
- すべてのAI処理のログ記録
- 月次監査レポート自動生成
- 異常検知アラート

---

## 7. パフォーマンス目標

| 指標 | 目標値 | 測定方法 |
|------|--------|----------|
| レスポンス時間 | < 2秒 | 95パーセンタイル |
| 精度 | > 85% | ユーザーフィードバック |
| 可用性 | 99.9% | 月間稼働率 |
| コスト削減 | 30% | 作業時間短縮 |

---

## 8. 今後の展望

### 8.1 短期（3-6ヶ月）
- マルチモデル対応
- より細かい権限管理
- モバイル対応

### 8.2 中期（6-12ヶ月）
- 音声入力対応
- 画像認識機能
- 外部AI APIとの連携

### 8.3 長期（1年以降）
- 完全自律型AI最適化
- 予測分析の高度化
- 他施設との学習共有

---

## 9. 参考実装

```typescript
// src/lib/ai/config.ts
export class AIConfigManager {
  private static instance: AIConfigManager

  // スマートサジェスト設定
  private smartSuggestConfig = {
    enabled: true,
    features: {
      navigation: true,
      inputCompletion: true,
      shortcuts: true
    },
    aggressiveness: 3, // 1-5
    userPreferences: new Map()
  }

  // 機能別の有効/無効状態
  private featureStates = new Map<string, boolean>()

  // グローバル設定
  private globalSettings = {
    model: 'llama2-7b',
    temperature: 0.7,
    maxTokens: 2000
  }

  // スマートサジェストのON/OFF
  toggleSmartSuggest(enabled?: boolean): void {
    this.smartSuggestConfig.enabled =
      enabled !== undefined ? enabled : !this.smartSuggestConfig.enabled
    this.broadcastConfigChange('smartsuggest', this.smartSuggestConfig)
  }

  // 個別機能のON/OFF
  toggleFeature(featureId: string, enabled?: boolean): void {
    const currentState = this.featureStates.get(featureId) ?? true
    this.featureStates.set(
      featureId,
      enabled !== undefined ? enabled : !currentState
    )
    this.broadcastConfigChange(featureId, enabled)
  }

  // 設定変更の通知
  private broadcastConfigChange(feature: string, config: any): void {
    // WebSocketやEventEmitterで全クライアントに通知
    console.log(`AI設定変更: ${feature}`, config)
  }
}
```

---

## 📝 備考

この設計書は、医療職員管理システムにおけるAI機能の統合管理を実現するための指針です。実装は段階的に進め、現場のフィードバックを取り入れながら改善していきます。

特にスマートサジェスト機能のON/OFF制御は、ユーザビリティとパフォーマンスのバランスを取る上で重要な機能となります。