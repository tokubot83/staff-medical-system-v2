'use client'

import React, { useState } from 'react'
import CommonHeader from '@/components/CommonHeader'
import styles from './Attendance.module.css'

const tabs = [
  { id: 'daily', label: '日次勤怠', icon: '📅' },
  { id: 'monthly', label: '月次集計', icon: '📊' },
  { id: 'overtime', label: '残業管理', icon: '⏰' },
  { id: 'leave', label: '休暇管理', icon: '🏖️' },
  { id: 'settings', label: '設定', icon: '⚙️' },
]

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

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState('daily')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFacility, setSelectedFacility] = useState('all')
  const [selectedDepartment, setSelectedDepartment] = useState('all')

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

  const filteredAttendanceData = attendanceData.filter((record) => {
    const matchesSearch = record.employeeName.includes(searchTerm) || record.employeeId.includes(searchTerm)
    const matchesDepartment = selectedDepartment === 'all' || record.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  const filteredMonthlyData = monthlyData.filter((record) => {
    const matchesSearch = record.employeeName.includes(searchTerm) || record.employeeId.includes(searchTerm)
    const matchesDepartment = selectedDepartment === 'all' || record.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  const getStatusColor = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'normal':
        return '#10b981'
      case 'late':
        return '#f59e0b'
      case 'early':
        return '#3b82f6'
      case 'absent':
        return '#ef4444'
      default:
        return '#6b7280'
    }
  }

  const getStatusText = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'normal': return '正常'
      case 'late': return '遅刻'
      case 'early': return '早退'
      case 'absent': return '欠勤'
      default: return '-'
    }
  }

  return (
    <div>
      <CommonHeader 
        title="勤怠管理" 
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
          {activeTab === 'daily' && (
            <DailyTab 
              records={filteredAttendanceData}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedFacility={selectedFacility}
              setSelectedFacility={setSelectedFacility}
              selectedDepartment={selectedDepartment}
              setSelectedDepartment={setSelectedDepartment}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
            />
          )}
          {activeTab === 'monthly' && (
            <MonthlyTab 
              records={filteredMonthlyData}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedDepartment={selectedDepartment}
              setSelectedDepartment={setSelectedDepartment}
            />
          )}
          {activeTab === 'overtime' && <OvertimeTab />}
          {activeTab === 'leave' && <LeaveTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </div>
    </div>
  )
}

interface DailyTabProps {
  records: AttendanceRecord[]
  searchTerm: string
  setSearchTerm: (value: string) => void
  selectedFacility: string
  setSelectedFacility: (value: string) => void
  selectedDepartment: string
  setSelectedDepartment: (value: string) => void
  getStatusColor: (status: AttendanceRecord['status']) => string
  getStatusText: (status: AttendanceRecord['status']) => string
}

