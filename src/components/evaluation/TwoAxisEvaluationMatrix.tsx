import React from 'react'
import styles from './TwoAxisEvaluationMatrix.module.css'

interface TwoAxisEvaluationMatrixProps {
  facilityScore: 'S' | 'A' | 'B' | 'C' | 'D'
  corporateScore: 'S' | 'A' | 'B' | 'C' | 'D'
  showGrid?: boolean
  size?: 'small' | 'medium' | 'large'
}

const matrixMapping = {
  'S-S': 'S+',
  'S-A': 'S',
  'S-B': 'A+',
  'S-C': 'A',
  'S-D': 'A',
  'A-S': 'S',
  'A-A': 'A+',
  'A-B': 'A',
  'A-C': 'A',
  'A-D': 'B',
  'B-S': 'A+',
  'B-A': 'A',
  'B-B': 'B',
  'B-C': 'B',
  'B-D': 'C',
  'C-S': 'A',
  'C-A': 'A',
  'C-B': 'B',
  'C-C': 'C',
  'C-D': 'D',
  'D-S': 'B',
  'D-A': 'B',
  'D-B': 'C',
  'D-C': 'C',
  'D-D': 'D'
}

const cellColors = {
  'S+': '#FFD700',
  'S': '#FF6B6B',
  'A+': '#FF9F40',
  'A': '#FFA726',
  'B': '#66BB6A',
  'C': '#42A5F5',
  'D': '#9E9E9E'
}

export const TwoAxisEvaluationMatrix: React.FC<TwoAxisEvaluationMatrixProps> = ({
  facilityScore,
  corporateScore,
  showGrid = true,
  size = 'medium'
}) => {
  const scores = ['D', 'C', 'B', 'A', 'S']
  const currentPosition = `${corporateScore}-${facilityScore}`
  const overallScore = matrixMapping[currentPosition as keyof typeof matrixMapping]

  return (
    <div className={`${styles.matrixContainer} ${styles[size]}`}>
      <div className={styles.matrixHeader}>
        <h3 className={styles.title}>評価マトリックス</h3>
        <div className={styles.currentScore}>
          総合評価: <span style={{ color: cellColors[overallScore as keyof typeof cellColors] }}>{overallScore}</span>
        </div>
      </div>

      <div className={styles.matrixWrapper}>
        <div className={styles.yAxisLabel}>
          <span>法人内評価（絶対評価）</span>
          <span className={styles.arrow}>→</span>
        </div>
        
        <div className={styles.matrixGrid}>
          {showGrid && (
            <div className={styles.gridOverlay}>
              {scores.reverse().map((corpScore, rowIndex) => (
                <div key={corpScore} className={styles.matrixRow}>
                  <div className={styles.rowLabel}>{corpScore}</div>
                  {scores.map((facScore) => {
                    const cellKey = `${corpScore}-${facScore}`
                    const cellValue = matrixMapping[cellKey as keyof typeof matrixMapping]
                    const isCurrentCell = cellKey === currentPosition
                    
                    return (
                      <div
                        key={cellKey}
                        className={`${styles.matrixCell} ${isCurrentCell ? styles.currentCell : ''}`}
                        style={{ 
                          backgroundColor: isCurrentCell 
                            ? cellColors[cellValue as keyof typeof cellColors] 
                            : `${cellColors[cellValue as keyof typeof cellColors]}33`
                        }}
                      >
                        <span className={styles.cellValue}>{cellValue}</span>
                        {isCurrentCell && (
                          <div className={styles.currentIndicator}>
                            <span className={styles.youAreHere}>現在</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
              <div className={styles.columnLabels}>
                <div className={styles.emptyCell}></div>
                {scores.map((score) => (
                  <div key={score} className={styles.columnLabel}>{score}</div>
                ))}
              </div>
            </div>
          )}
          
          {!showGrid && (
            <div className={styles.simpleDisplay}>
              <div className={styles.positionIndicator}>
                <div className={styles.positionDot} style={{ 
                  backgroundColor: cellColors[overallScore as keyof typeof cellColors],
                  left: `${scores.indexOf(facilityScore) * 20 + 10}%`,
                  bottom: `${scores.indexOf(corporateScore) * 20 + 10}%`
                }}>
                  <span className={styles.positionLabel}>{overallScore}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className={styles.xAxisLabel}>
          <span>施設内評価（相対評価）</span>
          <span className={styles.arrow}>→</span>
        </div>
      </div>

      <div className={styles.legend}>
        <div className={styles.legendTitle}>評価レベル</div>
        <div className={styles.legendItems}>
          {Object.entries(cellColors).map(([score, color]) => (
            <div key={score} className={styles.legendItem}>
              <div className={styles.legendColor} style={{ backgroundColor: color }}></div>
              <span className={styles.legendLabel}>{score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}