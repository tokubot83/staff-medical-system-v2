// 動機タイプ診断サービス
// 面談での回答から動機タイプを判定し、職員カルテに反映

export type MotivationType = 
  | 'achievement'    // 達成動機：目標達成・成果重視
  | 'affiliation'    // 親和動機：人間関係・チームワーク重視
  | 'power'          // 権力動機：影響力・リーダーシップ重視
  | 'autonomy'       // 自律動機：自由度・独立性重視
  | 'security'       // 安定動機：安全・予測可能性重視
  | 'growth'         // 成長動機：学習・発展重視
  | 'contribution'   // 貢献動機：社会貢献・意義重視
  | 'recognition'    // 承認動機：評価・認知重視
  | 'mixed';         // 複合型：複数の動機が混在

// 動機タイプ診断質問
export interface MotivationQuestion {
  id: string;
  question: string;
  options: {
    value: string;
    label: string;
    motivationPoints: Record<MotivationType, number>;
  }[];
}

// 動機タイプ診断結果
export interface MotivationDiagnosisResult {
  primaryType: MotivationType;
  secondaryType?: MotivationType;
  scores: Record<MotivationType, number>;
  confidence: number; // 診断の確信度（0-100）
  diagnosisDate: Date;
  basedOnInterview?: string; // 診断の根拠となった面談ID
  
  // 詳細分析
  analysis: {
    strengths: string[];
    preferredEnvironment: string[];
    motivators: string[];
    demotivators: string[];
    managementTips: string[];
    developmentAreas: string[];
  };
  
  // 推奨アクション
  recommendations: {
    workAssignment: string[];
    teamComposition: string[];
    recognitionMethods: string[];
    careerPath: string[];
  };
}

// 職員マインド・志向性プロファイル
export interface StaffMindsetProfile {
  staffId: string;
  
  // 動機タイプ情報
  motivationType: {
    current: MotivationType;
    history: {
      type: MotivationType;
      diagnosedAt: Date;
      confidence: number;
      source: string; // 'interview' | 'assessment' | 'observation'
    }[];
    lastUpdated: Date;
  };
  
  // 価値観
  values: {
    core: string[];
    work: string[];
    life: string[];
  };
  
  // 志向性
  orientation: {
    careerOrientation: 'specialist' | 'generalist' | 'manager' | 'entrepreneur';
    learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
    workStyle: 'individual' | 'collaborative' | 'flexible';
    decisionStyle: 'analytical' | 'intuitive' | 'democratic' | 'directive';
  };
  
  // パーソナリティ特性
  personality: {
    bigFive?: {
      openness: number;
      conscientiousness: number;
      extraversion: number;
      agreeableness: number;
      neuroticism: number;
    };
    strengthsFinder?: string[];
    mbti?: string;
  };
  
  // エンゲージメント要因
  engagement: {
    currentLevel: number; // 1-10
    drivers: string[];
    barriers: string[];
    trends: {
      date: Date;
      level: number;
      notes?: string;
    }[];
  };
}

