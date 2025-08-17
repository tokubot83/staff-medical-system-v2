// サポート面談動的生成サービス
// 職員からの面談申込に基づいて動的に面談マニュアルを生成

import { VoiceDriveInterviewRequest, VoiceDriveInterviewCategory } from './voicedriveIntegrationService';
import { StaffLevel, JobRole, FacilityType } from '@/types/staff-common';

// GeneratedInterviewManual型の定義（暫定）
export interface GeneratedInterviewManual {
  id: string;
  title: string;
  generatedAt: Date;
  estimatedDuration: number;
  staffInfo: any;
  overview: any;
  sections: any[];
  timeAllocation: any[];
  guidelines: any;
}
import { MotivationTypeDiagnosisService } from './motivationTypeDiagnosisService';

// サポート面談カテゴリ詳細定義
export interface SupportInterviewCategory {
  id: string;
  name: string;
  description: string;
  subcategories: {
    id: string;
    name: string;
    keywords: string[];
    suggestedQuestions: string[];
  }[];
  defaultDuration: number;
  urgencyWeight: number;
}

// サポート面談テンプレート
export interface SupportInterviewTemplate {
  categoryId: string;
  subcategoryId?: string;
  title: string;
  description: string;
  
  // 面談構成
  sections: {
    id: string;
    title: string;
    duration: number;
    questions: {
      id: string;
      text: string;
      type: 'open' | 'scale' | 'choice';
      required: boolean;
      followUps?: string[];
      tips?: string;
    }[];
  }[];
  
  // 面談のゴール
  objectives: string[];
  
  // 成功指標
  successIndicators: string[];
}

// サポート面談マニュアル
export interface SupportInterviewManual extends GeneratedInterviewManual {
  // VoiceDriveからの申込情報
  requestInfo: {
    requestId: string;
    category: string;
    subcategory?: string;
    consultationTopic: string;
    consultationDetails: string;
    urgency: string;
    preferredDuration?: number;
  };
  
  // カスタマイズされた質問
  customizedQuestions: {
    sectionId: string;
    questions: {
      id: string;
      text: string;
      rationale: string; // なぜこの質問を含めたか
      expectedInsights: string[]; // 期待される洞察
    }[];
  }[];
  
  // 事前準備
  preparation: {
    reviewPoints: string[]; // 事前に確認すべき点
    backgroundCheck: string[]; // 背景情報の確認
    environmentSetup: string[]; // 環境設定
  };
  
  // アプローチ戦略
  approachStrategy: {
    initialApproach: string;
    buildingRapport: string[];
    difficultTopics: {
      topic: string;
      approach: string;
    }[];
    closingStrategy: string;
  };
  
  // フォローアップガイドライン
  followUpGuidelines?: string[];
}

