// 研修連携サービス
// 法定研修の開催状況と評価項目の動的連携

import { MandatoryTrainings } from '@/data/questionBank';

export interface TrainingRecord {
  staffId: string;
  trainingId: string;
  completedDate: Date;
  score?: number;
  certificateNumber?: string;
  expiryDate?: Date;
}

export interface TrainingSchedule {
  id: string;
  trainingId: string;
  scheduledDate: Date;
  facility: string;
  targetExperienceLevels: string[];
  targetDepartments?: string[];
  mandatory: boolean;
  capacity: number;
  enrolled: number;
}

export interface AnnualTrainingPlan {
  year: number;
  facility: string;
  mandatoryTrainings: {
    trainingId: string;
    scheduledDates: Date[];
    targetGroups: string[];
    completionRate?: number;
  }[];
  facilitySpecificTrainings?: {
    name: string;
    description: string;
    scheduledDates: Date[];
    targetGroups: string[];
  }[];
}

// 研修統合サービス
export class TrainingIntegrationService {
  // スタッフの研修履歴取得
  static async getStaffTrainingHistory(staffId: string): Promise<TrainingRecord[]> {
    // 実際はAPIから取得
    const mockData: TrainingRecord[] = [
      {
        staffId,
        trainingId: 'infection_control',
        completedDate: new Date('2024-04-15'),
        score: 95,
        certificateNumber: 'IC2024-001',
        expiryDate: new Date('2025-04-14')
      },
      {
        staffId,
        trainingId: 'safety_management',
        completedDate: new Date('2024-06-20'),
        score: 88,
        certificateNumber: 'SM2024-002'
      }
    ];
    return mockData;
  }
  
  // 完了した研修IDリストを取得
  static async getCompletedTrainingIds(staffId: string, year: number): Promise<string[]> {
    const history = await this.getStaffTrainingHistory(staffId);
    return history
      .filter(record => {
        const completedYear = new Date(record.completedDate).getFullYear();
        if (record.expiryDate) {
          return completedYear <= year && new Date(record.expiryDate) >= new Date(`${year}-01-01`);
        }
        return completedYear === year || completedYear === year - 1;
      })
      .map(record => record.trainingId);
  }
  
  // 必須研修の未受講リスト取得
  static async getPendingMandatoryTrainings(
    staffId: string,
    experienceLevel: string,
    year: number
  ): Promise<string[]> {
    const completed = await this.getCompletedTrainingIds(staffId, year);
    
    // 経験レベルに応じた必須研修
    const required = Object.entries(MandatoryTrainings)
      .filter(([_, training]) => training.requiredForLevels.includes(experienceLevel))
      .map(([_, training]) => training.id);
    
    // 未受講の研修
    return required.filter(trainingId => !completed.includes(trainingId));
  }
  
  // 年間研修計画の取得
  static async getAnnualTrainingPlan(facility: string, year: number): Promise<AnnualTrainingPlan> {
    // 実際はAPIから取得
    const plan: AnnualTrainingPlan = {
      year,
      facility,
      mandatoryTrainings: [
        {
          trainingId: 'infection_control',
          scheduledDates: [
            new Date(`${year}-04-15`),
            new Date(`${year}-10-15`)
          ],
          targetGroups: ['全職員'],
          completionRate: 85
        },
        {
          trainingId: 'safety_management',
          scheduledDates: [
            new Date(`${year}-06-20`),
            new Date(`${year}-12-20`)
          ],
          targetGroups: ['全職員'],
          completionRate: 78
        },
        {
          trainingId: 'emergency_response',
          scheduledDates: [
            new Date(`${year}-05-10`),
            new Date(`${year}-11-10`)
          ],
          targetGroups: ['新人', '若手'],
          completionRate: 92
        }
      ],
      facilitySpecificTrainings: [
        {
          name: '認知症ケア研修',
          description: '認知症患者への対応とケア技術',
          scheduledDates: [new Date(`${year}-05-25`)],
          targetGroups: ['看護師', '介護職']
        }
      ]
    };
    
    return plan;
  }
  
  // 研修と評価項目の関連付け
  static async getTrainingRelatedQuestions(trainingId: string): Promise<string[]> {
    const training = Object.values(MandatoryTrainings).find(t => t.id === trainingId);
    return training?.associatedQuestions || [];
  }
  
  // 研修ベースの評価項目推奨
  static async recommendQuestionsBasedOnTraining(params: {
    staffId: string;
    experienceLevel: string;
    year: number;
    categoryCode: string;
  }): Promise<{
    mandatoryQuestions: string[];
    recommendedQuestions: string[];
    reason: string;
  }> {
    const completedTrainings = await this.getCompletedTrainingIds(params.staffId, params.year);
    const pendingTrainings = await this.getPendingMandatoryTrainings(
      params.staffId,
      params.experienceLevel,
      params.year
    );
    
    // 完了した研修に関連する設問
    const mandatoryQuestions: string[] = [];
    for (const trainingId of completedTrainings) {
      const questions = await this.getTrainingRelatedQuestions(trainingId);
      mandatoryQuestions.push(...questions);
    }
    
    // 推奨設問（未受講研修の基本確認）
    const recommendedQuestions: string[] = [];
    for (const trainingId of pendingTrainings) {
      const questions = await this.getTrainingRelatedQuestions(trainingId);
      recommendedQuestions.push(...questions.slice(0, 1));
    }
    
    const reason = completedTrainings.length > 0
      ? `${params.year}年度に完了した${completedTrainings.length}件の法定研修に基づく評価項目`
      : '今年度の研修受講が必要です';
    
    return {
      mandatoryQuestions: [...new Set(mandatoryQuestions)],
      recommendedQuestions: [...new Set(recommendedQuestions)],
      reason
    };
  }
  
  // 施設の研修実施状況サマリー
  static async getFacilityTrainingSummary(facility: string, year: number) {
    const plan = await this.getAnnualTrainingPlan(facility, year);
    
    const summary = {
      facility,
      year,
      totalMandatoryTrainings: plan.mandatoryTrainings.length,
      averageCompletionRate: 
        plan.mandatoryTrainings.reduce((sum, t) => sum + (t.completionRate || 0), 0) / 
        plan.mandatoryTrainings.length,
      upcomingTrainings: plan.mandatoryTrainings
        .flatMap(t => t.scheduledDates.map(date => ({
          trainingId: t.trainingId,
          date,
          name: MandatoryTrainings[t.trainingId as keyof typeof MandatoryTrainings]?.name
        })))
        .filter(t => t.date > new Date())
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .slice(0, 5),
      criticalTrainings: plan.mandatoryTrainings
        .filter(t => (t.completionRate || 0) < 70)
        .map(t => ({
          trainingId: t.trainingId,
          name: MandatoryTrainings[t.trainingId as keyof typeof MandatoryTrainings]?.name,
          completionRate: t.completionRate
        }))
    };
    
    return summary;
  }
}
