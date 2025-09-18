'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import FacilitySelector from '@/components/reports/FacilitySelector';
import Link from 'next/link';
import ScrollToTopButton from '@/components/ScrollToTopButton';

const reports = [
  {
    id: 'hr-strategy',
    title: '人事管理戦略分析',
    path: '/reports/hr-strategy',
    description: '組織の人事管理戦略を総合的に分析し、改善提案を提供します',
    icon: '📊',
    bgColor: 'bg-blue-500'
  },
  {
    id: 'work-life-balance',
    title: 'ワークライフバランス分析',
    path: '/reports/work-life-balance',
    description: '職員の労働時間、休暇取得状況、ストレス指標を分析します',
    icon: '⚖️',
    bgColor: 'bg-green-500'
  },
  {
    id: 'talent-development',
    title: '職種別人材育成戦略',
    path: '/reports/talent-development',
    description: '職種ごとの育成計画とキャリアパス分析を行います',
    icon: '🎯',
    bgColor: 'bg-purple-500'
  },
  {
    id: 'organization-optimization',
    title: '組織構造最適化分析',
    path: '/reports/organization-optimization',
    description: '部門別の人員配置と組織効率を分析します',
    icon: '🏢',
    bgColor: 'bg-indigo-500'
  },
  {
    id: 'work-environment',
    title: '労働環境改善戦略',
    path: '/reports/work-environment',
    description: '職場環境の課題を特定し、改善策を提案します',
    icon: '🌟',
    bgColor: 'bg-yellow-500'
  },
  {
    id: 'cost-optimization',
    title: '人件費最適化分析',
    path: '/reports/cost-optimization',
    description: '人件費の詳細分析と最適化提案を行います',
    icon: '💰',
    bgColor: 'bg-red-500'
  },
  {
    id: 'recruitment-effectiveness',
    title: '採用効果分析',
    path: '/reports/recruitment-effectiveness',
    description: '採用活動の効果測定と改善提案を提供します',
    icon: '🎯',
    bgColor: 'bg-teal-500'
  },
  {
    id: 'turnover-risk',
    title: '離職リスク予測',
    path: '/reports/turnover-risk',
    description: 'データ分析による離職リスクの予測と対策を提案します',
    icon: '⚠️',
    bgColor: 'bg-orange-500'
  },
  {
    id: 'skill-qualification',
    title: 'スキル・資格管理分析',
    path: '/reports/skill-qualification',
    description: '職員のスキルと資格の現状分析と育成計画を策定します',
    icon: '📜',
    bgColor: 'bg-pink-500'
  }
];

function StrategicAnalysisPageContent() {
  const searchParams = useSearchParams();
  const selectedFacility = searchParams.get('facility') || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="戦略分析" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 施設選択 */}
        <div className="mb-8">
          <FacilitySelector
            selectedFacility={selectedFacility}
            onFacilityChange={() => {}}
          />
        </div>

        {/* レポート一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => {
            const url = selectedFacility 
              ? `${report.path}?facility=${encodeURIComponent(selectedFacility)}`
              : report.path;
            
            return (
              <Link key={report.id} className="block" href={url}>
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 h-full">
                  <div className="flex items-center mb-4">
                    <div className={`${report.bgColor} text-white rounded-lg p-3 text-2xl`}>
                      {report.icon}
                    </div>
                    <h3 className="ml-4 text-lg font-semibold text-gray-900">{report.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{report.description}</p>
                  <div className="mt-auto flex items-center text-blue-600">
                    <span className="text-sm">レポートを見る</span>
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* アセスメントパターン */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-6">
            戦略的人材分析アセスメント
          </h3>
          
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="text-blue-800 mb-3">
              <span className="font-medium">推奨フロー：</span>
              人事管理戦略 → スキル・資格管理 → 採用効果分析 → 組織構造最適化
            </div>
            <ul className="list-disc list-inside text-blue-700 space-y-1">
              <li>中長期的な人材戦略の立案とKPI設定</li>
              <li>組織の競争力強化に必要な施策特定</li>
              <li>人材投資の優先順位付けとROI評価</li>
              <li>経営戦略と人材戦略の整合性確保</li>
            </ul>
          </div>

          <div className="mt-4 text-blue-800 text-sm">
            <p className="font-medium">
              戦略分析により、データに基づく人材マネジメントと持続的な組織成長を実現できます。
            </p>
          </div>
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  );
}

export default function StrategicAnalysisPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StrategicAnalysisPageContent />
    </Suspense>
  );
}