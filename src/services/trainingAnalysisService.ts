/**
 * 教育・研修分析サービス
 * 研修履歴、スキル成長、学習効果を統合分析
 * 横断分析システムとの連携用データ生成
 */

export interface TrainingAnalysisData {
  staffId: string;
  staffName: string;
  
  // 研修受講状況サマリー
  trainingSummary: {
    totalHours: number;              // 総研修時間
    completedCourses: number;        // 完了コース数
    inProgressCourses: number;       // 進行中コース数
    upcomingCourses: number;         // 予定コース数
    completionRate: number;          // 完了率（0-100）
    averageScore: number;            // 平均スコア
    lastTrainingDate: string;        // 最終研修日
    annualTarget: number;            // 年間目標時間
    currentProgress: number;         // 現在進捗率
  };
  
  // 研修履歴（時系列）
  trainingHistory: Array<{
    id: string;
    title: string;                   // 研修タイトル
    category: 'technical' | 'safety' | 'communication' | 'leadership' | 'compliance' | 'specialized';
    categoryLabel: string;           // カテゴリー日本語ラベル
    type: 'mandatory' | 'recommended' | 'optional' | 'certification';
    typeLabel: string;               // タイプ日本語ラベル
    startDate: string;
    endDate: string;
    duration: number;                // 時間
    status: 'completed' | 'in_progress' | 'scheduled' | 'overdue';
    score?: number;                  // 修了スコア
    instructor: string;              // 講師名
    location: string;                // 実施場所
    cost?: number;                   // 研修費用
    feedback?: string;               // フィードバック
    certificateIssued: boolean;      // 修了証発行有無
    relatedSkills: string[];         // 関連スキル
  }>;
  
  // スキル成長マップ
  skillGrowth: {
    technical: Array<{
      skill: string;                 // スキル名
      currentLevel: number;          // 現在レベル（0-100）
      targetLevel: number;           // 目標レベル
      growth: number;                // 成長度（前年比）
      trend: 'improving' | 'stable' | 'declining';
      benchmarkLevel: number;        // 組織ベンチマーク
      relatedTrainings: string[];    // 関連研修
      lastAssessed: string;          // 最終評価日
    }>;
    behavioral: Array<{
      skill: string;
      currentLevel: number;
      targetLevel: number;
      growth: number;
      trend: 'improving' | 'stable' | 'declining';
      benchmarkLevel: number;
      relatedTrainings: string[];
      lastAssessed: string;
    }>;
    leadership: Array<{
      skill: string;
      currentLevel: number;
      targetLevel: number;
      growth: number;
      trend: 'improving' | 'stable' | 'declining';
      benchmarkLevel: number;
      relatedTrainings: string[];
      lastAssessed: string;
    }>;
  };
  
  // 資格・認定状況
  certifications: Array<{
    id: string;
    name: string;                    // 資格名
    category: 'professional' | 'safety' | 'technical' | 'management' | 'specialized';
    categoryLabel: string;
    status: 'obtained' | 'in_progress' | 'expired' | 'planned';
    obtainedDate?: string;           // 取得日
    expiryDate?: string;             // 有効期限
    renewalRequired: boolean;        // 更新必要性
    renewalDate?: string;            // 更新予定日
    priority: 'high' | 'medium' | 'low';
    cost?: number;                   // 取得費用
    organizationSupport: boolean;    // 組織支援有無
    careerImpact: 'high' | 'medium' | 'low'; // キャリアへの影響度
  }>;
  
  // 研修計画・推奨
  trainingPlan: {
    nextQuarter: Array<{
      title: string;
      category: string;
      priority: 'high' | 'medium' | 'low';
      reason: string;               // 推奨理由
      estimatedDuration: number;    // 予想時間
      estimatedCost: number;        // 予想費用
      prerequisite?: string;        // 前提条件
      expectedOutcome: string;      // 期待される成果
      deadline?: string;            // 受講期限
    }>;
    annualGoal: {
      targetHours: number;          // 目標時間
      currentHours: number;         // 現在時間
      keyFocusAreas: string[];      // 重点領域
      expectedOutcomes: string[];   // 期待成果
      budgetAllocated: number;      // 割当予算
      priorityTrainings: string[];  // 優先研修
    };
  };
  
  // 学習効果測定
  learningEffectiveness: {
    knowledgeRetention: number;      // 知識定着率（0-100）
    skillApplication: number;        // スキル適用率
    performanceImprovement: number;  // パフォーマンス改善度
    behaviorChange: number;          // 行動変化度
    jobSatisfaction: number;         // 職務満足度向上
    overallEffectiveness: number;    // 総合効果
    roi: number;                     // 投資対効果（ROI）
    lastMeasured: string;            // 最終測定日
  };
  
  // 学習スタイル・嗜好
  learningProfile: {
    preferredStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
    preferredFormat: 'classroom' | 'online' | 'blended' | 'self_paced';
    learningPace: 'fast' | 'moderate' | 'slow';
    collaborationPreference: 'individual' | 'group' | 'mixed';
    motivationFactors: string[];     // 学習動機要因
    barriers: string[];              // 学習障壁
  };
  
