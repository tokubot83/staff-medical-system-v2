/**
 * 相対評価ランキング作成サービス
 * 施設内・法人内での相対評価と7段階総合グレード判定
 */

import { EvaluationData, RelativeEvaluationResult } from './evaluationBulkService';
import { facilityTypes, roles, experienceLevels } from '@/data/evaluationItemBank';

// 相対評価設定
interface RelativeEvaluationConfig {
  facilityWeighting: number;  // 施設内評価の重み（0.0 - 1.0）
  corporateWeighting: number; // 法人内評価の重み（0.0 - 1.0）
  gradeDistribution: {
    S: number;  // 上位X%
    A: number;  // 上位X%
    B: number;  // 中位X%
    C: number;  // 下位X%
    D: number;  // 下位X%
  };
}

// デフォルト設定
const DEFAULT_CONFIG: RelativeEvaluationConfig = {
  facilityWeighting: 0.6,
  corporateWeighting: 0.4,
  gradeDistribution: {
    S: 10,  // 上位10%
    A: 20,  // 上位20%（11-30%）
    B: 40,  // 中位40%（31-70%）
    C: 20,  // 下位20%（71-90%）
    D: 10   // 下位10%（91-100%）
  }
};

// 評価グループ
interface EvaluationGroup {
  facilityType: string;
  position: string;
  experienceLevel?: string;
  employees: EvaluationData[];
}

// ランキング結果
interface RankingData {
  employeeId: string;
  totalScore: number;
  facilityRank: number;
  corporateRank: number;
  facilityPercentile: number;
  corporatePercentile: number;
  adjustedScore: number;  // 重み付け後スコア
}

export class RelativeEvaluationService {
  
  /**
   * 相対評価ランキング作成のメイン処理
   */
  static async createComprehensiveRanking(
    evaluationData: EvaluationData[],
    config: RelativeEvaluationConfig = DEFAULT_CONFIG
  ): Promise<RelativeEvaluationResult[]> {
    
    // 1. データ検証
    this.validateEvaluationData(evaluationData);
    
    // 2. 評価グループ作成
    const evaluationGroups = this.createEvaluationGroups(evaluationData);
    
    // 3. 各グループ内でのランキング作成
    const facilityRankings = new Map<string, RankingData[]>();
    for (const [groupKey, group] of Object.entries(evaluationGroups)) {
      const ranking = this.calculateGroupRanking(group.employees, 'facility');
      facilityRankings.set(groupKey, ranking);
    }
    
    // 4. 法人全体でのランキング作成（職種別）
    const corporateRankings = this.calculateCorporateRankings(evaluationData);
    
    // 5. 2軸評価による最終グレード判定
    const finalResults = this.determineFinalGrades(
      evaluationData,
      facilityRankings,
      corporateRankings,
      config
    );
    
    // 6. 結果の検証とログ出力
    this.validateResults(finalResults);
    
    return finalResults.sort((a, b) => b.totalScore - a.totalScore);
  }
  
  /**
   * 評価グループ作成
   */
  private static createEvaluationGroups(evaluationData: EvaluationData[]): Record<string, EvaluationGroup> {
    const groups: Record<string, EvaluationGroup> = {};
    
    evaluationData.forEach(emp => {
      const groupKey = `${emp.facilityType}_${emp.position}_${emp.experienceLevel}`;
      
      if (!groups[groupKey]) {
        groups[groupKey] = {
          facilityType: emp.facilityType,
          position: emp.position,
          experienceLevel: emp.experienceLevel,
          employees: []
        };
      }
      
      groups[groupKey].employees.push(emp);
    });
    
    return groups;
  }
  
  /**
   * グループ内ランキング計算
   */
  private static calculateGroupRanking(employees: EvaluationData[], rankingType: 'facility' | 'corporate'): RankingData[] {
    return employees
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((emp, index) => ({
        employeeId: emp.employeeId,
        totalScore: emp.totalScore,
        facilityRank: rankingType === 'facility' ? index + 1 : 0,
        corporateRank: rankingType === 'corporate' ? index + 1 : 0,
        facilityPercentile: rankingType === 'facility' ? this.calculatePercentile(index + 1, employees.length) : 0,
        corporatePercentile: rankingType === 'corporate' ? this.calculatePercentile(index + 1, employees.length) : 0,
        adjustedScore: emp.totalScore
      }));
  }
  