// 診断質問セット
const MOTIVATION_DIAGNOSIS_QUESTIONS: MotivationQuestion[] = [
  {
    id: 'q1',
    question: '仕事で最もやりがいを感じるのはどんな時ですか？',
    options: [
      {
        value: 'a',
        label: '困難な目標を達成した時',
        motivationPoints: { 
          achievement: 3, affiliation: 0, power: 1, autonomy: 1, 
          security: 0, growth: 2, contribution: 0, recognition: 1, mixed: 0 
        }
      },
      {
        value: 'b',
        label: 'チームで協力して成果を出した時',
        motivationPoints: { 
          achievement: 1, affiliation: 3, power: 0, autonomy: 0, 
          security: 1, growth: 0, contribution: 1, recognition: 0, mixed: 0 
        }
      },
      {
        value: 'c',
        label: '他者に良い影響を与えられた時',
        motivationPoints: { 
          achievement: 0, affiliation: 1, power: 3, autonomy: 0, 
          security: 0, growth: 0, contribution: 2, recognition: 1, mixed: 0 
        }
      },
      {
        value: 'd',
        label: '自分の判断で物事を進められた時',
        motivationPoints: { 
          achievement: 1, affiliation: 0, power: 1, autonomy: 3, 
          security: 0, growth: 1, contribution: 0, recognition: 0, mixed: 0 
        }
      }
    ]
  },
  {
    id: 'q2',
    question: '理想的な職場環境はどれですか？',
    options: [
      {
        value: 'a',
        label: '高い目標と成果が評価される環境',
        motivationPoints: { 
          achievement: 3, affiliation: 0, power: 1, autonomy: 0, 
          security: 0, growth: 1, contribution: 0, recognition: 2, mixed: 0 
        }
      },
      {
        value: 'b',
        label: '温かい人間関係と協力的な雰囲気',
        motivationPoints: { 
          achievement: 0, affiliation: 3, power: 0, autonomy: 0, 
          security: 2, growth: 0, contribution: 1, recognition: 0, mixed: 0 
        }
      },
      {
        value: 'c',
        label: '明確なルールと安定した環境',
        motivationPoints: { 
          achievement: 0, affiliation: 1, power: 0, autonomy: 0, 
          security: 3, growth: 0, contribution: 0, recognition: 0, mixed: 0 
        }
      },
      {
        value: 'd',
        label: '学習機会が豊富で成長できる環境',
        motivationPoints: { 
          achievement: 1, affiliation: 0, power: 0, autonomy: 1, 
          security: 0, growth: 3, contribution: 0, recognition: 0, mixed: 0 
        }
      }
    ]
  },
  {
    id: 'q3',
    question: 'キャリアで最も重視することは？',
    options: [
      {
        value: 'a',
        label: '専門性を高めて第一人者になる',
        motivationPoints: { 
          achievement: 2, affiliation: 0, power: 1, autonomy: 1, 
          security: 0, growth: 2, contribution: 0, recognition: 2, mixed: 0 
        }
      },
      {
        value: 'b',
        label: '良好な人間関係の中で長く働く',
        motivationPoints: { 
          achievement: 0, affiliation: 3, power: 0, autonomy: 0, 
          security: 2, growth: 0, contribution: 0, recognition: 0, mixed: 0 
        }
      },
      {
        value: 'c',
        label: '社会に意義ある貢献をする',
        motivationPoints: { 
          achievement: 1, affiliation: 0, power: 0, autonomy: 0, 
          security: 0, growth: 1, contribution: 3, recognition: 1, mixed: 0 
        }
      },
      {
        value: 'd',
        label: 'リーダーとして組織を導く',
        motivationPoints: { 
          achievement: 1, affiliation: 0, power: 3, autonomy: 1, 
          security: 0, growth: 1, contribution: 1, recognition: 1, mixed: 0 
        }
      }
    ]
  },
  {
    id: 'q4',
    question: 'ストレスを感じるのはどんな状況？',
    options: [
      {
        value: 'a',
        label: '目標が不明確で成果が見えない時',
        motivationPoints: { 
          achievement: 3, affiliation: 0, power: 1, autonomy: 0, 
          security: 0, growth: 1, contribution: 0, recognition: 1, mixed: 0 
        }
      },
      {
        value: 'b',
        label: '人間関係がギスギスしている時',
        motivationPoints: { 
          achievement: 0, affiliation: 3, power: 0, autonomy: 0, 
          security: 1, growth: 0, contribution: 0, recognition: 0, mixed: 0 
        }
      },
      {
        value: 'c',
        label: '裁量権がなく指示待ちの時',
        motivationPoints: { 
          achievement: 0, affiliation: 0, power: 2, autonomy: 3, 
          security: 0, growth: 0, contribution: 0, recognition: 0, mixed: 0 
        }
      },
      {
        value: 'd',
        label: '将来が不透明で不安定な時',
        motivationPoints: { 
          achievement: 0, affiliation: 0, power: 0, autonomy: 0, 
          security: 3, growth: 0, contribution: 0, recognition: 0, mixed: 0 
        }
      }
    ]
  },
  {
    id: 'q5',
    question: '褒められて嬉しいのは？',
    options: [
      {
        value: 'a',
        label: '優れた成果を認められた時',
        motivationPoints: { 
          achievement: 2, affiliation: 0, power: 0, autonomy: 0, 
          security: 0, growth: 0, contribution: 0, recognition: 3, mixed: 0 
        }
      },
      {
        value: 'b',
        label: 'チームへの貢献を評価された時',
        motivationPoints: { 
          achievement: 0, affiliation: 2, power: 0, autonomy: 0, 
          security: 0, growth: 0, contribution: 2, recognition: 1, mixed: 0 
        }
      },
      {
        value: 'c',
        label: '成長・進歩を認められた時',
        motivationPoints: { 
          achievement: 1, affiliation: 0, power: 0, autonomy: 0, 
          security: 0, growth: 3, contribution: 0, recognition: 1, mixed: 0 
        }
      },
      {
        value: 'd',
        label: 'リーダーシップを評価された時',
        motivationPoints: { 
          achievement: 0, affiliation: 0, power: 3, autonomy: 1, 
          security: 0, growth: 0, contribution: 0, recognition: 1, mixed: 0 
        }
      }
    ]
  }
];

