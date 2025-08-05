'use client'

import React from 'react'
import { Bar, Line, Doughnut, Radar } from 'react-chartjs-2'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { TrendingUp, AlertCircle, BarChart3 } from 'lucide-react'
import styles from '@/app/staff-cards/StaffCards.module.css'

interface AnalyticsTabContentProps {
  interviewFrequencyData: any
  satisfactionTrendData: any
  topicAnalysisData: any
  coachingEffectData: any
}

export function AnalyticsTabContent({
  interviewFrequencyData,
  satisfactionTrendData,
  topicAnalysisData,
  coachingEffectData
}: AnalyticsTabContentProps) {
  return (
    <div className={styles.analyticsContent}>
      <div className={styles.chartGrid}>
        <Card className={styles.chartContainer}>
          <CardHeader>
            <CardTitle>面談実施状況</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className={`${styles.alert} ${styles.alertWarning}`} style={{ marginBottom: '16px' }}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                定期面談は予定通り実施。フォロー面談の頻度を増やすことで、さらなる成長支援が可能です。
              </AlertDescription>
            </Alert>
            <div className={styles.chartWrapper}>
              <Bar data={interviewFrequencyData} options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    stacked: true
                  },
                  y: {
                    stacked: true,
                    beginAtZero: true
                  }
                },
                plugins: {
                  legend: {
                    position: 'bottom' as const
                  }
                }
              }} />
            </div>
          </CardContent>
        </Card>

        <Card className={styles.chartContainer}>
          <CardHeader>
            <CardTitle>面談満足度推移</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className={`${styles.alert} ${styles.alertSuccess}`} style={{ marginBottom: '16px' }}>
              <TrendingUp className="h-4 w-4" />
              <AlertDescription>
                満足度は上昇傾向。特に法人面談での改善が顕著です。継続的な質の向上が期待できます。
              </AlertDescription>
            </Alert>
            <div className={styles.chartWrapper}>
              <Line data={satisfactionTrendData} options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100
                  }
                },
                plugins: {
                  legend: {
                    position: 'bottom' as const
                  }
                }
              }} />
            </div>
          </CardContent>
        </Card>

        <Card className={styles.chartContainer}>
          <CardHeader>
            <CardTitle>話題分析</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className={`${styles.alert} ${styles.alertInfo}`} style={{ marginBottom: '16px' }}>
              <BarChart3 className="h-4 w-4" />
              <AlertDescription>
                施設面談60%、法人面談40%の割合。バランスの取れた面談実施状況です。
              </AlertDescription>
            </Alert>
            <div className={styles.chartWrapper}>
              <Doughnut data={topicAnalysisData} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom' as const
                  }
                }
              }} />
            </div>
          </CardContent>
        </Card>

        <Card className={styles.chartContainer}>
          <CardHeader>
            <CardTitle>指導効果測定</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className={`${styles.alert} ${styles.alertSuccess}`} style={{ marginBottom: '16px' }}>
              <TrendingUp className="h-4 w-4" />
              <AlertDescription>
                全項目で目標値を上回る成果。特にモチベーション向上が顕著です。
              </AlertDescription>
            </Alert>
            <div className={styles.chartWrapper}>
              <Radar data={coachingEffectData} options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  r: {
                    beginAtZero: true,
                    max: 100
                  }
                },
                plugins: {
                  legend: {
                    position: 'bottom' as const
                  }
                }
              }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 統計サマリー */}
      <Card style={{ marginTop: '20px' }}>
        <CardHeader>
          <CardTitle>年間統計サマリー</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>総面談回数</div>
              <div className={styles.statValue}>48回</div>
              <div className={styles.statChange}>前年比 +12%</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>平均面談時間</div>
              <div className={styles.statValue}>32分</div>
              <div className={styles.statChange}>適正範囲内</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>フォローアップ率</div>
              <div className={styles.statValue}>85%</div>
              <div className={styles.statChange}>目標達成</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>改善提案実施率</div>
              <div className={styles.statValue}>72%</div>
              <div className={styles.statChange}>前期比 +8%</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}