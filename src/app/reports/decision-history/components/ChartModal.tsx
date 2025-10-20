'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChartDownloadButton } from './ChartDownloadButton';

interface ChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  chartTitle: string;
  chartElement: React.ReactNode;
  chartType: 'achievement-rate' | 'decision-type' | 'time-series';
}

export function ChartModal({
  isOpen,
  onClose,
  chartTitle,
  chartElement,
  chartType,
}: ChartModalProps) {
  // ESCキーで閉じる
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // モーダルが開いている間、背景スクロールを無効化
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modal = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* オーバーレイ背景 */}
      <div className="absolute inset-0 bg-black opacity-80" />

      {/* モーダルコンテンツ */}
      <div
        className="relative bg-white rounded-lg shadow-2xl max-w-[90vw] max-h-[80vh] w-full flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 id="modal-title" className="text-2xl font-bold text-gray-800">
            {chartTitle}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="閉じる"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* グラフコンテンツ */}
        <div className="flex-1 overflow-auto p-6">
          <div className="min-h-[400px] flex items-center justify-center">
            {chartElement}
          </div>
        </div>

        {/* フッター（ダウンロードボタン） */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <ChartDownloadButton chartType={chartType} chartTitle={chartTitle} />
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );

  // ポータルを使用してbodyに直接レンダリング
  return typeof document !== 'undefined'
    ? createPortal(modal, document.body)
    : null;
}
