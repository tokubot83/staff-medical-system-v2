/**
 * サポート面談（フィードバック）動的生成サービス
 * 人事評価後のフィードバック面談に特化（評価通知から2週間以内）
 * 評価システムと連携して最新の評価データを動的に組み込み
 */

import {
  BankGenerationParams,
  BankQuestion,
  BankSection,
  GeneratedBankSheet,
  InterviewType,
  QuestionType
} from '../types';

// 評価データ型定義
export interface EvaluationData {
  evaluationId: string;
  evaluationPeriod: string;
  evaluationDate: Date;
  notificationDate: Date;
  
  // 評価結果
  overallRating: 'S' | 'A' | 'B' | 'C' | 'D';
  facilityRating: number;  // 施設内評価（1-5）
  corporateRating: number; // 法人内評価（1-5）
  
  // 詳細評価
  performanceScore: number;     // 業績評価
  competencyScore: number;      // 行動評価
  skillScore: number;           // 能力評価
  
  // 評価コメント
  strengthComments: string[];   // 強み
  improvementComments: string[]; // 改善点
  evaluatorComments: string;    // 評価者総評
  
  // 処遇への影響
  salaryAdjustment: number;    // 昇給率
  bonusCoefficient: number;    // 賞与係数
  promotionRecommendation: boolean; // 昇進推薦
}

// フィードバック面談固有のパラメータ
export interface FeedbackSupportParams extends BankGenerationParams {
  evaluationData: EvaluationData;
  feedbackType: 'regular' | 'promotion' | 'improvement' | 'appeal';
  hasAppealIntent?: boolean;    // 異議申し立て意向
  daysSinceNotification: number; // 通知からの経過日数
  previousRating?: string;       // 前回評価
  ratingTrend?: 'up' | 'same' | 'down'; // 評価推移
}

