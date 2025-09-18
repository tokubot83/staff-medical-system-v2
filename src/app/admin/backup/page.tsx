/**
 * バックアップ・復元管理ページ
 * システム全体のデータバックアップと復元機能を提供
 */

'use client';

import React from 'react';
import BackupRestore from '@/components/data-management/BackupRestore';

export default function BackupPage() {
  const handleRestoreComplete = () => {
    // 復元完了後の処理
    window.location.reload();
  };

  return (
    <div>
      
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* バックアップ・復元インターフェース */}
        <BackupRestore onRestoreComplete={handleRestoreComplete} />
      </div>
    </div>
  );
}