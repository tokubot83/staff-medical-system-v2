/**
 * サポート面談（キャリア系）動的生成サービス
 * キャリアパス、スキル開発、昇進・異動相談に特化した面談シート生成
 */

import {
  BankGenerationParams,
  BankQuestion,
  BankSection,
  GeneratedBankSheet,
  InterviewType,
  QuestionType
} from '../types';

// キャリア相談のサブカテゴリ
export type CareerConsultationType = 
  | 'career_path'        // キャリアパス相談
  | 'skill_development'  // スキル開発・資格取得
  | 'promotion'          // 昇進・昇格相談
  | 'transfer'           // 異動・転勤相談
  | 'work_style'         // 働き方改革
  | 'career_change';     // キャリアチェンジ

// キャリア相談固有のパラメータ
export interface CareerSupportParams extends BankGenerationParams {
  consultationType: CareerConsultationType;
  currentPosition?: string;
  targetPosition?: string;
  yearsOfExperience?: number;
  hasManagementExperience?: boolean;
  desiredSkills?: string[];
  careerGoals?: string;
  urgency?: 'low' | 'medium' | 'high';
}

// キャリア面談の質問テンプレート
const CAREER_QUESTION_TEMPLATES = {
  // 共通の導入質問
  introduction: [
    {
      id: 'career_intro_1',
      text: '本日のキャリア相談の主な目的を教えてください',
      type: 'hybrid' as QuestionType,
      category: 'career_consultation',
      tags: ['導入', 'キャリア', '目的確認'],
      isRequired: true,
      scaleLabel: '相談の明確度（1:曖昧 → 5:明確）',
      textLabel: '具体的な相談内容',
      textPlaceholder: '今回相談したいキャリアに関する内容を具体的に...'
    },
    {
      id: 'career_intro_2',
      text: '現在の仕事への満足度と、その理由を教えてください',
      type: 'hybrid' as QuestionType,
      category: 'career_consultation',
      tags: ['現状確認', '満足度'],
      isRequired: true,
      scaleLabel: '満足度（1:不満 → 5:満足）',
      textLabel: '満足・不満の理由',
      textPlaceholder: '現在の業務で満足している点、改善したい点など...'
    }
  ],

  // キャリアパス相談専用質問
  career_path: [
    {
      id: 'path_1',
      text: '5年後、10年後のキャリアビジョンを教えてください',
      type: 'hybrid' as QuestionType,
      category: 'career_path',
      tags: ['将来ビジョン', '長期目標'],
      isRequired: true,
      scaleLabel: 'ビジョンの明確度（1:不明確 → 5:明確）',
      textLabel: '具体的なキャリアビジョン',
      textPlaceholder: '5年後：〇〇として、10年後：〇〇を目指したい...'
    },
    {
      id: 'path_2',
      text: '理想のキャリアパスに向けて、現在不足していると感じるスキルや経験は？',
      type: 'text' as QuestionType,
      category: 'career_path',
      tags: ['スキルギャップ', '成長課題'],
      isRequired: true,
      placeholder: '例：マネジメント経験、専門資格、語学力など...'
    },
    {
      id: 'path_3',
      text: 'ロールモデルとなる先輩や目標とする人物はいますか？',
      type: 'hybrid' as QuestionType,
      category: 'career_path',
      tags: ['ロールモデル', '目標人物'],
      scaleLabel: '明確度（1:いない → 5:明確にいる）',
      textLabel: '具体的な人物と理由',
      textPlaceholder: '〇〇さんのような〇〇になりたい。理由は...'
    },
    {
      id: 'path_4',
      text: '当院でのキャリアパスについて、どの程度理解していますか？',
      type: 'hybrid' as QuestionType,
      category: 'career_path',
      tags: ['制度理解', 'キャリアパス'],
      isRequired: true,
      scaleLabel: '理解度（1:不明 → 5:十分理解）',
      textLabel: '理解している内容・不明な点',
      textPlaceholder: '昇進の条件、必要な経験、評価基準など...'
    }
  ],

  // スキル開発相談専用質問
  skill_development: [
    {
      id: 'skill_1',
      text: '現在取得を検討している資格・スキルはありますか？',
      type: 'hybrid' as QuestionType,
      category: 'skill_development',
      tags: ['資格取得', 'スキル開発'],
      isRequired: true,
      scaleLabel: '具体性（1:漠然 → 5:具体的）',
      textLabel: '目標とする資格・スキル',
      textPlaceholder: '認定看護師、専門資格、語学、ITスキルなど...'
    },
    {
      id: 'skill_2',
      text: 'スキル開発のための学習時間は確保できていますか？',
      type: 'hybrid' as QuestionType,
      category: 'skill_development',
      tags: ['学習時間', 'ワークライフバランス'],
      scaleLabel: '確保度（1:困難 → 5:十分）',
      textLabel: '学習時間の確保方法',
      textPlaceholder: '週〇時間程度、〇〇の時間を使って...'
    },
    {
      id: 'skill_3',
      text: '組織からどのような支援があれば、スキル開発が進められますか？',
      type: 'checklist' as QuestionType,
      category: 'skill_development',
      tags: ['支援ニーズ', '組織支援'],
      isRequired: true,
      options: [
        '研修費用の補助',
        '勤務時間内の学習時間確保',
        '外部研修への参加許可',
        'メンター・指導者の配置',
        '実践機会の提供',
        '資格手当の充実',
        'キャリア相談の定期実施'
      ]
    }
  ],

  // 昇進・昇格相談専用質問
  promotion: [
    {
      id: 'promo_1',
      text: '昇進・昇格を目指す理由と目標時期を教えてください',
      type: 'hybrid' as QuestionType,
      category: 'promotion',
      tags: ['昇進意欲', '目標設定'],
      isRequired: true,
      scaleLabel: '意欲度（1:低い → 5:高い）',
      textLabel: '理由と目標時期',
      textPlaceholder: '〇年以内に〇〇職を目指したい。理由は...'
    },
    {
      id: 'promo_2',
      text: '管理職・リーダー業務への適性をどう自己評価しますか？',
      type: 'hybrid' as QuestionType,
      category: 'promotion',
      tags: ['自己評価', 'リーダーシップ'],
      scaleLabel: '適性（1:不安 → 5:自信あり）',
      textLabel: '強みと課題',
      textPlaceholder: '強み：〇〇、課題：〇〇の経験不足...'
    },
    {
      id: 'promo_3',
      text: '昇進に必要と考える経験・スキルの習得計画は？',
      type: 'text' as QuestionType,
      category: 'promotion',
      tags: ['成長計画', 'スキル習得'],
      isRequired: true,
      placeholder: '今後〇ヶ月で〇〇を経験し、〇〇スキルを身につける...'
    }
  ],

  // 異動・転勤相談専用質問
  transfer: [
    {
      id: 'trans_1',
      text: '希望する部署・施設と、その理由を教えてください',
      type: 'hybrid' as QuestionType,
      category: 'transfer',
      tags: ['異動希望', '動機'],
      isRequired: true,
      scaleLabel: '希望度（1:検討中 → 5:強く希望）',
      textLabel: '希望先と理由',
      textPlaceholder: '〇〇部署/施設を希望。理由は...'
    },
    {
      id: 'trans_2',
      text: '異動・転勤に伴う生活面の準備状況は？',
      type: 'hybrid' as QuestionType,
      category: 'transfer',
      tags: ['生活準備', '家族事情'],
      scaleLabel: '準備度（1:未準備 → 5:準備完了）',
      textLabel: '具体的な状況',
      textPlaceholder: '家族の同意、住居、通勤手段など...'
    },
    {
      id: 'trans_3',
      text: '異動先で活かしたい経験・貢献したいことは？',
      type: 'text' as QuestionType,
      category: 'transfer',
      tags: ['強み活用', '貢献意欲'],
      isRequired: true,
      placeholder: '現在の〇〇経験を活かして、〇〇に貢献したい...'
    }
  ],

  // アクションプラン共通質問
  action_plan: [
    {
      id: 'action_1',
      text: '今後3ヶ月間の具体的な行動計画を立てましょう',
      type: 'text' as QuestionType,
      category: 'action_plan',
      tags: ['行動計画', '短期目標'],
      isRequired: true,
      placeholder: '1ヶ月目：〇〇、2ヶ月目：〇〇、3ヶ月目：〇〇'
    },
    {
      id: 'action_2',
      text: '組織からの具体的な支援事項を確認します',
      type: 'checklist' as QuestionType,
      category: 'action_plan',
      tags: ['支援確認', '合意事項'],
      isRequired: true,
      options: [
        '定期的なキャリア面談の実施',
        '研修・セミナーへの参加支援',
        'プロジェクト参加機会の提供',
        'メンタリング制度の活用',
        '他部署見学・研修の実施',
        'キャリア情報の提供'
      ]
    },
    {
      id: 'action_3',
      text: '次回面談日と確認事項',
      type: 'text' as QuestionType,
      category: 'action_plan',
      tags: ['フォローアップ', '次回予定'],
      isRequired: true,
      placeholder: '次回：〇月〇日、確認事項：〇〇の進捗'
    }
  ]
};

