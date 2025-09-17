'use client'

import React from 'react'
import CommonHeader from '@/components/CommonHeader'
import HRAnnouncementsDistribution from '@/features/hr-announcements/components/HRAnnouncementsDistribution'

export default function HRAnnouncementsPage() {
  return (
    <div>
      <CommonHeader title="お知らせ配信" />
      <HRAnnouncementsDistribution />
    </div>
  )
}