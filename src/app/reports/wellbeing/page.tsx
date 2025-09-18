'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import FacilitySelector from '@/components/reports/FacilitySelector';
import CommonHeader from '@/components/CommonHeader';
import CategoryReportCard from '@/components/reports/CategoryReportCard';

export default function WellbeingCategoryPage() {
  const router = useRouter();
  const [selectedFacility, setSelectedFacility] = useState('');

  const reports = [
    {
      id: 'wellbeing-index',
      title: 'ウェルビ�Eイング総合持E��E,
      description: '身体的・精神的・社会的健康を総合皁E��評価し、絁E���E健康度を可視化',
      icon: '💚',
      gradient: 'from-green-500 to-teal-500',
      path: '/reports/wellbeing/wellbeing-index',
      features: [
        '6つの観点からの総合評価',
        '部署別・職種別の比輁E,
        '経年変化の追跡'
      ]
    },
    {
      id: 'stress-analysis',
      title: 'ストレス要因刁E��',
      description: '職場のストレス要因を特定し、メンタルヘルス対策を支援',
      icon: '🧠',
      gradient: 'from-purple-500 to-indigo-500',
      path: '/reports/wellbeing/stress-analysis',
      features: [
        'ストレス要因の特宁E,
        '高リスク老E�E早期発要E,
        '部署別のリスク評価'
      ]
    },
    {
      id: 'work-life-balance',
      title: 'ワークライフバランス評価',
      description: '労働時間、有給取得率、�Eライベ�Eト�E実度から働き方を�E极E,
      icon: '⚖︁E,
      gradient: 'from-blue-500 to-cyan-500',
      path: '/reports/wellbeing/work-life-balance',
      features: [
        '労働時間�E適正性評価',
        '有給取得状況�E刁E��',
        'ライフイベントへの対忁E
      ]
    },
    {
      id: 'engagement-survey',
      title: 'エンゲージメント調査',
      description: '職員の仕事への熱意�E絁E��へのコミットメントを測宁E,
      icon: '❤�E�E,
      gradient: 'from-red-500 to-pink-500',
      path: '/reports/wellbeing/engagement-survey',
      features: [
        'エンゲージメントスコア',
        '推奨度�E�ENPS�E��E測宁E,
        '改喁E��クションの提桁E
      ]
    },
    {
      id: 'intervention-program',
      title: '介�Eプログラム効果測宁E,
      description: 'ウェルビ�Eイング向上施策�E効果を定量皁E��評価',
      icon: '📈',
      gradient: 'from-orange-500 to-amber-500',
      path: '/reports/wellbeing/intervention-program',
      features: [
        '施策前後�E比輁E,
        'ROIの算�E',
        '次期施策�E提桁E
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
      <CommonHeader title="ウェルビ�Eイング刁E��" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* カチE��リー説昁E*/}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">💚</span>
            <h1 className="text-2xl font-bold text-gray-900">ウェルビ�Eイング刁E��</h1>
          </div>
          <p className="text-gray-600">
            職員の忁E��の健康と幸福度を多角的に刁E��し、働きやすい職場環墁E�E実現を支援します、E
            ストレス要因の特定、ワークライフバランスの評価、エンゲージメント�E測定などを通じて、E
            職員が生き生きと働ける絁E��づくりのための具体的な施策を提案します、E
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
            総合皁E��ェルビ�Eイング評価アセスメンチE
          </h3>
          
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="text-blue-800 mb-3">
              <span className="font-medium">推奨フロー�E�E/span>
              ウェルビ�Eイング総合持E��EↁEストレス要因刁E�� ↁEエンゲージメント調査 ↁE介�Eプログラム効果測宁E
            </div>
            <ul className="list-disc list-inside text-blue-700 space-y-1">
              <li>多面皁E��健康・幸福度の現状把握</li>
              <li>ストレス要因の特定と早期介�E</li>
              <li>絁E��へのコミットメント測宁E/li>
              <li>ウェルビ�Eイング向上施策�E効果検証</li>
            </ul>
          </div>

          <div className="mt-4 text-blue-800 text-sm">
            <p className="font-medium">
              匁E��皁E��ウェルビ�Eイング刁E��により、�E員の忁E��の健康と絁E��パフォーマンスの向上を実現できます、E
            </p>
          </div>
        </div>
      </div></div>
  );
}