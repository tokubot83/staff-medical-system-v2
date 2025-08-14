/**
 * Offline Manager
 * オフライン機能の管理とバックグラウンド同期
 */

import { errorLogger } from '@/lib/error/ErrorLogger';
import { AppError } from '@/lib/error/AppError';
import { ErrorLevel, ErrorCategory } from '@/lib/error/ErrorTypes';

/**
 * オフラインキューのアイテム
 */
interface QueueItem {
  id: string;
  timestamp: number;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  endpoint: string;
  method: string;
  data: any;
  retryCount: number;
  maxRetries: number;
}

/**
 * オフラインマネージャークラス
 */
export class OfflineManager {
  private static instance: OfflineManager;
  private isOnline: boolean = navigator.onLine;
  private syncQueue: QueueItem[] = [];
  private listeners: ((isOnline: boolean) => void)[] = [];
  private syncInProgress = false;
  private readonly QUEUE_KEY = 'offline_sync_queue';
  private readonly MAX_RETRIES = 3;
  private readonly SYNC_INTERVAL = 30000; // 30秒
  private syncTimer: NodeJS.Timeout | null = null;

  private constructor() {
    this.initialize();
  }

  static getInstance(): OfflineManager {
    if (!OfflineManager.instance) {
      OfflineManager.instance = new OfflineManager();
    }
    return OfflineManager.instance;
  }

