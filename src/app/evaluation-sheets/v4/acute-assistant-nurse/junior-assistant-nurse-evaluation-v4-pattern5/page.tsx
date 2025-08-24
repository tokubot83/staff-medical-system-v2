'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// 評価シートコンポーネントを動的インポート
const EvaluationSheet = dynamic(
  () => import('@/components/evaluation-sheets/v4/acute-assistant-nurse/junior-assistant-nurse-evaluation-v4-pattern5'),
  { 
    ssr: false,
    loading: () => <div className="p-8 text-center">評価シートを読み込み中...</div>
  }
);

export default function JuniorAssistantNurseEvaluationPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 print:hidden">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          ← 戻る
        </button>
      </div>
      
      {EvaluationSheet && typeof EvaluationSheet === 'function' ? (<EvaluationSheet />) : (<div className="p-8 text-center text-gray-600"><p>評価シートを読み込めませんでした</p></div>)}
    </div>
  );
}