'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import FacilitySelector from '@/components/reports/FacilitySelector';
const reports = [
  {
    id: 'risk-prediction',
    title: '離職リスク予測',
    path: '/reports/turnover/risk-prediction',
    description: 'AIを活用した個人別離職リスクの予測と早期警告',
    icon: '🎯',
    gradient: 'from-red-500 to-red-600'
  },
  {
    id: 'high-risk-dashboard',
    title: '高リスク者ダッシュボード',
    path: '/reports/turnover/high-risk-dashboard',
    description: '離職リスクの高い職員の一覧と詳細分析',
    icon: '⚠️',
    gradient: 'from-orange-500 to-orange-600'
  },
  {
    id: 'factor-ranking',
    title: '離職要因ランキング',
    path: '/reports/turnover/factor-ranking',
    description: '離職に影響する要因を重要度順にランキング',
    icon: '📊',
    gradient: 'from-purple-500 to-purple-600'
  },
  {
    id: 'correlation-analysis',
    title: '相関分析',
    path: '/reports/turnover/correlation-analysis',
    description: '離職と各種指標の相関関係を可視化',
    icon: '📈',
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    id: 'predictive-modeling',
    title: '予測モデリング',
    path: '/reports/turnover/predictive-modeling',
    description: '機械学習による高精度な離職予測モデル',
    icon: '🤖',
    gradient: 'from-indigo-500 to-indigo-600'
  },
  {
    id: 'what-if-simulation',
    title: 'What-ifシミュレーション',
    path: '/reports/turnover/what-if-simulation',
    description: '施策実施時の離職率変化をシミュレーション',
    icon: '🔮',
    gradient: 'from-pink-500 to-pink-600'
  },
  {
    id: 'retention-strategies',
    title: '定着戦略提案',
    path: '/reports/turnover/retention-strategies',
    description: '部署・職種別の効果的な定着施策を提案',
    icon: '💡',
    gradient: 'from-green-500 to-green-600'
  },
  {
    id: 'improvement-suggestions',
    title: '改善施策提案',
    path: '/reports/turnover/improvement-suggestions',
    description: 'データに基づく具体的な改善アクション',
    icon: '🎯',
    gradient: 'from-teal-500 to-teal-600'
  },
  {
    id: 'time-series-trend',
    title: '時系列トレンド分析',
    path: '/reports/turnover/time-series-trend',
    description: '離職率の時系列変化とトレンド予測',
    icon: '📈',
    gradient: 'from-cyan-500 to-cyan-600'
  },
  {
    id: 'cost-impact',
    title: '離職コスト影響分析',
    path: '/reports/turnover/cost-impact',
    description: '離職による財務的影響とROI分析',
    icon: '💰',
    gradient: 'from-amber-500 to-amber-600'
  },
  {
    id: 'exit-feedback',
    title: '退職者フィードバック分析',
    path: '/reports/turnover/exit-feedback',
    description: '退職者の声から課題を抽出',
    icon: '💭',
    gradient: 'from-violet-500 to-violet-600'
  },
  {
    id: 'benchmark-best-practices',
    title: 'ベンチマーク・ベストプラクティス',
    path: '/reports/turnover/benchmark-best-practices',
    description: '業界トップパフォーマーとの比較',
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* カテゴリヘッダー */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">📉</span>
            <h1 className="text-2xl font-bold text-gray-900">離職分析</h1>
          </div>
          <p className="text-gray-600">
            離職リスクの早期発見と予防策の立案を支援します。
            AIを活用した予測モデル、要因分析、シミュレーションなどにより、
            離職率の低減と組織の安定性向上を実現します。
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
            離職分析のアセスメントパターン
          </h3>
          
          <div className="space-y-6">
            {/* 1. 診断的アセスメント */}
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-2">
                1. 診断的アセスメント（現状把握）
              </h4>
              <div className="text-blue-800 mb-2">
                <span className="font-medium">推奨フロー：</span>
                離職要因ランキング → 相関分析 → 部署別深掘り
              </div>
              <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
                <li>主要な離職要因を特定</li>
                <li>要因間の相互関係を理解</li>
                <li>問題の大きい部署を優先対応</li>
              </ul>
            </div>

            {/* 2. 予測的アセスメント */}
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-2">
                2. 予測的アセスメント（リスク評価）
              </h4>
              <div className="text-blue-800 mb-2">
                <span className="font-medium">推奨フロー：</span>
                リスク予測 → 高リスク者特定 → 個別対応計画
              </div>
              <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
                <li>AIによる離職確率計算</li>
                <li>リスクレベル別の分類</li>
                <li>プロアクティブな介入</li>
              </ul>
            </div>

            {/* 3. 時系列アセスメント */}
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-2">
                3. 時系列アセスメント（トレンド分析）
              </h4>
              <div className="text-blue-800 mb-2">
                <span className="font-medium">推奨フロー：</span>
                時系列トレンド → 季節性把握 → 将来予測
              </div>
              <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
                <li>離職率の変化パターン認識</li>
                <li>繁忙期・年度末等の影響評価</li>
                <li>中長期的な人員計画への反映</li>
              </ul>
            </div>

            {/* 4. 財務的アセスメント */}
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-2">
                4. 財務的アセスメント（コスト分析）
              </h4>
              <div className="text-blue-800 mb-2">
                <span className="font-medium">推奨フロー：</span>
                コスト影響分析 → ROI計算 → 投資優先順位
              </div>
              <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
                <li>離職による損失額の可視化</li>
                <li>施策の費用対効果評価</li>
                <li>予算配分の最適化</li>
              </ul>
            </div>

            {/* 5. 定性的アセスメント */}
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-2">
                5. 定性的アセスメント（声の分析）
              </h4>
              <div className="text-blue-800 mb-2">
                <span className="font-medium">推奨フロー：</span>
                退職者フィードバック → センチメント分析 → 改善点抽出
              </div>
              <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
                <li>退職理由の本質的理解</li>
                <li>組織文化の課題発見</li>
                <li>具体的な改善アクション</li>
              </ul>
            </div>

            {/* 6. 比較的アセスメント */}
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-2">
                6. 比較的アセスメント（ベンチマーク）
              </h4>
              <div className="text-blue-800 mb-2">
                <span className="font-medium">推奨フロー：</span>
                業界比較 → ギャップ分析 → ベストプラクティス導入
              </div>
              <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
                <li>自組織のポジション把握</li>
                <li>改善余地の定量化</li>
                <li>成功事例の適用検討</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 使い方ガイド */}
        <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            離職分析の活用方法
          </h3>
          <ul className="list-disc list-inside text-red-800 space-y-1">
            <li>高リスク者を特定し、個別面談やフォローを実施できます</li>
            <li>離職要因を把握し、組織全体の改善策を立案できます</li>
            <li>施策の効果をシミュレーションし、最適な投資判断ができます</li>
            <li>予防的アプローチにより、離職コストを大幅に削減できます</li>
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