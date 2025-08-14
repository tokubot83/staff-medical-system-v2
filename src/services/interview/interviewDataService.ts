/**
 * Interview Data Service
 * 面談データの管理を統一的に行うサービス
 * LocalStorageからAPIへの移行を容易にする設計
 */

import { StorageFactory } from '@/lib/storage/StorageAdapter';

export interface InterviewData {
  id: string;
  staffId: string;
  staffName: string;
  interviewType: string;
  interviewCategory: 'regular' | 'special' | 'support';
  scheduledDate: string;
  actualDate?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'postponed';
  interviewer: {
    id: string;
    name: string;
    position: string;
  };
  location?: string;
  duration?: number; // 分単位
  motivationType?: string;
  motivationScore?: number;
  summary?: string;
  keyPoints?: string[];
  actionItems?: {
    id: string;
    description: string;
    assignee: string;
    dueDate?: string;
    status: 'pending' | 'in-progress' | 'completed';
  }[];
  followUpRequired?: boolean;
  followUpDate?: string;
  attachments?: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
  sheetData?: any; // 面談シートの詳細データ
  metadata?: {
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string;
    updatedBy?: string;
  };
}

export interface InterviewFilter {
  staffId?: string;
  interviewType?: string;
  category?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  interviewer?: string;
  searchTerm?: string;
}

export interface InterviewStatistics {
  total: number;
  completed: number;
  scheduled: number;
  cancelled: number;
  byType: Record<string, number>;
  byCategory: Record<string, number>;
  averageDuration: number;
  followUpRate: number;
}

class InterviewDataService {
  private storage = StorageFactory.getAdapter();
  private cacheMap = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = 5 * 60 * 1000; // 5分のキャッシュ

