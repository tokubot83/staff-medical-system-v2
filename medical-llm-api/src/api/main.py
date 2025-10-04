"""
LLM Moderation API - FastAPIメインアプリケーション

VoiceDrive SNS投稿のコンテンツモデレーションを提供するAPI
Llama 3.2:3b ローカルLLMを使用（Option B採用 2025/10/5）
"""

import time
from datetime import datetime
from typing import Dict, Any
import logging

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from src.api.types import (
    LLMModerationRequest,
    LLMModerationResult,
    LLMAPIError,
    LLMHealthCheck,
    LLMMetrics,
)
from src.services.llm_engine import get_llm_engine

# ロギング設定
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# FastAPIアプリケーション初期化
app = FastAPI(
    title="LLM Moderation API",
    description="Llama 3.2:3b ローカルLLMによるコンテンツモデレーションAPI（Option B採用）",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS設定（VoiceDriveからのアクセスを許可）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 本番環境では特定のオリジンのみ許可
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# アプリケーション起動時刻
APP_START_TIME = time.time()

# グローバルメトリクス（簡易版）
global_metrics = {
    "total_requests": 0,
    "successful_requests": 0,
    "failed_requests": 0,
    "total_processing_time": 0.0,
    "violation_counts": {},
}


@app.get("/", tags=["Root"])
async def root() -> Dict[str, str]:
    """
    ルートエンドポイント - API情報
    """
    return {
        "service": "LLM Moderation API",
        "version": "1.0.0",
        "model": "Llama 3.2:3b (Option B)",
        "status": "running",
        "docs": "/docs",
    }


@app.post("/api/moderate", response_model=LLMModerationResult, tags=["Moderation"])
async def moderate_content(request: LLMModerationRequest) -> LLMModerationResult:
    """
    コンテンツモデレーションエンドポイント

    投稿内容を分析し、違反検出・建設性評価を行います。

    Args:
        request: モデレーションリクエスト

    Returns:
        モデレーション結果

    Raises:
        HTTPException: LLM処理エラー時
    """
    start_time = time.time()
    global_metrics["total_requests"] += 1

    try:
        logger.info(f"Moderation request received: {len(request.content)} chars")

        # TODO: ModerationServiceの実装後に置き換え
        # 現在はダミーレスポンス
        from src.api.types import ModerationMetadata

        result = LLMModerationResult(
            allowed=True,
            severity="none",
            confidence=90,
            violations=[],
            explanation="正常な投稿です。（現在はダミーレスポンス）",
            suggestedEdits=None,
            metadata=ModerationMetadata(
                modelVersion="llama3.2:8b",
                processingTime=int((time.time() - start_time) * 1000),
                timestamp=datetime.now()
            )
        )

        # メトリクス更新
        processing_time = (time.time() - start_time) * 1000
        global_metrics["successful_requests"] += 1
        global_metrics["total_processing_time"] += processing_time

        logger.info(f"Moderation completed: allowed={result.allowed}, time={processing_time:.1f}ms")

        return result

    except Exception as e:
        global_metrics["failed_requests"] += 1
        logger.error(f"Moderation error: {e}", exc_info=True)

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": {
                    "code": "MODERATION_ERROR",
                    "message": f"コンテンツモデレーション処理に失敗しました: {str(e)}",
                    "details": None
                },
                "timestamp": datetime.now().isoformat()
            }
        )


