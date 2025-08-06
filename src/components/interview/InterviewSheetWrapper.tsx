'use client';

import React, { useState } from 'react';
import { ExperienceCategory } from '@/utils/experienceUtils';
import InterviewSheetViewer from './InterviewSheetViewer';
import InterviewModeSelector, { InterviewMode } from './InterviewModeSelector';
import PrintModeWrapper from './PrintModeWrapper';
import { Button } from '@/components/ui/button';
import { Printer, Save, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InterviewSheetWrapperProps {
  experienceCategory: ExperienceCategory;
  duration?: number;
  staffName?: string;
  yearsOfExperience?: number;
}

export default function InterviewSheetWrapper({
  experienceCategory,
  duration = 30,
  staffName,
  yearsOfExperience
}: InterviewSheetWrapperProps) {
  const [mode, setMode] = useState<InterviewMode>('input');

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    // TODO: 保存処理の実装
    console.log('保存処理を実行');
  };

  const handleExportPDF = () => {
    // TODO: PDF出力処理の実装
    console.log('PDF出力処理を実行');
  };

  return (
    <div className="space-y-4">
      {/* モード選択 */}
      <InterviewModeSelector mode={mode} onModeChange={setMode} />

      {/* アクションボタン */}
      <div className={cn(
        "flex justify-end space-x-2 mb-4",
        "print:hidden" // 印刷時は非表示
      )}>
        {mode === 'input' && (
          <>
            <Button variant="outline" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              一時保存
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              保存して完了
            </Button>
          </>
        )}
        
        {mode === 'print' && (
          <Button onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            印刷する
          </Button>
        )}
        
        {mode === 'review' && (
          <Button variant="outline" onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            PDFダウンロード
          </Button>
        )}
      </div>

      {/* 面談シート本体 */}
      <PrintModeWrapper mode={mode}>
        <InterviewSheetViewer
          experienceCategory={experienceCategory}
          duration={duration}
          staffName={staffName}
          yearsOfExperience={yearsOfExperience}
        />
      </PrintModeWrapper>
    </div>
  );
}