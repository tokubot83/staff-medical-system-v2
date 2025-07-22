'use client'

import React from 'react'
import { Line, Bar, Radar, Scatter, Doughnut } from 'react-chartjs-2'
import styles from './StaffCards.module.css'

// 総合分析タブコンポーネント
export function AnalyticsTab({ selectedStaff }: { selectedStaff: any }) {
  if (!selectedStaff) {
    return (
      <div className={styles.noDataContainer}>
        <p>職員を選択してください</p>
      </div>
    )
  }

  const isNurse = selectedStaff?.position?.includes('看護師') || selectedStaff?.position?.includes('ナース')
  
  // タブ横断的統合分析チャート
  const crossTabAnalysisData = {
    labels: ['採用適合', '研修効果', '評価成長', '面談満足', '能力開発', '統合分析'],
    datasets: [{
      label: '現在値',
      data: [95, 88, 85, 92, 82, 87],
      borderColor: '#007bff',
      backgroundColor: 'rgba(0, 123, 255, 0.2)'
    }, {
      label: '目標値',
      data: [95, 95, 90, 95, 90, 93],
      borderColor: '#28a745',
      backgroundColor: 'rgba(40, 167, 69, 0.1)'
    }]
  }

  // 組織内ポジショニング分析チャート
  const organizationalPositionData = {
    datasets: [{
      label: selectedStaff.name,
      data: [{ x: 92, y: 85 }],
      backgroundColor: '#dc3545',
      pointRadius: 10
    }, {
      label: '同職種平均',
      data: [{ x: 72, y: 68 }],
      backgroundColor: '#6c757d',
      pointRadius: 6
    }, {
      label: '上位10%',
      data: [{ x: 88, y: 82 }],
      backgroundColor: '#28a745',
      pointRadius: 6
    }]
  }

  // 昇進後パフォーマンス予測チャート
  const promotionPredictionData = {
    labels: ['現在', '3ヶ月後', '6ヶ月後', '1年後', '2年後'],
    datasets: [{
      label: '管理スキル予測',
      data: [3.0, 3.4, 3.8, 4.2, 4.5],
      borderColor: '#007bff',
      backgroundColor: 'rgba(0, 123, 255, 0.1)',
      fill: true
    }, {
      label: '総合評価予測',
      data: [4.2, 4.3, 4.4, 4.5, 4.6],
      borderColor: '#28a745',
      backgroundColor: 'transparent'
    }]
  }

  // リスク分析・ROIチャート
  const riskAnalysisData = {
    labels: ['即時昇進', '6ヶ月後昇進', '1年後昇進'],
    datasets: [{
      label: '成功確率(%)',
      data: [65, 87, 95],
      backgroundColor: '#28a745',
      yAxisID: 'y'
    }, {
      label: 'ROI(%)',
      data: [180, 340, 280],
      backgroundColor: '#007bff',
      yAxisID: 'y1'
    }]
  }

  // 健康・勤務統合分析データ
  const healthWorkIntegrationData = {
    datasets: [{
      label: '健康スコア vs 生産性',
      data: [
        { x: 87, y: 85, r: 10 }, // 現在の状態
        { x: 75, y: 70, r: 8 },  // 3ヶ月前
        { x: 80, y: 78, r: 9 },  // 6ヶ月前
      ],
      backgroundColor: [
        'rgba(40, 167, 69, 0.6)',
        'rgba(255, 193, 7, 0.6)',
        'rgba(23, 162, 184, 0.6)'
      ]
    }]
  }

  // 退職リスク予測データ
  const retentionRiskData = {
    labels: ['総合リスクスコア', '給与満足度', 'キャリア不安', '業務負荷', '成長機会', '人間関係'],
    datasets: [{
      label: '現在の状態',
      data: [25, 80, 35, 40, 85, 90],
      borderColor: '#007bff',
      backgroundColor: 'rgba(0, 123, 255, 0.2)',
      pointBackgroundColor: '#007bff',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#007bff'
    }, {
      label: '警戒ライン',
      data: [50, 50, 50, 50, 50, 50],
      borderColor: '#dc3545',
      backgroundColor: 'rgba(220, 53, 69, 0.1)',
      borderDash: [5, 5]
    }]
  }

  return (
    <div className={styles.tabContentSection}>
      <div className={styles.sectionHeader}>
        <h2>📈 統合的戦略判断・エグゼクティブ分析</h2>
        <div className={styles.sectionActions}>
          <button className={styles.actionButton}>分析レポート</button>
          <button className={styles.actionButtonSecondary}>比較分析</button>
        </div>
      </div>

      <div className={styles.alertBox}>
        <span className={styles.alertIcon}>🎯</span>
        <strong>最終推奨:</strong> 2025年7月昇進が最適。準備期間6ヶ月で成功確率87%、ROI 340%の高い投資効果が期待できます。
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>93%</div>
          <div className={styles.statLabel}>戦略適合度</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>340%</div>
          <div className={styles.statLabel}>期待ROI</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>85%</div>
          <div className={styles.statLabel}>労働生産性</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>87</div>
          <div className={styles.statLabel}>総合健康スコア</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>25%</div>
          <div className={styles.statLabel}>退職リスク</div>
          <div className={styles.statSubtext}>低リスク</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>A+</div>
          <div className={styles.statLabel}>WLバランス</div>
          <div className={styles.statSubtext}>優秀</div>
        </div>
      </div>

      {isNurse && (
        <div className={styles.nurseSpecificSection}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>レベルⅣ</div>
              <div className={styles.statLabel}>JNAラダー現在</div>
              <div className={styles.statSubtext}>レベルⅤまで80%</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>92%</div>
              <div className={styles.statLabel}>スキル獲得率</div>
              <div className={styles.statSubtext}>看護技術13項目</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>156h</div>
              <div className={styles.statLabel}>年間研修時間</div>
              <div className={styles.statSubtext}>目標達成130%</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>48単位</div>
              <div className={styles.statLabel}>継続教育単位</div>
              <div className={styles.statSubtext}>更新まで12単位</div>
            </div>
          </div>
        </div>
      )}

      <div className={styles.chartGrid}>
        <div className={styles.chartContainer}>
          <h4>タブ横断的統合分析</h4>
          <div className={`${styles.alert} ${styles.alertInfo}`}>
            <span>📊</span>
            <span>6つの評価軸で総合的な人材価値を可視化。全項目で目標値の90%以上を達成しており、バランスの取れた成長を示しています。</span>
          </div>
          <div className={styles.chartWrapper}>
            <Radar data={crossTabAnalysisData} options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                r: { min: 0, max: 100 }
              }
            }} />
          </div>
        </div>
        <div className={styles.chartContainer}>
          <h4>組織内ポジショニング分析</h4>
          <div className={`${styles.alert} ${styles.alertSuccess}`}>
            <span>🎯</span>
            <span>パフォーマンス92点、ポテンシャル85点で上位10%圏内。次世代リーダー候補として有望な位置にいます。</span>
          </div>
          <div className={styles.chartWrapper}>
            <Scatter data={organizationalPositionData} options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: { title: { display: true, text: 'パフォーマンス' }, min: 60, max: 100 },
                y: { title: { display: true, text: 'ポテンシャル' }, min: 60, max: 100 }
              }
            }} />
          </div>
        </div>
      </div>

      <div className={styles.chartGrid}>
        <div className={styles.chartContainer}>
          <h4>昇進後パフォーマンス予測</h4>
          <div className={`${styles.alert} ${styles.alertInfo}`}>
            <span>📈</span>
            <span>AIによる予測では、昇進後2年以内に管理スキル4.5到達の可能性が高い。段階的な権限委譲が効果的です。</span>
          </div>
          <div className={styles.chartWrapper}>
            <Line data={promotionPredictionData} options={{
              responsive: true,
              maintainAspectRatio: false
            }} />
          </div>
        </div>
        <div className={styles.chartContainer}>
          <h4>リスク分析・ROI</h4>
          <div className={`${styles.alert} ${styles.alertSuccess}`}>
            <span>💰</span>
            <span>6ヶ月後昇進が最適解。成功確率87%、ROI340%で投資効果が最大化。即時昇進はリスクが高く推奨しません。</span>
          </div>
          <div className={styles.chartWrapper}>
            <Bar data={riskAnalysisData} options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  title: { display: true, text: '成功確率(%)' }
                },
                y1: {
                  type: 'linear',
                  display: true,
                  position: 'right',
                  title: { display: true, text: 'ROI(%)' },
                  grid: { drawOnChartArea: false }
                }
              }
            }} />
          </div>
        </div>
      </div>

      <div className={styles.chartGrid}>
        <div className={styles.chartContainer}>
          <h4>健康・勤務パフォーマンス相関分析</h4>
          <div className={`${styles.alert} ${styles.alertInfo}`}>
            <span>🏥</span>
            <span>健康スコアと労働生産性に強い正の相関（r=0.82）。健康管理投資が生産性向上に直結しています。</span>
          </div>
          <div className={styles.chartWrapper}>
            <Scatter data={healthWorkIntegrationData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      const labels = ['現在', '3ヶ月前', '6ヶ月前'];
                      return labels[context.dataIndex] + ': 健康 ' + context.parsed.x + ', 生産性 ' + context.parsed.y;
                    }
                  }
                }
              },
              scales: {
                x: {
                  title: { display: true, text: '健康スコア' },
                  min: 60,
                  max: 100
                },
                y: {
                  title: { display: true, text: '労働生産性' },
                  min: 60,
                  max: 100
                }
              }
            }} />
          </div>
        </div>
        <div className={styles.chartContainer}>
          <h4>退職リスク予測分析</h4>
          <div className={`${styles.alert} ${styles.alertSuccess}`}>
            <span>🛡️</span>
            <span>総合退職リスク25%（低リスク）。キャリア不安のみ要注意。適切なキャリアパス提示で更なるリスク低減可能。</span>
          </div>
          <div className={styles.chartWrapper}>
            <Radar data={retentionRiskData} options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                r: {
                  min: 0,
                  max: 100,
                  ticks: {
                    stepSize: 20
                  }
                }
              },
              plugins: {
                legend: {
                  position: 'bottom'
                }
              }
            }} />
          </div>
        </div>
      </div>

      <div className={styles.evaluationComments}>
        <h3>分析コメント</h3>
        <div className={styles.commentCard}>
          <div className={styles.commentHeader}>
            <span className={styles.commentAuthor}>人事部</span>
            <span className={styles.commentDate}>2025年1月</span>
          </div>
          <div className={styles.commentBody}>
            戦略適合度93%で昇進適性が高い。2025年7月の昇進に向けて、リーダーシップ研修の受講を推奨。
          </div>
        </div>
        <div className={styles.commentCard}>
          <div className={styles.commentHeader}>
            <span className={styles.commentAuthor}>経営企画部</span>
            <span className={styles.commentDate}>2025年1月</span>
          </div>
          <div className={styles.commentBody}>
            ROI 340%の投資効果が期待でき、組織への貢献度が高い人材。戦略的な配置が望まれる。
          </div>
        </div>
      </div>
    </div>
  )
}