// フィードバック面談の質問テンプレート
const FEEDBACK_QUESTION_TEMPLATES = {
  // 導入・評価結果確認
  introduction: [
    {
      id: 'feedback_intro_1',
      text: '評価結果通知書は確認いただけましたか？',
      type: 'hybrid' as QuestionType,
      category: 'feedback',
      tags: ['導入', '確認'],
      isRequired: true,
      scaleLabel: '理解度（1:不明 → 5:十分理解）',
      textLabel: '不明な点や質問',
      textPlaceholder: '評価基準、評価プロセス、結果の見方など...'
    },
    {
      id: 'feedback_intro_2',
      text: '総合評価「{overallRating}」に対する率直な感想をお聞かせください',
      type: 'hybrid' as QuestionType,
      category: 'feedback',
      tags: ['評価結果', '感想'],
      isRequired: true,
      scaleLabel: '納得度（1:納得できない → 5:納得）',
      textLabel: '感想・意見',
      textPlaceholder: '期待との差、予想との違い、感じたことなど...',
      isDynamic: true // 動的に値を挿入
    }
  ],

  // 評価詳細の確認と理解
  evaluation_details: [
    {
      id: 'detail_1',
      text: '業績評価（{performanceScore}点）について、具体的な評価ポイントを説明します',
      type: 'text' as QuestionType,
      category: 'evaluation_detail',
      tags: ['業績評価', '説明'],
      isRequired: false,
      placeholder: '目標達成度、業務の質、生産性などの観点から...',
      isDynamic: true
    },
    {
      id: 'detail_2',
      text: '行動評価（{competencyScore}点）の内訳と評価理由',
      type: 'text' as QuestionType,
      category: 'evaluation_detail',
      tags: ['行動評価', '説明'],
      isRequired: false,
      placeholder: 'チームワーク、コミュニケーション、積極性などから...',
      isDynamic: true
    },
    {
      id: 'detail_3',
      text: '能力評価（{skillScore}点）の評価基準と今後の期待',
      type: 'text' as QuestionType,
      category: 'evaluation_detail',
      tags: ['能力評価', '説明'],
      isRequired: false,
      placeholder: '専門知識、技術力、問題解決能力などの観点から...',
      isDynamic: true
    },
    {
      id: 'detail_4',
      text: '評価結果に対する疑問点や不明な点はありますか？',
      type: 'text' as QuestionType,
      category: 'evaluation_detail',
      tags: ['質疑', '確認'],
      isRequired: true,
      placeholder: '評価基準、評価方法、具体例などについて...'
    }
  ],

  // 強みと改善点のフィードバック
  strengths_improvements: [
    {
      id: 'strength_1',
      text: '今期特に評価された強み：{strengthComments}',
      type: 'hybrid' as QuestionType,
      category: 'strengths',
      tags: ['強み', 'ポジティブフィードバック'],
      isRequired: false,
      scaleLabel: '自己認識（1:気づいていなかった → 5:認識していた）',
      textLabel: 'この強みをさらに活かす方法',
      textPlaceholder: '今後どのように強みを発揮していきたいか...',
      isDynamic: true
    },
    {
      id: 'improvement_1',
      text: '改善が期待される点：{improvementComments}',
      type: 'hybrid' as QuestionType,
      category: 'improvements',
      tags: ['改善点', '成長課題'],
      isRequired: true,
      scaleLabel: '改善意欲（1:困難 → 5:改善できる）',
      textLabel: '改善に向けた具体策',
      textPlaceholder: 'どのように改善していくか、必要なサポートは...',
      isDynamic: true
    },
    {
      id: 'gap_1',
      text: '自己評価と上司評価のギャップについて',
      type: 'text' as QuestionType,
      category: 'gap_analysis',
      tags: ['ギャップ', '認識差'],
      isRequired: false,
      placeholder: '自分では〇〇と思っていたが、評価は〇〇だった...'
    }
  ],

  // 処遇への反映説明
  compensation_impact: [
    {
      id: 'comp_1',
      text: '昇給率{salaryAdjustment}%、賞与係数{bonusCoefficient}への反映について',
      type: 'hybrid' as QuestionType,
      category: 'compensation',
      tags: ['処遇', '給与'],
      isRequired: false,
      scaleLabel: '納得度（1:不満 → 5:満足）',
      textLabel: '意見・要望',
      textPlaceholder: '処遇への反映について感じること...',
      isDynamic: true
    },
    {
      id: 'comp_2',
      text: '来期の処遇改善に向けて取り組みたいこと',
      type: 'text' as QuestionType,
      category: 'compensation',
      tags: ['目標', '処遇改善'],
      placeholder: '評価を上げるために注力したい点...'
    }
  ],

  // 昇進推薦の場合
  promotion_feedback: [
    {
      id: 'promo_1',
      text: '昇進推薦が決定しました。今後の抱負をお聞かせください',
      type: 'text' as QuestionType,
      category: 'promotion',
      tags: ['昇進', '抱負'],
      isRequired: true,
      placeholder: '新しい役職での目標、意気込みなど...'
    },
    {
      id: 'promo_2',
      text: '昇進に向けて準備が必要なことは？',
      type: 'checklist' as QuestionType,
      category: 'promotion',
      tags: ['準備', 'サポート'],
      options: [
        'マネジメント研修',
        '引き継ぎ準備',
        '新業務の学習',
        'チームビルディング',
        '経営知識の習得'
      ]
    }
  ],

  // 改善計画の場合（C/D評価）
  improvement_plan: [
    {
      id: 'improve_1',
      text: '改善が必要な理由と背景を一緒に確認しましょう',
      type: 'text' as QuestionType,
      category: 'improvement',
      tags: ['改善計画', '原因分析'],
      isRequired: true,
      placeholder: '評価が低かった要因、環境要因、個人要因など...'
    },
    {
      id: 'improve_2',
      text: '3ヶ月改善計画の重点項目',
      type: 'checklist' as QuestionType,
      category: 'improvement',
      tags: ['改善計画', '重点項目'],
      isRequired: true,
      options: [
        '基礎スキルの向上',
        '業務知識の習得',
        'コミュニケーション改善',
        '時間管理の改善',
        'チーム協調性の向上',
        'モチベーション回復'
      ]
    },
    {
      id: 'improve_3',
      text: '改善に向けて必要な組織からのサポート',
      type: 'text' as QuestionType,
      category: 'improvement',
      tags: ['サポート', '支援要請'],
      isRequired: true,
      placeholder: '研修、メンタリング、業務調整、環境改善など...'
    }
  ],

  // 異議申し立ての意向確認
  appeal_intent: [
    {
      id: 'appeal_1',
      text: '評価結果に対して異議申し立てを検討していますか？',
      type: 'hybrid' as QuestionType,
      category: 'appeal',
      tags: ['異議申し立て', '意向確認'],
      scaleLabel: '検討度（1:なし → 5:申し立て予定）',
      textLabel: '理由・根拠',
      textPlaceholder: '異議申し立てを検討する理由、具体的な根拠...'
    },
    {
      id: 'appeal_2',
      text: '異議申し立て制度の説明（期限：通知から2週間以内）',
      type: 'text' as QuestionType,
      category: 'appeal',
      tags: ['制度説明', '期限'],
      isReadOnly: true,
      defaultValue: '評価に疑義がある場合、通知日から2週間以内に人事部へ申し立てが可能です。第三者委員会による再評価が行われます。'
    }
  ],

  // 今後の目標設定
  future_goals: [
    {
      id: 'goal_1',
      text: '来期の評価目標（どの評価を目指すか）',
      type: 'hybrid' as QuestionType,
      category: 'goals',
      tags: ['目標設定', '来期'],
      isRequired: true,
      scaleLabel: '目標レベル（1:現状維持 → 5:大幅向上）',
      textLabel: '具体的な目標',
      textPlaceholder: '来期は〇評価を目指し、〇〇を重点的に...'
    },
    {
      id: 'goal_2',
      text: '目標達成のための具体的アクションプラン',
      type: 'text' as QuestionType,
      category: 'goals',
      tags: ['アクション', '計画'],
      isRequired: true,
      placeholder: '四半期ごとの目標、月次の取り組みなど...'
    },
    {
      id: 'goal_3',
      text: '定期的な進捗確認の方法',
      type: 'checklist' as QuestionType,
      category: 'goals',
      tags: ['進捗管理', 'フォロー'],
      options: [
        '月次1on1面談',
        '四半期レビュー',
        '目標管理シート活用',
        'メンター制度活用',
        '自己評価の定期実施'
      ]
    }
  ]
};

