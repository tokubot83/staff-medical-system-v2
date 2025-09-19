'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import FacilitySelector from '@/components/reports/FacilitySelector';
import CategoryBackButton from '@/components/reports/CategoryBackButton';
import DataComment from '@/components/DataComment';
import { Bar, Radar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  ArcElement,
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
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// デモデータ生成
const generateFeedbackData = () => {
  return {
    exitReasons: {
      '給与・待遇': 35,
      'ワークライフバランス': 28,
      '人間関係': 22,
      'キャリア機会': 18,
      '業務負荷': 25,
      '組織文化': 15,
      '上司との関係': 20,
      'その他': 12
    },
    satisfactionScores: {
      '給与・福利厚生': 2.8,
      '労働環境': 3.2,
      'チームワーク': 3.8,
      '成長機会': 2.5,
      '経営方針': 3.0,
      '評価制度': 2.6,
      'コミュニケーション': 3.4
    },
    sentimentAnalysis: {
      positive: 25,
      neutral: 35,
      negative: 40
    },
    keyThemes: [
      { theme: '残業時間の長さ', frequency: 68, sentiment: -0.8 },
      { theme: '昇進機会の不足', frequency: 52, sentiment: -0.6 },
      { theme: '給与水準', frequency: 48, sentiment: -0.7 },
      { theme: 'チーム協力', frequency: 45, sentiment: 0.4 },
      { theme: '研修制度', frequency: 38, sentiment: 0.2 },
      { theme: '有給取得困難', frequency: 35, sentiment: -0.9 }
    ],
    departmentFeedback: {
      '看護部': { positive: 20, neutral: 30, negative: 50 },
      '医療技術部': { positive: 30, neutral: 40, negative: 30 },
      'リハビリ部': { positive: 35, neutral: 35, negative: 30 },
      '事務部': { positive: 25, neutral: 45, negative: 30 }
    },
    recommendations: [
      { category: '給与・待遇', action: '給与体系の見直し', priority: 'high', impact: 85 },
      { category: 'ワークライフバランス', action: 'フレックスタイム導入', priority: 'high', impact: 78 },
      { category: '人間関係', action: 'メンター制度強化', priority: 'medium', impact: 65 },
      { category: 'キャリア機会', action: 'キャリアパス明確化', priority: 'medium', impact: 70 }
    ]
  };
};

function ExitFeedbackContent() {
  const searchParams = useSearchParams();
  const selectedFacility = searchParams.get('facility') || '';
  const [feedbackData] = useState(generateFeedbackData());
  const [selectedView, setSelectedView] = useState('reasons');

  // 退職理由チャート
  const exitReasonsChart = {
    labels: Object.keys(feedbackData.exitReasons),
    datasets: [{
      label: '言及率 (%)',
      data: Object.values(feedbackData.exitReasons),
      backgroundColor: 'rgba(239, 68, 68, 0.6)',
      borderColor: 'rgb(239, 68, 68)',
      borderWidth: 1
    }]
  };

  // 満足度レーダーチャート
  const satisfactionRadarChart = {
    labels: Object.keys(feedbackData.satisfactionScores),
    datasets: [{
      label: '満足度スコア',
      data: Object.values(feedbackData.satisfactionScores),
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: 'rgb(59, 130, 246)',
      pointBackgroundColor: 'rgb(59, 130, 246)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(59, 130, 246)'
    }]
  };

  // センチメント分析チャート
  const sentimentChart = {
    labels: ['ポジティブ', 'ニュートラル', 'ネガティブ'],
    datasets: [{
      data: [
        feedbackData.sentimentAnalysis.positive,
        feedbackData.sentimentAnalysis.neutral,
        feedbackData.sentimentAnalysis.negative
      ],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(156, 163, 175, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderColor: [
        'rgb(34, 197, 94)',
        'rgb(156, 163, 175)',
        'rgb(239, 68, 68)'
      ],
      borderWidth: 2
    }]
  };

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.3) return 'text-green-600';
    if (sentiment < -0.3) return 'text-red-600';
    return 'text-gray-600';
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return styles[priority as keyof typeof styles] || styles.low;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">💭</span>
            <h1 className="text-2xl font-bold text-gray-900">退職者フィードバック分析</h1>
          </div>
          <p className="text-gray-600">
            退職者の声を分析し、組織の課題を明確化して改善につなげます。
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
          <div className="bg-blue-50 p-6 rounded-lg">
            <p className="text-sm text-gray-600">回答率</p>
            <p className="text-2xl font-bold text-blue-600">78%</p>
            <p className="text-xs text-gray-500">156/200名</p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg">
            <p className="text-sm text-gray-600">ネガティブ評価</p>
            <p className="text-2xl font-bold text-red-600">40%</p>
            <p className="text-xs text-gray-500">前年比 +5%</p>
          </div>
          <div className="bg-yellow-50 p-6 rounded-lg">
            <p className="text-sm text-gray-600">最多離職理由</p>
            <p className="text-lg font-bold text-yellow-600">給与・待遇</p>
            <p className="text-xs text-gray-500">35%が言及</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <p className="text-sm text-gray-600">改善可能性</p>
            <p className="text-2xl font-bold text-green-600">65%</p>
            <p className="text-xs text-gray-500">対策により防止可能</p>
          </div>
        </div>

        {/* ビュー選択タブ */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex space-x-4">
            {[
              { id: 'reasons', label: '退職理由' },
              { id: 'satisfaction', label: '満足度分析' },
              { id: 'themes', label: 'キーテーマ' },
              { id: 'recommendations', label: '改善提案' }
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
        {selectedView === 'reasons' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">退職理由の分布</h3>
              <Bar data={exitReasonsChart} options={{
                indexAxis: 'y',
                plugins: {
                  legend: { display: false }
                }
              }} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">センチメント分析</h3>
                <Doughnut data={sentimentChart} />
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">代表的なコメント</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-red-500 pl-4">
                    <p className="text-sm text-gray-600 italic">&ldquo;残業が多く、家族との時間が取れない&rdquo;</p>
                    <p className="text-xs text-gray-500 mt-1">看護部・30代</p>
                  </div>
                  <div className="border-l-4 border-red-500 pl-4">
                    <p className="text-sm text-gray-600 italic">&ldquo;給与が他院と比較して低い&rdquo;</p>
                    <p className="text-xs text-gray-500 mt-1">医療技術部・20代</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <p className="text-sm text-gray-600 italic">&ldquo;同僚との関係は良好だった&rdquo;</p>
                    <p className="text-xs text-gray-500 mt-1">リハビリ部・40代</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedView === 'satisfaction' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">満足度スコア（5点満点）</h3>
              <div className="max-w-2xl mx-auto">
                <Radar data={satisfactionRadarChart} options={{
                  scales: {
                    r: {
                      beginAtZero: true,
                      max: 5,
                      ticks: { stepSize: 1 }
                    }
                  }
                }} />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">項目</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">スコア</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">前年比</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">業界平均</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(feedbackData.satisfactionScores).map(([item, score]) => (
                    <tr key={item}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={score < 3 ? 'text-red-600 font-semibold' : ''}>{score.toFixed(1)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {score < 3 ? '↓ -0.2' : '↑ +0.1'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3.5</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedView === 'themes' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">テーマ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">言及頻度</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">センチメント</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">影響度</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {feedbackData.keyThemes.map((theme, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{theme.theme}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{theme.frequency}回</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={getSentimentColor(theme.sentiment)}>
                        {theme.sentiment > 0 ? '😊' : theme.sentiment < 0 ? '😔' : '😐'} {theme.sentiment.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-600 h-2 rounded-full" 
                          style={{ width: `${Math.abs(theme.sentiment) * theme.frequency / 68 * 100}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedView === 'recommendations' && (
          <div className="space-y-6">
            {feedbackData.recommendations.map((rec, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold">{rec.action}</h4>
                    <p className="text-sm text-gray-600">{rec.category}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityBadge(rec.priority)}`}>
                    {rec.priority === 'high' ? '高' : rec.priority === 'medium' ? '中' : '低'}優先度
                  </span>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">予想される効果</p>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-600 h-3 rounded-full" 
                      style={{ width: `${rec.impact}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{rec.impact}%の離職防止効果</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <DataComment
          comment="給与・待遇とワークライフバランスが主要な離職要因です。これらの改善により65%の離職を防止できる可能性があります。"
          details={[
            '退職者の40%がネガティブな印象を持っている',
            '給与・福利厚生の満足度が業界平均を大きく下回る',
            '残業時間の改善が最も効果的な対策と予測される'
          ]}
        />
      </div><CategoryBackButton /></div>
  );
}

export default function ExitFeedbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExitFeedbackContent />
    </Suspense>
  );
}