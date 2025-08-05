'use client'

import React, { useState, useEffect } from 'react'
import { Line, Bar, Radar, Scatter, Doughnut } from 'react-chartjs-2'
import styles from './StaffCards.module.css'
import { useRouter } from 'next/navigation'
import { Interview } from '@/types/interview'
import { getInterviewsByStaffId } from '@/data/mockInterviews'
import { TwoAxisEvaluationSummaryDetailed } from '@/components/evaluation/TwoAxisEvaluationSummaryDetailed'
import { TwoAxisEvaluationMatrixDisplay } from '@/components/evaluation/TwoAxisEvaluationMatrix'
import { getTwoAxisEvaluationByStaffId } from '@/data/mockTwoAxisEvaluations'
import { twoAxisColors, getTwoAxisChartOptions, calculateOverallGrade } from '@/utils/twoAxisChartUtils'
import { CareerInfoSection } from '@/components/interview/CareerInfoSection'
import { InterviewRecords } from '@/components/interview/InterviewRecords'
import { DashboardTabContent } from '@/components/interview/DashboardTabContent'
import { AnalyticsTabContent } from '@/components/interview/AnalyticsTabContent'
import { getCareerInfoByStaffId, saveCareerInfo } from '@/utils/careerInfoUtils'

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
  
  // タブ横断的統合分析チャート（2軸評価対応）
  const crossTabAnalysisData = {
    labels: ['採用適合', '研修効果', '評価成長', '面談満足', '能力開発', '統合分析'],
    datasets: [{
      label: '施設評価',
      data: [95, 88, 85, 92, 82, 87],
      borderColor: twoAxisColors.facility.main,
      backgroundColor: `${twoAxisColors.facility.main}33`,
      pointBackgroundColor: twoAxisColors.facility.main,
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: twoAxisColors.facility.main
    }, {
      label: '法人評価',
      data: [92, 85, 88, 90, 80, 85],
      borderColor: twoAxisColors.corporate.main,
      backgroundColor: `${twoAxisColors.corporate.main}33`,
      pointBackgroundColor: twoAxisColors.corporate.main,
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: twoAxisColors.corporate.main
    }]
  }

  // 組織内ポジショニング分析チャート（2軸評価対応）
  const staffEvaluation = selectedStaff.twoAxisEvaluation || { facilityScore: 92, corporateScore: 85 }
  const organizationalPositionData = {
    datasets: [{
      label: selectedStaff.name,
      data: [{ 
        x: staffEvaluation.facilityScore, 
        y: staffEvaluation.corporateScore,
        overallScore: calculateOverallGrade(staffEvaluation.facilityScore, staffEvaluation.corporateScore)
      }],
      backgroundColor: twoAxisColors.combined.main,
      pointRadius: 12,
      pointHoverRadius: 15
    }, {
      label: '同職種平均',
      data: [{ x: 72, y: 68, overallScore: 'A' }],
      backgroundColor: '#6c757d',
      pointRadius: 8
    }, {
      label: '上位10%',
      data: [{ x: 88, y: 82, overallScore: 'S' }],
      backgroundColor: twoAxisColors.corporate.main,
      pointRadius: 8
    }]
  }

  // 昇進後パフォーマンス予測チャート（2軸評価対応）
  const promotionPredictionData = {
    labels: ['現在', '3ヶ月後', '6ヶ月後', '1年後', '2年後'],
    datasets: [{
      label: '施設評価予測',
      data: [85, 86, 88, 90, 92],
      borderColor: twoAxisColors.facility.main,
      backgroundColor: `${twoAxisColors.facility.main}20`,
      fill: true,
      yAxisID: 'y'
    }, {
      label: '法人評価予測',
      data: [82, 83, 85, 88, 90],
      borderColor: twoAxisColors.corporate.main,
      backgroundColor: `${twoAxisColors.corporate.main}20`,
      fill: true,
      yAxisID: 'y1'
    }]
  }

  // リスク分析・ROIチャート（2軸評価対応）
  const riskAnalysisData = {
    labels: ['即時昇進', '6ヶ月後昇進', '1年後昇進'],
    datasets: [{
      label: '施設評価での成功確率(%)',
      data: [65, 87, 95],
      backgroundColor: twoAxisColors.facility.main,
      yAxisID: 'y'
    }, {
      label: '法人評価での成功確率(%)',
      data: [60, 85, 92],
      backgroundColor: twoAxisColors.corporate.main,
      yAxisID: 'y1'
    }]
  }

  // 健康・勤務統合分析データ（2軸評価対応）
  const healthWorkIntegrationData = {
    datasets: [{
      label: '現在',
      data: [{ 
        x: staffEvaluation.facilityScore, 
        y: staffEvaluation.corporateScore,
        overallScore: calculateOverallGrade(staffEvaluation.facilityScore, staffEvaluation.corporateScore)
      }],
      backgroundColor: twoAxisColors.combined.main,
      pointRadius: 15
    }, {
      label: '3ヶ月前',
      data: [{ x: 80, y: 78, overallScore: 'A+' }],
      backgroundColor: twoAxisColors.facility.light,
      pointRadius: 12
    }, {
      label: '6ヶ月前',
      data: [{ x: 75, y: 70, overallScore: 'A' }],
      backgroundColor: twoAxisColors.corporate.light,
      pointRadius: 10
    }]
  }

  // 退職リスク予測データ（2軸評価対応）
  const retentionRiskData = {
    labels: ['総合リスクスコア', '給与満足度', 'キャリア不安', '業務負荷', '成長機会', '人間関係'],
    datasets: [{
      label: '施設評価基準',
      data: [25, 80, 35, 40, 85, 90],
      borderColor: twoAxisColors.facility.main,
      backgroundColor: `${twoAxisColors.facility.main}33`,
      pointBackgroundColor: twoAxisColors.facility.main,
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: twoAxisColors.facility.main
    }, {
      label: '法人評価基準',
      data: [30, 75, 40, 35, 82, 88],
      borderColor: twoAxisColors.corporate.main,
      backgroundColor: `${twoAxisColors.corporate.main}33`,
      pointBackgroundColor: twoAxisColors.corporate.main,
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: twoAxisColors.corporate.main
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
            <Radar data={crossTabAnalysisData} options={getTwoAxisChartOptions('radar')} />
          </div>
        </div>
        <div className={styles.chartContainer}>
          <h4>組織内ポジショニング分析</h4>
          <div className={`${styles.alert} ${styles.alertSuccess}`}>
            <span>🎯</span>
            <span>パフォーマンス92点、ポテンシャル85点で上位10%圏内。次世代リーダー候補として有望な位置にいます。</span>
          </div>
          <div className={styles.chartWrapper}>
            <Scatter data={organizationalPositionData} options={getTwoAxisChartOptions('scatter')} />
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
            <Line data={promotionPredictionData} options={getTwoAxisChartOptions('line')} />
          </div>
        </div>
        <div className={styles.chartContainer}>
          <h4>リスク分析・ROI</h4>
          <div className={`${styles.alert} ${styles.alertSuccess}`}>
            <span>💰</span>
            <span>6ヶ月後昇進が最適解。成功確率87%、ROI340%で投資効果が最大化。即時昇進はリスクが高く推奨しません。</span>
          </div>
          <div className={styles.chartWrapper}>
            <Bar data={riskAnalysisData} options={getTwoAxisChartOptions('bar')} />
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
            <Scatter data={healthWorkIntegrationData} options={getTwoAxisChartOptions('scatter')} />
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
        <h3>統合分析コメント</h3>
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
        <div className={styles.commentCard}>
          <div className={styles.commentHeader}>
            <span className={styles.commentAuthor}>統合分析AI</span>
            <span className={styles.commentDate}>2025年1月</span>
          </div>
          <div className={styles.commentBody}>
            健康スコアと生産性の相関係数0.82は組織内トップクラス。退職リスク25%と低く、適切なキャリアパス提示でさらなる定着率向上が期待できます。ワークライフバランス優秀評価を維持しつつ、段階的な責任拡大が最適です。
          </div>
        </div>
      </div>
    </div>
  )
}

// 人事評価タブコンポーネント
export function EvaluationTab({ selectedStaff }: { selectedStaff: any }) {
  const router = useRouter()
  
  if (!selectedStaff) {
    return (
      <div className={styles.noDataContainer}>
        <p>職員を選択してください</p>
      </div>
    )
  }

  const isNurse = selectedStaff?.position?.includes('看護師') || selectedStaff?.position?.includes('ナース')
  
  // 2軸評価データの取得
  const twoAxisEvaluation = getTwoAxisEvaluationByStaffId(selectedStaff.id, selectedStaff)
  
  const handleEvaluationInput = () => {
    // 評価管理ページの評価実施タブに遷移
    router.push(`/evaluation?tab=execution&staffId=${selectedStaff.id}`)
  }

  // 評価推移データ（2軸評価対応）
  const evaluationTrendData = {
    labels: ['2023年上期', '2023年下期', '2024年上期', '2024年下期', '2025年上期'],
    datasets: [{
      label: '施設評価',
      data: [76, 80, 84, 86, 90],
      borderColor: twoAxisColors.facility.main,
      backgroundColor: `${twoAxisColors.facility.main}20`,
      fill: true,
      yAxisID: 'y'
    }, {
      label: '法人評価',
      data: [72, 75, 80, 82, 85],
      borderColor: twoAxisColors.corporate.main,
      backgroundColor: `${twoAxisColors.corporate.main}20`,
      fill: true,
      yAxisID: 'y1'
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
          <button className={styles.actionButton} onClick={handleEvaluationInput}>評価入力</button>
          <button className={styles.actionButtonSecondary}>評価履歴</button>
        </div>
      </div>

      <div className={styles.interviewSummaryEnhanced}>
        <div className={styles.summaryMainCard}>
          <div className={styles.summaryCardHeader}>
            <span className={styles.summaryIcon}>📊</span>
            <h3>人事評価サマリー</h3>
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <TwoAxisEvaluationSummaryDetailed
              facilityScore={twoAxisEvaluation.facilityScore}
              facilityRank={twoAxisEvaluation.facilityRank}
              facilityTotal={twoAxisEvaluation.facilityTotal}
              corporateScore={twoAxisEvaluation.corporateScore}
              corporateRank={twoAxisEvaluation.corporateRank}
              corporateTotal={twoAxisEvaluation.corporateTotal}
              overallScore={twoAxisEvaluation.overallScore}
              description={twoAxisEvaluation.comments || '優秀な職員'}
              recommendation="他施設との交流・研修機会の活用"
              strengthArea="施設内での圧倒的なパフォーマンス"
              improvementArea="法人規模での更なる成長余地"
            />
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
            <span>評価が安定的に上昇中（3.8→4.3）。3年連続高評価を維持しています。</span>
          </div>
          <div className={styles.chartWrapper}>
            <Line data={evaluationTrendData} options={getTwoAxisChartOptions('line')} />
          </div>
        </div>
        <div className={styles.chartContainer}>
          <h4>多面評価分析</h4>
          <div className={`${styles.alert} ${styles.alertInfo}`}>
            <span>👥</span>
            <span>自己評価と他者評価がほぼ一致。特にチームワークで高評価を得ています。</span>
          </div>
          <div className={styles.chartWrapper}>
            <Radar data={multiEvaluationData} options={getTwoAxisChartOptions('radar')} />
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
            <Bar data={evaluationGrowthData} options={getTwoAxisChartOptions('bar')} />
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
              <Radar data={jnaAchievementData} options={getTwoAxisChartOptions('radar')} />
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

      {/* 2軸評価システム - 新デザイン */}
      <div className={styles.sectionCard} style={{ marginTop: '24px' }}>
        <h3>2軸評価マトリックス</h3>
        <TwoAxisEvaluationMatrixDisplay
          facilityScore={twoAxisEvaluation.facilityScore}
          corporateScore={twoAxisEvaluation.corporateScore}
          showGrid={true}
          size="medium"
        />
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

  // 配属適性分析データ（2軸評価対応）
  const departmentFitData = {
    labels: ['現部署', '内科', '外科', 'ICU', '救急', '外来'],
    datasets: [{
      label: '施設適性スコア',
      data: [95, 82, 78, 88, 75, 85],
      backgroundColor: twoAxisColors.facility.main,
      yAxisID: 'y'
    }, {
      label: '法人適性スコア',
      data: [92, 80, 75, 85, 72, 82],
      backgroundColor: twoAxisColors.corporate.main,
      yAxisID: 'y1'
    }]
  }

  // キャリアパス予測（2軸評価対応）
  const careerPathData = {
    labels: ['現在', '1年後', '3年後', '5年後', '10年後'],
    datasets: [{
      label: '施設キャリア予測',
      data: [75, 80, 85, 90, 95],
      borderColor: twoAxisColors.facility.main,
      backgroundColor: `${twoAxisColors.facility.main}20`,
      yAxisID: 'y'
    }, {
      label: '法人キャリア予測',
      data: [70, 75, 82, 88, 92],
      borderColor: twoAxisColors.corporate.main,
      backgroundColor: `${twoAxisColors.corporate.main}20`,
      yAxisID: 'y1'
    }]
  }

  // 採用評価成熟度データ（2軸評価対応）
  const recruitmentMaturityData = {
    labels: ['採用時', '3ヶ月', '6ヶ月', '1年', '2年', '3年', '現在'],
    datasets: [{
      label: '施設業務習熟度',
      data: [0, 30, 55, 75, 85, 92, 95],
      borderColor: twoAxisColors.facility.main,
      backgroundColor: `${twoAxisColors.facility.main}20`,
      fill: true,
      yAxisID: 'y'
    }, {
      label: '法人業務習熟度',
      data: [0, 25, 50, 70, 82, 88, 92],
      borderColor: twoAxisColors.corporate.main,
      backgroundColor: `${twoAxisColors.corporate.main}20`,
      fill: true,
      yAxisID: 'y1'
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
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>入職日:</span>
              <span className={styles.infoValue}>{selectedStaff.joinDate || '2020年4月1日'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>採用区分:</span>
              <span className={styles.infoValue}>新卒採用</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>採用経路:</span>
              <span className={styles.infoValue}>大学推薦</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>初任配属:</span>
              <span className={styles.infoValue}>内科病棟</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>配属履歴:</span>
              <span className={styles.infoValue}>3部署経験</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>採用時評価:</span>
              <span className={styles.infoValue}>A（上位20%）</span>
            </div>
          </div>
          <div className={styles.recruitmentNotes}>
            <h4>採用時の所見</h4>
            <p>コミュニケーション能力が高く、チーム医療への適性が高い。実習評価も優秀で、即戦力として期待できる人材。</p>
          </div>
          
          <div className={styles.recruitmentEvaluations}>
            <h4>採用選考評価</h4>
            <div className={styles.evaluationGrid}>
              <div className={styles.evaluationItem}>
                <span className={styles.evaluationStage}>書類選考</span>
                <span className={styles.evaluationRating}>★★★★☆</span>
                <p className={styles.evaluationComment}>学業成績優秀、ボランティア経験豊富</p>
              </div>
              <div className={styles.evaluationItem}>
                <span className={styles.evaluationStage}>一次面接</span>
                <span className={styles.evaluationRating}>★★★★★</span>
                <p className={styles.evaluationComment}>明朗で前向き、コミュニケーション力抜群</p>
              </div>
              <div className={styles.evaluationItem}>
                <span className={styles.evaluationStage}>最終面接</span>
                <span className={styles.evaluationRating}>★★★★★</span>
                <p className={styles.evaluationComment}>キャリアビジョン明確、即戦力として期待</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.sectionDivider}>
        <h3>配属適性分析</h3>
      </div>

      <div className={styles.chartGrid}>
        <div className={styles.chartContainer}>
          <h4>部署適性スコア</h4>
          <div className={`${styles.alert} ${styles.alertInfo}`}>
            <span>🎯</span>
            <span>現在の部署適性は92%。長期的には管理部門や教育部門への適性も高い評価です。</span>
          </div>
          <div className={styles.chartWrapper}>
            <Bar data={departmentFitData} options={getTwoAxisChartOptions('bar')} />
          </div>
        </div>
        <div className={styles.chartContainer}>
          <h4>キャリアパス予測</h4>
          <div className={`${styles.alert} ${styles.alertSuccess}`}>
            <span>🚀</span>
            <span>5年後の管理職昇進確率72%。現在の成長ペースを維持すれば十分に達成可能です。</span>
          </div>
          <div className={styles.chartWrapper}>
            <Line data={careerPathData} options={getTwoAxisChartOptions('line')} />
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
            <Line data={recruitmentMaturityData} options={getTwoAxisChartOptions('line')} />
          </div>
        </div>
      </div>

      <div className={styles.sectionDivider}>
        <h3>配属履歴（時系列表示）</h3>
      </div>

      <div className={styles.assignmentHistory}>
        <div className={styles.timeline}>
          <div className={styles.timelineItem}>
            <div className={styles.timelineDate}>2020年4月 - 2021年3月</div>
            <div className={styles.timelineContent}>
              <h4>内科病棟</h4>
              <div className={styles.timelineDetails}>
                <div className={styles.performanceMetrics}>
                  <span className={styles.metric}>業務習熟度: 85%</span>
                  <span className={styles.metric}>チーム貢献度: 90%</span>
                  <span className={styles.metric}>患者満足度: 88%</span>
                </div>
                <p className={styles.timelineDescription}>
                  新人として配属。基礎的な看護技術を習得し、1年間で一人前の看護師として成長。
                  特に患者とのコミュニケーション能力が高く評価された。
                </p>
                <div className={styles.growthHighlights}>
                  <span className={styles.highlight}>✅ プリセプター制度完了</span>
                  <span className={styles.highlight}>✅ 夜勤独り立ち</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.timelineItem}>
            <div className={styles.timelineDate}>2021年4月 - 2022年9月</div>
            <div className={styles.timelineContent}>
              <h4>外科病棟</h4>
              <div className={styles.timelineDetails}>
                <div className={styles.performanceMetrics}>
                  <span className={styles.metric}>業務習熟度: 92%</span>
                  <span className={styles.metric}>チーム貢献度: 95%</span>
                  <span className={styles.metric}>患者満足度: 91%</span>
                </div>
                <p className={styles.timelineDescription}>
                  周術期看護の専門性を習得。手術前後の患者ケアにおいて高い評価を獲得。
                  新人指導の補助も担当し、リーダーシップの素養を見せ始める。
                </p>
                <div className={styles.growthHighlights}>
                  <span className={styles.highlight}>✅ 周術期看護研修修了</span>
                  <span className={styles.highlight}>✅ 新人指導補助担当</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.timelineItem} data-current="true">
            <div className={styles.timelineDate}>2022年10月 - 現在</div>
            <div className={styles.timelineContent}>
              <h4>循環器内科病棟（現在）</h4>
              <div className={styles.timelineDetails}>
                <div className={styles.performanceMetrics}>
                  <span className={styles.metric}>業務習熟度: 95%</span>
                  <span className={styles.metric}>チーム貢献度: 98%</span>
                  <span className={styles.metric}>患者満足度: 94%</span>
                </div>
                <p className={styles.timelineDescription}>
                  専門性の高い循環器看護において卓越した能力を発揮。心臓カテーテル検査の介助も担当。
                  チームリーダーとして若手の指導にも積極的に関わり、部署の中核的存在となっている。
                </p>
                <div className={styles.growthHighlights}>
                  <span className={styles.highlight}>✅ 心臓リハビリテーション指導士取得</span>
                  <span className={styles.highlight}>✅ チームリーダー就任</span>
                  <span className={styles.highlight}>✅ BLS/ACLS取得</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.assignmentSummary}>
          <h4>配属成長分析</h4>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>総合成長率</span>
              <span className={styles.summaryValue}>+156%</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>適応速度</span>
              <span className={styles.summaryValue}>平均6ヶ月</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>専門性獲得</span>
              <span className={styles.summaryValue}>3分野</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>リーダー経験</span>
              <span className={styles.summaryValue}>1.5年</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.recommendationSection}>
        <h3>配属推奨</h3>
        <div className={styles.recommendationGrid}>
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
          <div className={styles.recommendationCard}>
            <div className={styles.recommendationHeader}>
              <span className={styles.recommendationBadge} style={{backgroundColor: '#17a2b8'}}>代替案</span>
              <span className={styles.recommendationTitle}>ICU配属</span>
            </div>
            <div className={styles.recommendationBody}>
              高度な専門性と判断力を活かせるICUへの配属も検討可能。
              将来的な認定看護師取得を目指す場合に推奨。
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 面談・指導タブコンポーネント
export function InterviewTab({ selectedStaff }: { selectedStaff: any }) {
  const [staffInterviews, setStaffInterviews] = useState<Interview[]>([])
  const [staffCareerInfo, setStaffCareerInfo] = useState<any>(null)
  const router = useRouter()
  
  // Interview/InterviewBooking を InterviewRecord に変換する関数
  const mapInterviewToRecord = (interview: Interview): any => {
    // InterviewTypeをInterviewRecordのtypeにマッピング
    const typeMapping: Record<string, 'regular' | 'career' | 'stress' | 'evaluation' | 'other'> = {
      'regular_annual': 'regular',
      'career_development': 'career',
      'stress_care': 'stress',
      'performance_review': 'evaluation',
      'new_employee_monthly': 'regular',
      'management_biannual': 'regular',
      'incident_followup': 'other',
      'return_to_work': 'other',
      'grievance': 'other',
      'exit_interview': 'other',
      'ad_hoc': 'other'
    }
    
    return {
      id: interview.id,
      date: interview.conductedAt || interview.bookingDate,
      type: typeMapping[interview.interviewType] || 'other',
      duration: (interview.duration || 30) as 15 | 30 | 45,
      interviewer: interview.interviewerName || '未定',
      summary: interview.outcomeSummary || interview.description || '',
      topics: interview.requestedTopics || [],
      actionItems: interview.outcomeActionItems,
      nextFollowUp: interview.outcomeFollowupDate,
      careerInfoVersion: 1
    }
  }
  
  useEffect(() => {
    if (selectedStaff?.id) {
      const interviews = getInterviewsByStaffId(selectedStaff.id)
      setStaffInterviews(interviews)
      // 職歴情報を取得（実際の実装では適切なAPIから取得）
      const careerInfo = getCareerInfoByStaffId(selectedStaff.id)
      setStaffCareerInfo(careerInfo)
    }
  }, [selectedStaff])

  if (!selectedStaff) {
    return (
      <div className={styles.noDataContainer}>
        <p>職員を選択してください</p>
      </div>
    )
  }

  const handleCareerInfoSave = (data: any) => {
    // 職歴情報を保存（実際の実装ではAPIを呼び出す）
    saveCareerInfo(selectedStaff.id, data)
    setStaffCareerInfo(data)
  }

  const handleNewInterview = () => {
    // 新規面談作成画面へ遷移（実装は要調整）
    router.push(`/interviews/new?staffId=${selectedStaff.id}`)
  }

  // 面談実施状況（2軸評価対応）
  const interviewFrequencyData = {
    labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
    datasets: [{
      label: '施設面談回数',
      data: [1, 1, 1, 1, 1, 2],
      backgroundColor: twoAxisColors.facility.main,
      yAxisID: 'y'
    }, {
      label: '法人面談回数',
      data: [0, 1, 0, 1, 0, 1],
      backgroundColor: twoAxisColors.corporate.main,
      yAxisID: 'y1'
    }]
  }

  // 面談満足度推移（2軸評価対応）
  const satisfactionTrendData = {
    labels: ['2024年Q1', '2024年Q2', '2024年Q3', '2024年Q4', '2025年Q1'],
    datasets: [{
      label: '施設面談満足度',
      data: [70, 76, 80, 84, 90],
      borderColor: twoAxisColors.facility.main,
      backgroundColor: `${twoAxisColors.facility.main}20`,
      fill: true,
      yAxisID: 'y'
    }, {
      label: '法人面談満足度',
      data: [68, 72, 78, 82, 88],
      borderColor: twoAxisColors.corporate.main,
      backgroundColor: `${twoAxisColors.corporate.main}20`,
      fill: true,
      yAxisID: 'y1'
    }]
  }

  // 話題分析円グラフデータ（2軸評価対応）
  const topicAnalysisData = {
    labels: ['施設話題', '法人話題'],
    datasets: [{
      data: [60, 40],
      backgroundColor: [
        twoAxisColors.facility.main,
        twoAxisColors.corporate.main
      ],
      borderColor: [
        twoAxisColors.facility.dark,
        twoAxisColors.corporate.dark
      ],
      borderWidth: 2
    }]
  }

  // 指導効果測定レーダーチャート（2軸評価対応）
  const coachingEffectData = {
    labels: ['目標達成', 'モチベーション', 'スキル向上', '問題解決', '自己理解', '行動変容'],
    datasets: [{
      label: '施設評価基準',
      data: [85, 90, 88, 82, 85, 80],
      borderColor: twoAxisColors.facility.main,
      backgroundColor: `${twoAxisColors.facility.main}33`
    }, {
      label: '法人評価基準',
      data: [82, 87, 85, 78, 82, 77],
      borderColor: 'rgba(40, 167, 69, 0.8)',
      backgroundColor: 'rgba(40, 167, 69, 0.2)'
    }]
  }

  // 初回面談判定
  const isFirstInterview = staffInterviews.length === 0

  // タブの定義
  const interviewTabs = [
    { id: 'dashboard', label: '概要', icon: '📊' },
    { id: 'regular', label: '定期面談', icon: '📅' },
    { id: 'career', label: 'キャリア面談', icon: '🎯' },
    { id: 'stress', label: 'ストレスチェック', icon: '💭' },
    { id: 'evaluation', label: '評価フィードバック', icon: '⭐' },
    { id: 'other', label: 'その他', icon: '📝' },
    { id: 'analytics', label: '統計・分析', icon: '📈' }
  ]

  const [activeInterviewTab, setActiveInterviewTab] = useState('dashboard')

  // 面談管理ページへの遷移
  const handleInterviewManagement = () => {
    router.push(`/interviews?staffId=${selectedStaff.id}&tab=${activeInterviewTab}`)
  }

  return (
    <div className={styles.tabContentSection}>
      <div className={styles.sectionHeader}>
        <h2>💬 面談・指導記録</h2>
        <div className={styles.sectionActions}>
          <button className={styles.actionButton} onClick={handleNewInterview}>面談予約</button>
          <button className={styles.actionButton} onClick={handleInterviewManagement}>面談管理</button>
          <button className={styles.actionButtonSecondary}>記録作成</button>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className={styles.tabNavigation} style={{ marginBottom: '20px' }}>
        {interviewTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveInterviewTab(tab.id)}
            className={`${styles.tabButton} ${activeInterviewTab === tab.id ? styles.active : ''}`}
            style={{ fontSize: '14px', padding: '8px 16px' }}
          >
            <span style={{ marginRight: '4px' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* タブコンテンツ */}
      {activeInterviewTab === 'dashboard' && (
        <div>
          {/* 職歴情報セクション（ダッシュボードのみ表示） */}
          <CareerInfoSection 
            data={staffCareerInfo}
            editable={true}
            isFirstTime={isFirstInterview}
            onSave={handleCareerInfoSave}
          />
          
          {/* 現在の関心事・重点課題を移動 */}
          <DashboardTabContent 
            selectedStaff={selectedStaff}
            staffInterviews={staffInterviews}
          />
        </div>
      )}

      {activeInterviewTab === 'regular' && (
        <div>
          {/* 定期面談の記録 */}
          <InterviewRecords 
            records={staffInterviews.filter(i => i.type === 'regular')}
            careerInfo={staffCareerInfo}
            onNewInterview={handleNewInterview}
          />
        </div>
      )}

      {activeInterviewTab === 'career' && (
        <div>
          {/* キャリア面談の記録 */}
          <InterviewRecords 
            records={staffInterviews.filter(i => i.type === 'career')}
            careerInfo={staffCareerInfo}
            onNewInterview={handleNewInterview}
          />
        </div>
      )}

      {activeInterviewTab === 'stress' && (
        <div>
          {/* ストレスチェック面談の記録 */}
          <InterviewRecords 
            records={staffInterviews.filter(i => i.type === 'stress')}
            careerInfo={staffCareerInfo}
            onNewInterview={handleNewInterview}
          />
        </div>
      )}

      {activeInterviewTab === 'evaluation' && (
        <div>
          {/* 評価フィードバックの記録 */}
          <InterviewRecords 
            records={staffInterviews.filter(i => i.type === 'evaluation')}
            careerInfo={staffCareerInfo}
            onNewInterview={handleNewInterview}
          />
        </div>
      )}

      {activeInterviewTab === 'other' && (
        <div>
          {/* その他の面談記録 */}
          <InterviewRecords 
            records={staffInterviews.filter(i => i.type === 'other')}
            careerInfo={staffCareerInfo}
            onNewInterview={handleNewInterview}
          />
        </div>
      )}

      {activeInterviewTab === 'analytics' && (
        <div>
          {/* 統計・分析タブ */}
          <AnalyticsTabContent 
            interviewFrequencyData={interviewFrequencyData}
            satisfactionTrendData={satisfactionTrendData}
            topicAnalysisData={topicAnalysisData}
            coachingEffectData={coachingEffectData}
          />
        </div>
      )}
    </div>
  )
}

// 能力開発タブコンポーネント
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
            <Doughnut data={topicAnalysisData} options={getTwoAxisChartOptions('doughnut')} />
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
        <div className={styles.historySectionHeader}>
          <h3>面談履歴</h3>
          <button 
            className={styles.viewAllButton}
            onClick={() => router.push(`/interviews?staffId=${selectedStaff.id}`)}
          >
            すべて表示
          </button>
        </div>
        
        {staffInterviews.length === 0 ? (
          <div className={styles.noInterviewsMessage}>
            <p>面談記録がありません</p>
          </div>
        ) : (
          <div className={styles.interviewTimeline}>
            {staffInterviews.slice(0, 3).map((interview) => (
              <div key={interview.id} className={styles.timelineItem}>
                <div className={styles.timelineMarker}>
                  <div className={`${styles.markerDot} ${interview.status === 'completed' ? styles.completed : styles.scheduled}`}></div>
                  <div className={styles.markerLine}></div>
                </div>
                <div className={styles.timelineContent}>
                  <div className={styles.timelineHeader}>
                    <span className={styles.timelineDate}>{new Date(interview.bookingDate).toLocaleDateString('ja-JP')}</span>
                    <span className={`${styles.timelineType} ${styles[interview.interviewType.replace(/[^a-zA-Z]/g, '')]}`}>
                      {interview.interviewType}
                    </span>
                    <span className={`${styles.timelineStatus} ${styles[interview.status]}`}>
                      {interview.status}
                    </span>
                  </div>
                  <div className={styles.timelineBody}>
                    <p className={styles.timelinePurpose}><strong>目的:</strong> {interview.description}</p>
                    {interview.outcomeSummary && (
                      <div className={styles.timelineFeedback}>
                        <p><strong>面談結果:</strong></p>
                        <p>{interview.outcomeSummary}</p>
                        {interview.outcomeActionItems && interview.outcomeActionItems.length > 0 && (
                          <>
                            <p><strong>アクションアイテム:</strong></p>
                            <ul>
                              {interview.outcomeActionItems.slice(0, 2).map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>
                    )}
                    {interview.outcomeFollowupRequired && (
                      <div className={styles.followUpNotice}>
                        <span className={styles.followUpIcon}>📌</span>
                        フォローアップ予定: {interview.outcomeFollowupDate}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className={styles.interviewActions}>
          <button 
            className={styles.scheduleButton}
            onClick={() => router.push(`/interviews?action=schedule&staffId=${selectedStaff.id}`)}
          >
            面談を予約
          </button>
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

  // スキル成長推移（2軸評価対応）
  const skillGrowthData = {
    labels: ['2023年', '2024年上期', '2024年下期', '2025年'],
    datasets: [{
      label: '施設評価基準スキル',
      data: [70, 80, 85, 90],
      borderColor: twoAxisColors.facility.main,
      backgroundColor: `${twoAxisColors.facility.main}20`,
      yAxisID: 'y'
    }, {
      label: '法人評価基準スキル',
      data: [65, 75, 82, 87],
      borderColor: twoAxisColors.corporate.main,
      backgroundColor: `${twoAxisColors.corporate.main}20`,
      yAxisID: 'y1'
    }]
  }

  // スキルギャップ分析（2軸評価対応）
  const skillGapData = {
    labels: ['リーダーシップ', 'プロジェクト管理', '戦略立案', 'データ分析', '人材育成'],
    datasets: [{
      label: '施設現在レベル',
      data: [75, 68, 60, 82, 88],
      backgroundColor: twoAxisColors.facility.main,
      yAxisID: 'y'
    }, {
      label: '法人現在レベル',
      data: [70, 65, 55, 78, 85],
      backgroundColor: twoAxisColors.corporate.main,
      yAxisID: 'y1'
    }, {
      label: '必要レベル',
      data: [90, 85, 80, 85, 90],
      backgroundColor: 'rgba(220, 53, 69, 0.3)',
      yAxisID: 'y'
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
            <Line data={skillGrowthData} options={getTwoAxisChartOptions('line')} />
          </div>
        </div>
        <div className={styles.chartContainer}>
          <h4>スキルギャップ分析</h4>
          <div className={`${styles.alert} ${styles.alertWarning}`}>
            <span>🎯</span>
            <span>戦略立案とプロジェクト管理に20ポイント以上のギャップ。実践的な経験を積む機会の提供が必要です。</span>
          </div>
          <div className={styles.chartWrapper}>
            <Bar data={skillGapData} options={getTwoAxisChartOptions('bar')} />
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
  const router = useRouter()
  
  if (!selectedStaff) {
    return (
      <div className={styles.noDataContainer}>
        <p>職員を選択してください</p>
      </div>
    )
  }

  const isNurse = selectedStaff?.position?.includes('看護師') || selectedStaff?.position?.includes('ナース')

  // 研修参加実績（2軸評価対応）
  const trainingParticipationData = {
    labels: ['施設研修', '法人研修'],
    datasets: [{
      data: [120, 36],
      backgroundColor: [
        twoAxisColors.facility.main,
        twoAxisColors.corporate.main
      ],
      borderColor: [
        twoAxisColors.facility.dark,
        twoAxisColors.corporate.dark
      ],
      borderWidth: 2
    }]
  }

  // 研修効果測定（2軸評価対応）
  const trainingEffectData = {
    labels: ['知識習得', '実践応用', '行動変容', '成果創出'],
    datasets: [{
      label: '施設達成度',
      data: [90, 85, 78, 82],
      backgroundColor: twoAxisColors.facility.main,
      yAxisID: 'y'
    }, {
      label: '法人達成度',
      data: [88, 82, 75, 80],
      backgroundColor: twoAxisColors.corporate.main,
      yAxisID: 'y1'
    }]
  }

  // 看護師専用：JNAラダー研修進捗（2軸評価対応）
  const jnaTrainingData = {
    labels: ['基礎看護技術', '専門看護実践', '看護管理', '看護教育', '看護研究', '倫理実践'],
    datasets: [{
      label: '施設修了率',
      data: [100, 95, 85, 88, 75, 90],
      backgroundColor: twoAxisColors.facility.main,
      yAxisID: 'y'
    }, {
      label: '法人修了率',
      data: [98, 92, 82, 85, 70, 88],
      backgroundColor: twoAxisColors.corporate.main,
      yAxisID: 'y1'
    }]
  }

  // JNAキャリアラダーレベル経過グラフ（2軸評価対応）
  const jnaLadderProgressData = {
    labels: ['2020年', '2021年', '2022年', '2023年', '2024年', '2025年(現在)'],
    datasets: [{
      label: '施設ラダーレベル',
      data: [50, 60, 65, 75, 85, 90],
      borderColor: twoAxisColors.facility.main,
      backgroundColor: `${twoAxisColors.facility.main}20`,
      fill: true,
      tension: 0.4,
      yAxisID: 'y'
    }, {
      label: '法人ラダーレベル',
      data: [45, 55, 60, 70, 80, 85],
      borderColor: twoAxisColors.corporate.main,
      backgroundColor: `${twoAxisColors.corporate.main}20`,
      fill: true,
      tension: 0.4,
      yAxisID: 'y1'
    }]
  }

  if (isNurse) {
    return (
      <div className={styles.tabContentSection}>
        <div className={styles.sectionHeader}>
          <h2>🎓 看護師教育・研修（JNAキャリアラダー）</h2>
          <div className={styles.sectionActions}>
            <button 
              className={styles.actionButton}
              onClick={() => router.push(`/training?staffId=${selectedStaff.id}&tab=programs`)}
            >
              研修申込
            </button>
            <button 
              className={styles.actionButtonSecondary}
              onClick={() => router.push(`/training?staffId=${selectedStaff.id}&tab=history`)}
            >
              学習履歴
            </button>
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
          <button 
            className={styles.actionButton}
            onClick={() => router.push(`/training?staffId=${selectedStaff.id}&tab=programs`)}
          >
            研修申込
          </button>
          <button 
            className={styles.actionButtonSecondary}
            onClick={() => router.push(`/training?staffId=${selectedStaff.id}&tab=history`)}
          >
            学習履歴
          </button>
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