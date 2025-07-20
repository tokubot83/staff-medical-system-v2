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
          <div className={styles.chartWrapper}>
            <Line data={promotionPredictionData} options={{
              responsive: true,
              maintainAspectRatio: false
            }} />
          </div>
        </div>
        <div className={styles.chartContainer}>
          <h4>リスク分析・ROI</h4>
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

      <div className={styles.evaluationSummary}>
        <div className={styles.evaluationScore}>
          <div className={styles.scoreMain}>4.5</div>
          <div className={styles.scoreLabel}>総合評価スコア</div>
        </div>
        <div className={styles.evaluationDetails}>
          <div className={styles.evaluationItem}>
            <span className={styles.evaluationLabel}>評価ランク:</span>
            <span className={styles.evaluationValue}>A評価</span>
          </div>
          <div className={styles.evaluationItem}>
            <span className={styles.evaluationLabel}>前回比:</span>
            <span className={styles.evaluationValue}>+0.2ポイント</span>
          </div>
          <div className={styles.evaluationItem}>
            <span className={styles.evaluationLabel}>部署内順位:</span>
            <span className={styles.evaluationValue}>2位/15名</span>
          </div>
        </div>
      </div>

      <div className={styles.chartGrid}>
        <div className={styles.chartContainer}>
          <h4>評価推移</h4>
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

      <div className={styles.interviewSummary}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryValue}>12回</div>
          <div className={styles.summaryLabel}>年間面談回数</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryValue}>4.5/5.0</div>
          <div className={styles.summaryLabel}>面談満足度</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryValue}>95%</div>
          <div className={styles.summaryLabel}>目標達成率</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryValue}>2週間後</div>
          <div className={styles.summaryLabel}>次回面談</div>
        </div>
      </div>

      <div className={styles.chartGrid}>
        <div className={styles.chartContainer}>
          <h4>面談実施状況</h4>
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

      <div className={styles.developmentOverview}>
        <div className={styles.overviewCard}>
          <h3>スキル成長率</h3>
          <div className={styles.growthRate}>+28%</div>
          <div className={styles.growthPeriod}>過去1年間</div>
        </div>
        <div className={styles.overviewCard}>
          <h3>推奨開発領域</h3>
          <ul className={styles.recommendList}>
            <li>戦略立案能力</li>
            <li>プロジェクト管理</li>
            <li>財務知識</li>
          </ul>
        </div>
      </div>

      <div className={styles.chartGrid}>
        <div className={styles.chartContainer}>
          <h4>スキル成長推移</h4>
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
              <strong>管理職基礎研修</strong>
              <p>リーダーシップとマネジメントの基礎習得</p>
            </div>
          </div>
          <div className={styles.timelineItem}>
            <div className={styles.timelinePeriod}>2025年Q2</div>
            <div className={styles.timelineContent}>
              <strong>プロジェクト管理実践</strong>
              <p>実際のプロジェクトをリードし、実践力向上</p>
            </div>
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

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>156時間</div>
              <div className={styles.statLabel}>年間研修時間</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>48単位</div>
              <div className={styles.statLabel}>継続教育単位</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>13/15</div>
              <div className={styles.statLabel}>必須研修修了</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>95%</div>
              <div className={styles.statLabel}>技術習得率</div>
            </div>
          </div>
        </div>

        <div className={styles.chartGrid}>
          <div className={styles.chartContainer}>
            <h4>JNAキャリアラダーレベル経過</h4>
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
                      callback: function(value) {
                        const levels = ['', 'レベルⅠ', 'レベルⅡ', 'レベルⅢ', 'レベルⅣ', 'レベルⅤ'];
                        return levels[value] || '';
                      }
                    }
                  }
                },
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function(context) {
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

      <div className={styles.trainingSummary}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryValue}>156時間</div>
          <div className={styles.summaryLabel}>年間研修時間</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryValue}>92%</div>
          <div className={styles.summaryLabel}>修了率</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryValue}>4.5/5.0</div>
          <div className={styles.summaryLabel}>理解度評価</div>
        </div>
      </div>

      <div className={styles.chartGrid}>
        <div className={styles.chartContainer}>
          <h4>研修参加実績</h4>
          <div className={styles.chartWrapper}>
            <Doughnut data={trainingParticipationData} options={{
              responsive: true,
              maintainAspectRatio: false
            }} />
          </div>
        </div>
        <div className={styles.chartContainer}>
          <h4>研修効果測定</h4>
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
    </div>
  )
}