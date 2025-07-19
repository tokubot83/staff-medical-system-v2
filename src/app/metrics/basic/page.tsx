import React from 'react';
import MetricsLayout from '@/components/metrics/MetricsLayout';
import { BasicMetrics, AIAnalysis } from '@/types/metrics';

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
      { label: '部門数', value: '8', unit: '部門' },
      { label: '平均年齢', value: '38.5', unit: '歳', trend: { value: '+0.3歳', isPositive: false } },
      { label: '平均勤続年数', value: '8.2', unit: '年', trend: { value: '+0.5年', isPositive: true } },
      { label: '正規職員率', value: '82', unit: '%', trend: { value: '+2%', isPositive: true } },
      { label: '男女比', value: '3:7', unit: '' },
      { label: '管理職比率', value: '15', unit: '%' }
    ],
    facilities: [
      {
        name: '小原病院',
        departments: [
          {
            name: '診療部',
            metrics: [
              { label: '職員数', value: 85, unit: '名' },
              { label: '平均年齢', value: 42.5, unit: '歳' },
              { label: '勤続年数', value: 10.2, unit: '年' },
              { label: '正規率', value: 98, unit: '%' }
            ]
          },
          {
            name: '看護部',
            metrics: [
              { label: '職員数', value: 180, unit: '名' },
              { label: '平均年齢', value: 36.8, unit: '歳' },
              { label: '勤続年数', value: 7.5, unit: '年' },
              { label: '正規率', value: 85, unit: '%' }
            ]
          },
          {
            name: '診療技術部',
            metrics: [
              { label: '職員数', value: 65, unit: '名' },
              { label: '平均年齢', value: 35.2, unit: '歳' },
              { label: '勤続年数', value: 6.8, unit: '年' },
              { label: '正規率', value: 88, unit: '%' }
            ]
          },
          {
            name: '事務部',
            metrics: [
              { label: '職員数', value: 48, unit: '名' },
              { label: '平均年齢', value: 39.5, unit: '歳' },
              { label: '勤続年数', value: 8.2, unit: '年' },
              { label: '正規率', value: 82, unit: '%' }
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
              { label: '職員数', value: 18, unit: '名' },
              { label: '平均年齢', value: 45.2, unit: '歳' },
              { label: '勤続年数', value: 12.5, unit: '年' },
              { label: '正規率', value: 95, unit: '%' }
            ]
          },
          {
            name: '看護部門',
            metrics: [
              { label: '職員数', value: 58, unit: '名' },
              { label: '平均年齢', value: 38.5, unit: '歳' },
              { label: '勤続年数', value: 8.0, unit: '年' },
              { label: '正規率', value: 78, unit: '%' }
            ]
          },
          {
            name: '診療技術部',
            metrics: [
              { label: '職員数', value: 42, unit: '名' },
              { label: '平均年齢', value: 34.8, unit: '歳' },
              { label: '勤続年数', value: 6.2, unit: '年' },
              { label: '正規率', value: 85, unit: '%' }
            ]
          },
          {
            name: '事務部門',
            metrics: [
              { label: '職員数', value: 22, unit: '名' },
              { label: '平均年齢', value: 40.5, unit: '歳' },
              { label: '勤続年数', value: 9.0, unit: '年' },
              { label: '正規率', value: 75, unit: '%' }
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
              { label: '職員数', value: 22, unit: '名' },
              { label: '平均年齢', value: 38.7, unit: '歳' },
              { label: '勤続年数', value: 6.8, unit: '年' },
              { label: '正規率', value: 74, unit: '%' }
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
              { label: '職員数', value: 32, unit: '名' },
              { label: '平均年齢', value: 39.8, unit: '歳' },
              { label: '勤続年数', value: 7.2, unit: '年' },
              { label: '正規率', value: 71, unit: '%' }
            ]
          },
          {
            name: '2号館',
            metrics: [
              { label: '職員数', value: 28, unit: '名' },
              { label: '平均年齢', value: 38.5, unit: '歳' },
              { label: '勤続年数', value: 6.8, unit: '年' },
              { label: '正規率', value: 69, unit: '%' }
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

  const aiAnalysis: AIAnalysis = {
    summary: '両病院の職員数は計500名で安定していますが、病院間・部門間で年齢構成に差異が見られます。小原病院の診療部は平均年齢42.5歳と高く、立神病院の診療技術部は34.8歳と若手中心です。この差異を活かした人材交流が有効です。',
    insights: [
      {
        title: '診療部門の高齢化',
        priority: 'high',
        content: '両病院の診療部門で平均年齢が40歳を超え、特に立神病院は45.2歳と高齢化が顕著です。',
        impact: '医師の世代交代と技術継承が急務'
      },
      {
        title: '診療技術部の若手比率',
        priority: 'medium',
        content: '両病院の診療技術部は平均年齢35歳前後と若手中心。リハビリ部門の人材が豊富。',
        impact: '専門技術の向上と組織の活性化に貢献'
      },
      {
        title: '病院間の正規職員率格差',
        priority: 'medium',
        content: '小原病院の正規職員率は高いが、立神病院の看護・事務部門では75-78%と低い。',
        impact: '立神病院の組織安定性に課題'
      }
    ],
    recommendations: [
      {
        title: '計画的な採用戦略',
        priority: 'high',
        content: '診療部門への若手医師採用を優先し、両病院での人材交流を促進。',
        actions: [
          '研修医の積極的採用と育成',
          '両病院間での医師ローテーション',
          '専門医資格取得支援の強化'
        ]
      },
      {
        title: '正規職員化の推進',
        priority: 'medium',
        content: '立神病院の非正規職員を段階的に正規化し、両病院の処遇格差を解消。',
        actions: [
          '統一的な評価基準の策定',
          '正規化目標値の設定（85%以上）',
          '両病院共通の福利厚生制度導入'
        ]
      }
    ],
    risks: [
      {
        title: '診療部門の大量退職リスク',
        priority: 'urgent',
        content: '立神病院の診療部門で今後5年以内に30%以上の退職が予想される。',
        impact: '地域医療提供体制への深刻な影響'
      },
      {
        title: '人材獲得競争',
        priority: 'high',
        content: '医療人材の需給逼迫により、計画的採用が困難になる可能性。',
        impact: '人員不足による既存スタッフの負担増'
      }
    ]
  };

  return <MetricsLayout metrics={metricsData} aiAnalysis={aiAnalysis} />;
}