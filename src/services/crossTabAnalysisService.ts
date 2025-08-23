/**
 * 横断的分析サービス
 * 各タブデータを統合して総合分析を提供
 * 効果的プレゼン指示書の原則に従った可視化データ生成
 */

import { StaffCardInterviewService } from './staffCardInterviewService';
import { PersonalEvaluationService } from './evaluationV3Service';
import { RecruitmentAnalysisService } from './recruitmentAnalysisService';
import { TrainingAnalysisService } from './trainingAnalysisService';

// 横断分析データ型定義
export interface CrossTabAnalysisData {
  staffId: string;
  staffName: string;
  // 統合成長ストーリー
  growthStory: {
    timeline: Array<{
      date: string;
      event: string;
      category: 'evaluation' | 'interview' | 'training' | 'development';
      impact: 'positive' | 'neutral' | 'improvement_needed';
      score?: number;
      description: string;
    }>;
    overallTrend: 'improving' | 'stable' | 'declining';
    keyMilestones: string[];
  };
  // V3評価トレンド要因分解（滝グラフ用）
  evaluationWaterfall: {
    baseline: number;
    factors: Array<{
      name: string;
      value: number;
      type: 'increase' | 'decrease';
      category: 'technical' | 'contribution' | 'leadership';
    }>;
    current: number;
    targetGap: number;
  };
  // 職員ポートフォリオ（散布図用）
  staffPortfolio: {
    skillLevel: number; // X軸
    performance: number; // Y軸
    experienceYears: number; // バブルサイズ
    quadrant: 'star' | 'potential' | 'steady' | 'support_needed';
    quadrantLabel: string;
  };
  // 統合強み・課題（横棒グラフ用）
  strengthsWeaknesses: {
    strengths: Array<{
      item: string;
      source: 'evaluation' | 'interview' | 'training' | 'development';
      score: number;
      trend: 'improving' | 'stable';
    }>;
    improvements: Array<{
      item: string;
      source: 'evaluation' | 'interview' | 'training' | 'development';
      priority: 'high' | 'medium' | 'low';
      score: number;
      actionRequired: string;
    }>;
  };
  // 成長予測（複合グラフ用）
  growthPrediction: {
    historicalGrowth: Array<{
      date: string;
      actualScore: number;
      projectedScore?: number;
    }>;
    nextMilestone: {
      target: string;
      timeframe: string;
      probability: number;
      requirements: string[];
    };
    careerPath: {
      currentLevel: string;
      nextLevel: string;
      progressPercentage: number;
      estimatedTimeToPromotion: string;
    };
  };
}

// 四象限分類マッピング
const PORTFOLIO_QUADRANTS = {
  star: { 
    label: '⭐ スター人材', 
    description: '高スキル・高パフォーマンス',
    color: '#16a34a', // 緑
    action: 'リーダー候補として育成'
  },
  potential: { 
    label: '🚀 ポテンシャル人材', 
    description: '高スキル・要パフォーマンス向上',
    color: '#2563eb', // 青
    action: '実践機会の提供で成果向上'
  },
  steady: { 
    label: '🏛️ 安定貢献人材', 
    description: '要スキル向上・高パフォーマンス',
    color: '#f59e0b', // オレンジ
    action: 'スキル研修で更なる成長'
  },
  support_needed: { 
    label: '🤝 重点支援人材', 
    description: '要スキル向上・要パフォーマンス向上',
    color: '#dc2626', // 赤
    action: '集中的な指導・研修が必要'
  }
} as const;

export class CrossTabAnalysisService {
  
  /**
   * 統合分析データを生成
   */
  static async generateCrossTabAnalysis(staffId: string): Promise<CrossTabAnalysisData> {
    try {
      // 各システムからの統合データ収集
      const [evaluationData, interviewData, recruitmentData, trainingData] = await Promise.all([
        this.getEvaluationData(staffId),
        this.getInterviewData(staffId),
        RecruitmentAnalysisService.generateRecruitmentAnalysis(staffId),
        TrainingAnalysisService.generateTrainingAnalysis(staffId)
      ]);

      // 統合分析データを構築（4システム統合）
      const analysisData: CrossTabAnalysisData = {
        staffId,
        staffName: evaluationData.staffName,
        growthStory: await this.buildIntegratedGrowthStory(staffId, evaluationData, interviewData, recruitmentData, trainingData),
        evaluationWaterfall: this.buildEvaluationWaterfall(evaluationData),
        staffPortfolio: this.buildEnhancedStaffPortfolio(staffId, evaluationData, recruitmentData, trainingData),
        strengthsWeaknesses: this.buildIntegratedStrengthsWeaknesses(evaluationData, interviewData, recruitmentData, trainingData),
        growthPrediction: this.buildAdvancedGrowthPrediction(evaluationData, interviewData, recruitmentData, trainingData)
      };

      return analysisData;
    } catch (error) {
      console.error('横断分析データ生成エラー:', error);
      throw error;
    }
  }

