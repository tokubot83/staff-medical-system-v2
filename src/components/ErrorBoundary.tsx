/**
 * Error Boundary Component
 * Reactコンポーネントツリー内でエラーをキャッチし、フォールバックUIを表示
 */

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { errorLogger } from '@/lib/error/ErrorLogger';
import { AppError } from '@/lib/error/AppError';
import { ErrorLevel, ErrorCategory } from '@/lib/error/ErrorTypes';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId?: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // エラーが発生したらUIを更新
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // エラーをログに記録
    const appError = error instanceof AppError ? error : new AppError({
      code: 'ERR_BOUNDARY',
      message: error.message,
      userMessage: 'アプリケーションでエラーが発生しました',
      level: ErrorLevel.ERROR,
      category: ErrorCategory.SYSTEM,
      details: {
        componentStack: errorInfo.componentStack,
        errorBoundary: true
      }
    });

    // エラーIDを生成してログに記録
    const errorId = errorLogger.log(appError);

    // コールバックがあれば実行
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // 状態を更新
    this.setState({
      errorInfo,
      errorId
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: undefined
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // カスタムフォールバックが指定されている場合
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }

      const { error, errorInfo, errorId } = this.state;
      const isAppError = error instanceof AppError;
      const userMessage = isAppError 
        ? error.userMessage 
        : 'アプリケーションでエラーが発生しました';
      const hint = isAppError ? error.hint : undefined;
      const retryable = isAppError ? error.retryable : true;

      // デフォルトのエラー画面
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <div className="max-w-2xl w-full">
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <AlertTitle className="text-red-800 text-lg font-semibold">
                エラーが発生しました
              </AlertTitle>
              <AlertDescription className="mt-3 space-y-4">
                <p className="text-red-700">
                  {userMessage}
                </p>
                
                {hint && (
                  <p className="text-sm text-red-600">
                    💡 {hint}
                  </p>
                )}

                {errorId && (
                  <p className="text-xs text-red-500">
                    エラーID: {errorId}
                  </p>
                )}

                {/* 開発環境でのみ詳細を表示 */}
                {this.props.showDetails && process.env.NODE_ENV === 'development' && (
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm text-red-600 hover:text-red-700">
                      エラーの詳細（開発者向け）
                    </summary>
                    <div className="mt-2 space-y-2">
                      <pre className="text-xs bg-red-100 p-3 rounded overflow-auto max-h-60">
                        {error?.message}
                      </pre>
                      {errorInfo?.componentStack && (
                        <pre className="text-xs bg-red-100 p-3 rounded overflow-auto max-h-60">
                          {errorInfo.componentStack}
                        </pre>
                      )}
                    </div>
                  </details>
                )}

                <div className="flex gap-3 mt-6">
                  {retryable && (
                    <Button
                      onClick={this.handleReset}
                      variant="default"
                      className="gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      再試行
                    </Button>
                  )}
                  
                  <Button
                    onClick={this.handleGoHome}
                    variant="outline"
                    className="gap-2"
                  >
                    <Home className="h-4 w-4" />
                    ホームに戻る
                  </Button>
                </div>
              </AlertDescription>
            </Alert>

            {/* サポート情報 */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">
                問題が解決しない場合
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• ページを再読み込みしてください（F5キー）</li>
                <li>• ブラウザのキャッシュをクリアしてください</li>
                <li>• しばらく時間をおいてから再度お試しください</li>
                <li>• 問題が続く場合は、管理者にお問い合わせください</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Error Boundary Hook
 * 関数コンポーネントでError Boundaryを使いやすくするためのラッパー
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
  onError?: (error: Error, errorInfo: ErrorInfo) => void
) {
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => (
    <ErrorBoundary fallback={fallback} onError={onError}>
      <Component {...props} ref={ref} />
    </ErrorBoundary>
  ));
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name || 'Component'})`;
  
  return WrappedComponent;
}