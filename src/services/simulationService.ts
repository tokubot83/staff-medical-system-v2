// 評価制度シミュレーションサービス
// 評価設計の妥当性検証と改善提案

import { V3EvaluationDesign } from '@/types/evaluation-v3';
import { selectQuestionsForStaff } from '@/data/questionBank';
import { TrainingIntegrationService } from '@/services/trainingIntegrationService';

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  design: Partial<V3EvaluationDesign>;
  parameters: {
    targetStaffCount: number;
    experienceLevelDistribution: Record<string, number>;
    trainingCompletionRate: number;
    facilityType: string;
  };
  results?: SimulationResults;
  createdAt: Date;
  createdBy: string;
}

export interface SimulationResults {
  scoreDistribution: ScoreDistribution;
  facilityComparison: FacilityComparison;
  fairnessIndex: number;
  recommendations: string[];
  riskFactors: RiskFactor[];
  improvementSuggestions: ImprovementSuggestion[];
}

export interface ScoreDistribution {
  mean: number;
  median: number;
  standardDeviation: number;
  percentiles: {
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
  };
  histogram: {
    range: string;
    count: number;
    percentage: number;
  }[];
}

export interface FacilityComparison {
  facilities: {
    name: string;
    averageScore: number;
    staffCount: number;
    topPerformers: number;
    bottomPerformers: number;
  }[];
  variance: number;
  outliers: string[];
}

export interface RiskFactor {
  type: 'high' | 'medium' | 'low';
  category: string;
  description: string;
  impact: string;
  mitigation: string;
}

export interface ImprovementSuggestion {
  priority: 'high' | 'medium' | 'low';
  area: string;
  currentState: string;
  suggestedChange: string;
  expectedImpact: string;
}

export class SimulationService {
  // シミュレーション実行
  static async runSimulation(scenario: SimulationScenario): Promise<SimulationResults> {
    // モンテカルロシミュレーション用のサンプル生成
    const samples = this.generateSamples(scenario.parameters);
    
    // スコア分布の計算
    const scoreDistribution = this.calculateScoreDistribution(samples);
    
    // 施設間比較
    const facilityComparison = await this.calculateFacilityComparison(
      scenario.design,
      scenario.parameters
    );
    
    // 公平性指標
    const fairnessIndex = this.calculateFairnessIndex(
      scoreDistribution,
      facilityComparison
    );
    
    // リスク要因の分析
    const riskFactors = this.analyzeRiskFactors(
      scoreDistribution,
      facilityComparison,
      scenario.parameters
    );
    
    // 改善提案の生成
    const improvementSuggestions = this.generateImprovementSuggestions(
      scoreDistribution,
      fairnessIndex,
      riskFactors
    );
    
    // 推奨事項の生成
    const recommendations = this.generateRecommendations(
      fairnessIndex,
      scoreDistribution,
      riskFactors
    );
    
    return {
      scoreDistribution,
      facilityComparison,
      fairnessIndex,
      recommendations,
      riskFactors,
      improvementSuggestions
    };
  }
  
  // サンプルデータ生成（モンテカルロ法）
  private static generateSamples(parameters: SimulationScenario['parameters']): number[] {
    const samples: number[] = [];
    const { targetStaffCount, experienceLevelDistribution, trainingCompletionRate } = parameters;
    
    for (let i = 0; i < targetStaffCount; i++) {
      // 経験レベルをランダムに選択
      const experienceLevel = this.selectRandomExperienceLevel(experienceLevelDistribution);
      
      // 基本スコアを経験レベルに応じて設定
      let baseScore = this.getBaseScoreForLevel(experienceLevel);
      
      // 研修完了率の影響
      const trainingBonus = Math.random() < trainingCompletionRate ? 5 : 0;
      
      // ランダムな変動を追加（正規分布）
      const variation = this.generateNormalRandom(0, 5);
      
      const totalScore = Math.max(0, Math.min(100, baseScore + trainingBonus + variation));
      samples.push(totalScore);
    }
    
    return samples;
  }
  
  // 経験レベルをランダム選択
  private static selectRandomExperienceLevel(distribution: Record<string, number>): string {
    const total = Object.values(distribution).reduce((sum, val) => sum + val, 0);
    let random = Math.random() * total;
    
    for (const [level, weight] of Object.entries(distribution)) {
      random -= weight;
      if (random <= 0) return level;
    }
    
    return 'new';
  }
  
  // 経験レベル別の基本スコア
  private static getBaseScoreForLevel(level: string): number {
    const baseScores: Record<string, number> = {
      'new': 60,
      'young': 70,
      'midlevel': 75,
      'veteran': 80,
      'ward-chief': 85,
      'ward-manager': 90
    };
    return baseScores[level] || 70;
  }
  
  // 正規分布に従う乱数生成（Box-Muller法）
  private static generateNormalRandom(mean: number, stdDev: number): number {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return z0 * stdDev + mean;
  }
  
