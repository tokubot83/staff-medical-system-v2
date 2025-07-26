'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import FacilitySelector from '@/components/reports/FacilitySelector';
import CommonHeader from '@/components/CommonHeader';
import DashboardButton from '@/components/DashboardButton';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import CategoryReportCard from '@/components/reports/CategoryReportCard';
import CategoryBackButton from '@/components/reports/CategoryBackButton';

export default function CohortAnalysisCategoryPage() {
  const router = useRouter();
  const [selectedFacility, setSelectedFacility] = useState('');

  const reports = [
    {
      id: 'entry-year-cohort',
      title: '入社年次別コホート追跡',
      description: '入社年次別に職員の定着率・成長・キャリア形成を長期的に追跡分析',
      icon: '📅',
      gradient: 'from-blue-500 to-indigo-500',
      path: '/reports/cohort-analysis/entry-year-cohort',
      features: [
        '年次別定着率の推移',
        'パフォーマンスの経年変化',
        '離職要因の世代別分析'
      ]
    },
    {
      id: 'generation-analysis',
      title: '世代別特性分析',
      description: 'Z世代、ミレニアル世代など世代別の特性と組織適応を分析',
      icon: '👥',
      gradient: 'from-purple-500 to-pink-500',
      path: '/reports/cohort-analysis/generation-analysis',
      features: [
        '世代別の価値観・働き方',
        'エンゲージメントの違い',
        '世代間ギャップの可視化'
      ]
    },
    {
      id: 'department-cohort',
      title: '部署別コホート比較',
      description: '部署・職種別にコホートの特性を比較し、組織課題を特定',
      icon: '🏢',
      gradient: 'from-green-500 to-emerald-500',
      path: '/reports/cohort-analysis/department-cohort',
      features: [
        '部署別の定着率比較',
        '職種別のキャリアパス',
        '組織文化の影響分析'
      ]
    },
    {
      id: 'intervention-effect',
      title: '施策効果測定',
      description: '人事施策導入前後のコホート比較により、施策の効果を定量評価',
      icon: '📊',
      gradient: 'from-orange-500 to-amber-500',
      path: '/reports/cohort-analysis/intervention-effect',
      features: [
        '施策前後の比較分析',
        'ROIの算出',
        '改善提案の生成'
      ]
    }
  ];

  const handleReportClick = (path: string) => {
    const url = selectedFacility 
      ? `${path}?facility=${encodeURIComponent(selectedFacility)}`
      : path;
    router.push(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="コホート分析" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* カテゴリー説明 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">📊</span>
            <h1 className="text-2xl font-bold text-gray-900">コホート分析</h1>
          </div>
          <p className="text-gray-600">
            特定の属性を持つ職員グループ（コホート）を長期的に追跡し、
            組織における人材の成長・定着・離職のパターンを分析します。
            入社年次、世代、部署などの切り口で、組織の人材課題を深く理解し、
            効果的な人事施策の立案を支援します。
          </p>
        </div>

        {/* 施設選択 */}
        <div className="mb-8">
          <FacilitySelector
            selectedFacility={selectedFacility}
            onFacilityChange={setSelectedFacility}
          />
        </div>

        {/* レポート一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <CategoryReportCard
              key={report.id}
              {...report}
              onClick={() => handleReportClick(report.path)}
            />
          ))}
        </div>

        {/* レポートセンターに戻るボタン */}
        <div className="mt-8">
          <CategoryBackButton />
        </div>
      </div>
      
      <ScrollToTopButton />
      <DashboardButton />
    </div>
  );
}