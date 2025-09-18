'use client'

import React from 'react'
import BreadcrumbBar from '@/components/navigation/BreadcrumbBar'
import HRAnnouncementsDistribution from '@/features/hr-announcements/components/HRAnnouncementsDistribution'

export default function HRAnnouncementsPage() {
  return (
    <div>
      <BreadcrumbBar />
      <HRAnnouncementsDistribution />
    </div>
  )
}