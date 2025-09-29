# LLMモデル管理仕様書

## 📅 作成日: 2025年9月29日
## 🎯 目的: 複数のLLMモデルを登録・切り替え・最適化

---

## 1. モデル管理の全体像

### 1.1 管理対象モデル

```typescript
interface LLMModel {
  id: string
  name: string
  provider: 'ollama' | 'openai' | 'anthropic' | 'custom'
  type: 'local' | 'cloud' | 'hybrid'
  specs: {
    size: string        // '7B', '13B', '70B'
    quantization?: string // 'Q4_K_M', 'Q5_K_S', etc
    contextWindow: number
    languages: string[]
    specializations: string[] // ['medical', 'japanese', 'analysis']
  }
  performance: {
    speed: 'fast' | 'medium' | 'slow'
    accuracy: 'high' | 'medium' | 'basic'
    resourceUsage: 'low' | 'medium' | 'high'
  }
  status: 'active' | 'inactive' | 'downloading' | 'error'
  installedAt?: Date
  lastUsed?: Date
  usage: {
    totalRequests: number
    avgResponseTime: number
    errorRate: number
  }
}
```

### 1.2 推奨モデルセット

| カテゴリ | モデル | サイズ | 用途 | 特徴 |
|----------|--------|--------|------|------|
| **汎用（日本語）** | | | | |
| | Llama-3-8B-Japanese | 8B | 一般的な分析・生成 | バランス型、日本語対応 |
| | ELYZA-japanese-Llama-2-13b | 13B | 高品質な日本語生成 | 医療用語に強い |
| | Swallow-70b | 70B | 最高品質（要高性能サーバー） | 東工大開発、日本語特化 |
| **医療特化** | | | | |
| | MedAlpaca | 7B | 医療文書分析 | 医療用語理解 |
| | ClinicalBERT-ja | 1.2B | 症状分析 | 軽量・高速 |
| | BioMistral | 7B | バイオメディカル | 最新医学知識 |
| **軽量・高速** | | | | |
| | Phi-3-mini | 3.8B | リアルタイム応答 | Microsoft製、超軽量 |
| | TinyLlama | 1.1B | 基本的な補完 | 最速応答 |
| **コード生成** | | | | |
| | CodeLlama | 7B | SQL/プログラム生成 | Meta製 |

---

## 2. モデル選択戦略

### 2.1 自動選択ルール

```typescript
const ModelSelector = {
  // 機能別の推奨モデル
  recommendations: {
    'interview.analysis': {
      primary: 'elyza-13b',      // 高精度な分析
      fallback: 'llama3-8b-jp',  // バックアップ
      criteria: ['accuracy > speed', 'japanese']
    },
    'smartsuggest.navigation': {
      primary: 'phi-3-mini',      // 高速応答優先
      fallback: 'tinyllama',
      criteria: ['speed > accuracy', 'realtime']
    },
    'report.monthly': {
      primary: 'swallow-70b',     // 最高品質
      fallback: 'elyza-13b',
      criteria: ['quality', 'long-form']
    },
    'medical.analysis': {
      primary: 'medalapaca',      // 医療特化
      fallback: 'biomistral',
      criteria: ['medical-knowledge']
    }
  },

  // 自動選択アルゴリズム
  selectModel(taskType: string, constraints?: {
    maxLatency?: number
    minAccuracy?: number
    maxCost?: number
  }): string {
    // 1. タスクタイプから推奨モデルを取得
    // 2. 制約条件でフィルタリング
    // 3. 現在の負荷状況を考慮
    // 4. 最適なモデルを選択
  }
}
```

### 2.2 負荷分散戦略

```typescript
interface LoadBalancingStrategy {
  // ラウンドロビン: 順番に使用
  roundRobin: {
    models: string[]
    currentIndex: number
  }

  // 負荷ベース: 最も空いているモデル
  leastLoaded: {
    getModelLoad: (modelId: string) => number
    threshold: number
  }

  // パフォーマンスベース: 最速モデル優先
  performance: {
    avgResponseTimes: Map<string, number>
    adaptiveSelection: boolean
  }

  // コストベース: 最も安いモデル優先
  cost: {
    modelCosts: Map<string, number>
    budget: number
  }
}
```

---

## 3. モデル管理UI設計

### 3.1 モデル登録画面

```typescript
export function ModelRegistrationPanel() {
  return (
    <div className="space-y-6">
      {/* Ollamaモデル一覧 */}
      <Card>
        <CardHeader>
          <h3>利用可能なOllamaモデル</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {ollamaModels.map(model => (
              <div className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="font-medium">{model.name}</p>
                  <p className="text-sm text-gray-600">
                    サイズ: {model.size} | 言語: {model.languages.join(', ')}
                  </p>
                </div>
                <button className="btn-primary">
                  インストール
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* カスタムモデル追加 */}
      <Card>
        <CardHeader>
          <h3>カスタムモデル追加</h3>
        </CardHeader>
        <CardContent>
          <form>
            <input placeholder="モデルURL or パス" />
            <select>
              <option>Ollama</option>
              <option>GGUF</option>
              <option>Hugging Face</option>
            </select>
            <button>追加</button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
```

