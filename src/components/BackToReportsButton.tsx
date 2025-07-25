'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import styles from './BackToReportsButton.module.css'

export const BackToReportsButton: React.FC = () => {
  const router = useRouter()

  return (
    <div className={styles.buttonContainer}>
      <Button
        variant="default"
        size="lg"
        onClick={() => router.push('/reports/home')}
        className={styles.backButton}
      >
        <ArrowLeft className="mr-2 h-5 w-5" />
        レポートセンター一覧へ
      </Button>
    </div>
  )
}