// 人事評価タブコンポーネント
export function EvaluationTab({ selectedStaff }: { selectedStaff: any }) {
  if (!selectedStaff) {
    return (
      <div className={styles.noDataContainer}>
        <p>職員を選択してください</p>
      </div>
    )
  }

  const isNurse = selectedStaff?.position?.includes('看護師') || selectedStaff?.position?.includes('ナース')

  // 評価推移データ
  const evaluationTrendData = {
    labels: ['2023年上期', '2023年下期', '2024年上期', '2024年下期', '2025年上期'],
    datasets: [{
      label: '総合評価',
      data: [3.8, 4.0, 4.2, 4.3, 4.5],
      borderColor: '#007bff',
      backgroundColor: 'rgba(0, 123, 255, 0.1)',
      fill: true
    }]
  }

  // 多面評価レーダーチャート
  const multiEvaluationData = {
    labels: ['業務遂行力', 'チーム協調性', 'リーダーシップ', '問題解決力', 'コミュニケーション', '専門性'],
    datasets: [{
      label: '自己評価',
      data: [90, 85, 75, 88, 92, 95],
      borderColor: '#007bff',
      backgroundColor: 'rgba(0, 123, 255, 0.2)'
    }, {
      label: '上司評価',
      data: [85, 90, 80, 85, 88, 92],
      borderColor: '#28a745',
      backgroundColor: 'rgba(40, 167, 69, 0.2)'
    }, {
      label: '同僚評価',
      data: [88, 92, 78, 86, 95, 90],
      borderColor: '#ffc107',
      backgroundColor: 'rgba(255, 193, 7, 0.2)'
    }]
  }

  // JNAラダー達成度（看護師専用）
  const jnaAchievementData = {
    labels: ['看護実践', '看護管理', '看護教育', '看護研究', 'チーム医療', '倫理実践'],
    datasets: [{
      label: '現在達成度',
      data: [95, 85, 88, 75, 92, 90],
      borderColor: '#9b7cb6',
      backgroundColor: 'rgba(155, 124, 203, 0.2)'
    }, {
      label: 'レベルⅤ必要値',
      data: [95, 90, 90, 85, 95, 95],
      borderColor: '#dc3545',
      backgroundColor: 'rgba(220, 53, 69, 0.1)'
    }]
  }

  // 評価項目別成長度
  const evaluationGrowthData = {
    labels: ['専門性', 'コミュニケーション', 'リーダーシップ', '問題解決力', '協調性'],
    datasets: [{
      label: '2023年',
      data: [3.8, 4.0, 3.5, 3.6, 4.2],
      backgroundColor: 'rgba(255, 99, 132, 0.5)'
    }, {
      label: '2024年',
      data: [4.2, 4.3, 4.0, 4.1, 4.5],
      backgroundColor: 'rgba(54, 162, 235, 0.5)'
    }, {
      label: '2025年',
      data: [4.5, 4.5, 4.3, 4.4, 4.7],
      backgroundColor: 'rgba(75, 192, 192, 0.5)'
    }]
  }

  return (
    <div className={styles.tabContentSection}>
      <div className={styles.sectionHeader}>
        <h2>📊 人事評価・成長分析</h2>
        <div className={styles.sectionActions}>
          <button className={styles.actionButton}>評価入力</button>
          <button className={styles.actionButtonSecondary}>評価履歴</button>
        </div>
      </div>

      <div className={styles.interviewSummaryEnhanced}>
        <div className={styles.summaryMainCard}>
          <div className={styles.summaryCardHeader}>
            <span className={styles.summaryIcon}>📊</span>
            <h3>人事評価サマリー</h3>
          </div>
          <div className={styles.summaryMainMetrics}>
            <div className={styles.metricCircle}>
              <div className={styles.ladderLevelDisplay}>
                <div className={styles.currentLadderLevel}>
                  <div className={styles.levelIndicator}>評価</div>
                  <div className={styles.levelNumber}>A</div>
                  <div className={styles.levelSubtext}>2024年度総合評価</div>
                </div>
                <div className={styles.levelProgressBar}>
                  <div className={styles.levelProgressFill} style={{ width: '90%' }}></div>
                  <div className={styles.levelProgressText}>S評価まで 90%</div>
                </div>
                <div className={styles.currentTrainingStatus}>
                  <div className={styles.trainingStatusBadge}>評価期間中</div>
                  <div className={styles.trainingName}>目標達成率 95%</div>
                  <div className={styles.trainingPeriod}>2024年4月〜2025年3月</div>
                </div>
              </div>
              <div className={styles.metricDetails}>
                <div className={styles.detailItem}>
                  <span className={styles.detailIcon}>🎯</span>
                  <span className={styles.detailText}>3年連続A評価以上</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailIcon}>📈</span>
                  <span className={styles.detailText}>成長率部署内1位</span>
                </div>
              </div>
            </div>
            <div className={styles.metricsGrid}>
              <div className={styles.metricCardEnhanced}>
                <div className={styles.metricHeader}>
                  <span className={styles.metricIcon}>⭐</span>
                  <span className={styles.metricTrend}>+0.2</span>
                </div>
                <div className={styles.metricValue}>4.5/5.0</div>
                <div className={styles.metricLabel}>総合評価スコア</div>
                <div className={styles.metricProgress}>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: '90%' }}></div>
                  </div>
                  <span className={styles.progressText}>優秀評価</span>
                </div>
              </div>
              <div className={styles.metricCardEnhanced}>
                <div className={styles.metricHeader}>
                  <span className={styles.metricIcon}>🏆</span>
                  <span className={styles.metricTrend}>↑1</span>
                </div>
                <div className={styles.metricValue}>2位/15名</div>
                <div className={styles.metricLabel}>部署内順位</div>
                <div className={styles.ratingStars}>
                  <span className={styles.starFilled}>上位13%</span>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.evaluationBreakdown}>
            <h4 className={styles.breakdownTitle}>評価要素別スコア（根拠）</h4>
            <div className={styles.breakdownGrid}>
              <div className={styles.breakdownItem}>
                <div className={styles.breakdownHeader}>
                  <span className={styles.breakdownLabel}>業務遂行力</span>
                  <span className={styles.breakdownScore}>S (4.8)</span>
                </div>
                <div className={styles.breakdownBar}>
                  <div className={styles.breakdownFill} style={{ width: '96%', backgroundColor: '#10b981' }}></div>
                </div>
                <div className={styles.breakdownNote}>目標を大幅に超過達成、品質・効率共に優秀</div>
              </div>
              <div className={styles.breakdownItem}>
                <div className={styles.breakdownHeader}>
                  <span className={styles.breakdownLabel}>チームワーク</span>
                  <span className={styles.breakdownScore}>A (4.5)</span>
                </div>
                <div className={styles.breakdownBar}>
                  <div className={styles.breakdownFill} style={{ width: '90%', backgroundColor: '#3b82f6' }}></div>
                </div>
                <div className={styles.breakdownNote}>部署間連携で中心的役割、後輩指導も積極的</div>
              </div>
              <div className={styles.breakdownItem}>
                <div className={styles.breakdownHeader}>
                  <span className={styles.breakdownLabel}>リーダーシップ</span>
                  <span className={styles.breakdownScore}>A (4.3)</span>
                </div>
                <div className={styles.breakdownBar}>
                  <div className={styles.breakdownFill} style={{ width: '86%', backgroundColor: '#3b82f6' }}></div>
                </div>
                <div className={styles.breakdownNote}>プロジェクトリーダーとして2件成功、昇進候補</div>
              </div>
              <div className={styles.breakdownItem}>
                <div className={styles.breakdownHeader}>
                  <span className={styles.breakdownLabel}>改善・革新</span>
                  <span className={styles.breakdownScore}>A (4.4)</span>
                </div>
                <div className={styles.breakdownBar}>
                  <div className={styles.breakdownFill} style={{ width: '88%', backgroundColor: '#3b82f6' }}></div>
                </div>
                <div className={styles.breakdownNote}>業務改善提案3件実施、効率20%向上に貢献</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.summarySubCards}>
          <div className={styles.nextSessionCard}>
            <div className={styles.cardIconWrapper}>
              <span className={styles.cardIcon}>📅</span>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardTitle}>次回評価</div>
              <div className={styles.cardMainInfo}>3ヶ月後</div>
              <div className={styles.cardSubInfo}>2025年3月期 期末評価</div>
              <button className={styles.cardAction}>目標確認</button>
            </div>
          </div>
          
          <div className={styles.recentTopicsCard}>
            <div className={styles.cardIconWrapper}>
              <span className={styles.cardIcon}>🎯</span>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardTitle}>重点改善領域</div>
              <div className={styles.topicsList}>
                <span className={styles.topicTag}>戦略的思考</span>
                <span className={styles.topicTag}>部門間調整</span>
                <span className={styles.topicTag}>人材育成</span>
              </div>
              <div className={styles.cardSubInfo}>S評価達成への課題</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.chartGrid}>
        <div className={styles.chartContainer}>
          <h4>評価推移</h4>
          <div className={`${styles.alert} ${styles.alertSuccess}`}>
            <span>📈</span>
            <span>評価が安定的に上昇中（3.8→4.3）。3年連続A評価以上を維持しています。</span>
          </div>
          <div className={styles.chartWrapper}>
            <Line data={evaluationTrendData} options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  min: 1,
                  max: 5,
                  ticks: {
                    stepSize: 0.5
                  }
                }
              }
            }} />
          </div>
        </div>
        <div className={styles.chartContainer}>
          <h4>多面評価分析</h4>
          <div className={`${styles.alert} ${styles.alertInfo}`}>
            <span>👥</span>
            <span>自己評価と他者評価がほぼ一致。特にチームワークで高評価を得ています。</span>
          </div>
          <div className={styles.chartWrapper}>
            <Radar data={multiEvaluationData} options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                r: {
                  min: 0,
                  max: 100
                }
              }
            }} />
          </div>
        </div>
      </div>

      <div className={styles.chartGrid}>
        <div className={styles.chartContainer}>
          <h4>評価項目別成長度</h4>
          <div className={`${styles.alert} ${styles.alertSuccess}`}>
            <span>🌱</span>
            <span>全項目で前年度を上回る成長。特にリーダーシップが大幅改善（+0.8ポイント）。</span>
          </div>
          <div className={styles.chartWrapper}>
            <Bar data={evaluationGrowthData} options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  min: 0,
                  max: 5,
                  ticks: {
                    stepSize: 0.5
                  }
                }
              }
            }} />
          </div>
        </div>
      </div>

      {isNurse && (
        <div className={styles.nurseSpecificSection}>
          <h3>JNAキャリアラダー評価</h3>
          <div className={styles.chartContainer}>
            <div className={`${styles.alert} ${styles.alertWarning}`}>
              <span>🎯</span>
              <span>レベルⅣ認定済み。組織貢献の項目をさらに強化することでレベルⅤ達成が見込まれます。</span>
            </div>
            <div className={styles.chartWrapper}>
              <Radar data={jnaAchievementData} options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  r: {
                    min: 0,
                    max: 100
                  }
                }
              }} />
            </div>
          </div>
        </div>
      )}

      <div className={styles.evaluationComments}>
        <h3>評価コメント</h3>
        <div className={styles.commentCard}>
          <div className={styles.commentHeader}>
            <span className={styles.commentAuthor}>直属上司</span>
            <span className={styles.commentDate}>2025年1月</span>
          </div>
          <div className={styles.commentBody}>
            優れた業務遂行力とチーム協調性を持ち、後輩指導にも積極的。次期主任候補として期待。
          </div>
        </div>
      </div>
    </div>
  )
}

