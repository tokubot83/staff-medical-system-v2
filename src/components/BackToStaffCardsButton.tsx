'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import styles from './BackToStaffCardsButton.module.css'

export default function BackToStaffCardsButton() {
  const router = useRouter()

  const handleClick = () => {
    router.push('/staff-cards')
  }

  return (
    <button onClick={handleClick} className={styles.backButton}>
      <ArrowLeft size={16} className={styles.icon} />
      <span className={styles.text}>職員カルテ一覧へ</span>
    </button>
  )
}