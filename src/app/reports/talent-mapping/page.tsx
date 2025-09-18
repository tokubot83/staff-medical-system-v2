'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import FacilitySelector from '@/components/reports/FacilitySelector';
import CommonHeader from '@/components/CommonHeader';
import CategoryReportCard from '@/components/reports/CategoryReportCard';

export default function TalentMappingCategoryPage() {
  const router = useRouter();
  const [selectedFacility, setSelectedFacility] = useState('');

  const reports = [
    {
      id: 'talent-grid',
      title: '9ボックスグリチE��刁E��',
      description: 'パフォーマンスとポテンシャルの2軸で人材を可視化し、スター人材�E高�EチE��シャル人材を特宁E,
      icon: '💎',
      gradient: 'from-purple-500 to-pink-500',
      path: '/reports/talent-mapping/talent-grid',
      features: [
        '9つのカチE��リーで人材を刁E��E,
        'スター人材�E特定と育成提桁E,
        '部署別の人材�E币E��況E
      ]
    },
    {
      id: 'skill-matrix',
      title: 'スキルマトリチE��ス',
      description: '職員のスキル・賁E��・経験を多角的に評価し、絁E���E強みと改喁E��を可視化',
      icon: '🎯',
      gradient: 'from-blue-500 to-cyan-500',
      path: '/reports/talent-mapping/skill-matrix',
      features: [
        'スキルギャチE�E刁E��',
        '賁E��取得状況�E把握',
        '教育ニ�Eズの特宁E
      ]
    },
    {
      id: 'succession-planning',
      title: '後継老E��画',
      description: 'キーポジションの後継老E��補を特定し、計画皁E��人材育成を支援',
      icon: '👥',
      gradient: 'from-green-500 to-emerald-500',
      path: '/reports/talent-mapping/succession-planning',
      features: [
        'キーポジションの特宁E,
        '後継老E��補�E評価',
        '育成計画の提桁E
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
      <CommonHeader title="タレント�EチE��ング" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* カチE��リー説昁E*/}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">💎</span>
            <h1 className="text-2xl font-bold text-gray-900">タレント�EチE��ング</h1>
          </div>
          <p className="text-gray-600">
            絁E���E人材を多角的に評価・刁E��し、戦略皁E��人材�E置と育成を支援します、E
            パフォーマンスとポテンシャルの評価、スキルの可視化、後継老E��画など、E
            人材�E現状と封E��性を総合皁E��把握できます、E
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
            戦略皁E��材�E置アセスメンチE
          </h3>
          
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="text-blue-800 mb-3">
              <span className="font-medium">推奨フロー�E�E/span>
              9ボックスグリチE�� ↁEスキルマトリチE��ス ↁE後継老E��画
            </div>
            <ul className="list-disc list-inside text-blue-700 space-y-1">
              <li>高�EチE��シャル人材�E特定と戦略皁E�E置</li>
              <li>絁E���E体�Eスキル現状把握とギャチE�E刁E��</li>
              <li>キーポジションの後継老E��成計画</li>
              <li>人材�Eートフォリオの最適匁E/li>
            </ul>
          </div>

          <div className="mt-4 text-blue-800 text-sm">
            <p className="font-medium">
              タレント�EチE��ングにより、絁E���E人材賁E��を可視化し、戦略皁E��人材活用と育成を実現できます、E
            </p>
          </div>
        </div>
      </div></div>
  );
}