'use client'

import React from 'react'
import MetricsLayout from '@/components/metrics/MetricsLayout'
import DashboardButton from '@/components/DashboardButton'
import { BackToReportsButton } from '@/components/BackToReportsButton'
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
        facilityName: '医療法人 厚生会 小原病院',
        departments: [
          {
            name: '脳神経外科',
            metrics: [
              { name: '職員数', value: 35, unit: '人', trend: 'up' },
              { name: '医師数', value: 8, unit: '人', trend: 'up' },
              { name: '看護師数', value: 22, unit: '人', trend: 'down' },
              { name: 'その他', value: 5, unit: '人', trend: 'up' }
            ]
          },
          {
            name: '外科',
            metrics: [
              { name: '職員数', value: 42, unit: '人', trend: 'down' },
              { name: '医師数', value: 10, unit: '人', trend: 'down' },
              { name: '看護師数', value: 26, unit: '人', trend: 'down' },
              { name: 'その他', value: 6, unit: '人', trend: 'up' }
            ]
          },
          {
            name: '整形外科',
            metrics: [
              { name: '職員数', value: 38, unit: '人', trend: 'up' },
              { name: '医師数', value: 9, unit: '人', trend: 'up' },
              { name: '看護師数', value: 24, unit: '人', trend: 'up' },
              { name: 'その他', value: 5, unit: '人', trend: 'down' }
            ]
          },
          {
            name: '内科',
            metrics: [
              { name: '職員数', value: 48, unit: '人', trend: 'up' },
              { name: '医師数', value: 12, unit: '人', trend: 'up' },
              { name: '看護師数', value: 30, unit: '人', trend: 'up' },
              { name: 'その他', value: 6, unit: '人', trend: 'up' }
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
              { name: '職員数', value: 35, unit: '人', trend: 'up' },
              { name: '医師数', value: 6, unit: '人', trend: 'up' },
              { name: '看護師数', value: 22, unit: '人', trend: 'up' },
              { name: 'その他', value: 7, unit: '人', trend: 'down' }
            ]
          },
          {
            name: 'リハビリテーション科',
            metrics: [
              { name: '職員数', value: 85, unit: '人', trend: 'up' },
              { name: '医師数', value: 4, unit: '人', trend: 'down' },
              { name: '看護師数', value: 28, unit: '人', trend: 'up' },
              { name: '理学療法士', value: 25, unit: '人', trend: 'up' },
              { name: '作業療法士', value: 18, unit: '人', trend: 'up' },
              { name: 'その他', value: 10, unit: '人', trend: 'up' }
            ]
          }
        ]
      }
    ]
  }

  return (
    <>
      <MetricsLayout metrics={mockMetrics} />
      <BackToReportsButton />
      <DashboardButton />
    </>
  )
}

export default BasicMetricsPage