'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import FacilitySelector from '@/components/reports/FacilitySelector';
import CategoryBackButton from '@/components/reports/CategoryBackButton';
import DataComment from '@/components/DataComment';
import { Bar, Radar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// デモデータ生成
const generateBenchmarkData = () => {
  return {
    industryComparison: {
      facilities: ['自施設', '業界平均', 'トップ10%', '地域平均', '同規模平均'],
      turnoverRates: [8.7, 10.2, 5.8, 9.5, 9.8],
      voluntaryRates: [6.2, 7.8, 4.2, 7.0, 7.2],
      firstYearRates: [15.2, 18.5, 10.5, 16.8, 17.2]
    },
    departmentBenchmark: {
      '看護部': { self: 11.2, industry: 12.5, best: 7.8 },
      '医療技術部': { self: 7.8, industry: 8.5, best: 5.2 },
      'リハビリ部': { self: 8.5, industry: 9.0, best: 6.0 },
      '事務部': { self: 6.5, industry: 7.2, best: 4.5 }
    },
    bestPractices: [
      {
        hospital: '東京優良病院',
        turnoverRate: 4.5,
        practices: ['メンター制度', 'フレックスタイム', 'キャリア開発支援'],
        impact: -45
      },
      {
        hospital: '大阪総合医療センター',
        turnoverRate: 5.2,
        practices: ['給与体系改革', 'ワークライフバランス推進', 'チーム医療強化'],
        impact: -38
      },
      {
        hospital: '名古屋中央病院',
        turnoverRate: 5.8,
        practices: ['評価制度見直し', '研修プログラム充実', '福利厚生拡充'],
        impact: -32
      }
    ],
    performanceMetrics: {
      labels: ['離職率', '定着率', '採用効率', '従業員満足度', '生産性', '研修充実度'],
      self: [7.5, 6.8, 5.5, 6.0, 7.0, 5.8],
      topPerformers: [9.2, 9.0, 8.5, 8.8, 9.0, 9.2]
    },
    interventionSuccess: [
      { name: 'メンター制度導入', successRate: 85, avgReduction: 3.2 },
      { name: '給与体系見直し', successRate: 78, avgReduction: 2.8 },
      { name: 'フレックスタイム', successRate: 72, avgReduction: 2.5 },
      { name: 'キャリアパス明確化', successRate: 68, avgReduction: 2.2 },
      { name: '研修プログラム拡充', successRate: 65, avgReduction: 2.0 }
    ]
  };
};

function BenchmarkBestPracticesContent() {
  const searchParams = useSearchParams();
  const selectedFacility = searchParams.get('facility') || '';
  const [benchmarkData] = useState(generateBenchmarkData());
  const [selectedView, setSelectedView] = useState('comparison');

  // 業界比較チャート
  const industryComparisonChart = {
    labels: benchmarkData.industryComparison.facilities,
    datasets: [
      {
        label: '全体離職率 (%)',
        data: benchmarkData.industryComparison.turnoverRates,
        backgroundColor: 'rgba(239, 68, 68, 0.6)'
      },
      {
        label: '自発的離職率 (%)',
        data: benchmarkData.industryComparison.voluntaryRates,
        backgroundColor: 'rgba(59, 130, 246, 0.6)'
      },
      {
        label: '1年目離職率 (%)',
        data: benchmarkData.industryComparison.firstYearRates,
        backgroundColor: 'rgba(245, 158, 11, 0.6)'
      }
    ]
  };

  // パフォーマンスレーダーチャート
  const performanceRadarChart = {
    labels: benchmarkData.performanceMetrics.labels,
    datasets: [
      {
        label: '自施設',
        data: benchmarkData.performanceMetrics.self,
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderColor: 'rgb(239, 68, 68)',
        pointBackgroundColor: 'rgb(239, 68, 68)'
      },
      {
        label: 'トップパフォーマー',
        data: benchmarkData.performanceMetrics.topPerformers,
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgb(34, 197, 94)',
        pointBackgroundColor: 'rgb(34, 197, 94)'
      }
    ]
  };

  // 部署別ベンチマークチャート
  const departmentBenchmarkChart = {
    labels: Object.keys(benchmarkData.departmentBenchmark),
    datasets: [
      {
        label: '自施設',
        data: Object.values(benchmarkData.departmentBenchmark).map(d => d.self),
        backgroundColor: 'rgba(239, 68, 68, 0.6)'
      },
      {
        label: '業界平均',
        data: Object.values(benchmarkData.departmentBenchmark).map(d => d.industry),
        backgroundColor: 'rgba(156, 163, 175, 0.6)'
      },
      {
        label: 'ベストプラクティス',
        data: Object.values(benchmarkData.departmentBenchmark).map(d => d.best),
        backgroundColor: 'rgba(34, 197, 94, 0.6)'
      }
    ]
  };

  const getImpactBadge = (impact: number) => {
    if (impact <= -40) return 'bg-green-100 text-green-800';
    if (impact <= -30) return 'bg-blue-100 text-blue-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🏆</span>
            <h1 className="text-2xl font-bold text-gray-900">ベンチマーク・ベストプラクティス</h1>
          </div>
          <p className="text-gray-600">
            業界のトップパフォーマーと比較し、効果的な施策を学びます。
          </p>
        </div>

        <div className="mb-8">
          <FacilitySelector
            selectedFacility={selectedFacility}
            onFacilityChange={() => {}}
          />
        </div>

        {/* サマリーカード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-red-50 p-6 rounded-lg">
            <p className="text-sm text-gray-600">業界順位</p>
            <p className="text-2xl font-bold text-red-600">68位/150</p>
            <p className="text-xs text-gray-500">中位グループ</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg">
            <p className="text-sm text-gray-600">トップとの差</p>
            <p className="text-2xl font-bold text-blue-600">2.9%</p>
            <p className="text-xs text-gray-500">離職率の差</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <p className="text-sm text-gray-600">改善余地</p>
            <p className="text-2xl font-bold text-green-600">33%</p>
            <p className="text-xs text-gray-500">削減可能</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg">
            <p className="text-sm text-gray-600">推奨施策数</p>
            <p className="text-2xl font-bold text-purple-600">5つ</p>
            <p className="text-xs text-gray-500">高効果施策</p>
          </div>
        </div>

        {/* ビュー選択タブ */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex space-x-4">
            {[
              { id: 'comparison', label: '業界比較' },
              { id: 'performance', label: 'パフォーマンス分析' },
              { id: 'best-practices', label: 'ベストプラクティス' },
              { id: 'interventions', label: '施策効果' }
            ].map(view => (
              <button
                key={view.id}
                onClick={() => setSelectedView(view.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedView === view.id
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {view.label}
              </button>
            ))}
          </div>
        </div>

        {/* メインコンテンツ */}
        {selectedView === 'comparison' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">業界ベンチマーク</h3>
              <Bar data={industryComparisonChart} />
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">部署別ベンチマーク</h3>
              <Bar data={departmentBenchmarkChart} />
            </div>
          </div>
        )}

        {selectedView === 'performance' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">総合パフォーマンス比較</h3>
              <div className="max-w-2xl mx-auto">
                <Radar data={performanceRadarChart} options={{
                  scales: {
                    r: {
                      beginAtZero: true,
                      max: 10,
                      ticks: { stepSize: 2 }
                    }
                  }
                }} />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="font-semibold mb-4">強み（業界平均以上）</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>生産性：業界平均を10%上回る</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>定着率：3年目以降は安定</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="font-semibold mb-4">改善機会（業界平均以下）</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-red-500">✗</span>
                    <span>採用効率：平均より20%低い</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-red-500">✗</span>
                    <span>研修充実度：投資不足</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {selectedView === 'best-practices' && (
          <div className="space-y-6">
            {benchmarkData.bestPractices.map((practice, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold">{practice.hospital}</h4>
                    <p className="text-sm text-gray-600">離職率: {practice.turnoverRate}%</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getImpactBadge(practice.impact)}`}>
                    {practice.impact}% 削減
                  </span>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">実施施策:</p>
                  <div className="flex flex-wrap gap-2">
                    {practice.practices.map((p, j) => (
                      <span key={j} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">成功要因：</span>
                    経営層のコミットメント、段階的な導入、従業員フィードバックの活用
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedView === 'interventions' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">施策</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">成功率</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">平均削減率</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">推奨度</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {benchmarkData.interventionSuccess.map((intervention, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {intervention.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {intervention.successRate}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        -{intervention.avgReduction}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex">
                          {[...Array(5)].map((_, j) => (
                            <span key={j} className={j < Math.ceil(intervention.successRate / 20) ? 'text-yellow-400' : 'text-gray-300'}>
                              ★
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-900 mb-2">推奨実施順序</h4>
              <ol className="list-decimal list-inside text-blue-800 space-y-1">
                <li>メンター制度導入（3ヶ月以内）</li>
                <li>給与体系の競争力強化（6ヶ月以内）</li>
                <li>フレックスタイム制度検討（9ヶ月以内）</li>
                <li>キャリアパス明確化（12ヶ月以内）</li>
              </ol>
            </div>
          </div>
        )}

        <DataComment
          comment="トップパフォーマーとの主な差は「採用効率」と「研修充実度」にあります。メンター制度の導入が最も効果的です。"
          details={[
            'メンター制度導入により新人離職率を45%削減した事例あり',
            '給与体系見直しは初期投資が必要だが、ROIが最も高い',
            '段階的な施策導入により、1年で業界平均まで改善可能'
          ]}
        />
      </div><CategoryBackButton /></div>
  );
}

export default function BenchmarkBestPracticesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BenchmarkBestPracticesContent />
    </Suspense>
  );
}