  /**
   * 法人全体ランキング計算（職種別）
   */
  private static calculateCorporateRankings(evaluationData: EvaluationData[]): Map<string, RankingData[]> {
    const positionGroups = this.groupByPosition(evaluationData);
    const corporateRankings = new Map<string, RankingData[]>();
    
    for (const [position, employees] of Object.entries(positionGroups)) {
      const ranking = this.calculateGroupRanking(employees, 'corporate');
      corporateRankings.set(position, ranking);
    }
    
    return corporateRankings;
  }
  
  /**
   * 職種別グループ化
   */
  private static groupByPosition(evaluationData: EvaluationData[]): Record<string, EvaluationData[]> {
    return evaluationData.reduce((groups, emp) => {
      if (!groups[emp.position]) {
        groups[emp.position] = [];
      }
      groups[emp.position].push(emp);
      return groups;
    }, {} as Record<string, EvaluationData[]>);
  }
  
  /**
   * 最終グレード判定（2軸評価）
   */
  private static determineFinalGrades(
    evaluationData: EvaluationData[],
    facilityRankings: Map<string, RankingData[]>,
    corporateRankings: Map<string, RankingData[]>,
    config: RelativeEvaluationConfig
  ): RelativeEvaluationResult[] {
    
    const results: RelativeEvaluationResult[] = [];
    
    evaluationData.forEach(emp => {
      // 施設内ランキング取得
      const facilityGroupKey = `${emp.facilityType}_${emp.position}_${emp.experienceLevel}`;
      const facilityRanking = facilityRankings.get(facilityGroupKey);
      const facilityData = facilityRanking?.find(r => r.employeeId === emp.employeeId);
      
      // 法人内ランキング取得
      const corporateRanking = corporateRankings.get(emp.position);
      const corporateData = corporateRanking?.find(r => r.employeeId === emp.employeeId);
      
      if (facilityData && corporateData) {
        // 重み付け計算
        const adjustedScore = 
          (facilityData.facilityPercentile * config.facilityWeighting) +
          (corporateData.corporatePercentile * config.corporateWeighting);
        
        // 最終グレード決定
        const finalGrade = this.determineGradeFromPercentile(adjustedScore, config.gradeDistribution);
        
        results.push({
          employeeId: emp.employeeId,
          employeeName: emp.employeeName,
          totalScore: emp.totalScore,
          facilityRank: facilityData.facilityRank,
          corporateRank: corporateData.corporateRank,
          facilityPercentile: facilityData.facilityPercentile,
          corporatePercentile: corporateData.corporatePercentile,
          finalGrade
        });
      }
    });
    
    return results;
  }
  
  /**
   * パーセンタイルからグレード決定
   */
  private static determineGradeFromPercentile(percentile: number, distribution: RelativeEvaluationConfig['gradeDistribution']): string {
    if (percentile >= 100 - distribution.S) return 'S';
    if (percentile >= 100 - distribution.S - distribution.A) return 'A';
    if (percentile >= 100 - distribution.S - distribution.A - distribution.B) return 'B';
    if (percentile >= distribution.D) return 'C';
    return 'D';
  }
  
  /**
   * パーセンタイル計算
   */
  private static calculatePercentile(rank: number, total: number): number {
    return Math.round(((total - rank + 1) / total) * 100);
  }
  
  /**
   * データ検証
   */
  private static validateEvaluationData(evaluationData: EvaluationData[]): void {
    if (!evaluationData || evaluationData.length === 0) {
      throw new Error('評価データが空です');
    }
    
    const requiredFields = ['employeeId', 'employeeName', 'totalScore', 'position', 'facilityType'];
    evaluationData.forEach((emp, index) => {
      requiredFields.forEach(field => {
        if (!emp[field as keyof EvaluationData]) {
          throw new Error(`${index + 1}行目: ${field}が不足しています`);
        }
      });
      
      if (emp.totalScore < 0 || emp.totalScore > 100) {
        throw new Error(`${index + 1}行目: 総合得点が0-100の範囲外です（${emp.totalScore}点）`);
      }
    });
  }
  
