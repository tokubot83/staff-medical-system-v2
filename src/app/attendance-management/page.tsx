'use client'

import React, { useState } from 'react'
import CommonHeader from '@/components/CommonHeader/CommonHeader'
import styles from './Attendance.module.css'
import { 
  CalendarIcon, 
  ClockIcon, 
  ChartBarIcon, 
  DocumentReportIcon,
  CogIcon,
  SearchIcon,
  PlusIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon
} from '@heroicons/react/outline'

// タブタイプの定義
type TabType = 'daily' | 'monthly' | 'overtime' | 'leave' | 'settings'

// 勤怠記録の型定義
interface AttendanceRecord {
  id: string
  staffId: string
  staffName: string
  date: string
  checkIn: string
  checkOut: string
  breakTime: number // 分単位
  overtime: number // 分単位
  status: 'normal' | 'late' | 'early' | 'absent' | 'holiday'
  notes?: string
  department: string
  facility: string
}

// 月次サマリーの型定義
interface MonthlySummary {
  staffId: string
  staffName: string
  month: string
  workDays: number
  lateCount: number
  earlyCount: number
  absentCount: number
  overtimeHours: number
  paidLeaveUsed: number
  paidLeaveRemaining: number
}

// ダミーデータ
const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: '1',
    staffId: 'ST001',
    staffName: '山田太郎',
    date: '2024-01-15',
    checkIn: '08:55',
    checkOut: '18:15',
    breakTime: 60,
    overtime: 75,
    status: 'normal',
    department: '内科',
    facility: '東京医療センター'
  },
  {
    id: '2',
    staffId: 'ST002',
    staffName: '佐藤花子',
    date: '2024-01-15',
    checkIn: '09:10',
    checkOut: '17:30',
    breakTime: 60,
    overtime: 0,
    status: 'late',
    notes: '電車遅延',
    department: '外科',
    facility: '東京医療センター'
  },
  {
    id: '3',
    staffId: 'ST003',
    staffName: '鈴木一郎',
    date: '2024-01-15',
    checkIn: '08:45',
    checkOut: '17:00',
    breakTime: 60,
    overtime: 0,
    status: 'normal',
    department: '小児科',
    facility: '大阪医療センター'
  },
]

const mockMonthlySummaries: MonthlySummary[] = [
  {
    staffId: 'ST001',
    staffName: '山田太郎',
    month: '2024-01',
    workDays: 20,
    lateCount: 1,
    earlyCount: 0,
    absentCount: 0,
    overtimeHours: 25.5,
    paidLeaveUsed: 2,
    paidLeaveRemaining: 18
  },
  {
    staffId: 'ST002',
    staffName: '佐藤花子',
    month: '2024-01',
    workDays: 19,
    lateCount: 3,
    earlyCount: 1,
    absentCount: 1,
    overtimeHours: 10.0,
    paidLeaveUsed: 3,
    paidLeaveRemaining: 15
  },
]

