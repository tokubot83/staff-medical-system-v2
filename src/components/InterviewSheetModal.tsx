'use client';

import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { X, Printer, Download, GitCompare } from 'lucide-react';

interface InterviewSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  sheetName: string;
  sheetPath: string;
  // 面談比較機能用のプロパティ（オプション）
  staffId?: string;
  staffName?: string;
  interviewType?: string;
  interviewId?: string;
  experienceCategory?: any;
  duration?: number;
  yearsOfExperience?: number;
}

// 面談シートコンポーネントをマッピング
const sheetComponents: { [key: string]: any } = {
  'v4_interview/new-nurse-unified-45min.tsx': dynamic(() => import('@/../../docs/v4_interview/new-nurse-unified-45min'), { ssr: false }),
  'v4_interview/general-nurse-unified-15min.tsx': dynamic(() => import('@/../../docs/v4_interview/general-nurse-unified-15min'), { ssr: false }),
  'v4_interview/general-nurse-unified-30min.tsx': dynamic(() => import('@/../../docs/v4_interview/general-nurse-unified-30min'), { ssr: false }),
  'v4_interview/general-nurse-unified-45min.tsx': dynamic(() => import('@/../../docs/v4_interview/general-nurse-unified-45min'), { ssr: false }),
  'v4_interview/leader-nurse-unified-45min.tsx': dynamic(() => import('@/../../docs/v4_interview/leader-nurse-unified-45min'), { ssr: false }),
  'v4_interview/chief-nurse-unified-45min.tsx': dynamic(() => import('@/../../docs/v4_interview/chief-nurse-unified-45min'), { ssr: false }),
  'v4_interview/veteran-nurse-unified-45min.tsx': dynamic(() => import('@/../../docs/v4_interview/veteran-nurse-unified-45min'), { ssr: false }),
  'v4_interview/senior-nurse-unified-45min.tsx': dynamic(() => import('@/../../docs/v4_interview/senior-nurse-unified-45min'), { ssr: false }),
};

// 面談比較モーダルの遅延読み込み
const InterviewSheetComparison = dynamic(() => import('@/components/interview/InterviewSheetComparison'), { ssr: false });

export default function InterviewSheetModal({ 
  isOpen, 
  onClose, 
  sheetName,
  sheetPath,
  staffId,
  staffName,
  interviewType,
  interviewId,
  experienceCategory,
  duration = 30,
  yearsOfExperience
}: InterviewSheetModalProps) {
  const [isPrinting, setIsPrinting] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    // Escキーでモーダルを閉じる
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      // モーダルが開いているときはボディのスクロールを防ぐ
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  const handleShowComparison = () => {
    console.log('[InterviewSheetModal] Comparison button clicked!');
    console.log('[InterviewSheetModal] Staff:', staffId, staffName, interviewType);
    setShowComparison(true);
  };

  const handleCloseComparison = () => {
    setShowComparison(false);
  };

  const SheetComponent = sheetComponents[sheetPath];

  // 面談比較機能に必要なデータがある場合のみボタンを表示
  const canShowComparison = staffId && interviewType && experienceCategory;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* 背景オーバーレイ */}
        <div 
          className="fixed inset-0 transition-opacity" 
          aria-hidden="true"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
        </div>

        {/* モーダルコンテンツ */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-7xl sm:w-full">
          {/* ヘッダー */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 flex justify-between items-center print:hidden">
            <h3 className="text-xl font-bold text-white">
              {sheetName}
            </h3>
            <div className="flex items-center gap-2">
              {canShowComparison && (
                <button
                  onClick={handleShowComparison}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"
                  title="前回面談シート表示"
                >
                  <GitCompare className="h-5 w-5" />
                </button>
              )}
              <button
                onClick={handlePrint}
                disabled={isPrinting}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors disabled:opacity-50"
                title="印刷"
              >
                <Printer className="h-5 w-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"
                title="閉じる"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* コンテンツエリア */}
          <div className="bg-gray-50 p-6 max-h-[80vh] overflow-y-auto print:max-h-none print:overflow-visible">
            <div className="bg-white rounded-lg shadow-sm print:shadow-none">
              <Suspense fallback={
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <p className="mt-4 text-gray-600">面談シートを読み込んでいます...</p>
                  </div>
                </div>
              }>
                {SheetComponent && typeof SheetComponent === 'function' ? (
                  <SheetComponent />
                ) : (
                  <div className="p-8 text-center text-gray-600">
                    <p>面談シートを表示できません</p>
                    <p className="text-sm mt-2">パス: {sheetPath}</p>
                  </div>
                )}
              </Suspense>
            </div>
          </div>
          
          {/* フッター */}
          <div className="bg-gray-100 px-6 py-4 flex justify-between items-center print:hidden">
            <div className="text-sm text-gray-600">
              プレビューモード
            </div>
            <button
              type="button"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              onClick={onClose}
            >
              閉じる
            </button>
          </div>
        </div>
      </div>

      {/* 印刷用スタイル */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          
          .sm\\:max-w-7xl,
          .sm\\:max-w-7xl * {
            visibility: visible;
          }
          
          .sm\\:max-w-7xl {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
            box-shadow: none !important;
          }
          
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
      
      {/* 面談比較モーダル */}
      {canShowComparison && (
        <InterviewSheetComparison
          isOpen={showComparison}
          onClose={handleCloseComparison}
          currentStaffId={staffId!}
          currentInterviewType={interviewType!}
          currentInterviewId={interviewId}
          currentExperienceCategory={experienceCategory}
          currentDuration={duration}
          currentStaffName={staffName}
          currentYearsOfExperience={yearsOfExperience}
        />
      )}
    </div>
  );
}