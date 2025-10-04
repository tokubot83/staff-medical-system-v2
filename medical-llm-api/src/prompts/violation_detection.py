"""
違反検出プロンプトテンプレート

Llama 3.2 8Bで11種類の違反タイプを検出するための
プロンプトエンジニアリング
"""

from typing import Dict, Any


# 違反検出メインプロンプトテンプレート
VIOLATION_DETECTION_PROMPT = """あなたは医療法人のSNS投稿モデレーターです。
職員の投稿内容を分析し、11種類の違反タイプを検出してください。

【重要】医療現場特有の表現への配慮:
- 「この手技は厳しい」「夜勤は過酷」等は業務の難易度や労働環境の記述として正常と判定してください
- 「急性期病棟は大変」「救急対応は体力的にきつい」等も医療業務の特性として正常です
- 「○○医師の指示が不明確」等、個人名を含むが建設的な指摘は警告レベル（medium）と判定してください
- 患者名、個人を特定できる情報の記載は必ずprivacy_violationとして検出してください

【投稿内容】
{content}

【コンテキスト情報】
- 投稿タイプ: {post_type}
- 投稿者権限レベル: {author_level}
- 部署: {department}

【11種類の違反タイプ】
1. personal_attack（個人攻撃）: 特定個人への攻撃的表現
   例: 「○○さんは無能」「あの人はバカ」

2. defamation（誹謗中傷）: 根拠のない悪評、名誉毀損
   例: 「○○は嘘つき」「詐欺師」

3. harassment（ハラスメント）: パワハラ・セクハラ等の嫌がらせ
   例: 「辞めろ」「お前はクビだ」

4. discrimination（差別的表現）: 性別・年齢・国籍・容姿等による差別
   例: 「女だから」「若いくせに」「外国人は」

5. privacy_violation（プライバシー侵害）: 個人情報の不適切な記載
   例: 患者名、住所、電話番号、個人を特定できる情報

6. inappropriate_content（不適切なコンテンツ）: 職場に不適切な内容
   例: 性的な内容、暴力的な内容

7. threatening（脅迫的表現）: 脅迫・威嚇
   例: 「覚悟しろ」「ただじゃおかない」

8. hate_speech（ヘイトスピーチ）: 憎悪・敵意の表現
   例: 特定グループへの憎悪表現

9. misinformation（誤情報）: 虚偽情報・デマ
   例: 根拠のない噂、事実と異なる情報の拡散

10. spam（スパム）: 宣伝・広告
    例: 無関係な商品の宣伝

11. other（その他）: 上記に該当しない問題

【建設性スコア評価基準】
以下の要素を総合的に判断して0-100点で評価してください:
- 具体的な改善提案がある: +15点
- 協力的な姿勢: +10点
- 感謝の表現: +10点
- 個人攻撃: -20点
- 否定的表現のみ: -15点
- 非建設的な批判: -10点

【出力形式】
以下のJSON形式で回答してください（JSON以外の文章は不要）:
{{
  "violations": [
    {{
      "type": "personal_attack",
      "severity": "high",
      "description": "「バカ」という個人攻撃的な表現が含まれています",
      "extractedText": "バカ",
      "startIndex": 10,
      "endIndex": 12,
      "confidence": 92
    }}
  ],
  "constructiveScore": 25,
  "reasoning": "個人攻撃的な表現が含まれており、建設的な提案がありません。"
}}

違反がない場合:
{{
  "violations": [],
  "constructiveScore": 75,
  "reasoning": "建設的な改善提案です。業務の課題を適切に指摘しています。"
}}
"""


def create_violation_detection_prompt(
    content: str,
    post_type: str = 'improvement',
    author_level: int = 3,
    department: str = '看護部'
) -> str:
    """
    違反検出プロンプトを生成

    Args:
        content: チェック対象のテキスト
        post_type: 投稿タイプ
        author_level: 投稿者の権限レベル
        department: 部署名

    Returns:
        完成したプロンプト文字列
    """
    return VIOLATION_DETECTION_PROMPT.format(
        content=content,
        post_type=post_type,
        author_level=author_level,
        department=department
    )


