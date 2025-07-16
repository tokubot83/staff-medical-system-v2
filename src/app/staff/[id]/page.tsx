'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import styles from './StaffDetail.module.css'
import { staffDatabase } from '@/app/data/staffData'

// Chart.jsを動的インポート（SSR対応）
const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
  ssr: false,
})
const Bar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Bar), {
  ssr: false,
})
const Doughnut = dynamic(() => import('react-chartjs-2').then((mod) => mod.Doughnut), {
  ssr: false,
})
const Radar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Radar), {
  ssr: false,
})
const Scatter = dynamic(() => import('react-chartjs-2').then((mod) => mod.Scatter), {
  ssr: false,
})

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
} from 'chart.js'

// Chart.js登録
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement
)

// タブの定義
const tabs = [
  { id: 'analytics', label: '📈 総合分析', icon: '📈' },
  { id: 'evaluation', label: '📊 人事評価', icon: '📊' },
  { id: 'recruitment', label: '👥 採用・配属', icon: '👥' },
  { id: 'interview', label: '💬 面談・指導', icon: '💬' },
  { id: 'development', label: '🚀 能力開発', icon: '🚀' },
  { id: 'education', label: '🎓 教育・研修', icon: '🎓' },
]

export default function StaffDetailPage() {
  const params = useParams()
  const staffId = params.id as string
  const [activeTab, setActiveTab] = useState('analytics')
  const [staffData, setStaffData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // スタッフデータの取得
    const fetchStaffData = async () => {
      setLoading(true)
      
      // データベースから取得
      const data = staffDatabase[staffId]
      
      if (data) {
        setStaffData(data)
      } else {
        // データが見つからない場合はデフォルトデータを使用
        setStaffData({
          id: staffId,
          name: '不明な職員',
          position: '不明',
          department: '不明',
          employeeId: staffId,
          joinDate: '-',
          tenure: '-',
          age: 0,
          birthDate: '-',
          evaluation: '-',
          evaluationPeriod: '-',
          nextMeeting: '-',
          healthStatus: '-',
          stressIndex: 0,
          engagement: 0,
          overtime: 0,
          paidLeaveRate: 0,
          avatar: 'bg-gray-500',
        })
      }
      
      setLoading(false)
    }

    fetchStaffData()
  }, [staffId])

  if (loading) {
    return <div className={styles.loading}>読み込み中...</div>
  }

  return (
    <div className={styles.container}>
      {/* ヘッダー */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1>職員カルテ - {staffData.name}</h1>
            <div className={styles.subtitle}>
              {staffData.position} | ID: {staffData.employeeId} | {staffData.department}
            </div>
          </div>
          <div className={styles.quickActions}>
            <button className={styles.quickAction}>📧 面談予約</button>
            <button className={styles.quickAction}>📊 評価入力</button>
            <button className={styles.quickAction}>📝 記録更新</button>
            <button className={styles.quickAction}>🖨️ PDF出力</button>
          </div>
        </div>
      </div>

      {/* 基本情報バー */}
      <div className={styles.basicInfoBar}>
        <div className={styles.basicInfoItem}>
          <span className={styles.basicInfoLabel}>入職:</span>
          <span className={styles.basicInfoValue}>{staffData.joinDate}（{staffData.tenure}）</span>
        </div>
        <div className={styles.basicInfoItem}>
          <span className={styles.basicInfoLabel}>年齢:</span>
          <span className={styles.basicInfoValue}>{staffData.age}歳（{staffData.birthDate}）</span>
        </div>
        <div className={styles.basicInfoItem}>
          <span className={styles.basicInfoLabel}>最新評価:</span>
          <span className={styles.basicInfoValue}>{staffData.evaluation}評価（{staffData.evaluationPeriod}）</span>
        </div>
        <div className={styles.basicInfoItem}>
          <span className={styles.basicInfoLabel}>次回面談:</span>
          <span className={styles.basicInfoValue}>{staffData.nextMeeting}予定</span>
        </div>
        <div className={styles.basicInfoItem}>
          <span className={styles.basicInfoLabel}>健康状態:</span>
          <span className={styles.basicInfoValue}>{staffData.healthStatus}（ストレス指数: {staffData.stressIndex}）</span>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className={styles.tabNavigation}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* タブコンテンツ */}
      <div className={styles.tabContent}>
        {activeTab === 'analytics' && <AnalyticsTab staffData={staffData} />}
        {activeTab === 'evaluation' && <EvaluationTab staffData={staffData} />}
        {activeTab === 'recruitment' && <RecruitmentTab staffData={staffData} />}
        {activeTab === 'interview' && <InterviewTab staffData={staffData} />}
        {activeTab === 'development' && <DevelopmentTab staffData={staffData} />}
        {activeTab === 'education' && <EducationTab staffData={staffData} />}
      </div>

      {/* 更新情報 */}
      <div className={styles.updateInfo}>
        最終更新: 2025年1月14日 14:30 | 更新者: 人事部 田村主任 | 次回更新予定: 2025年2月14日
      </div>
    </div>
  )
}

