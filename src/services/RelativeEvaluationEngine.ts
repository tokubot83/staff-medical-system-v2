// 相対評価エンジン - 年間3回の評価タイミングで共通利用
// 6月夏季・12月冬季・3月最終評価の全てに対応

export interface EvaluationData {
  staffId: string;
  staffName: string;
  facilityId: string;
  facilityName: string;
  jobCategory: string;
  experienceLevel: string;
  score: number;                    // 評価対象スコア
  rawFacilityScore?: number;        // 施設貢献度生点
  rawCorporateScore?: number;       // 法人貢献度生点
  technicalScore?: number;          // 技術評価スコア
  contributionScore?: number;       // 組織貢献度スコア
}

export interface RelativeEvaluationResult extends EvaluationData {
  // 順位情報
  facilityRank: number;             // 施設内順位
  facilityTotalCount: number;       // 施設内総数
  facilityPercentile: number;       // 施設内パーセンタイル
  
  corporateRank: number;            // 法人内順位  
  corporateTotalCount: number;      // 法人内総数
  corporatePercentile: number;      // 法人内パーセンタイル
  
  // グレード評価
  facilityGrade: 'S' | 'A' | 'B' | 'C' | 'D';    // 施設内5段階評価
  corporateGrade: 'S' | 'A' | 'B' | 'C' | 'D';   // 法人内5段階評価
  finalGrade: 'S+' | 'S' | 'A+' | 'A' | 'B' | 'C' | 'D'; // 2軸マトリックス7段階評価
  
  // 配点情報（組織貢献度評価の場合）
  facilityPoints?: number;          // 施設貢献配点（最大12.5点）
  corporatePoints?: number;         // 法人貢献配点（最大12.5点）
  
  // メタデータ
  evaluationType: 'summer_contribution' | 'winter_contribution' | 'annual_contribution' | 'comprehensive_final';
  evaluatedAt: Date;
  isProvisional: boolean;           // 暫定評価フラグ
}

export interface EvaluationConfig {
  // グルーピング設定
  groupBy: 'facility_all' | 'facility_job' | 'corporate_job';
  
  // 評価タイプ
  evaluationType: 'summer_contribution' | 'winter_contribution' | 'annual_contribution' | 'comprehensive_final';
  
  // 配点設定（組織貢献度の場合）
  maxFacilityPoints?: number;       // 施設貢献最大配点（通常12.5）
  maxCorporatePoints?: number;      // 法人貢献最大配点（通常12.5）
  
  // 暫定評価フラグ
  isProvisional?: boolean;
}

export class RelativeEvaluationEngine {
  
  /**
   * 相対評価メイン処理
   * 6月・12月・3月の全評価タイミングで共通利用
   */
  processRelativeEvaluation(
    evaluationData: EvaluationData[],
    config: EvaluationConfig
  ): RelativeEvaluationResult[] {
    
    const results: RelativeEvaluationResult[] = [];
    
    // 1. グルーピング処理
    const groups = this.createEvaluationGroups(evaluationData, config);
    
    // 2. 各グループで相対評価実行
    for (const [groupKey, groupData] of groups.entries()) {
      const groupResults = this.processGroupEvaluation(groupData, config, groupKey);
      results.push(...groupResults);
    }
    
    // 3. 最終グレード判定（2軸マトリックス）
    const finalResults = this.calculateFinalGrades(results, config);
    
    return finalResults;
  }
  
  /**
   * グルーピング処理
   */
  private createEvaluationGroups(
    data: EvaluationData[],
    config: EvaluationConfig
  ): Map<string, EvaluationData[]> {
    
    const groups = new Map<string, EvaluationData[]>();
    
    for (const item of data) {
      let groupKey: string;
      
      switch (config.groupBy) {
        case 'facility_all':
          // 施設内全職員（組織貢献度評価用）
          groupKey = `facility_${item.facilityId}`;
          break;
          
        case 'facility_job':
          // 施設内同職種（技術評価・総合評価用）
          groupKey = `facility_${item.facilityId}_job_${item.jobCategory}`;
          break;
          
        case 'corporate_job':
          // 法人内同職種（総合評価用）
          groupKey = `corporate_job_${item.jobCategory}`;
          break;
          
        default:
          throw new Error(`Invalid groupBy: ${config.groupBy}`);
      }
      
      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }
      groups.get(groupKey)!.push(item);
    }
    
