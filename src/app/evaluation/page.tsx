'use client'

import React, { useState, useEffect } from 'react'
import CommonHeader from '@/components/CommonHeader'
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
  Activity
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

// タブ定義
const tabs = [
  { id: 'dashboard', label: 'ダッシュボード', icon: '📊' },
  { id: 'execution', label: '評価実施', icon: '📝' },
  { id: 'analytics', label: '分析・レポート', icon: '📈' },
  { id: 'settings', label: '評価設定', icon: '⚙️' },
  { id: 'education', label: '教育連携', icon: '🎓' },
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
  const [activeTab, setActiveTab] = useState('dashboard')
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
      
      <div className={styles.tabContainer}>
        {/* タブナビゲーション */}
        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              <span className={styles.tabLabel}>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* タブコンテンツ */}
        <div className={styles.tabContent}>
          {/* ダッシュボードタブ */}
          {activeTab === 'dashboard' && (
            <div className={styles.dashboardContent}>
              <div className={styles.dashboardGrid}>
                {/* 左カラム: タスクと通知 */}
                <div className={styles.leftColumn}>
                  {/* 今すぐ対応が必要なタスク */}
                  <section className={styles.taskSection}>
                    <div className={styles.sectionHeader}>
                      <h2>
                        <Clock className={styles.headerIcon} />
                        今すぐ対応が必要
                      </h2>
                      <span className={styles.badge}>{currentTasks.length}件</span>
                    </div>
                    
                    <div className={styles.taskCards}>
                      {currentTasks.length > 0 ? (
                        currentTasks.map((task, index) => (
                          <Link key={index} href={task.link} className={styles.taskCard}>
                            <div className={`${styles.taskStatus} ${styles[task.type]}`}>
                              {task.type === 'urgent' ? <AlertCircle /> : <Clock />}
                            </div>
                            <div className={styles.taskContent}>
                              <h3>{task.title}</h3>
                              <p>{task.description}</p>
                              <span className={styles.deadline}>期限: {task.deadline}</span>
                            </div>
                            <ChevronRight className={styles.taskArrow} />
                          </Link>
                        ))
                      ) : (
                        <div className={styles.noTasks}>
                          <CheckCircle className={styles.successIcon} />
                          <p>現在対応が必要なタスクはありません</p>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* 通知 */}
                  <section className={styles.notificationSection}>
                    <div className={styles.sectionHeader}>
                      <h2>
                        <Bell className={styles.headerIcon} />
                        最新の通知
                      </h2>
                    </div>
                    
                    <div className={styles.notificationList}>
                      {notifications.map(notification => (
                        <div key={notification.id} className={styles.notificationItem}>
                          <div className={`${styles.notificationIcon} ${styles[notification.type]}`}>
                            {notification.type === 'warning' && <AlertCircle />}
                            {notification.type === 'info' && <Bell />}
                            {notification.type === 'success' && <CheckCircle />}
                          </div>
                          <div className={styles.notificationContent}>
                            <p>{notification.message}</p>
                            <span className={styles.notificationTime}>{notification.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                {/* 右カラム: 進捗とクイックアクセス */}
                <div className={styles.rightColumn}>
                  {/* 評価進捗 */}
                  <section className={styles.progressSection}>
                    <div className={styles.sectionHeader}>
                      <h2>
                        <BarChart3 className={styles.headerIcon} />
                        評価進捗状況
                      </h2>
                    </div>
                    
                    <div className={styles.progressCards}>
                      <div className={styles.progressCard}>
                        <div className={styles.progressHeader}>
                          <Target className={styles.progressIcon} />
                          <span>技術評価</span>
                        </div>
                        <div className={styles.progressBar}>
                          <div 
                            className={styles.progressFill} 
                            style={{ width: `${progressData.technical}%` }}
                          />
                        </div>
                        <div className={styles.progressInfo}>
                          <span>{progressData.technical}% 完了</span>
                          <span className={styles.progressCount}>130/200名</span>
                        </div>
                      </div>
                      
                      <div className={styles.progressCard}>
                        <div className={styles.progressHeader}>
                          <Users className={styles.progressIcon} />
                          <span>組織貢献度</span>
                        </div>
                        <div className={styles.progressBar}>
                          <div 
                            className={styles.progressFill} 
                            style={{ width: `${progressData.contribution}%` }}
                          />
                        </div>
                        <div className={styles.progressInfo}>
                          <span>{progressData.contribution}% 完了</span>
                          <span className={styles.progressCount}>160/200名</span>
                        </div>
                      </div>
                      
                      <div className={styles.progressCard}>
                        <div className={styles.progressHeader}>
                          <Award className={styles.progressIcon} />
                          <span>総合評価</span>
                        </div>
                        <div className={styles.progressBar}>
                          <div 
                            className={styles.progressFill} 
                            style={{ width: `${progressData.integrated}%` }}
                          />
                        </div>
                        <div className={styles.progressInfo}>
                          <span>{progressData.integrated}% 完了</span>
                          <span className={styles.progressCount}>0/200名</span>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* 年間スケジュール */}
                  <section className={styles.scheduleSection}>
                    <div className={styles.sectionHeader}>
                      <h2>
                        <Calendar className={styles.headerIcon} />
                        年間スケジュール
                      </h2>
                    </div>
                    
                    <div className={styles.scheduleTimeline}>
                      <div className={styles.timelineItem}>
                        <div className={styles.timelineMarker} style={{ backgroundColor: '#1976d2' }}>
                          <span>3月</span>
                        </div>
                        <div className={styles.timelineContent}>
                          <h4>技術評価</h4>
                          <p>年度末評価（50点）</p>
                        </div>
                      </div>
                      
                      <div className={styles.timelineItem}>
                        <div className={styles.timelineMarker} style={{ backgroundColor: '#388e3c' }}>
                          <span>8月</span>
                        </div>
                        <div className={styles.timelineContent}>
                          <h4>夏季賞与査定</h4>
                          <p>施設貢献（12.5点）+ 法人貢献（12.5点）</p>
                        </div>
                      </div>
                      
                      <div className={styles.timelineItem}>
                        <div className={styles.timelineMarker} style={{ backgroundColor: '#f57c00' }}>
                          <span>12月</span>
                        </div>
                        <div className={styles.timelineContent}>
                          <h4>冬季賞与査定</h4>
                          <p>施設貢献（12.5点）+ 法人貢献（12.5点）</p>
                        </div>
                      </div>
                      
                      <div className={styles.timelineItem}>
                        <div className={styles.timelineMarker} style={{ backgroundColor: '#c2185b' }}>
                          <span>3月末</span>
                        </div>
                        <div className={styles.timelineContent}>
                          <h4>総合評価</h4>
                          <p>最終判定（100点）</p>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          )}

          {/* 評価実施タブ */}
          {activeTab === 'execution' && (
            <div className={styles.executionContent}>
              <div className={styles.executionGrid}>
                <Link href="/evaluation/technical" className={styles.executionCard}>
                  <div className={styles.cardIcon}>
                    <ClipboardCheck size={40} color="#1976d2" />
                  </div>
                  <h3>技術評価</h3>
                  <p>年次技術評価の実施（3月）</p>
                  <div className={styles.cardFooter}>
                    <span className={styles.cardStatus}>進行中</span>
                    <ChevronRight className={styles.cardArrow} />
                  </div>
                </Link>

                <Link href="/evaluation/contribution" className={styles.executionCard}>
                  <div className={styles.cardIcon}>
                    <Users size={40} color="#388e3c" />
                  </div>
                  <h3>組織貢献度評価</h3>
                  <p>半期ごとの貢献度査定</p>
                  <div className={styles.cardFooter}>
                    <span className={styles.cardStatus}>進行中</span>
                    <ChevronRight className={styles.cardArrow} />
                  </div>
                </Link>

                <Link href="/evaluation/integrated" className={styles.executionCard}>
                  <div className={styles.cardIcon}>
                    <Target size={40} color="#f57c00" />
                  </div>
                  <h3>統合評価</h3>
                  <p>年度末総合評価（3月末）</p>
                  <div className={styles.cardFooter}>
                    <span className={styles.cardStatus}>準備中</span>
                    <ChevronRight className={styles.cardArrow} />
                  </div>
                </Link>

                <Link href="/evaluation/batch" className={styles.executionCard}>
                  <div className={styles.cardIcon}>
                    <Settings size={40} color="#7b1fa2" />
                  </div>
                  <h3>バッチ処理</h3>
                  <p>年度末一括計算処理</p>
                  <div className={styles.cardFooter}>
                    <span className={styles.cardStatus}>待機中</span>
                    <ChevronRight className={styles.cardArrow} />
                  </div>
                </Link>

                <Link href="/evaluation/history" className={styles.executionCard}>
                  <div className={styles.cardIcon}>
                    <FileText size={40} color="#00796b" />
                  </div>
                  <h3>評価履歴</h3>
                  <p>過去の評価記録閲覧</p>
                  <div className={styles.cardFooter}>
                    <span className={styles.cardStatus}>利用可能</span>
                    <ChevronRight className={styles.cardArrow} />
                  </div>
                </Link>

                <Link href="/evaluation-sheets" className={styles.executionCard}>
                  <div className={styles.cardIcon}>
                    <FileText size={40} color="#c2185b" />
                  </div>
                  <h3>評価シート</h3>
                  <p>評価シートの選択・入力</p>
                  <div className={styles.cardFooter}>
                    <span className={styles.cardStatus}>利用可能</span>
                    <ChevronRight className={styles.cardArrow} />
                  </div>
                </Link>
              </div>
            </div>
          )}

          {/* 分析・レポートタブ */}
          {activeTab === 'analytics' && (
            <div className={styles.analyticsContent}>
              <div className={styles.analyticsGrid}>
                <Link href="/evaluation/analytics" className={styles.analyticsCard}>
                  <div className={styles.cardHeader}>
                    <BarChart3 size={32} color="#1976d2" />
                    <h3>部署別分析</h3>
                  </div>
                  <p>部署ごとの評価分布と傾向分析</p>
                  <div className={styles.cardStats}>
                    <div className={styles.stat}>
                      <span className={styles.statLabel}>対象部署</span>
                      <span className={styles.statValue}>12</span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.statLabel}>平均評価</span>
                      <span className={styles.statValue}>B+</span>
                    </div>
                  </div>
                </Link>

                <Link href="/evaluation/analytics" className={styles.analyticsCard}>
                  <div className={styles.cardHeader}>
                    <TrendingUp size={32} color="#388e3c" />
                    <h3>職種別分析</h3>
                  </div>
                  <p>職種カテゴリ別の評価比較</p>
                  <div className={styles.cardStats}>
                    <div className={styles.stat}>
                      <span className={styles.statLabel}>対象職種</span>
                      <span className={styles.statValue}>8</span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.statLabel}>最高評価</span>
                      <span className={styles.statValue}>看護師</span>
                    </div>
                  </div>
                </Link>

                <Link href="/evaluation/analytics" className={styles.analyticsCard}>
                  <div className={styles.cardHeader}>
                    <Activity size={32} color="#f57c00" />
                    <h3>個人別推移</h3>
                  </div>
                  <p>個人の評価推移と成長分析</p>
                  <div className={styles.cardStats}>
                    <div className={styles.stat}>
                      <span className={styles.statLabel}>対象者数</span>
                      <span className={styles.statValue}>200名</span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.statLabel}>向上率</span>
                      <span className={styles.statValue}>68%</span>
                    </div>
                  </div>
                </Link>

                <Link href="/evaluation/reports" className={styles.analyticsCard}>
                  <div className={styles.cardHeader}>
                    <Download size={32} color="#7b1fa2" />
                    <h3>レポート出力</h3>
                  </div>
                  <p>Excel・PDF形式でのレポート出力</p>
                  <div className={styles.cardStats}>
                    <div className={styles.stat}>
                      <span className={styles.statLabel}>テンプレート</span>
                      <span className={styles.statValue}>5種類</span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.statLabel}>最終出力</span>
                      <span className={styles.statValue}>昨日</span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          )}

          {/* 評価設定タブ */}
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
              </div>
            </div>
          )}

          {/* 教育連携タブ */}
          {activeTab === 'education' && (
            <div className={styles.educationContent}>
              <div className={styles.educationGrid}>
                <Link href="/education" className={styles.educationCard}>
                  <div className={styles.educationHeader}>
                    <BookOpen size={40} color="#1976d2" />
                    <h3>教育研修管理</h3>
                  </div>
                  <p>評価と連動した研修プログラムの管理</p>
                  <ul className={styles.educationFeatures}>
                    <li>評価結果に基づく研修推奨</li>
                    <li>スキルギャップ分析</li>
                    <li>個別育成計画作成</li>
                  </ul>
                  <div className={styles.educationAction}>
                    <span>管理画面へ</span>
                    <ChevronRight />
                  </div>
                </Link>

                <Link href="/education/planning" className={styles.educationCard}>
                  <div className={styles.educationHeader}>
                    <Calendar size={40} color="#388e3c" />
                    <h3>年間研修計画</h3>
                  </div>
                  <p>施設・職種別の研修スケジュール</p>
                  <ul className={styles.educationFeatures}>
                    <li>必須研修の管理</li>
                    <li>選択研修の設定</li>
                    <li>受講状況の追跡</li>
                  </ul>
                  <div className={styles.educationAction}>
                    <span>計画を見る</span>
                    <ChevronRight />
                  </div>
                </Link>

                <div className={styles.educationInfo}>
                  <h4>システム連携の特徴</h4>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <CheckCircle size={20} color="#4caf50" />
                      <span>評価結果から自動で研修を推奨</span>
                    </div>
                    <div className={styles.infoItem}>
                      <CheckCircle size={20} color="#4caf50" />
                      <span>研修受講履歴が評価に反映</span>
                    </div>
                    <div className={styles.infoItem}>
                      <CheckCircle size={20} color="#4caf50" />
                      <span>教育師長による統合管理</span>
                    </div>
                    <div className={styles.infoItem}>
                      <CheckCircle size={20} color="#4caf50" />
                      <span>スキルマトリクスの自動生成</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}