/**
 * フィードバック面談シート生成クラス
 */
export class FeedbackSupportGenerator {
  
  /**
   * 予約情報と評価データから面談シートを生成
   */
  static async generateFromReservation(
    reservation: any,
    staffProfile: any
  ): Promise<GeneratedBankSheet> {
    // 評価データを取得（実際は評価システムAPIから取得）
    const evaluationData = await this.fetchEvaluationData(staffProfile.staffId);
    
    // 通知からの経過日数を計算
    const daysSinceNotification = this.calculateDaysSince(evaluationData.notificationDate);
    
    // 2週間以内チェック
    if (daysSinceNotification > 14) {
      console.warn('評価通知から2週間を経過しています。異議申し立て期限が過ぎている可能性があります。');
    }
    
    // パラメータ構築
    const params: FeedbackSupportParams = {
      interviewType: 'support' as InterviewType,
      duration: reservation.duration || 30,
      staffLevel: staffProfile.experienceLevel,
      jobRole: staffProfile.profession,
      facilityType: staffProfile.facility,
      evaluationData,
      feedbackType: this.determineFeedbackType(evaluationData),
      hasAppealIntent: reservation.hasAppealIntent || false,
      daysSinceNotification,
      previousRating: staffProfile.previousEvaluation?.overallRating,
      ratingTrend: this.calculateRatingTrend(
        staffProfile.previousEvaluation?.overallRating,
        evaluationData.overallRating
      )
    };

    return this.generate(params);
  }

  /**
   * フィードバック面談シートを生成
   */
  static generate(params: FeedbackSupportParams): GeneratedBankSheet {
    const sections: BankSection[] = [];
    
    // 1. 導入・評価結果確認セクション（5-7分）
    sections.push(this.createIntroductionSection(params));
    
    // 2. 評価詳細説明セクション（8-10分）
    sections.push(this.createEvaluationDetailSection(params));
    
    // 3. 強み・改善点フィードバックセクション（8-10分）
    sections.push(this.createFeedbackSection(params));
    
    // 4. 処遇・キャリア相談セクション（5-8分）
    if (params.feedbackType === 'promotion') {
      sections.push(this.createPromotionSection(params));
    } else if (params.feedbackType === 'improvement') {
      sections.push(this.createImprovementPlanSection(params));
    } else {
      sections.push(this.createCompensationSection(params));
    }
    
    // 5. 今後の目標設定セクション（5-7分）
    sections.push(this.createGoalSettingSection(params));
    
    // 6. クロージングセクション（2-3分）
    sections.push(this.createClosingSection(params));

    // 異議申し立て意向がある場合は追加セクション
    if (params.hasAppealIntent) {
      sections.splice(5, 0, this.createAppealSection(params));
    }

    // 時間配分を調整
    const adjustedSections = this.adjustTimeAllocation(sections, params.duration);

    return {
      id: `feedback_support_${Date.now()}`,
      title: this.generateTitle(params),
      type: 'support' as InterviewType,
      subType: 'feedback',
      duration: params.duration,
      sections: adjustedSections,
      totalQuestions: adjustedSections.reduce((sum, s) => sum + s.questions.length, 0),
      generatedAt: new Date(),
      metadata: {
        evaluationId: params.evaluationData.evaluationId,
        overallRating: params.evaluationData.overallRating,
        feedbackType: params.feedbackType,
        daysSinceNotification: params.daysSinceNotification,
        ratingTrend: params.ratingTrend
      }
    };
  }

