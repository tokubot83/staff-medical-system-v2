/**
 * useOfflineSupport Hook
 * オフライン機能を簡単に使用するためのカスタムフック
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseOfflineSupportOptions {
  enableCache?: boolean;
  cacheTTL?: number;
  autoSync?: boolean;
}

interface UseOfflineSupportReturn {
  isOnline: boolean;
  pendingCount: number;
  saveData: <T>(key: string, data: T) => Promise<void>;
  loadData: <T>(key: string) => Promise<T | null>;
  queueOperation: (operation: any) => Promise<void>;
  syncNow: () => Promise<void>;
  clearCache: () => Promise<void>;
  clearQueue: () => void;
}

/**
 * オフラインサポートフック
 */
export function useOfflineSupport(
  options: UseOfflineSupportOptions = {}
): UseOfflineSupportReturn {
  const {
    enableCache = true,
    cacheTTL = 24 * 60 * 60 * 1000, // 24時間
    autoSync = true
  } = options;

  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // 初期状態を設定
    setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  /**
   * データを保存（キャッシュとローカルストレージ）
   */
  const saveData = useCallback(async <T,>(key: string, data: T): Promise<void> => {
    try {
      if (enableCache) {
        localStorage.setItem(key, JSON.stringify({
          data,
          timestamp: Date.now(),
          ttl: cacheTTL
        }));
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }, [enableCache, cacheTTL]);

  /**
   * データを読み込み（キャッシュから優先）
   */
  const loadData = useCallback(async <T,>(key: string): Promise<T | null> => {
    try {
      if (enableCache) {
        const cached = localStorage.getItem(key);
        if (cached) {
          const { data, timestamp, ttl } = JSON.parse(cached);
          if (Date.now() - timestamp < ttl) {
            return data;
          } else {
            localStorage.removeItem(key);
          }
        }
      }
      return null;
    } catch (error) {
      console.error('Error loading data:', error);
      return null;
    }
  }, [enableCache]);

  /**
   * 操作をキューに追加
   */
  const queueOperation = useCallback(async (operation: any): Promise<void> => {
    try {
      const queue = JSON.parse(localStorage.getItem('offline_queue') || '[]');
      queue.push({
        ...operation,
        id: Date.now().toString(),
        timestamp: Date.now()
      });
      localStorage.setItem('offline_queue', JSON.stringify(queue));
      setPendingCount(queue.length);
    } catch (error) {
      console.error('Error queueing operation:', error);
    }
  }, []);

  /**
   * 今すぐ同期
   */
  const syncNow = useCallback(async (): Promise<void> => {
    try {
      const queue = JSON.parse(localStorage.getItem('offline_queue') || '[]');
      if (queue.length === 0) return;

      // 実際の同期処理はここに実装
      console.log(`Syncing ${queue.length} operations...`);
      
      // 同期後にキューをクリア
      localStorage.setItem('offline_queue', '[]');
      setPendingCount(0);
    } catch (error) {
      console.error('Error syncing:', error);
    }
  }, []);

  /**
   * キャッシュをクリア
   */
  const clearCache = useCallback(async (): Promise<void> => {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('cache_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }, []);

  /**
   * キューをクリア
   */
  const clearQueue = useCallback((): void => {
    localStorage.setItem('offline_queue', '[]');
    setPendingCount(0);
  }, []);

  return {
    isOnline,
    pendingCount,
    saveData,
    loadData,
    queueOperation,
    syncNow,
    clearCache,
    clearQueue
  };
}