  // 組織内での位置づけ
  organizationalContext: {
    departmentAverageHours: number;  // 部署平均時間
    organizationAverageHours: number; // 組織平均時間
    rankInDepartment: number;        // 部署内順位
    rankInOrganization: number;      // 組織内順位
    percentile: number;              // パーセンタイル
    benchmarkComparison: 'above' | 'at' | 'below'; // ベンチマーク比較
  };
}

// 研修カテゴリマッピング
const TRAINING_CATEGORIES = {
  technical: {
    label: '技術・専門',
    color: '#2563eb',
    icon: '🛠️',
    priority: 'high'
  },
  safety: {
    label: '安全・法令',
    color: '#dc2626',
    icon: '🛡️',
    priority: 'high'
  },
  communication: {
    label: 'コミュニケーション',
    color: '#16a34a',
    icon: '💬',
    priority: 'medium'
  },
  leadership: {
    label: 'リーダーシップ',
    color: '#8b5cf6',
    icon: '👑',
    priority: 'high'
  },
  compliance: {
    label: 'コンプライアンス',
    color: '#f59e0b',
    icon: '⚖️',
    priority: 'high'
  },
  specialized: {
    label: '専門特化',
    color: '#06b6d4',
    icon: '🎯',
    priority: 'medium'
  }
} as const;

// 研修タイプマッピング
const TRAINING_TYPES = {
  mandatory: {
    label: '必須研修',
    color: '#dc2626',
    icon: '🚨',
    urgency: 'high'
  },
  recommended: {
    label: '推奨研修',
    color: '#f59e0b',
    icon: '⭐',
    urgency: 'medium'
  },
  optional: {
    label: '任意研修',
    color: '#2563eb',
    icon: '💡',
    urgency: 'low'
  },
  certification: {
    label: '資格・認定',
    color: '#8b5cf6',
    icon: '🏆',
    urgency: 'medium'
  }
} as const;

export class TrainingAnalysisService {
  
  /**
   * 教育・研修分析データを生成
   */
  static async generateTrainingAnalysis(staffId: string): Promise<TrainingAnalysisData> {
    try {
      // 研修データ取得（実際はAPIから取得）
      const trainingData = await this.getTrainingData(staffId);
      
      // スキル成長データ取得
      const skillData = await this.getSkillGrowthData(staffId);
      
      // 学習効果データ取得
      const effectivenessData = await this.getLearningEffectiveness(staffId);
      
      // 統合分析データを構築
      const analysisData: TrainingAnalysisData = {
        staffId,
        staffName: trainingData.staffName,
        trainingSummary: trainingData.trainingSummary,
        trainingHistory: trainingData.trainingHistory,
        skillGrowth: skillData.skillGrowth,
        certifications: trainingData.certifications,
        trainingPlan: this.buildTrainingPlan(staffId, trainingData, skillData),
        learningEffectiveness: effectivenessData.learningEffectiveness,
        learningProfile: this.assessLearningProfile(staffId, trainingData),
        organizationalContext: this.buildOrganizationalContext(staffId, trainingData)
      };

      return analysisData;
    } catch (error) {
      console.error('研修分析データ生成エラー:', error);
      throw error;
    }
  }

  /**
   * 研修基本データ取得（モック）
   */
  private static async getTrainingData(staffId: string) {
    return {
      staffName: '職員名',
      trainingSummary: {
        totalHours: 245,
        completedCourses: 18,
        inProgressCourses: 3,
        upcomingCourses: 5,
        completionRate: 88,
        averageScore: 86,
        lastTrainingDate: '2024-11-15',
        annualTarget: 280,
        currentProgress: 87.5
      },
      trainingHistory: [
        {
          id: 'TR001',
          title: '感染管理認定看護師研修',
          category: 'specialized' as const,
          categoryLabel: '専門特化',
          type: 'certification' as const,
          typeLabel: '資格・認定',
          startDate: '2024-10-01',
          endDate: '2024-11-15',
          duration: 40,
          status: 'completed' as const,
          score: 92,
          instructor: '感染管理学会認定講師',
          location: 'オンライン + 実技',
          cost: 150000,
          feedback: '優秀な理解力で実践的スキルも高評価',
          certificateIssued: true,
          relatedSkills: ['感染制御', 'リスク管理', '教育指導']
        },
        {
          id: 'TR002',
          title: 'リーダーシップ基礎研修',
          category: 'leadership' as const,
          categoryLabel: 'リーダーシップ',
          type: 'recommended' as const,
          typeLabel: '推奨研修',
          startDate: '2024-09-10',
          endDate: '2024-09-12',
          duration: 16,
          status: 'completed' as const,
          score: 85,
          instructor: '人事部 研修担当',
          location: '会議室A',
          cost: 0,
          feedback: 'チームマネジメントの理解が深まった',
          certificateIssued: true,
          relatedSkills: ['チームワーク', '問題解決', 'コミュニケーション']
        }
        // 他の研修履歴...
      ],
      certifications: [
        {
          id: 'CERT001',
          name: '感染管理認定看護師',
          category: 'specialized' as const,
          categoryLabel: '専門特化',
          status: 'obtained' as const,
          obtainedDate: '2024-11-15',
          expiryDate: '2029-11-14',
          renewalRequired: true,
          renewalDate: '2029-08-15',
          priority: 'high' as const,
          cost: 150000,
          organizationSupport: true,
          careerImpact: 'high' as const
        }
      ]
    };
  }

