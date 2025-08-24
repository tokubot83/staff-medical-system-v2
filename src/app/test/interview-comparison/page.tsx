'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DemoDataLoader from '@/components/demo/DemoDataLoader';
import InterviewSheetModal from '@/components/InterviewSheetModal';
import { demoStaffProfiles } from '@/data/demoInterviewData';
import { User, Calendar, FileText, GitCompare } from 'lucide-react';

// テスト用のexperienceCategoryマッピング
const getExperienceCategory = (experienceYears: number): any => {
  if (experienceYears <= 1) return 'new';
  if (experienceYears <= 3) return 'general';
  if (experienceYears <= 7) return 'veteran';
  return 'chief';
};

export default function InterviewComparisonTestPage() {
  const [selectedStaff, setSelectedStaff] = useState<typeof demoStaffProfiles[0] | null>(null);
  const [selectedInterviewType, setSelectedInterviewType] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const handleTestInterview = (staff: typeof demoStaffProfiles[0], interviewType: string) => {
    console.log(`[TestPage] Testing ${staff.staffName} with ${interviewType}`);
    setSelectedStaff({...staff});
    setSelectedInterviewType(interviewType);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStaff(null);
  };

  const testCases = [
    {
      interviewType: 'regular_annual',
      displayName: '年次面談',
      description: '前回の年次面談データと比較表示',
      staffFilter: (staff: any) => staff.experienceYears >= 2
    },
    {
      interviewType: 'new_employee_monthly',
      displayName: '新人月次面談',
      description: '前回の新人月次面談データと比較表示',
      staffFilter: (staff: any) => staff.experienceYears <= 2
    },
    {
      interviewType: 'management_biannual',
      displayName: '管理職面談',
      description: '前回の管理職面談データと比較表示',
      staffFilter: (staff: any) => staff.position.includes('主任') || staff.experienceYears >= 8
    },
    {
      interviewType: 'career_support',
      displayName: 'キャリア支援面談',
      description: '前回のキャリア支援面談データと比較表示',
      staffFilter: (staff: any) => staff.experienceYears >= 3
    }
  ];

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          面談シート比較機能テスト
        </h1>
        <p className="text-gray-600">
          前回面談シートとの比較表示機能をテストできます。
          まず、デモデータを読み込んでから各テストケースを実行してください。
        </p>
      </div>

      {/* デモデータローダー */}
      <div className="mb-8">
        <DemoDataLoader onDataLoaded={() => setDataLoaded(true)} />
      </div>

      {dataLoaded && (
        <>
          {/* デバッグ情報 */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-sm">デバッグ情報</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs space-y-2">
                <div>
                  <strong>LocalStorageキー確認:</strong>
                  <div className="bg-gray-100 p-2 rounded mt-1">
                    {typeof window !== 'undefined' ? 
                      Object.keys(localStorage).filter(key => key.startsWith('staff_medical_interview_')).join(', ') || 'なし'
                      : 'サーバー側では確認できません'}
                  </div>
                </div>
                <div>
                  <strong>サンプルデータ (INT_001):</strong>
                  <div className="bg-gray-100 p-2 rounded mt-1 overflow-auto max-h-20">
                    {typeof window !== 'undefined' && localStorage.getItem('staff_medical_interview_INT_001') ? 
                      JSON.stringify(JSON.parse(localStorage.getItem('staff_medical_interview_INT_001')!), null, 2) : 'なし'}
                  </div>
                </div>
                <div>
                  <strong>面談データサマリー:</strong>
                  <div className="bg-gray-100 p-2 rounded mt-1">
                    {typeof window !== 'undefined' ? (
                      <div className="space-y-1">
                        {Object.keys(localStorage).filter(key => key.startsWith('staff_medical_interview_INT_'))
                          .sort()
                          .map(key => {
                          const data = JSON.parse(localStorage.getItem(key)!);
                          return (
                            <div key={key} className={`text-xs p-1 rounded ${
                              data.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'
                            }`}>
                              <strong>{data.staffName} ({data.staffId})</strong><br/>
                              面談タイプ: <span className="font-mono">{data.interviewType}</span><br/>
                              ステータス: {data.status} | 実施日: {data.actualDate ? new Date(data.actualDate).toLocaleDateString('ja-JP') : '未実施'}
                            </div>
                          );
                        })}
                      </div>
                    ) : 'サーバー側では確認できません'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* テストケース一覧 */}
          <div className="grid gap-6 mb-8">
            {testCases.map(testCase => (
              <Card key={testCase.interviewType}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {testCase.displayName}のテスト
                  </CardTitle>
                  <p className="text-sm text-gray-600">{testCase.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {demoStaffProfiles
                      .filter(testCase.staffFilter)
                      .map(staff => (
                        <div
                          key={staff.staffId}
                          className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleTestInterview(staff, testCase.interviewType)}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <User className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-sm">{staff.staffName}</span>
                          </div>
                          <div className="text-xs text-gray-600 space-y-1">
                            <div>{staff.department}</div>
                            <div>{staff.position} - {staff.experienceYears}年目</div>
                          </div>
                          <Button
                            size="sm"
                            className="w-full mt-2"
                            variant="outline"
                          >
                            <GitCompare className="h-3 w-3 mr-1" />
                            比較テスト
                          </Button>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 機能説明 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitCompare className="h-5 w-5" />
                機能の動作確認ポイント
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">基本機能</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 面談シートモーダルの「比較」ボタンクリック</li>
                    <li>• 前回と今回のシートが並列表示される</li>
                    <li>• 同じタイプの直近面談データが取得される</li>
                    <li>• 初回面談の場合は適切なメッセージ表示</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">セクション同期機能</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 「次へ」ボタンで両方のシートが同期移動</li>
                    <li>• 「前へ」ボタンで両方のシートが同期移動</li>
                    <li>• 自動同期のオン/オフ切り替え</li>
                    <li>• セクションリセット機能</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">テストケース</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 田中花子: 年次面談の履歴あり</li>
                    <li>• 佐藤太郎: 新人月次面談の履歴あり</li>
                    <li>• 山田みどり: 管理職面談の履歴あり</li>
                    <li>• 鈴木健一: 複数タイプの面談履歴あり</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">エラーケース確認</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 履歴がない場合の初回メッセージ</li>
                    <li>• 異なるタイプの面談は除外される</li>
                    <li>• 完了済みの面談のみが対象</li>
                    <li>• データ読み込みエラーの処理</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* 面談シートモーダル */}
      {selectedStaff && (
        <InterviewSheetModal
          isOpen={showModal}
          onClose={handleCloseModal}
          sheetName={`${selectedStaff.staffName}の${selectedInterviewType}面談シート`}
          sheetPath="v4_interview/general-nurse-unified-30min.tsx"
          staffId={selectedStaff.staffId}
          staffName={selectedStaff.staffName}
          interviewType={selectedInterviewType}
          interviewId="TEST_CURRENT"
          experienceCategory={getExperienceCategory(selectedStaff.experienceYears)}
          duration={30}
          yearsOfExperience={selectedStaff.experienceYears}
        />
      )}
    </div>
  );
}