// 総合分析タブコンポーネント
function AnalyticsTab({ staffData }: { staffData: any }) {
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
      label: '田中さん',
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
    }, {
      label: '主任候補者',
      data: [
        { x: 85, y: 78 },
        { x: 90, y: 82 },
        { x: 78, y: 75 }
      ],
      backgroundColor: '#ffc107',
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
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>📈 統合的戦略判断・エグゼクティブ分析</h2>
        <div className={styles.sectionActions}>
          <button className={styles.sectionAction}>分析レポート</button>
          <button className={`${styles.sectionAction} ${styles.secondary}`}>比較分析</button>
        </div>
      </div>

      <div className={`${styles.alert} ${styles.alertSuccess}`}>
        <span>🎯</span>
        <strong>最終推奨:</strong> 2025年7月昇進が最適。準備期間6ヶ月で成功確率87%、ROI 340%の高い投資効果が期待できます。
      </div>

      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.success}`}>
          <div className={styles.statTrend}>🎯</div>
          <div className={styles.statValue}>93%</div>
          <div className={styles.statLabel}>戦略適合度</div>
        </div>
        <div className={`${styles.statCard} ${styles.info}`}>
          <div className={styles.statTrend}>💰</div>
          <div className={styles.statValue}>340%</div>
          <div className={styles.statLabel}>期待ROI</div>
        </div>
        <div className={`${styles.statCard} ${styles.warning}`}>
          <div className={styles.statTrend}>🕐</div>
          <div className={styles.statValue}>85%</div>
          <div className={styles.statLabel}>労働生産性</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTrend}>🏆</div>
          <div className={styles.statValue}>87</div>
          <div className={styles.statLabel}>総合健康スコア</div>
        </div>
      </div>

      <div className={styles.chartGrid}>
        <div className={styles.chartContainer}>
          <h4>タブ横断的統合分析</h4>
          <div className={`${styles.alert} ${styles.alertInfo}`} style={{ margin: '10px 0', fontSize: '11px' }}>
            <span>💡</span>
            <span>各タブの評価を統合し、相互関係を可視化。研修→評価→ストレスの連鎖や正のスパイラルを把握できます。</span>
          </div>
          <div className={styles.chartCanvas}>
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
          <div className={`${styles.alert} ${styles.alertInfo}`} style={{ margin: '10px 0', fontSize: '11px' }}>
            <span>📊</span>
            <span>パフォーマンス×ポテンシャルマトリクス。田中さんは同職種上位15%、主任候補2位の高位置にあります。</span>
          </div>
          <div className={styles.chartCanvas}>
            <Scatter data={organizationalPositionData} options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: { title: { display: true, text: 'パフォーマンス' }, min: 60, max: 100 },
                y: { title: { display: true, text: 'ポテンシャル' }, min: 60, max: 100 }
              },
              plugins: {
                legend: { position: 'bottom' as const }
              }
            }} />
          </div>
        </div>
      </div>

      <div className={styles.infoGrid}>
        <div className={styles.infoCard}>
          <div className={styles.cardTitle}>🔄 タブ横断的統合分析</div>
          <div className={`${styles.alert} ${styles.alertSuccess}`} style={{ marginBottom: '15px', fontSize: '11px' }}>
            <span>📈</span>
            <span>各業務領域の相関関係を分析し、効果的な介入ポイントを特定します。</span>
          </div>
          <div className={styles.cardContent}>
            <strong>因果関係マッピング:</strong><br />
            • 研修不足 → 評価低下 → ストレス増加の連鎖を確認<br />
            • リーダーシップ研修受講 → 評価向上 → エンゲージメント上昇<br />
            • 専門性向上 → チーム評価向上 → 昇進機会拡大<br /><br />
            
            <strong>統合的介入効果:</strong><br />
            • 管理研修 + 実践経験 = 正のスパイラル創出<br />
            • メンタル支援 + キャリア支援 = 持続的成長<br />
            • スキル向上 + 環境改善 = 最適パフォーマンス<br /><br />
            
            <strong>相互作用分析:</strong><br />
            • 面談満足度↑ → ストレス指数↓ → 評価↑<br />
            • 研修参加↑ → スキル↑ → 昇進準備度↑
          </div>
        </div>

        <div className={styles.infoCard}>
          <div className={styles.cardTitle}>📊 組織全体との比較分析</div>
          <div className={`${styles.alert} ${styles.alertInfo}`} style={{ marginBottom: '15px', fontSize: '11px' }}>
            <span>🎯</span>
            <span>同職種・同世代との客観的比較により、田中さんの組織内価値を定量評価します。</span>
          </div>
          <div className={styles.cardContent}>
            <strong>同職種内ポジショニング:</strong><br />
            • 看護師全体での順位: 3位/45人<br />
            • 同世代（30-40歳）順位: 上位15%<br />
            • 主任候補者ランキング: 2位/8人<br /><br />
            
            <strong>ベンチマーク比較:</strong><br />
            • 総合評価: 田中4.2 vs 同職種平均3.6<br />
            • エンゲージメント: 95% vs 平均78%<br />
            • 研修参加率: 100% vs 平均65%<br /><br />
            
            <strong>組織貢献度分析:</strong><br />
            • 病院全体への影響度: 中程度→高に向上中<br />
            • 新人育成貢献: 年間3名指導実績<br />
            • 患者満足度への寄与: +8%向上効果
          </div>
        </div>
      </div>

      <div className={styles.chartGrid}>
        <div className={styles.chartContainer}>
          <h4>昇進後パフォーマンス予測</h4>
          <div className={`${styles.alert} ${styles.alertInfo}`} style={{ margin: '10px 0', fontSize: '11px' }}>
            <span>🔮</span>
            <span>AIによる予測分析。過去の類似ケース50例を基に、87%の成功確率を算出しています。</span>
          </div>
          <div className={styles.chartCanvas}>
            <Line data={promotionPredictionData} options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: { min: 1, max: 5 }
              }
            }} />
          </div>
        </div>
        <div className={styles.chartContainer}>
          <h4>リスク分析・シナリオ別ROI</h4>
          <div className={`${styles.alert} ${styles.alertWarning}`} style={{ margin: '10px 0', fontSize: '11px' }}>
            <span>⚠️</span>
            <span>3つのシナリオ比較。6ヶ月後昇進が最適解（成功率87%、ROI 340%）と判定されました。</span>
          </div>
          <div className={styles.chartCanvas}>
            <Bar data={riskAnalysisData} options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  title: { display: true, text: '成功確率(%)' },
                  max: 100
                },
                y1: {
                  type: 'linear',
                  display: true,
                  position: 'right',
                  title: { display: true, text: 'ROI(%)' },
                  max: 400,
                  grid: { drawOnChartArea: false }
                }
              }
            }} />
          </div>
        </div>
      </div>

      <div className={styles.infoGrid}>
        <div className={styles.infoCard}>
          <div className={styles.cardTitle}>🔮 予測・シミュレーション分析</div>
          <div className={`${styles.alert} ${styles.alertSuccess}`} style={{ marginBottom: '15px', fontSize: '11px' }}>
            <span>📊</span>
            <span>機械学習による将来予測。信頼度95%で6ヶ月後の管理スキル向上を予測しています。</span>
          </div>
          <div className={styles.cardContent}>
            <strong>昇進後パフォーマンス予測:</strong><br />
            • 6ヶ月後管理スキル予測: 3.8/5.0<br />
            • 1年後総合評価予測: 4.5/5.0<br />
            • 成功確率: 87%（高確率）<br /><br />
            
            <strong>リスク分析:</strong><br />
            • 昇進失敗リスク: 13%（管理経験不足）<br />
            • 適応困難リスク: 8%（プレッシャー過多）<br />
            • バーンアウトリスク: 5%（ワークロード）<br /><br />
            
            <strong>シナリオ別分析:</strong><br />
            • 即時昇進: 成功率65%、ROI 180%<br />
            • 6ヶ月後昇進: 成功率87%、ROI 340%<br />
            • 1年後昇進: 成功率95%、ROI 280%
          </div>
        </div>

        <div className={styles.infoCard}>
          <div className={styles.cardTitle}>🎯 戦略的意思決定支援</div>
          <div className={`${styles.alert} ${styles.alertInfo}`} style={{ marginBottom: '15px', fontSize: '11px' }}>
            <span>💰</span>
            <span>財務分析を含む総合的な投資判断。5年間で200万円の価値創出が期待されます。</span>
          </div>
          <div className={styles.cardContent}>
            <strong>最適昇進タイミング:</strong><br />
            • 推奨時期: 2025年7月（93%適切性）<br />
            • 準備期間: 6ヶ月（最適バランス）<br />
            • 成功確率: 87%（高確率）<br /><br />
            
            <strong>財務・投資分析:</strong><br />
            • 研修・育成投資: 12万円<br />
            • 期待ROI: 340%（5年間）<br />
            • 価値創出予測: 200万円/5年<br /><br />
            
            <strong>組織インパクト:</strong><br />
            • 病棟運営効率: +15%向上予測<br />
            • チーム満足度: +12%向上予測<br />
            • 人材育成効果: 年間5名指導可能
          </div>
        </div>
      </div>

      <div className={styles.actionItems}>
        <div className={`${styles.actionItem} ${styles.priorityHigh}`}>
          <div className={styles.actionTitle}>📋 エグゼクティブサマリー</div>
          <div className={`${styles.alert} ${styles.alertSuccess}`} style={{ marginBottom: '10px', fontSize: '11px' }}>
            <span>👔</span>
            <span>役員・上司向けの意思決定支援情報。数値根拠に基づく明確な推奨アクションを提示します。</span>
          </div>
          <div className={styles.actionContent}>
            <strong>KPIダッシュボード:</strong><br />
            • 戦略適合度: 93% | 期待ROI: 340%<br />
            • 成功確率: 87% | リスク管理: 可能<br />
            • 組織環境: 最適 | 投資妥当性: 高<br /><br />
            
            <strong>最終推奨アクション:</strong><br />
            ✅ 2025年7月昇進実施<br />
            ✅ 6ヶ月準備期間で管理研修集中実施<br />
            ✅ 段階的責任移譲によるリスク軽減
          </div>
          <div className={styles.actionDue}>意思決定期限: 2025年1月末</div>
        </div>
        <div className={`${styles.actionItem} ${styles.priorityMedium}`}>
          <div className={styles.actionTitle}>📊 継続モニタリング計画</div>
          <div className={`${styles.alert} ${styles.alertInfo}`} style={{ marginBottom: '10px', fontSize: '11px' }}>
            <span>📈</span>
            <span>KPI追跡による進捗管理。月次レポートで昇進準備の進行状況を可視化します。</span>
          </div>
          <div className={styles.actionContent}>
            <strong>追跡指標・KPI:</strong><br />
            • 管理スキル向上度: 月次測定<br />
            • ストレス指数変化: 月次確認<br />
            • チーム満足度: 四半期調査<br />
            • 研修効果測定: 研修後1ヶ月評価<br /><br />
            
            <strong>責任者・体制:</strong><br />
            • 測定責任者: 師長・人事部<br />
            • 報告頻度: 月次レポート<br />
            • アラート条件: 指標20%以上悪化時
          </div>
          <div className={styles.actionDue}>2025年1月開始</div>
        </div>
        <div className={`${styles.actionItem} ${styles.priorityLow}`}>
          <div className={styles.actionTitle}>🚀 今月の重要アクション</div>
          <div className={`${styles.alert} ${styles.alertWarning}`} style={{ marginBottom: '10px', fontSize: '11px' }}>
            <span>📅</span>
            <span>2025年1月に実施すべき具体的アクション。期限厳守で着実な準備を進めます。</span>
          </div>
          <div className={styles.actionContent}>
            <strong>今月実施事項:</strong><br />
            • 管理職研修申込み（1月15日まで）<br />
            • QI活動リーダー正式任命<br />
            • 昇進面談スケジュール調整<br />
            • 他候補者との比較分析更新<br /><br />
            
            <strong>継続監視項目:</strong><br />
            • 週次: ストレス指数確認<br />
            • 月次: 管理スキル進捗評価<br />
            • 四半期: 昇進準備度再評価
          </div>
          <div className={styles.actionDue}>2025年1月実行</div>
        </div>
      </div>
    </div>
  )
}

// 人事評価タブコンポーネント
function EvaluationTab({ staffData }: { staffData: any }) {
  // 評価推移チャート
  const evaluationTrendData = {
    labels: ['2022下期', '2023上期', '2023下期', '2024上期'],
    datasets: [{
      label: '総合評価',
      data: [3.1, 3.5, 3.9, 4.2],
      borderColor: '#007bff',
      backgroundColor: 'rgba(0, 123, 255, 0.1)',
      fill: true,
      tension: 0.4
    }]
  }

  // 評価レーダーチャート
  const evaluationRadarData = {
    labels: ['業務成果', '専門スキル', 'チームワーク', 'リーダーシップ', '成長性'],
    datasets: [{
      label: '現在',
      data: [4.5, 4.2, 4.8, 3.5, 4.0],
      borderColor: '#007bff',
      backgroundColor: 'rgba(0, 123, 255, 0.2)',
      pointBackgroundColor: '#007bff'
    }, {
      label: '目標',
      data: [4.8, 4.5, 4.8, 4.2, 4.5],
      borderColor: '#28a745',
      backgroundColor: 'rgba(40, 167, 69, 0.1)',
      pointBackgroundColor: '#28a745'
    }]
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>📊 人事評価・考課</h2>
        <div className={styles.sectionActions}>
          <button className={styles.sectionAction}>評価入力</button>
          <button className={`${styles.sectionAction} ${styles.secondary}`}>過去履歴</button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.success}`}>
          <div className={styles.statTrend}>📈</div>
          <div className={styles.statValue}>A</div>
          <div className={styles.statLabel}>最新総合評価</div>
        </div>
        <div className={`${styles.statCard} ${styles.info}`}>
          <div className={styles.statTrend}>📊</div>
          <div className={styles.statValue}>4.2</div>
          <div className={styles.statLabel}>平均評価点</div>
        </div>
        <div className={`${styles.statCard} ${styles.warning}`}>
          <div className={styles.statTrend}>⬆️</div>
          <div className={styles.statValue}>85%</div>
          <div className={styles.statLabel}>昇進準備度</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTrend}>🎯</div>
          <div className={styles.statValue}>92%</div>
          <div className={styles.statLabel}>目標達成率</div>
        </div>
      </div>

      <div className={`${styles.alert} ${styles.alertWarning}`}>
        <span>⚠️</span>
        <strong>課題:</strong> リーダーシップ評価が他項目より低い、管理経験不足、組織への影響力限定的。
      </div>

      <div className={`${styles.alert} ${styles.alertInfo}`}>
        <span>🎯</span>
        <strong>戦略:</strong> リーダーシップ発揮機会創出、管理代行業務、挑戦的目標設定、成果の可視化。
      </div>

      <div className={styles.chartGrid}>
        <div className={styles.chartContainer}>
          <h4>評価推移（過去2年間）</h4>
          <div className={`${styles.alert} ${styles.alertInfo}`} style={{ margin: '10px 0', fontSize: '11px' }}>
            <span>📈</span>
            <span>時系列での評価変化を追跡。田中さんは一貫した成長軌道を示し、昇進適性が高まっています。</span>
          </div>
          <div className={styles.chartCanvas}>
            <Line data={evaluationTrendData} options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: { min: 1, max: 5 }
              }
            }} />
          </div>
        </div>
        <div className={styles.chartContainer}>
          <h4>評価項目別レーダーチャート</h4>
          <div className={`${styles.alert} ${styles.alertInfo}`} style={{ margin: '10px 0', fontSize: '11px' }}>
            <span>🎯</span>
            <span>5項目の現在値と目標値を比較。リーダーシップが向上ポイントと明確化されています。</span>
          </div>
          <div className={styles.chartCanvas}>
            <Radar data={evaluationRadarData} options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                r: { min: 0, max: 5 }
              }
            }} />
          </div>
        </div>
      </div>

      <div className={styles.infoGrid}>
        <div className={styles.infoCard}>
          <div className={styles.cardTitle}>2024年上期 評価結果</div>
          <div className={`${styles.alert} ${styles.alertSuccess}`} style={{ marginBottom: '15px', fontSize: '11px' }}>
            <span>📊</span>
            <span>最新の詳細評価結果。S-A-B-C-D の5段階評価で、総合A評価を獲得しています。</span>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.progressContainer}>
              <div className={styles.progressLabel}>
                <span>業務成果</span>
                <span>A (4.5)</span>
              </div>
              <div className={styles.progressBar}>
                <div className={`${styles.progressFill} ${styles.skillLevel5}`} style={{ width: '90%' }}>優秀</div>
              </div>
            </div>
            <div className={styles.progressContainer}>
              <div className={styles.progressLabel}>
                <span>専門スキル</span>
                <span>A (4.2)</span>
              </div>
              <div className={styles.progressBar}>
                <div className={`${styles.progressFill} ${styles.skillLevel4}`} style={{ width: '84%' }}>良好</div>
              </div>
            </div>
            <div className={styles.progressContainer}>
              <div className={styles.progressLabel}>
                <span>チームワーク</span>
                <span>S (4.8)</span>
              </div>
              <div className={styles.progressBar}>
                <div className={`${styles.progressFill} ${styles.skillLevel5}`} style={{ width: '96%' }}>最優秀</div>
              </div>
            </div>
            <div className={styles.progressContainer}>
              <div className={styles.progressLabel}>
                <span>リーダーシップ</span>
                <span>B (3.5)</span>
              </div>
              <div className={styles.progressBar}>
                <div className={`${styles.progressFill} ${styles.skillLevel3}`} style={{ width: '70%' }}>向上中</div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.infoCard}>
          <div className={styles.cardTitle}>評価者コメント・フィードバック</div>
          <div className={`${styles.alert} ${styles.alertInfo}`} style={{ marginBottom: '15px', fontSize: '11px' }}>
            <span>💬</span>
            <span>評価者（師長）からの定性的フィードバック。数値では見えない強み・課題・期待を具体化しています。</span>
          </div>
          <div className={styles.cardContent}>
            <strong>優秀な点:</strong><br />
            • 認知症患者への専門的ケアが非常に優秀<br />
            • チームメンバーからの信頼が厚い<br />
            • 新人指導に積極的で教育的配慮がある<br /><br />
            
            <strong>改善点・成長期待:</strong><br />
            • 管理業務スキルの向上が必要<br />
            • より積極的なリーダーシップ発揮を期待<br />
            • 病棟全体の業務改善提案への参画<br /><br />
            
            <strong>次期目標設定:</strong><br />
            • 主任昇進に向けた管理研修受講<br />
            • 病棟QI活動のリーダー経験
          </div>
        </div>
      </div>

      <table className={styles.dataTable}>
        <thead>
          <tr>
            <th>評価期間</th>
            <th>総合評価</th>
            <th>業務成果</th>
            <th>専門性</th>
            <th>協調性</th>
            <th>成長性</th>
            <th>評価者</th>
            <th>昇進・昇格</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2024年上期</td>
            <td><span className={`${styles.statusBadge} ${styles.statusExcellent}`}>A</span></td>
            <td>4.5</td>
            <td>4.2</td>
            <td>4.8</td>
            <td>4.0</td>
            <td>師長</td>
            <td><span className={`${styles.statusBadge} ${styles.statusInProgress}`}>検討中</span></td>
          </tr>
          <tr>
            <td>2023年下期</td>
            <td><span className={`${styles.statusBadge} ${styles.statusGood}`}>B+</span></td>
            <td>4.0</td>
            <td>3.8</td>
            <td>4.5</td>
            <td>3.8</td>
            <td>師長</td>
            <td>-</td>
          </tr>
          <tr>
            <td>2023年上期</td>
            <td><span className={`${styles.statusBadge} ${styles.statusGood}`}>B</span></td>
            <td>3.5</td>
            <td>3.5</td>
            <td>4.2</td>
            <td>3.5</td>
            <td>主任</td>
            <td>-</td>
          </tr>
          <tr>
            <td>2022年下期</td>
            <td><span className={`${styles.statusBadge} ${styles.statusAverage}`}>B-</span></td>
            <td>3.2</td>
            <td>3.2</td>
            <td>3.8</td>
            <td>3.0</td>
            <td>主任</td>
            <td>-</td>
          </tr>
        </tbody>
      </table>
      <div className={`${styles.alert} ${styles.alertSuccess}`} style={{ marginTop: '15px', fontSize: '11px' }}>
        <span>📋</span>
        <span>過去2年間の評価履歴。B-からAへの着実な成長を示し、昇進検討段階に到達しています。</span>
      </div>
    </div>
  )
}

