'use client'

import React from 'react'
import CommonHeader from '@/components/CommonHeader'
import NotificationCenter from '@/components/notification/NotificationCenter'

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader
        title="人事通知センター"
        description="研修期限、評価期限、承認待ち、アンケートなどの通知を一元管理"
      />
      <div className="container mx-auto py-6 px-4">
        <NotificationCenter />
      </div>
    </div>
  )
}