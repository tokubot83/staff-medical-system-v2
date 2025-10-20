'use client';

import React, { useState } from 'react';
import { captureChartImages, generatePDF } from '../utils/exportPDF';
import type { ExpiredEscalationDecision, DecisionHistoryResponse } from '@/services/voicedrive/types';

type ExpiredEscalationSummary = DecisionHistoryResponse['summary'];

interface PDFExportButtonProps {
  decisions: ExpiredEscalationDecision[];
  summary: ExpiredEscalationSummary;
  onExportStart?: () => void;
  onExportComplete?: () => void;
  onExportError?: (error: Error) => void;
}

export function PDFExportButton({
  decisions,
  summary,
  onExportStart,
  onExportComplete,
  onExportError,
}: PDFExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  const handleExportPDF = async () => {
    setIsExporting(true);
    setProgress(0);
    onExportStart?.();

    try {
      // ステップ1: グラフをPNG化（30%）
      setCurrentStep('グラフをキャプチャ中...');
      setProgress(10);
      const chartImages = await captureChartImages();
      setProgress(30);

      // ステップ2: PDFドキュメント生成（60%）
      setCurrentStep('PDFを生成中...');
      setProgress(40);
      const pdf = await generatePDF({
        decisions,
        summary,
        chartImages,
        onProgress: (p) => setProgress(40 + p * 20),
      });
      setProgress(60);

      // ステップ3: PDFダウンロード（100%）
      setCurrentStep('ダウンロード準備中...');
      setProgress(80);
      await pdf.save(`判断履歴レポート_${new Date().toISOString().split('T')[0]}.pdf`);
      setProgress(100);
      setCurrentStep('完了！');

      setTimeout(() => {
        onExportComplete?.();
        setIsExporting(false);
        setProgress(0);
        setCurrentStep('');
      }, 1000);
    } catch (error) {
      console.error('PDF export error:', error);
      onExportError?.(error as Error);
      setIsExporting(false);
      setProgress(0);
      setCurrentStep('');
      alert(
        error instanceof Error
          ? error.message
          : 'PDF生成に失敗しました。もう一度お試しください。'
      );
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleExportPDF}
        disabled={isExporting || decisions.length === 0}
        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isExporting ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
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
            <span className="text-sm">{progress}%</span>
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <span>PDFエクスポート</span>
          </>
        )}
      </button>

      {/* 進捗表示 */}
      {isExporting && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg p-3 z-10">
          {/* 進捗バー */}
          <div className="bg-gray-200 rounded-full h-2 overflow-hidden mb-2">
            <div
              className="bg-red-600 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* ステップ表示 */}
          <div className="text-xs text-gray-600 text-center">{currentStep}</div>
        </div>
      )}
    </div>
  );
}
