/**
 * サポート面談（個別相談系）動的生成サービス
 * 職場環境、人間関係、業務負荷、健康・安全、パフォーマンス、待遇等の個別相談に特化
 */

import {
  BankGenerationParams,
  BankQuestion,
  BankSection,
  GeneratedBankSheet,
  InterviewType,
  QuestionType
} from '../types';

// 個別相談のサブカテゴリ
export type ConsultationType = 
  | 'workplace_environment'  // 職場環境（設備・制度）
  | 'interpersonal'          // 人間関係（チームワーク）
  | 'workload'               // 業務負荷・ワークライフバランス
  | 'health_safety'          // 健康・安全
  | 'performance'            // パフォーマンス（業務改善）
  | 'compensation'           // 給与・待遇
  | 'training'               // 研修・教育
  | 'compliance'             // コンプライアンス
  | 'other';                 // その他の相談

// 個別相談固有のパラメータ
export interface ConsultationSupportParams extends BankGenerationParams {
  consultationType: ConsultationType;
  problemSeverity?: 'mild' | 'moderate' | 'severe';
  hasTriedSolutions?: boolean;
  affectedDuration?: string; // どのくらい前から
  impactOnWork?: 'low' | 'medium' | 'high';
  urgency?: 'low' | 'medium' | 'high';
  specificConcerns?: string[];
}

