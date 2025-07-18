import React from 'react';
import MetricsLayout from '@/components/metrics/MetricsLayout';
import { RiskMetrics, AIAnalysis } from '@/types/metrics';

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

  const aiAnalysis: AIAnalysis = {
    summary: '要注意職員12名（+3名）、離職率8.5%（+1.2%）とリスク指標が悪化しています。特に外来部門が深刻で、要注意職員4名、離職率12.5%と緊急対応が必要です。メンタルヘルス不調者も全体で15名に上り、総合的な対策が急務です。',
    insights: [
      {
        title: '外来部門の危機的状況',
        priority: 'urgent',
        content: '外来で要注意職員4名（+2名）、離職率12.5%、欠勤率5.8%と全指標が悪化。',
        impact: '業務継続性の危機、残ったスタッフの連鎖離職'
      },
      {
        title: 'メンタルヘルスの悪化',
        priority: 'high',
        content: 'メンタルヘルス不調者が15名に増加。特に外来（5名）と外科（4名）に集中。',
        impact: '長期休職リスク、パフォーマンス低下'
      },
      {
        title: 'ICUの優良状態',
        priority: 'low',
        content: 'ICUは要注意1名、離職率3.2%、欠勤率2.1%と全面的に良好。',
        impact: 'ベストプラクティスのモデル'
      }
    ],
    recommendations: [
      {
        title: '外来部門の緊急支援',
        priority: 'urgent',
        content: '外来部門に対して緊急支援チームを編成し、即座に介入する。',
        actions: [
          '管理職による個別面談の実施',
          '業務量の緊急見直し',
          '他部署からの応援体制構築',
          'メンタルヘルスケアの強化'
        ]
      },
      {
        title: 'メンタルヘルス対策',
        priority: 'high',
        content: '全職員向けメンタルヘルスケアプログラムを導入する。',
        actions: [
          'ストレスチェックの定期実施',
          'カウンセリング窓口の設置',
          'リラクゼーションルームの整備',
          '管理職向けメンタルヘルス研修'
        ]
      },
      {
        title: 'ICUモデルの分析・展開',
        priority: 'medium',
        content: 'ICUの低リスク維持要因を分析し、他部署に展開する。',
        actions: [
          'ICUの組織文化調査',
          'マネジメント手法の文書化',
          '他部署への段階的導入'
        ]
      }
    ],
    risks: [
      {
        title: '外来部門の崩壊',
        priority: 'urgent',
        content: '現状のままでは3ヶ月以内に外来部門が機能不全に陥るリスク。',
        impact: '外来機能停止、患者サービスの重大な低下'
      },
      {
        title: '連鎖離職の発生',
        priority: 'high',
        content: 'ストレス高まる環境で優秀人材から順次離職する連鎖が発生する可能性。',
        impact: '組織全体の士気低下、採用困難'
      },
      {
        title: 'ハラスメント事案増加',
        priority: 'medium',
        content: 'ストレス環境下でハラスメント事案が増加するリスク。',
        impact: '法的リスク、レピュテーション低下'
      }
    ]
  };

  return <MetricsLayout metrics={metricsData} aiAnalysis={aiAnalysis} />;
}