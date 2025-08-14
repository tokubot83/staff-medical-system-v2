/**
 * Error Logger
 * エラーログの記録と管理
 */

import { AppError } from './AppError';
import { ErrorLogEntry, ErrorLevel } from './ErrorTypes';

export class ErrorLogger {
  private static instance: ErrorLogger;
  private logs: ErrorLogEntry[] = [];
  private maxLogs = 100; // メモリ上に保持する最大ログ数
  private listeners: ((error: AppError) => void)[] = [];

  private constructor() {
    // シングルトン
  }

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  /**
   * エラーをログに記録
   */
  log(error: AppError): string {
    const id = this.generateErrorId();
    error.id = id;

    const entry: ErrorLogEntry = {
      id,
      error: error.toJSON(),
      context: this.captureContext(),
      resolved: false
    };

    // メモリに保存
    this.addToMemory(entry);

    // ローカルストレージに保存（重要なエラーのみ）
    if (error.level === ErrorLevel.ERROR || error.level === ErrorLevel.CRITICAL) {
      this.saveToLocalStorage(entry);
    }

    // コンソールに出力（開発環境）
    if (process.env.NODE_ENV === 'development') {
      this.logToConsole(error);
    }

    // リスナーに通知
    this.notifyListeners(error);

    // 本番環境では外部サービスに送信（将来実装）
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalService(entry);
    }

    return id;
  }

  /**
   * エラーリスナーを登録
   */
  subscribe(listener: (error: AppError) => void): () => void {
    this.listeners.push(listener);
    
    // アンサブスクライブ関数を返す
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * 特定のエラーを解決済みにマーク
   */
  markAsResolved(errorId: string, notes?: string): void {
    const entry = this.logs.find(log => log.id === errorId);
    if (entry) {
      entry.resolved = true;
      entry.resolvedAt = new Date();
      entry.notes = notes;
      this.updateInLocalStorage(entry);
    }
  }

  /**
   * ログを取得
   */
  getLogs(filter?: {
    level?: ErrorLevel;
    category?: string;
    resolved?: boolean;
    limit?: number;
  }): ErrorLogEntry[] {
    let logs = [...this.logs];

    if (filter) {
      if (filter.level) {
        logs = logs.filter(log => log.error.level === filter.level);
      }
      if (filter.category) {
        logs = logs.filter(log => log.error.category === filter.category);
      }
      if (filter.resolved !== undefined) {
        logs = logs.filter(log => log.resolved === filter.resolved);
      }
      if (filter.limit) {
        logs = logs.slice(0, filter.limit);
      }
    }

    return logs;
  }

  /**
   * 特定のエラーログを取得
   */
  getLog(errorId: string): ErrorLogEntry | undefined {
    return this.logs.find(log => log.id === errorId);
  }

  /**
   * ログをクリア
   */
  clearLogs(): void {
    this.logs = [];
    this.clearLocalStorage();
  }

  /**
   * エラー統計を取得
   */
  getStatistics(): {
    total: number;
    byLevel: Record<string, number>;
    byCategory: Record<string, number>;
    resolved: number;
    unresolved: number;
  } {
    const stats = {
      total: this.logs.length,
      byLevel: {} as Record<string, number>,
      byCategory: {} as Record<string, number>,
      resolved: 0,
      unresolved: 0
    };

    this.logs.forEach(log => {
      // レベル別
      stats.byLevel[log.error.level] = (stats.byLevel[log.error.level] || 0) + 1;
      
      // カテゴリ別
      stats.byCategory[log.error.category] = (stats.byCategory[log.error.category] || 0) + 1;
      
      // 解決状況
      if (log.resolved) {
        stats.resolved++;
      } else {
        stats.unresolved++;
      }
    });

    return stats;
  }

  // ==================== プライベートメソッド ====================

  private generateErrorId(): string {
    return `ERR_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  private captureContext(): ErrorLogEntry['context'] {
    if (typeof window === 'undefined') return undefined;

    return {
      url: window.location.href,
      userAgent: navigator.userAgent,
      // その他のコンテキスト情報を追加可能
    };
  }

  private addToMemory(entry: ErrorLogEntry): void {
    this.logs.unshift(entry);
    
    // 最大数を超えたら古いログを削除
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }
  }

  private saveToLocalStorage(entry: ErrorLogEntry): void {
    try {
      const key = `error_log_${entry.id}`;
      localStorage.setItem(key, JSON.stringify(entry));
      
      // 古いログを削除（30日以上前）
      this.cleanOldLogsFromLocalStorage();
    } catch (error) {
      console.error('Failed to save error log to localStorage:', error);
    }
  }

  private updateInLocalStorage(entry: ErrorLogEntry): void {
    try {
      const key = `error_log_${entry.id}`;
      localStorage.setItem(key, JSON.stringify(entry));
    } catch (error) {
      console.error('Failed to update error log in localStorage:', error);
    }
  }

  private clearLocalStorage(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('error_log_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Failed to clear error logs from localStorage:', error);
    }
  }

  private cleanOldLogsFromLocalStorage(): void {
    try {
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      const keys = Object.keys(localStorage);
      
      keys.forEach(key => {
        if (key.startsWith('error_log_')) {
          const log = JSON.parse(localStorage.getItem(key) || '{}');
          if (log.error && new Date(log.error.timestamp).getTime() < thirtyDaysAgo) {
            localStorage.removeItem(key);
          }
        }
      });
    } catch (error) {
      console.error('Failed to clean old logs from localStorage:', error);
    }
  }

  private logToConsole(error: AppError): void {
    const style = this.getConsoleStyle(error.level);
    
    console.group(`%c[${error.level.toUpperCase()}] ${error.code}`, style);
    console.log('Message:', error.message);
    console.log('User Message:', error.userMessage);
    console.log('Category:', error.category);
    
    if (error.details) {
      console.log('Details:', error.details);
    }
    
    if (error.hint) {
      console.log('Hint:', error.hint);
    }
    
    if (error.stack) {
      console.log('Stack:', error.stack);
    }
    
    console.groupEnd();
  }

  private getConsoleStyle(level: ErrorLevel): string {
    switch (level) {
      case ErrorLevel.INFO:
        return 'color: #3b82f6; font-weight: bold;';
      case ErrorLevel.WARNING:
        return 'color: #f59e0b; font-weight: bold;';
      case ErrorLevel.ERROR:
        return 'color: #ef4444; font-weight: bold;';
      case ErrorLevel.CRITICAL:
        return 'color: #dc2626; font-weight: bold; font-size: 14px;';
      default:
        return 'color: #6b7280;';
    }
  }

  private notifyListeners(error: AppError): void {
    this.listeners.forEach(listener => {
      try {
        listener(error);
      } catch (err) {
        console.error('Error in error listener:', err);
      }
    });
  }

  private sendToExternalService(entry: ErrorLogEntry): void {
    // 将来実装: Sentry、LogRocket、DataDogなどへの送信
    // 現時点ではコンソールに出力のみ
    if (entry.error.level === ErrorLevel.CRITICAL) {
      console.error('Critical error occurred:', entry);
    }
  }
}

// シングルトンインスタンスをエクスポート
export const errorLogger = ErrorLogger.getInstance();