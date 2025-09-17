'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import CommonHeader from '@/components/CommonHeader'
import AnnouncementComposer from '@/components/notification/AnnouncementComposer'
import DeliveryHistory from '@/components/notification/DeliveryHistory'
import TemplateManager from '@/components/notification/TemplateManager'
import DeliveryAnalytics from '@/components/notification/DeliveryAnalytics'
import NotificationSettings from '@/components/notification/NotificationSettings'

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<'create' | 'history' | 'templates' | 'analytics' | 'settings'>('create')
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <CommonHeader title="お知らせ配信" />

      {/* Navigation */}
      <nav className="bg-gray-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-12">
            <div className="flex space-x-1">
              <Link href="/hr-announcements" className="hover:bg-gray-700 px-4 py-3 text-sm font-medium transition-colors border-b-3 border-transparent hover:border-purple-400">
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

      <div className="container mx-auto py-8 px-4 bg-gradient-to-b from-gray-50 to-white min-h-screen">
        {/* タブナビゲーション */}
        <div className="flex bg-white rounded-2xl shadow-lg mb-6 overflow-hidden border border-gray-100">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 p-5 font-semibold transition-all duration-300 hover:transform hover:-translate-y-1 flex items-center justify-center gap-3 ${
              activeTab === 'create'
                ? 'bg-gradient-to-b from-blue-50 to-blue-100 border-b-4 border-blue-500 text-blue-600'
                : 'bg-transparent text-gray-600 hover:bg-gradient-to-b hover:from-gray-50 hover:to-gray-100 hover:text-blue-600'
            }`}
          >
            <span className="text-xl drop-shadow-sm">✏️</span>
            <span>新規作成</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 p-5 font-semibold transition-all duration-300 hover:transform hover:-translate-y-1 flex items-center justify-center gap-3 ${
              activeTab === 'history'
                ? 'bg-gradient-to-b from-blue-50 to-blue-100 border-b-4 border-blue-500 text-blue-600'
                : 'bg-transparent text-gray-600 hover:bg-gradient-to-b hover:from-gray-50 hover:to-gray-100 hover:text-blue-600'
            }`}
          >
            <span className="text-xl drop-shadow-sm">📋</span>
            <span>配信履歴</span>
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex-1 p-5 font-semibold transition-all duration-300 hover:transform hover:-translate-y-1 flex items-center justify-center gap-3 ${
              activeTab === 'templates'
                ? 'bg-gradient-to-b from-blue-50 to-blue-100 border-b-4 border-blue-500 text-blue-600'
                : 'bg-transparent text-gray-600 hover:bg-gradient-to-b hover:from-gray-50 hover:to-gray-100 hover:text-blue-600'
            }`}
          >
            <span className="text-xl drop-shadow-sm">📝</span>
            <span>テンプレート</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 p-5 font-semibold transition-all duration-300 hover:transform hover:-translate-y-1 flex items-center justify-center gap-3 ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-b from-blue-50 to-blue-100 border-b-4 border-blue-500 text-blue-600'
                : 'bg-transparent text-gray-600 hover:bg-gradient-to-b hover:from-gray-50 hover:to-gray-100 hover:text-blue-600'
            }`}
          >
            <span className="text-xl drop-shadow-sm">📊</span>
            <span>配信分析</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 p-5 font-semibold transition-all duration-300 hover:transform hover:-translate-y-1 flex items-center justify-center gap-3 ${
              activeTab === 'settings'
                ? 'bg-gradient-to-b from-blue-50 to-blue-100 border-b-4 border-blue-500 text-blue-600'
                : 'bg-transparent text-gray-600 hover:bg-gradient-to-b hover:from-gray-50 hover:to-gray-100 hover:text-blue-600'
            }`}
          >
            <span className="text-xl drop-shadow-sm">⚙️</span>
            <span>設定</span>
          </button>
        </div>

        {/* タブコンテンツ */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 min-h-96">
          <div className="p-6">
            {activeTab === 'create' && <AnnouncementComposer />}
            {activeTab === 'history' && <DeliveryHistory />}
            {activeTab === 'templates' && <TemplateManager />}
            {activeTab === 'analytics' && <DeliveryAnalytics />}
            {activeTab === 'settings' && <NotificationSettings />}
          </div>
        </div>
      </div>
    </div>
  )
}