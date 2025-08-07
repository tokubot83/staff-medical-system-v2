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
  Award
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

export default function EvaluationDashboard() {
  const [currentTasks, setCurrentTasks] = useState<Task[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [progressData, setProgressData] = useState({
    technical: 0,
    contribution: 0,
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
    
    // 進捗データを設定（モックデータ）
    setProgressData({
      technical: 65,
      contribution: 80,
      integrated: 0
    })
  }, [])

  return (
    <div>
      <CommonHeader title="評価管理ダッシュボード" />
      
      <div className={styles.dashboardContainer}>
        {/* アクションが必要なタスク */}
        <section className={styles.actionSection}>
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

        {/* 進捗状況 */}
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

        {/* クイックアクセス */}
        <section className={styles.quickAccessSection}>
          <div className={styles.sectionHeader}>
            <h2>
              <TrendingUp className={styles.headerIcon} />
              クイックアクセス
            </h2>
          </div>
          
          <div className={styles.quickAccessGrid}>
            <Link href="/evaluation/technical" className={styles.quickCard}>
              <div className={styles.quickIcon} style={{ backgroundColor: '#e3f2fd' }}>
                <FileText style={{ color: '#1976d2' }} />
              </div>
              <div className={styles.quickContent}>
                <h3>技術評価入力</h3>
                <p>年次技術評価の実施</p>
              </div>
            </Link>
            
            <Link href="/evaluation/contribution" className={styles.quickCard}>
              <div className={styles.quickIcon} style={{ backgroundColor: '#fce4ec' }}>
                <Users style={{ color: '#c2185b' }} />
              </div>
              <div className={styles.quickContent}>
                <h3>組織貢献度査定</h3>
                <p>半期ごとの貢献度評価</p>
              </div>
            </Link>
            
            <Link href="/evaluation/integrated" className={styles.quickCard}>
              <div className={styles.quickIcon} style={{ backgroundColor: '#e8f5e9' }}>
                <Target style={{ color: '#388e3c' }} />
              </div>
              <div className={styles.quickContent}>
                <h3>統合評価実施</h3>
                <p>年度末総合評価</p>
              </div>
            </Link>
            
            <Link href="/evaluation/batch" className={styles.quickCard}>
              <div className={styles.quickIcon} style={{ backgroundColor: '#fff3e0' }}>
                <Settings style={{ color: '#f57c00' }} />
              </div>
              <div className={styles.quickContent}>
                <h3>バッチ処理</h3>
                <p>一括計算処理</p>
              </div>
            </Link>
            
            <Link href="/evaluation/analytics" className={styles.quickCard}>
              <div className={styles.quickIcon} style={{ backgroundColor: '#f3e5f5' }}>
                <BarChart3 style={{ color: '#7b1fa2' }} />
              </div>
              <div className={styles.quickContent}>
                <h3>分析・レポート</h3>
                <p>評価結果の分析</p>
              </div>
            </Link>
            
            <Link href="/evaluation/config" className={styles.quickCard}>
              <div className={styles.quickIcon} style={{ backgroundColor: '#e0f2f1' }}>
                <Settings style={{ color: '#00796b' }} />
              </div>
              <div className={styles.quickContent}>
                <h3>評価項目設定</h3>
                <p>評価基準の管理</p>
              </div>
            </Link>
          </div>
        </section>

        {/* 通知・お知らせ */}
        <section className={styles.notificationSection}>
          <div className={styles.sectionHeader}>
            <h2>
              <Bell className={styles.headerIcon} />
              通知・お知らせ
            </h2>
            <Link href="/evaluation/notifications" className={styles.viewAll}>
              すべて見る
            </Link>
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

        {/* 年間スケジュール */}
        <section className={styles.scheduleSection}>
          <div className={styles.sectionHeader}>
            <h2>
              <Calendar className={styles.headerIcon} />
              年間評価スケジュール
            </h2>
          </div>
          
          <div className={styles.scheduleTimeline}>
            <div className={styles.timelineItem}>
              <div className={styles.timelineMarker} style={{ backgroundColor: '#1976d2' }}>
                <span>3月</span>
              </div>
              <div className={styles.timelineContent}>
                <h4>技術評価</h4>
                <p>年度末技術評価（50点）</p>
              </div>
            </div>
            
            <div className={styles.timelineItem}>
              <div className={styles.timelineMarker} style={{ backgroundColor: '#388e3c' }}>
                <span>8月</span>
              </div>
              <div className={styles.timelineContent}>
                <h4>夏季賞与査定</h4>
                <p>12～5月実績評価（25点）</p>
              </div>
            </div>
            
            <div className={styles.timelineItem}>
              <div className={styles.timelineMarker} style={{ backgroundColor: '#f57c00' }}>
                <span>12月</span>
              </div>
              <div className={styles.timelineContent}>
                <h4>冬季賞与査定</h4>
                <p>6～11月実績評価（25点）</p>
              </div>
            </div>
            
            <div className={styles.timelineItem}>
              <div className={styles.timelineMarker} style={{ backgroundColor: '#c2185b' }}>
                <span>3月末</span>
              </div>
              <div className={styles.timelineContent}>
                <h4>総合評価</h4>
                <p>年度末最終判定（100点）</p>
              </div>
            </div>
          </div>
        </section>

        {/* その他の機能 */}
        <section className={styles.otherSection}>
          <div className={styles.sectionHeader}>
            <h2>その他の機能</h2>
          </div>
          
          <div className={styles.otherLinks}>
            <Link href="/evaluation/history" className={styles.otherLink}>
              <FileText className={styles.otherIcon} />
              <span>評価履歴</span>
              <ChevronRight />
            </Link>
            
            <Link href="/evaluation/reports" className={styles.otherLink}>
              <FileText className={styles.otherIcon} />
              <span>レポート出力</span>
              <ChevronRight />
            </Link>
            
            <Link href="/education" className={styles.otherLink}>
              <Users className={styles.otherIcon} />
              <span>教育・研修連携</span>
              <ChevronRight />
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}