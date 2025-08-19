/**
 * 特別面談動的生成サービス
 * 退職面談、復職面談、インシデント後面談に特化した面談シート生成
 */

import {
  BankGenerationParams,
  BankQuestion,
  BankSection,
  GeneratedBankSheet,
  InterviewType,
  QuestionType
} from '../types';

// 特別面談の種類
export type SpecialInterviewType = 
  | 'exit'                // 退職面談
  | 'return_to_work'      // 復職面談
  | 'incident_followup';  // インシデント後面談

// 退職理由のカテゴリ
export type ExitReason = 
  | 'career_change'       // 転職・キャリアチェンジ
  | 'compensation'        // 給与・待遇
  | 'work_environment'    // 労働環境
  | 'interpersonal'       // 人間関係
  | 'health'             // 健康上の理由
  | 'family'             // 家族の事情
  | 'retirement'         // 定年・早期退職
  | 'other';             // その他

// 復職理由のカテゴリ
export type ReturnReason = 
  | 'maternity'          // 産休・育休
  | 'medical'            // 病気療養
  | 'mental'             // メンタルヘルス
  | 'injury'             // 怪我・労災
  | 'family_care'        // 家族介護
  | 'study'              // 留学・進学
  | 'other';             // その他

// インシデントレベル
export type IncidentLevel = 
  | 'level0'  // ヒヤリハット
  | 'level1'  // 軽微な影響
  | 'level2'  // 中程度の影響
  | 'level3a' // 重大な影響（一時的）
  | 'level3b' // 重大な影響（永続的）
  | 'level4'  // 死亡・重篤
  | 'level5'; // 死亡

// 特別面談固有のパラメータ
export interface SpecialInterviewParams extends BankGenerationParams {
  specialType: SpecialInterviewType;
  
  // 退職面談用
  exitReason?: ExitReason;
  exitDate?: Date;
  yearsOfService?: number;
  hasHandoverPlan?: boolean;
  
  // 復職面談用
  returnReason?: ReturnReason;
  absenceDuration?: number; // 休職期間（日数）
  returnDate?: Date;
  needsAccommodation?: boolean;
  medicalClearance?: boolean;
  
  // インシデント面談用
  incidentLevel?: IncidentLevel;
  incidentDate?: Date;
  hasReportSubmitted?: boolean;
  emotionalImpact?: 'low' | 'medium' | 'high';
  needsPsychologicalSupport?: boolean;
}

