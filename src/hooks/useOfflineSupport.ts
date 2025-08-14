/**
 * useOfflineSupport Hook
 * オフライン機能を簡単に使用するためのカスタムフック
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { offlineManager } from '@/lib/offline/OfflineManager';
import { offlineCache } from '@/lib/offline/OfflineCache';
import { useErrorHandler } from '@/hooks/useErrorHandler';

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
  const { handleError } = useErrorHandler();

  useEffect(() => {
    // 初期状態を設定
    setIsOnline(offlineManager.getOnlineStatus());
    setPendingCount(offlineManager.getPendingOperationsCount());

    // オンライン状態の監視
    const unsubscribe = offlineManager.subscribeToStatusChange((online) => {
      setIsOnline(online);
      
      if (online && autoSync) {
        // オンラインに復帰したら自動同期
        offlineManager.syncWithServer();
      }
    });

    // 同期完了イベントの監視
    const handleSyncComplete = () => {
      setPendingCount(offlineManager.getPendingOperationsCount());
    };

    window.addEventListener('syncComplete', handleSyncComplete);

    return () => {
      unsubscribe();
      window.removeEventListener('syncComplete', handleSyncComplete);
    };
  }, [autoSync]);

  /**
   * データを保存（キャッシュとローカルストレージ）
   */
  const saveData = useCallback(async <T,>(key: string, data: T): Promise<void> => {
    try {
      if (enableCache) {
        await offlineCache.set(key, data, { ttl: cacheTTL });
      }
      
      // オフライン時はキューに追加
      if (!isOnline) {
        await offlineManager.queueOperation({
          type: 'UPDATE',
          endpoint: `/api/data/${key}`,
          data
        });
        setPendingCount(offlineManager.getPendingOperationsCount());
      }
    } catch (error) {
      handleError(error);
    }
  }, [enableCache, cacheTTL, isOnline, handleError]);

  /**
   * データを読み込み（キャッシュから優先）
   */
  const loadData = useCallback(async <T,>(key: string): Promise<T | null> => {
    try {
      if (enableCache) {
        // キャッシュから取得を試行
        const cached = await offlineCache.get<T>(key);
        if (cached) {
          return cached;
        }
      }

      // オンラインの場合はAPIから取得を試行
      if (isOnline) {
        // ここでAPIからデータを取得する処理を実装
        // 今回は例として null を返す
        return null;
      }

      return null;
    } catch (error) {
      handleError(error);
      return null;
    }
  }, [enableCache, isOnline, handleError]);

  /**
   * 操作をキューに追加
   */
  const queueOperation = useCallback(async (operation: any): Promise<void> => {
    try {
      await offlineManager.queueOperation(operation);
      setPendingCount(offlineManager.getPendingOperationsCount());
    } catch (error) {
      handleError(error);
    }
  }, [handleError]);

  /**
   * 今すぐ同期
   */
  const syncNow = useCallback(async (): Promise<void> => {
    try {
      await offlineManager.syncWithServer();
      setPendingCount(offlineManager.getPendingOperationsCount());
    } catch (error) {
      handleError(error);
    }
  }, [handleError]);

  /**
   * キャッシュをクリア
   */
  const clearCache = useCallback(async (): Promise<void> => {
    try {
      await offlineCache.clear();
    } catch (error) {
      handleError(error);
    }
  }, [handleError]);

  /**
   * キューをクリア
   */
  const clearQueue = useCallback((): void => {
    try {
      offlineManager.clearQueue();
      setPendingCount(0);
    } catch (error) {
      handleError(error);
    }
  }, [handleError]);

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

/**
 * オフライン対応のデータフェッチフック
 */
export function useOfflineFetch<T>(
  url: string,
  options?: {
    cacheKey?: string;
    cacheTTL?: number;
    forceRefresh?: boolean;
  }
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { isOnline } = useOfflineSupport();

  const cacheKey = options?.cacheKey || url;
  const cacheTTL = options?.cacheTTL || 60 * 60 * 1000; // 1時間
  const forceRefresh = options?.forceRefresh || false;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // キャッシュから取得を試行
        if (!forceRefresh) {
          const cached = await offlineCache.get<T>(cacheKey);
          if (cached) {
            setData(cached);
            setLoading(false);
            
            // バックグラウンドで更新（オンラインの場合）
            if (isOnline) {
              fetch(url)
                .then(res => res.json())
                .then(async (freshData) => {
                  await offlineCache.set(cacheKey, freshData, { ttl: cacheTTL });
                  setData(freshData);
                })
                .catch(console.error);
            }
            return;
          }
        }

        // オンラインの場合はフェッチ
        if (isOnline) {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const result = await response.json();
          
          // キャッシュに保存
          await offlineCache.set(cacheKey, result, { ttl: cacheTTL });
          setData(result);
        } else {
          // オフラインでキャッシュもない場合
          setError(new Error('オフラインです。データを取得できません。'));
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, cacheKey, cacheTTL, forceRefresh, isOnline]);

  return { data, loading, error, isOnline };
}

/**
 * オフライン対応のミューテーションフック
 */
export function useOfflineMutation<T, R = any>(
  mutationFn: (data: T) => Promise<R>,
  options?: {
    onSuccess?: (data: R) => void;
    onError?: (error: Error) => void;
    optimisticUpdate?: boolean;
  }
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { isOnline, queueOperation } = useOfflineSupport();
  const { handleError } = useErrorHandler();

  const mutate = useCallback(async (data: T): Promise<R | null> => {
    setLoading(true);
    setError(null);

    try {
      if (isOnline) {
        // オンラインの場合は直接実行
        const result = await mutationFn(data);
        options?.onSuccess?.(result);
        return result;
      } else {
        // オフラインの場合はキューに追加
        await queueOperation({
          type: 'CREATE',
          endpoint: '/api/mutation',
          data
        });

        // 楽観的更新
        if (options?.optimisticUpdate) {
          const optimisticResult = { success: true, data } as unknown as R;
          options?.onSuccess?.(optimisticResult);
          return optimisticResult;
        }

        return null;
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      options?.onError?.(error);
      handleError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isOnline, mutationFn, queueOperation, options, handleError]);

  return {
    mutate,
    loading,
    error,
    isOnline
  };
}