// 個別相談の質問テンプレート
const CONSULTATION_QUESTION_TEMPLATES = {
  // 共通の導入質問
  introduction: [
    {
      id: 'consult_intro_1',
      text: '本日相談したい内容を具体的に教えてください',
      type: 'hybrid' as QuestionType,
      category: 'consultation',
      tags: ['導入', '相談内容', '具体化'],
      isRequired: true,
      scaleLabel: '問題の深刻度（1:軽微 → 5:深刻）',
      textLabel: '具体的な相談内容',
      textPlaceholder: '現在困っていること、改善したいことを具体的に...'
    },
    {
      id: 'consult_intro_2',
      text: 'この問題はいつ頃から続いていますか？',
      type: 'hybrid' as QuestionType,
      category: 'consultation',
      tags: ['期間', '経緯'],
      isRequired: true,
      scaleLabel: '継続期間（1:最近 → 5:長期間）',
      textLabel: '具体的な期間と経緯',
      textPlaceholder: '〇ヶ月前から、きっかけは〇〇で...'
    },
    {
      id: 'consult_intro_3',
      text: '業務や生活への影響はどの程度ありますか？',
      type: 'hybrid' as QuestionType,
      category: 'consultation',
      tags: ['影響度', '業務影響'],
      isRequired: true,
      scaleLabel: '影響度（1:小さい → 5:大きい）',
      textLabel: '具体的な影響',
      textPlaceholder: '業務効率の低下、モチベーション低下、体調不良など...'
    }
  ],

  // 職場環境相談専用質問
  workplace_environment: [
    {
      id: 'env_1',
      text: '職場環境の具体的な問題点を教えてください',
      type: 'checklist' as QuestionType,
      category: 'workplace',
      tags: ['環境問題', '設備'],
      isRequired: true,
      options: [
        '作業スペースの狭さ・配置',
        '照明・空調の不具合',
        '騒音・臭気',
        '休憩室・更衣室の不足',
        '備品・設備の老朽化',
        'IT環境・システムの問題',
        '清潔さ・衛生面',
        'バリアフリー対応'
      ]
    },
    {
      id: 'env_2',
      text: '理想的な職場環境と現状のギャップは？',
      type: 'hybrid' as QuestionType,
      category: 'workplace',
      tags: ['ギャップ分析', '改善希望'],
      scaleLabel: 'ギャップ（1:小さい → 5:大きい）',
      textLabel: '理想と現実の差',
      textPlaceholder: '理想：〇〇な環境、現実：〇〇で困っている...'
    },
    {
      id: 'env_3',
      text: '改善のための具体的な提案はありますか？',
      type: 'text' as QuestionType,
      category: 'workplace',
      tags: ['改善提案', '解決策'],
      isRequired: true,
      placeholder: 'レイアウト変更、設備更新、ルール改定など...'
    }
  ],

  // 人間関係相談専用質問
  interpersonal: [
    {
      id: 'inter_1',
      text: '人間関係の問題の詳細を教えてください',
      type: 'hybrid' as QuestionType,
      category: 'interpersonal',
      tags: ['人間関係', '詳細'],
      isRequired: true,
      scaleLabel: 'ストレス度（1:低い → 5:高い）',
      textLabel: '具体的な状況（個人名は伏せて）',
      textPlaceholder: '上司/同僚/部下との関係で〇〇な問題が...'
    },
    {
      id: 'inter_2',
      text: 'コミュニケーションの問題点は？',
      type: 'checklist' as QuestionType,
      category: 'interpersonal',
      tags: ['コミュニケーション', '課題'],
      options: [
        '意見が言いにくい雰囲気',
        '情報共有の不足',
        '指示の不明確さ',
        '価値観の相違',
        'パワハラ的な言動',
        '無視・仲間外れ',
        '過度な批判・否定',
        'プライベートへの干渉'
      ]
    },
    {
      id: 'inter_3',
      text: 'これまでに試した対処法と結果は？',
      type: 'text' as QuestionType,
      category: 'interpersonal',
      tags: ['対処法', '試行錯誤'],
      isRequired: false,
      placeholder: '直接話し合い、第三者への相談、距離を置くなど...'
    },
    {
      id: 'inter_4',
      text: '望ましい関係性のイメージは？',
      type: 'text' as QuestionType,
      category: 'interpersonal',
      tags: ['理想', '改善目標'],
      placeholder: '互いに尊重し合い、〇〇な関係...'
    }
  ],

  // 業務負荷相談専用質問
  workload: [
    {
      id: 'load_1',
      text: '現在の業務負荷の状況を教えてください',
      type: 'hybrid' as QuestionType,
      category: 'workload',
      tags: ['業務量', '負荷'],
      isRequired: true,
      scaleLabel: '負荷レベル（1:適正 → 5:過重）',
      textLabel: '具体的な業務内容と量',
      textPlaceholder: '残業時間、担当業務数、締切のプレッシャーなど...'
    },
    {
      id: 'load_2',
      text: '業務負荷が高い主な要因は？',
      type: 'checklist' as QuestionType,
      category: 'workload',
      tags: ['要因分析', '原因'],
      isRequired: true,
      options: [
        '人員不足',
        '業務の偏り',
        '非効率なプロセス',
        '頻繁な割り込み業務',
        '不明確な優先順位',
        'スキル不足',
        '過度な責任範囲',
        'システム・ツールの問題'
      ]
    },
    {
      id: 'load_3',
      text: 'ワークライフバランスへの影響は？',
      type: 'hybrid' as QuestionType,
      category: 'workload',
      tags: ['WLB', '生活影響'],
      scaleLabel: '影響度（1:小さい → 5:大きい）',
      textLabel: '具体的な影響',
      textPlaceholder: '家族との時間、趣味、健康管理への影響...'
    },
    {
      id: 'load_4',
      text: '業務効率化のアイデアはありますか？',
      type: 'text' as QuestionType,
      category: 'workload',
      tags: ['効率化', '改善案'],
      placeholder: '業務の優先順位見直し、自動化、分担変更など...'
    }
  ],

  // 健康・安全相談専用質問
  health_safety: [
    {
      id: 'health_1',
      text: '健康面・安全面での懸念事項を教えてください',
      type: 'hybrid' as QuestionType,
      category: 'health_safety',
      tags: ['健康', '安全', '懸念'],
      isRequired: true,
      scaleLabel: '懸念度（1:軽微 → 5:重大）',
      textLabel: '具体的な内容',
      textPlaceholder: '体調不良、ストレス症状、安全上のリスクなど...'
    },
    {
      id: 'health_2',
      text: '現在の症状や問題を選んでください',
      type: 'checklist' as QuestionType,
      category: 'health_safety',
      tags: ['症状', 'チェック'],
      options: [
        '慢性的な疲労',
        '睡眠障害',
        '頭痛・めまい',
        '胃腸の不調',
        '腰痛・肩こり',
        '精神的ストレス',
        '感染症への不安',
        '労災リスク'
      ]
    },
    {
      id: 'health_3',
      text: '産業医や専門家への相談状況は？',
      type: 'hybrid' as QuestionType,
      category: 'health_safety',
      tags: ['専門家相談', '医療'],
      scaleLabel: '相談頻度（1:なし → 5:定期的）',
      textLabel: '相談内容と結果',
      textPlaceholder: '産業医面談、カウンセリング、健康診断結果など...'
    },
    {
      id: 'health_4',
      text: '職場で必要な健康・安全対策は？',
      type: 'text' as QuestionType,
      category: 'health_safety',
      tags: ['対策', '要望'],
      isRequired: true,
      placeholder: 'ストレスチェック強化、安全装備の改善、休憩時間確保など...'
    }
  ],

  // パフォーマンス相談専用質問
  performance: [
    {
      id: 'perf_1',
      text: '現在のパフォーマンスに対する自己評価は？',
      type: 'hybrid' as QuestionType,
      category: 'performance',
      tags: ['自己評価', 'パフォーマンス'],
      isRequired: true,
      scaleLabel: '満足度（1:不満 → 5:満足）',
      textLabel: '評価の理由',
      textPlaceholder: '達成できていること、課題と感じることなど...'
    },
    {
      id: 'perf_2',
      text: 'パフォーマンス向上の障害となっているものは？',
      type: 'checklist' as QuestionType,
      category: 'performance',
      tags: ['障害', '阻害要因'],
      options: [
        'スキル・知識不足',
        '明確な目標の欠如',
        'リソース不足',
        'モチベーション低下',
        '体調・健康問題',
        '人間関係の問題',
        'システム・プロセスの問題',
        'フィードバック不足'
      ]
    },
    {
      id: 'perf_3',
      text: '改善のために必要なサポートは？',
      type: 'text' as QuestionType,
      category: 'performance',
      tags: ['サポート', 'ニーズ'],
      isRequired: true,
      placeholder: '研修、メンタリング、目標設定支援、ツール提供など...'
    }
  ],

  // 給与・待遇相談専用質問
  compensation: [
    {
      id: 'comp_1',
      text: '現在の給与・待遇に対する評価は？',
      type: 'hybrid' as QuestionType,
      category: 'compensation',
      tags: ['給与', '待遇', '評価'],
      isRequired: true,
      scaleLabel: '満足度（1:不満 → 5:満足）',
      textLabel: '具体的な不満点',
      textPlaceholder: '基本給、賞与、手当、福利厚生など...'
    },
    {
      id: 'comp_2',
      text: '同業他社や市場価値との比較は？',
      type: 'text' as QuestionType,
      category: 'compensation',
      tags: ['市場価値', '比較'],
      placeholder: '同業他社の水準、自身の経験・スキルに対する評価など...'
    },
    {
      id: 'comp_3',
      text: '希望する改善点を優先順位をつけて教えてください',
      type: 'text' as QuestionType,
      category: 'compensation',
      tags: ['改善希望', '優先順位'],
      isRequired: true,
      placeholder: '1. 基本給の見直し、2. 資格手当の追加、3. 賞与査定の透明化...'
    }
  ],

  // 問題解決セクション共通質問
  problem_solving: [
    {
      id: 'solve_1',
      text: 'この問題を解決するために、あなた自身ができることは？',
      type: 'text' as QuestionType,
      category: 'problem_solving',
      tags: ['自助努力', '行動計画'],
      isRequired: true,
      placeholder: '自分で改善できること、取り組めることなど...'
    },
    {
      id: 'solve_2',
      text: '組織・上司に期待する対応は？',
      type: 'checklist' as QuestionType,
      category: 'problem_solving',
      tags: ['組織対応', '期待'],
      isRequired: true,
      options: [
        '問題の詳細調査',
        '関係者との調整',
        'ルール・制度の改定',
        '環境・設備の改善',
        '人員配置の見直し',
        '研修・教育の実施',
        '第三者による仲裁',
        '定期的なフォローアップ'
      ]
    },
    {
      id: 'solve_3',
      text: '解決の目標期限はいつ頃を希望しますか？',
      type: 'hybrid' as QuestionType,
      category: 'problem_solving',
      tags: ['期限', 'スケジュール'],
      scaleLabel: '緊急度（1:ゆっくり → 5:至急）',
      textLabel: '希望期限と理由',
      textPlaceholder: '〇ヶ月以内に解決したい。理由は...'
    }
  ],

  // アクションプラン共通質問
  action_plan: [
    {
      id: 'action_1',
      text: '今後1ヶ月の具体的な行動計画',
      type: 'text' as QuestionType,
      category: 'action_plan',
      tags: ['行動計画', '短期'],
      isRequired: true,
      placeholder: '1週目：〇〇、2週目：〇〇、3-4週目：〇〇'
    },
    {
      id: 'action_2',
      text: '進捗確認の方法とタイミング',
      type: 'text' as QuestionType,
      category: 'action_plan',
      tags: ['進捗管理', 'フォロー'],
      isRequired: true,
      placeholder: '2週間後に中間報告、1ヶ月後に結果確認など...'
    },
    {
      id: 'action_3',
      text: '次回面談で確認したいこと',
      type: 'text' as QuestionType,
      category: 'action_plan',
      tags: ['次回確認', 'フォローアップ'],
      placeholder: '改善状況、新たな課題、追加サポートの必要性など...'
    }
  ]
};

