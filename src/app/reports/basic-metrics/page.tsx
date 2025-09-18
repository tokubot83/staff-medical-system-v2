'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import FacilitySelector from '@/components/reports/FacilitySelector';
import Link from 'next/link';
const reports = [
  {
    id: 'real-time-dashboard',
    title: 'リアルタイムダチE��ュボ�EチE,
    path: '/reports/basic-metrics/real-time-dashboard',
    description: '出勤状況、シフト允E��玁E��緊急対応力をリアルタイムで監視しまぁE,
    icon: '📡',
    bgColor: 'bg-green-500'
  },
  {
    id: 'predictive-analytics',
    title: '予測皁E��員刁E��',
    path: '/reports/basic-metrics/predictive-analytics',
    description: 'AI活用による需要予測、欠勤予測、採用忁E��数を�E析しまぁE,
    icon: '🔮',
    bgColor: 'bg-purple-500'
  },
  {
    id: 'diversity-inclusion',
    title: 'ダイバ�EシチE���E�E��ンクルージョン',
    path: '/reports/basic-metrics/diversity-inclusion',
    description: '性別、年齢、国籍�E多様性と障がぁE��E��用状況を確認しまぁE,
    icon: '🌈',
    bgColor: 'bg-indigo-500'
  },
  {
    id: 'compliance',
    title: 'コンプライアンス持E��E,
    path: '/reports/basic-metrics/compliance',
    description: '労働法規、賁E��要件、安�E衛生の遵守状況を管琁E��まぁE,
    icon: '⚖︁E,
    bgColor: 'bg-blue-500'
  },
  {
    id: 'productivity',
    title: '生産性持E��E,
    path: '/reports/basic-metrics/productivity',
    description: '一人当たり売上、付加価値刁E��、イノ�Eーション持E��を確認しまぁE,
    icon: '⚡',
    bgColor: 'bg-yellow-500'
  },
  {
    id: 'engagement',
    title: 'エンゲージメント指樁E,
    path: '/reports/basic-metrics/engagement',
    description: '従業員満足度、eNPS、定着意向、モチ�Eーションを測定しまぁE,
    icon: '💗',
    bgColor: 'bg-pink-500'
  },
  {
    id: 'cost-analysis',
    title: 'コスト�E析指樁E,
    path: '/reports/basic-metrics/cost-analysis',
    description: '人件費玁E��採用コスト、教育投資ROI、E��職コストを刁E��しまぁE,
    icon: '💰',
    bgColor: 'bg-orange-500'
  },
  {
    id: 'benchmark',
    title: 'ベンチ�Eーク持E��E,
    path: '/reports/basic-metrics/benchmark',
    description: '業界比輁E��地域比輁E���Eスト�EラクチE��ス刁E��を行いまぁE,
    icon: '🏆',
    bgColor: 'bg-cyan-500'
  },
  {
    id: 'integrated-assessment',
    title: '統合的持E��アセスメンチE,
    path: '/reports/basic-metrics/integrated-assessment',
    description: 'KPI統合管琁E��予測アラート、バランススコアカードを提供しまぁE,
    icon: '🎯',
    bgColor: 'bg-red-500'
  },
  {
    id: 'two-axis-evaluation',
    title: '2軸評価刁E��',
    path: '/reports/two-axis-evaluation',
    description: '施設冁E��価と法人冁E��価による多角的な人事評価刁E��を行いまぁE,
    icon: '📐',
    bgColor: 'bg-purple-600'
  },
  {
    id: 'basic',
    title: '基本統訁E,
    path: '/reports/basic-metrics/basic-statistics',
    description: '総�E員数、E��門別人員構�Eなど基本皁E��統計データを確認しまぁE,
    icon: '📊',
    bgColor: 'bg-gray-500'
  },
  {
    id: 'quality',
    title: '人材�E質',
    path: '/reports/basic-metrics/talent-quality',
    description: '職員満足度、スキル評価、賁E��保有状況を刁E��しまぁE,
    icon: '⭁E,
    bgColor: 'bg-gray-500'
  },
  {
    id: 'growth',
    title: '人材�E成長',
    path: '/reports/basic-metrics/talent-growth',
    description: '研修受講率、スキル向上度、キャリア開発状況を確認しまぁE,
    icon: '📈',
    bgColor: 'bg-gray-500'
  },
  {
    id: 'risk',
    title: 'リスク管琁E,
    path: '/reports/basic-metrics/risk-management',
    description: '離職リスク、コンプライアンス、要注意�E員の状況を管琁E��まぁE,
    icon: '⚠�E�E,
    bgColor: 'bg-gray-500'
  },
  {
    id: 'efficiency',
    title: '絁E��効玁E,
    path: '/reports/basic-metrics/organizational-efficiency',
    description: '労働生産性、業務効玁E��緊急対応事頁E��確認しまぁE,
    icon: '🚀',
    bgColor: 'bg-gray-500'
  }
];

function BasicMetricsPageContent() {
  const searchParams = useSearchParams();
  const selectedFacility = searchParams.get('facility') || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="基本持E��E />
      
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
            基本持E��モニタリングアセスメンチE
          </h3>
          
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="text-blue-800 mb-3">
              <span className="font-medium">推奨フロー�E�E/span>
              リアルタイムダチE��ュボ�EチEↁE基本統訁EↁEエンゲージメント指樁EↁE統合的持E��アセスメンチE
            </div>
            <ul className="list-disc list-inside text-blue-700 space-y-1">
              <li>絁E���E現状を数値で定期皁E��モニタリング</li>
              <li>前年同期比や他施設との比輁E�E极E/li>
              <li>経営判断の基礎となるデータ提侁E/li>
              <li>採用計画めE��員配置の最適化支援</li>
            </ul>
          </div>

          <div className="mt-4 text-blue-800 text-sm">
            <p className="font-medium">
              基本持E���E継続的なモニタリングにより、絁E���E健全性を把握し、戦略皁E��経営判断を支援できます、E
            </p>
          </div>
        </div>
      </div></div>
  );
}

export default function BasicMetricsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BasicMetricsPageContent />
    </Suspense>
  );
}