export class SupportInterviewService {
  // カテゴリ定義
  private static categories: SupportInterviewCategory[] = [
    {
      id: 'career',
      name: 'キャリア相談',
      description: 'キャリアパス、昇進、異動、スキル開発に関する相談',
      subcategories: [
        {
          id: 'promotion',
          name: '昇進・昇格',
          keywords: ['昇進', '昇格', 'リーダー', '管理職'],
          suggestedQuestions: [
            '昇進に向けて現在取り組んでいることは？',
            'リーダーシップで自信がある部分と不安な部分は？',
            '管理職として必要だと思うスキルは？'
          ]
        },
        {
          id: 'transfer',
          name: '異動・転職',
          keywords: ['異動', '転職', '部署変更', 'キャリアチェンジ'],
          suggestedQuestions: [
            '異動を希望する理由を教えてください',
            '新しい環境で期待することは？',
            '現在の職場で得た経験で活かしたいものは？'
          ]
        },
        {
          id: 'skill_development',
          name: 'スキル開発',
          keywords: ['研修', '勉強', '資格', 'スキルアップ'],
          suggestedQuestions: [
            '身につけたいスキルの優先順位は？',
            '学習のための時間をどう確保していますか？',
            'スキル習得後のキャリアビジョンは？'
          ]
        }
      ],
      defaultDuration: 45,
      urgencyWeight: 0.7
    },
    {
      id: 'workplace',
      name: '職場環境',
      description: '職場の環境、文化、チームワークに関する相談',
      subcategories: [
        {
          id: 'team_dynamics',
          name: 'チーム関係',
          keywords: ['チーム', '協力', '連携', 'コミュニケーション'],
          suggestedQuestions: [
            'チーム内でのあなたの役割をどう認識していますか？',
            'チームワークを改善するアイデアは？',
            '理想的なチーム環境とは？'
          ]
        },
        {
          id: 'work_environment',
          name: '労働環境',
          keywords: ['環境', '設備', '勤務体制', 'シフト'],
          suggestedQuestions: [
            '現在の労働環境で改善してほしい点は？',
            '働きやすさに影響している要因は？',
            '環境改善の具体的な提案は？'
          ]
        }
      ],
      defaultDuration: 30,
      urgencyWeight: 0.6
    },
    {
      id: 'relationships',
      name: '人間関係',
      description: '上司、同僚、部下との関係に関する相談',
      subcategories: [
        {
          id: 'supervisor',
          name: '上司との関係',
          keywords: ['上司', '上長', 'マネージャー', '指示'],
          suggestedQuestions: [
            '上司とのコミュニケーションで工夫していることは？',
            '上司からのフィードバックをどう受け止めていますか？',
            '理想的な上司像は？'
          ]
        },
        {
          id: 'peer',
          name: '同僚との関係',
          keywords: ['同僚', '仲間', 'チームメイト'],
          suggestedQuestions: [
            '同僚との協力関係で大切にしていることは？',
            '意見の相違をどう解決していますか？',
            'チーム内での自分の立ち位置は？'
          ]
        },
        {
          id: 'conflict',
          name: '対立・摩擦',
          keywords: ['対立', '摩擦', 'トラブル', '問題'],
          suggestedQuestions: [
            '対立の原因をどう分析していますか？',
            '解決のために試みたことは？',
            '第三者の介入は必要だと思いますか？'
          ]
        }
      ],
      defaultDuration: 45,
      urgencyWeight: 0.8
    },
    {
      id: 'worklife',
      name: 'ワークライフバランス',
      description: '仕事と私生活のバランスに関する相談',
      subcategories: [
        {
          id: 'overtime',
          name: '残業・労働時間',
          keywords: ['残業', '長時間', '過労', '時間外'],
          suggestedQuestions: [
            '残業の主な原因は何ですか？',
            '業務効率化のアイデアは？',
            'タイムマネジメントで工夫していることは？'
          ]
        },
        {
          id: 'leave',
          name: '休暇・休息',
          keywords: ['休暇', '有給', '休み', 'リフレッシュ'],
          suggestedQuestions: [
            '休暇を取得しづらい理由は？',
            'リフレッシュのために必要なものは？',
            '理想的な休暇の過ごし方は？'
          ]
        }
      ],
      defaultDuration: 30,
      urgencyWeight: 0.7
    },
    {
      id: 'health',
      name: '健康・メンタル',
      description: '身体的・精神的健康に関する相談',
      subcategories: [
        {
          id: 'stress',
          name: 'ストレス管理',
          keywords: ['ストレス', 'プレッシャー', '重圧', '負担'],
          suggestedQuestions: [
            'ストレスの主な原因を3つ挙げてください',
            'ストレス対処法で効果があったものは？',
            'サポートが必要な部分は？'
          ]
        },
        {
          id: 'mental_health',
          name: 'メンタルヘルス',
          keywords: ['不安', '憂鬱', '気分', '精神'],
          suggestedQuestions: [
            '気分の変化をどう認識していますか？',
            'メンタルヘルスケアで実践していることは？',
            '専門的なサポートは検討していますか？'
          ]
        },
        {
          id: 'physical_health',
          name: '身体的健康',
          keywords: ['体調', '疲労', '睡眠', '健康'],
          suggestedQuestions: [
            '体調管理で気をつけていることは？',
            '仕事が健康に与える影響は？',
            '健康維持のために必要なサポートは？'
          ]
        }
      ],
      defaultDuration: 45,
      urgencyWeight: 0.9
    }
  ];