/**
 * キャリア系サポート面談シート生成クラス
 */
export class CareerSupportGenerator {
  
  /**
   * 予約情報からキャリア相談面談シートを生成
   */
  static generateFromReservation(
    reservation: any,
    staffProfile: any
  ): GeneratedBankSheet {
    // 予約情報からパラメータを抽出
    const params: CareerSupportParams = {
      interviewType: 'support' as InterviewType,
      consultationType: this.extractConsultationType(reservation),
      duration: reservation.duration || 30,
      staffLevel: staffProfile.experienceLevel,
      jobRole: staffProfile.profession,
      facilityType: staffProfile.facility,
      currentPosition: staffProfile.position,
      yearsOfExperience: staffProfile.yearsOfExperience,
      hasManagementExperience: staffProfile.hasManagementExperience,
      careerGoals: reservation.consultationDetails,
      urgency: reservation.urgency || 'medium'
    };

    return this.generate(params);
  }

  /**
   * キャリア相談面談シートを生成
   */
  static generate(params: CareerSupportParams): GeneratedBankSheet {
    const sections: BankSection[] = [];
    
    // 1. 導入セクション（5-7分）
    sections.push(this.createIntroductionSection(params));
    
    // 2. メインセクション（相談タイプ別）（15-20分）
    sections.push(this.createMainSection(params));
    
    // 3. キャリア開発計画セクション（8-10分）
    sections.push(this.createDevelopmentPlanSection(params));
    
    // 4. アクションプランセクション（5-8分）
    sections.push(this.createActionPlanSection(params));
    
    // 5. クロージングセクション（2-3分）
    sections.push(this.createClosingSection(params));

    // 時間配分を調整
    const adjustedSections = this.adjustTimeAllocation(sections, params.duration);

    return {
      id: `career_support_${Date.now()}`,
      title: this.generateTitle(params),
      type: 'support' as InterviewType,
      subType: params.consultationType,
      duration: params.duration,
      sections: adjustedSections,
      totalQuestions: adjustedSections.reduce((sum, s) => sum + s.questions.length, 0),
      generatedAt: new Date(),
      metadata: {
        consultationType: params.consultationType,
        urgency: params.urgency,
        staffLevel: params.staffLevel,
        targetPosition: params.targetPosition
      }
    };
  }

