'use client'

import React, { useState, useEffect } from 'react'
import { Interview, InterviewType, InterviewStatus } from '@/types/interview'
import { getPermissionLevelShortName } from '@/utils/interviewPermissions'
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
    employeeId: staffId || '',
    employeeName: staffName || '',
    employeeEmail: '',
    facility: '小原病院',
    department: '内科',
    position: '',
    bookingDate: '',
    startTime: '',
    endTime: '',
    interviewType: 'regular_annual' as InterviewType,
    interviewCategory: 'other' as any,
    requestedTopics: [],
    description: '',
    urgencyLevel: 'medium' as any,
    status: 'scheduled' as InterviewStatus,
    interviewerId: 'M001',
    interviewerName: '田中管理者',
    interviewerLevel: 6,
    duration: 60,
    employeeNotes: ''
  })

  useEffect(() => {
    if (interview) {
      setFormData(interview)
    } else {
      setFormData({
        employeeId: staffId || '',
        employeeName: staffName || '',
        employeeEmail: '',
        facility: '小原病院',
        department: '内科',
        position: '',
        bookingDate: '',
        startTime: '',
        endTime: '',
        interviewType: 'regular_annual' as InterviewType,
        interviewCategory: 'other' as any,
        requestedTopics: [],
        description: '',
        urgencyLevel: 'medium' as any,
        status: 'scheduled' as InterviewStatus,
        interviewerId: 'M001',
        interviewerName: '田中管理者',
        interviewerLevel: 6,
        duration: 60,
        employeeNotes: ''
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
                value={formData.employeeName || ''}
                onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                required
                placeholder="職員名を入力"
              />
            </div>
            <div className={styles.formGroup}>
              <label>職員ID</label>
              <input
                type="text"
                value={formData.employeeId || ''}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
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
                value={formData.bookingDate || ''}
                onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>時間</label>
              <input
                type="time"
                value={formData.startTime || ''}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>面談種別</label>
              <select
                value={formData.interviewType || 'regular_annual'}
                onChange={(e) => setFormData({ ...formData, interviewType: e.target.value as InterviewType })}
                required
              >
                <option value="new_employee_monthly">新入職員月次面談</option>
                <option value="regular_annual">一般職員年次面談</option>
                <option value="management_biannual">管理職半年面談</option>
                <option value="career_development">キャリア開発面談</option>
                <option value="stress_care">ストレスケア面談</option>
                <option value="ad_hoc">随時面談</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>ステータス</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as InterviewStatus })}
                required
              >
                <option value="scheduled">予定</option>
                <option value="completed">完了</option>
                <option value="cancelled">キャンセル</option>
                <option value="postponed">延期</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>目的・議題</label>
            <input
              type="text"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              placeholder="面談の目的や議題を入力"
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>面談者</label>
              <input
                type="text"
                value={formData.interviewerName || ''}
                onChange={(e) => setFormData({ ...formData, interviewerName: e.target.value })}
                placeholder="面談者名"
              />
            </div>
            <div className={styles.formGroup}>
              <label>面談者権限レベル</label>
              <select
                value={formData.interviewerLevel || 6}
                onChange={(e) => setFormData({ ...formData, interviewerLevel: parseInt(e.target.value) })}
              >
                <option value={6}>レベル6 - {getPermissionLevelShortName(6)}</option>
                <option value={7}>レベル7 - {getPermissionLevelShortName(7)}</option>
                <option value={8}>レベル8 - {getPermissionLevelShortName(8)}</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>場所</label>
              <input
                type="text"
                value={''}
                onChange={(e) => {}}
                placeholder="会議室A、オンライン等"
                disabled
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
              value={formData.employeeNotes || ''}
              onChange={(e) => setFormData({ ...formData, employeeNotes: e.target.value })}
              rows={3}
              placeholder="事前準備事項や注意事項など"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.outcomeFollowupRequired || false}
                onChange={(e) => setFormData({ ...formData, outcomeFollowupRequired: e.target.checked })}
              />
              フォローアップが必要
            </label>
          </div>

          {formData.outcomeFollowupRequired && (
            <div className={styles.formGroup}>
              <label>フォローアップ予定日</label>
              <input
                type="date"
                value={formData.outcomeFollowupDate || ''}
                onChange={(e) => setFormData({ ...formData, outcomeFollowupDate: e.target.value })}
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