'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import styles from './BackToStaffCardsButton.module.css'

export default function BackToStaffCardsButton() {
  const router = useRouter()

  const handleClick = () => {
    router.push('/staff-cards')
  }

  return (
    <button onClick={handleClick} className={styles.backButton}>
      <span className={styles.text}>職員カルテ</span>
    </button>
  )
}