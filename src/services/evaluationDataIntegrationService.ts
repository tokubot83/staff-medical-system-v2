/**
 * 評価データ統合サービス
 * 個人評価管理と最終判定ページ間のデータ連携を管理
 */

export interface CompletedStaffEvaluation {
  staffId: string;
  staffName: string;
  facilityId: string;
  facilityName: string;
  jobCategory: string;
  experienceLevel: string;
  department: string;
  
  // 評価スコア
  technicalScore: number;        // 技術評価50点満点
  contributionScore: number;     // 組織貢献50点満点
  totalScore: number;           // 合計100点満点
  
  // 評価詳細
  technicalBreakdown: {
    coreItems: number;          // 法人統一項目30点
    facilityItems: number;      // 施設特化項目20点
  };
  contributionBreakdown: {
    facilityContribution: number;  // 施設貢献25点
    corporateContribution: number; // 法人貢献25点
  };
  
  // メタデータ
  completedDate: Date;
  evaluatorId: string;
  evaluatorName: string;
  status: 'completed' | 'disclosed' | 'appealed';
  canProcessRelativeGrading: boolean;
  
  // 相対評価結果（判定後に追加）
  facilityRank?: number;
  corporateRank?: number;
  facilityGrade?: 'S' | 'A' | 'B' | 'C' | 'D';
  corporateGrade?: 'S' | 'A' | 'B' | 'C' | 'D';
  finalGrade?: 'S+' | 'S' | 'A+' | 'A' | 'B' | 'C' | 'D';
  gradingDate?: Date;
}

export interface FacilityCompletionStatus {
  facilityId: string;
  facilityName: string;
  totalStaff: number;
  
  // 技術評価進捗
  technicalCompleted: number;
  technicalInProgress: number;
  technicalNotStarted: number;
  
  // 相対評価進捗
  provisionalGraded: number;
  finalGraded: number;
  
  // 完了率
  technicalCompletionRate: number;
  gradingCompletionRate: number;
  
  // 最新更新
  lastUpdated: Date;
  
  // 完了者リスト
  completedStaff: CompletedStaffEvaluation[];
}

export interface EvaluationIntegrationStats {
  totalStaff: number;
  technicalCompleted: number;
  provisionalGraded: number;
  finalGraded: number;
  
  facilities: FacilityCompletionStatus[];
  
  // 職種別統計
  jobCategoryStats: {
    [category: string]: {
      total: number;
      completed: number;
      graded: number;
    };
  };
  
  lastSync: Date;
}

export class EvaluationDataIntegrationService {
  
  /**
   * 技術評価完了者データを取得
   */
  static async getCompletedTechnicalEvaluations(): Promise<CompletedStaffEvaluation[]> {
    try {
      // 実際の実装では個人評価管理のデータベースから取得
      // 現在はローカルストレージとモックデータを使用
      
      const storedData = localStorage.getItem('evaluation_completion_data');
      if (storedData) {
        return JSON.parse(storedData);
      }
      
      // モックデータ生成
      return this.generateMockCompletedEvaluations();
      
    } catch (error) {
      console.error('技術評価完了者データ取得エラー:', error);
      return [];
    }
  }
  
