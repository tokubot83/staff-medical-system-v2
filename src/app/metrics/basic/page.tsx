import React from 'react';
import MetricsLayout from '@/components/metrics/MetricsLayout';
import { BasicMetrics } from '@/types/metrics';

export default function BasicMetricsPage() {
  const metricsData: BasicMetrics = {
    categoryName: '基本指標',
    description: '職員の人員構成と基本的な統計情報',
    icon: '👥',
    color: 'border-green-500',
    mainMetric: {
      label: '総職員数',
      value: 500,
      unit: '名',
      trend: { value: '±0', isPositive: true }
    },
    subMetrics: [
      { label: '部署別職員数', value: '15', unit: '部署' },
      { label: '平均年齢', value: '38.5', unit: '歳', trend: { value: '+0.3歳', isPositive: false } },
      { label: '平均勤続年数', value: '8.2', unit: '年', trend: { value: '+0.5年', isPositive: true } },
      { label: '正規職員率', value: '82', unit: '%', trend: { value: '+2%', isPositive: true } },
      { label: '男女比', value: '3:7', unit: '' },
      { label: '管理職比率', value: '15', unit: '%' }
    ],
    facilities: [
      {
        name: '本院',
        departments: [
          {
            name: '内科病棟',
            metrics: [
              { label: '職員数', value: 45, unit: '名' },
              { label: '平均年齢', value: 36.8, unit: '歳' },
              { label: '勤続年数', value: 7.5, unit: '年' },
              { label: '正規率', value: 84, unit: '%' }
            ]
          },
          {
            name: '外科病棟',
            metrics: [
              { label: '職員数', value: 38, unit: '名' },
              { label: '平均年齢', value: 39.2, unit: '歳' },
              { label: '勤続年数', value: 8.8, unit: '年' },
              { label: '正規率', value: 79, unit: '%' }
            ]
          },
          {
            name: 'ICU',
            metrics: [
              { label: '職員数', value: 28, unit: '名' },
              { label: '平均年齢', value: 34.5, unit: '歳' },
              { label: '勤続年数', value: 6.2, unit: '年' },
              { label: '正規率', value: 92, unit: '%' }
            ]
          },
          {
            name: '外来',
            metrics: [
              { label: '職員数', value: 56, unit: '名' },
              { label: '平均年齢', value: 41.3, unit: '歳' },
              { label: '勤続年数', value: 9.8, unit: '年' },
              { label: '正規率', value: 75, unit: '%' }
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
              { label: '職員数', value: 32, unit: '名' },
              { label: '平均年齢', value: 37.5, unit: '歳' },
              { label: '勤続年数', value: 7.0, unit: '年' },
              { label: '正規率', value: 80, unit: '%' }
            ]
          },
          {
            name: '地域包括ケア',
            metrics: [
              { label: '職員数', value: 28, unit: '名' },
              { label: '平均年齢', value: 40.2, unit: '歳' },
              { label: '勤続年数', value: 8.5, unit: '年' },
              { label: '正規率', value: 78, unit: '%' }
            ]
          }
        ]
      }
    ],
    totalStaff: 500,
    staffByDepartment: [],
    staffByType: [],
    staffByEmployment: [],
    averageAge: 38.5,
    averageTenure: 8.2
  };

  return <MetricsLayout metrics={metricsData} />;
}