// 特別面談の質問テンプレート
const SPECIAL_INTERVIEW_TEMPLATES = {
  // 退職面談の質問（既存の退職面談シートから抽出・変換）
  exit_interview: {
    introduction: [
      {
        id: 'exit_intro_1',
        text: '退職を決意された時期と、その決断に至った経緯を教えてください',
        type: 'hybrid' as QuestionType,
        category: 'exit',
        tags: ['導入', '退職理由', '経緯'],
        isRequired: true,
        scaleLabel: '決意の強さ（1:迷いあり → 5:固い決意）',
        textLabel: '決断の経緯',
        textPlaceholder: 'いつ頃から考え始め、何がきっかけで決断したか...'
      },
      {
        id: 'exit_intro_2',
        text: '在職期間中の思い出や達成したことを振り返ってください',
        type: 'text' as QuestionType,
        category: 'exit',
        tags: ['振り返り', 'ポジティブ'],
        isRequired: false,
        placeholder: '嬉しかったこと、成長できたこと、感謝していることなど...'
      }
    ],
    
    exit_reasons: [
      {
        id: 'exit_reason_1',
        text: '主な退職理由を選んでください（複数選択可）',
        type: 'checklist' as QuestionType,
        category: 'exit',
        tags: ['退職理由', '複数選択'],
        isRequired: true,
        options: [
          '他社への転職',
          'キャリアチェンジ',
          '給与・賞与への不満',
          '労働時間・残業',
          '休暇取得の困難',
          '人間関係のストレス',
          '上司との関係',
          '仕事内容への不満',
          '成長機会の不足',
          '評価への不満',
          '職場環境・設備',
          '通勤の負担',
          '健康上の理由',
          '家族の事情',
          '結婚・出産・育児',
          '介護',
          '進学・留学',
          'その他'
        ]
      },
      {
        id: 'exit_reason_2',
        text: '最も大きな退職理由の詳細を教えてください',
        type: 'text' as QuestionType,
        category: 'exit',
        tags: ['退職理由', '詳細'],
        isRequired: true,
        placeholder: '最も重要な理由と具体的な状況、改善されれば残留を考えた条件など...'
      },
      {
        id: 'exit_reason_3',
        text: '退職を思い留まる可能性があった条件はありましたか？',
        type: 'hybrid' as QuestionType,
        category: 'exit',
        tags: ['残留条件', '改善可能性'],
        scaleLabel: '可能性（1:なし → 5:十分あった）',
        textLabel: '具体的な条件',
        textPlaceholder: '給与改善、異動、業務改善など、どんな条件があれば...'
      }
    ],
    
    workplace_evaluation: [
      {
        id: 'exit_eval_1',
        text: '職場環境の各項目を5段階で評価してください',
        type: 'scale_matrix' as QuestionType,
        category: 'exit',
        tags: ['職場評価', '満足度'],
        isRequired: true,
        matrixItems: [
          '仕事の内容・やりがい',
          '業務量・負荷',
          '裁量権・自主性',
          'スキル向上機会',
          '基本給与',
          '賞与・手当',
          '昇給・昇進',
          '福利厚生',
          '労働時間',
          '休暇取得',
          '職場の設備',
          '安全・衛生',
          '上司との関係',
          '同僚との関係',
          'チームワーク',
          'コミュニケーション'
        ],
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: ['非常に不満', '不満', '普通', '満足', '非常に満足']
      },
      {
        id: 'exit_eval_2',
        text: '特に不満だった点（上位3つ）を具体的に教えてください',
        type: 'text' as QuestionType,
        category: 'exit',
        tags: ['不満点', '具体例'],
        isRequired: true,
        placeholder: '1. \n2. \n3. '
      },
      {
        id: 'exit_eval_3',
        text: 'この職場の良かった点・強みを教えてください',
        type: 'text' as QuestionType,
        category: 'exit',
        tags: ['良い点', '強み'],
        isRequired: false,
        placeholder: '働いていて良かったこと、組織の強み、継続すべき文化など...'
      }
    ],
    
    improvement_suggestions: [
      {
        id: 'exit_improve_1',
        text: '組織改善のための具体的な提案をお聞かせください',
        type: 'text' as QuestionType,
        category: 'exit',
        tags: ['改善提案', '組織'],
        isRequired: true,
        placeholder: 'こうすればもっと良い職場になる、離職を防げるという具体的なアイデア...'
      },
      {
        id: 'exit_improve_2',
        text: '後任者へのアドバイスがあれば教えてください',
        type: 'text' as QuestionType,
        category: 'exit',
        tags: ['引き継ぎ', 'アドバイス'],
        placeholder: '業務のコツ、注意点、重要な関係者など...'
      },
      {
        id: 'exit_improve_3',
        text: '人材育成・定着のために組織が取り組むべきことは？',
        type: 'checklist' as QuestionType,
        category: 'exit',
        tags: ['人材育成', '定着'],
        options: [
          'キャリアパスの明確化',
          '評価制度の改善',
          '給与・待遇の見直し',
          'ワークライフバランス改善',
          '研修・教育の充実',
          'コミュニケーション改善',
          '職場環境の整備',
          'メンタルヘルス対策'
        ]
      }
    ],
    
    handover: [
      {
        id: 'exit_handover_1',
        text: '引き継ぎの準備状況を教えてください',
        type: 'hybrid' as QuestionType,
        category: 'exit',
        tags: ['引き継ぎ', '準備'],
        isRequired: true,
        scaleLabel: '準備度（1:未着手 → 5:完了）',
        textLabel: '引き継ぎ内容',
        textPlaceholder: '引き継ぎ資料、後任者への説明、残務処理など...'
      },
      {
        id: 'exit_handover_2',
        text: '引き継ぎで特に注意が必要な業務はありますか？',
        type: 'text' as QuestionType,
        category: 'exit',
        tags: ['引き継ぎ', '注意点'],
        placeholder: '複雑な業務、重要な顧客、期限のある案件など...'
      }
    ]
  },

  // 復職面談の質問
  return_to_work: {
    introduction: [
      {
        id: 'return_intro_1',
        text: 'お帰りなさい。現在の体調と復職への準備状況を教えてください',
        type: 'hybrid' as QuestionType,
        category: 'return',
        tags: ['導入', '体調確認'],
        isRequired: true,
        scaleLabel: '準備度（1:不安 → 5:万全）',
        textLabel: '現在の状況',
        textPlaceholder: '体調、気持ち、家族のサポート体制など...'
      },
      {
        id: 'return_intro_2',
        text: '休職期間中の過ごし方と回復の経過を教えてください',
        type: 'text' as QuestionType,
        category: 'return',
        tags: ['休職期間', '回復'],
        placeholder: '治療内容、リハビリ、休養の様子など（話せる範囲で）...'
      }
    ],
    
    medical_clearance: [
      {
        id: 'return_medical_1',
        text: '主治医からの復職許可と就業上の配慮事項',
        type: 'hybrid' as QuestionType,
        category: 'return',
        tags: ['医療', '配慮'],
        isRequired: true,
        scaleLabel: '制限（1:多い → 5:なし）',
        textLabel: '具体的な配慮事項',
        textPlaceholder: '勤務時間制限、業務制限、通院の必要性など...'
      },
      {
        id: 'return_medical_2',
        text: '服薬や通院の継続は必要ですか？',
        type: 'hybrid' as QuestionType,
        category: 'return',
        tags: ['治療継続', '通院'],
        scaleLabel: '頻度（1:頻繁 → 5:不要）',
        textLabel: '具体的な内容',
        textPlaceholder: '通院頻度、服薬の影響、必要な配慮など...'
      }
    ],
    
    work_arrangement: [
      {
        id: 'return_work_1',
        text: '希望する勤務形態を教えてください',
        type: 'checklist' as QuestionType,
        category: 'return',
        tags: ['勤務形態', '希望'],
        isRequired: true,
        options: [
          '段階的復職（時短勤務から開始）',
          '時短勤務の継続',
          '残業制限',
          '夜勤免除',
          '休日勤務免除',
          '在宅勤務の活用',
          'フレックスタイム',
          '業務量の調整',
          '担当業務の変更',
          '部署異動'
        ]
      },
      {
        id: 'return_work_2',
        text: '復職後の業務について不安な点はありますか？',
        type: 'hybrid' as QuestionType,
        category: 'return',
        tags: ['不安', '業務'],
        scaleLabel: '不安度（1:低い → 5:高い）',
        textLabel: '具体的な不安',
        textPlaceholder: '体力面、スキルの低下、人間関係、新しい環境など...'
      },
      {
        id: 'return_work_3',
        text: '段階的な復職計画を一緒に立てましょう',
        type: 'text' as QuestionType,
        category: 'return',
        tags: ['復職計画', '段階的'],
        isRequired: true,
        placeholder: '1週目：半日勤務、2-3週目：6時間勤務、1ヶ月後：通常勤務など...'
      }
    ],
    
    support_needs: [
      {
        id: 'return_support_1',
        text: '復職にあたって必要なサポートを選んでください',
        type: 'checklist' as QuestionType,
        category: 'return',
        tags: ['サポート', 'ニーズ'],
        isRequired: true,
        options: [
          '業務の再教育・研修',
          'メンター・相談役の配置',
          '定期的な面談',
          '産業医との連携',
          'カウンセリング支援',
          '同僚への説明・理解促進',
          '職場環境の調整',
          '休憩場所の確保'
        ]
      },
      {
        id: 'return_support_2',
        text: '家族からのサポート体制はどうですか？',
        type: 'hybrid' as QuestionType,
        category: 'return',
        tags: ['家族', 'サポート'],
        scaleLabel: 'サポート（1:不足 → 5:十分）',
        textLabel: '具体的な内容',
        textPlaceholder: '育児・介護の分担、送迎、家事サポートなど...'
      }
    ]
  },

  // インシデント後面談の質問
  incident_followup: {
    introduction: [
      {
        id: 'incident_intro_1',
        text: 'インシデント発生から現在までの心境の変化を教えてください',
        type: 'hybrid' as QuestionType,
        category: 'incident',
        tags: ['導入', '心境'],
        isRequired: true,
        scaleLabel: '回復度（1:未回復 → 5:回復）',
        textLabel: '現在の心境',
        textPlaceholder: 'ショック、自責、不安、立ち直りなど率直な気持ち...'
      },
      {
        id: 'incident_intro_2',
        text: '睡眠や食欲など、日常生活への影響はありますか？',
        type: 'hybrid' as QuestionType,
        category: 'incident',
        tags: ['生活影響', '健康'],
        scaleLabel: '影響（1:大きい → 5:なし）',
        textLabel: '具体的な症状',
        textPlaceholder: '不眠、食欲不振、集中力低下など...'
      }
    ],
    
    incident_review: [
      {
        id: 'incident_review_1',
        text: 'インシデントの振り返り（事実確認）',
        type: 'text' as QuestionType,
        category: 'incident',
        tags: ['振り返り', '事実確認'],
        isRequired: true,
        placeholder: '何が起きたか、自分の行動、気づいた時の状況など（責めるものではありません）...'
      },
      {
        id: 'incident_review_2',
        text: '原因と考えられる要因を一緒に分析しましょう',
        type: 'checklist' as QuestionType,
        category: 'incident',
        tags: ['原因分析', '要因'],
        options: [
          '知識・技術不足',
          '確認不足',
          'コミュニケーション不足',
          '疲労・体調不良',
          '時間的プレッシャー',
          '人員不足',
          'システム・手順の問題',
          '環境要因',
          '偶発的要因'
        ]
      },
      {
        id: 'incident_review_3',
        text: '同様のインシデントを防ぐための改善案',
        type: 'text' as QuestionType,
        category: 'incident',
        tags: ['改善案', '再発防止'],
        isRequired: true,
        placeholder: 'ダブルチェック、手順の見直し、システム改善など...'
      }
    ],
    
    emotional_support: [
      {
        id: 'incident_emotion_1',
        text: '現在最も辛いと感じていることは何ですか？',
        type: 'text' as QuestionType,
        category: 'incident',
        tags: ['感情', '辛さ'],
        isRequired: false,
        placeholder: '患者・家族への申し訳なさ、同僚への迷惑、自信喪失など...'
      },
      {
        id: 'incident_emotion_2',
        text: '周囲からのサポートは感じられていますか？',
        type: 'hybrid' as QuestionType,
        category: 'incident',
        tags: ['サポート', '周囲'],
        scaleLabel: 'サポート（1:孤立 → 5:十分）',
        textLabel: '具体的なサポート',
        textPlaceholder: '上司の理解、同僚の励まし、家族の支えなど...'
      },
      {
        id: 'incident_emotion_3',
        text: '専門的な心理サポートの必要性',
        type: 'hybrid' as QuestionType,
        category: 'incident',
        tags: ['心理支援', '専門家'],
        scaleLabel: '必要性（1:不要 → 5:必要）',
        textLabel: '希望する支援',
        textPlaceholder: 'カウンセリング、ピアサポート、研修など...'
      }
    ],
    
    return_to_duty: [
      {
        id: 'incident_return_1',
        text: '通常業務への復帰準備はできていますか？',
        type: 'hybrid' as QuestionType,
        category: 'incident',
        tags: ['復帰', '準備'],
        isRequired: true,
        scaleLabel: '準備度（1:未準備 → 5:準備完了）',
        textLabel: '不安な点',
        textPlaceholder: '同じ業務への恐怖、スキル不安、周囲の目など...'
      },
      {
        id: 'incident_return_2',
        text: '業務復帰にあたって希望する配慮',
        type: 'checklist' as QuestionType,
        category: 'incident',
        tags: ['配慮', '希望'],
        options: [
          '段階的な業務復帰',
          '一時的な業務変更',
          'ペア体制での業務',
          '定期的なフォロー面談',
          '追加研修の実施',
          'メンターの配置',
          '同様業務の一時回避'
        ]
      },
      {
        id: 'incident_return_3',
        text: '今後の成長につなげるための目標',
        type: 'text' as QuestionType,
        category: 'incident',
        tags: ['成長', '目標'],
        placeholder: 'この経験を活かして、安全文化の推進、後輩指導など...'
      }
    ]
  }
};

