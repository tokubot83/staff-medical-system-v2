"""
LLM Engine - Ollama + Llama 3.2:3b統合エンジン

Ollamaを使ってLlama 3.2:3bモデルと通信し、
コンテンツモデレーションの推論を実行します。

【モデル選定】Option B採用 (2025/10/5決定)
- Llama 3.2:3b（法人SNS環境最適化）
- 処理速度2-3倍向上、精度85%（法人環境で十分）
"""

import json
import re
from typing import Dict, Any, Optional
import logging

# Ollama Pythonクライアント（インストール必要: pip install ollama）
try:
    import ollama
except ImportError:
    logging.warning("ollama package not installed. Please run: pip install ollama")
    ollama = None


logger = logging.getLogger(__name__)


class LLMEngine:
    """
    Llama 3.2:3b推論エンジン（Option B採用）
    """

    def __init__(
        self,
        model: str = "llama3.2:3b",  # 3bに変更（2025/10/5）
        default_temperature: float = 0.3,  # 一貫性重視
        host: str = "http://localhost:11434"
    ):
        """
        Args:
            model: 使用するモデル名（Ollama形式、デフォルト: llama3.2:3b）
            default_temperature: デフォルトの温度パラメータ（0.0-1.0）
            host: OllamaサーバーのURL
        """
        self.model = model
        self.default_temperature = default_temperature
        self.host = host

        if ollama is None:
            raise RuntimeError(
                "ollama package is not installed. "
                "Please install: pip install ollama"
            )

        # Ollamaクライアント初期化
        self.client = ollama.Client(host=host)

        logger.info(
            f"LLMEngine initialized: model={model}, "
            f"temperature={default_temperature}, host={host}"
        )

    def generate(
        self,
        prompt: str,
        temperature: Optional[float] = None,
        max_tokens: int = 1000,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Llama 3.2 8Bで推論を実行

        Args:
            prompt: プロンプトテキスト
            temperature: 温度パラメータ（Noneの場合はdefault_temperatureを使用）
            max_tokens: 最大トークン数
            **kwargs: その他のOllamaオプション

        Returns:
            Ollamaからのレスポンス辞書
            {
                'model': 'llama3.2:8b',
                'response': '生成されたテキスト',
                'done': True,
                'context': [...],
                'total_duration': 1234567890,
                'load_duration': 123456,
                'prompt_eval_duration': 234567,
                'eval_duration': 345678,
                ...
            }
        """
        try:
            temp = temperature if temperature is not None else self.default_temperature

            logger.debug(
                f"Generating with Ollama: model={self.model}, "
                f"temperature={temp}, max_tokens={max_tokens}"
            )

            response = self.client.generate(
                model=self.model,
                prompt=prompt,
                options={
                    'temperature': temp,
                    'num_predict': max_tokens,
                    'top_p': kwargs.get('top_p', 0.9),
                    'top_k': kwargs.get('top_k', 40),
                    **kwargs
                }
            )

            logger.debug(f"Ollama response received: {len(response.get('response', ''))} chars")

            return response

        except Exception as e:
            logger.error(f"LLM generation error: {e}", exc_info=True)
            raise RuntimeError(f"LLM generation failed: {e}")

    def extract_json(self, response_text: str) -> Dict[str, Any]:
        """
        LLMレスポンスからJSON部分を抽出してパース

        LLMが追加のテキストと共にJSONを返す場合に対応：
        - コードブロック（```json ... ```）の除去
        - JSON部分のみを抽出

        Args:
            response_text: LLMからの生テキストレスポンス

        Returns:
            パースされたJSON辞書

        Raises:
            ValueError: JSON抽出・パースに失敗した場合
        """
        try:
            # コードブロックマーカーを削除
            text = response_text.strip()

            # ```json または ``` で囲まれている場合
            if text.startswith('```json'):
                text = text[7:]
            elif text.startswith('```'):
                text = text[3:]

            if text.endswith('```'):
                text = text[:-3]

            text = text.strip()

            # JSON部分を検索（最初の { から最後の } まで）
            start = text.find('{')
            end = text.rfind('}') + 1

            if start == -1 or end == 0:
                raise ValueError("No JSON object found in response")

            json_text = text[start:end]

            # JSONパース
            parsed = json.loads(json_text)

            logger.debug(f"Successfully extracted JSON with {len(parsed)} keys")

            return parsed

        except json.JSONDecodeError as e:
            logger.error(f"JSON parse error: {e}")
            logger.error(f"Problematic text: {response_text[:500]}")
            raise ValueError(f"Failed to parse JSON from LLM response: {e}")

        except Exception as e:
            logger.error(f"JSON extraction error: {e}")
            raise ValueError(f"Failed to extract JSON: {e}")

    def extract_score(self, response_text: str) -> int:
        """
        LLMレスポンスから数値スコアを抽出

        建設性スコア等、単一の数値を返すプロンプト用

        Args:
            response_text: LLMからのレスポンス

        Returns:
            抽出されたスコア（0-100）

        Raises:
            ValueError: スコア抽出に失敗した場合
        """
        try:
            # 数値を検索（最初に見つかった整数）
            match = re.search(r'\b(\d+)\b', response_text)

            if not match:
                raise ValueError("No numeric score found in response")

            score = int(match.group(1))

            # 0-100の範囲に制限
            score = max(0, min(100, score))

            logger.debug(f"Extracted score: {score}")

            return score

        except Exception as e:
            logger.error(f"Score extraction error: {e}")
            raise ValueError(f"Failed to extract score: {e}")

    def check_health(self) -> bool:
        """
        Ollamaサーバーとモデルの健全性チェック

        Returns:
            True: 正常に動作している
            False: 問題がある
        """
        try:
            # シンプルなプロンプトで動作確認
            test_prompt = "こんにちは"
            response = self.generate(test_prompt, max_tokens=10)

            # レスポンスが返ってくればOK
            is_healthy = bool(response.get('response'))

            if is_healthy:
                logger.info("LLM health check: OK")
            else:
                logger.warning("LLM health check: No response received")

            return is_healthy

        except Exception as e:
            logger.error(f"LLM health check failed: {e}")
            return False

    def get_model_info(self) -> Dict[str, Any]:
        """
        使用中のモデル情報を取得

        Returns:
            モデル情報辞書
        """
        try:
            # Ollamaからモデル情報を取得
            models = self.client.list()

            # 使用中のモデルを検索
            current_model = next(
                (m for m in models.get('models', []) if m['name'] == self.model),
                None
            )

            if current_model:
                logger.info(f"Model info retrieved: {current_model.get('name')}")
                return current_model
            else:
                logger.warning(f"Model {self.model} not found in Ollama")
                return {'name': self.model, 'status': 'not_loaded'}

        except Exception as e:
            logger.error(f"Failed to get model info: {e}")
            return {'name': self.model, 'status': 'error', 'error': str(e)}


# シングルトンインスタンス（グローバル使用用）
_llm_engine_instance: Optional[LLMEngine] = None


def get_llm_engine(
    model: str = "llama3.2:8b",
    host: str = "http://localhost:11434"
) -> LLMEngine:
    """
    LLMEngineのシングルトンインスタンスを取得

    Args:
        model: モデル名
        host: OllamaホストURL

    Returns:
        LLMEngineインスタンス
    """
    global _llm_engine_instance

    if _llm_engine_instance is None:
        _llm_engine_instance = LLMEngine(model=model, host=host)

    return _llm_engine_instance
