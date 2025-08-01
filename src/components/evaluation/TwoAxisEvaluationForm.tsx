'use client'

import React, { useState } from 'react'
import styles from './TwoAxisEvaluation.module.css'
import { getEvaluationGradeColor, getEvaluationGradeLabel, EvaluationGrade, FinalEvaluationGrade } from '@/types/two-axis-evaluation'

interface TwoAxisEvaluationFormProps {
  staffId: string
  staffName: string
  facility: string
  department: string
  onSubmit: (evaluation: {
    facilityScore: EvaluationGrade
    corporateScore: EvaluationGrade
    overallScore: FinalEvaluationGrade
    comments: string
  }) => void
  onCancel: () => void
}

export function TwoAxisEvaluationForm({
  staffId,
  staffName,
  facility,
  department,
  onSubmit,
  onCancel
}: TwoAxisEvaluationFormProps) {
  const [facilityScore, setFacilityScore] = useState<EvaluationGrade>('B')
  const [corporateScore, setCorporateScore] = useState<EvaluationGrade>('B')
  const [comments, setComments] = useState('')

  // 総合評価の自動計算
  const calculateOverallScore = (): FinalEvaluationGrade => {
    const scoreMap: Record<EvaluationGrade, number> = {
      'S': 5, 'A': 4, 'B': 3, 'C': 2, 'D': 1
    }
    const reverseMap: Record<number, FinalEvaluationGrade> = {
      10: 'S+', 9: 'S', 8: 'A+', 7: 'A', 6: 'B', 5: 'C', 4: 'D'
    }

    const facilityNum = scoreMap[facilityScore]
    const corporateNum = scoreMap[corporateScore]
    const sum = facilityNum + corporateNum

    // 両方がSの場合は、S+
    if (facilityScore === 'S' && corporateScore === 'S') {
      return 'S+'
    }
    
    // マッピングルール
    if (sum >= 9) return 'S'
    if (sum >= 8) return 'A+'
    if (sum >= 7) return 'A'
    if (sum >= 6) return 'B'
    if (sum >= 4) return 'C'
    return 'D'
  }

  const overallScore = calculateOverallScore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      facilityScore,
      corporateScore,
      overallScore,
      comments
    })
  }

  const grades: EvaluationGrade[] = ['S', 'A', 'B', 'C', 'D']

  return (
    <form onSubmit={handleSubmit} className={styles.evaluationForm}>
      <div className={styles.formHeader}>
        <h3>2軸評価入力</h3>
        <div className={styles.staffInfo}>
          <span className={styles.staffName}>{staffName}</span>
          <span className={styles.staffDetail}>{facility} - {department}</span>
          <span className={styles.staffId}>ID: {staffId}</span>
        </div>
      </div>

      <div className={styles.formBody}>
        <div className={styles.evaluationSection}>
          <label className={styles.sectionLabel}>
            <span className={styles.labelIcon}>🏢</span>
            施設内評価
          </label>
          <div className={styles.gradeSelector}>
            {grades.map(grade => (
              <button
                key={grade}
                type="button"
                className={`${styles.gradeButton} ${facilityScore === grade ? styles.selected : ''}`}
                style={{
                  backgroundColor: facilityScore === grade ? getEvaluationGradeColor(grade) : 'transparent',
                  borderColor: getEvaluationGradeColor(grade)
                }}
                onClick={() => setFacilityScore(grade)}
              >
                {grade}
              </button>
            ))}
          </div>
          <p className={styles.gradeDescription}>{getEvaluationGradeLabel(facilityScore)}</p>
        </div>

        <div className={styles.evaluationSection}>
          <label className={styles.sectionLabel}>
            <span className={styles.labelIcon}>🏛️</span>
            法人内評価
          </label>
          <div className={styles.gradeSelector}>
            {grades.map(grade => (
              <button
                key={grade}
                type="button"
                className={`${styles.gradeButton} ${corporateScore === grade ? styles.selected : ''}`}
                style={{
                  backgroundColor: corporateScore === grade ? getEvaluationGradeColor(grade) : 'transparent',
                  borderColor: getEvaluationGradeColor(grade)
                }}
                onClick={() => setCorporateScore(grade)}
              >
                {grade}
              </button>
            ))}
          </div>
          <p className={styles.gradeDescription}>{getEvaluationGradeLabel(corporateScore)}</p>
        </div>

        <div className={styles.resultSection}>
          <div className={styles.overallResult}>
            <span className={styles.resultLabel}>総合評価:</span>
            <span 
              className={styles.resultGrade}
              style={{ backgroundColor: getEvaluationGradeColor(overallScore) }}
            >
              {overallScore}
            </span>
            <span className={styles.resultDescription}>{getEvaluationGradeLabel(overallScore)}</span>
          </div>
        </div>

        <div className={styles.commentSection}>
          <label className={styles.sectionLabel}>
            <span className={styles.labelIcon}>💬</span>
            評価コメント
          </label>
          <textarea
            className={styles.commentTextarea}
            rows={4}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="評価の根拠、強み、改善点などを記入してください..."
          />
        </div>
      </div>

      <div className={styles.formActions}>
        <button
          type="button"
          onClick={onCancel}
          className={styles.cancelButton}
        >
          キャンセル
        </button>
        <button
          type="submit"
          className={styles.submitButton}
        >
          評価を保存
        </button>
      </div>
    </form>
  )
}