/**
 * API Error Handler
 * API通信のエラー処理を統一的に管理
 */

import { AppError, ErrorFactory } from './AppError';
import { errorLogger } from './ErrorLogger';
import { ErrorLevel, ErrorCategory } from './ErrorTypes';

/**
 * APIレスポンスの基本型
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

/**
 * リトライ設定
 */
export interface RetryConfig {
  maxAttempts?: number;
  delay?: number;
  backoff?: boolean;
  retryableStatuses?: number[];
}

/**
 * API呼び出しオプション
 */
export interface ApiCallOptions extends RequestInit {
  timeout?: number;
  retry?: RetryConfig;
  skipErrorLog?: boolean;
}

/**
 * APIエラーハンドラークラス
 */
export class ApiErrorHandler {
  private static defaultRetryConfig: RetryConfig = {
    maxAttempts: 3,
    delay: 1000,
    backoff: true,
    retryableStatuses: [408, 429, 500, 502, 503, 504]
  };

  /**
   * fetch APIのラッパー（エラーハンドリング付き）
   */
  static async fetch<T = any>(
    url: string,
    options: ApiCallOptions = {}
  ): Promise<T> {
    const {
      timeout = 30000,
      retry = this.defaultRetryConfig,
      skipErrorLog = false,
      ...fetchOptions
    } = options;

    let lastError: AppError | null = null;
    const maxAttempts = retry.maxAttempts || 1;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        // タイムアウトを設定
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          ...fetchOptions,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        // レスポンスのステータスチェック
        if (!response.ok) {
          const error = await this.handleHttpError(response, url);
          
          // リトライ可能なエラーか確認
          if (
            retry.retryableStatuses?.includes(response.status) &&
            attempt < maxAttempts
          ) {
            lastError = error;
            await this.delay(retry.delay || 1000, attempt, retry.backoff);
            continue;
          }
          
          throw error;
        }

        // JSONレスポンスをパース
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const json = await response.json();
          
          // APIレスポンスの形式をチェック
          if (this.isApiResponse(json)) {
            if (!json.success && json.error) {
              throw new AppError({
                code: json.error.code,
                message: json.error.message,
                userMessage: json.error.message,
                level: ErrorLevel.ERROR,
                category: ErrorCategory.API,
                details: json.error.details
              });
            }
            return json.data as T;
          }
          
          return json as T;
        }

        // JSONでない場合はそのまま返す
        return response as any;

      } catch (error) {
        // AbortErrorの場合はタイムアウト
        if (error instanceof Error && error.name === 'AbortError') {
          lastError = ErrorFactory.timeoutError(url);
        } 
        // AppErrorの場合はそのまま
        else if (error instanceof AppError) {
          lastError = error;
        }
        // ネットワークエラー
        else if (error instanceof TypeError && error.message === 'Failed to fetch') {
          lastError = ErrorFactory.networkError();
        }
        // その他のエラー
        else {
          lastError = new AppError({
            code: 'ERR_API_UNKNOWN',
            message: error instanceof Error ? error.message : 'Unknown error',
            userMessage: 'API通信中にエラーが発生しました',
            level: ErrorLevel.ERROR,
            category: ErrorCategory.API
          });
        }

        // 最後の試行でない場合はリトライ
        if (attempt < maxAttempts && lastError.retryable) {
          await this.delay(retry.delay || 1000, attempt, retry.backoff);
          continue;
        }

        // エラーをログに記録
        if (!skipErrorLog) {
          errorLogger.log(lastError);
        }

        throw lastError;
      }
    }

    // すべてのリトライが失敗した場合
    if (lastError) {
      if (!skipErrorLog) {
        errorLogger.log(lastError);
      }
      throw lastError;
    }

    throw new Error('Unexpected error in API call');
  }

  /**
   * GET リクエスト
   */
  static async get<T = any>(url: string, options?: ApiCallOptions): Promise<T> {
    return this.fetch<T>(url, {
      ...options,
      method: 'GET'
    });
  }

  /**
   * POST リクエスト
   */
  static async post<T = any>(
    url: string,
    body?: any,
    options?: ApiCallOptions
  ): Promise<T> {
    return this.fetch<T>(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      body: body ? JSON.stringify(body) : undefined
    });
  }

  /**
   * PUT リクエスト
   */
  static async put<T = any>(
    url: string,
    body?: any,
    options?: ApiCallOptions
  ): Promise<T> {
    return this.fetch<T>(url, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      body: body ? JSON.stringify(body) : undefined
    });
  }

  /**
   * DELETE リクエスト
   */
  static async delete<T = any>(url: string, options?: ApiCallOptions): Promise<T> {
    return this.fetch<T>(url, {
      ...options,
      method: 'DELETE'
    });
  }

  /**
   * PATCH リクエスト
   */
  static async patch<T = any>(
    url: string,
    body?: any,
    options?: ApiCallOptions
  ): Promise<T> {
    return this.fetch<T>(url, {
      ...options,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      body: body ? JSON.stringify(body) : undefined
    });
  }

  // ==================== プライベートメソッド ====================

  /**
   * HTTPエラーを処理
   */
  private static async handleHttpError(response: Response, url: string): Promise<AppError> {
    let errorDetails: any = null;
    
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        errorDetails = await response.json();
      } else {
        errorDetails = await response.text();
      }
    } catch {
      // エラー詳細の取得に失敗
    }

    return ErrorFactory.apiError(
      response.status,
      `API request failed: ${response.statusText}`,
      {
        url,
        status: response.status,
        statusText: response.statusText,
        details: errorDetails
      }
    );
  }

  /**
   * APIレスポンスの型チェック
   */
  private static isApiResponse(data: any): data is ApiResponse {
    return (
      typeof data === 'object' &&
      data !== null &&
      'success' in data &&
      typeof data.success === 'boolean'
    );
  }

  /**
   * リトライ待機
   */
  private static async delay(
    baseDelay: number,
    attempt: number,
    backoff?: boolean
  ): Promise<void> {
    const delay = backoff ? baseDelay * Math.pow(2, attempt - 1) : baseDelay;
    return new Promise(resolve => setTimeout(resolve, delay));
  }
}

/**
 * データサービスで使用するためのヘルパー関数
 */
export async function handleApiCall<T>(
  apiCall: () => Promise<T>,
  errorMessage?: string
): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    const appError = new AppError({
      code: 'ERR_API_CALL',
      message: error instanceof Error ? error.message : 'API call failed',
      userMessage: errorMessage || 'データの取得に失敗しました',
      level: ErrorLevel.ERROR,
      category: ErrorCategory.API,
      retryable: true
    });

    errorLogger.log(appError);
    throw appError;
  }
}

/**
 * フォーム送信エラーのハンドリング
 */
export function handleFormError(error: any): {
  message: string;
  fields?: Record<string, string>;
} {
  if (error instanceof AppError) {
    // バリデーションエラーの場合
    if (error.category === ErrorCategory.VALIDATION && error.details?.field) {
      return {
        message: error.userMessage || 'フォームにエラーがあります',
        fields: {
          [error.details.field]: error.userMessage || ''
        }
      };
    }
    
    return {
      message: error.userMessage || 'エラーが発生しました'
    };
  }

  return {
    message: 'フォームの送信に失敗しました'
  };
}