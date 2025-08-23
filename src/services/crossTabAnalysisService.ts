/**
 * 横断的分析サービス
 * 各タブデータを統合して総合分析を提供
 * 効果的プレゼン指示書の原則に従った可視化データ生成
 */

import { StaffCardInterviewService } from './staffCardInterviewService';
import { PersonalEvaluationService } from './evaluationV3Service';

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
      // 各タブからデータ収集
      const [evaluationData, interviewData, trainingData] = await Promise.all([
        this.getEvaluationData(staffId),
        this.getInterviewData(staffId),
        this.getTrainingData(staffId)
      ]);

      // 統合分析データを構築
      const analysisData: CrossTabAnalysisData = {
        staffId,
        staffName: evaluationData.staffName,
        growthStory: await this.buildGrowthStory(staffId, evaluationData, interviewData, trainingData),
        evaluationWaterfall: this.buildEvaluationWaterfall(evaluationData),
        staffPortfolio: this.buildStaffPortfolio(staffId, evaluationData, trainingData),
        strengthsWeaknesses: this.buildStrengthsWeaknesses(evaluationData, interviewData, trainingData),
        growthPrediction: this.buildGrowthPrediction(evaluationData, interviewData, trainingData)
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
   * 成長ストーリー構築
   */
  private static async buildGrowthStory(staffId: string, evaluation: any, interview: any, training: any) {
    const timeline = [
      {
        date: '2024-01',
        event: 'V3評価B+達成',
        category: 'evaluation' as const,
        impact: 'positive' as const,
        score: 78.5,
        description: '技術評価で安定した成果を達成'
      },
      {
        date: '2024-03',
        event: '年次面談実施',
        category: 'interview' as const,
        impact: 'positive' as const,
        description: 'キャリア目標設定とリーダーシップ開発計画策定'
      },
      {
        date: '2024-06',
        event: 'リーダーシップ研修完了',
        category: 'training' as const,
        impact: 'positive' as const,
        description: 'チーム運営スキル向上、実践準備完了'
      },
      {
        date: '2024-10',
        event: 'V3評価A達成',
        category: 'evaluation' as const,
        impact: 'positive' as const,
        score: 81.25,
        description: '組織貢献度向上により総合評価がAランクに'
      }
    ];

    return {
      timeline,
      overallTrend: 'improving' as const,
      keyMilestones: [
        'V3評価Aグレード達成',
        'リーダーシップ研修修了',
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
   * 職員ポートフォリオ分析
   * 指示書原則：散布図で四象限分割、平均線によるセグメント
   */
  private static buildStaffPortfolio(staffId: string, evaluation: any, training: any) {
    const skillLevel = (evaluation.technicalScore + training.skillGrowth.reduce((acc: number, skill: any) => acc + skill.current, 0) / training.skillGrowth.length) / 2;
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
      experienceYears: 4, // バブルサイズ用
      quadrant,
      quadrantLabel: PORTFOLIO_QUADRANTS[quadrant].label
    };
  }

  /**
   * 統合強み・課題分析
   * 指示書原則：重要度順配置、色で強調
   */
  private static buildStrengthsWeaknesses(evaluation: any, interview: any, training: any) {
    const strengths = [
      {
        item: 'V3評価での安定した成果',
        source: 'evaluation' as const,
        score: evaluation.currentScore,
        trend: 'improving' as const
      },
      {
        item: 'チームワーク・協調性',
        source: 'interview' as const,
        score: 85,
        trend: 'stable' as const
      },
      {
        item: '専門技術スキル',
        source: 'training' as const,
        score: 85,
        trend: 'improving' as const
      }
    ].sort((a, b) => b.score - a.score); // 重要度順（スコア順）

    const improvements = [
      {
        item: 'リーダーシップスキル',
        source: 'training' as const,
        priority: 'high' as const,
        score: 72,
        actionRequired: '管理職研修受講'
      },
      {
        item: '法人規模での貢献',
        source: 'evaluation' as const,
        priority: 'high' as const,
        score: 78,
        actionRequired: 'クロスファンクショナルプロジェクト参加'
      },
      {
        item: '後輩指導スキル',
        source: 'interview' as const,
        priority: 'medium' as const,
        score: 75,
        actionRequired: 'メンター制度参加'
      }
    ].sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }); // 優先度順

    return { strengths, improvements };
  }

  /**
   * 成長予測データ構築
   * 指示書原則：複合グラフで異なる性質の指標を同時表示
   */
  private static buildGrowthPrediction(evaluation: any, interview: any, training: any) {
    const historicalGrowth = evaluation.history.map((h: any, index: number) => ({
      date: h.date,
      actualScore: h.score,
      projectedScore: index === evaluation.history.length - 1 ? undefined : h.score + 2.5 // 予測トレンド
    }));

    // 未来予測を追加
    historicalGrowth.push({
      date: '2025-01',
      actualScore: undefined,
      projectedScore: 84
    });

    return {
      historicalGrowth,
      nextMilestone: {
        target: 'V3評価Sグレード達成',
        timeframe: '2025年度内',
        probability: 75,
        requirements: ['法人規模プロジェクト参加', 'リーダーシップ研修修了', '後輩指導実績']
      },
      careerPath: {
        currentLevel: '中堅看護師',
        nextLevel: '主任候補',
        progressPercentage: 65,
        estimatedTimeToPromotion: '1.5年'
      }
    };
  }
}