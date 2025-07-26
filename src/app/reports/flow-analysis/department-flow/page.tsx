'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CommonHeader from '@/components/CommonHeader';
import DashboardButton from '@/components/DashboardButton';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import CategoryTopButton from '@/components/reports/CategoryTopButton';

function DepartmentFlowContent() {
  const searchParams = useSearchParams();
  const facilityParam = searchParams.get('facility') || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="部署間異動フロー" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold">部署間異動フロー</h1>
            <p className="text-gray-600 mt-2">部署間の人材移動パターンを可視化し、組織内の人材流動性を分析</p>
            {facilityParam && (
              <p className="text-sm text-gray-500 mt-1">対象施設: {facilityParam}</p>
            )}
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

export default function DepartmentFlowPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DepartmentFlowContent />
    </Suspense>
  );
}