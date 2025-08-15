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
}
