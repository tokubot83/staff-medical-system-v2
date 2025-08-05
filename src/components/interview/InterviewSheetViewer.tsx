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

// v4面談シートコンポーネントの遅延読み込み
const interviewSheetComponents = {
  NewNurseUnified45Min: lazy(() => import('@/components/interview-sheets/v4/new-nurse-unified-45min')),
  GeneralNurseUnified15Min: lazy(() => import('@/components/interview-sheets/v4/general-nurse-unified-15min')),
  GeneralNurseUnified30Min: lazy(() => import('@/components/interview-sheets/v4/general-nurse-unified-30min')),
  GeneralNurseUnified45Min: lazy(() => import('@/components/interview-sheets/v4/general-nurse-unified-45min')),
  SeniorNurseUnified45Min: lazy(() => import('@/components/interview-sheets/v4/senior-nurse-unified-45min')),
  VeteranNurseUnified45Min: lazy(() => import('@/components/interview-sheets/v4/veteran-nurse-unified-45min')),
  ChiefNurseUnified45Min: lazy(() => import('@/components/interview-sheets/v4/chief-nurse-unified-45min')),
  LeaderNurseUnified45Min: lazy(() => import('@/components/interview-sheets/v4/leader-nurse-unified-45min'))
};

export default function InterviewSheetViewer({
  experienceCategory,
  duration = 30,
  staffName,
  yearsOfExperience
}: InterviewSheetViewerProps) {
  const selectedSheet = useMemo(() => 
    selectInterviewSheet(experienceCategory, duration),
    [experienceCategory, duration]
  );

  const SheetComponent = interviewSheetComponents[selectedSheet.component as keyof typeof interviewSheetComponents];

  if (!SheetComponent) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">
            面談シートが見つかりません。
          </p>
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