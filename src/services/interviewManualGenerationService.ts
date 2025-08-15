// 面談マニュアル動的生成サービス
// v4面談シートの内容を基に、選択した条件に応じた面談マニュアルを動的生成

import { 
  InterviewType, 
  InterviewCategory,
  InterviewClassification 
} from '@/types/interview';

// 職員レベル定義
export type StaffLevel = 
  | 'new'           // 新人（1年未満）
  | 'junior'        // 初級（1-2年）
  | 'general'       // 一般（2-3年）
  | 'midlevel'      // 中堅（3-5年）
  | 'senior'        // 上級（5-7年）
  | 'veteran'       // ベテラン（7-10年）
  | 'leader'        // リーダー（10年以上）
  | 'chief'         // 主任
  | 'manager';      // 管理職

// 職種定義
export type JobRole = 
  | 'nurse'               // 看護師
  | 'assistant-nurse'     // 准看護師
  | 'nursing-aide'        // 看護補助者
  | 'care-worker'         // 介護職員
  | 'care-assistant'      // 介護補助者
  | 'pt'                  // 理学療法士
  | 'ot'                  // 作業療法士
  | 'st';                 // 言語聴覚士

// 施設タイプ
export type FacilityType = 
  | 'acute'       // 急性期病院
  | 'chronic'     // 慢性期病院
  | 'roken'       // 介護老人保健施設
  | 'grouphome'   // グループホーム
  | 'outpatient'; // 外来

// 面談時間
export type InterviewDuration = 15 | 30 | 45 | 60;

// 面談マニュアル生成リクエスト
export interface ManualGenerationRequest {
  staffLevel: StaffLevel;
  jobRole: JobRole;
  facilityType: FacilityType;
  interviewType: InterviewType;
  interviewCategory?: InterviewCategory;
  duration: InterviewDuration;
  motivationType?: string;
  includeEvaluation?: boolean;
  customTopics?: string[];
}

// 生成された面談マニュアル
export interface GeneratedInterviewManual {
  id: string;
  title: string;
  generatedAt: Date;
  estimatedDuration: number;
  
  // 基本情報
  staffInfo: {
    level: StaffLevel;
    jobRole: JobRole;
    facility: FacilityType;
    levelDescription: string;
  };
  
  // 面談概要
  overview: {
    purpose: string;
    objectives: string[];
    keyPoints: string[];
    preparationItems: string[];
  };
  
  // セクション別ガイド
  sections: ManualSection[];
  
  // 時間配分
  timeAllocation: TimeAllocation[];
  
  // 注意事項
  guidelines: {
    dos: string[];
    donts: string[];
    tips: string[];
  };
}

// マニュアルセクション
export interface ManualSection {
  id: string;
  title: string;
  duration: number; // 分
  purpose: string;
  
  // 質問項目（詳細な説明付き）
  questions: DetailedQuestion[];
  
  // セクション別ガイダンス
  guidance: {
    introduction: string;
    keyPoints: string[];
    transitionPhrase: string;
  };
  
  // 評価基準（該当する場合）
  evaluationCriteria?: EvaluationCriteria[];
}

// 詳細な質問項目
export interface DetailedQuestion {
  id: string;
  question: string;
  type: 'open' | 'closed' | 'scale' | 'checklist' | 'evaluation';
  required: boolean;
  
  // 質問の詳細説明
  details: {
    purpose: string;           // この質問の目的
    askingTips: string[];      // 質問する際のコツ
    expectedAnswers?: string[];// 期待される回答例
    followUpQuestions?: string[]; // フォローアップ質問
    redFlags?: string[];       // 注意すべき回答
  };
  
  // 評価スケール（該当する場合）
  scale?: {
    min: number;
    max: number;
    labels: string[];
    description: string;
  };
  
  // チェックリスト（該当する場合）
  checklistItems?: {
    item: string;
    description: string;
  }[];
}

// 評価基準
export interface EvaluationCriteria {
  item: string;
  levels: {
    score: number;
    label: string;
    description: string;
    behaviors: string[];
  }[];
}

// 時間配分
export interface TimeAllocation {
  section: string;
  minutes: number;
  percentage: number;
}