  /**
   * 導入・評価結果確認セクション
   */
  private static createIntroductionSection(params: FeedbackSupportParams): BankSection {
    const questions = FEEDBACK_QUESTION_TEMPLATES.introduction.map(q => 
      this.injectEvaluationData(q, params.evaluationData)
    );

    // 期限が迫っている場合の注意喚起
    if (params.daysSinceNotification >= 10) {
      questions.push({
        id: 'intro_deadline',
        text: `【重要】評価通知から${params.daysSinceNotification}日経過しています。異議申し立て期限は残り${14 - params.daysSinceNotification}日です`,
        type: 'text' as QuestionType,
        category: 'feedback',
        tags: ['期限', '注意'],
        isReadOnly: true,
        defaultValue: '異議申し立てを検討される場合は、早めに人事部へご相談ください。'
      });
    }

    return {
      id: 'introduction',
      title: '導入・評価結果の確認',
      description: '評価結果の理解度と初期反応の確認',
      duration: params.duration >= 45 ? 7 : 5,
      questions,
      order: 1
    };
  }

  /**
   * 評価詳細説明セクション
   */
  private static createEvaluationDetailSection(params: FeedbackSupportParams): BankSection {
    const questions = FEEDBACK_QUESTION_TEMPLATES.evaluation_details.map(q =>
      this.injectEvaluationData(q, params.evaluationData)
    );

    // 評価推移の説明を追加
    if (params.ratingTrend) {
      const trendText = {
        up: '前回から向上しています。',
        same: '前回と同じ評価です。',
        down: '前回から低下しています。'
      };
      
      questions.push({
        id: 'detail_trend',
        text: `評価推移：${params.previousRating || '―'} → ${params.evaluationData.overallRating}（${trendText[params.ratingTrend]}）`,
        type: 'hybrid' as QuestionType,
        category: 'evaluation_detail',
        tags: ['推移', '変化'],
        scaleLabel: '納得度（1:納得できない → 5:納得）',
        textLabel: '推移についての感想',
        textPlaceholder: '評価の変化について感じること...'
      });
    }

    return {
      id: 'evaluation_details',
      title: '評価詳細の説明と理解',
      description: '各評価項目の詳細説明と質疑応答',
      duration: params.duration >= 45 ? 10 : 8,
      questions,
      order: 2
    };
  }

  /**
   * 強み・改善点フィードバックセクション
   */
  private static createFeedbackSection(params: FeedbackSupportParams): BankSection {
    const questions = FEEDBACK_QUESTION_TEMPLATES.strengths_improvements.map(q =>
      this.injectEvaluationData(q, params.evaluationData)
    );

    // 評価者コメントを追加
    if (params.evaluationData.evaluatorComments) {
      questions.push({
        id: 'feedback_evaluator',
        text: '評価者からの総評',
        type: 'text' as QuestionType,
        category: 'feedback',
        tags: ['総評', 'コメント'],
        isReadOnly: true,
        defaultValue: params.evaluationData.evaluatorComments
      });
    }

    return {
      id: 'feedback',
      title: '強みと改善点のフィードバック',
      description: 'ポジティブフィードバックと成長課題の共有',
      duration: params.duration >= 45 ? 10 : 8,
      questions,
      order: 3
    };
  }

  /**
   * 昇進フィードバックセクション
   */
  private static createPromotionSection(params: FeedbackSupportParams): BankSection {
    return {
      id: 'promotion',
      title: '昇進推薦のフィードバック',
      description: '昇進に向けた準備と期待',
      duration: params.duration >= 45 ? 8 : 5,
      questions: FEEDBACK_QUESTION_TEMPLATES.promotion_feedback,
      order: 4
    };
  }

