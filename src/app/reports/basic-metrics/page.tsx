'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import FacilitySelector from '@/components/reports/FacilitySelector';
import BreadcrumbBar from '@/components/navigation/BreadcrumbBar';
import Link from 'next/link';
const reports = [
  {
    id: 'real-time-dashboard',
    title: 'リアルタイムダッシュボード',
    path: '/reports/basic-metrics/real-time-dashboard',
    description: '出勤状況、シフト充足率、緊急対応力をリアルタイムで監視します',
    icon: '📡',
    bgColor: 'bg-green-500'
  },
  {
    id: 'predictive-analytics',
    title: '予測的人員分析',
    path: '/reports/basic-metrics/predictive-analytics',
    description: 'AI活用による需要予測、欠勤予測、採用必要数を分析します',
    icon: '🔮',
    bgColor: 'bg-purple-500'
  },
  {
    id: 'diversity-inclusion',
    title: 'ダイバーシティ＆インクルージョン',
    path: '/reports/basic-metrics/diversity-inclusion',
    description: '性別、年齢、国籍の多様性と障がい者雇用状況を確認します',
    icon: '🌈',
    bgColor: 'bg-indigo-500'
  },
  {
    id: 'compliance',
    title: 'コンプライアンス指標',
    path: '/reports/basic-metrics/compliance',
    description: '労働法規、資格要件、安全衛生の遵守状況を管理します',
    icon: '⚖️',
    bgColor: 'bg-blue-500'
  },
  {
    id: 'productivity',
    title: '生産性指標',
    path: '/reports/basic-metrics/productivity',
    description: '一人当たり売上、付加価値分析、イノベーション指標を確認します',
    icon: '⚡',
    bgColor: 'bg-yellow-500'
  },
  {
    id: 'engagement',
    title: 'エンゲージメント指標',
    path: '/reports/basic-metrics/engagement',
    description: '従業員満足度、eNPS、定着意向、モチベーションを測定します',
    icon: '💗',
    bgColor: 'bg-pink-500'
  },
  {
    id: 'cost-analysis',
    title: 'コスト分析指標',
    path: '/reports/basic-metrics/cost-analysis',
    description: '人件費率、採用コスト、教育投資ROI、離職コストを分析します',
    icon: '💰',
    bgColor: 'bg-orange-500'
  },
  {
    id: 'benchmark',
    title: 'ベンチマーク指標',
    path: '/reports/basic-metrics/benchmark',
    description: '業界比較、地域比較、ベストプラクティス分析を行います',
    icon: '🏆',
    bgColor: 'bg-cyan-500'
  },
  {
    id: 'integrated-assessment',
    title: '統合的指標アセスメント',
    path: '/reports/basic-metrics/integrated-assessment',
    description: 'KPI統合管理、予測アラート、バランススコアカードを提供します',
    icon: '🎯',
    bgColor: 'bg-red-500'
  },
  {
    id: 'two-axis-evaluation',
    title: '2軸評価分析',
    path: '/reports/two-axis-evaluation',
    description: '施設内評価と法人内評価による多角的な人事評価分析を行います',
    icon: '📐',
    bgColor: 'bg-purple-600'
  },
  {
    id: 'basic',
    title: '基本統計',
    path: '/reports/basic-metrics/basic-statistics',
    description: '総職員数、部門別人員構成など基本的な統計データを確認します',
    icon: '📊',
    bgColor: 'bg-gray-500'
  },
  {
    id: 'quality',
    title: '人材の質',
    path: '/reports/basic-metrics/talent-quality',
    description: '職員満足度、スキル評価、資格保有状況を分析します',
    icon: '⭐',
    bgColor: 'bg-gray-500'
  },
  {
    id: 'growth',
    title: '人材の成長',
    path: '/reports/basic-metrics/talent-growth',
    description: '研修受講率、スキル向上度、キャリア開発状況を確認します',
    icon: '📈',
    bgColor: 'bg-gray-500'
  },
  {
    id: 'risk',
    title: 'リスク管理',
    path: '/reports/basic-metrics/risk-management',
    description: '離職リスク、コンプライアンス、要注意職員の状況を管理します',
    icon: '⚠️',
    bgColor: 'bg-gray-500'
  },
  {
    id: 'efficiency',
    title: '組織効率',
    path: '/reports/basic-metrics/organizational-efficiency',
    description: '労働生産性、業務効率、緊急対応事項を確認します',
    icon: '🚀',
    bgColor: 'bg-gray-500'
  }
];

function BasicMetricsPageContent() {
  const searchParams = useSearchParams();
  const selectedFacility = searchParams.get('facility') || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <BreadcrumbBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* カテゴリヘッダー */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">📊</span>
            <h1 className="text-2xl font-bold text-gray-900">基本指標</h1>
          </div>
          <p className="text-gray-600">
            職員数、構成比、採用・離職などの基本的な人事指標を確認します。
            組織の現状を数値で把握し、経営判断の基礎となるデータを提供します。
          </p>
        </div>

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
            基本指標モニタリングアセスメント
          </h3>
          
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="text-blue-800 mb-3">
              <span className="font-medium">推奨フロー：</span>
              リアルタイムダッシュボード → 基本統計 → エンゲージメント指標 → 統合的指標アセスメント
            </div>
            <ul className="list-disc list-inside text-blue-700 space-y-1">
              <li>組織の現状を数値で定期的にモニタリング</li>
              <li>前年同期比や他施設との比較分析</li>
              <li>経営判断の基礎となるデータ提供</li>
              <li>採用計画や人員配置の最適化支援</li>
            </ul>
          </div>

          <div className="mt-4 text-blue-800 text-sm">
            <p className="font-medium">
              基本指標の継続的なモニタリングにより、組織の健全性を把握し、戦略的な経営判断を支援できます。
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