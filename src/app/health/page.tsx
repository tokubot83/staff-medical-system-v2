'use client'

import React, { useState } from 'react'
import CommonHeader from '@/components/CommonHeader'
import Link from 'next/link'
import { staffDatabase } from '../data/staffData.js'
import styles from './Health.module.css'

const tabs = [
  { id: 'overview', label: '健康状態', icon: '💊' },
  { id: 'checkup', label: '健康診断', icon: '🏥' },
  { id: 'stress', label: 'ストレスチェック', icon: '🧠' },
  { id: 'mental', label: 'メンタルヘルス', icon: '💬' },
  { id: 'analytics', label: '分析・予測', icon: '📊' },
]

interface HealthRecord {
  id: string
  staffId: string
  staffName: string
  date: string
  type: 'checkup' | 'stress' | 'mental'
  healthScore?: number
  stressIndex?: number
  bloodPressure?: string
  bloodSugar?: number
  cholesterol?: number
  bmi?: number
  mentalHealthStatus?: string
  consultationNotes?: string
}

interface StaffHealth {
  staffId: string
  staffName: string
  healthScore: number
  stressIndex: number
  lastCheckupDate: string
  nextCheckupDate: string
  riskFactors: string[]
  recommendations: string[]
}

export default function HealthPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedStaff, setSelectedStaff] = useState<StaffHealth | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFacility, setSelectedFacility] = useState('all')
  const [selectedDepartment, setSelectedDepartment] = useState('all')

  const mockStaffHealth: StaffHealth[] = [
    {
      staffId: 'S001',
      staffName: '山田太郎',
      healthScore: 85,
      stressIndex: 35,
      lastCheckupDate: '2024-01-15',
      nextCheckupDate: '2025-01-15',
      riskFactors: ['軽度の高血圧'],
      recommendations: ['塩分控えめの食事', '定期的な運動']
    },
    {
      staffId: 'S002',
      staffName: '佐藤花子',
      healthScore: 92,
      stressIndex: 28,
      lastCheckupDate: '2024-02-20',
      nextCheckupDate: '2025-02-20',
      riskFactors: [],
      recommendations: ['現状維持']
    },
    {
      staffId: 'S003',
      staffName: '鈴木一郎',
      healthScore: 78,
      stressIndex: 65,
      lastCheckupDate: '2024-03-10',
      nextCheckupDate: '2025-03-10',
      riskFactors: ['ストレス過多', '睡眠不足'],
      recommendations: ['ストレス管理', '休養の確保', 'カウンセリング検討']
    },
  ]

  const mockHealthRecords: HealthRecord[] = [
    {
      id: '1',
      staffId: 'S001',
      staffName: '山田太郎',
      date: '2024-01-15',
      type: 'checkup',
      healthScore: 85,
      bloodPressure: '130/85',
      bloodSugar: 95,
      cholesterol: 210,
      bmi: 24.5
    },
    {
      id: '2',
      staffId: 'S002',
      staffName: '佐藤花子',
      date: '2024-06-10',
      type: 'stress',
      stressIndex: 28,
      mentalHealthStatus: '良好',
      consultationNotes: 'ワークライフバランスが良好に保たれている'
    },
    {
      id: '3',
      staffId: 'S003',
      staffName: '鈴木一郎',
      date: '2024-07-01',
      type: 'mental',
      stressIndex: 65,
      mentalHealthStatus: '要観察',
      consultationNotes: '業務負荷が高く、休息が必要。上司との面談を推奨'
    },
  ]

  const handleStaffSelect = (staff: StaffHealth) => {
    setSelectedStaff(staff)
    setActiveTab('checkup')
  }

  const filteredStaffHealth = mockStaffHealth.filter((staff) => {
    const matchesSearch = staff.staffName.includes(searchTerm) || staff.staffId.includes(searchTerm)
    return matchesSearch
  })

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return '#10b981'
    if (score >= 70) return '#f59e0b'
    return '#ef4444'
  }

  const getStressIndexColor = (index: number) => {
    if (index <= 30) return '#10b981'
    if (index <= 60) return '#f59e0b'
    return '#ef4444'
  }

  return (
    <div>
      <CommonHeader 
        title="健康管理" 
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
          {activeTab === 'overview' && (
            <OverviewTab 
              staffHealth={filteredStaffHealth}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedFacility={selectedFacility}
              setSelectedFacility={setSelectedFacility}
              selectedDepartment={selectedDepartment}
              setSelectedDepartment={setSelectedDepartment}
              onStaffSelect={handleStaffSelect}
              getHealthScoreColor={getHealthScoreColor}
              getStressIndexColor={getStressIndexColor}
            />
          )}
          {activeTab === 'checkup' && (
            <CheckupTab 
              records={mockHealthRecords.filter(r => r.type === 'checkup')}
              selectedStaff={selectedStaff}
            />
          )}
          {activeTab === 'stress' && <StressTab records={mockHealthRecords.filter(r => r.type === 'stress')} />}
          {activeTab === 'mental' && <MentalTab records={mockHealthRecords.filter(r => r.type === 'mental')} />}
          {activeTab === 'analytics' && <AnalyticsTab />}
        </div>
      </div>
    </div>
  )
}

