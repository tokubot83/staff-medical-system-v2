/**
 * Staff Data Service with Error Handling
 * エラーハンドリングを統合した職員データサービスの例
 */

import { StorageFactory } from '@/lib/storage/StorageAdapter';
import { AppError, ErrorFactory } from '@/lib/error/AppError';
import { errorLogger } from '@/lib/error/ErrorLogger';
import { ApiErrorHandler } from '@/lib/error/ApiErrorHandler';
import { Staff, StaffFilter } from './staffDataService';

class StaffDataServiceWithError {
  private storage = StorageFactory.getAdapter();
  private cacheMap = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = 5 * 60 * 1000; // 5分のキャッシュ

  /**
   * 職員データを取得（エラーハンドリング付き）
   */
  async getStaff(staffId: string): Promise<Staff | null> {
    try {
      // キャッシュチェック
      const cached = this.getFromCache(`staff_${staffId}`);
      if (cached) return cached;

      const response = await this.storage.get<Staff>(`staff_${staffId}`);
      
      if (response.success && response.data) {
        this.setCache(`staff_${staffId}`, response.data);
        return response.data;
      }
      
      // データが見つからない場合
      throw ErrorFactory.notFoundError(`Staff with ID: ${staffId}`);
      
    } catch (error) {
      // AppErrorの場合はそのまま投げる
      if (error instanceof AppError) {
        throw error;
      }
      
      // ストレージエラーとして扱う
      const appError = ErrorFactory.storageError(
        error instanceof Error ? error.message : 'Failed to fetch staff data'
      );
      errorLogger.log(appError);
      throw appError;
    }
  }

  /**
   * 職員データを保存（エラーハンドリング付き）
   */
  async saveStaff(staff: Staff): Promise<boolean> {
    try {
      // バリデーション
      this.validateStaff(staff);
      
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
      
      throw ErrorFactory.storageError('Failed to save staff data');
      
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      
      const appError = new AppError({
        code: 'ERR_STAFF_SAVE',
        message: error instanceof Error ? error.message : 'Failed to save staff',
        userMessage: '職員データの保存に失敗しました',
        category: 'storage' as any,
        level: 'error' as any,
        retryable: true
      });
      
      errorLogger.log(appError);
      throw appError;
    }
  }

  /**
   * 外部APIから職員データを同期（エラーハンドリング付き）
   */
  async syncStaffFromApi(): Promise<Staff[]> {
    try {
      // ApiErrorHandlerを使用してAPI呼び出し
      const staffList = await ApiErrorHandler.get<Staff[]>(
        '/api/staff',
        {
          timeout: 10000,
          retry: {
            maxAttempts: 3,
            delay: 1000,
            backoff: true
          }
        }
      );
      
      // 取得したデータを保存
      for (const staff of staffList) {
        await this.saveStaff(staff);
      }
      
      return staffList;
      
    } catch (error) {
      // ApiErrorHandlerが既にAppErrorを投げているのでそのまま投げる
      if (error instanceof AppError) {
        throw error;
      }
      
      // 予期しないエラー
      const appError = new AppError({
        code: 'ERR_STAFF_SYNC',
        message: 'Failed to sync staff data from API',
        userMessage: '職員データの同期に失敗しました',
        category: 'api' as any,
        level: 'error' as any,
        retryable: true,
        hint: 'ネットワーク接続を確認してから再度お試しください'
      });
      
      errorLogger.log(appError);
      throw appError;
    }
  }

  /**
   * 職員データのバリデーション
   */
  private validateStaff(staff: Staff): void {
    const errors: string[] = [];
    
    if (!staff.id) {
      errors.push('IDは必須です');
    }
    
    if (!staff.name || staff.name.trim().length === 0) {
      errors.push('名前は必須です');
    }
    
    if (!staff.employeeNumber) {
      errors.push('職員番号は必須です');
    }
    
    if (staff.email && !this.isValidEmail(staff.email)) {
      errors.push('メールアドレスの形式が正しくありません');
    }
    
    if (errors.length > 0) {
      throw new AppError({
        code: 'ERR_VALIDATION',
        message: 'Staff validation failed',
        userMessage: errors.join('、'),
        category: 'validation' as any,
        level: 'warning' as any,
        details: { errors },
        retryable: false
      });
    }
  }

  /**
   * メールアドレスのバリデーション
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * キャッシュ管理
   */
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
export const staffDataServiceWithError = new StaffDataServiceWithError();