/**
 * 評価バッチ処理サービス
 * 評価期間終了後に実行される一括計算処理
 * 将来的にはDBトランザクション内で実行
 */

import { 
  EvaluationGrade, 
  FinalEvaluationGrade,
  TwoAxisEvaluation 
} from '@/types/two-axis-evaluation';

// 評価期間の定義
export type EvaluationPeriod = {
  id: string;
  year: number;
  half: 'H1' | 'H2'; // H1: 上期, H2: 下期
  startDate: Date;
  endDate: Date;
  status: 'planning' | 'active' | 'closed' | 'finalized';
};

// 組織貢献度査定期間（賞与時期）
export type ContributionAssessmentPeriod = {
  id: string;
  year: number;
  term: 'summer' | 'winter'; // summer: 8月賞与, winter: 12月賞与
  assessmentMonth: 8 | 12;
  evaluationPeriod: string; // 対象期間 (summer: "12月-5月", winter: "6月-11月")
  status: 'draft' | 'collecting' | 'submitted' | 'finalized';
};

// 年間評価スケジュール
export const EVALUATION_SCHEDULE = {
  contribution: {
    summer: {
      month: 8,
      period: '12月～5月実績',  // 前年12月～当年5月
      description: '夏季賞与時査定'
    },
    winter: {
      month: 12,
      period: '6月～11月実績',   // 当年6月～11月
      description: '冬季賞与時査定'
    }
  },
  technical: {
    annual: {
      month: 3,  // 3月実施（年度末）
      period: '4月～3月',
      description: '年間技術評価'
    }
  },
  finalCalculation: {
    month: 3,  // 3月末に全評価を統合
    description: '技術評価50点 + 施設貢献25点 + 法人貢献25点の最終計算'
  }
};

// 評価入力データ（バッチ処理前）
export interface EvaluationInputData {
  id: string;
  staffId: string;
  staffName: string;
  facilityId: string;
  facilityName: string;
  jobCategory: string; // 看護職、介護職、etc
  jobLevel: string; // 新人、初級、中級、ベテラン、主任、etc
  period: string; // '2024-H2'
  
  // 技術評価（50点満点）
  technicalScore: {
    superiorEval: number; // 上司評価（60%）
    selfEval: number; // 自己評価（40%）
    totalScore: number; // 計算済みスコア
  };
  
  // 施設貢献活動記録（半期ごとの管理者評価）
  facilityContribution: {
    summer?: {  // 8月賞与時査定（12月～5月実績）
      committees: number; // 委員会活動点数
      training: number; // 研修参加・講師点数
      improvements: number; // 改善提案・QC活動点数
      mentoring: number; // 新人指導・プリセプター点数
      overtime: number; // 時間外協力点数
      subtotal: number; // 小計（管理者入力）
    };
    winter?: {  // 12月賞与時査定（6月～11月実績）
      committees: number;
      training: number;
      improvements: number;
      mentoring: number;
      overtime: number;
      subtotal: number;
    };
    yearTotal?: number; // 年間合計点数
    finalScore?: number; // 相対評価による最終配点（25点満点）
  };
  
  // 法人貢献活動記録（半期ごとの管理者評価）
  corporateContribution: {
    summer?: {  // 8月賞与時査定（12月～5月実績）
      events: number; // 法人行事参加点数
      crossFacilitySupport: number; // 他施設応援点数
      projects: number; // 法人プロジェクト参加点数
      recruitment: number; // 採用活動協力点数
      publicity: number; // 広報活動協力点数
      subtotal: number; // 小計（管理者入力）
    };
    winter?: {  // 12月賞与時査定（6月～11月実績）
      events: number;
      crossFacilitySupport: number;
      projects: number;
      recruitment: number;
      publicity: number;
      subtotal: number;
    };
    yearTotal?: number; // 年間合計点数
    finalScore?: number; // 相対評価による最終配点（25点満点）
  };
  
  // メタデータ
  createdAt: Date;
  updatedAt: Date;
  submittedAt?: Date;
  evaluatorId: string;
  status: 'draft' | 'submitted' | 'confirmed';
}