  /**
   * VoiceDrive申込からサポート面談マニュアルを生成
   */
  static async generateFromVoiceDriveRequest(
    request: VoiceDriveInterviewRequest,
    staffProfile?: any
  ): Promise<SupportInterviewManual> {
    // 1. カテゴリとサブカテゴリの特定
    const { category, subcategory } = this.identifyCategoryFromRequest(request);
    
    // 2. テンプレートの選択
    const template = this.selectTemplate(category, subcategory, request);
    
    // 3. 質問のカスタマイズ
    const customizedQuestions = await this.customizeQuestions(
      template,
      request,
      staffProfile
    );
    
    // 4. アプローチ戦略の策定
    const approachStrategy = this.developApproachStrategy(
      request,
      category,
      staffProfile
    );
    
    // 5. 準備事項の生成
    const preparation = this.generatePreparation(request, category, staffProfile);
    
    // 6. 動的な追加質問の生成
    const dynamicQuestions = await this.generateDynamicQuestions(
      request.consultationTopic,
      request.consultationDetails,
      category
    );
    
    // マニュアルの組み立て
    const manual: SupportInterviewManual = {
      id: `support_${Date.now()}`,
      title: `サポート面談マニュアル - ${category.name}`,
      generatedAt: new Date(),
      estimatedDuration: 30, // デフォルト30分
      
      // 基本情報
      staffInfo: {
        level: this.estimateStaffLevel(request.position),
        jobRole: this.estimateJobRole(request.position),
        facility: 'acute' as FacilityType, // デフォルト値
        levelDescription: request.position || '一般職員'
      },
      
      // 面談概要
      overview: {
        purpose: `${category.name}に関するサポートと支援`,
        objectives: [
          '現状の問題・課題の明確化',
          '解決策の検討と提案',
          '今後のアクションプランの策定'
        ],
        keyPoints: [
          '傾聴と共感の姿勢を大切にする',
          '職員の自己決定を尊重する',
          '実現可能な解決策を一緒に考える'
        ],
        preparationItems: preparation.reviewPoints
      },
      
      // セクション（面談の流れ）
      sections: this.buildSections(template, customizedQuestions, dynamicQuestions),
      
      // 時間配分
      timeAllocation: this.calculateTimeAllocation(template, request) || [],
      
      // ガイドライン
      guidelines: {
        dos: [
          '安心できる環境づくり',
          '適切な質問と傾聴',
          '具体的な支援の提供'
        ],
        donts: [
          '批判や否定的な発言',
          '個人的な価値観の押し付け',
          '守秘義務の違反'
        ],
        tips: approachStrategy ? [
          approachStrategy.initialApproach,
          ...approachStrategy.buildingRapport
        ] : []
      },
      
      // リクエスト情報（SupportInterviewManual独自）
      requestInfo: {
        requestId: request.requestId,
        category: category.id,
        subcategory: subcategory?.id,
        consultationTopic: request.consultationTopic,
        consultationDetails: request.consultationDetails,
        urgency: request.urgency
      },
      
      // カスタマイズされた質問（SupportInterviewManual独自）
      customizedQuestions,
      
      // 事前準備（SupportInterviewManual独自）
      preparation,
      
      // アプローチ戦略（SupportInterviewManual独自）
      approachStrategy,
      
      // フォローアップガイドライン（SupportInterviewManual独自）
      followUpGuidelines: this.generateFollowUpGuidelines(category, request.urgency)
    };
    
    return manual;
  }

  /**
   * カテゴリとサブカテゴリの特定
   */
  private static identifyCategoryFromRequest(
    request: VoiceDriveInterviewRequest
  ): { category: SupportInterviewCategory, subcategory?: any } {
    // VoiceDriveカテゴリから内部カテゴリへのマッピング
    const categoryMap: Record<VoiceDriveInterviewCategory, string> = {
      'career': 'career',
      'workplace': 'workplace',
      'relationships': 'relationships',
      'worklife': 'worklife',
      'health': 'health',
      'skills': 'career',
      'evaluation': 'career',
      'other': 'workplace'
    };
    
    const categoryId = categoryMap[request.category] || 'workplace';
    const category = this.categories.find(c => c.id === categoryId)!;
    
    // サブカテゴリの特定（キーワードマッチング）
    let subcategory = null;
    const details = request.consultationDetails.toLowerCase();
    
    for (const sub of category.subcategories) {
      const hasKeyword = sub.keywords.some(keyword => 
        details.includes(keyword.toLowerCase())
      );
      if (hasKeyword) {
        subcategory = sub;
        break;
      }
    }
    
    return { category, subcategory };
  }

