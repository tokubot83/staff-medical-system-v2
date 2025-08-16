/**
 * 面談予約管理サービス
 * APIとの通信を管理し、コンポーネントに機能を提供
 */

import { UnifiedInterviewReservation } from '@/components/interview/UnifiedInterviewDashboard';

const API_BASE_URL = '/api/interviews/reservations';

export interface ReservationFilters {
  staffId?: string;
  date?: string;
  type?: 'regular' | 'special' | 'support';
  status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  source?: 'manual' | 'voicedrive' | 'system';
}

export interface ReservationStats {
  period: {
    start: string;
    end: string;
  };
  summary: {
    total: number;
    completed: number;
    pending: number;
    cancelled: number;
    completionRate: number;
  };
  byType: Record<string, any>;
  byDepartment: Record<string, any>;
  bySource: Record<string, number>;
  byUrgency: Record<string, number>;
  trends: Record<string, any>;
  upcomingWeek: Record<string, any>;
}

export class InterviewReservationService {
  
  /**
   * 面談予約一覧を取得
   */
  static async getReservations(filters?: ReservationFilters): Promise<UnifiedInterviewReservation[]> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, value.toString());
          }
        });
      }

      const response = await fetch(`${API_BASE_URL}?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch reservations');
      }

      const data = await response.json();
      return data.data || [];
      
    } catch (error) {
      console.error('Error fetching reservations:', error);
      return [];
    }
  }

  /**
   * 特定の面談予約を取得
   */
  static async getReservation(id: string): Promise<UnifiedInterviewReservation | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('Failed to fetch reservation');
      }

      const data = await response.json();
      return data.data;
      
    } catch (error) {
      console.error('Error fetching reservation:', error);
      return null;
    }
  }

  /**
   * 新規面談予約を作成
   */
  static async createReservation(
    reservation: Partial<UnifiedInterviewReservation>
  ): Promise<UnifiedInterviewReservation | null> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservation),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create reservation');
      }

      const data = await response.json();
      return data.data;
      
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  }

  /**
   * 面談予約を更新
   */
  static async updateReservation(
    id: string,
    updates: Partial<UnifiedInterviewReservation>
  ): Promise<UnifiedInterviewReservation | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update reservation');
      }

      const data = await response.json();
      return data.data;
      
    } catch (error) {
      console.error('Error updating reservation:', error);
      throw error;
    }
  }

  /**
   * 面談予約のステータスを更新
   */
  static async updateReservationStatus(
    id: string,
    status: string,
    updatedBy?: string
  ): Promise<UnifiedInterviewReservation | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, updatedBy }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update reservation status');
      }

      const data = await response.json();
      return data.data;
      
    } catch (error) {
      console.error('Error updating reservation status:', error);
      throw error;
    }
  }

  /**
   * 面談予約をキャンセル
   */
  static async cancelReservation(
    id: string,
    reason?: string,
    cancelledBy?: string
  ): Promise<boolean> {
    try {
      const params = new URLSearchParams();
      if (reason) params.append('reason', reason);
      if (cancelledBy) params.append('cancelledBy', cancelledBy);

      const response = await fetch(`${API_BASE_URL}/${id}?${params.toString()}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to cancel reservation');
      }

      return true;
      
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      throw error;
    }
  }

  /**
   * 複数の面談予約を一括作成
   */
  static async createBulkReservations(
    reservations: Partial<UnifiedInterviewReservation>[],
    source?: string,
    createdBy?: string
  ): Promise<{
    created: UnifiedInterviewReservation[];
    errors: any[];
    summary: {
      total: number;
      created: number;
      failed: number;
    };
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reservations, source, createdBy }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create bulk reservations');
      }

      const data = await response.json();
      return data.data;
      
    } catch (error) {
      console.error('Error creating bulk reservations:', error);
      throw error;
    }
  }

  /**
   * 複数の面談予約を一括キャンセル
   */
  static async cancelBulkReservations(
    reservationIds: string[],
    reason?: string,
    cancelledBy?: string
  ): Promise<{
    cancelled: string[];
    errors: any[];
    summary: {
      total: number;
      cancelled: number;
      failed: number;
    };
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/bulk`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reservationIds, reason, cancelledBy }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to cancel bulk reservations');
      }

      const data = await response.json();
      return data.data;
      
    } catch (error) {
      console.error('Error cancelling bulk reservations:', error);
      throw error;
    }
  }

  /**
   * 面談予約の統計情報を取得
   */
  static async getReservationStats(
    startDate?: string,
    endDate?: string,
    department?: string
  ): Promise<ReservationStats | null> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (department) params.append('department', department);

      const response = await fetch(`${API_BASE_URL}/stats?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch reservation statistics');
      }

      const data = await response.json();
      return data.data;
      
    } catch (error) {
      console.error('Error fetching reservation statistics:', error);
      return null;
    }
  }

  /**
   * 今日の面談予約を取得
   */
  static async getTodayReservations(): Promise<UnifiedInterviewReservation[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.getReservations({ date: today });
  }

  /**
   * 特定職員の面談予約を取得
   */
  static async getStaffReservations(staffId: string): Promise<UnifiedInterviewReservation[]> {
    return this.getReservations({ staffId });
  }

  /**
   * 未処理の面談予約を取得
   */
  static async getPendingReservations(): Promise<UnifiedInterviewReservation[]> {
    return this.getReservations({ status: 'pending' });
  }

  /**
   * VoiceDriveからの面談予約を取得
   */
  static async getVoiceDriveReservations(): Promise<UnifiedInterviewReservation[]> {
    return this.getReservations({ source: 'voicedrive' });
  }

  /**
   * 面談予約の重複チェック
   */
  static async checkDuplicateReservation(
    staffId: string,
    date: string,
    time: string
  ): Promise<boolean> {
    const reservations = await this.getReservations({ staffId, date });
    return reservations.some(r => 
      r.scheduledTime === time && 
      r.status !== 'cancelled'
    );
  }

  /**
   * 面談予約の検証
   */
  static validateReservation(reservation: Partial<UnifiedInterviewReservation>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // 必須フィールドのチェック
    const requiredFields = ['staffId', 'staffName', 'department', 'position', 'type', 'scheduledDate', 'scheduledTime'];
    requiredFields.forEach(field => {
      if (!reservation[field as keyof UnifiedInterviewReservation]) {
        errors.push(`${field} is required`);
      }
    });

    // タイプ別の追加検証
    if (reservation.type === 'regular' && !reservation.regularType) {
      errors.push('Regular type is required for regular interviews');
    }

    if (reservation.type === 'special' && !reservation.specialType) {
      errors.push('Special type is required for special interviews');
    }

    if (reservation.type === 'support' && !reservation.supportCategory) {
      errors.push('Support category is required for support interviews');
    }

    // 日付の妥当性チェック
    if (reservation.scheduledDate) {
      const scheduledDate = new Date(reservation.scheduledDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (scheduledDate < today) {
        errors.push('Scheduled date cannot be in the past');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}