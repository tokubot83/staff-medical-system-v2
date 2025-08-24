'use client';

import React, { Suspense, lazy, useMemo } from 'react';
import { ExperienceCategory } from '@/utils/experienceUtils';
import { selectInterviewSheet } from '@/utils/interviewSheetSelector';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface InterviewSheetViewerProps {
  experienceCategory: ExperienceCategory;
  duration?: number;
  staffName?: string;
  yearsOfExperience?: number;
}

// テスト用面談シート
const TestInterviewSheet = lazy(() => import('@/components/interview/TestInterviewSheet'));

// v4面談シートコンポーネントの遅延読み込み
const interviewSheetComponents = {
  // テスト用（すべてのカテゴリで使用）
  NewNurseUnified15Min: TestInterviewSheet,
  NewNurseUnified30Min: TestInterviewSheet,
  NewNurseUnified45Min: TestInterviewSheet,
  GeneralNurseUnified15Min: TestInterviewSheet,
  GeneralNurseUnified30Min: TestInterviewSheet,
  GeneralNurseUnified45Min: TestInterviewSheet,
  VeteranNurseUnified15Min: TestInterviewSheet,
  VeteranNurseUnified30Min: TestInterviewSheet,
  VeteranNurseUnified45Min: TestInterviewSheet,
  ChiefNurseUnified15Min: TestInterviewSheet,
  ChiefNurseUnified30Min: TestInterviewSheet,
  ChiefNurseUnified45Min: TestInterviewSheet,
  LeaderNurseUnified15Min: TestInterviewSheet,
  LeaderNurseUnified30Min: TestInterviewSheet,
  LeaderNurseUnified45Min: TestInterviewSheet
};

export default function InterviewSheetViewer({
  experienceCategory,
  duration = 30,
  staffName,
  yearsOfExperience
}: InterviewSheetViewerProps) {
  const selectedSheet = useMemo(() => {
    const sheet = selectInterviewSheet(experienceCategory, duration);
    console.log('[InterviewSheetViewer] Selected sheet:', sheet);
    return sheet;
  }, [experienceCategory, duration]);

  const SheetComponent = interviewSheetComponents[selectedSheet.component as keyof typeof interviewSheetComponents];
  
  console.log('[InterviewSheetViewer] Component found:', !!SheetComponent);
  console.log('[InterviewSheetViewer] Available components:', Object.keys(interviewSheetComponents));

  if (!SheetComponent || typeof SheetComponent !== 'function') {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="bg-red-100 p-4 rounded">
            <p className="text-red-800 font-bold">🚨 DEBUG: 面談シートが見つかりません</p>
            <p className="text-red-600 text-sm">Selected component: {selectedSheet.component}</p>
            <p className="text-red-600 text-sm">Component exists: {!!SheetComponent}</p>
            <p className="text-red-600 text-sm">Component type: {typeof SheetComponent}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Suspense 
      fallback={
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>面談シートを読み込んでいます...</span>
            </div>
          </CardContent>
        </Card>
      }
    >
      <SheetComponent />
    </Suspense>
  );
}