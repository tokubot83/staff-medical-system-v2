'use client'

import React, { Suspense } from 'react'
import CommonHeader from '@/components/CommonHeader'
import DashboardButton from '@/components/DashboardButton'
import V3TrainingIntegration from '@/components/training/V3TrainingIntegration'
import styles from './TrainingV3.module.css'

function TrainingV3PageContent() {
  return (
    <div>
      <CommonHeader title="V3評価連動型研修システム" />
      
      <div className={styles.container}>
        <V3TrainingIntegration />
      </div>
      
      <DashboardButton />
    </div>
  )
}

export default function TrainingV3Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TrainingV3PageContent />
    </Suspense>
  )
}