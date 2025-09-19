'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import FacilitySelector from '@/components/reports/FacilitySelector';
import CategoryReportCard from '@/components/reports/CategoryReportCard';
export default function PerformanceEvaluationCategoryPage() {
  const router = useRouter();
  const [selectedFacility, setSelectedFacility] = useState('');

  const reports = [
    {
      id: 'performance-matrix',
      title: 'パフォーマンスマトリクス',
      description: '個人のスキルと成果を2軸で評価し、4象限で分類・可視化',
      icon: '📊',
      gradient: 'from-blue-500 to-indigo-500',
      path: '/reports/performance-evaluation/performance-matrix',
      features: [
        'スキル×成果の2軸評価',
        '4象限での職員分類',
        '個人別成長軌跡の追跡'
      ]
    },
    {
      id: 'team-analysis',
      title: 'チーム評価分析',
      description: 'チーム単位での2軸評価の集計と比較分析',
      icon: '👥',
      gradient: 'from-purple-500 to-pink-500',
      path: '/reports/performance-evaluation/team-analysis',
      features: [
        'チーム別パフォーマンス比較',
        'メンバー構成の最適化提案',
        'チーム間シナジー分析'
      ]
    },
    {
      id: 'department-comparison',
      title: '部門別比較',
      description: '部門間の2軸評価スコアと分布の比較分析',
      icon: '🏢',
      gradient: 'from-green-500 to-emerald-500',
      path: '/reports/performance-evaluation/department-comparison',
      features: [
        '部門別スコア分布',
        '象限分布の可視化',
        '部門間ギャップ分析'
      ]
    },
    {
      id: 'organization-optimization',
      title: '組織全体最適化',
      description: '2軸評価に基づく組織改善シナリオのシミュレーション',
      icon: '🎯',
      gradient: 'from-orange-500 to-amber-500',
      path: '/reports/performance-evaluation/organization-optimization',
      features: [
        '改善シナリオ比較',
        'ROI分析',
        '施策優先度の提案'
      ]
    },
    {
      id: 'evaluation-trend',
      title: '評価推移分析',
      description: '個人・チーム・部門の2軸評価の時系列変化を追跡',
      icon: '📈',
      gradient: 'from-indigo-500 to-purple-500',
      path: '/reports/performance-evaluation/evaluation-trend',
      features: [
        '評価スコアの推移',
        '象限移動パターン',
        '成長率の可視化'
      ]
    },
    {
      id: 'cluster-analysis',
      title: 'クラスター分析',
      description: '類似パフォーマンス特性を持つ職員グループの特定と分析',
      icon: '🔍',
      gradient: 'from-pink-500 to-rose-500',
      path: '/reports/performance-evaluation/cluster-analysis',
      features: [
        'パフォーマンスクラスター特定',
        'クラスター別特性分析',
        'グループ別施策提案'
      ]
    },
    {
      id: 'skill-assessment',
      title: 'スキル評価分析',
      description: '職員のスキルレベルを多角的に評価・分析',
      icon: '💡',
      gradient: 'from-yellow-500 to-orange-500',
      path: '/reports/performance-evaluation/skill-assessment',
      features: [
        'スキルマトリクス作成',
        'スキルギャップ分析',
        '育成計画の提案'
      ]
    },
    {
      id: 'performance-prediction',
      title: 'パフォーマンス予測',
      description: '過去データから将来のパフォーマンスを予測',
      icon: '🔮',
      gradient: 'from-teal-500 to-cyan-500',
      path: '/reports/performance-evaluation/performance-prediction',
      features: [
        '将来性スコア算出',
        '成長ポテンシャル評価',
        '早期警告システム'
      ]
    }
  ];

  const handleReportClick = (reportPath: string) => {
    const url = selectedFacility ? `${reportPath}?facility=${selectedFacility}` : reportPath;
    router.push(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6"></div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">人事評価分析レポート</h1>
            <p className="text-gray-600">
              スキルと成果の2軸評価を中心に、多角的な視点から職員のパフォーマンスを分析し、
              組織の人材力向上に向けた具体的な施策を提案します。
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
            💡 人事評価分析の活用ポイント
          </h2>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• パフォーマンスマトリクスで個人の位置づけを把握し、適切な育成計画を立案</li>
            <li>• チーム・部門別の分析で組織の強み・弱みを特定し、戦略的な人材配置を実現</li>
            <li>• 評価推移とクラスター分析で将来の人材リスクを早期に発見・対応</li>
            <li>• 組織最適化シミュレーションで投資対効果の高い施策を優先的に実施</li>
          </ul>
        </div>
      </div></div>
  );
}