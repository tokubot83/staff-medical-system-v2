import React from 'react';
import MetricsLayout from '@/components/metrics/MetricsLayout';
import { QualityMetrics, AIAnalysis } from '@/types/metrics';

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
        name: '小原病院',
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
        name: '立神リハビリテーション温泉病院',
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
      },
      {
        name: 'エスポワール立神',
        departments: [
          {
            name: '介護医療院',
            metrics: [
              { label: '満足度', value: 84, unit: '%', trend: { value: '+2%', isPositive: true } },
              { label: 'エンゲージメント', value: 79, unit: '%' },
              { label: '資格保有率', value: 64, unit: '%' },
              { label: '専門認定率', value: 36, unit: '%' }
            ]
          },
          {
            name: '通所リハビリ',
            metrics: [
              { label: '満足度', value: 87, unit: '%', trend: { value: '+3%', isPositive: true } },
              { label: 'エンゲージメント', value: 82, unit: '%' },
              { label: '資格保有率', value: 68, unit: '%' },
              { label: '専門認定率', value: 41, unit: '%' }
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
              { label: '満足度', value: 82, unit: '%', trend: { value: '±0%', isPositive: true } },
              { label: 'エンゲージメント', value: 77, unit: '%' },
              { label: '資格保有率', value: 62, unit: '%' },
              { label: '専門認定率', value: 35, unit: '%' }
            ]
          },
          {
            name: 'ショートステイ',
            metrics: [
              { label: '満足度', value: 85, unit: '%', trend: { value: '+2%', isPositive: true } },
              { label: 'エンゲージメント', value: 80, unit: '%' },
              { label: '資格保有率', value: 60, unit: '%' },
              { label: '専門認定率', value: 32, unit: '%' }
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

  const aiAnalysis: AIAnalysis = {
    summary: '総合満足度87%と高水準を維持していますが、外来部門では満足度が前月比-1%と低下傾向です。ICUと地域包括ケアの高い満足度はベストプラクティスのモデルとなり得ます。',
    insights: [
      {
        title: 'ICUの高エンゲージメント',
        priority: 'high',
        content: 'ICUは満足度89%、専門認定率62%と全部署で最高レベル。チーム文化が良好。',
        impact: '他部署へのロールモデルとして機能'
      },
      {
        title: '外来の満足度低下',
        priority: 'urgent',
        content: '外来部門の満足度83%（-1%）、エンゲージメント78%と低調。業務負荷が主要因。',
        impact: '離職リスク上昇、患者サービス品質低下'
      },
      {
        title: '資格保有率の差',
        priority: 'medium',
        content: 'ICUの資格保有率85%に対し、外来は65%と大きな格差。',
        impact: 'サービス品質のバラツキ'
      }
    ],
    recommendations: [
      {
        title: '外来部門の業務改革',
        priority: 'urgent',
        content: '外来の業務プロセスを見直し、スタッフの負担軽減を図る。',
        actions: [
          '業務フローの可視化と分析',
          '事務作業の自動化・効率化',
          '適正な人員配置の再検討'
        ]
      },
      {
        title: 'ICUモデルの水平展開',
        priority: 'high',
        content: 'ICUの成功要因を分析し、他部署へ展開する。',
        actions: [
          'ICUのマネジメント手法の文書化',
          '部署間交流プログラムの実施',
          'ベストプラクティス共有会の開催'
        ]
      },
      {
        title: '資格取得支援強化',
        priority: 'medium',
        content: '外来スタッフの資格取得を組織的に支援する。',
        actions: [
          '勉強会・研修の実施',
          '資格取得費用の補助',
          '学習時間の確保'
        ]
      }
    ],
    risks: [
      {
        title: '外来部門の離職連鎖',
        priority: 'urgent',
        content: '満足度低下が続くと、優秀人材の離職が連鎖的に発生するリスク。',
        impact: '残ったスタッフの負担増、さらなる満足度低下'
      },
      {
        title: 'サービス品質の低下',
        priority: 'high',
        content: 'エンゲージメント低下が患者対応に影響し、患者満足度が低下する可能性。',
        impact: '病院の評判低下、患者減少'
      }
    ]
  };

  return <MetricsLayout metrics={metricsData} aiAnalysis={aiAnalysis} />;
}