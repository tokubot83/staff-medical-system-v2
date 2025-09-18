'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Database, Download, Link2, History, Calendar,
  Shield, Settings, FileText, Share2, Home, StickyNote, Clock
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

const sidebarMenuItems = [
  {
    href: '/admin',
    label: 'ダッシュボード',
    icon: Home,
    description: '管理者ダッシュボード'
  },
  {
    href: '/admin/dev-notes',
    label: '開発メモ',
    icon: StickyNote,
    description: '開発ノートとメモ'
  },
  {
    href: '/admin/documents',
    label: '保存書類',
    icon: FileText,
    description: 'システムドキュメント'
  },
  {
    href: '/admin/mcp-shared',
    label: 'MCP共有',
    icon: Share2,
    description: '連携システム情報'
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [latestDates, setLatestDates] = useState<{ saved: string | null; mcp: string | null }>({
    saved: null,
    mcp: null
  });

  useEffect(() => {
    fetchLatestDates();
  }, []);

  const fetchLatestDates = async () => {
    try {
      const response = await fetch('/api/documents/latest');
      const data = await response.json();
      setLatestDates({
        saved: data.saved ? new Date(data.saved).toISOString() : null,
        mcp: data.mcp ? new Date(data.mcp).toISOString() : null
      });
    } catch (error) {
      console.error('Failed to fetch latest dates:', error);
    }
  };

  const formatRelativeDate = (dateString: string | null) => {
    if (!dateString) return null;

    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return '今日更新';
    if (diffDays === 1) return '昨日更新';
    if (diffDays < 7) return `${diffDays}日前更新`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}週間前更新`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}ヶ月前更新`;
    return `${Math.floor(diffDays / 365)}年前更新`;
  };

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

      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 min-h-screen">
          <div className="p-4">
            <div className="space-y-1">
              {sidebarMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                // Get the latest date for documents and mcp-shared items
                let latestDate = null;
                if (item.href === '/admin/documents') {
                  latestDate = formatRelativeDate(latestDates.saved);
                } else if (item.href === '/admin/mcp-shared') {
                  latestDate = formatRelativeDate(latestDates.mcp);
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                      ${isActive
                        ? 'bg-blue-100 text-blue-700 font-semibold'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{item.label}</span>
                        {latestDate && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {latestDate}
                          </span>
                        )}
                      </div>
                      {isActive && (
                        <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="text-xs text-gray-500 mb-2">管理機能</div>
              <div className="space-y-1">
                {adminMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 text-sm
                        ${isActive
                          ? 'bg-blue-100 text-blue-700 font-semibold'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }
                      `}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
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
      </div>
    </div>
  );
}