  /**
   * V3評価データ取得
   */
  private static async getEvaluationData(staffId: string) {
    // モックデータ（実際はPersonalEvaluationServiceから取得）
    return {
      staffName: '職員名',
      currentScore: 81.25,
      previousScore: 78.5,
      technicalScore: 80,
      contributionScore: 82.5,
      grade: 'A',
      trend: 'improving' as const,
      history: [
        { date: '2024-01', score: 75.0 },
        { date: '2024-04', score: 78.5 },
        { date: '2024-07', score: 80.2 },
        { date: '2024-10', score: 81.25 }
      ]
    };
  }

  /**
   * 面談データ取得
   */
  private static async getInterviewData(staffId: string) {
    const summaryData = await StaffCardInterviewService.generateSummaryData(staffId);
    return {
      totalInterviews: summaryData.totalInterviews,
      latestFeedback: summaryData.latestFeedback,
      strengths: ['コミュニケーション力', 'チームワーク'],
      improvements: ['リーダーシップ', '法人規模貢献'],
      recentTopics: ['キャリア開発', '技術向上', '職場環境']
    };
  }

  /**
   * 研修データ取得（モック）
   */
  private static async getTrainingData(staffId: string) {
    return {
      totalHours: 245,
      completionRate: 88,
      skillGrowth: [
        { skill: '専門技術', current: 85, target: 90 },
        { skill: 'リーダーシップ', current: 72, target: 80 }
      ],
      recentCertifications: ['感染管理認定', '普通救命講習']
    };
  }

  /**
   * 統合成長ストーリー構築（4システム統合版）
   */
  private static async buildIntegratedGrowthStory(staffId: string, evaluation: any, interview: any, recruitment: any, training: any) {
    // 4システム統合タイムライン構築
    const timeline = [
      {
        date: '2021-04',
        event: '新卒採用・入職',
        category: 'development' as const,
        impact: 'positive' as const,
        description: `${recruitment.recruitmentInfo.recruitmentSource}として入職。適性評価${recruitment.aptitudeAssessment.overallFit}点で高いポテンシャルを示す`
      },
      {
        date: '2021-06',
        event: 'オンボーディング完了',
        category: 'development' as const,
        impact: 'positive' as const,
        description: `試用期間${recruitment.recruitmentInfo.probationResult}。基礎研修修了し現場配属`
      },
      {
        date: '2022-03',
        event: '初回面談・成長計画策定',
        category: 'interview' as const,
        impact: 'positive' as const,
        description: 'キャリア目標設定と個人成長プラン策定。専門性向上にフォーカス'
      },
      {
        date: '2022-09',
        event: '専門研修受講開始',
        category: 'training' as const,
        impact: 'positive' as const,
        description: `年間${training.trainingSummary.totalHours}時間の計画的学習プログラム開始`
      },
      {
        date: '2024-01',
        event: 'V3評価B+達成',
        category: 'evaluation' as const,
        impact: 'positive' as const,
        score: 78.5,
        description: '技術評価で安定した成果を達成。研修効果が評価に反映'
      },
      {
        date: '2024-03',
        event: '年次面談・昇進候補認定',
        category: 'interview' as const,
        impact: 'positive' as const,
        description: 'リーダーシップ開発計画策定。次期主任候補として認定'
      },
      {
        date: '2024-06',
        event: 'リーダーシップ研修完了',
        category: 'training' as const,
        impact: 'positive' as const,
        description: `${training.learningEffectiveness.overallEffectiveness}%の高い学習効果でチーム運営スキル習得`
      },
      {
        date: '2024-10',
        event: 'V3評価A達成・配属変更',
        category: 'evaluation' as const,
        impact: 'positive' as const,
        score: 81.25,
        description: '組織貢献度向上により総合評価Aランク。新配属で責任範囲拡大'
      },
      {
        date: '2024-11',
        event: '専門認定資格取得',
        category: 'training' as const,
        impact: 'positive' as const,
        description: '感染管理認定看護師資格取得。専門性と組織価値向上を実現'
      }
    ];

    return {
      timeline,
      overallTrend: 'improving' as const,
      keyMilestones: [
        '新卒採用・入職（高適性評価）',
        '体系的研修プログラム完了',
        'V3評価Aグレード達成',
        '専門認定資格取得',
        '次期主任候補認定'
      ]
    };
  }

