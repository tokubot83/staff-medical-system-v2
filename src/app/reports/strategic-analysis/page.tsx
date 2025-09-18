'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import FacilitySelector from '@/components/reports/FacilitySelector';
import Link from 'next/link';
const reports = [
  {
    id: 'hr-strategy',
    title: '人事管琁E��略刁E��',
    path: '/reports/hr-strategy',
    description: '絁E���E人事管琁E��略を総合皁E��刁E��し、改喁E��案を提供しまぁE,
    icon: '📊',
    bgColor: 'bg-blue-500'
  },
  {
    id: 'work-life-balance',
    title: 'ワークライフバランス刁E��',
    path: '/reports/work-life-balance',
    description: '職員の労働時間、休暇取得状況、ストレス持E��を刁E��しまぁE,
    icon: '⚖︁E,
    bgColor: 'bg-green-500'
  },
  {
    id: 'talent-development',
    title: '職種別人材育成戦略',
    path: '/reports/talent-development',
    description: '職種ごとの育成計画とキャリアパス刁E��を行いまぁE,
    icon: '🎯',
    bgColor: 'bg-purple-500'
  },
  {
    id: 'organization-optimization',
    title: '絁E��構造最適化�E极E,
    path: '/reports/organization-optimization',
    description: '部門別の人員配置と絁E��効玁E��刁E��しまぁE,
    icon: '🏢',
    bgColor: 'bg-indigo-500'
  },
  {
    id: 'work-environment',
    title: '労働環墁E��喁E��略',
    path: '/reports/work-environment',
    description: '職場環墁E�E課題を特定し、改喁E��を提案しまぁE,
    icon: '🌟',
    bgColor: 'bg-yellow-500'
  },
  {
    id: 'cost-optimization',
    title: '人件費最適化�E极E,
    path: '/reports/cost-optimization',
    description: '人件費の詳細刁E��と最適化提案を行いまぁE,
    icon: '💰',
    bgColor: 'bg-red-500'
  },
  {
    id: 'recruitment-effectiveness',
    title: '採用効果�E极E,
    path: '/reports/recruitment-effectiveness',
    description: '採用活動�E効果測定と改喁E��案を提供しまぁE,
    icon: '🎯',
    bgColor: 'bg-teal-500'
  },
  {
    id: 'turnover-risk',
    title: '離職リスク予測',
    path: '/reports/turnover-risk',
    description: 'チE�Eタ刁E��による離職リスクの予測と対策を提案しまぁE,
    icon: '⚠�E�E,
    bgColor: 'bg-orange-500'
  },
  {
    id: 'skill-qualification',
    title: 'スキル・賁E��管琁E�E极E,
    path: '/reports/skill-qualification',
    description: '職員のスキルと賁E��の現状刁E��と育成計画を策定しまぁE,
    icon: '📜',
    bgColor: 'bg-pink-500'
  }
];

function StrategicAnalysisPageContent() {
  const searchParams = useSearchParams();
  const selectedFacility = searchParams.get('facility') || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="戦略刁E��" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 施設選抁E*/}
        <div className="mb-8">
          <FacilitySelector
            selectedFacility={selectedFacility}
            onFacilityChange={() => {}}
          />
        </div>

        {/* レポ�Eト一覧 */}
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
                    <span className="text-sm">レポ�Eトを見る</span>
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
            戦略皁E��材�E析アセスメンチE
          </h3>
          
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="text-blue-800 mb-3">
              <span className="font-medium">推奨フロー�E�E/span>
              人事管琁E��略 ↁEスキル・賁E��管琁EↁE採用効果�E极EↁE絁E��構造最適匁E
            </div>
            <ul className="list-disc list-inside text-blue-700 space-y-1">
              <li>中長期的な人材戦略の立案とKPI設宁E/li>
              <li>絁E���E競争力強化に忁E��な施策特宁E/li>
              <li>人材投賁E�E優先頁E��付けとROI評価</li>
              <li>経営戦略と人材戦略の整合性確俁E/li>
            </ul>
          </div>

          <div className="mt-4 text-blue-800 text-sm">
            <p className="font-medium">
              戦略刁E��により、データに基づく人材�Eネジメントと持続的な絁E���E長を実現できます、E
            </p>
          </div>
        </div>
      </div></div>
  );
}

export default function StrategicAnalysisPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StrategicAnalysisPageContent />
    </Suspense>
  );
}