// v4面談シートのテンプレートデータ
const V4_INTERVIEW_TEMPLATES = {
  // 一般看護師（2-3年目）30分版のテンプレート
  'general_nurse_30min': {
    sections: [
      {
        title: '業務遂行状況の評価',
        duration: 8,
        questions: [
          {
            question: '看護実践能力の評価',
            type: 'scale' as const,
            items: [
              '看護技術・スキル',
              'アセスメント能力',
              '患者対応・コミュニケーション',
              '多職種連携',
              '問題解決能力',
              '主体性・積極性'
            ],
            purpose: '看護師としての基本的な実践能力を多面的に評価',
            tips: [
              '具体的な事例を挙げながら評価を行う',
              '前回評価からの成長を確認',
              '強みと改善点を明確にする'
            ]
          },
          {
            question: '現在の業務内容と達成状況',
            type: 'open' as const,
            purpose: '担当業務の遂行状況と成果を確認',
            tips: [
              '具体的な数値や事例を引き出す',
              '本人の自己評価を聞く',
              '達成感を感じているか確認'
            ]
          },
          {
            question: 'この半年で成長した点・新たに身につけたスキル',
            type: 'open' as const,
            purpose: '成長実感と学習成果の確認',
            tips: [
              '小さな成長も見逃さない',
              '本人が気づいていない成長を伝える',
              '今後の成長課題につなげる'
            ]
          }
        ]
      },
      {
        title: '職員の現状確認（モチベーション・健康・エンゲージメント）',
        duration: 8,
        questions: [
          {
            question: '現在の仕事へのモチベーション',
            type: 'scale' as const,
            scale: { min: 1, max: 10 },
            purpose: 'モチベーションレベルの把握',
            tips: [
              '数値の理由を深掘りする',
              '前回との比較を行う',
              'モチベーションの源泉を探る'
            ]
          },
          {
            question: 'モチベーションに影響している要因',
            type: 'checklist' as const,
            items: [
              '業務内容・やりがい',
              '人間関係・チームワーク',
              '評価・承認',
              '成長実感',
              'ワークライフバランス',
              '給与・待遇',
              '職場環境',
              '将来性・キャリア'
            ],
            purpose: 'モチベーション要因の特定',
            tips: [
              'プラス要因とマイナス要因を整理',
              '改善可能な要因を特定',
              '組織として対応すべき点を把握'
            ]
          },
          {
            question: '心身の健康状態',
            type: 'open' as const,
            purpose: '健康面の課題早期発見',
            tips: [
              'プライバシーに配慮しながら聞く',
              '業務との関連性を確認',
              '必要に応じて産業医連携を提案'
            ]
          },
          {
            question: '組織への帰属意識・エンゲージメント',
            type: 'scale' as const,
            scale: { min: 1, max: 5 },
            purpose: '組織コミットメントの確認',
            tips: [
              '組織の理念への共感度を確認',
              'チームへの愛着を聞く',
              '長期的なキャリア意向を探る'
            ]
          }
        ]
      },
      {
        title: '課題・問題点の確認と対策',
        duration: 6,
        questions: [
          {
            question: '現在直面している業務上の課題',
            type: 'open' as const,
            purpose: '業務課題の把握と支援ニーズの確認',
            tips: [
              '具体的な困難事例を聞く',
              '解決に向けた本人の考えを確認',
              '必要なサポートを明確にする'
            ]
          },
          {
            question: '改善が必要と感じる組織・職場の問題',
            type: 'open' as const,
            purpose: '組織課題の発見',
            tips: [
              '建設的な意見を引き出す',
              '改善提案を促す',
              '実現可能性を一緒に考える'
            ]
          },
          {
            question: '必要な支援・サポート',
            type: 'checklist' as const,
            items: [
              '技術指導・教育',
              'メンタルサポート',
              '業務量調整',
              'キャリア相談',
              '人間関係の調整',
              '研修機会',
              '資格取得支援'
            ],
            purpose: '具体的な支援策の特定',
            tips: [
              '優先順位をつける',
              '実施時期を明確にする',
              'フォローアップ計画を立てる'
            ]
          }
        ]
      },
      {
        title: '今後の目標設定とアクションプラン',
        duration: 6,
        questions: [
          {
            question: '今後6ヶ月の個人目標（SMART目標）',
            type: 'open' as const,
            purpose: '明確な目標設定',
            tips: [
              'Specific（具体的）な目標か確認',
              'Measurable（測定可能）な指標を設定',
              'Achievable（達成可能）なレベルか検討',
              'Relevant（関連性）を確認',
              'Time-bound（期限）を明確化'
            ]
          },
          {
            question: '目標達成のための具体的アクション',
            type: 'open' as const,
            purpose: '実行計画の策定',
            tips: [
              '小さなステップに分解',
              '最初の一歩を明確にする',
              '定期的な振り返りポイントを設定'
            ]
          },
          {
            question: '組織からの支援事項',
            type: 'open' as const,
            purpose: '組織側のコミットメント明確化',
            tips: [
              '約束できることを明確に伝える',
              '実施時期を具体的に示す',
              '担当者を明確にする'
            ]
          }
        ]
      },
      {
        title: 'クロージング',
        duration: 2,
        questions: [
          {
            question: '面談の感想・フィードバック',
            type: 'open' as const,
            purpose: '面談の効果確認と改善',
            tips: [
              '率直な意見を歓迎する姿勢を示す',
              '次回への改善点を聞く',
              '面談の頻度希望を確認'
            ]
          },
          {
            question: '次回面談日程の確認',
            type: 'open' as const,
            purpose: '継続的なフォローアップ',
            tips: [
              '具体的な日程を決める',
              '次回までの宿題を確認',
              '連絡方法を確認'
            ]
          }
        ]
      }
    ]
  },
  
  // 新人看護師（1年未満）45分版
  'new_nurse_45min': {
    sections: [
      {
        title: '導入・アイスブレイク',
        duration: 5,
        questions: [
          {
            question: '最近の体調や気分はいかがですか？',
            type: 'open' as const,
            purpose: 'リラックスした雰囲気作り',
            tips: [
              '笑顔で温かく迎える',
              '緊張をほぐす雑談から始める',
              '面談の目的を改めて説明'
            ]
          }
        ]
      },
      {
        title: '新人看護師としての適応状況',
        duration: 10,
        questions: [
          {
            question: '入職してからの振り返り',
            type: 'open' as const,
            purpose: '新人の適応プロセス確認',
            tips: [
              '入職時の期待と現実のギャップを聞く',
              '良かった点を先に聞く',
              '困難だった経験を共感的に聞く'
            ]
          },
          {
            question: '職場環境への適応度',
            type: 'scale' as const,
            items: [
              '病棟の雰囲気・文化',
              '先輩との関係',
              '同期との関係',
              '多職種との連携',
              '勤務体制・シフト',
              '施設・設備の使い方'
            ],
            purpose: '環境適応の多面的評価',
            tips: [
              '低評価の項目は具体例を聞く',
              '改善可能な点を一緒に考える',
              'プリセプターとの関係を確認'
            ]
          },
          {
            question: 'リアリティショックの有無と対処',
            type: 'open' as const,
            purpose: '新人特有の課題把握',
            tips: [
              'リアリティショックは正常な反応と伝える',
              '乗り越えた先輩の例を共有',
              'サポート体制を再確認'
            ]
          }
        ]
      },
      {
        title: '基礎看護技術の習得状況',
        duration: 10,
        questions: [
          {
            question: '看護技術チェックリスト',
            type: 'checklist' as const,
            items: [
              'バイタルサイン測定',
              '採血・注射',
              '点滴管理',
              '吸引・酸素療法',
              '移乗・体位変換',
              '清潔ケア',
              '排泄ケア',
              '服薬管理',
              '記録・報告',
              '急変対応'
            ],
            purpose: '技術習得の進捗確認',
            tips: [
              '自信がある技術を褒める',
              '不安な技術の練習計画を立てる',
              '段階的な目標を設定'
            ]
          },
          {
            question: '最も自信がある技術と不安な技術',
            type: 'open' as const,
            purpose: '優先的な指導ニーズの特定',
            tips: [
              '不安の具体的な内容を聞く',
              '練習機会を提供する',
              '先輩のフォロー体制を確認'
            ]
          }
        ]
      },
      {
        title: '教育・研修の進捗',
        duration: 8,
        questions: [
          {
            question: '新人研修プログラムの理解度',
            type: 'scale' as const,
            scale: { min: 1, max: 5 },
            purpose: '研修効果の確認',
            tips: [
              '理解が難しい内容を特定',
              '追加学習の必要性を確認',
              '実践との結びつきを確認'
            ]
          },
          {
            question: 'プリセプターシップの効果',
            type: 'open' as const,
            purpose: '指導体制の評価',
            tips: [
              'プリセプターとの関係性を確認',
              '指導方法の適合性を評価',
              '改善要望を聞く'
            ]
          },
          {
            question: '自己学習の状況',
            type: 'open' as const,
            purpose: '主体的学習の確認',
            tips: [
              '学習方法をアドバイス',
              '参考書や資料を紹介',
              '勉強会への参加を促す'
            ]
          }
        ]
      },
      {
        title: 'メンタルヘルス・ストレス管理',
        duration: 7,
        questions: [
          {
            question: 'ストレスレベル（1-10）',
            type: 'scale' as const,
            scale: { min: 1, max: 10 },
            purpose: 'ストレス状況の把握',
            tips: [
              '高ストレスの場合は詳しく聞く',
              'ストレス対処法を一緒に考える',
              '必要に応じて専門的支援を提案'
            ]
          },
          {
            question: 'ストレスの主な要因',
            type: 'checklist' as const,
            items: [
              '業務量・時間',
              '技術不足への不安',
              '人間関係',
              '責任の重さ',
              '夜勤・シフト',
              '患者の死・重症',
              'インシデントへの恐れ',
              'プライベートとの両立'
            ],
            purpose: 'ストレス要因の特定',
            tips: [
              '複数要因の関連性を探る',
              '優先的に対処すべき要因を特定',
              '組織的な対応策を検討'
            ]
          },
          {
            question: 'ストレス対処法・セルフケア',
            type: 'open' as const,
            purpose: 'セルフケア能力の確認',
            tips: [
              '効果的な対処法を共有',
              '新しい方法を提案',
              'ワークライフバランスを確認'
            ]
          }
        ]
      },
      {
        title: '今後の成長計画',
        duration: 3,
        questions: [
          {
            question: '1年後の目標像',
            type: 'open' as const,
            purpose: '成長ビジョンの明確化',
            tips: [
              '具体的なイメージを描かせる',
              '実現可能な目標設定を支援',
              'ロールモデルを示す'
            ]
          },
          {
            question: '直近3ヶ月の重点目標',
            type: 'open' as const,
            purpose: '短期目標の設定',
            tips: [
              '達成可能な小目標を設定',
              '具体的な行動計画を立てる',
              'サポート体制を明確化'
            ]
          }
        ]
      },
      {
        title: 'まとめ・次回への申し送り',
        duration: 2,
        questions: [
          {
            question: '本日の面談のまとめ',
            type: 'open' as const,
            purpose: '相互理解の確認',
            tips: [
              '決定事項を確認',
              '宿題を明確化',
              '次回日程を決定'
            ]
          }
        ]
      }
    ]
  }
};

