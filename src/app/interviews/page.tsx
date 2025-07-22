'use client'

import React, { useState, useEffect } from 'react'
import CommonHeader from '@/components/CommonHeader'
import Link from 'next/link'
import { staffDatabase } from '../data/staffData.js'
import styles from './Interviews.module.css'
import { Interview, InterviewType, InterviewStatus } from '@/types/interview'
import { mockInterviews, getUpcomingInterviews } from '@/data/mockInterviews'
import InterviewModal from '@/components/InterviewModal'

const tabs = [
  { id: 'schedule', label: '面談予定', icon: '📅' },
  { id: 'history', label: '面談履歴', icon: '📝' },
  { id: 'feedback', label: 'フィードバック', icon: '💬' },
  { id: 'report', label: 'レポート', icon: '📊' },
  { id: 'settings', label: '設定', icon: '⚙️' },
]


export default function InterviewsPage() {
  const [activeTab, setActiveTab] = useState('schedule')
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFacility, setSelectedFacility] = useState('all')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingInterview, setEditingInterview] = useState<Interview | null>(null)
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: ''
  })

  useEffect(() => {
    setInterviews(mockInterviews)
  }, [])

  const handleInterviewSelect = (interview: Interview) => {
    setSelectedInterview(interview)
    setActiveTab('feedback')
  }

  const handleSaveInterview = (interviewData: Partial<Interview>) => {
    if (editingInterview) {
      // 編集の場合
      setInterviews(interviews.map(i => 
        i.id === editingInterview.id 
          ? { ...editingInterview, ...interviewData } 
          : i
      ))
    } else {
      // 新規作成の場合
      const newInterview: Interview = {
        id: `INT${Date.now()}`,
        staffId: interviewData.staffId || '',
        staffName: interviewData.staffName || '',
        department: interviewData.department || '内科',
        date: interviewData.date || '',
        time: interviewData.time || '',
        type: interviewData.type || '定期面談',
        status: interviewData.status || '予定',
        purpose: interviewData.purpose || '',
        location: interviewData.location,
        interviewerId: interviewData.interviewerId || 'M001',
        interviewerName: interviewData.interviewerName || '田中管理者',
        duration: interviewData.duration,
        notes: interviewData.notes,
        followUpRequired: interviewData.followUpRequired,
        followUpDate: interviewData.followUpDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setInterviews([...interviews, newInterview])
    }
    setShowAddModal(false)
    setEditingInterview(null)
  }

  const filteredInterviews = interviews.filter((interview) => {
    const matchesSearch = interview.staffName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         interview.staffId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFacility = selectedFacility === 'all' || interview.department === selectedFacility
    const matchesDepartment = selectedDepartment === 'all' || interview.department === selectedDepartment
    
    // 日付フィルター
    const matchesDateRange = (() => {
      if (!dateRange.start && !dateRange.end) return true
      const interviewDate = new Date(interview.date)
      if (dateRange.start && interviewDate < new Date(dateRange.start)) return false
      if (dateRange.end && interviewDate > new Date(dateRange.end)) return false
      return true
    })()
    
    return matchesSearch && matchesFacility && matchesDepartment && matchesDateRange
  })

  return (
    <div>
      <CommonHeader 
        title="面談管理" 
        showBackButton={true} 
        backUrl="/"
        backText="ダッシュボードに戻る"
      />
      
      <div className={styles.container}>
        <div className={styles.tabNavigation}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              <span className={styles.tabLabel}>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className={styles.tabContent}>
          {activeTab === 'schedule' && (
            <ScheduleTab 
              interviews={filteredInterviews.filter(i => i.status === '予定')}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedFacility={selectedFacility}
              setSelectedFacility={setSelectedFacility}
              selectedDepartment={selectedDepartment}
              setSelectedDepartment={setSelectedDepartment}
              onInterviewSelect={handleInterviewSelect}
              onAddClick={() => setShowAddModal(true)}
              onEditClick={(interview) => {
                setEditingInterview(interview)
                setShowAddModal(true)
              }}
            />
          )}
          {activeTab === 'history' && (
            <HistoryTab 
              interviews={filteredInterviews.filter(i => i.status === '完了')}
              onInterviewSelect={handleInterviewSelect}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          )}
          {activeTab === 'feedback' && <FeedbackTab selectedInterview={selectedInterview} />}
          {activeTab === 'report' && <ReportTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </div>
      
      <InterviewModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setEditingInterview(null)
        }}
        onSave={handleSaveInterview}
        interview={editingInterview}
      />
    </div>
  )
}