  /**
   * テンプレートの選択
   */
  private static selectTemplate(
    category: SupportInterviewCategory,
    subcategory: any,
    request: VoiceDriveInterviewRequest
  ): SupportInterviewTemplate {
    const template: SupportInterviewTemplate = {
      categoryId: category.id,
      subcategoryId: subcategory?.id,
      title: `${category.name}面談`,
      description: category.description,
      
      sections: [
        {
          id: 'opening',
          title: 'オープニング',
          duration: 5,
          questions: [
            {
              id: 'greeting',
              text: '本日はお時間をいただきありがとうございます。リラックスしてお話しください。',
              type: 'open',
              required: false,
              tips: '温かい雰囲気作りを心がける'
            },
            {
              id: 'purpose',
              text: `${request.consultationTopic}について、詳しくお聞かせください。`,
              type: 'open',
              required: true,
              followUps: ['いつ頃からそのように感じていますか？', 'きっかけは何かありましたか？']
            }
          ]
        },
        {
          id: 'main',
          title: 'メイントピック',
          duration: 25,
          questions: subcategory?.suggestedQuestions.map((q: string, i: number) => ({
            id: `main_${i}`,
            text: q,
            type: 'open' as const,
            required: true,
            tips: '相手のペースに合わせて深掘りする'
          })) || []
        },
        {
          id: 'exploration',
          title: '深掘り・探索',
          duration: 10,
          questions: [
            {
              id: 'explore_1',
              text: 'この状況をどう改善したいですか？',
              type: 'open',
              required: true
            },
            {
              id: 'explore_2',
              text: 'どのようなサポートがあれば助かりますか？',
              type: 'open',
              required: true
            }
          ]
        },
        {
          id: 'closing',
          title: 'クロージング',
          duration: 5,
          questions: [
            {
              id: 'summary',
              text: '本日お話しいただいた内容を整理させていただきます。',
              type: 'open',
              required: false
            },
            {
              id: 'next_steps',
              text: '次のステップについて確認しましょう。',
              type: 'open',
              required: true
            }
          ]
        }
      ],
      
      objectives: [
        '相談者の現状を正確に把握する',
        '問題の本質を明確にする',
        '実現可能な解決策を一緒に探る',
        '次のアクションを明確にする'
      ],
      
      successIndicators: [
        '相談者が安心して話せた',
        '問題が整理された',
        '次のステップが明確になった',
        '前向きな気持ちで終了できた'
      ]
    };
    
    return template;
  }

  /**
   * 質問のカスタマイズ
   */
  private static async customizeQuestions(
    template: SupportInterviewTemplate,
    request: VoiceDriveInterviewRequest,
    staffProfile?: any
  ): Promise<any[]> {
    const customized = [];
    
    for (const section of template.sections) {
      const customQuestions = section.questions.map(q => {
        // 相談内容に基づいて質問を調整
        let customText = q.text;
        
        // 緊急度が高い場合の調整
        if (request.urgency === 'urgent' || request.urgency === 'high') {
          if (q.id === 'purpose') {
            customText = `緊急性が高いとのことですが、${request.consultationTopic}について、今すぐ対処が必要な部分から教えてください。`;
          }
        }
        
        // 職員プロファイルに基づく調整
        if (staffProfile?.previousConsultations?.length > 0) {
          if (q.id === 'greeting') {
            customText = '前回の面談から時間が経ちましたが、その後いかがでしょうか？';
          }
        }
        
        return {
          id: q.id,
          text: customText,
          rationale: this.generateRationale(q, request),
          expectedInsights: this.generateExpectedInsights(q, request)
        };
      });
      
      customized.push({
        sectionId: section.id,
        questions: customQuestions
      });
    }
    
    return customized;
  }

