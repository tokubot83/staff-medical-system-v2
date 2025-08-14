/**
 * エラータイプ定義
 * システム全体で使用するエラーの型定義
 */

/**
 * エラーレベル
 */
export enum ErrorLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

/**
 * エラーカテゴリ
 */
export enum ErrorCategory {
  // ネットワーク関連
  NETWORK = 'network',
  API = 'api',
  TIMEOUT = 'timeout',
  
  // 認証・認可
  AUTH = 'auth',
  PERMISSION = 'permission',
  SESSION = 'session',
  
  // データ関連
  VALIDATION = 'validation',
  NOT_FOUND = 'not_found',
  CONFLICT = 'conflict',
  
  // システム関連
  SYSTEM = 'system',
  STORAGE = 'storage',
  UNKNOWN = 'unknown'
}

/**
 * 基本エラーインターフェース
 */
export interface AppError {
  // 一意のエラーID
  id?: string;
  
  // エラーコード（例: ERR_001）
  code: string;
  
  // エラーメッセージ（開発者向け）
  message: string;
  
  // ユーザー向けメッセージ
  userMessage?: string;
  
  // エラーレベル
  level: ErrorLevel;
  
  // エラーカテゴリ
  category: ErrorCategory;
  
  // HTTPステータスコード
  statusCode?: number;
  
  // エラーの詳細情報
  details?: any;
  
  // スタックトレース
  stack?: string;
  
  // タイムスタンプ
  timestamp: Date;
  
  // エラーが発生したコンポーネント/サービス
  source?: string;
  
  // ユーザーID（ログイン中の場合）
  userId?: string;
  
  // リトライ可能かどうか
  retryable?: boolean;
  
  // エラー解決のヒント
  hint?: string;
}

/**
 * APIエラーレスポンス
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

/**
 * バリデーションエラーの詳細
 */
export interface ValidationErrorDetail {
  field: string;
  message: string;
  value?: any;
  rule?: string;
}

/**
 * エラーログエントリ
 */
export interface ErrorLogEntry {
  id: string;
  error: AppError;
  context?: {
    url?: string;
    method?: string;
    headers?: Record<string, string>;
    body?: any;
    userAgent?: string;
  };
  resolved?: boolean;
  resolvedAt?: Date;
  notes?: string;
}