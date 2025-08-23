/**
 * 採用・配属分析サービス
 * 採用から現在までの履歴データを統合分析
 * 横断分析システムとの連携用データ生成
 */

export interface RecruitmentAnalysisData {
  staffId: string;
  staffName: string;
  
  // 採用基本情報
  recruitmentInfo: {
    hireDate: string;
    recruitmentSource: 'new_graduate' | 'experienced' | 'internal_transfer' | 'contract_to_permanent';
    recruitmentSourceLabel: string;
    initialPosition: string;
    probationPeriod: string;
    probationResult: 'passed' | 'extended' | 'failed';
    recruiterId: string;
    recruiterName: string;
    recruitmentScore?: number;
  };
  
  // 配属履歴（時系列）
  placementHistory: Array<{
    id: string;
    startDate: string;
    endDate: string | null;
    facility: string;
    department: string;
    position: string;
    positionLevel: 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'manager';
    reason: string;
    reasonCategory: 'promotion' | 'rotation' | 'skill_development' | 'organizational_need' | 'personal_request';
    performance: string;
    performanceScore: number;
    status: 'current' | 'completed' | 'planned';
    supervisor: string;
    achievements?: string[];
  }>;
  
  // 適性評価（多角的評価）
  aptitudeAssessment: {
    technicalAptitude: number;          // 技術適性
    communicationSkills: number;        // コミュニケーション能力
    teamwork: number;                   // チームワーク
    adaptability: number;               // 適応性
    leadership: number;                 // リーダーシップ
    problemSolving: number;             // 問題解決能力
    customerOrientation: number;        // 顧客志向
    overallFit: number;                // 総合適性
    assessmentDate: string;
    assessorName: string;
  };
  
  // キャリア開発計画
  careerPath: {
    preferredSpecialty: string;         // 希望専門分野
    careerGoals: string[];              // キャリア目標
    mentorshipNeeds: string[];          // メンターシップニーズ
    developmentPlan: Array<{            // 能力開発計画
      skill: string;
      currentLevel: number;
      targetLevel: number;
      timeline: string;
      method: string;
    }>;
    nextPlacementRecommendation: string; // 次期配属推奨
    promotionReadiness: number;         // 昇進準備度（0-100）
    estimatedPromotionTimeframe: string; // 昇進予想時期
  };
  
  // オンボーディング進捗
  onboardingProgress: {
    orientation: boolean;               // オリエンテーション
    mentorAssigned: boolean;           // メンター配置
    skillAssessment: boolean;          // スキル評価
    probationReview: boolean;          // 試用期間評価
    teamIntegration: boolean;          // チーム統合
    performanceReview30: boolean;      // 30日評価
    performanceReview90: boolean;      // 90日評価
    completionRate: number;            // 全体完了率
    onboardingScore: number;           // オンボーディングスコア
  };
  
  // パフォーマンストレンド
  performanceTrend: Array<{
    period: string;                    // 期間
    overallScore: number;              // 総合スコア
    technicalScore: number;            // 技術スコア
    behavioralScore: number;           // 行動スコア
    goalAchievement: number;           // 目標達成度
    feedback: string;                  // フィードバック
  }>;
  
  // 離職リスク評価
  retentionRisk: {
    riskLevel: 'low' | 'medium' | 'high';
    riskScore: number;                 // リスクスコア（0-100）
    riskFactors: string[];             // リスク要因
    retentionStrategies: string[];     // 定着戦略
    lastAssessmentDate: string;
  };
}

// 採用区分マッピング
const RECRUITMENT_SOURCES = {
  new_graduate: {
    label: '新卒採用',
    color: '#16a34a',
    icon: '🎓',
    probationPeriod: '6ヶ月'
  },
  experienced: {
    label: '中途採用（経験者）',
    color: '#2563eb',
    icon: '💼',
    probationPeriod: '3ヶ月'
  },
  internal_transfer: {
    label: '内部転属',
    color: '#f59e0b',
    icon: '🔄',
    probationPeriod: '1ヶ月'
  },
  contract_to_permanent: {
    label: '契約→正社員',
    color: '#8b5cf6',
    icon: '📄',
    probationPeriod: '3ヶ月'
  }
} as const;

