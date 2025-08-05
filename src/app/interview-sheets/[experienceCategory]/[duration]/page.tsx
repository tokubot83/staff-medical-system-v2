'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import InterviewSheetViewer from '@/components/interview/InterviewSheetViewer';
import { ExperienceCategory } from '@/utils/experienceUtils';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer } from 'lucide-react';

export default function InterviewSheetPage() {
  const params = useParams();
  const router = useRouter();
  const experienceCategory = params.experienceCategory as ExperienceCategory;
  const duration = parseInt(params.duration as string, 10);

  const handlePrint = () => {
    window.print();
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
        <Button
          onClick={handlePrint}
          className="flex items-center gap-2"
        >
          <Printer className="h-4 w-4" />
          印刷
        </Button>
      </div>

      <InterviewSheetViewer
        experienceCategory={experienceCategory}
        duration={duration}
      />
    </div>
  );
}