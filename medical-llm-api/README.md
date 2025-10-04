# LLM Moderation API

**Llama 3.2 8B ローカルLLMによるコンテンツモデレーションAPI**

VoiceDrive SNS投稿の自動検閲システム - 個人攻撃・誹謗中傷の未然防止

---

## 📋 概要

このAPIは、医療職員向けSNS「VoiceDrive」の投稿コンテンツを自動的にモデレーションし、以下を検出します：

- ✅ 11種類の違反タイプ検出（個人攻撃、誹謗中傷、ハラスメント等）
- ✅ 医療現場特有の表現への配慮（誤検知防止）
- ✅ 建設性スコア評価（0-100点）
- ✅ 修正提案の自動生成
- ✅ 完全ローカル処理（外部送信ゼロ）

---

## 🎯 主な機能

### 1. コンテンツモデレーション API

**エンドポイント**: `POST /api/moderate`

```json
{
  "content": "夜勤のシフト調整方法を改善すべきです。",
  "context": {
    "postType": "improvement",
    "authorLevel": 3,
    "department": "看護部"
  },
  "options": {
    "checkSensitivity": "medium",
    "language": "ja",
    "includeExplanation": true
  }
}
```

**レスポンス**:
```json
{
  "allowed": true,
  "severity": "none",
  "confidence": 85,
  "violations": [],
  "explanation": "建設的な改善提案です。",
  "suggestedEdits": null,
  "metadata": {
    "modelVersion": "llama3.2:8b-v1.0",
    "processingTime": 1200,
    "timestamp": "2025-10-05T10:00:00Z"
  }
}
```

### 2. ヘルスチェック API

**エンドポイント**: `GET /api/health`

システムの健全性を確認

### 3. メトリクス API

**エンドポイント**: `GET /api/metrics`

使用統計・パフォーマンス指標を取得

---

## 🚀 セットアップ手順

### 前提条件

- **Python 3.10+**
- **Ollama** (Llama 3.2 8B実行環境)
- **Redis** (オプション、キャッシュ用)

### 1. Ollamaのインストール

```bash
# macOS / Linux
curl -fsSL https://ollama.com/install.sh | sh

# Windows
# https://ollama.com/download からインストーラーをダウンロード
```

### 2. Llama 3.2 8Bモデルのダウンロード

```bash
ollama pull llama3.2:8b
```

### 3. Pythonパッケージのインストール

```bash
# 仮想環境作成（推奨）
python -m venv venv

# 仮想環境有効化
# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

# パッケージインストール
pip install -r requirements.txt
```

### 4. APIサーバー起動

```bash
# 開発モード（自動リロード有効）
python -m uvicorn src.api.main:app --reload --host 0.0.0.0 --port 8000

# 本番モード
uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### 5. 動作確認

```bash
# ブラウザで開く
http://localhost:8000/docs

# curlでテスト
curl -X POST "http://localhost:8000/api/moderate" \
  -H "Content-Type: application/json" \
  -d '{"content": "テスト投稿です"}'
```

---

## 📂 プロジェクト構造

```
medical-llm-api/
├── src/
│   ├── api/
│   │   ├── main.py              # FastAPIアプリケーション
│   │   └── types.py             # Pydantic型定義
│   ├── services/
│   │   ├── llm_engine.py        # Ollama統合エンジン
│   │   └── moderation_service.py # モデレーションロジック
│   ├── prompts/
│   │   └── violation_detection.py # 違反検出プロンプト
│   ├── cache/                   # キャッシュ実装（Week 7）
│   └── utils/                   # ユーティリティ
├── tests/
│   ├── unit/                    # 単体テスト
│   ├── integration/             # 統合テスト
│   └── regression/              # MockLLM整合性テスト
├── data/
│   ├── patterns/                # 医療表現パターン
│   └── training/                # Few-shot サンプル
├── requirements.txt             # Pythonパッケージリスト
└── README.md                    # 本ドキュメント
```

---

## 🧪 テスト

### VoiceDrive提供のテストデータ（230件）

**場所**: `C:\projects\voicedrive-v100\mcp-shared\test-data\llm-moderation\`

| ファイル | 件数 | 目的 |
|---------|------|------|
| `normal-cases.json` | 100件 | 正常系（全て許可すべき） |
| `violation-cases.json` | 50件 | 異常系（全てブロックすべき） |
| `edge-cases.json` | 30件 | 境界値（判定が難しい） |
| `medical-context-cases.json` | 50件 | 医療文脈（医療特有表現） |

### テスト実行（Week 6以降）

```bash
# 全テスト実行
pytest

