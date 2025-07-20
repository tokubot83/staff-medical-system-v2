'use client'

import React, { useState } from 'react'
import CommonHeader from '@/components/CommonHeader'
import Link from 'next/link'
import { staffDatabase } from '../data/staffData.js'
import styles from './Interviews.module.css'

const tabs = [
  { id: 'schedule', label: '面談予定', icon: '📅' },
  { id: 'history', label: '面談履歴', icon: '📝' },
  { id: 'feedback', label: 'フィードバック', icon: '💬' },
  { id: 'report', label: 'レポート', icon: '📊' },
  { id: 'settings', label: '設定', icon: '⚙️' },
]

interface Interview {
  id: string
  staffId: string
  staffName: string
  date: string
  time: string
  type: string
  status: 'scheduled' | 'completed' | 'cancelled'
  purpose: string
  notes?: string
  feedback?: string
}

export default function InterviewsPage() {
  const [activeTab, setActiveTab] = useState('schedule')
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFacility, setSelectedFacility] = useState('all')
  const [selectedDepartment, setSelectedDepartment] = useState('all')

  const mockInterviews: Interview[] = [
    {
      id: '1',
      staffId: 'S001',
      staffName: '山田太郎',
      date: '2024-07-25',
      time: '14:00',
      type: '定期面談',
      status: 'scheduled',
      purpose: '上期評価フィードバック',
    },
    {
      id: '2',
      staffId: 'S002',
      staffName: '佐藤花子',
      date: '2024-07-24',
      time: '10:00',
      type: 'キャリア面談',
      status: 'scheduled',
      purpose: 'キャリアパス相談',
    },
    {
      id: '3',
      staffId: 'S003',
      staffName: '鈴木一郎',
      date: '2024-07-23',
      time: '15:30',
      type: '1on1',
      status: 'completed',
      purpose: '業務改善提案',
      feedback: '積極的な改善提案があり、実施に向けて検討中',
    },
  ]

  const handleInterviewSelect = (interview: Interview) => {
    setSelectedInterview(interview)
    setActiveTab('feedback')
  }

  const filteredInterviews = mockInterviews.filter((interview) => {
    const matchesSearch = interview.staffName.includes(searchTerm) || interview.staffId.includes(searchTerm)
    return matchesSearch
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
              interviews={filteredInterviews.filter(i => i.status === 'scheduled')}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedFacility={selectedFacility}
              setSelectedFacility={setSelectedFacility}
              selectedDepartment={selectedDepartment}
              setSelectedDepartment={setSelectedDepartment}
              onInterviewSelect={handleInterviewSelect}
            />
          )}
          {activeTab === 'history' && (
            <HistoryTab 
              interviews={filteredInterviews.filter(i => i.status === 'completed')}
              onInterviewSelect={handleInterviewSelect}
            />
          )}
          {activeTab === 'feedback' && <FeedbackTab selectedInterview={selectedInterview} />}
          {activeTab === 'report' && <ReportTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </div>
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
}

function ScheduleTab({ interviews, searchTerm, setSearchTerm, selectedFacility, setSelectedFacility, selectedDepartment, setSelectedDepartment, onInterviewSelect }: ScheduleTabProps) {
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
            <option value="立髪診療所">立髪診療所</option>
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
        <button className={styles.addButton}>
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
              </div>
              <div className={styles.cardActions}>
                <button className={styles.actionButton} onClick={(e) => { e.stopPropagation(); }}>
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
}

function HistoryTab({ interviews, onInterviewSelect }: HistoryTabProps) {
  return (
    <div className={styles.historyContainer}>
      <div className={styles.listHeader}>
        <h2>面談履歴</h2>
      </div>

      <div className={styles.historyList}>
        {interviews.map((interview) => (
          <div key={interview.id} className={styles.historyItem} onClick={() => onInterviewSelect(interview)}>
            <div className={styles.historyDate}>
              <div className={styles.historyDateText}>{new Date(interview.date).toLocaleDateString('ja-JP')}</div>
              <div className={styles.historyTime}>{interview.time}</div>
            </div>
            <div className={styles.historyInfo}>
              <h4>{interview.staffName} - {interview.type}</h4>
              <p className={styles.historyPurpose}>{interview.purpose}</p>
              {interview.feedback && (
                <p className={styles.historyFeedback}>{interview.feedback}</p>
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
            defaultValue={selectedInterview.feedback}
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