// 採用・配属タブコンポーネント
function RecruitmentTab({ staffData }: { staffData: any }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>👥 採用・配属情報</h2>
        <div className={styles.sectionActions}>
          <button className={styles.sectionAction}>配属変更</button>
          <button className={`${styles.sectionAction} ${styles.secondary}`}>履歴表示</button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.success}`}>
          <div className={styles.statTrend}>📈</div>
          <div className={styles.statValue}>A</div>
          <div className={styles.statLabel}>採用時評価</div>
        </div>
        <div className={`${styles.statCard} ${styles.info}`}>
          <div className={styles.statTrend}>🏥</div>
          <div className={styles.statValue}>3</div>
          <div className={styles.statLabel}>配属履歴数</div>
        </div>
        <div className={`${styles.statCard} ${styles.warning}`}>
          <div className={styles.statTrend}>⏱️</div>
          <div className={styles.statValue}>18ヶ月</div>
          <div className={styles.statLabel}>現配属期間</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTrend}>👨‍⚕️</div>
          <div className={styles.statValue}>95%</div>
          <div className={styles.statLabel}>配属適合度</div>
        </div>
      </div>

      <div className={`${styles.alert} ${styles.alertWarning}`}>
        <span>⚠️</span>
        <strong>注意点:</strong> 現配属期間18ヶ月。昇進後の配属調整、より広範囲な経験機会の提供を検討時期。
      </div>

      <div className={`${styles.alert} ${styles.alertInfo}`}>
        <span>💡</span>
        <strong>推奨アプローチ:</strong> 現配属継続しつつ、他病棟ローテーション研修や連携プロジェクトでの経験拡大。
      </div>

      <div className={styles.infoGrid}>
        <div className={styles.infoCard}>
          <div className={styles.cardTitle}>採用情報</div>
          <div className={`${styles.alert} ${styles.alertInfo}`} style={{ marginBottom: '15px', fontSize: '11px' }}>
            <span>📝</span>
            <span>採用時の基本情報。中途採用者の前職経験と当院での適応状況を把握できます。</span>
          </div>
          <div className={styles.cardContent}>
            <strong>採用区分:</strong> 中途採用（経験者採用）<br />
            <strong>前職:</strong> 総合病院（急性期病棟 3年）<br />
            <strong>採用理由:</strong> 地域包括ケア経験、リーダーシップ素質<br />
            <strong>初期配属:</strong> 一般病棟（適応期間 6ヶ月）<br />
            <strong>採用時給与:</strong> 基本給 285,000円
          </div>
        </div>

        <div className={styles.infoCard}>
          <div className={styles.cardTitle}>配属適性分析</div>
          <div className={`${styles.alert} ${styles.alertSuccess}`} style={{ marginBottom: '15px', fontSize: '11px' }}>
            <span>🎯</span>
            <span>各病棟・分野での適性をスコア化。地域包括ケアでの高い適性が昇進根拠となっています。</span>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.progressContainer}>
              <div className={styles.progressLabel}>
                <span>急性期対応</span>
                <span>85%</span>
              </div>
              <div className={styles.progressBar}>
                <div className={`${styles.progressFill} ${styles.skillLevel4}`} style={{ width: '85%' }}>熟練</div>
              </div>
            </div>
            <div className={styles.progressContainer}>
              <div className={styles.progressLabel}>
                <span>地域包括ケア</span>
                <span>92%</span>
              </div>
              <div className={styles.progressBar}>
                <div className={`${styles.progressFill} ${styles.skillLevel5}`} style={{ width: '92%' }}>専門</div>
              </div>
            </div>
            <div className={styles.progressContainer}>
              <div className={styles.progressLabel}>
                <span>チームワーク</span>
                <span>96%</span>
              </div>
              <div className={styles.progressBar}>
                <div className={`${styles.progressFill} ${styles.skillLevel5}`} style={{ width: '96%' }}>優秀</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.timeline}>
        <div className={`${styles.alert} ${styles.alertInfo}`} style={{ marginBottom: '20px', fontSize: '11px' }}>
          <span>📅</span>
          <span>配属履歴の時系列表示。各配属での成長と適応過程を把握し、次の配属判断に活用します。</span>
        </div>
        <div className={styles.timelineItem}>
          <div className={styles.timelineDate}>2023年6月1日</div>
          <div className={styles.timelineTitle}>地域包括ケア病棟 配属</div>
          <div className={styles.timelineContent}>
            専門性向上とリーダーシップ経験のため配属。認知症ケアと退院調整に注力。
          </div>
        </div>
        <div className={styles.timelineItem}>
          <div className={styles.timelineDate}>2021年10月1日</div>
          <div className={styles.timelineTitle}>内科病棟 配属</div>
          <div className={styles.timelineContent}>
            病院システム習得期間終了後、内科病棟にて基礎スキル向上と院内文化適応。
          </div>
        </div>
        <div className={styles.timelineItem}>
          <div className={styles.timelineDate}>2021年4月1日</div>
          <div className={styles.timelineTitle}>入職・オリエンテーション</div>
          <div className={styles.timelineContent}>
            中途採用での入職。3ヶ月間のオリエンテーションプログラム完了。
          </div>
        </div>
      </div>
    </div>
  )
}

// 面談・指導タブコンポーネント
function InterviewTab({ staffData }: { staffData: any }) {
  // 面談実施頻度・満足度推移チャート
  const interviewFrequencyData = {
    labels: ['2023 Q4', '2024 Q1', '2024 Q2', '2024 Q3', '2024 Q4'],
    datasets: [{
      label: '実施回数',
      data: [2, 3, 4, 3, 4],
      borderColor: '#007bff',
      backgroundColor: 'rgba(0, 123, 255, 0.1)',
      fill: true,
      yAxisID: 'y'
    }, {
      label: '満足度',
      data: [4.2, 4.4, 4.6, 4.5, 4.7],
      borderColor: '#28a745',
      backgroundColor: 'transparent',
      fill: false,
      yAxisID: 'y1'
    }]
  }

  // 面談テーマ別分布チャート
  const interviewTopicsData = {
    labels: ['キャリア相談', '業務改善', 'WLバランス', '人間関係', 'スキル開発', 'その他'],
    datasets: [{
      data: [35, 20, 15, 10, 15, 5],
      backgroundColor: ['#007bff', '#28a745', '#ffc107', '#17a2b8', '#dc3545', '#6c757d']
    }]
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>💬 面談・指導・職場環境管理</h2>
        <div className={styles.sectionActions}>
          <button className={styles.sectionAction}>面談予約</button>
          <button className={`${styles.sectionAction} ${styles.secondary}`}>記録入力</button>
          <button className={`${styles.sectionAction} ${styles.secondary}`}>ストレス面談</button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.success}`}>
          <div className={styles.statTrend}>📅</div>
          <div className={styles.statValue}>12</div>
          <div className={styles.statLabel}>年間面談回数</div>
        </div>
        <div className={`${styles.statCard} ${styles.info}`}>
          <div className={styles.statTrend}>⭐</div>
          <div className={styles.statValue}>4.6</div>
          <div className={styles.statLabel}>面談満足度</div>
        </div>
        <div className={`${styles.statCard} ${styles.warning}`}>
          <div className={styles.statTrend}>🕐</div>
          <div className={styles.statValue}>12h</div>
          <div className={styles.statLabel}>月平均残業時間</div>
        </div>
        <div className={`${styles.statCard} ${styles.success}`}>
          <div className={styles.statTrend}>🌴</div>
          <div className={styles.statValue}>78%</div>
          <div className={styles.statLabel}>有給取得率</div>
        </div>
        <div className={`${styles.statCard} ${styles.info}`}>
          <div className={styles.statTrend}>🧠</div>
          <div className={styles.statValue}>48</div>
          <div className={styles.statLabel}>ストレス指数</div>
        </div>
        <div className={`${styles.statCard} ${styles.success}`}>
          <div className={styles.statTrend}>💝</div>
          <div className={styles.statValue}>95%</div>
          <div className={styles.statLabel}>エンゲージメント</div>
        </div>
      </div>

      <div className={`${styles.alert} ${styles.alertWarning}`}>
        <span>🔍</span>
        <strong>監視事項:</strong> 昇進プレッシャー、完璧主義傾向、過労リスクに要注意。
      </div>

      <div className={`${styles.alert} ${styles.alertInfo}`}>
        <span>💡</span>
        <strong>支援策:</strong> 月次メンタルチェック、段階的責任移譲、セルフケア指導、ピアサポート強化。
      </div>

      <div className={styles.chartGrid}>
        <div className={styles.chartContainer}>
          <h4>面談実施頻度・満足度推移</h4>
          <div className={`${styles.alert} ${styles.alertInfo}`} style={{ margin: '10px 0', fontSize: '11px' }}>
            <span>📈</span>
            <span>四半期別の面談実施状況と満足度の相関分析。継続的な質の高い面談が職員満足度向上に寄与しています。</span>
          </div>
          <div className={styles.chartCanvas}>
            <Line data={interviewFrequencyData} options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  title: { display: true, text: '実施回数' }
                },
                y1: {
                  type: 'linear',
                  display: true,
                  position: 'right',
                  title: { display: true, text: '満足度（5点満点）' },
                  min: 1,
                  max: 5,
                  grid: { drawOnChartArea: false }
                }
              }
            }} />
          </div>
        </div>
        <div className={styles.chartContainer}>
          <h4>面談テーマ別分布</h4>
          <div className={`${styles.alert} ${styles.alertInfo}`} style={{ margin: '10px 0', fontSize: '11px' }}>
            <span>🎯</span>
            <span>面談内容の分析により、職員の関心事や課題傾向を把握。キャリア相談が35%で最多です。</span>
          </div>
          <div className={styles.chartCanvas}>
            <Doughnut data={interviewTopicsData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'bottom' as const },
                tooltip: {
                  callbacks: {
                    label: function(context: any) {
                      return context.label + ': ' + context.parsed + '%';
                    }
                  }
                }
              }
            }} />
          </div>
        </div>
      </div>

      <div className={styles.infoGrid}>
        <div className={styles.infoCard}>
          <div className={styles.cardTitle}>🕐 勤務状況・労働時間管理</div>
          <div className={`${styles.alert} ${styles.alertSuccess}`} style={{ marginBottom: '15px', fontSize: '11px' }}>
            <span>⏰</span>
            <span>総務部から提供される勤務データの統合管理。法令遵守と健康管理の両面から評価します。</span>
          </div>
          <div className={styles.cardContent}>
            <strong>労働時間詳細:</strong><br />
            • 月平均残業時間: 12時間（目敹15時間以下）✅<br />
            • 有給取得率: 78%（15日/20日取得）<br />
            • 連続休暇取得: 年2回実施（夏季・年末）<br />
            • 休日出勤頻度: 月0.5回（低頻度）<br />
            • 時間外労働適正性: 85%（良好）<br /><br />
            
            <strong>勤務パターン分析:</strong><br />
            • 早番/遅番バランス: 良好（適正配分）<br />
            • 夜勤回数: 月4回（適正範囲内）<br />
            • シフト希望反映率: 90%（高反映）<br />
            • 急な変更対応: 月1回程度（協力的）<br /><br />
            
            <strong>法令遵守状況:</strong><br />
            • 36協定遵守: ✅ 完全遵守<br />
            • インターバル確保: ✅ 11時間以上<br />
            • 週休2日: ✅ 確実に実施<br />
            • 労働安全衛生: ✅ 基準内
          </div>
        </div>

        <div className={styles.infoCard}>
          <div className={styles.cardTitle}>🧠 メンタルヘルス・ストレスチェック</div>
          <div className={`${styles.alert} ${styles.alertWarning}`} style={{ marginBottom: '15px', fontSize: '11px' }}>
            <span>🧠</span>
            <span>厚労省基準のストレスチェック結果統合。健診部連携により予防的メンタルヘルス管理を実施します。</span>
          </div>
          <div className={styles.cardContent}>
            <strong>ストレスチェック結果詳細:</strong><br />
            • 総合ストレス指数: 48点/99点（低ストレス）<br />
            • 仕事の負担感: 16点/29点<br />
            • 職場のサポート: 18点/27点<br />
            • 満足度: 14点/18点<br /><br />
            
            <strong>実施履歴:</strong><br />
            • 2024年10月: 48点（低ストレス）<br />
            • 2024年4月: 52点（低ストレス）<br />
            • 2023年10月: 58点（中程度ストレス）<br /><br />
            
            <strong>面談実施状況:</strong><br />
            • 保健師面談: 年2回実施<br />
            • 産業医面談: 希望時実施可能<br />
            • ストレス軽減プログラム: 参加中
          </div>
        </div>

        <div className={styles.infoCard}>
          <div className={styles.cardTitle}>💖 エンゲージメント・職場環境</div>
          <div className={`${styles.alert} ${styles.alertSuccess}`} style={{ marginBottom: '15px', fontSize: '11px' }}>
            <span>💝</span>
            <span>職員満足度とエンゲージメント分析。心理的安全性100%は離職防止と生産性向上の重要指標です。</span>
          </div>
          <div className={styles.cardContent}>
            <strong>エンゲージメント指標:</strong><br />
            • エンゲージメントスコア: 95%<br />
            • 継続勤務意向: 96%<br />
            • 推奨意向（eNPS）: +85<br />
            • 職務満足度: 92%<br /><br />
            
            <strong>心理的安全性:</strong><br />
            • 心理的安全性スコア: 100%<br />
            • 発言しやすさ: 100%<br />
            • 相談しやすさ: 98%<br />
            • ハラスメント相談履歴: なし<br /><br />
            
            <strong>ワークライフバランス:</strong><br />
            • WLバランス総合: 82点<br />
            • 有給取得満足度: 85%<br />
            • 勤務シフト満足度: 90%<br />
            • プライベート時間確保: 86%<br />
            • 家族時間満足度: 82%
          </div>
        </div>
      </div>

      <table className={styles.dataTable}>
        <thead>
          <tr>
            <th>実施日</th>
            <th>面談者</th>
            <th>種別</th>
            <th>主なテーマ</th>
            <th>満足度</th>
            <th>ストレス関連</th>
            <th>エンゲージメント</th>
            <th>フォロー状況</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2024/10/28</td>
            <td>師長</td>
            <td>キャリア面談</td>
            <td>主任昇進準備・スキル開発</td>
            <td><span className={`${styles.statusBadge} ${styles.statusExcellent}`}>5/5</span></td>
            <td>昇進プレッシャー軽減</td>
            <td>向上</td>
            <td><span className={`${styles.statusBadge} ${styles.statusInProgress}`}>進行中</span></td>
          </tr>
          <tr>
            <td>2024/09/15</td>
            <td>保健師</td>
            <td>健康・勤務面談</td>
            <td>ストレスチェック・残業時間</td>
            <td><span className={`${styles.statusBadge} ${styles.statusGood}`}>4/5</span></td>
            <td>ストレス軽減策</td>
            <td>維持</td>
            <td><span className={`${styles.statusBadge} ${styles.statusCompleted}`}>完了</span></td>
          </tr>
          <tr>
            <td>2024/08/10</td>
            <td>人事部</td>
            <td>勤務状況確認</td>
            <td>有給取得計画・WLバランス</td>
            <td><span className={`${styles.statusBadge} ${styles.statusGood}`}>4/5</span></td>
            <td>有給取得促進</td>
            <td>向上</td>
            <td><span className={`${styles.statusBadge} ${styles.statusCompleted}`}>完了</span></td>
          </tr>
          <tr>
            <td>2024/07/10</td>
            <td>師長</td>
            <td>目標設定面談</td>
            <td>下半期目標・研修計画</td>
            <td><span className={`${styles.statusBadge} ${styles.statusExcellent}`}>5/5</span></td>
            <td>-</td>
            <td>向上</td>
            <td><span className={`${styles.statusBadge} ${styles.statusCompleted}`}>完了</span></td>
          </tr>
          <tr>
            <td>2024/05/20</td>
            <td>人事部</td>
            <td>職場環境調査</td>
            <td>心理的安全性・ハラスメント</td>
            <td><span className={`${styles.statusBadge} ${styles.statusExcellent}`}>5/5</span></td>
            <td>環境改善提案</td>
            <td>維持</td>
            <td><span className={`${styles.statusBadge} ${styles.statusCompleted}`}>完了</span></td>
          </tr>
        </tbody>
      </table>
      <div className={`${styles.alert} ${styles.alertInfo}`} style={{ marginTop: '15px', fontSize: '11px' }}>
        <span>📝</span>
        <span>面談履歴の詳細記録。ストレス・エンゲージメント・勤務状況を統合的に管理し、継続的な職員支援を実現します。</span>
      </div>

      <div className={styles.actionItems}>
        <div className={`${styles.actionItem} ${styles.priorityHigh}`}>
          <div className={styles.actionTitle}>🧠 メンタルヘルス継続管理</div>
          <div className={`${styles.alert} ${styles.alertWarning}`} style={{ marginBottom: '10px', fontSize: '11px' }}>
            <span>⚠️</span>
            <span>昇進プレッシャーへの予防的対応。完璧主義傾向の緩和と適切な休息確保が重要です。</span>
          </div>
          <div className={styles.actionContent}>
            <strong>早期発見・介入:</strong><br />
            • 月次ストレス指数モニタリング<br />
            • 昇進プレッシャー軽減支援<br />
            • 完璧主義傾向への対応<br />
            • 適切な休息確保の指導
          </div>
          <div className={styles.actionDue}>継続実施・次回確認: 2025年1月15日</div>
        </div>
        <div className={`${styles.actionItem} ${styles.priorityMedium}`}>
          <div className={styles.actionTitle}>🕐 勤務状況・労働時間管理</div>
          <div className={`${styles.alert} ${styles.alertSuccess}`} style={{ marginBottom: '10px', fontSize: '11px' }}>
            <span>✅</span>
            <span>総務部連携による法令遵守管理。36協定・労働安全衛生法の完全遵守を継続します。</span>
          </div>
          <div className={styles.actionContent}>
            <strong>労働時間適正化:</strong><br />
            • 残業時間継続モニタリング（目敹15h以下維持）<br />
            • 有給取得率向上（目敹85%以上）<br />
            • 連続休暇取得の計画的実施<br />
            • 夜勤負担軽減・シフト最適化<br /><br />
            
            <strong>法令遵守・健康管理:</strong><br />
            • 36協定遵守の継続確認<br />
            • インターバル確保の徹底<br />
            • 疲労蓄積度チェック<br />
            • 勤務間隔適正化
          </div>
          <div className={styles.actionDue}>月次確認・四半期評価</div>
        </div>
        <div className={`${styles.actionItem} ${styles.priorityLow}`}>
          <div className={styles.actionTitle}>💝 エンゲージメント維持強化</div>
          <div className={`${styles.alert} ${styles.alertInfo}`} style={{ marginBottom: '10px', fontSize: '11px' }}>
            <span>🌟</span>
            <span>高エンゲージメントの維持戦略。心理的安全性100%の環境を活かした成長支援を継続します。</span>
          </div>
          <div className={styles.actionContent}>
            <strong>職場環境改善:</strong><br />
            • 心理的安全性の継続維持<br />
            • チーム内コミュニケーション支援<br />
            • キャリア開発機会の提供<br />
            • 成果認知・評価の可視化<br /><br />
            
            <strong>WLバランス改善:</strong><br />
            • 有給取得計画の継続実行<br />
            • 家族時間確保の支援<br />
            • ストレス発散機会の提供
          </div>
          <div className={styles.actionDue}>四半期ごと評価</div>
        </div>
      </div>
    </div>
  )
}