  /**
   * スキル成長データ取得（モック）
   */
  private static async getSkillGrowthData(staffId: string) {
    return {
      skillGrowth: {
        technical: [
          {
            skill: '感染制御技術',
            currentLevel: 92,
            targetLevel: 95,
            growth: 15,
            trend: 'improving' as const,
            benchmarkLevel: 75,
            relatedTrainings: ['感染管理認定看護師研修', '感染対策基礎'],
            lastAssessed: '2024-11-15'
          },
          {
            skill: '医療機器操作',
            currentLevel: 85,
            targetLevel: 90,
            growth: 8,
            trend: 'improving' as const,
            benchmarkLevel: 80,
            relatedTrainings: ['医療機器安全管理', 'ME機器研修'],
            lastAssessed: '2024-10-20'
          }
        ],
        behavioral: [
          {
            skill: 'チームワーク',
            currentLevel: 88,
            targetLevel: 90,
            growth: 12,
            trend: 'improving' as const,
            benchmarkLevel: 82,
            relatedTrainings: ['チームビルディング', 'コミュニケーション研修'],
            lastAssessed: '2024-11-01'
          },
          {
            skill: '問題解決能力',
            currentLevel: 80,
            targetLevel: 85,
            growth: 10,
            trend: 'stable' as const,
            benchmarkLevel: 75,
            relatedTrainings: ['問題解決手法', 'ケーススタディ'],
            lastAssessed: '2024-10-15'
          }
        ],
        leadership: [
          {
            skill: 'リーダーシップ',
            currentLevel: 75,
            targetLevel: 85,
            growth: 18,
            trend: 'improving' as const,
            benchmarkLevel: 70,
            relatedTrainings: ['リーダーシップ基礎', '管理職準備研修'],
            lastAssessed: '2024-09-30'
          }
        ]
      }
    };
  }

  /**
   * 学習効果データ取得（モック）
   */
  private static async getLearningEffectiveness(staffId: string) {
    return {
      learningEffectiveness: {
        knowledgeRetention: 92,
        skillApplication: 88,
        performanceImprovement: 85,
        behaviorChange: 82,
        jobSatisfaction: 90,
        overallEffectiveness: 87,
        roi: 3.2,
        lastMeasured: '2024-11-20'
      }
    };
  }

  /**
   * 研修計画構築
   */
  private static buildTrainingPlan(staffId: string, trainingData: any, skillData: any) {
    return {
      nextQuarter: [
        {
          title: '管理職準備研修',
          category: 'leadership',
          priority: 'high' as const,
          reason: 'リーダーシップスキル向上と昇進準備',
          estimatedDuration: 24,
          estimatedCost: 50000,
          prerequisite: 'リーダーシップ基礎研修修了',
          expectedOutcome: '管理職としての基礎スキル習得',
          deadline: '2025-02-28'
        },
        {
          title: 'プロジェクトマネジメント研修',
          category: 'technical',
          priority: 'medium' as const,
          reason: '法人規模プロジェクトでの活躍準備',
          estimatedDuration: 16,
          estimatedCost: 30000,
          expectedOutcome: 'プロジェクト運営スキル習得'
        }
      ],
      annualGoal: {
        targetHours: 280,
        currentHours: 245,
        keyFocusAreas: ['リーダーシップ開発', '専門性強化', 'マネジメントスキル'],
        expectedOutcomes: ['主任昇進準備', '専門認定資格取得', 'チーム運営能力向上'],
        budgetAllocated: 200000,
        priorityTrainings: ['管理職準備研修', 'プロジェクトマネジメント研修']
      }
    };
  }

  /**
   * 学習プロファイル評価
   */
  private static assessLearningProfile(staffId: string, trainingData: any) {
    return {
      preferredStyle: 'visual' as const,
      preferredFormat: 'blended' as const,
      learningPace: 'moderate' as const,
      collaborationPreference: 'mixed' as const,
      motivationFactors: ['キャリア発展', '専門性向上', '組織貢献'],
      barriers: ['時間制約', '業務多忙']
    };
  }

  /**
   * 組織内コンテキスト構築
   */
  private static buildOrganizationalContext(staffId: string, trainingData: any) {
    return {
      departmentAverageHours: 180,
      organizationAverageHours: 160,
      rankInDepartment: 3,
      rankInOrganization: 12,
      percentile: 85,
      benchmarkComparison: 'above' as const
    };
  }

  /**
   * 研修カテゴリ情報取得
   */
  static getTrainingCategoryInfo(category: keyof typeof TRAINING_CATEGORIES) {
    return TRAINING_CATEGORIES[category];
  }

  /**
   * 研修タイプ情報取得
   */
  static getTrainingTypeInfo(type: keyof typeof TRAINING_TYPES) {
    return TRAINING_TYPES[type];
  }
}