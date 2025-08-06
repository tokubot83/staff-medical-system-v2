'use client';

import React, { Suspense, lazy, useMemo } from 'react';
import { ExperienceCategory } from '@/utils/experienceUtils';
import { selectEvaluationSheet } from '@/utils/evaluationSheetSelector';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface EvaluationSheetViewerProps {
  experienceCategory: ExperienceCategory;
  facilityType?: 'acute' | 'chronic' | 'roken' | 'grouphome';
  jobType?: 'nurse' | 'assistant-nurse' | 'nursing-aide' | 'care-worker';
  staffName?: string;
  yearsOfExperience?: number;
}

// v4評価シートコンポーネントの遅延読み込み
const evaluationSheetComponents = {
  // 急性期看護師
  NewNurseEvaluationV4Pattern5: lazy(() => import('@/components/evaluation-sheets/v4/acute-nurse/new-nurse-evaluation-v4-pattern5')),
  JuniorNurseEvaluationV4Pattern5: lazy(() => import('@/components/evaluation-sheets/v4/acute-nurse/junior-nurse-evaluation-v4-pattern5')),
  MidlevelNurseEvaluationV4Pattern5: lazy(() => import('@/components/evaluation-sheets/v4/acute-nurse/midlevel-nurse-evaluation-v4-pattern5')),
  VeteranNurseEvaluationV4Pattern5: lazy(() => import('@/components/evaluation-sheets/v4/acute-nurse/veteran-nurse-evaluation-v4-pattern5')),
  WardChiefEvaluationV4Pattern5: lazy(() => import('@/components/evaluation-sheets/v4/acute-nurse/ward-chief-evaluation-v4-pattern5')),
  WardManagerEvaluationV4Pattern5: lazy(() => import('@/components/evaluation-sheets/v4/acute-nurse/ward-manager-evaluation-v4-pattern5')),
  
  // 急性期看護補助者
  NewNursingAideEvaluationV4Pattern5: lazy(() => import('@/components/evaluation-sheets/v4/acute-nursing-aide/new-nursing-aide-evaluation-v4-pattern5')),
  JuniorNursingAideEvaluationV4Pattern5: lazy(() => import('@/components/evaluation-sheets/v4/acute-nursing-aide/junior-nursing-aide-evaluation-v4-pattern5')),
  MidlevelNursingAideEvaluationV4Pattern5: lazy(() => import('@/components/evaluation-sheets/v4/acute-nursing-aide/midlevel-nursing-aide-evaluation-v4-pattern5')),
  VeteranNursingAideEvaluationV4Pattern5: lazy(() => import('@/components/evaluation-sheets/v4/acute-nursing-aide/veteran-nursing-aide-evaluation-v4-pattern5')),
  LeaderNursingAideEvaluationV4Pattern5: lazy(() => import('@/components/evaluation-sheets/v4/acute-nursing-aide/leader-nursing-aide-evaluation-v4-pattern5'))
};

export default function EvaluationSheetViewer({
  experienceCategory,
  facilityType = 'acute',
  jobType = 'nurse',
  staffName,
  yearsOfExperience
}: EvaluationSheetViewerProps) {
  const selectedSheet = useMemo(() => 
    selectEvaluationSheet(experienceCategory, facilityType, jobType),
    [experienceCategory, facilityType, jobType]
  );

  if (!selectedSheet) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">
            この施設タイプ・職種の評価シートはまだ実装されていません。
          </p>
        </CardContent>
      </Card>
    );
  }

  const SheetComponent = evaluationSheetComponents[selectedSheet.component as keyof typeof evaluationSheetComponents];

  if (!SheetComponent) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">
            評価シートが見つかりません。
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
              <span>評価シートを読み込んでいます...</span>
            </div>
          </CardContent>
        </Card>
      }
    >
      <SheetComponent />
    </Suspense>
  );
}