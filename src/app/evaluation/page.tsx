'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import CommonHeader from '@/components/CommonHeader'
import DashboardButton from '@/components/DashboardButton'
import { staffDatabase } from '../data/staffData.js'
import { TwoAxisEvaluationSummary } from '@/components/evaluation/TwoAxisEvaluationSummary'
import { TwoAxisEvaluationMatrixDisplay } from '@/components/evaluation/TwoAxisEvaluationMatrix'
import { getEvaluationGradeColor, getEvaluationGradeLabel } from '@/types/two-axis-evaluation'
import styles from './Evaluation.module.css'

const tabs = [
  { id: 'dashboard', label: '評価ダッシュボード', icon: '📊' },
  { id: 'staffList', label: '職員評価一覧', icon: '👥' },
  { id: 'twoAxis', label: '総合人事評価', icon: '🎯' },
  { id: 'execution', label: '評価実施', icon: '✍️' },
  { id: 'analysis', label: '分析・レポート', icon: '📈' },
  { id: 'process', label: '評価プロセス管理', icon: '🔄' },
  { id: 'criteria', label: '評価基準設定', icon: '📋' },
]

interface EvaluationData {
  facility: string
  department: string
  totalStaff: number
  completedEvaluations: number
  averageScore: number
  distribution: {
    S: number
    A: number
    B: number
    C: number
  }
}

function EvaluationPageContent() {
  const searchParams = useSearchParams()
  const staffId = searchParams.get('staffId')
  const action = searchParams.get('action')
  const tab = searchParams.get('tab')
  
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedFacility, setSelectedFacility] = useState('all')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedPeriod, setSelectedPeriod] = useState('2024-H2')
  
  // URLパラメータに基づいてタブを設定
  useEffect(() => {
    if (action === 'input') {
      setActiveTab('execution')
    } else if (tab === 'history') {
      setActiveTab('staffList')
    } else if (staffId && !action && !tab) {
      setActiveTab('staffList')
    }
  }, [action, tab, staffId])

  // 評価データの集計
  const getEvaluationData = (): EvaluationData[] => {
    const data: { [key: string]: EvaluationData } = {}
    
    Object.values(staffDatabase).forEach((staff: any) => {
      const key = `${staff.facility}-${staff.department}`
      if (!data[key]) {
        data[key] = {
          facility: staff.facility,
          department: staff.department,
          totalStaff: 0,
          completedEvaluations: 0,
          averageScore: 0,
          distribution: { S: 0, A: 0, B: 0, C: 0 }
        }
      }
      
      data[key].totalStaff++
      if (staff.evaluation) {
        data[key].completedEvaluations++
        const grade = staff.evaluation.replace('+', '')
        if (data[key].distribution[grade as keyof typeof data[string]['distribution']] !== undefined) {
          data[key].distribution[grade as keyof typeof data[string]['distribution']]++
        }
      }
    })
    
    return Object.values(data)
  }

  const evaluationData = getEvaluationData()

  return (
    <div>
      <CommonHeader title="人事評価管理" />
      
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
          {activeTab === 'dashboard' && (
            <DashboardTab 
              evaluationData={evaluationData}
              selectedFacility={selectedFacility}
              setSelectedFacility={setSelectedFacility}
              selectedDepartment={selectedDepartment}
              setSelectedDepartment={setSelectedDepartment}
              selectedPeriod={selectedPeriod}
              setSelectedPeriod={setSelectedPeriod}
            />
          )}
          {activeTab === 'staffList' && (
            <StaffListTab 
              selectedFacility={selectedFacility}
              setSelectedFacility={setSelectedFacility}
              selectedDepartment={selectedDepartment}
              setSelectedDepartment={setSelectedDepartment}
              selectedPeriod={selectedPeriod}
              setSelectedPeriod={setSelectedPeriod}
              highlightStaffId={staffId}
            />
          )}
          {activeTab === 'process' && <ProcessTab />}
          {activeTab === 'criteria' && <CriteriaTab />}
          {activeTab === 'execution' && <ExecutionTab targetStaffId={staffId} />}
          {activeTab === 'analysis' && <AnalysisTab />}
          {activeTab === 'twoAxis' && <TwoAxisTab />}
        </div>
      </div>
      <DashboardButton />
    </div>
  )
}

interface DashboardTabProps {
  evaluationData: EvaluationData[]
  selectedFacility: string
  setSelectedFacility: (value: string) => void
  selectedDepartment: string
  setSelectedDepartment: (value: string) => void
  selectedPeriod: string
  setSelectedPeriod: (value: string) => void
}

