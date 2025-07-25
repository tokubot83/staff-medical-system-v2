'use client'

import React from 'react'
import MetricsLayout from '@/components/metrics/MetricsLayout'
import DashboardButton from '@/components/DashboardButton'
import ScrollToTopButton from '@/components/ScrollToTopButton'
import { BackToReportsButton } from '@/components/BackToReportsButton'
import { ReportCategory } from '@/types/reports'
import { CategoryMetrics } from '@/types/metrics'

const EfficiencyMetricsPage = () => {
  const mockMetrics: CategoryMetrics = {
    id: 'efficiency',
    category: ReportCategory.EFFICIENCY,
    mainMetric: {
      value: 92.5,
      unit: '%',
      trend: 'up',
      change: 5.8
    },
    subMetrics: [
      { name: '生産性指標', value: 4.3, unit: '点', trend: 'up' },
      { name: '業務効率化率', value: 88.5, unit: '%', trend: 'up' },
      { name: '時間外労働率', value: 15.2, unit: '%', trend: 'down' },
      { name: 'コスト効率', value: 3.8, unit: '倍', trend: 'up' },
      { name: 'システム活用率', value: 78.5, unit: '%', trend: 'up' },
      { name: 'プロセス改善度', value: 85.0, unit: '%', trend: 'up' }
    ],
    facilityData: [
      {
        facilityName: '医療法人 厚生会 小原病院',
        departments: [
          {
            name: '脳神経外科',
            metrics: [
              { name: '生産性指標', value: 4.6, unit: '点', trend: 'up' },
              { name: '業務効率化率', value: 91.5, unit: '%', trend: 'up' },
              { name: '時間外労働率', value: 20.5, unit: '%', trend: 'up' },
              { name: 'システム活用率', value: 83.5, unit: '%', trend: 'up' }
            ]
          },
          {
            name: '外科',
            metrics: [
              { name: '生産性指標', value: 4.2, unit: '点', trend: 'up' },
              { name: '業務効率化率', value: 86.0, unit: '%', trend: 'down' },
              { name: '時間外労働率', value: 18.5, unit: '%', trend: 'up' },
              { name: 'システム活用率', value: 75.5, unit: '%', trend: 'up' }
            ]
          },
          {
            name: '整形外科',
            metrics: [
              { name: '生産性指標', value: 4.3, unit: '点', trend: 'up' },
              { name: '業務効率化率', value: 88.0, unit: '%', trend: 'up' },
              { name: '時間外労働率', value: 16.5, unit: '%', trend: 'down' },
              { name: 'システム活用率', value: 77.0, unit: '%', trend: 'up' }
            ]
          },
          {
            name: '内科',
            metrics: [
              { name: '生産性指標', value: 4.5, unit: '点', trend: 'up' },
              { name: '業務効率化率', value: 90.5, unit: '%', trend: 'up' },
              { name: '時間外労働率', value: 12.5, unit: '%', trend: 'down' },
              { name: 'システム活用率', value: 82.0, unit: '%', trend: 'up' }
            ]
          }
        ]
      },
      {
        facilityName: '立神リハビリテーション温泉病院',
        departments: [
          {
            name: '内科',
            metrics: [
              { name: '生産性指標', value: 4.0, unit: '点', trend: 'up' },
              { name: '業務効率化率', value: 89.0, unit: '%', trend: 'up' },
              { name: '時間外労働率', value: 7.5, unit: '%', trend: 'down' },
              { name: 'システム活用率', value: 80.0, unit: '%', trend: 'up' }
            ]
          },
          {
            name: 'リハビリテーション科',
            metrics: [
              { name: '生産性指標', value: 4.2, unit: '点', trend: 'up' },
              { name: '業務効率化率', value: 93.0, unit: '%', trend: 'up' },
              { name: '時間外労働率', value: 9.0, unit: '%', trend: 'down' },
              { name: 'システム活用率', value: 87.0, unit: '%', trend: 'up' }
            ]
          }
        ]
      }
    ]
  }

  return (
    <>
      <ScrollToTopButton />
      <MetricsLayout metrics={mockMetrics} />
      <BackToReportsButton />
      <DashboardButton />
    </>
  )
}

export default EfficiencyMetricsPage