# 特定カテゴリのみ
pytest tests/unit/
pytest tests/integration/
pytest tests/regression/  # MockLLM整合性テスト
```

---

## ⚙️ 設定

### 環境変数（.env）

```env
# Ollama設定
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama3.2:8b

# Redis設定（オプション）
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0

# API設定
API_HOST=0.0.0.0
API_PORT=8000
API_WORKERS=4

# ログレベル
LOG_LEVEL=INFO
```

---

## 📊 パフォーマンス目標

| 指標 | 目標値 | 現在値 |
|------|--------|--------|
| **平均応答時間** | ≤ 1.5秒 | Week 6測定予定 |
| **P95応答時間** | ≤ 2.5秒 | Week 6測定予定 |
| **Overall Accuracy** | ≥ 90% | Week 6測定予定 |
| **Precision** | ≥ 92% | Week 6測定予定 |
| **Recall** | ≥ 95% | Week 6測定予定 |
| **Privacy Violation検出** | 100% | 最重要 |

---

## 🔒 セキュリティ

### 完全ローカル処理

- ✅ 投稿内容は外部送信なし
- ✅ Llama 3.2 8B（ローカルモデル）のみ使用
- ✅ OpenAI、Claude等の外部AIサービス不使用
- ✅ 処理完了後、即座にデータ削除

### データ保持ポリシー

| データ種別 | 保持期間 | 暗号化 |
|----------|---------|--------|
| 投稿テキスト | 0秒（即座に削除） | - |
| 検知結果（匿名化） | 90日 | ✅ |
| 監査ログ（メタデータのみ） | 365日 | ✅ |

---

## 📈 Week 5-8スケジュール

| Week | 期間 | 目標 | 状態 |
|------|------|------|------|
| **Week 5** | 10/6-10/12 | コア機能実装 | ✅ 完了 |
| **Week 6** | 10/13-10/19 | 精度向上（230件テスト） | 🔄 次週 |
| **Week 7** | 10/20-10/26 | 統合テスト・パフォーマンス | 📅 予定 |
| **Week 8** | 10/27-11/2 | 本番準備・最終評価 | 📅 予定 |

---

## 🐛 トラブルシューティング

### Ollamaに接続できない

```bash
# Ollamaサービスの起動確認
ollama serve

# モデルのダウンロード確認
ollama list

# Llama 3.2 8Bが存在しない場合
ollama pull llama3.2:8b
```

### JSON抽出エラー

LLMが正しいJSON形式で返していない可能性があります。

```bash
# プロンプトを確認
cat src/prompts/violation_detection.py

# ログレベルをDEBUGに変更
export LOG_LEVEL=DEBUG
```

### パフォーマンスが遅い

```bash
# GPU有効化（NVIDIA GPU搭載の場合）
# Ollamaは自動的にGPUを検出・使用

# モデルサイズを小さくする
ollama pull llama3.2:3b  # 8Bより軽量
```

---

## 📞 サポート

### ドキュメント

- **提案書**: `mcp-shared/docs/VoiceDrive_Content_Moderation_Proposal_20251004.md`
- **実装ガイド**: `mcp-shared/docs/Medical_Team_LLM_Implementation_Guide_20251004.md`
- **キックオフ報告**: `mcp-shared/docs/LLM_Integration_Implementation_Kickoff_20251005.md`

### 連絡先

- **Slack**: `#llm-integration`
- **技術サポート**: medical-ai-team@example.com
- **プロジェクトリード**: medical-pm@example.com

---

## 📝 ライセンス

社内プロジェクト - 医療職員管理システム

---

## 🙏 謝辞

VoiceDriveチームの皆様、高品質なテストデータ（230件）とMockLLM実装の提供、誠にありがとうございました。

---

**🤖 医療職員管理システムチーム - AI/LLMエンジニアリング部門**
**作成日**: 2025年10月5日
**バージョン**: 1.0.0
