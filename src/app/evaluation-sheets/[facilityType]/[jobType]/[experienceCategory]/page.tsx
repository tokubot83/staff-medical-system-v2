'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import EvaluationSheetViewer from '@/components/evaluation/EvaluationSheetViewer';
import { ExperienceCategory } from '@/utils/experienceUtils';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer, Save } from 'lucide-react';

export default function EvaluationSheetPage() {
  const params = useParams();
  const router = useRouter();
  const facilityType = params.facilityType as 'acute' | 'chronic' | 'roken' | 'grouphome';
  const jobType = params.jobType as 'nurse' | 'assistant-nurse' | 'nursing-aide' | 'care-worker';
  const experienceCategory = params.experienceCategory as ExperienceCategory;

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    // TODO: 評価シートの保存処理
    alert('評価シートを保存しました');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <Button
          variant="outline"
          onClick={handleBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          戻る
        </Button>
        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            保存
          </Button>
          <Button
            variant="outline"
            onClick={handlePrint}
            className="flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            印刷
          </Button>
        </div>
      </div>

      <EvaluationSheetViewer
        experienceCategory={experienceCategory}
        facilityType={facilityType}
        jobType={jobType}
      />
    </div>
  );
}