export class MotivationTypeDiagnosisService {
  
  /**
   * 面談回答から動機タイプを診断
   */
  static diagnoseFromInterviewResponses(
    responses: Map<string, any>
  ): MotivationDiagnosisResult {
    const scores: Record<MotivationType, number> = {
      achievement: 0,
      affiliation: 0,
      power: 0,
      autonomy: 0,
      security: 0,
      growth: 0,
      contribution: 0,
      recognition: 0,
      mixed: 0
    };
    
    // 回答からスコアを集計
    responses.forEach((answer, questionId) => {
      const question = MOTIVATION_DIAGNOSIS_QUESTIONS.find(q => q.id === questionId);
      if (question) {
        const selectedOption = question.options.find(opt => opt.value === answer);
        if (selectedOption) {
          Object.entries(selectedOption.motivationPoints).forEach(([type, points]) => {
            scores[type as MotivationType] += points;
          });
        }
      }
    });
    
    // スコアの正規化（0-100）
    const maxScore = Math.max(...Object.values(scores));
    if (maxScore > 0) {
      Object.keys(scores).forEach(type => {
        scores[type as MotivationType] = Math.round((scores[type as MotivationType] / maxScore) * 100);
      });
    }
    
    // プライマリ・セカンダリタイプの判定
    const sortedTypes = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .map(([type]) => type as MotivationType);
    
    const primaryType = sortedTypes[0];
    const secondaryType = scores[sortedTypes[1]] > 60 ? sortedTypes[1] : undefined;
    
    // 確信度の計算（最高スコアと次点の差）
    const confidence = scores[primaryType] - (scores[sortedTypes[1]] || 0);
    
    // 分析結果の生成
    const analysis = this.generateAnalysis(primaryType, secondaryType);
    const recommendations = this.generateRecommendations(primaryType, secondaryType);
    
    return {
      primaryType,
      secondaryType,
      scores,
      confidence,
      diagnosisDate: new Date(),
      analysis,
      recommendations
    };
  }
  
