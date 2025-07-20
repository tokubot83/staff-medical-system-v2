'use client'

import React, { useState, useEffect } from 'react'
import CommonHeader from '@/components/CommonHeader'
import styles from './HrStrategy.module.css'

// タブの定義
const tabs = [
  { id: 'dashboard', label: '戦略ダッシュボード', icon: '📊' },
  { id: 'transfer', label: '異動プランニング', icon: '🔄' },
  { id: 'talent', label: 'タレント管理', icon: '🎯' },
  { id: 'optimization', label: '組織最適化', icon: '📈' },
]

export default function HrStrategyPage() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div>
      <CommonHeader 
        title="人材戦略プランニング" 
        showBackButton={true} 
        backUrl="/"
        backText="ダッシュボードに戻る"
      />
      
      <div className={styles.container}>
        {/* タブナビゲーション */}
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

        {/* タブコンテンツ */}
        <div className={styles.tabContent}>
          {activeTab === 'dashboard' && <StrategyDashboard />}
          {activeTab === 'transfer' && <TransferPlanning />}
          {activeTab === 'talent' && <TalentManagement />}
          {activeTab === 'optimization' && <OrganizationOptimization />}
        </div>
      </div>
    </div>
  )
}

// デモデータ
const demoStaffData = [
  { id: 1, name: '山田 太郎', department: '看護部', position: '主任', performance: 'A', yearsOfService: 5, skills: ['リーダーシップ', 'チーム管理'], transferWish: true },
  { id: 2, name: '佐藤 花子', department: '看護部', position: '主任', performance: 'S', yearsOfService: 8, skills: ['リーダーシップ', 'イノベーション'], transferWish: false },
  { id: 3, name: '田中 美咲', department: '看護部', position: '副部長', performance: 'A', yearsOfService: 12, skills: ['戦略企画', 'チーム管理'], transferWish: false },
  { id: 4, name: '鈴木 健一', department: 'リハビリテーション科', position: '主任', performance: 'A', yearsOfService: 7, skills: ['専門技術', 'コミュニケーション'], transferWish: false },
  { id: 5, name: '高橋 由美', department: '薬剤部', position: '一般職', performance: 'B', yearsOfService: 3, skills: ['薬剤管理', '在庫管理'], transferWish: true },
  { id: 6, name: '伊藤 直樹', department: '医事課', position: '主任', performance: 'A', yearsOfService: 6, skills: ['データ分析', 'プロセス改善'], transferWish: true },
  { id: 7, name: '渡辺 陽子', department: '看護部', position: '一般職', performance: 'B', yearsOfService: 2, skills: ['患者ケア', 'チームワーク'], transferWish: false },
  { id: 8, name: '中村 浩二', department: 'リハビリテーション科', position: '部長', performance: 'S', yearsOfService: 15, skills: ['戦略企画', 'リーダーシップ'], transferWish: false },
  { id: 9, name: '小林 美香', department: '栄養課', position: '主任', performance: 'A', yearsOfService: 9, skills: ['栄養管理', 'チーム管理'], transferWish: true },
  { id: 10, name: '加藤 健太', department: '総務課', position: '一般職', performance: 'C', yearsOfService: 1, skills: ['事務処理', 'データ入力'], transferWish: false },
]

const demoDepartments = [
  { name: '看護部', staffCount: 450, transferIn: 8, transferOut: 12, vacancyRate: 7.5 },
  { name: 'リハビリテーション科', staffCount: 85, transferIn: 3, transferOut: 2, vacancyRate: 15.3 },
  { name: '薬剤部', staffCount: 45, transferIn: 2, transferOut: 3, vacancyRate: 4.4 },
  { name: '医事課', staffCount: 65, transferIn: 5, transferOut: 4, vacancyRate: 6.2 },
  { name: '栄養課', staffCount: 35, transferIn: 1, transferOut: 2, vacancyRate: 8.6 },
  { name: '総務課', staffCount: 55, transferIn: 4, transferOut: 3, vacancyRate: 3.6 },
]

