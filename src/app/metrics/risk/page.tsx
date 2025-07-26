'use client'

import React from 'react'
import MetricsLayout from '@/components/metrics/MetricsLayout'
import DashboardButton from '@/components/DashboardButton'
import ScrollToTopButton from '@/components/ScrollToTopButton'
import { BackToReportsButton } from '@/components/BackToReportsButton'
import { CategoryTopButton } from '@/components/CategoryTopButton'
import { ReportCategory } from '@/types/reports'
import { CategoryMetrics } from '@/types/metrics'

const RiskMetricsPage = () => {
  const mockMetrics: CategoryMetrics = {
    id: 'risk',
    category: ReportCategory.RISK,
    mainMetric: {
      value: 2.8,
      unit: '件/月',
      trend: 'down',
      change: -15.2
    },
    subMetrics: [
      { name: '離職リスク', value: 8.5, unit: '%', trend: 'down' },
      { name: 'インシデント発生率', value: 0.5, unit: '%', trend: 'down' },
      { name: 'コンプライアンス違反', value: 0.2, unit: '件', trend: 'down' },
      { name: 'メンタルヘルスリスク', value: 12.3, unit: '%', trend: 'up' },
      { name: '過重労働リスク', value: 15.8, unit: '%', trend: 'up' },
      { name: '安全評価スコア', value: 4.2, unit: '点', trend: 'up' }
    ],
    facilityData: [
      {
        facilityName: '医療法人 厚生会 小原病院',
        departments: [
          {
            name: '脳神経外科',
            metrics: [
              { name: '離職リスク', value: 8.5, unit: '%', trend: 'down' },
              { name: 'インシデント発生率', value: 0.5, unit: '%', trend: 'down' },
              { name: 'メンタルヘルスリスク', value: 13.5, unit: '%', trend: 'up' },
              { name: '過重労働リスク', value: 25.0, unit: '%', trend: 'up' }
            ]
          },
          {
            name: '外科',
            metrics: [
              { name: '離職リスク', value: 9.0, unit: '%', trend: 'up' },
              { name: 'インシデント発生率', value: 0.6, unit: '%', trend: 'down' },
              { name: 'メンタルヘルスリスク', value: 14.5, unit: '%', trend: 'up' },
              { name: '過重労働リスク', value: 22.5, unit: '%', trend: 'up' }
            ]
          },
          {
            name: '整形外科',
            metrics: [
              { name: '離職リスク', value: 8.0, unit: '%', trend: 'down' },
              { name: 'インシデント発生率', value: 0.4, unit: '%', trend: 'down' },
              { name: 'メンタルヘルスリスク', value: 12.0, unit: '%', trend: 'down' },
              { name: '過重労働リスク', value: 20.0, unit: '%', trend: 'up' }
            ]
          },
          {
            name: '内科',
            metrics: [
              { name: '離職リスク', value: 7.5, unit: '%', trend: 'down' },
              { name: 'インシデント発生率', value: 0.3, unit: '%', trend: 'down' },
              { name: 'メンタルヘルスリスク', value: 10.5, unit: '%', trend: 'down' },
              { name: '過重労働リスク', value: 18.0, unit: '%', trend: 'up' }
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
              { name: '離職リスク', value: 5.0, unit: '%', trend: 'down' },
              { name: 'インシデント発生率', value: 0.2, unit: '%', trend: 'down' },
              { name: 'メンタルヘルスリスク', value: 7.5, unit: '%', trend: 'down' },
              { name: '過重労働リスク', value: 9.5, unit: '%', trend: 'down' }
            ]
          },
          {
            name: 'リハビリテーション科',
            metrics: [
              { name: '離職リスク', value: 6.0, unit: '%', trend: 'down' },
              { name: 'インシデント発生率', value: 0.3, unit: '%', trend: 'down' },
              { name: 'メンタルヘルスリスク', value: 8.5, unit: '%', trend: 'down' },
              { name: '過重労働リスク', value: 11.0, unit: '%', trend: 'down' }
            ]
          }
        ]
      }
    ]
  }

  return (
    <>
      <MetricsLayout metrics={mockMetrics} />
      <ScrollToTopButton />
      <CategoryTopButton categoryPath="/reports/basic-metrics" categoryName="基本指標" />
      <BackToReportsButton />
      <DashboardButton />
    </>
  )
}

export default RiskMetricsPage