export class InterviewManualGenerationService {
  
  /**
   * 面談マニュアルを動的生成
   */
  static async generateManual(
    request: ManualGenerationRequest
  ): Promise<GeneratedInterviewManual> {
    
    // 1. テンプレートの選択または動的生成
    const template = this.selectOrGenerateTemplate(request);
    
    // 2. 職員レベルに応じた調整
    const adjustedSections = this.adjustForStaffLevel(template.sections, request);
    
    // 3. 動機タイプの質問を追加（該当する場合）
    if (request.motivationType) {
      adjustedSections.push(this.createMotivationSection(request.motivationType));
    }
    
    // 4. カスタムトピックの追加（指定された場合）
    if (request.customTopics && request.customTopics.length > 0) {
      adjustedSections.push(this.createCustomTopicsSection(request.customTopics));
    }
    
    // 5. 時間配分の計算
    const timeAllocation = this.calculateTimeAllocation(adjustedSections, request.duration);
    
    // 6. ガイドラインの生成
    const guidelines = this.generateGuidelines(request);
    
    // 7. マニュアルの組み立て
    return {
      id: `manual_${Date.now()}`,
      title: this.generateTitle(request),
      generatedAt: new Date(),
      estimatedDuration: request.duration,
      
      staffInfo: {
        level: request.staffLevel,
        jobRole: request.jobRole,
        facility: request.facilityType,
        levelDescription: this.getStaffLevelDescription(request.staffLevel)
      },
      
      overview: {
        purpose: this.generatePurpose(request),
        objectives: this.generateObjectives(request),
        keyPoints: this.generateKeyPoints(request),
        preparationItems: this.generatePreparationItems(request)
      },
      
      sections: adjustedSections,
      timeAllocation,
      guidelines
    };
  }
  
