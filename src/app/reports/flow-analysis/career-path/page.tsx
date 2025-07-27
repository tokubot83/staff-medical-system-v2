'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CommonHeader from '@/components/CommonHeader';
import DashboardButton from '@/components/DashboardButton';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import { BackToReportsButton } from '@/components/BackToReportsButton';
import { exportToPDF } from '@/utils/pdfExport';
import { CareerPathAnalysis } from '@/components/flow-analysis/CareerPathAnalysis';
import { CareerProgressStats } from '@/components/flow-analysis/CareerProgressStats';

function Content() {
  const searchParams = useSearchParams();
  const facilityParam = searchParams.get('facility') || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="キャリアパス分析" />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">キャリアパス分析</h1>
                <p className="text-gray-600 mt-2">職員のキャリア形成パターンを分析し、効果的なキャリア開発を支援</p>
                {facilityParam && (
                  <p className="text-sm text-gray-500 mt-1">対象施設: {facilityParam}</p>
                )}
              </div>
              <button
                onClick={() => exportToPDF({
                  title: 'キャリアパス分析レポート',
                  facility: facilityParam,
                  reportType: 'career-path',
                  elementId: 'report-content',
                  dateRange: new Date().toLocaleDateString('ja-JP')
                })}
                className="pdf-exclude bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
              >
                PDFダウンロード
              </button>
            </div>
          </div>

          {/* キャリアパス分析 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>職種別キャリアパス分析</CardTitle>
              </CardHeader>
              <CardContent>
                <CareerPathAnalysis facility={facilityParam} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>キャリア進捗統計</CardTitle>
              </CardHeader>
              <CardContent>
                <CareerProgressStats facility={facilityParam} />
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
      
      <ScrollToTopButton />
      <CategoryTopButton categoryPath="/reports/flow-analysis" categoryName="人材フロー" />
      <BackToReportsButton />
      <DashboardButton />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Content />
    </Suspense>
  );
}