// バッチ処理結果
export interface BatchProcessResult {
  period: string;
  processedAt: Date;
  totalCount: number;
  successCount: number;
  failureCount: number;
  rankings: RankingResult[];
  errors: BatchError[];
}

// ランキング結果
export interface RankingResult {
  staffId: string;
  facilityId: string;
  jobCategory: string;
  totalScore: number;
  facilityRank: number;
  facilityTotal: number;
  facilityPercentile: number;
  corporateRank: number;
  corporateTotal: number;
  corporatePercentile: number;
  facilityGrade: EvaluationGrade;
  corporateGrade: EvaluationGrade;
  finalGrade: FinalEvaluationGrade;
}

// バッチエラー
export interface BatchError {
  staffId: string;
  errorType: 'MISSING_DATA' | 'CALCULATION_ERROR' | 'VALIDATION_ERROR';
  message: string;
  details?: any;
}

export class EvaluationBatchService {
  /**
   * 評価期間終了後の一括計算処理メイン
   */
  async executeBatchCalculation(period: string): Promise<BatchProcessResult> {
    console.log(`[Batch] Starting evaluation batch process for period: ${period}`);
    
    const startTime = Date.now();
    const result: BatchProcessResult = {
      period,
      processedAt: new Date(),
      totalCount: 0,
      successCount: 0,
      failureCount: 0,
      rankings: [],
      errors: []
    };

    try {
      // 1. 評価データの取得
      const evaluations = await this.fetchEvaluationData(period);
      result.totalCount = evaluations.length;
      
      // 2. データ検証
      const validatedData = await this.validateEvaluationData(evaluations, result);
      
      // 3. 職種別・施設別にグループ化
      const groupedData = this.groupEvaluations(validatedData);
      
      // 4. 施設内順位計算
      const facilityRankings = this.calculateFacilityRankings(groupedData);
      
      // 5. 法人内順位計算（職種別）
      const corporateRankings = this.calculateCorporateRankings(validatedData);
      
      // 6. 貢献度スコア計算
      const contributionScores = this.calculateContributionScores(
        facilityRankings,
        corporateRankings
      );
      
      // 7. 最終評価グレード算出
      const finalResults = this.calculateFinalGrades(contributionScores);
      
      // 8. 結果の保存
      await this.saveResults(finalResults);
      
      result.rankings = finalResults;
      result.successCount = finalResults.length;
      
      const elapsedTime = Date.now() - startTime;
      console.log(`[Batch] Completed in ${elapsedTime}ms`);
      
    } catch (error) {
      console.error('[Batch] Fatal error:', error);
      result.errors.push({
        staffId: 'SYSTEM',
        errorType: 'CALCULATION_ERROR',
        message: 'バッチ処理中に致命的エラーが発生しました',
        details: error
      });
    }
    
    return result;
  }

  /**
   * 評価データの取得（将来的にはDBから）
   */
  private async fetchEvaluationData(period: string): Promise<EvaluationInputData[]> {
    // TODO: 実際のDB実装時はここでデータ取得
    // 現在はモックデータを返す
    return this.generateMockEvaluationData(period);
  }

  /**
   * データ検証
   */
  private async validateEvaluationData(
    evaluations: EvaluationInputData[],
    result: BatchProcessResult
  ): Promise<EvaluationInputData[]> {
    const validated: EvaluationInputData[] = [];
    
    for (const evalData of evaluations) {
      // 必須項目チェック
      if (!evalData.staffId || !evalData.facilityId || !evalData.jobCategory) {
        result.errors.push({
          staffId: evalData.staffId,
          errorType: 'MISSING_DATA',
          message: '必須データが不足しています'
        });
        result.failureCount++;
        continue;
      }
      
      // スコア範囲チェック
      if (evalData.technicalScore.totalScore < 0 || evalData.technicalScore.totalScore > 50) {
        result.errors.push({
          staffId: evalData.staffId,
          errorType: 'VALIDATION_ERROR',
          message: '技術評価スコアが範囲外です'
        });
        result.failureCount++;
        continue;
      }
      
      validated.push(evalData);
    }
    
    return validated;
  }

