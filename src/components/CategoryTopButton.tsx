'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import styles from './CategoryTopButton.module.css'

interface CategoryTopButtonProps {
  categoryPath: string
  categoryName: string
}

export const CategoryTopButton: React.FC<CategoryTopButtonProps> = ({ categoryPath, categoryName }) => {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push(categoryPath)}
      className={styles.categoryButton}
      aria-label={`${categoryName}トップへ戻る`}
    >
      <span className={styles.text}>{categoryName}トップ</span>
    </button>
  )
}