  /**
   * 結果検証
   */
  private static validateResults(results: RelativeEvaluationResult[]): void {
    const gradeDistribution = {
      S: results.filter(r => r.finalGrade === 'S').length,
      A: results.filter(r => r.finalGrade === 'A').length,
      B: results.filter(r => r.finalGrade === 'B').length,
      C: results.filter(r => r.finalGrade === 'C').length,
      D: results.filter(r => r.finalGrade === 'D').length
    };
    
    console.log('相対評価結果分布:', {
      総人数: results.length,
      S評価: `${gradeDistribution.S}人 (${Math.round(gradeDistribution.S / results.length * 100)}%)`,
      A評価: `${gradeDistribution.A}人 (${Math.round(gradeDistribution.A / results.length * 100)}%)`,
      B評価: `${gradeDistribution.B}人 (${Math.round(gradeDistribution.B / results.length * 100)}%)`,
      C評価: `${gradeDistribution.C}人 (${Math.round(gradeDistribution.C / results.length * 100)}%)`,
      D評価: `${gradeDistribution.D}人 (${Math.round(gradeDistribution.D / results.length * 100)}%)`
    });
  }
  
  /**
   * 詳細統計レポート生成
   */
  static generateDetailedStatistics(results: RelativeEvaluationResult[]): {
    overall: any;
    byFacility: any;
    byPosition: any;
    byGrade: any;
  } {
    
    const overall = {
      総人数: results.length,
      平均点: Math.round(results.reduce((sum, r) => sum + r.totalScore, 0) / results.length),
      最高点: Math.max(...results.map(r => r.totalScore)),
      最低点: Math.min(...results.map(r => r.totalScore)),
      標準偏差: this.calculateStandardDeviation(results.map(r => r.totalScore))
    };
    
    // 施設種別統計
    const facilityStats = this.groupStatsByField(results, 'facilityType');
    const byFacility = Object.entries(facilityStats).map(([facility, data]) => ({
      施設種別: facility,
      人数: data.length,
      平均点: Math.round(data.reduce((sum: number, r: any) => sum + r.totalScore, 0) / data.length),
      S評価数: data.filter((r: any) => r.finalGrade === 'S').length,
      A評価数: data.filter((r: any) => r.finalGrade === 'A').length
    }));
    
    // 職種別統計  
    const positionStats = this.groupStatsByField(results, 'position');
    const byPosition = Object.entries(positionStats).map(([position, data]) => ({
      職種: position,
      人数: data.length,
      平均点: Math.round(data.reduce((sum: number, r: any) => sum + r.totalScore, 0) / data.length)
    }));
    
    // グレード別統計
    const gradeStats = this.groupStatsByField(results, 'finalGrade');
    const byGrade = Object.entries(gradeStats).map(([grade, data]) => ({
      グレード: grade,
      人数: data.length,
      割合: `${Math.round(data.length / results.length * 100)}%`,
      平均点: Math.round(data.reduce((sum: number, r: any) => sum + r.totalScore, 0) / data.length),
      点数範囲: `${Math.min(...data.map((r: any) => r.totalScore))} - ${Math.max(...data.map((r: any) => r.totalScore))}`
    }));
    
    return { overall, byFacility, byPosition, byGrade };
  }
  
  /**
   * フィールド別グループ化（統計用）
   */
  private static groupStatsByField(results: RelativeEvaluationResult[], field: keyof RelativeEvaluationResult): Record<string, RelativeEvaluationResult[]> {
    return results.reduce((groups, result) => {
      const key = String(result[field]);
      if (!groups[key]) groups[key] = [];
      groups[key].push(result);
      return groups;
    }, {} as Record<string, RelativeEvaluationResult[]>);
  }
  
  /**
   * 標準偏差計算
   */
  private static calculateStandardDeviation(numbers: number[]): number {
    const avg = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
    const squaredDiffs = numbers.map(num => Math.pow(num - avg, 2));
    const avgSquaredDiff = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / squaredDiffs.length;
    return Math.round(Math.sqrt(avgSquaredDiff) * 100) / 100;
  }
  