interface ScheduleTabProps {
  interviews: Interview[]
  searchTerm: string
  setSearchTerm: (value: string) => void
  selectedFacility: string
  setSelectedFacility: (value: string) => void
  selectedDepartment: string
  setSelectedDepartment: (value: string) => void
  onInterviewSelect: (interview: Interview) => void
  onAddClick: () => void
  onEditClick?: (interview: Interview) => void
}

function ScheduleTab({ interviews, searchTerm, setSearchTerm, selectedFacility, setSelectedFacility, selectedDepartment, setSelectedDepartment, onInterviewSelect, onAddClick, onEditClick }: ScheduleTabProps) {
  return (
    <div className={styles.listContainer}>
      <div className={styles.searchSection}>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="職員名または職員IDで検索"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.filters}>
          <select 
            value={selectedFacility} 
            onChange={(e) => setSelectedFacility(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">全施設</option>
            <option value="小原病院">小原病院</option>
            <option value="立神リハビリテーション温泉病院">立神リハビリテーション温泉病院</option>
          </select>
          <select 
            value={selectedDepartment} 
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">全部署</option>
            <option value="外科病棟">外科病棟</option>
            <option value="内科病棟">内科病棟</option>
            <option value="救急科">救急科</option>
            <option value="地域包括ケア病棟">地域包括ケア病棟</option>
            <option value="外来">外来</option>
            <option value="緩和ケア病棟">緩和ケア病棟</option>
          </select>
        </div>
      </div>

      <div className={styles.listHeader}>
        <h2>面談予定 ({interviews.length}件)</h2>
        <button className={styles.addButton} onClick={onAddClick}>
          + 新規面談を追加
        </button>
      </div>

      <div className={styles.interviewGrid}>
        {interviews.map((interview) => (
          <div key={interview.id} className={styles.interviewCard} onClick={() => onInterviewSelect(interview)}>
            <div className={styles.cardHeader}>
              <div className={styles.cardDate}>
                <div className={styles.dateDay}>{new Date(interview.date).getDate()}</div>
                <div className={styles.dateMonth}>{new Date(interview.date).toLocaleDateString('ja-JP', { month: 'short' })}</div>
              </div>
              <div className={styles.cardInfo}>
                <h3>{interview.staffName}</h3>
                <p className={styles.staffId}>{interview.staffId}</p>
                <p className={styles.interviewTime}>{interview.time} - {interview.type}</p>
                <p className={styles.interviewPurpose}>{interview.purpose}</p>
                {interview.location && <p className={styles.interviewLocation}>📍 {interview.location}</p>}
              </div>
              <div className={styles.cardActions}>
                <button 
                  className={styles.actionButton} 
                  onClick={(e) => { 
                    e.stopPropagation();
                    if (onEditClick) onEditClick(interview);
                  }}
                >
                  編集
                </button>
                <button className={styles.actionButton} onClick={(e) => { e.stopPropagation(); }}>
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface HistoryTabProps {
  interviews: Interview[]
  onInterviewSelect: (interview: Interview) => void
  dateRange?: { start: string; end: string }
  onDateRangeChange?: (range: { start: string; end: string }) => void
}

function HistoryTab({ interviews, onInterviewSelect, dateRange, onDateRangeChange }: HistoryTabProps) {
  const [sortBy, setSortBy] = useState<'date' | 'type' | 'staff'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  
  const sortedInterviews = [...interviews].sort((a, b) => {
    let comparison = 0
    switch (sortBy) {
      case 'date':
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
        break
      case 'type':
        comparison = a.type.localeCompare(b.type)
        break
      case 'staff':
        comparison = a.staffName.localeCompare(b.staffName)
        break
    }
    return sortOrder === 'asc' ? comparison : -comparison
  })
  
  return (
    <div className={styles.historyContainer}>
      <div className={styles.historyHeader}>
        <h2>面談履歴 ({interviews.length}件)</h2>
        <div className={styles.historyControls}>
          <div className={styles.dateRangeFilter}>
            <input
              type="date"
              value={dateRange?.start || ''}
              onChange={(e) => onDateRangeChange?.({ ...dateRange || { start: '', end: '' }, start: e.target.value })}
              className={styles.dateInput}
              placeholder="開始日"
            />
            <span className={styles.dateRangeSeparator}>〜</span>
            <input
              type="date"
              value={dateRange?.end || ''}
              onChange={(e) => onDateRangeChange?.({ ...dateRange || { start: '', end: '' }, end: e.target.value })}
              className={styles.dateInput}
              placeholder="終了日"
            />
          </div>
          <div className={styles.sortControls}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'type' | 'staff')}
              className={styles.sortSelect}
            >
              <option value="date">日付順</option>
              <option value="type">種別順</option>
              <option value="staff">職員順</option>
            </select>
            <button
              className={styles.sortOrderButton}
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              title={sortOrder === 'asc' ? '昇順' : '降順'}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      <div className={styles.historyList}>
        {sortedInterviews.map((interview) => (
          <div key={interview.id} className={styles.historyItem} onClick={() => onInterviewSelect(interview)}>
            <div className={styles.historyDate}>
              <div className={styles.historyDateText}>{new Date(interview.date).toLocaleDateString('ja-JP')}</div>
              <div className={styles.historyTime}>{interview.time}</div>
            </div>
            <div className={styles.historyInfo}>
              <h4>{interview.staffName} - {interview.type}</h4>
              <p className={styles.historyPurpose}>{interview.purpose}</p>
              {interview.feedback && interview.feedback.keyPoints && interview.feedback.keyPoints.length > 0 && (
                <p className={styles.historyFeedback}>{interview.feedback.keyPoints[0]}</p>
              )}
            </div>
            <div className={styles.historyStatus}>
              <span className={styles.statusCompleted}>完了</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface FeedbackTabProps {
  selectedInterview: Interview | null
}

function FeedbackTab({ selectedInterview }: FeedbackTabProps) {
  if (!selectedInterview) {
    return (
      <div className={styles.noSelection}>
        <p>面談を選択してください</p>
      </div>
    )
  }

  return (
    <div className={styles.feedbackContainer}>
      <div className={styles.feedbackHeader}>
        <h2>面談フィードバック</h2>
        <div className={styles.interviewMeta}>
          <span>{selectedInterview.staffName}</span>
          <span>{new Date(selectedInterview.date).toLocaleDateString('ja-JP')}</span>
          <span>{selectedInterview.type}</span>
        </div>
      </div>

      <div className={styles.feedbackForm}>
        <div className={styles.formSection}>
          <h3>面談概要</h3>
          <textarea 
            className={styles.textArea}
            placeholder="面談の概要を入力してください"
            rows={4}
            defaultValue={selectedInterview.notes}
          />
        </div>

        <div className={styles.formSection}>
          <h3>フィードバック内容</h3>
          <textarea 
            className={styles.textArea}
            placeholder="フィードバック内容を入力してください"
            rows={6}
            defaultValue={selectedInterview.feedback?.keyPoints?.join('\n') || ''}
          />
        </div>

        <div className={styles.formSection}>
          <h3>今後のアクションプラン</h3>
          <textarea 
            className={styles.textArea}
            placeholder="今後のアクションプランを入力してください"
            rows={4}
          />
        </div>

        <div className={styles.formActions}>
          <button className={styles.saveButton}>保存</button>
          <button className={styles.cancelButton}>キャンセル</button>
        </div>
      </div>
    </div>
  )
}

function ReportTab(): React.ReactElement {
  return (
    <div className={styles.reportContainer}>
      <h2>面談レポート</h2>
      <div className={styles.comingSoon}>
        <p>面談レポート機能は現在開発中です</p>
      </div>
    </div>
  )
}

function SettingsTab(): React.ReactElement {
  return (
    <div className={styles.settingsContainer}>
      <h2>面談設定</h2>
      <div className={styles.comingSoon}>
        <p>面談設定機能は現在開発中です</p>
      </div>
    </div>
  )
}