// 採用・配属タブコンポーネント
export function RecruitmentTab({ selectedStaff }: { selectedStaff: any }) {
  if (!selectedStaff) {
    return (
      <div className={styles.noDataContainer}>
        <p>職員を選択してください</p>
      </div>
    )
  }

  // 配属適性分析データ
  const departmentFitData = {
    labels: ['現部署', '内科', '外科', 'ICU', '救急', '外来'],
    datasets: [{
      label: '適性スコア',
      data: [95, 82, 78, 88, 75, 85],
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)',
        'rgba(255, 159, 64, 0.5)'
      ]
    }]
  }

  // キャリアパス予測
  const careerPathData = {
    labels: ['現在', '1年後', '3年後', '5年後', '10年後'],
    datasets: [{
      label: '管理職パス',
      data: [20, 40, 70, 90, 95],
      borderColor: '#007bff',
      backgroundColor: 'rgba(0, 123, 255, 0.1)'
    }, {
      label: '専門職パス',
      data: [20, 50, 75, 85, 90],
      borderColor: '#28a745',
      backgroundColor: 'rgba(40, 167, 69, 0.1)'
    }]
  }

  // 採用評価成熟度データ
  const recruitmentMaturityData = {
    labels: ['採用時', '3ヶ月', '6ヶ月', '1年', '2年', '3年', '現在'],
    datasets: [{
      label: '業務習熟度',
      data: [0, 30, 55, 75, 85, 92, 95],
      borderColor: '#007bff',
      backgroundColor: 'rgba(0, 123, 255, 0.1)',
      fill: true
    }, {
      label: '組織適応度',
      data: [0, 40, 65, 80, 88, 94, 96],
      borderColor: '#28a745',
      backgroundColor: 'rgba(40, 167, 69, 0.1)',
      fill: true
    }]
  }

  return (
    <div className={styles.tabContentSection}>
      <div className={styles.sectionHeader}>
        <h2>👥 採用・配属分析</h2>
        <div className={styles.sectionActions}>
          <button className={styles.actionButton}>配属シミュレーション</button>
          <button className={styles.actionButtonSecondary}>適性診断</button>
        </div>
      </div>

      <div className={styles.recruitmentInfo}>
        <div className={styles.infoCard}>
          <h3>採用情報</h3>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>入職日:</span>
            <span className={styles.infoValue}>{selectedStaff.joinDate || '2020年4月1日'}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>採用区分:</span>
            <span className={styles.infoValue}>新卒採用</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>配属履歴:</span>
            <span className={styles.infoValue}>3部署経験</span>
          </div>
        </div>
      </div>

      <div className={styles.chartGrid}>
        <div className={styles.chartContainer}>
          <h4>部署適性分析</h4>
          <div className={`${styles.alert} ${styles.alertInfo}`}>
            <span>🎯</span>
            <span>現在の部署適性は92%。長期的には管理部門や教育部門への適性も高い評価です。</span>
          </div>
          <div className={styles.chartWrapper}>
            <Bar data={departmentFitData} options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  min: 0,
                  max: 100
                }
              }
            }} />
          </div>
        </div>
        <div className={styles.chartContainer}>
          <h4>キャリアパス予測</h4>
          <div className={`${styles.alert} ${styles.alertSuccess}`}>
            <span>🚀</span>
            <span>5年後の管理職昇進確率72%。現在の成長ペースを維持すれば十分に達成可能です。</span>
          </div>
          <div className={styles.chartWrapper}>
            <Line data={careerPathData} options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  min: 0,
                  max: 100,
                  title: {
                    display: true,
                    text: '達成可能性(%)'
                  }
                }
              }
            }} />
          </div>
        </div>
      </div>

      <div className={styles.chartGrid}>
        <div className={styles.chartContainer}>
          <h4>採用後の成熟度推移</h4>
          <div className={`${styles.alert} ${styles.alertSuccess}`}>
            <span>🔥</span>
            <span>組織適応度が特に高く、3年でほぼ完全に成熟。優秀な成長曲線を描いています。</span>
          </div>
          <div className={styles.chartWrapper}>
            <Line data={recruitmentMaturityData} options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  min: 0,
                  max: 100,
                  title: {
                    display: true,
                    text: '成熟度(%)'
                  }
                }
              }
            }} />
          </div>
        </div>
      </div>

      <div className={styles.recommendationSection}>
        <h3>配属推奨</h3>
        <div className={styles.recommendationCard}>
          <div className={styles.recommendationHeader}>
            <span className={styles.recommendationBadge}>最適</span>
            <span className={styles.recommendationTitle}>現部署継続</span>
          </div>
          <div className={styles.recommendationBody}>
            現部署での適性が非常に高く、チーム内での重要な役割を担っています。
            主任昇進を視野に入れた育成を推奨します。
          </div>
        </div>
      </div>
    </div>
  )
}

