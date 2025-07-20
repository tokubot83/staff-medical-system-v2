'use client'

import React, { useState } from 'react'
import CommonHeader from '@/components/CommonHeader'
import Link from 'next/link'
import { staffDatabase } from '../data/staffData'
import styles from './StaffCards.module.css'

const tabs = [
  { id: 'list', label: '👥 職員一覧', icon: '👥' },
  { id: 'detail', label: '📋 個別カルテ', icon: '📋' },
  { id: 'evaluation', label: '📊 評価管理', icon: '📊' },
  { id: 'health', label: '🏥 健康状態', icon: '🏥' },
  { id: 'training', label: '🎓 研修記録', icon: '🎓' },
]

export default function StaffCardsPage() {
  const [activeTab, setActiveTab] = useState('list')
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFacility, setSelectedFacility] = useState('all')
  const [selectedDepartment, setSelectedDepartment] = useState('all')

  const handleStaffSelect = (staff) => {
    setSelectedStaff(staff)
    setActiveTab('detail')
  }

  const filteredStaff = Object.values(staffDatabase).filter(staff => {
    const matchesSearch = staff.name.includes(searchTerm) || staff.id.includes(searchTerm)
    const matchesFacility = selectedFacility === 'all' || staff.facility === selectedFacility
    const matchesDepartment = selectedDepartment === 'all' || staff.department === selectedDepartment
    return matchesSearch && matchesFacility && matchesDepartment
  })

  return (
    <div>
      <CommonHeader 
        title="職員カルテ管理" 
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
          {activeTab === 'list' && (
            <StaffListTab 
              filteredStaff={filteredStaff}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedFacility={selectedFacility}
              setSelectedFacility={setSelectedFacility}
              selectedDepartment={selectedDepartment}
              setSelectedDepartment={setSelectedDepartment}
              onStaffSelect={handleStaffSelect}
            />
          )}
          {activeTab === 'detail' && (
            <StaffDetailTab 
              selectedStaff={selectedStaff}
              onBackToList={() => setActiveTab('list')}
            />
          )}
          {activeTab === 'evaluation' && <EvaluationTab />}
          {activeTab === 'health' && <HealthTab />}
          {activeTab === 'training' && <TrainingTab />}
        </div>
      </div>
    </div>
  )
}

