import React from 'react'
import Link from 'next/link'
import styles from './DashboardButton.module.css'

export default function DashboardButton() {
  return (
    <Link href="/" className={styles.dashboardButton}>
      <span className={styles.text}>ダッシュボード</span>
    </Link>
  )
}