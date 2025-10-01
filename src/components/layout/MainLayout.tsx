'use client';

import React from 'react';
import Link from 'next/link';
import BreadcrumbBar from '@/components/navigation/BreadcrumbBar';

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
          <div className="relative px-6">
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

              {/* Search Functions */}
              <div className="ml-auto flex items-center space-x-3">
                {/* Staff Search */}
                <div className="hidden lg:block">
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="職員検索..."
                      className="w-48 px-4 py-2 pl-10 bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:bg-opacity-20 focus:border-opacity-40 transition-all duration-200"
                      onFocus={(e) => e.target.placeholder = '氏名・職員番号を入力'}
                      onBlur={(e) => e.target.placeholder = '職員検索...'}
                    />
                    <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>

                {/* Applicant Search */}
                <div className="hidden lg:block">
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="応募者検索..."
                      className="w-48 px-4 py-2 pl-10 bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:bg-opacity-20 focus:border-opacity-40 transition-all duration-200"
                      onFocus={(e) => e.target.placeholder = '氏名・応募番号を入力'}
                      onBlur={(e) => e.target.placeholder = '応募者検索...'}
                    />
                    <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>

                {/* Mobile Search Toggle */}
                <div className="lg:hidden">
                  <button className="p-2 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg border border-white border-opacity-20">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation - 1列構成 */}
        <nav className="bg-gradient-to-r from-gray-800 via-gray-750 to-gray-800 text-white shadow-lg relative">
          <div className="absolute inset-0 bg-gradient-to-b from-black opacity-10 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
          <div className="relative px-4">
            <div className="flex items-center h-12 lg:h-12 md:h-auto md:flex-wrap">
              <div className="flex space-x-0">
                <Link
                  href="/notifications"
                  className="relative px-4 py-3 text-sm font-light tracking-wide transition-all duration-300 hover:bg-white hover:bg-opacity-5 group"
                >
                  <span className="relative z-10">お知らせ配信</span>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link
                  href="/hr-station"
                  className="relative px-4 py-3 text-sm font-light tracking-wide transition-all duration-300 hover:bg-white hover:bg-opacity-5 group"
                >
                  <span className="relative z-10">人事ステーション</span>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <div className="relative group">
                  <Link
                    href="/staff-cards"
                    className="relative px-4 py-3 text-sm font-light tracking-wide transition-all duration-300 hover:bg-white hover:bg-opacity-5 flex items-center gap-1"
                  >
                    <span className="relative z-10">カルテ</span>
                    <svg className="w-3 h-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>

                  {/* ドロップダウンメニュー */}
                  <div className="absolute hidden group-hover:block top-full left-0 mt-0 bg-gray-800 shadow-2xl rounded-b-lg border border-gray-700 min-w-[200px] z-50">
                    <Link
                      href="/staff-cards"
                      className="block px-4 py-2.5 text-sm text-white hover:bg-gray-700 transition-colors border-b border-gray-700"
                    >
                      <span className="flex items-center gap-2">
                        <span>📋</span>
                        <span>職員カルテ一覧</span>
                      </span>
                    </Link>
                    <Link
                      href="/staff-cards/management"
                      className="block px-4 py-2.5 text-sm text-white hover:bg-gray-700 transition-colors rounded-b-lg"
                    >
                      <span className="flex items-center gap-2">
                        <span>⚙️</span>
                        <span>職員カルテ管理</span>
                      </span>
                      <span className="block text-xs text-gray-400 mt-0.5 ml-6">入職・退職処理</span>
                    </Link>
                  </div>
                </div>
                <Link
                  href="/recruitment"
                  className="relative px-4 py-3 text-sm font-light tracking-wide transition-all duration-300 hover:bg-white hover:bg-opacity-5 group"
                >
                  <span className="relative z-10">採用</span>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link
                  href="/interviews"
                  className="relative px-4 py-3 text-sm font-light tracking-wide transition-all duration-300 hover:bg-white hover:bg-opacity-5 group"
                >
                  <span className="relative z-10">面談</span>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link
                  href="/education"
                  className="relative px-4 py-3 text-sm font-light tracking-wide transition-all duration-300 hover:bg-white hover:bg-opacity-5 group"
                >
                  <span className="relative z-10">教育・研修</span>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link
                  href="/goals"
                  className="relative px-4 py-3 text-sm font-light tracking-wide transition-all duration-300 hover:bg-white hover:bg-opacity-5 group"
                >
                  <span className="relative z-10">目標</span>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link
                  href="/health/management"
                  className="relative px-4 py-3 text-sm font-light tracking-wide transition-all duration-300 hover:bg-white hover:bg-opacity-5 group"
                >
                  <span className="relative z-10">健康</span>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link
                  href="/attendance-management"
                  className="relative px-4 py-3 text-sm font-light tracking-wide transition-all duration-300 hover:bg-white hover:bg-opacity-5 group"
                >
                  <span className="relative z-10">勤怠</span>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link
                  href="/admin/career-courses"
                  className="relative px-4 py-3 text-sm font-light tracking-wide transition-all duration-300 hover:bg-white hover:bg-opacity-5 group"
                >
                  <span className="relative z-10">キャリア選択</span>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link
                  href="/dashboard"
                  className="relative px-4 py-3 text-sm font-light tracking-wide transition-all duration-300 hover:bg-white hover:bg-opacity-5 group"
                >
                  <span className="relative z-10">評価</span>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link
                  href="/reports"
                  className="relative px-4 py-3 text-sm font-light tracking-wide transition-all duration-300 hover:bg-white hover:bg-opacity-5 group"
                >
                  <span className="relative z-10">レポート</span>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link
                  href="/hr-system-guide"
                  className="relative px-4 py-3 text-sm font-light tracking-wide transition-all duration-300 hover:bg-white hover:bg-opacity-5 group"
                >
                  <span className="relative z-10">ガイド</span>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link
                  href="/hr-policy"
                  className="relative px-4 py-3 text-sm font-light tracking-wide transition-all duration-300 hover:bg-white hover:bg-opacity-5 group"
                >
                  <span className="relative z-10">人事ポリシー</span>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link
                  href="/compliance"
                  className="relative px-4 py-3 text-sm font-light tracking-wide transition-all duration-300 hover:bg-white hover:bg-opacity-5 group"
                >
                  <span className="relative z-10">コンプライアンス窓口</span>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link
                  href="/admin/master-data"
                  className="relative px-4 py-3 text-sm font-light tracking-wide transition-all duration-300 hover:bg-white hover:bg-opacity-5 group"
                >
                  <span className="relative z-10">管理者設定</span>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Breadcrumb - 固定表示の一部として */}
        <BreadcrumbBar />
      </div>

      {/* Main content - パンくずリストの高さ分のパディングを追加 */}
      <div className="pt-2">
        {children}
      </div>
    </div>
  );
}