function DailyTab({ 
  records, 
  searchTerm, 
  setSearchTerm, 
  selectedFacility, 
  setSelectedFacility, 
  selectedDepartment, 
  setSelectedDepartment,
  getStatusColor,
  getStatusText
}: DailyTabProps) {
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
            <option value="看護部">看護部</option>
            <option value="リハビリ科">リハビリ科</option>
            <option value="事務部">事務部</option>
            <option value="薬剤部">薬剤部</option>
            <option value="検査部">検査部</option>
          </select>
        </div>
      </div>

      <div className={styles.listHeader}>
        <h2>日次勤怠記録 ({records.length}件)</h2>
        <button className={styles.addButton}>
          + 新規記録
        </button>
      </div>

      <div className={styles.recordsGrid}>
        {records.map((record) => (
          <div key={record.id} className={styles.recordCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardInfo}>
                <h3>{record.employeeName}</h3>
                <p className={styles.staffId}>{record.employeeId} · {record.department}</p>
              </div>
              <div className={styles.statusBadge} style={{ backgroundColor: getStatusColor(record.status) + '20', color: getStatusColor(record.status) }}>
                {getStatusText(record.status)}
              </div>
            </div>
            <div className={styles.cardDetails}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>出勤:</span>
                <span className={styles.detailValue}>{record.checkIn || '-'}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>退勤:</span>
                <span className={styles.detailValue}>{record.checkOut || '-'}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>勤務時間:</span>
                <span className={styles.detailValue}>{record.workingHours}時間</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>残業:</span>
                <span className={styles.detailValue}>{record.overtimeHours}時間</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface MonthlyTabProps {
  records: MonthlyStats[]
  searchTerm: string
  setSearchTerm: (value: string) => void
  selectedDepartment: string
  setSelectedDepartment: (value: string) => void
}

function MonthlyTab({ 
  records, 
  searchTerm, 
  setSearchTerm, 
  selectedDepartment, 
  setSelectedDepartment 
}: MonthlyTabProps) {
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
            value={selectedDepartment} 
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">全部署</option>
            <option value="看護部">看護部</option>
            <option value="リハビリ科">リハビリ科</option>
            <option value="事務部">事務部</option>
            <option value="薬剤部">薬剤部</option>
            <option value="検査部">検査部</option>
          </select>
        </div>
      </div>

      <div className={styles.listHeader}>
        <h2>月次勤怠集計</h2>
      </div>

      <div className={styles.recordsList}>
        {records.map((record) => (
          <div key={record.employeeId} className={styles.monthlyItem}>
            <div className={styles.monthlyHeader}>
              <div className={styles.monthlyInfo}>
                <h3>{record.employeeName}</h3>
                <p className={styles.staffId}>{record.employeeId} · {record.department}</p>
              </div>
              <div className={styles.monthlyStats}>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>出勤日数</span>
                  <span className={styles.statValue}>{record.workingDays}日</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>総勤務時間</span>
                  <span className={styles.statValue}>{record.totalHours}h</span>
                </div>
              </div>
            </div>
            <div className={styles.monthlyDetails}>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>残業時間:</span>
                  <span className={styles.detailValue}>{record.overtimeHours}時間</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>遅刻:</span>
                  <span className={styles.detailValue}>{record.lateCount}回</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>早退:</span>
                  <span className={styles.detailValue}>{record.earlyCount}回</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>欠勤:</span>
                  <span className={styles.detailValue}>{record.absentCount}回</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>有給使用:</span>
                  <span className={styles.detailValue}>{record.leaveUsed}日</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function OvertimeTab() {
  return (
    <div className={styles.overtimeContainer}>
      <h2>残業管理</h2>
      <div className={styles.comingSoon}>
        <p>残業時間の分析と管理機能は現在開発中です</p>
      </div>
    </div>
  )
}

function LeaveTab() {
  return (
    <div className={styles.leaveContainer}>
      <h2>休暇管理</h2>
      <div className={styles.comingSoon}>
        <p>休暇申請と承認機能は現在開発中です</p>
      </div>
    </div>
  )
}

function SettingsTab() {
  const [settingsData, setSettingsData] = useState({
    notifications: {
      reminderMinutes: 10,
      reminderEnabled: true,
      overtimeAlertEnabled: true,
      reportEnabled: true
    },
    workingHours: {
      standardStart: '09:00',
      standardEnd: '18:00',
      breakTime: 60,
      flexEnabled: false,
      coreTimeStart: '10:00',
      coreTimeEnd: '15:00'
    },
    overtimeSettings: {
      monthlyLimit: 45,
      requireApproval: true,
      alertThreshold: 36,
      autoCalculate: true
    },
    leaveSettings: {
      annualDays: 20,
      carryOverEnabled: true,
      maxCarryOver: 20,
      halfDayEnabled: true,
      hourlyEnabled: false
    }
  })

  const handleNotificationChange = (field: string, value: boolean | number) => {
    setSettingsData({
      ...settingsData,
      notifications: {
        ...settingsData.notifications,
        [field]: value
      }
    })
  }

  const handleWorkingHoursChange = (field: string, value: string | number | boolean) => {
    setSettingsData({
      ...settingsData,
      workingHours: {
        ...settingsData.workingHours,
        [field]: value
      }
    })
  }

  const handleOvertimeChange = (field: string, value: boolean | number) => {
    setSettingsData({
      ...settingsData,
      overtimeSettings: {
        ...settingsData.overtimeSettings,
        [field]: value
      }
    })
  }

  const handleLeaveChange = (field: string, value: boolean | number) => {
    setSettingsData({
      ...settingsData,
      leaveSettings: {
        ...settingsData.leaveSettings,
        [field]: value
      }
    })
  }

  return (
    <div className={styles.settingsContainer}>
      <h2>勤怠設定</h2>
      
      <div className={styles.settingsSection}>
        <h3>通知設定</h3>
        <div className={styles.settingsGroup}>
          <div className={styles.settingItem}>
            <label className={styles.settingLabel}>
              <input
                type="checkbox"
                checked={settingsData.notifications.reminderEnabled}
                onChange={(e) => handleNotificationChange('reminderEnabled', e.target.checked)}
              />
              出勤リマインダーを有効にする
            </label>
          </div>
          
          <div className={styles.settingItem}>
            <label className={styles.settingLabel}>
              リマインダー送信時間（出勤前）
              <input
                type="number"
                min="5"
                max="60"
                value={settingsData.notifications.reminderMinutes}
                onChange={(e) => handleNotificationChange('reminderMinutes', parseInt(e.target.value))}
                className={styles.numberInput}
              />
              分前
            </label>
          </div>
          
          <div className={styles.settingItem}>
            <label className={styles.settingLabel}>
              <input
                type="checkbox"
                checked={settingsData.notifications.overtimeAlertEnabled}
                onChange={(e) => handleNotificationChange('overtimeAlertEnabled', e.target.checked)}
              />
              残業時間アラートを有効にする
            </label>
          </div>
          
          <div className={styles.settingItem}>
            <label className={styles.settingLabel}>
              <input
                type="checkbox"
                checked={settingsData.notifications.reportEnabled}
                onChange={(e) => handleNotificationChange('reportEnabled', e.target.checked)}
              />
              月次レポートを自動送信する
            </label>
          </div>
        </div>
      </div>

      <div className={styles.settingsSection}>
        <h3>勤務時間設定</h3>
        <div className={styles.settingsGroup}>
          <div className={styles.settingItem}>
            <label className={styles.settingLabel}>
              標準勤務開始時刻
              <input
                type="time"
                value={settingsData.workingHours.standardStart}
                onChange={(e) => handleWorkingHoursChange('standardStart', e.target.value)}
                className={styles.numberInput}
                style={{ width: 'auto' }}
              />
            </label>
          </div>
          
          <div className={styles.settingItem}>
            <label className={styles.settingLabel}>
              標準勤務終了時刻
              <input
                type="time"
                value={settingsData.workingHours.standardEnd}
                onChange={(e) => handleWorkingHoursChange('standardEnd', e.target.value)}
                className={styles.numberInput}
                style={{ width: 'auto' }}
              />
            </label>
          </div>
          
          <div className={styles.settingItem}>
            <label className={styles.settingLabel}>
              休憩時間
              <input
                type="number"
                min="0"
                max="120"
                value={settingsData.workingHours.breakTime}
                onChange={(e) => handleWorkingHoursChange('breakTime', parseInt(e.target.value))}
                className={styles.numberInput}
              />
              分
            </label>
          </div>
          
          <div className={styles.settingItem}>
            <label className={styles.settingLabel}>
              <input
                type="checkbox"
                checked={settingsData.workingHours.flexEnabled}
                onChange={(e) => handleWorkingHoursChange('flexEnabled', e.target.checked)}
              />
              フレックスタイム制を有効にする
            </label>
          </div>
          
          {settingsData.workingHours.flexEnabled && (
            <>
              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>
                  コアタイム開始
                  <input
                    type="time"
                    value={settingsData.workingHours.coreTimeStart}
                    onChange={(e) => handleWorkingHoursChange('coreTimeStart', e.target.value)}
                    className={styles.numberInput}
                    style={{ width: 'auto' }}
                  />
                </label>
              </div>
              
              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>
                  コアタイム終了
                  <input
                    type="time"
                    value={settingsData.workingHours.coreTimeEnd}
                    onChange={(e) => handleWorkingHoursChange('coreTimeEnd', e.target.value)}
                    className={styles.numberInput}
                    style={{ width: 'auto' }}
                  />
                </label>
              </div>
            </>
          )}
        </div>
      </div>

      <div className={styles.settingsSection}>
        <h3>残業管理設定</h3>
        <div className={styles.settingsGroup}>
          <div className={styles.settingItem}>
            <label className={styles.settingLabel}>
              月間残業時間上限
              <input
                type="number"
                min="0"
                max="100"
                value={settingsData.overtimeSettings.monthlyLimit}
                onChange={(e) => handleOvertimeChange('monthlyLimit', parseInt(e.target.value))}
                className={styles.numberInput}
              />
              時間
            </label>
          </div>
          
          <div className={styles.settingItem}>
            <label className={styles.settingLabel}>
              <input
                type="checkbox"
                checked={settingsData.overtimeSettings.requireApproval}
                onChange={(e) => handleOvertimeChange('requireApproval', e.target.checked)}
              />
              残業には事前承認を必要とする
            </label>
          </div>
          
          <div className={styles.settingItem}>
            <label className={styles.settingLabel}>
              アラート通知閾値
              <input
                type="number"
                min="0"
                max="100"
                value={settingsData.overtimeSettings.alertThreshold}
                onChange={(e) => handleOvertimeChange('alertThreshold', parseInt(e.target.value))}
                className={styles.numberInput}
              />
              時間
            </label>
          </div>
          
          <div className={styles.settingItem}>
            <label className={styles.settingLabel}>
              <input
                type="checkbox"
                checked={settingsData.overtimeSettings.autoCalculate}
                onChange={(e) => handleOvertimeChange('autoCalculate', e.target.checked)}
              />
              残業時間を自動計算する
            </label>
          </div>
        </div>
      </div>

      <div className={styles.settingsSection}>
        <h3>休暇設定</h3>
        <div className={styles.settingsGroup}>
          <div className={styles.settingItem}>
            <label className={styles.settingLabel}>
              年次有給休暇日数
              <input
                type="number"
                min="0"
                max="40"
                value={settingsData.leaveSettings.annualDays}
                onChange={(e) => handleLeaveChange('annualDays', parseInt(e.target.value))}
                className={styles.numberInput}
              />
              日
            </label>
          </div>
          
          <div className={styles.settingItem}>
            <label className={styles.settingLabel}>
              <input
                type="checkbox"
                checked={settingsData.leaveSettings.carryOverEnabled}
                onChange={(e) => handleLeaveChange('carryOverEnabled', e.target.checked)}
              />
              有給休暇の繰越を許可する
            </label>
          </div>
          
          {settingsData.leaveSettings.carryOverEnabled && (
            <div className={styles.settingItem}>
              <label className={styles.settingLabel}>
                最大繰越日数
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={settingsData.leaveSettings.maxCarryOver}
                  onChange={(e) => handleLeaveChange('maxCarryOver', parseInt(e.target.value))}
                  className={styles.numberInput}
                />
                日
              </label>
            </div>
          )}
          
          <div className={styles.settingItem}>
            <label className={styles.settingLabel}>
              <input
                type="checkbox"
                checked={settingsData.leaveSettings.halfDayEnabled}
                onChange={(e) => handleLeaveChange('halfDayEnabled', e.target.checked)}
              />
              半日休暇を許可する
            </label>
          </div>
          
          <div className={styles.settingItem}>
            <label className={styles.settingLabel}>
              <input
                type="checkbox"
                checked={settingsData.leaveSettings.hourlyEnabled}
                onChange={(e) => handleLeaveChange('hourlyEnabled', e.target.checked)}
              />
              時間単位休暇を許可する
            </label>
          </div>
        </div>
      </div>

      <div className={styles.settingsActions}>
        <button className={styles.saveButton}>設定を保存</button>
        <button className={styles.cancelButton}>キャンセル</button>
      </div>
    </div>
  )
}