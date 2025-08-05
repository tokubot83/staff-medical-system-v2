'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Building, UserCheck, AlertCircle } from 'lucide-react';
import { getExperienceCategory, getExperienceCategoryLabel } from '@/utils/experienceUtils';
import { selectEvaluationSheet } from '@/utils/evaluationSheetSelector';

interface EvaluationSheetSelectorProps {
  staffId: string;
  staffName: string;
  yearsOfExperience: number;
  facility?: string;
  department?: string;
  position?: string;
  onSelectSheet?: (sheetPath: string) => void;
}

export default function EvaluationSheetSelector({
  staffId,
  staffName,
  yearsOfExperience,
  facility = '小原病院',
  department = '内科',
  position = '看護師',
  onSelectSheet
}: EvaluationSheetSelectorProps) {
  const router = useRouter();
  const experienceCategory = getExperienceCategory(yearsOfExperience);
  const categoryLabel = getExperienceCategoryLabel(experienceCategory);
  
  // 施設タイプの判定（実際のデータに基づいて調整が必要）
  const facilityType = 'acute'; // 現在は急性期のみ対応
  const jobType = 'nurse'; // 現在は看護師のみ対応
  
  const evaluationSheet = selectEvaluationSheet(experienceCategory, facilityType, jobType);

  const handleSelectSheet = () => {
    if (!evaluationSheet) return;
    
    const sheetPath = `/evaluation-sheets/${facilityType}/${jobType}/${experienceCategory}`;
    
    if (onSelectSheet) {
      onSelectSheet(sheetPath);
    } else {
      // 評価シートページへ遷移
      router.push(sheetPath);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>評価シート選択</CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          {staffName}さん（経験年数: {yearsOfExperience}年 - {categoryLabel}）
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 職員情報 */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Building className="h-4 w-4 text-gray-500" />
            <span>施設: {facility} - {department}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <UserCheck className="h-4 w-4 text-gray-500" />
            <span>職種: {position}</span>
          </div>
        </div>

        {evaluationSheet ? (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              対応する評価シート
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-blue-800">{evaluationSheet.title}</p>
                <p className="text-sm text-blue-600 mt-1">
                  パターン5改良版 - ハイブリッド型（技術50点＋組織貢献50点）
                </p>
              </div>
              <Button
                onClick={handleSelectSheet}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                評価シートを開く
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-1">
                  評価シート未実装
                </h3>
                <p className="text-sm text-yellow-700">
                  現在、急性期病棟の看護師のみ評価シートが利用可能です。
                  他の施設タイプ・職種の評価シートは準備中です。
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 今後の実装予定 */}
        <div className="text-sm text-gray-500">
          <p className="font-medium mb-1">実装予定:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>慢性期病棟の評価シート</li>
            <li>介護老人保健施設の評価シート</li>
            <li>准看護師・看護補助者の評価シート</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}