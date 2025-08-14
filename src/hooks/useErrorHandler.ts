/**
 * useErrorHandler Hook
 * コンポーネントでエラーハンドリングを簡単に使用するためのカスタムフック
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { AppError, ErrorFactory } from '@/lib/error/AppError';
import { errorLogger } from '@/lib/error/ErrorLogger';
import { getErrorMessage } from '@/lib/error/ErrorMessages';
import { toast } from 'sonner'; // Toast通知用（インストールが必要な場合は別のUIライブラリを使用）

/**
 * エラーハンドリングフックのオプション
 */
interface UseErrorHandlerOptions {
  // エラーをログに記録するか
  logError?: boolean;
  // ユーザーに通知を表示するか
  showNotification?: boolean;
  // カスタムエラーハンドラー
  onError?: (error: AppError) => void;
}

/**
 * エラーハンドリングカスタムフック
 */
export function useErrorHandler(options: UseErrorHandlerOptions = {}) {
  const {
    logError = true,
    showNotification = true,
    onError
  } = options;

  const [error, setError] = useState<AppError | null>(null);
  const [isError, setIsError] = useState(false);

  /**
   * エラーを処理
   */
  const handleError = useCallback((error: unknown) => {
    let appError: AppError;

    // AppErrorインスタンスの場合
    if (error instanceof AppError) {
      appError = error;
    }
    // 通常のErrorの場合
    else if (error instanceof Error) {
      appError = new AppError({
        code: 'ERR_UNKNOWN',
        message: error.message,
        userMessage: 'エラーが発生しました'
      });
    }
    // その他の場合
    else {
      appError = new AppError({
        code: 'ERR_UNKNOWN',
        message: String(error),
        userMessage: 'エラーが発生しました'
      });
    }

    // エラーをステートに設定
    setError(appError);
    setIsError(true);

    // ログに記録
    if (logError) {
      errorLogger.log(appError);
    }

    // 通知を表示
    if (showNotification) {
      showErrorNotification(appError);
    }

    // カスタムハンドラーを実行
    if (onError) {
      onError(appError);
    }
  }, [logError, showNotification, onError]);

  /**
   * エラーをクリア
   */
  const clearError = useCallback(() => {
    setError(null);
    setIsError(false);
  }, []);

  /**
   * リトライ機能付きの非同期処理実行
   */
  const executeWithErrorHandling = useCallback(async <T,>(
    asyncFn: () => Promise<T>,
    options?: {
      retryCount?: number;
      retryDelay?: number;
      fallbackValue?: T;
    }
  ): Promise<T | undefined> => {
    const { retryCount = 0, retryDelay = 1000, fallbackValue } = options || {};
    
    let lastError: unknown;
    
    for (let attempt = 0; attempt <= retryCount; attempt++) {
      try {
        clearError();
        const result = await asyncFn();
        return result;
      } catch (error) {
        lastError = error;
        
        if (attempt < retryCount) {
          // リトライまで待機
          await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
        }
      }
    }
    
    // すべてのリトライが失敗
    handleError(lastError);
    return fallbackValue;
  }, [handleError, clearError]);

  return {
    error,
    isError,
    handleError,
    clearError,
    executeWithErrorHandling
  };
}

/**
 * エラー通知を表示（Toast通知を想定）
 */
function showErrorNotification(error: AppError) {
  const errorMessage = getErrorMessage(error.code);
  
  // Toast通知ライブラリを使用する場合
  // toast.error(errorMessage.message, {
  //   description: errorMessage.hint
  // });
  
  // 代替: console.errorで出力
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${error.code}] ${errorMessage.message}`, errorMessage.hint);
  }
}

/**
 * 非同期処理のエラーハンドリング用ユーティリティ
 */
export function useAsyncError() {
  const [error, setError] = useState<AppError | null>(null);
  const [loading, setLoading] = useState(false);

  const execute = useCallback(async <T,>(
    asyncFn: () => Promise<T>
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await asyncFn();
      return result;
    } catch (err) {
      const appError = err instanceof AppError 
        ? err 
        : ErrorFactory.apiError(500, err instanceof Error ? err.message : 'Unknown error');
      
      setError(appError);
      errorLogger.log(appError);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    error,
    loading,
    execute,
    clearError: () => setError(null)
  };
}

/**
 * フォームバリデーションエラー用フック
 */
export function useFormError() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setFieldError = useCallback((field: string, message: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: message
    }));
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  const hasErrors = Object.keys(errors).length > 0;

  return {
    errors,
    hasErrors,
    setFieldError,
    clearFieldError,
    clearAllErrors
  };
}