  /**
   * 動機タイプ分析の生成
   */
  private static generateAnalysis(
    primary: MotivationType,
    secondary?: MotivationType
  ): MotivationDiagnosisResult['analysis'] {
    const analysisMap: Record<MotivationType, MotivationDiagnosisResult['analysis']> = {
      achievement: {
        strengths: ['目標達成力', '結果重視', '高い向上心', '競争力'],
        preferredEnvironment: ['明確な目標設定', '成果評価制度', 'チャレンジングな課題'],
        motivators: ['困難な目標', '達成の認知', '昇進機会', '成果報酬'],
        demotivators: ['不明確な目標', '評価の不公平', 'ルーティンワーク'],
        managementTips: ['高い目標設定', '定期的なフィードバック', '成果の可視化'],
        developmentAreas: ['協調性', '長期視点', 'プロセス重視']
      },
      affiliation: {
        strengths: ['チームワーク', '共感力', '協調性', '信頼構築'],
        preferredEnvironment: ['協力的な雰囲気', '温かい人間関係', 'チーム活動'],
        motivators: ['良好な人間関係', 'チーム成功', '感謝の言葉', '帰属感'],
        demotivators: ['対立', '孤立', '競争的環境', '人間関係の悪化'],
        managementTips: ['チーム配置重視', '関係性サポート', '協力機会創出'],
        developmentAreas: ['自己主張', '競争力', '個人決定']
      },
      power: {
        strengths: ['リーダーシップ', '影響力', '決断力', '戦略思考'],
        preferredEnvironment: ['権限委譲', 'リーダー役割', '意思決定参加'],
        motivators: ['影響力拡大', '責任増大', 'リーダー任命', '戦略参画'],
        demotivators: ['権限不足', '影響力低下', '従属的立場'],
        managementTips: ['リーダー機会提供', '権限委譲', '戦略会議参加'],
        developmentAreas: ['傾聴力', '協調性', '細部注意']
      },
      autonomy: {
        strengths: ['自律性', '独創性', '自己管理', '柔軟性'],
        preferredEnvironment: ['裁量権', '柔軟な働き方', '自由な発想'],
        motivators: ['自由度', '独立性', '創造的課題', '自己決定'],
        demotivators: ['過度な管理', '細かい指示', '画一的ルール'],
        managementTips: ['裁量権付与', '成果重視管理', '自由度確保'],
        developmentAreas: ['チーム協調', 'ルール遵守', '報告連絡']
      },
      security: {
        strengths: ['安定性', '慎重さ', '継続力', 'リスク管理'],
        preferredEnvironment: ['安定環境', '明確なルール', '予測可能性'],
        motivators: ['雇用安定', '明確な役割', '定期昇給', '福利厚生'],
        demotivators: ['不確実性', '頻繁な変更', 'リスク', '不安定'],
        managementTips: ['安定性強調', '段階的変化', 'セーフティネット'],
        developmentAreas: ['変化対応', 'リスクテイク', '革新性']
      },
      growth: {
        strengths: ['学習意欲', '適応力', '好奇心', '自己啓発'],
        preferredEnvironment: ['学習機会', '多様な経験', 'メンター制度'],
        motivators: ['新スキル習得', '研修機会', 'キャリア開発', '知識拡大'],
        demotivators: ['停滞', '学習機会不足', 'ルーティン'],
        managementTips: ['研修提供', 'ローテーション', 'メンタリング'],
        developmentAreas: ['専門深化', '継続性', '実践応用']
      },
      contribution: {
        strengths: ['使命感', '奉仕精神', '社会意識', '価値創造'],
        preferredEnvironment: ['意義ある仕事', '社会貢献', '価値共有'],
        motivators: ['社会的意義', '感謝', '価値実現', '貢献実感'],
        demotivators: ['意味不明な業務', '価値観相違', '利己的環境'],
        managementTips: ['意義説明', '貢献可視化', '価値共有'],
        developmentAreas: ['現実性', '効率性', '個人目標']
      },
      recognition: {
        strengths: ['向上心', 'プレゼンス', '自己PR', '実績重視'],
        preferredEnvironment: ['評価制度', '表彰機会', '可視化環境'],
        motivators: ['公的評価', '表彰', '昇進', '称賛'],
        demotivators: ['無視', '評価不足', '功績横取り'],
        managementTips: ['定期評価', '公的承認', '実績公表'],
        developmentAreas: ['内発的動機', 'チーム志向', '謙虚さ']
      },
      mixed: {
        strengths: ['バランス感覚', '多面性', '適応力', '柔軟性'],
        preferredEnvironment: ['多様な環境', 'バランス重視', '選択可能性'],
        motivators: ['状況に応じた動機', '多様な刺激', 'バランス'],
        demotivators: ['極端な環境', '画一的要求', '偏重'],
        managementTips: ['個別対応', '柔軟な管理', '多様な機会'],
        developmentAreas: ['専門特化', '一貫性', '深化']
      }
    };
    
    return analysisMap[primary];
  }
  
