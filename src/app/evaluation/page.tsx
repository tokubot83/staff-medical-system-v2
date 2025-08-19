'use client'

import React, { useState, useEffect } from 'react'
import CommonHeader from '@/components/CommonHeader'
import DashboardButton from '@/components/DashboardButton'
import EvaluationIntegratedDashboard from '@/components/evaluation/EvaluationIntegratedDashboard'
import Link from 'next/link'
import styles from './Evaluation.module.css'
import { 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  Calendar,
  TrendingUp,
  Users,
  FileText,
  Settings,
  ChevronRight,
  Bell,
  BarChart3,
  Target,
  Award,
  BookOpen,
  ClipboardCheck,
  Download,
  Activity,
  Building,
  UserCheck,
  FileSpreadsheet,
  Calculator,
  ArrowRight,
  Badge
} from 'lucide-react'

// タスクの型定義
interface Task {
  type: 'urgent' | 'normal'
  title: string
  description: string
  link: string
  deadline: string
}

// 通知の型定義
interface Notification {
  id: number
  type: 'warning' | 'info' | 'success'
  message: string
  time: string
}

// タブ定義 - 2大評価フローを中心に再構成（第1・第2段階実装）
const tabs = [
  { id: 'overview', label: '評価概要', icon: '🏠' },
  { id: 'dashboard', label: 'ダッシュボード', icon: '📊', isNew: true },
  { id: 'technical', label: '①技術評価', icon: '🎯', badge: '50点' },
  { id: 'contribution', label: '②組織貢献度評価', icon: '🤝', badge: '50点' },
  { id: 'integration', label: '③総合評価', icon: '📊' },
  { id: 'disclosure', label: '評価開示', icon: '📤', isNew: true }, // 第1段階
  { id: 'appeal', label: '異議申し立て', icon: '⚖️', isNew: true }, // 第2段階
  { id: 'guide', label: 'ガイド', icon: '❓', isNew: true },
  { id: 'settings', label: '設定・管理', icon: '⚙️' },
]

// 現在の月から評価タスクを判定
const getCurrentTasks = (): Task[] => {
  const currentMonth = new Date().getMonth() + 1
  const tasks: Task[] = []
  
  if (currentMonth === 3) {
    tasks.push({
      type: 'urgent',
      title: '技術評価実施',
      description: '年度末技術評価の入力期限が近づいています',
      link: '/evaluation/technical',
      deadline: '3月31日'
    })
    tasks.push({
      type: 'urgent',
      title: '総合評価準備',
      description: '年度末総合評価の準備を開始してください',
      link: '/evaluation/integrated',
      deadline: '3月末'
    })
  } else if (currentMonth === 7 || currentMonth === 8) {
    tasks.push({
      type: 'normal',
      title: '夏季賞与査定',
      description: '12～5月実績の組織貢献度評価を実施',
      link: '/evaluation/contribution',
      deadline: '8月15日'
    })
  } else if (currentMonth === 11 || currentMonth === 12) {
    tasks.push({
      type: 'normal',
      title: '冬季賞与査定',
      description: '6～11月実績の組織貢献度評価を実施',
      link: '/evaluation/contribution',
      deadline: '12月15日'
    })
  }
  
  return tasks
}

