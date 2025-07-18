import React from 'react';
import MetricsLayout from '@/components/metrics/MetricsLayout';
import { GrowthMetrics, AIAnalysis } from '@/types/metrics';

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
        name: '小原病院',
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
        name: '立神リハビリテーション温泉病院',
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
      },
      {
        name: 'エスポワール立神',
        departments: [
          {
            name: '介護医療院',
            metrics: [
              { label: '研修受講率', value: 89, unit: '%', trend: { value: '+4%', isPositive: true } },
              { label: 'スキル達成', value: 74, unit: '%' },
              { label: '昇進率', value: 13, unit: '%' },
              { label: 'メンター活用', value: 62, unit: '%' }
            ]
          },
          {
            name: '通所リハビリ',
            metrics: [
              { label: '研修受講率', value: 91, unit: '%', trend: { value: '+5%', isPositive: true } },
              { label: 'スキル達成', value: 77, unit: '%' },
              { label: '昇進率', value: 14, unit: '%' },
              { label: 'メンター活用', value: 66, unit: '%' }
            ]
          }
        ]
      },
      {
        name: '宝寿庵',
        departments: [
          {
            name: '特別養護老人ホーム',
            metrics: [
              { label: '研修受講率', value: 87, unit: '%', trend: { value: '+3%', isPositive: true } },
              { label: 'スキル達成', value: 72, unit: '%' },
              { label: '昇進率', value: 12, unit: '%' },
              { label: 'メンター活用', value: 60, unit: '%' }
            ]
          },
          {
            name: 'ショートステイ',
            metrics: [
              { label: '研修受講率', value: 90, unit: '%', trend: { value: '+4%', isPositive: true } },
              { label: 'スキル達成', value: 75, unit: '%' },
              { label: '昇進率', value: 13, unit: '%' },
              { label: 'メンター活用', value: 63, unit: '%' }
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

  const aiAnalysis: AIAnalysis = {
    summary: '研修受講率92%、メンター活用率65%（+10%）と人材育成への取り組みは活発です。特にICUの研修受講率96%、スキル達成率85%は卓越しています。一方、外来の各指標が低く、改善が必要です。',
    insights: [
      {
        title: 'メンター制度の急速な普及',
        priority: 'high',
        content: 'メンター活用率65%（前月比+10%）と急上昇。新人育成に良好な影響。',
        impact: '新人の早期戦力化、定着率向上'
      },
      {
        title: 'ICUの学習文化',
        priority: 'medium',
        content: 'ICUは全指標でトップレベル。継続的学習が文化として定着。',
        impact: '専門性向上、イノベーション创出'
      },
      {
        title: '教育ROIの高さ',
        priority: 'medium',
        content: '教育投資リターン3.2倍と高効率。投資が成果に結びついている。',
        impact: '経営層への説明材料として活用可'
      }
    ],
    recommendations: [
      {
        title: '外来部門の教育強化',
        priority: 'urgent',
        content: '外来の各指標が低いため、緊急に教育体制を再構築する。',
        actions: [
          '業務時間内研修の確保',
          'オンライン学習環境の整備',
          '部署特性に合わせたカリキュラム'
        ]
      },
      {
        title: 'キャリアパスの明確化',
        priority: 'high',
        content: '昇進率15%を維持しつつ、キャリアパスをより明確にする。',
        actions: [
          '職種別キャリアラダーの作成',
          '必要スキルの明文化',
          '個人面談での目標設定'
        ]
      },
      {
        title: 'ICUモデルの全面展開',
        priority: 'medium',
        content: 'ICUの教育・メンター制度を全部署に展開する。',
        actions: [
          'ICUスタッフによる研修',
          '成功事例の水平展開',
          '部署間メンター交流'
        ]
      }
    ],
    risks: [
      {
        title: '部署間格差の拡大',
        priority: 'high',
        content: 'ICUと外来の教育格差が拡大し、サービス品質に影響するリスク。',
        impact: '部署間の人材流動停滞、モチベーション低下'
      },
      {
        title: '教育疲れ',
        priority: 'medium',
        content: '研修受講率92%と高いが、負担感から「教育疲れ」が発生する可能性。',
        impact: '学習意欲低下、形式的な参加'
      }
    ]
  };

  return <MetricsLayout metrics={metricsData} aiAnalysis={aiAnalysis} />;
}