// 面談・指導タブコンポーネント
export function InterviewTab({ selectedStaff }: { selectedStaff: any }) {
  if (!selectedStaff) {
    return (
      <div className={styles.noDataContainer}>
        <p>職員を選択してください</p>
      </div>
    )
  }

  // 面談実施状況
  const interviewFrequencyData = {
    labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
    datasets: [{
      label: '定期面談',
      data: [1, 0, 1, 0, 1, 0],
      backgroundColor: '#007bff'
    }, {
      label: 'フォロー面談',
      data: [0, 1, 0, 1, 0, 2],
      backgroundColor: '#28a745'
    }]
  }

  // 面談満足度推移
  const satisfactionTrendData = {
    labels: ['2024年Q1', '2024年Q2', '2024年Q3', '2024年Q4', '2025年Q1'],
    datasets: [{
      label: '面談満足度',
      data: [3.5, 3.8, 4.0, 4.2, 4.5],
      borderColor: '#007bff',
      backgroundColor: 'rgba(0, 123, 255, 0.1)',
      fill: true
    }]
  }

  // 話題分析円グラフデータ
  const topicAnalysisData = {
    labels: ['キャリア相談', '業務改善', '人間関係', '健康管理', 'スキル向上', 'その他'],
    datasets: [{
      data: [35, 25, 15, 10, 10, 5],
      backgroundColor: [
        'rgba(0, 123, 255, 0.8)',
        'rgba(40, 167, 69, 0.8)',
        'rgba(255, 193, 7, 0.8)',
        'rgba(220, 53, 69, 0.8)',
        'rgba(23, 162, 184, 0.8)',
        'rgba(108, 117, 125, 0.8)'
      ],
      borderColor: [
        'rgba(0, 123, 255, 1)',
        'rgba(40, 167, 69, 1)',
        'rgba(255, 193, 7, 1)',
        'rgba(220, 53, 69, 1)',
        'rgba(23, 162, 184, 1)',
        'rgba(108, 117, 125, 1)'
      ],
      borderWidth: 1
    }]
  }

  // 指導効果測定レーダーチャート
  const coachingEffectData = {
    labels: ['目標達成', 'モチベーション', 'スキル向上', '問題解決', '自己理解', '行動変容'],
    datasets: [{
      label: '指導前',
      data: [60, 65, 70, 55, 60, 50],
      borderColor: 'rgba(220, 53, 69, 0.8)',
      backgroundColor: 'rgba(220, 53, 69, 0.2)'
    }, {
      label: '指導後',
      data: [85, 90, 88, 82, 85, 80],
      borderColor: 'rgba(40, 167, 69, 0.8)',
      backgroundColor: 'rgba(40, 167, 69, 0.2)'
    }]
  }

  return (
    <div className={styles.tabContentSection}>
      <div className={styles.sectionHeader}>
        <h2>💬 面談・指導記録</h2>
        <div className={styles.sectionActions}>
          <button className={styles.actionButton}>面談予約</button>
          <button className={styles.actionButtonSecondary}>記録作成</button>
        </div>
      </div>

      <div className={styles.interviewSummaryEnhanced}>
        <div className={styles.summaryMainCard}>
          <div className={styles.summaryCardHeader}>
            <span className={styles.summaryIcon}>📊</span>
            <h3>面談実績サマリー</h3>
          </div>
          
          <div className={styles.interviewInsightsFullWidth}>
            <div className={styles.currentStatusCard}>
              <div className={styles.statusHeader}>
                <span className={styles.statusIcon}>🎯</span>
                <h4>現在の関心事・重点課題</h4>
              </div>
              <div className={styles.statusItemsGrid}>
                <div className={styles.statusItem}>
                  <div className={styles.itemHeader}>
                    <span className={styles.priorityBadge} style={{ backgroundColor: '#ef4444' }}>高</span>
                    <span className={styles.itemLabel}>キャリアパス不安</span>
                  </div>
                  <div className={styles.itemBarContainer}>
                    <div className={styles.itemBar} style={{ width: '90%', backgroundColor: '#ef4444' }}></div>
                    <span className={styles.itemPercentage}>90%</span>
                  </div>
                  <p className={styles.itemDescription}>昇進への道筋が不明確で将来像が描けない</p>
                </div>
                <div className={styles.statusItem}>
                  <div className={styles.itemHeader}>
                    <span className={styles.priorityBadge} style={{ backgroundColor: '#f59e0b' }}>中</span>
                    <span className={styles.itemLabel}>業務負荷調整</span>
                  </div>
                  <div className={styles.itemBarContainer}>
                    <div className={styles.itemBar} style={{ width: '70%', backgroundColor: '#f59e0b' }}></div>
                    <span className={styles.itemPercentage}>70%</span>
                  </div>
                  <p className={styles.itemDescription}>残業時間の増加と優先順位付けに苦慮</p>
                </div>
                <div className={styles.statusItem}>
                  <div className={styles.itemHeader}>
                    <span className={styles.priorityBadge} style={{ backgroundColor: '#3b82f6' }}>中</span>
                    <span className={styles.itemLabel}>スキル向上意欲</span>
                  </div>
                  <div className={styles.itemBarContainer}>
                    <div className={styles.itemBar} style={{ width: '60%', backgroundColor: '#3b82f6' }}></div>
                    <span className={styles.itemPercentage}>60%</span>
                  </div>
                  <p className={styles.itemDescription}>管理職に必要なスキルを身につけたい</p>
                </div>
                <div className={styles.statusItem}>
                  <div className={styles.itemHeader}>
                    <span className={styles.priorityBadge} style={{ backgroundColor: '#10b981' }}>低</span>
                    <span className={styles.itemLabel}>人間関係改善</span>
                  </div>
                  <div className={styles.itemBarContainer}>
                    <div className={styles.itemBar} style={{ width: '40%', backgroundColor: '#10b981' }}></div>
                    <span className={styles.itemPercentage}>40%</span>
                  </div>
                  <p className={styles.itemDescription}>チーム内コミュニケーションの活性化希望</p>
                </div>
              </div>
            </div>
            
            <div className={styles.recommendationPanel}>
              <h4>次回面談の推奨アプローチ</h4>
              <div className={styles.approachList}>
                <div className={styles.approachItem}>
                  <span className={styles.approachIcon}>1️⃣</span>
                  <div className={styles.approachContent}>
                    <strong>キャリアビジョンの明確化</strong>
                    <p>3-5年後の具体的な目標設定を支援し、必要なスキルと経験を整理</p>
                  </div>
                </div>
                <div className={styles.approachItem}>
                  <span className={styles.approachIcon}>2️⃣</span>
                  <div className={styles.approachContent}>
                    <strong>業務優先順位の見直し</strong>
                    <p>現在の業務を棚卸しし、効率的なタスク管理方法を一緒に検討</p>
                  </div>
                </div>
                <div className={styles.approachItem}>
                  <span className={styles.approachIcon}>3️⃣</span>
                  <div className={styles.approachContent}>
                    <strong>成長機会の提供</strong>
                    <p>管理職基礎研修への参加と、小規模プロジェクトのリーダー経験を提案</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.summaryMetricsRow}>
            <div className={styles.metricsGrid}>
              <div className={styles.metricCardEnhanced}>
                <div className={styles.metricHeader}>
                  <span className={styles.metricIcon}>💬</span>
                  <span className={styles.metricTrend}>+2</span>
                </div>
                <div className={styles.metricValue}>12回</div>
                <div className={styles.metricLabel}>年間面談回数</div>
                <div className={styles.metricProgress}>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: '100%' }}></div>
                  </div>
                  <span className={styles.progressText}>目標達成</span>
                </div>
              </div>
              <div className={styles.metricCardEnhanced}>
                <div className={styles.metricHeader}>
                  <span className={styles.metricIcon}>⭐</span>
                  <span className={styles.metricTrend}>+0.3</span>
                </div>
                <div className={styles.metricValue}>4.5/5.0</div>
                <div className={styles.metricLabel}>面談満足度</div>
                <div className={styles.ratingStars}>
                  <span className={styles.starFilled}>★★★★</span>
                  <span className={styles.starHalf}>★</span>
                </div>
              </div>
            </div>
            
            <div className={styles.summarySubCards}>
              <div className={styles.nextSessionCard}>
                <div className={styles.cardIconWrapper}>
                  <span className={styles.cardIcon}>📅</span>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.cardTitle}>次回面談</div>
                  <div className={styles.cardMainInfo}>2週間後</div>
                  <div className={styles.cardSubInfo}>2025年2月4日(火) 14:00</div>
                  <button className={styles.cardAction}>日程調整</button>
                </div>
              </div>
              
              <div className={styles.recentTopicsCard}>
                <div className={styles.cardIconWrapper}>
                  <span className={styles.cardIcon}>🔥</span>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.cardTitle}>直近の主要テーマ</div>
                  <div className={styles.topicsList}>
                    <span className={styles.topicTag}>キャリア相談</span>
                    <span className={styles.topicTag}>スキル向上</span>
                    <span className={styles.topicTag}>目標設定</span>
                  </div>
                  <div className={styles.cardSubInfo}>継続的な成長支援中</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.chartGrid}>
        <div className={styles.chartContainer}>
          <h4>面談実施状況</h4>
          <div className={`${styles.alert} ${styles.alertWarning}`}>
            <span>⚠️</span>
            <span>定期面談は予定通り実施。フォロー面談の頻度を増やすことで、さらなる成長支援が可能です。</span>
          </div>
          <div className={styles.chartWrapper}>
            <Bar data={interviewFrequencyData} options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  stacked: true
                },
                y: {
                  stacked: true
                }
              }
            }} />
          </div>
        </div>
        <div className={styles.chartContainer}>
          <h4>面談満足度推移</h4>
          <div className={`${styles.alert} ${styles.alertSuccess}`}>
            <span>✨</span>
            <span>満足度が継続的に向上（3.5→4.5）。職員との信頼関係が着実に構築されています。</span>
          </div>
          <div className={styles.chartWrapper}>
            <Line data={satisfactionTrendData} options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  min: 1,
                  max: 5
                }
              }
            }} />
          </div>
        </div>
      </div>

      <div className={styles.chartGrid}>
        <div className={styles.chartContainer}>
          <h4>話題分析</h4>
          <div className={`${styles.alert} ${styles.alertInfo}`}>
            <span>💡</span>
            <span>キャリア相談が35%で最多。今後の育成計画では業務改善やスキル向上の話題を増やすことを推奨します。</span>
          </div>
          <div className={styles.chartWrapper}>
            <Doughnut data={topicAnalysisData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'right'
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      const label = context.label || '';
                      const value = context.parsed || 0;
                      return label + ': ' + value + '%';
                    }
                  }
                }
              }
            }} />
          </div>
        </div>
        <div className={styles.chartContainer}>
          <h4>指導効果測定</h4>
          <div className={`${styles.alert} ${styles.alertSuccess}`}>
            <span>📈</span>
            <span>全項目で大幅改善。特にモチベーション向上が顕著（+25ポイント）。継続的な指導の成果が表れています。</span>
          </div>
          <div className={styles.chartWrapper}>
            <Radar data={coachingEffectData} options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                r: {
                  min: 0,
                  max: 100,
                  ticks: {
                    stepSize: 20
                  }
                }
              }
            }} />
          </div>
        </div>
      </div>

      <div className={styles.interviewHistory}>
        <h3>最近の面談記録</h3>
        <div className={styles.historyItem}>
          <div className={styles.historyHeader}>
            <span className={styles.historyDate}>2025年1月10日</span>
            <span className={styles.historyType}>定期面談</span>
          </div>
          <div className={styles.historyContent}>
            <strong>議題:</strong> キャリアプラン相談<br />
            <strong>内容:</strong> 主任昇進に向けた準備について。管理スキル向上のための研修参加を推奨。
          </div>
        </div>
      </div>
    </div>
  )
}