/**
 * 特別面談シート生成クラス
 */
export class SpecialInterviewGenerator {
  
  /**
   * 予約情報から特別面談シートを生成
   */
  static generateFromReservation(
    reservation: any,
    staffProfile: any
  ): GeneratedBankSheet {
    // 予約情報からパラメータを抽出
    const params: SpecialInterviewParams = {
      interviewType: 'special' as InterviewType,
      specialType: this.extractSpecialType(reservation),
      duration: reservation.duration || 45,
      staffLevel: staffProfile.experienceLevel,
      jobRole: staffProfile.profession,
      facilityType: staffProfile.facility,
      
      // 退職面談用
      exitReason: reservation.exitReason,
      exitDate: reservation.exitDate,
      yearsOfService: staffProfile.yearsOfService,
      hasHandoverPlan: reservation.hasHandoverPlan,
      
      // 復職面談用
      returnReason: reservation.returnReason,
      absenceDuration: reservation.absenceDuration,
      returnDate: reservation.returnDate,
      needsAccommodation: reservation.needsAccommodation,
      medicalClearance: reservation.medicalClearance,
      
      // インシデント面談用
      incidentLevel: reservation.incidentLevel,
      incidentDate: reservation.incidentDate,
      hasReportSubmitted: reservation.hasReportSubmitted,
      emotionalImpact: reservation.emotionalImpact,
      needsPsychologicalSupport: reservation.needsPsychologicalSupport
    };

    return this.generate(params);
  }