  // スコア分布の計算
  private static calculateScoreDistribution(samples: number[]): ScoreDistribution {
    const sorted = [...samples].sort((a, b) => a - b);
    const n = sorted.length;
    
    // 基本統計量
    const mean = samples.reduce((sum, val) => sum + val, 0) / n;
    const median = sorted[Math.floor(n / 2)];
    
    // 標準偏差
    const variance = samples.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
    const standardDeviation = Math.sqrt(variance);
    
    // パーセンタイル
    const percentiles = {
      p10: sorted[Math.floor(n * 0.1)],
      p25: sorted[Math.floor(n * 0.25)],
      p50: median,
      p75: sorted[Math.floor(n * 0.75)],
      p90: sorted[Math.floor(n * 0.9)]
    };
    
    // ヒストグラム生成
    const histogram = this.generateHistogram(samples);
    
    return {
      mean,
      median,
      standardDeviation,
      percentiles,
      histogram
    };
  }
  
  // ヒストグラム生成
  private static generateHistogram(samples: number[]): ScoreDistribution['histogram'] {
    const bins = [
      { range: '0-59', min: 0, max: 59, count: 0 },
      { range: '60-69', min: 60, max: 69, count: 0 },
      { range: '70-79', min: 70, max: 79, count: 0 },
      { range: '80-89', min: 80, max: 89, count: 0 },
      { range: '90-100', min: 90, max: 100, count: 0 }
    ];
    
    samples.forEach(score => {
      const bin = bins.find(b => score >= b.min && score <= b.max);
      if (bin) bin.count++;
    });
    
    const total = samples.length;
    return bins.map(bin => ({
      range: bin.range,
      count: bin.count,
      percentage: Math.round((bin.count / total) * 100)
    }));
  }
  
  // 施設間比較の計算
  private static async calculateFacilityComparison(
    design: Partial<V3EvaluationDesign>,
    parameters: SimulationScenario['parameters']
  ): Promise<FacilityComparison> {
    // モック実装
    const facilities = [
      {
        name: '小原病院',
        averageScore: 78 + Math.random() * 5,
        staffCount: 120,
        topPerformers: 18,
        bottomPerformers: 12
      },
      {
        name: '立神リハ',
        averageScore: 76 + Math.random() * 5,
        staffCount: 80,
        topPerformers: 12,
        bottomPerformers: 8
      },
      {
        name: 'エスポワール立神',
        averageScore: 74 + Math.random() * 5,
        staffCount: 60,
        topPerformers: 9,
        bottomPerformers: 6
      }
    ];
    
    // 分散計算
    const scores = facilities.map(f => f.averageScore);
    const mean = scores.reduce((sum, s) => sum + s, 0) / scores.length;
    const variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length;
    
    // 外れ値検出
    const outliers: string[] = [];
    facilities.forEach(f => {
      if (Math.abs(f.averageScore - mean) > 2 * Math.sqrt(variance)) {
        outliers.push(f.name);
      }
    });
    
    return {
      facilities,
      variance,
      outliers
    };
  }
  
  // 公平性指標の計算
  private static calculateFairnessIndex(
    distribution: ScoreDistribution,
    comparison: FacilityComparison
  ): number {
    // ジニ係数に基づく公平性評価
    const giniCoefficient = this.calculateGiniCoefficient(distribution);
    
    // 施設間格差
    const facilityGap = comparison.variance > 0 ? Math.sqrt(comparison.variance) : 0;
    
    // 公平性指標（0-100）
    const fairnessIndex = Math.max(0, 100 - (giniCoefficient * 50 + facilityGap * 2));
    
    return Math.round(fairnessIndex);
  }
  
  // ジニ係数の計算
  private static calculateGiniCoefficient(distribution: ScoreDistribution): number {
    // 簡易計算
    const spread = distribution.percentiles.p90 - distribution.percentiles.p10;
    const maxSpread = 100; // 理論上の最大スプレッド
    return spread / maxSpread;
  }
  
  // リスク要因の分析
  private static analyzeRiskFactors(
    distribution: ScoreDistribution,
    comparison: FacilityComparison,
    parameters: SimulationScenario['parameters']
  ): RiskFactor[] {
    const riskFactors: RiskFactor[] = [];
    
    // 評価のばらつきが大きい
    if (distribution.standardDeviation > 15) {
      riskFactors.push({
        type: 'high',
        category: '評価基準',
        description: '評価スコアのばらつきが大きい',
        impact: '職員間の不公平感が生じる可能性',
        mitigation: '評価基準の明確化と評価者研修の実施'
      });
    }
    
    // 施設間格差
    if (comparison.variance > 25) {
      riskFactors.push({
        type: 'medium',
        category: '施設間格差',
        description: '施設間の平均スコアに大きな差がある',
        impact: '施設間の人材流動性が低下',
        mitigation: '施設特性を考慮した評価基準の調整'
      });
    }
    
    // 研修完了率が低い
    if (parameters.trainingCompletionRate < 0.7) {
      riskFactors.push({
        type: 'medium',
        category: '研修',
        description: '法定研修の完了率が低い',
        impact: '評価項目と実態の乖離',
        mitigation: '研修機会の拡充と受講支援'
      });
    }
    
    // 下位層が多い
    const bottomPercentage = distribution.histogram.find(h => h.range === '0-59')?.percentage || 0;
    if (bottomPercentage > 20) {
      riskFactors.push({
        type: 'high',
        category: '人材育成',
        description: '低評価者の割合が高い',
        impact: 'モチベーション低下と離職リスク',
        mitigation: '育成プログラムの強化と個別支援'
      });
    }
    
    return riskFactors;
  }
  
