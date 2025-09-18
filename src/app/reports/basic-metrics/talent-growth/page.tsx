'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import FacilitySelector from '@/components/reports/FacilitySelector';
function TalentGrowthPageContent() {
  const searchParams = useSearchParams();
  const selectedFacility = searchParams.get('facility') || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="人材�E成長" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">📈</span>
            <h1 className="text-2xl font-bold text-gray-900">人材�E成長</h1>
          </div>
          <p className="text-gray-600">
            研修受講率、スキル向上度、キャリア開発状況を確認します、E
          </p>
        </div>

        <div className="mb-8">
          <FacilitySelector
            selectedFacility={selectedFacility}
            onFacilityChange={() => {}}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">年間研修受講率</h3>
            <p className="text-3xl font-bold text-blue-600">87.3%</p>
            <p className="text-sm text-gray-600 mt-2">目樁E 85%以丁E/p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">平坁E��修時間</h3>
            <p className="text-3xl font-bold text-green-600">42.5時間</p>
            <p className="text-sm text-gray-600 mt-2">前年同期毁E +5.3時間</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">スキル向上率</h3>
            <p className="text-3xl font-bold text-purple-600">78.2%</p>
            <p className="text-sm text-gray-600 mt-2">評価向上老E�E割吁E/p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">賁E��取得老E��</h3>
            <p className="text-3xl font-bold text-orange-600">156人</p>
            <p className="text-sm text-gray-600 mt-2">年間目樁E 150人</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">昁E��・昁E��玁E/h3>
            <p className="text-3xl font-bold text-indigo-600">12.4%</p>
            <p className="text-sm text-gray-600 mt-2">前年同期毁E +1.8pt</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">キャリア面諁E��施玁E/h3>
            <p className="text-3xl font-bold text-teal-600">95.6%</p>
            <p className="text-sm text-gray-600 mt-2">年2回以上実施</p>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">研修カチE��リ別受講状況E/h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>忁E��研修</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '98%' }}></div>
                </div>
                <span className="font-semibold">98%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>専門スキル研修</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '82%' }}></div>
                </div>
                <span className="font-semibold">82%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>リーダーシチE�E研修</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <span className="font-semibold">65%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>外部研修・学企E/span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{ width: '43%' }}></div>
                </div>
                <span className="font-semibold">43%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">キャリアパス進捁E/h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>初紁EↁE中紁E/span>
              <span className="font-semibold text-green-600">達�E玁E 85%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>中紁EↁE上紁E/span>
              <span className="font-semibold text-blue-600">達�E玁E 72%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>上紁EↁE管琁E�E</span>
              <span className="font-semibold text-purple-600">達�E玁E 68%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>スペシャリストコース</span>
              <span className="font-semibold text-orange-600">選択率: 23%</span>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">成長支援プログラム</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold">メンター制度</h4>
              <p className="text-sm text-gray-600">参加老E 234人 (満足度: 4.3/5.0)</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold">OJTプログラム</h4>
              <p className="text-sm text-gray-600">実施玁E 92% (効果測宁E 良好)</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold">自己啓発支援</h4>
              <p className="text-sm text-gray-600">利用老E 189人 (補助金活用玁E 76%)</p>
            </div>
            <div className="border-l-4 border-orange-500 pl-4">
              <h4 className="font-semibold">キャリアコンサルチE��ング</h4>
              <p className="text-sm text-gray-600">相諁E��数: 312件 (解決玁E 89%)</p>
            </div>
          </div>
        </div>
      </div></div>
  );
}

export default function TalentGrowthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TalentGrowthPageContent />
    </Suspense>
  );
}