  /**
   * 導入セクション作成
   */
  private static createIntroductionSection(params: CareerSupportParams): BankSection {
    const questions: BankQuestion[] = [
      ...CAREER_QUESTION_TEMPLATES.introduction,
      {
        id: 'career_intro_3',
        text: 'このタイミングでキャリア相談を希望された背景は？',
        type: 'text' as QuestionType,
        category: 'career_consultation',
        tags: ['背景確認', 'タイミング'],
        isRequired: false,
        placeholder: '最近の出来事、気持ちの変化、外部要因など...'
      }
    ];

    // 緊急度が高い場合は追加質問
    if (params.urgency === 'high') {
      questions.push({
        id: 'career_intro_urgent',
        text: '緊急性が高い理由を教えてください',
        type: 'text' as QuestionType,
        category: 'career_consultation',
        tags: ['緊急性', '優先事項'],
        isRequired: true,
        placeholder: '期限がある、他の選択肢がある、決断を迫られているなど...'
      });
    }

    return {
      id: 'introduction',
      title: '導入・現状確認',
      description: 'キャリア相談の目的と現状を確認',
      duration: params.duration >= 45 ? 7 : 5,
      questions,
      order: 1
    };
  }

  /**
   * メインセクション作成（相談タイプ別）
   */
  private static createMainSection(params: CareerSupportParams): BankSection {
    let questions: BankQuestion[] = [];
    let title = '';
    let description = '';

    switch (params.consultationType) {
      case 'career_path':
        questions = CAREER_QUESTION_TEMPLATES.career_path;
        title = 'キャリアパス相談';
        description = '将来のキャリアビジョンと成長戦略';
        break;
        
      case 'skill_development':
        questions = CAREER_QUESTION_TEMPLATES.skill_development;
        title = 'スキル開発・資格取得相談';
        description = '必要なスキルと学習計画';
        break;
        
      case 'promotion':
        questions = CAREER_QUESTION_TEMPLATES.promotion;
        title = '昇進・昇格相談';
        description = '昇進に向けた準備と計画';
        // 管理職経験がない場合は追加質問
        if (!params.hasManagementExperience) {
          questions.push({
            id: 'promo_first_time',
            text: '初めての管理職に対する不安や懸念は？',
            type: 'text' as QuestionType,
            category: 'promotion',
            tags: ['不安', '初回管理職'],
            isRequired: false,
            placeholder: '人間関係、責任の重さ、時間管理など...'
          });
        }
        break;
        
      case 'transfer':
        questions = CAREER_QUESTION_TEMPLATES.transfer;
        title = '異動・転勤相談';
        description = '異動希望と準備状況';
        break;
        
      case 'work_style':
        questions = [
          {
            id: 'work_1',
            text: '理想の働き方と現状のギャップは？',
            type: 'hybrid' as QuestionType,
            category: 'work_style',
            tags: ['働き方', 'ギャップ'],
            isRequired: true,
            scaleLabel: 'ギャップ（1:小さい → 5:大きい）',
            textLabel: '具体的な内容',
            textPlaceholder: 'リモートワーク、フレックス、時短勤務など...'
          },
          {
            id: 'work_2',
            text: 'ワークライフバランスの改善希望点は？',
            type: 'text' as QuestionType,
            category: 'work_style',
            tags: ['WLB', '改善希望'],
            isRequired: true,
            placeholder: '残業削減、有給取得、プライベート時間確保など...'
          }
        ];
        title = '働き方改革相談';
        description = 'ワークスタイルの見直しと改善';
        break;
        
      case 'career_change':
        questions = [
          {
            id: 'change_1',
            text: 'キャリアチェンジを考える理由は？',
            type: 'text' as QuestionType,
            category: 'career_change',
            tags: ['転職', '動機'],
            isRequired: true,
            placeholder: '現職への不満、新しい挑戦、価値観の変化など...'
          },
          {
            id: 'change_2',
            text: '新しいキャリアで活かせる強みは？',
            type: 'text' as QuestionType,
            category: 'career_change',
            tags: ['強み', '転用可能スキル'],
            isRequired: true,
            placeholder: '経験、スキル、資格、人脈など...'
          }
        ];
        title = 'キャリアチェンジ相談';
        description = '新たなキャリアへの転換';
        break;
        
      default:
        questions = CAREER_QUESTION_TEMPLATES.career_path;
        title = 'キャリア全般相談';
        description = 'キャリアに関する総合的な相談';
    }

    return {
      id: 'main_consultation',
      title,
      description,
      duration: params.duration >= 45 ? 20 : 15,
      questions,
      order: 2
    };
  }

