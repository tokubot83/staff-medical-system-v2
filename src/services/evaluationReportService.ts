import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export interface ReportData {
  staffId: string;
  staffName: string;
  facility: string;
  department: string;
  jobCategory: string;
  year: number;
  technical: {
    score: number;
    details: any[];
  };
  facilityContribution: {
    summer: number;
    winter: number;
    yearTotal: number;
    finalScore: number;
  };
  corporateContribution: {
    summer: number;
    winter: number;
    yearTotal: number;
    finalScore: number;
  };
  totalScore: number;
  facilityGrade: string;
  corporateGrade: string;
  finalGrade: string;
  rankings: {
    facility: { rank: number; total: number; percentile: number; };
    corporate: { rank: number; total: number; percentile: number; };
  };
  comments: string;
}

export class EvaluationReportService {
  /**
   * Generate individual evaluation report in PDF format
   */
  async generateIndividualPDF(data: ReportData): Promise<Blob> {
    // Note: In production, use a proper PDF library with Japanese font support
    // For now, returning a mock blob
    const mockPdfContent = `
Evaluation Report - ${data.year}
=====================================
Staff: ${data.staffName} (${data.staffId})
Facility: ${data.facility}
Department: ${data.department}
Job Category: ${data.jobCategory}

Technical Score: ${data.technical.score}/50
Facility Contribution: ${data.facilityContribution.finalScore}/25
Corporate Contribution: ${data.corporateContribution.finalScore}/25
Total Score: ${data.totalScore}/100

Final Grade: ${data.finalGrade}
Facility Grade: ${data.facilityGrade}
Corporate Grade: ${data.corporateGrade}

Rankings:
- Facility: ${data.rankings.facility.rank}/${data.rankings.facility.total} (Top ${data.rankings.facility.percentile}%)
- Corporate: ${data.rankings.corporate.rank}/${data.rankings.corporate.total} (Top ${data.rankings.corporate.percentile}%)

Comments:
${data.comments}
    `;
    
    return new Blob([mockPdfContent], { type: 'application/pdf' });
  }

  /**
   * Generate individual evaluation report in Excel format
   */
  async generateIndividualExcel(data: ReportData): Promise<Blob> {
    const workbook = XLSX.utils.book_new();
    
    // Summary sheet
    const summaryData = [
      ['評価レポート', `${data.year}年度`],
      [],
      ['職員情報'],
      ['職員ID', data.staffId],
      ['氏名', data.staffName],
      ['施設', data.facility],
      ['部門', data.department],
      ['職種', data.jobCategory],
      [],
      ['評価スコア'],
      ['技術評価', `${data.technical.score}/50`],
      ['施設貢献度', `${data.facilityContribution.finalScore}/25`],
      ['法人貢献度', `${data.corporateContribution.finalScore}/25`],
      ['総合スコア', `${data.totalScore}/100`],
      [],
      ['評価グレード'],
      ['最終グレード', data.finalGrade],
      ['施設内評価', data.facilityGrade],
      ['法人内評価', data.corporateGrade],
      [],
      ['順位情報'],
      ['施設内順位', `${data.rankings.facility.rank}/${data.rankings.facility.total}`],
      ['施設内パーセンタイル', `上位${data.rankings.facility.percentile}%`],
      ['法人内順位', `${data.rankings.corporate.rank}/${data.rankings.corporate.total}`],
      ['法人内パーセンタイル', `上位${data.rankings.corporate.percentile}%`]
    ];
    
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'サマリー');
    
    // Contribution details sheet
    const contributionData = [
      ['組織貢献度詳細'],
      [],
      ['期間', '施設貢献', '法人貢献'],
      ['8月賞与時', data.facilityContribution.summer, data.corporateContribution.summer],
      ['12月賞与時', data.facilityContribution.winter, data.corporateContribution.winter],
      ['年間合計', data.facilityContribution.yearTotal, data.corporateContribution.yearTotal],
      ['相対評価配点', data.facilityContribution.finalScore, data.corporateContribution.finalScore]
    ];
    
