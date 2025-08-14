/**
 * Staff Data Service
 * 職員データの管理を統一的に行うサービス
 * LocalStorageからAPIへの移行を容易にする設計
 */

import { StorageFactory, StorageResponse } from '@/lib/storage/StorageAdapter';

export interface Staff {
  id: string;
  name: string;
  department: string;
  position: string;
  employeeNumber: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  joinDate: string;
  birthDate?: string;
  qualifications?: string[];
  specialties?: string[];
  evaluationHistory?: EvaluationRecord[];
  interviewHistory?: InterviewRecord[];
  trainingHistory?: TrainingRecord[];
  motivationType?: string;
  riskLevel?: 'low' | 'medium' | 'high';
  wellbeingScore?: number;
  metadata?: {
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string;
    updatedBy?: string;
  };
}

export interface EvaluationRecord {
  id: string;
  date: string;
  type: string;
  score: number;
  evaluator: string;
  comments?: string;
}

export interface InterviewRecord {
  id: string;
  date: string;
  type: string;
  interviewer: string;
  summary?: string;
  actionItems?: string[];
}

export interface TrainingRecord {
  id: string;
  name: string;
  date: string;
  status: 'completed' | 'in-progress' | 'scheduled';
  score?: number;
  certificate?: string;
}

export interface StaffFilter {
  department?: string;
  position?: string;
  riskLevel?: string;
  searchTerm?: string;
}

class StaffDataService {
  private storage = StorageFactory.getAdapter();
  private cacheMap = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = 5 * 60 * 1000; // 5分のキャッシュ

  /**
   * 職員データを取得
   */
  async getStaff(staffId: string): Promise<Staff | null> {
    // キャッシュチェック
    const cached = this.getFromCache(`staff_${staffId}`);
    if (cached) return cached;

    try {
      const response = await this.storage.get<Staff>(`staff_${staffId}`);
      
      if (response.success && response.data) {
        this.setCache(`staff_${staffId}`, response.data);
        return response.data;
      }
      
      // フォールバック処理は将来的に実装
      // 現時点ではstaffDatabaseファイルが存在しないため、スキップ
      
      return null;
    } catch (error) {
      console.error('Error fetching staff:', error);
      return null;
    }
  }

  /**
   * 全職員データを取得
   */
  async getAllStaff(filter?: StaffFilter): Promise<Staff[]> {
    try {
      const response = await this.storage.list<Staff>('staff_');
      
      if (response.success && response.data) {
        let staffList = response.data;
        
        // フィルタリング
        if (filter) {
          staffList = this.applyFilter(staffList, filter);
        }
        
        return staffList;
      }
      
      // フォールバック処理は将来的に実装
      return [];
    } catch (error) {
      console.error('Error fetching all staff:', error);
      return [];
    }
  }

  /**
   * 職員データを保存
   */
  async saveStaff(staff: Staff): Promise<boolean> {
    try {
      // メタデータの更新
      staff.metadata = {
        createdAt: staff.metadata?.createdAt || new Date(),
        ...staff.metadata,
        updatedAt: new Date(),
      };
      
      const response = await this.storage.set(`staff_${staff.id}`, staff);
      
      if (response.success) {
        this.invalidateCache(`staff_${staff.id}`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error saving staff:', error);
      return false;
    }
  }

  /**
   * 職員データを削除
   */
  async deleteStaff(staffId: string): Promise<boolean> {
    try {
      const response = await this.storage.delete(`staff_${staffId}`);
      
      if (response.success) {
        this.invalidateCache(`staff_${staffId}`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting staff:', error);
      return false;
    }
  }

  /**
   * 職員の評価履歴を追加
   */
  async addEvaluationRecord(staffId: string, evaluation: EvaluationRecord): Promise<boolean> {
    try {
      const staff = await this.getStaff(staffId);
      if (!staff) return false;
      
      staff.evaluationHistory = staff.evaluationHistory || [];
      staff.evaluationHistory.push(evaluation);
      
      return await this.saveStaff(staff);
    } catch (error) {
      console.error('Error adding evaluation record:', error);
      return false;
    }
  }

  /**
   * 職員の面談履歴を追加
   */
  async addInterviewRecord(staffId: string, interview: InterviewRecord): Promise<boolean> {
    try {
      const staff = await this.getStaff(staffId);
      if (!staff) return false;
      
      staff.interviewHistory = staff.interviewHistory || [];
      staff.interviewHistory.push(interview);
      
      return await this.saveStaff(staff);
    } catch (error) {
      console.error('Error adding interview record:', error);
      return false;
    }
  }

  /**
   * 職員の研修履歴を追加
   */
  async addTrainingRecord(staffId: string, training: TrainingRecord): Promise<boolean> {
    try {
      const staff = await this.getStaff(staffId);
      if (!staff) return false;
      
      staff.trainingHistory = staff.trainingHistory || [];
      staff.trainingHistory.push(training);
      
      return await this.saveStaff(staff);
    } catch (error) {
      console.error('Error adding training record:', error);
      return false;
    }
  }

  /**
   * 職員の写真をアップロード（将来実装）
   */
  async uploadStaffPhoto(staffId: string, photoFile: File): Promise<string | null> {
    // TODO: 実際のファイルアップロード処理
    // 現在はBase64エンコードしてLocalStorageに保存する仮実装
    try {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64String = reader.result as string;
          const staff = await this.getStaff(staffId);
          if (staff) {
            staff.photoUrl = base64String;
            await this.saveStaff(staff);
            resolve(base64String);
          } else {
            resolve(null);
          }
        };
        reader.readAsDataURL(photoFile);
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      return null;
    }
  }

  /**
   * バッチ更新
   */
  async batchUpdateStaff(staffList: Staff[]): Promise<boolean> {
    try {
      const results = await Promise.all(
        staffList.map(staff => this.saveStaff(staff))
      );
      return results.every(result => result === true);
    } catch (error) {
      console.error('Error in batch update:', error);
      return false;
    }
  }

  /**
   * データのエクスポート
   */
  async exportStaffData(): Promise<Staff[]> {
    return await this.getAllStaff();
  }

  /**
   * データのインポート
   */
  async importStaffData(staffList: Staff[]): Promise<boolean> {
    return await this.batchUpdateStaff(staffList);
  }

  // ==================== プライベートメソッド ====================

  private applyFilter(staffList: Staff[], filter: StaffFilter): Staff[] {
    return staffList.filter(staff => {
      if (filter.department && staff.department !== filter.department) {
        return false;
      }
      if (filter.position && staff.position !== filter.position) {
        return false;
      }
      if (filter.riskLevel && staff.riskLevel !== filter.riskLevel) {
        return false;
      }
      if (filter.searchTerm) {
        const searchLower = filter.searchTerm.toLowerCase();
        return (
          staff.name.toLowerCase().includes(searchLower) ||
          staff.employeeNumber.toLowerCase().includes(searchLower) ||
          staff.department.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
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
export const staffDataService = new StaffDataService();