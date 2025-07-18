import React from 'react';
import MetricsLayout from '@/components/metrics/MetricsLayout';
import { QualityMetrics } from '@/types/metrics';

export default function QualityMetricsPage() {
  const metricsData: QualityMetrics = {
    categoryName: '人材の質',
    description: '職員の満足度・エンゲージメント・専門性',
    icon: '⭐',
    color: 'border-blue-500',
    mainMetric: {
      label: '総合満足度',
      value: 87,
      unit: '%',
      trend: { value: '+2%', isPositive: true }
    },
    subMetrics: [
      { label: 'エンゲージメント', value: 82, unit: '%', trend: { value: '+3%', isPositive: true } },
      { label: '患者満足度相関', value: 0.85, unit: '', trend: { value: '+0.05', isPositive: true } },
      { label: '資格保有率', value: 68, unit: '%' },
      { label: '専門認定率', value: 42, unit: '%', trend: { value: '+5%', isPositive: true } },
      { label: '360度評価', value: 4.2, unit: '/5' },
      { label: '推奨意向', value: 78, unit: '%' }
    ],
    facilities: [
      {
        name: '本院',
        departments: [
          {
            name: '内科病棟',
            metrics: [
              { label: '満足度', value: 88, unit: '%', trend: { value: '+2%', isPositive: true } },
              { label: 'エンゲージメント', value: 84, unit: '%' },
              { label: '資格保有率', value: 72, unit: '%' },
              { label: '専門認定率', value: 45, unit: '%' }
            ]
          },
          {
            name: '外科病棟',
            metrics: [
              { label: '満足度', value: 85, unit: '%', trend: { value: '+1%', isPositive: true } },
              { label: 'エンゲージメント', value: 80, unit: '%' },
              { label: '資格保有率', value: 70, unit: '%' },
              { label: '専門認定率', value: 48, unit: '%' }
            ]
          },
          {
            name: 'ICU',
            metrics: [
              { label: '満足度', value: 89, unit: '%', trend: { value: '+5%', isPositive: true } },
              { label: 'エンゲージメント', value: 86, unit: '%' },
              { label: '資格保有率', value: 85, unit: '%' },
              { label: '専門認定率', value: 62, unit: '%' }
            ]
          },
          {
            name: '外来',
            metrics: [
              { label: '満足度', value: 83, unit: '%', trend: { value: '-1%', isPositive: false } },
              { label: 'エンゲージメント', value: 78, unit: '%' },
              { label: '資格保有率', value: 65, unit: '%' },
              { label: '専門認定率', value: 38, unit: '%' }
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
              { label: '満足度', value: 86, unit: '%', trend: { value: '+3%', isPositive: true } },
              { label: 'エンゲージメント', value: 81, unit: '%' },
              { label: '資格保有率', value: 66, unit: '%' },
              { label: '専門認定率', value: 40, unit: '%' }
            ]
          },
          {
            name: '地域包括ケア',
            metrics: [
              { label: '満足度', value: 90, unit: '%', trend: { value: '+4%', isPositive: true } },
              { label: 'エンゲージメント', value: 85, unit: '%' },
              { label: '資格保有率', value: 71, unit: '%' },
              { label: '専門認定率', value: 44, unit: '%' }
            ]
          }
        ]
      }
    ],
    satisfaction: 87,
    engagement: 82,
    patientSatisfactionCorrelation: 0.85,
    certificationRate: 68,
    specialistRate: 42,
    evaluationScore: 4.2
  };

  return <MetricsLayout metrics={metricsData} />;
}