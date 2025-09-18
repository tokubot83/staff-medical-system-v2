'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Database, Download, Link2, History, Calendar,
  Shield, Settings
} from 'lucide-react';
import BreadcrumbBar from '@/components/navigation/BreadcrumbBar';

const adminMenuItems = [
  { 
    href: '/admin/master-data', 
    label: 'マスターデータ管理', 
    icon: Database,
    description: '各種マスターデータの管理'
  },
  { 
    href: '/admin/backup', 
    label: 'バックアップ・リストア', 
    icon: Download,
    description: 'データのバックアップと復元'
  },
  { 
    href: '/admin/integration', 
    label: '外部システム連携', 
    icon: Link2,
    description: 'API連携の設定'
  },
  { 
    href: '/admin/audit-log', 
    label: '監査ログ', 
    icon: History,
    description: '操作履歴の確認'
  },
  { 
    href: '/admin/scheduler', 
    label: 'スケジューラー', 
    icon: Calendar,
    description: 'バッチ処理の管理'
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-white">
      <BreadcrumbBar />

      <div className="bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-gray-700" />
              <span className="font-semibold text-gray-900">管理者設定</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-amber-600" />
              <span className="text-sm font-medium text-amber-600">管理者モード</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="flex bg-white rounded-2xl shadow-lg mb-6 overflow-hidden border border-gray-100">
          {adminMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex-1 p-5 font-semibold transition-all duration-300 hover:transform hover:-translate-y-1
                  flex items-center justify-center gap-3 whitespace-nowrap
                  ${isActive
                    ? 'bg-gradient-to-b from-blue-50 to-blue-100 border-b-4 border-blue-500 text-blue-600'
                    : 'bg-transparent text-gray-600 hover:bg-gradient-to-b hover:from-gray-50 hover:to-gray-100 hover:text-blue-600'
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {children}
    </div>
  );
}