  /**
   * アプローチ戦略の策定
   */
  private static developApproachStrategy(
    request: VoiceDriveInterviewRequest,
    category: SupportInterviewCategory,
    staffProfile?: any
  ): any {
    const strategy: {
      initialApproach: string;
      buildingRapport: string[];
      difficultTopics: { topic: string; approach: string }[];
      closingStrategy: string;
    } = {
      initialApproach: '',
      buildingRapport: [],
      difficultTopics: [],
      closingStrategy: ''
    };
    
    // 緊急度に応じた初期アプローチ
    switch (request.urgency) {
      case 'urgent':
        strategy.initialApproach = '緊急性を認識し、迅速かつ的確に核心に迫る';
        break;
      case 'high':
        strategy.initialApproach = '早期解決の必要性を共有し、具体的な対策を検討';
        break;
      case 'medium':
        strategy.initialApproach = 'じっくりと話を聞き、問題の全体像を把握';
        break;
      case 'low':
        strategy.initialApproach = 'リラックスした雰囲気で、予防的な観点から対話';
        break;
    }
    
    // ラポール構築
    strategy.buildingRapport = [
      '共感的な姿勢を示す',
      '相談者の感情を受け止める',
      '判断や評価を避ける',
      '安心して話せる環境を作る'
    ];
    
    // カテゴリ別の難しいトピックへのアプローチ
    if (category.id === 'relationships') {
      strategy.difficultTopics.push({
        topic: 'ハラスメントの可能性',
        approach: '慎重に事実確認を行い、必要に応じて専門部署と連携'
      });
    }
    
    if (category.id === 'health') {
      strategy.difficultTopics.push({
        topic: 'メンタルヘルスの深刻な問題',
        approach: '専門医療機関への紹介を視野に入れた対応'
      });
    }
    
    // クロージング戦略
    strategy.closingStrategy = '今後のサポート体制を明確にし、希望を持って終了する';
    
    return strategy;
  }

  /**
   * 準備事項の生成
   */
  private static generatePreparation(
    request: VoiceDriveInterviewRequest,
    category: SupportInterviewCategory,
    staffProfile?: any
  ): any {
    return {
      reviewPoints: [
        '過去の面談記録を確認',
        '所属部署の最近の状況を把握',
        '関連する社内制度やリソースを確認'
      ],
      
      backgroundCheck: [
        `${request.department}の組織体制`,
        '最近の部署内の変化や出来事',
        staffProfile ? '過去の相談履歴' : '初回相談であることを認識'
      ],
      
      environmentSetup: [
        'プライバシーが保たれる場所の確保',
        '中断されない時間の確保',
        request.preferredLocation === 'online' ? 'オンライン環境の準備' : '対面スペースの準備'
      ]
    };
  }

  /**
   * 動的質問の生成
   */
  private static async generateDynamicQuestions(
    topic: string,
    details: string,
    category: SupportInterviewCategory
  ): Promise<any[]> {
    const dynamicQuestions = [];
    
    // トピックと詳細から重要なキーワードを抽出
    const keywords = this.extractKeywords(details);
    
    // キーワードに基づく追加質問
    if (keywords.includes('退職')) {
      dynamicQuestions.push({
        text: '退職を考える前に、試してみたい改善策はありますか？',
        rationale: '退職意向の確認と代替案の検討'
      });
    }
    
    if (keywords.includes('ハラスメント')) {
      dynamicQuestions.push({
        text: '具体的にどのような行為がありましたか？（答えられる範囲で）',
        rationale: '事実確認と適切な対応の判断'
      });
    }
    
    if (keywords.includes('スキルアップ') || keywords.includes('研修')) {
      dynamicQuestions.push({
        text: '希望する研修やトレーニングは具体的にありますか？',
        rationale: 'キャリア開発支援の具体化'
      });
    }
    
    return dynamicQuestions;
  }

  /**
   * キーワード抽出
   */
  private static extractKeywords(text: string): string[] {
    const importantTerms = [
      '退職', 'ハラスメント', 'パワハラ', 'セクハラ',
      'ストレス', '残業', '人間関係', '評価',
      'スキルアップ', '研修', '昇進', '異動',
      'メンタル', '体調', '不安', '悩み'
    ];
    
    return importantTerms.filter(term => text.includes(term));
  }

  /**
   * 質問の根拠生成
   */
  private static generateRationale(
    question: any,
    request: VoiceDriveInterviewRequest
  ): string {
    const urgencyPrefix = request.urgency === 'urgent' 
      ? '緊急性を考慮し、' 
      : '';
      
    return `${urgencyPrefix}${request.consultationTopic}に関する具体的な状況を把握するため`;
  }

  /**
   * 期待される洞察の生成
   */
  private static generateExpectedInsights(
    question: any,
    request: VoiceDriveInterviewRequest
  ): string[] {
    return [
      '問題の根本原因',
      '本人の対処能力と限界',
      '必要な支援の種類と規模',
      '緊急介入の必要性'
    ];
  }

