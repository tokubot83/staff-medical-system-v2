'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Database, Download, Link2, History, Calendar,
  Shield, ChevronRight, Home, Settings
} from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
                <Home className="h-5 w-5" />
                <span>ホーム</span>
              </Link>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-gray-700" />
                <span className="font-semibold text-gray-900">管理者設定</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-amber-600" />
              <span className="text-sm font-medium text-amber-600">管理者モード</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto" aria-label="Admin navigation">
            {adminMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center px-1 py-4 text-sm font-medium border-b-2 whitespace-nowrap
                    ${isActive 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {children}
    </div>
  );
}