// タブコンポーネント
const DailyTab: React.FC<{ 
  records: AttendanceRecord[]
  searchTerm: string
  selectedFacility: string
  selectedDepartment: string
}> = ({ records, searchTerm, selectedFacility, selectedDepartment }) => {
  const filteredRecords = records.filter(record => {
    const matchesSearch = searchTerm === '' || 
      record.staffName.includes(searchTerm) || 
      record.staffId.includes(searchTerm)
    const matchesFacility = selectedFacility === '' || record.facility === selectedFacility
    const matchesDepartment = selectedDepartment === '' || record.department === selectedDepartment
    return matchesSearch && matchesFacility && matchesDepartment
  })

  const getStatusIcon = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'normal':
        return <CheckCircleIcon className={styles.statusIcon} style={{ color: '#10b981' }} />
      case 'late':
        return <ExclamationCircleIcon className={styles.statusIcon} style={{ color: '#f59e0b' }} />
      case 'early':
        return <ExclamationCircleIcon className={styles.statusIcon} style={{ color: '#3b82f6' }} />
      case 'absent':
        return <XCircleIcon className={styles.statusIcon} style={{ color: '#ef4444' }} />
      default:
        return null
    }
  }

  const getStatusText = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'normal': return '正常'
      case 'late': return '遅刻'
      case 'early': return '早退'
      case 'absent': return '欠勤'
      case 'holiday': return '休日'
      default: return ''
    }
  }

  return (
    <div className={styles.tabContent}>
      <div className={styles.recordsGrid}>
        {filteredRecords.map(record => (
          <div key={record.id} className={styles.recordCard}>
            <div className={styles.recordHeader}>
              <div>
                <h3 className={styles.staffName}>{record.staffName}</h3>
                <p className={styles.staffInfo}>{record.staffId} · {record.department}</p>
              </div>
              <div className={styles.statusBadge}>
                {getStatusIcon(record.status)}
                <span>{getStatusText(record.status)}</span>
              </div>
            </div>
            <div className={styles.recordBody}>
              <div className={styles.timeInfo}>
                <div>
                  <p className={styles.label}>出勤</p>
                  <p className={styles.time}>{record.checkIn}</p>
                </div>
                <div>
                  <p className={styles.label}>退勤</p>
                  <p className={styles.time}>{record.checkOut}</p>
                </div>
                <div>
                  <p className={styles.label}>休憩</p>
                  <p className={styles.time}>{record.breakTime}分</p>
                </div>
                <div>
                  <p className={styles.label}>残業</p>
                  <p className={styles.time}>{record.overtime}分</p>
                </div>
              </div>
              {record.notes && (
                <div className={styles.notes}>
                  <p className={styles.notesLabel}>備考:</p>
                  <p>{record.notes}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const MonthlyTab: React.FC<{ summaries: MonthlySummary[] }> = ({ summaries }) => {
  return (
    <div className={styles.tabContent}>
      <div className={styles.summaryList}>
        {summaries.map(summary => (
          <div key={summary.staffId} className={styles.summaryCard}>
            <div className={styles.summaryHeader}>
              <h3>{summary.staffName}</h3>
              <span className={styles.month}>{summary.month}</span>
            </div>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <p className={styles.summaryLabel}>出勤日数</p>
                <p className={styles.summaryValue}>{summary.workDays}日</p>
              </div>
              <div className={styles.summaryItem}>
                <p className={styles.summaryLabel}>遅刻回数</p>
                <p className={styles.summaryValue}>{summary.lateCount}回</p>
              </div>
              <div className={styles.summaryItem}>
                <p className={styles.summaryLabel}>早退回数</p>
                <p className={styles.summaryValue}>{summary.earlyCount}回</p>
              </div>
              <div className={styles.summaryItem}>
                <p className={styles.summaryLabel}>欠勤回数</p>
                <p className={styles.summaryValue}>{summary.absentCount}回</p>
              </div>
              <div className={styles.summaryItem}>
                <p className={styles.summaryLabel}>残業時間</p>
                <p className={styles.summaryValue}>{summary.overtimeHours}時間</p>
              </div>
              <div className={styles.summaryItem}>
                <p className={styles.summaryLabel}>有給取得</p>
                <p className={styles.summaryValue}>{summary.paidLeaveUsed}日</p>
              </div>
              <div className={styles.summaryItem}>
                <p className={styles.summaryLabel}>有給残数</p>
                <p className={styles.summaryValue}>{summary.paidLeaveRemaining}日</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const OvertimeTab: React.FC = () => {
  return (
    <div className={styles.tabContent}>
      <div className={styles.placeholder}>
        <ChartBarIcon className={styles.placeholderIcon} />
        <h2>残業管理</h2>
        <p>残業時間の分析と管理機能は開発中です</p>
      </div>
    </div>
  )
}

const LeaveTab: React.FC = () => {
  return (
    <div className={styles.tabContent}>
      <div className={styles.placeholder}>
        <CalendarIcon className={styles.placeholderIcon} />
        <h2>休暇管理</h2>
        <p>休暇申請と承認機能は開発中です</p>
      </div>
    </div>
  )
}

const SettingsTab: React.FC = () => {
  return (
    <div className={styles.tabContent}>
      <div className={styles.placeholder}>
        <CogIcon className={styles.placeholderIcon} />
        <h2>設定</h2>
        <p>勤怠管理の設定機能は開発中です</p>
      </div>
    </div>
  )
}

export default function AttendanceManagementPage() {
  const [activeTab, setActiveTab] = useState<TabType>('daily')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFacility, setSelectedFacility] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')

  const tabs = [
    { id: 'daily' as TabType, label: '日次勤怠', icon: CalendarIcon },
    { id: 'monthly' as TabType, label: '月次集計', icon: ChartBarIcon },
    { id: 'overtime' as TabType, label: '残業管理', icon: ClockIcon },
    { id: 'leave' as TabType, label: '休暇管理', icon: DocumentReportIcon },
    { id: 'settings' as TabType, label: '設定', icon: CogIcon },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'daily':
        return (
          <DailyTab 
            records={mockAttendanceRecords}
            searchTerm={searchTerm}
            selectedFacility={selectedFacility}
            selectedDepartment={selectedDepartment}
          />
        )
      case 'monthly':
        return <MonthlyTab summaries={mockMonthlySummaries} />
      case 'overtime':
        return <OvertimeTab />
      case 'leave':
        return <LeaveTab />
      case 'settings':
        return <SettingsTab />
      default:
        return null
    }
  }

  return (
    <div className={styles.container}>
      <CommonHeader />
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>勤怠管理</h1>
          <button className={styles.addButton}>
            <PlusIcon className={styles.addIcon} />
            新規記録
          </button>
        </div>

        <div className={styles.tabContainer}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className={styles.tabIcon} />
              {tab.label}
            </button>
          ))}
        </div>

        {(activeTab === 'daily' || activeTab === 'monthly') && (
          <div className={styles.filters}>
            <div className={styles.searchBox}>
              <SearchIcon className={styles.searchIcon} />
              <input
                type="text"
                placeholder="職員名またはIDで検索"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <select
              value={selectedFacility}
              onChange={(e) => setSelectedFacility(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">全施設</option>
              <option value="東京医療センター">東京医療センター</option>
              <option value="大阪医療センター">大阪医療センター</option>
              <option value="名古屋医療センター">名古屋医療センター</option>
            </select>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">全部署</option>
              <option value="内科">内科</option>
              <option value="外科">外科</option>
              <option value="小児科">小児科</option>
              <option value="産婦人科">産婦人科</option>
            </select>
          </div>
        )}

        {renderTabContent()}
      </main>
    </div>
  )
}