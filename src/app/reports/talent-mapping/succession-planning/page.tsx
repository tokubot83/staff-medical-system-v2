'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CommonHeader from '@/components/CommonHeader';
import DashboardButton from '@/components/DashboardButton';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import { BackToReportsButton } from '@/components/BackToReportsButton';

function SuccessionPlanningContent() {
  const searchParams = useSearchParams();
  const facilityParam = searchParams.get('facility') || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="後継者計画" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold">後継者計画</h1>
            <p className="text-gray-600 mt-2">キーポジションの後継者候補を特定し、計画的な人材育成を支援</p>
            {facilityParam && (
              <p className="text-sm text-gray-500 mt-1">対象施設: {facilityParam}</p>
            )}
          </div>

          {/* プレースホルダー */}
          <Card>
            <CardHeader>
              <CardTitle>後継者候補マッピング</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-gray-500">後継者計画機能は開発中です</p>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
      
      <ScrollToTopButton />
      <CategoryTopButton categoryPath="/reports/talent-mapping" categoryName="タレントマッピング" />
      <BackToReportsButton />
      <DashboardButton />
    </div>
  );
}

export default function SuccessionPlanningPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessionPlanningContent />
    </Suspense>
  );
}