  /**
   * 特別面談シートを生成
   */
  static generate(params: SpecialInterviewParams): GeneratedBankSheet {
    const sections: BankSection[] = [];
    
    switch (params.specialType) {
      case 'exit':
        sections.push(...this.createExitInterviewSections(params));
        break;
        
      case 'return_to_work':
        sections.push(...this.createReturnToWorkSections(params));
        break;
        
      case 'incident_followup':
        sections.push(...this.createIncidentFollowupSections(params));
        break;
    }

    // 時間配分を調整
    const adjustedSections = this.adjustTimeAllocation(sections, params.duration);

    return {
      id: `special_${params.specialType}_${Date.now()}`,
      title: this.generateTitle(params),
      type: 'special' as InterviewType,
      subType: params.specialType,
      duration: params.duration,
      sections: adjustedSections,
      totalQuestions: adjustedSections.reduce((sum, s) => sum + s.questions.length, 0),
      generatedAt: new Date(),
      metadata: {
        specialType: params.specialType,
        exitReason: params.exitReason,
        returnReason: params.returnReason,
        incidentLevel: params.incidentLevel
      }
    };
  }

  /**
   * 退職面談のセクション作成
   */
  private static createExitInterviewSections(params: SpecialInterviewParams): BankSection[] {
    const sections: BankSection[] = [];
    const templates = SPECIAL_INTERVIEW_TEMPLATES.exit_interview;
    
    // 1. 導入セクション（5分）
    sections.push({
      id: 'exit_introduction',
      title: '導入・振り返り',
      description: '退職の経緯と在職期間の振り返り',
      duration: 5,
      questions: this.convertQuestions(templates.introduction),
      order: 1
    });
    
    // 2. 退職理由詳細セクション（10-15分）
    sections.push({
      id: 'exit_reasons',
      title: '退職理由の詳細確認',
      description: '退職に至った理由の深掘り',
      duration: params.duration >= 45 ? 15 : 10,
      questions: this.convertQuestions(templates.exit_reasons),
      order: 2
    });
    
    // 3. 職場環境評価セクション（10-12分）
    sections.push({
      id: 'workplace_evaluation',
      title: '職場環境の評価',
      description: '各項目の満足度と具体的な評価',
      duration: params.duration >= 45 ? 12 : 10,
      questions: this.convertQuestions(templates.workplace_evaluation),
      order: 3
    });
    
    // 4. 改善提案セクション（8-10分）
    sections.push({
      id: 'improvement_suggestions',
      title: '組織への改善提案',
      description: '今後の組織改善のための提案',
      duration: params.duration >= 45 ? 10 : 8,
      questions: this.convertQuestions(templates.improvement_suggestions),
      order: 4
    });
    
    // 5. 引き継ぎ確認セクション（5-7分）
    if (params.hasHandoverPlan !== false) {
      sections.push({
        id: 'handover',
        title: '引き継ぎ・最終確認',
        description: '業務引き継ぎと残務処理の確認',
        duration: params.duration >= 45 ? 7 : 5,
        questions: this.convertQuestions(templates.handover),
        order: 5
      });
    }
    
    // 6. クロージング（3分）
    sections.push(this.createClosingSection('exit', params));
    
    return sections;
  }

