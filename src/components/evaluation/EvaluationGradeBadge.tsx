import React from 'react'
import { EvaluationGrade, getGradeColor, getGradeLabel } from '@/types/evaluation'
import styles from './EvaluationComponents.module.css'

interface EvaluationGradeBadgeProps {
  grade: EvaluationGrade
  size?: 'small' | 'medium' | 'large'
  showLabel?: boolean
}

export function EvaluationGradeBadge({ 
  grade, 
  size = 'medium', 
  showLabel = true 
}: EvaluationGradeBadgeProps) {
  const color = getGradeColor(grade)
  const label = getGradeLabel(grade)

  return (
    <div 
      className={`${styles.gradeBadge} ${styles[size]}`}
      style={{ backgroundColor: color }}
    >
      <span className={styles.gradeText}>{grade}</span>
      {showLabel && <span className={styles.gradeLabel}>{label}</span>}
    </div>
  )
}