  /**
   * 職種別・施設別グループ化
   */
  private groupEvaluations(evaluations: EvaluationInputData[]): Map<string, EvaluationInputData[]> {
    const grouped = new Map<string, EvaluationInputData[]>();
    
    for (const evalData of evaluations) {
      // グループキー: 施設ID_職種
      const key = `${evalData.facilityId}_${evalData.jobCategory}`;
      
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(evalData);
    }
    
    return grouped;
  }

  /**
   * 施設内順位計算
   */
  private calculateFacilityRankings(
    groupedData: Map<string, EvaluationInputData[]>
  ): Map<string, number> {
    const rankings = new Map<string, number>();
    
    groupedData.forEach((group, groupKey) => {
      // スコアでソート（降順）
      const sorted = [...group].sort((a, b) => {
        const scoreA = this.calculateTotalScore(a);
        const scoreB = this.calculateTotalScore(b);
        return scoreB - scoreA;
      });
      
      // 順位付け
      sorted.forEach((evalData, index) => {
        rankings.set(`${evalData.staffId}_facility`, index + 1);
        rankings.set(`${evalData.staffId}_facility_total`, sorted.length);
      });
    });
    
    return rankings;
  }

  /**
   * 法人内順位計算（職種別）
   */
  private calculateCorporateRankings(
    evaluations: EvaluationInputData[]
  ): Map<string, number> {
    const rankings = new Map<string, number>();
    
    // 職種別にグループ化
    const byJobCategory = new Map<string, EvaluationInputData[]>();
    evaluations.forEach(evalData => {
      if (!byJobCategory.has(evalData.jobCategory)) {
        byJobCategory.set(evalData.jobCategory, []);
      }
      byJobCategory.get(evalData.jobCategory)!.push(evalData);
    });
    
    // 各職種内で順位計算
    byJobCategory.forEach((group) => {
      const sorted = [...group].sort((a, b) => {
        const scoreA = this.calculateTotalScore(a);
        const scoreB = this.calculateTotalScore(b);
        return scoreB - scoreA;
      });
      
      sorted.forEach((evalData, index) => {
        rankings.set(`${evalData.staffId}_corporate`, index + 1);
        rankings.set(`${evalData.staffId}_corporate_total`, sorted.length);
      });
    });
    
    return rankings;
  }

  /**
   * 貢献度スコア計算
   */
  private calculateContributionScores(
    facilityRankings: Map<string, number>,
    corporateRankings: Map<string, number>
  ): RankingResult[] {
    const results: RankingResult[] = [];
    
    // スタッフIDを抽出
    const staffIds = new Set<string>();
    facilityRankings.forEach((_, key) => {
      if (key.endsWith('_facility')) {
        staffIds.add(key.replace('_facility', ''));
      }
    });
    
    staffIds.forEach(staffId => {
      const facilityRank = facilityRankings.get(`${staffId}_facility`) || 0;
      const facilityTotal = facilityRankings.get(`${staffId}_facility_total`) || 1;
      const corporateRank = corporateRankings.get(`${staffId}_corporate`) || 0;
      const corporateTotal = corporateRankings.get(`${staffId}_corporate_total`) || 1;
      
      // パーセンタイル計算
      const facilityPercentile = (facilityRank / facilityTotal) * 100;
      const corporatePercentile = (corporateRank / corporateTotal) * 100;
      
      // グレード判定
      const facilityGrade = this.percentileToGrade(facilityPercentile);
      const corporateGrade = this.percentileToGrade(corporatePercentile);
      const finalGrade = this.getFinalGrade(corporateGrade, facilityGrade);
      
      results.push({
        staffId,
        facilityId: '', // TODO: 実データから取得
        jobCategory: '', // TODO: 実データから取得
        totalScore: 0, // TODO: 実スコア計算
        facilityRank,
        facilityTotal,
        facilityPercentile,
        corporateRank,
        corporateTotal,
        corporatePercentile,
        facilityGrade,
        corporateGrade,
        finalGrade
      });
    });
    
    return results;
  }

