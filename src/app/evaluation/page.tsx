'use client'

import React, { useState } from 'react'
import CommonHeader from '@/components/CommonHeader'
import { staffDatabase } from '../data/staffData.js'
import styles from './Evaluation.module.css'

const tabs = [
  { id: 'dashboard', label: '評価ダッシュボード', icon: '📊' },
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

export default function EvaluationPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedFacility, setSelectedFacility] = useState('all')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedPeriod, setSelectedPeriod] = useState('2024-H2')

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
      <CommonHeader 
        title="人事評価管理" 
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
          {activeTab === 'process' && <ProcessTab />}
          {activeTab === 'criteria' && <CriteriaTab />}
          {activeTab === 'execution' && <ExecutionTab />}
          {activeTab === 'analysis' && <AnalysisTab />}
        </div>
      </div>
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
          <h3>平均評価スコア</h3>
          <div className={styles.summaryValue}>4.2</div>
          <p className={styles.summaryLabel}>5段階評価</p>
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

function ExecutionTab(): React.ReactElement {
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