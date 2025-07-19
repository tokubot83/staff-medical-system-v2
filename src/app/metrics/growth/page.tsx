import React from 'react';
import MetricsLayout from '@/components/metrics/MetricsLayout';
import { GrowthMetrics, DataAnalysis } from '@/types/metrics';

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
            name: '診療部',
            metrics: [
              { label: '研修受講率', value: 98, unit: '%', trend: { value: '+3%', isPositive: true } },
              { label: 'スキル達成', value: 92, unit: '%' },
              { label: '昇進率', value: 20, unit: '%' },
              { label: 'メンター活用', value: 85, unit: '%' }
            ]
          },
          {
            name: '看護部',
            metrics: [
              { label: '研修受講率', value: 92, unit: '%', trend: { value: '+5%', isPositive: true } },
              { label: 'スキル達成', value: 78, unit: '%' },
              { label: '昇進率', value: 15, unit: '%' },
              { label: 'メンター活用', value: 72, unit: '%' }
            ]
          },
          {
            name: '診療技術部',
            metrics: [
              { label: '研修受講率', value: 95, unit: '%', trend: { value: '+7%', isPositive: true } },
              { label: 'スキル達成', value: 85, unit: '%' },
              { label: '昇進率', value: 18, unit: '%' },
              { label: 'メンター活用', value: 78, unit: '%' }
            ]
          },
          {
            name: '事務部',
            metrics: [
              { label: '研修受講率', value: 85, unit: '%', trend: { value: '+2%', isPositive: true } },
              { label: 'スキル達成', value: 70, unit: '%' },
              { label: '昇進率', value: 10, unit: '%' },
              { label: 'メンター活用', value: 55, unit: '%' }
            ]
          }
        ]
      },
      {
        name: '立神リハビリテーション温泉病院',
        departments: [
          {
            name: '診療部門',
            metrics: [
              { label: '研修受講率', value: 96, unit: '%', trend: { value: '+2%', isPositive: true } },
              { label: 'スキル達成', value: 88, unit: '%' },
              { label: '昇進率', value: 18, unit: '%' },
              { label: 'メンター活用', value: 80, unit: '%' }
            ]
          },
          {
            name: '看護部門',
            metrics: [
              { label: '研修受講率', value: 90, unit: '%', trend: { value: '+4%', isPositive: true } },
              { label: 'スキル達成', value: 75, unit: '%' },
              { label: '昇進率', value: 14, unit: '%' },
              { label: 'メンター活用', value: 68, unit: '%' }
            ]
          },
          {
            name: '診療技術部',
            metrics: [
              { label: '研修受講率', value: 97, unit: '%', trend: { value: '+8%', isPositive: true } },
              { label: 'スキル達成', value: 90, unit: '%' },
              { label: '昇進率', value: 22, unit: '%' },
              { label: 'メンター活用', value: 82, unit: '%' }
            ]
          },
          {
            name: '事務部門',
            metrics: [
              { label: '研修受講率', value: 82, unit: '%', trend: { value: '+1%', isPositive: true } },
              { label: 'スキル達成', value: 68, unit: '%' },
              { label: '昇進率', value: 8, unit: '%' },
              { label: 'メンター活用', value: 50, unit: '%' }
            ]
          }
        ]
      },
      {
        name: 'エスポワール立神',
        departments: [
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
            name: '1号館',
            metrics: [
              { label: '研修受講率', value: 87, unit: '%', trend: { value: '+3%', isPositive: true } },
              { label: 'スキル達成', value: 72, unit: '%' },
              { label: '昇進率', value: 12, unit: '%' },
              { label: 'メンター活用', value: 60, unit: '%' }
            ]
          },
          {
            name: '2号館',
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

  const aiAnalysis: DataAnalysis = {
    summary: '研修受講率92%、メンター活用率65%（+10%）と人材育成が活発です。診療部・診療技術部の各指標が特に高く、専門性向上への意欲が高いことがわかります。一方、事務部門の各指標が低く、組織全体での支援強化が必要です。',
    insights: [
      {
        title: '診療技術部の卓越した成長環境',
        priority: 'high',
        content: '両病院の診療技術部が研修受講率95-97%、スキル達成率85-90%、昇進率18-22%と突出。',
        impact: '専門性の高い人材の輩出、組織的价値向上'
      },
      {
        title: '診療部門の高い学習意欲',
        priority: 'medium',
        content: '両病院の診療部門が研修受講率96-98%、メンター活用率80-85%と高水準。専門医育成が順調。',
        impact: '医療の質向上、地域医療への貢献'
      },
      {
        title: '事務部門の成長支援不足',
        priority: 'urgent',
        content: '両病院の事務部門が昇進率8-10%、メンター活用率50-55%と低調。キャリア支援体制が脆弱。',
        impact: '事務職員のモチベーション低下、他業界への流出'
      }
    ],
    recommendations: [
      {
        title: '事務部門の教育体制強化',
        priority: 'urgent',
        content: '事務部門の各指標が低いため、緊急にキャリア開発体制を構築する。',
        actions: [
          '事務専門研修の拡充',
          'メンター制度の強化',
          '他部門との交流促進'
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
        title: '診療技術部モデルの全病院展開',
        priority: 'medium',
        content: '診療技術部の成功モデルを両病院の全部門に展開する。',
        actions: [
          '専門性評価制度の導入',
          'キャリアラダーの明確化',
          '部門間ローテーション制度'
        ]
      }
    ],
    risks: [
      {
        title: '部門間成長格差の拡大',
        priority: 'high',
        content: '医療系部門と事務部門の成長機会格差が拡大し、組織内不公平感が生じるリスク。',
        impact: '事務部門の人材流出、組織運営の非効率化'
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