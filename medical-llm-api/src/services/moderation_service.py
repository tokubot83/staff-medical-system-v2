"""
Moderation Service - コンテンツモデレーションのコアロジック

LLMEngineと違反検出プロンプトを組み合わせて、
投稿内容の総合的なモデレーション判定を行います。
"""

import time
from datetime import datetime
from typing import List, Tuple, Optional
import logging

from src.api.types import (
    LLMModerationRequest,
    LLMModerationResult,
    LLMViolation,
    ModerationMetadata,
    ModerationContext,
    ModerationOptions,
)
from src.services.llm_engine import get_llm_engine
from src.prompts.violation_detection import create_violation_detection_prompt

logger = logging.getLogger(__name__)


class ModerationService:
    """
    コンテンツモデレーションサービス

    VoiceDrive MockLLMの判定ロジックを踏襲しつつ、
    Llama 3.2 8Bの高度な文脈理解を活用
    """

    def __init__(self):
        """
        サービス初期化
        """
        self.llm_engine = get_llm_engine()
        logger.info("ModerationService initialized")

    def moderate(
        self,
        content: str,
        context: Optional[ModerationContext] = None,
        options: Optional[ModerationOptions] = None
    ) -> LLMModerationResult:
        """
        コンテンツモデレーション実行

        Args:
            content: チェック対象テキスト
            context: コンテキスト情報
            options: オプション設定

        Returns:
            モデレーション結果
        """
        start_time = time.time()

        try:
            # デフォルト値設定
            if context is None:
                context = ModerationContext()
            if options is None:
                options = ModerationOptions()

            logger.info(
                f"Moderating content: {len(content)} chars, "
                f"type={context.postType}, dept={context.department}"
            )

            # 違反検出プロンプト生成
            prompt = create_violation_detection_prompt(
                content=content,
                post_type=context.postType or 'improvement',
                author_level=context.authorLevel or 3,
                department=context.department or '看護部'
            )

            # LLM推論実行
            llm_response = self.llm_engine.generate(prompt, temperature=0.3)

            # JSON抽出
            result_data = self.llm_engine.extract_json(llm_response['response'])

            # 違反リスト構築
            violations = [
                LLMViolation(**v)
                for v in result_data.get('violations', [])
            ]

            # 建設性スコア
            constructive_score = result_data.get('constructiveScore', 50)

            # 重大度計算（VoiceDrive MockLLMと同じロジック）
            severity = self._calculate_severity(violations, constructive_score)

            # 投稿可否判定
            allowed = self._calculate_allowed(severity, violations)

            # 信頼度スコア計算
            confidence = self._calculate_confidence(violations, content)

            # 修正提案生成（違反がある場合）
            suggested_edits = None
            if len(violations) > 0 and options.includeExplanation:
                suggested_edits = self._generate_suggested_edits(content, violations)

            # 説明文
            explanation = result_data.get('reasoning', '')
            if not options.includeExplanation:
                explanation = None

            # 処理時間計算
            processing_time = int((time.time() - start_time) * 1000)

            # 結果構築
            result = LLMModerationResult(
                allowed=allowed,
                severity=severity,
                confidence=confidence,
                violations=violations,
                explanation=explanation,
                suggestedEdits=suggested_edits,
                metadata=ModerationMetadata(
                    modelVersion="llama3.2:8b-v1.0",
                    processingTime=processing_time,
                    timestamp=datetime.now()
                )
            )

            logger.info(
                f"Moderation complete: allowed={allowed}, severity={severity}, "
                f"violations={len(violations)}, time={processing_time}ms"
            )

            return result

        except Exception as e:
            logger.error(f"Moderation error: {e}", exc_info=True)
            raise RuntimeError(f"モデレーション処理に失敗しました: {e}")

    def _calculate_severity(
        self,
        violations: List[LLMViolation],
        constructive_score: int
    ) -> str:
        """
        重大度を計算（VoiceDrive MockLLMと完全一致するロジック）

        Args:
            violations: 検出された違反リスト
            constructive_score: 建設性スコア（0-100）

        Returns:
            重大度（'none' | 'low' | 'medium' | 'high' | 'critical'）
        """
        # 違反なし + 高建設性 → none
        if len(violations) == 0 and constructive_score >= 60:
            return 'none'

        # 違反なし + 中建設性 → low
        if len(violations) == 0 and constructive_score >= 40:
            return 'low'

        # critical違反がある → critical
        has_critical = any(v.severity == 'critical' for v in violations)
        if has_critical:
            return 'critical'

        # high違反がある or 3件以上 → high
        has_high = any(v.severity == 'high' for v in violations)
        if has_high or len(violations) >= 3:
            return 'high'

        # medium違反がある or 2件以上 → medium
        has_medium = any(v.severity == 'medium' for v in violations)
        if has_medium or len(violations) >= 2:
            return 'medium'

        # それ以外 → low
        return 'low'

    def _calculate_allowed(
        self,
        severity: str,
        violations: List[LLMViolation]
    ) -> bool:
        """
        投稿可否を判定

        Args:
            severity: 重大度
            violations: 違反リスト

        Returns:
            True: 投稿可能, False: 投稿不可
        """
        # critical または high → 投稿不可
        if severity in ['critical', 'high']:
            return False

        # privacy_violation がある → 投稿不可（最重要）
        has_privacy_violation = any(
            v.type == 'privacy_violation' for v in violations
        )
        if has_privacy_violation:
            return False

        # それ以外 → 投稿可能（警告表示の可能性あり）
        return True

    def _calculate_confidence(
        self,
        violations: List[LLMViolation],
        content: str
    ) -> int:
        """
        信頼度スコアを計算（VoiceDrive MockLLMと同じロジック）

        Args:
            violations: 違反リスト
            content: 投稿内容

        Returns:
            信頼度スコア（0-100）
        """
        if len(violations) == 0:
            # 違反なしの場合、テキストが長いほど信頼度が高い
            base_confidence = 70
            length_bonus = min(25, (len(content) // 50) * 5)
            return base_confidence + length_bonus

        # 違反ありの場合、違反の平均信頼度
        avg_confidence = sum(v.confidence for v in violations) / len(violations)
        return round(avg_confidence)

    def _generate_suggested_edits(
        self,
        content: str,
        violations: List[LLMViolation]
    ) -> List[str]:
        """
        修正提案を生成（簡易版）

        本来はLLMで生成すべきだが、Week 5では簡易的な置き換え辞書を使用

        Args:
            content: 元の投稿内容
            violations: 違反リスト

        Returns:
            修正提案リスト（最大3件）
        """
        # 簡易置き換え辞書（VoiceDrive MockLLMと同様）
        replacements = {
            'バカ': '改善の余地がある',
            '馬鹿': '検討が必要',
            'アホ': '再考が必要',
            '無能': '能力向上の機会がある',
            '役立たず': 'スキルアップが期待される',
            '使えない': '改善が必要',
            'ダメ人間': '成長の余地がある',
            'クズ': '改善が必要な点がある',
        }

        suggestions = []

        for violation in violations:
            if violation.extractedText and violation.extractedText in replacements:
                replacement = replacements[violation.extractedText]
                new_content = content.replace(violation.extractedText, replacement)

                if new_content not in suggestions and new_content != content:
                    suggestions.append(new_content)

        # 最大3つの提案
        return suggestions[:3] if suggestions else None


# シングルトンインスタンス
_moderation_service_instance: Optional[ModerationService] = None


def get_moderation_service() -> ModerationService:
    """
    ModerationServiceのシングルトンインスタンスを取得

    Returns:
        ModerationServiceインスタンス
    """
    global _moderation_service_instance

    if _moderation_service_instance is None:
        _moderation_service_instance = ModerationService()

    return _moderation_service_instance
