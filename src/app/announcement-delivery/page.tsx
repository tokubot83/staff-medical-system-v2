'use client'

import React from 'react'
import CommonHeader from '@/components/CommonHeader'
import AnnouncementComposer from '@/components/notification/AnnouncementComposer'

export default function AnnouncementDeliveryPage() {
  return (
    <div>
      <CommonHeader title="お知らせ配信" />
      <div style={{ padding: '20px' }}>
        <AnnouncementComposer />
      </div>
    </div>
  )
}