  /**
   * 面談データを取得
   */
  async getInterview(interviewId: string): Promise<InterviewData | null> {
    const cached = this.getFromCache(`interview_${interviewId}`);
    if (cached) return cached;

    try {
      const response = await this.storage.get<InterviewData>(`interview_${interviewId}`);
      
      if (response.success && response.data) {
        this.setCache(`interview_${interviewId}`, response.data);
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching interview:', error);
      return null;
    }
  }

  /**
   * 全面談データを取得
   */
  async getAllInterviews(filter?: InterviewFilter): Promise<InterviewData[]> {
    try {
      const response = await this.storage.list<InterviewData>('interview_');
      
      if (response.success && response.data) {
        let interviews = response.data;
        
        if (filter) {
          interviews = this.applyFilter(interviews, filter);
        }
        
        // 日付順にソート（新しい順）
        interviews.sort((a, b) => {
          const dateA = new Date(a.scheduledDate).getTime();
          const dateB = new Date(b.scheduledDate).getTime();
          return dateB - dateA;
        });
        
        return interviews;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching all interviews:', error);
      return [];
    }
  }

  /**
   * 職員の面談履歴を取得
   */
  async getStaffInterviews(staffId: string): Promise<InterviewData[]> {
    return await this.getAllInterviews({ staffId });
  }

  /**
   * 面談データを保存
   */
  async saveInterview(interview: InterviewData): Promise<boolean> {
    try {
      // IDが無い場合は生成
      if (!interview.id) {
        interview.id = this.generateInterviewId();
      }
      
      // メタデータの更新
      interview.metadata = {
        ...interview.metadata,
        updatedAt: new Date(),
      };
      
      const response = await this.storage.set(`interview_${interview.id}`, interview);
      
      if (response.success) {
        this.invalidateCache(`interview_${interview.id}`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error saving interview:', error);
      return false;
    }
  }

  /**
   * 面談をスケジュール
   */
  async scheduleInterview(interviewData: Partial<InterviewData>): Promise<string | null> {
    try {
      const interview: InterviewData = {
        id: this.generateInterviewId(),
        staffId: interviewData.staffId || '',
        staffName: interviewData.staffName || '',
        interviewType: interviewData.interviewType || '',
        interviewCategory: interviewData.interviewCategory || 'regular',
        scheduledDate: interviewData.scheduledDate || '',
        status: 'scheduled',
        interviewer: interviewData.interviewer || { id: '', name: '', position: '' },
        ...interviewData,
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: interviewData.metadata?.createdBy
        }
      };
      
      const success = await this.saveInterview(interview);
      return success ? interview.id : null;
    } catch (error) {
      console.error('Error scheduling interview:', error);
      return null;
    }
  }

  /**
   * 面談を完了
   */
  async completeInterview(
    interviewId: string, 
    completionData: {
      actualDate?: string;
      summary?: string;
      keyPoints?: string[];
      actionItems?: any[];
      followUpRequired?: boolean;
      followUpDate?: string;
      sheetData?: any;
    }
  ): Promise<boolean> {
    try {
      const interview = await this.getInterview(interviewId);
      if (!interview) return false;
      
      interview.status = 'completed';
      interview.actualDate = completionData.actualDate || new Date().toISOString();
      interview.summary = completionData.summary;
      interview.keyPoints = completionData.keyPoints;
      interview.actionItems = completionData.actionItems;
      interview.followUpRequired = completionData.followUpRequired;
      interview.followUpDate = completionData.followUpDate;
      interview.sheetData = completionData.sheetData;
      
      return await this.saveInterview(interview);
    } catch (error) {
      console.error('Error completing interview:', error);
      return false;
    }
  }

  /**
   * 面談をキャンセル
   */
  async cancelInterview(interviewId: string, reason?: string): Promise<boolean> {
    try {
      const interview = await this.getInterview(interviewId);
      if (!interview) return false;
      
      interview.status = 'cancelled';
      if (reason) {
        interview.summary = `キャンセル理由: ${reason}`;
      }
      
      return await this.saveInterview(interview);
    } catch (error) {
      console.error('Error cancelling interview:', error);
      return false;
    }
  }

  /**
   * 面談を延期
   */
  async postponeInterview(interviewId: string, newDate: string): Promise<boolean> {
    try {
      const interview = await this.getInterview(interviewId);
      if (!interview) return false;
      
      interview.status = 'postponed';
      interview.scheduledDate = newDate;
      
      return await this.saveInterview(interview);
    } catch (error) {
      console.error('Error postponing interview:', error);
      return false;
    }
  }

  /**
   * 面談データを削除
   */
  async deleteInterview(interviewId: string): Promise<boolean> {
    try {
      const response = await this.storage.delete(`interview_${interviewId}`);
      
      if (response.success) {
        this.invalidateCache(`interview_${interviewId}`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting interview:', error);
      return false;
    }
  }

  /**
   * 面談統計を取得
   */
  async getInterviewStatistics(filter?: InterviewFilter): Promise<InterviewStatistics> {
    try {
      const interviews = await this.getAllInterviews(filter);
      
      const stats: InterviewStatistics = {
        total: interviews.length,
        completed: 0,
        scheduled: 0,
        cancelled: 0,
        byType: {},
        byCategory: {},
        averageDuration: 0,
        followUpRate: 0
      };
      
      let totalDuration = 0;
      let durationCount = 0;
      let followUpCount = 0;
      
      interviews.forEach(interview => {
        // ステータス別カウント
        switch (interview.status) {
          case 'completed':
            stats.completed++;
            break;
          case 'scheduled':
            stats.scheduled++;
            break;
          case 'cancelled':
            stats.cancelled++;
            break;
        }
        
        // タイプ別カウント
        if (interview.interviewType) {
          stats.byType[interview.interviewType] = 
            (stats.byType[interview.interviewType] || 0) + 1;
        }
        
        // カテゴリ別カウント
        if (interview.interviewCategory) {
          stats.byCategory[interview.interviewCategory] = 
            (stats.byCategory[interview.interviewCategory] || 0) + 1;
        }
        
        // 平均時間計算
        if (interview.duration) {
          totalDuration += interview.duration;
          durationCount++;
        }
        
        // フォローアップ率
        if (interview.status === 'completed' && interview.followUpRequired) {
          followUpCount++;
        }
      });
      
      stats.averageDuration = durationCount > 0 ? totalDuration / durationCount : 0;
      stats.followUpRate = stats.completed > 0 ? (followUpCount / stats.completed) * 100 : 0;
      
      return stats;
    } catch (error) {
      console.error('Error calculating statistics:', error);
      return {
        total: 0,
        completed: 0,
        scheduled: 0,
        cancelled: 0,
        byType: {},
        byCategory: {},
        averageDuration: 0,
        followUpRate: 0
      };
    }
  }

  /**
   * データのエクスポート
   */
  async exportInterviewData(): Promise<InterviewData[]> {
    return await this.getAllInterviews();
  }

  /**
   * データのインポート
   */
  async importInterviewData(interviews: InterviewData[]): Promise<boolean> {
    try {
      const results = await Promise.all(
        interviews.map(interview => this.saveInterview(interview))
      );
      return results.every(result => result === true);
    } catch (error) {
      console.error('Error importing interviews:', error);
      return false;
    }
  }

  /**
   * 今後の面談予定を取得
   */
  async getUpcomingInterviews(days: number = 30): Promise<InterviewData[]> {
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + days);
    
    return await this.getAllInterviews({
      status: 'scheduled',
      dateFrom: today.toISOString(),
      dateTo: endDate.toISOString()
    });
  }

  // ==================== プライベートメソッド ====================

  private applyFilter(interviews: InterviewData[], filter: InterviewFilter): InterviewData[] {
    return interviews.filter(interview => {
      if (filter.staffId && interview.staffId !== filter.staffId) {
        return false;
      }
      if (filter.interviewType && interview.interviewType !== filter.interviewType) {
        return false;
      }
      if (filter.category && interview.interviewCategory !== filter.category) {
        return false;
      }
      if (filter.status && interview.status !== filter.status) {
        return false;
      }
      if (filter.interviewer && interview.interviewer.id !== filter.interviewer) {
        return false;
      }
      if (filter.dateFrom) {
        const interviewDate = new Date(interview.scheduledDate);
        const fromDate = new Date(filter.dateFrom);
        if (interviewDate < fromDate) return false;
      }
      if (filter.dateTo) {
        const interviewDate = new Date(interview.scheduledDate);
        const toDate = new Date(filter.dateTo);
        if (interviewDate > toDate) return false;
      }
      if (filter.searchTerm) {
        const searchLower = filter.searchTerm.toLowerCase();
        return (
          interview.staffName.toLowerCase().includes(searchLower) ||
          interview.interviewType.toLowerCase().includes(searchLower) ||
          interview.interviewer.name.toLowerCase().includes(searchLower) ||
          (interview.summary && interview.summary.toLowerCase().includes(searchLower))
        );
      }
      return true;
    });
  }

  private generateInterviewId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `INT_${timestamp}_${random}`;
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
export const interviewDataService = new InterviewDataService();