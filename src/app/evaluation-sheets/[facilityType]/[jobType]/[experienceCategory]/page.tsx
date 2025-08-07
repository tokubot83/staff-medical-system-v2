'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ExperienceCategory } from '@/utils/experienceUtils';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer, Save, FileText } from 'lucide-react';

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

  // 施設種別の日本語表記
  const facilityLabels = {
    'acute': '急性期病院',
    'chronic': '慢性期病院',
    'roken': '老健',
    'grouphome': 'グループホーム'
  };

  // 職種の日本語表記
  const jobLabels = {
    'nurse': '看護師',
    'assistant-nurse': '准看護師',
    'nursing-aide': '看護補助者',
    'care-worker': '介護職員'
  };

  // 経験年数カテゴリの日本語表記
  const experienceLabels: Record<ExperienceCategory, string> = {
    'new': '新人（1年目）',
    'junior': '一般（2-3年目）',
    'midlevel': '中堅（4-10年目）',
    'senior': '上級（11-15年目）',
    'veteran': 'ベテラン（16年以上）',
    'chief': 'チーフ',
    'manager': '管理職'
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

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-4">評価シート</h1>
          <div className="flex justify-center gap-4 text-sm text-gray-600">
            <span>施設: {facilityLabels[facilityType]}</span>
            <span>•</span>
            <span>職種: {jobLabels[jobType]}</span>
            <span>•</span>
            <span>経験: {experienceLabels[experienceCategory]}</span>
          </div>
        </div>

        <div className="border-2 border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-center text-gray-500 py-12">
            <div className="text-center">
              <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg mb-2">評価シートは現在準備中です</p>
              <p className="text-sm">
                新評価システムの評価項目設定が完了次第、<br />
                こちらから評価シートをご利用いただけます。
              </p>
              <div className="mt-6">
                <Button
                  onClick={() => router.push('/evaluation/config')}
                  className="flex items-center gap-2 mx-auto"
                >
                  評価項目設定へ
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}