// 能力開発タブコンポーネント
export function DevelopmentTab({ selectedStaff }: { selectedStaff: any }) {
  if (!selectedStaff) {
    return (
      <div className={styles.noDataContainer}>
        <p>職員を選択してください</p>
      </div>
    )
  }

  // スキル成長推移
  const skillGrowthData = {
    labels: ['2023年', '2024年上期', '2024年下期', '2025年'],
    datasets: [{
      label: '技術スキル',
      data: [70, 80, 85, 90],
      borderColor: '#007bff',
      backgroundColor: 'rgba(0, 123, 255, 0.1)'
    }, {
      label: 'マネジメントスキル',
      data: [50, 65, 75, 82],
      borderColor: '#28a745',
      backgroundColor: 'rgba(40, 167, 69, 0.1)'
    }, {
      label: 'コミュニケーション',
      data: [75, 82, 88, 92],
      borderColor: '#ffc107',
      backgroundColor: 'rgba(255, 193, 7, 0.1)'
    }]
  }

  // スキルギャップ分析
  const skillGapData = {
    labels: ['リーダーシップ', 'プロジェクト管理', '戦略立案', 'データ分析', '人材育成'],
    datasets: [{
      label: '現在レベル',
      data: [75, 68, 60, 82, 88],
      backgroundColor: 'rgba(54, 162, 235, 0.5)'
    }, {
      label: '必要レベル',
      data: [90, 85, 80, 85, 90],
      backgroundColor: 'rgba(255, 99, 132, 0.5)'
    }]
  }


  return (
    <div className={styles.tabContentSection}>
      <div className={styles.sectionHeader}>
        <h2>🚀 能力開発・スキル向上</h2>
        <div className={styles.sectionActions}>
          <button className={styles.actionButton}>開発計画作成</button>
          <button className={styles.actionButtonSecondary}>スキル診断</button>
        </div>
      </div>

      <div className={styles.interviewSummaryEnhanced}>
        <div className={styles.summaryMainCard}>
          <div className={styles.summaryCardHeader}>
            <span className={styles.summaryIcon}>🎯</span>
            <h3>能力開発サマリー</h3>
          </div>
          <div className={styles.summaryMainMetrics}>
            <div className={styles.careerDirectionSection}>
              <div className={styles.directionDisplay}>
                <div className={styles.directionLetter}>T</div>
                <div className={styles.directionLabel}>技術専門職志向</div>
              </div>
              <div className={styles.directionDetails}>
                <div className={styles.directionType}>キャリアタイプ</div>
                <div className={styles.directionBreakdown}>
                  <div className={styles.breakdownItem}>
                    <span className={styles.breakdownIcon}>🔧</span>
                    <span className={styles.breakdownLabel}>専門技術: 45%</span>
                  </div>
                  <div className={styles.breakdownItem}>
                    <span className={styles.breakdownIcon}>👥</span>
                    <span className={styles.breakdownLabel}>管理職: 35%</span>
                  </div>
                  <div className={styles.breakdownItem}>
                    <span className={styles.breakdownIcon}>🎓</span>
                    <span className={styles.breakdownLabel}>スペシャリスト: 15%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.metricsGrid}>
              <div className={styles.metricCardEnhanced}>
                <div className={styles.metricValue}>レベル4</div>
                <div className={styles.metricLabel}>現在の到達段階</div>
                <div className={styles.metricSubtext}>次段階まで 80%</div>
              </div>
              <div className={styles.metricCardEnhanced}>
                <div className={styles.metricValue}>92%</div>
                <div className={styles.metricLabel}>スキル成長率</div>
                <div className={styles.metricSubtext}>年間目標達成</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.summarySubCards}>
          <div className={styles.nextSessionCard}>
            <div className={styles.cardIconWrapper}>
              <span className={styles.cardIcon}>🎯</span>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardTitle}>推奨キャリアパス</div>
              <div className={styles.cardMainInfo}>技術リーダー</div>
              <div className={styles.cardSubInfo}>3-5年後の目標ポジション</div>
              <button className={styles.cardAction}>詳細確認</button>
            </div>
          </div>
          
          <div className={styles.recentTopicsCard}>
            <div className={styles.cardIconWrapper}>
              <span className={styles.cardIcon}>📊</span>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardTitle}>重点開発領域</div>
              <div className={styles.topicsList}>
                <span className={styles.topicTag}>高度専門技術</span>
                <span className={styles.topicTag}>プロジェクト管理</span>
                <span className={styles.topicTag}>後輩指導</span>
              </div>
              <div className={styles.cardSubInfo}>次期目標達成に向けて</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.chartGrid}>
        <div className={styles.chartContainer}>
          <h4>スキル成長推移</h4>
          <div className={`${styles.alert} ${styles.alertSuccess}`}>
            <span>🚀</span>
            <span>全スキルで着実な成長を記録。特にマネジメントスキルが前年比32%向上し、管理職への準備が順調です。</span>
          </div>
          <div className={styles.chartWrapper}>
            <Line data={skillGrowthData} options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  min: 0,
                  max: 100
                }
              }
            }} />
          </div>
        </div>
        <div className={styles.chartContainer}>
          <h4>スキルギャップ分析</h4>
          <div className={`${styles.alert} ${styles.alertWarning}`}>
            <span>🎯</span>
            <span>戦略立案とプロジェクト管理に20ポイント以上のギャップ。実践的な経験を積む機会の提供が必要です。</span>
          </div>
          <div className={styles.chartWrapper}>
            <Bar data={skillGapData} options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  min: 0,
                  max: 100
                }
              }
            }} />
          </div>
        </div>
      </div>


      <div className={styles.developmentPlan}>
        <h3>個別開発計画</h3>
        <div className={styles.planTimeline}>
          <div className={styles.timelineItem}>
            <div className={styles.timelinePeriod}>2025年Q1</div>
            <div className={styles.timelineContent}>
              <strong>高度専門技術研修</strong>
              <p>専門分野における最新技術の習得</p>
            </div>
          </div>
          <div className={styles.timelineItem}>
            <div className={styles.timelinePeriod}>2025年Q2</div>
            <div className={styles.timelineContent}>
              <strong>プロジェクト管理実践</strong>
              <p>実際のプロジェクトをリードし、実践力向上</p>
            </div>
          </div>
          <div className={styles.timelineItem}>
            <div className={styles.timelinePeriod}>2025年Q3</div>
            <div className={styles.timelineContent}>
              <strong>後輩指導プログラム</strong>
              <p>メンター制度を通じた指導力強化</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.evaluationComments}>
        <h3>開発コメント</h3>
        <div className={styles.commentCard}>
          <div className={styles.commentHeader}>
            <span className={styles.commentAuthor}>能力開発担当</span>
            <span className={styles.commentDate}>2025年1月</span>
          </div>
          <div className={styles.commentBody}>
            専門技術への強い志向性と高い成長率を示しています。技術リーダーとしての道筋が明確で、3-5年後の昇進が期待できます。
          </div>
        </div>
        <div className={styles.commentCard}>
          <div className={styles.commentHeader}>
            <span className={styles.commentAuthor}>キャリアアドバイザー</span>
            <span className={styles.commentDate}>2025年1月</span>
          </div>
          <div className={styles.commentBody}>
            技術専門職と管理職の両方に適性があります。まずは技術リーダーとして経験を積み、その後の選択肢を広げることを推奨します。
          </div>
        </div>
      </div>
    </div>
  )
}

