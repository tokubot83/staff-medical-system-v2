/**
 * Storage Configuration
 * データ永続化の設定ファイル
 * LocalStorageとAPIを環境変数で切り替え可能
 */

import { StorageConfig, StorageFactory } from '@/lib/storage/StorageAdapter';

// 環境変数から設定を読み込み
const STORAGE_TYPE = process.env.NEXT_PUBLIC_STORAGE_TYPE || 'localStorage';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/storage';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

/**
 * ストレージ設定
 * 
 * 使用方法:
 * 1. LocalStorage使用時（デフォルト）
 *    NEXT_PUBLIC_STORAGE_TYPE=localStorage
 * 
 * 2. API使用時（バックエンド連携）
 *    NEXT_PUBLIC_STORAGE_TYPE=api
 *    NEXT_PUBLIC_API_BASE_URL=https://api.example.com/storage
 *    NEXT_PUBLIC_API_KEY=your-api-key
 */
export const storageConfig: StorageConfig = {
  type: STORAGE_TYPE as 'localStorage' | 'api',
  apiBaseUrl: API_BASE_URL,
  apiKey: API_KEY,
};

/**
 * ストレージの初期化
 * アプリケーション起動時に実行
 */
export function initializeStorage(): void {
  StorageFactory.configure(storageConfig);
  
  // 開発環境では設定をログ出力
  if (process.env.NODE_ENV === 'development') {
    console.log('Storage Configuration:', {
      type: storageConfig.type,
      apiBaseUrl: storageConfig.type === 'api' ? storageConfig.apiBaseUrl : 'N/A',
      hasApiKey: !!storageConfig.apiKey
    });
  }
}

/**
 * ストレージタイプの動的変更
 * テストやデモ用
 */
export function switchStorageType(type: 'localStorage' | 'api', apiConfig?: {
  apiBaseUrl?: string;
  apiKey?: string;
}): void {
  const newConfig: StorageConfig = {
    type,
    apiBaseUrl: apiConfig?.apiBaseUrl || API_BASE_URL,
    apiKey: apiConfig?.apiKey || API_KEY,
  };
  
  StorageFactory.configure(newConfig);
  
  if (process.env.NODE_ENV === 'development') {
    console.log('Storage type switched to:', type);
  }
}

/**
 * 現在のストレージタイプを取得
 */
export function getCurrentStorageType(): 'localStorage' | 'api' {
  return storageConfig.type;
}

/**
 * ストレージのヘルスチェック
 * バックエンド接続確認用
 */
export async function checkStorageHealth(): Promise<{
  type: string;
  status: 'healthy' | 'unhealthy';
  message?: string;
}> {
  const storage = StorageFactory.getAdapter();
  
  try {
    // テスト用のキーで読み書きを試みる
    const testKey = '__health_check__';
    const testValue = { timestamp: Date.now() };
    
    await storage.set(testKey, testValue);
    const result = await storage.get(testKey);
    await storage.delete(testKey);
    
    if (result.success) {
      return {
        type: storageConfig.type,
        status: 'healthy',
        message: 'Storage is working correctly'
      };
    } else {
      return {
        type: storageConfig.type,
        status: 'unhealthy',
        message: result.error?.message || 'Unknown error'
      };
    }
  } catch (error) {
    return {
      type: storageConfig.type,
      status: 'unhealthy',
      message: error instanceof Error ? error.message : 'Health check failed'
    };
  }
}

/**
 * データ移行ヘルパー
 * LocalStorageからAPIへのデータ移行用
 */
export async function migrateDataToApi(): Promise<{
  success: boolean;
  migrated: number;
  failed: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let migrated = 0;
  let failed = 0;
  
  try {
    // 一時的にLocalStorageに切り替え
    switchStorageType('localStorage');
    const localStorage = StorageFactory.getAdapter();
    
    // 全データを取得
    const staffData = await localStorage.list('staff_');
    const interviewData = await localStorage.list('interview_');
    const evaluationData = await localStorage.list('evaluation_');
    
    // APIに切り替え
    switchStorageType('api');
    const apiStorage = StorageFactory.getAdapter();
    
    // データを移行
    const allData = [
      ...(staffData.data || []),
      ...(interviewData.data || []),
      ...(evaluationData.data || [])
    ];
    
    for (const item of allData) {
      try {
        const key = (item as any).id || `migrated_${Date.now()}_${Math.random()}`;
        const result = await apiStorage.set(key, item);
        
        if (result.success) {
          migrated++;
        } else {
          failed++;
          errors.push(`Failed to migrate ${key}: ${result.error?.message}`);
        }
      } catch (error) {
        failed++;
        errors.push(`Migration error: ${error instanceof Error ? error.message : 'Unknown'}`);
      }
    }
    
    return {
      success: failed === 0,
      migrated,
      failed,
      errors
    };
  } catch (error) {
    return {
      success: false,
      migrated,
      failed,
      errors: [...errors, `Fatal error: ${error instanceof Error ? error.message : 'Unknown'}`]
    };
  }
}

// アプリケーション起動時に自動初期化
if (typeof window !== 'undefined') {
  initializeStorage();
}