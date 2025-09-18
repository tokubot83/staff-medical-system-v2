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
      <CommonHeader title="莠ｺ譚舌Δ繝薙Μ繝・ぅ繝槭ヨ繝ｪ繝・け繧ｹ" />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* 繝倥ャ繝繝ｼ */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">莠ｺ譚舌Δ繝薙Μ繝・ぅ繝槭ヨ繝ｪ繝・け繧ｹ</h1>
                <p className="text-gray-600 mt-2">閨ｷ菴阪・閨ｷ遞ｮ髢薙・遘ｻ蜍募庄閭ｽ諤ｧ繧定ｩ穂ｾ｡縺励∵姶逡･逧・↑莠ｺ譚宣・鄂ｮ繧呈髪謠ｴ</p>
                {facilityParam && (
                  <p className="text-sm text-gray-500 mt-1">蟇ｾ雎｡譁ｽ險ｭ: {facilityParam}</p>
                )}
              </div>
              <button
                onClick={() => exportToPDF({
                  title: '莠ｺ譚舌Δ繝薙Μ繝・ぅ繝槭ヨ繝ｪ繝・け繧ｹ繝ｬ繝昴・繝・,
                  facility: facilityParam,
                  reportType: 'mobility-matrix',
                  elementId: 'report-content',
                  dateRange: new Date().toLocaleDateString('ja-JP')
                })}
                className="pdf-exclude bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
              >
                PDF繝繧ｦ繝ｳ繝ｭ繝ｼ繝・              </button>
            </div>
          </div>

          {/* 莠ｺ譚舌ヵ繝ｭ繝ｼ繧ｻ繧ｯ繧ｷ繝ｧ繝ｳ */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <TalentFlowSection />
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