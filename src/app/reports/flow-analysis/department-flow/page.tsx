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

function DepartmentFlowContent() {
  const searchParams = useSearchParams();
  const facilityParam = searchParams.get('facility') || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="部署間異動フロー" />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">部署間異動フロー</h1>
                <p className="text-gray-600 mt-2">部署間の人材移動パターンを可視化し、組織内の人材流動性を分析</p>
                {facilityParam && (
                  <p className="text-sm text-gray-500 mt-1">対象施設: {facilityParam}</p>
                )}
              </div>
              <button
                onClick={() => exportToPDF({
                  title: '部署間異動フローレポート',
                  facility: facilityParam,
                  reportType: 'department-flow',
                  elementId: 'report-content',
                  dateRange: new Date().toLocaleDateString('ja-JP')
                })}
                className="pdf-exclude bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
              >
                PDFダウンロード
              </button>
            </div>
          </div>

          {/* プレースホルダー */}
          <Card>
            <CardHeader>
              <CardTitle>部署間異動フロー図</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-gray-500">部署間異動フロー分析機能は開発中です</p>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
      
      <ScrollToTopButton />
      <CategoryTopButton categoryPath="/reports/flow-analysis" categoryName="人材フロー" />
      <BackToReportsButton />
      <DashboardButton />
    </div>
  );
}

export default function DepartmentFlowPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DepartmentFlowContent />
    </Suspense>
  );
}