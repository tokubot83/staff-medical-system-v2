'use client';

/**
 * 健康診断詳細ページ - リダイレクト
 * 職員カルテの健康診断タブに自動リダイレクトします
 * Created: 2025-09-30
 */

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function HealthStaffRedirect() {
  const router = useRouter();
  const params = useParams();
  const staffId = params.staffId;

  useEffect(() => {
    // 職員カルテの健診タブにリダイレクト
    if (staffId) {
      router.replace(`/staff-cards/${staffId}?category=health&tab=health-checkup`);
    }
  }, [router, staffId]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg font-medium">職員カルテに移動しています...</p>
        <p className="text-gray-500 text-sm mt-2">健康診断タブを開きます</p>
      </div>
    </div>
  );
}