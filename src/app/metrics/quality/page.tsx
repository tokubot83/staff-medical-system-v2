'use client'

import React from 'react'
import MetricsLayout from '@/components/metrics/MetricsLayout'
import { ReportCategory } from '@/types/reports'
import { CategoryMetrics } from '@/types/metrics'

const QualityMetricsPage = () => {
  const mockMetrics: CategoryMetrics = {
    id: 'quality',
    category: ReportCategory.QUALITY,
    mainMetric: {
      value: 4.2,
      unit: '点',
      trend: 'up',
      change: 3.5
    },
    subMetrics: [
      { name: '専門資格保有率', value: 78.5, unit: '%', trend: 'up' },
      { name: '研修参加率', value: 92.3, unit: '%', trend: 'up' },
      { name: '患者満足度', value: 4.5, unit: '点', trend: 'up' },
      { name: '医療安全評価', value: 4.3, unit: '点', trend: 'down' },
      { name: 'チーム連携度', value: 4.1, unit: '点', trend: 'up' },
      { name: '技術評価', value: 4.4, unit: '点', trend: 'up' }
    ],
    facilityData: [
      {
        facilityName: '総合病院',
        departments: [
          {
            name: '内科',
            metrics: [
              { name: '専門資格保有率', value: 82.5, unit: '%', trend: 'up' },
              { name: '研修参加率', value: 95.0, unit: '%', trend: 'up' },
              { name: '患者満足度', value: 4.6, unit: '点', trend: 'up' },
              { name: 'チーム連携度', value: 4.3, unit: '点', trend: 'down' }
            ]
          },
          {
            name: '外科',
            metrics: [
              { name: '専門資格保有率', value: 85.0, unit: '%', trend: 'up' },
              { name: '研修参加率', value: 90.5, unit: '%', trend: 'down' },
              { name: '患者満足度', value: 4.4, unit: '点', trend: 'up' },
              { name: 'チーム連携度', value: 4.2, unit: '点', trend: 'up' }
            ]
          }
        ]
      },
      {
        facilityName: 'クリニックA',
        departments: [
          {
            name: '一般診療',
            metrics: [
              { name: '専門資格保有率', value: 70.0, unit: '%', trend: 'up' },
              { name: '研修参加率', value: 88.5, unit: '%', trend: 'up' },
              { name: '患者満足度', value: 4.7, unit: '点', trend: 'up' },
              { name: 'チーム連携度', value: 4.5, unit: '点', trend: 'up' }
            ]
          }
        ]
      }
    ]
  }

  return <MetricsLayout metrics={mockMetrics} />
}

export default QualityMetricsPage