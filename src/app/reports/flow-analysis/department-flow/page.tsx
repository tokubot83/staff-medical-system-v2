'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CommonHeader from '@/components/CommonHeader';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import { exportToPDF } from '@/utils/pdfExport';
import { DepartmentFlowChart } from '@/components/flow-analysis/DepartmentFlowChart';
import { DepartmentFlowStats } from '@/components/flow-analysis/DepartmentFlowStats';
import { DepartmentStats } from '@/components/flow-analysis/DepartmentStats';

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
                <p className="text-gray-600 mt-2">部署間�E人材移動パターンを可視化し、絁E���Eの人材流動性を�E极E/p>
                {facilityParam && (
                  <p className="text-sm text-gray-500 mt-1">対象施設: {facilityParam}</p>
                )}
              </div>
              <button
                onClick={() => exportToPDF({
                  title: '部署間異動フローレポ�EチE,
                  facility: facilityParam,
                  reportType: 'department-flow',
                  elementId: 'report-content',
                  dateRange: new Date().toLocaleDateString('ja-JP')
                })}
                className="pdf-exclude bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
              >
                PDFダウンローチE              </button>
            </div>
          </div>

          {/* 部署間異動フロー統訁E*/}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>部署間異動フロー</CardTitle>
              </CardHeader>
              <CardContent>
                <DepartmentFlowChart facility={facilityParam} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>異動統計サマリー</CardTitle>
              </CardHeader>
              <CardContent>
                <DepartmentFlowStats facility={facilityParam} />
              </CardContent>
            </Card>
          </div>

          {/* 部署別統訁E*/}
          <Card>
            <CardHeader>
              <CardTitle>部署別異動統訁E/CardTitle>
            </CardHeader>
            <CardContent>
              <DepartmentStats facility={facilityParam} />
            </CardContent>
          </Card>

        </div>
      </div><CategoryTopButton categoryPath="/reports/flow-analysis" categoryName="人材フロー" /></div>
  );
}

export default function DepartmentFlowPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DepartmentFlowContent />
    </Suspense>
  );
}