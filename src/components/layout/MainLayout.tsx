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
        <header className="bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 text-white shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-20"></div>
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="flex items-center h-20">
              <div className="flex items-center space-x-4">
                {/* Logo Icon */}
                <div className="w-12 h-12 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white border-opacity-20 shadow-lg">
                  <span className="text-2xl">🏥</span>
                </div>
                {/* Title Section */}
                <div className="flex flex-col">
                  <h1 className="text-2xl font-light tracking-wide text-white drop-shadow-sm">
                    職員カルテシステム
                  </h1>
                  <span className="text-xs text-gray-300 tracking-widest uppercase opacity-80">
                    医療法人厚生会
                  </span>
                </div>
              </div>

              {/* Right Side Decoration */}
              <div className="ml-auto flex items-center space-x-6">
                <div className="hidden lg:block">
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>システム稼働中</span>
                  </div>
                </div>
              </div>
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