  /**
   * テンプレートの選択または生成
   */
  private static selectOrGenerateTemplate(request: ManualGenerationRequest): any {
    // 既存テンプレートのキー生成
    const templateKey = `${request.staffLevel}_${request.jobRole}_${request.duration}min`;
    
    // 既存テンプレートがあれば使用
    if ((V4_INTERVIEW_TEMPLATES as any)[templateKey]) {
      return (V4_INTERVIEW_TEMPLATES as any)[templateKey];
    }
    
    // なければ動的生成
    return this.generateDynamicTemplate(request);
  }
  
  /**
   * 動的テンプレート生成
   */
  private static generateDynamicTemplate(request: ManualGenerationRequest): any {
    const sections: ManualSection[] = [];
    const totalMinutes = request.duration;
    
    // 基本セクション構成（時間配分は面談時間に応じて調整）
    if (totalMinutes >= 45) {
      // 45分以上：フルセット
      sections.push(
        this.createSection('導入・アイスブレイク', Math.floor(totalMinutes * 0.1), [
          this.createQuestion('最近の状況確認', 'open', '関係構築とリラックス')
        ]),
        this.createSection('業務遂行状況', Math.floor(totalMinutes * 0.25), [
          this.createQuestion('業務達成度評価', 'scale', '業務パフォーマンス確認'),
          this.createQuestion('成長した点', 'open', '成長実感の確認')
        ]),
        this.createSection('モチベーション・健康', Math.floor(totalMinutes * 0.2), [
          this.createQuestion('モチベーションレベル', 'scale', 'モチベーション把握'),
          this.createQuestion('健康状態', 'open', '健康課題の早期発見')
        ]),
        this.createSection('課題と対策', Math.floor(totalMinutes * 0.2), [
          this.createQuestion('現在の課題', 'open', '支援ニーズの特定'),
          this.createQuestion('必要なサポート', 'checklist', '具体的支援の明確化')
        ]),
        this.createSection('目標設定', Math.floor(totalMinutes * 0.15), [
          this.createQuestion('今後の目標', 'open', '目標の明確化'),
          this.createQuestion('アクションプラン', 'open', '実行計画の策定')
        ]),
        this.createSection('クロージング', Math.floor(totalMinutes * 0.1), [
          this.createQuestion('面談の振り返り', 'open', '相互理解の確認')
        ])
      );
    } else if (totalMinutes >= 30) {
      // 30分：標準セット
      sections.push(
        this.createSection('導入', 3, [
          this.createQuestion('現況確認', 'open', '状況把握')
        ]),
        this.createSection('業務評価', Math.floor(totalMinutes * 0.3), [
          this.createQuestion('業務遂行状況', 'scale', 'パフォーマンス評価'),
          this.createQuestion('課題と成長', 'open', '成長と課題の確認')
        ]),
        this.createSection('モチベーション', Math.floor(totalMinutes * 0.25), [
          this.createQuestion('モチベーション状況', 'scale', 'エンゲージメント確認'),
          this.createQuestion('支援ニーズ', 'open', '必要な支援の特定')
        ]),
        this.createSection('目標設定', Math.floor(totalMinutes * 0.25), [
          this.createQuestion('短期目標', 'open', '目標設定'),
          this.createQuestion('次のステップ', 'open', 'アクション確認')
        ]),
        this.createSection('まとめ', Math.floor(totalMinutes * 0.1), [
          this.createQuestion('次回への申し送り', 'open', 'フォローアップ')
        ])
      );
    } else {
      // 15分：コンパクトセット
      sections.push(
        this.createSection('導入', 2, [
          this.createQuestion('簡単な現況確認', 'open', '状況把握')
        ]),
        this.createSection('重点確認', 8, [
          this.createQuestion('主要課題', 'open', '課題の特定'),
          this.createQuestion('必要な支援', 'checklist', '支援の明確化')
        ]),
        this.createSection('アクション', 4, [
          this.createQuestion('次のステップ', 'open', '行動計画')
        ]),
        this.createSection('まとめ', 1, [
          this.createQuestion('確認事項', 'open', '相互確認')
        ])
      );
    }
    
    return { sections };
  }
  
