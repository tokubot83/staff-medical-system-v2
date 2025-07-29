/**
 * 価値創造分析サービス
 * VoiceDriveと職員カルテシステムの連携による統合分析
 */

import { EngagementMetrics, InnovationMetrics, CollaborationMetrics } from '../types/analytics';

export interface ValueCreationScore {
  employeeId: string;
  period: {
    from: Date;
    to: Date;
  };
  scores: {
    total: number;
    innovation: number;
    collaboration: number;
    engagement: number;
    traditional: number;
  };
  percentileRank: {
    overall: number;
    department: number;
    facility: number;
  };
  talentType: TalentType;
  insights: string[];
  recommendations: string[];
}

export enum TalentType {
  INNOVATOR = "イノベーター",
  EXECUTOR = "エグゼキューター", 
  CONNECTOR = "コネクター",
  CATALYST = "カタリスト",
  SPECIALIST = "スペシャリスト",
  BALANCED = "バランス型"
}

export class ValueCreationAnalyticsService {
  /**
   * VoiceDriveから行動データを取得
   */
  private async fetchVoiceDriveData(employeeId: string, period: DateRange) {
    const response = await fetch(`${process.env.VOICEDRIVE_API_URL}/api/analytics/employee/${employeeId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.VOICEDRIVE_API_KEY}`,
        'X-Period-From': period.from.toISOString(),
        'X-Period-To': period.to.toISOString()
      }
    });
    
    return response.json();
  }

  /**
   * イノベーションスコアの算出
   */
  private calculateInnovationScore(data: VoiceDriveData): number {
    const weights = {
      proposalQuality: 0.3,
      conversionRate: 0.3,
      influenceLevel: 0.2,
      executionRate: 0.2
    };

    const proposalQuality = data.proposals.filter(p => p.status === 'approved').length / 
                           Math.max(data.proposals.length, 1);
    const conversionRate = data.projectsCreated / Math.max(data.proposals.length, 1);
    const influenceLevel = data.totalSupportGained / Math.max(data.proposals.length * 100, 1);
    const executionRate = data.projectsCompleted / Math.max(data.projectsParticipated, 1);

    return (
      proposalQuality * weights.proposalQuality +
      conversionRate * weights.conversionRate +
      influenceLevel * weights.influenceLevel +
      executionRate * weights.executionRate
    ) * 100;
  }

  /**
   * コラボレーションスコアの算出
   */
  private calculateCollaborationScore(data: VoiceDriveData): number {
    const weights = {
      supportProvided: 0.3,
      networkDiversity: 0.3,
      teamContribution: 0.2,
      knowledgeSharing: 0.2
    };

    const supportScore = Math.min(data.supportProvidedCount / 50, 1);
    const diversityScore = data.uniqueCollaborators / Math.max(data.departmentSize, 1);
    const teamScore = data.teamProjectSuccess / Math.max(data.teamProjectsTotal, 1);
    const knowledgeScore = data.knowledgeSharedCount / 20;

    return (
      supportScore * weights.supportProvided +
      diversityScore * weights.networkDiversity +
      teamScore * weights.teamContribution +
      knowledgeScore * weights.knowledgeSharing
    ) * 100;
  }

  /**
   * エンゲージメントスコアの算出
   */
  private calculateEngagementScore(data: VoiceDriveData): number {
    const weights = {
      participation: 0.4,
      consistency: 0.3,
      positivity: 0.3
    };

    const participationRate = data.activeDays / data.totalDays;
    const consistencyScore = 1 - (data.activityVariance / 100);
    const positivityScore = data.positiveInteractions / 
                           Math.max(data.totalInteractions, 1);

    return (
      participationRate * weights.participation +
      consistencyScore * weights.consistency +
      positivityScore * weights.positivity
    ) * 100;
  }

  /**
   * 人材タイプの判定
   */
  private classifyTalentType(scores: Scores): TalentType {
    const { innovation, collaboration, engagement, execution } = scores;

    if (innovation > 80 && collaboration > 70) return TalentType.INNOVATOR;
    if (execution > 85 && engagement > 75) return TalentType.EXECUTOR;
    if (collaboration > 85 && engagement > 80) return TalentType.CONNECTOR;
    if (collaboration > 80 && innovation < 60) return TalentType.CATALYST;
    if (innovation > 70 && collaboration < 50) return TalentType.SPECIALIST;
    
    return TalentType.BALANCED;
  }

  /**
   * インサイトの生成
   */
  private generateInsights(score: ValueCreationScore, historicalData: any[]): string[] {
    const insights: string[] = [];

    // 成長トレンド分析
    if (score.scores.innovation > historicalData[0]?.innovation * 1.2) {
      insights.push("イノベーション力が大幅に向上しています（前期比20%以上）");
    }

    // 強みの特定
    const topScore = Math.max(
      score.scores.innovation,
      score.scores.collaboration,
      score.scores.engagement
    );
    
    if (score.scores.innovation === topScore) {
      insights.push("革新的なアイデアの創出が最大の強みです");
    }

    // 改善機会の特定
    if (score.scores.collaboration < 50) {
      insights.push("チーム協働の機会を増やすことで、さらなる成長が期待できます");
    }

    // ポテンシャル評価
    if (score.talentType === TalentType.INNOVATOR && score.percentileRank.overall > 80) {
      insights.push("次世代リーダー候補として高いポテンシャルを示しています");
    }

    return insights;
  }

  /**
   * 推奨アクションの生成
   */
  private generateRecommendations(score: ValueCreationScore): string[] {
    const recommendations: string[] = [];

    switch (score.talentType) {
      case TalentType.INNOVATOR:
        recommendations.push("イノベーションプロジェクトのリーダーに任命を検討");
        recommendations.push("社外のイノベーション研修への参加を推奨");
        break;

      case TalentType.EXECUTOR:
        recommendations.push("重要プロジェクトの実行責任者として活用");
        recommendations.push("プロジェクトマネジメント資格の取得支援");
        break;

      case TalentType.CONNECTOR:
        recommendations.push("部署横断プロジェクトのファシリテーターに任命");
        recommendations.push("メンター制度での指導役を検討");
        break;

      case TalentType.CATALYST:
        recommendations.push("チームビルディング活動のリーダーに");
        recommendations.push("コーチング研修の受講を推奨");
        break;

      case TalentType.SPECIALIST:
        recommendations.push("専門分野での講師役や知識共有の機会を提供");
        recommendations.push("専門性を活かしたタスクフォースへの参加");
        break;
    }

    // スコアベースの推奨
    if (score.scores.innovation < 40) {
      recommendations.push("創造性ワークショップへの参加で発想力を強化");
    }
    
    if (score.scores.collaboration < 50) {
      recommendations.push("クロスファンクショナルチームへの参加機会を増やす");
    }

    return recommendations;
  }

  /**
   * 統合スコアの算出（メインメソッド）
   */
  async calculateValueCreationScore(
    employeeId: string,
    period: DateRange
  ): Promise<ValueCreationScore> {
    // VoiceDriveデータの取得
    const voiceDriveData = await this.fetchVoiceDriveData(employeeId, period);
    
    // 各スコアの算出
    const innovationScore = this.calculateInnovationScore(voiceDriveData);
    const collaborationScore = this.calculateCollaborationScore(voiceDriveData);
    const engagementScore = this.calculateEngagementScore(voiceDriveData);
    
    // 従来の評価スコア取得（職員カルテシステムから）
    const traditionalScore = await this.fetchTraditionalScore(employeeId, period);
    
    // 総合スコアの算出
    const weights = {
      traditional: 0.5,
      innovation: 0.2,
      collaboration: 0.2,
      engagement: 0.1
    };
    
    const totalScore = 
      traditionalScore * weights.traditional +
      innovationScore * weights.innovation +
      collaborationScore * weights.collaboration +
      engagementScore * weights.engagement;

    // パーセンタイルランクの算出
    const percentileRank = await this.calculatePercentileRank(
      employeeId,
      totalScore
    );

    // 人材タイプの判定
    const talentType = this.classifyTalentType({
      innovation: innovationScore,
      collaboration: collaborationScore,
      engagement: engagementScore,
      execution: voiceDriveData.executionScore
    });

    // 履歴データの取得
    const historicalData = await this.fetchHistoricalScores(employeeId);

    // インサイトと推奨事項の生成
    const valueCreationScore: ValueCreationScore = {
      employeeId,
      period,
      scores: {
        total: totalScore,
        innovation: innovationScore,
        collaboration: collaborationScore,
        engagement: engagementScore,
        traditional: traditionalScore
      },
      percentileRank,
      talentType,
      insights: [],
      recommendations: []
    };

    valueCreationScore.insights = this.generateInsights(
      valueCreationScore,
      historicalData
    );
    
    valueCreationScore.recommendations = this.generateRecommendations(
      valueCreationScore
    );

    // 結果の保存
    await this.saveScore(valueCreationScore);

    return valueCreationScore;
  }

  /**
   * バッチ処理での全従業員スコア算出
   */
  async calculateAllEmployeeScores(period: DateRange): Promise<void> {
    const employees = await this.fetchAllActiveEmployees();
    
    // 並列処理でスコア算出
    const batchSize = 10;
    for (let i = 0; i < employees.length; i += batchSize) {
      const batch = employees.slice(i, i + batchSize);
      await Promise.all(
        batch.map(emp => 
          this.calculateValueCreationScore(emp.id, period)
            .catch(err => console.error(`Error processing ${emp.id}:`, err))
        )
      );
    }
  }
}