  /**
   * 復職面談のセクション作成
   */
  private static createReturnToWorkSections(params: SpecialInterviewParams): BankSection[] {
    const sections: BankSection[] = [];
    const templates = SPECIAL_INTERVIEW_TEMPLATES.return_to_work;
    
    // 1. 導入・体調確認セクション（7-10分）
    sections.push({
      id: 'return_introduction',
      title: '復職のご挨拶・体調確認',
      description: '温かく迎え入れ、現在の状況を確認',
      duration: params.duration >= 45 ? 10 : 7,
      questions: this.convertQuestions(templates.introduction),
      order: 1
    });
    
    // 2. 医学的配慮確認セクション（5-8分）
    if (params.medicalClearance !== false) {
      sections.push({
        id: 'medical_clearance',
        title: '医学的配慮事項の確認',
        description: '主治医の指示と必要な配慮の確認',
        duration: params.duration >= 45 ? 8 : 5,
        questions: this.convertQuestions(templates.medical_clearance),
        order: 2
      });
    }
    
    // 3. 勤務体制相談セクション（10-12分）
    sections.push({
      id: 'work_arrangement',
      title: '勤務体制の相談',
      description: '無理のない勤務体制を設定',
      duration: params.duration >= 45 ? 12 : 10,
      questions: this.convertQuestions(templates.work_arrangement),
      order: 3
    });
    
    // 4. サポート体制確認セクション（8-10分）
    sections.push({
      id: 'support_needs',
      title: 'サポート体制の確認',
      description: '必要な支援と環境整備',
      duration: params.duration >= 45 ? 10 : 8,
      questions: this.convertQuestions(templates.support_needs),
      order: 4
    });
    
    // 5. 復職計画策定セクション（5分）
    sections.push({
      id: 'return_plan',
      title: '復職計画の策定',
      description: '段階的な復職スケジュール',
      duration: 5,
      questions: [
        {
          id: 'plan_1',
          text: '復職後1ヶ月間の具体的計画',
          type: 'text' as QuestionType,
          category: 'return',
          tags: ['計画', 'スケジュール'],
          isRequired: true,
          placeholder: '週ごとの勤務時間、業務内容、目標など...'
        },
        {
          id: 'plan_2',
          text: '定期フォロー面談の設定',
          type: 'text' as QuestionType,
          category: 'return',
          tags: ['フォロー', '面談'],
          isRequired: true,
          placeholder: '1週間後、2週間後、1ヶ月後の面談予定...'
        }
      ],
      order: 5
    });
    
    // 6. クロージング（3分）
    sections.push(this.createClosingSection('return', params));
    
    return sections;
  }

