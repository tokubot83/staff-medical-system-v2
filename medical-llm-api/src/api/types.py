"""
LLM Moderation API Type Definitions
Llama 3.2 8B ローカルLLM連携用型定義

VoiceDrive TypeScript型定義と完全一致するPydantic型
参照元: voicedrive-v100/src/types/llmModeration.ts
"""

from typing import Optional, List, Literal, Dict
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum


# LLM検出違反タイプ
class LLMViolationType(str, Enum):
    PERSONAL_ATTACK = "personal_attack"          # 個人攻撃
    DEFAMATION = "defamation"                    # 誹謗中傷
    HARASSMENT = "harassment"                    # ハラスメント（パワハラ・セクハラ等）
    DISCRIMINATION = "discrimination"            # 差別的表現
    PRIVACY_VIOLATION = "privacy_violation"      # プライバシー侵害
    INAPPROPRIATE_CONTENT = "inappropriate_content"  # 不適切なコンテンツ
    THREATENING = "threatening"                  # 脅迫的表現
    HATE_SPEECH = "hate_speech"                  # ヘイトスピーチ
    MISINFORMATION = "misinformation"            # 誤情報・デマ
    SPAM = "spam"                                # スパム
    OTHER = "other"                              # その他


# コンテキスト情報
class ModerationContext(BaseModel):
    postType: Optional[Literal['improvement', 'community', 'report']] = 'improvement'
    authorLevel: Optional[int] = 3
    department: Optional[str] = '看護部'


# オプション設定
class ModerationOptions(BaseModel):
    checkSensitivity: Optional[Literal['low', 'medium', 'high']] = 'medium'
    language: Optional[Literal['ja', 'en']] = 'ja'
    includeExplanation: Optional[bool] = True


# LLMモデレーションリクエスト
class LLMModerationRequest(BaseModel):
    """LLMモデレーションリクエスト"""
    content: str = Field(..., description="チェック対象テキスト")
    context: Optional[ModerationContext] = None
    options: Optional[ModerationOptions] = None


# LLM検出違反項目
class LLMViolation(BaseModel):
    """LLM検出違反項目"""
    type: LLMViolationType
    severity: Literal['low', 'medium', 'high', 'critical']
    description: str = Field(..., description="違反内容の説明")
    extractedText: Optional[str] = Field(None, description="問題のあるテキスト抽出")
    startIndex: Optional[int] = Field(None, description="テキスト開始位置")
    endIndex: Optional[int] = Field(None, description="テキスト終了位置")
    confidence: int = Field(..., ge=0, le=100, description="この違反の信頼度（0-100）")


# メタデータ
class ModerationMetadata(BaseModel):
    """モデレーションメタデータ"""
    modelVersion: str = Field(..., description="使用モデルバージョン")
    processingTime: int = Field(..., description="処理時間（ミリ秒）")
    timestamp: datetime


# LLMモデレーション判定結果
class LLMModerationResult(BaseModel):
    """LLMモデレーション判定結果"""
    allowed: bool = Field(..., description="投稿可否")
    severity: Literal['none', 'low', 'medium', 'high', 'critical'] = Field(..., description="重大度")
    confidence: int = Field(..., ge=0, le=100, description="信頼度（0-100）")

    violations: List[LLMViolation] = Field(default_factory=list, description="検出された違反リスト")

    explanation: Optional[str] = Field(None, description="判定理由の説明")
    suggestedEdits: Optional[List[str]] = Field(None, description="修正提案")

    metadata: ModerationMetadata


# LLM APIエラーレスポンス
class LLMAPIErrorDetail(BaseModel):
    """エラー詳細"""
    code: str = Field(..., description="エラーコード")
    message: str = Field(..., description="エラーメッセージ")
    details: Optional[Dict] = None


class LLMAPIError(BaseModel):
    """LLM APIエラーレスポンス"""
    error: LLMAPIErrorDetail
    timestamp: datetime