  /**
   * 施設別完了状況を取得
   */
  static async getFacilityCompletionStatus(facilityId?: string): Promise<FacilityCompletionStatus[]> {
    try {
      const completedEvaluations = await this.getCompletedTechnicalEvaluations();
      
      const facilities = [
        { id: 'kohara', name: '小原病院', totalStaff: 120 },
        { id: 'tategami', name: '立神リハビリテーション温泉病院', totalStaff: 180 },
        { id: 'espoir', name: 'エスポワール立神', totalStaff: 150 },
        { id: 'hojuan', name: '宝寿庵', totalStaff: 50 }
      ];
      
      const facilityStatuses: FacilityCompletionStatus[] = facilities.map(facility => {
        const facilityStaff = completedEvaluations.filter(staff => staff.facilityId === facility.id);
        const technicalCompleted = facilityStaff.filter(staff => staff.status === 'completed').length;
        const provisionalGraded = facilityStaff.filter(staff => staff.facilityGrade).length;
        const finalGraded = facilityStaff.filter(staff => staff.finalGrade && staff.gradingDate).length;
        
        return {
          facilityId: facility.id,
          facilityName: facility.name,
          totalStaff: facility.totalStaff,
          technicalCompleted,
          technicalInProgress: Math.floor(facility.totalStaff * 0.2), // モック値
          technicalNotStarted: facility.totalStaff - technicalCompleted - Math.floor(facility.totalStaff * 0.2),
          provisionalGraded,
          finalGraded,
          technicalCompletionRate: (technicalCompleted / facility.totalStaff) * 100,
          gradingCompletionRate: (provisionalGraded / facility.totalStaff) * 100,
          lastUpdated: new Date(),
          completedStaff: facilityStaff
        };
      });
      
      return facilityId ? facilityStatuses.filter(f => f.facilityId === facilityId) : facilityStatuses;
      
    } catch (error) {
      console.error('施設別完了状況取得エラー:', error);
      return [];
    }
  }
  
  /**
   * 統合統計データを取得
   */
  static async getIntegrationStats(): Promise<EvaluationIntegrationStats> {
    try {
      const facilities = await this.getFacilityCompletionStatus();
      const completedEvaluations = await this.getCompletedTechnicalEvaluations();
      
      const totalStaff = facilities.reduce((sum, f) => sum + f.totalStaff, 0);
      const technicalCompleted = facilities.reduce((sum, f) => sum + f.technicalCompleted, 0);
      const provisionalGraded = facilities.reduce((sum, f) => sum + f.provisionalGraded, 0);
      const finalGraded = facilities.reduce((sum, f) => sum + f.finalGraded, 0);
      
      // 職種別統計
      const jobCategoryStats: { [category: string]: { total: number; completed: number; graded: number; } } = {};
      
      completedEvaluations.forEach(staff => {
        if (!jobCategoryStats[staff.jobCategory]) {
          jobCategoryStats[staff.jobCategory] = { total: 0, completed: 0, graded: 0 };
        }
        jobCategoryStats[staff.jobCategory].total++;
        if (staff.status === 'completed') {
          jobCategoryStats[staff.jobCategory].completed++;
        }
        if (staff.facilityGrade) {
          jobCategoryStats[staff.jobCategory].graded++;
        }
      });
      
      return {
        totalStaff,
        technicalCompleted,
        provisionalGraded,
        finalGraded,
        facilities,
        jobCategoryStats,
        lastSync: new Date()
      };
      
    } catch (error) {
      console.error('統合統計データ取得エラー:', error);
      throw error;
    }
  }
  
  /**
   * 評価完了データを更新
   */
  static async updateCompletionStatus(
    staffId: string, 
    evaluationData: Partial<CompletedStaffEvaluation>
  ): Promise<void> {
    try {
      const currentData = await this.getCompletedTechnicalEvaluations();
      const existingIndex = currentData.findIndex(staff => staff.staffId === staffId);
      
      if (existingIndex >= 0) {
        // 既存データを更新
        currentData[existingIndex] = { ...currentData[existingIndex], ...evaluationData };
      } else {
        // 新規データを追加
        if (evaluationData.staffId && evaluationData.staffName) {
          currentData.push(evaluationData as CompletedStaffEvaluation);
        }
      }
      
      // ローカルストレージに保存（実際の実装ではAPIを使用）
      localStorage.setItem('evaluation_completion_data', JSON.stringify(currentData));
      
      console.log(`職員 ${staffId} の評価データを更新しました`);
      
    } catch (error) {
      console.error('評価完了データ更新エラー:', error);
      throw error;
    }
  }
  
  /**
   * 相対評価結果を保存
   */
  static async saveRelativeGradingResults(results: CompletedStaffEvaluation[]): Promise<void> {
    try {
      for (const result of results) {
        await this.updateCompletionStatus(result.staffId, {
          facilityRank: result.facilityRank,
          corporateRank: result.corporateRank,
          facilityGrade: result.facilityGrade,
          corporateGrade: result.corporateGrade,
          finalGrade: result.finalGrade,
          gradingDate: new Date()
        });
      }
      
      console.log(`${results.length}名の相対評価結果を保存しました`);
      
    } catch (error) {
      console.error('相対評価結果保存エラー:', error);
      throw error;
    }
  }
  
