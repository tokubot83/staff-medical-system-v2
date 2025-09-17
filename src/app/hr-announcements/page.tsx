'use client'

import React from 'react'
import CommonHeader from '@/components/CommonHeader'
import BreadcrumbBar from '@/components/navigation/BreadcrumbBar'
import HRAnnouncementsDistribution from '@/features/hr-announcements/components/HRAnnouncementsDistribution'

export default function HRAnnouncementsPage() {
  return (
    <div>
      <CommonHeader title="お知らせ配信" />
      <BreadcrumbBar />
      <HRAnnouncementsDistribution />
    </div>
  )
}