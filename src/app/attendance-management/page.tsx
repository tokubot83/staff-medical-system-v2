'use client'

import React, { useState } from 'react'
import CommonHeader from '@/components/CommonHeader'
import styles from './Attendance.module.css'
import {
  CalendarIcon,
  ClockIcon,
  ChartBarIcon,
  DocumentTextIcon,
  CogIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

// タブタイプの定義
type TabType = 'daily' | 'monthly' | 'overtime' | 'leave' | 'settings'

// 勤怠記録の型定義
interface AttendanceRecord {
  id: string
  employeeId: string
  employeeName: string
  date: string
  checkIn: string | null
  checkOut: string | null
  breakTime: number
  workingHours: number
  overtimeHours: number
  status: 'normal' | 'late' | 'early' | 'absent'
  department: string
}

// 月次集計の型定義
interface MonthlyStats {
  employeeId: string
  employeeName: string
  department: string
  workingDays: number
  totalHours: number
  overtimeHours: number
  lateCount: number
  earlyCount: number
  absentCount: number
  leaveUsed: number
}

// ダミーデータ
const attendanceData: AttendanceRecord[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    employeeName: '田中太郎',
    date: '2024-01-15',
    checkIn: '09:00',
    checkOut: '18:00',
    breakTime: 60,
    workingHours: 8,
    overtimeHours: 0,
    status: 'normal',
    department: '看護部'
  },
  {
    id: '2',
    employeeId: 'EMP002',
    employeeName: '佐藤花子',
    date: '2024-01-15',
    checkIn: '09:15',
    checkOut: '18:30',
    breakTime: 60,
    workingHours: 8.25,
    overtimeHours: 0.5,
    status: 'late',
    department: 'リハビリ科'
  },
  {
    id: '3',
    employeeId: 'EMP003',
    employeeName: '鈴木一郎',
    date: '2024-01-15',
    checkIn: '08:45',
    checkOut: '17:45',
    breakTime: 60,
    workingHours: 8,
    overtimeHours: 0,
    status: 'early',
    department: '事務部'
  }
]

const monthlyData: MonthlyStats[] = [
  {
    employeeId: 'EMP001',
    employeeName: '田中太郎',
    department: '看護部',
    workingDays: 22,
    totalHours: 176,
    overtimeHours: 8,
    lateCount: 0,
    earlyCount: 0,
    absentCount: 0,
    leaveUsed: 2
  },
  {
    employeeId: 'EMP002',
    employeeName: '佐藤花子',
    department: 'リハビリ科',
    workingDays: 21,
    totalHours: 170,
    overtimeHours: 12,
    lateCount: 3,
    earlyCount: 0,
    absentCount: 1,
    leaveUsed: 3
  }
]

export default function AttendanceManagement() {
  const [activeTab, setActiveTab] = useState<TabType>('daily')
  const [searchTerm, setSearchTerm] = useState('')

  // タブ設定
  const tabs = [
    { id: 'daily' as TabType, label: '日次勤怠', icon: CalendarIcon },
    { id: 'monthly' as TabType, label: '月次集計', icon: ChartBarIcon },
    { id: 'overtime' as TabType, label: '残業管理', icon: ClockIcon },
    { id: 'leave' as TabType, label: '休暇管理', icon: DocumentTextIcon },
    { id: 'settings' as TabType, label: '設定', icon: CogIcon }
  ]

  // 検索フィルタリング
  const filteredAttendanceData = attendanceData.filter(record =>
    record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredMonthlyData = monthlyData.filter(record =>
    record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // ステータスアイコンの取得
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

  // ステータス名の取得
  const getStatusText = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'normal': return '正常'
      case 'late': return '遅刻'
      case 'early': return '早退'
      case 'absent': return '欠勤'
      default: return '-'
    }
  }

  // 日次勤怠タブの内容
  const renderDailyTab = () => (
    <div className={styles.tabContent}>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>職員ID</th>
              <th>氏名</th>
              <th>部署</th>
              <th>出勤時刻</th>
              <th>退勤時刻</th>
              <th>勤務時間</th>
              <th>残業時間</th>
              <th>ステータス</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendanceData.map((record) => (
              <tr key={record.id}>
                <td>{record.employeeId}</td>
                <td>{record.employeeName}</td>
                <td>{record.department}</td>
                <td>{record.checkIn || '-'}</td>
                <td>{record.checkOut || '-'}</td>
                <td>{record.workingHours}h</td>
                <td>{record.overtimeHours}h</td>
                <td className={styles.statusCell}>
                  {getStatusIcon(record.status)}
                  <span>{getStatusText(record.status)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  // 月次集計タブの内容
  const renderMonthlyTab = () => (
    <div className={styles.tabContent}>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>職員ID</th>
              <th>氏名</th>
              <th>部署</th>
              <th>出勤日数</th>
              <th>総勤務時間</th>
              <th>残業時間</th>
              <th>遅刻回数</th>
              <th>早退回数</th>
              <th>欠勤回数</th>
              <th>有給使用</th>
            </tr>
          </thead>
          <tbody>
            {filteredMonthlyData.map((record) => (
              <tr key={record.employeeId}>
                <td>{record.employeeId}</td>
                <td>{record.employeeName}</td>
                <td>{record.department}</td>
                <td>{record.workingDays}日</td>
                <td>{record.totalHours}h</td>
                <td>{record.overtimeHours}h</td>
                <td>{record.lateCount}回</td>
                <td>{record.earlyCount}回</td>
                <td>{record.absentCount}回</td>
                <td>{record.leaveUsed}日</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  // 残業管理タブの内容
  const renderOvertimeTab = () => {
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

  // 休暇管理タブの内容
  const renderLeaveTab = () => {
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

  // 設定タブの内容
  const renderSettingsTab = () => {
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

  // タブ内容のレンダリング
  const renderTabContent = () => {
    switch (activeTab) {
      case 'daily':
        return renderDailyTab()
      case 'monthly':
        return renderMonthlyTab()
      case 'overtime':
        return renderOvertimeTab()
      case 'leave':
        return renderLeaveTab()
      case 'settings':
        return renderSettingsTab()
      default:
        return renderDailyTab()
    }
  }

  return (
    <div className={styles.container}>
      <CommonHeader />
      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.contentHeader}>
            <div className={styles.header}>
              <h1 className={styles.title}>勤怠管理</h1>
              <button className={styles.addButton}>
                <PlusIcon className={styles.addIcon} />
                新規記録
              </button>
            </div>

            <div className={styles.tabs}>
              {tabs.map((tab) => (
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
                  <MagnifyingGlassIcon className={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="職員名またはIDで検索"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                  />
                </div>
                <select className={styles.filterSelect}>
                  <option value="">全部署</option>
                  <option value="看護部">看護部</option>
                  <option value="リハビリ科">リハビリ科</option>
                  <option value="事務部">事務部</option>
                </select>
                <select className={styles.filterSelect}>
                  <option value="">全ステータス</option>
                  <option value="normal">正常</option>
                  <option value="late">遅刻</option>
                  <option value="early">早退</option>
                  <option value="absent">欠勤</option>
                </select>
              </div>
            )}
          </div>

          {renderTabContent()}
        </div>
      </main>
    </div>
  )
}