/**
 * 個別相談系サポート面談シート生成クラス
 */
export class ConsultationSupportGenerator {
  
  /**
   * 予約情報から個別相談面談シートを生成
   */
  static generateFromReservation(
    reservation: any,
    staffProfile: any
  ): GeneratedBankSheet {
    // 予約情報からパラメータを抽出
    const params: ConsultationSupportParams = {
      interviewType: 'support' as InterviewType,
      consultationType: this.extractConsultationType(reservation),
      duration: reservation.duration || 30,
      staffLevel: staffProfile.experienceLevel,
      jobRole: staffProfile.profession,
      facilityType: staffProfile.facility,
      problemSeverity: this.assessSeverity(reservation),
      hasTriedSolutions: reservation.hasTriedSolutions || false,
      affectedDuration: reservation.problemDuration,
      impactOnWork: reservation.workImpact || 'medium',
      urgency: reservation.urgency || 'medium',
      specificConcerns: reservation.concerns || []
    };

    return this.generate(params);
  }

  /**
   * 個別相談面談シートを生成
   */
  static generate(params: ConsultationSupportParams): GeneratedBankSheet {
    const sections: BankSection[] = [];
    
    // 1. 導入・問題確認セクション（5-8分）
    sections.push(this.createIntroductionSection(params));
    
    // 2. 問題詳細セクション（相談タイプ別）（10-15分）
    sections.push(this.createDetailSection(params));
    
    // 3. 問題解決探索セクション（8-10分）
    sections.push(this.createProblemSolvingSection(params));
    
    // 4. アクションプランセクション（5-7分）
    sections.push(this.createActionPlanSection(params));
    
    // 5. クロージングセクション（2-3分）
    sections.push(this.createClosingSection(params));

    // 時間配分を調整
    const adjustedSections = this.adjustTimeAllocation(sections, params.duration);

    return {
      id: `consultation_support_${Date.now()}`,
      title: this.generateTitle(params),
      type: 'support' as InterviewType,
      subType: params.consultationType,
      duration: params.duration,
      sections: adjustedSections,
      totalQuestions: adjustedSections.reduce((sum, s) => sum + s.questions.length, 0),
      generatedAt: new Date(),
      metadata: {
        consultationType: params.consultationType,
        problemSeverity: params.problemSeverity,
        urgency: params.urgency,
        impactOnWork: params.impactOnWork
      }
    };
  }

