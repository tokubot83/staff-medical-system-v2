/**
 * 研修状況自動連携サービス
 * 教育・研修システムから人事評価システムへのデータ連携
 */

import { TrainingProgram } from '@/types/training';

// 研修実績データ型
export interface TrainingRecord {
  staffId: string;
  staffName: string;
  facilityId: string;
  department: string;
  jobCategory: string;
  year: number;
  
  // 研修実績
  completedPrograms: {
    programId: string;
    programName: string;
    category: 'mandatory' | 'specialized' | 'leadership' | 'certification';
    completedDate: Date;
    score?: number;
    certificate?: boolean;
  }[];
  
  // 研修統計
  statistics: {
    mandatoryCompletion: number;  // 必須研修完了率（%）
    totalHours: number;           // 総研修時間
    averageScore: number;         // 平均スコア
    certificationCount: number;   // 取得資格数
  };
  
  // 評価への反映
  evaluationImpact: {
    technicalPoints: number;      // 技術評価への加点
    contributionPoints: number;   // 貢献度評価への加点
    specialAchievements: string[]; // 特別実績
  };
}

// 研修カテゴリ別の評価影響度
const TRAINING_IMPACT_MATRIX = {
  mandatory: {
    technicalImpact: 0.5,     // 技術評価への影響度
    contributionImpact: 0.2,  // 貢献度評価への影響度
    maxPoints: 3
  },
  specialized: {
    technicalImpact: 0.8,
    contributionImpact: 0.3,
    maxPoints: 5
  },
  leadership: {
    technicalImpact: 0.3,
    contributionImpact: 0.7,
    maxPoints: 4
  },
  certification: {
    technicalImpact: 1.0,
    contributionImpact: 0.5,
    maxPoints: 6
  }
};

export class TrainingIntegrationService {
  /**
   * 職員の研修実績を取得
   */
  async fetchTrainingRecords(
    staffId: string,
    year: number
  ): Promise<TrainingRecord> {
    // 実際はAPIから取得
    return this.generateMockTrainingRecord(staffId, year);
  }

  /**
   * 複数職員の研修実績を一括取得
   */
  async fetchBulkTrainingRecords(
    staffIds: string[],
    year: number
  ): Promise<TrainingRecord[]> {
    const records = await Promise.all(
      staffIds.map(id => this.fetchTrainingRecords(id, year))
    );
    return records;
  }

  /**
   * 研修実績から評価ポイントを計算
   */
  calculateEvaluationPoints(record: TrainingRecord): {
    technicalPoints: number;
    contributionPoints: number;
    details: string[];
  } {
    let technicalPoints = 0;
    let contributionPoints = 0;
    const details: string[] = [];

    // 各研修プログラムの影響を計算
    record.completedPrograms.forEach(program => {
      const impact = TRAINING_IMPACT_MATRIX[program.category];
      
      // スコアベースの計算（100点満点を想定）
      const scoreMultiplier = (program.score || 70) / 100;
      
      const techPoints = impact.technicalImpact * impact.maxPoints * scoreMultiplier;
      const contribPoints = impact.contributionImpact * impact.maxPoints * scoreMultiplier;
      
      technicalPoints += techPoints;
      contributionPoints += contribPoints;
      
      // 資格取得の特別加点
      if (program.certificate) {
        technicalPoints += 2;
        details.push(`資格取得: ${program.programName}`);
      }
    });

    // 必須研修完了率による調整
    const completionMultiplier = record.statistics.mandatoryCompletion / 100;
    technicalPoints *= completionMultiplier;
    
    // 研修時間による追加ポイント
    if (record.statistics.totalHours > 100) {
      contributionPoints += 3;
      details.push(`年間100時間以上の研修受講`);
    }

    // 上限設定（技術評価の20%、貢献度評価の15%まで）
    technicalPoints = Math.min(technicalPoints, 10);  // 50点中10点まで
    contributionPoints = Math.min(contributionPoints, 7.5); // 50点中7.5点まで

    return {
      technicalPoints: Math.round(technicalPoints * 10) / 10,
      contributionPoints: Math.round(contributionPoints * 10) / 10,
      details
    };
  }

  /**
   * 研修実績を評価システムに反映
   */
  async syncToEvaluationSystem(
    staffId: string,
    year: number
  ): Promise<{
    success: boolean;
    technicalImpact: number;
    contributionImpact: number;
    message: string;
  }> {
    try {
      // 研修実績を取得
      const trainingRecord = await this.fetchTrainingRecords(staffId, year);
      
      // 評価ポイントを計算
      const evaluationPoints = this.calculateEvaluationPoints(trainingRecord);
      
      // 評価システムに反映（実際はAPIを呼び出す）
      console.log('Syncing training data to evaluation system:', {
        staffId,
        year,
        ...evaluationPoints
      });
      
      // TODO: 実際のAPI連携
      // await evaluationAPI.updateTrainingPoints(staffId, year, evaluationPoints);
      
      return {
        success: true,
        technicalImpact: evaluationPoints.technicalPoints,
        contributionImpact: evaluationPoints.contributionPoints,
        message: `研修実績を評価システムに反映しました（技術評価: +${evaluationPoints.technicalPoints}点, 貢献度評価: +${evaluationPoints.contributionPoints}点）`
      };
    } catch (error) {
      console.error('Training sync failed:', error);
      return {
        success: false,
        technicalImpact: 0,
        contributionImpact: 0,
        message: '研修実績の連携に失敗しました'
      };
    }
  }