# LLM API設定
class LLMAPIConfig(BaseModel):
    """LLM API設定"""
    endpoint: str = Field(..., description="APIエンドポイントURL")
    apiKey: Optional[str] = Field(None, description="APIキー（認証が必要な場合）")
    timeout: int = Field(3000, description="タイムアウト（ミリ秒）")
    retryAttempts: int = Field(2, description="リトライ回数")
    fallbackToLocal: bool = Field(True, description="API障害時にローカルチェックにフォールバック")
    cacheEnabled: bool = Field(True, description="レスポンスキャッシュ有効化")
    cacheDuration: int = Field(300000, description="キャッシュ保持時間（ミリ秒）= 5分")


# LLMモデレーション統計
class LLMModerationStats(BaseModel):
    """LLMモデレーション統計"""
    totalRequests: int = Field(..., description="総リクエスト数")
    totalViolations: int = Field(..., description="総違反検出数")
    averageProcessingTime: float = Field(..., description="平均処理時間（ミリ秒）")
    apiSuccessRate: float = Field(..., description="API成功率（%）")
    violationsByType: Dict[LLMViolationType, int] = Field(..., description="タイプ別違反数")
    cacheHitRate: float = Field(..., description="キャッシュヒット率（%）")


# ハイブリッドモデレーション結果
class ClientModerationResult(BaseModel):
    """クライアント側結果"""
    allowed: bool
    severity: Literal['none', 'low', 'medium', 'high', 'critical']
    violations: List[str]


class HybridModerationResult(BaseModel):
    """ハイブリッドモデレーション結果（クライアント側チェック + LLMチェック）"""
    finalDecision: bool = Field(..., description="最終判定（投稿可否）")

    clientResult: ClientModerationResult = Field(..., description="クライアント側結果")
    llmResult: Optional[LLMModerationResult] = Field(None, description="LLM結果（API成功時のみ）")

    usedLLM: bool = Field(..., description="LLMを使用したか")
    fallbackReason: Optional[str] = Field(None, description="フォールバック理由（LLM未使用時）")

    combinedSeverity: Literal['none', 'low', 'medium', 'high', 'critical'] = Field(..., description="統合重大度")
    recommendedAction: Literal['allow', 'warn', 'block'] = Field(..., description="推奨アクション")


# バッチモデレーションリクエスト
class BatchPostItem(BaseModel):
    """バッチ処理用の投稿アイテム"""
    postId: str
    content: str
    context: Optional[ModerationContext] = None


class LLMBatchModerationRequest(BaseModel):
    """バッチモデレーションリクエスト"""
    posts: List[BatchPostItem]
    options: Optional[ModerationOptions] = None


# バッチモデレーション結果
class BatchResultItem(LLMModerationResult):
    """バッチ結果アイテム"""
    postId: str


class BatchMetadata(BaseModel):
    """バッチメタデータ"""
    batchSize: int
    successCount: int
    failureCount: int


class LLMBatchModerationResult(BaseModel):
    """バッチモデレーション結果"""
    results: List[BatchResultItem]
    totalProcessingTime: int = Field(..., description="総処理時間（ミリ秒）")
    metadata: BatchMetadata


# ヘルスチェック結果
class HealthCheckDetail(BaseModel):
    """ヘルスチェック詳細"""
    llm: Literal['ok', 'error']
    cache: Literal['ok', 'error']
    database: Optional[Literal['ok', 'error']] = None


class LLMHealthCheck(BaseModel):
    """ヘルスチェック結果"""
    status: Literal['healthy', 'degraded', 'unhealthy']
    checks: HealthCheckDetail
    version: str
    uptime: int = Field(..., description="稼働時間（秒）")
    timestamp: str = Field(..., description="ISO 8601形式のタイムスタンプ")


# メトリクス結果
class MetricsRequests(BaseModel):
    """リクエスト統計"""
    total: int
    successful: int
    failed: int


class MetricsPerformance(BaseModel):
    """パフォーマンス統計"""
    avgResponseTime: float = Field(..., description="平均応答時間（ミリ秒）")
    p95ResponseTime: float = Field(..., description="P95応答時間（ミリ秒）")
    p99ResponseTime: float = Field(..., description="P99応答時間（ミリ秒）")


class LLMMetrics(BaseModel):
    """メトリクス結果"""
    requests: MetricsRequests
    performance: MetricsPerformance
    detections: Dict[LLMViolationType, int]
    period: Literal['last_1h', 'last_24h', 'last_7d', 'last_30d']