    const contributionSheet = XLSX.utils.aoa_to_sheet(contributionData);
    XLSX.utils.book_append_sheet(workbook, contributionSheet, '組織貢献度');
    
    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }

  /**
   * Generate department summary report
   */
  async generateDepartmentReport(
    department: string,
    year: number,
    staffData: ReportData[],
    format: 'pdf' | 'excel'
  ): Promise<Blob> {
    if (format === 'excel') {
      const workbook = XLSX.utils.book_new();
      
      // Summary statistics
      const totalStaff = staffData.length;
      const avgScore = staffData.reduce((sum, d) => sum + d.totalScore, 0) / totalStaff;
      const gradeDistribution = this.calculateGradeDistribution(staffData);
      
      const summaryData = [
        [`${department} - ${year}年度評価レポート`],
        [],
        ['統計情報'],
        ['評価対象者数', totalStaff],
        ['平均スコア', avgScore.toFixed(1)],
        [],
        ['グレード分布'],
        ...Object.entries(gradeDistribution).map(([grade, count]) => [grade, count])
      ];
      
      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'サマリー');
      
      // Staff list
      const staffListData = [
        ['職員ID', '氏名', '技術評価', '施設貢献', '法人貢献', '総合スコア', '最終グレード'],
        ...staffData.map(d => [
          d.staffId,
          d.staffName,
          d.technical.score,
          d.facilityContribution.finalScore,
          d.corporateContribution.finalScore,
          d.totalScore,
          d.finalGrade
        ])
      ];
      
      const staffSheet = XLSX.utils.aoa_to_sheet(staffListData);
      XLSX.utils.book_append_sheet(workbook, staffSheet, '職員リスト');
      
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    }
    
    // PDF format (simplified)
    const content = `Department Report: ${department}\nYear: ${year}\nTotal Staff: ${staffData.length}`;
    return new Blob([content], { type: 'application/pdf' });
  }

  /**
   * Generate facility comparison report
   */
  async generateFacilityReport(
    facilities: string[],
    year: number,
    data: Map<string, ReportData[]>,
    format: 'pdf' | 'excel'
  ): Promise<Blob> {
    if (format === 'excel') {
      const workbook = XLSX.utils.book_new();
      
      const comparisonData = [
        ['施設別評価比較', `${year}年度`],
        [],
        ['施設', '評価人数', '平均スコア', 'S評価', 'A評価', 'B評価', 'C評価', 'D評価']
      ];
      
      facilities.forEach(facility => {
        const facilityData = data.get(facility) || [];
        const gradeDistribution = this.calculateGradeDistribution(facilityData);
        const avgScore = facilityData.length > 0
          ? facilityData.reduce((sum, d) => sum + d.totalScore, 0) / facilityData.length
          : 0;
        
        comparisonData.push([
          facility,
          facilityData.length,
          avgScore.toFixed(1),
          gradeDistribution['S'] || 0,
          gradeDistribution['A'] || 0,
          gradeDistribution['B'] || 0,
          gradeDistribution['C'] || 0,
          gradeDistribution['D'] || 0
        ]);
      });
      
      const comparisonSheet = XLSX.utils.aoa_to_sheet(comparisonData);
      XLSX.utils.book_append_sheet(workbook, comparisonSheet, '施設比較');
      
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    }
    
    // PDF format (simplified)
    const content = `Facility Comparison Report\nYear: ${year}\nFacilities: ${facilities.join(', ')}`;
    return new Blob([content], { type: 'application/pdf' });
  }

  /**
   * Generate executive summary report
   */
  async generateExecutiveSummary(
    year: number,
    allData: ReportData[],
    format: 'pdf' | 'excel'
  ): Promise<Blob> {
    const totalStaff = allData.length;
    const avgScore = allData.reduce((sum, d) => sum + d.totalScore, 0) / totalStaff;
    const topPerformers = allData
      .filter(d => d.finalGrade === 'S+' || d.finalGrade === 'S')
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 10);
    
    if (format === 'excel') {
      const workbook = XLSX.utils.book_new();
      
      // Executive summary
      const summaryData = [
        [`${year}年度 評価サマリーレポート`],
        [],
        ['全体統計'],
        ['総評価対象者', totalStaff],
        ['平均スコア', avgScore.toFixed(1)],
        [],
        ['トップパフォーマー'],
        ['順位', '職員ID', '氏名', '施設', '総合スコア', 'グレード'],
        ...topPerformers.map((d, i) => [
          i + 1,
          d.staffId,
          d.staffName,
          d.facility,
          d.totalScore,
          d.finalGrade
        ])
      ];
      
      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'エグゼクティブサマリー');
      
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    }
    
    // PDF format (simplified)
    const content = `Executive Summary\nYear: ${year}\nTotal Staff: ${totalStaff}\nAverage Score: ${avgScore.toFixed(1)}`;
    return new Blob([content], { type: 'application/pdf' });
  }

  /**
   * Download report file
   */
  downloadReport(blob: Blob, filename: string): void {
    saveAs(blob, filename);
  }

  /**
   * Calculate grade distribution
   */
  private calculateGradeDistribution(data: ReportData[]): Record<string, number> {
    const distribution: Record<string, number> = {
      'S+': 0,
      'S': 0,
      'A+': 0,
      'A': 0,
      'B': 0,
      'C': 0,
      'D': 0
    };
    
    data.forEach(d => {
      const grade = d.finalGrade;
      if (grade in distribution) {
        distribution[grade]++;
      }
    });
    
    return distribution;
  }

  /**
   * Generate batch reports for multiple staff
   */
  async generateBatchReports(
    staffIds: string[],
    year: number,
    format: 'pdf' | 'excel'
  ): Promise<Map<string, Blob>> {
    const reports = new Map<string, Blob>();
    
    for (const staffId of staffIds) {
      // Fetch staff data (mock for now)
      const staffData = await this.fetchStaffEvaluationData(staffId, year);
      
      if (staffData) {
        const blob = format === 'pdf'
          ? await this.generateIndividualPDF(staffData)
          : await this.generateIndividualExcel(staffData);
        
        reports.set(staffId, blob);
      }
    }
    
    return reports;
  }

  /**
   * Fetch staff evaluation data (mock implementation)
   */
  private async fetchStaffEvaluationData(
    staffId: string,
    year: number
  ): Promise<ReportData | null> {
    // In production, this would fetch from the database
    return {
      staffId,
      staffName: `職員${staffId}`,
      facility: '急性期病院',
      department: '看護部',
      jobCategory: '看護職',
      year,
      technical: {
        score: 42.5,
        details: []
      },
      facilityContribution: {
        summer: 35,
        winter: 30,
        yearTotal: 65,
        finalScore: 18.5
      },
      corporateContribution: {
        summer: 25,
        winter: 20,
        yearTotal: 45,
        finalScore: 15.2
      },
      totalScore: 76.2,
      facilityGrade: 'A',
      corporateGrade: 'B',
      finalGrade: 'A',
      rankings: {
        facility: { rank: 15, total: 120, percentile: 12.5 },
        corporate: { rank: 85, total: 480, percentile: 17.7 }
      },
      comments: '年間を通じて安定した成果を発揮しました。'
    };
  }
}