  /**
   * バッチ処理による一括連携
   */
  async batchSyncTrainingData(
    facilityId: string,
    year: number
  ): Promise<{
    totalProcessed: number;
    successCount: number;
    failureCount: number;
    totalTechnicalPoints: number;
    totalContributionPoints: number;
  }> {
    // 実際は施設の全職員を取得
    const staffIds = this.getMockStaffIds(facilityId);
    
    let successCount = 0;
    let failureCount = 0;
    let totalTechnicalPoints = 0;
    let totalContributionPoints = 0;
    
    for (const staffId of staffIds) {
      const result = await this.syncToEvaluationSystem(staffId, year);
      if (result.success) {
        successCount++;
        totalTechnicalPoints += result.technicalImpact;
        totalContributionPoints += result.contributionImpact;
      } else {
        failureCount++;
      }
    }
    
    return {
      totalProcessed: staffIds.length,
      successCount,
      failureCount,
      totalTechnicalPoints,
      totalContributionPoints
    };
  }

  /**
   * 研修推奨リストの生成
   */
  generateTrainingRecommendations(
    staffId: string,
    evaluationScore: number,
    jobCategory: string
  ): {
    recommended: TrainingProgram[];
    reason: string;
    priority: 'high' | 'medium' | 'low';
  }[] {
    const recommendations = [];
    
    // 評価スコアが低い場合の補強研修
    if (evaluationScore < 60) {
      recommendations.push({
        recommended: [{
          id: 'BASIC001',
          name: '基礎スキル向上研修',
          category: 'skill',
          type: 'mandatory',
          duration: 8,
          targetAudience: [jobCategory],
          objectives: ['基礎技術の習得', '業務品質の向上'],
          schedule: {
            startDate: new Date('2025-02-01'),
            endDate: new Date('2025-02-28'),
            frequency: '週1回'
          }
        }],
        reason: '評価スコアが基準を下回っているため、基礎スキルの強化が必要',
        priority: 'high'
      });
    }
    
    // 職種別の専門研修
    if (jobCategory === 'nurse') {
      recommendations.push({
        recommended: [{
          id: 'NURSE_SPEC001',
          name: '看護専門技術研修',
          category: 'skill',
          type: 'elective',
          duration: 16,
          targetAudience: ['nurse'],
          objectives: ['専門看護技術の向上', '最新医療知識の習得'],
          schedule: {
            startDate: new Date('2025-03-01'),
            endDate: new Date('2025-03-31'),
            frequency: '月2回'
          }
        }],
        reason: '看護職の専門性向上のため',
        priority: 'medium'
      });
    }
    
    // リーダーシップ研修（中堅以上）
    if (evaluationScore >= 70) {
      recommendations.push({
        recommended: [{
          id: 'LEAD001',
          name: 'リーダーシップ開発プログラム',
          category: 'management',
          type: 'elective',
          duration: 24,
          targetAudience: ['all'],
          objectives: ['リーダーシップスキル開発', 'チームマネジメント'],
          schedule: {
            startDate: new Date('2025-04-01'),
            endDate: new Date('2025-06-30'),
            frequency: '隔週'
          }
        }],
        reason: '次期リーダー候補として育成',
        priority: 'low'
      });
    }
    
    return recommendations;
  }

  /**
   * モックデータ生成
   */
  private generateMockTrainingRecord(staffId: string, year: number): TrainingRecord {
    const programs = [
      {
        programId: 'MAND001',
        programName: '医療安全研修',
        category: 'mandatory' as const,
        completedDate: new Date(`${year}-03-15`),
        score: 85,
        certificate: false
      },
      {
        programId: 'MAND002',
        programName: '感染対策研修',
        category: 'mandatory' as const,
        completedDate: new Date(`${year}-06-20`),
        score: 90,
        certificate: false
      },
      {
        programId: 'SPEC001',
        programName: '専門看護技術研修',
        category: 'specialized' as const,
        completedDate: new Date(`${year}-09-10`),
        score: 88,
        certificate: true
      },
      {
        programId: 'LEAD001',
        programName: 'チームリーダー研修',
        category: 'leadership' as const,
        completedDate: new Date(`${year}-11-05`),
        score: 82,
        certificate: false
      }
    ];
    
    // ランダムに一部を選択
    const completedPrograms = programs.slice(0, Math.floor(Math.random() * 3) + 2);
    
    const totalScore = completedPrograms.reduce((sum, p) => sum + (p.score || 0), 0);
    const averageScore = totalScore / completedPrograms.length;
    const certificationCount = completedPrograms.filter(p => p.certificate).length;
    
    return {
      staffId,
      staffName: `職員_${staffId}`,
      facilityId: 'FACILITY001',
      department: '看護部',
      jobCategory: 'nurse',
      year,
      completedPrograms,
      statistics: {
        mandatoryCompletion: Math.random() > 0.3 ? 100 : 80,
        totalHours: 40 + Math.floor(Math.random() * 80),
        averageScore,
        certificationCount
      },
      evaluationImpact: {
        technicalPoints: 0,
        contributionPoints: 0,
        specialAchievements: certificationCount > 0 ? ['資格取得'] : []
      }
    };
  }

  private getMockStaffIds(facilityId: string): string[] {
    // モック用のスタッフIDリスト
    return ['STAFF001', 'STAFF002', 'STAFF003', 'STAFF004', 'STAFF005'];
  }
}

export const trainingIntegrationService = new TrainingIntegrationService();