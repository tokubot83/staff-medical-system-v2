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
      { label: '部署別職員数', value: '15', unit: '部署' },
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
            name: '地域包括医療病棟',
            metrics: [
              { label: '職員数', value: 42, unit: '名' },
              { label: '平均年齢', value: 37.2, unit: '歳' },
              { label: '勤続年数', value: 7.8, unit: '年' },
              { label: '正規率', value: 85, unit: '%' }
            ]
          },
          {
            name: '地域包括ケア病棟',
            metrics: [
              { label: '職員数', value: 38, unit: '名' },
              { label: '平均年齢', value: 38.5, unit: '歳' },
              { label: '勤続年数', value: 8.2, unit: '年' },
              { label: '正規率', value: 82, unit: '%' }
            ]
          },
          {
            name: '回復期リハ病棟',
            metrics: [
              { label: '職員数', value: 35, unit: '名' },
              { label: '平均年齢', value: 35.8, unit: '歳' },
              { label: '勤続年数', value: 6.5, unit: '年' },
              { label: '正規率', value: 88, unit: '%' }
            ]
          },
          {
            name: '外来',
            metrics: [
              { label: '職員数', value: 52, unit: '名' },
              { label: '平均年齢', value: 40.2, unit: '歳' },
              { label: '勤続年数', value: 9.2, unit: '年' },
              { label: '正規率', value: 76, unit: '%' }
            ]
          }
        ]
      },
      {
        name: '立神リハビリテーション温泉病院',
        departments: [
          {
            name: '医療療養病棟',
            metrics: [
              { label: '職員数', value: 30, unit: '名' },
              { label: '平均年齢', value: 38.2, unit: '歳' },
              { label: '勤続年数', value: 7.5, unit: '年' },
              { label: '正規率', value: 81, unit: '%' }
            ]
          },
          {
            name: '介護医療院',
            metrics: [
              { label: '職員数', value: 28, unit: '名' },
              { label: '平均年齢', value: 39.5, unit: '歳' },
              { label: '勤続年数', value: 8.0, unit: '年' },
              { label: '正規率', value: 78, unit: '%' }
            ]
          },
          {
            name: '外来',
            metrics: [
              { label: '職員数', value: 22, unit: '名' },
              { label: '平均年齢', value: 41.0, unit: '歳' },
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
    summary: '本院の職員数は500名で安定していますが、部署間で年齢構成に偏りが見られます。特に外来部門の平均年齢が41.3歳と高く、世代交代の準備が必要です。一方、ICUは若手中心で成長余地があります。',
    insights: [
      {
        title: '年齢構成の偏り',
        priority: 'high',
        content: '外来部門の平均年齢が41.3歳と最も高く、今後5年で大量退職のリスクがあります。',
        impact: '熟練スタッフの知識・技術の継承が急務'
      },
      {
        title: 'ICUの若手比率',
        priority: 'medium',
        content: 'ICUの平均年齢34.5歳、勤続6.2年と若手中心。正規職員率92%は強み。',
        impact: '教育投資により将来の中核人材に'
      },
      {
        title: '非正規職員の偏在',
        priority: 'medium',
        content: '外来の正規職員率75%と低く、組織の安定性に課題。',
        impact: '重要業務の継続性リスク'
      }
    ],
    recommendations: [
      {
        title: '計画的な採用戦略',
        priority: 'high',
        content: '外来部門への若手採用を優先し、3年かけて世代バランスを改善。',
        actions: [
          '新卒採用枠を外来に重点配分',
          'ベテランと若手のペア配置',
          '技術継承プログラムの導入'
        ]
      },
      {
        title: '正規職員化の推進',
        priority: 'medium',
        content: '外来の優秀な非正規職員を段階的に正規化し、定着率向上を図る。',
        actions: [
          '評価基準の明確化',
          '正規化ロードマップの作成',
          '待遇改善による定着促進'
        ]
      }
    ],
    risks: [
      {
        title: '大量退職リスク',
        priority: 'urgent',
        content: '外来部門で今後5年以内に20%以上の退職が予想される。',
        impact: '業務継続性の危機、患者サービス低下の可能性'
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