  /**
   * 最終評価グレード算出
   */
  private calculateFinalGrades(rankings: RankingResult[]): RankingResult[] {
    return rankings.map(ranking => {
      // 夏季貢献度点数の計算（各12.5点満点）
      const summerFacilityPoints = this.percentileToPoints(ranking.facilityPercentile, 12.5);
      const summerCorporatePoints = this.percentileToPoints(ranking.corporatePercentile, 12.5);
      
      // 冬季貢献度点数の計算（各12.5点満点）
      const winterFacilityPoints = this.percentileToPoints(ranking.facilityPercentile, 12.5);
      const winterCorporatePoints = this.percentileToPoints(ranking.corporatePercentile, 12.5);
      
      // 年間合計
      const totalFacilityPoints = summerFacilityPoints + winterFacilityPoints; // 最大25点
      const totalCorporatePoints = summerCorporatePoints + winterCorporatePoints; // 最大25点
      
      // 技術評価は別途取得が必要
      const technicalPoints = 35; // TODO: 実データから取得（最大50点）
      
      ranking.totalScore = technicalPoints + totalFacilityPoints + totalCorporatePoints;
      
      return ranking;
    });
  }

  /**
   * パーセンタイルから評価グレードへの変換
   */
  private percentileToGrade(percentile: number): EvaluationGrade {
    if (percentile <= 10) return 'S';
    if (percentile <= 30) return 'A';
    if (percentile <= 70) return 'B';
    if (percentile <= 90) return 'C';
    return 'D';
  }

  /**
   * パーセンタイルから貢献点数への変換
   * 夏季・冬季それぞれ施設12.5点、法人12.5点の配点
   */
  private percentileToPoints(percentile: number, maxPoints: number = 12.5): number {
    // 相対評価による配点（最大12.5点）
    if (percentile <= 10) return maxPoints;  // 上位10% = 12.5点
    if (percentile <= 20) return maxPoints * 0.9;  // 11.25点
    if (percentile <= 30) return maxPoints * 0.8;  // 10点
    if (percentile <= 40) return maxPoints * 0.7;  // 8.75点
    if (percentile <= 50) return maxPoints * 0.6;  // 7.5点
    if (percentile <= 60) return maxPoints * 0.5;  // 6.25点
    if (percentile <= 70) return maxPoints * 0.4;  // 5点
    if (percentile <= 80) return 7.5;
    if (percentile <= 90) return 5;
    return 2.5;
  }

  /**
   * 最終評価グレードの決定（2軸評価マトリックス）
   */
  private getFinalGrade(
    corporateGrade: EvaluationGrade,
    facilityGrade: EvaluationGrade
  ): FinalEvaluationGrade {
    // 評価マトリックスに基づく判定
    const matrix: Record<string, FinalEvaluationGrade> = {
      'S_S': 'S+', 'S_A': 'S', 'S_B': 'S', 'S_C': 'A', 'S_D': 'B',
      'A_S': 'S', 'A_A': 'A+', 'A_B': 'A', 'A_C': 'B', 'A_D': 'C',
      'B_S': 'A', 'B_A': 'A', 'B_B': 'B', 'B_C': 'C', 'B_D': 'D',
      'C_S': 'B', 'C_A': 'B', 'C_B': 'C', 'C_C': 'C', 'C_D': 'D',
      'D_S': 'C', 'D_A': 'C', 'D_B': 'D', 'D_C': 'D', 'D_D': 'D'
    };
    
    const key = `${corporateGrade}_${facilityGrade}`;
    return matrix[key] || 'B';
  }

