'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import styles from './BackToReportsButton.module.css'

export default function BackToReportsButton() {
  const router = useRouter()

  const handleClick = () => {
    router.push('/reports')
  }

  return (
    <button onClick={handleClick} className={styles.backButton}>
      <ArrowLeft size={16} className={styles.icon} />
      <span className={styles.text}>レポートセンター一覧へ</span>
    </button>
  )
}