  /**
   * 導入・問題確認セクション
   */
  private static createIntroductionSection(params: ConsultationSupportParams): BankSection {
    const questions: BankQuestion[] = [...CONSULTATION_QUESTION_TEMPLATES.introduction];

    // 深刻度が高い場合は追加質問
    if (params.problemSeverity === 'severe') {
      questions.push({
        id: 'intro_severe',
        text: '緊急に対処が必要な理由を教えてください',
        type: 'text' as QuestionType,
        category: 'consultation',
        tags: ['緊急性', '深刻度'],
        isRequired: true,
        placeholder: '業務に支障、健康への影響、退職検討など...'
      });
    }

    // 過去に解決を試みた場合
    if (params.hasTriedSolutions) {
      questions.push({
        id: 'intro_tried',
        text: 'これまでに試した解決策と結果を教えてください',
        type: 'text' as QuestionType,
        category: 'consultation',
        tags: ['試行錯誤', '過去の対応'],
        isRequired: false,
        placeholder: '〇〇を試したが、〇〇という結果だった...'
      });
    }

    return {
      id: 'introduction',
      title: '導入・問題確認',
      description: '相談内容の確認と現状把握',
      duration: params.duration >= 45 ? 8 : 5,
      questions,
      order: 1
    };
  }

  /**
   * 問題詳細セクション（相談タイプ別）
   */
  private static createDetailSection(params: ConsultationSupportParams): BankSection {
    let questions: BankQuestion[] = [];
    let title = '';
    let description = '';

    switch (params.consultationType) {
      case 'workplace_environment':
        questions = CONSULTATION_QUESTION_TEMPLATES.workplace_environment;
        title = '職場環境の詳細確認';
        description = '環境・設備・制度の問題点';
        break;
        
      case 'interpersonal':
        questions = CONSULTATION_QUESTION_TEMPLATES.interpersonal;
        title = '人間関係の詳細確認';
        description = 'コミュニケーションと関係性の課題';
        break;
        
      case 'workload':
        questions = CONSULTATION_QUESTION_TEMPLATES.workload;
        title = '業務負荷の詳細確認';
        description = '業務量とワークライフバランス';
        break;
        
      case 'health_safety':
        questions = CONSULTATION_QUESTION_TEMPLATES.health_safety;
        title = '健康・安全の詳細確認';
        description = '心身の健康と安全上の懸念';
        break;
        
      case 'performance':
        questions = CONSULTATION_QUESTION_TEMPLATES.performance;
        title = 'パフォーマンスの詳細確認';
        description = '業務遂行と成果の課題';
        break;
        
      case 'compensation':
        questions = CONSULTATION_QUESTION_TEMPLATES.compensation;
        title = '給与・待遇の詳細確認';
        description = '報酬と福利厚生の課題';
        break;
        
      case 'training':
        questions = [
          {
            id: 'train_1',
            text: '必要と感じる研修・教育内容は？',
            type: 'text' as QuestionType,
            category: 'training',
            tags: ['研修ニーズ', '教育'],
            isRequired: true,
            placeholder: '技術研修、リーダーシップ研修、資格取得支援など...'
          },
          {
            id: 'train_2',
            text: '現在の教育体制の問題点は？',
            type: 'text' as QuestionType,
            category: 'training',
            tags: ['教育体制', '問題点'],
            placeholder: '研修機会の不足、内容の不適切、時間確保の困難など...'
          }
        ];
        title = '研修・教育の詳細確認';
        description = '教育ニーズと体制の課題';
        break;
        
      case 'compliance':
        questions = [
          {
            id: 'comp_1',
            text: 'コンプライアンス上の懸念事項（詳細は伏せて概要のみ）',
            type: 'text' as QuestionType,
            category: 'compliance',
            tags: ['コンプライアンス', '懸念'],
            isRequired: true,
            placeholder: '規則違反、倫理的問題、法令遵守など（詳細は別途確認）'
          },
          {
            id: 'comp_2',
            text: '適切な報告・相談先への連絡状況は？',
            type: 'hybrid' as QuestionType,
            category: 'compliance',
            tags: ['報告', '相談'],
            scaleLabel: '対応状況（1:未対応 → 5:対応済）',
            textLabel: '対応内容',
            textPlaceholder: 'コンプライアンス窓口、上位管理者への報告など...'
          }
        ];
        title = 'コンプライアンスの詳細確認';
        description = '規則・倫理上の懸念事項';
        break;
        
      default:
        questions = [
          {
            id: 'other_1',
            text: '相談内容の詳細を教えてください',
            type: 'text' as QuestionType,
            category: 'other',
            tags: ['その他', '詳細'],
            isRequired: true,
            placeholder: '具体的な問題、背景、影響など...'
          }
        ];
        title = 'その他相談の詳細確認';
        description = '個別事情の詳細把握';
    }

    // 影響が大きい場合は追加質問
    if (params.impactOnWork === 'high') {
      questions.push({
        id: 'detail_impact',
        text: '業務への具体的な影響と損失を教えてください',
        type: 'text' as QuestionType,
        category: params.consultationType,
        tags: ['業務影響', '損失'],
        isRequired: true,
        placeholder: '生産性低下、ミス増加、欠勤、チーム士気低下など...'
      });
    }

    return {
      id: 'problem_detail',
      title,
      description,
      duration: params.duration >= 45 ? 15 : 10,
      questions,
      order: 2
    };
  }

