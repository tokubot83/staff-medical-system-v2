/**
 * カスタムエラークラス
 * アプリケーション全体で使用する統一エラークラス
 */

import { AppError as IAppError, ErrorLevel, ErrorCategory } from './ErrorTypes';

export class AppError extends Error implements IAppError {
  id?: string;
  code: string;
  userMessage?: string;
  level: ErrorLevel;
  category: ErrorCategory;
  statusCode?: number;
  details?: any;
  timestamp: Date;
  source?: string;
  userId?: string;
  retryable?: boolean;
  hint?: string;

  constructor(params: {
    code: string;
    message: string;
    userMessage?: string;
    level?: ErrorLevel;
    category?: ErrorCategory;
    statusCode?: number;
    details?: any;
    source?: string;
    retryable?: boolean;
    hint?: string;
  }) {
    super(params.message);
    
    this.name = 'AppError';
    this.code = params.code;
    this.userMessage = params.userMessage || 'エラーが発生しました';
    this.level = params.level || ErrorLevel.ERROR;
    this.category = params.category || ErrorCategory.UNKNOWN;
    this.statusCode = params.statusCode;
    this.details = params.details;
    this.source = params.source;
    this.retryable = params.retryable || false;
    this.hint = params.hint;
    this.timestamp = new Date();
    
    // スタックトレースを保持
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  /**
   * エラーをJSON形式に変換
   */
  toJSON(): IAppError {
    return {
      id: this.id,
      code: this.code,
      message: this.message,
      userMessage: this.userMessage,
      level: this.level,
      category: this.category,
      statusCode: this.statusCode,
      details: this.details,
      stack: this.stack,
      timestamp: this.timestamp,
      source: this.source,
      userId: this.userId,
      retryable: this.retryable,
      hint: this.hint
    };
  }

  /**
   * ユーザー向けの安全なエラー情報を取得
   */
  toUserFriendly(): {
    message: string;
    code?: string;
    hint?: string;
    retryable?: boolean;
  } {
    return {
      message: this.userMessage || 'エラーが発生しました',
      code: this.code,
      hint: this.hint,
      retryable: this.retryable
    };
  }
}

/**
 * よく使うエラーのファクトリーメソッド
 */
export class ErrorFactory {
  /**
   * ネットワークエラー
   */
  static networkError(message?: string, retryable = true): AppError {
    return new AppError({
      code: 'ERR_NETWORK',
      message: message || 'Network error occurred',
      userMessage: 'ネットワークエラーが発生しました。接続を確認してください。',
      level: ErrorLevel.ERROR,
      category: ErrorCategory.NETWORK,
      retryable,
      hint: 'インターネット接続を確認してから、もう一度お試しください。'
    });
  }

  /**
   * API エラー
   */
  static apiError(statusCode: number, message?: string, details?: any): AppError {
    const userMessages: { [key: number]: string } = {
      400: '入力内容に誤りがあります。',
      401: 'ログインが必要です。',
      403: 'アクセス権限がありません。',
      404: '要求されたデータが見つかりません。',
      409: 'データの競合が発生しました。',
      500: 'サーバーエラーが発生しました。',
      502: 'サーバーが一時的に利用できません。',
      503: 'サービスが一時的に利用できません。'
    };

    return new AppError({
      code: `ERR_API_${statusCode}`,
      message: message || `API error: ${statusCode}`,
      userMessage: userMessages[statusCode] || 'エラーが発生しました。',
      level: statusCode >= 500 ? ErrorLevel.CRITICAL : ErrorLevel.ERROR,
      category: ErrorCategory.API,
      statusCode,
      details,
      retryable: statusCode >= 500 || statusCode === 408 || statusCode === 429
    });
  }

  /**
   * バリデーションエラー
   */
  static validationError(field: string, message: string, value?: any): AppError {
    return new AppError({
      code: 'ERR_VALIDATION',
      message: `Validation failed for field: ${field}`,
      userMessage: message,
      level: ErrorLevel.WARNING,
      category: ErrorCategory.VALIDATION,
      statusCode: 400,
      details: { field, value },
      retryable: false
    });
  }

  /**
   * 認証エラー
   */
  static authError(message?: string): AppError {
    return new AppError({
      code: 'ERR_AUTH',
      message: message || 'Authentication failed',
      userMessage: 'ログインが必要です。',
      level: ErrorLevel.WARNING,
      category: ErrorCategory.AUTH,
      statusCode: 401,
      retryable: false,
      hint: 'ログイン画面からログインしてください。'
    });
  }

  /**
   * 権限エラー
   */
  static permissionError(resource?: string): AppError {
    return new AppError({
      code: 'ERR_PERMISSION',
      message: `Permission denied for resource: ${resource}`,
      userMessage: 'この操作を実行する権限がありません。',
      level: ErrorLevel.WARNING,
      category: ErrorCategory.PERMISSION,
      statusCode: 403,
      retryable: false,
      hint: '必要な権限については管理者にお問い合わせください。'
    });
  }

  /**
   * データが見つからないエラー
   */
  static notFoundError(resource?: string): AppError {
    return new AppError({
      code: 'ERR_NOT_FOUND',
      message: `Resource not found: ${resource}`,
      userMessage: '要求されたデータが見つかりません。',
      level: ErrorLevel.WARNING,
      category: ErrorCategory.NOT_FOUND,
      statusCode: 404,
      retryable: false
    });
  }

  /**
   * タイムアウトエラー
   */
  static timeoutError(operation?: string): AppError {
    return new AppError({
      code: 'ERR_TIMEOUT',
      message: `Operation timed out: ${operation}`,
      userMessage: '処理がタイムアウトしました。',
      level: ErrorLevel.ERROR,
      category: ErrorCategory.TIMEOUT,
      retryable: true,
      hint: 'しばらく待ってからもう一度お試しください。'
    });
  }

  /**
   * ストレージエラー
   */
  static storageError(message?: string): AppError {
    return new AppError({
      code: 'ERR_STORAGE',
      message: message || 'Storage error occurred',
      userMessage: 'データの保存に失敗しました。',
      level: ErrorLevel.ERROR,
      category: ErrorCategory.STORAGE,
      retryable: true,
      hint: 'ブラウザのストレージ容量を確認してください。'
    });
  }
}