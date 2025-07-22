import React from 'react'
import styles from './EvaluationComponents.module.css'

interface EvaluationScoreBarProps {
  label: string
  score: number
  maxScore?: number
  showScore?: boolean
  color?: string
}

export function EvaluationScoreBar({ 
  label, 
  score, 
  maxScore = 5, 
  showScore = true,
  color = '#4ecdc4'
}: EvaluationScoreBarProps) {
  const percentage = (score / maxScore) * 100

  return (
    <div className={styles.scoreBarContainer}>
      <div className={styles.scoreBarHeader}>
        <span className={styles.scoreBarLabel}>{label}</span>
        {showScore && <span className={styles.scoreBarValue}>{score.toFixed(1)}</span>}
      </div>
      <div className={styles.scoreBarTrack}>
        <div 
          className={styles.scoreBarFill}
          style={{ 
            width: `${percentage}%`,
            backgroundColor: color
          }}
        />
      </div>
    </div>
  )
}