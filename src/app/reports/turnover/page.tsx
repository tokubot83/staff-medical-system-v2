'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import FacilitySelector from '@/components/reports/FacilitySelector';
const reports = [
  {
    id: 'risk-prediction',
    title: '離職リスク予測',
    path: '/reports/turnover/risk-prediction',
    description: 'AIを活用した個人別離職リスクの予測と早期警呁E,
    icon: '🎯',
    gradient: 'from-red-500 to-red-600'
  },
  {
    id: 'high-risk-dashboard',
    title: '高リスク老E��チE��ュボ�EチE,
    path: '/reports/turnover/high-risk-dashboard',
    description: '離職リスクの高い職員の一覧と詳細刁E��',
    icon: '⚠�E�E,
    gradient: 'from-orange-500 to-orange-600'
  },
  {
    id: 'factor-ranking',
    title: '離職要因ランキング',
    path: '/reports/turnover/factor-ranking',
    description: '離職に影響する要因を重要度頁E��ランキング',
    icon: '📊',
    gradient: 'from-purple-500 to-purple-600'
  },
  {
    id: 'correlation-analysis',
    title: '相関刁E��',
    path: '/reports/turnover/correlation-analysis',
    description: '離職と吁E��持E���E相関関係を可視化',
    icon: '📈',
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    id: 'predictive-modeling',
    title: '予測モチE��ング',
    path: '/reports/turnover/predictive-modeling',
    description: '機械学習による高精度な離職予測モチE��',
    icon: '🤁E,
    gradient: 'from-indigo-500 to-indigo-600'
  },
  {
    id: 'what-if-simulation',
    title: 'What-ifシミュレーション',
    path: '/reports/turnover/what-if-simulation',
    description: '施策実施時�E離職玁E��化をシミュレーション',
    icon: '🔮',
    gradient: 'from-pink-500 to-pink-600'
  },
  {
    id: 'retention-strategies',
    title: '定着戦略提桁E,
    path: '/reports/turnover/retention-strategies',
    description: '部署・職種別の効果的な定着施策を提桁E,
    icon: '💡',
    gradient: 'from-green-500 to-green-600'
  },
  {
    id: 'improvement-suggestions',
    title: '改喁E��策提桁E,
    path: '/reports/turnover/improvement-suggestions',
    description: 'チE�Eタに基づく�E体的な改喁E��クション',
    icon: '🎯',
    gradient: 'from-teal-500 to-teal-600'
  },
  {
    id: 'time-series-trend',
    title: '時系列トレンド�E极E,
    path: '/reports/turnover/time-series-trend',
    description: '離職玁E�E時系列変化とトレンド予測',
    icon: '📈',
    gradient: 'from-cyan-500 to-cyan-600'
  },
  {
    id: 'cost-impact',
    title: '離職コスト影響刁E��',
    path: '/reports/turnover/cost-impact',
    description: '離職による財務的影響とROI刁E��',
    icon: '💰',
    gradient: 'from-amber-500 to-amber-600'
  },
  {
    id: 'exit-feedback',
    title: '退職老E��ィードバチE��刁E��',
    path: '/reports/turnover/exit-feedback',
    description: '退職老E�E声から課題を抽出',
    icon: '💭',
    gradient: 'from-violet-500 to-violet-600'
  },
  {
    id: 'benchmark-best-practices',
    title: 'ベンチ�Eーク・ベスト�EラクチE��ス',
    path: '/reports/turnover/benchmark-best-practices',
    description: '業界トチE�Eパフォーマ�Eとの比輁E,
    icon: '🏆',
    gradient: 'from-emerald-500 to-emerald-600'
  }
];

function TurnoverPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedFacility = searchParams.get('facility') || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="離職刁E��" />
      
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
          {reports.map((report) => (
            <div
              key={report.id}
              onClick={() => {
                const url = selectedFacility 
                  ? `${report.path}?facility=${encodeURIComponent(selectedFacility)}`
                  : report.path;
                router.push(url);
              }}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
            >
              <div className={`h-2 bg-gradient-to-r ${report.gradient}`} />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{report.icon}</span>
                  <h3 className="text-xl font-semibold">{report.title}</h3>
                </div>
                <p className="text-gray-600">{report.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* アセスメントパターン */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-6">
            離職刁E��のアセスメントパターン
          </h3>
          
          <div className="space-y-6">
            {/* 1. 診断皁E��セスメンチE*/}
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-2">
                1. 診断皁E��セスメント（現状把握�E�E
              </h4>
              <div className="text-blue-800 mb-2">
                <span className="font-medium">推奨フロー�E�E/span>
                離職要因ランキング ↁE相関刁E�� ↁE部署別深掘り
              </div>
              <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
                <li>主要な離職要因を特宁E/li>
                <li>要因間�E相互関係を琁E��</li>
                <li>問題�E大きい部署を優先対忁E/li>
              </ul>
            </div>

            {/* 2. 予測皁E��セスメンチE*/}
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-2">
                2. 予測皁E��セスメント（リスク評価�E�E
              </h4>
              <div className="text-blue-800 mb-2">
                <span className="font-medium">推奨フロー�E�E/span>
                リスク予測 ↁE高リスク老E��宁EↁE個別対応計画
              </div>
              <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
                <li>AIによる離職確玁E��箁E/li>
                <li>リスクレベル別の刁E��E/li>
                <li>プロアクチE��ブな介�E</li>
              </ul>
            </div>

            {/* 3. 時系列アセスメンチE*/}
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-2">
                3. 時系列アセスメント（トレンド�E析！E
              </h4>
              <div className="text-blue-800 mb-2">
                <span className="font-medium">推奨フロー�E�E/span>
                時系列トレンチEↁE季節性把握 ↁE封E��予測
              </div>
              <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
                <li>離職玁E�E変化パターン認譁E/li>
                <li>繁忙期・年度末等�E影響評価</li>
                <li>中長期的な人員計画への反映</li>
              </ul>
            </div>

            {/* 4. 財務的アセスメンチE*/}
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-2">
                4. 財務的アセスメント（コスト�E析！E
              </h4>
              <div className="text-blue-800 mb-2">
                <span className="font-medium">推奨フロー�E�E/span>
                コスト影響刁E�� ↁEROI計箁EↁE投賁E��先頁E��E
              </div>
              <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
                <li>離職による損失額�E可視化</li>
                <li>施策�E費用対効果評価</li>
                <li>予算�E刁E�E最適匁E/li>
              </ul>
            </div>

            {/* 5. 定性皁E��セスメンチE*/}
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-2">
                5. 定性皁E��セスメント（声の刁E���E�E
              </h4>
              <div className="text-blue-800 mb-2">
                <span className="font-medium">推奨フロー�E�E/span>
                退職老E��ィードバチE�� ↁEセンチメント�E极EↁE改喁E��抽出
              </div>
              <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
                <li>退職琁E��の本質皁E��解</li>
                <li>絁E��文化�E課題発要E/li>
                <li>具体的な改喁E��クション</li>
              </ul>
            </div>

            {/* 6. 比輁E��アセスメンチE*/}
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-2">
                6. 比輁E��アセスメント（�Eンチ�Eーク�E�E
              </h4>
              <div className="text-blue-800 mb-2">
                <span className="font-medium">推奨フロー�E�E/span>
                業界比輁EↁEギャチE�E刁E�� ↁEベスト�EラクチE��ス導�E
              </div>
              <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
                <li>自絁E���Eポジション把握</li>
                <li>改喁E��地の定量匁E/li>
                <li>成功事例�E適用検訁E/li>
              </ul>
            </div>
          </div>
        </div>

        {/* 使ぁE��ガイチE*/}
        <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            離職刁E��の活用方況E
          </h3>
          <ul className="list-disc list-inside text-red-800 space-y-1">
            <li>高リスク老E��特定し、個別面諁E��フォローを実施できまぁE/li>
            <li>離職要因を把握し、絁E���E体�E改喁E��を立案できまぁE/li>
            <li>施策�E効果をシミュレーションし、最適な投賁E��断ができまぁE/li>
            <li>予防皁E��プローチにより、E��職コストを大幁E��削減できまぁE/li>
          </ul>
        </div>
      </div></div>
  );
}

export default function TurnoverPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TurnoverPageContent />
    </Suspense>
  );
}