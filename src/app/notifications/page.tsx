'use client'

import React, { useState } from 'react'
import Link from 'next/link'

import AnnouncementComposer from '@/components/notification/AnnouncementComposer'
import DeliveryHistory from '@/components/notification/DeliveryHistory'
import TemplateManager from '@/components/notification/TemplateManager'
import DeliveryAnalytics from '@/components/notification/DeliveryAnalytics'
import NotificationSettings from '@/components/notification/NotificationSettings'

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<'create' | 'history' | 'templates' | 'analytics' | 'settings'>('create')
  return (
    <div>
      <div className="min-h-screen bg-white">
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
    </div>
  )
}