function DashboardTab({ 
  evaluationData, 
  selectedFacility, 
  setSelectedFacility, 
  selectedDepartment, 
  setSelectedDepartment,
  selectedPeriod,
  setSelectedPeriod 
}: DashboardTabProps) {
  // 全体の統計を計算
  const totalStats = evaluationData.reduce((acc, data) => {
    acc.totalStaff += data.totalStaff
    acc.completedEvaluations += data.completedEvaluations
    acc.distribution.S += data.distribution.S
    acc.distribution.A += data.distribution.A
    acc.distribution.B += data.distribution.B
    acc.distribution.C += data.distribution.C
    return acc
  }, {
    totalStaff: 0,
    completedEvaluations: 0,
    distribution: { S: 0, A: 0, B: 0, C: 0 }
  })

  const completionRate = Math.round((totalStats.completedEvaluations / totalStats.totalStaff) * 100)

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.filterSection}>
        <select 
          value={selectedPeriod} 
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="2024-H2">2024年下期</option>
          <option value="2024-H1">2024年上期</option>
          <option value="2023-H2">2023年下期</option>
        </select>
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
        </select>
      </div>

      <div className={styles.summaryCards}>
        <div className={styles.summaryCard}>
          <h3>評価対象者数</h3>
          <div className={styles.summaryValue}>{totalStats.totalStaff}名</div>
          <p className={styles.summaryLabel}>全職員</p>
        </div>
        <div className={styles.summaryCard}>
          <h3>評価完了率</h3>
          <div className={styles.summaryValue}>{completionRate}%</div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${completionRate}%` }}></div>
          </div>
          <p className={styles.summaryLabel}>{totalStats.completedEvaluations}名 / {totalStats.totalStaff}名</p>
        </div>
        <div className={styles.summaryCard}>
          <h3>評価分布</h3>
          <div className={styles.distributionBars}>
            <div className={styles.distributionItem}>
              <span className={styles.distributionLabel}>S</span>
              <div className={styles.distributionBar}>
                <div 
                  className={`${styles.distributionFill} ${styles.gradeS}`}
                  style={{ width: `${(totalStats.distribution.S / totalStats.completedEvaluations) * 100}%` }}
                ></div>
              </div>
              <span className={styles.distributionCount}>{totalStats.distribution.S}</span>
            </div>
            <div className={styles.distributionItem}>
              <span className={styles.distributionLabel}>A</span>
              <div className={styles.distributionBar}>
                <div 
                  className={`${styles.distributionFill} ${styles.gradeA}`}
                  style={{ width: `${(totalStats.distribution.A / totalStats.completedEvaluations) * 100}%` }}
                ></div>
              </div>
              <span className={styles.distributionCount}>{totalStats.distribution.A}</span>
            </div>
            <div className={styles.distributionItem}>
              <span className={styles.distributionLabel}>B</span>
              <div className={styles.distributionBar}>
                <div 
                  className={`${styles.distributionFill} ${styles.gradeB}`}
                  style={{ width: `${(totalStats.distribution.B / totalStats.completedEvaluations) * 100}%` }}
                ></div>
              </div>
              <span className={styles.distributionCount}>{totalStats.distribution.B}</span>
            </div>
            <div className={styles.distributionItem}>
              <span className={styles.distributionLabel}>C</span>
              <div className={styles.distributionBar}>
                <div 
                  className={`${styles.distributionFill} ${styles.gradeC}`}
                  style={{ width: `${(totalStats.distribution.C / totalStats.completedEvaluations) * 100}%` }}
                ></div>
              </div>
              <span className={styles.distributionCount}>{totalStats.distribution.C}</span>
            </div>
          </div>
        </div>
        <div className={styles.summaryCard}>
          <h3>総合人事評価</h3>
          <div className={styles.twoAxisPreview}>
            <div className={styles.twoAxisInfo}>
              <span className={styles.infoLabel}>実施済</span>
              <span className={styles.infoValue}>486名</span>
            </div>
            <div className={styles.twoAxisInfo}>
              <span className={styles.infoLabel}>S+評価</span>
              <span className={styles.infoValue}>12名</span>
            </div>
          </div>
          <p className={styles.summaryLabel}>2軸評価システム</p>
        </div>
      </div>

      <div className={styles.departmentGrid}>
        <h2>部門別評価状況</h2>
        <div className={styles.departmentCards}>
          {evaluationData.map((data, index) => (
            <div key={index} className={styles.departmentCard}>
              <div className={styles.departmentHeader}>
                <h4>{data.facility}</h4>
                <p>{data.department}</p>
              </div>
              <div className={styles.departmentStats}>
                <div className={styles.departmentStat}>
                  <span className={styles.statLabel}>対象者</span>
                  <span className={styles.statValue}>{data.totalStaff}名</span>
                </div>
                <div className={styles.departmentStat}>
                  <span className={styles.statLabel}>完了率</span>
                  <span className={styles.statValue}>
                    {Math.round((data.completedEvaluations / data.totalStaff) * 100)}%
                  </span>
                </div>
              </div>
              <div className={styles.miniDistribution}>
                <div className={`${styles.miniBar} ${styles.gradeS}`} 
                     style={{ width: `${(data.distribution.S / data.completedEvaluations) * 100}%` }}
                     title={`S: ${data.distribution.S}名`}
                ></div>
                <div className={`${styles.miniBar} ${styles.gradeA}`} 
                     style={{ width: `${(data.distribution.A / data.completedEvaluations) * 100}%` }}
                     title={`A: ${data.distribution.A}名`}
                ></div>
                <div className={`${styles.miniBar} ${styles.gradeB}`} 
                     style={{ width: `${(data.distribution.B / data.completedEvaluations) * 100}%` }}
                     title={`B: ${data.distribution.B}名`}
                ></div>
                <div className={`${styles.miniBar} ${styles.gradeC}`} 
                     style={{ width: `${(data.distribution.C / data.completedEvaluations) * 100}%` }}
                     title={`C: ${data.distribution.C}名`}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ProcessTab(): React.ReactElement {
  return (
    <div className={styles.processContainer}>
      <h2>評価プロセス管理</h2>
      <div className={styles.processTimeline}>
        <div className={styles.timelineItem}>
          <div className={`${styles.timelineIcon} ${styles.completed}`}>✓</div>
          <div className={styles.timelineContent}>
            <h3>評価期間設定</h3>
            <p>2024年下期（2024/10/1 - 2025/3/31）</p>
            <span className={styles.timelineDate}>完了: 2024/09/15</span>
          </div>
        </div>
        <div className={styles.timelineItem}>
          <div className={`${styles.timelineIcon} ${styles.inProgress}`}>●</div>
          <div className={styles.timelineContent}>
            <h3>自己評価</h3>
            <p>進捗: 85% (170/200名)</p>
            <span className={styles.timelineDate}>期限: 2024/12/15</span>
          </div>
        </div>
        <div className={styles.timelineItem}>
          <div className={`${styles.timelineIcon} ${styles.pending}`}>○</div>
          <div className={styles.timelineContent}>
            <h3>上司評価</h3>
            <p>未開始</p>
            <span className={styles.timelineDate}>期限: 2024/12/31</span>
          </div>
        </div>
        <div className={styles.timelineItem}>
          <div className={`${styles.timelineIcon} ${styles.pending}`}>○</div>
          <div className={styles.timelineContent}>
            <h3>調整会議</h3>
            <p>未開始</p>
            <span className={styles.timelineDate}>予定: 2025/01/15</span>
          </div>
        </div>
        <div className={styles.timelineItem}>
          <div className={`${styles.timelineIcon} ${styles.pending}`}>○</div>
          <div className={styles.timelineContent}>
            <h3>最終決定</h3>
            <p>未開始</p>
            <span className={styles.timelineDate}>予定: 2025/01/31</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function CriteriaTab(): React.ReactElement {
  return (
    <div className={styles.criteriaContainer}>
      <h2>評価基準設定</h2>
      <div className={styles.criteriaSection}>
        <h3>評価項目</h3>
        <div className={styles.criteriaGrid}>
          <div className={styles.criteriaCard}>
            <h4>業績評価（40%）</h4>
            <ul className={styles.criteriaList}>
              <li>目標達成度</li>
              <li>業務品質</li>
              <li>効率性・生産性</li>
            </ul>
          </div>
          <div className={styles.criteriaCard}>
            <h4>能力評価（30%）</h4>
            <ul className={styles.criteriaList}>
              <li>専門知識・スキル</li>
              <li>問題解決能力</li>
              <li>コミュニケーション能力</li>
            </ul>
          </div>
          <div className={styles.criteriaCard}>
            <h4>行動評価（20%）</h4>
            <ul className={styles.criteriaList}>
              <li>チームワーク</li>
              <li>主体性・積極性</li>
              <li>規律遵守</li>
            </ul>
          </div>
          <div className={styles.criteriaCard}>
            <h4>成長性評価（10%）</h4>
            <ul className={styles.criteriaList}>
              <li>学習意欲</li>
              <li>改善提案</li>
              <li>将来性</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ExecutionTabProps {
  targetStaffId?: string | null
}

function ExecutionTab({ targetStaffId }: ExecutionTabProps): React.ReactElement {
  return (
    <div className={styles.executionContainer}>
      <h2>評価実施</h2>
      <div className={styles.executionGrid}>
        <div className={styles.executionCard}>
          <h3>新規評価作成</h3>
          <p>職員の評価を開始します</p>
          <button className={styles.primaryButton}>評価を開始</button>
        </div>
        <div className={styles.executionCard}>
          <h3>進行中の評価</h3>
          <p>15件の評価が進行中です</p>
          <button className={styles.secondaryButton}>一覧を見る</button>
        </div>
        <div className={styles.executionCard}>
          <h3>承認待ち</h3>
          <p>8件の評価が承認待ちです</p>
          <button className={styles.secondaryButton}>確認する</button>
        </div>
      </div>
    </div>
  )
}

function AnalysisTab(): React.ReactElement {
  return (
    <div className={styles.analysisContainer}>
      <h2>分析・レポート</h2>
      <div className={styles.analysisGrid}>
        <div className={styles.analysisCard}>
          <h3>評価分布分析</h3>
          <p>評価の偏りや傾向を分析</p>
          <button className={styles.analysisButton}>分析を見る</button>
        </div>
        <div className={styles.analysisCard}>
          <h3>部門間比較</h3>
          <p>部門ごとの評価傾向を比較</p>
          <button className={styles.analysisButton}>比較する</button>
        </div>
        <div className={styles.analysisCard}>
          <h3>評価者分析</h3>
          <p>評価者ごとの評価傾向</p>
          <button className={styles.analysisButton}>分析する</button>
        </div>
        <div className={styles.analysisCard}>
          <h3>相関分析</h3>
          <p>評価と業績の相関関係</p>
          <button className={styles.analysisButton}>確認する</button>
        </div>
      </div>
    </div>
  )
}

interface StaffListTabProps {
  selectedFacility: string
  setSelectedFacility: (value: string) => void
  selectedDepartment: string
  setSelectedDepartment: (value: string) => void
  selectedPeriod: string
  setSelectedPeriod: (value: string) => void
  highlightStaffId?: string | null
}

function StaffListTab({ 
  selectedFacility, 
  setSelectedFacility, 
  selectedDepartment, 
  setSelectedDepartment,
  selectedPeriod,
  setSelectedPeriod,
  highlightStaffId
}: StaffListTabProps) {
  const [sortField, setSortField] = useState<'name' | 'evaluation' | 'department'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [filterGrade, setFilterGrade] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // 2軸評価のモックデータを取得する関数
  function getTwoAxisEvaluationMock(name: string): { facility: string; corporate: string; overall: string } | null {
    const mockData: Record<string, { facility: string; corporate: string; overall: string }> = {
      '田中美咲': { facility: 'B', corporate: 'A', overall: 'A' },
      '佐藤花子': { facility: 'A', corporate: 'A', overall: 'A+' },
      '中村恵子': { facility: 'C', corporate: 'C', overall: 'C' },
      '小林さくら': { facility: 'B', corporate: 'B', overall: 'B' },
      '伊藤由美': { facility: 'S', corporate: 'A', overall: 'S' },
      '渡辺麻衣': { facility: 'B', corporate: 'B', overall: 'B' },
      '山田太郎': { facility: 'A', corporate: 'B', overall: 'A' },
      '高橋花子': { facility: 'C', corporate: 'B', overall: 'C' },
      '鈴木一郎': { facility: 'B', corporate: 'C', overall: 'C' },
      '木村洋子': { facility: 'A', corporate: 'S', overall: 'S' }
    }
    return mockData[name] || null
  }

  // 職員データをフィルタリング
  const filteredStaff = Object.entries(staffDatabase).filter(([_, staff]: [string, any]) => {
    const facilityMatch = selectedFacility === 'all' || staff.facility === selectedFacility
    const departmentMatch = selectedDepartment === 'all' || staff.department === selectedDepartment
    const gradeMatch = filterGrade === 'all' || staff.evaluation === filterGrade
    const searchMatch = searchTerm === '' || 
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    
    return facilityMatch && departmentMatch && gradeMatch && searchMatch
  })

  // ソート処理
  const sortedStaff = [...filteredStaff].sort(([_a, a], [_b, b]) => {
    let comparison = 0
    
    switch (sortField) {
      case 'name':
        comparison = a.name.localeCompare(b.name)
        break
      case 'evaluation':
        const gradeOrder: Record<string, number> = { 'S': 4, 'A': 3, 'B': 2, 'C': 1, '': 0 }
        const aGrade = gradeOrder[a.evaluation || ''] || 0
        const bGrade = gradeOrder[b.evaluation || ''] || 0
        comparison = aGrade - bGrade
        break
      case 'department':
        comparison = a.department.localeCompare(b.department)
        break
    }
    
    return sortOrder === 'asc' ? comparison : -comparison
  })

  const handleSort = (field: 'name' | 'evaluation' | 'department') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  return (
    <div className={styles.staffListContainer}>
      <div className={styles.staffListHeader}>
        <h2>職員評価一覧</h2>
        <div className={styles.staffListFilters}>
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="2024-H2">2024年下期</option>
            <option value="2024-H1">2024年上期</option>
            <option value="2023-H2">2023年下期</option>
          </select>
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
          </select>
          <select 
            value={filterGrade} 
            onChange={(e) => setFilterGrade(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">全評価</option>
            <option value="S">S評価のみ</option>
            <option value="A">A評価のみ</option>
            <option value="B">B評価のみ</option>
            <option value="C">C評価のみ</option>
          </select>
          <input
            type="text"
            placeholder="職員番号・氏名で検索"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.staffTableContainer}>
        <table className={styles.staffTable}>
          <thead>
            <tr>
              <th>職員番号</th>
              <th 
                onClick={() => handleSort('name')}
                className={styles.sortableHeader}
              >
                氏名 {sortField === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th>施設</th>
              <th 
                onClick={() => handleSort('department')}
                className={styles.sortableHeader}
              >
                部署 {sortField === 'department' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th>職種</th>
              <th>役職</th>
              <th 
                onClick={() => handleSort('evaluation')}
                className={styles.sortableHeader}
              >
                従来評価 {sortField === 'evaluation' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th>総合人事評価</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {sortedStaff.map(([id, staff]) => {
              // モックデータとして2軸評価を設定
              const twoAxisData = getTwoAxisEvaluationMock(staff.name)
              return (
                <tr key={id} className={highlightStaffId === id ? styles.highlightedRow : ''}>
                  <td>{staff.employeeId}</td>
                  <td>{staff.name}</td>
                  <td>{staff.facility}</td>
                  <td>{staff.department}</td>
                  <td>{staff.position}</td>
                  <td>-</td>
                  <td>
                    <span className={`${styles.evaluationBadge} ${styles[`grade${staff.evaluation}`]}`}>
                      {staff.evaluation || '未評価'}
                    </span>
                  </td>
                  <td>
                    {twoAxisData ? (
                      <div className={styles.twoAxisBadgeContainer}>
                        <span className={styles.twoAxisBadge} style={{ backgroundColor: getEvaluationGradeColor(twoAxisData.overall as any) }}>
                          {twoAxisData.overall}
                        </span>
                        <span className={styles.twoAxisDetail}>
                          ({twoAxisData.facility}/{twoAxisData.corporate})
                        </span>
                      </div>
                    ) : (
                      <span className={styles.notEvaluated}>-</span>
                    )}
                  </td>
                  <td>
                    <a href={`/staff-cards/${id}`} className={styles.detailLink}>
                      詳細
                    </a>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {sortedStaff.length === 0 && (
          <div className={styles.noData}>
            該当する職員が見つかりません
          </div>
        )}
      </div>

      <div className={styles.staffListSummary}>
        <p>表示件数: {sortedStaff.length}件</p>
      </div>
    </div>
  )
}

function TwoAxisTab() {
  const [selectedFacility, setSelectedFacility] = useState('all')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedPeriod, setSelectedPeriod] = useState('2024-H2')
  const [viewMode, setViewMode] = useState<'summary' | 'list' | 'matrix'>('summary')

  // 2軸評価データの集計（モックデータ）
  const twoAxisStats = {
    totalEvaluated: 486,
    distribution: {
      'S+': 12,
      'S': 45,
      'A+': 78,
      'A': 156,
      'B': 145,
      'C': 38,
      'D': 12
    },
    averageFacilityScore: 'B',
    averageCorporateScore: 'B',
    topPerformers: [
      { name: '田中美咲', department: '地域包括ケア病棟', facility: 'B', corporate: 'A', overall: 'A' },
      { name: '佐藤花子', department: '内科病棟', facility: 'A', corporate: 'A', overall: 'A+' },
      { name: '伊藤由美', department: '緩和ケア病棟', facility: 'S', corporate: 'A', overall: 'S' }
    ]
  }

  return (
    <div className={styles.twoAxisContainer}>
      {/* フィルター */}
      <div className={styles.filterSection}>
        <select 
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="2024-H2">2024年下期</option>
          <option value="2024-H1">2024年上期</option>
          <option value="2023-H2">2023年下期</option>
        </select>
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
        </select>
        <div className={styles.viewModeToggle}>
          <button 
            className={viewMode === 'summary' ? styles.active : ''}
            onClick={() => setViewMode('summary')}
          >
            サマリー
          </button>
          <button 
            className={viewMode === 'list' ? styles.active : ''}
            onClick={() => setViewMode('list')}
          >
            一覧
          </button>
          <button 
            className={viewMode === 'matrix' ? styles.active : ''}
            onClick={() => setViewMode('matrix')}
          >
            マトリックス
          </button>
        </div>
      </div>

      {viewMode === 'summary' && (
        <div>
          {/* 統計サマリー */}
          <div className={styles.summaryCards}>
            <div className={styles.summaryCard}>
              <h3>総合人事評価実施数</h3>
              <div className={styles.summaryValue}>{twoAxisStats.totalEvaluated}名</div>
              <p className={styles.summaryLabel}>2軸評価完了</p>
            </div>
            <div className={styles.summaryCard}>
              <h3>評価分布</h3>
              <div className={styles.twoAxisDistribution}>
                {Object.entries(twoAxisStats.distribution).map(([grade, count]) => (
                  <div key={grade} className={styles.gradeItem}>
                    <div 
                      className={styles.gradeBadge}
                      style={{ backgroundColor: getEvaluationGradeColor(grade as any) }}
                    >
                      {grade}
                    </div>
                    <span className={styles.gradeCount}>{count}名</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.summaryCard}>
              <h3>平均評価</h3>
              <div className={styles.averageScores}>
                <div className={styles.scoreItem}>
                  <span className={styles.scoreLabel}>施設内</span>
                  <span className={styles.scoreValue}>{twoAxisStats.averageFacilityScore}</span>
                </div>
                <div className={styles.scoreItem}>
                  <span className={styles.scoreLabel}>法人内</span>
                  <span className={styles.scoreValue}>{twoAxisStats.averageCorporateScore}</span>
                </div>
              </div>
            </div>
          </div>

          {/* トップパフォーマー */}
          <div className={styles.topPerformersSection}>
            <h3>トップパフォーマー</h3>
            <div className={styles.performersList}>
              {twoAxisStats.topPerformers.map((performer, index) => (
                <div key={index} className={styles.performerCard}>
                  <h4>{performer.name}</h4>
                  <p>{performer.department}</p>
                  <TwoAxisEvaluationSummary
                    facilityScore={performer.facility as any}
                    corporateScore={performer.corporate as any}
                    overallScore={performer.overall as any}
                    size="small"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {viewMode === 'list' && (
        <div className={styles.twoAxisListView}>
          {/* 2軸評価一覧表示 */}
          <table className={styles.twoAxisTable}>
            <thead>
              <tr>
                <th>職員番号</th>
                <th>氏名</th>
                <th>部署</th>
                <th>施設内評価</th>
                <th>法人内評価</th>
                <th>総合評価</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {/* ここに職員の2軸評価データを表示 */}
              <tr>
                <td>NS-2021-047</td>
                <td>田中美咲</td>
                <td>地域包括ケア病棟</td>
                <td><span className={styles.gradeB}>B</span></td>
                <td><span className={styles.gradeA}>A</span></td>
                <td><span className={styles.gradeA}>A</span></td>
                <td>
                  <a href="/staff-cards/NS-2021-047" className={styles.detailLink}>詳細</a>
                </td>
              </tr>
              {/* 他の職員データも同様に表示 */}
            </tbody>
          </table>
        </div>
      )}

      {viewMode === 'matrix' && (
        <div className={styles.matrixView}>
          <h3>2軸評価マトリックス</h3>
          <TwoAxisEvaluationMatrixDisplay 
            facilityScore="B" 
            corporateScore="B" 
            showGrid={true}
            size="large"
          />
        </div>
      )}
    </div>
  )
}

export default function EvaluationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EvaluationPageContent />
    </Suspense>
  )
}