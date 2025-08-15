// 総合評価システムv3 サービス層

import { 
  ExperienceLevelsV3, 
  V3EvaluationDesign,
  QuestionDesign,
  MiddleItemDesign,
  SimulationScenario,
  V3PersonalEvaluation,
  FacilityTypeV3,
  JobCategoryV3
} from '@/types/evaluation-v3';

// 経験レベルマッピングサービス
export class ExperienceLevelMapper {
  // 旧システムからv3への変換
  static fromLegacy(oldLevel: string): string {
    const mapping: Record<string, string> = {
      'new': 'new',
      'junior': 'young',      // 一般 → 若手
      'midlevel': 'midlevel',
      'veteran': 'veteran',
      'chief': 'ward-chief',
      'manager': 'ward-manager'
    };
    return mapping[oldLevel] || 'new';
  }
  
  // 表示用ラベル取得
  static getLabel(levelId: string): string {
    const key = levelId.toUpperCase().replace('-', '_') as keyof typeof ExperienceLevelsV3;
    return ExperienceLevelsV3[key]?.label || '新人';
  }
  
  // 年数から自動判定
  static fromYears(years: number): string {
    if (years <= 1) return 'new';
    if (years <= 3) return 'young';
    if (years <= 10) return 'midlevel';
    return 'veteran';
  }
  
  // 経験レベル情報の取得
  static getLevelInfo(levelId: string) {
    const key = levelId.toUpperCase().replace('-', '_') as keyof typeof ExperienceLevelsV3;
    return ExperienceLevelsV3[key];
  }
}

// 評価設計サービス
export class EvaluationDesignService {
  // 評価設計の作成
  static async createDesign(design: Partial<V3EvaluationDesign>): Promise<V3EvaluationDesign> {
    // 実際のAPI呼び出しに置き換える
    const newDesign: V3EvaluationDesign = {
      id: `design_${Date.now()}`,
      year: new Date().getFullYear(),
      facilityType: design.facilityType || 'acute',
      facilityName: design.facilityName || '',
      technicalEvaluation: design.technicalEvaluation || this.getDefaultTechnicalEvaluation(),
      contributionEvaluation: design.contributionEvaluation || this.getDefaultContributionEvaluation(),
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'current_user',
      ...design
    };
    
    // ローカルストレージに保存（開発用）
    localStorage.setItem(`v3_design_${newDesign.id}`, JSON.stringify(newDesign));
    return newDesign;
  }
  
  // デフォルトの技術評価構造
  private static getDefaultTechnicalEvaluation() {
    return {
      coreItems: {
        C01: {
          itemCode: 'C01',
          itemName: '専門技術・スキル',
          totalPoints: 10,
          distribution: { superior: 7, self: 3 },
          middleItems: []
        },
        C02: {
          itemCode: 'C02',
          itemName: '対人関係・ケア',
          totalPoints: 10,
          distribution: { superior: 5, self: 5 },
          middleItems: []
        },
        C03: {
          itemCode: 'C03',
          itemName: '安全・品質管理',
          totalPoints: 10,
          distribution: { superior: 8, self: 2 },
          middleItems: []
        }
      },
      facilityItems: []
    };
  }
  
  // デフォルトの貢献度評価構造
  private static getDefaultContributionEvaluation() {
    return {
      facilityContribution: {
        evaluationPeriod: 'summer' as const,
        totalPoints: 25,
        evaluationMethod: 'relative' as const,
        criteria: {
          S: { min: 90, max: 100, points: 25 },
          A: { min: 80, max: 89, points: 20 },
          B: { min: 70, max: 79, points: 15 },
          C: { min: 60, max: 69, points: 10 },
          D: { min: 0, max: 59, points: 5 }
        }
      },
      corporateContribution: {
        evaluationPeriod: 'winter' as const,
        totalPoints: 25,
        evaluationMethod: 'relative' as const,
        criteria: {
          S: { min: 90, max: 100, points: 25 },
          A: { min: 80, max: 89, points: 20 },
          B: { min: 70, max: 79, points: 15 },
          C: { min: 60, max: 69, points: 10 },
          D: { min: 0, max: 59, points: 5 }
        }
      }
    };
  }
  
