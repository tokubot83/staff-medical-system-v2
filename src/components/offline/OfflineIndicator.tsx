/**
 * Offline Indicator Component
 * オフライン状態を表示するコンポーネント
 */

'use client';

import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi, Cloud, CloudOff, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OfflineIndicatorProps {
  className?: string;
  showDetails?: boolean;
}

export function OfflineIndicator({ className, showDetails = false }: OfflineIndicatorProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    };

    // 初期状態を設定
    setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 定期的に保留中の操作数を更新
    const interval = setInterval(() => {
      const queue = JSON.parse(localStorage.getItem('offline_queue') || '[]');
      setPendingCount(queue.length);
    }, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  // 手動同期
  const handleSync = async () => {
    try {
      const queue = JSON.parse(localStorage.getItem('offline_queue') || '[]');
      if (queue.length === 0) return;

      console.log(`Syncing ${queue.length} operations...`);
      
      // 同期後にキューをクリア（実際の同期処理は省略）
      localStorage.setItem('offline_queue', '[]');
      setPendingCount(0);
    } catch (error) {
      console.error('Error syncing:', error);
    }
  };

  if (!showDetails && isOnline && pendingCount === 0) {
    return null;
  }

  return (
    <>
      {/* メイン表示 */}
      <div
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
          isOnline
            ? pendingCount > 0
              ? 'bg-amber-100 text-amber-800'
              : 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800',
          className
        )}
      >
        {isOnline ? (
          pendingCount > 0 ? (
            <>
              <Cloud className="w-4 h-4" />
              <span>同期中 ({pendingCount}件)</span>
              <button
                onClick={handleSync}
                className="ml-2 px-2 py-1 bg-amber-200 hover:bg-amber-300 rounded text-xs"
              >
                今すぐ同期
              </button>
            </>
          ) : (
            <>
              <Wifi className="w-4 h-4" />
              {showDetails && <span>オンライン</span>}
            </>
          )
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            <span>オフライン</span>
            {pendingCount > 0 && (
              <span className="ml-1 bg-red-200 px-2 py-0.5 rounded-full text-xs">
                {pendingCount}
              </span>
            )}
          </>
        )}
      </div>

      {/* 詳細表示 */}
      {showDetails && (
        <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="font-medium text-gray-700">接続状態</div>
              <div className={cn(
                'flex items-center gap-1 mt-1',
                isOnline ? 'text-green-600' : 'text-red-600'
              )}>
                {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                {isOnline ? 'オンライン' : 'オフライン'}
              </div>
            </div>
            <div>
              <div className="font-medium text-gray-700">保留中の操作</div>
              <div className={cn(
                'flex items-center gap-1 mt-1',
                pendingCount > 0 ? 'text-amber-600' : 'text-gray-600'
              )}>
                <CloudOff className="w-4 h-4" />
                {pendingCount}件
              </div>
            </div>
          </div>
          
          {pendingCount > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <button
                onClick={handleSync}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={!isOnline}
              >
                {isOnline ? '今すぐ同期' : 'オンライン待機中'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 通知ポップアップ */}
      {showNotification && (
        <div className={cn(
          'fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 transition-all duration-300',
          isOnline
            ? 'bg-green-100 text-green-800 border border-green-300'
            : 'bg-red-100 text-red-800 border border-red-300'
        )}>
          {isOnline ? (
            <>
              <Wifi className="w-5 h-5" />
              <span className="font-medium">オンラインに復帰しました</span>
            </>
          ) : (
            <>
              <WifiOff className="w-5 h-5" />
              <span className="font-medium">オフラインモードです</span>
            </>
          )}
          {pendingCount > 0 && (
            <div className="ml-2 px-2 py-1 bg-white bg-opacity-20 rounded text-sm">
              {pendingCount}件待機中
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default OfflineIndicator;