// 戦略ダッシュボードタブ
function StrategyDashboard() {
  const [departmentData, setDepartmentData] = useState<Array<{name: string, count: number, color: string}>>([])
  const [skillData, setSkillData] = useState<Array<{skill: string, count: number, percentage: string}>>([])

  useEffect(() => {
    // 部署別人材分布データの集計
    const deptCounts = demoDepartments.map(dept => ({
      name: dept.name,
      count: dept.staffCount,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`
    }))
    setDepartmentData(deptCounts)

    // スキル分布の集計
    const skillCounts: {[key: string]: number} = {}
    demoStaffData.forEach(staff => {
      staff.skills.forEach(skill => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1
      })
    })
    const skillArray = Object.entries(skillCounts).map(([skill, count]) => ({
      skill,
      count,
      percentage: (count / demoStaffData.length * 100).toFixed(1)
    }))
    setSkillData(skillArray)
  }, [])
  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.summarySection}>
        <h2>組織全体の人材状況</h2>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <div className={styles.cardIcon}>👥</div>
            <div className={styles.cardContent}>
              <h3>総職員数</h3>
              <p className={styles.cardValue}>{demoDepartments.reduce((sum, dept) => sum + dept.staffCount, 0)}名</p>
              <p className={styles.cardChange}>+5.2% (前年比)</p>
            </div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.cardIcon}>⭐</div>
            <div className={styles.cardContent}>
              <h3>ハイパフォーマー</h3>
              <p className={styles.cardValue}>{demoStaffData.filter(s => s.performance === 'S' || s.performance === 'A').length}名</p>
              <p className={styles.cardSubtext}>全体の{((demoStaffData.filter(s => s.performance === 'S' || s.performance === 'A').length / demoStaffData.length) * 100).toFixed(1)}%</p>
            </div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.cardIcon}>🔄</div>
            <div className={styles.cardContent}>
              <h3>異動希望者</h3>
              <p className={styles.cardValue}>{demoStaffData.filter(s => s.transferWish).length}名</p>
              <p className={styles.cardAlert}>要対応: {Math.floor(demoStaffData.filter(s => s.transferWish).length * 0.3)}名</p>
            </div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.cardIcon}>📊</div>
            <div className={styles.cardContent}>
              <h3>人材充足率</h3>
              <p className={styles.cardValue}>{(100 - demoDepartments.reduce((sum, dept) => sum + dept.vacancyRate, 0) / demoDepartments.length).toFixed(1)}%</p>
              <p className={styles.cardWarning}>不足部署: {demoDepartments.filter(d => d.vacancyRate > 10).length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.analysisSection}>
        <h2>重要指標と傾向</h2>
        <div className={styles.chartsGrid}>
          <div className={styles.chartCard}>
            <h3>部署別人材分布</h3>
            <div className={styles.chartPlaceholder}>
              <div style={{ padding: '20px' }}>
                {departmentData.map((dept, index) => (
                  <div key={index} style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ minWidth: '120px' }}>{dept.name}</span>
                      <div style={{ flex: 1, height: '20px', backgroundColor: '#f0f0f0', borderRadius: '10px', overflow: 'hidden' }}>
                        <div 
                          style={{ 
                            width: `${(dept.count / Math.max(...departmentData.map(d => d.count))) * 100}%`,
                            height: '100%',
                            backgroundColor: dept.color,
                            transition: 'width 0.5s ease'
                          }}
                        />
                      </div>
                      <span style={{ minWidth: '50px', textAlign: 'right' }}>{dept.count}名</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.chartCard}>
            <h3>スキルマトリクス</h3>
            <div className={styles.chartPlaceholder}>
              <div style={{ padding: '20px' }}>
                {skillData.map((item, index) => (
                  <div key={index} style={{ marginBottom: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span>{item.skill}</span>
                      <span>{item.count}名 ({item.percentage}%)</span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: '#f0f0f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          width: `${item.percentage}%`,
                          height: '100%',
                          backgroundColor: '#4CAF50',
                          transition: 'width 0.5s ease'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 異動プランニングタブ
function TransferPlanning() {
  const [selectedStaff, setSelectedStaff] = useState<typeof demoStaffData[0] | null>(null)
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  const filteredStaff = demoStaffData.filter(staff => {
    const matchesSearch = staff.name.includes(searchTerm) || staff.id.toString().includes(searchTerm)
    const matchesFilter = 
      filterType === 'all' || 
      (filterType === 'transfer' && staff.transferWish) ||
      (filterType === 'highPerformance' && (staff.performance === 'S' || staff.performance === 'A')) ||
      (filterType === 'senior' && staff.yearsOfService >= 3)
    return matchesSearch && matchesFilter
  })

  return (
    <div className={styles.transferContainer}>
      <div className={styles.transferHeader}>
        <h2>異動プランニング</h2>
        <button className={styles.simulationButton}>
          シミュレーション開始
        </button>
      </div>

      <div className={styles.transferContent}>
        <div className={styles.leftPanel}>
          <h3>対象者選択</h3>
          <div className={styles.searchBox}>
            <input 
              type="text" 
              placeholder="職員名または職員IDで検索"
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className={styles.filterSection}>
            <label>フィルタ条件</label>
            <select 
              className={styles.filterSelect}
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">すべての職員</option>
              <option value="transfer">異動希望者のみ</option>
              <option value="highPerformance">評価A以上</option>
              <option value="senior">勤続3年以上</option>
            </select>
          </div>
          <div className={styles.staffList}>
            {filteredStaff.map((staff) => (
              <div 
                key={staff.id} 
                className={`${styles.staffItem} ${selectedStaff?.id === staff.id ? styles.selected : ''}`}
                onClick={() => setSelectedStaff(staff)}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.staffInfo}>
                  <p className={styles.staffName}>{staff.name}</p>
                  <p className={styles.staffDetail}>{staff.department} / {staff.position}</p>
                </div>
                <div className={styles.staffStatus}>
                  {staff.transferWish && <span className={styles.badge}>異動希望</span>}
                  <span className={`${styles.badge} ${styles.performance}`}>評価{staff.performance}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.centerPanel}>
          <h3>マッチング結果</h3>
          <div className={styles.matchingResults}>
            {selectedStaff ? (
              demoDepartments
                .filter(dept => dept.name !== selectedStaff.department)
                .map((dept) => {
                  const matchScore = Math.floor(60 + Math.random() * 40)
                  return (
                    <div key={dept.name} className={styles.matchCard}>
                      <div className={styles.matchScore}>{matchScore}%</div>
                      <div className={styles.matchInfo}>
                        <h4>{dept.name}</h4>
                        <p>スキルマッチ度: {matchScore > 80 ? '高' : matchScore > 60 ? '中' : '低'}</p>
                        <p>部署ニーズ: {dept.vacancyRate > 10 ? '緊急' : dept.vacancyRate > 5 ? '通常' : '低'}</p>
                        <ul className={styles.matchReasons}>
                          {selectedStaff.skills.map((skill, idx) => (
                            <li key={idx}>{skill}が活用可能</li>
                          ))}
                          {dept.vacancyRate > 10 && <li>人材不足の解消に貢献</li>}
                        </ul>
                      </div>
                    </div>
                  )
                })
                .sort((a, b) => {
                  const scoreA = Math.floor(60 + Math.random() * 40)
                  const scoreB = Math.floor(60 + Math.random() * 40)
                  return scoreB - scoreA
                })
                .slice(0, 3)
            ) : (
              <p style={{ textAlign: 'center', color: '#666' }}>職員を選択してください</p>
            )}
          </div>
        </div>

        <div className={styles.rightPanel}>
          <h3>部署別異動希望者</h3>
          <div className={styles.departmentList}>
            {demoDepartments.map((dept) => (
              <div key={dept.name} className={styles.departmentItem}>
                <h4>{dept.name}</h4>
                <div className={styles.wishList}>
                  <p>異動希望者: {dept.transferOut}名</p>
                  <p>受入希望: {dept.transferIn}名</p>
                  <p style={{ 
                    color: dept.vacancyRate > 10 ? '#e74c3c' : dept.vacancyRate > 5 ? '#f39c12' : '#27ae60',
                    fontWeight: 'bold'
                  }}>
                    欠員率: {dept.vacancyRate.toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// タレント管理タブ
function TalentManagement() {
  const highPerformers = demoStaffData.filter(s => s.performance === 'S' || s.performance === 'A')
  const successionPlans = [
    {
      position: '看護部長',
      candidates: [
        { name: '田中 美咲', readiness: 85, currentPosition: '副部長', developmentNeeds: ['経営戦略'] },
        { name: '鈴木 健一', readiness: 70, currentPosition: '主任', developmentNeeds: ['リーダーシップ', '財務管理'] },
      ]
    },
    {
      position: 'リハビリテーション科部長',
      candidates: [
        { name: '鈴木 健一', readiness: 90, currentPosition: '主任', developmentNeeds: ['戦略企画'] },
      ]
    },
    {
      position: '薬剤部長',
      candidates: [
        { name: '高橋 由美', readiness: 60, currentPosition: '一般職', developmentNeeds: ['管理経験', 'リーダーシップ'] },
      ]
    },
  ]
  const developmentPrograms = [
    { name: 'リーダーシップ研修プログラム', participants: 24, completed: 18, progressRate: 75 },
    { name: 'マネジメント基礎研修', participants: 35, completed: 28, progressRate: 80 },
    { name: '専門スキル向上プログラム', participants: 42, completed: 35, progressRate: 83 },
  ]
  return (
    <div className={styles.talentContainer}>
      <div className={styles.talentHeader}>
        <h2>タレントマネジメント</h2>
        <div className={styles.headerActions}>
          <button className={styles.actionButton}>タレントプール編集</button>
          <button className={styles.actionButton}>育成計画作成</button>
        </div>
      </div>

      <div className={styles.talentGrid}>
        <div className={styles.talentSection}>
          <h3>🌟 ハイパフォーマー管理</h3>
          <div className={styles.performerList}>
            {highPerformers.map((performer) => (
              <div key={performer.id} className={styles.performerCard}>
                <div className={styles.performerHeader}>
                  <span className={styles.performerRank}>{performer.performance}</span>
                  <h4>{performer.name}</h4>
                </div>
                <div className={styles.performerDetails}>
                  <p>{performer.department} / {performer.position}</p>
                  <p>勤続: {performer.yearsOfService}年</p>
                  <div className={styles.talentTags}>
                    {performer.skills.map((skill, idx) => (
                      <span key={idx} className={styles.tag}>{skill}</span>
                    ))}
                  </div>
                </div>
                <div className={styles.performerActions}>
                  <button className={styles.smallButton}>詳細</button>
                  <button className={styles.smallButton}>育成計画</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.talentSection}>
          <h3>📋 サクセッションプラン</h3>
          <div className={styles.successionList}>
            {successionPlans.map((plan, index) => (
              <div key={index} className={styles.positionCard}>
                <h4>{plan.position}</h4>
                <div className={styles.candidateList}>
                  {plan.candidates.map((candidate, idx) => (
                    <div key={idx} className={styles.candidate}>
                      <span className={`${styles.readiness} ${candidate.readiness >= 80 ? styles.ready : styles.developing}`}>
                        準備度: {candidate.readiness}%
                      </span>
                      <p>{candidate.name}</p>
                      <p style={{ fontSize: '0.9em', color: '#666' }}>現職: {candidate.currentPosition}</p>
                      <div style={{ marginTop: '5px' }}>
                        {candidate.developmentNeeds.map((need, needIdx) => (
                          <span key={needIdx} style={{ 
                            fontSize: '0.8em', 
                            backgroundColor: '#f0f0f0', 
                            padding: '2px 8px', 
                            marginRight: '5px',
                            borderRadius: '3px' 
                          }}>
                            {need}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.talentSection}>
          <h3>📈 キャリアパス分析</h3>
          <div className={styles.careerPathViewer}>
            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h4>一般職 → 主任 → 副部長 → 部長</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                  <div style={{ flex: 1, textAlign: 'center', padding: '10px', backgroundColor: '#e3f2fd', borderRadius: '5px' }}>
                    <p>一般職</p>
                    <p style={{ fontSize: '0.8em' }}>1-3年</p>
                  </div>
                  <span>→</span>
                  <div style={{ flex: 1, textAlign: 'center', padding: '10px', backgroundColor: '#c5e1a5', borderRadius: '5px' }}>
                    <p>主任</p>
                    <p style={{ fontSize: '0.8em' }}>3-7年</p>
                  </div>
                  <span>→</span>
                  <div style={{ flex: 1, textAlign: 'center', padding: '10px', backgroundColor: '#ffcc80', borderRadius: '5px' }}>
                    <p>副部長</p>
                    <p style={{ fontSize: '0.8em' }}>7-12年</p>
                  </div>
                  <span>→</span>
                  <div style={{ flex: 1, textAlign: 'center', padding: '10px', backgroundColor: '#ef9a9a', borderRadius: '5px' }}>
                    <p>部長</p>
                    <p style={{ fontSize: '0.8em' }}>12年以上</p>
                  </div>
                </div>
              </div>
              <div>
                <h4>現在の分布</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <p>一般職</p>
                    <p style={{ fontSize: '1.5em', fontWeight: 'bold' }}>
                      {demoStaffData.filter(s => s.position === '一般職').length}名
                    </p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p>主任</p>
                    <p style={{ fontSize: '1.5em', fontWeight: 'bold' }}>
                      {demoStaffData.filter(s => s.position === '主任').length}名
                    </p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p>副部長</p>
                    <p style={{ fontSize: '1.5em', fontWeight: 'bold' }}>
                      {demoStaffData.filter(s => s.position === '副部長').length}名
                    </p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p>部長</p>
                    <p style={{ fontSize: '1.5em', fontWeight: 'bold' }}>
                      {demoStaffData.filter(s => s.position === '部長').length}名
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.talentSection}>
          <h3>🎯 育成進捗トラッキング</h3>
          <div className={styles.developmentTracker}>
            {developmentPrograms.map((program, index) => (
              <div key={index} className={styles.developmentItem}>
                <h4>{program.name}</h4>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{width: `${program.progressRate}%`}}></div>
                </div>
                <p>参加者: {program.participants}名 / 完了: {program.completed}名</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// 組織最適化タブ
function OrganizationOptimization() {
  const [analysisResult, setAnalysisResult] = useState<{
    timestamp: string
    recommendations: Array<{
      priority: string
      title: string
      description: string
      expectedEffect: string
      risk: string
      affectedStaff: number
    }>
  } | null>(null)
  
  const runOptimizationAnalysis = () => {
    // シミュレーション結果を生成
    setAnalysisResult({
      timestamp: new Date().toLocaleString('ja-JP'),
      recommendations: [
        {
          priority: '高',
          title: '看護部の人員配置最適化',
          description: '夜勤体制の負荷分散のため、B病棟から3名をA病棟へ異動することを推奨',
          expectedEffect: '残業時間20%削減',
          risk: '低',
          affectedStaff: 15
        },
        {
          priority: '中',
          title: 'リハビリテーション科の増員',
          description: '需要増加に対応するため、新たに5名の専門職を採用',
          expectedEffect: '待機時間30%短縮',
          risk: '中',
          affectedStaff: 5
        },
        {
          priority: '低',
          title: '総務課の業務効率化',
          description: 'RPA導入による定型業務の自動化',
          expectedEffect: '業務時間15%削減',
          risk: '低',
          affectedStaff: 8
        }
      ]
    })
  }

  // 年齢構成データ
  const ageDistribution = [
    { range: '20代', count: 180, percentage: 25 },
    { range: '30代', count: 220, percentage: 30 },
    { range: '40代', count: 150, percentage: 21 },
    { range: '50代', count: 130, percentage: 18 },
    { range: '60代', count: 55, percentage: 6 },
  ]

  // スキルバランスデータ
  const skillBalance = [
    { category: '医療専門技術', current: 85, ideal: 80 },
    { category: 'マネジメント', current: 45, ideal: 60 },
    { category: 'ITスキル', current: 35, ideal: 50 },
    { category: 'コミュニケーション', current: 75, ideal: 75 },
    { category: 'データ分析', current: 25, ideal: 40 },
  ]
  return (
    <div className={styles.optimizationContainer}>
      <div className={styles.optimizationHeader}>
        <h2>組織最適化分析</h2>
        <button className={styles.analysisButton} onClick={runOptimizationAnalysis}>
          最適化分析を実行
        </button>
      </div>

      <div className={styles.optimizationContent}>
        <div className={styles.analysisSection}>
          <h3>現状の組織構成分析</h3>
          <div className={styles.compositionGrid}>
            <div className={styles.compositionCard}>
              <h4>年齢構成</h4>
              <div className={styles.analysisChart}>
                <div style={{ padding: '20px' }}>
                  {ageDistribution.map((age, index) => (
                    <div key={index} style={{ marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ minWidth: '50px' }}>{age.range}</span>
                        <div style={{ flex: 1, height: '20px', backgroundColor: '#f0f0f0', borderRadius: '10px', overflow: 'hidden' }}>
                          <div 
                            style={{ 
                              width: `${age.percentage}%`,
                              height: '100%',
                              backgroundColor: age.range === '40代' ? '#f39c12' : '#3498db',
                              transition: 'width 0.5s ease'
                            }}
                          />
                        </div>
                        <span style={{ minWidth: '80px', textAlign: 'right' }}>{age.count}名 ({age.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.analysisInsight}>
                <p className={styles.warning}>⚠️ 40代の層が薄い</p>
              </div>
            </div>
            <div className={styles.compositionCard}>
              <h4>スキルバランス</h4>
              <div className={styles.analysisChart}>
                <div style={{ padding: '20px' }}>
                  {skillBalance.map((skill, index) => (
                    <div key={index} style={{ marginBottom: '15px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span>{skill.category}</span>
                        <span>{skill.current}% (目標: {skill.ideal}%)</span>
                      </div>
                      <div style={{ position: 'relative', height: '20px', backgroundColor: '#f0f0f0', borderRadius: '10px', overflow: 'hidden' }}>
                        <div 
                          style={{ 
                            width: `${skill.current}%`,
                            height: '100%',
                            backgroundColor: skill.current >= skill.ideal ? '#27ae60' : '#e74c3c',
                            transition: 'width 0.5s ease'
                          }}
                        />
                        <div 
                          style={{ 
                            position: 'absolute',
                            left: `${skill.ideal}%`,
                            top: 0,
                            width: '2px',
                            height: '100%',
                            backgroundColor: '#333',
                            zIndex: 1
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.analysisInsight}>
                <p className={styles.warning}>⚠️ マネジメント・データ分析スキルが不足</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.recommendationSection}>
          <h3>最適化提案</h3>
          <div className={styles.recommendationList}>
            {analysisResult ? (
              analysisResult.recommendations.map((rec, index) => (
                <div key={index} className={styles.recommendationCard}>
                  <div className={`${styles.recommendationPriority} ${rec.priority === '高' ? styles.high : rec.priority === '中' ? styles.medium : styles.low}`}>
                    優先度: {rec.priority}
                  </div>
                  <h4>{rec.title}</h4>
                  <p>{rec.description}</p>
                  <div className={styles.impactAnalysis}>
                    <p>期待効果: {rec.expectedEffect}</p>
                    <p>リスク: {rec.risk}</p>
                    <p>影響人数: {rec.affectedStaff}名</p>
                  </div>
                  <button className={styles.detailButton}>詳細を見る</button>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', color: '#666' }}>
                分析を実行してください
              </p>
            )}
          </div>
        </div>

        <div className={styles.futureProjection}>
          <h3>将来予測</h3>
          <div className={styles.projectionContent}>
            <div style={{ padding: '20px' }}>
              <h4>5年後の組織構成シミュレーション</h4>
              <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <h5>現在</h5>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li>平均年齢: 38.5歳</li>
                    <li>管理職比率: 25%</li>
                    <li>スキル充足率: 75%</li>
                  </ul>
                </div>
                <div>
                  <h5>5年後予測</h5>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li>平均年齢: 41.2歳 📈</li>
                    <li>管理職比率: 30% 📈</li>
                    <li>スキル充足率: 85% 📈</li>
                  </ul>
                </div>
              </div>
              <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '5px' }}>
                <h5>推奨アクション</h5>
                <ul style={{ marginLeft: '20px' }}>
                  <li>若手人材の積極的採用</li>
                  <li>ミドルマネジメント層の育成強化</li>
                  <li>デジタルスキル研修の充実</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}