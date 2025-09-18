'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import FacilitySelector from '@/components/reports/FacilitySelector';
import CommonHeader from '@/components/CommonHeader';
import CategoryReportCard from '@/components/reports/CategoryReportCard';

export default function PerformanceEvaluationCategoryPage() {
  const router = useRouter();
  const [selectedFacility, setSelectedFacility] = useState('');

  const reports = [
    {
      id: 'performance-matrix',
      title: 'パフォーマンスマトリクス',
      description: '個人のスキルと成果めE軸で評価し、E象限で刁E���E可視化',
      icon: '📊',
      gradient: 'from-blue-500 to-indigo-500',
      path: '/reports/performance-evaluation/performance-matrix',
      features: [
        'スキル×�E果�E2軸評価',
        '4象限での職員刁E��E,
        '個人別成長軌跡の追跡'
      ]
    },
    {
      id: 'team-analysis',
      title: 'チ�Eム評価刁E��',
      description: 'チ�Eム単位での2軸評価の雁E��と比輁E�E极E,
      icon: '👥',
      gradient: 'from-purple-500 to-pink-500',
      path: '/reports/performance-evaluation/team-analysis',
      features: [
        'チ�Eム別パフォーマンス比輁E,
        'メンバ�E構�Eの最適化提桁E,
        'チ�Eム間シナジー刁E��'
      ]
    },
    {
      id: 'department-comparison',
      title: '部門別比輁E,
      description: '部門間�E2軸評価スコアと刁E��E�E比輁E�E极E,
      icon: '🏢',
      gradient: 'from-green-500 to-emerald-500',
      path: '/reports/performance-evaluation/department-comparison',
      features: [
        '部門別スコア刁E��E,
        '象限�E币E�E可視化',
        '部門間ギャチE�E刁E��'
      ]
    },
    {
      id: 'organization-optimization',
      title: '絁E���E体最適匁E,
      description: '2軸評価に基づく絁E��改喁E��ナリオのシミュレーション',
      icon: '🎯',
      gradient: 'from-orange-500 to-amber-500',
      path: '/reports/performance-evaluation/organization-optimization',
      features: [
        '改喁E��ナリオ比輁E,
        'ROI刁E��',
        '施策優先度の提桁E
      ]
    },
    {
      id: 'evaluation-trend',
      title: '評価推移刁E��',
      description: '個人・チ�Eム・部門の2軸評価の時系列変化を追跡',
      icon: '📈',
      gradient: 'from-indigo-500 to-purple-500',
      path: '/reports/performance-evaluation/evaluation-trend',
      features: [
        '評価スコアの推移',
        '象限移動パターン',
        '成長玁E�E可視化'
      ]
    },
    {
      id: 'cluster-analysis',
      title: 'クラスター刁E��',
      description: '類似パフォーマンス特性を持つ職員グループ�E特定と刁E��',
      icon: '🔍',
      gradient: 'from-pink-500 to-rose-500',
      path: '/reports/performance-evaluation/cluster-analysis',
      features: [
        'パフォーマンスクラスター特宁E,
        'クラスター別特性刁E��',
        'グループ別施策提桁E
      ]
    },
    {
      id: 'skill-assessment',
      title: 'スキル評価刁E��',
      description: '職員のスキルレベルを多角的に評価・刁E��',
      icon: '💡',
      gradient: 'from-yellow-500 to-orange-500',
      path: '/reports/performance-evaluation/skill-assessment',
      features: [
        'スキルマトリクス作�E',
        'スキルギャチE�E刁E��',
        '育成計画の提桁E
      ]
    },
    {
      id: 'performance-prediction',
      title: 'パフォーマンス予測',
      description: '過去チE�Eタから封E��のパフォーマンスを予測',
      icon: '🔮',
      gradient: 'from-teal-500 to-cyan-500',
      path: '/reports/performance-evaluation/performance-prediction',
      features: [
        '封E��性スコア算�E',
        '成長ポテンシャル評価',
        '早期警告シスチE��'
      ]
    }
  ];

  const handleReportClick = (reportPath: string) => {
    const url = selectedFacility ? `${reportPath}?facility=${selectedFacility}` : reportPath;
    router.push(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="人事評価刁E��" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">人事評価刁E��レポ�EチE/h1>
            <p className="text-gray-600">
              スキルと成果の2軸評価を中忁E��、多角的な視点から職員のパフォーマンスを�E析し、E
              絁E���E人材力向上に向けた�E体的な施策を提案します、E
            </p>
          </div>
          
          <FacilitySelector
            selectedFacility={selectedFacility}
            onFacilityChange={setSelectedFacility}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((report) => (
            <CategoryReportCard
              key={report.id}
              {...report}
              onClick={() => handleReportClick(report.path)}
            />
          ))}
        </div>

        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">
            💡 人事評価刁E��の活用ポインチE
          </h2>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• パフォーマンスマトリクスで個人の位置づけを把握し、E��刁E��育成計画を立桁E/li>
            <li>• チ�Eム・部門別の刁E��で絁E���E強み・弱みを特定し、戦略皁E��人材�E置を実現</li>
            <li>• 評価推移とクラスター刁E��で封E��の人材リスクを早期に発見�E対忁E/li>
            <li>• 絁E��最適化シミュレーションで投賁E��効果�E高い施策を優先的に実施</li>
          </ul>
        </div>
      </div></div>
  );
}