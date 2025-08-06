'use client'

import React, { useState, useEffect } from 'react'
import CommonHeader from '@/components/CommonHeader'
import DashboardButton from '@/components/DashboardButton'
import Link from 'next/link'
import { staffDatabase } from '../data/staffData.js'
import styles from './Interviews.module.css'
import { Interview, InterviewType, InterviewStatus } from '@/types/interview'
import { mockInterviews, getUpcomingInterviews } from '@/data/mockInterviews'
import InterviewModal from '@/components/InterviewModal'
import InterviewSheetSelector from '@/components/interview/InterviewSheetSelector'
import InterviewSheetWrapper from '@/components/interview/InterviewSheetWrapper'
import { getExperienceCategory } from '@/utils/experienceUtils'

const tabs = [
  { id: 'schedule', label: '面談予定', icon: '📅' },
  { id: 'history', label: '面談履歴', icon: '📝' },
  { id: 'feedback', label: 'フィードバック', icon: '💬' },
  { id: 'sheets', label: '面談シート', icon: '📄' },
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
        employeeId: interviewData.employeeId || '',
        employeeName: interviewData.employeeName || '',
        employeeEmail: interviewData.employeeEmail || 'test@example.com',
        facility: '小原病院',
        department: interviewData.department || '内科',
        position: interviewData.position || '看護師',
        bookingDate: interviewData.bookingDate || new Date().toISOString().split('T')[0],
        startTime: interviewData.startTime || '10:00',
        endTime: interviewData.endTime || '11:00',
        interviewType: interviewData.interviewType || 'ad_hoc',
        interviewCategory: interviewData.interviewCategory || 'other',
        requestedTopics: interviewData.requestedTopics || [],
        description: interviewData.description || '',
        urgencyLevel: interviewData.urgencyLevel || 'medium',
        status: interviewData.status || 'scheduled',
        interviewerId: interviewData.interviewerId || 'M001',
        interviewerName: interviewData.interviewerName || '田中管理者',
        createdAt: new Date().toISOString(),
        createdBy: 'system',
        duration: interviewData.duration,
        adminNotes: interviewData.adminNotes,
        employeeNotes: interviewData.employeeNotes
      }
      setInterviews([...interviews, newInterview])
    }
    setShowAddModal(false)
    setEditingInterview(null)
  }

  const filteredInterviews = interviews.filter((interview) => {
    const matchesSearch = interview.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         interview.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFacility = selectedFacility === 'all' || interview.department === selectedFacility
    const matchesDepartment = selectedDepartment === 'all' || interview.department === selectedDepartment
    
    // 日付フィルター
    const matchesDateRange = (() => {
      if (!dateRange.start && !dateRange.end) return true
      const interviewDate = new Date(interview.bookingDate)
      if (dateRange.start && interviewDate < new Date(dateRange.start)) return false
      if (dateRange.end && interviewDate > new Date(dateRange.end)) return false
      return true
    })()
    
    return matchesSearch && matchesFacility && matchesDepartment && matchesDateRange
  })

  return (
    <div>
      <div className="print:hidden">
        <CommonHeader title="面談管理" />
      </div>
      
      <div className={styles.container}>
        <div className={`${styles.tabNavigation} print:hidden`}>
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
              interviews={filteredInterviews.filter(i => i.status === 'scheduled')}
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
              interviews={filteredInterviews.filter(i => i.status === 'completed')}
              onInterviewSelect={handleInterviewSelect}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          )}
          {activeTab === 'feedback' && <FeedbackTab selectedInterview={selectedInterview} />}
          {activeTab === 'sheets' && <InterviewSheetsTab />}
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
      <DashboardButton />
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
                <div className={styles.dateDay}>{new Date(interview.bookingDate).getDate()}</div>
                <div className={styles.dateMonth}>{new Date(interview.bookingDate).toLocaleDateString('ja-JP', { month: 'short' })}</div>
              </div>
              <div className={styles.cardInfo}>
                <h3>{interview.employeeName}</h3>
                <p className={styles.staffId}>{interview.employeeId}</p>
                <p className={styles.interviewTime}>{interview.startTime} - {interview.interviewType}</p>
                <p className={styles.interviewPurpose}>{interview.description}</p>
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
        comparison = new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime()
        break
      case 'type':
        comparison = a.interviewType.localeCompare(b.interviewType)
        break
      case 'staff':
        comparison = a.employeeName.localeCompare(b.employeeName)
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
              <div className={styles.historyDateText}>{new Date(interview.bookingDate).toLocaleDateString('ja-JP')}</div>
              <div className={styles.historyTime}>{interview.startTime}</div>
            </div>
            <div className={styles.historyInfo}>
              <h4>{interview.employeeName} - {interview.interviewType}</h4>
              <p className={styles.historyPurpose}>{interview.description}</p>
              {interview.outcomeSummary && (
                <p className={styles.historyFeedback}>{interview.outcomeSummary}</p>
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
          <span>{selectedInterview.employeeName}</span>
          <span>{new Date(selectedInterview.bookingDate).toLocaleDateString('ja-JP')}</span>
          <span>{selectedInterview.interviewType}</span>
        </div>
      </div>

      <div className={styles.feedbackForm}>
        <div className={styles.formSection}>
          <h3>面談概要</h3>
          <textarea 
            className={styles.textArea}
            placeholder="面談の概要を入力してください"
            rows={4}
            defaultValue={selectedInterview.employeeNotes}
          />
        </div>

        <div className={styles.formSection}>
          <h3>フィードバック内容</h3>
          <textarea 
            className={styles.textArea}
            placeholder="フィードバック内容を入力してください"
            rows={6}
            defaultValue={selectedInterview.outcomeActionItems?.join('\n') || ''}
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

function InterviewSheetsTab(): React.ReactElement {
  const [selectedStaff, setSelectedStaff] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSheetDuration, setSelectedSheetDuration] = useState<number | null>(null)
  const [showSheet, setShowSheet] = useState(false)
  
  const filteredStaff = Object.values(staffDatabase).filter(staff => 
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelectSheet = (sheetPath: string) => {
    // パスから時間を抽出 (例: /interview-sheets/new/30 -> 30)
    const duration = parseInt(sheetPath.split('/').pop() || '30')
    setSelectedSheetDuration(duration)
    setShowSheet(true)
  }

  return (
    <div className={styles.sheetsContainer}>
      <h2>面談シート選択</h2>
      
      {!showSheet ? (
        <div className={styles.sheetSelectionArea}>
          <div className={styles.staffSearchSection}>
            <h3>職員を選択</h3>
            <input
              type="text"
              placeholder="職員名または職員IDで検索"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            
            <div className={styles.staffList}>
              {filteredStaff.slice(0, 10).map((staff) => (
                <div
                  key={staff.id}
                  className={`${styles.staffItem} ${selectedStaff?.id === staff.id ? styles.selected : ''}`}
                  onClick={() => setSelectedStaff(staff)}
                >
                  <div className={styles.staffInfo}>
                    <span className={styles.staffName}>{staff.name}</span>
                    <span className={styles.staffId}>ID: {staff.id}</span>
                  </div>
                  <span className={styles.staffExperience}>経験年数: {staff.経験年数}年</span>
                </div>
              ))}
            </div>
          </div>
          
          {selectedStaff && (
            <div className={styles.sheetSelectorSection}>
              <InterviewSheetSelector
                staffId={selectedStaff.id}
                staffName={selectedStaff.name}
                yearsOfExperience={selectedStaff.経験年数}
                onSelectSheet={handleSelectSheet}
              />
            </div>
          )}
        </div>
      ) : (
        <div className={styles.sheetViewerSection}>
          <button
            onClick={() => setShowSheet(false)}
            className={`${styles.backButton} print:hidden`}
          >
            ← 職員選択に戻る
          </button>
          {selectedStaff && selectedSheetDuration && (
            <InterviewSheetWrapper
              experienceCategory={getExperienceCategory(selectedStaff.経験年数)}
              duration={selectedSheetDuration}
              staffName={selectedStaff.name}
              yearsOfExperience={selectedStaff.経験年数}
            />
          )}
        </div>
      )}
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