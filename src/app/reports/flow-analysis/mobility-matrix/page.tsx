'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CommonHeader from '@/components/CommonHeader';
import DashboardButton from '@/components/DashboardButton';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import CategoryTopButton from '@/components/reports/CategoryTopButton';

function Content() {
  const searchParams = useSearchParams();
  const facilityParam = searchParams.get('facility') || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="人材モビリティマトリックス" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold">人材モビリティマトリックス</h1>
            <p className="text-gray-600 mt-2">職位・職種間の移動可能性を評価し、戦略的な人材配置を支援</p>
            {facilityParam && (
              <p className="text-sm text-gray-500 mt-1">対象施設: {facilityParam}</p>
            )}
          </div>

          {/* プレースホルダー */}
          <Card>
            <CardHeader>
              <CardTitle>人材モビリティマトリックス分析</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-gray-500">人材モビリティマトリックス機能は開発中です</p>
              </div>
            </CardContent>
          </Card>

          {/* カテゴリトップへ戻るボタン */}
          <div className="mt-8">
            <CategoryTopButton categoryPath="/reports/flow-analysis" categoryName="人材フロー" />
          </div>
        </div>
      </div>
      
      <ScrollToTopButton />
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