  // 評価設計の取得
  static async getDesign(id: string): Promise<V3EvaluationDesign | null> {
    const stored = localStorage.getItem(`v3_design_${id}`);
    return stored ? JSON.parse(stored) : null;
  }
  
  // 評価設計の更新
  static async updateDesign(id: string, updates: Partial<V3EvaluationDesign>): Promise<V3EvaluationDesign | null> {
    const existing = await this.getDesign(id);
    if (!existing) return null;
    
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };
    
    localStorage.setItem(`v3_design_${id}`, JSON.stringify(updated));
    return updated;
  }
}

// 設問選定サービス
export class QuestionSelectorService {
  // 設問の自動選定
  static selectQuestions(
    middleItem: string,
    context: {
      facilityType: FacilityTypeV3;
      experienceLevel: string;
      completedTrainings: string[];
      facilityFocus: string[];
    }
  ): QuestionDesign[] {
    // 設問バンクから候補を取得（実際はAPIから）
    const candidates = this.getQuestionCandidates(middleItem, context);
    
    // スコアリングして最適な設問を選定
    const scored = candidates.map(q => ({
      ...q,
      score: this.calculateScore(q, context)
    }));
    
    // スコア順にソートして必要数を返す
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)  // 10問選定
      .map(({ score, ...q }) => q);
  }
  
  // 設問候補の取得（モック）
  private static getQuestionCandidates(
    middleItem: string,
    context: any
  ): QuestionDesign[] {
    // 実際はAPIから取得
    const baseQuestions: QuestionDesign[] = [
      {
        id: `q_${Date.now()}_1`,
        question: '基本的な看護技術を安全に実施できているか？',
        points: 1,
        evaluator: 'superior',
        autoSelected: true,
        experienceLevels: ['young'],
        keywords: ['基本技術', '安全'],
        usageCount: 0,
        selectionReason: '経験レベルと研修内容にマッチ'
      },
      // ... 他の設問
    ];
    
    return baseQuestions;
  }
  
  // スコア計算
  private static calculateScore(
    question: QuestionDesign,
    context: any
  ): number {
    let score = 0;
    
    // 研修キーワードマッチ
    if (context.completedTrainings.some((t: string) => 
      question.keywords.some(k => t.includes(k))
    )) {
      score += 30;
    }
    
    // 経験年数適合
    if (question.experienceLevels.includes(context.experienceLevel)) {
      score += 25;
    }
    
    // 使用頻度（新しい設問を優先）
    score -= question.usageCount * 5;
    
    return score;
  }
}

// シミュレーションサービス
export class SimulationService {
  // シミュレーション実行
  static async runSimulation(
    scenario: Partial<SimulationScenario>
  ): Promise<SimulationScenario> {
    // スコア分布の計算
    const scoreDistribution = this.calculateScoreDistribution(scenario.design);
    
    // 施設間比較
    const facilityComparison = this.calculateFacilityComparison(scenario.design);
    
    // 公平性指標
    const fairnessIndex = this.calculateFairnessIndex(scoreDistribution, facilityComparison);
    
    // 推奨事項の生成
    const recommendations = this.generateRecommendations(fairnessIndex, scoreDistribution);
    
    const result: SimulationScenario = {
      id: `sim_${Date.now()}`,
      name: scenario.name || 'シミュレーション',
      description: scenario.description || '',
      design: scenario.design || {},
      analysis: {
        scoreDistribution,
        facilityComparison,
        fairnessIndex,
        recommendations
      },
      createdAt: new Date(),
      createdBy: 'current_user'
    };
    
    // 保存
    localStorage.setItem(`v3_simulation_${result.id}`, JSON.stringify(result));
    return result;
  }
  