  /**
   * 合計スコアの計算（年間貢献度を考慮）
   */
  private calculateTotalScore(evaluation: EvaluationInputData): number {
    // 技術評価
    const technicalScore = evaluation.technicalScore.totalScore;
    
    // 施設貢献の年間合計計算
    const facilitySummer = evaluation.facilityContribution.summer?.subtotal || 0;
    const facilityWinter = evaluation.facilityContribution.winter?.subtotal || 0;
    evaluation.facilityContribution.yearTotal = facilitySummer + facilityWinter;
    
    // 法人貢献の年間合計計算
    const corporateSummer = evaluation.corporateContribution.summer?.subtotal || 0;
    const corporateWinter = evaluation.corporateContribution.winter?.subtotal || 0;
    evaluation.corporateContribution.yearTotal = corporateSummer + corporateWinter;
    
    // 暫定的な合計（相対評価前）
    return technicalScore + evaluation.facilityContribution.yearTotal + evaluation.corporateContribution.yearTotal;
  }

  /**
   * 組織貢献度の半期入力（管理者用）
   */
  async inputContributionAssessment(
    staffId: string,
    year: number,
    term: 'summer' | 'winter',
    facilityScores: {
      committees: number;
      training: number;
      improvements: number;
      mentoring: number;
      overtime: number;
    },
    corporateScores: {
      events: number;
      crossFacilitySupport: number;
      projects: number;
      recruitment: number;
      publicity: number;
    }
  ): Promise<void> {
    // 施設貢献の小計
    const facilitySubtotal = Object.values(facilityScores).reduce((sum, score) => sum + score, 0);
    
    // 法人貢献の小計
    const corporateSubtotal = Object.values(corporateScores).reduce((sum, score) => sum + score, 0);
    
    console.log(`[Contribution] ${year}年 ${term === 'summer' ? '8月' : '12月'}賞与時査定入力`);
    console.log(`[Contribution] 職員: ${staffId}`);
    console.log(`[Contribution] 施設貢献: ${facilitySubtotal}点, 法人貢献: ${corporateSubtotal}点`);
    
    // TODO: DB保存処理
    // await db.contributionAssessments.upsert({
    //   where: { staffId_year_term: { staffId, year, term } },
    //   data: {
    //     facilityScores,
    //     corporateScores,
    //     facilitySubtotal,
    //     corporateSubtotal,
    //     updatedAt: new Date()
    //   }
    // });
  }

  /**
   * 年間貢献度の相対評価計算（年度末実行）
   */
  async calculateYearlyContributionRanking(year: number): Promise<void> {
    console.log(`[Contribution] ${year}年度 年間貢献度の相対評価開始`);
    
    // 全職員の年間貢献度データを取得
    const allStaffContributions = await this.fetchYearlyContributions(year);
    
    // 職種別・施設別にグループ化
    const groupedByCategory = this.groupContributionsByCategory(allStaffContributions);
    
    // 各グループ内で相対評価
    groupedByCategory.forEach((group, categoryKey) => {
      // 施設貢献の順位付け
      const facilitySorted = [...group].sort((a, b) => 
        (b.facilityContribution.yearTotal || 0) - (a.facilityContribution.yearTotal || 0)
      );
      
      // 法人貢献の順位付け
      const corporateSorted = [...group].sort((a, b) =>
        (b.corporateContribution.yearTotal || 0) - (a.corporateContribution.yearTotal || 0)
      );
      
      // パーセンタイルに基づく配点
      facilitySorted.forEach((staff, index) => {
        const percentile = ((index + 1) / facilitySorted.length) * 100;
        staff.facilityContribution.finalScore = this.percentileToPoints(percentile);
      });
      
      corporateSorted.forEach((staff, index) => {
        const percentile = ((index + 1) / corporateSorted.length) * 100;
        staff.corporateContribution.finalScore = this.percentileToPoints(percentile);
      });
    });
    
    console.log(`[Contribution] ${year}年度 相対評価完了`);
  }

  /**
   * 年間貢献度データの取得
   */
  private async fetchYearlyContributions(year: number): Promise<EvaluationInputData[]> {
    // TODO: 実際のDB実装
    return [];
  }

