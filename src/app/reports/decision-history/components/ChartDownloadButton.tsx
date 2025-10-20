'use client';

import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';

interface ChartDownloadButtonProps {
  chartType: 'achievement-rate' | 'decision-type' | 'time-series';
  chartTitle: string;
}

export function ChartDownloadButton({
  chartType,
  chartTitle,
}: ChartDownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPNG = async () => {
    setIsDownloading(true);
    try {
      const element = document.querySelector(`[data-chart="${chartType}"]`) as HTMLElement;
      if (!element) {
        throw new Error('グラフ要素が見つかりません');
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
      });

      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('画像の生成に失敗しました');
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `判断履歴_${chartTitle}_${format(new Date(), 'yyyy-MM-dd')}.png`;
        link.click();
        URL.revokeObjectURL(url);
      }, 'image/png');
    } catch (error) {
      console.error('PNG download error:', error);
      alert('PNGダウンロードに失敗しました');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadSVG = () => {
    alert('SVGダウンロードは現在開発中です。PNG形式をご利用ください。');
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleDownloadPNG}
        disabled={isDownloading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isDownloading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>ダウンロード中...</span>
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span>PNG</span>
          </>
        )}
      </button>

      <button
        onClick={handleDownloadSVG}
        disabled={isDownloading}
        className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed flex items-center gap-2"
        title="SVG形式は現在開発中です"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        <span>SVG</span>
      </button>
    </div>
  );
}