  /**
   * 問題解決探索セクション
   */
  private static createProblemSolvingSection(params: ConsultationSupportParams): BankSection {
    const questions = [...CONSULTATION_QUESTION_TEMPLATES.problem_solving];

    // 相談タイプ別の追加質問
    if (params.consultationType === 'interpersonal') {
      questions.push({
        id: 'solve_mediation',
        text: '第三者による仲裁や調整を希望しますか？',
        type: 'hybrid' as QuestionType,
        category: 'problem_solving',
        tags: ['仲裁', '調整'],
        scaleLabel: '希望度（1:不要 → 5:強く希望）',
        textLabel: '希望する対応',
        textPlaceholder: '人事部の介入、上司による調整など...'
      });
    }

    if (params.consultationType === 'health_safety') {
      questions.push({
        id: 'solve_medical',
        text: '医療専門家への相談や休職の検討は？',
        type: 'hybrid' as QuestionType,
        category: 'problem_solving',
        tags: ['医療', '休職'],
        scaleLabel: '必要性（1:不要 → 5:必要）',
        textLabel: '検討内容',
        textPlaceholder: '産業医面談、専門医受診、休職検討など...'
      });
    }

    return {
      id: 'problem_solving',
      title: '問題解決の探索',
      description: '解決策の検討と必要な支援',
      duration: params.duration >= 45 ? 10 : 8,
      questions,
      order: 3
    };
  }

