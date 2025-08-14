/**
 * Evaluation Data Service
 * 評価データの管理を統一的に行うサービス
 * LocalStorageからAPIへの移行を容易にする設計
 */

import { StorageFactory } from '@/lib/storage/StorageAdapter';

export interface EvaluationData {
  id: string;
  staffId: string;
  staffName: string;
  evaluationPeriod: string; // 例: "2025-Q1"
  evaluationType: string; // 例: "quarterly", "annual", "special"
  evaluationDate: string;
  status: 'draft' | 'submitted' | 'approved' | 'finalized';
  evaluator: {
    id: string;
    name: string;
    position: string;
  };
  
  // 評価項目
  coreEvaluation?: {
    C01: { superior: number; self: number; } // 専門技術・スキル
    C02: { superior: number; self: number; } // 対人関係・ケア
    C03: { superior: number; self: number; } // 安全・品質管理
  };
  
  // 施設特化評価（20点）
  facilityEvaluation?: {
    score: number;
    items: {
      id: string;
      name: string;
      score: number;
      maxScore: number;
    }[];
  };
  
  // 貢献度評価（50点）
  contributionEvaluation?: {
    facility: number; // 施設貢献度
    corporate: number; // 法人貢献度
    details?: string;
  };
  
  // 総合評価
  totalScore?: number;
  grade?: 'S' | 'A' | 'B' | 'C' | 'D';
  
  // コメント・フィードバック
  comments?: {
    evaluator?: string;
    staff?: string;
    approver?: string;
  };
  
  // 目標設定
  goals?: {
    previous?: {
      id: string;
      description: string;
      achieved: boolean;
      achievement?: string;
    }[];
    next?: {
      id: string;
      description: string;
      deadline?: string;
    }[];
  };
  
  // 研修受講状況
  trainingStatus?: {
    required: string[];
    completed: string[];
    missing: string[];
    completionRate: number;
  };
  
  // 改善提案
  improvements?: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  
  metadata?: {
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string;
    updatedBy?: string;
    approvedBy?: string;
    approvedAt?: Date;
  };
}

export interface EvaluationFilter {
  staffId?: string;
  evaluationType?: string;
  period?: string;
  status?: string;
  evaluator?: string;
  dateFrom?: string;
  dateTo?: string;
  gradeFilter?: string[];
  searchTerm?: string;
}

export interface EvaluationStatistics {
  total: number;
  byStatus: Record<string, number>;
  byGrade: Record<string, number>;
  averageScore: number;
  topPerformers: {
    staffId: string;
    name: string;
    score: number;
  }[];
  needsImprovement: {
    staffId: string;
    name: string;
    score: number;
  }[];
  completionRate: number;
}

class EvaluationDataService {
  private storage = StorageFactory.getAdapter();
  private cacheMap = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = 5 * 60 * 1000; // 5分のキャッシュ