# Few-shot Learning用のサンプルデータ
FEW_SHOT_EXAMPLES = [
    {
        "input": "夜勤のシフト調整方法を改善すべきです。現状は負担が大きいです。",
        "output": {
            "violations": [],
            "constructiveScore": 75,
            "reasoning": "建設的な改善提案です。業務負担の指摘は正常な表現です。"
        }
    },
    {
        "input": "○○さんはバカだから仕事ができない。",
        "output": {
            "violations": [
                {
                    "type": "personal_attack",
                    "severity": "high",
                    "description": "「バカ」という個人攻撃的な表現が含まれています",
                    "extractedText": "バカ",
                    "startIndex": 5,
                    "endIndex": 7,
                    "confidence": 95
                }
            ],
            "constructiveScore": 10,
            "reasoning": "特定個人への攻撃的な表現が含まれており、建設的な要素がありません。"
        }
    },
    {
        "input": "この手技は厳しいので、研修を充実させてほしい。",
        "output": {
            "violations": [],
            "constructiveScore": 80,
            "reasoning": "医療業務の難易度に関する正当な指摘と建設的な改善提案です。"
        }
    },
    {
        "input": "患者の田中太郎さん（80歳）の対応について相談したい。",
        "output": {
            "violations": [
                {
                    "type": "privacy_violation",
                    "severity": "critical",
                    "description": "患者の実名と年齢が記載されており、個人情報保護違反です",
                    "extractedText": "田中太郎さん（80歳）",
                    "startIndex": 3,
                    "endIndex": 17,
                    "confidence": 100
                }
            ],
            "constructiveScore": 40,
            "reasoning": "患者の個人情報が含まれています。匿名化が必要です。"
        }
    },
    {
        "input": "○○主任の指示が不明確で、スタッフが困っています。もっと具体的な指示をお願いしたい。",
        "output": {
            "violations": [
                {
                    "type": "personal_attack",
                    "severity": "medium",
                    "description": "特定個人を名指ししていますが、建設的な指摘も含まれています",
                    "extractedText": "○○主任の指示が不明確",
                    "startIndex": 0,
                    "endIndex": 12,
                    "confidence": 65
                }
            ],
            "constructiveScore": 60,
            "reasoning": "個人名の言及がありますが、改善提案も含まれており、一定の建設性があります。"
        }
    }
]


def create_few_shot_prompt(
    content: str,
    post_type: str = 'improvement',
    author_level: int = 3,
    department: str = '看護部',
    num_examples: int = 3
) -> str:
    """
    Few-shot Learningサンプルを含むプロンプトを生成

    Args:
        content: チェック対象のテキスト
        post_type: 投稿タイプ
        author_level: 投稿者の権限レベル
        department: 部署名
        num_examples: 使用するサンプル数（デフォルト3）

    Returns:
        Few-shotサンプルを含む完成したプロンプト
    """
    import random
    import json

    # ランダムにサンプルを選択
    examples = random.sample(
        FEW_SHOT_EXAMPLES,
        min(num_examples, len(FEW_SHOT_EXAMPLES))
    )

    # サンプルをテキスト化
    examples_text = "\n\n".join([
        f"【例{i+1}】\n投稿内容: {ex['input']}\n"
        f"判定結果:\n{json.dumps(ex['output'], ensure_ascii=False, indent=2)}"
        for i, ex in enumerate(examples)
    ])

    # メインプロンプトの前にサンプルを追加
    few_shot_prompt = f"""あなたは医療法人のSNS投稿モデレーターです。
以下の例を参考に、投稿内容を分析してください。

{examples_text}

---

それでは、以下の投稿を分析してください:

【投稿内容】
{content}

【コンテキスト情報】
- 投稿タイプ: {post_type}
- 投稿者権限レベル: {author_level}
- 部署: {department}

【出力形式】
上記の例と同じJSON形式で回答してください:
"""

    return few_shot_prompt


# 建設性スコア計算用プロンプト（簡易版）
CONSTRUCTIVE_SCORE_PROMPT = """以下の投稿の建設性スコアを0-100で評価してください。

評価基準:
- 具体的な改善提案 +15点
- 協力的な姿勢 +10点
- 感謝の表現 +10点
- 個人攻撃 -20点
- 否定的表現 -15点
- 非建設的な批判 -10点

投稿内容:
{content}

スコア（0-100の数値のみを返してください）:
"""


def create_constructive_score_prompt(content: str) -> str:
    """
    建設性スコア計算プロンプトを生成

    Args:
        content: チェック対象のテキスト

    Returns:
        プロンプト文字列
    """
    return CONSTRUCTIVE_SCORE_PROMPT.format(content=content)