  /**
   * セクション作成ヘルパー
   */
  private static createSection(
    title: string, 
    duration: number, 
    questions: any[]
  ): ManualSection {
    return {
      id: `section_${title.replace(/[・\s]/g, '_')}`,
      title,
      duration,
      purpose: `${title}を通じた状況把握と支援`,
      questions: questions.map(q => this.expandQuestion(q)),
      guidance: {
        introduction: `${title}セクションを始めます。`,
        keyPoints: [`時間配分: ${duration}分`, '傾聴の姿勢を保つ', '具体例を引き出す'],
        transitionPhrase: '次のトピックに移りましょう。'
      }
    };
  }
  
  /**
   * 質問作成ヘルパー
   */
  private static createQuestion(
    question: string,
    type: 'open' | 'closed' | 'scale' | 'checklist',
    purpose: string
  ): any {
    return {
      question,
      type,
      purpose,
      tips: this.generateQuestionTips(type)
    };
  }
  
  /**
   * 質問の詳細情報を展開
   */
  private static expandQuestion(q: any): DetailedQuestion {
    return {
      id: `q_${Date.now()}_${Math.random()}`,
      question: q.question,
      type: q.type,
      required: true,
      details: {
        purpose: q.purpose,
        askingTips: q.tips || this.generateQuestionTips(q.type),
        expectedAnswers: this.generateExpectedAnswers(q.type, q.question),
        followUpQuestions: this.generateFollowUpQuestions(q.question),
        redFlags: this.generateRedFlags(q.question)
      },
      scale: q.scale,
      checklistItems: q.items?.map((item: string) => ({
        item,
        description: `${item}に関する確認`
      }))
    };
  }
  
