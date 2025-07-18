import React from 'react';
import MetricsLayout from '@/components/metrics/MetricsLayout';
import { EfficiencyMetrics, AIAnalysis } from '@/types/metrics';

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
        name: '立神リハビリテーション温泉病院',
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
      },
      {
        name: 'エスポワール立神',
        departments: [
          {
            name: '介護医療院',
            metrics: [
              { label: '緊急対応', value: 0, unit: '件' },
              { label: '残業時間', value: 13.5, unit: '時間' },
              { label: '有給取得', value: 71, unit: '%' },
              { label: '生産性', value: 109, unit: '' }
            ]
          },
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
            name: '特別養護老人ホーム',
            metrics: [
              { label: '緊急対応', value: 1, unit: '件' },
              { label: '残業時間', value: 19.8, unit: '時間', trend: { value: '+3h', isPositive: false } },
              { label: '有給取得', value: 62, unit: '%' },
              { label: '生産性', value: 105, unit: '' }
            ]
          },
          {
            name: 'ショートステイ',
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

  const aiAnalysis: AIAnalysis = {
    summary: '平均残業時間18.5時間/月（+2.5h）、緊急対応要件3件（+1件）と業務効率に課題があります。一方で、生産性指数112（+8）、有給取得率68%（+5%）と改善傾向も見られます。',
    insights: [
      {
        title: 'ICUの残業時間過多',
        priority: 'high',
        content: 'ICUの平均残業28.5時間/月は全部署で最高。高度医療の特性が要因。',
        impact: 'スタッフの疲弊蓄積、医療ミスのリスク'
      },
      {
        title: '生産性の向上傾向',
        priority: 'medium',
        content: '生産性指数112（+8）と改善。業務効率化の取り組みが成果を上げている。',
        impact: '同じ人員でより多くの業務処理が可能'
      },
      {
        title: '有給取得率の改善',
        priority: 'low',
        content: '有給取得率68%（+5%）と改善傾向。特に外来が75%と高い。',
        impact: 'ワークライフバランス向上'
      }
    ],
    recommendations: [
      {
        title: 'ICUの業務負荷軽減',
        priority: 'urgent',
        content: 'ICUの残業時間削減に向け、業務プロセスと人員配置を再設計する。',
        actions: [
          '夜勤シフトの最適化',
          '事務作業の自動化推進',
          '専門業務への集中環境整備',
          '部門間応援体制の構築'
        ]
      },
      {
        title: '生産性向上の水平展開',
        priority: 'high',
        content: '成功している業務効率化の取り組みを全部署に展開する。',
        actions: [
          'ベストプラクティスの収集・共有',
          'ITツールの積極活用',
          '業務標準化の推進',
          '成果測定・フィードバック'
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
        title: '過労による医療事故',
        priority: 'urgent',
        content: 'ICUの高残業が続くと、疲労による医療事故のリスクが高まる。',
        impact: '患者の安全性低下、法的リスク'
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