'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface PrintModeWrapperProps {
  children: React.ReactNode;
  mode?: 'input' | 'print' | 'review';
  className?: string;
}

export default function PrintModeWrapper({ 
  children, 
  mode = 'input',
  className 
}: PrintModeWrapperProps) {
  // 印刷モードの場合、特別な処理を追加
  React.useEffect(() => {
    if (mode === 'print') {
      // 印刷用のスタイルクラスを追加
      document.body.classList.add('print-mode-active');
      
      // フォームフィールドを印刷用に調整
      const inputs = document.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
          // readonlyにせず、印刷時も入力可能な状態を保つ
          input.style.backgroundColor = 'transparent';
        }
      });

      return () => {
        document.body.classList.remove('print-mode-active');
      };
    }
  }, [mode]);

  return (
    <div className={cn(
      'interview-sheet-container',
      mode === 'print' && 'print-mode',
      mode === 'review' && 'review-mode',
      className
    )}>
      {mode === 'print' && (
        <div className="print-only text-right text-sm text-gray-600 mb-4">
          印刷日: {new Date().toLocaleDateString('ja-JP')}
        </div>
      )}
      
      {children}

      {mode === 'print' && (
        <div className="print-only signature-area mt-12">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-sm mb-2">面談者署名：</p>
              <div className="signature-line"></div>
            </div>
            <div>
              <p className="text-sm mb-2">対象者署名：</p>
              <div className="signature-line"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}