  private static calculateScoreDistribution(design: any) {
    // モック実装
    return {
      mean: 75,
      median: 76,
      standardDeviation: 8.5,
      percentiles: {
        p10: 62,
        p25: 69,
        p50: 76,
        p75: 82,
        p90: 88
      }
    };
  }
  
  private static calculateFacilityComparison(design: any) {
    return {
      facilities: [
        { name: '小原病院', averageScore: 78, staffCount: 120 },
        { name: '立神リハ', averageScore: 76, staffCount: 80 },
        { name: 'エスポワール立神', averageScore: 74, staffCount: 60 }
      ]
    };
  }
  
  private static calculateFairnessIndex(
    distribution: any,
    comparison: any
  ): number {
    // 公平性を0-100で評価
    const scoreDiff = Math.max(...comparison.facilities.map((f: any) => f.averageScore)) -
                      Math.min(...comparison.facilities.map((f: any) => f.averageScore));
    return Math.max(0, 100 - scoreDiff * 2);
  }
  
  private static generateRecommendations(
    fairnessIndex: number,
    distribution: any
  ): string[] {
    const recommendations = [];
    
    if (fairnessIndex < 70) {
      recommendations.push('施設間の評価差が大きいため、共通項目を増やすことを検討してください');
    }
    
    if (distribution.standardDeviation > 10) {
      recommendations.push('評価のばらつきが大きいため、評価基準の明確化を検討してください');
    }
    
    if (distribution.mean < 70) {
      recommendations.push('全体的に評価が低めです。達成可能な目標設定を見直してください');
    }
    
    return recommendations;
  }
}

// 個人評価サービス
export class PersonalEvaluationService {
  // 評価シートの生成
  static async generateEvaluationSheet(
    staffId: string,
    designId: string
  ): Promise<V3PersonalEvaluation> {
    // スタッフ情報の取得（実際はAPIから）
    const staff = await this.getStaffInfo(staffId);
    
    // 評価設計の取得
    const design = await EvaluationDesignService.getDesign(designId);
    
    if (!design) {
      throw new Error('評価設計が見つかりません');
    }
    
    // 評価シートの生成
    const evaluation: V3PersonalEvaluation = {
      id: `eval_${Date.now()}`,
      staffId,
      staffName: staff.name,
      evaluationPeriod: `${design.year}年度`,
      experienceLevel: staff.experienceLevel,
      experienceLabel: ExperienceLevelMapper.getLabel(staff.experienceLevel),
      technicalScore: {
        coreItems: 0,
        facilityItems: 0,
        total: 0
      },
      contributionScore: {
        facility: 0,
        corporate: 0,
        total: 0
      },
      totalScore: 0,
      grade: 'C',
      status: 'in-progress'
    };
    
    // 保存
    localStorage.setItem(`v3_evaluation_${evaluation.id}`, JSON.stringify(evaluation));
    return evaluation;
  }
  
  private static async getStaffInfo(staffId: string) {
    // モック実装
    return {
      id: staffId,
      name: '山田 花子',
      experienceYears: 3,
      experienceLevel: 'young',
      department: '内科病棟',
      jobCategory: 'nurse'
    };
  }
  
  // 評価の保存
  static async saveEvaluation(
    evaluationId: string,
    scores: Partial<V3PersonalEvaluation>
  ): Promise<V3PersonalEvaluation | null> {
    const stored = localStorage.getItem(`v3_evaluation_${evaluationId}`);
    if (!stored) return null;
    
    const evaluation = JSON.parse(stored);
    const updated = {
      ...evaluation,
      ...scores,
      totalScore: (scores.technicalScore?.total || 0) + (scores.contributionScore?.total || 0),
      grade: this.calculateGrade((scores.technicalScore?.total || 0) + (scores.contributionScore?.total || 0))
    };
    
    localStorage.setItem(`v3_evaluation_${evaluationId}`, JSON.stringify(updated));
    return updated;
  }
  
  private static calculateGrade(score: number): 'S' | 'A' | 'B' | 'C' | 'D' {
    if (score >= 90) return 'S';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    return 'D';
  }
}