  /**
   * 推奨アクションの生成
   */
  private static generateRecommendations(
    primary: MotivationType,
    secondary?: MotivationType
  ): MotivationDiagnosisResult['recommendations'] {
    const recommendationsMap: Record<MotivationType, MotivationDiagnosisResult['recommendations']> = {
      achievement: {
        workAssignment: ['チャレンジングなプロジェクト', '目標明確な業務', '成果測定可能なタスク'],
        teamComposition: ['競争的なチーム', '高パフォーマー集団', '成果重視チーム'],
        recognitionMethods: ['成果表彰', '目標達成報奨', 'ランキング公表'],
        careerPath: ['スペシャリスト', 'プロジェクトマネージャー', '成果責任者']
      },
      affiliation: {
        workAssignment: ['チーム協働プロジェクト', '対人サポート業務', 'メンター役'],
        teamComposition: ['協力的チーム', '安定メンバー', '相互支援体制'],
        recognitionMethods: ['チーム表彰', '感謝カード', '仲間からの評価'],
        careerPath: ['チームリーダー', 'メンター', '人材育成担当']
      },
      power: {
        workAssignment: ['リーダーポジション', '戦略立案', '変革プロジェクト'],
        teamComposition: ['指導可能な部下', '影響力行使機会', '権限明確化'],
        recognitionMethods: ['リーダー任命', '権限拡大', '経営参画'],
        careerPath: ['管理職', '経営幹部', 'プロジェクトリーダー']
      },
      autonomy: {
        workAssignment: ['独立プロジェクト', '裁量権大きい業務', '創造的タスク'],
        teamComposition: ['自律的チーム', '最小限の管理', '結果責任型'],
        recognitionMethods: ['自由度拡大', '独立権限', '自己管理承認'],
        careerPath: ['専門職', 'フリーランス型', '独立部門責任者']
      },
      security: {
        workAssignment: ['定型業務', '継続プロジェクト', 'リスク低業務'],
        teamComposition: ['安定チーム', '長期メンバー', '明確な役割'],
        recognitionMethods: ['勤続表彰', '安定評価', '定期昇進'],
        careerPath: ['専門職（安定）', '定年までの計画', '段階的昇進']
      },
      growth: {
        workAssignment: ['新規プロジェクト', '学習要素多い業務', 'ローテーション'],
        teamComposition: ['多様なチーム', '学習機会豊富', 'メンター配置'],
        recognitionMethods: ['成長評価', 'スキル認定', '学習達成表彰'],
        careerPath: ['ジェネラリスト', 'キャリアチェンジ', '多能工']
      },
      contribution: {
        workAssignment: ['社会貢献プロジェクト', 'CSR活動', '価値創造業務'],
        teamComposition: ['使命共有チーム', '社会志向メンバー', '価値重視'],
        recognitionMethods: ['貢献表彰', '社会的評価', '価値実現承認'],
        careerPath: ['社会事業担当', 'CSR責任者', '理念推進役']
      },
      recognition: {
        workAssignment: ['注目プロジェクト', 'プレゼン機会', '代表業務'],
        teamComposition: ['高評価チーム', 'エリート集団', '注目部署'],
        recognitionMethods: ['公開表彰', 'メディア露出', '社内広報'],
        careerPath: ['広報担当', 'エース社員', '表彰常連']
      },
      mixed: {
        workAssignment: ['多様なプロジェクト', 'バランス型業務', '選択可能タスク'],
        teamComposition: ['多様性チーム', 'フレキシブル体制', 'ハイブリッド型'],
        recognitionMethods: ['多面評価', '個別対応', 'カスタマイズ評価'],
        careerPath: ['マルチキャリア', '複線型', '自由選択型']
      }
    };
    
    return recommendationsMap[primary];
  }
  
  /**
   * 職員カルテのマインド・志向性セクションを更新
   */
  static async updateStaffMindsetProfile(
    staffId: string,
    diagnosisResult: MotivationDiagnosisResult,
    interviewId?: string
  ): Promise<StaffMindsetProfile> {
    // 既存のプロファイルを取得（なければ新規作成）
    const existingProfile = await this.getStaffMindsetProfile(staffId);
    
    // プロファイルの更新
    const updatedProfile: StaffMindsetProfile = {
      staffId,
      
      motivationType: {
        current: diagnosisResult.primaryType,
        history: [
          ...(existingProfile?.motivationType.history || []),
          {
            type: diagnosisResult.primaryType,
            diagnosedAt: diagnosisResult.diagnosisDate,
            confidence: diagnosisResult.confidence,
            source: interviewId ? 'interview' : 'assessment'
          }
        ],
        lastUpdated: new Date()
      },
      
      values: existingProfile?.values || {
        core: this.extractValuesFromType(diagnosisResult.primaryType),
        work: [],
        life: []
      },
      
      orientation: existingProfile?.orientation || {
        careerOrientation: this.determineCareerOrientation(diagnosisResult.primaryType),
        learningStyle: 'visual',
        workStyle: this.determineWorkStyle(diagnosisResult.primaryType),
        decisionStyle: this.determineDecisionStyle(diagnosisResult.primaryType)
      },
      
      personality: existingProfile?.personality || {},
      
      engagement: {
        currentLevel: existingProfile?.engagement.currentLevel || 7,
        drivers: diagnosisResult.analysis.motivators,
        barriers: diagnosisResult.analysis.demotivators,
        trends: existingProfile?.engagement.trends || []
      }
    };
    
    // DBに保存
    await this.saveStaffMindsetProfile(updatedProfile);
    
    // 職員カルテUIに通知
    await this.notifyProfileUpdate(staffId, 'mindset', updatedProfile);
    
    return updatedProfile;
  }
  
