'use client';

import React from 'react';
import PersonalDashboard from '@/components/dashboard/PersonalDashboard';

export default function PersonalDashboardPage() {
  // 実際の実装では、ログインユーザーの情報を取得
  const employeeId = 'E001';
  const employeeName = '山田 太郎';

  return (
    <div className="min-h-screen bg-gray-50">
      <PersonalDashboard 
        employeeId={employeeId}
        employeeName={employeeName}
      />
    </div>
  );
}