'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import FacilitySelector from '@/components/reports/FacilitySelector';
import CommonHeader from '@/components/CommonHeader';
import DashboardButton from '@/components/DashboardButton';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import CategoryReportCard from '@/components/reports/CategoryReportCard';
import { BackToReportsButton } from '@/components/BackToReportsButton';

export default function CohortAnalysisCategoryPage() {
  const router = useRouter();
  const [selectedFacility, setSelectedFacility] = useState('');

  const reports = [
    {
      id: 'entry-year-cohort',
      title: '入社年次別コホート追跡',
      description: '入社年次別に職員の定着率・成長・キャリア形成を長期的に追跡分析',
      icon: '📅',
      gradient: 'from-blue-500 to-indigo-500',
      path: '/reports/cohort-analysis/entry-year-cohort',
      features: [
        '年次別定着率の推移',
        'パフォーマンスの経年変化',
        '離職要因の世代別分析'
      ]
    },
    {
      id: 'generation-analysis',
      title: '世代別特性分析',
      description: 'Z世代、ミレニアル世代など世代別の特性と組織適応を分析',
      icon: '👥',
      gradient: 'from-purple-500 to-pink-500',
      path: '/reports/cohort-analysis/generation-analysis',
      features: [
        '世代別の価値観・働き方',
        'エンゲージメントの違い',
        '世代間ギャップの可視化'
      ]
    },
    {
      id: 'department-cohort',
      title: '部署別コホート比較',
      description: '部署・職種別にコホートの特性を比較し、組織課題を特定',
      icon: '🏢',
      gradient: 'from-green-500 to-emerald-500',
      path: '/reports/cohort-analysis/department-cohort',
      features: [
        '部署別の定着率比較',
        '職種別のキャリアパス',
        '組織文化の影響分析'
      ]
    },
    {
      id: 'intervention-effect',
      title: '施策効果測定',
      description: '人事施策導入前後のコホート比較により、施策の効果を定量評価',
      icon: '📊',
      gradient: 'from-orange-500 to-amber-500',
      path: '/reports/cohort-analysis/intervention-effect',
      features: [
        '施策前後の比較分析',
        'ROIの算出',
        '改善提案の生成'
      ]
    },
    {
      id: 'performance-cohort',
      title: 'パフォーマンスコホート分析',
      description: 'パフォーマンスレベル別に職員を分類し、各群の特性・成長軌跡・定着率を分析',
      icon: '🎯',
      gradient: 'from-indigo-500 to-purple-500',
      path: '/reports/cohort-analysis/performance-cohort',
      features: [
        'パフォーマンス別定着率',
        '成長軌跡の可視化',
        'キャリア進展分析'
      ]
    },
    {
      id: 'life-event-cohort',
      title: 'ライフイベントコホート分析',
      description: '結婚・出産・介護などのライフイベントが職員の定着・パフォーマンスに与える影響を分析',
      icon: '🏠',
      gradient: 'from-pink-500 to-rose-500',
      path: '/reports/cohort-analysis/life-event-cohort',
      features: [
        'イベント別影響度分析',
        '回復期間の予測',
        '支援策の効果測定'
      ]
    },
    {
      id: 'learning-cohort',
      title: '学習・成長コホート分析',
      description: '研修参加パターン、資格取得、メンター制度利用など学習行動別の成長軌跡を分析',
      icon: '📚',
      gradient: 'from-emerald-500 to-teal-500',
      path: '/reports/cohort-analysis/learning-cohort',
      features: [
        '学習パターン別成果',
        '資格取得と昇進相関',
        'ROI分析'
      ]
    },
    {
      id: 'engagement-cohort',
      title: 'エンゲージメントコホート分析',
      description: 'エンゲージメント推移パターン別に職員を分類し、定着・パフォーマンスへの影響を分析',
      icon: '💖',
      gradient: 'from-red-500 to-orange-500',
      path: '/reports/cohort-analysis/engagement-cohort',
      features: [
        'エンゲージメント推移分析',
        '回復群の特定',
        '離職リスク予測'
      ]
    },
    {
      id: 'network-cohort',
      title: 'ネットワークコホート分析',
      description: '組織内ネットワークの中心性・つながりの数・影響力別に職員を分析',
      icon: '🔗',
      gradient: 'from-cyan-500 to-blue-500',
      path: '/reports/cohort-analysis/network-cohort',
      features: [
        'ネットワーク中心性分析',
        '影響力スコア算出',
        'コラボレーション効果'
      ]
    },
    {
      id: 'wellbeing-cohort',
      title: 'ウェルビーイングコホート分析',
      description: '健康状態・メンタルヘルス・ワークライフバランスに基づく職員の分類と分析',
      icon: '🌱',
      gradient: 'from-green-500 to-lime-500',
      path: '/reports/cohort-analysis/wellbeing-cohort',
      features: [
        '健康リスク群の特定',
        'ストレス要因分析',
        '介入効果測定'
      ]
    },
    {
      id: 'location-cohort',
      title: '地域・施設特性コホート',
      description: '都市部/地方、施設規模、転勤経験など立地・施設特性による職員の違いを分析',
      icon: '📍',
      gradient: 'from-violet-500 to-purple-500',
      path: '/reports/cohort-analysis/location-cohort',
      features: [
        '地域別定着率比較',
        '通勤時間影響分析',
        '転勤経験の効果'
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
      <CommonHeader title="コホート分析" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* カテゴリー説明 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">📊</span>
            <h1 className="text-2xl font-bold text-gray-900">コホート分析</h1>
          </div>
          <p className="text-gray-600">
            特定の属性を持つ職員グループ（コホート）を長期的に追跡し、
            組織における人材の成長・定着・離職のパターンを分析します。
            入社年次、世代、部署などの切り口で、組織の人材課題を深く理解し、
            効果的な人事施策の立案を支援します。
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
      </div>
      
      <ScrollToTopButton />
      <BackToReportsButton />
      <DashboardButton />
    </div>
  );
}