function StaffListTab({ filteredStaff, searchTerm, setSearchTerm, selectedFacility, setSelectedFacility, selectedDepartment, setSelectedDepartment, onStaffSelect }) {
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
        <h2>職員一覧 ({filteredStaff.length}名)</h2>
      </div>

      <div className={styles.staffGrid}>
        {filteredStaff.map((staff) => (
          <div key={staff.id} className={styles.staffCard} onClick={() => onStaffSelect(staff)}>
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
  )
}

function StaffDetailTab({ selectedStaff, onBackToList }) {
  if (!selectedStaff) {
    return (
      <div className={styles.noSelection}>
        <p>職員を選択してください</p>
        <button onClick={onBackToList} className={styles.backButton}>
          職員一覧に戻る
        </button>
      </div>
    )
  }

  return (
    <div className={styles.detailContainer}>
      <div className={styles.detailHeader}>
        <button onClick={onBackToList} className={styles.backButton}>
          ← 職員一覧に戻る
        </button>
      </div>

      <div className={styles.profileSection}>
        <div className={styles.profileHeader}>
          <div className={`${styles.profileAvatar} ${selectedStaff.avatar}`}>
            {selectedStaff.nameInitial}
          </div>
          <div className={styles.profileInfo}>
            <h2>{selectedStaff.name}</h2>
            <p className={styles.profileTitle}>{selectedStaff.facility} / {selectedStaff.department} / {selectedStaff.position}</p>
            <div className={styles.profileMeta}>
              <span>ID: {selectedStaff.id}</span>
              <span>入職: {selectedStaff.joinDate}</span>
              <span>年齢: {selectedStaff.age}歳</span>
            </div>
          </div>
          <div className={styles.profileStatus}>
            <div className={`${styles.statusBadge} ${
              selectedStaff.evaluation === 'S' ? styles.statusExcellent :
              selectedStaff.evaluation === 'A' ? styles.statusGood :
              styles.statusNormal
            }`}>
              {selectedStaff.evaluation === 'S' ? '優秀職員' :
               selectedStaff.evaluation === 'A' ? '高評価' :
               '標準'}
            </div>
          </div>
        </div>

        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <h3>総合評価</h3>
            <div className={styles.metricValue}>{selectedStaff.evaluation}</div>
            <p className={styles.metricLabel}>最新評価</p>
          </div>
          <div className={styles.metricCard}>
            <h3>健康スコア</h3>
            <div className={styles.metricValue}>{selectedStaff.healthScore}</div>
            <p className={styles.metricLabel}>ストレス指数: {selectedStaff.stressLevel || 48}</p>
          </div>
          <div className={styles.metricCard}>
            <h3>エンゲージメント</h3>
            <div className={styles.metricValue}>{selectedStaff.engagement}%</div>
            <p className={styles.metricLabel}>組織への貢献度</p>
          </div>
          <div className={styles.metricCard}>
            <h3>離職リスク</h3>
            <div className={`${styles.metricValue} ${
              selectedStaff.riskLevel === '低' ? styles.textGreen :
              selectedStaff.riskLevel === '中' ? styles.textYellow :
              styles.textRed
            }`}>
              {selectedStaff.riskLevel}
            </div>
            <p className={styles.metricLabel}>要注意度</p>
          </div>
        </div>

        <div className={styles.detailSections}>
          <div className={styles.sectionCard}>
            <h3>スキル・資格</h3>
            <div className={styles.skillGrid}>
              {selectedStaff.skills?.map((skill, index) => (
                <div key={index} className={styles.skillItem}>
                  <span className={styles.skillName}>{skill.name}</span>
                  <div className={styles.skillBar}>
                    <div 
                      className={styles.skillProgress} 
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                  <span className={styles.skillLevel}>{skill.level}%</span>
                </div>
              )) || (
                <div className={styles.skillItem}>
                  <span className={styles.skillName}>看護技術</span>
                  <div className={styles.skillBar}>
                    <div className={styles.skillProgress} style={{ width: '85%' }}></div>
                  </div>
                  <span className={styles.skillLevel}>85%</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.sectionCard}>
            <h3>最近の評価コメント</h3>
            <div className={styles.commentList}>
              <div className={styles.commentItem}>
                <p className={styles.commentDate}>2024年上期評価</p>
                <p className={styles.commentText}>
                  患者様への対応が丁寧で、チーム内でのコミュニケーションも良好。
                  新人指導にも積極的に取り組んでいる。
                </p>
              </div>
            </div>
          </div>

          <div className={styles.sectionCard}>
            <h3>アクションプラン</h3>
            <div className={styles.actionList}>
              <div className={styles.actionItem}>
                <span className={styles.actionPriority}>優先度: 高</span>
                <p className={styles.actionTitle}>リーダーシップ研修の受講</p>
                <p className={styles.actionDetail}>
                  次期主任候補として、マネジメントスキルの向上が必要
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function EvaluationTab() {
  return (
    <div className={styles.evaluationContainer}>
      <h2>評価管理</h2>
      <div className={styles.comingSoon}>
        <p>評価管理機能は現在開発中です</p>
      </div>
    </div>
  )
}

function HealthTab() {
  return (
    <div className={styles.healthContainer}>
      <h2>健康状態管理</h2>
      <div className={styles.comingSoon}>
        <p>健康状態管理機能は現在開発中です</p>
      </div>
    </div>
  )
}

function TrainingTab() {
  return (
    <div className={styles.trainingContainer}>
      <h2>研修記録</h2>
      <div className={styles.comingSoon}>
        <p>研修記録機能は現在開発中です</p>
      </div>
    </div>
  )
}