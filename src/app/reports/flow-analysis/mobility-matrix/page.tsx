'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CommonHeader from '@/components/CommonHeader';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import { exportToPDF } from '@/utils/pdfExport';
import TalentFlowSection from '@/components/talent-flow/TalentFlowSection';

function Content() {
  const searchParams = useSearchParams();
  const facilityParam = searchParams.get('facility') || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="人材モビリチE��マトリチE��ス" />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">人材モビリチE��マトリチE��ス</h1>
                <p className="text-gray-600 mt-2">職位�E職種間�E移動可能性を評価し、戦略皁E��人材�E置を支援</p>
                {facilityParam && (
                  <p className="text-sm text-gray-500 mt-1">対象施設: {facilityParam}</p>
                )}
              </div>
              <button
                onClick={() => exportToPDF({
                  title: '人材モビリチE��マトリチE��スレポ�EチE,
                  facility: facilityParam,
                  reportType: 'mobility-matrix',
                  elementId: 'report-content',
                  dateRange: new Date().toLocaleDateString('ja-JP')
                })}
                className="pdf-exclude bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
              >
                PDFダウンローチE              </button>
            </div>
          </div>

          {/* 人材フローセクション */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <TalentFlowSection />
          </div>

        </div>
      </div><CategoryTopButton categoryPath="/reports/flow-analysis" categoryName="人材フロー" /></div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Content />
    </Suspense>
  );
}