'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FacilitySelector from '@/components/reports/FacilitySelector';
import BreadcrumbBar from '@/components/navigation/BreadcrumbBar';
const categories = [
  {
    id: 'basic',
    label: '基本持E��E,
    icon: '📊',
    description: '職員数、構�E比、採用・離職などの基本皁E��人事指標を確誁E,
    gradient: 'from-blue-500 to-cyan-500',
    path: '/reports/basic-metrics',
    hasDetailPages: true
  },
  {
    id: 'strategic',
    label: '戦略刁E��',
    icon: '📈',
    description: '人材戦略の立案に忁E��な高度な刁E��とインサイトを提侁E,
    gradient: 'from-purple-500 to-pink-500',
    path: '/reports/strategic-analysis',
    hasDetailPages: true
  },
  {
    id: 'retention',
    label: '定着刁E��',
    icon: '🎯',
    description: '職員の定着玁E��上に向けた詳細な刁E��とアクションプランを提示',
    gradient: 'from-green-500 to-emerald-500',
    path: '/reports/retention',
    hasDetailPages: true
  },
  {
    id: 'turnover',
    label: '離職刁E��',
    icon: '📉',
    description: '離職リスクの早期発見と予防策�E立案を支援',
    gradient: 'from-red-500 to-orange-500',
    path: '/reports/turnover',
    hasDetailPages: true
  },
  {
    id: 'talent-mapping',
    label: 'タレント�EチE��ング',
    icon: '💎',
    description: '人材�E可視化と戦略皁E��配置・育成を支援',
    gradient: 'from-yellow-500 to-amber-500',
    path: '/reports/talent-mapping',
    hasDetailPages: true
  },
  {
    id: 'flow-analysis',
    label: '人材フロー',
    icon: '🔄',
    description: '絁E���Eの人材�E動きを�E析し、最適な配置を提桁E,
    gradient: 'from-indigo-500 to-purple-500',
    path: '/reports/flow-analysis',
    hasDetailPages: true
  },
  {
    id: 'cohort-analysis',
    label: 'コホ�Eト�E极E,
    icon: '📊',
    description: '世代・入社年次別の傾向�E析と施策効果測宁E,
    gradient: 'from-teal-500 to-cyan-500',
    path: '/reports/cohort-analysis',
    hasDetailPages: true
  },
  {
    id: 'simulation',
    label: 'シミュレーション',
    icon: '🔮',
    description: 'What-if刁E��による封E��予測と最適解の探索',
    gradient: 'from-pink-500 to-rose-500',
    path: '/reports/simulation',
    hasDetailPages: true
  },
  {
    id: 'wellbeing',
    label: 'ウェルビ�Eイング',
    icon: '💚',
    description: '職員の忁E��の健康と幸福度を多角的に刁E��',
    gradient: 'from-green-500 to-teal-500',
    path: '/reports/wellbeing',
    hasDetailPages: true
  },
  {
    id: 'performance-evaluation',
    label: '人事評価刁E��',
    icon: '🎲',
    description: 'スキルと成果の2軸評価など多角的な人事評価刁E��',
    gradient: 'from-cyan-500 to-blue-500',
    path: '/reports/performance-evaluation',
    hasDetailPages: true
  }
];

function ReportsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedFacility, setSelectedFacility] = useState('');

  // URLパラメータから施設を�E期化
  useEffect(() => {
    const facilityParam = searchParams.get('facility');
    
    if (facilityParam) {
      setSelectedFacility(facilityParam);
    }
  }, [searchParams]);

  // カチE��リクリチE��時�E処琁E
  const handleCategoryClick = (category: typeof categories[0]) => {
    // カチE��リペ�Eジへ遷移
    const url = selectedFacility 
      ? `${category.path}?facility=${encodeURIComponent(selectedFacility)}`
      : category.path;
    router.push(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BreadcrumbBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900">レポ�Eトセンター</h1>
          <p className="text-gray-600 mt-2">
            人事データの刁E��とレポ�Eト生成により、データドリブンな意思決定を支援しまぁE
          </p>
        </div>

        {/* 施設選抁E*/}
        <div className="mb-8">
          <FacilitySelector
            selectedFacility={selectedFacility}
            onFacilityChange={setSelectedFacility}
          />
        </div>

        {/* カチE��リ一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
            >
              <div className={`h-2 bg-gradient-to-r ${category.gradient}`} />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{category.icon}</span>
                  <h3 className="text-xl font-semibold">{category.label}</h3>
                </div>
                <p className="text-gray-600">{category.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 注意事頁E*/}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            レポ�Eト機�EにつぁE��
          </h3>
          <ul className="list-disc list-inside text-blue-800 space-y-1">
            <li>施設を選択すると、その施設に特化したレポ�Eトが生�EされまぁE/li>
            <li>全施設を選択した場合�E、医療法人全体�E統合レポ�Eトが生�EされまぁE/li>
            <li>吁E��ポ�Eト�EPDF形式でダウンロード可能でぁE/li>
            <li>レポ�Eト�E最新のチE�Eタに基づぁE��リアルタイムで生�EされまぁE/li>
          </ul>
        </div>
      </div></div>
  );
}

export default function ReportsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReportsPageContent />
    </Suspense>
  );
}