  /**
   * 評価データを取得
   */
  async getEvaluation(evaluationId: string): Promise<EvaluationData | null> {
    const cached = this.getFromCache(`evaluation_${evaluationId}`);
    if (cached) return cached;

    try {
      const response = await this.storage.get<EvaluationData>(`evaluation_${evaluationId}`);
      
      if (response.success && response.data) {
        this.setCache(`evaluation_${evaluationId}`, response.data);
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching evaluation:', error);
      return null;
    }
  }

  /**
   * 全評価データを取得
   */
  async getAllEvaluations(filter?: EvaluationFilter): Promise<EvaluationData[]> {
    try {
      const response = await this.storage.list<EvaluationData>('evaluation_');
      
      if (response.success && response.data) {
        let evaluations = response.data;
        
        if (filter) {
          evaluations = this.applyFilter(evaluations, filter);
        }
        
        // 日付順にソート（新しい順）
        evaluations.sort((a, b) => {
          const dateA = new Date(a.evaluationDate).getTime();
          const dateB = new Date(b.evaluationDate).getTime();
          return dateB - dateA;
        });
        
        return evaluations;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching all evaluations:', error);
      return [];
    }
  }

  /**
   * 職員の評価履歴を取得
   */
  async getStaffEvaluations(staffId: string): Promise<EvaluationData[]> {
    return await this.getAllEvaluations({ staffId });
  }

  /**
   * 最新の評価を取得
   */
  async getLatestEvaluation(staffId: string): Promise<EvaluationData | null> {
    const evaluations = await this.getStaffEvaluations(staffId);
    return evaluations.length > 0 ? evaluations[0] : null;
  }

  /**
   * 評価データを保存
   */
  async saveEvaluation(evaluation: EvaluationData): Promise<boolean> {
    try {
      // IDが無い場合は生成
      if (!evaluation.id) {
        evaluation.id = this.generateEvaluationId();
      }
      
      // 総合スコアの計算
      if (!evaluation.totalScore) {
        evaluation.totalScore = this.calculateTotalScore(evaluation);
      }
      
      // グレードの判定
      if (!evaluation.grade) {
        evaluation.grade = this.determineGrade(evaluation.totalScore);
      }
      
      // メタデータの更新
      evaluation.metadata = {
        createdAt: evaluation.metadata?.createdAt || new Date(),
        ...evaluation.metadata,
        updatedAt: new Date(),
      };
      
      const response = await this.storage.set(`evaluation_${evaluation.id}`, evaluation);
      
      if (response.success) {
        this.invalidateCache(`evaluation_${evaluation.id}`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error saving evaluation:', error);
      return false;
    }
  }

  /**
   * 評価を作成（下書き）
   */
  async createDraftEvaluation(evaluationData: Partial<EvaluationData>): Promise<string | null> {
    try {
      const evaluation: EvaluationData = {
        id: this.generateEvaluationId(),
        staffId: evaluationData.staffId || '',
        staffName: evaluationData.staffName || '',
        evaluationPeriod: evaluationData.evaluationPeriod || '',
        evaluationType: evaluationData.evaluationType || 'quarterly',
        evaluationDate: evaluationData.evaluationDate || new Date().toISOString(),
        status: 'draft',
        evaluator: evaluationData.evaluator || { id: '', name: '', position: '' },
        ...evaluationData,
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: evaluationData.metadata?.createdBy
        }
      };
      
      const success = await this.saveEvaluation(evaluation);
      return success ? evaluation.id : null;
    } catch (error) {
      console.error('Error creating draft evaluation:', error);
      return null;
    }
  }

  /**
   * 評価を提出
   */
  async submitEvaluation(evaluationId: string): Promise<boolean> {
    try {
      const evaluation = await this.getEvaluation(evaluationId);
      if (!evaluation) return false;
      
      evaluation.status = 'submitted';
      evaluation.metadata = {
        createdAt: evaluation.metadata?.createdAt || new Date(),
        ...evaluation.metadata,
        updatedAt: new Date()
      };
      
      return await this.saveEvaluation(evaluation);
    } catch (error) {
      console.error('Error submitting evaluation:', error);
      return false;
    }
  }

  /**
   * 評価を承認
   */
  async approveEvaluation(evaluationId: string, approverId: string): Promise<boolean> {
    try {
      const evaluation = await this.getEvaluation(evaluationId);
      if (!evaluation) return false;
      
      evaluation.status = 'approved';
      evaluation.metadata = {
        createdAt: evaluation.metadata?.createdAt || new Date(),
        ...evaluation.metadata,
        approvedBy: approverId,
        approvedAt: new Date(),
        updatedAt: new Date()
      };
      
      return await this.saveEvaluation(evaluation);
    } catch (error) {
      console.error('Error approving evaluation:', error);
      return false;
    }
  }

  /**
   * 評価を確定
   */
  async finalizeEvaluation(evaluationId: string): Promise<boolean> {
    try {
      const evaluation = await this.getEvaluation(evaluationId);
      if (!evaluation) return false;
      
      evaluation.status = 'finalized';
      evaluation.metadata = {
        createdAt: evaluation.metadata?.createdAt || new Date(),
        ...evaluation.metadata,
        updatedAt: new Date()
      };
      
      return await this.saveEvaluation(evaluation);
    } catch (error) {
      console.error('Error finalizing evaluation:', error);
      return false;
    }
  }

  /**
   * 評価データを削除
   */
  async deleteEvaluation(evaluationId: string): Promise<boolean> {
    try {
      const response = await this.storage.delete(`evaluation_${evaluationId}`);
      
      if (response.success) {
        this.invalidateCache(`evaluation_${evaluationId}`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting evaluation:', error);
      return false;
    }
  }

  /**
   * 評価統計を取得
   */
  async getEvaluationStatistics(filter?: EvaluationFilter): Promise<EvaluationStatistics> {
    try {
      const evaluations = await this.getAllEvaluations(filter);
      
      const stats: EvaluationStatistics = {
        total: evaluations.length,
        byStatus: {},
        byGrade: {},
        averageScore: 0,
        topPerformers: [],
        needsImprovement: [],
        completionRate: 0
      };
      
      let totalScore = 0;
      const scoreMap: { staffId: string; name: string; score: number }[] = [];
      
      evaluations.forEach(evaluation => {
        // ステータス別カウント
        if (evaluation.status) {
          stats.byStatus[evaluation.status] = 
            (stats.byStatus[evaluation.status] || 0) + 1;
        }
        
        // グレード別カウント
        if (evaluation.grade) {
          stats.byGrade[evaluation.grade] = 
            (stats.byGrade[evaluation.grade] || 0) + 1;
        }
        
        // スコア集計
        if (evaluation.totalScore) {
          totalScore += evaluation.totalScore;
          scoreMap.push({
            staffId: evaluation.staffId,
            name: evaluation.staffName,
            score: evaluation.totalScore
          });
        }
      });
      
      // 平均スコア計算
      stats.averageScore = evaluations.length > 0 ? totalScore / evaluations.length : 0;
      
      // トップパフォーマーと改善必要者の抽出
      scoreMap.sort((a, b) => b.score - a.score);
      stats.topPerformers = scoreMap.slice(0, 5);
      stats.needsImprovement = scoreMap.slice(-5).reverse();
      
      // 完了率（finalized状態の割合）
      const finalizedCount = stats.byStatus['finalized'] || 0;
      stats.completionRate = evaluations.length > 0 
        ? (finalizedCount / evaluations.length) * 100 
        : 0;
      
      return stats;
    } catch (error) {
      console.error('Error calculating statistics:', error);
      return {
        total: 0,
        byStatus: {},
        byGrade: {},
        averageScore: 0,
        topPerformers: [],
        needsImprovement: [],
        completionRate: 0
      };
    }
  }

  /**
   * 部門別評価集計
   */
  async getDepartmentEvaluations(department: string, period: string): Promise<EvaluationData[]> {
    // 本来はstaffServiceと連携して部門情報を取得
    const evaluations = await this.getAllEvaluations({ period });
    // TODO: 部門フィルタリング実装
    return evaluations;
  }

  /**
   * データのエクスポート
   */
  async exportEvaluationData(): Promise<EvaluationData[]> {
    return await this.getAllEvaluations();
  }

  /**
   * データのインポート
   */
  async importEvaluationData(evaluations: EvaluationData[]): Promise<boolean> {
    try {
      const results = await Promise.all(
        evaluations.map(evaluation => this.saveEvaluation(evaluation))
      );
      return results.every(result => result === true);
    } catch (error) {
      console.error('Error importing evaluations:', error);
      return false;
    }
  }

  /**
   * バッチ処理：期限切れの評価を自動提出
   */
  async autoSubmitOverdueEvaluations(deadline: string): Promise<number> {
    try {
      const evaluations = await this.getAllEvaluations({
        status: 'draft',
        dateTo: deadline
      });
      
      let submitted = 0;
      for (const evaluation of evaluations) {
        const success = await this.submitEvaluation(evaluation.id);
        if (success) submitted++;
      }
      
      return submitted;
    } catch (error) {
      console.error('Error in batch auto-submit:', error);
      return 0;
    }
  }

  // ==================== プライベートメソッド ====================

  private applyFilter(evaluations: EvaluationData[], filter: EvaluationFilter): EvaluationData[] {
    return evaluations.filter(evaluation => {
      if (filter.staffId && evaluation.staffId !== filter.staffId) {
        return false;
      }
      if (filter.evaluationType && evaluation.evaluationType !== filter.evaluationType) {
        return false;
      }
      if (filter.period && evaluation.evaluationPeriod !== filter.period) {
        return false;
      }
      if (filter.status && evaluation.status !== filter.status) {
        return false;
      }
      if (filter.evaluator && evaluation.evaluator.id !== filter.evaluator) {
        return false;
      }
      if (filter.gradeFilter && evaluation.grade && !filter.gradeFilter.includes(evaluation.grade)) {
        return false;
      }
      if (filter.dateFrom) {
        const evalDate = new Date(evaluation.evaluationDate);
        const fromDate = new Date(filter.dateFrom);
        if (evalDate < fromDate) return false;
      }
      if (filter.dateTo) {
        const evalDate = new Date(evaluation.evaluationDate);
        const toDate = new Date(filter.dateTo);
        if (evalDate > toDate) return false;
      }
      if (filter.searchTerm) {
        const searchLower = filter.searchTerm.toLowerCase();
        return (
          evaluation.staffName.toLowerCase().includes(searchLower) ||
          evaluation.evaluator.name.toLowerCase().includes(searchLower) ||
          evaluation.evaluationPeriod.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  }

  private calculateTotalScore(evaluation: EvaluationData): number {
    let score = 0;
    
    // コア評価（30点）
    if (evaluation.coreEvaluation) {
      score += evaluation.coreEvaluation.C01.superior + evaluation.coreEvaluation.C01.self;
      score += evaluation.coreEvaluation.C02.superior + evaluation.coreEvaluation.C02.self;
      score += evaluation.coreEvaluation.C03.superior + evaluation.coreEvaluation.C03.self;
    }
    
    // 施設特化評価（20点）
    if (evaluation.facilityEvaluation) {
      score += evaluation.facilityEvaluation.score;
    }
    
    // 貢献度評価（50点）
    if (evaluation.contributionEvaluation) {
      score += evaluation.contributionEvaluation.facility;
      score += evaluation.contributionEvaluation.corporate;
    }
    
    return score;
  }

  private determineGrade(score: number): 'S' | 'A' | 'B' | 'C' | 'D' {
    if (score >= 90) return 'S';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    return 'D';
  }

  private generateEvaluationId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `EVAL_${timestamp}_${random}`;
  }

  private getFromCache(key: string): any {
    const cached = this.cacheMap.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cacheMap.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  private invalidateCache(key?: string): void {
    if (key) {
      this.cacheMap.delete(key);
    } else {
      this.cacheMap.clear();
    }
  }
}

// シングルトンインスタンスをエクスポート
export const evaluationDataService = new EvaluationDataService();