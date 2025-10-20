'use client';

import React, { useState } from 'react';
import { generateExcel } from '../utils/exportExcel';
import type { ExpiredEscalationDecision, DecisionHistoryResponse } from '@/services/voicedrive/types';

type ExpiredEscalationSummary = DecisionHistoryResponse['summary'];

interface ExcelExportButtonProps {
  decisions: ExpiredEscalationDecision[];
  summary: ExpiredEscalationSummary;
  onExportStart?: () => void;
  onExportComplete?: () => void;
  onExportError?: (error: Error) => void;
}

export function ExcelExportButton({
  decisions,
  summary,
  onExportStart,
  onExportComplete,
  onExportError,
}: ExcelExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportExcel = async () => {
    setIsExporting(true);
    onExportStart?.();

    try {
      await generateExcel(decisions, summary);
      onExportComplete?.();
    } catch (error) {
      console.error('Excel export error:', error);
      onExportError?.(error as Error);
      alert(
        error instanceof Error
          ? error.message
          : 'Excel生成に失敗しました。もう一度お試しください。'
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExportExcel}
      disabled={isExporting || decisions.length === 0}
      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
          <span>生成中...</span>
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span>Excel詳細エクスポート</span>
        </>
      )}
    </button>
  );
}
