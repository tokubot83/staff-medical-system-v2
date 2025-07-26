'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import FacilitySelector from '@/components/reports/FacilitySelector';
import CommonHeader from '@/components/CommonHeader';
import DashboardButton from '@/components/DashboardButton';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import CategoryReportCard from '@/components/reports/CategoryReportCard';
import { BackToReportsButton } from '@/components/BackToReportsButton';

export default function FlowAnalysisCategoryPage() {
  const router = useRouter();
  const [selectedFacility, setSelectedFacility] = useState('');

  const reports = [
    {
      id: 'department-flow',
      title: '部署間異動フロー',
      description: '部署間の人材移動パターンを可視化し、組織内の人材流動性を分析',
      icon: '🔄',
      gradient: 'from-indigo-500 to-purple-500',
      path: '/reports/flow-analysis/department-flow',
      features: [
        'Sankeyダイアグラムによる可視化',
        '部署別の流入・流出統計',
        '異動パターンの傾向分析'
      ]
    },
    {
      id: 'career-path',
      title: 'キャリアパス分析',
      description: '職員のキャリア形成パターンを分析し、効果的なキャリア開発を支援',
      icon: '📈',
      gradient: 'from-green-500 to-teal-500',
      path: '/reports/flow-analysis/career-path',
      features: [
        '典型的なキャリアパスの特定',
        '昇進・昇格パターンの分析',
        'キャリア停滞リスクの検出'
      ]
    },
    {
      id: 'mobility-matrix',
      title: '人材モビリティマトリックス',
      description: '職位・職種間の移動可能性を評価し、戦略的な人材配置を支援',
      icon: '📊',
      gradient: 'from-orange-500 to-red-500',
      path: '/reports/flow-analysis/mobility-matrix',
      features: [
        '職位・職種間の移動実績',
        'スキル転換の可能性評価',
        '最適配置の提案'
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
      <CommonHeader title="人材フロー分析" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* カテゴリー説明 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🔄</span>
            <h1 className="text-2xl font-bold text-gray-900">人材フロー分析</h1>
          </div>
          <p className="text-gray-600">
            組織内の人材の動きを多角的に分析し、効果的な人材配置とキャリア開発を支援します。
            部署間の異動パターン、キャリアパスの傾向、人材の流動性などを可視化し、
            組織の活性化と職員の成長を促進する施策立案に活用できます。
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
      </div>
      
      <ScrollToTopButton />
      <BackToReportsButton />
      <DashboardButton />
    </div>
  );
}