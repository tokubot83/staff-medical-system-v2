'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import BreadcrumbBar from '@/components/navigation/BreadcrumbBar';
import FacilitySelector from '@/components/reports/FacilitySelector';
import CategoryBackButton from '@/components/reports/CategoryBackButton';
import DataComment from '@/components/DataComment';
import { Radar, Scatter, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// デモデータ生成
const generateFactorData = () => {
  return {
    categories: [
      {
        name: '職場環境',
        factors: [
          { name: '人間関係', impact: 85, satisfaction: 3.2 },
          { name: 'チームワーク', impact: 78, satisfaction: 3.8 },
          { name: '上司のサポート', impact: 82, satisfaction: 3.5 },
          { name: '職場の雰囲気', impact: 70, satisfaction: 3.9 }
        ]
      },
      {
        name: '待遇・条件',
        factors: [
          { name: '給与水準', impact: 88, satisfaction: 2.8 },
          { name: '昇進機会', impact: 75, satisfaction: 2.5 },
          { name: '福利厚生', impact: 65, satisfaction: 3.4 },
          { name: '休暇取得', impact: 72, satisfaction: 3.0 }
        ]
      },
      {
        name: '成長・キャリア',
        factors: [
          { name: '研修機会', impact: 68, satisfaction: 3.6 },
          { name: 'スキル向上', impact: 73, satisfaction: 3.7 },
          { name: 'キャリアパス', impact: 80, satisfaction: 2.9 },
          { name: '専門性向上', impact: 71, satisfaction: 3.8 }
        ]
      },
      {
        name: 'ワークライフバランス',
        factors: [
          { name: '労働時間', impact: 83, satisfaction: 2.6 },
          { name: '残業頻度', impact: 79, satisfaction: 2.4 },
          { name: '有給消化率', impact: 70, satisfaction: 2.8 },
          { name: 'プライベート時間', impact: 77, satisfaction: 2.7 }
        ]
      }
    ],
    correlations: [
      { factor1: '給与水準', factor2: '昇進機会', strength: 0.72 },
      { factor1: '人間関係', factor2: 'チームワーク', strength: 0.85 },
      { factor1: '労働時間', factor2: '残業頻度', strength: 0.91 },
      { factor1: '上司のサポート', factor2: '職場の雰囲気', strength: 0.68 }
    ],
    priorityMatrix: [
      { factor: '給与水準', importance: 88, urgency: 85, category: '職場環境' },
      { factor: '労働時間', importance: 83, urgency: 82, category: 'ワークライフバランス' },
      { factor: '人間関係', importance: 85, urgency: 75, category: '職場環境' },
      { factor: 'キャリアパス', importance: 80, urgency: 70, category: '成長・キャリア' },
      { factor: '上司のサポート', importance: 82, urgency: 78, category: '職場環境' }
    ]
  };
};

function FactorMappingContent() {
  const searchParams = useSearchParams();
  const selectedFacility = searchParams.get('facility') || '';
  const [factorData] = useState(generateFactorData());
  const [selectedView, setSelectedView] = useState('overview');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // レーダーチャートデータ
  const radarData = {
    labels: factorData.categories.map(cat => cat.name),
    datasets: [
      {
        label: '影響度',
        data: factorData.categories.map(cat => 
          cat.factors.reduce((sum, f) => sum + f.impact, 0) / cat.factors.length
        ),
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderColor: 'rgb(239, 68, 68)',
        pointBackgroundColor: 'rgb(239, 68, 68)'
      },
      {
        label: '満足度',
        data: factorData.categories.map(cat => 
          cat.factors.reduce((sum, f) => sum + f.satisfaction * 20, 0) / cat.factors.length
        ),
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgb(59, 130, 246)',
        pointBackgroundColor: 'rgb(59, 130, 246)'
      }
    ]
  };

  // 優先度マトリックスデータ
  const scatterData = {
    datasets: factorData.categories.map((cat, i) => ({
      label: cat.name,
      data: factorData.priorityMatrix
        .filter(item => item.category === cat.name || selectedCategory === 'all')
        .map(item => ({ x: item.urgency, y: item.importance, label: item.factor })),
      backgroundColor: [
        'rgba(239, 68, 68, 0.6)',
        'rgba(59, 130, 246, 0.6)',
        'rgba(34, 197, 94, 0.6)',
        'rgba(168, 85, 247, 0.6)'
      ][i],
      pointRadius: 8
    }))
  };

  // 影響度ランキングデータ
  const allFactors = factorData.categories.flatMap(cat => 
    cat.factors.map(f => ({ ...f, category: cat.name }))
  ).sort((a, b) => b.impact - a.impact);

  const barData = {
    labels: allFactors.slice(0, 10).map(f => f.name),
    datasets: [
      {
        label: '影響度スコア',
        data: allFactors.slice(0, 10).map(f => f.impact),
        backgroundColor: allFactors.slice(0, 10).map(f => {
          const colors: { [key: string]: string } = {
            '職場環境': 'rgba(239, 68, 68, 0.6)',
            '待遇・条件': 'rgba(59, 130, 246, 0.6)',
            '成長・キャリア': 'rgba(34, 197, 94, 0.6)',
            'ワークライフバランス': 'rgba(168, 85, 247, 0.6)'
          };
          return colors[f.category] || 'rgba(156, 163, 175, 0.6)';
        })
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BreadcrumbBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🗺️</span>
            <h1 className="text-2xl font-bold text-gray-900">定着要因マッピング</h1>
          </div>
          <p className="text-gray-600">
            職員の定着に影響する要因を網羅的に分析し、改善優先度を可視化します。
          </p>
        </div>

        <div className="mb-8">
          <FacilitySelector
            selectedFacility={selectedFacility}
            onFacilityChange={() => {}}
          />
        </div>

        {/* ビュー選択タブ */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex space-x-4">
            {[
              { id: 'overview', label: '総合分析' },
              { id: 'priority', label: '優先度マトリックス' },
              { id: 'ranking', label: '影響度ランキング' },
              { id: 'correlation', label: '相関分析' }
            ].map(view => (
              <button
                key={view.id}
                onClick={() => setSelectedView(view.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedView === view.id
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {view.label}
              </button>
            ))}
          </div>
        </div>

        {/* メインコンテンツ */}
        {selectedView === 'overview' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">カテゴリ別影響度・満足度分析</h3>
              <div className="max-w-2xl mx-auto">
                <Radar data={radarData} options={{
                  scales: {
                    r: {
                      beginAtZero: true,
                      max: 100
                    }
                  }
                }} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {factorData.categories.map((category, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6">
                  <h4 className="font-semibold mb-4">{category.name}</h4>
                  <div className="space-y-3">
                    {category.factors.map((factor, j) => (
                      <div key={j} className="flex items-center justify-between">
                        <span className="text-sm">{factor.name}</span>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-xs text-gray-500">影響度</p>
                            <p className="font-semibold">{factor.impact}%</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">満足度</p>
                            <p className="font-semibold">{factor.satisfaction.toFixed(1)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedView === 'priority' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">優先度マトリックス</h3>
            <div className="mb-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="all">全カテゴリ</option>
                {factorData.categories.map(cat => (
                  <option key={cat.name} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="aspect-square max-w-3xl mx-auto">
              <Scatter data={scatterData} options={{
                scales: {
                  x: {
                    title: { display: true, text: '緊急度' },
                    min: 50,
                    max: 100
                  },
                  y: {
                    title: { display: true, text: '重要度' },
                    min: 50,
                    max: 100
                  }
                },
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const point = context.raw as any;
                        return `${point.label}: 緊急度${point.x}, 重要度${point.y}`;
                      }
                    }
                  }
                }
              }} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="bg-red-50 p-3 rounded">
                <p className="font-semibold text-red-700">第1象限：最優先対応</p>
                <p className="text-red-600">重要度・緊急度ともに高い</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded">
                <p className="font-semibold text-yellow-700">第2象限：計画的対応</p>
                <p className="text-yellow-600">重要度高・緊急度低</p>
              </div>
            </div>
          </div>
        )}

        {selectedView === 'ranking' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">影響度TOP10要因</h3>
            <Bar data={barData} options={{
              indexAxis: 'y',
              scales: {
                x: {
                  beginAtZero: true,
                  max: 100
                }
              }
            }} />
          </div>
        )}

        {selectedView === 'correlation' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">要因間の相関関係</h3>
            <div className="space-y-4">
              {factorData.correlations.map((corr, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{corr.factor1}</span>
                      <span className="text-gray-400">↔</span>
                      <span className="font-medium">{corr.factor2}</span>
                    </div>
                    <span className="font-semibold text-lg">{(corr.strength * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-600 h-3 rounded-full"
                      style={{ width: `${corr.strength * 100}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    これらの要因は強い相関関係にあり、一方の改善が他方にも好影響を与えます
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <DataComment
          comment="給与水準と労働時間が最も影響度の高い要因です。これらの改善により定着率を大幅に向上できる可能性があります。"
          details={[
            '職場環境カテゴリの満足度が相対的に高い',
            'ワークライフバランスの改善が急務',
            '給与と昇進機会の相関が高く、セットでの改善が効果的'
          ]}
        />
      </div><CategoryBackButton /></div>
  );
}

export default function FactorMappingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FactorMappingContent />
    </Suspense>
  );
}