  /**
   * 改善計画セクション
   */
  private static createImprovementPlanSection(params: FeedbackSupportParams): BankSection {
    const questions = [...FEEDBACK_QUESTION_TEMPLATES.improvement_plan];
    
    // 具体的な改善目標を追加
    questions.push({
      id: 'improve_target',
      text: '次回評価での目標レベル',
      type: 'hybrid' as QuestionType,
      category: 'improvement',
      tags: ['目標', '改善'],
      isRequired: true,
      scaleLabel: '目標（1:C維持 → 5:A以上）',
      textLabel: '達成計画',
      textPlaceholder: '次回はB評価以上を目指し、〇〇を改善...'
    });

    return {
      id: 'improvement_plan',
      title: '改善計画の策定',
      description: '評価改善に向けた具体的計画',
      duration: params.duration >= 45 ? 8 : 5,
      questions,
      order: 4
    };
  }

  /**
   * 処遇説明セクション
   */
  private static createCompensationSection(params: FeedbackSupportParams): BankSection {
    const questions = FEEDBACK_QUESTION_TEMPLATES.compensation_impact.map(q =>
      this.injectEvaluationData(q, params.evaluationData)
    );

    return {
      id: 'compensation',
      title: '処遇への反映説明',
      description: '評価結果の処遇への影響',
      duration: params.duration >= 45 ? 8 : 5,
      questions,
      order: 4
    };
  }

  /**
   * 異議申し立てセクション
   */
  private static createAppealSection(params: FeedbackSupportParams): BankSection {
    const questions = [...FEEDBACK_QUESTION_TEMPLATES.appeal_intent];
    
    // 残り日数の計算と追加
    const remainingDays = 14 - params.daysSinceNotification;
    if (remainingDays > 0) {
      questions.push({
        id: 'appeal_deadline',
        text: `異議申し立て期限まで残り${remainingDays}日です`,
        type: 'text' as QuestionType,
        category: 'appeal',
        tags: ['期限', '手続き'],
        isReadOnly: true,
        defaultValue: '申し立てを行う場合は、具体的な根拠資料を準備の上、人事部へ申請してください。'
      });
    }

    return {
      id: 'appeal',
      title: '異議申し立ての検討',
      description: '評価への異議申し立て制度の説明',
      duration: 5,
      questions,
      order: 5
    };
  }

  /**
   * 目標設定セクション
   */
  private static createGoalSettingSection(params: FeedbackSupportParams): BankSection {
    const questions = [...FEEDBACK_QUESTION_TEMPLATES.future_goals];
    
    // 現在の評価に基づく推奨目標を追加
    const recommendedGoal = this.getRecommendedGoal(params.evaluationData.overallRating);
    questions.unshift({
      id: 'goal_recommendation',
      text: `推奨目標：${recommendedGoal}`,
      type: 'text' as QuestionType,
      category: 'goals',
      tags: ['推奨', '目標'],
      isReadOnly: true,
      defaultValue: recommendedGoal
    });

    return {
      id: 'goal_setting',
      title: '今後の目標設定',
      description: '来期に向けた目標と行動計画',
      duration: params.duration >= 45 ? 7 : 5,
      questions,
      order: 5
    };
  }

  /**
   * クロージングセクション
   */
  private static createClosingSection(params: FeedbackSupportParams): BankSection {
    return {
      id: 'closing',
      title: 'まとめと次回予定',
      description: '面談のまとめと今後のフォローアップ',
      duration: params.duration >= 45 ? 3 : 2,
      questions: [
        {
          id: 'close_1',
          text: '本日のフィードバックで明確になったこと',
          type: 'text' as QuestionType,
          category: 'closing',
          tags: ['まとめ', '確認'],
          isRequired: true,
          placeholder: '理解できたこと、今後の取り組み、支援内容など...'
        },
        {
          id: 'close_2',
          text: '追加で確認したいことや相談したいこと',
          type: 'text' as QuestionType,
          category: 'closing',
          tags: ['追加相談', '質問'],
          placeholder: '評価詳細、キャリア相談、その他...'
        },
        {
          id: 'close_3',
          text: '次回フォローアップ面談の予定',
          type: 'text' as QuestionType,
          category: 'closing',
          tags: ['次回', 'フォロー'],
          isRequired: true,
          placeholder: '〇月〇日、進捗確認と追加サポート...'
        }
      ],
      order: 6
    };
  }