  /**
   * セクションの構築
   */
  private static buildSections(
    template: SupportInterviewTemplate,
    customizedQuestions: any[],
    dynamicQuestions: any[]
  ): any[] {
    const sections = [...template.sections];
    
    // 動的質問を適切なセクションに追加
    if (dynamicQuestions.length > 0) {
      const mainSection = sections.find(s => s.id === 'main');
      if (mainSection) {
        dynamicQuestions.forEach((dq, index) => {
          mainSection.questions.push({
            id: `dynamic_${index}`,
            text: dq.text,
            type: 'open',
            required: false,
            tips: dq.rationale
          });
        });
      }
    }
    
    return sections;
  }

  /**
   * 時間配分の計算
   */
  private static calculateTimeAllocation(
    template: SupportInterviewTemplate,
    request: VoiceDriveInterviewRequest
  ): any {
    const baseTime = template.sections.reduce((sum, s) => sum + s.duration, 0);
    const urgencyMultiplier = request.urgency === 'urgent' ? 1.2 : 1.0;
    
    return {
      introduction: 5,
      mainDiscussion: Math.floor(baseTime * 0.6 * urgencyMultiplier),
      problemSolving: Math.floor(baseTime * 0.25 * urgencyMultiplier),
      wrapUp: 5,
      buffer: 5
    };
  }

  /**
   * 面談時間の計算
   */
  private static calculateDuration(
    request: VoiceDriveInterviewRequest,
    category: SupportInterviewCategory
  ): number {
    let duration = category.defaultDuration;
    
    // 緊急度による調整
    if (request.urgency === 'urgent') {
      duration = Math.min(duration * 1.5, 60);
    }
    
    // 希望時間がある場合は考慮
    if (request.preferredDates?.length > 0) {
      // 実装では希望時間枠から計算
    }
    
    return duration;
  }

  /**
   * 評価ポイントの生成
   */
  private static generateEvaluationPoints(
    category: SupportInterviewCategory
  ): string[] {
    const basePoints = [
      '相談者の主訴を正確に理解できたか',
      '適切な共感とサポートを提供できたか',
      '具体的な解決策や次のステップを示せたか',
      '相談者が安心感を得られたか'
    ];
    
    // カテゴリ別の評価ポイント
    const categoryPoints: Record<string, string[]> = {
      'career': [
        'キャリアビジョンの明確化を支援できたか',
        '現実的なキャリアパスを提示できたか'
      ],
      'health': [
        '健康リスクを適切に評価できたか',
        '必要に応じて専門機関を紹介できたか'
      ],
      'relationships': [
        '人間関係の問題を客観的に整理できたか',
        'コミュニケーション改善の具体策を提供できたか'
      ]
    };
    
    return [...basePoints, ...(categoryPoints[category.id] || [])];
  }

  /**
   * フォローアップガイドラインの生成
   */
  private static generateFollowUpGuidelines(
    category: SupportInterviewCategory,
    urgency: string
  ): string[] {
    const guidelines = [];
    
    // 緊急度別のフォローアップ
    switch (urgency) {
      case 'urgent':
        guidelines.push('24時間以内に状況確認の連絡');
        guidelines.push('1週間以内に再面談の実施');
        break;
      case 'high':
        guidelines.push('3日以内にフォローアップ連絡');
        guidelines.push('2週間以内に進捗確認');
        break;
      case 'medium':
        guidelines.push('1週間後にメールで状況確認');
        guidelines.push('1ヶ月後に再面談の提案');
        break;
      case 'low':
        guidelines.push('2週間後に簡単な確認');
        guidelines.push('必要に応じて追加サポート');
        break;
    }
    
    // カテゴリ別のフォローアップ
    if (category.id === 'health') {
      guidelines.push('健康状態の定期的なモニタリング');
    }
    if (category.id === 'career') {
      guidelines.push('キャリア目標の進捗確認');
    }
    
    return guidelines;
  }

  /**
   * 面談実施後の処理
   */
  static async processInterviewCompletion(
    manual: SupportInterviewManual,
    interviewData: any,
    feedback: any
  ): Promise<void> {
    // 1. 面談データの保存
    await this.saveInterviewData(manual, interviewData);
    
    // 2. VoiceDriveへの結果送信
    await this.sendResultToVoiceDrive(manual.requestInfo.requestId, interviewData);
    
    // 3. フォローアップタスクの作成
    await this.createFollowUpTasks(manual, interviewData);
    
    // 4. 分析データの更新
    await this.updateAnalytics(manual, feedback);
  }

