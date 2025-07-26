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

function GenerationAnalysisContent() {
  const searchParams = useSearchParams();
  const facilityParam = searchParams.get('facility') || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="世代別特性分析" />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold">世代別特性分析</h1>
            <p className="text-gray-600 mt-2">Z世代、ミレニアル世代など世代別の特性と組織適応を分析</p>
            {facilityParam && (
              <p className="text-sm text-gray-500 mt-1">対象施設: {facilityParam}</p>
            )}
          </div>

          {/* プレースホルダー */}
          <Card>
            <CardHeader>
              <CardTitle>世代別エンゲージメント分析</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-gray-500">世代別特性分析機能は開発中です</p>
              </div>
            </CardContent>
          </Card>

          {/* アクションボタン */}
          <div className="flex gap-4">
            <button 
              onClick={() => exportToPDF({
                title: '世代別特性分析レポート',
                facility: facilityParam || '全施設',
                reportType: 'generation-analysis',
                elementId: 'report-content',
                dateRange: new Date().toLocaleDateString('ja-JP')
              })}
              className="pdf-exclude bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              PDFダウンロード
            </button>
          </div>

        </div>
      </div>
      
      <ScrollToTopButton />
      <CategoryTopButton categoryPath="/reports/cohort-analysis" categoryName="コホート分析" />
      <BackToReportsButton />
      <DashboardButton />
    </div>
  );
}

export default function GenerationAnalysisPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GenerationAnalysisContent />
    </Suspense>
  );
}