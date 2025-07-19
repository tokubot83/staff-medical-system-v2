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
            name: '診療部',
            metrics: [
              { label: '満足度', value: 88, unit: '%', trend: { value: '+1%', isPositive: true } },
              { label: 'エンゲージメント', value: 84, unit: '%' },
              { label: '資格保有率', value: 98, unit: '%' },
              { label: '専門認定率', value: 85, unit: '%' }
            ]
          },
          {
            name: '看護部',
            metrics: [
              { label: '満足度', value: 86, unit: '%', trend: { value: '+2%', isPositive: true } },
              { label: 'エンゲージメント', value: 82, unit: '%' },
              { label: '資格保有率', value: 100, unit: '%' },
              { label: '専門認定率', value: 48, unit: '%' }
            ]
          },
          {
            name: '診療技術部',
            metrics: [
              { label: '満足度', value: 89, unit: '%', trend: { value: '+3%', isPositive: true } },
              { label: 'エンゲージメント', value: 85, unit: '%' },
              { label: '資格保有率', value: 95, unit: '%' },
              { label: '専門認定率', value: 62, unit: '%' }
            ]
          },
          {
            name: '事務部',
            metrics: [
              { label: '満足度', value: 84, unit: '%', trend: { value: '±0%', isPositive: true } },
              { label: 'エンゲージメント', value: 79, unit: '%' },
              { label: '資格保有率', value: 45, unit: '%' },
              { label: '専門認定率', value: 38, unit: '%' }
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
              { label: '満足度', value: 85, unit: '%', trend: { value: '+1%', isPositive: true } },
              { label: 'エンゲージメント', value: 80, unit: '%' },
              { label: '資格保有率', value: 98, unit: '%' },
              { label: '専門認定率', value: 75, unit: '%' }
            ]
          },
          {
            name: '看護部門',
            metrics: [
              { label: '満足度', value: 88, unit: '%', trend: { value: '+3%', isPositive: true } },
              { label: 'エンゲージメント', value: 83, unit: '%' },
              { label: '資格保有率', value: 100, unit: '%' },
              { label: '専門認定率', value: 42, unit: '%' }
            ]
          },
          {
            name: '診療技術部',
            metrics: [
              { label: '満足度', value: 91, unit: '%', trend: { value: '+4%', isPositive: true } },
              { label: 'エンゲージメント', value: 87, unit: '%' },
              { label: '資格保有率', value: 92, unit: '%' },
              { label: '専門認定率', value: 58, unit: '%' }
            ]
          },
          {
            name: '事務部門',
            metrics: [
              { label: '満足度', value: 83, unit: '%', trend: { value: '±0%', isPositive: true } },
              { label: 'エンゲージメント', value: 78, unit: '%' },
              { label: '資格保有率', value: 38, unit: '%' },
              { label: '専門認定率', value: 28, unit: '%' }
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
            name: '1号館',
            metrics: [
              { label: '満足度', value: 82, unit: '%', trend: { value: '±0%', isPositive: true } },
              { label: 'エンゲージメント', value: 77, unit: '%' },
              { label: '資格保有率', value: 62, unit: '%' },
              { label: '専門認定率', value: 35, unit: '%' }
            ]
          },
          {
            name: '2号館',
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
    summary: '総合満足度87%と高水準を維持しています。両病院とも診療技術部の満足度が90%前後と非常に高く、資格保有率も高いのが特徴です。一方、事務部門のエンゲージメントが78-79%と低く、改善が必要です。',
    insights: [
      {
        title: '診療技術部の高エンゲージメント',
        priority: 'high',
        content: '両病院の診療技術部が満足度89-91%、エンゲージメント85-87%と突出。専門性が高く評価されている。',
        impact: '他部門へのロールモデルとして機能'
      },
      {
        title: '事務部門の低エンゲージメント',
        priority: 'urgent',
        content: '両病院の事務部門がエンゲージメント78-79%と低く、資格保有率で38-45%。キャリアパスが不明確。',
        impact: 'モチベーション低下、業務効率への影響'
      },
      {
        title: '部門間の資格保有率格差',
        priority: 'medium',
        content: '医療系部門は92-100%と高いが、事務部門は38-45%と半分以下。専門性への投資に格差。',
        impact: '部門間のサービス品質格差'
      }
    ],
    recommendations: [
      {
        title: '事務部門のキャリア支援',
        priority: 'urgent',
        content: '事務部門のキャリアパスを明確化し、モチベーション向上を図る。',
        actions: [
          '事務系資格の取得支援強化',
          'キャリアラダーの可視化',
          '評価制度の明確化'
        ]
      },
      {
        title: '診療技術部モデルの水平展開',
        priority: 'high',
        content: '診療技術部の成功要因を分析し、他部門へ展開する。',
        actions: [
          '専門性評価の仕組み導入',
          '部門間交流会の定期開催',
          'チームビルディングの実施'
        ]
      },
      {
        title: '両病院共通の能力開発体系',
        priority: 'medium',
        content: '両病院共通の資格取得支援とキャリア開発体系を構築する。',
        actions: [
          '統一的な研修プログラムの策定',
          '資格取得補助制度の拡充',
          'オンライン学習環境の整備'
        ]
      }
    ],
    risks: [
      {
        title: '事務部門の人材流出',
        priority: 'urgent',
        content: 'エンゲージメント低下が続くと、優秀な事務職員が他業界へ流出するリスク。',
        impact: '業務ノウハウの喪失、組織運営への影響'
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