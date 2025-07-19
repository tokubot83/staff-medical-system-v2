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
        name: '小原病院',
        departments: [
          {
            name: '診療部',
            metrics: [
              { label: '要注意職員', value: 3, unit: '名', trend: { value: '+1名', isPositive: false } },
              { label: '離職率', value: 4.7, unit: '%' },
              { label: '欠勤率', value: 2.1, unit: '%' },
              { label: 'メンタル不調', value: 4, unit: '名' }
            ]
          },
          {
            name: '看護部',
            metrics: [
              { label: '要注意職員', value: 8, unit: '名', trend: { value: '+2名', isPositive: false } },
              { label: '離職率', value: 11.2, unit: '%' },
              { label: '欠勤率', value: 5.5, unit: '%' },
              { label: 'メンタル不調', value: 10, unit: '名' }
            ]
          },
          {
            name: '診療技術部',
            metrics: [
              { label: '要注意職員', value: 2, unit: '名' },
              { label: '離職率', value: 3.1, unit: '%' },
              { label: '欠勤率', value: 2.5, unit: '%' },
              { label: 'メンタル不調', value: 3, unit: '名' }
            ]
          },
          {
            name: '事務部',
            metrics: [
              { label: '要注意職員', value: 5, unit: '名', trend: { value: '+2名', isPositive: false } },
              { label: '離職率', value: 12.5, unit: '%' },
              { label: '欠勤率', value: 4.8, unit: '%' },
              { label: 'メンタル不調', value: 6, unit: '名' }
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
              { label: '要注意職員', value: 2, unit: '名' },
              { label: '離職率', value: 5.6, unit: '%' },
              { label: '欠勤率', value: 2.8, unit: '%' },
              { label: 'メンタル不調', value: 2, unit: '名' }
            ]
          },
          {
            name: '看護部門',
            metrics: [
              { label: '要注意職員', value: 4, unit: '名', trend: { value: '+1名', isPositive: false } },
              { label: '離職率', value: 10.3, unit: '%' },
              { label: '欠勤率', value: 4.8, unit: '%' },
              { label: 'メンタル不調', value: 5, unit: '名' }
            ]
          },
          {
            name: '診療技術部',
            metrics: [
              { label: '要注意職員', value: 1, unit: '名' },
              { label: '離職率', value: 2.4, unit: '%' },
              { label: '欠勤率', value: 1.9, unit: '%' },
              { label: 'メンタル不調', value: 1, unit: '名' }
            ]
          },
          {
            name: '事務部門',
            metrics: [
              { label: '要注意職員', value: 3, unit: '名' },
              { label: '離職率', value: 13.6, unit: '%' },
              { label: '欠勤率', value: 5.2, unit: '%' },
              { label: 'メンタル不調', value: 3, unit: '名' }
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
              { label: '要注意職員', value: 1, unit: '名' },
              { label: '離職率', value: 7.0, unit: '%' },
              { label: '欠勤率', value: 3.2, unit: '%' },
              { label: 'メンタル不調', value: 1, unit: '名' }
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
              { label: '要注意職員', value: 3, unit: '名', trend: { value: '+1名', isPositive: false } },
              { label: '離職率', value: 11.0, unit: '%' },
              { label: '欠勤率', value: 5.2, unit: '%' },
              { label: 'メンタル不調', value: 3, unit: '名' }
            ]
          },
          {
            name: '2号館',
            metrics: [
              { label: '要注意職員', value: 1, unit: '名' },
              { label: '離職率', value: 8.5, unit: '%' },
              { label: '欠勤率', value: 3.8, unit: '%' },
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
    summary: '要注意職員が両病院計10名以上、特に看護部門（12名）と事務部門（8名）に集中しています。離職率もこれらの部門で10%を超え、緊急対応が必要です。一方、診療技術部は両病院ともリスク指標が良好です。',
    insights: [
      {
        title: '看護部門の集団離職リスク',
        priority: 'urgent',
        content: '両病院の看護部門で離職率10-11%、要注意職員12名、メンタル不調15名。',
        impact: '看護体制の崩壊、患者ケアの質低下'
      },
      {
        title: '事務部門の高離職率',
        priority: 'high',
        content: '両病院の事務部門で離職率12.5-13.6%、要注意職員8名。キャリアパス不明確が主因。',
        impact: '組織運営ノウハウの喪失、業務効率低下'
      },
      {
        title: '診療技術部の安定性',
        priority: 'low',
        content: '両病院の診療技術部が離職率2.4-3.1%、欠勤率2%前後と全指標で優良。',
        impact: '組織の安定性モデル、ベストプラクティス'
      }
    ],
    recommendations: [
      {
        title: '看護部門の緊急対策',
        priority: 'urgent',
        content: '両病院の看護部門に対して緊急支援体制を構築し、離職連鎖を防ぐ。',
        actions: [
          '看護部長による全員面談',
          '勤務体制の柔軟化',
          '業務負荷の平準化',
          'キャリア支援の強化'
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
        title: '診療技術部モデルの分析・展開',
        priority: 'medium',
        content: '診療技術部の低リスク維持要因を分析し、他部門に展開する。',
        actions: [
          '専門性を活かしたキャリア形成',
          'チームワークの仕組み化',
          '学習文化の移植'
        ]
      }
    ],
    risks: [
      {
        title: '看護体制の崩壊',
        priority: 'urgent',
        content: '現状のままでは3ヶ月以内に看護部門で大量離職が発生し、看護体制が崩壊するリスク。',
        impact: '病棟運営の危機、患者安全への重大な影響'
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