  /**
   * V3評価滝グラフデータ構築
   * 指示書原則：増減要因を色分け、重要要因を背景強調
   */
  private static buildEvaluationWaterfall(evaluation: any) {
    return {
      baseline: evaluation.previousScore, // 前回評価
      factors: [
        {
          name: '技術スキル向上',
          value: +2.0,
          type: 'increase' as const,
          category: 'technical' as const
        },
        {
          name: '組織貢献度向上',
          value: +1.5,
          type: 'increase' as const,
          category: 'contribution' as const
        },
        {
          name: 'リーダーシップ発揮',
          value: +0.75,
          type: 'increase' as const,
          category: 'leadership' as const
        },
        {
          name: '出勤率改善余地',
          value: -0.5,
          type: 'decrease' as const,
          category: 'technical' as const
        }
      ],
      current: evaluation.currentScore,
      targetGap: 90 - evaluation.currentScore // Sグレード(90点)までの差分
    };
  }

  /**
   * 強化版職員ポートフォリオ分析（採用・研修データ統合）
   * 指示書原則：散布図で四象限分割、平均線によるセグメント
   */
  private static buildEnhancedStaffPortfolio(staffId: string, evaluation: any, recruitment: any, training: any) {
    // 統合スキルレベル算出（評価・研修・適性データ統合）
    const evaluationSkill = evaluation.technicalScore;
    const trainingSkill = training.skillGrowth.technical.reduce((acc: number, skill: any) => acc + skill.currentLevel, 0) / training.skillGrowth.technical.length;
    const aptitudeScore = recruitment.aptitudeAssessment.overallFit;
    
    const skillLevel = (evaluationSkill + trainingSkill + aptitudeScore) / 3;
    const performance = evaluation.currentScore;
    
    // 四象限判定（平均値を基準）
    const avgSkill = 75; // 組織平均スキルレベル
    const avgPerformance = 75; // 組織平均パフォーマンス
    
    let quadrant: keyof typeof PORTFOLIO_QUADRANTS;
    if (skillLevel >= avgSkill && performance >= avgPerformance) {
      quadrant = 'star';
    } else if (skillLevel >= avgSkill && performance < avgPerformance) {
      quadrant = 'potential';
    } else if (skillLevel < avgSkill && performance >= avgPerformance) {
      quadrant = 'steady';
    } else {
      quadrant = 'support_needed';
    }

    return {
      skillLevel,
      performance,
      experienceYears: recruitment.placementHistory.length, // 配属経験数をサイズに反映
      quadrant,
      quadrantLabel: PORTFOLIO_QUADRANTS[quadrant].label
    };
  }

