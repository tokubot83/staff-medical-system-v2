'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, FileText } from 'lucide-react';

interface EvaluationNavigationProps {
  showBackButton?: boolean;
}

export default function EvaluationNavigation({ showBackButton = true }: EvaluationNavigationProps) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleEvaluationHome = () => {
    router.push('/evaluation');
  };

  return (
    <div className="flex gap-2 mb-4">
      {showBackButton && (
        <Button
          variant="outline"
          onClick={handleBack}
          className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
        >
          <ArrowLeft size={20} />
          前のページに戻る
        </Button>
      )}
      
      <Button
        variant="outline"
        onClick={handleEvaluationHome}
        className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
      >
        <FileText size={20} />
        評価概要ページ
      </Button>
    </div>
  );
}