// 配属理由カテゴリマッピング
const PLACEMENT_REASONS = {
  promotion: {
    label: '昇進・昇格',
    color: '#16a34a',
    priority: 'high'
  },
  rotation: {
    label: 'ローテーション',
    color: '#2563eb',
    priority: 'medium'
  },
  skill_development: {
    label: 'スキル開発',
    color: '#f59e0b',
    priority: 'medium'
  },
  organizational_need: {
    label: '組織ニーズ',
    color: '#dc2626',
    priority: 'high'
  },
  personal_request: {
    label: '本人希望',
    color: '#8b5cf6',
    priority: 'low'
  }
} as const;

export class RecruitmentAnalysisService {
  
  /**
   * 採用・配属分析データを生成
   */
  static async generateRecruitmentAnalysis(staffId: string): Promise<RecruitmentAnalysisData> {
    try {
      // 採用データ取得（実際はAPIから取得）
      const recruitmentData = await this.getRecruitmentData(staffId);
      
      // 配属履歴データ取得
      const placementData = await this.getPlacementHistory(staffId);
      
      // 適性評価データ取得
      const aptitudeData = await this.getAptitudeAssessment(staffId);
      
      // 統合分析データを構築
      const analysisData: RecruitmentAnalysisData = {
        staffId,
        staffName: recruitmentData.staffName,
        recruitmentInfo: recruitmentData.recruitmentInfo,
        placementHistory: placementData.placementHistory,
        aptitudeAssessment: aptitudeData.aptitudeAssessment,
        careerPath: this.buildCareerPath(staffId, placementData, aptitudeData),
        onboardingProgress: recruitmentData.onboardingProgress,
        performanceTrend: this.buildPerformanceTrend(staffId, placementData),
        retentionRisk: this.assessRetentionRisk(staffId, recruitmentData, placementData, aptitudeData)
      };

      return analysisData;
    } catch (error) {
      console.error('採用分析データ生成エラー:', error);
      throw error;
    }
  }

  /**
   * 採用基本データ取得（モック）
   */
  private static async getRecruitmentData(staffId: string) {
    return {
      staffName: '職員名',
      recruitmentInfo: {
        hireDate: '2021-04-01',
        recruitmentSource: 'new_graduate' as const,
        recruitmentSourceLabel: '新卒採用',
        initialPosition: '看護師',
        probationPeriod: '6ヶ月',
        probationResult: 'passed' as const,
        recruiterId: 'HR001',
        recruiterName: '人事部 佐藤',
        recruitmentScore: 85
      },
      onboardingProgress: {
        orientation: true,
        mentorAssigned: true,
        skillAssessment: true,
        probationReview: true,
        teamIntegration: true,
        performanceReview30: true,
        performanceReview90: true,
        completionRate: 100,
        onboardingScore: 88
      }
    };
  }

  /**
   * 配属履歴データ取得（モック）
   */
  private static async getPlacementHistory(staffId: string) {
    return {
      placementHistory: [
        {
          id: 'PL001',
          startDate: '2024-04-01',
          endDate: null,
          facility: '小原病院',
          department: '内科病棟',
          position: '看護師',
          positionLevel: 'mid' as const,
          reason: '経験年数による配置転換',
          reasonCategory: 'rotation' as const,
          performance: 'A',
          performanceScore: 85,
          status: 'current' as const,
          supervisor: '内科病棟師長 田中',
          achievements: ['チームリーダー経験', '新人指導実績']
        },
        {
          id: 'PL002',
          startDate: '2022-04-01',
          endDate: '2024-03-31',
          facility: '小原病院',
          department: '外科病棟',
          position: '看護師',
          positionLevel: 'junior' as const,
          reason: 'ローテーション',
          reasonCategory: 'rotation' as const,
          performance: 'B+',
          performanceScore: 78,
          status: 'completed' as const,
          supervisor: '外科病棟師長 山田',
          achievements: ['急変対応スキル向上', '患者満足度改善']
        },
        {
          id: 'PL003',
          startDate: '2021-04-01',
          endDate: '2022-03-31',
          facility: '小原病院',
          department: '内科病棟',
          position: '看護師（新人）',
          positionLevel: 'entry' as const,
          reason: '新人配属',
          reasonCategory: 'organizational_need' as const,
          performance: 'B',
          performanceScore: 72,
          status: 'completed' as const,
          supervisor: '内科病棟師長 田中',
          achievements: ['基礎スキル習得', '患者ケア技術向上']
        }
      ]
    };
  }

