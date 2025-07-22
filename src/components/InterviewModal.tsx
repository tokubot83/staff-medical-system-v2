'use client'

import React, { useState, useEffect } from 'react'
import { Interview, InterviewType, InterviewStatus } from '@/types/interview'
import styles from './InterviewModal.module.css'

interface InterviewModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (interview: Partial<Interview>) => void
  interview?: Interview | null
  staffId?: string
  staffName?: string
}

export default function InterviewModal({
  isOpen,
  onClose,
  onSave,
  interview,
  staffId,
  staffName
}: InterviewModalProps) {
  const [formData, setFormData] = useState<Partial<Interview>>({
    staffId: staffId || '',
    staffName: staffName || '',
    date: '',
    time: '',
    type: '定期面談' as InterviewType,
    status: '予定' as InterviewStatus,
    purpose: '',
    location: '',
    interviewerId: 'M001',
    interviewerName: '田中管理者',
    duration: 60,
    notes: '',
    followUpRequired: false
  })

  useEffect(() => {
    if (interview) {
      setFormData(interview)
    } else {
      setFormData({
        staffId: staffId || '',
        staffName: staffName || '',
        date: '',
        time: '',
        type: '定期面談' as InterviewType,
        status: '予定' as InterviewStatus,
        purpose: '',
        location: '',
        interviewerId: 'M001',
        interviewerName: '田中管理者',
        duration: 60,
        notes: '',
        followUpRequired: false
      })
    }
  }, [interview, staffId, staffName])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{interview ? '面談編集' : '新規面談予約'}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>職員名</label>
              <input
                type="text"
                value={formData.staffName}
                onChange={(e) => setFormData({ ...formData, staffName: e.target.value })}
                required
                placeholder="職員名を入力"
              />
            </div>
            <div className={styles.formGroup}>
              <label>職員ID</label>
              <input
                type="text"
                value={formData.staffId}
                onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                required
                placeholder="職員IDを入力"
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>日付</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>時間</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>面談種別</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as InterviewType })}
                required
              >
                <option value="定期面談">定期面談</option>
                <option value="フォロー面談">フォロー面談</option>
                <option value="健康相談">健康相談</option>
                <option value="キャリア相談">キャリア相談</option>
                <option value="その他">その他</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>ステータス</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as InterviewStatus })}
                required
              >
                <option value="予定">予定</option>
                <option value="完了">完了</option>
                <option value="キャンセル">キャンセル</option>
                <option value="延期">延期</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>目的・議題</label>
            <input
              type="text"
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              required
              placeholder="面談の目的や議題を入力"
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>場所</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="会議室A、オンライン等"
              />
            </div>
            <div className={styles.formGroup}>
              <label>予定時間（分）</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                min="15"
                step="15"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>備考・メモ</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="事前準備事項や注意事項など"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.followUpRequired}
                onChange={(e) => setFormData({ ...formData, followUpRequired: e.target.checked })}
              />
              フォローアップが必要
            </label>
          </div>

          {formData.followUpRequired && (
            <div className={styles.formGroup}>
              <label>フォローアップ予定日</label>
              <input
                type="date"
                value={formData.followUpDate || ''}
                onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
              />
            </div>
          )}

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              キャンセル
            </button>
            <button type="submit" className={styles.saveButton}>
              {interview ? '更新' : '予約'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}