  /**
   * 施設の評価完了者のみを取得
   */
  static async getCompletedStaffByFacility(facilityId: string): Promise<CompletedStaffEvaluation[]> {
    try {
      const allCompleted = await this.getCompletedTechnicalEvaluations();
      return allCompleted.filter(staff => 
        staff.facilityId === facilityId && 
        staff.status === 'completed' &&
        staff.canProcessRelativeGrading
      );
    } catch (error) {
      console.error('施設別完了者取得エラー:', error);
      return [];
    }
  }
  
  /**
   * モックデータ生成（開発用）
   */
  private static generateMockCompletedEvaluations(): CompletedStaffEvaluation[] {
    const facilities = [
      { id: 'kohara', name: '小原病院' },
      { id: 'tategami', name: '立神リハビリテーション温泉病院' },
      { id: 'espoir', name: 'エスポワール立神' },
      { id: 'hojuan', name: '宝寿庵' }
    ];
    
    const jobCategories = ['nurse', 'assistant-nurse', 'nursing-aide', 'care-worker'];
    const experienceLevels = ['new', 'young', 'midlevel', 'veteran', 'ward-chief'];
    
    const mockData: CompletedStaffEvaluation[] = [];
    
    facilities.forEach((facility, facilityIndex) => {
      const staffCount = facilityIndex === 3 ? 10 : 25; // 宝寿庵は少なめ
      
      for (let i = 0; i < staffCount; i++) {
        const technicalScore = 35 + Math.random() * 15; // 35-50点
        const contributionScore = 35 + Math.random() * 15; // 35-50点
        const totalScore = technicalScore + contributionScore;
        
        mockData.push({
          staffId: `${facility.id}_staff_${i + 1}`,
          staffName: `${facility.name.slice(0, 2)}職員${i + 1}`,
          facilityId: facility.id,
          facilityName: facility.name,
          jobCategory: jobCategories[Math.floor(Math.random() * jobCategories.length)],
          experienceLevel: experienceLevels[Math.floor(Math.random() * experienceLevels.length)],
          department: `${Math.floor(Math.random() * 3) + 1}階病棟`,
          technicalScore: Math.round(technicalScore),
          contributionScore: Math.round(contributionScore),
          totalScore: Math.round(totalScore),
          technicalBreakdown: {
            coreItems: Math.round(technicalScore * 0.6),
            facilityItems: Math.round(technicalScore * 0.4)
          },
          contributionBreakdown: {
            facilityContribution: Math.round(contributionScore * 0.5),
            corporateContribution: Math.round(contributionScore * 0.5)
          },
          completedDate: new Date(2025, 2, Math.floor(Math.random() * 20) + 1),
          evaluatorId: `evaluator_${facilityIndex + 1}`,
          evaluatorName: `${facility.name}評価者`,
          status: 'completed',
          canProcessRelativeGrading: true
        });
      }
    });
    
    // ローカルストレージに保存
    localStorage.setItem('evaluation_completion_data', JSON.stringify(mockData));
    
    return mockData;
  }
  
  /**
   * データの整合性チェック
   */
  static async validateDataIntegrity(): Promise<{ isValid: boolean; errors: string[] }> {
    try {
      const data = await this.getCompletedTechnicalEvaluations();
      const errors: string[] = [];
      
      data.forEach(staff => {
        if (staff.technicalScore + staff.contributionScore !== staff.totalScore) {
          errors.push(`${staff.staffName}: スコア合計が一致しません`);
        }
        
        if (staff.totalScore > 100 || staff.totalScore < 0) {
          errors.push(`${staff.staffName}: 総合スコアが範囲外です`);
        }
      });
      
      return {
        isValid: errors.length === 0,
        errors
      };
      
    } catch (error) {
      return {
        isValid: false,
        errors: ['データ整合性チェック中にエラーが発生しました']
      };
    }
  }
}