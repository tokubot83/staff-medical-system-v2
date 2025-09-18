'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import FacilitySelector from '@/components/reports/FacilitySelector';
import CategoryReportCard from '@/components/reports/CategoryReportCard';
export default function TalentMappingCategoryPage() {
  const router = useRouter();
  const [selectedFacility, setSelectedFacility] = useState('');

  const reports = [
    {
      id: 'talent-grid',
      title: '9ボックスグリッド分析',
      description: 'パフォーマンスとポテンシャルの2軸で人材を可視化し、スター人材・高ポテンシャル人材を特定',
      icon: '💎',
      gradient: 'from-purple-500 to-pink-500',
      path: '/reports/talent-mapping/talent-grid',
      features: [
        '9つのカテゴリーで人材を分類',
        'スター人材の特定と育成提案',
        '部署別の人材分布状況'
      ]
    },
    {
      id: 'skill-matrix',
      title: 'スキルマトリックス',
      description: '職員のスキル・資格・経験を多角的に評価し、組織の強みと改善点を可視化',
      icon: '🎯',
      gradient: 'from-blue-500 to-cyan-500',
      path: '/reports/talent-mapping/skill-matrix',
      features: [
        'スキルギャップ分析',
        '資格取得状況の把握',
        '教育ニーズの特定'
      ]
    },
    {
      id: 'succession-planning',
      title: '後継者計画',
      description: 'キーポジションの後継者候補を特定し、計画的な人材育成を支援',
      icon: '👥',
      gradient: 'from-green-500 to-emerald-500',
      path: '/reports/talent-mapping/succession-planning',
      features: [
        'キーポジションの特定',
        '後継者候補の評価',
        '育成計画の提案'
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* カテゴリー説明 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">💎</span>
            <h1 className="text-2xl font-bold text-gray-900">タレントマッピング</h1>
          </div>
          <p className="text-gray-600">
            組織の人材を多角的に評価・分析し、戦略的な人材配置と育成を支援します。
            パフォーマンスとポテンシャルの評価、スキルの可視化、後継者計画など、
            人材の現状と将来性を総合的に把握できます。
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

        {/* アセスメントパターン */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-6">
            戦略的人材配置アセスメント
          </h3>
          
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="text-blue-800 mb-3">
              <span className="font-medium">推奨フロー：</span>
              9ボックスグリッド → スキルマトリックス → 後継者計画
            </div>
            <ul className="list-disc list-inside text-blue-700 space-y-1">
              <li>高ポテンシャル人材の特定と戦略的配置</li>
              <li>組織全体のスキル現状把握とギャップ分析</li>
              <li>キーポジションの後継者育成計画</li>
              <li>人材ポートフォリオの最適化</li>
            </ul>
          </div>

          <div className="mt-4 text-blue-800 text-sm">
            <p className="font-medium">
              タレントマッピングにより、組織の人材資産を可視化し、戦略的な人材活用と育成を実現できます。
            </p>
          </div>
        </div>
      </div></div>
  );
}