interface OverviewTabProps {
  staffHealth: StaffHealth[]
  searchTerm: string
  setSearchTerm: (value: string) => void
  selectedFacility: string
  setSelectedFacility: (value: string) => void
  selectedDepartment: string
  setSelectedDepartment: (value: string) => void
  onStaffSelect: (staff: StaffHealth) => void
  getHealthScoreColor: (score: number) => string
  getStressIndexColor: (index: number) => string
}

function OverviewTab({ 
  staffHealth, 
  searchTerm, 
  setSearchTerm, 
  selectedFacility, 
  setSelectedFacility, 
  selectedDepartment, 
  setSelectedDepartment, 
  onStaffSelect,
  getHealthScoreColor,
  getStressIndexColor
}: OverviewTabProps) {
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
        <h2>職員健康状態一覧 ({staffHealth.length}名)</h2>
      </div>

      <div className={styles.healthGrid}>
        {staffHealth.map((staff) => (
          <div key={staff.staffId} className={styles.healthCard} onClick={() => onStaffSelect(staff)}>
            <div className={styles.cardHeader}>
              <div className={styles.cardInfo}>
                <h3>{staff.staffName}</h3>
                <p className={styles.staffId}>{staff.staffId}</p>
              </div>
              <div className={styles.cardScores}>
                <div className={styles.scoreItem}>
                  <span className={styles.scoreLabel}>健康スコア</span>
                  <span 
                    className={styles.scoreValue} 
                    style={{ color: getHealthScoreColor(staff.healthScore) }}
                  >
                    {staff.healthScore}
                  </span>
                </div>
                <div className={styles.scoreItem}>
                  <span className={styles.scoreLabel}>ストレス指数</span>
                  <span 
                    className={styles.scoreValue} 
                    style={{ color: getStressIndexColor(staff.stressIndex) }}
                  >
                    {staff.stressIndex}
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.cardDetails}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>最終健診:</span>
                <span className={styles.detailValue}>{new Date(staff.lastCheckupDate).toLocaleDateString('ja-JP')}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>次回健診:</span>
                <span className={styles.detailValue}>{new Date(staff.nextCheckupDate).toLocaleDateString('ja-JP')}</span>
              </div>
              {staff.riskFactors.length > 0 && (
                <div className={styles.riskFactors}>
                  {staff.riskFactors.map((risk, index) => (
                    <span key={index} className={styles.riskTag}>{risk}</span>
                  ))}
                </div>
              )}
              {staff.recommendations.length > 0 && (
                <div className={styles.recommendations}>
                  <p className={styles.recommendationTitle}>推奨事項:</p>
                  {staff.recommendations.map((rec, index) => (
                    <span key={index} className={styles.recommendationItem}>• {rec}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface CheckupTabProps {
  records: HealthRecord[]
  selectedStaff: StaffHealth | null
}

function CheckupTab({ records, selectedStaff }: CheckupTabProps) {
  return (
    <div className={styles.checkupContainer}>
      <div className={styles.listHeader}>
        <h2>健康診断記録</h2>
        <button className={styles.addButton}>
          + 新規記録を追加
        </button>
      </div>

      <div className={styles.recordsList}>
        {records.map((record) => (
          <div key={record.id} className={styles.recordItem}>
            <div className={styles.recordHeader}>
              <div className={styles.recordInfo}>
                <h3>{record.staffName}</h3>
                <p className={styles.recordDate}>{new Date(record.date).toLocaleDateString('ja-JP')}</p>
              </div>
              <div className={styles.healthScore}>
                <span>健康スコア</span>
                <span className={styles.scoreNumber}>{record.healthScore}</span>
              </div>
            </div>
            <div className={styles.recordDetails}>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>血圧:</span>
                  <span className={styles.detailValue}>{record.bloodPressure} mmHg</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>血糖値:</span>
                  <span className={styles.detailValue}>{record.bloodSugar} mg/dL</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>コレステロール:</span>
                  <span className={styles.detailValue}>{record.cholesterol} mg/dL</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>BMI:</span>
                  <span className={styles.detailValue}>{record.bmi}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface StressTabProps {
  records: HealthRecord[]
}

function StressTab({ records }: StressTabProps) {
  return (
    <div className={styles.stressContainer}>
      <div className={styles.listHeader}>
        <h2>ストレスチェック結果</h2>
        <button className={styles.addButton}>
          + 新規チェックを実施
        </button>
      </div>

      <div className={styles.recordsList}>
        {records.map((record) => (
          <div key={record.id} className={styles.stressItem}>
            <div className={styles.stressHeader}>
              <div className={styles.stressInfo}>
                <h3>{record.staffName}</h3>
                <p className={styles.recordDate}>{new Date(record.date).toLocaleDateString('ja-JP')}</p>
              </div>
              <div className={styles.stressScore}>
                <span>ストレス指数</span>
                <span className={styles.stressNumber} style={{ color: record.stressIndex! > 60 ? '#ef4444' : '#10b981' }}>
                  {record.stressIndex}
                </span>
              </div>
            </div>
            <div className={styles.stressDetails}>
              <p className={styles.mentalStatus}>
                <span>メンタル状態:</span>
                <span className={styles.statusValue}>{record.mentalHealthStatus}</span>
              </p>
              {record.consultationNotes && (
                <p className={styles.consultationNotes}>{record.consultationNotes}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface MentalTabProps {
  records: HealthRecord[]
}

function MentalTab({ records }: MentalTabProps) {
  return (
    <div className={styles.mentalContainer}>
      <div className={styles.listHeader}>
        <h2>メンタルヘルス相談履歴</h2>
        <button className={styles.addButton}>
          + 新規相談記録を追加
        </button>
      </div>

      <div className={styles.recordsList}>
        {records.map((record) => (
          <div key={record.id} className={styles.mentalItem}>
            <div className={styles.mentalHeader}>
              <div className={styles.mentalInfo}>
                <h3>{record.staffName}</h3>
                <p className={styles.recordDate}>{new Date(record.date).toLocaleDateString('ja-JP')}</p>
              </div>
              <div className={styles.mentalStatus}>
                <span className={`${styles.statusBadge} ${record.mentalHealthStatus === '要観察' ? styles.warning : ''}`}>
                  {record.mentalHealthStatus}
                </span>
              </div>
            </div>
            <div className={styles.mentalDetails}>
              <p className={styles.consultationNotes}>{record.consultationNotes}</p>
              {record.stressIndex && (
                <p className={styles.stressInfo}>
                  <span>ストレス指数:</span>
                  <span className={styles.stressValue}>{record.stressIndex}</span>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AnalyticsTab(): React.ReactElement {
  return (
    <div className={styles.analyticsContainer}>
      <h2>健康データ分析・予測</h2>
      <div className={styles.comingSoon}>
        <p>健康データ分析・予測機能は現在開発中です</p>
      </div>
    </div>
  )
}