  /**
   * 質問タイプ別のTips生成
   */
  private static generateQuestionTips(type: string): string[] {
    switch (type) {
      case 'open':
        return [
          'オープンエンドで質問する',
          '相手の話を遮らない',
          '沈黙を恐れない',
          '共感的な相槌を打つ'
        ];
      case 'scale':
        return [
          '数値の理由を必ず聞く',
          '前回との比較を行う',
          '改善のための具体策を探る'
        ];
      case 'checklist':
        return [
          '該当項目を深掘りする',
          '優先順位を確認する',
          '具体的な事例を聞く'
        ];
      default:
        return ['傾聴の姿勢を保つ'];
    }
  }
  
  /**
   * 期待される回答例の生成
   */
  private static generateExpectedAnswers(type: string, question: string): string[] {
    if (type === 'open') {
      return [
        '具体的な事例や経験',
        '感情や思いの表現',
        '改善提案や要望'
      ];
    }
    return [];
  }
  
  /**
   * フォローアップ質問の生成
   */
  private static generateFollowUpQuestions(question: string): string[] {
    return [
      'それについてもう少し詳しく教えてください',
      '具体的にはどのような場面でしたか？',
      'その時どう感じましたか？',
      '今後どうしていきたいですか？'
    ];
  }
  
  /**
   * 注意すべき回答の生成
   */
  private static generateRedFlags(question: string): string[] {
    const flags: string[] = [];
    
    if (question.includes('健康') || question.includes('ストレス')) {
      flags.push(
        '極度の疲労感の表現',
        '睡眠障害の訴え',
        '希死念慮の示唆',
        '極端な体重変化の報告'
      );
    }
    
    if (question.includes('モチベーション')) {
      flags.push(
        '極端に低い数値（1-2）',
        '急激な低下',
        '無気力・無関心な態度',
        '退職意向の示唆'
      );
    }
    
    if (question.includes('人間関係')) {
      flags.push(
        'ハラスメントの示唆',
        '孤立感の表現',
        '特定個人との深刻な対立',
        'チーム機能不全の兆候'
      );
    }
    
    return flags;
  }
  
  /**
   * 職員レベルに応じた調整
   */
  private static adjustForStaffLevel(
    sections: ManualSection[], 
    request: ManualGenerationRequest
  ): ManualSection[] {
    const adjusted = [...sections];
    
    // 新人の場合
    if (request.staffLevel === 'new') {
      // 適応・教育関連のセクションを追加
      const adaptationSection: ManualSection = {
        id: 'adaptation',
        title: '職場適応・教育進捗',
        duration: 10,
        purpose: '新人の適応状況と教育進捗の確認',
        questions: [
          this.expandQuestion({
            question: '職場環境への適応状況',
            type: 'scale',
            purpose: '環境適応の評価',
            tips: ['優しく丁寧に聞く', '不安を受け止める']
          }),
          this.expandQuestion({
            question: 'プリセプターとの関係',
            type: 'open',
            purpose: '指導体制の確認',
            tips: ['率直な意見を促す', '改善点を探る']
          }),
          this.expandQuestion({
            question: 'リアリティショックへの対処',
            type: 'open',
            purpose: '新人特有の課題把握',
            tips: ['共感的に聞く', '先輩の経験を共有']
          })
        ],
        guidance: {
          introduction: '新人としての適応状況を確認させてください。',
          keyPoints: ['温かい雰囲気づくり', '成長を認める', '不安を受け止める'],
          transitionPhrase: '順調に成長されていますね。次の話題に移りましょう。'
        }
      };
      
      // 2番目のセクションとして挿入
      adjusted.splice(1, 0, adaptationSection);
    }
    
    // ベテラン・リーダーの場合
    if (['veteran', 'leader', 'chief', 'manager'].includes(request.staffLevel)) {
      // 指導・マネジメント関連のセクションを追加
      const leadershipSection: ManualSection = {
        id: 'leadership',
        title: '指導・リーダーシップ',
        duration: 8,
        purpose: '指導力とチーム貢献の確認',
        questions: [
          this.expandQuestion({
            question: '後輩指導の状況と課題',
            type: 'open',
            purpose: '指導力の評価',
            tips: ['指導の工夫を聞く', '困難事例を共有']
          }),
          this.expandQuestion({
            question: 'チームへの貢献',
            type: 'open',
            purpose: 'リーダーシップの発揮',
            tips: ['具体的な貢献を確認', '今後の役割を検討']
          }),
          this.expandQuestion({
            question: '組織改善への提案',
            type: 'open',
            purpose: '組織発展への貢献',
            tips: ['建設的な提案を促す', '実現可能性を検討']
          })
        ],
        guidance: {
          introduction: 'リーダーとしての役割について話しましょう。',
          keyPoints: ['経験を尊重', '知見を引き出す', '組織への貢献を認める'],
          transitionPhrase: '貴重なご意見ありがとうございます。'
        }
      };
      
      adjusted.push(leadershipSection);
    }
    
    return adjusted;
  }
  
