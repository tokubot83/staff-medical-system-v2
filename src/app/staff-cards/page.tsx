'use client'

import React, { useState } from 'react'
import CommonHeader from '@/components/CommonHeader'
import Link from 'next/link'
import { staffDatabase } from '../data/staffData.js'
import styles from './StaffCards.module.css'
import { useRouter } from 'next/navigation'

interface Staff {
  id: string
  name: string
  age: number
  gender: string
  position: string
  department: string
  facility: string
  experience: number
  certifications: string[]
  qualifications: string[]
  averageScore: number
  mentalHealth: string
  physicalHealth: string
  trainings: Array<{
    name: string
    date: string
    status: string
  }>
  nameInitial?: string
  joinDate?: string
  evaluation?: string
  healthScore?: number
  stressLevel?: number
  engagement?: number
  riskLevel?: string
  avatar?: string
}

export default function StaffCardsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFacility, setSelectedFacility] = useState('all')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const router = useRouter()

  const filteredStaff = Object.values(staffDatabase).filter((staff: any) => {
    const matchesSearch = staff.name.includes(searchTerm) || staff.id.includes(searchTerm)
    const matchesFacility = selectedFacility === 'all' || staff.facility === selectedFacility
    const matchesDepartment = selectedDepartment === 'all' || staff.department === selectedDepartment
    return matchesSearch && matchesFacility && matchesDepartment
  })

  const handleStaffClick = (staffId: string) => {
    router.push(`/staff-cards/${staffId}`)
  }

  return (
    <div>
      <CommonHeader 
        title="職員カルテ" 
        showBackButton={true} 
        backUrl="/"
        backText="ダッシュボードに戻る"
      />
      
      <div className={styles.container}>
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
              <option value="内科">内科</option>
              <option value="リハビリテーション科">リハビリテーション科</option>
              <option value="第１病棟">第１病棟</option>
              <option value="外来">外来</option>
              <option value="介護医療院">介護医療院</option>
              <option value="リハビリテーション部門">リハビリテーション部門</option>
              <option value="放射線部門">放射線部門</option>
              <option value="検査部門">検査部門</option>
              <option value="栄養部門">栄養部門</option>
              <option value="薬剤部門">薬剤部門</option>
              <option value="総務課">総務課</option>
              <option value="医事課">医事課</option>
            </select>
          </div>
        </div>

        <div className={styles.listHeader}>
          <h2>職員一覧 ({filteredStaff.length}名)</h2>
          <Link href="/staff-cards/management" className={styles.managementLink}>
            <span className={styles.managementIcon}>⚙️</span>
            カルテ管理
          </Link>
        </div>

        <div className={styles.staffGrid}>
          {filteredStaff.map((staff: any) => (
            <div 
              key={staff.id} 
              className={styles.staffCard} 
              onClick={() => handleStaffClick(staff.id)}
            >
              <div className={styles.cardHeader}>
                <div className={`${styles.avatar} ${staff.avatar}`}>
                  {staff.nameInitial}
                </div>
                <div className={styles.cardInfo}>
                  <h3>{staff.name}</h3>
                  <p className={styles.staffId}>{staff.id}</p>
                  <p className={styles.staffDetail}>{staff.facility} / {staff.department}</p>
                  <p className={styles.staffPosition}>{staff.position}</p>
                </div>
                <div className={styles.cardStatus}>
                  <span className={`${styles.evaluationBadge} ${styles[`evaluation${staff.evaluation}`]}`}>
                    {staff.evaluation}評価
                  </span>
                  <span className={`${styles.healthScore} ${
                    staff.healthScore >= 80 ? styles.healthGood : 
                    staff.healthScore >= 60 ? styles.healthNormal : 
                    styles.healthWarning
                  }`}>
                    健康: {staff.healthScore}
                  </span>
                </div>
              </div>
              <div className={styles.cardFooter}>
                <div className={styles.cardStat}>
                  <span className={styles.statLabel}>経験年数</span>
                  <span className={styles.statValue}>{staff.experience}年</span>
                </div>
                <div className={styles.cardStat}>
                  <span className={styles.statLabel}>エンゲージメント</span>
                  <span className={styles.statValue}>{staff.engagement}%</span>
                </div>
                <div className={styles.cardStat}>
                  <span className={styles.statLabel}>離職リスク</span>
                  <span className={`${styles.statValue} ${
                    staff.riskLevel === '低' ? styles.riskLow :
                    staff.riskLevel === '中' ? styles.riskMedium :
                    styles.riskHigh
                  }`}>
                    {staff.riskLevel}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}