  /**
   * 適性評価データ取得（モック）
   */
  private static async getAptitudeAssessment(staffId: string) {
    return {
      aptitudeAssessment: {
        technicalAptitude: 85,
        communicationSkills: 90,
        teamwork: 88,
        adaptability: 82,
        leadership: 75,
        problemSolving: 80,
        customerOrientation: 92,
        overallFit: 85,
        assessmentDate: '2024-03-15',
        assessorName: 'HR部 評価担当 鈴木'
      }
    };
  }

  /**
   * キャリアパス構築
   */
  private static buildCareerPath(staffId: string, placementData: any, aptitudeData: any) {
    return {
      preferredSpecialty: '内科・慢性期ケア',
      careerGoals: [
        '主任昇進（2年以内）',
        '専門資格取得（感染管理認定看護師）',
        '部署横断プロジェクトリーダー'
      ],
      mentorshipNeeds: [
        'リーダーシップ開発',
        '法人規模プロジェクト経験',
        '管理業務スキル習得'
      ],
      developmentPlan: [
        {
          skill: 'リーダーシップ',
          currentLevel: 75,
          targetLevel: 85,
          timeline: '6ヶ月',
          method: '管理職研修 + OJT'
        },
        {
          skill: '法人貢献度',
          currentLevel: 78,
          targetLevel: 88,
          timeline: '12ヶ月',
          method: 'クロスファンクショナルプロジェクト参加'
        }
      ],
      nextPlacementRecommendation: '内科系主任候補ポジション',
      promotionReadiness: 75,
      estimatedPromotionTimeframe: '1.5年以内'
    };
  }

  /**
   * パフォーマンストレンド構築
   */
  private static buildPerformanceTrend(staffId: string, placementData: any) {
    return [
      {
        period: '2024年度',
        overallScore: 85,
        technicalScore: 82,
        behavioralScore: 88,
        goalAchievement: 90,
        feedback: '安定した高パフォーマンス。リーダーシップ発揮が顕著。'
      },
      {
        period: '2023年度',
        overallScore: 78,
        technicalScore: 80,
        behavioralScore: 76,
        goalAchievement: 85,
        feedback: '技術スキル向上。チームワーク面での成長が必要。'
      },
      {
        period: '2022年度',
        overallScore: 72,
        technicalScore: 75,
        behavioralScore: 69,
        goalAchievement: 80,
        feedback: '基礎的なスキル習得完了。応用力の向上が課題。'
      }
    ];
  }

  /**
   * 離職リスク評価
   */
  private static assessRetentionRisk(staffId: string, recruitmentData: any, placementData: any, aptitudeData: any) {
    const overallFit = aptitudeData.aptitudeAssessment.overallFit;
    const latestPerformance = placementData.placementHistory[0]?.performanceScore || 70;
    
    let riskLevel: 'low' | 'medium' | 'high';
    let riskScore: number;
    
    if (overallFit >= 85 && latestPerformance >= 80) {
      riskLevel = 'low';
      riskScore = 15;
    } else if (overallFit >= 70 && latestPerformance >= 70) {
      riskLevel = 'medium';
      riskScore = 35;
    } else {
      riskLevel = 'high';
      riskScore = 65;
    }

    return {
      riskLevel,
      riskScore,
      riskFactors: riskLevel === 'low' ? 
        ['なし（安定的な定着）'] : 
        riskLevel === 'medium' ? 
        ['キャリア発展機会の不足', '給与・待遇面での不満'] :
        ['職務適合度の低さ', 'パフォーマンス不振', '人間関係の問題'],
      retentionStrategies: riskLevel === 'low' ? 
        ['継続的なキャリア支援', '昇進機会の提供'] :
        riskLevel === 'medium' ?
        ['個別面談の実施', 'スキル開発支援強化', 'キャリアパス明確化'] :
        ['集中的な指導・研修', '配属変更検討', 'メンタリング強化'],
      lastAssessmentDate: '2024-06-15'
    };
  }

  /**
   * 採用区分情報取得
   */
  static getRecruitmentSourceInfo(source: keyof typeof RECRUITMENT_SOURCES) {
    return RECRUITMENT_SOURCES[source];
  }

  /**
   * 配属理由情報取得
   */
  static getPlacementReasonInfo(reason: keyof typeof PLACEMENT_REASONS) {
    return PLACEMENT_REASONS[reason];
  }
}