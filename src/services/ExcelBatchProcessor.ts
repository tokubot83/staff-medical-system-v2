// Excel一括処理サービス
// 施設別査定表データの取込・相対評価・結果出力

import { RelativeEvaluationEngine, type RelativeEvaluationResult } from './RelativeEvaluationEngine';

export interface AssessmentExcelData {
  staffId: string;
  staffName: string;
  facilityId: string;
  facilityName: string;
  jobCategory: string;
  department: string;
  experienceLevel: string;
  
  // 施設貢献度査定項目（施設により項目・配点が異なる）
  facilityContributionItems: {
    [itemName: string]: number;  // 項目名と点数のペア
  };
  facilityContributionTotal: number;  // 施設貢献度合計（満点は施設により異なる）
  
  // 法人貢献度査定項目（施設により項目・配点が異なる）
  corporateContributionItems: {
    [itemName: string]: number;
  };
  corporateContributionTotal: number;  // 法人貢献度合計（満点は施設により異なる）
  
  // メタデータ
  assessmentDate: string;
  evaluatorName: string;
  evaluatorRole: string;
}

export interface BatchProcessingResult {
  success: boolean;
  processedCount: number;
  errorCount: number;
  results: RelativeEvaluationResult[];
  errors: Array<{
    row: number;
    staffId?: string;
    error: string;
  }>;
  summary: {
    totalStaff: number;
    facilitiesProcessed: string[];
    averageFacilityScore: number;
    averageCorporateScore: number;
    distributionByGrade: {
      [grade: string]: number;
    };
  };
}

export class ExcelBatchProcessor {
  private evaluationEngine: RelativeEvaluationEngine;

  constructor() {
    this.evaluationEngine = new RelativeEvaluationEngine();
  }

  /**
   * Excelファイルからの一括データ処理
   */
  async processAssessmentBatch(
    excelData: AssessmentExcelData[],
    season: 'summer' | 'winter'
  ): Promise<BatchProcessingResult> {
    const errors: Array<{ row: number; staffId?: string; error: string }> = [];
    const validData: AssessmentExcelData[] = [];

    // 1. データ検証
    for (let i = 0; i < excelData.length; i++) {
      const data = excelData[i];
      const validation = this.validateAssessmentData(data, i + 2); // Excel行番号（ヘッダー考慮）
      
      if (validation.isValid) {
        validData.push(data);
      } else {
        errors.push({
          row: i + 2,
          staffId: data.staffId,
          error: validation.error
        });
      }
    }

    if (validData.length === 0) {
      return {
        success: false,
        processedCount: 0,
        errorCount: errors.length,
        results: [],
        errors,
        summary: {
          totalStaff: 0,
          facilitiesProcessed: [],
          averageFacilityScore: 0,
          averageCorporateScore: 0,
          distributionByGrade: {}
        }
      };
    }

    // 2. 相対評価エンジン用データ変換
    const assessmentData = validData.map(data => ({
      staffId: data.staffId,
      staffName: data.staffName,
      facilityId: data.facilityId,
      facilityName: data.facilityName,
      jobCategory: data.jobCategory,
      rawFacilityScore: data.facilityContributionTotal,
      rawCorporateScore: data.corporateContributionTotal
    }));

    // 3. 相対評価処理実行
    let results: RelativeEvaluationResult[];
    try {
      if (season === 'summer') {
        results = this.evaluationEngine.processSummerContribution(assessmentData);
      } else {
        // 冬季評価の場合は夏季結果も必要（実装予定）
        throw new Error('冬季評価処理は実装予定です');
      }
    } catch (error) {
      return {
        success: false,
        processedCount: 0,
        errorCount: errors.length + 1,
        results: [],
        errors: [
          ...errors,
          {
            row: 0,
            error: `相対評価処理エラー: ${error instanceof Error ? error.message : 'Unknown error'}`
          }
        ],
        summary: {
          totalStaff: 0,
          facilitiesProcessed: [],
          averageFacilityScore: 0,
          averageCorporateScore: 0,
          distributionByGrade: {}
        }
      };
    }

    // 4. 処理結果の集計
    const summary = this.generateProcessingSummary(results, validData);

    return {
      success: true,
      processedCount: results.length,
      errorCount: errors.length,
      results,
      errors,
      summary
    };
  }