  /**
   * 職種別グループ化
   */
  private groupContributionsByCategory(
    contributions: EvaluationInputData[]
  ): Map<string, EvaluationInputData[]> {
    const grouped = new Map<string, EvaluationInputData[]>();
    
    contributions.forEach(contrib => {
      const key = `${contrib.facilityId}_${contrib.jobCategory}`;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(contrib);
    });
    
    return grouped;
  }

  /**
   * 結果の保存
   */
  private async saveResults(results: RankingResult[]): Promise<void> {
    // TODO: DB実装時はここで保存処理
    console.log(`[Batch] Saving ${results.length} evaluation results`);
    
    // 将来的なDB保存のシミュレーション
    for (const result of results) {
      // await db.evaluationResults.create({
      //   data: result
      // });
    }
  }

  /**
   * モックデータ生成（開発用）
   */
  private generateMockEvaluationData(period: string): EvaluationInputData[] {
    const facilities = ['acute-hospital', 'chronic-hospital', 'roken', 'grouphome'];
    const jobCategories = ['看護職', '介護職', '看護補助者'];
    const jobLevels = ['新人', '初級', '中級', 'ベテラン'];
    
    const mockData: EvaluationInputData[] = [];
    
    facilities.forEach(facility => {
      jobCategories.forEach(category => {
        jobLevels.forEach(level => {
          // 各組み合わせで5-10人のスタッフを生成
          const staffCount = Math.floor(Math.random() * 6) + 5;
          
          for (let i = 0; i < staffCount; i++) {
            mockData.push({
              id: `${facility}_${category}_${level}_${i}`,
              staffId: `STAFF_${facility}_${category}_${level}_${i}`,
              staffName: `テスト職員${i + 1}`,
              facilityId: facility,
              facilityName: facility,
              jobCategory: category,
              jobLevel: level,
              period,
              technicalScore: {
                superiorEval: Math.random() * 30 + 20,
                selfEval: Math.random() * 20 + 10,
                totalScore: Math.random() * 30 + 20
              },
              facilityContribution: {
                summer: {
                  committees: 8,
                  training: 6,
                  improvements: 7,
                  mentoring: 9,
                  overtime: Math.floor(Math.random() * 10),
                  subtotal: 35 + Math.floor(Math.random() * 15)
                },
                winter: {
                  committees: 7,
                  training: 8,
                  improvements: 6,
                  mentoring: 8,
                  overtime: Math.floor(Math.random() * 10),
                  subtotal: 30 + Math.floor(Math.random() * 15)
                },
                yearTotal: 65 + Math.floor(Math.random() * 30)
              },
              corporateContribution: {
                summer: {
                  events: 5,
                  crossFacilitySupport: Math.floor(Math.random() * 10),
                  projects: 8,
                  recruitment: 6,
                  publicity: 4,
                  subtotal: 25 + Math.floor(Math.random() * 15)
                },
                winter: {
                  events: 6,
                  crossFacilitySupport: Math.floor(Math.random() * 10),
                  projects: 7,
                  recruitment: 5,
                  publicity: 3,
                  subtotal: 20 + Math.floor(Math.random() * 15)
                },
                yearTotal: 45 + Math.floor(Math.random() * 30)
              },
              createdAt: new Date(),
              updatedAt: new Date(),
              submittedAt: new Date(),
              evaluatorId: `EVALUATOR_${i}`,
              status: 'submitted'
            });
          }
        });
      });
    });
    
    return mockData;
  }

  /**
   * バッチ処理のスケジュール実行（cron想定）
   */
  async scheduleEvaluation(period: string, executeDate: Date): Promise<void> {
    console.log(`[Batch] Scheduled evaluation for ${period} at ${executeDate}`);
    // TODO: 実際のスケジューラー実装
    // node-cron や bullmq などを使用
  }

  /**
   * バッチ処理のステータス確認
   */
  async getProcessStatus(period: string): Promise<{
    status: 'pending' | 'running' | 'completed' | 'failed';
    progress: number;
    message: string;
  }> {
    // TODO: 実際のステータス管理実装
    return {
      status: 'pending',
      progress: 0,
      message: '処理待機中'
    };
  }
}

export const evaluationBatchService = new EvaluationBatchService();