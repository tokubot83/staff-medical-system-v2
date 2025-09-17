'use client'

import React from 'react'
import Link from 'next/link'
import NotificationCenter from '@/components/notification/NotificationCenter'

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gray-700 text-white p-5 border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl">
              🏥
            </div>
            <div>
              <h1 className="text-2xl font-light">職員カルテシステム</h1>
              <p className="text-sm opacity-90">医療法人厚生会</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="職員名・ID・部署で検索..."
                className="w-80 px-4 py-2 rounded-full text-gray-700 pr-20 bg-white"
              />
              <button className="absolute right-1 top-1 bg-gray-700 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
                検索
              </button>
            </div>
            <div className="flex items-center gap-2 bg-white text-gray-700 border-2 border-gray-300 px-4 py-2 rounded-full cursor-pointer hover:bg-gray-100 transition-colors">
              <span>人事部 田中さん</span>
              <div className="w-8 h-8 bg-gray-200 border border-gray-400 rounded-full flex items-center justify-center font-bold text-gray-700">
                田
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-12">
            <div className="flex space-x-1">
              <Link href="/hr-announcements" className="hover:bg-gray-700 px-4 py-3 text-sm font-medium transition-colors border-b-3 border-transparent hover:border-purple-400">
                📢 人事通知
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
              <Link href="/admin/master-data" className="hover:bg-gray-700 px-4 py-3 text-sm font-medium transition-colors border-b-3 border-transparent hover:border-amber-400 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                管理者設定
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-5 bg-gradient-to-b from-gray-50 to-white min-h-screen">
        {/* タブナビゲーション */}
        <div className="flex bg-white rounded-2xl shadow-lg mb-6 overflow-hidden border border-gray-100">
          <button className="flex-1 p-5 bg-gradient-to-b from-blue-50 to-blue-100 border-b-4 border-blue-500 text-blue-600 font-semibold transition-all duration-300 hover:transform hover:-translate-y-1 flex items-center justify-center gap-3">
            <span className="text-xl drop-shadow-sm">✏️</span>
            <span>新規作成</span>
          </button>
          <button className="flex-1 p-5 bg-transparent text-gray-600 font-semibold transition-all duration-300 hover:bg-gradient-to-b hover:from-gray-50 hover:to-gray-100 hover:text-blue-600 hover:transform hover:-translate-y-1 flex items-center justify-center gap-3">
            <span className="text-xl drop-shadow-sm">📋</span>
            <span>配信履歴</span>
          </button>
          <button className="flex-1 p-5 bg-transparent text-gray-600 font-semibold transition-all duration-300 hover:bg-gradient-to-b hover:from-gray-50 hover:to-gray-100 hover:text-blue-600 hover:transform hover:-translate-y-1 flex items-center justify-center gap-3">
            <span className="text-xl drop-shadow-sm">📝</span>
            <span>テンプレート</span>
          </button>
          <button className="flex-1 p-5 bg-transparent text-gray-600 font-semibold transition-all duration-300 hover:bg-gradient-to-b hover:from-gray-50 hover:to-gray-100 hover:text-blue-600 hover:transform hover:-translate-y-1 flex items-center justify-center gap-3">
            <span className="text-xl drop-shadow-sm">📊</span>
            <span>配信分析</span>
          </button>
          <button className="flex-1 p-5 bg-transparent text-gray-600 font-semibold transition-all duration-300 hover:bg-gradient-to-b hover:from-gray-50 hover:to-gray-100 hover:text-blue-600 hover:transform hover:-translate-y-1 flex items-center justify-center gap-3">
            <span className="text-xl drop-shadow-sm">⚙️</span>
            <span>設定</span>
          </button>
        </div>

        <NotificationCenter />
      </div>
    </div>
  )
}