  /**
   * インシデント後面談のセクション作成
   */
  private static createIncidentFollowupSections(params: SpecialInterviewParams): BankSection[] {
    const sections: BankSection[] = [];
    const templates = SPECIAL_INTERVIEW_TEMPLATES.incident_followup;
    
    // 1. 導入・心境確認セクション（7-10分）
    sections.push({
      id: 'incident_introduction',
      title: '心境の確認と受け止め',
      description: '現在の心理状態と生活への影響',
      duration: params.duration >= 45 ? 10 : 7,
      questions: this.convertQuestions(templates.introduction),
      order: 1
    });
    
    // 2. インシデント振り返りセクション（10-12分）
    sections.push({
      id: 'incident_review',
      title: 'インシデントの振り返りと分析',
      description: '事実確認と原因分析（責めるものではない）',
      duration: params.duration >= 45 ? 12 : 10,
      questions: this.convertQuestions(templates.incident_review),
      order: 2
    });
    
    // 3. 心理的サポートセクション（8-10分）
    if (params.emotionalImpact === 'high' || params.needsPsychologicalSupport) {
      sections.push({
        id: 'emotional_support',
        title: '心理的サポート',
        description: '感情の受け止めと必要な支援',
        duration: params.duration >= 45 ? 10 : 8,
        questions: this.convertQuestions(templates.emotional_support),
        order: 3
      });
    }
    
    // 4. 業務復帰計画セクション（8-10分）
    sections.push({
      id: 'return_to_duty',
      title: '業務復帰への準備',
      description: '通常業務への段階的復帰',
      duration: params.duration >= 45 ? 10 : 8,
      questions: this.convertQuestions(templates.return_to_duty),
      order: 4
    });
    
    // 5. 再発防止策セクション（5-7分）
    sections.push({
      id: 'prevention',
      title: '再発防止と学習',
      description: '組織的な改善と個人の成長',
      duration: params.duration >= 45 ? 7 : 5,
      questions: [
        {
          id: 'prevent_1',
          text: '組織として実施する再発防止策',
          type: 'checklist' as QuestionType,
          category: 'incident',
          tags: ['再発防止', '組織'],
          options: [
            '手順書の見直し',
            'ダブルチェック体制',
            '教育研修の実施',
            'システム改善',
            '情報共有の強化',
            '定期的な振り返り'
          ]
        },
        {
          id: 'prevent_2',
          text: 'この経験から学んだこと',
          type: 'text' as QuestionType,
          category: 'incident',
          tags: ['学習', '成長'],
          placeholder: '気づき、教訓、今後活かしたいことなど...'
        }
      ],
      order: 5
    });
    
    // 6. クロージング（3分）
    sections.push(this.createClosingSection('incident', params));
    
    return sections;
  }

