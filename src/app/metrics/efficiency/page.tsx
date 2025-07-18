import React from 'react';
import MetricsLayout from '@/components/metrics/MetricsLayout';
import { EfficiencyMetrics } from '@/types/metrics';

export default function EfficiencyMetricsPage() {
  const metricsData: EfficiencyMetrics = {
    categoryName: '組織効率',
    description: '業務効率・生産性・コスト管理の指標',
    icon: '📊',
    color: 'border-red-500',
    mainMetric: {
      label: '緊急対応要件数',
      value: 3,
      unit: '件',
      trend: { value: '+1件', isPositive: false }
    },
    subMetrics: [
      { label: '平均残業時間', value: 18.5, unit: '時間/月', trend: { value: '+2.5h', isPositive: false } },
      { label: '有給取得率', value: 68, unit: '%', trend: { value: '+5%', isPositive: true } },
      { label: '人件費率', value: 52, unit: '%' },
      { label: '生産性指数', value: 112, unit: '', trend: { value: '+8', isPositive: true } },
      { label: '異動希望', value: 8, unit: '件' },
      { label: '業務効率化', value: 85, unit: '%' }
    ],
    facilities: [
      {
        name: '本院',
        departments: [
          {
            name: '内科病棟',
            metrics: [
              { label: '緊急対応', value: 0, unit: '件' },
              { label: '残業時間', value: 16.2, unit: '時間' },
              { label: '有給取得', value: 72, unit: '%' },
              { label: '生産性', value: 115, unit: '' }
            ]
          },
          {
            name: '外科病棟',
            metrics: [
              { label: '緊急対応', value: 1, unit: '件' },
              { label: '残業時間', value: 22.8, unit: '時間', trend: { value: '+4h', isPositive: false } },
              { label: '有給取得', value: 65, unit: '%' },
              { label: '生産性', value: 108, unit: '' }
            ]
          },
          {
            name: 'ICU',
            metrics: [
              { label: '緊急対応', value: 0, unit: '件' },
              { label: '残業時間', value: 28.5, unit: '時間' },
              { label: '有給取得', value: 58, unit: '%' },
              { label: '生産性', value: 118, unit: '' }
            ]
          },
          {
            name: '外来',
            metrics: [
              { label: '緊急対応', value: 2, unit: '件', trend: { value: '+1件', isPositive: false } },
              { label: '残業時間', value: 12.3, unit: '時間' },
              { label: '有給取得', value: 75, unit: '%' },
              { label: '生産性', value: 110, unit: '' }
            ]
          }
        ]
      },
      {
        name: '分院A',
        departments: [
          {
            name: '一般病棟',
            metrics: [
              { label: '緊急対応', value: 0, unit: '件' },
              { label: '残業時間', value: 15.8, unit: '時間' },
              { label: '有給取得', value: 70, unit: '%' },
              { label: '生産性', value: 113, unit: '' }
            ]
          },
          {
            name: '地域包括ケア',
            metrics: [
              { label: '緊急対応', value: 0, unit: '件' },
              { label: '残業時間', value: 14.2, unit: '時間' },
              { label: '有給取得', value: 73, unit: '%' },
              { label: '生産性', value: 116, unit: '' }
            ]
          }
        ]
      }
    ],
    urgentIssues: 3,
    overtimeHours: 18.5,
    ptoUsageRate: 68,
    laborCostRate: 52,
    productivityIndex: 112,
    transferRequests: 8
  };

  return <MetricsLayout metrics={metricsData} />;
}