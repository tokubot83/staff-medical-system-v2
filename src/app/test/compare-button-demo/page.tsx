'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import InterviewSheetModal from '@/components/InterviewSheetModal';

export default function CompareButtonDemoPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>前回面談シート比較ボタン確認デモ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
              <h3 className="font-bold text-yellow-800 mb-2">⚠️ 重要な確認</h3>
              <p className="text-yellow-700 mb-2">
                比較ボタンが表示される条件：
              </p>
              <ul className="list-disc list-inside text-sm text-yellow-600 space-y-1">
                <li>staffIdが設定されている</li>
                <li>interviewTypeが設定されている</li>
                <li>experienceCategoryが設定されている</li>
              </ul>
            </div>

            <Button 
              onClick={() => setShowModal(true)}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              🎯 InterviewSheetModalを開く（比較ボタン付き）
            </Button>

            <div className="bg-blue-50 p-4 rounded border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">ボタンの場所</h4>
              <p className="text-blue-700 text-sm">
                モーダルが開いたら、ヘッダーの右上を見てください：
              </p>
              <ul className="list-disc list-inside text-sm text-blue-600 mt-2">
                <li>印刷ボタン（プリンターアイコン）の左側</li>
                <li>GitCompareアイコン（2つの四角が並んだアイコン）</li>
                <li>ホバーすると「前回面談シート表示」と表示</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* InterviewSheetModal with all required props for comparison button */}
      <InterviewSheetModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        sheetName="テスト面談シート"
        sheetPath="v4_interview/general-nurse-unified-30min.tsx"
        
        // 比較ボタン表示に必要なプロパティ
        staffId="STAFF_001"
        staffName="田中花子"
        interviewType="regular_annual"
        interviewId="INT_001"
        experienceCategory="general"
        duration={30}
        yearsOfExperience={3}
      />
    </div>
  );
}