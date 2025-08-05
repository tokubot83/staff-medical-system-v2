'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, TrendingUp, Users, Calendar, Target } from 'lucide-react'
import styles from '@/app/staff-cards/StaffCards.module.css'

interface DashboardTabContentProps {
  selectedStaff: any
  staffInterviews: any[]
}

export function DashboardTabContent({ selectedStaff, staffInterviews }: DashboardTabContentProps) {
  // 次回面談日の計算（仮）
  const nextInterviewDate = new Date()
  nextInterviewDate.setDate(nextInterviewDate.getDate() + 14)

  return (
    <div className={styles.dashboardContent}>
      {/* 現在の関心事・重点課題 */}
      <Card className={styles.currentStatusCard}>
        <CardHeader>
          <div className={styles.statusHeader}>
            <span className={styles.statusIcon}>🎯</span>
            <CardTitle>現在の関心事・重点課題</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* 次回面談の推奨アプローチ */}
      <Card className={styles.recommendationPanel} style={{ marginTop: '20px' }}>
        <CardHeader>
          <CardTitle>次回面談の推奨アプローチ</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* サマリー情報 */}
      <div className={styles.summaryMetricsRow} style={{ marginTop: '20px' }}>
        <div className={styles.metricsGrid}>
          <div className={styles.metricCardEnhanced}>
            <div className={styles.metricHeader}>
              <span className={styles.metricIcon}>💬</span>
              <span className={styles.metricTrend}>+2</span>
            </div>
            <div className={styles.metricValue}>{staffInterviews.length}回</div>
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
              <div className={styles.cardSubInfo}>{nextInterviewDate.toLocaleDateString('ja-JP')} 14:00</div>
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

      {/* アラート */}
      <Alert className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          キャリアパスに関する不安が高まっています。次回面談では具体的なキャリアプランの策定を重点的に行うことを推奨します。
        </AlertDescription>
      </Alert>
    </div>
  )
}