  /**
   * カスタム評価設定での再計算
   */
  static async recalculateWithCustomConfig(
    evaluationData: EvaluationData[],
    customConfig: Partial<RelativeEvaluationConfig>
  ): Promise<RelativeEvaluationResult[]> {
    const config = { ...DEFAULT_CONFIG, ...customConfig };
    return this.createComprehensiveRanking(evaluationData, config);
  }
  
  /**
   * 個別職員の詳細分析
   */
  static analyzeIndividualEmployee(
    employeeId: string,
    results: RelativeEvaluationResult[],
    evaluationData: EvaluationData[]
  ): {
    employee: RelativeEvaluationResult | null;
    facilityComparison: any;
    corporateComparison: any;
    recommendations: string[];
  } {
    
    const employee = results.find(r => r.employeeId === employeeId);
    if (!employee) {
      return {
        employee: null,
        facilityComparison: null,
        corporateComparison: null,
        recommendations: ['該当する職員が見つかりません']
      };
    }
    
    const empData = evaluationData.find(e => e.employeeId === employeeId);
    if (!empData) {
      return {
        employee,
        facilityComparison: null,
        corporateComparison: null,
        recommendations: ['職員の詳細データが見つかりません']
      };
    }
    
    // 同一施設・職種での比較
    const facilityPeers = results.filter(r => 
      r.employeeId !== employeeId &&
      evaluationData.find(e => e.employeeId === r.employeeId)?.facilityType === empData.facilityType &&
      evaluationData.find(e => e.employeeId === r.employeeId)?.position === empData.position
    );
    
    // 同職種法人内での比較
    const corporatePeers = results.filter(r =>
      r.employeeId !== employeeId &&
      evaluationData.find(e => e.employeeId === r.employeeId)?.position === empData.position
    );
    
    const facilityComparison = {
      同僚数: facilityPeers.length,
      平均点: Math.round(facilityPeers.reduce((sum, r) => sum + r.totalScore, 0) / facilityPeers.length),
      自身との差: employee.totalScore - Math.round(facilityPeers.reduce((sum, r) => sum + r.totalScore, 0) / facilityPeers.length),
      順位: employee.facilityRank,
      パーセンタイル: employee.facilityPercentile
    };
    
    const corporateComparison = {
      同職種数: corporatePeers.length,
      平均点: Math.round(corporatePeers.reduce((sum, r) => sum + r.totalScore, 0) / corporatePeers.length),
      自身との差: employee.totalScore - Math.round(corporatePeers.reduce((sum, r) => sum + r.totalScore, 0) / corporatePeers.length),
      順位: employee.corporateRank,
      パーセンタイル: employee.corporatePercentile
    };
    
    // 改善提案生成
    const recommendations = this.generateRecommendations(employee, empData, facilityComparison, corporateComparison);
    
    return {
      employee,
      facilityComparison,
      corporateComparison,
      recommendations
    };
  }
  
  /**
   * 改善提案生成
   */
  private static generateRecommendations(
    employee: RelativeEvaluationResult,
    empData: EvaluationData,
    facilityComp: any,
    corporateComp: any
  ): string[] {
    
    const recommendations: string[] = [];
    
    // 総合評価に基づく提案
    if (employee.finalGrade === 'S' || employee.finalGrade === 'A') {
      recommendations.push('優秀な成績です。リーダーシップの機会や後輩指導を検討してください。');
      recommendations.push('専門スキル向上のための上級研修の受講をお勧めします。');
    } else if (employee.finalGrade === 'C' || employee.finalGrade === 'D') {
      recommendations.push('個別サポートが必要です。上司との定期面談を増やしてください。');
      recommendations.push('基礎スキル向上のための研修プログラムの受講をお勧めします。');
    }
    
    // 技術評価に基づく提案
    const techScore = empData.technicalEvaluation.total;
    if (techScore < 35) {
      recommendations.push('技術評価が低めです。OJTや技術研修の強化を検討してください。');
    }
    
    // 貢献度評価に基づく提案
    const contribScore = empData.contributionEvaluation.total;
    if (contribScore < 35) {
      recommendations.push('組織貢献度向上のため、委員会活動や改善提案への参加を促してください。');
    }
    
    // 施設内順位に基づく提案
    if (employee.facilityPercentile < 30) {
      recommendations.push('施設内での順位向上のため、同僚との連携強化をお勧めします。');
    }
    
    return recommendations;
  }
}