  /**
   * クロージングセクション作成
   */
  private static createClosingSection(
    type: 'exit' | 'return' | 'incident',
    params: SpecialInterviewParams
  ): BankSection {
    const closingQuestions: BankQuestion[] = [];
    
    switch (type) {
      case 'exit':
        closingQuestions.push(
          {
            id: 'exit_close_1',
            text: '最後に組織へのメッセージがあればお聞かせください',
            type: 'text' as QuestionType,
            category: 'closing',
            tags: ['メッセージ', '最後'],
            placeholder: '感謝の言葉、エール、思い出など...'
          },
          {
            id: 'exit_close_2',
            text: '退職後も何かあればご相談ください',
            type: 'text' as QuestionType,
            category: 'closing',
            tags: ['今後', '関係'],
            isReadOnly: true,
            defaultValue: '長い間お疲れ様でした。新天地でのご活躍を心よりお祈りしています。'
          }
        );
        break;
        
      case 'return':
        closingQuestions.push(
          {
            id: 'return_close_1',
            text: '復職にあたっての意気込みをお聞かせください',
            type: 'text' as QuestionType,
            category: 'closing',
            tags: ['意気込み', '決意'],
            placeholder: '無理せず、徐々に慣れていきたい...'
          },
          {
            id: 'return_close_2',
            text: '何か心配なことがあればいつでも相談してください',
            type: 'text' as QuestionType,
            category: 'closing',
            tags: ['サポート', '継続'],
            isReadOnly: true,
            defaultValue: 'お帰りなさい。無理せず、一緒に頑張っていきましょう。'
          }
        );
        break;
        
      case 'incident':
        closingQuestions.push(
          {
            id: 'incident_close_1',
            text: '今後に向けての決意や目標',
            type: 'text' as QuestionType,
            category: 'closing',
            tags: ['決意', '前向き'],
            placeholder: 'この経験を糧に、より安全な医療を...'
          },
          {
            id: 'incident_close_2',
            text: '組織全体で支えていきます',
            type: 'text' as QuestionType,
            category: 'closing',
            tags: ['支援', '励まし'],
            isReadOnly: true,
            defaultValue: '誰にでも起こりうることです。一緒に乗り越えていきましょう。'
          }
        );
        break;
    }
    
    closingQuestions.push({
      id: 'close_next',
      text: '次回フォローアップの予定',
      type: 'text' as QuestionType,
      category: 'closing',
      tags: ['次回', '予定'],
      isRequired: true,
      placeholder: '〇月〇日、状況確認と追加サポート...'
    });

    return {
      id: 'closing',
      title: 'クロージング',
      description: 'まとめと今後の確認',
      duration: 3,
      questions: closingQuestions,
      order: 99 // 最後に配置
    };
  }