  /**
   * キャリア開発計画セクション
   */
  private static createDevelopmentPlanSection(params: CareerSupportParams): BankSection {
    const questions: BankQuestion[] = [
      {
        id: 'dev_1',
        text: '短期（1年以内）の成長目標を設定しましょう',
        type: 'hybrid' as QuestionType,
        category: 'development_plan',
        tags: ['短期目標', 'SMART'],
        isRequired: true,
        scaleLabel: '具体性（1:曖昧 → 5:明確）',
        textLabel: 'SMART目標',
        textPlaceholder: '具体的、測定可能、達成可能、関連性、期限を意識して...'
      },
      {
        id: 'dev_2',
        text: '中長期（3-5年）のキャリア目標は？',
        type: 'hybrid' as QuestionType,
        category: 'development_plan',
        tags: ['中長期目標', 'ビジョン'],
        isRequired: false,
        scaleLabel: '明確度（1:不明確 → 5:明確）',
        textLabel: '目標と理想像',
        textPlaceholder: '3年後には〇〇、5年後には〇〇を目指す...'
      },
      {
        id: 'dev_3',
        text: '目標達成のために必要な学習・経験は？',
        type: 'checklist' as QuestionType,
        category: 'development_plan',
        tags: ['必要スキル', '学習計画'],
        isRequired: true,
        options: [
          '専門知識の習得',
          '資格取得',
          'リーダーシップ研修',
          'プロジェクト参加',
          '他部署経験',
          '外部研修・セミナー',
          'メンタリング',
          '語学学習'
        ]
      }
    ];

    // スキル開発相談の場合は具体的な学習計画を追加
    if (params.consultationType === 'skill_development') {
      questions.push({
        id: 'dev_skill_plan',
        text: '具体的な学習スケジュールを立てましょう',
        type: 'text' as QuestionType,
        category: 'development_plan',
        tags: ['学習計画', 'スケジュール'],
        isRequired: true,
        placeholder: '〇月：基礎学習、〇月：実践、〇月：試験...'
      });
    }

    return {
      id: 'development_plan',
      title: 'キャリア開発計画',
      description: '成長目標と必要な取り組み',
      duration: params.duration >= 45 ? 10 : 8,
      questions,
      order: 3
    };
  }

