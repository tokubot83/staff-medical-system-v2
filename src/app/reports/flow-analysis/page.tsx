'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import FacilitySelector from '@/components/reports/FacilitySelector';
import CommonHeader from '@/components/CommonHeader';
import CategoryReportCard from '@/components/reports/CategoryReportCard';

export default function FlowAnalysisCategoryPage() {
  const router = useRouter();
  const [selectedFacility, setSelectedFacility] = useState('');

  const reports = [
    {
      id: 'department-flow',
      title: '部署間異動フロー',
      description: '部署間�E人材移動パターンを可視化し、絁E���Eの人材流動性を�E极E,
      icon: '🔄',
      gradient: 'from-indigo-500 to-purple-500',
      path: '/reports/flow-analysis/department-flow',
      features: [
        'Sankeyダイアグラムによる可視化',
        '部署別の流�E・流�E統訁E,
        '異動パターンの傾向�E极E
      ]
    },
    {
      id: 'career-path',
      title: 'キャリアパス刁E��',
      description: '職員のキャリア形成パターンを�E析し、効果的なキャリア開発を支援',
      icon: '📈',
      gradient: 'from-green-500 to-teal-500',
      path: '/reports/flow-analysis/career-path',
      features: [
        '典型的なキャリアパスの特宁E,
        '昁E��・昁E��パターンの刁E��',
        'キャリア停滞リスクの検�E'
      ]
    },
    {
      id: 'mobility-matrix',
      title: '人材モビリチE��マトリチE��ス',
      description: '職位�E職種間�E移動可能性を評価し、戦略皁E��人材�E置を支援',
      icon: '📊',
      gradient: 'from-orange-500 to-red-500',
      path: '/reports/flow-analysis/mobility-matrix',
      features: [
        '職位�E職種間�E移動実績',
        'スキル転換�E可能性評価',
        '最適配置の提桁E
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
      <CommonHeader title="人材フロー刁E��" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* カチE��リー説昁E*/}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🔄</span>
            <h1 className="text-2xl font-bold text-gray-900">人材フロー刁E��</h1>
          </div>
          <p className="text-gray-600">
            絁E���Eの人材�E動きを多角的に刁E��し、効果的な人材�E置とキャリア開発を支援します、E
            部署間�E異動パターン、キャリアパスの傾向、人材�E流動性などを可視化し、E
            絁E���E活性化と職員の成長を俁E��する施策立案に活用できます、E
          </p>
        </div>

        {/* 施設選抁E*/}
        <div className="mb-8">
          <FacilitySelector
            selectedFacility={selectedFacility}
            onFacilityChange={setSelectedFacility}
          />
        </div>

        {/* レポ�Eト一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <CategoryReportCard
              key={report.id}
              {...report}
              onClick={() => handleReportClick(report.path)}
            />
          ))}
        </div>

        {/* アセスメントパターン */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-6">
            人材流動性アセスメンチE
          </h3>
          
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="text-blue-800 mb-3">
              <span className="font-medium">推奨フロー�E�E/span>
              部署間フロー ↁEキャリアパス刁E�� ↁEモビリチE��マトリチE��ス
            </div>
            <ul className="list-disc list-inside text-blue-700 space-y-1">
              <li>絁E���Eの人材移動パターン把握</li>
              <li>キャリア成長経路の可視化</li>
              <li>異動による能力開発効极E/li>
              <li>適材適所の実現度評価</li>
            </ul>
          </div>

          <div className="mt-4 text-blue-800 text-sm">
            <p className="font-medium">
              人材フローの刁E��により、絁E���E活性化と職員の成長機会�E創出を実現できます、E
            </p>
          </div>
        </div>
      </div></div>
  );
}