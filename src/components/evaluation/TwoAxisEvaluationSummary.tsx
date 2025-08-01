import React from 'react'
import styles from './TwoAxisEvaluationCard.module.css'

interface TwoAxisEvaluationSummaryProps {
  facilityScore: 'S' | 'A' | 'B' | 'C' | 'D'
  corporateScore: 'S' | 'A' | 'B' | 'C' | 'D'
  overallScore: 'S+' | 'S' | 'A+' | 'A' | 'B' | 'C' | 'D'
  size?: 'small' | 'medium' | 'large'
  showDetails?: boolean
}

const scoreColors = {
  'S+': '#FFD700',
  'S': '#FF6B6B',
  'A+': '#FF9F40',
  'A': '#FFA726',
  'B': '#66BB6A',
  'C': '#42A5F5',
  'D': '#9E9E9E'
}

const scoreDescriptions = {
  'S+': '最優秀',
  'S': '優秀',
  'A+': '高評価',
  'A': '良好',
  'B': '標準',
  'C': '改善必要',
  'D': '要支援'
}

export const TwoAxisEvaluationSummary: React.FC<TwoAxisEvaluationSummaryProps> = ({
  facilityScore,
  corporateScore,
  overallScore,
  size = 'medium',
  showDetails = false
}) => {
  return (
    <div className={`${styles.evaluationCard} ${styles[size]}`}>
      <div className={styles.evaluationHeader}>
        <h3 className={styles.title}>2軸評価</h3>
        <div 
          className={styles.overallBadge}
          style={{ backgroundColor: scoreColors[overallScore] }}
        >
          {overallScore}
        </div>
      </div>
      
      <div className={styles.evaluationBody}>
        <div className={styles.axisScores}>
          <div className={styles.scoreItem}>
            <div className={styles.scoreLabel}>
              <span className={styles.scoreIcon}>🏢</span>
              <span>施設内評価</span>
            </div>
            <div 
              className={styles.scoreValue}
              style={{ color: scoreColors[facilityScore] }}
            >
              {facilityScore}
            </div>
          </div>
          
          <div className={styles.scorePlus}>+</div>
          
          <div className={styles.scoreItem}>
            <div className={styles.scoreLabel}>
              <span className={styles.scoreIcon}>🏛️</span>
              <span>法人内評価</span>
            </div>
            <div 
              className={styles.scoreValue}
              style={{ color: scoreColors[corporateScore] }}
            >
              {corporateScore}
            </div>
          </div>
          
          <div className={styles.scoreEquals}>=</div>
          
          <div className={styles.scoreItem}>
            <div className={styles.scoreLabel}>
              <span className={styles.scoreIcon}>⭐</span>
              <span>総合評価</span>
            </div>
            <div 
              className={styles.scoreValue}
              style={{ color: scoreColors[overallScore] }}
            >
              {overallScore}
            </div>
          </div>
        </div>
        
        {showDetails && (
          <div className={styles.evaluationDetails}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>評価レベル</span>
              <span className={styles.detailValue}>{scoreDescriptions[overallScore]}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>施設内順位</span>
              <span className={styles.detailValue}>上位15%</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>法人内順位</span>
              <span className={styles.detailValue}>上位25%</span>
            </div>
          </div>
        )}
      </div>
      
      <div className={styles.evaluationFooter}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ 
              width: `${getProgressPercentage(overallScore)}%`,
              backgroundColor: scoreColors[overallScore]
            }}
          />
        </div>
        <span className={styles.progressLabel}>
          パフォーマンス指標
        </span>
      </div>
    </div>
  )
}

function getProgressPercentage(score: string): number {
  const scoreMap: { [key: string]: number } = {
    'S+': 100,
    'S': 90,
    'A+': 80,
    'A': 70,
    'B': 50,
    'C': 30,
    'D': 10
  }
  return scoreMap[score] || 0
}