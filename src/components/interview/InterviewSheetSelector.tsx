'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, FileText, UserCheck } from 'lucide-react';
import { getExperienceCategory, getExperienceCategoryLabel } from '@/utils/experienceUtils';
import { selectInterviewSheet, getAllInterviewSheets } from '@/utils/interviewSheetSelector';

interface InterviewSheetSelectorProps {
  staffId: string;
  staffName: string;
  yearsOfExperience: number;
  onSelectSheet?: (sheetPath: string) => void;
}

export default function InterviewSheetSelector({
  staffId,
  staffName,
  yearsOfExperience,
  onSelectSheet
}: InterviewSheetSelectorProps) {
  const router = useRouter();
  const experienceCategory = getExperienceCategory(yearsOfExperience);
  const categoryLabel = getExperienceCategoryLabel(experienceCategory);
  
  // デフォルトで30分版を選択
  const recommendedSheet = selectInterviewSheet(experienceCategory, 30);
  
  // この経験カテゴリで利用可能な全てのシートを取得
  const availableSheets = getAllInterviewSheets().filter(
    sheet => sheet.experienceCategory === experienceCategory
  );

  const handleSelectSheet = (sheetPath: string) => {
    if (onSelectSheet) {
      onSelectSheet(sheetPath);
    } else {
      // 面談シートページへ遷移
      router.push(sheetPath);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>面談シート選択</CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          {staffName}さん（経験年数: {yearsOfExperience}年 - {categoryLabel}）
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 推奨シート */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            推奨面談シート
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-blue-800">{recommendedSheet.title}</p>
              <p className="text-sm text-blue-600 flex items-center gap-1 mt-1">
                <Clock className="h-4 w-4" />
                {recommendedSheet.duration}分
              </p>
            </div>
            <Button
              onClick={() => handleSelectSheet(`/interview-sheets/${experienceCategory}/${recommendedSheet.duration}`)}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              この面談シートを使用
            </Button>
          </div>
        </div>

        {/* その他の利用可能なシート */}
        {availableSheets.length > 1 && (
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">その他の面談シート</h3>
            <div className="space-y-2">
              {availableSheets
                .filter(sheet => sheet.duration !== recommendedSheet.duration)
                .map((sheet) => (
                  <div
                    key={`${sheet.component}-${sheet.duration}`}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-medium">{sheet.title}</p>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {sheet.duration}分
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSelectSheet(`/interview-sheets/${experienceCategory}/${sheet.duration}`)}
                    >
                      選択
                    </Button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}