  /**
   * 既存のマインドセットプロファイル取得
   */
  private static async getStaffMindsetProfile(staffId: string): Promise<StaffMindsetProfile | null> {
    // 実際にはDBから取得
    return null;
  }
  
  /**
   * マインドセットプロファイルの保存
   */
  private static async saveStaffMindsetProfile(profile: StaffMindsetProfile): Promise<void> {
    // DBに保存
    console.log('Saving mindset profile:', profile);
  }
  
  /**
   * プロファイル更新の通知
   */
  private static async notifyProfileUpdate(
    staffId: string,
    section: string,
    data: any
  ): Promise<void> {
    // UIコンポーネントに通知
    console.log('Notifying profile update:', staffId, section);
  }
  
  /**
   * 動機タイプから価値観を推定
   */
  private static extractValuesFromType(type: MotivationType): string[] {
    const valuesMap: Record<MotivationType, string[]> = {
      achievement: ['成果', '効率', '競争', '向上'],
      affiliation: ['協調', '信頼', '調和', '共感'],
      power: ['影響力', 'リーダーシップ', '責任', '統制'],
      autonomy: ['自由', '独立', '創造性', '自己決定'],
      security: ['安定', '予測可能性', '継続', '保護'],
      growth: ['学習', '発展', '変化', '可能性'],
      contribution: ['意義', '貢献', '価値', '使命'],
      recognition: ['評価', '承認', '地位', '名誉'],
      mixed: ['バランス', '多様性', '柔軟性', '適応']
    };
    
    return valuesMap[type];
  }
  
  /**
   * キャリア志向の判定
   */
  private static determineCareerOrientation(type: MotivationType): 'specialist' | 'generalist' | 'manager' | 'entrepreneur' {
    const orientationMap: Record<MotivationType, 'specialist' | 'generalist' | 'manager' | 'entrepreneur'> = {
      achievement: 'specialist',
      affiliation: 'generalist',
      power: 'manager',
      autonomy: 'entrepreneur',
      security: 'specialist',
      growth: 'generalist',
      contribution: 'specialist',
      recognition: 'manager',
      mixed: 'generalist'
    };
    
    return orientationMap[type];
  }
  
  /**
   * ワークスタイルの判定
   */
  private static determineWorkStyle(type: MotivationType): 'individual' | 'collaborative' | 'flexible' {
    if (['achievement', 'autonomy', 'recognition'].includes(type)) {
      return 'individual';
    }
    if (['affiliation', 'contribution'].includes(type)) {
      return 'collaborative';
    }
    return 'flexible';
  }
  
  /**
   * 意思決定スタイルの判定
   */
  private static determineDecisionStyle(type: MotivationType): 'analytical' | 'intuitive' | 'democratic' | 'directive' {
    const styleMap: Record<MotivationType, 'analytical' | 'intuitive' | 'democratic' | 'directive'> = {
      achievement: 'analytical',
      affiliation: 'democratic',
      power: 'directive',
      autonomy: 'intuitive',
      security: 'analytical',
      growth: 'intuitive',
      contribution: 'democratic',
      recognition: 'directive',
      mixed: 'analytical'
    };
    
    return styleMap[type];
  }
  
  /**
   * 診断質問の取得
   */
  static getQuestions(): MotivationQuestion[] {
    return MOTIVATION_DIAGNOSIS_QUESTIONS;
  }
  
  /**
   * 簡易診断（3問版）
   */
  static quickDiagnosis(answers: string[]): MotivationType {
    // 最初の3問だけで簡易判定
    const scores: Record<MotivationType, number> = {
      achievement: 0,
      affiliation: 0,
      power: 0,
      autonomy: 0,
      security: 0,
      growth: 0,
      contribution: 0,
      recognition: 0,
      mixed: 0
    };
    
    answers.forEach((answer, index) => {
      const question = MOTIVATION_DIAGNOSIS_QUESTIONS[index];
      const option = question.options.find(opt => opt.value === answer);
      if (option) {
        Object.entries(option.motivationPoints).forEach(([type, points]) => {
          scores[type as MotivationType] += points;
        });
      }
    });
    
    return Object.entries(scores)
      .sort(([, a], [, b]) => b - a)[0][0] as MotivationType;
  }
}