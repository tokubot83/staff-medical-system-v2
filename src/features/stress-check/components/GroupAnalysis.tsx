'use client'

import React from 'react'
import styles from './GroupAnalysis.module.css'

interface DepartmentData {
  id: string
  name: string
  implementationRate: number
  highStressRate: number
  workload: 'high' | 'medium' | 'low'
  relationships: 'good' | 'medium' | 'bad'
  support: 'good' | 'medium' | 'bad'
}

interface HighStressEmployee {
  id: string
  name: string
  department: string
  position: string
  stressScore: number
  previousScore: number
  risk: 'critical' | 'high' | 'medium'
  metrics: {
    overtime?: number
    fatigue?: string
    relationship?: string
    adaptation?: string
  }
}

export default function GroupAnalysis() {
  const departmentData: DepartmentData[] = [
    {
      id: '1',
      name: '営業部',
      implementationRate: 52,
      highStressRate: 22,
      workload: 'high',
      relationships: 'medium',
      support: 'good'
    },
    {
      id: '2',
      name: '開発部',
      implementationRate: 78,
      highStressRate: 18,
      workload: 'high',
      relationships: 'good',
      support: 'good'
    },
    {
      id: '3',
      name: '製造部',
      implementationRate: 38,
      highStressRate: 25,
      workload: 'medium',
      relationships: 'bad',
      support: 'medium'
    },
    {
      id: '4',
      name: '管理部',
      implementationRate: 85,
      highStressRate: 8,
      workload: 'low',
      relationships: 'good',
      support: 'good'
    },
    {
      id: '5',
      name: '人事部',
      implementationRate: 92,
      highStressRate: 12,
      workload: 'medium',
      relationships: 'good',
      support: 'good'
    }
  ]

  const highStressEmployees: HighStressEmployee[] = [
    {
      id: '1',
      name: '田中 太郎',
      department: '営業部',
      position: '主任',
      stressScore: 92,
      previousScore: 77,
      risk: 'critical',
      metrics: {
        overtime: 80,
      }
    },
    {
      id: '2',
      name: '佐藤 花子',
      department: '製造部',
      position: '係長',
      stressScore: 85,
      previousScore: 77,
      risk: 'high',
      metrics: {
        relationship: '要注意'
      }
    },
    {
      id: '3',
      name: '鈴木 一郎',
      department: '開発部',
      position: 'エンジニア',
      stressScore: 82,
      previousScore: 85,
      risk: 'high',
      metrics: {
        fatigue: '高'
      }
    },
    {
      id: '4',
      name: '山田 美咲',
      department: '営業部',
      position: '新入社員',
      stressScore: 78,
      previousScore: 0,
      risk: 'medium',
      metrics: {
        adaptation: '要支援'
      }
    }
  ]

  const getHeatmapClass = (value: number | string) => {
    if (typeof value === 'number') {
      if (value >= 80 || value <= 40) return styles.heatHigh
      if (value >= 60) return styles.heatMedium
      return styles.heatLow
    } else {
      if (value === 'high' || value === 'bad') return styles.heatHigh
      if (value === 'medium') return styles.heatMedium
      return styles.heatLow
    }
  }

  const getRiskBadgeClass = (risk: string) => {
    switch (risk) {
      case 'critical': return styles.badgeCritical
      case 'high': return styles.badgeHigh
      case 'medium': return styles.badgeMedium
      default: return ''
    }
  }

  return (
    <div className={styles.container}>
      {/* サマリーカード */}
      <div className={styles.summaryGrid}>
        <div className={`${styles.summaryCard} ${styles.green}`}>
          <div className={styles.summaryLabel}>
            <span>📈</span>
            <span>実施率</span>
          </div>
          <div className={styles.summaryValue}>68.4%</div>
          <div className={`${styles.summaryTrend} ${styles.trendUp}`}>
            <span>↑</span>
            <span>前年比 +12.3%</span>
          </div>
        </div>

        <div className={`${styles.summaryCard} ${styles.yellow}`}>
          <div className={styles.summaryLabel}>
            <span>⚠️</span>
            <span>高ストレス者率</span>
          </div>
          <div className={styles.summaryValue}>15.8%</div>
          <div className={`${styles.summaryTrend} ${styles.trendDown}`}>
            <span>↓</span>
            <span>前年比 -2.1%</span>
          </div>
        </div>

        <div className={`${styles.summaryCard} ${styles.red}`}>
          <div className={styles.summaryLabel}>
            <span>🚨</span>
            <span>要緊急対応</span>
          </div>
          <div className={styles.summaryValue}>24名</div>
          <div className={styles.summaryTrend}>
            <span>→</span>
            <span>面談実施率 42%</span>
          </div>
        </div>

        <div className={`${styles.summaryCard} ${styles.purple}`}>
          <div className={styles.summaryLabel}>
            <span>🎯</span>
            <span>健康リスク指数</span>
          </div>
          <div className={styles.summaryValue}>73.2</div>
          <div className={`${styles.summaryTrend} ${styles.trendUp}`}>
            <span>↑</span>
            <span>改善傾向</span>
          </div>
        </div>
      </div>

      <div className={styles.dashboardGrid}>
        {/* 部署別ヒートマップ */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitle}>
              <span>🗺️</span>
              <span>部署別ストレスヒートマップ</span>
            </div>
            <div className={styles.panelActions}>
              <button className={styles.actionBtn}>詳細</button>
              <button className={styles.actionBtn}>CSV</button>
            </div>
          </div>

          <div className={styles.heatmapContainer}>
            <table className={styles.heatmapTable}>
              <thead>
                <tr>
                  <th>部署</th>
                  <th>実施率</th>
                  <th>高ストレス率</th>
                  <th>仕事負担</th>
                  <th>人間関係</th>
                  <th>サポート</th>
                </tr>
              </thead>
              <tbody>
                {departmentData.map(dept => (
                  <tr key={dept.id}>
                    <td><strong>{dept.name}</strong></td>
                    <td>
                      <span className={`${styles.heatmapCell} ${getHeatmapClass(100 - dept.implementationRate)}`}>
                        {dept.implementationRate}%
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.heatmapCell} ${getHeatmapClass(dept.highStressRate)}`}>
                        {dept.highStressRate}%
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.heatmapCell} ${getHeatmapClass(dept.workload)}`}>
                        {dept.workload === 'high' ? '高' : dept.workload === 'medium' ? '中' : '低'}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.heatmapCell} ${getHeatmapClass(dept.relationships)}`}>
                        {dept.relationships === 'good' ? '良' : dept.relationships === 'medium' ? '中' : '悪'}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.heatmapCell} ${getHeatmapClass(dept.support)}`}>
                        {dept.support === 'good' ? '良' : dept.support === 'medium' ? '中' : '悪'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* リスクマトリックス */}
          <div className={styles.riskMatrixSection}>
            <div className={styles.panelTitle}>
              <span>⚡</span>
              <span>リスクマトリックス（影響度×発生確率）</span>
            </div>

            <div className={styles.riskMatrix}>
              <div className={styles.matrixLabel}>高</div>
              <div className={`${styles.matrixCell} ${styles.matrixMedium}`}>
                <div className={styles.matrixValue}>12</div>
                <div className={styles.matrixLabelText}>中リスク</div>
              </div>
              <div className={`${styles.matrixCell} ${styles.matrixHigh}`}>
                <div className={styles.matrixValue}>45</div>
                <div className={styles.matrixLabelText}>高リスク</div>
              </div>
              <div className={`${styles.matrixCell} ${styles.matrixCritical}`}>
                <div className={styles.matrixValue}>24</div>
                <div className={styles.matrixLabelText}>緊急対応</div>
              </div>

              <div className={styles.matrixLabel}>中</div>
              <div className={`${styles.matrixCell} ${styles.matrixLow}`}>
                <div className={styles.matrixValue}>156</div>
                <div className={styles.matrixLabelText}>低リスク</div>
              </div>
              <div className={`${styles.matrixCell} ${styles.matrixMedium}`}>
                <div className={styles.matrixValue}>89</div>
                <div className={styles.matrixLabelText}>中リスク</div>
              </div>
              <div className={`${styles.matrixCell} ${styles.matrixHigh}`}>
                <div className={styles.matrixValue}>67</div>
                <div className={styles.matrixLabelText}>高リスク</div>
              </div>

              <div className={styles.matrixLabel}>低</div>
              <div className={`${styles.matrixCell} ${styles.matrixLow}`}>
                <div className={styles.matrixValue}>412</div>
                <div className={styles.matrixLabelText}>健康</div>
              </div>
              <div className={`${styles.matrixCell} ${styles.matrixLow}`}>
                <div className={styles.matrixValue}>234</div>
                <div className={styles.matrixLabelText}>低リスク</div>
              </div>
              <div className={`${styles.matrixCell} ${styles.matrixMedium}`}>
                <div className={styles.matrixValue}>78</div>
                <div className={styles.matrixLabelText}>中リスク</div>
              </div>

              <div></div>
              <div className={styles.matrixLabel}>低</div>
              <div className={styles.matrixLabel}>中</div>
              <div className={styles.matrixLabel}>高</div>
            </div>
            <div className={styles.matrixAxisLabel}>ストレス強度 →</div>
          </div>
        </div>

        {/* 高ストレス者リスト */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitle}>
              <span>🔴</span>
              <span>要フォロー対象者</span>
            </div>
            <div className={styles.panelActions}>
              <button className={styles.actionBtn}>一括メール</button>
            </div>
          </div>

          <div className={styles.highStressList}>
            {highStressEmployees.map(employee => (
              <div key={employee.id} className={styles.stressItem}>
                <div className={styles.stressItemHeader}>
                  <div className={styles.employeeInfo}>
                    <div className={styles.employeeAvatar}>
                      {employee.name.charAt(0)}
                    </div>
                    <div className={styles.employeeDetails}>
                      <div className={styles.employeeName}>{employee.name}</div>
                      <div className={styles.employeeDept}>
                        {employee.department}・{employee.position}
                      </div>
                    </div>
                  </div>
                  <span className={`${styles.riskBadge} ${getRiskBadgeClass(employee.risk)}`}>
                    {employee.risk === 'critical' ? '緊急' : employee.risk === 'high' ? '高' : '中'}
                  </span>
                </div>
                <div className={styles.stressMetrics}>
                  <div className={styles.metricItem}>
                    <span>📊</span>
                    <span>スコア: {employee.stressScore}</span>
                  </div>
                  <div className={styles.metricItem}>
                    <span>📈</span>
                    <span>前回比: {employee.stressScore > employee.previousScore ? '+' : ''}{employee.stressScore - employee.previousScore}</span>
                  </div>
                  {employee.metrics.overtime && (
                    <div className={styles.metricItem}>
                      <span>⏰</span>
                      <span>残業: {employee.metrics.overtime}h/月</span>
                    </div>
                  )}
                  {employee.metrics.fatigue && (
                    <div className={styles.metricItem}>
                      <span>💤</span>
                      <span>疲労度: {employee.metrics.fatigue}</span>
                    </div>
                  )}
                  {employee.metrics.relationship && (
                    <div className={styles.metricItem}>
                      <span>👥</span>
                      <span>対人関係: {employee.metrics.relationship}</span>
                    </div>
                  )}
                  {employee.metrics.adaptation && (
                    <div className={styles.metricItem}>
                      <span>📚</span>
                      <span>適応: {employee.metrics.adaptation}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AIによる改善提案 */}
      <div className={styles.actionSuggestions}>
        <div className={styles.suggestionsHeader}>
          <span>💡</span>
          <h3 className={styles.suggestionsTitle}>AIによる改善提案（優先度順）</h3>
        </div>

        <div className={styles.suggestionList}>
          <div className={styles.suggestionItem}>
            <div className={styles.suggestionContent}>
              <div className={styles.suggestionText}>
                <strong>営業部の残業時間削減プログラム実施</strong>
              </div>
              <div className={styles.suggestionImpact}>
                予想効果：高ストレス者を22%→15%に削減可能
              </div>
            </div>
            <button className={styles.suggestionAction}>実施計画作成</button>
          </div>

          <div className={styles.suggestionItem}>
            <div className={styles.suggestionContent}>
              <div className={styles.suggestionText}>
                <strong>製造部での1on1面談強化（月2回実施）</strong>
              </div>
              <div className={styles.suggestionImpact}>
                予想効果：対人関係ストレスを40%改善
              </div>
            </div>
            <button className={styles.suggestionAction}>スケジュール設定</button>
          </div>

          <div className={styles.suggestionItem}>
            <div className={styles.suggestionContent}>
              <div className={styles.suggestionText}>
                <strong>新入社員向けメンター制度の導入</strong>
              </div>
              <div className={styles.suggestionImpact}>
                予想効果：適応期間を3ヶ月→2ヶ月に短縮
              </div>
            </div>
            <button className={styles.suggestionAction}>制度設計開始</button>
          </div>
        </div>
      </div>

      {/* エクスポート */}
      <div className={styles.exportSection}>
        <div className={styles.exportInfo}>
          労働基準監督署提出用レポートを生成できます
        </div>
        <div className={styles.exportButtons}>
          <button className={`${styles.exportBtn} ${styles.btnExcel}`}>
            <span>📊</span>
            <span>Excel出力</span>
          </button>
          <button className={`${styles.exportBtn} ${styles.btnPdf}`}>
            <span>📄</span>
            <span>PDF出力</span>
          </button>
          <button className={`${styles.exportBtn} ${styles.btnReport}`}>
            <span>📋</span>
            <span>報告書作成</span>
          </button>
        </div>
      </div>
    </div>
  )
}