  /**
   * データ検証
   */
  private validateAssessmentData(
    data: AssessmentExcelData,
    row: number
  ): { isValid: boolean; error: string } {
    // 必須フィールドチェック
    if (!data.staffId?.trim()) {
      return { isValid: false, error: '職員IDが未入力です' };
    }
    
    if (!data.staffName?.trim()) {
      return { isValid: false, error: '職員名が未入力です' };
    }
    
    if (!data.facilityId?.trim()) {
      return { isValid: false, error: '施設IDが未入力です' };
    }
    
    if (!data.jobCategory?.trim()) {
      return { isValid: false, error: '職種が未入力です' };
    }

    // スコア検証
    if (typeof data.facilityContributionTotal !== 'number' || data.facilityContributionTotal < 0) {
      return { isValid: false, error: '施設貢献度スコアが不正です' };
    }
    
    if (typeof data.corporateContributionTotal !== 'number' || data.corporateContributionTotal < 0) {
      return { isValid: false, error: '法人貢献度スコアが不正です' };
    }

    // 施設貢献度の上限チェック（施設により異なるが、一般的な範囲で検証）
    if (data.facilityContributionTotal > 200) {
      return { isValid: false, error: '施設貢献度スコアが異常に高い値です（200点超）' };
    }
    
    if (data.corporateContributionTotal > 200) {
      return { isValid: false, error: '法人貢献度スコアが異常に高い値です（200点超）' };
    }

    return { isValid: true, error: '' };
  }

  /**
   * 処理結果サマリー生成
   */
  private generateProcessingSummary(
    results: RelativeEvaluationResult[],
    originalData: AssessmentExcelData[]
  ) {
    const facilities = [...new Set(results.map(r => r.facilityName))];
    const totalFacilityScore = results.reduce((sum, r) => sum + (r.facilityPoints || 0), 0);
    const totalCorporateScore = results.reduce((sum, r) => sum + (r.corporatePoints || 0), 0);
    
    // グレード別分布
    const distributionByGrade: { [grade: string]: number } = {};
    for (const result of results) {
      const grade = result.finalGrade;
      distributionByGrade[grade] = (distributionByGrade[grade] || 0) + 1;
    }

    return {
      totalStaff: results.length,
      facilitiesProcessed: facilities,
      averageFacilityScore: totalFacilityScore / results.length,
      averageCorporateScore: totalCorporateScore / results.length,
      distributionByGrade
    };
  }

  /**
   * 結果をExcel出力用データに変換
   */
  generateExportData(results: RelativeEvaluationResult[]): any[] {
    return results.map(result => ({
      '職員ID': result.staffId,
      '職員名': result.staffName,
      '施設名': result.facilityName,
      '職種': result.jobCategory,
      '施設貢献度配点': result.facilityPoints?.toFixed(1) || '0.0',
      '法人貢献度配点': result.corporatePoints?.toFixed(1) || '0.0',
      '合計配点': ((result.facilityPoints || 0) + (result.corporatePoints || 0)).toFixed(1),
      '施設内順位': result.facilityRank,
      '施設内パーセンタイル': result.facilityPercentile.toFixed(1) + '%',
      '施設内グレード': result.facilityGrade,
      '法人内順位': result.corporateRank,
      '法人内パーセンタイル': result.corporatePercentile.toFixed(1) + '%',
      '法人内グレード': result.corporateGrade,
      '総合グレード': result.finalGrade,
      '評価日時': result.evaluatedAt.toLocaleDateString('ja-JP'),
      '評価タイプ': result.evaluationType,
      '暫定評価': result.isProvisional ? 'はい' : 'いいえ'
    }));
  }

  /**
   * Excelファイル解析（実装予定）
   */
  async parseExcelFile(file: File): Promise<AssessmentExcelData[]> {
    // 実装予定: ExcelJSやSheetJSを使用してExcelファイルを解析
    throw new Error('Excel解析機能は実装予定です');
  }

  /**
   * Excel出力（実装予定）
   */
  async exportToExcel(
    results: RelativeEvaluationResult[],
    filename?: string
  ): Promise<Blob> {
    // 実装予定: ExcelJSを使用してExcelファイルを生成
    throw new Error('Excel出力機能は実装予定です');
  }

  /**
   * CSV出力
   */
  exportToCSV(results: RelativeEvaluationResult[], filename?: string): string {
    const exportData = this.generateExportData(results);
    if (exportData.length === 0) return '';

    const headers = Object.keys(exportData[0]);
    const csvRows = [
      headers.join(','),
      ...exportData.map(row => 
        headers.map(header => {
          const value = row[header];
          // CSV用エスケープ処理
          if (typeof value === 'string' && (value.includes(',') || value.includes('\n') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ];

    return csvRows.join('\n');
  }
}

export default ExcelBatchProcessor;