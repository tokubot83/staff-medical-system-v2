'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import styles from './StaffDetail.module.css'
import { staffDatabase } from '@/app/data/staffData'

// Chart.jsを動的インポート（SSR対応）
const Chart = dynamic(() => import('react-chartjs-2').then((mod) => mod.Chart), {
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

      <div className={styles.infoGrid}>
        <div className={styles.infoCard}>
          <div className={styles.cardTitle}>🔄 タブ横断的統合分析</div>
          <div className={styles.cardContent}>
            <strong>因果関係マッピング:</strong><br />
            • 研修不足 → 評価低下 → ストレス増加の連鎖を確認<br />
            • リーダーシップ研修受講 → 評価向上 → エンゲージメント上昇<br />
            • 専門性向上 → チーム評価向上 → 昇進機会拡大<br /><br />
            
            <strong>統合的介入効果:</strong><br />
            • 管理研修 + 実践経験 = 正のスパイラル創出<br />
            • メンタル支援 + キャリア支援 = 持続的成長<br />
            • スキル向上 + 環境改善 = 最適パフォーマンス
          </div>
        </div>

        <div className={styles.infoCard}>
          <div className={styles.cardTitle}>📊 組織全体との比較分析</div>
          <div className={styles.cardContent}>
            <strong>同職種内ポジショニング:</strong><br />
            • 看護師全体での順位: 3位/45人<br />
            • 同世代（30-40歳）順位: 上位15%<br />
            • 主任候補者ランキング: 2位/8人<br /><br />
            
            <strong>ベンチマーク比較:</strong><br />
            • 総合評価: 田中4.2 vs 同職種平均3.6<br />
            • エンゲージメント: 95% vs 平均78%<br />
            • 研修参加率: 100% vs 平均65%
          </div>
        </div>
      </div>
    </div>
  )
}

// 他のタブコンポーネント（簡略版）
function EvaluationTab({ staffData }: { staffData: any }) {
  return (
    <div className={styles.section}>
      <h2>人事評価・考課</h2>
      <p>評価内容がここに表示されます</p>
    </div>
  )
}

function RecruitmentTab({ staffData }: { staffData: any }) {
  return (
    <div className={styles.section}>
      <h2>採用・配属情報</h2>
      <p>採用・配属情報がここに表示されます</p>
    </div>
  )
}

function InterviewTab({ staffData }: { staffData: any }) {
  return (
    <div className={styles.section}>
      <h2>面談・指導・職場環境管理</h2>
      <p>面談・指導情報がここに表示されます</p>
    </div>
  )
}

function DevelopmentTab({ staffData }: { staffData: any }) {
  return (
    <div className={styles.section}>
      <h2>能力開発・キャリア支援</h2>
      <p>能力開発情報がここに表示されます</p>
    </div>
  )
}

function EducationTab({ staffData }: { staffData: any }) {
  return (
    <div className={styles.section}>
      <h2>教育・研修・安全管理</h2>
      <p>教育・研修情報がここに表示されます</p>
    </div>
  )
}