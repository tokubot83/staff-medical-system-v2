import React from 'react';
import MetricsLayout from '@/components/metrics/MetricsLayout';
import { GrowthMetrics } from '@/types/metrics';

export default function GrowthMetricsPage() {
  const metricsData: GrowthMetrics = {
    categoryName: '人材の成長',
    description: '教育・研修・キャリア開発の状況',
    icon: '🎓',
    color: 'border-purple-500',
    mainMetric: {
      label: '研修受講率',
      value: 92,
      unit: '%',
      trend: { value: '+5%', isPositive: true }
    },
    subMetrics: [
      { label: 'スキル達成率', value: 78, unit: '%', trend: { value: '+8%', isPositive: true } },
      { label: 'キャリア進捗', value: 72, unit: '%' },
      { label: '昇進率', value: 15, unit: '%', trend: { value: '+2%', isPositive: true } },
      { label: '教育ROI', value: 3.2, unit: '倍' },
      { label: 'メンター活用', value: 65, unit: '%', trend: { value: '+10%', isPositive: true } },
      { label: '資格取得率', value: 24, unit: '%/年' }
    ],
    facilities: [
      {
        name: '本院',
        departments: [
          {
            name: '内科病棟',
            metrics: [
              { label: '研修受講率', value: 94, unit: '%', trend: { value: '+6%', isPositive: true } },
              { label: 'スキル達成', value: 80, unit: '%' },
              { label: '昇進率', value: 16, unit: '%' },
              { label: 'メンター活用', value: 70, unit: '%' }
            ]
          },
          {
            name: '外科病棟',
            metrics: [
              { label: '研修受講率', value: 91, unit: '%', trend: { value: '+4%', isPositive: true } },
              { label: 'スキル達成', value: 75, unit: '%' },
              { label: '昇進率', value: 14, unit: '%' },
              { label: 'メンター活用', value: 62, unit: '%' }
            ]
          },
          {
            name: 'ICU',
            metrics: [
              { label: '研修受講率', value: 96, unit: '%', trend: { value: '+7%', isPositive: true } },
              { label: 'スキル達成', value: 85, unit: '%' },
              { label: '昇進率', value: 18, unit: '%' },
              { label: 'メンター活用', value: 75, unit: '%' }
            ]
          },
          {
            name: '外来',
            metrics: [
              { label: '研修受講率', value: 88, unit: '%', trend: { value: '+3%', isPositive: true } },
              { label: 'スキル達成', value: 72, unit: '%' },
              { label: '昇進率', value: 12, unit: '%' },
              { label: 'メンター活用', value: 58, unit: '%' }
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
              { label: '研修受講率', value: 90, unit: '%', trend: { value: '+5%', isPositive: true } },
              { label: 'スキル達成', value: 76, unit: '%' },
              { label: '昇進率', value: 14, unit: '%' },
              { label: 'メンター活用', value: 64, unit: '%' }
            ]
          },
          {
            name: '地域包括ケア',
            metrics: [
              { label: '研修受講率', value: 93, unit: '%', trend: { value: '+6%', isPositive: true } },
              { label: 'スキル達成', value: 79, unit: '%' },
              { label: '昇進率', value: 15, unit: '%' },
              { label: 'メンター活用', value: 68, unit: '%' }
            ]
          }
        ]
      }
    ],
    trainingRate: 92,
    skillAchievementRate: 78,
    careerProgressRate: 72,
    promotionRate: 15,
    educationROI: 3.2,
    mentorshipRate: 65
  };

  return <MetricsLayout metrics={metricsData} />;
}