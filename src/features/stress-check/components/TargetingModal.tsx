'use client'

import React, { useState } from 'react'
import styles from './TargetingModal.module.css'

interface TargetingModalProps {
  onClose: () => void
}

interface FilterOption {
  id: string
  label: string
  active: boolean
}

export default function TargetingModal({ onClose }: TargetingModalProps) {
  const [statusFilters, setStatusFilters] = useState<FilterOption[]>([
    { id: 'not_started', label: '未実施者', active: true },
    { id: 'completed', label: '実施済み', active: false },
    { id: 'deadline_soon', label: '締切7日以内未実施', active: false },
    { id: 'high_stress', label: '前回高ストレス者', active: false }
  ])

  const [departmentFilters, setDepartmentFilters] = useState<FilterOption[]>([
    { id: 'all', label: '全社', active: false },
    { id: 'sales', label: '営業部', active: true },
    { id: 'dev', label: '開発部', active: false },
    { id: 'manufacturing', label: '製造部', active: true },
    { id: 'admin', label: '管理部', active: false },
    { id: 'hr', label: '人事部', active: false }
  ])

  const [employmentFilters, setEmploymentFilters] = useState<FilterOption[]>([
    { id: 'regular', label: '正社員', active: true },
    { id: 'contract', label: '契約社員', active: true },
    { id: 'parttime', label: 'パート・アルバイト', active: false },
    { id: 'dispatch', label: '派遣社員', active: false }
  ])

  const [selectedTemplate, setSelectedTemplate] = useState('reminder_standard')
  const [scheduleType, setScheduleType] = useState('immediate')

  const toggleFilter = (
    filters: FilterOption[],
    setFilters: React.Dispatch<React.SetStateAction<FilterOption[]>>,
    id: string
  ) => {
    setFilters(filters.map(f => f.id === id ? { ...f, active: !f.active } : f))
  }

  const handleSend = () => {
    console.log('Sending targeted campaign...')
    alert('ターゲット配信を実行しました（412名）')
    onClose()
  }

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            <span>🎯</span>
            <span>ターゲット配信設定</span>
          </div>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.targetingSection}>
            <div className={styles.sectionTitle}>実施状況</div>
            <div className={styles.filterChips}>
              {statusFilters.map(filter => (
                <button
                  key={filter.id}
                  className={`${styles.filterChip} ${filter.active ? styles.active : ''}`}
                  onClick={() => toggleFilter(statusFilters, setStatusFilters, filter.id)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.targetingSection}>
            <div className={styles.sectionTitle}>部署選択</div>
            <div className={styles.filterChips}>
              {departmentFilters.map(filter => (
                <button
                  key={filter.id}
                  className={`${styles.filterChip} ${filter.active ? styles.active : ''}`}
                  onClick={() => toggleFilter(departmentFilters, setDepartmentFilters, filter.id)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.targetingSection}>
            <div className={styles.sectionTitle}>雇用形態</div>
            <div className={styles.filterChips}>
              {employmentFilters.map(filter => (
                <button
                  key={filter.id}
                  className={`${styles.filterChip} ${filter.active ? styles.active : ''}`}
                  onClick={() => toggleFilter(employmentFilters, setEmploymentFilters, filter.id)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.targetSummary}>
            <div className={styles.summaryTitle}>配信対象者</div>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <div className={styles.summaryValue}>412</div>
                <div className={styles.summaryLabel}>対象人数</div>
              </div>
              <div className={styles.summaryItem}>
                <div className={styles.summaryValue}>32.8%</div>
                <div className={styles.summaryLabel}>全体比率</div>
              </div>
              <div className={styles.summaryItem}>
                <div className={styles.summaryValue}>89</div>
                <div className={styles.summaryLabel}>前回高ストレス</div>
              </div>
            </div>
          </div>

          <div className={styles.targetingSection}>
            <div className={styles.sectionTitle}>メッセージテンプレート</div>
            <select
              className={styles.templateSelect}
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
            >
              <option value="reminder_standard">締切リマインダー（標準）</option>
              <option value="reminder_urgent">締切リマインダー（緊急）</option>
              <option value="high_stress_followup">高ストレス者フォローアップ</option>
              <option value="department_custom">部署別カスタムメッセージ</option>
            </select>
          </div>

          <div className={styles.messagePreview}>
            <div className={styles.previewHeader}>
              <div className={styles.previewIcon}>🔔</div>
              <div className={styles.previewContent}>
                <div className={styles.previewTitle}>
                  【締切間近】ストレスチェック未実施のお知らせ
                </div>
                <div className={styles.previewText}>
                  ストレスチェックの締切が近づいています。<br />
                  締切：1月31日（金）23:59<br />
                  所要時間：約10分<br /><br />
                  まだ実施されていない方は、お早めにご対応ください。
                </div>
                <button className={styles.previewAction} disabled>
                  ストレスチェックを開始する
                </button>
              </div>
            </div>
          </div>

          <div className={styles.targetingSection}>
            <div className={styles.sectionTitle}>配信タイミング</div>
            <div className={styles.scheduleOptions}>
              <div
                className={`${styles.scheduleOption} ${scheduleType === 'immediate' ? styles.selected : ''}`}
                onClick={() => setScheduleType('immediate')}
              >
                <div className={styles.scheduleIcon}>⚡</div>
                <div className={styles.scheduleLabel}>今すぐ配信</div>
                <div className={styles.scheduleDesc}>選択後すぐに送信</div>
              </div>
              <div
                className={`${styles.scheduleOption} ${scheduleType === 'scheduled' ? styles.selected : ''}`}
                onClick={() => setScheduleType('scheduled')}
              >
                <div className={styles.scheduleIcon}>📅</div>
                <div className={styles.scheduleLabel}>予約配信</div>
                <div className={styles.scheduleDesc}>日時を指定</div>
              </div>
              <div
                className={`${styles.scheduleOption} ${scheduleType === 'recurring' ? styles.selected : ''}`}
                onClick={() => setScheduleType('recurring')}
              >
                <div className={styles.scheduleIcon}>🔄</div>
                <div className={styles.scheduleLabel}>繰り返し配信</div>
                <div className={styles.scheduleDesc}>定期的に送信</div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <div className={styles.footerInfo}>412名に配信予定</div>
          <div className={styles.footerActions}>
            <button className={styles.btnSecondary} onClick={onClose}>
              キャンセル
            </button>
            <button className={styles.btnPrimary} onClick={handleSend}>
              配信実行
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}