// 能力開発タブコンポーネント
function DevelopmentTab({ staffData }: { staffData: any }) {
  // スキル成長軌跡チャート
  const skillGrowthData = {
    labels: ['入職時', '1年後', '2年後', '3年後', '現在'],
    datasets: [{
      label: '基礎看護技術',
      data: [3.2, 3.5, 3.8, 4.0, 4.0],
      borderColor: '#007bff',
      backgroundColor: 'transparent'
    }, {
      label: '専門分野',
      data: [2.8, 3.5, 4.2, 4.6, 5.0],
      borderColor: '#28a745',
      backgroundColor: 'transparent'
    }, {
      label: 'リーダーシップ',
      data: [2.0, 2.3, 2.8, 3.2, 3.5],
      borderColor: '#ffc107',
      backgroundColor: 'transparent'
    }, {
      label: '管理業務',
      data: [1.5, 1.8, 2.2, 2.8, 3.0],
      borderColor: '#dc3545',
      backgroundColor: 'transparent'
    }]
  }

  // キャリアロードマップチャート
  const careerRoadmapData = {
    labels: ['現在', '6ヶ月後', '1年後', '2年後', '3年後'],
    datasets: [{
      label: '予測スキルレベル',
      data: [3.4, 3.8, 4.2, 4.5, 4.7],
      backgroundColor: ['#6c757d', '#ffc107', '#17a2b8', '#28a745', '#007bff']
    }]
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>🚀 能力開発・キャリア支援</h2>
        <div className={styles.sectionActions}>
          <button className={styles.sectionAction}>開発計画作成</button>
          <button className={`${styles.sectionAction} ${styles.secondary}`}>スキル測定</button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.success}`}>
          <div className={styles.statTrend}>📈</div>
          <div className={styles.statValue}>4.2</div>
          <div className={styles.statLabel}>平均スキルレベル</div>
        </div>
        <div className={`${styles.statCard} ${styles.info}`}>
          <div className={styles.statTrend}>🎯</div>
          <div className={styles.statValue}>85%</div>
          <div className={styles.statLabel}>開発目標達成率</div>
        </div>
        <div className={`${styles.statCard} ${styles.warning}`}>
          <div className={styles.statTrend}>📚</div>
          <div className={styles.statValue}>3</div>
          <div className={styles.statLabel}>重点強化分野</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTrend}>⭐</div>
          <div className={styles.statValue}>2</div>
          <div className={styles.statLabel}>専門資格取得数</div>
        </div>
      </div>

      <div className={`${styles.alert} ${styles.alertWarning}`}>
        <span>📚</span>
        <strong>課題:</strong> 管理スキル不足、実践機会不足、学術活動参加が限定的。
      </div>

      <div className={`${styles.alert} ${styles.alertInfo}`}>
        <span>🎯</span>
        <strong>戦略:</strong> 管理職集中研修、他施設研修、データ分析スキル強化、学会参加支援。
      </div>

      <div className={styles.chartGrid}>
        <div className={styles.chartContainer}>
          <h4>スキル成長軌跡</h4>
          <div className={`${styles.alert} ${styles.alertInfo}`} style={{ margin: '10px 0', fontSize: '11px' }}>
            <span>📊</span>
            <span>入職時からの成長推移。専門分野は5段階中5、管理業務は2から3へ向上中です。</span>
          </div>
          <div className={styles.chartCanvas}>
            <Line data={skillGrowthData} options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: { min: 1, max: 5 }
              }
            }} />
          </div>
        </div>
        <div className={styles.chartContainer}>
          <h4>キャリアロードマップ</h4>
          <div className={`${styles.alert} ${styles.alertSuccess}`} style={{ margin: '10px 0', fontSize: '11px' }}>
            <span>🗺️</span>
            <span>3年後の目標スキルレベル4.7を設定。主任として必要な管理・リーダーシップスキルの獲得を計画しています。</span>
          </div>
          <div className={styles.chartCanvas}>
            <Bar data={careerRoadmapData} options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: { min: 1, max: 5 }
              }
            }} />
          </div>
        </div>
      </div>

      <div className={styles.infoGrid}>
        <div className={styles.infoCard}>
          <div className={styles.cardTitle}>現在のスキルレベル</div>
          <div className={`${styles.alert} ${styles.alertInfo}`} style={{ marginBottom: '15px', fontSize: '11px' }}>
            <span>⭐</span>
            <span>5段階評価によるスキル可視化。レベル3が標準、レベル4以上が昇進基準となります。</span>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.progressContainer}>
              <div className={styles.progressLabel}>
                <span>基礎看護技術</span>
                <span>レベル 4 (熟練)</span>
              </div>
              <div className={styles.progressBar}>
                <div className={`${styles.progressFill} ${styles.skillLevel4}`} style={{ width: '80%' }}>熟練</div>
              </div>
            </div>
            <div className={styles.progressContainer}>
              <div className={styles.progressLabel}>
                <span>専門分野（認知症ケア）</span>
                <span>レベル 5 (専門)</span>
              </div>
              <div className={styles.progressBar}>
                <div className={`${styles.progressFill} ${styles.skillLevel5}`} style={{ width: '100%' }}>専門</div>
              </div>
            </div>
            <div className={styles.progressContainer}>
              <div className={styles.progressLabel}>
                <span>チームワーク・協調性</span>
                <span>レベル 5 (優秀)</span>
              </div>
              <div className={styles.progressBar}>
                <div className={`${styles.progressFill} ${styles.skillLevel5}`} style={{ width: '96%' }}>優秀</div>
              </div>
            </div>
            <div className={styles.progressContainer}>
              <div className={styles.progressLabel}>
                <span>リーダーシップ</span>
                <span>レベル 3 (向上中)</span>
              </div>
              <div className={styles.progressBar}>
                <div className={`${styles.progressFill} ${styles.skillLevel3}`} style={{ width: '60%' }}>向上中</div>
              </div>
            </div>
            <div className={styles.progressContainer}>
              <div className={styles.progressLabel}>
                <span>管理業務</span>
                <span>レベル 2 (習得中)</span>
              </div>
              <div className={styles.progressBar}>
                <div className={`${styles.progressFill} ${styles.skillLevel2}`} style={{ width: '40%' }}>習得中</div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.infoCard}>
          <div className={styles.cardTitle}>2025年度 開発目標</div>
          <div className={`${styles.alert} ${styles.alertWarning}`} style={{ marginBottom: '15px', fontSize: '11px' }}>
            <span>🎯</span>
            <span>SMART原則に基づく具体的な年間目標設定。昇進に必要なスキル習得の詳細計画です。</span>
          </div>
          <div className={styles.cardContent}>
            <strong>🎯 主要目標:</strong><br />
            • 主任昇進に向けた管理スキル向上<br />
            • リーダーシップ能力の強化<br />
            • 病棟QI活動のリーダー経験<br /><br />
            
            <strong>📚 学習計画:</strong><br />
            • 管理職準備研修（Q1）<br />
            • 上級リーダーシップ研修（Q2）<br />
            • 人事評価研修（Q3）<br /><br />
            
            <strong>🎓 資格取得目標:</strong><br />
            • 認知症ケア専門士（更新）<br />
            • 看護師長候補者認定
          </div>
        </div>
      </div>

      <div className={styles.timeline}>
        <div className={`${styles.alert} ${styles.alertInfo}`} style={{ marginBottom: '20px', fontSize: '11px' }}>
          <span>📅</span>
          <span>キャリア開発の時系列計画。各マイルストーンでの成長目標と実施内容を明確化しています。</span>
        </div>
        <div className={styles.timelineItem}>
          <div className={styles.timelineDate}>2025年3月予定</div>
          <div className={styles.timelineTitle}>管理職準備研修 受講予定</div>
          <div className={styles.timelineContent}>
            主任昇進に向けた必須研修。管理業務の基礎、人事評価制度、労務管理等を学習。
          </div>
        </div>
        <div className={styles.timelineItem}>
          <div className={styles.timelineDate}>2024年12月</div>
          <div className={styles.timelineTitle}>病棟QI活動リーダー開始</div>
          <div className={styles.timelineContent}>
            褥創発生率低減プロジェクトのリーダーとして、チーム運営とデータ分析スキルを実践。
          </div>
        </div>
        <div className={styles.timelineItem}>
          <div className={styles.timelineDate}>2024年10月</div>
          <div className={styles.timelineTitle}>リーダーシップ研修 修了</div>
          <div className={styles.timelineContent}>
            優秀な成績で修了。実践的なリーダーシップスキルとコミュニケーション能力を向上。
          </div>
        </div>
      </div>

      <div className={styles.actionItems}>
        <div className={`${styles.actionItem} ${styles.priorityHigh}`}>
          <div className={styles.actionTitle}>🎯 重点強化分野</div>
          <div className={`${styles.alert} ${styles.alertDanger}`} style={{ marginBottom: '10px', fontSize: '11px' }}>
            <span>⚡</span>
            <span>昇進必須スキル。管理業務レベル4達成が主任昇進の絶対条件となります。</span>
          </div>
          <div className={styles.actionContent}>
            <strong>管理業務スキル:</strong><br />
            • スタッフスケジュール管理<br />
            • 予算管理基礎<br />
            • 人事評価実施<br />
            • 会議運営・進行
          </div>
          <div className={styles.actionDue}>目標レベル: 4（2025年12月まで）</div>
        </div>
        <div className={`${styles.actionItem} ${styles.priorityMedium}`}>
          <div className={styles.actionTitle}>📈 継続強化分野</div>
          <div className={`${styles.alert} ${styles.alertWarning}`} style={{ marginBottom: '10px', fontSize: '11px' }}>
            <span>🚀</span>
            <span>主任として必要なリーダーシップスキル。現在レベル3から4への向上を目指します。</span>
          </div>
          <div className={styles.actionContent}>
            <strong>リーダーシップ:</strong><br />
            • チームビルディング<br />
            • 問題解決・意思決定<br />
            • 後輩指導・メンタリング<br />
            • 変革推進力
          </div>
          <div className={styles.actionDue}>目標レベル: 4（2025年6月まで）</div>
        </div>
        <div className={`${styles.actionItem} ${styles.priorityLow}`}>
          <div className={styles.actionTitle}>⭐ 専門性維持</div>
          <div className={`${styles.alert} ${styles.alertSuccess}`} style={{ marginBottom: '10px', fontSize: '11px' }}>
            <span>✨</span>
            <span>既に最高レベルの専門性。院内指導者として知識の共有と後進育成に注力します。</span>
          </div>
          <div className={styles.actionContent}>
            <strong>認知症ケア:</strong><br />
            • 最新知識のアップデート<br />
            • 専門士資格の更新<br />
            • 院内指導者としての活動<br />
            • 学会発表・論文執筆
          </div>
          <div className={styles.actionDue}>継続的に実施</div>
        </div>
      </div>
    </div>
  )
}

// 看護師専用の教育・研修タブコンポーネント
function NurseEducationTab({ staffData }: { staffData: any }) {
  // JNAラダーレベル進捗データ
  const jnaLadderProgressData = {
    labels: ['看護実践能力', '組織的役割遂行能力', '自己教育・研究能力', '倫理的実践能力'],
    datasets: [{
      label: '現在のレベル',
      data: [4, 3, 3, 4],
      backgroundColor: 'rgba(155, 124, 203, 0.2)',
      borderColor: '#9b7cb6',
      pointBackgroundColor: '#9b7cb6',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#9b7cb6'
    }]
  }

  // JNAラダーレベル成長履歴
  const jnaLadderHistoryData = {
    labels: ['2022年4月', '2022年10月', '2023年4月', '2023年10月', '2024年4月', '2024年10月', '2025年1月'],
    datasets: [{
      label: 'JNAラダーレベル',
      data: [2, 2, 3, 3, 3, 4, 4],
      borderColor: '#9b7cb6',
      backgroundColor: 'rgba(155, 124, 203, 0.1)',
      tension: 0.1,
      fill: true
    }]
  }

  // 研修受講状況（必須・選択別）
  const trainingCompletionData = {
    labels: ['必須研修', '選択研修'],
    datasets: [{
      data: [100, 85],
      backgroundColor: ['#28a745', '#17a2b8'],
      borderWidth: 0
    }]
  }

  // 年間研修計画進捗
  const annualTrainingPlanData = {
    labels: ['医療安全', '感染対策', 'BLS', '看護倫理', '褥創ケア', '認知症ケア', 'がん看護', '緩和ケア'],
    datasets: [{
      label: '完了',
      data: [100, 100, 100, 100, 100, 100, 80, 60],
      backgroundColor: '#28a745'
    }, {
      label: '進行中',
      data: [0, 0, 0, 0, 0, 0, 20, 40],
      backgroundColor: '#ffc107'
    }, {
      label: '未着手',
      data: [0, 0, 0, 0, 0, 0, 0, 0],
      backgroundColor: '#dc3545'
    }]
  }

  // 看護技術習得状況（スキルマップ）
  const nursingSkillsData = {
    labels: [
      '環境調整技術',
      '食事援助技術',
      '排泄援助技術',
      '活動・休息援助技術',
      '清潔・衣生活援助技術',
      '呼吸・循環を整える技術',
      '創傷管理技術',
      '与薬の技術',
      '救命救急処置技術',
      '症状・生体機能管理技術',
      '感染防止の技術',
      '安全確保の技術',
      '安楽確保の技術'
    ],
    datasets: [{
      label: '習得レベル',
      data: [5, 5, 5, 4, 5, 4, 4, 5, 4, 4, 5, 5, 4],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgb(75, 192, 192)',
      pointBackgroundColor: 'rgb(75, 192, 192)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(75, 192, 192)'
    }]
  }

  // 専門領域別習熟度
  const specialtyProficiencyData = {
    labels: ['基礎看護', '成人看護', '老年看護', '精神看護', '在宅看護', '家族看護', 'チーム医療'],
    datasets: [{
      label: '習熟度',
      data: [95, 90, 95, 75, 70, 80, 90],
      backgroundColor: 'rgba(255, 159, 64, 0.2)',
      borderColor: 'rgb(255, 159, 64)',
      pointBackgroundColor: 'rgb(255, 159, 64)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(255, 159, 64)'
    }]
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>🎓 看護師教育・研修管理</h2>
        <div className={styles.sectionActions}>
          <button className={styles.sectionAction}>研修申込</button>
          <button className={`${styles.sectionAction} ${styles.secondary}`}>ポートフォリオ</button>
          <button className={`${styles.sectionAction} ${styles.secondary}`}>年間計画</button>
        </div>
      </div>

      {/* JNAラダーレベル進捗 */}
      <div className={styles.chartGrid} style={{ marginBottom: '30px' }}>
        <div className={styles.chartContainer}>
          <h4>📊 JNAラダーレベル進捗</h4>
          <div className={`${styles.alert} ${styles.alertInfo}`} style={{ margin: '10px 0', fontSize: '11px' }}>
            <span>🎯</span>
            <span>現在のJNAラダーレベル: <strong>レベルⅣ</strong> - 幅広い視野で予測的判断をもった看護実践ができる</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '15px' }}>
            <div style={{ 
              background: 'linear-gradient(90deg, #9b7cb6 0%, #b8a1d1 80%, #e0e0e0 80%)', 
              height: '30px', 
              flex: 1, 
              borderRadius: '15px',
              position: 'relative',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <span style={{ 
                position: 'absolute', 
                left: '50%', 
                top: '50%', 
                transform: 'translate(-50%, -50%)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '12px'
              }}>レベルⅤまで80%</span>
            </div>
          </div>
          <div className={styles.chartCanvas} style={{ height: '250px' }}>
            <Radar data={jnaLadderProgressData} options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                r: {
                  beginAtZero: true,
                  max: 5,
                  ticks: {
                    stepSize: 1
                  }
                }
              },
              plugins: {
                legend: {
                  display: false
                }
              }
            }} />
          </div>
        </div>
        <div className={styles.chartContainer}>
          <h4>📈 成長履歴</h4>
          <div className={`${styles.alert} ${styles.alertSuccess}`} style={{ margin: '10px 0', fontSize: '11px' }}>
            <span>✨</span>
            <span>順調な成長を継続。2025年度内にレベルⅤ（エキスパート）到達見込み</span>
          </div>
          <div className={styles.chartCanvas} style={{ height: '295px' }}>
            <Line data={jnaLadderHistoryData} options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  max: 5,
                  ticks: {
                    stepSize: 1
                  }
                }
              }
            }} />
          </div>
        </div>
      </div>

      {/* 研修受講状況ダッシュボード */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.success}`}>
          <div className={styles.statTrend}>📚</div>
          <div className={styles.statValue}>100%</div>
          <div className={styles.statLabel}>必須研修完了率</div>
          <div style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>全12研修完了</div>
        </div>
        <div className={`${styles.statCard} ${styles.info}`}>
          <div className={styles.statTrend}>⏰</div>
          <div className={styles.statValue}>156h</div>
          <div className={styles.statLabel}>年間研修時間</div>
          <div style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>目標120h達成</div>
        </div>
        <div className={`${styles.statCard} ${styles.warning}`}>
          <div className={styles.statTrend}>🎓</div>
          <div className={styles.statValue}>48単位</div>
          <div className={styles.statLabel}>継続教育単位</div>
          <div style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>更新まで12単位</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTrend}>🏆</div>
          <div className={styles.statValue}>8個</div>
          <div className={styles.statLabel}>取得バッジ数</div>
          <div style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>プリセプター認定済</div>
        </div>
      </div>

      <div className={styles.chartGrid}>
        <div className={styles.chartContainer}>
          <h4>研修完了状況</h4>
          <div className={styles.chartCanvas} style={{ height: '250px' }}>
            <Doughnut data={trainingCompletionData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom'
                }
              }
            }} />
          </div>
        </div>
        <div className={styles.chartContainer}>
          <h4>年間研修計画進捗</h4>
          <div className={styles.chartCanvas} style={{ height: '250px' }}>
            <Bar data={annualTrainingPlanData} options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  stacked: true,
                },
                y: {
                  stacked: true,
                  max: 100
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

      {/* スキルマップ */}
      <div className={styles.chartGrid} style={{ marginTop: '30px' }}>
        <div className={styles.chartContainer}>
          <h4>🗺️ 看護技術習得状況</h4>
          <div className={`${styles.alert} ${styles.alertInfo}`} style={{ margin: '10px 0', fontSize: '11px' }}>
            <span>💡</span>
            <span>厚生労働省「新人看護職員研修ガイドライン」に基づく技術項目別習得レベル（1-5段階）</span>
          </div>
          <div className={styles.chartCanvas} style={{ height: '300px' }}>
            <Radar data={nursingSkillsData} options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                r: {
                  beginAtZero: true,
                  max: 5,
                  ticks: {
                    stepSize: 1
                  }
                }
              }
            }} />
          </div>
        </div>
        <div className={styles.chartContainer}>
          <h4>🏥 専門領域別習熟度</h4>
          <div className={`${styles.alert} ${styles.alertSuccess}`} style={{ margin: '10px 0', fontSize: '11px' }}>
            <span>⭐</span>
            <span>老年看護・成人看護で特に高い専門性。認知症ケア専門士として院内指導も実施</span>
          </div>
          <div className={styles.chartCanvas} style={{ height: '300px' }}>
            <Radar data={specialtyProficiencyData} options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                r: {
                  beginAtZero: true,
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

      {/* 個人学習計画 */}
      <div className={styles.section} style={{ marginTop: '30px' }}>
        <h3>📋 2025年度 個人学習計画</h3>
        <div className={`${styles.alert} ${styles.alertWarning}`}>
          <span>🎯</span>
          <strong>年間目標:</strong> JNAラダーレベルⅤ認定取得、主任看護師への昇進準備、後輩指導力の向上
        </div>
        
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>研修名</th>
              <th>分類</th>
              <th>実施予定</th>
              <th>目的</th>
              <th>ステータス</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>管理職準備研修</td>
              <td><span className={styles.badge} style={{ backgroundColor: '#dc3545' }}>必須</span></td>
              <td>2025年2月</td>
              <td>主任昇進準備</td>
              <td><span className={`${styles.statusBadge} ${styles.statusPending}`}>申込済</span></td>
            </tr>
            <tr>
              <td>人事評価者研修</td>
              <td><span className={styles.badge} style={{ backgroundColor: '#ffc107' }}>推奨</span></td>
              <td>2025年3月</td>
              <td>評価スキル習得</td>
              <td><span className={`${styles.statusBadge} ${styles.statusPending}`}>申込予定</span></td>
            </tr>
            <tr>
              <td>看護研究指導者研修</td>
              <td><span className={styles.badge} style={{ backgroundColor: '#17a2b8' }}>選択</span></td>
              <td>2025年4月</td>
              <td>研究指導力向上</td>
              <td><span className={`${styles.statusBadge} ${styles.statusInProgress}`}>検討中</span></td>
            </tr>
            <tr>
              <td>認知症ケア指導者研修</td>
              <td><span className={styles.badge} style={{ backgroundColor: '#17a2b8' }}>選択</span></td>
              <td>2025年5月</td>
              <td>専門性深化</td>
              <td><span className={`${styles.statusBadge} ${styles.statusPending}`}>承認待ち</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* キャリアパス */}
      <div className={styles.section} style={{ marginTop: '30px' }}>
        <h3>🚀 キャリアパスと成長支援</h3>
        <div className={styles.timeline}>
          <div className={styles.timelineItem}>
            <div className={styles.timelineDate}>現在</div>
            <div className={styles.timelineTitle}>看護師（JNAラダーレベルⅣ）</div>
            <div className={styles.timelineContent}>
              病棟リーダー業務、プリセプター、QI活動リーダー
            </div>
          </div>
          <div className={`${styles.timelineItem} ${styles.future}`}>
            <div className={styles.timelineDate}>2025年4月</div>
            <div className={styles.timelineTitle}>主任看護師候補</div>
            <div className={styles.timelineContent}>
              管理業務の段階的経験、チーム運営の実践
            </div>
          </div>
          <div className={`${styles.timelineItem} ${styles.future}`}>
            <div className={styles.timelineDate}>2025年10月</div>
            <div className={styles.timelineTitle}>JNAラダーレベルⅤ認定</div>
            <div className={styles.timelineContent}>
              エキスパートナースとして複雑な看護実践と組織貢献
            </div>
          </div>
          <div className={`${styles.timelineItem} ${styles.future}`}>
            <div className={styles.timelineDate}>2026年4月</div>
            <div className={styles.timelineTitle}>主任看護師</div>
            <div className={styles.timelineContent}>
              病棟管理業務、スタッフ育成、質向上活動の推進
            </div>
          </div>
        </div>
      </div>

      {/* メンター情報 */}
      <div className={styles.infoCard} style={{ marginTop: '20px' }}>
        <div className={styles.cardHeader}>
          <span>👩‍🏫</span>
          <span>メンター・教育担当者情報</span>
        </div>
        <div className={styles.cardContent}>
          <strong>キャリアメンター:</strong> 看護部 山田師長（月1回面談実施中）<br />
          <strong>専門分野指導者:</strong> 認知症看護認定看護師 佐藤主任<br />
          <strong>研究指導者:</strong> 教育担当 鈴木副師長<br />
          <br />
          <strong>次回面談予定:</strong> 2025年1月20日 14:00〜 キャリア開発面談
        </div>
      </div>

      {/* アクションアイテム */}
      <div className={styles.actionItems}>
        <div className={`${styles.actionItem} ${styles.priorityHigh}`}>
          <div className={styles.actionTitle}>📋 緊急対応事項</div>
          <div className={styles.actionContent}>
            <strong>BLS資格更新:</strong><br />
            有効期限: 2025年3月31日<br />
            更新研修申込期限: 2025年2月15日
          </div>
          <div className={styles.actionDue}>残り45日</div>
        </div>
        <div className={`${styles.actionItem} ${styles.priorityMedium}`}>
          <div className={styles.actionTitle}>🎯 重点強化項目</div>
          <div className={styles.actionContent}>
            <strong>組織的役割遂行能力の向上:</strong><br />
            • 病棟会議でのファシリテーション実践<br />
            • 新人指導計画の立案と実施<br />
            • 業務改善提案の推進
          </div>
          <div className={styles.actionDue}>2025年第1四半期</div>
        </div>
        <div className={`${styles.actionItem} ${styles.priorityLow}`}>
          <div className={styles.actionTitle}>📚 継続学習</div>
          <div className={styles.actionContent}>
            <strong>e-ラーニング受講中:</strong><br />
            • 看護管理概論（進捗60%）<br />
            • エビデンスに基づく看護実践（進捗35%）<br />
            • 医療経済学基礎（進捗20%）
          </div>
          <div className={styles.actionDue}>2025年6月完了予定</div>
        </div>
      </div>
    </div>
  )
}