  // 改善提案の生成
  private static generateImprovementSuggestions(
    distribution: ScoreDistribution,
    fairnessIndex: number,
    riskFactors: RiskFactor[]
  ): ImprovementSuggestion[] {
    const suggestions: ImprovementSuggestion[] = [];
    
    // 公平性が低い場合
    if (fairnessIndex < 70) {
      suggestions.push({
        priority: 'high',
        area: '評価制度',
        currentState: `公平性指標: ${fairnessIndex}%`,
        suggestedChange: '評価項目の重み付けを見直し、客観的指標を増やす',
        expectedImpact: '公平性指標を80%以上に改善'
      });
    }
    
    // ばらつきが大きい場合
    if (distribution.standardDeviation > 12) {
      suggestions.push({
        priority: 'medium',
        area: '評価基準',
        currentState: `標準偏差: ${distribution.standardDeviation.toFixed(1)}`,
        suggestedChange: '評価基準の具体例を追加し、判断基準を統一',
        expectedImpact: '標準偏差を10以下に削減'
      });
    }
    
    // 高リスク要因がある場合
    const highRisks = riskFactors.filter(r => r.type === 'high');
    if (highRisks.length > 0) {
      suggestions.push({
        priority: 'high',
        area: 'リスク管理',
        currentState: `高リスク要因: ${highRisks.length}件`,
        suggestedChange: '重点改善項目を設定し、四半期ごとにモニタリング',
        expectedImpact: '6ヶ月以内に高リスク要因を解消'
      });
    }
    
    // 上位層が少ない場合
    const topPercentage = distribution.histogram.find(h => h.range === '90-100')?.percentage || 0;
    if (topPercentage < 10) {
      suggestions.push({
        priority: 'low',
        area: '人材育成',
        currentState: `上位評価者: ${topPercentage}%`,
        suggestedChange: 'エクセレンスプログラムの導入',
        expectedImpact: '上位評価者を15%以上に増加'
      });
    }
    
    return suggestions;
  }
  
  // 推奨事項の生成
  private static generateRecommendations(
    fairnessIndex: number,
    distribution: ScoreDistribution,
    riskFactors: RiskFactor[]
  ): string[] {
    const recommendations: string[] = [];
    
    if (fairnessIndex < 70) {
      recommendations.push('施設間の評価基準を統一し、公平性を向上させてください');
    }
    
    if (distribution.standardDeviation > 10) {
      recommendations.push('評価者研修を実施し、評価基準の理解を深めてください');
    }
    
    if (distribution.mean < 70) {
      recommendations.push('全体的な評価水準を見直し、達成可能な目標設定を検討してください');
    }
    
    if (riskFactors.filter(r => r.type === 'high').length > 0) {
      recommendations.push('高リスク要因に対する改善計画を早急に策定してください');
    }
    
    if (distribution.percentiles.p90 - distribution.percentiles.p10 > 30) {
      recommendations.push('評価格差を縮小するため、中間層の育成に注力してください');
    }
    
    return recommendations;
  }
  
  // シナリオ比較分析
  static async compareScenarios(scenarios: SimulationScenario[]): Promise<{
    bestScenario: string;
    comparison: {
      scenarioId: string;
      name: string;
      fairnessIndex: number;
      meanScore: number;
      riskCount: number;
      rank: number;
    }[];
    recommendation: string;
  }> {
    const results = await Promise.all(
      scenarios.map(async scenario => {
        const result = await this.runSimulation(scenario);
        return {
          scenarioId: scenario.id,
          name: scenario.name,
          fairnessIndex: result.fairnessIndex,
          meanScore: result.scoreDistribution.mean,
          riskCount: result.riskFactors.filter(r => r.type === 'high').length,
          result
        };
      })
    );
    
    // スコアリング（公平性重視）
    const scored = results.map(r => ({
      ...r,
      totalScore: r.fairnessIndex * 0.5 + r.meanScore * 0.3 - r.riskCount * 10
    }));
    
    // ランキング
    const ranked = scored
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((r, index) => ({
        scenarioId: r.scenarioId,
        name: r.name,
        fairnessIndex: r.fairnessIndex,
        meanScore: r.meanScore,
        riskCount: r.riskCount,
        rank: index + 1
      }));
    
    const bestScenario = ranked[0].scenarioId;
    const recommendation = `「${ranked[0].name}」が最も推奨される評価設計です。公平性指標${ranked[0].fairnessIndex}%、平均スコア${ranked[0].meanScore.toFixed(1)}点`;
    
    return {
      bestScenario,
      comparison: ranked,
      recommendation
    };
  }
}