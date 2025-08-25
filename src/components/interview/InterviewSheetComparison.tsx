'use client';

import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, ArrowRight, RotateCcw, Zap, ZapOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PreviousInterviewViewer from './PreviousInterviewViewer';
import InterviewSheetViewer from './InterviewSheetViewer';
import { ExperienceCategory } from '@/utils/experienceUtils';
import { useInterviewSectionSync } from '@/hooks/useInterviewSectionSync';

interface InterviewSheetComparisonProps {
  isOpen: boolean;
  onClose: () => void;
  
  // 現在の面談情報
  currentStaffId: string;
  currentInterviewType: string;
  currentInterviewId?: string;
  currentExperienceCategory: ExperienceCategory;
  currentDuration?: number;
  currentStaffName?: string;
  currentYearsOfExperience?: number;
  
  // UI制御
  initialSection?: number;
}

export default function InterviewSheetComparison({
  isOpen,
  onClose,
  currentStaffId,
  currentInterviewType,
  currentInterviewId,
  currentExperienceCategory,
  currentDuration = 30,
  currentStaffName,
  currentYearsOfExperience,
  initialSection = 0
}: InterviewSheetComparisonProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // セクション同期フックを使用
  const [syncState, syncActions] = useInterviewSectionSync(initialSection, true);

  useEffect(() => {
    if (isOpen) {
      syncActions.setCurrentSection(initialSection);
      // モーダルが開いているときはボディのスクロールを防ぐ
      document.body.style.overflow = 'hidden';
    }

    // Escキーでモーダルを閉じる
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, initialSection, syncActions]);

  const handleSectionChange = (newSection: number) => {
    syncActions.setCurrentSection(newSection);
  };

  if (!isOpen) return null;

  console.log('[InterviewSheetComparison] Modal is opening!');

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" style={{backgroundColor: 'rgba(255,0,0,0.5)'}}>
      <div className="flex items-center justify-center min-h-screen">
        {/* 背景オーバーレイ */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75" 
          onClick={onClose}
        />

        {/* メインコンテンツ */}
        <div className={`relative bg-white transition-all transform ${
          isFullscreen ? 'w-screen h-screen' : 'w-screen h-screen'
        }`}>
          
          {/* ヘッダー */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-bold text-white">
                  面談シート比較表示
                </h2>
                <div className="text-white/80 text-sm">
                  {currentStaffName && `${currentStaffName} - `}
                  {currentInterviewType}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* セクション制御ボタン */}
                <div className="flex items-center space-x-1 bg-white/10 rounded-lg px-3 py-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={syncActions.prevSection}
                    disabled={syncState.currentSection <= 0}
                    className="text-white hover:bg-white/20 p-1 h-8 w-8"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  
                  <span className="text-white text-sm px-2">
                    セクション {syncState.currentSection + 1}
                  </span>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={syncActions.nextSection}
                    disabled={syncState.currentSection >= syncState.maxSections - 1}
                    className="text-white hover:bg-white/20 p-1 h-8 w-8"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={syncActions.resetSection}
                    className="text-white hover:bg-white/20 p-1 h-8 w-8"
                    title="最初のセクションに戻る"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>

                  {/* 自動同期切り替えボタン */}
                  <div className="h-6 w-px bg-white/20 mx-1"></div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={syncActions.toggleAutoSync}
                    className="text-white hover:bg-white/20 p-1 h-8 w-8"
                    title={syncState.isAutoSync ? "自動同期を無効にする" : "自動同期を有効にする"}
                  >
                    {syncState.isAutoSync ? (
                      <Zap className="h-4 w-4" />
                    ) : (
                      <ZapOff className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* 全画面切り替え */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="text-white hover:bg-white/20"
                >
                  {isFullscreen ? '元のサイズ' : '全画面'}
                </Button>

                {/* 閉じるボタン */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white hover:bg-white/20 p-2 h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* コンテンツエリア */}
          <div className="flex h-[calc(100%-4rem)]">
            
            {/* 前回面談シート（左側） */}
            <div className="w-1/2 border-r border-gray-200 flex flex-col">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800 text-sm">
                  前回の面談シート
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  同じタイプの直近面談
                </p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-2">
                <PreviousInterviewViewer
                  staffId={currentStaffId}
                  currentInterviewType={currentInterviewType}
                  currentInterviewId={currentInterviewId}
                  currentSection={syncState.previousSection}
                  onSectionChange={handleSectionChange}
                />
              </div>
            </div>

            {/* 今回の面談シート（右側） */}
            <div className="w-1/2 flex flex-col">
              <div className="bg-blue-50 px-4 py-3 border-b border-gray-200">
                <h3 className="font-semibold text-blue-800 text-sm">
                  今回の面談シート
                </h3>
                <p className="text-xs text-blue-600 mt-1">
                  現在実施中の面談
                </p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-2">
                <div className="mb-2 p-2 bg-blue-50 text-xs rounded">
                  <strong>Debug:</strong> experienceCategory: {JSON.stringify(currentExperienceCategory)}, duration: {currentDuration}
                </div>
                <InterviewSheetViewer
                  experienceCategory={currentExperienceCategory}
                  duration={currentDuration}
                  staffName={currentStaffName}
                  yearsOfExperience={currentYearsOfExperience}
                />
              </div>
            </div>
          </div>

          {/* フッター */}
          <div className="bg-gray-100 px-4 py-2 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                左右を比較して面談を進めてください
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="text-gray-600"
                >
                  比較を終了
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* グローバルスタイル（印刷対応） */}
      <style jsx global>{`
        @media print {
          .comparison-view {
            break-inside: avoid;
          }
          
          .comparison-section {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}