// 教育・研修タブコンポーネント
function EducationTab({ staffData }: { staffData: any }) {
  // 看護師の場合は専用のコンポーネントを表示
  if (staffData.position === '看護師') {
    return <NurseEducationTab staffData={staffData} />
  }

  // 年度別研修受講状況チャート
  const trainingYearlyData = {
    labels: ['2022年', '2023年', '2024年'],
    datasets: [{
      label: '受講研修数',
      data: [4, 7, 6],
      backgroundColor: '#007bff',
      borderColor: '#0056b3',
      borderWidth: 1
    }]
  }

  // 研修分野別内訳チャート
  const trainingCategoryData = {
    labels: ['専門技術', '管理・指導', '安全管理', '多職種連携', '法令・倫理', 'その他'],
    datasets: [{
      data: [30, 25, 20, 15, 5, 5],
      backgroundColor: ['#007bff', '#28a745', '#ffc107', '#17a2b8', '#dc3545', '#6c757d']
    }]
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>🎓 教育・研修・安全管理</h2>
        <div className={styles.sectionActions}>
          <button className={styles.sectionAction}>研修登録</button>
          <button className={`${styles.sectionAction} ${styles.secondary}`}>年間計画</button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.success}`}>
          <div className={styles.statTrend}>📚</div>
          <div className={styles.statValue}>100%</div>
          <div className={styles.statLabel}>必須研修完了率</div>
        </div>
        <div className={`${styles.statCard} ${styles.info}`}>
          <div className={styles.statTrend}>⏰</div>
          <div className={styles.statValue}>124h</div>
          <div className={styles.statLabel}>総研修時間</div>
        </div>
        <div className={`${styles.statCard} ${styles.warning}`}>
          <div className={styles.statTrend}>🛡️</div>
          <div className={styles.statValue}>98%</div>
          <div className={styles.statLabel}>安全行動実践率</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTrend}>⭐</div>
          <div className={styles.statValue}>4.7</div>
          <div className={styles.statLabel}>多職種評価平均</div>
        </div>
      </div>

      <div className={`${styles.alert} ${styles.alertWarning}`}>
        <span>📋</span>
        <strong>問題点:</strong> 管理職研修未受講、BLS更新期限近づく、実務管理経験不足。
      </div>

      <div className={`${styles.alert} ${styles.alertInfo}`}>
        <span>💡</span>
        <strong>推奨策:</strong> 早期管理職研修受講、段階的管理業務経験、学術活動支援の強化。
      </div>

      <div className={styles.chartGrid}>
        <div className={styles.chartContainer}>
          <h4>年度別研修受講状況</h4>
          <div className={`${styles.alert} ${styles.alertInfo}`} style={{ margin: '10px 0', fontSize: '11px' }}>
            <span>📊</span>
            <span>年間研修受講数の推移。継続的な学習姿勢と成長意欲を数値で確認できます。</span>
          </div>
          <div className={styles.chartCanvas}>
            <Bar data={trainingYearlyData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false }
              },
              scales: {
                y: { beginAtZero: true }
              }
            }} />
          </div>
        </div>
        <div className={styles.chartContainer}>
          <h4>研修分野別内訳</h4>
          <div className={`${styles.alert} ${styles.alertInfo}`} style={{ margin: '10px 0', fontSize: '11px' }}>
            <span>🎯</span>
            <span>6分野の研修バランス分析。専門技術30%、管理・指導25%が理想的な配分です。</span>
          </div>
          <div className={styles.chartCanvas}>
            <Doughnut data={trainingCategoryData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'bottom' as const }
              }
            }} />
          </div>
        </div>
      </div>

      <div className={styles.infoGrid}>
        <div className={styles.infoCard}>
          <div className={styles.cardTitle}>🛡️ 医療安全・コンプライアンス</div>
          <div className={`${styles.alert} ${styles.alertSuccess}`} style={{ marginBottom: '15px', fontSize: '11px' }}>
            <span>⚖️</span>
            <span>法的要件を満たす必須研修管理。医療法・労働基準法等の遵守状況を一元管理します。</span>
          </div>
          <div className={styles.cardContent}>
            <strong>必須研修完了状況:</strong><br />
            • 医療安全研修: ✅ 完了 (2024/6/15)<br />
            • 感染対策研修: ✅ 完了 (2024/1/18)<br />
            • ハラスメント防止: ✅ 完了 (2024/3/10)<br />
            • 個人情報保護: ✅ 完了 (2024/2/20)<br /><br />
            
            <strong>インシデント学習:</strong><br />
            • 薬剤誤認防止: 研修完了・実践中<br />
            • 転倒予防対策: チームリーダー経験<br />
            • 感染予防: 院内指導者として活動<br /><br />
            
            <strong>更新予定:</strong><br />
            • BLS資格: 2025年3月更新予定<br />
            • 医療安全研修: 2025年6月受講予定
          </div>
        </div>

        <div className={styles.infoCard}>
          <div className={styles.cardTitle}>🤝 多職種連携・チーム医療</div>
          <div className={`${styles.alert} ${styles.alertInfo}`} style={{ marginBottom: '15px', fontSize: '11px' }}>
            <span>👥</span>
            <span>360度評価による多職種からの客観的評価。チーム医療推進と連携スキル向上を支援します。</span>
          </div>
          <div className={styles.cardContent}>
            <strong>360度評価結果:</strong><br />
            • 医師からの評価: 4.6/5.0<br />
            • 薬剤師からの評価: 4.5/5.0<br />
            • リハビリ職からの評価: 4.8/5.0<br />
            • MSWからの評価: 4.9/5.0<br /><br />
            
            <strong>チーム医療スキル:</strong><br />
            • カンファレンス参加率: 100%<br />
            • 情報共有積極性: 95%<br />
            • 連携行動力: 90%<br />
            • 相互支援姿勢: 85%<br /><br />
            
            <strong>多職種コミュニケーション:</strong><br />
            • 専門用語の適切な使用: 優秀<br />
            • 他職種への敬意: 優秀<br />
            • 建設的な意見交換: 良好
          </div>
        </div>
      </div>

      <table className={styles.dataTable}>
        <thead>
          <tr>
            <th>研修名</th>
            <th>実施日</th>
            <th>分野</th>
            <th>形式</th>
            <th>時間</th>
            <th>評価</th>
            <th>修了証</th>
            <th>効果測定</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>リーダーシップ研修</td>
            <td>2024/10/05</td>
            <td>管理・指導</td>
            <td>集合研修</td>
            <td>8時間</td>
            <td><span className={`${styles.statusBadge} ${styles.statusExcellent}`}>優秀</span></td>
            <td><span className={`${styles.statusBadge} ${styles.statusCompleted}`}>取得</span></td>
            <td>+15%</td>
          </tr>
          <tr>
            <td>チーム医療推進研修</td>
            <td>2024/09/12</td>
            <td>多職種連携</td>
            <td>ワークショップ</td>
            <td>6時間</td>
            <td><span className={`${styles.statusBadge} ${styles.statusExcellent}`}>優秀</span></td>
            <td><span className={`${styles.statusBadge} ${styles.statusCompleted}`}>取得</span></td>
            <td>+18%</td>
          </tr>
          <tr>
            <td>認知症ケア専門研修</td>
            <td>2024/08/20</td>
            <td>専門技術</td>
            <td>eラーニング</td>
            <td>4時間</td>
            <td><span className={`${styles.statusBadge} ${styles.statusExcellent}`}>優秀</span></td>
            <td><span className={`${styles.statusBadge} ${styles.statusCompleted}`}>取得</span></td>
            <td>+12%</td>
          </tr>
          <tr>
            <td>医療安全研修</td>
            <td>2024/06/15</td>
            <td>安全管理</td>
            <td>集合研修</td>
            <td>3時間</td>
            <td><span className={`${styles.statusBadge} ${styles.statusGood}`}>良好</span></td>
            <td><span className={`${styles.statusBadge} ${styles.statusCompleted}`}>取得</span></td>
            <td>+8%</td>
          </tr>
          <tr>
            <td>新人指導者研修</td>
            <td>2024/02/28</td>
            <td>管理・指導</td>
            <td>外部研修</td>
            <td>16時間</td>
            <td><span className={`${styles.statusBadge} ${styles.statusExcellent}`}>優秀</span></td>
            <td><span className={`${styles.statusBadge} ${styles.statusCompleted}`}>取得</span></td>
            <td>+20%</td>
          </tr>
        </tbody>
      </table>
      <div className={`${styles.alert} ${styles.alertSuccess}`} style={{ marginTop: '15px', fontSize: '11px' }}>
        <span>📚</span>
        <span>研修履歴の詳細管理。効果測定により研修ROIを定量化し、今後の研修計画策定に活用します。</span>
      </div>

      <div className={styles.actionItems}>
        <div className={`${styles.actionItem} ${styles.priorityHigh}`}>
          <div className={styles.actionTitle}>📋 必須研修</div>
          <div className={`${styles.alert} ${styles.alertDanger}`} style={{ marginBottom: '10px', fontSize: '11px' }}>
            <span>⚠️</span>
            <span>法的要件・病院規定により受講必須。期限内の確実な受講が求められます。</span>
          </div>
          <div className={styles.actionContent}>
            <strong>2025年度 必須研修:</strong><br />
            • 医療安全研修（年1回必須）<br />
            • BLS更新（2025年3月期限）<br />
            • 個人情報保護研修（年1回）<br />
            • ハラスメント防止研修（年1回）
          </div>
          <div className={styles.actionDue}>期限: 2025年3月31日（BLS）、その他2025年度内</div>
        </div>
        <div className={`${styles.actionItem} ${styles.priorityMedium}`}>
          <div className={styles.actionTitle}>🎯 推奨研修</div>
          <div className={`${styles.alert} ${styles.alertWarning}`} style={{ marginBottom: '10px', fontSize: '11px' }}>
            <span>📈</span>
            <span>主任昇進に向けた準備研修。早期受講により昇進成功率が向上します。</span>
          </div>
          <div className={styles.actionContent}>
            <strong>昇進準備研修:</strong><br />
            • 管理職準備研修（主任昇進準備）<br />
            • 人事評価者研修<br />
            • 労務管理基礎研修<br />
            • 倫理研修（意思決定支援）
          </div>
          <div className={styles.actionDue}>推奨時期: 2025年1月〜3月</div>
        </div>
        <div className={`${styles.actionItem} ${styles.priorityLow}`}>
          <div className={styles.actionTitle}>⭐ 任意研修</div>
          <div className={`${styles.alert} ${styles.alertInfo}`} style={{ marginBottom: '10px', fontSize: '11px' }}>
            <span>🌟</span>
            <span>専門性向上・キャリア開発のための選択研修。個人の成長志向に応じて受講を支援します。</span>
          </div>
          <div className={styles.actionContent}>
            <strong>スキルアップ研修:</strong><br />
            • 学会発表スキル研修<br />
            • 多職種連携上級研修<br />
            • データ分析・統計研修<br />
            • プレゼンテーション研修
          </div>
          <div className={styles.actionDue}>任意参加（病院支援制度あり）</div>
        </div>
      </div>
    </div>
  )
}