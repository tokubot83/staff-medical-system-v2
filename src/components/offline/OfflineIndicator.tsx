/**
 * Offline Indicator Component
 * オフライン状態を表示するコンポーネント
 */

'use client';

import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi, Cloud, CloudOff, AlertCircle } from 'lucide-react';
import { offlineManager } from '@/lib/offline/OfflineManager';
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
    // 初期状態を設定
    setIsOnline(offlineManager.getOnlineStatus());
    setPendingCount(offlineManager.getPendingOperationsCount());

    // オンライン/オフライン状態の監視
    const unsubscribe = offlineManager.subscribeToStatusChange((online) => {
      setIsOnline(online);
      setShowNotification(true);
      
      // 3秒後に通知を非表示
      setTimeout(() => setShowNotification(false), 3000);
    });

    // 同期完了イベントの監視
    const handleSyncComplete = (event: CustomEvent) => {
      setPendingCount(offlineManager.getPendingOperationsCount());
    };

    window.addEventListener('syncComplete', handleSyncComplete as EventListener);

    // 定期的に保留中の操作数を更新
    const interval = setInterval(() => {
      setPendingCount(offlineManager.getPendingOperationsCount());
    }, 5000);

    return () => {
      unsubscribe();
      window.removeEventListener('syncComplete', handleSyncComplete as EventListener);
      clearInterval(interval);
    };
  }, []);

  if (!showDetails && isOnline && pendingCount === 0) {
    return null;
  }

  return (
    <>
      {/* 固定位置のインジケーター */}
      <div
        className={cn(
          'fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg transition-all duration-300',
          isOnline
            ? pendingCount > 0
              ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
              : 'bg-green-100 text-green-800 border border-green-200'
            : 'bg-red-100 text-red-800 border border-red-200',
          className
        )}
      >
        {isOnline ? (
          pendingCount > 0 ? (
            <>
              <Cloud className="h-4 w-4 animate-pulse" />
              <span className="text-sm font-medium">
                同期中 ({pendingCount}件)
              </span>
            </>
          ) : (
            <>
              <Wifi className="h-4 w-4" />
              <span className="text-sm font-medium">オンライン</span>
            </>
          )
        ) : (
          <>
            <WifiOff className="h-4 w-4" />
            <span className="text-sm font-medium">オフライン</span>
          </>
        )}

        {showDetails && (
          <button
            className="ml-2 text-xs underline hover:no-underline"
            onClick={() => {
              // 詳細モーダルを表示（実装は省略）
              console.log('Show sync details');
            }}
          >
            詳細
          </button>
        )}
      </div>

      {/* 一時的な通知 */}
      {showNotification && (
        <div
          className={cn(
            'fixed top-4 left-1/2 transform -translate-x-1/2 z-50',
            'px-6 py-3 rounded-lg shadow-lg',
            'animate-in slide-in-from-top duration-300',
            isOnline
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          )}
        >
          <div className="flex items-center gap-2">
            {isOnline ? (
              <>
                <Wifi className="h-5 w-5" />
                <span className="font-medium">接続が復帰しました</span>
              </>
            ) : (
              <>
                <WifiOff className="h-5 w-5" />
                <span className="font-medium">
                  オフラインモードで動作中
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/**
 * オフライン時の警告バナー
 */
export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsOnline(offlineManager.getOnlineStatus());

    const unsubscribe = offlineManager.subscribeToStatusChange((online) => {
      setIsOnline(online);
      if (!online) {
        setIsVisible(true);
      }
    });

    return unsubscribe;
  }, []);

  if (isOnline || !isVisible) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border-b border-yellow-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CloudOff className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                オフラインモードで動作中
              </p>
              <p className="text-xs text-yellow-600">
                データは自動的に保存され、接続が復帰したら同期されます
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-yellow-600 hover:text-yellow-800"
          >
            <span className="text-sm">✕</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * 同期状態の詳細表示
 */
export function SyncStatusDetail() {
  const [pendingOps, setPendingOps] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const ops = offlineManager.getPendingOperations();
      setPendingOps(ops);
    }
  }, [isOpen]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 p-2 bg-gray-100 rounded-lg shadow hover:bg-gray-200"
      >
        <AlertCircle className="h-5 w-5 text-gray-600" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">同期待ちの操作</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
      </div>
      
      <div className="max-h-64 overflow-y-auto">
        {pendingOps.length === 0 ? (
          <p className="p-4 text-sm text-gray-500">
            同期待ちの操作はありません
          </p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {pendingOps.map((op) => (
              <li key={op.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {op.type}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(op.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                    リトライ: {op.retryCount}/{op.maxRetries}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {pendingOps.length > 0 && (
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={() => {
              offlineManager.syncWithServer();
            }}
            className="w-full px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          >
            今すぐ同期
          </button>
        </div>
      )}
    </div>
  );
}