  /**
   * テンプレート質問をBankQuestion形式に変換
   */
  private static convertQuestions(templateQuestions: any[]): BankQuestion[] {
    return templateQuestions.map(q => ({
      ...q,
      id: q.id || `q_${Date.now()}_${Math.random()}`,
      category: q.category || 'special',
      tags: q.tags || [],
      isRequired: q.isRequired !== undefined ? q.isRequired : false
    }));
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
  private static generateTitle(params: SpecialInterviewParams): string {
    const baseTitle = {
      exit: '退職面談',
      return_to_work: '復職面談',
      incident_followup: 'インシデント後面談'
    };
    
    let title = baseTitle[params.specialType];
    
    // 詳細情報を追加
    if (params.specialType === 'exit' && params.exitReason) {
      const reasonLabel = {
        career_change: 'キャリア',
        compensation: '待遇',
        work_environment: '環境',
        interpersonal: '人間関係',
        health: '健康',
        family: '家族',
        retirement: '定年',
        other: 'その他'
      };
      title += `（${reasonLabel[params.exitReason]}）`;
    }
    
    if (params.specialType === 'return_to_work' && params.returnReason) {
      const reasonLabel = {
        maternity: '産休・育休',
        medical: '病気療養',
        mental: 'メンタル',
        injury: '労災',
        family_care: '介護',
        study: '留学',
        other: 'その他'
      };
      title += `（${reasonLabel[params.returnReason]}後）`;
    }
    
    if (params.specialType === 'incident_followup' && params.incidentLevel) {
      title += `（レベル${params.incidentLevel.replace('level', '')}）`;
    }
    
    return `${title}（${params.duration}分）`;
  }

  /**
   * 予約情報から特別面談タイプを抽出
   */
  private static extractSpecialType(reservation: any): SpecialInterviewType {
    // 明示的な指定がある場合
    if (reservation.specialType) {
      return reservation.specialType;
    }
    
    // キーワードから推測
    const details = (reservation.consultationDetails || '').toLowerCase();
    if (details.includes('退職') || details.includes('離職')) return 'exit';
    if (details.includes('復職') || details.includes('復帰')) return 'return_to_work';
    if (details.includes('インシデント') || details.includes('事故')) return 'incident_followup';
    
    // デフォルト
    return 'exit';
  }
}