  /**
   * 動機タイプセクションの作成
   */
  private static createMotivationSection(motivationType: string): ManualSection {
    const questions: DetailedQuestion[] = [];
    
    // 基本質問
    questions.push(this.expandQuestion({
      question: '仕事でやりがいを感じる瞬間は？',
      type: 'open',
      purpose: 'モチベーション源泉の確認',
      tips: ['具体的な場面を聞く', '感情を引き出す']
    }));
    
    // 動機タイプ別質問
    switch (motivationType) {
      case 'achievement':
        questions.push(
          this.expandQuestion({
            question: '最近達成した目標と次の挑戦',
            type: 'open',
            purpose: '達成動機の確認',
            tips: ['達成感を共有', '新たな目標設定を支援']
          })
        );
        break;
        
      case 'affiliation':
        questions.push(
          this.expandQuestion({
            question: 'チームワークで嬉しかったこと',
            type: 'open',
            purpose: '親和動機の確認',
            tips: ['人間関係の重要性を確認', 'チーム貢献を評価']
          })
        );
        break;
        
      case 'power':
        questions.push(
          this.expandQuestion({
            question: '影響力を発揮できた場面',
            type: 'open',
            purpose: '権力動機の確認',
            tips: ['リーダーシップを評価', '影響力拡大の機会を探る']
          })
        );
        break;
        
      case 'autonomy':
        questions.push(
          this.expandQuestion({
            question: '自律的に進められている業務',
            type: 'open',
            purpose: '自律動機の確認',
            tips: ['裁量権を確認', '自由度向上の可能性を探る']
          })
        );
        break;
        
      case 'security':
        questions.push(
          this.expandQuestion({
            question: '安心して働ける環境要因',
            type: 'open',
            purpose: '安定動機の確認',
            tips: ['安全・安心を確認', '不安要素を取り除く']
          })
        );
        break;
    }
    
    return {
      id: 'motivation',
      title: 'モチベーション特性に応じた確認',
      duration: 5,
      purpose: '個人の動機特性に応じた支援',
      questions,
      guidance: {
        introduction: 'あなたのモチベーション特性に基づいてお聞きします。',
        keyPoints: ['動機タイプを意識した質問', '個別性を重視', '強みを活かす'],
        transitionPhrase: 'モチベーション維持のサポートをしていきます。'
      }
    };
  }
  
  /**
   * カスタムトピックセクションの作成
   */
  private static createCustomTopicsSection(topics: string[]): ManualSection {
    const questions = topics.map(topic => 
      this.expandQuestion({
        question: topic,
        type: 'open',
        purpose: 'カスタムトピックの確認',
        tips: ['柔軟に対応', '深掘りする']
      })
    );
    
    return {
      id: 'custom',
      title: '追加確認事項',
      duration: Math.min(topics.length * 3, 10),
      purpose: '個別の確認事項',
      questions,
      guidance: {
        introduction: '追加でいくつか確認させてください。',
        keyPoints: ['個別事情に配慮', '柔軟な対応'],
        transitionPhrase: 'ご協力ありがとうございます。'
      }
    };
  }
  
  /**
   * 時間配分の計算
   */
  private static calculateTimeAllocation(
    sections: ManualSection[], 
    totalDuration: number
  ): TimeAllocation[] {
    const allocations: TimeAllocation[] = [];
    const totalAllocated = sections.reduce((sum, s) => sum + s.duration, 0);
    
    sections.forEach(section => {
      allocations.push({
        section: section.title,
        minutes: section.duration,
        percentage: Math.round((section.duration / totalAllocated) * 100)
      });
    });
    
    return allocations;
  }
  
  /**
   * ガイドラインの生成
   */
  private static generateGuidelines(request: ManualGenerationRequest): any {
    return {
      dos: [
        '時間配分を意識する',
        '傾聴の姿勢を保つ',
        '具体例を引き出す',
        '共感的な対応をする',
        'ポジティブな点も必ず確認',
        '次回への宿題を明確にする'
      ],
      donts: [
        '批判的な態度を取らない',
        '一方的に話さない',
        '時間を大幅に超過しない',
        'プライバシーを侵害しない',
        '約束できないことを言わない'
      ],
      tips: this.generateTipsForLevel(request.staffLevel)
    };
  }
  