export default function EvaluationManagement() {
  const [activeTab, setActiveTab] = useState('overview')
  const [currentTasks, setCurrentTasks] = useState<Task[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [progressData, setProgressData] = useState({
    technical: 65,
    contribution: 80,
    integrated: 0
  })

  useEffect(() => {
    // 現在のタスクを設定
    setCurrentTasks(getCurrentTasks())
    
    // 通知を設定（モックデータ）
    setNotifications([
      { id: 1, type: 'warning', message: '技術評価の入力期限まであと5日です', time: '2時間前' },
      { id: 2, type: 'info', message: '新しい評価シートがアップロードされました', time: '昨日' },
      { id: 3, type: 'success', message: '看護部の評価が完了しました', time: '3日前' }
    ])
  }, [])

  return (
    <div>
      <CommonHeader title="評価管理" />
      
      <div className={styles.container}>
        {/* タブナビゲーション */}
        <div className={styles.tabNavigation}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              <span className={styles.tabLabel}>
                {tab.label}
                {tab.isNew && <span className={styles.newBadge}>New</span>}
              </span>
              {tab.badge && <span className={styles.tabBadge}>{tab.badge}</span>}
            </button>
          ))}
        </div>

        {/* タブコンテンツ */}
        <div className={styles.tabContent}>
          {/* ダッシュボードタブ */}
          {activeTab === 'dashboard' && (
            <EvaluationIntegratedDashboard />
          )}

          {/* 評価概要タブ */}
          {activeTab === 'overview' && (
            <div className={styles.overviewContent}>
              {/* 評価システム概要 - 旧システムの要素を統合 */}
              <div className={styles.systemOverview}>
                <h2 className={styles.systemTitle}>
                  <span className={styles.titleIcon}>📊</span>
                  人事評価システム概要
                </h2>
                <p className={styles.systemSubtitle}>
                  公平・透明・成長支援を重視した総合評価制度
                </p>
                
                {/* ビジュアル強化: 評価配分の円グラフ風表示 */}
                <div className={styles.scoreVisualization}>
                  <div className={styles.scoreDistribution}>
                    <div className={styles.scoreCard}>
                      <div className={styles.scoreCircle}>
                        <div className={styles.scoreValue}>100点</div>
                        <div className={styles.scoreLabel}>年間総合評価</div>
                      </div>
                    </div>
                    <div className={styles.scoreBreakdown}>
                      <div className={styles.scoreComponent}>
                        <div className={styles.componentIcon}>
                          <Target size={32} />
                        </div>
                        <div className={styles.componentInfo}>
                          <span className={styles.componentTitle}>技術評価</span>
                          <span className={styles.componentPoints}>50点</span>
                          <span className={styles.componentDesc}>専門スキル・知識</span>
                        </div>
                      </div>
                      <div className={styles.scorePlus}>+</div>
                      <div className={styles.scoreComponent}>
                        <div className={styles.componentIcon}>
                          <Users size={32} />
                        </div>
                        <div className={styles.componentInfo}>
                          <span className={styles.componentTitle}>組織貢献度</span>
                          <span className={styles.componentPoints}>50点</span>
                          <span className={styles.componentDesc}>施設・法人への貢献</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 評価の特徴 */}
                  <div className={styles.systemFeatures}>
                    <div className={styles.featureItem}>
                      <span className={styles.featureIcon}>⚖️</span>
                      <span className={styles.featureText}>絶対評価と相対評価の併用</span>
                    </div>
                    <div className={styles.featureItem}>
                      <span className={styles.featureIcon}>📈</span>
                      <span className={styles.featureText}>成長支援重視の評価制度</span>
                    </div>
                    <div className={styles.featureItem}>
                      <span className={styles.featureIcon}>🎯</span>
                      <span className={styles.featureText}>職種別カスタマイズ評価</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 実施スケジュール - ビジュアル強化版 */}
              <div className={styles.scheduleOverview}>
                <h2 className={styles.scheduleTitle}>
                  <span className={styles.titleIcon}>📅</span>
                  年間実施スケジュール
                </h2>
                <div className={styles.yearIndicator}>
                  <div className={styles.yearFlow}>
                    <span className={styles.yearStart}>4月</span>
                    <div className={styles.yearArrow}></div>
                    <span className={styles.yearEnd}>翌年3月</span>
                  </div>
                  <span className={styles.yearDesc}>年度評価期間</span>
                </div>
                <div className={styles.scheduleTimeline}>
                  <div className={styles.scheduleItem}>
                    <div className={styles.scheduleMonth}>
                      <span className={styles.monthNumber}>8月</span>
                      <span className={styles.monthOrder}>（年度第1回）</span>
                    </div>
                    <div className={styles.scheduleContent}>
                      <h4 className={styles.scheduleEventTitle}>夏季賞与査定</h4>
                      <p className={styles.scheduleEventDesc}>12月〜5月実績の貢献度評価</p>
                      <div className={styles.schedulePoints}>25点満点（施設12.5点＋法人12.5点）</div>
                    </div>
                    <div className={styles.scheduleStatus}>
                      <span className={styles.statusBadge}>半年毎</span>
                      <span className={styles.orderBadge}>①</span>
                    </div>
                  </div>
                  <div className={styles.scheduleItem}>
                    <div className={styles.scheduleMonth}>
                      <span className={styles.monthNumber}>12月</span>
                      <span className={styles.monthOrder}>（年度第2回）</span>
                    </div>
                    <div className={styles.scheduleContent}>
                      <h4 className={styles.scheduleEventTitle}>冬季賞与査定</h4>
                      <p className={styles.scheduleEventDesc}>6月〜11月実績の貢献度評価</p>
                      <div className={styles.schedulePoints}>25点満点（施設12.5点＋法人12.5点）</div>
                    </div>
                    <div className={styles.scheduleStatus}>
                      <span className={styles.statusBadge}>半年毎</span>
                      <span className={styles.orderBadge}>②</span>
                    </div>
                  </div>
                  <div className={styles.scheduleItem}>
                    <div className={styles.scheduleMonth}>
                      <span className={styles.monthNumber}>翌年3月</span>
                      <span className={styles.monthOrder}>（年度末）</span>
                    </div>
                    <div className={styles.scheduleContent}>
                      <h4 className={styles.scheduleEventTitle}>技術評価実施</h4>
                      <p className={styles.scheduleEventDesc}>職種別専門技術・スキル評価</p>
                      <div className={styles.schedulePoints}>50点満点</div>
                    </div>
                    <div className={styles.scheduleStatus}>
                      <span className={styles.statusBadge}>年1回</span>
                      <span className={styles.orderBadge}>③</span>
                    </div>
                  </div>
                  <div className={styles.scheduleSummary}>
                    <div className={styles.summaryIcon}>📊</div>
                    <div className={styles.summaryContent}>
                      <h4>年度総合評価確定</h4>
                      <p>貢献度評価（8月25点＋12月25点）＋ 技術評価（3月50点）＝ <strong>100点満点</strong></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2大評価フローの詳細 - カード型デザイン強化 */}
              <div className={styles.flowOverview}>
                <h2 className={styles.flowTitle}>
                  <span className={styles.titleIcon}>🔄</span>
                  評価フロー詳細
                </h2>
                <p className={styles.flowSubtitle}>
                  2つの評価軸で多面的に職員を評価
                </p>
                <div className={styles.flowCards}>
                  {/* 技術評価フロー */}
                  <div className={styles.flowCard}>
                    <div className={styles.flowHeader}>
                      <Target className={styles.flowIcon} />
                      <h3>①技術評価</h3>
                      <div className={styles.flowScore}>50点</div>
                    </div>
                    <div className={styles.flowTimeline}>
                      <div className={styles.timelineStep}>
                        <span className={styles.stepMonth}>3月実施</span>
                        <span className={styles.stepDesc}>年度末評価</span>
                      </div>
                    </div>
                    <div className={styles.flowDetails}>
                      <p>職種別の専門技術・スキルを評価</p>
                      <ul>
                        <li>法人統一項目（30点）</li>
                        <li>施設特化項目（20点）</li>
                        <li>項目別差別化型配分を採用</li>
                      </ul>
                      <div className={styles.devNote}>
                        <span className={styles.devNoteLabel}>開発メモ</span>
                        <Link href="/docs/development-notes/evaluation-pattern-designs" className={styles.devNoteLink}>
                          評価配分5パターン検討資料 →
                        </Link>
                      </div>
                    </div>
                    <div className={styles.flowActions}>
                      <Link href="/evaluation/technical" className={styles.flowAction}>
                        従来版を開始 <ChevronRight size={16} />
                      </Link>
                      <Link href="/evaluation/core-v2" className={styles.flowActionNew}>
                        新V2版を開始 <ChevronRight size={16} />
                      </Link>
                      <Link href="/evaluation/facility-specific" className={styles.flowActionNew}>
                        施設特化項目 <ChevronRight size={16} />
                      </Link>
                    </div>
                  </div>

                  {/* 貢献度評価フロー */}
                  <div className={styles.flowCard}>
                    <div className={styles.flowHeader}>
                      <Users className={styles.flowIcon} />
                      <h3>②組織貢献度評価</h3>
                      <div className={styles.flowScore}>50点</div>
                    </div>
                    <div className={styles.flowTimeline}>
                      <div className={styles.timelineStep}>
                        <span className={styles.stepMonth}>8月</span>
                        <span className={styles.stepDesc}>夏季査定（12.5点×2）</span>
                      </div>
                      <div className={styles.timelineStep}>
                        <span className={styles.stepMonth}>12月</span>
                        <span className={styles.stepDesc}>冬季査定（12.5点×2）</span>
                      </div>
                    </div>
                    <div className={styles.flowDetails}>
                      <p>組織への貢献度を相対評価</p>
                      <ul>
                        <li>施設貢献度（25点年間）</li>
                        <li>法人貢献度（25点年間）</li>
                        <li>各回12.5点満点で年2回実施</li>
                      </ul>
                    </div>
                    <Link href="/evaluation/contribution" className={styles.flowAction}>
                      評価を開始 <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* クイックアクセスパネル - 新規追加 */}
              <div className={styles.quickAccessPanel}>
                <h3 className={styles.panelTitle}>
                  <span className={styles.titleIcon}>⚡</span>
                  クイックアクセス
                </h3>
                <div className={styles.quickAccessGrid}>
                  <Link href="/evaluation/technical" className={styles.quickAccessCard}>
                    <div className={styles.accessCardIcon}>
                      <Target size={24} />
                    </div>
                    <span className={styles.accessCardTitle}>技術評価</span>
                    <span className={styles.accessCardDesc}>年度末評価入力</span>
                  </Link>
                  <Link href="/evaluation/contribution" className={styles.quickAccessCard}>
                    <div className={styles.accessCardIcon}>
                      <Users size={24} />
                    </div>
                    <span className={styles.accessCardTitle}>貢献度評価</span>
                    <span className={styles.accessCardDesc}>賞与査定入力</span>
                  </Link>
                  <Link href="/evaluation/integrated-v2" className={styles.quickAccessCard}>
                    <div className={styles.accessCardIcon}>
                      <Award size={24} />
                    </div>
                    <span className={styles.accessCardTitle}>統合評価</span>
                    <span className={styles.accessCardDesc}>総合評価確認</span>
                  </Link>
                  <Link href="/evaluation/reports" className={styles.quickAccessCard}>
                    <div className={styles.accessCardIcon}>
                      <FileText size={24} />
                    </div>
                    <span className={styles.accessCardTitle}>レポート</span>
                    <span className={styles.accessCardDesc}>評価結果出力</span>
                  </Link>
                </div>
              </div>

              {/* 統合評価システムへのリンク */}
              <div className={styles.integratedSystemCard}>
                <div className={styles.integratedHeader}>
                  <Award className={styles.integratedIcon} />
                  <h3>統合評価システム V2（100点満点）</h3>
                  <Badge className={styles.newBadge}>NEW</Badge>
                </div>
                <p className={styles.integratedDescription}>
                  技術評価（50点）と貢献度評価（50点）を統合した総合評価システム
                </p>
                <Link href="/evaluation/integrated-v2" className={styles.integratedButton}>
                  統合評価を開始 <ChevronRight size={16} />
                </Link>
              </div>

              {/* 現在のタスクと進捗 */}
              <div className={styles.overviewGrid}>
                <div className={styles.taskWidget}>
                  <h3><Clock size={20} /> 今月のタスク</h3>
                  {currentTasks.length > 0 ? (
                    <div className={styles.taskList}>
                      {currentTasks.map((task, index) => (
                        <Link key={index} href={task.link} className={styles.taskItem}>
                          <span className={styles.taskTitle}>{task.title}</span>
                          <span className={styles.taskDeadline}>{task.deadline}</span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className={styles.noTasks}>現在のタスクはありません</p>
                  )}
                </div>

                <div className={styles.progressWidget}>
                  <h3><BarChart3 size={20} /> 評価進捗</h3>
                  <div className={styles.progressItems}>
                    <div className={styles.progressItem}>
                      <span>技術評価</span>
                      <div className={styles.progressBar}>
                        <div style={{ width: `${progressData.technical}%` }} />
                      </div>
                      <span>{progressData.technical}%</span>
                    </div>
                    <div className={styles.progressItem}>
                      <span>貢献度評価</span>
                      <div className={styles.progressBar}>
                        <div style={{ width: `${progressData.contribution}%` }} />
                      </div>
                      <span>{progressData.contribution}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ダッシュボードタブ */}
          {activeTab === 'dashboard' && (
            <div className={styles.dashboardContent}>
              <div className={styles.dashboardHeader}>
                <h2>評価ダッシュボード</h2>
                <p className={styles.dashboardDescription}>
                  人事評価の進捗管理と分析を行うダッシュボードです。管理者向けと個人向けの2種類があります。
                </p>
              </div>

              <div className={styles.dashboardGrid}>
                {/* 管理者ダッシュボード */}
                <div className={styles.dashboardCard}>
                  <div className={styles.dashboardIcon}>
                    <Building size={48} className={styles.iconAdmin} />
                  </div>
                  <h3>管理者ダッシュボード</h3>
                  <p className={styles.dashboardCardDescription}>
                    組織全体の評価進捗、グレード分布、部門別分析を確認できます。
                  </p>
                  <ul className={styles.dashboardFeatures}>
                    <li>
                      <CheckCircle size={16} />
                      <span>施設全体の評価進捗管理</span>
                    </li>
                    <li>
                      <CheckCircle size={16} />
                      <span>S/A/B/C/Dグレード分布の可視化</span>
                    </li>
                    <li>
                      <CheckCircle size={16} />
                      <span>部門別パフォーマンス分析</span>
                    </li>
                    <li>
                      <CheckCircle size={16} />
                      <span>リマインダー送信機能</span>
                    </li>
                  </ul>
                  <Link href="/dashboard/admin" className={styles.dashboardLink}>
                    管理者ダッシュボードへ
                    <ChevronRight size={20} />
                  </Link>
                </div>

                {/* 個人ダッシュボード */}
                <div className={styles.dashboardCard}>
                  <div className={styles.dashboardIcon}>
                    <UserCheck size={48} className={styles.iconPersonal} />
                  </div>
                  <h3>個人ダッシュボード</h3>
                  <p className={styles.dashboardCardDescription}>
                    個人の評価履歴、研修状況、次回評価の準備状況を確認できます。
                  </p>
                  <ul className={styles.dashboardFeatures}>
                    <li>
                      <CheckCircle size={16} />
                      <span>評価履歴とトレンド分析</span>
                    </li>
                    <li>
                      <CheckCircle size={16} />
                      <span>研修受講状況の管理</span>
                    </li>
                    <li>
                      <CheckCircle size={16} />
                      <span>次回評価スケジュール</span>
                    </li>
                    <li>
                      <CheckCircle size={16} />
                      <span>個人目標の設定と追跡</span>
                    </li>
                  </ul>
                  <Link href="/dashboard/personal" className={styles.dashboardLink}>
                    個人ダッシュボードへ
                    <ChevronRight size={20} />
                  </Link>
                </div>
              </div>

              {/* 統計サマリー */}
              <div className={styles.dashboardSummary}>
                <h3>システム利用状況</h3>
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryItem}>
                    <div className={styles.summaryIcon}>
                      <Users size={24} />
                    </div>
                    <div className={styles.summaryContent}>
                      <div className={styles.summaryValue}>450</div>
                      <div className={styles.summaryLabel}>評価対象職員数</div>
                    </div>
                  </div>
                  <div className={styles.summaryItem}>
                    <div className={styles.summaryIcon}>
                      <Target size={24} />
                    </div>
                    <div className={styles.summaryContent}>
                      <div className={styles.summaryValue}>68%</div>
                      <div className={styles.summaryLabel}>評価完了率</div>
                    </div>
                  </div>
                  <div className={styles.summaryItem}>
                    <div className={styles.summaryIcon}>
                      <TrendingUp size={24} />
                    </div>
                    <div className={styles.summaryContent}>
                      <div className={styles.summaryValue}>72.5</div>
                      <div className={styles.summaryLabel}>平均評価点</div>
                    </div>
                  </div>
                  <div className={styles.summaryItem}>
                    <div className={styles.summaryIcon}>
                      <Calendar size={24} />
                    </div>
                    <div className={styles.summaryContent}>
                      <div className={styles.summaryValue}>15日</div>
                      <div className={styles.summaryLabel}>次回評価まで</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 技術評価タブ */}
          {activeTab === 'technical' && (
            <div className={styles.technicalContent}>
              <div className={styles.flowSection}>
                <h2>①技術評価（年間50点）</h2>
                <p className={styles.flowDescription}>
                  3月に実施する年度末評価。職種別の専門技術・スキルを評価します。
                </p>

                {/* プロセスフロー */}
                <div className={styles.processFlow}>
                  <div className={styles.processStep}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                      <h4>評価シート選択</h4>
                      <p>職種・経験年数に応じた評価シートを選択</p>
                      <Link href="/evaluation-sheets" className={styles.stepLink}>
                        シート一覧へ <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>

                  <div className={styles.processStep}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                      <h4>自己評価入力</h4>
                      <p>本人による自己評価（配点の40%）</p>
                      <Link href="/evaluation/technical/self" className={styles.stepLink}>
                        入力画面へ <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>

                  <div className={styles.processStep}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepContent}>
                      <h4>上司評価入力</h4>
                      <p>上司による評価（配点の60%）</p>
                      <Link href="/evaluation/technical/supervisor" className={styles.stepLink}>
                        入力画面へ <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>

                  <div className={styles.processStep}>
                    <div className={styles.stepNumber}>4</div>
                    <div className={styles.stepContent}>
                      <h4>評価確定</h4>
                      <p>評価内容の確認と確定処理</p>
                      <Link href="/evaluation/technical/confirm" className={styles.stepLink}>
                        確認画面へ <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* 関連機能 */}
                <div className={styles.relatedFeatures}>
                  <h3>関連機能</h3>
                  <div className={styles.featureGrid}>
                    <Link href="/evaluation/config" className={styles.featureCard}>
                      <Settings size={24} />
                      <span>評価項目設定</span>
                    </Link>
                    <Link href="/evaluation/analytics" className={styles.featureCard}>
                      <BarChart3 size={24} />
                      <span>評価分析</span>
                    </Link>
                    <Link href="/evaluation/history" className={styles.featureCard}>
                      <FileText size={24} />
                      <span>過去の評価</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 組織貢献度評価タブ */}
          {activeTab === 'contribution' && (
            <div className={styles.contributionContent}>
              <div className={styles.flowSection}>
                <h2>②組織貢献度評価（年間50点）</h2>
                <p className={styles.flowDescription}>
                  年2回の賞与査定時に実施。施設・法人への貢献度を相対評価します。
                </p>

                {/* 年間スケジュール */}
                <div className={styles.yearSchedule}>
                  <div className={styles.scheduleCard}>
                    <div className={styles.scheduleHeader} style={{ backgroundColor: '#e3f2fd' }}>
                      <Calendar size={24} />
                      <h3>夏季賞与査定（8月）</h3>
                    </div>
                    <div className={styles.scheduleBody}>
                      <p className={styles.schedulePeriod}>評価対象期間：12月～5月</p>
                      <div className={styles.scoreBreakdown}>
                        <div className={styles.scoreItem}>
                          <Building size={18} />
                          <span>施設貢献度：12.5点</span>
                        </div>
                        <div className={styles.scoreItem}>
                          <Users size={18} />
                          <span>法人貢献度：12.5点</span>
                        </div>
                      </div>
                      <Link href="/evaluation/contribution" className={styles.scheduleAction}>
                        査定入力へ <ChevronRight size={16} />
                      </Link>
                    </div>
                  </div>

                  <div className={styles.scheduleCard}>
                    <div className={styles.scheduleHeader} style={{ backgroundColor: '#e8f5e9' }}>
                      <Calendar size={24} />
                      <h3>冬季賞与査定（12月）</h3>
                    </div>
                    <div className={styles.scheduleBody}>
                      <p className={styles.schedulePeriod}>評価対象期間：6月～11月</p>
                      <div className={styles.scoreBreakdown}>
                        <div className={styles.scoreItem}>
                          <Building size={18} />
                          <span>施設貢献度：12.5点</span>
                        </div>
                        <div className={styles.scoreItem}>
                          <Users size={18} />
                          <span>法人貢献度：12.5点</span>
                        </div>
                      </div>
                      <Link href="/evaluation/contribution" className={styles.scheduleAction}>
                        査定入力へ <ChevronRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* 評価項目 */}
                <div className={styles.evaluationItems}>
                  <h3>評価項目</h3>
                  <div className={styles.itemsGrid}>
                    <div className={styles.itemCategory}>
                      <h4><Building size={20} /> 施設貢献（年間25点）</h4>
                      <ul>
                        <li>委員会活動</li>
                        <li>研修参加・講師</li>
                        <li>改善提案・QC活動</li>
                        <li>新人指導・プリセプター</li>
                        <li>時間外協力</li>
                      </ul>
                    </div>
                    <div className={styles.itemCategory}>
                      <h4><Users size={20} /> 法人貢献（年間25点）</h4>
                      <ul>
                        <li>法人行事参加</li>
                        <li>他施設応援</li>
                        <li>法人プロジェクト参加</li>
                        <li>採用活動協力</li>
                        <li>広報活動協力</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 相対評価の説明 */}
                <div className={styles.relativeEvaluation}>
                  <h3>相対評価の仕組み</h3>
                  <p>各施設・職種内で順位付けを行い、パーセンタイルに基づいて配点します。</p>
                  <div className={styles.percentileTable}>
                    <table>
                      <thead>
                        <tr>
                          <th>順位</th>
                          <th>配点（12.5点満点）</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>上位10%</td>
                          <td>12.5点</td>
                        </tr>
                        <tr>
                          <td>上位20%</td>
                          <td>11.25点</td>
                        </tr>
                        <tr>
                          <td>上位30%</td>
                          <td>10点</td>
                        </tr>
                        <tr>
                          <td>上位50%</td>
                          <td>7.5点</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 総合評価タブ */}
          {activeTab === 'integration' && (
            <div className={styles.integrationContent}>
              <div className={styles.integrationSection}>
                <h2>③総合評価（3月末実施）</h2>
                <p className={styles.integrationDescription}>
                  技術評価と貢献度評価を統合し、最終的な評価グレードを決定します。
                </p>

                {/* 統合プロセス */}
                <div className={styles.integrationProcess}>
                  <div className={styles.scoreComponents}>
                    <div className={styles.componentCard}>
                      <h3>技術評価</h3>
                      <div className={styles.componentScore}>50点</div>
                      <p>3月実施</p>
                    </div>
                    <div className={styles.plusSign}>+</div>
                    <div className={styles.componentCard}>
                      <h3>施設貢献</h3>
                      <div className={styles.componentScore}>25点</div>
                      <p>夏12.5 + 冬12.5</p>
                    </div>
                    <div className={styles.plusSign}>+</div>
                    <div className={styles.componentCard}>
                      <h3>法人貢献</h3>
                      <div className={styles.componentScore}>25点</div>
                      <p>夏12.5 + 冬12.5</p>
                    </div>
                    <div className={styles.equalsSign}>=</div>
                    <div className={styles.componentCard} style={{ backgroundColor: '#f5f5f5' }}>
                      <h3>総合評価</h3>
                      <div className={styles.componentScore}>100点</div>
                      <p>最終グレード</p>
                    </div>
                  </div>
                </div>

                {/* 2軸評価判定 */}
                <div className={styles.gradeMatrix}>
                  <h3>2軸評価システム</h3>
                  <div className={styles.evaluationSteps}>
                    <div className={styles.stepCard}>
                      <div className={styles.stepNumber}>1</div>
                      <h4>100点満点で集計</h4>
                      <p>技術50点 + 施設貢献25点 + 法人貢献25点</p>
                    </div>
                    <div className={styles.stepArrow}>→</div>
                    <div className={styles.stepCard}>
                      <div className={styles.stepNumber}>2</div>
                      <h4>同職種内で順位化</h4>
                      <p>施設内・法人内それぞれで相対評価</p>
                    </div>
                    <div className={styles.stepArrow}>→</div>
                    <div className={styles.stepCard}>
                      <div className={styles.stepNumber}>3</div>
                      <h4>5段階評価</h4>
                      <p>S(上位10%) A(11-30%) B(31-70%) C(71-90%) D(下位10%)</p>
                    </div>
                  </div>
                  
                  <h4 style={{ marginTop: '20px' }}>最終評価マトリックス</h4>
                  <table className={styles.matrixTable}>
                    <thead>
                      <tr>
                        <th>法人内＼施設内</th>
                        <th>D</th>
                        <th>C</th>
                        <th>B</th>
                        <th>A</th>
                        <th>S</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className={styles.gradeS}>S</td>
                        <td className={styles.gradeA}>A</td>
                        <td className={styles.gradeAPlus}>A+</td>
                        <td className={styles.gradeS}>S</td>
                        <td className={styles.gradeS}>S</td>
                        <td className={styles.gradeSPlus}>S+</td>
                      </tr>
                      <tr>
                        <td className={styles.gradeA}>A</td>
                        <td className={styles.gradeB}>B</td>
                        <td className={styles.gradeA}>A</td>
                        <td className={styles.gradeA}>A</td>
                        <td className={styles.gradeAPlus}>A+</td>
                        <td className={styles.gradeS}>S</td>
                      </tr>
                      <tr>
                        <td className={styles.gradeB}>B</td>
                        <td className={styles.gradeC}>C</td>
                        <td className={styles.gradeB}>B</td>
                        <td className={styles.gradeB}>B</td>
                        <td className={styles.gradeA}>A</td>
                        <td className={styles.gradeAPlus}>A+</td>
                      </tr>
                      <tr>
                        <td className={styles.gradeC}>C</td>
                        <td className={styles.gradeD}>D</td>
                        <td className={styles.gradeC}>C</td>
                        <td className={styles.gradeC}>C</td>
                        <td className={styles.gradeB}>B</td>
                        <td className={styles.gradeA}>A</td>
                      </tr>
                      <tr>
                        <td className={styles.gradeD}>D</td>
                        <td className={styles.gradeD}>D</td>
                        <td className={styles.gradeD}>D</td>
                        <td className={styles.gradeC}>C</td>
                        <td className={styles.gradeC}>C</td>
                        <td className={styles.gradeB}>B</td>
                      </tr>
                    </tbody>
                  </table>
                  <p className={styles.matrixNote}>
                    最終評価：7段階（S+, S, A+, A, B, C, D）
                  </p>
                </div>

                {/* 実行ボタン */}
                <div className={styles.integrationActions}>
                  <Link href="/evaluation/batch" className={styles.primaryAction}>
                    <Calculator size={20} />
                    バッチ処理実行
                  </Link>
                  <Link href="/evaluation/reports" className={styles.secondaryAction}>
                    <Download size={20} />
                    レポート出力
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* 第1段階実装: 評価開示タブ */}
          {activeTab === 'disclosure' && (
            <div className={styles.disclosureContent}>
              <h2>評価開示管理（Phase 4）</h2>
              
              <div className={styles.disclosureGrid}>
                {/* 開示チャネル管理 */}
                <div className={styles.channelCard}>
                  <h3>📄 紙面配布（メイン）</h3>
                  <div className={styles.channelStatus}>
                    <span className={styles.statusLabel}>ステータス:</span>
                    <span className={styles.statusValue}>印刷準備中</span>
                  </div>
                  <div className={styles.channelProgress}>
                    <div className={styles.progressHeader}>
                      <span>配布進捗</span>
                      <span>450名中 0名</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: '0%' }} />
                    </div>
                  </div>
                  <button className={styles.actionButton}>印刷開始</button>
                </div>

                <div className={styles.channelCard}>
                  <h3>📱 VoiceDrive SNS（補完）</h3>
                  <div className={styles.channelStatus}>
                    <span className={styles.statusLabel}>ステータス:</span>
                    <span className={styles.statusValue}>連携待機中</span>
                  </div>
                  <p className={styles.channelNote}>
                    第3段階でVoiceDrive連携時に自動通知機能が有効になります
                  </p>
                  <button className={styles.actionButton} disabled>連携設定</button>
                </div>
              </div>

              {/* 開示スケジュール */}
              <div className={styles.scheduleSection}>
                <h3>開示スケジュール（Phase 3〜4）</h3>
                <div className={styles.scheduleTimeline}>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelineMarker}>1</div>
                    <div className={styles.timelineContent}>
                      <h4>開示準備（1週間）</h4>
                      <ul>
                        <li>個別開示内容の決定</li>
                        <li>通知書作成</li>
                      </ul>
                    </div>
                  </div>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelineMarker}>2</div>
                    <div className={styles.timelineContent}>
                      <h4>多チャネル開示（1-2週間）</h4>
                      <ul>
                        <li>紙面配布（人事評価結果通知書）</li>
                        <li>VoiceDrive通知（第3段階実装予定）</li>
                      </ul>
                    </div>
                  </div>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelineMarker}>3</div>
                    <div className={styles.timelineContent}>
                      <h4>フィードバック面談（随時）</h4>
                      <ul>
                        <li>申込者のみ実施</li>
                        <li>キャリア支援重点</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 第2段階実装: 異議申し立てタブ */}
          {activeTab === 'appeal' && (
            <div className={styles.appealContent}>
              <h2>異議申し立て制度</h2>
              
              <div className={styles.appealOverview}>
                <div className={styles.appealInfo}>
                  <h3>制度概要</h3>
                  <p>評価結果に対して疑義がある場合、開示後2週間以内に異議申し立てが可能です。</p>
                  <p>透明性と公平性を確保し、評価の精度向上を目指します。</p>
                </div>

                <div className={styles.appealStats}>
                  <h3>申し立て統計</h3>
                  <div className={styles.statsGrid}>
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>12</span>
                      <span className={styles.statLabel}>今期申し立て件数</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>3</span>
                      <span className={styles.statLabel}>審査中</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>25%</span>
                      <span className={styles.statLabel}>評価修正率</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 申し立てプロセス */}
              <div className={styles.appealProcess}>
                <h3>申し立てプロセス</h3>
                <div className={styles.processFlow}>
                  <div className={styles.processStep}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                      <h4>申請受付</h4>
                      <p>開示後2週間以内</p>
                    </div>
                  </div>
                  <div className={styles.processArrow}>→</div>
                  <div className={styles.processStep}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                      <h4>初回審査</h4>
                      <p>申請後1週間</p>
                    </div>
                  </div>
                  <div className={styles.processArrow}>→</div>
                  <div className={styles.processStep}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepContent}>
                      <h4>再評価実施</h4>
                      <p>必要に応じて</p>
                    </div>
                  </div>
                  <div className={styles.processArrow}>→</div>
                  <div className={styles.processStep}>
                    <div className={styles.stepNumber}>4</div>
                    <div className={styles.stepContent}>
                      <h4>最終決定</h4>
                      <p>申請後3週間以内</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 申し立て理由カテゴリ */}
              <div className={styles.appealReasons}>
                <h3>申し立て理由カテゴリ</h3>
                <div className={styles.reasonGrid}>
                  <div className={styles.reasonCard}>
                    <span className={styles.reasonIcon}>📋</span>
                    <span className={styles.reasonText}>評価基準の誤解釈</span>
                  </div>
                  <div className={styles.reasonCard}>
                    <span className={styles.reasonIcon}>👁️</span>
                    <span className={styles.reasonText}>重要な成果の見落とし</span>
                  </div>
                  <div className={styles.reasonCard}>
                    <span className={styles.reasonIcon}>📅</span>
                    <span className={styles.reasonText}>評価期間の誤り</span>
                  </div>
                  <div className={styles.reasonCard}>
                    <span className={styles.reasonIcon}>⚠️</span>
                    <span className={styles.reasonText}>手続き上の不備</span>
                  </div>
                  <div className={styles.reasonCard}>
                    <span className={styles.reasonIcon}>💬</span>
                    <span className={styles.reasonText}>その他</span>
                  </div>
                </div>
              </div>

              <div className={styles.appealActions}>
                <button className={styles.primaryButton}>新規申し立て</button>
                <button className={styles.secondaryButton}>申し立て履歴</button>
              </div>
            </div>
          )}

          {/* ガイドタブ */}
          {activeTab === 'guide' && (
            <div className={styles.guideContent}>
              {/* ヒーローセクション：1年目職員でも一目で分かる全体像 */}
              <section className={styles.heroSection}>
                <div className={styles.heroHeader}>
                  <h1 className={styles.heroTitle}>
                    <span className={styles.heroEmoji}>🌟</span>
                    新人さん必見！あなたの評価はこう決まる
                  </h1>
                  <p className={styles.heroSubtitle}>
                    1年目でもわかる！人事評価の全てをストーリーで解説
                  </p>
                </div>
                
                {/* アニメーション付き年間タイムライン */}
                <div className={styles.annualTimeline}>
                  <h2 className={styles.timelineTitle}>📅 1年間の評価スケジュール</h2>
                  <div className={styles.timelineContainer}>
                    <div className={styles.timelineTrack}>
                      <div className={styles.timelineItem} data-month="4月">
                        <div className={styles.timelineMarker}></div>
                        <div className={styles.timelineContent}>
                          <h3>入職・目標設定</h3>
                          <p>あなたの成長目標を決めます</p>
                        </div>
                      </div>
                      <div className={styles.timelineItem} data-month="9月">
                        <div className={styles.timelineMarker}></div>
                        <div className={styles.timelineContent}>
                          <h3>中間評価</h3>
                          <p>組織貢献度を確認</p>
                        </div>
                      </div>
                      <div className={styles.timelineItem} data-month="3月">
                        <div className={styles.timelineMarker}></div>
                        <div className={styles.timelineContent}>
                          <h3>年度末評価</h3>
                          <p>技術評価＋最終結果</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* インタラクティブシミュレーター */}
              <section className={styles.simulatorSection}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.sectionEmoji}>🎯</span>
                  あなたの評価点をシミュレーション
                </h2>
                <div className={styles.simulatorContainer}>
                  <div className={styles.simulatorInputs}>
                    <div className={styles.inputGroup}>
                      <label>技術評価（50点満点）</label>
                      <input 
                        type="range" 
                        min="0" 
                        max="50" 
                        defaultValue="35"
                        className={styles.rangeSlider}
                        id="technicalScore"
                      />
                      <span className={styles.scoreDisplay}>35点</span>
                    </div>
                    <div className={styles.inputGroup}>
                      <label>組織貢献度（50点満点）</label>
                      <input 
                        type="range" 
                        min="0" 
                        max="50" 
                        defaultValue="30"
                        className={styles.rangeSlider}
                        id="contributionScore"
                      />
                      <span className={styles.scoreDisplay}>30点</span>
                    </div>
                  </div>
                  <div className={styles.simulatorResult}>
                    <div className={styles.totalScore}>
                      <span className={styles.scoreNumber}>65</span>
                      <span className={styles.scoreLabel}>点 / 100点</span>
                    </div>
                    <div className={styles.scoreGrade}>B評価</div>
                  </div>
                </div>
              </section>

              {/* 配点ロジックの視覚的説明 */}
              <section className={styles.scoringLogicSection}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.sectionEmoji}>📊</span>
                  点数の決まり方を理解しよう
                </h2>
                
                <div className={styles.scoringCards}>
                  <div className={styles.scoringCard}>
                    <div className={styles.cardHeader}>
                      <span className={styles.cardIcon}>🎯</span>
                      <h3>技術評価（50点）</h3>
                    </div>
                    <div className={styles.cardContent}>
                      <div className={styles.scoreBreakdown}>
                        <div className={styles.breakdownItem}>
                          <span className={styles.itemLabel}>法人統一項目</span>
                          <span className={styles.itemScore}>30点</span>
                        </div>
                        <div className={styles.breakdownItem}>
                          <span className={styles.itemLabel}>施設特有項目</span>
                          <span className={styles.itemScore}>20点</span>
                        </div>
                      </div>
                      <div className={styles.whyExplanation}>
                        <h4>なぜ？</h4>
                        <p>どの施設でも必要なスキル（30点）と、あなたの職場特有のスキル（20点）で評価します</p>
                      </div>
                    </div>
                  </div>

                  <div className={styles.scoringCard}>
                    <div className={styles.cardHeader}>
                      <span className={styles.cardIcon}>🤝</span>
                      <h3>組織貢献度（50点）</h3>
                    </div>
                    <div className={styles.cardContent}>
                      <div className={styles.scoreBreakdown}>
                        <div className={styles.breakdownItem}>
                          <span className={styles.itemLabel}>上司評価</span>
                          <span className={styles.itemScore}>70%</span>
                        </div>
                        <div className={styles.breakdownItem}>
                          <span className={styles.itemLabel}>自己評価</span>
                          <span className={styles.itemScore">30%</span>
                        </div>
                      </div>
                      <div className={styles.whyExplanation}>
                        <h4>なぜ？</h4>
                        <p>客観的な視点（上司）と主観的な振り返り（自分）のバランスを取ります</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* FAQ セクション - 1年目職員の疑問に答える */}
              <section className={styles.faqSection}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.sectionEmoji}>❓</span>
                  新人さんからよくある質問
                </h2>
                
                <div className={styles.faqContainer}>
                  <details className={styles.faqItem}>
                    <summary className={styles.faqQuestion}>
                      Q1. 入職1年目でも他の職員と同じ評価基準ですか？
                    </summary>
                    <div className={styles.faqAnswer}>
                      <p><strong>A.</strong> いえ、経験年数に応じて評価基準は調整されます。1年目は「基本的な業務ができる」レベルが求められ、ベテランと比較されることはありません。</p>
                    </div>
                  </details>

                  <details className={styles.faqItem}>
                    <summary className={styles.faqQuestion}>
                      Q2. 自己評価が低すぎると総合評価に悪影響しますか？
                    </summary>
                    <div className={styles.faqAnswer}>
                      <p><strong>A.</strong> 謙遜しすぎる必要はありません。自己評価は30%の重みですし、正直な自己分析が成長につながります。</p>
                    </div>
                  </details>

                  <details className={styles.faqItem}>
                    <summary className={styles.faqQuestion}>
                      Q3. 評価結果はいつ、どのように知らされますか？
                    </summary>
                    <div className={styles.faqAnswer}>
                      <p><strong>A.</strong> 年度末評価は4月中旬、中間評価は10月中旬に個人面談で結果をお伝えします。その後、希望者にはフィードバック面談も実施します。</p>
                    </div>
                  </details>

                  <details className={styles.faqItem}>
                    <summary className={styles.faqQuestion}>
                      Q4. 評価に納得がいかない場合はどうすればいいですか？
                    </summary>
                    <div className={styles.faqAnswer}>
                      <p><strong>A.</strong> 評価開示後2週間以内であれば異議申し立てが可能です。人事部に相談してください。透明性を重視していますので、遠慮なくお声かけください。</p>
                    </div>
                  </details>

                  <details className={styles.faqItem}>
                    <summary className={styles.faqQuestion}>
                      Q5. 他の職員の評価結果と比較されますか？
                    </summary>
                    <div className={styles.faqAnswer}>
                      <p><strong>A.</strong> 基本的には絶対評価（決められた基準との比較）ですが、賞与査定時には一部相対評価も行います。ただし、同期入職者同士での比較が中心で、ベテランとは比較されません。</p>
                    </div>
                  </details>
                </div>
              </section>
            </div>
          )}

          {/* 設定・管理タブ */}
                          <div className={styles.breakdownHeader}>
                            <span className={styles.breakdownTitle}>法人統一項目</span>
                            <span className={styles.breakdownScore}>30点</span>
                          </div>
                          <ul className={styles.breakdownList}>
                            <li>C01: 専門技術・スキル <span>10点（上司70%/本人30%）</span></li>
                            <li>C02: 対人関係・ケア <span>10点（上司50%/本人50%）</span></li>
                            <li>C03: 安全・品質管理 <span>10点（上司80%/本人20%）</span></li>
                          </ul>
                        </div>
                        <div className={styles.breakdownItem}>
                          <div className={styles.breakdownHeader}>
                            <span className={styles.breakdownTitle}>施設特化項目</span>
                            <span className={styles.breakdownScore}>20点</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.evaluationActions}>
                      <Link href="/evaluation/core-v2" className={styles.actionButton}>
                        <Activity size={16} />
                        新V2版で評価開始
                      </Link>
                      <Link href="/evaluation/facility-specific" className={styles.actionButtonSecondary}>
                        施設特化項目を設定
                      </Link>
                    </div>
                  </div>
                  
                  {/* 組織貢献度評価 */}
                  <div className={styles.evaluationCard}>
                    <div className={styles.evaluationHeader} style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                      <div className={styles.evaluationIcon}>
                        <Users size={24} color="white" />
                      </div>
                      <div className={styles.evaluationTitle}>
                        <h4>②組織貢献度評価</h4>
                        <div className={styles.evaluationBadge}>50点</div>
                      </div>
                    </div>
                    
                    <div className={styles.evaluationContent}>
                      <div className={styles.evaluationSchedule}>
                        <div className={styles.scheduleItem}>
                          <Calendar size={16} color="#2196f3" />
                          <div className={styles.scheduleInfo}>
                            <span className={styles.scheduleMonth}>8月: 夏季査定</span>
                          </div>
                        </div>
                        <div className={styles.scheduleItem}>
                          <Calendar size={16} color="#4caf50" />
                          <div className={styles.scheduleInfo}>
                            <span className={styles.scheduleMonth}>12月: 冬季査定</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className={styles.evaluationDesc}>組織への貢献度を相対評価</p>
                      
                      <div className={styles.contributionBreakdown}>
                        <div className={styles.contributionItem}>
                          <Building size={18} />
                          <span>施設貢献度（年間）</span>
                          <span className={styles.contributionScore}>25点</span>
                        </div>
                        <div className={styles.contributionItem}>
                          <Users size={18} />
                          <span>法人貢献度（年間）</span>
                          <span className={styles.contributionScore}>25点</span>
                        </div>
                      </div>
                      
                      <div className={styles.noteBox}>
                        <AlertCircle size={16} />
                        <span>各回12.5点満点で年2回実施</span>
                      </div>
                    </div>
                    
                    <div className={styles.evaluationActions}>
                      <Link href="/evaluation/contribution" className={styles.actionButton}>
                        <Activity size={16} />
                        貢献度評価を開始
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* 実際の評価フロー */}
              <div className={styles.guideSection}>
                <h3 className={styles.sectionTitle}>
                  <span className={styles.titleIcon}>🔄</span>
                  実際の評価フロー（6フェーズ）
                </h3>
                <div className={styles.flowTimeline}>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelineMarker}>
                      <span className={styles.markerNumber}>1</span>
                      <div className={styles.timelineLine}></div>
                    </div>
                    <div className={styles.timelineContent}>
                      <div className={styles.timelineHeader}>
                        <h4>Phase 1: 評価実施期間</h4>
                        <span className={styles.timelineDuration}>約4週間</span>
                      </div>
                      <div className={styles.timelineDetail}>
                        <div className={styles.weekSchedule}>
                          <div className={styles.weekItem}>
                            <span className={styles.weekLabel}>Week 1-2</span>
                            <span className={styles.weekTask}>自己評価・上司評価</span>
                          </div>
                          <div className={styles.weekItem}>
                            <span className={styles.weekLabel}>Week 3</span>
                            <span className={styles.weekTask}>同僚評価（任意）</span>
                          </div>
                          <div className={styles.weekItem}>
                            <span className={styles.weekLabel}>Week 4</span>
                            <span className={styles.weekTask}>人事部集計</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.timelineItem}>
                    <div className={styles.timelineMarker}>
                      <span className={styles.markerNumber}>2</span>
                      <div className={styles.timelineLine}></div>
                    </div>
                    <div className={styles.timelineContent}>
                      <div className={styles.timelineHeader}>
                        <h4>Phase 2: 評価算出・調整</h4>
                        <span className={styles.timelineDuration}>1-2週間</span>
                      </div>
                      <div className={styles.timelineDetail}>
                        <div className={styles.evaluationProcess}>
                          <div className={styles.processStep}>
                            <Building size={16} />
                            <span>施設内相対評価（S〜D）</span>
                          </div>
                          <ChevronRight size={16} />
                          <div className={styles.processStep}>
                            <Users size={16} />
                            <span>法人内相対評価（S〜D）</span>
                          </div>
                          <ChevronRight size={16} />
                          <div className={styles.processStep}>
                            <Award size={16} />
                            <span>総合評価マトリクス（7段階）</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.timelineItem}>
                    <div className={styles.timelineMarker}>
                      <span className={styles.markerNumber}>3</span>
                      <div className={styles.timelineLine}></div>
                    </div>
                    <div className={styles.timelineContent}>
                      <div className={styles.timelineHeader}>
                        <h4>Phase 3: 開示準備</h4>
                        <span className={styles.timelineDuration}>1週間</span>
                      </div>
                      <div className={styles.timelineDetail}>
                        <ul className={styles.taskList}>
                          <li>
                            <CheckCircle size={14} />
                            個別開示内容の決定
                          </li>
                          <li>
                            <CheckCircle size={14} />
                            通知書作成
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.timelineItem}>
                    <div className={styles.timelineMarker}>
                      <span className={styles.markerNumber}>4</span>
                      <div className={styles.timelineLine}></div>
                    </div>
                    <div className={styles.timelineContent}>
                      <div className={styles.timelineHeader}>
                        <h4>Phase 4: 多チャネル開示</h4>
                        <span className={styles.timelineDuration}>1-2週間</span>
                      </div>
                      <div className={styles.timelineDetail}>
                        <div className={styles.disclosureChannels}>
                          <div className={styles.channelItem}>
                            <FileText size={20} />
                            <div>
                              <div className={styles.channelName}>紙面配布（メイン）</div>
                              <div className={styles.channelDesc}>人事評価結果通知書</div>
                            </div>
                          </div>
                          <div className={styles.channelItem}>
                            <Bell size={20} />
                            <div>
                              <div className={styles.channelName}>VoiceDrive SNS（補完）</div>
                              <div className={styles.channelDesc}>個人宛通知</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.timelineItem}>
                    <div className={styles.timelineMarker}>
                      <span className={styles.markerNumber}>5</span>
                      <div className={styles.timelineLine}></div>
                    </div>
                    <div className={styles.timelineContent}>
                      <div className={styles.timelineHeader}>
                        <h4>Phase 5: フィードバック面談</h4>
                        <span className={styles.timelineDuration}>任意・随時</span>
                      </div>
                      <div className={styles.timelineDetail}>
                        <div className={styles.feedbackInfo}>
                          <UserCheck size={16} />
                          <span>申込者のみ実施・キャリア支援重点</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.timelineItem}>
                    <div className={styles.timelineMarker}>
                      <span className={styles.markerNumber}>6</span>
                    </div>
                    <div className={styles.timelineContent}>
                      <div className={styles.timelineHeader}>
                        <h4>Phase 6: 継続フォロー</h4>
                        <span className={styles.timelineDuration}>通年</span>
                      </div>
                      <div className={styles.timelineDetail}>
                        <div className={styles.followupInfo}>
                          <TrendingUp size={16} />
                          <span>希望者への定期的な成長支援</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.guideSection}>
                <h3>⚠️ 重要：職員階層定義について（開発メモ）</h3>
                <div className={styles.developerNote}>
                  <h4>評価システムと面談システムの階層対応</h4>
                  <p className={styles.warningText}>
                    <strong>注意：評価システムと面談システムでは階層定義が異なります</strong>
                  </p>
                  
                  <h5>看護師の役職階層</h5>
                  <table className={styles.hierarchyTable}>
                    <thead>
                      <tr>
                        <th>役職</th>
                        <th>評価システム</th>
                        <th>面談システム</th>
                        <th>備考</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>主任看護師</td>
                        <td><code>ward-chief</code></td>
                        <td><code>leader-nurse</code></td>
                        <td>病棟主任・外来主任共通</td>
                      </tr>
                      <tr>
                        <td>病棟師長</td>
                        <td><code>ward-manager</code></td>
                        <td><code>chief-nurse</code></td>
                        <td>病棟師長・外来師長共通</td>
                      </tr>
                    </tbody>
                  </table>
                  
                  <h5>システム設計の違い</h5>
                  <ul className={styles.systemDifference}>
                    <li><strong>評価システム</strong>: 将来的に病棟・外来を区別した詳細評価を想定
                      <ul>
                        <li>病棟主任用: <code>ward-chief-evaluation</code></li>
                        <li>外来主任用: <code>outpatient-chief-evaluation</code>（今後実装）</li>
                      </ul>
                    </li>
                    <li><strong>面談システム</strong>: 病棟・外来共通のシートで運用
                      <ul>
                        <li>主任共通: <code>leader-nurse-unified</code></li>
                        <li>師長共通: <code>chief-nurse-unified</code></li>
                      </ul>
                    </li>
                  </ul>
                  
                  <div className={styles.referenceLink}>
                    <p>📚 詳細は階層定義ドキュメントを参照:</p>
                    <code>docs/STAFF_HIERARCHY_DEFINITION.md</code>
                  </div>
                </div>
              </div>

              <div className={styles.implementationNote}>
                <h3>🚀 今後の実装予定</h3>
                
                <div className={styles.implementPhase}>
                  <h4>第3段階実装（バックエンド開発時）</h4>
                  <p className={styles.phaseDescription}>
                    フロントエンド開発が進んでDB関連の実装作業に入る際に実装
                  </p>
                  <ul>
                    <li>評価データベース設計・実装</li>
                    <li>VoiceDrive連携API実装</li>
                    <li>自動集計・相対評価エンジン</li>
                    <li>異議申し立てワークフロー</li>
                    <li>評価結果通知の自動生成</li>
                  </ul>
                  
                  <div className={styles.implementationCommand}>
                    <h5>実装指示書（Claude用）</h5>
                    <code>
{`// 第3段階実装指示:
// 1. データベース設計
//    - evaluations テーブル（技術評価・貢献度評価）
//    - appeals テーブル（異議申し立て管理）
//    - disclosure_logs テーブル（開示履歴）
// 
// 2. 相対評価エンジン実装
//    const calculateTwoAxisEvaluation = (employee) => {
//      // 施設内相対評価
//      const facilityRank = calculateRelativeRank(
//        employee.totalScore,
//        employee.facility,
//        employee.position
//      );
//      // 法人内相対評価
//      const corporateRank = calculateRelativeRank(
//        employee.totalScore,
//        'all_facilities',
//        employee.position
//      );
//      // マトリクス評価
//      return matrixMapping[facilityRank][corporateRank];
//    }
//
// 3. VoiceDrive連携
//    - /api/v1/evaluation/results - 評価結果API
//    - /api/v1/evaluation/appeals - 異議申し立てAPI
//    - WebSocket通知機能
//
// 4. 参照ドキュメント
//    - docs/evaluation-system-design.md（作成予定）
//    - src/types/evaluation.ts（型定義）
//    - VoiceDrive API仕様書`}
                    </code>
                  </div>
                </div>

                <div className={styles.noteCard}>
                  <h4>📝 開発メモ</h4>
                  <p>第1段階（評価開示タブ）と第2段階（異議申し立てタブ）は実装済みです。</p>
                  <p>第3段階はバックエンド開発開始時に、この指示書を参照して実装してください。</p>
                </div>
              </div>
            </div>
          )}

          {/* 設定・管理タブ */}
          {activeTab === 'settings' && (
            <div className={styles.settingsContent}>
              <div className={styles.settingsGrid}>
                <Link href="/evaluation/config" className={styles.settingsCard}>
                  <div className={styles.settingsIcon}>
                    <Settings size={36} color="#1976d2" />
                  </div>
                  <div className={styles.settingsInfo}>
                    <h3>評価項目管理</h3>
                    <p>大項目・中項目・小項目の設定</p>
                    <span className={styles.settingsAction}>設定する →</span>
                  </div>
                </Link>

                <Link href="/evaluation/config" className={styles.settingsCard}>
                  <div className={styles.settingsIcon}>
                    <Target size={36} color="#388e3c" />
                  </div>
                  <div className={styles.settingsInfo}>
                    <h3>配点設定</h3>
                    <p>評価項目の配点と重み付け</p>
                    <span className={styles.settingsAction}>設定する →</span>
                  </div>
                </Link>

                <Link href="/evaluation/config" className={styles.settingsCard}>
                  <div className={styles.settingsIcon}>
                    <FileText size={36} color="#f57c00" />
                  </div>
                  <div className={styles.settingsInfo}>
                    <h3>Excel管理</h3>
                    <p>Excelテンプレートのインポート・エクスポート</p>
                    <span className={styles.settingsAction}>管理する →</span>
                  </div>
                </Link>

                <Link href="/evaluation/config" className={styles.settingsCard}>
                  <div className={styles.settingsIcon}>
                    <Users size={36} color="#7b1fa2" />
                  </div>
                  <div className={styles.settingsInfo}>
                    <h3>権限管理</h3>
                    <p>評価入力・閲覧権限の設定</p>
                    <span className={styles.settingsAction}>設定する →</span>
                  </div>
                </Link>

                <Link href="/education" className={styles.settingsCard}>
                  <div className={styles.settingsIcon}>
                    <BookOpen size={36} color="#00796b" />
                  </div>
                  <div className={styles.settingsInfo}>
                    <h3>教育連携</h3>
                    <p>評価と教育研修の連携設定</p>
                    <span className={styles.settingsAction}>設定する →</span>
                  </div>
                </Link>

                <Link href="/evaluation/analytics" className={styles.settingsCard}>
                  <div className={styles.settingsIcon}>
                    <BarChart3 size={36} color="#c2185b" />
                  </div>
                  <div className={styles.settingsInfo}>
                    <h3>分析・レポート</h3>
                    <p>評価データの分析とレポート出力</p>
                    <span className={styles.settingsAction}>分析する →</span>
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <DashboardButton />
    </div>
  )
}