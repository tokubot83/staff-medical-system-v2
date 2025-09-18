'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CommonHeader from '@/components/CommonHeader';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import { exportToPDF } from '@/utils/pdfExport';
import { CareerPathAnalysis } from '@/components/flow-analysis/CareerPathAnalysis';
import { CareerProgressStats } from '@/components/flow-analysis/CareerProgressStats';

function Content() {
  const searchParams = useSearchParams();
  const facilityParam = searchParams.get('facility') || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="繧ｭ繝｣繝ｪ繧｢繝代せ蛻・梵" />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* 繝倥ャ繝繝ｼ */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">繧ｭ繝｣繝ｪ繧｢繝代せ蛻・梵</h1>
                <p className="text-gray-600 mt-2">閨ｷ蜩｡縺ｮ繧ｭ繝｣繝ｪ繧｢蠖｢謌舌ヱ繧ｿ繝ｼ繝ｳ繧貞・譫舌＠縲∝柑譫懃噪縺ｪ繧ｭ繝｣繝ｪ繧｢髢狗匱繧呈髪謠ｴ</p>
                {facilityParam && (
                  <p className="text-sm text-gray-500 mt-1">蟇ｾ雎｡譁ｽ險ｭ: {facilityParam}</p>
                )}
              </div>
              <button
                onClick={() => exportToPDF({
                  title: '繧ｭ繝｣繝ｪ繧｢繝代せ蛻・梵繝ｬ繝昴・繝・,
                  facility: facilityParam,
                  reportType: 'career-path',
                  elementId: 'report-content',
                  dateRange: new Date().toLocaleDateString('ja-JP')
                })}
                className="pdf-exclude bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
              >
                PDF繝繧ｦ繝ｳ繝ｭ繝ｼ繝・              </button>
            </div>
          </div>

          {/* 繧ｭ繝｣繝ｪ繧｢繝代せ蛻・梵 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>閨ｷ遞ｮ蛻･繧ｭ繝｣繝ｪ繧｢繝代せ蛻・梵</CardTitle>
              </CardHeader>
              <CardContent>
                <CareerPathAnalysis facility={facilityParam} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>繧ｭ繝｣繝ｪ繧｢騾ｲ謐礼ｵｱ險・/CardTitle>
              </CardHeader>
              <CardContent>
                <CareerProgressStats facility={facilityParam} />
              </CardContent>
            </Card>
          </div>

        </div>
      </div><CategoryTopButton categoryPath="/reports/flow-analysis" categoryName="莠ｺ譚舌ヵ繝ｭ繝ｼ" /></div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Content />
    </Suspense>
  );
}