  /**
   * 統合強み・課題分析（4システム統合版）
   * 指示書原則：重要度順配置、色で強調
   */
  private static buildIntegratedStrengthsWeaknesses(evaluation: any, interview: any, recruitment: any, training: any) {
    // 4システム統合強み分析
    const strengths = [
      {
        item: 'V3評価での安定した成果',
        source: 'evaluation' as const,
        score: evaluation.currentScore,
        trend: 'improving' as const
      },
      {
        item: '高い職務適性・組織適合度',
        source: 'development' as const,
        score: recruitment.aptitudeAssessment.overallFit,
        trend: 'stable' as const
      },
      {
        item: '継続的な学習・研修姿勢',
        source: 'training' as const,
        score: training.learningEffectiveness.overallEffectiveness,
        trend: 'improving' as const
      },
      {
        item: 'チームワーク・協調性',
        source: 'interview' as const,
        score: 85,
        trend: 'stable' as const
      },
      {
        item: '専門技術スキルの体系的向上',
        source: 'training' as const,
        score: training.skillGrowth.technical[0]?.currentLevel || 85,
        trend: 'improving' as const
      }
    ].sort((a, b) => b.score - a.score); // 重要度順（スコア順）

    // 4システム統合改善点分析
    const improvements = [
      {
        item: 'リーダーシップスキル',
        source: 'training' as const,
        priority: 'high' as const,
        score: training.skillGrowth.leadership?.[0]?.currentLevel || 72,
        actionRequired: '管理職研修受講・実践経験積累'
      },
      {
        item: '法人規模での貢献',
        source: 'evaluation' as const,
        priority: 'high' as const,
        score: 78,
        actionRequired: 'クロスファンクショナルプロジェクト参加'
      },
      {
        item: '昇進に向けた戦略的キャリア構築',
        source: 'development' as const,
        priority: 'high' as const,
        score: recruitment.careerPath.promotionReadiness,
        actionRequired: '主任候補研修・後輩指導経験'
      },
      {
        item: '研修効果の実務適用率向上',
        source: 'training' as const,
        priority: 'medium' as const,
        score: training.learningEffectiveness.skillApplication,
        actionRequired: '学習内容の現場実践強化'
      },
      {
        item: '面談フォローアップ・目標達成度',
        source: 'interview' as const,
        priority: 'medium' as const,
        score: 75,
        actionRequired: '定期面談での進捗確認・調整'
      }
    ].sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }); // 優先度順

    return { strengths, improvements };
  }

  /**
   * 高度成長予測データ構築（4システム統合版）
   * 指示書原則：複合グラフで異なる性質の指標を同時表示
   */
  private static buildAdvancedGrowthPrediction(evaluation: any, interview: any, recruitment: any, training: any) {
    // 統合データから成長トレンドを算出
    const baseGrowthRate = 0.75; // 基礎成長率
    const trainingBoost = training.learningEffectiveness.overallEffectiveness / 100 * 0.5; // 研修効果による加速
    const aptitudeMultiplier = recruitment.aptitudeAssessment.overallFit / 100; // 適性による成長ポテンシャル
    
    const historicalGrowth = evaluation.history.map((h: any, index: number) => {
      // 実績データ
      const actualScore = h.score;
      
      // 予測算出（研修効果と適性を考慮）
      let projectedScore = undefined;
      if (index < evaluation.history.length - 1) {
        const nextActualScore = evaluation.history[index + 1].score;
        const predictedGrowth = (baseGrowthRate + trainingBoost) * aptitudeMultiplier;
        projectedScore = actualScore + predictedGrowth;
      }
      
      return {
        date: h.date,
        actualScore,
        projectedScore
      };
    });

    // 高度予測：4システム統合による将来予測
    const currentScore = evaluation.currentScore;
    const futureGrowthRate = (baseGrowthRate + trainingBoost) * aptitudeMultiplier * 1.1; // 将来加速率
    
    // 短期予測（3ヶ月後）
    historicalGrowth.push({
      date: '2025-01',
      actualScore: undefined,
      projectedScore: Math.min(currentScore + futureGrowthRate * 3, 90) // Sグレード上限
    });
    
    // 中期予測（6ヶ月後）
    historicalGrowth.push({
      date: '2025-04',
      actualScore: undefined,
      projectedScore: Math.min(currentScore + futureGrowthRate * 6, 92)
    });
    
    // 長期予測（1年後）
    historicalGrowth.push({
      date: '2025-10',
      actualScore: undefined,
      projectedScore: Math.min(currentScore + futureGrowthRate * 12, 95)
    });

    // マイルストーン予測（統合分析による達成確率算出）
    const sGradeRequiredScore = 90;
    const currentSkillGap = sGradeRequiredScore - currentScore;
    const monthsToTarget = Math.ceil(currentSkillGap / futureGrowthRate);
    
    // 達成確率算出（4要素統合）
    const evaluationReadiness = Math.min(currentScore / sGradeRequiredScore * 100, 100);
    const trainingReadiness = training.learningEffectiveness.overallEffectiveness;
    const aptitudeReadiness = recruitment.aptitudeAssessment.overallFit;
    const interviewMotivation = 85; // 面談での意欲度スコア（仮）
    
    const overallProbability = Math.round(
      (evaluationReadiness + trainingReadiness + aptitudeReadiness + interviewMotivation) / 4
    );

    // キャリアパス予測（採用・研修データ統合）
    const promotionReadiness = recruitment.careerPath.promotionReadiness;
    const skillDevelopmentRate = training.skillGrowth.leadership?.[0]?.progressRate || 75;
    const combinedReadiness = Math.round((promotionReadiness + skillDevelopmentRate) / 2);

    return {
      historicalGrowth,
      nextMilestone: {
        target: 'V3評価Sグレード達成',
        timeframe: monthsToTarget <= 6 ? '6ヶ月以内' : monthsToTarget <= 12 ? '1年以内' : '1年超',
        probability: Math.min(overallProbability, 85), // 現実的な上限設定
        requirements: overallProbability >= 80 ? 
          ['現行研修継続', '実践経験積累'] : 
          overallProbability >= 65 ? 
          ['法人規模プロジェクト参加', 'リーダーシップ研修修了', '後輩指導実績'] :
          ['集中的スキル強化', '個別指導計画', 'メンター制度活用']
      },
      careerPath: {
        currentLevel: recruitment.placementHistory[0]?.position || '看護師',
        nextLevel: combinedReadiness >= 75 ? '主任候補' : combinedReadiness >= 60 ? '先輩職員' : '現職継続',
        progressPercentage: combinedReadiness,
        estimatedTimeToPromotion: combinedReadiness >= 75 ? 
          '1年以内' : combinedReadiness >= 60 ? 
          '1.5-2年' : '2年以上'
      }
    };
  }
}