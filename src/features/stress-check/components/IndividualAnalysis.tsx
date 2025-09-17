'use client'

import React, { useState } from 'react'
import styles from './IndividualAnalysis.module.css'

interface RiskSummary {
  level: 'burnout' | 'critical' | 'high' | 'medium' | 'healthy'
  icon: string
  count: number
  label: string
  sublabel: string
  trend: 'up' | 'down' | 'stable'
  trendValue: number
  details: {
    label: string
    value: number | string
  }[]
}

interface StaffMember {
  id: string
  name: string
  department: string
  position: string
  years: number
  status: 'burnout' | 'critical' | 'high' | 'medium'
  score: number
  factors: string[]
  interventionStatus: 'pending' | 'ongoing' | 'scheduled'
  interventionDays?: number
  riskPercentage?: number
  avatar: string
}

interface Department {
  id: string
  name: string
  icon: string
  total: number
  distribution: {
    burnout: number
    critical: number
    high: number
    medium: number
    healthy: number
  }
  needsAction: number
}

export default function IndividualAnalysis() {
  const [selectedTab, setSelectedTab] = useState('burnout')
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['全て'])

  const riskSummaries: RiskSummary[] = [
    {
      level: 'burnout',
      icon: '🔴',
      count: 8,
      label: 'バーンアウト発症',
      sublabel: '即座の医療介入必要',
      trend: 'up',
      trendValue: 3,
      details: [
        { label: '休職中', value: 5 },
        { label: '治療中', value: 3 },
        { label: '全体比', value: '2.1%' }
      ]
    },
    {
      level: 'critical',
      icon: '🟠',
      count: 18,
      label: '超高リスク',
      sublabel: '72時間以内の介入必須',
      trend: 'up',
      trendValue: 5,
      details: [
        { label: '未対応', value: 12 },
        { label: '対応中', value: 6 },
        { label: '全体比', value: '4.7%' }
      ]
    },
    {
      level: 'high',
      icon: '🟡',
      count: 45,
      label: '高リスク',
      sublabel: '1週間以内のフォロー',
      trend: 'stable',
      trendValue: 0,
      details: [
        { label: '要面談', value: 28 },
        { label: '観察中', value: 17 },
        { label: '全体比', value: '11.8%' }
      ]
    },
    {
      level: 'medium',
      icon: '🔵',
      count: 98,
      label: '中リスク',
      sublabel: '定期モニタリング',
      trend: 'down',
      trendValue: -8,
      details: [
        { label: '経過観察', value: 62 },
        { label: '改善傾向', value: 36 },
        { label: '全体比', value: '25.7%' }
      ]
    },
    {
      level: 'healthy',
      icon: '🟢',
      count: 201,
      label: '健康',
      sublabel: '予防的ケア継続',
      trend: 'stable',
      trendValue: 0,
      details: [
        { label: '良好', value: 156 },
        { label: '要予防', value: 45 },
        { label: '全体比', value: '52.8%' }
      ]
    }
  ]

  const departments: Department[] = [
    {
      id: 'icu',
      name: 'ICU',
      icon: '🏥',
      total: 42,
      distribution: {
        burnout: 4,
        critical: 6,
        high: 8,
        medium: 10,
        healthy: 14
      },
      needsAction: 10
    },
    {
      id: 'emergency',
      name: '救急部',
      icon: '🚑',
      total: 48,
      distribution: {
        burnout: 2,
        critical: 4,
        high: 8,
        medium: 12,
        healthy: 22
      },
      needsAction: 6
    },
    {
      id: 'surgery',
      name: '外科',
      icon: '🔪',
      total: 56,
      distribution: {
        burnout: 1,
        critical: 3,
        high: 7,
        medium: 12,
        healthy: 33
      },
      needsAction: 4
    },
    {
      id: 'internal',
      name: '内科',
      icon: '💊',
      total: 62,
      distribution: {
        burnout: 1,
        critical: 2,
        high: 7,
        medium: 15,
        healthy: 37
      },
      needsAction: 3
    }
  ]

  const staffMembers: StaffMember[] = [
    {
      id: '1',
      name: '山田 花子',
      department: 'ICU',
      position: '看護師長',
      years: 12,
      status: 'burnout',
      score: 95,
      factors: ['3連続夜勤', '月85h残業', '情緒枯渇'],
      interventionStatus: 'pending',
      interventionDays: 14,
      riskPercentage: 75,
      avatar: '山田'
    },
    {
      id: '2',
      name: '佐藤 太郎',
      department: '救急部',
      position: '医師',
      years: 8,
      status: 'burnout',
      score: 92,
      factors: ['月120h残業', '脱人格化', '達成感喪失'],
      interventionStatus: 'ongoing',
      avatar: '佐藤'
    }
  ]

  const tabs = [
    { id: 'burnout', label: 'バーンアウト', icon: '🔴', count: 8 },
    { id: 'critical', label: '超高リスク', icon: '🟠', count: 18 },
    { id: 'high', label: '高リスク', icon: '🟡', count: 45 },
    { id: 'medium', label: '中リスク', icon: '🔵', count: 98 },
    { id: 'all', label: '全体一覧', icon: '🟢', count: 370 }
  ]

  const filters = ['全て', '医師', '看護師', '未対応']

  const handleRiskCardClick = (level: string) => {
    setSelectedTab(level)
  }

  const handleFilterToggle = (filter: string) => {
    if (filter === '全て') {
      setSelectedFilters(['全て'])
    } else {
      const newFilters = selectedFilters.filter(f => f !== '全て')
      if (selectedFilters.includes(filter)) {
        const updated = newFilters.filter(f => f !== filter)
        setSelectedFilters(updated.length === 0 ? ['全て'] : updated)
      } else {
        setSelectedFilters([...newFilters, filter])
      }
    }
  }

  const handleEmergencyIntervention = (staffName: string) => {
    if (confirm(`${staffName}への緊急介入を開始しますか？\n\n【バーンアウト対応プロトコル】\n・産業医への即時連絡\n・精神科医との連携\n・休職手続きの開始\n・代替要員の確保`)) {
      alert('緊急介入を開始しました。\n全関係者に通知済みです。')
    }
  }

  const getListTitle = () => {
    const tab = tabs.find(t => t.id === selectedTab)
    if (!tab) return ''

    let subtitle = ''
    if (tab.id === 'burnout') subtitle = ' - 緊急対応必要'
    else if (tab.id === 'critical') subtitle = ' - 72時間以内介入'
    else if (tab.id === 'high') subtitle = ' - 1週間以内フォロー'

    return `${tab.label}（${tab.count}名）${subtitle}`
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.hospitalTitle}>
            <span style={{ fontSize: '32px' }}>🏥</span>
            <div>
              <h1>医療法人厚生会 職員健康リスク管理</h1>
              <p className={styles.lastUpdate}>最終更新: 2025年1月23日 14:30</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className={`${styles.actionBtn} ${styles.btnSecondary}`}>📊 レポート出力</button>
            <button className={`${styles.actionBtn} ${styles.btnPrimary}`}>🔄 データ更新</button>
          </div>
        </div>

        <div className={styles.riskSummaryGrid}>
          {riskSummaries.map(summary => (
            <div
              key={summary.level}
              className={`${styles.riskCard} ${styles[`risk${summary.level.charAt(0).toUpperCase() + summary.level.slice(1)}`]}`}
              onClick={() => handleRiskCardClick(summary.level)}
            >
              <div className={styles.riskHeader}>
                <div className={styles.riskIcon}>{summary.icon}</div>
                <div className={`${styles.riskTrend} ${styles[`trend${summary.trend.charAt(0).toUpperCase() + summary.trend.slice(1)}`]}`}>
                  <span>{summary.trend === 'up' ? '↑' : summary.trend === 'down' ? '↓' : '→'}</span>
                  <span>{summary.trendValue > 0 ? '+' : ''}{summary.trendValue}名</span>
                </div>
              </div>
              <div className={styles.riskMain}>
                <div className={`${styles.riskCount} ${styles[`count${summary.level.charAt(0).toUpperCase() + summary.level.slice(1)}`]}`}>
                  {summary.count}
                </div>
                <div className={styles.riskLabel}>{summary.label}</div>
                <div className={styles.riskSublabel}>{summary.sublabel}</div>
              </div>
              <div className={styles.riskDetails}>
                {summary.details.map((detail, idx) => (
                  <div key={idx} className={styles.detailItem}>
                    <div className={styles.detailValue}>{detail.value}</div>
                    <div className={styles.detailLabel}>{detail.label}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.departmentRiskMatrix}>
          <div className={styles.matrixHeader}>
            <h3 className={styles.matrixTitle}>
              <span>📊</span>
              <span>部門別リスク分布</span>
            </h3>
            <div className={styles.matrixLegend}>
              <div className={styles.legendItem}>
                <div className={`${styles.legendDot} ${styles.barBurnout}`}></div>
                <span>バーンアウト</span>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.legendDot} ${styles.barCritical}`}></div>
                <span>超高リスク</span>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.legendDot} ${styles.barHigh}`}></div>
                <span>高リスク</span>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.legendDot} ${styles.barMedium}`}></div>
                <span>中リスク</span>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.legendDot} ${styles.barHealthy}`}></div>
                <span>健康</span>
              </div>
            </div>
          </div>
          <table className={styles.deptTable}>
            <thead>
              <tr>
                <th>部門</th>
                <th>人員</th>
                <th>リスク分布</th>
                <th>要対応</th>
              </tr>
            </thead>
            <tbody>
              {departments.map(dept => (
                <tr key={dept.id}>
                  <td className={styles.deptName}>{dept.icon} {dept.name}</td>
                  <td>{dept.total}</td>
                  <td>
                    <div className={styles.riskBar}>
                      <div className={`${styles.barSegment} ${styles.barBurnout}`}
                           style={{ width: `${(dept.distribution.burnout / dept.total) * 100}%` }}>
                        {dept.distribution.burnout}
                      </div>
                      <div className={`${styles.barSegment} ${styles.barCritical}`}
                           style={{ width: `${(dept.distribution.critical / dept.total) * 100}%` }}>
                        {dept.distribution.critical}
                      </div>
                      <div className={`${styles.barSegment} ${styles.barHigh}`}
                           style={{ width: `${(dept.distribution.high / dept.total) * 100}%` }}>
                        {dept.distribution.high}
                      </div>
                      <div className={`${styles.barSegment} ${styles.barMedium}`}
                           style={{ width: `${(dept.distribution.medium / dept.total) * 100}%` }}>
                        {dept.distribution.medium}
                      </div>
                      <div className={`${styles.barSegment} ${styles.barHealthy}`}
                           style={{ width: `${(dept.distribution.healthy / dept.total) * 100}%` }}>
                        {dept.distribution.healthy}
                      </div>
                    </div>
                  </td>
                  <td style={{
                    color: dept.needsAction >= 10 ? '#dc2626' :
                           dept.needsAction >= 6 ? '#ea580c' :
                           dept.needsAction >= 4 ? '#f59e0b' : '#3b82f6',
                    fontWeight: 600
                  }}>
                    {dept.needsAction}名
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.tabNavigation}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`${styles.tabBtn} ${selectedTab === tab.id ? styles.active : ''}`}
            onClick={() => setSelectedTab(tab.id)}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            <span className={styles.tabCount}>{tab.count}</span>
          </button>
        ))}
      </div>

      <div className={styles.contentArea}>
        <div className={styles.staffListContainer}>
          <div className={styles.listHeader}>
            <h2 className={styles.listTitle}>{getListTitle()}</h2>
            <div className={styles.listActions}>
              <div className={styles.filterGroup}>
                {filters.map(filter => (
                  <div
                    key={filter}
                    className={`${styles.filterChip} ${selectedFilters.includes(filter) ? styles.active : ''}`}
                    onClick={() => handleFilterToggle(filter)}
                  >
                    {filter}
                  </div>
                ))}
              </div>
              <div className={styles.viewToggle}>
                <button className={`${styles.viewBtn} ${styles.active}`}>📋</button>
                <button className={styles.viewBtn}>📊</button>
                <button className={styles.viewBtn}>🗂️</button>
              </div>
            </div>
          </div>

          <table className={styles.staffTable}>
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input type="checkbox" />
                </th>
                <th>職員情報</th>
                <th style={{ width: '100px' }}>状態</th>
                <th style={{ width: '80px' }}>スコア</th>
                <th style={{ width: '160px' }}>要因</th>
                <th style={{ width: '140px' }}>介入状況</th>
                <th style={{ width: '180px' }}>アクション</th>
              </tr>
            </thead>
            <tbody>
              {staffMembers.map(staff => (
                <tr key={staff.id}>
                  <td><input type="checkbox" /></td>
                  <td>
                    <div className={styles.staffInfo}>
                      <div className={`${styles.staffAvatar} ${styles[`avatar${staff.status.charAt(0).toUpperCase() + staff.status.slice(1)}`]}`}>
                        {staff.avatar}
                      </div>
                      <div className={styles.staffDetails}>
                        <div className={styles.staffName}>{staff.name}</div>
                        <div className={styles.staffDept}>{staff.department} {staff.position}・勤続{staff.years}年</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={`${styles.statusIndicator} ${styles[`status${staff.status.charAt(0).toUpperCase() + staff.status.slice(1)}`]}`}>
                      <span>{staff.status === 'burnout' ? '🔴' : '🟠'}</span>
                      <span>発症</span>
                    </div>
                  </td>
                  <td>
                    <div className={`${styles.riskScore} ${styles[`score${staff.status.charAt(0).toUpperCase() + staff.status.slice(1)}`]}`}>
                      {staff.score}
                    </div>
                  </td>
                  <td>
                    <div className={styles.factorTags}>
                      {staff.factors.map((factor, idx) => (
                        <span key={idx} className={styles.factorTag}>{factor}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className={styles.interventionInfo}>
                      <div className={`${styles.interventionStatus} ${styles[`status${staff.interventionStatus.charAt(0).toUpperCase() + staff.interventionStatus.slice(1)}`]}`}>
                        {staff.interventionStatus === 'pending' ? `未対応・${staff.interventionDays}日経過` :
                         staff.interventionStatus === 'ongoing' ? '治療中' : 'スケジュール済み'}
                      </div>
                      {staff.riskPercentage && (
                        <div style={{ color: '#dc2626', fontSize: '11px' }}>離職リスク: {staff.riskPercentage}%</div>
                      )}
                      {staff.interventionStatus === 'ongoing' && (
                        <div style={{ color: '#ea580c', fontSize: '11px' }}>産業医フォロー中</div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className={styles.actionGroup}>
                      <button
                        className={`${styles.actionBtn} ${styles.btnEmergency}`}
                        onClick={() => handleEmergencyIntervention(staff.name)}
                      >
                        {staff.interventionStatus === 'ongoing' ? '休職検討' : '緊急介入'}
                      </button>
                      <button className={`${styles.actionBtn} ${styles.btnSecondary}`}>詳細</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.sidePanel}>
          <div className={styles.aiAlertPanel}>
            <div className={styles.alertHeader}>
              <span style={{ fontSize: '24px' }}>⚠️</span>
              <h3 className={styles.alertTitle}>緊急対応アラート</h3>
            </div>
            <div className={styles.alertItems}>
              <div className={styles.alertCard}>
                <div className={styles.alertPerson}>山田看護師（ICU）</div>
                <div className={styles.alertMessage}>14日間未対応・離職リスク75%</div>
                <div className={styles.alertAction}>
                  <button
                    className={`${styles.actionBtn} ${styles.btnEmergency}`}
                    style={{ fontSize: '11px' }}
                    onClick={() => handleEmergencyIntervention('山田看護師')}
                  >
                    今すぐ対応
                  </button>
                </div>
              </div>
              <div className={styles.alertCard}>
                <div className={styles.alertPerson}>鈴木看護師（外科）</div>
                <div className={styles.alertMessage}>新人・適応困難・メンター必要</div>
                <div className={styles.alertAction}>
                  <button className={`${styles.actionBtn} ${styles.btnUrgent}`} style={{ fontSize: '11px' }}>
                    メンター配置
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.recommendedActions}>
            <div className={styles.actionsHeader}>
              <span style={{ fontSize: '20px' }}>💡</span>
              <h3 className={styles.actionsTitle}>推奨アクション</h3>
            </div>
            <div className={styles.actionList}>
              <div className={styles.recommendedCard}>
                <div className={styles.recommendedTitle}>ICU全体シフト見直し</div>
                <div className={styles.recommendedDesc}>4名がバーンアウト発症。構造的問題の可能性</div>
                <div className={styles.recommendedImpact}>
                  <span>影響: 42名</span>
                  <span>効果: 高</span>
                </div>
              </div>
              <div className={styles.recommendedCard}>
                <div className={styles.recommendedTitle}>メンタルヘルス研修実施</div>
                <div className={styles.recommendedDesc}>セルフケア能力向上プログラム</div>
                <div className={styles.recommendedImpact}>
                  <span>対象: 全職員</span>
                  <span>効果: 中</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.insightsPanel}>
            <div className={styles.insightsHeader}>
              <span style={{ fontSize: '20px' }}>📊</span>
              <h3 className={styles.insightsTitle}>リアルタイム分析</h3>
            </div>
            <div className={styles.insightMetrics}>
              <div className={styles.insightItem}>
                <div className={styles.insightValue}>26</div>
                <div className={styles.insightLabel}>緊急対応必要</div>
              </div>
              <div className={styles.insightItem}>
                <div className={styles.insightValue}>63</div>
                <div className={styles.insightLabel}>予防可能</div>
              </div>
              <div className={styles.insightItem}>
                <div className={styles.insightValue}>78%</div>
                <div className={styles.insightLabel}>介入成功率</div>
              </div>
              <div className={styles.insightItem}>
                <div className={styles.insightValue}>3.2M</div>
                <div className={styles.insightLabel}>予想損失回避</div>
              </div>
            </div>
            <div className={styles.progressIndicator}>
              <span style={{ fontSize: '12px', color: '#64748b' }}>組織健康度</span>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: '53%' }}></div>
              </div>
              <span className={styles.progressText}>53%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}