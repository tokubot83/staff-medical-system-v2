'use client';

import React from 'react';
import Link from 'next/link';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header - 固定表示 */}
      <div className="sticky top-0 z-50">
        {/* Header Title */}
        <header className="bg-gray-700 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center h-16">
              <h1 className="text-2xl font-bold">職員カルテシステム</h1>
              <span className="ml-4 text-sm text-gray-300">医療法人厚生会</span>
            </div>
          </div>
        </header>

        {/* Navigation - 1列構成 */}
        <nav className="bg-gray-800 text-white shadow-md">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center h-12 lg:h-12 md:h-auto md:flex-wrap">
              <div className="flex space-x-1">
                <Link href="/notifications" className="hover:bg-gray-700 px-4 py-3 text-sm font-medium transition-colors border-b-3 border-transparent hover:border-purple-400">
                  お知らせ配信
                </Link>
                <Link href="/staff-cards" className="hover:bg-gray-700 px-4 py-3 text-sm font-medium transition-colors border-b-3 border-transparent hover:border-blue-400">
                  カルテ
                </Link>
                <Link href="/recruitment" className="hover:bg-gray-700 px-4 py-3 text-sm font-medium transition-colors border-b-3 border-transparent hover:border-blue-400">
                  採用
                </Link>
                <Link href="/interviews" className="hover:bg-gray-700 px-4 py-3 text-sm font-medium transition-colors border-b-3 border-transparent hover:border-blue-400">
                  面談
                </Link>
                <Link href="/education" className="hover:bg-gray-700 px-4 py-3 text-sm font-medium transition-colors border-b-3 border-transparent hover:border-blue-400">
                  教育・研修
                </Link>
                <Link href="/goals" className="hover:bg-gray-700 px-4 py-3 text-sm font-medium transition-colors border-b-3 border-transparent hover:border-blue-400">
                  目標
                </Link>
                <Link href="/health" className="hover:bg-gray-700 px-4 py-3 text-sm font-medium transition-colors border-b-3 border-transparent hover:border-blue-400">
                  健康
                </Link>
                <Link href="/attendance-management" className="hover:bg-gray-700 px-4 py-3 text-sm font-medium transition-colors border-b-3 border-transparent hover:border-blue-400">
                  勤怠
                </Link>
                <Link href="/dashboard" className="hover:bg-gray-700 px-4 py-3 text-sm font-medium transition-colors border-b-3 border-transparent hover:border-purple-400">
                  評価
                </Link>
                <Link href="/reports" className="hover:bg-gray-700 px-4 py-3 text-sm font-medium transition-colors border-b-3 border-transparent hover:border-blue-400">
                  レポート
                </Link>
                <Link href="/hr-system-guide" className="hover:bg-gray-700 px-4 py-3 text-sm font-medium transition-colors border-b-3 border-transparent hover:border-blue-400">
                  ガイド
                </Link>
                <Link href="/admin/master-data" className="hover:bg-gray-700 px-4 py-3 text-sm font-medium transition-colors border-b-3 border-transparent hover:border-amber-400">
                  管理者設定
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Main content */}
      {children}
    </div>
  );
}