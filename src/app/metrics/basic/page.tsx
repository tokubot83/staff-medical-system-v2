'use client'

import React from 'react'
import MetricsLayout from '@/components/metrics/MetricsLayout'
import { ReportCategory } from '@/types/reports'
import { CategoryMetrics } from '@/types/metrics'

const BasicMetricsPage = () => {
  // サンプルデータ（実際のアプリケーションではAPIから取得）
  const mockMetrics: CategoryMetrics = {
    id: 'basic',
    category: ReportCategory.BASIC,
    mainMetric: {
      value: 1234,
      unit: '人',
      trend: 'up',
      change: 5.2
    },
    subMetrics: [
      { name: '医師数', value: 156, unit: '人', trend: 'up' },
      { name: '看護師数', value: 523, unit: '人', trend: 'up' },
      { name: 'コメディカル', value: 234, unit: '人', trend: 'down' },
      { name: '事務職員', value: 321, unit: '人', trend: 'up' },
      { name: '平均年齢', value: 38.5, unit: '歳', trend: 'up' },
      { name: '平均勤続年数', value: 8.2, unit: '年', trend: 'down' }
    ],
    facilityData: [
      {
        facilityName: '総合病院',
        departments: [
          {
            name: '内科',
            metrics: [
              { name: '職員数', value: 45, unit: '人', trend: 'up' },
              { name: '医師数', value: 12, unit: '人', trend: 'up' },
              { name: '看護師数', value: 28, unit: '人', trend: 'down' },
              { name: 'その他', value: 5, unit: '人', trend: 'up' }
            ]
          },
          {
            name: '外科',
            metrics: [
              { name: '職員数', value: 38, unit: '人', trend: 'down' },
              { name: '医師数', value: 10, unit: '人', trend: 'down' },
              { name: '看護師数', value: 23, unit: '人', trend: 'down' },
              { name: 'その他', value: 5, unit: '人', trend: 'up' }
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
              { name: '職員数', value: 15, unit: '人', trend: 'up' },
              { name: '医師数', value: 3, unit: '人', trend: 'up' },
              { name: '看護師数', value: 8, unit: '人', trend: 'up' },
              { name: 'その他', value: 4, unit: '人', trend: 'up' }
            ]
          }
        ]
      }
    ]
  }

  return <MetricsLayout metrics={mockMetrics} />
}

export default BasicMetricsPage