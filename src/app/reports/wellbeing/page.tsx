'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import FacilitySelector from '@/components/reports/FacilitySelector';
import CommonHeader from '@/components/CommonHeader';
import DashboardButton from '@/components/DashboardButton';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import CategoryReportCard from '@/components/reports/CategoryReportCard';
import CategoryBackButton from '@/components/reports/CategoryBackButton';

export default function WellbeingCategoryPage() {
  const router = useRouter();
  const [selectedFacility, setSelectedFacility] = useState('');

  const reports = [
    {
      id: 'wellbeing-index',
      title: 'ウェルビーイング総合指標',
      description: '身体的・精神的・社会的健康を総合的に評価し、組織の健康度を可視化',
      icon: '💚',
      gradient: 'from-green-500 to-teal-500',
      path: '/reports/wellbeing/wellbeing-index',
      features: [
        '6つの観点からの総合評価',
        '部署別・職種別の比較',
        '経年変化の追跡'
      ]
    },
    {
      id: 'stress-analysis',
      title: 'ストレス要因分析',
      description: '職場のストレス要因を特定し、メンタルヘルス対策を支援',
      icon: '🧠',
      gradient: 'from-purple-500 to-indigo-500',
      path: '/reports/wellbeing/stress-analysis',
      features: [
        'ストレス要因の特定',
        '高リスク者の早期発見',
        '部署別のリスク評価'
      ]
    },
    {
      id: 'work-life-balance',
      title: 'ワークライフバランス評価',
      description: '労働時間、有給取得率、プライベート充実度から働き方を分析',
      icon: '⚖️',
      gradient: 'from-blue-500 to-cyan-500',
      path: '/reports/wellbeing/work-life-balance',
      features: [
        '労働時間の適正性評価',
        '有給取得状況の分析',
        'ライフイベントへの対応'
      ]
    },
    {
      id: 'engagement-survey',
      title: 'エンゲージメント調査',
      description: '職員の仕事への熱意・組織へのコミットメントを測定',
      icon: '❤️',
      gradient: 'from-red-500 to-pink-500',
      path: '/reports/wellbeing/engagement-survey',
      features: [
        'エンゲージメントスコア',
        '推奨度（eNPS）の測定',
        '改善アクションの提案'
      ]
    },
    {
      id: 'intervention-program',
      title: '介入プログラム効果測定',
      description: 'ウェルビーイング向上施策の効果を定量的に評価',
      icon: '📈',
      gradient: 'from-orange-500 to-amber-500',
      path: '/reports/wellbeing/intervention-program',
      features: [
        '施策前後の比較',
        'ROIの算出',
        '次期施策の提案'
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
      <CommonHeader title="ウェルビーイング分析" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* カテゴリー説明 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">💚</span>
            <h1 className="text-2xl font-bold text-gray-900">ウェルビーイング分析</h1>
          </div>
          <p className="text-gray-600">
            職員の心身の健康と幸福度を多角的に分析し、働きやすい職場環境の実現を支援します。
            ストレス要因の特定、ワークライフバランスの評価、エンゲージメントの測定などを通じて、
            職員が生き生きと働ける組織づくりのための具体的な施策を提案します。
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