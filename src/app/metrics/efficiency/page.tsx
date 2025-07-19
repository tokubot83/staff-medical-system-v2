import React from 'react';
import MetricsLayout from '@/components/metrics/MetricsLayout';
import { EfficiencyMetrics, DataAnalysis } from '@/types/metrics';

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
        name: '小原病院',
        departments: [
          {
            name: '診療部',
            metrics: [
              { label: '緊急対応', value: 1, unit: '件' },
              { label: '残業時間', value: 38.5, unit: '時間', trend: { value: '+5h', isPositive: false } },
              { label: '有給取得', value: 45, unit: '%' },
              { label: '生産性', value: 125, unit: '' }
            ]
          },
          {
            name: '看護部',
            metrics: [
              { label: '緊急対応', value: 2, unit: '件', trend: { value: '+1件', isPositive: false } },
              { label: '残業時間', value: 18.5, unit: '時間' },
              { label: '有給取得', value: 68, unit: '%' },
              { label: '生産性', value: 108, unit: '' }
            ]
          },
          {
            name: '診療技術部',
            metrics: [
              { label: '緊急対応', value: 0, unit: '件' },
              { label: '残業時間', value: 8.5, unit: '時間' },
              { label: '有給取得', value: 85, unit: '%' },
              { label: '生産性', value: 120, unit: '' }
            ]
          },
          {
            name: '事務部',
            metrics: [
              { label: '緊急対応', value: 0, unit: '件' },
              { label: '残業時間', value: 12.3, unit: '時間' },
              { label: '有給取得', value: 75, unit: '%' },
              { label: '生産性', value: 110, unit: '' }
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
              { label: '緊急対応', value: 0, unit: '件' },
              { label: '残業時間', value: 35.2, unit: '時間', trend: { value: '+3h', isPositive: false } },
              { label: '有給取得', value: 48, unit: '%' },
              { label: '生産性', value: 122, unit: '' }
            ]
          },
          {
            name: '看護部門',
            metrics: [
              { label: '緊急対応', value: 1, unit: '件' },
              { label: '残業時間', value: 16.5, unit: '時間' },
              { label: '有給取得', value: 70, unit: '%' },
              { label: '生産性', value: 110, unit: '' }
            ]
          },
          {
            name: '診療技術部',
            metrics: [
              { label: '緊急対応', value: 0, unit: '件' },
              { label: '残業時間', value: 7.8, unit: '時間' },
              { label: '有給取得', value: 88, unit: '%' },
              { label: '生産性', value: 125, unit: '' }
            ]
          },
          {
            name: '事務部門',
            metrics: [
              { label: '緊急対応', value: 0, unit: '件' },
              { label: '残業時間', value: 14.5, unit: '時間' },
              { label: '有給取得', value: 72, unit: '%' },
              { label: '生産性', value: 108, unit: '' }
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
              { label: '緊急対応', value: 0, unit: '件' },
              { label: '残業時間', value: 11.2, unit: '時間' },
              { label: '有給取得', value: 74, unit: '%' },
              { label: '生産性', value: 111, unit: '' }
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
              { label: '緊急対応', value: 1, unit: '件' },
              { label: '残業時間', value: 19.8, unit: '時間', trend: { value: '+3h', isPositive: false } },
              { label: '有給取得', value: 62, unit: '%' },
              { label: '生産性', value: 105, unit: '' }
            ]
          },
          {
            name: '2号館',
            metrics: [
              { label: '緊急対応', value: 0, unit: '件' },
              { label: '残業時間', value: 15.5, unit: '時間' },
              { label: '有給取得', value: 68, unit: '%' },
              { label: '生産性', value: 107, unit: '' }
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

  const aiAnalysis: DataAnalysis = {
    summary: '診療部門の残業時間が両病院で35時間以上と過重労働状態です。一方、診療技術部は残業8時間前後、有給取得率85%以上、生産性120以上と非常に良好です。部門間の業務効率格差が明確です。',
    insights: [
      {
        title: '診療部門の過重労働',
        priority: 'urgent',
        content: '両病院の診療部門が平均残業35-38時間/月。有給取得率45-48%と低く、過労状態が深刻。',
        impact: '医師の燃え尽き、医療ミスのリスク、離職'
      },
      {
        title: '診療技術部の高効率性',
        priority: 'medium',
        content: '診療技術部が生産性120-125、有給取得率85-88%と突出。専門性を活かした効率的な業務遂行。',
        impact: '他部門へのモデルケース、組織全体の生産性向上'
      },
      {
        title: '部門間の業務効率格差',
        priority: 'high',
        content: '診療部門の有給取得率45-48%に対し、診療技術部は85-88%。約4倍の差がある。',
        impact: '部門間の不公平感、モチベーション格差'
      }
    ],
    recommendations: [
      {
        title: '診療部門の働き方改革',
        priority: 'urgent',
        content: '診療部門の過重労働解消に向け、根本的な働き方改革を実施する。',
        actions: [
          '当直回数の見直し',
          '医師事務作業を他職種へタスクシフト',
          'オンコール体制の最適化',
          '有給取得義務化の推進'
        ]
      },
      {
        title: '診療技術部モデルの展開',
        priority: 'high',
        content: '診療技術部の高効率・高満足度モデルを他部門に展開する。',
        actions: [
          '業務の専門特化と役割分担',
          'チーム制による効率化',
          '柔軟な勤務体制の導入',
          '成果重視の評価制度'
        ]
      },
      {
        title: '柔軟な働き方の推進',
        priority: 'medium',
        content: '有給取得率向上を続けつつ、さらに柔軟な働き方を推進する。',
        actions: [
          'フレックスタイム制の拡大',
          'リモートワークの部分導入',
          '時間単位有給の導入'
        ]
      }
    ],
    risks: [
      {
        title: '医師の過労死リスク',
        priority: 'urgent',
        content: '診療部門の残業35時間超が続くと、過労死や医療事故のリスクが急上昇。',
        impact: '人命リスク、法的責任、社会的信頼喪失'
      },
      {
        title: '優秀人材の燃え尽き',
        priority: 'high',
        content: '高生産性を維持しているスタッフが燃え尽きるリスク。',
        impact: '中長期的な生産性低下、離職率上昇'
      },
      {
        title: '労基署対応リスク',
        priority: 'medium',
        content: '残業時間の増加傾向が続くと、労働基準監督署の指導対象となる可能性。',
        impact: '組織の信用低下、罰則リスク'
      }
    ]
  };

  return <MetricsLayout metrics={metricsData} aiAnalysis={aiAnalysis} />;
}