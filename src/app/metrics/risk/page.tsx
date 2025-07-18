import React from 'react';
import MetricsLayout from '@/components/metrics/MetricsLayout';
import { RiskMetrics } from '@/types/metrics';

export default function RiskMetricsPage() {
  const metricsData: RiskMetrics = {
    categoryName: 'リスク管理',
    description: '離職・欠勤・メンタルヘルス等のリスク指標',
    icon: '⚠️',
    color: 'border-yellow-500',
    mainMetric: {
      label: '要注意職員数',
      value: 12,
      unit: '名',
      trend: { value: '+3名', isPositive: false }
    },
    subMetrics: [
      { label: '離職率', value: 8.5, unit: '%', trend: { value: '+1.2%', isPositive: false } },
      { label: '欠勤率', value: 4.2, unit: '%', trend: { value: '+0.5%', isPositive: false } },
      { label: 'メンタル不調', value: 15, unit: '名' },
      { label: 'ハラスメント', value: 3, unit: '件', trend: { value: '+1件', isPositive: false } },
      { label: '労災発生', value: 0.8, unit: '%' },
      { label: '長時間労働', value: 18, unit: '名' }
    ],
    facilities: [
      {
        name: '本院',
        departments: [
          {
            name: '内科病棟',
            metrics: [
              { label: '要注意職員', value: 2, unit: '名' },
              { label: '離職率', value: 7.5, unit: '%' },
              { label: '欠勤率', value: 3.8, unit: '%' },
              { label: 'メンタル不調', value: 3, unit: '名' }
            ]
          },
          {
            name: '外科病棟',
            metrics: [
              { label: '要注意職員', value: 3, unit: '名', trend: { value: '+1名', isPositive: false } },
              { label: '離職率', value: 9.2, unit: '%' },
              { label: '欠勤率', value: 4.5, unit: '%' },
              { label: 'メンタル不調', value: 4, unit: '名' }
            ]
          },
          {
            name: 'ICU',
            metrics: [
              { label: '要注意職員', value: 1, unit: '名' },
              { label: '離職率', value: 3.2, unit: '%' },
              { label: '欠勤率', value: 2.1, unit: '%' },
              { label: 'メンタル不調', value: 2, unit: '名' }
            ]
          },
          {
            name: '外来',
            metrics: [
              { label: '要注意職員', value: 4, unit: '名', trend: { value: '+2名', isPositive: false } },
              { label: '離職率', value: 12.5, unit: '%' },
              { label: '欠勤率', value: 5.8, unit: '%' },
              { label: 'メンタル不調', value: 5, unit: '名' }
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
              { label: '要注意職員', value: 1, unit: '名' },
              { label: '離職率', value: 8.0, unit: '%' },
              { label: '欠勤率', value: 4.0, unit: '%' },
              { label: 'メンタル不調', value: 2, unit: '名' }
            ]
          },
          {
            name: '地域包括ケア',
            metrics: [
              { label: '要注意職員', value: 1, unit: '名' },
              { label: '離職率', value: 6.5, unit: '%' },
              { label: '欠勤率', value: 3.5, unit: '%' },
              { label: 'メンタル不調', value: 1, unit: '名' }
            ]
          }
        ]
      }
    ],
    cautionStaff: 12,
    turnoverRate: 8.5,
    absenceRate: 4.2,
    mentalHealthIssues: 15,
    harassmentCases: 3,
    accidentRate: 0.8
  };

  return <MetricsLayout metrics={metricsData} />;
}