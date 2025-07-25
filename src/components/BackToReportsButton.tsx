'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import styles from './BackToReportsButton.module.css'

export const BackToReportsButton: React.FC = () => {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push('/reports/home')}
      className={styles.backButton}
      aria-label="レポートセンターへ戻る"
    >
      <span className={styles.text}>レポートセンター</span>
    </button>
  )
}