  /**
   * 初期化
   */
  private initialize() {
    // オンライン/オフラインイベントのリスナー設定
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));

    // Service Worker のメッセージリスナー
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', this.handleServiceWorkerMessage.bind(this));
    }

    // 保存済みキューの読み込み
    this.loadQueueFromStorage();

    // 定期同期の開始
    this.startPeriodicSync();

    // 初回同期の試行
    if (this.isOnline) {
      this.syncWithServer();
    }
  }

  /**
   * オンライン状態の取得
   */
  getOnlineStatus(): boolean {
    return this.isOnline;
  }

  /**
   * オンライン状態変更のリスナー登録
   */
  subscribeToStatusChange(listener: (isOnline: boolean) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * データをキューに追加
   */
  async queueOperation(operation: {
    type: 'CREATE' | 'UPDATE' | 'DELETE';
    endpoint: string;
    method?: string;
    data?: any;
  }): Promise<void> {
    const queueItem: QueueItem = {
      id: this.generateId(),
      timestamp: Date.now(),
      type: operation.type,
      endpoint: operation.endpoint,
      method: operation.method || this.getDefaultMethod(operation.type),
      data: operation.data,
      retryCount: 0,
      maxRetries: this.MAX_RETRIES
    };

    this.syncQueue.push(queueItem);
    this.saveQueueToStorage();

    // オンラインの場合は即座に同期を試行
    if (this.isOnline) {
      this.syncWithServer();
    }
  }

  /**
   * 保留中の操作数を取得
   */
  getPendingOperationsCount(): number {
    return this.syncQueue.length;
  }

  /**
   * 保留中の操作を取得
   */
  getPendingOperations(): QueueItem[] {
    return [...this.syncQueue];
  }

  /**
   * 特定の操作をキューから削除
   */
  removeFromQueue(id: string): void {
    this.syncQueue = this.syncQueue.filter(item => item.id !== id);
    this.saveQueueToStorage();
  }

  /**
   * キューをクリア
   */
  clearQueue(): void {
    this.syncQueue = [];
    this.saveQueueToStorage();
  }

  /**
   * サーバーとの同期
   */
  async syncWithServer(): Promise<void> {
    if (!this.isOnline || this.syncInProgress || this.syncQueue.length === 0) {
      return;
    }

    this.syncInProgress = true;
    const itemsToSync = [...this.syncQueue];
    const successfulIds: string[] = [];
    const failedItems: QueueItem[] = [];

    for (const item of itemsToSync) {
      try {
        await this.processSyncItem(item);
        successfulIds.push(item.id);
      } catch (error) {
        console.error(`Failed to sync item ${item.id}:`, error);
        
        item.retryCount++;
        if (item.retryCount < item.maxRetries) {
          failedItems.push(item);
        } else {
          // 最大リトライ数を超えた場合はエラーログに記録
          errorLogger.log(new AppError({
            code: 'ERR_SYNC_FAILED',
            message: `Failed to sync operation after ${item.maxRetries} retries`,
            userMessage: '同期に失敗した操作があります',
            level: ErrorLevel.ERROR,
            category: ErrorCategory.NETWORK,
            details: item
          }));
        }
      }
    }

    // 成功したアイテムを削除
    this.syncQueue = this.syncQueue.filter(
      item => !successfulIds.includes(item.id)
    );

    // 失敗したアイテムを更新
    failedItems.forEach(failedItem => {
      const index = this.syncQueue.findIndex(item => item.id === failedItem.id);
      if (index !== -1) {
        this.syncQueue[index] = failedItem;
      }
    });

    this.saveQueueToStorage();
    this.syncInProgress = false;

    // 同期完了を通知
    this.notifySyncComplete(successfulIds.length, failedItems.length);
  }

  /**
   * バックグラウンド同期の登録
   */
  async registerBackgroundSync(tag: string = 'data-sync'): Promise<void> {
    if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await (registration as any).sync.register(tag);
        console.log('Background sync registered:', tag);
      } catch (error) {
        console.error('Background sync registration failed:', error);
      }
    }
  }

  // ==================== プライベートメソッド ====================

  private handleOnline() {
    this.isOnline = true;
    this.notifyListeners(true);
    console.log('Application is online');
    
    // オンラインになったら同期を開始
    this.syncWithServer();
    this.registerBackgroundSync();
  }

  private handleOffline() {
    this.isOnline = false;
    this.notifyListeners(false);
    console.log('Application is offline');
  }

  private handleServiceWorkerMessage(event: MessageEvent) {
    if (event.data && event.data.type === 'SYNC_COMPLETE') {
      // Service Workerからの同期完了通知
      this.loadQueueFromStorage();
    }
  }

  private notifyListeners(isOnline: boolean) {
    this.listeners.forEach(listener => {
      try {
        listener(isOnline);
      } catch (error) {
        console.error('Error in offline status listener:', error);
      }
    });
  }

  private async processSyncItem(item: QueueItem): Promise<void> {
    const response = await fetch(item.endpoint, {
      method: item.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: item.data ? JSON.stringify(item.data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  private getDefaultMethod(type: 'CREATE' | 'UPDATE' | 'DELETE'): string {
    switch (type) {
      case 'CREATE': return 'POST';
      case 'UPDATE': return 'PUT';
      case 'DELETE': return 'DELETE';
      default: return 'POST';
    }
  }

  private loadQueueFromStorage() {
    try {
      const stored = localStorage.getItem(this.QUEUE_KEY);
      if (stored) {
        this.syncQueue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load sync queue from storage:', error);
    }
  }

  private saveQueueToStorage() {
    try {
      localStorage.setItem(this.QUEUE_KEY, JSON.stringify(this.syncQueue));
    } catch (error) {
      console.error('Failed to save sync queue to storage:', error);
    }
  }

  private generateId(): string {
    return `sync_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  private startPeriodicSync() {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }

    this.syncTimer = setInterval(() => {
      if (this.isOnline) {
        this.syncWithServer();
      }
    }, this.SYNC_INTERVAL);
  }

  private notifySyncComplete(successCount: number, failedCount: number) {
    if (successCount > 0 || failedCount > 0) {
      const message = `同期完了: ${successCount}件成功${failedCount > 0 ? `, ${failedCount}件失敗` : ''}`;
      console.log(message);
      
      // カスタムイベントを発行
      window.dispatchEvent(new CustomEvent('syncComplete', {
        detail: { successCount, failedCount }
      }));
    }
  }

  /**
   * クリーンアップ
   */
  destroy() {
    window.removeEventListener('online', this.handleOnline.bind(this));
    window.removeEventListener('offline', this.handleOffline.bind(this));
    
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }
    
    this.listeners = [];
  }
}

// シングルトンインスタンスをエクスポート
export const offlineManager = OfflineManager.getInstance();