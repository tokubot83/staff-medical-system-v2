'use client'

import React, { useState } from 'react'
import styles from './TwoAxisEvaluation.module.css'
import { getEvaluationGradeColor, getEvaluationGradeLabel } from '@/types/two-axis-evaluation'
import { TwoAxisEvaluationGrade } from '@/types/two-axis-evaluation'

interface TwoAxisEvaluationFormProps {
  staffId: string
  staffName: string
  facility: string
  department: string
  onSubmit: (evaluation: {
    facilityScore: TwoAxisEvaluationGrade
    corporateScore: TwoAxisEvaluationGrade
    overallScore: TwoAxisEvaluationGrade
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
  const [facilityScore, setFacilityScore] = useState<TwoAxisEvaluationGrade>('B')
  const [corporateScore, setCorporateScore] = useState<TwoAxisEvaluationGrade>('B')
  const [comments, setComments] = useState('')

  // 総合評価の自動計算
  const calculateOverallScore = (): TwoAxisEvaluationGrade => {
    const scoreMap: Record<TwoAxisEvaluationGrade, number> = {
      'S+': 8, 'S': 7, 'A+': 6, 'A': 5, 'B': 4, 'C': 3, 'D': 2
    }
    const reverseMap: Record<number, TwoAxisEvaluationGrade> = {
      8: 'S+', 7: 'S', 6: 'A+', 5: 'A', 4: 'B', 3: 'C', 2: 'D'
    }

    const facilityNum = scoreMap[facilityScore]
    const corporateNum = scoreMap[corporateScore]
    const average = Math.round((facilityNum + corporateNum) / 2)

    // 特別ルール: 両方がSまたはS+の場合は、最高値を採用
    if (facilityNum >= 7 && corporateNum >= 7) {
      return facilityNum > corporateNum ? facilityScore : corporateScore
    }

    return reverseMap[average] || 'B'
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

  const grades: TwoAxisEvaluationGrade[] = ['S+', 'S', 'A+', 'A', 'B', 'C', 'D']

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