@app.get("/api/health", response_model=LLMHealthCheck, tags=["Health"])
async def health_check() -> LLMHealthCheck:
    """
    ヘルスチェックエンドポイント

    LLMエンジンとシステムの健全性を確認します。

    Returns:
        ヘルスチェック結果
    """
    try:
        # LLMエンジンの健全性チェック
        llm_engine = get_llm_engine()
        llm_healthy = llm_engine.check_health()

        # キャッシュは未実装のため常にOK
        cache_healthy = True

        # ステータス判定
        if llm_healthy and cache_healthy:
            overall_status = "healthy"
        elif llm_healthy or cache_healthy:
            overall_status = "degraded"
        else:
            overall_status = "unhealthy"

        # 稼働時間計算
        uptime = int(time.time() - APP_START_TIME)

        result = LLMHealthCheck(
            status=overall_status,
            checks={
                "llm": "ok" if llm_healthy else "error",
                "cache": "ok" if cache_healthy else "error",
                "database": None  # 未使用
            },
            version="1.0.0",
            uptime=uptime,
            timestamp=datetime.now().isoformat()
        )

        logger.info(f"Health check: {overall_status}")
        return result

    except Exception as e:
        logger.error(f"Health check error: {e}", exc_info=True)

        return LLMHealthCheck(
            status="unhealthy",
            checks={
                "llm": "error",
                "cache": "error",
                "database": None
            },
            version="1.0.0",
            uptime=int(time.time() - APP_START_TIME),
            timestamp=datetime.now().isoformat()
        )


@app.get("/api/metrics", response_model=LLMMetrics, tags=["Metrics"])
async def get_metrics() -> LLMMetrics:
    """
    メトリクスエンドポイント

    APIの使用統計・パフォーマンス指標を返します。

    Returns:
        メトリクス結果
    """
    try:
        total_requests = global_metrics["total_requests"]
        successful = global_metrics["successful_requests"]
        failed = global_metrics["failed_requests"]
        total_time = global_metrics["total_processing_time"]

        # 平均応答時間計算
        avg_time = total_time / successful if successful > 0 else 0

        # 簡易版（P95/P99は実装していないため同じ値）
        from src.api.types import MetricsRequests, MetricsPerformance

        result = LLMMetrics(
            requests=MetricsRequests(
                total=total_requests,
                successful=successful,
                failed=failed
            ),
            performance=MetricsPerformance(
                avgResponseTime=avg_time,
                p95ResponseTime=avg_time * 1.5,  # 簡易推定
                p99ResponseTime=avg_time * 2.0   # 簡易推定
            ),
            detections=global_metrics.get("violation_counts", {}),
            period="last_1h"  # 固定
        )

        logger.info(f"Metrics requested: {total_requests} total requests")
        return result

    except Exception as e:
        logger.error(f"Metrics error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"メトリクス取得エラー: {str(e)}"
        )


@app.exception_handler(Exception)
async def global_exception_handler(request, exc: Exception):
    """
    グローバル例外ハンドラ
    """
    logger.error(f"Unhandled exception: {exc}", exc_info=True)

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "code": "INTERNAL_ERROR",
                "message": "内部サーバーエラーが発生しました",
                "details": str(exc)
            },
            "timestamp": datetime.now().isoformat()
        }
    )


# アプリケーション起動イベント
@app.on_event("startup")
async def startup_event():
    """
    アプリケーション起動時の初期化処理
    """
    logger.info("=" * 60)
    logger.info("LLM Moderation API starting up...")
    logger.info(f"Version: 1.0.0")
    logger.info(f"Model: Llama 3.2 8B")
    logger.info(f"Docs: http://localhost:8000/docs")
    logger.info("=" * 60)

    # LLMエンジンの初期化確認
    try:
        llm_engine = get_llm_engine()
        model_info = llm_engine.get_model_info()
        logger.info(f"LLM Engine initialized: {model_info.get('name', 'unknown')}")
    except Exception as e:
        logger.warning(f"LLM Engine initialization warning: {e}")


# アプリケーション終了イベント
@app.on_event("shutdown")
async def shutdown_event():
    """
    アプリケーション終了時のクリーンアップ処理
    """
    logger.info("=" * 60)
    logger.info("LLM Moderation API shutting down...")
    logger.info(f"Total requests processed: {global_metrics['total_requests']}")
    logger.info(f"Successful: {global_metrics['successful_requests']}")
    logger.info(f"Failed: {global_metrics['failed_requests']}")
    logger.info("=" * 60)


if __name__ == "__main__":
    import uvicorn

    # 開発用サーバー起動
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