  /**
   * アクションプランセクション
   */
  private static createActionPlanSection(params: ConsultationSupportParams): BankSection {
    const questions = [...CONSULTATION_QUESTION_TEMPLATES.action_plan];

    // 高緊急度の場合
    if (params.urgency === 'high' || params.problemSeverity === 'severe') {
      questions.unshift({
        id: 'action_immediate',
        text: '今すぐ実行すべき対策は？',
        type: 'text' as QuestionType,
        category: 'action_plan',
        tags: ['緊急対応', '即時実行'],
        isRequired: true,
        placeholder: '本日中、明日までに行うこと...'
      });
    }

    return {
      id: 'action_plan',
      title: '今後のアクションプラン',
      description: '具体的な行動計画と支援内容',
      duration: params.duration >= 45 ? 7 : 5,
      questions,
      order: 4
    };
  }

  /**
   * クロージングセクション
   */
  private static createClosingSection(params: ConsultationSupportParams): BankSection {
    return {
      id: 'closing',
      title: 'まとめ・フォローアップ',
      description: '合意事項の確認と今後の進め方',
      duration: params.duration >= 45 ? 3 : 2,
      questions: [
        {
          id: 'close_1',
          text: '本日の面談で決まったこと・合意事項',
          type: 'text' as QuestionType,
          category: 'closing',
          tags: ['合意事項', '確認'],
          isRequired: true,
          placeholder: '対応策、役割分担、スケジュールなど...'
        },
        {
          id: 'close_2',
          text: '面談後の気持ちの変化',
          type: 'hybrid' as QuestionType,
          category: 'closing',
          tags: ['感想', '変化'],
          isRequired: false,
          scaleLabel: '安心度（1:不安 → 5:安心）',
          textLabel: '感想',
          textPlaceholder: '話せてよかった、方向性が見えたなど...'
        },
        {
          id: 'close_3',
          text: '追加で相談したいことは？',
          type: 'text' as QuestionType,
          category: 'closing',
          tags: ['追加相談', '残課題'],
          placeholder: '今回話せなかったこと、新たに気づいたことなど...'
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
  private static generateTitle(params: ConsultationSupportParams): string {
    const typeLabels: Record<ConsultationType, string> = {
      workplace_environment: '職場環境相談',
      interpersonal: '人間関係相談',
      workload: '業務負荷相談',
      health_safety: '健康・安全相談',
      performance: 'パフォーマンス相談',
      compensation: '給与・待遇相談',
      training: '研修・教育相談',
      compliance: 'コンプライアンス相談',
      other: 'その他個別相談'
    };

    const severityLabel = params.problemSeverity === 'severe' ? '【重要】' : '';
    return `${severityLabel}${typeLabels[params.consultationType]}面談（${params.duration}分）`;
  }

  /**
   * 予約情報から相談タイプを抽出
   */
  private static extractConsultationType(reservation: any): ConsultationType {
    const categoryMap: Record<string, ConsultationType> = {
      '職場環境': 'workplace_environment',
      '人間関係': 'interpersonal',
      '業務負荷': 'workload',
      'ワークライフバランス': 'workload',
      '健康・安全': 'health_safety',
      'パフォーマンス': 'performance',
      '業務改善': 'performance',
      '給与・待遇': 'compensation',
      '研修・教育': 'training',
      'コンプライアンス': 'compliance'
    };

    if (reservation.subCategory && categoryMap[reservation.subCategory]) {
      return categoryMap[reservation.subCategory];
    }

    // キーワードから推測
    const details = (reservation.consultationDetails || '').toLowerCase();
    if (details.includes('環境') || details.includes('設備')) return 'workplace_environment';
    if (details.includes('人間関係') || details.includes('上司') || details.includes('同僚')) return 'interpersonal';
    if (details.includes('業務量') || details.includes('残業') || details.includes('負荷')) return 'workload';
    if (details.includes('健康') || details.includes('ストレス') || details.includes('体調')) return 'health_safety';
    if (details.includes('給与') || details.includes('賞与') || details.includes('待遇')) return 'compensation';

    return 'other';
  }

  /**
   * 問題の深刻度を評価
   */
  private static assessSeverity(reservation: any): 'mild' | 'moderate' | 'severe' {
    // 緊急度から判定
    if (reservation.urgency === 'high') return 'severe';
    
    // キーワードから判定
    const details = (reservation.consultationDetails || '').toLowerCase();
    if (details.includes('退職') || details.includes('限界') || details.includes('耐えられない')) {
      return 'severe';
    }
    if (details.includes('困っている') || details.includes('悩んでいる')) {
      return 'moderate';
    }
    
    return 'mild';
  }
}