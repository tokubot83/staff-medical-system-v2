'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Database, Download, Link2, History, Calendar,
  Shield, Settings, FileText, Share2, Home, StickyNote, Clock,
  BarChart3, FolderOpen, Cog, Brain, TrendingUp, Heart,
  MessageSquare, Image, Users, AlertTriangle, Server, ArrowRightLeft,
  Cloud, Bell
} from 'lucide-react';

// サイドバーのメニュー構造（機能別グループ化）
const sidebarMenuGroups = [
  {
    title: null, // ダッシュボードは単独
    icon: BarChart3,
    items: [
      {
        href: '/admin',
        label: 'ダッシュボード',
        icon: Home,
        description: '管理者ダッシュボード'
      }
    ]
  },
  {
    title: '人事・評価機能',
    icon: Users,
    items: [
      {
        href: '/admin/career-courses',
        label: 'キャリアコース管理',
        icon: TrendingUp,
        description: 'A/B/C/Dコース設定'
      },
      {
        href: '/admin/interview-bank',
        label: '面談バンク管理',
        icon: MessageSquare,
        description: '面談シート・質問バンク'
      },
      {
        href: '/admin/compliance-master',
        label: 'コンプライアンス',
        icon: AlertTriangle,
        description: '通報・異議申立管理'
      }
    ]
  },
  {
    title: 'ドキュメント管理',
    icon: FolderOpen,
    items: [
      {
        href: '/admin/documents',
        label: '保存書類',
        icon: FileText,
        description: 'システムドキュメント'
      },
      {
        href: '/admin/mcp-shared',
        label: 'MCP共有フォルダ',
        icon: Share2,
        description: '連携システム情報'
      },
      {
        href: '/admin/image-management',
        label: '画像管理',
        icon: Image,
        description: 'システム画像・ファイル'
      }
    ]
  },
  {
    title: 'Lightsail統合環境',
    icon: Cloud,
    items: [
      {
        href: '/admin/mcp-server',
        label: 'MCP共通サーバー',
        icon: Server,
        description: 'MCP統合管理'
      },
      {
        href: '/admin/integration-hub',
        label: 'システム連携ハブ',
        icon: ArrowRightLeft,
        description: '連携システム管理'
      },
      {
        href: '/admin/database',
        label: '共通DB管理',
        icon: Database,
        description: 'データベース管理'
      },
      {
        href: '/admin/deployment',
        label: '環境・デプロイ',
        icon: Cloud,
        description: 'デプロイ管理'
      },
      {
        href: '/admin/notifications',
        label: '通知・アラート',
        icon: Bell,
        description: 'アラート設定'
      }
    ]
  },
  {
    title: 'システム設定',
    icon: Cog,
    items: [
      {
        href: '/admin/ai-settings',
        label: 'AI設定',
        icon: Brain,
        description: 'AI機能の設定'
      },
      {
        href: '/admin/integration',
        label: 'API管理',
        icon: Link2,
        description: 'API連携・管理'
      },
      {
        href: '/admin/master-data',
        label: 'マスターデータ',
        icon: Database,
        description: '各種マスターデータ'
      },
      {
        href: '/admin/audit-log',
        label: '監査ログ',
        icon: History,
        description: '操作履歴の確認'
      }
    ]
  },
  {
    title: '開発者向け',
    icon: StickyNote,
    items: [
      {
        href: '/admin/dev-notes',
        label: '開発メモ',
        icon: StickyNote,
        description: '実装記録・メモ'
      }
    ]
  }
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
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 border-b border-blue-800 shadow-md">
        <div className="px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center space-x-3">
              <Settings className="h-5 w-5 text-white" />
              <span className="font-bold text-white text-lg">管理者設定</span>
            </div>
            <div className="flex items-center space-x-2 bg-blue-800 bg-opacity-50 px-3 py-1.5 rounded-full">
              <Shield className="h-4 w-4 text-yellow-300" />
              <span className="text-sm font-medium text-yellow-100">管理者モード</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar - 機能別グループ化 */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen shadow-sm">
          <div className="p-4 space-y-6">
            {sidebarMenuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                {/* グループタイトル */}
                {group.title && (
                  <div className="flex items-center gap-2 px-2 mb-3 mt-1">
                    <group.icon className="h-4 w-4 text-gray-400" />
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      {group.title}
                    </span>
                  </div>
                )}

                {/* グループ内のアイテム */}
                <div className="space-y-1">
                  {group.items.map((item) => {
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
                          flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                          ${isActive
                            ? 'bg-blue-600 text-white font-medium shadow-md'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          }
                          ${group.title ? 'ml-3' : ''}
                        `}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-sm truncate">
                              {item.label}
                            </span>
                            {latestDate && !isActive && (
                              <span className="text-xs text-gray-500 flex items-center gap-1 ml-2">
                                <Clock className="h-3 w-3" />
                                {latestDate}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* セクション区切り */}
                {groupIndex < sidebarMenuGroups.length - 1 && (
                  <div className="my-4 border-b border-gray-200" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-gray-50">
          {children}
        </div>
      </div>
    </div>
  );
}