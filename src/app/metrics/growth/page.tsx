'use client'

import React from 'react'
import MetricsLayout from '@/components/metrics/MetricsLayout'
import DashboardButton from '@/components/DashboardButton'
import ScrollToTopButton from '@/components/ScrollToTopButton'
import { BackToReportsButton } from '@/components/BackToReportsButton'
import { ReportCategory } from '@/types/reports'
import { CategoryMetrics } from '@/types/metrics'

const GrowthMetricsPage = () => {
  const mockMetrics: CategoryMetrics = {
    id: 'growth',
    category: ReportCategory.GROWTH,
    mainMetric: {
      value: 85.5,
      unit: '%',
      trend: 'up',
      change: 12.3
    },
    subMetrics: [
      { name: 'キャリア成長率', value: 78.2, unit: '%', trend: 'up' },
      { name: '昇進率', value: 15.5, unit: '%', trend: 'up' },
      { name: 'スキル向上度', value: 4.1, unit: '点', trend: 'up' },
      { name: '研修効果測定', value: 88.5, unit: '%', trend: 'down' },
      { name: '目標達成率', value: 92.0, unit: '%', trend: 'up' },
      { name: '成長満足度', value: 4.3, unit: '点', trend: 'up' }
    ],
    facilityData: [
      {
        facilityName: '医療法人 厚生会 小原病院',
        departments: [
          {
            name: '脳神経外科',
            metrics: [
              { name: 'キャリア成長率', value: 83.5, unit: '%', trend: 'up' },
              { name: '昇進率', value: 20.0, unit: '%', trend: 'up' },
              { name: 'スキル向上度', value: 4.4, unit: '点', trend: 'up' },
              { name: '目標達成率', value: 95.5, unit: '%', trend: 'up' }
            ]
          },
          {
            name: '外科',
            metrics: [
              { name: 'キャリア成長率', value: 82.0, unit: '%', trend: 'up' },
              { name: '昇進率', value: 16.5, unit: '%', trend: 'down' },
              { name: 'スキル向上度', value: 4.3, unit: '点', trend: 'up' },
              { name: '目標達成率', value: 91.0, unit: '%', trend: 'up' }
            ]
          },
          {
            name: '整形外科',
            metrics: [
              { name: 'キャリア成長率', value: 81.0, unit: '%', trend: 'up' },
              { name: '昇進率', value: 17.5, unit: '%', trend: 'up' },
              { name: 'スキル向上度', value: 4.2, unit: '点', trend: 'up' },
              { name: '目標達成率', value: 92.5, unit: '%', trend: 'up' }
            ]
          },
          {
            name: '内科',
            metrics: [
              { name: 'キャリア成長率', value: 80.5, unit: '%', trend: 'up' },
              { name: '昇進率', value: 18.0, unit: '%', trend: 'up' },
              { name: 'スキル向上度', value: 4.2, unit: '点', trend: 'up' },
              { name: '目標達成率', value: 94.5, unit: '%', trend: 'up' }
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
              { name: 'キャリア成長率', value: 76.5, unit: '%', trend: 'up' },
              { name: '昇進率', value: 14.0, unit: '%', trend: 'up' },
              { name: 'スキル向上度', value: 4.0, unit: '点', trend: 'up' },
              { name: '目標達成率', value: 90.5, unit: '%', trend: 'up' }
            ]
          },
          {
            name: 'リハビリテーション科',
            metrics: [
              { name: 'キャリア成長率', value: 78.0, unit: '%', trend: 'up' },
              { name: '昇進率', value: 15.5, unit: '%', trend: 'up' },
              { name: 'スキル向上度', value: 4.1, unit: '点', trend: 'up' },
              { name: '目標達成率', value: 91.5, unit: '%', trend: 'up' }
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

export default GrowthMetricsPage