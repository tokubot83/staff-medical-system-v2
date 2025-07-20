'use client'

import React, { useState } from 'react'
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

// 戦略ダッシュボードタブ
function StrategyDashboard() {
  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.summarySection}>
        <h2>組織全体の人材状況</h2>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <div className={styles.cardIcon}>👥</div>
            <div className={styles.cardContent}>
              <h3>総職員数</h3>
              <p className={styles.cardValue}>1,234名</p>
              <p className={styles.cardChange}>+5.2% (前年比)</p>
            </div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.cardIcon}>⭐</div>
            <div className={styles.cardContent}>
              <h3>ハイパフォーマー</h3>
              <p className={styles.cardValue}>186名</p>
              <p className={styles.cardSubtext}>全体の15.1%</p>
            </div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.cardIcon}>🔄</div>
            <div className={styles.cardContent}>
              <h3>異動希望者</h3>
              <p className={styles.cardValue}>89名</p>
              <p className={styles.cardAlert}>要対応: 23名</p>
            </div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.cardIcon}>📊</div>
            <div className={styles.cardContent}>
              <h3>人材充足率</h3>
              <p className={styles.cardValue}>92.5%</p>
              <p className={styles.cardWarning}>不足部署: 3</p>
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
              {/* ここにグラフを実装 */}
              <p>グラフ表示エリア</p>
            </div>
          </div>
          <div className={styles.chartCard}>
            <h3>スキルマトリクス</h3>
            <div className={styles.chartPlaceholder}>
              <p>グラフ表示エリア</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 異動プランニングタブ
function TransferPlanning() {
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [selectedDepartment, setSelectedDepartment] = useState('')

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
            />
          </div>
          <div className={styles.filterSection}>
            <label>フィルタ条件</label>
            <select className={styles.filterSelect}>
              <option>すべての職員</option>
              <option>異動希望者のみ</option>
              <option>評価A以上</option>
              <option>勤続3年以上</option>
            </select>
          </div>
          <div className={styles.staffList}>
            {/* 職員リスト */}
            <div className={styles.staffItem}>
              <div className={styles.staffInfo}>
                <p className={styles.staffName}>山田 太郎</p>
                <p className={styles.staffDetail}>看護部 / 主任</p>
              </div>
              <div className={styles.staffStatus}>
                <span className={styles.badge}>異動希望</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.centerPanel}>
          <h3>マッチング結果</h3>
          <div className={styles.matchingResults}>
            <div className={styles.matchCard}>
              <div className={styles.matchScore}>95%</div>
              <div className={styles.matchInfo}>
                <h4>リハビリテーション科</h4>
                <p>スキルマッチ度: 高</p>
                <p>部署ニーズ: 緊急</p>
                <ul className={styles.matchReasons}>
                  <li>リーダーシップ経験が評価</li>
                  <li>必要資格を保有</li>
                  <li>チーム構成の最適化</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.rightPanel}>
          <h3>部署別異動希望者</h3>
          <div className={styles.departmentList}>
            <div className={styles.departmentItem}>
              <h4>看護部</h4>
              <div className={styles.wishList}>
                <p>異動希望者: 12名</p>
                <p>受入希望: 8名</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// タレント管理タブ
function TalentManagement() {
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
            <div className={styles.performerCard}>
              <div className={styles.performerHeader}>
                <span className={styles.performerRank}>S</span>
                <h4>佐藤 花子</h4>
              </div>
              <div className={styles.performerDetails}>
                <p>看護部 / 主任</p>
                <p>評価: 5.0 / 5.0</p>
                <div className={styles.talentTags}>
                  <span className={styles.tag}>リーダーシップ</span>
                  <span className={styles.tag}>イノベーション</span>
                </div>
              </div>
              <div className={styles.performerActions}>
                <button className={styles.smallButton}>詳細</button>
                <button className={styles.smallButton}>育成計画</button>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.talentSection}>
          <h3>📋 サクセッションプラン</h3>
          <div className={styles.successionList}>
            <div className={styles.positionCard}>
              <h4>看護部長</h4>
              <div className={styles.candidateList}>
                <div className={styles.candidate}>
                  <span className={styles.readiness}>準備度: 85%</span>
                  <p>田中 美咲</p>
                </div>
                <div className={styles.candidate}>
                  <span className={styles.readiness}>準備度: 70%</span>
                  <p>鈴木 健一</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.talentSection}>
          <h3>📈 キャリアパス分析</h3>
          <div className={styles.careerPathViewer}>
            <p>キャリアパス可視化エリア</p>
          </div>
        </div>

        <div className={styles.talentSection}>
          <h3>🎯 育成進捗トラッキング</h3>
          <div className={styles.developmentTracker}>
            <div className={styles.developmentItem}>
              <h4>リーダーシップ研修プログラム</h4>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{width: '75%'}}></div>
              </div>
              <p>参加者: 24名 / 完了: 18名</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 組織最適化タブ
function OrganizationOptimization() {
  return (
    <div className={styles.optimizationContainer}>
      <div className={styles.optimizationHeader}>
        <h2>組織最適化分析</h2>
        <button className={styles.analysisButton}>最適化分析を実行</button>
      </div>

      <div className={styles.optimizationContent}>
        <div className={styles.analysisSection}>
          <h3>現状の組織構成分析</h3>
          <div className={styles.compositionGrid}>
            <div className={styles.compositionCard}>
              <h4>年齢構成</h4>
              <div className={styles.analysisChart}>
                <p>グラフ表示エリア</p>
              </div>
              <div className={styles.analysisInsight}>
                <p className={styles.warning}>⚠️ 40代の層が薄い</p>
              </div>
            </div>
            <div className={styles.compositionCard}>
              <h4>スキルバランス</h4>
              <div className={styles.analysisChart}>
                <p>グラフ表示エリア</p>
              </div>
              <div className={styles.analysisInsight}>
                <p className={styles.good}>✅ バランス良好</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.recommendationSection}>
          <h3>最適化提案</h3>
          <div className={styles.recommendationList}>
            <div className={styles.recommendationCard}>
              <div className={styles.recommendationPriority}>優先度: 高</div>
              <h4>看護部の人員配置最適化</h4>
              <p>夜勤体制の負荷分散のため、B病棟から3名をA病棟へ異動することを推奨</p>
              <div className={styles.impactAnalysis}>
                <p>期待効果: 残業時間20%削減</p>
                <p>リスク: 低</p>
              </div>
              <button className={styles.detailButton}>詳細を見る</button>
            </div>
          </div>
        </div>

        <div className={styles.futureProjection}>
          <h3>将来予測</h3>
          <div className={styles.projectionContent}>
            <p>5年後の組織構成シミュレーション</p>
          </div>
        </div>
      </div>
    </div>
  )
}