'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import BreadcrumbBar from '@/components/navigation/BreadcrumbBar'
import styles from './Attendance.module.css'
import { staffDatabase } from '../data/staffData.js'
import Link from 'next/link'
import { attendanceRecords, monthlyStats, AttendanceRecord, MonthlyStats } from '../data/attendanceData'

const tabs = [
  { id: 'daily', label: '日次勤怠', icon: '📅' },
  { id: 'monthly', label: '月次集計', icon: '📊' },
  { id: 'overtime', label: '残業管理', icon: '⏰' },
  { id: 'leave', label: '休暇管理', icon: '🏖️' },
  { id: 'settings', label: '設定', icon: '⚙️' },
]

// AttendanceRecordとMonthlyStatsの型定義は../data/attendanceData.tsからインポート

function AttendanceManagementContent() {
  const searchParams = useSearchParams()
  const staffId = searchParams.get('staffId')
  const [activeTab, setActiveTab] = useState('daily')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFacility, setSelectedFacility] = useState('all')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  
  useEffect(() => {
    if (staffId && staffDatabase[staffId]) {
      const staff = staffDatabase[staffId]
      setSearchTerm(staff.name)
      setSelectedFacility(staff.facility || 'all')
      setSelectedDepartment(staff.department || 'all')
    }
  }, [staffId])

  // 共通のデータソースから勤怠データを取得
  const attendanceData = attendanceRecords
  const monthlyData = monthlyStats

  const filteredAttendanceData = attendanceData.filter((record) => {
    const matchesSearch = record.employeeName.includes(searchTerm) || record.employeeId.includes(searchTerm)
    const matchesFacility = selectedFacility === 'all' || record.facility === selectedFacility
    const matchesDepartment = selectedDepartment === 'all' || record.department === selectedDepartment
    return matchesSearch && matchesFacility && matchesDepartment
  })

  const filteredMonthlyData = monthlyData.filter((record) => {
    const matchesSearch = record.employeeName.includes(searchTerm) || record.employeeId.includes(searchTerm)
    const matchesFacility = selectedFacility === 'all' || record.facility === selectedFacility
    const matchesDepartment = selectedDepartment === 'all' || record.department === selectedDepartment
    return matchesSearch && matchesFacility && matchesDepartment
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
      <BreadcrumbBar />

      <div className={styles.container}>
        {/* 開発ステータスの警告バナー */}
        <div className={styles.developmentBanner}>
          <div className={styles.bannerIcon}>⚠️</div>
          <div className={styles.bannerContent}>
            <h3 className={styles.bannerTitle}>開発中のプレビュー版</h3>
            <p className={styles.bannerDescription}>
              このページは現在開発中です。表示されているデータは全て<strong>サンプルデータ</strong>です。
            </p>
            <div className={styles.statusInfo}>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>現在：</span>
                <span>各施設の総務部門で個別管理中</span>
              </div>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>将来：</span>
                <span>法人人事部による一元管理予定</span>
              </div>
            </div>
          </div>
        </div>
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
        <h2>
          日次勤怠記録 ({records.length}件)
          <span className={styles.sampleBadge}>サンプルデータ</span>
        </h2>
        <button className={styles.addButton} disabled title="開発中">
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
              <Link href={`/staff-cards/${record.employeeId}`} className={styles.viewProfileLink}>
                職員カルテを見る →
              </Link>
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
        <h2>
          月次勤怠集計
          <span className={styles.sampleBadge}>サンプルデータ</span>
        </h2>
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
      <h2>
        残業管理
        <span className={styles.developingBadge}>開発中</span>
      </h2>
      <div className={styles.comingSoon}>
        <div className={styles.developIcon}>🚧</div>
        <p>残業時間の分析と管理機能は現在開発中です</p>
      </div>
    </div>
  )
}

function LeaveTab() {
  return (
    <div className={styles.leaveContainer}>
      <h2>
        休暇管理
        <span className={styles.developingBadge}>開発中</span>
      </h2>
      <div className={styles.comingSoon}>
        <div className={styles.developIcon}>🚧</div>
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
      <h2>
        勤怠設定
        <span className={styles.demoOnlyBadge}>デモ用</span>
      </h2>
      <div className={styles.demoNotice}>
        <p>⚠️ この設定画面はデモンストレーション用です。実際の設定変更は反映されません。</p>
      </div>
      
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
        <button className={styles.saveButton} disabled title="開発中のため保存できません">設定を保存（開発中）</button>
        <button className={styles.cancelButton} disabled>キャンセル</button>
      </div>
    </div>
  )
}

export default function AttendancePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AttendanceManagementContent />
    </Suspense>
  )
}