// 教育・研修タブコンポーネント
export function EducationTab({ selectedStaff }: { selectedStaff: any }) {
  if (!selectedStaff) {
    return (
      <div className={styles.noDataContainer}>
        <p>職員を選択してください</p>
      </div>
    )
  }

  const isNurse = selectedStaff?.position?.includes('看護師') || selectedStaff?.position?.includes('ナース')

  // 研修参加実績
  const trainingParticipationData = {
    labels: ['必須研修', '専門研修', 'リーダー研修', '外部研修', 'eラーニング'],
    datasets: [{
      label: '参加時間',
      data: [48, 36, 24, 16, 32],
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)'
      ]
    }]
  }

  // 研修効果測定
  const trainingEffectData = {
    labels: ['知識習得', '実践応用', '行動変容', '成果創出'],
    datasets: [{
      label: '達成度',
      data: [90, 85, 78, 82],
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  }

  // 看護師専用：JNAラダー研修進捗
  const jnaTrainingData = {
    labels: ['基礎看護技術', '専門看護実践', '看護管理', '看護教育', '看護研究', '倫理実践'],
    datasets: [{
      label: '修了率',
      data: [100, 95, 85, 88, 75, 90],
      backgroundColor: 'rgba(155, 124, 203, 0.5)',
      borderColor: 'rgba(155, 124, 203, 1)',
      borderWidth: 1
    }]
  }

  // JNAキャリアラダーレベル経過グラフ
  const jnaLadderProgressData = {
    labels: ['2020年', '2021年', '2022年', '2023年', '2024年', '2025年(現在)'],
    datasets: [{
      label: 'JNAラダーレベル',
      data: [1, 2, 2, 3, 4, 4],
      borderColor: 'rgba(155, 124, 182, 1)',
      backgroundColor: 'rgba(155, 124, 182, 0.2)',
      fill: true,
      tension: 0.4,
      pointRadius: 6,
      pointHoverRadius: 8,
      pointBackgroundColor: 'rgba(155, 124, 182, 1)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2
    }]
  }

  if (isNurse) {
    return (
      <div className={styles.tabContentSection}>
        <div className={styles.sectionHeader}>
          <h2>🎓 看護師教育・研修（JNAキャリアラダー）</h2>
          <div className={styles.sectionActions}>
            <button className={styles.actionButton}>研修申込</button>
            <button className={styles.actionButtonSecondary}>学習履歴</button>
          </div>
        </div>

        <div className={styles.interviewSummaryEnhanced}>
          <div className={styles.summaryMainCard}>
            <div className={styles.summaryCardHeader}>
              <span className={styles.summaryIcon}>📊</span>
              <h3>JNA研修実績サマリー</h3>
            </div>
            <div className={styles.summaryMainMetrics}>
              <div className={styles.metricCircle}>
                <div className={styles.ladderLevelDisplay}>
                  <div className={styles.currentLadderLevel}>
                    <div className={styles.levelIndicator}>レベル</div>
                    <div className={styles.levelNumber}>Ⅳ</div>
                    <div className={styles.levelSubtext}>現在のラダーレベル</div>
                  </div>
                  <div className={styles.levelProgressBar}>
                    <div className={styles.levelProgressFill} style={{ width: '80%' }}></div>
                    <div className={styles.levelProgressText}>レベルⅤまで 80%</div>
                  </div>
                  <div className={styles.currentTrainingStatus}>
                    <div className={styles.trainingStatusBadge}>受講中</div>
                    <div className={styles.trainingName}>高度看護実践研修</div>
                    <div className={styles.trainingPeriod}>2025年1月〜3月</div>
                  </div>
                </div>
                <div className={styles.metricDetails}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailIcon}>🎯</span>
                    <span className={styles.detailText}>レベルⅣ達成</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailIcon}>📈</span>
                    <span className={styles.detailText}>組織内上位20%</span>
                  </div>
                </div>
              </div>
              <div className={styles.metricsGrid}>
                <div className={styles.metricCardEnhanced}>
                  <div className={styles.metricHeader}>
                    <span className={styles.metricIcon}>📚</span>
                    <span className={styles.metricTrend}>+36h</span>
                  </div>
                  <div className={styles.metricValue}>156時間</div>
                  <div className={styles.metricLabel}>年間研修時間</div>
                  <div className={styles.metricProgress}>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: '130%' }}></div>
                    </div>
                    <span className={styles.progressText}>目標超過</span>
                  </div>
                </div>
                <div className={styles.metricCardEnhanced}>
                  <div className={styles.metricHeader}>
                    <span className={styles.metricIcon}>🎓</span>
                    <span className={styles.metricTrend}>+12</span>
                  </div>
                  <div className={styles.metricValue}>48単位</div>
                  <div className={styles.metricLabel}>継続教育単位</div>
                  <div className={styles.ratingStars}>
                    <span className={styles.starFilled}>更新まで12単位</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.summarySubCards}>
            <div className={styles.nextSessionCard}>
              <div className={styles.cardIconWrapper}>
                <span className={styles.cardIcon}>📅</span>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.cardTitle}>次回研修</div>
                <div className={styles.cardMainInfo}>2週間後</div>
                <div className={styles.cardSubInfo}>高度看護実践研修</div>
                <button className={styles.cardAction}>詳細確認</button>
              </div>
            </div>
            
            <div className={styles.recentTopicsCard}>
              <div className={styles.cardIconWrapper}>
                <span className={styles.cardIcon}>🔥</span>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.cardTitle}>重点強化領域</div>
                <div className={styles.topicsList}>
                  <span className={styles.topicTag}>看護管理</span>
                  <span className={styles.topicTag}>看護研究</span>
                  <span className={styles.topicTag}>教育指導</span>
                </div>
                <div className={styles.cardSubInfo}>レベルⅤ達成に向けて</div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.jnaLadderSection}>
          <div className={styles.ladderProgress}>
            <h3>JNAキャリアラダー進捗</h3>
            <div className={styles.ladderLevel}>
              <div className={styles.currentLevel}>レベルⅣ</div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: '80%' }}></div>
              </div>
              <div className={styles.nextLevel}>レベルⅤ</div>
            </div>
          </div>
        </div>

        <div className={styles.chartGrid}>
          <div className={styles.chartContainer}>
            <h4>JNAキャリアラダーレベル経過</h4>
            <div className={`${styles.alert} ${styles.alertSuccess}`}>
              <span>📈</span>
              <span>2年間で2レベル向上。組織内でもトップクラスの成長速度を記録しています。</span>
            </div>
            <div className={styles.chartWrapper}>
              <Line data={jnaLadderProgressData} options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    min: 0,
                    max: 5,
                    ticks: {
                      stepSize: 1,
                      callback: function(value: string | number) {
                        const levels = ['', 'レベルⅠ', 'レベルⅡ', 'レベルⅢ', 'レベルⅣ', 'レベルⅤ'];
                        return levels[Number(value)] || '';
                      }
                    }
                  }
                },
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function(context: any) {
                        const levels = ['', 'レベルⅠ', 'レベルⅡ', 'レベルⅢ', 'レベルⅣ', 'レベルⅤ'];
                        return levels[context.parsed.y] || '';
                      }
                    }
                  }
                }
              }} />
            </div>
          </div>
          <div className={styles.chartContainer}>
            <h4>研修カテゴリ別実績</h4>
            <div className={`${styles.alert} ${styles.alertInfo}`}>
              <span>📚</span>
              <span>必須研修48時間、専門研修36時間を完了。バランス良く各分野の研修を受講し、総合的なスキルアップを図っています。</span>
            </div>
            <div className={styles.chartWrapper}>
              <Doughnut data={trainingParticipationData} options={{
                responsive: true,
                maintainAspectRatio: false
              }} />
            </div>
          </div>
        </div>

        <div className={styles.chartGrid}>
          <div className={styles.chartContainer}>
            <h4>JNA領域別研修進捗</h4>
            <div className={`${styles.alert} ${styles.alertInfo}`}>
              <span>📊</span>
              <span>6分野のスキル獲得状況。管理業務と研究活動が今後の重点強化領域です。</span>
            </div>
            <div className={styles.chartWrapper}>
              <Bar data={jnaTrainingData} options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    min: 0,
                    max: 100
                  }
                }
              }} />
            </div>
          </div>
          <div className={styles.chartContainer}>
            <h4>研修効果測定</h4>
            <div className={`${styles.alert} ${styles.alertSuccess}`}>
              <span>✅</span>
              <span>研修前後で平均20ポイント以上の成長を確認。研修プログラムの有効性が実証されています。</span>
            </div>
            <div className={styles.chartWrapper}>
              <Bar data={trainingEffectData} options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    min: 0,
                    max: 100
                  }
                }
              }} />
            </div>
          </div>
        </div>

        <div className={styles.nurseTrainingPlan}>
          <h3>JNAラダーレベルⅤ達成計画</h3>
          <div className={styles.trainingList}>
            <div className={styles.trainingItem}>
              <div className={styles.trainingStatus}>進行中</div>
              <div className={styles.trainingInfo}>
                <div className={styles.trainingTitle}>高度看護実践研修</div>
                <div className={styles.trainingDetails}>複雑な臨床判断と高度な看護技術の習得</div>
              </div>
            </div>
            <div className={styles.trainingItem}>
              <div className={styles.trainingStatus}>予定</div>
              <div className={styles.trainingInfo}>
                <div className={styles.trainingTitle}>看護研究方法論</div>
                <div className={styles.trainingDetails}>エビデンスに基づく看護実践の推進</div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.evaluationComments}>
          <h3>研修コメント</h3>
          <div className={styles.commentCard}>
            <div className={styles.commentHeader}>
              <span className={styles.commentAuthor}>看護部教育担当</span>
              <span className={styles.commentDate}>2025年1月</span>
            </div>
            <div className={styles.commentBody}>
              JNAラダーレベルⅣの実践能力を十分に発揮。レベルⅤ達成に向けて、管理・教育分野の強化を推奨。
            </div>
          </div>
          <div className={styles.commentCard}>
            <div className={styles.commentHeader}>
              <span className={styles.commentAuthor}>研修委員会</span>
              <span className={styles.commentDate}>2025年1月</span>
            </div>
            <div className={styles.commentBody}>
              年間研修時間156時間で目標を大幅に達成。継続教育への意欲が高く、後輩指導でも成果を上げている。
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 看護師以外の場合
  // 年間研修計画進捗データ
  const annualTrainingPlanData = {
    labels: ['4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', '1月', '2月', '3月'],
    datasets: [{
      label: '計画',
      data: [2, 1, 2, 1, 0, 2, 1, 2, 1, 1, 2, 1],
      backgroundColor: 'rgba(220, 53, 69, 0.5)'
    }, {
      label: '実施済み',
      data: [2, 1, 2, 1, 0, 2, 1, 2, 1, 1, 0, 0],
      backgroundColor: 'rgba(40, 167, 69, 0.5)'
    }]
  }

  // 研修分野別成長度
  const trainingGrowthByAreaData = {
    labels: ['専門技術', '管理・指導', '安全管理', '多職種連携', '法令・倫理'],
    datasets: [{
      label: '研修前',
      data: [65, 50, 70, 60, 55],
      backgroundColor: 'rgba(255, 99, 132, 0.5)'
    }, {
      label: '研修後',
      data: [88, 75, 90, 85, 78],
      backgroundColor: 'rgba(75, 192, 192, 0.5)'
    }]
  }

  return (
    <div className={styles.tabContentSection}>
      <div className={styles.sectionHeader}>
        <h2>🎓 教育・研修管理</h2>
        <div className={styles.sectionActions}>
          <button className={styles.actionButton}>研修申込</button>
          <button className={styles.actionButtonSecondary}>学習履歴</button>
        </div>
      </div>

      <div className={styles.interviewSummaryEnhanced}>
        <div className={styles.summaryMainCard}>
          <div className={styles.summaryCardHeader}>
            <span className={styles.summaryIcon}>📊</span>
            <h3>研修実績サマリー</h3>
          </div>
          <div className={styles.summaryMainMetrics}>
            <div className={styles.metricCircle}>
              <div className={styles.skillLevelDisplay}>
                <div className={styles.currentSkillStatus}>
                  <div className={styles.skillLevelTitle}>現在のスキルレベル</div>
                  <div className={styles.skillLevelMain}>
                    <span className={styles.skillLevel}>中級</span>
                    <span className={styles.skillArrow}>→</span>
                    <span className={styles.targetLevel}>上級</span>
                  </div>
                  <div className={styles.skillProgressBar}>
                    <div className={styles.skillProgressFill} style={{ width: '65%' }}></div>
                    <div className={styles.skillProgressText}>昇格まで 35%</div>
                  </div>
                </div>
                <div className={styles.currentLearningStatus}>
                  <div className={styles.learningBadge}>受講中</div>
                  <div className={styles.learningInfo}>
                    <div className={styles.learningTitle}>管理職基礎研修</div>
                    <div className={styles.learningProgress}>進捗: 3/5 モジュール完了</div>
                  </div>
                </div>
              </div>
              <div className={styles.metricDetails}>
                <div className={styles.detailItem}>
                  <span className={styles.detailIcon}>↗️</span>
                  <span className={styles.detailText}>前年比 +15%</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailIcon}>🎯</span>
                  <span className={styles.detailText}>目標達成見込み</span>
                </div>
              </div>
            </div>
            <div className={styles.metricsGrid}>
              <div className={styles.metricCardEnhanced}>
                <div className={styles.metricHeader}>
                  <span className={styles.metricIcon}>📚</span>
                  <span className={styles.metricTrend}>+36h</span>
                </div>
                <div className={styles.metricValue}>156時間</div>
                <div className={styles.metricLabel}>年間研修時間</div>
                <div className={styles.metricProgress}>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: '130%' }}></div>
                  </div>
                  <span className={styles.progressText}>目標超過</span>
                </div>
              </div>
              <div className={styles.metricCardEnhanced}>
                <div className={styles.metricHeader}>
                  <span className={styles.metricIcon}>⭐</span>
                  <span className={styles.metricTrend}>+0.2</span>
                </div>
                <div className={styles.metricValue}>4.5/5.0</div>
                <div className={styles.metricLabel}>理解度評価</div>
                <div className={styles.ratingStars}>
                  <span className={styles.starFilled}>★★★★</span>
                  <span className={styles.starHalf}>★</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.summarySubCards}>
          <div className={styles.nextSessionCard}>
            <div className={styles.cardIconWrapper}>
              <span className={styles.cardIcon}>📅</span>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardTitle}>次回研修</div>
              <div className={styles.cardMainInfo}>3週間後</div>
              <div className={styles.cardSubInfo}>管理職基礎研修</div>
              <button className={styles.cardAction}>詳細確認</button>
            </div>
          </div>
          
          <div className={styles.recentTopicsCard}>
            <div className={styles.cardIconWrapper}>
              <span className={styles.cardIcon}>🔥</span>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardTitle}>重点強化分野</div>
              <div className={styles.topicsList}>
                <span className={styles.topicTag}>リーダーシップ</span>
                <span className={styles.topicTag}>戦略立案</span>
                <span className={styles.topicTag}>財務知識</span>
              </div>
              <div className={styles.cardSubInfo}>管理職昇進に向けて</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.chartGrid}>
        <div className={styles.chartContainer}>
          <h4>研修参加実績</h4>
          <div className={`${styles.alert} ${styles.alertInfo}`}>
            <span>📖</span>
            <span>研修修了率は85%で順調。参加予定の研修も予定通り進捧。継続的な学びの姿勢が評価されています。</span>
          </div>
          <div className={styles.chartWrapper}>
            <Doughnut data={trainingParticipationData} options={{
              responsive: true,
              maintainAspectRatio: false
            }} />
          </div>
        </div>
        <div className={styles.chartContainer}>
          <h4>研修効果測定</h4>
          <div className={`${styles.alert} ${styles.alertSuccess}`}>
            <span>✅</span>
            <span>研修前後で平均20ポイント以上の成長を確認。研修プログラムの有効性が実証されています。</span>
          </div>
          <div className={styles.chartWrapper}>
            <Bar data={trainingEffectData} options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  min: 0,
                  max: 100
                }
              }
            }} />
          </div>
        </div>
      </div>

      <div className={styles.chartGrid}>
        <div className={styles.chartContainer}>
          <h4>年間研修計画進捗</h4>
          <div className={`${styles.alert} ${styles.alertWarning}`}>
            <span>📅</span>
            <span>今年度の研修計画は75%完了。残り3ヶ月で2つの必須研修が未完了。計画的な受講を推奨します。</span>
          </div>
          <div className={styles.chartWrapper}>
            <Bar data={annualTrainingPlanData} options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  stacked: false
                },
                y: {
                  beginAtZero: true,
                  max: 3
                }
              }
            }} />
          </div>
        </div>
        <div className={styles.chartContainer}>
          <h4>研修分野別成長度</h4>
          <div className={`${styles.alert} ${styles.alertInfo}`}>
            <span>🎯</span>
            <span>全分野で成長を確認。特に安全管理分野で顕著な伸び（+20ポイント）。バランスの良い成長です。</span>
          </div>
          <div className={styles.chartWrapper}>
            <Bar data={trainingGrowthByAreaData} options={{
              responsive: true,
              maintainAspectRatio: false,
              indexAxis: 'y',
              scales: {
                x: {
                  min: 0,
                  max: 100
                }
              }
            }} />
          </div>
        </div>
      </div>

      <div className={styles.trainingSchedule}>
        <h3>今後の研修予定</h3>
        <div className={styles.scheduleList}>
          <div className={styles.scheduleItem}>
            <div className={styles.scheduleDate}>2025年2月15日</div>
            <div className={styles.scheduleContent}>
              <div className={styles.scheduleTitle}>管理職基礎研修</div>
              <div className={styles.scheduleDetails}>マネジメントの基本スキル習得</div>
            </div>
          </div>
          <div className={styles.scheduleItem}>
            <div className={styles.scheduleDate}>2025年3月20日</div>
            <div className={styles.scheduleContent}>
              <div className={styles.scheduleTitle}>コミュニケーション研修</div>
              <div className={styles.scheduleDetails}>効果的な対話とフィードバック技法</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.evaluationComments}>
        <h3>研修コメント</h3>
        <div className={styles.commentCard}>
          <div className={styles.commentHeader}>
            <span className={styles.commentAuthor}>教育研修部</span>
            <span className={styles.commentDate}>2025年1月</span>
          </div>
          <div className={styles.commentBody}>
            年間研修目標を達成し、特に専門技術分野で顕著な成長。管理職研修への参加を推奨。
          </div>
        </div>
        <div className={styles.commentCard}>
          <div className={styles.commentHeader}>
            <span className={styles.commentAuthor}>人材開発部</span>
            <span className={styles.commentDate}>2025年1月</span>
          </div>
          <div className={styles.commentBody}>
            研修効果測定で全項目80%以上を達成。学習内容の実践応用が確実に行われている。
          </div>
        </div>
      </div>
    </div>
  )
}