    return groups;
  }
  
  /**
   * グループ内相対評価処理
   */
  private processGroupEvaluation(
    groupData: EvaluationData[],
    config: EvaluationConfig,
    groupKey: string
  ): RelativeEvaluationResult[] {
    
    // スコア降順でソート
    const sortedData = [...groupData].sort((a, b) => b.score - a.score);
    const totalCount = sortedData.length;
    
    return sortedData.map((item, index) => {
      const rank = index + 1;
      const percentile = (rank / totalCount) * 100;
      const grade = this.percentileToGrade(percentile);
      
      // 組織貢献度評価の場合の配点計算
      let facilityPoints: number | undefined;
      let corporatePoints: number | undefined;
      
      if (config.evaluationType.includes('contribution')) {
        if (item.rawFacilityScore !== undefined && config.maxFacilityPoints) {
          // 施設貢献度の相対評価配点
          const facilityPercentile = this.calculateSpecificPercentile(
            groupData, item.rawFacilityScore, 'rawFacilityScore'
          );
          facilityPoints = this.percentileToPoints(facilityPercentile, config.maxFacilityPoints);
        }
        
        if (item.rawCorporateScore !== undefined && config.maxCorporatePoints) {
          // 法人貢献度の相対評価配点
          const corporatePercentile = this.calculateSpecificPercentile(
            groupData, item.rawCorporateScore, 'rawCorporateScore'
          );
          corporatePoints = this.percentileToPoints(corporatePercentile, config.maxCorporatePoints);
        }
      }
      
      return {
        ...item,
        facilityRank: rank,
        facilityTotalCount: totalCount,
        facilityPercentile: percentile,
        corporateRank: rank, // 後でcorporateグループ処理で更新
        corporateTotalCount: totalCount,
        corporatePercentile: percentile,
        facilityGrade: grade,
        corporateGrade: grade,
        finalGrade: 'B', // 後で2軸マトリックスで更新
        facilityPoints,
        corporatePoints,
        evaluationType: config.evaluationType,
        evaluatedAt: new Date(),
        isProvisional: config.isProvisional || false
      } as RelativeEvaluationResult;
    });
  }
  
  /**
   * パーセンタイル → 5段階グレード変換
   */
  private percentileToGrade(percentile: number): 'S' | 'A' | 'B' | 'C' | 'D' {
    if (percentile <= 10) return 'S';  // 上位10%
    if (percentile <= 30) return 'A';  // 上位30%
    if (percentile <= 70) return 'B';  // 中位70%
    if (percentile <= 90) return 'C';  // 下位90%
    return 'D';  // 下位10%
  }
  
  /**
   * パーセンタイル → 配点変換（組織貢献度用）
   * ContributionEvaluationV2.tsxと同じロジック
   */
  private percentileToPoints(percentile: number, maxPoints: number): number {
    const ratio = maxPoints / 12.5; // 12.5点満点を基準とした比率
    
    if (percentile <= 10) return 12.5 * ratio;  // 上位10%
    if (percentile <= 20) return 11.25 * ratio; // 上位20%
    if (percentile <= 30) return 10.0 * ratio;  // 上位30%
    if (percentile <= 40) return 8.75 * ratio;  // 上位40%
    if (percentile <= 50) return 7.5 * ratio;   // 上位50%
    if (percentile <= 60) return 6.25 * ratio;  // 上位60%
    if (percentile <= 70) return 5.0 * ratio;   // 上位70%
    if (percentile <= 80) return 3.75 * ratio;  // 上位80%
    if (percentile <= 90) return 2.5 * ratio;   // 上位90%
    return 0;  // 下位10%
  }
  
  /**
   * 特定スコアのパーセンタイル計算
   */
  private calculateSpecificPercentile(
    groupData: EvaluationData[],
    targetScore: number,
    scoreField: keyof EvaluationData
  ): number {
    const scores = groupData
      .map(item => item[scoreField] as number)
      .filter(score => score !== undefined)
      .sort((a, b) => b - a);
    
    const rank = scores.findIndex(score => score <= targetScore) + 1;
    return (rank / scores.length) * 100;
  }
  
  /**
   * 2軸マトリックス評価による最終グレード決定
   */
  private calculateFinalGrades(
    results: RelativeEvaluationResult[],
    config: EvaluationConfig
  ): RelativeEvaluationResult[] {
    
    // 2軸評価マトリックス（IntegratedJudgment.tsxと同じ）
    const evaluationMatrix: Record<string, Record<string, string>> = {
      'S': { 'S': 'S+', 'A': 'S', 'B': 'A+', 'C': 'A', 'D': 'A' },
      'A': { 'S': 'S', 'A': 'A+', 'B': 'A', 'C': 'A', 'D': 'B' },
      'B': { 'S': 'A+', 'A': 'A', 'B': 'B', 'C': 'B', 'D': 'C' },
      'C': { 'S': 'A', 'A': 'B', 'B': 'B', 'C': 'C', 'D': 'C' },
      'D': { 'S': 'B', 'A': 'B', 'B': 'C', 'C': 'C', 'D': 'D' }
    };
    
    return results.map(result => ({
      ...result,
      finalGrade: evaluationMatrix[result.facilityGrade][result.corporateGrade] as any
    }));
  }
  
  /**
   * 6月夏季組織貢献度評価専用メソッド
   */
  processSummerContribution(
    assessmentData: Array<{
      staffId: string;
      staffName: string;
      facilityId: string;
      facilityName: string;
      jobCategory: string;
      rawFacilityScore: number;
      rawCorporateScore: number;
    }>
  ): RelativeEvaluationResult[] {
    
    const evaluationData: EvaluationData[] = assessmentData.map(item => ({
      ...item,
      experienceLevel: '',
      score: item.rawFacilityScore + item.rawCorporateScore,
      rawFacilityScore: item.rawFacilityScore,
      rawCorporateScore: item.rawCorporateScore
    }));
    
    return this.processRelativeEvaluation(evaluationData, {
      groupBy: 'facility_all',
      evaluationType: 'summer_contribution',
      maxFacilityPoints: 12.5,
      maxCorporatePoints: 12.5,
      isProvisional: true
    });
  }
  
  /**
   * 12月冬季組織貢献度評価専用メソッド
   */
  processWinterContribution(
    summerResults: RelativeEvaluationResult[],
    winterAssessmentData: Array<{
      staffId: string;
      rawFacilityScore: number;
      rawCorporateScore: number;
    }>
  ): RelativeEvaluationResult[] {
    
    // 夏季結果と冬季データを統合
    const combinedData: EvaluationData[] = summerResults.map(summer => {
      const winter = winterAssessmentData.find(w => w.staffId === summer.staffId);
      const annualFacilityScore = (summer.facilityPoints || 0) + (winter ? this.percentileToPoints(
        this.calculateWinterPercentile(winterAssessmentData, winter.rawFacilityScore, 'rawFacilityScore'),
        12.5
      ) : 0);
      
      return {
        ...summer,
        score: annualFacilityScore + (summer.corporatePoints || 0),
        contributionScore: annualFacilityScore
      };
    });
    
    return this.processRelativeEvaluation(combinedData, {
      groupBy: 'facility_job',
      evaluationType: 'annual_contribution',
      isProvisional: true
    });
  }
  
  /**
   * 3月最終総合評価専用メソッド
   */
  processFinalComprehensive(
    contributionResults: RelativeEvaluationResult[],
    technicalScores: Array<{
      staffId: string;
      technicalScore: number;
    }>
  ): RelativeEvaluationResult[] {
    
    const comprehensiveData: EvaluationData[] = contributionResults.map(contribution => {
      const technical = technicalScores.find(t => t.staffId === contribution.staffId);
      const totalScore = (contribution.contributionScore || 0) + (technical?.technicalScore || 0);
      
      return {
        ...contribution,
        score: totalScore,
        technicalScore: technical?.technicalScore,
        contributionScore: contribution.contributionScore
      };
    });
    
    return this.processRelativeEvaluation(comprehensiveData, {
      groupBy: 'facility_job',
      evaluationType: 'comprehensive_final',
      isProvisional: false
    });
  }
  
  private calculateWinterPercentile(
    winterData: Array<{ rawFacilityScore: number }>,
    targetScore: number,
    field: string
  ): number {
    const scores = winterData.map(item => item.rawFacilityScore).sort((a, b) => b - a);
    const rank = scores.findIndex(score => score <= targetScore) + 1;
    return (rank / scores.length) * 100;
  }
}

// デフォルトエクスポート
export default RelativeEvaluationEngine;