  /**
   * アクションプランセクション
   */
  private static createActionPlanSection(params: CareerSupportParams): BankSection {
    const questions = [...CAREER_QUESTION_TEMPLATES.action_plan];

    // 高緊急度の場合は優先順位を明確化
    if (params.urgency === 'high') {
      questions.unshift({
        id: 'action_priority',
        text: '最優先で取り組むべきことは？',
        type: 'text' as QuestionType,
        category: 'action_plan',
        tags: ['優先順位', '緊急対応'],
        isRequired: true,
        placeholder: '今すぐ始めること、1週間以内に行うこと...'
      });
    }

    return {
      id: 'action_plan',
      title: '今後のアクションプラン',
      description: '具体的な行動計画と支援内容',
      duration: params.duration >= 45 ? 8 : 5,
      questions,
      order: 4
    };
  }

  /**
   * クロージングセクション
   */
  private static createClosingSection(params: CareerSupportParams): BankSection {
    return {
      id: 'closing',
      title: 'まとめ・次回予定',
      description: '面談の振り返りと今後の確認',
      duration: params.duration >= 45 ? 3 : 2,
      questions: [
        {
          id: 'close_1',
          text: '本日の面談で明確になったことは？',
          type: 'text' as QuestionType,
          category: 'closing',
          tags: ['振り返り', '確認'],
          isRequired: true,
          placeholder: '目標、課題、行動計画など...'
        },
        {
          id: 'close_2',
          text: '面談の満足度と改善点',
          type: 'hybrid' as QuestionType,
          category: 'closing',
          tags: ['満足度', 'フィードバック'],
          isRequired: false,
          scaleLabel: '満足度（1:不満 → 5:満足）',
          textLabel: 'ご意見・ご要望',
          textPlaceholder: '良かった点、改善してほしい点など...'
        }
      ],
      order: 5
    };
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
  private static generateTitle(params: CareerSupportParams): string {
    const typeLabels: Record<CareerConsultationType, string> = {
      career_path: 'キャリアパス相談',
      skill_development: 'スキル開発・資格取得相談',
      promotion: '昇進・昇格相談',
      transfer: '異動・転勤相談',
      work_style: '働き方改革相談',
      career_change: 'キャリアチェンジ相談'
    };

    return `${typeLabels[params.consultationType]}面談（${params.duration}分）`;
  }

  /**
   * 予約情報から相談タイプを抽出
   */
  private static extractConsultationType(reservation: any): CareerConsultationType {
    // カテゴリマッピング
    const categoryMap: Record<string, CareerConsultationType> = {
      'キャリアパス': 'career_path',
      'スキル開発': 'skill_development',
      '昇進・昇格': 'promotion',
      '異動・転勤': 'transfer',
      '働き方': 'work_style',
      'キャリアチェンジ': 'career_change'
    };

    // 予約情報のカテゴリから判定
    if (reservation.subCategory && categoryMap[reservation.subCategory]) {
      return categoryMap[reservation.subCategory];
    }

    // 相談内容のキーワードから推測
    const details = reservation.consultationDetails?.toLowerCase() || '';
    if (details.includes('昇進') || details.includes('昇格')) return 'promotion';
    if (details.includes('異動') || details.includes('転勤')) return 'transfer';
    if (details.includes('資格') || details.includes('スキル')) return 'skill_development';
    if (details.includes('働き方') || details.includes('ワーク')) return 'work_style';
    if (details.includes('転職') || details.includes('キャリアチェンジ')) return 'career_change';

    return 'career_path'; // デフォルト
  }
}