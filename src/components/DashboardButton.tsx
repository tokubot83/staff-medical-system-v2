import React from 'react'
import Link from 'next/link'
import styles from './DashboardButton.module.css'

export default function DashboardButton() {
  return (
    <Link href="/" className={`${styles.dashboardButton} print:hidden`}>
      <span className={styles.text}>ダッシュボード</span>
    </Link>
  )
}