  /**
   * 職員レベル別のTips
   */
  private static generateTipsForLevel(level: StaffLevel): string[] {
    switch (level) {
      case 'new':
        return [
          '温かく迎える雰囲気作り',
          '小さな成長も見逃さない',
          '不安を否定せず受け止める',
          '先輩の経験談を共有'
        ];
      case 'junior':
      case 'general':
        return [
          '自律性を尊重',
          'キャリアビジョンを確認',
          '強みを伸ばす視点',
          'チャレンジを促す'
        ];
      case 'midlevel':
      case 'senior':
        return [
          '専門性を認める',
          '組織への貢献を評価',
          '後輩指導の役割を確認',
          '次のステップを一緒に考える'
        ];
      case 'veteran':
      case 'leader':
      case 'chief':
      case 'manager':
        return [
          '経験と知識を尊重',
          '組織改善の提案を歓迎',
          '次世代育成への期待を伝える',
          'ワークライフバランスに配慮'
        ];
      default:
        return ['個別性を重視した対応'];
    }
  }
  
  /**
   * タイトル生成
   */
  private static generateTitle(request: ManualGenerationRequest): string {
    const levelName = this.getStaffLevelName(request.staffLevel);
    const roleName = this.getJobRoleName(request.jobRole);
    const typeName = this.getInterviewTypeName(request.interviewType);
    
    return `${levelName}${roleName} ${typeName}面談マニュアル（${request.duration}分版）`;
  }
  
  /**
   * 目的の生成
   */
  private static generatePurpose(request: ManualGenerationRequest): string {
    const base = '職員の成長支援と組織改善のための定期的な対話';
    
    if (request.staffLevel === 'new') {
      return `${base}を通じて、新人の適応支援と早期育成を図る`;
    }
    
    if (['veteran', 'leader', 'chief', 'manager'].includes(request.staffLevel)) {
      return `${base}を通じて、組織の中核人材としての役割確認と組織発展への貢献を促進`;
    }
    
    return base;
  }
  
  /**
   * 目標の生成
   */
  private static generateObjectives(request: ManualGenerationRequest): string[] {
    const objectives = [
      '職員の現状把握と課題の特定',
      'モチベーション・エンゲージメントの確認',
      '必要な支援・サポートの明確化',
      '今後の目標設定とアクションプラン策定'
    ];
    
    if (request.staffLevel === 'new') {
      objectives.unshift('職場適応状況の確認');
    }
    
    if (request.includeEvaluation) {
      objectives.push('人事評価のフィードバック');
    }
    
    return objectives;
  }
  
  /**
   * キーポイントの生成
   */
  private static generateKeyPoints(request: ManualGenerationRequest): string[] {
    return [
      `面談時間: ${request.duration}分を厳守`,
      '双方向のコミュニケーションを重視',
      '心理的安全性の確保',
      '具体的なアクションの合意',
      'フォローアップの約束'
    ];
  }
  
  /**
   * 準備項目の生成
   */
  private static generatePreparationItems(request: ManualGenerationRequest): string[] {
    return [
      '前回面談記録の確認',
      '人事評価結果の準備',
      '研修受講履歴の確認',
      '勤怠・シフト状況の把握',
      'プライベートな面談場所の確保',
      '面談シートの印刷または端末準備'
    ];
  }
  
  // ヘルパーメソッド
  
  private static getStaffLevelName(level: StaffLevel): string {
    const names = {
      'new': '新人',
      'junior': '初級',
      'general': '一般',
      'midlevel': '中堅',
      'senior': '上級',
      'veteran': 'ベテラン',
      'leader': 'リーダー',
      'chief': '主任',
      'manager': '管理職'
    };
    return names[level] || '';
  }
  
  private static getStaffLevelDescription(level: StaffLevel): string {
    const descriptions = {
      'new': '入職1年未満の新人職員',
      'junior': '1-2年目の初級職員',
      'general': '2-3年目の一般職員',
      'midlevel': '3-5年目の中堅職員',
      'senior': '5-7年目の上級職員',
      'veteran': '7-10年目のベテラン職員',
      'leader': '10年以上のリーダー職員',
      'chief': '主任・チーフクラス',
      'manager': '師長・管理職クラス'
    };
    return descriptions[level] || '';
  }
  
  private static getJobRoleName(role: JobRole): string {
    const names = {
      'nurse': '看護師',
      'assistant-nurse': '准看護師',
      'nursing-aide': '看護補助者',
      'care-worker': '介護職員',
      'care-assistant': '介護補助者',
      'pt': '理学療法士',
      'ot': '作業療法士',
      'st': '言語聴覚士'
    };
    return names[role] || '';
  }
  
  private static getInterviewTypeName(type: InterviewType): string {
    const names = {
      'new_employee_monthly': '新入職員月次',
      'regular_annual': '定期',
      'management_biannual': '管理職半期',
      'return_to_work': '復職',
      'incident_followup': 'インシデント後',
      'exit_interview': '退職',
      'feedback': 'フィードバック',
      'career_support': 'キャリアサポート',
      'workplace_support': '職場環境',
      'individual_consultation': '個別相談'
    };
    return names[type] || '定期';
  }
}