  /**
   * 評価データを質問に注入
   */
  private static injectEvaluationData(
    question: BankQuestion,
    evaluationData: EvaluationData
  ): BankQuestion {
    if (!question.isDynamic) return question;

    let text = question.text;
    let textLabel = question.textLabel || '';
    let defaultValue = question.defaultValue || '';

    // プレースホルダーを実際の値に置換
    text = text.replace('{overallRating}', evaluationData.overallRating);
    text = text.replace('{performanceScore}', evaluationData.performanceScore.toString());
    text = text.replace('{competencyScore}', evaluationData.competencyScore.toString());
    text = text.replace('{skillScore}', evaluationData.skillScore.toString());
    text = text.replace('{salaryAdjustment}', evaluationData.salaryAdjustment.toString());
    text = text.replace('{bonusCoefficient}', evaluationData.bonusCoefficient.toString());
    text = text.replace('{strengthComments}', evaluationData.strengthComments.join('、'));
    text = text.replace('{improvementComments}', evaluationData.improvementComments.join('、'));

    return {
      ...question,
      text,
      textLabel,
      defaultValue
    };
  }

  /**
   * 評価データを取得（実際はAPIから）
   */
  private static async fetchEvaluationData(staffId: string): Promise<EvaluationData> {
    // 実際の実装では評価システムAPIから取得
    // ここではモックデータを返す
    return {
      evaluationId: 'EVAL-2024-001',
      evaluationPeriod: '2024年度上期',
      evaluationDate: new Date('2024-09-30'),
      notificationDate: new Date('2024-10-07'),
      overallRating: 'B',
      facilityRating: 3.5,
      corporateRating: 3.2,
      performanceScore: 3.4,
      competencyScore: 3.6,
      skillScore: 3.3,
      strengthComments: [
        'チームワークへの貢献',
        '患者対応の丁寧さ',
        '学習意欲の高さ'
      ],
      improvementComments: [
        'タイムマネジメント',
        '優先順位の判断',
        '報告・連絡・相談'
      ],
      evaluatorComments: '全体的に安定した業務遂行ができています。次期はリーダーシップの発揮を期待します。',
      salaryAdjustment: 2.0,
      bonusCoefficient: 1.0,
      promotionRecommendation: false
    };
  }

  /**
   * 通知からの経過日数を計算
   */
  private static calculateDaysSince(notificationDate: Date): number {
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - notificationDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * フィードバックタイプを判定
   */
  private static determineFeedbackType(evaluationData: EvaluationData): 'regular' | 'promotion' | 'improvement' | 'appeal' {
    if (evaluationData.promotionRecommendation) return 'promotion';
    if (evaluationData.overallRating === 'C' || evaluationData.overallRating === 'D') return 'improvement';
    return 'regular';
  }

  /**
   * 評価推移を計算
   */
  private static calculateRatingTrend(
    previousRating?: string,
    currentRating?: string
  ): 'up' | 'same' | 'down' | undefined {
    if (!previousRating || !currentRating) return undefined;
    
    const ratingOrder = ['D', 'C', 'B', 'A', 'S'];
    const prevIndex = ratingOrder.indexOf(previousRating);
    const currIndex = ratingOrder.indexOf(currentRating);
    
    if (currIndex > prevIndex) return 'up';
    if (currIndex < prevIndex) return 'down';
    return 'same';
  }

  /**
   * 推奨目標を取得
   */
  private static getRecommendedGoal(rating: string): string {
    const goals: Record<string, string> = {
      'S': '現在の高いパフォーマンスを維持し、後進の育成やイノベーションに貢献',
      'A': 'S評価を目指し、組織への更なる貢献と専門性の深化',
      'B': 'A評価を目指し、強みを伸ばしつつ改善点を克服',
      'C': 'B評価を目指し、基礎スキルの向上と安定した業務遂行',
      'D': 'C評価を目指し、基本業務の習得と改善計画の着実な実行'
    };
    return goals[rating] || 'パフォーマンスの向上と成長';
  }

  /**
   * 時間配分の調整
   */
  private static adjustTimeAllocation(
    sections: BankSection[],
    totalDuration: number
  ): BankSection[] {
    const currentTotal = sections.reduce((sum, s) => sum + s.duration, 0);
    const ratio = totalDuration / currentTotal;

    return sections.map(section => ({
      ...section,
      duration: Math.round(section.duration * ratio)
    }));
  }

  /**
   * タイトル生成
   */
  private static generateTitle(params: FeedbackSupportParams): string {
    const typeLabel = {
      regular: '評価フィードバック',
      promotion: '昇進推薦フィードバック',
      improvement: '改善計画フィードバック',
      appeal: '評価確認'
    };
    
    const urgencyLabel = params.daysSinceNotification >= 10 ? '【期限注意】' : '';
    return `${urgencyLabel}${typeLabel[params.feedbackType]}面談（${params.duration}分）- ${params.evaluationData.overallRating}評価`;
  }
}