### 3.2 モデル切り替えUI

```typescript
export function ModelSwitcher() {
  const [globalModel, setGlobalModel] = useState('llama3-8b-jp')
  const [taskModels, setTaskModels] = useState({})

  return (
    <Card>
      <CardHeader>
        <h3>🔄 モデル設定</h3>
      </CardHeader>
      <CardContent>
        {/* グローバル設定 */}
        <div className="mb-6 p-4 bg-blue-50 rounded">
          <label className="block text-sm font-medium mb-2">
            デフォルトモデル（全機能共通）
          </label>
          <select
            value={globalModel}
            onChange={(e) => setGlobalModel(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="llama3-8b-jp">Llama3 8B 日本語 (バランス型)</option>
            <option value="elyza-13b">ELYZA 13B (高精度)</option>
            <option value="phi-3">Phi-3 Mini (高速)</option>
            <option value="swallow-70b">Swallow 70B (最高品質)</option>
          </select>
        </div>

        {/* 機能別設定 */}
        <div className="space-y-4">
          <h4 className="font-medium">機能別カスタマイズ</h4>

          {Object.entries(FEATURE_CATEGORIES).map(([category, features]) => (
            <div key={category} className="border rounded p-4">
              <h5 className="font-medium mb-3">{category}</h5>
              {features.map(feature => (
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">{feature.name}</span>
                  <select className="text-sm p-1 border rounded">
                    <option>デフォルト使用</option>
                    <option>Llama3 8B</option>
                    <option>ELYZA 13B</option>
                    <option>Phi-3 Mini</option>
                    <option>MedAlpaca (医療)</option>
                  </select>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* 自動最適化 */}
        <div className="mt-6 p-4 bg-green-50 rounded">
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked />
            <span className="font-medium">
              🤖 AI自動最適化を有効化
            </span>
          </label>
          <p className="text-sm text-gray-600 mt-1">
            使用状況を分析して最適なモデルを自動選択します
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
```

---

## 4. モデル性能比較ダッシュボード

```typescript
interface ModelMetrics {
  modelId: string
  metrics: {
    // パフォーマンス
    avgResponseTime: number     // ms
    p95ResponseTime: number
    throughput: number          // req/min

    // 品質
    userSatisfaction: number    // 1-5
    accuracyScore: number       // 0-100
    hallucinationRate: number   // %

    // リソース
    memoryUsage: number         // GB
    cpuUsage: number           // %
    gpuUsage?: number          // %

    // コスト
    costPerRequest: number      // 円
    totalMonthlyCost: number
  }
}
```

### 4.1 比較ビュー

```
┌──────────────────────────────────────────────┐
│  📊 モデル性能比較                           │
├──────────────────────────────────────────────┤
│                                              │
│  モデル     速度  精度  コスト  満足度       │
│  ─────────────────────────────────────       │
│  Llama3-8B  ████  ███   ████    ★★★★☆       │
│  ELYZA-13B  ██    ████  ███     ★★★★★       │
│  Phi-3      █████ ██    █████   ★★★☆☆       │
│  Swallow    █     █████ █       ★★★★★       │
│                                              │
│  [詳細レポート] [A/Bテスト実行]              │
└──────────────────────────────────────────────┘
```

---

## 5. 実装優先順位

### Phase 1: 基本実装（DB構築後すぐ）
1. **Ollama統合**
   - デフォルトモデル（Llama3-8B-JP）のインストール
   - 基本的な推論実行
   - シンプルなモデル切り替え

### Phase 2: マルチモデル対応（1ヶ月後）
1. **モデル管理UI**
   - モデル一覧表示
   - インストール/削除機能
   - 切り替え機能

2. **基本的な振り分け**
   - 機能別モデル指定
   - 手動切り替え

### Phase 3: 最適化（2ヶ月後）
1. **自動選択**
   - タスクベース選択
   - 負荷分散
   - フォールバック

2. **性能監視**
   - メトリクス収集
   - 比較ダッシュボード

### Phase 4: 高度な機能（3ヶ月後）
1. **AI最適化**
   - 使用パターン学習
   - 自動チューニング
   - コスト最適化

2. **ファインチューニング**
   - 医療用語の追加学習
   - 施設別カスタマイズ

---

## 6. 運用上の考慮事項

### 6.1 モデル更新戦略
- 定期的な新モデル評価
- 段階的ロールアウト
- ロールバック機能

### 6.2 ライセンス管理
- 各モデルのライセンス確認
- 商用利用可否の管理
- コンプライアンスチェック

### 6.3 セキュリティ
- モデルファイルの暗号化
- アクセス制御
- 監査ログ

### 6.4 バックアップ
- モデルファイルのバックアップ
- 設定のエクスポート/インポート
- 災害復旧計画

---

## 📝 まとめ

モデル切り替え機能により、以下が実現可能になります：

1. **柔軟性**: タスクに最適なモデルを選択
2. **性能**: 速度と精度のバランス調整
3. **コスト**: リソース使用の最適化
4. **信頼性**: フォールバック機能による安定運用
5. **拡張性**: 新モデルの容易な追加

これにより、医療現場の多様なニーズに対応しつつ、最適なAI支援を提供できます。