'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import FacilitySelector from '@/components/reports/FacilitySelector';
function TalentQualityPageContent() {
  const searchParams = useSearchParams();
  const selectedFacility = searchParams.get('facility') || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="人材�E質" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">⭁E/span>
            <h1 className="text-2xl font-bold text-gray-900">人材�E質</h1>
          </div>
          <p className="text-gray-600">
            職員満足度、スキル評価、賁E��保有状況を刁E��します、E
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
            <h3 className="text-lg font-semibold mb-2">職員満足度</h3>
            <p className="text-3xl font-bold text-green-600">4.2/5.0</p>
            <p className="text-sm text-gray-600 mt-2">前回調査毁E +0.3pt</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">平坁E��キル評価</h3>
            <p className="text-3xl font-bold text-blue-600">3.8/5.0</p>
            <p className="text-sm text-gray-600 mt-2">前年同期毁E +0.2pt</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">専門賁E��保有玁E/h3>
            <p className="text-3xl font-bold text-purple-600">82.5%</p>
            <p className="text-sm text-gray-600 mt-2">前年同期毁E +3.2pt</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">研修参加玁E/h3>
            <p className="text-3xl font-bold text-indigo-600">91.3%</p>
            <p className="text-sm text-gray-600 mt-2">目標達成率: 101.4%</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">推奨意向度(eNPS)</h3>
            <p className="text-3xl font-bold text-orange-600">+15</p>
            <p className="text-sm text-gray-600 mt-2">業界平坁E +10</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">リーダー候補率</h3>
            <p className="text-3xl font-bold text-teal-600">23.4%</p>
            <p className="text-sm text-gray-600 mt-2">次世代リーダー育成中</p>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">賁E��保有状況E/h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>看護師賁E��</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                </div>
                <span className="font-semibold">95%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>専門看護師</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
                <span className="font-semibold">35%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>認定看護師</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '42%' }}></div>
                </div>
                <span className="font-semibold">42%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>管琁E�E研修修亁E/span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{ width: '68%' }}></div>
                </div>
                <span className="font-semibold">68%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">満足度の冁E��</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>職場環墁E/span>
              <span className="font-semibold text-green-600">4.3/5.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span>給与�E福利厚生</span>
              <span className="font-semibold text-yellow-600">3.8/5.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span>キャリア開発</span>
              <span className="font-semibold text-green-600">4.1/5.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span>上司との関俁E/span>
              <span className="font-semibold text-green-600">4.4/5.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span>仕事�EめE��がい</span>
              <span className="font-semibold text-green-600">4.5/5.0</span>
            </div>
          </div>
        </div>
      </div></div>
  );
}

export default function TalentQualityPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TalentQualityPageContent />
    </Suspense>
  );
}