  /**
   * 面談データの保存
   */
  private static async saveInterviewData(
    manual: SupportInterviewManual,
    interviewData: any
  ): Promise<void> {
    // データベースへの保存処理
    console.log('Saving interview data:', {
      manualId: manual.id,
      requestId: manual.requestInfo.requestId,
      category: manual.requestInfo.category,
      completedAt: new Date()
    });
  }

  /**
   * VoiceDriveへの結果送信
   */
  private static async sendResultToVoiceDrive(
    requestId: string,
    interviewData: any
  ): Promise<void> {
    // VoiceDrive統合サービスを使用して結果を送信
    console.log('Sending results to VoiceDrive:', {
      requestId,
      status: 'completed'
    });
  }

  /**
   * フォローアップタスクの作成
   */
  private static async createFollowUpTasks(
    manual: SupportInterviewManual,
    interviewData: any
  ): Promise<void> {
    // フォローアップタスクの自動生成
    const tasks = manual.followUpGuidelines?.map(guideline => ({
      type: 'follow_up',
      description: guideline,
      dueDate: this.calculateDueDate(guideline),
      assignedTo: interviewData.interviewerId,
      relatedInterview: manual.id
    }));
    
    console.log('Creating follow-up tasks:', tasks);
  }

  /**
   * 期限日の計算
   */
  private static calculateDueDate(guideline: string): Date {
    const now = new Date();
    
    if (guideline.includes('24時間')) {
      return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }
    if (guideline.includes('3日')) {
      return new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    }
    if (guideline.includes('1週間')) {
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    }
    if (guideline.includes('2週間')) {
      return new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    }
    if (guideline.includes('1ヶ月')) {
      return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    }
    
    return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // デフォルト1週間
  }

  /**
   * 分析データの更新
   */
  private static async updateAnalytics(
    manual: SupportInterviewManual,
    feedback: any
  ): Promise<void> {
    // 面談の効果測定と分析
    const analytics = {
      interviewId: manual.id,
      category: manual.requestInfo.category,
      urgency: manual.requestInfo.urgency,
      duration: feedback.actualDuration,
      satisfactionScore: feedback.satisfactionScore,
      resolutionStatus: feedback.resolutionStatus,
      requiresFollowUp: feedback.requiresFollowUp
    };
    
    console.log('Updating analytics:', analytics);
  }

  /**
   * 職員レベルの推定
   */
  private static estimateStaffLevel(position?: string): StaffLevel {
    if (!position) return 'general';
    
    const positionLower = position.toLowerCase();
    if (positionLower.includes('新人') || positionLower.includes('新卒')) return 'new';
    if (positionLower.includes('初級') || positionLower.includes('ジュニア')) return 'junior';
    if (positionLower.includes('中堅')) return 'midlevel';
    if (positionLower.includes('上級') || positionLower.includes('シニア')) return 'senior';
    if (positionLower.includes('ベテラン')) return 'veteran';
    if (positionLower.includes('リーダー')) return 'leader';
    if (positionLower.includes('主任')) return 'chief';
    if (positionLower.includes('管理') || positionLower.includes('マネージャー')) return 'manager';
    
    return 'general';
  }

  /**
   * 職種の推定
   */
  private static estimateJobRole(position?: string): JobRole {
    if (!position) return 'nurse';
    
    const positionLower = position.toLowerCase();
    if (positionLower.includes('看護師')) {
      if (positionLower.includes('准')) return 'assistant-nurse';
      return 'nurse';
    }
    if (positionLower.includes('看護補助')) return 'nursing-aide';
    if (positionLower.includes('介護')) {
      if (positionLower.includes('補助')) return 'care-assistant';
      return 'care-worker';
    }
    if (positionLower.includes('理学療法') || positionLower.includes('pt')) return 'pt';
    if (positionLower.includes('作業療法') || positionLower.includes('ot')) return 'ot';
    if (positionLower.includes('言語聴覚') || positionLower.includes('st')) return 'st';
    
    return 'nurse';
  }
}