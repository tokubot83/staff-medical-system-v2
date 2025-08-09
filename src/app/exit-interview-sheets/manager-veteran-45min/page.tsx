'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer } from 'lucide-react';
import ManagerVeteran45MinExitInterviewSheet from '../../../../../../docs/exit-interview-sheets/manager-veteran-45min';

export default function ManagerVeteran45MinPage() {
  const router = useRouter();

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

      <ManagerVeteran45MinExitInterviewSheet />
    </div>
  );
}