import React from 'react'
import styles from './HealthMetrics.module.css'

interface HealthMetricsProps {
  healthScore: number
  stressIndex: number
  variant?: 'default' | 'compact'
}

export default function HealthMetrics({ healthScore, stressIndex, variant = 'default' }: HealthMetricsProps) {
  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return '#10b981'
    if (score >= 70) return '#f59e0b'
    return '#ef4444'
  }

  const getStressIndexColor = (index: number) => {
    if (index <= 30) return '#10b981'
    if (index <= 60) return '#f59e0b'
    return '#ef4444'
  }

  const getHealthScoreLabel = (score: number) => {
    if (score >= 90) return '優良'
    if (score >= 70) return '良好'
    if (score >= 50) return '注意'
    return '要改善'
  }

  const getStressIndexLabel = (index: number) => {
    if (index <= 30) return '良好'
    if (index <= 60) return '注意'
    return '要対応'
  }

  if (variant === 'compact') {
    return (
      <div className={styles.compactContainer}>
        <div className={styles.compactMetric}>
          <span className={styles.compactLabel}>健康</span>
          <span 
            className={styles.compactValue} 
            style={{ color: getHealthScoreColor(healthScore) }}
          >
            {healthScore}
          </span>
        </div>
        <div className={styles.compactMetric}>
          <span className={styles.compactLabel}>ストレス</span>
          <span 
            className={styles.compactValue} 
            style={{ color: getStressIndexColor(stressIndex) }}
          >
            {stressIndex}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.metric}>
        <div className={styles.metricHeader}>
          <span className={styles.metricIcon}>💗</span>
          <span className={styles.metricLabel}>健康スコア</span>
        </div>
        <div className={styles.metricValue}>
          <span 
            className={styles.value} 
            style={{ color: getHealthScoreColor(healthScore) }}
          >
            {healthScore}
          </span>
          <span className={styles.unit}>点</span>
        </div>
        <div className={styles.metricStatus}>
          <span 
            className={styles.statusBadge}
            style={{ backgroundColor: `${getHealthScoreColor(healthScore)}20`, color: getHealthScoreColor(healthScore) }}
          >
            {getHealthScoreLabel(healthScore)}
          </span>
        </div>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ 
              width: `${healthScore}%`,
              backgroundColor: getHealthScoreColor(healthScore)
            }}
          />
        </div>
      </div>

      <div className={styles.metric}>
        <div className={styles.metricHeader}>
          <span className={styles.metricIcon}>🧠</span>
          <span className={styles.metricLabel}>ストレス指数</span>
        </div>
        <div className={styles.metricValue}>
          <span 
            className={styles.value} 
            style={{ color: getStressIndexColor(stressIndex) }}
          >
            {stressIndex}
          </span>
          <span className={styles.unit}>%</span>
        </div>
        <div className={styles.metricStatus}>
          <span 
            className={styles.statusBadge}
            style={{ backgroundColor: `${getStressIndexColor(stressIndex)}20`, color: getStressIndexColor(stressIndex) }}
          >
            {getStressIndexLabel(stressIndex)}
          </span>
        </div>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ 
              width: `${stressIndex}%`,
              backgroundColor: getStressIndexColor(stressIndex)
            }}
          />
        </div>
      </div>
    </div>
  )
}